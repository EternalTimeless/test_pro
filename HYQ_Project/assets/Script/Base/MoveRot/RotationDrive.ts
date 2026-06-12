import { _decorator, CCFloat, Component, log, math, Node, NodeSpace, Quat, v3, Vec3 } from 'cc';
import { isFacingTargetHorizontal_vec } from '../../Tool/Index';
const { ccclass, property } = _decorator;


@ccclass('RotationDrive')
export class RotationDrive extends Component {

    @property(CCFloat)
    public angle: number = 30;
    @property(CCFloat)
    public speed: number = 1;
    private tempQ: Quat = new Quat();

    private tempQ2: Quat = new Quat();

    private _vector: Vec3 = new Vec3();
    private _vector2: Vec3 = new Vec3();


    private _fowerVe3: Vec3 = new Vec3();

    public set vector(vector: Vec3) {
        this._vector.set(vector);
        Quat.fromViewUp(this.tempQ, vector, Vec3.UP);
    }

    public rotatLerpLookVector(dt: number) {
        const currentQ = this.node.worldRotation;
        const targetQ = this.tempQ;
        // 直接使用四元数球面插值，无需转换为轴角
        const t = Math.min(this.speed * dt, 1.0);
        // 使用更高效的插值方法
        Quat.slerp(this.tempQ2, currentQ, targetQ, t);
        this.node.setWorldRotation(this.tempQ2);
    }
    public isFacingTargetHorizontal_vec(isHeight: boolean = false) {
        let vector: Vec3 = this._vector;
        Vec3.transformQuat(this._fowerVe3, Vec3.FORWARD, this.node.worldRotation);
        this._fowerVe3.normalize();
        return isFacingTargetHorizontal_vec(vector, this._fowerVe3, this.angle, isHeight); //返回是否朝向目标
    }
}


