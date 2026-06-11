import { _decorator, Color, Component, easing, Label, Tween, tween, UIOpacity, v3 } from 'cc';
import { GameInfo } from '../Common/GameInfo';
const { ccclass, property } = _decorator;

@ccclass('FloatText')
export class FloatText extends Component {
    @property({ type: Label })
    num: Label = null!;
    str: string[] = []
    onLoad() {

    }
    update(deltaTime: number) {

    }
    /**
     * @param content 显示文本
     * @param textColor 文字颜色；不传则沿用 Label 预制体上的默认色
     */
    showBubble(content: string, textColor?: Color) {
        Tween.stopAllByTarget(this.node);
        this.num.string = content;
        if (textColor) {
            this.num.color = textColor;
        }
        let pos = this.node.getWorldPosition();
        let targetPos = v3(pos.x, pos.y + 1, pos.z);
        let uiopacity = this.node.getComponent(UIOpacity)
        uiopacity.opacity = 255;
        this.node.setScale(0.2, 0.2, 1);
        tween(this.node).to(0.2, { scale: v3(1.2, 1.2, 1) }, { easing: easing.smooth }).to(0.2, { scale: v3(1, 1, 1) }, { easing: easing.smooth }).start();
        tween(uiopacity).delay(0.3).to(0.2, { opacity: 0 }, { easing: easing.smooth }).start();
        tween(this.node)
            .to(0.5, { worldPosition: targetPos }, { easing: easing.smooth })
            .call(() => {
                GameInfo.instance.prefabMgr.recoverPrefab(this.node);
            })
            .start();
    }
}


