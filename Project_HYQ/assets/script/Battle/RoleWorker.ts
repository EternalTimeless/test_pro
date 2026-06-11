import { _decorator, CCInteger, Collider, ICollisionEvent, ITriggerEvent, Label, Node, ParticleSystem, tween, v3, Vec3 } from 'cc';
import { CharacterBase } from './CharacterBase';
import { ItemContainer } from '../Common/ItemContainer';
import { GameInfo, Config, AttackInfo, AttackType } from '../Common/GameInfo';
import FlyManager from '../Manager/FlyManager';
import { PrefabPathEnum, ColliderGroupTag, CharacterStatus, WorkerType } from '../Common/CommonEnum';
import { ColliderTag } from '../Other/ColliderTag';
import { MathUtil } from '../Extra/MathUtil';
const { ccclass, property } = _decorator;
enum WorkStatus {
    /**空闲(Idle) */
    Idle = 0,
    /**任务路径移动(MoveToTask): 移动到具体工作点 */
    MoveToTask = 1,
    /**采集(Gathering) */
    Gathering = 2,
    /**投放(Delivering) */
    Delivering = 3,
    /**售卖(Sell) */
    Sell = 4,
    /**闲逛(Wandering): 在路径点间随机移动+待机, 可被任务随时打断 */
    Wandering = 5,
    Freeze = 99,
}
@ccclass('RoleWorker')
export class RoleWorker extends CharacterBase {
    @property({ type: Node, displayName: '背包节点' })
    public backpack: Node = null;
    public itemContainer: ItemContainer = null!;

    /**角色类型: 工人类型 0-售卖 1-循环采集物品 2-搬运物品 3-固定点伐木, 4-固定点采矿*/
    public roleType: WorkerType = WorkerType.None;
    /**移动目标点 */
    private moveTargetNode: Node = null;
    public isMoving: boolean = false;

    /**到达目标后的回调 */
    public onReachedCallback: (() => void) | null = null;

    /**已分配的队列位置索引 */
    public assignedQueueIndex: number = -1;

    // ========== 搬运工属性 ==========
    public pathNodeContainer: Node = null;

    public carryLimit: number = 30;

    // /**搬运来源: 0=脏衣服堆放点 1=干净衣服堆放点*/
    // public carryFrom: number = 0;
    // /**建筑索引 */
    // public carryTo: number = -1;

    /**配置的路径节点（完整路径） */
    private pathNodes: Node[] = [];
    /**当前移动的临时路径队列 */
    private currentPathQueue: Node[] = [];
    private currentPathIndex: number = 0;
    /**背包中的物品计数 */
    private currentCarryCount: number = 0;
    /**飞行中的物品计数（已从背包移除但还在飞行的物品） */
    private flyingItemCount: number = 0;

    /**采集源容器 */
    private sourceContainer: ItemContainer = null;
    /**投放目标容器 */
    private targetContainer: ItemContainer = null;
    /**
     * 获取总物品计数（背包中的 + 飞行中的）
     */
    private getTotalCarryCount(): number {
        return this.currentCarryCount + this.flyingItemCount;
    }

    // ========== 工人工作状态相关 ==========
    private workStatus: WorkStatus = WorkStatus.Idle;

    /**工作计时器 */
    private workTimer: number = 0;

    /**工作检查间隔（动态调整） */
    private workInterval: number = 0.5;

    /**默认检查间隔 */
    private readonly defaultWorkInterval: number = 0.5;

    /**容器为空的计时器 */
    private emptyContainerTimer: number = 0;
    /**容器为空的阈值（秒） */
    private readonly emptyContainerThreshold: number = 2.0;
    /**制造工：源容器为空时最多等待（秒） */
    private readonly productionEmptyWaitThreshold: number = 5.0;

    /**制造工搬运：是否处于采集/投放流程 */
    private _productionCarryActive: boolean = false;
    /**制造工搬运完成回调 */
    private _productionCarryCompleteCb: (() => void) | null = null;

    // ========== 巡逻相关 ==========
    /**空闲等待计时器 */
    private idleTimer: number = 0;
    /**空闲等待时间常量（秒） */
    private readonly IDLE_WAIT_TIME: number = 2.0;

    private _collider: Collider = null!


    private originBackpackPos: Vec3 = v3(0, 0, 0);
    private curWeaponLevel: number = 0;
    /**当前武器, 通过角色类型判断0-矿镐, 1-斧头 */
    @property({ type: [Node], displayName: '武器节点' })
    weaponNode: Node[] = [];
    @property({ type: Node, displayName: '武器特效节点' })
    weaponEffectNode: Node = null!;
    /**特效粒子 */
    weaponEffect: ParticleSystem[] = [];
    /**当前采集目标, 临时设置, 直接外部设置 */
    public curCollectTarget: Node = null!;
    public originalCollectScale: Vec3 = v3(1, 1, 1);
    public originalCollectPos: Vec3 = v3(0, 0, 0);
    //跟随相关设置
    isFollow: boolean = false;
    followIndex: number = -1;


    onLoad(): void {
        super.onLoad();
        this.originBackpackPos = this.backpack.position.clone();
        this.itemContainer = this.backpack.getChildByName("item").getComponent(ItemContainer);
        // ========== 碰撞器初始化（暂时注释，后续可能使用） ==========
        this._collider = this.node.getComponent(Collider);
        if (this._collider) {
            this._collider.on(`onTriggerEnter`, this.onTriggerEnter, this);
            this._collider.on(`onTriggerStay`, this.onTriggerStay, this);
            this._collider.on(`onTriggerExit`, this.onTriggerExit, this);
            this._collider.on(`onCollisionEnter`, this.onCollisionEnter, this);
            this._collider.on(`onCollisionStay`, this.onCollisionStay, this);
            this._collider.on(`onCollisionExit`, this.onCollisionExit, this);
        }
        // ========================================
        this.weaponNode.forEach((node, index) => {
            node.active = false;
        })

        if (this.weaponEffectNode) {
            let selfPart = this.weaponEffectNode.getComponent(ParticleSystem);
            if (selfPart) {
                this.weaponEffect.push(selfPart);
            }
            let len = this.weaponEffectNode.children.length;
            for (let i = 0; i < len; i++) {
                let child = this.weaponEffectNode.children[i];
                let part = child.getComponent(ParticleSystem);
                if (part) {
                    this.weaponEffect.push(part);
                }
            }
        }
    }
    private counts: number[] = [];
    private lastRandomResult: number = -1; // 记录上次返回的随机数
    /**
     * 获取[0-this.counts.length]之间的随机整数，确保长期执行时各数字出现次数差距不超过2
     * 连续调用2次时返回的随机数不能相同
     * @returns 0-this.counts.length之间的随机整数
     */
    getRandomInt(): number {
        // 计算当前最大和最小的出现次数
        // const maxCount = Math.max(...this.counts);
        const minCount = Math.min(...this.counts);

        // 确定候选数字范围
        const candidates: number[] = [];

        // 如果最大差距达到1，只允许选择出现次数较少的数字
        this.counts.forEach((count, num) => {
            //最大差距达到2
            // if (count <= minCount + 1) 
            if (count <= minCount) {
                candidates.push(num);
            }
        });

        // 从候选列表中移除上次的结果（如果存在）
        if (this.lastRandomResult !== -1) {
            const lastIndex = candidates.indexOf(this.lastRandomResult);
            if (lastIndex !== -1 && candidates.length > 1) {
                candidates.splice(lastIndex, 1);
            }
        }

        // 如果移除后候选列表为空，重新添加所有符合条件的候选项
        if (candidates.length === 0) {
            this.counts.forEach((count, num) => {
                //  if (count <= minCount + 1) 
                if (count <= minCount) {
                    candidates.push(num);
                }
            });
        }

        // 从候选数字中随机选择一个
        const randomIndex = Math.floor(Math.random() * candidates.length);
        const selected = candidates[randomIndex];

        // 更新选中数字的计数和记录
        this.counts[selected]++;
        this.lastRandomResult = selected;
        return selected;
    }
    start() {
        super.initData();
        this.initRoleType();
    }

    /**
     *  工人初始化
     */
    protected initRoleType() {
        this.workStatus = WorkStatus.Idle;
        this.workTimer = 0;
        this.idleTimer = 0; // 初始化空闲计时器
        this.currentCarryCount = 0;
        this.flyingItemCount = 0;
        this.emptyContainerTimer = 0;
    }

    /**
     * 初始化搬运工路径和容器（通过索引获取容器对象）
     * @param type 工人类型 0-售卖 1-砍伐/搬运 3-固定点收集
     * @param pathContainer 路径节点容器（子节点按顺序为路径点）
     * @param carryFrom 搬运来源
     * @param carryTo 建筑索引
     */
    initWorker(
        type: number,
        pathContainer?: Node,
        carryFrom?: number,
        carryTo?: number,
    ) {
        this.roleType = type;
        if (this.roleType == 0) {
            //隐藏所有武器
            this.weaponNode.forEach((node) => {
                node.active = false;
            });
            return;
        }
        if (this.roleType == 3) {
            //显示斧头
            this.weaponNode[0].active = true;
            this.targetContainer = GameInfo.instance.buildingMgr.buildWood.ItemContainer;
            return;
        }
        if (this.roleType == 4) {
            //显示矿镐
            this.weaponNode[1].active = true;
            this.targetContainer = GameInfo.instance.buildingMgr.buildMine.ItemContainer;
            return;
        }
        if (this.roleType == 5) {
            //显示铁锤
            this.weaponNode[2].active = true;
            this.targetContainer = GameInfo.instance.buildingMgr.buildMine.ItemContainer;
            return;
        }
        if (this.roleType == WorkerType.Production || this.roleType == WorkerType.MachineFishing) {
            this.weaponNode.forEach((node) => {
                node.active = false;
            });
            if (this.roleType == WorkerType.Production) {
                this.sourceContainer = GameInfo.instance.buildingMgr.buildWood.ItemContainer;
            }
            return;
        }
        this.pathNodeContainer = pathContainer;
        // this.carryFrom = carryFrom;
        // this.carryTo = carryTo;
        // NOTE 通过索引获取源容器
        // 读取巡逻路径节点
        this.pathNodes = [];
        for (let i = 0; i < pathContainer.children.length; i++) {
            this.pathNodes.push(pathContainer.children[i]);
            this.counts.push(0);
            this.lastRandomResult = -1;
        }

        // 初始化计数（如有需要可在此扩展）
        // this.currentCarryCount = 0;
        // this.flyingItemCount = 0;
        // 初始化：优先移动到第一个路径点(pathNodes[0])，到达后再开始其他逻辑
        this.currentPathQueue = [this.pathNodes[0]];
        this.currentPathIndex = 0;
        this.idleTimer = 0;
        // 使用任务路径移动状态，复用现有 onTargetReached -> Idle 的流程
        this.setWorkStatus(WorkStatus.MoveToTask);
        this.moveToNextPathNode();
    }
    /** 制造工：进入 work 循环（由 BuildWorkTable 进度条驱动，动画与产出解耦） */
    public startProductionWork(): void {
        if (this.statusComp.currentState !== CharacterStatus.Work) {
            this.onWork();
        }
    }
    /** 制造工：停止 work 表现 */
    public stopProductionWork(): void {
        if (this.statusComp.currentState === CharacterStatus.Work) {
            this.statusComp.changeState(CharacterStatus.Idle);
        }
    }
    /** 制造工：配置投放目标与往返路径（pathNodes[0]=采集点, pathNodes[1]=投放交互点） */
    public initProductionWorker(materialContainer: ItemContainer, pathNodes: Node[] = []): void {
        this.targetContainer = materialContainer;
        this.sourceContainer = GameInfo.instance.buildingMgr.buildWood.ItemContainer;
        if (pathNodes.length < 1) return;
        this.pathNodes = [...pathNodes];
    }
    /** 制造工：是否处于搬运流程 */
    public isProductionCarryBusy(): boolean {
        return this._productionCarryActive;
    }
    /** 制造工：原材料不足时开始去木堆采集 */
    public startProductionCarryFlow(onComplete: () => void): void {
        if (this._productionCarryActive) return;
        if (this.pathNodes.length < 2) {
            onComplete?.();
            return;
        }
        this._productionCarryActive = true;
        this._productionCarryCompleteCb = onComplete;
        this.emptyContainerTimer = 0;
        this.stopProductionWork();
        this.startPathMovement(false, true);
    }
    setFollow(isFollow: boolean) {
        this.isFollow = isFollow;
        //已在跟随队列中
        if (this.followIndex == -1) {
            return;
        }
        if (isFollow) {
            GameInfo.instance.followMgr.appendFollowers([this.node]);
            this.followIndex = GameInfo.instance.followMgr.followerCount - 1;
        } else {
            GameInfo.instance.followMgr.removeFollowerAt(this.followIndex);
            this.followIndex = -1;
        }
    }
    /**冻结所有工作状态 */
    setFreeze(freeze: boolean) {
        this.setWorkStatus(freeze ? WorkStatus.Freeze : WorkStatus.Idle);
        this.stopMove();
    }
    update(dt: number) {
        super.update(dt);

        // 只有采集工人才执行自动化工作逻辑
        if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin) return;
        if (this.isFollow) return;
        if (this.workStatus == WorkStatus.Freeze) return;
        // 到达后待机一段时间再取下一个随机点
        this.workTimer += dt;
        if (this.workTimer >= this.workInterval) {
            this.workTimer = 0;
            this.updateWorkerState();
        }
    }

    /**
     * 设置工作状态并调整工作间隔
     * @param status 0=空闲(Idle), 1=任务移动(MoveToTask), 2=采集(Gathering), 3=投放(Delivering), 4=售卖(Sell), 5=闲逛(Wandering)
     */
    private setWorkStatus(status: WorkStatus): void {
        const prevStatus = this.workStatus;
        this.workStatus = status;

        // 闲逛状态被其他状态打断时的预留逻辑
        if (prevStatus === WorkStatus.Wandering && status !== WorkStatus.Wandering) {
            // TODO: 这里可以在将来补充打断闲逛时的清理逻辑（例如停止当前移动、重置路径队列等）
        }

        // 采集和投放状态使用快速间隔，其他状态使用默认间隔
        if (status === WorkStatus.Gathering || status === WorkStatus.Delivering) {
            this.workInterval = Config.UNLOCK_CHECK_INTERVAL;
        } else {
            this.workInterval = this.defaultWorkInterval;
        }
    }

    /**
     * 更新工人状态（搬运工专用）
     */
    private updateWorkerState(): void {
        switch (this.roleType) {
            case 0: // 售卖工
                // 无逻辑, 不用移动
                break;
            case 1: // 采集+搬运
                this.updateCollectorState();
                break;
            case 2: // 搬运
                // this.updateCarrierState();
                break;
            case 3: // 固定点采集
            case 4:
            case 5:
                this.updateSpecialGathering();
                break;
            case WorkerType.Production:
                if (this._productionCarryActive) {
                    this.updateCollectorState();
                }
                break;
            default:
                break;
        }
    }
    private onProductionPathArrived(): void {
        if (this.currentPathIndex === 0) {
            this.setWorkStatus(WorkStatus.Gathering);
            this.emptyContainerTimer = 0;
            return;
        }
        if (this.currentPathIndex === 1) {
            if (this.getTotalCarryCount() <= 0) {
                this.finishProductionCarryFlow();
                return;
            }
            this.setWorkStatus(WorkStatus.Delivering);
        }
    }
    private returnToProductionInteractNode(): void {
        if (this.workStatus === WorkStatus.MoveToTask) return;
        this.startPathMovement(true, true);
    }
    private finishProductionCarryFlow(): void {
        this._productionCarryActive = false;
        this.setWorkStatus(WorkStatus.Idle);
        const cb = this._productionCarryCompleteCb;
        this._productionCarryCompleteCb = null;
        cb?.();
    }
    // ========== 采集工自动砍伐/采集逻辑 ==========
    // 采集工(默认 roleType=0)在不同工作状态下执行不同逻辑:
    // - Idle / Wandering: 寻找新的采集目标(如仙人掌) => Gathering
    // - Gathering: 对采集目标执行具体行为(仙人掌=攻击砍伐; 其他采集类型可扩展为挖矿/采集等)
    // - Delivering: 后续可扩展为搬运物品到建筑(榨汁机/仓库等)
    updateCollectorState() {
        switch (this.workStatus) {
            case WorkStatus.Idle:
            case WorkStatus.Wandering:
                break;
            case WorkStatus.MoveToTask:
                // this.startPathMovement(false);
                break;
            case WorkStatus.Gathering:
                this.updateGathering();       // 根据 gatherMode 分发到不同实现
                break;
            case WorkStatus.Delivering:
                this.updateDelivering();      // 同理，投放/搬运分发
                break;
        }
    }
    /**采集主流程 */
    updateGathering() {
        switch (this.roleType) {
            case 1:
                // this.updateAttackGathering();      // 现在的砍仙人掌逻辑
                break;
            case 2:
                // this.updateContainerGathering();   // 旧版 tryCollectFromSource/tryCollectResource 的整合版
                break;
            case WorkerType.Production:
                this.tryCollectFromSource();
                break;
        }
    }
    /**投放主流程 */
    updateDelivering() {
        switch (this.roleType) {
            case 1:
                break;
            case WorkerType.Production:
                this.deliverResource();
                if (this.getTotalCarryCount() <= 0 && this.flyingItemCount <= 0) {
                    this.finishProductionCarryFlow();
                }
                break;
            default:
                break;
        }
    }
    // /**
    //  * 严格检查投放目标容器是否为空
    //  */
    // checkTargetContainerEmpty(): boolean {
    //     if (!this.targetContainer || !this.targetContainer.root) {
    //         return true;
    //     }
    //     return this.targetContainer.isEmpty();
    // }
    // /**
    //  * 严格检查采集源容器是否为空
    //  * 防止同时取出导致的异常
    //  */
    // private isSourceContainerEmpty(): boolean {
    //     if (!this.sourceContainer || !this.sourceContainer.root) {
    //         return true;
    //     }
    //     return this.sourceContainer.isEmpty();
    // }

    /**
     * 开始路径移动
     * @param reverse 是否反向移动（true=从终点到起点，false=从起点到终点）
     * @param onlyFirst 是否只移动到第一个路径点（制造工单段搬运）
     */
    private startPathMovement(reverse: boolean, onlyFirst: boolean = false): void {
        this.currentPathQueue = [...this.pathNodes];
        if (reverse) {
            this.currentPathQueue.reverse();
        }
        if (onlyFirst && this.currentPathQueue.length > 0) {
            this.currentPathQueue = [this.currentPathQueue[0]];
        }
        this.moveToNextPathNode();
        this.setWorkStatus(WorkStatus.MoveToTask);
    }

    /**
     * 移动到队列中的下一个路径点
     */
    private moveToNextPathNode(): void {
        if (this.currentPathQueue.length === 0) {
            // 队列为空，说明已到达目标，不再移动
            return;
        }

        // 取队列第一个节点
        const targetNode = this.currentPathQueue[0];

        // 记录当前路径索引（用于到达后判断是起点还是终点）
        this.currentPathIndex = this.pathNodes.indexOf(targetNode);

        if (targetNode) {
            this.isMoving = true;
            this.moveToWorldPosition(targetNode.worldPosition);
        }
    }

    /**固定点位闲逛：移动到随机路径点，到达后原地待机 */
    startIdle() {
        if (!this.pathNodes || this.pathNodes.length === 0) {
            return;
        }
        const randomIndex = this.getRandomInt();
        this.currentPathQueue = [this.pathNodes[randomIndex]];
        this.currentPathIndex = randomIndex;
        this.setWorkStatus(WorkStatus.Wandering);
        const targetNode = this.currentPathQueue[0];
        if (targetNode) {
            this.isMoving = true;
            this.moveToWorldPosition(targetNode.worldPosition);
        }
    }

    /**指定目标移动 */
    trackToPathPoint(pathPoint: Node) {
        this.moveTargetNode = pathPoint;
        this.isMoving = true;
        this.moveToWorldPosition(pathPoint.worldPosition);
    }
    /**到达目标后的回调 */
    onTargetReached() {
        super.onTargetReached();

        // 外部随机点闲逛：不走路径节点队列
        if (this.workStatus === WorkStatus.Wandering) {
            this.idleTimer = 0;
            this.moveTargetNode = null;
            this.isMoving = false;
            if (this.onReachedCallback) {
                const callback = this.onReachedCallback;
                this.onReachedCallback = null;
                callback();
            }
            return;
        }

        // 处理路径队列移动
        if (this.currentPathQueue.length > 0) {
            // 移除队列第一个元素（已到达的点）
            this.currentPathQueue.shift();

            // 检查队列是否为空
            if (this.currentPathQueue.length > 0) {
                // 队列还有点，继续移动到下一个点
                this.moveToNextPathNode();
                return; // 继续移动，不执行后续逻辑
            } else {
                if (this.workStatus === WorkStatus.MoveToTask) {
                    if (this.roleType === WorkerType.Production && this._productionCarryActive) {
                        this.onProductionPathArrived();
                    } else {
                        this.setWorkStatus(WorkStatus.Delivering);
                    }
                }
                // 无论是任务移动结束还是闲逛移动结束, 都重置空闲计时器
                this.idleTimer = 0;
            }
        }

        this.moveTargetNode = null;
        this.isMoving = false;

        // 如果有回调函数，执行回调
        if (this.onReachedCallback) {
            const callback = this.onReachedCallback;
            this.onReachedCallback = null; // 执行后清空，避免重复调用
            callback();
        }
    }
    protected onTriggerEnter(event: ITriggerEvent) {
        // console.log("onTriggerEnter", event.otherCollider.node.name);
        const _t = event.otherCollider.node.getComponent(ColliderTag);
        if (!_t) return
        if (_t.tag == ColliderGroupTag.Inside) {
            this.isInsideWall = true;
        }
    }
    protected onTriggerStay(event: ITriggerEvent) {
    }
    protected onTriggerExit(event: ITriggerEvent) {
        // console.log("onTriggerExit", event.otherCollider.node.name);
        const _t = event.otherCollider.node.getComponent(ColliderTag);
        if (!_t) return
        if (_t.tag == ColliderGroupTag.Inside) {
            this.isInsideWall = false;
        }
    }
    protected onCollisionEnter(event: ICollisionEvent) {
        // console.log("onCollisionEnter", event.otherCollider.node.name);
        // const _t = event.otherCollider.node.getComponent(ColliderTag);
    }
    protected onCollisionStay(event: ICollisionEvent) {
    }

    protected onCollisionExit(event: ICollisionEvent) {
        // const _t = event.otherCollider.node.getComponent(ColliderTag);

    }
    /**
     * 实现抽象方法：获取所有敌人
     */
    protected getPotentialTargets(): CharacterBase[] {
        const targets: CharacterBase[] = [];
        return targets;
    }

    protected castSkillEffect(): void { }
    protected onAnimationComplete() {
        if (this._isVisualOnlyWorker() &&
            this.statusComp.currentState === CharacterStatus.Work) {
            return;
        }
        switch (this.statusComp.currentState) {
            case CharacterStatus.Work:
                if (this.moveComp?.isMoving) {
                    this.statusComp.changeState(CharacterStatus.Move);
                } else {
                    this.statusComp.changeState(CharacterStatus.Idle);
                }
                if (this.workStatus == WorkStatus.Gathering) {
                    this.startPathMovement(true);
                }
                break;
            default:
                break;
        }
    }
    protected onLoopAnimationComplete(animName?: string): void {
        if (this._isVisualOnlyWorker()) return;
        switch (this.statusComp.currentState) {
            case CharacterStatus.Work:
                this.isGenerateCollection = false;
                break;
            default:
                break;
        }
    }
    protected onWorkEnter() {
        if (this.roleType == 1) {
            if (this.workStatus === WorkStatus.Delivering) {
                // this.animComp?.playAnimation("push", true, 1);
            }
        } else if (this.roleType === 3) {
            this.animComp?.playAnimation("kanshu", true, this.aniTimeScale);
        } else if (this.roleType === 4) {
            this.animComp?.playAnimation("kanshu", true, this.aniTimeScale);
        } else if (this.roleType === 5) {
            this.animComp?.playAnimation("forge", true, this.aniTimeScale);
        } else if (this._isVisualOnlyWorker()) {
            this.animComp?.playAnimation("work", true, this.aniTimeScale);
        } else {
            super.onWorkEnter();
        }
    }
    /** 纯表现工人：制造/机器钓鱼，逻辑由建筑驱动（搬运中除外） */
    private _isVisualOnlyWorker(): boolean {
        if (this.roleType === WorkerType.Production && this._productionCarryActive) {
            return false;
        }
        return this.roleType === WorkerType.Production
            || this.roleType === WorkerType.MachineFishing;
    }
    /** 是否生成过采集物品 */
    private isGenerateCollection: boolean = false;
    protected onWorkUpdate(dt: number): void {
        if (this.roleType !== 3 && this.roleType !== 4 && this.roleType !== 5) return;
        if (this.statusComp.currentState !== CharacterStatus.Work) return;
        if (!this.animComp) return;
        const p = this.animComp.getCurAnimationProgress();
        if (p < this._specialGatherHitProgress) return;
        if (this.isGenerateCollection) return;
        this.isGenerateCollection = true;
        this.triggerCollection();
    }
    protected getTargetRange(): number {
        return this.getTargetSearchRange();
    }
    faceWorkTarget(target: Node) {
        // 后续如果要复用此方法, 可以优化成传入参数
        // 调用前需要进入work状态, 会锁定朝向, 所以需要手动更新朝向
        if (!target) return;
        if (!target || !this.ModelNode) return;
        const tPos = target.worldPosition;
        const mPos = this.node.worldPosition;
        const dir = v3(tPos.x - mPos.x, 0, tPos.z - mPos.z);
        if (Vec3.equals(dir, Vec3.ZERO)) return;
        Vec3.normalize(dir, dir);
        this.ModelNode.setWorldRotation(this.calculateRotationFromDirection(dir));
        Vec3.copy(this._lastValidDirection, dir);
        Vec3.copy(this._targetDirection, dir);
    }
    /**
    * 追踪到目标位置（整合了距离判断）
    */
    trackToTarget() {
        if (!this.moveComp) {
            return;
        }
        if (!this.atkTarget || this.atkTarget.isDead) {
            this.clearTarget();
            return;
        }
        const distanceSq = this.getSquaredDistanceTo(this.atkTarget.node);
        const visionRangeSq = this.getTargetSearchRange();

        // 如果目标超出视野范围，清除目标
        if (distanceSq > visionRangeSq) {
            this.clearTarget();
            return;
        }

        const isInAttackRange = distanceSq <= this.getTargetAttackRange();

        if (isInAttackRange) {
            // 在攻击范围内，停止移动并攻击
            this.stopActiveMovement();
            this.attack();
        } else {
            // 超出攻击范围但在视野内，移动到目标位置
            this.moveToWorldPosition(this.atkTarget.node.worldPosition.clone());
        }
    }
    //#region 采集相关
    //固定点位采集
    updateSpecialGathering() {
        //NOTE 取消容器上限判断
        // if (!this.targetContainer || this.targetContainer.isFull()) {
        //     this.workStatus = WorkStatus.Idle;
        //     if (this.statusComp?.currentState === CharacterStatus.Work) {
        //         this.statusComp.changeState(CharacterStatus.Idle);
        //     }
        //     return;
        // }
        //NOTE 铁匠特殊处理
        if (this.roleType == 5) {
            if (!GameInfo.instance.buildingMgr.buildTrainingCamp.checkMaterial()) {
                this.workStatus = WorkStatus.Idle;
                if (this.statusComp?.currentState === CharacterStatus.Work) {
                    this.statusComp.changeState(CharacterStatus.Idle);
                }
                return;
            }
        }
        // onWork() 在已为 Work 时会直接 return，避免 update 周期内重复播放入场动画
        this.onWork();
    }
    private aniTimeScale: number = 1;
    /** 与原先 scheduleOnce(0.4s) 对应的归一化进度阈值，可按 work动画片长微调 */
    private readonly _specialGatherHitProgress: number = 0.5;
    /** 触发采集效果*/
    private triggerCollection() {
        if (!this.curCollectTarget) return;
        // 采集物晃动效果
        this.playCollectionEffect(this.curCollectTarget);
        let _count = Math.round(Math.random() * 2) + 1;
        if (this.roleType == 5) { //铁匠特殊处理
            _count = 1;
        }
        let wpos = this.curCollectTarget.getWorldPosition();
        wpos.y += 1;
        for (let index = 0; index < _count; index++) {
            this.scheduleOnce(() => {
                this.generateCollectionItems(wpos);
            }, index * 0.05);
        }
    }
    /** 生成采集物品 */
    private generateCollectionItems(wpos: Vec3) {
        // if (this.targetContainer.isFull()) {
        //     this.statusComp.changeState(CharacterStatus.Idle);
        //     this.workStatus = WorkStatus.Idle;
        //     return;
        // }
        if (this.roleType == 5) {  //铁匠特殊处理
            GameInfo.instance.buildingMgr.buildTrainingCamp.convertMaterialToItem();
            return;
        }
        let prefabPath = this.roleType == 3 ? PrefabPathEnum.COIN_WOOD : PrefabPathEnum.COIN_IRON;
        // 投放物品到目标容器
        FlyManager.Ins.flyItem({
            sourceWorldPos: wpos,
            targetNode: this.targetContainer.root,
            targetLocalPos: this.targetContainer.preprocessData(),
            prefabPath: prefabPath,
            onComplete: (item) => {
                if (item) {
                    this.targetContainer.addItem(item);
                }
            },
            flyParams: { radius: 2, power: 2, flyType: 0 }
        });
    }
    /**
     * 播放采集物交互效果
     */
    private playCollectionEffect(target: Node) {
        // let wpos = target.getWorldPosition();
        // wpos.y += 0.3;
        // GameInfo.instance.prefabMgr.createBoomPointEffect(wpos);
        this.playWeaponEffect();
        // 晃动效果
        const originalScale = this.originalCollectScale;
        const originalPos = this.originalCollectPos;

        // 缩放效果
        tween(target)
            .to(0.1, { scale: v3(originalScale.x * 1.1, originalScale.y * 1.1, originalScale.z * 1.1) })
            .to(0.1, { scale: originalScale })
            .start();

        // 晃动效果
        tween(target)
            .to(0.05, { worldPosition: v3(originalPos.x + 0.1, originalPos.y, originalPos.z) })
            .to(0.05, { worldPosition: v3(originalPos.x - 0.1, originalPos.y, originalPos.z) })
            .to(0.05, { worldPosition: originalPos })
            .start();
    }
    /**
     * 尝试从源容器采集资源（制造工 Gathering 状态时持续调用）
     */
    private tryCollectFromSource(): void {
        if (this.roleType !== WorkerType.Production) return;

        if (this.getTotalCarryCount() >= this.carryLimit) {
            this.returnToProductionInteractNode();
            return;
        }

        if (!this.sourceContainer || this.sourceContainer.isEmpty()) {
            this.emptyContainerTimer += this.workInterval;
            if (this.emptyContainerTimer >= this.productionEmptyWaitThreshold) {
                this.emptyContainerTimer = 0;
                this.returnToProductionInteractNode();
            }
            return;
        }

        this.emptyContainerTimer = 0;
        this.tryCollectResource();
    }

    /**
     * 尝试采集资源（并发安全）
     */
    private tryCollectResource(): void {
        if (this.roleType !== WorkerType.Production) return;
        if (!this.sourceContainer || !this.sourceContainer.root) {
            return;
        }
        if (this.sourceContainer.isEmpty()) {
            return;
        }
        if (this.getTotalCarryCount() >= this.carryLimit) {
            return;
        }

        const myContainer = this.itemContainer;
        const prefabPath = PrefabPathEnum.COIN_WOOD;

        this.flyingItemCount++;

        FlyManager.Ins.flyItem({
            sourceContainer: this.sourceContainer,
            targetNode: myContainer.root,
            targetLocalPos: myContainer.preprocessData(),
            prefabPath: prefabPath,
            onComplete: (item) => {
                this.flyingItemCount--;
                if (item) {
                    const addSuccess = myContainer.addItem(item);
                    if (addSuccess) {
                        this.currentCarryCount++;
                    }
                }
            },
            flyParams: { radius: 2, power: 2, flyType: 0, endEulerAngles: v3(0, 0, 0) }
        });
    }

    /**
     * 投放资源到目标容器（制造工 Delivering 状态时持续调用，非碰撞触发）
     */
    private deliverResource(): void {
        if (this.roleType !== WorkerType.Production) return;

        const myContainer = this.itemContainer;
        const prefabPath = PrefabPathEnum.COIN_WOOD;

        if (myContainer.isEmpty() || this.currentCarryCount <= 0) {
            return;
        }
        if (!this.targetContainer || !this.targetContainer.root) {
            return;
        }

        this.currentCarryCount--;
        this.flyingItemCount++;

        FlyManager.Ins.flyItem({
            sourceContainer: myContainer,
            targetNode: this.targetContainer.root,
            targetLocalPos: this.targetContainer.preprocessData(),
            prefabPath: prefabPath,
            onComplete: (item) => {
                this.flyingItemCount--;
                if (item) {
                    this.targetContainer.addItem(item);
                }
            },
            flyParams: { radius: 4, power: 2, flyType: 0 }
        });
    }
    //#endregion

    private isPlayingWeaponEffect: boolean = false;
    playWeaponEffect() {
        let len = this.weaponEffect.length;
        for (let i = 0; i < len; i++) {
            this.weaponEffect[i].stop();
            this.weaponEffect[i].play();
        }
        // if (isPlay) {
        // if (this.isPlayingWeaponEffect) return;
        // this.isPlayingWeaponEffect = true;
        // let len = this.weaponEffect.length;
        // for (let i = 0; i < len; i++) {
        //     this.weaponEffect[i].stop();
        //     this.weaponEffect[i].play();
        // }
        // } else {
        // if (!this.isPlayingWeaponEffect) return;
        // this.isPlayingWeaponEffect = false;
        // let len = this.weaponEffect.length;
        // for (let i = 0; i < len; i++) {
        //     this.weaponEffect[i].stop();
        // }
        // }
    }
}




