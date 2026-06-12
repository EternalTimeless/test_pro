import { _decorator, CacheMode, CCFloat, Component, Label, labelAssembler, Node, tween, Vec3 } from 'cc';
import { BattleTarget3D } from '../Battle/BattleTarger/BattleTarget3D';
import BulletMonsterCollisionManager from '../Battle/BulletMonsterCollisionManager';
import { MoveDrive } from '../../Base/MoveRot/MoveDrive';
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
    /** 重写init，在初始化后注册到碰撞管理器 */
    public init(difficulty: number) {

        super.init(difficulty);
        this.attackIn = false;
        if (this.monsterType == MonsterType.ZombieBrother)

            this.hpLab.string = Math.round(this.curHp).toString();
        this.move.autoMove = true;
        this._hl = false;
        this._hlIn = false;
        BulletMonsterCollisionManager.instance.registerTarget(this);

    }
    protected start(): void {
        this.fbx.setAttackAnimCall(this.attackEvent, this);
    }


    protected damage(power: number): void {
        this.flashRed(0.15, null, "monster_Hit" + this.monsterType);
        AudioManager.inst.playOneShot(SoundEnum.Sound_Monster_Hit, 0.25, 0.08);
        if (this.monsterType == MonsterType.ZombieBrother)
            this.hpLab.string = Math.round(this.curHp).toString();
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

        // if (this.monsterType == MonsterType.ZombieBrother) {
        if (this.attackTarget) {
            const dis = Vec3.squaredDistance(this.attackTarget.worldPosition, this.node.worldPosition);
            if (dis < this.attackR || this.attackIn) {
                this.move.autoMove = false;
                if (!this.attackIn && !Player.instance.isDie) {
                    const anim = this.fbx.setAnimation(MonsterAnimEnum.attack, false);
                    const attackTime = 1.5;
                    const endTime = anim.duration;
                    const animScale = endTime / attackTime;
                    anim.speed = animScale;
                    this.scheduleOnce(() => {
                        this.attackIn = false;
                    }, attackTime);
                    this.attackIn = true;
                }

            } else {
                this.move.autoMove = true;
            }
        }
        // }

        if (!this.attackIn) {
            if (this.move.isMove) {
                if (!this._hl && !this._hlIn) {
                    this.scheduleOnce(() => {
                        const t = this.fbx.setAnimation(MonsterAnimEnum.run, true);
                        this._hl = true;
                    }, 0.2 * Math.random())
                    this._hlIn = true;
                    // t.delay = Math.random() * 0.5;
                } else {
                    if (this._hl) {

                        const t = this.fbx.setAnimation(MonsterAnimEnum.run, true);
                    }
                }
            }
        }
    }

    private _hlIn: boolean = false;

    private attackEvent() {
        if (this.monsterType == MonsterType.ZombieBrother) {
            CameraMove.instance.Shake2(1);
            AudioManager.inst.playOneShot(SoundEnum.Sound_boss_attack, 0.6);
            EventManager.instance.emit(EventType.PLAYER_HIT, this.node.worldPosition, 4);
        } else {
            const role = this.attackTarget?.getComponent(Role);
            if (role) {
                EventManager.instance.emit(EventType.PLAYER_HIT_2, role, 1);
            }
        }
    }
}