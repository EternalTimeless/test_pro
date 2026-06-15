System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, Singleton, EventManager, _crd;

  function _reportPossibleCrUseOfSingleton(extras) {
    _reporterNs.report("Singleton", "../Base/Singleton", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      Singleton = _unresolved_2.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "766e7jodl9NvJD1NVCKRkH/", "EventManager", undefined);

      _export("default", EventManager = class EventManager extends (_crd && Singleton === void 0 ? (_reportPossibleCrUseOfSingleton({
        error: Error()
      }), Singleton) : Singleton) {
        static get instance() {
          return this.getInstance();
        }

        constructor() {
          super();
          this._eventDic = new Map();
        }

        on(eventName, func, ctx, once = false) {
          if (this._eventDic.has(eventName)) {
            this._eventDic.get(eventName).push({
              func: func,
              ctx: ctx,
              once: once
            });
          } else {
            this._eventDic.set(eventName, [{
              func: func,
              ctx: ctx,
              once: once
            }]);
          }
        }

        off(eventName, func) {
          if (this._eventDic.has(eventName)) {
            let funcList = this._eventDic.get(eventName);

            let index = funcList.findIndex(i => i.func === func);
            index > -1 && funcList.splice(index, 1);
          }
        }

        emit(eventName, ...parmas) {
          if (this._eventDic.has(eventName)) {
            let funcList = this._eventDic.get(eventName);

            let onceList = [];
            funcList.forEach(({
              func,
              ctx,
              once
            }, index) => {
              ctx ? func.apply(ctx, parmas) : func(...parmas);
              once ? onceList.push(index) : null;
            });

            if (onceList.length) {
              for (let i = onceList.length - 1; i >= 0; i--) {
                let index = onceList[i];
                funcList.splice(index, 1);
              }
            }
          }
        }

        clear() {
          this._eventDic.clear();
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3fc33806253ded99e50ac9220c73832ef2904ca7.js.map