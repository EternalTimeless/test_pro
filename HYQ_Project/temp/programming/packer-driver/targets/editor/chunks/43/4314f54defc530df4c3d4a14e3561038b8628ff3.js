System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, PoolEnum, PrefabsEnum, PoolManager, PrefabsManager, Singleton, BulletBattle3D, BulletBattle2D, BulletManager, _crd;

  function _reportPossibleCrUseOfBulletEnum(extras) {
    _reporterNs.report("BulletEnum", "db://assets/Script/Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolEnum(extras) {
    _reporterNs.report("PoolEnum", "db://assets/Script/Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPrefabsEnum(extras) {
    _reporterNs.report("PrefabsEnum", "db://assets/Script/Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolManager(extras) {
    _reporterNs.report("PoolManager", "db://assets/Script/Base/PoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPrefabsManager(extras) {
    _reporterNs.report("PrefabsManager", "db://assets/Script/Base/PrefabsManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSingleton(extras) {
    _reporterNs.report("Singleton", "db://assets/Script/Base/Singleton", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletBattle3D(extras) {
    _reporterNs.report("BulletBattle3D", "./Battle3D/Bullet/BulletBattle3D", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletBattle2D(extras) {
    _reporterNs.report("BulletBattle2D", "./Battle2D/Bullet/BulletBattle2D", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
    }, function (_unresolved_2) {
      PoolEnum = _unresolved_2.PoolEnum;
      PrefabsEnum = _unresolved_2.PrefabsEnum;
    }, function (_unresolved_3) {
      PoolManager = _unresolved_3.default;
    }, function (_unresolved_4) {
      PrefabsManager = _unresolved_4.PrefabsManager;
    }, function (_unresolved_5) {
      Singleton = _unresolved_5.default;
    }, function (_unresolved_6) {
      BulletBattle3D = _unresolved_6.default;
    }, function (_unresolved_7) {
      BulletBattle2D = _unresolved_7.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "77055F7mqxGTKxT5Thp+szf", "BulletManager", undefined);

      __checkObsolete__(['math']);

      _export("default", BulletManager = class BulletManager extends (_crd && Singleton === void 0 ? (_reportPossibleCrUseOfSingleton({
        error: Error()
      }), Singleton) : Singleton) {
        static get instance() {
          return this.getInstance();
        }
        /**
         * 
         * @param bulletEnum 子弹类型
         * @param angle 角度
         * @param damage 伤害
         * @param repelPower 击退力度
         * @returns 
         */


        shootBullet(bulletEnum, angle, damage, repelPower) {
          let bullet = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).bullet + bulletEnum);

          if (!bullet) {
            let node = (_crd && PrefabsManager === void 0 ? (_reportPossibleCrUseOfPrefabsManager({
              error: Error()
            }), PrefabsManager) : PrefabsManager).instance.GetPrefabsIns((_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
              error: Error()
            }), PrefabsEnum) : PrefabsEnum).bullet, bulletEnum);
            bullet = node.getComponent(_crd && BulletBattle2D === void 0 ? (_reportPossibleCrUseOfBulletBattle2D({
              error: Error()
            }), BulletBattle2D) : BulletBattle2D);
          }

          bullet.setBulletInfo(angle, damage, repelPower);
          bullet.node.active = true;
          return bullet;
        }
        /**
         * 
         * @param bulletEnum 子弹类型
         * @param rot 角度
         * @param damage 伤害
         * @param repelPower 击退力度
         * @returns 
        */


        shootBullet3D(bulletEnum, rot, damage, repelPower) {
          let bullet = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).bullet + bulletEnum);

          if (!bullet) {
            let node = (_crd && PrefabsManager === void 0 ? (_reportPossibleCrUseOfPrefabsManager({
              error: Error()
            }), PrefabsManager) : PrefabsManager).instance.GetPrefabsIns((_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
              error: Error()
            }), PrefabsEnum) : PrefabsEnum).bullet, bulletEnum);
            bullet = node.getComponent(_crd && BulletBattle3D === void 0 ? (_reportPossibleCrUseOfBulletBattle3D({
              error: Error()
            }), BulletBattle3D) : BulletBattle3D);
          }

          bullet.setBulletInfo(rot, damage, repelPower);
          bullet.node.active = true;
          return bullet;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4314f54defc530df4c3d4a14e3561038b8628ff3.js.map