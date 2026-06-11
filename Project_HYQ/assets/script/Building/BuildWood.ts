import { _decorator, Component, Node, Vec3 } from 'cc';
import { GameInfo } from '../Common/GameInfo';
import { ItemContainer } from '../Common/ItemContainer';
import FlyManager from '../Manager/FlyManager';
import { AudioMgr, SoundEnum } from '../Core/Managers/AudioMgr';
import { PrefabPathEnum } from '../Common/CommonEnum';
import { RoleWorker } from '../Battle/RoleWorker';
const { ccclass, property } = _decorator;

@ccclass('BuildWood')
export class BuildWood extends Component {
    @property({ type: Node, displayName: '建筑' })
    private buildNode: Node = null!;
    @property({ type: Node, displayName: '交互节点' })
    public interactNode: Node = null;
    @property({ type: ItemContainer, displayName: '堆放节点' })
    public ItemContainer: ItemContainer = null!;
    @property({ type: [Node], displayName: '采集对象' })
    public collectionItems: Node[] = [];
    itemsOriginalScale: Vec3[] = []
    itemsOriginalPos: Vec3[] = []
    @property({ type: [Node], displayName: '特效触发节点' })
    effectTriggerNode: Node[] = [];
    @property({ type: [Node], displayName: '采集点' })
    public collectionPoints: Node[] = [];
    /**预留原材料 */
    private reservedItem: number = 0;
    remainItem: number = 0;
    queueLength: number = 2;
    workerList: RoleWorker[] = [];
    protected onLoad(): void {
        this.collectionItems.forEach((item) => {
            this.itemsOriginalScale.push(item.getScale());
            this.itemsOriginalPos.push(item.getWorldPosition());
        });
    }

    update(dt: number) {
        if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin) return;
    }
    // private reservedRole: number = 0;
    // reserveRole() {
    //     this.reservedRole++;
    // }
    /**
     * 预留数量，在飞过来的过程中先减少所需数量
     * @param amount 预留的数量
     */
    reserveItem(amount: number) {
        this.reservedItem += amount;
    }
    updateItem(amount: number) {
        this.reservedItem -= amount;
        this.remainItem += amount;
    }
    //主角拾取
    ItemToHero() {
        if (this.remainItem < 1) return;
        // 扣除
        this.remainItem--;
        FlyManager.Ins.flyItem({
            sourceContainer: this.ItemContainer,
            targetNode: GameInfo.instance.player.woodContainer.root,
            targetLocalPos: GameInfo.instance.player.woodContainer.preprocessData(),
            prefabPath: PrefabPathEnum.COIN_WOOD,
            onComplete: (item) => {
                if (item) {
                    GameInfo.instance.player.woodContainer.addItem(item);
                    AudioMgr.instance.playSound(SoundEnum.Sound_Shop, 0.7);
                }
                GameInfo.instance.viewMgr.addWoodCoin(1);
            },
            flyParams: { radius: 3, power: 2, flyType: 0, needUpdateEnd: true }
        });
    }
}


