System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, SceneType, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _class3, _crd, ccclass, property, LayerManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfSceneType(extras) {
    _reporterNs.report("SceneType", "./EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLayerEnum(extras) {
    _reporterNs.report("LayerEnum", "./EnumList", _context.meta, extras);
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
      Node = _cc.Node;
    }, function (_unresolved_2) {
      SceneType = _unresolved_2.SceneType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d0985vQ4ThGFbgFo4kj5hlL", "LayerManager", undefined);

      __checkObsolete__(['_decorator', 'ccenum', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("default", LayerManager = (_dec = ccclass("LayerManager"), _dec2 = property(Node), _dec3 = property({
        type: _crd && SceneType === void 0 ? (_reportPossibleCrUseOfSceneType({
          error: Error()
        }), SceneType) : SceneType
      }), _dec(_class = (_class2 = (_class3 = class LayerManager extends Component {
        static get instance() {
          return this._instance;
        }
        /**
         * 获取该层级
         * @param layerEnum 层级枚举
         * @returns 
         */


        getLayer(layerEnum) {
          return this.layerNode[layerEnum];
        }

        constructor() {
          super();

          /**层级节点 */
          _initializerDefineProperty(this, "layerNode", _descriptor, this);

          /**
          * 当前场景类型  D3表示在3D场景中   D2表示在2D场景中
           */
          _initializerDefineProperty(this, "SceneType", _descriptor2, this);

          LayerManager._instance = this;
        }

      }, _class3._instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "layerNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "SceneType", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return (_crd && SceneType === void 0 ? (_reportPossibleCrUseOfSceneType({
            error: Error()
          }), SceneType) : SceneType).D3;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4d6662648c8c361d9de350d72c1ab0a8e7508014.js.map