import { _decorator, Component, Node, ParticleSystem, v3 } from 'cc';
import { GameInfo } from '../Common/GameInfo';
import { ItemContainer } from '../Common/ItemContainer';
import FlyManager from '../Manager/FlyManager';
import { AudioMgr, SoundEnum } from '../Core/Managers/AudioMgr';
import { ColliderGroupTag, PrefabPathEnum, WorkerType } from '../Common/CommonEnum';
import { BuildInteraction } from './BuildInteraction';
import { RoleWorker } from '../Battle/RoleWorker';
const { ccclass, property } = _decorator;

@ccclass('BuildWorkTable')
export class BuildWorkTable extends Component {
    @property({ type: Node, displayName: '建筑' })
    private buildNode: Node = null!;
    @property({ type: Node, displayName: '交互节点' })
    public interactNode: Node = null;
    @property({ type: Node, displayName: '转换节点' })
    public convertNode: Node = null;
    @property({ type: ItemContainer, displayName: '道具堆放节点' })
    public ItemContainer: ItemContainer = null!;
    // 升级后解锁
    @property({ type: ItemContainer, displayName: '道具堆放节点2' })
    public ItemContainer2: ItemContainer = null!;
    @property({ type: ItemContainer, displayName: '原材料堆放节点' })
    public MaterialContainer: ItemContainer = null!;
    @property({ displayName: '转换比例' })
    convertRotio: number = 2;
    /**预留原材料 */
    private reservedMaterial: number = 0;
    remainMaterial: number = 0;
    private remainItem: number = 0;

    curLv = 0;
    @property({ type: Node, displayName: '工作特效节点' })
    workEffectNode: Node = null!;
    /**特效粒子 */
    workEffect: ParticleSystem[] = [];


    @property({ type: RoleWorker, displayName: '工人' })
    worker: RoleWorker = null!;
    /**是否解锁员工（永久开启制造） */
    public hasWorker: boolean = false;
    isWorking: boolean = false;
    /**工人是否已进入制造上下文（首次进度满不产出，与 Hero 一致） */
    private _workerProduceActive: boolean = false;
    /**工人是否处于原材料搬运流程 */
    private _workerCarryActive: boolean = false;
    protected onLoad(): void {
        this.ItemContainer2.node.active = false;
        if (this.workEffectNode) {
            let selfPart = this.workEffectNode.getComponent(ParticleSystem);
            if (selfPart) {
                this.workEffect.push(selfPart);
            }
            let len = this.workEffectNode.children.length;
            for (let i = 0; i < len; i++) {
                let child = this.workEffectNode.children[i];
                let part = child.getComponent(ParticleSystem);
                if (part) {
                    this.workEffect.push(part);
                }
            }
        }
        this.isWorking = false;
        this.worker.node.active = false;
    }
    upgradeBuild() {
        this.curLv++;
        this.ItemContainer.node.active = false;
        this.ItemContainer2.node.active = true;
        GameInfo.instance.prefabMgr.createAddEffect(this.node.worldPosition, v3(1, 1, 0.8));
    }
    update(dt: number) {
        if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin) return;
        if (!this.hasWorker || !this.worker) return;
        if (this._workerCarryActive) return;
        if (!this.checkMaterial()) {
            this.stopWorkerProduceForCarry();
            return;
        }
        const buildInteraction = this.interactNode.getComponent(BuildInteraction);
        if (!buildInteraction) return;
        buildInteraction.beginInteraction(ColliderGroupTag.ProduceSpot,
            () => {
                const isFirstEntry = !this._workerProduceActive;
                this._workerProduceActive = true;
                if (isFirstEntry) {
                    this.startWorkerVisual();
                }
                if (!this.handleProduceCycle(isFirstEntry)) {
                    this.stopWorkerProduceForCarry();
                }
            });
    }
    unlockWorker() {
        this.hasWorker = true;
        this.worker.initWorker(WorkerType.Production);
        this.worker.initProductionWorker(this.MaterialContainer, [GameInfo.instance.buildingMgr.buildWood.interactNode, this.interactNode]);
        this.worker.node.active = true;
        this.worker.node.setWorldPosition(this.interactNode.worldPosition);
        this.worker.faceWorkTarget(this.convertNode);
        GameInfo.instance.prefabMgr.createAddEffect(this.node.worldPosition, v3(1, 1, 0.8));
    }
    /** 进度条满一轮：首次不产出，后续轮转换材料；返回是否可继续制造 */
    handleProduceCycle(isFirstEntry: boolean): boolean {
        if (!isFirstEntry) {
            this.playWorkEffect();
            this.convertMaterialToItem();
        }
        return this.checkMaterial();
    }
    /** 工人进入制造表现（work 循环动画，与进度条解耦） */
    private startWorkerVisual() {
        if (!this.worker) return;
        this.worker.faceWorkTarget(this.convertNode);
        this.worker.startProductionWork();
    }
    /** 停止制造表现（不重置首次产出标记） */
    private stopWorkerProduceVisual() {
        const buildInteraction = this.interactNode?.getComponent(BuildInteraction);
        buildInteraction?.exitInteraction();
        this.worker?.stopProductionWork();
    }
    /** 材料不足：停止制造并启动搬运流程 */
    private stopWorkerProduceForCarry() {
        if (this._workerCarryActive || this.worker?.isProductionCarryBusy()) return;
        this.stopWorkerProduceVisual();
        this._workerCarryActive = true;
        this.worker.startProductionCarryFlow(() => this.onWorkerCarryComplete());
    }
    /** 搬运投放完成：回到交互点，恢复制造动画 */
    private onWorkerCarryComplete() {
        this._workerCarryActive = false;
        if (!this.worker?.node?.isValid || !this.interactNode?.isValid) return;
        this.worker.node.setWorldPosition(this.interactNode.worldPosition);
        this.worker.faceWorkTarget(this.convertNode);
        // 搬运前已在制造中：_workerProduceActive 未重置，进度条回调不会再走 isFirstEntry，需主动恢复 work 动画
        if (this._workerProduceActive) {
            this.startWorkerVisual();
        }
    }
    /**
     * 是否开启制造（角色触发，使用引用计数）
     * @param working 是否开启：true=进入制造区域，false=离开制造区域
     */
    checkWorking(working: boolean) {
        // 如果已解锁员工，制造永久开启，不受角色控制
        if (this.hasWorker) {
            return;
        }
        this.isWorking = working;
    }
    /**预留原材料 */
    updateMaterial(amount: number) {
        this.remainMaterial += amount;
    }
    //不考虑飞行中的原材料, 判断原材料是否足够生产
    checkMaterial() {
        let cost = this.convertRotio * (this.curLv + 1);
        if (this.MaterialContainer.getItemCount() < cost) return false;
        return true;
    }
    /**转换原材料为道具 */
    convertMaterialToItem() {
        let cost = this.convertRotio * (this.curLv + 1);
        if (this.MaterialContainer.getItemCount() < cost) return;
        // 根据cost数量, 删除MaterialContainer中的item
        for (let index = 0; index < cost; index++) {
            let item = this.MaterialContainer.getLastItem()
            if (item) {
                item.removeFromParent();
                GameInfo.instance.prefabMgr.recoverPrefab(item);
            }
        }
        let prefabPath = this.curLv > 0 ? PrefabPathEnum.COIN_NET : PrefabPathEnum.COIN_ROD;
        let con = this.curLv > 0 ? this.ItemContainer2 : this.ItemContainer;
        FlyManager.Ins.flyItem({
            sourceWorldPos: this.convertNode.worldPosition,
            targetNode: con.root,
            targetLocalPos: con.preprocessData(),
            prefabPath: prefabPath,
            onComplete: (item) => {
                if (item) {
                    con.addItem(item);
                    // AudioMgr.instance.playSound(SoundEnum.sound_pushItem);
                }
            },
            flyParams: { radius: 2, power: 2, flyType: 0 }
        })
    }
    playWorkEffect() {
        let len = this.workEffect.length;
        for (let i = 0; i < len; i++) {
            this.workEffect[i].stop();
            this.workEffect[i].play();
        }
    }
}


