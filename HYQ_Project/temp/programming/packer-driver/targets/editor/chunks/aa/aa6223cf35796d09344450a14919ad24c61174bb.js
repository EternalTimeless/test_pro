System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12", "__unresolved_13"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCBoolean, CCFloat, CCInteger, Label, MeshRenderer, Node, Tween, tween, v3, Vec3, BattleTarget3D, BulletMonsterCollisionManager, PoolManager, ArmsTypeEnum, EventType, OtherPrefabsEnum, PoolEnum, PrefabsEnum, SoundEnum, PrefabsManager, TweenTool, EventManager, AttackParkPlay, FlashRedManager, AudioManager, FbxManager, CameraMove, MonsterCreate, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _class4, _class5, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _crd, ccclass, property, AnimArms, ArmsInfo, PropArms;

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

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "../../Base/AudioManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFbxManager(extras) {
    _reporterNs.report("FbxManager", "../SkAnim/FbxManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCameraMove(extras) {
    _reporterNs.report("CameraMove", "../../Base/CameraMove", _context.meta, extras);
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
      Label = _cc.Label;
      MeshRenderer = _cc.MeshRenderer;
      Node = _cc.Node;
      Tween = _cc.Tween;
      tween = _cc.tween;
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
      AudioManager = _unresolved_11.default;
    }, function (_unresolved_12) {
      FbxManager = _unresolved_12.FbxManager;
    }, function (_unresolved_13) {
      CameraMove = _unresolved_13.CameraMove;
    }, function (_unresolved_14) {
      MonsterCreate = _unresolved_14.MonsterCreate;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4c579+CEFxDCr/XI7aDRdSS", "PropArms", undefined);

      __checkObsolete__(['_decorator', 'CCBoolean', 'CCFloat', 'CCInteger', 'Color', 'Component', 'Label', 'MeshRenderer', 'Node', 'Tween', 'tween', 'v3', 'Vec3']);

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
        }), ArmsTypeEnum) : ArmsTypeEnum
      }), _dec3 = property(_crd && FbxManager === void 0 ? (_reportPossibleCrUseOfFbxManager({
        error: Error()
      }), FbxManager) : FbxManager), _dec4 = property(CCInteger), _dec5 = property(CCInteger), _dec6 = property(CCInteger), _dec7 = property(CCBoolean), _dec8 = property({
        type: CCFloat,

        visible() {
          return !this.isCanMove;
        }

      }), _dec9 = property({
        type: CCFloat,

        visible() {
          return !this.isCanMove;
        }

      }), _dec10 = property(CCFloat), _dec(_class = (_class2 = class ArmsInfo {
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
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "fbx", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "tireCount", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "hp", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "moveCount", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "isCanMove", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "canHeight", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "canTireCount", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "wallHeight", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      })), _class2)) || _class));

      _export("PropArms", PropArms = (_dec11 = ccclass('PropArms'), _dec12 = property(ArmsInfo), _dec13 = property(Label), _dec14 = property(Vec3), _dec15 = property(CCFloat), _dec16 = property(CCFloat), _dec17 = property(CCFloat), _dec18 = property(CCFloat), _dec19 = property(CCFloat), _dec20 = property(Node), _dec21 = property(Vec3), _dec22 = property(Node), _dec23 = property(CCFloat), _dec24 = property(CCFloat), _dec11(_class4 = (_class5 = class PropArms extends (_crd && BattleTarget3D === void 0 ? (_reportPossibleCrUseOfBattleTarget3D({
        error: Error()
      }), BattleTarget3D) : BattleTarget3D) {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "armsInfoList", _descriptor10, this);

          _initializerDefineProperty(this, "hpLabel", _descriptor11, this);

          this._curArms = void 0;
          this.tireList = [];
          this._level = 0;
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

          _initializerDefineProperty(this, "jumpHeight", _descriptor14, this);

          _initializerDefineProperty(this, "waveFrontGap", _descriptor15, this);

          _initializerDefineProperty(this, "nextStageDelay", _descriptor16, this);

          // @property(AttackParkPlay)
          // public effect: AttackParkPlay;
          _initializerDefineProperty(this, "animScale", _descriptor17, this);

          _initializerDefineProperty(this, "wallNode", _descriptor18, this);

          _initializerDefineProperty(this, "jumpWallPos", _descriptor19, this);

          _initializerDefineProperty(this, "wallEffect", _descriptor20, this);

          _initializerDefineProperty(this, "speed", _descriptor21, this);

          _initializerDefineProperty(this, "h", _descriptor22, this);

          this._time = 0;
          this.isWallH = false;
          this._pendingWaveStageCount = 0;
          this._isStageAlive = false;
          this._stageSpawnPos = new Vec3();
          this._fixedStageIndex = -1;
          this._disableWaveStageChain = false;
        }

        // @property(Node)
        // public effect_ss: Node;
        damage(power) {
          // 轮胎销毁不受_isShake阻塞
          const hpRatio = this.curHp / this.MaxHp;
          const shouldRemain = Math.max(0, Math.ceil(hpRatio * this._initialTireCount));

          if (this.tireList.length > shouldRemain) {
            this.destroyOneTire();
          } else if (!this._isShake && this.tireList.length > 0) {
            // 没销毁轮胎：所有轮胎波浪缩放+闪红
            this._isShake = true;

            this._playBottomTireHit();

            (_crd && TweenTool === void 0 ? (_reportPossibleCrUseOfTweenTool({
              error: Error()
            }), TweenTool) : TweenTool).scaleShake(this.hpLabel.node);
            this.flashRed();
          }

          this.hpLabel.string = Math.round(this.curHp).toString();
        }

        flashRed(duration = 0.15, flashColor = null, ground = null) {
          (_crd && FlashRedManager === void 0 ? (_reportPossibleCrUseOfFlashRedManager({
            error: Error()
          }), FlashRedManager) : FlashRedManager).instance.flashRed(this.node, this.meshFlashDataList, duration, flashColor, ground);
        }

        die() {
          var _this$_curArms;

          this._isShake = false;
          (_crd && BulletMonsterCollisionManager === void 0 ? (_reportPossibleCrUseOfBulletMonsterCollisionManager({
            error: Error()
          }), BulletMonsterCollisionManager) : BulletMonsterCollisionManager).instance.unregisterTarget(this); // 轮胎依次破碎消失

          for (let i = 0; i < this.tireList.length; i++) {
            const tire = this.tireList[i];
            Tween.stopAllByTarget(tire);
            tween(tire).delay(i * 0.05).to(0.07, {
              scale: v3(1.4, 1.5, 1.4)
            }, {
              easing: 'sineOut'
            }).to(0.08, {
              scale: Vec3.ZERO
            }, {
              easing: 'sineIn'
            }).call(() => {
              tire.active = false;
              tire.setScale(Vec3.ONE);
              (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
                error: Error()
              }), PoolEnum) : PoolEnum).Other + (_crd && OtherPrefabsEnum === void 0 ? (_reportPossibleCrUseOfOtherPrefabsEnum({
                error: Error()
              }), OtherPrefabsEnum) : OtherPrefabsEnum).tire, tire);
            }).start();
          }

          this.tireList = [];
          this.hpLabel.string = "";
          Tween.stopAllByTarget((_this$_curArms = this._curArms) == null || (_this$_curArms = _this$_curArms.fbx) == null ? void 0 : _this$_curArms.node); // const time = this._curArms.fbx.setAnimation(AnimArms.up_out, false).duration;
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
              this.node.active = false;
            }

            return;
          } // 石板三段式动画：抛起→人跳走→落下砸地


          tween(this.wallNode) // .delay(halfTime)
          .call(() => {
            var _this$_curArms$fbx$no, _this$_curArms2, _this$_curArms3;

            this.isWallH = false; // 锁定到浮动基准中心，消除sin相位差异

            const baseY = ((_this$_curArms$fbx$no = (_this$_curArms2 = this._curArms) == null || (_this$_curArms2 = _this$_curArms2.fbx) == null || (_this$_curArms2 = _this$_curArms2.node) == null ? void 0 : _this$_curArms2.y) != null ? _this$_curArms$fbx$no : 0) + ((_this$_curArms3 = this._curArms) == null ? void 0 : _this$_curArms3.wallHeight);
            this.wallNode.y = baseY; // 运行时捕获位置

            const throwY = this.wallNode.y + 3;
            const groundY = 0.862;
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

                for (let i = 0; i < this.wallEffect.children.length; i++) {
                  var _this$wallEffect$chil;

                  (_this$wallEffect$chil = this.wallEffect.children[i].getComponent(_crd && AttackParkPlay === void 0 ? (_reportPossibleCrUseOfAttackParkPlay({
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
          if (this.tireList.length <= 0) return;
          (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).inst.playOneShot((_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
            error: Error()
          }), SoundEnum) : SoundEnum).Sound_tire_hit, 0.4, 0.08);
          const staggerDelay = 0.05;
          const lastIdx = this.tireList.length - 1;

          for (let i = 0; i < this.tireList.length; i++) {
            const tire = this.tireList[i];
            Tween.stopAllByTarget(tire);
            tire.setScale(Vec3.ONE); // const s1 = PoolManager.instance.V3.set(Vec3.ONE);

            const s2 = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.V3.set(Vec3.ONE).multiplyScalar(1.3);
            const s3 = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.V3.set(Vec3.ONE).multiplyScalar(0.8); // s3.x = 0.8; s3.y = 0.8; s3.z = 0.8;

            const isLast = i >= lastIdx;
            tween(tire).delay(i * staggerDelay).to(0.1, {
              scale: s2
            }, {
              easing: 'cubicOut'
            }).to(0.1, {
              scale: s3
            }, {
              easing: 'cubicOut'
            }).to(0.1, {
              scale: Vec3.ONE
            }, {
              easing: 'backOut'
            }).call(() => {
              // PoolManager.instance.V3 = s1;
              (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.V3 = s2;
              (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.V3 = s3;

              if (isLast) {
                this._isShake = false;
                this._shakeCooldown = 0;
              }
            }).start();
          }
        }
        /** 销毁一个轮胎：被销毁轮胎做果冻缩放→消失，剩余轮胎弹跳→下落 */


        destroyOneTire() {
          var _this$_curArms4, _this$_curArms5;

          const tire = this.tireList.shift();
          if (!tire) return; // 停止残留缩放动画并重置到原始大小

          Tween.stopAllByTarget(tire);
          tire.setScale(Vec3.ONE); // 捕获被销毁轮胎的MeshRenderer（flashRed是延迟应用的，必须在更新mesh引用前捕获）

          const oldMR = this.meshFlashDataList[0].meshRender; // 更新底部轮胎mesh引用

          if (this.tireList.length) this.meshFlashDataList[0].meshRender = this.tireList[0].children[0].children[0].getComponent(MeshRenderer); // 用旧引用闪红被销毁的轮胎（传独立数组，避免延迟应用时被新引用覆盖）

          if (oldMR && oldMR.isValid) {
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

          const s1 = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.V3.set(Vec3.ONE);
          const s2 = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.V3;
          s2.set(Vec3.ONE);
          s2.x = 1.3;
          s2.y = 1.3;
          s2.z = 1.3;
          const s3 = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.V3;
          s3.set(Vec3.ONE);
          s3.x = 0.6;
          s3.y = 0.6;
          s3.z = 0.6;
          const s0 = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.V3.set(Vec3.ZERO);
          tween(tire).to(0.06 * this.animScale, {
            scale: s2
          }, {
            easing: 'cubicOut'
          }).to(0.08 * this.animScale, {
            scale: s3
          }, {
            easing: 'cubicOut'
          }).to(0.08 * this.animScale, {
            scale: s1
          }, {
            easing: 'backOut'
          }).to(0.08 * this.animScale, {
            scale: s0
          }, {
            easing: 'sineIn'
          }).call(() => {
            tire.active = false;
            tire.setScale(Vec3.ONE);
            (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).Other + (_crd && OtherPrefabsEnum === void 0 ? (_reportPossibleCrUseOfOtherPrefabsEnum({
              error: Error()
            }), OtherPrefabsEnum) : OtherPrefabsEnum).tire, tire);
            this._isShake = false;
            (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.V3 = s1;
            (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.V3 = s2;
            (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.V3 = s3;
            (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.V3 = s0;
          }).start(); // 剩余轮胎弹跳下落（上面的轮胎先跳再落）

          this._setupTireBounce(); // FBX弹跳一下


          Tween.stopAllByTarget((_this$_curArms4 = this._curArms) == null || (_this$_curArms4 = _this$_curArms4.fbx) == null ? void 0 : _this$_curArms4.node);
          const fbxNode = (_this$_curArms5 = this._curArms) == null || (_this$_curArms5 = _this$_curArms5.fbx) == null ? void 0 : _this$_curArms5.node;
          if (!fbxNode) return;
          const delay = 0.05 + this.tireList.length * 0.05;
          const fbxY = fbxNode.y;
          const bounceH = this.jumpHeight + this.tireList.length * 0.1 * this.jumpHeight;
          let dropOffset = -this.tireSpacing;

          if (!this._curArms.isCanMove && this.tireList.length > this._curArms.canTireCount) {
            dropOffset = 0;
          }

          tween(fbxNode).delay(delay).to(0.04 * this.animScale, {
            y: fbxY + bounceH
          }, {
            easing: 'sineOut'
          }).to(0.06 * this.animScale, {
            y: fbxY + dropOffset
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
          const len = this.tireList.length;
          this._tireBounceStartY.length = 0;
          this._tireBounceTargetY.length = 0;
          this._tireBounceH.length = 0;

          for (let i = 0; i < len; i++) {
            this._tireBounceStartY.push(this.tireList[i].position.y);

            this._tireBounceTargetY.push(i * this.tireSpacing);

            this._tireBounceH.push(this.jumpHeight + i * 0.1 * this.jumpHeight);
          }

          this._tireBounceTimer = 0;
        }
        /** 每帧：轮胎平滑插值到目标位置，销毁时先弹跳再落下 */


        _updateTireDrop(dt) {
          if (this._tireBounceTimer >= 0) {
            // 弹跳模式：先弹跳再落到新位置
            this._tireBounceTimer += dt;
            const bounceUp = 0.04 * this.animScale;
            const fallDown = 0.1 * this.animScale;
            const perDelay = 0.05;

            for (let i = 0; i < this.tireList.length && i < this._tireBounceStartY.length; i++) {
              const tire = this.tireList[i];
              const localT = this._tireBounceTimer - perDelay * i;
              if (localT <= 0) continue;

              if (localT < bounceUp) {
                const t = localT / bounceUp;
                tire.setPosition(0, this._tireBounceStartY[i] + this._tireBounceH[i] * Math.sin(t * Math.PI * 0.5), 0);
              } else if (localT < bounceUp + fallDown) {
                const t = (localT - bounceUp) / fallDown;
                const peak = this._tireBounceStartY[i] + this._tireBounceH[i];
                tire.setPosition(0, peak + (this._tireBounceTargetY[i] - peak) * (t * t), 0);
              } else {
                tire.setPosition(0, this._tireBounceTargetY[i], 0);
              }
            }

            if (this._tireBounceTimer > perDelay * this.tireList.length + bounceUp + fallDown) {
              this._tireBounceTimer = -1;
            }
          } else {
            // 平滑插值模式
            for (let i = 0; i < this.tireList.length; i++) {
              const tire = this.tireList[i];
              const targetY = i * this.tireSpacing;
              const curY = tire.position.y;
              const diff = targetY - curY;

              if (Math.abs(diff) > 0.001) {
                tire.setPosition(0, curY + diff * Math.min(1, dt * 8), 0);
              } else {
                tire.setPosition(0, targetY, 0);
              }
            }
          }
        }

        init(count = 0) {
          this._level += count;

          if (this._level >= this.armsInfoList.length) {
            this._isStageAlive = false;
            this.node.active = false;
          } else {
            var _this$_curArms6;

            for (let i = 0; i < this.armsInfoList.length; i++) {
              const fbx = this.armsInfoList[i].fbx;

              if (fbx != null && fbx.node) {
                fbx.node.active = i === this._level;
              }
            }

            this._curArms = this.armsInfoList[this._level];

            if (!((_this$_curArms6 = this._curArms) != null && (_this$_curArms6 = _this$_curArms6.fbx) != null && _this$_curArms6.node)) {
              this._isStageAlive = false;
              return;
            }

            this._isStageAlive = true;
            const tireSpacing = this.tireSpacing;
            const wallHeight = this._curArms.wallHeight;
            const tireCount = this._curArms.tireCount;
            this.initHp(this._curArms.hp);
            this.hpLabel.string = Math.round(this.MaxHp).toString(); // 保存hpLabel原始缩放（用number避免GC），动画期间隐藏

            const hpS = this.hpLabel.node.scale;
            const hplSx = hpS.x,
                  hplSy = hpS.y,
                  hplSz = hpS.z;
            this.hpLabel.node.setScale(0, 0, 0); // 保存FBX原始scale（复用PoolManager的V3避免GC）

            const scale = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.V3.set(this._curArms.fbx.node.scale); // 初始位置: FBX在地下

            this._curArms.fbx.node.y = -1;

            this._curArms.fbx.node.setScale(Vec3.ZERO);

            this._curArms.fbx.setAnimation(AnimArms.idle, true);

            this.isWallH = false; // 生成所有轮胎（起始在地底）

            for (let i = 0; i < tireCount; i++) {
              const tire = this.tire;
              this.tireList.push(tire);
              this.node.addChild(tire);
              tire.setPosition(0, -tireSpacing, 0);
              if (!i) this.meshFlashDataList[0].meshRender = tire.children[0].children[0].getComponent(MeshRenderer);
            }

            this._initialTireCount = this.tireList.length; // Phase 1: FBX从地底快速升起

            const phase1Delay = 0.05;
            const phase1RiseTime = 0.05;
            let fbxPhase1TargetY;
            let wallPhase1TargetY;
            let needTireLift;

            if (this._curArms.isCanMove) {
              fbxPhase1TargetY = 0;
              wallPhase1TargetY = wallHeight;
              needTireLift = true;
            } else {
              fbxPhase1TargetY = this._curArms.canHeight;
              wallPhase1TargetY = this._curArms.canHeight + wallHeight;
              needTireLift = false;
            } // FBX快速升起


            tween(this._curArms.fbx.node).delay(phase1Delay).call(() => {
              this._curArms.fbx.setAnimation(AnimArms.up_ju, true);
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


            const tireStartDelay = phase1Delay + phase1RiseTime + 0.02;
            const tireRiseTime = 0.1;
            const tireInterval = 0.08;

            for (let i = 0; i < tireCount; i++) {
              const tire = this.tireList[i];
              const tireY = i * tireSpacing;
              const tireDelay = tireStartDelay + i * tireInterval; // 轮胎升起

              tween(tire).delay(tireDelay).to(tireRiseTime, {
                y: tireY
              }, {
                easing: "backOut"
              }).start();

              if (needTireLift) {
                // FBX被顶起：轮胎先升起一点再顶FBX
                const liftDelay = tireDelay - 0.02;
                const liftTime = 0.08;
                const targetFbxY = (i + 1) * tireSpacing;
                const targetWallY = targetFbxY + wallHeight;
                tween(this._curArms.fbx.node).delay(liftDelay).to(liftTime, {
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


            const totalTime = tireStartDelay + (tireCount - 1) * tireInterval + tireRiseTime + 0.05;
            this.scheduleOnce(() => {
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

        get tire() {
          let tire = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).Other + (_crd && OtherPrefabsEnum === void 0 ? (_reportPossibleCrUseOfOtherPrefabsEnum({
            error: Error()
          }), OtherPrefabsEnum) : OtherPrefabsEnum).tire);

          if (!tire) {
            tire = (_crd && PrefabsManager === void 0 ? (_reportPossibleCrUseOfPrefabsManager({
              error: Error()
            }), PrefabsManager) : PrefabsManager).instance.GetPrefabsIns((_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
              error: Error()
            }), PrefabsEnum) : PrefabsEnum).other, (_crd && OtherPrefabsEnum === void 0 ? (_reportPossibleCrUseOfOtherPrefabsEnum({
              error: Error()
            }), OtherPrefabsEnum) : OtherPrefabsEnum).tire);
          }

          tire.active = true;
          tire.children[0].setScale(this.tireScale);
          tire.setScale(Vec3.ONE); // Set tire scale to one

          return tire;
        }

        selectArms() {}

        start() {
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

        getBlockCollisionHalfZ() {
          var _this$tireScale, _this$tireScale2;

          const tireDepth = ((_this$tireScale = this.tireScale) == null ? void 0 : _this$tireScale.z) || ((_this$tireScale2 = this.tireScale) == null ? void 0 : _this$tireScale2.x) || 1;
          const tireHalfZ = tireDepth * 0.5;
          return Math.max(this.collisionHalfZ, tireHalfZ, 0.9);
        }

        onDestroy() {
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.off((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MONSTER_WAVE_STAGE, this.onMonsterWaveStage);
        }

        _update(deltaTime) {
          var _this$_curArms7;

          const dt = deltaTime; // 石板浮动

          if (this.isWallH && this.wallNode && (_this$_curArms7 = this._curArms) != null && (_this$_curArms7 = _this$_curArms7.fbx) != null && _this$_curArms7.node) {
            this._time += dt * this.speed;
            const curY = this._curArms.fbx.node.y + this._curArms.wallHeight + Math.sin(this._time) * this.h;
            this.wallNode.y = curY;
          } // 轮胎平滑插值到正确位置


          this._updateTireDrop(dt); // _isShake冷却（非销毁受击用）


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
          var _instance$getFrontMon, _instance;

          const worldPos = this.node.worldPosition;
          const frontZ = (_instance$getFrontMon = (_instance = (_crd && MonsterCreate === void 0 ? (_reportPossibleCrUseOfMonsterCreate({
            error: Error()
          }), MonsterCreate) : MonsterCreate).instance) == null ? void 0 : _instance.getFrontMonsterWorldZ(worldPos.z)) != null ? _instance$getFrontMon : worldPos.z;

          this._stageSpawnPos.set(worldPos.x, worldPos.y, frontZ - this.waveFrontGap);

          this.node.setWorldPosition(this._stageSpawnPos);
        }

      }, (_descriptor10 = _applyDecoratedDescriptor(_class5.prototype, "armsInfoList", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class5.prototype, "hpLabel", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class5.prototype, "tireScale", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Vec3();
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class5.prototype, "tireSpacing", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class5.prototype, "jumpHeight", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class5.prototype, "waveFrontGap", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class5.prototype, "nextStageDelay", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class5.prototype, "animScale", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class5.prototype, "wallNode", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor19 = _applyDecoratedDescriptor(_class5.prototype, "jumpWallPos", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Vec3();
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class5.prototype, "wallEffect", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor21 = _applyDecoratedDescriptor(_class5.prototype, "speed", [_dec23], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class5.prototype, "h", [_dec24], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      })), _class5)) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=aa6223cf35796d09344450a14919ad24c61174bb.js.map