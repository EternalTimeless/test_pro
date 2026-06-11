import { _decorator, CCInteger, Component, Node, tween, v3, Vec3 } from 'cc';
import { GameInfo } from '../Common/GameInfo';
import { ItemContainer } from '../Common/ItemContainer';
import FlyManager from '../Manager/FlyManager';
import { AudioMgr, SoundEnum } from '../Core/Managers/AudioMgr';
import { PrefabPathEnum } from '../Common/CommonEnum';
import { RolePeople } from '../Battle/RolePeople';
const { ccclass, property } = _decorator;

@ccclass('BuildShop')
export class BuildShop extends Component {
    /**预留 */
    private reservedCommodity: number = 0;
    /**剩余 */
    private remainCommodity: number = 0;
    @property({ type: Node, displayName: '出售触发点' })
    public tradeTriggerNode: Node = null!;
    // @property({ type: Node, displayName: '售卖员工碰撞器' })
    // public sellWokerCollider: Node = null!;
    @property({ type: ItemContainer, displayName: '商品容器' })
    public commodityContainer: ItemContainer = null!;
    @property({ type: ItemContainer, displayName: '金币容器' })
    public goldContainer: ItemContainer = null!;
    /** 出售比例 */
    public sellRatio: number = 2;
    @property({ type: Node, displayName: '出生点' })
    private birthNode: Node = null!;
    @property({ type: [Node], displayName: '售卖队列点' })
    public queuePathNode: Node[] = [];

    queueLength: number = 5;

    @property({ type: [Node], displayName: '离开路径点' })
    leavePathNode: Node[] = [];
    // 队列村民列表
    peopleList: RolePeople[] = [];

    // 记录当前村民实际购买的数量（一次只允许一个村民购买）
    // private peoplePurchaseCount: number = 0;

    private reservedGold: number = 0;
    private remainGold: number = 0;
    private isWorking: boolean = false;
    /**是否解锁员工（永久开启售卖） */
    private hasWorker: boolean = false;
    /**当前在售卖区域内的角色数量（引用计数） */
    private workingRoleCount: number = 0;

    // 售卖状态
    private isFirstBuying: boolean = false;
    /**当前正在购买的村民 */
    private currentBuyingPeople: RolePeople | null = null;
    /**当前正在购买的村民类型: 初始0, 购买后1 */
    private currentBuyingPeopleType: number = 0;

    /**售卖检测计时器 */
    private sellCheckTimer: number = 0;
    private sellCheckInterval: number = 0.2;
    @property
    /**路径解锁状态 */
    private isQueueUnlocked: boolean = false;

    private createPeopleTimer: number = 0;
    private createPeopleInterval: number = 0.2;
    protected onLoad(): void {
        this.queueLength = this.queuePathNode.length;
        this.peopleList = [];
        this.tradeTriggerNode.active = false;
        // this.sellWokerCollider.active = false;
    }
    onEnable() {
        // this.hasWorker = true;
        this.init();
    }
    init() {
        this.tradeTriggerNode.active = true;
        this.tradeTriggerNode.scale = v3(0.2, 0.2, 1)
        tween(this.tradeTriggerNode)
            .delay(0.1)
            .to(0.1, { scale: v3(1.2, 1.2, 1) })
            .to(0.1, { scale: v3(1, 1, 1) })
            .start();
    }
    update(dt: number) {
        if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin) return;


        this.createPeopleTimer += dt;
        if (this.createPeopleTimer >= this.createPeopleInterval) {
            this.createPeopleTimer = 0;
            // 队列自动生成
            if (this.isQueueUnlocked && this.peopleList.length < this.queueLength) {
                this.createPeople(0);
            }

        }
        // ========================================

        // 售卖流程控制
        this.sellCheckTimer += dt;
        if (this.sellCheckTimer >= this.sellCheckInterval) {
            this.sellCheckTimer = 0;
            if (this.isQueueUnlocked) {
                this.checkSellProcess();
            }
        }
    }
    //主角从容器拾取金币
    GoldToHero() {
        if (this.remainGold < 1) return;

        // 扣除金币
        this.remainGold--;
        FlyManager.Ins.flyItem({
            sourceContainer: this.goldContainer,
            targetNode: GameInfo.instance.player.goldContainer.root,
            targetLocalPos: GameInfo.instance.player.goldContainer.preprocessData(),
            viewCountGetter: () => this.remainGold + 1,
            prefabPath: PrefabPathEnum.COIN_GOLD,
            onComplete: (item) => {
                if (item) {
                    GameInfo.instance.player.goldContainer.addItem(item);
                    AudioMgr.instance.playSound(SoundEnum.Sound_GetGold, 0.7);
                }
                GameInfo.instance.viewMgr.addGoldCoin(1);
            },
            flyParams: { radius: 3, power: 2, flyType: 0, needUpdateEnd: true }
        });
    }
    /**获取所有的金币数量, 包含飞行过程中预留的金币 */
    getTotalGold(): number {
        return this.reservedGold + this.remainGold;
    }
    /**
     * 预留数量，在飞过来的过程中先减少所需数量
     * @param amount 预留的数量
     */
    reserveCommodity(amount: number) {
        this.reservedCommodity += amount;
    }
    getRemainCommodity() {
        return this.remainCommodity;
    }
    /**获取所有的数量, 包含飞行过程中预留的ITEM */
    getTotalCommodity(): number {
        return this.reservedCommodity + this.remainCommodity;
    }
    updateCommodity(amount: number) {
        if (amount > 0) this.reservedCommodity -= amount;
        this.remainCommodity += amount;
    }
    /**
     * 是否开启售卖（角色触发，使用引用计数）
     * @param working 是否开启：true=进入售卖区域，false=离开售卖区域
     */
    checkWorking(working: boolean) {
        // 如果已解锁员工，售卖永久开启，不受角色控制
        if (this.hasWorker) {
            return;
        }

        // 引用计数：进入 +1，离开 -1
        if (working) {
            this.workingRoleCount++;
        } else {
            this.workingRoleCount--;
            // 防止计数器变为负数
            if (this.workingRoleCount < 0) {
                this.workingRoleCount = 0;
            }
        }

        // 只要有角色在售卖区域内（计数 > 0），就保持售卖状态
        this.isWorking = this.workingRoleCount > 0;
    }
    unlockSellWorker() {
        // this.sellWokerCollider.active = true;
    }
    unlockQueue() {
        this.isQueueUnlocked = true;
    }
    getPathUnlocked() {
        return this.isQueueUnlocked;
    }
    /**
     * 创建村民（按类型）
     * @param purchaseType 0=村民
     */
    createPeople(purchaseType: number) {
        const pNode = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.CUSTOMER);
        pNode.setParent(GameInfo.instance.gameMgr.gameLayer);
        pNode.setWorldPosition(this.birthNode.worldPosition);
        const people = pNode.getComponent(RolePeople);

        // 设置随机购买数量
        let count = Math.round(Math.random() * 3 + 3);
        people.initRoleType(purchaseType, count); // 村民
        people.assignedQueueIndex = -1;

        // 添加到列表
        this.peopleList.push(people);

        // 延迟刷新位置
        this.scheduleOnce(() => {
            this.checkPeoplePosition();
        }, 0.1);
    }
    /**
     * 检查村民队列位置
     */
    checkPeoplePosition() {
        const peopleList = this.peopleList;
        const pathNodes = this.queuePathNode;

        for (let i = 0; i < peopleList.length; i++) {
            const people = peopleList[i];
            if (i < pathNodes.length) {
                if (people.assignedQueueIndex !== i) {
                    people.assignedQueueIndex = i;
                    people.nextTarget(pathNodes[i]);
                    people.onReachedCallback = () => {
                        people.node.setWorldPosition(pathNodes[i].worldPosition);
                    }
                }
            }
        }
    }

    /**
     * 售卖流程控制
     */
    checkSellProcess() {
        if (this.peopleList.length === 0) {
            this.isFirstBuying = false;
            return;
        }

        const firstPeople = this.peopleList[0];
        const canSell = (this.isWorking || this.hasWorker) && this.remainCommodity > 0;

        if (canSell) {
            const isReady = firstPeople.assignedQueueIndex === 0 && !firstPeople.isMoving;
            if (!this.isFirstBuying && isReady) {
                this.startBuying(firstPeople, firstPeople.purchaseType);
            }
        }
    }

    /**
     * 开始购买流程
     * @param people 购买的村民
     * @param purchaseType 购买类型 0=生肉, 1=食物
     */
    startBuying(people: RolePeople, purchaseType: number) {
        if (!people || people.curNeed <= 0) {
            // 购买完成，村民离开
            this.peopleLeave(people, purchaseType, 0);
            return;
        }

        // 根据类型选择容器和库存
        const sourceContainer = this.commodityContainer;
        const remain = purchaseType === 0 ? this.remainCommodity : this.remainCommodity;
        const prefabPath = purchaseType === 0 ? PrefabPathEnum.PET : PrefabPathEnum.PET;

        if (remain <= 0) {
            this.isFirstBuying = false;
            this.currentBuyingPeople = null;
            return;
        }

        // 标记购买状态
        this.isFirstBuying = true;
        this.currentBuyingPeople = people;

        const buyCount = Math.min(people.curNeed, remain);
        let completedCount = 0;

        // 批量发射
        for (let i = 0; i < buyCount; i++) {
            this.scheduleOnce(() => {
                // 扣除库存
                if (purchaseType === 0) {
                    if (this.remainCommodity < 1) return;
                    this.remainCommodity -= 1;
                } else {
                    if (this.remainCommodity < 1) return;
                    this.remainCommodity -= 1;
                }
                // const sourceContainer = purchaseType === 0 ? this.meatContainer : this.foodContainer;
                FlyManager.Ins.flyItem({
                    sourceContainer: sourceContainer,
                    targetNode: people.itemContainer.root,
                    targetLocalPos: people.itemContainer.preprocessData(),
                    viewCountGetter: () => this.remainCommodity + 1,
                    prefabPath: prefabPath,
                    onComplete: (item) => {
                        if (item) {
                            // 只执行一次:切换, 每个People购买只切换一次
                            if (this.currentBuyingPeopleType === 0) {
                                this.currentBuyingPeopleType = 1;
                                GameInfo.instance.prefabMgr.createAddEffect(people.node.worldPosition.clone(), v3(0.25, 0.25, 0.8));
                                GameInfo.instance.prefabMgr.recoverPrefab(item);
                            } else {
                                // 购买未完成时切换动作
                                people.itemContainer.addItem(item);
                                people.holdItem();
                            }
                        }
                        people.curNeed -= 1;
                        people.refreshBuyNum(people.curNeed);
                        AudioMgr.instance.playSound(SoundEnum.Sound_Shop, 0.7);
                        this.generateGoldFromPeople(people, purchaseType);
                        completedCount++;
                        //==========================================
                        //一次性购买相关逻辑
                        // 记录当前村民本次成功购买的数量（先累计数量，购买完成后再一次性生成金币）
                        // this.peoplePurchaseCount += 1;
                        //==========================================
                        if (completedCount >= buyCount) {
                            //==========================================
                            //一次性购买相关逻辑
                            // 如果该村民已经完成全部购买，则一次性生成对应数量的金币
                            // if (people.curNeed <= 0) {
                            // const totalBuyCount = this.peoplePurchaseCount;
                            // 清理当前村民的购买计数
                            // this.peoplePurchaseCount = 0;
                            // 购买完成后重置状态并让村民离开
                            // this.peopleLeave(people, purchaseType, totalBuyCount);
                            // return;
                            // }
                            //==========================================
                            const remainStock = purchaseType === 0 ? this.remainCommodity : this.remainCommodity;
                            if (people.curNeed > 0 && remainStock > 0) {
                                this.scheduleOnce(() => {
                                    this.startBuying(people, purchaseType);
                                }, 0.1);
                            } else if (people.curNeed > 0 && remainStock <= 0) {
                                // 重置购买状态
                                this.isFirstBuying = false;
                                this.currentBuyingPeople = null;
                            }
                        }
                    },
                    flyParams: { radius: 3, power: 2, flyType: 0 }
                });
            }, 0.05 * i);
        }
    }

    /**
     * 从村民位置生成金币飞向金币容器（逐个生成）
     * @param people 村民
     * @param purchaseType 购买类型
     */
    generateGoldFromPeople(people: RolePeople, purchaseType: number) {
        let coinCount = this.sellRatio;
        for (let i = 0; i < coinCount; i++) {
            this.reservedGold += 1;
            this.scheduleOnce(() => {
                FlyManager.Ins.flyItem({
                    sourceWorldPos: people.node.worldPosition.clone(),
                    targetNode: this.goldContainer.root,
                    targetLocalPos: this.goldContainer.preprocessData(),
                    prefabPath: PrefabPathEnum.COIN_GOLD,
                    onComplete: (item) => {
                        if (item) {
                            this.goldContainer.addItem(item);
                        }
                        this.reservedGold -= 1;
                        this.remainGold += 1;
                        if (people.curNeed <= 0) {
                            //重复执行会被阻断, 不用考虑重复执行的情况
                            this.peopleLeave(people, purchaseType);
                        }
                        AudioMgr.instance.playSound(SoundEnum.Sound_PushItem, 0.7);
                    },
                    flyParams: { radius: 3, power: 2, flyType: 0 }
                });
            }, 0.05 * i);
        }
    }

    /**
     * 从村民位置一次性生成金币飞向金币容器（按购买总数批量生成）
     * @param people 村民
     * @param purchaseType 购买类型
     * @param coinCount 需要生成的金币数量
     */
    generateTatalGoldFromPeople(people: RolePeople, purchaseType: number, coinCount: number) {
        if (!people || coinCount <= 0) return;
        coinCount = Math.floor(coinCount * this.sellRatio);
        for (let i = 0; i < coinCount; i++) {
            this.scheduleOnce(() => {
                this.reservedGold += 1;
                FlyManager.Ins.flyItem({
                    sourceWorldPos: people.node.worldPosition.clone(),
                    targetNode: this.goldContainer.root,
                    targetLocalPos: this.goldContainer.preprocessData(),
                    prefabPath: PrefabPathEnum.COIN_GOLD,
                    onComplete: (item) => {
                        if (item) {
                            this.goldContainer.addItem(item);
                        }
                        this.reservedGold -= 1;
                        this.remainGold += 1;
                    },
                    flyParams: { radius: 3, power: 2, flyType: 0 }
                });
            }, 0.05 * i);
        }
    }

    /**
     * 村民离开（共用离开路径）
     * @param people 要离开的村民
     * @param purchaseType 购买类型
     */
    peopleLeave(people: RolePeople, purchaseType: number, totalBuyCount?: number) {
        if (!people) return;

        const peopleList = this.peopleList;
        const index = peopleList.indexOf(people);
        if (index === -1) return;
        peopleList.splice(index, 1);

        // 重置购买状态
        if (this.currentBuyingPeople === people) {
            this.isFirstBuying = false;
            this.currentBuyingPeople = null;
            this.currentBuyingPeopleType = 0;
        }
        // 刷新队列位置
        this.checkPeoplePosition();
        // 共用离开路径
        if (this.leavePathNode.length > 0) {
            this.moveAlongLeavePath(people, 0);
            //==========================================
            //一次性购买相关逻辑
            //金币起飞点跟随people移动
            // this.generateTatalGoldFromPeople(people, purchaseType, totalBuyCount);
            //==========================================
        } else {
            for (let i = people.itemContainer.root.children.length - 1; i >= 0; i--) {
                const item = people.itemContainer.root.children[i];
                GameInfo.instance.prefabMgr.recoverPrefab(item);
            }
            GameInfo.instance.prefabMgr.recoverPrefab(people.node);
        }
    }
    /**
     * 沿着离开路径移动
     * @param people 村民
     * @param pathIndex 当前路径索引
     */
    private moveAlongLeavePath(people: RolePeople, pathIndex: number) {
        if (pathIndex >= this.leavePathNode.length) {
            for (let i = people.itemContainer.root.children.length - 1; i >= 0; i--) {
                const item = people.itemContainer.root.children[i];
                GameInfo.instance.prefabMgr.recoverPrefab(item);
            }
            // 到达最后一个点，销毁村民
            GameInfo.instance.prefabMgr.recoverPrefab(people.node);
            return;
        }

        // 移动到下一个路径点
        const targetNode = this.leavePathNode[pathIndex];

        // 设置到达回调
        people.onReachedCallback = () => {
            // 继续移动到下一个点
            this.scheduleOnce(() => {
                this.moveAlongLeavePath(people, pathIndex + 1);
            }, 0.05);
        };

        people.nextTarget(targetNode);
    }
}


