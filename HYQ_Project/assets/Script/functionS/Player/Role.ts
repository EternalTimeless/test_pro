import { _decorator, CCFloat, CCInteger, Color, Component, MeshRenderer, Node, Quat, Tween, Vec3 } from 'cc';
import { FbxManager } from '../SkAnim/FbxManager';
import { BulletEnum, LayerEnum, RoleEnum, SoundEnum } from '../../Base/EnumList';
import BulletManager from '../Battle/BulletManager';
import LayerManager from '../../Base/LayerManager';
import { MeshFlashData } from '../Battle/Base/BattleTargetBase';
import { FlashRedManager } from '../Battle/Base/FlashRedManager';
import { AttackParkPlay } from '../Battle/Battle3D/AttackParkPlay';
import AudioManager from '../../Base/AudioManager';
import BulletMonsterCollisionManager from '../Battle/BulletMonsterCollisionManager';
import BulletBattle3D from '../Battle/Battle3D/Bullet/BulletBattle3D';
import { PropLalianGate } from '../Other/PropLalianGate';
import { BulletBatchRenderer } from '../Battle/BulletBatchRenderer';
const { ccclass, property } = _decorator;

@ccclass('Role')
export class Role extends Component {

    @property({ type: RoleEnum })
    public type: RoleEnum = RoleEnum.underling;

    @property(FbxManager)
    public fbxManager: FbxManager;

    @property(Node)
    public shoot: Node;

    @property({ type: CCFloat, displayName: '子弹发射高度偏移Y', tooltip: '直接调整该角色子弹出生点高度；负值降低。' })
    public bulletSpawnOffsetY: number = -1.1;

    public hp: number = 2;

    @property(Node)
    public arms: Node;

    @property(CCInteger)
    public attackNum: number = 0;


    public attackIN: boolean = false;


    public static soundType: SoundEnum = SoundEnum.Sound_Gun;
    public static bulletType: BulletEnum = BulletEnum.arrow;
    public static power: number = 1;
    public static repelPower: number = 0;
    public static bulletLayer: Node;

    @property(AttackParkPlay)
    public effect: AttackParkPlay;

    private initialArmsParent: Node = null;
    private readonly initialArmsPosition: Vec3 = new Vec3();
    private readonly initialArmsRotation: Quat = new Quat();
    private readonly initialArmsScale: Vec3 = new Vec3();
    private readonly initialArmsChildTransforms: { node: Node, parent: Node, position: Vec3, rotation: Quat, scale: Vec3, active: boolean }[] = [];
    private hasInitialArmsTransform: boolean = false;
    private shadowRenderers: MeshRenderer[] = [];
    private originalShadowCastingModes: number[] = [];
    private shadowRenderersCached: boolean = false;
    private shadowCastingEnabled: boolean | null = null;
    private static readonly propSocketNodeName: string = 'Bip001 Prop1 Socket';
    private readonly propSocketNodes: Node[] = [];
    private readonly propSocketVisibleStates: boolean[] = [];
    private readonly propSocketAncestorIndices: number[] = [];
    private propSocketsCached: boolean = false;
    private currentWeaponSocket: Node = null;
    private static readonly idleAnimIndex: number = 0;

    private static aimVector: Vec3 = new Vec3();
    private static aimQuat: Quat = new Quat();
    private static readonly bulletSpawnPos: Vec3 = new Vec3();
    // public attackTime: number = 0;
    // ==================== 闪红效果 ====================
    @property({ type: [MeshFlashData], tooltip: '闪红MeshRenderer配置列表，可在属性检查器中编辑' })
    public meshFlashDataList: MeshFlashData[] = [];
    @property({ type: [MeshFlashData], tooltip: '闪红MeshRenderer配置列表，可在属性检查器中编辑' })
    public meshRedDataList: MeshFlashData[] = [];
    @property({ type: [MeshFlashData], tooltip: '闪红MeshRenderer配置列表，可在属性检查器中编辑' })
    public meshCreateDataList: MeshFlashData[] = [];


    protected onLoad(): void {
        this.cacheInitialArmsTransform();
        this.cachePropSockets();
    }

    start() {
        this.cacheInitialArmsTransform();
        this.cachePropSockets();
        this.fbxManager?.removeInvalidSockets();
        if (!Role.bulletLayer) {
            Role.bulletLayer = LayerManager.instance.getLayer(LayerEnum.BulletLayer);
        }
        // this.fbxManager.setAttackAnimCall(this.attackEvent, this)
    }

    public resetForSpawn(): void {
        this.cacheInitialArmsTransform();
        this.stopTweensRecursively(this.node);
        if (this.fbxManager?.node) {
            this.fbxManager.node.active = true;
            this.fbxManager.setAnimationImmediate(Role.idleAnimIndex, true, 0);
        }
        if (!this.arms) {
            return;
        }
        if (this.initialArmsParent?.isValid && this.arms.parent !== this.initialArmsParent) {
            this.arms.setParent(this.initialArmsParent, false);
        }
        this.arms.setPosition(this.initialArmsPosition);
        this.arms.setRotation(this.initialArmsRotation);
        this.arms.setScale(this.initialArmsScale);
        this.arms.active = true;
        this.restoreInitialArmsChildTransforms();
        this.hideDetachedPropSockets();
    }

    public setEntryWeaponVisible(visible: boolean): void {
        if (!this.arms) {
            return;
        }
        this.cachePropSockets();
        const socket = this.currentWeaponSocket?.isValid
            ? this.currentWeaponSocket
            : this.findAncestorByName(this.arms, Role.propSocketNodeName);
        if (socket) {
            socket.active = visible;
        }
        this.arms.active = visible;
    }

    public setShadowCastingEnabled(enabled: boolean): void {
        if (this.shadowCastingEnabled === enabled) {
            return;
        }
        this.cacheShadowRenderers();
        for (let i = 0; i < this.shadowRenderers.length; i++) {
            const renderer = this.shadowRenderers[i];
            if (!renderer?.isValid) {
                continue;
            }
            renderer.shadowCastingMode = enabled
                ? this.originalShadowCastingModes[i]
                : MeshRenderer.ShadowCastingMode.OFF;
        }
        this.shadowCastingEnabled = enabled;
    }

    private cacheShadowRenderers(): void {
        if (this.shadowRenderersCached) {
            return;
        }
        this.shadowRenderersCached = true;
        // 角色除了蒙皮身体外还可能带静态武器/配件，统一纳入圈层阴影开关。
        const renderers = this.node.getComponentsInChildren(MeshRenderer);
        for (let i = 0; i < renderers.length; i++) {
            const renderer = renderers[i];
            this.shadowRenderers.push(renderer);
            this.originalShadowCastingModes.push(renderer.shadowCastingMode);
        }
    }

    private cacheInitialArmsTransform(): void {
        if (this.hasInitialArmsTransform || !this.arms) {
            return;
        }
        this.initialArmsParent = this.arms.parent;
        this.initialArmsPosition.set(this.arms.position);
        Quat.copy(this.initialArmsRotation, this.arms.rotation);
        this.initialArmsScale.set(this.arms.scale);
        this.cacheInitialArmsChildTransforms(this.arms);
        this.hasInitialArmsTransform = true;
    }

    private cacheInitialArmsChildTransforms(node: Node): void {
        for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            this.initialArmsChildTransforms.push({
                node: child,
                parent: child.parent,
                position: child.position.clone(),
                rotation: child.rotation.clone(),
                scale: child.scale.clone(),
                active: child.active,
            });
            this.cacheInitialArmsChildTransforms(child);
        }
    }

    private restoreInitialArmsChildTransforms(): void {
        for (let i = 0; i < this.initialArmsChildTransforms.length; i++) {
            const item = this.initialArmsChildTransforms[i];
            if (!item.node?.isValid) {
                continue;
            }
            if (item.parent?.isValid && item.node.parent !== item.parent) {
                item.node.setParent(item.parent, false);
            }
            item.node.setPosition(item.position);
            item.node.setRotation(item.rotation);
            item.node.setScale(item.scale);
            item.node.active = item.active;
        }
    }

    private stopTweensRecursively(node: Node): void {
        if (!node) {
            return;
        }
        Tween.stopAllByTarget(node);
        for (let i = 0; i < node.children.length; i++) {
            this.stopTweensRecursively(node.children[i]);
        }
    }

    private hideDetachedPropSockets(): void {
        this.cachePropSockets();
        for (let i = 0; i < this.propSocketNodes.length; i++) {
            const socket = this.propSocketNodes[i];
            if (!socket?.isValid) {
                continue;
            }
            const ancestorIndex = this.propSocketAncestorIndices[i];
            if (ancestorIndex >= 0 && !this.propSocketNodes[ancestorIndex]?.active) {
                continue;
            }
            socket.active = this.propSocketVisibleStates[i];
        }
    }

    private cachePropSockets(): void {
        if (this.propSocketsCached || !this.node || !this.arms || !this.shoot) {
            return;
        }
        this.propSocketsCached = true;
        this.currentWeaponSocket = this.findAncestorByName(this.arms, Role.propSocketNodeName);
        this.collectPropSockets(this.node, -1);
    }

    private collectPropSockets(node: Node, ancestorSocketIndex: number): void {
        if (!node) {
            return;
        }
        let currentAncestorIndex = ancestorSocketIndex;
        if (node.name === Role.propSocketNodeName) {
            currentAncestorIndex = this.propSocketNodes.length;
            this.propSocketNodes.push(node);
            this.propSocketVisibleStates.push(this.isCurrentWeaponSocket(node));
            this.propSocketAncestorIndices.push(ancestorSocketIndex);
        }
        for (let i = 0; i < node.children.length; i++) {
            this.collectPropSockets(node.children[i], currentAncestorIndex);
        }
    }

    private isCurrentWeaponSocket(socketNode: Node): boolean {
        return this.containsNode(socketNode, this.arms) || this.containsNode(socketNode, this.shoot);
    }

    private containsNode(root: Node, target: Node): boolean {
        if (!root || !target) {
            return false;
        }
        if (root === target) {
            return true;
        }
        for (let i = 0; i < root.children.length; i++) {
            if (this.containsNode(root.children[i], target)) {
                return true;
            }
        }
        return false;
    }

    private findAncestorByName(node: Node, name: string): Node | null {
        let current = node;
        while (current) {
            if (current.name === name) {
                return current;
            }
            current = current.parent;
        }
        return null;
    }


    public die(time: number) {
        FlashRedManager.instance.flashRed(this.node, this.meshFlashDataList, time * 1.1, Color.GRAY);
    }

    // protected update(dt: number): void {
    //     if (!this.attackIN) {
    //         this.attackTime -= dt;
    //     }
    // }

    public get bulletCount() {
        return 1 + this.attackNum;
    }

    public attackEvent(num: number, bulletCount: number = this.bulletCount, damageScale: number = 1, lockWorldX: number = this.node.worldPosition.x, playEffect: boolean = true, initialBulletRandomX: number = 0, playSound: boolean = true, spawnAdvanceTime: number = 0, bulletType: BulletEnum = Role.bulletType) {
        if (bulletCount <= 0) {
            return;
        }
        if (playSound) {
            AudioManager.inst.playOneShot(Role.soundType, 0.3, 0.08);
        }
        const shootPos = this.shoot.worldPosition;
        const pos = Role.bulletSpawnPos.set(shootPos.x, shootPos.y + this.bulletSpawnOffsetY, shootPos.z);
        const damage = Role.power * damageScale;
        const bullet = BulletManager.instance.shootBullet3D(bulletType, Quat.IDENTITY, damage, Role.repelPower);
        Role.bulletLayer.addChild(bullet.node);
        bullet.node.setWorldPosition(pos);
        const firstBulletRandomX = Math.max(0, initialBulletRandomX);
        if (firstBulletRandomX > 0) {
            bullet.node.x += (Math.random() - 0.5) * 2 * firstBulletRandomX;
        }
        const lockTarget = Role.getLockableLalianTarget(bullet, lockWorldX);
        Role.aimBulletToTarget(bullet, lockTarget);
        bullet.advanceSpawnTime(spawnAdvanceTime);
        BulletBatchRenderer.register(Role.bulletLayer, bullet);
        if (playEffect) {
            this.effect?.play();
        }

        for (let i = 1; i < bulletCount; i++) {
            const bullet = BulletManager.instance.shootBullet3D(bulletType, Quat.IDENTITY, damage, Role.repelPower);
            Role.bulletLayer.addChild(bullet.node);
            bullet.node.setWorldPosition(pos);
            const x = (Math.random() - 0.5) * 2;
            bullet.node.x += x;
            const lockTarget = Role.getLockableLalianTarget(bullet, lockWorldX);
            if (!lockTarget) {
                const z = (Math.random() - 0.5) * 4;
                bullet.node.z += z;
            }
            Role.aimBulletToTarget(bullet, lockTarget);
            bullet.advanceSpawnTime(spawnAdvanceTime);
            BulletBatchRenderer.register(Role.bulletLayer, bullet);
        }

    }

    private static getLockableLalianTarget(bullet: BulletBattle3D, lockWorldX: number): PropLalianGate | null {
        const target = BulletMonsterCollisionManager.instance.getLockableLalianTarget(
            bullet.node.worldPosition,
            lockWorldX,
            bullet.attackTargetTag,
        );
        return target instanceof PropLalianGate ? target : null;
    }

    public static aimBulletToCurrentTarget(bullet: BulletBattle3D, lockWorldX: number = bullet.node.worldPosition.x): void {
        const target = Role.getLockableLalianTarget(bullet, lockWorldX);
        Role.aimBulletToTarget(bullet, target);
    }

    private static aimBulletToTarget(bullet: BulletBattle3D, target: PropLalianGate | null): void {
        if (!target) {
            return;
        }
        const aimPos = target.getLockAimWorldPosition
            ? target.getLockAimWorldPosition(bullet.node.worldPosition, Role.aimVector)
            : target.hitNode.worldPosition;
        Vec3.subtract(Role.aimVector, aimPos, bullet.node.worldPosition);
        Role.aimVector.y = 0;
        if (Role.aimVector.lengthSqr() <= 0.0001) {
            return;
        }
        Role.aimVector.normalize();
        Quat.fromViewUp(Role.aimQuat, Role.aimVector, Vec3.UP);
        bullet.node.setWorldRotation(Role.aimQuat);
    }


}
