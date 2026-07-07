System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12", "__unresolved_13"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, AnimationClip, CCFloat, Label, Quat, tween, Vec3, BattleTarget3D, BulletMonsterCollisionManager, MoveDrive, MoveModEnum, EventType, MonsterType, PoolEnum, SoundEnum, PoolManager, EventManager, FbxManager, CameraMove, MeshFlashData, FlashRedManager, AudioManager, Player, Role, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _crd, ccclass, property, MonsterAnimEnum, MonsterBattleTaerget;

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

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      AnimationClip = _cc.AnimationClip;
      CCFloat = _cc.CCFloat;
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
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "93b74JYl+RPy7/AhR04QwuT", "MonsterBattleTaerget", undefined);

      __checkObsolete__(['_decorator', 'AnimationClip', 'CCFloat', 'Label', 'Node', 'Quat', 'tween', 'Vec3']);

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
        type: [_crd && MeshFlashData === void 0 ? (_reportPossibleCrUseOfMeshFlashData({
          error: Error()
        }), MeshFlashData) : MeshFlashData],
        tooltip: '闪红MeshRenderer配置列表，可在属性检查器中编辑'
      }), _dec3 = property(_crd && FbxManager === void 0 ? (_reportPossibleCrUseOfFbxManager({
        error: Error()
      }), FbxManager) : FbxManager), _dec4 = property({
        type: _crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
          error: Error()
        }), MonsterType) : MonsterType
      }), _dec5 = property({
        type: Label,

        visible() {
          return this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        }

      }), _dec6 = property(_crd && MoveDrive === void 0 ? (_reportPossibleCrUseOfMoveDrive({
        error: Error()
      }), MoveDrive) : MoveDrive), _dec7 = property(CCFloat), _dec8 = property({
        type: CCFloat,
        displayName: 'Boss横向锁定范围',

        visible() {
          return this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        }

      }), _dec9 = property({
        type: CCFloat,
        displayName: 'Boss攻击站位Z偏移',

        visible() {
          return this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        }

      }), _dec10 = property({
        type: CCFloat,
        displayName: 'Boss最小Z间距',

        visible() {
          return this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        }

      }), _dec11 = property({
        type: CCFloat,
        displayName: 'Boss站位Z容差',

        visible() {
          return this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        }

      }), _dec12 = property({
        type: CCFloat,
        displayName: '小怪攻击站位Z偏移',

        visible() {
          return this.monsterType != (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        }

      }), _dec13 = property({
        type: CCFloat,
        displayName: '小怪与玩家最小Z中心距',

        visible() {
          return this.monsterType != (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        }

      }), _dec14 = property({
        type: CCFloat,
        displayName: '小怪横向锁定范围',

        visible() {
          return this.monsterType != (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        }

      }), _dec15 = property({
        type: CCFloat,
        displayName: '小怪站位Z容差',

        visible() {
          return this.monsterType != (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        }

      }), _dec16 = property({
        type: AnimationClip,
        displayName: '小怪死亡强制替换动画',

        visible() {
          return this.monsterType != (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        },

        tooltip: '填入后，运行时会强制替换小怪动画列表中的 die 槽位。用于绕过直接改 SkeletalAnimation clips 后被编辑器还原的问题；Boss不受影响。'
      }), _dec17 = property({
        type: CCFloat,
        displayName: '小怪死亡抛飞高度',

        visible() {
          return this.monsterType != (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        },

        tooltip: '玩家攻击打死小怪后，代码额外模拟的抛物线最高高度。0表示不向上抛飞；Boss不受影响。'
      }), _dec18 = property({
        type: CCFloat,
        displayName: '小怪死亡抛飞Z距离',

        visible() {
          return this.monsterType != (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        },

        tooltip: '玩家攻击打死小怪后，死亡抛飞在Z方向移动的距离。Boss不受影响。'
      }), _dec19 = property({
        type: CCFloat,
        displayName: '小怪死亡抛飞时间比例',

        visible() {
          return this.monsterType != (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother;
        },

        tooltip: '抛飞持续时间占死亡动画总时长的比例，建议0到1。Boss不受影响。'
      }), _dec(_class = (_class2 = class MonsterBattleTaerget extends (_crd && BattleTarget3D === void 0 ? (_reportPossibleCrUseOfBattleTarget3D({
        error: Error()
      }), BattleTarget3D) : BattleTarget3D) {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "meshFlashDataList_Die", _descriptor, this);

          _initializerDefineProperty(this, "fbx", _descriptor2, this);

          _initializerDefineProperty(this, "monsterType", _descriptor3, this);

          _initializerDefineProperty(this, "hpLab", _descriptor4, this);

          this.attackIn = false;

          _initializerDefineProperty(this, "move", _descriptor5, this);

          this.attackTarget = void 0;
          this.initX = 0;

          _initializerDefineProperty(this, "attackR", _descriptor6, this);

          this._hl = false;
          this.runAnimSpeed = 1;
          this.runAnimStartFrame = 0;
          this.attackTimer = 0;
          this.attackDuration = 1.5;
          this.bossDesiredAttackPos = new Vec3();
          this.bossFaceVector = new Vec3();
          this.smallMonsterDesiredAttackPos = new Vec3();

          _initializerDefineProperty(this, "bossAttackLockOffsetX", _descriptor7, this);

          _initializerDefineProperty(this, "bossAttackOffsetZ", _descriptor8, this);

          _initializerDefineProperty(this, "bossMinGapZ", _descriptor9, this);

          _initializerDefineProperty(this, "bossAttackLockOffsetZ", _descriptor10, this);

          _initializerDefineProperty(this, "smallMonsterAttackOffsetZ", _descriptor11, this);

          _initializerDefineProperty(this, "smallMonsterAttackMinCenterGapZ", _descriptor12, this);

          _initializerDefineProperty(this, "smallMonsterAttackLockOffsetX", _descriptor13, this);

          _initializerDefineProperty(this, "smallMonsterAttackLockOffsetZ", _descriptor14, this);

          _initializerDefineProperty(this, "smallMonsterDieOverrideClip", _descriptor15, this);

          _initializerDefineProperty(this, "smallMonsterDeathThrowHeight", _descriptor16, this);

          _initializerDefineProperty(this, "smallMonsterDeathThrowDistanceZ", _descriptor17, this);

          _initializerDefineProperty(this, "smallMonsterDeathThrowDurationRate", _descriptor18, this);

          // public dieTimeScale: number = 1;
          this.isDieD = true;

          /** 跳过死亡闪红效果（批量击杀时设为true以降低DC尖峰） */
          this.skipDieFlash = false;
          this._hlIn = false;
        }

        onLoad() {
          super.onLoad();
          this.applyNormalDeathAnimationSetup();
        }
        /** 重写init，在初始化后注册到碰撞管理器 */


        init(difficulty, fixedHp = 0) {
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
          this.runAnimSpeed = 0.9 + Math.random() * 0.25;
          this.runAnimStartFrame = Math.random();
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
          this.move.autoMove = false;
          (_crd && BulletMonsterCollisionManager === void 0 ? (_reportPossibleCrUseOfBulletMonsterCollisionManager({
            error: Error()
          }), BulletMonsterCollisionManager) : BulletMonsterCollisionManager).instance.unregisterTarget(this);
          this.stopFlashRed();
          let endtime = 0;

          if (!this.isDieD) {
            const t = this.fbx.setAnimation(MonsterAnimEnum.die2, true);
            const scale = 0.3 + Math.random() * 0.5;
            t.speed = scale;
            endtime = t.duration * (1 / scale);
          } else {
            const t = this.fbx.setAnimation(MonsterAnimEnum.die, true);
            endtime = t.duration;
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

          const rate = Math.max(0, Math.min(1, this.smallMonsterDeathThrowDurationRate));
          const duration = Math.max(0, totalDuration * rate);
          const height = Math.max(0, this.smallMonsterDeathThrowHeight);
          const distanceZ = this.smallMonsterDeathThrowDistanceZ;

          if (duration <= 0 || height <= 0 && distanceZ == 0) {
            return;
          }

          const startX = this.node.x;
          const startY = this.node.y;
          const startZ = this.node.z;
          const state = {
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

              const progress = Math.max(0, Math.min(1, target.progress));
              const parabolaY = 4 * height * progress * (1 - progress);
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

          if (this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother) {
            this.fixBossHpLabel();
          }

          if (this.attackTimer > 0) {
            this.attackTimer -= dt;

            if (this.attackTimer <= 0) {
              this.attackTimer = 0;
              this.attackIn = false;
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

          this.refreshSmallMonsterAttackTargetIfNeeded();

          if (this.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother) {
            this.updateBossMoveTarget();
            this.updateBossFacing(dt);
          }

          if (this.attackTarget) {
            const canAttack = this.isAttackTargetInRange();

            if (canAttack) {
              this.move.autoMove = false;

              if (!this.attackIn && !(_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
                error: Error()
              }), Player) : Player).instance.isDie) {
                this.playAttackAnimation();
              }
            } else {
              this.attackIn = false;
              this.attackTimer = 0;

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
          const anim = this.fbx.setAnimation(MonsterAnimEnum.attack, false);

          if (!anim) {
            return;
          }

          const animScale = anim.duration / this.attackDuration;
          anim.speed = animScale;
          this.attackTimer = this.attackDuration;
          this.attackIn = true;
        }

        ensureAttackTargetValid() {
          var _this$attackTarget;

          if (!((_this$attackTarget = this.attackTarget) != null && _this$attackTarget.activeInHierarchy)) {
            return this.refreshAttackTarget();
          }

          const role = this.attackTarget.getComponent(_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role);

          if (!role) {
            return true;
          }

          const player = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance;

          if (!player || player.isDie || role.hp <= 0 || player.roleList.indexOf(role) === -1) {
            return this.refreshAttackTarget();
          }

          return true;
        }

        refreshAttackTarget() {
          var _nextRole$node;

          const player = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance;

          if (!player || player.isDie || player.roleList.length <= 0) {
            this.clearAttackTarget();
            return false;
          }

          const nextRole = player.getMonsterAttackTarget(this.node.worldPosition);

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

          this.attackIn = false;
          this.attackTimer = 0;
        }

        prepareForRebirthRetreat() {
          var _this$fbx;

          this.clearAttackTarget();

          if (this.move) {
            this.move.autoMove = false;
            this.move.moveMod = (_crd && MoveModEnum === void 0 ? (_reportPossibleCrUseOfMoveModEnum({
              error: Error()
            }), MoveModEnum) : MoveModEnum).PosMove;
          }

          this.node.setRotationFromEuler(0, 180, 0);
          (_this$fbx = this.fbx) == null || (_this$fbx = _this$fbx.node) == null || _this$fbx.setRotationFromEuler(0, 0, 0);

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

          const player = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance;

          if (!player || player.isDie || player.roleList.length <= 0) {
            this.clearAttackTarget();
            return;
          }

          const nextRole = player.getMonsterAttackTarget(this.node.worldPosition);

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

          const role = (_this$attackTarget4 = this.attackTarget) == null ? void 0 : _this$attackTarget4.getComponent(_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role);

          if (!role) {
            return null;
          }

          const player = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance;

          if (!player || player.isDie || role.hp <= 0 || player.roleList.indexOf(role) === -1) {
            return null;
          }

          return role;
        }

        updateBossFacing(dt) {
          var _this$move;

          const player = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance;

          if (!(player != null && player.node) || !((_this$move = this.move) != null && _this$move.isRot) || !this.move.rotDrive) {
            return;
          }

          const targetPos = player.node.worldPosition;
          const selfPos = this.node.worldPosition;
          const dx = targetPos.x - selfPos.x;
          const dz = targetPos.z - selfPos.z;

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
          const playerPos = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance.node.worldPosition;
          const desiredGapZ = Math.max(Math.abs(this.bossAttackOffsetZ), Math.abs(this.bossMinGapZ));
          out.set(playerPos.x, this.node.worldPosition.y, playerPos.z + desiredGapZ);
          return out;
        }

        isBossInAttackPosition() {
          const player = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance;

          if (!(player != null && player.node) || player.isDie) {
            return false;
          }

          const playerPos = player.node.worldPosition;
          const dis = Vec3.squaredDistance(playerPos, this.node.worldPosition);

          if (dis > this.attackR) {
            return false;
          }

          this.getBossDesiredAttackPosition(this.bossDesiredAttackPos);
          const selfPos = this.node.worldPosition;
          return Math.abs(selfPos.x - this.bossDesiredAttackPos.x) <= this.bossAttackLockOffsetX && Math.abs(selfPos.z - this.bossDesiredAttackPos.z) <= this.bossAttackLockOffsetZ;
        }

        getSmallMonsterDesiredAttackPosition(out) {
          const targetPos = this.attackTarget.worldPosition;
          const attackRearZ = this.getPlayerAttackRearWorldZ(targetPos.z);
          const desiredAttackZ = attackRearZ + Math.abs(this.smallMonsterAttackOffsetZ);
          const noOverlapZ = this.getPlayerBodyFrontWorldZ(targetPos.z) + Math.max(0, this.smallMonsterAttackMinCenterGapZ);
          out.set(targetPos.x, this.node.worldPosition.y, Math.max(desiredAttackZ, noOverlapZ));
          return out;
        }

        getPlayerAttackRearWorldZ(defaultZ) {
          var _player$roleList;

          const player = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance;

          if (!player || player.isDie || !((_player$roleList = player.roleList) != null && _player$roleList.length)) {
            return defaultZ;
          }

          let rearZ = Number.POSITIVE_INFINITY;

          for (let i = 0; i < player.roleList.length; i++) {
            var _role$node, _role$shoot;

            const role = player.roleList[i];

            if (!(role != null && (_role$node = role.node) != null && _role$node.activeInHierarchy) || role.attackIN) {
              continue;
            }

            const roleAttackZ = (_role$shoot = role.shoot) != null && _role$shoot.isValid ? role.shoot.worldPosition.z : role.node.worldPosition.z;

            if (roleAttackZ < rearZ) {
              rearZ = roleAttackZ;
            }
          }

          return Number.isFinite(rearZ) ? rearZ : defaultZ;
        }

        getPlayerBodyFrontWorldZ(defaultZ) {
          var _player$roleList2;

          const player = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).instance;

          if (!player || player.isDie || !((_player$roleList2 = player.roleList) != null && _player$roleList2.length)) {
            return defaultZ;
          }

          let frontZ = Number.NEGATIVE_INFINITY;

          for (let i = 0; i < player.roleList.length; i++) {
            var _role$node2;

            const role = player.roleList[i];

            if (!(role != null && (_role$node2 = role.node) != null && _role$node2.activeInHierarchy) || role.attackIN || role.hp <= 0) {
              continue;
            }

            const roleZ = role.node.worldPosition.z;

            if (roleZ > frontZ) {
              frontZ = roleZ;
            }
          }

          return Number.isFinite(frontZ) ? frontZ : defaultZ;
        }

        isSmallMonsterInAttackPosition() {
          var _this$attackTarget5;

          if (!((_this$attackTarget5 = this.attackTarget) != null && _this$attackTarget5.activeInHierarchy)) {
            return false;
          }

          this.getSmallMonsterDesiredAttackPosition(this.smallMonsterDesiredAttackPos);
          const selfPos = this.node.worldPosition;
          const targetPos = this.attackTarget.worldPosition;
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
          const scale = this.hpLab.node.scale;
          this.hpLab.node.setScale(-Math.abs(scale.x), Math.abs(scale.y), Math.abs(scale.z));
        }

        playRunAnimation() {
          const state = this.fbx.setAnimation(MonsterAnimEnum.run, true, this.runAnimStartFrame);

          if (state) {
            state.speed = this.runAnimSpeed;
          }
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
          } else {
            const role = this.getAttackRole();

            if (role) {
              (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
                error: Error()
              }), EventManager) : EventManager).instance.emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
                error: Error()
              }), EventType) : EventType).PLAYER_HIT_2, role, 1);
            }
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "meshFlashDataList_Die", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "fbx", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "monsterType", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBaby_0;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "hpLab", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "move", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "attackR", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 4;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "bossAttackLockOffsetX", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.9;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "bossAttackOffsetZ", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.4;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "bossMinGapZ", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.4;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "bossAttackLockOffsetZ", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.28;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "smallMonsterAttackOffsetZ", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.2;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "smallMonsterAttackMinCenterGapZ", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.85;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "smallMonsterAttackLockOffsetX", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.55;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "smallMonsterAttackLockOffsetZ", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.22;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "smallMonsterDieOverrideClip", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "smallMonsterDeathThrowHeight", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.8;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "smallMonsterDeathThrowDistanceZ", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 6;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "smallMonsterDeathThrowDurationRate", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2c40d59e1ac0050bfd5e4aece9657278c88a4b47.js.map