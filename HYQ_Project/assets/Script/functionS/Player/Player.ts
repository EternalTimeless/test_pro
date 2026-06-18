import { _decorator, CCFloat, CCInteger, Component, Node, Quat, tween, Vec3 } from 'cc';
import { MoveDrive } from '../../Base/MoveRot/MoveDrive';
import { FbxManager } from '../SkAnim/FbxManager';
import { Role } from './Role';
import { getCirclePosition } from '../../Tool/Index';
import { ArmsTypeEnum, BulletEnum, EventType, PoolEnum, PrefabsEnum, PropEnum, RoleEnum, SoundEnum } from '../../Base/EnumList';
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

    public maxShootingRoleCount: number = 30;

    private shootRoleStartIndex: number = 0;

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
            for (let i = 0; i < shootCount; i++) {
                const role = this.roleList[(this.shootRoleStartIndex + i) % this.roleList.length];
                if (!role.attackIN) {
                    role.attackEvent(0, role.visualBulletCount, 1, this.node.worldPosition.x);
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
                const newRoleType = RoleEnum.dazhuang;
                this.roleType = newRoleType;
                const count = this.roleList.length;
                TweenTool.scaleShake(this.node);
                this.roleR = 1;
                Role.soundType = SoundEnum.Sound_FireGun;
                for (let i = 0; i < count; i++) {
                    const role = this.roleList[i];
                    const newRole = this.getRoleByType(newRoleType);
                    this.roleList[i] = newRole;
                    this.node.addChild(newRole.node);
                    newRole.node.setPosition(role.node.position);
                    role.node.active = false;
                }
                this.upPos();
                break;
            case ArmsTypeEnum.jtl2: {
                Role.power = 0.3;
                Role.bulletType = BulletEnum.arrow_4;
                this.attackSpeed = 20;
                const newRoleType = RoleEnum.dazhuangPlus;
                this.roleType = newRoleType;
                const count = this.roleList.length;
                TweenTool.scaleShake(this.node);
                this.roleR = 1;
                Role.soundType = SoundEnum.Sound_FireGun;
                for (let i = 0; i < count; i++) {
                    const role = this.roleList[i];
                    const newRole = this.getRoleByType(newRoleType);
                    this.roleList[i] = newRole;
                    this.node.addChild(newRole.node);
                    newRole.node.setPosition(role.node.position);
                    role.node.active = false;
                }
                this.upPos();
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
            const node = PrefabsManager.instance.GetPrefabsIns(PrefabsEnum.hero, roleType);
            role = node.getComponent(Role);
        }
        role.hp = 2;
        role.node.active = true;
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
