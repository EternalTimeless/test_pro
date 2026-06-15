System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Vec3, TriggerBase2D, BattleTarget2D, _dec, _class, _crd, ccclass, property, CollectBattleTarger2D;

  function _reportPossibleCrUseOfTriggerBase2D(extras) {
    _reporterNs.report("TriggerBase2D", "./TriggerBase2D", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleTarget2D(extras) {
    _reporterNs.report("BattleTarget2D", "../BattleTarger/BattleTarget2D", _context.meta, extras);
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
      TriggerBase2D = _unresolved_2.TriggerBase2D;
    }, function (_unresolved_3) {
      BattleTarget2D = _unresolved_3.BattleTarget2D;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a668cb/dfVIMZMRsbs3v2zN", "CollectBattleTarger2D", undefined);

      __checkObsolete__(['_decorator', 'Collider2D', 'Component', 'floatToHalf', 'math', 'Node', 'Vec3', 'WorldNode3DToLocalNodeUI']);

      ({
        ccclass,
        property
      } = _decorator);
      /**物理收集器    收集所有符合条件的 物体 */

      _export("CollectBattleTarger2D", CollectBattleTarger2D = (_dec = ccclass('CollectBattleTarger2D'), _dec(_class = class CollectBattleTarger2D extends (_crd && TriggerBase2D === void 0 ? (_reportPossibleCrUseOfTriggerBase2D({
        error: Error()
      }), TriggerBase2D) : TriggerBase2D) {
        constructor() {
          super(...arguments);
          this._battleTargetList = [];
        }

        groupTarget_scope(angle, rot) {
          return null;
        }

        get attackR() {
          return this.attackCollide.radius;
        }

        get singleTarget() {
          this._targetListClear();

          if (this._battleTargetList.length) {
            var pos = this.node.worldPosition;
            var target = this._battleTargetList[0];
            var dis = Vec3.distance(pos, target.node.worldPosition);

            for (var i = 1; i < this._battleTargetList.length; i++) {
              var tempTarget = this._battleTargetList[i];
              var d = Vec3.distance(pos, tempTarget.node.worldPosition);

              if (d < dis) {
                dis = d;
                target = tempTarget;
              }
            }

            return target;
          } else {
            return null;
          }
        }

        get groupTarget() {
          this._targetListClear();

          if (this._battleTargetList.length) {
            return this._battleTargetList;
          } else {
            return null;
          }
        }

        _startCollide(other) {
          var battle = other.getComponent(_crd && BattleTarget2D === void 0 ? (_reportPossibleCrUseOfBattleTarget2D({
            error: Error()
          }), BattleTarget2D) : BattleTarget2D);

          if (this._battleTargetList.indexOf(battle) == -1) {
            this._battleTargetList.push(battle);
          }
        }

        _EndCollide(other) {
          var battle = other.getComponent(_crd && BattleTarget2D === void 0 ? (_reportPossibleCrUseOfBattleTarget2D({
            error: Error()
          }), BattleTarget2D) : BattleTarget2D);

          var index = this._battleTargetList.indexOf(battle);

          if (index != -1) {
            this._battleTargetList.splice(index, 1);
          }
        }
        /**清理一些已经死亡的  */


        _targetListClear() {
          var pos = this.node.worldPosition;

          for (var i = this._battleTargetList.length - 1; i >= 0; i--) {
            var target = this._battleTargetList[i];

            if (target.isDie) {
              this._battleTargetList.splice(i, 1);
            } else {
              var dis = Vec3.distance(target.node.worldPosition, pos);

              if (dis > this.attackCollide.radius * 2) {
                this._battleTargetList.splice(i, 1);
              }
            }
          }
        }

        get isCanAttack() {
          return this._battleTargetList.length > 0;
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0510980ff6e9ad26ec622e2230780bc7f1d96f08.js.map