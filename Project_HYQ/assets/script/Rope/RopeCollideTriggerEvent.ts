// import { _decorator, ccenum, Collider, Component, ITriggerEvent } from 'cc';
// import { ColliderTag } from '../Other/ColliderTag';
// import { ColliderGroupTag } from '../Common/CommonEnum';
// import { GameInfo } from '../Common/GameInfo';
// const { ccclass, property } = _decorator;

// enum RopeTiriggerState {
//     Add,
//     delete,
//     /**切换绳子起点 */
//     transfer,
// }
// ccenum(RopeTiriggerState);

// @ccclass('RopeCollideTriggerEvent')
// export class RopeCollideTriggerEvent extends Component {


//     private trigger: Collider;

//     @property({ type: RopeTiriggerState })
//     public state: RopeTiriggerState = RopeTiriggerState.Add;

//     onLoad() {
//         this.trigger = this.node.getComponent(Collider);
//         this.trigger.on("onTriggerEnter", this.onTriggerEnter, this);
//     }
//     onEnable() {
//         if (this.state == RopeTiriggerState.transfer) {
//             this.showRope();
//         }
//     }
//     showRope() {
//         GameInfo.instance.ropeMgr.addNode(this.node);
//     }
//     onTriggerEnter(event: ITriggerEvent) {
//         let tag = event.otherCollider.getComponent(ColliderTag);
//         if (tag && tag.tag == ColliderGroupTag.Player) {
//             if (this.state == RopeTiriggerState.Add) {
//                 // GameInfo.instance.ropeMgr.addNode(GameInfo.instance.buildingMgr.fishingBuild.getRopeNode());
//             } else if (this.state == RopeTiriggerState.delete) {
//                 // GameInfo.instance.ropeMgr.removeNode(GameInfo.instance.buildingMgr.fishingBuild.getRopeNode());
//             } else if (this.state == RopeTiriggerState.transfer) {
//                 // GameInfo.instance.ropeMgr.transferNode(this.node, GameInfo.instance.buildingMgr.fishingBuild.getRopeNode());
//             }
//         }
//     }
// }


