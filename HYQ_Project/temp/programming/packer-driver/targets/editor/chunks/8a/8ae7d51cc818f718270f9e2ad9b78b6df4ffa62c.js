System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, _dec, _class, _class2, _crd, ccclass, property, UnityUpComponent;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f0f4eWjBs5NZIuc3egTORus", "UnityUpComponent", undefined);

      __checkObsolete__(['_decorator', 'Component']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UnityUpComponent", UnityUpComponent = (_dec = ccclass('UnityUpComponent'), _dec(_class = (_class2 = class UnityUpComponent extends Component {
        constructor(...args) {
          super(...args);
          this._scale = 1;
        }

        set scale(value) {
          this._scale = value;
          this._scale = Math.max(0, this._scale);
          this._scale = Math.min(1, this._scale);
        }

        update(dt) {
          //控制自己所有脚本的 更新 
          if (UnityUpComponent.isStop) {
            return;
          }

          this._update(dt);
        }

      }, _class2.isStop = false, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8ae7d51cc818f718270f9e2ad9b78b6df4ffa62c.js.map