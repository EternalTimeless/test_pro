import { _decorator, Collider, ITriggerEvent, Vec3, v3, Node } from "cc";
import AudioManager from "../../../Base/AudioManager";
import { LayerEnum, PropEnum, SoundEnum } from "../../../Base/EnumList";
import LayerManager from "../../../Base/LayerManager";
import { UnityUpComponent } from "../../../Base/UnityUpComponent";
import { BagBase } from "../../Bag/Base/BagBase";
import ColliderTag, { COLLIDE_TYPE } from "../../Battle/CollectBattleTarger/ColliderTag";
import Shopping from "../Shopping";
import { BuyWayBase } from "./BuyWayBase";

const { ccclass, property } = _decorator;



// CCClass(BagList);
@ccclass('BuyWay3D')
export class BuyWay3D extends BuyWayBase {
    @property(Collider)
    private collide: Collider;
    protected onLoad(): void {
        this.collide.on("onTriggerEnter", this.onBeginContact, this);
        this.collide.on("onTriggerExit", this.onEndContact, this);
        super.onLoad();
    }

    private onBeginContact(event: ITriggerEvent) {
        let tag = event.otherCollider.getComponent(ColliderTag);
        switch (tag.tag) {
            case COLLIDE_TYPE.SHOP:
                let shopping = event.otherCollider.getComponent(Shopping);
                if (this.shopingList.indexOf(shopping) == -1) {
                    this.shopingList.push(shopping);
                }
                break;
            case COLLIDE_TYPE.BAG:
                let bag = event.otherCollider.getComponent(BagBase);
                if (this.nBagArr.indexOf(bag) == -1) {
                    this.nBagArr.push(bag);
                }
                break;
        }
    }

    private onEndContact(event: ITriggerEvent) {
        let tag = event.otherCollider.getComponent(ColliderTag);
        switch (tag.tag) {
            case COLLIDE_TYPE.SHOP:
                let shopping = event.otherCollider.getComponent(Shopping);
                let index = this.shopingList.indexOf(shopping)
                if (index != -1) {
                    this.shopingList.splice(index, 1);
                }
                break;
            case COLLIDE_TYPE.BAG:
                let bag = event.otherCollider.getComponent(BagBase);
                let index2 = this.nBagArr.indexOf(bag)
                if (index2 != -1) {
                    this.nBagArr.splice(index2, 1);
                }
                break;
        }
    }
}


