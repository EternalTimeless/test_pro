System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, director, Node, Vec3, PoolManager, Singleton, JumpCurve, JumpCurve3D, JumpDriveEngine, BezierCurve, JumpParabola, LayerManager, JumpScatter, PoolEnum, SceneType, JumpManager, _crd;

  function _reportPossibleCrUseOfPoolManager(extras) {
    _reporterNs.report("PoolManager", "../../Base/PoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSingleton(extras) {
    _reporterNs.report("Singleton", "../../Base/Singleton", _context.meta, extras);
  }

  function _reportPossibleCrUseOfJumpCurve(extras) {
    _reporterNs.report("JumpCurve", "./JumpCurve", _context.meta, extras);
  }

  function _reportPossibleCrUseOfJumpCurve3D(extras) {
    _reporterNs.report("JumpCurve3D", "./JumpCurve3D", _context.meta, extras);
  }

  function _reportPossibleCrUseOfJumpDriveEngine(extras) {
    _reporterNs.report("JumpDriveEngine", "./JumpDriveEngine", _context.meta, extras);
  }

  function _reportPossibleCrUseOfJumpSequenceBase(extras) {
    _reporterNs.report("JumpSequenceBase", "./JumpSequenceBase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBezierCurve(extras) {
    _reporterNs.report("BezierCurve", "./BezierCurve", _context.meta, extras);
  }

  function _reportPossibleCrUseOfVector(extras) {
    _reporterNs.report("Vector", "./BezierCurve", _context.meta, extras);
  }

  function _reportPossibleCrUseOfJumpParabola(extras) {
    _reporterNs.report("JumpParabola", "./JumpParabola", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLayerManager(extras) {
    _reporterNs.report("LayerManager", "../../Base/LayerManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfJumpScatter(extras) {
    _reporterNs.report("JumpScatter", "./JumpScatter", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolEnum(extras) {
    _reporterNs.report("PoolEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSceneType(extras) {
    _reporterNs.report("SceneType", "../../Base/EnumList", _context.meta, extras);
  }

  _export("JumpManager", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      director = _cc.director;
      Node = _cc.Node;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      PoolManager = _unresolved_2.default;
    }, function (_unresolved_3) {
      Singleton = _unresolved_3.default;
    }, function (_unresolved_4) {
      JumpCurve = _unresolved_4.JumpCurve;
    }, function (_unresolved_5) {
      JumpCurve3D = _unresolved_5.JumpCurve3D;
    }, function (_unresolved_6) {
      JumpDriveEngine = _unresolved_6.JumpDriveEngine;
    }, function (_unresolved_7) {
      BezierCurve = _unresolved_7.default;
    }, function (_unresolved_8) {
      JumpParabola = _unresolved_8.JumpParabola;
    }, function (_unresolved_9) {
      LayerManager = _unresolved_9.default;
    }, function (_unresolved_10) {
      JumpScatter = _unresolved_10.JumpScatter;
    }, function (_unresolved_11) {
      PoolEnum = _unresolved_11.PoolEnum;
      SceneType = _unresolved_11.SceneType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "868d7zCsm9F8Jjod/lCBjog", "JumpManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'CurveRange', 'director', 'instantiate', 'Node', 'Prefab', 'resources', 'Root', 'Scene', 'Vec3']);

      _export("JumpManager", JumpManager = class JumpManager extends (_crd && Singleton === void 0 ? (_reportPossibleCrUseOfSingleton({
        error: Error()
      }), Singleton) : Singleton) {
        static get instance() {
          return this.getInstance();
        }

        constructor() {
          super();
          this.propFlyList = void 0;
          let node = new Node();
          director.getScene().addChild(node);
          node.addComponent(_crd && JumpDriveEngine === void 0 ? (_reportPossibleCrUseOfJumpDriveEngine({
            error: Error()
          }), JumpDriveEngine) : JumpDriveEngine);
          this.propFlyList = [];
        }

        jumpCurve(flyNode, endPosTemp, jumpSpeed = 1, jumpPower = 1) {
          if ((_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
            error: Error()
          }), LayerManager) : LayerManager).instance.SceneType == (_crd && SceneType === void 0 ? (_reportPossibleCrUseOfSceneType({
            error: Error()
          }), SceneType) : SceneType).D2) {
            return this.jumpCurve2D(flyNode, endPosTemp, jumpSpeed, jumpPower);
          } else {
            return this.jumpCurve3D(flyNode, endPosTemp, jumpSpeed, jumpPower);
          }
        }
        /**
         * 
         * @param flyNode 要飞行的节点
         * @param endPosTemp 目标地点 
         * @param jumpPower 力度
         * @param jumpSpeed 飞行速度
         * 
         */


        jumpCurve2D(flyNode, endPosTemp, jumpSpeed = 1, jumpPower = 1) {
          let propdata = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).JumpSequence + (_crd && JumpCurve === void 0 ? (_reportPossibleCrUseOfJumpCurve({
            error: Error()
          }), JumpCurve) : JumpCurve));

          if (!propdata) {
            propdata = new (_crd && JumpCurve === void 0 ? (_reportPossibleCrUseOfJumpCurve({
              error: Error()
            }), JumpCurve) : JumpCurve)();
          }

          propdata.init(flyNode, endPosTemp, jumpPower, jumpSpeed);
          this.propFlyList.push(propdata);
          return propdata;
        }
        /**
        * 
        * @param flyNode 要飞行的节点
        * @param endPosTemp 目标地点 
        * @param jumpPower 力度
        * @param jumpSpeed 飞行速度
        * 
        */


        jumpCurve3D(flyNode, endPosTemp, jumpSpeed = 1, jumpPower = 1) {
          let propdata = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).JumpSequence + (_crd && JumpCurve3D === void 0 ? (_reportPossibleCrUseOfJumpCurve3D({
            error: Error()
          }), JumpCurve3D) : JumpCurve3D));

          if (!propdata) {
            propdata = new (_crd && JumpCurve3D === void 0 ? (_reportPossibleCrUseOfJumpCurve3D({
              error: Error()
            }), JumpCurve3D) : JumpCurve3D)();
          }

          propdata.init(flyNode, endPosTemp, jumpPower, jumpSpeed);
          this.propFlyList.push(propdata);
          return propdata;
        }
        /**
         * 自定义贝塞尔 曲线
         * @param flyNode 
         * @param endPosTemp 
         * @param jumpSpeed 
         * @returns 
         */


        bezierCurve(flyNode, points, jumpSpeed = 1) {
          const dim = points[0].length;

          if (points.length === 0) {
            console.error("自定义贝塞尔：至少需要一个点");
            return null;
          }

          if (!points.every(p => p.length === dim)) {
            console.error("自定义贝塞尔：所有的点维度必须相同");
            return null;
          }

          let propdata = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).JumpSequence + (_crd && BezierCurve === void 0 ? (_reportPossibleCrUseOfBezierCurve({
            error: Error()
          }), BezierCurve) : BezierCurve));

          if (!propdata) {
            propdata = new (_crd && BezierCurve === void 0 ? (_reportPossibleCrUseOfBezierCurve({
              error: Error()
            }), BezierCurve) : BezierCurve)();
          }

          propdata.init(flyNode, points, jumpSpeed);
          this.propFlyList.push(propdata);
          return propdata;
        }
        /**
         * 
         * @param flyNode 
         * @param endPosTemp 
         * @param jumpSpeed 
         * @param jumpPower 
         * @returns 
         */


        jumpBezierCurve(flyNode, endPosTemp, jumpSpeed = 1, jumpPower = 1) {
          let propdata = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).JumpSequence + (_crd && BezierCurve === void 0 ? (_reportPossibleCrUseOfBezierCurve({
            error: Error()
          }), BezierCurve) : BezierCurve));

          if (!propdata) {
            propdata = new (_crd && BezierCurve === void 0 ? (_reportPossibleCrUseOfBezierCurve({
              error: Error()
            }), BezierCurve) : BezierCurve)();
          }

          const startPos = flyNode.worldPosition;
          const endPos = endPosTemp;
          const centerPos = new Vec3();
          Vec3.add(centerPos, startPos, endPos);
          centerPos.multiplyScalar(0.5);

          if ((_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
            error: Error()
          }), LayerManager) : LayerManager).instance.SceneType == (_crd && SceneType === void 0 ? (_reportPossibleCrUseOfSceneType({
            error: Error()
          }), SceneType) : SceneType).D2) {
            centerPos.y += 64 * jumpPower;
            const points = [new Float32Array([startPos.x, startPos.y]), new Float32Array([centerPos.x, centerPos.y]), new Float32Array([endPos.x, endPos.y])];
            propdata.init(flyNode, points, jumpSpeed);
          } else {
            centerPos.y += 8 * jumpPower;
            const points = [new Float32Array([startPos.x, startPos.y, startPos.z]), new Float32Array([centerPos.x, centerPos.y, centerPos.z]), new Float32Array([endPos.x, endPos.y, endPos.z])];
            propdata.init(flyNode, points, jumpSpeed);
          }

          this.propFlyList.push(propdata);
          return propdata;
        }
        /**
        * 以节点当前位置为起点，按传入点数组的顺序进行贝塞尔曲线移动
        * @param flyNode 移动的节点（起点取其世界坐标）
        * @param waypoints 途经点数组（按顺序，末尾为终点）
        * @param jumpSpeed 移动速度
        * @returns BezierCurve 实例（支持链式调用）
        */


        jumpBezierByPoints(flyNode, jumpSpeed = 1, ...waypoints) {
          const startPos = flyNode.worldPosition;
          const is2D = (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
            error: Error()
          }), LayerManager) : LayerManager).instance.SceneType == (_crd && SceneType === void 0 ? (_reportPossibleCrUseOfSceneType({
            error: Error()
          }), SceneType) : SceneType).D2;
          const startVec = is2D ? new Float32Array([startPos.x, startPos.y]) : new Float32Array([startPos.x, startPos.y, startPos.z]);
          const pointVecs = waypoints.map(p => is2D ? new Float32Array([p.x, p.y]) : new Float32Array([p.x, p.y, p.z]));
          const allPoints = [startVec, ...pointVecs];
          return this.bezierCurve(flyNode, allPoints, jumpSpeed);
        }
        /**
         * 参数方程抛物线跳跃 - 2D/3D 通用（推荐）
         * 
         * @param flyNode 跳跃的节点
         * @param endPos 目标位置
         * @param jumpHeight 跳跃高度（绝对值）
         * @param jumpSpeed 跳跃速度
         * @returns JumpParabola 实例（支持链式调用）
         * 
         * @example
         * // 跳到目标点，最高点比起点高 100 单位
         * JumppManager.instance.jumpParabola(node, targetPos, 100, 1.5)
         *     .setCurveRange(myCurve)
         *     .setDelay(0.5)
         *     .onComplete(() => console.log("到达"));
         */


        jumpParabola(flyNode, endPos, jumpHeight = 1, jumpSpeed = 1) {
          let propdata = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).JumpSequence + (_crd && JumpParabola === void 0 ? (_reportPossibleCrUseOfJumpParabola({
            error: Error()
          }), JumpParabola) : JumpParabola));

          if (!propdata) {
            propdata = new (_crd && JumpParabola === void 0 ? (_reportPossibleCrUseOfJumpParabola({
              error: Error()
            }), JumpParabola) : JumpParabola)();
          }

          propdata.init(flyNode, endPos, this.getHeightByPower(jumpHeight), jumpSpeed);
          this.propFlyList.push(propdata);
          return propdata;
        }
        /**
         * 根据场景类型和 power 参数计算实际跳跃高度
         * @param power 力度参数（相对值）
         * @returns 实际高度（绝对值）
         */


        getHeightByPower(power) {
          if ((_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
            error: Error()
          }), LayerManager) : LayerManager).instance.SceneType === (_crd && SceneType === void 0 ? (_reportPossibleCrUseOfSceneType({
            error: Error()
          }), SceneType) : SceneType).D2) {
            return 64 * power; // 2D 场景高度系数
          } else {
            return 4 * power; // 3D 场景高度系数
          }
        }
        /**
         * 扩散式抛物线跳跃 - 适用于多物体从相近位置起跳的场景
         * 
         * @param flyNode 跳跃的节点
         * @param endPos 目标位置
         * @param jumpHeight 跳跃高度参数
         * @param jumpSpeed 跳跃速度
         * @param scatterAngle 扩散角度（度），用于多个物体的径向分布
         * @returns JumpScatter 实例（支持链式调用）
         * 
         * @example
         * // 金币爆炸效果：10个金币从宝箱飞向背包
         * for (let i = 0; i < 10; i++) {
         *     JumpManager.instance.jumpScatter(coins[i], bagPos, 1, 1.5, i * 36)
         *         .setScatterRadius(80)  // 扩散半径
         *         .setRandomness(0.6);   // 随机程度
         * }
         */


        jumpScatter(flyNode, endPos, jumpHeight = 1, jumpSpeed = 1, scatterAngle = 0) {
          let propdata = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).JumpSequence + (_crd && JumpScatter === void 0 ? (_reportPossibleCrUseOfJumpScatter({
            error: Error()
          }), JumpScatter) : JumpScatter));

          if (!propdata) {
            propdata = new (_crd && JumpScatter === void 0 ? (_reportPossibleCrUseOfJumpScatter({
              error: Error()
            }), JumpScatter) : JumpScatter)();
          }

          propdata.init(flyNode, endPos, this.getHeightByPower(jumpHeight), jumpSpeed, scatterAngle);
          this.propFlyList.push(propdata);
          return propdata;
        }
        /**
         * 批量扩散跳跃（便捷方法）
         * 适用于多个物体从同一或相近位置飞向同一目标的场景
         * 
         * @param nodes 节点数组
         * @param endPos 共同的目标位置
         * @param jumpHeight 跳跃高度参数
         * @param jumpSpeed 跳跃速度
         * @param scatterRadius 扩散半径
         * @param randomness 随机程度 [0,1]
         * @param delayStep 每个物体的延迟间隔（秒）
         * 
         * @example
         * // 10个金币同时飞向背包，带扩散效果
         * JumpManager.instance.jumpScatterBatch(coins, bagPos, 1, 1.5, 80, 0.6, 0.03);
         */


        jumpScatterBatch(nodes, endPos, jumpHeight = 1, jumpSpeed = 1, scatterRadius = 80, randomness = 0.5, delayStep = 0.03) {
          const angleStep = 360 / nodes.length;
          nodes.forEach((node, i) => {
            this.jumpScatter(node, endPos, jumpHeight, jumpSpeed, i * angleStep).setScatterRadius(scatterRadius).setRandomness(randomness).setDelay(i * delayStep);
          });
        }

        JumpCurveTime(propList, endPosTemp, count, time, curve = null, curveSpeed = null) {
          let t = 0;
          let offT = count / time;

          for (let i = 0; i < count; i++) {
            this.jumpCurve(propList[i], endPosTemp).setDelay(t).setCurveRange(curve).setCurveRangeSpeed(curveSpeed);
            t += offT;
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2edb51f2f57b638345a2b9d561f476b67029b574.js.map