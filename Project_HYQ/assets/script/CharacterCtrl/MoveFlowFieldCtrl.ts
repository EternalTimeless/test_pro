// import { _decorator } from 'cc';
// import { MoveCtrl } from './MoveCtrl';
// import { GameInfo } from '../Common/GameInfo';
// import { ColliderGroupTag } from '../Common/CommonEnum';
// import { MapCellManager } from '../MapCell/MapCellManager';
// const { ccclass, property } = _decorator;
// //流场寻路控制移动
// @ccclass('MoveFlowFieldCtrl')
// export class MoveFlowFieldCtrl extends MoveCtrl {
//     protected getNextStepNormalized() {

//         // 直接获取已经优化过的方向
//         let direction = MapCellManager.instance.getFlowCell(this.node.worldPosition, this.getTargetPoint(), true);

//         // console.log(`[MoveFlowField] 怪物位置: (${monsterPos.x.toFixed(2)}, ${monsterPos.z.toFixed(2)}), 目标位置: (${targetPos.x.toFixed(2)}, ${targetPos.z.toFixed(2)})`);
//         // console.log(`[MoveFlowField] 流场返回方向: (${direction.x.toFixed(2)}, ${direction.y.toFixed(2)}, ${direction.z.toFixed(2)}), 长度: ${direction.length().toFixed(2)}`);

//         // 如果流场返回零向量
//         if (direction.x === 0 && direction.y === 0 && direction.z === 0) {
//             console.warn(`[MoveFlowField] ⚠️ 流场方向为零向量`);
//             return direction;
//         }

//         // 流场返回的是离散方向(-1, 0, 1)，需要归一化为单位向量
//         direction.normalize();
//         // console.log(`[MoveFlowField] 归一化后方向: (${direction.x.toFixed(2)}, ${direction.y.toFixed(2)}, ${direction.z.toFixed(2)})`);

//         return direction;
//     }
//     protected getTargetPoint() {
//         let hero = GameInfo.instance.player;
//         //TODO: 后续有盟友需要跟随可以更新此处, 跟随点
//         return hero.node.worldPosition;
//     }
//     protected getTargetObjectType() {
//         return ColliderGroupTag.Player;
//     }
// }


