import { _decorator, Vec3, ITriggerEvent, v3, Quat, quat, CCFloat, Node } from 'cc';
import { BulletBase } from './BulletBase';
import { ColliderTag } from '../Other/ColliderTag';
import { ColliderGroupTag } from '../Common/CommonEnum';
import { CharacterBase } from '../Battle/CharacterBase';
import { AudioMgr, SoundEnum } from '../Core/Managers/AudioMgr';
import { DamageSource, GameInfo } from '../Common/GameInfo';

const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends BulletBase {
    private damage: number = 100;
    private destroyOnHit: boolean = true;
    private hasHit: boolean = false;
    private startPosition: Vec3 = new Vec3();
    private maxDistance: number = 15;
    /**最大回收时间 */
    private flyMaxTime: number = 3;
    private readonly tempVec3: Vec3 = new Vec3();
    private flyTime: number = 0;
    private readonly _quat = quat();
    private readonly _velocity = v3();
    private readonly _dirXZ = v3();
    private _isActive: boolean = false;

    private damageSource?: DamageSource;
    private hitCount: number = 0;
    private maxHitCount: number = 1;
    @property({ type: [Node], tooltip: '按等级索引的子模型(Level 0..n)，留空则不做等级切换' })
    private bullets: Node[] = []

    /** 按等级显示子节点；bullets 未配置时跳过(Level-related logic skipped when empty) */
    private applyBulletModelLevel(level: number) {
        if (!this.bullets?.length) return;
        const maxIdx = this.bullets.length - 1;
        const idx = Math.max(0, Math.min(level, maxIdx));
        this.bullets.forEach((n, i) => {
            if (n) n.active = (i === idx);
        });
        if (level > 0) {
            this.maxHitCount = 2;
        } else {
            this.maxHitCount = 1;
        }
    }

    onLoad() {
        super.onLoad();
    }

    /**
     * 初始化子弹数据
     * @param damage 箭的伤害值
     * @param direction 方向
     * @param speed 箭的线速度
     * @param maxTime 子弹最大生命周期
     * @param maxDistance 子弹最大飞行距离
     * @param damageSource 伤害来源
     * @param bulletLevel 子弹外观等级(默认 0)，仅当 bullets 数组非空时生效
     * @returns 
     */
    initData(damage: number, direction: Vec3, speed: number, maxTime: number = 3, maxDistance: number = 15, damageSource?: DamageSource, bulletLevel: number = 0) {
        this.applyBulletModelLevel(bulletLevel);
        if (!this._rigidBody) return this;
        this._isActive = true;
        this.hasHit = false;
        this.hitCount = 0;
        this.flyTime = 0;
        this.flyMaxTime = maxTime;
        this.maxDistance = maxDistance;
        this.damage = damage;
        this.damageSource = damageSource;
        // 锁定 Z 轴（roll=0），根据方向计算 yaw(Y)+pitch(X)
        this.applyYawPitchLockRoll(direction);
        // 创建速度向量
        Vec3.multiplyScalar(this._velocity, direction, speed);
        this._rigidBody.setLinearVelocity(this._velocity);
        this.startPosition = this.node.worldPosition.clone();

        return this;
    }

    private applyYawPitchLockRoll(direction: Vec3) {
        // 约定：模型默认前向为 +Z（0,0,1）
        // 目标：根据 direction 计算 yaw(Y) + pitch(X)，并锁定 roll(Z)=0
        const dirLenSqr = direction.lengthSqr();
        if (dirLenSqr < 1e-10) return;

        // yaw：只看 XZ 平面
        this._dirXZ.set(direction.x, 0, direction.z);
        const xzLen = Math.sqrt(this._dirXZ.lengthSqr());
        // 注意：纯竖直方向时 yaw 无意义，保持当前 yaw（这里直接返回，不改旋转）
        if (xzLen < 1e-8) return;

        const yawRad = Math.atan2(this._dirXZ.x, this._dirXZ.z);

        // pitch：看 y 相对水平长度。符号和具体美术朝向可能需要取反（见下方注释）
        // 常见约定：direction.y > 0 表示朝上，此时 pitch 往上抬头；若你的模型相反，把 pitchRad 改成 -pitchRad
        const pitchRad = -Math.atan2(direction.y, xzLen);

        const yawDeg = yawRad * 180 / Math.PI;
        const pitchDeg = pitchRad * 180 / Math.PI;

        //NOTE: 临时强制锁定X轴旋转

        // Z=0 强制锁定 roll
        this.node.setRotationFromEuler(0, yawDeg, 0);
    }

    update(dt: number) {
        if (!this._isActive) return;

        //定时回收
        this.flyTime += dt;
        if (this.flyTime > this.flyMaxTime && !this.hasHit) {
            this.recover();
            return;
        }

        // 检查是否超过最大距离
        Vec3.subtract(this.tempVec3, this.node.worldPosition, this.startPosition);
        const currentDistance = this.tempVec3.x * this.tempVec3.x + this.tempVec3.y * this.tempVec3.y + this.tempVec3.z * this.tempVec3.z;
        if (currentDistance > (this.maxDistance * this.maxDistance) && !this.hasHit) {
            this.recover();
        }
    }

    // 设置是否在击中后销毁
    public setDestroyOnHit(destroy: boolean) {
        this.destroyOnHit = destroy;
        return this;
    }

    // 碰撞回调
    protected onTriggerEnter(event: ITriggerEvent) {

        if (this.hitCount > this.maxHitCount || !this._isActive) return;

        const _t = event.otherCollider.node.getComponent(ColliderTag);
        if (_t && (_t.tag === ColliderGroupTag.Elite || _t.tag === ColliderGroupTag.Monster)) {
            if (!this.hasHit) {
                this.hasHit = true;
            }
            this.hitCount++;
            const co = event.otherCollider.node.getComponent(CharacterBase);
            if (co) {
                // if (co.onHurt(this.damage, this.damageSource)) {
                //     // 子弹与怪物体型重叠时 worldPosition 与 pos 重合，传入飞行方向作为击退方向回退(fallback)
                //     co.knockback(this.node.worldPosition, 5, this._velocity);
                // }
                co.onHurt(this.damage, this.damageSource);
            }
        }
        if (this.hitCount >= this.maxHitCount) {
            this.recover();
        }
    }

    /**子弹回收 */
    recover() {
        if (!this._isActive) return;

        this._isActive = false;
        this._rigidBody.setLinearVelocity(Vec3.ZERO);
        this.scheduleOnce(() => {
            app.res.recoverByPool(this.node);
        });
    }

    onDestroy() {
        this._isActive = false;
        super.onDestroy();
    }
} 