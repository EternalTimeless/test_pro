import { _decorator, CCFloat, Component, Node, Sprite } from 'cc';
import { ColliderGroupTag } from '../Common/CommonEnum';
import { GameInfo } from '../Common/GameInfo';

const { ccclass, property } = _decorator;

/** 允许的交互碰撞标签(钓鱼点/钓鱼机/生产点) */
const INTERACTION_ZONE_TAGS: ReadonlySet<ColliderGroupTag> = new Set([
    ColliderGroupTag.FishingSpot,
    ColliderGroupTag.FishingMachine,
    ColliderGroupTag.ProduceSpot,
    ColliderGroupTag.RecruitSoldier,
]);
/** 进度条交互：蓄力逻辑相同；autoResetAfterComplete 为 true 时满进度只触发一轮回调并清空状态，由外部持续 beginInteraction 进入下一轮 */
@ccclass('BuildInteraction')
export class BuildInteraction extends Component {
    @property({ type: Node, displayName: '交互节点' })
    public interactionNode: Node = null;
    private progress: Sprite = null;
    @property({ type: CCFloat, displayName: '进入交互所需阈值(秒)' })
    private interactionTime: number = 1;
    @property({ type: CCFloat, displayName: '交互结束后的冷却(秒)' })
    private interactionCooldown: number = 0.1;
    /** 为 true：满进度执行回调后立刻重置(不进入会话、不等 exit)；为 false：原有钓鱼式会话 */
    @property({ displayName: '完成即重置(连续多轮)' })
    private autoResetAfterComplete: boolean = false;

    private curTimer: number = 0;
    /** 本次 beginInteraction 的碰撞标签（供退出按钮等判定交互类型） */
    private _interactionSourceTag: ColliderGroupTag | undefined = undefined;
    /** 蓄力阶段：计时填充进度条 */
    private _charging: boolean = false;
    /** 已触发回调，等待玩家点退出 */
    private _sessionActive: boolean = false;
    /** 是否在交互流程中(蓄力或会话) */
    public isInteracting: boolean = false;
    private _cb: () => void = null;
    private _cooldownUntilSec: number = 0;

    onLoad() {
        this.progress = this.interactionNode.getChildByName('progress').getComponent(Sprite);
        if (!this.progress) {
            return;
        }
        this.progress.fillRange = 0;
    }

    /** 是否为允许开始交互的碰撞标签 */
    public static isInteractionZoneTag(tag: ColliderGroupTag): boolean {
        return INTERACTION_ZONE_TAGS.has(tag);
    }

    private _nowSec(): number {
        return performance.now() * 0.001;
    }

    private _resetInteractionState(applyCooldown: boolean): void {
        this._charging = false;
        this._sessionActive = false;
        this.isInteracting = false;
        this.curTimer = 0;
        if (this.progress) {
            this.progress.fillRange = 0;
        }
        this._cb = null;
        this._interactionSourceTag = undefined;
        if (applyCooldown && this.interactionCooldown > 0) {
            this._cooldownUntilSec = this._nowSec() + this.interactionCooldown;
        }
    }

    public getInteractionSourceTag(): ColliderGroupTag | undefined {
        return this._interactionSourceTag;
    }

    /** 仅蓄力未满、尚未进入会话 */
    public isChargingOnly(): boolean {
        return this._charging && !this._sessionActive;
    }

    /**
     * 蓄力未满离开范围：只清空进度与蓄力，不结束已建立会话、不联动钓鱼等全局重置
     */
    public cancelChargingOnly(): void {
        if (!this._charging || this._sessionActive) {
            return;
        }
        this._charging = false;
        this.isInteracting = false;
        this.curTimer = 0;
        if (this.progress) {
            this.progress.fillRange = 0;
        }
        this._cb = null;
        this._interactionSourceTag = undefined;
    }

    /** 蓄力满：触发回调；autoResetAfterComplete 时回调后重置，否则进入会话直至 exitInteraction */
    notifyInteraction() {
        if (!this._charging) {
            return;
        }
        this._charging = false;
        if (this.autoResetAfterComplete) {
            if (this.progress) {
                this.progress.fillRange = 1;
            }
            this._cb?.();
            this._resetInteractionState(true);
            // NOTE: 冷却期内外部仍持续 begin 会被挡掉，表现为轮间间隔；不需要可把 interactionCooldown 调为 0。
            // NOTE: 若回调内异步改状态或与同帧下一次 begin 交织，可能出现竞态；当前假定外部单纯每帧/Stay 调用。
            return;
        }
        this._sessionActive = true;
        this.isInteracting = true;
        if (this.progress) {
            this.progress.fillRange = 1;
        }
        this._cb?.();
    }

    /** 退出交互（含 UI 按钮、外部调用） */
    exitInteraction() {
        GameInfo.instance.trackMgr?.detachBuildInteractionIfCurrent(this);
        this._resetInteractionState(false);
    }

    /**
     * 进入范围触发交互
     * @param cb 交互内容回调
     * @param sourceTag 碰撞标签；传入时须为 FishingSpot/FishingMachine/ProduceSpot
     */
    beginInteraction(sourceTag?: ColliderGroupTag, cb?: () => void) {
        if (sourceTag !== undefined && !INTERACTION_ZONE_TAGS.has(sourceTag)) {
            return;
        }
        if (this._sessionActive) {
            return;
        }
        if (this._charging) {
            return;
        }
        if (this._nowSec() < this._cooldownUntilSec) {
            return;
        }
        this._interactionSourceTag = sourceTag;
        this.curTimer = 0;
        if (this.progress) {
            this.progress.fillRange = 0;
        }
        this._charging = true;
        this.isInteracting = true;
        this._cb = cb;
    }

    /** 获取交互位置 */
    public getInteractionPos() {
        return this.interactionNode.getPosition();
    }

    protected update(dt: number): void {
        if (this._sessionActive) {
            if (this.progress) {
                this.progress.fillRange = 1;
            }
            return;
        }
        if (!this._charging) {
            return;
        }
        this.curTimer += dt;
        if (this.progress) {
            this.progress.fillRange = Math.min(1, this.curTimer / this.interactionTime);
        }
        if (this.curTimer >= this.interactionTime) {
            this.notifyInteraction();
        }
    }
}
