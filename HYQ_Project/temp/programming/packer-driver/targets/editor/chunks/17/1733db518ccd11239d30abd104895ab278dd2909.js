System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, _dec, _class, _crd, ccclass, property, CollectGetTarget;

  function _reportPossibleCrUseOfBattleTargetBase(extras) {
    _reporterNs.report("BattleTargetBase", "../Base/BattleTargetBase", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "03fdb7dkN9HrJqkf97nCLWJ", "CollectGetTarget", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Quat']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 战斗目标 收集器  
       */

      _export("CollectGetTarget", CollectGetTarget = (_dec = ccclass('CollectGetTarget'), _dec(_class = class CollectGetTarget extends Component {}) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1733db518ccd11239d30abd104895ab278dd2909.js.map