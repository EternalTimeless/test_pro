System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, PoolManager, EffectRemoveBase, _dec, _class, _crd, ccclass, property, EffectTimeRemove;

  function _reportPossibleCrUseOfPoolManager(extras) {
    _reporterNs.report("PoolManager", "../../Base/PoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEffectRemoveBase(extras) {
    _reporterNs.report("EffectRemoveBase", "./EffectRemoveBase", _context.meta, extras);
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
      PoolManager = _unresolved_2.default;
    }, function (_unresolved_3) {
      EffectRemoveBase = _unresolved_3.EffectRemoveBase;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "bbccbCZmHZBcq6vyFJ0sdEz", "EffectTimeRemove", undefined);

      __checkObsolete__(['_decorator', 'CCFloat']);

      ({
        ccclass,
        property
      } = _decorator);
      /**特效播放完毕之后 回收 */

      _export("EffectTimeRemove", EffectTimeRemove = (_dec = ccclass('EffectTimeRemove'), _dec(_class = class EffectTimeRemove extends (_crd && EffectRemoveBase === void 0 ? (_reportPossibleCrUseOfEffectRemoveBase({
        error: Error()
      }), EffectRemoveBase) : EffectRemoveBase) {
        onEnable() {
          this._time = this.removeTime; // this.anim.play();
        }

        update(deltaTime) {
          this._time -= deltaTime;

          if (this._time <= 0) {
            this.node.active = false;
            (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.setPool(this.type + this.index, this.node);
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d82bd7c0a177d47644bfc13a2b264a2a2c8a9e70.js.map