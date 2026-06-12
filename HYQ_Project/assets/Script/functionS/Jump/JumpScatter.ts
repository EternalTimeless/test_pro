import { Vec3, Node, UITransform, CurveRange, math } from "cc";
import PoolManager from "../../Base/PoolManager";
import JumpSequenceBase from "./JumpSequenceBase";
import LayerManager from "../../Base/LayerManager";
import { PoolEnum, SceneType } from "../../Base/EnumList";

/**
 * 扩散式抛物线跳跃 - 支持随机扩散和混乱轨迹
 * 
 * 特点：
 * 1. 多个物体从相近位置起跳时自动分散
 * 2. 随机控制点产生混乱轨迹
 * 3. 精确到达各自终点
 * 4. 支持 2D/3D 场景
 * 
 * 使用场景：
 * - 金币/道具爆炸效果
 * - 战利品掉落
 * - 群体物品飞行
 */
export class JumpScatter extends JumpSequenceBase {
    protected _remove(): void {
        PoolManager.instance.setPool(PoolEnum.JumpSequence + JumpScatter, this);
    }

    private flyNode: Node;
    private uiTran: UITransform;
    private startPos: Vec3 = new Vec3();
    private endPos: Vec3 = new Vec3();
    private jumpHeight: number;
    private jumpSpeed: number;

    // 扩散控制参数
    private scatterRadius: number = 0;
    private scatterAngle: number = 0;
    private randomness: number = 0.3;
    private controlPoints: Vec3[] = [];

    private curveRange: CurveRange
    private curveRangeSpeed: CurveRange;

    public init(jumpNode: Node, endPos: Vec3, jumpHeight: number, jumpSpeed: number, scatterAngle: number = 0) {
        this.flyNode = jumpNode;
        this.startPos.set(jumpNode.worldPosition);
        this.endPos.set(endPos);
        this.jumpHeight = jumpHeight;
        this.jumpSpeed = jumpSpeed;
        this.scatterAngle = scatterAngle;
        this.uiTran = jumpNode.getComponent(UITransform);
        this.curveRange = null;
        this.curveRangeSpeed = null;
        this._time = 0;
        this.generateScatterPath();
    }

    public setScatterRadius(radius: number) {
        this.scatterRadius = radius;
        this.generateScatterPath();
        return this;
    }

    public setRandomness(randomness: number) {
        this.randomness = Math.max(0, Math.min(1, randomness));
        this.generateScatterPath();
        return this;
    }

    public setCurveRange(cr: CurveRange) {
        this.curveRange = cr;
        return this;
    }

    public setCurveRangeSpeed(cr: CurveRange) {
        this.curveRangeSpeed = cr;
        return this;
    }

    private generateScatterPath(): void {
        this.controlPoints = [];
        this.controlPoints.push(this.startPos.clone());

        const direction = new Vec3();
        Vec3.subtract(direction, this.endPos, this.startPos);
        const totalDistance = direction.length();

        if (totalDistance < 0.01) {
            this.controlPoints.push(this.startPos.clone());
            this.controlPoints.push(this.endPos.clone());
            this.controlPoints.push(this.endPos.clone());
            return;
        }

        direction.normalize();
        const perpendicular = this.getPerpendicularVector(direction);

        const p1 = this.createControlPoint(
            this.startPos, direction, perpendicular,
            totalDistance * 0.33, this.scatterRadius * 1.2, this.jumpHeight * 0.7
        );
        this.controlPoints.push(p1);

        const p2 = this.createControlPoint(
            this.startPos, direction, perpendicular,
            totalDistance * 0.67, this.scatterRadius * 0.8, this.jumpHeight * 1.0
        );
        this.controlPoints.push(p2);

        this.controlPoints.push(this.endPos.clone());
    }

    private createControlPoint(
        basePos: Vec3, direction: Vec3, perpendicular: Vec3,
        forwardDist: number, scatterDist: number, heightOffset: number
    ): Vec3 {
        const point = basePos.clone();
        const forward = direction.clone().multiplyScalar(forwardDist);
        point.add(forward);

        if (scatterDist > 0) {
            const radAngle = math.toRadian(this.scatterAngle);
            const scatterOffset = perpendicular.clone();

            if (LayerManager.instance.SceneType === SceneType.D2) {
                const cos = Math.cos(radAngle);
                const sin = Math.sin(radAngle);
                scatterOffset.x = perpendicular.x * cos - perpendicular.y * sin;
                scatterOffset.y = perpendicular.x * sin + perpendicular.y * cos;
            } else {
                const cos = Math.cos(radAngle);
                const sin = Math.sin(radAngle);
                scatterOffset.x = perpendicular.x * cos - perpendicular.z * sin;
                scatterOffset.z = perpendicular.x * sin + perpendicular.z * cos;
            }

            scatterOffset.multiplyScalar(scatterDist);

            const randomOffset = new Vec3(
                (Math.random() - 0.5) * scatterDist * this.randomness * 2,
                (Math.random() - 0.5) * heightOffset * this.randomness * 0.5,
                (Math.random() - 0.5) * scatterDist * this.randomness * 2
            );

            point.add(scatterOffset);
            point.add(randomOffset);
        }

        point.y += heightOffset;
        return point;
    }

    private getPerpendicularVector(vec: Vec3): Vec3 {
        if (LayerManager.instance.SceneType === SceneType.D2) {
            return new Vec3(-vec.y, vec.x, 0);
        } else {
            if (Math.abs(vec.x) < 0.001 && Math.abs(vec.z) < 0.001) {
                return new Vec3(1, 0, 0);
            }
            const perp = new Vec3(-vec.z, 0, vec.x);
            perp.normalize();
            return perp;
        }
    }

    protected move(dt: number): boolean {
        let t = dt * this.jumpSpeed * 2.5;

        if (this.curveRangeSpeed) {
            let cy = this.curveRangeSpeed.curve.evaluate(this._time);
            t += t * cy;
            t = Math.max(0.01, t);
        }

        this._time += t;
        this._time = Math.min(1, this._time);

        if (this._time >= 1) {
            this.flyNode.setWorldPosition(this.endPos);
            this.endPosPre(this.flyNode);
            this.updatePriority(this.endPos);
            return true;
        }

        const pos = this.cubicBezier(this.controlPoints, this._time);

        if (this.curveRange) {
            const scaleMultiplier = LayerManager.instance.SceneType === SceneType.D2 ? 256 : 4;
            let cy = this.curveRange.curve.evaluate(this._time) * scaleMultiplier;
            let scale = 1 - Math.abs(this._time - 0.5) / 0.5;
            pos.y += cy * scale;
        }

        this.flyNode.setWorldPosition(pos);
        this.endPosPre(this.flyNode);
        this.updatePriority(pos);

        return false;
    }

    private cubicBezier(points: Vec3[], t: number): Vec3 {
        const t2 = t * t;
        const t3 = t2 * t;
        const mt = 1 - t;
        const mt2 = mt * mt;
        const mt3 = mt2 * mt;

        const result = new Vec3();
        const temp0 = points[0].clone().multiplyScalar(mt3);
        result.add(temp0);
        const temp1 = points[1].clone().multiplyScalar(3 * mt2 * t);
        result.add(temp1);
        const temp2 = points[2].clone().multiplyScalar(3 * mt * t2);
        result.add(temp2);
        const temp3 = points[3].clone().multiplyScalar(t3);
        result.add(temp3);

        return result;
    }

    private updatePriority(pos: Vec3): void {
        if (!this.uiTran) return;

        if (LayerManager.instance.SceneType === SceneType.D2) {
            this.uiTran.priority = -pos.y;
        } else {
            this.uiTran.priority = -pos.z + pos.y * 1.5;
        }
    }
}
