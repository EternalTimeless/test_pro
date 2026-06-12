System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, Singleton, _crd;

  _export("default", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3d237O8ESxJComfdJGBSyZw", "Singleton", undefined);

      _export("default", Singleton = class Singleton {
        static getInstance() {
          if (this._instance == null) {
            this._instance = new this();
          }

          return this._instance;
        }

      });

      Singleton._instance = null;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=06c55074c35931eabdfa896b78f184402baad30d.js.map