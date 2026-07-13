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
          var minX = 9999;
          var maxX = -9999;

          for (var i = 0; i < this.targets.length; i++) {
            var t = this.targets[i];
            if (t.isDie) continue;
            var x = t.getCollisionWorldPosition().x;
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

          for (var i = 0; i < this._bucketCount; i++) {
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
          var idx = this._bullets.indexOf(bullet);

          if (idx !== -1) {
            // swap-and-pop，iOS优化
            this._bullets[idx] = this._bullets[this._bullets.length - 1];

            this._bullets.pop();
          }
        }
        /** 注册目标 */


        registerTarget(target) {
          var tag = target.getComponent('ColliderTag');
          if (!tag) return;
          var type = tag.tag;

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
          var tag = target.getComponent('ColliderTag');
          if (!tag) return;
          var type = tag.tag;
          var group = this._targetGroups[type];
          if (!group) return;
          var idx = group.targets.indexOf(target);

          if (idx !== -1) {
            // swap-and-pop
            group.targets[idx] = group.targets[group.targets.length - 1];
            group.targets.pop();
          }

          group.invalidateXRange();
        }

        clearBullets() {
          while (this._bullets.length > 0) {
            var bullet = this._bullets[this._bullets.length - 1];

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

        getNearestTarget(fromPos, targetTags) {
          if (targetTags === void 0) {
            targetTags = [];
          }

          var nearest = null;
          var minDistSq = Number.MAX_VALUE;
          var tags = targetTags && targetTags.length > 0 ? targetTags : this.getTargetTypeList();

          for (var ti = 0; ti < tags.length; ti++) {
            var group = this._targetGroups[tags[ti]];

            if (!group) {
              continue;
            }

            for (var i = 0; i < group.targets.length; i++) {
              var target = group.targets[i];

              if (!target || target.isDie || !target.node.active) {
                continue;
              }

              var hitPos = target.getCollisionWorldPosition(this._tempVec3);
              var dx = hitPos.x - fromPos.x;
              var dy = hitPos.y - fromPos.y;
              var dz = hitPos.z - fromPos.z;
              var distSq = dx * dx + dy * dy + dz * dz;

              if (distSq < minDistSq) {
                minDistSq = distSq;
                nearest = target;
              }
            }
          }

          return nearest;
        }
        /** 获取桶索引 */


        getLockableLalianTarget(fromPos, lockWorldX, targetTags) {
          if (targetTags === void 0) {
            targetTags = [];
          }

          var nearest = null;
          var minDistSq = Number.MAX_VALUE;
          var tags = targetTags && targetTags.length > 0 ? targetTags : this.getTargetTypeList();

          for (var ti = 0; ti < tags.length; ti++) {
            var group = this._targetGroups[tags[ti]];

            if (!group) {
              continue;
            }

            for (var i = 0; i < group.targets.length; i++) {
              var target = group.targets[i];

              if (!target || target.isDie || !target.node.active) {
                continue;
              }

              var lockChecker = target.canLockBulletFromWorldX;

              if (typeof lockChecker !== 'function' || !lockChecker.call(target, lockWorldX)) {
                continue;
              }

              var hitNode = target.hitNode;

              if (!hitNode || !hitNode.active || !hitNode.activeInHierarchy) {
                continue;
              }

              var hitPos = target.getCollisionWorldPosition(this._tempVec3);
              var dx = hitPos.x - fromPos.x;
              var dy = hitPos.y - fromPos.y;
              var dz = hitPos.z - fromPos.z;
              var distSq = dx * dx + dy * dy + dz * dz;

              if (distSq < minDistSq) {
                minDistSq = distSq;
                nearest = target;
              }
            }
          }

          return nearest;
        }

        _getBucketIdx(z) {
          var idx = (z - this._zMin) / this._bucketSize | 0;
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

          for (var i = this._bullets.length - 1; i >= 0; i--) {
            var bullet = this._bullets[i];

            if (!bullet.node.active) {
              // 子弹已回收，移除
              this._bullets[i] = this._bullets[this._bullets.length - 1];

              this._bullets.pop();

              continue;
            }

            var z = bullet.node.worldPosition.z;

            var bIdx = this._getBucketIdx(z);

            this.markBulletBucketUsed(bIdx);

            this._bulletBuckets[bIdx].push(bullet);
          } // 3. 将目标放入桶（按COLLIDE_TYPE分组）


          for (var typeStr in this._targetGroups) {
            var group = this._targetGroups[typeStr]; // 确保目标桶存在

            if (!this._targetBuckets[typeStr]) {
              this._targetBuckets[typeStr] = [];
              this._usedTargetBucketIndices[typeStr] = [];
              this._targetBucketUsed[typeStr] = [];

              for (var _i = 0; _i < this._bucketCount; _i++) {
                this._targetBuckets[typeStr][_i] = [];
                this._targetBucketUsed[typeStr][_i] = false;
              }
            }

            var tBuckets = this._targetBuckets[typeStr];

            for (var _i2 = group.targets.length - 1; _i2 >= 0; _i2--) {
              var target = group.targets[_i2];

              if (target.isDie || !target.node.active) {
                // 已死亡目标，移除
                group.targets[_i2] = group.targets[group.targets.length - 1];
                group.targets.pop();
                continue;
              }

              var targetData = this.getTargetFrameData(target);

              var minTargetBucketIdx = this._getBucketIdx(targetData.z - targetData.halfZ);

              var maxTargetBucketIdx = this._getBucketIdx(targetData.z + targetData.halfZ);

              for (var bucketIdx = minTargetBucketIdx; bucketIdx <= maxTargetBucketIdx; bucketIdx++) {
                this.markTargetBucketUsed(typeStr, bucketIdx);
                tBuckets[bucketIdx].push(target);
              }
            }
          } // 4. 逐桶碰撞检测


          for (var _bIdx = 0; _bIdx < this._bucketCount; _bIdx++) {
            var bucketBullets = this._bulletBuckets[_bIdx];
            if (bucketBullets.length === 0) continue;

            for (var bi = 0; bi < bucketBullets.length; bi++) {
              var _bullet = bucketBullets[bi];
              if (!_bullet.node.active) continue;
              var bx = _bullet.node.worldPosition.x;
              var bz = _bullet.node.worldPosition.z;

              var prevPos = _bullet.getPreviousWorldPosition(this._tempBulletPrevPos);

              var prevX = prevPos.x;
              var prevZ = prevPos.z;
              var bHalfX = _bullet.collisionHalfX;
              var bHalfZ = _bullet.collisionHalfZ;
              var sweptMinX = Math.min(prevX, bx) - bHalfX;
              var sweptMaxX = Math.max(prevX, bx) + bHalfX;

              var minBucketIdx = this._getBucketIdx(Math.min(prevZ, bz) - bHalfZ);

              var maxBucketIdx = this._getBucketIdx(Math.max(prevZ, bz) + bHalfZ);

              var visualOffset = _bullet.getBatchVisualMaxOffset(this._tempBulletVisualOffset);

              var wallHalfX = bHalfX + visualOffset.x;
              var wallHalfZ = bHalfZ + visualOffset.z;
              var wallSweptMinX = Math.min(prevX, bx) - wallHalfX;
              var wallSweptMaxX = Math.max(prevX, bx) + wallHalfX;

              var wallMinBucketIdx = this._getBucketIdx(Math.min(prevZ, bz) - wallHalfZ);

              var wallMaxBucketIdx = this._getBucketIdx(Math.max(prevZ, bz) + wallHalfZ);

              if (this.tryRecycleBulletByWallHit(_bullet, prevX, prevZ, bx, bz, wallHalfX, wallHalfZ, wallSweptMinX, wallSweptMaxX, wallMinBucketIdx, wallMaxBucketIdx)) {
                continue;
              } // 遍历子弹的 attackTargetTag


              var targetTags = _bullet.attackTargetTag;

              for (var ti = 0; ti < targetTags.length; ti++) {
                var _typeStr = String(targetTags[ti]);

                var _group = this._targetGroups[_typeStr];
                if (!_group) continue; // x范围预过滤

                if (sweptMaxX < _group.xMin || sweptMinX > _group.xMax) continue;
                var _tBuckets = this._targetBuckets[_typeStr];
                if (!_tBuckets) continue;
                var targetCheckId = this._targetCheckId++;

                for (var checkBucketIdx = minBucketIdx; checkBucketIdx <= maxBucketIdx && _bullet.node.active; checkBucketIdx++) {
                  var bucketTargets = _tBuckets[checkBucketIdx];
                  if (!bucketTargets) continue;

                  for (var mj = 0; mj < bucketTargets.length && _bullet.node.active; mj++) {
                    var _target = bucketTargets[mj];
                    if (_target.isDie || this._targetCheckedStamp.get(_target) === targetCheckId) continue;

                    this._targetCheckedStamp.set(_target, targetCheckId); // AABB碰撞判定


                    var _targetData = this.getTargetFrameData(_target);

                    var tx = _targetData.x;
                    var tz = _targetData.z;
                    var tHalfX = _targetData.halfX;
                    var tHalfZ = _targetData.halfZ;

                    if (this.isSweptBulletHit(prevX, prevZ, bx, bz, bHalfX, bHalfZ, tx, tz, tHalfX, tHalfZ)) {
                      // 碰撞命中！调用子弹的命中处理（迁移自原 _startCollide）
                      _bullet.onHitTarget(_target);
                    }
                  }
                }
              }
            }
          } // 5. 更新各组x范围（低频更新即可，每10帧更新一次）


          if (this._frameCount % 10 === 0) {
            for (var _typeStr2 in this._targetGroups) {
              this._targetGroups[_typeStr2].updateXRange();
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
            var cached = this._staticTargetFrameData.get(target);

            if ((cached == null ? void 0 : cached.frame) === this._frameCount) {
              return cached;
            }

            var _pos = target.getCollisionWorldPosition(this._tempVec3);

            var data = cached != null ? cached : {
              frame: -1,
              x: 0,
              z: 0,
              halfX: 0,
              halfZ: 0
            };
            this.writeTargetFrameData(data, target, _pos);

            this._staticTargetFrameData.set(target, data);

            return data;
          }

          var pos = target.getCollisionWorldPosition(this._tempVec3);
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
          for (var i = 0; i < this._usedBulletBucketIndices.length; i++) {
            var index = this._usedBulletBucketIndices[i];
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

          for (var i = 0; i < this._bucketCount; i++) {
            this._bulletBuckets[i].length = 0;
            this._bulletBucketUsed[i] = false;
          }

          this._usedBulletBucketIndices.length = 0;

          for (var _groupId in this._targetBuckets) {
            var buckets = this._targetBuckets[_groupId];
            var usedFlags = this._targetBucketUsed[_groupId];

            for (var _i3 = 0; _i3 < this._bucketCount; _i3++) {
              buckets[_i3].length = 0;
              usedFlags[_i3] = false;
            }

            this._usedTargetBucketIndices[_groupId].length = 0;
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
          for (var _groupId2 in this._usedTargetBucketIndices) {
            var usedIndices = this._usedTargetBucketIndices[_groupId2];
            var buckets = this._targetBuckets[_groupId2];
            var usedFlags = this._targetBucketUsed[_groupId2];

            for (var i = 0; i < usedIndices.length; i++) {
              var index = usedIndices[i];
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
          var scene = director.getScene();

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

          for (var i = 0; i < this._bucketCount; i++) {
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
            var obstacle = {
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

          for (var i = 0; i < node.children.length; i++) {
            this.collectWallObstacles(node.children[i]);
          }
        }
        /** Game_3D-002 中将 gld 左右两侧分别聚合为一个虚拟 AABB。 */


        collectGldSideObstacle(gld, sideName) {
          var side = gld.children.find(child => child.name === sideName);

          if (!side) {
            return;
          }

          this._gldSideCount++;
          var obstacle = {
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

        collectGelidunMeshRenderers(node, out, insideGelidun) {
          if (insideGelidun === void 0) {
            insideGelidun = false;
          }

          var isGelidun = insideGelidun || node.name.indexOf('SM_gelidun_') === 0;

          if (isGelidun) {
            var renderer = node.getComponent(MeshRenderer);

            if (renderer) {
              out.push(renderer);
            }
          }

          for (var i = 0; i < node.children.length; i++) {
            this.collectGelidunMeshRenderers(node.children[i], out, isGelidun);
          }
        }

        collectMeshRenderers(node, out) {
          var renderer = node.getComponent(MeshRenderer);

          if (renderer) {
            out.push(renderer);
          }

          for (var i = 0; i < node.children.length; i++) {
            this.collectMeshRenderers(node.children[i], out);
          }
        }

        updateWallObstacleBounds(obstacle, requireAllRenderers) {
          if (requireAllRenderers === void 0) {
            requireAllRenderers = false;
          }

          if (!requireAllRenderers && !obstacle.node.activeInHierarchy) {
            return false;
          }

          var minX = Number.POSITIVE_INFINITY;
          var maxX = Number.NEGATIVE_INFINITY;
          var minZ = Number.POSITIVE_INFINITY;
          var maxZ = Number.NEGATIVE_INFINITY;
          var found = false;
          var validRendererCount = 0;

          for (var i = 0; i < obstacle.renderers.length; i++) {
            var _model;

            var renderer = obstacle.renderers[i];

            if (!renderer || !requireAllRenderers && !renderer.node.activeInHierarchy) {
              continue;
            }

            var worldBounds = renderer == null || (_model = renderer.model) == null ? void 0 : _model.worldBounds;
            var center = worldBounds == null ? void 0 : worldBounds.center;
            var halfExtents = worldBounds == null ? void 0 : worldBounds.halfExtents;

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
          var minIdx = this._getBucketIdx(obstacle.minZ);

          var maxIdx = this._getBucketIdx(obstacle.maxZ);

          for (var i = minIdx; i <= maxIdx; i++) {
            this._wallBuckets[i].push(obstacle);
          }
        }

        tryRecycleBulletByWallHit(bullet, prevX, prevZ, curX, curZ, bHalfX, bHalfZ, sweptMinX, sweptMaxX, minBucketIdx, maxBucketIdx) {
          if (this._wallObstacles.length <= 0) {
            return false;
          }

          var wallCheckId = this._wallCheckId++;

          for (var bucketIdx = minBucketIdx; bucketIdx <= maxBucketIdx; bucketIdx++) {
            var walls = this._wallBuckets[bucketIdx];

            if (!walls || walls.length <= 0) {
              continue;
            }

            for (var i = 0; i < walls.length; i++) {
              var wall = walls[i];

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
          var dx = curX - prevX;
          var dz = curZ - prevZ;
          var enter = 0;
          var exit = 1;

          if (Math.abs(dx) <= 0.000001) {
            if (prevX < minX || prevX > maxX) {
              return false;
            }
          } else {
            var _t = (minX - prevX) / dx;

            var _t2 = (maxX - prevX) / dx;

            if (_t > _t2) {
              var temp = _t;
              _t = _t2;
              _t2 = temp;
            }

            if (_t > enter) {
              enter = _t;
            }

            if (_t2 < exit) {
              exit = _t2;
            }

            if (enter > exit) {
              return false;
            }
          }

          if (Math.abs(dz) <= 0.000001) {
            return prevZ >= minZ && prevZ <= maxZ;
          }

          var t1 = (minZ - prevZ) / dz;
          var t2 = (maxZ - prevZ) / dz;

          if (t1 > t2) {
            var _temp = t1;
            t1 = t2;
            t2 = _temp;
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
          var list = [];

          for (var typeStr in this._targetGroups) {
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