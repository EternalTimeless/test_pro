import { _decorator, Component, easing, Tween, tween, UIOpacity, v3 } from 'cc';
import { GameInfo } from '../Common/GameInfo';
const { ccclass, property } = _decorator;

@ccclass('BrandEffect')
export class BrandEffect extends Component {
    @property({ type: UIOpacity })
    opacity: UIOpacity = null!;
    protected onEnable(): void {
        this.showBubble();
    }
    showBubble() {
        this.node.active = true;
        Tween.stopAllByTarget(this.opacity);
        Tween.stopAllByTarget(this.node);
        this.opacity.opacity = 255;
        this.node.setScale(0.2, 0.2, 1);
        tween(this.opacity).to(0.2, { opacity: 200 }, { easing: easing.smooth }).start();
        tween(this.node)
            .to(0.2, { scale: v3(1.5, 1.5, 1.5) }, { easing: easing.smooth })
            .call(() => {
                GameInfo.instance.prefabMgr.recoverPrefab(this.node);
            })
            .start();
    }
}


