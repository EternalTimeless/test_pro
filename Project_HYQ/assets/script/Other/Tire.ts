import { _decorator, CCFloat, Label, MeshRenderer, Vec3, Node } from 'cc';
import { CharacterBase } from '../Battle/CharacterBase';
import { DamageSource, GameInfo } from '../Common/GameInfo';
import { ColliderTag } from './ColliderTag';

const { ccclass, property } = _decorator;


@ccclass('Tire')
export class Tire extends CharacterBase {

    @property({ type: Label, tooltip: '血量标签' })

    lab_hp: Label = null!;

    @property({ tooltip: '旋转速度X轴' })

    rotateSpeed: number = 30;

    @property({ type: CCFloat, displayName: '牌脱离延迟(秒)' })

    brandDetachDelay: number = 0.8;
    @property({ type: Node, displayName: '牌根节点', tooltip: '牌根节点' })
    brandQueueRoot: Node = null;

    private currentRotation: Vec3 = new Vec3();

    private _deathHandled: boolean = false;

    private _collisionRegistered: boolean = false;



    onLoad() {
        super.onLoad();
        if (this.ModelNode) {

            this.currentRotation.set(this.ModelNode.eulerAngles);

        }

    }



    protected onEnable(): void {

        super.initData();

        this._deathHandled = false;
        this._collisionRegistered = false;


        this.ModelNode.setRotationFromEuler(this.currentRotation);

        this.lab_hp.string = this.battleValComp.currentHealth.toString();

        this.lab_hp.node.active = true;

    }

    protected onDisable(): void {
        this.unregisterCollisionTarget();
    }

    /** 注册为子弹可检测目标（需 ColliderTag.Monster） */
    public registerCollisionTarget(): void {
        if (this._collisionRegistered || !this.node.getComponent(ColliderTag)) {
            return;
        }
        GameInfo.instance.simulationCollisionMgr?.registerTarget(this);
        this._collisionRegistered = true;
    }

    /** 从子弹碰撞检测中移除 */
    public unregisterCollisionTarget(): void {
        if (!this._collisionRegistered) {
            return;
        }
        GameInfo.instance.simulationCollisionMgr?.unregisterTarget(this);
        this._collisionRegistered = false;
    }



    update(dt: number) {

        if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin || this.isDead) return;

        if (this.ModelNode) {
            //TODO: 静止时速度减慢 0.5倍
            const deltaX = this.rotateSpeed * dt;

            const eulerAngles = this.ModelNode.eulerAngles.clone();

            eulerAngles.add3f(deltaX, 0, 0);

            eulerAngles.x = this.normalizeEulerX(eulerAngles.x);

            this.ModelNode.setRotationFromEuler(eulerAngles);

        }

    }
    private normalizeEulerX(x: number): number {

        const m = ((x % 360) + 360) % 360;

        return m === 0 ? 0 : m - 360;

    }


    /** 轮胎不由基类溶解回收，由 CollectionManager 统一回收 */

    protected getDissolveMeshRenderer(): MeshRenderer | null {

        return null;

    }



    protected onDeadEnter() {

        this.unregisterCollisionTarget();
        this.stopActiveMovement();

        this.animComp?.playDead(1, false);

        this.notifyConveyorAfterDeath();

    }



    private notifyConveyorAfterDeath() {

        if (this._deathHandled) {
            return;
        }

        this._deathHandled = true;

        this.scheduleOnce(() => {

            GameInfo.instance.collectionMgr?.onTireDie(this);

        }, this.brandDetachDelay);

    }





    getPotentialTargets(): CharacterBase[] {

        return [];

    }



    castSkillEffect() {

    }



    onHurt(damage: number, damageSource?: DamageSource): boolean {

        if (!GameInfo.instance.collectionMgr?.canTireBeAttacked(this)) {

            return false;

        }

        const v = super.onHurt(damage, damageSource);

        if (v) {

            this.lab_hp.string = this.battleValComp.currentHealth.toString();

        }

        return v;

    }



    get collisionHalfX(): number {

        return 1.5;

    }



    get collisionHalfZ(): number {

        return 1;

    }

}


