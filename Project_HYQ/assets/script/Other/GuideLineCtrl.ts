import { _decorator, CCFloat, Component, Node, quat, Quat, UITransform, v3, Vec2, Vec3 } from 'cc';
import { GameInfo, SceneType } from '../Common/GameInfo';
import { PrefabPathEnum } from '../Common/CommonEnum';
const { ccclass, property } = _decorator;

@ccclass('GuideLineCtrl')
export class GuideLineCtrl extends Component {
    private static _instance: GuideLineCtrl | null = null;
    public static get instance(): GuideLineCtrl {
        return this._instance as GuideLineCtrl;
    }
    // @property(Node)
    // public root: Node;
    // @property(UITransform)
    // maskHeight: UITransform;
    @property(UITransform)
    public arrowtran: UITransform;
    private _targetNode: Node;
    private initScale: number = 1;
    /**实际显示高度 */
    arrowHeight: number = 1;
    private guideArrow: Node = null;
    private showGuideArrow: boolean = false;
    onLoad() {
        // 单例检查
        if (GuideLineCtrl._instance) {
            this.node.destroy();
            return;
        }
        GuideLineCtrl._instance = this;
        this.initScale = this.arrowtran.node.scale.y;
        this.arrowHeight = this.arrowtran.height * this.initScale;
        this.node.active = false;
    }

    update(dt: number) {
        if (this._targetNode) {
            let dis = Vec3.distance(this.node.worldPosition, this._targetNode.worldPosition);
            let count = Math.floor(dis / this.arrowHeight);
            this.arrowtran.height = (count * this.arrowHeight) / this.initScale;
            //保留三位小数
            // this.maskHeight.height = (Math.floor((count - 2) * this.arrowHeight * 1000) / 1000);
            let pos1 = this._targetNode.worldPosition.clone();
            let pos2 = this.node.worldPosition;
            if (GameInfo.SceneType == SceneType.D2) {
                //NOTE 箭头移动不再由代码控制, 已改为UV动画
                // let pos = this.arrowtran.node.position;
                // if (this.arrowtran.node.position.y >= 0) {
                //     this.arrowtran.node.setPosition(0, -this.arrowHeight, 0);
                // } else {
                //     this.arrowtran.node.setPosition(0, pos.y + dt * 50, 0);
                // }
                pos1.subtract(pos2);
                let r = Math.atan2(pos1.y, pos1.x);
                let angle = r / Math.PI * 180;
                this.node.angle = angle - 90;
            } else {
                //NOTE 箭头移动不再由代码控制, 已改为UV动画
                // let pos = this.arrowtran.node.position;
                // if (this.arrowtran.node.position.y >= 0) {
                //     this.arrowtran.node.setPosition(0, -this.arrowHeight, 0);
                // } else {
                //     this.arrowtran.node.setPosition(0, pos.y + dt, 0);
                // }
                pos1.subtract(pos2);
                pos1.normalize();
                // 仅绕 Y 轴旋转，避免 pos1 与 Z 轴重合时产生 Z 轴欧拉角
                const angleY = Math.atan2(pos1.x, pos1.z);
                const _quat = quat();
                Quat.fromAxisAngle(_quat, v3(0, 1, 0), angleY);
                const currentQuat = this.node.getRotation();
                if (!Quat.equals(currentQuat, _quat)) {
                    this.node.setRotation(_quat);
                }
            }
        }
    }
    public set targetNode(target: Node) {
        // 兼容旧调用：默认不显示绿箭头，由外部按需开启
        this.setTarget(target, false);
    }
    public get targetNode(): Node {
        return this._targetNode;
    }

    /**
     * 设置引导目标，并可控是否显示绿箭头(Prefab GreenArrow)。
     * 说明：绿箭头节点自身 onDisable 会自动回收，因此这里只需要控制 active。
     */
    public setTarget(target: Node, showGreenArrow: boolean) {
        this._targetNode = target;
        this.showGuideArrow = !!showGreenArrow;
        this.node.active = !!target;

        if (!target || !this.showGuideArrow) {
            if (this.guideArrow && this.guideArrow.active) {
                this.guideArrow.active = false;
            }
            this.guideArrow = null;
            return;
        }

        if (!this.guideArrow) {
            this.guideArrow = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.GUIDE_ARROW);
        }
        this.guideArrow.active = true;
        const wpos = target.worldPosition.clone();
        this.guideArrow.setWorldPosition(wpos.x, wpos.y + 0.5, wpos.z);
        this.guideArrow.setParent(GameInfo.instance.gameMgr.effLayer);
    }
}


