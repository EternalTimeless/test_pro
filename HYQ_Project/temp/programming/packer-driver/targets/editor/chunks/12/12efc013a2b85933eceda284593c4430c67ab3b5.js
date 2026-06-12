System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, Component, Quat, Vec3, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, RotationVector;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CCFloat = _cc.CCFloat;
      Component = _cc.Component;
      Quat = _cc.Quat;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f6e63YwgVZI85d4SO6uxHm9", "RotationVector", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'Component', 'log', 'math', 'Node', 'NodePool', 'NodeSpace', 'Quat', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("RotationVector", RotationVector = (_dec = ccclass('RotationVector'), _dec2 = property(CCFloat), _dec(_class = (_class2 = class RotationVector extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "speed", _descriptor, this);

          this.tempQ = new Quat();
          this._vector = new Vec3();
        }

        setVector(vector) {
          this._vector.set(vector);
        }

        rotate(dt) {
          const radians = this.speed * Math.PI / 180 * dt;
          Quat.fromAxisAngle(this.tempQ, this._vector, radians);
          this.node.rotate(this.tempQ);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "speed", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 360;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=12efc013a2b85933eceda284593c4430c67ab3b5.js.map