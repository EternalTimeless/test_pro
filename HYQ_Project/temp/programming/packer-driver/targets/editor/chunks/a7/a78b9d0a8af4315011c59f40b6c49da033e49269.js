System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, CCInteger, Component, Sprite, Vec3, BulletEnum, PoolEnum, PoolManager, EffectManager, MoveDrive, MoveModEnum, COLLIDE_TYPE, BulletMonsterCollisionManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _class3, _crd, ccclass, property, BulletBattle3D;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfBulletEnum(extras) {
    _reporterNs.report("BulletEnum", "db://assets/Script/Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolEnum(extras) {
    _reporterNs.report("PoolEnum", "db://assets/Script/Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolManager(extras) {
    _reporterNs.report("PoolManager", "db://assets/Script/Base/PoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEffectManager(extras) {
    _reporterNs.report("EffectManager", "../../../Effect/EffectManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMoveDrive(extras) {
    _reporterNs.report("MoveDrive", "../../../../Base/MoveRot/MoveDrive", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMoveModEnum(extras) {
    _reporterNs.report("MoveModEnum", "../../../../Base/MoveRot/MoveDrive", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleTarget3D(extras) {
    _reporterNs.report("BattleTarget3D", "../../BattleTarger/BattleTarget3D", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCOLLIDE_TYPE(extras) {
    _reporterNs.report("COLLIDE_TYPE", "../../CollectBattleTarger/ColliderTag", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletMonsterCollisionManager(extras) {
    _reporterNs.report("BulletMonsterCollisionManager", "../../BulletMonsterCollisionManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletBatchRenderer(extras) {
    _reporterNs.report("BulletBatchRenderer", "../../BulletBatchRenderer", _context.meta, extras);
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
      Component = _cc.Component;
      Sprite = _cc.Sprite;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      BulletEnum = _unresolved_2.BulletEnum;
      PoolEnum = _unresolved_2.PoolEnum;
    }, function (_unresolved_3) {
      PoolManager = _unresolved_3.default;
    }, function (_unresolved_4) {
      EffectManager = _unresolved_4.EffectManager;
    }, function (_unresolved_5) {
      MoveDrive = _unresolved_5.MoveDrive;
      MoveModEnum = _unresolved_5.MoveModEnum;
    }, function (_unresolved_6) {
      COLLIDE_TYPE = _unresolved_6.COLLIDE_TYPE;
    }, function (_unresolved_7) {
      BulletMonsterCollisionManager = _unresolved_7.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "aa252aLyzxMioFEmUwKaLO2", "BulletBattle3D", undefined);

      __checkObsolete__(['_decorator', 'ccenum', 'CCFloat', 'CCInteger', 'Component', 'math', 'Sprite', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 弹药战斗系统 - 自定义碰撞检测（移除物理引擎依赖）
       */

      _export("default", BulletBattle3D = (_dec = ccclass('BulletBattle3D'), _dec2 = property({
        type: _crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
          error: Error()
        }), BulletEnum) : BulletEnum,
        tooltip: '弹药类型'
      }), _dec3 = property({
        type: CCFloat,
        tooltip: 'x方向碰撞半宽（替代物理BoxCollider尺寸）'
      }), _dec4 = property({
        type: CCFloat,
        tooltip: 'z方向碰撞半深（替代物理BoxCollider尺寸）'
      }), _dec5 = property({
        type: _crd && COLLIDE_TYPE === void 0 ? (_reportPossibleCrUseOfCOLLIDE_TYPE({
          error: Error()
        }), COLLIDE_TYPE) : COLLIDE_TYPE,
        tooltip: '攻击目标类型（匹配ColliderTag.tag）'
      }), _dec6 = property({
        type: CCFloat,
        tooltip: '命中后销毁延时（-1关闭，优先级1）'
      }), _dec7 = property({
        type: CCFloat,
        tooltip: '子弹超时时间（-1关闭，优先级3）'
      }), _dec8 = property({
        type: CCInteger,
        tooltip: '穿透次数（攻击N次后回收，优先级2）'
      }), _dec9 = property({
        type: _crd && MoveDrive === void 0 ? (_reportPossibleCrUseOfMoveDrive({
          error: Error()
        }), MoveDrive) : MoveDrive,
        tooltip: '移动驱动组件'
      }), _dec(_class = (_class2 = (_class3 = class BulletBattle3D extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "bulletEnum", _descriptor, this);

          _initializerDefineProperty(this, "collisionHalfX", _descriptor2, this);

          _initializerDefineProperty(this, "collisionHalfZ", _descriptor3, this);

          _initializerDefineProperty(this, "attackTargetTag", _descriptor4, this);

          /**-1 关闭 弹药碰撞到第一个有效目标后 经过该时间后结束 优先：1   */
          _initializerDefineProperty(this, "triggerDieTime", _descriptor5, this);

          this._triggerDieTime = this.triggerDieTime;
          this._isTrigger = false;

          /**-1 关闭 弹药发出后结束的时间 优先：3    防止 一些永远无法攻击到敌人的弹药一直在场景中  无论该弹药是否攻击过*/
          _initializerDefineProperty(this, "overTime", _descriptor6, this);

          this._overTime = this.overTime;

          /**弹药攻击attackCount次 后结束 (只能大于0) 优先：2  到达次数后回收*/
          _initializerDefineProperty(this, "attackCount", _descriptor7, this);

          this._attackCount = this.attackCount;
          this._damage = 0;
          this._repelPower = 0;

          _initializerDefineProperty(this, "moveD", _descriptor8, this);

          this.batchSprite = null;
          this.batchWidth = 0;
          this.batchHeight = 0;
          this.batchLocalEulerX = 0;
          this.batchRenderer = null;

          /** 是否已注册到碰撞管理器 */
          this._registered = false;
          this._pooled = false;
          this._previousWorldPosition = new Vec3();
          this._hasPreviousWorldPosition = false;
          this.temp = new Vec3();
        }

        start() {
          this.moveD = this.node.getComponent(_crd && MoveDrive === void 0 ? (_reportPossibleCrUseOfMoveDrive({
            error: Error()
          }), MoveDrive) : MoveDrive);

          if (!this.moveD) {
            this.moveD = this.node.addComponent(_crd && MoveDrive === void 0 ? (_reportPossibleCrUseOfMoveDrive({
              error: Error()
            }), MoveDrive) : MoveDrive);
          }
        }

        update(dt) {
          this._previousWorldPosition.set(this.node.worldPosition);

          this._hasPreviousWorldPosition = true;

          if (this.triggerDieTime != -1 && this._isTrigger) {
            if (this._triggerDieTime <= 0) {
              this.over();
            } else {
              this._triggerDieTime -= dt;
            }
          } else if (this.overTime != -1) {
            if (this._overTime <= 0) {
              this.over();
            } else {
              this._overTime -= dt;
            }
          }

          this.moveD.MoveEvent(dt);
        }

        over() {
          var _this$batchRenderer;

          if (this._pooled) {
            return;
          }

          this._pooled = true;
          this.node.active = false;
          (_this$batchRenderer = this.batchRenderer) == null || _this$batchRenderer.unregisterBullet(this);
          (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).bullet + this.bulletEnum, this);

          if (this._registered) {
            (_crd && BulletMonsterCollisionManager === void 0 ? (_reportPossibleCrUseOfBulletMonsterCollisionManager({
              error: Error()
            }), BulletMonsterCollisionManager) : BulletMonsterCollisionManager).instance.unregisterBullet(this);
            this._registered = false;
          }
        }

        forceRecycle() {
          this.over();
        }
        /**
         * 
         * @param rot 角度
         * @param damage 伤害
         * @param repelPower 击退力度
         */


        setBulletInfo(rot, damage, repelPower) {
          this._pooled = false;
          this.node.setWorldRotation(rot);
          this.moveD.moveMod = (_crd && MoveModEnum === void 0 ? (_reportPossibleCrUseOfMoveModEnum({
            error: Error()
          }), MoveModEnum) : MoveModEnum).forwardMove;
          this._damage = damage;
          this._repelPower = repelPower;
          this._attackCount = this.attackCount;
          this._overTime = this.overTime;
          this._triggerDieTime = this.triggerDieTime;
          this._isTrigger = false;
          this._hasPreviousWorldPosition = false;
          const sprite = this.batchSprite && this.batchSprite.isValid ? this.batchSprite : this.node.getComponentInChildren(Sprite);

          if (sprite && sprite.isValid) {
            sprite.enabled = true;
            this.batchSprite = sprite;
          }

          this.node.active = true; // 注册到碰撞管理器

          if (!this._registered) {
            (_crd && BulletMonsterCollisionManager === void 0 ? (_reportPossibleCrUseOfBulletMonsterCollisionManager({
              error: Error()
            }), BulletMonsterCollisionManager) : BulletMonsterCollisionManager).instance.registerBullet(this);
            this._registered = true;
          }
        }

        getPreviousWorldPosition(out) {
          return this._hasPreviousWorldPosition ? out.set(this._previousWorldPosition) : out.set(this.node.worldPosition);
        }

        /**
         * 碰撞命中处理（迁移自原 _startCollide）
         * 由 BulletMonsterCollisionManager 在检测到碰撞时调用
         */
        onHitTarget(battle) {
          this._isTrigger = true;

          if (battle.isDie) {
            return;
          }

          if (this._attackCount <= 0) {
            this.over();
            return;
          }

          battle.Hit(this._damage);
          battle.repelBattleTarget(this.node, this._repelPower);
          this.tryShowHitEffect(battle);
          this._attackCount--;

          if (this.triggerDieTime == -1 && this._attackCount <= 0) {
            this.over();
            return;
          }
        }

        tryShowHitEffect(battle) {
          const now = Date.now() * 0.001;

          if (now - BulletBattle3D._effectWindowStart >= BulletBattle3D._hitEffectWindow) {
            BulletBattle3D._effectWindowStart = now;
            BulletBattle3D._effectCountInWindow = 0;
          }

          if (BulletBattle3D._effectCountInWindow < BulletBattle3D._maxHitEffectPerWindow) {
            BulletBattle3D._effectCountInWindow++;
            this.temp.set(this.node.worldPosition);
            this.temp.z -= 2;
            this.temp.y += 0.5;
            (_crd && EffectManager === void 0 ? (_reportPossibleCrUseOfEffectManager({
              error: Error()
            }), EffectManager) : EffectManager).instance.addShowEffect(this.temp, battle.hitEffect, 2);
          }
        }

      }, _class3._effectWindowStart = 0, _class3._effectCountInWindow = 0, _class3._hitEffectWindow = 0.05, _class3._maxHitEffectPerWindow = 3, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "bulletEnum", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
            error: Error()
          }), BulletEnum) : BulletEnum).arrow;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "collisionHalfX", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "collisionHalfZ", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.29;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "attackTargetTag", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "triggerDieTime", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -1;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "overTime", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "attackCount", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "moveD", [_dec9], {
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
//# sourceMappingURL=a78b9d0a8af4315011c59f40b6c49da033e49269.js.map