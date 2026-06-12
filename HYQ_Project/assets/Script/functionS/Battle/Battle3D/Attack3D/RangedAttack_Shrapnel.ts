import { _decorator, CCFloat, CCInteger, Component, math, Node, Quat, v3, Vec3 } from 'cc';
import { BulletEnum, LayerEnum } from 'db://assets/Script/Base/EnumList';
import LayerManager from 'db://assets/Script/Base/LayerManager';
import { vectorPower2 } from 'db://assets/Script/Tool/Index';
import { AttackParkPlay } from '../AttackParkPlay';
import { AttackTargetBase } from '../../Base/AttackTargetBase';
import BulletManager from '../../BulletManager';
const { ccclass, property } = _decorator;

/**远程攻击 */
@ccclass('RangedAttack_Shrapnel')
export class RangedAttack_Shrapnel extends AttackTargetBase {

    @property(AttackParkPlay)
    public attackParkPlay: AttackParkPlay;

    @property(CCFloat)
    public bulletAngle: number = 15;
    @property(CCFloat)
    public shootCount: number = 3;

    @property(Node)
    public bulletShootPos: Node;

    @property({ type: BulletEnum })
    public bulletEnum: BulletEnum = BulletEnum.arrow;

    private tempQ: math.Quat = new math.Quat();
    private tempQ2: math.Quat = new math.Quat();

    protected attackEvent(power: number, reoel: number): void {
        if (this.target) {
            const target = this.target;
            const tPos = target.node.worldPosition;
            let targetVector = vectorPower2(this.bulletShootPos.worldPosition, tPos);
            if (this.attackParkPlay) {
                this.attackParkPlay.play();
                this.attackParkPlay.node.parent.lookAt(target.node.worldPosition);
            }
            Quat.fromViewUp(this.tempQ, targetVector, Vec3.UP);
            let Layer = LayerManager.instance.getLayer(LayerEnum.Layer_2_sky);
            for (let i = 0; i < this.shootCount; i++) {
                const randomAngle = math.randomRange(-this.bulletAngle, this.bulletAngle);
                Quat.fromAxisAngle(this.tempQ2, Vec3.UP, math.toRadian(randomAngle));
                Quat.multiply(this.tempQ2, this.tempQ, this.tempQ2);
                let bullet = BulletManager.instance.shootBullet3D(this.bulletEnum, this.tempQ2, power, reoel);
                Layer.addChild(bullet.node);
                bullet.node.setWorldPosition(this.bulletShootPos.worldPosition);
            }

        }
    }

    public get attackPos() {
        return this.bulletShootPos.worldPosition;
    }

}


