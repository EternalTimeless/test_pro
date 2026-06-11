// import { _decorator, Animation, CircleCollider2D, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, RigidBody2D, v3, Vec2, Vec3 } from 'cc';
// import { AttackType, DamageSource, GameInfo, ISkillBase, SkillConfig, SkillInitParams } from '../Common/GameInfo';
// import { CharacterTag } from '../Common/CommonEnum';
// import { AnimationCtrl } from '../Other/AnimationCtrl';
// import { EnemyCharacter } from '../Battle/EnemyChar';
// const { ccclass, property } = _decorator;

// @ccclass('SkillBase2D')
// export class SkillBase extends Component implements ISkillBase {
//     public direction: Vec3 = new Vec3(0, 0, 0);
//     // 动态注入的配置参数
//     public config: SkillConfig = null!;
//     /**技能持续时间计时, 配置 */
//     private timer: number = 0;
//     /**技能销毁时间, 动态传入 */
//     private destroyTimer: number = 0;
//     private collider: Collider2D = null!;
//     private rigidBody: RigidBody2D = null!;
//     private aniCtrl: AnimationCtrl = null!;
//     private isEnd: boolean = false;
//     // private damageTimer: number = 0
//     // private monsters: Monster[] = [];
//     public damageSource: DamageSource = null!;
//     protected onLoad() {
//         this.collider = this.getComponent(Collider2D);
//         this.rigidBody = this.getComponent(RigidBody2D);
//         this.collider.on(Contact2DType.BEGIN_CONTACT, this.onTriggerEnter, this);
//         this.collider.on(Contact2DType.END_CONTACT, this.onTriggerExit, this);
//         this.rigidBody.enabledContactListener = true;
//         // this.collider.radius = this.config.hitRadius;
//         this.aniCtrl = this.getComponent(AnimationCtrl) || this.addComponent(AnimationCtrl);
//     }

//     /**
//      * 初始化技能（统一接口）
//      * @param params 技能初始化参数
//      */
//     initialize(params: SkillInitParams): void {
//         // 1. 设置伤害来源
//         this.damageSource = {
//             fromCharacterTag: params.from.fromCharacterTag,
//             attackType: AttackType.Skill,
//             node: params.from.node,
//             uuid: params.from.uuid,
//             skillName: this.config.name,
//             level: params.from.level
//         };

//         // 2. 播放动画（不设置位置和父节点，由调用方管理）
//         const loop = this.config.duration != 0;
//         this.aniCtrl.play({
//             loop: loop,
//             enableFrameHold: true,
//             onComplete: () => {
//                 if (!params.destroyTime)
//                     this.destroySkill();
//             }
//         });

//         // 3. 设置销毁时间
//         if (params.destroyTime) {
//             this.destroyTimer = params.destroyTime;
//         }

//         // 4. 处理移动逻辑
//         if (params.direction && (params.direction.x != 0 || params.direction.y != 0)) {
//             this.direction = params.direction;
//             this.move();
//             this.timer = 0;
//         }

//         this.isEnd = false;
//     }

//     update(dt: number) {
//         if (this.isEnd) return;
//         if (this.config.duration > 0) {
//             this.timer += dt;
//             //发射的持续技能
//             if (this.timer >= this.config.duration) {
//                 this.destroySkill();
//             }
//         }
//         if (this.destroyTimer > 0) {
//             this.destroyTimer -= dt;
//             if (this.destroyTimer <= 0) {
//                 this.destroySkill();
//             }
//         }
//     }
//     onTriggerEnter(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
//         // console.log("技能TriggerEnter", otherCollider.tag, otherCollider.name);

//         // 最多向上查找1层
//         let enemyNode: Node | null = otherCollider.node;
//         for (let i = 0; i < 2; i++) {
//             // 检查是否有 CharacterBase 组件
//             if (enemyNode.getComponent(EnemyCharacter)) {
//                 break;
//             }
//             if (!enemyNode.parent) break;
//             enemyNode = enemyNode.parent;
//         }
//         if (enemyNode) {
//             const enemy = enemyNode.getComponent(EnemyCharacter);
//             if (enemy) {
//                 enemy.onHurt(this.config.baseDamage, this.damageSource);
//             }
//         }
//     }

//     onTriggerExit(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
//         // console.log("TriggerExit", otherCollider.name);
//     }
//     move() {
//         const velocity = new Vec2(this.direction.x * this.config.moveSpeed, this.direction.y * this.config.moveSpeed);
//         this.rigidBody.linearVelocity = velocity;
//     }
//     destroySkill() {
//         this.rigidBody.linearVelocity = Vec2.ZERO.clone();
//         this.isEnd = true;
//         this.timer = 0;
//         app.res.recoverByPool(this.node);
//     }
// }


