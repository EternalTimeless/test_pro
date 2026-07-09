System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12", "__unresolved_13", "__unresolved_14", "__unresolved_15"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCBoolean, CCFloat, CCInteger, Node, Quat, Tween, tween, Vec3, MoveDrive, Role, getCirclePosition, ArmsTypeEnum, BulletEnum, EventType, LayerEnum, PoolEnum, PrefabsEnum, RoleEnum, SoundEnum, PoolManager, EventManager, PrefabsManager, TweenTool, GameOverPanel, UnityUpComponent, AudioManager, BulletManager, FlashRedManager, BulletBatchRenderer, LayerManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _class4, _class5, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _class6, _crd, ccclass, property, WeaponBulletConfig, PlayerFBXAnimName, Player;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfMoveDrive(extras) {
    _reporterNs.report("MoveDrive", "../../Base/MoveRot/MoveDrive", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRole(extras) {
    _reporterNs.report("Role", "./Role", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetCirclePosition(extras) {
    _reporterNs.report("getCirclePosition", "../../Tool/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfArmsTypeEnum(extras) {
    _reporterNs.report("ArmsTypeEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletEnum(extras) {
    _reporterNs.report("BulletEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../../Base/EnumList", _context.meta, extras);
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

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../../Base/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPrefabsManager(extras) {
    _reporterNs.report("PrefabsManager", "../../Base/PrefabsManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTweenTool(extras) {
    _reporterNs.report("TweenTool", "../../Tool/TweenTool", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameOverPanel(extras) {
    _reporterNs.report("GameOverPanel", "../UI/GameOver/GameOverPanel", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnityUpComponent(extras) {
    _reporterNs.report("UnityUpComponent", "../../Base/UnityUpComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "../../Base/AudioManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletManager(extras) {
    _reporterNs.report("BulletManager", "../Battle/BulletManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFlashRedManager(extras) {
    _reporterNs.report("FlashRedManager", "../Battle/Base/FlashRedManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletBatchRenderer(extras) {
    _reporterNs.report("BulletBatchRenderer", "../Battle/BulletBatchRenderer", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLayerManager(extras) {
    _reporterNs.report("LayerManager", "../../Base/LayerManager", _context.meta, extras);
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
      Node = _cc.Node;
      Quat = _cc.Quat;
      Tween = _cc.Tween;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      MoveDrive = _unresolved_2.MoveDrive;
    }, function (_unresolved_3) {
      Role = _unresolved_3.Role;
    }, function (_unresolved_4) {
      getCirclePosition = _unresolved_4.getCirclePosition;
    }, function (_unresolved_5) {
      ArmsTypeEnum = _unresolved_5.ArmsTypeEnum;
      BulletEnum = _unresolved_5.BulletEnum;
      EventType = _unresolved_5.EventType;
      LayerEnum = _unresolved_5.LayerEnum;
      PoolEnum = _unresolved_5.PoolEnum;
      PrefabsEnum = _unresolved_5.PrefabsEnum;
      RoleEnum = _unresolved_5.RoleEnum;
      SoundEnum = _unresolved_5.SoundEnum;
    }, function (_unresolved_6) {
      PoolManager = _unresolved_6.default;
    }, function (_unresolved_7) {
      EventManager = _unresolved_7.default;
    }, function (_unresolved_8) {
      PrefabsManager = _unresolved_8.PrefabsManager;
    }, function (_unresolved_9) {
      TweenTool = _unresolved_9.default;
    }, function (_unresolved_10) {
      GameOverPanel = _unresolved_10.GameOverPanel;
    }, function (_unresolved_11) {
      UnityUpComponent = _unresolved_11.UnityUpComponent;
    }, function (_unresolved_12) {
      AudioManager = _unresolved_12.default;
    }, function (_unresolved_13) {
      BulletManager = _unresolved_13.default;
    }, function (_unresolved_14) {
      FlashRedManager = _unresolved_14.FlashRedManager;
    }, function (_unresolved_15) {
      BulletBatchRenderer = _unresolved_15.BulletBatchRenderer;
    }, function (_unresolved_16) {
      LayerManager = _unresolved_16.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b41f7vy1r5GDYGyMwUkQXm3", "Player", undefined);

      __checkObsolete__(['_decorator', 'CCBoolean', 'CCFloat', 'CCInteger', 'Component', 'Node', 'Quat', 'Tween', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);
      WeaponBulletConfig = (_dec = ccclass('WeaponBulletConfig'), _dec2 = property({
        type: _crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
          error: Error()
        }), ArmsTypeEnum) : ArmsTypeEnum,
        displayName: '武器类型',
        tooltip: '该配置对应的武器类型。'
      }), _dec3 = property({
        type: _crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
          error: Error()
        }), ArmsTypeEnum) : ArmsTypeEnum,
        displayName: '武器模型',
        tooltip: '单独指定该配置使用的角色/武器模型；选择 none 时跟随武器类型。'
      }), _dec4 = property({
        type: CCFloat,
        displayName: '子弹威力',
        tooltip: '该武器发射子弹时的基础伤害倍率。'
      }), _dec5 = property({
        type: _crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
          error: Error()
        }), BulletEnum) : BulletEnum,
        displayName: '子弹模型',
        tooltip: '该武器使用的子弹预制体类型。'
      }), _dec6 = property({
        type: CCBoolean,
        displayName: '打乱发射顺序',
        tooltip: '复数角色时随机打乱该武器的发射时机，不改变子弹方向。'
      }), _dec7 = property({
        type: CCFloat,
        displayName: '随机发射延迟比例',
        tooltip: '每个角色随机延迟发射的最大时间占攻击间隔的比例。只影响发射顺序。'
      }), _dec8 = property({
        type: CCFloat,
        displayName: '初始子弹随机X',
        tooltip: '只给每个角色本次发射的第一颗子弹增加轻微 X 轴随机。0 表示关闭。'
      }), _dec(_class = (_class2 = class WeaponBulletConfig {
        constructor() {
          _initializerDefineProperty(this, "armsType", _descriptor, this);

          _initializerDefineProperty(this, "weaponModel", _descriptor2, this);

          _initializerDefineProperty(this, "bulletPower", _descriptor3, this);

          _initializerDefineProperty(this, "bulletType", _descriptor4, this);

          _initializerDefineProperty(this, "randomizeShotOrder", _descriptor5, this);

          _initializerDefineProperty(this, "randomShotDelayWindowRatio", _descriptor6, this);

          _initializerDefineProperty(this, "initialBulletRandomX", _descriptor7, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "armsType", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
            error: Error()
          }), ArmsTypeEnum) : ArmsTypeEnum).bq;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "weaponModel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
            error: Error()
          }), ArmsTypeEnum) : ArmsTypeEnum).none;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "bulletPower", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "bulletType", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
            error: Error()
          }), BulletEnum) : BulletEnum).arrow;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "randomizeShotOrder", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "randomShotDelayWindowRatio", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.75;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "initialBulletRandomX", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      })), _class2)) || _class);

      PlayerFBXAnimName = /*#__PURE__*/function (PlayerFBXAnimName) {
        PlayerFBXAnimName[PlayerFBXAnimName["idle"] = 0] = "idle";
        PlayerFBXAnimName[PlayerFBXAnimName["attack"] = 1] = "attack";
        PlayerFBXAnimName[PlayerFBXAnimName["run_attack"] = 2] = "run_attack";
        PlayerFBXAnimName[PlayerFBXAnimName["die"] = 3] = "die";
        PlayerFBXAnimName[PlayerFBXAnimName["run"] = 4] = "run";
        return PlayerFBXAnimName;
      }(PlayerFBXAnimName || {});

      _export("Player", Player = (_dec9 = ccclass('Player'), _dec10 = property(_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
        error: Error()
      }), Role) : Role), _dec11 = property(CCFloat), _dec12 = property({
        type: CCInteger,
        displayName: '+1人数上限',
        tooltip: '玩家通过 +1 最多增加到的角色数量。达到后继续吃 +1 只回收道具，不再增加角色。'
      }), _dec13 = property({
        type: CCInteger,
        displayName: '再来一次补人圈数上限',
        tooltip: '按画面可见圈数限制。3 表示中心第1圈 + 外围第2圈 + 外围第3圈。'
      }), _dec14 = property({
        type: CCInteger,
        displayName: '最外圈角色数',
        tooltip: '最外圈排满需要的角色数量。填 28 时，满员阵型为 1 + 8 + 16 + 28 = 53。'
      }), _dec15 = property({
        type: CCFloat,
        displayName: '减员缩圈延迟(秒)',
        tooltip: '角色减少后等待多久再重新排列缩圈。等待期间再次减员会重新计时。'
      }), _dec16 = property({
        type: CCInteger,
        displayName: '同时发射子弹人数上限',
        tooltip: '每轮最多允许多少个角色同时发射子弹。只限制射击人数，不影响 +1 总人数。'
      }), _dec17 = property({
        type: CCInteger,
        displayName: '枪口特效最大播放数',
        tooltip: '每轮射击最多允许多少个角色播放枪口特效。只影响特效，不影响子弹数量。'
      }), _dec18 = property({
        type: CCInteger,
        displayName: '错峰发射武器配置索引',
        tooltip: '指定哪一个武器子弹配置使用错峰发射。0 表示第一个油桶给出的武器；负数表示关闭。'
      }), _dec19 = property({
        type: CCFloat,
        displayName: '错峰发射占攻击间隔比例',
        tooltip: '错峰武器每轮射击摊开的时间比例。0.85 表示在本轮攻击间隔的 85% 时间内连续发射，伤害和总弹量不变。'
      }), _dec20 = property({
        type: CCInteger,
        displayName: '默认武器配置索引',
        tooltip: '开局默认使用的“武器子弹配置”索引。-1 表示保持旧默认值：子弹 arrow、威力 1、攻击速度使用 Player.attackSpeed。'
      }), _dec21 = property(CCBoolean), _dec22 = property({
        type: [WeaponBulletConfig],
        displayName: '武器子弹配置',
        tooltip: '配置各武器的子弹威力和子弹模型。'
      }), _dec23 = property(Node), _dec9(_class4 = (_class5 = (_class6 = class Player extends (_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
        error: Error()
      }), UnityUpComponent) : UnityUpComponent) {
        constructor(...args) {
          super(...args);
          this.LayerCount = 8;
          this.roleType = (_crd && RoleEnum === void 0 ? (_reportPossibleCrUseOfRoleEnum({
            error: Error()
          }), RoleEnum) : RoleEnum).underling;

          _initializerDefineProperty(this, "roleList", _descriptor8, this);

          this.move = void 0;

          _initializerDefineProperty(this, "attackSpeed", _descriptor9, this);

          this.isDie = false;
          this.curCount = 1;
          this.pendingAddRoleCount = 0;

          _initializerDefineProperty(this, "maxRoleCount", _descriptor10, this);

          _initializerDefineProperty(this, "retryMaxRoleLayerCount", _descriptor11, this);

          _initializerDefineProperty(this, "outerLayerRoleCount", _descriptor12, this);

          _initializerDefineProperty(this, "shrinkAfterRoleLossDelay", _descriptor13, this);

          _initializerDefineProperty(this, "maxShootingRoleCount", _descriptor14, this);

          _initializerDefineProperty(this, "maxMuzzleEffectCount", _descriptor15, this);

          _initializerDefineProperty(this, "staggerShotWeaponConfigIndex", _descriptor16, this);

          _initializerDefineProperty(this, "staggerShotWindowRatio", _descriptor17, this);

          _initializerDefineProperty(this, "defaultWeaponConfigIndex", _descriptor18, this);

          _initializerDefineProperty(this, "enableRuntimeUpgradePrewarm", _descriptor19, this);

          _initializerDefineProperty(this, "weaponBulletConfigList", _descriptor20, this);

          this.shootRoleStartIndex = 0;
          this.pendingRoleSwitchType = null;
          this.pendingRoleSwitchIndex = 0;
          this.roleSwitchPerFrame = 6;
          this.pendingRolePrewarmType = null;
          this.pendingRolePrewarmCount = 0;
          this.rolePrewarmPerFrame = 4;
          this.pendingBulletPrewarmType = null;
          this.pendingBulletPrewarmCount = 0;
          this.pendingBulletBatchWarmType = null;
          this.bulletPrewarmPerFrame = 2;
          this.currentWeaponBulletConfig = null;
          this.currentWeaponBulletConfigIndex = -1;
          this.staggerShotClock = 0;
          this.pendingStaggerShots = [];
          this.roleLayoutDirty = false;
          this.shrinkDelayTimer = -1;
          this.shrinkAnimating = false;
          this.shrinkDirtyDuringAnimating = false;
          this.roleLayoutTweenDuration = 0.2;
          this.isLock = false;

          // public MoveX: number = 8;
          _initializerDefineProperty(this, "shootList", _descriptor21, this);

          this.shootIndex = 1;
          this.attackIn = false;
          this._attackTime = 0;
          this.roleR = 0.8;
          this.selectIndex = 0;
        }

        start() {
          Player.instance = this;
          this.move = this.node.getComponent(_crd && MoveDrive === void 0 ? (_reportPossibleCrUseOfMoveDrive({
            error: Error()
          }), MoveDrive) : MoveDrive);
          this.applyDefaultWeaponConfig();
          this.syncRespawnRoleCount();
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).PLAYER_HIT, this.hit, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).PLAYER_HIT_2, this.hit_2, this);
        }

        _update(dt) {
          // const rx = RockerManager.instance.rockerDirection.x;
          // const x = this.node.x;
          // if (x < this.MoveX && rx < 0 || x > -this.MoveX && rx > 0) {
          //     this.move.moveEvent(dt);
          // } else {
          //     this.move.isMove = false;
          // }
          this.staggerShotClock += dt;

          if (this.isLock) {
            this.roleAttack(dt);
          }

          this.processPendingStaggerShots();
          this.processPendingRolePrewarm();
          this.processPendingBulletPrewarm();
          this.processPendingRoleSwitch();
          this.processDelayedShrink(dt);
          this.roleMove();
        }

        roleAttack(dt) {
          if (this._attackTime <= 0) {
            // this.attackIn = true;
            const attackTime = 1 / this.attackSpeed;
            this._attackTime = attackTime; // const layer = Math.round(this.roleList.length / this.LayerCount) * 2 + 1;
            // for (let i = 0; i < layer; i++) {
            //     this.attackEvent(i);
            // }

            const shootCount = Math.min(this.roleList.length, this.maxShootingRoleCount);
            const outerLayer = this.getShootingOuterLayer(shootCount);
            const useStaggerShot = this.shouldUseStaggerShot();
            const useRandomShot = shootCount > 1 && this.shouldUseRandomShot();
            const randomShotConfig = this.currentWeaponBulletConfig;
            let effectPlayCount = 0;

            for (let i = 0; i < shootCount; i++) {
              const roleIndex = (this.shootRoleStartIndex + i) % this.roleList.length;
              const role = this.roleList[roleIndex];

              if (!role.attackIN) {
                const playEffect = this.shouldPlayMuzzleEffect(roleIndex, outerLayer, effectPlayCount);

                if (playEffect) {
                  effectPlayCount++;
                }

                if (useRandomShot) {
                  var _randomShotConfig$ran, _randomShotConfig$ini;

                  this.enqueueRandomShot(role, attackTime, role.visualBulletCount, 1, this.node.worldPosition.x, playEffect, (_randomShotConfig$ran = randomShotConfig == null ? void 0 : randomShotConfig.randomShotDelayWindowRatio) != null ? _randomShotConfig$ran : 0, (_randomShotConfig$ini = randomShotConfig == null ? void 0 : randomShotConfig.initialBulletRandomX) != null ? _randomShotConfig$ini : 0);
                } else if (useStaggerShot) {
                  this.enqueueStaggerShot(role, i, shootCount, attackTime, role.visualBulletCount, 1, this.node.worldPosition.x, playEffect);
                } else {
                  role.attackEvent(0, role.visualBulletCount, 1, this.node.worldPosition.x, playEffect);
                } // const animIndex = isMove ? PlayerFBXAnimName.run_attack : PlayerFBXAnimName.attack;
                // const animState = role.fbxManager.setAnimation(animIndex, false);
                // const endTime = animState.duration;
                // const animScale = endTime / attackTime;
                // animState.speed = animScale;

              }
            }

            if (this.roleList.length > 0) {
              this.shootRoleStartIndex = (this.shootRoleStartIndex + shootCount) % this.roleList.length;
            } // this.scheduleOnce(() => {
            //     this.attackIn = false;
            // }, attackTime)

          } else {
            this._attackTime -= dt;
          }
        }

        shouldUseStaggerShot() {
          if (this.currentWeaponBulletConfig) {
            return false;
          }

          return this.staggerShotWeaponConfigIndex >= 0 && this.currentWeaponBulletConfigIndex === Math.floor(this.staggerShotWeaponConfigIndex) && this.staggerShotWindowRatio > 0;
        }

        shouldUseRandomShot() {
          var _this$currentWeaponBu;

          return !!((_this$currentWeaponBu = this.currentWeaponBulletConfig) != null && _this$currentWeaponBu.randomizeShotOrder);
        }

        enqueueRandomShot(role, attackTime, visualBulletCount, damageScale, lockWorldX, playEffect, delayWindowRatio, initialBulletRandomX) {
          if (!role) {
            return;
          }

          const windowRatio = Math.max(0, Math.min(0.95, delayWindowRatio));
          const delay = Math.random() * Math.max(0, attackTime * windowRatio);
          this.pendingStaggerShots.push({
            role,
            fireTime: this.staggerShotClock + delay,
            visualBulletCount,
            damageScale,
            lockWorldX,
            playEffect,
            initialBulletRandomX: Math.max(0, initialBulletRandomX)
          });
        }

        enqueueStaggerShot(role, shotIndex, shootCount, attackTime, visualBulletCount, damageScale, lockWorldX, playEffect) {
          if (!role || shootCount <= 1) {
            role == null || role.attackEvent(0, visualBulletCount, damageScale, lockWorldX, playEffect);
            return;
          }

          const windowRatio = Math.max(0, Math.min(0.95, this.staggerShotWindowRatio));
          const spreadTime = Math.max(0, attackTime * windowRatio);
          const delay = spreadTime * shotIndex / Math.max(1, shootCount - 1);
          this.pendingStaggerShots.push({
            role,
            fireTime: this.staggerShotClock + delay,
            visualBulletCount,
            damageScale,
            lockWorldX,
            playEffect,
            initialBulletRandomX: 0
          });
        }

        processPendingStaggerShots() {
          for (let i = this.pendingStaggerShots.length - 1; i >= 0; i--) {
            const shot = this.pendingStaggerShots[i];

            if (!shot || shot.fireTime > this.staggerShotClock) {
              continue;
            }

            this.pendingStaggerShots[i] = this.pendingStaggerShots[this.pendingStaggerShots.length - 1];
            this.pendingStaggerShots.pop();

            if (!shot.role || !shot.role.node || !shot.role.node.activeInHierarchy || shot.role.attackIN) {
              continue;
            }

            shot.role.attackEvent(0, shot.visualBulletCount, shot.damageScale, shot.lockWorldX, shot.playEffect, shot.initialBulletRandomX);
          }
        }

        getShootingOuterLayer(shootCount) {
          let outerLayer = 0;

          for (let i = 0; i < shootCount; i++) {
            const roleIndex = (this.shootRoleStartIndex + i) % this.roleList.length;
            const layer = this.getRoleLayer(roleIndex);

            if (layer > outerLayer) {
              outerLayer = layer;
            }
          }

          return outerLayer;
        }

        shouldPlayMuzzleEffect(roleIndex, outerLayer, effectPlayCount) {
          if (this.maxMuzzleEffectCount <= 0 || effectPlayCount >= this.maxMuzzleEffectCount) {
            return false;
          }

          return this.getRoleLayer(roleIndex) === outerLayer;
        }

        getRoleLayer(index) {
          if (index <= 0) {
            return 0;
          }

          const effectiveIndex = index - 1;
          let layer = 0;
          let indexInLayer = effectiveIndex;
          let layerCount = this.getRoleLayerCount(layer);

          while (indexInLayer >= layerCount) {
            indexInLayer -= layerCount;
            layer++;
            layerCount = this.getRoleLayerCount(layer);
          }

          return layer;
        }

        upArms(armwType, weaponBulletConfigIndex = -1) {
          var _weaponBulletConfig$a;

          const weaponBulletConfig = this.getWeaponBulletConfig(armwType, weaponBulletConfigIndex);
          const upgradeArmsType = (_weaponBulletConfig$a = weaponBulletConfig == null ? void 0 : weaponBulletConfig.armsType) != null ? _weaponBulletConfig$a : armwType;
          this.pendingStaggerShots.length = 0;
          this.currentWeaponBulletConfig = weaponBulletConfig;
          this.currentWeaponBulletConfigIndex = weaponBulletConfig ? this.getWeaponBulletConfigResolvedIndex(weaponBulletConfig, weaponBulletConfigIndex) : -1;
          let shouldApplyRoleModel = false;

          switch (upgradeArmsType) {
            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).bq:
              this.applyWeaponBulletConfig(weaponBulletConfig);
              this.applyWeaponAttackSpeed(upgradeArmsType);
              shouldApplyRoleModel = true;
              break;

            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jq:
              this.applyWeaponBulletConfig(weaponBulletConfig);
              this.applyWeaponAttackSpeed(upgradeArmsType);
              shouldApplyRoleModel = true;
              break;

            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jtl:
              this.applyWeaponBulletConfig(weaponBulletConfig);
              this.applyWeaponAttackSpeed(upgradeArmsType);
              (_crd && TweenTool === void 0 ? (_reportPossibleCrUseOfTweenTool({
                error: Error()
              }), TweenTool) : TweenTool).scaleShake(this.node);
              this.roleR = 1;
              (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
                error: Error()
              }), Role) : Role).soundType = (_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
                error: Error()
              }), SoundEnum) : SoundEnum).Sound_FireGun;
              shouldApplyRoleModel = true;
              break;

            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jtl2:
              {
                this.applyWeaponBulletConfig(weaponBulletConfig);
                this.applyWeaponAttackSpeed(upgradeArmsType);
                (_crd && TweenTool === void 0 ? (_reportPossibleCrUseOfTweenTool({
                  error: Error()
                }), TweenTool) : TweenTool).scaleShake(this.node);
                this.roleR = 1;
                (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
                  error: Error()
                }), Role) : Role).soundType = (_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
                  error: Error()
                }), SoundEnum) : SoundEnum).Sound_FireGun;
                shouldApplyRoleModel = true;
                break;
              }

            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).tk:
              break;

            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jj:
              break;
          }

          if (shouldApplyRoleModel) {
            this.applyWeaponRoleModel(weaponBulletConfig, upgradeArmsType);
          }
        }

        prepareArmsUpgrade(armwType, weaponBulletConfigIndex = -1) {
          var _weaponBulletConfig$a2, _weaponBulletConfig$b;

          const weaponBulletConfig = this.getWeaponBulletConfig(armwType, weaponBulletConfigIndex);
          const upgradeArmsType = (_weaponBulletConfig$a2 = weaponBulletConfig == null ? void 0 : weaponBulletConfig.armsType) != null ? _weaponBulletConfig$a2 : armwType;
          (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).inst.preload((_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
            error: Error()
          }), SoundEnum) : SoundEnum).Sound_Ship_UpLevel);
          const soundType = this.getSoundTypeByArms(upgradeArmsType);

          if (soundType !== null) {
            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).inst.preload(soundType);
          }

          if (!this.enableRuntimeUpgradePrewarm) {
            this.clearRuntimeWarmupQueue();
            return;
          }

          const bulletType = (_weaponBulletConfig$b = weaponBulletConfig == null ? void 0 : weaponBulletConfig.bulletType) != null ? _weaponBulletConfig$b : this.getBulletTypeByArms(upgradeArmsType);

          if (bulletType !== null) {
            this.startBulletPrewarm(bulletType, this.getWeaponPrewarmBulletCount());
          }

          const targetRoleType = this.getRoleTypeByWeaponConfig(weaponBulletConfig, upgradeArmsType);

          if (targetRoleType === null) {
            return;
          }

          this.startRolePrewarm(targetRoleType, this.roleList.length);
        }

        clearRuntimeWarmupQueue() {
          this.pendingRolePrewarmType = null;
          this.pendingRolePrewarmCount = 0;
          this.pendingBulletPrewarmType = null;
          this.pendingBulletPrewarmCount = 0;
          this.pendingBulletBatchWarmType = null;
        }

        getRoleTypeByArms(armwType) {
          switch (armwType) {
            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).bq:
            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jq:
              return (_crd && RoleEnum === void 0 ? (_reportPossibleCrUseOfRoleEnum({
                error: Error()
              }), RoleEnum) : RoleEnum).underling;

            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jtl:
              return (_crd && RoleEnum === void 0 ? (_reportPossibleCrUseOfRoleEnum({
                error: Error()
              }), RoleEnum) : RoleEnum).dazhuang;

            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jtl2:
              return (_crd && RoleEnum === void 0 ? (_reportPossibleCrUseOfRoleEnum({
                error: Error()
              }), RoleEnum) : RoleEnum).dazhuangPlus;
          }

          return null;
        }

        getWeaponModelArmsType(config, fallbackArmsType) {
          var _config$armsType;

          const modelType = config == null ? void 0 : config.weaponModel;

          if (modelType !== undefined && modelType !== null && modelType !== (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
            error: Error()
          }), ArmsTypeEnum) : ArmsTypeEnum).none) {
            return modelType;
          }

          return (_config$armsType = config == null ? void 0 : config.armsType) != null ? _config$armsType : fallbackArmsType;
        }

        getRoleTypeByWeaponConfig(config, fallbackArmsType) {
          return this.getRoleTypeByArms(this.getWeaponModelArmsType(config, fallbackArmsType));
        }

        applyWeaponRoleModel(config, fallbackArmsType) {
          const targetRoleType = this.getRoleTypeByWeaponConfig(config, fallbackArmsType);

          if (targetRoleType === null) {
            return;
          }

          this.startRoleSwitch(targetRoleType);
        }

        getBulletTypeByArms(armwType) {
          var _this$getWeaponBullet, _this$getWeaponBullet2;

          return (_this$getWeaponBullet = (_this$getWeaponBullet2 = this.getWeaponBulletConfig(armwType)) == null ? void 0 : _this$getWeaponBullet2.bulletType) != null ? _this$getWeaponBullet : null;
        }

        getWeaponBulletConfig(armwType, weaponBulletConfigIndex = -1) {
          const indexedConfig = this.getWeaponBulletConfigByIndex(weaponBulletConfigIndex);

          if (indexedConfig) {
            return indexedConfig;
          }

          for (let i = 0; i < this.weaponBulletConfigList.length; i++) {
            const config = this.weaponBulletConfigList[i];

            if ((config == null ? void 0 : config.armsType) === armwType) {
              return config;
            }
          }

          return null;
        }

        getWeaponBulletConfigByIndex(index) {
          var _this$weaponBulletCon;

          if (!this.weaponBulletConfigList || index < 0) {
            return null;
          }

          const safeIndex = Math.floor(index);
          return (_this$weaponBulletCon = this.weaponBulletConfigList[safeIndex]) != null ? _this$weaponBulletCon : null;
        }

        applyDefaultWeaponConfig() {
          const config = this.getWeaponBulletConfigByIndex(this.defaultWeaponConfigIndex);

          if (!config) {
            this.currentWeaponBulletConfig = null;
            this.currentWeaponBulletConfigIndex = -1;
            return;
          }

          this.applyWeaponBulletConfig(config);
          const armsType = config.armsType;
          this.applyWeaponAttackSpeed(armsType);
          const soundType = this.getSoundTypeByArms(armsType);

          if (soundType !== null) {
            (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
              error: Error()
            }), Role) : Role).soundType = soundType;
          }

          this.currentWeaponBulletConfig = config;
          this.currentWeaponBulletConfigIndex = this.getWeaponBulletConfigResolvedIndex(config, this.defaultWeaponConfigIndex);
        }

        getWeaponBulletConfigResolvedIndex(config, weaponBulletConfigIndex) {
          if (weaponBulletConfigIndex >= 0) {
            return Math.floor(weaponBulletConfigIndex);
          }

          return this.weaponBulletConfigList ? this.weaponBulletConfigList.indexOf(config) : -1;
        }

        applyWeaponBulletConfig(config) {
          if (!config) {
            return;
          }

          (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role).power = config.bulletPower;
          (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role).bulletType = config.bulletType;
        }

        applyWeaponAttackSpeed(armwType) {
          switch (armwType) {
            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).bq:
              this.attackSpeed = 4;
              break;

            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jq:
              this.attackSpeed = 6;
              break;

            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jtl:
              this.attackSpeed = 10;
              break;

            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jtl2:
              this.attackSpeed = 20;
              break;
          }
        }

        getSoundTypeByArms(armwType) {
          switch (armwType) {
            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jtl:
            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jtl2:
              return (_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
                error: Error()
              }), SoundEnum) : SoundEnum).Sound_FireGun;
          }

          return null;
        }

        getWeaponPrewarmBulletCount() {
          const shootCount = Math.min(this.roleList.length, this.maxShootingRoleCount);
          let count = 0;

          for (let i = 0; i < shootCount; i++) {
            const role = this.roleList[i];
            count += role ? role.visualBulletCount : 1;
          }

          return Math.max(1, Math.min(count, 8));
        }

        startBulletPrewarm(bulletType, needCount) {
          const poolKey = (_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).bullet + bulletType;
          this.pendingBulletPrewarmType = bulletType;
          this.pendingBulletPrewarmCount = Math.max(0, needCount - (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPoolSize(poolKey));
          this.pendingBulletBatchWarmType = bulletType;
        }

        processPendingBulletPrewarm() {
          if (this.pendingBulletPrewarmType === null && this.pendingBulletBatchWarmType === null) {
            return;
          }

          const bulletLayer = this.getBulletLayer();

          if (!bulletLayer) {
            return;
          }

          let count = this.bulletPrewarmPerFrame;

          while (count > 0 && this.pendingBulletPrewarmType !== null && this.pendingBulletPrewarmCount > 0) {
            const bullet = (_crd && BulletManager === void 0 ? (_reportPossibleCrUseOfBulletManager({
              error: Error()
            }), BulletManager) : BulletManager).instance.prewarmBullet3D(this.pendingBulletPrewarmType, bulletLayer, true);
            (_crd && BulletBatchRenderer === void 0 ? (_reportPossibleCrUseOfBulletBatchRenderer({
              error: Error()
            }), BulletBatchRenderer) : BulletBatchRenderer).getOrCreate(bulletLayer).prewarmBullet(bullet);
            this.pendingBulletPrewarmCount--;
            count--;
          }

          if (this.pendingBulletPrewarmCount <= 0) {
            this.pendingBulletPrewarmType = null;
          }

          if (this.pendingBulletBatchWarmType !== null) {
            const bullet = (_crd && BulletManager === void 0 ? (_reportPossibleCrUseOfBulletManager({
              error: Error()
            }), BulletManager) : BulletManager).instance.prewarmBullet3D(this.pendingBulletBatchWarmType, bulletLayer, false);
            (_crd && BulletBatchRenderer === void 0 ? (_reportPossibleCrUseOfBulletBatchRenderer({
              error: Error()
            }), BulletBatchRenderer) : BulletBatchRenderer).getOrCreate(bulletLayer).prewarmBullet(bullet);
            this.pendingBulletBatchWarmType = null;
          }
        }

        getBulletLayer() {
          if ((_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role).bulletLayer && (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role).bulletLayer.isValid) {
            return (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
              error: Error()
            }), Role) : Role).bulletLayer;
          }

          (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role).bulletLayer = (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
            error: Error()
          }), LayerManager) : LayerManager).instance.getLayer((_crd && LayerEnum === void 0 ? (_reportPossibleCrUseOfLayerEnum({
            error: Error()
          }), LayerEnum) : LayerEnum).BulletLayer);
          return (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role).bulletLayer;
        }

        startRolePrewarm(roleType, needCount) {
          const poolKey = (_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).role + roleType;
          const missingCount = Math.max(0, needCount - (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPoolSize(poolKey));

          if (missingCount <= 0) {
            this.pendingRolePrewarmType = null;
            this.pendingRolePrewarmCount = 0;
            return;
          }

          this.pendingRolePrewarmType = roleType;
          this.pendingRolePrewarmCount = missingCount;
        }

        processPendingRolePrewarm() {
          if (this.pendingRolePrewarmType === null) {
            return;
          }

          if (this.pendingRolePrewarmCount <= 0) {
            this.pendingRolePrewarmType = null;
            return;
          }

          let count = Math.min(this.rolePrewarmPerFrame, this.pendingRolePrewarmCount);

          while (count > 0) {
            const role = this.createRoleByType(this.pendingRolePrewarmType);
            role.node.active = false;
            (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).role + this.pendingRolePrewarmType, role);
            this.pendingRolePrewarmCount--;
            count--;
          }

          if (this.pendingRolePrewarmCount <= 0) {
            this.pendingRolePrewarmType = null;
          }
        }

        startRoleSwitch(roleType) {
          this.roleType = roleType;
          this.pendingRoleSwitchType = roleType;
          this.pendingRoleSwitchIndex = 0;
          this.roleLayoutDirty = false;

          if (this.enableRuntimeUpgradePrewarm) {
            this.startRolePrewarm(roleType, this.roleList.length);
          } else {
            this.pendingRolePrewarmType = null;
            this.pendingRolePrewarmCount = 0;
          }
        }

        processPendingRoleSwitch() {
          if (this.pendingRoleSwitchType === null) {
            return;
          }

          let count = this.roleSwitchPerFrame;

          while (count > 0 && this.pendingRoleSwitchIndex < this.roleList.length) {
            const index = this.pendingRoleSwitchIndex;
            const oldRole = this.roleList[index];

            if (!oldRole) {
              this.pendingRoleSwitchIndex++;
              count--;
              continue;
            }

            if (oldRole.type === this.pendingRoleSwitchType) {
              this.pendingRoleSwitchIndex++;
              count--;
              continue;
            }

            const newRole = this.getRoleByType(this.pendingRoleSwitchType);
            Tween.stopAllByTarget(oldRole.node);
            Tween.stopAllByTarget(newRole.node);
            this.roleList[index] = newRole;
            this.node.addChild(newRole.node);
            newRole.node.setPosition(oldRole.node.position);
            newRole.node.setScale(oldRole.node.scale);
            newRole.attackIN = oldRole.attackIN;
            oldRole.node.active = false;
            (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).role + oldRole.type, oldRole);
            this.roleLayoutDirty = true;
            this.pendingRoleSwitchIndex++;
            count--;
          }

          if (this.pendingRoleSwitchIndex >= this.roleList.length) {
            this.pendingRoleSwitchType = null;
            this.pendingRoleSwitchIndex = 0;

            if (this.roleLayoutDirty) {
              this.roleLayoutDirty = false;
              this.upPos();
            }
          }
        } //7.003 2.329


        roleMove() {
          const animName = this.getCurrentRoleAnimName();

          for (let i = 0; i < this.roleList.length; i++) {
            const fbx = this.roleList[i].fbxManager;
            const state = fbx.getAnimState(animName);

            if (fbx.curState !== animName || !(state != null && state.isPlaying)) {
              fbx.setAnimation(animName, true);
            }
          }
        }

        getCurrentRoleAnimName() {
          const isMove = this.move.isMove;
          return this.isLock ? isMove ? PlayerFBXAnimName.run_attack : PlayerFBXAnimName.attack : isMove ? PlayerFBXAnimName.run : PlayerFBXAnimName.idle;
        }

        syncRoleAnimationToTeam(role) {
          if (!role || role.attackIN || !role.fbxManager) {
            return;
          }

          const animName = this.getCurrentRoleAnimName();
          let frame = 0;

          for (let i = 0; i < this.roleList.length; i++) {
            const sourceRole = this.roleList[i];

            if (!sourceRole || sourceRole === role || sourceRole.attackIN || !sourceRole.fbxManager) {
              continue;
            }

            const sourceState = sourceRole.fbxManager.getAnimState(animName);

            if (sourceState && sourceState.duration > 0) {
              frame = sourceState.time % sourceState.duration / sourceState.duration;
              break;
            }
          }

          role.fbxManager.setAnimationImmediate(animName, true, frame);
        }

        addRole(role, attackIn = true) {
          if (this.isDie) {
            return false;
          }

          if (this.roleList.length >= this.getEffectiveMaxRoleCount()) {
            return false;
          }

          role.attackIN = attackIn;
          this.roleList.push(role);
          this.curCount = Math.min(this.getEffectiveMaxRoleCount(), this.curCount + 1);
          this.syncRoleAnimationToTeam(role);
          return true;
        }

        canReserveRoleSlot(maxCount = this.getEffectiveMaxRoleCount()) {
          const limit = Math.min(this.getEffectiveMaxRoleCount(), Math.max(1, Math.floor(maxCount)));
          return !this.isDie && this.roleList.length + this.pendingAddRoleCount < limit;
        }

        isRoleCountAtLimit(maxCount = this.getEffectiveMaxRoleCount()) {
          const limit = Math.min(this.getEffectiveMaxRoleCount(), Math.max(1, Math.floor(maxCount)));
          return this.roleList.length >= limit;
        }

        reserveRoleSlot(maxCount = this.getEffectiveMaxRoleCount()) {
          if (!this.canReserveRoleSlot(maxCount)) {
            return -1;
          }

          const index = this.roleList.length + this.pendingAddRoleCount;
          this.pendingAddRoleCount++;
          return index;
        }

        releaseRoleSlot() {
          this.pendingAddRoleCount = Math.max(0, this.pendingAddRoleCount - 1);
        }

        commitReservedRole(role) {
          this.releaseRoleSlot();

          if (!role || this.isDie) {
            return null;
          }

          let committedRole = role;

          if (role.type !== this.roleType) {
            committedRole = this.replaceRoleWithCurrentType(role);
          }

          if (!this.addRole(committedRole, false)) {
            committedRole.node.active = false;
            (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).role + committedRole.type, committedRole);
            return null;
          }

          return committedRole;
        }

        replaceRoleWithCurrentType(role) {
          var _role$fbxManager;

          const parent = role.node.parent;
          const worldPos = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.V3.set(role.node.worldPosition);
          const scale = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.V3.set(role.node.scale);
          Tween.stopAllByTarget(role.node);

          if ((_role$fbxManager = role.fbxManager) != null && _role$fbxManager.node) {
            Tween.stopAllByTarget(role.fbxManager.node);
          }

          role.node.active = false;
          (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).role + role.type, role);
          const newRole = this.getRoleByType(this.roleType);

          if (parent) {
            parent.addChild(newRole.node);
          }

          newRole.node.setWorldPosition(worldPos);
          newRole.node.setScale(scale);
          newRole.attackIN = role.attackIN;
          (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.V3 = worldPos;
          (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.V3 = scale;
          return newRole;
        }
        /**
         * 上移边界计算方法
         * 该方法用于计算角色列表中攻击状态角色的最远x坐标位置，并据此设置移动值
         */


        upMoveBoundary() {
          // 初始化最大x坐标值为0
          let x = 0; // 遍历角色列表

          for (let i = 0; i < this.roleList.length; i++) {
            // 获取当前角色
            const role = this.roleList[i]; // 如果角色处于攻击状态，则跳过该角色

            if (role.attackIN) {
              continue;
            } // 计算角色x坐标的绝对值


            const rx = Math.abs(role.node.x); // 更新最大x坐标值

            if (rx > x) {
              x = rx;
            }
          } // 设置移动对象的x轴移动值为8减去最大x坐标值


          this.move.MoveX = 7.8 - x;
          this.move.MoveX = 7.8 - x;
        }

        getNextPos(index = -1, local = false) {
          if (index == -1) {
            index = this.roleList.length - 1;
          }

          if (index <= 0) {
            return local ? (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.V3.set(Vec3.ZERO) : (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.V3.set(this.node.worldPosition);
          } // 列表第一个不算，用 index-1 作为有效索引
          // 第 n 层数量 = LayerCount * 2^n，前 n 层总数 = LayerCount * (2^n - 1)
          // layer = floor(log2(effectiveIndex / LayerCount + 1))


          const effectiveIndex = index - 1;
          const layerInfo = this.getRoleLayerInfo(effectiveIndex);

          if (local) {
            const pos = (_crd && getCirclePosition === void 0 ? (_reportPossibleCrUseOfgetCirclePosition({
              error: Error()
            }), getCirclePosition) : getCirclePosition)(Vec3.ZERO, layerInfo.layerCount, layerInfo.indexInLayer, (layerInfo.layer + 1) * this.roleR);
            return pos;
          } else {
            const pos = (_crd && getCirclePosition === void 0 ? (_reportPossibleCrUseOfgetCirclePosition({
              error: Error()
            }), getCirclePosition) : getCirclePosition)(this.node.worldPosition, layerInfo.layerCount, layerInfo.indexInLayer, (layerInfo.layer + 1) * this.roleR);
            return pos;
          }
        }

        getRoleLayerInfo(effectiveIndex) {
          let layer = 0;
          let indexInLayer = Math.max(0, effectiveIndex);
          let layerCount = this.getRoleLayerCount(layer);

          while (indexInLayer >= layerCount) {
            indexInLayer -= layerCount;
            layer++;
            layerCount = this.getRoleLayerCount(layer);
          }

          return {
            layer,
            layerCount,
            indexInLayer
          };
        }

        getRoleLayerCount(layer) {
          if (layer <= 0) {
            return this.LayerCount;
          }

          if (layer === 1) {
            return this.LayerCount * 2;
          }

          const outerCount = Math.max(1, Math.floor(this.outerLayerRoleCount));

          if (layer === 2) {
            return outerCount;
          }

          return outerCount << layer - 2;
        }

        getEffectiveMaxRoleCount() {
          const configuredMax = Math.max(1, Math.floor(this.maxRoleCount));
          const fourLayerMax = 1 + this.getRoleLayerCount(0) + this.getRoleLayerCount(1) + this.getRoleLayerCount(2);
          return Math.min(configuredMax, fourLayerMax);
        }

        get length() {
          return this.roleList.length;
        }

        get attackTarget() {
          this.selectIndex = (this.selectIndex + 1) % this.roleList.length;
          const role = this.roleList[this.selectIndex];
          return role;
        }

        getMonsterAttackTarget(monsterWorldPos) {
          var _monsterWorldPos$x;

          if (this.isDie || !this.roleList.length) {
            return null;
          }

          let attackRearZ = Number.POSITIVE_INFINITY;

          for (let i = 0; i < this.roleList.length; i++) {
            const role = this.roleList[i];

            if (!this.isValidMonsterTargetRole(role)) {
              continue;
            }

            const roleAttackZ = this.getRoleAttackWorldZ(role);

            if (roleAttackZ < attackRearZ) {
              attackRearZ = roleAttackZ;
            }
          }

          if (!Number.isFinite(attackRearZ)) {
            return null;
          }

          let bestRole = null;
          let bestXDistance = Number.POSITIVE_INFINITY;
          let bestLayer = -1;
          const zTolerance = Math.max(0.05, this.roleR * 0.35);
          const targetX = (_monsterWorldPos$x = monsterWorldPos == null ? void 0 : monsterWorldPos.x) != null ? _monsterWorldPos$x : this.node.worldPosition.x;

          for (let i = 0; i < this.roleList.length; i++) {
            const role = this.roleList[i];

            if (!this.isValidMonsterTargetRole(role)) {
              continue;
            }

            const roleAttackZ = this.getRoleAttackWorldZ(role);

            if (Math.abs(roleAttackZ - attackRearZ) > zTolerance) {
              continue;
            }

            const xDistance = Math.abs(role.node.worldPosition.x - targetX);
            const layer = this.getRoleLayer(i);

            if (xDistance < bestXDistance || Math.abs(xDistance - bestXDistance) <= 0.001 && layer > bestLayer) {
              bestRole = role;
              bestXDistance = xDistance;
              bestLayer = layer;
            }
          }

          return bestRole;
        }

        isValidMonsterTargetRole(role) {
          var _role$node;

          return !!(role != null && (_role$node = role.node) != null && _role$node.activeInHierarchy) && !role.attackIN && role.hp > 0;
        }

        getRoleAttackWorldZ(role) {
          var _role$shoot;

          return role != null && (_role$shoot = role.shoot) != null && _role$shoot.isValid ? role.shoot.worldPosition.z : role.node.worldPosition.z;
        }

        upPos() {
          this.applyRoleLayout(false);
        }

        requestShrinkAfterRoleLoss() {
          if (this.isDie) {
            return;
          }

          this.recycleInactiveRoles();
          this.recycleOverflowRoles();

          if (this.getCombatRoleCount() <= 0) {
            this.cancelDelayedShrink();
            this.handlePlayerDie();
            return;
          }

          if (this.shrinkAnimating) {
            this.shrinkDirtyDuringAnimating = true;
            return;
          }

          this.shrinkDelayTimer = Math.max(0, this.shrinkAfterRoleLossDelay);

          if (this.shrinkDelayTimer <= 0) {
            this.processDelayedShrink(0);
          }
        }

        processDelayedShrink(dt) {
          if (this.shrinkDelayTimer < 0) {
            return;
          }

          if (this.isDie) {
            this.cancelDelayedShrink();
            return;
          }

          if (this.shrinkAnimating) {
            this.shrinkDelayTimer = -1;
            this.shrinkDirtyDuringAnimating = true;
            return;
          }

          this.shrinkDelayTimer -= dt;

          if (this.shrinkDelayTimer > 0) {
            return;
          }

          this.shrinkDelayTimer = -1;
          this.applyRoleLayout(true);
        }

        cancelDelayedShrink() {
          this.shrinkDelayTimer = -1;
          this.shrinkAnimating = false;
          this.shrinkDirtyDuringAnimating = false;
        }

        applyRoleLayout(isDelayedShrink) {
          if (this.isDie) {
            return;
          }

          this.recycleInactiveRoles();
          this.recycleOverflowRoles();

          if (this.getCombatRoleCount() <= 0) {
            this.cancelDelayedShrink();
            this.handlePlayerDie();
            return;
          }

          if (isDelayedShrink) {
            this.shrinkAnimating = true;
            this.shrinkDirtyDuringAnimating = false;
          }

          let layoutIndex = 0;

          for (let i = 0; i < this.roleList.length; i++) {
            const role = this.roleList[i];

            if (role.attackIN) {
              continue;
            }

            if (!layoutIndex) {
              tween(role.node).to(this.roleLayoutTweenDuration, {
                position: Vec3.ZERO
              }).start();
            } else {
              const pos = this.getNextPos(layoutIndex, true);
              tween(role.node).to(this.roleLayoutTweenDuration, {
                position: pos
              }).call(() => {
                (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                  error: Error()
                }), PoolManager) : PoolManager).instance.V3 = pos;
              }).start();
            }

            layoutIndex++;
          }

          this.upMoveBoundary();

          if (isDelayedShrink) {
            this.scheduleOnce(() => {
              this.shrinkAnimating = false;

              if (!this.shrinkDirtyDuringAnimating) {
                return;
              }

              this.shrinkDirtyDuringAnimating = false;
              this.requestShrinkAfterRoleLoss();
            }, this.roleLayoutTweenDuration);
          }
        }

        getCombatRoleCount() {
          let count = 0;

          for (let i = 0; i < this.roleList.length; i++) {
            const role = this.roleList[i];

            if (role && role.node.active && !role.attackIN) {
              count++;
            }
          }

          return count;
        }

        recycleInactiveRoles() {
          for (let i = this.roleList.length - 1; i >= 0; i--) {
            const role = this.roleList[i];

            if (!role || !role.node.active) {
              this.roleList.splice(i, 1);

              if (role) {
                (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                  error: Error()
                }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
                  error: Error()
                }), PoolEnum) : PoolEnum).role + role.type, role);
              }
            }
          }
        }

        recycleOverflowRoles() {
          const maxCount = this.getEffectiveMaxRoleCount();

          for (let i = this.roleList.length - 1; i >= maxCount; i--) {
            var _role$fbxManager2;

            const role = this.roleList[i];
            this.roleList.splice(i, 1);

            if (!role) {
              continue;
            }

            Tween.stopAllByTarget(role.node);

            if ((_role$fbxManager2 = role.fbxManager) != null && _role$fbxManager2.node) {
              Tween.stopAllByTarget(role.fbxManager.node);
            }

            role.node.active = false;
            (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).role + role.type, role);
          }
        }

        recyclePendingAttackRoles() {
          for (let i = this.roleList.length - 1; i >= 0; i--) {
            var _role$fbxManager3;

            const role = this.roleList[i];

            if (!role || !role.attackIN) {
              continue;
            }

            Tween.stopAllByTarget(role.node);

            if ((_role$fbxManager3 = role.fbxManager) != null && _role$fbxManager3.node) {
              Tween.stopAllByTarget(role.fbxManager.node);
            }

            role.node.active = false;
            this.roleList.splice(i, 1);
            (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).role + role.type, role);
          }
        }

        handlePlayerDie() {
          this.cancelDelayedShrink();
          this.isDie = true;
          this.recyclePendingAttackRoles();
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).PLAYER_RESURRECTION, this.TimeFlowsBackWard, this, true);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).PLAYER_DIE);
          (_crd && GameOverPanel === void 0 ? (_reportPossibleCrUseOfGameOverPanel({
            error: Error()
          }), GameOverPanel) : GameOverPanel).instance.show(false);
        }

        hit(pos, count = 4) {
          if (this.isDie) {
            return;
          }

          const list = this.roleList;
          const total = list.length;
          let candidateCount = 0; // 预分配距离数组，避免临时对象

          const dists = [];

          for (let i = 0; i < total; i++) {
            if (list[i].attackIN) {
              dists[i] = Number.MAX_VALUE;
              continue;
            }

            candidateCount++;
            const rp = list[i].node.worldPosition;
            const dx = rp.x - pos.x;
            const dz = rp.z - pos.z;
            dists[i] = dx * dx + dz * dz;
          } // 选择法找最近的 len 个索引


          const len = count < candidateCount ? count : candidateCount;

          if (len <= 0) {
            return;
          }

          const picked = [];
          const used = [];

          for (let n = 0; n < len; n++) {
            let minIdx = -1;
            let minDist = 0;

            for (let i = 0; i < total; i++) {
              if (used[i]) continue;
              if (dists[i] === Number.MAX_VALUE) continue;

              if (minIdx < 0 || dists[i] < minDist) {
                minIdx = i;
                minDist = dists[i];
              }
            }

            if (minIdx < 0) {
              break;
            }

            picked[n] = minIdx;
            used[minIdx] = true;
          } // 从后往前删除，保证索引不错位


          for (let i = 0; i < picked.length; i++) {
            const role = list[picked[i]];
            role.hp -= 3;
            this.roleDie(role); // role.node.active = false;
            // PoolManager.instance.setPool(PoolEnum.role + this.roleType, role);
          }

          picked.sort(function (a, b) {
            return b - a;
          });

          for (let i = 0; i < picked.length; i++) {
            list.splice(picked[i], 1);
          }

          this.requestShrinkAfterRoleLoss();
        }

        hit_2(role, power) {
          if (role.attackIN) {
            return;
          }

          role.hp -= power;

          if (role.hp <= 0) {
            const index = this.roleList.indexOf(role);

            if (index != -1) {
              this.roleList.splice(index, 1);
              this.roleDie(role);
              this.requestShrinkAfterRoleLoss();
            }
          } else {
            (_crd && FlashRedManager === void 0 ? (_reportPossibleCrUseOfFlashRedManager({
              error: Error()
            }), FlashRedManager) : FlashRedManager).instance.flashRed(role.node, role.meshRedDataList);
          }
        }

        TimeFlowsBackWard() {
          this.clearRolesForRetry();
          this.syncRespawnRoleCount();
          this.isDie = false;
          this.pendingAddRoleCount = 0;
          this.pendingStaggerShots.length = 0;
          this._attackTime = 0.5;
          this.shootRoleStartIndex = 0;
          const retryRoleCount = Math.min(this.curCount, this.getRetryMaxRoleCount());

          for (let i = 0; i < retryRoleCount; i++) {
            const role = this.role;
            this.roleList.push(role);
            this.node.addChild(role.node);
            role.attackIN = false;

            if (i == 0) {
              role.node.setPosition(Vec3.ZERO);
            } else {
              const pos = this.getNextPos(i, true);
              role.node.setPosition(pos);
              (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.V3 = pos;
            }

            role.node.setScale(Vec3.ZERO);
            tween(role.node).to(0.2, {
              scale: Vec3.ONE
            }, {
              easing: "backOut"
            }).start();
            role.fbxManager.setAnimation(PlayerFBXAnimName.idle, true);
          }

          this.selectIndex = 0;
          this.attackIn = false;
        }

        syncRespawnRoleCount() {
          var _this$roleList$length, _this$roleList;

          const currentRoleCount = (_this$roleList$length = (_this$roleList = this.roleList) == null ? void 0 : _this$roleList.length) != null ? _this$roleList$length : 0;
          this.curCount = Math.min(this.getEffectiveMaxRoleCount(), Math.max(1, this.curCount, currentRoleCount));
        }

        getRetryMaxRoleCount() {
          const circleCount = Math.max(1, Math.floor(this.retryMaxRoleLayerCount));
          let maxCount = 1;

          for (let layer = 0; layer < circleCount - 1; layer++) {
            maxCount += this.getRoleLayerCount(layer);
          }

          return Math.min(this.getEffectiveMaxRoleCount(), maxCount);
        }

        clearRolesForRetry() {
          var _this$roleList2;

          this.cancelDelayedShrink();
          this.pendingAddRoleCount = 0;

          if (!((_this$roleList2 = this.roleList) != null && _this$roleList2.length)) {
            return;
          }

          for (let i = this.roleList.length - 1; i >= 0; i--) {
            const role = this.roleList[i];

            if (!role) {
              continue;
            }

            Tween.stopAllByTarget(role.node);
            role.node.active = false;
            (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).role + role.type, role);
          }

          this.roleList.length = 0;
        }

        roleDie(role) {
          const endTime = role.fbxManager.setAnimation(PlayerFBXAnimName.die, false).duration;
          role.die(endTime);
          this.scheduleOnce(() => {
            role.node.active = false;
            (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).role + role.type, role);
          }, endTime);
        }

        get role() {
          const role = this.getRoleByType(this.roleType);
          role.hp = 2;
          role.node.active = true;
          return role;
        }

        getRoleForSpawn() {
          return this.getRoleByType(this.roleType);
        }

        getRoleByType(roleType) {
          let role = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).role + roleType);

          if (!role) {
            role = this.createRoleByType(roleType);
          }

          role.type = roleType;
          role.hp = 2;
          role.node.active = true;
          role.resetForSpawn();
          return role;
        }

        createRoleByType(roleType) {
          const node = (_crd && PrefabsManager === void 0 ? (_reportPossibleCrUseOfPrefabsManager({
            error: Error()
          }), PrefabsManager) : PrefabsManager).instance.GetPrefabsIns((_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
            error: Error()
          }), PrefabsEnum) : PrefabsEnum).hero, roleType);
          const role = node.getComponent(_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role);
          role.type = roleType;
          return role;
        }

        attackEvent(index) {
          (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).inst.playOneShot((_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role).soundType, 0.3, 0.08); // console.log("攻击", index);

          const pos = this.shootList[index].worldPosition;
          const bullet = (_crd && BulletManager === void 0 ? (_reportPossibleCrUseOfBulletManager({
            error: Error()
          }), BulletManager) : BulletManager).instance.shootBullet3D((_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role).bulletType, Quat.IDENTITY, (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role).power, (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role).repelPower);
          (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role).bulletLayer.addChild(bullet.node);
          bullet.node.setWorldPosition(pos);
          (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role).aimBulletToCurrentTarget(bullet, this.node.worldPosition.x);
          (_crd && BulletBatchRenderer === void 0 ? (_reportPossibleCrUseOfBulletBatchRenderer({
            error: Error()
          }), BulletBatchRenderer) : BulletBatchRenderer).getOrCreate((_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role).bulletLayer).registerBullet(bullet); // this.effect?.play();
        } // private _soundTime: number = 0;
        // // private soundInterval: number = 0.2;
        // private attackSound(dt: number) {
        //     if (this._soundTime <= 0) {
        //         this._soundTime = 1 / (this.attackSpeed * (this.roleList.length));
        //     }
        // }


      }, _class6.instance = void 0, _class6), (_descriptor8 = _applyDecoratedDescriptor(_class5.prototype, "roleList", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class5.prototype, "attackSpeed", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class5.prototype, "maxRoleCount", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 53;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class5.prototype, "retryMaxRoleLayerCount", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class5.prototype, "outerLayerRoleCount", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 28;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class5.prototype, "shrinkAfterRoleLossDelay", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class5.prototype, "maxShootingRoleCount", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 30;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class5.prototype, "maxMuzzleEffectCount", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 8;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class5.prototype, "staggerShotWeaponConfigIndex", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class5.prototype, "staggerShotWindowRatio", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.85;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class5.prototype, "defaultWeaponConfigIndex", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -1;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class5.prototype, "enableRuntimeUpgradePrewarm", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class5.prototype, "weaponBulletConfigList", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [(() => {
            const config = new WeaponBulletConfig();
            config.armsType = (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).bq;
            config.weaponModel = (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).none;
            config.bulletPower = 2;
            config.bulletType = (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
              error: Error()
            }), BulletEnum) : BulletEnum).arrow_1;
            config.randomizeShotOrder = true;
            config.initialBulletRandomX = 0.35;
            return config;
          })(), (() => {
            const config = new WeaponBulletConfig();
            config.armsType = (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jq;
            config.weaponModel = (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).none;
            config.bulletPower = 2;
            config.bulletType = (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
              error: Error()
            }), BulletEnum) : BulletEnum).arrow_2;
            config.randomizeShotOrder = true;
            config.initialBulletRandomX = 0.35;
            return config;
          })(), (() => {
            const config = new WeaponBulletConfig();
            config.armsType = (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jtl;
            config.weaponModel = (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).none;
            config.bulletPower = 0.5;
            config.bulletType = (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
              error: Error()
            }), BulletEnum) : BulletEnum).arrow_3;
            return config;
          })(), (() => {
            const config = new WeaponBulletConfig();
            config.armsType = (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jtl2;
            config.weaponModel = (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).none;
            config.bulletPower = 0.3;
            config.bulletType = (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
              error: Error()
            }), BulletEnum) : BulletEnum).arrow_4;
            return config;
          })()];
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class5.prototype, "shootList", [_dec23], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class5)) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=120cba8f856407335ad8a04347cd4d36bf752a1e.js.map