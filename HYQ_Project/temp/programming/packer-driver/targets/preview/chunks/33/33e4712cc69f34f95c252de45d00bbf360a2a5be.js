System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, Vec3, AttackTargetBase, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, AreaAttack;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfAttackTargetBase(extras) {
    _reporterNs.report("AttackTargetBase", "../Base/AttackTargetBase", _context.meta, extras);
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
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      AttackTargetBase = _unresolved_2.AttackTargetBase;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ba1649DeftI7YbtG1qAdePy", "AreaAttack", undefined);

      __checkObsolete__(['_decorator', 'Animation', 'Component', 'Node', 'profiler', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);
      /**近战范围攻击 */

      _export("AreaAttack", AreaAttack = (_dec = ccclass('AreaAttack'), _dec2 = property(Animation), _dec(_class = (_class2 = class AreaAttack extends (_crd && AttackTargetBase === void 0 ? (_reportPossibleCrUseOfAttackTargetBase({
        error: Error()
      }), AttackTargetBase) : AttackTargetBase) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "effect_anim", _descriptor, this);

          // @property({ type: Bullet_Hit_Enum })
          // public hitEnum: Bullet_Hit_Enum = Bullet_Hit_Enum.zhanshi;
          this.temp = new Vec3();
        }

        attackEvent(power, reoel) {
          var targetList = this.collectGettarget.groupTarget;

          if (targetList == null) {
            this.target = null;
            return;
          }

          this.effect_anim && this.effect_anim.play();
          this.target = targetList[0];

          for (var i = 0; i < targetList.length; i++) {
            var target = targetList[i];
            target.Hit(power);
            target.repelBattleTarget(this.node, reoel);
            var pos = target.node.worldPosition;
            this.temp.set(pos.x, pos.y + 50); // EffectManager.instance.ShowEffect(this.temp, PoolEnum.bullet_hit, this.hitEnum)
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "effect_anim", [_dec2], {
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
//# sourceMappingURL=33e4712cc69f34f95c252de45d00bbf360a2a5be.js.map