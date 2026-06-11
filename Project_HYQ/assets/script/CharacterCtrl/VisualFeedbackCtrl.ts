import { _decorator, Component, Node, v3 } from 'cc';
import { EmojiComponent } from '../VisualComponent/EmojiComponent';
import { BubbleUIComponent } from '../VisualComponent/BubbleUIComponent';
import { HpBarComponent } from '../VisualComponent/HpBarComponent';
import { SkillBarComponent } from '../VisualComponent/SkillBarComponent';
import { VisualCompListener } from '../Manager/InterfaceMgr';
import { CampType } from '../Common/CommonEnum';
// import { DamageEffect2DComp } from '../VisualComponent/DamageEffect2DComp';
import { DamageEffect3DComp } from '../VisualComponent/DamageEffect3DComponent';
const { ccclass, property } = _decorator;

/**
 * 视觉反馈控制组件
 * 整合所有角色的视觉反馈功能，提供统一接口
 * 所有子组件都是可选的，组件缺失不会报错
 * 实现 IHealthListener 和 ISkillCDListener 接口，接收数值组件的回调
 */
@ccclass('VisualFeedbackCtrl')
export class VisualFeedbackCtrl extends Component implements VisualCompListener {
    @property({ type: HpBarComponent, displayName: '血条UI', tooltip: '血条UI组件' })
    protected hpComponent: HpBarComponent | null = null;
    @property({ type: SkillBarComponent, displayName: '技能进度UI', tooltip: '技能CD_UI组件' })
    protected skillComponent: SkillBarComponent | null = null;
    @property({ type: EmojiComponent, displayName: '表情气泡', tooltip: '表情气泡组件' })
    protected emojiComponent: EmojiComponent | null = null;

    @property({ type: DamageEffect3DComp, displayName: '受伤特效组件', tooltip: '受伤特效组件（单个，向后兼容）' })
    protected damageEffectComponent: DamageEffect3DComp | null = null;

    @property({ type: [DamageEffect3DComp], displayName: '受伤特效组件列表', tooltip: '多个受伤特效组件（用于多部位破坏）' })
    protected damageEffectComponents: DamageEffect3DComp[] = [];

    @property({ type: BubbleUIComponent, displayName: '物品气泡', tooltip: '物品气泡组件' })
    protected bubbleComponent: BubbleUIComponent | null = null;

    onLoad() {
    }

    /**
     * 实现 VisualCompListener 接口 - 健康值更新回调
     * @param healthPercent 健康值百分比 (0-1)
     * @param campType 阵营类型
     */
    onHealthUpdate(healthPercent: number): void {
        this.hpComponent?.updateHealth(healthPercent);
    }
    /**
     * 实现 VisualCompListener 接口 - 技能CD更新回调
     * @param cdPercent CD进度百分比 (0-1)
     */
    onSkillCDUpdate(cdPercent: number): void {
        this.skillComponent?.updateSkillCD(cdPercent);
    }

    initData(campType: CampType) {
        if (this.hpComponent) {
            this.hpComponent.initHealthBar(campType);
        }
        if (this.skillComponent) {
            this.skillComponent.initData();
        }
        if (this.emojiComponent) {
            this.emojiComponent.init(false);
        }
        if (this.damageEffectComponent) {
            this.damageEffectComponent.initialize();
        }
        // 初始化多个受伤特效组件
        for (const comp of this.damageEffectComponents) {
            if (comp) {
                comp.initialize();
            }
        }
    }
    /**更新受伤掉血组件 */
    updateDamageComp(component: DamageEffect3DComp) {
        if (component) {
            this.damageEffectComponent = component;
            this.damageEffectComponent.initialize();
        }
    }
    /**
     * 显示伤害效果（红色闪烁）
     * 向后兼容：如果有多个组件，触发第一个；如果只有一个组件，触发单个组件
     */
    public showDamageEffect(): void {
        if (this.damageEffectComponents.length > 0) {
            // 优先使用多个组件列表中的第一个
            this.damageEffectComponents.forEach(element => {
                element?.onDamaged()
            });
        } else {
            // 向后兼容：使用单个组件
            this.damageEffectComponent?.onDamaged();
        }
    }

    /** 死亡置灰(Death desaturate)：转发到所有 3D 受击材质组件，内部会停止闪红(Flash)避免冲突 */
    public applyDamageEffectDeathGrayscale(): void {
        if (this.damageEffectComponents.length > 0) {
            for (const c of this.damageEffectComponents) {
                c?.onDeathGrayscale();
            }
        } else {
            this.damageEffectComponent?.onDeathGrayscale();
        }
    }

    /**
     * 根据索引显示指定部位的伤害效果
     * @param index 墙体节点索引
     */
    public showDamageEffectByIndex(index: number): void {
        if (index >= 0 && index < this.damageEffectComponents.length) {
            this.damageEffectComponents[index]?.onDamaged();
        } else {
            // 索引无效，回退到默认行为
            this.showDamageEffect();
        }
    }

    /**
     * 根据节点显示指定部位的伤害效果
     * @param node 墙体节点
     */
    public showDamageEffectByNode(node: Node): void {
        if (!node) {
            this.showDamageEffect();
            return;
        }
        // 查找节点对应的组件（通过节点查找）
        // 注意：这里假设 damageEffectComponents 数组中的组件挂载在对应的节点上
        // 如果组件挂载在其他节点，需要在 BuildWallCtrl 中维护索引映射关系
        for (let i = 0; i < this.damageEffectComponents.length; i++) {
            const comp = this.damageEffectComponents[i];
            if (comp && comp.node && comp.node.uuid === node.uuid) {
                comp.onDamaged();
                return;
            }
        }
        // 未找到对应节点，回退到默认行为
        this.showDamageEffect();
    }

    /**
     * 显示治疗效果（绿色光芒）
     * 注意：DamageEffectUIComponent 暂未实现此功能，预留接口
     */
    public showHealEffect(): void {
        // 预留：this.damageEffectComponent?.onHealed?.()
    }

    /**
     * 显示表情
     * @param emojiIndex 表情索引
     */
    public showEmoji(emojiIndex: number): void {
        this.emojiComponent?.updateEmoji(emojiIndex);
    }

    /**
     * 隐藏表情
     */
    public hideEmoji(): void {
        this.emojiComponent?.hide();
    }

    /**
     * 更新物品气泡显示
     * @param current 当前数量
     * @param max 最大数量（可选）
     */
    public updateBubble(current: number, max?: number): void {
        this.bubbleComponent?.updateBubble(current, max);
    }

    /**
     * 设置物品气泡可见性
     * @param visible 是否可见
     */
    public setBubbleVisible(visible: boolean, compeletAnim: boolean = false): void {
        this.bubbleComponent?.setVisible(visible, compeletAnim);
    }

    /**
     * 显示数量不足警告
     */
    public showLowQuantityWarning(): void {
        this.bubbleComponent?.showLowNumWarning();
    }

    /**
     * 重置警告状态
     */
    public resetQuantityWarning(): void {
        this.bubbleComponent?.resetWarning();
    }


    public get hasHpComponent(): boolean {
        return this.hpComponent !== null;
    }
    public get hasSkillComponent(): boolean {
        return this.skillComponent !== null;
    }
    public get hasEmojiComponent(): boolean {
        return this.emojiComponent !== null;
    }
    public get hasDamageEffectComponent(): boolean {
        return this.damageEffectComponent !== null || this.damageEffectComponents.length > 0;
    }
    public get hasBubbleComponent(): boolean {
        return this.bubbleComponent !== null;
    }
}

