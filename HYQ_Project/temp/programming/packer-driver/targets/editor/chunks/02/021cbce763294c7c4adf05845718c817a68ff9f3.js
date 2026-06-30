System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, MeshRenderer, Node, HpComponent, FlashRedManager, UnityUpComponent, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class4, _class5, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _dec12, _dec13, _dec14, _dec15, _class7, _class8, _descriptor10, _descriptor11, _descriptor12, _dec16, _dec17, _dec18, _dec19, _dec20, _class10, _class11, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _crd, ccclass, property, BattleStateEvent, MeshFlashPropData, MeshFlashSwitchData, MeshFlashData, BattleTargetBase;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfHpComponent(extras) {
    _reporterNs.report("HpComponent", "../HpComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFlashRedManager(extras) {
    _reporterNs.report("FlashRedManager", "./FlashRedManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnityUpComponent(extras) {
    _reporterNs.report("UnityUpComponent", "../../../Base/UnityUpComponent", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CCFloat = _cc.CCFloat;
      MeshRenderer = _cc.MeshRenderer;
      Node = _cc.Node;
    }, function (_unresolved_2) {
      HpComponent = _unresolved_2.HpComponent;
    }, function (_unresolved_3) {
      FlashRedManager = _unresolved_3.FlashRedManager;
    }, function (_unresolved_4) {
      UnityUpComponent = _unresolved_4.UnityUpComponent;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a9926RS2OlH3KGBGfeaOhSO", "BattleTargetBase", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'Color', 'Component', 'MeshRenderer', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BattleStateEvent", BattleStateEvent = {
        damage: 'damage',
        die: 'die'
      });
      /**
       * 闪红单个属性配置
       */


      _export("MeshFlashPropData", MeshFlashPropData = (_dec = ccclass('MeshFlashPropData'), _dec2 = property({
        tooltip: '材质颜色属性名，如 emissive、mainColor、albedo、baseColor'
      }), _dec3 = property({
        tooltip: '该属性所属的Pass索引（通道）'
      }), _dec4 = property({
        tooltip: '目标材质索引（-1=所有材质，0+=仅指定材质）'
      }), _dec(_class = (_class2 = class MeshFlashPropData {
        constructor() {
          _initializerDefineProperty(this, "propName", _descriptor, this);

          _initializerDefineProperty(this, "passIndex", _descriptor2, this);

          _initializerDefineProperty(this, "matIndex", _descriptor3, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "propName", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 'emissive';
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "passIndex", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "matIndex", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -1;
        }
      })), _class2)) || _class));
      /**
       * 闪红开关属性配置（float类型uniform，如 u_flashEnable 0→1→0）
       */


      _export("MeshFlashSwitchData", MeshFlashSwitchData = (_dec5 = ccclass('MeshFlashSwitchData'), _dec6 = property({
        tooltip: '属性名，如 u_flashEnable'
      }), _dec7 = property({
        tooltip: '该属性所属的Pass索引（通道）'
      }), _dec8 = property({
        tooltip: '目标材质索引（-1=所有材质，0+=仅指定材质）'
      }), _dec9 = property({
        tooltip: '闪红时设置的值（如1=开启）'
      }), _dec10 = property({
        tooltip: '恢复时设置的值（如0=关闭），默认0'
      }), _dec11 = property({
        tooltip: '使用Material.setProperty设置（用于带target映射的属性，如grayEnable→grayParam.x）'
      }), _dec5(_class4 = (_class5 = class MeshFlashSwitchData {
        constructor() {
          _initializerDefineProperty(this, "propName", _descriptor4, this);

          _initializerDefineProperty(this, "passIndex", _descriptor5, this);

          _initializerDefineProperty(this, "matIndex", _descriptor6, this);

          _initializerDefineProperty(this, "flashValue", _descriptor7, this);

          _initializerDefineProperty(this, "restoreValue", _descriptor8, this);

          _initializerDefineProperty(this, "useMaterialProp", _descriptor9, this);
        }

      }, (_descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "propName", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 'u_flashEnable';
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "passIndex", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class5.prototype, "matIndex", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -1;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class5.prototype, "flashValue", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class5.prototype, "restoreValue", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class5.prototype, "useMaterialProp", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      })), _class5)) || _class4));
      /**
       * 闪红MeshRenderer配置
       */


      _export("MeshFlashData", MeshFlashData = (_dec12 = ccclass('MeshFlashData'), _dec13 = property(MeshRenderer), _dec14 = property({
        type: [MeshFlashPropData],
        tooltip: '闪红时修改的材质颜色属性列表，每个属性指定所属Pass通道'
      }), _dec15 = property({
        type: [MeshFlashSwitchData],
        tooltip: '闪红时修改的开关属性列表（float类型，如 u_flashEnable 0→1→0）'
      }), _dec12(_class7 = (_class8 = class MeshFlashData {
        constructor() {
          _initializerDefineProperty(this, "meshRender", _descriptor10, this);

          _initializerDefineProperty(this, "colorProps", _descriptor11, this);

          _initializerDefineProperty(this, "switchProps", _descriptor12, this);
        }

      }, (_descriptor10 = _applyDecoratedDescriptor(_class8.prototype, "meshRender", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class8.prototype, "colorProps", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class8.prototype, "switchProps", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class8)) || _class7));
      /**
       * 表示该物体可以被攻击
       * 
       */


      _export("BattleTargetBase", BattleTargetBase = (_dec16 = ccclass('BattleTargetBase'), _dec17 = property(Node), _dec18 = property(CCFloat), _dec19 = property(_crd && HpComponent === void 0 ? (_reportPossibleCrUseOfHpComponent({
        error: Error()
      }), HpComponent) : HpComponent), _dec20 = property({
        type: [MeshFlashData],
        tooltip: '闪红MeshRenderer配置列表，可在属性检查器中编辑'
      }), _dec16(_class10 = (_class11 = class BattleTargetBase extends (_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
        error: Error()
      }), UnityUpComponent) : UnityUpComponent) {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "hitNode_2", _descriptor13, this);

          _initializerDefineProperty(this, "MaxHp", _descriptor14, this);

          this.defMaxHp = 0;
          this.curHp = 0;
          this.isDestroy = false;

          _initializerDefineProperty(this, "hpC", _descriptor15, this);

          // ==================== 闪红效果 ====================
          _initializerDefineProperty(this, "meshFlashDataList", _descriptor16, this);
        }

        get hitNode() {
          if (!this.hitNode_2 || !this.hitNode_2.isValid) {
            return this.node;
          }

          return this.hitNode_2;
        }

        onLoad() {
          this.initHp();
        }

        initHp(difficulty = 1) {
          if (!this.defMaxHp) {
            this.defMaxHp = this.MaxHp;
          }

          this.MaxHp = this.defMaxHp * difficulty; // console.log(this.MaxHp);

          this.curHp = this.MaxHp;
          this.isDestroy = false;
        }

        Hit(damage) {
          if (this.isDie) {
            return 0;
          }

          this.curHp -= damage;
          this.curHp = Math.max(0, this.curHp);
          this.curHp = Math.min(this.MaxHp, this.curHp);
          let value = this.curHp / this.MaxHp;
          this.damage(damage);
          this.node.emit(BattleStateEvent.damage, damage);

          if (this.isDie) {
            this.die();
            this.node.emit(BattleStateEvent.die, damage);
          }

          if (this.hpC) {
            this.hpC.value = value;
          }

          return value;
        }

        get isDie() {
          return this.curHp <= 0 || this.isDestroy;
        }

        init(difficulty) {
          this.initHp(difficulty);

          if (this.hpC) {
            this.hpC.value = 1;
          }
        }

        /**
         * 闪红效果：将对应MeshRenderer的材质设为红色，持续一段时间后恢复
         * 委托给 FlashRedManager 统一管理，保证合批
         * - 闪红途中再次调用不会触发
         * - 闪红前记录原始颜色值，闪红后精确恢复
         * - 每个MeshRenderer可单独配置颜色属性名列表，兼容不同shader
         * @param duration 闪红持续时间（秒），默认0.15
         * @param flashColor 闪红颜色，默认红色 (255,50,50,255)
         */
        flashRed(duration = 0.15, flashColor = null, ground = null) {
          if (this.isDie) return;
          (_crd && FlashRedManager === void 0 ? (_reportPossibleCrUseOfFlashRedManager({
            error: Error()
          }), FlashRedManager) : FlashRedManager).instance.flashRed(this.node, this.meshFlashDataList, duration, flashColor, ground);
        }
        /**
         * 停止闪红效果，立即恢复原始共享材质
         */


        stopFlashRed() {
          (_crd && FlashRedManager === void 0 ? (_reportPossibleCrUseOfFlashRedManager({
            error: Error()
          }), FlashRedManager) : FlashRedManager).instance.stopFlashRed(this.node);
        }

      }, (_descriptor13 = _applyDecoratedDescriptor(_class11.prototype, "hitNode_2", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor14 = _applyDecoratedDescriptor(_class11.prototype, "MaxHp", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 500;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class11.prototype, "hpC", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor16 = _applyDecoratedDescriptor(_class11.prototype, "meshFlashDataList", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class11)) || _class10));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=021cbce763294c7c4adf05845718c817a68ff9f3.js.map