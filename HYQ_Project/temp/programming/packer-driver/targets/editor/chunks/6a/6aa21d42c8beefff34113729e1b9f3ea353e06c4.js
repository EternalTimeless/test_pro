System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, Sprite, UnityUpComponent, FrameAnimEnum, FrameAnimManager, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, FrameManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfUnityUpComponent(extras) {
    _reporterNs.report("UnityUpComponent", "../../../Base/UnityUpComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFrameAnimEnum(extras) {
    _reporterNs.report("FrameAnimEnum", "../../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAnimName(extras) {
    _reporterNs.report("AnimName", "../../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFrameAnimManager(extras) {
    _reporterNs.report("FrameAnimManager", "./FrameAnimManager", _context.meta, extras);
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
      Sprite = _cc.Sprite;
    }, function (_unresolved_2) {
      UnityUpComponent = _unresolved_2.UnityUpComponent;
    }, function (_unresolved_3) {
      FrameAnimEnum = _unresolved_3.FrameAnimEnum;
    }, function (_unresolved_4) {
      FrameAnimManager = _unresolved_4.FrameAnimManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "0e10ePrwJJAHZhFQG+D23ex", "FrameManager", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'Component', 'Material', 'Node', 'sp', 'Sprite', 'SpriteFrame']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("FrameManager", FrameManager = (_dec = ccclass('FrameManager'), _dec2 = property({
        type: _crd && FrameAnimEnum === void 0 ? (_reportPossibleCrUseOfFrameAnimEnum({
          error: Error()
        }), FrameAnimEnum) : FrameAnimEnum
      }), _dec3 = property(Sprite), _dec4 = property(Sprite), _dec5 = property(CCFloat), _dec(_class = (_class2 = class FrameManager extends (_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
        error: Error()
      }), UnityUpComponent) : UnityUpComponent) {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "animType", _descriptor, this);

          _initializerDefineProperty(this, "animSprite", _descriptor2, this);

          _initializerDefineProperty(this, "yingziSprite", _descriptor3, this);

          _initializerDefineProperty(this, "speed", _descriptor4, this);

          this._animName = void 0;
          this._angle = void 0;
          this._framSprite = void 0;
          this._index = 0;
          this._frameTime = 0;
          this._frameInterval = 0.05;
          // private _loop: boolean = true;
          this._loopCount = -1;
          // private _curAnagle: number = 0;
          this.curType = null;
        }

        setAnim(animName, angle, loopCount = -1) {
          if (this.curType == this.animType && loopCount == -1 && this._animName == animName && this._angle == angle) return;
          this.curType = this.animType;
          this._animName = animName;
          this._angle = angle;
          this._loopCount = loopCount;

          this._setAnim(animName, angle);
        }

        _setAnim(animName, angle) {
          let realA = angle;

          if (angle != 361) {
            if (angle > 180) {
              this.node.setScale(-1, 1, 1);
              let a = angle - 180;
              angle = 180 - a;
            } else {
              this.node.setScale(1, 1, 1);
            }
          } else {
            this.node.setScale(-1, 1, 1);
          }

          let sf = (_crd && FrameAnimManager === void 0 ? (_reportPossibleCrUseOfFrameAnimManager({
            error: Error()
          }), FrameAnimManager) : FrameAnimManager).instance.getFrameAnimSpriteAtlas(this.animType, animName, angle);

          if (sf) {
            this._index = 0;
            this._framSprite = sf;
          } else {
            this.scheduleOnce(() => {
              let anim = animName;
              let a = realA;

              if (anim != this._animName || a != this._angle) {
                return;
              }

              this._setAnim(anim, this._angle);
            }, 0.5);
          }
        }

        _update(deltaTime) {
          this.frameAnimLoop(deltaTime);
        }

        frameAnimLoop(dt) {
          if (this._framSprite && this._loopCount) {
            if (this._frameTime <= 0) {
              this._frameTime = this._frameInterval / this.speed;
              this.animSprite.spriteFrame = this._framSprite[this._index];
              this._index++;

              if (this._index >= this._framSprite.length) {
                this._index = 0;

                if (this._loopCount > 0) {
                  this._loopCount--;
                }
              }
            } else {
              this._frameTime -= dt;
            }
          }
        } // 获取动画结束时间


        get animEndTime() {
          return this._framSprite ? this._framSprite.length * this._frameInterval / this.speed : 0;
        }

        set material(material) {
          this.animSprite.material = material;
          this.yingziSprite.material = material;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "animType", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && FrameAnimEnum === void 0 ? (_reportPossibleCrUseOfFrameAnimEnum({
            error: Error()
          }), FrameAnimEnum) : FrameAnimEnum).LittleBlueMan;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "animSprite", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "yingziSprite", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "speed", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6aa21d42c8beefff34113729e1b9f3ea353e06c4.js.map