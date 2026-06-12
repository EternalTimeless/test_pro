System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCBoolean, CCFloat, CCInteger, Component, Label, Node, Sprite, ShoppIngEvent, TweenTool, PropEnum, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _class4, _class5, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _crd, ccclass, property, ShoppingItem, Shopping_Super;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfShoppIngEvent(extras) {
    _reporterNs.report("ShoppIngEvent", "./ShoppIngEvent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTweenTool(extras) {
    _reporterNs.report("TweenTool", "../../Tool/TweenTool", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPropEnum(extras) {
    _reporterNs.report("PropEnum", "../../Base/EnumList", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CCBoolean = _cc.CCBoolean;
      CCFloat = _cc.CCFloat;
      CCInteger = _cc.CCInteger;
      Component = _cc.Component;
      Label = _cc.Label;
      Node = _cc.Node;
      Sprite = _cc.Sprite;
    }, function (_unresolved_2) {
      ShoppIngEvent = _unresolved_2.default;
    }, function (_unresolved_3) {
      TweenTool = _unresolved_3.default;
    }, function (_unresolved_4) {
      PropEnum = _unresolved_4.PropEnum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "098676iDkZEP6skaxySonjx", "Shopping_Super", undefined);

      __checkObsolete__(['_decorator', 'CCBoolean', 'CCFloat', 'CCInteger', 'color', 'Color', 'Component', 'Label', 'Node', 'Sprite', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);
      /** 单个道具配置 */

      ShoppingItem = (_dec = ccclass('ShoppingItem'), _dec2 = property({
        type: _crd && PropEnum === void 0 ? (_reportPossibleCrUseOfPropEnum({
          error: Error()
        }), PropEnum) : PropEnum
      }), _dec3 = property(CCInteger), _dec4 = property(Label), _dec(_class = (_class2 = class ShoppingItem {
        constructor() {
          _initializerDefineProperty(this, "propId", _descriptor, this);

          _initializerDefineProperty(this, "amount", _descriptor2, this);

          _initializerDefineProperty(this, "label", _descriptor3, this);

          /** 剩余数量（运行时） */
          this.remaining = 0;

          /** 预付款余额（运行时） */
          this.prePaid = 0;

          /** 动画是否正在播放（运行时） */
          this.isAnimating = false;
        }

        /** 初始化 */
        init() {
          this.remaining = this.amount;
          this.prePaid = this.amount;
          this.isAnimating = false;
          this.updateLabel();
        }
        /** 更新Label显示 */


        updateLabel() {
          if (this.label) {
            this.label.string = this.remaining.toString();
          }
        }
        /** 是否已完成 */


        get isComplete() {
          return this.remaining <= 0;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "propId", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && PropEnum === void 0 ? (_reportPossibleCrUseOfPropEnum({
            error: Error()
          }), PropEnum) : PropEnum).gold;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "amount", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 20;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "label", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class);

      _export("default", Shopping_Super = (_dec5 = ccclass('Shopping_Super'), _dec6 = property(Sprite), _dec7 = property({
        type: ShoppingItem
      }), _dec8 = property(CCInteger), _dec9 = property(CCBoolean), _dec10 = property(CCFloat), _dec11 = property(Node), _dec12 = property(Node), _dec13 = property(_crd && ShoppIngEvent === void 0 ? (_reportPossibleCrUseOfShoppIngEvent({
        error: Error()
      }), ShoppIngEvent) : ShoppIngEvent), _dec5(_class4 = (_class5 = class Shopping_Super extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "progress", _descriptor4, this);

          /** 多道具配置数组 */
          _initializerDefineProperty(this, "shoppingItems", _descriptor5, this);

          _initializerDefineProperty(this, "loopCount", _descriptor6, this);

          //-1表示永不关店

          /**
           * false jumpTimeInterval 表示间隔时间
           * true jumpTimeInterval 表示完成一次所用的时间
           */
          _initializerDefineProperty(this, "totaldurationSwitch", _descriptor7, this);

          _initializerDefineProperty(this, "jumpTimeInterval", _descriptor8, this);

          this._jumpTimeInterval = 0;
          this._shopCount = 0;
          // ---- 缓存优化 ----
          this._incompleteItems = [];
          this._incompleteDirty = true;
          this._totalOriginal = 0;
          this._totalRemaining = 0;

          _initializerDefineProperty(this, "_jumpNode", _descriptor9, this);

          // @property(CCFloat)
          // public disTrigger: number = 128;
          _initializerDefineProperty(this, "shoppingEvent", _descriptor10, this);
        }

        set jumpNode(value) {
          this._jumpNode = value;
        }

        get jumpNode() {
          return this._jumpNode ? this._jumpNode : this.node;
        }

        onLoad() {
          this.init();

          if (!this.shoppingEvent) {
            this.shoppingEvent = this.getComponent(_crd && ShoppIngEvent === void 0 ? (_reportPossibleCrUseOfShoppIngEvent({
              error: Error()
            }), ShoppIngEvent) : ShoppIngEvent);
          }
        }

        init() {
          // 初始化所有道具并计算缓存总量
          this._totalOriginal = 0;
          this._totalRemaining = 0;
          this._incompleteDirty = true;

          for (const item of this.shoppingItems) {
            item.init();
            this._totalOriginal += item.amount;
            this._totalRemaining += item.amount;
          }

          if (this.progress) {
            this.progress.fillRange = 0;
          }
        }
        /** 根据propId获取道具配置 */


        getItem(propId) {
          return this.shoppingItems.find(item => item.propId === propId) || null;
        }
        /** 获取指定道具的剩余数量 */


        getRemainingAmount(propId) {
          var _this$getItem;

          return ((_this$getItem = this.getItem(propId)) == null ? void 0 : _this$getItem.remaining) || 0;
        }
        /** 获取指定道具的原始数量 */


        getOriginalAmount(propId) {
          var _this$getItem2;

          return ((_this$getItem2 = this.getItem(propId)) == null ? void 0 : _this$getItem2.amount) || 0;
        }
        /** 获取指定道具的预付款剩余数量 */


        getPrePaidAmount(propId) {
          var _this$getItem3;

          return ((_this$getItem3 = this.getItem(propId)) == null ? void 0 : _this$getItem3.prePaid) || 0;
        }
        /** 检查所有道具是否都已购买完成 */


        get isAllItemsComplete() {
          if (this.shoppingItems.length === 0) return true;
          return this.shoppingItems.every(item => item.isComplete);
        }
        /** 检查指定道具是否购买完成 */


        isItemComplete(propId) {
          var _this$getItem4;

          return ((_this$getItem4 = this.getItem(propId)) == null ? void 0 : _this$getItem4.isComplete) || false;
        }
        /** 获取所有道具配置 */


        get allItems() {
          return this.shoppingItems;
        }
        /** 获取所有未完成的道具（带缓存，脏标记触发重建） */


        get incompleteItems() {
          if (this._incompleteDirty) {
            this._incompleteItems = this.shoppingItems.filter(item => !item.isComplete);
            this._incompleteDirty = false;
          }

          return this._incompleteItems;
        }

        get isUse() {
          // 检查是否还有未完成的道具且有预付款余额
          const hasRemaining = this.shoppingItems.some(item => item.prePaid > 0);
          const isUse = hasRemaining && this.loopCount != 0;

          if (this.shoppingEvent) {
            return isUse && this.shoppingEvent.isUse();
          }

          return isUse;
        }

        update(dt) {
          this._jumpTimeInterval -= dt;

          if (this.progress && this._totalOriginal > 0) {
            // 使用缓存的总量计算进度，避免每帧遍历求和
            let proportion = 1 - this._totalRemaining / this._totalOriginal;

            if (proportion != this.progress.fillRange) {
              let off = proportion - this.progress.fillRange;

              if (off <= 0.005) {
                this.progress.fillRange = proportion;
              } else {
                this.progress.fillRange += off * dt * 50;
              }
            }
          }
        }
        /**实际到账 - 扣除指定道具的数量 
         * @param money 扣除数量
         * @param propId 道具ID
         * @returns 是否触发购买完成事件
         */


        moneyAccount(money, propId) {
          const item = this.getItem(propId);

          if (!item || item.remaining <= 0) {
            return false;
          }

          const oldRemaining = item.remaining;
          item.remaining = Math.max(0, item.remaining - money);
          this._totalRemaining -= oldRemaining - item.remaining;
          this._incompleteDirty = true;
          item.updateLabel(); // 摇晃动画

          if (item.label && !item.isAnimating) {
            item.isAnimating = true;
            (_crd && TweenTool === void 0 ? (_reportPossibleCrUseOfTweenTool({
              error: Error()
            }), TweenTool) : TweenTool).scaleShake(item.label.node).call(() => {
              item.isAnimating = false;
            }).start();
          } // 检查当前道具是否完成


          if (item.isComplete) {
            // 检查是否所有道具都完成了
            if (this.isAllItemsComplete) {
              // 所有道具都购买完成，触发购买成功事件
              this.shoppingEvent && this.shoppingEvent.shoppEvent();
              this._shopCount++;

              if (this.loopCount != -1) {
                this.loopCount--;

                if (!this.loopCount) {
                  (_crd && TweenTool === void 0 ? (_reportPossibleCrUseOfTweenTool({
                    error: Error()
                  }), TweenTool) : TweenTool).scaleShake(this.node, 0.2).call(() => {
                    this.node.active = false;
                  }).start();
                }
              }

              if (this.loopCount) {
                (_crd && TweenTool === void 0 ? (_reportPossibleCrUseOfTweenTool({
                  error: Error()
                }), TweenTool) : TweenTool).scaleShake(this.node).call(() => {
                  this.init();
                  this.shoppingEvent && this.shoppingEvent.init();
                }).start();
              }

              return true;
            }
          }

          return false;
        }
        /**预付款 - 预扣指定道具的数量 
         * @param money 预扣数量
         * @param propId 道具ID
         */


        moneyPay(money, propId) {
          const item = this.getItem(propId);

          if (item) {
            this.initJumpTime(propId);
            item.prePaid = Math.max(0, item.prePaid - money);
          }
        }

        get shopCount() {
          return this._shopCount;
        }

        initJumpTime(propId) {
          const item = this.getItem(propId);
          const original = (item == null ? void 0 : item.amount) || 0;

          if (this.totaldurationSwitch && original > 0) {
            this._jumpTimeInterval = this.jumpTimeInterval / original;
          } else {
            this._jumpTimeInterval = this.jumpTimeInterval;
          }

          console.log(this._jumpTimeInterval);
        }
        /** 获取指定道具的剩余数量（兼容旧接口，需传入propId） */


        getCurGold(propId) {
          var _this$getItem5;

          return ((_this$getItem5 = this.getItem(propId)) == null ? void 0 : _this$getItem5.remaining) || 0;
        }

      }, (_descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "progress", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "shoppingItems", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class5.prototype, "loopCount", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -1;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class5.prototype, "totaldurationSwitch", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class5.prototype, "jumpTimeInterval", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.05;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class5.prototype, "_jumpNode", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _applyDecoratedDescriptor(_class5.prototype, "jumpNode", [_dec12], Object.getOwnPropertyDescriptor(_class5.prototype, "jumpNode"), _class5.prototype), _descriptor10 = _applyDecoratedDescriptor(_class5.prototype, "shoppingEvent", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      })), _class5)) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=a42c1d37f6635e163c503f550e88f66dc8182c5e.js.map