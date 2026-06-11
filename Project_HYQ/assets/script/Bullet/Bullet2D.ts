// import { _decorator, Component, Node, Collider2D, Contact2DType, IPhysics2DContact, Vec3, RigidBody2D, ERigidBody2DType, Vec2 } from 'cc';
// import { CharacterBase } from '../Battle/CharacterBase';
// import { DamageSource } from '../Common/GameInfo';
// import { CharacterTag } from '../Common/CommonEnum';

// const { ccclass, property } = _decorator;

// @ccclass('Bullet2D')
// export class Bullet2D extends Component {
//     private damage: number = 100;
//     private destroyOnHit: boolean = true;
//     private hasHit: boolean = false;
//     private collider: Collider2D = null!;
//     private rigidBody: RigidBody2D = null!;
//     private startPosition: Vec3 = new Vec3();
//     private maxDistance: number = 30; // 默认最大飞行距离
//     private readonly tempVec3: Vec3 = new Vec3();
//     private flyTime: number = 0;
//     /**最大回收时间 */
//     private flyMaxTime: number = 3;
//     private damageSource?: DamageSource;
//     private _isActive: boolean = false;
//     onLoad() {
//         // 获取碰撞器组件
//         this.collider = this.getComponent(Collider2D);
//         if (!this.collider) {
//             this.collider = this.addComponent(Collider2D);
//         }

//         // 获取或添加刚体组件
//         this.rigidBody = this.getComponent(RigidBody2D);
//         if (!this.rigidBody) {
//             this.rigidBody = this.addComponent(RigidBody2D);
//             this.rigidBody.bullet = true;
//             this.rigidBody.type = ERigidBody2DType.Dynamic;
//             this.rigidBody.fixedRotation = false; // 允许旋转
//             this.rigidBody.gravityScale = 0; // 不受重力影响
//         }
//         // 监听碰撞事件
//         this.collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);

//     }
//     /**
//      * 
//      * @param damage 子弹的伤害值
//      * @param direction 方向
//      * @param speed 子弹的线速度
//      * @param fromTag 子弹的来源标签
//      * @param maxTime 箭的最大飞行时间
//      * @param maxDistance 箭的最大飞行距离
//      * @param damageSource 伤害来源
//      * @returns 
//      */
//     initData(damage: number, direction: Vec3, speed: number, maxTime: number = 3, maxDistance: number = 600, damageSource?: DamageSource) {
//         if (!this.rigidBody) return this;

//         // this.collider.enabled = true;
//         // this.rigidBody.enabled = true;
//         this._isActive = true;
//         this.hasHit = false;
//         this.flyTime = 0;
//         this.damageSource = damageSource;
//         this.damage = damage;
//         this.flyMaxTime = maxTime;
//         this.maxDistance = maxDistance;
//         // 创建二维速度向量
//         const velocity = new Vec2(direction.x * speed, direction.y * speed);
//         this.rigidBody.linearVelocity = velocity;

//         // 计算箭头的朝向角度（根据速度方向）
//         const angle = Math.atan2(direction.y, direction.x);
//         this.node.angle = angle * (180 / Math.PI);
//         // 记录起始位置
//         this.startPosition = this.node.worldPosition.clone();
//         return this;
//     }
//     update(dt: number) {
//         if (!this._isActive) return;
//         //定时回收
//         this.flyTime += dt;
//         if (this.flyTime > this.flyMaxTime && !this.hasHit) {
//             this.recover();
//             return;
//         }
//         // 检查是否超过最大距离
//         Vec3.subtract(this.tempVec3, this.node.worldPosition, this.startPosition);

//         const currentDistance = this.tempVec3.x * this.tempVec3.x + this.tempVec3.y * this.tempVec3.y
//         if (currentDistance > (this.maxDistance * this.maxDistance) && !this.hasHit) {
//             this.recover();
//         }
//     }

//     // 设置是否在击中后销毁
//     public setDestroyOnHit(destroy: boolean) {
//         this.destroyOnHit = destroy;
//         return this;
//     }


//     // 碰撞回调
//     private onCollisionEnter(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
//         // 防止重复触发
//         if (this.hasHit) return;
//         // 最多向上查找1层
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
//                 this.hasHit = true;
//                 this.recover();
//             }
//         }
//     }
//     /**子弹回收 */
//     recover() {
//         if (!this._isActive) return;
//         this._isActive = false;
//         this.rigidBody.linearVelocity = Vec2.ZERO.clone();
//         this.scheduleOnce(() => {
//             app.res.recoverByPool(this.node);
//             // this.collider.enabled = false;
//             // this.rigidBody.enabled = false;
//         }, 0.0)
//     }
//     onDestroy() {
//         this._isActive = false;
//         super.onDestroy();
//     }
// } 