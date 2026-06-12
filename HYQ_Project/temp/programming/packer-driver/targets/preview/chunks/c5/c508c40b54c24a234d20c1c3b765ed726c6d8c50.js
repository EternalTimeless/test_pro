System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, SkeletalAnimation, _dec, _class, _crd, ccclass, property, FbxManager;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      SkeletalAnimation = _cc.SkeletalAnimation;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6f259WVWu5B2JBJ1xiPoeeK", "FbxManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'SkeletalAnimation']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("FbxManager", FbxManager = (_dec = ccclass('FbxManager'), _dec(_class = class FbxManager extends Component {
        constructor() {
          super(...arguments);
          this._animName = [];
          this._cur = -1;
          this._skeleta = void 0;
          this.func = void 0;
          this.ctx = void 0;
        }

        start() {}

        init() {
          this._cur = -1;
        }

        get skeleta() {
          if (!this._skeleta) {
            this._skeleta = this.node.getComponent(SkeletalAnimation);
            var clips = this._skeleta.clips;

            for (var i = 0; i < clips.length; i++) {
              var name = clips[i].name;
              this._animName[i] = name;
            }
          }

          return this._skeleta;
        }

        setAnimation(skT, loop, frame) {
          if (loop === void 0) {
            loop = true;
          }

          if (frame === void 0) {
            frame = 0;
          }

          var sk = this.skeleta;
          var aniName = this._animName[skT];
          var animState = sk.getState(aniName);

          if (this._cur == skT) {
            if (!loop || !animState.isPlaying) {
              var time = frame * animState.duration;
              sk.crossFade(aniName, 0.2);
              animState.setTime(time);
            }
          } else {
            if (this._cur != -1) {
              var caniName = this._animName[this._cur];
              var canimState = sk.getState(caniName);
              canimState.stop();
            }

            sk.crossFade(aniName, 0.2);

            if (animState) {
              var _time = frame * animState.duration; // animState.play();


              animState.setTime(_time);
            }

            this._cur = skT;
          }

          return animState;
        }

        getAnimState(skT) {
          var sk = this.skeleta;
          var aniName = this._animName[skT];
          var animState = sk.getState(aniName);
          return animState;
        }

        isCurAnimation(skT) {
          return this._cur == skT;
        }

        setAttackAnimCall(func, ctx) {
          this.func = func;
          this.ctx = ctx;
        }

        attack(num) {
          var _this$func, _this$func2;

          // EventManager.instance.emit(EventEnum.Tower_Hero_Attack + this.towerId, num);
          this.ctx ? (_this$func = this.func) == null ? void 0 : _this$func.apply(this.ctx, [num]) : (_this$func2 = this.func) == null ? void 0 : _this$func2.call(this, [num]);
        }

        get curState() {
          return this._cur;
        }

        set Rotation_x(value) {
          this.node.setRotationFromEuler(value * 30, 0, 0);
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=c508c40b54c24a234d20c1c3b765ed726c6d8c50.js.map