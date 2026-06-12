System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Color, director, Director, game, Material, FlashEntry, FlashRedManager, _crd;

  _export("FlashRedManager", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Color = _cc.Color;
      director = _cc.director;
      Director = _cc.Director;
      game = _cc.game;
      Material = _cc.Material;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7eeb7Dj8epNFrTseT8DQapB", "FlashRedManager", undefined);

      /** 闪红属性配置接口 */
      __checkObsolete__(['Color', 'director', 'Director', 'game', 'Material', 'MeshRenderer', 'Node']);
      /** 开关属性配置接口（用于float类型uniform的开关控制，如 u_flashEnable 0→1→0） */

      /** 闪红MeshRenderer配置接口 */


      /** 闪红条目 - 由对象池管理 */
      FlashEntry = class FlashEntry {
        constructor() {
          /** 目标节点 */
          this.node = null;

          /** 闪红配置 */
          this.flashDataList = null;

          /** 剩余时间 */
          this.remainingTime = 0;

          /** 闪红颜色 */
          this.flashColor = new Color(255, 0, 0, 255);

          /** 保存的原始共享材质 */
          this.savedMats = [];

          /** 分组缓存key（有值=走分组快速通道，跳过逐属性设置） */
          this.groupKey = null;
        }

        reset() {
          this.node = null;
          this.flashDataList = null;
          this.remainingTime = 0;
          this.savedMats.length = 0;
          this.groupKey = null;
        }

      };
      /**
       * 闪红管理器 - 独立于继承体系，任何地方都可调用
       *
       * 使用方式：
       * ```ts
       * import { FlashRedManager } from './FlashRedManager';
       *
       * // 方式1：传入 IFlashData 数组
       * FlashRedManager.instance.flashRed(node, flashDataList, 0.15);
       *
       * // 方式2：配合 BattleTargetBase 的 meshFlashDataList
       * FlashRedManager.instance.flashRed(this.node, this.meshFlashDataList, 0.15);
       *
       * // 停止闪红
       * FlashRedManager.instance.stopFlashRed(node);
       * ```
       *
       * 优化特性：
       * - 按需注册/注销 director 帧回调，无闪红时零开销
       * - 对象池复用 FlashEntry，减少 GC
       * - 节点销毁时自动清理，无内存泄漏
       * - 闪红结束后恢复共享材质，确保重新合批
       */

      _export("FlashRedManager", FlashRedManager = class FlashRedManager {
        static get instance() {
          if (!FlashRedManager._instance) {
            FlashRedManager._instance = new FlashRedManager();
          }

          return FlashRedManager._instance;
        }
        /** 默认闪红颜色 */


        constructor() {
          /** 活跃的闪红条目，按节点UUID索引 */
          this._activeFlashes = new Map();

          /** 待处理的闪红条目队列（帧限流用） */
          this._pendingQueue = [];

          /** 待处理队列的UUID集合，用于O(1)去重查询 */
          this._pendingUuids = new Set();

          /**
           * 每帧最多处理的新闪红请求数。
           * 大量单位同时闪红时可适当调大（如20~50），避免分帧导致闪红延迟。
           * @default 5
           */
          this.maxNewPerFrame = 70;

          /** 对象池 */
          this._pool = [];

          /** 帧回调引用 */
          this._directorCallback = void 0;

          /** 是否已注册帧回调 */
          this._registered = false;

          this._directorCallback = () => {
            this._update();
          };
        }
        /** 从池中获取或创建 FlashEntry */


        _acquire() {
          return this._pool.length > 0 ? this._pool.pop() : new FlashEntry();
        }
        /** 归还 FlashEntry 到池中 */


        _release(entry) {
          entry.reset();

          this._pool.push(entry);
        }
        /** 注册帧回调（按需注册，无闪红时零开销） */


        _registerUpdate() {
          if (!this._registered) {
            director.on(Director.EVENT_AFTER_UPDATE, this._directorCallback);
            this._registered = true;
          }
        }
        /** 注销帧回调 */


        _unregisterUpdate() {
          if (this._registered) {
            director.off(Director.EVENT_AFTER_UPDATE, this._directorCallback);
            this._registered = false;
          }
        }
        /**
         * 触发闪红效果
         * - 闪红途中再次调用不会触发
         * - 闪红前保存原始共享材质，闪红后恢复共享材质以重新合批
         * - 每个MeshRenderer可单独配置颜色属性名列表，兼容不同shader
         *
         * @param node 目标节点（用于标识闪红实例、节点有效性检查）
         * @param flashDataList MeshRenderer闪红配置列表（实现 IFlashData 接口即可）
         * @param duration 闪红持续时间（秒），默认0.15
         * @param flashColor 闪红颜色，默认红色 (255,50,50,255)
         * @param groupKey 分组标识。同组首次闪红会缓存材质模板，后续同组闪红直接复用模板，
         *                 跳过所有 pass.setUniform 调用，大幅降低批量闪红的材质修改开销。
         *                 典型用法：同类型敌人传同一个 key，如 'enemy_hit'。
         */


        flashRed(node, flashDataList, duration, flashColor, groupKey) {
          if (duration === void 0) {
            duration = 0.15;
          }

          if (flashColor === void 0) {
            flashColor = null;
          }

          if (!node || !node.isValid) return;
          if (!flashDataList || flashDataList.length === 0) return;
          var uuid = node.uuid; // 闪红途中或已在队列中则不再添加

          if (this._activeFlashes.has(uuid) || this._pendingUuids.has(uuid)) return;

          var entry = this._acquire();

          entry.node = node;
          entry.flashDataList = flashDataList;
          entry.remainingTime = duration;
          entry.groupKey = groupKey != null ? groupKey : null;

          if (flashColor) {
            entry.flashColor.set(flashColor);
          } else {
            entry.flashColor.set(FlashRedManager.DEFAULT_COLOR);
          } // 入队等待处理，不在本帧直接 _applyFlash


          this._pendingQueue.push(entry);

          this._pendingUuids.add(uuid);

          this._registerUpdate();
        }
        /**
         * 停止指定节点的闪红效果，立即恢复原始材质
         */


        stopFlashRed(node) {
          if (!node) return;

          var entry = this._activeFlashes.get(node.uuid);

          if (!entry) return;

          this._restoreEntry(entry);

          this._activeFlashes.delete(node.uuid);

          this._release(entry);

          if (this._activeFlashes.size === 0) {
            this._unregisterUpdate();
          }
        }
        /**
         * 检查指定节点是否正在闪红
         */


        isFlashing(node) {
          return node ? this._activeFlashes.has(node.uuid) : false;
        }
        /**
         * 清除分组材质模板缓存。
         * @param groupKey 不传则清除全部缓存
         */


        clearGroupCache(groupKey) {
          if (groupKey) {
            FlashRedManager._groupCache.delete(groupKey);
          } else {
            FlashRedManager._groupCache.clear();
          }
        }
        /**
         * 获取缓存的 pass uniform handle，避免每次闪红都做 pass.getHandle() 字符串查找。
         * 缓存用 WeakMap<pass, Map<propName, handle>> 结构，pass 销毁时自动清理。
         */


        static _getCachedHandle(pass, propName) {
          var propMap = FlashRedManager._handleCache.get(pass);

          if (!propMap) {
            propMap = new Map();

            FlashRedManager._handleCache.set(pass, propMap);
          }

          if (propMap.has(propName)) {
            return propMap.get(propName);
          }

          var handle = pass.getHandle(propName);

          if (handle !== undefined && handle >= 0) {
            propMap.set(propName, handle);
            return handle;
          }

          return undefined;
        }
        /** 应用闪红效果 */


        _applyFlash(entry) {
          var color = entry.flashColor;
          var groupKey = entry.groupKey;

          for (var data of entry.flashDataList) {
            var mr = data.meshRender;
            if (!mr || !mr.isValid) continue;
            var originalMats = [...mr.sharedMaterials];
            entry.savedMats.push({
              renderer: mr,
              originalMats
            }); // 计算哪些材质索引需要实例化（-1 = 全部需要）

            var needAll = data.colorProps.some(p => {
              var _p$matIndex;

              return ((_p$matIndex = p.matIndex) != null ? _p$matIndex : -1) < 0;
            }) || (data.switchProps || []).some(p => {
              var _p$matIndex2;

              return ((_p$matIndex2 = p.matIndex) != null ? _p$matIndex2 : -1) < 0;
            });
            var neededSet = new Set();

            if (!needAll) {
              for (var p of data.colorProps) {
                var _p$matIndex3;

                neededSet.add((_p$matIndex3 = p.matIndex) != null ? _p$matIndex3 : 0);
              }

              for (var _p of data.switchProps || []) {
                var _p$matIndex4;

                neededSet.add((_p$matIndex4 = _p.matIndex) != null ? _p$matIndex4 : 0);
              }
            } // ====== 快速通道：分组缓存命中 ======


            if (groupKey && FlashRedManager._groupCache.has(groupKey)) {
              // 用预配置的模板材质逐槽替换。
              // 不用 sharedMaterials setter 一次性赋值，逐个 setSharedMaterial 更明确。
              var templates = FlashRedManager._groupCache.get(groupKey);

              for (var i = 0; i < templates.length; i++) {
                if (templates[i]) {
                  mr.setSharedMaterial(templates[i], i);
                }
              }

              continue;
            } // ====== 慢速通道：首次创建实例并逐属性设置 ======


            var totalMats = mr.sharedMaterials.length;

            for (var _i = 0; _i < totalMats; _i++) {
              if (!needAll && !neededSet.has(_i)) continue;
              var mat = mr.getMaterialInstance(_i);
              if (!mat) continue;

              for (var propData of data.colorProps) {
                var _propData$matIndex;

                if (!propData.propName) continue;
                var targetMatIdx = (_propData$matIndex = propData.matIndex) != null ? _propData$matIndex : -1;
                if (targetMatIdx >= 0 && targetMatIdx !== _i) continue;
                var passIdx = propData.passIndex;
                var pass = mat.passes[passIdx];
                if (!pass) continue;

                var handle = FlashRedManager._getCachedHandle(pass, propData.propName);

                if (handle !== undefined) {
                  pass.setUniform(handle, color);
                }
              }

              for (var switchProp of data.switchProps || []) {
                var _switchProp$matIndex;

                if (!switchProp.propName) continue;

                var _targetMatIdx = (_switchProp$matIndex = switchProp.matIndex) != null ? _switchProp$matIndex : -1;

                if (_targetMatIdx >= 0 && _targetMatIdx !== _i) continue;

                if (switchProp.useMaterialProp) {
                  mat.setProperty(switchProp.propName, switchProp.flashValue);
                } else {
                  var _passIdx = switchProp.passIndex;
                  var _pass = mat.passes[_passIdx];
                  if (!_pass) continue;

                  var _handle = FlashRedManager._getCachedHandle(_pass, switchProp.propName);

                  if (_handle !== undefined) {
                    _pass.setUniform(_handle, switchProp.flashValue);
                  }
                }
              }
            } // ====== 填充分组缓存 ======
            // 关键：不从 MaterialInstance 复制（copy() 可能丢失实例覆盖的 uniform 值），
            // 而是从原始共享材质出发，把闪红属性直接设置到独立模板上。


            if (groupKey && !FlashRedManager._groupCache.has(groupKey)) {
              FlashRedManager._groupCache.set(groupKey, this._buildGroupTemplates(mr, originalMats, data, color, needAll, neededSet));
            }
          }
        }
        /**
         * 从原始共享材质构建分组模板。
         * 不走 MaterialInstance.copy()，避免丢失 uniform 覆盖值。
         * 模板 = 原始共享材质副本 + 闪红属性直接写入。
         */


        _buildGroupTemplates(mr, originalMats, data, color, needAll, neededSet) {
          var templates = [];

          for (var i = 0; i < mr.sharedMaterials.length; i++) {
            if (!needAll && !neededSet.has(i)) {
              templates[i] = originalMats[i];
              continue;
            }

            var sharedMat = originalMats[i];

            if (!sharedMat) {
              templates[i] = null;
              continue;
            }

            var tpl = new Material();
            tpl.copy(sharedMat); // 直接往模板上设置闪红颜色属性

            for (var propData of data.colorProps) {
              var _propData$matIndex2;

              if (!propData.propName) continue;
              var targetMatIdx = (_propData$matIndex2 = propData.matIndex) != null ? _propData$matIndex2 : -1;
              if (targetMatIdx >= 0 && targetMatIdx !== i) continue;
              var pass = tpl.passes[propData.passIndex];
              if (!pass) continue;
              var handle = pass.getHandle(propData.propName);

              if (handle !== undefined && handle >= 0) {
                pass.setUniform(handle, color);
              }
            } // 直接往模板上设置开关属性


            for (var switchProp of data.switchProps || []) {
              var _switchProp$matIndex2;

              if (!switchProp.propName) continue;

              var _targetMatIdx2 = (_switchProp$matIndex2 = switchProp.matIndex) != null ? _switchProp$matIndex2 : -1;

              if (_targetMatIdx2 >= 0 && _targetMatIdx2 !== i) continue;

              if (switchProp.useMaterialProp) {
                tpl.setProperty(switchProp.propName, switchProp.flashValue);
              } else {
                var _pass2 = tpl.passes[switchProp.passIndex];
                if (!_pass2) continue;

                var _handle2 = _pass2.getHandle(switchProp.propName);

                if (_handle2 !== undefined && _handle2 >= 0) {
                  _pass2.setUniform(_handle2, switchProp.flashValue);
                }
              }
            }

            templates[i] = tpl;
          }

          return templates;
        }
        /** 恢复闪红条目的原始状态，恢复合批 */


        _restoreEntry(entry) {
          for (var {
            renderer: savedMr,
            originalMats
          } of entry.savedMats) {
            if (!savedMr || !savedMr.isValid) continue; // 关键：必须先清空再恢复，不能直接赋值 originalMats！
            //
            // Cocos 3.8 引擎 sharedMaterials setter 内部逻辑：
            //   set sharedMaterials(val) {
            //       for (i) { if (val[i] !== this._materials[i]) setSharedMaterial(val[i], i); }
            //   }
            //
            // 闪红期间只修改了 _materialInstances，_materials（共享材质）从未变过，
            // 所以直接赋值 originalMats 时 val[i] === this._materials[i]（同一引用），
            // setSharedMaterial 不会被调用，材质实例不会被销毁，合批无法恢复！
            //
            // 解决：先设为空数组 → 触发 setSharedMaterial(null, i) → 销毁材质实例 → 再恢复原始共享材质
            // 同一帧内两次赋值，无视觉闪烁

            savedMr.sharedMaterials = [];
            savedMr.sharedMaterials = originalMats;
          }
        }
        /** 每帧更新，处理待处理队列和闪红超时、节点销毁 */


        _update() {
          var dt = game.deltaTime; // 1. 从待处理队列取最多 maxNewPerFrame 个执行

          var processed = 0;

          while (this._pendingQueue.length > 0 && processed < this.maxNewPerFrame) {
            var entry = this._pendingQueue.shift();

            processed++;

            if (!entry.node) {
              this._release(entry);

              continue;
            }

            this._pendingUuids.delete(entry.node.uuid);

            if (!entry.node.isValid) {
              this._release(entry);

              continue;
            }

            this._applyFlash(entry);

            this._activeFlashes.set(entry.node.uuid, entry);
          } // 2. 处理活跃闪红超时


          if (this._activeFlashes.size === 0 && this._pendingQueue.length === 0) {
            this._unregisterUpdate();

            return;
          }

          var toRemoveKeys = [];

          this._activeFlashes.forEach((entry, uuid) => {
            if (!entry.node || !entry.node.isValid) {
              toRemoveKeys.push(uuid);

              this._release(entry);

              return;
            }

            entry.remainingTime -= dt;

            if (entry.remainingTime <= 0) {
              this._restoreEntry(entry);

              toRemoveKeys.push(uuid);

              this._release(entry);
            }
          });

          for (var key of toRemoveKeys) {
            this._activeFlashes.delete(key);
          }

          if (this._activeFlashes.size === 0 && this._pendingQueue.length === 0) {
            this._unregisterUpdate();
          }
        }

      });

      FlashRedManager._instance = null;
      FlashRedManager.DEFAULT_COLOR = new Color(255, 0, 0, 255);

      /**
       * Pass uniform handle 缓存，避免每次闪红都调用 pass.getHandle() 做字符串哈希查找。
       * WeakMap 保证 pass 被销毁时缓存自动清理，无内存泄漏。
       */
      FlashRedManager._handleCache = new WeakMap();

      /**
       * 分组材质模板缓存。
       * key=groupKey, value=已配置好闪红属性的独立 Material 数组。
       * 同组后续闪红直接 mr.sharedMaterials = templates，跳过所有 pass.setUniform 调用。
       */
      FlashRedManager._groupCache = new Map();

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9580ece4d7c056555fa292464910f4baf70eb8aa.js.map