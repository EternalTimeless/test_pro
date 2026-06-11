import { _decorator, Collider, CCFloat, easing, ICollisionEvent, ITriggerEvent, Node, ParticleSystem, tween, v3, Vec3 } from 'cc';
import { CharacterBase, MeshFlashData } from './CharacterBase';
import { RoleSoldier } from './RoleSoldier';
import { ColliderGroupTag, CommonEvent, BuildUnlockState, PrefabPathEnum, CharacterStatus } from '../Common/CommonEnum';
import { ItemContainer } from '../Common/ItemContainer';
import { AudioMgr, SoundEnum } from '../Core/Managers/AudioMgr';
import { VirtualInput } from '../Common/VirtualInput';
import { GameInfo, Config, DamageSource, SceneType, AttackInfo } from '../Common/GameInfo';
import { CameraCtrl } from '../CharacterCtrl/CameraCtrl';
import { ColliderTag } from '../Other/ColliderTag';
const { ccclass, property } = _decorator;

/** 每名入队士兵贡献的人墙血量（与 BackUp Role.hp 一致） */
export const SOLDIER_HP = 2;

@ccclass('Hero')
export class Hero extends CharacterBase {
    /** 人墙世界 X 基础边界 ±8 */
    private static readonly HERO_BASE_MOVE_X = 7.8;
    private static readonly HERO_MOVE_X_EPS = 0.01;
    /** 当前 Hero 可移动 worldX 范围（随人墙局部 X 偏移动态收缩） */
    private _moveXMin = -Hero.HERO_BASE_MOVE_X;
    private _moveXMax = Hero.HERO_BASE_MOVE_X;

    // ==================== 闪红效果 ====================
    @property({ type: [MeshFlashData], tooltip: '闪红MeshRenderer配置列表, 可在属性检查器中编辑' })
    public meshGrayDataList: MeshFlashData[] = [];
    @property({ type: [MeshFlashData], tooltip: '闪红MeshRenderer配置列表, 可在属性检查器中编辑' })
    public meshRedDataList: MeshFlashData[] = [];
    @property({ type: [MeshFlashData], tooltip: '闪红MeshRenderer配置列表, 可在属性检查器中编辑' })
    public meshCreateDataList: MeshFlashData[] = [];

    @property({ type: Node, displayName: '背包节点' })
    public backpack: Node = null;
    public soldierList: RoleSoldier[] = [];
    @property({ type: CCFloat, displayName: '阵型每层人数' })
    public squadLayerCount: number = 8;
    @property({ type: CCFloat, displayName: '阵型圈半径步长' })
    public squadRoleR: number = 0.8;

    private originBackpackPos: Vec3 = v3(0, 0, 0);
    public goldContainer: ItemContainer = null!;
    private collisionMap: Map<number, Collider[]> = new Map();
    private unlockCheckTimer: number = 0;
    private skillTarget: CharacterBase | null = null;
    private _collider: Collider = null!;
    private timer: number = 0;
    private timerInterval: number = 0.5;
    /** 是否已进入人墙战斗（常驻 Attack） */
    private _squadCombatStarted: boolean = false;
    private readonly _tempLocalPos: Vec3 = v3();
    @property({ type: Node, displayName: '枪口节点' })
    shotNode: Node = null!;
    /** 当前武器等级, 子弹等级读取武器等级 */
    public curWeaponLevel: number = 0;
    onLoad(): void {
        super.onLoad();
        GameInfo.instance.player = this;
        this.originBackpackPos = this.backpack.position.clone();
        Object.values(ColliderGroupTag).forEach(tag => {
            if (typeof tag === 'number') {
                this.collisionMap.set(tag, []);
            }
        });
        this._collider = this.node.getComponent(Collider);
        if (this._collider) {
            this._collider.on(`onTriggerEnter`, this.onTriggerEnter, this);
            this._collider.on(`onTriggerStay`, this.onTriggerStay, this);
            this._collider.on(`onTriggerExit`, this.onTriggerExit, this);
            this._collider.on(`onCollisionEnter`, this.onCollisionEnter, this);
            this._collider.on(`onCollisionStay`, this.onCollisionStay, this);
            this._collider.on(`onCollisionExit`, this.onCollisionExit, this);
        }
    }

    protected start(): void {
        super.initData();
        for (let i = 0; i < this.soldierList.length; i++) {
            const s = this.soldierList[i];
            if (!s?.node?.isValid) continue;
            s.node.setParent(this.node);
            s.node.setPosition(this.getNextLocalPos(i));
        }
        this.syncSoldierAttackStats();
        this.initSquadHealth();
        //设置初始朝向, 朝向(0,0,-1)方向
        this._faceTarget();
        this.upMoveBoundary();
    }
    update(dt: number): void {
        super.update(dt);
        if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin || this.isDead) return;
        this.timer += dt;
        if (this.timer >= this.timerInterval) {
            this.timer = 0;
            this.updateGuideTarget();
        }

        const _dir = v3(0, 0, 0);
        if (GameInfo.SceneType == SceneType.D3) {
            //NOTE: 特殊事项:当前项目 只在X方向上移动, 不需要通过摄像机映射世界方向, 所以直接使用 VirtualInput.horizontal
            _dir.set(VirtualInput.horizontal, 0, 0);
            // _dir.set(VirtualInput.horizontal, 0, VirtualInput.vertical);
            // _dir.set(CameraCtrl.instance.convertInputToWorldDirection(_dir));
        } else {
            _dir.set(VirtualInput.horizontal, VirtualInput.vertical, 0);
        }
        this.applyHeroMoveBoundary(_dir);
        this.moveByDirection(_dir);

        if (this._squadCombatStarted) {
            if (this.skillTarget) {
                this.onCastSkill();
            }
            // 人墙：固定朝前循环攻击, 不索敌、不因无目标停火
            if (this.statusComp.currentState !== CharacterStatus.Attack &&
                this.statusComp.currentState !== CharacterStatus.Skill) {
                this.attack();
            }
            this.syncSoldierCombatAnim();
        }
        if (!CameraCtrl.instance.isCameraFollow) return;
        this.unlockCheckTimer += dt;
        if (this.unlockCheckTimer >= Config.UNLOCK_CHECK_INTERVAL) {
            this.unlockCheckTimer = 0;
            this.checkContainer();
            this.checkUnlock();
        }
    }

    lateUpdate(): void {
        if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin || this.isDead) return;
        const pos = this.node.worldPosition;
        const clampedX = Math.max(this._moveXMin, Math.min(this._moveXMax, pos.x));
        if (clampedX === pos.x) return;
        this.node.setWorldPosition(clampedX, pos.y, pos.z);
    }

    /**
     * 人墙移动边界：按士兵最远局部 X 收缩 Hero 可移动范围
     * 例：maxLocalX=0.8 -> 右边界 8-0.8=7.2；minLocalX=-1.2 -> 左边界 -8-(-1.2)=-6.8
     */
    public upMoveBoundary() {
        let maxLocalX = 0;
        let minLocalX = 0;
        for (let i = 0; i < this.soldierList.length; i++) {
            const soldier = this.soldierList[i];
            if (!soldier?.node?.isValid || soldier.isDismissed) continue;
            // 使用阵型目标局部 X，入队 tween 期间也能立即得到正确边距
            const lx = this.getNextLocalPos(i).x;
            if (lx > maxLocalX) maxLocalX = lx;
            if (lx < minLocalX) minLocalX = lx;
        }
        this._moveXMax = Hero.HERO_BASE_MOVE_X - maxLocalX;
        this._moveXMin = -Hero.HERO_BASE_MOVE_X - minLocalX;
    }

    /**
     * 阻止继续往 worldX 边界外移动
     * 贴边时按 VirtualInput.horizontal 判断内外：朝外清零，朝中心强制 world ±X，避免 dir.x 被误清后无法回中心
     */
    private applyHeroMoveBoundary(dir: Vec3): void {
        const wx = this.node.worldPosition.x;
        const h = VirtualInput.horizontal;
        const eps = Hero.HERO_MOVE_X_EPS;
        const atMax = wx >= this._moveXMax - eps;
        const atMin = wx <= this._moveXMin + eps;

        if (atMax) {
            if (h > 0) {
                dir.set(0, 0, 0);
                return;
            }
            if (h < 0) {
                dir.set(-1, 0, 0);
                return;
            }
        }
        if (atMin) {
            if (h < 0) {
                dir.set(0, 0, 0);
                return;
            }
            if (h > 0) {
                dir.set(1, 0, 0);
                return;
            }
        }
        if (dir.x > 0 && wx >= this._moveXMax - eps) {
            dir.x = 0;
        }
        if (dir.x < 0 && wx <= this._moveXMin + eps) {
            dir.x = 0;
        }
        if (dir.lengthSqr() < 1e-10) {
            dir.set(0, 0, 0);
        }
    }

    /** 注册士兵：挂到 Hero 下、更新血量与阵型 */
    public registerSoldier(soldier: RoleSoldier, worldSpawnPos?: Vec3) {
        if (!soldier || this.soldierList.includes(soldier)) return;
        soldier.node.setParent(this.node);
        if (worldSpawnPos) {
            const local = this.node.inverseTransformPoint(this._tempLocalPos, worldSpawnPos);
            soldier.node.setPosition(local);
            tween(soldier.node).to(0.2, { position: this.getNextLocalPos(this.soldierList.length) }).start();
        } else {
            soldier.node.setPosition(this.getNextLocalPos(this.soldierList.length));
        }
        this.soldierList.push(soldier);
        this.addSquadHp(SOLDIER_HP);
        this.syncSoldierAttackStats(soldier);
        if (this._squadCombatStarted) {
            soldier.enterCombatLoop(!!this.moveComp?.isMoving);
        }
        this.upSquadPositions();
        GameInfo.instance.soldier = soldier;
    }

    public unregisterSoldier(soldier: RoleSoldier, reposition: boolean = true) {
        const idx = this.soldierList.indexOf(soldier);
        if (idx === -1) return;
        this.soldierList.splice(idx, 1);
        if (reposition) {
            this.upSquadPositions();
        } else {
            this.upMoveBoundary();
        }
    }

    /** 从人墙移除并播死亡 -> 溶解 -> 回收（由 Hero 统一调度） */
    public dismissSoldier(soldier: RoleSoldier, reposition: boolean = false) {
        if (!soldier?.node?.isValid || soldier.isDismissed) return;
        this.unregisterSoldier(soldier, reposition);
        soldier.promptlyDead();
    }

    /** 全队进入攻击循环 */
    public enterSquadCombat() {
        this._squadCombatStarted = true;
        if (this.statusComp.currentState !== CharacterStatus.Attack &&
            this.statusComp.currentState !== CharacterStatus.Skill &&
            this.statusComp.currentState !== CharacterStatus.Dead) {
            this.attack();
        }
        const moving = !!this.moveComp?.isMoving;
        for (const s of this.soldierList) {
            if (!s?.node?.isValid) continue;
            s.enterCombatLoop(moving);
        }
    }

    /** 同步士兵站攻/跑攻（以 Hero 移动为准） */
    private syncSoldierCombatAnim() {
        const isMoving = !!this.moveComp?.isMoving;
        let progress: number | undefined;
        if (this.animComp && this.statusComp?.currentState === CharacterStatus.Attack) {
            progress = this.animComp.getCurAnimationProgress();
        }
        for (const s of this.soldierList) {
            if (!s?.node?.isValid || s.isDismissed) continue;
            s.syncCombatAnim(isMoving, progress);
        }
    }

    /** 将 Hero 攻击属性同步到士兵（攻速/伤害/弹速/子弹等级） */
    public syncSoldierAttackStats(soldier?: RoleSoldier) {
        const src = this.attackComp;
        if (!src) return;
        if (soldier) {
            soldier.syncAttackFrom(src);
            return;
        }
        for (const s of this.soldierList) {
            if (!s?.node?.isValid || s.isDismissed) continue;
            s.syncAttackFrom(src);
        }
    }

    /** 同步武器外观到全队 */
    public syncSquadWeaponVisual(lv: number) {
        for (const s of this.soldierList) {
            if (s?.node?.isValid) s.setWeaponVisual(lv);
        }
    }

    /** 初始人墙血量：主角占位 + 已有士兵 */
    private initSquadHealth() {
        if (!this.battleValComp) return;
        const total = SOLDIER_HP * (1 + this.soldierList.length);
        this.battleValComp.initializeHealth(total, total);
    }

    private addSquadHp(amount: number) {
        if (!this.battleValComp || amount <= 0) return;
        this.battleValComp.maxHealth += amount;
        this.battleValComp.currentHealth += amount;
    }

    /** 人墙扣血：hp-damage；damage>hp 且 hp>1 时保底 1 */
    public static computeSquadHpAfterDamage(hp: number, damage: number): number {
        if (hp <= 0 || damage <= 0) return hp;
        if (hp > 1 && damage > hp) return 1;
        return hp - damage;
    }

    private removeSoldiersForLostHp(lost: number) {
        let remain = Math.floor(lost / SOLDIER_HP);
        while (remain > 0 && this.soldierList.length > 0) {
            const soldier = this.soldierList[this.soldierList.length - 1];
            remain -= SOLDIER_HP;
            this.dismissSoldier(soldier, false);
        }
        if (this.soldierList.length > 0) {
            this.upSquadPositions();
        }
    }

    /** 圆形阵型局部坐标（对齐 BackUp Player.getNextPos） */
    public getNextLocalPos(soldierIndex: number): Vec3 {
        const index = soldierIndex + 1;
        const effectiveIndex = index - 1;
        const layer = Math.floor(Math.log2(effectiveIndex / this.squadLayerCount + 1));
        const layerCount = this.squadLayerCount << layer;
        const indexInLayer = effectiveIndex - this.squadLayerCount * ((1 << layer) - 1);
        const radius = (layer + 1) * this.squadRoleR;
        const count = Math.max(1, layerCount);
        const angle = (2 * Math.PI / count) * indexInLayer;
        return v3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    }

    public upSquadPositions() {
        for (let i = 0; i < this.soldierList.length; i++) {
            const soldier = this.soldierList[i];
            if (!soldier?.node?.isValid) continue;
            const pos = this.getNextLocalPos(i);
            tween(soldier.node).to(0.2, { position: pos }).start();
        }
        this.upMoveBoundary();
    }

    protected shouldUpdateTarget(): boolean {
        return false;
    }

    protected updateFaceDirection(): void {
        // 人墙主角固定朝向, 不追目标转向
    }

    protected shouldFallbackToMoveDirectionWhenNoAttackTarget(): boolean {
        return false;
    }

    private curGuideTarget: Node = null;
    updateGuideTarget() { }

    protected getPotentialTargets(): CharacterBase[] {
        return [];
    }

    private tempItemCount: number = 0;
    private checkContainer() {
        // if (this.hasCollisionWithTag(ColliderGroupTag.GoldContainer)) {
        //     this.collisionMap.get(ColliderGroupTag.GoldContainer).forEach((InteractNode) => {
        //         if (GameInfo.step == 9 && GameInfo.instance.viewMgr.GoldCoin >= 5) {
        //             GameInfo.instance.guideMgr.onGuideStep();
        //         }
        //         const stack = InteractNode.node.getComponent(ItemContainer);
        //         if (stack.isEmpty()) return;
        //         FlyManager.instance.flyItem({
        //             sourceContainer: stack,
        //             targetNode: GameInfo.instance.player.goldContainer.root,
        //             targetLocalPos: GameInfo.instance.player.goldContainer.preprocessData(),
        //             prefabPath: PrefabPathEnum.COIN_GOLD,
        //             onComplete: (item) => {
        //                 if (item) {
        //                     GameInfo.instance.player.goldContainer.addItem(item);
        //                 }
        //                 GameInfo.instance.viewMgr.addGoldCoin(1);
        //                 AudioMgr.instance.playSound(SoundEnum.Sound_GetGold);
        //             },
        //             flyParams: { radius: 2, power: 2, flyType: 0, needUpdateEnd: true }
        //         });
        //     })
        // }
    }

    checkUnlock() {
        // if (GameInfo.instance.viewMgr.GoldCoin > 0) {
        //     if (this.hasCollisionWithTag(ColliderGroupTag.BuildUnlock)) {
        //         this.collisionMap.get(ColliderGroupTag.BuildUnlock).forEach((InteractNode) => {
        //             const build = InteractNode.node.parent.getComponent(BuildBase);
        //             if (build.unlockState === BuildUnlockState.Active || build.unlockState === BuildUnlockState.Destroy) {
        //                 if (build.getDisplayRemainGold() > 0) {
        //                     if (GameInfo.instance.viewMgr.GoldCoin < 1) return;
        //                     GameInfo.instance.viewMgr.addGoldCoin(-1);
        //                     build.reserveGold(1);
        //                     FlyManager.instance.flyItem({
        //                         sourceContainer: this.goldContainer,
        //                         targetNode: build.node,
        //                         targetLocalPos: build.unlockNode.position,
        //                         prefabPath: PrefabPathEnum.COIN_GOLD,
        //                         viewCountGetter: () => GameInfo.instance.viewMgr.GoldCoin + 1,
        //                         onComplete: (item) => {
        //                             tween(item)
        //                                 .to(0.1, { scale: v3(1.2, 1.2, 1) })
        //                                 .to(0.1, { scale: v3(1, 1, 1) })
        //                                 .call(() => {
        //                                     GameInfo.instance.prefabMgr.recoverPrefab(item);
        //                                 })
        //                                 .start();
        //                             // AudioMgr.instance.playSound(SoundEnum.Sound_PushItem, 0.7);
        //                             build.costGold(1);
        //                         },
        //                         flyParams: { radius: 2, power: 2, flyType: 0 }
        //                     })
        //                 }
        //             }
        //         });
        //     }
        // }
    }

    protected onTriggerEnter(event: ITriggerEvent) {
        // console.log("onTriggerEnter", event.otherCollider.node.name);
        const _t = event.otherCollider.node.getComponent(ColliderTag);
        if (_t && this.collisionMap.has(_t.tag)) {
            const colliders = this.collisionMap.get(_t.tag);
            if (!colliders.includes(event.otherCollider)) {
                colliders.push(event.otherCollider);
            }
            if (_t.tag == ColliderGroupTag.Inside) {
                this.isInsideWall = true;
            }
        }
    }
    protected onTriggerStay(event: ITriggerEvent) { }
    protected onTriggerExit(event: ITriggerEvent) {
        // console.log("onTriggerExit", event.otherCollider.node.name);
        const _t = event.otherCollider.node.getComponent(ColliderTag);
        if (_t && this.collisionMap.has(_t.tag)) {
            const colliders = this.collisionMap.get(_t.tag);
            const index = colliders.indexOf(event.otherCollider);
            if (index !== -1) {
                colliders.splice(index, 1);
            }
            if (_t.tag == ColliderGroupTag.Inside) {
                this.isInsideWall = false;
            }
        }
    }
    protected onCollisionEnter(event: ICollisionEvent) { }
    protected onCollisionStay(event: ICollisionEvent) { }
    protected onCollisionExit(event: ICollisionEvent) { }

    public getCollidersByTag(tag: number): Collider[] {
        return this.collisionMap.get(tag) || [];
    }
    // 检查是否与指定tag的碰撞器有碰撞
    public hasCollisionWithTag(tag: number): boolean {
        const colliders = this.collisionMap.get(tag);
        return colliders && colliders.length > 0;
    }
    protected onAnimationComplete() {
        super.onAnimationComplete();
    }
    protected onLoopAnimationComplete(animName?: string): void {
        super.onLoopAnimationComplete(animName);
    }

    onDeadEnter() {
        super.onDeadEnter();
        app.event.emit(CommonEvent.HideJoystick);
        AudioMgr.instance.playSound(SoundEnum.Sound_HeroDie);
        this.scheduleOnce(() => {
            GameInfo.instance.gameMgr.GameOver(false)
        }, 2)
    }

    onRevive() {
        super.onRevive();
        this.atkTarget = null;
        this.skillTarget = null;
        this.clearForcedTarget();
        this.statusComp.reset();
        this.node.setPosition(v3(0, 0, 0));
        app.event.emit(CommonEvent.ShowJoystick);
        this._squadCombatStarted = false;
        this.enterSquadCombat();
    }
    handleRangedAttack(wpos: Vec3, attackInfo: AttackInfo) {
        let shootWorldPos = this.shotNode.worldPosition;
        let direction = this.getModelForwardDirection();
        if (this.attackComp) {
            this.attackComp.createBullet(shootWorldPos, direction, attackInfo.damageSource);
        }
    }
    public onHurt(damage: number, damageSource?: DamageSource): boolean {
        if (this.statusComp?.currentState === CharacterStatus.Dead || !this.battleValComp) {
            return false;
        }
        if (this.battleValComp.isInvincible || this.battleValComp.isImmune) {
            return false;
        }

        const prevHp = this.battleValComp.currentHealth;
        const nextHp = Hero.computeSquadHpAfterDamage(prevHp, damage);
        if (nextHp === prevHp) return false;

        const lost = prevHp - nextHp;
        this.battleValComp.currentHealth = nextHp;

        if (lost > 0) {
            this.battleValComp.triggerDamageImmunity();
            this.removeSoldiersForLostHp(lost);
            if (this.visualFeedbackComp && nextHp > 0) {
                this.visualFeedbackComp.showDamageEffect();
            }
            AudioMgr.instance.playSound(SoundEnum.Sound_HeroHurt, 0.6);
        }

        if (nextHp <= 0) {
            this.onDead();
        }
        return true;
    }

    protected castSkillEffect() {
        if (!this.skillComp) return;
    }
    testCreateSKill(id: number) { }

    /** 将模型朝向目标方向 */
    private _faceTarget(target?: Node): void {
        if (!this.ModelNode) return;
        const dir = v3(0, 0, 0);
        if (!target || !target.isValid) {
            dir.set(0, 0, -1);
        } else {
            const aim = target.worldPosition;
            const hp = this.node.worldPosition;
            dir.set(aim.x - hp.x, 0, aim.z - hp.z);
            if (Vec3.equals(dir, Vec3.ZERO)) return;
            Vec3.normalize(dir, dir);
        }
        this.ModelNode.setWorldRotation(this.calculateRotationFromDirection(dir));
        Vec3.copy(this._lastValidDirection, dir);
        Vec3.copy(this._targetDirection, dir);
    }
}
