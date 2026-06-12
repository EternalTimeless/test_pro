System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CircleCollider2D, Contact2DType, RigidBody2D, CollectGetTarget, COLLIDE_TYPE, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, TriggerBase2D;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfCollectGetTarget(extras) {
    _reporterNs.report("CollectGetTarget", "../CollectBattleTarger/CollectGetTarget", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCOLLIDE_TYPE(extras) {
    _reporterNs.report("COLLIDE_TYPE", "../CollectBattleTarger/ColliderTag", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CircleCollider2D = _cc.CircleCollider2D;
      Contact2DType = _cc.Contact2DType;
      RigidBody2D = _cc.RigidBody2D;
    }, function (_unresolved_2) {
      CollectGetTarget = _unresolved_2.CollectGetTarget;
    }, function (_unresolved_3) {
      COLLIDE_TYPE = _unresolved_3.COLLIDE_TYPE;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "90e66DYgPVPA4p4eiIn58kl", "TriggerBase2D", undefined);

      __checkObsolete__(['_decorator', 'ccenum', 'CCInteger', 'CircleCollider2D', 'Collider2D', 'Component', 'Contact2DType', 'IPhysics2DContact', 'Node', 'RigidBody', 'RigidBody2D']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("TriggerBase2D", TriggerBase2D = (_dec = ccclass('TriggerBase2D'), _dec2 = property({
        type: _crd && COLLIDE_TYPE === void 0 ? (_reportPossibleCrUseOfCOLLIDE_TYPE({
          error: Error()
        }), COLLIDE_TYPE) : COLLIDE_TYPE
      }), _dec(_class = (_class2 = class TriggerBase2D extends (_crd && CollectGetTarget === void 0 ? (_reportPossibleCrUseOfCollectGetTarget({
        error: Error()
      }), CollectGetTarget) : CollectGetTarget) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "attackTargetTag", _descriptor, this);

          this.attackCollide = void 0;
          this.rig = void 0;
        }

        onLoad() {
          this.attackCollide = this.getComponent(CircleCollider2D);
          this.attackCollide.on(Contact2DType.BEGIN_CONTACT, this.onStartCollide, this);
          this.attackCollide.on(Contact2DType.END_CONTACT, this.onEndCollide, this);
          this.rig = this.node.getComponent(RigidBody2D);
        }

        onStartCollide(selfCollide, other, contcat) {
          if (this.attackTargetTag.indexOf(other.tag) != -1) {
            this._startCollide(other);
          }
        }

        onEndCollide(selfCollide, other, contcat) {
          if (this.attackTargetTag.indexOf(other.tag) != -1) {
            this._EndCollide(other);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "attackTargetTag", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=c29a763de41c02f5bdf1f3e8c14258355e8da6c7.js.map