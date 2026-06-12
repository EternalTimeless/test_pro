System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, resources, SpriteAtlas, Singleton, FrameAnimEnum, AnimName, _dec, _class, _crd, ccclass, property, FrameAnimManager;

  function _reportPossibleCrUseOfSingleton(extras) {
    _reporterNs.report("Singleton", "../../../Base/Singleton", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFrameAnimEnum(extras) {
    _reporterNs.report("FrameAnimEnum", "../../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAnimName(extras) {
    _reporterNs.report("AnimName", "../../../Base/EnumList", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      resources = _cc.resources;
      SpriteAtlas = _cc.SpriteAtlas;
    }, function (_unresolved_2) {
      Singleton = _unresolved_2.default;
    }, function (_unresolved_3) {
      FrameAnimEnum = _unresolved_3.FrameAnimEnum;
      AnimName = _unresolved_3.AnimName;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "14b83kcrHRKbJsTa3KTEoYN", "FrameAnimManager", undefined);

      __checkObsolete__(['_decorator', 'animation', 'ccenum', 'Component', 'Node', 'resources', 'SpriteAtlas', 'SpriteFrame']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("FrameAnimManager", FrameAnimManager = (_dec = ccclass('FrameAnimManager'), _dec(_class = class FrameAnimManager extends (_crd && Singleton === void 0 ? (_reportPossibleCrUseOfSingleton({
        error: Error()
      }), Singleton) : Singleton) {
        constructor(...args) {
          super(...args);
          this._frameAnimSpriteAtlas = {};
          this._frameAnimEnumTbl = {
            [(_crd && FrameAnimEnum === void 0 ? (_reportPossibleCrUseOfFrameAnimEnum({
              error: Error()
            }), FrameAnimEnum) : FrameAnimEnum).LittleBlueMan]: [(_crd && AnimName === void 0 ? (_reportPossibleCrUseOfAnimName({
              error: Error()
            }), AnimName) : AnimName).idle, (_crd && AnimName === void 0 ? (_reportPossibleCrUseOfAnimName({
              error: Error()
            }), AnimName) : AnimName).run, (_crd && AnimName === void 0 ? (_reportPossibleCrUseOfAnimName({
              error: Error()
            }), AnimName) : AnimName).attack]
          };
        }

        static get instance() {
          return this.getInstance();
        }

        init() {
          for (let key in this._frameAnimEnumTbl) {
            let faEnum = parseInt(key);
            let animArr = this._frameAnimEnumTbl[faEnum];
            this._frameAnimSpriteAtlas[faEnum] = {};

            for (let anim of animArr) {
              if (anim) {
                this._frameAnimSpriteAtlas[faEnum][anim] = [];
                let angle = 0;

                for (let j = 0; j < 5; j++) {
                  let an = angle;
                  let str = `FrameAnim/man_${faEnum}/${anim}/${an}`;
                  resources.load(str, SpriteAtlas, (err, atlas) => {
                    if (atlas) {
                      let ag = an;
                      let k = faEnum;
                      let a = anim;
                      let sfOld = atlas.getSpriteFrames();
                      this._frameAnimSpriteAtlas[k][a][ag] = sfOld;
                    }
                  });
                  angle += 45;
                }
              }
            }
          }
        }

        getFrameAnimSpriteAtlas(faEnum, anim, angle) {
          let ag = angle;
          let k = faEnum;
          let a = anim;
          let sfArr = this._frameAnimSpriteAtlas[k][a][ag];
          return sfArr;
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=83c1ee5a4c5ea755d1c5195df7a5467f8d37d1be.js.map