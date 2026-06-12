import { _decorator, Collider, ITriggerEvent, Vec3, v3, Node, Collider2D, Contact2DType, IPhysics2DContact } from "cc";
import AudioManager from "../../../Base/AudioManager";
import { LayerEnum, PropEnum, SoundEnum } from "../../../Base/EnumList";
import LayerManager from "../../../Base/LayerManager";
import { UnityUpComponent } from "../../../Base/UnityUpComponent";
import { BagBase } from "../../Bag/Base/BagBase";
import ColliderTag, { COLLIDE_TYPE } from "../../Battle/CollectBattleTarger/ColliderTag";
import Shopping from "../Shopping";
import { JumpManager } from "../../Jump/JumpManager";
import Shopping_Super from "../Shopping_Super";

const { ccclass, property } = _decorator;



// CCClass(BagList);
@ccclass('BuyWayBase')
export class BuyWayBase extends UnityUpComponent {
    private static loopCount: number = 10;
    /**
     * 购买列表
     */
    protected shopingList: Shopping[] = [];

    public nBagArr: BagBase[] = [];

    protected _bagArr: BagBase[] = [];

    /**
     * 多道具购买列表
     */
    protected shoppingSuperList: Shopping_Super[] = [];

    protected onLoad(): void {

        const children = this.node.children;
        for (let i = 0; i < children.length; i++) {
            const cNode = children[i];
            const bag = cNode.getComponent(BagBase);
            if (bag) {
                this._bagArr[bag.placeId] = bag;
            }
        }
        this.refreshBagLocation();
    }



    protected _update(dt: number): void {
        this.Shop();
        this.ShopSuper();
        this.bagUp();
        this.refreshBagLocation();
    }


    private Shop() {
        for (let i = 0; i < this.shopingList.length; i++) {
            let shopping = this.shopingList[i];
            // if (PlayerManager.gold > 0) {
            if (shopping.isUse) {
                // PlayerManager.addGold(-1);
                // 判断是否还有足够的道具
                let layer = LayerManager.instance.getLayer(LayerEnum.Layer_2_sky);
                let bag = this.getBag(shopping.propId);
                if (bag && bag.propCount) {
                    let count = BuyWayBase.loopCount;
                    if (count > bag.propCount) {
                        count = bag.propCount;
                    }
                    if (count > shopping.preGold) {
                        count = shopping.preGold;
                    }
                    if (shopping.propId == PropEnum.gold) {

                        // AudioManager.inst.playOneShot(SoundEnum.Sound_TakeGold);
                    } else {
                        // AudioManager.inst.playOneShot(SoundEnum.Sound_CreateGold);
                    }
                    for (let i = 0; i < count; i++) {
                        let prop = bag.prop;
                        let node = prop.node
                        let wPos = node.worldPosition;
                        layer.addChild(node);
                        node.setWorldPosition(wPos);
                        shopping.moneyPay(1);
                        let bagPos = shopping.jumpNode.worldPosition;
                        // prop.rotVector = this.rotVector;
                        JumpManager.instance.jumpScatter(node, bagPos, 0.5, Math.random() * 0.4 + 0.6, Math.random() * 360)
                            .setScatterRadius(0.75)        // 小范围扩散，既明显又不会飞太远
                            .setRandomness(1)        // 提高随机程度让轨迹更混乱
                            .onComplete(() => {
                                shopping.moneyAccount(1);
                                prop.remove();
                            });
                    }
                }
            }
            // }
        }
    }


    /**
   * 处理多道具商店购买逻辑
   * 遍历 shoppingSuperList 中的每个 Shopping_Super
   * 每个 Shopping_Super 包含多个道具，需要分别处理
   */
    private ShopSuper() {
        for (let i = 0; i < this.shoppingSuperList.length; i++) {
            const shoppingSuper = this.shoppingSuperList[i];

            // 检查商店是否可用
            if (!shoppingSuper.isUse) continue;

            // 遍历该商店的所有道具
            const items = shoppingSuper.allItems;
            for (let j = 0; j < items.length; j++) {
                const item = items[j];

                // 检查该道具是否还有剩余
                if (item.prePaid <= 0) continue;

                // 获取对应背包
                const bag = this.getBag(item.propId);
                if (!bag || !bag.propCount) continue;
                let count = BuyWayBase.loopCount;
                if (count > bag.propCount) {
                    count = bag.propCount;
                }
                if (count > item.prePaid) {
                    count = item.prePaid;
                }
                // AudioManager.inst.playOneShot(SoundEnum.Sound_Gold);
                for (let i = 0; i < count; i++) {
                    // 执行购买逻辑
                    const prop = bag.prop;
                    const node = prop.node;
                    const wPos = node.worldPosition;
                    const layer = LayerManager.instance.getLayer(LayerEnum.Layer_2_sky);

                    layer.addChild(node);
                    node.setWorldPosition(wPos);

                    shoppingSuper.moneyPay(1, item.propId);
                    const bagPos = shoppingSuper.node.worldPosition;
                    JumpManager.instance.jumpScatter(node, bagPos, 2, Math.random() * 0.4 + 0.6, Math.random() * 360)
                        .setScatterRadius(0.75)
                        .setRandomness(1)
                        .onComplete(() => {
                            shoppingSuper.moneyAccount(1, item.propId);
                            prop.remove();
                        });

                }
            }
        }
    }


    private bagUp() {
        for (let i = 0; i < this.nBagArr.length; i++) {
            let bag = this.nBagArr[i];
            if (bag.takeId != PropEnum.null) {
                if (bag.isTake) {
                    let fBag = this.getBag(bag.takeId);
                    if (fBag) {
                        let count = BuyWayBase.loopCount;
                        if (count > bag.propCount) {
                            count = bag.propCount;
                        }
                        // AudioManager.inst.playOneShot(SoundEnum.Sound_PlaceGold);
                        for (let i = 0; i < count; i++) {
                            let prop = bag.prop;
                            let node1 = prop.node;
                            let wPos = node1.worldPosition;
                            let layer = LayerManager.instance.getLayer(LayerEnum.Layer_2_sky);
                            layer.addChild(node1);
                            node1.setWorldPosition(wPos);
                            let endPos = v3(fBag.placePropPos);
                            const c = fBag.NODECOUNT;
                            JumpManager.instance.jumpScatter(node1, endPos, 0.5, Math.random() * 0.4 + 0.6, Math.random() * 360)
                                .setScatterRadius(0.75)
                                .setRandomness(1)
                                .onComplete(() => {
                                    fBag.addProp = prop;
                                }).setEndPosPre((node: Node) => {
                                    let endOldPos = endPos;
                                    let bag1 = fBag;
                                    let count = c;
                                    let endNewPos = bag1.getPropPlaceWordPos(count);
                                    endNewPos.subtract(endOldPos);
                                    endNewPos.add(node.worldPosition);
                                    node.setWorldPosition(endNewPos);
                                }, this);
                        }
                    }
                }
            }

            if (bag.placeId != PropEnum.null) {
                let fBag = this.getBag(bag.placeId);
                if (fBag) {
                    if (fBag.isPropCount) {
                        if (bag.isPlace) {
                            let count = BuyWayBase.loopCount;
                            if (count > fBag.propCount) {
                                count = fBag.propCount;
                            }
                            // AudioManager.inst.playOneShot(SoundEnum.Sound_CreateGold);
                            for (let i = 0; i < count; i++) {
                                let prop = fBag.prop;
                                let node2 = prop.node;
                                let wPos = node2.worldPosition;
                                let layer = LayerManager.instance.getLayer(LayerEnum.Layer_2_sky);
                                layer.addChild(node2);
                                node2.setWorldPosition(wPos);
                                JumpManager.instance.jumpScatter(node2, bag.placePropPos, 0.5, Math.random() * 0.4 + 0.6, Math.random() * 360)
                                    .setScatterRadius(0.75)
                                    .setRandomness(1)
                                    .onComplete(() => {
                                        bag.addProp = prop;
                                    });
                            }
                        }

                    }
                }
            }

        }
    }

    public getBag(propId: PropEnum) {
        return this._bagArr[propId];
    }

    private refreshBagLocation() {
        let index = 0;
        for (let i = 0; i < this._bagArr.length; i++) {
            let bag = this._bagArr[i];
            if (bag && bag.propCount) {
                // bag.node.setSiblingIndex(index);
                bag.node.z = index * -0.251;
                index++;
            }
        }
    }

}
//-1.634  7

