System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Color, Component, Material, MeshRenderer, Node, Sprite, UITransform, Vec3, _decorator, utils, BulletEnum, _dec, _class, _class2, _crd, ccclass, BulletBatchRenderer;

  function _reportPossibleCrUseOfBulletEnum(extras) {
    _reporterNs.report("BulletEnum", "db://assets/Script/Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletBattle3D(extras) {
    _reporterNs.report("BulletBattle3D", "./Battle3D/Bullet/BulletBattle3D", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Color = _cc.Color;
      Component = _cc.Component;
      Material = _cc.Material;
      MeshRenderer = _cc.MeshRenderer;
      Node = _cc.Node;
      Sprite = _cc.Sprite;
      UITransform = _cc.UITransform;
      Vec3 = _cc.Vec3;
      _decorator = _cc._decorator;
      utils = _cc.utils;
    }, function (_unresolved_2) {
      BulletEnum = _unresolved_2.BulletEnum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8f7caXYfwpNKq619YyMhqX1", "BulletBatchRenderer", undefined);

      __checkObsolete__(['Color', 'Component', 'Material', 'Mesh', 'MeshRenderer', 'Node', 'Sprite', 'SpriteFrame', 'UITransform', 'Vec3', '_decorator', 'primitives', 'utils']);

      ({
        ccclass
      } = _decorator);

      _export("BulletBatchRenderer", BulletBatchRenderer = (_dec = ccclass("BulletBatchRenderer"), _dec(_class = (_class2 = class BulletBatchRenderer extends Component {
        constructor() {
          super(...arguments);
          this.visualOffsetY = -0.65;
          this._batches = [];
          this._tempForward = new Vec3();
          this._tempRight = new Vec3();
        }

        static getOrCreate(parent) {
          var renderer = BulletBatchRenderer._instances.get(parent);

          if (renderer && renderer.isValid) {
            return renderer;
          }

          var node = parent.getChildByName("BulletBatchRenderer");

          if (!node) {
            node = new Node("BulletBatchRenderer");
            parent.addChild(node);
            node.layer = parent.layer;
          }

          renderer = node.getComponent(BulletBatchRenderer);

          if (!renderer) {
            renderer = node.addComponent(BulletBatchRenderer);
          }

          renderer.visualOffsetY = BulletBatchRenderer.defaultVisualOffsetY;

          BulletBatchRenderer._instances.set(parent, renderer);

          BulletBatchRenderer.instance = renderer;
          return renderer;
        }

        onLoad() {
          BulletBatchRenderer.instance = this;
        }

        onDestroy() {
          if (BulletBatchRenderer.instance === this) {
            BulletBatchRenderer.instance = null;
          }
        }

        registerBullet(bullet) {
          var visual = this._prepareBulletVisual(bullet);

          if (!visual.spriteFrame) {
            return;
          }

          if (bullet.batchRenderer && bullet.batchRenderer !== this) {
            bullet.batchRenderer.unregisterBullet(bullet);
          }

          var index = bullet.bulletEnum;

          var batch = this._getBatch(index, visual);

          if (batch.bullets.indexOf(bullet) !== -1) {
            if (visual.sprite) {
              visual.sprite.enabled = false;
            }

            return;
          }

          batch.bullets.push(bullet);
          bullet.batchRenderer = this;

          this._updateBatch(batch);

          if (visual.sprite) {
            visual.sprite.enabled = false;
          }
        }

        prewarmBullet(bullet) {
          var visual = this._prepareBulletVisual(bullet);

          if (!visual.spriteFrame) {
            return;
          }

          var batch = this._getBatch(bullet.bulletEnum, visual);

          if (batch.mesh) {
            return;
          }

          var halfWidth = batch.width * 0.5;
          var halfHeight = batch.height * 0.5;

          var uv = this._getUV(batch.spriteFrame);

          batch.positions.length = 12;
          batch.uvs.length = 8;
          batch.indices.length = 6;

          this._setPosition(batch.positions, 0, -halfWidth, -halfHeight, 0);

          this._setPosition(batch.positions, 3, halfWidth, -halfHeight, 0);

          this._setPosition(batch.positions, 6, -halfWidth, halfHeight, 0);

          this._setPosition(batch.positions, 9, halfWidth, halfHeight, 0);

          for (var i = 0; i < 8; i++) {
            batch.uvs[i] = uv[i];
          }

          batch.indices[0] = 0;
          batch.indices[1] = 1;
          batch.indices[2] = 2;
          batch.indices[3] = 2;
          batch.indices[4] = 1;
          batch.indices[5] = 3;
          batch.mesh = utils.createMesh({
            positions: batch.positions,
            uvs: batch.uvs,
            indices: batch.indices,
            minPos: {
              x: -100,
              y: -10,
              z: -100
            },
            maxPos: {
              x: 100,
              y: 20,
              z: 200
            }
          });
          batch.renderer.mesh = batch.mesh;
          batch.node.active = false;
        }

        unregisterBullet(bullet) {
          var batch = this._batches[bullet.bulletEnum];

          if (!batch) {
            return;
          }

          var index = batch.bullets.indexOf(bullet);

          if (index !== -1) {
            batch.bullets[index] = batch.bullets[batch.bullets.length - 1];
            batch.bullets.pop();

            if (bullet.batchRenderer === this) {
              bullet.batchRenderer = null;
            }
          }
        }

        lateUpdate() {
          for (var i = 0; i < this._batches.length; i++) {
            var batch = this._batches[i];

            if (!batch) {
              continue;
            }

            this._updateBatch(batch);
          }
        }

        _prepareBulletVisual(bullet) {
          var sprite = bullet.batchSprite;

          if (!sprite || !sprite.isValid) {
            sprite = bullet.node.getComponentInChildren(Sprite);
            bullet.batchSprite = sprite;
          }

          var width = bullet.batchWidth;
          var height = bullet.batchHeight;
          var localEulerX = bullet.batchLocalEulerX;
          var spriteFrame = sprite ? sprite.spriteFrame : null;

          if (sprite && (width <= 0 || height <= 0)) {
            var ui = sprite.getComponent(UITransform);

            if (ui) {
              width = ui.contentSize.width;
              height = ui.contentSize.height;
            } else if (spriteFrame) {
              width = spriteFrame.width / 100;
              height = spriteFrame.height / 100;
            }

            localEulerX = sprite.node.eulerAngles.x;
            bullet.batchWidth = width;
            bullet.batchHeight = height;
            bullet.batchLocalEulerX = localEulerX;
          }

          return {
            sprite,
            spriteFrame,
            width,
            height,
            localEulerX
          };
        }

        _getBatch(index, visual) {
          var _index;

          var batch = this._batches[index];

          if (batch) {
            return batch;
          }

          var node = new Node("BulletBatch_" + ((_index = (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
            error: Error()
          }), BulletEnum) : BulletEnum)[index]) != null ? _index : index));
          this.node.addChild(node);
          node.layer = this.node.layer;
          var renderer = node.addComponent(MeshRenderer);
          var material = new Material();
          material.initialize({
            effectName: "builtin-unlit",
            technique: 3,
            defines: {
              USE_TEXTURE: true
            }
          });

          if (visual.spriteFrame) {
            material.setProperty("mainTexture", visual.spriteFrame.texture);
            material.setProperty("mainColor", Color.WHITE);
          }

          renderer.setSharedMaterial(material, 0);
          batch = {
            node,
            renderer,
            material,
            mesh: null,
            bullets: [],
            positions: [],
            uvs: [],
            indices: [],
            spriteFrame: visual.spriteFrame,
            width: visual.width,
            height: visual.height,
            localEulerX: visual.localEulerX
          };
          this._batches[index] = batch;
          return batch;
        }

        _updateBatch(batch) {
          var bullets = batch.bullets;

          for (var i = bullets.length - 1; i >= 0; i--) {
            var bullet = bullets[i];

            if (!bullet || !bullet.isValid || !bullet.node.activeInHierarchy) {
              bullets[i] = bullets[bullets.length - 1];
              bullets.pop();
            }
          }

          var count = bullets.length;
          batch.node.active = count > 0;

          if (count <= 0) {
            return;
          }

          batch.positions.length = count * 12;
          batch.uvs.length = count * 8;
          batch.indices.length = count * 6;
          var halfWidth = batch.width * 0.5;
          var halfHeight = batch.height * 0.5;
          var useGroundPlane = Math.abs(batch.localEulerX) > 45;

          var uv = this._getUV(batch.spriteFrame);

          for (var _i = 0; _i < count; _i++) {
            var _bullet = bullets[_i];
            var pos = _bullet.node.position;
            Vec3.transformQuat(this._tempForward, Vec3.FORWARD, _bullet.node.rotation);

            this._tempForward.set(-this._tempForward.x, -this._tempForward.y, -this._tempForward.z);

            if (useGroundPlane) {
              this._tempRight.set(this._tempForward.z, 0, -this._tempForward.x);
            } else {
              this._tempRight.set(this._tempForward.z, 0, -this._tempForward.x);
            }

            if (this._tempRight.lengthSqr() <= 0.0001) {
              this._tempRight.set(1, 0, 0);
            } else {
              this._tempRight.normalize();
            }

            var fx = this._tempForward.x * halfHeight;
            var fy = useGroundPlane ? this._tempForward.y * halfHeight : halfHeight;
            var fz = this._tempForward.z * halfHeight;
            var rx = this._tempRight.x * halfWidth;
            var rz = this._tempRight.z * halfWidth;
            var py = pos.y + this.visualOffsetY;
            var pOffset = _i * 12;

            this._setPosition(batch.positions, pOffset, pos.x - rx - fx, py - fy, pos.z - rz - fz);

            this._setPosition(batch.positions, pOffset + 3, pos.x + rx - fx, py - fy, pos.z + rz - fz);

            this._setPosition(batch.positions, pOffset + 6, pos.x - rx + fx, py + fy, pos.z - rz + fz);

            this._setPosition(batch.positions, pOffset + 9, pos.x + rx + fx, py + fy, pos.z + rz + fz);

            var uvOffset = _i * 8;
            batch.uvs[uvOffset] = uv[0];
            batch.uvs[uvOffset + 1] = uv[1];
            batch.uvs[uvOffset + 2] = uv[2];
            batch.uvs[uvOffset + 3] = uv[3];
            batch.uvs[uvOffset + 4] = uv[4];
            batch.uvs[uvOffset + 5] = uv[5];
            batch.uvs[uvOffset + 6] = uv[6];
            batch.uvs[uvOffset + 7] = uv[7];
            var vertexOffset = _i * 4;
            var indexOffset = _i * 6;
            batch.indices[indexOffset] = vertexOffset;
            batch.indices[indexOffset + 1] = vertexOffset + 1;
            batch.indices[indexOffset + 2] = vertexOffset + 2;
            batch.indices[indexOffset + 3] = vertexOffset + 2;
            batch.indices[indexOffset + 4] = vertexOffset + 1;
            batch.indices[indexOffset + 5] = vertexOffset + 3;
          }

          var geometry = {
            positions: batch.positions,
            uvs: batch.uvs,
            indices: batch.indices,
            minPos: {
              x: -100,
              y: -10,
              z: -100
            },
            maxPos: {
              x: 100,
              y: 20,
              z: 200
            }
          };
          batch.mesh = utils.createMesh(geometry, batch.mesh || undefined);
          batch.renderer.mesh = batch.mesh;
        }

        _setPosition(out, offset, x, y, z) {
          out[offset] = x;
          out[offset + 1] = y;
          out[offset + 2] = z;
        }

        _getUV(spriteFrame) {
          var sfAny = spriteFrame;

          if (sfAny && sfAny.uv && sfAny.uv.length >= 8) {
            return sfAny.uv;
          }

          if (!spriteFrame || !spriteFrame.texture) {
            return [0, 1, 1, 1, 0, 0, 1, 0];
          }

          var rect = spriteFrame.getRect();
          var texWidth = spriteFrame.texture.width || rect.width;
          var texHeight = spriteFrame.texture.height || rect.height;
          var left = rect.x / texWidth;
          var right = (rect.x + rect.width) / texWidth;
          var top = rect.y / texHeight;
          var bottom = (rect.y + rect.height) / texHeight;

          if (spriteFrame.rotated) {
            return [left, top, left, bottom, right, top, right, bottom];
          }

          return [left, bottom, right, bottom, left, top, right, top];
        }

      }, _class2.defaultVisualOffsetY = -0.65, _class2.instance = null, _class2._instances = new WeakMap(), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f05038aedf4d7805ad91dbf59f1c87fe35c23bb5.js.map