import { CCFloat, _decorator, Vec3, director, Director, MeshRenderer, Node } from 'cc';
import Singleton from 'db://assets/Script/Base/Singleton';
import { COLLIDE_TYPE } from './CollectBattleTarger/ColliderTag';
import BulletBattle3D from './Battle3D/Bullet/BulletBattle3D';
import { BattleTarget3D } from './BattleTarger/BattleTarget3D';

const { ccclass, property } = _decorator;

/**
 * 碰撞目标组 - 按 COLLIDE_TYPE 分组管理目标
 * 复用现有 ColliderTag.tag + BulletBattle3D.attackTargetTag 的匹配机制
 */
class CollisionTargetGroup {
    /** 对应 COLLIDE_TYPE 枚举值 */
    public targetType: COLLIDE_TYPE;
    /** 该组目标的x范围，用于预过滤 */
    public xMin: number = -9999;
    public xMax: number = 9999;
    /** 该组所有活跃目标 */
    public targets: BattleTarget3D[] = [];

    constructor(targetType: COLLIDE_TYPE) {
        this.targetType = targetType;
    }

    /** 更新x范围（添加/移除目标时调用） */
    public updateXRange(): void {
        let minX = 9999;
        let maxX = -9999;
        for (let i = 0; i < this.targets.length; i++) {
            const t = this.targets[i];
            if (t.isDie) continue;
            const x = t.getCollisionWorldPosition().x;
            if (x < minX) minX = x - t.collisionHalfX;
            if (x > maxX) maxX = x + t.collisionHalfX;
        }
        // 扩展半个碰撞体宽度作为预过滤容差
        this.xMin = minX - 0.5;
        this.xMax = maxX + 0.5;
    }
}

/**
 * 自定义碰撞管理器 - 替代物理引擎进行子弹与目标的碰撞检测
 * iOS优化：用数组而非Map，预分配Vec3，AABB判定，零GC
 */
@ccclass('BulletMonsterCollisionManager')
export default class BulletMonsterCollisionManager extends Singleton {

    public static get instance() {
        return this.getInstance<BulletMonsterCollisionManager>();
    }

    /** z轴分桶桶宽 */
    private _bucketSize: number = 0.8;

    /** z轴最小值（用于计算桶索引） */
    private _zMin: number = -10;

    /** 桶数量 */
    private _bucketCount: number = 100;

    /** 所有活跃子弹 */
    private _bullets: BulletBattle3D[] = [];

    /** 目标组，按 COLLIDE_TYPE 索引存储 */
    private _targetGroups: { [key: number]: CollisionTargetGroup } = {};

    /** 预分配临时Vec3，避免每帧new */
    private _tempVec3: Vec3 = new Vec3();
    private _tempBulletPrevPos: Vec3 = new Vec3();
    private _targetCheckedStamp: WeakMap<BattleTarget3D, number> = new WeakMap();
    private _wallCheckedStamp: WeakMap<WallObstacleRange, number> = new WeakMap();

    /** 子弹桶 - 每帧重建 */
    private _bulletBuckets: BulletBattle3D[][] = [];

    /** 目标桶 - 按组ID+桶索引存储 */
    private _targetBuckets: { [groupId: string]: BattleTarget3D[][] } = {};
    private _wallBuckets: WallObstacleRange[][] = [];
    private _wallObstacles: WallObstacleRange[] = [];
    private _wallScene: Node | null = null;
    private _nextWallRefreshFrame: number = 0;
    private _targetCheckId: number = 1;
    private _wallCheckId: number = 1;

    private _directorCallback: (dt: number) => void;

    protected constructor() {
        super();
        // 预分配桶数组
        for (let i = 0; i < this._bucketCount; i++) {
            this._bulletBuckets[i] = [];
            this._wallBuckets[i] = [];
        }
        // 使用 director 的每帧回调驱动碰撞检测
        this._directorCallback = (dt: number) => {
            this.update(dt);
        };
        director.on(Director.EVENT_AFTER_UPDATE, this._directorCallback);
    }

    /** 注册子弹 */
    public registerBullet(bullet: BulletBattle3D): void {
        if (this._bullets.indexOf(bullet) !== -1) {
            return;
        }
        this._bullets.push(bullet);
    }

    /** 注销子弹 */
    public unregisterBullet(bullet: BulletBattle3D): void {
        const idx = this._bullets.indexOf(bullet);
        if (idx !== -1) {
            // swap-and-pop，iOS优化
            this._bullets[idx] = this._bullets[this._bullets.length - 1];
            this._bullets.pop();
        }
    }

    /** 注册目标 */
    public registerTarget(target: BattleTarget3D): void {
        const tag = target.getComponent('ColliderTag') as any;
        if (!tag) return;
        const type: COLLIDE_TYPE = tag.tag;
        if (!this._targetGroups[type]) {
            this._targetGroups[type] = new CollisionTargetGroup(type);
        }
        if (this._targetGroups[type].targets.indexOf(target) !== -1) {
            return;
        }
        this._targetGroups[type].targets.push(target);
        this._targetGroups[type].updateXRange();
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
        group.updateXRange();
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
                this._bullets.pop();
            }
        }
        for (let i = 0; i < this._bucketCount; i++) {
            this._bulletBuckets[i].length = 0;
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
            const group = this._targetGroups[tags[ti]];
            if (!group) {
                continue;
            }
            for (let i = 0; i < group.targets.length; i++) {
                const target = group.targets[i];
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

    private _getBucketIdx(z: number): number {
        const idx = ((z - this._zMin) / this._bucketSize) | 0;
        if (idx < 0) return 0;
        if (idx >= this._bucketCount) return this._bucketCount - 1;
        return idx;
    }

    /** 每帧碰撞检测 */
    public update(dt: number): void {
        this.ensureWallObstacles();
        // 1. 清空桶数组（只重置length=0，不释放内存）
        for (let i = 0; i < this._bucketCount; i++) {
            this._bulletBuckets[i].length = 0;
        }

        // 清空目标桶
        for (const groupId in this._targetBuckets) {
            for (let i = 0; i < this._bucketCount; i++) {
                if (this._targetBuckets[groupId][i]) {
                    this._targetBuckets[groupId][i].length = 0;
                }
            }
        }

        // 2. 将子弹放入桶
        for (let i = this._bullets.length - 1; i >= 0; i--) {
            const bullet = this._bullets[i];
            if (!bullet.node.active) {
                // 子弹已回收，移除
                this._bullets[i] = this._bullets[this._bullets.length - 1];
                this._bullets.pop();
                continue;
            }
            const z = bullet.node.worldPosition.z;
            const bIdx = this._getBucketIdx(z);
            this._bulletBuckets[bIdx].push(bullet);
        }

        // 3. 将目标放入桶（按COLLIDE_TYPE分组）
        for (const typeStr in this._targetGroups) {
            const group = this._targetGroups[typeStr];
            // 确保目标桶存在
            if (!this._targetBuckets[typeStr]) {
                this._targetBuckets[typeStr] = [];
                for (let i = 0; i < this._bucketCount; i++) {
                    this._targetBuckets[typeStr][i] = [];
                }
            }
            const tBuckets = this._targetBuckets[typeStr];

            for (let i = group.targets.length - 1; i >= 0; i--) {
                const target = group.targets[i];
                if (target.isDie || !target.node.active) {
                    // 已死亡目标，移除
                    group.targets[i] = group.targets[group.targets.length - 1];
                    group.targets.pop();
                    continue;
                }
                const z = target.getCollisionWorldPosition(this._tempVec3).z;
                const bIdx = this._getBucketIdx(z);
                tBuckets[bIdx].push(target);
                // 放入相邻桶防止边界遗漏
                if (bIdx > 0) tBuckets[bIdx - 1].push(target);
                if (bIdx < this._bucketCount - 1) tBuckets[bIdx + 1].push(target);
            }
        }

        // 4. 逐桶碰撞检测
        for (let bIdx = 0; bIdx < this._bucketCount; bIdx++) {
            const bucketBullets = this._bulletBuckets[bIdx];
            if (bucketBullets.length === 0) continue;

            for (let bi = 0; bi < bucketBullets.length; bi++) {
                const bullet = bucketBullets[bi];
                if (!bullet.node.active) continue;

                const bx = bullet.node.worldPosition.x;
                const bz = bullet.node.worldPosition.z;
                const prevPos = bullet.getPreviousWorldPosition(this._tempBulletPrevPos);
                const prevX = prevPos.x;
                const prevZ = prevPos.z;
                const bHalfX = bullet.collisionHalfX;
                const bHalfZ = bullet.collisionHalfZ;
                const sweptMinX = Math.min(prevX, bx) - bHalfX;
                const sweptMaxX = Math.max(prevX, bx) + bHalfX;
                const minBucketIdx = this._getBucketIdx(Math.min(prevZ, bz) - bHalfZ);
                const maxBucketIdx = this._getBucketIdx(Math.max(prevZ, bz) + bHalfZ);
                if (this.tryRecycleBulletByWallHit(bullet, prevX, prevZ, bx, bz, bHalfX, bHalfZ, sweptMinX, sweptMaxX, minBucketIdx, maxBucketIdx)) {
                    continue;
                }

                // 遍历子弹的 attackTargetTag
                const targetTags = bullet.attackTargetTag;
                for (let ti = 0; ti < targetTags.length; ti++) {
                    const typeStr = String(targetTags[ti]);
                    const group = this._targetGroups[typeStr];
                    if (!group) continue;

                    // x范围预过滤
                    if (sweptMaxX < group.xMin || sweptMinX > group.xMax) continue;

                    const tBuckets = this._targetBuckets[typeStr];
                    if (!tBuckets) continue;
                    const targetCheckId = this._targetCheckId++;
                    for (let checkBucketIdx = minBucketIdx; checkBucketIdx <= maxBucketIdx && bullet.node.active; checkBucketIdx++) {
                        const bucketTargets = tBuckets[checkBucketIdx];
                        if (!bucketTargets) continue;

                        for (let mj = 0; mj < bucketTargets.length && bullet.node.active; mj++) {
                            const target = bucketTargets[mj];
                            if (target.isDie || this._targetCheckedStamp.get(target) === targetCheckId) continue;
                            this._targetCheckedStamp.set(target, targetCheckId);

                            // AABB碰撞判定
                            const targetPos = target.getCollisionWorldPosition(this._tempVec3);
                            const tx = targetPos.x;
                            const tz = targetPos.z;
                            const tHalfX = target.collisionHalfX;
                            const tHalfZ = target.collisionHalfZ;

                            if (this.isSweptBulletHit(prevX, prevZ, bx, bz, bHalfX, bHalfZ, tx, tz, tHalfX, tHalfZ)) {
                                // 碰撞命中！调用子弹的命中处理（迁移自原 _startCollide）
                                bullet.onHitTarget(target);
                            }
                        }
                    }
                }
            }
        }
        // 5. 更新各组x范围（低频更新即可，每10帧更新一次）
        if (this._frameCount % 10 === 0) {
            for (const typeStr in this._targetGroups) {
                this._targetGroups[typeStr].updateXRange();
            }
        }
        this._frameCount++;
    }

    private _frameCount: number = 0;

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
            this._nextWallRefreshFrame = this._wallObstacles.length > 0 ? Number.MAX_SAFE_INTEGER : this._frameCount + 1;
        }
    }

    private clearWallObstacles(): void {
        this._wallObstacles.length = 0;
        for (let i = 0; i < this._bucketCount; i++) {
            this._wallBuckets[i].length = 0;
        }
    }

    private rebuildWallObstacles(scene: Node): void {
        this.clearWallObstacles();
        this.collectWallObstacles(scene);
    }

    private collectWallObstacles(node: Node): void {
        if (!node) {
            return;
        }
        if (node.name.indexOf('SM_gelidun_') === 0) {
            const obstacle: WallObstacleRange = {
                node,
                renderers: [],
                minX: 0,
                maxX: 0,
                minZ: 0,
                maxZ: 0,
            };
            this.collectMeshRenderers(node, obstacle.renderers);
            if (this.updateWallObstacleBounds(obstacle)) {
                this._wallObstacles.push(obstacle);
                this.addWallObstacleToBuckets(obstacle);
            }
            return;
        }
        for (let i = 0; i < node.children.length; i++) {
            this.collectWallObstacles(node.children[i]);
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

    private updateWallObstacleBounds(obstacle: WallObstacleRange): boolean {
        if (!obstacle.node.activeInHierarchy) {
            return false;
        }
        let minX = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let minZ = Number.POSITIVE_INFINITY;
        let maxZ = Number.NEGATIVE_INFINITY;
        let found = false;
        for (let i = 0; i < obstacle.renderers.length; i++) {
            const renderer = obstacle.renderers[i];
            if (!renderer || !renderer.node.activeInHierarchy) {
                continue;
            }
            const worldBounds = (renderer as any)?.model?.worldBounds;
            const center = worldBounds?.center;
            const halfExtents = worldBounds?.halfExtents;
            if (!center || !halfExtents) {
                continue;
            }
            minX = Math.min(minX, center.x - halfExtents.x);
            maxX = Math.max(maxX, center.x + halfExtents.x);
            minZ = Math.min(minZ, center.z - halfExtents.z);
            maxZ = Math.max(maxZ, center.z + halfExtents.z);
            found = true;
        }
        if (!found) {
            return false;
        }
        obstacle.minX = minX;
        obstacle.maxX = maxX;
        obstacle.minZ = minZ;
        obstacle.maxZ = maxZ;
        return true;
    }

    private addWallObstacleToBuckets(obstacle: WallObstacleRange): void {
        const minIdx = this._getBucketIdx(obstacle.minZ);
        const maxIdx = this._getBucketIdx(obstacle.maxZ);
        for (let i = minIdx; i <= maxIdx; i++) {
            this._wallBuckets[i].push(obstacle);
        }
    }

    private tryRecycleBulletByWallHit(
        bullet: BulletBattle3D,
        prevX: number,
        prevZ: number,
        curX: number,
        curZ: number,
        bHalfX: number,
        bHalfZ: number,
        sweptMinX: number,
        sweptMaxX: number,
        minBucketIdx: number,
        maxBucketIdx: number,
    ): boolean {
        if (this._wallObstacles.length <= 0) {
            return false;
        }
        const wallCheckId = this._wallCheckId++;
        for (let bucketIdx = minBucketIdx; bucketIdx <= maxBucketIdx; bucketIdx++) {
            const walls = this._wallBuckets[bucketIdx];
            if (!walls || walls.length <= 0) {
                continue;
            }
            for (let i = 0; i < walls.length; i++) {
                const wall = walls[i];
                if (!wall || this._wallCheckedStamp.get(wall) === wallCheckId) {
                    continue;
                }
                this._wallCheckedStamp.set(wall, wallCheckId);
                if (!wall.node.activeInHierarchy) {
                    continue;
                }
                if (sweptMaxX < wall.minX || sweptMinX > wall.maxX) {
                    continue;
                }
                if (this.isSweptBulletHitBounds(prevX, prevZ, curX, curZ, bHalfX, bHalfZ, wall.minX, wall.maxX, wall.minZ, wall.maxZ)) {
                    bullet.forceRecycle();
                    return true;
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
    node: Node;
    renderers: MeshRenderer[];
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
}
