System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, CCFloat, Component, Node, Sprite, GuideLine, Player, MoveDrive, MonsterCreate, EffectEnum, PoolEnum, PrefabsEnum, RoleEnum, PoolManager, PrefabsManager, Role, JumpManager, EffectManager, BezierCurve, JumpCurve3D, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _class3, _crd, ccclass, property, GuideManager;

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

  function _reportPossibleCrUseOfEffectEnum(extras) {
    _reporterNs.report("EffectEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolEnum(extras) {
    _reporterNs.report("PoolEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPrefabsEnum(extras) {
    _reporterNs.report("PrefabsEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRoleEnum(extras) {
    _reporterNs.report("RoleEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolManager(extras) {
    _reporterNs.report("PoolManager", "../../Base/PoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPrefabsManager(extras) {
    _reporterNs.report("PrefabsManager", "../../Base/PrefabsManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRole(extras) {
    _reporterNs.report("Role", "../Player/Role", _context.meta, extras);
  }

  function _reportPossibleCrUseOfJumpManager(extras) {
    _reporterNs.report("JumpManager", "../Jump/JumpManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEffectManager(extras) {
    _reporterNs.report("EffectManager", "../Effect/EffectManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBezierCurve(extras) {
    _reporterNs.report("BezierCurve", "../Jump/BezierCurve", _context.meta, extras);
  }

  function _reportPossibleCrUseOfJumpCurve3D(extras) {
    _reporterNs.report("JumpCurve3D", "../Jump/JumpCurve3D", _context.meta, extras);
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
      CCFloat = _cc.CCFloat;
      Component = _cc.Component;
      Node = _cc.Node;
      Sprite = _cc.Sprite;
    }, function (_unresolved_2) {
      GuideLine = _unresolved_2.GuideLine;
    }, function (_unresolved_3) {
      Player = _unresolved_3.Player;
    }, function (_unresolved_4) {
      MoveDrive = _unresolved_4.MoveDrive;
    }, function (_unresolved_5) {
      MonsterCreate = _unresolved_5.MonsterCreate;
    }, function (_unresolved_6) {
      EffectEnum = _unresolved_6.EffectEnum;
      PoolEnum = _unresolved_6.PoolEnum;
      PrefabsEnum = _unresolved_6.PrefabsEnum;
      RoleEnum = _unresolved_6.RoleEnum;
    }, function (_unresolved_7) {
      PoolManager = _unresolved_7.default;
    }, function (_unresolved_8) {
      PrefabsManager = _unresolved_8.PrefabsManager;
    }, function (_unresolved_9) {
      Role = _unresolved_9.Role;
    }, function (_unresolved_10) {
      JumpManager = _unresolved_10.JumpManager;
    }, function (_unresolved_11) {
      EffectManager = _unresolved_11.EffectManager;
    }, function (_unresolved_12) {
      BezierCurve = _unresolved_12.default;
    }, function (_unresolved_13) {
      JumpCurve3D = _unresolved_13.JumpCurve3D;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3062cO1YclDl4EzgZtjrqle", "GuideManager", undefined);

      __checkObsolete__(['_decorator', 'Animation', 'CCFloat', 'Component', 'Node', 'Sprite']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GuideManager", GuideManager = (_dec = ccclass('GuideManager'), _dec2 = property(Node), _dec3 = property(Animation), _dec4 = property({
        type: CCFloat,
        tooltip: '加载条播放时长'
      }), _dec(_class = (_class2 = (_class3 = class GuideManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "roleNode", _descriptor, this);

          this.isLock = false;

          _initializerDefineProperty(this, "handAnim", _descriptor2, this);

          _initializerDefineProperty(this, "loadingDuration", _descriptor3, this);

          this.loadingNode = null;
          this.loadingProgress = null;
          this.loadingTime = 0;
          this.warmupTasks = [];
          this.warmupTaskIndex = 0;
          this.warmupPerFrame = 4;
          this.warmupRoot = null;
        }

        start() {
          GuideManager.instance = this;
          this.lockGameplay();
          this.initLoadingView();
          this.initWarmupTasks();
        }

        update(dt) {
          if (this.isLock) {
            return;
          }

          if (!this.loadingNode || !this.loadingNode.active) {
            this.finishGuide();
            return;
          }

          this.loadingTime += dt;
          this.runWarmup();
          var progress = this.loadingDuration <= 0 ? 1 : Math.min(1, this.loadingTime / this.loadingDuration);

          if (this.loadingProgress) {
            this.loadingProgress.fillRange = progress;
          }

          if (progress >= 1) {
            this.loadingNode.active = false;
            this.finishGuide();
          }
        }

        lockGameplay() {
          this.isLock = false;

          if ((_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance) {
            (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
              error: Error()
            }), Player) : Player).instance.isLock = false;
          }

          (_crd && MoveDrive === void 0 ? (_reportPossibleCrUseOfMoveDrive({
            error: Error()
          }), MoveDrive) : MoveDrive).isMoveOk = false;
          (_crd && MonsterCreate === void 0 ? (_reportPossibleCrUseOfMonsterCreate({
            error: Error()
          }), MonsterCreate) : MonsterCreate).isStartMove = false;
        }

        initLoadingView() {
          var root = this.node;

          while (root.parent) {
            root = root.parent;
          }

          this.loadingNode = this.findNodeByName(root, "loading");

          if (!this.loadingNode) {
            this.finishGuide();
            return;
          }

          this.loadingNode.active = true;
          var progressNode = this.findNodeByName(this.loadingNode, "img_hp_0") || this.findNodeByName(this.loadingNode, "img_hp_1");
          this.loadingProgress = progressNode ? progressNode.getComponent(Sprite) : null;

          if (this.loadingProgress) {
            this.loadingProgress.fillRange = 0;
          }

          this.loadingTime = 0;
        }

        initWarmupTasks() {
          if (!(_crd && PrefabsManager === void 0 ? (_reportPossibleCrUseOfPrefabsManager({
            error: Error()
          }), PrefabsManager) : PrefabsManager).instance) {
            return;
          }

          this.warmupRoot = new Node("WarmupPool");
          this.warmupRoot.active = false;
          this.node.addChild(this.warmupRoot);
          (_crd && JumpManager === void 0 ? (_reportPossibleCrUseOfJumpManager({
            error: Error()
          }), JumpManager) : JumpManager).instance;
          (_crd && EffectManager === void 0 ? (_reportPossibleCrUseOfEffectManager({
            error: Error()
          }), EffectManager) : EffectManager).instance;
          (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).JumpSequence + (_crd && BezierCurve === void 0 ? (_reportPossibleCrUseOfBezierCurve({
            error: Error()
          }), BezierCurve) : BezierCurve), new (_crd && BezierCurve === void 0 ? (_reportPossibleCrUseOfBezierCurve({
            error: Error()
          }), BezierCurve) : BezierCurve)());
          (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).JumpSequence + (_crd && JumpCurve3D === void 0 ? (_reportPossibleCrUseOfJumpCurve3D({
            error: Error()
          }), JumpCurve3D) : JumpCurve3D), new (_crd && JumpCurve3D === void 0 ? (_reportPossibleCrUseOfJumpCurve3D({
            error: Error()
          }), JumpCurve3D) : JumpCurve3D)());
          this.warmupTasks = [{
            poolKey: (_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).role + (_crd && RoleEnum === void 0 ? (_reportPossibleCrUseOfRoleEnum({
              error: Error()
            }), RoleEnum) : RoleEnum).underling,
            prefabType: (_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
              error: Error()
            }), PrefabsEnum) : PrefabsEnum).hero,
            prefabIndex: (_crd && RoleEnum === void 0 ? (_reportPossibleCrUseOfRoleEnum({
              error: Error()
            }), RoleEnum) : RoleEnum).underling,
            component: _crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
              error: Error()
            }), Role) : Role,
            count: 40
          }, {
            poolKey: (_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).role + (_crd && RoleEnum === void 0 ? (_reportPossibleCrUseOfRoleEnum({
              error: Error()
            }), RoleEnum) : RoleEnum).dazhuang,
            prefabType: (_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
              error: Error()
            }), PrefabsEnum) : PrefabsEnum).hero,
            prefabIndex: (_crd && RoleEnum === void 0 ? (_reportPossibleCrUseOfRoleEnum({
              error: Error()
            }), RoleEnum) : RoleEnum).dazhuang,
            component: _crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
              error: Error()
            }), Role) : Role,
            count: 40
          }, {
            poolKey: (_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).role + (_crd && RoleEnum === void 0 ? (_reportPossibleCrUseOfRoleEnum({
              error: Error()
            }), RoleEnum) : RoleEnum).dazhuangPlus,
            prefabType: (_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
              error: Error()
            }), PrefabsEnum) : PrefabsEnum).hero,
            prefabIndex: (_crd && RoleEnum === void 0 ? (_reportPossibleCrUseOfRoleEnum({
              error: Error()
            }), RoleEnum) : RoleEnum).dazhuangPlus,
            component: _crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
              error: Error()
            }), Role) : Role,
            count: 40
          }, {
            poolKey: (_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).effect + (_crd && EffectEnum === void 0 ? (_reportPossibleCrUseOfEffectEnum({
              error: Error()
            }), EffectEnum) : EffectEnum).up,
            prefabType: (_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
              error: Error()
            }), PrefabsEnum) : PrefabsEnum).effect,
            prefabIndex: (_crd && EffectEnum === void 0 ? (_reportPossibleCrUseOfEffectEnum({
              error: Error()
            }), EffectEnum) : EffectEnum).up,
            count: 6
          }, {
            poolKey: (_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).effect + (_crd && EffectEnum === void 0 ? (_reportPossibleCrUseOfEffectEnum({
              error: Error()
            }), EffectEnum) : EffectEnum).door,
            prefabType: (_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
              error: Error()
            }), PrefabsEnum) : PrefabsEnum).effect,
            prefabIndex: (_crd && EffectEnum === void 0 ? (_reportPossibleCrUseOfEffectEnum({
              error: Error()
            }), EffectEnum) : EffectEnum).door,
            count: 6
          }];
          this.warmupTaskIndex = 0;
        }

        runWarmup() {
          if (!this.warmupRoot) {
            return;
          }

          var count = this.warmupPerFrame;

          while (count > 0 && this.warmupTaskIndex < this.warmupTasks.length) {
            var task = this.warmupTasks[this.warmupTaskIndex];
            var node = (_crd && PrefabsManager === void 0 ? (_reportPossibleCrUseOfPrefabsManager({
              error: Error()
            }), PrefabsManager) : PrefabsManager).instance.GetPrefabsIns(task.prefabType, task.prefabIndex);
            node.active = false;
            this.warmupRoot.addChild(node);
            (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.setPool(task.poolKey, task.component ? node.getComponent(task.component) : node);
            task.count--;
            count--;

            if (task.count <= 0) {
              this.warmupTaskIndex++;
            }
          }
        }

        findNodeByName(root, name) {
          if (!root) {
            return null;
          }

          if (root.name === name) {
            return root;
          }

          for (var i = 0; i < root.children.length; i++) {
            var result = this.findNodeByName(root.children[i], name);

            if (result) {
              return result;
            }
          }

          return null;
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

          if ((_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance) {
            (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
              error: Error()
            }), Player) : Player).instance.isLock = true;
          }

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
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "loadingDuration", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.2;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ddf9ec67bc21176ab14fd7bef2d6099af7cab4e3.js.map