import { _decorator, Animation, CCBoolean, CCFloat, CCInteger, Component, Node, Sprite, UIOpacity } from 'cc';
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
        if (this.isLock) {
            return;
        }

        if (!this.loadingNode) {
            return;
        }

        if (this.startupPhase === StartupPhase.Complete) {
            this.checkStartGuideReached();
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
        if (monster.meshFlashDataList_Die?.length > 0) {
            FlashRedManager.instance.prewarm(monster.node, monster.meshFlashDataList_Die);
        }
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
