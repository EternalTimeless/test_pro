System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, LineComponent, Vec3, CCFloat, ParticleSystem, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _crd, ccclass, property, up, Lightning;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      LineComponent = _cc.LineComponent;
      Vec3 = _cc.Vec3;
      CCFloat = _cc.CCFloat;
      ParticleSystem = _cc.ParticleSystem;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1f1fan1td5FvqW8ndQ6MHEY", "Lightning", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'LineComponent', 'Material', 'EffectAsset', 'Vec3', 'ModelComponent', 'Texture2D', 'CCFloat', 'ParticleSystem']);

      ({
        ccclass,
        property
      } = _decorator);
      up = new Vec3(0, 1, 0);
      /**
       * 闪电效果组件
       * 使用中点分形法生成动态闪电效果，连接两个节点
       */

      _export("Lightning", Lightning = (_dec = ccclass("Lightning"), _dec2 = property({
        type: CCFloat,
        displayName: "细节程度",
        tooltip: "闪电分段的最小细节值，值越小闪电越平滑"
      }), _dec3 = property({
        type: CCFloat,
        displayName: "位移强度",
        tooltip: "闪电随机偏移的强度，值越大闪电越弯曲"
      }), _dec4 = property({
        type: CCFloat,
        displayName: "Y轴偏移",
        tooltip: "闪电起始和结束点的Y轴偏移量"
      }), _dec5 = property({
        type: Node,
        displayName: "起始节点",
        tooltip: "闪电的起始位置节点"
      }), _dec6 = property({
        type: Node,
        displayName: "目标节点",
        tooltip: "闪电的目标位置节点"
      }), _dec7 = property({
        type: LineComponent,
        displayName: "线条组件"
      }), _dec8 = property({
        type: ParticleSystem,
        displayName: "激光粒子",
        tooltip: "激光粒子"
      }), _dec(_class = (_class2 = class Lightning extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "detail", _descriptor, this);

          _initializerDefineProperty(this, "displacement", _descriptor2, this);

          _initializerDefineProperty(this, "yOffset", _descriptor3, this);

          _initializerDefineProperty(this, "startNode", _descriptor4, this);

          _initializerDefineProperty(this, "targetNode", _descriptor5, this);

          /** 线条渲染组件 */
          _initializerDefineProperty(this, "line", _descriptor6, this);

          _initializerDefineProperty(this, "laser", _descriptor7, this);

          /** 闪电路径顶点数组 */
          this.points = void 0;
        }

        onLoad() {
          this.points = [];
        }

        start() {}

        update(deltaTime) {
          var startPos = Vec3.ZERO;
          var endPos = Vec3.ZERO; // 获取起始节点的世界坐标位置

          if (this.startNode) {
            startPos = this.startNode.worldPosition.add(up.multiplyScalar(this.yOffset));
          } // 获取目标节点的世界坐标位置


          if (this.targetNode) {
            endPos = this.targetNode.worldPosition.add(up.multiplyScalar(this.yOffset));
          } // 当起始位置和结束位置不同时，生成闪电路径


          if (!startPos.equals(endPos)) {
            this.points.length = 0;
            this.collectLinPos(startPos, endPos, this.displacement);
            this.points.push(endPos); // 更新线条组件的顶点位置

            this.line.positions = this.points;
          }
        }
        /**
         * 收集顶点，使用中点分形法插值抖动生成闪电路径
         * @param startPos 起始位置
         * @param destPos 目标位置
         * @param displace 当前位移强度
         */


        collectLinPos(startPos, destPos, displace) {
          // 当位移强度小于细节阈值时，直接添加顶点
          if (displace < this.detail) {
            this.points.push(startPos);
          } else {
            // 计算中点坐标
            var midX = (startPos.x + destPos.x) / 2;
            var midY = (startPos.y + destPos.y) / 2;
            var midZ = (startPos.z + destPos.z) / 2; // 为中点添加随机偏移，形成闪电的弯曲效果

            midX += (Math.random() - 0.5) * displace;
            midY += (Math.random() - 0.5) * displace;
            midZ += (Math.random() - 0.5) * displace;
            var midPos = new Vec3(midX, midY, midZ); // 递归处理两段，位移强度减半

            this.collectLinPos(startPos, midPos, displace / 2);
            this.collectLinPos(midPos, destPos, displace / 2);
          }
        }

        setPos(endWorldPos, startPos) {
          this.targetNode.setWorldPosition(endWorldPos);

          if (startPos) {
            this.startNode.setWorldPosition(startPos);
          }

          this.laser.node.lookAt(endWorldPos);
          var distance = Vec3.distance(this.laser.node.worldPosition, endWorldPos);
          this.laser.node.setWorldScale(0.3, 0.3, distance / 15);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "detail", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "displacement", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 15;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "yOffset", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "startNode", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "targetNode", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "line", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "laser", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=caa8f17ab5e1ae4b34896131f1306324c03cadd5.js.map