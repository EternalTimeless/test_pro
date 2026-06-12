import { _decorator, Collider2D, Component, floatToHalf, ITriggerEvent, math, Node, Vec3, WorldNode3DToLocalNodeUI } from 'cc';
import { CollectGetTarget } from '../CollectBattleTarger/CollectGetTarget';
import { BattleTarget3D } from '../BattleTarger/BattleTarget3D';
import { TriggerBase3D } from './TriggerBase3D';
import { vectorPower2, isFacingTargetHorizontal_vec } from '../../../Tool/Index';
import { BattleTargetBase } from '../Base/BattleTargetBase';
const { ccclass, property } = _decorator;
/**物理收集器    收集所有符合条件的 物体 */
@ccclass('CollectBattleTarger3D')
export class CollectBattleTarger3D extends TriggerBase3D {
    get attackR(): number {
        return this.attackCollide.radius;
    }



    private _battleTargetList: BattleTarget3D[] = [];


    get singleTarget(): BattleTarget3D {
        return this._targetListClear();
    }
    get groupTarget(): BattleTarget3D[] {
        this._targetListClear();
        if (this._battleTargetList.length) {

            return this._battleTargetList;
        } else {
            return null;
        }
    }
    protected _startCollide(event: ITriggerEvent) {
        let battle = event.otherCollider.getComponent(BattleTarget3D);
        if (battle) {

            if (this._battleTargetList.indexOf(battle) == -1) {
                this._battleTargetList.push(battle);
            }
        }
    }
    protected _EndCollide(event: ITriggerEvent) {
        let battle = event.otherCollider.getComponent(BattleTarget3D);
        if (battle) {

            let index = this._battleTargetList.indexOf(battle);
            if (index != -1) {
                this._battleTargetList.splice(index, 1);
            }
        }
    }
    /**清理一些已经死亡的  */
    private _targetListClear() {
        let disd = Number.MAX_VALUE;
        let targetd: BattleTarget3D = null;
        let pos = this.node.worldPosition;
        for (let i = this._battleTargetList.length - 1; i >= 0; i--) {
            let target = this._battleTargetList[i];

            if (target.isDie) {
                this._battleTargetList.splice(i, 1);
            } else {
                let dis = Vec3.distance(target.node.worldPosition, pos);
                if (dis > this.attackCollide.radius * 3) {
                    this._battleTargetList.splice(i, 1);
                } else if (dis < disd) {
                    disd = dis;
                    targetd = target;
                }


            }
        }
        return targetd;
    }

    get isCanAttack(): boolean {
        return this._battleTargetList.length > 0;
    }


    private _fowerVe3: Vec3 = new Vec3();
    private _vector: Vec3 = new Vec3();
    private _tempTargetList: BattleTargetBase[] = [];
    groupTarget_scope(angle: number, rot: math.Quat): BattleTargetBase[] {
        const groupList = this.groupTarget;
        if (this.groupTarget) {
            this._tempTargetList.length = 0;
            Vec3.transformQuat(this._fowerVe3, Vec3.FORWARD, rot);
            const pos = this.node.getWorldPosition(this._vector);
            for (let i = 0; i < groupList.length; i++) {
                const target = groupList[i];
                const v = vectorPower2(pos, target.node.worldPosition);
                if (isFacingTargetHorizontal_vec(v, this._fowerVe3, angle, false)) {
                    this._tempTargetList.push(target);
                }
            }
            return this._tempTargetList;
        } else {
            return null;
        }
    }

}


