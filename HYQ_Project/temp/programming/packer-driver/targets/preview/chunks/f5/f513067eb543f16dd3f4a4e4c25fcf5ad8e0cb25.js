System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, UITransform, PoolManager, JumpSequenceBase, LayerManager, SceneType, PoolEnum, BezierCurve, _crd;

  function _reportPossibleCrUseOfPoolManager(extras) {
    _reporterNs.report("PoolManager", "../../Base/PoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfJumpSequenceBase(extras) {
    _reporterNs.report("JumpSequenceBase", "./JumpSequenceBase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLayerManager(extras) {
    _reporterNs.report("LayerManager", "../../Base/LayerManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSceneType(extras) {
    _reporterNs.report("SceneType", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolEnum(extras) {
    _reporterNs.report("PoolEnum", "../../Base/EnumList", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      UITransform = _cc.UITransform;
    }, function (_unresolved_2) {
      PoolManager = _unresolved_2.default;
    }, function (_unresolved_3) {
      JumpSequenceBase = _unresolved_3.default;
    }, function (_unresolved_4) {
      LayerManager = _unresolved_4.default;
    }, function (_unresolved_5) {
      SceneType = _unresolved_5.SceneType;
      PoolEnum = _unresolved_5.PoolEnum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5add3JxlJRBkpMFQ6/UIRcT", "BezierCurve", undefined); // interface Point {
      //     x: number;
      //     y: number;


      __checkObsolete__(['Node', 'sp', 'UITransform']);

      // }
      _export("default", BezierCurve = class BezierCurve extends (_crd && JumpSequenceBase === void 0 ? (_reportPossibleCrUseOfJumpSequenceBase({
        error: Error()
      }), JumpSequenceBase) : JumpSequenceBase) {
        constructor() {
          super(...arguments);
          this.flyNode = void 0;
          this.uiTran = void 0;
          this.workBuffer = void 0;
          this.points = void 0;
          this.speed = 1;

          /** 预分配的临时向量池，避免每帧new Float32Array */
          this._tempVecs = [];
        }

        init(flyNode, points, speed) {
          if (speed === void 0) {
            speed = 1;
          }

          this.flyNode = flyNode;
          this.uiTran = flyNode.getComponent(UITransform);
          this.points = points;
          this.speed = speed;
          this._time = 0; // 预分配临时数组，避免每帧计算时new Float32Array

          var dim = points.length > 0 ? points[0].length : 2;

          while (this._tempVecs.length < points.length) {
            this._tempVecs.push(new Float32Array(dim));
          }
        }

        move(dt) {
          this._time += dt * this.speed;

          if (this._time >= 1) {
            this._time = 1;
            return true;
          } // 先把points数据拷贝到预分配数组（零分配）


          for (var i = 0; i < this.points.length; i++) {
            this._tempVecs[i].set(this.points[i]);
          }

          var point = BezierCurve.bezierOptimized(this.points, this._time, this.workBuffer, this._tempVecs);
          this.flyNode.setWorldPosition(point[0], point[1], point[2] ? point[2] : 0);
          this.endPosPre(this.flyNode);

          if (this.uiTran) {
            if ((_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
              error: Error()
            }), LayerManager) : LayerManager).instance.SceneType == (_crd && SceneType === void 0 ? (_reportPossibleCrUseOfSceneType({
              error: Error()
            }), SceneType) : SceneType).D2) {
              this.uiTran.priority = -point[1];
            } else {
              this.uiTran.priority = -point[2] + point[1] * 1.5;
            }
          }

          return false;
        }

        _remove() {
          (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).JumpSequence + BezierCurve, this);
        }
        /**
        * 高性能贝塞尔曲线计算 (德卡斯特里奥算法) — 零分配版
        * @param points 控制点数组（每个点用 Float32Array 表示，如2D: [x, y], 3D: [x, y, z]）
        * @param t 参数 t ∈ [0, 1]
        * @param workBuffer 工作缓冲区（可选，用于内存复用）
        * @param temps 预分配的临时向量池（由调用方传入，避免内部new）
        * @returns 曲线上的点（Float32Array，直接引用 workBuffer 避免内存分配）
        */


        static bezierOptimized(points, t, workBuffer, temps) {
          var n = points.length;
          var dim = points[0].length;
          var buffer = workBuffer || new Float32Array(dim); // 使用已预先拷贝好数据的 temps（由 move() 提前写入），避免 new Float32Array

          var temp = temps || [];

          for (var i = temp.length; i < n; i++) {
            temp[i] = new Float32Array(points[i]);
          } // 德卡斯特里奥算法优化实现（原地计算，无需额外分配）


          for (var level = 1; level < n; level++) {
            var end = n - level;

            for (var _i = 0; _i < end; _i++) {
              var p0 = temp[_i];
              var p1 = temp[_i + 1];
              var current = temp[_i];

              for (var d = 0; d < dim; d++) {
                current[d] = (1 - t) * p0[d] + t * p1[d];
              }
            }
          } // 将结果复制到工作缓冲区（避免返回内部数据引用）


          buffer.set(temp[0]);
          return buffer;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f513067eb543f16dd3f4a4e4c25fcf5ad8e0cb25.js.map