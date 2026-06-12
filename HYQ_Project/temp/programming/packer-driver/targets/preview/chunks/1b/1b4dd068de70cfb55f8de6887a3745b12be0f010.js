System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, UnityUpComponent, PoolManager, PropEnum, PoolEnum, RotationVector, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, Prop;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfUnityUpComponent(extras) {
    _reporterNs.report("UnityUpComponent", "../../Base/UnityUpComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolManager(extras) {
    _reporterNs.report("PoolManager", "../../Base/PoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPropEnum(extras) {
    _reporterNs.report("PropEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolEnum(extras) {
    _reporterNs.report("PoolEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRotationVector(extras) {
    _reporterNs.report("RotationVector", "../../Base/MoveRot/RotationVector", _context.meta, extras);
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
      UnityUpComponent = _unresolved_2.UnityUpComponent;
    }, function (_unresolved_3) {
      PoolManager = _unresolved_3.default;
    }, function (_unresolved_4) {
      PropEnum = _unresolved_4.PropEnum;
      PoolEnum = _unresolved_4.PoolEnum;
    }, function (_unresolved_5) {
      RotationVector = _unresolved_5.RotationVector;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4c479eEG1hPFo48PIJhHbrL", "Prop", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Prop", Prop = (_dec = ccclass('Prop'), _dec2 = property({
        type: _crd && PropEnum === void 0 ? (_reportPossibleCrUseOfPropEnum({
          error: Error()
        }), PropEnum) : PropEnum
      }), _dec(_class = (_class2 = class Prop extends (_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
        error: Error()
      }), UnityUpComponent) : UnityUpComponent) {
        constructor() {
          super(...arguments);
          this._rotatonDrive = null;
          this.isRot = false;

          _initializerDefineProperty(this, "propID", _descriptor, this);
        }

        get rotationDrive() {
          if (!this._rotatonDrive) {
            this._rotatonDrive = this.getComponent(_crd && RotationVector === void 0 ? (_reportPossibleCrUseOfRotationVector({
              error: Error()
            }), RotationVector) : RotationVector);
          }

          return this._rotatonDrive;
        }

        _update(dt) {
          if (this.isRot) {
            this.rotationDrive.rotate(dt);
          }
        }

        set rotVector(vector) {
          if (!vector) {
            this.isRot = false;
          } else {
            this.rotationDrive.setVector(vector);
            this.isRot = true;
          }
        }

        remove() {
          (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).Prop + this.propID, this);
          this.rotVector = null;
          this.node.active = false;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "propID", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return (_crd && PropEnum === void 0 ? (_reportPossibleCrUseOfPropEnum({
            error: Error()
          }), PropEnum) : PropEnum).gold;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1b4dd068de70cfb55f8de6887a3745b12be0f010.js.map