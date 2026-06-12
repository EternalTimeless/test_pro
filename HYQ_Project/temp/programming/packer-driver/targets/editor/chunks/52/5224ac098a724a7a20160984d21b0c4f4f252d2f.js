System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Collider, BagBase, ColliderTag, COLLIDE_TYPE, Shopping, BuyWayBase, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, BuyWay3D;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfBagBase(extras) {
    _reporterNs.report("BagBase", "../../Bag/Base/BagBase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfColliderTag(extras) {
    _reporterNs.report("ColliderTag", "../../Battle/CollectBattleTarger/ColliderTag", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCOLLIDE_TYPE(extras) {
    _reporterNs.report("COLLIDE_TYPE", "../../Battle/CollectBattleTarger/ColliderTag", _context.meta, extras);
  }

  function _reportPossibleCrUseOfShopping(extras) {
    _reporterNs.report("Shopping", "../Shopping", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBuyWayBase(extras) {
    _reporterNs.report("BuyWayBase", "./BuyWayBase", _context.meta, extras);
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
    }, function (_unresolved_2) {
      BagBase = _unresolved_2.BagBase;
    }, function (_unresolved_3) {
      ColliderTag = _unresolved_3.default;
      COLLIDE_TYPE = _unresolved_3.COLLIDE_TYPE;
    }, function (_unresolved_4) {
      Shopping = _unresolved_4.default;
    }, function (_unresolved_5) {
      BuyWayBase = _unresolved_5.BuyWayBase;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "24305K7czBHTYqEb6cSKhlO", "BuyWay3D", undefined);

      __checkObsolete__(['_decorator', 'Collider', 'ITriggerEvent', 'Vec3', 'v3', 'Node']);

      ({
        ccclass,
        property
      } = _decorator); // CCClass(BagList);

      _export("BuyWay3D", BuyWay3D = (_dec = ccclass('BuyWay3D'), _dec2 = property(Collider), _dec(_class = (_class2 = class BuyWay3D extends (_crd && BuyWayBase === void 0 ? (_reportPossibleCrUseOfBuyWayBase({
        error: Error()
      }), BuyWayBase) : BuyWayBase) {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "collide", _descriptor, this);
        }

        onLoad() {
          this.collide.on("onTriggerEnter", this.onBeginContact, this);
          this.collide.on("onTriggerExit", this.onEndContact, this);
          super.onLoad();
        }

        onBeginContact(event) {
          let tag = event.otherCollider.getComponent(_crd && ColliderTag === void 0 ? (_reportPossibleCrUseOfColliderTag({
            error: Error()
          }), ColliderTag) : ColliderTag);

          switch (tag.tag) {
            case (_crd && COLLIDE_TYPE === void 0 ? (_reportPossibleCrUseOfCOLLIDE_TYPE({
              error: Error()
            }), COLLIDE_TYPE) : COLLIDE_TYPE).SHOP:
              let shopping = event.otherCollider.getComponent(_crd && Shopping === void 0 ? (_reportPossibleCrUseOfShopping({
                error: Error()
              }), Shopping) : Shopping);

              if (this.shopingList.indexOf(shopping) == -1) {
                this.shopingList.push(shopping);
              }

              break;

            case (_crd && COLLIDE_TYPE === void 0 ? (_reportPossibleCrUseOfCOLLIDE_TYPE({
              error: Error()
            }), COLLIDE_TYPE) : COLLIDE_TYPE).BAG:
              let bag = event.otherCollider.getComponent(_crd && BagBase === void 0 ? (_reportPossibleCrUseOfBagBase({
                error: Error()
              }), BagBase) : BagBase);

              if (this.nBagArr.indexOf(bag) == -1) {
                this.nBagArr.push(bag);
              }

              break;
          }
        }

        onEndContact(event) {
          let tag = event.otherCollider.getComponent(_crd && ColliderTag === void 0 ? (_reportPossibleCrUseOfColliderTag({
            error: Error()
          }), ColliderTag) : ColliderTag);

          switch (tag.tag) {
            case (_crd && COLLIDE_TYPE === void 0 ? (_reportPossibleCrUseOfCOLLIDE_TYPE({
              error: Error()
            }), COLLIDE_TYPE) : COLLIDE_TYPE).SHOP:
              let shopping = event.otherCollider.getComponent(_crd && Shopping === void 0 ? (_reportPossibleCrUseOfShopping({
                error: Error()
              }), Shopping) : Shopping);
              let index = this.shopingList.indexOf(shopping);

              if (index != -1) {
                this.shopingList.splice(index, 1);
              }

              break;

            case (_crd && COLLIDE_TYPE === void 0 ? (_reportPossibleCrUseOfCOLLIDE_TYPE({
              error: Error()
            }), COLLIDE_TYPE) : COLLIDE_TYPE).BAG:
              let bag = event.otherCollider.getComponent(_crd && BagBase === void 0 ? (_reportPossibleCrUseOfBagBase({
                error: Error()
              }), BagBase) : BagBase);
              let index2 = this.nBagArr.indexOf(bag);

              if (index2 != -1) {
                this.nBagArr.splice(index2, 1);
              }

              break;
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "collide", [_dec2], {
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
//# sourceMappingURL=5224ac098a724a7a20160984d21b0c4f4f252d2f.js.map