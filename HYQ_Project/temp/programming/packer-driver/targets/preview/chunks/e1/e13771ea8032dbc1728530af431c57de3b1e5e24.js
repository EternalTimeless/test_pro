System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Vec3, director, Director, Singleton, CollisionTargetGroup, _dec, _class2, _crd, ccclass, property, BulletMonsterCollisionManager;

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
    }, function (_unresolved_2) {
      Singleton = _unresolved_2.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e603cVqmUVFdKngtJ8SEsOF", "BulletMonsterCollisionManager", undefined);

      __checkObsolete__(['CCFloat', '_decorator', 'Vec3', 'director', 'Director']);

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
            var x = t.node.worldPosition.x;
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

          /** 子弹桶 - 每帧重建 */
          this._bulletBuckets = [];

          /** 目标桶 - 按组ID+桶索引存储 */
          this._targetBuckets = {};
          this._directorCallback = void 0;
          this._frameCount = 0;

          for (var i = 0; i < this._bucketCount; i++) {
            this._bulletBuckets[i] = [];
          } // 使用 director 的每帧回调驱动碰撞检测


          this._directorCallback = dt => {
            this.update(dt);
          };

          director.on(Director.EVENT_AFTER_UPDATE, this._directorCallback);
        }
        /** 注册子弹 */


        registerBullet(bullet) {
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
        /** 获取桶索引 */


        _getBucketIdx(z) {
          var idx = (z - this._zMin) / this._bucketSize | 0;
          if (idx < 0) return 0;
          if (idx >= this._bucketCount) return this._bucketCount - 1;
          return idx;
        }
        /** 每帧碰撞检测 */


        update(dt) {
          // 1. 清空桶数组（只重置length=0，不释放内存）
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

              var _z = target.node.worldPosition.z;

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
              var bHalfX = _bullet.collisionHalfX;
              var bHalfZ = _bullet.collisionHalfZ; // 遍历子弹的 attackTargetTag

              var targetTags = _bullet.attackTargetTag;

              for (var ti = 0; ti < targetTags.length; ti++) {
                var _typeStr = String(targetTags[ti]);

                var _group = this._targetGroups[_typeStr];
                if (!_group) continue; // x范围预过滤

                if (bx + bHalfX < _group.xMin || bx - bHalfX > _group.xMax) continue;
                var _tBuckets = this._targetBuckets[_typeStr];
                if (!_tBuckets) continue;
                var bucketTargets = _tBuckets[_bIdx2];
                if (!bucketTargets) continue;

                for (var mj = 0; mj < bucketTargets.length; mj++) {
                  var _target = bucketTargets[mj];
                  if (_target.isDie) continue; // AABB碰撞判定

                  var tx = _target.node.worldPosition.x;
                  var tz = _target.node.worldPosition.z;
                  var tHalfX = _target.collisionHalfX;
                  var tHalfZ = _target.collisionHalfZ;
                  var dx = bx - tx;
                  var dz = bz - tz;
                  var overlapX = bHalfX + tHalfX;
                  var overlapZ = bHalfZ + tHalfZ;

                  if (dx < overlapX && dx > -overlapX && dz < overlapZ && dz > -overlapZ) {
                    // 碰撞命中！调用子弹的命中处理（迁移自原 _startCollide）
                    _bullet.onHitTarget(_target);
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

      }) || _class2));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e13771ea8032dbc1728530af431c57de3b1e5e24.js.map