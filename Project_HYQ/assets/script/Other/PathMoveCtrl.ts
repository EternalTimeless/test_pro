import { _decorator, CCFloat, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PathMoveCtrl')
export class PathMoveCtrl extends Component {
    @property({ tooltip: '速度' })
    baseSpeed: number = 5;
    @property({
        type: CCFloat,
        displayName: '到达目标的阈值',
        range: [0.01, 5.0],
    })
    arriveDistance: number = 0.5;
    protected _moveDir: Vec3 = new Vec3();
    private movePath: Node[] = [];
    private curPathIndex: number = 0;
    private targetWorldPosition: Vec3 = new Vec3();
    private callBack: (() => void) | null = null;
    private _isMoving: boolean = false;
    /** 缓存向量，避免每帧分配 */
    private readonly _toTarget: Vec3 = new Vec3();
    private readonly _distanceStep: Vec3 = new Vec3();
    private readonly _curWorldPos: Vec3 = new Vec3();

    update(dt: number) {
        if (!this._isMoving) return;
        if (this.movePath.length <= 0) {
            this.stopMove();
            return;
        }
        if (this.curPathIndex < 0 || this.curPathIndex >= this.movePath.length) {
            this.finishMove();
            return;
        }

        // 目标点（实时取 worldPosition，避免路径点在运行时被移动/缩放后缓存失效）
        this.targetWorldPosition.set(this.movePath[this.curPathIndex].worldPosition);

        // 计算到目标点向量与距离
        this.node.getWorldPosition(this._curWorldPos);
        Vec3.subtract(this._toTarget, this.targetWorldPosition, this._curWorldPos);
        const dist = this._toTarget.length();
        // 参考 MoveCtrl 的“下一帧越界预判”，避免速度过大/浮点误差导致永远到不了
        const nextFrameDistance = this.baseSpeed * dt;
        const arriveEpsilon = 0.001; // 安全边距，抵抗浮点误差

        // 到达（或非常接近）目标点：切换下一个路径点
        if (dist <= this.arriveDistance || dist <= nextFrameDistance + arriveEpsilon) {
            this.node.setWorldPosition(this.targetWorldPosition);
            this.advancePath();
            return;
        }

        // 正常移动：方向归一化，并限制本帧步进，避免越过目标点
        Vec3.normalize(this._moveDir, this._toTarget);
        const stepLen = Math.min(nextFrameDistance, dist);
        Vec3.multiplyScalar(this._distanceStep, this._moveDir, stepLen);
        Vec3.add(this._curWorldPos, this._curWorldPos, this._distanceStep);
        this.node.setWorldPosition(this._curWorldPos);
    }
    onTargetArrived() {
        this.callBack?.();
    }
    initData(path: Node, cb?: () => void) {
        // 重置旧数据
        this.movePath.length = 0;
        this.curPathIndex = 0;
        this._isMoving = false;
        this._moveDir.set(Vec3.ZERO);

        if (!path) return;
        path.children.forEach(child => this.movePath.push(child));
        if (this.movePath.length <= 0) return;

        this.curPathIndex = 0;
        this.targetWorldPosition.set(this.movePath[this.curPathIndex].worldPosition);
        this.callBack = cb ?? null;

        // 立即计算一次方向，避免第一帧 _moveDir 为 0
        this.node.getWorldPosition(this._curWorldPos);
        Vec3.subtract(this._toTarget, this.targetWorldPosition, this._curWorldPos);
        if (!Vec3.equals(this._toTarget, Vec3.ZERO)) {
            Vec3.normalize(this._moveDir, this._toTarget);
        }
        this._isMoving = true;
    }

    /** 手动停止移动（不触发回调） */
    public stopMove() {
        this._isMoving = false;
        this._moveDir.set(Vec3.ZERO);
    }

    private advancePath() {
        this.curPathIndex++;
        if (this.curPathIndex >= this.movePath.length) {
            this.finishMove();
            return;
        }
        this.targetWorldPosition.set(this.movePath[this.curPathIndex].worldPosition);
        Vec3.subtract(this._toTarget, this.targetWorldPosition, this.node.worldPosition);
        if (!Vec3.equals(this._toTarget, Vec3.ZERO)) {
            Vec3.normalize(this._moveDir, this._toTarget);
        }
    }

    private finishMove() {
        this.stopMove();
        this.onTargetArrived();
    }
}