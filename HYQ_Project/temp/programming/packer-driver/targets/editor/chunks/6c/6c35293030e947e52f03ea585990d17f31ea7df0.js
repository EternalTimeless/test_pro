System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, CCInteger, Vec3, BulletEnum, EffectEnum, PoolEnum, PoolManager, MoveDrive, MoveModEnum, BattleTarget3D, BulletCollideBase2D, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _crd, ccclass, property, BulletBattle2D;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfBulletEnum(extras) {
    _reporterNs.report("BulletEnum", "db://assets/Script/Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEffectEnum(extras) {
    _reporterNs.report("EffectEnum", "db://assets/Script/Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolEnum(extras) {
    _reporterNs.report("PoolEnum", "db://assets/Script/Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolManager(extras) {
    _reporterNs.report("PoolManager", "db://assets/Script/Base/PoolManager", _context.meta, extras);
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

  function _reportPossibleCrUseOfBulletCollideBase2D(extras) {
    _reporterNs.report("BulletCollideBase2D", "./BulletCollideBase2D", _context.meta, extras);
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
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      BulletEnum = _unresolved_2.BulletEnum;
      EffectEnum = _unresolved_2.EffectEnum;
      PoolEnum = _unresolved_2.PoolEnum;
    }, function (_unresolved_3) {
      PoolManager = _unresolved_3.default;
    }, function (_unresolved_4) {
      MoveDrive = _unresolved_4.MoveDrive;
      MoveModEnum = _unresolved_4.MoveModEnum;
    }, function (_unresolved_5) {
      BattleTarget3D = _unresolved_5.BattleTarget3D;
    }, function (_unresolved_6) {
      BulletCollideBase2D = _unresolved_6.BulletCollideBase2D;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2aad1Up0JJGeK+7D9XftkH7", "BulletBattle2D", undefined);

      __checkObsolete__(['_decorator', 'ccenum', 'CCFloat', 'CCInteger', 'Collider2D', 'Component', 'IPhysics2DContact', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 弹药战斗系统 使用 物理
       */

      _export("default", BulletBattle2D = (_dec = ccclass('BulletBattle2D'), _dec2 = property({
        type: _crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
          error: Error()
        }), BulletEnum) : BulletEnum
      }), _dec3 = property({
        type: _crd && EffectEnum === void 0 ? (_reportPossibleCrUseOfEffectEnum({
          error: Error()
        }), EffectEnum) : EffectEnum
      }), _dec4 = property(CCFloat), _dec5 = property(CCFloat), _dec6 = property(CCFloat), _dec7 = property(CCInteger), _dec8 = property(_crd && MoveDrive === void 0 ? (_reportPossibleCrUseOfMoveDrive({
        error: Error()
      }), MoveDrive) : MoveDrive), _dec(_class = (_class2 = class BulletBattle2D extends (_crd && BulletCollideBase2D === void 0 ? (_reportPossibleCrUseOfBulletCollideBase2D({
        error: Error()
      }), BulletCollideBase2D) : BulletCollideBase2D) {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "bulletEnum", _descriptor, this);

          _initializerDefineProperty(this, "bulletHitEnum", _descriptor2, this);

          _initializerDefineProperty(this, "moveSpeed", _descriptor3, this);

          /**-1 关闭 弹药碰撞到第一个有效目标后 经过该时间后结束 优先：1   */
          _initializerDefineProperty(this, "triggerDieTime", _descriptor4, this);

          this._triggerDieTime = this.triggerDieTime;
          this._isTrigger = false;

          /**-1 关闭 弹药发出后结束的时间 优先：3    防止 一些永远无法攻击到敌人的弹药一直在场景中  无论该弹药是否攻击过*/
          _initializerDefineProperty(this, "overTime", _descriptor5, this);

          this._overTime = this.overTime;

          /**弹药攻击attackCount次 后结束 (只能大于0) 优先：2  到达次数后回收*/
          _initializerDefineProperty(this, "attackCount", _descriptor6, this);

          this._attackCount = this.attackCount;
          this._damage = 0;
          this._repelPower = 0;

          _initializerDefineProperty(this, "moveD", _descriptor7, this);

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

          this.moveD.moveMod = (_crd && MoveModEnum === void 0 ? (_reportPossibleCrUseOfMoveModEnum({
            error: Error()
          }), MoveModEnum) : MoveModEnum).vectorMove;
        }

        update(dt) {
          if (this.triggerDieTime != -1 && this._isTrigger) {
            if (this._triggerDieTime <= 0) {
              this.over();
            } else {
              this._triggerDieTime -= dt;
            }
          } else if (this._attackCount <= 0) {
            this.over();
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
          this.node.active = false;
          (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).bullet + this.bulletEnum, this);
        }
        /**
         * 
         * @param angle 角度
         * @param damage 伤害
         * @param repelPower 击退力度
         */


        setBulletInfo(angle, damage, repelPower) {
          this.node.angle = angle;
          this._damage = damage;
          this._repelPower = repelPower;
          this._attackCount = this.attackCount;
          this._overTime = this.overTime;
          this._triggerDieTime = this.triggerDieTime;
          this._isTrigger = false;
          let r = angle / 180 * Math.PI;
          let vectorX = Math.cos(r);
          let vectorY = Math.sin(r);
          this.node.active = true;
          this.moveD.vector.set(vectorX, vectorY);
        }

        _startCollide(other) {
          this._isTrigger = true;
          let battle = other.node.getComponent(_crd && BattleTarget3D === void 0 ? (_reportPossibleCrUseOfBattleTarget3D({
            error: Error()
          }), BattleTarget3D) : BattleTarget3D);

          if (battle.isDie) {
            return;
          }

          battle.Hit(this._damage);
          battle.repelBattleTarget(this.node, this._repelPower);
          this._attackCount--;
          this.temp.set(other.node.worldPosition);
          this.temp.y + 50; //在此添加攻击特效
          // EffectManager.instance.ShowEffect(this.temp, PoolEnum.bullet_hit, this.bulletHitEnum);
        }

        _EndCollide(other) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "bulletEnum", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
            error: Error()
          }), BulletEnum) : BulletEnum).arrow;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "bulletHitEnum", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && EffectEnum === void 0 ? (_reportPossibleCrUseOfEffectEnum({
            error: Error()
          }), EffectEnum) : EffectEnum).hit;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 200;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "triggerDieTime", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -1;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "overTime", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "attackCount", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "moveD", [_dec8], {
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
//# sourceMappingURL=6c35293030e947e52f03ea585990d17f31ea7df0.js.map