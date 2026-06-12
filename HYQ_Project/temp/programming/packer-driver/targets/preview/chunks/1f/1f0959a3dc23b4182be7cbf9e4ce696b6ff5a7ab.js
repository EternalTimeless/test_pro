System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, RigidBody2D, BattleTargetBase, vectorPower_v2, _dec, _class, _crd, ccclass, property, BattleTarget2D;

  function _reportPossibleCrUseOfBattleTargetBase(extras) {
    _reporterNs.report("BattleTargetBase", "../Base/BattleTargetBase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfvectorPower_v(extras) {
    _reporterNs.report("vectorPower_v2", "../../../Tool/Index", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      RigidBody2D = _cc.RigidBody2D;
    }, function (_unresolved_2) {
      BattleTargetBase = _unresolved_2.BattleTargetBase;
    }, function (_unresolved_3) {
      vectorPower_v2 = _unresolved_3.vectorPower_v2;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ce18dmh/7NMILoWszvYMJUJ", "BattleTarget2D", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'RigidBody2D', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BattleTarget2D", BattleTarget2D = (_dec = ccclass('BattleTarget2D'), _dec(_class = class BattleTarget2D extends (_crd && BattleTargetBase === void 0 ? (_reportPossibleCrUseOfBattleTargetBase({
        error: Error()
      }), BattleTargetBase) : BattleTargetBase) {
        constructor() {
          super(...arguments);
          // private _move: MoveDrive
          this.rig = void 0;
        }

        start() {
          this.rig = this.node.getComponent(RigidBody2D);
        } // public get moveD() {
        //     if (!this._move) {
        //         this._move = this.node.getComponent(MoveDrive);
        //     }
        //     return this._move;
        // }


        repelBattleTarget(target, reoel) {
          if (reoel === void 0) {
            reoel = 0;
          }

          this.rig.applyLinearImpulseToCenter((_crd && vectorPower_v2 === void 0 ? (_reportPossibleCrUseOfvectorPower_v({
            error: Error()
          }), vectorPower_v2) : vectorPower_v2)(this.node, target, reoel), false);
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1f0959a3dc23b4182be7cbf9e4ce696b6ff5a7ab.js.map