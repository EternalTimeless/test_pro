System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, JumpSequenceBase, _crd;

  _export("default", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d8070FYe1lI/rjkWyAJ/6Ti", "JumpSequenceBase", undefined);

      __checkObsolete__(['Node', 'Vec3']);

      _export("default", JumpSequenceBase = class JumpSequenceBase {
        constructor() {
          this._time = 0;
          this.callFunc = [];
          this.target = [];
          this.delayedTime = 0;
          this._endPowPreFunc = void 0;
          this._endPowPreTarget = void 0;
        }

        moveOver(dt) {
          if (this.delayedTime <= 0) {
            if (this.move(dt)) {
              this.call();
              return true;
            } else {
              return false;
            }
          } else {
            this.delayedTime -= dt;
            return false;
          }
        }

        remove() {
          this.callFunc.length = 0;
          this.target.length = 0;
          this.delayedTime = 0;
          this._endPowPreFunc = null;
          this._endPowPreTarget = null;

          this._remove();
        }

        /**
         * 添加  运动完成之后的回调函数  可添加多个
         * @param callFunc 回调函数
         * @param target 域
         */
        // 定义一个公共方法，用于在任务完成后调用指定的函数
        onComplete(callFunc, target) {
          // 将传入的函数添加到callFunc数组中
          this.callFunc[this.callFunc.length] = callFunc; // 将传入的目标对象添加到target数组中

          this.target[this.callFunc.length] = target; // 返回当前对象

          return this;
        }
        /**
         * 设置多长时间后  开始运动
         * @param time 延迟时间
         */


        setDelay(time) {
          this.delayedTime = time;
          return this;
        }

        call() {
          for (var j = 0; j < this.callFunc.length; j++) {
            var call = this.callFunc[j];
            var target = this.target[j];
            call.apply(target);
          }
        }

        setEndPosPre(func, target) {
          this._endPowPreFunc = func;
          this._endPowPreTarget = target;
        }

        endPosPre(node) {
          if (this._endPowPreFunc) {
            this._endPowPreFunc.apply(this._endPowPreTarget, [node]);
          }
        }

        get isMoveOver() {
          return this._time == 1;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b32718bbcb1984f2583e72e298374a7c207edf04.js.map