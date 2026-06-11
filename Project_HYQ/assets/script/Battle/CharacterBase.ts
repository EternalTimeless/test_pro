import { _decorator, Component, Vec3, Node, Quat, quat, v3, Animation, AnimationClip, MeshRenderer } from 'cc';
import { CampType, CharacterStatus, CharacterTag, ComponentEvent, PrefabPathEnum } from '../Common/CommonEnum';
import { AttackInfo, AttackType, GameInfo, SceneType, DamageSource } from '../Common/GameInfo';
import { ICharacterListener } from '../Manager/InterfaceMgr';
import { AudioMgr, SoundEnum } from '../Core/Managers/AudioMgr';
import { CharAnimationBase } from '../CharacterCtrl/CharAnimationBase';
import { AttackCtrl } from '../CharacterCtrl/AttackCtrl';
import { BattleValCtrl } from '../CharacterCtrl/BattleValCtrl';
import { MoveCtrl } from '../CharacterCtrl/MoveCtrl';
import { SkillCtrl } from '../CharacterCtrl/SkillCtrl';
import { StatusCtrl } from '../CharacterCtrl/StatusCtrl';
import { VisualFeedbackCtrl } from '../CharacterCtrl/VisualFeedbackCtrl';
const { ccclass, property } = _decorator;
/**
 * 闪红单个属性配置
 */
@ccclass('MeshFlashPropData')
export class MeshFlashPropData {

    @property({ tooltip: '材质颜色属性名, 如 emissive、mainColor、albedo、baseColor' })
    public propName: string = 'emissive';

    @property({ tooltip: '该属性所属的Pass索引(通道)' })
    public passIndex: number = 0;

    @property({ tooltip: '目标材质索引(-1=所有材质, 0+=仅指定材质)' })
    public matIndex: number = -1;
}
/**
 * 闪红开关属性配置(float类型uniform, 如 u_flashEnable 0→1→0)
 */
@ccclass('MeshFlashSwitchData')
export class MeshFlashSwitchData {

    @property({ tooltip: '属性名, 如 u_flashEnable' })
    public propName: string = 'u_flashEnable';

    @property({ tooltip: '该属性所属的Pass索引(通道)' })
    public passIndex: number = 0;

    @property({ tooltip: '目标材质索引(-1=所有材质, 0+=仅指定材质)' })
    public matIndex: number = -1;

    @property({ tooltip: '闪红时设置的值(如1=开启)' })
    public flashValue: number = 1;

    @property({ tooltip: '恢复时设置的值(如0=关闭), 默认0' })
    public restoreValue: number = 0;

    @property({ tooltip: '使用Material.setProperty设置(用于带target映射的属性, 如grayEnable→grayParam.x)' })
    public useMaterialProp: boolean = false;
}
/**
 * 闪红MeshRenderer配置
 */
@ccclass('MeshFlashData')
export class MeshFlashData {

    @property(MeshRenderer)
    public meshRender: MeshRenderer = null!;

    @property({ type: [MeshFlashPropData], tooltip: '闪红时修改的材质颜色属性列表, 每个属性指定所属Pass通道' })
    public colorProps: MeshFlashPropData[] = [];

    @property({ type: [MeshFlashSwitchData], tooltip: '闪红时修改的开关属性列表(float类型, 如 u_flashEnable 0→1→0)' })
    public switchProps: MeshFlashSwitchData[] = [];
}

@ccclass('CharacterBase')
export abstract class CharacterBase extends Component implements ICharacterListener {

    @property({ type: Node, displayName: '模型节点', tooltip: '角色的模型节点' })
    public ModelNode: Node | null = null;
    @property({ type: CharacterTag, displayName: '角色类型', tooltip: '角色的类型' })
    public CharacterTag: CharacterTag = CharacterTag.NoInitialize;
    protected campType: CampType = CampType.Normal;

    /**骨骼当前放缩值 */
    protected readonly currentScale: Vec3 = new Vec3(1, 1, 1);
    // 朝向相关属性
    protected _targetDirection: Vec3 = new Vec3(0, 0, 0);
    protected _rotationSpeed: number = 15; // 旋转速度
    protected _lastValidDirection: Vec3 = new Vec3(0, 0, 0); // 添加最后有效朝向


    /**是否已触发技能特效 */
    protected _hasTriggeredSkillEffect = false;

    /**是否在城内 */
    public isInsideWall: boolean = false;

    // 目标追踪
    protected atkTarget: CharacterBase | null = null;
    /**强制目标(优先级高于普通追踪) */
    protected forcedTarget: CharacterBase | null = null;
    protected trackingTimer: number = 0;
    protected readonly tempPosForDistance: Vec3 = new Vec3();

    public battleValComp: BattleValCtrl = null!;
    protected animComp: CharAnimationBase | null = null;
    protected attackComp: AttackCtrl | null = null;
    protected moveComp: MoveCtrl | null = null;
    protected skillComp: SkillCtrl | null = null;
    protected statusComp: StatusCtrl | null = null;
    protected visualFeedbackComp: VisualFeedbackCtrl | null = null;

    // 动画速率管理
    protected _globalTimeScale: number = 1.0;
    protected _attackTimeScale: number = 1.0;
    protected _skillTimeScale: number = 1.0;
    protected _moveTimeScale: number = 1.0;
    protected _runAttackTimeScale: number = 1.0;

    // 添加脏标记
    private _isDirtyAniTimeScale: boolean = false;

    /** 上次实际执行攻击效果(executeAttack)的墙钟时间, 用于帧事件双发抑制 */
    private _lastAttackFrameExecuteWallTime = -1e9;

    /** 死亡动画结束后的溶解(士兵/怪物等, 子类提供 MeshRenderer) */
    protected _dissolving: boolean = false;
    protected _dissolveRecovered: boolean = false;
    protected dissValue: number = 0;
    protected readonly dissolveSpeed: number = 3;

    protected lastDamageSource?: DamageSource;
    public isPause: boolean = false;
    onLoad() {
        // 阻断性检查：模型节点不存在时不初始化组件, 避免后续报错
        // if (!this.ModelNode) {
        //     console.error(`[CharacterBase] ModelNode is null for ${this.node.name}, component initialization aborted.`);
        //     return;
        // }
        this.initComponents();
    }

    update(dt: number) {
        // 阻断性检查：模型节点不存在时不执行后续逻辑
        if (!this.ModelNode) return;

        if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin) {
            if (GameInfo.instance.Pause && !this.isPause) {
                this.isPause = true;
                this.animComp?.pauseAnimation();
                // 位移/刚体：由 MoveCtrl 在暂停时冻结线速度, 不在此 stopMove, 避免打断路径/目标点意图
            }
            return;
        }
        if (this.isPause && !GameInfo.instance.Pause) {
            this.isPause = false;
            this.animComp?.resumeAnimation();
        }

        // 统一的目标追踪更新
        if (this.attackComp && this.shouldUpdateTarget()) {
            this.trackingTimer += dt;
            if (this.trackingTimer >= this.attackComp.trackingUpdateInterval) {
                this.updateNearestTarget();
            }
        }

        // 更新朝向
        this.updateFaceDirection();
        // 检查并更新脏数据
        this.checkAndUpdateDirtyValues();
    }



    destroyBefore() {
        if (this.moveComp) { this.moveComp.destroyBefore() }
    }
    /**
     * 初始化组件
     * 注意：组件初始化顺序很重要, 确保数据组件先于功能组件
     */
    private initComponents() {
        // 1. 初始化数据组件
        this.battleValComp = this.getComponent(BattleValCtrl);
        this.visualFeedbackComp = this.getComponent(VisualFeedbackCtrl);

        // 2. 初始化功能组件
        this.animComp = this.getComponent(CharAnimationBase);
        this.attackComp = this.getComponent(AttackCtrl);
        if (this.attackComp) {
            this.attackComp.onAttackExecute = this.handleAttack.bind(this);
        }
        this.moveComp = this.getComponent(MoveCtrl);

        // 3. 初始化技能组件(根据 BattleValCtrl 的 skillId 判断是否加载)
        if (this.battleValComp && this.battleValComp.skillId) {
            this.skillComp = this.getComponent(SkillCtrl);
        }

        // 4. 初始化状态组件
        this.statusComp = this.getComponent(StatusCtrl);
        if (this.statusComp) {
            this.statusComp.initStatusBase();
            this.initStatusCallbacks();
        }

        // 5. 注册事件监听
        this.registerEventListeners();

        // 6. 延迟初始化动画(等待3D动画数据加载)
        if (this.animComp) {
            this.scheduleOnce(() => {
                this.animComp.initAnimation();
                //3D的动画数据无法在onload时获取, 要到下一帧
                this.initAnimationTimeScale();
            }, 0.1);
        }

        // 7. 初始化组件回调
        this.initComponentCallbacks();
    }
    /**初始化组件回调 */
    private initComponentCallbacks(): void {
        if (this.battleValComp) {
            this.battleValComp.onCharacterListener = {
                onDead: this.onDead.bind(this)
            };
            if (this.visualFeedbackComp) {
                this.battleValComp.visualCompListener = {
                    onHealthUpdate: this.visualFeedbackComp.onHealthUpdate.bind(this.visualFeedbackComp),
                    onSkillCDUpdate: this.visualFeedbackComp.onSkillCDUpdate.bind(this.visualFeedbackComp)
                };
            }
        }
    }
    /**
     * 注册事件监听
     */
    private registerEventListeners(): void {
        // 注册伤害相关事件
        if (this.battleValComp) {
            this.node.on(ComponentEvent.OnSkillCoolDown, this.onSkillCoolDown, this);
        }
        if (this.moveComp) {
            this.node.on(ComponentEvent.OnMoveChange, this.moveStateChange, this)
            this.node.on(ComponentEvent.TargetReached, this.onTargetReached, this);
            // 注册击退结束事件
            this.node.on(ComponentEvent.KnockbackEnd, this.onKnockbackEnd, this);
        }
        if (this.animComp) {
            this.node.on(ComponentEvent.OnAnimationComplete, this.onAnimationComplete, this);
            this.node.on(ComponentEvent.OnLoopAnimationComplete, this.onLoopAnimationComplete, this);
            this.node.on(ComponentEvent.OnAttackFrame, this.onAttackFrame, this);
        }
    }

    /**
     * 移除事件监听
     */
    private unregisterEventListeners(): void {
        if (this.battleValComp) {
            this.node.off(ComponentEvent.OnSkillCoolDown, this.onSkillCoolDown, this);
        }
        if (this.moveComp) {
            this.node.off(ComponentEvent.OnMoveChange, this.moveStateChange, this)
            this.node.off(ComponentEvent.TargetReached, this.onTargetReached, this);
            // 移除击退结束事件
            this.node.off(ComponentEvent.KnockbackEnd, this.onKnockbackEnd, this);
        }
        if (this.animComp) {
            this.node.off(ComponentEvent.OnAnimationComplete, this.onAnimationComplete, this);
            this.node.off(ComponentEvent.OnLoopAnimationComplete, this.onLoopAnimationComplete, this);
            this.node.off(ComponentEvent.OnAttackFrame, this.onAttackFrame, this);
        }
    }

    /**
     * 初始化状态回调
     */
    private initStatusCallbacks() {
        // 设置状态进入回调
        this.statusComp.setStateEnterCallback(CharacterStatus.Idle, this.onIdleEnter.bind(this));
        this.statusComp.setStateEnterCallback(CharacterStatus.Move, this.onMoveEnter.bind(this));
        this.statusComp.setStateEnterCallback(CharacterStatus.Attack, this.onAttackEnter.bind(this));
        this.statusComp.setStateEnterCallback(CharacterStatus.Skill, this.onSkillEnter.bind(this));
        this.statusComp.setStateEnterCallback(CharacterStatus.Dead, this.onDeadEnter.bind(this));
        this.statusComp.setStateEnterCallback(CharacterStatus.Work, this.onWorkEnter.bind(this));
        // 设置状态更新回调
        this.statusComp.setStateUpdateCallback(CharacterStatus.Attack, this.onAttackUpdate.bind(this));
        this.statusComp.setStateUpdateCallback(CharacterStatus.Skill, this.onSkillUpdate.bind(this));
        this.statusComp.setStateUpdateCallback(CharacterStatus.Dead, this.onDeadUpdate.bind(this));
        this.statusComp.setStateUpdateCallback(CharacterStatus.Work, this.onWorkUpdate.bind(this));


        // 设置状态退出回调
        this.statusComp.setStateExitCallback(CharacterStatus.Move, this.onMoveExit.bind(this));
        this.statusComp.setStateExitCallback(CharacterStatus.Attack, this.onAttackExit.bind(this));
        this.statusComp.setStateExitCallback(CharacterStatus.Skill, this.onSkillExit.bind(this));
    }
    initData() {
        if (this.CharacterTag == CharacterTag.Monster || this.CharacterTag == CharacterTag.Elite || this.CharacterTag == CharacterTag.Boss) {
            this.campType = CampType.Enemy;
        } else if (this.CharacterTag == CharacterTag.Player || this.CharacterTag == CharacterTag.Ally) {
            this.campType = CampType.Player;
        } else {
            this.campType = CampType.Normal;
        }
        // 1. 先初始化视觉组件(确保 UI 组件准备就绪)
        if (this.visualFeedbackComp) {
            this.visualFeedbackComp.initData(this.campType);
        }
        // 2. 再初始化数值组件(此时触发的 UI 更新回调能正常工作)
        if (this.battleValComp) {
            this.battleValComp.initializeHealth();
            // 初始化技能配置
            const skillConfig = this.battleValComp.initSkillData();
            // 如果技能组件存在且配置有效, 初始化技能组件
            if (this.skillComp && skillConfig) {
                this.skillComp.initialize(skillConfig);
            }
        }
        // 3. 初始化状态
        if (this.statusComp) {
            this.statusComp.changeState(CharacterStatus.Idle);
        }
        this._hasTriggeredSkillEffect = false;
        this._globalTimeScale = 1;
        this._isDirtyAniTimeScale = false;
        Vec3.zero(this._targetDirection);
        Vec3.zero(this._lastValidDirection);
        this.isInsideWall = false;
        this.atkTarget = null;
        this.forcedTarget = null;
        this.trackingTimer = 0;
        if (this.moveComp) {
            this.moveComp.initData();
        }
    }

    // 状态处理方法
    protected onIdleEnter() {
        this.animComp?.playIdle(1);

        // 如果正在击退状态, 不要停止移动(保持击退效果)
        if (!this.moveComp || !this.moveComp.isInKnockbackState) {
            this.stopMove();
        }
    }

    protected onWorkEnter() {
        // this.animComp?.playAnimation("carry_up", false, 1);
    }

    protected onMoveEnter() {
        this.animComp?.playMove(this._moveTimeScale);
    }

    protected onAttackEnter() {
        if (this.CharacterTag != CharacterTag.Player && this.CharacterTag != CharacterTag.Ally) {
            this.animComp?.playAttack(this._attackTimeScale);
        } else {
            const isMoving = this.moveComp?.isMoving;
            if (isMoving) {
                this.animComp?.playRunAttack(this._runAttackTimeScale);
            } else {
                this.animComp?.playAttack(this._attackTimeScale);
            }
        }
    }

    protected onSkillEnter() {
        this.animComp?.playAnimation(this.animComp.getSkillAnimName(), false, this._skillTimeScale, 0.1, true);
        this.enableSkillEffect();
        this.battleValComp?.resetSkill();
        this._hasTriggeredSkillEffect = false;

        // 如果正在击退状态, 不要停止移动(保持击退效果)
        if (!this.moveComp || !this.moveComp.isInKnockbackState) {
            this.stopMove();
        }
    }

    protected onDeadEnter() {
        // 死亡时不立即停止移动, 允许击退效果继续
        // this.stopMove(); // 注释掉, 改为只停止主动移动
        this.stopActiveMovement();
        this.animComp?.playDead(1, false);
        this.destroyBefore();
    }
    // 动画更新处理
    protected onAttackUpdate(dt: number) {
        if (this.animComp && (this.CharacterTag == CharacterTag.Player || this.CharacterTag == CharacterTag.Ally)) {
            this.applyCombatAnimByMoving(!!this.moveComp?.isMoving);
        }
    }

    private onSkillUpdate(dt: number) {
        if (!this.animComp) return;

        const progress = this.animComp.getCurAnimationProgress();
        if (progress >= 0.8 && !this._hasTriggeredSkillEffect) {
            this.castSkillEffect();
            this._hasTriggeredSkillEffect = true;
        }
    }
    protected onWorkUpdate(dt: number) {
        // 子类覆盖重写
    }
    protected onDeadUpdate(dt: number) {
        // 子类覆盖重写
    }
    protected onMoveExit() { }
    protected onWorkExit() { }
    protected onAttackExit() { }
    protected onSkillExit() { }

    /** 子类提供溶解材质所在 MeshRenderer；返回 null 则不溶解、由子类自行回收 */
    protected getDissolveMeshRenderer(): MeshRenderer | null {
        return null;
    }

    public get isDissolving(): boolean {
        return this._dissolving;
    }

    protected resetDissolveState() {
        this._dissolving = false;
        this._dissolveRecovered = false;
        this.dissValue = 0;
        this.applyDissolveUniforms(0);
    }

    /** 死亡非循环动画播完 -> 开始溶解 */
    protected onDeathAnimationFinished() {
        this.beginDissolveAfterDeath();
    }

    protected beginDissolveAfterDeath() {
        if (this._dissolving || !this.getDissolveMeshRenderer()) return;
        this._dissolving = true;
        this._dissolveRecovered = false;
        this.dissValue = 0;
        this.applyDissolveUniforms(0);
    }

    /** @returns 是否仍在溶解中 */
    protected tickDissolve(dt: number): boolean {
        if (!this._dissolving || this._dissolveRecovered) return false;
        if (this.dissValue >= 1) {
            this._dissolveRecovered = true;
            this._dissolving = false;
            GameInfo.instance.prefabMgr.recoverPrefab(this.node);
            return false;
        }
        this.dissValue += this.dissolveSpeed * dt;
        this.dissValue = Math.min(1, this.dissValue);
        this.applyDissolveUniforms(this.dissValue);
        return true;
    }

    protected applyDissolveUniforms(value: number) {
        const meshRenderer = this.getDissolveMeshRenderer();
        if (!meshRenderer?.materials?.[0]) return;
        const mat = meshRenderer.materials[0];
        const outline = mat.passes[0]?.getHandle('outdissolveThreshold');
        if (outline != null) mat.passes[0].setUniform(outline, value);
        const hand = mat.passes[1]?.getHandle('dissolveThreshold');
        if (hand != null) mat.passes[1].setUniform(hand, value);
    }

    /**非循环动画完成回调 */
    protected onAnimationComplete() {
        switch (this.statusComp.currentState) {
            case CharacterStatus.Attack:
                this.statusComp.changeState(CharacterStatus.Idle);
                break;
            case CharacterStatus.Skill:
                this.statusComp.changeState(CharacterStatus.Idle);
                break;
            case CharacterStatus.Dead:
                break;
            case CharacterStatus.Work:
                if (this.moveComp?.isMoving) {
                    this.statusComp.changeState(CharacterStatus.Move);
                } else {
                    this.statusComp.changeState(CharacterStatus.Idle);
                }
                break;
            default:
                break;
        }
    }

    /**
     * 循环动画单次播放完成回调(子类可重写处理特定逻辑)
     */
    protected onLoopAnimationComplete(animName?: string): void {
        // 子类可重写实现特定行为
        switch (this.statusComp.currentState) {
            case CharacterStatus.Attack:
                // NOTE:如果有完整播放攻击动画需求, 使用requestExitAttackAfterLoop方法在当前攻击循环结束时真正退出攻击
                if (this._pendingExitAttack) {
                    this.stopAttack();
                }
                break;
            case CharacterStatus.Skill:
                this.statusComp.changeState(CharacterStatus.Idle);
                break;
            case CharacterStatus.Dead:
                break;
            default:
                break;
        }
    }

    /**
     * 动画帧事件触发攻击
     */
    protected onAttackFrame() {
        if (!this.attackComp) return;
        // 站攻/跑攻融合双发抑制：墙钟阈值内跳过 executeAttack(仅 Player/Ally, 避免怪物同条多段帧被误挡；若要全角色可去掉下方条件)
        if (this.CharacterTag === CharacterTag.Player || this.CharacterTag === CharacterTag.Ally) {
            const now = performance.now() * 0.001;
            const minGap = this.attackComp.attackAnimDuration * 0.8;
            if (now - this._lastAttackFrameExecuteWallTime < minGap) {
                return;
            }
            this._lastAttackFrameExecuteWallTime = now;
        }
        this.attackComp.executeAttack(this.CharacterTag);
    }

    /**
     * 站攻/跑攻切换(Player/Ally 状态机内用；Hero 也可显式同步士兵)
     * @param normalizedProgress 可选, 与驱动方动画进度对齐
     */
    protected applyCombatAnimByMoving(isMoving: boolean, normalizedProgress?: number): void {
        if (!this.animComp || this.statusComp?.currentState !== CharacterStatus.Attack) return;
        const animProgress = normalizedProgress ?? this.animComp.getCurAnimationProgress();
        const targetAnimName = isMoving ? this.animComp.getMoveAttackAnimName() : this.animComp.getAttackAnimName();
        const timeScale = isMoving ? this._runAttackTimeScale : this._attackTimeScale;
        const currentAnimName = this.animComp.getCurrentAnimationName();
        if (currentAnimName !== targetAnimName) {
            const p = Math.min(1, Math.max(0, animProgress));
            this.animComp.playAnimation(targetAnimName, true, timeScale, 0.2, false, p);
        }
    }
    /**朝向更新处理 */
    protected updateFaceDirection() {
        //3D朝向更新
        if (!this.ModelNode) return;
        if (this.CharacterTag == CharacterTag.Wall || this.CharacterTag == CharacterTag.Build) return;
        if (this.moveComp?.isInKnockbackState) return;
        //NOTE: Boss/精英(Elite)：攻击状态(Attack)下不更新朝向, 以配合攻击落空(attack miss)机制(挥击方向与面向解耦)
        if (
            (this.CharacterTag === CharacterTag.Boss || this.CharacterTag === CharacterTag.Elite) &&
            this.statusComp.currentState === CharacterStatus.Attack) {
            return;
        }

        // 根据当前状态决定目标朝向(优先级：攻击/技能 > 移动 > 保持上次朝向)
        switch (this.statusComp.currentState) {
            case CharacterStatus.Attack:
            case CharacterStatus.Skill:
                if (this.CharacterTag !== CharacterTag.Boss) {
                    // 攻击和技能状态优先使用目标方向
                    const targetDir = this.getAttackTargetDirection();
                    if (targetDir && !Vec3.equals(targetDir, Vec3.ZERO)) {
                        this._targetDirection = targetDir;
                        Vec3.copy(this._lastValidDirection, targetDir);
                    } else if (this.shouldFallbackToMoveDirectionWhenNoAttackTarget() && this.moveComp?.isMoving) {
                        // 如果没有目标但正在移动, 使用移动方向
                        this._targetDirection = this.moveComp.direction;
                        Vec3.copy(this._lastValidDirection, this._targetDirection);
                    }
                }
                // 否则保持上次朝向
                break;

            case CharacterStatus.Move:
                if (this.moveComp?.isMoving) {
                    this._targetDirection = this.moveComp.direction;
                    Vec3.copy(this._lastValidDirection, this._targetDirection);
                }
                break;
            case CharacterStatus.Work:
                //此状态下不更新朝向
                return;
            default:
                // 空闲等其他状态, 保持最后有效的朝向
                this._targetDirection = this._lastValidDirection;
                break;
        }
        if (!this._targetDirection || Vec3.equals(this._targetDirection, Vec3.ZERO)) {
            return;
        }

        const currentQuat = this.ModelNode.getWorldRotation();
        const targetQuat = this.calculateRotationFromDirection(this._targetDirection);
        if (Quat.equals(currentQuat, targetQuat)) return;

        const newQuat = quat();
        Quat.slerp(newQuat, currentQuat, targetQuat, this._rotationSpeed * 0.016);
        this.ModelNode.setWorldRotation(newQuat);
    }

    /**
     * 攻击/技能状态下当攻击目标方向不可用时, 是否允许回退到移动方向。
     * 默认返回 true 以保持原行为；子类(如远程主角)可在目标重选宽限期内返回 false, 避免死亡瞬间“弱转向”。
     */
    protected shouldFallbackToMoveDirectionWhenNoAttackTarget(): boolean {
        return true;
    }
    // 工具方法, 计算方向向量的旋转四元数(仅绕Y轴旋转, 忽略XZ轴)
    protected calculateRotationFromDirection(direction: Vec3): Quat {
        // // 只在XZ平面上计算朝向, 忽略Y轴高度差异
        const flatDirection = v3(direction.x, 0, direction.z);

        // 如果方向向量为零, 返回单位四元数
        if (Vec3.equals(flatDirection, Vec3.ZERO)) {
            return Quat.IDENTITY.clone();
        }

        // 计算绕Y轴的旋转角度(使用atan2)
        const angle = Math.atan2(flatDirection.x, flatDirection.z);

        // 创建只绕Y轴旋转的四元数
        const _quat = quat();
        Quat.fromAxisAngle(_quat, v3(0, 1, 0), angle);
        return _quat;
    }
    /**获取节点当前朝向, 默认节点正方向为Z轴正方向 */
    protected getNodeForwardDirection(node: Node): Vec3 {
        if (!node) return Vec3.ZERO;
        // 获取节点的旋转四元数
        const rotation = node.getRotation();
        // 创建一个前向向量 (0, 0, 1)
        const forward = v3(0, 0, 1);
        // 使用四元数旋转前向向量
        Vec3.transformQuat(forward, forward, rotation);
        // 确保向量是单位向量
        Vec3.normalize(forward, forward);
        return forward;
    }
    // 移动接口
    public moveByDirection(direction: Vec3) {
        if (this.statusComp.currentState === CharacterStatus.Dead) return;
        if (this.moveComp) {
            this.moveComp.move(direction, this.moveComp.baseSpeed);
        }
    }
    /**移动到目标点位
     * 
     * 处于攻击状态, 怪物将不触发移动事件, 用于实现无视距离的强制攻击目标, 要移动先调用stopAttack
     */
    public moveToWorldPosition(worldPosition: Vec3, speed?: number) {
        if (!this.moveComp) return;
        if (this.statusComp.currentState === CharacterStatus.Dead) return;
        if (this.statusComp.currentState === CharacterStatus.Work) return;

        this.moveComp.moveToWorldPosition(worldPosition, speed);
    }
    /**
     * 目标点到达后的自定义行为
     */
    protected onTargetReached() {
        this.moveStateChange();
        // 由子类实现
    }
    /**移动状态切换 */
    protected moveStateChange() {
        if (!this.moveComp) return;
        if (this.statusComp.currentState === CharacterStatus.Dead) return;
        if (this.statusComp.currentState === CharacterStatus.Attack) return;
        // 主角原地释放技能
        if (this.statusComp.currentState === CharacterStatus.Skill && this.CharacterTag === CharacterTag.Player) {
            this.stopMove();
            return;
        }
        if (this.statusComp.currentState === CharacterStatus.Work) {
            this.stopMove();
            return;
        }
        // 移动释放技能
        if (this.statusComp.currentState === CharacterStatus.Skill && this.CharacterTag === CharacterTag.Ally) return;
        const targetState = this.moveComp.isMoving ? CharacterStatus.Move : CharacterStatus.Idle;
        if (this.statusComp.currentState !== targetState) {
            this.statusComp.changeState(targetState);
        }
    }
    public stopMove() {
        if (!this.moveComp) return;
        this.moveComp.stop();
    }

    /**
     * 停止主动移动(但保留击退效果)
     */
    protected stopActiveMovement() {
        if (!this.moveComp) return;
        this.moveComp.stopActiveMovement();
    }
    // 技能接口
    public onCastSkill() {
        if (!this.skillComp || !this.skillComp.canCastSkill() ||
            !this.isCoolDown ||
            this.battleValComp.currentSkillTime > 0 ||
            this.statusComp.currentState === CharacterStatus.Dead) return;
        this.statusComp.changeState(CharacterStatus.Skill);
    }
    /** 工作状态, 禁止移动, 动作结束后恢复到待机状态 */
    public onWork() {
        if (this.statusComp.currentState === CharacterStatus.Work) return;
        this.statusComp.changeState(CharacterStatus.Work);
    }
    /** 攻击结束延迟标记: 由子类请求, 在下一次攻击循环结束时自动退出攻击 */
    protected _pendingExitAttack: boolean = false;
    /** 请求在当前攻击循环结束后退出攻击 */
    public requestExitAttackAfterLoop(): void {
        if (this.statusComp && this.statusComp.currentState === CharacterStatus.Attack) {
            this._pendingExitAttack = true;
        }
    }
    // 攻击接口
    public attack() {
        if (!this.attackComp) return;
        if (this.statusComp.currentState === CharacterStatus.Attack ||
            this.statusComp.currentState === CharacterStatus.Skill ||
            this.statusComp.currentState === CharacterStatus.Dead) return;

        this.statusComp.changeState(CharacterStatus.Attack);
    }
    // 死亡处理
    public onDead() {
        if (this.statusComp.currentState === CharacterStatus.Dead) return;

        this.statusComp.changeState(CharacterStatus.Dead);
    }
    public stopAttack() {
        if (this.statusComp.currentState === CharacterStatus.Attack) {
            if (this.moveComp?.isMoving) {
                this.statusComp.changeState(CharacterStatus.Move);
            } else {
                this.statusComp.changeState(CharacterStatus.Idle);
            }
        }
        this._pendingExitAttack = false;
    }
    /**
     * 击退
     * @param pos 击退位置
     * @param force 击退力度
     */
    public knockback(pos: Vec3, force: number, fallbackDir?: Readonly<Vec3>) {
        if (this.moveComp) {
            this.moveComp.knockback(pos, force, fallbackDir);
        }
    }

    /**
     * 击退结束后的处理(基类通用逻辑)
     * 子类可重写实现自己的特定行为
     */
    protected onKnockbackEnd(): void {
        // 延迟一帧处理, 确保击退状态完全结束
        this.scheduleOnce(() => {
            // 如果在死亡状态, 不做处理
            if (this.statusComp && this.statusComp.currentState === CharacterStatus.Dead) {
                return;
            }
            // 调用子类实现的击退结束处理
            this.onKnockbackEndBehavior();
        }, 0);
    }

    /**
     * 击退结束后的行为处理(子类可重写实现特定行为)
     * 不同角色类型在击退结束后可能有不同的行为
     */
    protected onKnockbackEndBehavior(): void {
        // 默认实现：什么都不做
        // 子类可重写实现特定行为
    }
    // 伤害处理
    public onHurt(damage: number, damageSource?: DamageSource): boolean {
        if (this.statusComp?.currentState === CharacterStatus.Dead) {
            return false;
        }
        if (this.battleValComp) {
            this.lastDamageSource = damageSource;
            this.lastDamageSource.damageValue = damage;

            let real = 1;
            if (this.CharacterTag == CharacterTag.Monster || this.CharacterTag == CharacterTag.Elite) {
                //英雄等级小于怪物等级,受伤降低
                real = damageSource.level >= this.battleValComp.level ? 1 : 0.01;
            }
            if (this.CharacterTag == CharacterTag.Player) {
                //英雄等级小于怪物, 受伤翻倍
                real = damageSource.level > this.battleValComp.level ? 20 : 1
            }
            damage = Math.floor(damage * real * 100) * 0.01;
            let v = this.battleValComp.takeDamage(damage);
            if (v && this.visualFeedbackComp) {
                //死亡时不闪红
                if (!this.isDead) {
                    this.visualFeedbackComp.showDamageEffect();
                }
            }
            return v;
        }
        return false;
    }

    // 治疗方法
    public onHeal(value: number, isPercent: boolean = false): boolean {
        if (this.statusComp.currentState === CharacterStatus.Dead) return false;
        if (this.battleValComp) {
            let v = this.battleValComp.heal(value, isPercent);
            return v;
        }
        return false;
    }

    // 复活方法
    public onRevive(percent?: number) {
        this.statusComp?.reset();
        if (this.battleValComp) {
            this.battleValComp.reviveByPercent(percent);
        }
    }
    /**
     * 强制立即死亡(进入 Dead 状态并播死亡动画)
     * 有 battleValComp 且已绑定 onDead 监听时走数值死亡；否则直接切换状态机(适用于无血量组件的士兵)
     */
    public promptlyDead() {
        if (this.battleValComp?.onCharacterListener?.onDead) {
            this.battleValComp.promptlyDead();
            return;
        }
        this.onDead();
    }
    /**
     * 技能效果(抽象方法, 由子类实现)
     */
    protected abstract castSkillEffect(): void;


    public onSkillCoolDown() {
        this.isCoolDown = true;
    }
    public set isCoolDown(isCoolDown: boolean) {
        if (this.skillComp) {
            this.skillComp.isCoolDown = isCoolDown;
        }
    }
    public get isCoolDown(): boolean {
        return this.skillComp?.isCoolDown || false;
    }

    public get isDead(): boolean {
        return this.battleValComp && this.battleValComp.isDead;
    }

    /** AABB x半宽(子弹碰撞, 子类可 override) */
    public get collisionHalfX(): number {
        //NOTE: 用于模拟物理碰撞的半宽, 子类可 override
        return 0.23;
    }

    /** AABB z半深(子弹碰撞, 子类可 override) */
    public get collisionHalfZ(): number {
        return 0.23;
    }

    /** 子弹命中回调(模拟碰撞用) */
    public onBulletHit(damage: number, from: Node): void {
        this.onHurt(damage, {
            fromCharacterTag: CharacterTag.Player,
            attackType: AttackType.Bullet,
            node: from,
            uuid: from.uuid,
            level: GameInfo.instance.player?.battleValComp?.level ?? 0,
        });
    }

    public get isInvincible(): boolean {
        return this.battleValComp ? this.battleValComp.isInvincible : false;
    }
    /**设置无敌状态 */
    public setInvincible(duration: number = 0) {
        if (this.battleValComp) {
            this.battleValComp.setInvincible(duration);
        }
    }

    public cancelInvincible() {
        if (this.battleValComp) {
            this.battleValComp.cancelInvincible();
        }
    }
    /**设置移动速度乘数 */
    public setMoveSpeedMultiplier(scale: number) {
        if (this.moveComp) {
            this.moveComp.setSpeed(this.moveComp.baseSpeed * scale);
        }
    }
    /**初始化动画速率 */
    protected initAnimationTimeScale() {
        if (!this.attackComp) return;
        // 计算攻击动画的timeScale, 使其播放时间刚好等于攻击动画实际时长
        const baseDuration = this.attackComp.attackAnimDuration;
        const baseSkillDuration = 2;
        this._attackTimeScale = this.animComp.calculateTimeScale(baseDuration, this.animComp.getAttackAnimName());
        if (this.CharacterTag == CharacterTag.Player || this.CharacterTag == CharacterTag.Ally ||
            this.CharacterTag == CharacterTag.Soldier) {
            this._runAttackTimeScale = this.animComp.calculateTimeScale(baseDuration, this.animComp.getMoveAttackAnimName());
        }
        if (this.CharacterTag == CharacterTag.Player || this.CharacterTag == CharacterTag.Ally) {
            this._skillTimeScale = this.animComp.calculateTimeScale(baseSkillDuration, this.animComp.getSkillAnimName());
        }
        if (this.CharacterTag == CharacterTag.Ally) {
            // console.log(this.node.name, `攻击动画timeScale计算:${this._attackTimeScale},`, `移动攻击动画timeScale计算:${this._runAttackTimeScale},`, `技能动画timeScale计算:${this._skillTimeScale}`);
        }
    }
    /**检查所有倍率设置 */
    private checkAndUpdateDirtyValues(): void {
        if (this._isDirtyAniTimeScale) {
            this.setSkeletonTimeScale();
            this._isDirtyAniTimeScale = false;
        }
    }
    private setSkeletonTimeScale(): void {
        if (!this.attackComp || !this.animComp) return;
        this.animComp.setTimeScale(this._globalTimeScale);
    }
    // 公共接口
    public setGlobalScale(scale: number): void {
        this._globalTimeScale = Math.max(0.1, scale);
        this._isDirtyAniTimeScale = true;
        /* notice: 
         此处可以扩展单个实时动画播放速度, 比如技能动画
         或者全局/单个属性增加减少, 利用脏标记实现异步更新
         */
    }
    /**
     * 计算到目标节点的平方距离(3D忽略Y轴, 2D忽略Z轴)
     */
    protected getSquaredDistanceTo(targetNode: Node): number {
        const isD3 = GameInfo.SceneType === SceneType.D3;
        const dx = targetNode.worldPosition.x - this.node.worldPosition.x;
        const dy = isD3
            ? targetNode.worldPosition.z - this.node.worldPosition.z
            : targetNode.worldPosition.y - this.node.worldPosition.y;
        return dx * dx + dy * dy;
    }

    /**
     * 获取潜在目标列表(抽象方法, 由子类实现)
     */
    protected abstract getPotentialTargets(): CharacterBase[];
    // NOTE
    /**
     * 更新最近目标(默认在攻击范围内, 子类可重写使用其他范围)
     */
    protected updateNearestTarget(): void {
        this.trackingTimer = 0;
        // 优先使用强制目标
        if (this.forcedTarget) {
            // 如果强制目标已死亡, 自动清除
            if (this.forcedTarget.isDead) {
                this.clearForcedTarget();
            } else {
                // 强制目标有效, 直接使用
                this.atkTarget = this.forcedTarget;
                return;
            }
        }

        // 没有强制目标时, 执行普通追踪逻辑
        const potentialTargets = this.getPotentialTargets();
        let minDistanceSq = Infinity;
        let nearestTarget: CharacterBase | null = null;

        // 默认使用攻击范围, 子类可以重写此方法使用不同的范围
        const targetRangeSq = this.getTargetRange();

        for (const target of potentialTargets) {
            if (target.isDead) continue;

            const distanceSq = this.getSquaredDistanceTo(target.node);
            if (distanceSq < minDistanceSq && distanceSq < targetRangeSq) {
                minDistanceSq = distanceSq;
                nearestTarget = target;
            }
        }

        this.onTargetChanged(nearestTarget);
        this.atkTarget = nearestTarget;
    }
    /**获取目标范围 */
    protected getTargetRange() {
        //默认以攻击范围搜索, 子类可重写改为其他范围
        return this.getTargetAttackRange();
    }
    public clearTarget() {
        this.atkTarget = null;
        this.stopAttack();
    }
    /**
     * 设置强制目标(优先级高于普通追踪)
     * @param target 强制锁定的目标
     */
    public setForcedTarget(target: CharacterBase | null): void {
        this.forcedTarget = target;
        if (target) {
            this.atkTarget = target;
        }
    }
    /**
     * 清除强制目标
     */
    public clearForcedTarget(): void {
        this.forcedTarget = null;
        // 清除强制目标后, 也清除当前攻击目标, 让下次更新重新追踪
        this.atkTarget = null;
    }
    /**
     * 获取攻击范围
     */
    protected getTargetAttackRange(): number {
        return this.attackComp.attackRange * this.attackComp.attackRange;
    }
    /**
     * 获取视野范围
     */
    protected getTargetSearchRange(): number {
        return this.attackComp.visionRange * this.attackComp.visionRange;
    }
    /**
     * 目标改变时的回调(子类可重写处理额外逻辑)
     */
    protected onTargetChanged(newTarget: CharacterBase | null): void {
        // 子类可重写
    }

    /**
     * 是否应该更新目标(子类可重写以优化性能)
     */
    protected shouldUpdateTarget(): boolean {
        return true;
    }

    /**
     * 获取攻击目标方向
     */
    protected getAttackTargetDirection(): Vec3 | null {
        if (!this.atkTarget || this.atkTarget.isDead) return null;
        const direction = v3();
        Vec3.subtract(direction, this.atkTarget.ModelNode.worldPosition, this.node.worldPosition);
        Vec3.normalize(direction, direction);
        return direction;
    }

    /**获取攻击方向 */
    protected getAttackDirection(): Vec3 | null {
        // 如果启用自动攻击, 角色朝向
        if (GameInfo.SceneType === SceneType.D3 && this.ModelNode) {
            return this.getModelForwardDirection();
        }
        // 否则使用索敌方向
        return this.getAttackTargetDirection();
    }
    /**获取角色朝向 */
    protected getModelForwardDirection(): Vec3 {
        if (!this.ModelNode) return Vec3.ZERO;
        const dir = this.ModelNode.forward;
        dir.z *= -1;
        dir.x *= -1;
        return dir;
    }
    /**
     * 特效处理
     */
    protected handleAttack(attackInfo: AttackInfo) {
        const dir = this.getAttackDirection();
        if (!dir) return;
        // attackInfo.damageSource 可能已带有 type/attackType
        const fullAttackInfo: AttackInfo = {
            ...attackInfo,
            direction: dir,
            damageSource: {
                ...attackInfo.damageSource,
                // 近战/技能等可在此补充 attackType
                attackType: attackInfo.type,
                level: this.battleValComp?.level || 0,
                extra: this.node.name || '',
            },
        };
        if (attackInfo.type === AttackType.Melee) {
            this.handleMeleeAttack(fullAttackInfo);
        } else if (attackInfo.type === AttackType.Bullet) {
            this.handleRangedAttack(attackInfo.worldPos, fullAttackInfo);
        } else if (attackInfo.type === AttackType.Slash) {
            this.handleSlashAttack(attackInfo.worldPos, fullAttackInfo);
        }
    }

    /**
     * 处理近战攻击, 直接造成伤害调用目标的onHurt
     */
    protected handleMeleeAttack(attackInfo: AttackInfo): void {
        // 近战直接调用 onHurt(如有需要)
        // 由子类继承实现
    }
    /**
     * 处理挥砍攻击, 生成特效, 特效碰撞造成伤害
     */
    protected handleSlashAttack(wpos: Vec3, attackInfo: AttackInfo): void {
        if (this.statusComp?.currentState != CharacterStatus.Attack) return;
        if (this.attackComp) {
            this.attackComp.createSlashEffect(this.node, wpos, attackInfo.direction, attackInfo.damageSource.level, attackInfo.damageSource);
        }
    }

    /**
     * 处理远程攻击, 若子弹发射位置与角色位置不一致, 可以子类覆写传入位置
     */
    protected handleRangedAttack(wpos: Vec3, attackInfo: AttackInfo): void {
        if (this.attackComp) {
            this.attackComp.createBullet(wpos, attackInfo.direction, attackInfo.damageSource);
        }
        // if (this.CharacterTag == CharacterTag.Ally) {
        //     // AudioMgr.instance.playSound(SoundEnum.sound_wand_attack);
        // }
        // if (this.CharacterTag == CharacterTag.Soldier) {
        //     // AudioMgr.instance.playSound(SoundEnum.sound_archer_attack);
        // }
    }
    /**技能动画蓄力特效 */
    protected enableSkillEffect() {
        GameInfo.instance.prefabMgr.createChargedEffect(this.node);
    }
}
