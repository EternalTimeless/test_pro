System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, AnimationClip, Component, SkeletalAnimation, _dec, _class, _crd, ccclass, property, FbxManager;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      AnimationClip = _cc.AnimationClip;
      Component = _cc.Component;
      SkeletalAnimation = _cc.SkeletalAnimation;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6f259WVWu5B2JBJ1xiPoeeK", "FbxManager", undefined);

      __checkObsolete__(['_decorator', 'AnimationClip', 'AnimationState', 'Component', 'SkeletalAnimation']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("FbxManager", FbxManager = (_dec = ccclass('FbxManager'), _dec(_class = class FbxManager extends Component {
        constructor(...args) {
          super(...args);
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
            let clips = this._skeleta.clips;

            for (let i = 0; i < clips.length; i++) {
              let name = clips[i].name;
              this._animName[i] = name;
            }
          }

          return this._skeleta;
        }

        removeInvalidSockets() {
          const sk = this.skeleta;
          const validSockets = sk.sockets.filter(socket => {
            var _socket$target;

            return !!(socket != null && socket.path) && !!((_socket$target = socket.target) != null && _socket$target.isValid);
          });

          if (validSockets.length !== sk.sockets.length) {
            sk.sockets = validSockets;
          }
        }

        replaceAnimationClip(skT, clip) {
          if (!clip) {
            return false;
          }

          const sk = this.skeleta;
          const clips = sk.clips.slice();

          if (skT < 0 || skT >= clips.length) {
            return false;
          }

          if (clips[skT] === clip) {
            this._animName[skT] = clip.name;
            return true;
          }

          const oldClip = clips[skT];
          clips[skT] = clip;
          sk.clips = clips;

          if (sk.defaultClip === oldClip) {
            sk.defaultClip = clip;
          }

          this._animName.length = 0;

          for (let i = 0; i < sk.clips.length; i++) {
            const item = sk.clips[i];
            this._animName[i] = item ? item.name : '';
          }

          if (this._cur === skT) {
            this._cur = -1;
          }

          return true;
        }

        setAnimation(skT, loop = true, frame = 0) {
          const sk = this.skeleta;
          let aniName = this._animName[skT];
          let animState = sk.getState(aniName);

          if (!animState) {
            return animState;
          }

          this.applyWrapMode(animState, loop);

          if (this._cur == skT) {
            if (!loop || !animState.isPlaying) {
              let time = frame * animState.duration;
              sk.crossFade(aniName, 0.2);
              animState.setTime(time);
            }
          } else {
            if (this._cur != -1) {
              let caniName = this._animName[this._cur];
              let canimState = sk.getState(caniName);
              canimState.stop();
            }

            sk.crossFade(aniName, 0.2);

            if (animState) {
              let time = frame * animState.duration; // animState.play();

              animState.setTime(time);
            }

            this._cur = skT;
          }

          return animState;
        }

        setAnimationImmediate(skT, loop = true, frame = 0) {
          const sk = this.skeleta;
          const aniName = this._animName[skT];
          const animState = sk.getState(aniName);

          if (!animState) {
            return animState;
          }

          this.applyWrapMode(animState, loop);

          if (this._cur != -1 && this._cur != skT) {
            const curName = this._animName[this._cur];
            const curState = sk.getState(curName);
            curState == null || curState.stop();
          }

          sk.crossFade(aniName, 0);
          animState.setTime(frame * animState.duration);
          animState.speed = 1;
          this._cur = skT;
          return animState;
        }

        applyWrapMode(animState, loop) {
          const wrapMode = loop ? AnimationClip.WrapMode.Loop : AnimationClip.WrapMode.Normal;

          if (animState.wrapMode !== wrapMode) {
            animState.wrapMode = wrapMode;
          }
        }

        getAnimState(skT) {
          const sk = this.skeleta;
          let aniName = this._animName[skT];
          let animState = sk.getState(aniName);
          return animState;
        }

        prewarmAnimations() {
          const sk = this.skeleta;

          for (let i = 0; i < this._animName.length; i++) {
            const aniName = this._animName[i];

            if (!aniName) {
              continue;
            }

            const animState = sk.getState(aniName);

            if (!animState) {
              continue;
            }

            sk.crossFade(aniName, 0);
            animState.setTime(0);
            animState.stop();
          }

          this._cur = -1;
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
        /** 仅用于不含玩法事件的循环动画降频；攻击和死亡动画不要关闭。 */


        setSkeletalAnimationEnabled(enabled) {
          this.skeleta.enabled = enabled;
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
//# sourceMappingURL=6b5ef849a8a91f0cd956b88818795e47d9431e29.js.map