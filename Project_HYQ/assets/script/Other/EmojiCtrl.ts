import { _decorator, Component } from 'cc';
import { EmojiTag } from './EmojiBubble';
const { ccclass, property } = _decorator;

@ccclass('EmojiCtrl')
export class EmojiCtrl extends Component {
    @property({ type: EmojiTag, displayName: "表情" })
    protected emoji: EmojiTag = null;
    protected onLoad(): void {
    }
    init(isShow: boolean = false) {
        if (this.emoji) {
            this.emoji.onLoad();
            this.emoji.init(isShow);
        }
    }
    update(deltaTime: number) {

    }
    /**
     * 更新表情
     * @param emoji 表情索引
     */
    updateEmoji(emoji: number) {
        if (!this.emoji) return;
        this.emoji.updateEmoji(emoji);
    }
    hide() {
        if (!this.emoji) return;
        this.emoji.isActive = false;
    }
}


