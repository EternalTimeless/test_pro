import { _decorator, Label, MeshRenderer, v3, Vec3 } from 'cc';
import { CharacterBase, MeshFlashData } from './CharacterBase';
import { AttackInfo, AttackType, DamageSource, GameInfo } from '../Common/GameInfo';
import { CharacterStatus, CharacterTag, ColliderGroupTag, CommonEvent } from '../Common/CommonEnum';
import { AudioMgr, SoundEnum } from '../Core/Managers/AudioMgr';
import { ColliderTag } from '../Other/ColliderTag';
import { BulletBrand } from '../Other/BulletBrand';

const { ccclass, property } = _decorator;

/** 怪物阶段移动：stage2 推进 → stage1~stage0 打牌 → stage0 追主角 */
export enum MonsterMovePhase {
    /** stage2 段：固定 +Z 推进，不索敌 */
    ToStage2,
    /** stage1~stage0 段：+Z 推进并索敌翻倍牌 */
    AdvanceBrand,
    /** stage0 及以后：追主角 */
    ChaseHero,
}

/** 固定 +Z 行军方向 */
const MARCH_DIR = v3(0, 0, 1);

@ccclass('EnemyCharacter')
export class EnemyCharacter extends CharacterBase {

    // ==================== 闪红效果 ====================
    @property({ type: [MeshFlashData], tooltip: '闪红MeshRenderer配置列表, 可在属性检查器中编辑' })
    public meshGrayDataList: MeshFlashData[] = [];
    @property({ type: [MeshFlashData], tooltip: '闪红MeshRenderer配置列表, 可在属性检查器中编辑' })
    public meshRedDataList: MeshFlashData[] = [];
    @property({ type: [MeshFlashData], tooltip: '闪红MeshRenderer配置列表, 可在属性检查器中编辑' })
    public meshCreateDataList: MeshFlashData[] = [];

    @property({ type: Label, visible() { return this.CharacterTag === CharacterTag.Boss; } })
    public lab_hp: Label | null = null;

    @property({ type: MeshRenderer, displayName: '模型渲染器', tooltip: '死亡溶解材质 MeshRenderer', visible: false })
    public meshRenderer: MeshRenderer | null = null;

    public initX: number = 0;
    public movePhase: MonsterMovePhase = MonsterMovePhase.ToStage2;

    private readonly _brandTargets: BulletBrand[] = [];
    private readonly _brandScratch: CharacterBase[] = [];
    /** 战斗距离检测计时（与基类 trackingTimer 分离，用于 trackToTarget） */
    private _combatTrackingTimer: number = 0;
    private _deadDissolveFallbackTimer: number = 0;
    private readonly _deadDissolveFallbackMax: number = 2;

    onLoad() {
        super.onLoad();
        this._moveTimeScale = 0.75;
    }

    protected onEnable(): void {
        this.initData();
    }

    initData() {
        super.initData();
        this.atkTarget = null;
        this.movePhase = MonsterMovePhase.ToStage2;
        this._combatTrackingTimer = 0;
        this.resetDissolveState();
        this._deadDissolveFallbackTimer = 0;
        this.syncColliderGroupTag();
        this.registerCollision();
        if (this.lab_hp && this.battleValComp) {
            this.lab_hp.string = String(Math.ceil(this.battleValComp.currentHealth));
        }
    }

    protected getDissolveMeshRenderer(): MeshRenderer | null {
        return this.meshRenderer;
    }

    /** 生成后置于 stage2 后方，以 +Z 方向推进 */
    public beginMarchFromSpawn(localX: number, localZ: number) {
        this.initX = localX;
        this.node.setPosition(localX, 0, localZ);
        this.movePhase = MonsterMovePhase.ToStage2;
        this.atkTarget = null;
    }

    /** 引导阶段：停止移动并切换为待机 */
    public enterGuideIdle() {
        this.stopMove();
        if (this.statusComp && this.statusComp.currentState !== CharacterStatus.Dead) {
            this.statusComp.changeState(CharacterStatus.Idle);
        }
    }

    private syncColliderGroupTag() {
        let tag = ColliderGroupTag.Monster;
        if (this.CharacterTag === CharacterTag.Boss) {
            tag = ColliderGroupTag.Boss;
        } else if (this.CharacterTag === CharacterTag.Elite) {
            tag = ColliderGroupTag.Elite;
        } else if (this.CharacterTag === CharacterTag.ZombieA || this.CharacterTag === CharacterTag.ZombieB) {
            tag = ColliderGroupTag.Zombie;
        }
        let comp = this.node.getComponent(ColliderTag);
        if (!comp) {
            comp = this.node.addComponent(ColliderTag);
        }
        comp.tag = tag;
    }

    private registerCollision() {
        GameInfo.instance.simulationCollisionMgr.registerTarget(this);
    }

    private unregisterCollision() {
        GameInfo.instance.simulationCollisionMgr.unregisterTarget(this);
    }

    /** stage1 及以上才启用索敌，stage2 段零开销 */
    protected shouldUpdateTarget(): boolean {
        if (this.statusComp.currentState === CharacterStatus.Attack) {
            return false;
        }
        const mgr = GameInfo.instance.monsterMgr;
        if (!mgr) {
            return false;
        }
        return this.node.worldPosition.z >= mgr.stage1;
    }

    protected getPotentialTargets(): CharacterBase[] {
        const mgr = GameInfo.instance.monsterMgr;
        if (!mgr) {
            return [];
        }
        const mz = this.node.worldPosition.z;

        if (mz >= mgr.stage0) {
            const hero = GameInfo.instance.player;
            return hero && !hero.isDead ? [hero] : [];
        }

        if (mz >= mgr.stage1) {
            const sim = GameInfo.instance.simulationCollisionMgr;
            if (!sim) {
                return [];
            }
            this._brandScratch.length = 0;
            sim.collectNearbyBrands(mz, this._brandTargets);
            for (let i = 0; i < this._brandTargets.length; i++) {
                this._brandScratch.push(this._brandTargets[i]);
            }
            return this._brandScratch;
        }

        return [];
    }

    /** 索敌使用视野范围，攻击距离由 trackToTarget 单独判断 */
    protected getTargetRange() {
        return this.getTargetSearchRange();
    }

    update(dt: number) {
        if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin) {
            return;
        }
        if (!this.ModelNode) return;
        if (GameInfo.instance.guideMgr?.isGuideMonster) {
            return;
        }
        if (this.isPause && GameInfo.instance.Pause) return;
        if (this.isPause && !GameInfo.instance.Pause) {
            this.isPause = false;
            this.animComp?.resumeAnimation();
        }

        if (this.isDissolving) {
            this.tickDissolve(dt);
            return;
        }
        if (this.isDead) {
            return;
        }

        super.update(dt);

        this.tickPhaseTransitionByZ();

        if (this.statusComp.currentState === CharacterStatus.Attack) {
            return;
        }
        if (this.moveComp?.isInKnockbackState) {
            return;
        }

        if (this.attackComp) {
            this._combatTrackingTimer += dt;
            if (this._combatTrackingTimer >= this.attackComp.trackingUpdateInterval) {
                this.trackToTarget();
            }
        }

        this.tickPhaseMovement();
    }

    protected castSkillEffect(): void { }

    protected onDeadUpdate(dt: number) {
        if (this.isDissolving || !this.getDissolveMeshRenderer()) return;
        this._deadDissolveFallbackTimer += dt;
        if (this._deadDissolveFallbackTimer >= this._deadDissolveFallbackMax) {
            this.onDeathAnimationFinished();
        }
    }

    /** 按 Z 坐标切换阶段（不依赖 moveToWorldPosition 到达） */
    private tickPhaseTransitionByZ() {
        const mgr = GameInfo.instance.monsterMgr;
        if (!mgr) return;

        const mz = this.node.worldPosition.z;

        if (this.movePhase === MonsterMovePhase.ToStage2 && mz >= mgr.stage1) {
            this.applyConvergeX();
            this.movePhase = MonsterMovePhase.AdvanceBrand;
            return;
        }

        if (this.movePhase === MonsterMovePhase.AdvanceBrand && mz >= mgr.stage0) {
            this.movePhase = MonsterMovePhase.ChaseHero;
            if (this.shouldUpdateTarget()) {
                this.updateNearestTarget();
            }
        }
    }
    //TODO: 后续优化: 汇集需要朝向汇集点走过去, 需要有个过程, 而不是直接设置坐标, 此处需要打断原有方向移动链路, 到达汇集点后再恢复, 例如:　提前2个单位开始改为moveToWorldPosition, 到达后恢复原有方向移动链路, 可以让汇集更加自然
    /** 到达 stage1 时 X 轴汇聚到 disX2 比例，不中断 +Z 推进 */
    private applyConvergeX() {
        const mgr = GameInfo.instance.monsterMgr;
        const mx = this.node.worldPosition.x;
        const x = (mx / mgr.disX) * mgr.disX2;
        this.initX = x;
        const wp = this.node.worldPosition;
        this.node.setWorldPosition(x, wp.y, wp.z);
    }

    /** 按阶段决定移动方式（战斗停攻由 trackToTarget 负责） */
    private tickPhaseMovement() {
        if (this.statusComp.currentState === CharacterStatus.Attack) {
            return;
        }
        if (this.isInAttackRangeOfTarget()) {
            return;
        }

        const mgr = GameInfo.instance.monsterMgr;
        if (!mgr) return;

        switch (this.movePhase) {
            case MonsterMovePhase.ToStage2:
            case MonsterMovePhase.AdvanceBrand:
                if (this.moveComp) {
                    this.moveComp.move(MARCH_DIR, mgr.monsterSpeed);
                }
                break;
            case MonsterMovePhase.ChaseHero: {
                const hero = GameInfo.instance.player;
                if (!hero || hero.isDead) {
                    return;
                }
                this.moveToWorldPosition(hero.node.worldPosition.clone(), mgr.monsterSpeed);
                break;
            }
        }
    }

    private isInAttackRangeOfTarget(): boolean {
        if (!this.atkTarget || this.atkTarget.isDead) {
            return false;
        }
        return this.getSquaredDistanceTo(this.atkTarget.node) <= this.getTargetAttackRange();
    }

    /** 距离判断：够近则停攻，不负责位移 */
    private trackToTarget() {
        this._combatTrackingTimer = 0;
        if (this.moveComp?.isInKnockbackState) {
            return;
        }
        if (this.statusComp?.currentState === CharacterStatus.Attack) {
            return;
        }
        if (!this.atkTarget || this.atkTarget.isDead) {
            if (this.atkTarget?.isDead) {
                this.clearTarget();
            }
            return;
        }

        const distanceSq = this.getSquaredDistanceTo(this.atkTarget.node);
        const visionRangeSq = this.getTargetSearchRange();

        if (distanceSq > visionRangeSq) {
            this.clearTarget();
            return;
        }

        if (distanceSq <= this.getTargetAttackRange()) {
            this.stopActiveMovement();
            this.attack();
        }
    }

    /** 攻击循环结束后重新评估是否继续攻击 */
    private checkNextAtk() {
        if (!this.atkTarget || this.atkTarget.isDead) {
            this.stopAttack();
            this.clearTarget();
            if (this.shouldUpdateTarget()) {
                this.updateNearestTarget();
            }
            return;
        }

        const distanceSq = this.getSquaredDistanceTo(this.atkTarget.node);
        if (distanceSq > this.getTargetAttackRange()) {
            this.stopAttack();
            this.clearTarget();
            if (this.shouldUpdateTarget()) {
                this.updateNearestTarget();
            }
        }
    }

    protected onTargetReached() {
        this.moveStateChange();
    }

    protected onAttackExit() {
        super.onAttackExit();
        this.checkNextAtk();
    }

    protected onLoopAnimationComplete(animName?: string): void {
        super.onLoopAnimationComplete(animName);
        if (this.statusComp?.currentState === CharacterStatus.Dead) {
            return;
        }
        this.checkNextAtk();
    }

    protected onKnockbackEndBehavior(): void {
        if (this.statusComp?.currentState === CharacterStatus.Attack) {
            return;
        }
        if (this.attackComp) {
            this.trackToTarget();
        }
    }

    public clearTarget() {
        this.atkTarget = null;
        this.stopAttack();
        this.stopActiveMovement();
    }

    protected handleMeleeAttack(attackInfo: AttackInfo): void {
        if (!this.atkTarget || this.atkTarget.isDead) {
            return;
        }

        const distance = Vec3.distance(attackInfo.worldPos, this.atkTarget.node.worldPosition);
        if (distance > attackInfo.range) {
            return;
        }

        const roll = this.attackComp
            ? this.attackComp.rollDamage(attackInfo.damage)
            : { value: attackInfo.damage, isCritical: false };

        this.atkTarget.onHurt(roll.value, {
            fromCharacterTag: this.CharacterTag,
            attackType: AttackType.Melee,
            level: this.battleValComp?.level ?? 0,
            node: this.node,
            uuid: this.node.uuid,
            isCritical: roll.isCritical,
        });

        if (this.CharacterTag === CharacterTag.Boss) {
            AudioMgr.instance.playSound(SoundEnum.Sound_MonsterDie, 0.6);
        }
    }

    public onHurt(damage: number, damageSource?: DamageSource): boolean {
        const v = super.onHurt(damage, damageSource);
        if (v) {
            if (this.lab_hp && this.battleValComp) {
                this.lab_hp.string = String(Math.ceil(this.battleValComp.currentHealth));
            }
        }
        return v;
    }

    protected onDeadEnter() {
        this.unregisterCollision();
        this.clearTarget();
        if (this.CharacterTag === CharacterTag.Monster) {
            GameInfo.instance.monsterMgr.deleteMonster(this.node.uuid);
        } else if (this.CharacterTag === CharacterTag.Elite || this.CharacterTag === CharacterTag.Boss) {
            GameInfo.instance.monsterMgr.deleteElite(this.node.uuid);
            if (this.CharacterTag === CharacterTag.Boss) {
                GameInfo.instance.monsterMgr.onBossKilled();
            }
        }
        if (this.lab_hp) this.lab_hp.string = '';
        AudioMgr.instance.playSound(
            SoundEnum.Sound_MonsterDie,
            this.CharacterTag === CharacterTag.Boss ? 0.7 : 0.4
        );
        app.event.emit(CommonEvent.EnemyDead, {
            worldPos: this.node.worldPosition.clone(),
            hurtFrom: this.lastDamageSource,
            characterTag: this.CharacterTag,
        });
        this.visualFeedbackComp?.applyDamageEffectDeathGrayscale();
        super.onDeadEnter();
    }

    protected onAnimationComplete() {
        if (this.statusComp?.currentState === CharacterStatus.Dead) {
            if (this.getDissolveMeshRenderer()) {
                this.onDeathAnimationFinished();
            } else {
                GameInfo.instance.prefabMgr.recoverPrefab(this.node);
            }
            return;
        }
        super.onAnimationComplete();
    }
}
