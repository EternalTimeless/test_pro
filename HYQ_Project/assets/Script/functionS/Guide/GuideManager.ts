import { _decorator, Animation, Component, Node } from 'cc';
import { GuideLine } from './GuideLine';
import { Player } from '../Player/Player';
import { MoveDrive } from '../../Base/MoveRot/MoveDrive';
import { MonsterCreate } from '../Monster/MonsterCreate';
const { ccclass, property } = _decorator;

@ccclass('GuideManager')
export class GuideManager extends Component {

    public static instance: GuideManager;

    @property(Node)
    public roleNode: Node;

    private isLock: boolean = false;

    @property(Animation)
    public handAnim: Animation;

    start() {
        GuideManager.instance = this;
        this.finishGuide();
    }

    private finishGuide() {
        if (this.isLock) {
            return;
        }
        this.isLock = true;
        if (this.roleNode) {
            this.roleNode.active = false;
        }
        if (this.handAnim?.node) {
            this.handAnim.node.active = false;
        }
        GuideLine.instance?.setLineNode();
        Player.instance.isLock = true;
        MoveDrive.isMoveOk = true;
        MonsterCreate.isStartMove = true;
    }

}