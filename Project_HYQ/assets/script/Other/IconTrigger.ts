import { _decorator, Collider, Color, Component, ITriggerEvent, Node, Sprite } from 'cc';
import { ColliderTag } from './ColliderTag';
import { ColliderGroupTag } from '../Common/CommonEnum';
const { ccclass, property } = _decorator;

@ccclass('IconTrigger')
export class IconTrigger extends Component {
    private bg: Sprite = null!;
    private icon: Sprite = null!;
    private triggerColor: Color = new Color(55, 235, 0, 255);//绿色
    private _collider: Collider = null!;
    /**是否在工作, 用于player以外角色触发使用 */
    public isWorking: boolean = false;
    private workingRoleCount: number = 0;
    protected onLoad(): void {
        this._collider = this.node.getComponent(Collider);
        this.bg = this.node.getChildByName('bg')?.getComponent(Sprite);
        this.icon = this.node.getChildByName('icon')?.getComponent(Sprite);
        this.setBgColor(Color.WHITE);
        this.setIconColor(Color.WHITE);
        if (this._collider) {
            this._collider.on(`onTriggerEnter`, this.onTriggerEnter, this);
            this._collider.on(`onTriggerExit`, this.onTriggerExit, this);
        }
    }
    private setBgColor(color: Color) {
        if (this.bg) {
            this.bg.color = color;
        }
    }
    private setIconColor(color: Color) {
        if (this.icon) {
            this.icon.color = color;
        }
    }
    public setWorking(working: boolean) {
        this.isWorking = working;
        if (this.isWorking) {
            this.setBgColor(this.triggerColor);
            this.setIconColor(this.triggerColor);
        } else {
            this.bg.color = Color.WHITE;
            this.setIconColor(Color.WHITE);
        }
    }
    protected onTriggerEnter(event: ITriggerEvent) {
        if (this.isWorking) return;
        const _t = event.otherCollider.node.getComponent(ColliderTag);
        if (_t.tag == ColliderGroupTag.Player || _t.tag == ColliderGroupTag.Worker) {
            this.workingRoleCount++;
            if (this.workingRoleCount > 0) {
                this.setBgColor(this.triggerColor);
                this.setIconColor(this.triggerColor);
            }
        }
    }
    protected onTriggerExit(event: ITriggerEvent) {
        if (this.isWorking) return;
        const _t = event.otherCollider.node.getComponent(ColliderTag);
        if (_t.tag == ColliderGroupTag.Player || _t.tag == ColliderGroupTag.Worker) {
            this.workingRoleCount--;
            if (this.workingRoleCount < 1) {
                this.workingRoleCount = 0;
                this.setBgColor(Color.WHITE);
                this.setIconColor(Color.WHITE);
            }
        }
    }
}
