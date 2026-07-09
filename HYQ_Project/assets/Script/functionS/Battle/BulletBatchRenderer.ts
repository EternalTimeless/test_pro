import { Color, Component, Material, Mesh, MeshRenderer, Node, Sprite, SpriteFrame, UITransform, Vec3, _decorator, primitives, utils } from "cc";
import { BulletEnum } from "db://assets/Script/Base/EnumList";
import type BulletBattle3D from "./Battle3D/Bullet/BulletBattle3D";

const { ccclass } = _decorator;

type BatchInfo = {
    node: Node;
    renderer: MeshRenderer;
    material: Material;
    mesh: Mesh | null;
    bullets: BulletBattle3D[];
    positions: number[];
    uvs: number[];
    indices: number[];
    spriteFrame: SpriteFrame | null;
    width: number;
    height: number;
    localEulerX: number;
};

type BulletVisualInfo = {
    sprite: Sprite | null;
    spriteFrame: SpriteFrame | null;
    width: number;
    height: number;
    localEulerX: number;
};

@ccclass("BulletBatchRenderer")
export class BulletBatchRenderer extends Component {
    public static instance: BulletBatchRenderer | null = null;
    private static readonly _instances: WeakMap<Node, BulletBatchRenderer> = new WeakMap();

    private readonly _batches: BatchInfo[] = [];
    private readonly _tempForward: Vec3 = new Vec3();
    private readonly _tempRight: Vec3 = new Vec3();

    public static getOrCreate(parent: Node): BulletBatchRenderer {
        let renderer = BulletBatchRenderer._instances.get(parent);
        if (renderer && renderer.isValid) {
            return renderer;
        }

        let node = parent.getChildByName("BulletBatchRenderer");
        if (!node) {
            node = new Node("BulletBatchRenderer");
            parent.addChild(node);
            node.layer = parent.layer;
        }

        renderer = node.getComponent(BulletBatchRenderer);
        if (!renderer) {
            renderer = node.addComponent(BulletBatchRenderer);
        }
        BulletBatchRenderer._instances.set(parent, renderer);
        BulletBatchRenderer.instance = renderer;
        return renderer;
    }

    protected onLoad(): void {
        BulletBatchRenderer.instance = this;
    }

    protected onDestroy(): void {
        if (BulletBatchRenderer.instance === this) {
            BulletBatchRenderer.instance = null;
        }
    }

    public registerBullet(bullet: BulletBattle3D): void {
        const visual = this._prepareBulletVisual(bullet);
        if (!visual.spriteFrame) {
            return;
        }
        if (visual.sprite) {
            visual.sprite.enabled = false;
        }
        if (bullet.batchRenderer && bullet.batchRenderer !== this) {
            bullet.batchRenderer.unregisterBullet(bullet);
        }

        const index = bullet.bulletEnum as number;
        const batch = this._getBatch(index, visual);
        if (batch.bullets.indexOf(bullet) !== -1) {
            return;
        }

        batch.bullets.push(bullet);
        bullet.batchRenderer = this;
    }

    public prewarmBullet(bullet: BulletBattle3D): void {
        const visual = this._prepareBulletVisual(bullet);
        if (!visual.spriteFrame) {
            return;
        }

        const batch = this._getBatch(bullet.bulletEnum as number, visual);
        if (batch.mesh) {
            return;
        }

        const halfWidth = batch.width * 0.5;
        const halfHeight = batch.height * 0.5;
        const uv = this._getUV(batch.spriteFrame);

        batch.positions.length = 12;
        batch.uvs.length = 8;
        batch.indices.length = 6;

        this._setPosition(batch.positions, 0, -halfWidth, -halfHeight, 0);
        this._setPosition(batch.positions, 3, halfWidth, -halfHeight, 0);
        this._setPosition(batch.positions, 6, -halfWidth, halfHeight, 0);
        this._setPosition(batch.positions, 9, halfWidth, halfHeight, 0);
        for (let i = 0; i < 8; i++) {
            batch.uvs[i] = uv[i];
        }
        batch.indices[0] = 0;
        batch.indices[1] = 1;
        batch.indices[2] = 2;
        batch.indices[3] = 2;
        batch.indices[4] = 1;
        batch.indices[5] = 3;

        batch.mesh = utils.createMesh({
            positions: batch.positions,
            uvs: batch.uvs,
            indices: batch.indices,
            minPos: { x: -100, y: -10, z: -100 },
            maxPos: { x: 100, y: 20, z: 200 },
        });
        batch.renderer.mesh = batch.mesh;
        batch.node.active = false;
    }

    public unregisterBullet(bullet: BulletBattle3D): void {
        const batch = this._batches[bullet.bulletEnum as number];
        if (!batch) {
            return;
        }

        const index = batch.bullets.indexOf(bullet);
        if (index !== -1) {
            batch.bullets[index] = batch.bullets[batch.bullets.length - 1];
            batch.bullets.pop();
            if (bullet.batchRenderer === this) {
                bullet.batchRenderer = null;
            }
        }
    }

    protected lateUpdate(): void {
        for (let i = 0; i < this._batches.length; i++) {
            const batch = this._batches[i];
            if (!batch) {
                continue;
            }
            this._updateBatch(batch);
        }
    }

    private _prepareBulletVisual(bullet: BulletBattle3D): BulletVisualInfo {
        let sprite = bullet.batchSprite;
        if (!sprite || !sprite.isValid) {
            sprite = bullet.node.getComponentInChildren(Sprite);
            bullet.batchSprite = sprite;
        }

        let width = bullet.batchWidth;
        let height = bullet.batchHeight;
        let localEulerX = bullet.batchLocalEulerX;
        const spriteFrame = sprite ? sprite.spriteFrame : null;

        if (sprite && (width <= 0 || height <= 0)) {
            const ui = sprite.getComponent(UITransform);
            if (ui) {
                width = ui.contentSize.width;
                height = ui.contentSize.height;
            } else if (spriteFrame) {
                width = spriteFrame.width / 100;
                height = spriteFrame.height / 100;
            }
            localEulerX = sprite.node.eulerAngles.x;
            bullet.batchWidth = width;
            bullet.batchHeight = height;
            bullet.batchLocalEulerX = localEulerX;
        }

        return {
            sprite,
            spriteFrame,
            width,
            height,
            localEulerX,
        };
    }

    private _getBatch(index: number, visual: BulletVisualInfo): BatchInfo {
        let batch = this._batches[index];
        if (batch) {
            return batch;
        }

        const node = new Node(`BulletBatch_${BulletEnum[index] ?? index}`);
        this.node.addChild(node);
        node.layer = this.node.layer;

        const renderer = node.addComponent(MeshRenderer);
        const material = new Material();
        material.initialize({
            effectName: "builtin-unlit",
            technique: 3,
            defines: { USE_TEXTURE: true },
        });
        if (visual.spriteFrame) {
            material.setProperty("mainTexture", visual.spriteFrame.texture);
            material.setProperty("mainColor", Color.WHITE);
        }
        renderer.setSharedMaterial(material, 0);

        batch = {
            node,
            renderer,
            material,
            mesh: null,
            bullets: [],
            positions: [],
            uvs: [],
            indices: [],
            spriteFrame: visual.spriteFrame,
            width: visual.width,
            height: visual.height,
            localEulerX: visual.localEulerX,
        };
        this._batches[index] = batch;
        return batch;
    }

    private _updateBatch(batch: BatchInfo): void {
        const bullets = batch.bullets;
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            if (!bullet || !bullet.isValid || !bullet.node.activeInHierarchy) {
                bullets[i] = bullets[bullets.length - 1];
                bullets.pop();
            }
        }

        const count = bullets.length;
        batch.node.active = count > 0;
        if (count <= 0) {
            return;
        }

        batch.positions.length = count * 12;
        batch.uvs.length = count * 8;
        batch.indices.length = count * 6;

        const halfWidth = batch.width * 0.5;
        const halfHeight = batch.height * 0.5;
        const useGroundPlane = Math.abs(batch.localEulerX) > 45;
        const uv = this._getUV(batch.spriteFrame);

        for (let i = 0; i < count; i++) {
            const bullet = bullets[i];
            const pos = bullet.node.position;

            Vec3.transformQuat(this._tempForward, Vec3.FORWARD, bullet.node.rotation);
            this._tempForward.set(-this._tempForward.x, -this._tempForward.y, -this._tempForward.z);
            if (useGroundPlane) {
                this._tempRight.set(this._tempForward.z, 0, -this._tempForward.x);
            } else {
                this._tempRight.set(this._tempForward.z, 0, -this._tempForward.x);
            }
            if (this._tempRight.lengthSqr() <= 0.0001) {
                this._tempRight.set(1, 0, 0);
            } else {
                this._tempRight.normalize();
            }

            const fx = this._tempForward.x * halfHeight;
            const fy = useGroundPlane ? this._tempForward.y * halfHeight : halfHeight;
            const fz = this._tempForward.z * halfHeight;
            const rx = this._tempRight.x * halfWidth;
            const rz = this._tempRight.z * halfWidth;
            const py = pos.y;

            const pOffset = i * 12;
            this._setPosition(batch.positions, pOffset, pos.x - rx - fx, py - fy, pos.z - rz - fz);
            this._setPosition(batch.positions, pOffset + 3, pos.x + rx - fx, py - fy, pos.z + rz - fz);
            this._setPosition(batch.positions, pOffset + 6, pos.x - rx + fx, py + fy, pos.z - rz + fz);
            this._setPosition(batch.positions, pOffset + 9, pos.x + rx + fx, py + fy, pos.z + rz + fz);

            const uvOffset = i * 8;
            batch.uvs[uvOffset] = uv[0];
            batch.uvs[uvOffset + 1] = uv[1];
            batch.uvs[uvOffset + 2] = uv[2];
            batch.uvs[uvOffset + 3] = uv[3];
            batch.uvs[uvOffset + 4] = uv[4];
            batch.uvs[uvOffset + 5] = uv[5];
            batch.uvs[uvOffset + 6] = uv[6];
            batch.uvs[uvOffset + 7] = uv[7];

            const vertexOffset = i * 4;
            const indexOffset = i * 6;
            batch.indices[indexOffset] = vertexOffset;
            batch.indices[indexOffset + 1] = vertexOffset + 1;
            batch.indices[indexOffset + 2] = vertexOffset + 2;
            batch.indices[indexOffset + 3] = vertexOffset + 2;
            batch.indices[indexOffset + 4] = vertexOffset + 1;
            batch.indices[indexOffset + 5] = vertexOffset + 3;
        }

        const geometry: primitives.IGeometry = {
            positions: batch.positions,
            uvs: batch.uvs,
            indices: batch.indices,
            minPos: { x: -100, y: -10, z: -100 },
            maxPos: { x: 100, y: 20, z: 200 },
        };
        batch.mesh = utils.createMesh(geometry, batch.mesh || undefined);
        batch.renderer.mesh = batch.mesh;
    }

    private _setPosition(out: number[], offset: number, x: number, y: number, z: number): void {
        out[offset] = x;
        out[offset + 1] = y;
        out[offset + 2] = z;
    }

    private _getUV(spriteFrame: SpriteFrame | null): number[] {
        const sfAny = spriteFrame as any;
        if (sfAny && sfAny.uv && sfAny.uv.length >= 8) {
            return sfAny.uv;
        }
        if (!spriteFrame || !spriteFrame.texture) {
            return [0, 1, 1, 1, 0, 0, 1, 0];
        }

        const rect = spriteFrame.getRect();
        const texWidth = spriteFrame.texture.width || rect.width;
        const texHeight = spriteFrame.texture.height || rect.height;
        const left = rect.x / texWidth;
        const right = (rect.x + rect.width) / texWidth;
        const top = rect.y / texHeight;
        const bottom = (rect.y + rect.height) / texHeight;

        if (spriteFrame.rotated) {
            return [left, top, left, bottom, right, top, right, bottom];
        }
        return [left, bottom, right, bottom, left, top, right, top];
    }
}
