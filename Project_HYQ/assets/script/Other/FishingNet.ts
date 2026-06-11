import { _decorator, Collider, Component, easing, ITriggerEvent, Node, Tween, tween, v3, Vec3 } from 'cc';

import { CharAnimationModel } from '../CharacterCtrl/CharAnimationModel';

import { ColliderGroupTag, ComponentEvent, PrefabPathEnum } from '../Common/CommonEnum';

import { GameInfo } from '../Common/GameInfo';

import { ColliderTag } from './ColliderTag';

import { RolePeople } from '../Battle/RolePeople';
import FlyManager from '../Manager/FlyManager';



const { ccclass, property } = _decorator;



type NetAnimPhase = 'catch' | 'open' | '';



/**

 * 机器渔网：垂直鱼线 + catch 检测 + 收线 + open 放开；与 BuildFishingMachine 强耦合。

 */

@ccclass('FishingNet')

export class FishingNet extends Component {

    @property({ type: Node, displayName: '根节点' })

    Root: Node = null;

    @property({ type: Node, displayName: '鱼线(动画节点)' })

    fishingLine: Node = null;

    @property({ type: Node, displayName: '鱼线末端' })

    fishingLineEnd: Node = null;

    @property({ type: Node, displayName: '渔网节点' })

    fishingNet: Node = null;

    @property({ type: [Node], displayName: '渔网挂点' })

    netHookPoint: Node[] = [];

    animComp: CharAnimationModel = null;



    @property({ type: ColliderGroupTag, displayName: '视为可中鱼的标签' })

    detectTag: ColliderGroupTag = ColliderGroupTag.People;
    @property({ type: Node, displayName: '渔网模型' })
    netModel: Node = null;

    netCollider: Collider = null!;



    private _perCatchCount: number = 1;
    //NOTE: 工人自动化为 true 时跳过 Hero 准心缩放反馈（playIndicatorAnim）
    private _skipIndicatorFeedback: boolean = false;

    private _sessionActive: boolean = false;

    private readonly _seenOtherUuids: Set<string> = new Set();

    private readonly _seenOtherNodes: Node[] = [];

    /** people 回收后在同位置生成的 COIN_EGG，open 阶段 ItemFlyToStack */
    private readonly _spawnedEggNodes: Node[] = [];

    private readonly _usedHookIndices = new Set<number>();

    private readonly _enableColliderBound = this._enableColliderAfterDelay.bind(this);

    private readonly _endWindowBound = this._endDetectionWindow.bind(this);



    private _currentAnimPhase: NetAnimPhase = '';

    private _watchCatchProgress: boolean = false;

    private _watchOpenProgress: boolean = false;

    private _jumpOutTriggered: boolean = false;

    /** open 倒放已离开起始高位，避免 catch 已停时 progress=0 误触发跳出 */
    private _openProgressPrimed: boolean = false;

    private _detectStarted: boolean = false;



    private _catchPhaseCallback: ((success: boolean, count: number) => void) | null = null;

    private _catchDetectDone: boolean = false;

    private _catchGatherDone: boolean = false;

    private _catchDetectSuccess: boolean = false;

    private _catchDetectCount: number = 0;

    private _catchFeedbackDone: boolean = false;

    // private _fallbackWorldPos: Vec3 = v3();



    private _openCompleteCallback: (() => void) | null = null;

    // private _lineCastCompleteCallback: (() => void) | null = null;

    private _lineReelCompleteCallback: (() => void) | null = null;

    private readonly _openFallbackBound = this._finishOpenPhase.bind(this);

    private readonly _syncScratch = v3();

    /** catch 放线：进度 0~0.8 映射 scaleY 0.1→1.5 */
    private CATCH_LINE_SCALE_MIN = 0.1;
    private CATCH_LINE_SCALE_MAX = 1.525;
    private static readonly CATCH_LINE_FULL_PROGRESS = 0.8;
    private static readonly CATCH_DETECT_START_PROGRESS = 0.8;
    private static readonly CATCH_DETECT_WINDOW_RATIO = 0.2;
    private static readonly OPEN_REVERSE_TIME_SCALE = 2;



    protected onLoad(): void {

        if (this.fishingNet?.isValid) {

            this.netCollider = this.fishingNet.getChildByName('col').getComponent(Collider);

            if (this.netCollider) {

                this.netCollider.on('onTriggerEnter', this._onTriggerEnter, this);

                this.netCollider.node.active = false;

            }

        }

        if (this.Root?.isValid) {

            this.Root.active = true;

        }

        this.animComp = this.node.getComponent(CharAnimationModel);

        this.node.on(ComponentEvent.OnAnimationComplete, this._onAnimationComplete, this);


    }
    /** 配置鱼线伸长和收回时长 */
    public initData(minScale: number = 0.1, maxScale: number = 1.525): void {
        this.CATCH_LINE_SCALE_MIN = minScale;
        this.CATCH_LINE_SCALE_MAX = maxScale;
        if (maxScale == 1.525) {
            //NOTE: 特殊处理, 渔网默认大小
            this.netModel.setScale(v3(1, 0.5, 1));
            //初始化
            this.fishingLine.setScale(v3(1, this.CATCH_LINE_SCALE_MIN, 1));
        } else {
            this.fishingLine.setScale(v3(2, this.CATCH_LINE_SCALE_MIN, 2));
        }
    }


    /** 将根节点世界变换对齐到机械臂末端挂点 */

    public syncRootToAnchor(anchor: Node): void {

        const root = this.Root?.isValid ? this.Root : this.node;

        if (!root?.isValid || !anchor?.isValid) return;

        anchor.getWorldPosition(this._syncScratch);

        root.setWorldPosition(this._syncScratch);

        root.setWorldRotation(anchor.worldRotation);

    }



    protected onDestroy(): void {

        this.node.off(ComponentEvent.OnAnimationComplete, this._onAnimationComplete, this);

    }



    protected update(_dt: number): void {

        if (!this.animComp) return;

        if (this._watchCatchProgress) {

            const progress = this.animComp.getCurAnimationProgress();

            this._syncLineScaleByCatchProgress(progress);

            if (!this._detectStarted && progress >= FishingNet.CATCH_DETECT_START_PROGRESS) {

                this._detectStarted = true;

                const catchDur = this.animComp.getAnimationDuration('catch');

                const windowSec = catchDur > 0

                    ? catchDur * FishingNet.CATCH_DETECT_WINDOW_RATIO

                    : 0.2;

                this._startDetection(windowSec);

            }

        }

        if (this._watchOpenProgress && !this._jumpOutTriggered) {

            // open 倒放 catch，须读具名状态；getCurAnimationProgress 在倒放时不更新
            const progress = this.animComp.getNamedAnimationProgress('catch');

            if (!this._openProgressPrimed) {

                if (progress >= 0.5) {

                    this._openProgressPrimed = true;

                }

                return;

            }

            // open 倒放 catch，进度从 1 → 0，在 0.2 时跳出
            if (progress <= 0.2) {
                this._jumpOutTriggered = true;
                this._jumpOutAllCaught();

            }

        }

    }



    public setPerCatchCount(count: number): void {

        this._perCatchCount = Math.max(1, Math.floor(count));

    }

    //NOTE: 工人 unlockWorker 时设为 true；Hero 机器流程保持默认 false
    /** 工人自动模式：不依赖 TrackManager 准心动画 */
    public setSkipIndicatorFeedback(skip: boolean): void {
        this._skipIndicatorFeedback = skip;
    }



    // public getCatchOnceCount(): number {
    //
    //     return this._perCatchCount;
    //
    // }



    // public getCaughtNodes(): readonly Node[] {
    //
    //     return this._seenOtherNodes;
    //
    // }



    // /** 垂直放下鱼线 scale.y 0.1 → 1.5，结束后回调（已改为 catch 动画进度驱动放线，不再单独调用） */
    //
    // public playLineCast(_worldAim: Readonly<Vec3>, onLineComplete?: () => void): void {
    //
    //     this._lineCastCompleteCallback = onLineComplete ?? null;
    //
    //     this.stopLineVisualTweens();
    //
    //     const line = this.fishingLine;
    //
    //     if (!line?.isValid) {
    //
    //         this.scheduleOnce(this._notifyLineCastComplete, 0);
    //
    //         return;
    //
    //     }
    //
    //
    //
    //     const sx = line.scale.x;
    //
    //     const sz = line.scale.z;
    //
    //     line.setScale(v3(sx, 0.1, sz));
    //
    //     this._updateNetPos();
    //
    //     if (this.fishingNet?.isValid) {
    //
    //         this.fishingNet.active = true;
    //
    //     }
    //
    //
    //
    //     tween(line)
    //
    //         .to(0.2, { scale: v3(sx, 1.5, sz) }, {
    //
    //             easing: easing.sineOut,
    //
    //             onUpdate: () => this._updateNetPos(),
    //
    //         })
    //
    //         .call(() => {
    //
    //             this._updateNetPos();
    //
    //             this._notifyLineCastComplete();
    //
    //         })
    //
    //         .start();
    //
    // }



    /** 回收鱼线 scale.y 1.5 → 0.1，结束后回调 */

    public playLineReel(onComplete?: () => void): void {

        this._lineReelCompleteCallback = onComplete ?? null;

        this.stopLineVisualTweens();

        const line = this.fishingLine;

        if (!line?.isValid) {

            this.scheduleOnce(this._notifyLineReelComplete, 0);

            return;

        }



        const sx = line.scale.x;

        const sz = line.scale.z;

        tween(line)

            .to(0.2, { scale: v3(sx, 0.1, sz) }, {

                easing: easing.sineIn,

                onUpdate: () => this._updateNetPos(),

            })

            .call(() => {

                this._updateNetPos();

                this._notifyLineReelComplete();

            })

            .start();

    }



    /**

     * catch 阶段：播 catch 与放线同步 → 进度 0.8 鱼线满长并开检测(0.2) → 命中冻结 → 挂网 + 准心反馈 → 动画结束回调

     */

    public playCatchPhase(fallbackWorldPos: Readonly<Vec3>, onPhaseComplete: (success: boolean, count: number) => void): void {

        this._catchPhaseCallback = onPhaseComplete;

        this._catchDetectDone = false;

        this._catchGatherDone = false;

        this._catchFeedbackDone = false;

        this._catchDetectSuccess = false;

        this._catchDetectCount = 0;

        this._detectStarted = false;

        this._watchCatchProgress = false;

        this._watchOpenProgress = false;

        this._jumpOutTriggered = false;

        this._openProgressPrimed = false;

        this._currentAnimPhase = '';

        this.unschedule(this._openFallbackBound);

        // this._fallbackWorldPos.set(fallbackWorldPos);



        this._prepareLineForCast();

        if (!this.animComp) {

            const fallbackCatchDur = 1;

            this.scheduleOnce(() => {

                if (!this._detectStarted) {

                    this._detectStarted = true;

                    this._startDetection(fallbackCatchDur * FishingNet.CATCH_DETECT_WINDOW_RATIO);

                }

            }, fallbackCatchDur * FishingNet.CATCH_DETECT_START_PROGRESS);

            this.scheduleOnce(() => this._onCatchAnimFinished(), fallbackCatchDur);

            return;

        }



        this._currentAnimPhase = 'catch';

        this._watchCatchProgress = true;
        this.animComp.playAnimation('catch', false, 1, 0.12, false);

    }



    /** 播 open 动画，结束 JumpOutWater 并回调 */

    public playOpenPhase(onComplete?: () => void): void {

        this._openCompleteCallback = onComplete ?? null;

        if (!this.animComp) {

            // this._jumpOutAllCaught();

            this.scheduleOnce(this._notifyOpenComplete, 0);

            return;

        }

        this._currentAnimPhase = 'open';

        this._jumpOutTriggered = false;

        this._openProgressPrimed = false;

        const openSpeed = FishingNet.OPEN_REVERSE_TIME_SCALE;
        this.animComp.playReverseAnimation('catch', false, openSpeed, 0);

        this._watchOpenProgress = true;

        const dur = this.animComp.getAnimationDuration('catch');

        this.unschedule(this._openFallbackBound);

        if (dur > 0) {

            this.scheduleOnce(this._openFallbackBound, dur / openSpeed);

        } else {

            this.scheduleOnce(this._openFallbackBound, 0.2 / openSpeed);

        }

    }



    public stopLineVisualTweens(): void {

        if (this.fishingLine?.isValid) {

            Tween.stopAllByTarget(this.fishingLine);

        }

    }



    public cancelAll(): void {

        this.unscheduleAllCallbacks();

        this.cancelDetection();

        this._resetLineVisual();

        this._watchCatchProgress = false;

        this._watchOpenProgress = false;

        this._jumpOutTriggered = false;

        this._openProgressPrimed = false;

        this._currentAnimPhase = '';

        this._catchPhaseCallback = null;

        this._catchFeedbackDone = false;

        this._openCompleteCallback = null;

        // this._lineCastCompleteCallback = null;

        this._lineReelCompleteCallback = null;

        this.unschedule(this._openFallbackBound);

        this._clearSpawnedEggs();

        this.animComp?.stopAllAnimations();

        if (this.netCollider?.isValid) {

            this.netCollider.node.active = false;

        }

    }



    /** catch 开始前初始化鱼线（与 catch 动画同步放线，不再单独 tween） */
    private _prepareLineForCast(): void {

        this.stopLineVisualTweens();

        const line = this.fishingLine;

        if (!line?.isValid) return;

        const sx = line.scale.x;

        const sz = line.scale.z;

        line.setScale(v3(sx, this.CATCH_LINE_SCALE_MIN, sz));

        this._updateNetPos();

        if (this.fishingNet?.isValid) {

            this.fishingNet.active = true;

        }

    }



    /** 按 catch 动画进度同步鱼线 scaleY（0~0.8 → 0.1~1.5） */
    private _syncLineScaleByCatchProgress(progress: number): void {

        const line = this.fishingLine;

        if (!line?.isValid) return;

        const sx = line.scale.x;

        const sz = line.scale.z;

        const t = Math.min(1, progress / FishingNet.CATCH_LINE_FULL_PROGRESS);

        const sy = this.CATCH_LINE_SCALE_MIN

            + (this.CATCH_LINE_SCALE_MAX - this.CATCH_LINE_SCALE_MIN) * t;

        line.setScale(v3(sx, sy, sz));

        this._updateNetPos();

    }



    private _resetLineVisual(): void {

        this.stopLineVisualTweens();

        const line = this.fishingLine;

        if (line?.isValid) {

            const sx = line.scale.x;

            const sz = line.scale.z;

            line.setScale(v3(sx, 0.1, sz));

        }

        this._updateNetPos();

    }



    public cancelDetection(): void {

        this.unschedule(this._enableColliderBound);

        this.unschedule(this._endWindowBound);

        if (this.netCollider?.isValid) {

            this.netCollider.node.active = false;

        }

        this._sessionActive = false;

        this._usedHookIndices.clear();

    }



    private _updateNetPos(): void {

        if (!this.fishingNet?.isValid || !this.fishingLineEnd?.isValid) return;

        const w = this.fishingLineEnd.worldPosition;

        this.fishingNet.setWorldPosition(w.x, w.y, w.z);

    }



    // private _notifyLineCastComplete(): void {
    //
    //     const cb = this._lineCastCompleteCallback;
    //
    //     this._lineCastCompleteCallback = null;
    //
    //     cb?.();
    //
    // }



    private _notifyLineReelComplete(): void {

        const cb = this._lineReelCompleteCallback;

        this._lineReelCompleteCallback = null;

        cb?.();

    }



    private _startDetection(durationSec?: number): void {

        if (!this.netCollider) {

            this._finishDetectPhase(false, 0);

            return;

        }

        this.cancelDetection();

        const duration = durationSec ?? 0.1;

        if (duration <= 0) {

            this._finishDetectPhase(false, 0);

            return;

        }

        this._sessionActive = true;

        this._seenOtherUuids.clear();

        this._seenOtherNodes.length = 0;

        this._usedHookIndices.clear();

        this.netCollider.node.active = false;

        this.scheduleOnce(this._enableColliderBound, 0);

        this.scheduleOnce(this._endWindowBound, duration);
        //结算表现阶段此处需要播放一次水面特效
        if (GameInfo.instance.buildingMgr.buildFishingMachineEnd.node.active) {
            GameInfo.instance.buildingMgr.buildFishingMachineEnd?.playWaterEffect(true);
        }
    }



    private _enableColliderAfterDelay(): void {

        if (!this._sessionActive || !this.netCollider?.isValid) return;

        this.netCollider.node.active = true;

    }



    private _endDetectionWindow(): void {

        if (!this._sessionActive) return;

        const count = this._seenOtherUuids.size;

        this._finishDetectPhase(count > 0, count);

    }



    private _finishDetectPhase(success: boolean, count: number): void {

        if (this._sessionActive) {

            this.unschedule(this._enableColliderBound);

            this.unschedule(this._endWindowBound);

            this._sessionActive = false;

            if (this.netCollider?.isValid) {

                this.netCollider.node.active = false;

            }

        }

        this._catchDetectDone = true;

        this._catchDetectSuccess = success;

        this._catchDetectCount = count;

        if (success && count > 0) {

            this._playCatchSuccessFeedback();

        } else {

            this._catchFeedbackDone = true;

            this._tryFinishCatchPhase();

        }

    }



    /** 抓取表现：挂网移向挂点，与准心缩放反馈并行 */

    private _playCatchSuccessFeedback(): void {

        this._gatherCaughtToNet();
        GameInfo.instance.trackMgr?.playWaterEffect(2);
        //NOTE: 工人自动化分支；Hero 走 playIndicatorAnim 准心反馈
        if (this._skipIndicatorFeedback) {
            this._catchFeedbackDone = true;
            this._tryFinishCatchPhase();
            return;
        }
        GameInfo.instance.trackMgr?.playIndicatorAnim(() => {

            this._catchFeedbackDone = true;

            this._tryFinishCatchPhase();

        });

    }



    private _gatherCaughtToNet(): void {

        for (const catchNode of this._seenOtherNodes) {

            this._snapCaughtToNet(catchNode);

        }

    }



    private _onCatchAnimFinished(): void {

        this._watchCatchProgress = false;

        if (this._sessionActive) {

            const count = this._seenOtherUuids.size;

            this._finishDetectPhase(count > 0, count);

        }

        this._catchGatherDone = true;

        this._tryFinishCatchPhase();

    }



    private _tryFinishCatchPhase(): void {

        if (!this._catchDetectDone || !this._catchGatherDone || !this._catchFeedbackDone) return;

        const cb = this._catchPhaseCallback;

        this._catchPhaseCallback = null;

        cb?.(this._catchDetectSuccess, this._catchDetectCount);

    }



    private _onAnimationComplete(animName?: string): void {

        if (this._currentAnimPhase === 'catch' && animName === 'catch') {

            this._currentAnimPhase = '';

            this._onCatchAnimFinished();

            return;

        }

        // open 阶段倒放 catch，完成事件名仍为 catch

        if (this._currentAnimPhase === 'open' && (animName === 'catch' || animName === 'open')) {

            this._finishOpenPhase();

        }

    }



    private _finishOpenPhase(): void {

        if (this._currentAnimPhase !== 'open') return;

        this._currentAnimPhase = '';

        this.unschedule(this._openFallbackBound);

        this._watchOpenProgress = false;

        this._openProgressPrimed = false;

        // this._jumpOutAllCaught();

        this._notifyOpenComplete();

    }



    /** 渔网组件根节点（与机械臂同步的 Root） */

    private _getNetRootNode(): Node {

        return this.fishingNet?.isValid ? this.fishingNet : this.node;

    }



    /** 命中瞬间：挂到渔网节点，当场读最近未占用挂点世界坐标，转局部坐标后 tween */

    private _snapCaughtToNet(catchNode: Node): void {

        if (!catchNode?.isValid) return;

        const people = catchNode.getComponent(RolePeople);

        if (people) {

            people.stopMove();

            people.isMoving = false;

        }

        Tween.stopAllByTarget(catchNode);



        let bestHook: Node | null = null;

        let bestIdx = -1;

        let bestDistSqr = Infinity;

        const np = catchNode.worldPosition;

        const points = this.netHookPoint;

        for (let i = 0; i < points.length; i++) {

            const hook = points[i];

            if (!hook?.isValid || this._usedHookIndices.has(i)) continue;

            const dSqr = Vec3.squaredDistance(np, hook.worldPosition);

            if (dSqr < bestDistSqr) {

                bestDistSqr = dSqr;

                bestIdx = i;

                bestHook = hook;

            }

        }

        if (bestHook) {

            this._usedHookIndices.add(bestIdx);

            catchNode.setParent(bestHook, true);

        } else {

            const netRoot = this._getNetRootNode();
            const center = netRoot.getChildByName('center');
            if (center?.isValid) {
                catchNode.setParent(center, true);
            } else {
                catchNode.setParent(netRoot, true);
            }
        }
        //同时缩放大小和位置
        tween(catchNode)
            .to(0.2, { position: v3(0, 0, 0), scale: v3(0.5, 0.5, 0.5) }, { easing: easing.smooth })
            .call(() => {
                this._recyclePeopleAndSpawnEgg(catchNode);
            })
            .start();

    }

    /** people tween 结束后回收，并在渔网挂点生成 COIN_EGG（随网移动；open 阶段再飞向堆叠） */
    private _recyclePeopleAndSpawnEgg(peopleNode: Node): void {
        if (!peopleNode?.isValid) return;

        const hookParent = peopleNode.parent;
        const localPos = peopleNode.position.clone();
        const localScale = peopleNode.scale.clone();
        Tween.stopAllByTarget(peopleNode);

        const people = peopleNode.getComponent(RolePeople);
        if (people) {
            GameInfo.instance.buildingMgr.removePeople(people);
        }

        GameInfo.instance.prefabMgr.recoverPrefab(peopleNode);

        const egg = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.COIN_EGG);
        if (!egg?.isValid || !hookParent?.isValid) return;

        egg.setParent(hookParent);
        egg.setPosition(localPos);
        egg.setScale(localScale);
        this._spawnedEggNodes.push(egg);

        // open 阶段已触发飞行时，晚生成的 egg 立即补飞
        if (this._jumpOutTriggered) {
            const idx = this._spawnedEggNodes.indexOf(egg);
            if (idx >= 0) {
                this._spawnedEggNodes.splice(idx, 1);
            }
            this._flyEggToStack(egg);
        }
    }

    private _flyEggToStack(egg: Node): void {
        if (!egg?.isValid) return;

        Tween.stopAllByTarget(egg);
        //NOTE: 重新设置父节点前需要记录世界坐标, 重设后需要重新设置, 否则节点有时候会导致局部坐标错乱
        const worldPos = egg.worldPosition.clone();
        egg.setParent(GameInfo.instance.gameMgr.gameLayer);
        egg.setWorldPosition(worldPos);
        egg.setScale(1, 1, 1);
        this.ItemFlyToStack(egg, 0, 2);
    }

    private _clearSpawnedEggs(): void {
        for (const egg of this._spawnedEggNodes) {
            if (egg?.isValid) {
                GameInfo.instance.prefabMgr.recoverPrefab(egg);
            }
        }
        this._spawnedEggNodes.length = 0;
    }



    private _jumpOutAllCaught(): void {

        const eggs = [...this._spawnedEggNodes];
        this._spawnedEggNodes.length = 0;
        eggs.forEach(egg => this._flyEggToStack(egg));

        this._seenOtherNodes.length = 0;

        this._seenOtherUuids.clear();

        this._usedHookIndices.clear();

    }



    private _notifyOpenComplete(): void {

        const cb = this._openCompleteCallback;

        this._openCompleteCallback = null;

        cb?.();

    }



    private _onTriggerEnter(event: ITriggerEvent): void {

        if (!this._sessionActive) return;

        const other = event.otherCollider;

        if (!other?.node?.isValid) return;

        const tagComp = other.node.getComponent(ColliderTag);

        if (!tagComp || tagComp.tag !== this.detectTag) return;

        const id = other.node.uuid;

        if (this._seenOtherUuids.has(id)) return;

        this._seenOtherNodes.push(other.node);

        const people = other.node.getComponent(RolePeople);

        if (people) {

            people.setFreeze(true);

        }

        this._seenOtherUuids.add(id);

        if (this._seenOtherUuids.size >= this._perCatchCount) {

            this._finishDetectPhase(true, this._seenOtherUuids.size);

        }

    }
    ItemFlyToStack(egg: Node, jumpHeight: number, jumpSpeed: number) {
        let localPos = GameInfo.instance.buildingMgr?.fishingStack.preprocessData();
        FlyManager.Ins.createFly(egg, GameInfo.instance.buildingMgr?.fishingStack.root, localPos, jumpHeight, () => {
            if (egg) {
                GameInfo.instance.buildingMgr?.fishingStack.addItem(egg);

            }
        }, jumpSpeed, 0, v3(0, 0, 0), false, v3(1, 1, 1));
    }
}


