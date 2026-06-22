System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Camera, Component, Node, tween, Vec3, view, LayerManager, SceneType, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _class3, _crd, ccclass, property, CameraMove;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfLayerManager(extras) {
    _reporterNs.report("LayerManager", "./LayerManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSceneType(extras) {
    _reporterNs.report("SceneType", "./EnumList", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Camera = _cc.Camera;
      Component = _cc.Component;
      Node = _cc.Node;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      view = _cc.view;
    }, function (_unresolved_2) {
      LayerManager = _unresolved_2.default;
    }, function (_unresolved_3) {
      SceneType = _unresolved_3.SceneType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "df21dfABX9C0Jms8MmhxnDW", "CameraMove", undefined);

      __checkObsolete__(['_decorator', 'Camera', 'Component', 'log', 'Node', 'Pool', 'tween', 'Vec3', 'view']);

      ({
        ccclass,
        property
      } = _decorator);
      /**  game 摄像机  */

      _export("CameraMove", CameraMove = (_dec = ccclass('CameraMove'), _dec2 = property(Node), _dec3 = property(Vec3), _dec(_class = (_class2 = (_class3 = class CameraMove extends Component {
        constructor() {
          super();

          /**跟随的目标 */
          _initializerDefineProperty(this, "targetNode", _descriptor, this);

          this.camera = void 0;
          this._sceneCW = void 0;
          this._sceneCH = void 0;

          _initializerDefineProperty(this, "OffVector3D", _descriptor2, this);

          _initializerDefineProperty(this, "useEditorStartOffset", _descriptor3, this);

          _initializerDefineProperty(this, "followXFactor", _descriptor4, this);

          this.sceneType = (_crd && SceneType === void 0 ? (_reportPossibleCrUseOfSceneType({
            error: Error()
          }), SceneType) : SceneType).D2;
          this.startCameraWorldPos = new Vec3();
          this.startTargetWorldPos = new Vec3();
          this.hasFollowStartPos = false;
          this.shakeIn = false;
          this.moveX = 3;
          CameraMove.instance = this;
        }

        get sceneCW() {
          if (this._sceneCW == null) {
            let size = view.getDesignResolutionSize();
            this._sceneCW = size.width / 2;
            this._sceneCH = size.height / 2;
          }

          return this._sceneCW;
        }

        get sceneCH() {
          if (this._sceneCH == null) {
            let size = view.getDesignResolutionSize();
            this._sceneCW = size.width / 2;
            this._sceneCH = size.height / 2;
          }

          return this._sceneCH;
        }

        onLoad() {
          this.sceneType = (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
            error: Error()
          }), LayerManager) : LayerManager).instance.SceneType;
        }

        start() {
          this.camera = this.getComponent(Camera);
          this.initEditorStartOffset(this.targetNode);
        }

        update(deltaTime) {
          if (this.shakeIn) {
            return;
          } // let node = PublicManager.instance.carmeraTarget;


          let target = this.targetNode;

          if (target) {
            if (this.sceneType == (_crd && SceneType === void 0 ? (_reportPossibleCrUseOfSceneType({
              error: Error()
            }), SceneType) : SceneType).D2) {
              this.move2D(target);
            } else {
              this.move32D(target);
            }
          }
        }

        move2D(node) {
          let pv = node.worldPosition;
          let pos = this.node.worldPosition;
          let dx = pv.x - pos.x;
          let dy = pv.y - pos.y;

          if (Math.abs(dx) < 10) {
            dx = 0;
          }

          if (Math.abs(dy) < 10) {
            dy = 0;
          }

          this.node.setWorldPosition(pos.x + dx * 0.1, pos.y + dy * 0.1, 1000);
        }

        move3D(node) {
          let pv = node.worldPosition;
          let pos = this.node.worldPosition;
          let dx = pv.x + this.OffVector3D.x - pos.x;
          let dy = pv.z + this.OffVector3D.z - pos.z;

          if (Math.abs(dx) < 0.05) {
            dx = 0;
          }

          if (Math.abs(dy) < 0.05) {
            dy = 0;
          }

          this.node.setWorldPosition(pos.x + dx * 0.1, this.OffVector3D.y, pos.z + dy * 0.1); // this.node.setWorldPosition(pv.x, this.OffVector3D.y, pos.z )
        }

        /**
         * 在2D平面上移动节点，主要处理X轴方向的移动
         * @param target 目标节点，用于获取目标位置
         */
        move32D(target) {
          // 获取目标节点的世界坐标
          this.initEditorStartOffset(target);
          let pv = target.worldPosition; // 获取当前节点的世界坐标

          let pos = this.node.worldPosition;
          const targetX = this.startCameraWorldPos.x + (pv.x - this.startTargetWorldPos.x) * this.followXFactor;
          const moveX = targetX - pos.x;
          const nextX = Math.abs(moveX) < 0.05 ? pos.x : pos.x + moveX * 0.1;
          this.node.setWorldPosition(nextX, this.startCameraWorldPos.y, this.startCameraWorldPos.z); // this.node.setWorldPosition(pos.x + dx * 0.1, this.OffVector3D.y, pos.z + dy * 0.1)
          // this.node.setWorldPosition(pv.x, this.OffVector3D.y, pos.z )
        }

        initEditorStartOffset(target) {
          if (this.hasFollowStartPos || this.sceneType == (_crd && SceneType === void 0 ? (_reportPossibleCrUseOfSceneType({
            error: Error()
          }), SceneType) : SceneType).D2 || !target) {
            return;
          }

          const cameraPos = this.node.worldPosition;
          const targetPos = target.worldPosition;
          this.startCameraWorldPos.set(cameraPos);
          this.startTargetWorldPos.set(targetPos);
          this.hasFollowStartPos = true;

          if (this.useEditorStartOffset) {
            this.OffVector3D.set(cameraPos.x - targetPos.x, cameraPos.y - targetPos.y, cameraPos.z - targetPos.z);
          }
        }
        /**摄像机 抖动 */


        shake() {
          if (!this.shakeIn) {
            this.shakeIn = true;

            if (Math.random() < 0.5) {
              this.Shake1();
            } else {
              this.Shake2();
            }
          }
        }
        /**
        * 抖动方法1（左右抖动）
        */


        Shake1(scale = 2) {
          const pos1 = 0.1 * scale;
          const pos2 = -pos1 * 2;
          return tween(this.node).by(0.05, {
            worldPosition: new Vec3(pos1, pos1)
          }).by(0.05, {
            worldPosition: new Vec3(pos2, pos2)
          }).by(0.05, {
            worldPosition: new Vec3(pos1, pos1)
          }).call(() => {
            this.shakeIn = false;
          }).start();
        }
        /**
        
         * 抖动方法2（伸缩抖动）
        
         */


        Shake2(scale = 0.2) {
          let camera = this.camera;
          let ort = camera.fov;
          return tween(camera).to(0.05, {
            fov: ort + scale
          }).to(0.05, {
            fov: ort - scale
          }).to(0.05, {
            fov: ort
          }).call(() => {
            this.shakeIn = false;
          }).start();
        }

      }, _class3.instance = void 0, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "targetNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "OffVector3D", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Vec3();
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "useEditorStartOffset", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "followXFactor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.6;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=14cec8e3738599ab9965ee6a2127491eba1361af.js.map