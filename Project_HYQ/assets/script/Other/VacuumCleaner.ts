// import { _decorator, CCInteger, Collider, Color, Component, ITriggerEvent, Node, ParticleSystem, Sprite, v3 } from 'cc';
// import { ColliderTag } from './ColliderTag';
// import { CharacterStatus, CharacterTag, ColliderGroupTag, PrefabPathEnum } from '../Common/CommonEnum';
// import FlyManager from '../Manager/FlyManager';
// import { GameInfo } from '../Common/GameInfo';
// import { ItemContainer } from '../Common/ItemContainer';
// import { CharacterBase } from '../Battle/CharacterBase';
// import { AudioMgr, SoundEnum } from '../Core/Managers/AudioMgr';
// const { ccclass, property } = _decorator;

// @ccclass('VacuumCleaner')
// export class VacuumCleaner extends Component {
//     @property({ type: Collider })
//     coll: Collider = null!;
//     @property({ type: CCInteger, displayName: '单次吸取最大数量' })
//     vacuumMaxCount: number = 5;
//     @property({ type: Node, displayName: '特效节点' })
//     effectNode: Node = null!;
//     /**特效粒子 */
//     vacuumEffect: ParticleSystem[] = [];
//     private _collider: Collider = null!;
//     @property({ type: ItemContainer, displayName: '目标容器' })
//     public targetContainer: ItemContainer = null!;
//     private _characterNode: CharacterBase | null = null;
//     private itemArr: Node[] = [];
//     itemCheckTimer: number = 0;
//     /**是否在工作, 用于player以外角色触发使用 */
//     public isWorking: boolean = false;
//     protected onLoad(): void {
//         this._collider = this.coll.getComponent(Collider);
//         if (this._collider) {
//             this._collider.on(`onTriggerEnter`, this.onTriggerEnter, this);
//             this._collider.on(`onTriggerExit`, this.onTriggerExit, this);
//         }
//         let currentNode: Node | null = this.node;
//         for (let i = 0; i < 3; i++) {
//             if (!currentNode.parent) break;
//             currentNode = currentNode.parent;
//             // 检查是否有 CharacterBase 组件
//             if (currentNode.getComponent(CharacterBase)) {
//                 this._characterNode = currentNode.getComponent(CharacterBase);
//                 break;
//             }
//         }
//         if (!this._characterNode) {
//             //work的this.targetContainer需要重新赋值, 需要飞到场景中的堆放点, 脚本无法直接在预制体中的property中赋值
//             console.error("吸尘器角色节点不存在", this.node.parent.parent.name);
//         } else {
//             if (this._characterNode.CharacterTag == CharacterTag.Worker) {
//                 this.targetContainer = GameInfo.instance.buildingMgr.clothStackNode[0];
//             }
//         }
//         if (!this.targetContainer) {
//             console.error("吸尘器目标容器不存在", this.node.parent.parent.name);
//         }
//         this.vacuumEffect = [];
//         if (this.effectNode) {
//             let selfPart = this.effectNode.getComponent(ParticleSystem)
//             if (selfPart) this.vacuumEffect.push(selfPart);
//             let len = this.effectNode.children.length;
//             for (let i = 0; i < len; i++) {
//                 let part = this.effectNode.children[i].getComponent(ParticleSystem);
//                 part.stop();
//                 if (part) this.vacuumEffect.push(part)
//             }
//         }

//     }
//     private isPlaying: boolean = false;
//     public setWorking(working: boolean) {
//         this.isWorking = working;
//         if (this.isWorking) {
//             if (!this.isPlaying) {
//                 this.isPlaying = true;
//                 let len = this.vacuumEffect.length;
//                 for (let i = 0; i < len; i++) {
//                     this.vacuumEffect[i].play();
//                 }
//             }
//         } else {
//             if (this.isPlaying) {
//                 this.isPlaying = false;
//                 let len = this.vacuumEffect.length;
//                 for (let i = 0; i < len; i++) {
//                     this.vacuumEffect[i].stop();
//                 }
//             }

//         }
//     }
//     update(dt: number): void {
//         if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin) return;
//         this.itemCheckTimer += dt;
//         if (this.itemCheckTimer >= 0.2) {
//             this.itemCheckTimer = 0;
//             this.checkItem();
//         }
//     }
//     protected onTriggerEnter(event: ITriggerEvent) {
//         const _t = event.otherCollider.node.getComponent(ColliderTag);
//         if (_t.tag == ColliderGroupTag.DirtyCloth) {
//             this.itemArr.push(_t.node);
//         }
//     }
//     protected onTriggerExit(event: ITriggerEvent) {
//         const otherNode = event.otherCollider?.node;
//         if (!otherNode || !otherNode.isValid) return;

//         const _t = otherNode.getComponent(ColliderTag);
//         if (_t?.tag == ColliderGroupTag.DirtyCloth) {
//             const index = this.itemArr.indexOf(otherNode);
//             if (index !== -1) {
//                 this.itemArr.splice(index, 1);
//             }
//         }
//     }
//     private reservedCoin: number = 0;
//     checkItem() {
//         let len = this.itemArr.length;
//         if (len <= 0) return;

//         // 计算背包剩余容量
//         const maxCapacity = this.targetContainer.getMaxShowNum();
//         const currentCount = GameInfo.instance.viewMgr.WaterCoin;
//         const availableSpace = maxCapacity - currentCount - this.reservedCoin;
//         const isPlayer = this._characterNode.CharacterTag == CharacterTag.Player;
//         // 如果背包已满，不执行吸取操作
//         if (availableSpace <= 0) {
//             if (isPlayer && !GameInfo.instance.player.isPackageTipShow) {
//                 //背包超过MAX时显示提示
//                 GameInfo.instance.player.showPackageTip();
//             }
//             return;
//         }

//         // 实际可以吸取的物品数量(取较小值)
//         const actualFlyNum = Math.min(availableSpace, len);

//         if (actualFlyNum > 0) {
//             // 切换到吸取状态
//             this.setWorking(true);
//             // attack动画 = 吸取动画, 吸取动画并未注册帧事件, 不会触发攻击onAttackFrame伤害逻辑, , 直接复用原框架的attack状态
//             this._characterNode.attack();
//             if (isPlayer) AudioMgr.instance.playSound(SoundEnum.sound_vacuumCleaner, 0.5);
//             // 从后往前处理物品,避免索引错乱
//             for (let i = 0; i < actualFlyNum; i++) {
//                 let cur = this.itemArr.pop(); // 从数组末尾取出并移除
//                 if (!cur || !cur.isValid) continue;

//                 let coin = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.COIN_DIRTY);
//                 if (coin) {
//                     // 保存原始位置和旋转信息
//                     const worldPos = cur.worldPosition.clone();
//                     const eulerAngles = cur.eulerAngles.clone();
//                     const parent = cur.parent;

//                     // 从collectionMgr中删除cloth
//                     const index = GameInfo.instance.collectionMgr.clothList.indexOf(cur);
//                     if (index !== -1) {
//                         GameInfo.instance.collectionMgr.clothList.splice(index, 1);
//                     }

//                     // 回收原物品(此时已经从itemArr中移除,即使触发onTriggerExit也不会找到)
//                     GameInfo.instance.prefabMgr.recoverPrefab(cur);

//                     // 在原位置生成coin_dirty
//                     coin.setWorldPosition(worldPos);
//                     coin.setParent(parent);
//                     coin.setRotationFromEuler(eulerAngles);

//                     // 预留背包容量
//                     this.reservedCoin++;
//                     // 获取目标位置并创建飞行动画
//                     let endLocalPos = this.targetContainer.preprocessData();
//                     FlyManager.instance.createFly3D(coin, this.targetContainer.node, endLocalPos, 5, () => {
//                         // AudioMgr.instance.playSound(SoundEnum.sound_getGold);
//                         this.targetContainer.addItem(coin);
//                         if (this._characterNode.CharacterTag == CharacterTag.Player)
//                             GameInfo.instance.viewMgr.addWaterCoin(1);
//                         if (GameInfo.instance.viewMgr.WaterCoin >= 5 && GameInfo.step == 2) {
//                             GameInfo.instance.guideMgr.onGuideStep();
//                         }
//                         this.reservedCoin--; // 完成后释放预留容量
//                     }, 2, 0, v3(0, 0, 0), true, isPlayer ? v3(0.6, 0.6, 0.6) : v3(1, 1, 1));
//                 }
//             }
//         }
//     }
// }
