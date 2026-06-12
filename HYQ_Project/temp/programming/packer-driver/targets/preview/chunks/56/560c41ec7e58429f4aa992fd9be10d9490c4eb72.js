System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, Node, BulletEnum, LayerEnum, LayerManager, AttackTargetBase, BulletManager, AttackParkPlay, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, RangeTowerAttack;

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

  function _reportPossibleCrUseOfAttackTargetBase(extras) {
    _reporterNs.report("AttackTargetBase", "../../Base/AttackTargetBase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletManager(extras) {
    _reporterNs.report("BulletManager", "../../BulletManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAttackParkPlay(extras) {
    _reporterNs.report("AttackParkPlay", "../AttackParkPlay", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Animation = _cc.Animation;
      Node = _cc.Node;
    }, function (_unresolved_2) {
      BulletEnum = _unresolved_2.BulletEnum;
      LayerEnum = _unresolved_2.LayerEnum;
    }, function (_unresolved_3) {
      LayerManager = _unresolved_3.default;
    }, function (_unresolved_4) {
      AttackTargetBase = _unresolved_4.AttackTargetBase;
    }, function (_unresolved_5) {
      BulletManager = _unresolved_5.default;
    }, function (_unresolved_6) {
      AttackParkPlay = _unresolved_6.AttackParkPlay;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ca0fdPWVeRFyoDkTIJDoGP9", "RangeTowerAttack", undefined);

      __checkObsolete__(['_decorator', 'Animation', 'CCFloat', 'Component', 'math', 'Node', 'Quat', 'v3', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("RangeTowerAttack", RangeTowerAttack = (_dec = ccclass('RangeTowerAttack'), _dec2 = property(_crd && AttackParkPlay === void 0 ? (_reportPossibleCrUseOfAttackParkPlay({
        error: Error()
      }), AttackParkPlay) : AttackParkPlay), _dec3 = property(Node), _dec4 = property(Animation), _dec5 = property({
        type: _crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
          error: Error()
        }), BulletEnum) : BulletEnum
      }), _dec6 = property(Node), _dec(_class = (_class2 = class RangeTowerAttack extends (_crd && AttackTargetBase === void 0 ? (_reportPossibleCrUseOfAttackTargetBase({
        error: Error()
      }), AttackTargetBase) : AttackTargetBase) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "attackParkPlay", _descriptor, this);

          _initializerDefineProperty(this, "bulletShootPos", _descriptor2, this);

          _initializerDefineProperty(this, "attackAnimation", _descriptor3, this);

          this._index = 0;

          _initializerDefineProperty(this, "bulletEnum", _descriptor4, this);

          _initializerDefineProperty(this, "gunNode", _descriptor5, this);
        }

        attackEvent(power, reoel) {
          if (this.target) {
            var bulletShootPos = this.bulletShootPos[this._index];
            var attackParkPlay = this.attackParkPlay[this._index];
            var attackAnimation = this.attackAnimation[this._index];
            this.attackParkPlay && attackParkPlay.play();
            attackAnimation.play();
            var Layer = (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
              error: Error()
            }), LayerManager) : LayerManager).instance.getLayer((_crd && LayerEnum === void 0 ? (_reportPossibleCrUseOfLayerEnum({
              error: Error()
            }), LayerEnum) : LayerEnum).Layer_2_sky); // for (let i = 0; i < this.shootCount; i++) {

            var bullet = (_crd && BulletManager === void 0 ? (_reportPossibleCrUseOfBulletManager({
              error: Error()
            }), BulletManager) : BulletManager).instance.shootBullet3D(this.bulletEnum, this.gunNode.worldRotation, power, reoel);
            Layer.addChild(bullet.node);
            bullet.node.setWorldPosition(bulletShootPos.worldPosition); // }

            this._index++;

            if (this._index >= this.bulletShootPos.length) {
              this._index = 0;
            }
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "attackParkPlay", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "bulletShootPos", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "attackAnimation", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "bulletEnum", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
            error: Error()
          }), BulletEnum) : BulletEnum).arrow;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "gunNode", [_dec6], {
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
//# sourceMappingURL=560c41ec7e58429f4aa992fd9be10d9490c4eb72.js.map