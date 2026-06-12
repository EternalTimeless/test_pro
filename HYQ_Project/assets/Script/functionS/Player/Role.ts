import { _decorator, CCInteger, Color, Component, Node, Quat } from 'cc';
import { FbxManager } from '../SkAnim/FbxManager';
import { BulletEnum, LayerEnum, RoleEnum, SoundEnum } from '../../Base/EnumList';
import BulletManager from '../Battle/BulletManager';
import LayerManager from '../../Base/LayerManager';
import { MeshFlashData } from '../Battle/Base/BattleTargetBase';
import { FlashRedManager } from '../Battle/Base/FlashRedManager';
import { AttackParkPlay } from '../Battle/Battle3D/AttackParkPlay';
import AudioManager from '../../Base/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Role')
export class Role extends Component {

    @property({ type: RoleEnum })
    public type: RoleEnum = RoleEnum.underling;

    @property(FbxManager)
    public fbxManager: FbxManager;

    @property(Node)
    public shoot: Node;

    public hp: number = 2;

    @property(Node)
    public arms: Node;

    @property(CCInteger)
    public attackNum: number = 0;


    public attackIN: boolean = false;


    public static soundType: SoundEnum = SoundEnum.Sound_Gun;
    public static bulletType: BulletEnum = BulletEnum.arrow;
    public static power: number = 1;
    public static repelPower: number = 0;
    public static bulletLayer: Node;

    @property(AttackParkPlay)
    public effect: AttackParkPlay;
    // public attackTime: number = 0;
    // ==================== 闪红效果 ====================
    @property({ type: [MeshFlashData], tooltip: '闪红MeshRenderer配置列表，可在属性检查器中编辑' })
    public meshFlashDataList: MeshFlashData[] = [];
    @property({ type: [MeshFlashData], tooltip: '闪红MeshRenderer配置列表，可在属性检查器中编辑' })
    public meshRedDataList: MeshFlashData[] = [];
    @property({ type: [MeshFlashData], tooltip: '闪红MeshRenderer配置列表，可在属性检查器中编辑' })
    public meshCreateDataList: MeshFlashData[] = [];


    start() {
        if (!Role.bulletLayer) {
            Role.bulletLayer = LayerManager.instance.getLayer(LayerEnum.BulletLayer);
        }
        // this.fbxManager.setAttackAnimCall(this.attackEvent, this)
    }


    public die(time: number) {
        FlashRedManager.instance.flashRed(this.node, this.meshFlashDataList, time * 1.1, Color.GRAY);
    }

    // protected update(dt: number): void {
    //     if (!this.attackIN) {
    //         this.attackTime -= dt;
    //     }
    // }

    public attackEvent(num: number) {
        AudioManager.inst.playOneShot(Role.soundType, 0.3, 0.08);
        console.log("攻击", num);
        const pos = this.shoot.worldPosition;

        const bullet = BulletManager.instance.shootBullet3D(Role.bulletType, Quat.IDENTITY, Role.power, Role.repelPower);
        Role.bulletLayer.addChild(bullet.node);
        bullet.node.setWorldPosition(pos);
        this.effect?.play();

        for (let i = 0; i < this.attackNum; i++) {
            const bullet = BulletManager.instance.shootBullet3D(Role.bulletType, Quat.IDENTITY, Role.power, Role.repelPower);
            Role.bulletLayer.addChild(bullet.node);
            bullet.node.setWorldPosition(pos);
            const x = (Math.random() - 0.5) * 2;
            bullet.node.x += x;
            const z = (Math.random() - 0.5) * 4;
            bullet.node.z += z;
        }

    }


}


