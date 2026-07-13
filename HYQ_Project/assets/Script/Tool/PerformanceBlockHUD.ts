import {
    _decorator,
    Canvas,
    CCBoolean,
    CCFloat,
    CCInteger,
    Color,
    Component,
    director,
    Director,
    Enum,
    HorizontalTextAlignment,
    js,
    Label,
    LabelOutline,
    Layers,
    MeshRenderer,
    ModelRenderer,
    Node,
    ParticleSystem,
    SkeletalAnimation,
    SkinnedMeshRenderer,
    Sprite,
    UIRenderer,
    UITransform,
    VerticalTextAlignment,
    Widget,
    warn,
} from 'cc';

const { ccclass, property } = _decorator;

enum HudPanelPosition {
    左上角 = 0,
    右上角 = 1,
}

enum HudTextAlignment {
    左对齐 = 0,
    右对齐 = 1,
}

type BlockName = '玩家' | '怪物' | '子弹' | '道具' | '特效' | 'UI' | '环境' | '其他';

type BlockStats = {
    entities: number;
    nodes: number;
    renderers: number;
    skinnedRenderers: number;
    animations: number;
    particles: number;
    estimatedMainDc: number;
    estimatedShadowDc: number;
};

type HookRecord = {
    prototype: any;
    methodName: string;
    original: Function;
    wrapper: Function;
};

type HookTarget = {
    prototype: any;
    methodName: string;
    fixedBlock: BlockName | null;
};

type HiddenVisualRecord = {
    component: ModelRenderer | UIRenderer;
    block: BlockName;
    originalVisibility: number;
    originalEnabled: boolean;
};

const BLOCK_NAMES: BlockName[] = ['玩家', '怪物', '子弹', '道具', '特效', 'UI', '环境', '其他'];

const ENTITY_CLASS_BLOCK: { [className: string]: BlockName } = {
    Role: '玩家',
    MonsterBattleTaerget: '怪物',
    BulletBattle3D: '子弹',
    PropLalianGate: '道具',
    PropArms: '道具',
    PropBrand: '道具',
    PropTireGate: '道具',
    EffectTimeRemove: '特效',
    EffectTimePartRemove: '特效',
};

let activeHud: PerformanceBlockHUD | null = null;

@ccclass('PerformanceBlockHUD')
export class PerformanceBlockHUD extends Component {

    @property({ type: CCFloat, displayName: '刷新间隔(秒)', tooltip: '面板刷新和脚本CPU抽样间隔。建议 0.5~1 秒，过低会增加监控开销。' })
    public refreshInterval: number = 1;

    @property({ type: CCBoolean, displayName: '启用脚本CPU抽样', tooltip: '每个刷新周期抽样一帧项目脚本耗时。只统计被组件方法调用的项目脚本，不包含GPU和引擎内部骨骼计算。' })
    public enableCpuSampling: boolean = true;

    @property({ type: CCInteger, displayName: '字体大小' })
    public fontSize: number = 15;

    @property({ type: CCFloat, displayName: '面板宽度' })
    public panelWidth: number = 700;

    @property({ type: CCFloat, displayName: '面板高度' })
    public panelHeight: number = 560;

    @property({ type: Enum(HudPanelPosition), displayName: '面板位置' })
    public panelPosition: HudPanelPosition = HudPanelPosition.右上角;

    @property({ type: Enum(HudTextAlignment), displayName: '文字对齐' })
    public textAlignment: HudTextAlignment = HudTextAlignment.右对齐;

    @property({ type: CCFloat, displayName: '水平边距' })
    public horizontalOffset: number = 8;

    @property({ type: CCFloat, displayName: '上边距' })
    public topOffset: number = 8;

    @property({ type: CCBoolean, displayName: '显示空分块' })
    public showEmptyBlocks: boolean = false;

    @property({ type: CCBoolean, displayName: '隐藏玩家' })
    public hidePlayer: boolean = false;

    @property({ type: CCBoolean, displayName: '隐藏怪物' })
    public hideMonster: boolean = false;

    @property({ type: CCBoolean, displayName: '隐藏子弹' })
    public hideBullet: boolean = false;

    @property({ type: CCBoolean, displayName: '隐藏道具' })
    public hideProp: boolean = false;

    @property({ type: CCBoolean, displayName: '隐藏特效' })
    public hideEffect: boolean = false;

    @property({ type: CCBoolean, displayName: '隐藏UI' })
    public hideUi: boolean = false;

    @property({ type: CCBoolean, displayName: '隐藏环境' })
    public hideEnvironment: boolean = false;

    @property({ type: CCBoolean, displayName: '隐藏其他' })
    public hideOther: boolean = false;

    private hudNode: Node | null = null;
    private hudLabel: Label | null = null;
    private hookTargets: HookTarget[] = [];
    private hookRecords: HookRecord[] = [];
    private hiddenVisualRecords: HiddenVisualRecord[] = [];
    private hiddenVisualMap: Map<Component, HiddenVisualRecord> = new Map();
    private nodeBlockCache: WeakMap<Node, BlockName> = new WeakMap();
    private scanStack: Node[] = [];

    private frameCount: number = 0;
    private frameTime: number = 0;
    private nextRefreshAt: number = 0;
    private cpuSampling: boolean = false;
    private currentCpuByBlock: { [block: string]: number } = Object.create(null);
    private lastCpuByBlock: { [block: string]: number } = Object.create(null);
    private currentCpuByClass: { [className: string]: number } = Object.create(null);
    private lastCpuByClass: { [className: string]: number } = Object.create(null);

    protected onEnable(): void {
        if (activeHud && activeHud !== this) {
            warn('[PerformanceBlockHUD] 场景中只需要挂一个性能面板。');
            this.enabled = false;
            return;
        }

        activeHud = this;
        this.createHud();
        this.collectKnownHookTargets();
        this.collectSceneHookTargets();
        this.nextRefreshAt = 0;
        director.on(Director.EVENT_BEFORE_UPDATE, this.onBeforeUpdate, this);
    }

    protected onDisable(): void {
        director.off(Director.EVENT_BEFORE_UPDATE, this.onBeforeUpdate, this);
        this.cpuSampling = false;
        this.restoreHooks();
        this.restoreAllHiddenVisuals();
        this.hookTargets.length = 0;
        if (this.hudNode?.isValid) {
            this.hudNode.destroy();
        }
        this.hudNode = null;
        this.hudLabel = null;
        if (activeHud === this) {
            activeHud = null;
        }
    }

    protected update(dt: number): void {
        this.frameCount++;
        this.frameTime += Math.max(0, dt);
    }

    private onBeforeUpdate(): void {
        const now = this.now();

        // A sample remains active for one complete frame, including lateUpdate and AFTER_UPDATE callbacks.
        if (this.cpuSampling) {
            this.cpuSampling = false;
            this.restoreHooks();
            this.lastCpuByBlock = this.copyNumberMap(this.currentCpuByBlock);
            this.lastCpuByClass = this.copyNumberMap(this.currentCpuByClass);
            this.refreshHud();
        }

        if (now < this.nextRefreshAt) {
            return;
        }

        this.nextRefreshAt = now + Math.max(0.2, this.refreshInterval) * 1000;
        if (this.enableCpuSampling) {
            this.currentCpuByBlock = Object.create(null);
            this.currentCpuByClass = Object.create(null);
            this.collectKnownHookTargets();
            this.installCollectedHooks();
            this.cpuSampling = true;
        } else {
            this.refreshHud();
        }
    }

    private refreshHud(): void {
        if (!this.hudLabel?.isValid) {
            return;
        }

        const scanStart = this.now();
        const blockStats = this.scanScene();
        const scanMs = this.now() - scanStart;

        const fps = this.frameTime > 0 ? this.frameCount / this.frameTime : 0;
        const frameMs = this.frameCount > 0 ? this.frameTime * 1000 / this.frameCount : 0;
        this.frameCount = 0;
        this.frameTime = 0;

        const device = director.root?.device as any;
        const drawCalls = device?.numDrawCalls ?? 0;
        const triangles = device?.numTris ?? 0;
        const instances = device?.numInstances ?? 0;

        const lines: string[] = [];
        lines.push(`[性能分块] FPS ${fps.toFixed(1)} | 帧 ${frameMs.toFixed(2)}ms | DC ${drawCalls} | 三角 ${this.formatNumber(triangles)} | 实例 ${instances}`);

        const heapText = this.getHeapText();
        if (heapText) {
            lines.push(`JS堆 ${heapText} | HUD扫描 ${scanMs.toFixed(2)}ms/次 | 刷新 ${Math.max(0.2, this.refreshInterval).toFixed(2)}s`);
        } else {
            lines.push(`HUD扫描 ${scanMs.toFixed(2)}ms/次 | 刷新 ${Math.max(0.2, this.refreshInterval).toFixed(2)}s`);
        }

        lines.push('分块       实体  节点  渲染  骨骼R  动画  粒子  估主DC  估影DC  脚本ms');
        for (let i = 0; i < BLOCK_NAMES.length; i++) {
            const block = BLOCK_NAMES[i];
            const stats = blockStats[block];
            const cpu = this.lastCpuByBlock[block] ?? 0;
            if (!this.showEmptyBlocks && stats.nodes <= 0 && cpu <= 0) {
                continue;
            }
            lines.push(
                `${this.padRight(block, 5)} ${this.padLeft(stats.entities, 4)} ${this.padLeft(stats.nodes, 5)} ${this.padLeft(stats.renderers, 5)}`
                + ` ${this.padLeft(stats.skinnedRenderers, 5)} ${this.padLeft(stats.animations, 5)} ${this.padLeft(stats.particles, 5)}`
                + ` ${this.padLeft(stats.estimatedMainDc, 7)} ${this.padLeft(stats.estimatedShadowDc, 7)} ${this.padLeft(cpu.toFixed(2), 8)}`,
            );
        }

        const topClasses = Object.keys(this.lastCpuByClass)
            .map((name) => ({ name, ms: this.lastCpuByClass[name] }))
            .filter((item) => item.ms > 0.001)
            .sort((a, b) => b.ms - a.ms)
            .slice(0, 8);
        if (topClasses.length > 0) {
            lines.push('脚本CPU Top（抽样帧）:');
            for (let i = 0; i < topClasses.length; i++) {
                const item = topClasses[i];
                lines.push(`  ${i + 1}. ${item.name} ${item.ms.toFixed(2)}ms`);
            }
        }

        lines.push('说明：总DC为引擎实测；分块DC按活跃SubModel估算，UI可能被高估，阴影按投影Renderer估算。');
        lines.push('HUD自身通常增加约1 DC；脚本ms为低频抽样一帧，有少量探针开销，不含GPU和渲染线程。');
        this.hudLabel.string = lines.join('\n');
    }

    private scanScene(): { [block: string]: BlockStats } {
        const stats = this.createBlockStatsMap();
        const scene = director.getScene();
        if (!scene) {
            return stats;
        }

        this.nodeBlockCache = new WeakMap();
        this.syncHiddenVisuals();
        this.scanStack.length = 0;
        this.scanStack.push(scene);

        while (this.scanStack.length > 0) {
            const node = this.scanStack.pop();
            if (!node || !node.isValid || !node.activeInHierarchy) {
                continue;
            }

            const block = this.classifyNode(node);
            const blockStat = stats[block];
            blockStat.nodes++;

            const components = node.components;
            for (let i = 0; i < components.length; i++) {
                const component = components[i];
                if (!component || !component.isValid) {
                    continue;
                }

                this.collectComponentHookTargets(component);
                this.applyVisualHide(component, block);
                const className = js.getClassName(component) || component.constructor?.name || 'Unknown';
                const entityBlock = ENTITY_CLASS_BLOCK[className];
                if (entityBlock) {
                    stats[entityBlock].entities++;
                }

                if (!component.enabled) {
                    continue;
                }

                if (component instanceof SkeletalAnimation) {
                    blockStat.animations++;
                    continue;
                }

                if (component instanceof SkinnedMeshRenderer) {
                    blockStat.skinnedRenderers++;
                    this.addRendererStats(blockStat, component);
                    continue;
                }

                if (component instanceof MeshRenderer) {
                    this.addRendererStats(blockStat, component);
                    continue;
                }

                if (component instanceof ParticleSystem) {
                    const isPlaying = (component as any).isPlaying;
                    if (isPlaying !== false) {
                        blockStat.particles++;
                        if (component.visibility !== 0) {
                            blockStat.renderers++;
                            blockStat.estimatedMainDc++;
                        }
                    }
                    continue;
                }

                if (component instanceof Sprite || component instanceof Label) {
                    blockStat.renderers++;
                    blockStat.estimatedMainDc++;
                }
            }

            for (let i = 0; i < node.children.length; i++) {
                this.scanStack.push(node.children[i]);
            }
        }

        return stats;
    }

    private addRendererStats(stats: BlockStats, renderer: MeshRenderer): void {
        if (renderer.visibility === 0) {
            return;
        }
        stats.renderers++;
        const drawCount = this.getRendererDrawCount(renderer);
        stats.estimatedMainDc += drawCount;
        const shadowCastingMode = (renderer as any).shadowCastingMode ?? 0;
        if (shadowCastingMode !== 0) {
            stats.estimatedShadowDc += drawCount;
        }
    }

    private getRendererDrawCount(renderer: MeshRenderer): number {
        const subModels = (renderer as any).model?.subModels;
        if (subModels && subModels.length > 0) {
            return subModels.length;
        }
        const materials = renderer.sharedMaterials;
        if (materials && materials.length > 0) {
            let count = 0;
            for (let i = 0; i < materials.length; i++) {
                if (materials[i]) {
                    count++;
                }
            }
            return Math.max(1, count);
        }
        return 1;
    }

    private classifyNode(node: Node | null | undefined): BlockName {
        if (!node || !node.isValid) {
            return '其他';
        }
        const cached = this.nodeBlockCache.get(node);
        if (cached) {
            return cached;
        }

        let current: Node | null = node;
        let sawParticle = false;
        let sawUi = node.layer === Layers.Enum.UI_2D;
        while (current) {
            if (current !== node) {
                const ancestorBlock = this.nodeBlockCache.get(current);
                if (ancestorBlock) {
                    if (ancestorBlock === '玩家' || ancestorBlock === '怪物' || ancestorBlock === '子弹' || ancestorBlock === '道具') {
                        this.nodeBlockCache.set(node, ancestorBlock);
                        return ancestorBlock;
                    }
                    const inheritedBlock: BlockName = sawParticle || ancestorBlock === '特效'
                        ? '特效'
                        : (sawUi || ancestorBlock === 'UI' ? 'UI' : '环境');
                    this.nodeBlockCache.set(node, inheritedBlock);
                    return inheritedBlock;
                }
            }

            const components = current.components;
            for (let i = 0; i < components.length; i++) {
                const component = components[i];
                const className = js.getClassName(component) || component.constructor?.name || '';
                const explicitBlock = this.getExplicitBlockByClassName(className);
                if (explicitBlock) {
                    this.nodeBlockCache.set(node, explicitBlock);
                    return explicitBlock;
                }
                if (component instanceof ParticleSystem) {
                    sawParticle = true;
                }
                if (component instanceof Canvas || component instanceof Label || component instanceof Sprite) {
                    sawUi = true;
                }
            }

            const nameBlock = this.getBlockByNodeName(current.name);
            if (nameBlock) {
                this.nodeBlockCache.set(node, nameBlock);
                return nameBlock;
            }
            current = current.parent;
        }

        const result: BlockName = sawParticle ? '特效' : (sawUi ? 'UI' : '环境');
        this.nodeBlockCache.set(node, result);
        return result;
    }

    private getExplicitBlockByClassName(className: string): BlockName | null {
        if (!className) {
            return null;
        }
        if (className === 'Player' || className === 'Role') {
            return '玩家';
        }
        if (className.indexOf('Bullet') !== -1) {
            return '子弹';
        }
        if (className.indexOf('Monster') !== -1) {
            return '怪物';
        }
        if (className.indexOf('Effect') !== -1 || className === 'FlashRedManager' || className === 'AttackParkPlay') {
            return '特效';
        }
        if (className.indexOf('Prop') !== -1 || className === 'ArmsUp') {
            return '道具';
        }
        if (className.indexOf('Guide') !== -1 || className.indexOf('Rocker') !== -1 || className.indexOf('Shopping') !== -1 || className.indexOf('Panel') !== -1) {
            return 'UI';
        }
        return null;
    }

    private getBlockByNodeName(name: string): BlockName | null {
        const value = (name || '').toLowerCase();
        if (value.indexOf('bullet') !== -1) return '子弹';
        if (value.indexOf('monster') !== -1 || value.indexOf('zombie') !== -1 || value.indexOf('boss') !== -1) return '怪物';
        if (value === 'player' || value.indexOf('role_') !== -1) return '玩家';
        if (value.indexOf('effect') !== -1 || value.indexOf('fx_') !== -1) return '特效';
        if (value.indexOf('lalian') !== -1 || value.indexOf('prop') !== -1 || value.indexOf('weapon') !== -1 || value.indexOf('youtong') !== -1 || value.indexOf('tire') !== -1) return '道具';
        if (value.indexOf('canvas') !== -1 || value.indexOf('ui') !== -1 || value.indexOf('guide') !== -1) return 'UI';
        return null;
    }

    private createHud(): void {
        const scene = director.getScene();
        const canvas = scene?.getComponentInChildren(Canvas);
        if (!canvas) {
            warn('[PerformanceBlockHUD] 当前场景没有 Canvas，无法创建性能文本面板。');
            return;
        }

        const hudNode = new Node('PerformanceBlockHUD_Label');
        hudNode.layer = Layers.Enum.UI_2D;
        canvas.node.addChild(hudNode);

        const transform = hudNode.addComponent(UITransform);
        transform.setContentSize(Math.max(320, this.panelWidth), Math.max(240, this.panelHeight));
        const alignRight = this.panelPosition === HudPanelPosition.右上角;
        transform.setAnchorPoint(alignRight ? 1 : 0, 1);

        const widget = hudNode.addComponent(Widget);
        widget.isAlignLeft = !alignRight;
        widget.isAlignRight = alignRight;
        widget.isAlignTop = true;
        if (alignRight) {
            widget.right = this.horizontalOffset;
        } else {
            widget.left = this.horizontalOffset;
        }
        widget.top = this.topOffset;
        widget.updateAlignment();

        const label = hudNode.addComponent(Label);
        label.fontSize = Math.max(10, Math.floor(this.fontSize));
        label.lineHeight = label.fontSize + 3;
        label.enableWrapText = false;
        label.horizontalAlign = this.textAlignment === HudTextAlignment.右对齐
            ? HorizontalTextAlignment.RIGHT
            : HorizontalTextAlignment.LEFT;
        label.verticalAlign = VerticalTextAlignment.TOP;
        label.color = new Color(225, 255, 225, 255);
        label.string = '性能分块初始化中...';

        const outline = hudNode.addComponent(LabelOutline);
        outline.color = new Color(0, 0, 0, 255);
        outline.width = 2;

        this.hudNode = hudNode;
        this.hudLabel = label;
    }

    private isBlockHidden(block: BlockName): boolean {
        switch (block) {
            case '玩家': return this.hidePlayer;
            case '怪物': return this.hideMonster;
            case '子弹': return this.hideBullet;
            case '道具': return this.hideProp;
            case '特效': return this.hideEffect;
            case 'UI': return this.hideUi;
            case '环境': return this.hideEnvironment;
            case '其他': return this.hideOther;
            default: return false;
        }
    }

    private applyVisualHide(component: Component, block: BlockName): void {
        const previousRecord = this.hiddenVisualMap.get(component);
        if (previousRecord && previousRecord.block !== block) {
            this.restoreHiddenVisual(previousRecord);
            this.hiddenVisualMap.delete(component);
            const index = this.hiddenVisualRecords.indexOf(previousRecord);
            if (index !== -1) {
                this.hiddenVisualRecords.splice(index, 1);
            }
        }

        if (!this.isBlockHidden(block) || component.node === this.hudNode) {
            return;
        }
        if (!(component instanceof ModelRenderer) && !(component instanceof UIRenderer)) {
            return;
        }

        let record = this.hiddenVisualMap.get(component);
        if (!record) {
            record = {
                component,
                block,
                originalVisibility: component instanceof ModelRenderer ? component.visibility : 0,
                originalEnabled: component.enabled,
            };
            this.hiddenVisualMap.set(component, record);
            this.hiddenVisualRecords.push(record);
        }

        if (component instanceof ModelRenderer) {
            component.visibility = 0;
        } else {
            component.enabled = false;
        }
    }

    private syncHiddenVisuals(): void {
        for (let i = this.hiddenVisualRecords.length - 1; i >= 0; i--) {
            const record = this.hiddenVisualRecords[i];
            if (!record.component?.isValid || !this.isBlockHidden(record.block)) {
                this.restoreHiddenVisual(record);
                this.hiddenVisualMap.delete(record.component);
                this.hiddenVisualRecords.splice(i, 1);
                continue;
            }

            if (record.component instanceof ModelRenderer) {
                record.component.visibility = 0;
            } else {
                record.component.enabled = false;
            }
        }
    }

    private restoreAllHiddenVisuals(): void {
        for (let i = this.hiddenVisualRecords.length - 1; i >= 0; i--) {
            this.restoreHiddenVisual(this.hiddenVisualRecords[i]);
        }
        this.hiddenVisualRecords.length = 0;
        this.hiddenVisualMap.clear();
    }

    private restoreHiddenVisual(record: HiddenVisualRecord): void {
        const component = record.component;
        if (!component?.isValid) {
            return;
        }
        if (component instanceof ModelRenderer) {
            component.visibility = record.originalVisibility;
        } else {
            component.enabled = record.originalEnabled;
        }
    }

    private collectKnownHookTargets(): void {
        const knownHooks: Array<{ className: string, methodName: string, block: BlockName }> = [
            { className: 'BulletMonsterCollisionManager', methodName: 'update', block: '子弹' },
            { className: 'EffectManager', methodName: 'frameReleaseSpecialEffects', block: '特效' },
            { className: 'FlashRedManager', methodName: '_update', block: '特效' },
        ];

        for (let i = 0; i < knownHooks.length; i++) {
            const item = knownHooks[i];
            const ctor = js.getClassByName(item.className) as any;
            if (ctor?.prototype) {
                this.addHookTarget(ctor.prototype, item.methodName, item.block);
            }
        }
    }

    private collectSceneHookTargets(): void {
        const scene = director.getScene();
        if (!scene) {
            return;
        }
        this.scanStack.length = 0;
        this.scanStack.push(scene);
        while (this.scanStack.length > 0) {
            const node = this.scanStack.pop();
            if (!node || !node.isValid) {
                continue;
            }
            const components = node.components;
            for (let i = 0; i < components.length; i++) {
                this.collectComponentHookTargets(components[i]);
            }
            for (let i = 0; i < node.children.length; i++) {
                this.scanStack.push(node.children[i]);
            }
        }
    }

    private collectComponentHookTargets(component: Component): void {
        if (!component || component === this) {
            return;
        }
        const className = js.getClassName(component) || component.constructor?.name || '';
        if (!className || className.indexOf('cc.') === 0) {
            return;
        }
        let prototype = Object.getPrototypeOf(component);
        while (prototype && prototype !== Component.prototype) {
            if (Object.prototype.hasOwnProperty.call(prototype, '_update')) {
                this.addHookTarget(prototype, '_update', null);
            }
            if (Object.prototype.hasOwnProperty.call(prototype, 'update')) {
                this.addHookTarget(prototype, 'update', null);
            }
            if (Object.prototype.hasOwnProperty.call(prototype, 'lateUpdate')) {
                this.addHookTarget(prototype, 'lateUpdate', null);
            }
            prototype = Object.getPrototypeOf(prototype);
        }
    }

    private addHookTarget(prototype: any, methodName: string, fixedBlock: BlockName | null): void {
        const method = prototype?.[methodName];
        if (typeof method !== 'function') {
            return;
        }
        for (let i = 0; i < this.hookTargets.length; i++) {
            const target = this.hookTargets[i];
            if (target.prototype === prototype && target.methodName === methodName) {
                if (fixedBlock && !target.fixedBlock) {
                    target.fixedBlock = fixedBlock;
                }
                return;
            }
        }
        this.hookTargets.push({ prototype, methodName, fixedBlock });
    }

    private installCollectedHooks(): void {
        for (let i = 0; i < this.hookTargets.length; i++) {
            const target = this.hookTargets[i];
            this.installHook(target.prototype, target.methodName, target.fixedBlock);
        }
    }

    private installHook(prototype: any, methodName: string, fixedBlock: BlockName | null): void {
        const original = prototype?.[methodName];
        if (typeof original !== 'function') {
            return;
        }
        for (let i = 0; i < this.hookRecords.length; i++) {
            const record = this.hookRecords[i];
            if (record.prototype === prototype && record.methodName === methodName) {
                return;
            }
        }

        const wrapper = function (this: any, ...args: any[]) {
            const hud = activeHud;
            if (!hud || !hud.cpuSampling) {
                return original.apply(this, args);
            }

            const start = hud.now();
            try {
                return original.apply(this, args);
            } finally {
                const className = js.getClassName(this) || this?.constructor?.name || methodName;
                const block = fixedBlock ?? hud.classifyNode(this?.node) ?? '其他';
                hud.recordCpu(block, className, hud.now() - start);
            }
        };

        prototype[methodName] = wrapper;
        this.hookRecords.push({ prototype, methodName, original, wrapper });
    }

    private restoreHooks(): void {
        for (let i = this.hookRecords.length - 1; i >= 0; i--) {
            const record = this.hookRecords[i];
            if (record.prototype?.[record.methodName] === record.wrapper) {
                record.prototype[record.methodName] = record.original;
            }
        }
        this.hookRecords.length = 0;
    }

    private recordCpu(block: BlockName, className: string, milliseconds: number): void {
        this.currentCpuByBlock[block] = (this.currentCpuByBlock[block] ?? 0) + milliseconds;
        this.currentCpuByClass[className] = (this.currentCpuByClass[className] ?? 0) + milliseconds;
    }

    private createBlockStatsMap(): { [block: string]: BlockStats } {
        const result: { [block: string]: BlockStats } = Object.create(null);
        for (let i = 0; i < BLOCK_NAMES.length; i++) {
            result[BLOCK_NAMES[i]] = {
                entities: 0,
                nodes: 0,
                renderers: 0,
                skinnedRenderers: 0,
                animations: 0,
                particles: 0,
                estimatedMainDc: 0,
                estimatedShadowDc: 0,
            };
        }
        return result;
    }

    private copyNumberMap(source: { [key: string]: number }): { [key: string]: number } {
        const result: { [key: string]: number } = Object.create(null);
        const keys = Object.keys(source);
        for (let i = 0; i < keys.length; i++) {
            result[keys[i]] = source[keys[i]];
        }
        return result;
    }

    private getHeapText(): string {
        const perf = typeof performance !== 'undefined' ? performance as any : null;
        const memory = perf?.memory;
        if (!memory?.usedJSHeapSize) {
            return '';
        }
        const used = memory.usedJSHeapSize / 1024 / 1024;
        const total = memory.totalJSHeapSize / 1024 / 1024;
        return `${used.toFixed(1)}/${total.toFixed(1)}MB`;
    }

    private formatNumber(value: number): string {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}m`;
        if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
        return `${Math.max(0, Math.floor(value))}`;
    }

    private padLeft(value: string | number, width: number): string {
        const text = String(value);
        return text.length >= width ? text : ' '.repeat(width - text.length) + text;
    }

    private padRight(value: string | number, width: number): string {
        const text = String(value);
        return text.length >= width ? text : text + ' '.repeat(width - text.length);
    }

    private now(): number {
        return typeof performance !== 'undefined' ? performance.now() : Date.now();
    }
}
