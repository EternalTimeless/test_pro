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
    positions: Float32Array;
    uvs: Float32Array;
    indices: Uint16Array;
    uv: number[];
    capacity: number;
    geometry: primitives.IDynamicGeometry;
    updateGeometry: primitives.IDynamicGeometry;
    positionViews: Float32Array[];
    indexViews: Uint16Array[];
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
    public static useDynamicBatching: boolean = true;
    private static readonly _instances: WeakMap<Node, BulletBatchRenderer> = new WeakMap();

    private readonly _batches: BatchInfo[] = [];
    private readonly _tempForward: Vec3 = new Vec3();

    public static register(parent: Node, bullet: BulletBattle3D): void {
        if (!BulletBatchRenderer.useDynamicBatching || !parent || !bullet) {
            return;
        }
        BulletBatchRenderer.getOrCreate(parent).registerBullet(bullet);
    }

    public static prewarm(parent: Node, bullet: BulletBattle3D): void {
        if (!BulletBatchRenderer.useDynamicBatching || !parent || !bullet) {
            return;
        }
        BulletBatchRenderer.getOrCreate(parent).prewarmBullet(bullet);
    }

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
        if (!BulletBatchRenderer.useDynamicBatching || !this._supportsDynamicMesh()) {
            return;
        }
        const visual = this._prepareBulletVisual(bullet);
        if (!visual.spriteFrame) {
            return;
        }
        if (bullet.batchRenderer && bullet.batchRenderer !== this) {
            bullet.batchRenderer.unregisterBullet(bullet);
        }

        const index = bullet.bulletEnum as number;
        let batch: BatchInfo;
        try {
            batch = this._getBatch(index, visual);
            this._ensureBatchCapacity(batch, 1);
        } catch (error) {
            this._fallbackToSprites(error);
            return;
        }
        if (bullet.batchRenderer === this && bullet.batchListIndex >= 0
            && batch.bullets[bullet.batchListIndex] === bullet) {
            return;
        }

        if (visual.sprite) {
            visual.sprite.enabled = false;
        }
        bullet.batchListIndex = batch.bullets.length;
        batch.bullets.push(bullet);
        bullet.batchRenderer = this;
    }

    public prewarmBullet(bullet: BulletBattle3D): void {
        if (!BulletBatchRenderer.useDynamicBatching || !this._supportsDynamicMesh()) {
            return;
        }
        const visual = this._prepareBulletVisual(bullet);
        if (!visual.spriteFrame) {
            return;
        }

        try {
            const batch = this._getBatch(bullet.bulletEnum as number, visual);
            this._ensureBatchCapacity(batch, 1);
            batch.node.active = false;
        } catch (error) {
            this._fallbackToSprites(error);
        }
    }

    public unregisterBullet(bullet: BulletBattle3D): void {
        const batch = this._batches[bullet.bulletEnum as number];
        if (!batch) {
            return;
        }

        let index = bullet.batchListIndex;
        if (index < 0 || batch.bullets[index] !== bullet) {
            index = batch.bullets.indexOf(bullet);
        }
        if (index !== -1) {
            const lastBullet = batch.bullets[batch.bullets.length - 1];
            batch.bullets[index] = lastBullet;
            batch.bullets.pop();
            if (lastBullet && lastBullet !== bullet) {
                lastBullet.batchListIndex = index;
            }
            if (bullet.batchRenderer === this) {
                bullet.batchRenderer = null;
            }
            bullet.batchListIndex = -1;
        }
        const sprite = bullet.batchSprite && bullet.batchSprite.isValid
            ? bullet.batchSprite
            : bullet.node.getComponentInChildren(Sprite);
        if (sprite?.isValid) {
            sprite.enabled = true;
            bullet.batchSprite = sprite;
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

        Vec3.transformQuat(this._tempForward, Vec3.FORWARD, bullet.node.rotation);
        let forwardX = -this._tempForward.x;
        const forwardY = -this._tempForward.y;
        let forwardZ = -this._tempForward.z;
        const forwardLength = Math.sqrt(forwardX * forwardX + forwardZ * forwardZ);
        if (forwardLength <= 0.0001) {
            forwardX = 0;
            forwardZ = 1;
        } else {
            forwardX /= forwardLength;
            forwardZ /= forwardLength;
        }
        bullet.batchForwardX = forwardX;
        bullet.batchForwardY = forwardY;
        bullet.batchForwardZ = forwardZ;

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

        const positions = new Float32Array(0);
        const uvs = new Float32Array(0);
        const indices = new Uint16Array(0);
        batch = {
            node,
            renderer,
            material,
            mesh: null,
            bullets: [],
            positions,
            uvs,
            indices,
            uv: this._getUV(visual.spriteFrame),
            capacity: 0,
            geometry: {
                positions,
                uvs,
                indices16: indices,
                minPos: { x: -100, y: -10, z: -100 },
                maxPos: { x: 100, y: 20, z: 200 },
            },
            updateGeometry: {
                positions,
                indices16: indices,
            },
            positionViews: [],
            indexViews: [],
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
                const lastBullet = bullets[bullets.length - 1];
                bullets[i] = lastBullet;
                bullets.pop();
                if (lastBullet && lastBullet !== bullet) {
                    lastBullet.batchListIndex = i;
                }
                if (bullet) {
                    bullet.batchListIndex = -1;
                    if (bullet.batchRenderer === this) {
                        bullet.batchRenderer = null;
                    }
                }
            }
        }

        const visualCount = bullets.length;
        batch.node.active = visualCount > 0;
        if (visualCount <= 0) {
            return;
        }

        try {
            this._ensureBatchCapacity(batch, visualCount);
        } catch (error) {
            this._fallbackToSprites(error);
            return;
        }

        const halfWidth = batch.width * 0.5;
        const halfHeight = batch.height * 0.5;
        const useGroundPlane = Math.abs(batch.localEulerX) > 45;

        let visualIndex = 0;
        for (let i = 0; i < bullets.length; i++) {
            const bullet = bullets[i];
            const pos = bullet.node.position;

            const forwardX = bullet.batchForwardX;
            const forwardY = bullet.batchForwardY;
            const forwardZ = bullet.batchForwardZ;
            const fx = forwardX * halfHeight;
            const fy = useGroundPlane ? forwardY * halfHeight : halfHeight;
            const fz = forwardZ * halfHeight;
            const rx = forwardZ * halfWidth;
            const rz = -forwardX * halfWidth;
            const pOffset = visualIndex * 12;
            this._setPosition(batch.positions, pOffset, pos.x - rx - fx, pos.y - fy, pos.z - rz - fz);
            this._setPosition(batch.positions, pOffset + 3, pos.x + rx - fx, pos.y - fy, pos.z + rz - fz);
            this._setPosition(batch.positions, pOffset + 6, pos.x - rx + fx, pos.y + fy, pos.z - rz + fz);
            this._setPosition(batch.positions, pOffset + 9, pos.x + rx + fx, pos.y + fy, pos.z + rz + fz);
            visualIndex++;
        }

        let positionView = batch.positionViews[visualCount];
        if (!positionView) {
            positionView = batch.positions.subarray(0, visualCount * 12);
            batch.positionViews[visualCount] = positionView;
        }
        let indexView = batch.indexViews[visualCount];
        if (!indexView) {
            indexView = batch.indices.subarray(0, visualCount * 6);
            batch.indexViews[visualCount] = indexView;
        }
        batch.updateGeometry.positions = positionView;
        batch.updateGeometry.indices16 = indexView;
        try {
            batch.mesh?.updateSubMesh(0, batch.updateGeometry);
        } catch (error) {
            this._fallbackToSprites(error);
        }
    }

    private _ensureBatchCapacity(batch: BatchInfo, visualCount: number): void {
        if (batch.mesh && batch.capacity >= visualCount) {
            return;
        }
        let capacity = Math.max(16, batch.capacity);
        while (capacity < visualCount) {
            capacity *= 2;
        }
        capacity = Math.min(16383, capacity);
        if (visualCount > capacity) {
            throw new Error(`[BulletBatchRenderer] visual count ${visualCount} exceeds supported capacity ${capacity}`);
        }

        batch.capacity = capacity;
        batch.positions = new Float32Array(capacity * 12);
        batch.uvs = new Float32Array(capacity * 8);
        batch.indices = new Uint16Array(capacity * 6);
        batch.positionViews.length = 0;
        batch.indexViews.length = 0;
        const uv = batch.uv;
        for (let visualIndex = 0; visualIndex < capacity; visualIndex++) {
            const uvOffset = visualIndex * 8;
            batch.uvs[uvOffset] = uv[0];
            batch.uvs[uvOffset + 1] = uv[1];
            batch.uvs[uvOffset + 2] = uv[2];
            batch.uvs[uvOffset + 3] = uv[3];
            batch.uvs[uvOffset + 4] = uv[4];
            batch.uvs[uvOffset + 5] = uv[5];
            batch.uvs[uvOffset + 6] = uv[6];
            batch.uvs[uvOffset + 7] = uv[7];

            const vertexOffset = visualIndex * 4;
            const indexOffset = visualIndex * 6;
            batch.indices[indexOffset] = vertexOffset;
            batch.indices[indexOffset + 1] = vertexOffset + 1;
            batch.indices[indexOffset + 2] = vertexOffset + 2;
            batch.indices[indexOffset + 3] = vertexOffset + 2;
            batch.indices[indexOffset + 4] = vertexOffset + 1;
            batch.indices[indexOffset + 5] = vertexOffset + 3;
        }

        batch.geometry = {
            positions: batch.positions,
            uvs: batch.uvs,
            indices16: batch.indices,
            minPos: { x: -100, y: -10, z: -100 },
            maxPos: { x: 100, y: 20, z: 200 },
        };
        batch.updateGeometry = {
            positions: batch.positions.subarray(0, 12),
            indices16: batch.indices.subarray(0, 6),
        };
        const oldMesh = batch.mesh;
        const createDynamicMesh = (utils as any).createDynamicMesh as Function;
        batch.mesh = createDynamicMesh.call(utils, 0, batch.geometry, undefined, {
            maxSubMeshes: 1,
            maxSubMeshVertices: capacity * 4,
            maxSubMeshIndices: capacity * 6,
        });
        batch.renderer.mesh = batch.mesh;
        oldMesh?.destroy();
    }

    private _supportsDynamicMesh(): boolean {
        return typeof (utils as any).createDynamicMesh === 'function';
    }

    private _fallbackToSprites(error: unknown): void {
        console.warn('[BulletBatchRenderer] dynamic batching disabled; restored Sprite rendering.', error);
        BulletBatchRenderer.useDynamicBatching = false;
        for (let i = 0; i < this._batches.length; i++) {
            const batch = this._batches[i];
            if (!batch) {
                continue;
            }
            batch.node.active = false;
            for (let j = 0; j < batch.bullets.length; j++) {
                const bullet = batch.bullets[j];
                if (!bullet?.isValid) {
                    continue;
                }
                const sprite = bullet.batchSprite && bullet.batchSprite.isValid
                    ? bullet.batchSprite
                    : bullet.node.getComponentInChildren(Sprite);
                if (sprite?.isValid) {
                    sprite.enabled = true;
                    bullet.batchSprite = sprite;
                }
                if (bullet.batchRenderer === this) {
                    bullet.batchRenderer = null;
                }
                bullet.batchListIndex = -1;
            }
            batch.bullets.length = 0;
        }
    }

    private _setPosition(out: Float32Array, offset: number, x: number, y: number, z: number): void {
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
