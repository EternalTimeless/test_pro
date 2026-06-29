System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12", "__unresolved_13", "__unresolved_14", "__unresolved_15", "__unresolved_16", "__unresolved_17", "__unresolved_18", "__unresolved_19"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, CCFloat, Component, Node, Sprite, GuideLine, Player, MoveDrive, MonsterCreate, BulletEnum, EffectEnum, LayerEnum, PoolEnum, PrefabsEnum, RoleEnum, SoundEnum, PoolManager, PrefabsManager, Role, JumpManager, EffectManager, BezierCurve, JumpCurve3D, FbxManager, BulletBattle3D, BulletBatchRenderer, LayerManager, AudioManager, FlashRedManager, EffectTimePartRemove, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _class3, _crd, ccclass, property, GuideManager;

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

  function _reportPossibleCrUseOfBulletEnum(extras) {
    _reporterNs.report("BulletEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEffectEnum(extras) {
    _reporterNs.report("EffectEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLayerEnum(extras) {
    _reporterNs.report("LayerEnum", "../../Base/EnumList", _context.meta, extras);
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

  function _reportPossibleCrUseOfSoundEnum(extras) {
    _reporterNs.report("SoundEnum", "../../Base/EnumList", _context.meta, extras);
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

  function _reportPossibleCrUseOfFbxManager(extras) {
    _reporterNs.report("FbxManager", "../SkAnim/FbxManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletBattle3D(extras) {
    _reporterNs.report("BulletBattle3D", "../Battle/Battle3D/Bullet/BulletBattle3D", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletBatchRenderer(extras) {
    _reporterNs.report("BulletBatchRenderer", "../Battle/BulletBatchRenderer", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLayerManager(extras) {
    _reporterNs.report("LayerManager", "../../Base/LayerManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "../../Base/AudioManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFlashRedManager(extras) {
    _reporterNs.report("FlashRedManager", "../Battle/Base/FlashRedManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEffectTimePartRemove(extras) {
    _reporterNs.report("EffectTimePartRemove", "../Effect/EffectTimePartRemove", _context.meta, extras);
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
      BulletEnum = _unresolved_6.BulletEnum;
      EffectEnum = _unresolved_6.EffectEnum;
      LayerEnum = _unresolved_6.LayerEnum;
      PoolEnum = _unresolved_6.PoolEnum;
      PrefabsEnum = _unresolved_6.PrefabsEnum;
      RoleEnum = _unresolved_6.RoleEnum;
      SoundEnum = _unresolved_6.SoundEnum;
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
    }, function (_unresolved_14) {
      FbxManager = _unresolved_14.FbxManager;
    }, function (_unresolved_15) {
      BulletBattle3D = _unresolved_15.default;
    }, function (_unresolved_16) {
      BulletBatchRenderer = _unresolved_16.BulletBatchRenderer;
    }, function (_unresolved_17) {
      LayerManager = _unresolved_17.default;
    }, function (_unresolved_18) {
      AudioManager = _unresolved_18.default;
    }, function (_unresolved_19) {
      FlashRedManager = _unresolved_19.FlashRedManager;
    }, function (_unresolved_20) {
      EffectTimePartRemove = _unresolved_20.EffectTimePartRemove;
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
      }), _dec5 = property(CCFloat), _dec(_class = (_class2 = (_class3 = class GuideManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "roleNode", _descriptor, this);

          this.isLock = false;

          _initializerDefineProperty(this, "handAnim", _descriptor2, this);

          _initializerDefineProperty(this, "loadingDuration", _descriptor3, this);

          _initializerDefineProperty(this, "startGuideReachX", _descriptor4, this);

          this.loadingNode = null;
          this.loadingProgress = null;
          this.loadingTime = 0;
          this.warmupTasks = [];
          this.warmupTaskIndex = 0;
          this.warmupPerFrame = 4;
          this.warmupRoot = null;
          this.pendingSoundWarmupCount = 0;
          this.pendingRuntimeWarmupCount = 0;
          this.waitingStartGuide = false;
          this.startGuidePlayerX = 0;
          this.startGuideTargetX = 0;
          this.hasStartGuidePosition = false;
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

          if (this.waitingStartGuide) {
            this.checkStartGuideReached();
            return;
          }

          if (!this.loadingNode || !this.loadingNode.active) {
            this.showStartGuide();
            return;
          }

          this.loadingTime += dt;
          this.runWarmup();
          const progress = this.loadingDuration <= 0 ? 1 : Math.min(1, this.loadingTime / this.loadingDuration);

          if (this.loadingProgress) {
            this.loadingProgress.fillRange = progress;
          }

          if (progress >= 1 && this.isWarmupComplete()) {
            this.loadingNode.active = false;
            this.showStartGuide();
          }
        }

        lockGameplay() {
          this.isLock = false;
          this.waitingStartGuide = false;
          this.hasStartGuidePosition = false;
          this.setGuideVisualActive(false);
          this.setGameplayActive(false, false);
        }

        setGameplayActive(active, guideMoveOnly = false) {
          if ((_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance) {
            (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
              error: Error()
            }), Player) : Player).instance.isLock = active;
          }

          (_crd && MoveDrive === void 0 ? (_reportPossibleCrUseOfMoveDrive({
            error: Error()
          }), MoveDrive) : MoveDrive).isMoveOk = active;
          (_crd && MoveDrive === void 0 ? (_reportPossibleCrUseOfMoveDrive({
            error: Error()
          }), MoveDrive) : MoveDrive).isGuideMoveOnly = guideMoveOnly;
          (_crd && MonsterCreate === void 0 ? (_reportPossibleCrUseOfMonsterCreate({
            error: Error()
          }), MonsterCreate) : MonsterCreate).isStartMove = active;
        }

        setGuideVisualActive(active) {
          var _this$handAnim;

          if (this.roleNode) {
            this.roleNode.active = active;
          }

          if ((_this$handAnim = this.handAnim) != null && _this$handAnim.node) {
            this.handAnim.node.active = active;

            if (active) {
              this.handAnim.play();
            } else {
              this.handAnim.stop();
            }
          }
        }

        showStartGuide() {
          if (this.waitingStartGuide || this.isLock) {
            return;
          }

          this.waitingStartGuide = true;
          this.cacheStartGuidePosition();
          this.setGameplayActive(false, true);
          this.setGuideVisualActive(true);

          if (this.roleNode) {
            var _instance;

            (_instance = (_crd && GuideLine === void 0 ? (_reportPossibleCrUseOfGuideLine({
              error: Error()
            }), GuideLine) : GuideLine).instance) == null || _instance.setLineNode(this.getGuidePlayerNode(), this.roleNode);
          }
        }

        cacheStartGuidePosition() {
          const playerNode = this.getGuidePlayerNode();

          if (!playerNode || !this.roleNode) {
            this.hasStartGuidePosition = false;
            return;
          }

          this.startGuidePlayerX = playerNode.worldPosition.x;
          this.startGuideTargetX = this.roleNode.worldPosition.x;
          this.hasStartGuidePosition = true;
        }

        getGuidePlayerNode() {
          var _instance$move$node, _instance2, _instance3;

          return (_instance$move$node = (_instance2 = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance) == null || (_instance2 = _instance2.move) == null ? void 0 : _instance2.node) != null ? _instance$move$node : (_instance3 = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance) == null ? void 0 : _instance3.node;
        }

        checkStartGuideReached() {
          const playerNode = this.getGuidePlayerNode();

          if (!playerNode || !this.roleNode) {
            return;
          }

          if (!this.hasStartGuidePosition) {
            this.cacheStartGuidePosition();
          }

          const playerX = playerNode.worldPosition.x;
          const targetX = this.roleNode.worldPosition.x;
          const dx = Math.abs(playerX - targetX);
          const targetOffset = this.hasStartGuidePosition ? this.startGuideTargetX - this.startGuidePlayerX : targetX - playerX;
          const hasPassedTarget = targetOffset >= 0 ? playerX >= targetX - this.startGuideReachX : playerX <= targetX + this.startGuideReachX;

          if (dx <= this.startGuideReachX || hasPassedTarget) {
            this.finishGuide();
          }
        }

        initLoadingView() {
          let root = this.node;

          while (root.parent) {
            root = root.parent;
          }

          this.loadingNode = this.findNodeByName(root, "loading");

          if (!this.loadingNode) {
            this.showStartGuide();
            return;
          }

          this.loadingNode.active = true;
          const progressNode = this.findNodeByName(this.loadingNode, "img_hp_0") || this.findNodeByName(this.loadingNode, "img_hp_1");
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
          this.preloadSounds();
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
            count: 60
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
            count: 60
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
            count: 60
          }, {
            poolKey: (_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).bullet + (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
              error: Error()
            }), BulletEnum) : BulletEnum).arrow,
            prefabType: (_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
              error: Error()
            }), PrefabsEnum) : PrefabsEnum).bullet,
            prefabIndex: (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
              error: Error()
            }), BulletEnum) : BulletEnum).arrow,
            component: _crd && BulletBattle3D === void 0 ? (_reportPossibleCrUseOfBulletBattle3D({
              error: Error()
            }), BulletBattle3D) : BulletBattle3D,
            count: 8,
            bullet3D: true
          }, {
            poolKey: (_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).bullet + (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
              error: Error()
            }), BulletEnum) : BulletEnum).arrow_1,
            prefabType: (_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
              error: Error()
            }), PrefabsEnum) : PrefabsEnum).bullet,
            prefabIndex: (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
              error: Error()
            }), BulletEnum) : BulletEnum).arrow_1,
            component: _crd && BulletBattle3D === void 0 ? (_reportPossibleCrUseOfBulletBattle3D({
              error: Error()
            }), BulletBattle3D) : BulletBattle3D,
            count: 8,
            bullet3D: true
          }, {
            poolKey: (_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).bullet + (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
              error: Error()
            }), BulletEnum) : BulletEnum).arrow_2,
            prefabType: (_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
              error: Error()
            }), PrefabsEnum) : PrefabsEnum).bullet,
            prefabIndex: (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
              error: Error()
            }), BulletEnum) : BulletEnum).arrow_2,
            component: _crd && BulletBattle3D === void 0 ? (_reportPossibleCrUseOfBulletBattle3D({
              error: Error()
            }), BulletBattle3D) : BulletBattle3D,
            count: 8,
            bullet3D: true
          }, {
            poolKey: (_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).bullet + (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
              error: Error()
            }), BulletEnum) : BulletEnum).arrow_3,
            prefabType: (_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
              error: Error()
            }), PrefabsEnum) : PrefabsEnum).bullet,
            prefabIndex: (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
              error: Error()
            }), BulletEnum) : BulletEnum).arrow_3,
            component: _crd && BulletBattle3D === void 0 ? (_reportPossibleCrUseOfBulletBattle3D({
              error: Error()
            }), BulletBattle3D) : BulletBattle3D,
            count: 8,
            bullet3D: true
          }, {
            poolKey: (_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).bullet + (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
              error: Error()
            }), BulletEnum) : BulletEnum).arrow_4,
            prefabType: (_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
              error: Error()
            }), PrefabsEnum) : PrefabsEnum).bullet,
            prefabIndex: (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
              error: Error()
            }), BulletEnum) : BulletEnum).arrow_4,
            component: _crd && BulletBattle3D === void 0 ? (_reportPossibleCrUseOfBulletBattle3D({
              error: Error()
            }), BulletBattle3D) : BulletBattle3D,
            count: 8,
            bullet3D: true
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

        preloadSounds() {
          const sounds = [(_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
            error: Error()
          }), SoundEnum) : SoundEnum).Sound_Gun, (_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
            error: Error()
          }), SoundEnum) : SoundEnum).Sound_FireGun, (_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
            error: Error()
          }), SoundEnum) : SoundEnum).Sound_Ship_UpLevel, (_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
            error: Error()
          }), SoundEnum) : SoundEnum).Sound_PlaceGold];
          this.pendingSoundWarmupCount = sounds.length;

          for (let i = 0; i < sounds.length; i++) {
            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).inst.preload(sounds[i], () => {
              this.pendingSoundWarmupCount--;
            });
          }
        }

        runWarmup() {
          if (!this.warmupRoot) {
            return;
          }

          let count = this.warmupPerFrame;

          while (count > 0 && this.warmupTaskIndex < this.warmupTasks.length) {
            const task = this.warmupTasks[this.warmupTaskIndex];
            const node = (_crd && PrefabsManager === void 0 ? (_reportPossibleCrUseOfPrefabsManager({
              error: Error()
            }), PrefabsManager) : PrefabsManager).instance.GetPrefabsIns(task.prefabType, task.prefabIndex);
            this.warmupRoot.addChild(node);
            this.prewarmNode(node, task);
            const item = task.component ? node.getComponent(task.component) : node;

            if (task.bullet3D && item) {
              this.prewarmBulletBatch(item);
            }

            node.active = false;
            (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.setPool(task.poolKey, item);
            task.count--;
            count--;

            if (task.count <= 0) {
              this.warmupTaskIndex++;
            }
          }
        }

        prewarmNode(node, task) {
          var _this$warmupRoot$acti, _this$warmupRoot;

          const wasRootActive = (_this$warmupRoot$acti = (_this$warmupRoot = this.warmupRoot) == null ? void 0 : _this$warmupRoot.active) != null ? _this$warmupRoot$acti : false;

          if (this.warmupRoot && !wasRootActive) {
            this.warmupRoot.active = true;
          }

          node.active = true;
          const fbxManagers = node.getComponentsInChildren(_crd && FbxManager === void 0 ? (_reportPossibleCrUseOfFbxManager({
            error: Error()
          }), FbxManager) : FbxManager);

          for (let i = 0; i < fbxManagers.length; i++) {
            fbxManagers[i].prewarmAnimations();
          }

          if (task.prefabType === (_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
            error: Error()
          }), PrefabsEnum) : PrefabsEnum).effect) {
            this.prewarmEffect(node);
          } else if (task.prefabType === (_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
            error: Error()
          }), PrefabsEnum) : PrefabsEnum).hero) {
            this.prewarmRole(node);
          }

          node.active = false;

          if (this.warmupRoot && !wasRootActive) {
            this.warmupRoot.active = false;
          }
        }

        prewarmBulletBatch(bullet) {
          var _instance4;

          const bulletLayer = (_instance4 = (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
            error: Error()
          }), LayerManager) : LayerManager).instance) == null ? void 0 : _instance4.getLayer((_crd && LayerEnum === void 0 ? (_reportPossibleCrUseOfLayerEnum({
            error: Error()
          }), LayerEnum) : LayerEnum).BulletLayer);

          if (!bulletLayer) {
            return;
          }

          (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role).bulletLayer = bulletLayer;
          (_crd && BulletBatchRenderer === void 0 ? (_reportPossibleCrUseOfBulletBatchRenderer({
            error: Error()
          }), BulletBatchRenderer) : BulletBatchRenderer).getOrCreate(bulletLayer).prewarmBullet(bullet);
        }

        isWarmupComplete() {
          const prefabWarmupComplete = this.warmupTasks.length <= 0 || this.warmupTaskIndex >= this.warmupTasks.length;
          return prefabWarmupComplete && this.pendingSoundWarmupCount <= 0 && this.pendingRuntimeWarmupCount <= 0;
        }

        prewarmEffect(node) {
          const effect = node.getComponent(_crd && EffectTimePartRemove === void 0 ? (_reportPossibleCrUseOfEffectTimePartRemove({
            error: Error()
          }), EffectTimePartRemove) : EffectTimePartRemove);

          if (!effect) {
            return;
          }

          this.pendingRuntimeWarmupCount++;
          node.active = true;
          this.scheduleOnce(() => {
            node.active = false;
            (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).effect + effect.index, node);
            this.pendingRuntimeWarmupCount--;
          }, 0);
        }

        prewarmRole(node) {
          var _role$meshCreateDataL, _role$meshRedDataList;

          const role = node.getComponent(_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role);

          if (!role) {
            return;
          }

          if (role.effect) {
            role.effect.play();
            role.effect.stop();
          }

          if (((_role$meshCreateDataL = role.meshCreateDataList) == null ? void 0 : _role$meshCreateDataL.length) > 0) {
            (_crd && FlashRedManager === void 0 ? (_reportPossibleCrUseOfFlashRedManager({
              error: Error()
            }), FlashRedManager) : FlashRedManager).instance.prewarm(role.node, role.meshCreateDataList);
          }

          if (((_role$meshRedDataList = role.meshRedDataList) == null ? void 0 : _role$meshRedDataList.length) > 0) {
            (_crd && FlashRedManager === void 0 ? (_reportPossibleCrUseOfFlashRedManager({
              error: Error()
            }), FlashRedManager) : FlashRedManager).instance.prewarm(role.node, role.meshRedDataList);
          }
        }

        findNodeByName(root, name) {
          if (!root) {
            return null;
          }

          if (root.name === name) {
            return root;
          }

          for (let i = 0; i < root.children.length; i++) {
            const result = this.findNodeByName(root.children[i], name);

            if (result) {
              return result;
            }
          }

          return null;
        }

        finishGuide() {
          var _instance5;

          if (this.isLock) {
            return;
          }

          this.isLock = true;
          this.waitingStartGuide = false;
          this.hasStartGuidePosition = false;
          this.setGuideVisualActive(false);
          (_instance5 = (_crd && GuideLine === void 0 ? (_reportPossibleCrUseOfGuideLine({
            error: Error()
          }), GuideLine) : GuideLine).instance) == null || _instance5.setLineNode();
          this.setGameplayActive(true, false);
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
        initializer: function () {
          return 1.2;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "startGuideReachX", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.35;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ddf9ec67bc21176ab14fd7bef2d6099af7cab4e3.js.map