import { _decorator, CacheMode, CCFloat, Component, Label, labelAssembler, Node, Quat, tween, Vec3 } from 'cc';
import { BattleTarget3D } from '../Battle/BattleTarger/BattleTarget3D';
import BulletMonsterCollisionManager from '../Battle/BulletMonsterCollisionManager';
import { MoveDrive, MoveModEnum } from '../../Base/MoveRot/MoveDrive';
import { EventType, MonsterType, PoolEnum, SoundEnum } from '../../Base/EnumList';
import PoolManager from '../../Base/PoolManager';
import EventManager from '../../Base/EventManager';
import { FbxManager } from '../SkAnim/FbxManager';
import { CameraMove } from '../../Base/CameraMove';
import { MeshFlashData } from '../Battle/Base/BattleTargetBase';
import { FlashRedManager } from '../Battle/Base/FlashRedManager';
import AudioManager from '../../Base/AudioManager';
import { Player } from '../Player/Player';
import { Role } from '../Player/Role';
const { ccclass, property } = _decorator;

enum MonsterAnimEnum {
    run,
    die,
    attack,
    die2,
}

@ccclass('MonsterBattleTaerget')
export class MonsterBattleTaerget extends BattleTarget3D {

    @property({ type: [MeshFlashData], tooltip: '闪红MeshRenderer配置列表，可在属性检查器中编辑' })
    public meshFlashDataList_Die: MeshFlashData[] = [];


    @property(FbxManager)
    public fbx: FbxManager;

    @property({ type: MonsterType })
    public monsterType: MonsterType = MonsterType.ZombieBaby_0;

    @property({
        type: Label, visible(this: MonsterBattleTaerget) {
            return this.monsterType == MonsterType.ZombieBrother;
        }
    })
    public hpLab: Label;

    private attackIn: boolean = false;

    @property(MoveDrive)
    public move: MoveDrive;

    public attackTarget: Node;

    public initX: number = 0;

    @property(CCFloat)
    public attackR: number = 4;

    private _hl: boolean = false;
    private runAnimSpeed: number = 1;
    private runAnimStartFrame: number = 0;
    private attackTimer: number = 0;
    private readonly attackDuration: number = 1.5;
    private readonly bossDesiredAttackPos: Vec3 = new Vec3();
    private readonly bossFaceVector: Vec3 = new Vec3();
    private readonly smallMonsterDesiredAttackPos: Vec3 = new Vec3();

    @property({
        type: CCFloat,
        displayName: 'Boss横向锁定范围',
        visible(this: MonsterBattleTaerget) {
            return this.monsterType == MonsterType.ZombieBrother;
        }
    })
    public bossAttackLockOffsetX: number = 0.9;

    @property({
        type: CCFloat,
        displayName: 'Boss攻击站位Z偏移',
        visible(this: MonsterBattleTaerget) {
            return this.monsterType == MonsterType.ZombieBrother;
        }
    })
    public bossAttackOffsetZ: number = 1.4;

    @property({
        type: CCFloat,
        displayName: 'Boss最小Z间距',
        visible(this: MonsterBattleTaerget) {
            return this.monsterType == MonsterType.ZombieBrother;
        }
    })
    public bossMinGapZ: number = 1.4;

    @property({
        type: CCFloat,
        displayName: 'Boss站位Z容差',
        visible(this: MonsterBattleTaerget) {
            return this.monsterType == MonsterType.ZombieBrother;
        }
    })
    public bossAttackLockOffsetZ: number = 0.28;

    @property({
        type: CCFloat,
        displayName: '小怪攻击站位Z偏移',
        visible(this: MonsterBattleTaerget) {
            return this.monsterType != MonsterType.ZombieBrother;
        }
    })
    public smallMonsterAttackOffsetZ: number = 1.2;

    @property({
        type: CCFloat,
        displayName: '小怪横向锁定范围',
        visible(this: MonsterBattleTaerget) {
            return this.monsterType != MonsterType.ZombieBrother;
        }
    })
    public smallMonsterAttackLockOffsetX: number = 0.55;

    @property({
        type: CCFloat,
        displayName: '小怪站位Z容差',
        visible(this: MonsterBattleTaerget) {
            return this.monsterType != MonsterType.ZombieBrother;
        }
    })
    public smallMonsterAttackLockOffsetZ: number = 0.22;

    /** 重写init，在初始化后注册到碰撞管理器 */
    public init(difficulty: number, fixedHp: number = 0) {

        super.init(difficulty);
        if (fixedHp > 0) {
            this.initFixedHp(fixedHp);
        }
        this.attackIn = false;
        if (this.monsterType == MonsterType.ZombieBrother) {
            this.fixBossHpLabel();
            this.hpLab.string = Math.round(this.curHp).toString();
        }
        this.move.autoMove = true;
        this._hl = false;
        this._hlIn = false;
        this.attackTimer = 0;
        this.runAnimSpeed = 0.9 + Math.random() * 0.25;
        this.runAnimStartFrame = Math.random();
        BulletMonsterCollisionManager.instance.registerTarget(this);

    }
    protected start(): void {
        this.fbx.setAttackAnimCall(this.attackEvent, this);
    }


    protected damage(power: number): void {
        this.flashRed(0.15, null, "monster_Hit" + this.monsterType);
        AudioManager.inst.playOneShot(SoundEnum.Sound_Monster_Hit, 0.25, 0.08);
        if (this.monsterType == MonsterType.ZombieBrother) {
            this.fixBossHpLabel();
            this.hpLab.string = Math.round(this.curHp).toString();
        }
    }


    protected die(): void {
        this.move.autoMove = false;
        BulletMonsterCollisionManager.instance.unregisterTarget(this);
        this.stopFlashRed();

        let endtime = 0;
        if (!this.isDieD) {
            const t = this.fbx.setAnimation(MonsterAnimEnum.die2, true);
            const scale = 0.3 + Math.random() * 0.5;
            t.speed = scale;
            endtime = t.duration * (1 / scale);

        } else {
            const t = this.fbx.setAnimation(MonsterAnimEnum.die, true);

            endtime = t.duration;
            const time = endtime * 0.8;
            const z = this.node.z + 6;
            tween(this.node).to(time * 0.5, { z: z }).start();

        }


        this.flashDie(endtime);

        // this.scheduleOnce(() => {
        // }, 0.15 + Math.random() * 0.2);

        if (this.monsterType == MonsterType.ZombieBrother) {
            AudioManager.inst.playOneShot(SoundEnum.Sound_boss_die, 0.7, 0.08);
        } else {
            AudioManager.inst.playOneShot(SoundEnum.Sound_Monster_Die, 0.4, 0.08);
        }

        if (this.monsterType == MonsterType.ZombieBrother)
            this.hpLab.string = "";

        if (this.isDieD) {
            this.scheduleOnce(() => {
                this.node.active = false;
                PoolManager.instance.setPool(PoolEnum.monster + this.monsterType, this);
            }, endtime);
        }
    }

    public flashDie(endtime: number) {
        if (this.isDieD) {
            FlashRedManager.instance.flashRed(this.node, this.meshFlashDataList_Die, endtime * 1.1, null, "monster_Die" + this.monsterType);
        } else {
            FlashRedManager.instance.flashRed(this.node, this.meshFlashDataList_Die, endtime * 10, null, "monster_Die" + this.monsterType);
        }
    }

    // public dieTimeScale: number = 1;
    public isDieD: boolean = true;

    /** 跳过死亡闪红效果（批量击杀时设为true以降低DC尖峰） */
    public skipDieFlash: boolean = false;

    protected _update(dt: number): void {

        if (this.isDie) {
            return;
        }
        if (this.monsterType == MonsterType.ZombieBrother) {
            this.fixBossHpLabel();
        }

        if (this.attackTimer > 0) {
            this.attackTimer -= dt;
            if (this.attackTimer <= 0) {
                this.attackTimer = 0;
                this.attackIn = false;
            }
        }

        if (this.monsterType == MonsterType.ZombieBrother) {
            if (!this.ensureAttackTargetValid()) {
                this.move.autoMove = true;
            }
            this.updateBossMoveTarget();
            this.updateBossFacing(dt);
        } else {
            this.clampSmallMonsterAttackZ();
        }

        if (this.attackTarget) {
            const canAttack = this.isAttackTargetInRange();
            if (canAttack) {
                this.move.autoMove = false;
                if (!this.attackIn && !Player.instance.isDie) {
                    this.playAttackAnimation();
                }
            } else {
                this.attackIn = false;
                this.attackTimer = 0;
                this.move.target = this.attackTarget;
                this.move.autoMove = true;
            }
        }

        if (!this.attackIn) {
            if (this.move.isMove) {
                if (!this._hl && !this._hlIn) {
                    this.scheduleOnce(() => {
                        this.playRunAnimation();
                        this._hl = true;
                    }, 0.45 * Math.random())
                    this._hlIn = true;
                    // t.delay = Math.random() * 0.5;
                } else {
                    if (this._hl) {
                        if (!this.fbx.isCurAnimation(MonsterAnimEnum.run)) {
                            this.playRunAnimation();
                        }
                    }
                }
            }
        }
    }

    private playAttackAnimation(): void {
        const anim = this.fbx.setAnimation(MonsterAnimEnum.attack, false);
        if (!anim) {
            return;
        }
        const animScale = anim.duration / this.attackDuration;
        anim.speed = animScale;
        this.attackTimer = this.attackDuration;
        this.attackIn = true;
    }

    private ensureAttackTargetValid(): boolean {
        if (!this.attackTarget?.activeInHierarchy) {
            return this.refreshAttackTarget();
        }

        const role = this.attackTarget.getComponent(Role);
        if (!role) {
            return true;
        }

        const player = Player.instance;
        if (!player || player.isDie || role.hp <= 0 || player.roleList.indexOf(role) === -1) {
            return this.refreshAttackTarget();
        }

        return true;
    }

    private refreshAttackTarget(): boolean {
        const player = Player.instance;
        if (!player || player.isDie || player.roleList.length <= 0) {
            this.clearAttackTarget();
            return false;
        }

        const nextRole = player.attackTarget;
        if (!nextRole?.node?.activeInHierarchy) {
            this.clearAttackTarget();
            return false;
        }

        this.attackTarget = nextRole.node;
        this.move.target = this.attackTarget;
        return true;
    }

    private clearAttackTarget(): void {
        this.attackTarget = null;
        this.move.target = null;
        this.attackIn = false;
        this.attackTimer = 0;
    }

    private isAttackTargetInRange(): boolean {
        if (!this.attackTarget?.activeInHierarchy) {
            return false;
        }

        if (this.monsterType === MonsterType.ZombieBrother) {
            return this.isBossInAttackPosition();
        }

        return this.isSmallMonsterInAttackPosition();
    }

    private getAttackRole(): Role | null {
        const role = this.attackTarget?.getComponent(Role);
        if (!role) {
            return null;
        }

        const player = Player.instance;
        if (!player || player.isDie || role.hp <= 0 || player.roleList.indexOf(role) === -1) {
            return null;
        }

        return role;
    }

    private updateBossFacing(dt: number): void {
        const player = Player.instance;
        if (!player?.node || !this.move?.isRot || !this.move.rotDrive) {
            return;
        }

        const targetPos = player.node.worldPosition;
        const selfPos = this.node.worldPosition;
        const dx = targetPos.x - selfPos.x;
        const dz = targetPos.z - selfPos.z;
        if (dx === 0 && dz === 0) {
            return;
        }

        this.bossFaceVector.set(dx, 0, dz);
        this.move.rotDrive.vector = this.bossFaceVector;
        this.move.rotDrive.rotatLerpLookVector(dt);
    }

    private updateBossMoveTarget(): void {
        if (!this.attackTarget || !Player.instance?.node || !this.move) {
            return;
        }

        this.getBossDesiredAttackPosition(this.bossDesiredAttackPos);
        this.move.moveMod = MoveModEnum.PosMove;
        this.move.pos = this.bossDesiredAttackPos;
    }

    private getBossDesiredAttackPosition(out: Vec3): Vec3 {
        const playerPos = Player.instance.node.worldPosition;
        const desiredGapZ = Math.max(Math.abs(this.bossAttackOffsetZ), Math.abs(this.bossMinGapZ));
        out.set(playerPos.x, this.node.worldPosition.y, playerPos.z + desiredGapZ);
        return out;
    }

    private isBossInAttackPosition(): boolean {
        const player = Player.instance;
        if (!player?.node || player.isDie) {
            return false;
        }

        const playerPos = player.node.worldPosition;
        const dis = Vec3.squaredDistance(playerPos, this.node.worldPosition);
        if (dis > this.attackR) {
            return false;
        }

        this.getBossDesiredAttackPosition(this.bossDesiredAttackPos);
        const selfPos = this.node.worldPosition;
        return Math.abs(selfPos.x - this.bossDesiredAttackPos.x) <= this.bossAttackLockOffsetX
            && Math.abs(selfPos.z - this.bossDesiredAttackPos.z) <= this.bossAttackLockOffsetZ;
    }

    private clampSmallMonsterAttackZ(): void {
        if (!this.attackTarget) {
            return;
        }

        this.getSmallMonsterDesiredAttackPosition(this.smallMonsterDesiredAttackPos);
        const desiredZ = this.smallMonsterDesiredAttackPos.z;
        if (this.node.worldPosition.z < desiredZ) {
            this.node.setWorldPosition(this.node.worldPosition.x, this.node.worldPosition.y, desiredZ);
        }
    }

    private getSmallMonsterDesiredAttackPosition(out: Vec3): Vec3 {
        const targetPos = this.attackTarget.worldPosition;
        out.set(targetPos.x, this.node.worldPosition.y, targetPos.z + Math.abs(this.smallMonsterAttackOffsetZ));
        return out;
    }

    private isSmallMonsterInAttackPosition(): boolean {
        if (!this.attackTarget?.activeInHierarchy) {
            return false;
        }

        const targetPos = this.attackTarget.worldPosition;
        const dis = Vec3.squaredDistance(targetPos, this.node.worldPosition);
        if (dis > this.attackR) {
            return false;
        }

        this.getSmallMonsterDesiredAttackPosition(this.smallMonsterDesiredAttackPos);
        const selfPos = this.node.worldPosition;
        return Math.abs(selfPos.z - this.smallMonsterDesiredAttackPos.z) <= this.smallMonsterAttackLockOffsetZ;
    }

    private _hlIn: boolean = false;

    public randomizeRunAnimation(): void {
        this.runAnimSpeed = 0.9 + Math.random() * 0.25;
        this.runAnimStartFrame = Math.random();
    }

    private fixBossHpLabel(): void {
        if (!this.hpLab?.node) {
            return;
        }
        this.hpLab.node.setWorldRotation(Quat.IDENTITY);
        const scale = this.hpLab.node.scale;
        this.hpLab.node.setScale(-Math.abs(scale.x), Math.abs(scale.y), Math.abs(scale.z));
    }

    private playRunAnimation(): void {
        const state = this.fbx.setAnimation(MonsterAnimEnum.run, true, this.runAnimStartFrame);
        if (state) {
            state.speed = this.runAnimSpeed;
        }
    }

    private attackEvent() {
        if (this.monsterType == MonsterType.ZombieBrother) {
            if (!this.isAttackTargetInRange()) {
                return;
            }
            CameraMove.instance.Shake2(1);
            AudioManager.inst.playOneShot(SoundEnum.Sound_boss_attack, 0.6);
            EventManager.instance.emit(EventType.PLAYER_HIT, this.node.worldPosition, 10);
        } else {
            const role = this.getAttackRole();
            if (role) {
                EventManager.instance.emit(EventType.PLAYER_HIT_2, role, 1);
            }
        }
    }
}
