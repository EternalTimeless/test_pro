import { _decorator, Camera, Component, Label, math, Node, ProgressBar, UITransform, v3, Vec3, view } from 'cc';
import { GameInfo } from '../Common/GameInfo';
import { ViewTips } from '../View/ViewTips';
import { ViewGameOver } from '../View/GameOver';
import { ViewWarning } from '../View/ViewWarning';
import { CameraCtrl } from '../CharacterCtrl/CameraCtrl';
import { CommonEvent } from '../Common/CommonEnum';
import { AudioMgr, SoundEnum } from '../Core/Managers/AudioMgr';
import { SuperPackage } from 'db://super-packager/Common/SuperPackage';
import PBASDK from 'db://super-packager/JiangYv/PBASDK-v3/PBASDK';
// import PBASDK from 'db://super-packager/JiangYv/PBASDK-v3/PBASDK';
const { ccclass, property } = _decorator;

@ccclass('ViewManager')
export class ViewManager extends Component {
    @property({ type: Label, displayName: '金币资源' })
    private lab_gold: Label = null;
    @property({ type: Label, displayName: '资源2' })
    private lab_res2: Label = null;
    @property({ type: Label, displayName: '资源3' })
    private lab_res3: Label = null;
    @property({ type: ViewTips, displayName: "提示框" })
    private TipDialog: ViewTips | null = null;
    @property({ type: ViewGameOver, displayName: "游戏结束" })
    private gameOver: ViewGameOver = null!;
    @property({ type: Node, displayName: "指引手" })
    private guideHand: Node | null = null;

    @property({ type: Camera, displayName: "UI相机" })
    private uiCamera: Camera | null = null;
    @property({ type: ViewWarning, displayName: "警告框" })
    public warning: ViewWarning = null;
    @property({ type: Node, displayName: "开始点击区域" })
    public startClickNode: Node = null;
    @property({ type: [Node], displayName: "警告提示图标", visible: false })
    private tipsIcon: Node[] = [];
    @property({ type: Node, displayName: "遮罩引导区域" })
    public maskNode: Node = null;
    @property({ type: Node, displayName: "遮罩引导点击区域" })
    public maskClickNode: Node = null;
    /**屏幕实际分辨率 */
    private uiSize: math.Rect = null;
    @property({ type: Node, displayName: "指引手2" })
    public guideHand2: Node = null;
    /**强制跳转 */
    ForceToDownload() {
        PBASDK.AuToJumpDownload();
        SuperPackage.Instance.DownloadTCE();
    }
    /**按钮跳转 */
    BtnDownload() {
        PBASDK.ClickDownloadBar();
        SuperPackage.Instance.Download();
    }
    // public coinArr: Node[] = []!;
    public MaxCoin: number = 9999;
    private _goldCoin: number = 0;
    /**获取金币 */
    public get GoldCoin(): number {
        return this._goldCoin;
    }

    /**添加金币 负数减少金币*/
    public addGoldCoin(amount: number) {
        //amount可能为负数
        this._goldCoin += amount;
        if (this.lab_gold) this.lab_gold.string = this._goldCoin.toString();
    }
    private _resCoin2: number = 0;
    public get WoodCoin(): number {
        return this._resCoin2;
    }
    public addWoodCoin(amount: number): void {
        this._resCoin2 += amount;
        if (this.lab_res2) this.lab_res2.string = this._resCoin2.toString();
    }
    private _resCoin3: number = 3;
    public get CoinToolRod(): number {
        return this._resCoin3;
    }
    public addRes3(amount: number): void {
        this._resCoin3 += amount;
        if (this.lab_res3) this.lab_res3.string = this._resCoin3.toString();
    }
    protected onLoad(): void {
        GameInfo.instance.viewMgr = this;
        GameInfo.instance.uiSize = view.getVisibleSize();// this.node.getComponent(UITransform).getBoundingBox();
        this.gameOver.node.active = false;
        if (this.guideHand) this.guideHand.active = false;
        if (this.guideHand2) this.guideHand2.active = false;
        if (this.maskNode) this.maskNode.active = false;
        if (this.maskClickNode) this.maskClickNode.active = false;
        if (this.startClickNode) this.startClickNode.active = false;
        this.updateCoinDisplay();
        // 初始化所有图标和计时器
        this.tipsIcon.forEach((icon, index) => {
            icon.active = false;
            this.durationTimers[index] = 0; // 初始化每个图标的计时器
        })
        this.uiSize = this.node.getComponent(UITransform).getBoundingBox();
    }
    protected start(): void {
    }
    protected onDestroy(): void {
    }
    update(dt: number) {
        // 遍历所有图标的计时器，独立更新
        // this.durationTimers.forEach((timer, index) => {
        //     if (timer > 0) {
        //         this.updateTipIcon(index);
        //         this.durationTimers[index] -= dt;
        //         // 当该图标的计时器归零时，隐藏对应的图标
        //         if (this.durationTimers[index] <= 0) {
        //             this.hideTipIcon(index);
        //         }
        //     }
        // });
    }
    private updateCoinDisplay() {
        if (this.lab_gold) {
            this.lab_gold.string = this._goldCoin.toString();
        }
        if (this.lab_res2) {
            this.lab_res2.string = this._resCoin2.toString();
        }
        if (this.lab_res3) {
            this.lab_res3.string = this._resCoin3.toString();
        }
    }
    public ShowGuideTip(index: number, isloop: boolean = true) {
        if (!this.TipDialog) return;
        this.TipDialog.ShowTips(index, isloop);
    }
    public hideTips() {
        if (!this.TipDialog) return;
        this.TipDialog.hideTips();
    }
    public showHandAni(isShow: boolean = false, pos?: Vec3, tipIndex: number = -1) {
        if (!this.guideHand) return;
        this.guideHand.active = isShow;
        if (pos) {
            this.guideHand.setPosition(pos);
        }
        if (tipIndex > -1) {
            this.ShowGuideTip(tipIndex)
        } else {
            this.hideTips();
        }
    }
    public showHandAniByPos(worldPos: Vec3) {
        const uiPos = CameraCtrl.instance.mainCamera.convertToUINode(worldPos, this.node)
        this.showHandAni(true, uiPos, 1);
    }
    public showGameOver(isWin: boolean) {
        if (!this.gameOver) return;
        if (isWin) {
            this.gameOver.Success();
            // PBASDK.GameEnd(true);
        } else {
            this.gameOver.Fail();
            // PBASDK.GameEnd(false);
        }
    }
    public hideGameOver() {
        if (!this.gameOver) return;
        this.gameOver.node.active = false;
    }
    public showWarning(isShow: boolean) {
        if (!this.warning) return;
        this.warning.switchWarning(isShow);
    }
    private durationTimers: number[] = []; // 每个图标的独立计时器数组
    /**显示提醒图标 */
    showTipIcon(index: number) {
        if (!this.tipsIcon[index]) return;
        this.tipsIcon[index].active = true;
        this.durationTimers[index] = 1; // 设置该图标的独立计时器为1秒
    }

    hideTipIcon(index: number) {
        if (!this.tipsIcon[index]) return;
        this.tipsIcon[index].active = false;
        this.durationTimers[index] = 0; // 重置该图标的计时器
    }
    updateTipIcon(index: number) {
        if (!this.tipsIcon[index]) return;
        // NOTE: 如果启用此方法, 需要获取对应的世界坐标
        let wpos = v3();
        //位置偏移
        wpos.x += 100;
        wpos.y += 80;
        const uiPos = CameraCtrl.instance.mainCamera.convertToUINode(wpos, this.node)
        const _width = this.uiSize.width;
        const _height = this.uiSize.height;
        let posX = uiPos.x;
        let posY = uiPos.y;
        if (uiPos.x > _width * 0.5) {
            posX = _width * 0.5 - 30;
        }
        if (uiPos.x < -_width * 0.5) {
            posX = -_width * 0.5 + 30;
        }
        if (uiPos.y > _height * 0.5 - 50) {
            posY = _height * 0.5 - 30;
        }
        if (uiPos.y < -_height * 0.5 + 50) {
            posY = -_height * 0.5 + 30;
        }
        // NOTE: 需要计算与屏幕中心的偏移, 并不是直接强制屏幕外的坐标到屏幕边缘
        this.tipsIcon[index].setPosition(posX, posY, 0)
    }
    // public showGuideMask(node: Node) {
    //     if (!this.maskNode) return;
    //     CameraCtrl.instance.moveToTarget(node, 0.1, () => {
    //         this.maskNode.active = true;
    //         this.maskClickNode.active = true;
    //         GameInfo.instance.GamePause();
    //         // GameInfo.instance.monsterMgr.slowDownMonster();
    //         let mask = this.maskNode.children[0];
    //         const wpos = node.worldPosition;
    //         const uiPos = CameraCtrl.instance.mainCamera.convertToUINode(wpos, this.maskNode)
    //         const uiPos2 = CameraCtrl.instance.mainCamera.convertToUINode(wpos, this.node)
    //         this.showFingerAni(true, uiPos2);
    //         mask.setPosition(uiPos.x, uiPos.y, 0);
    //     });
    // }
    // public hideGuideMask() {
    //     if (!this.maskNode) return;
    //     GameInfo.instance.GameResume();
    //     // GameInfo.instance.monsterMgr.resumeMonster();
    //     this.maskNode.active = false;
    //     this.maskClickNode.active = false;
    //     this.showFingerAni(false);
    //     this.hideTips();
    //     CameraCtrl.instance.isCameraMoving = false;
    //     GameInfo.instance.guideMgr.isGuideMonster = false;
    //     GameInfo.instance.guideMgr.onGuideStep();
    // }
    // public showFingerAni(isShow: boolean = false, pos?: Vec3, tipIndex: number = -1) {
    //     if (!this.handAni) return;
    //     this.handAni.active = isShow;
    //     if (pos) {
    //         this.handAni.setPosition(pos);
    //     }
    //     if (tipIndex > -1) {
    //         this.ShowGuideTip(tipIndex)
    //     } else {
    //         this.hideTips();
    //     }
    // }
    /** 退出交互按钮显隐（表现层）；逻辑由 TrackManager 等玩法管理器编排 */
    // public setExitBtn(visible: boolean): void {
    //     if (!this.exitInteractionNode) return;
    //     this.exitInteractionNode.active = visible;
    // }

    // /** 退出交互（按钮预制体仍可绑定此方法）；具体逻辑在 TrackManager */
    // exitInteraction(): void {
    //     GameInfo.instance.trackMgr?.exitInteractionFromExitButton();
    // }
    public resetGameUI() {
        this.gameOver.node.active = false;
        this.showHandAni(true, v3(95, -300, 0));
        GameInfo.instance.Begin = false;
        GameInfo.instance.Pause = false;
        GameInfo.instance.Over = false;
    }
    GameStart() {
        GameInfo.instance.guideMgr?.onGuideStartClick();
    }
}


