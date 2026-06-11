// import { _decorator, Component, Node, Prefab, v3, Vec3 } from 'cc';
// import { Rope } from './Rope';
// import { GameInfo } from '../Common/GameInfo';
// import { MoveCtrl } from '../CharacterCtrl/MoveCtrl';
// import { PrefabPathEnum } from '../Common/CommonEnum';
// const { ccclass, property } = _decorator;
// /**晃动幅度 */
// const CORD_POWER: number = 12;
// @ccclass('RopeManager')
// export class RopeManager extends Component {

//     private ropeMap: Map<Node, Rope> = new Map<Node, Rope>();

//     private lastPosMap: Map<Node, Vec3> = new Map<Node, Vec3>();

//     @property(Node)
//     public springTriggerNode: Node = null;

//     private endNodeWoPos: Vec3;

//     protected onLoad(): void {
//         this.endNodeWoPos = v3(0, 10, -10);
//         GameInfo.instance.ropeMgr = this;
//     }
//     showSpringTrigger() {
//         this.springTriggerNode.active = true;
//     }
//     public transferNode(node: Node, nextNode: Node) {
//         let rope = this.ropeMap.get(node);
//         if (rope) {
//             this.ropeMap.delete(node);
//             this.ropeMap.set(nextNode, rope);
//             // 转移位置缓存
//             let lastPos = this.lastPosMap.get(node);
//             if (lastPos) {
//                 this.lastPosMap.delete(node);
//                 this.lastPosMap.set(nextNode, lastPos);
//             }
//             let move = node.getComponent(MoveCtrl);
//             if (move) move.moonWalkOff = true;
//             this.springTriggerNode.active = false;
//         }
//     }
//     public addNode(node: Node) {
//         let index = this.ropeMap.has(node);
//         if (!index) {
//             let rope = this.rope;
//             let pos = node.worldPosition
//             rope.initPos(pos, this.endNodeWoPos);
//             this.ropeMap.set(node, rope);
//             // 初始化位置缓存
//             this.lastPosMap.set(node, pos.clone());
//             let move = node.getComponent(MoveCtrl);
//             if (move) move.moonWalkOff = true;
//         }
//     }

//     public removeNode(node: Node) {
//         let index = this.ropeMap.has(node);
//         if (index) {
//             let rope = this.ropeMap.get(node);
//             rope.node.active = false;
//             this.ropeMap.delete(node);
//             // 清理位置缓存
//             this.lastPosMap.delete(node);
//             app.res.recoverByPool(rope.node)
//             let move = node.getComponent(MoveCtrl);
//             if (move) move.moonWalkOff = false;
//         }
//     }


//     private get rope() {
//         let rope = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.ROPE).getComponent(Rope);
//         this.node.addChild(rope.node);
//         rope.init();
//         if (!rope) {
//             return null;
//         }
//         rope.node.active = true;
//         return rope;
//     }


//     protected update(dt: number): void {
//         let worldPos = this.endNodeWoPos;
//         this.ropeMap.forEach((value: Rope, key: Node) => {
//             let pos = key.worldPosition;

//             // 获取上一帧位置，检查是否需要更新
//             let lastPos = this.lastPosMap.get(key);
//             let needUpdate = true;
//             if (lastPos) {
//                 // 使用平方距离避免开方运算，阈值 0.001 的平方为 0.000001
//                 let distanceSqr = Vec3.squaredDistance(pos, lastPos);
//                 needUpdate = distanceSqr > 0.000001;
//             }

//             // 只在位置变化时更新绳子
//             if (needUpdate) {
//                 value.setLine(pos, worldPos);
//                 // 更新位置缓存
//                 if (!lastPos) {
//                     this.lastPosMap.set(key, pos.clone());
//                 } else {
//                     lastPos.set(pos);
//                 }
//             }

//             if (value.isLengthChange > 0) {
//                 let pos = key.worldPosition
//                 let speed = 0;
//                 speed = CORD_POWER * value.isLengthChange * dt;
//                 let _vector = v3();
//                 Vec3.subtract(_vector, pos, worldPos);
//                 _vector.normalize().multiplyScalar(speed);
//                 _vector.add(pos);
//                 key.setWorldPosition(_vector);
//             }
//         });
//     }



// }


