System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Vec3, UITransform, PoolManager, JumpSequenceBase, LayerManager, PoolEnum, SceneType, JumpParabola, _crd;

  function _reportPossibleCrUseOfPoolManager(extras) {
    _reporterNs.report("PoolManager", "../../Base/PoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfJumpSequenceBase(extras) {
    _reporterNs.report("JumpSequenceBase", "./JumpSequenceBase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLayerManager(extras) {
    _reporterNs.report("LayerManager", "../../Base/LayerManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolEnum(extras) {
    _reporterNs.report("PoolEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSceneType(extras) {
    _reporterNs.report("SceneType", "../../Base/EnumList", _context.meta, extras);
  }

  _export("JumpParabola", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Vec3 = _cc.Vec3;
      UITransform = _cc.UITransform;
    }, function (_unresolved_2) {
      PoolManager = _unresolved_2.default;
    }, function (_unresolved_3) {
      JumpSequenceBase = _unresolved_3.default;
    }, function (_unresolved_4) {
      LayerManager = _unresolved_4.default;
    }, function (_unresolved_5) {
      PoolEnum = _unresolved_5.PoolEnum;
      SceneType = _unresolved_5.SceneType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "119982YdVBADrrGQLG3kdWQ", "JumpParabola", undefined);

      __checkObsolete__(['Vec3', 'Node', 'UITransform', 'CurveRange']);

      /**
       * 参数方程抛物线跳跃 - 支持 2D/3D 场景自适应
       * 
       * 特点：
       * 1. 统一实现，自动适配 2D/3D 场景
       * 2. 精确保证到达终点（数学保证 + 显式检查）
       * 3. 性能优于三点拟合法（无需求解方程）
       * 4. 代码简洁易维护
       * 
       * 使用示例：
       * JumppManager.instance.jumpParabola(node, targetPos, 100, 1.5)
       *     .setCurveRange(myCurve)
       *     .setDelay(0.5)
       *     .onComplete(() => console.log("到达"));
       */
      _export("JumpParabola", JumpParabola = class JumpParabola extends (_crd && JumpSequenceBase === void 0 ? (_reportPossibleCrUseOfJumpSequenceBase({
        error: Error()
      }), JumpSequenceBase) : JumpSequenceBase) {
        constructor(...args) {
          super(...args);
          this.flyNode = void 0;
          this.uiTran = void 0;
          this.startPos = new Vec3();
          this.endPos = new Vec3();
          this.jumpHeight = void 0;
          this.jumpSpeed = void 0;
          this.curveRange = void 0;
          this.curveRangeSpeed = void 0;
        }

        _remove() {
          (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).JumpSequence + JumpParabola, this);
        }

        /**
         * 初始化跳跃参数
         * @param jumpNode 跳跃的节点
         * @param endPos 目标位置（世界坐标）
         * @param jumpHeight 跳跃高度（相对于起点-终点连线的最大偏移）
         * @param jumpSpeed 跳跃速度（数值越大越快）
         */
        init(jumpNode, endPos, jumpHeight, jumpSpeed) {
          this.flyNode = jumpNode;
          this.startPos.set(jumpNode.worldPosition);
          this.endPos.set(endPos);
          this.jumpHeight = jumpHeight;
          this.jumpSpeed = jumpSpeed;
          this.uiTran = jumpNode.getComponent(UITransform);
          this.curveRange = null;
          this.curveRangeSpeed = null;
          this._time = 0;
        }
        /**
         * 设置高度曲线调制（在基础抛物线上叠加额外的高度变化）
         * @param cr 曲线范围
         */


        setCurveRange(cr) {
          this.curveRange = cr;
          return this;
        }
        /**
         * 设置速度曲线调制（控制运动速度变化）
         * @param cr 曲线范围
         */


        setCurveRangeSpeed(cr) {
          this.curveRangeSpeed = cr;
          return this;
        }

        move(dt) {
          // 速度控制
          let t = dt * this.jumpSpeed * 2.5; // 应用速度曲线调制

          if (this.curveRangeSpeed) {
            let cy = this.curveRangeSpeed.curve.evaluate(this._time);
            t += t * cy;
            t = Math.max(0.01, t); // 防止速度为0导致卡死
          }

          this._time += t;
          this._time = Math.min(1, this._time); // 限制在 [0,1] 范围
          // 到达终点，直接设置精确坐标（三重保证之一）

          if (this._time >= 1) {
            this.flyNode.setWorldPosition(this.endPos);
            this.endPosPre(this.flyNode);
            this.updatePriority(this.endPos);
            return true;
          } // 计算当前位置


          const pos = this.calculatePosition(this._time);
          this.flyNode.setWorldPosition(pos);
          this.endPosPre(this.flyNode);
          this.updatePriority(pos);
          return false;
        }
        /**
         * 参数方程计算位置 - 2D/3D 通用
         * 
         * 原理：
         * - X/Z 轴：线性插值（确保 t=1 时到达终点）
         * - Y 轴：线性插值 + 抛物线偏移
         * - 抛物线公式：y_offset = -4h(t-0.5)² + h
         *   性质：t=0 时 offset=0, t=0.5 时 offset=h, t=1 时 offset=0
         * 
         * @param t 归一化时间 [0,1]
         */


        calculatePosition(t) {
          // X 轴线性插值（2D/3D 都需要）
          const x = this.startPos.x + (this.endPos.x - this.startPos.x) * t; // Z 轴线性插值（2D 场景下 Z 始终为 0，3D 场景正常插值）

          const z = this.startPos.z + (this.endPos.z - this.startPos.z) * t; // Y 轴基础线性插值

          const baseY = this.startPos.y + (this.endPos.y - this.startPos.y) * t; // 抛物线偏移：-4h(t-0.5)² + h
          // 这个公式保证：
          // - t=0: offset = -4h×0.25 + h = 0 (起点无偏移)
          // - t=0.5: offset = -4h×0 + h = h (中点最高)
          // - t=1: offset = -4h×0.25 + h = 0 (终点无偏移)

          let parabola = -4 * this.jumpHeight * Math.pow(t - 0.5, 2) + this.jumpHeight; // 额外的曲线调制（可选）

          if (this.curveRange) {
            // 根据场景类型调整缩放系数
            const scaleMultiplier = (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
              error: Error()
            }), LayerManager) : LayerManager).instance.SceneType === (_crd && SceneType === void 0 ? (_reportPossibleCrUseOfSceneType({
              error: Error()
            }), SceneType) : SceneType).D2 ? 256 : 4;
            let cy = this.curveRange.curve.evaluate(t) * scaleMultiplier; // 中间时刻影响最大，两端影响最小

            let scale = 1 - Math.abs(t - 0.5) / 0.5;
            parabola += cy * scale;
          }

          const y = baseY + parabola;
          return new Vec3(x, y, z);
        }
        /**
         * 更新渲染优先级 - 2D/3D 自适应
         * 
         * 2D 场景：根据 Y 轴排序（越高越靠后）
         * 3D 场景：混合 Z 轴和 Y 轴排序
         * 
         * @param pos 当前世界坐标
         */


        updatePriority(pos) {
          if (!this.uiTran) return;

          if ((_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
            error: Error()
          }), LayerManager) : LayerManager).instance.SceneType === (_crd && SceneType === void 0 ? (_reportPossibleCrUseOfSceneType({
            error: Error()
          }), SceneType) : SceneType).D2) {
            // 2D 场景：只根据 Y 轴排序
            this.uiTran.priority = -pos.y;
          } else {
            // 3D 场景：混合 Z 轴深度和 Y 轴高度
            this.uiTran.priority = -pos.z + pos.y * 1.5;
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=fd259ad324b9c7e2f04afc9cbbbe9eb5dac2b598.js.map