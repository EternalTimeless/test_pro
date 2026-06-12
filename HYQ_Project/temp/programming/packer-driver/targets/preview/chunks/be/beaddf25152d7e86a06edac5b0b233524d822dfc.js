System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, log, ParticleSystem, PoolManager, EventManager, EventType, EffectRemoveBase, _dec, _class, _crd, ccclass, property, EffectTimePartRemove;

  function _reportPossibleCrUseOfPoolManager(extras) {
    _reporterNs.report("PoolManager", "../../Base/PoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../../Base/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../../Base/EnumList", _context.meta, extras);
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
      log = _cc.log;
      ParticleSystem = _cc.ParticleSystem;
    }, function (_unresolved_2) {
      PoolManager = _unresolved_2.default;
    }, function (_unresolved_3) {
      EventManager = _unresolved_3.default;
    }, function (_unresolved_4) {
      EventType = _unresolved_4.EventType;
    }, function (_unresolved_5) {
      EffectRemoveBase = _unresolved_5.EffectRemoveBase;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "acd07L1L4tACLJbS1JzCJvS", "EffectTimePartRemove", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'log', 'ParticleSystem']);

      ({
        ccclass,
        property
      } = _decorator);
      /**回收粒子特效 */

      _export("EffectTimePartRemove", EffectTimePartRemove = (_dec = ccclass('EffectTimePartRemove'), _dec(_class = class EffectTimePartRemove extends (_crd && EffectRemoveBase === void 0 ? (_reportPossibleCrUseOfEffectRemoveBase({
        error: Error()
      }), EffectRemoveBase) : EffectRemoveBase) {
        constructor() {
          super(...arguments);
          this._part = [];
        }

        get part() {
          if (this._part.length == 0) {
            this._part.push(this.node.getComponent(ParticleSystem));

            for (var i = 0; i < this.node.children.length; i++) {
              var part = this.node.children[i].getComponent(ParticleSystem);

              if (part) {
                this._part.push(part);
              }
            }
          }

          return this._part;
        }

        onEnable() {
          log("effect");
          this._time = this.removeTime;

          for (var i = 0; i < this.part.length; i++) {
            var p = this.part[i];
            p.stop();
            p.play();
          }
        }

        update(deltaTime) {
          this._time -= deltaTime;

          if (this._time <= 0) {
            this.node.active = false;
            (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
              error: Error()
            }), EventManager) : EventManager).instance.emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
              error: Error()
            }), EventType) : EventType).EFFECT_PLAY_OVER, this, this.index);
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
//# sourceMappingURL=beaddf25152d7e86a06edac5b0b233524d822dfc.js.map