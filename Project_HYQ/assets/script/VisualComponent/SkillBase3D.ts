import { _decorator, Animation, AnimationClip, Collider, Component, ICollisionEvent, ITriggerEvent, RigidBody, RigidBody2D, v3, Vec2, Vec3 } from 'cc';
import { AttackType, DamageSource, GameInfo, ISkillBase, SkillConfig, SkillInitParams } from '../Common/GameInfo';
import { EnemyCharacter } from '../Battle/EnemyChar';
const { ccclass, property } = _decorator;

@ccclass('SkillBase3D')
export class SkillBase extends Component implements ISkillBase {
    public direction: Vec3 = new Vec3(0, 0, 0);
    // 动态注入的配置参数
    public config: SkillConfig = null!;
    /**技能持续时间计时, 配置 */
    private timer: number = 0;
    /**技能销毁时间, 动态传入 */
    private destroyTimer: number = 0;
    private _collider: Collider = null!;
    private _rigidBody: RigidBody = null!;
    private ani: Animation = null!;
    private isEnd: boolean = false;
    public damageSource: DamageSource = null!;
    protected onLoad() {
        this.ani = this.getComponent(Animation) || this.addComponent(Animation);
        this._collider = this.getComponent(Collider);
        this._rigidBody = this.getComponent(RigidBody);
        if (this._collider) {
            this._collider.on(`onTriggerEnter`, this.onTriggerEnter, this);
            this._collider.on(`onTriggerStay`, this.onTriggerStay, this);
            this._collider.on(`onTriggerExit`, this.onTriggerExit, this);
            this._collider.on(`onCollisionEnter`, this.onCollisionEnter, this);
            this._collider.on(`onCollisionStay`, this.onCollisionStay, this);
            this._collider.on(`onCollisionExit`, this.onCollisionExit, this);
        }
        // this._collider.radius = this.config.hitRadius;
    }

    /**
     * 初始化技能（统一接口）
     * @param params 技能初始化参数
     */
    initialize(params: SkillInitParams): void {
        // 1. 设置伤害来源
        this.damageSource = {
            fromCharacterTag: params.from.fromCharacterTag,
            attackType: AttackType.Skill,
            node: params.from.node,
            uuid: params.from.uuid,
            skillName: this.config.name,
            level: params.from.level
        };

        // 2. 激活节点并播放动画
        if (!this.node.active) this.node.active = true;
        const loop = this.config.duration != 0;
        let animStates = this.ani.getState(this.config.name);
        animStates.wrapMode = loop ? AnimationClip.WrapMode.Loop : AnimationClip.WrapMode.Normal;
        animStates.play();
        if (!loop && !params.destroyTime)
            this.ani.once(Animation.EventType.FINISHED, () => {
                this.destroySkill();
            })

        // 3. 设置销毁时间
        if (params.destroyTime) {
            this.destroyTimer = params.destroyTime;
        }

        // 4. 处理移动逻辑
        if (params.direction && (params.direction.x != 0 || params.direction.z != 0)) {
            this.direction = params.direction;
            this.move();
            this.timer = 0;
        }

        this.isEnd = false;
    }

    update(dt: number) {
        if (this.isEnd) return;
        if (this.config.duration > 0) {
            this.timer += dt;
            //发射的持续技能
            if (this.timer >= this.config.duration) {
                this.destroySkill();
            }
        }
        if (this.destroyTimer > 0) {
            this.destroyTimer -= dt;
            if (this.destroyTimer <= 0) {
                this.destroySkill();
            }
        }
    }
    protected onTriggerEnter(event: ITriggerEvent) {
        // console.log("技能TriggerEnter", otherCollider.tag, otherCollider.name);
        // 检查是否碰到敌人
        const enemy = event.otherCollider.getComponent(EnemyCharacter)
        if (enemy) {
            if (enemy.isDead) return;
            enemy.onHurt(this.config.baseDamage, this.damageSource);
        }
    }
    protected onTriggerStay(event: ITriggerEvent) {
    }
    protected onTriggerExit(event: ITriggerEvent) {
        // console.log("TriggerExit", otherCollider.name);
    }
    protected onCollisionEnter(event: ICollisionEvent) {
    }
    protected onCollisionStay(event: ICollisionEvent) {
    }
    protected onCollisionExit(event: ICollisionEvent) {
    }
    move() {
        const velocity = v3(this.direction.x * this.config.moveSpeed, 0, this.direction.z * this.config.moveSpeed);
        this._rigidBody.setLinearVelocity(velocity);
    }
    destroySkill() {
        this._rigidBody.clearVelocity();
        this.ani.stop();
        this.node.active = false;
        this.node.setPosition(Vec3.ZERO);
        this.isEnd = true;
        this.timer = 0;
        this.node.active = false;
        GameInfo.instance.prefabMgr.recoverPrefab(this.node);
    }
}


