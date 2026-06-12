import { _decorator, ccenum, CCFloat, CCInteger, Collider2D, Component, IPhysics2DContact, Vec3 } from "cc";
import { BulletEnum, EffectEnum, PoolEnum } from "db://assets/Script/Base/EnumList";
import PoolManager from "db://assets/Script/Base/PoolManager";
import { MoveDrive, MoveModEnum } from "../../../../Base/MoveRot/MoveDrive";
import { BattleTarget3D } from "../../BattleTarger/BattleTarget3D";
import { BulletCollideBase2D } from "./BulletCollideBase2D";
const { ccclass, property } = _decorator;

/**
 * 弹药战斗系统 使用 物理
 */
@ccclass('BulletBattle2D')
export default class BulletBattle2D extends BulletCollideBase2D {
    @property({ type: BulletEnum })
    public bulletEnum: BulletEnum = BulletEnum.arrow;
    @property({ type: EffectEnum })
    public bulletHitEnum: EffectEnum = EffectEnum.hit;

    @property(CCFloat)
    public moveSpeed: number = 200;

    /**-1 关闭 弹药碰撞到第一个有效目标后 经过该时间后结束 优先：1   */
    @property(CCFloat)
    public triggerDieTime: number = -1;

    private _triggerDieTime: number = this.triggerDieTime;

    private _isTrigger: boolean = false;
    /**-1 关闭 弹药发出后结束的时间 优先：3    防止 一些永远无法攻击到敌人的弹药一直在场景中  无论该弹药是否攻击过*/
    @property(CCFloat)
    public overTime: number = 5;

    private _overTime: number = this.overTime;

    /**弹药攻击attackCount次 后结束 (只能大于0) 优先：2  到达次数后回收*/
    @property(CCInteger)
    public attackCount: number = 1;

    private _attackCount = this.attackCount;

    private _damage: number = 0;

    private _repelPower: number = 0;

    @property(MoveDrive)
    public moveD: MoveDrive;

    protected start(): void {
        this.moveD = this.node.getComponent(MoveDrive);
        if (!this.moveD) {
            this.moveD = this.node.addComponent(MoveDrive);
        }
        this.moveD.moveMod = MoveModEnum.vectorMove;
    }

    protected update(dt: number): void {
        if (this.triggerDieTime != -1 && this._isTrigger) {
            if (this._triggerDieTime <= 0) {
                this.over();
            } else {
                this._triggerDieTime -= dt;
            }
        }
        else if (this._attackCount <= 0) {
            this.over();
        }
        else if (this.overTime != -1) {
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
    }

    /**
     * 
     * @param angle 角度
     * @param damage 伤害
     * @param repelPower 击退力度
     */
    public setBulletInfo(angle: number, damage: number, repelPower: number) {
        this.node.angle = angle;
        this._damage = damage;
        this._repelPower = repelPower;
        this._attackCount = this.attackCount;
        this._overTime = this.overTime;
        this._triggerDieTime = this.triggerDieTime;
        this._isTrigger = false;
        let r = angle / 180 * Math.PI;
        let vectorX = Math.cos(r);
        let vectorY = Math.sin(r);
        this.node.active = true;
        this.moveD.vector.set(vectorX, vectorY);
    }


    public temp: Vec3 = new Vec3();


    protected _startCollide(other: Collider2D) {
        this._isTrigger = true;
        let battle = other.node.getComponent(BattleTarget3D);
        if (battle.isDie) {
            return;
        }
        battle.Hit(this._damage)
        battle.repelBattleTarget(this.node, this._repelPower);
        this._attackCount--;
        this.temp.set(other.node.worldPosition);
        this.temp.y + 50;
        //在此添加攻击特效
        // EffectManager.instance.ShowEffect(this.temp, PoolEnum.bullet_hit, this.bulletHitEnum);

    }
    protected _EndCollide(other: Collider2D) {

    }

}