System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, UnityUpComponent, TweenTool, AudioManager, SoundEnum, SuperPackage, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _class3, _crd, ccclass, property, GameOverPanel;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfUnityUpComponent(extras) {
    _reporterNs.report("UnityUpComponent", "../../../Base/UnityUpComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTweenTool(extras) {
    _reporterNs.report("TweenTool", "../../../Tool/TweenTool", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "../../../Base/AudioManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundEnum(extras) {
    _reporterNs.report("SoundEnum", "../../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSuperPackage(extras) {
    _reporterNs.report("SuperPackage", "db://super-packager/Common/SuperPackage", _context.meta, extras);
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
      UnityUpComponent = _unresolved_2.UnityUpComponent;
    }, function (_unresolved_3) {
      TweenTool = _unresolved_3.default;
    }, function (_unresolved_4) {
      AudioManager = _unresolved_4.default;
    }, function (_unresolved_5) {
      SoundEnum = _unresolved_5.SoundEnum;
    }, function (_unresolved_6) {
      SuperPackage = _unresolved_6.SuperPackage;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f8a82zx0DpIGbI53nr/zLjv", "GameOverPanel", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']); // import { SuperPackage } from 'db://super-packager/Common/SuperPackage';


      ({
        ccclass,
        property
      } = _decorator);

      _export("GameOverPanel", GameOverPanel = (_dec = ccclass('GameOverPanel'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec(_class = (_class2 = (_class3 = class GameOverPanel extends Component {
        constructor() {
          super();
          this.isResume = false;

          _initializerDefineProperty(this, "winNode", _descriptor, this);

          _initializerDefineProperty(this, "loseNode", _descriptor2, this);

          _initializerDefineProperty(this, "resumeNode", _descriptor3, this);

          GameOverPanel.instance = this;
        }

        start() {
          this.node.active = false;
        }

        show(isWin) {
          this.node.active = true;
          (_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
            error: Error()
          }), UnityUpComponent) : UnityUpComponent).isStop = true;
          (_crd && TweenTool === void 0 ? (_reportPossibleCrUseOfTweenTool({
            error: Error()
          }), TweenTool) : TweenTool).scaleShake(this.node);

          if (isWin) {
            this.winNode.active = true;
            this.loseNode.active = false;
            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).inst.playOneShot((_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
              error: Error()
            }), SoundEnum) : SoundEnum).gameWin);
          } else {
            this.winNode.active = false;
            this.loseNode.active = true;
            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).inst.playOneShot((_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
              error: Error()
            }), SoundEnum) : SoundEnum).gameLoser);
            this.resumeNode.active = !this.isResume;
            this.isResume = true;
          } // SuperPackage.Instance.DownloadTCE();

        }

        hide() {
          this.node.active = false;
          (_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
            error: Error()
          }), UnityUpComponent) : UnityUpComponent).isStop = false;
        }

        onDownLoadClickEvent() {
          (_crd && SuperPackage === void 0 ? (_reportPossibleCrUseOfSuperPackage({
            error: Error()
          }), SuperPackage) : SuperPackage).Instance.Download();
        }

      }, _class3.instance = void 0, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "winNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "loseNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "resumeNode", [_dec4], {
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
//# sourceMappingURL=f2eb00a6337809abf1e4a6514caa56935d7e6852.js.map