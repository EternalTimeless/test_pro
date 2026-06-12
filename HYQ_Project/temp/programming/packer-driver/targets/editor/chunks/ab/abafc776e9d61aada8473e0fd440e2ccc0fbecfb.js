System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, UnityUpComponent, PropManager, _dec, _class, _class2, _crd, ccclass, property, FlayPropManager;

  function _reportPossibleCrUseOfUnityUpComponent(extras) {
    _reporterNs.report("UnityUpComponent", "../../Base/UnityUpComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIPropFly(extras) {
    _reporterNs.report("IPropFly", "../Bag/IPropFly", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPropManager(extras) {
    _reporterNs.report("PropManager", "../Bag/PropManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
    }, function (_unresolved_2) {
      UnityUpComponent = _unresolved_2.UnityUpComponent;
    }, function (_unresolved_3) {
      PropManager = _unresolved_3.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c2ed8m22pRHGb5rHozW9ICf", "FlayPropManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("FlayPropManager", FlayPropManager = (_dec = ccclass('FlayPropManager'), _dec(_class = (_class2 = class FlayPropManager extends (_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
        error: Error()
      }), UnityUpComponent) : UnityUpComponent) {
        constructor(...args) {
          super(...args);
          this._IfPList = [];
        }

        onLoad() {
          FlayPropManager.instacne = this;
        }

        _update(deltaTime) {
          // EffectManager.instance.frameReleaseSpecialEffects();
          const propList = (_crd && PropManager === void 0 ? (_reportPossibleCrUseOfPropManager({
            error: Error()
          }), PropManager) : PropManager).instance.propList;

          for (let i = propList.length - 1; i >= 0; i--) {
            const prop = propList[i];

            for (let j = 0; j < this._IfPList.length; j++) {
              const element = this._IfPList[j];
              const rameove = element.flyProp(prop);

              if (rameove) {
                propList.splice(i, 1);
                break;
              }
            }
          }

          this._IfPList = this.shuffleArray(this._IfPList);
        } // 定义工具函数


        shuffleArray(array) {
          const shuffled = array; // 创建数组副本（避免修改原数组）

          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // 生成随机索引 [0, i]

            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // 交换元素
          }

          return shuffled;
        }

        addIFlay(IfP) {
          let index = this._IfPList.indexOf(IfP);

          if (index == -1) {
            this._IfPList.unshift(IfP);
          }
        }

        removeIFlay(IfP) {
          let index = this._IfPList.indexOf(IfP);

          if (index != -1) {
            this._IfPList.splice(index, 1);
          }
        }

      }, _class2.instacne = void 0, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=abafc776e9d61aada8473e0fd440e2ccc0fbecfb.js.map