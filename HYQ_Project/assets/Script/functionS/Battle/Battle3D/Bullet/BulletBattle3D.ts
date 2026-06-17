import { _decorator, ccenum, CCFloat, CCInteger, Component, math, Vec3 } from "cc";
import { BulletEnum, EffectEnum, PoolEnum, SceneType } from "db://assets/Script/Base/EnumList";
import PoolManager from "db://assets/Script/Base/PoolManager";
import { EffectManager } from "../../../Effect/EffectManager";
import { MoveDrive, MoveModEnum } from "../../../../Base/MoveRot/MoveDrive";
import { BattleTarget3D } from "../../BattleTarger/BattleTarget3D";
import { COLLIDE_TYPE } from "../../CollectBattleTarger/ColliderTag";
import BulletMonsterCollisionManager from "../../BulletMonsterCollisionManager";
const { ccclass, property } = _decorator;

/**
 * 弹药战斗系统 - 自定义碰撞检测（移除物理引擎依赖）
 */
@ccclass('BulletBattle3D')
export default class BulletBattle3D extends Component {

    @property({ type: BulletEnum, tooltip: '弹药类型' })
    public bulletEnum: BulletEnum = BulletEnum.arrow;

    @property({ type: CCFloat, tooltip: 'x方向碰撞半宽（替代物理BoxCollider尺寸）' })
    public collisionHalfX: number = 0.1;

    @property({ type: CCFloat, tooltip: 'z方向碰撞半深（替代物理BoxCollider尺寸）' })
    public collisionHalfZ: number = 0.29;

    @property({ type: COLLIDE_TYPE, tooltip: '攻击目标类型（匹配ColliderTag.tag）' })
    public attackTargetTag: COLLIDE_TYPE[] = [];

    /**-1 关闭 弹药碰撞到第一个有效目标后 经过该时间后结束 优先：1   */
    @property({ type: CCFloat, tooltip: '命中后销毁延时（-1关闭，优先级1）' })
    public triggerDieTime: number = -1;

    private _triggerDieTime: number = this.triggerDieTime;

    private _isTrigger: boolean = false;
    /**-1 关闭 弹药发出后结束的时间 优先：3    防止 一些永远无法攻击到敌人的弹药一直在场景中  无论该弹药是否攻击过*/
    @property({ type: CCFloat, tooltip: '子弹超时时间（-1关闭，优先级3）' })
    public overTime: number = 5;

    private _overTime: number = this.overTime;

    /**弹药攻击attackCount次 后结束 (只能大于0) 优先：2  到达次数后回收*/
    @property({ type: CCInteger, tooltip: '穿透次数（攻击N次后回收，优先级2）' })
    public attackCount: number = 1;

    private _attackCount = this.attackCount;

    private _damage: number = 0;

    private _repelPower: number = 0;

    @property({ type: MoveDrive, tooltip: '移动驱动组件' })
    public moveD: MoveDrive;

    /** 是否已注册到碰撞管理器 */
    private _registered: boolean = false;

    protected start(): void {
        this.moveD = this.node.getComponent(MoveDrive);
        if (!this.moveD) {
            this.moveD = this.node.addComponent(MoveDrive);
        }
    }

    protected update(dt: number): void {
        if (this.triggerDieTime != -1 && this._isTrigger) {
            if (this._triggerDieTime <= 0) {
                this.over();
            } else {
                this._triggerDieTime -= dt;
            }
        } else if (this.overTime != -1) {
            if (this._overTime <= 0) {
                this.over();
            } else {
                this._overTime -= dt;
            }
        }
        this.moveD.MoveEvent(dt);
    }

    private over() {
        this.node.active = false;
        PoolManager.instance.setPool(PoolEnum.bullet + this.bulletEnum, this);
        if (this._registered) {
            BulletMonsterCollisionManager.instance.unregisterBullet(this);
            this._registered = false;
        }
    }

    /**
     * 
     * @param rot 角度
     * @param damage 伤害
     * @param repelPower 击退力度
     */
    public setBulletInfo(rot: math.Quat, damage: number, repelPower: number) {
        this.node.setWorldRotation(rot);
        this.moveD.moveMod = MoveModEnum.forwardMove;
        this._damage = damage;
        this._repelPower = repelPower;
        this._attackCount = this.attackCount;
        this._overTime = this.overTime;
        this._triggerDieTime = this.triggerDieTime;
        this._isTrigger = false;
        this.node.active = true;

        // 注册到碰撞管理器
        if (!this._registered) {
            BulletMonsterCollisionManager.instance.registerBullet(this);
            this._registered = true;
        }
    }


    public temp: Vec3 = new Vec3();

    private static _effectWindowStart: number = 0;
    private static _effectCountInWindow: number = 0;
    private static readonly _hitEffectWindow: number = 0.05;
    private static readonly _maxHitEffectPerWindow: number = 3;

    /**
     * 碰撞命中处理（迁移自原 _startCollide）
     * 由 BulletMonsterCollisionManager 在检测到碰撞时调用
     */
    public onHitTarget(battle: BattleTarget3D) {
        this._isTrigger = true;
        if (battle.isDie) {
            return;
        }
        if (this._attackCount <= 0) {
            this.over();
            return;
        }
        battle.Hit(this._damage);
        battle.repelBattleTarget(this.node, this._repelPower);
        this._attackCount--;
        const now = Date.now() * 0.001;
        if (now - BulletBattle3D._effectWindowStart >= BulletBattle3D._hitEffectWindow) {
            BulletBattle3D._effectWindowStart = now;
            BulletBattle3D._effectCountInWindow = 0;
        }
        if (BulletBattle3D._effectCountInWindow < BulletBattle3D._maxHitEffectPerWindow) {
            BulletBattle3D._effectCountInWindow++;
            this.temp.set(this.node.worldPosition);
            this.temp.z -= 2;
            this.temp.y += 0.5;
            EffectManager.instance.addShowEffect(this.temp, battle.hitEffect, 2);
        }
    }
}
