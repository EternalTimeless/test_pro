import { _decorator, Component, Node } from 'cc';
import { EventType } from '../../../Base/EnumList';
import EventManager from '../../../Base/EventManager';
import { UnityUpComponent } from '../../../Base/UnityUpComponent';
import { GameOverPanel } from './GameOverPanel';
import BulletMonsterCollisionManager from '../../Battle/BulletMonsterCollisionManager';
const { ccclass, property } = _decorator;

@ccclass('UIButtonEvent')
export class UIButtonEvent extends Component {

    public onPlayerRebirth() {
        GameOverPanel.instance.hide();
        BulletMonsterCollisionManager.instance.clearBullets();
        EventManager.instance.emit(EventType.PLAYER_RESURRECTION);
    }

}


