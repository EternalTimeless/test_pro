import { _decorator, CCBoolean, CCFloat, Component, error, Node, Vec3 } from 'cc';
import { CollectGetTarget } from '../CollectBattleTarger/CollectGetTarget';
import AttackState from '../Attack/AttackState';
import { UnityUpComponent } from '../../../Base/UnityUpComponent';
import { BattleTargetBase } from './BattleTargetBase';
const { ccclass, property } = _decorator;

/**攻击方式基类 */
@ccclass('AttackTargetBase')
export abstract class AttackTargetBase extends UnityUpComponent {

    protected collectGettarget: CollectGetTarget;
    public attackState: AttackState = new AttackState();

    @property(CCFloat)
    public attackSpeed = 2;
    private _attackTime = 0;

    @property(CCFloat)
    public power: number = 30;
    @property(CCFloat)
    public reoel: number = 30;

    @property(CCBoolean)
    public attackOff = true;

    protected target: BattleTargetBase;

    @property(CCBoolean)
    public isAttackAnim: boolean = true;

    start() {
        this.collectGettarget = this.node.parent.getComponent(CollectGetTarget);
        if (this.collectGettarget == null) {
            error(`collectGettarget Null`);
            debugger;
        }

        this.attackCooTime = this.attackTime;
    }

    public UpAttackSpeedTime() {
        this.attackCooTime = this.attackTime;
    }

    public get attackTime() {
        return 1 / this.attackSpeed;
    }

    public attack(...params: any[]) {
        this.attackEvent(this.power, this.reoel, ...params);
    }


    protected abstract attackEvent(power: number, reoel: number, ...params: any[]): void;

    protected _update(dt: number): void {
        this.attackCooTime -= dt;
    }

    public get isAttack() {
        this.target = this.collectGettarget.singleTarget;
        if (!this.target || this.target.isDie) {
            return false;
        }
        return this.attackOff && this.attackCooTime <= 0 && !this.attackState.attackIn && this.collectGettarget.isCanAttack;
    }

    public get attackPos() {
        return this.node.worldPosition;
    }

    /**获取当前  朝向和攻击目标  如果为0 说明没有攻击目标 */
    public get vector(): number {
        if (this.target) {
            let x = this.target.node.worldPosition.x - this.node.worldPosition.x;
            return x / Math.abs(x);
        } else {
            return 0;
        }
    }

    public get attackTarget() {
        if (this.attackOff) {

            return this.target;
        } else {
            return null;
        }
    }

    public set attackTarget(value: BattleTargetBase) {
        this.target = value;
    }

    public get isCanAttack() {
        return this.collectGettarget.isCanAttack;
    }


    private set attackCooTime(value: number) {
        if (this.isAttackAnim) {
            this._attackTime = -1;
        } else {
            this._attackTime = value;
        }
    }

    private get attackCooTime() {
        return this._attackTime;
    }

}


