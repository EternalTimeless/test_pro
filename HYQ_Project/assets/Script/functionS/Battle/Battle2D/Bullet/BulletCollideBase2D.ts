import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, RigidBody2D, sp } from 'cc';
import { COLLIDE_TYPE } from '../../CollectBattleTarger/ColliderTag';
const { ccclass, property } = _decorator;

@ccclass('BulletCollideBase2D')
export abstract class BulletCollideBase2D extends Component {


    @property({ type: COLLIDE_TYPE })
    public attackTargetTag: COLLIDE_TYPE[] = [];

    public attackCollide: Collider2D;
    public rig: RigidBody2D;
    onLoad() {
        this.attackCollide = this.getComponent(Collider2D);
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


