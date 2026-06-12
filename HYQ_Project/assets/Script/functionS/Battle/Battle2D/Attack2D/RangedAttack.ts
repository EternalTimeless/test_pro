import { _decorator, CCFloat, CCInteger, Component, Node, Vec3 } from 'cc';
import { BulletEnum, LayerEnum } from 'db://assets/Script/Base/EnumList';
import LayerManager from 'db://assets/Script/Base/LayerManager';
import { vectorPower } from 'db://assets/Script/Tool/Index';
import { AttackTargetBase } from '../../Base/AttackTargetBase';
import BulletManager from '../../BulletManager';

const { ccclass, property } = _decorator;

/**远程攻击 */
@ccclass('RangedAttack')
export class RangedAttack extends AttackTargetBase {
    @property(CCFloat)
    public bulletAngle: number = 15;
    @property(CCFloat)
    public shootCount: number = 3;

    @property(Node)
    public bulletShootPos: Node;

    @property({ type: BulletEnum })
    public bulletEnum: BulletEnum = BulletEnum.arrow;

    protected attackEvent(power: number, reoel: number): void {
        if (this.target) {
            let targetVector = vectorPower(this.bulletShootPos, this.target.node);
            let r = Math.atan2(targetVector.y, targetVector.x);
            let angle = r / Math.PI * 180;
            let off = 0;
            if (this.shootCount > 1) {
                off = this.bulletAngle / (this.shootCount - 1);
                angle -= this.bulletAngle / 2;
            }
            let Layer = LayerManager.instance.getLayer(LayerEnum.Layer_2_sky);
            for (let i = 0; i < this.shootCount; i++) {
                let bullet = BulletManager.instance.shootBullet(this.bulletEnum, angle, power, reoel);
                angle += off;
                Layer.addChild(bullet.node);
                bullet.node.setWorldPosition(this.bulletShootPos.worldPosition);
            }

        }
    }

    public get attackPos() {
        return this.bulletShootPos.worldPosition;
    }

}


