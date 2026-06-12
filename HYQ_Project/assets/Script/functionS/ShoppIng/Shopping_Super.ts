import { _decorator, CCBoolean, CCFloat, CCInteger, color, Color, Component, Label, Node, Sprite, tween, Vec3 } from "cc";
import ShoppIngEvent from "./ShoppIngEvent";
import TweenTool from "../../Tool/TweenTool";
import { PropEnum } from "../../Base/EnumList";
const { ccclass, property } = _decorator;

/** 单个道具配置 */
@ccclass('ShoppingItem')
class ShoppingItem {
    @property({ type: PropEnum })
    public propId: PropEnum = PropEnum.gold;

    @property(CCInteger)
    public amount: number = 20;

    @property(Label)
    public label: Label | null = null;

    /** 剩余数量（运行时） */
    public remaining: number = 0;
    /** 预付款余额（运行时） */
    public prePaid: number = 0;
    /** 动画是否正在播放（运行时） */
    public isAnimating: boolean = false;

    /** 初始化 */
    public init() {
        this.remaining = this.amount;
        this.prePaid = this.amount;
        this.isAnimating = false;
        this.updateLabel();
    }

    /** 更新Label显示 */
    public updateLabel() {
        if (this.label) {
            this.label.string = this.remaining.toString();
        }
    }

    /** 是否已完成 */
    public get isComplete(): boolean {
        return this.remaining <= 0;
    }
}

@ccclass('Shopping_Super')
export default class Shopping_Super extends Component {

    @property(Sprite)
    public progress: Sprite;

    /** 多道具配置数组 */
    @property({ type: ShoppingItem })
    public shoppingItems: ShoppingItem[] = [];

    @property(CCInteger)
    public loopCount: number = -1;//-1表示永不关店
    /**
     * false jumpTimeInterval 表示间隔时间
     * true jumpTimeInterval 表示完成一次所用的时间
     */
    @property(CCBoolean)
    public totaldurationSwitch: boolean = false;
    @property(CCFloat)
    public jumpTimeInterval: number = 0.05;
    private _jumpTimeInterval: number = 0;


    private _shopCount: number = 0;

    // ---- 缓存优化 ----
    private _incompleteItems: ShoppingItem[] = [];
    private _incompleteDirty: boolean = true;
    private _totalOriginal: number = 0;
    private _totalRemaining: number = 0;

    @property(Node)
    private _jumpNode: Node;


    @property(Node)
    public set jumpNode(value: Node) {
        this._jumpNode = value;
    }
    public get jumpNode() {
        return this._jumpNode ? this._jumpNode : this.node;
    }


    // @property(CCFloat)
    // public disTrigger: number = 128;

    @property(ShoppIngEvent)
    public shoppingEvent: ShoppIngEvent;

    protected onLoad(): void {
        this.init();
        if (!this.shoppingEvent) {
            this.shoppingEvent = this.getComponent(ShoppIngEvent);
        }
    }

    public init() {
        // 初始化所有道具并计算缓存总量
        this._totalOriginal = 0;
        this._totalRemaining = 0;
        this._incompleteDirty = true;
        for (const item of this.shoppingItems) {
            item.init();
            this._totalOriginal += item.amount;
            this._totalRemaining += item.amount;
        }

        if (this.progress) {
            this.progress.fillRange = 0;
        }
    }

    /** 根据propId获取道具配置 */
    public getItem(propId: PropEnum): ShoppingItem | null {
        return this.shoppingItems.find(item => item.propId === propId) || null;
    }

    /** 获取指定道具的剩余数量 */
    public getRemainingAmount(propId: PropEnum): number {
        return this.getItem(propId)?.remaining || 0;
    }

    /** 获取指定道具的原始数量 */
    public getOriginalAmount(propId: PropEnum): number {
        return this.getItem(propId)?.amount || 0;
    }

    /** 获取指定道具的预付款剩余数量 */
    public getPrePaidAmount(propId: PropEnum): number {
        return this.getItem(propId)?.prePaid || 0;
    }

    /** 检查所有道具是否都已购买完成 */
    public get isAllItemsComplete(): boolean {
        if (this.shoppingItems.length === 0) return true;
        return this.shoppingItems.every(item => item.isComplete);
    }

    /** 检查指定道具是否购买完成 */
    public isItemComplete(propId: PropEnum): boolean {
        return this.getItem(propId)?.isComplete || false;
    }

    /** 获取所有道具配置 */
    public get allItems(): ShoppingItem[] {
        return this.shoppingItems;
    }

    /** 获取所有未完成的道具（带缓存，脏标记触发重建） */
    public get incompleteItems(): ShoppingItem[] {
        if (this._incompleteDirty) {
            this._incompleteItems = this.shoppingItems.filter(item => !item.isComplete);
            this._incompleteDirty = false;
        }
        return this._incompleteItems;
    }

    public get isUse() {
        // 检查是否还有未完成的道具且有预付款余额
        const hasRemaining = this.shoppingItems.some(item => item.prePaid > 0);
        const isUse = hasRemaining && this.loopCount != 0;
        if (this.shoppingEvent) {
            return isUse && this.shoppingEvent.isUse();
        }
        return isUse;
    }

    protected update(dt: number): void {
        this._jumpTimeInterval -= dt;
        if (this.progress && this._totalOriginal > 0) {
            // 使用缓存的总量计算进度，避免每帧遍历求和
            let proportion = 1 - this._totalRemaining / this._totalOriginal;
            if (proportion != this.progress.fillRange) {
                let off = proportion - this.progress.fillRange;
                if (off <= 0.005) {
                    this.progress.fillRange = proportion
                } else {
                    this.progress.fillRange += off * dt * 50;
                }
            }
        }
    }
    /**实际到账 - 扣除指定道具的数量 
     * @param money 扣除数量
     * @param propId 道具ID
     * @returns 是否触发购买完成事件
     */
    public moneyAccount(money: number, propId: PropEnum): boolean {
        const item = this.getItem(propId);
        if (!item || item.remaining <= 0) {
            return false;
        }

        const oldRemaining = item.remaining;
        item.remaining = Math.max(0, item.remaining - money);
        this._totalRemaining -= (oldRemaining - item.remaining);
        this._incompleteDirty = true;
        item.updateLabel();

        // 摇晃动画
        if (item.label && !item.isAnimating) {
            item.isAnimating = true;
            TweenTool.scaleShake(item.label.node).call(() => {
                item.isAnimating = false;
            }).start();
        }

        // 检查当前道具是否完成
        if (item.isComplete) {
            // 检查是否所有道具都完成了
            if (this.isAllItemsComplete) {
                // 所有道具都购买完成，触发购买成功事件
                this.shoppingEvent && this.shoppingEvent.shoppEvent();
                this._shopCount++;

                if (this.loopCount != -1) {
                    this.loopCount--;
                    if (!this.loopCount) {
                        TweenTool.scaleShake(this.node, 0.2).call(() => {
                            this.node.active = false;
                        }).start();
                    }
                }
                if (this.loopCount) {
                    TweenTool.scaleShake(this.node).call(() => {
                        this.init();
                        this.shoppingEvent && this.shoppingEvent.init();
                    }).start();
                }
                return true;
            }
        }
        return false;
    }
    /**预付款 - 预扣指定道具的数量 
     * @param money 预扣数量
     * @param propId 道具ID
     */
    public moneyPay(money: number, propId: PropEnum) {
        const item = this.getItem(propId);
        if (item) {
            this.initJumpTime(propId);
            item.prePaid = Math.max(0, item.prePaid - money);
        }
    }


    public get shopCount() {
        return this._shopCount;
    }


    private initJumpTime(propId: PropEnum) {
        const item = this.getItem(propId);
        const original = item?.amount || 0;

        if (this.totaldurationSwitch && original > 0) {
            this._jumpTimeInterval = this.jumpTimeInterval / original;
        } else {
            this._jumpTimeInterval = this.jumpTimeInterval;
        }
        console.log(this._jumpTimeInterval);
    }

    /** 获取指定道具的剩余数量（兼容旧接口，需传入propId） */
    public getCurGold(propId: PropEnum): number {
        return this.getItem(propId)?.remaining || 0;
    }


}