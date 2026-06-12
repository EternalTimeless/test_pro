// interface Point {
//     x: number;
//     y: number;

import { Node, sp, UITransform } from "cc";
import PoolManager from "../../Base/PoolManager";
import JumpSequenceBase from "./JumpSequenceBase";
import LayerManager from "../../Base/LayerManager";
import { SceneType, PoolEnum } from "../../Base/EnumList";

// }
export default class BezierCurve extends JumpSequenceBase {
    private flyNode: Node;
    private uiTran: UITransform;
    private workBuffer: Vector;

    private points: Vector[];
    private speed: number = 1;

    /** 预分配的临时向量池，避免每帧new Float32Array */
    private _tempVecs: Float32Array[] = [];

    public init(flyNode: Node, points: Vector[], speed: number = 1) {
        this.flyNode = flyNode;
        this.uiTran = flyNode.getComponent(UITransform);
        this.points = points;
        this.speed = speed;
        this._time = 0;

        // 预分配临时数组，避免每帧计算时new Float32Array
        const dim = points.length > 0 ? points[0].length : 2;
        while (this._tempVecs.length < points.length) {
            this._tempVecs.push(new Float32Array(dim));
        }
    }

    protected move(dt: number): boolean {
        this._time += dt * this.speed;
        if (this._time >= 1) {
            this._time = 1;
            return true;
        }
        // 先把points数据拷贝到预分配数组（零分配）
        for (let i = 0; i < this.points.length; i++) {
            this._tempVecs[i].set(this.points[i]);
        }
        const point = BezierCurve.bezierOptimized(this.points, this._time, this.workBuffer, this._tempVecs);
        this.flyNode.setWorldPosition(point[0], point[1], point[2] ? point[2] : 0);
        this.endPosPre(this.flyNode);
        if (this.uiTran) {
            if (LayerManager.instance.SceneType == SceneType.D2) {
                this.uiTran.priority = -point[1];
            } else {
                this.uiTran.priority = -point[2] + point[1] * 1.5;
            }
        }
        return false;
    }

    protected _remove(): void {
        PoolManager.instance.setPool(PoolEnum.JumpSequence + BezierCurve, this);
    }

    /**
 * 高性能贝塞尔曲线计算 (德卡斯特里奥算法) — 零分配版
 * @param points 控制点数组（每个点用 Float32Array 表示，如2D: [x, y], 3D: [x, y, z]）
 * @param t 参数 t ∈ [0, 1]
 * @param workBuffer 工作缓冲区（可选，用于内存复用）
 * @param temps 预分配的临时向量池（由调用方传入，避免内部new）
 * @returns 曲线上的点（Float32Array，直接引用 workBuffer 避免内存分配）
 */
    private static bezierOptimized(points: Vector[], t: number, workBuffer?: Vector, temps?: Float32Array[]): Vector {
        const n = points.length;
        const dim = points[0].length;
        const buffer = workBuffer || new Float32Array(dim);
        // 使用已预先拷贝好数据的 temps（由 move() 提前写入），避免 new Float32Array
        const temp: Vector[] = temps || [];
        for (let i = temp.length; i < n; i++) {
            temp[i] = new Float32Array(points[i]);
        }
        // 德卡斯特里奥算法优化实现（原地计算，无需额外分配）
        for (let level = 1; level < n; level++) {
            const end = n - level;
            for (let i = 0; i < end; i++) {
                const p0 = temp[i];
                const p1 = temp[i + 1];
                const current = temp[i];
                for (let d = 0; d < dim; d++) {
                    current[d] = (1 - t) * p0[d] + t * p1[d];
                }
            }
        }
        // 将结果复制到工作缓冲区（避免返回内部数据引用）
        buffer.set(temp[0]);
        return buffer;
    }
}
export type Vector = Float32Array;