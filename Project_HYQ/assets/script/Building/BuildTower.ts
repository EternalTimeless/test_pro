// import { _decorator, CCInteger, Collider, Component, Label, Node, Sprite, v3, Vec3, } from 'cc';
// import { CommonEvent, PrefabPathEnum } from '../Common/CommonEnum';
// import { ItemContainer } from '../Common/ItemContainer';
// import { GameInfo } from '../Common/GameInfo';
// import { RoleHeroAlly } from '../Battle/RoleHeroAlly';
// import { BuildUpgrade } from './BuildUpgrade';

// const { ccclass, property } = _decorator;

// @ccclass('BuildTower')
// export class BuildTower extends BuildUpgrade {
//     // ========== 保留的属性（弹药和英雄相关） ==========
//     @property({ type: ItemContainer, displayName: '堆放节点' })
//     public itemContainer: ItemContainer = null;
//     @property({ type: Node, displayName: '英雄容器节点' })
//     public heroContainer: Node = null;
//     /**预留弹药 */
//     private reservedBullet: number = 0;
//     /**剩余弹药 */
//     private remainBullet: number = 0;
//     heroIndex: number = -1;
//     protected start(): void {
//         super.start(); // 调用父类的start方法
//         this.onCreateHero();
//     }
//     protected update(dt: number): void {
//     }

//     // ========== refreshUpgrade方法结束 ==========
//     /**添加英雄到防御塔 */
//     private onCreateHero() {
//         // let hero = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.ROLE_1);
//         // hero.setParent(this.heroContainer);
//         // hero.setPosition(Vec3.ZERO);
//         // let _AI = hero.getComponent(RoleHeroAlly);
//         // _AI.initBaseData(0, this.buildIndex);
//         // GameInfo.instance.allyHero = _AI;
//         // this.heroIndex = GameInfo.instance.allyHero.length - 1;
//     }

//     /**
//      * 升级完成回调（重写父类方法）
//      * @param level 当前等级
//      */
//     protected onUpgraded(level: number): void {
//         // 升级英雄武器
//         if (this.heroIndex >= 0 && GameInfo.instance.allyHero[this.heroIndex]) {
//             GameInfo.instance.allyHero[this.heroIndex].upgradeWeapon();
//         }
//         // 播放特效
//         let wpos = this.heroContainer.worldPosition.clone();
//         GameInfo.instance.prefabMgr.createAddEffect(wpos, v3(2, 2, 2));
//     }
//     /**
//      * 获取弹药数量数量（考虑预留弹药）
//      */
//     getDisplayRemain() {
//         return Math.max(0, this.remainBullet + this.reservedBullet);
//     }
//     /**
//      * 预留数量，在飞的过程中先减少所需数量
//      * @param amount 预留的数量
//      */
//     reserveBullet(amount: number) {
//         amount = Math.floor(amount);
//         this.reservedBullet += amount;
//     }
//     /**添加弹药 */
//     addBullet(amount: number) {
//         amount = Math.floor(amount);
//         this.reservedBullet -= amount;
//         const maxDisplay = this.itemContainer.maxLayers * this.itemContainer.columns * this.itemContainer.rows;
//         if (this.remainBullet >= maxDisplay) {
//             return;
//         }
//         this.remainBullet += amount;
//     }
//     /**消耗弹药 */
//     costBullet(cost: number) {
//         if (this.remainBullet < 1) return;
//         cost = Math.floor(cost);
//         const maxDisplay = this.itemContainer.maxLayers * this.itemContainer.columns * this.itemContainer.rows;
//         while (cost > 0 && this.remainBullet > 0) {
//             cost--;
//             if (this.remainBullet <= maxDisplay) {
//                 const item = this.itemContainer.getLastItem();
//                 app.res.recoverByPool(item);
//             }
//             this.remainBullet--;
//         }
//     }

//     /**获取投放位置 */
//     public getPushItemPos() {
//         return this.itemContainer.node.getPosition();
//     }
// }


