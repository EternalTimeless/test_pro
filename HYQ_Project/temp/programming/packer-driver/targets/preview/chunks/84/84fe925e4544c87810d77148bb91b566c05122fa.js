System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Vec3, v3, director, Director, CameraMove, PoolEnum, PrefabsEnum, LayerEnum, EventType, EventManager, LayerManager, PoolManager, PrefabsManager, Singleton, isPointInCameraView, distanceSquared, EffectTimePartRemove, EffectSequence, _dec, _class, _crd, ccclass, property, lDis, EffectManager;

  function _reportPossibleCrUseOfCameraMove(extras) {
    _reporterNs.report("CameraMove", "../../Base/CameraMove", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolEnum(extras) {
    _reporterNs.report("PoolEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPrefabsEnum(extras) {
    _reporterNs.report("PrefabsEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLayerEnum(extras) {
    _reporterNs.report("LayerEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEffectEnum(extras) {
    _reporterNs.report("EffectEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../../Base/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLayerManager(extras) {
    _reporterNs.report("LayerManager", "../../Base/LayerManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolManager(extras) {
    _reporterNs.report("PoolManager", "../../Base/PoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPrefabsManager(extras) {
    _reporterNs.report("PrefabsManager", "../../Base/PrefabsManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSingleton(extras) {
    _reporterNs.report("Singleton", "../../Base/Singleton", _context.meta, extras);
  }

  function _reportPossibleCrUseOfisPointInCameraView(extras) {
    _reporterNs.report("isPointInCameraView", "../../Tool/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfdistanceSquared(extras) {
    _reporterNs.report("distanceSquared", "../../Tool/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEffectTimePartRemove(extras) {
    _reporterNs.report("EffectTimePartRemove", "./EffectTimePartRemove", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Vec3 = _cc.Vec3;
      v3 = _cc.v3;
      director = _cc.director;
      Director = _cc.Director;
    }, function (_unresolved_2) {
      CameraMove = _unresolved_2.CameraMove;
    }, function (_unresolved_3) {
      PoolEnum = _unresolved_3.PoolEnum;
      PrefabsEnum = _unresolved_3.PrefabsEnum;
      LayerEnum = _unresolved_3.LayerEnum;
      EventType = _unresolved_3.EventType;
    }, function (_unresolved_4) {
      EventManager = _unresolved_4.default;
    }, function (_unresolved_5) {
      LayerManager = _unresolved_5.default;
    }, function (_unresolved_6) {
      PoolManager = _unresolved_6.default;
    }, function (_unresolved_7) {
      PrefabsManager = _unresolved_7.PrefabsManager;
    }, function (_unresolved_8) {
      Singleton = _unresolved_8.default;
    }, function (_unresolved_9) {
      isPointInCameraView = _unresolved_9.isPointInCameraView;
      distanceSquared = _unresolved_9.distanceSquared;
    }, function (_unresolved_10) {
      EffectTimePartRemove = _unresolved_10.EffectTimePartRemove;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "779f7onOFJLto5eHXxeFwFs", "EffectManager", undefined);

      __checkObsolete__(['_decorator', 'Vec3', 'v3', 'Node', 'director', 'Director']);

      ({
        ccclass,
        property
      } = _decorator);
      lDis = 1;

      _export("EffectManager", EffectManager = (_dec = ccclass('EffectManager'), _dec(_class = class EffectManager extends (_crd && Singleton === void 0 ? (_reportPossibleCrUseOfSingleton({
        error: Error()
      }), Singleton) : Singleton) {
        effectPlayOver(remove, effect) {
          var ef = this._effectShowListL[effect];

          if (ef) {
            var index = ef.indexOf(remove);

            if (index != -1) {
              ef.splice(index, 1);
            }
          }
        }

        constructor() {
          super();

          /** 帧回调引用 */
          this._directorCallback = void 0;
          this._effectListL = [];
          this._effectShowListL = [];
          this.coor = 0;
          this.frameCount = 5;
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).EFFECT_PLAY_OVER, this.effectPlayOver, this);
          this._directorCallback = this.frameReleaseSpecialEffects.bind(this);
          director.on(Director.EVENT_AFTER_UPDATE, this._directorCallback);
        }

        static get instance() {
          return this.getInstance();
        }
        /**
         * 
         * @param pos 特效显示的位置
         * @param poolType 回收类型
         * @param type 类型
         * @param angle 角度
         */


        addShowEffect(pos, type, scale) {
          if (scale === void 0) {
            scale = 1;
          }

          if (!(_crd && isPointInCameraView === void 0 ? (_reportPossibleCrUseOfisPointInCameraView({
            error: Error()
          }), isPointInCameraView) : isPointInCameraView)(pos, (_crd && CameraMove === void 0 ? (_reportPossibleCrUseOfCameraMove({
            error: Error()
          }), CameraMove) : CameraMove).instance.camera)) {
            return;
          }

          var ef = this._effectListL[type];

          if (!ef) {
            this._effectListL[type] = ef = [];
          }

          for (var i = 0; i < ef.length; i++) {
            var dis = (_crd && distanceSquared === void 0 ? (_reportPossibleCrUseOfdistanceSquared({
              error: Error()
            }), distanceSquared) : distanceSquared)(pos, ef[i].pos);

            if (dis <= lDis) {
              return;
            }
          }

          var sq = this.EffectSq;
          sq.scale = scale;
          sq.type = type;
          sq.pos.set(pos);

          this._effectListL[type].push(sq);
        }

        addShowEffect_2(pos, type, scale) {
          if (scale === void 0) {
            scale = 1;
          }

          if (!(_crd && isPointInCameraView === void 0 ? (_reportPossibleCrUseOfisPointInCameraView({
            error: Error()
          }), isPointInCameraView) : isPointInCameraView)(pos, (_crd && CameraMove === void 0 ? (_reportPossibleCrUseOfCameraMove({
            error: Error()
          }), CameraMove) : CameraMove).instance.camera)) {
            return;
          }

          var effect = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).effect + type);

          if (!effect) {
            effect = (_crd && PrefabsManager === void 0 ? (_reportPossibleCrUseOfPrefabsManager({
              error: Error()
            }), PrefabsManager) : PrefabsManager).instance.GetPrefabsIns((_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
              error: Error()
            }), PrefabsEnum) : PrefabsEnum).effect, type);
          }

          var layer = (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
            error: Error()
          }), LayerManager) : LayerManager).instance.getLayer((_crd && LayerEnum === void 0 ? (_reportPossibleCrUseOfLayerEnum({
            error: Error()
          }), LayerEnum) : LayerEnum).Layer_2_sky); // effect.setScale(scale, scale, scale);

          layer.addChild(effect);
          effect.setWorldPosition(pos);
          effect.active = true;
          effect.setScale(scale, scale, scale);
        }

        addShowEffect_3(node, type, scale) {
          if (scale === void 0) {
            scale = 1;
          }

          if (!(_crd && isPointInCameraView === void 0 ? (_reportPossibleCrUseOfisPointInCameraView({
            error: Error()
          }), isPointInCameraView) : isPointInCameraView)(node.worldPosition, (_crd && CameraMove === void 0 ? (_reportPossibleCrUseOfCameraMove({
            error: Error()
          }), CameraMove) : CameraMove).instance.camera)) {
            return;
          }

          var effect = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).effect + type);

          if (!effect) {
            effect = (_crd && PrefabsManager === void 0 ? (_reportPossibleCrUseOfPrefabsManager({
              error: Error()
            }), PrefabsManager) : PrefabsManager).instance.GetPrefabsIns((_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
              error: Error()
            }), PrefabsEnum) : PrefabsEnum).effect, type);
          } // effect.setScale(scale, scale, scale);


          node.addChild(effect);
          effect.setPosition(Vec3.ZERO);
          effect.active = true;
          effect.setScale(scale, scale, scale);
        }

        showEffect(sq) {
          var effect = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).effect + sq.type);

          if (!effect) {
            effect = (_crd && PrefabsManager === void 0 ? (_reportPossibleCrUseOfPrefabsManager({
              error: Error()
            }), PrefabsManager) : PrefabsManager).instance.GetPrefabsIns((_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
              error: Error()
            }), PrefabsEnum) : PrefabsEnum).effect, sq.type);
          }

          var layer = (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
            error: Error()
          }), LayerManager) : LayerManager).instance.getLayer((_crd && LayerEnum === void 0 ? (_reportPossibleCrUseOfLayerEnum({
            error: Error()
          }), LayerEnum) : LayerEnum).Layer_2_sky); // effect.setScale(scale, scale, scale);

          layer.addChild(effect);
          effect.setWorldPosition(sq.pos);
          effect.active = true;
          effect.setScale(sq.scale, sq.scale, sq.scale); // if (sq.type == EffectEnum.shopOver) {
          //     AudioManager.inst.playOneShot(SoundEnum.Sound_up);
          // }

          return effect;
        }

        /**需要在任意地方 循环调用 */
        frameReleaseSpecialEffects() {
          if (this._effectListL.length > 0) {
            for (var i = this.coor; i < this.frameCount; i++) {
              this._effectListL.forEach((sqList, type) => {
                if (sqList && sqList.length) {
                  var sq = sqList.shift();
                  var isShow = true;
                  var showArr = this._effectShowListL[type];

                  if (!showArr) {
                    this._effectShowListL[type] = showArr = [];
                  }

                  for (var _i = 0; _i < showArr.length; _i++) {
                    var dis = (_crd && distanceSquared === void 0 ? (_reportPossibleCrUseOfdistanceSquared({
                      error: Error()
                    }), distanceSquared) : distanceSquared)(sq.pos, showArr[_i].node.worldPosition);

                    if (dis <= lDis) {
                      isShow = false;
                      break;
                    }
                  }

                  if (isShow) {
                    var effNode = this.showEffect(sq);
                    var er = effNode.getComponent(_crd && EffectTimePartRemove === void 0 ? (_reportPossibleCrUseOfEffectTimePartRemove({
                      error: Error()
                    }), EffectTimePartRemove) : EffectTimePartRemove);
                    showArr.push(er);
                  }

                  (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                    error: Error()
                  }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
                    error: Error()
                  }), PoolEnum) : PoolEnum).EffectSq, sq);
                }
              });
            }
          }
        }

        get EffectSq() {
          var sq = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).EffectSq);

          if (!sq) {
            sq = new EffectSequence();
          }

          return sq;
        }

      }) || _class));

      EffectSequence = class EffectSequence {
        constructor() {
          this.type = void 0;
          this.pos = v3();
          this.scale = 1;
        }

      };

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=84fe925e4544c87810d77148bb91b566c05122fa.js.map