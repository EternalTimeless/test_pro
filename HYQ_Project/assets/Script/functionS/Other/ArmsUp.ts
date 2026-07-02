import { _decorator, Node, Quat, Tween, Vec3 } from 'cc';
import { Player } from '../Player/Player';
import { ArmsInfo, PropArms } from './PropArms';
import EventManager from '../../Base/EventManager';
import { EffectEnum, EventType, LayerEnum, SoundEnum } from '../../Base/EnumList';
import { CameraMove } from '../../Base/CameraMove';
import { MonsterBattleTaerget } from '../Monster/MonsterBattleTaerget';
import { UnityUpComponent } from '../../Base/UnityUpComponent';
import { EffectManager } from '../Effect/EffectManager';
import AudioManager from '../../Base/AudioManager';
import LayerManager from '../../Base/LayerManager';
const { ccclass, property } = _decorator;

@ccclass('ArmsUp')
export class ArmsUp extends UnityUpComponent {
    private static readonly WEAPON_FLY_DURATION = 0.7;
    private static readonly WEAPON_FLY_ARC_HEIGHT = 4;

    @property(Player)
    public player: Player;

    private _monsterList: MonsterBattleTaerget[] = [];
    private flyingWeaponNodes: Set<Node> = new Set();
    private flyingWeaponStateMap: Map<Node, WeaponFlyState> = new Map();
    private static readonly tempForward: Vec3 = new Vec3();
    private static readonly tempQuat: Quat = new Quat();
    private static readonly tempFlightPos: Vec3 = new Vec3();


    start() {
        EventManager.instance.on(EventType.PROP_ARMS_DIE, this.armsUPEvent, this);
        // EventManager.instance.on(EventType.Monster_Attack_Player_ADD, this.addMonster, this);
        EventManager.instance.on(EventType.PLAYER_RESURRECTION, this.TimeFlowsBackWard, this);
    }

    private armsUPEvent(armsInfo: ArmsInfo) {
        const fbxNode = armsInfo.fbx?.node;
        if (!fbxNode) {
            return;
        }
        if (this.flyingWeaponNodes.has(fbxNode)) {
            return;
        }
        this.flyingWeaponNodes.add(fbxNode);
        PropArms.prepareSpriteWeaponVisual(fbxNode);
        this.player.prepareArmsUpgrade(armsInfo.armsType, armsInfo.weaponBulletConfigIndex);
        const startPos = fbxNode.worldPosition.clone();
        const startRot = fbxNode.worldRotation.clone();
        this.scheduleOnce(() => {
            Tween.stopAllByTarget(fbxNode);
            LayerManager.instance.getLayer(LayerEnum.Layer_1_Ground).addChild(fbxNode);
            fbxNode.setWorldPosition(startPos);
            fbxNode.setWorldRotation(startRot);
            this.faceNodeToPlayer(fbxNode, this.player.node.worldPosition);
            fbxNode.active = true;
            this.startWeaponFly(fbxNode, armsInfo, startPos);
        }, 0);
    }

    private startWeaponFly(node: Node, armsInfo: ArmsInfo, startPos: Vec3): void {
        this.flyingWeaponStateMap.set(node, new WeaponFlyState(node, armsInfo, startPos));
    }

    private completeWeaponFly(node: Node, armsInfo: ArmsInfo): void {
        if (!this.finishWeaponFly(node)) {
            return;
        }
        const pos = this.player.node.worldPosition;
        CameraMove.instance.Shake2(0.5);
        AudioManager.inst.playOneShot(SoundEnum.Sound_Ship_UpLevel);
        this.player.upArms(armsInfo.armsType, armsInfo.weaponBulletConfigIndex);
        EffectManager.instance.addShowEffect(pos, EffectEnum.up, 3)
        CameraMove.instance.Shake1(1.5);
    }

    private finishWeaponFly(node: Node): boolean {
        if (!node) {
            return false;
        }
        const isFlying = this.flyingWeaponNodes.has(node);
        this.flyingWeaponNodes.delete(node);
        this.flyingWeaponStateMap.delete(node);
        if (!isFlying || !node.isValid) {
            return false;
        }
        Tween.stopAllByTarget(node);
        node.active = false;
        return true;
    }

    private updateFlyingWeapons(dt: number): void {
        if (this.flyingWeaponStateMap.size === 0) {
            return;
        }
        const completeList: WeaponFlyState[] = [];
        this.flyingWeaponStateMap.forEach((state) => {
            if (!state.node?.isValid || !this.player?.node?.isValid) {
                this.finishWeaponFly(state.node);
                return;
            }
            state.elapsed += dt;
            const rawT = Math.min(1, state.elapsed / ArmsUp.WEAPON_FLY_DURATION);
            const t = rawT * rawT * (3 - 2 * rawT);
            const playerPos = this.player.node.worldPosition;
            Vec3.lerp(ArmsUp.tempFlightPos, state.startPos, playerPos, t);
            ArmsUp.tempFlightPos.y += ArmsUp.WEAPON_FLY_ARC_HEIGHT * 4 * rawT * (1 - rawT);
            state.node.setWorldPosition(ArmsUp.tempFlightPos);
            this.faceNodeToPlayer(state.node, playerPos);
            if (rawT >= 1) {
                completeList.push(state);
            }
        });
        for (let i = 0; i < completeList.length; i++) {
            this.completeWeaponFly(completeList[i].node, completeList[i].armsInfo);
        }
    }

    private faceNodeToPlayer(node: Node, playerPos: Vec3): void {
        if (!node) {
            return;
        }
        Vec3.subtract(ArmsUp.tempForward, playerPos, node.worldPosition);
        ArmsUp.tempForward.y = 0;
        if (ArmsUp.tempForward.lengthSqr() <= 0.0001) {
            return;
        }
        ArmsUp.tempForward.normalize();
        Quat.fromViewUp(ArmsUp.tempQuat, ArmsUp.tempForward, Vec3.UP);
        node.setWorldRotation(ArmsUp.tempQuat);
    }

    private addMonster(monster: MonsterBattleTaerget) {
        const index = this._monsterList.indexOf(monster);
        if (index === -1) {
            this._monsterList.push(monster);
        }
    }


    protected _update(dt: number): void {
        this.updateFlyingWeapons(dt);
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
            this.player.requestShrinkAfterRoleLoss();
        }
    }

    private TimeFlowsBackWard() {
        this._monsterList.length = 0;
    }


}

class WeaponFlyState {
    public constructor(public node: Node, public armsInfo: ArmsInfo, startPos: Vec3) {
        this.startPos.set(startPos);
    }

    public elapsed: number = 0;
    public startPos: Vec3 = new Vec3();
}


