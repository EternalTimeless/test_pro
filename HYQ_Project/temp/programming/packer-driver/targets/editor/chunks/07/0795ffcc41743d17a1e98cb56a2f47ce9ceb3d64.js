System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Vec2, RockerLogic, _crd;

  _export("default", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Vec2 = _cc.Vec2;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "69a42HJoNZEgpgYg6s4jpGJ", "RockerLogic", undefined);

      __checkObsolete__(['log', 'math', 'Vec2']);

      _export("default", RockerLogic = class RockerLogic {
        constructor(radius) {
          this.curTouchId = void 0;

          /**
           *摇杆位置
           */
          this.rockerPoint = void 0;

          /**
           * 弧度
           */
          this.radians = void 0;

          /**
           * 半径
           */
          this.radius = void 0;
          this.radiusSquare = void 0;

          /**记录 遥感到中心的位置*/
          this._rockerPos = void 0;

          /**记录遥感方向 */
          this._rockerDirection = void 0;
          this._isMove = false;
          this.radius = radius;
          this.radiusSquare = this.radius * this.radius;
          this._rockerPos = new Vec2();
          this._rockerDirection = new Vec2();
        }

        rockerDown(v2) {
          this.rockerPoint = v2;
          this._isMove = true;
        }

        rockerMove(mousePos) {
          let dx = mousePos.x - this.rockerPoint.x;
          let dy = mousePos.y - this.rockerPoint.y;
          this.radians = Math.atan2(dy, dx);
          let x = Math.cos(this.radians);
          let y = Math.sin(this.radians);
          let dis = dx * dx + dy * dy;
          let r = Math.min(1, dis / this.radiusSquare * 2.5) * this.radius;
          this._rockerDirection.x = x;
          this._rockerDirection.y = y;
          this._rockerPos.x = this._rockerDirection.x * r;
          this._rockerPos.y = this._rockerDirection.y * r;
        }

        rockerOver() {
          this.rockerPoint = null;
          this.radians = 0;
          this._rockerPos.x = 0;
          this._rockerPos.y = 0;
          this._rockerDirection.x = 0;
          this._rockerDirection.y = 0;
          this._isMove = false;
        }

        get isMove() {
          return this._isMove;
        }
        /**记录 遥感到中心的位置*/


        get rockerPos() {
          return this._rockerPos;
        }
        /**遥感方向 */


        get rockerDirection() {
          return this._rockerDirection;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0795ffcc41743d17a1e98cb56a2f47ce9ceb3d64.js.map