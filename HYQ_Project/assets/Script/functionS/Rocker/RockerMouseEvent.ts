import { _decorator, CCFloat, Component, EventTouch, Input, log, Node, UITransform, Vec2, Vec3 } from 'cc';
import RockerManager from './RockerManager';
import RockerLogic from './RockerLogic';
import { RockerUI } from './RockerUI';
import AudioManager from '../../Base/AudioManager';
import { EventType, SoundEnum } from '../../Base/EnumList';
import EventManager from '../../Base/EventManager';
import { CameraMove } from '../../Base/CameraMove';
const { ccclass, property } = _decorator;

@ccclass('RockerMouseEvent')
export class RockerMouseEvent extends Component {


    /**实际rockerUI */
    @property(RockerUI)
    public rockerUI: RockerUI;

    /**遥感动画 */
    @property(Node)
    public rockerAniUI: Node;

    @property(CCFloat)
    public rockerAniUIShowTime = 2;
    private _RockerAniShowTime: number = 2;

    // private _rockerLogic: RockerLogic;

    private isOnClick = false;

    private _downPos: Vec3 = new Vec3();
    start() {
        RockerManager.instance.init(this.rockerUI.tran.width / 2);
        // this._rockerLogic = RockerManager.instance.rockerLogic;
        this.node.on(Node.EventType.TOUCH_START, this.onMouseDown, this);
        this.rockerUI.node.active = false;
    }

    public shouAni() {
        // this.rockerAniUI.active = true;
    }

    private onMouseDown(event: EventTouch) {
        if (!this.isOnClick) {
            this.isOnClick = true;
            EventManager.instance.emit(EventType.firstClick);
            AudioManager.inst.play(SoundEnum.bgm);
        }
        this.node.on(Node.EventType.TOUCH_MOVE, this.onMouseMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onMouseOver, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onMouseOver, this);
        // this._rockerLogic.rockerDown(pos);
        let pos = event.getUILocation(this._tempV2)
        this._tempV3.set(pos.x, pos.y, 0);
        const camera = CameraMove.instance.camera;
        // camera.screenToWorld(this._tempV3, this._tempV3);

        this._downPos.set(this._tempV3);
        EventManager.instance.emit(Node.EventType.TOUCH_START);
        // this.rockerUI.pos = pos;
        // this.rockerUI.node.active = true;
        // this.rockerAniUI.active = false;
    }

    private _tempV3: Vec3 = new Vec3();
    private _tempV2: Vec2 = new Vec2();
    // private curX: number = 0;
    private onMouseMove(event: EventTouch) {
        let pos = event.getUILocation(this._tempV2)
        this._tempV3.set(pos.x, pos.y, 0);
        // const camera = CameraMove.instance.camera;
        // camera.screenToWorld(this._tempV3, this._tempV3);

        let x = this._downPos.x - this._tempV3.x;

        // let X = x / Math.abs(x);
        // if (Number.isNaN(X)) X = 0;
        // if (X != this.curX) {

        // }
        // this._downPos.set(this._tempV3);
        // this._rockerLogic.rockerMove(pos);
        // this.rockerUI.rPos = this._rockerLogic.rockerPos;
        EventManager.instance.emit(Node.EventType.TOUCH_MOVE, x);
    }
    //sk-091ba712d7304c7781291c2c899d8274
    private onMouseOver(event: EventTouch) {
        this.node.off(Node.EventType.TOUCH_MOVE, this.onMouseMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onMouseOver, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onMouseOver, this);
        EventManager.instance.emit(Node.EventType.TOUCH_END);
        // this._rockerLogic.rockerUp();
        // this._rockerLogic.rockerOver();
        // this.rockerUI.rPos = this._rockerLogic.rockerPos;
        // this.rockerUI.node.active = false;
        // this._RockerAniShowTime = this.rockerAniUIShowTime;
    }

    // update(deltaTime: number) {
    //     if (!this.rockerAniUI.active && !this.rockerUI.node.active && this._RockerAniShowTime > 0) {
    //         this._RockerAniShowTime -= deltaTime;
    //         if (this._RockerAniShowTime <= 0) {
    //             this.rockerAniUI.active = true;
    //         }
    //     }
    // }
}


