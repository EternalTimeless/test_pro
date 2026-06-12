import { _decorator, Component, Node, Vec3 } from 'cc';
import { UnityUpComponent } from '../../Base/UnityUpComponent';
import PoolManager from '../../Base/PoolManager';
import { PropEnum, PoolEnum } from '../../Base/EnumList';
import { RotationVector } from '../../Base/MoveRot/RotationVector';
const { ccclass, property } = _decorator;

@ccclass('Prop')
export class Prop extends UnityUpComponent {

    private _rotatonDrive: RotationVector = null;

    private isRot: boolean = false;

    private get rotationDrive() {
        if (!this._rotatonDrive) {
            this._rotatonDrive = this.getComponent(RotationVector);
        }
        return this._rotatonDrive;
    }

    protected _update(dt: number): void {
        if (this.isRot) {
            this.rotationDrive.rotate(dt);
        }
    }

    public set rotVector(vector: Vec3) {
        if (!vector) {
            this.isRot = false;
        } else {
            this.rotationDrive.setVector(vector);
            this.isRot = true;
        }
    }


    @property({ type: PropEnum })
    public propID: PropEnum = PropEnum.gold;



    public remove() {
        PoolManager.instance.setPool(PoolEnum.Prop + this.propID, this);
        this.rotVector = null;
        this.node.active = false;
    }


}


