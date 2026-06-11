import { _decorator, Animation, AnimationClip, AnimationState, Node, SkeletalAnimation } from 'cc';
import { ComponentEvent } from '../Common/CommonEnum';
import { CharAnimationBase } from './CharAnimationBase';
import { AtkEventListeners } from './AtkEventListeners';
const { ccclass, property } = _decorator;
/**
 * 动画信息数据
 */
export interface AnimationInfo {
    name: string;
    duration: number;
    isLoop: boolean;
}
/**
 * 当前播放动画数据
 */
export interface CurrentAnimationData {
    name: string;
    duration: number;
    frameRate: number;
    isLoop: boolean;
    currentTime: number;
    timeScale: number;
    isPlaying: boolean;
}
@ccclass('CharAnimationModel')
export class CharAnimationModel extends CharAnimationBase {
    @property({ type: SkeletalAnimation, displayName: "动画节点" })
    protected modelAni: SkeletalAnimation = null!;
    private _hasModel: boolean = false;
    /** 当前播放的动画数据 */
    private currentAnimationData: CurrentAnimationData | null = null;
    /** 当前播放的动画状态 */
    private currentAnimationState: AnimationState | null = null;
    public onLoad(): void {
        this._hasModel = !!this.modelAni;
        if (this._hasModel) {
            this.modelAni.on(Animation.EventType.FINISHED, this.onAnimationComplete, this);
            this.modelAni.on(Animation.EventType.LASTFRAME, this.onceLoopAnimationComplete, this);
            // 检查是否已存在 FrameEventListeners 组件，避免重复添加
            if (!this.modelAni.node.getComponent(AtkEventListeners)) {
                this.modelAni.node.addComponent(AtkEventListeners);
            }
        }
    }
    initAnimation() {
        this.cacheAnimationDurations();
    }
    /**
     * 缓存所有动画的原始时长
     */
    cacheAnimationDurations(): void {
        if (!this.modelAni) return;

        const animNames = [
            this.attackAnimName,
            this.runAttackAnimName,
            this.moveAnimName,
            this.idleAnimName,
            this.deadAnimName
        ];

        for (const name of animNames) {
            const state = this.modelAni.getState(name);
            if (state) {
                const hasAttackEvent = state.clip.events.some(event => event.func === 'onAttackFrameEvent');
                // if (!hasAttackEvent && this.node.name == "Player") {
                //     console.warn(`动画 "${name}" 没有设置 "onAttackFrameEvent" 帧事件，攻击将无法触发`);
                // }
            }
        }
    }
    /**
     * 计算动画时间缩放值
     * @param targetDuration 目标持续时间
     * @param animName 动画名称
     * @returns 计算出的时间缩放值
     */
    public calculateTimeScale(targetDuration: number, animName: string): number {
        if (!this._hasModel) return 1;
        // const baseDuration = this.getAnimationInfo(animName);
        const state = this.modelAni.getState(animName);
        if (!state || state.duration <= 0 || targetDuration <= 0) return 1;

        // 保留一位小数，采用Math.floor策略
        const rawTimeScale = state.duration / targetDuration;
        return Math.floor(rawTimeScale * 10) / 10;
    }
    /**
     * 播放动画（支持空模型）
     * @param normalizedStartProgress 若传入 0~1，则在 crossFade 后下一帧将目标动画 current 对齐到该归一化进度（站攻/跑攻切换同相位）
     */
    public playAnimation(name: string, loop: boolean, timeScale: number = 1, fade: number = 0.2, _isShowLight: boolean = false, normalizedStartProgress?: number): void {
        if (!this._hasModel) {
            // 触发动画完成事件，确保状态机正常工作
            this.scheduleOnce(() => {
                this.node.emit('animationComplete');
            }, 0.1);
            return;
        }

        const state = this.modelAni.getState(name);
        if (!state) {
            console.warn(`Animation ${name} not found for character`);
            return;
        }
        timeScale = Math.max(0.1, timeScale)
        //智能融合时间
        fade = fade * timeScale
        // 设置动画参数
        state.speed = timeScale;
        state.wrapMode = loop ? AnimationClip.WrapMode.Loop : AnimationClip.WrapMode.Normal;

        //需要取消预烘焙动画选项 才能正常动画融合
        this.modelAni.crossFade(name, fade);

        const startNorm = normalizedStartProgress !== undefined
            ? Math.min(1, Math.max(0, normalizedStartProgress))
            : 0;
        const initialCurrentTime = startNorm * state.duration;

        // 更新当前动画数据
        this.currentAnimationData = {
            name,
            duration: state.duration,
            frameRate: state.frameRate,
            isLoop: loop,
            currentTime: initialCurrentTime,
            timeScale: timeScale,
            isPlaying: true
        };
        this.currentAnimationState = state;

        // 下一帧写入骨骼状态时间，避免与 crossFade 同一帧竞争
        if (normalizedStartProgress !== undefined) {
            this.scheduleOnce(() => {
                const st = this.modelAni.getState(name);
                if (!st || this.currentAnimationData?.name !== name) return;
                const t = Math.min(st.duration, Math.max(0, startNorm * st.duration));
                // current 只读，用 setTime 对齐相位(phase)
                st.setTime(t);
                this.currentAnimationData.currentTime = st.current;
                this.currentAnimationState = st;
            }, 0);
        }
    }

    /**
     * 倒放指定动画（独立播放，不更新 currentAnimationData / currentAnimationState）
     * 适用于特定物品或动作的倒放表现，与角色常规动画逻辑解耦
     * @param name 动画名称
     * @param loop 是否循环倒放
     * @param timeScale 播放速度（正数）
     * @param fade 融合时间
     */
    public playReverseAnimation(name: string, loop: boolean = false, timeScale: number = 1, fade: number = 0.2): void {
        if (!this._hasModel) return;

        const state = this.modelAni.getState(name);
        if (!state) {
            console.warn(`Animation ${name} not found for character`);
            return;
        }

        timeScale = Math.max(0.1, timeScale);
        fade = fade * timeScale;
        state.speed = timeScale;
        state.wrapMode = loop ? AnimationClip.WrapMode.LoopReverse : AnimationClip.WrapMode.Reverse;
        this.modelAni.crossFade(name, fade);
    }

    public setTimeScale(timeScale: number) {
        if (!this.modelAni) return;

        // 如果有当前播放的动画状态，设置其速度
        if (this.currentAnimationState) {
            this.currentAnimationState.speed = timeScale;
        }

        // 更新当前动画数据的时间缩放
        if (this.currentAnimationData) {
            this.currentAnimationData.timeScale = timeScale;
        }
    }
    public resetTimeScale() {
        if (!this.modelAni) return;
        this.setTimeScale(this.defaultTimeScale);
    }

    /**
     * 获取当前动画名称
     */
    public getCurrentAnimationName(): string {
        return this.currentAnimationData?.name || '';
    }
    /**
     * 获取动画进度
     */
    public getCurAnimationProgress(): number {
        if (!this.currentAnimationState || !this.currentAnimationState.isPlaying) {
            return 0;
        }

        if (this.currentAnimationState.duration <= 0) {
            return 0;
        }
        // console.log("动画进度", this.currentAnimationState.current, this.currentAnimationState.duration);
        return Math.min(1, this.currentAnimationState.current / this.currentAnimationState.duration);
    }

    /** 读取指定动画状态进度（倒放 open 等未写入 currentAnimationState 的场景） */
    public getNamedAnimationProgress(animName: string): number {
        if (!this.modelAni) return 0;
        const state = this.modelAni.getState(animName);
        if (!state || state.duration <= 0) return 0;
        return Math.min(1, state.current / state.duration);
    }

    /**
     * 获取指定动画的持续时间
     */
    public getAnimationDuration(animName: string): number {
        if (!this.modelAni) return 0;
        if (animName) {
            const state = this.modelAni.getState(animName);
            return state ? state.duration : 0;
        } else if (this.currentAnimationData) {
            return this.currentAnimationData.duration;
        }
        return 0;
    }

    /**
     * 停止所有动画
     */
    public stopAllAnimations(): void {
        if (!this.modelAni) return;
        this.modelAni.stop();
        this.currentAnimationState = null;
    }

    /**
     * 暂停当前动画
     */
    public pauseAnimation(): void {
        if (!this.modelAni) return;
        this.modelAni.pause();
    }

    /**
     * 恢复当前动画
     */
    public resumeAnimation(): void {
        if (!this.modelAni) return;
        this.modelAni.resume();
    }
    public getAnimationNode(): Node | null {
        return this.modelAni ? this.modelAni.node : null;
    }
    /**
     * 动画完成回调
     */
    private onAnimationComplete(): void {
        // 触发动画完成事件
        this.node.emit(ComponentEvent.OnAnimationComplete, this.currentAnimationData?.name || "");
    }
    /**循环动画播完一次回调 */
    private onceLoopAnimationComplete(): void {
        // 触发循环动画单次播放完成事件（用于攻击动画等循环动画的逻辑处理）
        this.node.emit(ComponentEvent.OnLoopAnimationComplete, this.currentAnimationData?.name || "");
    }
    /**
     * 显示受伤效果
     */
    public showDamageEffect(): void {
        // 由子类实现具体的受伤效果
    }

    /**
     * 显示治疗效果
     */
    public showHealEffect(): void {
        // 由子类实现具体的治疗效果
    }

    /**
     * 显示免疫效果
     */
    public showImmuneEffect(): void {
        // 由子类实现具体的免疫效果
    }

    protected showSlowEffect(): void {
        // 实现减速效果
    }

    protected resetAllColorEffects(): void {
        // 重置所有颜色效果
    }
    /**手动切换移动动画名字, 切换时会自动播放动画 */
    public changeMoveAnimName(animName: string) {
        this.moveAnimName = animName;
        this.playMove();
    }
    public changeAttackAnimName(animName: string) {
        this.attackAnimName = animName;
        // this.playAttack();
    }
    /**只设置移动动画名字，不立即播放（用于在其他状态下预设动画） */
    public setMoveAnimName(animName: string) {
        this.moveAnimName = animName;
    }
    public changeIdleAnimName(animName: string) {
        this.idleAnimName = animName;
        this.playIdle();
    }
    public setIdleAnimName(animName: string) {
        this.idleAnimName = animName;
    }
    /**移动动画 */
    public playMove(timeScale: number = 1) {
        this.playAnimation(this.moveAnimName, true, timeScale)
    }
    /**空闲动画 */
    public playIdle(timeScale: number = 1) {
        this.playAnimation(this.idleAnimName, true, timeScale)
    }
    /**死亡动画 */
    public playDead(timeScale: number = 1) {
        this.playAnimation(this.deadAnimName, false, timeScale)
    }
    /**攻击动画 */
    public playAttack(timeScale: number = 1) {
        this.playAnimation(this.attackAnimName, true, timeScale)
    }
    /**移动攻击动画 */
    public playRunAttack(timeScale: number = 1) {
        this.playAnimation(this.runAttackAnimName, true, timeScale)
    }
}


