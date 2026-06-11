import { _decorator, Component, Node, Sprite, Vec3, v3, easing, tween, ParticleSystem } from 'cc';

import { GameInfo, SceneType } from '../Common/GameInfo';

import { VirtualInput } from '../Common/VirtualInput';

import { CameraCtrl } from '../CharacterCtrl/CameraCtrl';

import { AimTrajectoryView } from './AimTrajectoryView';

import { ColliderGroupTag, CommonEvent } from '../Common/CommonEnum';

import { BuildInteraction } from '../Building/BuildInteraction';
import { BuildFishingMachine } from '../Building/BuildMachine';



const { ccclass, property } = _decorator;



/** 瞄准模式：鱼竿弧线 / 机器无轨迹 */

export enum AimMode {

    HeroFishing = 0,

    MachineFishing = 1,

}



@ccclass('TrackManager')

export class TrackManager extends Component {

    @property({ type: Node, displayName: '瞄准轨迹父节点' })

    trackRoot: Node = null!;

    /**瞄准轨迹起点 */

    startPoint: Node = null!;



    @property({ type: Node, displayName: '移动范围中心点(矩形)' })

    indicatorRangeCenter: Node = null!;

    @property({ displayName: '移动范围半径(矩形X)' })

    indicatorRangeX: number = 10;

    @property({ displayName: '移动范围半径(矩形Z)' })

    indicatorRangeZ: number = 10;

    @property({ type: Node, displayName: '瞄准准心' })

    /**准心指示器, 瞄准轨迹终点 */

    indicator: Node = null!;

    indicatorOriginalScale: Vec3 = v3();

    /**钓鱼动作的进度条填充 */

    progressFill: Sprite = null!;



    /** 处于瞄准阶段：准心随摇杆在世界 XZ 上移动（由 VirtualInput） */

    isTakeAim: boolean = false;



    /** 准心移动速度（单位：与世界单位一致） */

    @property({ displayName: '准心移动速度' })

    moveSpeed: number = 4.5;



    /** 钓鱼据点内禁用 Hero 摇杆走位（闲置摆动等），由触发器或非本脚本逻辑置位 */

    lockHeroJoystickInFishingZone: boolean = false;



    /** 未进入精确瞄准时：准心在两端间正弦往复（需在据点内并已指定两端节点） */

    @property({ displayName: '闲置时准心摆动' })

    oscillateIndicatorWhileIdle: boolean = false;

    @property({ type: Node, displayName: '闲置摆动起点' })

    idleSwingPointA: Node = null!;

    @property({ type: Node, displayName: '闲置摆动终点' })

    idleSwingPointB: Node = null!;

    @property({ displayName: '闲置摆动角速度', tooltip: '乘 dt 后与 sin 相位累积' })

    idleOscillationSpeed: number = 1.5;



    @property({ displayName: 'FlyManager flyType(弧线形态)', tooltip: '与飞行物一致的贝塞尔形态枚举' })

    aimFlyType: number = 0;

    @property({ displayName: '瞄准弧线半径', tooltip: '传给 FlyManager.getControlPoint 的 radius' })

    aimCurveRadius: number = 2;

    @property({ displayName: '轨迹采样段数' })

    aimSegmentCount: number = 15;



    /**

     * 钓鱼流水线阶段（权威状态, Single source of truth）

     * -1 未进行；1 甩杆；2 出线/检测；3 中鱼表现；4 收杆

     */

    private _fishingPipelineStep: number = -1;

    /** 本轮是否经历过 JoystickTouchStart，用于 TouchEnd 时判断是否允许甩杆 */

    private _fishingAimGestureActive: boolean = false;

    /** 甩杆～收杆连续流程中：不参与瞄准轨迹刷新，且忽略拉起瞄准 */

    private _fishingActionBusy: boolean = false;

    private _takeAimSessionReady: boolean = false;

    private _idleOscPhase: number = 0;

    private _aimMode: AimMode = AimMode.HeroFishing;

    /** 当前会话准心显示倍率（鱼竿 1 / 机器 1.5 或 2） */

    private _indicatorDisplayMultiplier: number = 1;



    /** 当前交由退出按钮结束的建筑交互（会话由本管理器集中持有） */

    private _activeBuildInteraction: BuildInteraction | null = null;

    /** 结束阶段结算钓鱼机（自动流程，禁止摇杆撒网） */
    private _endPhaseMachine: BuildFishingMachine | null = null;



    private readonly _scratchDir = v3();

    private readonly _scratchNextIndicatorPos = v3();

    private readonly _scratchLerpPos = v3();

    private readonly _idleLerpOut = v3();

    /** onLoad 时记录的准心初始世界坐标，所有钓鱼流程以此为准 */

    private readonly _indicatorInitialWorldPos = v3();

    private _aimView: AimTrajectoryView = null!;

    //默认准心缩放
    private indicatorOrignalScale: Vec3 = v3();

    @property({ type: Node, displayName: '水特效节点' })
    waterEffectNode: Node = null!;
    waterEffectEffect: ParticleSystem[] = [];

    /** 每次进入钓鱼状态只显示一次闲置摆动 */
    private isShowOscillateOnce: boolean = true;


    public get aimMode(): AimMode {

        return this._aimMode;

    }



    onLoad(): void {

        GameInfo.instance.trackMgr = this;



        this._aimView = this.trackRoot.getComponent(AimTrajectoryView);

        if (!this._aimView) {

            this._aimView = this.trackRoot.addComponent(AimTrajectoryView);

        }

        this.indicatorOriginalScale.set(this.indicator.scale);

        this.indicator.getWorldPosition(this._indicatorInitialWorldPos);

        app.event.on(CommonEvent.JoystickTouchStart, this._onJoystickTouchStart, this);

        app.event.on(CommonEvent.JoystickTouchEnd, this._onJoystickTouchEnd, this);
        this.indicatorOrignalScale.set(this.indicator.scale);
        if (this.waterEffectNode) {
            let selfPart = this.waterEffectNode.getComponent(ParticleSystem);
            if (selfPart) {
                this.waterEffectEffect.push(selfPart);
            }
            let len = this.waterEffectNode.children.length;
            for (let i = 0; i < len; i++) {
                let child = this.waterEffectNode.children[i];
                let part = child.getComponent(ParticleSystem);
                if (part) {
                    this.waterEffectEffect.push(part);
                }
            }
        }
    }

    protected start(): void {

        this._ensureAimSessionConfigured();

        this.indicator.active = false;

        this.indicator.getChildByName('col').active = false;

    }

    protected onDestroy(): void {

        app.event.off(CommonEvent.JoystickTouchStart, this);
        app.event.off(CommonEvent.JoystickTouchEnd, this);

    }



    public get fishingActionBusy(): boolean {

        return this._fishingActionBusy;

    }



    public get fishingPipelineStep(): number {

        return this._fishingPipelineStep;

    }



    public setFishingPipelineStep(step: number): void {

        this._fishingPipelineStep = step;

    }



    /** 收杆收尾：清空流水线步进并解除 busy；resetIndicator 为 false 时保留准心当前位置 */
    public endFishingCastAndReleaseBusy(resetIndicator: boolean = true): void {

        this._fishingPipelineStep = -1;

        this.setFishingActionBusy(false);

        if (resetIndicator) {

            this._resetIndicatorToInitialPosition();

        }

        this.indicator.active = true;

        this.indicator.getChildByName('col').active = false;

        this._applyIndicatorDisplayScale();

    }



    /** 设置准心显示倍率并立即应用（基于 indicatorOriginalScale） */

    public setIndicatorDisplayScale(multiplier: number): void {

        this._indicatorDisplayMultiplier = Math.max(0.1, multiplier);

        this._applyIndicatorDisplayScale();

    }



    private _applyIndicatorDisplayScale(): void {

        if (!this.indicator?.isValid) return;

        const m = this._indicatorDisplayMultiplier;

        const s = this.indicatorOriginalScale;

        this.indicator.setScale(v3(s.x * m, s.y * m, s.z * m));

    }



    /** 将准心复位到 onLoad 记录的初始世界坐标 */

    private _resetIndicatorToInitialPosition(): void {

        if (!this.indicator?.isValid) return;

        this.indicator.setWorldPosition(this._indicatorInitialWorldPos);

    }



    /** 仅复位准心位置，不改变 busy / 流水线状态 */

    public resetIndicatorToInitialPosition(): void {

        this._resetIndicatorToInitialPosition();

    }



    /** 进入鱼竿钓鱼瞄准会话 */

    changeAimStatus(startPoint: Node): void {
        this.isShowOscillateOnce = true;

        this._aimMode = AimMode.HeroFishing;

        this._indicatorDisplayMultiplier = 1;

        this.startPoint = startPoint;

        this._resetIndicatorToInitialPosition();

        this.indicator.active = true;

        this.indicator.getChildByName('col').active = false;

        this.lockHeroJoystickInFishingZone = true;

        this._applyIndicatorDisplayScale();

        this.showExitInteractionIfAllowed();

    }



    /** 进入机器撒网瞄准会话：无轨迹，准心 scale 按机器等级放大 */

    public enterMachineAim(armEndNode: Node): void {

        this._aimMode = AimMode.MachineFishing;

        this.startPoint = armEndNode;

        this._resetIndicatorToInitialPosition();

        this.indicator.active = true;

        this.indicator.getChildByName('col').active = false;

        this.lockHeroJoystickInFishingZone = true;

        this.showExitInteractionIfAllowed();
    }

    /** 结束阶段机器钓鱼：准心固定、无退出按钮、不消耗道具 */
    public enterEndMachineAim(armEndNode: Node, machine: BuildFishingMachine): void {
        this._endPhaseMachine = machine;
        this._aimMode = AimMode.MachineFishing;
        this.startPoint = armEndNode;
        this.indicator.active = true;
        this.indicator.getChildByName('col').active = false;
        this.lockHeroJoystickInFishingZone = true;
        this.hideExitInteractionUi();
    }

    /** 将准心固定到 indicatorRangeCenter 的 XZ（保留当前 Y） */
    public pinIndicatorAtRangeCenter(): void {
        if (!this.indicator?.isValid || !this.indicatorRangeCenter?.isValid) return;
        const center = this.indicatorRangeCenter.worldPosition;
        const cur = this.indicator.worldPosition;
        this.indicator.setWorldPosition(center.x, cur.y, center.z);
        this._applyIndicatorDisplayScale();
    }

    public getIndicatorWorldPosition(out?: Vec3): Vec3 {
        if (!this.indicator?.isValid) {
            return out ?? v3();
        }
        if (out) {
            this.indicator.getWorldPosition(out);
            return out;
        }
        return this.indicator.worldPosition.clone();
    }

    public clearEndPhaseFishing(): void {
        this._endPhaseMachine = null;
    }

    public get endPhaseFishingActive(): boolean {
        return this._endPhaseMachine != null;
    }

    private _resolveMachineForCast(): BuildFishingMachine | null {
        return this._endPhaseMachine ?? GameInfo.instance.buildingMgr?.buildFishingMachine ?? null;
    }



    /** 离开钓鱼/机器会话：重置流水线、瞄准手势与 busy */

    public resetFishingFlow(): void {

        this._fishingPipelineStep = -1;

        this.isTakeAim = false;

        this._fishingAimGestureActive = false;

        this.lockHeroJoystickInFishingZone = false;

        this.setFishingActionBusy(false);

        this._aimMode = AimMode.HeroFishing;

        this._indicatorDisplayMultiplier = 1;

        this._resetIndicatorToInitialPosition();

        this.indicator.active = false;

        this.indicator.getChildByName('col').active = false;

        this._aimView?.hidePath();

    }



    public setFishingActionBusy(busy: boolean): void {

        this._fishingActionBusy = busy;

        if (busy) {

            this.isTakeAim = false;

        }

    }



    private _onJoystickTouchEnd(): void {

        if (!this.lockHeroJoystickInFishingZone || GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin) {

            return;

        }
        if (this._endPhaseMachine) {
            return;
        }
        this.isShowOscillateOnce = false;

        if (GameInfo.instance.buildingMgr.buildWorkTable.curLv > 0) {
            //判断道具是否足够
            if (GameInfo.instance.viewMgr.CoinToolNet < 1) {
                this.tryAutoExitWhenOutOfTools();
                return;
            } else {
                GameInfo.instance.viewMgr.guideHand2.active = false;
                GameInfo.instance.viewMgr.addTool_Net(-1);
            }
        } else {
            if (GameInfo.instance.viewMgr.CoinToolRod < 1) {
                this.tryAutoExitWhenOutOfTools();
                return;
            } else {
                if (GameInfo.step >= 6) {
                    GameInfo.instance.viewMgr.guideHand2.active = false;
                    GameInfo.instance.viewMgr.addTool_Rod(-1);
                }
            }
        }
        this.isTakeAim = false;

        const canCast = this._fishingAimGestureActive;

        this._fishingAimGestureActive = false;

        if (!this._fishingActionBusy && canCast) {

            if (this._aimMode === AimMode.MachineFishing) {

                this._resolveMachineForCast()?.commitCast();

            } else {

                GameInfo.instance.player?.commitFishingCast();

            }

        }

        this.indicator.getChildByName('col').active = false;

    }



    private _onJoystickTouchStart(): void {

        if (!this.lockHeroJoystickInFishingZone || this._fishingActionBusy ||

            GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin) {

            return;

        }
        if (this._endPhaseMachine) {
            return;
        }
        if (GameInfo.instance.buildingMgr.buildWorkTable.curLv > 0) {
            //判断道具是否足够
            if (GameInfo.instance.viewMgr.CoinToolNet < 1) {
                return;
            }
        } else {
            if (GameInfo.instance.viewMgr.CoinToolRod < 1) {
                return;
            }
        }
        this._fishingAimGestureActive = true;

        this.isTakeAim = true;

        this.indicator.getChildByName('col').active = true;

    }



    public isHeroJoystickBlocked(): boolean {

        return this.lockHeroJoystickInFishingZone || this.isTakeAim || this._fishingActionBusy;

    }



    public setActiveBuildInteraction(comp: BuildInteraction | null): void {

        this._activeBuildInteraction = comp;

    }



    public detachBuildInteractionIfCurrent(comp: BuildInteraction): void {

        if (this._activeBuildInteraction !== comp) {

            return;

        }

        this._activeBuildInteraction = null;

        GameInfo.instance.viewMgr?.setExitBtn(false);

    }



    /** 钓鱼流水线闲置(step<=0)且非 busy 时才显示退出 */

    public showExitInteractionIfAllowed(): void {

        if (this._fishingPipelineStep > 0 || this._fishingActionBusy) {

            return;

        }
        if (GameInfo.step < 6) {
            return
        }

        GameInfo.instance.viewMgr?.setExitBtn(true);

    }



    public hideExitInteractionUi(): void {

        GameInfo.instance.viewMgr?.setExitBtn(false);

    }



    /** 当前钓鱼会话消耗的道具数量（网 / 鱼竿） */
    private _getCurrentToolCount(): number {
        const vm = GameInfo.instance.viewMgr;
        if (!vm) return 0;
        if (GameInfo.instance.buildingMgr.buildWorkTable.curLv > 0) {
            return vm.CoinToolNet;
        }
        return vm.CoinToolRod;
    }

    /**
     * 道具耗尽且在闲置态时自动退出钓鱼/机器会话。
     * step 5 教程仍引导手动点退出。返回是否已触发退出。
     */
    public tryAutoExitWhenOutOfTools(): boolean {
        if (!this.lockHeroJoystickInFishingZone) return false;
        if (this._fishingActionBusy || this._fishingPipelineStep > 0) return false;
        if (this._getCurrentToolCount() >= 1) return false;
        if (GameInfo.step === 5) {
            if (GameInfo.instance.viewMgr?.guideHand2) {
                GameInfo.instance.viewMgr.guideHand2.active = true;
            }
            return false;
        }
        if (GameInfo.instance.viewMgr?.guideHand2) {
            GameInfo.instance.viewMgr.guideHand2.active = false;
        }
        this.exitInteractionFromExitButton();
        return true;
    }



    public exitInteractionFromExitButton(): void {

        if (this._activeBuildInteraction) {

            const bi = this._activeBuildInteraction;

            const tag = bi.getInteractionSourceTag();

            bi.exitInteraction();

            if (tag === ColliderGroupTag.FishingSpot) {
                GameInfo.instance.player?.exitFishing();
            } else if (tag === ColliderGroupTag.FishingMachine) {
                GameInfo.instance.player?.exitMachineFishing();
            }
            return;

        }

        this.hideExitInteractionUi();

    }



    /** 将准心世界坐标限制在 indicatorRange 矩形内 */

    private _clampIndicatorWorldPos(pos: Vec3): void {

        if (!this.indicatorRangeCenter?.isValid) return;

        const center = this.indicatorRangeCenter.worldPosition;

        const halfX = this.indicatorRangeX * 0.5;

        const halfZ = this.indicatorRangeZ * 0.5;

        pos.x = Math.max(center.x - halfX, Math.min(center.x + halfX, pos.x));

        pos.z = Math.max(center.z - halfZ, Math.min(center.z + halfZ, pos.z));

    }



    update(dt: number): void {

        if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin) return;



        const canMoveIndicator = !this._fishingActionBusy && !!this.indicator;

        const heroIdleOsc =

            this._aimMode === AimMode.HeroFishing &&

            !this.isTakeAim &&

            this.lockHeroJoystickInFishingZone &&

            this.oscillateIndicatorWhileIdle &&

            this.idleSwingPointA &&

            this.idleSwingPointB;



        const showTrajectory =

            this._aimMode === AimMode.HeroFishing &&

            !this._fishingActionBusy &&

            !!this.startPoint && !!this.indicator && this._aimView &&

            (this.isTakeAim || heroIdleOsc);



        if (!canMoveIndicator && !showTrajectory) {

            if (!showTrajectory) {

                this._takeAimSessionReady = false;

                this._aimView?.hidePath();

            }

            return;

        }



        if (canMoveIndicator) {

            if (heroIdleOsc) {
                if (this.isShowOscillateOnce) {
                    this._idleOscPhase += dt * this.idleOscillationSpeed;

                    const u = (Math.sin(this._idleOscPhase) + 1) * 0.5;

                    this.idleSwingPointA.getWorldPosition(this._scratchLerpPos);

                    this.idleSwingPointB.getWorldPosition(this._scratchNextIndicatorPos);

                    Vec3.lerp(this._idleLerpOut, this._scratchLerpPos, this._scratchNextIndicatorPos, u);

                    this.indicator.setWorldPosition(this._idleLerpOut);
                }
            } else if (this.isTakeAim) {

                this._scratchDir.set(VirtualInput.horizontal, 0, VirtualInput.vertical);

                const worldDir = CameraCtrl.instance.convertInputToWorldDirection(this._scratchDir);

                const step = this.moveSpeed * dt;

                this.indicator.getWorldPosition(this._scratchNextIndicatorPos);

                this._scratchNextIndicatorPos.x += worldDir.x * step;

                this._scratchNextIndicatorPos.y += worldDir.y * step;

                this._scratchNextIndicatorPos.z += worldDir.z * step;

                this.indicator.setWorldPosition(this._scratchNextIndicatorPos);

            }

            this.indicator.getWorldPosition(this._scratchNextIndicatorPos);

            this._clampIndicatorWorldPos(this._scratchNextIndicatorPos);

            this.indicator.setWorldPosition(this._scratchNextIndicatorPos);

        }



        if (showTrajectory) {

            this._aimView.setAnchorFromNode(this.startPoint);

            this.indicator.getWorldPosition(this._scratchLerpPos);

            this._aimView.setTargetWorld(this._scratchLerpPos);

            this._aimView.refresh();

        } else {

            this._aimView?.hidePath();

        }

    }



    private _ensureAimSessionConfigured(): void {

        if (!this._aimView || this._takeAimSessionReady) return;

        const isD3 = GameInfo.SceneType === SceneType.D3;

        this._aimView.configure({

            pathRoot: this.trackRoot,

            segmentCount: this.aimSegmentCount,

            curveIsD3: isD3,

            flyType: this.aimFlyType,

            radius: this.aimCurveRadius,

        });

        this._aimView.setCurveAuto(this.aimFlyType, this.aimCurveRadius);

        this._takeAimSessionReady = true;

    }



    /** 准星缩放动画（抓取位移由 FishingHook / FishingNet 各自处理） */

    public playIndicatorAnim(complete?: () => void): void {

        if (!this.indicator?.isValid) {

            complete?.();

            return;

        }

        const bs = this.indicatorOriginalScale.clone();

        const m = this._indicatorDisplayMultiplier;

        tween(this.indicator)

            .to(0.3, { scale: v3(bs.x * m * 0.3, bs.y * m * 0.3, bs.z * m * 0.3) }, { easing: easing.quadIn })

            .call(() => {
                complete?.();
            })

            .start();

    }
    playWaterEffect(scale: number = 1) {
        let pos = this.indicator.getWorldPosition();
        pos.y -= 0.5;
        this.waterEffectNode.setWorldPosition(pos);
        this.waterEffectNode.setScale(v3(scale, scale, scale));
        let len = this.waterEffectEffect.length;
        for (let i = 0; i < len; i++) {
            this.waterEffectEffect[i].stop();
            this.waterEffectEffect[i].play();
        }
    }

}
