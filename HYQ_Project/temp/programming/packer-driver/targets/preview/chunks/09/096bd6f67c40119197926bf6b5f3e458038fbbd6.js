System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, math, Node, Quat, Vec3, BulletEnum, LayerEnum, LayerManager, vectorPower2, AttackParkPlay, AttackTargetBase, BulletManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, RangedAttack_Shrapnel;

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
    _reporterNs.report("vectorPower2", "db://assets/Script/Tool/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAttackParkPlay(extras) {
    _reporterNs.report("AttackParkPlay", "../AttackParkPlay", _context.meta, extras);
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
      math = _cc.math;
      Node = _cc.Node;
      Quat = _cc.Quat;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      BulletEnum = _unresolved_2.BulletEnum;
      LayerEnum = _unresolved_2.LayerEnum;
    }, function (_unresolved_3) {
      LayerManager = _unresolved_3.default;
    }, function (_unresolved_4) {
      vectorPower2 = _unresolved_4.vectorPower2;
    }, function (_unresolved_5) {
      AttackParkPlay = _unresolved_5.AttackParkPlay;
    }, function (_unresolved_6) {
      AttackTargetBase = _unresolved_6.AttackTargetBase;
    }, function (_unresolved_7) {
      BulletManager = _unresolved_7.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e7536BDIttIJ5ZAZE38Zwpx", "RangedAttack_Shrapnel", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'CCInteger', 'Component', 'math', 'Node', 'Quat', 'v3', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);
      /**远程攻击 */

      _export("RangedAttack_Shrapnel", RangedAttack_Shrapnel = (_dec = ccclass('RangedAttack_Shrapnel'), _dec2 = property(_crd && AttackParkPlay === void 0 ? (_reportPossibleCrUseOfAttackParkPlay({
        error: Error()
      }), AttackParkPlay) : AttackParkPlay), _dec3 = property(CCFloat), _dec4 = property(CCFloat), _dec5 = property(Node), _dec6 = property({
        type: _crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
          error: Error()
        }), BulletEnum) : BulletEnum
      }), _dec(_class = (_class2 = class RangedAttack_Shrapnel extends (_crd && AttackTargetBase === void 0 ? (_reportPossibleCrUseOfAttackTargetBase({
        error: Error()
      }), AttackTargetBase) : AttackTargetBase) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "attackParkPlay", _descriptor, this);

          _initializerDefineProperty(this, "bulletAngle", _descriptor2, this);

          _initializerDefineProperty(this, "shootCount", _descriptor3, this);

          _initializerDefineProperty(this, "bulletShootPos", _descriptor4, this);

          _initializerDefineProperty(this, "bulletEnum", _descriptor5, this);

          this.tempQ = new math.Quat();
          this.tempQ2 = new math.Quat();
        }

        attackEvent(power, reoel) {
          if (this.target) {
            var target = this.target;
            var tPos = target.node.worldPosition;
            var targetVector = (_crd && vectorPower2 === void 0 ? (_reportPossibleCrUseOfvectorPower({
              error: Error()
            }), vectorPower2) : vectorPower2)(this.bulletShootPos.worldPosition, tPos);

            if (this.attackParkPlay) {
              this.attackParkPlay.play();
              this.attackParkPlay.node.parent.lookAt(target.node.worldPosition);
            }

            Quat.fromViewUp(this.tempQ, targetVector, Vec3.UP);
            var Layer = (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
              error: Error()
            }), LayerManager) : LayerManager).instance.getLayer((_crd && LayerEnum === void 0 ? (_reportPossibleCrUseOfLayerEnum({
              error: Error()
            }), LayerEnum) : LayerEnum).Layer_2_sky);

            for (var i = 0; i < this.shootCount; i++) {
              var randomAngle = math.randomRange(-this.bulletAngle, this.bulletAngle);
              Quat.fromAxisAngle(this.tempQ2, Vec3.UP, math.toRadian(randomAngle));
              Quat.multiply(this.tempQ2, this.tempQ, this.tempQ2);
              var bullet = (_crd && BulletManager === void 0 ? (_reportPossibleCrUseOfBulletManager({
                error: Error()
              }), BulletManager) : BulletManager).instance.shootBullet3D(this.bulletEnum, this.tempQ2, power, reoel);
              Layer.addChild(bullet.node);
              bullet.node.setWorldPosition(this.bulletShootPos.worldPosition);
            }
          }
        }

        get attackPos() {
          return this.bulletShootPos.worldPosition;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "attackParkPlay", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "bulletAngle", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 15;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "shootCount", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "bulletShootPos", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "bulletEnum", [_dec6], {
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
//# sourceMappingURL=096bd6f67c40119197926bf6b5f3e458038fbbd6.js.map