System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, RigidBody, SphereCollider, CollectGetTarget, ColliderTag, COLLIDE_TYPE, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, TriggerBase3D;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfCollectGetTarget(extras) {
    _reporterNs.report("CollectGetTarget", "../CollectBattleTarger/CollectGetTarget", _context.meta, extras);
  }

  function _reportPossibleCrUseOfColliderTag(extras) {
    _reporterNs.report("ColliderTag", "../CollectBattleTarger/ColliderTag", _context.meta, extras);
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
      RigidBody = _cc.RigidBody;
      SphereCollider = _cc.SphereCollider;
    }, function (_unresolved_2) {
      CollectGetTarget = _unresolved_2.CollectGetTarget;
    }, function (_unresolved_3) {
      ColliderTag = _unresolved_3.default;
      COLLIDE_TYPE = _unresolved_3.COLLIDE_TYPE;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5c0b3tssi1LNpBQiSZaQCoU", "TriggerBase3D", undefined);

      __checkObsolete__(['_decorator', 'ccenum', 'CCInteger', 'CircleCollider2D', 'Collider', 'Collider2D', 'Component', 'Contact2DType', 'IPhysics2DContact', 'ITriggerEvent', 'Node', 'RigidBody', 'RigidBody2D', 'SphereCollider']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("TriggerBase3D", TriggerBase3D = (_dec = ccclass('TriggerBase3D'), _dec2 = property({
        type: _crd && COLLIDE_TYPE === void 0 ? (_reportPossibleCrUseOfCOLLIDE_TYPE({
          error: Error()
        }), COLLIDE_TYPE) : COLLIDE_TYPE
      }), _dec(_class = (_class2 = class TriggerBase3D extends (_crd && CollectGetTarget === void 0 ? (_reportPossibleCrUseOfCollectGetTarget({
        error: Error()
      }), CollectGetTarget) : CollectGetTarget) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "attackTargetTag", _descriptor, this);

          this.attackCollide = void 0;
          this.rig = void 0;
        }

        onLoad() {
          this.attackCollide = this.getComponent(SphereCollider);
          this.attackCollide.on("onTriggerEnter", this.onStartCollide, this);
          this.attackCollide.on("onTriggerExit", this.onEndCollide, this);
          this.rig = this.node.getComponent(RigidBody);
        }

        onStartCollide(event) {
          var colliderTag = event.otherCollider.getComponent(_crd && ColliderTag === void 0 ? (_reportPossibleCrUseOfColliderTag({
            error: Error()
          }), ColliderTag) : ColliderTag);

          if (colliderTag) {
            if (this.attackTargetTag.indexOf(colliderTag.tag) != -1) {
              event.otherCollider;

              this._startCollide(event);
            }
          }
        }

        onEndCollide(event) {
          var colliderTag = event.otherCollider.getComponent(_crd && ColliderTag === void 0 ? (_reportPossibleCrUseOfColliderTag({
            error: Error()
          }), ColliderTag) : ColliderTag);

          if (colliderTag) {
            if (this.attackTargetTag.indexOf(colliderTag.tag) != -1) {
              event.otherCollider;

              this._EndCollide(event);
            }
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
//# sourceMappingURL=031aac2e2ea93f03b5422269c22800e822715034.js.map