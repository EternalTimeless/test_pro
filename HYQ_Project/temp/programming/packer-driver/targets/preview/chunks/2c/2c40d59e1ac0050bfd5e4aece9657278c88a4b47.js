System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12", "__unresolved_13", "__unresolved_14"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, AnimationClip, CCBoolean, CCFloat, CCInteger, director, Label, Quat, tween, Vec3, BattleTarget3D, BulletMonsterCollisionManager, MoveDrive, MoveModEnum, EventType, MonsterType, PoolEnum, SoundEnum, PoolManager, EventManager, FbxManager, CameraMove, MeshFlashData, FlashRedManager, AudioManager, Player, Role, isPointInCameraView, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _class3, _crd, ccclass, property, MonsterAnimEnum, MonsterBattleTaerget;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfBattleTarget3D(extras) {
    _reporterNs.report("BattleTarget3D", "../Battle/BattleTarger/BattleTarget3D", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletMonsterCollisionManager(extras) {
    _reporterNs.report("BulletMonsterCollisionManager", "../Battle/BulletMonsterCollisionManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMoveDrive(extras) {
    _reporterNs.report("MoveDrive", "../../Base/MoveRot/MoveDrive", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMoveModEnum(extras) {
    _reporterNs.report("MoveModEnum", "../../Base/MoveRot/MoveDrive", _context.meta, extras);
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

  function _reportPossibleCrUseOfSoundEnum(extras) {
    _reporterNs.report("SoundEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolManager(extras) {
    _reporterNs.report("PoolManager", "../../Base/PoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../../Base/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFbxManager(extras) {
    _reporterNs.report("FbxManager", "../SkAnim/FbxManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCameraMove(extras) {
    _reporterNs.report("CameraMove", "../../Base/CameraMove", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMeshFlashData(extras) {
    _reporterNs.report("MeshFlashData", "../Battle/Base/BattleTargetBase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFlashRedManager(extras) {
    _reporterNs.report("FlashRedManager", "../Battle/Base/FlashRedManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "../../Base/AudioManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayer(extras) {
    _reporterNs.report("Player", "../Player/Player", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRole(extras) {
    _reporterNs.report("Role", "../Player/Role", _context.meta, extras);
  }

  function _reportPossibleCrUseOfisPointInCameraView(extras) {
    _reporterNs.report("isPointInCameraView", "../../Tool/Index", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      AnimationClip = _cc.AnimationClip;
      CCBoolean = _cc.CCBoolean;
      CCFloat = _cc.CCFloat;
      CCInteger = _cc.CCInteger;
      director = _cc.director;
      Label = _cc.Label;
      Quat = _cc.Quat;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      BattleTarget3D = _unresolved_2.BattleTarget3D;
    }, function (_unresolved_3) {
      BulletMonsterCollisionManager = _unresolved_3.default;
    }, function (_unresolved_4) {
      MoveDrive = _unresolved_4.MoveDrive;
      MoveModEnum = _unresolved_4.MoveModEnum;
    }, function (_unresolved_5) {
      EventType = _unresolved_5.EventType;
      MonsterType = _unresolved_5.MonsterType;
      PoolEnum = _unresolved_5.PoolEnum;
      SoundEnum = _unresolved_5.SoundEnum;
    }, function (_unresolved_6) {
      PoolManager = _unresolved_6.default;
    }, function (_unresolved_7) {
      EventManager = _unresolved_7.default;
    }, function (_unresolved_8) {
      FbxManager = _unresolved_8.FbxManager;
    }, function (_unresolved_9) {
      CameraMove = _unresolved_9.CameraMove;
    }, function (_unresolved_10) {
      MeshFlashData = _unresolved_10.MeshFlashData;
    }, function (_unresolved_11) {
      FlashRedManager = _unresolved_11.FlashRedManager;
    }, function (_unresolved_12) {
      AudioManager = _unresolved_12.default;
    }, function (_unresolved_13) {
      Player = _unresolved_13.Player;
    }, function (_unresolved_14) {
      Role = _unresolved_14.Role;
    }, function (_unresolved_15) {
      isPointInCameraView = _unresolved_15.isPointInCameraView;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "93b74JYl+RPy7/AhR04QwuT", "MonsterBattleTaerget", undefined);

      __checkObsolete__(['_decorator', 'AnimationClip', 'CCBoolean', 'CCFloat', 'CCInteger', 'director', 'Label', 'Node', 'Quat', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      MonsterAnimEnum = /*#__PURE__*/function (MonsterAnimEnum) {
        MonsterAnimEnum[MonsterAnimEnum["run"] = 0] = "run";
        MonsterAnimEnum[MonsterAnimEnum["die"] = 1] = "die";
        MonsterAnimEnum[MonsterAnimEnum["attack"] = 2] = "attack";
        MonsterAnimEnum[MonsterAnimEnum["die2"] = 3] = "die2";
        return MonsterAnimEnum;
      }(MonsterAnimEnum || {});

      _export("MonsterBattleTaerget", MonsterBattleTaerget = (_dec = ccclass('MonsterBattleTaerget'), _dec2 = property({
        type: CCBoolean,
        displayName: '启用小怪动画分级'
      }), _dec3 = property({
        type: CCFloat,
        displayName: '远距离动画阈值（米）',
        min: 1
      }), _dec4 = property({
        type: CCInteger,
        displayName: '远距离动画更新间隔（帧）',
        min: 1,
        max: 4
      }), _dec5 = property({
        type: CCInteger,
        displayName: '屏幕可见性检查间隔（帧）',
        min: 1,
        max: 30
      }), _dec6 = property({
        type: CCInteger,
        displayName: '目标重选间隔（帧）',
        min: 1,
        max: 12
      }), _dec7 = property({
        type: [_crd && MeshFlashData === void 0 ? (_reportPossibleCrUseOfMeshFlashData({
          error: Error()
        }), MeshFlashData) : MeshFlashData],
        tooltip: '闪红MeshRenderer配置列表，可在属性检查器中编辑'
      }), _dec8 = property(_crd && FbxManager === void 0 ? (_reportPossibleCrUseOfFbxManager({
        error: Error()
      }), FbxManager) : FbxManager), _dec9 = property({
        type: _crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
          error: Error()
        }), MonsterType) : MonsterType
      }), _dec10 = property({
        type: Label,

        visible() {
          return this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        }

      }), _dec11 = property(_crd && MoveDrive === void 0 ? (_reportPossibleCrUseOfMoveDrive({
        error: Error()
      }), MoveDrive) : MoveDrive), _dec12 = property(CCFloat), _dec13 = property({
        type: CCFloat,
        displayName: 'Boss横向锁定范围',

        visible() {
          return this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        }

      }), _dec14 = property({
        type: CCFloat,
        displayName: 'Boss攻击站位Z偏移',

        visible() {
          return this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        }

      }), _dec15 = property({
        type: CCFloat,
        displayName: 'Boss最小Z间距',

        visible() {
          return this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        }

      }), _dec16 = property({
        type: CCFloat,
        displayName: 'Boss站位Z容差',

        visible() {
          return this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        }

      }), _dec17 = property({
        type: CCFloat,
        displayName: '小怪攻击站位Z偏移',

        visible() {
          return this.monsterType != (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        }

      }), _dec18 = property({
        type: CCFloat,
        displayName: '小怪与玩家最小Z中心距',

        visible() {
          return this.monsterType != (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        }

      }), _dec19 = property({
        type: CCFloat,
        displayName: '小怪横向锁定范围',

        visible() {
          return this.monsterType != (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        }

      }), _dec20 = property({
        type: CCFloat,
        displayName: '小怪站位Z容差',

        visible() {
          return this.monsterType != (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        }

      }), _dec21 = property({
        type: AnimationClip,
        displayName: '小怪死亡强制替换动画',

        visible() {
          return this.monsterType != (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        },

        tooltip: '填入后，运行时会强制替换小怪动画列表中的 die 槽位。用于绕过直接改 SkeletalAnimation clips 后被编辑器还原的问题；Boss不受影响。'
      }), _dec22 = property({
        type: CCFloat,
        displayName: '小怪死亡抛飞高度',

        visible() {
          return this.monsterType != (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        },

        tooltip: '玩家攻击打死小怪后，代码额外模拟的抛物线最高高度。0表示不向上抛飞；Boss不受影响。'
      }), _dec23 = property({
        type: CCFloat,
        displayName: '小怪死亡抛飞Z距离',

        visible() {
          return this.monsterType != (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        },

        tooltip: '玩家攻击打死小怪后，死亡抛飞在Z方向移动的距离。Boss不受影响。'
      }), _dec24 = property({
        type: CCFloat,
        displayName: '小怪死亡抛飞时间比例',

        visible() {
          return this.monsterType != (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        },

        tooltip: '抛飞持续时间占死亡动画总时长的比例，建议0到1。Boss不受影响。'
      }), _dec(_class = (_class2 = (_class3 = class MonsterBattleTaerget extends (_crd && BattleTarget3D === void 0 ? (_reportPossibleCrUseOfBattleTarget3D({
        error: Error()
      }), BattleTarget3D) : BattleTarget3D) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "enableAnimationLod", _descriptor, this);

          _initializerDefineProperty(this, "animationLodDistance", _descriptor2, this);

          _initializerDefineProperty(this, "farAnimationFrameInterval", _descriptor3, this);

          _initializerDefineProperty(this, "visibilityCheckFrameInterval", _descriptor4, this);

          _initializerDefineProperty(this, "targetRefreshFrameInterval", _descriptor5, this);

          _initializerDefineProperty(this, "meshFlashDataList_Die", _descriptor6, this);

          _initializerDefineProperty(this, "fbx", _descriptor7, this);

          _initializerDefineProperty(this, "monsterType", _descriptor8, this);

          _initializerDefineProperty(this, "hpLab", _descriptor9, this);

          this.attackIn = false;

          _initializerDefineProperty(this, "move", _descriptor10, this);

          this.attackTarget = void 0;
          this.initX = 0;

          _initializerDefineProperty(this, "attackR", _descriptor11, this);

          this._hl = false;
          this.runAnimSpeed = 1;
          this.runAnimStartFrame = 0;
          this.attackTimer = 0;
          this.attackRoleAtAnimationStart = null;
          this.attackEventPending = false;
          this.attackDuration = 1.5;
          this.bossDesiredAttackPos = new Vec3();
          this.bossFaceVector = new Vec3();
          this.smallMonsterDesiredAttackPos = new Vec3();
          this.animationLodPhase = 0;
          this.targetRefreshPhase = 0;
          this.animationVisible = true;
          this.lastAnimationSamplingEnabled = true;
          this.lastAnimationSpeedMultiplier = 1;

          _initializerDefineProperty(this, "bossAttackLockOffsetX", _descriptor12, this);

          _initializerDefineProperty(this, "bossAttackOffsetZ", _descriptor13, this);

          _initializerDefineProperty(this, "bossMinGapZ", _descriptor14, this);

          _initializerDefineProperty(this, "bossAttackLockOffsetZ", _descriptor15, this);

          _initializerDefineProperty(this, "smallMonsterAttackOffsetZ", _descriptor16, this);

          _initializerDefineProperty(this, "smallMonsterAttackMinCenterGapZ", _descriptor17, this);

          _initializerDefineProperty(this, "smallMonsterAttackLockOffsetX", _descriptor18, this);

          _initializerDefineProperty(this, "smallMonsterAttackLockOffsetZ", _descriptor19, this);

          _initializerDefineProperty(this, "smallMonsterDieOverrideClip", _descriptor20, this);

          _initializerDefineProperty(this, "smallMonsterDeathThrowHeight", _descriptor21, this);

          _initializerDefineProperty(this, "smallMonsterDeathThrowDistanceZ", _descriptor22, this);

          _initializerDefineProperty(this, "smallMonsterDeathThrowDurationRate", _descriptor23, this);

          // public dieTimeScale: number = 1;
          this.isDieD = true;

          /** 跳过死亡闪红效果（批量击杀时设为true以降低DC尖峰） */
          this.skipDieFlash = false;
          this._hlIn = false;
        }

        onLoad() {
          super.onLoad();
          this.animationLodPhase = MonsterBattleTaerget.nextLodPhase++;
          this.targetRefreshPhase = MonsterBattleTaerget.nextLodPhase++;
          this.applyNormalDeathAnimationSetup();
        }
        /** 重写init，在初始化后注册到碰撞管理器 */


        init(difficulty, fixedHp) {
          var _this$fbx;

          if (fixedHp === void 0) {
            fixedHp = 0;
          }

          super.init(difficulty);

          if (fixedHp > 0) {
            this.initFixedHp(fixedHp);
          }

          this.attackIn = false;

          if (this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother) {
            this.fixBossHpLabel();
            this.hpLab.string = Math.round(this.curHp).toString();
          }

          this.move.autoMove = true;
          this._hl = false;
          this._hlIn = false;
          this.applyNormalDeathAnimationSetup();
          this.attackTimer = 0;
          this.attackRoleAtAnimationStart = null;
          this.attackEventPending = false;
          this.runAnimSpeed = 0.9 + Math.random() * 0.25;
          this.runAnimStartFrame = Math.random();
          this.animationVisible = true;
          this.lastAnimationSamplingEnabled = true;
          this.lastAnimationSpeedMultiplier = 1;
          (_this$fbx = this.fbx) == null || _this$fbx.setSkeletalAnimationEnabled(true);
          (_crd && BulletMonsterCollisionManager === void 0 ? (_reportPossibleCrUseOfBulletMonsterCollisionManager({
            error: Error()
          }), BulletMonsterCollisionManager) : BulletMonsterCollisionManager).instance.registerTarget(this);
        }

        start() {
          this.fbx.setAttackAnimCall(this.attackEvent, this);
        }

        damage(power) {
          this.flashRed(0.15, null, "monster_Hit" + this.monsterType);
          (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).inst.playOneShot((_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
            error: Error()
          }), SoundEnum) : SoundEnum).Sound_Monster_Hit, 0.25, 0.08);

          if (this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother) {
            this.fixBossHpLabel();
            this.hpLab.string = Math.round(this.curHp).toString();
          }
        }

        die() {
          var _this$fbx2;

          (_this$fbx2 = this.fbx) == null || _this$fbx2.setSkeletalAnimationEnabled(true);
          this.cancelPendingAttackEvent();
          this.move.autoMove = false;
          (_crd && BulletMonsterCollisionManager === void 0 ? (_reportPossibleCrUseOfBulletMonsterCollisionManager({
            error: Error()
          }), BulletMonsterCollisionManager) : BulletMonsterCollisionManager).instance.unregisterTarget(this);
          this.stopFlashRed();
          var endtime = 0;

          if (!this.isDieD) {
            var t = this.fbx.setAnimation(MonsterAnimEnum.die2, true);
            var scale = 0.3 + Math.random() * 0.5;
            t.speed = scale;
            endtime = t.duration * (1 / scale);
          } else {
            var _t = this.fbx.setAnimation(MonsterAnimEnum.die, true);

            endtime = _t.duration;
            this.playSmallMonsterDeathThrow(endtime);
          }

          this.flashDie(endtime); // this.scheduleOnce(() => {
          // }, 0.15 + Math.random() * 0.2);

          if (this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother) {
            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).inst.playOneShot((_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
              error: Error()
            }), SoundEnum) : SoundEnum).Sound_boss_die, 0.7, 0.08);
          } else {
            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).inst.playOneShot((_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
              error: Error()
            }), SoundEnum) : SoundEnum).Sound_Monster_Die, 0.4, 0.08);
          }

          if (this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother) this.hpLab.string = "";

          if (this.isDieD) {
            this.scheduleOnce(() => {
              this.node.active = false;
              (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
                error: Error()
              }), PoolEnum) : PoolEnum).monster + this.monsterType, this);
            }, endtime);
          }
        }

        flashDie(endtime) {
          if (this.isDieD) {
            (_crd && FlashRedManager === void 0 ? (_reportPossibleCrUseOfFlashRedManager({
              error: Error()
            }), FlashRedManager) : FlashRedManager).instance.flashRed(this.node, this.meshFlashDataList_Die, endtime * 1.1, null, "monster_Die" + this.monsterType);
          } else {
            (_crd && FlashRedManager === void 0 ? (_reportPossibleCrUseOfFlashRedManager({
              error: Error()
            }), FlashRedManager) : FlashRedManager).instance.flashRed(this.node, this.meshFlashDataList_Die, endtime * 10, null, "monster_Die" + this.monsterType);
          }
        }

        applyNormalDeathAnimationSetup() {
          if (this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother || !this.fbx) {
            return;
          }

          if (this.smallMonsterDieOverrideClip) {
            this.fbx.replaceAnimationClip(MonsterAnimEnum.die, this.smallMonsterDieOverrideClip);
          }
        }

        playSmallMonsterDeathThrow(totalDuration) {
          if (this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother) {
            return;
          }

          var rate = Math.max(0, Math.min(1, this.smallMonsterDeathThrowDurationRate));
          var duration = Math.max(0, totalDuration * rate);
          var height = Math.max(0, this.smallMonsterDeathThrowHeight);
          var distanceZ = this.smallMonsterDeathThrowDistanceZ;

          if (duration <= 0 || height <= 0 && distanceZ == 0) {
            return;
          }

          var startX = this.node.x;
          var startY = this.node.y;
          var startZ = this.node.z;
          var state = {
            progress: 0
          };
          tween(state).to(duration, {
            progress: 1
          }, {
            onUpdate: target => {
              var _this$node;

              if (!((_this$node = this.node) != null && _this$node.isValid)) {
                return;
              }

              var progress = Math.max(0, Math.min(1, target.progress));
              var parabolaY = 4 * height * progress * (1 - progress);
              this.node.setPosition(startX, startY + parabolaY, startZ + distanceZ * progress);
            }
          }).call(() => {
            var _this$node2;

            if ((_this$node2 = this.node) != null && _this$node2.isValid) {
              this.node.setPosition(startX, startY, startZ + distanceZ);
            }
          }).start();
        }

        _update(dt) {
          if (this.isDie) {
            return;
          }

          this.updateRunAnimationLod();

          if (this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother) {
            this.fixBossHpLabel();
          }

          if (this.attackTimer > 0) {
            this.attackTimer -= dt;

            if (this.attackTimer <= 0) {
              this.attackTimer = 0;

              if (!this.attackEventPending) {
                this.attackIn = false;
              }
            }
          }

          if (this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother && this.attackIn) {
            this.move.autoMove = false;
            return;
          }

          if (this.attackTarget && !this.ensureAttackTargetValid()) {
            this.move.autoMove = true;
          }

          if (this.shouldRefreshTargetThisFrame()) {
            this.refreshSmallMonsterAttackTargetIfNeeded();
          }

          if (this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother) {
            this.updateBossMoveTarget();
            this.updateBossFacing(dt);
          }

          if (this.attackTarget) {
            var canAttack = this.isAttackTargetInRange();

            if (canAttack) {
              this.move.autoMove = false;

              if (!this.attackIn && !(_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
                error: Error()
              }), Player) : Player).instance.isDie) {
                this.playAttackAnimation();
              }
            } else {
              this.cancelPendingAttackEvent();

              if (this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
                error: Error()
              }), MonsterType) : MonsterType).ZombieBrother) {
                this.move.target = this.attackTarget;
              } else {
                this.getSmallMonsterDesiredAttackPosition(this.smallMonsterDesiredAttackPos);
                this.move.moveMod = (_crd && MoveModEnum === void 0 ? (_reportPossibleCrUseOfMoveModEnum({
                  error: Error()
                }), MoveModEnum) : MoveModEnum).PosMove;
                this.move.pos = this.smallMonsterDesiredAttackPos;
              }

              this.move.autoMove = true;
            }
          }

          if (!this.attackIn) {
            if (this.move.isMove) {
              if (!this._hl && !this._hlIn) {
                this.scheduleOnce(() => {
                  this.playRunAnimation();
                  this._hl = true;
                }, 0.45 * Math.random());
                this._hlIn = true; // t.delay = Math.random() * 0.5;
              } else {
                if (this._hl) {
                  if (!this.fbx.isCurAnimation(MonsterAnimEnum.run)) {
                    this.playRunAnimation();
                  }
                }
              }
            }
          }
        }

        playAttackAnimation() {
          var _this$fbx3;

          (_this$fbx3 = this.fbx) == null || _this$fbx3.setSkeletalAnimationEnabled(true);

          if (this.monsterType === (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother) {
            var _anim = this.fbx.setAnimation(MonsterAnimEnum.attack, false);

            if (!_anim) {
              return;
            }

            _anim.speed = _anim.duration / this.attackDuration;
            this.attackTimer = this.attackDuration;
            this.attackIn = true;
            return;
          }

          if (this.attackEventPending) {
            return;
          }

          var role = this.getAttackRole();

          if (!role) {
            return;
          }

          this.attackRoleAtAnimationStart = role;
          var anim = this.fbx.setAnimation(MonsterAnimEnum.attack, false);

          if (!anim) {
            this.attackRoleAtAnimationStart = null;
            return;
          }

          this.attackEventPending = true;
          var animScale = anim.duration / this.attackDuration;
          anim.speed = animScale;
          this.attackTimer = this.attackDuration;
          this.attackIn = true;
        }

        ensureAttackTargetValid() {
          var _this$attackTarget;

          if (!((_this$attackTarget = this.attackTarget) != null && _this$attackTarget.activeInHierarchy)) {
            return this.refreshAttackTarget();
          }

          var role = this.attackTarget.getComponent(_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role);

          if (!role) {
            return true;
          }

          var player = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance;

          if (!player || player.isDie || role.hp <= 0 || player.roleList.indexOf(role) === -1) {
            return this.refreshAttackTarget();
          }

          return true;
        }

        refreshAttackTarget() {
          var _nextRole$node;

          var player = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance;

          if (!player || player.isDie || player.roleList.length <= 0) {
            this.clearAttackTarget();
            return false;
          }

          var nextRole = this.monsterType === (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother ? player.getMonsterAttackTarget(this.node.worldPosition) : player.getSmallMonsterAttackTarget(this.node.worldPosition);

          if (!(nextRole != null && (_nextRole$node = nextRole.node) != null && _nextRole$node.activeInHierarchy)) {
            this.clearAttackTarget();
            return false;
          }

          this.attackTarget = nextRole.node;
          this.move.target = this.attackTarget;
          return true;
        }

        clearAttackTarget() {
          this.attackTarget = null;

          if (this.move) {
            this.move.target = null;
          }

          this.cancelPendingAttackEvent();
        }

        cancelPendingAttackEvent() {
          this.attackRoleAtAnimationStart = null;
          this.attackEventPending = false;
          this.attackIn = false;
          this.attackTimer = 0;
        }

        prepareForRebirthRetreat() {
          var _this$fbx4;

          this.clearAttackTarget();

          if (this.move) {
            this.move.autoMove = false;
            this.move.moveMod = (_crd && MoveModEnum === void 0 ? (_reportPossibleCrUseOfMoveModEnum({
              error: Error()
            }), MoveModEnum) : MoveModEnum).PosMove;
          }

          this.node.setRotationFromEuler(0, 180, 0);
          (_this$fbx4 = this.fbx) == null || (_this$fbx4 = _this$fbx4.node) == null || _this$fbx4.setRotationFromEuler(0, 0, 0);

          if (this.fbx) {
            this.playRunAnimation();
          }
        }

        refreshSmallMonsterAttackTargetIfNeeded() {
          var _this$attackTarget2, _nextRole$node2;

          if (this.monsterType === (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother || this.attackIn || !((_this$attackTarget2 = this.attackTarget) != null && _this$attackTarget2.activeInHierarchy)) {
            return;
          }

          var player = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance;

          if (!player || player.isDie || player.roleList.length <= 0) {
            this.clearAttackTarget();
            return;
          }

          var nextRole = player.getSmallMonsterAttackTarget(this.node.worldPosition);

          if (!(nextRole != null && (_nextRole$node2 = nextRole.node) != null && _nextRole$node2.activeInHierarchy)) {
            this.clearAttackTarget();
            return;
          }

          if (nextRole.node === this.attackTarget) {
            return;
          }

          this.attackTarget = nextRole.node;
          this.move.target = this.attackTarget;
        }

        isAttackTargetInRange() {
          var _this$attackTarget3;

          if (!((_this$attackTarget3 = this.attackTarget) != null && _this$attackTarget3.activeInHierarchy)) {
            return false;
          }

          if (this.monsterType === (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother) {
            return this.isBossInAttackPosition();
          }

          return this.isSmallMonsterInAttackPosition();
        }

        getAttackRole() {
          var _this$attackTarget4;

          var role = (_this$attackTarget4 = this.attackTarget) == null ? void 0 : _this$attackTarget4.getComponent(_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role);

          if (!role) {
            return null;
          }

          var player = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance;

          if (!player || player.isDie || role.hp <= 0 || player.roleList.indexOf(role) === -1) {
            return null;
          }

          return role;
        }

        getLockedAttackRole() {
          var role = this.attackRoleAtAnimationStart;
          var player = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance;

          if (!role || !player || player.isDie || role.hp <= 0 || player.roleList.indexOf(role) === -1) {
            return null;
          }

          return role;
        }

        updateBossFacing(dt) {
          var _this$move;

          var player = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance;

          if (!(player != null && player.node) || !((_this$move = this.move) != null && _this$move.isRot) || !this.move.rotDrive) {
            return;
          }

          var targetPos = player.node.worldPosition;
          var selfPos = this.node.worldPosition;
          var dx = targetPos.x - selfPos.x;
          var dz = targetPos.z - selfPos.z;

          if (dx === 0 && dz === 0) {
            return;
          }

          this.bossFaceVector.set(dx, 0, dz);
          this.move.rotDrive.vector = this.bossFaceVector;
          this.move.rotDrive.rotatLerpLookVector(dt);
        }

        updateBossMoveTarget() {
          var _instance;

          if (!this.attackTarget || !((_instance = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance) != null && _instance.node) || !this.move) {
            return;
          }

          this.getBossDesiredAttackPosition(this.bossDesiredAttackPos);
          this.move.moveMod = (_crd && MoveModEnum === void 0 ? (_reportPossibleCrUseOfMoveModEnum({
            error: Error()
          }), MoveModEnum) : MoveModEnum).PosMove;
          this.move.pos = this.bossDesiredAttackPos;
        }

        getBossDesiredAttackPosition(out) {
          var playerPos = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance.node.worldPosition;
          var desiredGapZ = Math.max(Math.abs(this.bossAttackOffsetZ), Math.abs(this.bossMinGapZ));
          out.set(playerPos.x, this.node.worldPosition.y, playerPos.z + desiredGapZ);
          return out;
        }

        isBossInAttackPosition() {
          var player = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance;

          if (!(player != null && player.node) || player.isDie) {
            return false;
          }

          var playerPos = player.node.worldPosition;
          var dis = Vec3.squaredDistance(playerPos, this.node.worldPosition);

          if (dis > this.attackR) {
            return false;
          }

          this.getBossDesiredAttackPosition(this.bossDesiredAttackPos);
          var selfPos = this.node.worldPosition;
          return Math.abs(selfPos.x - this.bossDesiredAttackPos.x) <= this.bossAttackLockOffsetX && Math.abs(selfPos.z - this.bossDesiredAttackPos.z) <= this.bossAttackLockOffsetZ;
        }

        getSmallMonsterDesiredAttackPosition(out) {
          var targetPos = this.attackTarget.worldPosition;
          var attackRearZ = this.getPlayerAttackRearWorldZ(targetPos.z);
          var desiredAttackZ = attackRearZ + Math.abs(this.smallMonsterAttackOffsetZ);
          var noOverlapZ = this.getPlayerBodyFrontWorldZ(targetPos.z) + Math.max(0, this.smallMonsterAttackMinCenterGapZ);
          out.set(targetPos.x, this.node.worldPosition.y, Math.max(desiredAttackZ, noOverlapZ));
          return out;
        }

        getPlayerAttackRearWorldZ(defaultZ) {
          this.refreshPlayerFormationCache();
          return Number.isFinite(MonsterBattleTaerget.playerAttackRearWorldZ) ? MonsterBattleTaerget.playerAttackRearWorldZ : defaultZ;
        }

        getPlayerBodyFrontWorldZ(defaultZ) {
          this.refreshPlayerFormationCache();
          return Number.isFinite(MonsterBattleTaerget.playerBodyFrontWorldZ) ? MonsterBattleTaerget.playerBodyFrontWorldZ : defaultZ;
        }

        refreshPlayerFormationCache() {
          var _player$roleList;

          var frame = director.getTotalFrames();

          if (MonsterBattleTaerget.playerFormationCacheFrame === frame) {
            return;
          }

          MonsterBattleTaerget.playerFormationCacheFrame = frame;
          MonsterBattleTaerget.playerAttackRearWorldZ = Number.NaN;
          MonsterBattleTaerget.playerBodyFrontWorldZ = Number.NaN;
          var player = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance;

          if (!player || player.isDie || !((_player$roleList = player.roleList) != null && _player$roleList.length)) {
            return;
          }

          var rearZ = Number.POSITIVE_INFINITY;
          var frontZ = Number.NEGATIVE_INFINITY;

          for (var i = 0; i < player.roleList.length; i++) {
            var _role$node, _role$shoot;

            var role = player.roleList[i];

            if (!(role != null && (_role$node = role.node) != null && _role$node.activeInHierarchy) || role.attackIN) {
              continue;
            }

            var attackZ = (_role$shoot = role.shoot) != null && _role$shoot.isValid ? role.shoot.worldPosition.z : role.node.worldPosition.z;
            rearZ = Math.min(rearZ, attackZ);

            if (role.hp <= 0) {
              continue;
            }

            var roleZ = role.node.worldPosition.z;

            if (roleZ > frontZ) {
              frontZ = roleZ;
            }
          }

          MonsterBattleTaerget.playerAttackRearWorldZ = Number.isFinite(rearZ) ? rearZ : Number.NaN;
          MonsterBattleTaerget.playerBodyFrontWorldZ = Number.isFinite(frontZ) ? frontZ : Number.NaN;
        }

        shouldRefreshTargetThisFrame() {
          if (this.monsterType === (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother || !this.isOptimizationScene()) {
            return true;
          }

          var interval = Math.max(1, Math.floor(this.targetRefreshFrameInterval));
          return (director.getTotalFrames() + this.targetRefreshPhase) % interval === 0;
        }

        updateRunAnimationLod() {
          var _this$fbx5, _instance3;

          var isRunAnimation = !!((_this$fbx5 = this.fbx) != null && _this$fbx5.isCurAnimation(MonsterAnimEnum.run));

          if (!this.enableAnimationLod || !this.isOptimizationScene() || this.monsterType === (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother || this.attackIn || !isRunAnimation) {
            if (isRunAnimation) {
              this.setRunAnimationSampling(true, 1);
            } else {
              var _this$fbx6;

              (_this$fbx6 = this.fbx) == null || _this$fbx6.setSkeletalAnimationEnabled(true);
            }

            return;
          }

          var frame = director.getTotalFrames();
          var visibilityInterval = Math.max(1, Math.floor(this.visibilityCheckFrameInterval));

          if ((frame + this.animationLodPhase) % visibilityInterval === 0) {
            var _instance2;

            var camera = (_instance2 = (_crd && CameraMove === void 0 ? (_reportPossibleCrUseOfCameraMove({
              error: Error()
            }), CameraMove) : CameraMove).instance) == null ? void 0 : _instance2.camera;
            this.animationVisible = !camera || (_crd && isPointInCameraView === void 0 ? (_reportPossibleCrUseOfisPointInCameraView({
              error: Error()
            }), isPointInCameraView) : isPointInCameraView)(this.node.worldPosition, camera);
          }

          if (!this.animationVisible) {
            this.fbx.setSkeletalAnimationEnabled(false);
            return;
          }

          var cameraPos = (_instance3 = (_crd && CameraMove === void 0 ? (_reportPossibleCrUseOfCameraMove({
            error: Error()
          }), CameraMove) : CameraMove).instance) == null || (_instance3 = _instance3.camera) == null || (_instance3 = _instance3.node) == null ? void 0 : _instance3.worldPosition;

          if (!cameraPos) {
            this.setRunAnimationSampling(true, 1);
            return;
          }

          var dx = this.node.worldPositionX - cameraPos.x;
          var dz = this.node.worldPositionZ - cameraPos.z;
          var farDistance = Math.max(1, this.animationLodDistance);

          if (dx * dx + dz * dz < farDistance * farDistance) {
            this.setRunAnimationSampling(true, 1);
            return;
          }

          var interval = Math.max(1, Math.floor(this.farAnimationFrameInterval));
          this.setRunAnimationSampling((frame + this.animationLodPhase) % interval === 0, interval);
        }

        setRunAnimationSampling(enabled, speedMultiplier) {
          var multiplier = Math.max(1, speedMultiplier);

          if (this.lastAnimationSamplingEnabled === enabled && this.lastAnimationSpeedMultiplier === multiplier) {
            return;
          }

          var state = this.fbx.getAnimState(MonsterAnimEnum.run);

          if (state) {
            state.speed = this.runAnimSpeed * multiplier;
          }

          this.fbx.setSkeletalAnimationEnabled(enabled);
          this.lastAnimationSamplingEnabled = enabled;
          this.lastAnimationSpeedMultiplier = multiplier;
        }

        isOptimizationScene() {
          var _director$getScene;

          return ((_director$getScene = director.getScene()) == null ? void 0 : _director$getScene.name) === MonsterBattleTaerget.OPTIMIZED_SCENE_NAME;
        }

        isSmallMonsterInAttackPosition() {
          var _this$attackTarget5;

          if (!((_this$attackTarget5 = this.attackTarget) != null && _this$attackTarget5.activeInHierarchy)) {
            return false;
          }

          this.getSmallMonsterDesiredAttackPosition(this.smallMonsterDesiredAttackPos);
          var selfPos = this.node.worldPosition;
          var targetPos = this.attackTarget.worldPosition;
          return Math.abs(selfPos.x - targetPos.x) <= this.smallMonsterAttackLockOffsetX && Math.abs(selfPos.z - this.smallMonsterDesiredAttackPos.z) <= this.smallMonsterAttackLockOffsetZ;
        }

        randomizeRunAnimation() {
          this.runAnimSpeed = 0.9 + Math.random() * 0.25;
          this.runAnimStartFrame = Math.random();
        }

        fixBossHpLabel() {
          var _this$hpLab;

          if (!((_this$hpLab = this.hpLab) != null && _this$hpLab.node)) {
            return;
          }

          this.hpLab.node.setWorldRotation(Quat.IDENTITY);
          var scale = this.hpLab.node.scale;
          this.hpLab.node.setScale(-Math.abs(scale.x), Math.abs(scale.y), Math.abs(scale.z));
        }

        playRunAnimation() {
          var state = this.fbx.setAnimation(MonsterAnimEnum.run, true, this.runAnimStartFrame);

          if (state) {
            state.speed = this.runAnimSpeed;
          }

          this.lastAnimationSamplingEnabled = true;
          this.lastAnimationSpeedMultiplier = 1;
          this.fbx.setSkeletalAnimationEnabled(true);
        }

        attackEvent() {
          if (this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother) {
            if (!this.isAttackTargetInRange()) {
              return;
            }

            (_crd && CameraMove === void 0 ? (_reportPossibleCrUseOfCameraMove({
              error: Error()
            }), CameraMove) : CameraMove).instance.Shake2(1);
            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).inst.playOneShot((_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
              error: Error()
            }), SoundEnum) : SoundEnum).Sound_boss_attack, 0.6);
            (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
              error: Error()
            }), EventManager) : EventManager).instance.emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
              error: Error()
            }), EventType) : EventType).PLAYER_HIT, this.node.worldPosition, 10);
            return;
          }

          if (!this.attackEventPending) {
            return;
          }

          var role = this.getLockedAttackRole();
          this.attackRoleAtAnimationStart = null;
          this.attackEventPending = false;

          if (this.attackTimer <= 0) {
            this.attackIn = false;
          }

          if (!role) {
            return;
          }

          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).PLAYER_HIT_2, role, 1);
        }

      }, _class3.OPTIMIZED_SCENE_NAME = 'Game_3D-002', _class3.nextLodPhase = 0, _class3.playerFormationCacheFrame = -1, _class3.playerAttackRearWorldZ = Number.NaN, _class3.playerBodyFrontWorldZ = Number.NaN, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "enableAnimationLod", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "animationLodDistance", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 38;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "farAnimationFrameInterval", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "visibilityCheckFrameInterval", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "targetRefreshFrameInterval", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 4;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "meshFlashDataList_Die", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "fbx", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "monsterType", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBaby_0;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "hpLab", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "move", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "attackR", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 4;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "bossAttackLockOffsetX", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.9;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "bossAttackOffsetZ", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.4;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "bossMinGapZ", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.4;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "bossAttackLockOffsetZ", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.28;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "smallMonsterAttackOffsetZ", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.2;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "smallMonsterAttackMinCenterGapZ", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.85;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "smallMonsterAttackLockOffsetX", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.55;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "smallMonsterAttackLockOffsetZ", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.22;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "smallMonsterDieOverrideClip", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "smallMonsterDeathThrowHeight", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.8;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "smallMonsterDeathThrowDistanceZ", [_dec23], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 6;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "smallMonsterDeathThrowDurationRate", [_dec24], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.5;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2c40d59e1ac0050bfd5e4aece9657278c88a4b47.js.map