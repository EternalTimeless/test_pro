System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, Singleton, RockerLogic, RockerManager, _crd;

  function _reportPossibleCrUseOfSingleton(extras) {
    _reporterNs.report("Singleton", "../../Base/Singleton", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRockerLogic(extras) {
    _reporterNs.report("RockerLogic", "./RockerLogic", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      Singleton = _unresolved_2.default;
    }, function (_unresolved_3) {
      RockerLogic = _unresolved_3.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "fbd98UMs4BDpZagaPIqXxHp", "RockerManager", undefined);

      _export("default", RockerManager = class RockerManager extends (_crd && Singleton === void 0 ? (_reportPossibleCrUseOfSingleton({
        error: Error()
      }), Singleton) : Singleton) {
        constructor(...args) {
          super(...args);
          this.rockerLogic = void 0;
        }

        static get instance() {
          return this.getInstance();
        }

        init(r) {
          this.rockerLogic = new (_crd && RockerLogic === void 0 ? (_reportPossibleCrUseOfRockerLogic({
            error: Error()
          }), RockerLogic) : RockerLogic)(r);
        }
        /**获取遥感方向  3D情况下 2d y轴对应3d z轴*/


        get rockerDirection() {
          return this.rockerLogic.rockerDirection;
        }

        get isMove() {
          return this.rockerLogic.isMove;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8436bf0d6f6a392b090fff8471ad48b32970414b.js.map