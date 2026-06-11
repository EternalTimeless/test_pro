import { _decorator, Component, Vec3, RigidBody, v3, CCFloat, ParticleSystem, Node, Animation, RigidBody2D, v2, Vec2 } from 'cc';
import { ComponentEvent as ComponentEvent } from '../Common/CommonEnum';
import { GameInfo, SceneType } from '../Common/GameInfo';
const { ccclass, property } = _decorator;

@ccclass('MoveCtrl')
export class MoveCtrl extends Component {
    /**是否开启物理引擎 */
    @property({ tooltip: '是否开启物理引擎' })
    isOpenRigidbody: boolean = false;
    @property({ tooltip: '基础移动速度' })
    baseSpeed: number = 1;
    @property({
        type: CCFloat,
        displayName: '到达目标阈值',
        range: [0.01, 5.0],
        tooltip: '认为角色已到达目标点的距离阈值'
    })
    arriveDistance: number = 0.5;
    protected curSpeed: number = 0;
    protected _moveDir: Vec3 = new Vec3();
    protected _rigidBody: RigidBody | null = null;
    protected _rigidBody2D: RigidBody2D | null = null;
    // 目标点相关属性
    protected _targetWorldPosition: Vec3 | null = null;
    protected _isMovingToTarget: boolean = false;
    /** 记录本次“移动到目标点”的基础速度，避免每帧叠乘导致速度指数衰减 */
    protected _targetMoveBaseSpeed: number = 0;
    private curPosition: Vec3 = new Vec3();
    /**临时向量, 移动和击退不能同时存在, 所以公用一个变量 */
    protected _tempVec3: Vec3 = new Vec3();
    /** 是否处于击退状态 */
    protected isKnockingBack: boolean = false;
    /** 击退方向 */
    protected knockbackDirection: Vec3 = new Vec3();
    /** 击退移动方向（用于线速度，不影响角色朝向） */
    private _knockbackMoveDir: Vec3 = new Vec3();
    /** 击退力度 */
    protected knockbackForce: number = 0;
    /** 击退持续时间 */
    protected knockbackDuration: number = 0.2;
    /** 当前击退计时器 */
    protected knockbackTimer: number = 0;
    /** 击退前的移动状态 */
    protected wasMovingToTarget: boolean = false;
    /** 击退前的目标位置 */
    protected preKnockbackTargetPosition: Vec3 | null = null;
    /** 击退前的移动方向 */
    protected preKnockbackDirection: Vec3 = new Vec3();
    /** 判定「自由移动」方向是否有效的阈值（方向平方长度） */
    private readonly _preKnockbackDirEpsSq: number = 1e-8;
    /** 判定「自由移动」是否有效的速度阈值 */
    private readonly _preKnockbackSpeedEps: number = 1e-4;
    /**太空步 */
    public moonWalkOff: boolean = false;
    /**使用线速度的情况下, 计算帧率影响, 保持速度不变 , 需要在线速度上乘以这个值*/
    public _timeScale: number = 1;
    /**以60帧的更新时间为准 */
    protected targetScale: number = 1 / 60;
    protected targetScaleTimer: number = 0;

    /**获取移动方向 */
    public get direction(): Vec3 {
        return this._moveDir;
    }
    public get isMoving(): boolean {
        return !Vec3.equals(this._moveDir, Vec3.ZERO);
    }
    /**默认组 */
    private defaultGroup: number = 0;
    // ========== 障碍物切线滑动（新增） ==========
    //如果绕圈太大，降低 SLIDE_BLEND_RATIO 到 0.3-0.4
    //如果卡住不动，提高 SLIDE_BLEND_RATIO 到 0.6-0.7
    //如果侧面也被推开，提高 FRONTAL_COLLISION_DOT 到 0.4
    private slideDirection: Vec3 = new Vec3();
    private readonly SLIDE_BLEND_RATIO: number = 0.7; // 滑动混合比例（可调）
    private readonly FRONTAL_COLLISION_DOT: number = 0.3; // 正面碰撞判定阈值
    // ========================================

    onLoad() {
        if (GameInfo.SceneType == SceneType.D2) {
            this._rigidBody2D = this.getComponent(RigidBody2D);
        } else {
            this._rigidBody = this.getComponent(RigidBody);
        }
        // 击退结束同步恢复（见 onKnockbackEndForMovement），避免 scheduleOnce(0) 与连续击退竞态；MoveFlyingCtrl 等仅 emit 的路径也依赖此监听
        this.node.on(ComponentEvent.KnockbackEnd, this.onKnockbackEndForMovement, this);
        // this.arriveDistance = Math.floor(this.baseSpeed * this.targetScale * 100) / 100;

        // ===== 击退碰撞层优化：保存原始碰撞组 =====
        // 原逻辑：只保存3D刚体的碰撞组
        // this.defaultGroup = this._rigidBody.getGroup();

        // 新逻辑：根据场景类型保存对应刚体的碰撞组
        // 注意：RigidBody2D的API与RigidBody不同，2D场景暂不支持碰撞层切换
        if (GameInfo.SceneType == SceneType.D2) {
            // TODO: 2D场景的碰撞组设置需要使用不同的API（如Collider2D.group属性）
            // 当前版本仅支持3D场景
            this.defaultGroup = 0;
        } else {
            if (this._rigidBody) {
                this.defaultGroup = this._rigidBody.getGroup();
            }
        }
        // ===== 击退碰撞层优化结束 =====
    }
    initData() { }
    destroyBefore() { }
    /**
     * 暂停时冻结刚体线速度(Linear Velocity)，避免物理步残留速度导致滑移。
     * 与 stop()/stopActiveMovement() 不同：不清除目标点移动意图(_isMovingToTarget 等)，恢复后路径巡逻可继续。
     */
    private freezeRigidbodyVelocityForPause(): void {
        if (GameInfo.SceneType == SceneType.D2) {
            if (this._rigidBody2D) {
                this._rigidBody2D.linearVelocity = Vec2.ZERO.clone();
            }
        } else if (this._rigidBody) {
            this._rigidBody.setLinearVelocity(Vec3.ZERO);
        }
    }
    update(dt: number) {
        //计算帧率影响, 保持速度不变
        this._timeScale = dt / this.targetScale;
        const useTransformMove = !this._rigidBody && !this._rigidBody2D;
        if (!useTransformMove && !this._rigidBody && !this._rigidBody2D) return;

        // 暂停：不跑移动逻辑，但必须每帧清零刚体速度，否则引擎物理仍可能积分出漂移
        if (GameInfo.instance.Pause) {
            this.freezeRigidbodyVelocityForPause();
            return;
        }
        if (GameInfo.instance.Over || !GameInfo.instance.Begin) return;

        // 更新目标点移动
        this.updateTargetMovement(dt);
        this.updateKnockback(dt);
        this.updateMovePosition(dt);
    }
    public setSpeed(speed: number) {
        this.curSpeed = speed;
    }
    /**设置降落状态, 子类继承后重写此方法 */
    public setFlyType(type: number) { }
    /**
     * 更新通过方向移动移动
     * @param dt 
     */
    protected updateMovePosition(dt: number) {
        // ===== 击退朝向修复：区分击退移动和普通移动 =====
        // 原逻辑：击退时直接修改 _moveDir，导致角色朝向跟着击退方向转动
        // 新逻辑：击退时使用独立的 _knockbackMoveDir，_moveDir 保持不变，不影响朝向

        const isActuallyMoving = this.isMoving || this.isKnockingBack;
        // if (this.node.name === "Zombie")
        //     console.log("isAwake", this._rigidBody2D.isAwake());
        const useTransformMove = !this.isOpenRigidbody;
        if (isActuallyMoving) {
            if (useTransformMove) {
                let speed = this.curSpeed * dt;
                const distance = v3(0, 0, 0);
                if (GameInfo.SceneType == SceneType.D2) {
                    distance.x = this._moveDir.x * speed;
                    distance.y = this._moveDir.y * speed;
                    distance.z = 0;
                } else {
                    distance.x = this._moveDir.x * speed;
                    distance.y = 0;
                    distance.z = this._moveDir.z * speed;
                }
                this.node.getWorldPosition(this.curPosition);
                Vec3.add(this.curPosition, this.curPosition, distance);
                this.node.setWorldPosition(this.curPosition);
                return;
            }

            // ========= 启用物理引擎, 使用线速度实现移动 ==========
            const velocity = v3(0, 0, 0);

            // 根据是否击退，选择不同的移动方向向量和速度
            if (this.isKnockingBack) {
                // ===== 击退状态：直接使用击退移动向量（已包含力度） =====
                // _knockbackMoveDir 已经包含了方向和力度（在updateKnockback中计算）
                // 不需要再乘以额外的速度系数
                if (GameInfo.SceneType == SceneType.D2) {
                    const velocity = v2(
                        this._knockbackMoveDir.x,
                        this._knockbackMoveDir.y
                    );
                    velocity.multiplyScalar(this._timeScale);
                    this._rigidBody2D.linearVelocity = velocity;
                } else {
                    velocity.x = this._knockbackMoveDir.x;
                    velocity.y = 0;
                    velocity.z = this._knockbackMoveDir.z;
                    velocity.multiplyScalar(this._timeScale);
                    this._rigidBody.setLinearVelocity(velocity);
                }
            } else {
                // ===== 普通移动：使用移动方向 * 速度 =====
                let speed = this.curSpeed;
                if (GameInfo.SceneType == SceneType.D2) {
                    const velocity = v2(
                        this._moveDir.x * speed,
                        this._moveDir.y * speed
                    );
                    //NOTE: 帧率频繁变动会导致抖动, 例如FPS:60->56->60, 每次变化需要一定间隔, 不能频繁调用this._timeScale, 防止抖动, 3D抖动非常轻微可以忽略不计, 2D距离数值超过2像素就会较明显
                    velocity.multiplyScalar(this._timeScale);
                    this._rigidBody2D.linearVelocity = velocity;
                } else {
                    velocity.x = this._moveDir.x * speed;
                    velocity.y = 0;
                    velocity.z = this._moveDir.z * speed;
                    velocity.multiplyScalar(this._timeScale);
                    this._rigidBody.setLinearVelocity(velocity);
                }
            }
        } else {
            if (useTransformMove) {
                return;
            }
            // 没有移动时，清零线速度
            if (GameInfo.SceneType == SceneType.D2) {
                this._rigidBody2D.linearVelocity = Vec2.ZERO.clone();
            } else {
                this._rigidBody.setLinearVelocity(Vec3.ZERO);
            }
            // ==============================
        }
    }
    /**
     * 更新击退效果
     * @param dt 帧间隔时间
     */
    protected updateKnockback(dt: number) {
        return; // 本项目无击退
        if (!this.isKnockingBack) return;

        this.knockbackTimer += dt;
        if (this.knockbackTimer >= this.knockbackDuration) {

            // ===== 击退碰撞层优化：击退结束时恢复原始碰撞层 =====
            this.restoreOriginalGroup();
            // ===== 击退碰撞层优化结束 =====

            // ===== 击退朝向修复：清空击退移动向量 =====
            Vec3.set(this._knockbackMoveDir, 0, 0, 0);
            this.isKnockingBack = false;
            // emit 会同步触发 onKnockbackEndForMovement，立即恢复移动，避免原 scheduleOnce(0) 与下一次击退竞态
            this.node.emit(ComponentEvent.KnockbackEnd);
            //NOTE: COCOS2d带击退的怪物在休眠时被同一个触发器多次触发后会失效, 需要唤醒, 或者不勾选允许休眠;
            // ===== 击退朝向修复结束 =====
        } else {
            // 使用二次方曲线模拟物理减速效果，比线性减速更自然
            const progress = this.knockbackTimer / this.knockbackDuration;
            // 使用 (1 - progress)² 实现非线性的减速效果
            const currentForce = this.knockbackForce * (1 - progress) * (1 - progress);

            // ===== 击退朝向修复：更新击退专用移动向量，不修改 _moveDir =====
            // 原逻辑：Vec3.multiplyScalar(this._moveDir, this.knockbackDirection, currentForce);
            // 新逻辑：使用独立的击退移动向量，不影响角色朝向
            Vec3.multiplyScalar(this._knockbackMoveDir, this.knockbackDirection, currentForce);
            // ===== 击退朝向修复结束 =====
        }
    }
    /**
     * 按方向移动
     * @param direction 方向
     * @param speed 速度
     */
    public move(direction: Vec3, speed?: number) {
        // 击退中禁止覆盖 _moveDir，避免追踪/流场在间隔内写入，下一次击退错误保存「伪方向」
        if (this.isKnockingBack) return;
        // 更新移动方向
        Vec3.copy(this._moveDir, direction);
        this.curSpeed = speed ?? this.baseSpeed;
        this.node.emit(ComponentEvent.OnMoveChange);
    }
    /** 停止移动 */
    stop() {
        this._isMovingToTarget = false;
        this._targetWorldPosition = null;
        this._targetMoveBaseSpeed = 0;
        this.wasMovingToTarget = false;
        this.preKnockbackTargetPosition = null;
        this.knockbackDirection.set(Vec3.ZERO);
        this._moveDir.set(Vec3.ZERO);
        this.curSpeed = 0;
        if (this.isOpenRigidbody) {
            if (GameInfo.SceneType == SceneType.D2) {
                if (this._rigidBody2D)
                    this._rigidBody2D.linearVelocity = Vec2.ZERO.clone();
            } else {
                this._rigidBody.setLinearVelocity(Vec3.ZERO);
            }
        }
        this.isKnockingBack = false;
        this.knockbackTimer = 0;
        // ===== 击退朝向修复：清空击退移动向量 =====
        this._knockbackMoveDir.set(Vec3.ZERO);
        // ===== 击退朝向修复结束 =====

        // ===== 击退碰撞层优化：确保碰撞层总是能恢复 =====
        // 防止意外中断（如角色死亡、游戏结束等）导致碰撞层未恢复
        this.restoreOriginalGroup();
        // ===== 击退碰撞层优化结束 =====
    }

    /**
     * 停止主动移动（但保留击退效果）
     */
    public stopActiveMovement() {
        // 只停止目标移动和普通移动，不停止击退
        this._isMovingToTarget = false;
        this._targetWorldPosition = null;
        this._targetMoveBaseSpeed = 0;
        this.wasMovingToTarget = false;
        this.preKnockbackTargetPosition = null;

        // 如果当前不在击退状态，才清除移动方向和速度
        if (!this.isKnockingBack) {
            this._moveDir.set(Vec3.ZERO);
            this.curSpeed = 0;
            if (this.isOpenRigidbody) {
                if (GameInfo.SceneType == SceneType.D2) {
                    if (this._rigidBody2D)
                        this._rigidBody2D.linearVelocity = Vec2.ZERO.clone();
                } else {
                    this._rigidBody.setLinearVelocity(Vec3.ZERO);
                }
            }
        }
    }


    // 目标点移动相关方法
    public moveToWorldPosition(targetPos: Vec3, speed?: number) {
        const moveSpeed = speed ?? this.baseSpeed;
        this.curSpeed = moveSpeed;
        this._targetMoveBaseSpeed = moveSpeed;
        if (GameInfo.SceneType == SceneType.D2) {
            this._targetWorldPosition = v3(targetPos.x, targetPos.y, 0);
        } else {
            // 保持当前Y轴位置
            this._targetWorldPosition = v3(targetPos.x, this.node.worldPosition.y, targetPos.z);
        }
        this._isMovingToTarget = true;
    }
    /** 是否正在向目标点移动 */
    public get isMovingToTarget(): boolean {
        return this._isMovingToTarget;
    }
    /** 目标点位置 */
    public get targetPosition(): Vec3 | null {
        return this._targetWorldPosition;
    }
    /** 是否处于击退状态 */
    public get isInKnockbackState(): boolean {
        return this.isKnockingBack;
    }
    // 更新目标点移动逻辑
    protected updateTargetMovement(dt: number) {
        if (!this._isMovingToTarget || !this._targetWorldPosition) return;

        // 检查是否到达目标点（只在XZ平面计算距离）
        Vec3.subtract(this._tempVec3, this._targetWorldPosition, this.node.worldPosition);
        if (GameInfo.SceneType == SceneType.D2) {
            this._tempVec3.z = 0;
        } else {
            this._tempVec3.y = 0; // 忽略Y轴差异
        }
        const distance = Vec3.len(this._tempVec3);
        if (distance <= this.arriveDistance) {
            this.onTargetArrived();
            return;
        }

        // 归一化方向向量
        Vec3.normalize(this._tempVec3, this._tempVec3);

        // ========== 计算实际移动速度（新增减速逻辑） ==========
        // 使用"目标移动基准速度"而不是上一帧已经减速过的 curSpeed，
        // 避免多帧叠加减速导致速度指数级接近 0
        const baseSpeed = this._targetMoveBaseSpeed > 0 ? this._targetMoveBaseSpeed : this.curSpeed;
        let actualSpeed = baseSpeed;

        // 减速阈值：当距离小于此值时开始减速（arriveDistance的3倍，确保平滑减速）
        const slowDownDistance = this.arriveDistance * 3;

        if (distance < slowDownDistance) {
            // 线性减速：速度 = baseSpeed * (distance / slowDownDistance)
            // 但保持最小速度为 baseSpeed * 0.3，避免过慢
            const speedRatio = Math.max(0.3, distance / slowDownDistance);
            actualSpeed = baseSpeed * speedRatio;
        }

        // 最终安全检查：如果下一帧会越过目标点，则直接到达
        const nextFrameDistance = actualSpeed * dt;
        if (distance <= nextFrameDistance + 0.1) { // 0.1 为安全边距
            this.onTargetArrived();
            return;
        }
        // ====================================================

        // ========== 混合滑动方向 ==========
        // 注意：接近目标点时减弱滑动影响，避免方向偏移导致晃动
        if (!Vec3.equals(this.slideDirection, Vec3.ZERO)) {
            let blendRatio = this.SLIDE_BLEND_RATIO;

            // 在减速区域内，逐渐降低滑动影响
            if (distance < slowDownDistance) {
                blendRatio *= (distance / slowDownDistance);
            }

            // 混合公式：finalDir = normalize(targetDir + slideDir * ratio)
            Vec3.scaleAndAdd(this._tempVec3, this._tempVec3, this.slideDirection, blendRatio);
            Vec3.normalize(this._tempVec3, this._tempVec3);
        }
        // ==================================

        this.move(this._tempVec3, actualSpeed);
    }
    public stopFollow() {
        this.onTargetArrived();
    }
    // 目标点到达后的回调方法
    protected onTargetArrived() {
        this.stop();
        // 触发到达事件
        this.node.emit(ComponentEvent.TargetReached);
    }
    /**
     * 用于击退方向计算的世界坐标（子类可重写，例如飞行怪用角色节点而非 MoveCtrl 节点）
     */
    protected getWorldPositionForKnockback(): Vec3 {
        return this.node.worldPosition;
    }

    /**
     * 击退源点与受击者重合时，用几何差分无法得到方向，此时使用 fallbackDir（如子弹飞行方向）
     */
    protected applyKnockbackDirectionFromSource(pos: Vec3, fallbackDir?: Readonly<Vec3>): void {
        Vec3.subtract(this.knockbackDirection, this.getWorldPositionForKnockback(), pos);
        if (GameInfo.SceneType == SceneType.D3) {
            this.knockbackDirection.y = 0;
        }
        if (Vec3.equals(this.knockbackDirection, Vec3.ZERO)) {
            if (fallbackDir && fallbackDir.lengthSqr() > 1e-10) {
                Vec3.copy(this.knockbackDirection, fallbackDir);
                if (GameInfo.SceneType == SceneType.D3) {
                    this.knockbackDirection.y = 0;
                }
            }
            if (Vec3.equals(this.knockbackDirection, Vec3.ZERO)) {
                this.knockbackDirection.set(-1, 0, 0);
                if (GameInfo.SceneType == SceneType.D3) {
                    this.knockbackDirection.y = 0;
                }
            }
        }
        if (this.knockbackDirection.lengthSqr() < 1e-12) {
            this.knockbackDirection.set(-1, 0, 0);
            if (GameInfo.SceneType == SceneType.D3) {
                this.knockbackDirection.y = 0;
            }
        }
        Vec3.normalize(this.knockbackDirection, this.knockbackDirection);
    }

    /**
     * 仅当确有「非目标点」脚本移动意图时保存击退前方向，避免击退结束误 move() 导致下一次击退误存
     */
    protected capturePreKnockbackFreeDirectionIfNeeded(): void {
        const hadFreeMoveIntent =
            !this.isMovingToTarget &&
            this._moveDir.lengthSqr() > this._preKnockbackDirEpsSq &&
            this.curSpeed > this._preKnockbackSpeedEps;
        if (hadFreeMoveIntent) {
            Vec3.copy(this.preKnockbackDirection, this._moveDir);
        } else {
            this.preKnockbackDirection.set(Vec3.ZERO);
        }
    }

    /**
     * 击退
     * @param pos 击退位置
     * @param force 击退力度
     * @param fallbackDir 与 pos 重合无法算方向时使用（如子弹速度方向）
     */
    public knockback(pos: Vec3, force: number, fallbackDir?: Readonly<Vec3>) {
        return; // 本项目无击退
        if (force <= 0) return;
        // 考虑刚体质量调整击退力
        let adjustedForce = force;
        if (this._rigidBody) {
            const mass = this._rigidBody.mass;
            if (mass > 0) {
                // 根据质量调整力度：质量越大，受到的影响越小
                // 使用 1/sqrt(mass) 作为力度系数，使得力度随质量增加而减小，但不会减小太快
                adjustedForce = force / Math.sqrt(mass);

                // 设置最大力度限制
                adjustedForce = Math.min(force * 2, adjustedForce);
            }
        }
        // 如果调整后的力度太小，则不执行击退
        if (adjustedForce <= 0.1) return;
        // 如果第一次击退，保存当前移动到目标的状态
        if (!this.isKnockingBack) {
            // 保存当前是否在向目标移动
            this.wasMovingToTarget = this.isMovingToTarget;

            // 保存目标位置
            if (this.isMovingToTarget && this._targetWorldPosition) {
                this.preKnockbackTargetPosition = this._targetWorldPosition.clone();
            }
            // 仅保存真实自由移动方向；静止或仅目标点移动时 preKnockbackDirection 保持零，避免击退结束误恢复滑动
            this.capturePreKnockbackFreeDirectionIfNeeded();
            // 立即清空脚本移动向量，击退期间由 move() 拒绝写入，避免短间隔内第二次击退保存到「追踪临时方向」
            this._moveDir.set(Vec3.ZERO);
            this.curSpeed = 0;
        }
        // 暂时停止向目标点移动，击退结束后会恢复
        this._isMovingToTarget = false;

        // 计算击退方向（从击退源点指向角色的方向）；重合时用 fallbackDir
        this.applyKnockbackDirectionFromSource(pos, fallbackDir);

        // 设置击退状态
        this.isKnockingBack = true;
        this.knockbackTimer = 0;  // 重置计时器，使得每次击退都能完整执行
        this.knockbackForce = adjustedForce;

        // ===== 击退碰撞层优化：先切换碰撞层，延迟2帧后施加击退力 =====
        // 原逻辑：立即应用击退力（可能导致扎堆怪物相互阻挡）
        // Vec3.multiplyScalar(this._moveDir, this.knockbackDirection, this.knockbackForce);
        // this.node.emit(ComponentEvent.KnockbackStart);

        // 新逻辑：第1步 - 切换到击退碰撞层
        this.switchToKnockbackGroup();

        // ===== 击退朝向修复：使用击退专用移动向量 =====
        // 原逻辑：Vec3.multiplyScalar(this._moveDir, this.knockbackDirection, this.knockbackForce);
        // 新逻辑：使用 _knockbackMoveDir，不影响 _moveDir（角色朝向）
        Vec3.multiplyScalar(this._knockbackMoveDir, this.knockbackDirection, this.knockbackForce);
        // ===== 击退朝向修复结束 =====

        // 第2步 - 延迟2帧后发送击退开始事件（避免物理引擎穿透修正导致的挤开效果）
        // 注意：击退力立即施加，只是事件延迟发送
        this.scheduleOnce(() => {
            this.scheduleOnce(() => {
                // 发送击退开始事件
                this.node.emit(ComponentEvent.KnockbackStart);
            }, 0);
        }, 0);
        // ===== 击退碰撞层优化结束 =====
    }
    /**
     * ===== 击退碰撞层优化：切换到击退碰撞层 =====
     * 切换到击退专用碰撞层，使被击退单位不与其他怪物发生碰撞
     */
    private switchToKnockbackGroup() {
        const knockbackGroup = GameInfo.instance.gameMgr.KnockbackEndGroup ?? this.defaultGroup;
        if (GameInfo.SceneType == SceneType.D2) {
            // TODO: 2D场景暂不实现碰撞层切换（RigidBody2D API不同）
            // 原逻辑（不可用）：this._rigidBody2D.setGroup(knockbackGroup);
        } else {
            if (this._rigidBody) {
                this._rigidBody.setGroup(knockbackGroup);
            }
        }
    }

    /**
     * ===== 击退碰撞层优化：恢复原始碰撞层 =====
     * 击退结束后，恢复到原始碰撞层
     */
    private restoreOriginalGroup() {
        if (GameInfo.SceneType == SceneType.D2) {
            // 原逻辑（不可用）：this._rigidBody2D.setGroup(this.defaultGroup);
        } else {
            if (this._rigidBody) {
                this._rigidBody.setGroup(this.defaultGroup);
            }
        }
    }

    /**
     * 击退结束瞬间同步恢复移动（原 scheduleOnce(0) 改为 emit 同帧立即执行）。
     * 不再用 isMoving 做外层判断：击退开始已清空 _moveDir，结束时 isMoving 恒为 false，否则永远不恢复。
     */
    private applyKnockbackMovementRestore(): void {
        if (this.wasMovingToTarget && this.preKnockbackTargetPosition) {
            this._isMovingToTarget = true;
            if (!this._targetWorldPosition) {
                this._targetWorldPosition = this.preKnockbackTargetPosition.clone();
            }

            Vec3.subtract(this._tempVec3, this._targetWorldPosition, this.node.worldPosition);
            if (!Vec3.equals(this._tempVec3, Vec3.ZERO)) {
                Vec3.normalize(this._tempVec3, this._tempVec3);
                this.move(this._tempVec3);
            } else {
                this._moveDir.set(Vec3.ZERO);
                this.curSpeed = 0;
            }
        } else if (this.preKnockbackDirection.lengthSqr() > this._preKnockbackDirEpsSq) {
            this.move(this.preKnockbackDirection);
        } else {
            this._moveDir.set(Vec3.ZERO);
            this.curSpeed = 0;
        }
    }

    private onKnockbackEndForMovement(): void {
        this.applyKnockbackMovementRestore();
    }

    // ========== 障碍物切线滑动方法（新增） ==========
    /**
     * 应用障碍物滑动方向
     * @param contactNormal 碰撞点法线（指向工人）
     */
    public applySlideDirection(contactNormal: Vec3): void {
        // 只在向目标移动时才处理
        if (!this._isMovingToTarget || Vec3.equals(this._moveDir, Vec3.ZERO)) {
            Vec3.set(this.slideDirection, 0, 0, 0);
            return;
        }

        // 【修复】判断是否正面碰撞：使用绝对值，无论从哪个方向碰撞都处理
        // 原问题：从背后返回时 dotProduct < 0 导致不触发
        // 新逻辑：只要不是侧面擦过（接近90度），就应用滑动
        const dotProduct = Vec3.dot(this._moveDir, contactNormal);
        const absDot = Math.abs(dotProduct);

        // 调试日志
        // console.log(`[MoveCtrl] Collision - dotProduct: ${dotProduct.toFixed(3)}, absDot: ${absDot.toFixed(3)}, moveDir: (${this._moveDir.x.toFixed(2)}, ${this._moveDir.z.toFixed(2)}), normal: (${contactNormal.x.toFixed(2)}, ${contactNormal.z.toFixed(2)})`);

        if (absDot <= this.FRONTAL_COLLISION_DOT) {
            // 侧面擦过（接近90度），不干预
            // console.log(`[MoveCtrl] Side collision, skipping (absDot: ${absDot.toFixed(3)} <= ${this.FRONTAL_COLLISION_DOT})`);
            Vec3.set(this.slideDirection, 0, 0, 0);
            return;
        }

        // 计算切线方向：tangent = moveDir - (moveDir·normal)×normal
        Vec3.scaleAndAdd(this.slideDirection, this._moveDir, contactNormal, -dotProduct);
        Vec3.normalize(this.slideDirection, this.slideDirection);

        // console.log(`[MoveCtrl] Applied slide direction: (${this.slideDirection.x.toFixed(2)}, ${this.slideDirection.z.toFixed(2)})`);
    }

    /**
     * 清除滑动方向
     */
    public clearSlideDirection(): void {
        Vec3.set(this.slideDirection, 0, 0, 0);
    }
    // ========================================
}


