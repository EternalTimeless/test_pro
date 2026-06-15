System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, Vec3, BattleTargetBase, EffectEnum, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, BattleTarget3D;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfBattleTargetBase(extras) {
    _reporterNs.report("BattleTargetBase", "../Base/BattleTargetBase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEffectEnum(extras) {
    _reporterNs.report("EffectEnum", "../../../Base/EnumList", _context.meta, extras);
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
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      BattleTargetBase = _unresolved_2.BattleTargetBase;
    }, function (_unresolved_3) {
      EffectEnum = _unresolved_3.EffectEnum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d490fxBK39CCaax3KE50D/v", "BattleTarget3D", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'CCBoolean', 'Component', 'Node', 'RigidBody', 'RigidBody2D', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BattleTarget3D", BattleTarget3D = (_dec = ccclass('BattleTarget3D'), _dec2 = property({
        type: _crd && EffectEnum === void 0 ? (_reportPossibleCrUseOfEffectEnum({
          error: Error()
        }), EffectEnum) : EffectEnum
      }), _dec3 = property({
        type: CCFloat,
        tooltip: 'x方向碰撞半宽（替代物理Collider尺寸）'
      }), _dec4 = property({
        type: CCFloat,
        tooltip: 'z方向碰撞半深（替代物理Collider尺寸）'
      }), _dec5 = property({
        tooltip: '是否受击退影响（静态物体取消勾选）'
      }), _dec(_class = (_class2 = class BattleTarget3D extends (_crd && BattleTargetBase === void 0 ? (_reportPossibleCrUseOfBattleTargetBase({
        error: Error()
      }), BattleTargetBase) : BattleTargetBase) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "hitEffect", _descriptor, this);

          _initializerDefineProperty(this, "collisionHalfX", _descriptor2, this);

          _initializerDefineProperty(this, "collisionHalfZ", _descriptor3, this);

          _initializerDefineProperty(this, "repelEnabled", _descriptor4, this);

          /** 击退速度向量（预分配，避免每帧new） */
          this._repelVel = new Vec3();

          /** 击退衰减系数 */
          this._repelDecay = 0.9;

          /** 是否有击退速度 */
          this._hasRepel = false;

          /** 临时Vec3，预分配复用 */
          this._tempPos = new Vec3();
        }

        repelBattleTarget(target, reoel) {
          if (reoel === void 0) {
            reoel = 0;
          }

          if (!this.repelEnabled) return; // 计算击退方向（从攻击者指向自己）

          Vec3.subtract(this._repelVel, this.node.worldPosition, target.worldPosition);

          this._repelVel.normalize();

          this._repelVel.y = 0;

          this._repelVel.multiplyScalar(reoel);

          this._hasRepel = true;
        }
        /** 每帧处理击退衰减 - 由子类update中调用 */


        updateRepel(dt) {
          if (!this._hasRepel) return;

          if (this._repelVel.lengthSqr() > 0.001) {
            var p = this.node.position;

            this._tempPos.set(p.x + this._repelVel.x * dt, p.y, p.z + this._repelVel.z * dt);

            this.node.setPosition(this._tempPos);

            this._repelVel.multiplyScalar(this._repelDecay);
          } else {
            this._hasRepel = false;
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "hitEffect", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return (_crd && EffectEnum === void 0 ? (_reportPossibleCrUseOfEffectEnum({
            error: Error()
          }), EffectEnum) : EffectEnum).Monsterhit;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "collisionHalfX", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.23;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "collisionHalfZ", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.23;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "repelEnabled", [_dec5], {
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
//# sourceMappingURL=9a8786a747b555136cef77c9f5e7ad17e18a31eb.js.map