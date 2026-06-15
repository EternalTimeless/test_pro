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
        constructor() {
          super(...arguments);
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
          var _this = this;

          var _loop = function _loop() {
            var faEnum = parseInt(_key);
            var animArr = _this._frameAnimEnumTbl[faEnum];
            _this._frameAnimSpriteAtlas[faEnum] = {};

            var _loop2 = function _loop2(_anim) {
              if (_anim) {
                _this._frameAnimSpriteAtlas[faEnum][_anim] = [];
                var _angle = 0;

                var _loop3 = function _loop3() {
                  var an = _angle;
                  var str = "FrameAnim/man_" + faEnum + "/" + _anim + "/" + an;
                  resources.load(str, SpriteAtlas, (err, atlas) => {
                    if (atlas) {
                      var ag = an;
                      var k = faEnum;
                      var a = _anim;
                      var sfOld = atlas.getSpriteFrames();
                      _this._frameAnimSpriteAtlas[k][a][ag] = sfOld;
                    }
                  });
                  _angle += 45;
                };

                for (var j = 0; j < 5; j++) {
                  _loop3();
                }
              }
            };

            for (var _anim of animArr) {
              _loop2(_anim);
            }
          };

          for (var _key in this._frameAnimEnumTbl) {
            _loop();
          }
        }

        getFrameAnimSpriteAtlas(faEnum, anim, angle) {
          var ag = angle;
          var k = faEnum;
          var a = anim;
          var sfArr = this._frameAnimSpriteAtlas[k][a][ag];
          return sfArr;
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b8ff2efe0a5ef0b3134c1c0a100a2fc7e48d38e3.js.map