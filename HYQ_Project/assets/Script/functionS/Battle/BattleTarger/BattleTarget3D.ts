import { _decorator, CCFloat, CCBoolean, Component, Node, RigidBody, RigidBody2D, Vec3 } from 'cc';
import { BattleTargetBase } from '../Base/BattleTargetBase';
import { vectorPower, vectorPower_v2 } from '../../../Tool/Index';
import { EffectEnum } from '../../../Base/EnumList';
const { ccclass, property } = _decorator;

@ccclass('BattleTarget3D')
export abstract class BattleTarget3D extends BattleTargetBase {

    @property({ type: EffectEnum })
    public hitEffect: EffectEnum = EffectEnum.Monsterhit;


    @property({ type: CCFloat, tooltip: 'x方向碰撞半宽（替代物理Collider尺寸）' })
    public collisionHalfX: number = 0.23;

    @property({ type: CCFloat, tooltip: 'z方向碰撞半深（替代物理Collider尺寸）' })
    public collisionHalfZ: number = 0.23;

    @property({ tooltip: '是否受击退影响（静态物体取消勾选）' })
    public repelEnabled: boolean = true;

    public getCollisionWorldPosition(out?: Vec3): Vec3 {
        const hitNode = this.hitNode;
        const pos = hitNode && hitNode.isValid
            ? hitNode.worldPosition
            : (this.node && this.node.isValid ? this.node.worldPosition : Vec3.ZERO);
        if (out) {
            return out.set(pos);
        }
        return pos;
    }

    /** 击退速度向量（预分配，避免每帧new） */
    private _repelVel: Vec3 = new Vec3();

    /** 击退衰减系数 */
    private _repelDecay: number = 0.9;

    /** 是否有击退速度 */
    private _hasRepel: boolean = false;

    /** 临时Vec3，预分配复用 */
    private _tempPos: Vec3 = new Vec3();

    public repelBattleTarget(target: Node, reoel: number = 0) {
        if (!this.repelEnabled) return;
        // 计算击退方向（从攻击者指向自己）
        Vec3.subtract(this._repelVel, this.node.worldPosition, target.worldPosition);
        this._repelVel.normalize();
        this._repelVel.y = 0;
        this._repelVel.multiplyScalar(reoel);
        this._hasRepel = true;
    }

    /** 每帧处理击退衰减 - 由子类update中调用 */
    protected updateRepel(dt: number): void {
        if (!this._hasRepel) return;
        if (this._repelVel.lengthSqr() > 0.001) {
            const p = this.node.position;
            this._tempPos.set(p.x + this._repelVel.x * dt, p.y, p.z + this._repelVel.z * dt);
            this.node.setPosition(this._tempPos);
            this._repelVel.multiplyScalar(this._repelDecay);
        } else {
            this._hasRepel = false;
        }
    }
}


