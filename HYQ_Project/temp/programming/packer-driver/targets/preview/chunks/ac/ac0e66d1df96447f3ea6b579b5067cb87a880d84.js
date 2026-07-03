System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Collider, Label, Sprite, Vec3, BulletMonsterCollisionManager, BattleTarget3D, ColliderTag, COLLIDE_TYPE, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, PropBrandVisualKind, PropBrand;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfBulletMonsterCollisionManager(extras) {
    _reporterNs.report("BulletMonsterCollisionManager", "../Battle/BulletMonsterCollisionManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleTarget3D(extras) {
    _reporterNs.report("BattleTarget3D", "../Battle/BattleTarger/BattleTarget3D", _context.meta, extras);
  }

  function _reportPossibleCrUseOfColliderTag(extras) {
    _reporterNs.report("ColliderTag", "../Battle/CollectBattleTarger/ColliderTag", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCOLLIDE_TYPE(extras) {
    _reporterNs.report("COLLIDE_TYPE", "../Battle/CollectBattleTarger/ColliderTag", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Collider = _cc.Collider;
      Label = _cc.Label;
      Sprite = _cc.Sprite;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      BulletMonsterCollisionManager = _unresolved_2.default;
    }, function (_unresolved_3) {
      BattleTarget3D = _unresolved_3.BattleTarget3D;
    }, function (_unresolved_4) {
      ColliderTag = _unresolved_4.default;
      COLLIDE_TYPE = _unresolved_4.COLLIDE_TYPE;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6cd5aN9EmlJw5P0fgCs+YC/", "PropBrand", undefined);

      __checkObsolete__(['_decorator', 'Collider', 'Label', 'Node', 'Sprite', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      PropBrandVisualKind = /*#__PURE__*/function (PropBrandVisualKind) {
        PropBrandVisualKind[PropBrandVisualKind["Model"] = 0] = "Model";
        PropBrandVisualKind[PropBrandVisualKind["Sprite"] = 1] = "Sprite";
        PropBrandVisualKind[PropBrandVisualKind["Label"] = 2] = "Label";
        return PropBrandVisualKind;
      }(PropBrandVisualKind || {});

      _export("PropBrand", PropBrand = (_dec = ccclass('PropBrand'), _dec2 = property(Label), _dec3 = property(Collider), _dec(_class = (_class2 = class PropBrand extends (_crd && BattleTarget3D === void 0 ? (_reportPossibleCrUseOfBattleTarget3D({
        error: Error()
      }), BattleTarget3D) : BattleTarget3D) {
        constructor() {
          super(...arguments);
          this.skipBulletHitEffect = true;

          _initializerDefineProperty(this, "lab", _descriptor, this);

          this.count = 0;

          _initializerDefineProperty(this, "collide", _descriptor2, this);

          this.visualActive = true;
          this.visualRecords = [];
          this.registered = false;
          this.tempCollisionWorldPos = new Vec3();
        }

        setVisualActive(active) {
          if (this.visualActive === active) {
            return;
          }

          this.visualActive = active;

          if (this.visualRecords.length > 0) {
            for (var i = 0; i < this.visualRecords.length; i++) {
              this.visualRecords[i].node.active = active;
            }

            return;
          }

          for (var _i = 0; _i < this.node.children.length; _i++) {
            this.node.children[_i].active = active;
          }
        }

        activateBulletTarget() {
          this.initFixedHp(1);
          this.setupColliderTag();
          this.refreshCollisionBounds();
          this.registerTarget();
        }

        deactivateBulletTarget() {
          this.unregisterTarget();
          this.isDestroy = true;
        }

        getCollisionWorldPosition(out) {
          if (out === void 0) {
            out = this.tempCollisionWorldPos;
          }

          if (this.refreshCollisionBounds(out)) {
            return out;
          }

          return super.getCollisionWorldPosition(out);
        }

        bindVisualGroups(modelGroup, spriteGroup, labelGroup) {
          if (this.visualRecords.length <= 0) {
            var children = this.node.children.concat();

            for (var i = 0; i < children.length; i++) {
              var child = children[i];
              var kind = this.getVisualKind(child);
              this.visualRecords.push({
                node: child,
                offset: new Vec3(child.position.x, child.position.y, child.position.z),
                kind
              });
            }
          }

          for (var _i2 = 0; _i2 < this.visualRecords.length; _i2++) {
            var record = this.visualRecords[_i2];
            var group = this.getVisualGroup(record.kind, modelGroup, spriteGroup, labelGroup);

            if (record.node.parent !== group) {
              record.node.setParent(group);
            }
          }

          this.setVisualActive(this.node.active);
          this.updateVisualTransform();
        }

        updateVisualTransform() {
          for (var i = 0; i < this.visualRecords.length; i++) {
            var record = this.visualRecords[i];
            record.node.setPosition(this.node.position.x + record.offset.x, this.node.position.y + record.offset.y, this.node.position.z + record.offset.z);
          }
        }

        getVisualKind(node) {
          if (node.getComponent(Label)) {
            return PropBrandVisualKind.Label;
          }

          if (node.getComponent(Sprite)) {
            return PropBrandVisualKind.Sprite;
          }

          return PropBrandVisualKind.Model;
        }

        getVisualGroup(kind, modelGroup, spriteGroup, labelGroup) {
          switch (kind) {
            case PropBrandVisualKind.Sprite:
              return spriteGroup;

            case PropBrandVisualKind.Label:
              return labelGroup;

            default:
              return modelGroup;
          }
        }

        init(num) {
          if (num === void 0) {
            num = 1;
          }

          this.count = num;
          this.lab.string = "+" + num;
        }

        _update(dt) {}

        Hit(damage) {
          this.refreshCollisionBounds();
          return 1;
        }

        damage(power) {}

        die() {}

        repelBattleTarget(target, reoel) {}

        refreshCollisionBounds(out) {
          var _this$collide;

          var worldBounds = (_this$collide = this.collide) == null ? void 0 : _this$collide.worldBounds;
          var center = worldBounds == null ? void 0 : worldBounds.center;
          var halfExtents = worldBounds == null ? void 0 : worldBounds.halfExtents;

          if (!center || !halfExtents) {
            return false;
          }

          this.collisionHalfX = Math.max(0.05, halfExtents.x);
          this.collisionHalfZ = Math.max(0.05, halfExtents.z);

          if (out) {
            out.set(center.x, center.y, center.z);
          }

          return true;
        }

        setupColliderTag() {
          var tag = this.getComponent(_crd && ColliderTag === void 0 ? (_reportPossibleCrUseOfColliderTag({
            error: Error()
          }), ColliderTag) : ColliderTag);

          if (!tag) {
            tag = this.addComponent(_crd && ColliderTag === void 0 ? (_reportPossibleCrUseOfColliderTag({
              error: Error()
            }), ColliderTag) : ColliderTag);
          }

          tag.tag = (_crd && COLLIDE_TYPE === void 0 ? (_reportPossibleCrUseOfCOLLIDE_TYPE({
            error: Error()
          }), COLLIDE_TYPE) : COLLIDE_TYPE).MONSTER;
        }

        registerTarget() {
          if (this.registered) {
            return;
          }

          (_crd && BulletMonsterCollisionManager === void 0 ? (_reportPossibleCrUseOfBulletMonsterCollisionManager({
            error: Error()
          }), BulletMonsterCollisionManager) : BulletMonsterCollisionManager).instance.registerTarget(this);
          this.registered = true;
        }

        unregisterTarget() {
          if (!this.registered) {
            return;
          }

          (_crd && BulletMonsterCollisionManager === void 0 ? (_reportPossibleCrUseOfBulletMonsterCollisionManager({
            error: Error()
          }), BulletMonsterCollisionManager) : BulletMonsterCollisionManager).instance.unregisterTarget(this);
          this.registered = false;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "lab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "collide", [_dec3], {
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
//# sourceMappingURL=ac0e66d1df96447f3ea6b579b5067cb87a880d84.js.map