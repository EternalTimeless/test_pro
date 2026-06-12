import { _decorator, Collider2D, Component, floatToHalf, math, Node, Vec3, WorldNode3DToLocalNodeUI } from 'cc';
import { TriggerBase2D } from './TriggerBase2D';
import { BattleTarget2D } from '../BattleTarger/BattleTarget2D';
import { BattleTargetBase } from '../Base/BattleTargetBase';
const { ccclass, property } = _decorator;
/**物理收集器    收集所有符合条件的 物体 */
@ccclass('CollectBattleTarger2D')
export class CollectBattleTarger2D extends TriggerBase2D {
    groupTarget_scope(angle: number, rot: math.Quat): BattleTargetBase[] {
        return null;
    }
    get attackR(): number {
        return this.attackCollide.radius;
    }



    private _battleTargetList: BattleTarget2D[] = [];


    get singleTarget(): BattleTarget2D {
        this._targetListClear();
        if (this._battleTargetList.length) {
            let pos = this.node.worldPosition;
            let target = this._battleTargetList[0];
            let dis = Vec3.distance(pos, target.node.worldPosition);
            for (let i = 1; i < this._battleTargetList.length; i++) {
                let tempTarget = this._battleTargetList[i]
                let d = Vec3.distance(pos, tempTarget.node.worldPosition);
                if (d < dis) {
                    dis = d;
                    target = tempTarget;
                }
            }
            return target;
        } else {
            return null;
        }
    }
    get groupTarget(): BattleTarget2D[] {
        this._targetListClear();
        if (this._battleTargetList.length) {

            return this._battleTargetList;
        } else {
            return null;
        }
    }
    protected _startCollide(other: Collider2D) {
        let battle = other.getComponent(BattleTarget2D);
        if (this._battleTargetList.indexOf(battle) == -1) {
            this._battleTargetList.push(battle);
        }
    }
    protected _EndCollide(other: Collider2D) {
        let battle = other.getComponent(BattleTarget2D);
        let index = this._battleTargetList.indexOf(battle);
        if (index != -1) {
            this._battleTargetList.splice(index, 1);
        }
    }
    /**清理一些已经死亡的  */
    private _targetListClear() {
        let pos = this.node.worldPosition;
        for (let i = this._battleTargetList.length - 1; i >= 0; i--) {
            let target = this._battleTargetList[i];

            if (target.isDie) {
                this._battleTargetList.splice(i, 1);
            } else {
                let dis = Vec3.distance(target.node.worldPosition, pos);
                if (dis > this.attackCollide.radius * 2) {
                    this._battleTargetList.splice(i, 1);
                }
            }
        }
    }

    get isCanAttack(): boolean {
        return this._battleTargetList.length > 0;
    }




}


