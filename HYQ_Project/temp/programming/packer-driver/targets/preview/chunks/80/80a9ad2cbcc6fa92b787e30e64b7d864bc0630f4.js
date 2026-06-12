System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, Component, Node, Vec2, Vec3, RockerManager, RockerUI, AudioManager, EventType, SoundEnum, EventManager, CameraMove, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, RockerMouseEvent;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfRockerManager(extras) {
    _reporterNs.report("RockerManager", "./RockerManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRockerUI(extras) {
    _reporterNs.report("RockerUI", "./RockerUI", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "../../Base/AudioManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundEnum(extras) {
    _reporterNs.report("SoundEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../../Base/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCameraMove(extras) {
    _reporterNs.report("CameraMove", "../../Base/CameraMove", _context.meta, extras);
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
      Component = _cc.Component;
      Node = _cc.Node;
      Vec2 = _cc.Vec2;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      RockerManager = _unresolved_2.default;
    }, function (_unresolved_3) {
      RockerUI = _unresolved_3.RockerUI;
    }, function (_unresolved_4) {
      AudioManager = _unresolved_4.default;
    }, function (_unresolved_5) {
      EventType = _unresolved_5.EventType;
      SoundEnum = _unresolved_5.SoundEnum;
    }, function (_unresolved_6) {
      EventManager = _unresolved_6.default;
    }, function (_unresolved_7) {
      CameraMove = _unresolved_7.CameraMove;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7b32bvbGrxLYKqObFInVPYB", "RockerMouseEvent", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'Component', 'EventTouch', 'Input', 'log', 'Node', 'UITransform', 'Vec2', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("RockerMouseEvent", RockerMouseEvent = (_dec = ccclass('RockerMouseEvent'), _dec2 = property(_crd && RockerUI === void 0 ? (_reportPossibleCrUseOfRockerUI({
        error: Error()
      }), RockerUI) : RockerUI), _dec3 = property(Node), _dec4 = property(CCFloat), _dec(_class = (_class2 = class RockerMouseEvent extends Component {
        constructor() {
          super(...arguments);

          /**实际rockerUI */
          _initializerDefineProperty(this, "rockerUI", _descriptor, this);

          /**遥感动画 */
          _initializerDefineProperty(this, "rockerAniUI", _descriptor2, this);

          _initializerDefineProperty(this, "rockerAniUIShowTime", _descriptor3, this);

          this._RockerAniShowTime = 2;
          // private _rockerLogic: RockerLogic;
          this.isOnClick = false;
          this._downPos = new Vec3();
          this._tempV3 = new Vec3();
          this._tempV2 = new Vec2();
        }

        start() {
          (_crd && RockerManager === void 0 ? (_reportPossibleCrUseOfRockerManager({
            error: Error()
          }), RockerManager) : RockerManager).instance.init(this.rockerUI.tran.width / 2); // this._rockerLogic = RockerManager.instance.rockerLogic;

          this.node.on(Node.EventType.TOUCH_START, this.onMouseDown, this);
          this.rockerUI.node.active = false;
        }

        shouAni() {// this.rockerAniUI.active = true;
        }

        onMouseDown(event) {
          if (!this.isOnClick) {
            this.isOnClick = true;
            (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
              error: Error()
            }), EventManager) : EventManager).instance.emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
              error: Error()
            }), EventType) : EventType).firstClick);
            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).inst.play((_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
              error: Error()
            }), SoundEnum) : SoundEnum).bgm);
          }

          this.node.on(Node.EventType.TOUCH_MOVE, this.onMouseMove, this);
          this.node.on(Node.EventType.TOUCH_END, this.onMouseOver, this);
          this.node.on(Node.EventType.TOUCH_CANCEL, this.onMouseOver, this); // this._rockerLogic.rockerDown(pos);

          var pos = event.getUILocation(this._tempV2);

          this._tempV3.set(pos.x, pos.y, 0);

          var camera = (_crd && CameraMove === void 0 ? (_reportPossibleCrUseOfCameraMove({
            error: Error()
          }), CameraMove) : CameraMove).instance.camera; // camera.screenToWorld(this._tempV3, this._tempV3);

          this._downPos.set(this._tempV3);

          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.emit(Node.EventType.TOUCH_START); // this.rockerUI.pos = pos;
          // this.rockerUI.node.active = true;
          // this.rockerAniUI.active = false;
        }

        // private curX: number = 0;
        onMouseMove(event) {
          var pos = event.getUILocation(this._tempV2);

          this._tempV3.set(pos.x, pos.y, 0); // const camera = CameraMove.instance.camera;
          // camera.screenToWorld(this._tempV3, this._tempV3);


          var x = this._downPos.x - this._tempV3.x; // let X = x / Math.abs(x);
          // if (Number.isNaN(X)) X = 0;
          // if (X != this.curX) {
          // }
          // this._downPos.set(this._tempV3);
          // this._rockerLogic.rockerMove(pos);
          // this.rockerUI.rPos = this._rockerLogic.rockerPos;

          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.emit(Node.EventType.TOUCH_MOVE, x);
        } //sk-091ba712d7304c7781291c2c899d8274


        onMouseOver(event) {
          this.node.off(Node.EventType.TOUCH_MOVE, this.onMouseMove, this);
          this.node.off(Node.EventType.TOUCH_END, this.onMouseOver, this);
          this.node.off(Node.EventType.TOUCH_CANCEL, this.onMouseOver, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.emit(Node.EventType.TOUCH_END); // this._rockerLogic.rockerUp();
          // this._rockerLogic.rockerOver();
          // this.rockerUI.rPos = this._rockerLogic.rockerPos;
          // this.rockerUI.node.active = false;
          // this._RockerAniShowTime = this.rockerAniUIShowTime;
        } // update(deltaTime: number) {
        //     if (!this.rockerAniUI.active && !this.rockerUI.node.active && this._RockerAniShowTime > 0) {
        //         this._RockerAniShowTime -= deltaTime;
        //         if (this._RockerAniShowTime <= 0) {
        //             this.rockerAniUI.active = true;
        //         }
        //     }
        // }


      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "rockerUI", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "rockerAniUI", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "rockerAniUIShowTime", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=80a9ad2cbcc6fa92b787e30e64b7d864bc0630f4.js.map