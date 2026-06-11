import { _decorator, CCFloat, Component, Label, Node, Tween, tween, UIOpacity, UITransform, Widget } from 'cc';
import { LangArrAuto } from '../TextAdaptation/LangArrAuto';
const { ccclass, property } = _decorator;

@ccclass('ViewTips')
export class ViewTips extends Component {
    @property({ type: Label, displayName: "提示文本" })
    private lab: Label | null = null;
    @property({ type: Node, displayName: "背景底框" })
    private bg: Node = null;
    @property({ type: CCFloat, displayName: "顶部偏移" })
    private topOffset: number = 120;
    private langArr: LangArrAuto = null;
    private _currentTween: Tween<UIOpacity> | null = null;
    private _loop: boolean = true;
    onLoad() {
        this.node.active = false;
        this.langArr = this.getComponent(LangArrAuto);
    }
    public ShowTips(index: number, loop: boolean = true) {
        if (!this.langArr) return;
        this.lab.string = this.langArr.getTips(index);
        this._loop = loop;
        this.lab.updateRenderData(true)
        this.scheduleOnce(this.tipAni, 0.0)
    }
    private tipAni() {
        if (this.bg) {
            this.bg.getComponent(UITransform).height = this.lab.node.getComponent(UITransform).height + 20;
            this.getComponent(Widget).top = this.topOffset + this.bg.getComponent(UITransform).height * 0.5;
            const nodeOpacity = this.node.getComponent(UIOpacity);
            // 停止上一个 tween
            if (this._currentTween) {
                this._currentTween.stop();
                this._currentTween = null;
            }

            this.node.active = true;
            nodeOpacity.opacity = 0; // 强制重置

            // 新建 tween
            this._currentTween = tween(nodeOpacity)
                .to(0.5, { opacity: 255 })
                .delay(2)
                .to(0.5, { opacity: 0 })
                .call(() => {
                    if (this._loop) {
                        this.tipAni();
                    } else {
                        this.node.active = false;
                        this._currentTween = null;
                    }
                })
                .start();
        }
    }
    public hideTips() {
        if (!this.node.active) return;
        this.unschedule(this.tipAni)
        this.node.active = false;
        if (this._currentTween) {
            this._currentTween.stop();
            this._currentTween = null;
        }
    }
}


