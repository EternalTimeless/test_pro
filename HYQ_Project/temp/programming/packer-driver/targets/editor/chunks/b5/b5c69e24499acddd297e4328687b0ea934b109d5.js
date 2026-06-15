System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, CCInteger, Vec2, Vec3, BagBase, LayerManager, TweenTool, SceneType, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _crd, ccclass, property, GroupBag3D;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfBagBase(extras) {
    _reporterNs.report("BagBase", "./Base/BagBase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLayerManager(extras) {
    _reporterNs.report("LayerManager", "../../Base/LayerManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTweenTool(extras) {
    _reporterNs.report("TweenTool", "../../Tool/TweenTool", _context.meta, extras);
  }

  function _reportPossibleCrUseOfProp(extras) {
    _reporterNs.report("Prop", "./Prop", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSceneType(extras) {
    _reporterNs.report("SceneType", "../../Base/EnumList", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CCFloat = _cc.CCFloat;
      CCInteger = _cc.CCInteger;
      Vec2 = _cc.Vec2;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      BagBase = _unresolved_2.BagBase;
    }, function (_unresolved_3) {
      LayerManager = _unresolved_3.default;
    }, function (_unresolved_4) {
      TweenTool = _unresolved_4.default;
    }, function (_unresolved_5) {
      SceneType = _unresolved_5.SceneType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "77b1cYeqUNL74eHgyN0oFLi", "GroupBag3D", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'CCInteger', 'Component', 'Mat4', 'Node', 'Vec2', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GroupBag3D", GroupBag3D = (_dec = ccclass('GroupBag3D'), _dec2 = property({
        tooltip: '一行中道具的个数',
        type: CCInteger
      }), _dec3 = property({
        tooltip: '每层道具的总数',
        type: CCInteger
      }), _dec4 = property({
        tooltip: '当前节点下 的初始位置 0:X  1:y  '
      }), _dec5 = property({
        tooltip: '每行偏移量  0:X  1:y  '
      }), _dec6 = property({
        tooltip: '每列偏移量  0:X  1:y  '
      }), _dec7 = property({
        tooltip: '局部坐标角度仅限2d使用',
        type: CCFloat
      }), _dec8 = property({
        tooltip: '[总开关]是否启用竹子弯曲效果'
      }), _dec9 = property({
        tooltip: '弯曲增长速度（移动时弯曲达到最大的速度）',
        type: CCFloat,
        min: 0.1,
        max: 10,
        visible: function () {
          return this.enableBendingEffect;
        }
      }), _dec10 = property({
        tooltip: '弹簧刚度（越大回弹越有力，建议100-200）',
        type: CCFloat,
        min: 50,
        max: 300,
        visible: function () {
          return this.enableBendingEffect;
        }
      }), _dec11 = property({
        tooltip: '阻尼比（控制回弹次数，0.4=4次，0.5=3次，0.6=2次）',
        type: CCFloat,
        min: 0.1,
        max: 1.0,
        visible: function () {
          return this.enableBendingEffect;
        }
      }), _dec12 = property({
        tooltip: '最大弯曲距离（单位）',
        type: CCFloat,
        min: 0.01,
        max: 5,
        visible: function () {
          return this.enableBendingEffect;
        }
      }), _dec13 = property({
        tooltip: '弯曲计算基准层数（控制弯曲梯度，值越大弯曲越平缓）',
        type: CCInteger,
        min: 1,
        max: 20,
        visible: function () {
          return this.enableBendingEffect;
        }
      }), _dec(_class = (_class2 = class GroupBag3D extends (_crd && BagBase === void 0 ? (_reportPossibleCrUseOfBagBase({
        error: Error()
      }), BagBase) : BagBase) {
        constructor(...args) {
          super(...args);
          this.sceneType = (_crd && SceneType === void 0 ? (_reportPossibleCrUseOfSceneType({
            error: Error()
          }), SceneType) : SceneType).D2;

          _initializerDefineProperty(this, "horizontal", _descriptor, this);

          _initializerDefineProperty(this, "layerCount", _descriptor2, this);

          _initializerDefineProperty(this, "startPos", _descriptor3, this);

          _initializerDefineProperty(this, "horizontalOffset", _descriptor4, this);

          _initializerDefineProperty(this, "verticalOffset", _descriptor5, this);

          _initializerDefineProperty(this, "angle", _descriptor6, this);

          // ============ 竹子弯曲效果配置 ============
          _initializerDefineProperty(this, "enableBendingEffect", _descriptor7, this);

          _initializerDefineProperty(this, "bendingSpeed", _descriptor8, this);

          _initializerDefineProperty(this, "springStiffness", _descriptor9, this);

          _initializerDefineProperty(this, "dampingRatio", _descriptor10, this);

          _initializerDefineProperty(this, "maxBendingDistance", _descriptor11, this);

          _initializerDefineProperty(this, "bendingBaseLayers", _descriptor12, this);

          // ============ 内部变量 ============

          /** 目标弯曲程度（0-1）*/
          this._bendingProgress = 0;

          /** 实际弯曲程度（可能超过0-1，用于回弹效果）*/
          this._currentBend = 0;

          /** 弯曲变化速度（用于弹簧物理模拟）*/
          this._bendVelocity = 0;

          /** 是否正在移动（外部控制）*/
          this._isMoving = false;

          /** 弯曲方向向量（固定为节点z轴负方向，模拟惯性）*/
          this._bendingDir = new Vec3(0, 0, -1);

          /** 原始位置缓存（用于重置）*/
          this._originalPositions = [];
        }

        get NODECOUNT() {
          let count = this.count + this.propCount;

          if (this.showMaxCount != -1 && this.showMaxCount <= count) {
            count = this.showMaxCount - 1;
          }

          return count;
        }

        onLoad() {
          super.onLoad();
          this.sceneType = (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
            error: Error()
          }), LayerManager) : LayerManager).instance.SceneType;
        }

        /**获取 放置的位置 */
        get placePropPos() {
          this.count++;
          this._placeTime = this.placeTimeInterval;
          let count = this.NODECOUNT;
          return this.getPropPlaceWordPos(count - 1);
        }

        getPropPlacePos(count) {
          this.tempV3.set(Vec3.ZERO); // this._showAddArrow = true;

          let layer = Math.floor(count / this.layerCount);
          let layerY = layer * this.layerHeight;
          let layerCount = count % this.layerCount;
          let rx = Math.floor(layerCount % this.horizontal);
          let ry = Math.floor(layerCount / this.horizontal);

          if (this.sceneType == (_crd && SceneType === void 0 ? (_reportPossibleCrUseOfSceneType({
            error: Error()
          }), SceneType) : SceneType).D2) {
            let dx = this.startPos.x + rx * this.horizontalOffset.x + ry * this.verticalOffset.x;
            let dy = this.startPos.y + rx * this.horizontalOffset.y + ry * this.verticalOffset.y + layerY;
            this.tempV3.add3f(dx, dy, 0);
          } else {
            let dx = this.startPos.x + rx * this.horizontalOffset.x + ry * this.verticalOffset.x;
            let dz = this.startPos.z + rx * this.horizontalOffset.y + ry * this.verticalOffset.y;
            let y = layerY + this.startPos.y;
            this.tempV3.add3f(dx, y, dz);
          }

          return this.tempV3;
        }
        /**添加道具 */


        set addProp(prop) {
          if (this.showMaxCount == -1 || this.showMaxCount > this.propList.length) {
            this.getPropPlacePos(this.propList.length);
            this.node.addChild(prop.node); // 缓存原始位置（用于弯曲效果重置）

            let originalPos = new Vec3(this.tempV3.x, this.tempV3.y, this.tempV3.z);
            this._originalPositions[this.propList.length] = originalPos;
            this.propList.push(prop);
            prop.node.setPosition(this.tempV3);
            (_crd && TweenTool === void 0 ? (_reportPossibleCrUseOfTweenTool({
              error: Error()
            }), TweenTool) : TweenTool).scaleShake(prop.node).call(() => {
              prop.node.setScale(Vec3.ONE);
            }).start();

            if (this.sceneType == (_crd && SceneType === void 0 ? (_reportPossibleCrUseOfSceneType({
              error: Error()
            }), SceneType) : SceneType).D2 && this.angle != -1) {
              // prop.tran.priority = 0;
              prop.node.angle = this.angle;
            }
          } else {
            this.showCount++;
            prop.remove();
          }

          this.count--;
        }

        _onUpdata(dt) {
          // 只有启用弯曲效果时才执行
          if (!this.enableBendingEffect) {
            return;
          } // 步骤1：更新目标弯曲程度


          this.updateTargetBending(dt); // 步骤2：弹簧物理模拟

          this.updateSpringPhysics(dt); // 步骤3：应用弯曲效果

          this.applyBending();
        } // ============ 对外接口 ============

        /**
         * 设置背包是否在移动
         * @param isMoving true=正在移动, false=已停止
         */


        setMoving(isMoving) {
          if (!this.enableBendingEffect) {
            return;
          }

          this._isMoving = isMoving;
        } // ============ 核心逻辑 ============

        /** 更新目标弯曲程度 */


        updateTargetBending(dt) {
          if (this._isMoving) {
            // 移动中：目标逐渐增加到1
            this._bendingProgress += this.bendingSpeed * dt;

            if (this._bendingProgress > 1) {
              this._bendingProgress = 1;
            }
          } else {
            // 停止移动：目标直接设为0（让弹簧系统处理回弹）
            this._bendingProgress = 0;
          }
        }
        /** 弹簧物理模拟（核心） */


        updateSpringPhysics(dt) {
          // 计算偏离目标的距离
          let displacement = this._currentBend - this._bendingProgress; // 弹簧力：胡克定律 F = -k × x

          let springForce = -this.springStiffness * displacement; // 阻尼力：F = -c × v
          // 临界阻尼系数 = 2 * sqrt(k)，实际阻尼系数 = 临界阻尼 × dampingRatio

          let criticalDamping = 2 * Math.sqrt(this.springStiffness);
          let dampingCoefficient = criticalDamping * this.dampingRatio;
          let dampingForce = -dampingCoefficient * this._bendVelocity; // 总力

          let totalForce = springForce + dampingForce; // 更新速度和位置（欧拉积分）

          this._bendVelocity += totalForce * dt;
          this._currentBend += this._bendVelocity * dt; // 强制停止：当速度和位移都很小时直接归零

          if (Math.abs(this._bendVelocity) < 0.01 && Math.abs(displacement) < 0.001) {
            this._bendVelocity = 0;
            this._currentBend = this._bendingProgress;
          }
        }
        /** 应用弯曲效果到道具 */


        applyBending() {
          // 当前弯曲程度太小，重置所有位置
          if (Math.abs(this._currentBend) < 0.001) {
            this.resetAllPropsPosition();
            return;
          } // 弯曲方向固定为节点的z轴负方向（移动方向的反方向，模拟惯性）


          this._bendingDir.set(0, 0, -1); // 应用偏移到每个道具


          for (let i = 0; i < this.propList.length; i++) {
            let prop = this.propList[i];
            if (!prop || !prop.node) continue; // 计算当前道具在第几层

            let layerIndex = Math.floor(i / this.layerCount); // 使用固定的基准层数计算比例（确保无论多少道具，每层的偏移量一致）

            let layerRatio = layerIndex / this.bendingBaseLayers; // 弯曲因子（二次曲线，顶部更明显）

            let bendingFactor = Math.pow(layerRatio, 2); // 计算偏移量（沿z轴方向）

            let offset = new Vec3();
            Vec3.multiplyScalar(offset, this._bendingDir, this._currentBend * bendingFactor * this.maxBendingDistance); // 获取原始位置并应用偏移

            let originalPos = this._originalPositions[i];

            if (originalPos) {
              prop.node.setPosition(originalPos.x + offset.x, originalPos.y + offset.y, originalPos.z + offset.z);
            }
          }
        }
        /** 重置所有道具到原始位置 */


        resetAllPropsPosition() {
          for (let i = 0; i < this.propList.length; i++) {
            let prop = this.propList[i];
            if (!prop || !prop.node) continue;
            let originalPos = this._originalPositions[i];

            if (originalPos) {
              prop.node.setPosition(originalPos);
            }
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "horizontal", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "layerCount", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 9;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "startPos", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Vec3();
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "horizontalOffset", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Vec2();
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "verticalOffset", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Vec2();
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "angle", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "enableBendingEffect", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "bendingSpeed", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3.0;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "springStiffness", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 150;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "dampingRatio", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "maxBendingDistance", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "bendingBaseLayers", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b5c69e24499acddd297e4328687b0ea934b109d5.js.map