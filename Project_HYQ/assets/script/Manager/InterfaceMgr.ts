// assets/script/Common/Interfaces.ts
import { Node, Vec3 } from 'cc';
import { DamageSource } from '../Common/GameInfo';

/**
 * 角色监听接口 - 定义各种组件回调
 */
export interface ICharacterListener {
    /** 实体死亡时调用 */
    onDead(): void;
}

/**
 * 视觉组件监听接口 - 用于数值组件向视觉组件推送数值更新
 */
export interface VisualCompListener {
    /** 健康值更新时调用 */
    onHealthUpdate?: (healthPercent: number) => void;
    /** 技能CD更新时调用 */
    onSkillCDUpdate?: (cdPercent: number) => void;
    //此处新增其他视觉组件的更新方法
}

/**
 * 可攻击接口 - 定义可以攻击的实体
 */
export interface IAttacker {
    /** 请求攻击目标 */
    requestAttack(target: Node): boolean;

    /** 执行攻击 */
    executeAttack(): void;

    /** 停止攻击 */
    stopAttack(): void;

    /** 攻击范围 */
    readonly attackRange: number;
}
