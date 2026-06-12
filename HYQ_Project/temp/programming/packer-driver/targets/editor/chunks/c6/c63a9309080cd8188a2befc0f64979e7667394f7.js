System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Vec3, BattleTarget3D, TriggerBase3D, vectorPower2, isFacingTargetHorizontal_vec, _dec, _class, _crd, ccclass, property, CollectBattleTarger3D;

  function _reportPossibleCrUseOfBattleTarget3D(extras) {
    _reporterNs.report("BattleTarget3D", "../BattleTarger/BattleTarget3D", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTriggerBase3D(extras) {
    _reporterNs.report("TriggerBase3D", "./TriggerBase3D", _context.meta, extras);
  }

  function _reportPossibleCrUseOfvectorPower(extras) {
    _reporterNs.report("vectorPower2", "../../../Tool/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfisFacingTargetHorizontal_vec(extras) {
    _reporterNs.report("isFacingTargetHorizontal_vec", "../../../Tool/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleTargetBase(extras) {
    _reporterNs.report("BattleTargetBase", "../Base/BattleTargetBase", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      BattleTarget3D = _unresolved_2.BattleTarget3D;
    }, function (_unresolved_3) {
      TriggerBase3D = _unresolved_3.TriggerBase3D;
    }, function (_unresolved_4) {
      vectorPower2 = _unresolved_4.vectorPower2;
      isFacingTargetHorizontal_vec = _unresolved_4.isFacingTargetHorizontal_vec;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6566bQ5ludIAZfA3CLxIObt", "CollectBattleTarger3D", undefined);

      __checkObsolete__(['_decorator', 'Collider2D', 'Component', 'floatToHalf', 'ITriggerEvent', 'math', 'Node', 'Vec3', 'WorldNode3DToLocalNodeUI']);

      ({
        ccclass,
        property
      } = _decorator);
      /**物理收集器    收集所有符合条件的 物体 */

      _export("CollectBattleTarger3D", CollectBattleTarger3D = (_dec = ccclass('CollectBattleTarger3D'), _dec(_class = class CollectBattleTarger3D extends (_crd && TriggerBase3D === void 0 ? (_reportPossibleCrUseOfTriggerBase3D({
        error: Error()
      }), TriggerBase3D) : TriggerBase3D) {
        constructor(...args) {
          super(...args);
          this._battleTargetList = [];
          this._fowerVe3 = new Vec3();
          this._vector = new Vec3();
          this._tempTargetList = [];
        }

        get attackR() {
          return this.attackCollide.radius;
        }

        get singleTarget() {
          return this._targetListClear();
        }

        get groupTarget() {
          this._targetListClear();

          if (this._battleTargetList.length) {
            return this._battleTargetList;
          } else {
            return null;
          }
        }

        _startCollide(event) {
          let battle = event.otherCollider.getComponent(_crd && BattleTarget3D === void 0 ? (_reportPossibleCrUseOfBattleTarget3D({
            error: Error()
          }), BattleTarget3D) : BattleTarget3D);

          if (battle) {
            if (this._battleTargetList.indexOf(battle) == -1) {
              this._battleTargetList.push(battle);
            }
          }
        }

        _EndCollide(event) {
          let battle = event.otherCollider.getComponent(_crd && BattleTarget3D === void 0 ? (_reportPossibleCrUseOfBattleTarget3D({
            error: Error()
          }), BattleTarget3D) : BattleTarget3D);

          if (battle) {
            let index = this._battleTargetList.indexOf(battle);

            if (index != -1) {
              this._battleTargetList.splice(index, 1);
            }
          }
        }
        /**清理一些已经死亡的  */


        _targetListClear() {
          let disd = Number.MAX_VALUE;
          let targetd = null;
          let pos = this.node.worldPosition;

          for (let i = this._battleTargetList.length - 1; i >= 0; i--) {
            let target = this._battleTargetList[i];

            if (target.isDie) {
              this._battleTargetList.splice(i, 1);
            } else {
              let dis = Vec3.distance(target.node.worldPosition, pos);

              if (dis > this.attackCollide.radius * 3) {
                this._battleTargetList.splice(i, 1);
              } else if (dis < disd) {
                disd = dis;
                targetd = target;
              }
            }
          }

          return targetd;
        }

        get isCanAttack() {
          return this._battleTargetList.length > 0;
        }

        groupTarget_scope(angle, rot) {
          const groupList = this.groupTarget;

          if (this.groupTarget) {
            this._tempTargetList.length = 0;
            Vec3.transformQuat(this._fowerVe3, Vec3.FORWARD, rot);
            const pos = this.node.getWorldPosition(this._vector);

            for (let i = 0; i < groupList.length; i++) {
              const target = groupList[i];
              const v = (_crd && vectorPower2 === void 0 ? (_reportPossibleCrUseOfvectorPower({
                error: Error()
              }), vectorPower2) : vectorPower2)(pos, target.node.worldPosition);

              if ((_crd && isFacingTargetHorizontal_vec === void 0 ? (_reportPossibleCrUseOfisFacingTargetHorizontal_vec({
                error: Error()
              }), isFacingTargetHorizontal_vec) : isFacingTargetHorizontal_vec)(v, this._fowerVe3, angle, false)) {
                this._tempTargetList.push(target);
              }
            }

            return this._tempTargetList;
          } else {
            return null;
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=c63a9309080cd8188a2befc0f64979e7667394f7.js.map