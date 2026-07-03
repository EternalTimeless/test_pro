System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Quat, Tween, Vec3, Player, EventManager, EffectEnum, EventType, LayerEnum, SoundEnum, CameraMove, UnityUpComponent, EffectManager, AudioManager, LayerManager, WeaponFlyState, _dec, _dec2, _class, _class2, _descriptor, _class3, _crd, ccclass, property, ArmsUp;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPlayer(extras) {
    _reporterNs.report("Player", "../Player/Player", _context.meta, extras);
  }

  function _reportPossibleCrUseOfArmsInfo(extras) {
    _reporterNs.report("ArmsInfo", "./PropArms", _context.meta, extras);
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
      Quat = _cc.Quat;
      Tween = _cc.Tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      Player = _unresolved_2.Player;
    }, function (_unresolved_3) {
      EventManager = _unresolved_3.default;
    }, function (_unresolved_4) {
      EffectEnum = _unresolved_4.EffectEnum;
      EventType = _unresolved_4.EventType;
      LayerEnum = _unresolved_4.LayerEnum;
      SoundEnum = _unresolved_4.SoundEnum;
    }, function (_unresolved_5) {
      CameraMove = _unresolved_5.CameraMove;
    }, function (_unresolved_6) {
      UnityUpComponent = _unresolved_6.UnityUpComponent;
    }, function (_unresolved_7) {
      EffectManager = _unresolved_7.EffectManager;
    }, function (_unresolved_8) {
      AudioManager = _unresolved_8.default;
    }, function (_unresolved_9) {
      LayerManager = _unresolved_9.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5d8f1HjQ5VPB48TxCy43J2w", "ArmsUp", undefined);

      __checkObsolete__(['_decorator', 'Node', 'Quat', 'Tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ArmsUp", ArmsUp = (_dec = ccclass('ArmsUp'), _dec2 = property(_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
        error: Error()
      }), Player) : Player), _dec(_class = (_class2 = (_class3 = class ArmsUp extends (_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
        error: Error()
      }), UnityUpComponent) : UnityUpComponent) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "player", _descriptor, this);

          this._monsterList = [];
          this.flyingWeaponNodes = new Set();
          this.flyingWeaponStateMap = new Map();
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
          var _weaponFlyInfo$node;

          if (!armsInfo) {
            return;
          }

          var weaponFlyInfo = this.getWeaponFlyNodeInfo(armsInfo);
          var weaponNode = (_weaponFlyInfo$node = weaponFlyInfo == null ? void 0 : weaponFlyInfo.node) != null ? _weaponFlyInfo$node : null;

          if (weaponNode && this.flyingWeaponNodes.has(weaponNode)) {
            return;
          }

          this.player.prepareArmsUpgrade(armsInfo.armsType, armsInfo.weaponBulletConfigIndex);

          if (!weaponNode) {
            this.applyArmsUpgrade(armsInfo);
            return;
          }

          this.flyingWeaponNodes.add(weaponNode);
          var startPos = weaponNode.worldPosition.clone();
          var startRot = weaponNode.worldRotation.clone();
          var startScale = weaponNode.worldScale.clone();
          Tween.stopAllByTarget(weaponNode);
          var flyLayer = this.getWeaponFlyParent(weaponFlyInfo.facePlayer);
          flyLayer.addChild(weaponNode);

          if (weaponFlyInfo.facePlayer) {
            this.setNodeLayerRecursive(weaponNode, flyLayer.layer);
          }

          weaponNode.setWorldPosition(startPos);
          weaponNode.setWorldRotation(startRot);
          weaponNode.setWorldScale(startScale);

          if (weaponFlyInfo.facePlayer) {
            this.faceNodeToPlayer(weaponNode, this.player.node.worldPosition);
          }

          weaponNode.active = true;
          this.startWeaponFly(weaponNode, armsInfo, startPos, weaponFlyInfo.facePlayer);
        }

        getWeaponFlyNodeInfo(armsInfo) {
          var _armsInfo$runtimeVisu, _armsInfo$fbx;

          if (!armsInfo) {
            return null;
          }

          if ((_armsInfo$runtimeVisu = armsInfo.runtimeVisualRoot) != null && _armsInfo$runtimeVisu.isValid) {
            var weaponNode = this.findNodeByName(armsInfo.runtimeVisualRoot, ArmsUp.WEAPON_PICKUP_VISUAL_NAME);
            return weaponNode != null && weaponNode.isValid ? {
              node: weaponNode,
              facePlayer: false
            } : null;
          }

          var fbxNode = (_armsInfo$fbx = armsInfo.fbx) == null ? void 0 : _armsInfo$fbx.node;
          return fbxNode != null && fbxNode.isValid ? {
            node: fbxNode,
            facePlayer: true
          } : null;
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

        setNodeLayerRecursive(node, layer) {
          if (!node) {
            return;
          }

          node.layer = layer;

          for (var i = 0; i < node.children.length; i++) {
            this.setNodeLayerRecursive(node.children[i], layer);
          }
        }

        getWeaponFlyParent(facePlayer) {
          var _instance$getLayer;

          if (facePlayer) {
            return (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
              error: Error()
            }), LayerManager) : LayerManager).instance.getLayer((_crd && LayerEnum === void 0 ? (_reportPossibleCrUseOfLayerEnum({
              error: Error()
            }), LayerEnum) : LayerEnum).Layer_1_Ground);
          }

          return (_instance$getLayer = (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
            error: Error()
          }), LayerManager) : LayerManager).instance.getLayer((_crd && LayerEnum === void 0 ? (_reportPossibleCrUseOfLayerEnum({
            error: Error()
          }), LayerEnum) : LayerEnum).PropBrandLayer)) != null ? _instance$getLayer : (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
            error: Error()
          }), LayerManager) : LayerManager).instance.getLayer((_crd && LayerEnum === void 0 ? (_reportPossibleCrUseOfLayerEnum({
            error: Error()
          }), LayerEnum) : LayerEnum).Layer_1_Ground);
        }

        startWeaponFly(node, armsInfo, startPos, facePlayer) {
          this.flyingWeaponStateMap.set(node, new WeaponFlyState(node, armsInfo, startPos, facePlayer));
        }

        completeWeaponFly(node, armsInfo) {
          if (!this.finishWeaponFly(node)) {
            return;
          }

          var pos = this.player.node.worldPosition;
          (_crd && CameraMove === void 0 ? (_reportPossibleCrUseOfCameraMove({
            error: Error()
          }), CameraMove) : CameraMove).instance.Shake2(0.5);
          (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).inst.playOneShot((_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
            error: Error()
          }), SoundEnum) : SoundEnum).Sound_Ship_UpLevel);
          this.applyArmsUpgrade(armsInfo);
          (_crd && EffectManager === void 0 ? (_reportPossibleCrUseOfEffectManager({
            error: Error()
          }), EffectManager) : EffectManager).instance.addShowEffect(pos, (_crd && EffectEnum === void 0 ? (_reportPossibleCrUseOfEffectEnum({
            error: Error()
          }), EffectEnum) : EffectEnum).up, 3);
          (_crd && CameraMove === void 0 ? (_reportPossibleCrUseOfCameraMove({
            error: Error()
          }), CameraMove) : CameraMove).instance.Shake1(1.5);
        }

        applyArmsUpgrade(armsInfo) {
          if (!armsInfo) {
            return;
          }

          this.player.upArms(armsInfo.armsType, armsInfo.weaponBulletConfigIndex);
        }

        finishWeaponFly(node) {
          if (!node) {
            return false;
          }

          var isFlying = this.flyingWeaponNodes.has(node);
          this.flyingWeaponNodes.delete(node);
          this.flyingWeaponStateMap.delete(node);

          if (!isFlying || !node.isValid) {
            return false;
          }

          Tween.stopAllByTarget(node);
          node.active = false;
          return true;
        }

        updateFlyingWeapons(dt) {
          if (this.flyingWeaponStateMap.size === 0) {
            return;
          }

          var completeList = [];
          this.flyingWeaponStateMap.forEach(state => {
            var _state$node, _this$player;

            if (!((_state$node = state.node) != null && _state$node.isValid) || !((_this$player = this.player) != null && (_this$player = _this$player.node) != null && _this$player.isValid)) {
              this.finishWeaponFly(state.node);
              return;
            }

            state.elapsed += dt;
            var rawT = Math.min(1, state.elapsed / ArmsUp.WEAPON_FLY_DURATION);
            var t = rawT * rawT * (3 - 2 * rawT);
            var playerPos = this.player.node.worldPosition;
            Vec3.lerp(ArmsUp.tempFlightPos, state.startPos, playerPos, t);
            ArmsUp.tempFlightPos.y += ArmsUp.WEAPON_FLY_ARC_HEIGHT * 4 * rawT * (1 - rawT);
            state.node.setWorldPosition(ArmsUp.tempFlightPos);

            if (state.facePlayer) {
              this.faceNodeToPlayer(state.node, playerPos);
            }

            if (rawT >= 1) {
              completeList.push(state);
            }
          });

          for (var i = 0; i < completeList.length; i++) {
            this.completeWeaponFly(completeList[i].node, completeList[i].armsInfo);
          }
        }

        faceNodeToPlayer(node, playerPos) {
          if (!node) {
            return;
          }

          Vec3.subtract(ArmsUp.tempForward, playerPos, node.worldPosition);
          ArmsUp.tempForward.y = 0;

          if (ArmsUp.tempForward.lengthSqr() <= 0.0001) {
            return;
          }

          ArmsUp.tempForward.normalize();
          Quat.fromViewUp(ArmsUp.tempQuat, ArmsUp.tempForward, Vec3.UP);
          node.setWorldRotation(ArmsUp.tempQuat);
        }

        addMonster(monster) {
          var index = this._monsterList.indexOf(monster);

          if (index === -1) {
            this._monsterList.push(monster);
          }
        }

        _update(dt) {
          this.updateFlyingWeapons(dt); // this.checkPlayerAndMonsterCollide();
        }

        checkPlayerAndMonsterCollide() {
          var roleList = this.player.roleList;
          var isUpPos = false;

          for (var i = this._monsterList.length - 1; i >= 0; i--) {
            var pos = this._monsterList[i].node.worldPosition;

            for (var j = roleList.length - 1; j >= 0; j--) {
              var rolePos = roleList[j].node.worldPosition;
              var distance = Vec3.squaredDistance(pos, rolePos);

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
            this.player.requestShrinkAfterRoleLoss();
          }
        }

        TimeFlowsBackWard() {
          this._monsterList.length = 0;
        }

      }, _class3.WEAPON_FLY_DURATION = 0.7, _class3.WEAPON_FLY_ARC_HEIGHT = 4, _class3.WEAPON_PICKUP_VISUAL_NAME = 'weapon', _class3.tempForward = new Vec3(), _class3.tempQuat = new Quat(), _class3.tempFlightPos = new Vec3(), _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "player", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      })), _class2)) || _class));

      WeaponFlyState = class WeaponFlyState {
        constructor(node, armsInfo, startPos, facePlayer) {
          this.elapsed = 0;
          this.startPos = new Vec3();
          this.node = node;
          this.armsInfo = armsInfo;
          this.facePlayer = facePlayer;
          this.startPos.set(startPos);
        }

      };

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7d88e9fa4d49091167d5648112015c50cab8c311.js.map