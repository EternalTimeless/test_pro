System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCString, Component, L18nManager, LanguageType, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, LangArrAuto;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfL18nManager(extras) {
    _reporterNs.report("L18nManager", "./L18Manager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLanguageType(extras) {
    _reporterNs.report("LanguageType", "./L18Manager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CCString = _cc.CCString;
      Component = _cc.Component;
    }, function (_unresolved_2) {
      L18nManager = _unresolved_2.default;
      LanguageType = _unresolved_2.LanguageType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ab58aGiWSRDSpX1xUCpuV/+", "LangArrAuto", undefined);

      __checkObsolete__(['_decorator', 'CCString', 'Component', 'Label', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("LangArrAuto", LangArrAuto = (_dec = ccclass("LangArrAuto"), _dec2 = property({
        type: CCString,
        tooltip: "简体中文"
      }), _dec3 = property({
        type: CCString,
        tooltip: "英文"
      }), _dec(_class = (_class2 = class LangArrAuto extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "cnDesc", _descriptor, this);

          _initializerDefineProperty(this, "enDesc", _descriptor2, this);
        }

        getTipsIndex(index) {
          switch ((_crd && L18nManager === void 0 ? (_reportPossibleCrUseOfL18nManager({
            error: Error()
          }), L18nManager) : L18nManager).instance.lang) {
            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).zh_cn:
              {
                this.cnDesc[index];
                break;
              }

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).en:
              {
                this.enDesc[index];
                break;
              }

            default:
              {
                this.enDesc[index];
                break;
              }
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "cnDesc", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "enDesc", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1aa46930c96a25d49d7fd2adb188f6368b35a070.js.map