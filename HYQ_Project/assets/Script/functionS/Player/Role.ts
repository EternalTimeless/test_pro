import { _decorator, CCInteger, Color, Component, Node, Quat, Vec3 } from 'cc';
import { FbxManager } from '../SkAnim/FbxManager';
import { BulletEnum, LayerEnum, RoleEnum, SoundEnum } from '../../Base/EnumList';
import BulletManager from '../Battle/BulletManager';
import LayerManager from '../../Base/LayerManager';
import { MeshFlashData } from '../Battle/Base/BattleTargetBase';
import { FlashRedManager } from '../Battle/Base/FlashRedManager';
import { AttackParkPlay } from '../Battle/Battle3D/AttackParkPlay';
import AudioManager from '../../Base/AudioManager';
import BulletMonsterCollisionManager from '../Battle/BulletMonsterCollisionManager';
import BulletBattle3D from '../Battle/Battle3D/Bullet/BulletBattle3D';
import { PropLalianGate } from '../Other/PropLalianGate';
import { BulletBatchRenderer } from '../Battle/BulletBatchRenderer';
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

    private static aimVector: Vec3 = new Vec3();
    private static aimQuat: Quat = new Quat();
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

    public get visualBulletCount() {
        return 1 + this.attackNum;
    }

    public attackEvent(num: number, visualBulletCount: number = this.visualBulletCount, damageScale: number = 1, lockWorldX: number = this.node.worldPosition.x, playEffect: boolean = true) {
        if (visualBulletCount <= 0) {
            return;
        }
        AudioManager.inst.playOneShot(Role.soundType, 0.3, 0.08);
        const pos = this.shoot.worldPosition;
        const damage = Role.power * damageScale;
        const batchRenderer = BulletBatchRenderer.getOrCreate(Role.bulletLayer);

        const bullet = BulletManager.instance.shootBullet3D(Role.bulletType, Quat.IDENTITY, damage, Role.repelPower);
        Role.bulletLayer.addChild(bullet.node);
        bullet.node.setWorldPosition(pos);
        Role.aimBulletToCurrentTarget(bullet, lockWorldX);
        batchRenderer.registerBullet(bullet);
        if (playEffect) {
            this.effect?.play();
        }

        for (let i = 1; i < visualBulletCount; i++) {
            const bullet = BulletManager.instance.shootBullet3D(Role.bulletType, Quat.IDENTITY, damage, Role.repelPower);
            Role.bulletLayer.addChild(bullet.node);
            bullet.node.setWorldPosition(pos);
            const x = (Math.random() - 0.5) * 2;
            bullet.node.x += x;
            const z = (Math.random() - 0.5) * 4;
            bullet.node.z += z;
            Role.aimBulletToCurrentTarget(bullet, lockWorldX);
            batchRenderer.registerBullet(bullet);
        }

    }

    public static aimBulletToCurrentTarget(bullet: BulletBattle3D, lockWorldX: number = bullet.node.worldPosition.x): void {
        const target = BulletMonsterCollisionManager.instance.getLockableLalianTarget(bullet.node.worldPosition, lockWorldX, bullet.attackTargetTag);
        if (!target) {
            return;
        }
        const gate = target as PropLalianGate;
        const aimPos = gate.getLockAimWorldPosition
            ? gate.getLockAimWorldPosition(bullet.node.worldPosition, Role.aimVector)
            : target.hitNode.worldPosition;
        Vec3.subtract(Role.aimVector, aimPos, bullet.node.worldPosition);
        Role.aimVector.y = 0;
        if (Role.aimVector.lengthSqr() <= 0.0001) {
            return;
        }
        Role.aimVector.normalize();
        Quat.fromViewUp(Role.aimQuat, Role.aimVector, Vec3.UP);
        bullet.node.setWorldRotation(Role.aimQuat);
    }


}

