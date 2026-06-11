import { _decorator, Collider2D, Color, Component, Contact2DType, IPhysics2DContact, ITriggerEvent, Sprite } from 'cc';
import { ColliderTag } from './ColliderTag';
import { ColliderGroupTag } from '../Common/CommonEnum';
const { ccclass, property } = _decorator;

@ccclass('IconTrigger2D')
export class IconTrigger2D extends Component {
    private bg: Sprite = null!;
    private triggerColor: Color = new Color(55, 235, 0, 255);//绿色
    private _collider: Collider2D = null!;
    /**是否在工作, 用于player以外角色触发使用 */
    public isWorking: boolean = false;
    private workingRoleCount: number = 0;
    protected onLoad(): void {
        this._collider = this.node.getComponent(Collider2D);
        this.bg = this.node.getChildByName('bg').getComponent(Sprite);
        this.bg.color = Color.WHITE;
        if (this._collider) {
            this._collider.on(Contact2DType.BEGIN_CONTACT, this.onTriggerEnter, this);
            this._collider.on(Contact2DType.END_CONTACT, this.onTriggerExit, this);
        }
    }
    public setWorking(working: boolean) {
        this.isWorking = working;
        if (this.isWorking) {
            this.bg.color = this.triggerColor;
        } else {
            this.bg.color = Color.WHITE;
        }
    }
    protected onTriggerEnter(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this.isWorking) return;
        const tag = otherCollider.tag;
        if (tag == ColliderGroupTag.Player || tag == ColliderGroupTag.Worker) {
            this.workingRoleCount++;
            if (this.workingRoleCount > 0) {
                this.bg.color = this.triggerColor;
            }
        }

    }
    protected onTriggerExit(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this.isWorking) return;
        const tag = otherCollider.tag;
        if (tag == ColliderGroupTag.Player || tag == ColliderGroupTag.Worker) {
            this.workingRoleCount--;
            if (this.workingRoleCount < 1) {
                this.workingRoleCount = 0;
                this.bg.color = Color.WHITE;
            }
        }
    }
}
