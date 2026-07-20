import { _decorator, Vec3, director, Component, MeshRenderer, Node } from 'cc';
import Singleton from 'db://assets/Script/Base/Singleton';
import { COLLIDE_TYPE } from './CollectBattleTarger/ColliderTag';
import BulletBattle3D from './Battle3D/Bullet/BulletBattle3D';
import { BattleTarget3D } from './BattleTarger/BattleTarget3D';
import { BulletBatchRenderer } from './BulletBatchRenderer';

const { ccclass, executionOrder } = _decorator;

@ccclass('BulletRuntimeDriver')
@executionOrder(1000)
class BulletRuntimeDriver extends Component {
    protected lateUpdate(dt: number): void {
        BulletMonsterCollisionManager.instance.update(dt);
    }
}

/**
 * 碰撞目标组 - 按 COLLIDE_TYPE 分组管理目标
 * 复用现有 ColliderTag.tag + BulletBattle3D.attackTargetTag 的匹配机制
 */
class CollisionTargetGroup {
    /** 对应 COLLIDE_TYPE 枚举值 */
    public targetType: COLLIDE_TYPE;
    /** 该组所有活跃目标 */
    public targets: BattleTarget3D[] = [];

    constructor(targetType: COLLIDE_TYPE) {
        this.targetType = targetType;
    }

}

interface CollisionFrameData {
    frame: number;
    x: number;
    z: number;
    halfX: number;
    halfZ: number;
}

interface CollisionGrid<T> {
    buckets: T[][];
    usedCellIndices: number[];
    usedCellFlags: boolean[];
    minCellX: number;
    minCellZ: number;
    xCellCount: number;
    zCellCount: number;
    active: boolean;
}

function createCollisionGrid<T>(): CollisionGrid<T> {
    return {
        buckets: [],
        usedCellIndices: [],
        usedCellFlags: [],
        minCellX: 0,
        minCellZ: 0,
        xCellCount: 0,
        zCellCount: 0,
        active: false,
    };
}

/**
 * 自定义碰撞管理器 - 替代物理引擎进行子弹与目标的碰撞检测
 * iOS优化：用数组而非Map，预分配Vec3，AABB判定，零GC
 */
@ccclass('BulletMonsterCollisionManager')
export default class BulletMonsterCollisionManager extends Singleton {

    private static readonly OPTIMIZED_SCENE_NAME = 'Game_3D-002';
    private static readonly RUNTIME_DRIVER_NODE_NAME = '__BulletRuntimeDriver';

    public static get instance() {
        return this.getInstance<BulletMonsterCollisionManager>();
    }

    /** X/Z spatial-grid cell size. */
    private readonly _gridCellSize: number = 0.8;

    /** 所有活跃子弹 */
    private _bullets: BulletBattle3D[] = [];

    /** 目标组，按 COLLIDE_TYPE 索引存储 */
    private _targetGroups: { [key: number]: CollisionTargetGroup } = {};
    private _lockableTargetsByType: { [key: number]: BattleTarget3D[] } = {};

    /** 预分配临时Vec3，避免每帧new */
    private _tempVec3: Vec3 = new Vec3();
    private _tempBulletPrevPos: Vec3 = new Vec3();
    private _targetCheckedStamps: number[] = [];
    private _wallCheckedStamps: number[] = [];
    private _staticTargetFrameData: WeakMap<BattleTarget3D, CollisionFrameData> = new WeakMap();
    private _tempTargetFrameData: CollisionFrameData = { frame: -1, x: 0, z: 0, halfX: 0, halfZ: 0 };

    /** Sparse X/Z grids keyed by collision target type. */
    private _targetGrids: { [groupId: string]: CollisionGrid<BattleTarget3D> } = {};
    private _targetMinCellX: number[] = [];
    private _targetMaxCellX: number[] = [];
    private _targetMinCellZ: number[] = [];
    private _targetMaxCellZ: number[] = [];
    private _activeBulletTargetTypeCounts: { [groupId: string]: number } = {};
    private _wallGrid: CollisionGrid<WallObstacleRange> = createCollisionGrid<WallObstacleRange>();
    private _wallObstacles: WallObstacleRange[] = [];
    private _wallScene: Node | null = null;
    private _nextWallRefreshFrame: number = 0;
    private _gldRootFound: boolean = false;
    private _gldSideCount: number = 0;
    private _gldReadySideCount: number = 0;
    private _nextTargetRuntimeId: number = 0;
    private _targetCheckId: number = 1;
    private _wallCheckId: number = 1;
    private _sceneOptimizationEnabled: boolean = false;

    protected constructor() {
        super();
        // 驱动组件在怪物 lateUpdate 后、子弹批渲染前执行。
        this.ensureRuntimeDriver();
    }

    /** 注册子弹 */
    public registerBullet(bullet: BulletBattle3D): void {
        this.ensureRuntimeDriver();
        const registeredIndex = bullet.collisionListIndex;
        if (registeredIndex >= 0 && this._bullets[registeredIndex] === bullet) {
            return;
        }
        const fallbackIndex = this._bullets.indexOf(bullet);
        if (fallbackIndex !== -1) {
            bullet.collisionListIndex = fallbackIndex;
            return;
        }
        bullet.collisionListIndex = this._bullets.length;
        this._bullets.push(bullet);
        this.addBulletTargetTypes(bullet);
    }

    /** 注销子弹 */
    public unregisterBullet(bullet: BulletBattle3D): void {
        let idx = bullet.collisionListIndex;
        if (idx < 0 || this._bullets[idx] !== bullet) {
            idx = this._bullets.indexOf(bullet);
        }
        if (idx !== -1) {
            // swap-and-pop，iOS优化
            this.removeBulletAt(idx);
        } else {
            bullet.collisionListIndex = -1;
        }
    }

    /** 注册目标 */
    public registerTarget(target: BattleTarget3D): void {
        this.ensureRuntimeDriver();
        const tag = target.getComponent('ColliderTag') as any;
        if (!tag) return;
        const type: COLLIDE_TYPE = tag.tag;
        if (!this._targetGroups[type]) {
            this._targetGroups[type] = new CollisionTargetGroup(type);
        }
        if (this._targetGroups[type].targets.indexOf(target) !== -1) {
            return;
        }
        this.ensureTargetRuntimeId(target);
        this._targetGroups[type].targets.push(target);
        this.registerLockableTarget(type, target);
    }

    /** 注销目标 */
    public unregisterTarget(target: BattleTarget3D): void {
        const tag = target.getComponent('ColliderTag') as any;
        if (!tag) return;
        const type: COLLIDE_TYPE = tag.tag;
        const group = this._targetGroups[type];
        if (!group) return;
        const idx = group.targets.indexOf(target);
        if (idx !== -1) {
            // swap-and-pop
            group.targets[idx] = group.targets[group.targets.length - 1];
            group.targets.pop();
        }
        this.unregisterLockableTarget(type, target);
    }

    public clearBullets(): void {
        while (this._bullets.length > 0) {
            const bullet = this._bullets[this._bullets.length - 1];
            if (!bullet) {
                this._bullets.pop();
                continue;
            }
            bullet.forceRecycle();
            if (this._bullets[this._bullets.length - 1] === bullet) {
                this.removeBulletAt(this._bullets.length - 1);
            }
        }
    }

    public getNearestTarget(fromPos: Vec3, targetTags: COLLIDE_TYPE[] = []): BattleTarget3D | null {
        let nearest: BattleTarget3D = null;
        let minDistSq = Number.MAX_VALUE;
        const tags = targetTags && targetTags.length > 0 ? targetTags : this.getTargetTypeList();
        for (let ti = 0; ti < tags.length; ti++) {
            const group = this._targetGroups[tags[ti]];
            if (!group) {
                continue;
            }
            for (let i = 0; i < group.targets.length; i++) {
                const target = group.targets[i];
                if (!target || target.isDie || !target.node.active) {
                    continue;
                }
                const hitPos = target.getCollisionWorldPosition(this._tempVec3);
                const dx = hitPos.x - fromPos.x;
                const dy = hitPos.y - fromPos.y;
                const dz = hitPos.z - fromPos.z;
                const distSq = dx * dx + dy * dy + dz * dz;
                if (distSq < minDistSq) {
                    minDistSq = distSq;
                    nearest = target;
                }
            }
        }
        return nearest;
    }

    /** 获取桶索引 */
    public getLockableLalianTarget(fromPos: Vec3, lockWorldX: number, targetTags: COLLIDE_TYPE[] = []): BattleTarget3D | null {
        let nearest: BattleTarget3D = null;
        let minDistSq = Number.MAX_VALUE;
        const tags = targetTags && targetTags.length > 0 ? targetTags : this.getTargetTypeList();
        for (let ti = 0; ti < tags.length; ti++) {
            const targets = this._lockableTargetsByType[tags[ti]];
            if (!targets) {
                continue;
            }
            for (let i = 0; i < targets.length; i++) {
                const target = targets[i];
                if (!target || target.isDie || !target.node.active) {
                    continue;
                }
                const lockChecker = (target as any).canLockBulletFromWorldX;
                if (typeof lockChecker !== 'function' || !lockChecker.call(target, lockWorldX)) {
                    continue;
                }
                const hitNode = target.hitNode;
                if (!hitNode || !hitNode.active || !hitNode.activeInHierarchy) {
                    continue;
                }
                const hitPos = target.getCollisionWorldPosition(this._tempVec3);
                const dx = hitPos.x - fromPos.x;
                const dy = hitPos.y - fromPos.y;
                const dz = hitPos.z - fromPos.z;
                const distSq = dx * dx + dy * dy + dz * dz;
                if (distSq < minDistSq) {
                    minDistSq = distSq;
                    nearest = target;
                }
            }
        }
        return nearest;
    }

    private getGridCell(value: number): number {
        return Math.floor(value / this._gridCellSize);
    }

    /** 每帧碰撞检测 */
    public update(dt: number): void {
        this._sceneOptimizationEnabled = director.getScene()?.name === BulletMonsterCollisionManager.OPTIMIZED_SCENE_NAME;
        if (this._bullets.length === 0) {
            this.clearFrameBuckets();
            return;
        }
        this.ensureWallObstacles();
        // 1. 清空桶数组（只重置length=0，不释放内存）
        this.clearFrameBuckets();

        // Build sparse X/Z cells only for target types used by active bullets.
        for (const typeStr in this._targetGroups) {
            if ((this._activeBulletTargetTypeCounts[typeStr] ?? 0) <= 0) {
                continue;
            }
            const group = this._targetGroups[typeStr];
            let targetGrid = this._targetGrids[typeStr];
            if (!targetGrid) {
                targetGrid = this._targetGrids[typeStr] = createCollisionGrid<BattleTarget3D>();
            }
            this.buildTargetGrid(group, targetGrid);
        }

        // 生命周期、移动和碰撞在同一活动子弹循环内完成。
        const renderFrame = director.getTotalFrames();
        for (let bi = this._bullets.length - 1; bi >= 0; bi--) {
            const bullet = this._bullets[bi];
            if (!bullet || !bullet.isValid) {
                bullet?.batchRenderer?.unregisterBullet(bullet);
                this.removeBulletAt(bi);
                continue;
            }
            if (!bullet.node.active) {
                bullet.batchRenderer?.unregisterBullet(bullet);
                this.removeBulletAt(bi);
                continue;
            }
            if (!bullet.stepRuntime(dt)) {
                continue;
            }

            const currentPos = bullet.node.worldPosition;
            const bx = currentPos.x;
            const bz = currentPos.z;
            const prevPos = bullet.getPreviousWorldPosition(this._tempBulletPrevPos);
            const prevX = prevPos.x;
            const prevZ = prevPos.z;
            const bHalfX = bullet.collisionHalfX;
            const bHalfZ = bullet.collisionHalfZ;
            const sweptMinX = Math.min(prevX, bx) - bHalfX;
            const sweptMaxX = Math.max(prevX, bx) + bHalfX;
            const sweptMinZ = Math.min(prevZ, bz) - bHalfZ;
            const sweptMaxZ = Math.max(prevZ, bz) + bHalfZ;
            const minCellX = this.getGridCell(sweptMinX);
            const maxCellX = this.getGridCell(sweptMaxX);
            const minCellZ = this.getGridCell(sweptMinZ);
            const maxCellZ = this.getGridCell(sweptMaxZ);
            if (this.tryRecycleBulletByWallHit(
                bullet,
                prevX,
                prevZ,
                bx,
                bz,
                bHalfX,
                bHalfZ,
                minCellX,
                maxCellX,
                minCellZ,
                maxCellZ,
            )) {
                continue;
            }

            const targetTags = bullet.attackTargetTag;
            for (let ti = 0; ti < targetTags.length; ti++) {
                const typeStr = String(targetTags[ti]);
                const targetGrid = this._targetGrids[typeStr];
                if (!targetGrid?.active) {
                    continue;
                }
                this.checkBulletTargetGrid(
                    bullet,
                    targetGrid,
                    prevX,
                    prevZ,
                    bx,
                    bz,
                    bHalfX,
                    bHalfZ,
                    minCellX,
                    maxCellX,
                    minCellZ,
                    maxCellZ,
                );
            }
            BulletBatchRenderer.writeBullet(bullet, renderFrame);
        }
        this._frameCount++;
    }

    private _frameCount: number = 0;

    private isSceneOptimizationEnabled(): boolean {
        return this._sceneOptimizationEnabled;
    }

    private ensureRuntimeDriver(): void {
        const scene = director.getScene();
        if (!scene) {
            return;
        }
        let node = scene.getChildByName(BulletMonsterCollisionManager.RUNTIME_DRIVER_NODE_NAME);
        if (!node) {
            node = new Node(BulletMonsterCollisionManager.RUNTIME_DRIVER_NODE_NAME);
            scene.addChild(node);
        }
        if (!node.getComponent(BulletRuntimeDriver)) {
            node.addComponent(BulletRuntimeDriver);
        }
    }

    private removeBulletAt(index: number): void {
        const lastIndex = this._bullets.length - 1;
        if (index < 0 || index > lastIndex) {
            return;
        }
        const bullet = this._bullets[index];
        const lastBullet = this._bullets[lastIndex];
        if (bullet) {
            this.removeBulletTargetTypes(bullet);
        }
        if (index !== lastIndex) {
            this._bullets[index] = lastBullet;
            if (lastBullet) {
                lastBullet.collisionListIndex = index;
            }
        }
        this._bullets.pop();
        if (bullet) {
            bullet.collisionListIndex = -1;
        }
    }

    private addBulletTargetTypes(bullet: BulletBattle3D): void {
        const targetTags = bullet.attackTargetTag;
        for (let i = 0; i < targetTags.length; i++) {
            const typeStr = String(targetTags[i]);
            this._activeBulletTargetTypeCounts[typeStr] = (this._activeBulletTargetTypeCounts[typeStr] ?? 0) + 1;
        }
    }

    private removeBulletTargetTypes(bullet: BulletBattle3D): void {
        const targetTags = bullet.attackTargetTag;
        for (let i = 0; i < targetTags.length; i++) {
            const typeStr = String(targetTags[i]);
            const nextCount = (this._activeBulletTargetTypeCounts[typeStr] ?? 0) - 1;
            this._activeBulletTargetTypeCounts[typeStr] = nextCount > 0 ? nextCount : 0;
        }
    }

    private registerLockableTarget(type: COLLIDE_TYPE, target: BattleTarget3D): void {
        if (typeof (target as any).canLockBulletFromWorldX !== 'function') {
            return;
        }
        let targets = this._lockableTargetsByType[type];
        if (!targets) {
            targets = this._lockableTargetsByType[type] = [];
        }
        if (targets.indexOf(target) === -1) {
            targets.push(target);
        }
    }

    private unregisterLockableTarget(type: COLLIDE_TYPE, target: BattleTarget3D): void {
        const targets = this._lockableTargetsByType[type];
        if (!targets) {
            return;
        }
        const index = targets.indexOf(target);
        if (index === -1) {
            return;
        }
        targets[index] = targets[targets.length - 1];
        targets.pop();
    }

    private getTargetFrameData(target: BattleTarget3D): CollisionFrameData {
        if (this.isSceneOptimizationEnabled() && target.cacheCollisionBoundsPerFrame) {
            const cached = this._staticTargetFrameData.get(target);
            if (cached?.frame === this._frameCount) {
                return cached;
            }
            const pos = target.getCollisionWorldPosition(this._tempVec3);
            const data = cached ?? { frame: -1, x: 0, z: 0, halfX: 0, halfZ: 0 };
            this.writeTargetFrameData(data, target, pos);
            this._staticTargetFrameData.set(target, data);
            return data;
        }
        const pos = target.getCollisionWorldPosition(this._tempVec3);
        this.writeTargetFrameData(this._tempTargetFrameData, target, pos);
        return this._tempTargetFrameData;
    }

    private writeTargetFrameData(data: CollisionFrameData, target: BattleTarget3D, pos: Vec3): void {
        data.frame = this._frameCount;
        data.x = pos.x;
        data.z = pos.z;
        data.halfX = target.collisionHalfX;
        data.halfZ = target.collisionHalfZ;
    }

    private buildTargetGrid(group: CollisionTargetGroup, grid: CollisionGrid<BattleTarget3D>): void {
        let gridMinCellX = Number.POSITIVE_INFINITY;
        let gridMaxCellX = Number.NEGATIVE_INFINITY;
        let gridMinCellZ = Number.POSITIVE_INFINITY;
        let gridMaxCellZ = Number.NEGATIVE_INFINITY;

        for (let i = group.targets.length - 1; i >= 0; i--) {
            const target = group.targets[i];
            if (!target || target.isDie || !target.node.active) {
                if (target) {
                    this.unregisterLockableTarget(group.targetType, target);
                }
                group.targets[i] = group.targets[group.targets.length - 1];
                group.targets.pop();
                continue;
            }

            const targetId = this.ensureTargetRuntimeId(target);
            const targetData = this.getTargetFrameData(target);
            const minCellX = this.getGridCell(targetData.x - targetData.halfX);
            const maxCellX = this.getGridCell(targetData.x + targetData.halfX);
            const minCellZ = this.getGridCell(targetData.z - targetData.halfZ);
            const maxCellZ = this.getGridCell(targetData.z + targetData.halfZ);
            this._targetMinCellX[targetId] = minCellX;
            this._targetMaxCellX[targetId] = maxCellX;
            this._targetMinCellZ[targetId] = minCellZ;
            this._targetMaxCellZ[targetId] = maxCellZ;
            gridMinCellX = Math.min(gridMinCellX, minCellX);
            gridMaxCellX = Math.max(gridMaxCellX, maxCellX);
            gridMinCellZ = Math.min(gridMinCellZ, minCellZ);
            gridMaxCellZ = Math.max(gridMaxCellZ, maxCellZ);
        }

        if (gridMinCellX === Number.POSITIVE_INFINITY) {
            return;
        }

        this.configureGrid(grid, gridMinCellX, gridMaxCellX, gridMinCellZ, gridMaxCellZ);
        for (let i = 0; i < group.targets.length; i++) {
            const target = group.targets[i];
            const targetId = target.collisionRuntimeId;
            const minCellX = this._targetMinCellX[targetId];
            const maxCellX = this._targetMaxCellX[targetId];
            const minCellZ = this._targetMinCellZ[targetId];
            const maxCellZ = this._targetMaxCellZ[targetId];
            for (let cellZ = minCellZ; cellZ <= maxCellZ; cellZ++) {
                const rowStart = (cellZ - grid.minCellZ) * grid.xCellCount;
                for (let cellX = minCellX; cellX <= maxCellX; cellX++) {
                    const cellIndex = rowStart + cellX - grid.minCellX;
                    this.addGridEntry(grid, cellIndex, target);
                }
            }
        }
    }

    private checkBulletTargetGrid(
        bullet: BulletBattle3D,
        grid: CollisionGrid<BattleTarget3D>,
        prevX: number,
        prevZ: number,
        curX: number,
        curZ: number,
        bHalfX: number,
        bHalfZ: number,
        minCellX: number,
        maxCellX: number,
        minCellZ: number,
        maxCellZ: number,
    ): void {
        const queryMinCellX = Math.max(minCellX, grid.minCellX);
        const queryMaxCellX = Math.min(maxCellX, grid.minCellX + grid.xCellCount - 1);
        const queryMinCellZ = Math.max(minCellZ, grid.minCellZ);
        const queryMaxCellZ = Math.min(maxCellZ, grid.minCellZ + grid.zCellCount - 1);
        if (queryMinCellX > queryMaxCellX || queryMinCellZ > queryMaxCellZ) {
            return;
        }

        const targetCheckId = this.nextTargetCheckId();
        for (let cellZ = queryMinCellZ; cellZ <= queryMaxCellZ && bullet.node.active; cellZ++) {
            const rowStart = (cellZ - grid.minCellZ) * grid.xCellCount;
            const startIndex = rowStart + queryMinCellX - grid.minCellX;
            const endIndex = rowStart + queryMaxCellX - grid.minCellX;
            for (let cellIndex = startIndex; cellIndex <= endIndex && bullet.node.active; cellIndex++) {
                const bucketTargets = grid.buckets[cellIndex];
                if (!bucketTargets) {
                    continue;
                }
                for (let i = 0; i < bucketTargets.length && bullet.node.active; i++) {
                    const target = bucketTargets[i];
                    const targetId = target.collisionRuntimeId;
                    if (target.isDie || targetId < 0 || this._targetCheckedStamps[targetId] === targetCheckId) {
                        continue;
                    }
                    this._targetCheckedStamps[targetId] = targetCheckId;
                    const targetData = this.getTargetFrameData(target);
                    if (this.isSweptBulletHit(
                        prevX,
                        prevZ,
                        curX,
                        curZ,
                        bHalfX,
                        bHalfZ,
                        targetData.x,
                        targetData.z,
                        targetData.halfX,
                        targetData.halfZ,
                    )) {
                        bullet.onHitTarget(target);
                    }
                }
            }
        }
    }

    private ensureTargetRuntimeId(target: BattleTarget3D): number {
        if (target.collisionRuntimeId < 0) {
            target.collisionRuntimeId = this._nextTargetRuntimeId++;
        } else if (target.collisionRuntimeId >= this._nextTargetRuntimeId) {
            this._nextTargetRuntimeId = target.collisionRuntimeId + 1;
        }
        return target.collisionRuntimeId;
    }

    private nextTargetCheckId(): number {
        const checkId = this._targetCheckId++;
        if (this._targetCheckId > 0x7fffffff) {
            this._targetCheckedStamps.fill(0);
            this._targetCheckId = 1;
        }
        return checkId;
    }

    private configureGrid<T>(grid: CollisionGrid<T>, minCellX: number, maxCellX: number, minCellZ: number, maxCellZ: number): void {
        grid.minCellX = minCellX;
        grid.minCellZ = minCellZ;
        grid.xCellCount = maxCellX - minCellX + 1;
        grid.zCellCount = maxCellZ - minCellZ + 1;
        grid.active = true;
    }

    private addGridEntry<T>(grid: CollisionGrid<T>, cellIndex: number, entry: T): void {
        let bucket = grid.buckets[cellIndex];
        if (!bucket) {
            bucket = grid.buckets[cellIndex] = [];
        }
        if (!grid.usedCellFlags[cellIndex]) {
            grid.usedCellFlags[cellIndex] = true;
            grid.usedCellIndices.push(cellIndex);
        }
        bucket.push(entry);
    }

    private clearGrid<T>(grid: CollisionGrid<T>): void {
        const usedIndices = grid.usedCellIndices;
        for (let i = 0; i < usedIndices.length; i++) {
            const cellIndex = usedIndices[i];
            grid.buckets[cellIndex].length = 0;
            grid.usedCellFlags[cellIndex] = false;
        }
        usedIndices.length = 0;
        grid.active = false;
        grid.xCellCount = 0;
        grid.zCellCount = 0;
    }

    private clearFrameBuckets(): void {
        for (const groupId in this._targetGrids) {
            this.clearGrid(this._targetGrids[groupId]);
        }
    }

    private ensureWallObstacles(): void {
        const scene = director.getScene();
        if (!scene) {
            this.clearWallObstacles();
            this._wallScene = null;
            return;
        }
        if (this._wallScene !== scene || this._frameCount >= this._nextWallRefreshFrame) {
            this.rebuildWallObstacles(scene);
            this._wallScene = scene;
            this._nextWallRefreshFrame = this.isSceneOptimizationEnabled()
                ? (this.isGldWallScanComplete() ? Number.MAX_SAFE_INTEGER : this._frameCount + 1)
                : (this._wallObstacles.length > 0 ? Number.MAX_SAFE_INTEGER : this._frameCount + 1);
        }
    }

    /** 动态创建或移除 SM_gelidun_* 墙体后调用，使下次碰撞帧重新扫描。 */
    public markWallObstaclesDirty(): void {
        this._nextWallRefreshFrame = 0;
    }

    private clearWallObstacles(): void {
        this._wallObstacles.length = 0;
        this.clearGrid(this._wallGrid);
        this._wallCheckedStamps.length = 0;
        this._wallCheckId = 1;
    }

    private rebuildWallObstacles(scene: Node): void {
        this.clearWallObstacles();
        this._gldRootFound = false;
        this._gldSideCount = 0;
        this._gldReadySideCount = 0;
        this.collectWallObstacles(scene);
        this.buildWallGrid();
    }

    private isGldWallScanComplete(): boolean {
        return !this._gldRootFound || (this._gldSideCount === 2 && this._gldReadySideCount === 2);
    }

    private collectWallObstacles(node: Node): void {
        if (!node) {
            return;
        }
        if (this.isSceneOptimizationEnabled() && node.name === 'gld') {
            this._gldRootFound = true;
            this.collectGldSideObstacle(node, 'left');
            this.collectGldSideObstacle(node, 'right');
            return;
        }
        if (node.name.indexOf('SM_gelidun_') === 0) {
            const obstacle: WallObstacleRange = {
                runtimeId: -1,
                node,
                renderers: [],
                minX: 0,
                maxX: 0,
                minZ: 0,
                maxZ: 0,
            };
            this.collectMeshRenderers(node, obstacle.renderers);
            if (this.updateWallObstacleBounds(obstacle)) {
                obstacle.runtimeId = this._wallObstacles.length;
                this._wallObstacles.push(obstacle);
            }
            return;
        }
        for (let i = 0; i < node.children.length; i++) {
            this.collectWallObstacles(node.children[i]);
        }
    }

    /** Game_3D-002 中将 gld 左右两侧分别聚合为一个虚拟 AABB。 */
    private collectGldSideObstacle(gld: Node, sideName: 'left' | 'right'): void {
        const side = gld.children.find(child => child.name === sideName);
        if (!side) {
            return;
        }
        this._gldSideCount++;
        const obstacle: WallObstacleRange = {
            runtimeId: -1,
            node: side,
            renderers: [],
            minX: 0,
            maxX: 0,
            minZ: 0,
            maxZ: 0,
        };
        this.collectGelidunMeshRenderers(side, obstacle.renderers);
        if (this.updateWallObstacleBounds(obstacle, true)) {
            obstacle.runtimeId = this._wallObstacles.length;
            this._wallObstacles.push(obstacle);
            this._gldReadySideCount++;
        }
    }

    private collectGelidunMeshRenderers(node: Node, out: MeshRenderer[], insideGelidun: boolean = false): void {
        const isGelidun = insideGelidun || node.name.indexOf('SM_gelidun_') === 0;
        if (isGelidun) {
            const renderer = node.getComponent(MeshRenderer);
            if (renderer) {
                out.push(renderer);
            }
        }
        for (let i = 0; i < node.children.length; i++) {
            this.collectGelidunMeshRenderers(node.children[i], out, isGelidun);
        }
    }

    private collectMeshRenderers(node: Node, out: MeshRenderer[]): void {
        const renderer = node.getComponent(MeshRenderer);
        if (renderer) {
            out.push(renderer);
        }
        for (let i = 0; i < node.children.length; i++) {
            this.collectMeshRenderers(node.children[i], out);
        }
    }

    private updateWallObstacleBounds(obstacle: WallObstacleRange, requireAllRenderers: boolean = false): boolean {
        if (!requireAllRenderers && !obstacle.node.activeInHierarchy) {
            return false;
        }
        let minX = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let minZ = Number.POSITIVE_INFINITY;
        let maxZ = Number.NEGATIVE_INFINITY;
        let found = false;
        let validRendererCount = 0;
        for (let i = 0; i < obstacle.renderers.length; i++) {
            const renderer = obstacle.renderers[i];
            if (!renderer || (!requireAllRenderers && !renderer.node.activeInHierarchy)) {
                continue;
            }
            const worldBounds = (renderer as any)?.model?.worldBounds;
            const center = worldBounds?.center;
            const halfExtents = worldBounds?.halfExtents;
            if (!center || !halfExtents) {
                continue;
            }
            validRendererCount++;
            minX = Math.min(minX, center.x - halfExtents.x);
            maxX = Math.max(maxX, center.x + halfExtents.x);
            minZ = Math.min(minZ, center.z - halfExtents.z);
            maxZ = Math.max(maxZ, center.z + halfExtents.z);
            found = true;
        }
        if (!found || (requireAllRenderers && validRendererCount !== obstacle.renderers.length)) {
            return false;
        }
        obstacle.minX = minX;
        obstacle.maxX = maxX;
        obstacle.minZ = minZ;
        obstacle.maxZ = maxZ;
        return true;
    }

    private buildWallGrid(): void {
        if (this._wallObstacles.length <= 0) {
            return;
        }

        let gridMinCellX = Number.POSITIVE_INFINITY;
        let gridMaxCellX = Number.NEGATIVE_INFINITY;
        let gridMinCellZ = Number.POSITIVE_INFINITY;
        let gridMaxCellZ = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < this._wallObstacles.length; i++) {
            const obstacle = this._wallObstacles[i];
            gridMinCellX = Math.min(gridMinCellX, this.getGridCell(obstacle.minX));
            gridMaxCellX = Math.max(gridMaxCellX, this.getGridCell(obstacle.maxX));
            gridMinCellZ = Math.min(gridMinCellZ, this.getGridCell(obstacle.minZ));
            gridMaxCellZ = Math.max(gridMaxCellZ, this.getGridCell(obstacle.maxZ));
        }
        this.configureGrid(this._wallGrid, gridMinCellX, gridMaxCellX, gridMinCellZ, gridMaxCellZ);

        for (let i = 0; i < this._wallObstacles.length; i++) {
            const obstacle = this._wallObstacles[i];
            const minCellX = this.getGridCell(obstacle.minX);
            const maxCellX = this.getGridCell(obstacle.maxX);
            const minCellZ = this.getGridCell(obstacle.minZ);
            const maxCellZ = this.getGridCell(obstacle.maxZ);
            for (let cellZ = minCellZ; cellZ <= maxCellZ; cellZ++) {
                const rowStart = (cellZ - this._wallGrid.minCellZ) * this._wallGrid.xCellCount;
                for (let cellX = minCellX; cellX <= maxCellX; cellX++) {
                    const cellIndex = rowStart + cellX - this._wallGrid.minCellX;
                    this.addGridEntry(this._wallGrid, cellIndex, obstacle);
                }
            }
        }
    }

    private nextWallCheckId(): number {
        const checkId = this._wallCheckId++;
        if (this._wallCheckId > 0x7fffffff) {
            this._wallCheckedStamps.fill(0);
            this._wallCheckId = 1;
        }
        return checkId;
    }

    private tryRecycleBulletByWallHit(
        bullet: BulletBattle3D,
        prevX: number,
        prevZ: number,
        curX: number,
        curZ: number,
        bHalfX: number,
        bHalfZ: number,
        minCellX: number,
        maxCellX: number,
        minCellZ: number,
        maxCellZ: number,
    ): boolean {
        const grid = this._wallGrid;
        if (!grid.active) {
            return false;
        }

        const queryMinCellX = Math.max(minCellX, grid.minCellX);
        const queryMaxCellX = Math.min(maxCellX, grid.minCellX + grid.xCellCount - 1);
        const queryMinCellZ = Math.max(minCellZ, grid.minCellZ);
        const queryMaxCellZ = Math.min(maxCellZ, grid.minCellZ + grid.zCellCount - 1);
        if (queryMinCellX > queryMaxCellX || queryMinCellZ > queryMaxCellZ) {
            return false;
        }

        const wallCheckId = this.nextWallCheckId();
        for (let cellZ = queryMinCellZ; cellZ <= queryMaxCellZ; cellZ++) {
            const rowStart = (cellZ - grid.minCellZ) * grid.xCellCount;
            const startIndex = rowStart + queryMinCellX - grid.minCellX;
            const endIndex = rowStart + queryMaxCellX - grid.minCellX;
            for (let cellIndex = startIndex; cellIndex <= endIndex; cellIndex++) {
                const walls = grid.buckets[cellIndex];
                if (!walls) {
                    continue;
                }
                for (let i = 0; i < walls.length; i++) {
                    const wall = walls[i];
                    if (!wall || this._wallCheckedStamps[wall.runtimeId] === wallCheckId) {
                        continue;
                    }
                    this._wallCheckedStamps[wall.runtimeId] = wallCheckId;
                    if (!wall.node.activeInHierarchy) {
                        continue;
                    }
                    if (this.isSweptBulletHitBounds(prevX, prevZ, curX, curZ, bHalfX, bHalfZ, wall.minX, wall.maxX, wall.minZ, wall.maxZ)) {
                        bullet.forceRecycle();
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private isSweptBulletHit(prevX: number, prevZ: number, curX: number, curZ: number, bHalfX: number, bHalfZ: number, targetX: number, targetZ: number, targetHalfX: number, targetHalfZ: number): boolean {
        return this.isSweptBulletHitBounds(
            prevX,
            prevZ,
            curX,
            curZ,
            bHalfX,
            bHalfZ,
            targetX - targetHalfX,
            targetX + targetHalfX,
            targetZ - targetHalfZ,
            targetZ + targetHalfZ,
        );
    }

    private isSweptBulletHitBounds(prevX: number, prevZ: number, curX: number, curZ: number, expandHalfX: number, expandHalfZ: number, minX: number, maxX: number, minZ: number, maxZ: number): boolean {
        minX -= expandHalfX;
        maxX += expandHalfX;
        minZ -= expandHalfZ;
        maxZ += expandHalfZ;
        const dx = curX - prevX;
        const dz = curZ - prevZ;
        let enter = 0;
        let exit = 1;

        if (Math.abs(dx) <= 0.000001) {
            if (prevX < minX || prevX > maxX) {
                return false;
            }
        } else {
            let t1 = (minX - prevX) / dx;
            let t2 = (maxX - prevX) / dx;
            if (t1 > t2) {
                const temp = t1;
                t1 = t2;
                t2 = temp;
            }
            if (t1 > enter) {
                enter = t1;
            }
            if (t2 < exit) {
                exit = t2;
            }
            if (enter > exit) {
                return false;
            }
        }

        if (Math.abs(dz) <= 0.000001) {
            return prevZ >= minZ && prevZ <= maxZ;
        }
        let t1 = (minZ - prevZ) / dz;
        let t2 = (maxZ - prevZ) / dz;
        if (t1 > t2) {
            const temp = t1;
            t1 = t2;
            t2 = temp;
        }
        if (t1 > enter) {
            enter = t1;
        }
        if (t2 < exit) {
            exit = t2;
        }
        return enter <= exit;
    }

    private getTargetTypeList(): COLLIDE_TYPE[] {
        const list: COLLIDE_TYPE[] = [];
        for (const typeStr in this._targetGroups) {
            list.push(Number(typeStr) as COLLIDE_TYPE);
        }
        return list;
    }
}

interface WallObstacleRange {
    runtimeId: number;
    node: Node;
    renderers: MeshRenderer[];
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
}
