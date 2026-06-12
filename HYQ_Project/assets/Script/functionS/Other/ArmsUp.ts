import { _decorator, Component, Node, Tween, tween, Vec3 } from 'cc';
import { Player } from '../Player/Player';
import { ArmsInfo } from './PropArms';
import EventManager from '../../Base/EventManager';
import { EffectEnum, EventType, PoolEnum, SoundEnum } from '../../Base/EnumList';
import { JumpManager } from '../Jump/JumpManager';
import { CameraMove } from '../../Base/CameraMove';
import { MonsterBattleTaerget } from '../Monster/MonsterBattleTaerget';
import PoolManager from '../../Base/PoolManager';
import { UnityUpComponent } from '../../Base/UnityUpComponent';
import { EffectManager } from '../Effect/EffectManager';
import AudioManager from '../../Base/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('ArmsUp')
export class ArmsUp extends UnityUpComponent {

    @property(Player)
    public player: Player;

    private _monsterList: MonsterBattleTaerget[] = [];


    start() {
        EventManager.instance.on(EventType.PROP_ARMS_DIE, this.armsUPEvent, this);
        // EventManager.instance.on(EventType.Monster_Attack_Player_ADD, this.addMonster, this);
        EventManager.instance.on(EventType.PLAYER_RESURRECTION, this.TimeFlowsBackWard, this);
    }

    private armsUPEvent(armsInfo: ArmsInfo) {
        const pos = this.player.node.worldPosition;
        Tween.stopAllByTarget(armsInfo.fbx);
        JumpManager.instance.jumpCurve(armsInfo.fbx.node, pos, 0.7, 2).onComplete(() => {
            CameraMove.instance.Shake2(0.5);
            armsInfo.fbx.node.active = false;
            AudioManager.inst.playOneShot(SoundEnum.Sound_Ship_UpLevel);
            this.player.upArms(armsInfo.armsType);
            EffectManager.instance.addShowEffect(pos, EffectEnum.up, 3)
            CameraMove.instance.Shake1(1.5);
        });
    }

    private addMonster(monster: MonsterBattleTaerget) {
        const index = this._monsterList.indexOf(monster);
        if (index === -1) {
            this._monsterList.push(monster);
        }
    }


    protected _update(dt: number): void {
        // this.checkPlayerAndMonsterCollide();
    }

    private checkPlayerAndMonsterCollide() {
        const roleList = this.player.roleList;
        let isUpPos = false;
        for (let i = this._monsterList.length - 1; i >= 0; i--) {
            const pos = this._monsterList[i].node.worldPosition;
            for (let j = roleList.length - 1; j >= 0; j--) {
                const rolePos = roleList[j].node.worldPosition;
                const distance = Vec3.squaredDistance(pos, rolePos);
                if (distance < 4) {
                    this._monsterList[i].Hit(100);
                    this._monsterList.splice(i, 1);
                    this.player.roleDie(roleList[j]);
                    roleList.splice(j, 1);
                    isUpPos = true;
                    // roleList[j].node.active = false;
                    break;
                }
            }
        }

        if (isUpPos) {
            this.player.upPos();
        }
    }

    private TimeFlowsBackWard() {
        this._monsterList.length = 0;
    }


}


