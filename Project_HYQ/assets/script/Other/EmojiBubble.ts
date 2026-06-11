import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EmojiTag')
export class EmojiTag extends Component {
    @property({ type: [SpriteFrame], displayName: "表情数组" })
    protected sf: SpriteFrame[] = [];
    @property({ type: Sprite, displayName: "显示" })
    protected sprite: Sprite = null;
    /**是否可见，必须在初始化之后可用，默认隐藏 */
    private _isActive: boolean;
    public get isActive(): boolean {
        return this._isActive;
    }
    public set isActive(v: boolean) {
        if (this._isActive == v) {
            return;
        }
        this._isActive = v;
        this.node.active = v;
    }
    onLoad(): void {
        this.isActive = false;
    }
    init(isShow: boolean = false) {
        this.isActive = isShow;
    }
    update(deltaTime: number) {

    }
    /**
     * 更新表情
     * @param emoji 表情索引
     */
    updateEmoji(emoji: number) {
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
}


