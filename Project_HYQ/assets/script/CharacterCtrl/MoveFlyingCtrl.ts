// import { _decorator, Vec3, v3, Vec2, Node } from 'cc';
// import { MoveCtrl } from './MoveCtrl';
// import { ComponentEvent } from '../Common/CommonEnum';
// import { GameInfo, SceneType } from '../Common/GameInfo';
// enum FlyStatus {
//     /**起飞 */
//     Takeoff = 0,
//     /**飞行 */
//     Flying = 1,
//     /**降落 */
//     Landing = 2,
// }
// const { ccclass, property } = _decorator;

// /**
//  * 飞行移动控制组件
//  * 继承自 MoveCtrl，实现基于贝塞尔曲线的弧线飞行效果
//  * 支持飞行起伏波动和击退偏移叠加
//  */
// @ccclass('MoveFlyingCtrl')
// export class MoveFlyingCtrl extends MoveCtrl {

//     // ===== 飞行参数配置 =====

//     @property({
//         tooltip: '弧线高度（相对于起点终点的最高点偏移）',
//         range: [0, 1000, 0.1]
//     })
//     arcHeight: number = 600;

//     @property({
//         tooltip: '飞行起伏振幅',
//         range: [0, 50, 0.01]
//     })
//     waveAmplitude: number = 20;

//     @property({
//         tooltip: '飞行起伏频率（每秒波动次数）',
//         range: [0, 5, 0.1]
//     })
//     waveFrequency: number = 1;

//     @property({ type: Node, displayName: '影子节点' })
//     shadow: Node = null;
//     @property({ type: Node, displayName: '角色节点' })
//     role: Node = null;

//     @property({
//         tooltip: '起飞阶段持续时间(0-1,相对于总飞行时间)',
//         range: [0.1, 0.5, 0.01]
//     })
//     takeoffDuration: number = 0.2;

//     @property({
//         tooltip: '下降阶段开始进度(0-1)',
//         range: [0.5, 0.9, 0.01]
//     })
//     descentStart: number = 0.7;

//     @property({
//         tooltip: '最大飞行高度',
//         range: [0, 1000, 1]
//     })
//     maxHeight: number = 600;

//     @property({
//         tooltip: 'Shadow 最小缩放值(role.y=maxHeight时)',
//         range: [0, 1, 0.01]
//     })
//     shadowMinScale: number = 0.8;

//     @property({
//         tooltip: 'Shadow 最大缩放值(role.y=0时)',
//         range: [0, 2, 0.01]
//     })
//     shadowMaxScale: number = 1.0;

//     // ===== 飞行状态 =====

//     /** 飞行进度 [0, 1] */
//     private flyingProgress: number = 0;

//     /** 贝塞尔控制点 [起点, 控制点1, 控制点2, 终点] */
//     private bezierPoints: Vec3[] = [];

//     /** 起伏波动计时器 */
//     private waveTime: number = 0;

//     // ===== 飞行模式标志 =====

//     /** 是否降落 */
//     // private isLanding: boolean = false;
//     /** 飞行类型: 0=正常起飞降落, 1=起飞不降落, 2=不起飞不降落(地面状态) */
//     private flyType: number = 0;
//     /** 是否正在从空中下降到地面（用于flyType=2的过渡） */
//     private isDescendingToGround: boolean = false;

//     /** 起飞开始时的初始高度（用于平滑插值） */
//     private takeoffStartHeight: number = 0;

//     // ===== 击退偏移（方案A：偏移量叠加） =====

//     /** 累积击退偏移量 */
//     private knockbackOffset: Vec3 = new Vec3();

//     /** 击退速度向量 */
//     private knockbackVelocity: Vec3 = new Vec3();


//     // private knockbackDuration: number = 0.0;
//     /** 返回贝塞尔曲线的时间 */
//     private returnToBezierDuration: number = 0.1;
//     private returnTargetPos: Vec3 = v3();

//     // ===== 模式切换（预留，暂不实现） =====

//     /** 是否处于地面移动模式 */
//     private isGroundMode: boolean = false;

//     /** 飞行状态 */
//     private flyStatus: FlyStatus = FlyStatus.Takeoff;
//     /** 最低起飞高度 */
//     private minTakeoffHeight: number = 150;
//     // ========================================
//     // 重写父类方法
//     // ========================================

//     /**
//      * 初始化
//      */
//     onLoad() {
//         super.onLoad();

//         // 初始化 role 节点高度（如果未设置）
//         if (this.role) {
//             this.role.setPosition(this.role.position.x, 0, this.role.position.z);
//         }

//         // 初始化 shadow 节点缩放（如果未设置）
//         if (this.shadow) {
//             const initialScale = this.shadowMaxScale;
//             this.shadow.setScale(initialScale, initialScale, initialScale);
//         }
//     }
//     update(dt: number) {
//         this._timeScale = dt / this.targetScale;
//         //计算帧率影响, 保持速度不变
//         if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin) return;
//         // 更新目标点移动
//         this.updateTargetMovement(dt);
//         this.updateKnockback(dt);
//         this.updateMovePosition(dt);
//     }
//     /**是否需要下降 */
//     // setLanding(boolean: boolean) {
//     //     this.isLanding = boolean;
//     // }
//     /**设置飞行类型: 0=正常起飞降落, 1=起飞不降落, 2=不起飞不降落(地面状态) */
//     public setFlyType(type: number) {
//         this.flyType = type;
//         // 如果切换到地面模式且当前在空中，标记需要下降
//         if (type === 2 && this.role && this.role.position.y > 10) {
//             this.isDescendingToGround = true;
//         }
//     }
//     /**设置飞行标志位 */
//     setFlyStatus(status: FlyStatus) {
//         this.flyStatus = status;
//     }
//     /**
//      * 移动到世界坐标位置（飞行模式）
//      * @param targetPos 目标世界坐标
//      * @param speed 飞行速度（进度/秒，如0.5表示2秒完成）
//      */
//     public moveToWorldPosition(targetPos: Vec3, speed?: number) {
//         // 保存速度
//         this.curSpeed = speed ?? this.baseSpeed;

//         // 计算贝塞尔曲线控制点
//         const startPos = this.node.worldPosition.clone();

//         if (GameInfo.SceneType == SceneType.D2) {
//             // 2D项目：XY平面，Z轴设为0
//             this._targetWorldPosition = v3(targetPos.x, targetPos.y, 0);
//         } else {
//             // 3D项目：XZ平面，保持当前Y轴位置作为起点
//             this._targetWorldPosition = v3(targetPos.x, this.node.worldPosition.y, targetPos.z);
//             // ===== 3D项目预留：未来可能需要根据目标点Y坐标调整 =====
//             // this._targetWorldPosition = v3(targetPos.x, targetPos.y, targetPos.z);
//         }

//         this.bezierPoints = this.calculateBezierCurve(startPos, this._targetWorldPosition);

//         // 记录起飞开始时的初始高度（用于平滑插值）
//         this.takeoffStartHeight = this.role.y;

//         // 重置飞行状态
//         this.flyingProgress = 0;
//         this.waveTime = 0;

//         //移除优化, 不省略起飞过程, 当role高度处于最高时, 跳过起飞阶段会导致直接闪烁到贝塞尔进度的0.3位置, 由于贝塞尔曲线最高高度和当前位置不一致, 会导致闪烁效果
//         // // 优化：如果角色已经接近最大高度（95%以上），直接跳过起飞阶段
//         // if (this.takeoffStartHeight >= this.maxHeight * 0.95) {
//         //     // 直接进入飞行阶段，跳过起飞动画
//         //     this.flyingProgress = this.takeoffDuration;
//         //     this.setFlyStatus(FlyStatus.Flying);
//         // } else if (this.role.y <= this.minTakeoffHeight) {
//         //     this.setFlyStatus(FlyStatus.Takeoff);
//         // } else {
//         //     this.setFlyStatus(FlyStatus.Flying);
//         // }

//         this._isMovingToTarget = true;

//         //设置飞行状态, 判断是否需要起飞
//     }

//     /**
//      * 更新目标点移动（飞行模式）
//      * 根节点控制平面移动（贝塞尔曲线 + 击退偏移）
//      * role节点独立管理高度（起伏效果）
//      */
//     protected updateTargetMovement(dt: number) {
//         if (!this._isMovingToTarget || !this._targetWorldPosition) return;

//         // ===== 预留：地面模式切换 =====
//         // if (this.isGroundMode) {
//         //     super.updateTargetMovement(dt);
//         //     return;
//         // }

//         // 1. 基于时间的进度更新（速度单位：进度/秒）
//         const progressDelta = dt * this.curSpeed;
//         this.flyingProgress = Math.min(1.0, this.flyingProgress + progressDelta);

//         // 2. 计算贝塞尔曲线基础位置
//         const basePos = this.calculateBezierPosition(this.bezierPoints, this.flyingProgress);

//         // 根据场景类型设置根节点位置（唯一需要区分2D/3D的地方）
//         if (GameInfo.SceneType == SceneType.D2) {
//             // 2D项目：XY平面移动，Z坐标保持为0（高度由role.y控制）
//             basePos.z = 0;
//         } else {
//             // 3D项目：XZ平面移动，Y坐标保持为0（高度由role.y控制）
//             basePos.y = 0;
//             // ===== 3D项目预留：未来可能需要处理Y轴地形高度 =====
//             // basePos.y = this.getTerrainHeight(basePos.x, basePos.z);
//         }

//         // 3. 叠加击退偏移（只影响平面移动，2D: XY，3D: XZ）
//         if (!Vec3.equals(this.knockbackOffset, Vec3.ZERO)) {
//             // 击退偏移的Y分量始终为0（只影响平面移动）
//             basePos.add(this.knockbackOffset);
//         }

//         // 4. 设置根节点位置
//         this.node.setWorldPosition(basePos);

//         // 5. 更新角色高度和影子缩放（独立管理）
//         this.updateRoleHeight(dt);

//         //判断移动方向, 用于改变角色朝向
//         Vec3.subtract(this._tempVec3, this._targetWorldPosition, this.node.worldPosition);
//         Vec3.normalize(this._tempVec3, this._tempVec3);
//         if (this._tempVec3.x !== 0) {
//             this._tempVec3.z = 0;
//             //方向实际上不起作用, 只是储存方向用于判断朝向, 因为父类的移动方法updateMovePosition已经被重写
//             this.move(this._tempVec3);
//         }

//         // 6. 检查是否到达目标
//         if (this.flyingProgress >= 1.0) {
//             this.onTargetArrived();
//         }

//     }

//     /**
//      * 禁用物理引擎移动
//      * 飞行时不使用线速度，位置已在 updateTargetMovement 中设置
//      */
//     protected updateMovePosition(dt: number) {
//         // 飞行模式下不使用物理引擎移动
//         // 位置已在 updateTargetMovement 中通过 setWorldPosition 设置

//         // 确保线速度为零（避免物理引擎干扰）
//         if (this._isMovingToTarget) {
//             if (GameInfo.SceneType == SceneType.D2 && this._rigidBody2D) {
//                 this._rigidBody2D.linearVelocity = Vec2.ZERO.clone();
//             } else if (this._rigidBody) {
//                 this._rigidBody.setLinearVelocity(Vec3.ZERO);
//             }
//         }

//         // ===== 预留：地面模式时调用父类方法 =====
//         // if (this.isGroundMode) {
//         //     super.updateMovePosition(dt);
//         // }
//     }

//     protected getWorldPositionForKnockback(): Vec3 {
//         return this.role ? this.role.worldPosition : this.node.worldPosition;
//     }

//     /**
//      * 重写击退方法
//      * 使用偏移量叠加方案（方案A）
//      */
//     public knockback(pos: Vec3, force: number, fallbackDir?: Readonly<Vec3>) {
//         if (force <= 0) return;

//         // 考虑刚体质量调整击退力（与父类保持一致）
//         let adjustedForce = force;
//         if (this._rigidBody) {
//             const mass = this._rigidBody.mass;
//             if (mass > 0) {
//                 adjustedForce = force / Math.sqrt(mass);
//                 adjustedForce = Math.min(force * 2, adjustedForce);
//             }
//         }

//         if (adjustedForce <= 0.1) return;

//         // 如果第一次击退，保存当前移动状态
//         if (!this.isKnockingBack) {
//             this.wasMovingToTarget = this.isMovingToTarget;
//             if (this.isMovingToTarget && this._targetWorldPosition) {
//                 this.preKnockbackTargetPosition = this._targetWorldPosition.clone();
//             }
//             this.capturePreKnockbackFreeDirectionIfNeeded();
//             this._moveDir.set(Vec3.ZERO);
//             this.curSpeed = 0;
//         }
//         this._isMovingToTarget = false;
//         this.applyKnockbackDirectionFromSource(pos, fallbackDir);

//         // 设置击退状态
//         this.isKnockingBack = true;
//         this.knockbackTimer = 0;
//         this.knockbackForce = adjustedForce;

//         // 初始化击退速度向量
//         Vec3.multiplyScalar(this.knockbackVelocity, this.knockbackDirection, this.knockbackForce);
//         // 延迟2帧后发送击退开始事件（避免物理引擎穿透修正导致的挤开效果）
//         this.scheduleOnce(() => {
//             this.scheduleOnce(() => {
//                 // 发送击退开始事件
//                 this.node.emit(ComponentEvent.KnockbackStart);
//             }, 0);
//         }, 0);
//     }

//     /**
//      * 更新击退效果（偏移量叠加方案）
//      */
//     protected updateKnockback(dt: number) {
//         if (!this.isKnockingBack) {
//             // 不在击退状态，偏移量逐渐回归
//             if (this.knockbackOffset.lengthSqr() > 0.01) {
//                 this.knockbackOffset.multiplyScalar(0.9); // 回归系数
//             } else {
//                 this.knockbackOffset.set(0, 0, 0);
//             }
//             return;
//         }

//         this.knockbackTimer += dt;

//         if (this.knockbackTimer >= this.knockbackDuration) {
//             // 击退结束
//             this.isKnockingBack = false;
//             this.node.emit(ComponentEvent.KnockbackEnd);
//         } else {
//             // 计算衰减后的击退力（二次方衰减）
//             const progress = this.knockbackTimer / this.knockbackDuration;
//             const decayFactor = (1 - progress) * (1 - progress);

//             // 更新击退速度
//             Vec3.multiplyScalar(this.knockbackVelocity, this.knockbackDirection, this.knockbackForce * decayFactor);

//             // 累积偏移量（速度 * 时间）
//             const frameDelta = new Vec3();
//             Vec3.multiplyScalar(frameDelta, this.knockbackVelocity, dt);
//             this.knockbackOffset.add(frameDelta);

//             // 应用阻尼（模拟空气阻力）
//             this.knockbackOffset.multiplyScalar(0.92);
//         }
//     }

//     /**
//      * 停止移动
//      * 清理所有飞行和击退状态
//      */
//     stop() {
//         super.stop();

//         // 清空飞行状态
//         this.flyingProgress = 0;
//         this.bezierPoints = [];
//         this.waveTime = 0;

//         // 清空击退偏移
//         this.knockbackOffset.set(0, 0, 0);
//         this.knockbackVelocity.set(0, 0, 0);
//     }


//     // ========================================
//     // 高度系统管理
//     // ========================================

//     /**
//      * 更新角色高度和影子缩放
//      * role.y 独立管理，不受根节点移动影响
//      */
//     private updateRoleHeight(dt: number): void {
//         if (!this.role || !this.shadow) return;
//         let baseHeight: number = 5;
//         /**TODO: 暂时取消掉高度起伏
//          */
//         // ===== 新逻辑：基于 flyType 的高度控制 =====
//         // if (this.flyType === 2) {
//         //     // 地面状态: 不起飞不降落
//         //     if (this.isDescendingToGround) {
//         //         // 从空中平滑下降到地面
//         //         const descendSpeed = 500; // 下降速度 单位/秒
//         //         baseHeight = Math.max(0, this.role.position.y - descendSpeed * dt);
                
//         //         // 下降完成，清除标志
//         //         if (baseHeight <= 0) {
//         //             this.isDescendingToGround = false;
//         //             baseHeight = 0;
//         //         }
//         //     } else {
//         //         // 保持地面状态
//         //         baseHeight = 0;
//         //     }
//         // } else if (this.flyingProgress <= this.takeoffDuration) {
//         //     // 起飞阶段：flyType 0 和 1 都执行起飞
//         //     this.setFlyStatus(FlyStatus.Takeoff);

//         //     const takeoffProgress = this.flyingProgress / this.takeoffDuration;

//         //     // 从记录的初始高度插值到最大高度，避免抖动
//         //     baseHeight = this.takeoffStartHeight + takeoffProgress * (this.maxHeight - this.takeoffStartHeight);

//         //     // 确保不超过最大高度（边界保护）
//         //     baseHeight = Math.min(baseHeight, this.maxHeight);
//         // } else if (this.flyingProgress >= this.descentStart) {
//         //     // 下降阶段判断
//         //     if (this.flyType === 0) {
//         //         // flyType=0: 正常降落
//         //         this.setFlyStatus(FlyStatus.Landing);
//         //         const descentProgress = (this.flyingProgress - this.descentStart) / (1 - this.descentStart);
//         //         baseHeight = this.maxHeight * (1 - descentProgress);
//         //     } else {
//         //         // flyType=1: 保持最大高度不降落
//         //         this.setFlyStatus(FlyStatus.Flying);
//         //         baseHeight = this.maxHeight;
//         //     }
//         // } else {
//         //     // 空中飞行阶段：保持 maxHeight
//         //     this.setFlyStatus(FlyStatus.Flying);
//         //     baseHeight = this.maxHeight;
//         // }
        
//         // ===== 原逻辑（已注释） =====
//         // if (this.flyingProgress <= this.takeoffDuration) {
//         //     // 起飞阶段：从初始高度平滑插值到 maxHeight
//         //     this.setFlyStatus(FlyStatus.Takeoff);
//         //     const takeoffProgress = this.flyingProgress / this.takeoffDuration;
//         //     baseHeight = this.takeoffStartHeight + takeoffProgress * (this.maxHeight - this.takeoffStartHeight);
//         //     baseHeight = Math.min(baseHeight, this.maxHeight);
//         // } else if (this.flyingProgress >= this.descentStart) {
//         //     if (this.isLanding) {
//         //         this.setFlyStatus(FlyStatus.Landing);
//         //         // 下降阶段：maxHeight → 0
//         //         const descentProgress = (this.flyingProgress - this.descentStart) / (1 - this.descentStart);
//         //         baseHeight = this.maxHeight * (1 - descentProgress);
//         //     } else {
//         //         this.setFlyStatus(FlyStatus.Flying);
//         //         baseHeight = this.maxHeight;
//         //     }
//         // } else {
//         //     this.setFlyStatus(FlyStatus.Flying);
//         //     // 空中阶段：保持 maxHeight
//         //     baseHeight = this.maxHeight;
//         // }
//         // ===== 原逻辑 =====

//         // 叠加起伏效果（role.y > 0 时应用）
//         let finalHeight = baseHeight;

//         if (baseHeight > 0) {
//             // 更新起伏计时器
//             this.waveTime += dt;
//             const waveOffset = this.waveAmplitude * Math.sin(2 * Math.PI * this.waveFrequency * this.waveTime);
//             finalHeight = baseHeight + waveOffset;
//             // console.log('waveOffset', waveOffset, "finalHeight", finalHeight);
//             // 确保不会低于 0（防止起伏导致穿地）
//             finalHeight = Math.max(0, finalHeight);
//         }

//         // 设置 role 节点 Y 坐标（局部坐标，2D和3D逻辑相同）
//         this.role.setPosition(this.role.position.x, finalHeight, this.role.position.z);

//         // Shadow 缩放（线性插值，2D和3D逻辑相同）
//         // const normalizedHeight = Math.max(0, Math.min(1, finalHeight / this.maxHeight));
//         // const shadowScale = this.shadowMaxScale - (normalizedHeight * (this.shadowMaxScale - this.shadowMinScale));
//         // this.shadow.setScale(shadowScale, shadowScale, shadowScale);
//     }


//     // ========================================
//     // 贝塞尔曲线计算（复用 FlyManager 逻辑）
//     // ========================================

//     /**
//      * 计算贝塞尔曲线控制点（对称弧线）
//      * 参考 FlyManager.getControlPoint3D 的 type=0 实现
//      * @param start 起点世界坐标
//      * @param end 终点世界坐标
//      * @returns 控制点数组 [起点, 控制点1, 控制点2, 终点]
//      */
//     private calculateBezierCurve(start: Vec3, end: Vec3): Vec3[] {
//         // 对称弧线：中点上方为最高点
//         const maxY = Math.max(start.y, end.y);
//         const mid = v3(
//             (start.x + end.x) / 2,
//             maxY + this.arcHeight,
//             (start.z + end.z) / 2
//         );

//         // 返回贝塞尔控制点（控制点1和控制点2相同，形成对称弧线）
//         return [start, mid.clone(), mid.clone(), end];

//         // ===== 未来扩展：支持不同飞行轨迹 =====
//         // 可添加 flyType 参数，参考 FlyManager 的不同 type：
//         // - type=0: 对称弧线（当前实现）
//         // - type=1: 迂回型
//         // - type=2: 返回型
//         // - type=3: 螺旋型等
//     }

//     /**
//      * 计算贝塞尔曲线上的位置
//      * 复用 FlyManager.calculateBezierPosition 逻辑
//      * @param points 控制点数组 [起点, 控制点1, 控制点2, 终点]
//      * @param t 进度 [0, 1]
//      * @returns 曲线上的位置
//      */
//     private calculateBezierPosition(points: Vec3[], t: number): Vec3 {
//         if (points.length !== 4) {
//             console.error('[MoveFlyingCtrl] 贝塞尔控制点数量错误');
//             return this.node.worldPosition.clone();
//         }

//         const x = this.bezierPoint(t, points[0].x, points[1].x, points[2].x, points[3].x);
//         const y = this.bezierPoint(t, points[0].y, points[1].y, points[2].y, points[3].y);
//         const z = this.bezierPoint(t, points[0].z, points[1].z, points[2].z, points[3].z);

//         return v3(x, y, z);
//     }

//     /**
//      * 三次贝塞尔曲线计算（单轴）
//      * 复用 FlyManager.bezierPoint 逻辑
//      * @param t 进度 [0, 1]
//      * @param p0 起点
//      * @param p1 控制点1
//      * @param p2 控制点2
//      * @param p3 终点
//      * @returns 贝塞尔曲线上的值
//      */
//     private bezierPoint(t: number, p0: number, p1: number, p2: number, p3: number): number {
//         const cX = 3 * (p1 - p0);
//         const bX = 3 * (p2 - p1) - cX;
//         const aX = p3 - p0 - cX - bX;
//         return aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + p0;
//     }


//     // ========================================
//     // 预留：地面模式切换接口（暂不实现）
//     // ========================================

//     /**
//      * 切换到地面移动模式
//      * 未来实现：降落后切换到直线移动，使用父类 MoveCtrl 的逻辑
//      */
//     // public switchToGroundMode(): void {
//     //     this.isGroundMode = true;
//     //     // 清空飞行状态
//     //     this.flyingProgress = 0;
//     //     this.bezierPoints = [];
//     //     this.waveTime = 0;
//     // }

//     /**
//      * 切换到飞行模式
//      * 未来实现：起飞时切换到弧线飞行
//      */
//     // public switchToFlyingMode(): void {
//     //     this.isGroundMode = false;
//     // }
// }

