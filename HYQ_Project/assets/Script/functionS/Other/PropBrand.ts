import { _decorator, Collider, Label, Node, Sprite, Vec3 } from 'cc';
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

@ccclass('PropBrand')
export class PropBrand extends BattleTarget3D {

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
    private readonly tempCollisionWorldPos: Vec3 = new Vec3();

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

    init(num: number = 1) {
        this.count = num;
        this.lab.string = `+${num}`;
    }

    protected _update(dt: number): void {
    }

    public Hit(damage: number): number {
        this.refreshCollisionBounds();
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


