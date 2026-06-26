System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Vec3, director, Director, MeshRenderer, Singleton, CollisionTargetGroup, _dec, _class2, _crd, ccclass, property, BulletMonsterCollisionManager;

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

      };
      /**
       * 自定义碰撞管理器 - 替代物理引擎进行子弹与目标的碰撞检测
       * iOS优化：用数组而非Map，预分配Vec3，AABB判定，零GC
       */

      _export("default", BulletMonsterCollisionManager = (_dec = ccclass('BulletMonsterCollisionManager'), _dec(_class2 = class BulletMonsterCollisionManager extends (_crd && Singleton === void 0 ? (_reportPossibleCrUseOfSingleton({
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
          this._targetCheckedStamp = new WeakMap();
          this._wallCheckedStamp = new WeakMap();

          /** 子弹桶 - 每帧重建 */
          this._bulletBuckets = [];

          /** 目标桶 - 按组ID+桶索引存储 */
          this._targetBuckets = {};
          this._wallBuckets = [];
          this._wallObstacles = [];
          this._wallScene = null;
          this._nextWallRefreshFrame = 0;
          this._targetCheckId = 1;
          this._wallCheckId = 1;
          this._directorCallback = void 0;
          this._frameCount = 0;

          for (var i = 0; i < this._bucketCount; i++) {
            this._bulletBuckets[i] = [];
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

          this._targetGroups[type].updateXRange();
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

          group.updateXRange();
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

          for (var i = 0; i < this._bucketCount; i++) {
            this._bulletBuckets[i].length = 0;
          }
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
          this.ensureWallObstacles(); // 1. 清空桶数组（只重置length=0，不释放内存）

          for (var i = 0; i < this._bucketCount; i++) {
            this._bulletBuckets[i].length = 0;
          } // 清空目标桶


          for (var _groupId in this._targetBuckets) {
            for (var _i = 0; _i < this._bucketCount; _i++) {
              if (this._targetBuckets[_groupId][_i]) {
                this._targetBuckets[_groupId][_i].length = 0;
              }
            }
          } // 2. 将子弹放入桶


          for (var _i2 = this._bullets.length - 1; _i2 >= 0; _i2--) {
            var bullet = this._bullets[_i2];

            if (!bullet.node.active) {
              // 子弹已回收，移除
              this._bullets[_i2] = this._bullets[this._bullets.length - 1];

              this._bullets.pop();

              continue;
            }

            var z = bullet.node.worldPosition.z;

            var bIdx = this._getBucketIdx(z);

            this._bulletBuckets[bIdx].push(bullet);
          } // 3. 将目标放入桶（按COLLIDE_TYPE分组）


          for (var typeStr in this._targetGroups) {
            var group = this._targetGroups[typeStr]; // 确保目标桶存在

            if (!this._targetBuckets[typeStr]) {
              this._targetBuckets[typeStr] = [];

              for (var _i3 = 0; _i3 < this._bucketCount; _i3++) {
                this._targetBuckets[typeStr][_i3] = [];
              }
            }

            var tBuckets = this._targetBuckets[typeStr];

            for (var _i4 = group.targets.length - 1; _i4 >= 0; _i4--) {
              var target = group.targets[_i4];

              if (target.isDie || !target.node.active) {
                // 已死亡目标，移除
                group.targets[_i4] = group.targets[group.targets.length - 1];
                group.targets.pop();
                continue;
              }

              var _z = target.getCollisionWorldPosition(this._tempVec3).z;

              var _bIdx = this._getBucketIdx(_z);

              tBuckets[_bIdx].push(target); // 放入相邻桶防止边界遗漏


              if (_bIdx > 0) tBuckets[_bIdx - 1].push(target);
              if (_bIdx < this._bucketCount - 1) tBuckets[_bIdx + 1].push(target);
            }
          } // 4. 逐桶碰撞检测


          for (var _bIdx2 = 0; _bIdx2 < this._bucketCount; _bIdx2++) {
            var bucketBullets = this._bulletBuckets[_bIdx2];
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

              if (this.tryRecycleBulletByWallHit(_bullet, prevX, prevZ, bx, bz, bHalfX, bHalfZ, sweptMinX, sweptMaxX, minBucketIdx, maxBucketIdx)) {
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


                    var targetPos = _target.getCollisionWorldPosition(this._tempVec3);

                    var tx = targetPos.x;
                    var tz = targetPos.z;
                    var tHalfX = _target.collisionHalfX;
                    var tHalfZ = _target.collisionHalfZ;

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
            this._nextWallRefreshFrame = this._wallObstacles.length > 0 ? Number.MAX_SAFE_INTEGER : this._frameCount + 1;
          }
        }

        clearWallObstacles() {
          this._wallObstacles.length = 0;

          for (var i = 0; i < this._bucketCount; i++) {
            this._wallBuckets[i].length = 0;
          }
        }

        rebuildWallObstacles(scene) {
          this.clearWallObstacles();
          this.collectWallObstacles(scene);
        }

        collectWallObstacles(node) {
          if (!node) {
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

        collectMeshRenderers(node, out) {
          var renderer = node.getComponent(MeshRenderer);

          if (renderer) {
            out.push(renderer);
          }

          for (var i = 0; i < node.children.length; i++) {
            this.collectMeshRenderers(node.children[i], out);
          }
        }

        updateWallObstacleBounds(obstacle) {
          if (!obstacle.node.activeInHierarchy) {
            return false;
          }

          var minX = Number.POSITIVE_INFINITY;
          var maxX = Number.NEGATIVE_INFINITY;
          var minZ = Number.POSITIVE_INFINITY;
          var maxZ = Number.NEGATIVE_INFINITY;
          var found = false;

          for (var i = 0; i < obstacle.renderers.length; i++) {
            var _model;

            var renderer = obstacle.renderers[i];

            if (!renderer || !renderer.node.activeInHierarchy) {
              continue;
            }

            var worldBounds = renderer == null || (_model = renderer.model) == null ? void 0 : _model.worldBounds;
            var center = worldBounds == null ? void 0 : worldBounds.center;
            var halfExtents = worldBounds == null ? void 0 : worldBounds.halfExtents;

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

      }) || _class2));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e13771ea8032dbc1728530af431c57de3b1e5e24.js.map