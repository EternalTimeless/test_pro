// import { _decorator, Component, EventTouch, Node, tween, v3, Vec3 } from 'cc';
// import { GameInfo } from '../Common/GameInfo';
// import { BuildType, BuildUnlockState, CommonEvent, PrefabPathEnum, WorkerType } from '../Common/CommonEnum';
// import { BuildBase } from '../Building/BuildBase';
// import { PushDown } from '../Other/PushDown';
// import { CameraCtrl } from '../CharacterCtrl/CameraCtrl';
// import { BuildWallCtrl } from '../Battle/BuildWallCtrl';
// import { RoleWorker } from '../Battle/RoleWorker';
// import { AudioMgr, SoundEnum } from '../Core/Managers/AudioMgr';
// import { ItemContainer } from '../Common/ItemContainer';
// import { MathUtil } from '../Extra/MathUtil';
// import { RolePeople } from '../Battle/RolePeople';
// import { BuildFishingMachine } from '../Building/BuildMachine';
// const { ccclass, property } = _decorator;

// @ccclass('BuildingManager')
// export class BuildingManager extends Component {
//     @property({ type: [BuildBase], displayName: '建筑列表' })
//     public buildList: BuildBase[] = [];
//     @property({ type: [BuildWallCtrl], displayName: '墙体列表' })
//     wallList: BuildWallCtrl[] = [];



//     @property({ type: Node, displayName: '鱼竿钓鱼交互节点' })
//     public fishingNode: Node = null!;
//     @property({ type: BuildFishingMachine, displayName: '钓鱼机' })
//     buildFishingMachine: BuildFishingMachine = null!;

//     @property({ type: BuildFishingMachine, displayName: '结束阶段钓鱼机' })
//     buildFishingMachineEnd: BuildFishingMachine = null!;

//     @property({ type: [Node], displayName: '闲逛路径列表' })
//     wanderPathList: Node[] = [];
//     @property({ type: [Node], displayName: '开始环境节点1' })
//     public start_envir1: Node[] = [];
//     @property({ type: [Node], displayName: '结束环境节点1' })
//     public end_envir1: Node[] = [];
//     @property({ type: Node, displayName: '开始相机视角节点' })
//     public startCameraNode: Node = null;
//     @property({ type: Node, displayName: '出口' })
//     outsidePointNode: Node = null!;



//     @property({ type: Node, displayName: '钓鱼堆放节点' })
//     fishingStackNode: Node = null!;
//     /**钓鱼堆放容器 */
//     @property({ type: ItemContainer, displayName: '钓鱼堆放容器' })
//     fishingStack: ItemContainer = null!;
//     @property({ type: Node, displayName: '钓鱼相机视角节点' })
//     fishingCameraNode: Node = null!;
//     @property({ type: Node, displayName: '工人钓鱼移动范围中心点(矩形)' })
//     WorkerFishingRangeCenter: Node = null!;
//     @property({ displayName: '工人钓鱼移动范围半径(矩形X)' })
//     WorkerFishingRangeX: number = 8;
//     @property({ displayName: '工人钓鱼移动范围半径(矩形Z)' })
//     WorkerFishingRangeZ: number = 10;
//     @property({ type: Node, displayName: '工人钓鱼视角' })
//     fishingWorkerCameraNode: Node = null!;
//     // ========================================
//     protected onLoad(): void {
//         // 设置单例
//         // GameInfo.instance.buildingMgr = this;
//         // input.on(Input.EventType.TOUCH_START, this.onMouseDown, this);
//         // input.on(Input.EventType.TOUCH_END, this.onMouseOver, this);
//         // input.on(Input.EventType.TOUCH_CANCEL, this.onMouseOver, this);
//     }
//     protected start(): void {
//         this.initBuilding();
//     }
//     update(dt: number) {
//         // CameraCtrl.instance.geometryRenderer.addCircle(v3(-7, 7, -25), 1, Color.GREEN, 20);
//         // CameraCtrl.instance.geometryRenderer.addLine(v3(-7, 7, -25), v3(0, 0, 0), Color.RED);
//         // this.drawRay()
//         this.checkCount(dt);
//     }
//     /**
//      * 初始化建筑
//     */
//     private initBuilding(): void {
//         this.buildList.forEach((build, index) => {
//             build.initBuildIndex(index);
//         });
//         this.start_envir1.forEach((node, index) => {
//             node.active = true;
//         });
//         this.end_envir1.forEach((node, index) => {
//             node.active = false;
//         });
//         this.fishingNode.active = false;
//     }
//     /**解锁完成回调 */
//     buildUnlockComplete(index: number) {
//         let build = this.buildList[index];
//         if (build.buildType == BuildType.IronMine) {
//             GameInfo.instance.guideMgr.onGuideStep();
//         }
//         if (build.buildType == BuildType.End) {
//             this.GameFlow_End();
//         }
//     }

//     /**激活建筑解锁 */
//     activeBuildUnlock(index: number) {
//         this.buildList[index].unlockState = BuildUnlockState.Active;
//     }
//     /**手动解锁建筑 */
//     unlockBuild(index: number) {
//         this.buildList[index].unlockState = BuildUnlockState.Builded;
//     }
//     /**建筑是否已解锁 */
//     buildUnlockStats(index: number) {
//         return this.buildList[index].unlockState === BuildUnlockState.Builded;
//     }
//     /**解锁钓鱼NPC时的特殊视角处理 */
//     closeupCamera() {
//         app.event.emit(CommonEvent.HideJoystick);
//         CameraCtrl.instance.moveToTarget(this.fishingWorkerCameraNode, 0.5, () => {
//             CameraCtrl.instance.zoomPerspective(62, 0.5, () => {
//                 this.scheduleOnce(() => {
//                     CameraCtrl.instance.zoomPerspective(52, 0.5, () => {
//                         CameraCtrl.instance.isCameraFollow = true;
//                         app.event.emit(CommonEvent.ShowJoystick);
//                         GameInfo.instance.guideMgr.onGuideStep();
//                     })
//                 }, 2)
//             })
//         })
//     }
//     GameFlow_End() {
//         this.start_envir1.forEach(node => {
//             node.active = false;
//         });
//         this.end_envir1.forEach(node => {
//             this.activeAnim(node);
//         });
//         app.event.emit(CommonEvent.HideJoystick);

//         // GameInfo.instance.guideMgr.onGuideStep();

//         const endMachine = this.buildFishingMachineEnd;
//         const hero = GameInfo.instance.player;
//         const moveDur = 0.5;

//         if (this.fishingCameraNode?.isValid) {
//             CameraCtrl.instance.moveToTarget(this.fishingCameraNode, moveDur, () => {
//                 if (endMachine?.isValid) {
//                     endMachine.node.active = true;
//                     endMachine.init();
//                     this.isEndPhase = true;
//                     endMachine.startEndPhaseFlow();
//                 }
//             });
//         }
//         if (hero?.node?.isValid && endMachine?.interactNode?.isValid) {
//             const target = endMachine.interactNode.worldPosition.clone();
//             target.y = hero.node.worldPosition.y;
//             //TODO 位置移动
//         }



//     }
//     private MaxPeopleCount: number = 18;
//     public peopleList: RolePeople[] = [];
//     public workerFishingPeopleList: RolePeople[] = [];

//     private checkCountTimer: number = 0;
//     private checkCountInterval: number = 1;
//     private isEndPhase: boolean = false;
//     checkCount(dt: number) {
//         if (!GameInfo.instance.Begin || GameInfo.instance.Pause || GameInfo.instance.Over) return;
//         if (this.isEndPhase) return;
//         if (GameInfo.step < 12) {
//             return;
//         }
//         this.checkCountTimer += dt;
//         if (this.checkCountTimer >= this.checkCountInterval) {
//             this.checkCountTimer = 0;
//             const targetCount = GameInfo.step < 22 ? this.MaxPeopleCount * 0.5 : this.MaxPeopleCount;
//             if (this.peopleList.length < targetCount) {
//                 let people = this.createPeople(0);
//                 if (people) {
//                     this.peopleList.push(people);
//                 }
//             }
//             if (GameInfo.step < 18) return;
//             //共用一套计时
//             if (this.workerFishingPeopleList.length < 8) {
//                 let people = this.createPeople(1);
//                 if (people) {
//                     this.workerFishingPeopleList.push(people);
//                 }
//             }
//         }
//     }
//     createPeople(type: number = 0): RolePeople | null {
//         // const role = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.PEOPLE);
//         // let pos = v3();
//         // if (type == 0) {
//         //     const center = GameInfo.instance.trackMgr.indicatorRangeCenter.worldPosition;
//         //     pos = MathUtil.getRandomPointInRect(center, v3(1, 0, 0), GameInfo.instance.trackMgr.indicatorRangeX, GameInfo.instance.trackMgr.indicatorRangeZ);
//         // } else if (type == 1) {
//         //     pos = MathUtil.getRandomPointInRect(this.WorkerFishingRangeCenter.worldPosition, v3(1, 0, 0), this.WorkerFishingRangeX, this.WorkerFishingRangeZ);
//         // }
//         // role.setParent(GameInfo.instance.gameMgr.gameLayer);
//         // role.setWorldPosition(pos);
//         // role.setScale(1, 1, 1);
//         // const people = role.getComponent(RolePeople);
//         // people.isInWater = true;
//         // if (type == 0) {
//         //     people.initWanderRange(GameInfo.instance.trackMgr.indicatorRangeCenter, GameInfo.instance.trackMgr.indicatorRangeX, GameInfo.instance.trackMgr.indicatorRangeZ);
//         // } else if (type == 1) {
//         //     people.initWanderRange(this.WorkerFishingRangeCenter, this.WorkerFishingRangeX, this.WorkerFishingRangeZ);
//         // }
//         // people.startRandomWander();
//         // return people;
//         return null;
//     }
//     removePeople(people: RolePeople) {
//         //每次直接查询2个列表, 避免漏删
//         this.peopleList = this.peopleList.filter(p => p !== people);
//         this.workerFishingPeopleList = this.workerFishingPeopleList.filter(p => p !== people);
//     }
//     /**
//      * 创建工人
//      * @param wpos 世界位置
//      * @param type 工人类型
//      */
//     // createWorker(wpos: Vec3, type: WorkerType, index?: number) {
//     //     const role = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.WORKER);
//     //     role.setParent(GameInfo.instance.gameMgr.gameLayer);
//     //     wpos.y = 0;
//     //     role.setWorldPosition(wpos);
//     //     GameInfo.instance.prefabMgr.createAddEffect(wpos);
//     //     AudioMgr.instance.playSound(SoundEnum.Sound_Upgrade, 1.5);
//     //     const worker = role.getComponent(RoleWorker);
//     //     // GameInfo.instance.worker = worker;
//     //     worker.initWorker(type);
//     //     if (type == 3) {
//     //         worker.curCollectTarget = this.buildWood.collectionItems[index];
//     //         worker.originalCollectScale = this.buildWood.itemsOriginalScale[index];
//     //         worker.originalCollectPos = this.buildWood.itemsOriginalPos[index];
//     //         worker.faceWorkTarget(worker.curCollectTarget);
//     //     }
//     //     if (type == 4) {
//     //         worker.curCollectTarget = this.buildMine.collectionItems[index];
//     //         worker.originalCollectScale = this.buildMine.collectionItems[index].getScale();
//     //         worker.originalCollectPos = this.buildMine.collectionItems[index].getWorldPosition();
//     //         worker.faceWorkTarget(worker.curCollectTarget);
//     //     }
//     //     return worker;
//     // }

//     /**激活节点动画, 缩放快速出现 */
//     activeAnim(node: Node) {
//         node.active = true;
//         // 部分障碍物存在scaleX为负值
//         const original = node.getScale();
//         node.scale = v3(0.2, 0.2, 0.2)
//         // GameInfo.instance.prefabMgr.createAddEffect(node.worldPosition);
//         tween(node)
//             .delay(0.1)
//             .to(0.1, { scale: v3(original.x * 1.2, original.y * 1.2, original.z * 1.2) })
//             .to(0.1, { scale: original })
//             .start();
//     }
//     // /** 
//     //  * 激活节点动画, 从空中坠落, 一般用于墙体连续解锁
//     //  */
//     // private activeWallAnim(root: Node, cb?: () => void, iterate: boolean = false): void {
//     //     root.active = true;
//     //     let len = root.children.length;
//     //     if (!iterate) len = 1;
//     //     let curIndex = 0;
//     //     root.children.forEach((node, index) => {
//     //         node.active = false;
//     //     });
//     //     // 递归函数，确保每次动画完成后再执行下一次
//     //     const animateNext = () => {
//     //         if (curIndex > len - 1) {
//     //             cb?.();
//     //             return; // 所有节点动画完成
//     //         }
//     //         //Tips: 所有子节点默认scale为1, 若存在特殊缩放, 请额外代码处理
//     //         let node = root.children[curIndex];
//     //         let originalWpos = node.worldPosition.clone();
//     //         node.setWorldPosition(originalWpos.x, originalWpos.y + 100, 0);
//     //         node.active = true;
//     //         GameInfo.instance.prefabMgr.createAddEffect(v3(originalWpos.x, originalWpos.y + 50, 0), v3(3, 3, 1));
//     //         tween(node)
//     //             .to(0.2, { worldPosition: v3(originalWpos.x, originalWpos.y, 0) }, { easing: easing.cubicIn })
//     //             .call(() => {
//     //                 curIndex++;
//     //                 animateNext(); // 动画完成后继续下一个
//     //             })
//     //             .start();
//     //     };
//     //     animateNext(); // 开始第一个动画
//     // }
//     // /**节点激活动画, 从空中弹性坠落, 果冻效果, 带形变效果, 不适合条状建筑 */
//     // activeBuildAnim(node: Node, cb?: () => void) {
//     //     node.active = true;
//     //     let originalWpos = node.worldPosition.clone();
//     //     node.setWorldPosition(originalWpos.x, originalWpos.y + 50, 0);
//     //     tween(node)
//     //         // 预备动作：蓄力下蹲
//     //         .to(0.1, { scale: v3(1.15, 0.85, 1.15) }, {
//     //             easing: easing.sineOut,
//     //         })
//     //         // 快速上升，并逐渐恢复缩放
//     //         .to(0.2, { worldPosition: v3(originalWpos.x, originalWpos.y + 100, 0) }, {
//     //             easing: easing.cubicOut,
//     //             onUpdate: (target, ratio) => {
//     //                 // 从蹲下状态(1.15, 0.85)逐渐恢复到正常(1, 1)，并稍微拉伸
//     //                 const scaleX = 1.15 - ratio * 0.15;
//     //                 const scaleY = 0.85 + ratio * 0.25; // 到1.1，稍微拉长
//     //                 const scaleZ = 1.15 - ratio * 0.15;
//     //                 node.setScale(scaleX, scaleY, scaleZ);
//     //             }
//     //         })
//     //         // 下落，逐渐拉长
//     //         .to(0.2, { worldPosition: v3(originalWpos.x, originalWpos.y, 0) }, {
//     //             easing: easing.cubicIn,
//     //             onUpdate: (target, ratio) => {
//     //                 // 从(1, 1.1)拉伸到(0.9, 1.3)
//     //                 const scaleX = 1 - ratio * 0.1;
//     //                 const scaleY = 1.1 + ratio * 0.2;
//     //                 const scaleZ = 1 - ratio * 0.1;
//     //                 node.setScale(scaleX, scaleY, scaleZ);
//     //             }
//     //         })
//     //         // 落地挤压变形
//     //         .to(0.15, { scale: v3(1.3, 0.7, 1.3) }, {
//     //             easing: easing.quadOut,
//     //         })
//     //         // 弹性恢复到正常状态
//     //         .to(0.2, { scale: v3(1, 1, 1) }, {
//     //             easing: easing.backOut,
//     //         })
//     //         .call(() => {
//     //             cb?.();
//     //         })
//     //         .start();
//     // }
//     onMouseDown(event: EventTouch) {
//         if (GameInfo.instance.Over || !GameInfo.instance.Begin) return;
//         // let b = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.Bullet);
//         // b.setParent(GameInfo.instance.gameMgr.effLayer);
//         // b.setPosition(this.bulletbirthPos.position);
//     }
//     onMouseOver(event: EventTouch) {
//     }
//     // ========================================
//     // outRay: geometry.Ray = null;
//     // /**点击3D物体的射线检测 */
//     // onMouseDown(event: EventTouch) {
//     //     if (GameInfo.instance.Over || !GameInfo.instance.Begin) return;
//     //     let pos = event.touch.getLocation();
//     //     this.outRay = new geometry.Ray();
//     //     let _x = pos.x
//     //     let _y = pos.y
//     //     CameraCtrl.instance.mainCamera.camera.screenPointToRay(this.outRay, _x, _y)
//     //     const mask = 1 << 5;
//     //     let success = PhysicsSystem.instance.raycastClosest(this.outRay, mask);
//     //     if (success) {
//     //         const results = PhysicsSystem.instance.raycastClosestResult;
//     //         const _t = results.collider.node.getComponent(ColliderTag);
//     //         if (_t && _t.tag == ColliderGroupTag.Button) {
//     //             // console.error(`屏幕点击:${pos.x},${pos.y}`, "射线检测:", results.collider.node.name);
//     //             const model = results.collider.node.getComponent(BuildBase);
//     //         }
//     //     }
//     // }
//     //绘制线段轨迹
//     // drawRay() {
//     //     if (!CameraCtrl.instance.geometryRenderer || !this.outRay) return;
//     //     const start = this.outRay.o;
//     //     const end = new Vec3(
//     //         this.outRay.o.x + this.outRay.d.x*20,
//     //         this.outRay.o.y + this.outRay.d.y*20,
//     //         this.outRay.o.z + this.outRay.d.z*20
//     //     );
//     //     // 绘制射线线段
//     //     CameraCtrl.instance.geometryRenderer.addLine(start, end, Color.RED);
//     //     // 可以在射线终点添加一个小标记
//     //     CameraCtrl.instance.geometryRenderer.addCross(end, 0.2, Color.GREEN);
//     // }
//     // ========================================
// }


