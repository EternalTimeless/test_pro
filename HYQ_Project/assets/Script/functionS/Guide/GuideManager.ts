import { _decorator, Animation, CCFloat, Component, Node, Sprite } from 'cc';
import { GuideLine } from './GuideLine';
import { Player } from '../Player/Player';
import { MoveDrive } from '../../Base/MoveRot/MoveDrive';
import { MonsterCreate } from '../Monster/MonsterCreate';
import { BulletEnum, EffectEnum, LayerEnum, PoolEnum, PrefabsEnum, RoleEnum, SoundEnum } from '../../Base/EnumList';
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
const { ccclass, property } = _decorator;

type WarmupTask = {
    poolKey: string;
    prefabType: PrefabsEnum;
    prefabIndex: number;
    component?: any;
    count: number;
    bullet3D?: boolean;
};

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
    @property(CCFloat)
    public startGuideReachX: number = 0.35;

    private loadingNode: Node = null;
    private loadingProgress: Sprite = null;
    private loadingTime: number = 0;
    private warmupTasks: WarmupTask[] = [];
    private warmupTaskIndex: number = 0;
    private warmupPerFrame: number = 4;
    private warmupRoot: Node = null;
    private pendingSoundWarmupCount: number = 0;
    private pendingRuntimeWarmupCount: number = 0;
    private waitingStartGuide: boolean = false;
    private startGuidePlayerX: number = 0;
    private startGuideTargetX: number = 0;
    private hasStartGuidePosition: boolean = false;

    start() {
        GuideManager.instance = this;
        this.lockGameplay();
        this.initLoadingView();
        this.initWarmupTasks();
    }

    update(dt: number) {
        if (this.isLock) {
            return;
        }

        if (this.waitingStartGuide) {
            this.checkStartGuideReached();
            return;
        }

        if (!this.loadingNode || !this.loadingNode.active) {
            this.showStartGuide();
            return;
        }

        this.loadingTime += dt;
        this.runWarmup();
        const progress = this.loadingDuration <= 0 ? 1 : Math.min(1, this.loadingTime / this.loadingDuration);
        if (this.loadingProgress) {
            this.loadingProgress.fillRange = progress;
        }

        if (progress >= 1 && this.isWarmupComplete()) {
            this.loadingNode.active = false;
            this.showStartGuide();
        }
    }

    private lockGameplay() {
        this.isLock = false;
        this.waitingStartGuide = false;
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

    private showStartGuide() {
        if (this.waitingStartGuide || this.isLock) {
            return;
        }
        this.waitingStartGuide = true;
        this.cacheStartGuidePosition();
        this.setGameplayActive(false, true);
        this.setGuideVisualActive(true);
        if (this.roleNode) {
            GuideLine.instance?.setLineNode(this.getGuidePlayerNode(), this.roleNode);
        }
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
            this.showStartGuide();
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

    private initWarmupTasks() {
        if (!PrefabsManager.instance) {
            return;
        }
        this.warmupRoot = new Node("WarmupPool");
        this.warmupRoot.active = false;
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
            { poolKey: PoolEnum.effect + EffectEnum.door, prefabType: PrefabsEnum.effect, prefabIndex: EffectEnum.door, count: 6 },
        ];
        this.warmupTaskIndex = 0;
    }

    private preloadSounds(): void {
        const sounds = [
            SoundEnum.Sound_Gun,
            SoundEnum.Sound_FireGun,
            SoundEnum.Sound_Ship_UpLevel,
            SoundEnum.Sound_PlaceGold,
        ];
        this.pendingSoundWarmupCount = sounds.length;
        for (let i = 0; i < sounds.length; i++) {
            AudioManager.inst.preload(sounds[i], () => {
                this.pendingSoundWarmupCount--;
            });
        }
    }

    private runWarmup() {
        if (!this.warmupRoot) {
            return;
        }
        let count = this.warmupPerFrame;
        while (count > 0 && this.warmupTaskIndex < this.warmupTasks.length) {
            const task = this.warmupTasks[this.warmupTaskIndex];
            const node = PrefabsManager.instance.GetPrefabsIns(task.prefabType, task.prefabIndex);
            this.warmupRoot.addChild(node);
            this.prewarmNode(node, task);
            const item = task.component ? node.getComponent(task.component) : node;
            if (task.bullet3D && item) {
                this.prewarmBulletBatch(item as BulletBattle3D);
            }
            node.active = false;
            PoolManager.instance.setPool(task.poolKey, item);
            task.count--;
            count--;
            if (task.count <= 0) {
                this.warmupTaskIndex++;
            }
        }
    }

    private prewarmNode(node: Node, task: WarmupTask): void {
        const wasRootActive = this.warmupRoot?.active ?? false;
        if (this.warmupRoot && !wasRootActive) {
            this.warmupRoot.active = true;
        }
        node.active = true;

        const fbxManagers = node.getComponentsInChildren(FbxManager);
        for (let i = 0; i < fbxManagers.length; i++) {
            fbxManagers[i].prewarmAnimations();
        }

        if (task.prefabType === PrefabsEnum.effect) {
            this.prewarmEffect(node);
        } else if (task.prefabType === PrefabsEnum.hero) {
            this.prewarmRole(node);
        }

        node.active = false;
        if (this.warmupRoot && !wasRootActive) {
            this.warmupRoot.active = false;
        }
    }

    private prewarmBulletBatch(bullet: BulletBattle3D): void {
        const bulletLayer = LayerManager.instance?.getLayer(LayerEnum.BulletLayer);
        if (!bulletLayer) {
            return;
        }
        Role.bulletLayer = bulletLayer;
        BulletBatchRenderer.getOrCreate(bulletLayer).prewarmBullet(bullet);
    }

    private isWarmupComplete(): boolean {
        const prefabWarmupComplete = this.warmupTasks.length <= 0 || this.warmupTaskIndex >= this.warmupTasks.length;
        return prefabWarmupComplete && this.pendingSoundWarmupCount <= 0 && this.pendingRuntimeWarmupCount <= 0;
    }

    private prewarmEffect(node: Node): void {
        const effect = node.getComponent(EffectTimePartRemove);
        if (!effect) {
            return;
        }
        this.pendingRuntimeWarmupCount++;
        node.active = true;
        this.scheduleOnce(() => {
            node.active = false;
            PoolManager.instance.setPool(PoolEnum.effect + effect.index, node);
            this.pendingRuntimeWarmupCount--;
        }, 0);
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
        this.waitingStartGuide = false;
        this.hasStartGuidePosition = false;
        this.setGuideVisualActive(false);
        GuideLine.instance?.setLineNode();
        this.setGameplayActive(true, false);
    }

}
