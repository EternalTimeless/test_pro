System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Vec3, director, Director, MeshRenderer, Singleton, CollisionTargetGroup, _dec, _class2, _class3, _crd, ccclass, property, BulletMonsterCollisionManager;

  function _reportPossibleCrUseOfSingleton(extras) {
    _reporterNs.report("Singleton", "db://assets/Script/Base/Singleton", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCOLLIDE_TYPE(extras) {
    _reporterNs.report("COLLIDE_TYPE", "./CollectBattleTarger/ColliderTag", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletBattle3D(extras) {
    _reporterNs.report("BulletBattle3D", "./Battle3D/Bullet/BulletBattle3D", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleTarget3D(extras) {
    _reporterNs.report("BattleTarget3D", "./BattleTarger/BattleTarget3D", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Vec3 = _cc.Vec3;
      director = _cc.director;
      Director = _cc.Director;
      MeshRenderer = _cc.MeshRenderer;
    }, function (_unresolved_2) {
      Singleton = _unresolved_2.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e603cVqmUVFdKngtJ8SEsOF", "BulletMonsterCollisionManager", undefined);

      __checkObsolete__(['CCFloat', '_decorator', 'Vec3', 'director', 'Director', 'MeshRenderer', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 碰撞目标组 - 按 COLLIDE_TYPE 分组管理目标
       * 复用现有 ColliderTag.tag + BulletBattle3D.attackTargetTag 的匹配机制
       */

      CollisionTargetGroup = class CollisionTargetGroup {
        constructor(targetType) {
          /** 对应 COLLIDE_TYPE 枚举值 */
          this.targetType = void 0;

          /** 该组目标的x范围，用于预过滤 */
          this.xMin = -9999;
          this.xMax = 9999;

          /** 该组所有活跃目标 */
          this.targets = [];
          this.targetType = targetType;
        }
        /** 更新x范围（添加/移除目标时调用） */


        updateXRange() {
          let minX = 9999;
          let maxX = -9999;

          for (let i = 0; i < this.targets.length; i++) {
            const t = this.targets[i];
            if (t.isDie) continue;
            const x = t.getCollisionWorldPosition().x;
            if (x < minX) minX = x - t.collisionHalfX;
            if (x > maxX) maxX = x + t.collisionHalfX;
          } // 扩展半个碰撞体宽度作为预过滤容差


          this.xMin = minX - 0.5;
          this.xMax = maxX + 0.5;
        }

        invalidateXRange() {
          this.xMin = -9999;
          this.xMax = 9999;
        }

      };

      /**
       * 自定义碰撞管理器 - 替代物理引擎进行子弹与目标的碰撞检测
       * iOS优化：用数组而非Map，预分配Vec3，AABB判定，零GC
       */
      _export("default", BulletMonsterCollisionManager = (_dec = ccclass('BulletMonsterCollisionManager'), _dec(_class2 = (_class3 = class BulletMonsterCollisionManager extends (_crd && Singleton === void 0 ? (_reportPossibleCrUseOfSingleton({
        error: Error()
      }), Singleton) : Singleton) {
        static get instance() {
          return this.getInstance();
        }
        /** z轴分桶桶宽 */


        constructor() {
          super(); // 预分配桶数组

          this._bucketSize = 0.8;

          /** z轴最小值（用于计算桶索引） */
          this._zMin = -10;

          /** 桶数量 */
          this._bucketCount = 100;

          /** 所有活跃子弹 */
          this._bullets = [];

          /** 目标组，按 COLLIDE_TYPE 索引存储 */
          this._targetGroups = {};

          /** 预分配临时Vec3，避免每帧new */
          this._tempVec3 = new Vec3();
          this._tempBulletPrevPos = new Vec3();
          this._tempBulletVisualOffset = new Vec3();
          this._targetCheckedStamp = new WeakMap();
          this._wallCheckedStamp = new WeakMap();
          this._staticTargetFrameData = new WeakMap();
          this._tempTargetFrameData = {
            frame: -1,
            x: 0,
            z: 0,
            halfX: 0,
            halfZ: 0
          };

          /** 子弹桶 - 每帧重建 */
          this._bulletBuckets = [];
          this._usedBulletBucketIndices = [];
          this._bulletBucketUsed = [];

          /** 目标桶 - 按组ID+桶索引存储 */
          this._targetBuckets = {};
          this._usedTargetBucketIndices = {};
          this._targetBucketUsed = {};
          this._wallBuckets = [];
          this._wallObstacles = [];
          this._wallScene = null;
          this._nextWallRefreshFrame = 0;
          this._gldRootFound = false;
          this._gldSideCount = 0;
          this._gldReadySideCount = 0;
          this._targetCheckId = 1;
          this._wallCheckId = 1;
          this._directorCallback = void 0;
          this._frameCount = 0;

          for (let i = 0; i < this._bucketCount; i++) {
            this._bulletBuckets[i] = [];
            this._bulletBucketUsed[i] = false;
            this._wallBuckets[i] = [];
          } // 使用 director 的每帧回调驱动碰撞检测


          this._directorCallback = dt => {
            this.update(dt);
          };

          director.on(Director.EVENT_AFTER_UPDATE, this._directorCallback);
        }
        /** 注册子弹 */


        registerBullet(bullet) {
          if (this._bullets.indexOf(bullet) !== -1) {
            return;
          }

          this._bullets.push(bullet);
        }
        /** 注销子弹 */


        unregisterBullet(bullet) {
          const idx = this._bullets.indexOf(bullet);

          if (idx !== -1) {
            // swap-and-pop，iOS优化
            this._bullets[idx] = this._bullets[this._bullets.length - 1];

            this._bullets.pop();
          }
        }
        /** 注册目标 */


        registerTarget(target) {
          const tag = target.getComponent('ColliderTag');
          if (!tag) return;
          const type = tag.tag;

          if (!this._targetGroups[type]) {
            this._targetGroups[type] = new CollisionTargetGroup(type);
          }

          if (this._targetGroups[type].targets.indexOf(target) !== -1) {
            return;
          }

          this._targetGroups[type].targets.push(target);

          this._targetGroups[type].invalidateXRange();
        }
        /** 注销目标 */


        unregisterTarget(target) {
          const tag = target.getComponent('ColliderTag');
          if (!tag) return;
          const type = tag.tag;
          const group = this._targetGroups[type];
          if (!group) return;
          const idx = group.targets.indexOf(target);

          if (idx !== -1) {
            // swap-and-pop
            group.targets[idx] = group.targets[group.targets.length - 1];
            group.targets.pop();
          }

          group.invalidateXRange();
        }

        clearBullets() {
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

          this.clearUsedBulletBuckets();
        }

        getNearestTarget(fromPos, targetTags = []) {
          let nearest = null;
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


        getLockableLalianTarget(fromPos, lockWorldX, targetTags = []) {
          let nearest = null;
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

              const lockChecker = target.canLockBulletFromWorldX;

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

        _getBucketIdx(z) {
          const idx = (z - this._zMin) / this._bucketSize | 0;
          if (idx < 0) return 0;
          if (idx >= this._bucketCount) return this._bucketCount - 1;
          return idx;
        }
        /** 每帧碰撞检测 */


        update(dt) {
          if (this._bullets.length === 0) {
            if (this.isSceneOptimizationEnabled() && this._usedBulletBucketIndices.length > 0) {
              this.clearUsedBulletBuckets();
              this.clearUsedTargetBuckets();
            }

            return;
          }

          this.ensureWallObstacles(); // 1. 清空桶数组（只重置length=0，不释放内存）

          this.clearFrameBuckets(); // 2. 将子弹放入桶

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

            this.markBulletBucketUsed(bIdx);

            this._bulletBuckets[bIdx].push(bullet);
          } // 3. 将目标放入桶（按COLLIDE_TYPE分组）


          for (const typeStr in this._targetGroups) {
            const group = this._targetGroups[typeStr]; // 确保目标桶存在

            if (!this._targetBuckets[typeStr]) {
              this._targetBuckets[typeStr] = [];
              this._usedTargetBucketIndices[typeStr] = [];
              this._targetBucketUsed[typeStr] = [];

              for (let i = 0; i < this._bucketCount; i++) {
                this._targetBuckets[typeStr][i] = [];
                this._targetBucketUsed[typeStr][i] = false;
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

              const targetData = this.getTargetFrameData(target);

              const minTargetBucketIdx = this._getBucketIdx(targetData.z - targetData.halfZ);

              const maxTargetBucketIdx = this._getBucketIdx(targetData.z + targetData.halfZ);

              for (let bucketIdx = minTargetBucketIdx; bucketIdx <= maxTargetBucketIdx; bucketIdx++) {
                this.markTargetBucketUsed(typeStr, bucketIdx);
                tBuckets[bucketIdx].push(target);
              }
            }
          } // 4. 逐桶碰撞检测


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

              const visualOffset = bullet.getBatchVisualMaxOffset(this._tempBulletVisualOffset);
              const wallHalfX = bHalfX + visualOffset.x;
              const wallHalfZ = bHalfZ + visualOffset.z;
              const wallSweptMinX = Math.min(prevX, bx) - wallHalfX;
              const wallSweptMaxX = Math.max(prevX, bx) + wallHalfX;

              const wallMinBucketIdx = this._getBucketIdx(Math.min(prevZ, bz) - wallHalfZ);

              const wallMaxBucketIdx = this._getBucketIdx(Math.max(prevZ, bz) + wallHalfZ);

              if (this.tryRecycleBulletByWallHit(bullet, prevX, prevZ, bx, bz, wallHalfX, wallHalfZ, wallSweptMinX, wallSweptMaxX, wallMinBucketIdx, wallMaxBucketIdx)) {
                continue;
              } // 遍历子弹的 attackTargetTag


              const targetTags = bullet.attackTargetTag;

              for (let ti = 0; ti < targetTags.length; ti++) {
                const typeStr = String(targetTags[ti]);
                const group = this._targetGroups[typeStr];
                if (!group) continue; // x范围预过滤

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

                    this._targetCheckedStamp.set(target, targetCheckId); // AABB碰撞判定


                    const targetData = this.getTargetFrameData(target);
                    const tx = targetData.x;
                    const tz = targetData.z;
                    const tHalfX = targetData.halfX;
                    const tHalfZ = targetData.halfZ;

                    if (this.isSweptBulletHit(prevX, prevZ, bx, bz, bHalfX, bHalfZ, tx, tz, tHalfX, tHalfZ)) {
                      // 碰撞命中！调用子弹的命中处理（迁移自原 _startCollide）
                      bullet.onHitTarget(target);
                    }
                  }
                }
              }
            }
          } // 5. 更新各组x范围（低频更新即可，每10帧更新一次）


          if (this._frameCount % 10 === 0) {
            for (const typeStr in this._targetGroups) {
              this._targetGroups[typeStr].updateXRange();
            }
          }

          this._frameCount++;
        }

        isSceneOptimizationEnabled() {
          var _director$getScene;

          return ((_director$getScene = director.getScene()) == null ? void 0 : _director$getScene.name) === BulletMonsterCollisionManager.OPTIMIZED_SCENE_NAME;
        }

        getTargetFrameData(target) {
          if (this.isSceneOptimizationEnabled() && target.cacheCollisionBoundsPerFrame) {
            const cached = this._staticTargetFrameData.get(target);

            if ((cached == null ? void 0 : cached.frame) === this._frameCount) {
              return cached;
            }

            const pos = target.getCollisionWorldPosition(this._tempVec3);
            const data = cached != null ? cached : {
              frame: -1,
              x: 0,
              z: 0,
              halfX: 0,
              halfZ: 0
            };
            this.writeTargetFrameData(data, target, pos);

            this._staticTargetFrameData.set(target, data);

            return data;
          }

          const pos = target.getCollisionWorldPosition(this._tempVec3);
          this.writeTargetFrameData(this._tempTargetFrameData, target, pos);
          return this._tempTargetFrameData;
        }

        writeTargetFrameData(data, target, pos) {
          data.frame = this._frameCount;
          data.x = pos.x;
          data.z = pos.z;
          data.halfX = target.collisionHalfX;
          data.halfZ = target.collisionHalfZ;
        }

        clearUsedBulletBuckets() {
          for (let i = 0; i < this._usedBulletBucketIndices.length; i++) {
            const index = this._usedBulletBucketIndices[i];
            this._bulletBuckets[index].length = 0;
            this._bulletBucketUsed[index] = false;
          }

          this._usedBulletBucketIndices.length = 0;
        }

        clearFrameBuckets() {
          if (this.isSceneOptimizationEnabled()) {
            this.clearUsedBulletBuckets();
            this.clearUsedTargetBuckets();
            return;
          }

          for (let i = 0; i < this._bucketCount; i++) {
            this._bulletBuckets[i].length = 0;
            this._bulletBucketUsed[i] = false;
          }

          this._usedBulletBucketIndices.length = 0;

          for (const groupId in this._targetBuckets) {
            const buckets = this._targetBuckets[groupId];
            const usedFlags = this._targetBucketUsed[groupId];

            for (let i = 0; i < this._bucketCount; i++) {
              buckets[i].length = 0;
              usedFlags[i] = false;
            }

            this._usedTargetBucketIndices[groupId].length = 0;
          }
        }

        markBulletBucketUsed(index) {
          if (this._bulletBucketUsed[index]) {
            return;
          }

          this._bulletBucketUsed[index] = true;

          this._usedBulletBucketIndices.push(index);
        }

        clearUsedTargetBuckets() {
          for (const groupId in this._usedTargetBucketIndices) {
            const usedIndices = this._usedTargetBucketIndices[groupId];
            const buckets = this._targetBuckets[groupId];
            const usedFlags = this._targetBucketUsed[groupId];

            for (let i = 0; i < usedIndices.length; i++) {
              const index = usedIndices[i];
              buckets[index].length = 0;
              usedFlags[index] = false;
            }

            usedIndices.length = 0;
          }
        }

        markTargetBucketUsed(groupId, index) {
          if (this._targetBucketUsed[groupId][index]) {
            return;
          }

          this._targetBucketUsed[groupId][index] = true;

          this._usedTargetBucketIndices[groupId].push(index);
        }

        ensureWallObstacles() {
          const scene = director.getScene();

          if (!scene) {
            this.clearWallObstacles();
            this._wallScene = null;
            return;
          }

          if (this._wallScene !== scene || this._frameCount >= this._nextWallRefreshFrame) {
            this.rebuildWallObstacles(scene);
            this._wallScene = scene;
            this._nextWallRefreshFrame = this.isSceneOptimizationEnabled() ? this.isGldWallScanComplete() ? Number.MAX_SAFE_INTEGER : this._frameCount + 1 : this._wallObstacles.length > 0 ? Number.MAX_SAFE_INTEGER : this._frameCount + 1;
          }
        }
        /** 动态创建或移除 SM_gelidun_* 墙体后调用，使下次碰撞帧重新扫描。 */


        markWallObstaclesDirty() {
          this._nextWallRefreshFrame = 0;
        }

        clearWallObstacles() {
          this._wallObstacles.length = 0;

          for (let i = 0; i < this._bucketCount; i++) {
            this._wallBuckets[i].length = 0;
          }
        }

        rebuildWallObstacles(scene) {
          this.clearWallObstacles();
          this._gldRootFound = false;
          this._gldSideCount = 0;
          this._gldReadySideCount = 0;
          this.collectWallObstacles(scene);
        }

        isGldWallScanComplete() {
          return !this._gldRootFound || this._gldSideCount === 2 && this._gldReadySideCount === 2;
        }

        collectWallObstacles(node) {
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
            const obstacle = {
              node,
              renderers: [],
              minX: 0,
              maxX: 0,
              minZ: 0,
              maxZ: 0
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
        /** Game_3D-002 中将 gld 左右两侧分别聚合为一个虚拟 AABB。 */


        collectGldSideObstacle(gld, sideName) {
          const side = gld.children.find(child => child.name === sideName);

          if (!side) {
            return;
          }

          this._gldSideCount++;
          const obstacle = {
            node: side,
            renderers: [],
            minX: 0,
            maxX: 0,
            minZ: 0,
            maxZ: 0
          };
          this.collectGelidunMeshRenderers(side, obstacle.renderers);

          if (this.updateWallObstacleBounds(obstacle, true)) {
            this._wallObstacles.push(obstacle);

            this.addWallObstacleToBuckets(obstacle);
            this._gldReadySideCount++;
          }
        }

        collectGelidunMeshRenderers(node, out, insideGelidun = false) {
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

        collectMeshRenderers(node, out) {
          const renderer = node.getComponent(MeshRenderer);

          if (renderer) {
            out.push(renderer);
          }

          for (let i = 0; i < node.children.length; i++) {
            this.collectMeshRenderers(node.children[i], out);
          }
        }

        updateWallObstacleBounds(obstacle, requireAllRenderers = false) {
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
            var _model;

            const renderer = obstacle.renderers[i];

            if (!renderer || !requireAllRenderers && !renderer.node.activeInHierarchy) {
              continue;
            }

            const worldBounds = renderer == null || (_model = renderer.model) == null ? void 0 : _model.worldBounds;
            const center = worldBounds == null ? void 0 : worldBounds.center;
            const halfExtents = worldBounds == null ? void 0 : worldBounds.halfExtents;

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

          if (!found || requireAllRenderers && validRendererCount !== obstacle.renderers.length) {
            return false;
          }

          obstacle.minX = minX;
          obstacle.maxX = maxX;
          obstacle.minZ = minZ;
          obstacle.maxZ = maxZ;
          return true;
        }

        addWallObstacleToBuckets(obstacle) {
          const minIdx = this._getBucketIdx(obstacle.minZ);

          const maxIdx = this._getBucketIdx(obstacle.maxZ);

          for (let i = minIdx; i <= maxIdx; i++) {
            this._wallBuckets[i].push(obstacle);
          }
        }

        tryRecycleBulletByWallHit(bullet, prevX, prevZ, curX, curZ, bHalfX, bHalfZ, sweptMinX, sweptMaxX, minBucketIdx, maxBucketIdx) {
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

        isSweptBulletHit(prevX, prevZ, curX, curZ, bHalfX, bHalfZ, targetX, targetZ, targetHalfX, targetHalfZ) {
          return this.isSweptBulletHitBounds(prevX, prevZ, curX, curZ, bHalfX, bHalfZ, targetX - targetHalfX, targetX + targetHalfX, targetZ - targetHalfZ, targetZ + targetHalfZ);
        }

        isSweptBulletHitBounds(prevX, prevZ, curX, curZ, expandHalfX, expandHalfZ, minX, maxX, minZ, maxZ) {
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

        getTargetTypeList() {
          const list = [];

          for (const typeStr in this._targetGroups) {
            list.push(Number(typeStr));
          }

          return list;
        }

      }, _class3.OPTIMIZED_SCENE_NAME = 'Game_3D-002', _class3)) || _class2));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e13771ea8032dbc1728530af431c57de3b1e5e24.js.map