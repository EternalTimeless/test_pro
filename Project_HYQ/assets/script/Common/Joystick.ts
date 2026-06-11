import { _decorator, CCFloat, Component, EventTouch, Input, math, Node, v2, v3, Vec2, Vec3 } from 'cc';
import { VirtualInput } from './VirtualInput';
import { GameInfo } from './GameInfo';
import { AudioMgr, SoundEnum } from '../Core/Managers/AudioMgr';
// import PBASDK from 'db://playable_packager/PBASDK-v3/PBASDK';
// import { SuperPackage } from 'db://playable_packager/SuperPackage';
import { CommonEvent } from './CommonEnum';
// import PBASDK from 'db://super-packager/JiangYv/PBASDK-v3/PBASDK';
import { SuperPackage } from 'db://super-packager/Common/SuperPackage';
import PBASDK from 'db://super-packager/JiangYv/PBASDK-v3/PBASDK';
const { ccclass, property } = _decorator;

@ccclass('Joystick')
export class Joystick extends Component {
    //当3D场景的距离单位较小时, 不设置吸附角度会导致轻微偏移手感较差
    /** 上下左右吸附阈值角度（单位：度），用于避免接近正方向时的轻微偏移 */
    private static readonly SNAP_ANGLE_DEG = 10;
    /** 预计算吸附阈值：sin(θ) */
    private static readonly SNAP_SIN = Math.sin(Joystick.SNAP_ANGLE_DEG * Math.PI / 180);
    /** 预计算吸附阈值：cos(θ) */
    private static readonly SNAP_COS = Math.cos(Joystick.SNAP_ANGLE_DEG * Math.PI / 180);

    @property(Node)
    mClickArea: Node = null; // 交互区域
    @property(Node)
    mStickBackground: Node = null; // 摇杆背景
    @property(Node)
    stick: Node = null; // 摇杆按钮
    /**摇杆的半径 */
    @property(CCFloat)
    radius: number = 120;
    // private startPos: Vec3 = v3(0, 0);
    private mTouchID: number = -1;
    private isBeginTouch: boolean = false;
    start() {
        this.scheduleOnce(() => {
            // PBASDK.Init(SuperPackage.Instance.materialName, 1)
            this.mClickArea.on(Input.EventType.TOUCH_START, this.onMouseDown, this);
            this.mClickArea.on(Input.EventType.TOUCH_MOVE, this.onMouseMove, this);
            this.mClickArea.on(Input.EventType.TOUCH_END, this.onMouseOver, this);
            this.mClickArea.on(Input.EventType.TOUCH_CANCEL, this.onMouseOver, this);
            app.event.on(CommonEvent.ClearMouseEvent, this.removeListeners, this);
            app.event.on(CommonEvent.HideJoystick, this.hideJoystick, this);
            app.event.on(CommonEvent.ShowJoystick, this.showJoystick, this);
            this.mStickBackground.active = false;
            //初始默认隐藏方向舵
            this.mClickArea.active = false;
            // this.startPos = this.mStickBackground.worldPosition.clone()
        }, 0.0);
    }
    hideJoystick() {
        this.mClickArea.active = false;
        this.mStickBackground.active = false;
        if (this.mTouchID == -1) {
            return;
        }
        this.mTouchID = -1;
        VirtualInput.horizontal = 0;
        VirtualInput.vertical = 0;
        this.stick.setPosition(Vec3.ZERO);
        app.event.emit(CommonEvent.JoystickTouchEnd);
        // console.error("隐藏方向舵");
        // PBASDK.TouchEnd();
    }
    showJoystick() {
        this.mClickArea.active = true;
        // console.error("显示方向舵");
    }
    onMouseDown(event: EventTouch) {
        if (this.mTouchID != -1) {
            return;
        }
        this.mTouchID = event.getID();
        //左下角(0,0)坐标系坐标
        let pos = event.touch.getUILocation();
        this.mStickBackground.active = true;
        this.mStickBackground.setPosition(v3(pos.x, pos.y, 0));
        // PBASDK.TouchStart();
        if (!this.isBeginTouch) {
            this.isBeginTouch = true;
            // 如项目开始指引有全屏遮挡->开场动画, 则不需要调用GameStart
            GameInfo.instance.viewMgr.GameStart();
            // PBASDK.GameStart();
        }
        app.event.emit(CommonEvent.JoystickTouchStart);
    }
    onMouseMove(event: EventTouch) {
        if (this.mTouchID != event.getID()) return;

        // 左下角(0,0)坐标系坐标
        let pos = event.touch.getUILocation();
        let worldPosition = new Vec3(pos.x, pos.y, 0);
        let localPosition = v3();
        this.mStickBackground.inverseTransformPoint(localPosition, worldPosition);

        // 计算摇杆位置（限制在半径范围内）
        let stickPos = v3();
        let len = localPosition.length();
        if (len > 0) {
            localPosition.normalize();
            Vec3.scaleAndAdd(stickPos, v3(), localPosition, math.clamp(len, 0, this.radius));
        }
        this.stick.setPosition(stickPos);
        // 优化后的方向计算逻辑
        this.updateDirection(stickPos);
    }

    /**
     * 更新虚拟方向输入
     * @param stickPos 摇杆当前位置
     */
    private updateDirection(stickPos: Vec3) {
        // 设置死区阈值（防止轻微触碰）
        let threshold = this.radius * 0.1;
        const snapSin = Joystick.SNAP_SIN;
        const snapCos = Joystick.SNAP_COS;

        // 检查是否超过死区
        if (Math.abs(stickPos.x) > threshold || Math.abs(stickPos.y) > threshold) {
            // 直接使用归一化的方向向量，避免重复计算
            let magnitude = stickPos.length();
            if (magnitude > 0) {
                // 归一化并设置固定速度
                let nx = stickPos.x / magnitude;
                let ny = stickPos.y / magnitude;

                // 仅修正 VirtualInput 输出：当方向接近上下左右正方向时，强制对齐
                // 条件等价于：与目标轴夹角 <= θ（θ 为 SNAP_ANGLE_DEG），用 sin/cos 阈值做分量判断，避免每次 atan2 的开销
                if (ny >= snapCos && Math.abs(nx) <= snapSin) {
                    nx = 0; ny = 1;
                } else if (ny <= -snapCos && Math.abs(nx) <= snapSin) {
                    nx = 0; ny = -1;
                } else if (nx >= snapCos && Math.abs(ny) <= snapSin) {
                    nx = 1; ny = 0;
                } else if (nx <= -snapCos && Math.abs(ny) <= snapSin) {
                    nx = -1; ny = 0;
                }

                VirtualInput.horizontal = nx;
                VirtualInput.vertical = ny;
            } else {
                VirtualInput.horizontal = 0;
                VirtualInput.vertical = 0;
            }
        } else {
            // 摇杆位移太小，停止移动
            VirtualInput.horizontal = 0;
            VirtualInput.vertical = 0;
        }
    }
    onMouseOver(event: EventTouch) {
        if (this.mTouchID != event.getID()) return;
        this.mStickBackground.active = false;
        this.mTouchID = -1;
        VirtualInput.horizontal = 0;
        VirtualInput.vertical = 0;
        // 松开摇杆时，复位按钮位置
        this.stick.setPosition(Vec3.ZERO);
        app.event.emit(CommonEvent.JoystickTouchEnd);
        //NOTE: TH正式出包再放开
        // PBASDK.TouchEnd();
    }
    removeListeners() {
        this.mClickArea.off(Input.EventType.TOUCH_START, this.onMouseDown, this);
        this.mClickArea.off(Input.EventType.TOUCH_MOVE, this.onMouseMove, this);
        this.mClickArea.off(Input.EventType.TOUCH_END, this.onMouseOver, this);
        this.mClickArea.off(Input.EventType.TOUCH_CANCEL, this.onMouseOver, this);
        this.mStickBackground.active = false;
        const hadTouch = this.mTouchID !== -1;
        this.mTouchID = -1;
        VirtualInput.horizontal = 0;
        VirtualInput.vertical = 0;
        this.stick.setPosition(Vec3.ZERO);
        if (hadTouch) {
            app.event.emit(CommonEvent.JoystickTouchEnd);
        }
    }
}


