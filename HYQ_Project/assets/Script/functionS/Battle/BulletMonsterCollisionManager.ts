import { CCFloat, _decorator, Vec3, director, Director } from 'cc';
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
            const x = t.hitNode.worldPosition.x;
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

    /** 子弹桶 - 每帧重建 */
    private _bulletBuckets: BulletBattle3D[][] = [];

    /** 目标桶 - 按组ID+桶索引存储 */
    private _targetBuckets: { [groupId: string]: BattleTarget3D[][] } = {};

    private _directorCallback: (dt: number) => void;

    protected constructor() {
        super();
        // 预分配桶数组
        for (let i = 0; i < this._bucketCount; i++) {
            this._bulletBuckets[i] = [];
        }
        // 使用 director 的每帧回调驱动碰撞检测
        this._directorCallback = (dt: number) => {
            this.update(dt);
        };
        director.on(Director.EVENT_AFTER_UPDATE, this._directorCallback);
    }

    /** 注册子弹 */
    public registerBullet(bullet: BulletBattle3D): void {
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
                const hitPos = target.hitNode.worldPosition;
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
                const hitPos = hitNode.worldPosition;
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
                const z = target.hitNode.worldPosition.z;
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
                const bHalfX = bullet.collisionHalfX;
                const bHalfZ = bullet.collisionHalfZ;

                // 遍历子弹的 attackTargetTag
                const targetTags = bullet.attackTargetTag;
                for (let ti = 0; ti < targetTags.length; ti++) {
                    const typeStr = String(targetTags[ti]);
                    const group = this._targetGroups[typeStr];
                    if (!group) continue;

                    // x范围预过滤
                    if (bx + bHalfX < group.xMin || bx - bHalfX > group.xMax) continue;

                    const tBuckets = this._targetBuckets[typeStr];
                    if (!tBuckets) continue;
                    const bucketTargets = tBuckets[bIdx];
                    if (!bucketTargets) continue;

                    for (let mj = 0; mj < bucketTargets.length; mj++) {
                        const target = bucketTargets[mj];
                        if (target.isDie) continue;

                        // AABB碰撞判定
                        const tx = target.hitNode.worldPosition.x;
                        const tz = target.hitNode.worldPosition.z;
                        const tHalfX = target.collisionHalfX;
                        const tHalfZ = target.collisionHalfZ;

                        const dx = bx - tx;
                        const dz = bz - tz;
                        const overlapX = bHalfX + tHalfX;
                        const overlapZ = bHalfZ + tHalfZ;

                        if (dx < overlapX && dx > -overlapX && dz < overlapZ && dz > -overlapZ) {
                            // 碰撞命中！调用子弹的命中处理（迁移自原 _startCollide）
                            bullet.onHitTarget(target);
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

    private getTargetTypeList(): COLLIDE_TYPE[] {
        const list: COLLIDE_TYPE[] = [];
        for (const typeStr in this._targetGroups) {
            list.push(Number(typeStr) as COLLIDE_TYPE);
        }
        return list;
    }
}
