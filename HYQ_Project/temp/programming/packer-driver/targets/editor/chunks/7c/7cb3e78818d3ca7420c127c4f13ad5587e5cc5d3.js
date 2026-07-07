System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12", "__unresolved_13", "__unresolved_14", "__unresolved_15", "__unresolved_16", "__unresolved_17", "__unresolved_18"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCBoolean, CCFloat, CCInteger, director, instantiate, tween, Vec3, PoolManager, EventType, MonsterType, PoolEnum, PrefabsEnum, MonsterBattleTaerget, PrefabsManager, MoveModEnum, Player, Role, EventManager, UnityUpComponent, GameOverPanel, JumpManager, FlashRedManager, CameraMove, PropArms, CreatePropBrand, BulletMonsterCollisionManager, PropLalianGate, FbxManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _dec12, _dec13, _class4, _class5, _descriptor11, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _dec38, _class7, _class8, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _descriptor34, _descriptor35, _class9, _crd, ccclass, property, tempV3, MonsterCreateInfo, MonsterCreateQueue, MonsterCreate;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPoolManager(extras) {
    _reporterNs.report("PoolManager", "../../Base/PoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMonsterType(extras) {
    _reporterNs.report("MonsterType", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolEnum(extras) {
    _reporterNs.report("PoolEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPrefabsEnum(extras) {
    _reporterNs.report("PrefabsEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMonsterBattleTaerget(extras) {
    _reporterNs.report("MonsterBattleTaerget", "./MonsterBattleTaerget", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPrefabsManager(extras) {
    _reporterNs.report("PrefabsManager", "../../Base/PrefabsManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMoveModEnum(extras) {
    _reporterNs.report("MoveModEnum", "../../Base/MoveRot/MoveDrive", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayer(extras) {
    _reporterNs.report("Player", "../Player/Player", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRole(extras) {
    _reporterNs.report("Role", "../Player/Role", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../../Base/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnityUpComponent(extras) {
    _reporterNs.report("UnityUpComponent", "../../Base/UnityUpComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameOverPanel(extras) {
    _reporterNs.report("GameOverPanel", "../UI/GameOver/GameOverPanel", _context.meta, extras);
  }

  function _reportPossibleCrUseOfJumpManager(extras) {
    _reporterNs.report("JumpManager", "../Jump/JumpManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFlashRedManager(extras) {
    _reporterNs.report("FlashRedManager", "../Battle/Base/FlashRedManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCameraMove(extras) {
    _reporterNs.report("CameraMove", "../../Base/CameraMove", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPropArms(extras) {
    _reporterNs.report("PropArms", "../Other/PropArms", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCreatePropBrand(extras) {
    _reporterNs.report("CreatePropBrand", "../Other/CreatePropBrand", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletMonsterCollisionManager(extras) {
    _reporterNs.report("BulletMonsterCollisionManager", "../Battle/BulletMonsterCollisionManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPropLalianGate(extras) {
    _reporterNs.report("PropLalianGate", "../Other/PropLalianGate", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFbxManager(extras) {
    _reporterNs.report("FbxManager", "../SkAnim/FbxManager", _context.meta, extras);
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
      director = _cc.director;
      instantiate = _cc.instantiate;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      PoolManager = _unresolved_2.default;
    }, function (_unresolved_3) {
      EventType = _unresolved_3.EventType;
      MonsterType = _unresolved_3.MonsterType;
      PoolEnum = _unresolved_3.PoolEnum;
      PrefabsEnum = _unresolved_3.PrefabsEnum;
    }, function (_unresolved_4) {
      MonsterBattleTaerget = _unresolved_4.MonsterBattleTaerget;
    }, function (_unresolved_5) {
      PrefabsManager = _unresolved_5.PrefabsManager;
    }, function (_unresolved_6) {
      MoveModEnum = _unresolved_6.MoveModEnum;
    }, function (_unresolved_7) {
      Player = _unresolved_7.Player;
    }, function (_unresolved_8) {
      Role = _unresolved_8.Role;
    }, function (_unresolved_9) {
      EventManager = _unresolved_9.default;
    }, function (_unresolved_10) {
      UnityUpComponent = _unresolved_10.UnityUpComponent;
    }, function (_unresolved_11) {
      GameOverPanel = _unresolved_11.GameOverPanel;
    }, function (_unresolved_12) {
      JumpManager = _unresolved_12.JumpManager;
    }, function (_unresolved_13) {
      FlashRedManager = _unresolved_13.FlashRedManager;
    }, function (_unresolved_14) {
      CameraMove = _unresolved_14.CameraMove;
    }, function (_unresolved_15) {
      PropArms = _unresolved_15.PropArms;
    }, function (_unresolved_16) {
      CreatePropBrand = _unresolved_16.CreatePropBrand;
    }, function (_unresolved_17) {
      BulletMonsterCollisionManager = _unresolved_17.default;
    }, function (_unresolved_18) {
      PropLalianGate = _unresolved_18.PropLalianGate;
    }, function (_unresolved_19) {
      FbxManager = _unresolved_19.FbxManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1f73f/6fgtCdZIelyOdUt06", "MonsterCreate", undefined);

      __checkObsolete__(['_decorator', 'CCBoolean', 'CCFloat', 'CCInteger', 'Component', 'director', 'instantiate', 'Node', 'Pool', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);
      tempV3 = new Vec3();
      MonsterCreateInfo = (_dec = ccclass("MonsterCreateInfo"), _dec2 = property(CCInteger), _dec3 = property({
        type: _crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
          error: Error()
        }), MonsterType) : MonsterType
      }), _dec4 = property({
        type: CCBoolean,
        displayName: '混合0/1怪物',
        tooltip: '开启后，这一波普通怪会在 ZombieBaby_0 和 ZombieBaby_1 之间混合生成。Boss 波不受影响。'
      }), _dec5 = property({
        type: CCFloat,
        displayName: '1号怪物占比(0-1)',
        tooltip: '混合0/1怪物开启时，生成 ZombieBaby_1 的概率。0=全0号，1=全1号，0.5=大致各半。',

        visible() {
          return this.mixBaby01;
        }

      }), _dec6 = property(CCInteger), _dec7 = property({
        type: CCInteger,
        displayName: '实际生成数量(0=默认)',
        tooltip: '这一波实际生成的怪物数量。填 0 时沿用“每行生成的怪物数量”。'
      }), _dec8 = property({
        type: CCInteger,
        displayName: 'Z范围基准数量(0=默认)',
        tooltip: '这一波用于计算 Z 轴铺开范围的基准数量。大于实际生成数量时，怪物会在同样 Z 范围内变得更稀疏。'
      }), _dec9 = property({
        type: CCFloat,
        displayName: '怪物生命(0=默认)',
        tooltip: '该配置生成的怪物生命值。填 0 时使用怪物预制体默认生命和原有难度倍率。'
      }), _dec10 = property({
        type: CCFloat,
        displayName: '难度倍率(0=默认)',
        tooltip: '该配置生成的怪物难度倍率。填 0 时使用原有默认倍率。怪物生命大于 0 时，优先使用固定生命。'
      }), _dec11 = property(CCInteger), _dec(_class = (_class2 = class MonsterCreateInfo {
        constructor() {
          _initializerDefineProperty(this, "loopMax", _descriptor, this);

          _initializerDefineProperty(this, "monsterType", _descriptor2, this);

          _initializerDefineProperty(this, "mixBaby01", _descriptor3, this);

          _initializerDefineProperty(this, "baby1Ratio", _descriptor4, this);

          _initializerDefineProperty(this, "monsterCountMax", _descriptor5, this);

          _initializerDefineProperty(this, "actualSpawnCount", _descriptor6, this);

          _initializerDefineProperty(this, "zRangeCountBase", _descriptor7, this);

          _initializerDefineProperty(this, "monsterHp", _descriptor8, this);

          _initializerDefineProperty(this, "difficulty", _descriptor9, this);

          _initializerDefineProperty(this, "brotherExcludeZ", _descriptor10, this);

          this.curMonsterCount = 0;
          this.curLoopCount = 0;
        }

        init() {
          this.curLoopCount = 0;
          this.curMonsterCount = 0;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "loopMax", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "monsterType", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBaby_0;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "mixBaby01", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "baby1Ratio", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "monsterCountMax", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 50;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "actualSpawnCount", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "zRangeCountBase", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "monsterHp", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "difficulty", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "brotherExcludeZ", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      })), _class2)) || _class);
      MonsterCreateQueue = (_dec12 = ccclass("MonsterCreateQueue"), _dec13 = property(MonsterCreateInfo), _dec12(_class4 = (_class5 = class MonsterCreateQueue {
        constructor() {
          this.curIndex = 0;

          _initializerDefineProperty(this, "monsterCreateInfoList", _descriptor11, this);
        }

      }, (_descriptor11 = _applyDecoratedDescriptor(_class5.prototype, "monsterCreateInfoList", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class5)) || _class4);

      _export("MonsterCreate", MonsterCreate = (_dec14 = ccclass('MonsterCreate'), _dec15 = property({
        type: CCInteger,
        tooltip: '场景中最大怪物数量'
      }), _dec16 = property({
        type: CCInteger,
        tooltip: '补充阶段每帧最大生成数，防止大量死怪时瞬间补怪掉帧'
      }), _dec17 = property(MonsterCreateQueue), _dec18 = property({
        tooltip: 'ZombieBrother前后Z轴排斥范围，该范围内不能生成ZombieBaby'
      }), _dec19 = property({
        displayName: '生成横向散布半宽(非限位)',
        tooltip: '只控制怪物生成队列的左右散布宽度，不决定是否允许进入左右奖励区。'
      }), _dec20 = property(CCFloat), _dec21 = property({
        type: CCFloat,
        displayName: '红框中路限位半宽',
        tooltip: '怪物在红框/非蓝框区域会被限制在 -该值 到 +该值 之间，左右两边同步生效。'
      }), _dec22 = property({
        tooltip: '每行生成的怪物数量'
      }), _dec23 = property({
        tooltip: '怪物Z轴每层间距'
      }), _dec24 = property({
        type: CCFloat,
        displayName: '出生X随机扰动',
        tooltip: '怪物出生时在当前列位置基础上额外随机偏移，减少队列感。'
      }), _dec25 = property({
        type: CCFloat,
        displayName: '出生Z随机扰动',
        tooltip: '怪物出生时在当前层位置基础上额外随机前后偏移，减少横排整齐感。'
      }), _dec26 = property({
        type: CCFloat,
        displayName: '出生缩放随机',
        tooltip: '怪物出生时随机缩放幅度，0.08 表示 0.92-1.08。'
      }), _dec27 = property({
        type: CCFloat,
        displayName: '出生朝向随机',
        tooltip: '怪物出生时 Y 轴随机旋转角度，轻微打散朝向。'
      }), _dec28 = property({
        type: Vec3,
        displayName: '怪物出生整体偏移',
        tooltip: '整体调整怪物初始生成位置，主要调 Z 可前后移动到指定红线位置。'
      }), _dec29 = property({
        type: CCFloat,
        displayName: '怪物死亡抛起基础高度',
        tooltip: '怪物被击飞死亡时的基础抛起高度，数值越大飞得越高。'
      }), _dec30 = property({
        type: CCFloat,
        displayName: '怪物死亡抛起随机高度',
        tooltip: '怪物被击飞死亡时额外随机增加的抛起高度，0 表示不随机。'
      }), _dec31 = property({
        type: CCInteger,
        displayName: '油桶大波次数量',
        tooltip: '兼容旧配置：当“油桶对应波次索引”为空时，使用这里的数量从第 0 波开始顺序生成油桶。'
      }), _dec32 = property({
        type: [CCInteger],
        displayName: '油桶对应波次索引',
        tooltip: '数组内每一项生成一个油桶，并对应一个怪物波次；例如 [0, 2] 表示只生成两个油桶。0 表示第 0 波。'
      }), _dec33 = property({
        type: CCFloat,
        displayName: '油桶怪物预留间距',
        tooltip: '创建怪物和初始化油桶时，油桶碰撞盒与怪物碰撞盒之间额外保留的 Z 轴距离。数值越大越不容易视觉穿模。'
      }), _dec34 = property({
        type: CCFloat,
        displayName: '再来一次前排后退补偿'
      }), _dec35 = property({
        type: CCFloat,
        displayName: '再来一次波次追加间距'
      }), _dec36 = property({
        type: CCFloat,
        displayName: '再来一次站位随机X'
      }), _dec37 = property({
        type: CCFloat,
        displayName: '再来一次站位随机Z'
      }), _dec38 = property({
        type: CCBoolean,
        displayName: '再来一次距离日志'
      }), _dec14(_class7 = (_class8 = (_class9 = class MonsterCreate extends (_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
        error: Error()
      }), UnityUpComponent) : UnityUpComponent) {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "monsterCount", _descriptor12, this);

          _initializerDefineProperty(this, "maxSpawnPerFrame", _descriptor13, this);

          _initializerDefineProperty(this, "monsterCreateQueue", _descriptor14, this);

          _initializerDefineProperty(this, "brotherExcludeZ", _descriptor15, this);

          _initializerDefineProperty(this, "disX", _descriptor16, this);

          _initializerDefineProperty(this, "monsterSpeed", _descriptor17, this);

          _initializerDefineProperty(this, "middleLaneHalfX", _descriptor18, this);

          /** 每列间距，由 disX*2/rowCount 计算得出 */
          this.offX = 0;

          _initializerDefineProperty(this, "rowCount", _descriptor19, this);

          this._rowCount = 0;

          _initializerDefineProperty(this, "layerGapZ", _descriptor20, this);

          _initializerDefineProperty(this, "spawnRandomX", _descriptor21, this);

          _initializerDefineProperty(this, "spawnRandomZ", _descriptor22, this);

          _initializerDefineProperty(this, "spawnScaleRandom", _descriptor23, this);

          _initializerDefineProperty(this, "spawnYawRandom", _descriptor24, this);

          _initializerDefineProperty(this, "spawnPositionOffset", _descriptor25, this);

          _initializerDefineProperty(this, "monsterDeathThrowBaseHeight", _descriptor26, this);

          _initializerDefineProperty(this, "monsterDeathThrowRandomHeight", _descriptor27, this);

          this._monsterList = [];
          this.posIndex = 0;

          /** 自上次生成ZombieBrother以来已生成的ZombieBaby数量 */
          // private _babyCountSinceLastBrother: number = 0;

          /** 下一个ZombieBaby的Z轴生成位置 */
          this._nextSpawnZ = 0;
          this._monsterBossCount = 0;
          this.bossDieCount = 0;
          this.stage_0 = 26.5;
          this.stage_1 = 15;
          this._hasInitialFilled = false;
          this._spawnAllWavesOnStart = true;

          _initializerDefineProperty(this, "waveRoleCount", _descriptor28, this);

          _initializerDefineProperty(this, "waveRoleStageIndexList", _descriptor29, this);

          this._waveRoleNodes = [];
          this._waveStageStartZList = [];
          this._waveStageIndexList = [];
          this._monsterWaveIndexMap = new WeakMap();
          this._monsterRebirthOrderMap = new WeakMap();
          this._monsterSpawnLocalXMap = new WeakMap();
          this._monsterSpawnLocalZMap = new WeakMap();
          this._monsterRebirthOffsetMap = new WeakMap();
          this._rebirthWaveInitialMinZList = [];
          this._rebirthWaveInitialMaxZList = [];
          this._monsterRebirthOrderIndex = 0;

          _initializerDefineProperty(this, "waveRoleMonsterGap", _descriptor30, this);

          _initializerDefineProperty(this, "rebirthMonsterFrontRetreatZ", _descriptor31, this);

          _initializerDefineProperty(this, "rebirthMonsterWaveExtraGapZ", _descriptor32, this);

          _initializerDefineProperty(this, "rebirthMonsterRandomX", _descriptor33, this);

          _initializerDefineProperty(this, "rebirthMonsterRandomZ", _descriptor34, this);

          _initializerDefineProperty(this, "rebirthMonsterDistanceLog", _descriptor35, this);

          this.waveRolePlayerHalfX = 0.35;
          this.waveRolePlayerHalfZ = 0.35;
          this._isRestoringWaveRolesAfterRebirth = false;
          this.lalianLimitRanges = [];
          this.tempLalianRange = new Vec3();
          this.monsterMatIns = [0, 0, 0];
        }

        onLoad() {
          MonsterCreate.instance = this;
          this.prepareWaveRoles();
        }

        start() {
          this.offX = this.disX * 2 / this.rowCount;
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).PLAYER_RESURRECTION, this.TimeFlowsBackWard, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MONSTER_SKILL_XRD, this.skillXRMonster, this);
          this.refreshLalianLimitRange();
          this.spawnAllWavesAtStart(); // this.scheduleOnce(() => {
          //     this.skillXRMonster(2, 2, 2);
          // }, 2);
        }

        get waveRolePushGap() {
          return Math.max(0, this.waveRoleMonsterGap);
        }

        prepareWaveRoles() {
          if (this._waveRoleNodes.length > 0) {
            return;
          }

          const template = this.findWaveRoleTemplate();

          if (!template || !template.node) {
            return;
          }

          const totalStageCount = this.getConfiguredWaveCount();

          if (totalStageCount <= 0) {
            return;
          }

          const allStageStartZList = this.getWaveStageStartZList(totalStageCount);
          const stageIndexList = this.getWaveRoleStageIndexList(totalStageCount);

          if (stageIndexList.length <= 0) {
            return;
          }

          const stageZList = stageIndexList.map(stageIndex => allStageStartZList[stageIndex]);
          this._waveStageIndexList = stageIndexList.slice();
          this._waveStageStartZList = stageZList.slice();
          const parent = template.node.parent;

          if (!parent) {
            return;
          }

          const roleList = [template];

          for (let i = 1; i < stageZList.length; i++) {
            const clone = this.createWaveRoleClone(template, parent);

            if (clone) {
              roleList.push(clone);
            }
          }

          this._waveRoleNodes.length = 0;

          for (let i = 0; i < roleList.length; i++) {
            const role = roleList[i];
            this.configureWaveRoleByStage(role, i);
            role.setFixedStage(Math.min(i, role.armsInfoList.length - 1));
            role.node.active = true;

            if (typeof stageZList[i] === 'number') {
              this.resetWaveRoleToStageStart(role, stageZList[i]);
            }

            this._waveRoleNodes.push(role);
          }

          this.bindWaveRolesToCreatePropBrand();
        }

        createWaveRoleClone(template, parent) {
          const cloneNode = instantiate(template.node);
          parent.addChild(cloneNode);
          return cloneNode.getComponent(_crd && PropArms === void 0 ? (_reportPossibleCrUseOfPropArms({
            error: Error()
          }), PropArms) : PropArms);
        }

        findWaveRoleTemplate() {
          const scene = director.getScene();

          if (!scene) {
            return null;
          }

          const stack = [scene];

          while (stack.length > 0) {
            const node = stack.pop();

            if (!node) {
              continue;
            }

            const arms = node.getComponent(_crd && PropArms === void 0 ? (_reportPossibleCrUseOfPropArms({
              error: Error()
            }), PropArms) : PropArms);

            if (arms && arms.armsInfoList.length > 1 && this.findNodeByName(node, 'Role_0')) {
              return arms;
            }

            for (let i = node.children.length - 1; i >= 0; i--) {
              stack.push(node.children[i]);
            }
          }

          return null;
        }

        configureWaveRoleByStage(role, stageIndex) {
          const roleRoot = this.findWaveRoleRoot(role);

          if (!roleRoot) {
            return;
          }

          const stageAnchor = this.findWaveRoleStageAnchor(roleRoot, stageIndex);

          if (!stageAnchor) {
            return;
          }

          this.applyWaveRoleStageSelection(roleRoot, stageAnchor);
          const bottomBaseRef = this.findWaveRoleBottomBaseReference(stageAnchor);
          const fbx = this.resolveWaveRoleFbx(stageAnchor);
          role.bindFixedStageRuntime(stageIndex, stageAnchor, fbx);
          role.applyRoleLayoutReference(bottomBaseRef, stageAnchor);
        }

        findWaveRoleRoot(role) {
          if (!(role != null && role.node)) {
            return null;
          }

          return role.node;
        }

        applyWaveRoleStageSelection(roleRoot, activeStage) {
          roleRoot.active = true;

          for (let i = 0; i < roleRoot.children.length; i++) {
            const child = roleRoot.children[i];

            if (!child) {
              continue;
            }

            if (/^Role_\d+$/i.test(child.name)) {
              child.active = child === activeStage;
            }
          }
        }

        resolveWaveRoleFbx(visualRoot) {
          if (!visualRoot) {
            return null;
          }

          const role = visualRoot.getComponent(_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role);

          if (role != null && role.fbxManager) {
            return role.fbxManager;
          }

          return visualRoot.getComponentInChildren(_crd && FbxManager === void 0 ? (_reportPossibleCrUseOfFbxManager({
            error: Error()
          }), FbxManager) : FbxManager);
        }

        findWaveRoleStageAnchor(roleRoot, stageIndex) {
          const exact = this.findNodeByName(roleRoot, `Role_${stageIndex}`);

          if (exact) {
            return exact;
          }

          return this.findNodeByName(roleRoot, 'Role_0');
        }

        findWaveRoleBottomBaseReference(roleRoot) {
          if (!roleRoot) {
            return null;
          }

          const stack = [roleRoot];

          while (stack.length > 0) {
            const node = stack.pop();

            if (!node) {
              continue;
            }

            const name = node.name.toLowerCase();

            if (name.indexOf('youtong') >= 0 || name.indexOf('oil') >= 0) {
              return node;
            }

            for (let i = node.children.length - 1; i >= 0; i--) {
              stack.push(node.children[i]);
            }
          }

          return null;
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

        getConfiguredWaveCount() {
          var _this$monsterCreateQu, _this$monsterCreateQu2;

          const list = (_this$monsterCreateQu = (_this$monsterCreateQu2 = this.monsterCreateQueue) == null ? void 0 : _this$monsterCreateQu2.monsterCreateInfoList) != null ? _this$monsterCreateQu : [];
          let count = 0;

          for (let i = 0; i < list.length; i++) {
            const quest = list[i];

            if (!quest) {
              continue;
            }

            const loopCount = quest.loopMax == -1 ? 1 : Math.max(1, quest.loopMax);
            count += loopCount;
          }

          return count;
        }

        getWaveRoleStageIndexList(stageCount) {
          var _this$waveRoleStageIn;

          const result = [];

          if (stageCount <= 0) {
            return result;
          }

          const source = (_this$waveRoleStageIn = this.waveRoleStageIndexList) != null ? _this$waveRoleStageIn : [];

          if (source.length > 0) {
            for (let i = 0; i < source.length; i++) {
              const rawIndex = source[i];

              if (typeof rawIndex !== 'number' || isNaN(rawIndex)) {
                continue;
              }

              const stageIndex = Math.min(stageCount - 1, Math.max(0, Math.floor(rawIndex)));

              if (result.indexOf(stageIndex) >= 0) {
                continue;
              }

              result.push(stageIndex);
            }

            result.sort((a, b) => a - b);
            return result;
          }

          const targetCount = Math.min(stageCount, Math.max(0, Math.floor(this.waveRoleCount)));

          for (let i = 0; i < targetCount; i++) {
            result.push(i);
          }

          return result;
        }

        buildStageToWaveRoleIndexList(stageCount, stageStartIndexList) {
          const result = [];

          if (stageCount <= 0 || stageStartIndexList.length <= 0) {
            return result;
          }

          let waveIndex = 0;

          for (let i = 0; i < stageCount; i++) {
            while (waveIndex + 1 < stageStartIndexList.length && i >= stageStartIndexList[waveIndex + 1]) {
              waveIndex++;
            }

            result.push(waveIndex);
          }

          return result;
        }

        getBigWaveStartZList(allStageStartZList, bigWaveCount) {
          const result = [];

          if (!allStageStartZList.length || bigWaveCount <= 0) {
            return result;
          }

          const stageTypeList = this.getExpandedStageMonsterTypeList();
          const stageStartIndexList = this.getBigWaveStartStageIndexList(stageTypeList, bigWaveCount);

          if (stageStartIndexList.length > 0) {
            for (let i = 0; i < stageStartIndexList.length; i++) {
              const stageIndex = stageStartIndexList[i];
              const stageZ = allStageStartZList[stageIndex];

              if (typeof stageZ === 'number') {
                result.push(stageZ);
              }
            }

            if (result.length > 0) {
              return result;
            }
          }

          const chunkSize = Math.max(1, Math.ceil(allStageStartZList.length / bigWaveCount));

          for (let i = 0; i < allStageStartZList.length && result.length < bigWaveCount; i += chunkSize) {
            result.push(allStageStartZList[i]);
          }

          while (result.length < bigWaveCount && result.length < allStageStartZList.length) {
            result.push(allStageStartZList[result.length]);
          }

          return result;
        }

        getExpandedStageMonsterTypeList() {
          var _this$monsterCreateQu3, _this$monsterCreateQu4;

          const result = [];
          const list = (_this$monsterCreateQu3 = (_this$monsterCreateQu4 = this.monsterCreateQueue) == null ? void 0 : _this$monsterCreateQu4.monsterCreateInfoList) != null ? _this$monsterCreateQu3 : [];

          for (let i = 0; i < list.length; i++) {
            const quest = list[i];

            if (!quest) {
              continue;
            }

            const loopCount = quest.loopMax == -1 ? 1 : Math.max(1, quest.loopMax);

            for (let loop = 0; loop < loopCount; loop++) {
              result.push(quest.monsterType);
            }
          }

          return result;
        }

        getBigWaveStartStageIndexList(stageTypeList, bigWaveCount) {
          const result = [];

          if (stageTypeList.length <= 0 || bigWaveCount <= 0) {
            return result;
          }

          result.push(0);

          for (let i = 0; i < stageTypeList.length - 1; i++) {
            if (stageTypeList[i] === (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
              error: Error()
            }), MonsterType) : MonsterType).ZombieBrother) {
              result.push(i);
            }
          }

          if (result.length > bigWaveCount) {
            result.length = bigWaveCount;
            return result;
          }

          if (result.length < bigWaveCount) {
            const chunkSize = Math.max(1, Math.ceil(stageTypeList.length / bigWaveCount));

            for (let i = 0; i < stageTypeList.length && result.length < bigWaveCount; i += chunkSize) {
              if (result.indexOf(i) === -1) {
                result.push(i);
              }
            }
          }

          result.sort((a, b) => a - b);
          return result;
        }

        buildStageToBigWaveIndex(stageCount, bigWaveCount) {
          const result = [];

          if (stageCount <= 0 || bigWaveCount <= 0) {
            return result;
          }

          const stageTypeList = this.getExpandedStageMonsterTypeList().slice(0, stageCount);
          const stageStartIndexList = this.getBigWaveStartStageIndexList(stageTypeList, bigWaveCount);

          if (stageStartIndexList.length > 0) {
            let waveIndex = 0;

            for (let i = 0; i < stageCount; i++) {
              while (waveIndex + 1 < stageStartIndexList.length && i >= stageStartIndexList[waveIndex + 1]) {
                waveIndex++;
              }

              result.push(waveIndex);
            }

            return result;
          }

          const chunkSize = Math.max(1, Math.ceil(stageCount / bigWaveCount));

          for (let i = 0; i < stageCount; i++) {
            result.push(Math.min(bigWaveCount - 1, Math.floor(i / chunkSize)));
          }

          return result;
        }

        resetWaveRoleToStageStart(role, stageStartZ) {
          if (!(role != null && role.node)) {
            return;
          }

          const targetCenterZ = this.node.worldPositionZ + stageStartZ - this.getWaveRoleCollisionHalfZ(role) - this.waveRolePushGap;
          this.setCollisionCenterWorldZ(role, targetCenterZ);
        }

        snapWaveRolesToCurrentWaveFront() {
          if (this._waveRoleNodes.length <= 0) {
            return;
          }

          for (let i = 0; i < this._waveRoleNodes.length; i++) {
            const role = this._waveRoleNodes[i];
            const frontMonster = this.getFrontMonsterByWave(i);

            if (!(role != null && role.node) || !(frontMonster != null && frontMonster.node)) {
              continue;
            }

            const roleHalfZ = this.getWaveRoleCollisionHalfZ(role);
            const monsterHalfZ = this.getMonsterCollisionHalfZ(frontMonster);
            const monsterCenterZ = frontMonster.getCollisionWorldPosition(tempV3).z;
            const targetCenterZ = monsterCenterZ - monsterHalfZ - this.waveRolePushGap - roleHalfZ;
            this.setCollisionCenterWorldZ(role, targetCenterZ);
            this.clampMonstersBehindWaveRole(i);
          }
        }

        bindWaveRolesToCreatePropBrand() {
          const scene = director.getScene();

          if (!scene || this._waveRoleNodes.length <= 0) {
            return;
          }

          const waveRoleNodeList = this._waveRoleNodes.map(role => role == null ? void 0 : role.node).filter(node => !!node);

          const stack = [scene];

          while (stack.length > 0) {
            const node = stack.pop();

            if (!node) {
              continue;
            }

            const createPropBrand = node.getComponent(_crd && CreatePropBrand === void 0 ? (_reportPossibleCrUseOfCreatePropBrand({
              error: Error()
            }), CreatePropBrand) : CreatePropBrand);

            if (createPropBrand && createPropBrand.type === 0) {
              createPropBrand.setWaveRoleList(waveRoleNodeList);
            }

            for (let i = node.children.length - 1; i >= 0; i--) {
              stack.push(node.children[i]);
            }
          }
        }

        spawnAllWavesAtStart() {
          var _this$monsterCreateQu5, _this$monsterCreateQu6;

          const stageList = (_this$monsterCreateQu5 = (_this$monsterCreateQu6 = this.monsterCreateQueue) == null ? void 0 : _this$monsterCreateQu6.monsterCreateInfoList) != null ? _this$monsterCreateQu5 : [];

          if (stageList.length <= 0) {
            return;
          }

          this._spawnAllWavesOnStart = true;
          this._hasInitialFilled = true;
          this._monsterList.length = 0;
          this._nextSpawnZ = 0;
          this._rowCount = 0;
          this.posIndex = 0;
          this._monsterBossCount = 0;
          this.bossDieCount = 0;
          this.monsterMatIns = [0, 0, 0];
          this._monsterWaveIndexMap = new WeakMap();
          this._monsterRebirthOrderMap = new WeakMap();
          this._monsterSpawnLocalXMap = new WeakMap();
          this._monsterSpawnLocalZMap = new WeakMap();
          this._monsterRebirthOffsetMap = new WeakMap();
          this._rebirthWaveInitialMinZList.length = 0;
          this._rebirthWaveInitialMaxZList.length = 0;
          this._monsterRebirthOrderIndex = 0;
          const stageToBigWaveList = this.buildStageToWaveRoleIndexList(this.getConfiguredWaveCount(), this.getWaveRoleStageIndexList(this.getConfiguredWaveCount()));
          let stageCursor = 0;

          for (let i = 0; i < stageList.length; i++) {
            const quest = stageList[i];
            const loopCount = quest.loopMax == -1 ? 1 : Math.max(1, quest.loopMax);

            for (let loop = 0; loop < loopCount; loop++) {
              var _stageToBigWaveList$M;

              const waveIndex = (_stageToBigWaveList$M = stageToBigWaveList[Math.min(stageCursor, stageToBigWaveList.length - 1)]) != null ? _stageToBigWaveList$M : 0;
              const spawnCount = this.getQuestSpawnCount(quest);
              const rangeCount = this.getQuestRangeCount(quest);

              if (quest.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
                error: Error()
              }), MonsterType) : MonsterType).ZombieBrother || spawnCount >= rangeCount) {
                for (let count = 0; count < spawnCount; count++) {
                  if (quest.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
                    error: Error()
                  }), MonsterType) : MonsterType).ZombieBrother) {
                    this.spawnBrother(quest, waveIndex);
                  } else {
                    this.spawnBaby(quest, waveIndex);
                  }
                }
              } else {
                const spawnSlotSet = this.buildSparseWaveSpawnSlotSet(spawnCount, rangeCount);
                let cursorNextSpawnZ = this._nextSpawnZ;
                let cursorRowCount = this._rowCount;
                let cursorPosIndex = this.posIndex;

                for (let slot = 0; slot < rangeCount; slot++) {
                  if (spawnSlotSet.has(slot)) {
                    cursorNextSpawnZ = this.spawnBabyAtCursor(quest, waveIndex, cursorNextSpawnZ, cursorPosIndex);
                  }

                  cursorPosIndex = (cursorPosIndex + 1) % this.rowCount;
                  cursorRowCount++;

                  if (cursorRowCount == this.rowCount) {
                    cursorNextSpawnZ += this.layerGapZ;
                    cursorRowCount = 0;
                  }
                }

                this._nextSpawnZ = cursorNextSpawnZ;
                this._rowCount = cursorRowCount;
                this.posIndex = cursorPosIndex;
              }

              this._nextSpawnZ += quest.brotherExcludeZ;
              stageCursor++;
            }

            quest.init();
          }

          this.monsterCount = this._monsterList.length;
          this.snapWaveRolesToCurrentWaveFront();
        }

        _update(deltaTime) {
          if (!this._spawnAllWavesOnStart) {
            if (!this._hasInitialFilled && this._monsterList.length >= this.monsterCount) {
              this._hasInitialFilled = true;
            }

            if (this._monsterList.length < this.monsterCount) {
              const quest = this.monsterCreateQueue.monsterCreateInfoList[this.monsterCreateQueue.curIndex];
              const questSpawnCount = this.getQuestSpawnCount(quest);
              const monsterCount = questSpawnCount - quest.curMonsterCount;
              let count = this.monsterCount - monsterCount + this._monsterList.length;

              if (count >= 0) {
                count = monsterCount;
              } else {
                count = this.monsterCount - this._monsterList.length;
              }

              const maxPerFrame = this._hasInitialFilled ? this.maxSpawnPerFrame : 51;

              if (count > maxPerFrame) {
                count = maxPerFrame;
              }

              for (let i = 0; i < count; i++) {
                if (quest.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
                  error: Error()
                }), MonsterType) : MonsterType).ZombieBrother) {
                  this.spawnBrother(quest);
                } else {
                  this.spawnBaby(quest);
                }
              }

              quest.curMonsterCount += count;

              if (quest.curMonsterCount == questSpawnCount) {
                (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
                  error: Error()
                }), EventManager) : EventManager).instance.emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
                  error: Error()
                }), EventType) : EventType).MONSTER_WAVE_STAGE);
                quest.curLoopCount++;
                this._nextSpawnZ += quest.brotherExcludeZ;

                if (quest.loopMax != -1 && quest.curLoopCount == quest.loopMax) {
                  this.monsterCreateQueue.curIndex++;
                  this.monsterCreateQueue.curIndex = this.monsterCreateQueue.curIndex % this.monsterCreateQueue.monsterCreateInfoList.length;
                }

                quest.init();
              }
            }
          }

          if (!this._isRestoringWaveRolesAfterRebirth) {
            this.updateWaveRoleForwardMove(deltaTime);
            this.checkWaveRolePlayerCollision();
          }

          for (let i = this._monsterList.length - 1; i >= 0; i--) {
            const monster = this._monsterList[i];

            if (monster != null && monster.move) {
              monster.move.speed = Math.max(0, this.monsterSpeed);
            }

            if (monster.isDie) {
              // swap-and-pop替代splice，iOS优化
              if (monster.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
                error: Error()
              }), MonsterType) : MonsterType).ZombieBrother) {
                this.bossDieCount++;

                if (this.bossDieCount == 2) {
                  this.scheduleOnce(() => {
                    (_crd && GameOverPanel === void 0 ? (_reportPossibleCrUseOfGameOverPanel({
                      error: Error()
                    }), GameOverPanel) : GameOverPanel).instance.show(true);
                  }, 1);
                }
              }

              this._monsterList[i] = this._monsterList[this._monsterList.length - 1];

              this._monsterList.pop();
            } else if (monster.move.isPos) {
              const mz = monster.node.worldPositionZ;

              if (mz <= this.stage_0 && mz > this.stage_1) {
                tempV3.x = this.getMonsterMoveTargetX(monster, mz);
                tempV3.y = 0;
                tempV3.z = this.stage_1;
                monster.move.pos = tempV3;
              } else if (mz >= this.stage_1) {
                if (!monster.attackTarget || !monster.attackTarget.active) {
                  if (!(_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
                    error: Error()
                  }), Player) : Player).instance || (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
                    error: Error()
                  }), Player) : Player).instance.isDie || (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
                    error: Error()
                  }), Player) : Player).instance.roleList.length <= 0) {
                    continue;
                  }

                  if (!this.tryAssignMonsterAttackTarget(monster)) {
                    continue;
                  } // if (monster.monsterType == MonsterType.ZombieBaby_0) {
                  //     EventManager.instance.emit(EventType.Monster_Attack_Player_ADD, monster);
                  // }

                }
              }
            }

            this.syncMonsterMoveTargetX(monster);

            if (!this._isRestoringWaveRolesAfterRebirth) {
              this.clampMonsterBehindWaveRole(monster);
            }

            this.limitMonsterToMiddleLane(monster);
          }

          if (MonsterCreate.isStartMove) {
            this._nextSpawnZ -= deltaTime * this.monsterSpeed;
          }
        }

        lateUpdate(deltaTime) {
          if ((_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
            error: Error()
          }), UnityUpComponent) : UnityUpComponent).isStop) {
            return;
          }

          if (this.lalianLimitRanges.length <= 0 || this._monsterList.length <= 0) {
            return;
          }

          for (let i = 0; i < this._monsterList.length; i++) {
            const monster = this._monsterList[i];

            if (!monster || monster.isDie || !monster.node || !monster.node.active) {
              continue;
            }

            this.limitMonsterToMiddleLane(monster);
          }
        }

        refreshLalianLimitRange() {
          this.lalianLimitRanges.length = 0;
          const scene = director.getScene();

          if (!scene) {
            return;
          }

          const stack = [scene];

          while (stack.length > 0) {
            const node = stack.pop();

            if (!node) {
              continue;
            }

            const gate = node.getComponent(_crd && PropLalianGate === void 0 ? (_reportPossibleCrUseOfPropLalianGate({
              error: Error()
            }), PropLalianGate) : PropLalianGate);

            if (gate && gate.getWorldZRange(this.tempLalianRange)) {
              this.lalianLimitRanges.push({
                minZ: Math.min(this.tempLalianRange.x, this.tempLalianRange.y),
                maxZ: Math.max(this.tempLalianRange.x, this.tempLalianRange.y)
              });
            }

            for (let i = node.children.length - 1; i >= 0; i--) {
              stack.push(node.children[i]);
            }
          }
        }

        updateWaveRoleForwardMove(deltaTime) {
          if (!MonsterCreate.isStartMove) {
            return;
          }

          if (this._waveRoleNodes.length <= 0 || this._waveStageStartZList.length <= 0) {
            return;
          }

          const moveDistance = Math.max(0, this.monsterSpeed) * deltaTime;

          if (moveDistance <= 0) {
            return;
          }

          for (let i = 0; i < this._waveRoleNodes.length; i++) {
            const role = this._waveRoleNodes[i];

            if (!role || !role.node || !role.node.active || role.isDie) {
              continue;
            }

            const pos = role.node.worldPosition;
            role.node.setWorldPosition(pos.x, pos.y, pos.z - moveDistance);
          }
        }

        clampMonsterBehindWaveRole(monster) {
          if (!monster || !monster.node || !monster.node.active || monster.isDie || this._waveRoleNodes.length <= 0) {
            return;
          }

          for (let i = 0; i < this._waveRoleNodes.length; i++) {
            this.clampMonsterBehindSingleWaveRole(monster, this._waveRoleNodes[i]);
          }
        }

        clampMonsterBehindSingleWaveRole(monster, role) {
          var _role$collisionHalfX, _monster$collisionHal;

          if (!role || !role.node || !role.node.active || role.isDie) {
            return;
          }

          const roleHalfZ = this.getWaveRoleCollisionHalfZ(role);
          const roleHalfX = Math.max(0, (_role$collisionHalfX = role.collisionHalfX) != null ? _role$collisionHalfX : 0);
          const monsterHalfZ = this.getMonsterCollisionHalfZ(monster);
          const monsterHalfX = Math.max(0, (_monster$collisionHal = monster.collisionHalfX) != null ? _monster$collisionHal : 0);
          const roleCenter = role.getCollisionWorldPosition(tempV3);
          const roleCenterX = roleCenter.x;
          const roleCenterZ = roleCenter.z;
          const monsterCenter = monster.getCollisionWorldPosition(tempV3);
          const monsterCenterX = monsterCenter.x;
          const monsterCenterZ = monsterCenter.z;

          if (Math.abs(monsterCenterX - roleCenterX) > roleHalfX + monsterHalfX + this.waveRolePushGap) {
            return;
          }

          const roleMinZ = roleCenterZ - roleHalfZ - this.waveRolePushGap;
          const roleMaxZ = roleCenterZ + roleHalfZ + this.waveRolePushGap;
          const monsterMinZ = monsterCenterZ - monsterHalfZ;
          const monsterMaxZ = monsterCenterZ + monsterHalfZ;

          if (monsterMaxZ < roleMinZ || monsterMinZ > roleMaxZ) {
            return;
          }

          const limitCenterZ = roleCenterZ + roleHalfZ + monsterHalfZ + this.waveRolePushGap;
          this.setCollisionCenterWorldZ(monster, limitCenterZ);
        }

        clampMonstersBehindWaveRole(waveIndex) {
          if (waveIndex < 0 || waveIndex >= this._waveRoleNodes.length) {
            return;
          }

          const role = this._waveRoleNodes[waveIndex];

          if (!role || !role.node || !role.node.active || role.isDie) {
            return;
          }

          for (let i = 0; i < this._monsterList.length; i++) {
            const monster = this._monsterList[i];

            if (!monster || !monster.node || !monster.node.active || monster.isDie) {
              continue;
            }

            this.clampMonsterBehindSingleWaveRole(monster, role);
          }
        }

        setCollisionCenterWorldZ(target, centerZ) {
          if (!(target != null && target.node)) {
            return;
          }

          const hitZ = target.getCollisionWorldPosition(tempV3).z;
          const nodePos = target.node.worldPosition;
          target.node.setWorldPosition(nodePos.x, nodePos.y, nodePos.z + centerZ - hitZ);
        }

        getCollisionCenterOffsetZ(target) {
          if (!(target != null && target.node)) {
            return 0;
          }

          return target.getCollisionWorldPosition(tempV3).z - target.node.worldPosition.z;
        }

        registerMonsterRebirthLayoutData(monster, waveIndex, baseX = (_monster$initX => (_monster$initX = monster == null ? void 0 : monster.initX) != null ? _monster$initX : 0)(), baseZ = ((_monster$node$z, _monster$node) => (_monster$node$z = monster == null || (_monster$node = monster.node) == null ? void 0 : _monster$node.z) != null ? _monster$node$z : 0)()) {
          if (!monster || !monster.node) {
            return;
          }

          this._monsterRebirthOrderMap.set(monster, this._monsterRebirthOrderIndex++);

          this._monsterSpawnLocalXMap.set(monster, monster.initX);

          this._monsterSpawnLocalZMap.set(monster, monster.node.z);

          this._monsterRebirthOffsetMap.set(monster, new Vec3(monster.initX - baseX, 0, monster.node.z - baseZ));

          if (waveIndex < 0) {
            return;
          }

          this._monsterWaveIndexMap.set(monster, waveIndex);

          this.recordRebirthWaveInitialZ(waveIndex, monster.node.z);
        }

        recordRebirthWaveInitialZ(waveIndex, localZ) {
          if (waveIndex < 0 || !Number.isFinite(localZ)) {
            return;
          }

          const currentMin = this._rebirthWaveInitialMinZList[waveIndex];
          const currentMax = this._rebirthWaveInitialMaxZList[waveIndex];
          this._rebirthWaveInitialMinZList[waveIndex] = Number.isFinite(currentMin) ? Math.min(currentMin, localZ) : localZ;
          this._rebirthWaveInitialMaxZList[waveIndex] = Number.isFinite(currentMax) ? Math.max(currentMax, localZ) : localZ;
        }

        getMonsterRebirthSortValue(monster) {
          var _monster$node$z2, _monster$node2;

          const order = this._monsterRebirthOrderMap.get(monster);

          if (typeof order === 'number') {
            return order;
          }

          const spawnZ = this._monsterSpawnLocalZMap.get(monster);

          if (typeof spawnZ === 'number') {
            return spawnZ;
          }

          return (_monster$node$z2 = monster == null || (_monster$node2 = monster.node) == null ? void 0 : _monster$node2.z) != null ? _monster$node$z2 : 0;
        }

        getInitialWaveBoundaryGap(prevWaveIndex, currentWaveIndex) {
          let gap = 0;

          for (let i = prevWaveIndex + 1; i <= currentWaveIndex; i++) {
            const prevMax = this._rebirthWaveInitialMaxZList[i - 1];
            const currentMin = this._rebirthWaveInitialMinZList[i];

            if (!Number.isFinite(prevMax) || !Number.isFinite(currentMin)) {
              continue;
            }

            gap += Math.max(0, currentMin - prevMax);
          }

          return gap;
        }

        buildRebirthMonsterLayout() {
          const layout = new WeakMap();
          const waveMap = new Map();

          for (let i = 0; i < this._monsterList.length; i++) {
            const monster = this._monsterList[i];

            if (!monster || !monster.node || !monster.node.active || monster.isDie) {
              continue;
            }

            const waveIndex = Math.max(0, this.getWaveIndexByMonster(monster));
            let list = waveMap.get(waveIndex);

            if (!list) {
              list = [];
              waveMap.set(waveIndex, list);
            }

            list.push(monster);
          }

          if (waveMap.size <= 0) {
            return layout;
          }

          const waveIndexList = Array.from(waveMap.keys()).sort((a, b) => a - b);
          let cursorZ = this.stage_1 + this.rebirthMonsterFrontRetreatZ;
          const rowGapZ = Math.max(0.01, this.layerGapZ);
          const bossExcludeZ = Math.max(0, this.brotherExcludeZ);
          const waveExtraGapZ = Math.max(0, this.rebirthMonsterWaveExtraGapZ);
          const randomZRange = Math.max(0, this.rebirthMonsterRandomZ);
          let prevWaveIndex = waveIndexList[0];

          for (let i = 0; i < waveIndexList.length; i++) {
            const waveIndex = waveIndexList[i];
            const list = waveMap.get(waveIndex);

            if (!list || list.length <= 0) {
              continue;
            }

            if (i > 0) {
              cursorZ += this.getInitialWaveBoundaryGap(prevWaveIndex, waveIndex) + waveExtraGapZ;
            }

            list.sort((a, b) => this.getMonsterRebirthSortValue(a) - this.getMonsterRebirthSortValue(b));
            const rowCount = Math.max(1, Math.floor(this.rowCount));
            let waveCursorZ = cursorZ;

            for (let j = 0; j < list.length;) {
              const monster = list[j];

              if (monster.monsterType === (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
                error: Error()
              }), MonsterType) : MonsterType).ZombieBrother) {
                var _this$_monsterSpawnLo;

                const spawnX = (_this$_monsterSpawnLo = this._monsterSpawnLocalXMap.get(monster)) != null ? _this$_monsterSpawnLo : this.getSpawnX(0);
                monster.initX = spawnX;
                const targetZ = waveCursorZ + bossExcludeZ;
                const targetX = this.getMonsterMoveTargetX(monster, this.node.worldPositionZ + targetZ);
                layout.set(monster, new Vec3(targetX, monster.node.y, targetZ));
                waveCursorZ += bossExcludeZ * 2;
                j++;
                continue;
              }

              const babyList = [];

              while (j < list.length && list[j].monsterType !== (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
                error: Error()
              }), MonsterType) : MonsterType).ZombieBrother) {
                babyList.push(list[j]);
                j++;
              }

              const rowTotal = Math.max(1, Math.ceil(babyList.length / rowCount));

              for (let k = 0; k < babyList.length; k++) {
                var _this$_monsterSpawnLo2;

                const baby = babyList[k];
                const row = Math.floor(k / rowCount);

                const offset = this._monsterRebirthOffsetMap.get(baby);

                const offsetZ = offset ? Math.max(-randomZRange, Math.min(randomZRange, offset.z)) : 0;
                const spawnX = (_this$_monsterSpawnLo2 = this._monsterSpawnLocalXMap.get(baby)) != null ? _this$_monsterSpawnLo2 : baby.initX;
                baby.initX = spawnX;
                const targetZ = waveCursorZ + row * rowGapZ + offsetZ;
                const targetX = this.getMonsterMoveTargetX(baby, this.node.worldPositionZ + targetZ);
                layout.set(baby, new Vec3(targetX, baby.node.y, targetZ));
              }

              waveCursorZ += rowTotal * rowGapZ;
            }

            cursorZ = waveCursorZ;
            prevWaveIndex = waveIndex;
          }

          return layout;
        }

        logRebirthFrontDistance(layout) {
          var _instance$roleList, _instance;

          if (!this.rebirthMonsterDistanceLog) {
            return;
          }

          let frontMonsterWorldZ = Number.POSITIVE_INFINITY;
          let frontMonsterName = '';

          for (let i = 0; i < this._monsterList.length; i++) {
            const monster = this._monsterList[i];
            const targetPos = layout.get(monster);

            if (!targetPos) {
              continue;
            }

            const targetWorldZ = this.node.worldPositionZ + targetPos.z;

            if (targetWorldZ < frontMonsterWorldZ) {
              var _monster$node$name, _monster$node3;

              frontMonsterWorldZ = targetWorldZ;
              frontMonsterName = (_monster$node$name = (_monster$node3 = monster.node) == null ? void 0 : _monster$node3.name) != null ? _monster$node$name : '';
            }
          }

          if (!Number.isFinite(frontMonsterWorldZ)) {
            return;
          }

          let playerFrontWorldZ = Number.NEGATIVE_INFINITY;
          let playerFrontName = '';
          const roleList = (_instance$roleList = (_instance = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance) == null ? void 0 : _instance.roleList) != null ? _instance$roleList : [];

          for (let i = 0; i < roleList.length; i++) {
            var _role$node;

            const role = roleList[i];

            if (!(role != null && (_role$node = role.node) != null && _role$node.activeInHierarchy)) {
              continue;
            }

            const roleWorldZ = role.node.worldPositionZ;

            if (roleWorldZ > playerFrontWorldZ) {
              playerFrontWorldZ = roleWorldZ;
              playerFrontName = role.node.name;
            }
          }

          const stageLineWorldZ = this.node.worldPositionZ + this.stage_1;
          const distanceToStageLine = frontMonsterWorldZ - stageLineWorldZ;
          const distanceToPlayerFront = Number.isFinite(playerFrontWorldZ) ? frontMonsterWorldZ - playerFrontWorldZ : Number.NaN;
          console.log(`[MonsterCreate] 再来一次距离: frontMonster=${frontMonsterName}, frontMonsterWorldZ=${frontMonsterWorldZ.toFixed(3)}, stageLineWorldZ=${stageLineWorldZ.toFixed(3)}, distanceToStageLine=${distanceToStageLine.toFixed(3)}, playerFront=${playerFrontName}, playerFrontWorldZ=${Number.isFinite(playerFrontWorldZ) ? playerFrontWorldZ.toFixed(3) : 'NaN'}, distanceToPlayerFront=${Number.isFinite(distanceToPlayerFront) ? distanceToPlayerFront.toFixed(3) : 'NaN'}`);
        }

        tryAssignMonsterAttackTarget(monster) {
          var _targetRole$node;

          if (!(monster != null && monster.move) || !(_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance || (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance.isDie || (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance.roleList.length <= 0) {
            return false;
          }

          const targetRole = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance.getMonsterAttackTarget(monster.node.worldPosition);

          if (!(targetRole != null && (_targetRole$node = targetRole.node) != null && _targetRole$node.activeInHierarchy)) {
            return false;
          }

          monster.attackTarget = targetRole.node;
          monster.move.moveMod = (_crd && MoveModEnum === void 0 ? (_reportPossibleCrUseOfMoveModEnum({
            error: Error()
          }), MoveModEnum) : MoveModEnum).targetMove;
          monster.move.target = monster.attackTarget;
          return true;
        }

        checkWaveRolePlayerCollision() {
          const player = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance;

          if (!player || player.isDie || !player.roleList || player.roleList.length <= 0 || this._waveRoleNodes.length <= 0) {
            return;
          }

          let hasRoleDie = false;

          for (let i = 0; i < this._waveRoleNodes.length; i++) {
            var _waveRole$collisionHa;

            const waveRole = this._waveRoleNodes[i];

            if (!waveRole || !waveRole.node || !waveRole.node.active || waveRole.isDie) {
              continue;
            }

            const roleCenter = waveRole.getCollisionWorldPosition(tempV3);
            const centerX = roleCenter.x;
            const centerZ = roleCenter.z;
            const halfX = Math.max(0, (_waveRole$collisionHa = waveRole.collisionHalfX) != null ? _waveRole$collisionHa : 0);
            const halfZ = this.getWaveRoleCollisionHalfZ(waveRole);

            for (let j = player.roleList.length - 1; j >= 0; j--) {
              const role = player.roleList[j];

              if (!this.isRoleInWaveRoleBox(role, centerX, centerZ, halfX, halfZ)) {
                continue;
              }

              player.roleList.splice(j, 1);
              player.roleDie(role);
              hasRoleDie = true;
            }
          }

          if (hasRoleDie) {
            player.requestShrinkAfterRoleLoss();
          }
        }

        isRoleInWaveRoleBox(role, centerX, centerZ, halfX, halfZ) {
          if (!role || !role.node || !role.node.active) {
            return false;
          }

          const pos = role.node.worldPosition;
          return Math.abs(pos.x - centerX) <= halfX + this.waveRolePlayerHalfX && Math.abs(pos.z - centerZ) <= halfZ + this.waveRolePlayerHalfZ;
        }

        getWaveRoleLimitedSpawnZ(localZ, monster) {
          if (this._waveRoleNodes.length <= 0) {
            return localZ;
          }

          let resultZ = localZ;

          for (let pass = 0; pass < this._waveRoleNodes.length; pass++) {
            let changed = false;

            for (let i = 0; i < this._waveRoleNodes.length; i++) {
              const limitedZ = this.getSingleWaveRoleLimitedSpawnZ(resultZ, this._waveRoleNodes[i], monster);

              if (limitedZ > resultZ) {
                resultZ = limitedZ;
                changed = true;
              }
            }

            if (!changed) {
              break;
            }
          }

          return resultZ;
        }

        getQuestSpawnCount(quest) {
          var _quest$monsterCountMa, _quest$actualSpawnCou;

          const defaultCount = Math.max(0, Math.floor((_quest$monsterCountMa = quest == null ? void 0 : quest.monsterCountMax) != null ? _quest$monsterCountMa : 0));
          const actualCount = Math.max(0, Math.floor((_quest$actualSpawnCou = quest == null ? void 0 : quest.actualSpawnCount) != null ? _quest$actualSpawnCou : 0));
          return actualCount > 0 ? actualCount : defaultCount;
        }

        getQuestRangeCount(quest) {
          var _quest$zRangeCountBas;

          const spawnCount = this.getQuestSpawnCount(quest);
          const rangeCount = Math.max(0, Math.floor((_quest$zRangeCountBas = quest == null ? void 0 : quest.zRangeCountBase) != null ? _quest$zRangeCountBas : 0));
          return Math.max(spawnCount, rangeCount > 0 ? rangeCount : spawnCount);
        }

        buildSparseWaveSpawnSlotSet(spawnCount, rangeCount) {
          const slotSet = new Set();

          if (spawnCount <= 0 || rangeCount <= 0) {
            return slotSet;
          }

          if (spawnCount >= rangeCount) {
            for (let i = 0; i < rangeCount; i++) {
              slotSet.add(i);
            }

            return slotSet;
          }

          if (spawnCount === 1) {
            slotSet.add(0);
            return slotSet;
          }

          for (let i = 0; i < spawnCount; i++) {
            const slotIndex = Math.round(i * (rangeCount - 1) / (spawnCount - 1));
            slotSet.add(Math.min(rangeCount - 1, Math.max(0, slotIndex)));
          }

          return slotSet;
        }

        spawnBabyAtCursor(quest, waveIndex, baseNextSpawnZ, basePosIndex) {
          const type = this.getQuestBabyType(quest);
          const monsterIns = this.monsterMatIns[type];
          const monster = this.getMonster(type);

          this._monsterList.push(monster);

          this.node.addChild(monster.node);

          if (!monsterIns) {
            this.monsterMatIns[type] = 1;
            monster.flashDie(0.01);
          }

          const baseLocalZ = this.getSpawnZ(baseNextSpawnZ);
          const baseRawX = (basePosIndex - (this.rowCount - 1) / 2) * this.offX;
          const rawZ = baseNextSpawnZ + (Math.random() - 0.5) * (this.layerGapZ + this.spawnRandomZ * 2);
          const z = this.getWaveRoleLimitedSpawnZ(rawZ, monster);
          const rawX = (Math.random() - 0.5) * (this.offX + this.spawnRandomX * 2) + baseRawX;
          const worldZ = this.getSpawnWorldZ(z);
          const spawnX = this.getSpawnX(rawX);
          const x = this.shouldLimitMonsterXAtZ(worldZ) ? this.clampMonsterX(spawnX) : spawnX;
          monster.initX = spawnX;
          monster.init(this.getQuestDifficulty(quest, 1), this.getQuestFixedHp(quest));
          monster.move.moveMod = (_crd && MoveModEnum === void 0 ? (_reportPossibleCrUseOfMoveModEnum({
            error: Error()
          }), MoveModEnum) : MoveModEnum).PosMove;
          monster.node.setPosition(x, this.getSpawnY(), this.getSpawnZ(z));
          this.applySpawnVariation(monster);
          tempV3.set(monster.node.worldPosition);
          tempV3.x = this.getMonsterMoveTargetX(monster, worldZ);
          tempV3.z = this.stage_0;
          monster.move.pos = tempV3;
          this.registerMonsterRebirthLayoutData(monster, waveIndex, this.getSpawnX(baseRawX), baseLocalZ);
          return z > rawZ ? z : baseNextSpawnZ;
        }

        getSingleWaveRoleLimitedSpawnZ(localZ, waveRole, monster) {
          if (!waveRole || !waveRole.node || !waveRole.node.active || waveRole.isDie) {
            return localZ;
          }

          const roleCenterZ = waveRole.getCollisionWorldPosition(tempV3).z;
          const roleHalfZ = this.getWaveRoleCollisionHalfZ(waveRole);
          const monsterHalfZ = this.getMonsterCollisionHalfZ(monster);
          const monsterCenterOffsetZ = this.getCollisionCenterOffsetZ(monster);
          const monsterCenterZ = this.getSpawnWorldZ(localZ) + monsterCenterOffsetZ;
          const monsterMinZ = monsterCenterZ - monsterHalfZ;
          const monsterMaxZ = monsterCenterZ + monsterHalfZ;
          const roleMinZ = roleCenterZ - roleHalfZ - this.waveRolePushGap;
          const roleMaxZ = roleCenterZ + roleHalfZ + this.waveRolePushGap;

          if (monsterMaxZ < roleMinZ || monsterMinZ > roleMaxZ) {
            return localZ;
          }

          return roleMaxZ + monsterHalfZ + this.waveRolePushGap - monsterCenterOffsetZ - this.node.worldPositionZ - this.getSpawnOffsetZ();
        }

        getFrontMonsterByWave(waveIndex) {
          let frontMonster = null;

          for (let i = 0; i < this._monsterList.length; i++) {
            const monster = this._monsterList[i];

            if (!monster || !monster.node || !monster.node.active || monster.isDie) {
              continue;
            }

            if (this.getWaveIndexByMonster(monster) !== waveIndex) {
              continue;
            }

            if (!frontMonster || monster.node.worldPositionZ < frontMonster.node.worldPositionZ) {
              frontMonster = monster;
            }
          }

          return frontMonster;
        }

        getFrontMonsterByWaveLayout(waveIndex, layout) {
          let frontMonster = null;
          let frontZ = Number.POSITIVE_INFINITY;

          for (let i = 0; i < this._monsterList.length; i++) {
            const monster = this._monsterList[i];

            if (!monster || !monster.node || !monster.node.active || monster.isDie) {
              continue;
            }

            if (this.getWaveIndexByMonster(monster) !== waveIndex) {
              continue;
            }

            const targetPos = layout == null ? void 0 : layout.get(monster);
            const targetWorldZ = targetPos ? this.node.worldPositionZ + targetPos.z : monster.node.worldPositionZ;

            if (targetWorldZ < frontZ) {
              frontZ = targetWorldZ;
              frontMonster = monster;
            }
          }

          return frontMonster;
        }

        getCollisionCenterWorldZByLayout(monster, layout) {
          const targetPos = layout == null ? void 0 : layout.get(monster);

          if (!targetPos) {
            return monster.getCollisionWorldPosition(tempV3).z;
          }

          return this.node.worldPositionZ + targetPos.z + this.getCollisionCenterOffsetZ(monster);
        }

        getWaveIndexByMonster(monster) {
          if (!monster) {
            return -1;
          }

          const bindWaveIndex = this._monsterWaveIndexMap.get(monster);

          if (typeof bindWaveIndex === 'number') {
            return bindWaveIndex;
          }

          return this.getWaveIndexByMonsterZ(monster.node.worldPositionZ);
        }

        getWaveRoleCollisionHalfZ(role) {
          var _role$getBlockCollisi, _role$collisionHalfZ;

          return (_role$getBlockCollisi = role == null || role.getBlockCollisionHalfZ == null ? void 0 : role.getBlockCollisionHalfZ()) != null ? _role$getBlockCollisi : Math.max(0.65, (_role$collisionHalfZ = role == null ? void 0 : role.collisionHalfZ) != null ? _role$collisionHalfZ : 0.65);
        }

        getMonsterCollisionHalfZ(monster) {
          var _monster$collisionHal2;

          return Math.max(0, (_monster$collisionHal2 = monster == null ? void 0 : monster.collisionHalfZ) != null ? _monster$collisionHal2 : 0);
        }

        getWaveIndexByMonsterZ(z) {
          if (this._waveStageStartZList.length <= 0) {
            return -1;
          }

          const localZ = z - this.node.worldPositionZ;

          for (let i = 0; i < this._waveStageStartZList.length; i++) {
            const currentStart = this._waveStageStartZList[i];
            const nextStart = i + 1 < this._waveStageStartZList.length ? this._waveStageStartZList[i + 1] : Number.POSITIVE_INFINITY;

            if (localZ >= currentStart && localZ < nextStart) {
              return i;
            }
          }

          return localZ < this._waveStageStartZList[0] ? 0 : this._waveStageStartZList.length - 1;
        }

        getWaveStageStartZList(stageCount) {
          const result = [];
          const stages = this.monsterCreateQueue.monsterCreateInfoList;

          if (!stages || stages.length <= 0 || stageCount <= 0) {
            return result;
          }

          let nextSpawnZ = 0;
          let rowCount = 0;

          for (let i = 0; i < stages.length && result.length < stageCount; i++) {
            const quest = stages[i];
            const loopMax = quest.loopMax > 0 ? quest.loopMax : 1;
            const loopCount = quest.loopMax == -1 ? 1 : loopMax;

            for (let loop = 0; loop < loopCount && result.length < stageCount; loop++) {
              result.push(this.getSpawnZ(nextSpawnZ));

              if (quest.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
                error: Error()
              }), MonsterType) : MonsterType).ZombieBrother) {
                nextSpawnZ += this.brotherExcludeZ;
                nextSpawnZ += this.brotherExcludeZ;
              } else {
                const rangeCount = this.getQuestRangeCount(quest);

                for (let count = 0; count < rangeCount; count++) {
                  rowCount++;

                  if (rowCount == this.rowCount) {
                    nextSpawnZ += this.layerGapZ;
                    rowCount = 0;
                  }
                }
              }

              nextSpawnZ += quest.brotherExcludeZ;
            }
          }

          return result;
        }
        /** 生成ZombieBrother，放在排斥区域的中间 */


        spawnBrother(quest = null, waveIndex = -1) {
          const monster = this.getMonster((_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother);

          this._monsterList.push(monster);

          this.node.addChild(monster.node); // const layer = Math.floor(this._babyCountSinceLastBrother / this.rowCount);
          // const l = this.brotherInterval / this.rowCount;
          // let z = this._finallyBoss ? this._finallyBoss.z + this.brotherExcludeZ * 2 + this.layerGapZ * layer : this.layerCount * (this.layerGapZ * l + this.brotherExcludeZ) + this.brotherExcludeZ + this.layerGapZ * layer;

          this._nextSpawnZ += this.brotherExcludeZ;
          const baseLocalZ = this.getSpawnZ(this._nextSpawnZ);
          const z = this.getWaveRoleLimitedSpawnZ(this._nextSpawnZ, monster);
          const worldZ = this.getSpawnWorldZ(z);
          this._nextSpawnZ = z;
          this._nextSpawnZ += this.brotherExcludeZ;
          monster.init(this.getQuestDifficulty(quest, this._monsterBossCount * 2 + 1), this.getQuestFixedHp(quest));
          monster.move.moveMod = (_crd && MoveModEnum === void 0 ? (_reportPossibleCrUseOfMoveModEnum({
            error: Error()
          }), MoveModEnum) : MoveModEnum).PosMove;
          monster.initX = this.getSpawnX(0);
          monster.node.setPosition(this.clampMonsterX(monster.initX), this.getSpawnY(), this.getSpawnZ(z));
          this.applySpawnVariation(monster);
          tempV3.set(monster.node.worldPosition);
          tempV3.x = this.getMonsterMoveTargetX(monster, worldZ);
          tempV3.z = this.stage_0;
          monster.move.pos = tempV3;
          this.registerMonsterRebirthLayoutData(monster, waveIndex, this.getSpawnX(0), baseLocalZ); // this._brotherZPositions.push(z);

          this._monsterBossCount++;
        }
        /** 生成ZombieBaby，自动避开ZombieBrother的排斥区域 */


        spawnBaby(quest = null, waveIndex = -1) {
          const type = this.getQuestBabyType(quest);
          const monsterIns = this.monsterMatIns[type];
          const monster = this.getMonster(type);

          this._monsterList.push(monster);

          this.node.addChild(monster.node);

          if (!monsterIns) {
            this.monsterMatIns[type] = 1;
            monster.flashDie(0.01);
          } // const layer = Math.floor(this._babyCountSinceLastBrother / this.rowCount);
          // const l = this.brotherInterval / this.rowCount;
          // let z = this._finallyBoss ? this._finallyBoss.z + this.brotherExcludeZ + this.layerGapZ * layer : this.layerCount * (this.layerGapZ * l + this.brotherExcludeZ) + this.layerGapZ * layer;
          // 安全检查：确保不在排斥区域内
          // let needCheck = true;
          // while (needCheck) {
          //     needCheck = false;
          //     for (const brotherZ of this._brotherZPositions) {
          //         if (z >= brotherZ - this.brotherExcludeZ && z <= brotherZ + this.brotherExcludeZ) {
          //             z = brotherZ + this.brotherExcludeZ + 0.1;
          //             this._nextSpawnZ = z;
          //             this._babiesAtCurrentZ = 0;
          //             needCheck = true;
          //             break;
          //         }
          //     }
          // }


          const baseLocalZ = this.getSpawnZ(this._nextSpawnZ);
          const baseRawX = (this.posIndex - (this.rowCount - 1) / 2) * this.offX;
          const rawZ = this._nextSpawnZ + (Math.random() - 0.5) * (this.layerGapZ + this.spawnRandomZ * 2);
          const z = this.getWaveRoleLimitedSpawnZ(rawZ, monster);
          const rawX = (Math.random() - 0.5) * (this.offX + this.spawnRandomX * 2) + baseRawX;
          const worldZ = this.getSpawnWorldZ(z);
          const spawnX = this.getSpawnX(rawX);
          const x = this.shouldLimitMonsterXAtZ(worldZ) ? this.clampMonsterX(spawnX) : spawnX;
          monster.initX = spawnX;
          monster.init(this.getQuestDifficulty(quest, 1), this.getQuestFixedHp(quest));
          this.posIndex = (this.posIndex + 1) % this.rowCount;
          monster.move.moveMod = (_crd && MoveModEnum === void 0 ? (_reportPossibleCrUseOfMoveModEnum({
            error: Error()
          }), MoveModEnum) : MoveModEnum).PosMove;
          monster.node.setPosition(x, this.getSpawnY(), this.getSpawnZ(z));
          this.applySpawnVariation(monster);
          tempV3.set(monster.node.worldPosition);
          tempV3.x = this.getMonsterMoveTargetX(monster, worldZ);
          tempV3.z = this.stage_0;
          monster.move.pos = tempV3;
          this.registerMonsterRebirthLayoutData(monster, waveIndex, this.getSpawnX(baseRawX), baseLocalZ);

          if (z > rawZ && z > this._nextSpawnZ) {
            this._nextSpawnZ = z;
          }

          this._rowCount++;

          if (this._rowCount == this.rowCount) {
            this._nextSpawnZ += this.layerGapZ;
            this._rowCount = 0;
          }
        }

        getSpawnX(baseX) {
          return baseX + this.spawnPositionOffset.x;
        }

        getSpawnY() {
          return this.spawnPositionOffset.y;
        }

        getSpawnZ(baseZ) {
          return baseZ + this.getSpawnOffsetZ();
        }

        getSpawnWorldZ(baseZ) {
          return this.node.worldPositionZ + this.getSpawnZ(baseZ);
        }

        getSpawnOffsetZ() {
          return this.spawnPositionOffset.z;
        }

        getQuestFixedHp(quest) {
          return quest && quest.monsterHp > 0 ? quest.monsterHp : 0;
        }

        getQuestDifficulty(quest, defaultDifficulty) {
          if (quest && quest.difficulty > 0) {
            return quest.difficulty;
          }

          return defaultDifficulty;
        }

        getQuestBabyType(quest) {
          if (quest && quest.monsterType !== (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother && quest.mixBaby01) {
            const baby1Ratio = Math.max(0, Math.min(1, quest.baby1Ratio));
            return Math.random() < baby1Ratio ? (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
              error: Error()
            }), MonsterType) : MonsterType).ZombieBaby_1 : (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
              error: Error()
            }), MonsterType) : MonsterType).ZombieBaby_0;
          }

          if (quest && quest.monsterType !== (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother) {
            return quest.monsterType;
          }

          return Math.random() < 0.5 ? (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBaby_0 : (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBaby_1;
        }

        applySpawnVariation(monster) {
          var _monster$fbx;

          const scale = 1 + (Math.random() - 0.5) * this.spawnScaleRandom * 2;
          monster.node.setScale(scale, scale, scale);
          const yaw = monster.monsterType === (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother ? 0 : (Math.random() - 0.5) * this.spawnYawRandom * 2;
          monster.node.setRotationFromEuler(0, 180 + yaw, 0);
          (_monster$fbx = monster.fbx) == null || (_monster$fbx = _monster$fbx.node) == null || _monster$fbx.setRotationFromEuler(0, 0, 0);
          monster.randomizeRunAnimation();
        }

        getFrontMonsterWorldZ(defaultZ = this.stage_0) {
          let frontZ = Number.POSITIVE_INFINITY;

          for (let i = 0; i < this._monsterList.length; i++) {
            const monster = this._monsterList[i];

            if (!monster || !monster.node || !monster.node.active || monster.isDie) {
              continue;
            }

            if (monster.node.worldPositionZ < frontZ) {
              frontZ = monster.node.worldPositionZ;
            }
          }

          return Number.isFinite(frontZ) ? frontZ : defaultZ;
        }

        clampMonsterX(x) {
          const halfX = this.getMiddleLimitHalfX();

          if (x > halfX) {
            return halfX;
          }

          if (x < -halfX) {
            return -halfX;
          }

          return x;
        }

        shouldLimitMonsterXAtZ(z) {
          for (let i = 0; i < this.lalianLimitRanges.length; i++) {
            const range = this.lalianLimitRanges[i];

            if (z >= range.minZ && z <= range.maxZ) {
              return true;
            }
          }

          return false;
        }

        getMiddleLimitHalfX() {
          return Math.max(0, this.middleLaneHalfX);
        }

        getMonsterMoveTargetX(monster, worldZ) {
          var _monster$initX2;

          const freeX = (_monster$initX2 = monster == null ? void 0 : monster.initX) != null ? _monster$initX2 : 0;
          return this.shouldLimitMonsterXAtZ(worldZ) ? this.clampMonsterX(freeX) : freeX;
        }

        syncMonsterMoveTargetX(monster) {
          if (!monster.move || monster.move.moveMod != (_crd && MoveModEnum === void 0 ? (_reportPossibleCrUseOfMoveModEnum({
            error: Error()
          }), MoveModEnum) : MoveModEnum).PosMove) {
            return;
          }

          if (this.isTrackingPlayerTarget(monster)) {
            return;
          }

          monster.move.pos.x = this.getMonsterMoveTargetX(monster, monster.node.worldPositionZ);
        }

        limitMonsterToMiddleLane(monster) {
          if (this.isTrackingPlayerTarget(monster)) {
            return;
          }

          if (!this.shouldLimitMonsterXAtZ(monster.node.worldPositionZ)) {
            return;
          }

          const x = this.clampMonsterX(monster.node.x);

          if (monster.node.x != x) {
            monster.node.x = x;
          }
        }

        isTrackingPlayerTarget(monster) {
          return !!(monster != null && monster.attackTarget);
        }

        getMonster(type = (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
          error: Error()
        }), MonsterType) : MonsterType).ZombieBaby_0) {
          let monster = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).monster + type);

          if (!monster) {
            const node = (_crd && PrefabsManager === void 0 ? (_reportPossibleCrUseOfPrefabsManager({
              error: Error()
            }), PrefabsManager) : PrefabsManager).instance.GetPrefabsIns((_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
              error: Error()
            }), PrefabsEnum) : PrefabsEnum).monster, type);
            monster = node.getComponent(_crd && MonsterBattleTaerget === void 0 ? (_reportPossibleCrUseOfMonsterBattleTaerget({
              error: Error()
            }), MonsterBattleTaerget) : MonsterBattleTaerget);
          }

          monster.node.active = true;
          monster.init(1);

          if (monster.move) {
            monster.move.speed = Math.max(0, this.monsterSpeed);
          }

          monster.attackTarget = null;
          return monster;
        } // private isFlowIN = false;


        TimeFlowsBackWard() {
          // this.isFlowIN = true;
          this._isRestoringWaveRolesAfterRebirth = true;
          const rebirthLayout = this.buildRebirthMonsterLayout();
          this.logRebirthFrontDistance(rebirthLayout);
          this.hideWaveRolesDuringRebirth();

          for (let i = 0; i < this._monsterList.length; i++) {
            var _monster$node4;

            const monster = this._monsterList[i];

            if (!monster || monster.isDie || !((_monster$node4 = monster.node) != null && _monster$node4.active) || !monster.move) {
              continue;
            }

            monster.prepareForRebirthRetreat();
            const targetPos = rebirthLayout.get(monster);

            if (!targetPos) {
              monster.move.autoMove = true;
              continue;
            }

            tween(monster.node).to(0.4, {
              x: targetPos.x,
              z: targetPos.z
            }).start();
          }

          this.scheduleOnce(() => {
            this.restoreWaveRolesAfterRebirth(rebirthLayout);
            this.resumeMonstersAfterRebirth();
          }, 0.45); // this.scheduleOnce(() => {
          //     this.isFlowIN = false;
          // }, 0.4);
        }

        hideWaveRolesDuringRebirth() {
          if (!this._waveRoleNodes.length) {
            return;
          }

          for (let i = 0; i < this._waveRoleNodes.length; i++) {
            const role = this._waveRoleNodes[i];

            if (!(role != null && role.node)) {
              continue;
            }

            role.node.active = false;
          }
        }

        restoreWaveRolesAfterRebirth(rebirthLayout) {
          if (!this._waveRoleNodes.length) {
            this._isRestoringWaveRolesAfterRebirth = false;
            return;
          }

          for (let i = 0; i < this._waveRoleNodes.length; i++) {
            const role = this._waveRoleNodes[i];

            if (!role || !role.node) {
              continue;
            }

            if (role.isDie) {
              role.node.active = false;
              continue;
            } // hideWaveRolesDuringRebirth 设 inactive 后，
            // BulletMonsterCollisionManager.update 会把 !node.active 的目标移除，
            // 所以活着的 Role 也需要重新注册碰撞


            (_crd && BulletMonsterCollisionManager === void 0 ? (_reportPossibleCrUseOfBulletMonsterCollisionManager({
              error: Error()
            }), BulletMonsterCollisionManager) : BulletMonsterCollisionManager).instance.registerTarget(role);
            role.node.active = true;
            const frontMonster = rebirthLayout ? this.getFrontMonsterByWaveLayout(i, rebirthLayout) : this.getFrontMonsterByWave(i);

            if (!frontMonster || !frontMonster.node) {
              continue;
            }

            const roleHalfZ = this.getWaveRoleCollisionHalfZ(role);
            const monsterHalfZ = this.getMonsterCollisionHalfZ(frontMonster);
            const monsterCenterZ = rebirthLayout ? this.getCollisionCenterWorldZByLayout(frontMonster, rebirthLayout) : frontMonster.getCollisionWorldPosition(tempV3).z;
            const targetCenterZ = monsterCenterZ - monsterHalfZ - this.waveRolePushGap - roleHalfZ;
            this.setCollisionCenterWorldZ(role, targetCenterZ);
            this.clampMonstersBehindWaveRole(i);
          }

          this._isRestoringWaveRolesAfterRebirth = false;
        }

        resumeMonstersAfterRebirth() {
          for (let i = 0; i < this._monsterList.length; i++) {
            var _monster$node5;

            const monster = this._monsterList[i];

            if (!monster || monster.isDie || !((_monster$node5 = monster.node) != null && _monster$node5.active) || !monster.move) {
              continue;
            }

            monster.move.autoMove = true;
            monster.move.speed = Math.max(0, this.monsterSpeed);
            monster.attackTarget = null;

            if (monster.monsterType === (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
              error: Error()
            }), MonsterType) : MonsterType).ZombieBrother && this.tryAssignMonsterAttackTarget(monster)) {
              (_crd && BulletMonsterCollisionManager === void 0 ? (_reportPossibleCrUseOfBulletMonsterCollisionManager({
                error: Error()
              }), BulletMonsterCollisionManager) : BulletMonsterCollisionManager).instance.unregisterTarget(monster);
              (_crd && BulletMonsterCollisionManager === void 0 ? (_reportPossibleCrUseOfBulletMonsterCollisionManager({
                error: Error()
              }), BulletMonsterCollisionManager) : BulletMonsterCollisionManager).instance.registerTarget(monster);
              continue;
            }

            monster.move.moveMod = (_crd && MoveModEnum === void 0 ? (_reportPossibleCrUseOfMoveModEnum({
              error: Error()
            }), MoveModEnum) : MoveModEnum).PosMove;
            tempV3.set(monster.node.worldPosition);
            tempV3.x = this.getMonsterMoveTargetX(monster, tempV3.z);
            tempV3.z = this.stage_1;
            monster.move.pos = tempV3;
            (_crd && BulletMonsterCollisionManager === void 0 ? (_reportPossibleCrUseOfBulletMonsterCollisionManager({
              error: Error()
            }), BulletMonsterCollisionManager) : BulletMonsterCollisionManager).instance.unregisterTarget(monster);
            (_crd && BulletMonsterCollisionManager === void 0 ? (_reportPossibleCrUseOfBulletMonsterCollisionManager({
              error: Error()
            }), BulletMonsterCollisionManager) : BulletMonsterCollisionManager).instance.registerTarget(monster);
          }
        }

        skillXRMonster(x, r, delay = 0) {
          const monsterList = this._monsterList;

          for (let i = monsterList.length - 1; i >= 0; i--) {
            const monster = monsterList[i];
            if (monster.monsterType === (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
              error: Error()
            }), MonsterType) : MonsterType).ZombieBrother) continue;
            if (monster.node.worldPositionZ < this.stage_1) continue;
            const mx = monster.node.worldPositionX;
            const offx = mx - (x - r / 3);
            const absX = Math.abs(offx);
            const fx = offx / absX;

            if (absX <= r) {
              // === 命中：击飞 ===
              const pos = monster.node.worldPosition;
              const endPos = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.V3;
              let px = fx * Math.random() * 20 + fx * 4;
              const skillEndX = px + fx * 8;
              endPos.x = this.shouldLimitMonsterXAtZ(pos.z) ? this.clampMonsterX(skillEndX) : skillEndX;
              endPos.z = pos.z;
              const cPos = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.V3;
              cPos.x = (pos.x + endPos.x) * 0.5;
              cPos.z = pos.z;
              endPos.y = -35 - Math.random() * 30;
              cPos.y = pos.y + 10 + Math.random() * 3; // === 爽感：冲击缩放（PoolManager池化，零GC） ===
              // const sclX = monster.node.scale.x;
              // const sclY = monster.node.scale.y;
              // const sclZ = monster.node.scale.z;
              // const sclTarget = PoolManager.instance.V3;
              // sclTarget.set(sclX * 1.6, sclY * 1.6, sclZ * 1.6);
              // const sclOrig = PoolManager.instance.V3;
              // sclOrig.set(sclX, sclY, sclZ);
              // tween(monster.node)
              //     .to(0.03, { scale: sclTarget }, { easing: 'quadOut' })
              //     .to(0.07, { scale: sclOrig }, { easing: 'quadIn' })
              //     .call(() => {
              //         PoolManager.instance.V3 = sclTarget;
              //         PoolManager.instance.V3 = sclOrig;
              //     })
              //     .start();
              // === 爽感：地面冲击波特效 ===
              // const dustPos = PoolManager.instance.V3;
              // dustPos.set(pos);
              // dustPos.y = 0;
              // EffectManager.instance.addShowEffect(dustPos, EffectEnum.Monsterhit, 3);
              // PoolManager.instance.V3 = dustPos;
              // // === 爽感：原hit保持（模型上方） ===
              // const effectPos = PoolManager.instance.V3;
              // effectPos.set(pos);
              // effectPos.y += 3;
              // EffectManager.instance.addShowEffect(effectPos, EffectEnum.Monsterhit, 2.5);
              // PoolManager.instance.V3 = effectPos;
              // === 爽感：飞行中旋转 ===

              const spinDir = fx;
              const spinAmount = spinDir * (15 + Math.random() * 165);
              const rotV3 = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.V3;
              rotV3.set(0, 0, spinAmount);
              tween(monster.fbx.node).to(0.7 + Math.random() * 0.5, {
                eulerAngles: rotV3
              }, {
                easing: 'sineIn'
              }).call(() => {
                (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                  error: Error()
                }), PoolManager) : PoolManager).instance.V3 = rotV3;
              }).start();
              const time = Math.random() * 0.2;
              const throwHeight = Math.max(0, this.monsterDeathThrowBaseHeight) + Math.random() * Math.max(0, this.monsterDeathThrowRandomHeight);
              (_crd && JumpManager === void 0 ? (_reportPossibleCrUseOfJumpManager({
                error: Error()
              }), JumpManager) : JumpManager).instance.jumpBezierByPoints(monster.node, throwHeight, cPos, endPos).onComplete(() => {
                (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                  error: Error()
                }), PoolManager) : PoolManager).instance.V3 = endPos;
                (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                  error: Error()
                }), PoolManager) : PoolManager).instance.V3 = cPos;
                this.scheduleOnce(() => {
                  monster.node.eulerAngles = Vec3.ZERO;
                  monster.node.active = false;
                  monster.isDieD = true;
                  (_crd && FlashRedManager === void 0 ? (_reportPossibleCrUseOfFlashRedManager({
                    error: Error()
                  }), FlashRedManager) : FlashRedManager).instance.stopFlashRed(monster.node);
                  (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                    error: Error()
                  }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
                    error: Error()
                  }), PoolEnum) : PoolEnum).monster + monster.monsterType, monster);
                }, 0.05 + Math.random() * 0.2);
              }).setDelay(time);
              monster.isDieD = false;
              monster.skipDieFlash = true;
              this.scheduleOnce(() => {
                monster.Hit(200);
              }, time);
              monsterList.splice(i, 1);
            } // else if (absX <= r * 3.5 && monster.node.worldPositionZ > this.stage_0) {
            //     // === 范围边缘：横向推移（PoolManager池化，零GC） ===
            //     let px = fx * Math.random() * 4 + fx * 2;
            //     const bx = px + mx;
            //     if (bx > this.disX) {
            //         px = this.disX - mx;
            //     } else if (bx < -this.disX) {
            //         px = -this.disX - mx;
            //     }
            //     const targetX = monster.node.x + px;
            //     const dur = 0.35 + Math.random() * 0.15;
            //     const sclX = monster.node.scale.x;
            //     const sclY = monster.node.scale.y;
            //     const sclZ = monster.node.scale.z;
            //     const sclTarget = PoolManager.instance.V3;
            //     sclTarget.set(sclX * 1.3, sclY * 1.3, sclZ * 1.3);
            //     const sclOrig = PoolManager.instance.V3;
            //     sclOrig.set(sclX, sclY, sclZ);
            //     tween(monster.node)
            //         .to(0.03, { scale: sclTarget }, { easing: 'quadOut' })
            //         .to(0.07, { scale: sclOrig }, { easing: 'quadIn' })
            //         .call(() => {
            //             PoolManager.instance.V3 = sclTarget;
            //             PoolManager.instance.V3 = sclOrig;
            //         })
            //         .start();
            //     tween(monster.node)
            //         .to(dur, { x: targetX }, { easing: 'circOut' })
            //         .start();
            // }

          } // === 爽感：根据命中数触发摄像机震动 ===


          (_crd && CameraMove === void 0 ? (_reportPossibleCrUseOfCameraMove({
            error: Error()
          }), CameraMove) : CameraMove).instance.Shake2(10);
        }

      }, _class9.instance = null, _class9.isStartMove = false, _class9), (_descriptor12 = _applyDecoratedDescriptor(_class8.prototype, "monsterCount", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 500;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class8.prototype, "maxSpawnPerFrame", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class8.prototype, "monsterCreateQueue", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new MonsterCreateQueue();
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class8.prototype, "brotherExcludeZ", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class8.prototype, "disX", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2.5;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class8.prototype, "monsterSpeed", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class8.prototype, "middleLaneHalfX", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class8.prototype, "rowCount", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 8;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class8.prototype, "layerGapZ", [_dec23], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.8;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class8.prototype, "spawnRandomX", [_dec24], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.28;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class8.prototype, "spawnRandomZ", [_dec25], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.25;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class8.prototype, "spawnScaleRandom", [_dec26], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.06;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class8.prototype, "spawnYawRandom", [_dec27], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 8;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class8.prototype, "spawnPositionOffset", [_dec28], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Vec3();
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class8.prototype, "monsterDeathThrowBaseHeight", [_dec29], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class8.prototype, "monsterDeathThrowRandomHeight", [_dec30], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.35;
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class8.prototype, "waveRoleCount", [_dec31], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class8.prototype, "waveRoleStageIndexList", [_dec32], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [0, 2, 5];
        }
      }), _descriptor30 = _applyDecoratedDescriptor(_class8.prototype, "waveRoleMonsterGap", [_dec33], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.02;
        }
      }), _descriptor31 = _applyDecoratedDescriptor(_class8.prototype, "rebirthMonsterFrontRetreatZ", [_dec34], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2.5;
        }
      }), _descriptor32 = _applyDecoratedDescriptor(_class8.prototype, "rebirthMonsterWaveExtraGapZ", [_dec35], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor33 = _applyDecoratedDescriptor(_class8.prototype, "rebirthMonsterRandomX", [_dec36], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.15;
        }
      }), _descriptor34 = _applyDecoratedDescriptor(_class8.prototype, "rebirthMonsterRandomZ", [_dec37], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.25;
        }
      }), _descriptor35 = _applyDecoratedDescriptor(_class8.prototype, "rebirthMonsterDistanceLog", [_dec38], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      })), _class8)) || _class7));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7cb3e78818d3ca7420c127c4f13ad5587e5cc5d3.js.map