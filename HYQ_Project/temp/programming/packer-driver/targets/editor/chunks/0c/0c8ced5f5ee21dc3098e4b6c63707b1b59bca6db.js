System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12", "__unresolved_13"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, CCInteger, Node, tween, Tween, Vec3, PoolManager, PropBrand, EffectEnum, EventType, LayerEnum, PoolEnum, PrefabsEnum, SoundEnum, PrefabsManager, Player, Role, LayerManager, JumpManager, PropArms, UnityUpComponent, EffectManager, AudioManager, FlashRedManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, CreatePropBrand;

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

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CCFloat = _cc.CCFloat;
      CCInteger = _cc.CCInteger;
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
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7ab0exJe1JDaaNCop2wV4XG", "CreatePropBrand", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'CCInteger', 'Component', 'ITriggerEvent', 'Node', 'PlaceMethod', 'tween', 'Tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CreatePropBrand", CreatePropBrand = (_dec = ccclass('CreatePropBrand'), _dec2 = property(CCInteger), _dec3 = property(CCFloat), _dec4 = property(CCFloat), _dec5 = property(CCInteger), _dec6 = property(CCFloat), _dec7 = property(_crd && PropArms === void 0 ? (_reportPossibleCrUseOfPropArms({
        error: Error()
      }), PropArms) : PropArms), _dec8 = property(Node), _dec9 = property(CCInteger), _dec(_class = (_class2 = class CreatePropBrand extends (_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
        error: Error()
      }), UnityUpComponent) : UnityUpComponent) {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "showCount", _descriptor, this);

          _initializerDefineProperty(this, "distance", _descriptor2, this);

          _initializerDefineProperty(this, "height", _descriptor3, this);

          _initializerDefineProperty(this, "count", _descriptor4, this);

          _initializerDefineProperty(this, "moveSpeed", _descriptor5, this);

          _initializerDefineProperty(this, "pa", _descriptor6, this);

          _initializerDefineProperty(this, "wallNode", _descriptor7, this);

          this.propBrandList = [];
          this.tempPropBrandList = [];
          this.isMove = false;

          _initializerDefineProperty(this, "type", _descriptor8, this);

          this.tempV3 = new Vec3();
        }

        start() {
          for (let i = 0; i < this.showCount; i++) {
            const p = this.propBrand;
            this.propBrandList.push(p);
            this.wallNode.addChild(p.node);
            p.node.x = 0;
            p.node.y = this.height;
            p.node.z = i * this.distance;
          } // this.scheduleOnce(() => {
          //     this.move(15);
          // }, 1);


          this.pa.node.on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).PROP_ARMS_DIE, this.armsUPEvent, this);
        }

        armsUPEvent(armsInfo) {
          this.move(armsInfo.moveCount);
        }

        _update(deltaTime) {
          if (this.isMove) {
            for (let i = 0; i < this.propBrandList.length; i++) {
              const p = this.propBrandList[i];

              if (!i) {
                if (p.node.z <= 0) {
                  this.scheduleOnce(() => {
                    this.pa.init(1);
                  }, 0.5);
                  this.isMove = false;
                  break;
                }
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

          for (let i = this.tempPropBrandList.length - 1; i >= 0; i--) {
            const p = this.tempPropBrandList[i];
            p.node.z -= this.moveSpeed * deltaTime;

            if (p.node.z <= -0.614) {
              p.node.y -= this.moveSpeed * deltaTime * 0.35;

              if (p.node.y <= -0.753) {
                p.node.y = -0.753;
              }
            }

            if (p.node.z <= -30) {
              this.tempPropBrandList.splice(i, 1);
              p.node.active = false;
              (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
                error: Error()
              }), PoolEnum) : PoolEnum).Prop + 0, p);
            }
          }
        }

        move(count) {
          this.isMove = true;
          const c = this.propBrandList.length;

          for (let i = 0; i < count; i++) {
            const p = this.propBrand;
            this.wallNode.addChild(p.node);
            p.node.x = 0;
            p.node.y = this.height;
            p.node.z = (i + c - 1) * this.distance;
            this.propBrandList.push(p);
          }

          for (let i = 0; i < count; i++) {
            const p = this.propBrandList[0];
            this.tempPropBrandList.push(p);
            p.collide.on("onTriggerEnter", this.onTriggerEnter, this);
            this.propBrandList.splice(0, 1);
          }
        }

        get propBrand() {
          let p = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).Prop + this.type);

          if (!p) {
            const node = (_crd && PrefabsManager === void 0 ? (_reportPossibleCrUseOfPrefabsManager({
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
          const player = event.otherCollider.getComponent(_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player);

          if (player) {
            let role = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).role + player.roleType);

            if (!role) {
              const node = (_crd && PrefabsManager === void 0 ? (_reportPossibleCrUseOfPrefabsManager({
                error: Error()
              }), PrefabsManager) : PrefabsManager).instance.GetPrefabsIns((_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
                error: Error()
              }), PrefabsEnum) : PrefabsEnum).hero, player.roleType);
              role = node.getComponent(_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
                error: Error()
              }), Role) : Role);
            }

            const layer = (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
              error: Error()
            }), LayerManager) : LayerManager).instance.getLayer((_crd && LayerEnum === void 0 ? (_reportPossibleCrUseOfLayerEnum({
              error: Error()
            }), LayerEnum) : LayerEnum).Layer_1_Ground);
            layer.addChild(role.node);
            const selfPos = event.selfCollider.node.worldPosition;
            role.node.setWorldPosition(selfPos);
            role.hp = 2;
            role.node.active = true;
            player.addRole(role);
            const pos = player.getNextPos();
            const index = player.length - 1;
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
            const cPos = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.V3.set(Vec3.ZERO);
            cPos.z = (selfPos.z + pos.z) * 0.5;
            let f = selfPos.x - pos.x;
            f = f / Math.abs(f);
            cPos.x = (selfPos.x + pos.x) * 0.5 - f * 3; // cPos.set()

            (_crd && EffectManager === void 0 ? (_reportPossibleCrUseOfEffectManager({
              error: Error()
            }), EffectManager) : EffectManager).instance.addShowEffect_3(role.node, (_crd && EffectEnum === void 0 ? (_reportPossibleCrUseOfEffectEnum({
              error: Error()
            }), EffectEnum) : EffectEnum).up, 1);
            const roleFBXNode = role.fbxManager.node;
            const scaleR = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.V3.set(roleFBXNode.scale); // roleFBXNode.setPosition(Vec3.ZERO);

            (_crd && FlashRedManager === void 0 ? (_reportPossibleCrUseOfFlashRedManager({
              error: Error()
            }), FlashRedManager) : FlashRedManager).instance.flashRed(role.node, role.meshCreateDataList, 0.5);
            const scale2 = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
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

              const selfPos2 = player.getNextPos(index);
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
              const curPos = player.getNextPos(index);
              curPos.subtract(pos);
              curPos.add(prop.worldPosition);
              prop.setWorldPosition(curPos);
              (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.V3 = curPos;
            }, null);
            const propBrand = event.selfCollider.getComponent(_crd && PropBrand === void 0 ? (_reportPossibleCrUseOfPropBrand({
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
        initializer: function () {
          return 15;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "distance", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.5;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "height", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.665;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "count", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
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
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "type", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0c8ced5f5ee21dc3098e4b6c63707b1b59bca6db.js.map