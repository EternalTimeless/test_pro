import { _decorator, Animation, CCFloat, Component, Node, Sprite } from 'cc';
import { GuideLine } from './GuideLine';
import { Player } from '../Player/Player';
import { MoveDrive } from '../../Base/MoveRot/MoveDrive';
import { MonsterCreate } from '../Monster/MonsterCreate';
const { ccclass, property } = _decorator;

@ccclass('GuideManager')
export class GuideManager extends Component {

    public static instance: GuideManager;

    @property(Node)
    public roleNode: Node;

    private isLock: boolean = false;

    @property(Animation)
    public handAnim: Animation;

    @property({ type: CCFloat, tooltip: '加载条播放时长' })
    public loadingDuration: number = 1.2;

    private loadingNode: Node = null;
    private loadingProgress: Sprite = null;
    private loadingTime: number = 0;

    start() {
        GuideManager.instance = this;
        this.lockGameplay();
        this.initLoadingView();
    }

    update(dt: number) {
        if (this.isLock) {
            return;
        }

        if (!this.loadingNode || !this.loadingNode.active) {
            this.finishGuide();
            return;
        }

        this.loadingTime += dt;
        const progress = this.loadingDuration <= 0 ? 1 : Math.min(1, this.loadingTime / this.loadingDuration);
        if (this.loadingProgress) {
            this.loadingProgress.fillRange = progress;
        }

        if (progress >= 1) {
            this.loadingNode.active = false;
            this.finishGuide();
        }
    }

    private lockGameplay() {
        this.isLock = false;
        if (Player.instance) {
            Player.instance.isLock = false;
        }
        MoveDrive.isMoveOk = false;
        MonsterCreate.isStartMove = false;
    }

    private initLoadingView() {
        let root = this.node;
        while (root.parent) {
            root = root.parent;
        }

        this.loadingNode = this.findNodeByName(root, "loading");
        if (!this.loadingNode) {
            this.finishGuide();
            return;
        }

        this.loadingNode.active = true;
        const progressNode = this.findNodeByName(this.loadingNode, "img_hp_0") || this.findNodeByName(this.loadingNode, "img_hp_1");
        this.loadingProgress = progressNode ? progressNode.getComponent(Sprite) : null;
        if (this.loadingProgress) {
            this.loadingProgress.fillRange = 0;
        }
        this.loadingTime = 0;
    }

    private findNodeByName(root: Node, name: string): Node | null {
        if (!root) {
            return null;
        }
        if (root.name === name) {
            return root;
        }
        for (let i = 0; i < root.children.length; i++) {
            const result = this.findNodeByName(root.children[i], name);
            if (result) {
                return result;
            }
        }
        return null;
    }

    private finishGuide() {
        if (this.isLock) {
            return;
        }
        this.isLock = true;
        if (this.roleNode) {
            this.roleNode.active = false;
        }
        if (this.handAnim?.node) {
            this.handAnim.node.active = false;
        }
        GuideLine.instance?.setLineNode();
        if (Player.instance) {
            Player.instance.isLock = true;
        }
        MoveDrive.isMoveOk = true;
        MonsterCreate.isStartMove = true;
    }

}
