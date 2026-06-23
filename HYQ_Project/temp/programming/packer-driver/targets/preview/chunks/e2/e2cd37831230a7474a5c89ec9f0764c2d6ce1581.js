System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12", "__unresolved_13", "__unresolved_14"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, CCInteger, Node, tween, Tween, Vec3, PoolManager, PropBrand, EffectEnum, EventType, LayerEnum, PoolEnum, PrefabsEnum, SoundEnum, PrefabsManager, Player, Role, LayerManager, JumpManager, UnityUpComponent, EffectManager, AudioManager, FlashRedManager, PropLalianGate, GameOverPanel, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _crd, ccclass, property, CreatePropBrand;

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

  function _reportPossibleCrUseOfPropLalianGate(extras) {
    _reporterNs.report("PropLalianGate", "./PropLalianGate", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameOverPanel(extras) {
    _reporterNs.report("GameOverPanel", "../UI/GameOver/GameOverPanel", _context.meta, extras);
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
      UnityUpComponent = _unresolved_10.UnityUpComponent;
    }, function (_unresolved_11) {
      EffectManager = _unresolved_11.EffectManager;
    }, function (_unresolved_12) {
      AudioManager = _unresolved_12.default;
    }, function (_unresolved_13) {
      FlashRedManager = _unresolved_13.FlashRedManager;
    }, function (_unresolved_14) {
      PropLalianGate = _unresolved_14.PropLalianGate;
    }, function (_unresolved_15) {
      GameOverPanel = _unresolved_15.GameOverPanel;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7ab0exJe1JDaaNCop2wV4XG", "CreatePropBrand", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'CCInteger', 'ITriggerEvent', 'Node', 'tween', 'Tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CreatePropBrand", CreatePropBrand = (_dec = ccclass('CreatePropBrand'), _dec2 = property({
        type: CCInteger,
        displayName: '展示数量',
        tooltip: '开局先摆出来的 +1/+99 道具数量，只影响初始队列长度。'
      }), _dec3 = property({
        type: CCFloat,
        displayName: '道具间距',
        tooltip: '道具队列里相邻两个道具在 Z 轴上的距离。'
      }), _dec4 = property({
        type: CCFloat,
        displayName: '道具高度',
        tooltip: '道具生成时的 Y 轴高度。'
      }), _dec5 = property({
        type: CCInteger,
        displayName: '每个道具数值',
        tooltip: '每个道具显示和生效的数值。左边 +1 填 1，右边 +99 填 99。'
      }), _dec6 = property({
        type: CCInteger,
        displayName: '+1生效人数上限(0=使用玩家)',
        tooltip: '当前通道为 +1 时，玩家人数达到该值后继续吃 +1 不再增加角色。填 0 时使用 Player 上的 +1人数上限。'
      }), _dec7 = property({
        type: CCInteger,
        displayName: '+99胜利阈值',
        tooltip: '道具数值达到该值时，吃到后直接胜利。默认 99。'
      }), _dec8 = property({
        type: CCInteger,
        displayName: '+1/+99单次放出上限(0=不限制)',
        tooltip: '拉链完成后，本通道单次最多放出多少个 +1/+99。填 0 表示不额外限制，使用拉链组件传来的数量。'
      }), _dec9 = property({
        type: CCFloat,
        displayName: '移动速度',
        tooltip: '拉链完成后，道具队列向玩家移动的速度。'
      }), _dec10 = property({
        type: _crd && PropLalianGate === void 0 ? (_reportPossibleCrUseOfPropLalianGate({
          error: Error()
        }), PropLalianGate) : PropLalianGate,
        displayName: 'Lalian拉链组件',
        tooltip: '拖入同一侧 Prop_arms 上的 PropLalianGate。为空时会自动在当前节点子级查找。'
      }), _dec11 = property({
        type: CCFloat,
        displayName: '道具起始Z额外偏移',
        tooltip: '在拉链自动计算的起始 Z 基础上额外加的偏移。用于微调 +1/+99 队列离拉链的远近。'
      }), _dec12 = property({
        type: Node,
        displayName: '道具挂载父节点',
        tooltip: '生成出来的 +1/+99 道具会挂到这个节点下面。通常填当前通道的 wall/root 节点。'
      }), _dec13 = property({
        type: CCInteger,
        displayName: '道具类型',
        tooltip: '对应 PrefabsEnum.prop 的预制体类型编号。保持和原来左/右道具类型一致。'
      }), _dec(_class = (_class2 = class CreatePropBrand extends (_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
        error: Error()
      }), UnityUpComponent) : UnityUpComponent) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "showCount", _descriptor, this);

          _initializerDefineProperty(this, "distance", _descriptor2, this);

          _initializerDefineProperty(this, "height", _descriptor3, this);

          _initializerDefineProperty(this, "count", _descriptor4, this);

          _initializerDefineProperty(this, "addRoleMaxCount", _descriptor5, this);

          _initializerDefineProperty(this, "winPropCountThreshold", _descriptor6, this);

          _initializerDefineProperty(this, "releaseCountLimit", _descriptor7, this);

          _initializerDefineProperty(this, "moveSpeed", _descriptor8, this);

          _initializerDefineProperty(this, "lalianGate", _descriptor9, this);

          _initializerDefineProperty(this, "propStartZ", _descriptor10, this);

          _initializerDefineProperty(this, "wallNode", _descriptor11, this);

          _initializerDefineProperty(this, "type", _descriptor12, this);

          this.propBrandList = [];
          this.tempPropBrandList = [];
          this.isMove = false;
          this.pendingReleaseCount = 0;
          this.tempV3 = new Vec3();
          this.groundWorldPos = new Vec3();
          this.groundLocalPos = new Vec3();
          this.modelVisualGroup = null;
          this.spriteVisualGroup = null;
          this.labelVisualGroup = null;
          this.groundHeight = 0;
        }

        get activeLalianGate() {
          if (!this.lalianGate) {
            this.lalianGate = this.findLalianGate(this.node);
          }

          return this.lalianGate;
        }

        get activePropStartZ() {
          var _this$activeLalianGat, _this$activeLalianGat2;

          return this.propStartZ + ((_this$activeLalianGat = (_this$activeLalianGat2 = this.activeLalianGate) == null ? void 0 : _this$activeLalianGat2.getPropStartZ()) != null ? _this$activeLalianGat : 0);
        }

        setWaveRoleList(waveRoleList) {}

        start() {
          var startZ = this.activePropStartZ;
          this.ensureVisualGroups();
          this.refreshGroundHeight();

          for (var i = 0; i < this.showCount; i++) {
            var p = this.propBrand;
            this.propBrandList.push(p);
            this.wallNode.addChild(p.node);
            p.node.x = 0;
            p.node.y = this.getSpawnHeight();
            p.node.z = startZ + i * this.distance;
            this.bindPropBrandVisuals(p);
          }

          var gate = this.activeLalianGate;

          if (gate) {
            gate.node.off((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
              error: Error()
            }), EventType) : EventType).PROP_ARMS_DIE, this.lalianDoneEvent, this);
            gate.node.on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
              error: Error()
            }), EventType) : EventType).PROP_ARMS_DIE, this.lalianDoneEvent, this);
          }
        }

        onDestroy() {
          var _this$activeLalianGat3;

          (_this$activeLalianGat3 = this.activeLalianGate) == null || _this$activeLalianGat3.node.off((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).PROP_ARMS_DIE, this.lalianDoneEvent, this);
        }

        lalianDoneEvent(info) {
          var _info$moveCount;

          var count = ((_info$moveCount = info == null ? void 0 : info.moveCount) != null ? _info$moveCount : 0) > 0 ? info.moveCount : -1;

          if (this.releaseCountLimit > 0) {
            count = count < 0 ? this.releaseCountLimit : Math.min(count, this.releaseCountLimit);
          }

          this.move(count);
        }

        _update(deltaTime) {
          if (this.isMove) {
            for (var i = 0; i < this.propBrandList.length; i++) {
              var p = this.propBrandList[i];

              if (!i && p.node.z <= 0) {
                if (!this.releaseFrontProp()) {
                  this.isMove = false;
                }

                i--;
                break;
              }

              p.node.z -= this.moveSpeed * deltaTime;

              if (p.node.z <= -0.614 && p.node.y > this.groundHeight) {
                p.node.y -= this.moveSpeed * deltaTime * 0.5;

                if (p.node.y <= this.groundHeight) {
                  p.node.y = this.groundHeight;
                }
              }

              p.updateVisualTransform();
            }
          }

          for (var _i = this.tempPropBrandList.length - 1; _i >= 0; _i--) {
            var _p = this.tempPropBrandList[_i];
            _p.node.z -= this.moveSpeed * deltaTime;

            if (_p.node.z <= -0.614) {
              _p.node.y -= this.moveSpeed * deltaTime * 0.35;

              if (_p.node.y <= this.groundHeight) {
                _p.node.y = this.groundHeight;
              }
            }

            _p.updateVisualTransform();

            if (_p.node.z <= -30) {
              this.tempPropBrandList.splice(_i, 1);

              _p.setVisualActive(false);

              _p.node.active = false;
              (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
                error: Error()
              }), PoolEnum) : PoolEnum).Prop + this.type, _p);
            }
          }
        }

        refreshGroundHeight() {
          this.groundHeight = 0;

          if (!this.wallNode) {
            return;
          }

          this.groundWorldPos.set(this.wallNode.worldPosition);
          this.groundWorldPos.y = 0;
          this.wallNode.inverseTransformPoint(this.groundLocalPos, this.groundWorldPos);
          this.groundHeight = this.groundLocalPos.y;
        }

        getSpawnHeight() {
          return Math.abs(this.height) <= 0.000001 ? this.groundHeight : this.height;
        }

        appendPropBrands(count) {
          var last = this.propBrandList[this.propBrandList.length - 1];
          var appendStartZ = last ? last.node.z + this.distance : this.activePropStartZ;

          for (var i = 0; i < count; i++) {
            var p = this.propBrand;
            this.wallNode.addChild(p.node);
            p.node.x = 0;
            p.node.y = this.getSpawnHeight();
            p.node.z = appendStartZ + i * this.distance;
            this.bindPropBrandVisuals(p);
            this.propBrandList.push(p);
          }
        }

        releaseFrontProp() {
          if (this.pendingReleaseCount === 0) {
            return false;
          }

          var p = this.propBrandList.shift();

          if (!p) {
            this.pendingReleaseCount = 0;
            return false;
          }

          if (this.pendingReleaseCount > 0) {
            this.pendingReleaseCount--;
          }

          this.tempPropBrandList.push(p);
          p.collide.off("onTriggerEnter", this.onTriggerEnter, this);
          p.collide.on("onTriggerEnter", this.onTriggerEnter, this);
          this.appendPropBrands(1);
          return this.pendingReleaseCount !== 0;
        }

        move(count) {
          if (count === 0) {
            return;
          }

          if (count < 0 || this.pendingReleaseCount < 0) {
            this.pendingReleaseCount = -1;
          } else {
            this.pendingReleaseCount += count;
          }

          this.isMove = true;
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
          p.setVisualActive(true);
          p.init(this.count);
          return p;
        }

        onTriggerEnter(event) {
          var player = event.otherCollider.getComponent(_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player);

          if (!player) {
            return;
          }

          var propBrand = event.selfCollider.getComponent(_crd && PropBrand === void 0 ? (_reportPossibleCrUseOfPropBrand({
            error: Error()
          }), PropBrand) : PropBrand);

          if (!propBrand) {
            return;
          }

          if (!this.isWinPropBrand(propBrand) && player.length >= this.getAddRoleMaxCount(player)) {
            this.recycleTriggeredProp(propBrand);
            return;
          }

          if (this.isWinPropBrand(propBrand)) {
            this.recycleTriggeredProp(propBrand);
            (_crd && GameOverPanel === void 0 ? (_reportPossibleCrUseOfGameOverPanel({
              error: Error()
            }), GameOverPanel) : GameOverPanel).instance.show(true);
            return;
          }

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

          if (!player.addRole(role)) {
            role.node.active = false;
            (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).role + player.roleType, role);

            var _propBrandIndex = this.tempPropBrandList.indexOf(propBrand);

            if (_propBrandIndex !== -1) {
              this.tempPropBrandList.splice(_propBrandIndex, 1);
            }

            this.scheduleOnce(() => {
              if (!propBrand) {
                return;
              }

              propBrand.setVisualActive(false);
              propBrand.node.active = false;
              (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
                error: Error()
              }), PoolEnum) : PoolEnum).Prop + this.type, propBrand);
              propBrand.collide.off("onTriggerEnter", this.onTriggerEnter, this);
            }, 0);
            return;
          }

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
          cPos.x = (selfPos.x + pos.x) * 0.5 - f * 3;
          (_crd && EffectManager === void 0 ? (_reportPossibleCrUseOfEffectManager({
            error: Error()
          }), EffectManager) : EffectManager).instance.addShowEffect_3(role.node, (_crd && EffectEnum === void 0 ? (_reportPossibleCrUseOfEffectEnum({
            error: Error()
          }), EffectEnum) : EffectEnum).up, 1);
          var roleFBXNode = role.fbxManager.node;
          var scaleR = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.V3.set(roleFBXNode.scale);
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
            }), PoolManager) : PoolManager).instance.V3 = cPos;
            var selfPos2 = player.getNextPos(index);
            player.node.addChild(role.node);
            role.node.setWorldPosition(selfPos2);
            player.upMoveBoundary();

            if (role.arms) {
              role.arms.active = true;
            }

            (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.V3 = selfPos2;
          }).setEndPosPre(prop => {
            var curPos = player.getNextPos(index);
            curPos.subtract(pos);
            curPos.add(prop.worldPosition);
            prop.setWorldPosition(curPos);
            (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.V3 = curPos;
          }, null);
          var propBrandIndex = this.tempPropBrandList.indexOf(propBrand);

          if (propBrandIndex !== -1) {
            this.tempPropBrandList.splice(propBrandIndex, 1);
          }

          this.scheduleOnce(() => {
            Tween.stopAllByTarget(this.node);
            propBrand.setVisualActive(false);
            propBrand.node.active = false;
            (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).Prop + this.type, propBrand);
            propBrand.collide.off("onTriggerEnter", this.onTriggerEnter, this);
          }, 0);
        }

        recycleTriggeredProp(propBrand) {
          var propBrandIndex = this.tempPropBrandList.indexOf(propBrand);

          if (propBrandIndex !== -1) {
            this.tempPropBrandList.splice(propBrandIndex, 1);
          }

          propBrand.setVisualActive(false);
          propBrand.node.active = false;
          (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).Prop + this.type, propBrand);
          propBrand.collide.off("onTriggerEnter", this.onTriggerEnter, this);
        }

        ensureVisualGroups() {
          if (this.modelVisualGroup && this.spriteVisualGroup && this.labelVisualGroup) {
            return;
          }

          this.modelVisualGroup = this.createVisualGroup("PropBrand_Model_Group");
          this.spriteVisualGroup = this.createVisualGroup("PropBrand_Sprite_Group");
          this.labelVisualGroup = this.createVisualGroup("PropBrand_Label_Group");
        }

        createVisualGroup(name) {
          var group = new Node(name + "_" + this.node.name);
          this.wallNode.addChild(group);
          group.setPosition(Vec3.ZERO);
          return group;
        }

        bindPropBrandVisuals(propBrand) {
          this.ensureVisualGroups();
          propBrand.bindVisualGroups(this.modelVisualGroup, this.spriteVisualGroup, this.labelVisualGroup);
        }

        getAddRoleMaxCount(player) {
          return this.addRoleMaxCount > 0 ? Math.min(this.addRoleMaxCount, player.maxRoleCount) : player.maxRoleCount;
        }

        isWinPropBrand(propBrand) {
          return propBrand.count >= this.winPropCountThreshold;
        }

        findLalianGate(root) {
          if (!root) {
            return null;
          }

          var gate = root.getComponent(_crd && PropLalianGate === void 0 ? (_reportPossibleCrUseOfPropLalianGate({
            error: Error()
          }), PropLalianGate) : PropLalianGate);

          if (gate) {
            return gate;
          }

          for (var i = 0; i < root.children.length; i++) {
            var result = this.findLalianGate(root.children[i]);

            if (result) {
              return result;
            }
          }

          return null;
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
          return 0;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "count", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "addRoleMaxCount", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "winPropCountThreshold", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 99;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "releaseCountLimit", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "lalianGate", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "propStartZ", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "wallNode", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "type", [_dec13], {
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
//# sourceMappingURL=e2cd37831230a7474a5c89ec9f0764c2d6ce1581.js.map