import { _decorator, CCFloat, Collider, Component, easing, ITriggerEvent, Node, Tween, tween, v3, Vec3 } from 'cc';
import { ColliderGroupTag } from '../Common/CommonEnum';
import { ColliderTag } from '../Other/ColliderTag';
import { AudioMgr, SoundEnum } from '../Core/Managers/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('BuildDoor')
export class BuildDoor extends Component {
    @property({ type: Node, displayName: '门1' })
    public door: Node = null!;
    @property({ type: Node, displayName: '门2' })
    public door2: Node = null!;
    @property({ type: Node, displayName: '门触发器' })
    public doorTrigger: Node = null!;
    private _collider: Collider;
    private isOpen: boolean = false;
    private _currentTween: Tween<Node> | null = null;
    private _currentTween2: Tween<Node> | null = null;
    /**开启角色碰撞检测 */
    private isUnlockColliderChecking: boolean = true;
    private isUnlockColliderTimer: number = 0;
    private door1_orignal: Vec3 = new Vec3();
    private door2_orignal: Vec3 = new Vec3();
    // @property({ type: Node, displayName: '门1开' })
    // private openNode1: Node = null;
    // @property({ type: Node, displayName: '门2开' })
    // private openNode2: Node = null;
    onLoad() {
        this._collider = this.doorTrigger.getComponent(Collider);
        if (this._collider) {
            this._collider.on(`onTriggerEnter`, this.onTriggerEnter, this);
            this._collider.on(`onTriggerExit`, this.onTriggerExit, this);
        }
        // this.door1_orignal = this.door.worldPosition.clone();
        // this.door2_orignal = this.door2.worldPosition.clone();
        this.door1_orignal = this.door.eulerAngles.clone();
        this.door2_orignal = this.door2.eulerAngles.clone();
    }
    onTriggerEnter(event: ITriggerEvent) {
        const _t = event.otherCollider.node.getComponent(ColliderTag);
        if (_t.tag == ColliderGroupTag.Soldier) {
            this.isUnlockColliderChecking = false;
            this.openDoor();
        }
    }
    onTriggerExit(event: ITriggerEvent) {
        const _t = event.otherCollider.node.getComponent(ColliderTag);
        if (_t.tag == ColliderGroupTag.Soldier) {
            this.isUnlockColliderChecking = false;
            this.closehDoor();
        }
    }
    openDoor() {
        if (!this.isOpen) {
            this.isOpen = true;
            if (this._currentTween) {
                this._currentTween.stop();
                this._currentTween = null;
            }
            if (this._currentTween2) {
                this._currentTween2.stop();
                this._currentTween2 = null;
            }
            // AudioMgr.instance.playSound(SoundEnum.sound_openDoor, 0.6);
            this._currentTween = tween(this.door).to(0.5, { eulerAngles: v3(this.door1_orignal.x, this.door1_orignal.y - 120, this.door1_orignal.z) }, { easing: easing.quadOut }).start();
            this._currentTween2 = tween(this.door2).to(0.5, { eulerAngles: v3(this.door2_orignal.x, this.door2_orignal.y + 120, this.door2_orignal.z) }, { easing: easing.quadOut }).start();
        }
    }
    closehDoor() {
        if (this.isOpen) {
            this.isOpen = false;
            if (this._currentTween) {
                this._currentTween.stop();
                this._currentTween = null;
            }
            if (this._currentTween2) {
                this._currentTween2.stop();
                this._currentTween2 = null;
            }
            this._currentTween = tween(this.door).to(0.5, { eulerAngles: this.door1_orignal }, { easing: easing.quadOut }).start();
            this._currentTween = tween(this.door2).to(0.5, { eulerAngles: this.door2_orignal }, { easing: easing.quadOut }).start();
        }
    }
    update(dt: number) {
        if (this.door.active && this.isUnlockColliderChecking) {
            this.isUnlockColliderTimer += dt;
            if (this.isUnlockColliderTimer > 0.2) {
                this.closehDoor();
                this.isUnlockColliderChecking = false;
                this.isUnlockColliderTimer = 0;
            }
        }
    }
}


