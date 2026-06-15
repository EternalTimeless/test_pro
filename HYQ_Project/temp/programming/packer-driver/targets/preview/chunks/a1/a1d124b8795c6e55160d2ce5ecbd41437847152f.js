System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, Component, Quat, Vec3, isFacingTargetHorizontal_vec, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, RotationDrive;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfisFacingTargetHorizontal_vec(extras) {
    _reporterNs.report("isFacingTargetHorizontal_vec", "../../Tool/Index", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CCFloat = _cc.CCFloat;
      Component = _cc.Component;
      Quat = _cc.Quat;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      isFacingTargetHorizontal_vec = _unresolved_2.isFacingTargetHorizontal_vec;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5a97d/8Pb5PhoGkTT12DDgH", "RotationDrive", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'Component', 'log', 'math', 'Node', 'NodeSpace', 'Quat', 'v3', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("RotationDrive", RotationDrive = (_dec = ccclass('RotationDrive'), _dec2 = property(CCFloat), _dec3 = property(CCFloat), _dec(_class = (_class2 = class RotationDrive extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "angle", _descriptor, this);

          _initializerDefineProperty(this, "speed", _descriptor2, this);

          this.tempQ = new Quat();
          this.tempQ2 = new Quat();
          this._vector = new Vec3();
          this._vector2 = new Vec3();
          this._fowerVe3 = new Vec3();
        }

        set vector(vector) {
          this._vector.set(vector);

          Quat.fromViewUp(this.tempQ, vector, Vec3.UP);
        }

        rotatLerpLookVector(dt) {
          var currentQ = this.node.worldRotation;
          var targetQ = this.tempQ; // 直接使用四元数球面插值，无需转换为轴角

          var t = Math.min(this.speed * dt, 1.0); // 使用更高效的插值方法

          Quat.slerp(this.tempQ2, currentQ, targetQ, t);
          this.node.setWorldRotation(this.tempQ2);
        }

        isFacingTargetHorizontal_vec(isHeight) {
          if (isHeight === void 0) {
            isHeight = false;
          }

          var vector = this._vector;
          Vec3.transformQuat(this._fowerVe3, Vec3.FORWARD, this.node.worldRotation);

          this._fowerVe3.normalize();

          return (_crd && isFacingTargetHorizontal_vec === void 0 ? (_reportPossibleCrUseOfisFacingTargetHorizontal_vec({
            error: Error()
          }), isFacingTargetHorizontal_vec) : isFacingTargetHorizontal_vec)(vector, this._fowerVe3, this.angle, isHeight); //返回是否朝向目标
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "angle", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 30;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "speed", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=a1d124b8795c6e55160d2ce5ecbd41437847152f.js.map