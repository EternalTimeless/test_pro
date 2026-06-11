import { _decorator, Component, Node, Tween, tween, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ViewWarning')
export class ViewWarning extends Component {
    @property({ type: Node, tooltip: "红色底框" })
    protected bg: Node;
    private bgOpacity: UIOpacity;
    private isOpen: boolean = false;
    protected onLoad(): void {
        this.node.active = false;
        this.bgOpacity = this.node.getComponent(UIOpacity);
    }
    /**闪烁动画 */
    tweenBgOpacity() {
        this.bgOpacity.opacity = 80;
        tween(this.bgOpacity).to(0.3, { opacity: 150 }).to(0.3, { opacity: 80 }).call(() => {
            if (this.isOpen) {
                this.tweenBgOpacity()
            }
        }).start();
    }
    switchWarning(isOpen: boolean) {
        this.isOpen = isOpen;
        if (isOpen) {
            this.node.active = true;
            this.bgOpacity.opacity = 80;
            this.tweenBgOpacity();
        } else {
            this.node.active = false;
            Tween.stopAllByTarget(this.bgOpacity);
        }
    }
}


