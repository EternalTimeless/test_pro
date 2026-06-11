import { _decorator, Component, easing, Node, Tween, tween, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GuideArrowCtrl')
export class GuideArrowCtrl extends Component {

    @property(Node)
    private arrowtran: Node;
    private orignPos: Vec3;
    onLoad() {
    }

    update(dt: number) {

    }
    protected onEnable(): void {
        this.orignPos = this.arrowtran.worldPosition.clone();
        this.tweenAni1();
    }
    protected onDisable(): void {
        //无需手动移除, 当所在父节点被隐藏时 触发onDisable 自动移除
        this.removeSelf();
    }
    protected tweenAni1() {
        if (this.node.active) {
            this.arrowtran.setWorldPosition(this.orignPos.x, this.orignPos.y + 0.6, this.orignPos.z);
            tween(this.arrowtran).to(0.5, { worldPosition: this.orignPos }, { easing: easing.quadOut }).call(() => {
                this.tweenAni2();
            }).start();
        } else {
            Tween.stopAllByTarget(this.arrowtran);
        }
    }
    protected tweenAni2() {
        if (this.node.active) {
            this.arrowtran.setWorldPosition(this.orignPos);
            tween(this.arrowtran).to(0.5, { worldPosition: v3(this.orignPos.x, this.orignPos.y + 0.6, this.orignPos.z) }, { easing: easing.quadOut }).call(() => {
                this.tweenAni1();
            }).start();
        } else {
            Tween.stopAllByTarget(this.arrowtran);
        }
    }
    removeSelf() {
        Tween.stopAllByTarget(this.arrowtran);
        app.res.recoverByPool(this.node);
    }
}


