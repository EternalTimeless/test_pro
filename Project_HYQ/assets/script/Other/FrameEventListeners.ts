import { _decorator, Component, Node } from 'cc';
import { ComponentEvent } from '../Common/CommonEnum';
import { GameInfo } from '../Common/GameInfo';
const { ccclass, property } = _decorator;

@ccclass('FrameEventListeners')
export class FrameEventListeners extends Component {

    onLoad() {
    }
    /**
     * 动画帧事件
     * 此方法会被动画系统自动调用
     */
    onFrameEvent(eventData?: string) {
        GameInfo.instance.gameMgr?.node.emit(ComponentEvent.OnFrameEvent);
    }
}


