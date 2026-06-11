// import { _decorator, Vec3, v3, Collider2D, Component, RigidBody2D, ERigidBody2DType, IPhysics2DContact, Node, Contact2DType, Vec2 } from 'cc';
// import { CharacterBase } from '../Battle/CharacterBase';
// import { DamageSource } from '../Common/GameInfo';
// import { CharacterTag } from '../Common/CommonEnum';

// const { ccclass, property } = _decorator;

// @ccclass('SlashEffect2D')
// export class SlashEffect2D extends Component {
//     private damage: number = 100;
//     private destroyOnHit: boolean = true;
//     private _collider: Collider2D = null!;
//     private _rigidBody: RigidBody2D = null!;
//     private hasHit: boolean = false;
//     private _isActive: boolean = false;
//     private damageSource?: DamageSource;
//     private hitCount: number = 0;
//     /**动画节点原始放缩值 */
//     public initialNodeScale: Vec3 = new Vec3();
//     onLoad() {
//         this._collider = this.getComponent(Collider2D);
//         if (!this._collider) {
//             this._collider = this.addComponent(Collider2D);
//         }

//         // 获取或添加刚体组件
//         this._rigidBody = this.getComponent(RigidBody2D);
//         if (!this._rigidBody) {
//             this._rigidBody = this.addComponent(RigidBody2D);
//             this._rigidBody.bullet = true;
//             this._rigidBody.type = ERigidBody2DType.Dynamic;
//             this._rigidBody.fixedRotation = false; // 允许旋转
//             this._rigidBody.gravityScale = 0; // 不受重力影响
//         }
//         // 监听碰撞事件
//         this._collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
//         const initialScale = this.node.getScale();
//         Vec3.copy(this.initialNodeScale, initialScale);
//     }

//     /**
//      * 初始化近战数据 临时使用只能造成一次伤害, 而不是范围伤害
//      * @param damage 伤害值
//      * @param direction 方向
//      * @param damageSource 伤害来源
//      * @param loop 是否循环
//      * @returns 
//      */
//     initData(damage: number, direction: Vec3, damageSource?: DamageSource, loop: boolean = false) {
//         if (!this._rigidBody) return this;
//         if (this._collider) {
//             this._collider.enabled = true;
//         }
//         this.scheduleOnce(() => {
//             if (this._collider) {
//                 this._collider.enabled = false;
//             }
//         }, 0.0);
//         this.hasHit = false;
//         this.hitCount = 0;
//         this._isActive = true;
//         this.damage = damage;
//         this.damageSource = damageSource;
//         if (direction.x !== 0) {
//             const currentScale = v3();
//             const targetScaleX = direction.x > 0 ? -1 : 1;
//             Vec3.set(currentScale, this.initialNodeScale.x * targetScaleX, this.initialNodeScale.y, this.initialNodeScale.z);
//             this.node.setScale(currentScale);
//         }
//         this._rigidBody.linearVelocity = Vec2.ZERO.clone();
//         return this;
//     }

//     update(dt: number) {
//         if (!this._isActive) return;
//     }

//     // 设置箭是否在击中后销毁
//     public setDestroyOnHit(destroy: boolean) {
//         this.destroyOnHit = destroy;
//         return this;
//     }

//     // 碰撞回调
//     private onCollisionEnter(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
//         if (this.hasHit) {
//             this.hitCount++;
//         }
//         //最多同时攻击5个敌人
//         if (this.hitCount > 10 || !this._isActive) return;
//         let enemyNode: Node | null = otherCollider.node;
//         for (let i = 0; i < 2; i++) {
//             // 检查是否有 CharacterBase 组件
//             if (enemyNode.getComponent(CharacterBase)) {
//                 break;
//             }
//             if (!enemyNode.parent) break;
//             enemyNode = enemyNode.parent;
//         }
//         if (enemyNode) {
//             this.hasHit = true;
//             const enemy = enemyNode.getComponent(CharacterBase);
//             if (enemy) {
//                 if (enemy.CharacterTag === CharacterTag.Monster) {
//                     if (enemy.onHurt(this.damage, this.damageSource)) {
//                         enemy.knockback(this.node.worldPosition, 2000);
//                     }
//                 } else if (enemy.CharacterTag === CharacterTag.Zombie) {
//                     if (enemy.onHurt(this.damage, this.damageSource)) {
//                         enemy.knockback(this.node.worldPosition, 50);
//                     }
//                 }
//             }
//         }
//     }

//     /**特效回收 */
//     recover() {
//         if (!this._isActive) return;
//         this._isActive = false;
//         this.scheduleOnce(() => {
//             app.res.recoverByPool(this.node);
//             this.node.setPosition(Vec3.ZERO);
//         }, 0.0);
//     }
// } 