// import { _decorator, Component, Node, Vec2, Vec3 } from 'cc';
// import { Simulator } from './Simulator';
// import { Vector2 } from './Common';
// import { CharacterTag } from '../CommonEnum';
// import { GameInfo } from '../GameInfo';
// const { ccclass, property } = _decorator;

// @ccclass('RVOManager')
// export class RVOManager extends Component {


//     rvo: Simulator;

//     alreadyInit: boolean = false;

//     /** 敌人方的agentId和node映射 */
//     enemyMap: Map<number, Node> = new Map();
//     /** 玩家方的agentId和node映射 */
//     playerMap: Map<number, Node> = new Map();

//     onLoad() {
//         GameInfo.instance.rvoMgr = this;
//         this.rvo = Simulator.instance;

//         // 初始化RVO系统 设置默认参数
//         let defaultNeighborDist = 3; //搜索邻居的范围
//         let defaultMaxNeighbors = 5;
//         let defaultTimeHorizon = 0.5; //动态避障时间窗口
//         let defaultTimeHorizonObst = 0.1;
//         let defaultRadius = 1.5; //碰撞半径
//         let defaultMaxSpeed = 100;
//         let defaultVelocity = new Vector2(0, 0);
//         Simulator.instance.setAgentDefaults(defaultNeighborDist, defaultMaxNeighbors, defaultTimeHorizon, defaultTimeHorizonObst,
//             defaultRadius, defaultMaxSpeed, defaultVelocity);

//         this.alreadyInit = true;
//     }

//     start() {
//     }

//     update(deltaTime: number) {
//         if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin) return;
//         this.rvo.run(deltaTime);
//     }

//     public rvoPosToWorldVec3(rvoPos: Vec2 | Vector2) {
//         return new Vec3(rvoPos.x, 0, rvoPos.y);
//     }

//     public worldVec3ToRvoPos(worldPos: Vec3) {
//         return new Vector2(worldPos.x, worldPos.z);
//     }

//     setAgentIdMap(agentId: number, node: Node, tag: string) {
//         if (tag === CharacterTag.Monster.toString()) {
//             this.enemyMap.set(agentId, node);
//         } else if (tag === CharacterTag.Player.toString()) {
//             this.playerMap.set(agentId, node);
//         }
//     }

//     removeAgent(agentId: number, tag: string) {
//         if (tag === CharacterTag.Monster.toString()) {
//             this.enemyMap.delete(agentId);
//         }
//         else if (tag === CharacterTag.Player.toString()) {
//             this.playerMap.delete(agentId);
//         }
//         this.rvo.removeAgent(agentId);
//     }
// }


