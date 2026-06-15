System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, v3, Vec3, Singleton, Prop, getPosRandomPos, PoolEnum, PrefabsEnum, LayerEnum, LayerManager, PoolManager, PrefabsManager, JumpManager, PropManager, _crd;

  function _reportPossibleCrUseOfSingleton(extras) {
    _reporterNs.report("Singleton", "../../Base/Singleton", _context.meta, extras);
  }

  function _reportPossibleCrUseOfProp(extras) {
    _reporterNs.report("Prop", "./Prop", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetPosRandomPos(extras) {
    _reporterNs.report("getPosRandomPos", "../../Tool/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPropEnum(extras) {
    _reporterNs.report("PropEnum", "../../Base/EnumList", _context.meta, extras);
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

  function _reportPossibleCrUseOfLayerManager(extras) {
    _reporterNs.report("LayerManager", "../../Base/LayerManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolManager(extras) {
    _reporterNs.report("PoolManager", "../../Base/PoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPrefabsManager(extras) {
    _reporterNs.report("PrefabsManager", "../../Base/PrefabsManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfJumpManager(extras) {
    _reporterNs.report("JumpManager", "../Jump/JumpManager", _context.meta, extras);
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
    }, function (_unresolved_3) {
      Prop = _unresolved_3.Prop;
    }, function (_unresolved_4) {
      getPosRandomPos = _unresolved_4.getPosRandomPos;
    }, function (_unresolved_5) {
      PoolEnum = _unresolved_5.PoolEnum;
      PrefabsEnum = _unresolved_5.PrefabsEnum;
      LayerEnum = _unresolved_5.LayerEnum;
    }, function (_unresolved_6) {
      LayerManager = _unresolved_6.default;
    }, function (_unresolved_7) {
      PoolManager = _unresolved_7.default;
    }, function (_unresolved_8) {
      PrefabsManager = _unresolved_8.PrefabsManager;
    }, function (_unresolved_9) {
      JumpManager = _unresolved_9.JumpManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "781923kQZ1HPrV9/Y9PxTYb", "PropManager", undefined);

      __checkObsolete__(['v3', 'Vec3']);

      _export("default", PropManager = class PropManager extends (_crd && Singleton === void 0 ? (_reportPossibleCrUseOfSingleton({
        error: Error()
      }), Singleton) : Singleton) {
        constructor() {
          super(...arguments);
          this._propList = [];
        }

        static get instance() {
          return this.getInstance();
        }

        getProp(id) {
          var prop = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).Prop + id);

          if (!prop) {
            var node = (_crd && PrefabsManager === void 0 ? (_reportPossibleCrUseOfPrefabsManager({
              error: Error()
            }), PrefabsManager) : PrefabsManager).instance.GetPrefabsIns((_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
              error: Error()
            }), PrefabsEnum) : PrefabsEnum).prop, id);
            prop = node.getComponent(_crd && Prop === void 0 ? (_reportPossibleCrUseOfProp({
              error: Error()
            }), Prop) : Prop);
          }

          prop.node.active = true;
          prop.node.setScale(Vec3.ONE);
          prop.propID = id;
          return prop;
        }

        createProp(pos, count, propId) {
          var _this = this;

          var layer = (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
            error: Error()
          }), LayerManager) : LayerManager).instance.getLayer((_crd && LayerEnum === void 0 ? (_reportPossibleCrUseOfLayerEnum({
            error: Error()
          }), LayerEnum) : LayerEnum).Layer_2_sky);

          var _loop = function _loop() {
            var prop = _this.getProp(propId);

            layer.addChild(prop.node);
            prop.node.setWorldPosition(pos);
            var endpos = (_crd && getPosRandomPos === void 0 ? (_reportPossibleCrUseOfgetPosRandomPos({
              error: Error()
            }), getPosRandomPos) : getPosRandomPos)(pos, 5, Vec3.ZERO, v3(1, 0, 1));
            (_crd && JumpManager === void 0 ? (_reportPossibleCrUseOfJumpManager({
              error: Error()
            }), JumpManager) : JumpManager).instance.jumpCurve(prop.node, endpos, 3, 3).onComplete(() => {
              _this._propList.push(prop);
            });
          };

          for (var i = 0; i < count; i++) {
            _loop();
          }
        }

        get propList() {
          return this._propList;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=5fdfd08a9c16dc742e66ef16a5a8e13f5f831a3e.js.map