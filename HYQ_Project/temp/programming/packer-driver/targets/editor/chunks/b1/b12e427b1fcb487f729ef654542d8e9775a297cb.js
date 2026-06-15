System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, AttackState, _crd;

  _export("default", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ae0a6tXVNZFPbPpVoHaID10", "AttackState", undefined);

      _export("default", AttackState = class AttackState {
        constructor() {
          /**是否可以攻击 */
          this.canAttack = false;

          /**攻击中 */
          this.attackIn = false;

          /**是否在移动 */
          this.moveIn = false;

          /**是否在释放技能 */
          this.skillIn = false;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b12e427b1fcb487f729ef654542d8e9775a297cb.js.map