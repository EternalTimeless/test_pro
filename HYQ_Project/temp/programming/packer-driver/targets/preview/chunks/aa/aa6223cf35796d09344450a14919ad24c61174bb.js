System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12", "__unresolved_13", "__unresolved_14", "__unresolved_15"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCBoolean, CCFloat, CCInteger, Color, instantiate, Label, Material, MeshRenderer, Node, resources, Tween, tween, utils, v3, Vec3, BattleTarget3D, BulletMonsterCollisionManager, PoolManager, ArmsTypeEnum, EventType, OtherPrefabsEnum, PoolEnum, PrefabsEnum, SoundEnum, PrefabsManager, TweenTool, EventManager, AttackParkPlay, FlashRedManager, MeshFlashData, MeshFlashSwitchData, AudioManager, FbxManager, CameraMove, MoveDrive, MonsterCreate, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _class4, _class5, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _class6, _crd, ccclass, property, AnimArms, ArmsInfo, PropArms;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfBattleTarget3D(extras) {
    _reporterNs.report("BattleTarget3D", "../Battle/BattleTarger/BattleTarget3D", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletMonsterCollisionManager(extras) {
    _reporterNs.report("BulletMonsterCollisionManager", "../Battle/BulletMonsterCollisionManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolManager(extras) {
    _reporterNs.report("PoolManager", "../../Base/PoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfArmsTypeEnum(extras) {
    _reporterNs.report("ArmsTypeEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfOtherPrefabsEnum(extras) {
    _reporterNs.report("OtherPrefabsEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolEnum(extras) {
    _reporterNs.report("PoolEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPrefabsEnum(extras) {
    _reporterNs.report("PrefabsEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundEnum(extras) {
    _reporterNs.report("SoundEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPrefabsManager(extras) {
    _reporterNs.report("PrefabsManager", "../../Base/PrefabsManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTweenTool(extras) {
    _reporterNs.report("TweenTool", "../../Tool/TweenTool", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../../Base/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAttackParkPlay(extras) {
    _reporterNs.report("AttackParkPlay", "../Battle/Battle3D/AttackParkPlay", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFlashRedManager(extras) {
    _reporterNs.report("FlashRedManager", "../Battle/Base/FlashRedManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMeshFlashData(extras) {
    _reporterNs.report("MeshFlashData", "../Battle/Base/BattleTargetBase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMeshFlashSwitchData(extras) {
    _reporterNs.report("MeshFlashSwitchData", "../Battle/Base/BattleTargetBase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "../../Base/AudioManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFbxManager(extras) {
    _reporterNs.report("FbxManager", "../SkAnim/FbxManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCameraMove(extras) {
    _reporterNs.report("CameraMove", "../../Base/CameraMove", _context.meta, extras);
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
      CCBoolean = _cc.CCBoolean;
      CCFloat = _cc.CCFloat;
      CCInteger = _cc.CCInteger;
      Color = _cc.Color;
      instantiate = _cc.instantiate;
      Label = _cc.Label;
      Material = _cc.Material;
      MeshRenderer = _cc.MeshRenderer;
      Node = _cc.Node;
      resources = _cc.resources;
      Tween = _cc.Tween;
      tween = _cc.tween;
      utils = _cc.utils;
      v3 = _cc.v3;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      BattleTarget3D = _unresolved_2.BattleTarget3D;
    }, function (_unresolved_3) {
      BulletMonsterCollisionManager = _unresolved_3.default;
    }, function (_unresolved_4) {
      PoolManager = _unresolved_4.default;
    }, function (_unresolved_5) {
      ArmsTypeEnum = _unresolved_5.ArmsTypeEnum;
      EventType = _unresolved_5.EventType;
      OtherPrefabsEnum = _unresolved_5.OtherPrefabsEnum;
      PoolEnum = _unresolved_5.PoolEnum;
      PrefabsEnum = _unresolved_5.PrefabsEnum;
      SoundEnum = _unresolved_5.SoundEnum;
    }, function (_unresolved_6) {
      PrefabsManager = _unresolved_6.PrefabsManager;
    }, function (_unresolved_7) {
      TweenTool = _unresolved_7.default;
    }, function (_unresolved_8) {
      EventManager = _unresolved_8.default;
    }, function (_unresolved_9) {
      AttackParkPlay = _unresolved_9.AttackParkPlay;
    }, function (_unresolved_10) {
      FlashRedManager = _unresolved_10.FlashRedManager;
    }, function (_unresolved_11) {
      MeshFlashData = _unresolved_11.MeshFlashData;
      MeshFlashSwitchData = _unresolved_11.MeshFlashSwitchData;
    }, function (_unresolved_12) {
      AudioManager = _unresolved_12.default;
    }, function (_unresolved_13) {
      FbxManager = _unresolved_13.FbxManager;
    }, function (_unresolved_14) {
      CameraMove = _unresolved_14.CameraMove;
    }, function (_unresolved_15) {
      MoveDrive = _unresolved_15.MoveDrive;
    }, function (_unresolved_16) {
      MonsterCreate = _unresolved_16.MonsterCreate;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4c579+CEFxDCr/XI7aDRdSS", "PropArms", undefined);

      __checkObsolete__(['_decorator', 'CCBoolean', 'CCFloat', 'CCInteger', 'Color', 'Component', 'instantiate', 'Label', 'Material', 'MeshRenderer', 'Node', 'resources', 'Tween', 'tween', 'utils', 'v3', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      AnimArms = /*#__PURE__*/function (AnimArms) {
        AnimArms[AnimArms["idle"] = 0] = "idle";
        AnimArms[AnimArms["up_ju"] = 1] = "up_ju";
        AnimArms[AnimArms["up_out"] = 2] = "up_out";
        return AnimArms;
      }(AnimArms || {});

      _export("ArmsInfo", ArmsInfo = (_dec = ccclass('ArmsInfo'), _dec2 = property({
        type: _crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
          error: Error()
        }), ArmsTypeEnum) : ArmsTypeEnum,
        displayName: '武器类型',
        tooltip: '主角吃到该武器后切换到的武器类型，对应 Player.upArms 的 ArmsTypeEnum。'
      }), _dec3 = property({
        type: _crd && FbxManager === void 0 ? (_reportPossibleCrUseOfFbxManager({
          error: Error()
        }), FbxManager) : FbxManager,
        displayName: '武器模型动画',
        tooltip: '拖入武器节点上的 FbxManager。目标死亡后，这个武器节点会飞向主角。'
      }), _dec4 = property({
        type: CCInteger,
        displayName: '底座/滚筒数量',
        tooltip: '武器下方生成的底座数量。当前临时用轮胎表现，后续可替换为滚筒资源。'
      }), _dec5 = property({
        type: CCInteger,
        displayName: '血量',
        tooltip: '该阶段需要承受的攻击次数/伤害量。血量降低时会逐步销毁底座/滚筒。'
      }), _dec6 = property({
        type: CCInteger,
        displayName: '完成后放出数量',
        tooltip: '该武器被打爆后，关联通道放出的 +1/+99 数量。'
      }), _dec7 = property({
        type: CCBoolean,
        displayName: '是否随底座抬升',
        tooltip: '勾选时武器会随着底座/滚筒生成逐步抬高；不勾选时使用固定高度。'
      }), _dec8 = property({
        type: CCFloat,
        displayName: '固定武器高度',
        tooltip: '当“是否随底座抬升”关闭时，武器模型固定在该高度。',

        visible() {
          return !this.isCanMove;
        }

      }), _dec9 = property({
        type: CCFloat,
        displayName: '固定保留底座数',
        tooltip: '当“是否随底座抬升”关闭时，底座/滚筒数量高于该值才会下落调整。',

        visible() {
          return !this.isCanMove;
        }

      }), _dec10 = property({
        type: CCFloat,
        displayName: '石板/承载物高度偏移',
        tooltip: 'wallNode 相对武器模型的高度偏移，用于让承载物跟随武器上下浮动。'
      }), _dec(_class = (_class2 = class ArmsInfo {
        constructor() {
          _initializerDefineProperty(this, "armsType", _descriptor, this);

          _initializerDefineProperty(this, "fbx", _descriptor2, this);

          _initializerDefineProperty(this, "tireCount", _descriptor3, this);

          _initializerDefineProperty(this, "hp", _descriptor4, this);

          _initializerDefineProperty(this, "moveCount", _descriptor5, this);

          _initializerDefineProperty(this, "isCanMove", _descriptor6, this);

          _initializerDefineProperty(this, "canHeight", _descriptor7, this);

          _initializerDefineProperty(this, "canTireCount", _descriptor8, this);

          _initializerDefineProperty(this, "wallHeight", _descriptor9, this);

          this.runtimeVisualRoot = null;
          this.weaponBulletConfigIndex = -1;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "armsType", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
            error: Error()
          }), ArmsTypeEnum) : ArmsTypeEnum).bq;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "fbx", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "tireCount", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "hp", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "moveCount", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "isCanMove", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "canHeight", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "canTireCount", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "wallHeight", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.5;
        }
      })), _class2)) || _class));

      _export("PropArms", PropArms = (_dec11 = ccclass('PropArms'), _dec12 = property({
        type: ArmsInfo,
        displayName: '武器阶段列表',
        tooltip: '每一项代表一个武器阶段。受击死亡后会切到下一阶段或触发武器飞向主角。'
      }), _dec13 = property({
        type: Label,
        displayName: '血量文本',
        tooltip: '显示当前阶段剩余血量的 Label。'
      }), _dec14 = property({
        type: Vec3,
        displayName: '底座/滚筒缩放',
        tooltip: '运行时生成的底座/滚筒资源缩放。当前临时资源是 tire.prefab。'
      }), _dec15 = property({
        type: CCFloat,
        displayName: '底座/滚筒间距',
        tooltip: '多个底座/滚筒上下叠放时的 Y 轴间距。'
      }), _dec16 = property({
        type: CCFloat,
        displayName: '油桶视觉X微调',
        tooltip: '只微调油桶模型子节点的 X，不移动血量、受击中心和根节点。正值向右，负值向左。'
      }), _dec17 = property({
        type: CCFloat,
        displayName: '油桶滚动速度',
        tooltip: '油桶随前进位移产生的旋转角度倍率，只影响滚动动效，不影响油桶本体移动速度。'
      }), _dec18 = property({
        type: CCFloat,
        displayName: '受击弹跳高度',
        tooltip: '底座/滚筒被打掉后，剩余底座和武器模型的弹跳高度。'
      }), _dec19 = property({
        type: CCFloat,
        displayName: '波次前方间距',
        tooltip: '多阶段武器跟随怪物波次刷新时，出现在最前方怪物前面的距离。'
      }), _dec20 = property({
        type: CCFloat,
        displayName: '下一阶段延迟',
        tooltip: '当前阶段死亡后，生成下一阶段武器前等待的时间。'
      }), _dec21 = property({
        type: CCFloat,
        displayName: '动画速度倍率',
        tooltip: '受击、底座消失、拉链收拢等动画的速度倍率。数值越大动画越慢。'
      }), _dec22 = property({
        type: CCFloat,
        displayName: '武器图片受击放大倍率',
        tooltip: '油桶受击时 weapon 图片先放大的倍率。'
      }), _dec23 = property({
        type: CCFloat,
        displayName: '武器图片受击压缩倍率',
        tooltip: '油桶受击时 weapon 图片回弹压缩的倍率。'
      }), _dec24 = property({
        type: Node,
        displayName: '石板/承载节点',
        tooltip: '武器下方跟随抬升、死亡后下砸的承载节点。没有该节点时只触发武器完成事件。'
      }), _dec25 = property({
        type: CCInteger,
        displayName: 'Lalian节点数量(0=全部)',
        tooltip: '拉链模式下使用的 Node 数量。填 0 表示使用 Lalian 下已有的全部节点。'
      }), _dec26 = property({
        type: CCFloat,
        displayName: 'Lalian节点Z间距',
        tooltip: '需要自动补足 Lalian 节点时，新节点之间的 Z 轴间距。'
      }), _dec27 = property({
        type: CCFloat,
        displayName: 'Lalian收拢X',
        tooltip: '拉链子节点最终靠拢到中心时保留的 X 轴距离，例如左右最终为 +/-0.1。'
      }), _dec28 = property({
        type: CCInteger,
        displayName: 'Lalian完成移动数量(0=节点数)',
        tooltip: '拉链全部打完后放出的 +1/+99 数量。填 0 表示使用拉链节点数量。'
      }), _dec29 = property({
        type: Vec3,
        displayName: '石板跳跃位置',
        tooltip: '预留字段：石板/承载节点跳跃时使用的位置参数。当前主要逻辑不依赖它。'
      }), _dec30 = property({
        type: Node,
        displayName: '石板落地特效',
        tooltip: '石板/承载节点死亡下砸落地时播放的特效节点。'
      }), _dec31 = property({
        type: CCFloat,
        displayName: '承载物浮动速度',
        tooltip: '武器存活时，石板/承载节点上下浮动的速度。'
      }), _dec32 = property({
        type: CCFloat,
        displayName: '承载物浮动幅度',
        tooltip: '武器存活时，石板/承载节点上下浮动的高度幅度。'
      }), _dec11(_class4 = (_class5 = (_class6 = class PropArms extends (_crd && BattleTarget3D === void 0 ? (_reportPossibleCrUseOfBattleTarget3D({
        error: Error()
      }), BattleTarget3D) : BattleTarget3D) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "armsInfoList", _descriptor10, this);

          _initializerDefineProperty(this, "hpLabel", _descriptor11, this);

          this._curArms = void 0;
          this.tireList = [];
          this.lalianNode = null;
          this.lalianCube = null;
          this.lalianSegments = [];
          this.lalianSegmentChildStartPos = [];
          this.lalianHitIndex = 0;
          this.lalianSegmentHitStep = 0;
          this.lalianCubeStartScale = new Vec3(1, 1, 1);
          this.lalianAnimating = false;
          this.lalianFinished = false;
          this.hasLalian = false;
          this._level = 0;
          this._curArmsUsesSpriteVisual = false;
          this._curArmsSpriteTargetY = 0;
          this._isShake = false;
          this._initialTireCount = 0;

          /** 非销毁受击的_isShake冷却 */
          this._shakeCooldown = 0;

          /** 轮胎弹跳动画数据（销毁时触发，每帧手动计算） */
          this._tireBounceStartY = [];
          this._tireBounceTargetY = [];
          this._tireBounceH = [];
          this._tireBounceTimer = -1;

          _initializerDefineProperty(this, "tireScale", _descriptor12, this);

          // private
          _initializerDefineProperty(this, "tireSpacing", _descriptor13, this);

          _initializerDefineProperty(this, "bottomBaseOffsetX", _descriptor14, this);

          _initializerDefineProperty(this, "bottomBaseRollDegreesPerUnit", _descriptor15, this);

          _initializerDefineProperty(this, "jumpHeight", _descriptor16, this);

          _initializerDefineProperty(this, "waveFrontGap", _descriptor17, this);

          _initializerDefineProperty(this, "nextStageDelay", _descriptor18, this);

          // @property(AttackParkPlay)
          // public effect: AttackParkPlay;
          _initializerDefineProperty(this, "animScale", _descriptor19, this);

          _initializerDefineProperty(this, "weaponHitScaleUp", _descriptor20, this);

          _initializerDefineProperty(this, "weaponHitScaleDown", _descriptor21, this);

          _initializerDefineProperty(this, "wallNode", _descriptor22, this);

          _initializerDefineProperty(this, "lalianNodeCount", _descriptor23, this);

          _initializerDefineProperty(this, "lalianNodeSpacingZ", _descriptor24, this);

          _initializerDefineProperty(this, "lalianCloseX", _descriptor25, this);

          _initializerDefineProperty(this, "lalianMoveCount", _descriptor26, this);

          _initializerDefineProperty(this, "jumpWallPos", _descriptor27, this);

          _initializerDefineProperty(this, "wallEffect", _descriptor28, this);

          this.bottomBasePrefab = (_crd && OtherPrefabsEnum === void 0 ? (_reportPossibleCrUseOfOtherPrefabsEnum({
            error: Error()
          }), OtherPrefabsEnum) : OtherPrefabsEnum).youtong;
          this.bottomBaseScaleMultiplier = 3.6;
          this.bottomBaseChildScaleMap = new Map();
          this.bottomBaseChildPosMap = new Map();
          this.bottomBaseChildEulerMap = new Map();
          this.bottomBaseTargetPosMap = new Map();
          this.weaponVisualScaleMap = new Map();
          this.weaponVisualHitPulseStateMap = new Map();
          this.manualBottomBaseNodeSet = new Set();
          this.bottomBaseRollAxis = new Vec3(0, 1, 0);
          this.roleTemplateBottomBasePos = new Vec3();
          this.roleTemplateArmsPos = new Vec3();
          this.tempBottomBaseTargetPos = new Vec3();
          this.roleTemplateLayoutLoaded = false;
          this.hasRoleTemplateLayout = false;
          this.bottomBaseRollAngle = 0;
          this.lastBottomBaseWorldZ = 0;
          this.hasLastBottomBaseWorldZ = false;
          this.oilHitFlashRecords = [];
          this.oilHitFlashState = null;

          _initializerDefineProperty(this, "speed", _descriptor29, this);

          _initializerDefineProperty(this, "h", _descriptor30, this);

          this._time = 0;
          this.isWallH = false;
          this._pendingWaveStageCount = 0;
          this._isStageAlive = false;
          this._stageSpawnPos = new Vec3();
          this._fixedStageIndex = -1;
          this._disableWaveStageChain = false;
        }

        static prepareSpriteWeaponVisual(root) {
          if (!root) {
            return false;
          }

          var spriteNodes = [];
          PropArms.collectNodesByName(root, PropArms.spriteWeaponVisualName, spriteNodes);

          if (spriteNodes.length <= 0) {
            return false;
          }

          for (var i = 0; i < spriteNodes.length; i++) {
            var spriteNode = spriteNodes[i];
            spriteNode.active = true;
            spriteNode.layer = root.layer;
          }

          var modelNodes = [];
          PropArms.collectNodesByName(root, PropArms.modelWeaponVisualName, modelNodes);

          for (var _i = 0; _i < modelNodes.length; _i++) {
            var modelNode = modelNodes[_i];

            if (!PropArms.isAncestorOfAny(modelNode, spriteNodes)) {
              modelNode.active = false;
            }
          }

          return true;
        }

        static collectNodesByName(root, name, out) {
          if (!root) {
            return;
          }

          if (root.name === name) {
            out.push(root);
          }

          for (var i = 0; i < root.children.length; i++) {
            PropArms.collectNodesByName(root.children[i], name, out);
          }
        }

        static getWeaponPickupVisualRoot(root) {
          if (!root) {
            return null;
          }

          var nodes = [];
          PropArms.collectNodesByName(root, PropArms.weaponPickupVisualName, nodes);
          return nodes.length > 0 ? nodes[0] : null;
        }

        static isAncestorOfAny(node, targets) {
          for (var i = 0; i < targets.length; i++) {
            var target = targets[i];

            while (target) {
              if (target === node) {
                return true;
              }

              target = target.parent;
            }
          }

          return false;
        }

        hasNodeByName(root, name) {
          if (!root) {
            return false;
          }

          if (root.name === name) {
            return true;
          }

          for (var i = 0; i < root.children.length; i++) {
            if (this.hasNodeByName(root.children[i], name)) {
              return true;
            }
          }

          return false;
        }

        // @property(Node)
        // public effect_ss: Node;
        get hitNode() {
          if (this.hasLalian && this.lalianCube && this.lalianCube.isValid) {
            return this.lalianCube;
          }

          return super.hitNode;
        }

        damage(power) {
          if (this.hasLalian) {
            this.playLalianHit();
            return;
          } // 轮胎销毁不受_isShake阻塞


          var hpRatio = this.curHp / this.MaxHp;
          var shouldRemain = Math.max(0, Math.ceil(hpRatio * this._initialTireCount));

          if (this.tireList.length > shouldRemain) {
            this.destroyOneTire();
            this.playOilBarrelHitFlash();
          } else if (!this._isShake && this.tireList.length > 0) {
            // 没销毁轮胎：所有轮胎波浪缩放+闪红
            this._isShake = true;
            this.playOilBarrelHitFlash();

            this._playBottomTireHit();

            (_crd && TweenTool === void 0 ? (_reportPossibleCrUseOfTweenTool({
              error: Error()
            }), TweenTool) : TweenTool).scaleShake(this.hpLabel.node);
          } else {
            this.playOilBarrelHitFlash();
          }

          this.hpLabel.string = Math.round(this.curHp).toString();
        }

        flashRed(duration, flashColor, ground) {
          if (duration === void 0) {
            duration = 0.15;
          }

          if (flashColor === void 0) {
            flashColor = null;
          }

          if (ground === void 0) {
            ground = null;
          }

          (_crd && FlashRedManager === void 0 ? (_reportPossibleCrUseOfFlashRedManager({
            error: Error()
          }), FlashRedManager) : FlashRedManager).instance.flashRed(this.node, this.meshFlashDataList, duration, flashColor, ground);
        }

        die() {
          var _instance,
              _this = this;

          this._isShake = false;
          this.clearWeaponVisualHitPulseState();
          this.restoreOilHitFlashMaterials();
          (_crd && FlashRedManager === void 0 ? (_reportPossibleCrUseOfFlashRedManager({
            error: Error()
          }), FlashRedManager) : FlashRedManager).instance.stopFlashRed(this.node);
          (_crd && BulletMonsterCollisionManager === void 0 ? (_reportPossibleCrUseOfBulletMonsterCollisionManager({
            error: Error()
          }), BulletMonsterCollisionManager) : BulletMonsterCollisionManager).instance.unregisterTarget(this);
          (_instance = (_crd && CameraMove === void 0 ? (_reportPossibleCrUseOfCameraMove({
            error: Error()
          }), CameraMove) : CameraMove).instance) == null || _instance.Shake2(0.8); // 轮胎依次破碎消失

          var destroyTireCount = this.tireList.length;

          var _loop = function _loop() {
            var tire = _this.tireList[i];
            Tween.stopAllByTarget(tire);

            var prefabBurstDuration = _this.playBottomBasePrefabBurst(tire, i);

            var oilBurstRecords = prefabBurstDuration > 0 ? [] : _this.createOilBurstMaterialRecords(tire);

            if (prefabBurstDuration <= 0) {
              _this.spawnOilBurstShards(tire, oilBurstRecords, i);
            }

            if (oilBurstRecords.length > 0) {
              var burstState = {
                progress: 0
              };
              var delay = i * PropArms.oilBurstDestroyDelayStep;

              _this.applyOilBurstProgress(oilBurstRecords, 0.95);

              tween(burstState).delay(delay).to(PropArms.oilBurstDestroyDuration, {
                progress: 1
              }, {
                onUpdate: target => {
                  _this.applyOilBurstProgress(oilBurstRecords, 0.95 + target.progress * 0.05);
                }
              }).start();
            }

            if (prefabBurstDuration > 0) {
              tween(tire).delay(prefabBurstDuration).call(() => {
                _this.releaseBottomBase(tire);
              }).start();
            } else {
              tween(tire).delay(i * PropArms.oilBurstDestroyDelayStep).to(PropArms.oilBurstDestroyDuration, {
                scale: _this.getBottomBaseRootScale(tire, PropArms.oilBurstDestroyScale)
              }, {
                easing: 'sineOut'
              }).call(() => {
                _this.restoreOilBurstMaterials(oilBurstRecords);

                _this.releaseBottomBase(tire);
              }).start();
            }
          };

          for (var i = 0; i < this.tireList.length; i++) {
            _loop();
          }

          this.tireList = [];
          this.hpLabel.string = "";
          Tween.stopAllByTarget(this.getCurrentArmsVisualRoot(this._curArms)); // const time = this._curArms.fbx.setAnimation(AnimArms.up_out, false).duration;
          // const halfTime = time * 0.5;
          // FBX动画结束后切回idle，发送全局事件让人跳走
          // this.scheduleOnce(() => {

          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).PROP_ARMS_DIE, this._curArms); // this._curArms.fbx.setAnimation(AnimArms.up_ju, true);

          this._isStageAlive = false; // }, time * 0.8);

          if (!this.wallNode) {
            this.node.emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
              error: Error()
            }), EventType) : EventType).PROP_ARMS_DIE, this._curArms);
            this.queueTrySpawnNextStage();

            if (this._disableWaveStageChain) {
              var activeDestroyDelay = 0.3 * this.animScale;
              var batchDestroyDelay = (destroyTireCount - 1) * PropArms.oilBurstDestroyDelayStep + Math.max(PropArms.oilBurstDestroyDuration, PropArms.oilBurstShardDuration + 0.08);
              var hideDelay = Math.max(0.01, activeDestroyDelay, batchDestroyDelay);
              this.scheduleOnce(() => {
                this.node.active = false;
              }, hideDelay);
            }

            return;
          } // 石板三段式动画：抛起→人跳走→落下砸地


          tween(this.wallNode) // .delay(halfTime)
          .call(() => {
            var _this$getCurrentArmsV, _this$getCurrentArmsV2, _this$_curArms;

            this.isWallH = false; // 锁定到浮动基准中心，消除sin相位差异

            var baseY = ((_this$getCurrentArmsV = (_this$getCurrentArmsV2 = this.getCurrentArmsVisualRoot(this._curArms)) == null ? void 0 : _this$getCurrentArmsV2.y) != null ? _this$getCurrentArmsV : 0) + ((_this$_curArms = this._curArms) == null ? void 0 : _this$_curArms.wallHeight);
            this.wallNode.y = baseY; // 运行时捕获位置

            var throwY = this.wallNode.y + 3;
            var groundY = 0.862;
            tween(this.wallNode).to(0.3, {
              y: throwY
            }, {
              easing: 'sineOut'
            }).to(0.4, {
              y: groundY
            }, {
              easing: 'sineIn'
            }).call(() => {
              this.node.emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
                error: Error()
              }), EventType) : EventType).PROP_ARMS_DIE, this._curArms);
              this.queueTrySpawnNextStage();
              (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
                error: Error()
              }), EventManager) : EventManager).instance.emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
                error: Error()
              }), EventType) : EventType).MONSTER_SKILL_XRD, this.wallNode.worldPositionX, 6, this._curArms.moveCount / 8 * 3.5);
              (_crd && CameraMove === void 0 ? (_reportPossibleCrUseOfCameraMove({
                error: Error()
              }), CameraMove) : CameraMove).instance.Shake2(2);
              (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
                error: Error()
              }), AudioManager) : AudioManager).inst.playOneShot((_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
                error: Error()
              }), SoundEnum) : SoundEnum).Sound_downST);

              if (this.wallEffect) {
                this.wallEffect.active = true;

                for (var _i2 = 0; _i2 < this.wallEffect.children.length; _i2++) {
                  var _this$wallEffect$chil;

                  (_this$wallEffect$chil = this.wallEffect.children[_i2].getComponent(_crd && AttackParkPlay === void 0 ? (_reportPossibleCrUseOfAttackParkPlay({
                    error: Error()
                  }), AttackParkPlay) : AttackParkPlay)) == null || _this$wallEffect$chil.play();
                }
              }

              this.isWallH = false;

              if (this._disableWaveStageChain) {
                this.node.active = false;
              } // this.effect_ss.active = true;
              // for (let i = 0; i < this.effect_ss.children.length; i++) {
              //     const e = this.effect_ss.children[i].getComponent(AttackParkPlay);
              //     e.play();
              // }

            }).start();
          }).start();
        }
        /** 正常受击：所有轮胎依次延迟播放松缩放（放大→回弹→恢复） */


        _playBottomTireHit() {
          var _this2 = this;

          if (this.tireList.length <= 0) return;
          (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).inst.playOneShot((_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
            error: Error()
          }), SoundEnum) : SoundEnum).Sound_tire_hit, 0.4, 0.08);
          var staggerDelay = 0.05;
          var lastIdx = this.tireList.length - 1;

          var _loop2 = function _loop2() {
            var tire = _this2.tireList[i];
            Tween.stopAllByTarget(tire);

            _this2.resetBottomBaseRootScale(tire); // const s1 = PoolManager.instance.V3.set(Vec3.ONE);


            var s1 = _this2.getBottomBaseRootScale(tire);

            var s2 = _this2.getBottomBaseRootScale(tire, 1.08);

            var s3 = _this2.getBottomBaseRootScale(tire, 0.96); // s3.x = 0.8; s3.y = 0.8; s3.z = 0.8;


            var isLast = i >= lastIdx;
            tween(tire).delay(i * staggerDelay).to(0.08, {
              scale: s2
            }, {
              easing: 'cubicOut'
            }).to(0.08, {
              scale: s3
            }, {
              easing: 'cubicOut'
            }).to(0.08, {
              scale: s1
            }, {
              easing: 'backOut'
            }).call(() => {
              if (isLast) {
                _this2._isShake = false;
                _this2._shakeCooldown = 0;
              }
            }).start();
          };

          for (var i = 0; i < this.tireList.length; i++) {
            _loop2();
          }
        }

        playLalianHit() {
          var _this$hpLabel;

          if (this.lalianAnimating || this.lalianFinished) {
            this.curHp = Math.max(1, this.curHp);
            return;
          }

          if (!this.lalianSegments.length) {
            this.finishLalian();
            return;
          }

          var segment = this.lalianSegments[this.lalianHitIndex];
          var startPosList = this.lalianSegmentChildStartPos[this.lalianHitIndex];

          if (!segment || !startPosList) {
            this.finishLalian();
            return;
          }

          this.lalianAnimating = true;
          (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).inst.playOneShot((_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
            error: Error()
          }), SoundEnum) : SoundEnum).Sound_tire_hit, 0.4, 0.08);

          if ((_this$hpLabel = this.hpLabel) != null && _this$hpLabel.node) {
            (_crd && TweenTool === void 0 ? (_reportPossibleCrUseOfTweenTool({
              error: Error()
            }), TweenTool) : TweenTool).scaleShake(this.hpLabel.node);
          }

          this.flashRed();
          var duration = 0.12 * this.animScale;
          var progress = this.lalianSegmentHitStep === 0 ? 0.5 : 1;

          for (var i = 0; i < segment.children.length; i++) {
            var part = segment.children[i];
            var startPos = startPosList[i];

            if (!part || !startPos) {
              continue;
            }

            var targetX = startPos.x;

            if (Math.abs(startPos.x) > this.lalianCloseX) {
              var closeX = startPos.x > 0 ? this.lalianCloseX : -this.lalianCloseX;
              targetX = startPos.x + (closeX - startPos.x) * progress;
            }

            Tween.stopAllByTarget(part);
            tween(part).to(duration, {
              position: v3(targetX, startPos.y, startPos.z)
            }, {
              easing: 'cubicOut'
            }).start();
          }

          var segmentClosed = progress >= 1;

          if (segmentClosed) {
            this.lalianHitIndex++;
            this.lalianSegmentHitStep = 0;
          } else {
            this.lalianSegmentHitStep++;
          }

          var remain = Math.max(0, this.lalianSegments.length - this.lalianHitIndex);
          this.curHp = Math.max(1, remain);

          if (this.hpLabel) {
            this.hpLabel.string = Math.ceil(remain + (this.lalianSegmentHitStep > 0 ? 0.5 : 0)).toString();
          }

          var nextSegment = this.lalianSegments[this.lalianHitIndex];

          if (segmentClosed && this.lalianCube && nextSegment) {
            var cubePos = this.lalianCube.position;
            Tween.stopAllByTarget(this.lalianCube);
            tween(this.lalianCube).to(duration, {
              position: v3(cubePos.x, cubePos.y, nextSegment.position.z)
            }, {
              easing: 'cubicOut'
            }).start();
          }

          this.scheduleOnce(() => {
            this.lalianAnimating = false;

            if (segmentClosed && remain <= 0) {
              this.finishLalian();
            }
          }, duration);
        }

        finishLalian() {
          if (this.lalianFinished) {
            return;
          }

          this.lalianFinished = true;
          this.lalianAnimating = false;
          this.curHp = 1;
          this._isShake = false;
          this._isStageAlive = false;

          if (this.hpLabel) {
            this.hpLabel.string = "";
          }

          (_crd && BulletMonsterCollisionManager === void 0 ? (_reportPossibleCrUseOfBulletMonsterCollisionManager({
            error: Error()
          }), BulletMonsterCollisionManager) : BulletMonsterCollisionManager).instance.unregisterTarget(this);

          var emitFinish = () => {
            var _this$_curArms2;

            var armsInfo = (_this$_curArms2 = this._curArms) != null ? _this$_curArms2 : this.createLalianArmsInfo();
            (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
              error: Error()
            }), EventManager) : EventManager).instance.emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
              error: Error()
            }), EventType) : EventType).PROP_ARMS_DIE, armsInfo);
            this.node.emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
              error: Error()
            }), EventType) : EventType).PROP_ARMS_DIE, armsInfo);
            this.queueTrySpawnNextStage();

            if (this._disableWaveStageChain) {
              this.node.active = false;
            }
          };

          if (!this.lalianCube) {
            emitFinish();
            return;
          }

          Tween.stopAllByTarget(this.lalianCube);
          tween(this.lalianCube).to(0.08 * this.animScale, {
            scale: Vec3.ZERO
          }, {
            easing: 'sineIn'
          }).call(() => {
            this.lalianCube.active = false;
            this.lalianCube.setScale(this.lalianCubeStartScale);
            emitFinish();
          }).start();
        }

        createLalianArmsInfo() {
          var armsInfo = new ArmsInfo();
          armsInfo.moveCount = this.lalianMoveCount > 0 ? this.lalianMoveCount : this.lalianSegments.length;
          return armsInfo;
        }

        destroyOneTire() {
          var _instance2;

          var tire = this.tireList.shift();
          if (!tire) return; // 停止残留缩放动画并重置到原始大小

          this.restoreOilHitFlashMaterials();
          Tween.stopAllByTarget(tire);
          this.resetBottomBaseRootScale(tire); // 捕获被销毁轮胎的MeshRenderer（flashRed是延迟应用的，必须在更新mesh引用前捕获）

          var oldMR = this.meshFlashDataList[0].meshRender; // 更新底部轮胎mesh引用

          if (this.tireList.length) {
            var tireMeshRenderer = this.findFirstMeshRenderer(this.tireList[0]);

            if (tireMeshRenderer) {
              this.meshFlashDataList[0].meshRender = tireMeshRenderer;
            }
          }

          (_crd && FlashRedManager === void 0 ? (_reportPossibleCrUseOfFlashRedManager({
            error: Error()
          }), FlashRedManager) : FlashRedManager).instance.stopFlashRed(this.node);
          (_instance2 = (_crd && CameraMove === void 0 ? (_reportPossibleCrUseOfCameraMove({
            error: Error()
          }), CameraMove) : CameraMove).instance) == null || _instance2.Shake2(0.8); // 用旧引用闪红被销毁的轮胎（传独立数组，避免延迟应用时被新引用覆盖）

          var prefabBurstDuration = this.playBottomBasePrefabBurst(tire, 0);
          var oilBurstRecords = prefabBurstDuration > 0 ? [] : this.createOilBurstMaterialRecords(tire);

          if (prefabBurstDuration <= 0) {
            this.spawnOilBurstShards(tire, oilBurstRecords, 0);
          }

          if (prefabBurstDuration <= 0 && oilBurstRecords.length <= 0 && oldMR && oldMR.isValid) {
            (_crd && FlashRedManager === void 0 ? (_reportPossibleCrUseOfFlashRedManager({
              error: Error()
            }), FlashRedManager) : FlashRedManager).instance.flashRed(this.node, [{
              meshRender: oldMR,
              colorProps: this.meshFlashDataList[0].colorProps,
              switchProps: this.meshFlashDataList[0].switchProps
            }]);
          }

          (_crd && TweenTool === void 0 ? (_reportPossibleCrUseOfTweenTool({
            error: Error()
          }), TweenTool) : TweenTool).scaleShake(this.hpLabel.node); // 被销毁轮胎：果冻缩放→缩小消失

          var s2 = this.getBottomBaseRootScale(tire, PropArms.oilBurstDestroyScale);

          if (oilBurstRecords.length > 0) {
            var burstState = {
              progress: 0
            };
            this.applyOilBurstProgress(oilBurstRecords, 0.95);
            tween(burstState).to(0.18 * this.animScale, {
              progress: 1
            }, {
              onUpdate: target => {
                this.applyOilBurstProgress(oilBurstRecords, 0.95 + target.progress * 0.05);
              }
            }).start();
          }

          if (prefabBurstDuration > 0) {
            tween(tire).delay(prefabBurstDuration).call(() => {
              this.releaseBottomBase(tire);
              this._isShake = false;
            }).start();
          } else {
            tween(tire).to(0.18 * this.animScale, {
              scale: s2
            }, {
              easing: 'sineOut'
            }).call(() => {
              this.restoreOilBurstMaterials(oilBurstRecords);
              this.releaseBottomBase(tire);
              this._isShake = false;
            }).start();
          } // 剩余轮胎弹跳下落（上面的轮胎先跳再落）


          this._setupTireBounce(); // FBX弹跳一下


          Tween.stopAllByTarget(this.getCurrentArmsVisualRoot(this._curArms));
          var fbxNode = this.getCurrentArmsVisualRoot(this._curArms);
          if (!fbxNode) return;
          var delay = 0.05 + this.tireList.length * 0.05;
          var fbxY = fbxNode.y;
          var bounceH = this.jumpHeight + this.tireList.length * 0.1 * this.jumpHeight;
          var dropTargetY = this.getArmsTargetY(this.tireList.length);

          if (!this._curArms.isCanMove && this.tireList.length > this._curArms.canTireCount) {
            dropTargetY = fbxY;
          }

          tween(fbxNode).delay(delay).to(0.04 * this.animScale, {
            y: fbxY + bounceH
          }, {
            easing: 'sineOut'
          }).to(0.06 * this.animScale, {
            y: dropTargetY
          }, {
            easing: 'quadIn'
          }).start();
          (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).inst.playOneShot((_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
            error: Error()
          }), SoundEnum) : SoundEnum).sound_met_die); // this.effect.node.active = true;
          // this.effect?.play();
        }
        /** 记录当前所有轮胎位置，启动弹跳动画 */


        _setupTireBounce() {
          var len = this.tireList.length;
          this._tireBounceStartY.length = 0;
          this._tireBounceTargetY.length = 0;
          this._tireBounceH.length = 0;

          for (var i = 0; i < len; i++) {
            this._tireBounceStartY.push(this.tireList[i].position.y);

            this._tireBounceTargetY.push(this.getBottomBaseTargetPosition(i, this.tireList[i]).y);

            this._tireBounceH.push(this.jumpHeight + i * 0.1 * this.jumpHeight);
          }

          this._tireBounceTimer = 0;
        }
        /** 每帧：轮胎平滑插值到目标位置，销毁时先弹跳再落下 */


        _updateTireDrop(dt) {
          if (this._tireBounceTimer >= 0) {
            // 弹跳模式：先弹跳再落到新位置
            this._tireBounceTimer += dt;
            var bounceUp = 0.04 * this.animScale;
            var fallDown = 0.1 * this.animScale;
            var perDelay = 0.05;

            for (var i = 0; i < this.tireList.length && i < this._tireBounceStartY.length; i++) {
              var tire = this.tireList[i];
              var targetPos = this.getBottomBaseTargetPosition(i, tire);
              var targetX = targetPos.x;
              var targetZ = targetPos.z;
              var localT = this._tireBounceTimer - perDelay * i;
              if (localT <= 0) continue;

              if (localT < bounceUp) {
                var t = localT / bounceUp;
                tire.setPosition(targetX, this._tireBounceStartY[i] + this._tireBounceH[i] * Math.sin(t * Math.PI * 0.5), targetZ);
              } else if (localT < bounceUp + fallDown) {
                var _t = (localT - bounceUp) / fallDown;

                var peak = this._tireBounceStartY[i] + this._tireBounceH[i];
                tire.setPosition(targetX, peak + (this._tireBounceTargetY[i] - peak) * (_t * _t), targetZ);
              } else {
                tire.setPosition(targetX, this._tireBounceTargetY[i], targetZ);
              }
            }

            if (this._tireBounceTimer > perDelay * this.tireList.length + bounceUp + fallDown) {
              this._tireBounceTimer = -1;
            }
          } else {
            // 平滑插值模式
            for (var _i3 = 0; _i3 < this.tireList.length; _i3++) {
              var _tire = this.tireList[_i3];

              var _targetPos = this.getBottomBaseTargetPosition(_i3, _tire);

              var targetY = _targetPos.y;
              var _targetX = _targetPos.x;
              var _targetZ = _targetPos.z;
              var curY = _tire.position.y;
              var diff = targetY - curY;

              if (Math.abs(diff) > 0.001) {
                _tire.setPosition(_targetX, curY + diff * Math.min(1, dt * 8), _targetZ);
              } else {
                _tire.setPosition(_targetX, targetY, _targetZ);
              }
            }
          }
        }

        init(count) {
          if (count === void 0) {
            count = 0;
          }

          this._level += count;

          if (this.armsInfoList.length <= 0) {
            this.initLalianOnly();
            return;
          }

          if (this._level >= this.armsInfoList.length) {
            this._isStageAlive = false;
            this.node.active = false;
          } else {
            this.loadRoleTemplateLayout();

            for (var i = 0; i < this.armsInfoList.length; i++) {
              var arms = this.armsInfoList[i];

              var _visualRoot = this.getCurrentArmsVisualRoot(arms);

              if (_visualRoot) {
                _visualRoot.active = i === this._level;
              }
            }

            this._curArms = this.armsInfoList[this._level];
            this._curArms.weaponBulletConfigIndex = this._level;
            var currentArms = this._curArms;
            var visualRoot = this.getCurrentArmsVisualRoot(currentArms);

            if (!currentArms || !visualRoot) {
              this._isStageAlive = false;
              return;
            }

            this._curArmsUsesSpriteVisual = this.hasNodeByName(visualRoot, PropArms.weaponPickupVisualName) || this.hasNodeByName(visualRoot, PropArms.spriteWeaponVisualName);
            this._curArmsSpriteTargetY = visualRoot.y;
            this._isStageAlive = true;
            this.clearWeaponVisualHitPulseState();
            this.cacheWeaponVisualOriginalScales(visualRoot);
            this.initLalian();
            var tireSpacing = this.tireSpacing;
            var wallHeight = currentArms.wallHeight;
            var tireCount = this.hasLalian ? 0 : currentArms.tireCount;
            var manualBottomBases = !this.hasLalian ? this.collectManualBottomBases(tireCount) : [];
            this.initHp(currentArms.hp);

            if (this.hasLalian) {
              this.MaxHp = Math.max(1, this.lalianSegments.length * 2);
              this.curHp = this.MaxHp;
            }

            this.hpLabel.string = Math.round(this.MaxHp).toString(); // 保存hpLabel原始缩放（用number避免GC），动画期间隐藏

            var hpS = this.hpLabel.node.scale;
            var hplSx = hpS.x,
                hplSy = hpS.y,
                hplSz = hpS.z;
            this.hpLabel.node.setScale(0, 0, 0); // 保存FBX原始scale（复用PoolManager的V3避免GC）

            var scale = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.V3.set(visualRoot.scale); // 初始位置: FBX在地下

            if (this.hasRoleTemplateLayout) {
              visualRoot.setPosition(this.roleTemplateArmsPos.x, -1, this.roleTemplateArmsPos.z);
            } else {
              visualRoot.y = -1;
            }

            visualRoot.setScale(Vec3.ZERO);
            this.playArmsFbxAnimation(currentArms, AnimArms.idle, true);
            this.isWallH = false;
            this.resetBottomBaseRollState(); // 生成所有轮胎（起始在地底）

            if (!this.hasLalian) {
              for (var _i4 = 0; _i4 < tireCount; _i4++) {
                var _manualBottomBases$_i;

                var tire = (_manualBottomBases$_i = manualBottomBases[_i4]) != null ? _manualBottomBases$_i : this.tire;
                this.tireList.push(tire);

                if (tire.parent !== this.node) {
                  this.node.addChild(tire);
                }

                var tireTargetPos = this.getBottomBaseTargetPosition(_i4, tire);
                tire.setPosition(tireTargetPos.x, tireTargetPos.y - tireSpacing, tireTargetPos.z);

                if (!_i4) {
                  var tireMeshRenderer = this.findFirstMeshRenderer(tire);

                  if (tireMeshRenderer) {
                    this.meshFlashDataList[0].meshRender = tireMeshRenderer;
                  }
                }
              }
            }

            this._initialTireCount = this.tireList.length; // Phase 1: FBX从地底快速升起

            var phase1Delay = 0.05;
            var phase1RiseTime = 0.05;
            var fbxPhase1TargetY;
            var wallPhase1TargetY;
            var needTireLift;

            if (currentArms.isCanMove) {
              fbxPhase1TargetY = this.getArmsTargetY(0);
              wallPhase1TargetY = fbxPhase1TargetY + wallHeight;
              needTireLift = true;
            } else {
              fbxPhase1TargetY = this.hasRoleTemplateLayout ? this.getArmsTargetY(0) : currentArms.canHeight;
              wallPhase1TargetY = fbxPhase1TargetY + wallHeight;
              needTireLift = false;
            } // FBX快速升起


            tween(visualRoot).delay(phase1Delay).call(() => {
              this.playArmsFbxAnimation(currentArms, AnimArms.up_ju, true);
            }).to(phase1RiseTime, {
              y: fbxPhase1TargetY,
              scale: scale
            }, {
              easing: "backOut"
            }).start(); // wallNode跟随FBX升起

            if (this.wallNode) {
              tween(this.wallNode).delay(phase1Delay).to(phase1RiseTime, {
                y: wallPhase1TargetY
              }, {
                easing: "backOut"
              }).start();
            } // Phase 2: 轮胎从地底依次升起，把FBX顶上去


            var tireStartDelay = phase1Delay + phase1RiseTime + 0.02;
            var tireRiseTime = 0.1;
            var tireInterval = 0.08;

            for (var _i5 = 0; _i5 < tireCount; _i5++) {
              var _tire2 = this.tireList[_i5];

              var _tireTargetPos = this.getBottomBaseTargetPosition(_i5, _tire2);

              var tireDelay = tireStartDelay + _i5 * tireInterval; // 轮胎升起

              tween(_tire2).delay(tireDelay).to(tireRiseTime, {
                position: _tireTargetPos.clone()
              }, {
                easing: "backOut"
              }).start();

              if (needTireLift) {
                // FBX被顶起：轮胎先升起一点再顶FBX
                var liftDelay = tireDelay - 0.02;
                var liftTime = 0.08;
                var targetFbxY = this.getArmsTargetY(_i5 + 1);
                var targetWallY = targetFbxY + wallHeight;
                tween(visualRoot).delay(liftDelay).to(liftTime, {
                  y: targetFbxY
                }, {
                  easing: "backOut"
                }).start();

                if (this.wallNode) {
                  tween(this.wallNode).delay(liftDelay).to(liftTime, {
                    y: targetWallY
                  }, {
                    easing: "backOut"
                  }).start();
                }
              }
            } // 计算总动画时长，结束后统一处理


            var totalTime = this.hasLalian ? phase1Delay + phase1RiseTime + 0.05 : tireStartDelay + (tireCount - 1) * tireInterval + tireRiseTime + 0.05;
            this.scheduleOnce(() => {
              if (this._curArms === currentArms) {
                this.playArmsFbxAnimation(currentArms, AnimArms.idle, true);
              }

              this.hpLabel.node.setScale(hplSx, hplSy, hplSz);
              (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.V3 = scale;
              (_crd && BulletMonsterCollisionManager === void 0 ? (_reportPossibleCrUseOfBulletMonsterCollisionManager({
                error: Error()
              }), BulletMonsterCollisionManager) : BulletMonsterCollisionManager).instance.registerTarget(this);
              this.isWallH = true;
            }, totalTime);
          }
        }

        initLalianOnly() {// 预留给已废弃/外部兼容的空配置分支，当前版本不再在这里生成拉链逻辑。
        }

        get tire() {
          var tire = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPool(this.bottomBasePoolKey);

          if (!tire) {
            tire = (_crd && PrefabsManager === void 0 ? (_reportPossibleCrUseOfPrefabsManager({
              error: Error()
            }), PrefabsManager) : PrefabsManager).instance.GetPrefabsIns((_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
              error: Error()
            }), PrefabsEnum) : PrefabsEnum).other, this.bottomBasePrefab);
          }

          tire.active = true;
          this.resetBottomBaseBurstVisual(tire);
          this.getBottomBaseOriginalEuler(tire);
          tire.setScale(Vec3.ONE); // Set tire scale to one

          tire.eulerAngles = this.getBottomBaseOriginalEuler(tire);
          this.applyBottomBaseVisualTransform(tire);
          this.fitBottomBaseVisualXToRoot(tire);
          this.applyBottomBaseRoll(tire);
          return tire;
        }

        get bottomBasePoolKey() {
          return (_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).Other + this.bottomBasePrefab;
        }

        collectManualBottomBases(maxCount) {
          var result = [];
          var roleNode = this.getCurrentArmsVisualRoot(this._curArms);

          if (roleNode) {
            this.collectBottomBaseNodes(roleNode, result, true);
          }

          if (result.length <= 0) {
            this.collectBottomBaseNodes(this.node, result, false);
          }

          result.sort((a, b) => a.worldPosition.y - b.worldPosition.y);
          var count = maxCount > 0 ? Math.min(maxCount, result.length) : result.length;
          var selected = result.slice(0, count);

          for (var i = 0; i < selected.length; i++) {
            var node = selected[i];
            Tween.stopAllByTarget(node);
            node.active = true;
            this.resetBottomBaseBurstVisual(node);

            if (node.parent !== this.node) {
              node.setParent(this.node, true);
            }

            this.manualBottomBaseNodeSet.add(node);
            this.getBottomBaseOriginalScale(node);
            this.getBottomBaseOriginalPos(node);
            this.getBottomBaseOriginalEuler(node);
            this.bottomBaseTargetPosMap.set(node, node.position.clone());
          }

          return selected;
        }

        collectBottomBaseNodes(root, out, recursive) {
          if (!root) {
            return;
          }

          for (var i = 0; i < root.children.length; i++) {
            var child = root.children[i];

            if (!child.active) {
              continue;
            }

            if (this.isBottomBaseNode(child)) {
              if (out.indexOf(child) === -1) {
                out.push(child);
              }

              continue;
            }

            if (recursive) {
              this.collectBottomBaseNodes(child, out, recursive);
            }
          }
        }

        isBottomBaseNode(node) {
          if (!node) {
            return false;
          }

          var name = node.name.toLowerCase();
          return name.indexOf("youtong") >= 0 || name.indexOf("oil") >= 0;
        }

        getBottomBaseRootScale(node, x, y, z) {
          if (x === void 0) {
            x = 1;
          }

          if (y === void 0) {
            y = x;
          }

          if (z === void 0) {
            z = x;
          }

          var original = this.getBottomBaseOriginalScale(node);
          return v3(original.x * x, original.y * y, original.z * z);
        }

        resetBottomBaseRootScale(node) {
          var original = this.getBottomBaseOriginalScale(node);
          node.setScale(original);
        }

        releaseBottomBase(node) {
          node.active = false;
          this.resetBottomBaseRootScale(node);
          this.resetBottomBaseBurstVisual(node);
          this.bottomBaseTargetPosMap.delete(node);

          if (this.manualBottomBaseNodeSet.has(node)) {
            this.manualBottomBaseNodeSet.delete(node);
            return;
          }

          (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.setPool(this.bottomBasePoolKey, node);
        }

        loadRoleTemplateLayout() {
          if (this.roleTemplateLayoutLoaded) {
            return;
          }

          this.roleTemplateLayoutLoaded = true;
          var root = this.node;

          while (root.parent) {
            root = root.parent;
          }

          var template = this.findNodeByName(root, "Role_t");

          if (!template || template === this.node || template.children.length < 2) {
            return;
          }

          var bottomBase = template.children[0];
          var arms = template.children[1];

          if (!bottomBase || !arms) {
            return;
          }

          this.roleTemplateBottomBasePos.set(bottomBase.position);
          this.roleTemplateArmsPos.set(arms.position);
          this.hasRoleTemplateLayout = true;
        }

        getBottomBaseTargetX() {
          this.loadRoleTemplateLayout();
          return this.hasRoleTemplateLayout ? this.roleTemplateBottomBasePos.x : 0;
        }

        getBottomBaseTargetY(index) {
          this.loadRoleTemplateLayout();

          if (this.hasRoleTemplateLayout) {
            return this.roleTemplateBottomBasePos.y + index * this.tireSpacing;
          }

          return index * this.tireSpacing;
        }

        getBottomBaseTargetZ() {
          this.loadRoleTemplateLayout();
          return this.hasRoleTemplateLayout ? this.roleTemplateBottomBasePos.z : 0;
        }

        getBottomBaseTargetPosition(index, node) {
          var nodeTarget = node ? this.bottomBaseTargetPosMap.get(node) : null;

          if (nodeTarget) {
            return this.tempBottomBaseTargetPos.set(nodeTarget);
          }

          return this.tempBottomBaseTargetPos.set(this.getBottomBaseTargetX(), this.getBottomBaseTargetY(index), this.getBottomBaseTargetZ());
        }

        getArmsTargetY(liftCount) {
          if (this._curArmsUsesSpriteVisual) {
            return this._curArmsSpriteTargetY;
          }

          this.loadRoleTemplateLayout();

          if (this.hasRoleTemplateLayout) {
            return this.roleTemplateArmsPos.y + Math.max(0, liftCount - 1) * this.tireSpacing;
          }

          return liftCount * this.tireSpacing;
        }

        playArmsFbxAnimation(arms, anim, loop) {
          var _PropArms$getWeaponPi, _arms$fbx;

          if (loop === void 0) {
            loop = true;
          }

          if (!arms || (_PropArms$getWeaponPi = PropArms.getWeaponPickupVisualRoot(arms.runtimeVisualRoot)) != null && _PropArms$getWeaponPi.isValid || !((_arms$fbx = arms.fbx) != null && (_arms$fbx = _arms$fbx.node) != null && _arms$fbx.isValid)) {
            return;
          }

          try {
            var state = arms.fbx.getAnimState(anim);

            if (!state) {
              return;
            }

            arms.fbx.setAnimation(anim, loop);
          } catch (_unused) {
            return;
          }
        }

        applyBottomBaseVisualTransform(node) {
          if (!node) {
            return;
          }

          if (node.children.length <= 0) {
            this.applyBottomBaseChildVisualTransform(node);
            return;
          }

          for (var i = 0; i < node.children.length; i++) {
            this.applyBottomBaseChildVisualTransform(node.children[i]);
          }
        }

        applyBottomBaseChildVisualTransform(node) {
          var originalScale = this.getBottomBaseOriginalScale(node);
          var originalPos = this.getBottomBaseOriginalPos(node);
          var originalEuler = this.getBottomBaseOriginalEuler(node);
          node.setScale(originalScale.x * this.tireScale.x * this.bottomBaseScaleMultiplier, originalScale.y * this.tireScale.y * this.bottomBaseScaleMultiplier, originalScale.z * this.tireScale.z * this.bottomBaseScaleMultiplier);
          node.setPosition(originalPos);
          node.eulerAngles = originalEuler;
        }

        getBottomBaseOriginalScale(node) {
          var originalScale = this.bottomBaseChildScaleMap.get(node);

          if (!originalScale) {
            originalScale = node.scale.clone();
            this.bottomBaseChildScaleMap.set(node, originalScale);
          }

          return originalScale;
        }

        getWeaponVisualOriginalScale(node) {
          var originalScale = this.weaponVisualScaleMap.get(node);

          if (!originalScale) {
            originalScale = node.scale.clone();
            this.weaponVisualScaleMap.set(node, originalScale);
          }

          return originalScale;
        }

        cacheWeaponVisualOriginalScales(root) {
          if (!root) {
            return;
          }

          var spriteNodes = [];
          PropArms.collectNodesByName(root, PropArms.weaponPickupVisualName, spriteNodes);
          PropArms.collectNodesByName(root, PropArms.spriteWeaponVisualName, spriteNodes);

          for (var i = 0; i < spriteNodes.length; i++) {
            var spriteNode = spriteNodes[i];

            if (!(spriteNode != null && spriteNode.isValid)) {
              continue;
            }

            this.weaponVisualScaleMap.set(spriteNode, spriteNode.scale.clone());
          }
        }

        clearWeaponVisualHitPulseState(resetScale) {
          if (resetScale === void 0) {
            resetScale = true;
          }

          this.weaponVisualHitPulseStateMap.forEach((_, node) => {
            if (!(node != null && node.isValid)) {
              return;
            }

            Tween.stopAllByTarget(node);

            if (resetScale) {
              node.setScale(this.getWeaponVisualOriginalScale(node));
            }
          });
          this.weaponVisualHitPulseStateMap.clear();
        }

        updateWeaponVisualHitPulse(dt) {
          if (this.weaponVisualHitPulseStateMap.size <= 0) {
            return;
          }

          var finishedNodes = [];
          this.weaponVisualHitPulseStateMap.forEach((state, node) => {
            if (!(node != null && node.isValid) || !node.activeInHierarchy) {
              finishedNodes.push(node);
              return;
            }

            state.elapsed += dt;
            var originalScale = this.getWeaponVisualOriginalScale(node);
            var scaleUpRate = Math.max(1, this.weaponHitScaleUp);
            var scaleDownRate = Math.max(0.01, Math.min(scaleUpRate, this.weaponHitScaleDown));
            var rawT = Math.min(1, state.elapsed / Math.max(0.01, state.duration));
            var currentRate = 1;

            if (rawT < 0.35) {
              var segmentT = rawT / 0.35;
              var easedT = segmentT * segmentT * (3 - 2 * segmentT);
              currentRate = scaleDownRate + (scaleUpRate - scaleDownRate) * easedT;
            } else {
              var _segmentT = (rawT - 0.35) / 0.65;

              var _easedT = 1 - Math.pow(1 - _segmentT, 2);

              currentRate = scaleUpRate + (1 - scaleUpRate) * _easedT;
            }

            node.setScale(originalScale.x * currentRate, originalScale.y * currentRate, originalScale.z * currentRate);

            if (rawT >= 1) {
              node.setScale(originalScale);
              finishedNodes.push(node);
            }
          });

          for (var i = 0; i < finishedNodes.length; i++) {
            this.weaponVisualHitPulseStateMap.delete(finishedNodes[i]);
          }
        }

        getBottomBaseOriginalPos(node) {
          var originalPos = this.bottomBaseChildPosMap.get(node);

          if (!originalPos) {
            originalPos = node.position.clone();
            this.bottomBaseChildPosMap.set(node, originalPos);
          }

          return originalPos;
        }

        getBottomBaseOriginalEuler(node) {
          var originalEuler = this.bottomBaseChildEulerMap.get(node);

          if (!originalEuler) {
            originalEuler = node.eulerAngles.clone();
            this.bottomBaseChildEulerMap.set(node, originalEuler);
          }

          return originalEuler;
        }

        resetBottomBaseRollState() {
          this.bottomBaseRollAngle = 0;
          this.lastBottomBaseWorldZ = this.node.worldPositionZ;
          this.hasLastBottomBaseWorldZ = true;
        }

        updateBottomBaseRoll(dt) {
          if (this.tireList.length <= 0) {
            this.hasLastBottomBaseWorldZ = false;
            return;
          }

          var curWorldZ = this.node.worldPositionZ;
          var isGuideRollingOnly = !(_crd && MonsterCreate === void 0 ? (_reportPossibleCrUseOfMonsterCreate({
            error: Error()
          }), MonsterCreate) : MonsterCreate).isStartMove && (_crd && MoveDrive === void 0 ? (_reportPossibleCrUseOfMoveDrive({
            error: Error()
          }), MoveDrive) : MoveDrive).isGuideMoveOnly;

          if (!(_crd && MonsterCreate === void 0 ? (_reportPossibleCrUseOfMonsterCreate({
            error: Error()
          }), MonsterCreate) : MonsterCreate).isStartMove && !isGuideRollingOnly) {
            this.lastBottomBaseWorldZ = curWorldZ;
            this.hasLastBottomBaseWorldZ = true;
            return;
          }

          if (!this.hasLastBottomBaseWorldZ) {
            this.lastBottomBaseWorldZ = curWorldZ;
            this.hasLastBottomBaseWorldZ = true;
            return;
          }

          var deltaZ = curWorldZ - this.lastBottomBaseWorldZ;
          this.lastBottomBaseWorldZ = curWorldZ;

          if (isGuideRollingOnly) {
            var _instance$monsterSpee, _instance3;

            deltaZ = -Math.max(0, (_instance$monsterSpee = (_instance3 = (_crd && MonsterCreate === void 0 ? (_reportPossibleCrUseOfMonsterCreate({
              error: Error()
            }), MonsterCreate) : MonsterCreate).instance) == null ? void 0 : _instance3.monsterSpeed) != null ? _instance$monsterSpee : 0) * dt;
          }

          if (Math.abs(deltaZ) <= 0.0001) {
            return;
          }

          this.bottomBaseRollAngle += deltaZ * this.bottomBaseRollDegreesPerUnit;

          for (var i = 0; i < this.tireList.length; i++) {
            this.applyBottomBaseRoll(this.tireList[i]);
          }
        }

        applyBottomBaseRoll(node) {
          if (!node) {
            return;
          }

          if (node.children.length <= 0) {
            this.applyBottomBaseResourceRoll(node);
            return;
          }

          for (var i = 0; i < node.children.length; i++) {
            this.applyBottomBaseResourceRoll(node.children[i]);
          }
        }

        applyBottomBaseResourceRoll(node) {
          var originalEuler = this.getBottomBaseOriginalEuler(node);
          node.eulerAngles = v3(originalEuler.x + this.bottomBaseRollAxis.x * this.bottomBaseRollAngle, originalEuler.y + this.bottomBaseRollAxis.y * this.bottomBaseRollAngle, originalEuler.z + this.bottomBaseRollAxis.z * this.bottomBaseRollAngle);
        }

        fitBottomBaseVisualXToRoot(root) {
          if (!root || !root.activeInHierarchy) {
            return;
          }

          var centerX = this.getBottomBaseWorldCenterX(root);

          if (centerX === null) {
            return;
          }

          var deltaX = root.worldPositionX + this.bottomBaseOffsetX - centerX;

          if (Math.abs(deltaX) <= 0.001) {
            return;
          }

          var rootScale = root.worldScale;
          var localDeltaX = deltaX / (rootScale.x || 1);

          if (root.children.length <= 0) {
            root.setPosition(root.position.x + localDeltaX, root.position.y, root.position.z);
            return;
          }

          for (var i = 0; i < root.children.length; i++) {
            var child = root.children[i];
            child.setPosition(child.position.x + localDeltaX, child.position.y, child.position.z);
          }
        }

        getBottomBaseWorldCenterX(root) {
          var minX = Number.POSITIVE_INFINITY;
          var maxX = Number.NEGATIVE_INFINITY;
          var found = false;
          var stack = [root];

          while (stack.length > 0) {
            var _model;

            var node = stack.pop();

            if (!node) {
              continue;
            }

            var meshRenderer = node.getComponent(MeshRenderer);
            var worldBounds = meshRenderer == null || (_model = meshRenderer.model) == null ? void 0 : _model.worldBounds;
            var center = worldBounds == null ? void 0 : worldBounds.center;
            var halfExtents = worldBounds == null ? void 0 : worldBounds.halfExtents;

            if (center && halfExtents) {
              minX = Math.min(minX, center.x - halfExtents.x);
              maxX = Math.max(maxX, center.x + halfExtents.x);
              found = true;
            }

            for (var i = 0; i < node.children.length; i++) {
              stack.push(node.children[i]);
            }
          }

          return found ? (minX + maxX) * 0.5 : null;
        }

        static preloadOilBurstMaterial() {
          if (PropArms.oilBurstMaterial || PropArms.oilBurstMaterialLoading) {
            return;
          }

          PropArms.oilBurstMaterialLoading = true;
          resources.load(PropArms.oilBurstMaterialPath, Material, (err, material) => {
            PropArms.oilBurstMaterialLoading = false;

            if (err || !material) {
              console.warn("[PropArms] load oil burst material failed: " + PropArms.oilBurstMaterialPath, err);
              return;
            }

            PropArms.oilBurstMaterial = material;
          });
        }

        static preloadOilHitFlashMaterial() {
          if (PropArms.oilHitFlashMaterial || PropArms.oilHitFlashMaterialLoading) {
            return;
          }

          PropArms.oilHitFlashMaterialLoading = true;
          resources.load(PropArms.oilHitFlashMaterialPath, Material, (err, material) => {
            PropArms.oilHitFlashMaterialLoading = false;

            if (err || !material) {
              console.warn("[PropArms] load oil hit flash material failed: " + PropArms.oilHitFlashMaterialPath, err);
              return;
            }

            PropArms.oilHitFlashMaterial = material;
          });
        }

        playOilBarrelHitFlash() {
          var _this$meshFlashDataLi;

          if (this.isDie) {
            return;
          }

          this.playSpriteWeaponHitScale(PropArms.oilHitFlashDuration);

          if (this.tireList.length <= 0 || !((_this$meshFlashDataLi = this.meshFlashDataList) != null && _this$meshFlashDataLi.length)) {
            return;
          }

          (_crd && FlashRedManager === void 0 ? (_reportPossibleCrUseOfFlashRedManager({
            error: Error()
          }), FlashRedManager) : FlashRedManager).instance.flashRed(this.node, this.getOilBarrelFlashDataList(), PropArms.oilHitFlashDuration, PropArms.oilHitFlashColor, "oilBarrel_Hit");
        }

        getOilBarrelFlashDataList() {
          var result = [];

          for (var i = 0; i < this.meshFlashDataList.length; i++) {
            var data = this.meshFlashDataList[i];

            if (!(data != null && data.meshRender)) {
              continue;
            }

            if (data.switchProps && data.switchProps.length > 0) {
              result.push(data);
              continue;
            }

            var flashData = new (_crd && MeshFlashData === void 0 ? (_reportPossibleCrUseOfMeshFlashData({
              error: Error()
            }), MeshFlashData) : MeshFlashData)();
            flashData.meshRender = data.meshRender;
            flashData.colorProps = data.colorProps ? [...data.colorProps] : [];
            var intensitySwitch = new (_crd && MeshFlashSwitchData === void 0 ? (_reportPossibleCrUseOfMeshFlashSwitchData({
              error: Error()
            }), MeshFlashSwitchData) : MeshFlashSwitchData)();
            intensitySwitch.propName = "flashRedIntensity";
            intensitySwitch.passIndex = 0;
            intensitySwitch.matIndex = -1;
            intensitySwitch.flashValue = PropArms.oilHitFlashIntensity;
            intensitySwitch.restoreValue = 0;
            intensitySwitch.useMaterialProp = false;
            flashData.switchProps = [intensitySwitch];
            result.push(flashData);
          }

          return result;
        }

        applyOilHitFlashWorldY(renderer, material) {
          var _model2;

          var worldBounds = renderer == null || (_model2 = renderer.model) == null ? void 0 : _model2.worldBounds;
          var center = worldBounds == null ? void 0 : worldBounds.center;
          var halfExtents = worldBounds == null ? void 0 : worldBounds.halfExtents;

          if (center && halfExtents) {
            material.setProperty("worldCenterY", center.y);
            material.setProperty("worldHalfY", Math.max(0.001, halfExtents.y));
            return;
          }

          material.setProperty("worldCenterY", renderer.node.worldPositionY);
          material.setProperty("worldHalfY", 0.5);
        }

        spawnOilBurstShards(node, records, groupIndex) {
          var _this$getOilBurstSour,
              _this3 = this;

          if (!node) {
            return;
          }

          var sourceMaterial = (_this$getOilBurstSour = this.getOilBurstSourceMaterial(records)) != null ? _this$getOilBurstSour : this.getOilBurstSourceMaterialFromNode(node);

          if (!sourceMaterial) {
            return;
          }

          var parent = node.parent;

          if (!parent) {
            return;
          }

          var burstCenter = this.getOilBurstShardWorldCenter(node);
          var baseSize = this.getOilBurstShardBaseSize(node);

          var _loop3 = function _loop3(i) {
            var dir = _this3.getOilBurstShardDirection(i, burstCenter);

            var startRadius = baseSize * (0.04 + i % 3 * 0.02);
            var shardNode = new Node("OilBurstShard_" + groupIndex + "_" + i);
            parent.addChild(shardNode);
            shardNode.layer = node.layer;
            shardNode.setWorldPosition(burstCenter.x + dir.x * startRadius, burstCenter.y + dir.y * startRadius, burstCenter.z + dir.z * startRadius);
            var yaw = Math.atan2(dir.x, dir.z) * 180 / Math.PI;
            shardNode.eulerAngles = v3(-18 + dir.y * 55 + i * 11, yaw + i * 13, -42 + i * 37);
            var startScale = 0.88 + i % 3 * 0.04;
            shardNode.setScale(startScale, startScale, startScale);
            var renderer = shardNode.addComponent(MeshRenderer);
            renderer.mesh = _this3.createOilBurstShardMesh(baseSize, i);

            var material = _this3.createOilBurstShardMaterial(sourceMaterial);

            renderer.setSharedMaterial(material, 0);
            var spread = baseSize * (2.7 + i % 4 * 0.42);
            var spinSign = i % 2 === 0 ? 1 : -1;
            var startPos = shardNode.position.clone();
            var startEuler = shardNode.eulerAngles.clone();
            var lift = baseSize * (0.56 + i % 3 * 0.16);
            var fall = baseSize * (0.52 + i % 2 * 0.18);
            var flightState = {
              progress: 0
            };
            tween(flightState).delay(groupIndex * PropArms.oilBurstDestroyDelayStep + i * 0.012).to(PropArms.oilBurstShardDuration, {
              progress: 1
            }, {
              easing: 'quartOut',
              onUpdate: state => {
                var t = state.progress;
                var outward = 1 - Math.pow(1 - t, 2.2);
                var arc = Math.sin(t * Math.PI);
                var distance = spread * outward;
                shardNode.setPosition(startPos.x + dir.x * distance, startPos.y + dir.y * distance * 0.35 + lift * arc - fall * t * t, startPos.z + dir.z * distance);
                shardNode.eulerAngles = v3(startEuler.x + spinSign * (360 * outward + i * 13), startEuler.y + 280 * outward + spinSign * arc * 42 + i * 17, startEuler.z + spinSign * (310 * outward + i * 11));
                var scale = 1.04 + 0.05 * arc - t * 0.18;
                shardNode.setScale(scale, scale, scale);
              }
            }).call(() => {
              var _renderer$mesh;

              (_renderer$mesh = renderer.mesh) == null || _renderer$mesh.destroy();
              material.destroy();
              shardNode.destroy();
            }).start();
          };

          for (var i = 0; i < PropArms.oilBurstShardCount; i++) {
            _loop3(i);
          }
        }

        playBottomBasePrefabBurst(node, groupIndex) {
          var _this4 = this;

          var burstRoot = this.getBottomBaseBurstRoot(node);

          if (!node || !burstRoot || burstRoot.children.length <= 0) {
            return 0;
          }

          for (var i = 0; i < node.children.length; i++) {
            var child = node.children[i];
            child.active = child === burstRoot;
          }

          burstRoot.active = true;
          var burstCenter = burstRoot.worldPosition;
          var baseSize = Math.max(0.22, this.getOilBurstShardBaseSize(node) * 0.72);
          var maxDelay = groupIndex * PropArms.oilBurstDestroyDelayStep;

          var _loop4 = function _loop4(_i6) {
            var shard = burstRoot.children[_i6];

            if (!shard) {
              return 1; // continue
            }

            Tween.stopAllByTarget(shard);

            var originalPos = _this4.getBottomBaseOriginalPos(shard);

            var originalScale = _this4.getBottomBaseOriginalScale(shard);

            var originalEuler = _this4.getBottomBaseOriginalEuler(shard);

            shard.active = true;
            shard.setPosition(originalPos);
            shard.setScale(originalScale);
            shard.eulerAngles = originalEuler;
            var startWorldPos = shard.worldPosition.clone();

            var dir = _this4.getOilBurstShardDirection(_i6, burstCenter, startWorldPos);

            var delay = groupIndex * PropArms.oilBurstDestroyDelayStep + _i6 * 0.012;
            var spinSign = _i6 % 2 === 0 ? 1 : -1;
            var spread = baseSize * (1.75 + _i6 % 3 * 0.28);
            var lift = baseSize * (0.34 + _i6 % 3 * 0.12);
            var fall = baseSize * (0.36 + _i6 % 2 * 0.14);
            maxDelay = Math.max(maxDelay, delay);
            var flightState = {
              progress: 0
            };
            tween(flightState).delay(delay).to(PropArms.oilBurstShardDuration, {
              progress: 1
            }, {
              easing: 'quartOut',
              onUpdate: state => {
                var t = state.progress;
                var outward = 1 - Math.pow(1 - t, 2.15);
                var arc = Math.sin(t * Math.PI);
                var distance = spread * outward;
                shard.setWorldPosition(startWorldPos.x + dir.x * distance, startWorldPos.y + dir.y * distance * 0.32 + lift * arc - fall * t * t, startWorldPos.z + dir.z * distance);
                shard.eulerAngles = v3(originalEuler.x + spinSign * (260 * outward + _i6 * 9), originalEuler.y + 210 * outward + spinSign * arc * 34 + _i6 * 12, originalEuler.z + spinSign * (230 * outward + _i6 * 7));
                var scale = 1 + 0.04 * arc - t * 0.16;
                shard.setScale(originalScale.x * scale, originalScale.y * scale, originalScale.z * scale);
              }
            }).call(() => {
              if (!shard || !shard.isValid) {
                return;
              }

              shard.setPosition(originalPos);
              shard.setScale(originalScale);
              shard.eulerAngles = originalEuler;
              shard.active = false;
            }).start();
          };

          for (var _i6 = 0; _i6 < burstRoot.children.length; _i6++) {
            if (_loop4(_i6)) continue;
          }

          return maxDelay + PropArms.oilBurstShardDuration;
        }

        getBottomBaseBurstRoot(node) {
          if (!node) {
            return null;
          }

          for (var i = 0; i < node.children.length; i++) {
            var child = node.children[i];

            if ((child == null ? void 0 : child.name) === "sp") {
              return child;
            }
          }

          return this.findNodeByName(node, "sp");
        }

        resetBottomBaseBurstVisual(node) {
          var burstRoot = this.getBottomBaseBurstRoot(node);

          if (!node || !burstRoot) {
            return;
          }

          burstRoot.active = false;

          for (var i = 0; i < node.children.length; i++) {
            var child = node.children[i];
            child.active = child !== burstRoot;
          }

          for (var _i7 = 0; _i7 < burstRoot.children.length; _i7++) {
            var shard = burstRoot.children[_i7];

            if (!shard) {
              continue;
            }

            Tween.stopAllByTarget(shard);
            shard.setPosition(this.getBottomBaseOriginalPos(shard));
            shard.setScale(this.getBottomBaseOriginalScale(shard));
            shard.eulerAngles = this.getBottomBaseOriginalEuler(shard);
            shard.active = true;
          }
        }

        playSpriteWeaponHitScale(totalDuration) {
          var weaponRoot = this.getCurrentArmsVisualRoot(this._curArms);

          if (!weaponRoot) {
            return;
          }

          var spriteNodes = [];
          PropArms.collectNodesByName(weaponRoot, PropArms.weaponPickupVisualName, spriteNodes);

          if (spriteNodes.length <= 0) {
            PropArms.collectNodesByName(weaponRoot, PropArms.spriteWeaponVisualName, spriteNodes);
          }

          if (spriteNodes.length <= 0) {
            return;
          }

          for (var i = 0; i < spriteNodes.length; i++) {
            var spriteNode = spriteNodes[i];

            if (!spriteNode || !spriteNode.isValid || !spriteNode.activeInHierarchy) {
              continue;
            }

            var pulseState = this.weaponVisualHitPulseStateMap.get(spriteNode);

            if (pulseState && pulseState.elapsed < pulseState.duration) {
              continue;
            }

            Tween.stopAllByTarget(spriteNode);
            var originalScale = this.getWeaponVisualOriginalScale(spriteNode);
            var scaleDownRate = Math.max(0.01, Math.min(Math.max(1, this.weaponHitScaleUp), this.weaponHitScaleDown));
            spriteNode.setScale(originalScale.x * scaleDownRate, originalScale.y * scaleDownRate, originalScale.z * scaleDownRate);
            this.weaponVisualHitPulseStateMap.set(spriteNode, {
              elapsed: 0,
              duration: Math.max(0.01, totalDuration)
            });
          }
        }

        getOilBurstSourceMaterial(records) {
          var fallback = null;

          for (var r = 0; r < records.length; r++) {
            var record = records[r];

            for (var i = 0; i < record.originalMaterials.length; i++) {
              var material = record.originalMaterials[i];

              if (material) {
                var color = this.getMaterialProperty(material, "mainColor");

                if (!color || color.r >= 210 && color.g >= 210 && color.b >= 210) {
                  return material;
                }

                if (!fallback) {
                  fallback = material;
                }
              }
            }
          }

          return fallback;
        }

        getOilBurstSourceMaterialFromNode(node) {
          var renderers = [];
          this.collectMeshRenderers(node, renderers);
          var fallback = null;

          for (var r = 0; r < renderers.length; r++) {
            var materials = renderers[r].sharedMaterials;

            for (var i = 0; i < materials.length; i++) {
              var material = materials[i];

              if (material) {
                var color = this.getMaterialProperty(material, "mainColor");

                if (!color || color.r >= 210 && color.g >= 210 && color.b >= 210) {
                  return material;
                }

                if (!fallback) {
                  fallback = material;
                }
              }
            }
          }

          return fallback;
        }

        createOilBurstShardMaterial(sourceMaterial) {
          var material = new Material();
          material.copy(sourceMaterial);
          var texture = this.getMaterialProperty(sourceMaterial, "mainTexture");

          if (texture) {
            material.setProperty("mainTexture", texture);
          }

          var color = this.getMaterialProperty(sourceMaterial, "mainColor");

          if (color) {
            material.setProperty("mainColor", color);
          }

          return material;
        }

        getOilBurstShardBaseSize(node) {
          var renderers = [];
          this.collectMeshRenderers(node, renderers);

          for (var i = 0; i < renderers.length; i++) {
            var _renderers$i;

            var worldBounds = (_renderers$i = renderers[i]) == null || (_renderers$i = _renderers$i.model) == null ? void 0 : _renderers$i.worldBounds;
            var halfExtents = worldBounds == null ? void 0 : worldBounds.halfExtents;

            if (halfExtents) {
              return Math.max(0.34, Math.min(1.45, Math.max(halfExtents.x, halfExtents.y, halfExtents.z) * 0.95));
            }
          }

          return 0.55;
        }

        getOilBurstShardWorldCenter(node) {
          var renderers = [];
          this.collectMeshRenderers(node, renderers);

          for (var i = 0; i < renderers.length; i++) {
            var _renderers$i2;

            var worldBounds = (_renderers$i2 = renderers[i]) == null || (_renderers$i2 = _renderers$i2.model) == null ? void 0 : _renderers$i2.worldBounds;
            var center = worldBounds == null ? void 0 : worldBounds.center;

            if (center) {
              return v3(center.x, center.y, center.z);
            }
          }

          return node.worldPosition.clone();
        }

        getOilBurstShardDirection(index, burstCenter, shardWorldPos) {
          var x = 0;
          var y = 0;
          var z = 0;

          if (burstCenter && shardWorldPos) {
            x = shardWorldPos.x - burstCenter.x;
            y = shardWorldPos.y - burstCenter.y;
            z = shardWorldPos.z - burstCenter.z;
          }

          var len = Math.sqrt(x * x + y * y + z * z);

          if (len < 0.0001) {
            var count = Math.max(1, PropArms.oilBurstShardCount);
            var t = (index + 0.5) / count;
            var goldenAngle = Math.PI * (3 - Math.sqrt(5));
            y = 1 - 2 * t;
            var radius = Math.sqrt(Math.max(0, 1 - y * y));
            var angle = index * goldenAngle;
            x = Math.cos(angle) * radius;
            z = Math.sin(angle) * radius;
            y = y * 0.62 + 0.24;
          } else {
            x /= len;
            y /= len;
            z /= len;
            y = y * 0.74 + 0.2;
          }

          len = Math.max(0.0001, Math.sqrt(x * x + y * y + z * z));
          return v3(x / len, y / len, z / len);
        }

        createOilBurstShardMesh(size, index) {
          var shapePresets = [{
            outerRadius: 1.38,
            shellThickness: 0.1,
            halfHeight: 0.62,
            angleSpan: 24,
            segmentCount: 2,
            tilt: -0.08,
            uvBand: 0.08,
            uvWidth: 0.12
          }, {
            outerRadius: 1.52,
            shellThickness: 0.14,
            halfHeight: 0.34,
            angleSpan: 34,
            segmentCount: 3,
            tilt: 0.05,
            uvBand: 0.22,
            uvWidth: 0.12
          }, {
            outerRadius: 1.44,
            shellThickness: 0.09,
            halfHeight: 0.48,
            angleSpan: 28,
            segmentCount: 2,
            tilt: 0.16,
            uvBand: 0.42,
            uvWidth: 0.12
          }, {
            outerRadius: 1.3,
            shellThickness: 0.16,
            halfHeight: 0.42,
            angleSpan: 32,
            segmentCount: 2,
            tilt: -0.18,
            uvBand: 0.58,
            uvWidth: 0.12
          }];
          var preset = shapePresets[index % shapePresets.length];
          var outerRadius = size * preset.outerRadius;
          var shellThickness = size * preset.shellThickness;
          var innerRadius = Math.max(outerRadius - shellThickness, outerRadius * 0.58);
          var halfHeight = size * preset.halfHeight;
          var segmentCount = preset.segmentCount;
          var angleSpan = preset.angleSpan * Math.PI / 180;
          var startAngle = -angleSpan * 0.5;
          var outerBottom = [];
          var outerTop = [];
          var innerBottom = [];
          var innerTop = [];

          for (var i = 0; i <= segmentCount; i++) {
            var ratio = i / segmentCount;
            var angle = startAngle + angleSpan * ratio;
            var cosA = Math.cos(angle);
            var sinA = Math.sin(angle);
            var tiltOffset = preset.tilt * size * (ratio - 0.5);
            var topOffset = tiltOffset * 0.6;
            outerBottom.push([cosA * outerRadius, -halfHeight + tiltOffset, sinA * outerRadius]);
            outerTop.push([cosA * outerRadius, halfHeight + topOffset, sinA * outerRadius]);
            innerBottom.push([cosA * innerRadius, -halfHeight + tiltOffset * 0.8, sinA * innerRadius]);
            innerTop.push([cosA * innerRadius, halfHeight + topOffset * 0.8, sinA * innerRadius]);
          }

          var positions = [];
          var uvs = [];
          var normals = [];
          var tangents = [];
          var indices = [];
          var u0 = preset.uvBand;
          var v0 = index % 2 === 0 ? 0.16 : 0.5;
          var u1 = Math.min(0.96, u0 + preset.uvWidth);
          var v1 = Math.min(0.9, v0 + 0.26);
          var sideUvs = [u0 + 0.04, v1, u1 - 0.04, v1, u0 + 0.04, v0, u1 - 0.04, v0];

          var pushFace = (a, b, c, d, faceUvs) => {
            var start = positions.length / 3;
            positions.push(...a, ...b, ...c, ...d);
            uvs.push(...faceUvs);
            var abx = b[0] - a[0];
            var aby = b[1] - a[1];
            var abz = b[2] - a[2];
            var acx = c[0] - a[0];
            var acy = c[1] - a[1];
            var acz = c[2] - a[2];
            var nx = aby * acz - abz * acy;
            var ny = abz * acx - abx * acz;
            var nz = abx * acy - aby * acx;
            var len = Math.max(0.0001, Math.sqrt(nx * nx + ny * ny + nz * nz));
            nx /= len;
            ny /= len;
            nz /= len;
            normals.push(nx, ny, nz, nx, ny, nz, nx, ny, nz, nx, ny, nz);
            tangents.push(1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1);
            indices.push(start, start + 1, start + 2, start + 2, start + 1, start + 3);
            indices.push(start + 2, start + 1, start, start + 3, start + 1, start + 2);
          };

          for (var _i8 = 0; _i8 < segmentCount; _i8++) {
            var uStart = u0 + (u1 - u0) * (_i8 / segmentCount);
            var uEnd = u0 + (u1 - u0) * ((_i8 + 1) / segmentCount);
            var mainUvs = [uStart, v1, uEnd, v1, uStart, v0, uEnd, v0];
            pushFace(outerBottom[_i8], outerBottom[_i8 + 1], outerTop[_i8], outerTop[_i8 + 1], mainUvs);
            pushFace(innerBottom[_i8 + 1], innerBottom[_i8], innerTop[_i8 + 1], innerTop[_i8], mainUvs);
            pushFace(outerTop[_i8], outerTop[_i8 + 1], innerTop[_i8], innerTop[_i8 + 1], sideUvs);
            pushFace(innerBottom[_i8], innerBottom[_i8 + 1], outerBottom[_i8], outerBottom[_i8 + 1], sideUvs);
          }

          pushFace(outerBottom[0], innerBottom[0], outerTop[0], innerTop[0], sideUvs);
          pushFace(innerBottom[segmentCount], outerBottom[segmentCount], innerTop[segmentCount], outerTop[segmentCount], sideUvs);
          var bound = outerRadius + shellThickness;
          return utils.createMesh({
            positions,
            normals,
            tangents,
            uvs,
            indices,
            minPos: {
              x: -bound,
              y: -bound,
              z: -bound
            },
            maxPos: {
              x: bound,
              y: bound,
              z: bound
            }
          });
        }

        createOilBurstMaterialRecords(node) {
          var burstTemplate = PropArms.oilBurstMaterial;

          if (!burstTemplate) {
            PropArms.preloadOilBurstMaterial();
            return [];
          }

          var renderers = [];
          this.collectMeshRenderers(node, renderers);
          var records = [];

          for (var r = 0; r < renderers.length; r++) {
            var renderer = renderers[r];

            if (!renderer || !renderer.isValid) {
              continue;
            }

            var originalMaterials = [...renderer.sharedMaterials];
            var burstMaterials = [];
            var hasBurstMaterial = false;

            for (var i = 0; i < originalMaterials.length; i++) {
              var original = originalMaterials[i];

              if (!original) {
                burstMaterials[i] = null;
                continue;
              }

              var burst = new Material();
              burst.copy(burstTemplate);
              this.copyOilBurstBaseProperties(original, burst);
              burst.setProperty("burstProgress", 0);
              burst.setProperty("burstWidth", 0.003);
              burst.setProperty("burstOffset", 0.0015);
              burstMaterials[i] = burst;
              renderer.setSharedMaterial(burst, i);
              hasBurstMaterial = true;
            }

            if (hasBurstMaterial) {
              records.push({
                renderer,
                originalMaterials,
                burstMaterials
              });
            }
          }

          return records;
        }

        collectMeshRenderers(node, out) {
          if (!node) {
            return;
          }

          var meshRenderer = node.getComponent(MeshRenderer);

          if (meshRenderer) {
            out.push(meshRenderer);
          }

          for (var i = 0; i < node.children.length; i++) {
            this.collectMeshRenderers(node.children[i], out);
          }
        }

        copyOilBurstBaseProperties(source, target) {
          this.copyOilBarrelBaseProperties(source, target);
        }

        copyOilBarrelBaseProperties(source, target) {
          var texture = this.getMaterialProperty(source, "mainTexture");

          if (texture) {
            target.setProperty("mainTexture", texture);
          }

          var color = this.getMaterialProperty(source, "mainColor");

          if (color) {
            target.setProperty("mainColor", color);
          }
        }

        applyOilHitFlashProgress(progress) {
          var value = Math.max(0, Math.min(1, progress));

          for (var r = 0; r < this.oilHitFlashRecords.length; r++) {
            var record = this.oilHitFlashRecords[r];

            if (!record.renderer || !record.renderer.isValid) {
              continue;
            }

            for (var i = 0; i < record.flashMaterials.length; i++) {
              var material = record.flashMaterials[i];

              if (material && material !== record.originalMaterials[i]) {
                material.setProperty("flashProgress", value);
              }
            }
          }
        }

        restoreOilHitFlashMaterials() {
          (_crd && FlashRedManager === void 0 ? (_reportPossibleCrUseOfFlashRedManager({
            error: Error()
          }), FlashRedManager) : FlashRedManager).instance.stopFlashRed(this.node);
        }

        getMaterialProperty(material, propName) {
          try {
            var getter = material.getProperty;

            if (typeof getter === "function") {
              return getter.call(material, propName);
            }
          } catch (err) {
            return null;
          }

          return null;
        }

        applyOilBurstProgress(records, progress) {
          var value = Math.max(0, Math.min(1, progress));

          for (var r = 0; r < records.length; r++) {
            var record = records[r];

            if (!record.renderer || !record.renderer.isValid) {
              continue;
            }

            for (var i = 0; i < record.burstMaterials.length; i++) {
              var material = record.burstMaterials[i];

              if (material) {
                material.setProperty("burstProgress", value);
              }
            }
          }
        }

        restoreOilBurstMaterials(records) {
          for (var r = 0; r < records.length; r++) {
            var record = records[r];

            if (record.renderer && record.renderer.isValid) {
              record.renderer.sharedMaterials = [];
              record.renderer.sharedMaterials = record.originalMaterials;
            }

            for (var i = 0; i < record.burstMaterials.length; i++) {
              var material = record.burstMaterials[i];

              if (material && material.isValid) {
                material.destroy();
              }
            }
          }
        }

        findFirstMeshRenderer(node) {
          if (!node) {
            return null;
          }

          var meshRenderer = node.getComponent(MeshRenderer);

          if (meshRenderer) {
            return meshRenderer;
          }

          for (var i = 0; i < node.children.length; i++) {
            var childMeshRenderer = this.findFirstMeshRenderer(node.children[i]);

            if (childMeshRenderer) {
              return childMeshRenderer;
            }
          }

          return null;
        }

        initLalian() {
          this.lalianNode = this.findNodeByName(this.node, "Lalian");
          this.lalianCube = null;
          this.lalianSegments.length = 0;
          this.lalianSegmentChildStartPos.length = 0;
          this.lalianHitIndex = 0;
          this.lalianSegmentHitStep = 0;
          this.lalianAnimating = false;
          this.lalianFinished = false;
          this.hasLalian = false;

          if (!this.lalianNode) {
            return;
          }

          this.lalianCube = this.findNodeByName(this.lalianNode, "Cube");

          if (this.lalianCube) {
            this.lalianCube.active = true;
            this.lalianCubeStartScale.set(this.lalianCube.scale);
            this.lalianCube.setScale(this.lalianCubeStartScale);
          }

          var segmentNodes = [];

          for (var i = 0; i < this.lalianNode.children.length; i++) {
            var child = this.lalianNode.children[i];

            if (!child || child === this.lalianCube || child.name === "Cube" || child.children.length <= 0) {
              continue;
            }

            segmentNodes.push(child);
          }

          var desiredCount = this.lalianNodeCount > 0 ? this.lalianNodeCount : segmentNodes.length;

          if (desiredCount > segmentNodes.length && segmentNodes.length > 0) {
            var template = segmentNodes[0];
            var basePos = template.position;

            for (var _i9 = segmentNodes.length; _i9 < desiredCount; _i9++) {
              var node = instantiate(template);
              node.name = template.name + "_" + _i9;
              this.lalianNode.addChild(node);
              node.setPosition(basePos.x, basePos.y, basePos.z + this.lalianNodeSpacingZ * _i9);
              segmentNodes.push(node);
            }
          }

          for (var _i10 = 0; _i10 < segmentNodes.length; _i10++) {
            segmentNodes[_i10].active = _i10 < desiredCount;
          }

          for (var _i11 = 0; _i11 < desiredCount && _i11 < segmentNodes.length; _i11++) {
            var _child = segmentNodes[_i11];
            this.lalianSegments.push(_child);
            var startPosList = [];

            for (var j = 0; j < _child.children.length; j++) {
              var part = _child.children[j];
              var startPos = part.position.clone();
              startPosList.push(startPos);
              Tween.stopAllByTarget(part);
              part.setPosition(startPos);
            }

            this.lalianSegmentChildStartPos.push(startPosList);
          }

          this.hasLalian = !!this.lalianCube && this.lalianSegments.length > 0;
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

        selectArms() {}

        start() {
          PropArms.preloadOilBurstMaterial();
          PropArms.preloadOilHitFlashMaterial();

          if (!this._disableWaveStageChain) {
            (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
              error: Error()
            }), EventManager) : EventManager).instance.on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
              error: Error()
            }), EventType) : EventType).MONSTER_WAVE_STAGE, this.onMonsterWaveStage, this);
          }

          this.init(0); // this.effect.node.active = false;
        }

        setFixedStage(stageIndex) {
          this._fixedStageIndex = Math.max(0, stageIndex);
          this._disableWaveStageChain = true;
          this._pendingWaveStageCount = 0;
          this._level = this._fixedStageIndex;
        }

        bindFixedStageRuntime(stageIndex, visualRoot, fbx) {
          if (stageIndex < 0 || stageIndex >= this.armsInfoList.length) {
            return;
          }

          var arms = this.armsInfoList[stageIndex];

          if (!arms) {
            return;
          }

          arms.runtimeVisualRoot = visualRoot;

          if (fbx) {
            arms.fbx = fbx;
          }
        }

        applyRoleLayoutReference(bottomBaseRef, armsRef) {
          this.roleTemplateLayoutLoaded = true;
          this.hasRoleTemplateLayout = false;

          if (bottomBaseRef != null && bottomBaseRef.isValid) {
            this.node.inverseTransformPoint(this.roleTemplateBottomBasePos, bottomBaseRef.worldPosition);
            this.hasRoleTemplateLayout = true;
          }

          if (armsRef != null && armsRef.isValid) {
            this.node.inverseTransformPoint(this.roleTemplateArmsPos, armsRef.worldPosition);
            this.hasRoleTemplateLayout = true;
          }
        }

        getBlockCollisionHalfZ() {
          var _this$tireScale, _this$tireScale2;

          var tireDepth = ((_this$tireScale = this.tireScale) == null ? void 0 : _this$tireScale.z) || ((_this$tireScale2 = this.tireScale) == null ? void 0 : _this$tireScale2.x) || 1;
          var tireHalfZ = tireDepth * 0.5;
          return Math.max(this.collisionHalfZ, tireHalfZ, 0.9);
        }

        onDestroy() {
          this.clearWeaponVisualHitPulseState(false);
          this.restoreOilHitFlashMaterials();
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.off((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MONSTER_WAVE_STAGE, this.onMonsterWaveStage);
        }

        _update(deltaTime) {
          var dt = deltaTime; // 石板浮动

          var visualRoot = this.getCurrentArmsVisualRoot(this._curArms);

          if (this.isWallH && this.wallNode && visualRoot) {
            this._time += dt * this.speed;
            var curY = visualRoot.y + this._curArms.wallHeight + Math.sin(this._time) * this.h;
            this.wallNode.y = curY;
          } // 轮胎平滑插值到正确位置


          this._updateTireDrop(dt);

          this.updateBottomBaseRoll(dt);
          this.updateWeaponVisualHitPulse(dt); // _isShake冷却（非销毁受击用）

          if (this._shakeCooldown > 0) {
            this._shakeCooldown -= dt;

            if (this._shakeCooldown <= 0) {
              this._isShake = false;
            }
          }
        }

        onMonsterWaveStage() {
          if (this._disableWaveStageChain) {
            return;
          }

          this._pendingWaveStageCount++;
          this.trySpawnNextStage();
        }

        queueTrySpawnNextStage() {
          if (this._disableWaveStageChain) {
            return;
          }

          if (this._pendingWaveStageCount <= 0 || this._isStageAlive) {
            return;
          }

          this.scheduleOnce(() => {
            this.trySpawnNextStage();
          }, this.nextStageDelay);
        }

        trySpawnNextStage() {
          if (this._disableWaveStageChain) {
            return;
          }

          if (this._isStageAlive || this._pendingWaveStageCount <= 0) {
            return;
          }

          if (this._level >= this.armsInfoList.length - 1) {
            this._pendingWaveStageCount = 0;
            this.node.active = false;
            return;
          }

          this._pendingWaveStageCount--;
          this.resetStagePosition();
          this.node.active = true;
          this.init(1);
        }

        resetStagePosition() {
          var _instance$getFrontMon, _instance4;

          var worldPos = this.node.worldPosition;
          var frontZ = (_instance$getFrontMon = (_instance4 = (_crd && MonsterCreate === void 0 ? (_reportPossibleCrUseOfMonsterCreate({
            error: Error()
          }), MonsterCreate) : MonsterCreate).instance) == null ? void 0 : _instance4.getFrontMonsterWorldZ(worldPos.z)) != null ? _instance$getFrontMon : worldPos.z;

          this._stageSpawnPos.set(worldPos.x, worldPos.y, frontZ - this.waveFrontGap);

          this.node.setWorldPosition(this._stageSpawnPos);
        }

        getCurrentArmsVisualRoot(arms) {
          var _arms$runtimeVisualRo;

          if (!arms) {
            return null;
          }

          return (_arms$runtimeVisualRo = arms.runtimeVisualRoot) != null && _arms$runtimeVisualRo.isValid ? arms.runtimeVisualRoot : null;
        }

      }, _class6.oilBurstMaterialPath = "Materials/OilBarrelBurst", _class6.oilHitFlashMaterialPath = "Materials/OilBarrelHitFlash", _class6.oilBurstMaterial = null, _class6.oilBurstMaterialLoading = false, _class6.oilHitFlashMaterial = null, _class6.oilHitFlashMaterialLoading = false, _class6.oilBurstDestroyDuration = 0.12, _class6.oilBurstDestroyDelayStep = 0.05, _class6.oilBurstDestroyScale = 1.01, _class6.oilBurstShardCount = 8, _class6.oilBurstShardDuration = 0.46, _class6.oilHitFlashDuration = 0.16, _class6.oilHitFlashColor = new Color(255, 188, 36, 255), _class6.oilHitFlashIntensity = 0.5, _class6.weaponPickupVisualName = "weapon", _class6.spriteWeaponVisualName = "jiatelin", _class6.modelWeaponVisualName = "jiateling01", _class6), (_descriptor10 = _applyDecoratedDescriptor(_class5.prototype, "armsInfoList", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class5.prototype, "hpLabel", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class5.prototype, "tireScale", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Vec3();
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class5.prototype, "tireSpacing", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.2;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class5.prototype, "bottomBaseOffsetX", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class5.prototype, "bottomBaseRollDegreesPerUnit", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 85;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class5.prototype, "jumpHeight", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.5;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class5.prototype, "waveFrontGap", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class5.prototype, "nextStageDelay", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.2;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class5.prototype, "animScale", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class5.prototype, "weaponHitScaleUp", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.22;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class5.prototype, "weaponHitScaleDown", [_dec23], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.86;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class5.prototype, "wallNode", [_dec24], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor23 = _applyDecoratedDescriptor(_class5.prototype, "lalianNodeCount", [_dec25], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class5.prototype, "lalianNodeSpacingZ", [_dec26], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.8;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class5.prototype, "lalianCloseX", [_dec27], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.1;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class5.prototype, "lalianMoveCount", [_dec28], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class5.prototype, "jumpWallPos", [_dec29], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Vec3();
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class5.prototype, "wallEffect", [_dec30], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor29 = _applyDecoratedDescriptor(_class5.prototype, "speed", [_dec31], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor30 = _applyDecoratedDescriptor(_class5.prototype, "h", [_dec32], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.2;
        }
      })), _class5)) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=aa6223cf35796d09344450a14919ad24c61174bb.js.map