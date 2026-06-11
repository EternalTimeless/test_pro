import { _decorator, CCString, Color, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CharAnimationBase')
export abstract class CharAnimationBase extends Component {
    /** 空闲动画名称 */
    @property({ displayName: '空闲动画名称' })
    protected idleAnimName: string = 'idle';
    /** 移动动画名称 */
    @property({ displayName: '移动动画名称' })
    protected moveAnimName: string = 'run';
    /** 攻击动画名称 */
    @property({ displayName: '攻击动画名称' })
    protected attackAnimName: string = 'attack';
    /** 死亡动画名称 */
    @property({ displayName: '死亡动画名称' })
    protected deadAnimName: string = 'die';
    /** 移动攻击动画名称 */
    @property({ displayName: '移动攻击动画名称' })
    protected runAttackAnimName: string = 'run_attack';
    @property({ displayName: '技能动画名称' })
    protected skillAnimName: string = 'skill0';
    /** 默认骨骼颜色 */
    protected readonly defaultColor: Color = new Color(255, 255, 255, 255);
    /** 受伤效果颜色 (红色) */
    protected readonly hurtColor: Color = new Color(255, 0, 0, 255);
    /** 减速效果颜色 (蓝色) */
    protected readonly slowColor: Color = new Color(90, 155, 255, 255);
    /** 治疗效果颜色 (绿色) */
    protected readonly healColor: Color = new Color(0, 255, 0, 255);
    /** 默认时间缩放 */
    protected defaultTimeScale: number = 1.0;
    /**动画节点原始放缩值 */
    public initialNodeScale: Vec3 = new Vec3();
    /**
     * 初始化动画组件
     * 注意：此方法不在 onLoad 中自动调用，需要外部手动调用
     * 原因：3D动画数据无法在 onLoad 时立即获取，需要延迟初始化
     */
    public abstract initAnimation(): void;
    /**
     * 计算动画时间缩放值
     * @param targetDuration 目标持续时间
     * @param animName 动画名称
     * @returns 计算出的时间缩放值
     */
    public abstract calculateTimeScale(targetDuration: number, animName: string): number;
    /**
     * 更新动画的播放速度, 用于动画加速减速, 内部实现不同动画组件的具体逻辑
     * @param timeScale 新的播放速度
     */
    public abstract setTimeScale(timeScale: number): void;
    public abstract resetTimeScale(): void;
    /**
     * 播放动画
     * @param name 动画名称
     * @param loop 是否循环
     * @param timeScale 播放速度
     * @param fadeDuration 混合时间
     * @param isShowLight 是否显示影子
     */
    /**
     * @param normalizedStartProgress 可选，0~1：crossFade 后将目标片段对齐到该归一化时间（用于站攻/跑攻等同相位切换）
     */
    public abstract playAnimation(name: string, loop: boolean, timeScale?: number, fadeDuration?: number, isShowLight?: boolean, normalizedStartProgress?: number): void;
    /**
     * 获取当前动画名称
     */
    public abstract getCurrentAnimationName(): string;
    /**
     * 获取当前动画进度
     */
    public abstract getCurAnimationProgress(): number;
    /**
     * 获取指定动画的持续时间
     */
    public abstract getAnimationDuration(name: string): number;
    /**
     * 停止所有动画
     */
    public abstract stopAllAnimations(): void;
    /**
     * 暂停当前动画
     */
    public abstract pauseAnimation(): void;
    /**
     * 恢复当前动画
     */
    public abstract resumeAnimation(): void;
    public abstract getAnimationNode(): Node;
    /**
     * 设置动画名称
     */
    public setAnimationNames(idle: string, move: string, attack: string, dead: string, runAttack: string, skill: string) {
        this.idleAnimName = idle || 'idle';
        this.moveAnimName = move || 'run';
        this.attackAnimName = attack || 'attack';
        this.deadAnimName = dead || 'die';
        this.runAttackAnimName = runAttack || 'run_attack';
        this.skillAnimName = skill || 'skill0';
    }
    /**
     * 显示受伤效果
     */
    protected abstract showDamageEffect(): void;
    /**
     * 显示治疗效果
     */
    protected abstract showHealEffect(): void;
    /**
     * 显示减速效果
     */
    protected abstract showSlowEffect(): void;
    /**
     * 重置所有颜色效果
     */
    protected abstract resetAllColorEffects(): void;
    // 抽象方法
    public getIdleAnimName(): string {
        return this.idleAnimName;
    };
    public getMoveAnimName(): string {
        return this.moveAnimName
    };
    public getAttackAnimName(): string {
        return this.attackAnimName
    };
    public getDeadAnimName(): string {
        return this.deadAnimName
    };
    public getMoveAttackAnimName(): string {
        return this.runAttackAnimName;
    }
    public getSkillAnimName(): string {
        return this.skillAnimName;
    }
    /** 手动切换移动动画名字（会立即播放） */
    public abstract changeMoveAnimName(animName: string): void;
    public abstract changeAttackAnimName(animName: string): void;
    /** 只设置移动动画名字，不立即播放（用于在其他状态下预设动画） */
    public abstract setMoveAnimName(animName: string): void;
    public abstract playMove(timeScale?: number, isLoop?: boolean): void;
    public abstract playIdle(timeScale?: number, isLoop?: boolean): void;
    public abstract playDead(timeScale?: number, isLoop?: boolean): void;
    public abstract playAttack(timeScale?: number, isLoop?: boolean): void;
    public abstract playRunAttack(timeScale?: number, isLoop?: boolean): void;
}


