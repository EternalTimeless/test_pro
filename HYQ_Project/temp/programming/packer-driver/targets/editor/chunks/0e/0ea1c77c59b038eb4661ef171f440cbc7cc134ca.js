System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, BagBase, TweenTool, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, LabBagUp;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfBagBase(extras) {
    _reporterNs.report("BagBase", "./Base/BagBase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTweenTool(extras) {
    _reporterNs.report("TweenTool", "../../Tool/TweenTool", _context.meta, extras);
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
      Label = _cc.Label;
    }, function (_unresolved_2) {
      BagBase = _unresolved_2.BagBase;
    }, function (_unresolved_3) {
      TweenTool = _unresolved_3.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "71b17v1NM1KIKA6ftaF3/SM", "LabBagUp", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Label', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("LabBagUp", LabBagUp = (_dec = ccclass('LabBagUp'), _dec2 = property(_crd && BagBase === void 0 ? (_reportPossibleCrUseOfBagBase({
        error: Error()
      }), BagBase) : BagBase), _dec(_class = (_class2 = class LabBagUp extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "bagBase", _descriptor, this);

          this.count = 0;
          this.shake = false;
          this.lab = void 0;
        }

        onLoad() {
          this.lab = this.node.getComponent(Label);
          this.count = this.bagBase.node.children.length;
          this.lab.string = this.count.toString();
        }

        update(dt) {
          let count = this.bagBase.propCount;

          if (this.count != count) {
            this.count = count;
            this.lab.string = this.count.toString();

            if (!this.shake) {
              this.shake = true;
              (_crd && TweenTool === void 0 ? (_reportPossibleCrUseOfTweenTool({
                error: Error()
              }), TweenTool) : TweenTool).scaleShake(this.node, 0, 0.05).call(() => {
                this.shake = false;
              }).start();
            }
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "bagBase", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0ea1c77c59b038eb4661ef171f440cbc7cc134ca.js.map