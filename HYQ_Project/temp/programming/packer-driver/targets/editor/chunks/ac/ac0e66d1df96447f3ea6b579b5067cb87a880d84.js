System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Collider, Component, Label, Sprite, Vec3, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, PropBrandVisualKind, PropBrand;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Collider = _cc.Collider;
      Component = _cc.Component;
      Label = _cc.Label;
      Sprite = _cc.Sprite;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6cd5aN9EmlJw5P0fgCs+YC/", "PropBrand", undefined);

      __checkObsolete__(['_decorator', 'Collider', 'Component', 'Label', 'Node', 'Sprite', 'Vec3']);

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

      _export("PropBrand", PropBrand = (_dec = ccclass('PropBrand'), _dec2 = property(Label), _dec3 = property(Collider), _dec(_class = (_class2 = class PropBrand extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "lab", _descriptor, this);

          this.count = 0;

          _initializerDefineProperty(this, "collide", _descriptor2, this);

          this.visualActive = true;
          this.visualRecords = [];
        }

        setVisualActive(active) {
          if (this.visualActive === active) {
            return;
          }

          this.visualActive = active;

          if (this.visualRecords.length > 0) {
            for (let i = 0; i < this.visualRecords.length; i++) {
              this.visualRecords[i].node.active = active;
            }

            return;
          }

          for (let i = 0; i < this.node.children.length; i++) {
            this.node.children[i].active = active;
          }
        }

        bindVisualGroups(modelGroup, spriteGroup, labelGroup) {
          if (this.visualRecords.length <= 0) {
            const children = this.node.children.concat();

            for (let i = 0; i < children.length; i++) {
              const child = children[i];
              const kind = this.getVisualKind(child);
              this.visualRecords.push({
                node: child,
                offset: new Vec3(child.position.x, child.position.y, child.position.z),
                kind
              });
            }
          }

          for (let i = 0; i < this.visualRecords.length; i++) {
            const record = this.visualRecords[i];
            const group = this.getVisualGroup(record.kind, modelGroup, spriteGroup, labelGroup);

            if (record.node.parent !== group) {
              record.node.setParent(group);
            }
          }

          this.setVisualActive(this.node.active);
          this.updateVisualTransform();
        }

        updateVisualTransform() {
          for (let i = 0; i < this.visualRecords.length; i++) {
            const record = this.visualRecords[i];
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

        init(num = 1) {
          this.count = num;
          this.lab.string = `+${num}`;
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