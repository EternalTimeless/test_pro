import { _decorator, Animation, CCBoolean, CCFloat, CCInteger, Component, director, Node, Sprite, UIOpacity, v3, Vec3 } from 'cc';
import { GuideLine } from './GuideLine';
import { Player } from '../Player/Player';
import { MoveDrive } from '../../Base/MoveRot/MoveDrive';
import { MonsterCreate } from '../Monster/MonsterCreate';
import { BulletEnum, EffectEnum, LayerEnum, MonsterType, PoolEnum, PrefabsEnum, RoleEnum, SoundEnum } from '../../Base/EnumList';
import PoolManager from '../../Base/PoolManager';
import { PrefabsManager } from '../../Base/PrefabsManager';
import { Role } from '../Player/Role';
import { JumpManager } from '../Jump/JumpManager';
import { EffectManager } from '../Effect/EffectManager';
import BezierCurve from '../Jump/BezierCurve';
import { JumpCurve3D } from '../Jump/JumpCurve3D';
import { FbxManager } from '../SkAnim/FbxManager';
import BulletBattle3D from '../Battle/Battle3D/Bullet/BulletBattle3D';
import { BulletBatchRenderer } from '../Battle/BulletBatchRenderer';
import LayerManager from '../../Base/LayerManager';
import AudioManager from '../../Base/AudioManager';
import { FlashRedManager } from '../Battle/Base/FlashRedManager';
import { EffectTimePartRemove } from '../Effect/EffectTimePartRemove';
import { MonsterBattleTaerget } from '../Monster/MonsterBattleTaerget';
import { PropArms } from '../Other/PropArms';
import { CameraMove } from '../../Base/CameraMove';
const { ccclass, property } = _decorator;

type WarmupTask = {
    poolKey: string;
    prefabType: PrefabsEnum;
    prefabIndex: number;
    component?: any;
    count: number;
    bullet3D?: boolean;
};

type PendingRenderWarmup = {
    poolKey: string;
    item: any;
    node: Node;
    framesRemaining: number;
};

enum StartupPhase {
    Bootstrap,
    Initializing,
    Settling,
    PreparingGuide,
    Complete,
}

enum FirstOilGuidePhase {
    Waiting,
    Moving,
    Marking,
    Finished,
}

@ccclass('GuideManager')
export class GuideManager extends Component {

    public static instance: GuideManager;

    @property(Node)
    public roleNode: Node;

    private isLock: boolean = false;

    @property(Animation)
    public handAnim: Animation;

    @property({ type: CCBoolean, displayName: '启用开局引导', tooltip: '关闭后跳过加载界面、手势、引导线和到达检测，进入场景后直接开始游戏。' })
    public enableStartGuide: boolean = true;

    @property(CCFloat)
    public startGuideReachX: number = 0.35;

    @property({ type: CCBoolean, displayName: '启用首个油桶引导', tooltip: '非强制引导：先提示玩家横向移动并对准首个油桶，再用手势标记油桶；不锁定移动和战斗。' })
    public enableFirstOilGuide: boolean = true;

    @property({ type: CCFloat, displayName: '首个油桶引导触发距离', min: 0.1 })
    public firstOilGuideTriggerDistance: number = 45;

    @property({ type: CCFloat, displayName: '首个油桶移动对齐范围', min: 0.1, tooltip: '玩家中心与油桶中心的横向距离小于该值后，移动提示切换为油桶标记。' })
    public firstOilGuideAlignRange: number = 2.5;

    @property({ type: CCFloat, displayName: '首个油桶标记高度', min: 0, tooltip: '油桶标记相对油桶根节点向上的世界坐标高度。' })
    public firstOilGuideMarkerHeight: number = 4.5;

    @property({ type: CCFloat, displayName: '首个油桶标记缩放', min: 0.1, tooltip: '油桶上方手势标记的基础缩放。' })
    public firstOilGuideMarkerScale: number = 1.5;

    private loadingNode: Node = null;
    private loadingProgress: Sprite = null;
    private loadingAnimation: Animation = null;
    private warmupTasks: WarmupTask[] = [];
    private warmupTaskIndex: number = 0;
    @property({ type: CCInteger, displayName: '每帧预热数量', min: 1, tooltip: '加载界面期间每帧创建并提交渲染的预制体数量。数值越大读条越快，但加载阶段单帧压力越高。' })
    public warmupPerFrame: number = 4;

    @property({ type: CCInteger, displayName: '预热保留渲染帧数', min: 1, tooltip: '预热对象至少保持可渲染多少帧后再回收到对象池。建议保持 1~2 帧，确保材质、Shader 和 GPU 资源真正完成首次提交。' })
    public warmupRenderFrames: number = 1;

    @property({ type: CCInteger, displayName: '加载与引导稳定帧数', min: 1, tooltip: '初始化完成及引导节点激活后，分别继续保留加载遮罩的渲染帧数，防止怪物、任务节点、手势或引导线在遮罩撤下后才闪现。' })
    public startupSettleFrames: number = 3;

    private warmupRoot: Node = null;
    private pendingRenderWarmups: PendingRenderWarmup[] = [];
    private warmupTotalCount: number = 0;
    private warmupCompletedCount: number = 0;
    private soundWarmupTotalCount: number = 0;
    private pendingSoundWarmupCount: number = 0;
    private startupPhase: StartupPhase = StartupPhase.Bootstrap;
    private startGuidePlayerX: number = 0;
    private startGuideTargetX: number = 0;
    private hasStartGuidePosition: boolean = false;
    private warmupInitialized: boolean = false;
    private startGuideLineBound: boolean = false;
    private loadingPhaseInitialized: boolean = false;
    private loadingReadyFrameCount: number = 0;
    private startGuideReadyFrameCount: number = 0;
    private displayedLoadingProgress: number = 0;
    private firstOilGuideTarget: PropArms | null = null;
    private firstOilGuidePhase: FirstOilGuidePhase = FirstOilGuidePhase.Waiting;
    private firstOilGuideSearchTimer: number = 0;
    private firstOilGuideMoveTarget: Node | null = null;
    private firstOilGuideHandDirectionRoot: Node | null = null;
    private firstOilGuideMoveHandActive: boolean = false;
    private firstOilGuideSwipeDirection: number = 0;
    private firstOilGuideMoveHandTime: number = 0;
    private firstOilGuideMarkerActive: boolean = false;
    private firstOilGuideMarkerTime: number = 0;
    private firstOilGuideMoveTargetPos: Vec3 = v3();
    private firstOilGuideMarkerWorldPos: Vec3 = v3();
    private firstOilGuideMarkerUIPos: Vec3 = v3();

    protected onLoad(): void {
        GuideManager.instance = this;
        if (this.enableStartGuide) {
            this.beginLoadingPhase();
        }
    }

    start() {
        GuideManager.instance = this;
        if (!this.enableStartGuide) {
            this.disableStartGuide();
            return;
        }
        this.beginLoadingPhase();
        this.initWarmupTasks();
    }

    private beginLoadingPhase(): void {
        if (this.loadingPhaseInitialized) {
            return;
        }
        this.lockGameplay();
        this.initLoadingView();
        this.loadingPhaseInitialized = !!this.loadingNode;
        this.startupPhase = StartupPhase.Bootstrap;
        this.loadingReadyFrameCount = 0;
        this.startGuideReadyFrameCount = 0;
    }

    private disableStartGuide(): void {
        this.isLock = true;
        this.startupPhase = StartupPhase.Complete;
        this.startGuideReadyFrameCount = 0;
        this.hasStartGuidePosition = false;
        this.startGuideLineBound = false;
        this.setGuideVisualActive(false);
        GuideLine.instance?.setLineNode();

        let root = this.node;
        while (root.parent) {
            root = root.parent;
        }
        const loading = this.findNodeByName(root, 'loading');
        if (loading) {
            loading.active = false;
        }

        this.setGameplayActive(true, false);
        this.scheduleOnce(() => {
            this.setGameplayActive(true, false);
            GuideLine.instance?.setLineNode();
        }, 0);
    }

    update(dt: number) {
        if (!this.warmupInitialized) {
            this.initWarmupTasks();
        }
        if (this.startupPhase === StartupPhase.Complete) {
            this.updateFirstOilGuide(dt);
            if (this.isLock) {
                return;
            }
            this.checkStartGuideReached();
            return;
        }

        if (this.isLock || !this.loadingNode) {
            return;
        }

        this.keepLoadingMaskVisible();
        if (!this.warmupInitialized) {
            this.updateLoadingProgress(false);
            return;
        }

        if (this.startupPhase === StartupPhase.Bootstrap) {
            this.startupPhase = StartupPhase.Initializing;
        }

        if (this.startupPhase === StartupPhase.Initializing) {
            this.runWarmup();
            if (this.isLoadingComplete()) {
                this.startupPhase = StartupPhase.Settling;
                this.loadingReadyFrameCount = 0;
            }
            this.updateLoadingProgress(false);
            return;
        }

        if (this.startupPhase === StartupPhase.Settling) {
            if (!this.isLoadingComplete()) {
                this.startupPhase = StartupPhase.Initializing;
                this.loadingReadyFrameCount = 0;
                this.updateLoadingProgress(false);
                return;
            }
            this.loadingReadyFrameCount++;
            this.updateLoadingProgress(false);
            if (this.loadingReadyFrameCount >= Math.max(1, Math.floor(this.startupSettleFrames))) {
                this.prepareStartGuide();
            }
            return;
        }

        if (this.startupPhase === StartupPhase.PreparingGuide) {
            this.refreshStartGuideVisualBinding();
            const displayReady = this.isStartGuideDisplayReady();
            this.startGuideReadyFrameCount = displayReady ? this.startGuideReadyFrameCount + 1 : 0;
            const revealReady = displayReady
                && this.startGuideReadyFrameCount >= Math.max(1, Math.floor(this.startupSettleFrames));
            this.updateLoadingProgress(revealReady);
            if (revealReady) {
                this.completeStartup();
            }
        }
    }

    private lockGameplay() {
        this.isLock = false;
        this.startupPhase = StartupPhase.Bootstrap;
        this.loadingReadyFrameCount = 0;
        this.startGuideReadyFrameCount = 0;
        this.hasStartGuidePosition = false;
        this.setGuideVisualActive(false);
        this.setGameplayActive(false, false);
    }

    private setGameplayActive(active: boolean, guideMoveOnly: boolean = false) {
        if (Player.instance) {
            Player.instance.isLock = active;
        }
        MoveDrive.isMoveOk = active;
        MoveDrive.isGuideMoveOnly = guideMoveOnly;
        MonsterCreate.isStartMove = active;
    }

    private setGuideVisualActive(active: boolean) {
        if (this.roleNode) {
            this.roleNode.active = active;
        }
        if (this.handAnim?.node) {
            this.handAnim.node.active = active;
            if (active) {
                this.handAnim.play();
            } else {
                this.handAnim.stop();
            }
        }
    }

    private prepareStartGuide() {
        if (this.startupPhase === StartupPhase.PreparingGuide || this.startupPhase === StartupPhase.Complete || this.isLock) {
            return;
        }
        this.keepLoadingMaskVisible();
        this.startupPhase = StartupPhase.PreparingGuide;
        this.startGuideReadyFrameCount = 0;
        this.startGuideLineBound = false;
        this.cacheStartGuidePosition();
        this.setGameplayActive(false, true);
        this.setGuideVisualActive(true);
        this.refreshStartGuideVisualBinding();
    }

    private completeStartup(): void {
        this.updateLoadingProgress(true);
        if (this.loadingNode) {
            this.loadingNode.active = false;
        }
        this.startupPhase = StartupPhase.Complete;
    }

    private updateFirstOilGuide(dt: number): void {
        if (!this.enableFirstOilGuide) {
            if (this.firstOilGuidePhase === FirstOilGuidePhase.Moving
                || this.firstOilGuidePhase === FirstOilGuidePhase.Marking) {
                this.finishFirstOilGuide();
            }
            return;
        }

        if (this.firstOilGuidePhase === FirstOilGuidePhase.Finished) {
            return;
        }

        if (this.firstOilGuidePhase !== FirstOilGuidePhase.Waiting) {
            if (this.isFirstOilGuideTargetFinished()) {
                this.finishFirstOilGuide();
                return;
            }
        }

        if (this.firstOilGuidePhase === FirstOilGuidePhase.Waiting) {
            this.firstOilGuideSearchTimer -= Math.max(0, dt);
            if (!this.firstOilGuideTarget || !this.firstOilGuideTarget.node?.isValid || this.firstOilGuideSearchTimer <= 0) {
                this.firstOilGuideSearchTimer = 0.25;
                this.firstOilGuideTarget = this.findFirstOilGuideTarget();
            }
            const playerNode = this.getGuidePlayerNode();
            const oilNode = this.firstOilGuideTarget?.node;
            if (!playerNode?.isValid || !oilNode?.activeInHierarchy) {
                return;
            }
            const distanceZ = oilNode.worldPosition.z - playerNode.worldPosition.z;
            if (distanceZ > Math.max(0.1, this.firstOilGuideTriggerDistance)) {
                return;
            }
            this.firstOilGuidePhase = FirstOilGuidePhase.Moving;
        }

        if (this.firstOilGuidePhase === FirstOilGuidePhase.Moving) {
            if (this.isFirstOilGuidePlayerAligned()) {
                this.firstOilGuidePhase = FirstOilGuidePhase.Marking;
                this.hideFirstOilMoveGuide();
            } else {
                this.refreshFirstOilMoveGuide(dt);
                return;
            }
        }

        if (this.firstOilGuidePhase === FirstOilGuidePhase.Marking) {
            this.refreshFirstOilMarker(dt);
        }
    }

    private isFirstOilGuidePlayerAligned(): boolean {
        const playerNode = this.getGuidePlayerNode();
        const target = this.firstOilGuideTarget;
        if (!playerNode?.isValid || !target?.node?.isValid) {
            return false;
        }
        const targetHalfX = Math.max(0.1, target.collisionHalfX ?? 0.1);
        const alignRange = Math.min(targetHalfX, Math.max(0.1, this.firstOilGuideAlignRange));
        return Math.abs(playerNode.worldPosition.x - target.node.worldPosition.x) <= alignRange;
    }

    private refreshFirstOilMoveGuide(dt: number): void {
        const playerNode = this.getGuidePlayerNode();
        const oilNode = this.firstOilGuideTarget?.node;
        if (!playerNode?.isValid || !oilNode?.isValid) {
            return;
        }

        const moveTarget = this.getOrCreateFirstOilGuideMoveTarget();
        if (moveTarget?.isValid) {
            this.firstOilGuideMoveTargetPos.set(
                oilNode.worldPosition.x,
                playerNode.worldPosition.y,
                playerNode.worldPosition.z,
            );
            moveTarget.setWorldPosition(this.firstOilGuideMoveTargetPos);
            GuideLine.instance?.setLineNode(playerNode, moveTarget);
        }

        this.updateFirstOilMoveHand(playerNode.worldPosition.x, oilNode.worldPosition.x, dt);
    }

    private getOrCreateFirstOilGuideMoveTarget(): Node | null {
        if (this.firstOilGuideMoveTarget?.isValid) {
            return this.firstOilGuideMoveTarget;
        }
        this.firstOilGuideMoveTarget = new Node('首个油桶移动引导目标');
        this.node.addChild(this.firstOilGuideMoveTarget);
        return this.firstOilGuideMoveTarget;
    }

    private updateFirstOilMoveHand(playerX: number, targetX: number, dt: number): void {
        if (!this.handAnim?.node?.isValid) {
            return;
        }
        // 角色横移在 MoveDrive 中使用 -rocker.x：目标在玩家右侧时需要向左滑，反之向右滑。
        const playerMoveDirection = targetX > playerX ? 1 : -1;
        const swipeDirection = -playerMoveDirection;
        const directionRoot = this.getOrCreateFirstOilGuideHandDirectionRoot();
        if (!directionRoot?.isValid) {
            return;
        }
        if (!Number.isFinite(this.firstOilGuideMoveHandTime)) {
            this.firstOilGuideMoveHandTime = 0;
        }
        const directionChanged = this.firstOilGuideSwipeDirection !== swipeDirection;
        if (!this.firstOilGuideMoveHandActive) {
            this.firstOilGuideMoveHandActive = true;
            this.firstOilGuideMoveHandTime = 0;
        } else if (directionChanged) {
            this.firstOilGuideMoveHandTime = 0;
        } else {
            this.firstOilGuideMoveHandTime = (this.firstOilGuideMoveHandTime + Math.max(0, dt)) % 1;
        }
        this.firstOilGuideSwipeDirection = swipeDirection;
        this.firstOilGuideMarkerActive = false;

        // 油桶引导不再播放 Anim_hand，直接按实际方向复现原 1 秒手势轨迹，避免动画系统覆盖方向。
        this.handAnim.stop();
        this.handAnim.node.active = true;
        directionRoot.setPosition(0, 0, 0);
        directionRoot.setScale(1, 1, 1);
        const time = this.firstOilGuideMoveHandTime;
        const moveProgress = time <= 1 / 3 ? 0 : Math.min(1, (time - 1 / 3) / (2 / 3));
        const handX = swipeDirection * 300 * moveProgress;
        this.handAnim.node.setPosition(handX, -231.5, 0);

        const opacity = this.handAnim.node.getComponent(UIOpacity);
        if (opacity) {
            if (time <= 1 / 3) {
                opacity.opacity = 255 * time / (1 / 3);
            } else if (time <= 5 / 6) {
                opacity.opacity = 255;
            } else {
                opacity.opacity = 255 * (1 - time) / (1 / 6);
            }
        }

        let handScale = 1;
        if (time <= 1 / 3) {
            handScale = 2 + (0.9 - 2) * time / (1 / 3);
        } else if (time <= 0.4) {
            handScale = 0.9 + (1.1 - 0.9) * (time - 1 / 3) / (0.4 - 1 / 3);
        } else if (time <= 13 / 30) {
            handScale = 1.1 + (1 - 1.1) * (time - 0.4) / (13 / 30 - 0.4);
        }
        this.handAnim.node.setScale(handScale, handScale, handScale);
    }

    private getOrCreateFirstOilGuideHandDirectionRoot(): Node | null {
        if (this.firstOilGuideHandDirectionRoot?.isValid) {
            return this.firstOilGuideHandDirectionRoot;
        }
        const handNode = this.handAnim?.node;
        const handParent = handNode?.parent;
        if (!handNode?.isValid || !handParent?.isValid) {
            return null;
        }
        if (handParent.name === '首个油桶手势方向节点') {
            this.firstOilGuideHandDirectionRoot = handParent;
            return this.firstOilGuideHandDirectionRoot;
        }
        this.firstOilGuideHandDirectionRoot = new Node('首个油桶手势方向节点');
        this.firstOilGuideHandDirectionRoot.layer = handNode.layer;
        handParent.addChild(this.firstOilGuideHandDirectionRoot);
        this.firstOilGuideHandDirectionRoot.setPosition(0, 0, 0);
        handNode.parent = this.firstOilGuideHandDirectionRoot;
        return this.firstOilGuideHandDirectionRoot;
    }

    private hideFirstOilMoveGuide(): void {
        GuideLine.instance?.setLineNode();
        this.firstOilGuideMoveHandActive = false;
        this.firstOilGuideSwipeDirection = 0;
        this.firstOilGuideMoveHandTime = 0;
        if (this.handAnim?.node?.isValid) {
            this.handAnim.stop();
            this.handAnim.node.active = false;
        }
    }

    private refreshFirstOilMarker(dt: number): void {
        const oilNode = this.firstOilGuideTarget?.node;
        const handNode = this.handAnim?.node;
        const directionRoot = this.getOrCreateFirstOilGuideHandDirectionRoot();
        const handParent = directionRoot?.parent;
        const camera = CameraMove.instance?.camera;
        if (!oilNode?.isValid || !handNode?.isValid || !directionRoot?.isValid || !handParent?.isValid || !camera) {
            return;
        }

        if (!this.firstOilGuideMarkerActive) {
            this.firstOilGuideMarkerActive = true;
            this.firstOilGuideMoveHandActive = false;
            this.firstOilGuideMarkerTime = 0;
            GuideLine.instance?.setLineNode();
            this.handAnim.stop();
            handNode.active = true;
            const opacity = handNode.getComponent(UIOpacity);
            if (opacity) {
                opacity.opacity = 255;
            }
            directionRoot.setScale(1, 1, 1);
            handNode.setPosition(0, 0, 0);
        }

        this.firstOilGuideMarkerTime += Math.max(0, dt);
        this.firstOilGuideMarkerWorldPos.set(oilNode.worldPosition);
        this.firstOilGuideMarkerWorldPos.y += Math.max(0, this.firstOilGuideMarkerHeight);
        camera.convertToUINode(this.firstOilGuideMarkerWorldPos, handParent, this.firstOilGuideMarkerUIPos);
        directionRoot.setPosition(this.firstOilGuideMarkerUIPos);

        const pulse = 1 + Math.sin(this.firstOilGuideMarkerTime * 5) * 0.1;
        const markerScale = Math.max(0.1, this.firstOilGuideMarkerScale) * pulse;
        handNode.setScale(markerScale, markerScale, markerScale);
    }

    private findFirstOilGuideTarget(): PropArms | null {
        const scene = director.getScene();
        if (!scene) {
            return null;
        }
        const candidates = scene.getComponentsInChildren(PropArms);
        const playerNode = this.getGuidePlayerNode();
        const playerZ = playerNode?.worldPosition.z ?? Number.NEGATIVE_INFINITY;
        let best: PropArms | null = null;
        let bestDistance = Number.POSITIVE_INFINITY;
        for (let i = 0; i < candidates.length; i++) {
            const candidate = candidates[i];
            if (!candidate?.node?.activeInHierarchy || candidate.isDie) {
                continue;
            }
            const distance = candidate.node.worldPosition.z - playerZ;
            if (distance < 0 || distance >= bestDistance) {
                continue;
            }
            best = candidate;
            bestDistance = distance;
        }
        return best;
    }

    private isFirstOilGuideTargetFinished(): boolean {
        const target = this.firstOilGuideTarget;
        if (!target?.node?.isValid || !target.node.activeInHierarchy || target.isDie) {
            return true;
        }
        const playerNode = this.getGuidePlayerNode();
        if (!playerNode?.isValid) {
            return false;
        }
        const playerZ = playerNode.worldPosition.z;
        const targetZ = target.node.worldPosition.z;
        const targetHalfZ = Math.max(0, target.collisionHalfZ ?? 0);
        return targetZ - targetHalfZ <= playerZ;
    }

    private finishFirstOilGuide(): void {
        this.firstOilGuidePhase = FirstOilGuidePhase.Finished;
        this.firstOilGuideTarget = null;
        this.firstOilGuideMoveHandActive = false;
        this.firstOilGuideSwipeDirection = 0;
        this.firstOilGuideMoveHandTime = 0;
        this.firstOilGuideMarkerActive = false;
        GuideLine.instance?.setLineNode();
        if (this.handAnim?.node?.isValid) {
            this.handAnim.stop();
            this.handAnim.node.active = false;
        }
        if (this.firstOilGuideHandDirectionRoot?.isValid) {
            this.firstOilGuideHandDirectionRoot.setScale(1, 1, 1);
        }
        if (this.firstOilGuideMoveTarget?.isValid) {
            this.firstOilGuideMoveTarget.destroy();
        }
        this.firstOilGuideMoveTarget = null;
    }

    private cacheStartGuidePosition() {
        const playerNode = this.getGuidePlayerNode();
        if (!playerNode || !this.roleNode) {
            this.hasStartGuidePosition = false;
            return;
        }
        this.startGuidePlayerX = playerNode.worldPosition.x;
        this.startGuideTargetX = this.roleNode.worldPosition.x;
        this.hasStartGuidePosition = true;
    }

    private getGuidePlayerNode() {
        return Player.instance?.move?.node ?? Player.instance?.node;
    }

    private checkStartGuideReached() {
        const playerNode = this.getGuidePlayerNode();
        if (!playerNode || !this.roleNode) {
            return;
        }
        if (!this.hasStartGuidePosition) {
            this.cacheStartGuidePosition();
        }

        const playerX = playerNode.worldPosition.x;
        const targetX = this.roleNode.worldPosition.x;
        const dx = Math.abs(playerX - targetX);
        const targetOffset = this.hasStartGuidePosition ? this.startGuideTargetX - this.startGuidePlayerX : targetX - playerX;
        const hasPassedTarget = targetOffset >= 0
            ? playerX >= targetX - this.startGuideReachX
            : playerX <= targetX + this.startGuideReachX;
        if (dx <= this.startGuideReachX || hasPassedTarget) {
            this.finishGuide();
        }
    }

    private initLoadingView() {
        let root = this.node;
        while (root.parent) {
            root = root.parent;
        }

        this.loadingNode = this.findNodeByName(root, "loading");
        if (!this.loadingNode) {
            return;
        }

        this.loadingNode.active = true;
        this.loadingAnimation = this.loadingNode.getComponent(Animation);
        if (this.loadingAnimation) {
            this.loadingAnimation.stop();
            this.loadingAnimation.enabled = false;
        }
        this.loadingNode.setScale(1, 1, 1);
        const progressNode = this.findNodeByName(this.loadingNode, "img_hp_0") || this.findNodeByName(this.loadingNode, "img_hp_1");
        this.loadingProgress = progressNode ? progressNode.getComponent(Sprite) : null;
        if (this.loadingProgress) {
            this.loadingProgress.fillRange = 0;
        }
        this.displayedLoadingProgress = 0;
    }

    private keepLoadingMaskVisible(): void {
        if (!this.loadingNode?.isValid) {
            return;
        }
        if (!this.loadingNode.active) {
            this.loadingNode.active = true;
        }
        const scale = this.loadingNode.scale;
        if (scale.x !== 1 || scale.y !== 1 || scale.z !== 1) {
            this.loadingNode.setScale(1, 1, 1);
        }
    }

    private initWarmupTasks() {
        if (this.warmupInitialized || !PrefabsManager.instance) {
            return;
        }
        this.warmupRoot = new Node("WarmupPool");
        // 必须保持激活并跨过至少一次真实渲染，单帧内激活后立即隐藏无法触发 Shader/GPU 预热。
        this.warmupRoot.active = true;
        this.node.addChild(this.warmupRoot);

        JumpManager.instance;
        EffectManager.instance;
        PoolManager.instance.setPool(PoolEnum.JumpSequence + BezierCurve, new BezierCurve());
        PoolManager.instance.setPool(PoolEnum.JumpSequence + JumpCurve3D, new JumpCurve3D());
        this.preloadSounds();

        this.warmupTasks = [
            { poolKey: PoolEnum.role + RoleEnum.underling, prefabType: PrefabsEnum.hero, prefabIndex: RoleEnum.underling, component: Role, count: 60 },
            { poolKey: PoolEnum.role + RoleEnum.dazhuang, prefabType: PrefabsEnum.hero, prefabIndex: RoleEnum.dazhuang, component: Role, count: 60 },
            { poolKey: PoolEnum.role + RoleEnum.dazhuangPlus, prefabType: PrefabsEnum.hero, prefabIndex: RoleEnum.dazhuangPlus, component: Role, count: 60 },
            { poolKey: PoolEnum.bullet + BulletEnum.arrow, prefabType: PrefabsEnum.bullet, prefabIndex: BulletEnum.arrow, component: BulletBattle3D, count: 8, bullet3D: true },
            { poolKey: PoolEnum.bullet + BulletEnum.arrow_1, prefabType: PrefabsEnum.bullet, prefabIndex: BulletEnum.arrow_1, component: BulletBattle3D, count: 8, bullet3D: true },
            { poolKey: PoolEnum.bullet + BulletEnum.arrow_2, prefabType: PrefabsEnum.bullet, prefabIndex: BulletEnum.arrow_2, component: BulletBattle3D, count: 8, bullet3D: true },
            { poolKey: PoolEnum.bullet + BulletEnum.arrow_3, prefabType: PrefabsEnum.bullet, prefabIndex: BulletEnum.arrow_3, component: BulletBattle3D, count: 8, bullet3D: true },
            { poolKey: PoolEnum.bullet + BulletEnum.arrow_4, prefabType: PrefabsEnum.bullet, prefabIndex: BulletEnum.arrow_4, component: BulletBattle3D, count: 8, bullet3D: true },
            { poolKey: PoolEnum.effect + EffectEnum.up, prefabType: PrefabsEnum.effect, prefabIndex: EffectEnum.up, count: 6 },
            { poolKey: PoolEnum.effect + EffectEnum.Monsterhit, prefabType: PrefabsEnum.effect, prefabIndex: EffectEnum.Monsterhit, count: 6 },
            { poolKey: PoolEnum.effect + EffectEnum.tireHIt, prefabType: PrefabsEnum.effect, prefabIndex: EffectEnum.tireHIt, count: 4 },
            { poolKey: PoolEnum.effect + EffectEnum.door, prefabType: PrefabsEnum.effect, prefabIndex: EffectEnum.door, count: 6 },
            { poolKey: PoolEnum.monster + MonsterType.ZombieBaby_0, prefabType: PrefabsEnum.monster, prefabIndex: MonsterType.ZombieBaby_0, component: MonsterBattleTaerget, count: 12 },
            { poolKey: PoolEnum.monster + MonsterType.ZombieBaby_1, prefabType: PrefabsEnum.monster, prefabIndex: MonsterType.ZombieBaby_1, component: MonsterBattleTaerget, count: 12 },
            { poolKey: PoolEnum.monster + MonsterType.ZombieBrother, prefabType: PrefabsEnum.monster, prefabIndex: MonsterType.ZombieBrother, component: MonsterBattleTaerget, count: 4 },
        ];
        this.warmupTaskIndex = 0;
        this.warmupTotalCount = 0;
        for (let i = 0; i < this.warmupTasks.length; i++) {
            this.warmupTotalCount += Math.max(0, this.warmupTasks[i].count);
        }
        this.warmupCompletedCount = 0;
        this.warmupInitialized = true;
    }

    private preloadSounds(): void {
        const sounds = [
            SoundEnum.Sound_Gun,
            SoundEnum.Sound_FireGun,
            SoundEnum.Sound_Ship_UpLevel,
            SoundEnum.Sound_PlaceGold,
            SoundEnum.Sound_Monster_Die,
            SoundEnum.Sound_Monster_Hit,
            SoundEnum.Sound_tire_hit,
            SoundEnum.Sound_boss_attack,
            SoundEnum.Sound_boss_die,
            SoundEnum.Sound_downST,
        ];
        this.soundWarmupTotalCount = sounds.length;
        this.pendingSoundWarmupCount = sounds.length;
        for (let i = 0; i < sounds.length; i++) {
            AudioManager.inst.preload(sounds[i], () => {
                this.pendingSoundWarmupCount = Math.max(0, this.pendingSoundWarmupCount - 1);
            });
        }
    }

    private runWarmup() {
        if (!this.warmupRoot) {
            return;
        }
        this.recycleRenderedWarmups();

        let count = Math.max(1, Math.floor(this.warmupPerFrame));
        while (count > 0 && this.warmupTaskIndex < this.warmupTasks.length) {
            const task = this.warmupTasks[this.warmupTaskIndex];
            const node = PrefabsManager.instance.GetPrefabsIns(task.prefabType, task.prefabIndex);
            this.warmupRoot.addChild(node);
            this.prewarmNode(node, task);
            const item = task.component ? node.getComponent(task.component) : node;
            if (task.bullet3D && item) {
                this.prewarmBulletBatch(item as BulletBattle3D);
            }
            this.pendingRenderWarmups.push({
                poolKey: task.poolKey,
                item,
                node,
                framesRemaining: Math.max(1, Math.floor(this.warmupRenderFrames)),
            });
            task.count--;
            count--;
            if (task.count <= 0) {
                this.warmupTaskIndex++;
            }
        }
    }

    private recycleRenderedWarmups(): void {
        for (let i = this.pendingRenderWarmups.length - 1; i >= 0; i--) {
            const pending = this.pendingRenderWarmups[i];
            pending.framesRemaining--;
            if (pending.framesRemaining > 0) {
                continue;
            }
            pending.node.active = false;
            PoolManager.instance.setPool(pending.poolKey, pending.item);
            this.pendingRenderWarmups.splice(i, 1);
            this.warmupCompletedCount++;
        }
    }

    private prewarmNode(node: Node, task: WarmupTask): void {
        node.active = true;
        // 放到主相机前方的道路区域，确保模型会进入一次真实渲染队列；加载遮罩会盖住这些临时对象。
        const playerWorldPos = Player.instance?.node?.worldPosition;
        if (playerWorldPos) {
            node.setWorldPosition(0, playerWorldPos.y, playerWorldPos.z + 12);
        }

        const fbxManagers = node.getComponentsInChildren(FbxManager);
        for (let i = 0; i < fbxManagers.length; i++) {
            fbxManagers[i].prewarmAnimations();
        }

        if (task.prefabType === PrefabsEnum.effect) {
            this.prewarmEffect(node);
        } else if (task.prefabType === PrefabsEnum.hero) {
            this.prewarmRole(node);
        } else if (task.prefabType === PrefabsEnum.monster) {
            this.prewarmMonster(node);
        }

    }

    private prewarmBulletBatch(bullet: BulletBattle3D): void {
        const bulletLayer = LayerManager.instance?.getLayer(LayerEnum.BulletLayer);
        if (!bulletLayer) {
            return;
        }
        Role.bulletLayer = bulletLayer;
        BulletBatchRenderer.prewarm(bulletLayer, bullet);
    }

    private isWarmupComplete(): boolean {
        if (!this.warmupInitialized) {
            return false;
        }
        const prefabWarmupComplete = this.warmupTasks.length <= 0 || this.warmupTaskIndex >= this.warmupTasks.length;
        return prefabWarmupComplete
            && this.pendingRenderWarmups.length <= 0
            && this.pendingSoundWarmupCount <= 0;
    }

    private isLoadingComplete(): boolean {
        return this.isWarmupComplete()
            && this.isStartGuideDependencyReady()
            && !!MonsterCreate.instance?.isInitialViewportSpawnReady();
    }

    private updateLoadingProgress(forceComplete: boolean): void {
        if (!this.loadingProgress) {
            return;
        }
        const actualProgress = forceComplete ? 1 : this.getActualLoadingProgress();
        this.displayedLoadingProgress = Math.max(this.displayedLoadingProgress, actualProgress);
        const nextProgress = Math.min(1, this.displayedLoadingProgress);
        if (Math.abs(this.loadingProgress.fillRange - nextProgress) > 0.0001) {
            this.loadingProgress.fillRange = nextProgress;
        }
    }

    private getActualLoadingProgress(): number {
        if (!this.warmupInitialized) {
            return 0;
        }

        const settleFrameTotal = Math.max(1, Math.floor(this.startupSettleFrames));
        const monsterCreate = MonsterCreate.instance;
        const monsterWorkTotal = monsterCreate?.getInitialViewportSpawnWorkTotal() ?? 1;
        const monsterCompletedWork = monsterCreate?.getInitialViewportSpawnCompletedWork() ?? 0;
        const dependencyWorkTotal = 4;
        const guideVisualWorkTotal = 3;

        const totalWork = Math.max(1,
            this.warmupTotalCount
            + this.soundWarmupTotalCount
            + dependencyWorkTotal
            + monsterWorkTotal
            + settleFrameTotal
            + guideVisualWorkTotal
            + settleFrameTotal
        );
        const completedWork = Math.min(this.warmupTotalCount, this.warmupCompletedCount)
            + Math.max(0, this.soundWarmupTotalCount - this.pendingSoundWarmupCount)
            + this.getStartGuideDependencyCompletedWork()
            + Math.min(monsterWorkTotal, monsterCompletedWork)
            + Math.min(settleFrameTotal, this.loadingReadyFrameCount)
            + this.getStartGuideVisualCompletedWork()
            + Math.min(settleFrameTotal, this.startGuideReadyFrameCount);
        return Math.max(0, Math.min(1, completedWork / totalWork));
    }

    private getStartGuideDependencyCompletedWork(): number {
        let completed = 0;
        if (this.roleNode?.isValid) {
            completed++;
        }
        if (!this.handAnim || this.handAnim.node?.isValid) {
            completed++;
        }
        if (Player.instance?.node?.isValid && this.getGuidePlayerNode()?.isValid) {
            completed++;
        }
        if (GuideLine.instance?.node?.isValid) {
            completed++;
        }
        return completed;
    }

    private getStartGuideVisualCompletedWork(): number {
        if (this.startupPhase !== StartupPhase.PreparingGuide && this.startupPhase !== StartupPhase.Complete) {
            return 0;
        }
        let completed = this.roleNode?.activeInHierarchy ? 1 : 0;
        if (this.handAnim?.node?.activeInHierarchy) {
            const handOpacity = this.handAnim.node.getComponent(UIOpacity);
            completed += handOpacity ? Math.max(0, Math.min(1, handOpacity.opacity / 255)) : 1;
        }
        if (this.startGuideLineBound && GuideLine.instance?.node?.activeInHierarchy) {
            completed++;
        }
        return completed;
    }

    private isStartGuideDependencyReady(): boolean {
        if (!this.roleNode?.isValid) {
            return false;
        }
        if (this.handAnim && !this.handAnim.node?.isValid) {
            return false;
        }
        if (!Player.instance?.node?.isValid || !this.getGuidePlayerNode()?.isValid) {
            return false;
        }
        if (!GuideLine.instance?.node?.isValid) {
            return false;
        }
        return true;
    }

    private refreshStartGuideVisualBinding(): void {
        if (this.startupPhase !== StartupPhase.PreparingGuide || !this.roleNode?.isValid) {
            this.startGuideLineBound = false;
            return;
        }
        const playerNode = this.getGuidePlayerNode();
        if (!playerNode?.isValid || !GuideLine.instance?.node?.isValid) {
            this.startGuideLineBound = false;
            return;
        }
        GuideLine.instance.setLineNode(playerNode, this.roleNode);
        this.startGuideLineBound = true;
    }

    private isStartGuideDisplayReady(): boolean {
        if (this.startupPhase !== StartupPhase.PreparingGuide) {
            return false;
        }
        if (!this.roleNode?.activeInHierarchy) {
            return false;
        }
        if (this.handAnim?.node && !this.handAnim.node.activeInHierarchy) {
            return false;
        }
        const handOpacity = this.handAnim?.node?.getComponent(UIOpacity);
        if (handOpacity && handOpacity.opacity < 250) {
            return false;
        }
        return this.startGuideLineBound && !!GuideLine.instance?.node?.activeInHierarchy;
    }

    private prewarmEffect(node: Node): void {
        const effect = node.getComponent(EffectTimePartRemove);
        if (!effect) {
            return;
        }
        node.active = true;
    }

    private prewarmRole(node: Node): void {
        const role = node.getComponent(Role);
        if (!role) {
            return;
        }

        if (role.effect) {
            role.effect.play();
            role.effect.stop();
        }

        if (role.meshCreateDataList?.length > 0) {
            FlashRedManager.instance.prewarm(role.node, role.meshCreateDataList);
        }
        if (role.meshRedDataList?.length > 0) {
            FlashRedManager.instance.prewarm(role.node, role.meshRedDataList);
        }
    }

    private prewarmMonster(node: Node): void {
        const monster = node.getComponent(MonsterBattleTaerget);
        if (!monster) {
            return;
        }
        monster.prewarmDeathVisualMaterials();
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
        this.startupPhase = StartupPhase.Complete;
        this.startGuideReadyFrameCount = 0;
        this.hasStartGuidePosition = false;
        this.startGuideLineBound = false;
        this.setGuideVisualActive(false);
        GuideLine.instance?.setLineNode();
        this.setGameplayActive(true, false);
    }

}
