import { _decorator, PhysicsSystem2D, RigidBody2D, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { MapCell, MapCellManager } from './MapCellManager';
const { ccclass, property } = _decorator;

@ccclass('MapCellManager2D')
export class MapCellManager2D extends MapCellManager {
    // @property({
    //     displayName: '格子大小', tooltip: '通过本节点下的BoxCollider进行范围设置，本节点不可旋转', override: true,
    //     group: { id: '设置', name: '地图设置' }
    // })
    // override _cellSize: number = 60;
    // @property({ displayName: '重建地图', group: { id: '地图设置', name: '地图设置' }, visible: false })
    // tagCreateMapCell: boolean = false;

    protected start(): void {
        MapCellManager2D.instance = this;
        this.scheduleOnce(() => {
            this.init()
        }, 0.1)
    }

    // init() {
    //     this.loadMapCells();
    //     this.loadMapJson();
    // }

    protected getData() {
        /** 基于transform进行设置 */
        let trans = this.node.getComponent(UITransform);
        let worldPos = this.node.getWorldPosition();
        const scale = this.node.getWorldScale();
        let w = trans.contentSize.width * scale.x;
        let h = trans.contentSize.height * scale.y;
        if (this.mode45) return this.getData45(v2(worldPos.x, worldPos.y), w, h);
        return this.getData0(v2(worldPos.x, worldPos.y), w, h)

        const angel = this.node.eulerAngles.z;
        const data = this.getGridPointsInRectangle(
            v2(worldPos.x, worldPos.y),
            w, h, angel,
            this.cellSize
        )
        this.cellOffset.x = -data.range.x.x + 2;
        this.cellOffset.y = -data.range.y.x + 2;
        return {
            points: data.points,
            range: data.range
        };
    }

    protected pointPos(point: Vec2) {
        return v3(point.x, point.y, 0);
    }

    protected checkCell(pos: Vec3) {
        const halfSize = this._halfSize;
        const halfSizeSQRT = this._halfSizeSQRT;
        let samplePoints: Vec2[] = [];
        let canMove = this.obsToMove ? false : true;

        // 中心点
        samplePoints.push(v2(pos.x, pos.y));
        if (this.checkPoints(samplePoints)) {
            return this.obsToMove ? true : false;;
        }

        // 四个角点
        samplePoints = [];
        if (this.mode45) {
            samplePoints.push(v2(pos.x, pos.y - halfSize));
            samplePoints.push(v2(pos.x, pos.y + halfSize));
            samplePoints.push(v2(pos.x - halfSize, pos.y));
            samplePoints.push(v2(pos.x + halfSize, pos.y));
        }
        else {
            samplePoints.push(v2(pos.x - halfSize, pos.y - halfSize));
            samplePoints.push(v2(pos.x + halfSize, pos.y - halfSize));
            samplePoints.push(v2(pos.x - halfSize, pos.y + halfSize));
            samplePoints.push(v2(pos.x + halfSize, pos.y + halfSize));
        }
        if (this.checkPoints(samplePoints)) {
            return this.obsToMove ? true : false;;
        }

        // 十字采样点
        samplePoints = [];
        if (this.mode45) {
            samplePoints.push(v2(pos.x - halfSizeSQRT, pos.y - halfSizeSQRT));
            samplePoints.push(v2(pos.x + halfSizeSQRT, pos.y - halfSizeSQRT));
            samplePoints.push(v2(pos.x - halfSizeSQRT, pos.y + halfSizeSQRT));
            samplePoints.push(v2(pos.x + halfSizeSQRT, pos.y + halfSizeSQRT));
        }
        else {
            samplePoints.push(v2(pos.x, pos.y - halfSize));
            samplePoints.push(v2(pos.x, pos.y + halfSize));
            samplePoints.push(v2(pos.x - halfSize, pos.y));
            samplePoints.push(v2(pos.x + halfSize, pos.y));
        }
        if (this.checkPoints(samplePoints)) {
            return this.obsToMove ? true : false;;
        }

        return canMove;
    }

    private checkPoints(points: Vec2[]) {
        for (let point of points) {
            const cs = PhysicsSystem2D.instance.testPoint(point)
            for (let collider of cs) {
                let rigidBody = collider.getComponent(RigidBody2D);
                if (collider.node.active && !rigidBody) continue;
                if (this._rigidGroups.indexOf(rigidBody.group) >= 0) return true;
            }
        }
    }

    wpos2XY(pos: Vec3) {
        if (this.mode45) {
            const size = this.cellSize / 2;
            let x = Math.round(pos.x / size);
            let y = Math.round(pos.y / size);
            if ((x - y) % 2 != 0) {
                const dx = x * size - pos.x;
                const dz = y * size - pos.y;
                if (dx > dz) x = x * size > pos.x ? x - 1 : x + 1;
                else y = y * size > pos.z ? y - 1 : y + 1;
            }
            return [x + this.cellOffset.x, y + this.cellOffset.y];
        }
        return [
            Math.round(pos.x / this.cellSize) + this.cellOffset.x,
            Math.round(pos.y / this.cellSize) + this.cellOffset.y
        ];
    }


    xy2Wpos(x: number, y: number) {
        if (this.mode45) {
            const size = this.cellSize / 2;
            const ox = (x - this.cellOffset.x) * size;
            const oy = (y - this.cellOffset.y) * size;
            return v3(ox, oy, 0);
        }
        return v3((x - this.cellOffset.x) * this.cellSize, (y - this.cellOffset.y) * this.cellSize, 0);
    }

    // 计算两个格子之间的曼哈顿距离
    protected getDistance(a: MapCell, b: MapCell): number {
        return Math.abs(a.wPos.x - b.wPos.x) + Math.abs(a.wPos.y - b.wPos.y);
    }

    /** 创建流场向量 */
    // protected createFlowVec(cx: number, cy: number, nx: number, ny: number) {
    //     return new Vec3(
    //         cx - nx,
    //         cy - ny,
    //         0
    //     );
    // }
    protected createFlowVec(direction: Vec2) {
        return v3(
            direction.x,
            direction.y,
            0,
        )
    }

    protected addObsDirection(awayFromObstacle: Vec3, dir: { x: number, y: number }) {
        awayFromObstacle.add(new Vec3(-dir.x, -dir.y, 0));
    }

    protected formatObsDirection(awayFromObstacle: Vec3) {
        awayFromObstacle.z = 0;
        awayFromObstacle.normalize()//.multiplyScalar(this.flowAwayFromObsValue);
        return awayFromObstacle;
    }
}


