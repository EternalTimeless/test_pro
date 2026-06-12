import { _decorator, CCBoolean, ccenum, CCFloat, CCInteger, Component, director, game, geometry, Node, NodeSpace, PhysicsSystem, UITransform, v3, Vec3 } from 'cc';
import LayerManager from 'db://assets/Script/Base/LayerManager';
import { UnityUpComponent } from 'db://assets/Script/Base/UnityUpComponent';
import RockerManager from 'db://assets/Script/functionS/Rocker/RockerManager';
import { vectorMoveSpeed, vectorPower, vectorPower2 } from '../../Tool/Index';
import { SceneType } from '../EnumList';
import { RotationDrive } from './RotationDrive';
import EventManager from '../EventManager';

const { ccclass, property } = _decorator;
export enum MoveModEnum {
    RockerMove,
    PosMove,
    vectorMove,
    targetMove,
    aStar,
    forwardMove,
    MapCellMove,
    MapCellMovePos,
    RockerTouchMove,
}
ccenum(MoveModEnum)

@ccclass('MoveDrive')
export class MoveDrive extends UnityUpComponent {

    @property(Vec3)
    public directionalLock: Vec3 = new Vec3(Vec3.ONE);



    @property({ type: MoveModEnum })
    public moveMod: MoveModEnum = MoveModEnum.PosMove;

    @property(CCFloat)
    public speed = 200;

    public sceneType: SceneType = SceneType.D2;
    @property({
        visible(this: MoveDrive) {
            return this.moveMod == MoveModEnum.vectorMove || this.moveMod == MoveModEnum.MapCellMove;
        }
    })
    public vector: Vec3 = v3();



    private rotationV3: Vec3 = new Vec3();

    @property(Vec3)
    private _pos: Vec3 = new Vec3();
    @property({
        visible(this: MoveDrive) {
            return this.moveMod == MoveModEnum.PosMove || this.moveMod == MoveModEnum.MapCellMovePos;
        }
    })
    public set pos(pos: Vec3) {
        this._pos.set(pos);
        this._isPos = false;
        this._isMove = true;
    }
    public get pos() {
        return this._pos;
    }
    private _isPos: boolean = false;

    @property({
        type: Node, visible(this: MoveDrive) {
            return this.moveMod == MoveModEnum.targetMove || this.moveMod == MoveModEnum.MapCellMove;
        }
    })
    public target: Node;

    // 构造一条从原点出发，指向 Z 轴的射线
    private outRay = new geometry.Ray();

    private mask = 1 << 0;

    private tempVe3: Vec3 = new Vec3();


    private _faceVector: number = 0;

    private _isMove: boolean = false;

    private tran: UITransform;


    private _path: Vec3[] = [];

    public set path(value: Vec3[]) {
        this._path.length = 0;
        this._path.push(...value);
        this._isMove = true;
    }

    @property(CCBoolean)
    public autoMove: boolean = false;

    @property(CCBoolean)
    public isRot: boolean = false;
    @property({
        type: RotationDrive, visible(this: MoveDrive) {
            return this.isRot;
        }
    })
    public rotDrive: RotationDrive;
    @property({
        type: Vec3, visible(this: MoveDrive) {
            return this.isRot;
        }
    })
    public rotLock: Vec3 = new Vec3(Vec3.ONE);
    public static isMoveOk: boolean = false;

    @property({
        type: CCFloat, visible(this: MoveDrive) {
            return this.moveMod != MoveModEnum.RockerMove && this.moveMod != MoveModEnum.forwardMove;
        }
    })
    public dis: number = 64;
    protected onLoad(): void {
        this.sceneType = LayerManager.instance.SceneType;
        // if (this.sceneType == SceneType.D2) {
        //     this.dis = 16;
        // } else {
        //     this.dis = 0.2;
        // }
    }

    protected start(): void {
        this.tran = this.node.getComponent(UITransform);
    }


    private _moonWalkOff: boolean = false;

    public get moonWalkOff() {
        return this._moonWalkOff;
    }
    public set moonWalkOff(value: boolean) {
        this._moonWalkOff = value;
        // if (value) {

        //     if (RockerManager.instance.isMove) {
        //         let rocker = RockerManager.instance.rockerDirection;
        //         this._moonwalk.set(rocker.x, 0, rocker.y);
        //     }
        // } else {
        //     this._moonwalk.set(0, 0, 0);
        // }
    }

    private _moonwalk: Vec3 = new Vec3(0, 0, 0);

    protected onEnable(): void {
        this.init();
    }

    public init() {
        this._isMove = false;
        this._isPos = true;
        if (this.moveMod == MoveModEnum.RockerTouchMove) {
            EventManager.instance.on(Node.EventType.TOUCH_START, this.rockerTouchStart, this);

        }
    }


    protected _update(dt: number): void {
        if (this.autoMove) {
            this.MoveEvent(dt);
        }
    }

    /**需要自己去调用 */
    public MoveEvent(deltaTime: number) {
        if (!MoveDrive.isMoveOk) {
            return;
        }
        this.moveEvent(deltaTime);
    }

    public moveEvent(deltaTime: number) {
        switch (this.moveMod) {
            case MoveModEnum.RockerMove: {


                this.rockerMove(deltaTime);

                break;
            }
            case MoveModEnum.PosMove: {
                if (!this._isPos) {

                    this.PosMove(deltaTime);
                }
                break;
            }
            case MoveModEnum.vectorMove: {
                this.vectroMove(this.vector, deltaTime);
                break;
            }
            case MoveModEnum.targetMove: {
                this.targetMove(deltaTime);
                break;
            }
            case MoveModEnum.aStar: {
                this.aStarMove(deltaTime);
                break;
            }
            case MoveModEnum.forwardMove: {
                this.forwardMove(deltaTime);
                break;
            }
            case MoveModEnum.MapCellMove:
            case MoveModEnum.MapCellMovePos: {
                // this.mapCellMovePos(deltaTime);
                break;
            }
        }
    }

    private rockerMove(dt: number) {
        if (RockerManager.instance.isMove) {
            let rocker = RockerManager.instance.rockerDirection;
            let pos = this.node.worldPosition;
            this.tempVe3.set(pos);
            this.tempVe3.y += 1;
            this.vector.set(-rocker.x, 0, rocker.y);
            this.vector.multiplyScalar(10);
            this.vector.add(this.tempVe3);
            geometry.Ray.fromPoints(this.outRay, this.tempVe3, this.vector);
            const bResult = PhysicsSystem.instance.raycast(this.outRay, this.mask, 0.25, false);
            if (!bResult) {
                this.vector.set(-rocker.x, 0, rocker.y);
                this.vectroMove(this.vector, dt);
            }
        } else {
            this._isMove = false;
        }
    }

    private PosMove(dt: number) {
        let disSq = Vec3.squaredDistance(this.node.worldPosition, this._pos);
        let frameDistSq = this.speed * dt;
        frameDistSq *= frameDistSq;  // 本帧移动距离的平方

        // 防止过冲：使用平方距离比较，避免开方运算
        if (disSq < this.dis * this.dis || disSq <= frameDistSq) {
            this.node.setWorldPosition(this._pos);
            this._isPos = true;
            this._isMove = false;
        } else {
            let vector = vectorMoveSpeed(this.node.worldPosition, this._pos);
            vector.y = 0;
            this.vectroMove(vector, dt);
        }
    }
    private moonWalkMove(dt: number) {
        if (RockerManager.instance.isMove) {
            let rocker = RockerManager.instance.rockerDirection;
            let x = (rocker.x - this._moonwalk.x) * 0.025;
            let y = (rocker.y - this._moonwalk.z) * 0.025;
            this._moonwalk.set(this._moonwalk.x + x, 0, this._moonwalk.z + y);
            // this.V2Move(this._moonwalk.x, this._moonwalk.z, dt);

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
            } else {
                // this.V2Move(this._moonwalk.x, this._moonwalk.z, dt);
            }
        } else {
            this._isMove = false;
        }
    }


    private targetMove(dt: number) {
        if (this.target == null) {
            this._isMove = false;
        } else {
            let disSq = Vec3.squaredDistance(this.node.worldPosition, this.target.worldPosition);
            let frameDistSq = this.speed * dt;
            frameDistSq *= frameDistSq;

            // 防止过冲：使用平方距离比较
            if (disSq < this.dis * this.dis || disSq <= frameDistSq) {
                this._isMove = false;
            } else {
                let vector = vectorPower(this.node, this.target);
                this.vectroMove(vector, dt);
            }
        }
    }


    private vectroMove(vector: Vec3, dt: number) {
        let pos = this.node.position;
        let sp = this.speed * dt;
        this.rotationV3.set(vector);
        vector.multiply(this.directionalLock);
        vector.normalize();
        if (this.sceneType == SceneType.D2) {
            this._faceVector = vector.x / Math.abs(vector.x);
            this.node.setPosition(pos.x + vector.x * sp, pos.y + vector.y * sp);
            this.tran.priority = -this.node.position.y;
        } else {
            this._faceVector = -vector.x / Math.abs(vector.x);
            // if (this.tran) {
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


    private aStarMove(deltaTime: number): void {
        if (!this._path.length) {
            this._isMove = false;
            return;
        }
        let currentNode: Vec3 = this._path[0];
        let disSq = Vec3.squaredDistance(this.node.worldPosition, currentNode);
        let frameDistSq = this.speed * deltaTime;
        frameDistSq *= frameDistSq;

        // 防止过冲：使用平方距离比较
        if (disSq < this.dis * this.dis || disSq <= frameDistSq) {
            // 到达当前节点，移除并检查下一个
            this._path.splice(0, 1);
            if (!this._path.length) {
                this._isMove = false;
                return;
            }
        }

        // 移动向下一个节点
        currentNode = this._path[0];
        let vector = vectorPower2(this.node.worldPosition, currentNode);
        this.vectroMove(vector, deltaTime);
    }


    private forwardMove(dt: number) {
        let vector = this.node.forward;
        Vec3.multiplyScalar(this.vector, vector, -this.speed * dt);
        this.node.translate(this.vector, NodeSpace.WORLD);

    }


    public get faceVector() {
        return this._faceVector;
    }

    public get isMove() {
        return this._isMove;
    }

    public set isMove(value: boolean) {
        this._isMove = value;
    }

    public get isPos() {
        return this._isPos;
    }

    public MoveX: number = 7.8;
    private rockerTouchMove(x: number) {
        // console.log('rockerTouchMove', x);
        if (UnityUpComponent.isStop) {
            return;
        }

        let posX = x * this.speed + this.curTempPosV3.x;
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
        }
        // const x2 = this.node.x;

        // if (x2 < this.MoveX && x > 0 || x2 > -this.MoveX && x < 0) {
        //     const dt = game.deltaTime;
        //     let x2 = this.node.x + x * dt * this.speed;

        //     this.node.setPosition(x2, this.node.y, this.node.z);
        //     this._isMove = true;
        // } else {
        //     this._isMove = false;
        // }



    }


    private curTempPosV3: Vec3 = new Vec3();

    private rockerTouchEnd() {
        this._isMove = false;
        EventManager.instance.off(Node.EventType.TOUCH_MOVE, this.rockerTouchMove);
        EventManager.instance.off(Node.EventType.TOUCH_END, this.rockerTouchEnd);
    }

    private rockerTouchStart() {
        this.node.getPosition(this.curTempPosV3);
        EventManager.instance.on(Node.EventType.TOUCH_MOVE, this.rockerTouchMove, this);
        EventManager.instance.on(Node.EventType.TOUCH_END, this.rockerTouchEnd, this);
    }

    // private mapCellMovePos(dt: number) {
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


}


