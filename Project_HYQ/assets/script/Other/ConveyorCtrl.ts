import { _decorator, CCFloat, Component, Node, v3, Vec3 } from 'cc';
import { GameInfo, SceneType } from '../Common/GameInfo';
const { ccclass, property } = _decorator;

@ccclass('ConveyorCtrl')
//2D版本传送带
export class ConveyorCtrl extends Component {
    @property(Node)
    public root: Node;
    @property(CCFloat)
    baseSpeed: number = 40;

    /** 起点节点（自动获取，用于重置） */
    public startPoint: Node;
    /** 终点节点（自动获取，用于重置） */
    public endPoint: Node;

    /** 总路径长度（所有段长度之和） */
    private totalPathLength: number = 0;
    /** 全局累积移动距离 */
    private accumulatedDistance: number = 0;
    /** 每个块的初始距离（相对路径起点） */
    private blockInitialDistances: number[] = [];

    /**
     * 路径段长度缓存 - 性能优化
     * 每段的长度数组 [段0长度, 段1长度, ...]
     * 避免每帧重复计算 Math.sqrt，对于几十个物品的场景可节省大量性能
     */
    private pathSegmentLengthsCache: number[] = []
    /**
     * 路径点世界坐标缓存
     */
    private pathWorldPointsCache: Vec3[] = []
    /** 路径点局部旋转缓存 */
    private pathAnglePointsCache: number[] = []
    /** 路径点缩放值缓存 */
    private pathScalePointsCache: Vec3[] = []
    public isWorking = false;


    onLoad() {
        // 初始化路径信息缓存
        this.initPathPointsInfoCached();

        // 自动获取起点和终点（root 的第一个和最后一个子节点，用于重置）
        if (this.root && this.root.children.length > 0) {
            this.startPoint = this.root.children[0];
            this.endPoint = this.root.children[this.root.children.length - 1];
        }

        // 触发段长度缓存构建（调用一次 getSegmentLength 会初始化整个缓存）
        if (this.pathWorldPointsCache.length > 1) {
            this.getSegmentLength(0);
        }

        // 计算总路径长度（所有段长度之和）
        this.totalPathLength = 0;
        for (let i = 0; i < this.pathSegmentLengthsCache.length; i++) {
            this.totalPathLength += this.pathSegmentLengthsCache[i];
        }

        // 计算每个块的初始距离
        this.blockInitialDistances = [];
        for (let i = 0; i < this.root.children.length; i++) {
            const block = this.root.children[i];
            const initialDistance = this.calculateDistanceAlongPath(block.worldPosition);
            this.blockInitialDistances.push(initialDistance);
        }

        // 初始化累积距离
        this.accumulatedDistance = 0;
        this.isWorking = false;
    }
    unlockConveyor() {
        this.isWorking = true;
    }
    update(deltaTime: number) {
        if (!this.isWorking) return;
        if (this.totalPathLength <= 0 || this.root.children.length === 0) {
            return;
        }

        // 累加全局移动距离
        this.accumulatedDistance += this.baseSpeed * deltaTime;

        // 遍历每个块，更新位置、旋转和缩放
        for (let i = 0; i < this.root.children.length; i++) {
            const block = this.root.children[i];

            // 计算当前块的距离：(初始距离 + 累积距离) % 总路径长度
            let currentDistance = (this.blockInitialDistances[i] + this.accumulatedDistance) % this.totalPathLength;

            // 处理负数情况
            if (currentDistance < 0) {
                currentDistance += this.totalPathLength;
            }

            // 根据距离获取位置、旋转和缩放
            const { pos, angle, scale } = this.getPositionAndRotationAtDistance(currentDistance);

            // 应用位置、旋转和缩放
            if (GameInfo.isD3Scene) {
                //NOTE: 父节点X轴旋转了90°, 所以子节点的旋转变为了Z轴旋转
                block.setRotationFromEuler(block.eulerAngles.x, block.eulerAngles.y, angle);
            } else {
                block.angle = angle;
            }
            block.setWorldPosition(pos);
            block.setScale(scale);
        }
    }
    /**
     * 获取路径指定段的长度（带缓存）- 优化版本
     * @param segmentIndex 段索引（起点索引）
     * @returns 段长度，如果无效则返回0
     */
    private getSegmentLength(segmentIndex: number): number {
        // 检查缓存是否存在
        if (!this.pathSegmentLengthsCache.length) {
            // 首次访问，预计算该路径所有段的长度
            // 优化: 使用缓存的路径点，避免重新构建数组
            const points = this.pathWorldPointsCache;

            for (let i = 0; i < points.length - 1; i++) {
                const from = points[i];
                const to = points[i + 1];
                const dx = to.x - from.x;
                const dy = to.y - from.y;
                const dz = to.z - from.z;
                const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
                this.pathSegmentLengthsCache.push(length);
            }
        }

        // 从缓存中获取
        if (segmentIndex >= 0 && segmentIndex < this.pathSegmentLengthsCache.length) {
            return this.pathSegmentLengthsCache[segmentIndex];
        }
        return 0;
    }
    /**
     * 根据路径距离返回对应的位置、旋转角度和缩放
     * @param distance 沿路径的距离
     * @returns 位置、角度和缩放
     */
    private getPositionAndRotationAtDistance(distance: number): { pos: Vec3, angle: number, scale: Vec3 } {
        if (this.pathWorldPointsCache.length < 2) {
            return { pos: v3(0, 0, 0), angle: 0, scale: v3(1, 1, 1) };
        }

        // 遍历所有段，找到距离所在的段
        let accumulatedLength = 0;
        for (let i = 0; i < this.pathSegmentLengthsCache.length; i++) {
            const segmentLength = this.pathSegmentLengthsCache[i];

            if (distance <= accumulatedLength + segmentLength) {
                // 找到了目标段，计算段内进度
                const distanceInSegment = distance - accumulatedLength;
                const segmentProgress = segmentLength > 0 ? distanceInSegment / segmentLength : 0;

                // 位置插值
                const from = this.pathWorldPointsCache[i];
                const to = this.pathWorldPointsCache[i + 1];
                const newPos = v3();
                Vec3.lerp(newPos, from, to, segmentProgress);

                // 旋转插值
                const angleFrom = this.pathAnglePointsCache[i];
                const angleTo = this.pathAnglePointsCache[i + 1];
                const angle = this.lerpAngleShortest(angleFrom, angleTo, segmentProgress);
                // 缩放插值
                const scaleFrom = this.pathScalePointsCache[i];
                const scaleTo = this.pathScalePointsCache[i + 1];
                const newScale = v3();
                Vec3.lerp(newScale, scaleFrom, scaleTo, segmentProgress);

                return { pos: newPos, angle: angle, scale: newScale };
            }

            accumulatedLength += segmentLength;
        }

        // 如果距离超出路径，返回最后一个点
        const lastIndex = this.pathWorldPointsCache.length - 1;
        return {
            pos: this.pathWorldPointsCache[lastIndex].clone(),
            angle: this.pathAnglePointsCache[lastIndex],
            scale: this.pathScalePointsCache[lastIndex].clone()
        };
    }

    /**
     * 计算给定世界坐标在路径上的距离（用于初始化块距离）
     * @param worldPos 世界坐标
     * @returns 沿路径的距离
     */
    private calculateDistanceAlongPath(worldPos: Vec3): number {
        if (this.pathWorldPointsCache.length < 2) {
            return 0;
        }

        let minDistance = Infinity;
        let bestSegmentIndex = 0;
        let bestProjectionRatio = 0;

        // 遍历所有路径段，找到点到哪个段最近
        for (let i = 0; i < this.pathWorldPointsCache.length - 1; i++) {
            const from = this.pathWorldPointsCache[i];
            const to = this.pathWorldPointsCache[i + 1];

            // 计算点到线段的投影
            const segmentVec = v3();
            Vec3.subtract(segmentVec, to, from);
            const pointVec = v3();
            Vec3.subtract(pointVec, worldPos, from);

            const segmentLengthSq = segmentVec.lengthSqr();
            let projectionRatio = 0;

            if (segmentLengthSq > 0.0001) {
                projectionRatio = Vec3.dot(pointVec, segmentVec) / segmentLengthSq;
                projectionRatio = Math.max(0, Math.min(1, projectionRatio)); // 限制在 [0, 1]
            }

            // 计算投影点
            const projectionPoint = v3();
            Vec3.lerp(projectionPoint, from, to, projectionRatio);

            // 计算点到投影点的距离
            const distance = Vec3.distance(worldPos, projectionPoint);

            if (distance < minDistance) {
                minDistance = distance;
                bestSegmentIndex = i;
                bestProjectionRatio = projectionRatio;
            }
        }

        // 计算在路径上的距离：前面所有段的长度 + 当前段内的距离
        let pathDistance = 0;
        for (let i = 0; i < bestSegmentIndex; i++) {
            pathDistance += this.pathSegmentLengthsCache[i];
        }
        pathDistance += bestProjectionRatio * this.pathSegmentLengthsCache[bestSegmentIndex];

        return pathDistance;
    }
    /**
     * 初始化路径点世界坐标、局部旋转和缩放（带缓存）- 性能优化版本
     */
    private initPathPointsInfoCached() {
        this.pathWorldPointsCache = [];
        this.pathAnglePointsCache = [];
        this.pathScalePointsCache = [];
        for (let i = 0; i < this.root.children.length; i++) {
            let pt = this.root.children[i];
            this.pathWorldPointsCache.push(pt.worldPosition.clone());
            //NOTE: 父节点X轴旋转了90°, 所以子节点的旋转变为了Z轴旋转, 2D场景沿用angle
            this.pathAnglePointsCache[i] = GameInfo.isD3Scene
                ? this.normalizeAngleDeg(pt.eulerAngles.z)
                : pt.angle;
            this.pathScalePointsCache.push(pt.scale.clone());
        }
    }
    /** 归一化到 [0, 360) */
    private normalizeAngleDeg(deg: number): number {
        let a = deg % 360;
        if (a < 0) a += 360;
        return a;
    }
    /** 归一化到 (-180, 180] */
    private normalizeAngleSignedDeg(deg: number): number {
        let a = deg % 360;
        if (a <= -180) a += 360;
        if (a > 180) a -= 360;
        return a;
    }
    /**
     * 最短角插值（单位：度）
     * 解决例如 350° -> 10° 跨0度时的反向大旋转问题
     */
    private lerpAngleShortest(fromDeg: number, toDeg: number, t: number): number {
        const from = this.normalizeAngleDeg(fromDeg);
        const to = this.normalizeAngleDeg(toDeg);
        const delta = this.normalizeAngleSignedDeg(to - from); // (-180, 180]
        return this.normalizeAngleDeg(from + delta * t);
    }
}

