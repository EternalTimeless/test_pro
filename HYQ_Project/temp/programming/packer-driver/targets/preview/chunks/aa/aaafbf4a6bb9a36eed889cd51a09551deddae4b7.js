System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCBoolean, CCFloat, error, CollectGetTarget, AttackState, UnityUpComponent, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, AttackTargetBase;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfCollectGetTarget(extras) {
    _reporterNs.report("CollectGetTarget", "../CollectBattleTarger/CollectGetTarget", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAttackState(extras) {
    _reporterNs.report("AttackState", "../Attack/AttackState", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnityUpComponent(extras) {
    _reporterNs.report("UnityUpComponent", "../../../Base/UnityUpComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleTargetBase(extras) {
    _reporterNs.report("BattleTargetBase", "./BattleTargetBase", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CCBoolean = _cc.CCBoolean;
      CCFloat = _cc.CCFloat;
      error = _cc.error;
    }, function (_unresolved_2) {
      CollectGetTarget = _unresolved_2.CollectGetTarget;
    }, function (_unresolved_3) {
      AttackState = _unresolved_3.default;
    }, function (_unresolved_4) {
      UnityUpComponent = _unresolved_4.UnityUpComponent;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8492e6+gVxPDJDNDznDVpiX", "AttackTargetBase", undefined);

      __checkObsolete__(['_decorator', 'CCBoolean', 'CCFloat', 'Component', 'error', 'Node', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);
      /**攻击方式基类 */

      _export("AttackTargetBase", AttackTargetBase = (_dec = ccclass('AttackTargetBase'), _dec2 = property(CCFloat), _dec3 = property(CCFloat), _dec4 = property(CCFloat), _dec5 = property(CCBoolean), _dec6 = property(CCBoolean), _dec(_class = (_class2 = class AttackTargetBase extends (_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
        error: Error()
      }), UnityUpComponent) : UnityUpComponent) {
        constructor() {
          super(...arguments);
          this.collectGettarget = void 0;
          this.attackState = new (_crd && AttackState === void 0 ? (_reportPossibleCrUseOfAttackState({
            error: Error()
          }), AttackState) : AttackState)();

          _initializerDefineProperty(this, "attackSpeed", _descriptor, this);

          this._attackTime = 0;

          _initializerDefineProperty(this, "power", _descriptor2, this);

          _initializerDefineProperty(this, "reoel", _descriptor3, this);

          _initializerDefineProperty(this, "attackOff", _descriptor4, this);

          this.target = void 0;

          _initializerDefineProperty(this, "isAttackAnim", _descriptor5, this);
        }

        start() {
          this.collectGettarget = this.node.parent.getComponent(_crd && CollectGetTarget === void 0 ? (_reportPossibleCrUseOfCollectGetTarget({
            error: Error()
          }), CollectGetTarget) : CollectGetTarget);

          if (this.collectGettarget == null) {
            error("collectGettarget Null");
            debugger;
          }

          this.attackCooTime = this.attackTime;
        }

        UpAttackSpeedTime() {
          this.attackCooTime = this.attackTime;
        }

        get attackTime() {
          return 1 / this.attackSpeed;
        }

        attack() {
          for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
          }

          this.attackEvent(this.power, this.reoel, ...params);
        }

        _update(dt) {
          this.attackCooTime -= dt;
        }

        get isAttack() {
          this.target = this.collectGettarget.singleTarget;

          if (!this.target || this.target.isDie) {
            return false;
          }

          return this.attackOff && this.attackCooTime <= 0 && !this.attackState.attackIn && this.collectGettarget.isCanAttack;
        }

        get attackPos() {
          return this.node.worldPosition;
        }
        /**获取当前  朝向和攻击目标  如果为0 说明没有攻击目标 */


        get vector() {
          if (this.target) {
            var x = this.target.node.worldPosition.x - this.node.worldPosition.x;
            return x / Math.abs(x);
          } else {
            return 0;
          }
        }

        get attackTarget() {
          if (this.attackOff) {
            return this.target;
          } else {
            return null;
          }
        }

        set attackTarget(value) {
          this.target = value;
        }

        get isCanAttack() {
          return this.collectGettarget.isCanAttack;
        }

        set attackCooTime(value) {
          if (this.isAttackAnim) {
            this._attackTime = -1;
          } else {
            this._attackTime = value;
          }
        }

        get attackCooTime() {
          return this._attackTime;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "attackSpeed", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "power", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 30;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "reoel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 30;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "attackOff", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "isAttackAnim", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=aaafbf4a6bb9a36eed889cd51a09551deddae4b7.js.map