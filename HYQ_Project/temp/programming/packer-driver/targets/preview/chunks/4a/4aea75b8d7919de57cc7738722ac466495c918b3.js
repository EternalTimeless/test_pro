System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, ccenum, Component, _dec, _dec2, _class, _class2, _descriptor, _crd, COLLIDE_TYPE, ccclass, property, ColliderTag;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      ccenum = _cc.ccenum;
      Component = _cc.Component;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "da648v4qxRKaqR0mDLfS0Zs", "ColliderTag", undefined);

      __checkObsolete__(['_decorator', 'ccenum', 'Component']);

      _export("COLLIDE_TYPE", COLLIDE_TYPE = /*#__PURE__*/function (COLLIDE_TYPE) {
        COLLIDE_TYPE[COLLIDE_TYPE["HERO"] = 10] = "HERO";
        COLLIDE_TYPE[COLLIDE_TYPE["WALL"] = 11] = "WALL";
        COLLIDE_TYPE[COLLIDE_TYPE["SHOP"] = 12] = "SHOP";
        COLLIDE_TYPE[COLLIDE_TYPE["MONSTER"] = 13] = "MONSTER";
        COLLIDE_TYPE[COLLIDE_TYPE["BAG"] = 14] = "BAG";
        COLLIDE_TYPE[COLLIDE_TYPE["MOONWALK"] = 15] = "MOONWALK";
        COLLIDE_TYPE[COLLIDE_TYPE["TOWER"] = 16] = "TOWER";
        COLLIDE_TYPE[COLLIDE_TYPE["SPACECRAFT"] = 17] = "SPACECRAFT";
        COLLIDE_TYPE[COLLIDE_TYPE["PLAYERATTACK"] = 18] = "PLAYERATTACK";
        return COLLIDE_TYPE;
      }({}));

      ccenum(COLLIDE_TYPE);
      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 战斗目标 收集器  
       */

      _export("default", ColliderTag = (_dec = ccclass('ColliderTag'), _dec2 = property({
        type: COLLIDE_TYPE
      }), _dec(_class = (_class2 = class ColliderTag extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "tag", _descriptor, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "tag", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return COLLIDE_TYPE.HERO;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4aea75b8d7919de57cc7738722ac466495c918b3.js.map