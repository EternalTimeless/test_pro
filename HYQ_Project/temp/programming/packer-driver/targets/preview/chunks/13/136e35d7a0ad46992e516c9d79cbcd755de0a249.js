System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Collider2D, Component, Contact2DType, RigidBody2D, COLLIDE_TYPE, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, BulletCollideBase2D;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfCOLLIDE_TYPE(extras) {
    _reporterNs.report("COLLIDE_TYPE", "../../CollectBattleTarger/ColliderTag", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Collider2D = _cc.Collider2D;
      Component = _cc.Component;
      Contact2DType = _cc.Contact2DType;
      RigidBody2D = _cc.RigidBody2D;
    }, function (_unresolved_2) {
      COLLIDE_TYPE = _unresolved_2.COLLIDE_TYPE;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "aa4e5TAE4ZKboBZeuEInyt7", "BulletCollideBase2D", undefined);

      __checkObsolete__(['_decorator', 'Collider2D', 'Component', 'Contact2DType', 'IPhysics2DContact', 'RigidBody2D', 'sp']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BulletCollideBase2D", BulletCollideBase2D = (_dec = ccclass('BulletCollideBase2D'), _dec2 = property({
        type: _crd && COLLIDE_TYPE === void 0 ? (_reportPossibleCrUseOfCOLLIDE_TYPE({
          error: Error()
        }), COLLIDE_TYPE) : COLLIDE_TYPE
      }), _dec(_class = (_class2 = class BulletCollideBase2D extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "attackTargetTag", _descriptor, this);

          this.attackCollide = void 0;
          this.rig = void 0;
        }

        onLoad() {
          this.attackCollide = this.getComponent(Collider2D);
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
//# sourceMappingURL=136e35d7a0ad46992e516c9d79cbcd755de0a249.js.map