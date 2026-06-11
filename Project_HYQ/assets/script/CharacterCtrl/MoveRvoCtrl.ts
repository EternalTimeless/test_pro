// import { _decorator, v3, Vec3 } from 'cc';
// import { GameInfo } from '../Common/GameInfo';
// import { CharacterTag } from '../Common/CommonEnum';
// import { MoveFlowFieldCtrl } from './MoveFlowFieldCtrl';
// const { ccclass, property } = _decorator;
// //RVO控制移动, 同tag之间会互相躲避
// @ccclass('MoveRvoCtrl')
// export class MoveRvoCtrl extends MoveFlowFieldCtrl {
//     protected _rvoAgentId: number = -1;
//     public get rvoAgentId(): number {
//         return this._rvoAgentId;
//     }
//     /** 标记所属 */
//     public tag: string = "";
//     public set rvoAgentId(value: number) {
//         this._rvoAgentId = value;
//     }
//     private _posY: number = 0;
//     onLoad(): void {
//         super.onLoad();
//     }
//     protected onEnable(): void {
//         this.initAgentId();

//     }
//     protected onDisable(): void {
//         this.removeAgent();
//         this._rvoAgentId = -1;
//         this.tag = "";
//     }

//     public initAgentId() {
//         if (!GameInfo.instance.rvoMgr || !GameInfo.instance.rvoMgr.alreadyInit) {
//             console.warn("RVOManager not init");
//             return;
//         }
//         //怪物生成时设置出生点setWorldPosition不能马上获取worldPosition, 需要延迟到下一帧
//         this.scheduleOnce(() => {
//             if (this._rvoAgentId < 0) {
//                 this._posY = this.node.worldPosition.y;
//                 let tempVec2 = GameInfo.instance.rvoMgr.worldVec3ToRvoPos(this.node.worldPosition);
//                 let radius_ = 1;
//                 let maxSpeed_ = this.baseSpeed;
//                 let tag = CharacterTag.Monster;
//                 this.tag = tag.toString();
//                 this.rvoAgentId = GameInfo.instance.rvoMgr.rvo.addAgent(tempVec2, radius_, maxSpeed_, this.tag);
//                 GameInfo.instance.rvoMgr.setAgentIdMap(this.rvoAgentId, this.node, this.tag);
//             }
//         }, 0.3);

//         // console.log("add agent " + this.rvoAgentId);
//     }
//     public removeAgent() {
//         if (this._rvoAgentId >= 0) {
//             GameInfo.instance.rvoMgr.removeAgent(this._rvoAgentId, CharacterTag.Monster.toString());
//             // console.log("remove agent " + this.rvoAgentId);
//             this._rvoAgentId = -1;
//         }
//     }
//     /**
//      * 继承  移动角色
//      * @param direction 移动方向
//      */
//     move(direction: Vec3) {
//         super.move(direction);
//         this.updateRvoPrefVelocity(direction);
//     }
//     protected updateRvoPrefVelocity(direction: Vec3) {
//         if (this._rvoAgentId >= 0) {
//             // 传入的direction需要乘上速度
//             Vec3.multiplyScalar(this._tempVec3, v3(direction.x, 0, direction.z), this.baseSpeed);
//             let rvoPrefVelocity = GameInfo.instance.rvoMgr.worldVec3ToRvoPos(this._tempVec3);
//             GameInfo.instance.rvoMgr.rvo.setAgentPrefVelocity(this.rvoAgentId, rvoPrefVelocity);

//             // 调试日志
//             if (direction.x !== 0 || direction.z !== 0) {
//                 // console.log(`[RVO] 设置期望速度 - agentId: ${this.rvoAgentId}, 方向: (${direction.x.toFixed(2)}, ${direction.z.toFixed(2)}), 速度: ${this.baseSpeed}, RVO速度: (${rvoPrefVelocity.x.toFixed(2)}, ${rvoPrefVelocity.y.toFixed(2)})`);
//             }
//         }
//     }
//     //暂停移动
//     stop() {
//         super.stop();
//         this.updateRvoPrefVelocity(Vec3.ZERO);
//     }
//     stopActiveMovement() {
//         super.stopActiveMovement();
//         this.updateRvoPrefVelocity(Vec3.ZERO);
//     }
//     /**
//      * 检查RVO位置和节点位置是否不同步
//      * @param rvoPos RVO系统中的位置
//      * @returns 如果位置不同步返回true
//      */
//     private isPositionOutOfSync(rvoPos: any): boolean {
//         if (!rvoPos) return true;

//         const worldPos = GameInfo.instance.rvoMgr.rvoPosToWorldVec3(rvoPos);
//         const nodePos = this.node.worldPosition;
//         const dx = worldPos.x - nodePos.x;
//         const dz = worldPos.z - nodePos.z;
//         const distanceSq = dx * dx + dz * dz;

//         // 如果距离超过0.5米，认为不同步
//         return distanceSq > 0.25;
//     }

//     //重写位置更新
//     updateMovePosition(dt: number) {
//         // 如果位置更新被锁定，不执行任何位置设置
//         if (this.isPositionUpdateLocked) {
//             return;
//         }
//         // if (!this.isMoving) return
//         if (this._rvoAgentId >= 0) {
//             // 从RVO获取更新后的位置
//             let p = GameInfo.instance.rvoMgr.rvo.getAgentPosition(this.rvoAgentId);
//             if (p) {
//                 let worldPos = GameInfo.instance.rvoMgr.rvoPosToWorldVec3(p);

//                 // 边界限制：防止怪物跑出地图
//                 const mapMgr = GameInfo.instance.mapMgr;
//                 if (mapMgr && mapMgr.mapMinX !== 0) {
//                     const minX = mapMgr.mapMinX;
//                     const maxX = mapMgr.mapMaxX;
//                     const minZ = mapMgr.mapMinZ;
//                     const maxZ = mapMgr.mapMaxZ;

//                     // 检查是否超出边界
//                     const isOutOfBounds = worldPos.x < minX || worldPos.x > maxX || worldPos.z < minZ || worldPos.z > maxZ;
//                     if (isOutOfBounds) {
//                         console.warn(`[RVO] 怪物超出边界: (${worldPos.x.toFixed(2)}, ${worldPos.z.toFixed(2)}), 限制到: [${minX.toFixed(2)}, ${maxX.toFixed(2)}] x [${minZ.toFixed(2)}, ${maxZ.toFixed(2)}]`);
//                     }

//                     // 限制位置在地图范围内
//                     worldPos.x = Math.max(minX, Math.min(maxX, worldPos.x));
//                     worldPos.y = this._posY;
//                     worldPos.z = Math.max(minZ, Math.min(maxZ, worldPos.z));
//                 }

//                 this.node.setWorldPosition(worldPos);
//             }
//         } else {
//             super.updateMovePosition(dt);
//         }
//     }

// }


