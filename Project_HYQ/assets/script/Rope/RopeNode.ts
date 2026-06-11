import { _decorator, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 重力
 */
const GRAVITY = new Vec3(0, 0.5, 0);
const v3_temp_0: Vec3 = new Vec3();
const v3_temp_1: Vec3 = new Vec3();

@ccclass('RopeNode')
export class RopeNode {
    /**
      * 当前帧位置
      */
    pos: Vec3 = null;

    /**
     * 上一帧的位置
     */
    prePos: Vec3 = null;

    public fixedPoint: boolean = false;
    public useGravity: boolean = true;
    constructor(x: number, y: number, z: number) {
        this.pos = v3(x, y, z);
        this.prePos = v3(x, y, z);
    }

    onUpdate(dt: number) {
        if (this.fixedPoint) {
            return;
        }
        // 计算速度（这个步长已经是两帧之间的步长了）
        const v = Vec3.subtract(v3_temp_0, this.pos, this.prePos);
        // 保存上一帧的位置
        this.prePos.set(this.pos);

        if (this.useGravity) {
            // 叠加重力加速度
            v.add(Vec3.multiplyScalar(v3_temp_1, GRAVITY, dt));
        }

        // 计算下一帧位置
        this.pos.add(v);
    }

}


