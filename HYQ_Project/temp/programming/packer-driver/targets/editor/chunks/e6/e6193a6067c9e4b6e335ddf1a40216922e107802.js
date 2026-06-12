System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, Component, Node, GuideLine, Player, MoveDrive, MonsterCreate, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _class3, _crd, ccclass, property, GuideManager;

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
      MonsterCreate = _unresolved_5.MonsterCreate;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3062cO1YclDl4EzgZtjrqle", "GuideManager", undefined);

      __checkObsolete__(['_decorator', 'Animation', 'Component', 'Node']);

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
          this.finishGuide();
        }

        finishGuide() {
          var _this$handAnim, _instance;

          if (this.isLock) {
            return;
          }

          this.isLock = true;

          if (this.roleNode) {
            this.roleNode.active = false;
          }

          if ((_this$handAnim = this.handAnim) != null && _this$handAnim.node) {
            this.handAnim.node.active = false;
          }

          (_instance = (_crd && GuideLine === void 0 ? (_reportPossibleCrUseOfGuideLine({
            error: Error()
          }), GuideLine) : GuideLine).instance) == null || _instance.setLineNode();
          (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance.isLock = true;
          (_crd && MoveDrive === void 0 ? (_reportPossibleCrUseOfMoveDrive({
            error: Error()
          }), MoveDrive) : MoveDrive).isMoveOk = true;
          (_crd && MonsterCreate === void 0 ? (_reportPossibleCrUseOfMonsterCreate({
            error: Error()
          }), MonsterCreate) : MonsterCreate).isStartMove = true;
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