import { _decorator, CCFloat, CCInteger, Component, Node, ParticleSystem, tween, Tween, v3, Vec3 } from 'cc';

import { GameInfo } from '../Common/GameInfo';
import { WorkerType } from '../Common/CommonEnum';
import { RoleWorker } from '../Battle/RoleWorker';
import { RolePeople } from '../Battle/RolePeople';

import { AimMode } from '../Manager/TrackManager';

import { FishingNet } from '../Other/FishingNet';



const { ccclass, property } = _decorator;



/**

 * 机器撒网：准心驱动机械臂 IK + 撒网状态机（与 FishingNet 强耦合）

 */

@ccclass('BuildFishingMachine')

export class BuildFishingMachine extends Component {
    @property({ type: Node, displayName: '旋转基座' })
    private rotateBaseNode: Node = null!;

    @property({ type: Node, displayName: '机械臂', tooltip: '动画节点仅缩放Z轴' })
    private armNode: Node = null!;

    @property({ type: Node, displayName: '同步节点', tooltip: '挂点处于机械臂末端, 用于同步渔网组件的世界坐标, 以及同步准心的XZ坐标' })
    private armEndNode: Node = null!;

    @property({ type: FishingNet, displayName: '渔网组件' })
    private netComp: FishingNet | null = null;

    @property({ type: Node, displayName: '交互节点' })
    public interactNode: Node = null;

    //NOTE: 工人自动化专用（Hero 机器流程不使用以下字段）
    @property({ type: RoleWorker, displayName: '工人' })
    worker: RoleWorker = null!;

    @property({ type: CCFloat, displayName: '工人闲置后撒网间隔(秒)' })
    autoCastInterval: number = 10;

    @property({ type: CCFloat, displayName: '工人撒网前对准时长(秒)' })
    workerAimDuration: number = 0.3;


    /** 是否解锁工人（自动撒网） */
    public hasWorker: boolean = false;

    @property({ type: CCInteger, displayName: '单次抓取数量' })
    private singleCatchCount: number = 4;

    @property({ type: CCFloat, displayName: '臂长单位(scaleZ=1时水平reach)' })
    private armUnitLength: number = 1;

    @property({ displayName: '默认基座Y角度' })
    private defaultBaseYaw: number = 90;

    @property({ displayName: '成功收尾基座Y角度' })
    private successBaseYaw: number = 180;

    @property({ displayName: '瞄准基座Y最小角' })
    private aimBaseYawMin: number = 30;

    @property({ displayName: '瞄准基座Y最大角' })
    private aimBaseYawMax: number = 150;

    @property({ displayName: '基座旋转tween时长(秒)' })
    private baseRotateDuration: number = 0.5;

    @property({ displayName: '进入瞄准基座旋转时长(秒)' })
    private enterBaseRotateDuration: number = 0.3;



    @property({ type: Node, displayName: '水特效节点' })
    private waterEffectNode: Node = null!;



    private isWorking: boolean = false;
    private waterEffectEffect: ParticleSystem[] = [];
    isPlayingWaterEffect: boolean = true;


    /** 是否处于机器瞄准会话（Hero 进入后 true，退出后 false） */
    private _inAimSession: boolean = false;

    /** 进入瞄准会话时基座归位 tween 进行中，期间不跑 IK */
    private _enterAimPoseTweening: boolean = false;

    /** -1 闲置；2 catch(含放线)；3 收线收尾 */
    private _pipelineStep: number = -1;
    private _lastCatchSuccess: boolean = false;
    private readonly _scratchAim = v3();

    @property({ displayName: '是否是结束阶段' })
    private isGameEndPhase: boolean = false;

    @property({ displayName: '结束阶段瞄准tween时长(秒)' })
    private endPhaseAimDuration: number = 0.8;

    /** 结束阶段：机械臂对准目标点 tween 中，禁止 lateUpdate IK 覆盖 */
    private _endPhasePosing: boolean = false;

    /** 基座 Y 轴 tween 代理（须与 _abortPoseTweens 配对停止，避免多轮撒网残留） */
    private readonly _baseYawTweenTarget = { yaw: 0 };

    /** 收线收尾会话 id，用于丢弃上一轮 tryFinish 回调 */
    private _recoverSessionId: number = 0;
    //NOTE: 工人自动化：整轮结束后闲置计时，Hero 流程不使用
    private _idleTimer: number = 0;
    protected onLoad(): void {
        if (this.interactNode) this.interactNode.active = false;
        this.isWorking = false;

        if (this.waterEffectNode) {

            const selfPart = this.waterEffectNode.getComponent(ParticleSystem);

            if (selfPart) {

                this.waterEffectEffect.push(selfPart);

            }

            const len = this.waterEffectNode.children.length;

            for (let i = 0; i < len; i++) {

                const part = this.waterEffectNode.children[i].getComponent(ParticleSystem);

                if (part) {

                    this.waterEffectEffect.push(part);

                }

            }

        }

    }



    protected onEnable(): void {

        this.scheduleOnce(() => {

            this.playWaterEffect(false);

        }, 0.5);

    }



    init() {
        if (this.interactNode) {

            this.interactNode.active = true;

            this.interactNode.scale = v3(0.2, 0.2, 1);

            tween(this.interactNode)

                .delay(0.1)

                .to(0.1, { scale: v3(1.2, 1.2, 1) })

                .to(0.1, { scale: v3(1, 1, 1) })

                .start();
        }
        if (this.isGameEndPhase) {
            //NOTE: 结算动画专用
            this.netComp.initData(0.1, 1.4);
            GameInfo.instance.trackMgr?.setIndicatorDisplayScale(3.5);
        } else {
            this.netComp.initData(0.1, 1.525);
            GameInfo.instance.trackMgr?.setIndicatorDisplayScale(2);
        }

    }



    public getIsWorking(): boolean {

        return this.isWorking;

    }



    public getArmEndNode(): Node {

        return this.armEndNode;

    }

    //NOTE: 工人自动化入口；不走 TrackManager / BuildInteraction / Hero 瞄准会话
    /** 解锁工人：纯 work 表现 + 自动撒网（不走 TrackManager） */
    unlockWorker() {
        this.hasWorker = true;
        if (this.netComp) {
            this.netComp.setPerCatchCount(this.singleCatchCount);
            //NOTE: 工人无准心 UI，跳过 Hero 用的准心缩放反馈
            this.netComp.setSkipIndicatorFeedback(true);
        }
        if (this.worker) {
            this.worker.initWorker(WorkerType.MachineFishing);
            this.worker.node.active = true;
            if (this.interactNode?.isValid) {
                this.worker.node.setWorldPosition(this.interactNode.worldPosition);
            }
            const faceNode = this.armNode;
            if (faceNode?.isValid) {
                this.worker.faceWorkTarget(faceNode);
            }
        }
        //NOTE: 预填闲置计时；下一帧立即尝试撒网（不能仅靠改数值，update 内还有闲置/选点门槛）
        this._idleTimer = this.autoCastInterval;
        this.scheduleOnce(() => this._attemptWorkerAutoCast(), 0);
        GameInfo.instance.prefabMgr.createAddEffect(this.node.worldPosition, v3(1, 1, 0.8));
    }

    //NOTE: 工人自动化主循环；Hero 撒网由 TrackManager TouchEnd → commitCast 触发
    protected update(dt: number): void {
        if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin) return;
        if (!this.hasWorker || this.isGameEndPhase) return;
        if (!this._isWorkerIdle()) return;

        this._idleTimer += dt;
        if (this._idleTimer < this.autoCastInterval) return;

        if (!this._attemptWorkerAutoCast()) {
            //NOTE: 无鱼可打时保持“已满间隔”，下帧继续尝试，避免空转再等一整轮
            this._idleTimer = this.autoCastInterval;
        }
    }

    /** 工人自动撒网：选点成功则开一轮 catch，失败返回 false */
    private _attemptWorkerAutoCast(): boolean {
        if (!this.hasWorker || this.isGameEndPhase) return false;
        if (!this._isWorkerIdle()) return false;
        const aim = this._pickFishWorldPos();
        if (!aim) return false;
        this._idleTimer = 0;
        this._castAtWorldPos(aim);
        return true;
    }

    private _isWorkerIdle(): boolean {
        return this._pipelineStep === -1 && !this.isWorking && !this._enterAimPoseTweening;
    }

    //NOTE: 工人自动化：用 peopleList 选点，Hero 用 TrackManager 准心位置
    /** 在 indicator 范围内选取最近的鱼 */
    private _pickFishWorldPos(out?: Vec3): Vec3 | null {
        const bm = GameInfo.instance.buildingMgr;
        if (!bm?.workerFishingPeopleList?.length) return null;

        const center = bm.WorkerFishingRangeCenter.worldPosition;
        const halfX = bm.WorkerFishingRangeX * 0.5;
        const halfZ = bm.WorkerFishingRangeZ * 0.5;
        const base = this.rotateBaseNode?.worldPosition ?? this.node.worldPosition;

        let best: RolePeople = null;
        let bestDistSq = Infinity;
        for (const people of bm.workerFishingPeopleList) {
            if (!people?.node?.isValid) continue;
            const w = people.node.worldPosition;
            if (Math.abs(w.x - center.x) > halfX || Math.abs(w.z - center.z) > halfZ) continue;
            const d = Vec3.squaredDistance(base, w);
            if (d < bestDistSq) {
                bestDistSq = d;
                best = people;
            }
        }
        if (!best) return null;
        if (out) {
            best.node.getWorldPosition(out);
            return out;
        }
        return best.node.worldPosition.clone();
    }

    //NOTE: 工人自动化撒网；不经过 _doCommitCast / tm.setFishingActionBusy / tm.indicator
    /** 工人自动撒网：世界坐标驱动，不读准心 */
    private _castAtWorldPos(aim: Readonly<Vec3>): void {
        if (!this.hasWorker || !this.netComp?.isValid) return;
        if (this.isWorking || this._pipelineStep > 0 || this._enterAimPoseTweening) return;

        this._abortPoseTweens();
        this.isWorking = true;
        this._lastCatchSuccess = false;
        this.worker?.startProductionWork();
        //NOTE: 工人撒网进行中同步 work；Hero 无对应角色动画

        this._enterAimPoseTweening = true;
        this._tweenArmToWorldTarget(aim, this.workerAimDuration, () => {
            this._enterAimPoseTweening = false;
            this._syncNetToArmEnd();
            //NOTE: 工人 catch 不同步 TrackManager 流水线步进
            this._beginCatchPhaseAtAim(aim, false);
        });
    }

    /** 结算建筑解锁后：固定准心、tween 对准范围中心并自动放线，全程禁止手动操作 */
    public startEndPhaseFlow(): void {
        if (!this.isGameEndPhase) return;

        const tm = GameInfo.instance.trackMgr;
        if (!tm || !this.netComp) return;

        this._abortPoseTweens();
        this._inAimSession = true;
        this._pipelineStep = -1;
        this.isWorking = false;
        this.netComp.setPerCatchCount(this.singleCatchCount);

        tm.enterEndMachineAim(this.getArmEndNode(), this);
        tm.pinIndicatorAtRangeCenter();

        this._enterAimPoseTweening = true;
        this._endPhasePosing = true;
        const targetPos = tm.getIndicatorWorldPosition();
        this._tweenArmToWorldTarget(targetPos, this.endPhaseAimDuration, () => {
            this._enterAimPoseTweening = false;
            this._endPhasePosing = false;
            this.commitCastAuto();
        });
    }

    //NOTE: Hero 进入机器瞄准会话（BuildInteraction 蓄力满后由 Hero 调用）
    /** Hero 进入机器瞄准会话时调用 */

    public enterAimSession(): void {

        this._inAimSession = true;

        this._pipelineStep = -1;

        this._abortPoseTweens();

        this._enterAimPoseTweening = true;

        this._tweenEnterAimPose(() => {

            this._enterAimPoseTweening = false;

        });

        if (this.netComp) {


            this.netComp.setPerCatchCount(this.singleCatchCount);

        }

    }



    //NOTE: Hero 机器钓鱼入口（TrackManager 摇杆瞄准 + TouchEnd 分发）
    /** TouchEnd 触发撒网（TrackManager 分发） */

    public commitCast(): void {
        const tm = GameInfo.instance.trackMgr;
        if (!tm || tm.fishingActionBusy || !this._inAimSession || !this.netComp || this._enterAimPoseTweening) {
            return;
        }
        this._doCommitCast();
    }

    /** 结束阶段自动放线（跳过瞄准 tween 门禁） */
    public commitCastAuto(): void {
        const tm = GameInfo.instance.trackMgr;
        if (!tm || tm.fishingActionBusy || !this._inAimSession || !this.netComp) {
            return;
        }
        this._doCommitCast();
    }

    //NOTE: Hero / 结算阶段撒网；读取 tm.indicator 作为瞄准点
    private _doCommitCast(): void {
        const tm = GameInfo.instance.trackMgr;
        if (!tm) return;

        tm.setFishingActionBusy(true);

        tm.hideExitInteractionUi();

        tm.setFishingPipelineStep(2);

        this.isWorking = true;

        this._pipelineStep = 2;

        this._lastCatchSuccess = false;



        const indicator = tm.indicator;

        if (!indicator?.isValid) {

            this._finalizeSession();

            return;

        }

        indicator.getWorldPosition(this._scratchAim);

        this._syncNetToArmEnd();

        this._beginCatchPhase();

    }



    //NOTE: Hero 退出机器瞄准会话
    /** 非 busy 时退出机器会话 */

    public exitMachineFishing(): void {

        const tm = GameInfo.instance.trackMgr;

        if (tm?.fishingActionBusy) {

            return;

        }

        this._inAimSession = false;

        this._pipelineStep = -1;

        this.isWorking = false;

        this._enterAimPoseTweening = false;

        this._recoverSessionId++;

        this._abortPoseTweens();

        this.netComp?.cancelAll();

        this.resetToDefaultPose(true);

    }



    protected lateUpdate(): void {

        if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin) {

            return;

        }

        if (this._inAimSession && !this._endPhasePosing) {

            const tm = GameInfo.instance.trackMgr;

            //NOTE: Hero 瞄准期准心驱动机械臂 IK；工人自动化不使用 _inAimSession
            if (tm && !tm.fishingActionBusy && tm.aimMode === AimMode.MachineFishing && !this._enterAimPoseTweening) {

                this._syncArmFromIndicator();

            }

        }

        this._syncNetToArmEnd();

    }



    /** 渔网根节点跟随机械臂末端，保证鱼线起点与臂端一致 */

    private _syncNetToArmEnd(): void {

        if (!this.netComp?.isValid || !this.armEndNode?.isValid) {

            return;

        }

        this.netComp.syncRootToAnchor(this.armEndNode);

    }



    /** 准心 XZ → 基座 Y 旋转 + 臂 scaleZ */

    private _syncArmFromIndicator(): void {

        const tm = GameInfo.instance.trackMgr;

        const indicator = tm?.indicator;

        if (!indicator?.isValid || !this.rotateBaseNode?.isValid || !this.armNode?.isValid) {

            return;

        }



        const base = this.rotateBaseNode.worldPosition;

        const target = indicator.worldPosition;

        const dx = target.x - base.x;

        const dz = target.z - base.z;



        let yaw = Math.atan2(dx, dz) * (180 / Math.PI);

        yaw = Math.max(this.aimBaseYawMin, Math.min(this.aimBaseYawMax, yaw));

        this.rotateBaseNode.setRotationFromEuler(0, yaw, 0);

        this._syncArmScaleFromIndicator();

    }



    /** 按准心与基座水平距离更新臂 scaleZ（基座 yaw 已由外部驱动时使用） */

    /** 由世界目标点计算基座 yaw 与臂 scaleZ */
    private _computeAimPoseFromWorldPos(target: Readonly<Vec3>): { yaw: number; scaleZ: number } {
        const base = this.rotateBaseNode.worldPosition;
        const dx = target.x - base.x;
        const dz = target.z - base.z;
        let yaw = Math.atan2(dx, dz) * (180 / Math.PI);
        yaw = Math.max(this.aimBaseYawMin, Math.min(this.aimBaseYawMax, yaw));
        const horiz = Math.sqrt(dx * dx + dz * dz);
        const scaleZ = Math.max(0.01, horiz / Math.max(0.01, this.armUnitLength));
        return { yaw, scaleZ };
    }

    /** 结束阶段：基座与机械臂 tween 对准目标世界坐标 */
    private _tweenArmToWorldTarget(target: Readonly<Vec3>, duration: number, onDone?: () => void): void {
        if (!this.rotateBaseNode?.isValid || !this.armNode?.isValid) {
            onDone?.();
            return;
        }
        this._abortPoseTweens();
        const { yaw, scaleZ } = this._computeAimPoseFromWorldPos(target);
        const dur = Math.max(0.01, duration);
        this._tweenBaseYaw(yaw, dur);
        tween(this.armNode)
            .to(dur, { scale: v3(1, 1, scaleZ) })
            .call(() => onDone?.())
            .start();
    }

    private _syncArmScaleFromIndicator(): void {

        const tm = GameInfo.instance.trackMgr;

        const indicator = tm?.indicator;

        if (!indicator?.isValid || !this.rotateBaseNode?.isValid || !this.armNode?.isValid) {

            return;

        }

        const base = this.rotateBaseNode.worldPosition;

        const target = indicator.worldPosition;

        const dx = target.x - base.x;

        const dz = target.z - base.z;

        const horiz = Math.sqrt(dx * dx + dz * dz);

        const scaleZ = Math.max(0.01, horiz / Math.max(0.01, this.armUnitLength));

        this.armNode.setScale(1, 1, scaleZ);

    }



    /** 进入瞄准：基座 tween 到默认角，旋转过程中同步 scaleZ */

    private _tweenEnterAimPose(onDone?: () => void): void {

        if (!this.rotateBaseNode?.isValid || !this.armNode?.isValid) {

            onDone?.();

            return;

        }

        this._abortPoseTweens();

        this._syncArmScaleFromIndicator();

        const dur = this.enterBaseRotateDuration;

        this._tweenBaseYaw(this.defaultBaseYaw, dur, () => {

            this._syncArmScaleFromIndicator();

        }, () => {

            this._syncArmScaleFromIndicator();

            onDone?.();

        });

    }



    //NOTE: Hero 撒网 catch 入口；瞄准点来自 TrackManager 准心
    private _beginCatchPhase(): void {

        const tm = GameInfo.instance.trackMgr;

        const indicator = tm?.indicator;

        if (!indicator?.isValid || !this.netComp) {

            this._lastCatchSuccess = false;

            this._beginRecoverAndFinish();

            return;

        }

        indicator.getWorldPosition(this._scratchAim);

        this._beginCatchPhaseAtAim(this._scratchAim, true);

    }

    //NOTE: Hero/工人共用 catch；useTrackMgr=true 时同步 TrackManager 流水线（工人传 false）
    private _beginCatchPhaseAtAim(aimWorld: Readonly<Vec3>, useTrackMgr: boolean): void {

        if (useTrackMgr) {
            //NOTE: Hero 专用
            GameInfo.instance.trackMgr?.setFishingPipelineStep(2);
        }

        this._pipelineStep = 2;

        if (!this.netComp) {

            this._lastCatchSuccess = false;

            this._beginRecoverAndFinish();

            return;

        }

        this._scratchAim.set(aimWorld);

        this.netComp.playCatchPhase(this._scratchAim, (success, count) => {

            this._lastCatchSuccess = success && count > 0;

            this._beginRecoverAndFinish();

        });

    }



    /** catch 结束后：收线；成功则并行基座旋转+scaleZ→1，完成后播 open */

    private _beginRecoverAndFinish(): void {

        const tm = GameInfo.instance.trackMgr;

        const recoverSessionId = ++this._recoverSessionId;

        this._abortPoseTweens();

        tm?.setFishingPipelineStep(3);

        this._pipelineStep = 3;

        // 结束阶段：不收线、不 open，catch 结束直接胜利结算
        if (this.isGameEndPhase) {

            tm?.clearEndPhaseFishing();
            GameInfo.instance.gameMgr.GameOver(true);
            return;
        }

        if (!this.netComp) {

            this._finalizeSession();

            return;

        }

        let pending = this._lastCatchSuccess ? 2 : 1;

        const tryFinish = () => {

            if (recoverSessionId !== this._recoverSessionId) return;

            if (--pending > 0) return;

            //NOTE: 工人未中鱼只收网不播 open；Hero 仍走 playOpenPhase
            if (this.hasWorker && !this._lastCatchSuccess) {
                this._finalizeSession();
                return;
            }

            this.netComp?.playOpenPhase(() => this._finalizeSession());

        };

        this.netComp.playLineReel(tryFinish);

        if (this._lastCatchSuccess) {

            this._tweenBaseAndArm(this.successBaseYaw, 1, tryFinish);

        } else {
            //NOTE: 工人 MISS 浮字用本轮瞄准点；Hero 用准心世界坐标
            const wpos = this.hasWorker
                ? this._scratchAim
                : (GameInfo.instance.trackMgr?.indicator?.worldPosition ?? this.node.worldPosition);
            GameInfo.instance.prefabMgr?.createFloatText(wpos.clone(), 'MISS!', true);
        }

    }



    private _finalizeSession(): void {

        //NOTE: 工人自动化收尾；Hero 走下方 TrackManager + 瞄准姿态复位
        if (this.hasWorker) {
            this._finalizeWorkerSession();
            return;
        }

        this._pipelineStep = -1;

        this.isWorking = false;



        const tm = GameInfo.instance.trackMgr;

        if (this._lastCatchSuccess) {

            //NOTE: Hero 成功后复位准心与 enterAim 姿态
            tm?.resetIndicatorToInitialPosition();

            this._enterAimPoseTweening = true;

            this._tweenEnterAimPose(() => {

                this._enterAimPoseTweening = false;

                tm?.endFishingCastAndReleaseBusy(false);

                if (!tm?.tryAutoExitWhenOutOfTools()) {
                    tm?.showExitInteractionIfAllowed();
                }

            });

            return;

        }

        tm?.endFishingCastAndReleaseBusy(false);

        //NOTE: Hero 专用：退出按钮 / 道具耗尽检测
        if (!tm?.tryAutoExitWhenOutOfTools()) {
            tm?.showExitInteractionIfAllowed();
        }

    }

    //NOTE: 工人自动化收尾；不回 TrackManager、不显示退出按钮，成功后 tween 回 defaultBaseYaw
    /** 工人自动模式收尾：回默认姿态并切 idle，重置闲置计时 */
    private _finalizeWorkerSession(): void {
        this._pipelineStep = -1;
        this.isWorking = false;
        this.worker?.stopProductionWork();
        //NOTE: 工人整轮结束切 idle 并开始闲置计时；Hero 无对应角色动画

        const onIdleReady = () => {
            this._enterAimPoseTweening = false;
            this._idleTimer = 0;
        };

        if (this._lastCatchSuccess) {
            this._enterAimPoseTweening = true;
            this._tweenBaseAndArm(this.defaultBaseYaw, 1, onIdleReady);
        } else {
            onIdleReady();
        }
    }



    private resetToDefaultPose(immediate: boolean): void {

        this._tweenBaseAndArm(this.defaultBaseYaw, 1, undefined, immediate);

    }



    /** 将 yaw 归一化到 (-180, 180]，避免 eulerAngles 跨 ±180° 时 tween 走长路径 */
    private _normalizeYaw(yaw: number): number {
        let y = yaw % 360;
        if (y > 180) {
            y -= 360;
        } else if (y <= -180) {
            y += 360;
        }
        return y;
    }

    /** 沿最短弧线 tween 基座 Y 轴旋转（successBaseYaw=90 等场景避免 euler 插值异常） */
    private _tweenBaseYaw(
        targetYaw: number,
        duration: number,
        onUpdate?: () => void,
        onComplete?: () => void,
    ): void {
        if (!this.rotateBaseNode?.isValid) {
            onComplete?.();
            return;
        }

        const currentYaw = this._normalizeYaw(this.rotateBaseNode.eulerAngles.y);
        const normalizedTarget = this._normalizeYaw(targetYaw);
        let delta = normalizedTarget - currentYaw;
        if (delta > 180) {
            delta -= 360;
        } else if (delta < -180) {
            delta += 360;
        }
        const endYaw = currentYaw + delta;

        if (Math.abs(delta) < 1e-3) {
            this.rotateBaseNode.setRotationFromEuler(0, normalizedTarget, 0);
            onUpdate?.();
            onComplete?.();
            return;
        }

        Tween.stopAllByTarget(this._baseYawTweenTarget);
        this._baseYawTweenTarget.yaw = currentYaw;
        tween(this._baseYawTweenTarget)
            .to(duration, { yaw: endYaw }, {
                onUpdate: () => {
                    this.rotateBaseNode.setRotationFromEuler(0, this._baseYawTweenTarget.yaw, 0);
                    onUpdate?.();
                },
            })
            .call(() => {
                this.rotateBaseNode.setRotationFromEuler(0, normalizedTarget, 0);
                onComplete?.();
            })
            .start();
    }

    private _tweenBaseAndArm(

        baseYaw: number,

        armScaleZ: number,

        onDone?: () => void,

        immediate: boolean = false,

        duration?: number,

    ): void {

        if (!this.rotateBaseNode?.isValid || !this.armNode?.isValid) {

            onDone?.();

            return;

        }



        this._abortPoseTweens();



        if (immediate) {

            this.rotateBaseNode.setRotationFromEuler(0, this._normalizeYaw(baseYaw), 0);

            this.armNode.setScale(1, 1, armScaleZ);

            onDone?.();

            return;

        }



        const dur = duration ?? this.baseRotateDuration;

        let poseDoneCount = 0;

        const onPoseDone = () => {

            if (++poseDoneCount < 2) return;

            onDone?.();

        };

        this._tweenBaseYaw(baseYaw, dur, undefined, onPoseDone);

        tween(this.armNode)

            .to(dur, { scale: v3(1, 1, armScaleZ) })

            .call(onPoseDone)

            .start();

    }



    private _abortPoseTweens(): void {

        Tween.stopAllByTarget(this._baseYawTweenTarget);

        if (this.rotateBaseNode?.isValid) {

            Tween.stopAllByTarget(this.rotateBaseNode);

        }

        if (this.armNode?.isValid) {

            Tween.stopAllByTarget(this.armNode);

        }

    }



    playWaterEffect(isPlay: boolean = true) {

        if (isPlay) {

            if (this.isPlayingWaterEffect) return;

            this.isPlayingWaterEffect = true;

            const len = this.waterEffectEffect.length;

            for (let i = 0; i < len; i++) {

                this.waterEffectEffect[i].play();

            }

        } else {

            if (!this.isPlayingWaterEffect) return;

            this.isPlayingWaterEffect = false;

            const len = this.waterEffectEffect.length;

            for (let i = 0; i < len; i++) {

                this.waterEffectEffect[i].stop();

            }

        }

    }

}


