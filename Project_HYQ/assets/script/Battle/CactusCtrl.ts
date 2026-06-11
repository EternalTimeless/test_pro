// import { _decorator, Collider, easing, Node, tween, v3, Vec3, Quat, Tween } from 'cc';
// import { CharacterBase } from './CharacterBase';
// import { DamageSource, GameInfo } from '../Common/GameInfo';
// import FlyManager from '../Manager/FlyManager';
// import { CharacterTag, PrefabPathEnum } from '../Common/CommonEnum';
// import { CactusDropCtrl } from './CactusDropCtrl';

// const { ccclass, property } = _decorator;



// @ccclass('CactusCtrl')
// export class CactusCtrl extends CharacterBase {
//     @property({ type: Node, displayName: '仙人掌枝干模型' })
//     cactusBranchModel: Node = null!;
//     @property({ type: Node, displayName: '砍伐触发节点' })
//     public atkTriggerNode: Node = null;
//     private curLv: number = 0;
//     @property({ type: Node, displayName: '倾倒信息节点' })
//     public downInfoNode: Node = null!;
//     @property({ displayName: '死亡后等待复活时间' })
//     /**死亡后等待复活时间 */
//     private deathWaitTime: number = 5;
//     // ==================== 砍伐互斥标识(只用于“被工人砍伐同一棵仙人掌”的并发控制) ====================
//     /**当前是否已被某个工人占用砍伐（Cactus 被不同攻击者命中时可用来互斥伤害） */
//     private isBeingHarvested: boolean = false;
//     /**占用者(攻击者) uuid，用于区分是哪一个工人 */
//     private harvestOwnerUuid: string | null = null;
//     /**砍伐占用锁计时器：用于防止并发锁死（用 deathWaitTime 作为上限） */
//     private harvestLockTimer: number = 0;
//     //=================================晃动效果相关=================================
//     originalScale: Vec3 = new Vec3(1, 1, 1);
//     private originBranchEuler: Vec3 = new Vec3();
//     /**枝干模型初始缩放 */
//     private originalBranchScale: Vec3 = new Vec3(1, 1, 1);
//     /**枝干模型初始位置 */
//     private originalBranchPos: Vec3 = new Vec3();
//     private timer: number = 0;
//     onLoad(): void {
//         super.onLoad();
//         this.curLv = 0;
//         this.atkTriggerNode.active = true;
//         this.originalScale = this.ModelNode.getScale();
//         this.originBranchEuler = this.cactusBranchModel.eulerAngles.clone();
//         this.originalBranchScale = this.cactusBranchModel.getScale();
//         this.originalBranchPos = this.cactusBranchModel.getWorldPosition();

//     }
//     protected onEnable(): void {
//         super.initData();
//     }
//     protected onDisable(): void {
//     }
//     update(dt: number): void {
//         super.update(dt);
//         // 用 deathWaitTime 上限防止并发互斥锁死
//         if (this.isBeingHarvested) {
//             this.harvestLockTimer += dt;
//             if (this.harvestLockTimer >= this.deathWaitTime) {
//                 this.clearHarvestLock();
//             }
//         }
//         if (this.isDead) {
//             this.timer += dt;
//             if (this.timer >= this.deathWaitTime) {
//                 this.timer = 0;
//                 this.resetCactus();
//             }
//         }
//     }

//     /**复活重置  数据 */
//     resetCactus(lv: number = 0) {
//         this.clearHarvestLock();
//         this.curLv = lv;
//         this.onRevive(1);
//         // 重置枝干倾斜角度和位置
//         if (this.cactusBranchModel) {
//             this.cactusBranchModel.active = true;
//             Tween.stopAllByTarget(this.cactusBranchModel);
//             // 注意：先激活再设置变换，避免从 inactive->active 时引擎重建导致 transform 被恢复
//             this.cactusBranchModel.setRotationFromEuler(this.originBranchEuler.clone());
//             this.cactusBranchModel.setWorldPosition(this.originalBranchPos.clone());
//             this.playGrowTween();
//         }
//     }

//     /**枝干生长动画：从很小缩放长到完整大小 */
//     private playGrowTween(): void {
//         if (!this.cactusBranchModel) return;
//         // 避免和“晃动/倾倒”等 tween 叠加
//         // tween(this.cactusBranchModel).stop();
//         Tween.stopAllByTarget(this.cactusBranchModel);


//         // 以初始缩放为目标，先压到很小（保留极小值，避免 0 缩放带来计算异常）
//         const minScale = 0.02;
//         const startScale = v3(
//             Math.max(minScale, this.originalBranchScale.x * 0.2),
//             Math.max(minScale, this.originalBranchScale.y * 0.2),
//             Math.max(minScale, this.originalBranchScale.z * 0.2)
//         );
//         this.cactusBranchModel.setScale(startScale);

//         // 长出来：先快速到略大于 1 的尺寸，再回弹到 1，手感更“生长”
//         const overshootScale = v3(
//             this.originalBranchScale.x * 1.05,
//             this.originalBranchScale.y * 1.08,
//             this.originalBranchScale.z * 1.05
//         );

//         tween(this.cactusBranchModel)
//             .to(0.25, { scale: overshootScale }, { easing: easing.cubicOut })
//             .to(0.15, { scale: this.originalBranchScale }, { easing: easing.sineInOut })
//             .call(() => {
//                 //激活攻击触发节点
//                 this.atkTriggerNode.active = true;
//             })
//             .start();
//     }
//     public onHurt(damage: number, damageSource?: DamageSource): boolean {

//         // ==================== 砍伐互斥逻辑 ====================
//         const ownerUuid = damageSource?.uuid ?? damageSource?.node?.uuid ?? null;

//         // 已被占用: 只有占用者能继续造成伤害
//         if (this.isBeingHarvested) {
//             // 没有明确 ownerUuid 的攻击一律不通过，避免并发破坏互斥
//             if (!ownerUuid || ownerUuid !== this.harvestOwnerUuid) {
//                 return false;
//             }
//             // 同一占用者继续命中: 重置占用计时，避免中途误释放
//             this.harvestLockTimer = 0;
//         } else {
//             // 未占用: 如果能识别 ownerUuid，则建立占用锁
//             if (ownerUuid) {
//                 this.isBeingHarvested = true;
//                 this.harvestOwnerUuid = ownerUuid;
//                 this.harvestLockTimer = 0;
//             }
//         }

//         if (this.battleValComp) {
//             this.lastDamageSource = damageSource;
//             // if (this.battleValComp.healthPercentage < 0.5) {
//             //     damage *= 0.5;
//             // }
//             let v = this.battleValComp.takeDamage(damage);
//             this.updateCactusBranch(this.battleValComp.healthPercentage);
//             this.playCollectionEffect();
//             if (this.visualFeedbackComp) {
//                 // TODO 暂时不确定是否需要受击变色效果
//                 // this.visualFeedbackComp.showDamageEffectByIndex(this.curLv);
//             }
//             return v;
//         }
//         return false;
//     }
//     protected onDeadEnter(): void {
//         // 死亡时释放砍伐占用，防止影响后续复活
//         this.clearHarvestLock();
//         this.atkTriggerNode.active = false;
//         this.generateCatch();
//         if (GameInfo.step == 1) {
//             GameInfo.instance.guideMgr.onGuideStep();
//             let guideNode = this.node.getChildByName("guideNode");
//             GameInfo.instance.guideMgr.setPriorityGuide(guideNode);
//             GameInfo.instance.guideMgr.setGreenArrowFlag(guideNode, true);
//         }
//     }

//     /**清理砍伐占用锁 */
//     private clearHarvestLock(): void {
//         this.isBeingHarvested = false;
//         this.harvestOwnerUuid = null;
//         this.harvestLockTimer = 0;
//     }

//     /**判断是否被其它工人占用砍伐 */
//     public isHarvestLockedByOther(ownerUuid: string): boolean {
//         if (!this.isBeingHarvested) return false;
//         if (!this.harvestOwnerUuid) return false;
//         return this.harvestOwnerUuid !== ownerUuid;
//     }

//     protected getPotentialTargets(): CharacterBase[] {
//         return [];
//     }
//     protected castSkillEffect() { }
//     /**
//      * 受伤枝干倾倒：血量百分比 1→0 时，最大倾斜量为「初始欧拉角 → downInfoNode 欧拉角」差值的比例。
//      * 例如 0.5 表示满血到空血最多只倒到“完全倒下角度”的一半，可按手感随时改此常量。
//      */
//     private readonly CACTUS_INJURY_TILT_ANGLE_RATIO = 0.6;
//     /**枝干倾斜：每次受伤都沿倒下方向叠加一定角度，模拟逐渐被砍倒 */
//     updateCactusBranch(hpPercentage: number) {
//         if (!this.downInfoNode || !this.cactusBranchModel) return;
//         const angleOrigin = this.originBranchEuler.clone();
//         const angleEnd = this.downInfoNode.eulerAngles.clone();
//         // 血量 1→0 对应倾斜进度 0→1；最大倾斜 = 角度差 * CACTUS_INJURY_TILT_ANGLE_RATIO
//         const tiltT = (1 - hpPercentage) * this.CACTUS_INJURY_TILT_ANGLE_RATIO;
//         const angleX = angleOrigin.x + (angleEnd.x - angleOrigin.x) * tiltT;
//         const angleY = angleOrigin.y + (angleEnd.y - angleOrigin.y) * tiltT;
//         // const angleZ = angleOrigin.z + (angleEnd.z - angleOrigin.z) * tiltT;q    
//         this.cactusBranchModel.setRotationFromEuler(angleX, angleY, 0);
//     }
//     /**
//      * 枝干倾倒 
//      * 隐藏枝干, 同位置角度生成CoinCactus, 播放灰尘特效
//      *
//      */
//     generateCatch() {
//         // 先停止可能残留在枝干上的 tween，避免与倾倒动画冲突
//         // tween(this.cactusBranchModel).stop();
//         Tween.stopAllByTarget(this.cactusBranchModel);
//         if (!this.downInfoNode) return;
//         // 添加灰尘特效
//         let dustPos = this.cactusBranchModel.position.clone();
//         dustPos.y = 1;
//         GameInfo.instance.prefabMgr.createDustEffect(this.node, dustPos);

//         let coinCactus = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.COIN_CACTUS);
//         if (!coinCactus) return;
//         coinCactus.getComponent(Collider).enabled = false;
//         coinCactus.setParent(GameInfo.instance.gameMgr.effLayer);

//         // 1) 起点：使用 cactusBranchModel 的“世界位姿”
//         const startWorldPos = this.cactusBranchModel.worldPosition.clone();
//         const startWorldRot = this.cactusBranchModel.worldRotation;
//         coinCactus.setWorldPosition(startWorldPos);
//         coinCactus.setWorldRotation(startWorldRot);

//         // 2) 终点：使用 downInfoNode 的“世界位姿”
//         const downWorldPos = this.downInfoNode.worldPosition.clone();
//         const downWorldRot = this.downInfoNode.worldRotation;

//         // FIXME 迭代后的反方向预备倾斜角度过大, 若要启用需要优化
//         // 计算倒下方向上的轻微“反向预备”角度（先稍微往反方向抬起一点，再倒下）
//         // const startWorldEuler = new Vec3();
//         // startWorldRot.getEulerAngles(startWorldEuler);
//         // const downWorldEuler = new Vec3();
//         // downWorldRot.getEulerAngles(downWorldEuler);
//         // const prepEuler = v3(
//         //     startWorldEuler.x + (startWorldEuler.x - downWorldEuler.x) * 0.05,
//         //     startWorldEuler.y + (startWorldEuler.y - downWorldEuler.y) * 0.05,
//         //     startWorldEuler.z
//         // );
//         // const prepWorldRot = new Quat();
//         // Quat.fromEuler(prepWorldRot, prepEuler.x, prepEuler.y, prepEuler.z);
//         Tween.stopAllByTarget(this.ModelNode);
//         Tween.stopAllByTarget(this.cactusBranchModel);
//         this.cactusBranchModel.active = false;
//         tween(coinCactus)
//             // 1. 预备动作：轻微反向抬起，时间较短
//             // .to(
//             //     0.15,
//             //     {
//             //         worldRotation: prepWorldRot,
//             //         worldPosition: startWorldPos, // 预备阶段位置基本不动
//             //     },
//             //     { easing: easing.sineOut }
//             // )
//             // 2. 主倒下动作：从预备角度平滑倒到 downWorldRotation/downWorldPos
//             .to(
//                 0.9,
//                 {
//                     worldRotation: downWorldRot,
//                     worldPosition: downWorldPos,
//                 },
//                 { easing: easing.cubicInOut }
//             )
//             .call(() => {
//                 // 为掉落物挂载占用控制组件, 便于主角/工人并发搬运时做归属判断
//                 if (coinCactus) {
//                     let dropCtrl = coinCactus.getComponent(CactusDropCtrl);
//                     if (!dropCtrl) {
//                         dropCtrl = coinCactus.addComponent(CactusDropCtrl);
//                     }
//                     // 记录到 CollectionManager 里，便于快速查找（避免遍历 effLayer 子节点）
//                     GameInfo.instance.collectionMgr?.dropCactus?.push(dropCtrl);
//                     this.scheduleOnce(() => {
//                         coinCactus.getComponent(Collider).enabled = true;
//                     }, 0.1);
//                 }
//             })
//             .start();
//     }
//     /** 
//      * 晃动效果, 必须在updateCactusBranch之后执行
//      */
//     private playCollectionEffect() {
//         // 停止之前在角色节点上的缩放与晃动 tween，避免叠加
//         Tween.stopAllByTarget(this.ModelNode);
//         Tween.stopAllByTarget(this.cactusBranchModel);
//         // console.log('开始晃动效果');
//         // 缩放效果：轻微鼓起再回到原始缩放
//         tween(this.ModelNode)
//             .to(0.1, {
//                 scale: v3(
//                     this.originalScale.x * 1.01,
//                     this.originalScale.y * 1.04,
//                     this.originalScale.z * 1.01
//                 ),
//             }, { easing: easing.sineOut })
//             .to(0.15, { scale: this.originalScale }, { easing: easing.sineIn })
//             .start();

//         // 晃动效果：模拟树木被砍伐后的轻微摆动（围绕 Z 轴的小幅阻尼摆动）
//         // 以“已经轻微倾斜”的枝干角度为基础进行摇摆
//         const baseEuler = this.cactusBranchModel.eulerAngles.clone();
//         const swingAngle = 3; // 最大摆动角度（度）

//         // 每次触发前将枝干角度重置到初始角度
//         this.cactusBranchModel.eulerAngles = baseEuler.clone();

//         tween(this.cactusBranchModel)
//             .to(0.08, {
//                 eulerAngles: v3(baseEuler.x, baseEuler.y, baseEuler.z + swingAngle),
//             }, { easing: easing.sineOut })
//             .to(0.12, {
//                 eulerAngles: v3(baseEuler.x, baseEuler.y, baseEuler.z - swingAngle * 0.6),
//             }, { easing: easing.sineInOut })
//             .to(0.14, {
//                 eulerAngles: v3(baseEuler.x, baseEuler.y, baseEuler.z + swingAngle * 0.3),
//             }, { easing: easing.sineInOut })
//             .to(0.16, {
//                 eulerAngles: baseEuler,
//             }, { easing: easing.sineOut })
//             .call(() => {
//                 // console.log('晃动效果结束');
//             })
//             .start();
//     }
// }


