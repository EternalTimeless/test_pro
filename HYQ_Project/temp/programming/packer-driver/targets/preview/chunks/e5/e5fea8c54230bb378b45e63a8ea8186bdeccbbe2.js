System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, JumpManager, UnityUpComponent, _dec, _class, _crd, ccclass, property, JumpDriveEngine;

  function _reportPossibleCrUseOfJumpManager(extras) {
    _reporterNs.report("JumpManager", "./JumpManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnityUpComponent(extras) {
    _reporterNs.report("UnityUpComponent", "../../Base/UnityUpComponent", _context.meta, extras);
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
      JumpManager = _unresolved_2.JumpManager;
    }, function (_unresolved_3) {
      UnityUpComponent = _unresolved_3.UnityUpComponent;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b90faD75sNC4Je+e/loukRZ", "JumpDriveEngine", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'tween', 'tweenProgress', 'UITransform']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("JumpDriveEngine", JumpDriveEngine = (_dec = ccclass('PropFlyDriveEngine'), _dec(_class = class JumpDriveEngine extends (_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
        error: Error()
      }), UnityUpComponent) : UnityUpComponent) {
        _update(dt) {
          this.propFly(dt);
        }

        propFly(dt) {
          var propFlyList = (_crd && JumpManager === void 0 ? (_reportPossibleCrUseOfJumpManager({
            error: Error()
          }), JumpManager) : JumpManager).instance.propFlyList;

          for (var i = propFlyList.length - 1; i >= 0; i--) {
            var fly = propFlyList[i];

            if (fly.isMoveOver) {
              propFlyList.splice(i, 1);
              fly.remove();
            } else {
              fly.moveOver(dt);
            }
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e5fea8c54230bb378b45e63a8ea8186bdeccbbe2.js.map