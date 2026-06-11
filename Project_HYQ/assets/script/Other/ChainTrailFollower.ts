// import { _decorator, Component, Node, CCInteger, CCFloat, Vec3, v3 } from 'cc';
// import { MoveCtrl } from '../CharacterCtrl/MoveCtrl';
// import { TrailRecorder } from './TrailRecorder';

// const { ccclass, property } = _decorator;

// /**
//  * 沿前一节 TrailRecorder 的滞后点移动（不依赖 Hero 类型）
//  * 建议仅由 FollowChainManager 配置，避免与其它 AI 同时抢 MoveCtrl
//  */
// @ccclass('ChainTrailFollower')
// export class ChainTrailFollower extends Component {
//     @property({ type: Node, displayName: '前驱节点', tooltip: '运行时由管理器绑定，一般无需在编辑器填写' })
//     leader: Node | null = null;

//     @property({ type: CCInteger, displayName: '滞后采样点数', tooltip: '相对前驱轨迹滞后多少个采样间隔' })
//     lagSteps = 12;

//     @property({ type: CCFloat, displayName: '跟随速度', tooltip: '≤0 则使用 MoveCtrl.baseSpeed' })
//     followSpeed = 0;

//     private _leaderRecorder: TrailRecorder | null = null;
//     private _move: MoveCtrl | null = null;
//     private readonly _target = v3();
//     private _configured = false;

//     onLoad(): void {
//         this._move = this.getComponent(MoveCtrl);
//     }

//     /**
//      * @param leader 前一节节点（必须挂 TrailRecorder）
//      */
//     configure(leader: Node, lagSteps: number, followSpeed: number): void {
//         this.leader = leader;
//         this.lagSteps = Math.max(0, lagSteps);
//         this.followSpeed = followSpeed;
//         this._leaderRecorder = leader?.getComponent(TrailRecorder) ?? null;
//         this._configured = !!(leader && this._leaderRecorder && this._move);
//     }

//     /** 由 FollowChainManager.lateUpdate 调用，保证晚于本帧轨迹采样 */
//     tickFollow(): void {
//         if (!this.enabled || !this._configured || !this.leader?.isValid || !this._move) {
//             return;
//         }
//         if (!this._leaderRecorder) {
//             this._leaderRecorder = this.leader.getComponent(TrailRecorder);
//         }
//         if (!this._leaderRecorder) {
//             return;
//         }
//         let ok = this._leaderRecorder.getDelayedWorldPosition(this.lagSteps, this._target);
//         if (!ok) {
//             this.leader.getWorldPosition(this._target);
//         }
//         const speed = this.followSpeed > 0 ? this.followSpeed : this._move.baseSpeed;
//         this._move.moveToWorldPosition(this._target, speed);
//     }

//     clearDriveIntent(): void {
//         this._move?.stopActiveMovement();
//     }
// }
