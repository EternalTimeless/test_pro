import { _decorator, Component, Node, RigidBody2D, Vec3 } from 'cc';
import { BattleTargetBase } from '../Base/BattleTargetBase';
import { vectorPower, vectorPower_v2 } from '../../../Tool/Index';
const { ccclass, property } = _decorator;

@ccclass('BattleTarget2D')
export abstract class BattleTarget2D extends BattleTargetBase {
    // private _move: MoveDrive
    public rig: RigidBody2D;

    protected start(): void {
        this.rig = this.node.getComponent(RigidBody2D);
    }

    // public get moveD() {
    //     if (!this._move) {
    //         this._move = this.node.getComponent(MoveDrive);
    //     }
    //     return this._move;
    // }


    public repelBattleTarget(target: Node, reoel: number = 0) {
        this.rig.applyLinearImpulseToCenter(vectorPower_v2(this.node, target, reoel), false);
    }

  
}


