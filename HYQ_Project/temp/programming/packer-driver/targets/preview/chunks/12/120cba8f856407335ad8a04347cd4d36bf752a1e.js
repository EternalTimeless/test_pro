System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12", "__unresolved_13", "__unresolved_14", "__unresolved_15"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCBoolean, CCFloat, CCInteger, Node, Quat, Tween, tween, Vec3, MoveDrive, Role, getCirclePosition, ArmsTypeEnum, BulletEnum, EventType, LayerEnum, PoolEnum, PrefabsEnum, RoleEnum, SoundEnum, PoolManager, EventManager, PrefabsManager, TweenTool, GameOverPanel, UnityUpComponent, AudioManager, BulletManager, FlashRedManager, BulletBatchRenderer, LayerManager, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _class4, _class5, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _class6, _crd, ccclass, property, WeaponBulletConfig, PlayerFBXAnimName, Player;

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
        type: CCFloat,
        displayName: '子弹威力',
        tooltip: '该武器发射子弹时的基础伤害倍率。'
      }), _dec4 = property({
        type: _crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
          error: Error()
        }), BulletEnum) : BulletEnum,
        displayName: '子弹模型',
        tooltip: '该武器使用的子弹预制体类型。'
      }), _dec(_class = (_class2 = class WeaponBulletConfig {
        constructor() {
          _initializerDefineProperty(this, "armsType", _descriptor, this);

          _initializerDefineProperty(this, "bulletPower", _descriptor2, this);

          _initializerDefineProperty(this, "bulletType", _descriptor3, this);
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
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "bulletPower", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "bulletType", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
            error: Error()
          }), BulletEnum) : BulletEnum).arrow;
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

      _export("Player", Player = (_dec5 = ccclass('Player'), _dec6 = property(_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
        error: Error()
      }), Role) : Role), _dec7 = property(CCFloat), _dec8 = property({
        type: CCInteger,
        displayName: '+1人数上限',
        tooltip: '玩家通过 +1 最多增加到的角色数量。达到后继续吃 +1 只回收道具，不再增加角色。'
      }), _dec9 = property({
        type: CCInteger,
        displayName: '同时发射子弹人数上限',
        tooltip: '每轮最多允许多少个角色同时发射子弹。只限制射击人数，不影响 +1 总人数。'
      }), _dec10 = property({
        type: CCInteger,
        displayName: '枪口特效最大播放数',
        tooltip: '每轮射击最多允许多少个角色播放枪口特效。只影响特效，不影响子弹数量。'
      }), _dec11 = property(CCBoolean), _dec12 = property({
        type: [WeaponBulletConfig],
        displayName: '武器子弹配置',
        tooltip: '配置各武器的子弹威力和子弹模型。'
      }), _dec13 = property(Node), _dec5(_class4 = (_class5 = (_class6 = class Player extends (_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
        error: Error()
      }), UnityUpComponent) : UnityUpComponent) {
        constructor() {
          super(...arguments);
          this.LayerCount = 8;
          this.roleType = (_crd && RoleEnum === void 0 ? (_reportPossibleCrUseOfRoleEnum({
            error: Error()
          }), RoleEnum) : RoleEnum).underling;

          _initializerDefineProperty(this, "roleList", _descriptor4, this);

          this.move = void 0;

          _initializerDefineProperty(this, "attackSpeed", _descriptor5, this);

          this.isDie = false;
          this.curCount = 1;

          _initializerDefineProperty(this, "maxRoleCount", _descriptor6, this);

          _initializerDefineProperty(this, "maxShootingRoleCount", _descriptor7, this);

          _initializerDefineProperty(this, "maxMuzzleEffectCount", _descriptor8, this);

          _initializerDefineProperty(this, "enableRuntimeUpgradePrewarm", _descriptor9, this);

          _initializerDefineProperty(this, "weaponBulletConfigList", _descriptor10, this);

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
          this.roleLayoutDirty = false;
          this.isLock = false;

          // public MoveX: number = 8;
          _initializerDefineProperty(this, "shootList", _descriptor11, this);

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
          if (this.isLock) {
            this.roleAttack(dt);
          }

          this.processPendingRolePrewarm();
          this.processPendingBulletPrewarm();
          this.processPendingRoleSwitch();
          this.roleMove();
        }

        roleAttack(dt) {
          if (this._attackTime <= 0) {
            // this.attackIn = true;
            var attackTime = 1 / this.attackSpeed;
            this._attackTime = attackTime; // const layer = Math.round(this.roleList.length / this.LayerCount) * 2 + 1;
            // for (let i = 0; i < layer; i++) {
            //     this.attackEvent(i);
            // }

            var shootCount = Math.min(this.roleList.length, this.maxShootingRoleCount);
            var outerLayer = this.getShootingOuterLayer(shootCount);
            var effectPlayCount = 0;

            for (var i = 0; i < shootCount; i++) {
              var roleIndex = (this.shootRoleStartIndex + i) % this.roleList.length;
              var role = this.roleList[roleIndex];

              if (!role.attackIN) {
                var playEffect = this.shouldPlayMuzzleEffect(roleIndex, outerLayer, effectPlayCount);

                if (playEffect) {
                  effectPlayCount++;
                }

                role.attackEvent(0, role.visualBulletCount, 1, this.node.worldPosition.x, playEffect); // const animIndex = isMove ? PlayerFBXAnimName.run_attack : PlayerFBXAnimName.attack;
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

        getShootingOuterLayer(shootCount) {
          var outerLayer = 0;

          for (var i = 0; i < shootCount; i++) {
            var roleIndex = (this.shootRoleStartIndex + i) % this.roleList.length;
            var layer = this.getRoleLayer(roleIndex);

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

          var effectiveIndex = index - 1;
          return Math.floor(Math.log2(effectiveIndex / this.LayerCount + 1));
        }

        upArms(armwType) {
          var weaponBulletConfig = this.getWeaponBulletConfig(armwType);

          switch (armwType) {
            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).bq:
              this.applyWeaponBulletConfig(weaponBulletConfig);
              this.attackSpeed = 4;
              break;

            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jq:
              this.applyWeaponBulletConfig(weaponBulletConfig);
              this.attackSpeed = 6;
              break;

            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jtl:
              this.applyWeaponBulletConfig(weaponBulletConfig);
              this.attackSpeed = 10;
              (_crd && TweenTool === void 0 ? (_reportPossibleCrUseOfTweenTool({
                error: Error()
              }), TweenTool) : TweenTool).scaleShake(this.node);
              this.roleR = 1;
              (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
                error: Error()
              }), Role) : Role).soundType = (_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
                error: Error()
              }), SoundEnum) : SoundEnum).Sound_FireGun;
              this.startRoleSwitch((_crd && RoleEnum === void 0 ? (_reportPossibleCrUseOfRoleEnum({
                error: Error()
              }), RoleEnum) : RoleEnum).dazhuang);
              break;

            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jtl2:
              {
                this.applyWeaponBulletConfig(weaponBulletConfig);
                this.attackSpeed = 20;
                (_crd && TweenTool === void 0 ? (_reportPossibleCrUseOfTweenTool({
                  error: Error()
                }), TweenTool) : TweenTool).scaleShake(this.node);
                this.roleR = 1;
                (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
                  error: Error()
                }), Role) : Role).soundType = (_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
                  error: Error()
                }), SoundEnum) : SoundEnum).Sound_FireGun;
                this.startRoleSwitch((_crd && RoleEnum === void 0 ? (_reportPossibleCrUseOfRoleEnum({
                  error: Error()
                }), RoleEnum) : RoleEnum).dazhuangPlus);
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
        }

        prepareArmsUpgrade(armwType) {
          (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).inst.preload((_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
            error: Error()
          }), SoundEnum) : SoundEnum).Sound_Ship_UpLevel);
          var soundType = this.getSoundTypeByArms(armwType);

          if (soundType !== null) {
            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).inst.preload(soundType);
          }

          if (!this.enableRuntimeUpgradePrewarm) {
            this.clearRuntimeWarmupQueue();
            return;
          }

          var bulletType = this.getBulletTypeByArms(armwType);

          if (bulletType !== null) {
            this.startBulletPrewarm(bulletType, this.getWeaponPrewarmBulletCount());
          }

          var targetRoleType = this.getRoleTypeByArms(armwType);

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

        getBulletTypeByArms(armwType) {
          var _this$getWeaponBullet, _this$getWeaponBullet2;

          return (_this$getWeaponBullet = (_this$getWeaponBullet2 = this.getWeaponBulletConfig(armwType)) == null ? void 0 : _this$getWeaponBullet2.bulletType) != null ? _this$getWeaponBullet : null;
        }

        getWeaponBulletConfig(armwType) {
          for (var i = 0; i < this.weaponBulletConfigList.length; i++) {
            var config = this.weaponBulletConfigList[i];

            if ((config == null ? void 0 : config.armsType) === armwType) {
              return config;
            }
          }

          return null;
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
          var shootCount = Math.min(this.roleList.length, this.maxShootingRoleCount);
          var count = 0;

          for (var i = 0; i < shootCount; i++) {
            var role = this.roleList[i];
            count += role ? role.visualBulletCount : 1;
          }

          return Math.max(1, Math.min(count, 8));
        }

        startBulletPrewarm(bulletType, needCount) {
          var poolKey = (_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
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

          var bulletLayer = this.getBulletLayer();

          if (!bulletLayer) {
            return;
          }

          var count = this.bulletPrewarmPerFrame;

          while (count > 0 && this.pendingBulletPrewarmType !== null && this.pendingBulletPrewarmCount > 0) {
            var bullet = (_crd && BulletManager === void 0 ? (_reportPossibleCrUseOfBulletManager({
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
            var _bullet = (_crd && BulletManager === void 0 ? (_reportPossibleCrUseOfBulletManager({
              error: Error()
            }), BulletManager) : BulletManager).instance.prewarmBullet3D(this.pendingBulletBatchWarmType, bulletLayer, false);

            (_crd && BulletBatchRenderer === void 0 ? (_reportPossibleCrUseOfBulletBatchRenderer({
              error: Error()
            }), BulletBatchRenderer) : BulletBatchRenderer).getOrCreate(bulletLayer).prewarmBullet(_bullet);
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
          var poolKey = (_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).role + roleType;
          var missingCount = Math.max(0, needCount - (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
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

          var count = Math.min(this.rolePrewarmPerFrame, this.pendingRolePrewarmCount);

          while (count > 0) {
            var role = this.createRoleByType(this.pendingRolePrewarmType);
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

          var count = this.roleSwitchPerFrame;

          while (count > 0 && this.pendingRoleSwitchIndex < this.roleList.length) {
            var index = this.pendingRoleSwitchIndex;
            var oldRole = this.roleList[index];

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

            var newRole = this.getRoleByType(this.pendingRoleSwitchType);
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
          var isMove = this.move.isMove;
          var animName = this.isLock ? isMove ? PlayerFBXAnimName.run_attack : PlayerFBXAnimName.attack : isMove ? PlayerFBXAnimName.run : PlayerFBXAnimName.idle;

          for (var i = 0; i < this.roleList.length; i++) {
            var fbx = this.roleList[i].fbxManager;
            var state = fbx.getAnimState(animName);

            if (fbx.curState !== animName || !(state != null && state.isPlaying)) {
              fbx.setAnimation(animName, true);
            }
          }
        }

        addRole(role) {
          if (this.roleList.length >= this.maxRoleCount) {
            return false;
          }

          role.attackIN = true;
          this.roleList.push(role);
          this.curCount++;
          return true;
        }
        /**
         * 上移边界计算方法
         * 该方法用于计算角色列表中攻击状态角色的最远x坐标位置，并据此设置移动值
         */


        upMoveBoundary() {
          // 初始化最大x坐标值为0
          var x = 0; // 遍历角色列表

          for (var i = 0; i < this.roleList.length; i++) {
            // 获取当前角色
            var role = this.roleList[i]; // 如果角色处于攻击状态，则跳过该角色

            if (role.attackIN) {
              continue;
            } // 计算角色x坐标的绝对值


            var rx = Math.abs(role.node.x); // 更新最大x坐标值

            if (rx > x) {
              x = rx;
            }
          } // 设置移动对象的x轴移动值为8减去最大x坐标值


          this.move.MoveX = 7.8 - x;
          this.move.MoveX = 7.8 - x;
        }

        getNextPos(index, local) {
          if (index === void 0) {
            index = -1;
          }

          if (local === void 0) {
            local = false;
          }

          if (index == -1) {
            index = this.roleList.length - 1;
          } // 列表第一个不算，用 index-1 作为有效索引
          // 第 n 层数量 = LayerCount * 2^n，前 n 层总数 = LayerCount * (2^n - 1)
          // layer = floor(log2(effectiveIndex / LayerCount + 1))


          var effectiveIndex = index - 1;
          var layer = Math.floor(Math.log2(effectiveIndex / this.LayerCount + 1));
          var layerCount = this.LayerCount << layer;
          var indexInLayer = effectiveIndex - this.LayerCount * ((1 << layer) - 1);

          if (local) {
            var pos = (_crd && getCirclePosition === void 0 ? (_reportPossibleCrUseOfgetCirclePosition({
              error: Error()
            }), getCirclePosition) : getCirclePosition)(Vec3.ZERO, layerCount, indexInLayer, (layer + 1) * this.roleR);
            return pos;
          } else {
            var _pos = (_crd && getCirclePosition === void 0 ? (_reportPossibleCrUseOfgetCirclePosition({
              error: Error()
            }), getCirclePosition) : getCirclePosition)(this.node.worldPosition, layerCount, indexInLayer, (layer + 1) * this.roleR);

            return _pos;
          }
        }

        get length() {
          return this.roleList.length;
        }

        get attackTarget() {
          this.selectIndex = (this.selectIndex + 1) % this.roleList.length;
          var role = this.roleList[this.selectIndex];
          return role;
        }

        upPos() {
          var _this = this;

          if (this.isDie) {
            return;
          }

          this.isDie = this.roleList.length == 0;

          if (this.isDie) {
            // this.TimeFlowsBackWard();
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

          for (var i = this.roleList.length - 1; i >= 0; i--) {
            var role = this.roleList[i];

            if (!role.node.active) {
              this.roleList.splice(i, 1);
              (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
                error: Error()
              }), PoolEnum) : PoolEnum).role + role.type, role);
            }
          }

          var _loop = function _loop() {
            var role = _this.roleList[_i];

            if (!_i) {
              tween(role.node).to(0.2, {
                position: Vec3.ZERO
              }).start();
            } else {
              var pos = _this.getNextPos(_i, true);

              tween(role.node).to(0.2, {
                position: pos
              }).call(() => {
                (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                  error: Error()
                }), PoolManager) : PoolManager).instance.V3 = pos;
              }).start();
            }
          };

          for (var _i = 0; _i < this.roleList.length; _i++) {
            _loop();
          }

          this.upMoveBoundary();
        }

        hit(pos, count) {
          if (count === void 0) {
            count = 4;
          }

          if (this.isDie) {
            return;
          }

          var list = this.roleList;
          var total = list.length;
          var len = count < total ? count : total; // 预分配距离数组，避免临时对象

          var dists = [];

          for (var i = 0; i < total; i++) {
            var rp = list[i].node.worldPosition;
            var dx = rp.x - pos.x;
            var dz = rp.z - pos.z;
            dists[i] = dx * dx + dz * dz;
          } // 选择法找最近的 len 个索引


          var picked = [];
          var used = [];

          for (var n = 0; n < len; n++) {
            var minIdx = -1;
            var minDist = 0;

            for (var _i2 = 0; _i2 < total; _i2++) {
              if (used[_i2]) continue;

              if (minIdx < 0 || dists[_i2] < minDist) {
                minIdx = _i2;
                minDist = dists[_i2];
              }
            }

            picked[n] = minIdx;
            used[minIdx] = true;
          } // 从后往前删除，保证索引不错位


          for (var _i3 = 0; _i3 < len; _i3++) {
            var role = list[picked[_i3]];
            role.hp -= 3;
            this.roleDie(role); // role.node.active = false;
            // PoolManager.instance.setPool(PoolEnum.role + this.roleType, role);
          }

          picked.sort(function (a, b) {
            return b - a;
          });

          for (var _i4 = 0; _i4 < len; _i4++) {
            list.splice(picked[_i4], 1);
          }

          this.upPos();
        }

        hit_2(role, power) {
          role.hp -= power;

          if (role.hp <= 0) {
            var index = this.roleList.indexOf(role);

            if (index != -1) {
              this.roleList.splice(index, 1);
              this.roleDie(role);
              this.upPos();
            }
          } else {
            (_crd && FlashRedManager === void 0 ? (_reportPossibleCrUseOfFlashRedManager({
              error: Error()
            }), FlashRedManager) : FlashRedManager).instance.flashRed(role.node, role.meshRedDataList);
          }
        }

        TimeFlowsBackWard() {
          this._attackTime = 0.5;
          this.shootRoleStartIndex = 0;

          for (var i = 0; i < this.curCount; i++) {
            var role = this.role;
            this.roleList.push(role);
            this.node.addChild(role.node);
            role.attackIN = false;

            if (i == 0) {
              role.node.setPosition(Vec3.ZERO);
            } else {
              var pos = this.getNextPos(i, true);
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
          this.scheduleOnce(() => {
            this.isDie = false;
          }, 2);
        }

        roleDie(role) {
          var endTime = role.fbxManager.setAnimation(PlayerFBXAnimName.die, false).duration;
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
          var role = this.getRoleByType(this.roleType);
          role.hp = 2;
          role.node.active = true;
          return role;
        }

        getRoleByType(roleType) {
          var role = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).role + roleType);

          if (!role) {
            role = this.createRoleByType(roleType);
          }

          role.hp = 2;
          role.node.active = true;
          return role;
        }

        createRoleByType(roleType) {
          var node = (_crd && PrefabsManager === void 0 ? (_reportPossibleCrUseOfPrefabsManager({
            error: Error()
          }), PrefabsManager) : PrefabsManager).instance.GetPrefabsIns((_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
            error: Error()
          }), PrefabsEnum) : PrefabsEnum).hero, roleType);
          return node.getComponent(_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role);
        }

        attackEvent(index) {
          (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).inst.playOneShot((_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role).soundType, 0.3, 0.08); // console.log("攻击", index);

          var pos = this.shootList[index].worldPosition;
          var bullet = (_crd && BulletManager === void 0 ? (_reportPossibleCrUseOfBulletManager({
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


      }, _class6.instance = void 0, _class6), (_descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "roleList", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "attackSpeed", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class5.prototype, "maxRoleCount", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 55;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class5.prototype, "maxShootingRoleCount", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 30;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class5.prototype, "maxMuzzleEffectCount", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class5.prototype, "enableRuntimeUpgradePrewarm", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class5.prototype, "weaponBulletConfigList", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [(() => {
            var config = new WeaponBulletConfig();
            config.armsType = (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).bq;
            config.bulletPower = 2;
            config.bulletType = (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
              error: Error()
            }), BulletEnum) : BulletEnum).arrow_1;
            return config;
          })(), (() => {
            var config = new WeaponBulletConfig();
            config.armsType = (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jq;
            config.bulletPower = 2;
            config.bulletType = (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
              error: Error()
            }), BulletEnum) : BulletEnum).arrow_2;
            return config;
          })(), (() => {
            var config = new WeaponBulletConfig();
            config.armsType = (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jtl;
            config.bulletPower = 0.5;
            config.bulletType = (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
              error: Error()
            }), BulletEnum) : BulletEnum).arrow_3;
            return config;
          })(), (() => {
            var config = new WeaponBulletConfig();
            config.armsType = (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jtl2;
            config.bulletPower = 0.3;
            config.bulletType = (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
              error: Error()
            }), BulletEnum) : BulletEnum).arrow_4;
            return config;
          })()];
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class5.prototype, "shootList", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class5)) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=120cba8f856407335ad8a04347cd4d36bf752a1e.js.map