System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, UITransform, _dec, _class, _crd, ccclass, property, RockerUI;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      UITransform = _cc.UITransform;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "dff78l+cdFLKIIZFXNniEaT", "RockerUI", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Event', 'EventTouch', 'log', 'Node', 'Sprite', 'UITransform', 'Vec2']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("RockerUI", RockerUI = (_dec = ccclass('RockerUI'), _dec(_class = class RockerUI extends Component {
        constructor(...args) {
          super(...args);
          this.r_node = void 0;
          this._tran = void 0;
        }

        start() {
          this._tran = this.node.getComponent(UITransform);
          this.enabled = false;
        }

        get tran() {
          if (this._tran == null) {
            this._tran = this.node.getComponent(UITransform);
          }

          return this._tran;
        }

        set pos(v2) {
          this.node.setPosition(v2.x, v2.y, 0);
        }

        set rPos(v2) {
          if (!this.r_node) {
            this.r_node = this.node.getChildByName("Rocker_");
          }

          this.r_node.setPosition(v2.x, v2.y, 0);
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1ae0a943cb89447b9ce0890daa8daf724a297dc0.js.map