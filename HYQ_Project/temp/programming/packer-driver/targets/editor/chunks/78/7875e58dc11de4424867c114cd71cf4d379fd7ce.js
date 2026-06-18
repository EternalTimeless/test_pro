System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCInteger, Color, Component, Node, Quat, Vec3, FbxManager, BulletEnum, LayerEnum, RoleEnum, SoundEnum, BulletManager, LayerManager, MeshFlashData, FlashRedManager, AttackParkPlay, AudioManager, BulletMonsterCollisionManager, BulletBatchRenderer, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _class3, _crd, ccclass, property, Role;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfFbxManager(extras) {
    _reporterNs.report("FbxManager", "../SkAnim/FbxManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletEnum(extras) {
    _reporterNs.report("BulletEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLayerEnum(extras) {
    _reporterNs.report("LayerEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRoleEnum(extras) {
    _reporterNs.report("RoleEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundEnum(extras) {
    _reporterNs.report("SoundEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletManager(extras) {
    _reporterNs.report("BulletManager", "../Battle/BulletManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLayerManager(extras) {
    _reporterNs.report("LayerManager", "../../Base/LayerManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMeshFlashData(extras) {
    _reporterNs.report("MeshFlashData", "../Battle/Base/BattleTargetBase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFlashRedManager(extras) {
    _reporterNs.report("FlashRedManager", "../Battle/Base/FlashRedManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAttackParkPlay(extras) {
    _reporterNs.report("AttackParkPlay", "../Battle/Battle3D/AttackParkPlay", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "../../Base/AudioManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletMonsterCollisionManager(extras) {
    _reporterNs.report("BulletMonsterCollisionManager", "../Battle/BulletMonsterCollisionManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletBattle3D(extras) {
    _reporterNs.report("BulletBattle3D", "../Battle/Battle3D/Bullet/BulletBattle3D", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPropLalianGate(extras) {
    _reporterNs.report("PropLalianGate", "../Other/PropLalianGate", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletBatchRenderer(extras) {
    _reporterNs.report("BulletBatchRenderer", "../Battle/BulletBatchRenderer", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CCInteger = _cc.CCInteger;
      Color = _cc.Color;
      Component = _cc.Component;
      Node = _cc.Node;
      Quat = _cc.Quat;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      FbxManager = _unresolved_2.FbxManager;
    }, function (_unresolved_3) {
      BulletEnum = _unresolved_3.BulletEnum;
      LayerEnum = _unresolved_3.LayerEnum;
      RoleEnum = _unresolved_3.RoleEnum;
      SoundEnum = _unresolved_3.SoundEnum;
    }, function (_unresolved_4) {
      BulletManager = _unresolved_4.default;
    }, function (_unresolved_5) {
      LayerManager = _unresolved_5.default;
    }, function (_unresolved_6) {
      MeshFlashData = _unresolved_6.MeshFlashData;
    }, function (_unresolved_7) {
      FlashRedManager = _unresolved_7.FlashRedManager;
    }, function (_unresolved_8) {
      AttackParkPlay = _unresolved_8.AttackParkPlay;
    }, function (_unresolved_9) {
      AudioManager = _unresolved_9.default;
    }, function (_unresolved_10) {
      BulletMonsterCollisionManager = _unresolved_10.default;
    }, function (_unresolved_11) {
      BulletBatchRenderer = _unresolved_11.BulletBatchRenderer;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "86381loO/lKPYw+1SpcYu+c", "Role", undefined);

      __checkObsolete__(['_decorator', 'CCInteger', 'Color', 'Component', 'Node', 'Quat', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Role", Role = (_dec = ccclass('Role'), _dec2 = property({
        type: _crd && RoleEnum === void 0 ? (_reportPossibleCrUseOfRoleEnum({
          error: Error()
        }), RoleEnum) : RoleEnum
      }), _dec3 = property(_crd && FbxManager === void 0 ? (_reportPossibleCrUseOfFbxManager({
        error: Error()
      }), FbxManager) : FbxManager), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(CCInteger), _dec7 = property(_crd && AttackParkPlay === void 0 ? (_reportPossibleCrUseOfAttackParkPlay({
        error: Error()
      }), AttackParkPlay) : AttackParkPlay), _dec8 = property({
        type: [_crd && MeshFlashData === void 0 ? (_reportPossibleCrUseOfMeshFlashData({
          error: Error()
        }), MeshFlashData) : MeshFlashData],
        tooltip: '闪红MeshRenderer配置列表，可在属性检查器中编辑'
      }), _dec9 = property({
        type: [_crd && MeshFlashData === void 0 ? (_reportPossibleCrUseOfMeshFlashData({
          error: Error()
        }), MeshFlashData) : MeshFlashData],
        tooltip: '闪红MeshRenderer配置列表，可在属性检查器中编辑'
      }), _dec10 = property({
        type: [_crd && MeshFlashData === void 0 ? (_reportPossibleCrUseOfMeshFlashData({
          error: Error()
        }), MeshFlashData) : MeshFlashData],
        tooltip: '闪红MeshRenderer配置列表，可在属性检查器中编辑'
      }), _dec(_class = (_class2 = (_class3 = class Role extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "type", _descriptor, this);

          _initializerDefineProperty(this, "fbxManager", _descriptor2, this);

          _initializerDefineProperty(this, "shoot", _descriptor3, this);

          this.hp = 2;

          _initializerDefineProperty(this, "arms", _descriptor4, this);

          _initializerDefineProperty(this, "attackNum", _descriptor5, this);

          this.attackIN = false;

          _initializerDefineProperty(this, "effect", _descriptor6, this);

          // public attackTime: number = 0;
          // ==================== 闪红效果 ====================
          _initializerDefineProperty(this, "meshFlashDataList", _descriptor7, this);

          _initializerDefineProperty(this, "meshRedDataList", _descriptor8, this);

          _initializerDefineProperty(this, "meshCreateDataList", _descriptor9, this);
        }

        start() {
          if (!Role.bulletLayer) {
            Role.bulletLayer = (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
              error: Error()
            }), LayerManager) : LayerManager).instance.getLayer((_crd && LayerEnum === void 0 ? (_reportPossibleCrUseOfLayerEnum({
              error: Error()
            }), LayerEnum) : LayerEnum).BulletLayer);
          } // this.fbxManager.setAttackAnimCall(this.attackEvent, this)

        }

        die(time) {
          (_crd && FlashRedManager === void 0 ? (_reportPossibleCrUseOfFlashRedManager({
            error: Error()
          }), FlashRedManager) : FlashRedManager).instance.flashRed(this.node, this.meshFlashDataList, time * 1.1, Color.GRAY);
        } // protected update(dt: number): void {
        //     if (!this.attackIN) {
        //         this.attackTime -= dt;
        //     }
        // }


        get visualBulletCount() {
          return 1 + this.attackNum;
        }

        attackEvent(num, visualBulletCount = this.visualBulletCount, damageScale = 1, lockWorldX = this.node.worldPosition.x, playEffect = true) {
          if (visualBulletCount <= 0) {
            return;
          }

          (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).inst.playOneShot(Role.soundType, 0.3, 0.08);
          const pos = this.shoot.worldPosition;
          const damage = Role.power * damageScale;
          const batchRenderer = (_crd && BulletBatchRenderer === void 0 ? (_reportPossibleCrUseOfBulletBatchRenderer({
            error: Error()
          }), BulletBatchRenderer) : BulletBatchRenderer).getOrCreate(Role.bulletLayer);
          const bullet = (_crd && BulletManager === void 0 ? (_reportPossibleCrUseOfBulletManager({
            error: Error()
          }), BulletManager) : BulletManager).instance.shootBullet3D(Role.bulletType, Quat.IDENTITY, damage, Role.repelPower);
          Role.bulletLayer.addChild(bullet.node);
          bullet.node.setWorldPosition(pos);
          Role.aimBulletToCurrentTarget(bullet, lockWorldX);
          batchRenderer.registerBullet(bullet);

          if (playEffect) {
            var _this$effect;

            (_this$effect = this.effect) == null || _this$effect.play();
          }

          for (let i = 1; i < visualBulletCount; i++) {
            const bullet = (_crd && BulletManager === void 0 ? (_reportPossibleCrUseOfBulletManager({
              error: Error()
            }), BulletManager) : BulletManager).instance.shootBullet3D(Role.bulletType, Quat.IDENTITY, damage, Role.repelPower);
            Role.bulletLayer.addChild(bullet.node);
            bullet.node.setWorldPosition(pos);
            const x = (Math.random() - 0.5) * 2;
            bullet.node.x += x;
            const z = (Math.random() - 0.5) * 4;
            bullet.node.z += z;
            Role.aimBulletToCurrentTarget(bullet, lockWorldX);
            batchRenderer.registerBullet(bullet);
          }
        }

        static aimBulletToCurrentTarget(bullet, lockWorldX = bullet.node.worldPosition.x) {
          const target = (_crd && BulletMonsterCollisionManager === void 0 ? (_reportPossibleCrUseOfBulletMonsterCollisionManager({
            error: Error()
          }), BulletMonsterCollisionManager) : BulletMonsterCollisionManager).instance.getLockableLalianTarget(bullet.node.worldPosition, lockWorldX, bullet.attackTargetTag);

          if (!target) {
            return;
          }

          const gate = target;
          const aimPos = gate.getLockAimWorldPosition ? gate.getLockAimWorldPosition(bullet.node.worldPosition, Role.aimVector) : target.hitNode.worldPosition;
          Vec3.subtract(Role.aimVector, aimPos, bullet.node.worldPosition);
          Role.aimVector.y = 0;

          if (Role.aimVector.lengthSqr() <= 0.0001) {
            return;
          }

          Role.aimVector.normalize();
          Quat.fromViewUp(Role.aimQuat, Role.aimVector, Vec3.UP);
          bullet.node.setWorldRotation(Role.aimQuat);
        }

      }, _class3.soundType = (_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
        error: Error()
      }), SoundEnum) : SoundEnum).Sound_Gun, _class3.bulletType = (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
        error: Error()
      }), BulletEnum) : BulletEnum).arrow, _class3.power = 1, _class3.repelPower = 0, _class3.bulletLayer = void 0, _class3.aimVector = new Vec3(), _class3.aimQuat = new Quat(), _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "type", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && RoleEnum === void 0 ? (_reportPossibleCrUseOfRoleEnum({
            error: Error()
          }), RoleEnum) : RoleEnum).underling;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "fbxManager", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "shoot", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "arms", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "attackNum", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "effect", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "meshFlashDataList", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "meshRedDataList", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "meshCreateDataList", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7875e58dc11de4424867c114cd71cf4d379fd7ce.js.map