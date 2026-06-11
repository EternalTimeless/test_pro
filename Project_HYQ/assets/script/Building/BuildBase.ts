import { _decorator, CCInteger, Component, easing, Enum, Label, Node, Sprite, Tween, tween, v3 } from 'cc';
import { BuildType, BuildUnlockState } from '../Common/CommonEnum';
import { GameInfo, SceneType } from '../Common/GameInfo';

const { ccclass, property } = _decorator;

@ccclass('BuildBase')
export class BuildBase extends Component {

    @property({ type: Enum(BuildUnlockState), displayName: '初始解锁状态' })
    private initUnlockState: BuildUnlockState = BuildUnlockState.NoActive;
    @property({ type: Node, displayName: '建筑' })
    public buildNode: Node = null!;
    @property({ type: Node, displayName: '解锁节点' })
    public unlockNode: Node = null;
    // @property({ type: Sprite, displayName: '解锁进度' })
    private progress: Sprite = null;
    // @property({ type: Label, displayName: '金币文本节点' })
    private remainGoldLbl: Label = null;
    @property({ type: CCInteger, displayName: '解锁所需金币' })
    private unlockCostValue: number = 20;
    @property({ type: Node, displayName: '放缩动画节点', visible: false })
    private aniNode: Node = null;
    @property({ type: BuildType, displayName: '建筑类型' })
    public buildType: BuildType = BuildType.None;
    private _unlockState: BuildUnlockState = BuildUnlockState.NoActive;
    /**预留金币 */
    private reservedGold: number = 0;
    /**剩余金币 */
    private remainGold: number = 0;
    // protected _buildCollider: BoxCollider = null!;
    // protected _unlockTrigger: Collider = null!;
    // protected _rigidbody: RigidBody = null!;
    /**开启角色碰撞检测 */
    // private isColliderChecking: boolean = false;
    // private isColliderTimer: number = 0;
    /**是否是重建 */
    private isReBuild: boolean = false;
    protected offsetX: number = 0;
    protected offsetY: number = 50;
    protected offsetScale: number = 2;
    protected bIndex: number = 0;


    get unlockState(): BuildUnlockState {
        return this._unlockState;
    }

    set unlockState(value: BuildUnlockState) {
        if (this._unlockState != value) {
            this._unlockState = value;
        }
        switch (value) {
            case BuildUnlockState.NoActive:
                this.unlockNode.active = false;
                this.buildNode.active = false;
                break;
            case BuildUnlockState.Active:
                this.unlockNode.active = true;
                this.buildNode.active = false;
                this.progress.fillRange = 0;
                // 重置金币数量
                this.resetForConstruction();
                break;
            case BuildUnlockState.Builded:
                this.buildNode.active = true;
                this.unlockNode.active = false;

                this.updateBuild();
                break;
            case BuildUnlockState.Destroy:
                this.buildNode.active = false;
                this.unlockNode.active = true;
                this.isReBuild = true;
                // 重置金币数量，准备重建
                this.resetForConstruction();
                break;
        }
        if (GameInfo.SceneType == SceneType.D2) {
            //解锁状态的建筑挪到战斗层
            if (this.buildNode && this.buildNode.active) {
                this.node.setParent(GameInfo.instance.gameMgr.gameLayer)
            } else {
                //不用在意节点顺序, 因为不存在重叠部分
                this.node.setParent(GameInfo.instance.gameMgr.mapLayer)
            }
        }
    }

    onLoad() {
        this.progress = this.unlockNode.getChildByName('progress').getComponent(Sprite);
        this.remainGoldLbl = this.unlockNode.getChildByName('cost').getComponent(Label);
        this.isReBuild = false;
        this.unlockState = this.initUnlockState;
    }
    initBuildIndex(index: number) {
        this.bIndex = index;
    }
    /**
     * 重置建造所需的金币数量
     */
    resetForConstruction() {
        this.remainGold = this.unlockCostValue;
        this.reservedGold = 0;
        if (this.remainGoldLbl) {
            this.remainGoldLbl.string = this.remainGold.toString();
        }

        this.unlockNode.scale = v3(0.2, 0.2, 1)
        tween(this.unlockNode)
            .delay(0.1)
            .to(0.1, { scale: v3(1.2, 1.2, 1) })
            .to(0.1, { scale: v3(1, 1, 1) })
            .start();
    }

    /**解锁后的若有逻辑在此处理 */
    public updateBuild() {

        if (!this.isReBuild) {
            this.notifyBuildUnlocked();
        } else {
        }
    }
    private _currentTween: Tween<Node> = null;
    /**
     * 解锁后逻辑自行扩写
     */
    notifyBuildUnlocked() {
        //判断建筑节点下是否存在建筑, 不存在则直接触发解锁回调
        if (this.buildNode.children.length < 1) {
            GameInfo.instance.buildingMgr.buildUnlockComplete(this.bIndex);
            return
        }

        if (GameInfo.SceneType == SceneType.D2) {
            let originalWpos = this.buildNode.worldPosition.clone();
            this.buildNode.setWorldPosition(originalWpos.x, originalWpos.y + 3, originalWpos.z);
            if (this._currentTween) {
                this._currentTween.stop();
                this._currentTween = null;
            }
            this._currentTween = tween(this.buildNode)
                // 预备动作：蓄力下蹲
                .to(0.1, { scale: v3(1.15, 0.85, 1.15) }, {
                    easing: easing.sineOut,
                })
                // 快速上升，并逐渐恢复缩放
                .to(0.2, { worldPosition: v3(originalWpos.x, originalWpos.y + 5, originalWpos.z) }, {
                    easing: easing.cubicOut,
                    onUpdate: (target, ratio) => {
                        // 从蹲下状态(1.15, 0.85)逐渐恢复到正常(1, 1)，并稍微拉伸
                        const scaleX = 1.15 - ratio * 0.15;
                        const scaleY = 0.85 + ratio * 0.25; // 到1.1，稍微拉长
                        const scaleZ = 1.15 - ratio * 0.15;
                        this.buildNode.setScale(scaleX, scaleY, scaleZ);
                    }
                })
                // 下落，逐渐拉长
                .to(0.2, { worldPosition: v3(originalWpos.x, originalWpos.y, originalWpos.z) }, {
                    easing: easing.cubicIn,
                    onUpdate: (target, ratio) => {
                        // 从(1, 1.1)拉伸到(0.9, 1.3)
                        const scaleX = 1 - ratio * 0.1;
                        const scaleY = 1.1 + ratio * 0.2;
                        const scaleZ = 1 - ratio * 0.1;

                        this.buildNode.setScale(scaleX, scaleY, scaleZ);
                    }
                })
                // 落地挤压变形
                .to(0.15, { scale: v3(1.3, 0.7, 1.3) }, {
                    easing: easing.quadOut,
                })
                // 弹性恢复到正常状态
                .to(0.2, { scale: v3(1, 1, 1) }, {
                    easing: easing.backOut,
                })
                .call(() => {
                    // GameInfo.instance.prefabMgr.createAddEffect(wpos, v3(2, 2, 2));
                    GameInfo.instance.buildingMgr.buildUnlockComplete(this.bIndex);
                })
                .start();
        } else {
            if (this._currentTween) {
                this._currentTween.stop();
                this._currentTween = null;
            }
            this._currentTween = tween(this.buildNode)
            const original = this.buildNode.getScale();
            this.buildNode.scale = v3(0.2, 0.2, 0.2)
            if (this.buildType == BuildType.Conveyor || this.buildType == BuildType.Shop) {
                GameInfo.instance.prefabMgr.createAddEffect(this.buildNode.worldPosition, v3(1, 1, 1));
            } else {
                GameInfo.instance.prefabMgr.createAddEffect(this.buildNode.worldPosition, v3(1, 1, 0.8));
            }
            tween(this.buildNode)
                .delay(0.1)
                .to(0.1, { scale: v3(original.x * 1.2, original.y * 1.2, original.z * 1.2) })
                .to(0.1, { scale: original })
                .call(() => {
                    GameInfo.instance.buildingMgr.buildUnlockComplete(this.bIndex);
                })
                .start();
        }

    }
    /**
     * 摧毁建筑，设置为需要重建状态
     */
    public destroyBuild() {
        if (this.unlockState === BuildUnlockState.Builded) {
            this.unlockState = BuildUnlockState.Destroy;
        }
    }
    /**
     * 预留金币数量，在金币飞过来的过程中先减少所需金币
     * @param amount 预留的金币数量
     */
    reserveGold(amount: number) {
        if (this.unlockState !== BuildUnlockState.Active &&
            this.unlockState !== BuildUnlockState.Destroy) return;

        this.reservedGold += amount;
        // 更新显示的剩余金币数量
        const displayRemainGold = this.getDisplayRemainGold();

        // this.getFireNode().active = false;
        // 如果预留的金币足够解锁，可以在这里触发相关事件
        if (displayRemainGold <= 0) {
            // 可以在这里添加预解锁的视觉效果或其他逻辑
        }

    }
    costGold(cost: number) {
        // 如果不是可建造状态，不处理
        if (this.unlockState !== BuildUnlockState.Active &&
            this.unlockState !== BuildUnlockState.Destroy) return;

        // 从预留的金币中扣除实际到达的金币
        const actualCost = Math.min(cost, this.reservedGold);
        if (this.remainGold < 1) return;
        this.reservedGold -= actualCost;
        this.remainGold -= cost;
        // 更新进度条
        this.progress.fillRange = 1 - this.remainGold / this.unlockCostValue;
        if (!this.aniNode) {
            this.remainGoldLbl.string = this.remainGold.toString();
            if (this.remainGold <= 0) {
                this.unlockState = BuildUnlockState.Builded;
            }
        } else {
            // 清除原本tween
            Tween.stopAllByTarget(this.aniNode);
            this.aniNode.scale = v3(1, 1, 1);
            // 播放金币动画
            tween(this.aniNode)
                .to(0.01, { scale: v3(1.2, 1.2, 1.2) })
                .call(() => {
                    this.remainGoldLbl.string = this.remainGold.toString();
                    // 检查是否已经解锁
                    if (this.remainGold <= 0) {
                        this.unlockState = BuildUnlockState.Builded;
                    }
                })
                .to(0.01, { scale: v3(1, 1, 1) })
                .start();
        }
    }
    /**获取解锁位置，用于投放资源 */
    public getItemPos() {

        return this.unlockNode.getPosition();
    }
    getRemainGold() {
        return this.remainGold;
    }

    /**
     * 获取显示的剩余金币数量（考虑预留金币）
     */
    getDisplayRemainGold() {
        return Math.max(0, this.remainGold - this.reservedGold);
    }
    protected update(dt: number): void {
        // 如果建筑节点激活，并且正在检查碰撞，则更新碰撞检查计时器
        // if (this.buildNode.active && this.isColliderChecking) {
        //     this.isColliderTimer += dt;
        //     if (this.isColliderTimer > 0.2) {
        //         this.isColliderChecking = false;
        //         this.isColliderTimer = 0;
        //     }
        // }
    }
    /**
     * 获取预留的金币数量
     */
    getReservedGold() {
        return this.reservedGold;
    }


}


