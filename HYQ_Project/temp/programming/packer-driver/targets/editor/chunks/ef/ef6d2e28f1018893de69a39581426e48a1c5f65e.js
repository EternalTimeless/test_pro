System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Vec3, UITransform, math, PoolManager, JumpSequenceBase, LayerManager, PoolEnum, SceneType, JumpScatter, _crd;

  function _reportPossibleCrUseOfPoolManager(extras) {
    _reporterNs.report("PoolManager", "../../Base/PoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfJumpSequenceBase(extras) {
    _reporterNs.report("JumpSequenceBase", "./JumpSequenceBase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLayerManager(extras) {
    _reporterNs.report("LayerManager", "../../Base/LayerManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolEnum(extras) {
    _reporterNs.report("PoolEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSceneType(extras) {
    _reporterNs.report("SceneType", "../../Base/EnumList", _context.meta, extras);
  }

  _export("JumpScatter", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Vec3 = _cc.Vec3;
      UITransform = _cc.UITransform;
      math = _cc.math;
    }, function (_unresolved_2) {
      PoolManager = _unresolved_2.default;
    }, function (_unresolved_3) {
      JumpSequenceBase = _unresolved_3.default;
    }, function (_unresolved_4) {
      LayerManager = _unresolved_4.default;
    }, function (_unresolved_5) {
      PoolEnum = _unresolved_5.PoolEnum;
      SceneType = _unresolved_5.SceneType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "948ffeiTwpLn6xJPoD3Ep6x", "JumpScatter", undefined);

      __checkObsolete__(['Vec3', 'Node', 'UITransform', 'CurveRange', 'math']);

      /**
       * 扩散式抛物线跳跃 - 支持随机扩散和混乱轨迹
       * 
       * 特点：
       * 1. 多个物体从相近位置起跳时自动分散
       * 2. 随机控制点产生混乱轨迹
       * 3. 精确到达各自终点
       * 4. 支持 2D/3D 场景
       * 
       * 使用场景：
       * - 金币/道具爆炸效果
       * - 战利品掉落
       * - 群体物品飞行
       */
      _export("JumpScatter", JumpScatter = class JumpScatter extends (_crd && JumpSequenceBase === void 0 ? (_reportPossibleCrUseOfJumpSequenceBase({
        error: Error()
      }), JumpSequenceBase) : JumpSequenceBase) {
        constructor(...args) {
          super(...args);
          this.flyNode = void 0;
          this.uiTran = void 0;
          this.startPos = new Vec3();
          this.endPos = new Vec3();
          this.jumpHeight = void 0;
          this.jumpSpeed = void 0;
          // 扩散控制参数
          this.scatterRadius = 0;
          this.scatterAngle = 0;
          this.randomness = 0.3;
          this.controlPoints = [];
          this.curveRange = void 0;
          this.curveRangeSpeed = void 0;
        }

        _remove() {
          (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).JumpSequence + JumpScatter, this);
        }

        init(jumpNode, endPos, jumpHeight, jumpSpeed, scatterAngle = 0) {
          this.flyNode = jumpNode;
          this.startPos.set(jumpNode.worldPosition);
          this.endPos.set(endPos);
          this.jumpHeight = jumpHeight;
          this.jumpSpeed = jumpSpeed;
          this.scatterAngle = scatterAngle;
          this.uiTran = jumpNode.getComponent(UITransform);
          this.curveRange = null;
          this.curveRangeSpeed = null;
          this._time = 0;
          this.generateScatterPath();
        }

        setScatterRadius(radius) {
          this.scatterRadius = radius;
          this.generateScatterPath();
          return this;
        }

        setRandomness(randomness) {
          this.randomness = Math.max(0, Math.min(1, randomness));
          this.generateScatterPath();
          return this;
        }

        setCurveRange(cr) {
          this.curveRange = cr;
          return this;
        }

        setCurveRangeSpeed(cr) {
          this.curveRangeSpeed = cr;
          return this;
        }

        generateScatterPath() {
          this.controlPoints = [];
          this.controlPoints.push(this.startPos.clone());
          const direction = new Vec3();
          Vec3.subtract(direction, this.endPos, this.startPos);
          const totalDistance = direction.length();

          if (totalDistance < 0.01) {
            this.controlPoints.push(this.startPos.clone());
            this.controlPoints.push(this.endPos.clone());
            this.controlPoints.push(this.endPos.clone());
            return;
          }

          direction.normalize();
          const perpendicular = this.getPerpendicularVector(direction);
          const p1 = this.createControlPoint(this.startPos, direction, perpendicular, totalDistance * 0.33, this.scatterRadius * 1.2, this.jumpHeight * 0.7);
          this.controlPoints.push(p1);
          const p2 = this.createControlPoint(this.startPos, direction, perpendicular, totalDistance * 0.67, this.scatterRadius * 0.8, this.jumpHeight * 1.0);
          this.controlPoints.push(p2);
          this.controlPoints.push(this.endPos.clone());
        }

        createControlPoint(basePos, direction, perpendicular, forwardDist, scatterDist, heightOffset) {
          const point = basePos.clone();
          const forward = direction.clone().multiplyScalar(forwardDist);
          point.add(forward);

          if (scatterDist > 0) {
            const radAngle = math.toRadian(this.scatterAngle);
            const scatterOffset = perpendicular.clone();

            if ((_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
              error: Error()
            }), LayerManager) : LayerManager).instance.SceneType === (_crd && SceneType === void 0 ? (_reportPossibleCrUseOfSceneType({
              error: Error()
            }), SceneType) : SceneType).D2) {
              const cos = Math.cos(radAngle);
              const sin = Math.sin(radAngle);
              scatterOffset.x = perpendicular.x * cos - perpendicular.y * sin;
              scatterOffset.y = perpendicular.x * sin + perpendicular.y * cos;
            } else {
              const cos = Math.cos(radAngle);
              const sin = Math.sin(radAngle);
              scatterOffset.x = perpendicular.x * cos - perpendicular.z * sin;
              scatterOffset.z = perpendicular.x * sin + perpendicular.z * cos;
            }

            scatterOffset.multiplyScalar(scatterDist);
            const randomOffset = new Vec3((Math.random() - 0.5) * scatterDist * this.randomness * 2, (Math.random() - 0.5) * heightOffset * this.randomness * 0.5, (Math.random() - 0.5) * scatterDist * this.randomness * 2);
            point.add(scatterOffset);
            point.add(randomOffset);
          }

          point.y += heightOffset;
          return point;
        }

        getPerpendicularVector(vec) {
          if ((_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
            error: Error()
          }), LayerManager) : LayerManager).instance.SceneType === (_crd && SceneType === void 0 ? (_reportPossibleCrUseOfSceneType({
            error: Error()
          }), SceneType) : SceneType).D2) {
            return new Vec3(-vec.y, vec.x, 0);
          } else {
            if (Math.abs(vec.x) < 0.001 && Math.abs(vec.z) < 0.001) {
              return new Vec3(1, 0, 0);
            }

            const perp = new Vec3(-vec.z, 0, vec.x);
            perp.normalize();
            return perp;
          }
        }

        move(dt) {
          let t = dt * this.jumpSpeed * 2.5;

          if (this.curveRangeSpeed) {
            let cy = this.curveRangeSpeed.curve.evaluate(this._time);
            t += t * cy;
            t = Math.max(0.01, t);
          }

          this._time += t;
          this._time = Math.min(1, this._time);

          if (this._time >= 1) {
            this.flyNode.setWorldPosition(this.endPos);
            this.endPosPre(this.flyNode);
            this.updatePriority(this.endPos);
            return true;
          }

          const pos = this.cubicBezier(this.controlPoints, this._time);

          if (this.curveRange) {
            const scaleMultiplier = (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
              error: Error()
            }), LayerManager) : LayerManager).instance.SceneType === (_crd && SceneType === void 0 ? (_reportPossibleCrUseOfSceneType({
              error: Error()
            }), SceneType) : SceneType).D2 ? 256 : 4;
            let cy = this.curveRange.curve.evaluate(this._time) * scaleMultiplier;
            let scale = 1 - Math.abs(this._time - 0.5) / 0.5;
            pos.y += cy * scale;
          }

          this.flyNode.setWorldPosition(pos);
          this.endPosPre(this.flyNode);
          this.updatePriority(pos);
          return false;
        }

        cubicBezier(points, t) {
          const t2 = t * t;
          const t3 = t2 * t;
          const mt = 1 - t;
          const mt2 = mt * mt;
          const mt3 = mt2 * mt;
          const result = new Vec3();
          const temp0 = points[0].clone().multiplyScalar(mt3);
          result.add(temp0);
          const temp1 = points[1].clone().multiplyScalar(3 * mt2 * t);
          result.add(temp1);
          const temp2 = points[2].clone().multiplyScalar(3 * mt * t2);
          result.add(temp2);
          const temp3 = points[3].clone().multiplyScalar(t3);
          result.add(temp3);
          return result;
        }

        updatePriority(pos) {
          if (!this.uiTran) return;

          if ((_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
            error: Error()
          }), LayerManager) : LayerManager).instance.SceneType === (_crd && SceneType === void 0 ? (_reportPossibleCrUseOfSceneType({
            error: Error()
          }), SceneType) : SceneType).D2) {
            this.uiTran.priority = -pos.y;
          } else {
            this.uiTran.priority = -pos.z + pos.y * 1.5;
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ef6d2e28f1018893de69a39581426e48a1c5f65e.js.map