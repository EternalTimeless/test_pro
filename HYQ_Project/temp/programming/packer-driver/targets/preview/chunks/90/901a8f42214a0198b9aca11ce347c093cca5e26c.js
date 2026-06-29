System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCBoolean, ccenum, CCFloat, geometry, Node, NodeSpace, PhysicsSystem, UITransform, v3, Vec3, LayerManager, UnityUpComponent, RockerManager, vectorMoveSpeed, vectorPower, vectorPower2, SceneType, RotationDrive, EventManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _class3, _crd, ccclass, property, MoveModEnum, MoveDrive;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfLayerManager(extras) {
    _reporterNs.report("LayerManager", "db://assets/Script/Base/LayerManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnityUpComponent(extras) {
    _reporterNs.report("UnityUpComponent", "db://assets/Script/Base/UnityUpComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRockerManager(extras) {
    _reporterNs.report("RockerManager", "db://assets/Script/functionS/Rocker/RockerManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfvectorMoveSpeed(extras) {
    _reporterNs.report("vectorMoveSpeed", "../../Tool/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfvectorPower(extras) {
    _reporterNs.report("vectorPower", "../../Tool/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfvectorPower2(extras) {
    _reporterNs.report("vectorPower2", "../../Tool/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSceneType(extras) {
    _reporterNs.report("SceneType", "../EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRotationDrive(extras) {
    _reporterNs.report("RotationDrive", "./RotationDrive", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../EventManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CCBoolean = _cc.CCBoolean;
      ccenum = _cc.ccenum;
      CCFloat = _cc.CCFloat;
      geometry = _cc.geometry;
      Node = _cc.Node;
      NodeSpace = _cc.NodeSpace;
      PhysicsSystem = _cc.PhysicsSystem;
      UITransform = _cc.UITransform;
      v3 = _cc.v3;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      LayerManager = _unresolved_2.default;
    }, function (_unresolved_3) {
      UnityUpComponent = _unresolved_3.UnityUpComponent;
    }, function (_unresolved_4) {
      RockerManager = _unresolved_4.default;
    }, function (_unresolved_5) {
      vectorMoveSpeed = _unresolved_5.vectorMoveSpeed;
      vectorPower = _unresolved_5.vectorPower;
      vectorPower2 = _unresolved_5.vectorPower2;
    }, function (_unresolved_6) {
      SceneType = _unresolved_6.SceneType;
    }, function (_unresolved_7) {
      RotationDrive = _unresolved_7.RotationDrive;
    }, function (_unresolved_8) {
      EventManager = _unresolved_8.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7dd53SywihDJYEz4oECLatZ", "MoveDrive", undefined);

      __checkObsolete__(['_decorator', 'CCBoolean', 'ccenum', 'CCFloat', 'CCInteger', 'Component', 'director', 'game', 'geometry', 'Node', 'NodeSpace', 'PhysicsSystem', 'UITransform', 'v3', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MoveModEnum", MoveModEnum = /*#__PURE__*/function (MoveModEnum) {
        MoveModEnum[MoveModEnum["RockerMove"] = 0] = "RockerMove";
        MoveModEnum[MoveModEnum["PosMove"] = 1] = "PosMove";
        MoveModEnum[MoveModEnum["vectorMove"] = 2] = "vectorMove";
        MoveModEnum[MoveModEnum["targetMove"] = 3] = "targetMove";
        MoveModEnum[MoveModEnum["aStar"] = 4] = "aStar";
        MoveModEnum[MoveModEnum["forwardMove"] = 5] = "forwardMove";
        MoveModEnum[MoveModEnum["MapCellMove"] = 6] = "MapCellMove";
        MoveModEnum[MoveModEnum["MapCellMovePos"] = 7] = "MapCellMovePos";
        MoveModEnum[MoveModEnum["RockerTouchMove"] = 8] = "RockerTouchMove";
        return MoveModEnum;
      }({}));

      ccenum(MoveModEnum);

      _export("MoveDrive", MoveDrive = (_dec = ccclass('MoveDrive'), _dec2 = property(Vec3), _dec3 = property({
        type: MoveModEnum
      }), _dec4 = property(CCFloat), _dec5 = property({
        visible() {
          return this.moveMod == MoveModEnum.vectorMove || this.moveMod == MoveModEnum.MapCellMove;
        }

      }), _dec6 = property(Vec3), _dec7 = property({
        visible() {
          return this.moveMod == MoveModEnum.PosMove || this.moveMod == MoveModEnum.MapCellMovePos;
        }

      }), _dec8 = property({
        type: Node,

        visible() {
          return this.moveMod == MoveModEnum.targetMove || this.moveMod == MoveModEnum.MapCellMove;
        }

      }), _dec9 = property(CCBoolean), _dec10 = property(CCBoolean), _dec11 = property({
        type: _crd && RotationDrive === void 0 ? (_reportPossibleCrUseOfRotationDrive({
          error: Error()
        }), RotationDrive) : RotationDrive,

        visible() {
          return this.isRot;
        }

      }), _dec12 = property({
        type: Vec3,

        visible() {
          return this.isRot;
        }

      }), _dec13 = property({
        type: CCFloat,

        visible() {
          return this.moveMod != MoveModEnum.RockerMove && this.moveMod != MoveModEnum.forwardMove;
        }

      }), _dec(_class = (_class2 = (_class3 = class MoveDrive extends (_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
        error: Error()
      }), UnityUpComponent) : UnityUpComponent) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "directionalLock", _descriptor, this);

          _initializerDefineProperty(this, "moveMod", _descriptor2, this);

          _initializerDefineProperty(this, "speed", _descriptor3, this);

          this.sceneType = (_crd && SceneType === void 0 ? (_reportPossibleCrUseOfSceneType({
            error: Error()
          }), SceneType) : SceneType).D2;

          _initializerDefineProperty(this, "vector", _descriptor4, this);

          this.rotationV3 = new Vec3();

          _initializerDefineProperty(this, "_pos", _descriptor5, this);

          this._isPos = false;

          _initializerDefineProperty(this, "target", _descriptor6, this);

          // 构造一条从原点出发，指向 Z 轴的射线
          this.outRay = new geometry.Ray();
          this.mask = 1 << 0;
          this.tempVe3 = new Vec3();
          this._faceVector = 0;
          this._isMove = false;
          this.tran = void 0;
          this._path = [];

          _initializerDefineProperty(this, "autoMove", _descriptor7, this);

          _initializerDefineProperty(this, "isRot", _descriptor8, this);

          _initializerDefineProperty(this, "rotDrive", _descriptor9, this);

          _initializerDefineProperty(this, "rotLock", _descriptor10, this);

          _initializerDefineProperty(this, "dis", _descriptor11, this);

          this._moonWalkOff = false;
          this._moonwalk = new Vec3(0, 0, 0);
          this.MoveX = 7.8;
          this.curTempPosV3 = new Vec3();
        }

        set pos(pos) {
          this._pos.set(pos);

          this._isPos = false;
          this._isMove = true;
        }

        get pos() {
          return this._pos;
        }

        set path(value) {
          this._path.length = 0;

          this._path.push(...value);

          this._isMove = true;
        }

        onLoad() {
          this.sceneType = (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
            error: Error()
          }), LayerManager) : LayerManager).instance.SceneType; // if (this.sceneType == SceneType.D2) {
          //     this.dis = 16;
          // } else {
          //     this.dis = 0.2;
          // }
        }

        start() {
          this.tran = this.node.getComponent(UITransform);
        }

        get moonWalkOff() {
          return this._moonWalkOff;
        }

        set moonWalkOff(value) {
          this._moonWalkOff = value; // if (value) {
          //     if (RockerManager.instance.isMove) {
          //         let rocker = RockerManager.instance.rockerDirection;
          //         this._moonwalk.set(rocker.x, 0, rocker.y);
          //     }
          // } else {
          //     this._moonwalk.set(0, 0, 0);
          // }
        }

        onEnable() {
          this.init();
        }

        init() {
          this._isMove = false;
          this._isPos = true;

          if (this.moveMod == MoveModEnum.RockerTouchMove) {
            (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
              error: Error()
            }), EventManager) : EventManager).instance.on(Node.EventType.TOUCH_START, this.rockerTouchStart, this);
          }
        }

        _update(dt) {
          if (this.autoMove) {
            this.MoveEvent(dt);
          }
        }
        /**需要自己去调用 */


        MoveEvent(deltaTime) {
          if (!MoveDrive.isMoveOk) {
            if (!MoveDrive.isGuideMoveOnly || !this.isGuideMoveMode()) {
              return;
            }
          }

          this.moveEvent(deltaTime);
        }

        isGuideMoveMode() {
          return this.moveMod == MoveModEnum.RockerMove || this.moveMod == MoveModEnum.RockerTouchMove;
        }

        moveEvent(deltaTime) {
          switch (this.moveMod) {
            case MoveModEnum.RockerMove:
              {
                this.rockerMove(deltaTime);
                break;
              }

            case MoveModEnum.PosMove:
              {
                if (!this._isPos) {
                  this.PosMove(deltaTime);
                }

                break;
              }

            case MoveModEnum.vectorMove:
              {
                this.vectroMove(this.vector, deltaTime);
                break;
              }

            case MoveModEnum.targetMove:
              {
                this.targetMove(deltaTime);
                break;
              }

            case MoveModEnum.aStar:
              {
                this.aStarMove(deltaTime);
                break;
              }

            case MoveModEnum.forwardMove:
              {
                this.forwardMove(deltaTime);
                break;
              }

            case MoveModEnum.MapCellMove:
            case MoveModEnum.MapCellMovePos:
              {
                // this.mapCellMovePos(deltaTime);
                break;
              }
          }
        }

        rockerMove(dt) {
          if ((_crd && RockerManager === void 0 ? (_reportPossibleCrUseOfRockerManager({
            error: Error()
          }), RockerManager) : RockerManager).instance.isMove) {
            var rocker = (_crd && RockerManager === void 0 ? (_reportPossibleCrUseOfRockerManager({
              error: Error()
            }), RockerManager) : RockerManager).instance.rockerDirection;
            var pos = this.node.worldPosition;
            this.tempVe3.set(pos);
            this.tempVe3.y += 1;
            this.vector.set(-rocker.x, 0, rocker.y);
            this.vector.multiplyScalar(10);
            this.vector.add(this.tempVe3);
            geometry.Ray.fromPoints(this.outRay, this.tempVe3, this.vector);
            var bResult = PhysicsSystem.instance.raycast(this.outRay, this.mask, 0.25, false);

            if (!bResult) {
              this.vector.set(-rocker.x, 0, rocker.y);
              this.vectroMove(this.vector, dt);
            }
          } else {
            this._isMove = false;
          }
        }

        PosMove(dt) {
          var disSq = Vec3.squaredDistance(this.node.worldPosition, this._pos);
          var frameDistSq = this.speed * dt;
          frameDistSq *= frameDistSq; // 本帧移动距离的平方
          // 防止过冲：使用平方距离比较，避免开方运算

          if (disSq < this.dis * this.dis || disSq <= frameDistSq) {
            this.node.setWorldPosition(this._pos);
            this._isPos = true;
            this._isMove = false;
          } else {
            var vector = (_crd && vectorMoveSpeed === void 0 ? (_reportPossibleCrUseOfvectorMoveSpeed({
              error: Error()
            }), vectorMoveSpeed) : vectorMoveSpeed)(this.node.worldPosition, this._pos);
            vector.y = 0;
            this.vectroMove(vector, dt);
          }
        }

        moonWalkMove(dt) {
          if ((_crd && RockerManager === void 0 ? (_reportPossibleCrUseOfRockerManager({
            error: Error()
          }), RockerManager) : RockerManager).instance.isMove) {
            var rocker = (_crd && RockerManager === void 0 ? (_reportPossibleCrUseOfRockerManager({
              error: Error()
            }), RockerManager) : RockerManager).instance.rockerDirection;
            var x = (rocker.x - this._moonwalk.x) * 0.025;
            var y = (rocker.y - this._moonwalk.z) * 0.025;

            this._moonwalk.set(this._moonwalk.x + x, 0, this._moonwalk.z + y); // this.V2Move(this._moonwalk.x, this._moonwalk.z, dt);

          } else if (this._moonwalk != Vec3.ZERO) {
            this._moonwalk.x -= this._moonwalk.x * 0.025;
            this._moonwalk.z -= this._moonwalk.z * 0.025;

            if (Math.abs(this._moonwalk.x) < 0.01) {
              this._moonwalk.x = 0;
            }

            if (Math.abs(this._moonwalk.z) < 0.01) {
              this._moonwalk.z = 0;
            }

            if (this._moonwalk.x == 0 && this._moonwalk.z == 0) {
              this._isMove = false;
            } else {// this.V2Move(this._moonwalk.x, this._moonwalk.z, dt);
            }
          } else {
            this._isMove = false;
          }
        }

        targetMove(dt) {
          if (this.target == null) {
            this._isMove = false;
          } else {
            var disSq = Vec3.squaredDistance(this.node.worldPosition, this.target.worldPosition);
            var frameDistSq = this.speed * dt;
            frameDistSq *= frameDistSq; // 防止过冲：使用平方距离比较

            if (disSq < this.dis * this.dis || disSq <= frameDistSq) {
              this._isMove = false;
            } else {
              var vector = (_crd && vectorPower === void 0 ? (_reportPossibleCrUseOfvectorPower({
                error: Error()
              }), vectorPower) : vectorPower)(this.node, this.target);
              this.vectroMove(vector, dt);
            }
          }
        }

        vectroMove(vector, dt) {
          var pos = this.node.position;
          var sp = this.speed * dt;
          this.rotationV3.set(vector);
          vector.multiply(this.directionalLock);
          vector.normalize();

          if (this.sceneType == (_crd && SceneType === void 0 ? (_reportPossibleCrUseOfSceneType({
            error: Error()
          }), SceneType) : SceneType).D2) {
            this._faceVector = vector.x / Math.abs(vector.x);
            this.node.setPosition(pos.x + vector.x * sp, pos.y + vector.y * sp);
            this.tran.priority = -this.node.position.y;
          } else {
            this._faceVector = -vector.x / Math.abs(vector.x); // if (this.tran) {
            // this.tran.priority = -this.node.position.z;
            // }

            this.node.setPosition(pos.x + vector.x * sp, pos.y + vector.y * sp, pos.z + vector.z * sp);

            if (this.isRot && this.rotDrive) {
              this.rotationV3.multiply(this.rotLock);
              this.rotationV3.normalize();
              this.rotDrive.vector = this.rotationV3;
              this.rotDrive.rotatLerpLookVector(dt);
            }
          }

          this._isMove = true;
        }

        aStarMove(deltaTime) {
          if (!this._path.length) {
            this._isMove = false;
            return;
          }

          var currentNode = this._path[0];
          var disSq = Vec3.squaredDistance(this.node.worldPosition, currentNode);
          var frameDistSq = this.speed * deltaTime;
          frameDistSq *= frameDistSq; // 防止过冲：使用平方距离比较

          if (disSq < this.dis * this.dis || disSq <= frameDistSq) {
            // 到达当前节点，移除并检查下一个
            this._path.splice(0, 1);

            if (!this._path.length) {
              this._isMove = false;
              return;
            }
          } // 移动向下一个节点


          currentNode = this._path[0];
          var vector = (_crd && vectorPower2 === void 0 ? (_reportPossibleCrUseOfvectorPower2({
            error: Error()
          }), vectorPower2) : vectorPower2)(this.node.worldPosition, currentNode);
          this.vectroMove(vector, deltaTime);
        }

        forwardMove(dt) {
          var vector = this.node.forward;
          Vec3.multiplyScalar(this.vector, vector, -this.speed * dt);
          this.node.translate(this.vector, NodeSpace.WORLD);
        }

        get faceVector() {
          return this._faceVector;
        }

        get isMove() {
          return this._isMove;
        }

        set isMove(value) {
          this._isMove = value;
        }

        get isPos() {
          return this._isPos;
        }

        rockerTouchMove(x) {
          // console.log('rockerTouchMove', x);
          if ((_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
            error: Error()
          }), UnityUpComponent) : UnityUpComponent).isStop) {
            return;
          }

          var posX = x * this.speed + this.curTempPosV3.x;

          if (posX <= this.MoveX && posX >= -this.MoveX) {
            this._isMove = true;
            this.node.x = posX;
          } else {
            if (posX >= this.MoveX) {
              posX = this.MoveX;
            } else if (posX <= -this.MoveX) {
              posX = -this.MoveX;
            }

            this.node.x = posX;
            this._isMove = false;
          } // const x2 = this.node.x;
          // if (x2 < this.MoveX && x > 0 || x2 > -this.MoveX && x < 0) {
          //     const dt = game.deltaTime;
          //     let x2 = this.node.x + x * dt * this.speed;
          //     this.node.setPosition(x2, this.node.y, this.node.z);
          //     this._isMove = true;
          // } else {
          //     this._isMove = false;
          // }

        }

        rockerTouchEnd() {
          this._isMove = false;
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.off(Node.EventType.TOUCH_MOVE, this.rockerTouchMove);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.off(Node.EventType.TOUCH_END, this.rockerTouchEnd);
        }

        rockerTouchStart() {
          this.node.getPosition(this.curTempPosV3);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.on(Node.EventType.TOUCH_MOVE, this.rockerTouchMove, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.on(Node.EventType.TOUCH_END, this.rockerTouchEnd, this);
        } // private mapCellMovePos(dt: number) {
        //     if (!this.doYouNeedToMove) {
        //         this._isMove = false;
        //         return;
        //     }
        //     // 防止过冲：当需要移动时，检查本帧是否会超过目标
        //     let targetPos = this.moveMod == MoveModEnum.MapCellMove ? this.target.worldPosition : this.pos;
        //     let disSq = Vec3.squaredDistance(this.node.worldPosition, targetPos);
        //     let frameDistSq = this.speed * dt;
        //     frameDistSq *= frameDistSq;
        //     // 如果距离小于阈值或小于一帧移动距离，停止移动
        //     if (disSq < this.dis * this.dis || disSq <= frameDistSq) {
        //         this._isMove = false;
        //         return;
        //     }
        //     this.vectroMove(this.vector, dt);
        // }
        // public get doYouNeedToMove() {
        //     let move = false
        //     switch (this.moveMod) {
        //         case MoveModEnum.MapCellMove: {
        //             if (this.target) {
        //                 const pos = this.target.worldPosition;
        //                 this.vector.set(MapCellManager.instance.getFlowCell(this.node.worldPosition, pos));
        //                 const l = this.vector.length();
        //                 // console.log(this.node.name, 'vector', this.vector, l);
        //                 if (l == 0) {
        //                     let disSq = Vec3.squaredDistance(this.node.worldPosition, pos);
        //                     move = disSq > this.dis * this.dis;
        //                     if (move) {
        //                         this.vector.set(vectorPower2(this.node.worldPosition, pos, 1, 0, true));
        //                     }
        //                 } else {
        //                     move = true;
        //                 }
        //             }
        //             break;
        //         }
        //         case MoveModEnum.MapCellMovePos: {
        //             this.vector.set(MapCellManager.instance.getFlowCell(this.node.worldPosition, this.pos));
        //             const l = this.vector.length();
        //             if (l == 0) {
        //                 let disSq = Vec3.squaredDistance(this.node.worldPosition, this.pos);
        //                 move = disSq > this.dis * this.dis;
        //                 if (move) {
        //                     this.vector.set(vectorPower2(this.node.worldPosition, this.pos, 1, 0));
        //                 }
        //             } else {
        //                 move = true;
        //             }
        //             break;
        //         }
        //         case MoveModEnum.RockerMove: {
        //             move = RockerManager.instance.isMove;
        //             break;
        //         }
        //     }
        //     return move;
        // }


      }, _class3.isMoveOk = false, _class3.isGuideMoveOnly = false, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "directionalLock", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Vec3(Vec3.ONE);
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "moveMod", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return MoveModEnum.PosMove;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "speed", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 200;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "vector", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return v3();
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_pos", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Vec3();
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "pos", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "pos"), _class2.prototype), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "target", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "autoMove", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "isRot", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "rotDrive", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "rotLock", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Vec3(Vec3.ONE);
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "dis", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 64;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=901a8f42214a0198b9aca11ce347c093cca5e26c.js.map