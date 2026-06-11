import { _decorator, CCFloat, color, Color, Component, easing, Label, Node, Tween, tween, UIOpacity, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ComboBubble')
export class ComboBubble extends Component {
    @property(Label)
    public targetLabel: Label | null = null;

    @property({ type: [Label], tooltip: "残影" })
    public ghostLabel: Label[] = [];

    @property({ type: CCFloat, tooltip: "残影间隔时间（秒）" })
    public ghostInterval: number = 0.05;

    @property({ type: CCFloat, tooltip: "残影持续时间（秒）" })
    public ghostDuration: number = 0.2;

    @property({ type: CCFloat, tooltip: "残影初始透明度" })
    public startOpacity: number = 150;

    @property({ type: CCFloat, tooltip: "残影最终透明度" })
    public endOpacity: number = 0;
    @property({ type: CCFloat, tooltip: "最大缩放比例" })
    public maxScale = 1.25;
    @property({ type: CCFloat, tooltip: "最小缩放比例" })
    private minsScale = 0.75;

    private isScaling: boolean = false;
    str: string[] = []
    private _beatTween: Tween<Node> = null
    private _ghTween: Tween<Node>[] = []
    private _ghTween2: Tween<Label>[] = []
    private orginScale: Vec3 = new Vec3();
    onLoad() {
        this.orginScale = this.targetLabel.node.scale.clone();
        this.targetLabel.string = `Combo 0`;
        for (let index = 0; index < this.ghostLabel.length; index++) {
            const element = this.ghostLabel[index];
            element.string = `Combo 0`;
        }
    }
    update(deltaTime: number) {

    }
    refreshTargetLabel(combo: number) {
        this.targetLabel.string = `Combo ${combo ? combo : 0}`;
        for (let index = 0; index < this.ghostLabel.length; index++) {
            const element = this.ghostLabel[index];
            element.string = `Combo ${combo ? combo : 0}`;
        }
    }
    scaleWithGhost(combo: number, duration: number = 0.1) {
        this.refreshTargetLabel(combo);
        if (this.isScaling) {
            this.resetScaleAnimation();
        }
        this.isScaling = true;
        let maxScale = v3(this.orginScale.x * this.maxScale, this.orginScale.y * this.maxScale, 1)
        let minsScale = v3(this.orginScale.x * this.minsScale, this.orginScale.y * this.minsScale, 1)
        this._beatTween = tween(this.targetLabel.node)
            .to(duration, { scale: maxScale }, { easing: easing.quadOut })
            .call(() => {
                this.createGhosts(maxScale, duration);
            })
            .to(duration, { scale: minsScale }, { easing: easing.quadIn })
            .to(duration, { scale: this.orginScale }, { easing: easing.smooth })
            .call(() => { this.isScaling = false; })
            .start();
    }
    createGhosts(startScale: Vec3, duration: number = 0.1) {
        for (let i = 0; i < this.ghostLabel.length; i++) {
            // 计算每个残影的延迟时间
            const delay = i * this.ghostInterval;

            // 从对象池获取或创建残影节点
            let ghostLabel = this.ghostLabel[i];
            // 设置残影节点属性
            ghostLabel.node.setScale(startScale);
            // 设置残影的层级和透明度
            if (ghostLabel) {
                const color = this.targetLabel!.color.clone();
                color.set(color.r, color.g, color.b, this.startOpacity);
                ghostLabel.color = color;
            }
            let endScale = v3(startScale.x + i * 0.005, startScale.y + i * 0.005, 1)
            // 执行残影动画
            this._ghTween[i] = tween(ghostLabel.node)
                .delay(delay)
                .to(duration, { scale: endScale })
                .call(() => {
                    // 残影渐隐效果
                    this._ghTween2[i] = tween(ghostLabel)
                        .delay(delay)
                        .to(this.ghostDuration, { color: color(ghostLabel.color.r, ghostLabel.color.g, ghostLabel.color.b, this.endOpacity) })
                        .start();
                })
                .start();
        }
    }
    resetScaleAnimation() {
        for (let index = 0; index < this.ghostLabel.length; index++) {
            this._ghTween[index] && this._ghTween[index].stop()
            this._ghTween2[index] && this._ghTween2[index].stop()
        }
        this._ghTween = [];
        this._ghTween2 = [];
        this._beatTween.stop();
        this._beatTween = null;
        this.targetLabel.node.setScale(this.orginScale);
    }
}


