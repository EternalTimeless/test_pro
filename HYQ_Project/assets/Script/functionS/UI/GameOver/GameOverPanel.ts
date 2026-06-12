import { _decorator, Component, Node } from 'cc';
import { UnityUpComponent } from '../../../Base/UnityUpComponent';
import TweenTool from '../../../Tool/TweenTool';
import AudioManager from '../../../Base/AudioManager';
// import { SuperPackage } from 'db://super-packager/Common/SuperPackage';
import { SoundEnum } from '../../../Base/EnumList';
import { SuperPackage } from 'db://super-packager/Common/SuperPackage';
const { ccclass, property } = _decorator;

@ccclass('GameOverPanel')
export class GameOverPanel extends Component {

    public static instance: GameOverPanel;

    private isResume: boolean = false;
    constructor() {
        super();
        GameOverPanel.instance = this;
    }


    protected start(): void {
        this.node.active = false;
    }

    @property(Node)
    public winNode: Node;
    @property(Node)
    public loseNode: Node;
    @property(Node)
    public resumeNode: Node;

    show(isWin: boolean) {
        this.node.active = true;
        UnityUpComponent.isStop = true;
        TweenTool.scaleShake(this.node);
        if (isWin) {
            this.winNode.active = true;
            this.loseNode.active = false;
            AudioManager.inst.playOneShot(SoundEnum.gameWin);
        } else {
            this.winNode.active = false;
            this.loseNode.active = true;
            AudioManager.inst.playOneShot(SoundEnum.gameLoser);
            this.resumeNode.active = !this.isResume;
            this.isResume = true;
        }

        // SuperPackage.Instance.DownloadTCE();

    }

    hide() {
        this.node.active = false;
        UnityUpComponent.isStop = false;
    }


    public onDownLoadClickEvent() {
        SuperPackage.Instance.Download();
    }
}


