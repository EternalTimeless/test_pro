System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, CCInteger, Vec3, PropManager, UnityUpComponent, PropEnum, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, BagBase;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPropManager(extras) {
    _reporterNs.report("PropManager", "../PropManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnityUpComponent(extras) {
    _reporterNs.report("UnityUpComponent", "../../../Base/UnityUpComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfProp(extras) {
    _reporterNs.report("Prop", "../Prop", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPropEnum(extras) {
    _reporterNs.report("PropEnum", "../../../Base/EnumList", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CCFloat = _cc.CCFloat;
      CCInteger = _cc.CCInteger;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      PropManager = _unresolved_2.default;
    }, function (_unresolved_3) {
      UnityUpComponent = _unresolved_3.UnityUpComponent;
    }, function (_unresolved_4) {
      PropEnum = _unresolved_4.PropEnum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c79c6DkwwND2a2U2oBNgMa5", "BagBase", undefined);

      __checkObsolete__(['_decorator', 'ccenum', 'CCFloat', 'CCInteger', 'Component', 'Enum', 'Node', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator); // cc.Class.attr(component, 'style', {
      //     type: 'Enum',
      //     enumList: cc.Enum.getList(cc.Enum(obj))
      // });

      _export("BagBase", BagBase = (_dec = ccclass('BagBase'), _dec2 = property({
        tooltip: "要放置的道具id null为关闭放置功能",
        type: _crd && PropEnum === void 0 ? (_reportPossibleCrUseOfPropEnum({
          error: Error()
        }), PropEnum) : PropEnum
      }), _dec3 = property({
        tooltip: "要拿取的道具id null为关闭拿取功能",
        type: _crd && PropEnum === void 0 ? (_reportPossibleCrUseOfPropEnum({
          error: Error()
        }), PropEnum) : PropEnum
      }), _dec4 = property({
        tooltip: "放置的时间间隔",
        type: CCFloat
      }), _dec5 = property({
        tooltip: "拿取的时间间隔",
        type: CCFloat
      }), _dec6 = property({
        tooltip: "每层高度偏移量",
        type: CCFloat
      }), _dec7 = property(CCInteger), _dec(_class = (_class2 = class BagBase extends (_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
        error: Error()
      }), UnityUpComponent) : UnityUpComponent) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "placeId", _descriptor, this);

          _initializerDefineProperty(this, "takeId", _descriptor2, this);

          /**时间间隔 */
          _initializerDefineProperty(this, "placeTimeInterval", _descriptor3, this);

          /**上次放置时间 */
          this._placeTime = 0;

          /**拿取时间间隔 */
          _initializerDefineProperty(this, "takeTimeInterval", _descriptor4, this);

          /**上次拿取时间 */
          this._takeTime = 0;

          /**放置数量量 */
          this.count = 0;

          /**每层高度偏移 */
          _initializerDefineProperty(this, "layerHeight", _descriptor5, this);

          this.tempV3 = new Vec3();

          _initializerDefineProperty(this, "showMaxCount", _descriptor6, this);

          this.showCount = 0;
          this.isOpen = true;
          this.propList = [];
          this._guidNode = void 0;
        }

        onLoad() {
          this._guidNode = this.node.getChildByName("guidNode");
        }

        get guidNode() {
          return this._guidNode ? this._guidNode : this.node;
        }
        /**获得道具 */


        get prop() {
          if (this.showCount > 0) {
            this.showCount--;
            this._takeTime = this.takeTimeInterval;

            this._getprop();

            var _prop;

            if (this.takeId != (_crd && PropEnum === void 0 ? (_reportPossibleCrUseOfPropEnum({
              error: Error()
            }), PropEnum) : PropEnum).null) {
              _prop = (_crd && PropManager === void 0 ? (_reportPossibleCrUseOfPropManager({
                error: Error()
              }), PropManager) : PropManager).instance.getProp(this.takeId);
            } else if (this.placeId != (_crd && PropEnum === void 0 ? (_reportPossibleCrUseOfPropEnum({
              error: Error()
            }), PropEnum) : PropEnum).null) {
              _prop = (_crd && PropManager === void 0 ? (_reportPossibleCrUseOfPropManager({
                error: Error()
              }), PropManager) : PropManager).instance.getProp(this.placeId);
            }

            var node = this.propList[this.propList.length - 1].node;

            _prop.node.setWorldPosition(node.worldPosition);

            _prop.node.rotation = node.rotation;
            return _prop;
          } else if (this.propList.length) {
            this._takeTime = this.takeTimeInterval;

            var _prop2 = this.propList.pop();

            this._getprop();

            return _prop2;
          }

          return null;
        }

        _getprop() {}

        getPropPlaceWordPos(count) {
          this.getPropPlacePos(count);
          this.tempV3.transformMat4(this.node.worldMatrix);
          return this.tempV3;
        }

        _update(dt) {
          this._placeTime -= dt;
          this._takeTime -= dt;

          this._onUpdata(dt);
        }
        /**是否可以放置道具 */


        get isPlace() {
          return this._placeTime <= 0;
        }
        /**是否可以拿取道具 */


        get isTake() {
          return this._takeTime <= 0 && !!this.propCount;
        }
        /**是否可以投掷道具    通过  另一个shopping或者背包的时间进行限制*/


        get isPropCount() {
          return this.propCount > 0;
        }

        get propCount() {
          if (this.showCount == -1) {
            return this.propList.length;
          } else {
            return this.propList.length + this.showCount;
          }
        }

        get propCount_R() {
          if (this.showCount == -1) {
            return this.propList.length + this.count;
          } else {
            return this.propList.length + this.showCount + this.count;
          }
        }

        _onUpdata(dt) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "placeId", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return (_crd && PropEnum === void 0 ? (_reportPossibleCrUseOfPropEnum({
            error: Error()
          }), PropEnum) : PropEnum).null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "takeId", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return (_crd && PropEnum === void 0 ? (_reportPossibleCrUseOfPropEnum({
            error: Error()
          }), PropEnum) : PropEnum).null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "placeTimeInterval", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.025;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "takeTimeInterval", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.025;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "layerHeight", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "showMaxCount", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -1;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=95f463040a324efaf7ca84d529595e3d1c85d624.js.map