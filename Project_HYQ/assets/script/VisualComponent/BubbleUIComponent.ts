import { _decorator, CCBoolean, CCInteger, Component, Label, Node, Sprite, tween, Tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 气泡UI组件
 * 用于显示和更新特殊物品数量
 */
@ccclass('BubbleUIComponent')
export class BubbleUIComponent extends Component {
    @property({ type: Label, displayName: '数量文本', tooltip: '显示数量的Label组件' })
    bubbleLabel: Label | null = null;
    @property({ type: [Node], displayName: '图标', tooltip: '图标节点（可选）' })
    iconNodes: Node[] = [];
    @property({ type: Node, displayName: '完成图标' })
    compeletIcon: Node = null!;
    @property({ displayName: '是否开启警告动画' })
    isOpenWarning: boolean = false;
    @property({ type: Node, displayName: '警告图标（可选）' })
    warningIcon: Node = null!
    @property({ type: CCInteger, displayName: '显示警告的阈值' })
    showWarningNum: number = 5;
    /**警告UI是否正在显示 */
    private isWarningShowing: boolean = false;
    /**状态持续时间计时器 */
    private numStateTimer: number = 0;
    /**触发UI切换所需的最小持续时间（秒）*/
    private readonly WARNING_DELAY: number = 0.8;
    private _currentTween: Tween<Node> | null = null;
    private _currentTween2: Tween<Node> | null = null;
    private originY: number = 0;
    private curNum: number = 0;
    private isInit: boolean = false;
    private progress: Sprite = null;
    protected onLoad(): void {
        this.originY = this.node.y;
        this.isWarningShowing = false;
        this.numStateTimer = 0;
        this.curNum = 0;
        if (this.warningIcon) this.warningIcon.active = false;
        this.progress = this.node.getChildByName('progress').getComponent(Sprite);
        this.progress.fillRange = 0;
        this.isInit = false;
        this.compeletIcon.active = false;
    }
    protected update(dt: number): void {
        this.updateWarning(dt);
    }
    /**
     * 更新警告UI（带延迟防抖机制）
     * 避免在临界值附近频繁波动时，UI反复开关
     */
    private updateWarning(dt: number) {
        if (!this.isOpenWarning) return;
        if (!this.isInit) return;
        const isLowAmmunition = this.curNum < this.showWarningNum;

        // 如果当前状态与目标状态一致，累加计时器
        if (isLowAmmunition && !this.isWarningShowing) {
            // 数量不足但警告未显示：累加计时器
            this.numStateTimer += dt;
            if (this.numStateTimer >= this.WARNING_DELAY) {
                // 持续低数量状态超过延迟时间，显示警告
                this.isWarningShowing = true;
                this.warningIcon.active = true;
                this.floatWarning();
            }
        } else if (!isLowAmmunition && this.isWarningShowing) {
            // 数量充足但警告仍显示：累加计时器
            this.numStateTimer += dt;
            if (this.numStateTimer >= this.WARNING_DELAY) {
                // 持续高数量状态超过延迟时间，隐藏警告
                this.isWarningShowing = false;
                this.warningIcon.active = false;
                this.resetWarning();
            }
        } else {
            // 状态稳定或已同步，重置计时器
            this.numStateTimer = 0;
        }
    }
    /**
     * 更新气泡显示
     * @param current 当前数量
     * @param max 最大数量（可选）
     */
    public updateBubble(current: number, max?: number): void {
        if (!this.bubbleLabel) {
            return;
        }
        if (!current) current = 0;
        if (max) {
            // this.bubbleLabel.string = `${current}/${max}`;
            this.progress.node.active = true;
            this.progress.fillRange = 1 - current / max;
        } else {
            this.progress.node.active = false;
        }
        this.bubbleLabel.string = current.toString();
        this.curNum = current;
        if (current == 0) {
            this.bubbleLabel.node.active = false;
        } else {
            this.bubbleLabel.node.active = true;
        }
        if (!this.isInit) this.isInit = true;
    }

    /**
     * 设置气泡UI可见性
     * @param visible 是否可见
     * @param compeletAnim 是否播放完成动画
     */
    public setVisible(visible: boolean, compeletAnim: boolean = false): void {

        if (this.node) {
            if (compeletAnim && !visible) {
                this.iconNodes.forEach((node, index) => {
                    node.active = false;
                });
                this.compeletIcon.active = true;
                this._currentTween2 = tween(this.node)
                    .delay(0.2)
                    .to(0.5, { scale: v3(0.2, 0.2, 0.2) })
                    .call(() => {
                        this.compeletIcon.active = false;
                        this.node.active = false;
                    }).start();
            } else {
                if (this._currentTween2) {
                    this._currentTween2.stop();
                    this._currentTween2 = null;
                    this.compeletIcon.active = false;
                }
                this.node.active = visible;
                this.iconNodes[0].active = visible;
                this.node.setScale(1, 1, 1);
            }
        }
    }
    /** 上下浮动 */
    floatWarning() {
        this._currentTween = tween(this.node).to(0.5, { y: this.originY + 1 }).to(0.5, { y: this.originY }).union().repeatForever().start();
    }
    /**
     * 提示不足提示（可选实现）
     */
    public showLowNumWarning(): void {
        // TODO: 可以添加颜色变化、闪烁等效果
        // 例如：this.bubbleLabel.node.color = Color.RED
    }

    /**
     * 重置为正常显示
     */
    public resetWarning(): void {
        // TODO: 重置颜色等
        if (this._currentTween) {
            this._currentTween.stop();
            this._currentTween = null;
            tween(this.node).to(0.5, { y: this.originY }).start();
        }
        // 例如：this.bubbleLabel.node.color = Color.WHITE
    }

}

