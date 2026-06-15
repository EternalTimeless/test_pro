System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, Node, BulletEnum, LayerEnum, LayerManager, vectorPower, AttackTargetBase, BulletManager, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, RangedAttack;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfBulletEnum(extras) {
    _reporterNs.report("BulletEnum", "db://assets/Script/Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLayerEnum(extras) {
    _reporterNs.report("LayerEnum", "db://assets/Script/Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLayerManager(extras) {
    _reporterNs.report("LayerManager", "db://assets/Script/Base/LayerManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfvectorPower(extras) {
    _reporterNs.report("vectorPower", "db://assets/Script/Tool/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAttackTargetBase(extras) {
    _reporterNs.report("AttackTargetBase", "../../Base/AttackTargetBase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletManager(extras) {
    _reporterNs.report("BulletManager", "../../BulletManager", _context.meta, extras);
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
      Node = _cc.Node;
    }, function (_unresolved_2) {
      BulletEnum = _unresolved_2.BulletEnum;
      LayerEnum = _unresolved_2.LayerEnum;
    }, function (_unresolved_3) {
      LayerManager = _unresolved_3.default;
    }, function (_unresolved_4) {
      vectorPower = _unresolved_4.vectorPower;
    }, function (_unresolved_5) {
      AttackTargetBase = _unresolved_5.AttackTargetBase;
    }, function (_unresolved_6) {
      BulletManager = _unresolved_6.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "eca5fQdrjFA+JA8tMLYW85I", "RangedAttack", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'CCInteger', 'Component', 'Node', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);
      /**远程攻击 */

      _export("RangedAttack", RangedAttack = (_dec = ccclass('RangedAttack'), _dec2 = property(CCFloat), _dec3 = property(CCFloat), _dec4 = property(Node), _dec5 = property({
        type: _crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
          error: Error()
        }), BulletEnum) : BulletEnum
      }), _dec(_class = (_class2 = class RangedAttack extends (_crd && AttackTargetBase === void 0 ? (_reportPossibleCrUseOfAttackTargetBase({
        error: Error()
      }), AttackTargetBase) : AttackTargetBase) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "bulletAngle", _descriptor, this);

          _initializerDefineProperty(this, "shootCount", _descriptor2, this);

          _initializerDefineProperty(this, "bulletShootPos", _descriptor3, this);

          _initializerDefineProperty(this, "bulletEnum", _descriptor4, this);
        }

        attackEvent(power, reoel) {
          if (this.target) {
            var targetVector = (_crd && vectorPower === void 0 ? (_reportPossibleCrUseOfvectorPower({
              error: Error()
            }), vectorPower) : vectorPower)(this.bulletShootPos, this.target.node);
            var r = Math.atan2(targetVector.y, targetVector.x);
            var angle = r / Math.PI * 180;
            var off = 0;

            if (this.shootCount > 1) {
              off = this.bulletAngle / (this.shootCount - 1);
              angle -= this.bulletAngle / 2;
            }

            var Layer = (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
              error: Error()
            }), LayerManager) : LayerManager).instance.getLayer((_crd && LayerEnum === void 0 ? (_reportPossibleCrUseOfLayerEnum({
              error: Error()
            }), LayerEnum) : LayerEnum).Layer_2_sky);

            for (var i = 0; i < this.shootCount; i++) {
              var bullet = (_crd && BulletManager === void 0 ? (_reportPossibleCrUseOfBulletManager({
                error: Error()
              }), BulletManager) : BulletManager).instance.shootBullet(this.bulletEnum, angle, power, reoel);
              angle += off;
              Layer.addChild(bullet.node);
              bullet.node.setWorldPosition(this.bulletShootPos.worldPosition);
            }
          }
        }

        get attackPos() {
          return this.bulletShootPos.worldPosition;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "bulletAngle", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 15;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "shootCount", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "bulletShootPos", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "bulletEnum", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
            error: Error()
          }), BulletEnum) : BulletEnum).arrow;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9be30ad1a917cc0914201f1db5bdf1c5cb4d6e49.js.map