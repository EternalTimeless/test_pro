// import { _decorator, Animation, Component, easing, Node, tween, UITransform, v3 } from 'cc';
// import { CommonEvent, PrefabPathEnum } from '../Common/CommonEnum';
// import { GameInfo } from '../Common/GameInfo';
// const { ccclass, property } = _decorator;

// @ccclass('ViewUnlockHero')
// export class ViewUnlockHero extends Component {
//     @property({ type: Node, displayName: '' })
//     private selectBg1: Node = null!;
//     @property({ type: Node, displayName: '' })
//     private selectBg2: Node = null!;
//     @property({ type: [Node], displayName: '英雄选项池', tooltip: '英雄对象池' })
//     protected skeletonArr: Node[] = [];
//     @property({ type: Node, displayName: '选择按钮区域1' })
//     private btn1: Node = null!;
//     @property({ type: Node, displayName: '选择按钮区域2' })
//     private btn2: Node = null!;
//     public tran: UITransform;
//     public prefabeArr: PrefabPathEnum[] = [PrefabPathEnum.ROLE_ICE, PrefabPathEnum.ROLE_FIRE, PrefabPathEnum.ROLE_ASTROLOGER]
//     private curSelectArr: Node[] = [];
//     @property({ type: Node, displayName: '选择动画节点1' })
//     private handAniNode1: Node = null!;
//     @property({ type: Node, displayName: '选择动画节点2' })
//     private handAniNode2: Node = null!;
//     onLoad() {
//         this.node.active = false;
//         this.tran = this.node.getComponent(UITransform);
//         app.event.on(CommonEvent.UnlockHero, this.activeUnlock, this);
//     }

//     activeUnlock() {
//         // 清除所有之前可能残留的定时器
//         this.unscheduleAllCallbacks();
//         this.handAniNode1.active = false;
//         this.handAniNode2.active = false;
//         for (let index = 0; index < this.skeletonArr.length; index++) {
//             const element = this.skeletonArr[index];
//             element.active = false;
//         }
//         if (this.skeletonArr.length < 0) return;
//         if (this.skeletonArr.length === 1) {
//             this.curSelectArr = [...this.skeletonArr];
//         } else {
//             this.curSelectArr = this.shuffleAndSelect(this.skeletonArr, 2);
//         }
//         this.curSelectArr[0].setParent(this.selectBg1);
//         this.curSelectArr[0].setPosition(v3(0, -120, 0));
//         this.curSelectArr[0].active = true;
//         if (this.curSelectArr.length > 1) {
//             this.curSelectArr[1].setParent(this.selectBg2);
//             this.curSelectArr[1].setPosition(v3(0, -120, 0));
//             this.curSelectArr[1].active = true;
//         } else {
//             this.selectBg1.setPosition(v3(0, 0, 0));
//             this.btn1.setPosition(v3(0, 0, 0));

//         }
//         this.scheduleOnce(() => {
//             this.node.setScale(0.2, 0.2);
//             this.node.active = true;
//             this.selectBg1.active = false;
//             this.selectBg2.active = false;
//             this.btn1.active = false;

//             this.btn2.active = false;
//             GameInfo.instance.GamePause();
//             tween(this.node).to(0.2, { scale: v3(1, 1, 1) }, { easing: easing.quadOut }).call(() => {
//                 this.selectBg1.setScale(0.2, 0.2);
//                 this.selectBg2.setScale(0.2, 0.2);
//                 this.selectBg1.angle = 20;
//                 this.selectBg2.angle = 20;
//                 this.selectBg1.active = true;
//                 GameInfo.instance.prefabMgr.createViewCardEffect(this.node, this.selectBg1.position.clone());
//                 let t1 = tween(this.selectBg1).to(0.2, { angle: -10 }, { easing: easing.quadOut }).to(0.2, { angle: 0 }, { easing: easing.quadIn })
//                 let t2 = tween(this.selectBg1).to(0.1, { angle: -5 }, { easing: easing.quadOut }).to(0.1, { angle: 0 }, { easing: easing.quadIn })
//                 tween(this.selectBg1).to(0.2, { scale: v3(1, 1, 1) }, { easing: easing.smooth }).start();
//                 tween(this.selectBg1).to(0.3, { angle: 0 })
//                     .then(t1)
//                     .then(t2)
//                     .start();
//                 if (this.curSelectArr.length > 1) {
//                     let t_1 = tween(this.selectBg2).to(0.2, { angle: -10 }).to(0.2, { angle: 0 })
//                     let t_2 = tween(this.selectBg2).to(0.1, { angle: -5 }).to(0.1, { angle: 0 })
//                     this.scheduleOnce(() => {
//                         this.selectBg2.active = true;
//                         GameInfo.instance.prefabMgr.createViewCardEffect(this.node, this.selectBg2.position.clone());
//                         tween(this.selectBg2).to(0.2, { scale: v3(1, 1, 1) }, { easing: easing.smooth }).start();
//                         tween(this.selectBg2).to(0.3, { angle: 0 })
//                             .then(t_1)
//                             .then(t_2)
//                             .call(() => {
//                                 this.btn1.active = true;
//                                 this.btn2.active = true;
//                                 this.scheduleOnce(() => {
//                                     this.handAniNode1.active = true;
//                                     this.handAniNode1.getComponent(Animation).play();
//                                 }, 0.5)
//                                 this.scheduleOnce(() => {
//                                     this.handAniNode2.active = true;
//                                     this.handAniNode2.getComponent(Animation).play();
//                                 }, 1)

//                             })
//                             .start();
//                     }, 0.3)
//                 } else {
//                     this.scheduleOnce(() => {
//                         this.btn1.active = true;
//                         this.scheduleOnce(() => {
//                             this.handAniNode1.active = true;
//                             this.handAniNode1.getComponent(Animation).play();
//                         }, 0.5)
//                     }, 0.3)
//                 }
//             }).start();
//         }, 0.0)
//     }
//     selectHero(e: Event, select: string) {
//         this.node.active = false;
//         if (this.curSelectArr.length < 1) return;
//         let i = parseInt(select)
//         const sk = this.curSelectArr[i]
//         const index = this.skeletonArr.indexOf(sk)
//         if (index < 0) return;
//         this.skeletonArr.splice(index, 1);
//         sk.destroy();
//         const role = this.prefabeArr[index];
//         if (!role) {
//             console.error("解锁英雄失败, 英雄索引不存在", index, "当前英雄池:", this.prefabeArr);
//             return;
//         }
//         //删除已解锁英雄id
//         this.prefabeArr.splice(index, 1);
//         this.curSelectArr = [];
//         app.event.emit(CommonEvent.UpgradeSkill, role);
//         GameInfo.instance.GameResume();
//     }
//     /**Fisher-Yates 洗牌算法 */
//     shuffleAndSelect(arr: any[], count: number) {
//         if (arr.length < count) return arr;
//         const shuffled = [...arr]
//         for (let i = shuffled.length - 1; i > 0; i--) {
//             const j = Math.floor(Math.random() * (i + 1));
//             [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//         }
//         return shuffled.slice(0, count);
//     }
// }


