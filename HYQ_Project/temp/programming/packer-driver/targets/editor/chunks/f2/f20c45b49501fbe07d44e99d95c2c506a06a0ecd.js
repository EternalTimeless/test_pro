System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, v3, Vec3, Singleton, PoolManager, _crd;

  function _reportPossibleCrUseOfSingleton(extras) {
    _reporterNs.report("Singleton", "./Singleton", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      v3 = _cc.v3;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      Singleton = _unresolved_2.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d7997kx1jNJkYEEUmDTQvvu", "PoolManager", undefined);

      __checkObsolete__(['ccenum', 'v3', 'Vec3']);

      _export("default", PoolManager = class PoolManager extends (_crd && Singleton === void 0 ? (_reportPossibleCrUseOfSingleton({
        error: Error()
      }), Singleton) : Singleton) {
        static get instance() {
          return this.getInstance();
        }

        constructor() {
          super();
          this._pool = void 0;
          this._ve3C = 0;
          this._pool = {};
        }
        /**
         * 获取缓存对象
         * @param key key=PoolEnum+当前Pool类型枚举     举例道具Key：PoolEnum.prop+PropEnum.gold
         * 
         * @returns 
         */


        getPool(key) {
          let arr = this._pool[key];

          if (!arr) {
            this._pool[key] = arr = [];
            return null;
          }

          if (arr.length) {
            const item = arr.pop();

            for (let i = arr.length - 1; i >= 0; i--) {
              if (arr[i] === item) {
                arr.splice(i, 1);
              }
            }

            return item;
          }

          return null;
        }
        /**
         * 将对象添加的缓存池
         * @param key key=PoolEnum+当前Pool类型枚举     举例道具Key：PoolEnum.prop+PropEnum.gold
         * @param node 添加的对象
         */


        setPool(key, node) {
          let arr = this._pool[key];

          if (!arr) {
            arr = this._pool[key] = [];
          }

          if (arr.indexOf(node) !== -1) {
            return;
          }

          arr.push(node);
        }

        getPoolSize(key) {
          const arr = this._pool[key];
          return arr ? arr.length : 0;
        }

        get V3() {
          const v = this.getPool('V3');
          this._ve3C--; // console.log("get" + this._ve3C);

          if (!v) {
            return v3(Vec3.ZERO);
          }

          return v.set(Vec3.ZERO);
        }

        set V3(v) {
          this._ve3C++; // console.log("set" + this._ve3C);

          this.setPool('V3', v);
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f20c45b49501fbe07d44e99d95c2c506a06a0ecd.js.map