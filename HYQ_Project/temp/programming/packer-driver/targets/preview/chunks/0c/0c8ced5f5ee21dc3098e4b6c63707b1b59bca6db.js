System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12", "__unresolved_13", "__unresolved_14", "__unresolved_15"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCBoolean, CCFloat, CCInteger, MeshRenderer, Node, tween, Tween, Vec3, PoolManager, PropBrand, EffectEnum, EventType, LayerEnum, OtherPrefabsEnum, PoolEnum, PrefabsEnum, SoundEnum, PrefabsManager, Player, Role, LayerManager, JumpManager, PropArms, UnityUpComponent, EffectManager, AudioManager, FlashRedManager, PropTireGate, ColliderTag, COLLIDE_TYPE, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _crd, ccclass, property, CreatePropBrand;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPoolManager(extras) {
    _reporterNs.report("PoolManager", "../../Base/PoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPropBrand(extras) {
    _reporterNs.report("PropBrand", "./PropBrand", _context.meta, extras);
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

  function _reportPossibleCrUseOfPlayer(extras) {
    _reporterNs.report("Player", "../Player/Player", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRole(extras) {
    _reporterNs.report("Role", "../Player/Role", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLayerManager(extras) {
    _reporterNs.report("LayerManager", "../../Base/LayerManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfJumpManager(extras) {
    _reporterNs.report("JumpManager", "../Jump/JumpManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfArmsInfo(extras) {
    _reporterNs.report("ArmsInfo", "./PropArms", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPropArms(extras) {
    _reporterNs.report("PropArms", "./PropArms", _context.meta, extras);
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

  function _reportPossibleCrUseOfFlashRedManager(extras) {
    _reporterNs.report("FlashRedManager", "../Battle/Base/FlashRedManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPropTireGate(extras) {
    _reporterNs.report("PropTireGate", "./PropTireGate", _context.meta, extras);
  }

  function _reportPossibleCrUseOfColliderTag(extras) {
    _reporterNs.report("ColliderTag", "../Battle/CollectBattleTarger/ColliderTag", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCOLLIDE_TYPE(extras) {
    _reporterNs.report("COLLIDE_TYPE", "../Battle/CollectBattleTarger/ColliderTag", _context.meta, extras);
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
      MeshRenderer = _cc.MeshRenderer;
      Node = _cc.Node;
      tween = _cc.tween;
      Tween = _cc.Tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      PoolManager = _unresolved_2.default;
    }, function (_unresolved_3) {
      PropBrand = _unresolved_3.PropBrand;
    }, function (_unresolved_4) {
      EffectEnum = _unresolved_4.EffectEnum;
      EventType = _unresolved_4.EventType;
      LayerEnum = _unresolved_4.LayerEnum;
      OtherPrefabsEnum = _unresolved_4.OtherPrefabsEnum;
      PoolEnum = _unresolved_4.PoolEnum;
      PrefabsEnum = _unresolved_4.PrefabsEnum;
      SoundEnum = _unresolved_4.SoundEnum;
    }, function (_unresolved_5) {
      PrefabsManager = _unresolved_5.PrefabsManager;
    }, function (_unresolved_6) {
      Player = _unresolved_6.Player;
    }, function (_unresolved_7) {
      Role = _unresolved_7.Role;
    }, function (_unresolved_8) {
      LayerManager = _unresolved_8.default;
    }, function (_unresolved_9) {
      JumpManager = _unresolved_9.JumpManager;
    }, function (_unresolved_10) {
      PropArms = _unresolved_10.PropArms;
    }, function (_unresolved_11) {
      UnityUpComponent = _unresolved_11.UnityUpComponent;
    }, function (_unresolved_12) {
      EffectManager = _unresolved_12.EffectManager;
    }, function (_unresolved_13) {
      AudioManager = _unresolved_13.default;
    }, function (_unresolved_14) {
      FlashRedManager = _unresolved_14.FlashRedManager;
    }, function (_unresolved_15) {
      PropTireGate = _unresolved_15.PropTireGate;
    }, function (_unresolved_16) {
      ColliderTag = _unresolved_16.default;
      COLLIDE_TYPE = _unresolved_16.COLLIDE_TYPE;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7ab0exJe1JDaaNCop2wV4XG", "CreatePropBrand", undefined);

      __checkObsolete__(['_decorator', 'CCBoolean', 'CCFloat', 'CCInteger', 'Component', 'ITriggerEvent', 'MeshRenderer', 'Node', 'PlaceMethod', 'tween', 'Tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CreatePropBrand", CreatePropBrand = (_dec = ccclass('CreatePropBrand'), _dec2 = property(CCInteger), _dec3 = property(CCFloat), _dec4 = property(CCFloat), _dec5 = property(CCInteger), _dec6 = property(CCFloat), _dec7 = property(_crd && PropArms === void 0 ? (_reportPossibleCrUseOfPropArms({
        error: Error()
      }), PropArms) : PropArms), _dec8 = property(Node), _dec9 = property(CCBoolean), _dec10 = property(CCInteger), _dec11 = property(CCFloat), _dec12 = property(CCFloat), _dec13 = property(Vec3), _dec14 = property(CCFloat), _dec15 = property(CCInteger), _dec(_class = (_class2 = class CreatePropBrand extends (_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
        error: Error()
      }), UnityUpComponent) : UnityUpComponent) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "showCount", _descriptor, this);

          _initializerDefineProperty(this, "distance", _descriptor2, this);

          _initializerDefineProperty(this, "height", _descriptor3, this);

          _initializerDefineProperty(this, "count", _descriptor4, this);

          _initializerDefineProperty(this, "moveSpeed", _descriptor5, this);

          _initializerDefineProperty(this, "pa", _descriptor6, this);

          _initializerDefineProperty(this, "wallNode", _descriptor7, this);

          _initializerDefineProperty(this, "tireGateEnabled", _descriptor8, this);

          _initializerDefineProperty(this, "tireGateCount", _descriptor9, this);

          _initializerDefineProperty(this, "tireGateSpacing", _descriptor10, this);

          _initializerDefineProperty(this, "tireGateHp", _descriptor11, this);

          _initializerDefineProperty(this, "tireGateScale", _descriptor12, this);

          _initializerDefineProperty(this, "propBackOffset", _descriptor13, this);

          this.propBrandList = [];
          this.tempPropBrandList = [];
          this.isMove = false;
          this.gateTireRemain = 0;
          this.pendingMoveCount = 0;

          _initializerDefineProperty(this, "type", _descriptor14, this);

          this.tempV3 = new Vec3();
        }

        get isTireGateActive() {
          return this.tireGateEnabled || this.type === 0 && this.count === 1;
        }

        get activePropBackOffset() {
          if (!this.isTireGateActive) {
            return 0;
          }

          return Math.max(this.propBackOffset, this.tireGateCount * this.tireGateSpacing + this.distance);
        }

        start() {
          var _this$pa;

          var startZ = this.activePropBackOffset;

          for (var i = 0; i < this.showCount; i++) {
            var p = this.propBrand;
            this.propBrandList.push(p);
            this.wallNode.addChild(p.node);
            p.node.x = 0;
            p.node.y = this.height;
            p.node.z = startZ + i * this.distance;
          } // this.scheduleOnce(() => {
          //     this.move(15);
          // }, 1);


          this.createTireGate();
          (_this$pa = this.pa) == null || _this$pa.node.on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).PROP_ARMS_DIE, this.armsUPEvent, this);
        }

        armsUPEvent(armsInfo) {
          this.requestMove(armsInfo.moveCount);
        }

        _update(deltaTime) {
          if (this.isMove) {
            for (var i = 0; i < this.propBrandList.length; i++) {
              var p = this.propBrandList[i];

              if (!i && p.node.z <= 0) {
                if (this.isTireGateActive) {
                  this.pushFrontPropToPickup();
                  i--;
                  continue;
                }

                this.scheduleOnce(() => {
                  var _this$pa2;

                  (_this$pa2 = this.pa) == null || _this$pa2.init(1);
                }, 0.5);
                this.isMove = false;
                break;
              }

              p.node.z -= this.moveSpeed * deltaTime;

              if (p.node.z <= -0.614 && p.node.y > -0.753) {
                p.node.y -= this.moveSpeed * deltaTime * 0.5;

                if (p.node.y <= -0.753) {
                  p.node.y = -0.753;
                }
              }
            }
          }

          for (var _i = this.tempPropBrandList.length - 1; _i >= 0; _i--) {
            var _p = this.tempPropBrandList[_i];
            _p.node.z -= this.moveSpeed * deltaTime;

            if (_p.node.z <= -0.614) {
              _p.node.y -= this.moveSpeed * deltaTime * 0.35;

              if (_p.node.y <= -0.753) {
                _p.node.y = -0.753;
              }
            }

            if (_p.node.z <= -30) {
              this.tempPropBrandList.splice(_i, 1);
              _p.node.active = false;
              (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
                error: Error()
              }), PoolEnum) : PoolEnum).Prop + 0, _p);
            }
          }
        }

        pushFrontPropToPickup() {
          var p = this.propBrandList.shift();

          if (!p) {
            return;
          }

          this.tempPropBrandList.push(p);
          p.collide.on("onTriggerEnter", this.onTriggerEnter, this);
          this.appendPropBrandAtBack();
        }

        appendPropBrands(count) {
          var c = this.propBrandList.length;
          var appendStartZ = this.activePropBackOffset;

          for (var i = 0; i < count; i++) {
            var p = this.propBrand;
            this.wallNode.addChild(p.node);
            p.node.x = 0;
            p.node.y = this.height;
            p.node.z = appendStartZ + (i + c) * this.distance;
            this.propBrandList.push(p);
          }
        }

        appendPropBrandAtBack() {
          var p = this.propBrand;
          this.wallNode.addChild(p.node);
          p.node.x = 0;
          p.node.y = this.height;
          var last = this.propBrandList[this.propBrandList.length - 1];
          var appendStartZ = this.activePropBackOffset;
          p.node.z = last ? last.node.z + this.distance : appendStartZ;
          this.propBrandList.push(p);
        }

        requestMove(count) {
          if (this.gateTireRemain > 0) {
            this.pendingMoveCount += count;
            return;
          }

          this.move(count);
        }

        createTireGate() {
          if (!this.isTireGateActive || !this.wallNode || this.tireGateCount <= 0) {
            return;
          }

          this.gateTireRemain = this.tireGateCount;

          for (var i = 0; i < this.tireGateCount; i++) {
            var _tire$children$;

            var tire = this.tireGate;
            this.wallNode.addChild(tire);
            tire.setPosition(0, this.height, i * this.tireGateSpacing);
            tire.setScale(Vec3.ONE);
            var gate = tire.getComponent(_crd && PropTireGate === void 0 ? (_reportPossibleCrUseOfPropTireGate({
              error: Error()
            }), PropTireGate) : PropTireGate);
            var mesh = (_tire$children$ = tire.children[0]) == null || (_tire$children$ = _tire$children$.children[0]) == null ? void 0 : _tire$children$.getComponent(MeshRenderer);

            if (mesh && gate.meshFlashDataList.length > 0) {
              gate.meshFlashDataList[0].meshRender = mesh;
            }

            gate.initGate(() => this.onGateTireDie(), this.tireGateHp);
          }
        }

        onGateTireDie() {
          this.gateTireRemain--;

          if (this.gateTireRemain > 0) {
            return;
          }

          var count = this.pendingMoveCount || this.tireGateCount;
          this.pendingMoveCount = 0;
          this.move(count);
        }

        get tireGate() {
          var _tire$children$2;

          var tire = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
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
          (_tire$children$2 = tire.children[0]) == null || _tire$children$2.setScale(this.tireGateScale);
          var tag = tire.getComponent(_crd && ColliderTag === void 0 ? (_reportPossibleCrUseOfColliderTag({
            error: Error()
          }), ColliderTag) : ColliderTag);

          if (!tag) {
            tag = tire.addComponent(_crd && ColliderTag === void 0 ? (_reportPossibleCrUseOfColliderTag({
              error: Error()
            }), ColliderTag) : ColliderTag);
          }

          tag.tag = (_crd && COLLIDE_TYPE === void 0 ? (_reportPossibleCrUseOfCOLLIDE_TYPE({
            error: Error()
          }), COLLIDE_TYPE) : COLLIDE_TYPE).MONSTER;
          var gate = tire.getComponent(_crd && PropTireGate === void 0 ? (_reportPossibleCrUseOfPropTireGate({
            error: Error()
          }), PropTireGate) : PropTireGate);

          if (!gate) {
            gate = tire.addComponent(_crd && PropTireGate === void 0 ? (_reportPossibleCrUseOfPropTireGate({
              error: Error()
            }), PropTireGate) : PropTireGate);
          }

          gate.collisionHalfX = 2;
          gate.collisionHalfZ = 1.2;
          gate.repelEnabled = false;
          return tire;
        }

        move(count) {
          this.isMove = true;

          if (this.isTireGateActive) {
            return;
          }

          this.appendPropBrands(count);

          for (var i = 0; i < count; i++) {
            var p = this.propBrandList[0];
            this.tempPropBrandList.push(p);
            p.collide.on("onTriggerEnter", this.onTriggerEnter, this);
            this.propBrandList.splice(0, 1);
          }
        }

        get propBrand() {
          var p = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).Prop + this.type);

          if (!p) {
            var node = (_crd && PrefabsManager === void 0 ? (_reportPossibleCrUseOfPrefabsManager({
              error: Error()
            }), PrefabsManager) : PrefabsManager).instance.GetPrefabsIns((_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
              error: Error()
            }), PrefabsEnum) : PrefabsEnum).prop, this.type);
            p = node.getComponent(_crd && PropBrand === void 0 ? (_reportPossibleCrUseOfPropBrand({
              error: Error()
            }), PropBrand) : PropBrand);
          }

          p.node.active = true;
          p.init(this.count);
          return p;
        }

        onTriggerEnter(event) {
          var player = event.otherCollider.getComponent(_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player);

          if (player) {
            var role = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).role + player.roleType);

            if (!role) {
              var node = (_crd && PrefabsManager === void 0 ? (_reportPossibleCrUseOfPrefabsManager({
                error: Error()
              }), PrefabsManager) : PrefabsManager).instance.GetPrefabsIns((_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
                error: Error()
              }), PrefabsEnum) : PrefabsEnum).hero, player.roleType);
              role = node.getComponent(_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
                error: Error()
              }), Role) : Role);
            }

            var layer = (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
              error: Error()
            }), LayerManager) : LayerManager).instance.getLayer((_crd && LayerEnum === void 0 ? (_reportPossibleCrUseOfLayerEnum({
              error: Error()
            }), LayerEnum) : LayerEnum).Layer_1_Ground);
            layer.addChild(role.node);
            var selfPos = event.selfCollider.node.worldPosition;
            role.node.setWorldPosition(selfPos);
            role.hp = 2;
            role.node.active = true;
            player.addRole(role);
            var pos = player.getNextPos();
            var index = player.length - 1;
            this.tempV3.set(selfPos);
            this.tempV3.y += 1;
            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).inst.playOneShot((_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
              error: Error()
            }), SoundEnum) : SoundEnum).Sound_PlaceGold);
            (_crd && EffectManager === void 0 ? (_reportPossibleCrUseOfEffectManager({
              error: Error()
            }), EffectManager) : EffectManager).instance.addShowEffect(this.tempV3, (_crd && EffectEnum === void 0 ? (_reportPossibleCrUseOfEffectEnum({
              error: Error()
            }), EffectEnum) : EffectEnum).door, 2);
            var cPos = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.V3.set(Vec3.ZERO);
            cPos.z = (selfPos.z + pos.z) * 0.5;
            var f = selfPos.x - pos.x;
            f = f / Math.abs(f);
            cPos.x = (selfPos.x + pos.x) * 0.5 - f * 3; // cPos.set()

            (_crd && EffectManager === void 0 ? (_reportPossibleCrUseOfEffectManager({
              error: Error()
            }), EffectManager) : EffectManager).instance.addShowEffect_3(role.node, (_crd && EffectEnum === void 0 ? (_reportPossibleCrUseOfEffectEnum({
              error: Error()
            }), EffectEnum) : EffectEnum).up, 1);
            var roleFBXNode = role.fbxManager.node;
            var scaleR = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.V3.set(roleFBXNode.scale); // roleFBXNode.setPosition(Vec3.ZERO);

            (_crd && FlashRedManager === void 0 ? (_reportPossibleCrUseOfFlashRedManager({
              error: Error()
            }), FlashRedManager) : FlashRedManager).instance.flashRed(role.node, role.meshCreateDataList, 0.5);
            var scale2 = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.V3.set(scaleR).multiplyScalar(1.5);
            tween(roleFBXNode).to(0.4, {
              scale: scale2
            }).to(0.2, {
              scale: scaleR
            }, {
              easing: "backOut"
            }).call(() => {
              console.log("curScale:" + roleFBXNode.scale, "scaleR:" + scaleR, "scale2:" + scale2);
              (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.V3 = scaleR;
              (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.V3 = scale2;
            }).start();
            role.attackIN = true;
            (_crd && JumpManager === void 0 ? (_reportPossibleCrUseOfJumpManager({
              error: Error()
            }), JumpManager) : JumpManager).instance.jumpBezierByPoints(role.node, 3, cPos, pos).onComplete(() => {
              (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
                error: Error()
              }), AudioManager) : AudioManager).inst.playOneShot((_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
                error: Error()
              }), SoundEnum) : SoundEnum).Sound_Ship_UpLevel);
              role.attackIN = false;
              (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.V3 = pos;
              (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.V3 = cPos; // const selfPos = role.node.position;

              var selfPos2 = player.getNextPos(index);
              player.node.addChild(role.node);
              role.node.setWorldPosition(selfPos2);
              player.upMoveBoundary();

              if (role.arms) {
                role.arms.active = true;
              } // EffectManager.instance.addShowEffect(selfPos, EffectEnum.up, 2)


              (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.V3 = selfPos2; // role.node.setPosition(selfPos);
            }).setEndPosPre(prop => {
              var curPos = player.getNextPos(index);
              curPos.subtract(pos);
              curPos.add(prop.worldPosition);
              prop.setWorldPosition(curPos);
              (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.V3 = curPos;
            }, null);
            var propBrand = event.selfCollider.getComponent(_crd && PropBrand === void 0 ? (_reportPossibleCrUseOfPropBrand({
              error: Error()
            }), PropBrand) : PropBrand);
            this.tempPropBrandList.splice(this.tempPropBrandList.indexOf(propBrand), 1);
            this.scheduleOnce(() => {
              Tween.stopAllByTarget(this.node);
              propBrand.node.active = false;
              (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
                error: Error()
              }), PoolEnum) : PoolEnum).Prop + this.type, propBrand);
              propBrand.collide.off("onTriggerEnter", this.onTriggerEnter, this);
            }, 0);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "showCount", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 15;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "distance", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.5;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "height", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.665;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "count", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "pa", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "wallNode", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "tireGateEnabled", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "tireGateCount", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "tireGateSpacing", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 4.2;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "tireGateHp", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "tireGateScale", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Vec3(1.44, 1.44, 1.44);
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "propBackOffset", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5.4;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "type", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0c8ced5f5ee21dc3098e4b6c63707b1b59bca6db.js.map