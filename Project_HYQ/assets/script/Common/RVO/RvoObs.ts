// import { _decorator, BoxCollider, Component, Node, Vec3, Quat, CCFloat, CCBoolean } from 'cc';
// import { Obstacle, Vector2 } from './Common';
// import { Simulator } from './Simulator';
// const { ccclass, property } = _decorator;

// /**
//  * Rvo的障碍物挂载脚本 3d场景中默认使用boxCollider组件来模拟障碍物 2d场景中使用PolygonCollider2D组件来模拟障碍物
//  */
// @ccclass('RvoObs')
// export class RvoObs extends Component {
//     @property({ type: BoxCollider, displayName: '碰撞器' })
//     protected boxCollider: BoxCollider = null;
//     /** 添加属性 碰撞器修正值，取值范围-0.8~+0.8 */
//     @property({ type: CCFloat, displayName: '碰撞器修正值', range: [-0.8, 0.8] })
//     protected colliderOffset: number = 0;
//     @property({ displayName: '是否自动注册' })
//     protected autoAdd: boolean = false;

//     protected _obs: Obstacle = null; // 标识障碍物

//     addObstacle(needProcessObsTree: boolean = true) {
//         // 注册RVO障碍物
//         let obsNode = this.node;
//         let worldPos = obsNode.worldPosition;
//         let scale = obsNode.scale;
//         let rotation = obsNode.rotation;

//         if (this.boxCollider) {
//             let worldPosArr: Vector2[] = [];
//             // 根据节点的scale、rotation和position 以及collider的size里的X和Z，来计算转换为2D碰撞盒的四个顶点，按逆时针顺序排列
//             const halfSizeX = this.boxCollider.size.x * scale.x / 2 * (1 + this.colliderOffset);
//             const halfSizeZ = this.boxCollider.size.z * scale.z / 2 * (1 + this.colliderOffset);

//             // 四个本地空间顶点
//             const localVertices = [
//                 new Vec3(-halfSizeX, 0, -halfSizeZ),
//                 new Vec3(halfSizeX, 0, -halfSizeZ),
//                 new Vec3(halfSizeX, 0, halfSizeZ),
//                 new Vec3(-halfSizeX, 0, halfSizeZ)
//             ];

//             // 将本地空间顶点转换为世界空间顶点
//             for (let i = 0; i < localVertices.length; i++) {
//                 const rotatedVertex = Vec3.transformQuat(new Vec3(), localVertices[i], rotation);
//                 const worldVertex = Vec3.add(new Vec3(), rotatedVertex, worldPos);
//                 worldPosArr.push(new Vector2(worldVertex.x, worldVertex.z));
//             }

//             let obsId = Simulator.instance.addObstacle(worldPosArr);
//             if (obsId !== -1) {
//                 this._obs = Simulator.instance.getObstacles()[obsId];
//                 // 构建障碍树比较消耗性能，同时添加多个障碍物时可以统一放到最后，一起构建
//                 needProcessObsTree && Simulator.instance.processObstacles();
//             }
//         }
//     }

//     protected onEnable(): void {
//         // 注册RVO障碍物
//         if (this.autoAdd) {
//             this.addObstacle();
//         }
//     }

//     protected onDisable(): void {
//         // 注销RVO障碍物
//         if (this._obs) {
//             Simulator.instance.removeObstacle(this._obs);
//             this._obs = null;
//         }
//     }
// }


