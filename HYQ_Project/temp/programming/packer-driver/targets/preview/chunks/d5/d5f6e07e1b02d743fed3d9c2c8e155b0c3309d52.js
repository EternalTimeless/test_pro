System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, AttackTargetBase, _dec, _class, _crd, ccclass, property, MeleeAttack;

  function _reportPossibleCrUseOfAttackTargetBase(extras) {
    _reporterNs.report("AttackTargetBase", "../Base/AttackTargetBase", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
    }, function (_unresolved_2) {
      AttackTargetBase = _unresolved_2.AttackTargetBase;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "960a1XWRRZEQ795HHYJzRlJ", "MeleeAttack", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MeleeAttack", MeleeAttack = (_dec = ccclass('MeleeAttack'), _dec(_class = class MeleeAttack extends (_crd && AttackTargetBase === void 0 ? (_reportPossibleCrUseOfAttackTargetBase({
        error: Error()
      }), AttackTargetBase) : AttackTargetBase) {
        /**近战单体攻击 */
        attackEvent(power, reoel) {
          var targetList = this.collectGettarget.singleTarget;

          if (targetList == null) {
            this.target = null;
            return;
          }

          var target = targetList;
          target.Hit(power);
          target.repelBattleTarget(this.node, reoel);
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d5f6e07e1b02d743fed3d9c2c8e155b0c3309d52.js.map