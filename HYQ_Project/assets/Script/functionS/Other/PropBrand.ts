import { _decorator, Collider, Label, Mat4, Material, Mesh, MeshRenderer, Node, Sprite, Vec3 } from 'cc';
import BulletMonsterCollisionManager from '../Battle/BulletMonsterCollisionManager';
import { BattleTarget3D } from '../Battle/BattleTarger/BattleTarget3D';
import ColliderTag, { COLLIDE_TYPE } from '../Battle/CollectBattleTarger/ColliderTag';
const { ccclass, property } = _decorator;

enum PropBrandVisualKind {
    Model,
    Sprite,
    Label,
}

type PropBrandVisualRecord = {
    node: Node;
    offset: Vec3;
    kind: PropBrandVisualKind;
};

type PropBrandMergedModelBatch = {
    mesh: Mesh;
    materials: (Material | null)[];
    layer: number;
    visibility: number;
    shadowCastingMode: number;
    receiveShadow: number;
    bakeCastShadow: boolean;
    bakeReceiveShadow: boolean;
    useLightProbe: boolean;
};

@ccclass('PropBrand')
export class PropBrand extends BattleTarget3D {

    private static readonly mergedModelRootName: string = 'PropBrand_MergedModel';
    private static readonly mergedModelCache: Map<string, PropBrandMergedModelBatch[]> = new Map();

    public readonly skipBulletHitEffect: boolean = true;
    public readonly cacheCollisionBoundsPerFrame: boolean = true;

    @property(Label)
    public lab: Label;

    public count: number = 0;

    @property(Collider)
    public collide: Collider;;

    private visualActive: boolean = true;
    private visualRecords: PropBrandVisualRecord[] = [];
    private registered: boolean = false;
    private modelVisualMerged: boolean = false;
    private readonly tempCollisionWorldPos: Vec3 = new Vec3();

    protected onLoad(): void {
        super.onLoad();
        this.enabled = false;
    }

    public setVisualActive(active: boolean): void {
        if (this.visualActive === active) {
            return;
        }
        this.visualActive = active;
        if (this.visualRecords.length > 0) {
            for (let i = 0; i < this.visualRecords.length; i++) {
                this.visualRecords[i].node.active = active;
            }
            return;
        }
        for (let i = 0; i < this.node.children.length; i++) {
            this.node.children[i].active = active;
        }
    }

    public activateBulletTarget(): void {
        this.initFixedHp(1);
        this.setupColliderTag();
        this.refreshCollisionBounds();
        this.registerTarget();
    }

    public deactivateBulletTarget(): void {
        this.unregisterTarget();
        this.isDestroy = true;
    }

    public getCollisionWorldPosition(out: Vec3 = this.tempCollisionWorldPos): Vec3 {
        if (this.refreshCollisionBounds(out)) {
            return out;
        }
        return super.getCollisionWorldPosition(out);
    }

    public mergeModelRenderers(cacheKey: string): void {
        if (this.modelVisualMerged || this.visualRecords.length > 0) {
            return;
        }

        const modelRoots = this.getModelVisualRoots();
        if (modelRoots.length < 2) {
            return;
        }

        let batches = PropBrand.mergedModelCache.get(cacheKey);
        if (!batches) {
            batches = this.createMergedModelBatches(modelRoots);
            if (!batches) {
                return;
            }
            PropBrand.mergedModelCache.set(cacheKey, batches);
        }

        const mergedRoot = new Node(PropBrand.mergedModelRootName);
        mergedRoot.layer = modelRoots[0].layer;
        this.node.addChild(mergedRoot);

        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i];
            const rendererNode = new Node(`PropBrand_MergedPart_${i}`);
            rendererNode.layer = batch.layer;
            mergedRoot.addChild(rendererNode);

            const renderer = rendererNode.addComponent(MeshRenderer);
            renderer.mesh = batch.mesh;
            renderer.sharedMaterials = batch.materials;
            renderer.visibility = batch.visibility;
            renderer.shadowCastingMode = batch.shadowCastingMode;
            renderer.receiveShadow = batch.receiveShadow;
            renderer.bakeSettings.castShadow = batch.bakeCastShadow;
            renderer.bakeSettings.receiveShadow = batch.bakeReceiveShadow;
            renderer.bakeSettings.useLightProbe = batch.useLightProbe;
        }

        for (let i = 0; i < modelRoots.length; i++) {
            modelRoots[i].removeFromParent();
            modelRoots[i].destroy();
        }
        this.modelVisualMerged = true;
    }

    public bindVisualGroups(modelGroup: Node, spriteGroup: Node, labelGroup: Node): void {
        if (this.visualRecords.length <= 0) {
            const children = this.node.children.concat();
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                const kind = this.getVisualKind(child);
                this.visualRecords.push({
                    node: child,
                    offset: new Vec3(child.position.x, child.position.y, child.position.z),
                    kind,
                });
            }
        }

        for (let i = 0; i < this.visualRecords.length; i++) {
            const record = this.visualRecords[i];
            const group = this.getVisualGroup(record.kind, modelGroup, spriteGroup, labelGroup);
            if (record.node.parent !== group) {
                record.node.setParent(group);
            }
        }
        this.setVisualActive(this.node.active);
        this.updateVisualTransform();
    }

    public updateVisualTransform(): void {
        for (let i = 0; i < this.visualRecords.length; i++) {
            const record = this.visualRecords[i];
            record.node.setPosition(
                this.node.position.x + record.offset.x,
                this.node.position.y + record.offset.y,
                this.node.position.z + record.offset.z
            );
        }
    }

    private getVisualKind(node: Node): PropBrandVisualKind {
        if (node.getComponent(Label)) {
            return PropBrandVisualKind.Label;
        }
        if (node.getComponent(Sprite)) {
            return PropBrandVisualKind.Sprite;
        }
        return PropBrandVisualKind.Model;
    }

    private getVisualGroup(kind: PropBrandVisualKind, modelGroup: Node, spriteGroup: Node, labelGroup: Node): Node {
        switch (kind) {
            case PropBrandVisualKind.Sprite:
                return spriteGroup;
            case PropBrandVisualKind.Label:
                return labelGroup;
            default:
                return modelGroup;
        }
    }

    private getModelVisualRoots(): Node[] {
        const roots: Node[] = [];
        for (let i = 0; i < this.node.children.length; i++) {
            const child = this.node.children[i];
            if (!child.getComponent(Label) && !child.getComponent(Sprite)) {
                roots.push(child);
            }
        }
        return roots;
    }

    private createMergedModelBatches(modelRoots: Node[]): PropBrandMergedModelBatch[] | null {
        const renderers: MeshRenderer[] = [];
        for (let i = 0; i < modelRoots.length; i++) {
            const rootRenderers = modelRoots[i].getComponentsInChildren(MeshRenderer);
            for (let j = 0; j < rootRenderers.length; j++) {
                if (rootRenderers[j].mesh) {
                    renderers.push(rootRenderers[j]);
                }
            }
        }
        if (renderers.length < 2) {
            return null;
        }

        const groups: MeshRenderer[][] = [];
        for (let i = 0; i < renderers.length; i++) {
            const renderer = renderers[i];
            let group: MeshRenderer[] = null;
            for (let j = 0; j < groups.length; j++) {
                if (this.canMergeRenderers(groups[j][0], renderer)) {
                    group = groups[j];
                    break;
                }
            }
            if (!group) {
                group = [];
                groups.push(group);
            }
            group.push(renderer);
        }

        if (groups.length >= renderers.length) {
            return null;
        }

        const rootWorldInverse = new Mat4();
        this.node.getWorldMatrix(rootWorldInverse);
        Mat4.invert(rootWorldInverse, rootWorldInverse);
        const batches: PropBrandMergedModelBatch[] = [];

        for (let i = 0; i < groups.length; i++) {
            const group = groups[i];
            const mergedMesh = new Mesh();
            for (let j = 0; j < group.length; j++) {
                const source = group[j];
                const relativeMatrix = new Mat4();
                source.node.getWorldMatrix(relativeMatrix);
                Mat4.multiply(relativeMatrix, rootWorldInverse, relativeMatrix);
                if (!mergedMesh.merge(source.mesh, relativeMatrix, j > 0)) {
                    mergedMesh.destroy();
                    for (let k = 0; k < batches.length; k++) {
                        batches[k].mesh.destroy();
                    }
                    return null;
                }
            }

            const source = group[0];
            batches.push({
                mesh: mergedMesh,
                materials: source.sharedMaterials.slice(),
                layer: source.node.layer,
                visibility: source.visibility,
                shadowCastingMode: source.shadowCastingMode,
                receiveShadow: source.receiveShadow,
                bakeCastShadow: source.bakeSettings.castShadow,
                bakeReceiveShadow: source.bakeSettings.receiveShadow,
                useLightProbe: source.bakeSettings.useLightProbe,
            });
        }
        return batches;
    }

    private canMergeRenderers(left: MeshRenderer, right: MeshRenderer): boolean {
        if (left.mesh !== right.mesh || left.sharedMaterials.length !== right.sharedMaterials.length) {
            return false;
        }
        for (let i = 0; i < left.sharedMaterials.length; i++) {
            if (left.sharedMaterials[i] !== right.sharedMaterials[i]) {
                return false;
            }
        }
        return true;
    }

    init(num: number = 1) {
        this.count = num;
        this.lab.string = `+${num}`;
    }

    protected _update(dt: number): void {
    }

    public Hit(damage: number): number {
        return 1;
    }

    protected damage(power: number): void {
    }

    protected die(): void {
    }

    public repelBattleTarget(target: Node, reoel: number): void {
    }

    private refreshCollisionBounds(out?: Vec3): boolean {
        const worldBounds = (this.collide as any)?.worldBounds;
        const center = worldBounds?.center;
        const halfExtents = worldBounds?.halfExtents;
        if (!center || !halfExtents) {
            return false;
        }
        this.collisionHalfX = Math.max(0.05, halfExtents.x);
        this.collisionHalfZ = Math.max(0.05, halfExtents.z);
        if (out) {
            out.set(center.x, center.y, center.z);
        }
        return true;
    }

    private setupColliderTag(): void {
        let tag = this.getComponent(ColliderTag);
        if (!tag) {
            tag = this.addComponent(ColliderTag);
        }
        tag.tag = COLLIDE_TYPE.MONSTER;
    }

    private registerTarget(): void {
        if (this.registered) {
            return;
        }
        BulletMonsterCollisionManager.instance.registerTarget(this);
        this.registered = true;
    }

    private unregisterTarget(): void {
        if (!this.registered) {
            return;
        }
        BulletMonsterCollisionManager.instance.unregisterTarget(this);
        this.registered = false;
    }
}


