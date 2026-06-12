import { _decorator, Animation, CacheMode, Component, Node } from 'cc';
import { GuideLine } from './GuideLine';
import { Player } from '../Player/Player';
import { MoveDrive } from '../../Base/MoveRot/MoveDrive';
import { EffectManager } from '../Effect/EffectManager';
import { EffectEnum, EventType, SoundEnum } from '../../Base/EnumList';
import { CameraMove } from '../../Base/CameraMove';
import AudioManager from '../../Base/AudioManager';
import EventManager from '../../Base/EventManager';
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
        GuideLine.instance.setLineNode(Player.instance.node, this.roleNode);
        EventManager.instance.on(EventType.firstClick, this.onClickEvent, this);
    }


    private onClickEvent() {
        this.handAnim.node.active = false;
    }

    protected update(dt: number): void {
        const x = Math.abs(this.roleNode.x - Player.instance.node.x);
        if ((x < 0.8 || Player.instance.node.x >= this.roleNode.x) && !this.isLock) {
            this.isLock = true;
            this.roleNode.active = false;
            GuideLine.instance.setLineNode();
            Player.instance.isLock = true;
            MoveDrive.isMoveOk = true;
            MonsterCreate.isStartMove = true;
            EffectManager.instance.addShowEffect(Player.instance.node.worldPosition, EffectEnum.up, 2);
            CameraMove.instance.Shake1();
            AudioManager.inst.playOneShot(SoundEnum.Sound_Ship_UpLevel);
        }
    }



}


