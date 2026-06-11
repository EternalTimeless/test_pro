import { _decorator, CCBoolean, CCFloat, Component, Node } from 'cc';
import { CharacterBase } from './CharacterBase';
import { BattleValCtrl } from '../CharacterCtrl/BattleValCtrl';

const { ccclass, property } = _decorator;

/**
 * 建筑修复组件
 * 负责管理建筑的修复逻辑，包括修复状态、材料预留、修复判断等
 * 可挂载到任何继承自 CharacterBase 的建筑上
 */
@ccclass('BuildRepairComponent')
export class BuildRepairComponent extends Component {
    // ========== 配置参数 ==========

    @property(CCBoolean)
    private needFix: boolean = true;

    @property({ type: CCFloat, displayName: '触发修复血量阈值(0-1)' })
    private repairTriggerThreshold: number = 0.1;

    @property({ type: CCFloat, displayName: '单个材料回复百分比(0-1)' })
    private healPercentPerMaterial: number = 1.0;

    @property({ type: Node, displayName: '修复触发节点' })
    public fixTriggerNode: Node = null;

    // ========== 依赖缓存 ==========

    /** 宿主建筑的战斗组件（缓存避免重复获取）*/
    private battleComp: BattleValCtrl = null;

    /** 依赖是否已初始化 */
    private initialized: boolean = false;

    // ========== 状态管理 ==========

    /** 是否正在被工人修复中（防止多个工人同时修复同一个墙）*/
    public isBeingRepaired: boolean = false;

    /** 预留的材料数量（飞行中的材料）*/
    private reservedMaterialCount: number = 0;

    // ========== 生命周期 ==========

    onLoad() {
        // 只初始化不依赖其他组件的内容
        if (this.fixTriggerNode) {
            this.fixTriggerNode.active = false;
        }
    }

    start() {
        // 在 start 中初始化依赖（保证所有组件的 onLoad 已执行完毕）
        this.initializeDependencies();
    }

    /**
     * 初始化依赖组件
     * 采用懒加载模式，确保在使用时依赖已就绪
     */
    private initializeDependencies(): void {
        if (this.initialized) return;

        const host = this.getComponent(CharacterBase);
        if (host) {
            this.battleComp = host.battleValComp;
        }

        if (!this.battleComp) {
            console.error('[BuildRepairComponent] 缺少 BattleValCtrl，修复功能将无法使用');
            return;
        }

        this.initialized = true;
    }

    // ========== 公共接口 ==========

    /**
     * 是否启用了修复功能（配置检查，不依赖运行时状态）
     * 用于初始化阶段的判断
     */
    public get isRepairEnabled(): boolean {
        return this.needFix;
    }

    /**
     * 是否需要开始修复（用于工人选择目标）
     * 判断：当前血量 <= 触发阈值
     */
    public get isNeedFix(): boolean {
        // 确保依赖已初始化
        if (!this.initialized) this.initializeDependencies();

        if (!this.needFix || !this.battleComp) return false;
        // 只看当前血量，不考虑预留
        const currentPercentage = this.battleComp.healthPercentage;
        return currentPercentage <= this.repairTriggerThreshold;
    }

    /**
     * 是否应该继续投放材料（用于工人判断是否继续投放）
     * 判断：当前血量 + 预留回复量 <= 触发阈值
     */
    public shouldContinueRepair(): boolean {
        // 确保依赖已初始化
        if (!this.initialized) this.initializeDependencies();

        if (!this.battleComp) return false;

        const currentHealth = this.battleComp.currentHealth;
        const maxHealth = this.battleComp.maxHealth;

        // 预留的材料能回复多少血量
        const reservedHealth = this.reservedMaterialCount * this.healPercentPerMaterial * maxHealth;

        // 有效血量 = 当前 + 预留
        const effectiveHealth = currentHealth + reservedHealth;
        const effectivePercentage = effectiveHealth / maxHealth;

        // 有效血量 <= 阈值，继续投放；否则停止
        return effectivePercentage <= this.repairTriggerThreshold;
    }

    /**
     * 执行修复
     * @param materialCount 材料数量
     * @returns 是否修复成功
     * 【自动容错】修复后检查是否已达标，自动重置状态
     */
    public repair(materialCount: number): boolean {
        // 确保依赖已初始化
        if (!this.initialized) this.initializeDependencies();

        if (!this.battleComp) return false;

        const healAmount = materialCount * this.healPercentPerMaterial;
        let result: boolean = false;

        // 需要判断墙是否处于死亡状态，如果处于死亡状态，则进行复活
        if (this.battleComp.isDead) {
            this.battleComp.reviveByPercent(healAmount);
            result = true;
        } else {
            result = this.battleComp.heal(healAmount, true);
        }

        // 【容错机制】修复后检查血量，如果已经超过阈值，自动重置修复状态
        if (result) {
            const currentPercentage = this.battleComp.healthPercentage;
            if (currentPercentage > this.repairTriggerThreshold && this.isBeingRepaired) {
                this.finishRepair('auto');
            }
        }

        return result;
    }

    /**
     * 开始修复（由工人调用）
     * 设置修复标志，防止多个工人同时修复同一个建筑
     */
    public startRepair(): void {
        this.isBeingRepaired = true;
    }

    /**
     * 完成修复（由工人/自动容错调用）
     * 清空修复标志和预留材料
     * @param source 调用来源：'worker'=工人主动调用, 'auto'=自动容错触发
     */
    public finishRepair(source: 'worker' | 'auto' = 'worker'): void {
        // 防重复调用（幂等性保护）
        if (!this.isBeingRepaired && this.reservedMaterialCount === 0) {
            return;
        }
        
        const wasRepairing = this.isBeingRepaired;
        this.isBeingRepaired = false;
        this.clearReservedMaterials();
        
        // 根据来源输出日志
        if (wasRepairing && source === 'auto') {
            console.warn(`[BuildRepairComponent] 自动容错：${this.node.name} 修复状态已重置`);
        }
    }

    /**
     * 预留材料（投放前调用）
     * @param count 预留的材料数量
     */
    public reserveMaterial(count: number = 1): void {
        this.reservedMaterialCount += count;
    }

    /**
     * 消耗预留（材料到达后调用）
     * @param count 消耗的材料数量
     */
    public consumeReservedMaterial(count: number = 1): void {
        this.reservedMaterialCount = Math.max(0, this.reservedMaterialCount - count);
    }

    /**
     * 清空预留（工人放弃修复时调用）
     */
    public clearReservedMaterials(): void {
        this.reservedMaterialCount = 0;
    }

    /**
     * 更新修复触发节点的显示状态
     * 由宿主建筑在血量变化时调用
     * 【自动容错】血量变化时检查修复状态
     */
    public updateTriggerNode(): void {
        // 确保依赖已初始化
        if (!this.initialized) this.initializeDependencies();

        if (this.fixTriggerNode && this.battleComp) {
            const currentPercentage = this.battleComp.healthPercentage;
            // 血量低于阈值时显示修复触发节点
            this.fixTriggerNode.active = currentPercentage <= this.repairTriggerThreshold;

            // 【容错机制】血量变化时检查，如果已经超过阈值但仍在修复中，自动重置
            if (currentPercentage > this.repairTriggerThreshold && this.isBeingRepaired) {
                this.finishRepair('auto');
            }
        }
    }

    /**
     * 获取修复触发阈值
     */
    public getRepairThreshold(): number {
        return this.repairTriggerThreshold;
    }

    /**
     * 获取单个材料的回复百分比
     */
    public getHealPerMaterial(): number {
        return this.healPercentPerMaterial;
    }
}

