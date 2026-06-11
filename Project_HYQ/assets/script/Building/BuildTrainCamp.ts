// import { _decorator, Component, Node, tween, v3 } from 'cc';
// import { GameInfo } from '../Common/GameInfo';
// import { ItemContainer } from '../Common/ItemContainer';
// import FlyManager from '../Manager/FlyManager';
// import { AudioMgr, SoundEnum } from '../Core/Managers/AudioMgr';
// import { PrefabPathEnum, WorkerType } from '../Common/CommonEnum';
// import { RoleSoldier } from '../Battle/RoleSoldier';
// import { RoleWorker } from '../Battle/RoleWorker';
// import { RolePeople } from '../Battle/RolePeople';
// const { ccclass, property } = _decorator;

// @ccclass('BuildTrainingCamp')
// export class BuildTrainingCamp extends Component {
//     @property({ type: Node, displayName: '建筑' })
//     private buildNode: Node = null!;
//     @property({ type: Node, displayName: '交互节点' })
//     public interactNode: Node = null;
//     @property({ type: Node, displayName: '转换节点' })
//     public convertNode: Node = null;
//     @property({ type: Node, displayName: '训练节点' })
//     public trainNode: Node = null;
//     @property({ type: ItemContainer, displayName: '道具堆放节点' })
//     public ItemContainer: ItemContainer = null!;
//     @property({ type: ItemContainer, displayName: '原材料堆放节点' })
//     public MaterialContainer: ItemContainer = null!;
//     @property({ type: ItemContainer, displayName: '金币堆放节点' })
//     public GoldStack: ItemContainer = null!;
//     @property({ type: [Node], displayName: '装备库' })
//     equipmentNodes: Node[] = [];
//     /**是否解锁铁匠 */
//     isUnlockIronsmith: boolean = false;
//     @property({ type: RoleWorker, displayName: '铁匠' })
//     ironsmith: RoleWorker = null!;
//     @property({ displayName: '转换比例' })
//     convertRotio: number = 4;
//     @property({ type: [Node], displayName: '排队节点' })
//     private queueNodes: Node[] = [];
//     public queueMax: number = 0;
//     // peopleList: RolePeople[] = [];
//     /**训练流程检测间隔 */
//     private trainCheckInterval: number = 0.2;
//     private trainCheckTimer: number = 0;
//     /**是否正在训练队首村民 */
//     private isTraining: boolean = false;
//     /**预留原材料 */
//     private reservedMaterial: number = 0;
//     remainMaterial: number = 0;
//     private reservedItem: number = 0;
//     remainItem: number = 0;

//     private _createSoldierTimer: number = 0;
//     private _createSoldierInterval: number = 0.4;
//     private _createSoldierCount: number = 0;
//     protected onLoad(): void {
//         this.equipmentNodes.forEach(node => {
//             node.active = false;
//         });
//         this.interactNode.active = false;
//         this.trainNode.active = false;
//         this.ironsmith.node.active = false;
//         this.queueMax = this.queueNodes.length;
//     }
//     upgradeTrainCamp() {
//         this.isUnlockIronsmith = true;
//         this.equipmentNodes.forEach(node => {
//             node.active = true;
//         });
//         this.ironsmith.initWorker(WorkerType.Forge, this.equipmentNodes[0]);
//         //NOTE 懒得新增类型, 直接用空采集点代替采集物
//         this.ironsmith.curCollectTarget = this.convertNode;
//         this.ironsmith.originalCollectScale = this.convertNode.getScale();
//         this.ironsmith.originalCollectPos = this.convertNode.getWorldPosition();
//         this.ironsmith.faceWorkTarget(this.convertNode);
//         GameInfo.instance.prefabMgr.createAddEffect(this.node.worldPosition, v3(1, 1, 0.8));
//     }
//     protected onEnable(): void {
//         this.scheduleOnce(() => {
//             // this.trainNode.active = true;
//             // this.trainNode.scale = v3(0.1, 0.1, 0.1)
//             // tween(this.trainNode)
//             //     .delay(0.1)
//             //     .to(0.1, { scale: v3(1.2, 1.2, 1.2) })
//             //     .to(0.1, { scale: v3(1, 1, 1) })
//             //     .start();

//             this.interactNode.active = true;
//             this.interactNode.scale = v3(0.1, 0.1, 0.1)
//             tween(this.interactNode)
//                 .delay(0.1)
//                 .to(0.1, { scale: v3(1.2, 1.2, 1.2) })
//                 .to(0.1, { scale: v3(1, 1, 1) })
//                 .start();
//         }, 0.3)
//     }
//     update(dt: number) {
//         if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin) return;
//         // if (!this.isUnlockIronsmith) return;

//         // this.trainCheckTimer += dt;
//         // if (this.trainCheckTimer >= this.trainCheckInterval) {
//         //     this.trainCheckTimer = 0;
//         //     this.checkTrainProcess();
//         // }
//         if (this._createSoldierCount > 0) {
//             this._createSoldierTimer += dt;
//             if (this._createSoldierTimer >= this._createSoldierInterval) {
//                 this._createSoldierTimer = 0;
//                 this.createSoldier();
//             }
//         }
//     }

//     /**将村民加入训练排队（仅铁匠解锁后，由 Hero 招募调用） */
//     // addPeopleToQueue(people: RolePeople) {
//     //     if (!this.isUnlockIronsmith || !people) return;
//     //     people.assignedQueueIndex = -1;
//     //     this.peopleList.push(people);
//     //     this.scheduleOnce(() => {
//     //         this.checkPeoplePosition();
//     //     }, 0.1);
//     // }
//     /**到达训练点后直接生成士兵：未解锁铁匠时不消耗武器；铁匠解锁且排队已满时也走此路径 */
//     onPeopleArrivedForDirectTrain(people: RolePeople) {
//         if (!people) return;
//         GameInfo.instance.prefabMgr.recoverPrefab(people.node);
//         this._createSoldierCount++;
//         // this.createSoldier();
//     }
//     onEggArrivedForDirectTrain() {
//         this._createSoldierCount++;
//         // this.createSoldier();
//     }
//     /**检查村民队列位置（参考 Shop） */
//     // checkPeoplePosition() {
//     //     const pathNodes = this.queueNodes;
//     //     for (let i = 0; i < this.peopleList.length; i++) {
//     //         const people = this.peopleList[i];
//     //         if (i < pathNodes.length) {
//     //             if (people.assignedQueueIndex !== i) {
//     //                 people.assignedQueueIndex = i;
//     //                 people.nextTarget(pathNodes[i]);
//     //                 people.onReachedCallback = () => {
//     //                     people.node.setWorldPosition(pathNodes[i].worldPosition);
//     //                 };
//     //             }
//     //         }
//     //     }
//     // }

//     /**训练流程（仅铁匠解锁）：队首就位且武器充足时执行 createSoldier */
//     // checkTrainProcess() {
//     //     if (!this.isUnlockIronsmith) return;
//     //     if (this.peopleList.length === 0) {
//     //         this.isTraining = false;
//     //         return;
//     //     }
//     //     if (this.ItemContainer.getItemCount() < 1) return;

//     //     const firstPeople = this.peopleList[0];
//     //     const isReady = firstPeople.assignedQueueIndex === 0 && !firstPeople.isMoving;
//     //     if (!this.isTraining && isReady) {
//     //         this.startTraining(firstPeople);
//     //     }
//     // }

//     /**开始训练（仅铁匠解锁）：消耗武器、回收村民、生成士兵 */
//     // startTraining(people: RolePeople) {
//     //     if (!this.isUnlockIronsmith || !people || this.ItemContainer.getItemCount() < 1) {
//     //         this.isTraining = false;
//     //         return;
//     //     }
//     //     this.isTraining = true;
//     //     const index = this.peopleList.indexOf(people);
//     //     if (index !== -1) {
//     //         this.peopleList.splice(index, 1);
//     //     }
//     //     this.checkPeoplePosition();
//     //     GameInfo.instance.prefabMgr.recoverPrefab(people.node);
//     //     this.createSoldier();
//     //     this.isTraining = false;
//     // }

//     /**预留原材料 */
//     updateMaterial(amount: number) {
//         this.remainMaterial += amount;
//     }
//     //不考虑飞行中的原材料, 判断原材料是否足够生产
//     checkMaterial() {
//         let cost = this.convertRotio;
//         if (this.MaterialContainer.getItemCount() < cost) return false;
//         return true;
//     }
//     /**转换原材料为道具 */
//     convertMaterialToItem() {
//         let cost = this.convertRotio;
//         if (this.MaterialContainer.getItemCount() < cost) return;
//         // 根据cost数量, 删除MaterialContainer中的item
//         for (let index = 0; index < cost; index++) {
//             let item = this.MaterialContainer.getLastItem()
//             if (item) {
//                 item.removeFromParent();
//                 GameInfo.instance.prefabMgr.recoverPrefab(item);
//             }
//         }
//         let prefabPath = PrefabPathEnum.COIN_WEAPON;
//         let con = this.ItemContainer;
//         FlyManager.instance.flyItem({
//             sourceWorldPos: this.convertNode.worldPosition,
//             targetNode: con.root,
//             targetLocalPos: con.preprocessData(),
//             prefabPath: prefabPath,
//             onComplete: (item) => {
//                 if (item) {
//                     con.addItem(item);
//                     // AudioMgr.instance.playSound(SoundEnum.sound_pushItem);
//                 }
//             },
//             flyParams: { radius: 2, power: 2, flyType: 0 }
//         })
//     }
//     createSoldier() {
//         if (this._createSoldierCount < 1) return;
//         this._createSoldierCount--;
//         const pef = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.SOLDIER);
//         if (!pef) return;
//         pef.setParent(GameInfo.instance.gameMgr.gameLayer);
//         let pos = this.trainNode.getWorldPosition();
//         pos.y = 0;
//         pef.setWorldPosition(pos);
//         GameInfo.instance.prefabMgr.createAddEffect(pos);
//         AudioMgr.instance.playSound(SoundEnum.Sound_Upgrade, 1.5);
//         const soldier = pef.getComponent(RoleSoldier);
//         GameInfo.instance.soldier = soldier;

//         if (GameInfo.step == 8 && GameInfo.instance.soldier.length > 1) {
//             GameInfo.instance.guideMgr.onGuideStep();
//         }
//         const soldierComp = soldier.getComponent(RoleSoldier);
//         if (!soldierComp) return;

//         soldierComp.hasArrivedAtTarget = false;
//         soldierComp.ArrivedAtTarget = GameInfo.instance.buildingMgr.outsidePointNode;
//         // NOTE: 已改为士兵碰撞触发的方式
//         // // 未解锁铁匠：不检查/消耗武器，士兵直接出城
//         // if (!this.isUnlockIronsmith) return;
//         // // 已解锁铁匠：消耗武器并装备
//         // this.equipSoldierFromContainer(soldierComp);
//     }

//     /**从武器容器取一件装备给士兵 */
//     // private equipSoldierFromContainer(soldierComp: RoleSoldier) {
//     //     if (this.ItemContainer.getItemCount() < 1) return;
//     //     FlyManager.instance.flyItem({
//     //         sourceContainer: this.ItemContainer,
//     //         targetNode: soldierComp.node,
//     //         targetLocalPos: v3(0, 0, 0),
//     //         prefabPath: PrefabPathEnum.COIN_WEAPON,
//     //         onComplete: (item) => {
//     //             if (item) {
//     //                 soldierComp.showEquipment(true);
//     //                 GameInfo.instance.prefabMgr.recoverPrefab(item);
//     //             }
//     //         }
//     //     });
//     //     // const item = this.ItemContainer.getLastItem();
//     //     // if (item) {
//     //     //     item.removeFromParent();
//     //     //     GameInfo.instance.prefabMgr.recoverPrefab(item);
//     //     // }
//     //     // soldierComp.showEquipment(true);
//     // }
// }


