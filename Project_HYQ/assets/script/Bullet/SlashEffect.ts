import { _decorator, Vec3, ITriggerEvent, v3, Quat, quat, Collider, RigidBody, SphereCollider, BoxCollider, Component } from 'cc';
import { BulletBase } from './BulletBase';
import { ColliderTag } from '../Other/ColliderTag';
import { CharacterTag, ColliderGroupTag } from '../Common/CommonEnum';
import { CharacterBase } from '../Battle/CharacterBase';
import { DamageSource, GameInfo } from '../Common/GameInfo';
import { CameraCtrl } from '../CharacterCtrl/CameraCtrl';

const { ccclass, property } = _decorator;

@ccclass('SlashEffect')
export class SlashEffect extends Component {
    protected _BoxCollider: BoxCollider;
    protected _SphereCollider: SphereCollider;
    protected _rigidBody: RigidBody;
    private damage: number = 100;
    private destroyOnHit: boolean = true;
    private hasHit: boolean = false;
    private readonly _quat = quat();
    private _isActive: boolean = false;
    private damageSource?: DamageSource;
    private hitCount: number = 0;
    /** initData 传入的方向，用于击退与目标重合时的方向回退 */
    private _slashInitDir: Vec3 = new Vec3();
    onLoad() {
        this._rigidBody = this.node.getComponent(RigidBody);
        this._BoxCollider = this.node.getComponent(BoxCollider);
        this._SphereCollider = this.node.getComponent(SphereCollider);
        if(this._BoxCollider){
            this._BoxCollider.on(`onTriggerEnter`, this.onTriggerEnter, this);
            this._BoxCollider.on(`onTriggerStay`, this.onTriggerStay, this);
            this._BoxCollider.on(`onTriggerExit`, this.onTriggerExit, this);
        }
        if(this._SphereCollider){
            this._SphereCollider.on(`onTriggerEnter`, this.onTriggerEnter, this);
            this._SphereCollider.on(`onTriggerStay`, this.onTriggerStay, this);
            this._SphereCollider.on(`onTriggerExit`, this.onTriggerExit, this);
        }
    }

    /**
     * 初始化近战数据 临时使用只能造成一次伤害, 而不是范围伤害
     * @param damage 伤害值
     * @param direction 方向
     * @param damageSource 伤害来源
     * @param loop 是否循环
     * @returns 
     */
    initData(damage: number, direction: Vec3, damageSource?: DamageSource, loop: boolean = false) {
        if (!this._rigidBody) return this;
        this.hasHit = false;
        this.hitCount = 0;
        this._isActive = true;
        this.damage = damage;
        this.damageSource = damageSource;
        //初始方向 (0, 0, 1) 到目标方向的旋转
        Quat.rotationTo(this._quat, v3(0, 0, 1), direction);
        this.node.setRotation(this._quat);
        if (this._BoxCollider) {
            this._BoxCollider.enabled = true
            this.scheduleOnce(() => {
                this._BoxCollider.enabled = false;
            }, 0);
        }
        if (this._SphereCollider) {
            this._SphereCollider.enabled = true
            this.scheduleOnce(() => {
                this._SphereCollider.enabled = false;
            }, 0);
        }
        return this;
    }

    update(dt: number) {
        if (!this._isActive) return;
    }

    // 设置箭是否在击中后销毁
    public setDestroyOnHit(destroy: boolean) {
        this.destroyOnHit = destroy;
        return this;
    }

    // 碰撞回调
    protected onTriggerEnter(event: ITriggerEvent) {
        //最多同时攻击5个敌人
        if (this.hitCount > 10 || !this._isActive) return;

        const _t = event.otherCollider.node.getComponent(ColliderTag);
        if (_t) {
            if (!this.hasHit) {
                this.hasHit = true;
            }
            this.hitCount++;
            // if (_t.tag === ColliderGroupTag.Monster || _t.tag === ColliderGroupTag.Elite) 
            if (_t.tag === ColliderGroupTag.Player || _t.tag === ColliderGroupTag.Door) {
                const co = event.otherCollider.node.getComponent(CharacterBase);
                // if (!this.damageSource?.extra && co?.CharacterTag == CharacterTag.Player) {
                //     return;
                // }
                if (co) {
                    if (co.onHurt(this.damage, this.damageSource)) {
                        // co.knockback(this.node.worldPosition, 20, this._slashInitDir);

                    }
                }
            }
        }
    }
    protected onTriggerStay(event: ITriggerEvent) {

    }
    protected onTriggerExit(event: ITriggerEvent) {

    }
    // /**特效回收 */
    // recover() {
    //     if (!this._isActive) return;
    //     this._isActive = false;

    //     this.scheduleOnce(() => {
    //         app.res.recoverByPool(this.node);
    //         this.node.setPosition(Vec3.ZERO);
    //     });
    // }
} 