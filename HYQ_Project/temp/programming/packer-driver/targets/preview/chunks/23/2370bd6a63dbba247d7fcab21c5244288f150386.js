System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Sprite, UIOpacity, TweenTool, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, ColorEnum, HpComponent;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfTweenTool(extras) {
    _reporterNs.report("TweenTool", "../../Tool/TweenTool", _context.meta, extras);
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
      Sprite = _cc.Sprite;
      UIOpacity = _cc.UIOpacity;
    }, function (_unresolved_2) {
      TweenTool = _unresolved_2.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f320bf9S85BhYqf5lQsQBRl", "HpComponent", undefined);

      __checkObsolete__(['_decorator', 'Component', 'math', 'Node', 'Sprite', 'UIOpacity', 'UITransform']);

      // import TweenAni from './TweenAni';
      ({
        ccclass,
        property
      } = _decorator);

      ColorEnum = /*#__PURE__*/function (ColorEnum) {
        ColorEnum[ColorEnum["red"] = 0] = "red";
        ColorEnum[ColorEnum["green"] = 1] = "green";
        return ColorEnum;
      }(ColorEnum || {});
      /**血量组件 */


      _export("HpComponent", HpComponent = (_dec = ccclass('HpComponent'), _dec2 = property(Sprite), _dec3 = property(Sprite), _dec(_class = (_class2 = class HpComponent extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "img_hp_slide", _descriptor, this);

          _initializerDefineProperty(this, "img_hp_effect", _descriptor2, this);

          // private _tran: UITransform;
          this.a = 0.03;
          this._uiO = void 0;
        }

        onLoad() {
          this.uiO.opacity = 0; // this._tran = this.node.getComponent(UITransform);
          // this.img_hp_slide.width = this._tran.width;

          this.img_hp_slide.node.active = true;
        }

        update(deltaTime) {
          // if (PublicManager.instance.isOver) {
          //     return;
          // }
          var dis = this.img_hp_effect.fillRange - this.img_hp_slide.fillRange;

          if (dis > 0) {
            if (dis < 0.01) {
              this.img_hp_effect.fillRange = this.img_hp_slide.fillRange;
            } else {
              var sx = this.img_hp_effect.fillRange - dis * this.a;
              this.img_hp_effect.fillRange = sx;
            }
          }
        }
        /**设置当前血量  百分比 */


        set value(value) {
          var scale = Math.max(0, value);
          scale = Math.min(1, scale);

          if (value > this.img_hp_effect.fillRange) {
            this.img_hp_effect.fillRange = value;
          }

          if (this.uiO.opacity > 0 && (scale == 1 || scale == 0)) {
            (_crd && TweenTool === void 0 ? (_reportPossibleCrUseOfTweenTool({
              error: Error()
            }), TweenTool) : TweenTool).aplAni(this.uiO, 0);
          } else if (this.uiO.opacity <= 255 && scale != 1) {
            (_crd && TweenTool === void 0 ? (_reportPossibleCrUseOfTweenTool({
              error: Error()
            }), TweenTool) : TweenTool).aplAni(this.uiO, 255);
          }

          this.img_hp_slide.fillRange = scale;
        }

        get uiO() {
          if (this._uiO == null) {
            this._uiO = this.node.getComponent(UIOpacity);
          }

          return this._uiO;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "img_hp_slide", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "img_hp_effect", [_dec3], {
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
//# sourceMappingURL=2370bd6a63dbba247d7fcab21c5244288f150386.js.map