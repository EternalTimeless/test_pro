System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Collider, Component, Label, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, PropBrand;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Collider = _cc.Collider;
      Component = _cc.Component;
      Label = _cc.Label;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6cd5aN9EmlJw5P0fgCs+YC/", "PropBrand", undefined);

      __checkObsolete__(['_decorator', 'Collider', 'Component', 'Label', 'labelAssembler', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PropBrand", PropBrand = (_dec = ccclass('PropBrand'), _dec2 = property(Label), _dec3 = property(Collider), _dec(_class = (_class2 = class PropBrand extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "lab", _descriptor, this);

          this.count = 0;

          _initializerDefineProperty(this, "collide", _descriptor2, this);
        }

        init(num = 1) {
          this.count = num;
          this.lab.string = `+${num}`;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "lab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "collide", [_dec3], {
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
//# sourceMappingURL=ac0e66d1df96447f3ea6b579b5067cb87a880d84.js.map