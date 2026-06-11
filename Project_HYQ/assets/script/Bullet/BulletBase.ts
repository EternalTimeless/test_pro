import { _decorator, Collider, Component, ICollisionEvent, ITriggerEvent, RigidBody } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BulletBase')
export class BulletBase extends Component {
    protected _collider: Collider;
    protected _rigidBody: RigidBody;
    onLoad() {
        this._collider = this.node.getComponent(Collider);
        this._rigidBody = this.node.getComponent(RigidBody);
        this._collider.on(`onTriggerEnter`, this.onTriggerEnter, this);
        this._collider.on(`onTriggerStay`, this.onTriggerStay, this);
        this._collider.on(`onTriggerExit`, this.onTriggerExit, this);

        this._collider.on(`onCollisionEnter`, this.onCollisionEnter, this);
        this._collider.on(`onCollisionStay`, this.onCollisionStay, this);
        this._collider.on(`onCollisionExit`, this.onCollisionExit, this);
    }
    protected onTriggerEnter(event: ITriggerEvent) {

    }
    protected onTriggerStay(event: ITriggerEvent) {

    }
    protected onTriggerExit(event: ITriggerEvent) {

    }
    protected onCollisionEnter(event: ICollisionEvent) {

    }
    protected onCollisionStay(event: ICollisionEvent) {

    }
    protected onCollisionExit(event: ICollisionEvent) {

    }
}


