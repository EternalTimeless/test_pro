System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, error, instantiate, Prefab, PrefabsEnum, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _dec4, _dec5, _class4, _class5, _descriptor3, _class6, _crd, ccclass, property, PrefabsRes, PrefabsManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPrefabsEnum(extras) {
    _reporterNs.report("PrefabsEnum", "./EnumList", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      error = _cc.error;
      instantiate = _cc.instantiate;
      Prefab = _cc.Prefab;
    }, function (_unresolved_2) {
      PrefabsEnum = _unresolved_2.PrefabsEnum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a29e6qG2YBNSpottoyfX7/J", "PrefabsManager", undefined);

      __checkObsolete__(['_decorator', 'ccenum', 'CCString', 'Component', 'error', 'instantiate', 'MIDDLE_RATIO', 'Node', 'Prefab', 'primitives', 'SkeletalAnimation']);

      ({
        ccclass,
        property
      } = _decorator);
      PrefabsRes = (_dec = ccclass("PrefabsRes"), _dec2 = property({
        type: _crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
          error: Error()
        }), PrefabsEnum) : PrefabsEnum
      }), _dec3 = property(Prefab), _dec(_class = (_class2 = class PrefabsRes {
        constructor() {
          _initializerDefineProperty(this, "prefabEnum", _descriptor, this);

          _initializerDefineProperty(this, "prefabList", _descriptor2, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "prefabEnum", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return (_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
            error: Error()
          }), PrefabsEnum) : PrefabsEnum).bullet;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "prefabList", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class2)) || _class);

      _export("PrefabsManager", PrefabsManager = (_dec4 = ccclass('PrefabsManager'), _dec5 = property({
        type: PrefabsRes
      }), _dec4(_class4 = (_class5 = (_class6 = class PrefabsManager extends Component {
        constructor() {
          super();

          _initializerDefineProperty(this, "preList", _descriptor3, this);

          PrefabsManager._instance = this;
        }

        static get instance() {
          return this._instance;
        }

        onLoad() {
          var initList = [];

          for (var i = 0; i < this.preList.length; i++) {
            var res = this.preList[i];
            initList[res.prefabEnum] = res;
          }

          this.preList = initList;
        }
        /**
         * 
         * @param prefabsEnum 预制体枚举类型
         * @param index 预制体下标 改下表需要与该类型的枚举顺序一致  
         * 举例道具：enum PropEnum{
         *              gold，
         *              meat，
         *          } 
         * 表示 该预制体在预制体数组中的位置
         * @returns 返回一个预制体实例
         */


        GetPrefabsIns(prefabsEnum, index) {
          var res = this.preList[prefabsEnum];

          if (!res) {
            error("\u9884\u5236\u4F53\u7C7B\u578B\uFF1A" + prefabsEnum + " \u4E0D\u5B58\u5728");
            debugger;
          }

          var pre = res.prefabList[index];

          if (!pre) {
            error("\u9884\u5236\u4F53\u7C7B\u578B\uFF1A" + prefabsEnum + "   \u4E0B\u6807:" + index + "  \u7F3A\u5931");
            debugger;
          }

          return instantiate(pre);
        }

      }, _class6._instance = null, _class6), (_descriptor3 = _applyDecoratedDescriptor(_class5.prototype, "preList", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class5)) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e950dd2519065be1280daf69ce7f6b07e4d0caaa.js.map