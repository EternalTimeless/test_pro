import { _decorator, Component, easing, Label, Node, tween, UIOpacity, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GetItemBubble')
export class GetItemBubble extends Component {
    @property({ type: Label })
    num: Label = null!;
    str: string[] = []
    onLoad() {

    }
    update(deltaTime: number) {

    }
    showBubble(target: Node) {
        this.num.string = this.str[0];
        let pos = target.getWorldPosition();
        let targetPos = v3(pos.x, pos.y + 4, pos.z);
        let uiopacity = this.node.getComponent(UIOpacity)
        tween(uiopacity).delay(0.3).to(0.2, { opacity: 0 }, { easing: easing.smooth }).start();
        tween(this.node).to(0.5, { worldPosition: targetPos }, { easing: easing.smooth }).call(() => {
            app.res.recoverByPool(this.node);
        }).start();
    }
}


