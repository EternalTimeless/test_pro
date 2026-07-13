System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Canvas, CCBoolean, CCFloat, CCInteger, Color, Component, director, Director, Enum, HorizontalTextAlignment, js, Label, LabelOutline, Layers, MeshRenderer, ModelRenderer, Node, ParticleSystem, SkeletalAnimation, SkinnedMeshRenderer, Sprite, UIRenderer, UITransform, VerticalTextAlignment, Widget, warn, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _crd, ccclass, property, HudPanelPosition, HudTextAlignment, BLOCK_NAMES, ENTITY_CLASS_BLOCK, activeHud, PerformanceBlockHUD;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Canvas = _cc.Canvas;
      CCBoolean = _cc.CCBoolean;
      CCFloat = _cc.CCFloat;
      CCInteger = _cc.CCInteger;
      Color = _cc.Color;
      Component = _cc.Component;
      director = _cc.director;
      Director = _cc.Director;
      Enum = _cc.Enum;
      HorizontalTextAlignment = _cc.HorizontalTextAlignment;
      js = _cc.js;
      Label = _cc.Label;
      LabelOutline = _cc.LabelOutline;
      Layers = _cc.Layers;
      MeshRenderer = _cc.MeshRenderer;
      ModelRenderer = _cc.ModelRenderer;
      Node = _cc.Node;
      ParticleSystem = _cc.ParticleSystem;
      SkeletalAnimation = _cc.SkeletalAnimation;
      SkinnedMeshRenderer = _cc.SkinnedMeshRenderer;
      Sprite = _cc.Sprite;
      UIRenderer = _cc.UIRenderer;
      UITransform = _cc.UITransform;
      VerticalTextAlignment = _cc.VerticalTextAlignment;
      Widget = _cc.Widget;
      warn = _cc.warn;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5b225YhyHtEuZ1GUUWBREaS", "PerformanceBlockHUD", undefined);

      __checkObsolete__(['_decorator', 'Canvas', 'CCBoolean', 'CCFloat', 'CCInteger', 'Color', 'Component', 'director', 'Director', 'Enum', 'HorizontalTextAlignment', 'js', 'Label', 'LabelOutline', 'Layers', 'MeshRenderer', 'ModelRenderer', 'Node', 'ParticleSystem', 'SkeletalAnimation', 'SkinnedMeshRenderer', 'Sprite', 'UIRenderer', 'UITransform', 'VerticalTextAlignment', 'Widget', 'warn']);

      ({
        ccclass,
        property
      } = _decorator);

      HudPanelPosition = /*#__PURE__*/function (HudPanelPosition) {
        HudPanelPosition[HudPanelPosition["\u5DE6\u4E0A\u89D2"] = 0] = "\u5DE6\u4E0A\u89D2";
        HudPanelPosition[HudPanelPosition["\u53F3\u4E0A\u89D2"] = 1] = "\u53F3\u4E0A\u89D2";
        return HudPanelPosition;
      }(HudPanelPosition || {});

      HudTextAlignment = /*#__PURE__*/function (HudTextAlignment) {
        HudTextAlignment[HudTextAlignment["\u5DE6\u5BF9\u9F50"] = 0] = "\u5DE6\u5BF9\u9F50";
        HudTextAlignment[HudTextAlignment["\u53F3\u5BF9\u9F50"] = 1] = "\u53F3\u5BF9\u9F50";
        return HudTextAlignment;
      }(HudTextAlignment || {});

      BLOCK_NAMES = ['玩家', '怪物', '子弹', '道具', '特效', 'UI', '环境', '其他'];
      ENTITY_CLASS_BLOCK = {
        Role: '玩家',
        MonsterBattleTaerget: '怪物',
        BulletBattle3D: '子弹',
        PropLalianGate: '道具',
        PropArms: '道具',
        PropBrand: '道具',
        PropTireGate: '道具',
        EffectTimeRemove: '特效',
        EffectTimePartRemove: '特效'
      };
      activeHud = null;

      _export("PerformanceBlockHUD", PerformanceBlockHUD = (_dec = ccclass('PerformanceBlockHUD'), _dec2 = property({
        type: CCFloat,
        displayName: '刷新间隔(秒)',
        tooltip: '面板刷新和脚本CPU抽样间隔。建议 0.5~1 秒，过低会增加监控开销。'
      }), _dec3 = property({
        type: CCBoolean,
        displayName: '启用脚本CPU抽样',
        tooltip: '每个刷新周期抽样一帧项目脚本耗时。只统计被组件方法调用的项目脚本，不包含GPU和引擎内部骨骼计算。'
      }), _dec4 = property({
        type: CCInteger,
        displayName: '字体大小'
      }), _dec5 = property({
        type: CCFloat,
        displayName: '面板宽度'
      }), _dec6 = property({
        type: CCFloat,
        displayName: '面板高度'
      }), _dec7 = property({
        type: Enum(HudPanelPosition),
        displayName: '面板位置'
      }), _dec8 = property({
        type: Enum(HudTextAlignment),
        displayName: '文字对齐'
      }), _dec9 = property({
        type: CCFloat,
        displayName: '水平边距'
      }), _dec10 = property({
        type: CCFloat,
        displayName: '上边距'
      }), _dec11 = property({
        type: CCBoolean,
        displayName: '显示空分块'
      }), _dec12 = property({
        type: CCBoolean,
        displayName: '隐藏玩家'
      }), _dec13 = property({
        type: CCBoolean,
        displayName: '隐藏怪物'
      }), _dec14 = property({
        type: CCBoolean,
        displayName: '隐藏子弹'
      }), _dec15 = property({
        type: CCBoolean,
        displayName: '隐藏道具'
      }), _dec16 = property({
        type: CCBoolean,
        displayName: '隐藏特效'
      }), _dec17 = property({
        type: CCBoolean,
        displayName: '隐藏UI'
      }), _dec18 = property({
        type: CCBoolean,
        displayName: '隐藏环境'
      }), _dec19 = property({
        type: CCBoolean,
        displayName: '隐藏其他'
      }), _dec(_class = (_class2 = class PerformanceBlockHUD extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "refreshInterval", _descriptor, this);

          _initializerDefineProperty(this, "enableCpuSampling", _descriptor2, this);

          _initializerDefineProperty(this, "fontSize", _descriptor3, this);

          _initializerDefineProperty(this, "panelWidth", _descriptor4, this);

          _initializerDefineProperty(this, "panelHeight", _descriptor5, this);

          _initializerDefineProperty(this, "panelPosition", _descriptor6, this);

          _initializerDefineProperty(this, "textAlignment", _descriptor7, this);

          _initializerDefineProperty(this, "horizontalOffset", _descriptor8, this);

          _initializerDefineProperty(this, "topOffset", _descriptor9, this);

          _initializerDefineProperty(this, "showEmptyBlocks", _descriptor10, this);

          _initializerDefineProperty(this, "hidePlayer", _descriptor11, this);

          _initializerDefineProperty(this, "hideMonster", _descriptor12, this);

          _initializerDefineProperty(this, "hideBullet", _descriptor13, this);

          _initializerDefineProperty(this, "hideProp", _descriptor14, this);

          _initializerDefineProperty(this, "hideEffect", _descriptor15, this);

          _initializerDefineProperty(this, "hideUi", _descriptor16, this);

          _initializerDefineProperty(this, "hideEnvironment", _descriptor17, this);

          _initializerDefineProperty(this, "hideOther", _descriptor18, this);

          this.hudNode = null;
          this.hudLabel = null;
          this.hookTargets = [];
          this.hookRecords = [];
          this.hiddenVisualRecords = [];
          this.hiddenVisualMap = new Map();
          this.nodeBlockCache = new WeakMap();
          this.scanStack = [];
          this.frameCount = 0;
          this.frameTime = 0;
          this.nextRefreshAt = 0;
          this.cpuSampling = false;
          this.currentCpuByBlock = Object.create(null);
          this.lastCpuByBlock = Object.create(null);
          this.currentCpuByClass = Object.create(null);
          this.lastCpuByClass = Object.create(null);
        }

        onEnable() {
          if (activeHud && activeHud !== this) {
            warn('[PerformanceBlockHUD] 场景中只需要挂一个性能面板。');
            this.enabled = false;
            return;
          }

          activeHud = this;
          this.createHud();
          this.collectKnownHookTargets();
          this.collectSceneHookTargets();
          this.nextRefreshAt = 0;
          director.on(Director.EVENT_BEFORE_UPDATE, this.onBeforeUpdate, this);
        }

        onDisable() {
          var _this$hudNode;

          director.off(Director.EVENT_BEFORE_UPDATE, this.onBeforeUpdate, this);
          this.cpuSampling = false;
          this.restoreHooks();
          this.restoreAllHiddenVisuals();
          this.hookTargets.length = 0;

          if ((_this$hudNode = this.hudNode) != null && _this$hudNode.isValid) {
            this.hudNode.destroy();
          }

          this.hudNode = null;
          this.hudLabel = null;

          if (activeHud === this) {
            activeHud = null;
          }
        }

        update(dt) {
          this.frameCount++;
          this.frameTime += Math.max(0, dt);
        }

        onBeforeUpdate() {
          const now = this.now(); // A sample remains active for one complete frame, including lateUpdate and AFTER_UPDATE callbacks.

          if (this.cpuSampling) {
            this.cpuSampling = false;
            this.restoreHooks();
            this.lastCpuByBlock = this.copyNumberMap(this.currentCpuByBlock);
            this.lastCpuByClass = this.copyNumberMap(this.currentCpuByClass);
            this.refreshHud();
          }

          if (now < this.nextRefreshAt) {
            return;
          }

          this.nextRefreshAt = now + Math.max(0.2, this.refreshInterval) * 1000;

          if (this.enableCpuSampling) {
            this.currentCpuByBlock = Object.create(null);
            this.currentCpuByClass = Object.create(null);
            this.collectKnownHookTargets();
            this.installCollectedHooks();
            this.cpuSampling = true;
          } else {
            this.refreshHud();
          }
        }

        refreshHud() {
          var _this$hudLabel, _director$root, _device$numDrawCalls, _device$numTris, _device$numInstances;

          if (!((_this$hudLabel = this.hudLabel) != null && _this$hudLabel.isValid)) {
            return;
          }

          const scanStart = this.now();
          const blockStats = this.scanScene();
          const scanMs = this.now() - scanStart;
          const fps = this.frameTime > 0 ? this.frameCount / this.frameTime : 0;
          const frameMs = this.frameCount > 0 ? this.frameTime * 1000 / this.frameCount : 0;
          this.frameCount = 0;
          this.frameTime = 0;
          const device = (_director$root = director.root) == null ? void 0 : _director$root.device;
          const drawCalls = (_device$numDrawCalls = device == null ? void 0 : device.numDrawCalls) != null ? _device$numDrawCalls : 0;
          const triangles = (_device$numTris = device == null ? void 0 : device.numTris) != null ? _device$numTris : 0;
          const instances = (_device$numInstances = device == null ? void 0 : device.numInstances) != null ? _device$numInstances : 0;
          const lines = [];
          lines.push(`[性能分块] FPS ${fps.toFixed(1)} | 帧 ${frameMs.toFixed(2)}ms | DC ${drawCalls} | 三角 ${this.formatNumber(triangles)} | 实例 ${instances}`);
          const heapText = this.getHeapText();

          if (heapText) {
            lines.push(`JS堆 ${heapText} | HUD扫描 ${scanMs.toFixed(2)}ms/次 | 刷新 ${Math.max(0.2, this.refreshInterval).toFixed(2)}s`);
          } else {
            lines.push(`HUD扫描 ${scanMs.toFixed(2)}ms/次 | 刷新 ${Math.max(0.2, this.refreshInterval).toFixed(2)}s`);
          }

          lines.push('分块       实体  节点  渲染  骨骼R  动画  粒子  估主DC  估影DC  脚本ms');

          for (let i = 0; i < BLOCK_NAMES.length; i++) {
            var _this$lastCpuByBlock$;

            const block = BLOCK_NAMES[i];
            const stats = blockStats[block];
            const cpu = (_this$lastCpuByBlock$ = this.lastCpuByBlock[block]) != null ? _this$lastCpuByBlock$ : 0;

            if (!this.showEmptyBlocks && stats.nodes <= 0 && cpu <= 0) {
              continue;
            }

            lines.push(`${this.padRight(block, 5)} ${this.padLeft(stats.entities, 4)} ${this.padLeft(stats.nodes, 5)} ${this.padLeft(stats.renderers, 5)}` + ` ${this.padLeft(stats.skinnedRenderers, 5)} ${this.padLeft(stats.animations, 5)} ${this.padLeft(stats.particles, 5)}` + ` ${this.padLeft(stats.estimatedMainDc, 7)} ${this.padLeft(stats.estimatedShadowDc, 7)} ${this.padLeft(cpu.toFixed(2), 8)}`);
          }

          const topClasses = Object.keys(this.lastCpuByClass).map(name => ({
            name,
            ms: this.lastCpuByClass[name]
          })).filter(item => item.ms > 0.001).sort((a, b) => b.ms - a.ms).slice(0, 8);

          if (topClasses.length > 0) {
            lines.push('脚本CPU Top（抽样帧）:');

            for (let i = 0; i < topClasses.length; i++) {
              const item = topClasses[i];
              lines.push(`  ${i + 1}. ${item.name} ${item.ms.toFixed(2)}ms`);
            }
          }

          lines.push('说明：总DC为引擎实测；分块DC按活跃SubModel估算，UI可能被高估，阴影按投影Renderer估算。');
          lines.push('HUD自身通常增加约1 DC；脚本ms为低频抽样一帧，有少量探针开销，不含GPU和渲染线程。');
          this.hudLabel.string = lines.join('\n');
        }

        scanScene() {
          const stats = this.createBlockStatsMap();
          const scene = director.getScene();

          if (!scene) {
            return stats;
          }

          this.nodeBlockCache = new WeakMap();
          this.syncHiddenVisuals();
          this.scanStack.length = 0;
          this.scanStack.push(scene);

          while (this.scanStack.length > 0) {
            const node = this.scanStack.pop();

            if (!node || !node.isValid || !node.activeInHierarchy) {
              continue;
            }

            const block = this.classifyNode(node);
            const blockStat = stats[block];
            blockStat.nodes++;
            const components = node.components;

            for (let i = 0; i < components.length; i++) {
              var _component$constructo;

              const component = components[i];

              if (!component || !component.isValid) {
                continue;
              }

              this.collectComponentHookTargets(component);
              this.applyVisualHide(component, block);
              const className = js.getClassName(component) || ((_component$constructo = component.constructor) == null ? void 0 : _component$constructo.name) || 'Unknown';
              const entityBlock = ENTITY_CLASS_BLOCK[className];

              if (entityBlock) {
                stats[entityBlock].entities++;
              }

              if (!component.enabled) {
                continue;
              }

              if (component instanceof SkeletalAnimation) {
                blockStat.animations++;
                continue;
              }

              if (component instanceof SkinnedMeshRenderer) {
                blockStat.skinnedRenderers++;
                this.addRendererStats(blockStat, component);
                continue;
              }

              if (component instanceof MeshRenderer) {
                this.addRendererStats(blockStat, component);
                continue;
              }

              if (component instanceof ParticleSystem) {
                const isPlaying = component.isPlaying;

                if (isPlaying !== false) {
                  blockStat.particles++;

                  if (component.visibility !== 0) {
                    blockStat.renderers++;
                    blockStat.estimatedMainDc++;
                  }
                }

                continue;
              }

              if (component instanceof Sprite || component instanceof Label) {
                blockStat.renderers++;
                blockStat.estimatedMainDc++;
              }
            }

            for (let i = 0; i < node.children.length; i++) {
              this.scanStack.push(node.children[i]);
            }
          }

          return stats;
        }

        addRendererStats(stats, renderer) {
          var _shadowCastingMode;

          if (renderer.visibility === 0) {
            return;
          }

          stats.renderers++;
          const drawCount = this.getRendererDrawCount(renderer);
          stats.estimatedMainDc += drawCount;
          const shadowCastingMode = (_shadowCastingMode = renderer.shadowCastingMode) != null ? _shadowCastingMode : 0;

          if (shadowCastingMode !== 0) {
            stats.estimatedShadowDc += drawCount;
          }
        }

        getRendererDrawCount(renderer) {
          var _model;

          const subModels = (_model = renderer.model) == null ? void 0 : _model.subModels;

          if (subModels && subModels.length > 0) {
            return subModels.length;
          }

          const materials = renderer.sharedMaterials;

          if (materials && materials.length > 0) {
            let count = 0;

            for (let i = 0; i < materials.length; i++) {
              if (materials[i]) {
                count++;
              }
            }

            return Math.max(1, count);
          }

          return 1;
        }

        classifyNode(node) {
          if (!node || !node.isValid) {
            return '其他';
          }

          const cached = this.nodeBlockCache.get(node);

          if (cached) {
            return cached;
          }

          if (this.getBlockByNodeName(node.name) === '道具') {
            const actorOwnerBlock = this.getActorOwnerBlock(node.parent);

            if (actorOwnerBlock) {
              this.nodeBlockCache.set(node, actorOwnerBlock);
              return actorOwnerBlock;
            }
          }

          let current = node;
          let sawParticle = false;
          let sawUi = node.layer === Layers.Enum.UI_2D;

          while (current) {
            if (current !== node) {
              const ancestorBlock = this.nodeBlockCache.get(current);

              if (ancestorBlock) {
                if (ancestorBlock === '玩家' || ancestorBlock === '怪物' || ancestorBlock === '子弹' || ancestorBlock === '道具') {
                  this.nodeBlockCache.set(node, ancestorBlock);
                  return ancestorBlock;
                }

                const inheritedBlock = sawParticle || ancestorBlock === '特效' ? '特效' : sawUi || ancestorBlock === 'UI' ? 'UI' : '环境';
                this.nodeBlockCache.set(node, inheritedBlock);
                return inheritedBlock;
              }
            }

            const components = current.components;

            for (let i = 0; i < components.length; i++) {
              var _component$constructo2;

              const component = components[i];
              const className = js.getClassName(component) || ((_component$constructo2 = component.constructor) == null ? void 0 : _component$constructo2.name) || '';
              const explicitBlock = this.getExplicitBlockByClassName(className);

              if (explicitBlock) {
                this.nodeBlockCache.set(node, explicitBlock);
                return explicitBlock;
              }

              if (component instanceof ParticleSystem) {
                sawParticle = true;
              }

              if (component instanceof Canvas || component instanceof Label || component instanceof Sprite) {
                sawUi = true;
              }
            }

            const nameBlock = this.getBlockByNodeName(current.name);

            if (nameBlock) {
              this.nodeBlockCache.set(node, nameBlock);
              return nameBlock;
            }

            current = current.parent;
          }

          const result = sawParticle ? '特效' : sawUi ? 'UI' : '环境';
          this.nodeBlockCache.set(node, result);
          return result;
        }

        getActorOwnerBlock(node) {
          let current = node;

          while (current) {
            const cached = this.nodeBlockCache.get(current);

            if (cached === '玩家' || cached === '怪物' || cached === '子弹') {
              return cached;
            }

            const components = current.components;

            for (let i = 0; i < components.length; i++) {
              var _component$constructo3;

              const component = components[i];
              const className = js.getClassName(component) || ((_component$constructo3 = component.constructor) == null ? void 0 : _component$constructo3.name) || '';

              if (className === 'Player' || className === 'Role') {
                return '玩家';
              }

              if (className === 'MonsterBattleTaerget') {
                return '怪物';
              }

              if (className === 'BulletBattle3D') {
                return '子弹';
              }
            }

            current = current.parent;
          }

          return null;
        }

        getExplicitBlockByClassName(className) {
          if (!className) {
            return null;
          }

          if (className === 'Player' || className === 'Role') {
            return '玩家';
          }

          if (className.indexOf('Bullet') !== -1) {
            return '子弹';
          }

          if (className.indexOf('Monster') !== -1) {
            return '怪物';
          }

          if (className.indexOf('Effect') !== -1 || className === 'FlashRedManager' || className === 'AttackParkPlay') {
            return '特效';
          }

          if (className.indexOf('Prop') !== -1 || className === 'ArmsUp') {
            return '道具';
          }

          if (className.indexOf('Guide') !== -1 || className.indexOf('Rocker') !== -1 || className.indexOf('Shopping') !== -1 || className.indexOf('Panel') !== -1) {
            return 'UI';
          }

          return null;
        }

        getBlockByNodeName(name) {
          const value = (name || '').toLowerCase();
          if (value.indexOf('bullet') !== -1) return '子弹';
          if (value.indexOf('monster') !== -1 || value.indexOf('zombie') !== -1 || value.indexOf('boss') !== -1) return '怪物';
          if (value === 'player' || value.indexOf('role_') !== -1) return '玩家';
          if (value.indexOf('effect') !== -1 || value.indexOf('fx_') !== -1) return '特效';
          if (value.indexOf('lalian') !== -1 || value.indexOf('prop') !== -1 || value.indexOf('weapon') !== -1 || value.indexOf('youtong') !== -1 || value.indexOf('tire') !== -1) return '道具';
          if (value.indexOf('canvas') !== -1 || value.indexOf('ui') !== -1 || value.indexOf('guide') !== -1) return 'UI';
          return null;
        }

        createHud() {
          const scene = director.getScene();
          const canvas = scene == null ? void 0 : scene.getComponentInChildren(Canvas);

          if (!canvas) {
            warn('[PerformanceBlockHUD] 当前场景没有 Canvas，无法创建性能文本面板。');
            return;
          }

          const hudNode = new Node('PerformanceBlockHUD_Label');
          hudNode.layer = Layers.Enum.UI_2D;
          canvas.node.addChild(hudNode);
          const transform = hudNode.addComponent(UITransform);
          transform.setContentSize(Math.max(320, this.panelWidth), Math.max(240, this.panelHeight));
          const alignRight = this.panelPosition === HudPanelPosition.右上角;
          transform.setAnchorPoint(alignRight ? 1 : 0, 1);
          const widget = hudNode.addComponent(Widget);
          widget.isAlignLeft = !alignRight;
          widget.isAlignRight = alignRight;
          widget.isAlignTop = true;

          if (alignRight) {
            widget.right = this.horizontalOffset;
          } else {
            widget.left = this.horizontalOffset;
          }

          widget.top = this.topOffset;
          widget.updateAlignment();
          const label = hudNode.addComponent(Label);
          label.fontSize = Math.max(10, Math.floor(this.fontSize));
          label.lineHeight = label.fontSize + 3;
          label.enableWrapText = false;
          label.horizontalAlign = this.textAlignment === HudTextAlignment.右对齐 ? HorizontalTextAlignment.RIGHT : HorizontalTextAlignment.LEFT;
          label.verticalAlign = VerticalTextAlignment.TOP;
          label.color = new Color(225, 255, 225, 255);
          label.string = '性能分块初始化中...';
          const outline = hudNode.addComponent(LabelOutline);
          outline.color = new Color(0, 0, 0, 255);
          outline.width = 2;
          this.hudNode = hudNode;
          this.hudLabel = label;
        }

        isBlockHidden(block) {
          switch (block) {
            case '玩家':
              return this.hidePlayer;

            case '怪物':
              return this.hideMonster;

            case '子弹':
              return this.hideBullet;

            case '道具':
              return this.hideProp;

            case '特效':
              return this.hideEffect;

            case 'UI':
              return this.hideUi;

            case '环境':
              return this.hideEnvironment;

            case '其他':
              return this.hideOther;

            default:
              return false;
          }
        }

        applyVisualHide(component, block) {
          const previousRecord = this.hiddenVisualMap.get(component);

          if (previousRecord && previousRecord.block !== block) {
            this.restoreHiddenVisual(previousRecord);
            this.hiddenVisualMap.delete(component);
            const index = this.hiddenVisualRecords.indexOf(previousRecord);

            if (index !== -1) {
              this.hiddenVisualRecords.splice(index, 1);
            }
          }

          if (!this.isBlockHidden(block) || component.node === this.hudNode) {
            return;
          }

          if (!(component instanceof ModelRenderer) && !(component instanceof UIRenderer)) {
            return;
          }

          let record = this.hiddenVisualMap.get(component);

          if (!record) {
            record = {
              component,
              block,
              originalVisibility: component instanceof ModelRenderer ? component.visibility : 0,
              originalEnabled: component.enabled
            };
            this.hiddenVisualMap.set(component, record);
            this.hiddenVisualRecords.push(record);
          }

          if (component instanceof ModelRenderer) {
            component.visibility = 0;
          } else {
            component.enabled = false;
          }
        }

        syncHiddenVisuals() {
          for (let i = this.hiddenVisualRecords.length - 1; i >= 0; i--) {
            var _record$component;

            const record = this.hiddenVisualRecords[i];

            if (!((_record$component = record.component) != null && _record$component.isValid) || !this.isBlockHidden(record.block)) {
              this.restoreHiddenVisual(record);
              this.hiddenVisualMap.delete(record.component);
              this.hiddenVisualRecords.splice(i, 1);
              continue;
            }

            if (record.component instanceof ModelRenderer) {
              record.component.visibility = 0;
            } else {
              record.component.enabled = false;
            }
          }
        }

        restoreAllHiddenVisuals() {
          for (let i = this.hiddenVisualRecords.length - 1; i >= 0; i--) {
            this.restoreHiddenVisual(this.hiddenVisualRecords[i]);
          }

          this.hiddenVisualRecords.length = 0;
          this.hiddenVisualMap.clear();
        }

        restoreHiddenVisual(record) {
          const component = record.component;

          if (!(component != null && component.isValid)) {
            return;
          }

          if (component instanceof ModelRenderer) {
            component.visibility = record.originalVisibility;
          } else {
            component.enabled = record.originalEnabled;
          }
        }

        collectKnownHookTargets() {
          const knownHooks = [{
            className: 'BulletMonsterCollisionManager',
            methodName: 'update',
            block: '子弹'
          }, {
            className: 'EffectManager',
            methodName: 'frameReleaseSpecialEffects',
            block: '特效'
          }, {
            className: 'FlashRedManager',
            methodName: '_update',
            block: '特效'
          }];

          for (let i = 0; i < knownHooks.length; i++) {
            const item = knownHooks[i];
            const ctor = js.getClassByName(item.className);

            if (ctor != null && ctor.prototype) {
              this.addHookTarget(ctor.prototype, item.methodName, item.block);
            }
          }
        }

        collectSceneHookTargets() {
          const scene = director.getScene();

          if (!scene) {
            return;
          }

          this.scanStack.length = 0;
          this.scanStack.push(scene);

          while (this.scanStack.length > 0) {
            const node = this.scanStack.pop();

            if (!node || !node.isValid) {
              continue;
            }

            const components = node.components;

            for (let i = 0; i < components.length; i++) {
              this.collectComponentHookTargets(components[i]);
            }

            for (let i = 0; i < node.children.length; i++) {
              this.scanStack.push(node.children[i]);
            }
          }
        }

        collectComponentHookTargets(component) {
          var _component$constructo4;

          if (!component || component === this) {
            return;
          }

          const className = js.getClassName(component) || ((_component$constructo4 = component.constructor) == null ? void 0 : _component$constructo4.name) || '';

          if (!className || className.indexOf('cc.') === 0) {
            return;
          }

          let prototype = Object.getPrototypeOf(component);

          while (prototype && prototype !== Component.prototype) {
            if (Object.prototype.hasOwnProperty.call(prototype, '_update')) {
              this.addHookTarget(prototype, '_update', null);
            }

            if (Object.prototype.hasOwnProperty.call(prototype, 'update')) {
              this.addHookTarget(prototype, 'update', null);
            }

            if (Object.prototype.hasOwnProperty.call(prototype, 'lateUpdate')) {
              this.addHookTarget(prototype, 'lateUpdate', null);
            }

            prototype = Object.getPrototypeOf(prototype);
          }
        }

        addHookTarget(prototype, methodName, fixedBlock) {
          const method = prototype == null ? void 0 : prototype[methodName];

          if (typeof method !== 'function') {
            return;
          }

          for (let i = 0; i < this.hookTargets.length; i++) {
            const target = this.hookTargets[i];

            if (target.prototype === prototype && target.methodName === methodName) {
              if (fixedBlock && !target.fixedBlock) {
                target.fixedBlock = fixedBlock;
              }

              return;
            }
          }

          this.hookTargets.push({
            prototype,
            methodName,
            fixedBlock
          });
        }

        installCollectedHooks() {
          for (let i = 0; i < this.hookTargets.length; i++) {
            const target = this.hookTargets[i];
            this.installHook(target.prototype, target.methodName, target.fixedBlock);
          }
        }

        installHook(prototype, methodName, fixedBlock) {
          const original = prototype == null ? void 0 : prototype[methodName];

          if (typeof original !== 'function') {
            return;
          }

          for (let i = 0; i < this.hookRecords.length; i++) {
            const record = this.hookRecords[i];

            if (record.prototype === prototype && record.methodName === methodName) {
              return;
            }
          }

          const wrapper = function (...args) {
            const hud = activeHud;

            if (!hud || !hud.cpuSampling) {
              return original.apply(this, args);
            }

            const start = hud.now();

            try {
              return original.apply(this, args);
            } finally {
              var _this$constructor, _ref;

              const className = js.getClassName(this) || (this == null || (_this$constructor = this.constructor) == null ? void 0 : _this$constructor.name) || methodName;
              const block = (_ref = fixedBlock != null ? fixedBlock : hud.classifyNode(this == null ? void 0 : this.node)) != null ? _ref : '其他';
              hud.recordCpu(block, className, hud.now() - start);
            }
          };

          prototype[methodName] = wrapper;
          this.hookRecords.push({
            prototype,
            methodName,
            original,
            wrapper
          });
        }

        restoreHooks() {
          for (let i = this.hookRecords.length - 1; i >= 0; i--) {
            var _record$prototype;

            const record = this.hookRecords[i];

            if (((_record$prototype = record.prototype) == null ? void 0 : _record$prototype[record.methodName]) === record.wrapper) {
              record.prototype[record.methodName] = record.original;
            }
          }

          this.hookRecords.length = 0;
        }

        recordCpu(block, className, milliseconds) {
          var _this$currentCpuByBlo, _this$currentCpuByCla;

          this.currentCpuByBlock[block] = ((_this$currentCpuByBlo = this.currentCpuByBlock[block]) != null ? _this$currentCpuByBlo : 0) + milliseconds;
          this.currentCpuByClass[className] = ((_this$currentCpuByCla = this.currentCpuByClass[className]) != null ? _this$currentCpuByCla : 0) + milliseconds;
        }

        createBlockStatsMap() {
          const result = Object.create(null);

          for (let i = 0; i < BLOCK_NAMES.length; i++) {
            result[BLOCK_NAMES[i]] = {
              entities: 0,
              nodes: 0,
              renderers: 0,
              skinnedRenderers: 0,
              animations: 0,
              particles: 0,
              estimatedMainDc: 0,
              estimatedShadowDc: 0
            };
          }

          return result;
        }

        copyNumberMap(source) {
          const result = Object.create(null);
          const keys = Object.keys(source);

          for (let i = 0; i < keys.length; i++) {
            result[keys[i]] = source[keys[i]];
          }

          return result;
        }

        getHeapText() {
          const perf = typeof performance !== 'undefined' ? performance : null;
          const memory = perf == null ? void 0 : perf.memory;

          if (!(memory != null && memory.usedJSHeapSize)) {
            return '';
          }

          const used = memory.usedJSHeapSize / 1024 / 1024;
          const total = memory.totalJSHeapSize / 1024 / 1024;
          return `${used.toFixed(1)}/${total.toFixed(1)}MB`;
        }

        formatNumber(value) {
          if (value >= 1000000) return `${(value / 1000000).toFixed(1)}m`;
          if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
          return `${Math.max(0, Math.floor(value))}`;
        }

        padLeft(value, width) {
          const text = String(value);
          return text.length >= width ? text : ' '.repeat(width - text.length) + text;
        }

        padRight(value, width) {
          const text = String(value);
          return text.length >= width ? text : text + ' '.repeat(width - text.length);
        }

        now() {
          return typeof performance !== 'undefined' ? performance.now() : Date.now();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "refreshInterval", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "enableCpuSampling", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "fontSize", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 15;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "panelWidth", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 700;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "panelHeight", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 560;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "panelPosition", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return HudPanelPosition.右上角;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "textAlignment", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return HudTextAlignment.右对齐;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "horizontalOffset", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 8;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "topOffset", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 8;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "showEmptyBlocks", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "hidePlayer", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "hideMonster", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "hideBullet", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "hideProp", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "hideEffect", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "hideUi", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "hideEnvironment", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "hideOther", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b5419685ef88ca081900d26993069910bb0ee4ab.js.map