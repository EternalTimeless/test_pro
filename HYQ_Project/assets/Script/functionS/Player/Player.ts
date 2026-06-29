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

    @property({ type: CCInteger, displayName: '+1人数上限', tooltip: '玩家通过 +1 最多增加到的角色数量。达到后继续吃 +1 只回收道具，不再增加角色。' })
    public maxRoleCount: number = 55;

    @property({ type: CCInteger, displayName: '同时发射子弹人数上限', tooltip: '每轮最多允许多少个角色同时发射子弹。只限制射击人数，不影响 +1 总人数。' })
    public maxShootingRoleCount: number = 30;

    @property({ type: CCInteger, displayName: '枪口特效最大播放数', tooltip: '每轮射击最多允许多少个角色播放枪口特效。只影响特效，不影响子弹数量。' })
    public maxMuzzleEffectCount: number = 8;
    @property(CCBoolean)
    public enableRuntimeUpgradePrewarm: boolean = false;

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
    private roleLayoutDirty: boolean = false;

    public isLock: boolean = false;

    // public MoveX: number = 8;

    @property(Node)
    public shootList: Node[] = [];
    private shootIndex: number = 1;


    start() {
        Player.instance = this;
        this.move = this.node.getComponent(MoveDrive);
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

        if (this.isLock) {

            this.roleAttack(dt);
        }
        this.processPendingRolePrewarm();
        this.processPendingBulletPrewarm();
        this.processPendingRoleSwitch();
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
            let effectPlayCount = 0;
            for (let i = 0; i < shootCount; i++) {
                const roleIndex = (this.shootRoleStartIndex + i) % this.roleList.length;
                const role = this.roleList[roleIndex];
                if (!role.attackIN) {
                    const playEffect = this.shouldPlayMuzzleEffect(roleIndex, outerLayer, effectPlayCount);
                    if (playEffect) {
                        effectPlayCount++;
                    }
                    role.attackEvent(0, role.visualBulletCount, 1, this.node.worldPosition.x, playEffect);
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
        return Math.floor(Math.log2(effectiveIndex / this.LayerCount + 1));
    }

    public upArms(armwType: ArmsTypeEnum) {
        switch (armwType) {
            case ArmsTypeEnum.bq:
                Role.power = 2;
                this.attackSpeed = 4;
                Role.bulletType = BulletEnum.arrow_1;
                break;
            case ArmsTypeEnum.jq:
                // Role.power = 3;
                Role.bulletType = BulletEnum.arrow_2;

                this.attackSpeed = 6;
                break;

            case ArmsTypeEnum.jtl:
                Role.power = 0.5;
                this.attackSpeed = 10;
                Role.bulletType = BulletEnum.arrow_3;
                TweenTool.scaleShake(this.node);
                this.roleR = 1;
                Role.soundType = SoundEnum.Sound_FireGun;
                this.startRoleSwitch(RoleEnum.dazhuang);
                break;
            case ArmsTypeEnum.jtl2: {
                Role.power = 0.3;
                Role.bulletType = BulletEnum.arrow_4;
                this.attackSpeed = 20;
                TweenTool.scaleShake(this.node);
                this.roleR = 1;
                Role.soundType = SoundEnum.Sound_FireGun;
                this.startRoleSwitch(RoleEnum.dazhuangPlus);
                break;
            }
            case ArmsTypeEnum.tk:
                GameOverPanel.instance.show(true);
                break;
            case ArmsTypeEnum.jj:
                GameOverPanel.instance.show(true);
                break;
        }
    }

    public prepareArmsUpgrade(armwType: ArmsTypeEnum) {
        AudioManager.inst.preload(SoundEnum.Sound_Ship_UpLevel);
        const soundType = this.getSoundTypeByArms(armwType);
        if (soundType !== null) {
            AudioManager.inst.preload(soundType);
        }
        if (!this.enableRuntimeUpgradePrewarm) {
            this.clearRuntimeWarmupQueue();
            return;
        }

        const bulletType = this.getBulletTypeByArms(armwType);
        if (bulletType !== null) {
            this.startBulletPrewarm(bulletType, this.getWeaponPrewarmBulletCount());
        }

        const targetRoleType = this.getRoleTypeByArms(armwType);
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
            case ArmsTypeEnum.jtl:
                return RoleEnum.dazhuang;
            case ArmsTypeEnum.jtl2:
                return RoleEnum.dazhuangPlus;
        }
        return null;
    }

    private getBulletTypeByArms(armwType: ArmsTypeEnum): BulletEnum | null {
        switch (armwType) {
            case ArmsTypeEnum.bq:
                return BulletEnum.arrow_1;
            case ArmsTypeEnum.jq:
                return BulletEnum.arrow_2;
            case ArmsTypeEnum.jtl:
                return BulletEnum.arrow_3;
            case ArmsTypeEnum.jtl2:
                return BulletEnum.arrow_4;
        }
        return null;
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
        const isMove = this.move.isMove;

        if (this.isLock) {
            for (let i = 0; i < this.roleList.length; i++) {
                const role = this.roleList[i];
                if (isMove) {
                    role.fbxManager.setAnimation(PlayerFBXAnimName.run_attack, true);
                } else {
                    role.fbxManager.setAnimation(PlayerFBXAnimName.attack, true);
                }
            }

        } else {
            for (let i = 0; i < this.roleList.length; i++) {
                const role = this.roleList[i];
                if (isMove) {
                    role.fbxManager.setAnimation(PlayerFBXAnimName.run, true);
                } else {
                    role.fbxManager.setAnimation(PlayerFBXAnimName.idle, true);
                }
            }
        }
    }


    public addRole(role: Role) {
        if (this.roleList.length >= this.maxRoleCount) {
            return false;
        }
        role.attackIN = true;
        this.roleList.push(role);
        this.curCount++;
        return true;
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
        // 在控制台输出边界值
        console.log("Boundary:" + x);
        // 设置移动对象的x轴移动值为8减去最大x坐标值
        this.move.MoveX = 7.8 - x;

    }

    private roleR: number = 0.8;

    public getNextPos(index: number = -1, local: boolean = false) {
        if (index == -1) {
            index = this.roleList.length - 1;
        }
        // 列表第一个不算，用 index-1 作为有效索引
        // 第 n 层数量 = LayerCount * 2^n，前 n 层总数 = LayerCount * (2^n - 1)
        // layer = floor(log2(effectiveIndex / LayerCount + 1))
        const effectiveIndex = index - 1;
        const layer = Math.floor(Math.log2(effectiveIndex / this.LayerCount + 1));
        const layerCount = this.LayerCount << layer;
        const indexInLayer = effectiveIndex - this.LayerCount * ((1 << layer) - 1);
        if (local) {
            const pos = getCirclePosition(Vec3.ZERO, layerCount, indexInLayer, (layer + 1) * this.roleR);
            return pos;
        } else {
            const pos = getCirclePosition(this.node.worldPosition, layerCount, indexInLayer, (layer + 1) * this.roleR);
            return pos;
        }
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
        if (this.isDie) {
            return;
        }
        this.isDie = this.roleList.length == 0;
        if (this.isDie) {
            // this.TimeFlowsBackWard();
            EventManager.instance.on(EventType.PLAYER_RESURRECTION, this.TimeFlowsBackWard, this, true);
            EventManager.instance.emit(EventType.PLAYER_DIE);
            GameOverPanel.instance.show(false);
        }

        for (let i = this.roleList.length - 1; i >= 0; i--) {
            const role = this.roleList[i];
            if (!role.node.active) {
                this.roleList.splice(i, 1);
                PoolManager.instance.setPool(PoolEnum.role + role.type, role);
            }
        }
        for (let i = 0; i < this.roleList.length; i++) {
            const role = this.roleList[i];
            if (!i) {
                tween(role.node).to(0.2, { position: Vec3.ZERO }).start();
            } else {
                const pos = this.getNextPos(i, true);
                tween(role.node).to(0.2, { position: pos }).call(() => {
                    PoolManager.instance.V3 = pos;
                }).start();
            }
        }
        this.upMoveBoundary();
    }

    public hit(pos: Vec3, count: number = 4) {
        if (this.isDie) {
            return;
        }
        const list = this.roleList;
        const total = list.length;
        const len = count < total ? count : total;
        // 预分配距离数组，避免临时对象
        const dists: number[] = [];
        for (let i = 0; i < total; i++) {
            const rp = list[i].node.worldPosition;
            const dx = rp.x - pos.x;
            const dz = rp.z - pos.z;
            dists[i] = dx * dx + dz * dz;
        }
        // 选择法找最近的 len 个索引
        const picked: number[] = [];
        const used: boolean[] = [];
        for (let n = 0; n < len; n++) {
            let minIdx = -1;
            let minDist = 0;
            for (let i = 0; i < total; i++) {
                if (used[i]) continue;
                if (minIdx < 0 || dists[i] < minDist) {
                    minIdx = i;
                    minDist = dists[i];
                }
            }
            picked[n] = minIdx;
            used[minIdx] = true;
        }
        // 从后往前删除，保证索引不错位
        for (let i = 0; i < len; i++) {
            const role = list[picked[i]];
            role.hp -= 3;
            this.roleDie(role);
            // role.node.active = false;
            // PoolManager.instance.setPool(PoolEnum.role + this.roleType, role);
        }
        picked.sort(function (a, b) { return b - a; });
        for (let i = 0; i < len; i++) {
            list.splice(picked[i], 1);
        }
        this.upPos();
    }


    private hit_2(role: Role, power: number) {
        role.hp -= power;
        if (role.hp <= 0) {
            const index = this.roleList.indexOf(role);
            if (index != -1) {
                this.roleList.splice(index, 1);
                this.roleDie(role);
                this.upPos();
            }
        } else {
            FlashRedManager.instance.flashRed(role.node, role.meshRedDataList);
        }
    }

    private TimeFlowsBackWard() {
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

    private getRoleByType(roleType: RoleEnum) {
        let role = PoolManager.instance.getPool<Role>(PoolEnum.role + roleType);
        if (!role) {
            role = this.createRoleByType(roleType);
        }
        role.hp = 2;
        role.node.active = true;
        return role;
    }

    private createRoleByType(roleType: RoleEnum) {
        const node = PrefabsManager.instance.GetPrefabsIns(PrefabsEnum.hero, roleType);
        return node.getComponent(Role);
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
