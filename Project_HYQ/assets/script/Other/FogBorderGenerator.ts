import {
    _decorator,
    Component,
    Node,
    instantiate,
    UITransform,
    UIOpacity,
    Vec3,
    math,
    Sprite,
    Color,
} from 'cc';

const { ccclass, property, executeInEditMode, playOnFocus } = _decorator;

@ccclass('FogBorderGenerator')
@executeInEditMode(true)
@playOnFocus(true)
export class FogBorderGenerator extends Component {

    // ✅ 改：不再用 Prefab，而是用场景里的模板节点
    @property({ type: Node, tooltip: '场景里的云模板节点（sp）。会被 clone 用来生成，不会再有预制体回滚问题' })
    public fogTemplate: Node | null = null;

    @property({ type: Node, tooltip: '生成出来的云挂到这个父节点下面' })
    public fogParent: Node | null = null;

    @property({ tooltip: '地图长度（X 方向）' })
    public mapLength = 2000;

    @property({ tooltip: '地图宽度（Y 方向）' })
    public mapWidth = 1200;

    @property({ tooltip: '迷雾总宽度（围绕边界中心线对称展开；例如 100 -> -50~50）' })
    public fogWidth = 100;

    // ✅ 你要的：中心 255，边缘 30（雾带用）
    @property({ tooltip: '中心线 opacity（0~255），例如 255' })
    public centerOpacity = 255;

    @property({ tooltip: '最边缘 opacity（0~255），例如 30' })
    public edgeOpacity = 30;

    @property({ tooltip: '沿边缘方向的间距（0=自动取模板宽度*0.9）' })
    public stepAlong = 0;

    @property({ tooltip: '每个 along 点生成多少个（厚度随机采样次数），0=自动根据 fogWidth/stepThickness' })
    public spawnPerAlong = 0;

    @property({ tooltip: '厚度随机的“偏中间强度”，越大越集中在 0（推荐 2~6）' })
    public centerBiasSamples = 4;

    @property({ tooltip: '厚度方向的基准间距（用于自动计算 spawnPerAlong），0=自动取模板高度*0.9' })
    public stepThickness = 0;

    @property({ tooltip: '位置抖动幅度（让整体不平整）' })
    public jitter = 8;

    @property({ tooltip: '随机旋转抖动（度），会叠加在边固定旋转上' })
    public rotationJitterDeg = 6;

    @property({ tooltip: '最大生成数量（防止参数太大把编辑器卡死）' })
    public maxInstances = 12000;

    @property({ tooltip: '只清理生成的云（名字以 __Fog__ 开头）。关闭则清空 fogParent 下所有子物体' })
    public onlyClearGenerated = true;

    @property({ tooltip: '【点这里】勾选触发一次生成（会先清空再生成），勾完会自动回弹' })
    public rebuildOnce = false;

    // ================= 边界环 =================
    @property({ tooltip: '是否生成“边界围起来的一圈云”（scale=1, opacity=255）' })
    public enableBorderRing = true;

    @property({ tooltip: '边界环的密度间距（0=自动用模板宽度*0.5 更紧密）' })
    public borderRingStep = 0;

    @property({ tooltip: '边界环是否按边固定旋转：上0 下180 左90 右270' })
    public borderRingRotateBySide = true;

    private _building = false;

    update() {
        if (!this.rebuildOnce || this._building) return;
        this.rebuildOnce = false;

        this._building = true;
        try {
            this.rebuild();
        } catch (e) {
            console.error('[FogBorderGenerator] rebuild error:', e);
        } finally {
            this._building = false;
        }
    }

    public clearFog(): void {
        if (!this.fogParent || !this.fogParent.isValid) return;

        const parent = this.fogParent;
        for (let i = parent.children.length - 1; i >= 0; i--) {
            const c = parent.children[i];
            if (!c || !c.isValid) continue;

            if (this.onlyClearGenerated && !c.name.startsWith('__Fog__')) continue;

            c.removeFromParent();
            c.destroy();
        }
    }

    public rebuild(): void {
        if (!this.fogTemplate || !this.fogTemplate.isValid) {
            console.warn('[FogBorderGenerator] fogTemplate is null/invalid');
            return;
        }
        if (!this.fogParent || !this.fogParent.isValid) {
            console.warn('[FogBorderGenerator] fogParent is null/invalid');
            return;
        }

        const len = Math.max(0, this.mapLength);
        const wid = Math.max(0, this.mapWidth);
        const fw = Math.max(0.0001, this.fogWidth);
        if (len <= 0 || wid <= 0) return;

        this.clearFog();

        const tile = this._getTemplateTileSize(this.fogTemplate);
        const stepAlong = (this.stepAlong > 0) ? this.stepAlong : Math.max(1, tile.w * 0.9);
        const stepThick = (this.stepThickness > 0) ? this.stepThickness : Math.max(1, tile.h * 0.9);

        const halfL = len * 0.5;
        const halfW = wid * 0.5;
        const halfFog = fw * 0.5;

        // 沿边方向扩 halfFog，角落不会缺
        const xMin = -halfL - halfFog;
        const xMax = +halfL + halfFog;
        const yMin = -halfW - halfFog;
        const yMax = +halfW + halfFog;

        const spawnPerAlong = (this.spawnPerAlong > 0)
            ? this.spawnPerAlong
            : Math.max(1, Math.round(fw / stepThick));

        // 粗略预估（雾带）
        const alongCountX = Math.ceil((xMax - xMin) / stepAlong) + 1;
        const alongCountY = Math.ceil((yMax - yMin) / stepAlong) + 1;
        const estimate = (alongCountX * 2 + alongCountY * 2) * spawnPerAlong;

        if (estimate > this.maxInstances) {
            console.warn(`[FogBorderGenerator] 预计生成 ${estimate} 个云，超过上限 ${this.maxInstances}。
建议：增大 stepAlong 或减小 spawnPerAlong / fogWidth。`);
            return;
        }

        let idx = 0;

        // ===== 雾带（随机偏中间 + 圆角裁剪 + 透明度变化）=====
        for (let x = xMin; x <= xMax; x += stepAlong) {
            for (let n = 0; n < spawnPerAlong; n++) {
                const off = this._randCentered(halfFog, this.centerBiasSamples);

                this._spawnFogClamped(new Vec3(x, +halfW + off, 0), 0, halfL, halfW, halfFog, idx++);
                this._spawnFogClamped(new Vec3(x, -halfW + off, 0), 180, halfL, halfW, halfFog, idx++);
            }
        }

        for (let y = yMin; y <= yMax; y += stepAlong) {
            for (let n = 0; n < spawnPerAlong; n++) {
                const off = this._randCentered(halfFog, this.centerBiasSamples);

                this._spawnFogClamped(new Vec3(-halfL + off, y, 0), 90, halfL, halfW, halfFog, idx++);
                this._spawnFogClamped(new Vec3(+halfL + off, y, 0), 270, halfL, halfW, halfFog, idx++);
            }
        }

        // ===== 边界环：紧密一圈、scale=1、opacity=255 =====
        if (this.enableBorderRing) {
            idx = this._buildBorderRing(halfL, halfW, tile.w, idx);
        }
    }

    // =========================
    // 边界环
    // =========================
    private _buildBorderRing(halfL: number, halfW: number, templateW: number, startIdx: number): number {
        const step = (this.borderRingStep > 0)
            ? this.borderRingStep
            : Math.max(1, templateW * 0.5);

        let idx = startIdx;

        for (let x = -halfL; x <= halfL; x += step) {
            idx = this._spawnBorderRingOne(new Vec3(x, +halfW, 0), this.borderRingRotateBySide ? 0 : 0, idx);
        }
        for (let x = -halfL; x <= halfL; x += step) {
            idx = this._spawnBorderRingOne(new Vec3(x, -halfW, 0), this.borderRingRotateBySide ? 180 : 0, idx);
        }
        for (let y = -halfW; y <= halfW; y += step) {
            idx = this._spawnBorderRingOne(new Vec3(-halfL, y, 0), this.borderRingRotateBySide ? 90 : 0, idx);
        }
        for (let y = -halfW; y <= halfW; y += step) {
            idx = this._spawnBorderRingOne(new Vec3(+halfL, y, 0), this.borderRingRotateBySide ? 270 : 0, idx);
        }

        return idx;
    }

    private _spawnBorderRingOne(pos: Vec3, rotDeg: number, idx: number): number {
        const n = this._cloneTemplate();
        if (!n) return idx;

        n.active = true;
        n.name = `__Fog__Ring__${idx}`;
        n.setParent(this.fogParent!, false);
        n.setPosition(pos);

        n.setScale(1, 1, 1);
        this._applyOpacity(n, 255);
        n.setRotationFromEuler(0, 0, rotDeg);

        return idx + 1;
    }

    // =========================
    // 雾带：生成 + 圆角裁剪
    // =========================
    private _spawnFogClamped(
        basePos: Vec3,
        baseRotDeg: number,
        halfL: number,
        halfW: number,
        halfFog: number,
        idx: number
    ): void {
        const maxTry = 6;

        for (let t = 0; t < maxTry; t++) {
            const jx = (Math.random() * 2 - 1) * this.jitter;
            const jy = (Math.random() * 2 - 1) * this.jitter;
            const px = basePos.x + jx;
            const py = basePos.y + jy;

            const sd = this._sdfRect(px, py, halfL, halfW);
            if (Math.abs(sd) > halfFog) continue;

            const opacity255 = this._opacityFromSignedDist(sd, halfFog);

            const n = this._cloneTemplate();
            if (!n) return;

            n.name = `__Fog__${idx}`;
            n.setParent(this.fogParent!, false);
            n.setPosition(px, py, basePos.z);

            const jr = (Math.random() * 2 - 1) * this.rotationJitterDeg;
            n.setRotationFromEuler(0, 0, baseRotDeg + jr);

            this._applyOpacity(n, 255);
            this._applyOpacity(n, opacity255);
            return;
        }

        // fallback：不抖动也放一个（避免断层）
        const sd0 = this._sdfRect(basePos.x, basePos.y, halfL, halfW);
        if (Math.abs(sd0) <= halfFog) {
            const opacity255 = this._opacityFromSignedDist(sd0, halfFog);

            const n = this._cloneTemplate();
            if (!n) return;

            n.name = `__Fog__${idx}`;
            n.setParent(this.fogParent!, false);
            n.setPosition(basePos);

            const jr = (Math.random() * 2 - 1) * this.rotationJitterDeg;
            n.setRotationFromEuler(0, 0, baseRotDeg + jr);

            this._applyOpacity(n, 255);
            this._applyOpacity(n, opacity255);
        }
    }

    // =========================
    // clone 场景模板节点
    // =========================
    private _cloneTemplate(): Node | null {
        if (!this.fogTemplate || !this.fogTemplate.isValid) return null;
        // instantiate(Node) 可以 clone 任意节点（包括子节点、组件）
        return instantiate(this.fogTemplate);
    }

    // =========================
    // 透明度保证生效：UIOpacity + Sprite alpha
    // =========================
    private _applyOpacity(root: Node, opacity255: number): void {
        const o = math.clamp(Math.round(opacity255), 0, 255);

        // UIOpacity（UI 链路）
        const ops = root.getComponentsInChildren(UIOpacity);
        if (ops && ops.length > 0) {
            for (const op of ops) op.opacity = o;
        } else {
            const op = root.getComponent(UIOpacity) || root.addComponent(UIOpacity);
            op.opacity = o;
        }

        // Sprite alpha（世界/非 UI 也生效）
        const sprites = root.getComponentsInChildren(Sprite);
        for (const sp of sprites) {
            const c = sp.color;
            sp.color = new Color(c.r, c.g, c.b, o);
        }
    }

    // =========================
    // SDF：矩形有符号距离（拐角天然是圆弧 -> 去尖角）
    // =========================
    private _sdfRect(x: number, y: number, hx: number, hy: number): number {
        const ax = Math.abs(x) - hx;
        const ay = Math.abs(y) - hy;

        const ox = Math.max(ax, 0);
        const oy = Math.max(ay, 0);
        const outside = Math.sqrt(ox * ox + oy * oy);

        const inside = Math.min(Math.max(ax, ay), 0);
        return outside + inside;
    }

    private _opacityFromSignedDist(sd: number, halfFog: number): number {
        const t = (halfFog <= 0) ? 1 : math.clamp01(Math.abs(sd) / halfFog);

        const c = math.clamp(Math.round(this.centerOpacity), 0, 255);
        const e = math.clamp(Math.round(this.edgeOpacity), 0, 255);

        return Math.round(math.lerp(c, e, t));
    }

    private _randCentered(range: number, samples: number): number {
        const k = Math.max(2, Math.floor(samples));
        let sum = 0;
        for (let i = 0; i < k; i++) sum += Math.random();
        const u = sum / k;
        return (u - 0.5) * 2 * range;
    }

    private _getTemplateTileSize(template: Node): { w: number; h: number } {
        // 用 UITransform 的 contentSize 作为“云块尺寸”
        const ui = template.getComponent(UITransform);
        if (ui) {
            return {
                w: Math.max(1, ui.contentSize.width),
                h: Math.max(1, ui.contentSize.height),
            };
        }
        // 没有 UITransform，就给个保底
        return { w: 100, h: 100 };
    }
}
