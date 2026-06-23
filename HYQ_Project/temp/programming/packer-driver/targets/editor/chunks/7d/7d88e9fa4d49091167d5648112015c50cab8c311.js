System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Tween, Vec3, Player, PropArms, EventManager, EffectEnum, EventType, LayerEnum, SoundEnum, JumpManager, CameraMove, UnityUpComponent, EffectManager, AudioManager, LayerManager, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, ArmsUp;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPlayer(extras) {
    _reporterNs.report("Player", "../Player/Player", _context.meta, extras);
  }

  function _reportPossibleCrUseOfArmsInfo(extras) {
    _reporterNs.report("ArmsInfo", "./PropArms", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPropArms(extras) {
    _reporterNs.report("PropArms", "./PropArms", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../../Base/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEffectEnum(extras) {
    _reporterNs.report("EffectEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLayerEnum(extras) {
    _reporterNs.report("LayerEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundEnum(extras) {
    _reporterNs.report("SoundEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfJumpManager(extras) {
    _reporterNs.report("JumpManager", "../Jump/JumpManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCameraMove(extras) {
    _reporterNs.report("CameraMove", "../../Base/CameraMove", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMonsterBattleTaerget(extras) {
    _reporterNs.report("MonsterBattleTaerget", "../Monster/MonsterBattleTaerget", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnityUpComponent(extras) {
    _reporterNs.report("UnityUpComponent", "../../Base/UnityUpComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEffectManager(extras) {
    _reporterNs.report("EffectManager", "../Effect/EffectManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "../../Base/AudioManager", _context.meta, extras);
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
      Tween = _cc.Tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      Player = _unresolved_2.Player;
    }, function (_unresolved_3) {
      PropArms = _unresolved_3.PropArms;
    }, function (_unresolved_4) {
      EventManager = _unresolved_4.default;
    }, function (_unresolved_5) {
      EffectEnum = _unresolved_5.EffectEnum;
      EventType = _unresolved_5.EventType;
      LayerEnum = _unresolved_5.LayerEnum;
      SoundEnum = _unresolved_5.SoundEnum;
    }, function (_unresolved_6) {
      JumpManager = _unresolved_6.JumpManager;
    }, function (_unresolved_7) {
      CameraMove = _unresolved_7.CameraMove;
    }, function (_unresolved_8) {
      UnityUpComponent = _unresolved_8.UnityUpComponent;
    }, function (_unresolved_9) {
      EffectManager = _unresolved_9.EffectManager;
    }, function (_unresolved_10) {
      AudioManager = _unresolved_10.default;
    }, function (_unresolved_11) {
      LayerManager = _unresolved_11.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5d8f1HjQ5VPB48TxCy43J2w", "ArmsUp", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Tween', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ArmsUp", ArmsUp = (_dec = ccclass('ArmsUp'), _dec2 = property(_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
        error: Error()
      }), Player) : Player), _dec(_class = (_class2 = class ArmsUp extends (_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
        error: Error()
      }), UnityUpComponent) : UnityUpComponent) {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "player", _descriptor, this);

          this._monsterList = [];
        }

        start() {
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).PROP_ARMS_DIE, this.armsUPEvent, this); // EventManager.instance.on(EventType.Monster_Attack_Player_ADD, this.addMonster, this);

          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).PLAYER_RESURRECTION, this.TimeFlowsBackWard, this);
        }

        armsUPEvent(armsInfo) {
          var _armsInfo$fbx;

          const pos = this.player.node.worldPosition;
          const fbxNode = (_armsInfo$fbx = armsInfo.fbx) == null ? void 0 : _armsInfo$fbx.node;

          if (!fbxNode) {
            return;
          }

          (_crd && PropArms === void 0 ? (_reportPossibleCrUseOfPropArms({
            error: Error()
          }), PropArms) : PropArms).prepareSpriteWeaponVisual(fbxNode);
          this.player.prepareArmsUpgrade(armsInfo.armsType);
          const startPos = fbxNode.worldPosition.clone();
          this.scheduleOnce(() => {
            Tween.stopAllByTarget(fbxNode);
            (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
              error: Error()
            }), LayerManager) : LayerManager).instance.getLayer((_crd && LayerEnum === void 0 ? (_reportPossibleCrUseOfLayerEnum({
              error: Error()
            }), LayerEnum) : LayerEnum).Layer_1_Ground).addChild(fbxNode);
            fbxNode.setWorldPosition(startPos);
            fbxNode.active = true;
            (_crd && JumpManager === void 0 ? (_reportPossibleCrUseOfJumpManager({
              error: Error()
            }), JumpManager) : JumpManager).instance.jumpCurve(fbxNode, pos, 0.7, 2).onComplete(() => {
              (_crd && CameraMove === void 0 ? (_reportPossibleCrUseOfCameraMove({
                error: Error()
              }), CameraMove) : CameraMove).instance.Shake2(0.5);
              fbxNode.active = false;
              (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
                error: Error()
              }), AudioManager) : AudioManager).inst.playOneShot((_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
                error: Error()
              }), SoundEnum) : SoundEnum).Sound_Ship_UpLevel);
              this.player.upArms(armsInfo.armsType);
              (_crd && EffectManager === void 0 ? (_reportPossibleCrUseOfEffectManager({
                error: Error()
              }), EffectManager) : EffectManager).instance.addShowEffect(pos, (_crd && EffectEnum === void 0 ? (_reportPossibleCrUseOfEffectEnum({
                error: Error()
              }), EffectEnum) : EffectEnum).up, 3);
              (_crd && CameraMove === void 0 ? (_reportPossibleCrUseOfCameraMove({
                error: Error()
              }), CameraMove) : CameraMove).instance.Shake1(1.5);
            });
          }, 0);
        }

        addMonster(monster) {
          const index = this._monsterList.indexOf(monster);

          if (index === -1) {
            this._monsterList.push(monster);
          }
        }

        _update(dt) {// this.checkPlayerAndMonsterCollide();
        }

        checkPlayerAndMonsterCollide() {
          const roleList = this.player.roleList;
          let isUpPos = false;

          for (let i = this._monsterList.length - 1; i >= 0; i--) {
            const pos = this._monsterList[i].node.worldPosition;

            for (let j = roleList.length - 1; j >= 0; j--) {
              const rolePos = roleList[j].node.worldPosition;
              const distance = Vec3.squaredDistance(pos, rolePos);

              if (distance < 4) {
                this._monsterList[i].Hit(100);

                this._monsterList.splice(i, 1);

                this.player.roleDie(roleList[j]);
                roleList.splice(j, 1);
                isUpPos = true; // roleList[j].node.active = false;

                break;
              }
            }
          }

          if (isUpPos) {
            this.player.upPos();
          }
        }

        TimeFlowsBackWard() {
          this._monsterList.length = 0;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "player", [_dec2], {
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
//# sourceMappingURL=7d88e9fa4d49091167d5648112015c50cab8c311.js.map