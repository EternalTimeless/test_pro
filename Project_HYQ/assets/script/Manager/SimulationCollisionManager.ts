import { _decorator, Component, Vec3 } from 'cc';
import { ColliderGroupTag } from '../Common/CommonEnum';
import { ColliderTag } from '../Other/ColliderTag';
import { CharacterBase } from '../Battle/CharacterBase';
import { GameInfo } from '../Common/GameInfo';
import { Tire } from '../Other/Tire';
import BulletBattle3D, { BulletCloneParams } from '../Bullet/BulletBattle3D';
import { BulletBrand } from '../Other/BulletBrand';

const { ccclass, property } = _decorator;

class CollisionTargetGroup {
    public targetType: ColliderGroupTag;
    public xMin: number = -9999;
    public xMax: number = 9999;
    public targets: CharacterBase[] = [];

    constructor(targetType: ColliderGroupTag) {
        this.targetType = targetType;
    }

    public updateXRange(): void {
        let minX = 9999;
        let maxX = -9999;
        for (let i = 0; i < this.targets.length; i++) {
            const t = this.targets[i];
            if (t.isDead) continue;
            const x = t.node.worldPosition.x;
            if (x < minX) minX = x - t.collisionHalfX;
            if (x > maxX) maxX = x + t.collisionHalfX;
        }
        this.xMin = minX - 0.5;
        this.xMax = maxX + 0.5;
    }
}

/** 单张翻倍牌的本帧穿透批次 */
interface BrandPassBatch {
    brand: BulletBrand;
    bucketIdx: number;
    passBullets: BulletBattle3D[];
}

/** 模拟碰撞管理器：子弹与目标 AABB 碰撞（无物理引擎，分桶优化） */
@ccclass('SimulationCollisionManager')
export default class SimulationCollisionManager extends Component {

    @property({ type: [BulletBrand], displayName: '场景翻倍牌列表' })
    public bulletBrands: BulletBrand[] = [];

    private _bucketSize: number = 0.8;
    private _zMin: number = -10;
    private _bucketCount: number = 100;
    private _bullets: BulletBattle3D[] = [];
    private _targetGroups: { [key: number]: CollisionTargetGroup } = {};
    private _bulletBuckets: BulletBattle3D[][] = [];
    /** 怪物等动态目标的碰撞桶 */
    private _targetBuckets: { [groupId: string]: CharacterBase[][] } = {};
    /** 翻倍牌独立碰撞桶（编辑器配置，与怪物分轨） */
    private _bulletBrandBuckets: BulletBrand[][] = [];
    private _brandXMin: number = -9999;
    private _brandXMax: number = 9999;
    private _frameCount: number = 0;
    /** 本帧翻倍牌穿透批次，帧末统一生成额外子弹 */
    private readonly _brandPassBatch = new Map<string, BrandPassBatch>();
    private readonly _tempSpawnPos = new Vec3();

    onLoad() {
        GameInfo.instance.simulationCollisionMgr = this;
    }

    protected start(): void {
        for (let i = 0; i < this._bucketCount; i++) {
            this._bulletBuckets[i] = [];
            this._bulletBrandBuckets[i] = [];
        }
    }

    public registerBullet(bullet: BulletBattle3D): void {
        this._bullets.push(bullet);
    }

    public unregisterBullet(bullet: BulletBattle3D): void {
        const idx = this._bullets.indexOf(bullet);
        if (idx !== -1) {
            this._bullets[idx] = this._bullets[this._bullets.length - 1];
            this._bullets.pop();
        }
    }

    public registerTarget(target: CharacterBase): void {
        const tagComp = target.node.getComponent(ColliderTag);
        if (!tagComp) return;
        // 翻倍牌由 bulletBrands 编辑器列表管理，不走动态注册
        if (tagComp.tag === ColliderGroupTag.BulletBrand) {
            return;
        }
        const type = tagComp.tag;
        if (!this._targetGroups[type]) {
            this._targetGroups[type] = new CollisionTargetGroup(type);
        }
        this._targetGroups[type].targets.push(target);
        this._targetGroups[type].updateXRange();
    }

    public unregisterTarget(target: CharacterBase): void {
        const tagComp = target.node.getComponent(ColliderTag);
        if (!tagComp) return;
        if (tagComp.tag === ColliderGroupTag.BulletBrand) {
            return;
        }
        const group = this._targetGroups[tagComp.tag];
        if (!group) return;
        const idx = group.targets.indexOf(target);
        if (idx !== -1) {
            group.targets[idx] = group.targets[group.targets.length - 1];
            group.targets.pop();
        }
        group.updateXRange();
    }

    /** Tire 仅在 slot[0] 停靠后才可被子弹命中 */
    private canBulletHitTarget(target: CharacterBase): boolean {
        const tire = target.node.getComponent(Tire);
        if (!tire) {
            return true;
        }
        return !!GameInfo.instance.collectionMgr?.canTireBeAttacked(tire);
    }

    private _getBucketIdx(z: number): number {
        const idx = ((z - this._zMin) / this._bucketSize) | 0;
        if (idx < 0) return 0;
        if (idx >= this._bucketCount) return this._bucketCount - 1;
        return idx;
    }

    /** 翻倍牌是否参与穿透检测 */
    private isBrandActive(brand: BulletBrand): boolean {
        return !!brand?.node?.isValid && brand.node.active && !brand.isDead;
    }

    /**
     * 收集指定世界 Z 附近 ±1 桶内的存活翻倍牌（供怪物索敌，写入 out 复用缓冲）
     */
    public collectNearbyBrands(worldZ: number, out: BulletBrand[]): void {
        out.length = 0;
        const bIdx = this._getBucketIdx(worldZ);
        this._appendActiveBrandsFromBucket(bIdx, out);
        if (bIdx > 0) {
            this._appendActiveBrandsFromBucket(bIdx - 1, out);
        }
        if (bIdx < this._bucketCount - 1) {
            this._appendActiveBrandsFromBucket(bIdx + 1, out);
        }
    }

    private _appendActiveBrandsFromBucket(bIdx: number, out: BulletBrand[]): void {
        const bucket = this._bulletBrandBuckets[bIdx];
        if (!bucket) {
            return;
        }
        for (let i = 0; i < bucket.length; i++) {
            const brand = bucket[i];
            if (!this.isBrandActive(brand)) {
                continue;
            }
            if (out.indexOf(brand) >= 0) {
                continue;
            }
            out.push(brand);
        }
    }

    /** 从编辑器列表重建翻倍牌 Z 桶 */
    private rebuildBulletBrandBuckets(): void {
        this._brandXMin = 9999;
        this._brandXMax = -9999;

        for (let i = 0; i < this._bucketCount; i++) {
            this._bulletBrandBuckets[i].length = 0;
        }

        for (let i = 0; i < this.bulletBrands.length; i++) {
            const brand = this.bulletBrands[i];
            if (!this.isBrandActive(brand)) {
                continue;
            }

            const x = brand.node.worldPosition.x;
            const halfX = brand.collisionHalfX;
            if (x - halfX < this._brandXMin) this._brandXMin = x - halfX;
            if (x + halfX > this._brandXMax) this._brandXMax = x + halfX;

            const bIdx = this._getBucketIdx(brand.node.worldPosition.z);
            this._bulletBrandBuckets[bIdx].push(brand);
            if (bIdx > 0) this._bulletBrandBuckets[bIdx - 1].push(brand);
            if (bIdx < this._bucketCount - 1) this._bulletBrandBuckets[bIdx + 1].push(brand);
        }

        if (this._brandXMax >= this._brandXMin) {
            this._brandXMin -= 0.5;
            this._brandXMax += 0.5;
        } else {
            this._brandXMin = -9999;
            this._brandXMax = 9999;
        }
    }

    public update(_dt: number): void {
        this._brandPassBatch.clear();

        for (let i = 0; i < this._bucketCount; i++) {
            this._bulletBuckets[i].length = 0;
        }
        for (const groupId in this._targetBuckets) {
            for (let i = 0; i < this._bucketCount; i++) {
                if (this._targetBuckets[groupId][i]) {
                    this._targetBuckets[groupId][i].length = 0;
                }
            }
        }

        for (let i = this._bullets.length - 1; i >= 0; i--) {
            const bullet = this._bullets[i];
            if (!bullet.node.active) {
                this._bullets[i] = this._bullets[this._bullets.length - 1];
                this._bullets.pop();
                continue;
            }
            const bIdx = this._getBucketIdx(bullet.node.worldPosition.z);
            this._bulletBuckets[bIdx].push(bullet);
        }

        this.rebuildBulletBrandBuckets();

        for (const typeStr in this._targetGroups) {
            const group = this._targetGroups[typeStr];
            if (!this._targetBuckets[typeStr]) {
                this._targetBuckets[typeStr] = [];
                for (let i = 0; i < this._bucketCount; i++) {
                    this._targetBuckets[typeStr][i] = [];
                }
            }
            const tBuckets = this._targetBuckets[typeStr];
            for (let i = group.targets.length - 1; i >= 0; i--) {
                const target = group.targets[i];
                if (target.isDead || !target.node.active) {
                    group.targets[i] = group.targets[group.targets.length - 1];
                    group.targets.pop();
                    continue;
                }
                const bIdx = this._getBucketIdx(target.node.worldPosition.z);
                tBuckets[bIdx].push(target);
                if (bIdx > 0) tBuckets[bIdx - 1].push(target);
                if (bIdx < this._bucketCount - 1) tBuckets[bIdx + 1].push(target);
            }
        }

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

                for (let ti = 0; ti < bullet.attackTargetTag.length; ti++) {
                    const typeStr = String(bullet.attackTargetTag[ti]);
                    const group = this._targetGroups[typeStr];
                    if (!group) continue;
                    if (bx + bHalfX < group.xMin || bx - bHalfX > group.xMax) continue;

                    const tBuckets = this._targetBuckets[typeStr];
                    const bucketTargets = tBuckets?.[bIdx];
                    if (!bucketTargets) continue;

                    for (let mj = 0; mj < bucketTargets.length; mj++) {
                        const target = bucketTargets[mj];
                        if (target.isDead) continue;
                        if (!this.canBulletHitTarget(target)) continue;

                        const tx = target.node.worldPosition.x;
                        const tz = target.node.worldPosition.z;
                        const overlapX = bHalfX + target.collisionHalfX;
                        const overlapZ = bHalfZ + target.collisionHalfZ;
                        const dx = bx - tx;
                        const dz = bz - tz;

                        if (dx < overlapX && dx > -overlapX && dz < overlapZ && dz > -overlapZ) {
                            bullet.onHitTarget(target);
                        }
                    }
                }

                this.collectBulletBrandPass(bullet, bx, bz, bHalfX, bHalfZ, bIdx);
            }
        }

        this.flushBrandPassBatches();

        if (this._frameCount % 10 === 0) {
            for (const typeStr in this._targetGroups) {
                this._targetGroups[typeStr].updateXRange();
            }
        }
        this._frameCount++;
    }

    /** 收集本帧穿过翻倍牌的子弹，帧末统一处理 */
    private collectBulletBrandPass(
        bullet: BulletBattle3D,
        bx: number,
        bz: number,
        bHalfX: number,
        bHalfZ: number,
        bIdx: number,
    ): void {
        if (bx + bHalfX < this._brandXMin || bx - bHalfX > this._brandXMax) {
            return;
        }

        const bucketBrands = this._bulletBrandBuckets[bIdx];
        if (!bucketBrands || bucketBrands.length === 0) {
            return;
        }

        for (let mj = 0; mj < bucketBrands.length; mj++) {
            const brand = bucketBrands[mj];
            if (!this.isBrandActive(brand)) {
                continue;
            }

            const tx = brand.node.worldPosition.x;
            const tz = brand.node.worldPosition.z;
            const overlapX = bHalfX + brand.collisionHalfX;
            const overlapZ = bHalfZ + brand.collisionHalfZ;
            const dx = bx - tx;
            const dz = bz - tz;

            if (dx < overlapX && dx > -overlapX && dz < overlapZ && dz > -overlapZ) {
                this.collectBrandPass(brand, bullet, bIdx);
            }
        }
    }

    private collectBrandPass(brand: BulletBrand, bullet: BulletBattle3D, bucketIdx: number): void {
        const brandUuid = brand.node.uuid;
        if (bullet.hasPassedBrand(brandUuid)) {
            return;
        }
        bullet.markPassedBrand(brandUuid);

        let batch = this._brandPassBatch.get(brandUuid);
        if (!batch) {
            batch = { brand, bucketIdx, passBullets: [] };
            this._brandPassBatch.set(brandUuid, batch);
        }
        batch.passBullets.push(bullet);
    }

    /** 帧末：按行 min/max X 左右外扩生成额外子弹 */
    private flushBrandPassBatches(): void {
        for (const batch of this._brandPassBatch.values()) {
            const brand = batch.brand;
            if (!this.isBrandActive(brand) || batch.passBullets.length === 0) {
                continue;
            }

            const rowXs = this.collectRowXInBuckets(brand, batch.bucketIdx);
            if (rowXs.length === 0) {
                for (let i = 0; i < batch.passBullets.length; i++) {
                    rowXs.push(batch.passBullets[i].node.worldPosition.x);
                }
            }

            let minX = rowXs[0];
            let maxX = rowXs[0];
            for (let i = 1; i < rowXs.length; i++) {
                if (rowXs[i] < minX) minX = rowXs[i];
                if (rowXs[i] > maxX) maxX = rowXs[i];
            }

            const extraPerBullet = Math.max(0, Math.round(brand.multipleNum) - 1);
            const extraCount = batch.passBullets.length * extraPerBullet;
            if (extraCount <= 0) {
                continue;
            }

            const slotXs = this.allocateOutwardX(minX, maxX, extraCount, brand.spawnSpacing);
            const brandPos = brand.node.worldPosition;
            const spawnZ = brandPos.z + brand.passSpawnOffsetZ;

            for (let i = 0; i < extraCount; i++) {
                const template = batch.passBullets[i % batch.passBullets.length];
                const params = template.getCloneParams();
                if (!params.prefabPath) {
                    continue;
                }
                const templateY = template.node.worldPosition.y;
                this._tempSpawnPos.set(slotXs[i], templateY, spawnZ);
                this.spawnBulletClone(params, this._tempSpawnPos, template);
            }
        }
    }

    /** 扫描牌附近桶，收集 Z 容差内的同行子弹 X */
    private collectRowXInBuckets(brand: BulletBrand, bIdx: number): number[] {
        const xs: number[] = [];
        const brandPos = brand.node.worldPosition;
        const brandHalfZ = brand.collisionHalfZ;

        for (let di = -1; di <= 1; di++) {
            const idx = bIdx + di;
            if (idx < 0 || idx >= this._bucketCount) {
                continue;
            }
            const bucket = this._bulletBuckets[idx];
            for (let i = 0; i < bucket.length; i++) {
                const bullet = bucket[i];
                if (!bullet.node.active) {
                    continue;
                }
                const bz = bullet.node.worldPosition.z;
                const overlapZ = brandHalfZ + bullet.collisionHalfZ;
                const dz = bz - brandPos.z;
                if (dz < overlapZ && dz > -overlapZ) {
                    xs.push(bullet.node.worldPosition.x);
                }
            }
        }
        return xs;
    }

    /** 在整行左右两侧交替外扩分配 X 槽位 */
    private allocateOutwardX(minX: number, maxX: number, count: number, spacing: number): number[] {
        const slots: number[] = [];
        let right = maxX + spacing;
        let left = minX - spacing;

        for (let i = 0; i < count; i++) {
            if (i % 2 === 0) {
                slots.push(right);
                right += spacing;
            } else {
                slots.push(left);
                left -= spacing;
            }
        }
        return slots;
    }

    private spawnBulletClone(params: BulletCloneParams, worldPos: Vec3, template: BulletBattle3D): void {
        const bulletLayer = GameInfo.instance.gameMgr?.bulletLayer;
        if (!bulletLayer) {
            return;
        }

        const bulletNode = GameInfo.instance.prefabMgr.getPrefab(params.prefabPath);
        if (!bulletNode) {
            return;
        }

        bulletNode.setParent(bulletLayer);
        bulletNode.setWorldPosition(worldPos);

        let bulletComp = bulletNode.getComponent(BulletBattle3D);
        if (!bulletComp) {
            bulletComp = bulletNode.addComponent(BulletBattle3D);
        }
        bulletComp.setBulletInfo(
            params.damage,
            params.flyDir,
            params.flySpeed,
            params.bulletLevel,
            params.prefabPath,
        );
        // setBulletInfo 会清空 _passedBrandUuids，克隆弹需继承模板已穿过的牌
        bulletComp.inheritPassedBrandsFrom(template);
    }
}
