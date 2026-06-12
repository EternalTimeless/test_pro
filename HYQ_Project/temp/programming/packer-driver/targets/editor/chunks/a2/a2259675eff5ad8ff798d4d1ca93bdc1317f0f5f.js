System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, CCFloat, PoolEnum, EffectEnum, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, EffectRemoveBase;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPoolEnum(extras) {
    _reporterNs.report("PoolEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEffectEnum(extras) {
    _reporterNs.report("EffectEnum", "../../Base/EnumList", _context.meta, extras);
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
      CCFloat = _cc.CCFloat;
    }, function (_unresolved_2) {
      PoolEnum = _unresolved_2.PoolEnum;
      EffectEnum = _unresolved_2.EffectEnum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "18e01vd1tJG0YIlfS0Pnii9", "EffectRemoveBase", undefined);

      __checkObsolete__(['_decorator', 'Component', 'CCFloat']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("EffectRemoveBase", EffectRemoveBase = (_dec = ccclass('EffectRemoveBase'), _dec2 = property(CCFloat), _dec3 = property({
        type: _crd && EffectEnum === void 0 ? (_reportPossibleCrUseOfEffectEnum({
          error: Error()
        }), EffectEnum) : EffectEnum
      }), _dec(_class = (_class2 = class EffectRemoveBase extends Component {
        constructor(...args) {
          super(...args);

          /**回收类型 */
          // @property({ type: PoolEnum })
          this.type = (_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).effect;

          _initializerDefineProperty(this, "removeTime", _descriptor, this);

          /**类型  当前物体所对应的枚举值 */
          _initializerDefineProperty(this, "index", _descriptor2, this);

          this._time = void 0;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "removeTime", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.1;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "index", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && EffectEnum === void 0 ? (_reportPossibleCrUseOfEffectEnum({
            error: Error()
          }), EffectEnum) : EffectEnum).hit;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=a2259675eff5ad8ff798d4d1ca93bdc1317f0f5f.js.map