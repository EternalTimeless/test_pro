import { _decorator, Component, Node } from 'cc';
import { GameInfo } from '../Common/GameInfo';
import { GuideLineCtrl } from '../Other/GuideLineCtrl';
import { CommonEvent } from '../Common/CommonEnum';
import { CameraCtrl } from '../CharacterCtrl/CameraCtrl';
const { ccclass, property } = _decorator;

@ccclass('GuideManager')
export class GuideManager extends Component {
    /**线性任务引导的节点 */
    private curNode: Node = null;
    /**优先引导的节点 */
    private curNode_priority: Node[] = [];
    private inGuideChangeStatus: boolean = false;
    public isGuideMonster: boolean = false;
    /** 引导 step0：用户已点击开始区域 */
    private guideStartClicked: boolean = false;
    private greenArrow: Node = null;
    /**
     * 缓存：某个引导节点是否需要显示绿箭头
     * 约定：只要没有显式设置为 true，就不显示（更通用）
     */
    private guideGreenArrowCache: Map<Node, boolean> = new Map();
    protected onLoad(): void {
        GameInfo.instance.guideMgr = this;
        GameInfo.step = 0;
    }
    start() {
    }
    onGuideStep(isClearLast: boolean = true) {
        if (isClearLast) {
            this.curNode = null;
            if (GuideLineCtrl.instance) {
                GuideLineCtrl.instance.setTarget(null, false);
            }
            this.clearAllGreenArrowFlags();
        }
        if (this.curNode_priority.length == 0) {
            if (GuideLineCtrl.instance) {
                GuideLineCtrl.instance.setTarget(null, false);
            }
        }
        this.inGuideChangeStatus = true;
        switch (GameInfo.step) {
            case 0:
                GameInfo.instance.Begin = true;
                GameInfo.instance.Pause = false;
                GameInfo.instance.Over = false;
                GameInfo.instance.monsterMgr.spawnAllGuideMonsters();
                this.scheduleOnce(() => {
                    GameInfo.instance.viewMgr.showHandAni(true);
                    GameInfo.instance.viewMgr.startClickNode.active = true;
                }, 0.5);
                break;
            case 1:
                app.event.emit(CommonEvent.ShowJoystick);
                GameInfo.instance.monsterMgr.createGuideMonster();
                GameInfo.instance.gameMgr.GameStart();
                break;
            case 2:
                GameInfo.instance.player.enterSquadCombat();
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            case 7:
                // 胜利结算由结束阶段钓鱼机动画结束后触发 GameOver(true)
                break;
        }
        GameInfo.step++;
        this.timer = 0;
        this.inGuideChangeStatus = false;
    }
    private timer: number = 2;
    update(dt: number) {
        this.timer -= dt;
        if (this.timer <= 0) {
            this.timer = 1;
            if (GuideLineCtrl.instance) {
                if (this.inGuideChangeStatus) return;
                this.checkGuideArrow();
            }
        }
    }
    /**是否显示指引箭头 */
    checkGuideArrow() {
        if (this.curNode_priority.length > 0) { //优先引导
            const target = this.curNode_priority[0];
            GuideLineCtrl.instance.setTarget(target, this.shouldShowGreenArrow(target));
        }
        else if (this.curNode) {
            // //主线引导
            const target = this.curNode;
            GuideLineCtrl.instance.setTarget(target, this.shouldShowGreenArrow(target));
        }
        else {
            GuideLineCtrl.instance.setTarget(null, false);
        }
    }

    /**是否显示绿箭头：完全由外部显式标记控制 */
    private shouldShowGreenArrow(target: Node): boolean {
        if (!target) return false;
        return this.guideGreenArrowCache.get(target) === true;
    }

    /**统一入口：设置某节点是否显示绿箭头（可在此处加入特殊判断逻辑） */
    public setGreenArrowFlag(node: Node, enabled: boolean) {
        if (!node) return;
        // 预留：后续可加特殊判定/修正逻辑
        if (enabled) {
            this.guideGreenArrowCache.set(node, true);
        } else {
            this.guideGreenArrowCache.delete(node);
            //需要清除箭头对象
            GuideLineCtrl.instance.setTarget(null, false);
        }
    }

    /**统一入口：清理所有绿箭头标记 */
    public clearAllGreenArrowFlags() {
        this.guideGreenArrowCache.clear();
    }
    /**设置最优先级引导, 不会重复设置相同node, 若要重排优先级, 使用setPriorityGuideFisrt */
    setPriorityGuide(node: Node) {
        if (this.curNode_priority.includes(node)) return;
        this.curNode_priority.push(node);
        GuideLineCtrl.instance.setTarget(this.curNode_priority[0], this.shouldShowGreenArrow(this.curNode_priority[0]));
        this.timer = 0;
    }
    /**取消最优先引导节点 */
    resetPriorityGuide(node: Node) {
        let index = this.curNode_priority.indexOf(node);
        if (index > -1) {
            this.curNode_priority.splice(index, 1)
            this.setGreenArrowFlag(node, false);
        }
        this.timer = 0;
    }
    /**强制修改 当前优先引导节点 */
    setPriorityGuideFisrt(node: Node) {
        // 不删除替换原有节点, 而是在第一个位置插入node, 保证优先级引导的顺序, 如果node已经在优先引导列表中, 则先清理, 再重新添加到第一个位置
        let index = this.curNode_priority.indexOf(node);
        if (index > -1) {
            this.curNode_priority.splice(index, 1);
        }
        this.curNode_priority.unshift(node);
        let ele = this.curNode_priority[0];
        GuideLineCtrl.instance.setTarget(ele, this.shouldShowGreenArrow(ele));
    }
    /**清除所有优先引导节点 */
    clearAllPriorityGuide() {
        this.curNode_priority.length = 0;
        this.clearAllGreenArrowFlags();
        this.checkGuideArrow();
    }

    /** 引导 step0：用户点击开始区域 */
    public onGuideStartClick() {
        GameInfo.instance.viewMgr.showHandAni(false);
        if (GameInfo.instance.viewMgr.startClickNode) {
            GameInfo.instance.viewMgr.startClickNode.active = false;
        }
        this.guideStartClicked = true;
        this.tryAdvanceGuideStep1();
    }

    /** 链头 Tire 到达 slot[0] 且用户已点击时，进入 step1 显示方向舵 */
    public tryAdvanceGuideStep1() {
        if (!this.guideStartClicked || GameInfo.step !== 1) {
            return;
        }
        if (!GameInfo.instance.collectionMgr?.isHeadTireAtSlot0()) {
            return;
        }
        this.guideStartClicked = false;
        this.onGuideStep();
    }

    destroySelf() {
        if (GameInfo.instance.guideMgr === this) {
            GameInfo.instance.guideMgr = null;
        }
        if (this.isValid)
            this.destroy();
    }
}


