import { _decorator, Animation, CCFloat, Component, math, Node, Quat, v3, Vec3 } from 'cc';
import { BulletEnum, LayerEnum } from 'db://assets/Script/Base/EnumList';
import LayerManager from 'db://assets/Script/Base/LayerManager';
import { AttackTargetBase } from '../../Base/AttackTargetBase';
import BulletManager from '../../BulletManager';
import { AttackParkPlay } from '../AttackParkPlay';
const { ccclass, property } = _decorator;

@ccclass('RangeTowerAttack')
export class RangeTowerAttack extends AttackTargetBase {

    @property(AttackParkPlay)
    public attackParkPlay: AttackParkPlay[] = [];
    @property(Node)
    public bulletShootPos: Node[] = [];
    @property(Animation)
    public attackAnimation: Animation[] = [];


    private _index: number = 0;

    @property({ type: BulletEnum })
    public bulletEnum: BulletEnum = BulletEnum.arrow;

    @property(Node)
    public gunNode: Node;


    protected attackEvent(power: number, reoel: number): void {
        if (this.target) {


            let bulletShootPos = this.bulletShootPos[this._index];
            let attackParkPlay = this.attackParkPlay[this._index];
            let attackAnimation = this.attackAnimation[this._index];
            this.attackParkPlay && attackParkPlay.play();
            attackAnimation.play();
            let Layer = LayerManager.instance.getLayer(LayerEnum.Layer_2_sky);
            // for (let i = 0; i < this.shootCount; i++) {
            let bullet = BulletManager.instance.shootBullet3D(this.bulletEnum, this.gunNode.worldRotation, power, reoel);
            Layer.addChild(bullet.node);
            bullet.node.setWorldPosition(bulletShootPos.worldPosition);
            // }
            this._index++;
            if (this._index >= this.bulletShootPos.length) {
                this._index = 0;
            }
        }
    }



}


