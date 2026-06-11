// import { _decorator, CCInteger, Collider, easing, ITriggerEvent, Label, Node, Sprite, SpriteFrame, Tween, tween, UIOpacity, v3, Vec3 } from 'cc';
// import { CharacterBase } from './CharacterBase';
// import { GameInfo, Config } from '../Common/GameInfo';
// import { ItemContainer } from '../Common/ItemContainer';
// import { CharacterStatus, ColliderGroupTag } from '../Common/CommonEnum';
// import { ColliderTag } from '../Other/ColliderTag';
// import { MathUtil } from '../Extra/MathUtil';
// import FlyManager from '../Manager/FlyManager';
// const { ccclass, property } = _decorator;

// @ccclass('RolePeople')
// export class RolePeople extends CharacterBase {
//     @property({ type: Node, displayName: '背包节点' })
//     public backpack: Node = null;
//     // @property({ type: [Node], displayName: '购买图标' })
//     // buyIcons: Node[] = [];

//     /**当前所需 */
//     public curNeed: number = 0;
//     /**所需数量 */
//     public amountNeed: number = 0;

//     /**村民购买类型: 0=衣物*/
//     public purchaseType: number = 0;

//     private targetNode: Node = null;
//     public isMoving: boolean = false;

//     /**到达目标后的回调 */
//     public onReachedCallback: (() => void) | null = null;

//     /**已分配的队列位置索引 */
//     public assignedQueueIndex: number = -1;

//     public itemContainer: ItemContainer = null!;

//     /**空闲等待计时器 */
//     private idleTimer: number = 0;
//     /**空闲等待时间常量（秒） */
//     private readonly IDLE_WAIT_TIME: number = 2;
//     private _collider: Collider = null!;

//     //跟随相关设置
//     isFollow: boolean = false;
//     followIndex: number = -1;

//     isHolding: boolean = false;
//     isFreeze: boolean = false;

//     @property({ displayName: '初始生成是否在水中' })
//     isInWater: boolean = true;
//     // @property({ type: Node, displayName: '气泡提示节点' })
//     // bubbleNode: Node = null!;
//     // catchRatioNode: Label = null!;
//     // @property({ displayName: '成功概率' })
//     // catchRatio: number = 0.9;
//     @property({ type: Node, displayName: '水波纹节点' })
//     waterWaveNode: Node = null!;
//     waterWaveOriginalScale: Vec3 = v3(1, 1, 1);
//     private waterWaveOpacity: UIOpacity = null!;
//     /**闲逛范围中心点 */
//     private center: Node = null!;
//     /**闲逛范围半径X */
//     private rangeX: number = 0;
//     /**闲逛范围半径Z */
//     private rangeZ: number = 0;
//     /**初始化闲逛范围 */
//     initWanderRange(center: Node, rangeX: number, rangeZ: number) {
//         this.center = center;
//         this.rangeX = rangeX;
//         this.rangeZ = rangeZ;
//     }
//     onLoad(): void {
//         super.onLoad();
//         // this.itemContainer = this.backpack.getChildByName("water").getComponent(ItemContainer);
//         // ========== 碰撞器初始化（暂时注释，后续可能使用） ==========
//         this._collider = this.getComponent(Collider);
//         if (this._collider) {
//             this._collider.on(`onTriggerEnter`, this.onTriggerEnter, this);
//             this._collider.on(`onTriggerStay`, this.onTriggerStay, this);
//             this._collider.on(`onTriggerExit`, this.onTriggerExit, this);
//         }
//         // ========================================
//         // if (this.bubbleNode) {
//         //     this.bubbleNode.active = false;
//         //     // this.sellPriceNode = this.bubbleNode.getChildByName('cost').getComponent(Label);
//         //     this.catchRatioNode = this.bubbleNode.getChildByName('ratio').getComponent(Label);
//         //     // this.sellPriceNode.string = this.sellPrice.toString();
//         //     this.catchRatioNode.string = this.catchRatio * 100 + '%';
//         // }
//         if (this.waterWaveNode) {
//             this.waterWaveOriginalScale = this.waterWaveNode.getScale().clone();
//             this.waterWaveOpacity = this.waterWaveNode.getComponent(UIOpacity);
//             this.waterWaveNode.active = false;
//         }
//     }

//     start() {
//         super.initData();
//         this.isFreeze = false;
//     }
//     protected onEnable(): void {
//         this.backpack.active = true;
//     }
//     /**
//      * 初始化角色类型
//      * @param purchaseType 0=衣物
//      * @param item 物品数量
//      */
//     initRoleType(purchaseType: number, item: number) {
//         this.purchaseType = purchaseType;
//         // for (let i = 0; i < this.buyIcons.length; i++) {
//         //     if (i === this.purchaseType) {
//         //         this.buyIcons[i].active = true;
//         //     } else {
//         //         this.buyIcons[i].active = false;
//         //     }
//         // }
//         if (this.isInWater) {
//             this.changeMoveType(1);
//             this.statusComp.changeState(CharacterStatus.Idle);
//             return;
//         }
//         this.isHolding = false;
//         this.amountNeed = item;
//         this.refreshBuyNum(item);
//         this.animComp.setAnimationNames("idle", "run", "", "", "", "");
//     }
//     setFollow(isFollow: boolean) {
//         this.isFollow = isFollow;
//         //已在跟随队列中
//         if (this.followIndex == -1) {
//             return;
//         }
//         if (isFollow) {
//             GameInfo.instance.followMgr.appendFollowers([this.node]);
//             this.followIndex = GameInfo.instance.followMgr.followerCount - 1;
//         } else {
//             GameInfo.instance.followMgr.removeFollowerAt(this.followIndex);
//             this.followIndex = -1;
//         }
//     }
//     /**刷新购买需求显示（村民使用） */
//     refreshBuyNum(num: number) {
//         if (!this.visualFeedbackComp) return;

//         if (!num) {
//             this.curNeed = 0;
//             this.visualFeedbackComp.updateBubble(0);
//             this.visualFeedbackComp.setBubbleVisible(false, true);
//             return;
//         }

//         this.curNeed = num;
//         this.visualFeedbackComp.updateBubble(num, this.amountNeed);
//         this.visualFeedbackComp.setBubbleVisible(true);
//     }

//     update(dt: number) {
//         super.update(dt);
//         if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin) return;
//         if (this.isFollow) return;
//         // 到达后待机一段时间再取下一个随机点
//         if (this.isInWater) {
//             if (!this.isMoving) {
//                 this.idleTimer += dt;
//                 if (this.idleTimer >= this.IDLE_WAIT_TIME) {
//                     this.idleTimer = 0;
//                     this.startRandomWander();
//                     this.waterWaveAnim();
//                 }
//             }
//         }
//     }
//     /**随机范围闲逛：移动到随机范围点，到达后原地待机 */
//     startRandomWander() {
//         const center = this.center.worldPosition;
//         const next = MathUtil.getRandomPointInRect(center, v3(1, 0, 0), this.rangeX, this.rangeZ);
//         if (next) {
//             this.changeMoveType(1);
//             this.isMoving = true;
//             //水中使用此速度
//             this.moveToWorldPosition(next, 1.5);
//         }
//     }
//     /**移动到下一个目标（村民使用） */
//     nextTarget(node: Node) {
//         this.targetNode = node;
//         this.trackToPathPoint(this.targetNode);
//     }

//     trackToPathPoint(pathPoint: Node) {
//         this.isMoving = true;
//         this.moveToWorldPosition(pathPoint.worldPosition);
//     }

//     onTargetReached() {
//         super.onTargetReached();
//         // 外部随机点闲逛：不走路径节点队列
//         if (this.isInWater) {
//             this.idleTimer = 0;
//         }

//         // 村民相关逻辑
//         this.targetNode = null;
//         this.isMoving = false;

//         // 如果有回调函数，执行回调
//         if (this.onReachedCallback) {
//             const callback = this.onReachedCallback;
//             this.onReachedCallback = null; // 执行后清空，避免重复调用
//             callback();
//         }
//     }
//     /**切换持有物品动画 */
//     holdItem() {
//         if (!this.animComp) return;
//         if (this.isHolding) return;
//         this.isHolding = true;
//         //切换动画
//         this.animComp.setAnimationNames("cloth_idle", "cloth_run", "", "", "", "");
//         this.animComp.playAnimation("cloth_idle", true, 1);
//     }
//     protected getPotentialTargets(): CharacterBase[] {
//         return [];
//     }

//     protected getSkillAniName(): string {
//         return "";
//     }

//     protected castSkillEffect(): void { }

//     protected onTriggerEnter(event: ITriggerEvent) {
//         // console.log("onTriggerEnter", event.otherCollider.node.name);
//         const _t = event.otherCollider.node.getComponent(ColliderTag);
//         if (!_t) return
//         if (_t.tag == ColliderGroupTag.Inside) {
//             this.isInsideWall = true;
//         }
//         // if (_t.tag == ColliderGroupTag.TipHook) {
//         //     this.bubbleNode.active = true;
//         // }
//     }
//     protected onTriggerStay(event: ITriggerEvent) {
//     }
//     protected onTriggerExit(event: ITriggerEvent) {
//         // console.log("onTriggerExit", event.otherCollider.node.name);
//         const _t = event.otherCollider.node.getComponent(ColliderTag);
//         if (!_t) return
//         if (_t.tag == ColliderGroupTag.Inside) {
//             this.isInsideWall = false;
//         }
//         // if (_t.tag == ColliderGroupTag.TipHook) {
//         //     this.bubbleNode.active = false;
//         // }
//     }
//     setFreeze(isFreeze: boolean) {
//         this.isFreeze = isFreeze;
//         if (isFreeze) {
//             this.stopMove();
//             this.stopWaterWaveAnim();
//         }
//     }
//     /**跳到某个位置, 自带父节点设置（带影子和自动旋转） */
//     JumpOut(target: Node, jumpHeight: number, jumpSpeed: number): void {
//         if (!this.isInWater) return;
//         this.isInWater = false;
//         GameInfo.instance.buildingMgr.removePeople(this);
//         this.node.setParent(GameInfo.instance.gameMgr.gameLayer);
//         this.node.setScale(v3(1, 1, 1));
//         const gameLayer = GameInfo.instance.gameMgr.gameLayer;
//         const targetLocalPos = target.getWorldPosition();
//         gameLayer.inverseTransformPoint(targetLocalPos, targetLocalPos)
//         // 创建节点飞行
//         FlyManager.Ins.createFly(this.node, gameLayer,
//             targetLocalPos,
//             jumpHeight,
//             () => {
//                 // 切换到待机动画
//                 this.changeMoveType(0)
//                 // 可能存在处于idle状态, 不会切换动画, 需要手动切换
//                 if (this.statusComp.currentState === CharacterStatus.Idle) {
//                     this.animComp.playAnimation("idle", true, 1);
//                 } else {
//                     this.statusComp.changeState(CharacterStatus.Idle);
//                 }
//                 // NOTE: 添加到跟随队列
//                 this.isFreeze = false;
//                 this.isFollow = true;
//                 GameInfo.instance.followMgr.appendFollowers([this.node]);
//                 this.followIndex = GameInfo.instance.followMgr.followerCount - 1;
//                 if (GameInfo.step == 5 && GameInfo.instance.followMgr.followerCount > 1) {
//                     GameInfo.instance.guideMgr.onGuideStep();
//                 }
//             },
//             jumpSpeed,
//             0,
//         );
//     }
//     /** 停止水波纹 tween 并重置节点 */
//     private stopWaterWaveAnim() {
//         if (!this.waterWaveNode?.isValid) return;
//         Tween.stopAllByTarget(this.waterWaveNode);
//         if (this.waterWaveOpacity) {
//             Tween.stopAllByTarget(this.waterWaveOpacity);
//         }
//         this.waterWaveNode.active = false;
//         this.waterWaveNode.setScale(this.waterWaveOriginalScale);
//         if (this.waterWaveOpacity) {
//             this.waterWaveOpacity.opacity = 200;
//         }
//     }

//     /**
//      * 水波纹扩散动画
//      */
//     waterWaveAnim() {
//         if (!this.waterWaveNode?.isValid) return;
//         Tween.stopAllByTarget(this.waterWaveNode);
//         if (this.waterWaveOpacity) {
//             Tween.stopAllByTarget(this.waterWaveOpacity);
//         }

//         const os = this.waterWaveOriginalScale;
//         this.waterWaveNode.setScale(os);
//         this.waterWaveNode.active = true;
//         this.waterWaveOpacity.opacity = 200;
//         tween(this.waterWaveOpacity)
//             .delay(0.1)
//             .to(0.55, { opacity: 0 }, { easing: easing.sineIn })
//             .start();
//         tween(this.waterWaveNode)
//             .to(0.5, { scale: v3(os.x * 1.8, os.y * 1.8, os.z * 1.8) }, { easing: easing.quadOut })
//             .call(() => this.stopWaterWaveAnim())
//             .start();
//     }
//     /**切换移动&&待机动作, 不重置当前动作, 需要自行设置动作
//      * @param type 0空手, 1水中
//     */
//     changeMoveType(type: number) {
//         switch (type) {
//             case 0:
//                 this.animComp.setAnimationNames("idle", "run", "", "", "", "");
//                 break;
//             case 1:
//                 this.animComp.setAnimationNames("nishui", "nishui", "", "", "", "");
//                 break;
//             default:
//                 break;
//         }
//     }
// }


