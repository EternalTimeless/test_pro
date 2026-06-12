System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCBoolean, CCFloat, CCInteger, Component, Label, Node, Sprite, ShoppIngEvent, TweenTool, PropEnum, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _crd, ccclass, property, SHOP_EVENT, Shopping;

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

      _cclegacy._RF.push({}, "8ad28jrltBGzJOoAQT0Z47C", "Shopping", undefined);

      __checkObsolete__(['_decorator', 'CCBoolean', 'CCFloat', 'CCInteger', 'color', 'Color', 'Component', 'Label', 'Node', 'Sprite', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("SHOP_EVENT", SHOP_EVENT = "SHOP_EVENT_MoneyAccount");

      _export("default", Shopping = (_dec = ccclass('Shopping'), _dec2 = property(Label), _dec3 = property(Sprite), _dec4 = property({
        type: _crd && PropEnum === void 0 ? (_reportPossibleCrUseOfPropEnum({
          error: Error()
        }), PropEnum) : PropEnum
      }), _dec5 = property(CCInteger), _dec6 = property(CCBoolean), _dec7 = property({
        type: CCInteger,

        visible() {
          return !this.goldMod;
        }

      }), _dec8 = property({
        type: CCInteger,

        visible() {
          return this.goldMod;
        }

      }), _dec9 = property(CCBoolean), _dec10 = property(CCFloat), _dec11 = property(Node), _dec12 = property(Node), _dec13 = property(Node), _dec14 = property(Node), _dec15 = property(_crd && ShoppIngEvent === void 0 ? (_reportPossibleCrUseOfShoppIngEvent({
        error: Error()
      }), ShoppIngEvent) : ShoppIngEvent), _dec(_class = (_class2 = class Shopping extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "gold_lable", _descriptor, this);

          this.gold_lable_shake = false;

          _initializerDefineProperty(this, "progress", _descriptor2, this);

          _initializerDefineProperty(this, "propId", _descriptor3, this);

          _initializerDefineProperty(this, "loopCount", _descriptor4, this);

          //-1表示永不关店
          _initializerDefineProperty(this, "goldMod", _descriptor5, this);

          _initializerDefineProperty(this, "gold", _descriptor6, this);

          _initializerDefineProperty(this, "goldArr", _descriptor7, this);

          this._gold = void 0;
          this._preGold = void 0;

          /**
           * false jumpTimeInterval 表示间隔时间
           * true jumpTimeInterval 表示完成一次所用的时间
           */
          _initializerDefineProperty(this, "totaldurationSwitch", _descriptor8, this);

          _initializerDefineProperty(this, "jumpTimeInterval", _descriptor9, this);

          this._jumpTimeInterval = 0;
          this._shopCount = 0;

          _initializerDefineProperty(this, "_jumpNode", _descriptor10, this);

          _initializerDefineProperty(this, "_guideNode", _descriptor11, this);

          // @property(CCFloat)
          // public disTrigger: number = 128;
          _initializerDefineProperty(this, "shoppingEvent", _descriptor12, this);
        }

        set jumpNode(value) {
          this._jumpNode = value;
        }

        get jumpNode() {
          return this._jumpNode ? this._jumpNode : this.node;
        }

        set guideNode(value) {
          this._guideNode = value;
        }

        get guideNode() {
          return this._guideNode ? this._guideNode : this.node;
        }

        onLoad() {
          this.init();
          this.initJumpTime();
        }

        init() {
          if (this.goldMod) {
            if (this.goldArr.length) {
              var gold = this.goldArr.splice(0, 1)[0];
              this.gold = gold;
            }
          }

          this._gold = this.gold;
          this._preGold = this.gold;
          this.gold_lable.string = this._gold.toString();

          if (this.progress) {
            this.progress.fillRange = 0;
          }
        }

        get isUse() {
          var isUse = this._preGold > 0 && this.loopCount != 0 && this._jumpTimeInterval <= 0;

          if (this.shoppingEvent) {
            return isUse && this.shoppingEvent.isUse();
          }

          return isUse;
        }

        update(dt) {
          this._jumpTimeInterval -= dt;

          if (this.progress) {
            var proportion = 1 - this._gold / this.gold;

            if (proportion != this.progress.fillRange) {
              var off = proportion - this.progress.fillRange;

              if (off <= 0.005) {
                this.progress.fillRange = proportion;
              } else {
                this.progress.fillRange += off * dt * 50;
              }
            }
          }
        }
        /**实际到账 */


        moneyAccount(money) {
          this._gold -= money;
          this._gold = Math.max(0, this._gold);
          this.node.emit(SHOP_EVENT, this._gold / this.gold);
          this.gold_lable.string = this._gold.toString();

          if (!this.gold_lable_shake) {
            this.gold_lable_shake = true;
            (_crd && TweenTool === void 0 ? (_reportPossibleCrUseOfTweenTool({
              error: Error()
            }), TweenTool) : TweenTool).scaleShake(this.gold_lable.node).call(() => {
              this.gold_lable_shake = false;
            }).start();
          }

          if (this._gold == 0) {
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
                ;
              }
            }

            if (this.loopCount) {
              (_crd && TweenTool === void 0 ? (_reportPossibleCrUseOfTweenTool({
                error: Error()
              }), TweenTool) : TweenTool).scaleShake(this.node).call(() => {
                this.init();
                this.shoppingEvent && this.shoppingEvent.init();
              }).start();
              ;
            }

            return true;
          }

          return false;
        }
        /**预付款 */


        moneyPay(money) {
          this.initJumpTime();
          this._preGold -= money;
        }

        get shopCount() {
          return this._shopCount;
        }

        initJumpTime() {
          if (this.totaldurationSwitch) {
            this._jumpTimeInterval = this.jumpTimeInterval / this.gold;
          } else {
            this._jumpTimeInterval = this.jumpTimeInterval;
          }

          console.log(this._jumpTimeInterval);
        }

        get curGold() {
          return this._gold;
        }

        get preGold() {
          return this._preGold;
        }

        get shopScale() {
          var scale = this._gold / this.gold;

          if (scale) {
            return 1 - scale;
          }

          return 0;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "gold_lable", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "progress", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "propId", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return (_crd && PropEnum === void 0 ? (_reportPossibleCrUseOfPropEnum({
            error: Error()
          }), PropEnum) : PropEnum).gold;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "loopCount", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -1;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "goldMod", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "gold", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 20;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "goldArr", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "totaldurationSwitch", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "jumpTimeInterval", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.05;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "_jumpNode", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _applyDecoratedDescriptor(_class2.prototype, "jumpNode", [_dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "jumpNode"), _class2.prototype), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "_guideNode", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _applyDecoratedDescriptor(_class2.prototype, "guideNode", [_dec14], Object.getOwnPropertyDescriptor(_class2.prototype, "guideNode"), _class2.prototype), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "shoppingEvent", [_dec15], {
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
//# sourceMappingURL=d4d48438eaab7d70aa8b92a0be9fd6c881f781f8.js.map