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
          this._checkedTargets = [];

          /** 子弹桶 - 每帧重建 */
          this._bulletBuckets = [];

          /** 目标桶 - 按组ID+桶索引存储 */
          this._targetBuckets = {};
          this._directorCallback = void 0;
          this._frameCount = 0;

          for (let i = 0; i < this._bucketCount; i++) {
            this._bulletBuckets[i] = [];
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

          this._targetGroups[type].updateXRange();
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

          group.updateXRange();
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

          for (let i = 0; i < this._bucketCount; i++) {
            this._bulletBuckets[i].length = 0;
          }
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
          // 1. 清空桶数组（只重置length=0，不释放内存）
          for (let i = 0; i < this._bucketCount; i++) {
            this._bulletBuckets[i].length = 0;
          } // 清空目标桶


          for (const groupId in this._targetBuckets) {
            for (let i = 0; i < this._bucketCount; i++) {
              if (this._targetBuckets[groupId][i]) {
                this._targetBuckets[groupId][i].length = 0;
              }
            }
          } // 2. 将子弹放入桶


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
          } // 3. 将目标放入桶（按COLLIDE_TYPE分组）


          for (const typeStr in this._targetGroups) {
            const group = this._targetGroups[typeStr]; // 确保目标桶存在

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

              tBuckets[bIdx].push(target); // 放入相邻桶防止边界遗漏

              if (bIdx > 0) tBuckets[bIdx - 1].push(target);
              if (bIdx < this._bucketCount - 1) tBuckets[bIdx + 1].push(target);
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

              const maxBucketIdx = this._getBucketIdx(Math.max(prevZ, bz) + bHalfZ); // 遍历子弹的 attackTargetTag


              const targetTags = bullet.attackTargetTag;

              for (let ti = 0; ti < targetTags.length; ti++) {
                const typeStr = String(targetTags[ti]);
                const group = this._targetGroups[typeStr];
                if (!group) continue; // x范围预过滤

                if (sweptMaxX < group.xMin || sweptMinX > group.xMax) continue;
                const tBuckets = this._targetBuckets[typeStr];
                if (!tBuckets) continue;
                this._checkedTargets.length = 0;

                for (let checkBucketIdx = minBucketIdx; checkBucketIdx <= maxBucketIdx && bullet.node.active; checkBucketIdx++) {
                  const bucketTargets = tBuckets[checkBucketIdx];
                  if (!bucketTargets) continue;

                  for (let mj = 0; mj < bucketTargets.length && bullet.node.active; mj++) {
                    const target = bucketTargets[mj];
                    if (target.isDie || this._checkedTargets.indexOf(target) !== -1) continue;

                    this._checkedTargets.push(target); // AABB碰撞判定


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
          } // 5. 更新各组x范围（低频更新即可，每10帧更新一次）


          if (this._frameCount % 10 === 0) {
            for (const typeStr in this._targetGroups) {
              this._targetGroups[typeStr].updateXRange();
            }
          }

          this._frameCount++;
        }

        isSweptBulletHit(prevX, prevZ, curX, curZ, bHalfX, bHalfZ, targetX, targetZ, targetHalfX, targetHalfZ) {
          const minX = targetX - targetHalfX - bHalfX;
          const maxX = targetX + targetHalfX + bHalfX;
          const minZ = targetZ - targetHalfZ - bHalfZ;
          const maxZ = targetZ + targetHalfZ + bHalfZ;
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

      }) || _class2));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e13771ea8032dbc1728530af431c57de3b1e5e24.js.map