import { _decorator, Animation, AnimationClip, CCFloat, Component, Node, resources, Sprite, SpriteFrame, sys, Vec3 } from "cc";
const { ccclass, property, executeInEditMode } = _decorator;

/**
 * 帧事件配置类（编辑器可配置）
 */
@ccclass('FrameEventConfig')
export class FrameEventConfig {
    @property
    frameIndex: number = 0; // 触发的帧索引（从0开始）

    @property
    eventName: string = 'FrameEvent1'; // 事件名称
}


/**
 * 动画播放配置接口
 */
export interface AnimationPlayConfig {
    /** 默认播放第0个动画 */
    name?: string;
    loop?: boolean;
    fps?: number;
    timeScale?: number;
    /** 是否启用插帧, 该参数不生效, 对应数值已屏蔽, 只做兼容性处理 */
    enableFrameHold?: boolean;
    /** 完成回调, loop = false 才会触发 */
    onComplete?: () => void;
    /** 代码动态添加的帧事件 */
    frameEvents?: { frameIndex: number; callback: () => void }[];
}

/**
 * 帧处理结果类型
 */
export type FrameProcessResult = {
    /**精灵帧资源数组 */
    frames: SpriteFrame[];
    /**是否启用了插帧 */
    isFrameHoldEnabled: boolean;
    /**持续帧数（用于帧事件映射） */
    holdDuration: number;
}

/**
 * AnimationCtrl 重构版
 * 
 * 功能特性：
 * 1. 支持两种动画模式：
 *    - playManual: update手动切帧模式（不需要Animation组件）
 *    - playClip: AnimationClip模式（使用Animation组件）
 * 2. 帧事件系统：
 *    - 编辑器配置：通过frameEvents属性配置
 *    - 代码配置：通过play方法的frameEvents参数配置
 * 3. 链式API：支持 setParent().setScale().playClip() 风格
 * 4. 节点配置内聚：所有节点操作在组件内部完成
 */
@ccclass('AnimationCtrl')
@executeInEditMode(true)
export class AnimationCtrl extends Component {
    // ========== 编辑器配置参数 ==========
    @property({ type: Node, displayName: '图片精灵节点', tooltip: '动画图片精灵节点的节点' })
    spriteNode: Node = null!;

    @property([SpriteFrame])
    spriteFrames: SpriteFrame[] = []; // 图集帧资源

    @property([FrameEventConfig])
    frameEvents: FrameEventConfig[] = []; // 编辑器配置的帧事件
    @property
    playOnAwake: boolean = false;
    @property
    Loop: boolean = false;
    defaultFPS: number = 60; // 默认帧率

    @property({
        tooltip: '帧持续: 每帧重复显示的次数(1=正常, 2=每帧显示2次, 3=每帧显示3次)\n用于性能优化: 低性能设备禁用插帧, 高性能设备启用插帧', visible: false
    })
    frameHoldDuration: number = 1; // 帧持续时长（编辑器配置）
    @property({ type: CCFloat, displayName: "每帧之间的间隔" })
    frameInterval = 0.05;
    // NOTE: 只有一种情况不执行update, 就是编辑器模式下, 且viewInEditor为false
    public get editorView() {
        return (sys.platform == "EDITOR_PAGE" && !this.viewInEditor);
    }

    @property
    viewInEditor: Boolean = false;
    // ========== 内部状态 ==========

    private ani: Animation = null;
    /**图片精灵节点 */
    private sprite: Sprite = null;
    /**当前帧动画资源 */
    private curSpriteFrames: SpriteFrame[] = [];
    // update模式状态
    private isPlayingManual: boolean = false;
    private timeAccumulator: number = 0;
    private currentFrameIndex: number = 0;
    private currentFPS: number = 60;
    private currentLoop: boolean = false;
    private manualCompleteCallback: () => void = null;
    private activeFrameEvents: Map<number, (() => void)[]> = new Map(); // 当前激活的帧事件
    private triggeredEvents: Set<number> = new Set(); // 已触发的事件（防止重复触发）

    protected onLoad() {
        // 尝试获取Sprite组件（用于update模式）
        if (!this.sprite) {
            this.sprite = this.spriteNode.getComponent(Sprite) || this.spriteNode.addComponent(Sprite);
        }
        //一定在根节点
        this.ani = this.node.getComponent(Animation);
    }
    protected onEnable(): void {
        //FIXME: 逻辑混乱 整体动画播放需要一个简单的方式,  代码过于复杂化了, 需求很简单, 不需要各种复杂功能
        if (this.playOnAwake) {
            // 智能检测第一个可用的动画名称
            this.play({
                loop: this.Loop,
                // playOnAwake 模式下不执行 onComplete 回调（外部负责回收）
                onComplete: null
            });
        }
    }


    /**
     * 设置帧资源（运行时动态赋值）
     */
    setFrames(frames: SpriteFrame[]) {
        this.spriteFrames = frames;
    }

    /**
     * 根据持续帧数扩展帧资源（插帧模式）
     * @param holdDuration 每帧重复次数（1=正常, 2=每帧重复2次, 3=每帧重复3次）
     * @returns 扩展后的帧数组
     */
    private getExpandedFrames(holdDuration: number): SpriteFrame[] {
        if (holdDuration <= 1) {
            return this.spriteFrames;
        }
        return this.spriteFrames.flatMap(frame => Array(holdDuration).fill(frame));
    }

    /**
     * 根据配置处理帧资源（统一入口）
     * @param enableFrameHold 是否启用插帧
     * @returns 处理后的帧数组和映射信息
     */
    private processFrames(enableFrameHold: boolean): FrameProcessResult {
        // 根据enableFrameHold决定是否使用编辑器配置的frameHoldDuration
        const shouldExpand = enableFrameHold && this.frameHoldDuration > 1;

        if (shouldExpand) {
            return {
                frames: this.getExpandedFrames(this.frameHoldDuration),
                isFrameHoldEnabled: true,
                holdDuration: this.frameHoldDuration
            };
        } else {
            return {
                frames: this.spriteFrames,
                isFrameHoldEnabled: false,
                holdDuration: 1
            };
        }
    }

    // ========== 统一播放接口 ==========
    /**  
     * 播放动画（统一接口）
     * @param config 播放配置
     */
    play(config: AnimationPlayConfig = {}) {
        if (this.ani) {
            this.playExistingAnimation(config);
        } else {
            this.playManual(config);
        }
    }

    /**
     * 停止动画播放
     */
    stop() {
        this.stopManual();
        this.stopClip();
        return;
    }

    /**
     * 重置组件状态（对象池回收前调用）
     * 清理运行时状态，保留编辑器配置
     */
    reset() {
        // 停止所有播放
        this.stop();
        // 清理手动播放状态
        this.timeAccumulator = 0;
        this.currentFrameIndex = 0;
        this.activeFrameEvents.clear();
        this.triggeredEvents.clear();
        this.manualCompleteCallback = null;
        this.curSpriteFrames = []; // 清理扩展后的帧数组
        return;
    }

    // ========== 内部播放逻辑 ==========

    /**
     * 确保节点激活
     */
    private ensureNodeActive(): void {
        if (!this.node.active) {
            this.node.active = true;
        }
    }
    /**
     * 注册动画完成回调
     */
    private registerCompleteCallback(loop: boolean, callback: () => void): void {
        if (!loop && callback) {
            this.reset();
            this.ani.once(Animation.EventType.FINISHED, callback);
        }
    }
    /**
     * 直接使用Animation组件播放（复杂动画）
     * 使用根节点this.node上的Animation组件，适合控制多个子Sprite的复杂动画
     */
    private playExistingAnimation(config: AnimationPlayConfig) {
        const { name = "", loop = false, timeScale = 1, onComplete = null } = config;
        let clip: AnimationClip = null;
        if (name) {
            clip = this.ani.clips.find(c => c.name === name);
        } else {
            clip = this.ani.clips[0]
        }
        // 检查Clip是否存在
        if (!clip) {
            console.error(
                `[AnimationCtrl] Animation组件中不存在名为 "${name}" 的Clip\n` +
                `可用的Clips: ${this.ani.clips.map(c => c.name).join(', ') || '无'}`
            );
            return;
        }

        // 激活节点
        this.ensureNodeActive();
        // 设置倍速和循环模式并播放
        let animStates = this.ani.getState(clip.name);
        animStates.wrapMode = loop ? AnimationClip.WrapMode.Loop : AnimationClip.WrapMode.Normal;
        animStates.speed = timeScale;
        this.registerCompleteCallback(loop, onComplete);
        animStates.play();
    }

    // ========== 播放模式1：update手动切帧 ==========

    /**
     * 使用update方式手动切换帧播放动画（内部方法，建议使用 play() 统一接口）
     */
    private playManual(config: AnimationPlayConfig = {}) {
        const { loop = false, onComplete = null, frameEvents = [], enableFrameHold = true } = config;

        // 验证帧资源
        if (this.spriteFrames.length === 0) {
            console.warn(`[AnimationCtrl] playManual: 没有找到帧资源`);
            return this;
        }

        // 处理帧资源（根据enableFrameHold决定是否启用插帧）
        const { frames: displayFrames, isFrameHoldEnabled, holdDuration } = this.processFrames(enableFrameHold);
        if (displayFrames.length === 0) {
            console.warn(`[AnimationCtrl] playManual: 处理后没有可用帧`);
            return;
        }

        // 使用curSpriteFrames存储扩展后的帧数组，保持spriteFrames不变
        this.curSpriteFrames = displayFrames;
        // 合并并注册帧事件
        this.setupManualFrameEvents(frameEvents, isFrameHoldEnabled, holdDuration);
        // 激活节点并初始化状态
        this.ensureNodeActive();
        this.initManualPlayState(loop, () => {
            this.reset();
            onComplete?.();
        });
        // 显示第一帧
        if (this.sprite && displayFrames[0]) {
            this.sprite.spriteFrame = displayFrames[0];
        }
        return;
    }

    /**
     * 初始化手动播放状态
     */
    private initManualPlayState(loop: boolean, callback: () => void): void {
        this.isPlayingManual = true;
        this.timeAccumulator = 0;
        this.currentFrameIndex = 0;
        this.currentLoop = loop;
        this.manualCompleteCallback = callback;
        this.triggeredEvents.clear();
    }

    /**
     * 设置手动模式的帧事件
     * @param dynamicEvents 动态帧事件配置
     * @param isFrameHoldEnabled 是否启用了插帧
     * @param holdDuration 持续帧数
     */
    private setupManualFrameEvents(
        dynamicEvents: { frameIndex: number; callback: () => void }[],
        isFrameHoldEnabled: boolean,
        holdDuration: number
    ): void {
        this.activeFrameEvents.clear();

        // 注册编辑器配置的帧事件
        this.frameEvents.forEach(evt => {
            const mappedIndex = this.mapFrameIndex(evt.frameIndex, isFrameHoldEnabled, holdDuration);
            this.addFrameEventCallback(mappedIndex, () => this.node.emit(evt.eventName));
        });

        // 注册代码动态配置的帧事件
        dynamicEvents.forEach(evt => {
            const mappedIndex = this.mapFrameIndex(evt.frameIndex, isFrameHoldEnabled, holdDuration);
            this.addFrameEventCallback(mappedIndex, evt.callback);
        });
    }

    /**
     * 映射帧索引
     * @param originalIndex 原始帧索引
     * @param isFrameHoldEnabled 是否启用了插帧
     * @param holdDuration 持续帧数
     * @returns 映射后的帧索引
     */
    private mapFrameIndex(
        originalIndex: number,
        isFrameHoldEnabled: boolean,
        holdDuration: number
    ): number {
        if (isFrameHoldEnabled) {
            // 插帧模式：原始第n帧 → 扩展后第 n*holdDuration 帧
            return originalIndex * holdDuration;
        }
        // 不插帧：索引不变
        return originalIndex;
    }

    /**
     * 添加帧事件回调
     */
    private addFrameEventCallback(frameIndex: number, callback: () => void): void {
        if (!this.activeFrameEvents.has(frameIndex)) {
            this.activeFrameEvents.set(frameIndex, []);
        }
        this.activeFrameEvents.get(frameIndex).push(callback);
    }

    /**
     * 停止手动播放
     */
    stopManual() {
        this.isPlayingManual = false;
        this.timeAccumulator = 0;
        this.currentFrameIndex = 0;
        this.activeFrameEvents.clear();
        this.triggeredEvents.clear();
        this.curSpriteFrames = []; // 清理扩展后的帧数组
    }

    // ========== 播放模式B：AnimationClip ==========

    /**
     * 使用AnimationClip方式播放动画（内部方法，建议使用 play() 统一接口）
     * @param animName 动画名称
     * @param config 播放配置
     */
    private playClip(config: AnimationPlayConfig = {}) {
        const { name = "", loop = false, fps = this.defaultFPS, timeScale = 1, onComplete = null, frameEvents = [], enableFrameHold = true } = config;

        // 验证帧资源
        if (this.spriteFrames.length === 0) {
            console.warn(`[AnimationCtrl] playClip: 没有找到帧资源`);
            return this;
        }

        // 处理帧资源（根据enableFrameHold决定是否启用插帧）
        const { frames: displayFrames, isFrameHoldEnabled, holdDuration } = this.processFrames(enableFrameHold);
        if (displayFrames.length === 0) {
            console.warn(`[AnimationCtrl] playClip: 处理后没有可用帧`);
            return this;
        }

        // 激活节点
        this.ensureNodeActive();

        // 创建并配置Clip
        const clip = this.createClipWithEvents(name, displayFrames, fps, frameEvents, isFrameHoldEnabled, holdDuration);
        clip.wrapMode = loop ? AnimationClip.WrapMode.Loop : AnimationClip.WrapMode.Normal;
        this.ani.addClip(clip, name);
        // 设置倍速和循环模式并播放
        let animStates = this.ani.getState(name);
        animStates.wrapMode = loop ? AnimationClip.WrapMode.Loop : AnimationClip.WrapMode.Normal;
        animStates.speed = timeScale;
        this.registerCompleteCallback(loop, onComplete);
        animStates.play();
    }

    /**
     * 创建带帧事件的AnimationClip
     * @param name Clip名称
     * @param frames 帧数组（已处理）
     * @param fps 帧率
     * @param dynamicEvents 动态帧事件
     * @param isFrameHoldEnabled 是否启用了插帧
     * @param holdDuration 持续帧数
     */
    private createClipWithEvents(
        name: string,
        frames: SpriteFrame[],
        fps: number,
        dynamicEvents: { frameIndex: number; callback: () => void }[],
        isFrameHoldEnabled: boolean,
        holdDuration: number
    ): AnimationClip {
        const clip = AnimationClip.createWithSpriteFrames(frames, fps);
        clip.name = name;

        // 合并编辑器配置的帧事件
        this.frameEvents.forEach(evt => {
            const mappedFrameIndex = this.mapFrameIndex(evt.frameIndex, isFrameHoldEnabled, holdDuration);
            const frameTime = mappedFrameIndex / fps;
            const eventName = evt.eventName;

            clip.events.push({
                frame: frameTime,
                func: eventName,
                params: []
            });

            // 注册事件处理器（如果还没有注册）
            if (!this.node[eventName]) {
                this.node[eventName] = () => {
                    this.node.emit(eventName);
                };
            }
        });

        // 合并代码动态配置的帧事件
        dynamicEvents.forEach((evt, index) => {
            const mappedFrameIndex = this.mapFrameIndex(evt.frameIndex, isFrameHoldEnabled, holdDuration);
            const frameTime = mappedFrameIndex / fps;
            const eventName = `_dynamicEvent_${name}_${index}`;

            clip.events.push({
                frame: frameTime,
                func: eventName,
                params: []
            });

            // 注册动态事件处理器
            this.node[eventName] = () => {
                evt.callback();
            };
        });

        return clip;
    }

    /**
     * 停止AnimationClip播放
     */
    stopClip() {
        if (this.ani) {
            this.ani.stop();
        }
        return;
    }

    // ========== update循环（用于手动切帧模式） ==========

    protected update(dt: number): void {
        if (this.editorView) return;
        if (!this.isPlayingManual || this.curSpriteFrames.length === 0) {
            this.isPlayingManual && this.stopManual();
            return;
        }

        // 累积时间并检查是否需要切换帧
        this.timeAccumulator += dt;
        if (this.timeAccumulator >= this.frameInterval) {
            this.timeAccumulator = 0;
            this.advanceFrame();
        }
    }

    /**
     * 推进到下一帧
     */
    private advanceFrame(): void {
        this.currentFrameIndex++;
        this.checkAndTriggerFrameEvent(this.currentFrameIndex - 1);

        // 检查是否播放完毕
        if (this.currentFrameIndex >= this.curSpriteFrames.length) {
            this.handleManualPlayEnd();
            return;
        }

        // 更新Sprite显示
        this.updateSpriteFrame();
    }

    /**
     * 处理手动播放结束
     */
    private handleManualPlayEnd(): void {
        if (this.currentLoop) {
            this.currentFrameIndex = 0;
            this.triggeredEvents.clear();
            this.updateSpriteFrame();
        } else {
            this.isPlayingManual = false;
            this.manualCompleteCallback?.();
        }
    }

    /**
     * 更新Sprite显示的帧
     */
    private updateSpriteFrame(): void {
        const frame = this.curSpriteFrames[this.currentFrameIndex];
        if (this.sprite && frame) {
            this.sprite.spriteFrame = frame;
        }
    }

    /**
     * 检查并触发帧事件
     */
    private checkAndTriggerFrameEvent(frameIndex: number): void {
        if (this.triggeredEvents.has(frameIndex)) return;

        const callbacks = this.activeFrameEvents.get(frameIndex);
        if (callbacks?.length > 0) {
            this.triggeredEvents.add(frameIndex);
            callbacks.forEach(cb => cb());
        }
    }
    /**
     * 加载帧资源（保留用于兼容）
     */
    public loadSpriteFrames(_path: string): Promise<SpriteFrame[]> {
        return new Promise((resolve, reject) => {
            resources.loadDir(_path, SpriteFrame, (err, assets) => {
                if (err) {
                    console.error("SpriteFrame资源加载失败", _path, err);
                    resolve([]);
                    return;
                }
                // 按文件名排序
                assets.sort((a, b) => {
                    const aNum = parseInt(a.name);
                    const bNum = parseInt(b.name);
                    return aNum - bNum;
                });
                console.log("SpriteFrame资源加载成功:", _path, assets.length);
                resolve(assets);
            });
        });
    }
}