import { _decorator, ccenum, CCInteger, CircleCollider2D, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, RigidBody, RigidBody2D } from 'cc';
import { CollectGetTarget } from '../CollectBattleTarger/CollectGetTarget';
import { COLLIDE_TYPE } from '../CollectBattleTarger/ColliderTag';
const { ccclass, property } = _decorator;

@ccclass('TriggerBase2D')
export abstract class TriggerBase2D extends CollectGetTarget {

    @property({ type: COLLIDE_TYPE })
    public attackTargetTag: COLLIDE_TYPE[] = [];

    protected attackCollide: CircleCollider2D;

    protected rig: RigidBody2D;

    onLoad() {
        this.attackCollide = this.getComponent(CircleCollider2D);
        this.attackCollide.on(Contact2DType.BEGIN_CONTACT, this.onStartCollide, this);
        this.attackCollide.on(Contact2DType.END_CONTACT, this.onEndCollide, this);

        this.rig = this.node.getComponent(RigidBody2D);
    }


    private onStartCollide(selfCollide: Collider2D, other: Collider2D, contcat: IPhysics2DContact) {
        if (this.attackTargetTag.indexOf(other.tag) != -1) {
            this._startCollide(other);
        }
    }

    protected abstract _startCollide(other: Collider2D)


    private onEndCollide(selfCollide: Collider2D, other: Collider2D, contcat: IPhysics2DContact) {
        if (this.attackTargetTag.indexOf(other.tag) != -1) {
            this._EndCollide(other);
        }
    }

    protected abstract _EndCollide(other: Collider2D)

}


