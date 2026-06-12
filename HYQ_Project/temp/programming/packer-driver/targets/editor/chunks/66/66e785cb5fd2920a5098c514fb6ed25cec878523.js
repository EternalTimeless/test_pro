System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Vec3, UITransform, Vec2, PoolManager, JumpSequenceBase, PoolEnum, JumpCurve3D, _crd;

  function _reportPossibleCrUseOfPoolManager(extras) {
    _reporterNs.report("PoolManager", "../../Base/PoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfJumpSequenceBase(extras) {
    _reporterNs.report("JumpSequenceBase", "./JumpSequenceBase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolEnum(extras) {
    _reporterNs.report("PoolEnum", "../../Base/EnumList", _context.meta, extras);
  }

  _export("JumpCurve3D", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Vec3 = _cc.Vec3;
      UITransform = _cc.UITransform;
      Vec2 = _cc.Vec2;
    }, function (_unresolved_2) {
      PoolManager = _unresolved_2.default;
    }, function (_unresolved_3) {
      JumpSequenceBase = _unresolved_3.default;
    }, function (_unresolved_4) {
      PoolEnum = _unresolved_4.PoolEnum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "51ce8vGXEZEN5SHu7c93c8R", "JumpCurve3D", undefined);

      __checkObsolete__(['Vec3', 'EventHandler', 'Node', 'v2', 'UITransform', 'math', 'Vec2', 'sp', 'log', 'CurveRange']);

      _export("JumpCurve3D", JumpCurve3D = class JumpCurve3D extends (_crd && JumpSequenceBase === void 0 ? (_reportPossibleCrUseOfJumpSequenceBase({
        error: Error()
      }), JumpSequenceBase) : JumpSequenceBase) {
        constructor(...args) {
          super(...args);
          this.flyNode = void 0;
          this.uiTran = void 0;
          this.endPos = new Vec3();
          this.jumpSpeed = 1;
          this.startPos = new Vec3();
          this.curveRange = void 0;
          this.curveRangeSpeed = void 0;
          this.a = void 0;
          this.b = void 0;
          this.vecctrXZ = new Vec2();
          this.dis = 0;
        }

        _remove() {
          (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).JumpSequence + JumpCurve3D, this);
        }

        init(jumpNode, endPos, jumpPower, jumpSpeed) {
          this.flyNode = jumpNode;
          this.startPos.set(jumpNode.worldPosition);
          this.endPos.set(endPos);
          this.uiTran = jumpNode.getComponent(UITransform);
          this.jumpSpeed = jumpSpeed;
          this._time = 0;
          let coe = this.solveQuadraticThroughPoints([jumpNode.worldPosition, endPos], jumpPower);
          this.a = coe.a;
          this.b = coe.b;
          this.curveRange = null;
          this.curveRangeSpeed = null;
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
          let t = dt * this.jumpSpeed * 1;

          if (this.curveRangeSpeed) {
            let cy = this.curveRangeSpeed.curve.evaluate(this._time);
            t += t * cy;
            t = Math.max(0.01, t);
          }

          const scaleT = -4 * this._time * this._time + 4 * this._time + 1;
          t *= scaleT * 1.5;
          this._time += t;
          this._time = Math.min(1, this._time);
          let pos = this.startPos;
          let x = this._time * this.dis;
          let y = this.a * x * x + this.b * x;

          if (this.curveRange) {
            let cy = this.curveRange.curve.evaluate(this._time) * 4;
            let scale = 1 - Math.abs(this._time - 0.5) / 0.5;
            y += cy * scale;
          }

          this.flyNode.setWorldPosition(this.vecctrXZ.x * this._time * this.dis + pos.x, y + pos.y, this.vecctrXZ.y * this._time * this.dis + pos.z);
          this.endPosPre(this.flyNode);

          if (this.uiTran) {
            this.uiTran.priority = -this.flyNode.worldPosition.z + pos.y * 1.5;
          }

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

          const startPoint = point[0];
          const endtPoint = point[1];
          let x = endtPoint.x - startPoint.x;
          let z = endtPoint.z - startPoint.z;

          if (startPoint.x == endtPoint.x && startPoint.z == endtPoint.z) {
            x = 0.1;
          }

          this.vecctrXZ.set(x, z);
          this.dis = this.vecctrXZ.length();
          this.vecctrXZ.normalize();
          const d = startPoint.y - endtPoint.y;
          const ey = -d;
          let cy = 0;

          if (d >= 0) {
            cy = 2 * direction;
          } else {
            cy = ey + 2 * direction;
            ;
          }

          const ex = this.dis;
          const cx = ex / 2;
          const x1122 = -cx * cx;
          const x12 = -cx;
          const y12 = -cy;
          const x2233 = cx * cx - ex * ex;
          const x23 = cx - ex;
          const y23 = cy - ey;
          const b = (x1122 * y23 - y12 * x2233) / (x1122 * x23 - x2233 * x12);
          const a = (y12 - b * x12) / x1122;
          return {
            a,
            b
          };
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=66e785cb5fd2920a5098c514fb6ed25cec878523.js.map