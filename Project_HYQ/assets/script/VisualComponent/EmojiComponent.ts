import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 表情UI组件
 * 整合了表情的显示和控制功能
 */
@ccclass('EmojiComponent')
export class EmojiComponent extends Component {
    @property({ type: [SpriteFrame], displayName: '表情数组' })
    protected sf: SpriteFrame[] = [];
    
    @property({ type: Sprite, displayName: '显示' })
    protected sprite: Sprite = null!;

    /**是否可见，必须在初始化之后可用，默认隐藏 */
    private _isActive: boolean = false;
    
    public get isActive(): boolean {
        return this._isActive;
    }
    
    public set isActive(v: boolean) {
        if (this._isActive === v) {
            return;
        }
        this._isActive = v;
        this.node.active = v;
    }

    onLoad(): void {
        this.isActive = false;
    }

    /**
     * 初始化表情组件
     * @param isShow 是否立即显示
     */
    public init(isShow: boolean = false): void {
        this.isActive = isShow;
    }

    /**
     * 更新表情
     * @param emoji 表情索引
     */
    public updateEmoji(emoji: number): void {
        if (!this.isActive) {
            this.isActive = true;
        }
        const sf = this.sf[emoji];
        if (sf) {
            this.sprite.spriteFrame = sf;
        } else {
            console.error(`表情索引${emoji}不存在`);
        }
    }

    /**
     * 隐藏表情
     */
    public hide(): void {
        this.isActive = false;
    }
}

