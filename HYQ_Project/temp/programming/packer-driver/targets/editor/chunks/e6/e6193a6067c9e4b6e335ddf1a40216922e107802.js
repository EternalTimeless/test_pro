System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, Component, Node, GuideLine, Player, MoveDrive, EffectManager, EffectEnum, EventType, SoundEnum, CameraMove, AudioManager, EventManager, MonsterCreate, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _class3, _crd, ccclass, property, GuideManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGuideLine(extras) {
    _reporterNs.report("GuideLine", "./GuideLine", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayer(extras) {
    _reporterNs.report("Player", "../Player/Player", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMoveDrive(extras) {
    _reporterNs.report("MoveDrive", "../../Base/MoveRot/MoveDrive", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEffectManager(extras) {
    _reporterNs.report("EffectManager", "../Effect/EffectManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEffectEnum(extras) {
    _reporterNs.report("EffectEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundEnum(extras) {
    _reporterNs.report("SoundEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCameraMove(extras) {
    _reporterNs.report("CameraMove", "../../Base/CameraMove", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "../../Base/AudioManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../../Base/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMonsterCreate(extras) {
    _reporterNs.report("MonsterCreate", "../Monster/MonsterCreate", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Animation = _cc.Animation;
      Component = _cc.Component;
      Node = _cc.Node;
    }, function (_unresolved_2) {
      GuideLine = _unresolved_2.GuideLine;
    }, function (_unresolved_3) {
      Player = _unresolved_3.Player;
    }, function (_unresolved_4) {
      MoveDrive = _unresolved_4.MoveDrive;
    }, function (_unresolved_5) {
      EffectManager = _unresolved_5.EffectManager;
    }, function (_unresolved_6) {
      EffectEnum = _unresolved_6.EffectEnum;
      EventType = _unresolved_6.EventType;
      SoundEnum = _unresolved_6.SoundEnum;
    }, function (_unresolved_7) {
      CameraMove = _unresolved_7.CameraMove;
    }, function (_unresolved_8) {
      AudioManager = _unresolved_8.default;
    }, function (_unresolved_9) {
      EventManager = _unresolved_9.default;
    }, function (_unresolved_10) {
      MonsterCreate = _unresolved_10.MonsterCreate;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3062cO1YclDl4EzgZtjrqle", "GuideManager", undefined);

      __checkObsolete__(['_decorator', 'Animation', 'CacheMode', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GuideManager", GuideManager = (_dec = ccclass('GuideManager'), _dec2 = property(Node), _dec3 = property(Animation), _dec(_class = (_class2 = (_class3 = class GuideManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "roleNode", _descriptor, this);

          this.isLock = false;

          _initializerDefineProperty(this, "handAnim", _descriptor2, this);
        }

        start() {
          GuideManager.instance = this;
          (_crd && GuideLine === void 0 ? (_reportPossibleCrUseOfGuideLine({
            error: Error()
          }), GuideLine) : GuideLine).instance.setLineNode((_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance.node, this.roleNode);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).firstClick, this.onClickEvent, this);
        }

        onClickEvent() {
          this.handAnim.node.active = false;
        }

        update(dt) {
          const x = Math.abs(this.roleNode.x - (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance.node.x);

          if ((x < 0.8 || (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance.node.x >= this.roleNode.x) && !this.isLock) {
            this.isLock = true;
            this.roleNode.active = false;
            (_crd && GuideLine === void 0 ? (_reportPossibleCrUseOfGuideLine({
              error: Error()
            }), GuideLine) : GuideLine).instance.setLineNode();
            (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
              error: Error()
            }), Player) : Player).instance.isLock = true;
            (_crd && MoveDrive === void 0 ? (_reportPossibleCrUseOfMoveDrive({
              error: Error()
            }), MoveDrive) : MoveDrive).isMoveOk = true;
            (_crd && MonsterCreate === void 0 ? (_reportPossibleCrUseOfMonsterCreate({
              error: Error()
            }), MonsterCreate) : MonsterCreate).isStartMove = true;
            (_crd && EffectManager === void 0 ? (_reportPossibleCrUseOfEffectManager({
              error: Error()
            }), EffectManager) : EffectManager).instance.addShowEffect((_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
              error: Error()
            }), Player) : Player).instance.node.worldPosition, (_crd && EffectEnum === void 0 ? (_reportPossibleCrUseOfEffectEnum({
              error: Error()
            }), EffectEnum) : EffectEnum).up, 2);
            (_crd && CameraMove === void 0 ? (_reportPossibleCrUseOfCameraMove({
              error: Error()
            }), CameraMove) : CameraMove).instance.Shake1();
            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).inst.playOneShot((_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
              error: Error()
            }), SoundEnum) : SoundEnum).Sound_Ship_UpLevel);
          }
        }

      }, _class3.instance = void 0, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "roleNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "handAnim", [_dec3], {
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
//# sourceMappingURL=e6193a6067c9e4b6e335ddf1a40216922e107802.js.map