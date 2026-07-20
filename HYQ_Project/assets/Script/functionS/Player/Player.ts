import { _decorator, CCBoolean, CCFloat, CCInteger, Component, director, Node, Quat, Tween, tween, Vec3 } from 'cc';
import { MoveDrive } from '../../Base/MoveRot/MoveDrive';
import { FbxManager } from '../SkAnim/FbxManager';
import { Role } from './Role';
import { getCirclePosition } from '../../Tool/Index';
import { ArmsTypeEnum, BulletEnum, EventType, LayerEnum, PoolEnum, PrefabsEnum, PropEnum, RoleEnum, SoundEnum } from '../../Base/EnumList';
import PoolManager from '../../Base/PoolManager';
import EventManager from '../../Base/EventManager';
import { PrefabsManager } from '../../Base/PrefabsManager';
import TweenTool from '../../Tool/TweenTool';
import { GameOverPanel } from '../UI/GameOver/GameOverPanel';
import { UnityUpComponent } from '../../Base/UnityUpComponent';
import RockerManager from '../Rocker/RockerManager';
import AudioManager from '../../Base/AudioManager';
import BulletManager from '../Battle/BulletManager';
import { FlashRedManager } from '../Battle/Base/FlashRedManager';
import { BulletBatchRenderer } from '../Battle/BulletBatchRenderer';
import LayerManager from '../../Base/LayerManager';
const { ccclass, property } = _decorator;

@ccclass('WeaponBulletConfig')
class WeaponBulletConfig {

    @property({ type: ArmsTypeEnum, displayName: '武器类型', tooltip: '该配置对应的武器类型。' })
    public armsType: ArmsTypeEnum = ArmsTypeEnum.bq;

    @property({ type: ArmsTypeEnum, displayName: '武器模型', tooltip: '单独指定该配置使用的角色/武器模型；选择 none 时跟随武器类型。' })
    public weaponModel: ArmsTypeEnum = ArmsTypeEnum.none;

    @property({ type: CCFloat, displayName: '子弹威力', tooltip: '该武器发射子弹时的基础伤害倍率。' })
    public bulletPower: number = 1;

    @property({ type: BulletEnum, displayName: '子弹模型', tooltip: '该武器使用的子弹预制体类型。' })
    public bulletType: BulletEnum = BulletEnum.arrow;

    @property({ type: CCFloat, displayName: '每秒射击轮数', min: 0.1, tooltip: '该武器每秒触发多少轮射击。直接决定真实子弹生成速率；填 0 时使用对应武器的安全默认值。' })
    public shotsPerSecond: number = 0;

    @property({ type: CCInteger, displayName: '每轮射击人数上限', min: 1, tooltip: '该武器每轮最多允许多少名角色射击。队伍人数更多时会轮换开火；填 0 时使用对应武器的安全默认值。' })
    public shootingRoleLimit: number = 0;

    @property({ type: CCInteger, displayName: '单角色每轮子弹上限', min: 1, tooltip: '每名角色单轮产生的真实子弹上限。显示、碰撞和伤害都与实际生成的子弹一一对应。' })
    public bulletsPerRoleLimit: number = 1;

    @property({ type: CCBoolean, displayName: '持续射击', tooltip: '开启后把一轮内的子弹均匀分布到整个攻击间隔，适合加特林类武器，避免子弹一波一波出现。' })
    public continuousFire: boolean = false;

    @property({ type: CCBoolean, displayName: '打乱发射顺序', tooltip: '复数角色时随机打乱该武器的发射时机，不改变子弹方向。' })
    public randomizeShotOrder: boolean = false;

    @property({ type: CCFloat, displayName: '随机发射延迟比例', tooltip: '每个角色随机延迟发射的最大时间占攻击间隔的比例。只影响发射顺序。' })
    public randomShotDelayWindowRatio: number = 0.75;

    @property({ type: CCFloat, displayName: '初始子弹随机X', tooltip: '只给每个角色本次发射的第一颗子弹增加轻微 X 轴随机。0 表示关闭。' })
    public initialBulletRandomX: number = 0;
}

type PendingRoleShot = {
    role: Role;
    fireTime: number;
    bulletCount: number;
    damageScale: number;
    lockWorldX: number;
    playEffect: boolean;
    initialBulletRandomX: number;
    bulletType: BulletEnum;
};


enum PlayerFBXAnimName {
    idle,
    attack,
    run_attack,
    die,
    run,
}

@ccclass('Player')
export class Player extends UnityUpComponent {

    public static instance: Player;

    public roleType: RoleEnum = RoleEnum.underling;

    @property(Role)
    public roleList: Role[] = [];

    public move: MoveDrive;

    @property({ type: CCInteger, displayName: '初始玩家数量', min: 1, tooltip: '开局时玩家队伍拥有的角色总数。会保留场景中已有角色并自动补足，最大不超过“+1人数上限”。' })
    public initialRoleCount: number = 1;

    @property({ type: CCFloat, displayName: '初始武器射速(次/秒)', tooltip: '开局默认武器每秒攻击次数。武器升级后会使用对应武器自己的射速配置。' })
    public attackSpeed: number = 3;

    public isDie: boolean = false;
    private curCount: number = 1;
    private pendingAddRoleCount: number = 0;

    @property({ type: CCInteger, displayName: '+1人数上限', tooltip: '玩家通过 +1 最多增加到的角色数量。达到后继续吃 +1 只回收道具，不再增加角色。' })
    public maxRoleCount: number = 42;

    @property({ type: CCInteger, displayName: '再来一次补人圈数上限', tooltip: '按画面可见圈数限制。3 表示中心第1圈 + 外围第2圈 + 外围第3圈。' })
    public retryMaxRoleLayerCount: number = 3;

    @property({ type: CCInteger, displayName: '满员阵型层数', tooltip: '包含中心层。设为 4 时，剩余角色按各圈半径比例自动分配到外围三圈。' })
    public formationLayerCount: number = 4;

    @property({ type: CCFloat, displayName: '减员缩圈延迟(秒)', tooltip: '角色减少后等待多久再重新排列缩圈。等待期间再次减员会重新计时。' })
    public shrinkAfterRoleLossDelay: number = 2;

    @property({ type: CCInteger, displayName: '同时发射子弹人数上限', tooltip: '每轮最多允许多少个角色同时发射子弹。只限制射击人数，不影响 +1 总人数。' })
    public maxShootingRoleCount: number = 30;

    @property({ type: CCInteger, displayName: '枪口特效最大播放数', tooltip: '每轮射击最多允许多少个角色播放枪口特效。只影响特效，不影响子弹数量。' })
    public maxMuzzleEffectCount: number = 8;

    @property({ type: CCBoolean, displayName: '仅外圈角色投影', tooltip: '开启后动态关闭内圈阴影；最外圈未排满时，同时保留相邻完整圈的阴影，避免缺口区域没有角色投影。' })
    public onlyOuterLayerCastShadow: boolean = true;

    @property({ type: CCBoolean, displayName: '启用子弹动态合批', tooltip: '开启时每帧更新动态 Mesh 以减少 DrawCall；关闭时使用子弹原始 Sprite 渲染，避免动态 Mesh 更新导致的帧时间开销。' })
    public enableBulletDynamicBatching: boolean = true;

    @property({ type: CCInteger, displayName: '错峰发射武器配置索引', tooltip: '指定哪一个武器子弹配置使用错峰发射。0 表示第一个油桶给出的武器；负数表示关闭。' })
    public staggerShotWeaponConfigIndex: number = 0;
    @property({ type: CCFloat, displayName: '错峰发射占攻击间隔比例', tooltip: '错峰武器每轮射击摊开的时间比例。0.85 表示在本轮攻击间隔的 85% 时间内连续发射，伤害和总弹量不变。' })
    public staggerShotWindowRatio: number = 0.85;
    @property({ type: CCInteger, displayName: '默认武器配置索引', tooltip: '开局默认使用的“武器子弹配置”索引。-1 表示保持旧默认值：子弹 arrow、威力 1、攻击速度使用 Player.attackSpeed。' })
    public defaultWeaponConfigIndex: number = -1;
    @property({ type: CCBoolean, displayName: '启用升级角色预热', tooltip: '武器飞向玩家期间分帧创建目标角色模型；正式替换时只从对象池取，避免运行中集中实例化骨骼角色。' })
    public enableRuntimeUpgradePrewarm: boolean = false;

    @property({ type: CCInteger, displayName: '每帧预热角色数', tooltip: '升级预热阶段每帧最多创建的角色数量。数值越低，单帧峰值越小。' })
    public rolePrewarmPerFrame: number = 2;

    @property({ type: CCInteger, displayName: '每帧替换角色数', tooltip: '升级后每帧最多替换的角色数量；开启预热时只替换对象池中已经准备好的角色。' })
    public roleSwitchPerFrame: number = 4;

    @property({ type: CCInteger, displayName: '每帧角色射击处理数', tooltip: '单帧最多执行多少名角色的实际射击。超出的射击保留到后续帧，子弹总数和伤害次数不减少。' })
    public maxRoleShotsPerFrame: number = 12;
    @property({ type: [WeaponBulletConfig], displayName: '武器子弹配置', tooltip: '配置各武器的子弹威力和子弹模型。' })
    public weaponBulletConfigList: WeaponBulletConfig[] = [
        (() => {
            const config = new WeaponBulletConfig();
            config.armsType = ArmsTypeEnum.bq;
            config.weaponModel = ArmsTypeEnum.none;
            config.bulletPower = 2;
            config.bulletType = BulletEnum.arrow_1;
            config.randomizeShotOrder = true;
            config.initialBulletRandomX = 0.35;
            return config;
        })(),
        (() => {
            const config = new WeaponBulletConfig();
            config.armsType = ArmsTypeEnum.jq;
            config.weaponModel = ArmsTypeEnum.none;
            config.bulletPower = 2;
            config.bulletType = BulletEnum.arrow_2;
            config.randomizeShotOrder = true;
            config.initialBulletRandomX = 0.35;
            return config;
        })(),
        (() => {
            const config = new WeaponBulletConfig();
            config.armsType = ArmsTypeEnum.jtl;
            config.weaponModel = ArmsTypeEnum.none;
            config.bulletPower = 0.5;
            config.bulletType = BulletEnum.arrow_3;
            return config;
        })(),
        (() => {
            const config = new WeaponBulletConfig();
            config.armsType = ArmsTypeEnum.jtl2;
            config.weaponModel = ArmsTypeEnum.none;
            config.bulletPower = 0.3;
            config.bulletType = BulletEnum.arrow_4;
            return config;
        })(),
    ];

    private pendingRoleSwitchType: RoleEnum = null;
    private pendingRoleSwitchIndex: number = 0;
    private pendingRolePrewarmType: RoleEnum = null;
    private pendingRolePrewarmCount: number = 0;
    private pendingBulletPrewarmType: BulletEnum = null;
    private pendingBulletPrewarmCount: number = 0;
    private pendingBulletBatchWarmType: BulletEnum = null;
    private readonly bulletPrewarmPerFrame: number = 2;
    private currentWeaponBulletConfig: WeaponBulletConfig | null = null;
    private currentWeaponBulletConfigIndex: number = -1;
    private currentShootingRoleLimit: number = 0;
    private currentBulletsPerRoleLimit: number = 1;
    private readonly frontShootingRoleIndices: number[] = [];
    private readonly sortedFrontShootingRoleIndices: number[] = [];
    private readonly cachedShootingRoles: (Role | null)[] = [];
    private readonly cachedShootingRoleActive: boolean[] = [];
    private readonly cachedShootingRoleX: number[] = [];
    private readonly cachedShootingRoleZ: number[] = [];
    private staggerShotClock: number = 0;
    private pendingStaggerShots: PendingRoleShot[] = [];
    private continuousShotAccumulator: number = 0;
    private continuousRoleCursor: number = 0;
    private roleLayoutDirty: boolean = false;
    private shrinkDelayTimer: number = -1;
    private shrinkAnimating: boolean = false;
    private shrinkDirtyDuringAnimating: boolean = false;
    private readonly roleLayoutTweenDuration: number = 0.2;
    private currentTeamAnimName: PlayerFBXAnimName | null = null;
    private roleJoinLayoutRefreshScheduled: boolean = false;

    public isLock: boolean = false;

    // public MoveX: number = 8;

    @property(Node)
    public shootList: Node[] = [];
    private shootIndex: number = 1;


    start() {
        Player.instance = this;
        BulletBatchRenderer.useDynamicBatching = this.enableBulletDynamicBatching;
        this.move = this.node.getComponent(MoveDrive);
        this.applyDefaultWeaponConfig();
        this.initializeStartingRoles();
        this.syncRespawnRoleCount();
        this.refreshRoleShadowCasting();
        EventManager.instance.on(EventType.PLAYER_HIT, this.hit, this);
        EventManager.instance.on(EventType.PLAYER_HIT_2, this.hit_2, this);
    }

    private initializeStartingRoles(): void {
        const targetCount = Math.min(
            this.getEffectiveMaxRoleCount(),
            Math.max(1, Math.floor(this.initialRoleCount)),
        );
        while (this.roleList.length > targetCount) {
            const role = this.roleList.pop();
            if (!role) {
                continue;
            }
            role.node.active = false;
            PoolManager.instance.setPool(PoolEnum.role + role.type, role);
        }
        while (this.roleList.length < targetCount) {
            const role = this.role;
            this.node.addChild(role.node);
            if (!this.addRole(role, false, false)) {
                role.node.active = false;
                PoolManager.instance.setPool(PoolEnum.role + role.type, role);
                break;
            }
            const roleIndex = this.roleList.length - 1;
            const pos = this.getNextPos(roleIndex, true);
            role.node.setPosition(pos);
            PoolManager.instance.V3 = pos;
        }
        this.curCount = Math.min(
            this.getEffectiveMaxRoleCount(),
            Math.max(1, this.roleList.length),
        );
        this.upMoveBoundary();
    }

    protected _update(dt: number): void {
        // const rx = RockerManager.instance.rockerDirection.x;
        // const x = this.node.x;



        // if (x < this.MoveX && rx < 0 || x > -this.MoveX && rx > 0) {
        //     this.move.moveEvent(dt);
        // } else {
        //     this.move.isMove = false;
        // }

        this.staggerShotClock += dt;

        if (this.isLock) {

            this.roleAttack(dt);
        }
        this.processPendingStaggerShots();
        this.processPendingRolePrewarm();
        this.processPendingBulletPrewarm();
        this.processPendingRoleSwitch();
        this.processDelayedShrink(dt);
        this.roleMove();
    }

    private attackIn: boolean = false;

    private _attackTime: number = 0;

    private roleAttack(dt: number) {

        if (this.shouldUseContinuousFire()) {
            this.roleAttackContinuous(dt);
            return;
        }

        if (this._attackTime <= 0) {
            // this.attackIn = true;
            const attackTime = 1 / this.attackSpeed;
            this._attackTime = attackTime;
            // const layer = Math.round(this.roleList.length / this.LayerCount) * 2 + 1;

            // for (let i = 0; i < layer; i++) {
            //     this.attackEvent(i);
            // }

            const shootCount = Math.min(this.roleList.length, this.getCurrentShootingRoleLimit());
            this.collectFrontShootingRoleIndices(shootCount);
            const outerLayer = this.getShootingOuterLayer();
            const useStaggerShot = this.shouldUseStaggerShot();
            const useRandomShot = shootCount > 1 && this.shouldUseRandomShot();
            const randomShotConfig = this.currentWeaponBulletConfig;
            const lockWorldX = this.node.worldPosition.x;
            let effectPlayCount = 0;
            for (let i = 0; i < this.frontShootingRoleIndices.length; i++) {
                const roleIndex = this.frontShootingRoleIndices[i];
                const role = this.roleList[roleIndex];
                if (!role.attackIN) {
                    const playEffect = this.shouldPlayMuzzleEffect(roleIndex, outerLayer, effectPlayCount);
                    if (playEffect) {
                        effectPlayCount++;
                    }
                    if (useRandomShot) {
                        this.enqueueRandomShot(
                            role,
                            attackTime,
                            this.getRealBulletCountPerRole(role),
                            1,
                            lockWorldX,
                            playEffect,
                            randomShotConfig?.randomShotDelayWindowRatio ?? 0,
                            randomShotConfig?.initialBulletRandomX ?? 0,
                        );
                    } else if (useStaggerShot) {
                        this.enqueueStaggerShot(role, i, this.frontShootingRoleIndices.length, attackTime, this.getRealBulletCountPerRole(role), 1, lockWorldX, playEffect);
                    } else {
                        this.enqueueRoleShot(role, this.staggerShotClock, this.getRealBulletCountPerRole(role), 1, lockWorldX, playEffect, 0);
                    }
                    // const animIndex = isMove ? PlayerFBXAnimName.run_attack : PlayerFBXAnimName.attack;
                    // const animState = role.fbxManager.setAnimation(animIndex, false);
                    // const endTime = animState.duration;
                    // const animScale = endTime / attackTime;
                    // animState.speed = animScale;

                }
            }
            // this.scheduleOnce(() => {
            //     this.attackIn = false;
            // }, attackTime)
        } else {
            this._attackTime -= dt;
        }
    }

    private shouldUseStaggerShot(): boolean {
        if (this.currentWeaponBulletConfig) {
            return false;
        }
        return this.staggerShotWeaponConfigIndex >= 0
            && this.currentWeaponBulletConfigIndex === Math.floor(this.staggerShotWeaponConfigIndex)
            && this.staggerShotWindowRatio > 0;
    }

    private shouldUseRandomShot(): boolean {
        return !!this.currentWeaponBulletConfig?.randomizeShotOrder;
    }

    private shouldUseContinuousFire(): boolean {
        return !!this.currentWeaponBulletConfig?.continuousFire;
    }

    private shuffleFrontShootingRoles(): void {
        for (let i = this.frontShootingRoleIndices.length - 1; i > 0; i--) {
            const swapIndex = Math.floor(Math.random() * (i + 1));
            const temp = this.frontShootingRoleIndices[i];
            this.frontShootingRoleIndices[i] = this.frontShootingRoleIndices[swapIndex];
            this.frontShootingRoleIndices[swapIndex] = temp;
        }
    }

    private roleAttackContinuous(dt: number): void {
        const shootCount = Math.min(this.roleList.length, this.getCurrentShootingRoleLimit());
        if (shootCount <= 0 || this.attackSpeed <= 0) {
            this.continuousShotAccumulator = 0;
            return;
        }

        this.collectFrontShootingRoleIndices(shootCount);
        const activeRoleCount = this.frontShootingRoleIndices.length;
        if (activeRoleCount <= 0) {
            this.continuousShotAccumulator = 0;
            return;
        }

        const roleShotsPerSecond = this.attackSpeed * activeRoleCount;
        const frameTime = Math.max(0, dt);
        const accumulatorBeforeFrame = this.continuousShotAccumulator;
        const accumulatedShots = accumulatorBeforeFrame + frameTime * roleShotsPerSecond;
        const dueShotCount = Math.floor(accumulatedShots);
        if (dueShotCount <= 0) {
            this.continuousShotAccumulator = accumulatedShots;
            return;
        }

        // 到期子弹全部在当前帧生成，不积压历史任务；按本帧内理论发射时刻预推进，避免同排成团。
        this.continuousShotAccumulator = accumulatedShots - dueShotCount;
        const outerLayer = this.getShootingOuterLayer();
        const lockWorldX = this.node.worldPosition.x;
        const config = this.currentWeaponBulletConfig;
        const bulletType = this.getCurrentBulletType();
        const randomizeRole = !!config?.randomizeShotOrder;
        const initialBulletRandomX = Math.max(0, config?.initialBulletRandomX ?? 0);
        let effectPlayCount = 0;
        let soundPlayed = false;

        for (let shotIndex = 0; shotIndex < dueShotCount; shotIndex++) {
            if (randomizeRole && shotIndex % activeRoleCount === 0) {
                this.shuffleFrontShootingRoles();
            }
            const frontIndex = randomizeRole
                ? shotIndex % activeRoleCount
                : this.continuousRoleCursor++ % activeRoleCount;
            const roleIndex = this.frontShootingRoleIndices[frontIndex];
            const role = this.roleList[roleIndex];
            if (!role || role.attackIN || !role.node.activeInHierarchy) {
                continue;
            }
            const playEffect = this.shouldPlayMuzzleEffect(roleIndex, outerLayer, effectPlayCount);
            if (playEffect) {
                effectPlayCount++;
            }
            const emissionTimeInFrame = (1 - accumulatorBeforeFrame + shotIndex) / roleShotsPerSecond;
            const spawnAdvanceTime = Math.max(0, frameTime - emissionTimeInFrame);
            role.attackEvent(
                0,
                this.getRealBulletCountPerRole(role),
                1,
                lockWorldX,
                playEffect,
                initialBulletRandomX,
                !soundPlayed,
                spawnAdvanceTime,
                bulletType,
            );
            soundPlayed = true;
        }
    }

    private enqueueRandomShot(role: Role, attackTime: number, bulletCount: number, damageScale: number, lockWorldX: number, playEffect: boolean, delayWindowRatio: number, initialBulletRandomX: number): void {
        if (!role) {
            return;
        }
        const windowRatio = Math.max(0, Math.min(0.95, delayWindowRatio));
        const delay = Math.random() * Math.max(0, attackTime * windowRatio);
        this.enqueueRoleShot(
            role,
            this.staggerShotClock + delay,
            bulletCount,
            damageScale,
            lockWorldX,
            playEffect,
            initialBulletRandomX,
        );
    }

    private enqueueStaggerShot(role: Role, shotIndex: number, shootCount: number, attackTime: number, bulletCount: number, damageScale: number, lockWorldX: number, playEffect: boolean): void {
        if (!role || shootCount <= 1) {
            role?.attackEvent(0, bulletCount, damageScale, lockWorldX, playEffect, 0, true, 0, this.getCurrentBulletType());
            return;
        }

        const windowRatio = Math.max(0, Math.min(0.95, this.staggerShotWindowRatio));
        const spreadTime = Math.max(0, attackTime * windowRatio);
        const delay = spreadTime * shotIndex / Math.max(1, shootCount - 1);
        this.enqueueRoleShot(
            role,
            this.staggerShotClock + delay,
            bulletCount,
            damageScale,
            lockWorldX,
            playEffect,
            0,
        );
    }

    private enqueueRoleShot(
        role: Role,
        fireTime: number,
        bulletCount: number,
        damageScale: number,
        lockWorldX: number,
        playEffect: boolean,
        initialBulletRandomX: number,
    ): void {
        const maxPendingShots = Math.max(
            Math.max(1, Math.floor(this.maxRoleShotsPerFrame)),
            this.getCurrentShootingRoleLimit() * 2,
        );
        if (this.pendingStaggerShots.length >= maxPendingShots) {
            return;
        }
        this.pendingStaggerShots.push({
            role,
            fireTime,
            bulletCount,
            damageScale,
            lockWorldX,
            playEffect,
            initialBulletRandomX: Math.max(0, initialBulletRandomX),
            bulletType: this.getCurrentBulletType(),
        });
    }

    private processPendingStaggerShots(): void {
        const maxShots = Math.max(1, Math.floor(this.maxRoleShotsPerFrame));
        const staleBefore = this.staggerShotClock - Math.max(0.05, 1 / Math.max(0.1, this.attackSpeed));
        let processedCount = 0;
        for (let i = this.pendingStaggerShots.length - 1; i >= 0; i--) {
            if (processedCount >= maxShots) {
                break;
            }
            const shot = this.pendingStaggerShots[i];
            if (!shot || shot.fireTime > this.staggerShotClock) {
                continue;
            }
            this.pendingStaggerShots[i] = this.pendingStaggerShots[this.pendingStaggerShots.length - 1];
            this.pendingStaggerShots.pop();
            if (shot.fireTime < staleBefore) {
                continue;
            }
            if (!shot.role || !shot.role.node || !shot.role.node.activeInHierarchy || shot.role.attackIN) {
                continue;
            }
            shot.role.attackEvent(
                0,
                shot.bulletCount,
                shot.damageScale,
                shot.lockWorldX,
                shot.playEffect,
                shot.initialBulletRandomX,
                true,
                0,
                shot.bulletType,
            );
            processedCount++;
        }
    }

    private collectFrontShootingRoleIndices(limit: number): void {
        this.frontShootingRoleIndices.length = 0;
        const safeLimit = Math.max(0, Math.min(limit, this.roleList.length));
        if (safeLimit <= 0) {
            return;
        }
        this.refreshFrontShootingRoleCache();
        const count = Math.min(safeLimit, this.sortedFrontShootingRoleIndices.length);
        for (let i = 0; i < count; i++) {
            this.frontShootingRoleIndices.push(this.sortedFrontShootingRoleIndices[i]);
        }
    }

    private refreshFrontShootingRoleCache(): void {
        const roleCount = this.roleList.length;
        const centerPos = this.node.worldPosition;
        const centerX = centerPos.x;
        const centerZ = centerPos.z;
        let dirty = this.cachedShootingRoles.length !== roleCount;
        for (let roleIndex = 0; roleIndex < roleCount; roleIndex++) {
            const role = this.roleList[roleIndex];
            const active = !!role?.node?.isValid && role.node.activeInHierarchy;
            let relativeX = 0;
            let relativeZ = 0;
            if (active) {
                const rolePos = role.node.worldPosition;
                relativeX = rolePos.x - centerX;
                relativeZ = rolePos.z - centerZ;
            }
            if (this.cachedShootingRoles[roleIndex] !== role
                || this.cachedShootingRoleActive[roleIndex] !== active
                || this.cachedShootingRoleX[roleIndex] !== relativeX
                || this.cachedShootingRoleZ[roleIndex] !== relativeZ) {
                dirty = true;
            }
            this.cachedShootingRoles[roleIndex] = role;
            this.cachedShootingRoleActive[roleIndex] = active;
            this.cachedShootingRoleX[roleIndex] = relativeX;
            this.cachedShootingRoleZ[roleIndex] = relativeZ;
        }
        this.cachedShootingRoles.length = roleCount;
        this.cachedShootingRoleActive.length = roleCount;
        this.cachedShootingRoleX.length = roleCount;
        this.cachedShootingRoleZ.length = roleCount;
        if (!dirty) {
            return;
        }

        this.sortedFrontShootingRoleIndices.length = 0;
        for (let roleIndex = 0; roleIndex < roleCount; roleIndex++) {
            if (!this.cachedShootingRoleActive[roleIndex]) {
                continue;
            }
            let insertAt = this.sortedFrontShootingRoleIndices.length;
            for (let i = 0; i < this.sortedFrontShootingRoleIndices.length; i++) {
                if (this.isCachedRoleMoreFrontAndCentered(roleIndex, this.sortedFrontShootingRoleIndices[i])) {
                    insertAt = i;
                    break;
                }
            }
            this.sortedFrontShootingRoleIndices.splice(insertAt, 0, roleIndex);
        }
    }

    private isCachedRoleMoreFrontAndCentered(roleIndex: number, otherRoleIndex: number): boolean {
        const roleX = this.cachedShootingRoleX[roleIndex];
        const roleZ = this.cachedShootingRoleZ[roleIndex];
        const otherX = this.cachedShootingRoleX[otherRoleIndex];
        const otherZ = this.cachedShootingRoleZ[otherRoleIndex];
        const zDiff = roleZ - otherZ;
        if (Math.abs(zDiff) > 0.01) {
            return zDiff > 0;
        }
        const roleAbsX = Math.abs(roleX);
        const otherAbsX = Math.abs(otherX);
        if (Math.abs(roleAbsX - otherAbsX) > 0.01) {
            return roleAbsX < otherAbsX;
        }
        return roleX < otherX;
    }

    private getShootingOuterLayer(): number {
        let outerLayer = 0;
        for (let i = 0; i < this.frontShootingRoleIndices.length; i++) {
            const roleIndex = this.frontShootingRoleIndices[i];
            const layer = this.getRoleLayer(roleIndex);
            if (layer > outerLayer) {
                outerLayer = layer;
            }
        }
        return outerLayer;
    }

    private shouldPlayMuzzleEffect(roleIndex: number, outerLayer: number, effectPlayCount: number): boolean {
        if (this.maxMuzzleEffectCount <= 0 || effectPlayCount >= this.maxMuzzleEffectCount) {
            return false;
        }
        return this.getRoleLayer(roleIndex) === outerLayer;
    }

    private getRoleLayer(index: number): number {
        if (index <= 0) {
            return 0;
        }
        const effectiveIndex = index - 1;
        let layer = 0;
        let indexInLayer = effectiveIndex;
        let layerCount = this.getRoleLayerCount(layer);
        while (indexInLayer >= layerCount) {
            indexInLayer -= layerCount;
            layer++;
            layerCount = this.getRoleLayerCount(layer);
        }
        return layer;
    }

    public upArms(armwType: ArmsTypeEnum, weaponBulletConfigIndex: number = -1) {
        const weaponBulletConfig = this.getWeaponBulletConfig(armwType, weaponBulletConfigIndex);
        const upgradeArmsType = weaponBulletConfig?.armsType ?? armwType;
        this.pendingStaggerShots.length = 0;
        this.continuousShotAccumulator = 0;
        this.continuousRoleCursor = 0;
        this.currentWeaponBulletConfig = weaponBulletConfig;
        this.currentWeaponBulletConfigIndex = weaponBulletConfig ? this.getWeaponBulletConfigResolvedIndex(weaponBulletConfig, weaponBulletConfigIndex) : -1;
        let shouldApplyRoleModel = false;
        switch (upgradeArmsType) {
            case ArmsTypeEnum.bq:
                this.applyWeaponBulletConfig(weaponBulletConfig);
                this.applyWeaponFireLimits(weaponBulletConfig, upgradeArmsType);
                shouldApplyRoleModel = true;
                break;
            case ArmsTypeEnum.jq:
                this.applyWeaponBulletConfig(weaponBulletConfig);
                this.applyWeaponFireLimits(weaponBulletConfig, upgradeArmsType);
                shouldApplyRoleModel = true;
                break;

            case ArmsTypeEnum.jtl:
                this.applyWeaponBulletConfig(weaponBulletConfig);
                this.applyWeaponFireLimits(weaponBulletConfig, upgradeArmsType);
                TweenTool.scaleShake(this.node);
                this.roleR = 1;
                Role.soundType = SoundEnum.Sound_FireGun;
                shouldApplyRoleModel = true;
                break;
            case ArmsTypeEnum.jtl2: {
                this.applyWeaponBulletConfig(weaponBulletConfig);
                this.applyWeaponFireLimits(weaponBulletConfig, upgradeArmsType);
                TweenTool.scaleShake(this.node);
                this.roleR = 1;
                Role.soundType = SoundEnum.Sound_FireGun;
                shouldApplyRoleModel = true;
                break;
            }
            case ArmsTypeEnum.tk:
                break;
            case ArmsTypeEnum.jj:
                break;
        }
        if (shouldApplyRoleModel) {
            this.applyWeaponRoleModel(weaponBulletConfig, upgradeArmsType);
        }
    }

    public prepareArmsUpgrade(armwType: ArmsTypeEnum, weaponBulletConfigIndex: number = -1) {
        const weaponBulletConfig = this.getWeaponBulletConfig(armwType, weaponBulletConfigIndex);
        const upgradeArmsType = weaponBulletConfig?.armsType ?? armwType;
        AudioManager.inst.preload(SoundEnum.Sound_Ship_UpLevel);
        const soundType = this.getSoundTypeByArms(upgradeArmsType);
        if (soundType !== null) {
            AudioManager.inst.preload(soundType);
        }
        if (!this.enableRuntimeUpgradePrewarm) {
            this.clearRuntimeWarmupQueue();
            return;
        }

        const bulletType = weaponBulletConfig?.bulletType ?? this.getBulletTypeByArms(upgradeArmsType);
        if (bulletType !== null) {
            this.startBulletPrewarm(bulletType, this.getWeaponPrewarmBulletCount());
        }

        const targetRoleType = this.getRoleTypeByWeaponConfig(weaponBulletConfig, upgradeArmsType);
        if (targetRoleType === null) {
            return;
        }
        this.startRolePrewarm(targetRoleType, this.getRoleSwitchNeedCount(targetRoleType));
    }

    private clearRuntimeWarmupQueue() {
        this.pendingRolePrewarmType = null;
        this.pendingRolePrewarmCount = 0;
        this.pendingBulletPrewarmType = null;
        this.pendingBulletPrewarmCount = 0;
        this.pendingBulletBatchWarmType = null;
    }

    private getRoleTypeByArms(armwType: ArmsTypeEnum): RoleEnum | null {
        switch (armwType) {
            case ArmsTypeEnum.bq:
            case ArmsTypeEnum.jq:
                return RoleEnum.underling;
            case ArmsTypeEnum.jtl:
                return RoleEnum.dazhuang;
            case ArmsTypeEnum.jtl2:
                return RoleEnum.dazhuangPlus;
        }
        return null;
    }

    private getWeaponModelArmsType(config: WeaponBulletConfig | null, fallbackArmsType: ArmsTypeEnum): ArmsTypeEnum {
        const modelType = config?.weaponModel;
        if (modelType !== undefined && modelType !== null && modelType !== ArmsTypeEnum.none) {
            return modelType;
        }
        return config?.armsType ?? fallbackArmsType;
    }

    private getRoleTypeByWeaponConfig(config: WeaponBulletConfig | null, fallbackArmsType: ArmsTypeEnum): RoleEnum | null {
        return this.getRoleTypeByArms(this.getWeaponModelArmsType(config, fallbackArmsType));
    }

    private applyWeaponRoleModel(config: WeaponBulletConfig | null, fallbackArmsType: ArmsTypeEnum): void {
        const targetRoleType = this.getRoleTypeByWeaponConfig(config, fallbackArmsType);
        if (targetRoleType === null) {
            return;
        }
        this.startRoleSwitch(targetRoleType);
    }

    private getBulletTypeByArms(armwType: ArmsTypeEnum): BulletEnum | null {
        return this.getWeaponBulletConfig(armwType)?.bulletType ?? null;
    }

    private getWeaponBulletConfig(armwType: ArmsTypeEnum, weaponBulletConfigIndex: number = -1): WeaponBulletConfig | null {
        const indexedConfig = this.getWeaponBulletConfigByIndex(weaponBulletConfigIndex);
        if (indexedConfig) {
            return indexedConfig;
        }
        for (let i = 0; i < this.weaponBulletConfigList.length; i++) {
            const config = this.weaponBulletConfigList[i];
            if (config?.armsType === armwType) {
                return config;
            }
        }
        return null;
    }

    private getWeaponBulletConfigByIndex(index: number): WeaponBulletConfig | null {
        if (!this.weaponBulletConfigList || index < 0) {
            return null;
        }
        const safeIndex = Math.floor(index);
        return this.weaponBulletConfigList[safeIndex] ?? null;
    }

    private applyDefaultWeaponConfig(): void {
        const config = this.getWeaponBulletConfigByIndex(this.defaultWeaponConfigIndex);
        if (!config) {
            this.currentWeaponBulletConfig = null;
            this.currentWeaponBulletConfigIndex = -1;
            return;
        }
        this.applyWeaponBulletConfig(config);
        const armsType = config.armsType;
        this.applyWeaponFireLimits(config, armsType);
        const soundType = this.getSoundTypeByArms(armsType);
        if (soundType !== null) {
            Role.soundType = soundType;
        }
        this.currentWeaponBulletConfig = config;
        this.currentWeaponBulletConfigIndex = this.getWeaponBulletConfigResolvedIndex(config, this.defaultWeaponConfigIndex);
    }

    private getWeaponBulletConfigResolvedIndex(config: WeaponBulletConfig, weaponBulletConfigIndex: number): number {
        if (weaponBulletConfigIndex >= 0) {
            return Math.floor(weaponBulletConfigIndex);
        }
        return this.weaponBulletConfigList ? this.weaponBulletConfigList.indexOf(config) : -1;
    }

    private applyWeaponBulletConfig(config: WeaponBulletConfig | null): void {
        if (!config) {
            return;
        }
        Role.power = config.bulletPower;
        Role.bulletType = config.bulletType;
    }

    private getCurrentBulletType(): BulletEnum {
        return this.currentWeaponBulletConfig?.bulletType ?? Role.bulletType;
    }

    private applyWeaponFireLimits(config: WeaponBulletConfig | null, armwType: ArmsTypeEnum): void {
        const resolvedArmsType = armwType === ArmsTypeEnum.none
            ? (config?.weaponModel ?? ArmsTypeEnum.bq)
            : armwType;
        let safeShotsPerSecond = 2;
        let safeShootingRoleLimit = 10;
        switch (resolvedArmsType) {
            case ArmsTypeEnum.bq:
                safeShotsPerSecond = 2;
                safeShootingRoleLimit = 10;
                break;
            case ArmsTypeEnum.jq:
                safeShotsPerSecond = 2.5;
                safeShootingRoleLimit = 12;
                break;
            case ArmsTypeEnum.jtl:
                safeShotsPerSecond = 3;
                safeShootingRoleLimit = 14;
                break;
            case ArmsTypeEnum.jtl2:
                safeShotsPerSecond = 4;
                safeShootingRoleLimit = 16;
                break;
        }
        this.attackSpeed = config?.shotsPerSecond > 0 ? config.shotsPerSecond : safeShotsPerSecond;
        this.currentShootingRoleLimit = config?.shootingRoleLimit > 0
            ? Math.floor(config.shootingRoleLimit)
            : safeShootingRoleLimit;
        this.currentBulletsPerRoleLimit = Math.max(1, Math.floor(config?.bulletsPerRoleLimit ?? 1));
    }

    private getCurrentShootingRoleLimit(): number {
        const weaponLimit = this.currentShootingRoleLimit > 0
            ? this.currentShootingRoleLimit
            : this.maxShootingRoleCount;
        return Math.max(1, Math.min(this.maxShootingRoleCount, weaponLimit));
    }

    private getRealBulletCountPerRole(role: Role): number {
        return Math.max(1, Math.min(role.bulletCount, this.currentBulletsPerRoleLimit));
    }

    private getSoundTypeByArms(armwType: ArmsTypeEnum): SoundEnum | null {
        switch (armwType) {
            case ArmsTypeEnum.jtl:
            case ArmsTypeEnum.jtl2:
                return SoundEnum.Sound_FireGun;
        }
        return null;
    }

    private getWeaponPrewarmBulletCount(): number {
        const shootCount = Math.min(this.roleList.length, this.getCurrentShootingRoleLimit());
        let count = 0;
        for (let i = 0; i < shootCount; i++) {
            const role = this.roleList[i];
            count += role ? this.getRealBulletCountPerRole(role) : 1;
        }
        return Math.max(1, Math.min(count, 8));
    }

    private startBulletPrewarm(bulletType: BulletEnum, needCount: number) {
        const poolKey = PoolEnum.bullet + bulletType;
        this.pendingBulletPrewarmType = bulletType;
        this.pendingBulletPrewarmCount = Math.max(0, needCount - PoolManager.instance.getPoolSize(poolKey));
        this.pendingBulletBatchWarmType = bulletType;
    }

    private processPendingBulletPrewarm() {
        if (this.pendingBulletPrewarmType === null && this.pendingBulletBatchWarmType === null) {
            return;
        }

        const bulletLayer = this.getBulletLayer();
        if (!bulletLayer) {
            return;
        }

        let count = this.bulletPrewarmPerFrame;
        while (count > 0 && this.pendingBulletPrewarmType !== null && this.pendingBulletPrewarmCount > 0) {
            const bullet = BulletManager.instance.prewarmBullet3D(this.pendingBulletPrewarmType, bulletLayer, true);
            BulletBatchRenderer.prewarm(bulletLayer, bullet);
            this.pendingBulletPrewarmCount--;
            count--;
        }

        if (this.pendingBulletPrewarmCount <= 0) {
            this.pendingBulletPrewarmType = null;
        }

        if (this.pendingBulletBatchWarmType !== null) {
            const bullet = BulletManager.instance.prewarmBullet3D(this.pendingBulletBatchWarmType, bulletLayer, false);
            BulletBatchRenderer.prewarm(bulletLayer, bullet);
            this.pendingBulletBatchWarmType = null;
        }
    }

    private getBulletLayer(): Node {
        if (Role.bulletLayer && Role.bulletLayer.isValid) {
            return Role.bulletLayer;
        }
        Role.bulletLayer = LayerManager.instance.getLayer(LayerEnum.BulletLayer);
        return Role.bulletLayer;
    }

    private startRolePrewarm(roleType: RoleEnum, needCount: number) {
        const poolKey = PoolEnum.role + roleType;
        const missingCount = Math.max(0, needCount - PoolManager.instance.getPoolSize(poolKey));
        if (missingCount <= 0) {
            this.pendingRolePrewarmType = null;
            this.pendingRolePrewarmCount = 0;
            return;
        }
        this.pendingRolePrewarmType = roleType;
        this.pendingRolePrewarmCount = missingCount;
    }

    private processPendingRolePrewarm() {
        if (this.pendingRolePrewarmType === null) {
            return;
        }
        if (this.pendingRolePrewarmCount <= 0) {
            this.pendingRolePrewarmType = null;
            return;
        }

        let count = Math.min(Math.max(1, Math.floor(this.rolePrewarmPerFrame)), this.pendingRolePrewarmCount);
        while (count > 0) {
            const role = this.createRoleByType(this.pendingRolePrewarmType);
            role.node.active = false;
            PoolManager.instance.setPool(PoolEnum.role + this.pendingRolePrewarmType, role);
            this.pendingRolePrewarmCount--;
            count--;
        }

        if (this.pendingRolePrewarmCount <= 0) {
            this.pendingRolePrewarmType = null;
        }
    }

    private startRoleSwitch(roleType: RoleEnum) {
        this.roleType = roleType;
        this.pendingRoleSwitchType = roleType;
        this.pendingRoleSwitchIndex = 0;
        this.roleLayoutDirty = false;
        if (this.enableRuntimeUpgradePrewarm) {
            this.startRolePrewarm(roleType, this.getRoleSwitchNeedCount(roleType));
        } else {
            this.pendingRolePrewarmType = null;
            this.pendingRolePrewarmCount = 0;
        }
    }

    private getRoleSwitchNeedCount(roleType: RoleEnum): number {
        let needCount = 0;
        for (let i = 0; i < this.roleList.length; i++) {
            if (this.roleList[i]?.type !== roleType) {
                needCount++;
            }
        }
        return needCount;
    }

    private processPendingRoleSwitch() {
        if (this.pendingRoleSwitchType === null) {
            return;
        }

        let count = Math.max(1, Math.floor(this.roleSwitchPerFrame));
        let didSwitch = false;
        while (count > 0 && this.pendingRoleSwitchIndex < this.roleList.length) {
            const index = this.pendingRoleSwitchIndex;
            const oldRole = this.roleList[index];
            if (!oldRole) {
                this.pendingRoleSwitchIndex++;
                count--;
                continue;
            }
            if (oldRole.type === this.pendingRoleSwitchType) {
                this.pendingRoleSwitchIndex++;
                count--;
                continue;
            }

            const newRole = this.enableRuntimeUpgradePrewarm
                ? this.getPooledRoleByType(this.pendingRoleSwitchType)
                : this.getRoleByType(this.pendingRoleSwitchType);
            if (!newRole) {
                break;
            }
            Tween.stopAllByTarget(oldRole.node);
            Tween.stopAllByTarget(newRole.node);
            this.roleList[index] = newRole;
            this.node.addChild(newRole.node);
            newRole.node.setPosition(oldRole.node.position);
            newRole.node.setScale(oldRole.node.scale);
            newRole.attackIN = oldRole.attackIN;
            this.syncRoleAnimationToTeam(newRole);
            oldRole.node.active = false;
            PoolManager.instance.setPool(PoolEnum.role + oldRole.type, oldRole);
            this.roleLayoutDirty = true;
            didSwitch = true;
            this.pendingRoleSwitchIndex++;
            count--;
        }

        if (didSwitch) {
            this.refreshRoleShadowCasting();
        }

        if (this.pendingRoleSwitchIndex >= this.roleList.length) {
            this.pendingRoleSwitchType = null;
            this.pendingRoleSwitchIndex = 0;
            if (this.roleLayoutDirty) {
                this.roleLayoutDirty = false;
                this.upPos();
            }
        }
    }

    //7.003 2.329

    private roleMove() {
        const animName = this.getCurrentRoleAnimName();
        if (this.currentTeamAnimName === animName) {
            return;
        }
        this.currentTeamAnimName = animName;

        for (let i = 0; i < this.roleList.length; i++) {
            const fbx = this.roleList[i].fbxManager;
            fbx.setAnimation(animName, true);
        }
    }

    private getCurrentRoleAnimName(): PlayerFBXAnimName {
        const isMove = this.move.isMove;
        return this.isLock
            ? (isMove ? PlayerFBXAnimName.run_attack : PlayerFBXAnimName.attack)
            : (isMove ? PlayerFBXAnimName.run : PlayerFBXAnimName.idle);
    }

    private syncRoleAnimationToTeam(role: Role): void {
        if (!role || role.attackIN || !role.fbxManager) {
            return;
        }

        const animName = this.getCurrentRoleAnimName();
        let frame = 0;
        for (let i = 0; i < this.roleList.length; i++) {
            const sourceRole = this.roleList[i];
            if (!sourceRole || sourceRole === role || sourceRole.attackIN || !sourceRole.fbxManager) {
                continue;
            }
            const sourceState = sourceRole.fbxManager.getAnimState(animName);
            if (sourceState && sourceState.duration > 0) {
                frame = (sourceState.time % sourceState.duration) / sourceState.duration;
                break;
            }
        }

        role.fbxManager.setAnimationImmediate(animName, true, frame);
    }


    public addRole(role: Role, attackIn: boolean = true, refreshShadow: boolean = true) {
        if (this.isDie) {
            return false;
        }
        if (this.roleList.length >= this.getEffectiveMaxRoleCount()) {
            return false;
        }
        role.attackIN = attackIn;
        this.roleList.push(role);
        this.curCount = Math.min(this.getEffectiveMaxRoleCount(), this.curCount + 1);
        this.syncRoleAnimationToTeam(role);
        if (refreshShadow) {
            this.refreshRoleShadowCasting();
        }
        return true;
    }

    public canReserveRoleSlot(maxCount: number = this.getEffectiveMaxRoleCount()): boolean {
        const limit = Math.min(this.getEffectiveMaxRoleCount(), Math.max(1, Math.floor(maxCount)));
        return !this.isDie && this.roleList.length + this.pendingAddRoleCount < limit;
    }

    public isRoleCountAtLimit(maxCount: number = this.getEffectiveMaxRoleCount()): boolean {
        const limit = Math.min(this.getEffectiveMaxRoleCount(), Math.max(1, Math.floor(maxCount)));
        return this.roleList.length >= limit;
    }

    public reserveRoleSlot(maxCount: number = this.getEffectiveMaxRoleCount()): number {
        if (!this.canReserveRoleSlot(maxCount)) {
            return -1;
        }
        const index = this.roleList.length + this.pendingAddRoleCount;
        this.pendingAddRoleCount++;
        return index;
    }

    public releaseRoleSlot(): void {
        this.pendingAddRoleCount = Math.max(0, this.pendingAddRoleCount - 1);
    }

    public commitReservedRole(role: Role): Role | null {
        this.releaseRoleSlot();
        if (!role || this.isDie) {
            return null;
        }

        let committedRole = role;
        if (role.type !== this.roleType) {
            committedRole = this.replaceRoleWithCurrentType(role);
        }

        if (!this.addRole(committedRole, false, false)) {
            committedRole.node.active = false;
            PoolManager.instance.setPool(PoolEnum.role + committedRole.type, committedRole);
            return null;
        }
        this.requestRoleJoinLayoutRefresh();
        return committedRole;
    }

    private requestRoleJoinLayoutRefresh(): void {
        if (this.roleJoinLayoutRefreshScheduled) {
            return;
        }
        this.roleJoinLayoutRefreshScheduled = true;
        this.scheduleOnce(this.flushRoleJoinLayoutRefresh, 0);
    }

    private flushRoleJoinLayoutRefresh(): void {
        this.roleJoinLayoutRefreshScheduled = false;
        if (this.isDie || !this.node?.isValid) {
            return;
        }
        this.applyRoleLayout(false);
    }

    private replaceRoleWithCurrentType(role: Role): Role {
        const parent = role.node.parent;
        const worldPos = PoolManager.instance.V3.set(role.node.worldPosition);
        const scale = PoolManager.instance.V3.set(role.node.scale);
        Tween.stopAllByTarget(role.node);
        if (role.fbxManager?.node) {
            Tween.stopAllByTarget(role.fbxManager.node);
        }
        role.node.active = false;
        PoolManager.instance.setPool(PoolEnum.role + role.type, role);

        const newRole = this.getRoleByType(this.roleType);
        if (parent) {
            parent.addChild(newRole.node);
        }
        newRole.node.setWorldPosition(worldPos);
        newRole.node.setScale(scale);
        newRole.attackIN = role.attackIN;
        PoolManager.instance.V3 = worldPos;
        PoolManager.instance.V3 = scale;
        return newRole;
    }

    /**
     * 上移边界计算方法
     * 该方法用于计算角色列表中攻击状态角色的最远x坐标位置，并据此设置移动值
     */
    public upMoveBoundary() {
        // 初始化最大x坐标值为0
        let x = 0;
        // 遍历角色列表
        for (let i = 0; i < this.roleList.length; i++) {
            // 获取当前角色
            const role = this.roleList[i];
            // 如果角色处于攻击状态，则跳过该角色
            if (role.attackIN) {
                continue;
            }
            // 计算角色x坐标的绝对值
            const rx = Math.abs(role.node.x);
            // 更新最大x坐标值
            if (rx > x) {
                x = rx;
            }
        }
        // 设置移动对象的x轴移动值为8减去最大x坐标值
        this.move.MoveX = 7.8 - x;
        this.move.MoveX = 7.8 - x;
    }

    private roleR: number = 0.8;

    public getNextPos(index: number = -1, local: boolean = false) {
        if (index == -1) {
            index = this.roleList.length - 1;
        }
        if (index <= 0) {
            return local ? PoolManager.instance.V3.set(Vec3.ZERO) : PoolManager.instance.V3.set(this.node.worldPosition);
        }
        // 列表第一个位于中心，其余角色按各圈半径权重自动分配。
        const effectiveIndex = index - 1;
        const layerInfo = this.getRoleLayerInfo(effectiveIndex);
        if (local) {
            const pos = getCirclePosition(Vec3.ZERO, layerInfo.layerCount, layerInfo.indexInLayer, (layerInfo.layer + 1) * this.roleR);
            return pos;
        } else {
            const pos = getCirclePosition(this.node.worldPosition, layerInfo.layerCount, layerInfo.indexInLayer, (layerInfo.layer + 1) * this.roleR);
            return pos;
        }
    }

    private getRoleLayerInfo(effectiveIndex: number): { layer: number, layerCount: number, indexInLayer: number } {
        let layer = 0;
        let indexInLayer = Math.max(0, effectiveIndex);
        let layerCount = this.getRoleLayerCount(layer);
        while (indexInLayer >= layerCount) {
            indexInLayer -= layerCount;
            layer++;
            layerCount = this.getRoleLayerCount(layer);
        }
        return { layer, layerCount, indexInLayer };
    }

    private getRoleLayerCount(layer: number): number {
        const ringCount = Math.max(1, Math.floor(this.formationLayerCount) - 1);
        const ringIndex = Math.max(0, Math.floor(layer));
        const roleCountOnRings = Math.max(ringCount, Math.floor(this.maxRoleCount) - 1);
        const totalWeight = ringCount * (ringCount + 1) / 2;
        const currentWeight = Math.min(ringIndex + 1, ringCount);
        const previousWeight = Math.min(ringIndex, ringCount);
        const currentEnd = Math.round(roleCountOnRings * currentWeight * (currentWeight + 1) / 2 / totalWeight);
        const previousEnd = Math.round(roleCountOnRings * previousWeight * (previousWeight + 1) / 2 / totalWeight);
        if (ringIndex < ringCount) {
            return Math.max(1, currentEnd - previousEnd);
        }
        // 超出配置圈数时继续按最外圈容量扩展，避免异常索引造成死循环。
        const lastRingStart = Math.round(roleCountOnRings * (ringCount - 1) * ringCount / 2 / totalWeight);
        return Math.max(1, roleCountOnRings - lastRingStart) << (ringIndex - ringCount + 1);
    }

    public getEffectiveMaxRoleCount(): number {
        return Math.max(1, Math.floor(this.maxRoleCount));
    }

    public get length() {
        return this.roleList.length;
    }
    private selectIndex: number = 0;

    public get attackTarget() {
        this.selectIndex = (this.selectIndex + 1) % this.roleList.length;
        const role = this.roleList[this.selectIndex];
        return role;
    }

    public getMonsterAttackTarget(monsterWorldPos: Vec3): Role | null {
        if (this.isDie || !this.roleList.length) {
            return null;
        }

        let attackRearZ = Number.POSITIVE_INFINITY;
        for (let i = 0; i < this.roleList.length; i++) {
            const role = this.roleList[i];
            if (!this.isValidMonsterTargetRole(role)) {
                continue;
            }
            const roleAttackZ = this.getRoleAttackWorldZ(role);
            if (roleAttackZ < attackRearZ) {
                attackRearZ = roleAttackZ;
            }
        }

        if (!Number.isFinite(attackRearZ)) {
            return null;
        }

        let bestRole: Role = null;
        let bestXDistance = Number.POSITIVE_INFINITY;
        let bestLayer = -1;
        const zTolerance = Math.max(0.05, this.roleR * 0.35);
        const targetX = monsterWorldPos?.x ?? this.node.worldPosition.x;
        for (let i = 0; i < this.roleList.length; i++) {
            const role = this.roleList[i];
            if (!this.isValidMonsterTargetRole(role)) {
                continue;
            }
            const roleAttackZ = this.getRoleAttackWorldZ(role);
            if (Math.abs(roleAttackZ - attackRearZ) > zTolerance) {
                continue;
            }
            const xDistance = Math.abs(role.node.worldPosition.x - targetX);
            const layer = this.getRoleLayer(i);
            if (xDistance < bestXDistance || (Math.abs(xDistance - bestXDistance) <= 0.001 && layer > bestLayer)) {
                bestRole = role;
                bestXDistance = xDistance;
                bestLayer = layer;
            }
        }

        return bestRole;
    }

    public getSmallMonsterAttackTarget(monsterWorldPos: Vec3): Role | null {
        if (this.isDie || !this.roleList.length) {
            return null;
        }

        let frontZ = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < this.roleList.length; i++) {
            const role = this.roleList[i];
            if (this.isValidMonsterTargetRole(role)) {
                frontZ = Math.max(frontZ, role.node.worldPosition.z);
            }
        }
        if (!Number.isFinite(frontZ)) {
            return null;
        }

        let bestRole: Role = null;
        let bestXDistance = Number.POSITIVE_INFINITY;
        const zTolerance = Math.max(0.05, this.roleR * 0.35);
        const targetX = monsterWorldPos?.x ?? this.node.worldPosition.x;
        for (let i = 0; i < this.roleList.length; i++) {
            const role = this.roleList[i];
            if (!this.isValidMonsterTargetRole(role)
                || Math.abs(role.node.worldPosition.z - frontZ) > zTolerance) {
                continue;
            }
            const xDistance = Math.abs(role.node.worldPosition.x - targetX);
            if (xDistance < bestXDistance) {
                bestRole = role;
                bestXDistance = xDistance;
            }
        }
        return bestRole;
    }

    private isValidMonsterTargetRole(role: Role): boolean {
        return !!role?.node?.activeInHierarchy && !role.attackIN && role.hp > 0;
    }

    private getRoleAttackWorldZ(role: Role): number {
        return role?.shoot?.isValid ? role.shoot.worldPosition.z : role.node.worldPosition.z;
    }


    public upPos() {
        this.applyRoleLayout(false);
    }

    public requestShrinkAfterRoleLoss(): void {
        if (this.isDie) {
            return;
        }
        this.recycleInactiveRoles();
        this.recycleOverflowRoles();
        this.refreshRoleShadowCasting();
        if (this.getCombatRoleCount() <= 0) {
            this.cancelDelayedShrink();
            this.handlePlayerDie();
            return;
        }

        if (this.shrinkAnimating) {
            this.shrinkDirtyDuringAnimating = true;
            return;
        }

        this.shrinkDelayTimer = Math.max(0, this.shrinkAfterRoleLossDelay);
        if (this.shrinkDelayTimer <= 0) {
            this.processDelayedShrink(0);
        }
    }

    private processDelayedShrink(dt: number): void {
        if (this.shrinkDelayTimer < 0) {
            return;
        }
        if (this.isDie) {
            this.cancelDelayedShrink();
            return;
        }
        if (this.shrinkAnimating) {
            this.shrinkDelayTimer = -1;
            this.shrinkDirtyDuringAnimating = true;
            return;
        }

        this.shrinkDelayTimer -= dt;
        if (this.shrinkDelayTimer > 0) {
            return;
        }

        this.shrinkDelayTimer = -1;
        this.applyRoleLayout(true);
    }

    private cancelDelayedShrink(): void {
        this.shrinkDelayTimer = -1;
        this.shrinkAnimating = false;
        this.shrinkDirtyDuringAnimating = false;
    }

    private applyRoleLayout(isDelayedShrink: boolean): void {
        if (this.isDie) {
            return;
        }
        this.recycleInactiveRoles();
        this.recycleOverflowRoles();
        this.refreshRoleShadowCasting();
        if (this.getCombatRoleCount() <= 0) {
            this.cancelDelayedShrink();
            this.handlePlayerDie();
            return;
        }

        if (isDelayedShrink) {
            this.shrinkAnimating = true;
            this.shrinkDirtyDuringAnimating = false;
        }

        let layoutIndex = 0;
        for (let i = 0; i < this.roleList.length; i++) {
            const role = this.roleList[i];
            if (role.attackIN) {
                continue;
            }
            if (!layoutIndex) {
                tween(role.node).to(this.roleLayoutTweenDuration, { position: Vec3.ZERO }).start();
            } else {
                const pos = this.getNextPos(layoutIndex, true);
                tween(role.node).to(this.roleLayoutTweenDuration, { position: pos }).call(() => {
                    PoolManager.instance.V3 = pos;
                }).start();
            }
            layoutIndex++;
        }
        this.upMoveBoundary();

        if (isDelayedShrink) {
            this.scheduleOnce(() => {
                this.shrinkAnimating = false;
                if (!this.shrinkDirtyDuringAnimating) {
                    return;
                }
                this.shrinkDirtyDuringAnimating = false;
                this.requestShrinkAfterRoleLoss();
            }, this.roleLayoutTweenDuration);
        }
    }

    private refreshRoleShadowCasting(): void {
        const onlyOuterLayer = this.onlyOuterLayerCastShadow || director.getScene()?.name === 'Game_3D-002';
        if (!onlyOuterLayer) {
            for (let i = 0; i < this.roleList.length; i++) {
                this.roleList[i]?.setShadowCastingEnabled(true);
            }
            return;
        }

        let combatRoleCount = 0;
        for (let i = 0; i < this.roleList.length; i++) {
            const role = this.roleList[i];
            if (role?.node?.active && !role.attackIN) {
                combatRoleCount++;
            }
        }

        const outerLayer = combatRoleCount > 0 ? this.getRoleLayer(combatRoleCount - 1) : 0;
        let shadowMinLayer = outerLayer;
        let combatIndex = 0;
        for (let i = 0; i < this.roleList.length; i++) {
            const role = this.roleList[i];
            if (!role) {
                continue;
            }
            if (!role.node.active || role.attackIN) {
                role.setShadowCastingEnabled(true);
                continue;
            }
            role.setShadowCastingEnabled(this.getRoleLayer(combatIndex) >= shadowMinLayer);
            combatIndex++;
        }
    }

    private getCombatRoleCount(): number {
        let count = 0;
        for (let i = 0; i < this.roleList.length; i++) {
            const role = this.roleList[i];
            if (role && role.node.active && !role.attackIN) {
                count++;
            }
        }
        return count;
    }

    private recycleInactiveRoles(): void {
        for (let i = this.roleList.length - 1; i >= 0; i--) {
            const role = this.roleList[i];
            if (!role || !role.node.active) {
                this.roleList.splice(i, 1);
                if (role) {
                    PoolManager.instance.setPool(PoolEnum.role + role.type, role);
                }
            }
        }
    }

    private recycleOverflowRoles(): void {
        const maxCount = this.getEffectiveMaxRoleCount();
        for (let i = this.roleList.length - 1; i >= maxCount; i--) {
            const role = this.roleList[i];
            this.roleList.splice(i, 1);
            if (!role) {
                continue;
            }
            Tween.stopAllByTarget(role.node);
            if (role.fbxManager?.node) {
                Tween.stopAllByTarget(role.fbxManager.node);
            }
            role.node.active = false;
            PoolManager.instance.setPool(PoolEnum.role + role.type, role);
        }
    }

    private recyclePendingAttackRoles(): void {
        for (let i = this.roleList.length - 1; i >= 0; i--) {
            const role = this.roleList[i];
            if (!role || !role.attackIN) {
                continue;
            }
            Tween.stopAllByTarget(role.node);
            if (role.fbxManager?.node) {
                Tween.stopAllByTarget(role.fbxManager.node);
            }
            role.node.active = false;
            this.roleList.splice(i, 1);
            PoolManager.instance.setPool(PoolEnum.role + role.type, role);
        }
    }

    private handlePlayerDie(): void {
        this.cancelDelayedShrink();
        this.isDie = true;
        this.recyclePendingAttackRoles();
        EventManager.instance.on(EventType.PLAYER_RESURRECTION, this.TimeFlowsBackWard, this, true);
        EventManager.instance.emit(EventType.PLAYER_DIE);
        GameOverPanel.instance.show(false);
    }

    public hit(pos: Vec3, count: number = 4) {
        if (this.isDie) {
            return;
        }
        const list = this.roleList;
        const total = list.length;
        let candidateCount = 0;
        // 预分配距离数组，避免临时对象
        const dists: number[] = [];
        for (let i = 0; i < total; i++) {
            if (list[i].attackIN) {
                dists[i] = Number.MAX_VALUE;
                continue;
            }
            candidateCount++;
            const rp = list[i].node.worldPosition;
            const dx = rp.x - pos.x;
            const dz = rp.z - pos.z;
            dists[i] = dx * dx + dz * dz;
        }
        // 选择法找最近的 len 个索引
        const len = count < candidateCount ? count : candidateCount;
        if (len <= 0) {
            return;
        }
        const picked: number[] = [];
        const used: boolean[] = [];
        for (let n = 0; n < len; n++) {
            let minIdx = -1;
            let minDist = 0;
            for (let i = 0; i < total; i++) {
                if (used[i]) continue;
                if (dists[i] === Number.MAX_VALUE) continue;
                if (minIdx < 0 || dists[i] < minDist) {
                    minIdx = i;
                    minDist = dists[i];
                }
            }
            if (minIdx < 0) {
                break;
            }
            picked[n] = minIdx;
            used[minIdx] = true;
        }
        // 从后往前删除，保证索引不错位
        for (let i = 0; i < picked.length; i++) {
            const role = list[picked[i]];
            role.hp -= 3;
            this.roleDie(role);
            // role.node.active = false;
            // PoolManager.instance.setPool(PoolEnum.role + this.roleType, role);
        }
        picked.sort(function (a, b) { return b - a; });
        for (let i = 0; i < picked.length; i++) {
            list.splice(picked[i], 1);
        }
        this.requestShrinkAfterRoleLoss();
    }


    private hit_2(role: Role, power: number) {
        this.applyRoleDamage(role, power);
    }

    private applyRoleDamage(role: Role, power: number): void {
        if (this.isDie || !role || role.attackIN || role.hp <= 0) {
            return;
        }
        const index = this.roleList.indexOf(role);
        if (index === -1 || !role.node?.activeInHierarchy) {
            return;
        }

        role.hp -= power;
        if (role.hp <= 0) {
            this.roleList.splice(index, 1);
            this.roleDie(role);
            this.requestShrinkAfterRoleLoss();
        } else {
            FlashRedManager.instance.flashRed(role.node, role.meshRedDataList);
        }
    }

    private TimeFlowsBackWard() {
        this.clearRolesForRetry();
        this.syncRespawnRoleCount();
        this.isDie = false;
        this.currentTeamAnimName = null;
        this.pendingAddRoleCount = 0;
        this.pendingStaggerShots.length = 0;
        this.continuousShotAccumulator = 0;
        this.continuousRoleCursor = 0;
        this._attackTime = 0.5;
        const retryRoleCount = Math.min(this.curCount, this.getRetryMaxRoleCount());
        for (let i = 0; i < retryRoleCount; i++) {
            const role = this.role;
            this.roleList.push(role);
            this.node.addChild(role.node);
            role.attackIN = false;
            if (i == 0) {
                role.node.setPosition(Vec3.ZERO);
            } else {
                const pos = this.getNextPos(i, true);
                role.node.setPosition(pos);
                PoolManager.instance.V3 = pos;
            }
            role.node.setScale(Vec3.ZERO);
            tween(role.node).to(0.2, { scale: Vec3.ONE }, { easing: "backOut" }).start();
            role.fbxManager.setAnimation(PlayerFBXAnimName.idle, true);
        }
        this.refreshRoleShadowCasting();
        this.selectIndex = 0;
        this.attackIn = false;
    }

    private syncRespawnRoleCount(): void {
        const currentRoleCount = this.roleList?.length ?? 0;
        this.curCount = Math.min(this.getEffectiveMaxRoleCount(), Math.max(1, this.curCount, currentRoleCount));
    }

    private getRetryMaxRoleCount(): number {
        const circleCount = Math.max(1, Math.floor(this.retryMaxRoleLayerCount));
        let maxCount = 1;
        for (let layer = 0; layer < circleCount - 1; layer++) {
            maxCount += this.getRoleLayerCount(layer);
        }
        return Math.min(this.getEffectiveMaxRoleCount(), maxCount);
    }

    private clearRolesForRetry(): void {
        this.cancelDelayedShrink();
        this.pendingAddRoleCount = 0;
        if (!this.roleList?.length) {
            return;
        }
        for (let i = this.roleList.length - 1; i >= 0; i--) {
            const role = this.roleList[i];
            if (!role) {
                continue;
            }
            Tween.stopAllByTarget(role.node);
            role.node.active = false;
            PoolManager.instance.setPool(PoolEnum.role + role.type, role);
        }
        this.roleList.length = 0;
    }

    roleDie(role: Role) {
        const endTime = role.fbxManager.setAnimation(PlayerFBXAnimName.die, false).duration;
        role.die(endTime);
        this.scheduleOnce(() => {
            role.node.active = false;
            PoolManager.instance.setPool(PoolEnum.role + role.type, role);
        }, endTime);
    }

    private get role() {
        const role = this.getRoleByType(this.roleType);
        role.hp = 2;
        role.node.active = true;
        return role;
    }

    public getRoleForSpawn(): Role {
        return this.getRoleByType(this.roleType);
    }

    private getRoleByType(roleType: RoleEnum) {
        let role = this.getPooledRoleByType(roleType);
        if (!role) {
            role = this.createRoleByType(roleType);
            this.prepareRoleForUse(role, roleType);
        }
        return role;
    }

    private getPooledRoleByType(roleType: RoleEnum): Role | null {
        const role = PoolManager.instance.getPool<Role>(PoolEnum.role + roleType);
        if (!role) {
            return null;
        }
        this.prepareRoleForUse(role, roleType);
        return role;
    }

    private prepareRoleForUse(role: Role, roleType: RoleEnum): void {
        role.type = roleType;
        role.hp = 2;
        role.node.active = true;
        role.resetForSpawn();
    }

    private createRoleByType(roleType: RoleEnum) {
        const node = PrefabsManager.instance.GetPrefabsIns(PrefabsEnum.hero, roleType);
        const role = node.getComponent(Role);
        role.type = roleType;
        return role;
    }


    private attackEvent(index: number) {
        AudioManager.inst.playOneShot(Role.soundType, 0.3, 0.08);
        // console.log("攻击", index);
        const pos = this.shootList[index].worldPosition;
        const bullet = BulletManager.instance.shootBullet3D(this.getCurrentBulletType(), Quat.IDENTITY, Role.power, Role.repelPower);
        Role.bulletLayer.addChild(bullet.node);
        bullet.node.setWorldPosition(pos);
        Role.aimBulletToCurrentTarget(bullet, this.node.worldPosition.x);
        BulletBatchRenderer.register(Role.bulletLayer, bullet);
        // this.effect?.play();
    }



    // private _soundTime: number = 0;
    // // private soundInterval: number = 0.2;

    // private attackSound(dt: number) {
    //     if (this._soundTime <= 0) {
    //         this._soundTime = 1 / (this.attackSpeed * (this.roleList.length));
    //     }
    // }
}
