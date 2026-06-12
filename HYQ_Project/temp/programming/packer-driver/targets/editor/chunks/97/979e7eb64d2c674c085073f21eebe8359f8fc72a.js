System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Vec3, UITransform, PoolManager, JumpSequenceBase, PoolEnum, JumpCurve, CurveMovement, _crd;

  function _reportPossibleCrUseOfPoolManager(extras) {
    _reporterNs.report("PoolManager", "../../Base/PoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfJumpSequenceBase(extras) {
    _reporterNs.report("JumpSequenceBase", "./JumpSequenceBase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolEnum(extras) {
    _reporterNs.report("PoolEnum", "../../Base/EnumList", _context.meta, extras);
  }

  _export("JumpCurve", void 0);

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
      PoolEnum = _unresolved_4.PoolEnum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ad103ASFLVD0oTmkbzc6REm", "JumpCurve", undefined);

      __checkObsolete__(['Vec3', 'EventHandler', 'Node', 'v2', 'UITransform', 'math', 'CurveRange']);

      _export("JumpCurve", JumpCurve = class JumpCurve extends (_crd && JumpSequenceBase === void 0 ? (_reportPossibleCrUseOfJumpSequenceBase({
        error: Error()
      }), JumpSequenceBase) : JumpSequenceBase) {
        constructor(...args) {
          super(...args);
          this.flyNode = void 0;
          this.uiTran = void 0;
          this.endPos = new Vec3();
          this.data = new CurveMovement();
          this.jumpSpeed = 2.5;
          this.curveRange = void 0;
          this.curveRangeSpeed = void 0;
          this.startPosX = 0;
        }

        _remove() {
          (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).JumpSequence + JumpCurve, this);
        }

        init(jumpNode, endPos, jumpPower, jumpSpeed) {
          this.flyNode = jumpNode;
          this.endPos.set(endPos);
          this.uiTran = jumpNode.getComponent(UITransform);
          this.jumpSpeed = jumpSpeed;
          this.data.fx = endPos.x - jumpNode.worldPosition.x;
          this.startPosX = jumpNode.worldPosition.x;
          this.data.coe = this.solveQuadraticThroughPoints([jumpNode.worldPosition, endPos], jumpPower);
          this.curveRange = null;
          this.curveRangeSpeed = null;
          this._time = 0;
        }

        setCurveRange(cr) {
          this.curveRange = cr;
          return this;
        }

        setCurveRangeSpeed(cr) {
          this.curveRangeSpeed = cr;
          return this;
        }

        move(dt) {
          let t = dt * this.jumpSpeed * 2;

          if (this.curveRangeSpeed) {
            let cy = this.curveRangeSpeed.curve.evaluate(this._time);
            t += t * cy;
            t = Math.max(0.01, t);
          }

          if (this._time > 0.9) {
            t *= 0.5;
          }

          this._time += t;
          this._time = Math.min(1, this._time);
          let speed = this.data.fx * this._time;
          let x = this.startPosX + speed;
          let y = this.data.coe.a * x * x + this.data.coe.b * x + this.data.coe.c;

          if (this.curveRange) {
            let cy = this.curveRange.curve.evaluate(this._time) * 256;
            let scale = 1 - Math.abs(this._time - 0.5) / 0.5;
            y += cy * scale;
          }

          this.flyNode.setWorldPosition(x, y, 0);
          this.endPosPre(this.flyNode);
          this.uiTran.priority = -this.flyNode.y;
          let isOver = this._time == 1;
          return isOver;
        }
        /**
        * 定点投放
        * print: 需要开始坐标和结束坐标 [[startPosX,startPosY],[endPosX,endPosY]]
        * 
        * */


        solveQuadraticThroughPoints(point, direction) {
          if (point.length != 2) {
            console.error("数量不足");
            return null;
          }

          const sx = point[0].x;
          const sy = point[0].y;
          const ex = point[1].x;
          const ey = point[1].y;
          const cx = (sx + ex) / 2;
          let cy = 0;

          if (sy * direction < ey * direction) {
            cy = ey + 64 * direction;
          } else {
            cy = sy + 64 * direction;
          }

          let x1122 = sx * sx - cx * cx;
          let x12 = sx - cx;
          let y12 = sy - cy;
          let x2233 = cx * cx - ex * ex;
          let x23 = cx - ex;
          let y23 = cy - ey;
          let b = (x1122 * y23 - y12 * x2233) / (x1122 * x23 - x2233 * x12);
          let a = (y12 - b * x12) / x1122;
          let c = sy - a * sx * sx - b * sx;
          return {
            a,
            b,
            c
          };
        }

      });

      CurveMovement = class CurveMovement {
        constructor() {
          this.coe = void 0;
          this.ex = void 0;
          this.ey = void 0;
          this.fx = void 0;
        }

      };

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=979e7eb64d2c674c085073f21eebe8359f8fc72a.js.map