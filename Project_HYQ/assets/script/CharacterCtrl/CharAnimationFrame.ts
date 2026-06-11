import { _decorator, Animation, AnimationClip, Component, Node, resources, SpriteFrame, Vec3 } from 'cc';
import { CharAnimationBase } from './CharAnimationBase';
import { ComponentEvent } from '../Common/CommonEnum';
const { ccclass, property } = _decorator;

@ccclass('CharAnimationFrame')
export class CharAnimationFrame extends CharAnimationBase {
    @property({ type: Node, displayName: '动画节点', tooltip: '显示动画的节点' })
    protected animationNode: Node | null = null;
    private _anim: Animation = null!;
    public skillFramesCache: Map<string, SpriteFrame[]> = new Map();
    /** 当前播放的动画名称 */
    private currentAnimName: string = '';

    public initAnimation(): void {
        if (!this.animationNode) {
            this.animationNode = this.node;
        }
        this._anim = this.animationNode.getComponent(Animation) || this.animationNode.addComponent(Animation);
        this._anim.on(Animation.EventType.FINISHED, this.onAnimationComplete, this);
        // 发送动画完成事件
        this.node.emit(ComponentEvent.OnAnimationComplete, this.currentAnimName);
        const initialScale = this.animationNode.getScale();
        Vec3.copy(this.initialNodeScale, initialScale);
    }

    /**
     * 帧动画资源预加载
     * @param url 文件夹路径
     * @returns SpriteFrame[] 帧动画顺序按文件名排序
     */
    private loadAnimFrames(url: string): Promise<SpriteFrame[]> {
        return new Promise((resolve, reject) => {
            resources.loadDir(`url`, SpriteFrame, (err, assets) => {
                if (err) {
                    console.error("动画资源加载失败", name, err);
                    resolve([]);
                    return;
                }
                // 按文件名排序
                assets.sort((a, b) => {
                    const aNum = parseInt(a.name);
                    const bNum = parseInt(b.name);
                    return aNum - bNum;
                });
                resolve(assets);
            });
        });
    }
    onAnimationComplete() {
        this.node.emit(ComponentEvent.OnAnimationComplete, this.currentAnimName || "");
    }
    public calculateTimeScale(targetDuration: number, animName: string): number {
        if (!this._anim || !animName) return 1;

        // 先获取动画剪辑
        const clip = this._anim.clips.find(clip => clip.name === animName);
        if (!clip) {
            console.warn(`找不到动画片段: ${animName}`);
            return 1;
        }

        // 获取动画时长
        const duration = clip.duration;
        if (duration <= 0 || targetDuration <= 0) {
            // console.warn(`动画时长异常: ${animName}, duration: ${duration}, target: ${targetDuration}`);
            return 1;
        }

        // 保留一位小数
        const timeScale = Math.floor((duration / targetDuration) * 10) / 10;
        // console.log(`${animName} 动画时长计算: 原始=${duration}s, 目标=${targetDuration}s, 速率=${timeScale}`);
        return timeScale;
    }
    public playAnimation(name: string, loop: boolean, timeScale: number = 1, fadeDuration: number = 0.2, _isShowLight?: boolean, _normalizedStartProgress?: number): void {
        if (!this._anim) return;

        let animState = this._anim.getState(name);
        if (!animState) {
            // 如果动画不存在，尝试从缓存创建
            const frames = this.skillFramesCache.get(name);
            if (frames && frames.length > 0) {
                const clip = AnimationClip.createWithSpriteFrames(frames, 60);
                clip.name = name;
                this._anim.addClip(clip);
                animState = this._anim.getState(name);
            } else {
                console.warn(this.node.name, `动画 ${name} 未找到`);
            }
        }
        if (animState) {
            // 如果正在播放相同的动画，不重复播放
            if (this.currentAnimName === name && animState.isPlaying) {
                return;
            }
            // 保存当前播放的动画名称
            this.currentAnimName = name;
            animState.wrapMode = loop ? AnimationClip.WrapMode.Loop : AnimationClip.WrapMode.Normal;
            animState.speed = timeScale;
            this._anim.play(name);
        }
    }
    public setTimeScale(timeScale: number) {
        if (!this._anim) return;

        // 对于帧动画，修改当前动画状态的速度
        const state = this._anim.getState(this.currentAnimName);
        if (state) {
            state.speed = timeScale;
        }
    }
    public resetTimeScale() {
        if (!this._anim) return;

        // 对于帧动画，修改当前动画状态的速度
        const state = this._anim.getState(this.currentAnimName);
        if (state) {
            state.speed = this.defaultTimeScale;
        }
    }
    public getCurrentAnimationName(): string {
        if (!this._anim) return '';
        const state = this._anim.getState(this._anim.defaultClip?.name || '');
        return state ? state.name : '';
    }

    public getCurAnimationProgress(): number {
        if (!this._anim) return 0;
        const state = this._anim.getState(this.currentAnimName);
        if (!state) return 0;
        const curPlayTime = state.time % state.duration;
        return curPlayTime / state.duration;
    }

    public getAnimationDuration(name?: string): number {
        if (!this._anim) return 0;
        let duration = 0;
        if (name) {
            const state = this._anim.getState(name);
            duration = state ? state.duration : 0;
        } else {
            const curState = this._anim.getState(this.currentAnimName);
            duration = curState ? curState.duration : 0;
        }
        return duration;
    }

    public stopAllAnimations(): void {
        if (!this._anim) return;
        this._anim.stop();
    }

    public pauseAnimation(): void {
        if (!this._anim) return;
        this._anim.pause();
    }

    public resumeAnimation(): void {
        if (!this._anim) return;
        this._anim.resume();
    }
    public getAnimationNode(): Node | null {
        return this.animationNode ? this.animationNode : null;
    }
    protected showDamageEffect(): void {
        // 实现受伤效果
    }

    protected showHealEffect(): void {
        // 实现治疗效果
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
    /**只设置移动动画名字，不立即播放（用于在其他状态下预设动画） */
    public setMoveAnimName(animName: string) {
        this.moveAnimName = animName;
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
    public playAttack(timeScale: number, loop: boolean = true) {
        this.playAnimation(this.attackAnimName, loop, timeScale)
    }
    /**移动攻击动画 */
    public playRunAttack(timeScale: number, loop: boolean = true) {
        this.playAnimation(this.runAttackAnimName, loop, timeScale)
    }
}


