import { _decorator, CCBoolean, CCFloat, CCInteger, Component, Node, Quat, Tween, tween, Vec3 } from 'cc';
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
}

type PendingRoleShot = {
    role: Role;
    fireTime: number;
    visualBulletCount: number;
    damageScale: number;
    lockWorldX: number;
    playEffect: boolean;
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

    protected readonly LayerCount = 8;

    public roleType: RoleEnum = RoleEnum.underling;

    @property(Role)
    public roleList: Role[] = [];

    public move: MoveDrive;

    @property(CCFloat)
    public attackSpeed: number = 2;

    public isDie: boolean = false;
    private curCount: number = 1;
    private pendingAddRoleCount: number = 0;

    @property({ type: CCInteger, displayName: '+1人数上限', tooltip: '玩家通过 +1 最多增加到的角色数量。达到后继续吃 +1 只回收道具，不再增加角色。' })
    public maxRoleCount: number = 53;

    @property({ type: CCInteger, displayName: '最外圈角色数', tooltip: '最外圈排满需要的角色数量。填 28 时，满员阵型为 1 + 8 + 16 + 28 = 53。' })
    public outerLayerRoleCount: number = 28;

    @property({ type: CCFloat, displayName: '减员缩圈延迟(秒)', tooltip: '角色减少后等待多久再重新排列缩圈。等待期间再次减员会重新计时。' })
    public shrinkAfterRoleLossDelay: number = 2;

    @property({ type: CCInteger, displayName: '同时发射子弹人数上限', tooltip: '每轮最多允许多少个角色同时发射子弹。只限制射击人数，不影响 +1 总人数。' })
    public maxShootingRoleCount: number = 30;

    @property({ type: CCInteger, displayName: '枪口特效最大播放数', tooltip: '每轮射击最多允许多少个角色播放枪口特效。只影响特效，不影响子弹数量。' })
    public maxMuzzleEffectCount: number = 8;
    @property({ type: CCInteger, displayName: '错峰发射武器配置索引', tooltip: '指定哪一个武器子弹配置使用错峰发射。0 表示第一个油桶给出的武器；负数表示关闭。' })
    public staggerShotWeaponConfigIndex: number = 0;
    @property({ type: CCFloat, displayName: '错峰发射占攻击间隔比例', tooltip: '错峰武器每轮射击摊开的时间比例。0.85 表示在本轮攻击间隔的 85% 时间内连续发射，伤害和总弹量不变。' })
    public staggerShotWindowRatio: number = 0.85;
    @property({ type: CCInteger, displayName: '默认武器配置索引', tooltip: '开局默认使用的“武器子弹配置”索引。-1 表示保持旧默认值：子弹 arrow、威力 1、攻击速度使用 Player.attackSpeed。' })
    public defaultWeaponConfigIndex: number = -1;
    @property(CCBoolean)
    public enableRuntimeUpgradePrewarm: boolean = false;
    @property({ type: [WeaponBulletConfig], displayName: '武器子弹配置', tooltip: '配置各武器的子弹威力和子弹模型。' })
    public weaponBulletConfigList: WeaponBulletConfig[] = [
        (() => {
            const config = new WeaponBulletConfig();
            config.armsType = ArmsTypeEnum.bq;
            config.weaponModel = ArmsTypeEnum.none;
            config.bulletPower = 2;
            config.bulletType = BulletEnum.arrow_1;
            return config;
        })(),
        (() => {
            const config = new WeaponBulletConfig();
            config.armsType = ArmsTypeEnum.jq;
            config.weaponModel = ArmsTypeEnum.none;
            config.bulletPower = 2;
            config.bulletType = BulletEnum.arrow_2;
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

    private shootRoleStartIndex: number = 0;
    private pendingRoleSwitchType: RoleEnum = null;
    private pendingRoleSwitchIndex: number = 0;
    private readonly roleSwitchPerFrame: number = 6;
    private pendingRolePrewarmType: RoleEnum = null;
    private pendingRolePrewarmCount: number = 0;
    private readonly rolePrewarmPerFrame: number = 4;
    private pendingBulletPrewarmType: BulletEnum = null;
    private pendingBulletPrewarmCount: number = 0;
    private pendingBulletBatchWarmType: BulletEnum = null;
    private readonly bulletPrewarmPerFrame: number = 2;
    private currentWeaponBulletConfigIndex: number = -1;
    private staggerShotClock: number = 0;
    private pendingStaggerShots: PendingRoleShot[] = [];
    private roleLayoutDirty: boolean = false;
    private shrinkDelayTimer: number = -1;
    private shrinkAnimating: boolean = false;
    private shrinkDirtyDuringAnimating: boolean = false;
    private readonly roleLayoutTweenDuration: number = 0.2;

    public isLock: boolean = false;

    // public MoveX: number = 8;

    @property(Node)
    public shootList: Node[] = [];
    private shootIndex: number = 1;


    start() {
        Player.instance = this;
        this.move = this.node.getComponent(MoveDrive);
        this.applyDefaultWeaponConfig();
        this.syncRespawnRoleCount();
        EventManager.instance.on(EventType.PLAYER_HIT, this.hit, this);
        EventManager.instance.on(EventType.PLAYER_HIT_2, this.hit_2, this);
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

        if (this._attackTime <= 0) {
            // this.attackIn = true;
            const attackTime = 1 / this.attackSpeed;
            this._attackTime = attackTime;
            // const layer = Math.round(this.roleList.length / this.LayerCount) * 2 + 1;

            // for (let i = 0; i < layer; i++) {
            //     this.attackEvent(i);
            // }

            const shootCount = Math.min(this.roleList.length, this.maxShootingRoleCount);
            const outerLayer = this.getShootingOuterLayer(shootCount);
            const useStaggerShot = this.shouldUseStaggerShot();
            let effectPlayCount = 0;
            for (let i = 0; i < shootCount; i++) {
                const roleIndex = (this.shootRoleStartIndex + i) % this.roleList.length;
                const role = this.roleList[roleIndex];
                if (!role.attackIN) {
                    const playEffect = this.shouldPlayMuzzleEffect(roleIndex, outerLayer, effectPlayCount);
                    if (playEffect) {
                        effectPlayCount++;
                    }
                    if (useStaggerShot) {
                        this.enqueueStaggerShot(role, i, shootCount, attackTime, role.visualBulletCount, 1, this.node.worldPosition.x, playEffect);
                    } else {
                        role.attackEvent(0, role.visualBulletCount, 1, this.node.worldPosition.x, playEffect);
                    }
                    // const animIndex = isMove ? PlayerFBXAnimName.run_attack : PlayerFBXAnimName.attack;
                    // const animState = role.fbxManager.setAnimation(animIndex, false);
                    // const endTime = animState.duration;
                    // const animScale = endTime / attackTime;
                    // animState.speed = animScale;

                }
            }
            if (this.roleList.length > 0) {
                this.shootRoleStartIndex = (this.shootRoleStartIndex + shootCount) % this.roleList.length;
            }
            // this.scheduleOnce(() => {
            //     this.attackIn = false;
            // }, attackTime)
        } else {
            this._attackTime -= dt;
        }
    }

    private shouldUseStaggerShot(): boolean {
        return this.staggerShotWeaponConfigIndex >= 0
            && this.currentWeaponBulletConfigIndex === Math.floor(this.staggerShotWeaponConfigIndex)
            && this.staggerShotWindowRatio > 0;
    }

    private enqueueStaggerShot(role: Role, shotIndex: number, shootCount: number, attackTime: number, visualBulletCount: number, damageScale: number, lockWorldX: number, playEffect: boolean): void {
        if (!role || shootCount <= 1) {
            role?.attackEvent(0, visualBulletCount, damageScale, lockWorldX, playEffect);
            return;
        }

        const windowRatio = Math.max(0, Math.min(0.95, this.staggerShotWindowRatio));
        const spreadTime = Math.max(0, attackTime * windowRatio);
        const delay = spreadTime * shotIndex / Math.max(1, shootCount - 1);
        this.pendingStaggerShots.push({
            role,
            fireTime: this.staggerShotClock + delay,
            visualBulletCount,
            damageScale,
            lockWorldX,
            playEffect,
        });
    }

    private processPendingStaggerShots(): void {
        for (let i = this.pendingStaggerShots.length - 1; i >= 0; i--) {
            const shot = this.pendingStaggerShots[i];
            if (!shot || shot.fireTime > this.staggerShotClock) {
                continue;
            }
            this.pendingStaggerShots[i] = this.pendingStaggerShots[this.pendingStaggerShots.length - 1];
            this.pendingStaggerShots.pop();
            if (!shot.role || !shot.role.node || !shot.role.node.activeInHierarchy || shot.role.attackIN) {
                continue;
            }
            shot.role.attackEvent(0, shot.visualBulletCount, shot.damageScale, shot.lockWorldX, shot.playEffect);
        }
    }

    private getShootingOuterLayer(shootCount: number): number {
        let outerLayer = 0;
        for (let i = 0; i < shootCount; i++) {
            const roleIndex = (this.shootRoleStartIndex + i) % this.roleList.length;
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
        this.currentWeaponBulletConfigIndex = weaponBulletConfig ? this.getWeaponBulletConfigResolvedIndex(weaponBulletConfig, weaponBulletConfigIndex) : -1;
        let shouldApplyRoleModel = false;
        switch (upgradeArmsType) {
            case ArmsTypeEnum.bq:
                this.applyWeaponBulletConfig(weaponBulletConfig);
                this.applyWeaponAttackSpeed(upgradeArmsType);
                shouldApplyRoleModel = true;
                break;
            case ArmsTypeEnum.jq:
                this.applyWeaponBulletConfig(weaponBulletConfig);
                this.applyWeaponAttackSpeed(upgradeArmsType);
                shouldApplyRoleModel = true;
                break;

            case ArmsTypeEnum.jtl:
                this.applyWeaponBulletConfig(weaponBulletConfig);
                this.applyWeaponAttackSpeed(upgradeArmsType);
                TweenTool.scaleShake(this.node);
                this.roleR = 1;
                Role.soundType = SoundEnum.Sound_FireGun;
                shouldApplyRoleModel = true;
                break;
            case ArmsTypeEnum.jtl2: {
                this.applyWeaponBulletConfig(weaponBulletConfig);
                this.applyWeaponAttackSpeed(upgradeArmsType);
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
        this.startRolePrewarm(targetRoleType, this.roleList.length);
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
            this.currentWeaponBulletConfigIndex = -1;
            return;
        }
        this.applyWeaponBulletConfig(config);
        const armsType = config.armsType;
        this.applyWeaponAttackSpeed(armsType);
        const soundType = this.getSoundTypeByArms(armsType);
        if (soundType !== null) {
            Role.soundType = soundType;
        }
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

    private applyWeaponAttackSpeed(armwType: ArmsTypeEnum): void {
        switch (armwType) {
            case ArmsTypeEnum.bq:
                this.attackSpeed = 4;
                break;
            case ArmsTypeEnum.jq:
                this.attackSpeed = 6;
                break;
            case ArmsTypeEnum.jtl:
                this.attackSpeed = 10;
                break;
            case ArmsTypeEnum.jtl2:
                this.attackSpeed = 20;
                break;
        }
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
        const shootCount = Math.min(this.roleList.length, this.maxShootingRoleCount);
        let count = 0;
        for (let i = 0; i < shootCount; i++) {
            const role = this.roleList[i];
            count += role ? role.visualBulletCount : 1;
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
            BulletBatchRenderer.getOrCreate(bulletLayer).prewarmBullet(bullet);
            this.pendingBulletPrewarmCount--;
            count--;
        }

        if (this.pendingBulletPrewarmCount <= 0) {
            this.pendingBulletPrewarmType = null;
        }

        if (this.pendingBulletBatchWarmType !== null) {
            const bullet = BulletManager.instance.prewarmBullet3D(this.pendingBulletBatchWarmType, bulletLayer, false);
            BulletBatchRenderer.getOrCreate(bulletLayer).prewarmBullet(bullet);
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

        let count = Math.min(this.rolePrewarmPerFrame, this.pendingRolePrewarmCount);
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
            this.startRolePrewarm(roleType, this.roleList.length);
        } else {
            this.pendingRolePrewarmType = null;
            this.pendingRolePrewarmCount = 0;
        }
    }

    private processPendingRoleSwitch() {
        if (this.pendingRoleSwitchType === null) {
            return;
        }

        let count = this.roleSwitchPerFrame;
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

            const newRole = this.getRoleByType(this.pendingRoleSwitchType);
            Tween.stopAllByTarget(oldRole.node);
            Tween.stopAllByTarget(newRole.node);
            this.roleList[index] = newRole;
            this.node.addChild(newRole.node);
            newRole.node.setPosition(oldRole.node.position);
            newRole.node.setScale(oldRole.node.scale);
            newRole.attackIN = oldRole.attackIN;
            oldRole.node.active = false;
            PoolManager.instance.setPool(PoolEnum.role + oldRole.type, oldRole);
            this.roleLayoutDirty = true;
            this.pendingRoleSwitchIndex++;
            count--;
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

        for (let i = 0; i < this.roleList.length; i++) {
            const fbx = this.roleList[i].fbxManager;
            const state = fbx.getAnimState(animName);
            if (fbx.curState !== animName || !state?.isPlaying) {
                fbx.setAnimation(animName, true);
            }
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


    public addRole(role: Role, attackIn: boolean = true) {
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

        if (!this.addRole(committedRole, false)) {
            committedRole.node.active = false;
            PoolManager.instance.setPool(PoolEnum.role + committedRole.type, committedRole);
            return null;
        }
        return committedRole;
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
        // 列表第一个不算，用 index-1 作为有效索引
        // 第 n 层数量 = LayerCount * 2^n，前 n 层总数 = LayerCount * (2^n - 1)
        // layer = floor(log2(effectiveIndex / LayerCount + 1))
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
        if (layer <= 0) {
            return this.LayerCount;
        }
        if (layer === 1) {
            return this.LayerCount * 2;
        }
        const outerCount = Math.max(1, Math.floor(this.outerLayerRoleCount));
        if (layer === 2) {
            return outerCount;
        }
        return outerCount << (layer - 2);
    }

    public getEffectiveMaxRoleCount(): number {
        const configuredMax = Math.max(1, Math.floor(this.maxRoleCount));
        const fourLayerMax = 1 + this.getRoleLayerCount(0) + this.getRoleLayerCount(1) + this.getRoleLayerCount(2);
        return Math.min(configuredMax, fourLayerMax);
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


    public upPos() {
        this.applyRoleLayout(false);
    }

    public requestShrinkAfterRoleLoss(): void {
        if (this.isDie) {
            return;
        }
        this.recycleInactiveRoles();
        this.recycleOverflowRoles();
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
        if (role.attackIN) {
            return;
        }
        role.hp -= power;
        if (role.hp <= 0) {
            const index = this.roleList.indexOf(role);
            if (index != -1) {
                this.roleList.splice(index, 1);
                this.roleDie(role);
                this.requestShrinkAfterRoleLoss();
            }
        } else {
            FlashRedManager.instance.flashRed(role.node, role.meshRedDataList);
        }
    }

    private TimeFlowsBackWard() {
        this.clearRolesForRetry();
        this.syncRespawnRoleCount();
        this._attackTime = 0.5;
        this.shootRoleStartIndex = 0;
        for (let i = 0; i < this.curCount; i++) {
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
        this.selectIndex = 0;
        this.attackIn = false;
        this.scheduleOnce(() => {
            this.isDie = false;
        }, 2);
    }

    private syncRespawnRoleCount(): void {
        const currentRoleCount = this.roleList?.length ?? 0;
        this.curCount = Math.min(this.getEffectiveMaxRoleCount(), Math.max(1, this.curCount, currentRoleCount));
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
        let role = PoolManager.instance.getPool<Role>(PoolEnum.role + roleType);
        if (!role) {
            role = this.createRoleByType(roleType);
        }
        role.type = roleType;
        role.hp = 2;
        role.node.active = true;
        role.resetForSpawn();
        return role;
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
        const bullet = BulletManager.instance.shootBullet3D(Role.bulletType, Quat.IDENTITY, Role.power, Role.repelPower);
        Role.bulletLayer.addChild(bullet.node);
        bullet.node.setWorldPosition(pos);
        Role.aimBulletToCurrentTarget(bullet, this.node.worldPosition.x);
        BulletBatchRenderer.getOrCreate(Role.bulletLayer).registerBullet(bullet);
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
