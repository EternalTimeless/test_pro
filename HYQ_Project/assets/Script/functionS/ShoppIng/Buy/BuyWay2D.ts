import { _decorator, Collider, ITriggerEvent, Vec3, v3, Node, Collider2D, Contact2DType, IPhysics2DContact } from "cc";
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
@ccclass('BuyWay2D')
export class BuyWay2D extends BuyWayBase {
    @property(Collider2D)
    private collide: Collider2D;
    protected onLoad(): void {
        this.collide.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.collide.on(Contact2DType.END_CONTACT, this.onEndContact, this);

        super.onLoad();
    }

    private onBeginContact(selfCollide: Collider2D, other: Collider2D, contcat: IPhysics2DContact) {
        let tag = other.tag;
        switch (tag) {
            case COLLIDE_TYPE.SHOP:
                let shopping = other.getComponent(Shopping);
                if (this.shopingList.indexOf(shopping) == -1) {
                    this.shopingList.push(shopping);
                }
                break;
            case COLLIDE_TYPE.BAG:
                let bag = other.getComponent(BagBase);
                if (this.nBagArr.indexOf(bag) == -1) {
                    this.nBagArr.push(bag);
                }
                break;
        }
    }

    private onEndContact(selfCollide: Collider2D, other: Collider2D, contcat: IPhysics2DContact) {
        let tag = other.tag;
        switch (tag) {
            case COLLIDE_TYPE.SHOP:
                let shopping = other.getComponent(Shopping);
                let index = this.shopingList.indexOf(shopping)
                if (index != -1) {
                    this.shopingList.splice(index, 1);
                }
                break;
            case COLLIDE_TYPE.BAG:
                let bag = other.getComponent(BagBase);
                let index2 = this.nBagArr.indexOf(bag)
                if (index2 != -1) {
                    this.nBagArr.splice(index2, 1);
                }
                break;
        }
    }
}


