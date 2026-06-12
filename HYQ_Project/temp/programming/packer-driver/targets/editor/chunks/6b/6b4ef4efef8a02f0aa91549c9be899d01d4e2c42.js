System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, ParticleSystem, _dec, _class, _crd, ccclass, property, AttackParkPlay;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      ParticleSystem = _cc.ParticleSystem;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a3fc8UdESVEtapbC8WC1GAW", "AttackParkPlay", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'ParticleSystem']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("AttackParkPlay", AttackParkPlay = (_dec = ccclass('AttackParkPlay'), _dec(_class = class AttackParkPlay extends Component {
        constructor(...args) {
          super(...args);
          this.pratList = [];
        }

        onLoad() {
          let prat = this.node.getComponent(ParticleSystem);
          this.pratList.push(prat);
          let count = this.node.children.length;

          for (let i = 0; i < count; i++) {
            let prat = this.node.children[i].getComponent(ParticleSystem);
            this.pratList.push(prat);
          }
        }

        play() {
          for (let i = 0; i < this.pratList.length; i++) {
            this.pratList[i].stop();
            this.pratList[i].play();
          }
        }

        stop() {
          for (let i = 0; i < this.pratList.length; i++) {
            this.pratList[i].stop();
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6b4ef4efef8a02f0aa91549c9be899d01d4e2c42.js.map