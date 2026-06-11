import { _decorator, Component, easing, Sprite, SpriteFrame, tween, UIOpacity, UITransform, v3 } from 'cc';
import { CommonEvent } from '../Common/CommonEnum';
import { GameInfo } from '../Common/GameInfo';
// import PBASDK from 'db://super-packager/JiangYv/PBASDK-v3/PBASDK';


const { ccclass, property } = _decorator;

@ccclass('GameOver')
export class ViewGameOver extends Component {

    @property(UIOpacity)
    public root: UIOpacity;

    @property({ type: [SpriteFrame], displayName: 'succusee' })
    private succusee: SpriteFrame[] = []!;
    @property({ type: [SpriteFrame], displayName: 'fail' })
    private fail: SpriteFrame[] = []!;

    @property(Sprite)
    public icon: Sprite = null;
    // @property(Sprite)
    // public icon2: Sprite = null;
    @property(Sprite)
    public btn: Sprite = null;
    @property(Sprite)
    public btnReplay: Sprite = null;
    public tran: UITransform;

    onLoad() {
    }
    protected start(): void {
        this.tran = this.node.getComponent(UITransform);
    }
    Fail() {
        if (this.btnReplay) this.btnReplay.node.active = true;
        this.icon.spriteFrame = this.fail[0];
        // this.icon2.spriteFrame = this.fail[1];
        // this.btn.spriteFrame = this.fail[1];
        // PBASDK.GameEnd(false);
        this.Over()
    }
    Success() {
        if (this.btnReplay) this.btnReplay.node.active = false;
        this.icon.spriteFrame = this.succusee[0];
        // this.icon2.spriteFrame = this.succusee[1];
        // this.btn.spriteFrame = this.succusee[1];
        // PBASDK.GameEnd(true);
        this.Over()
    }
    Over() {
        if (!this.node.active) {
            this.node.active = true;
            this.node.setScale(0.2, 0.2);
            app.event.offAllByTarget(this);
            tween(this.node).to(0.2, { scale: v3(1, 1, 1) }, { easing: easing.quadOut }).call(() => {
                setTimeout(() => {
                    GameInfo.instance.viewMgr.ForceToDownload();
                }, 1000);
            }).start();
        }
    }
}


