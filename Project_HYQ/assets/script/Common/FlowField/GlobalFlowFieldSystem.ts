// GlobalFlowFieldSystem.ts
import { v3, Vec3 } from "cc";

// 用于BFS的节点结构
interface BFSSearchNode {
    i: number;
    j: number;
    distance: number;
}

// 用于方向向量的结构
interface Direction {
    di: number;
    dj: number;
    cost: number;
}

// 环形缓冲区队列实现
class CircularQueue<T> {
    private buffer: T[];
    private capacity: number;
    private head: number = 0;
    private tail: number = 0;
    private size: number = 0;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.buffer = new Array<T>(capacity);
    }

    enqueue(item: T): boolean {
        if (this.size === this.capacity) {
            return false; // 队列已满
        }
        this.buffer[this.tail] = item;
        this.tail = (this.tail + 1) % this.capacity;
        this.size++;
        return true;
    }

    dequeue(): T | undefined {
        if (this.size === 0) {
            return undefined; // 队列为空
        }
        const item = this.buffer[this.head];
        this.head = (this.head + 1) % this.capacity;
        this.size--;
        return item;
    }

    isEmpty(): boolean {
        return this.size === 0;
    }

    getSize(): number {
        return this.size;
    }

    clear(): void {
        this.head = 0;
        this.tail = 0;
        this.size = 0;
    }
}

export default class GlobalFlowFieldSystem {
    private width: number = 0;
    private height: number = 0;
    private size: number = 1;
    private goMap: Uint8Array = new Uint8Array(0);
    private originX: number = 0;
    private originZ: number = 0;

    // 流场和距离场使用扁平化数组提高访问效率
    private flowFields: Float32Array[] = [];
    private distanceFields: Float32Array[] = [];
    private map: Uint8Array = new Uint8Array(0);

    // 多目标点支持
    private targets: Array<{ x: number, z: number, isValid: boolean }> = [];
    private maxTargets: number = 10;

    // 更新控制
    private lastUpdateTime: number = 0;
    private updateInterval: number = 500;
    private targetUpdateFlags: Uint8Array = new Uint8Array(0);
    // 分帧控制
    private pendingTargetUpdates: number[] = []; // 待处理的目标点队列
    private isUpdatingFlowField: boolean = false; // 是否正在更新流场

    // BFS相关优化 - 为每个目标点独立的数据结构
    private visitedArrays: Uint8Array[] = []; // 每个目标点独立的visited数组
    private tempNodesArrays: BFSSearchNode[][] = []; // 每个目标点独立的临时节点数组
    private tempNodeIndices: number[] = []; // 每个目标点独立的临时节点索引

    // 方向数组
    private static readonly DIRECTIONS_8: Direction[] = [
        { di: -1, dj: 0, cost: 10 },
        { di: 1, dj: 0, cost: 10 },
        { di: 0, dj: -1, cost: 10 },
        { di: 0, dj: 1, cost: 10 },
        { di: -1, dj: -1, cost: 14.14 },
        { di: -1, dj: 1, cost: 14.14 },
        { di: 1, dj: -1, cost: 14.14 },
        { di: 1, dj: 1, cost: 14.14 }
    ];

    private static readonly DIRECTIONS_4: { di: number, dj: number }[] = [
        { di: -1, dj: 0 },
        { di: 1, dj: 0 },
        { di: 0, dj: -1 },
        { di: 0, dj: 1 }
    ];

    constructor() {
        // 初始化目标点数组
        for (let i = 0; i < this.maxTargets; i++) {
            this.targets.push({ x: 0, z: 0, isValid: false });
        }
    }

    /**
     * 初始化流场系统
     * @param goMap 地图数据
     * @param width 地图宽度
     * @param height 地图高度
     * @param size 格子大小
     * @param originX 地图原点X坐标（可选，默认为0）
     * @param originZ 地图原点Z坐标（可选，默认为0）
     */
    public init(goMap: boolean[][], width: number, height: number, size: number, originX: number = 0, originZ: number = 0): void {
        this.width = width;
        this.height = height;
        this.size = size;
        this.originX = originX;
        this.originZ = originZ;

        const totalCells = width * height;
        this.goMap = new Uint8Array(totalCells);
        this.map = new Uint8Array(totalCells);
        this.targetUpdateFlags = new Uint8Array(this.maxTargets);

        // 转换地图数据
        for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {
                const index = j * width + i;
                this.goMap[index] = goMap[j][i] ? 1 : 0;
                this.map[index] = goMap[j][i] ? 1 : 0;
            }
        }

        // 为每个目标点初始化流场和距离场以及独立的数据结构
        for (let t = 0; t < this.maxTargets; t++) {
            this.flowFields[t] = new Float32Array(totalCells * 3);
            this.distanceFields[t] = new Float32Array(totalCells);
            this.distanceFields[t].fill(Infinity);
            // 初始化每个目标点独立的数据结构
            this.visitedArrays[t] = new Uint8Array(totalCells);

            // 为每个目标点初始化独立的临时节点数组
            const estimatedNodes = Math.min(5000, Math.max(1500, (width * height) / 10));
            this.tempNodesArrays[t] = new Array<BFSSearchNode>(estimatedNodes);
            for (let i = 0; i < estimatedNodes; i++) {
                this.tempNodesArrays[t][i] = { i: 0, j: 0, distance: 0 };
            }
        }

        // 初始化每个目标点的临时节点索引
        this.tempNodeIndices = new Array(this.maxTargets).fill(0);
    }

    /**
     * 添加目标点
     * @param targetX 目标点X坐标
     * @param targetZ 目标点Z坐标
     * @returns 目标点索引
     */
    public addTarget(targetX: number, targetZ: number): number {
        for (let i = 0; i < this.maxTargets; i++) {
            if (!this.targets[i].isValid) {
                this.targets[i].x = targetX;
                this.targets[i].z = targetZ;
                this.targets[i].isValid = true;
                this.targetUpdateFlags[i] = 1;
                this.updateSingleFlowField(i);
                this.targetUpdateFlags[i] = 0;
                return i;
            }
        }

        console.warn("已达到最大目标点数量");
        return -1;
    }

    /**
     * 更新指定索引的目标点位置
     * @param index 目标点索引
     * @param x 新的X坐标
     * @param z 新的Z坐标
     */
    public updateTargetPos(index: number, x: number, z: number) {
        if (index < 0 || index >= this.maxTargets || !this.targets[index].isValid) {
            return;
        }

        const dx = this.targets[index].x - x;
        const dz = this.targets[index].z - z;
        const distanceSq = dx * dx + dz * dz;

        if (distanceSq > 0.5) { // 使用距离平方避免开方运算
            this.targets[index].x = x;
            this.targets[index].z = z;
            this.targetUpdateFlags[index] = 1;
        }
    }

    /**
     * 移除指定索引的目标点
     * @param index 目标点索引
     */
    public removeTarget(index: number): void {
        if (index < 0 || index >= this.maxTargets) {
            return;
        }

        this.targets[index].isValid = false;
        this.targetUpdateFlags[index] = 0;
        this.resetTargetFlowField(index);
    }

    /**
     * 重置指定目标点的流场
     */
    private resetTargetFlowField(targetIndex: number): void {
        this.flowFields[targetIndex].fill(0);
    }

    /**
     * 触发流场更新，将需要更新的目标点加入队列
     */
    private scheduleFlowFieldUpdates(): void {
        // 清空当前待处理队列
        this.pendingTargetUpdates.length = 0;

        // 将所有需要更新的目标点加入队列
        for (let t = 0; t < this.maxTargets; t++) {
            if (this.targets[t].isValid && this.targetUpdateFlags[t]) {
                this.pendingTargetUpdates.push(t);
            }
        }

        // 如果有待处理的目标点，标记需要更新
        if (this.pendingTargetUpdates.length > 0) {
            this.isUpdatingFlowField = true;
        }
    }

    /**
     * 分帧更新流场
     */
    public onUpdate(dt: number): void {
        const now = Date.now();

        // 检查是否需要开始新的更新周期
        if (now - this.lastUpdateTime >= this.updateInterval) {
            this.scheduleFlowFieldUpdates();
            this.lastUpdateTime = now;
        }

        // 如果有待处理的目标点，每帧处理一个
        if (this.isUpdatingFlowField && this.pendingTargetUpdates.length > 0) {
            const targetIndex = this.pendingTargetUpdates.shift()!;
            this.updateSingleFlowField(targetIndex);
            this.targetUpdateFlags[targetIndex] = 0;

            // 如果所有目标点都处理完毕，清理状态
            if (this.pendingTargetUpdates.length === 0) {
                this.isUpdatingFlowField = false;
                this.clearNearestTraversableCache();
            }
        }
    }

    /**
     * 更新需要更新的目标点流场
     */
    private updateFlowFields(): void {
        let updated = false;
        for (let t = 0; t < this.maxTargets; t++) {
            if (this.targets[t].isValid && this.targetUpdateFlags[t]) {
                this.updateSingleFlowField(t);
                this.targetUpdateFlags[t] = 0;
                updated = true;
            }
        }
        if (updated) {
            this.clearNearestTraversableCache();
        }
    }

    /**
     * 将世界坐标转换为网格坐标
     * @param worldX 世界X坐标
     * @param worldZ 世界Z坐标
     * @returns 网格坐标 {i, j}
     */
    public worldToGrid(worldX: number, worldZ: number): { i: number, j: number } {
        // 考虑地图原点偏移的坐标转换
        // i 是列索引（X方向）
        // j 是行索引（Z方向）
        let i = Math.floor((worldX - this.originX) / this.size);
        let j = Math.floor((this.originZ - worldZ) / this.size);

        // 边界检查
        i = i < 0 ? 0 : (i >= this.width ? this.width - 1 : i);
        j = j < 0 ? 0 : (j >= this.height ? this.height - 1 : j);

        return { i, j };
    }

    /**
     * 更新单个目标点的流场
     */
    private updateSingleFlowField(targetIndex: number): void {
        let target = this.targets[targetIndex];
        let gridPos = this.worldToGrid(target.x, target.z);
        let targetI = gridPos.i;
        let targetJ = gridPos.j;

        const index = targetJ * this.width + targetI;

        if (targetJ < 0 || targetJ >= this.height || targetI < 0 || targetI >= this.width) {
            console.warn(`目标点坐标超出范围: i=${targetI}, j=${targetJ}`);
            return;
        }

        if (!this.goMap[index]) {
            return;
        }

        this.resetDistanceField(targetIndex);
        this.calculateDistanceField(targetIndex, targetI, targetJ);
        this.calculateFlowField(targetIndex);
    }

    /**
     * 重置指定目标点的距离场数据
     */
    private resetDistanceField(targetIndex: number): void {
        const distanceField = this.distanceFields[targetIndex];
        const map = this.map;
        const totalCells = this.width * this.height;

        // 手动循环展开优化小数组的填充
        let i = 0;
        const remainder = totalCells % 8;

        for (; i < totalCells - remainder; i += 8) {
            distanceField[i] = map[i] ? Infinity : -1;
            distanceField[i + 1] = map[i + 1] ? Infinity : -1;
            distanceField[i + 2] = map[i + 2] ? Infinity : -1;
            distanceField[i + 3] = map[i + 3] ? Infinity : -1;
            distanceField[i + 4] = map[i + 4] ? Infinity : -1;
            distanceField[i + 5] = map[i + 5] ? Infinity : -1;
            distanceField[i + 6] = map[i + 6] ? Infinity : -1;
            distanceField[i + 7] = map[i + 7] ? Infinity : -1;
        }

        for (; i < totalCells; i++) {
            distanceField[i] = map[i] ? Infinity : -1;
        }
    }

    private calculateDistanceField(targetIndex: number, targetI: number, targetJ: number): void {
        const distanceField = this.distanceFields[targetIndex];
        const visited = this.visitedArrays[targetIndex]; // 使用独立的visited数组
        visited.fill(0);

        // 重置临时节点索引
        this.resetTempNodeIndex(targetIndex);

        // 根据地图大小动态调整队列大小
        const maxQueueSize = Math.min(15000, Math.max(5000, this.width * this.height / 4));
        const queue: BFSSearchNode[] = new Array(maxQueueSize);
        let front = 0;
        let rear = 0;

        const targetIndexFlat = targetJ * this.width + targetI;
        distanceField[targetIndexFlat] = 0;
        visited[targetIndexFlat] = 1;

        // 初始化第一个节点
        let node = this.getNextTempNode(targetIndex);
        node.i = targetI;
        node.j = targetJ;
        node.distance = 0;
        queue[rear++] = node;

        const width = this.width;
        const height = this.height;
        const map = this.map;

        // 增加队列满的监控
        let nodesProcessed = 0;
        const maxNodes = this.width * this.height;
        let queueFullWarningShown = false;

        while (front < rear && nodesProcessed < maxNodes) {
            const current = queue[front++];
            nodesProcessed++;

            const dirs = GlobalFlowFieldSystem.DIRECTIONS_8;
            for (let d = 0; d < 8; d++) {
                const dir = dirs[d];
                const ni = current.i + dir.di;
                const nj = current.j + dir.dj;

                if ((ni | nj) >= 0 && ni < width && nj < height) {
                    const nIndex = nj * width + ni;

                    if (map[nIndex] && !visited[nIndex]) {
                        visited[nIndex] = 1;
                        const newDistance = current.distance + dir.cost;

                        distanceField[nIndex] = newDistance;

                        // 添加队列满的检查和警告
                        if (rear >= maxQueueSize) {
                            if (!queueFullWarningShown) {
                                console.warn(`BFS队列已满 (${maxQueueSize})，可能影响寻路准确性`);
                                queueFullWarningShown = true;
                            }
                            // 队列满时不添加新节点，但继续处理现有节点
                            break; // 跳出for循环，处理下一个队列节点
                        }

                        let newNode = this.getNextTempNode(targetIndex);
                        newNode.i = ni;
                        newNode.j = nj;
                        newNode.distance = newDistance;
                        queue[rear++] = newNode;
                    }
                }
            }
        }

        if (nodesProcessed >= maxNodes) {
            console.warn("BFS处理节点数达到上限，可能存在逻辑错误");
        }
    }

    /**
     * 获取下一个临时节点
     */
    private getNextTempNode(targetIndex: number): BFSSearchNode {
        if (this.tempNodeIndices[targetIndex] < this.tempNodesArrays[targetIndex].length) {
            return this.tempNodesArrays[targetIndex][this.tempNodeIndices[targetIndex]++];
        } else {
            // 如果预分配的节点用完了，创建新节点（这种情况应该很少发生）
            return { i: 0, j: 0, distance: 0 };
        }
    }

    /**
     * 重置临时节点索引
     */
    private resetTempNodeIndex(targetIndex: number): void {
        this.tempNodeIndices[targetIndex] = 0;
    }

    /**
     * 根据距离场计算流场方向
     * @param targetIndex 目标点索引
     */
    private calculateFlowField(targetIndex: number): void {
        // 重置临时节点索引以便下次使用
        this.resetTempNodeIndex(targetIndex);

        const distanceField = this.distanceFields[targetIndex];
        const flowField = this.flowFields[targetIndex];
        const width = this.width;
        const height = this.height;
        const map = this.map;

        // 循环展开优化
        for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {
                const index = j * width + i;
                const flowIndex = index * 3;

                if (!map[index] || distanceField[index] === 0) {
                    flowField[flowIndex] = 0;
                    flowField[flowIndex + 1] = 0;
                    flowField[flowIndex + 2] = 0;
                    continue;
                }

                // ✅ 关键修复：如果当前格子距离为 Infinity，则设为零方向
                if (distanceField[index] === Infinity) {
                    flowField[flowIndex] = 0;
                    flowField[flowIndex + 1] = 0;
                    flowField[flowIndex + 2] = 0;
                    continue;
                }

                let bestDirection = null;
                let minDistance = distanceField[index]; // 使用当前格子的距离作为初始值

                // 展开8方向循环
                const dirs8 = GlobalFlowFieldSystem.DIRECTIONS_8;
                for (let d = 0; d < 8; d++) {
                    const dir = dirs8[d];
                    const ni = i + dir.di;
                    const nj = j + dir.dj;

                    // 优化边界检查
                    if ((ni | nj) >= 0 && ni < width && nj < height) {
                        const nIndex = nj * width + ni;

                        if (map[nIndex] && distanceField[nIndex] < minDistance) {
                            minDistance = distanceField[nIndex];
                            bestDirection = dir;
                        }
                    }
                }

                if (bestDirection) {
                    flowField[flowIndex] = bestDirection.di;
                    flowField[flowIndex + 1] = 0;
                    flowField[flowIndex + 2] = -bestDirection.dj;
                } else {
                    // fallback逻辑：找到距离更小的可通行方向
                    let fallbackDirection = null;
                    let fallbackMinDistance = distanceField[index];

                    // 展开4方向循环
                    const dirs4 = GlobalFlowFieldSystem.DIRECTIONS_4;
                    for (let d = 0; d < 4; d++) {
                        const dir = dirs4[d];
                        const ni = i + dir.di;
                        const nj = j + dir.dj;

                        // 优化边界检查
                        if ((ni | nj) >= 0 && ni < width && nj < height) {
                            const nIndex = nj * width + ni;
                            if (map[nIndex] && distanceField[nIndex] < fallbackMinDistance) {
                                fallbackMinDistance = distanceField[nIndex];
                                fallbackDirection = dir;
                            }
                        }
                    }

                    if (fallbackDirection) {
                        flowField[flowIndex] = fallbackDirection.di;
                        flowField[flowIndex + 1] = 0;
                        flowField[flowIndex + 2] = -fallbackDirection.dj;
                    } else {
                        // 最终兜底：设为零方向
                        flowField[flowIndex] = 0;
                        flowField[flowIndex + 1] = 0;
                        flowField[flowIndex + 2] = 0;
                    }
                }
            }
        }
    }

    // 每个目标点独立的缓存
    private nearestTraversableCaches: Map<string, { i: number, j: number } | null>[] = [];

    public getFlowDirection(worldX: number, worldZ: number, targetIndex: number): Vec3 {
        if (targetIndex < 0 || targetIndex >= this.maxTargets || !this.targets[targetIndex].isValid) {
            return new Vec3(0, 0, 0);
        }

        let gridPos = this.worldToGrid(worldX, worldZ);
        let i = gridPos.i;
        let j = gridPos.j;

        // 调试信息
        // console.log(`[FlowField] 世界坐标(${worldX.toFixed(2)}, ${worldZ.toFixed(2)}) -> 网格(${i}, ${j}), 地图原点(${this.originX.toFixed(2)}, ${this.originZ.toFixed(2)})`);

        if (i >= 0 && i < this.width && j >= 0 && j < this.height) {
            const index = j * this.width + i;

            if (this.map[index]) {
                const flowField = this.flowFields[targetIndex];
                const flowIndex = index * 3;

                return v3(
                    flowField[flowIndex],
                    flowField[flowIndex + 1],
                    flowField[flowIndex + 2]
                );
            } else {
                let nearestPos = this.findNearestTraversablePosition(i, j, targetIndex);
                if (nearestPos) {
                    let directionX = nearestPos.i - i;
                    let directionZ = nearestPos.j - j;

                    if (directionX !== 0 || directionZ !== 0) {
                        return v3(directionX, 0, -directionZ);
                    }
                }
            }
        }

        return v3(0, 0, 0);
    }

    /**
     * 寻找最近的可通行位置（带缓存优化）
     * @param startI 起始网格i坐标
     * @param startJ 起始网格j坐标
     * @param targetIndex 目标点索引
     * @returns 最近的可通行位置，如果找不到则返回null
     */
    private findNearestTraversablePosition(startI: number, startJ: number, targetIndex: number): { i: number, j: number } | null {
        // 初始化目标点的缓存（如果尚未初始化）
        if (!this.nearestTraversableCaches[targetIndex]) {
            this.nearestTraversableCaches[targetIndex] = new Map();
        }

        const cache = this.nearestTraversableCaches[targetIndex];
        const cacheKey = `${startI},${startJ}`;

        if (cache.has(cacheKey)) {
            return cache.get(cacheKey)!;
        }

        // 使用环形缓冲区队列替代数组shift操作
        const queue = new CircularQueue<{ i: number, j: number }>(this.width * this.height);
        // 为每个调用创建独立的visited数组，避免与calculateDistanceField相互影响
        const localVisited = new Uint8Array(this.width * this.height);

        queue.enqueue({ i: startI, j: startJ });
        const startIndex = startJ * this.width + startI;
        localVisited[startIndex] = 1;

        const width = this.width;
        const height = this.height;
        const map = this.map;

        // 限制搜索的最大节点数，防止无限循环
        let nodesProcessed = 0;
        const maxNodes = Math.min(10000, this.width * this.height / 2);

        // 展开方向循环
        const directions = GlobalFlowFieldSystem.DIRECTIONS_8;

        while (!queue.isEmpty() && nodesProcessed < maxNodes) {
            let current = queue.dequeue()!;
            nodesProcessed++;

            const currentIndex = current.j * width + current.i;
            if (map[currentIndex]) {
                const result = { i: current.i, j: current.j };
                cache.set(cacheKey, result);
                return result;
            }

            // 展开8方向循环
            for (let d = 0; d < 8; d++) {
                const dir = directions[d];
                const ni = current.i + dir.di;
                const nj = current.j + dir.dj;

                // 优化边界检查
                if ((ni | nj) >= 0 && ni < width && nj < height) {
                    const nIndex = nj * width + ni;
                    if (!localVisited[nIndex]) {
                        localVisited[nIndex] = 1;
                        queue.enqueue({ i: ni, j: nj });
                    }
                }
            }
        }

        cache.set(cacheKey, null);
        return null;
    }

    /**
     * 清除最近可通行位置缓存
     */
    private clearNearestTraversableCache(): void {
        // 清除所有目标点的缓存
        for (let i = 0; i < this.maxTargets; i++) {
            if (this.nearestTraversableCaches[i]) {
                this.nearestTraversableCaches[i].clear();
            }
        }
    }

    /**
     * 更新地图障碍物信息
     * @param rectArr 需要更新的矩形区域数组
     * @param traversable 是否可通行
     */
    public updateMapData(rectArr: { x: number, y: number, width: number, height: number }[], traversable: boolean): void {
        let needsUpdate = false;
        const traversableValue = traversable ? 1 : 0;

        rectArr.forEach(rect => {
            // 预计算边界值以减少计算
            const maxX = rect.x + rect.width;
            const maxY = rect.y + rect.height;

            for (let x = rect.x; x < maxX; x += this.size) {
                for (let z = rect.y; z < maxY; z += this.size) {
                    let gridPos = this.worldToGrid(x, z);
                    let i = gridPos.i;
                    let j = gridPos.j;

                    if (i >= 0 && i < this.width && j >= 0 && j < this.height) {
                        const index = j * this.width + i;
                        if (this.map[index] !== traversableValue) {
                            this.map[index] = traversableValue;
                            for (let t = 0; t < this.maxTargets; t++) {
                                if (this.targets[t].isValid) {
                                    this.targetUpdateFlags[t] = 1;
                                }
                            }
                            needsUpdate = true;
                        }
                    }
                }
            }
        });

        if (needsUpdate) {
            this.updateFlowFields();
        }
    }

    /**
     * 检查指定索引的目标点是否有效
     */
    public isTargetValid(index: number): boolean {
        if (index < 0 || index >= this.maxTargets) {
            return false;
        }
        return this.targets[index].isValid;
    }

    /**
     * 检查世界坐标位置是否在流场的可通行区域内
     * @param worldX 世界X坐标
     * @param worldZ 世界Z坐标
     * @returns 是否可通行
     */
    public isWorldPositionTraversable(worldX: number, worldZ: number): boolean {
        let gridPos = this.worldToGrid(worldX, worldZ);
        let i = gridPos.i;
        let j = gridPos.j;

        if (i >= 0 && i < this.width && j >= 0 && j < this.height) {
            const index = j * this.width + i;
            return this.map[index] === 1;
        }

        return false;
    }

    public get isValid() {
        return this.map && this.map.length > 0;
    }

}