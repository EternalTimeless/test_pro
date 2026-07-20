import { Color, director, Director, game, Material, MeshRenderer, Node } from 'cc';

/** 闪红属性配置接口 */
export interface IFlashPropData {
    /** 材质颜色属性名，如 emissive、mainColor、albedo、baseColor */
    propName: string;
    /** 该属性所属的Pass索引（通道） */
    passIndex: number;
    /**
     * 目标材质索引（-1=应用到MeshRenderer上所有材质，0+=仅应用到指定索引的材质）
     * @default -1
     */
    matIndex?: number;
}

/** 开关属性配置接口（用于float类型uniform的开关控制，如 u_flashEnable 0→1→0） */
export interface IFlashSwitchData {
    /** 属性名，如 u_flashEnable */
    propName: string;
    /** 该属性所属的Pass索引（通道） */
    passIndex: number;
    /**
     * 目标材质索引（-1=应用到MeshRenderer上所有材质，0+=仅应用到指定索引的材质）
     * @default -1
     */
    matIndex?: number;
    /** 闪红时设置的值（如1表示开启） */
    flashValue: number;
    /** 恢复时设置的值（如0表示关闭），默认0 */
    restoreValue?: number;
    /**
     * 是否使用 Material.setProperty 设置（而非 Pass.setUniform）
     * - 当shader属性使用了 target 映射时（如 grayEnable: { target: grayParam.x }），
     *   必须设为 true，否则 Pass.setUniform 无法设置单个分量
     * - 当shader属性名与uniform名一致时，设为 false（默认）
     * @default false
     */
    useMaterialProp?: boolean;
}

/** 闪红MeshRenderer配置接口 */
export interface IFlashData {
    /** 目标MeshRenderer */
    meshRender: MeshRenderer;
    /** 闪红时修改的材质颜色属性列表（vec4/Color类型） */
    colorProps: IFlashPropData[];
    /** 闪红时修改的开关属性列表（float类型，如 u_flashEnable 0→1→0） */
    switchProps?: IFlashSwitchData[];
}

/** 闪红条目 - 由对象池管理 */
class FlashEntry {
    /** 目标节点 */
    public node: Node | null = null;
    /** 闪红配置 */
    public flashDataList: IFlashData[] | null = null;
    /** 剩余时间 */
    public remainingTime: number = 0;
    /** 闪红颜色 */
    public flashColor: Color = new Color(255, 0, 0, 255);
    /** 保存的原始共享材质 */
    public savedMats: { renderer: MeshRenderer; originalMats: (Material | null)[] }[] = [];
    /** 分组缓存key（有值=走分组快速通道，跳过逐属性设置） */
    public groupKey: string | null = null;
    /** flashRedIntensity 覆盖值；NaN 表示使用配置中的 flashValue */
    public flashRedIntensityOverride: number = Number.NaN;
    /** grayScaleFactor 覆盖值；NaN 表示使用配置中的 flashValue */
    public grayScaleFactorOverride: number = Number.NaN;

    public reset(): void {
        this.node = null;
        this.flashDataList = null;
        this.remainingTime = 0;
        this.savedMats.length = 0;
        this.groupKey = null;
        this.flashRedIntensityOverride = Number.NaN;
        this.grayScaleFactorOverride = Number.NaN;
    }
}

/**
 * 闪红管理器 - 独立于继承体系，任何地方都可调用
 *
 * 使用方式：
 * ```ts
 * import { FlashRedManager } from './FlashRedManager';
 *
 * // 方式1：传入 IFlashData 数组
 * FlashRedManager.instance.flashRed(node, flashDataList, 0.15);
 *
 * // 方式2：配合 BattleTargetBase 的 meshFlashDataList
 * FlashRedManager.instance.flashRed(this.node, this.meshFlashDataList, 0.15);
 *
 * // 停止闪红
 * FlashRedManager.instance.stopFlashRed(node);
 * ```
 *
 * 优化特性：
 * - 按需注册/注销 director 帧回调，无闪红时零开销
 * - 对象池复用 FlashEntry，减少 GC
 * - 节点销毁时自动清理，无内存泄漏
 * - 闪红结束后恢复共享材质，确保重新合批
 */
export class FlashRedManager {
    private static _instance: FlashRedManager | null = null;

    public static get instance(): FlashRedManager {
        if (!FlashRedManager._instance) {
            FlashRedManager._instance = new FlashRedManager();
        }
        return FlashRedManager._instance;
    }

    /** 默认闪红颜色 */
    private static readonly DEFAULT_COLOR = new Color(255, 0, 0, 255);

    /**
     * Pass uniform handle 缓存，避免每次闪红都调用 pass.getHandle() 做字符串哈希查找。
     * WeakMap 保证 pass 被销毁时缓存自动清理，无内存泄漏。
     */
    private static _handleCache: WeakMap<object, Map<string, number>> = new WeakMap();

    /**
     * 分组材质模板缓存。
     * key=groupKey, value=已配置好闪红属性的独立 Material 数组。
     * 同组后续闪红直接 mr.sharedMaterials = templates，跳过所有 pass.setUniform 调用。
     */
    private static _groupCache: Map<string, (Material | null)[]> = new Map();

    /** 活跃的闪红条目，按节点UUID索引 */
    private _activeFlashes: Map<string, FlashEntry> = new Map();

    /** 待处理的闪红条目队列（帧限流用） */
    private _pendingQueue: FlashEntry[] = [];

    /** 待处理队列的UUID集合，用于O(1)去重查询 */
    private _pendingUuids: Set<string> = new Set();

    /**
     * 每帧最多处理的新闪红请求数。
     * 大量单位同时闪红时可适当调大（如20~50），避免分帧导致闪红延迟。
     * @default 5
     */
    public maxNewPerFrame: number = 70;

    /** 对象池 */
    private _pool: FlashEntry[] = [];

    /** 帧回调引用 */
    private _directorCallback: (dt: number) => void;

    /** 是否已注册帧回调 */
    private _registered: boolean = false;

    private constructor() {
        this._directorCallback = () => {
            this._update();
        };
    }

    /** 从池中获取或创建 FlashEntry */
    private _acquire(): FlashEntry {
        return this._pool.length > 0 ? this._pool.pop()! : new FlashEntry();
    }

    /** 归还 FlashEntry 到池中 */
    private _release(entry: FlashEntry): void {
        entry.reset();
        this._pool.push(entry);
    }

    /** 注册帧回调（按需注册，无闪红时零开销） */
    private _registerUpdate(): void {
        if (!this._registered) {
            director.on(Director.EVENT_AFTER_UPDATE, this._directorCallback);
            this._registered = true;
        }
    }

    /** 注销帧回调 */
    private _unregisterUpdate(): void {
        if (this._registered) {
            director.off(Director.EVENT_AFTER_UPDATE, this._directorCallback);
            this._registered = false;
        }
    }

    /**
     * 触发闪红效果
     * - 闪红途中再次调用不会触发
     * - 闪红前保存原始共享材质，闪红后恢复共享材质以重新合批
     * - 每个MeshRenderer可单独配置颜色属性名列表，兼容不同shader
     *
     * @param node 目标节点（用于标识闪红实例、节点有效性检查）
     * @param flashDataList MeshRenderer闪红配置列表（实现 IFlashData 接口即可）
     * @param duration 闪红持续时间（秒），默认0.15
     * @param flashColor 闪红颜色，默认红色 (255,50,50,255)
     * @param groupKey 分组标识。同组首次闪红会缓存材质模板，后续同组闪红直接复用模板，
     *                 跳过所有 pass.setUniform 调用，大幅降低批量闪红的材质修改开销。
     *                 典型用法：同类型敌人传同一个 key，如 'enemy_hit'。
     */
    public flashRed(node: Node, flashDataList: IFlashData[], duration: number = 0.15, flashColor: Color | null = null, groupKey?: string, flashRedIntensityOverride: number = Number.NaN, grayScaleFactorOverride: number = Number.NaN): void {
        if (!node || !node.isValid) return;
        if (!flashDataList || flashDataList.length === 0) return;

        const uuid = node.uuid;
        // 闪红途中或已在队列中则不再添加
        if (this._activeFlashes.has(uuid) || this._pendingUuids.has(uuid)) return;

        const entry = this._acquire();
        entry.node = node;
        entry.flashDataList = flashDataList;
        entry.remainingTime = duration;
        entry.groupKey = groupKey ?? null;
        entry.flashRedIntensityOverride = flashRedIntensityOverride;
        entry.grayScaleFactorOverride = grayScaleFactorOverride;

        if (flashColor) {
            entry.flashColor.set(flashColor);
        } else {
            entry.flashColor.set(FlashRedManager.DEFAULT_COLOR);
        }

        // 入队等待处理，不在本帧直接 _applyFlash
        this._pendingQueue.push(entry);
        this._pendingUuids.add(uuid);
        this._registerUpdate();
    }

    /**
     * 原地替换节点当前闪色模板，用于分档过渡。
     * 复用已有 FlashEntry，避免每个过渡档重复创建对象或等待队列。
     */
    public replaceFlash(
        node: Node,
        flashDataList: IFlashData[],
        duration: number,
        flashColor: Color | null,
        groupKey: string,
        flashRedIntensityOverride: number = Number.NaN,
        grayScaleFactorOverride: number = Number.NaN,
    ): void {
        if (!node || !node.isValid || !flashDataList || flashDataList.length === 0) {
            return;
        }

        const uuid = node.uuid;
        const entry = this._activeFlashes.get(uuid);
        if (!entry) {
            // 同帧批量死亡时条目可能仍在待处理队列，直接更新该条目，
            // 避免后续过渡档因 pending uuid 去重而丢失。
            for (let i = 0; i < this._pendingQueue.length; i++) {
                const pendingEntry = this._pendingQueue[i];
                if (pendingEntry.node?.uuid !== uuid) {
                    continue;
                }
                pendingEntry.flashDataList = flashDataList;
                pendingEntry.remainingTime = duration;
                pendingEntry.groupKey = groupKey;
                pendingEntry.flashRedIntensityOverride = flashRedIntensityOverride;
                pendingEntry.grayScaleFactorOverride = grayScaleFactorOverride;
                if (flashColor) {
                    pendingEntry.flashColor.set(flashColor);
                } else {
                    pendingEntry.flashColor.set(FlashRedManager.DEFAULT_COLOR);
                }
                return;
            }
            this.flashRed(node, flashDataList, duration, flashColor, groupKey, flashRedIntensityOverride, grayScaleFactorOverride);
            return;
        }

        this._restoreEntry(entry);
        entry.savedMats.length = 0;
        entry.flashDataList = flashDataList;
        entry.remainingTime = duration;
        entry.groupKey = groupKey;
        entry.flashRedIntensityOverride = flashRedIntensityOverride;
        entry.grayScaleFactorOverride = grayScaleFactorOverride;
        if (flashColor) {
            entry.flashColor.set(flashColor);
        } else {
            entry.flashColor.set(FlashRedManager.DEFAULT_COLOR);
        }
        this._applyFlash(entry);
    }

    /**
     * 同步预热一次闪红材质实例化与恢复流程，用于加载阶段消化首次材质改写开销。
     */
    public prewarm(node: Node, flashDataList: IFlashData[], flashColor: Color | null = null, groupKey?: string, flashRedIntensityOverride: number = Number.NaN, grayScaleFactorOverride: number = Number.NaN): void {
        if (!node || !node.isValid) return;
        if (!flashDataList || flashDataList.length === 0) return;

        const entry = this._acquire();
        entry.node = node;
        entry.flashDataList = flashDataList;
        entry.groupKey = groupKey ?? null;
        entry.flashRedIntensityOverride = flashRedIntensityOverride;
        entry.grayScaleFactorOverride = grayScaleFactorOverride;
        if (flashColor) {
            entry.flashColor.set(flashColor);
        } else {
            entry.flashColor.set(FlashRedManager.DEFAULT_COLOR);
        }

        this._applyFlash(entry);
        this._restoreEntry(entry);
        this._release(entry);
    }

    /**
     * 停止指定节点的闪红效果，立即恢复原始材质
     */
    public stopFlashRed(node: Node): void {
        if (!node) return;
        const uuid = node.uuid;
        for (let i = this._pendingQueue.length - 1; i >= 0; i--) {
            const entry = this._pendingQueue[i];
            if (entry.node?.uuid === uuid) {
                this._pendingQueue.splice(i, 1);
                this._pendingUuids.delete(uuid);
                this._release(entry);
            }
        }

        const entry = this._activeFlashes.get(uuid);
        if (!entry) {
            if (this._activeFlashes.size === 0 && this._pendingQueue.length === 0) {
                this._unregisterUpdate();
            }
            return;
        }

        this._restoreEntry(entry);
        this._activeFlashes.delete(uuid);
        this._release(entry);

        if (this._activeFlashes.size === 0 && this._pendingQueue.length === 0) {
            this._unregisterUpdate();
        }
    }

    /**
     * 检查指定节点是否正在闪红
     */
    public isFlashing(node: Node): boolean {
        return node ? this._activeFlashes.has(node.uuid) : false;
    }

    /**
     * 清除分组材质模板缓存。
     * @param groupKey 不传则清除全部缓存
     */
    public clearGroupCache(groupKey?: string): void {
        if (groupKey) {
            FlashRedManager._groupCache.delete(groupKey);
        } else {
            FlashRedManager._groupCache.clear();
        }
    }

    /**
     * 获取缓存的 pass uniform handle，避免每次闪红都做 pass.getHandle() 字符串查找。
     * 缓存用 WeakMap<pass, Map<propName, handle>> 结构，pass 销毁时自动清理。
     */
    private static _getCachedHandle(pass: object, propName: string): number | undefined {
        let propMap = FlashRedManager._handleCache.get(pass);
        if (!propMap) {
            propMap = new Map();
            FlashRedManager._handleCache.set(pass, propMap);
        }
        if (propMap.has(propName)) {
            return propMap.get(propName)!;
        }
        const handle = (pass as any).getHandle(propName);
        if (handle !== undefined && handle >= 0) {
            propMap.set(propName, handle);
            return handle;
        }
        return undefined;
    }

    private _resolveSwitchFlashValue(
        switchProp: IFlashSwitchData,
        flashRedIntensityOverride: number,
        grayScaleFactorOverride: number,
    ): number {
        if (switchProp.propName === 'flashRedIntensity' && Number.isFinite(flashRedIntensityOverride)) {
            return flashRedIntensityOverride;
        }
        if (switchProp.propName === 'grayScaleFactor' && Number.isFinite(grayScaleFactorOverride)) {
            return grayScaleFactorOverride;
        }
        return switchProp.flashValue;
    }

    /** 应用闪红效果 */
    private _applyFlash(entry: FlashEntry): void {
        const color = entry.flashColor;
        const groupKey = entry.groupKey;

        for (const data of entry.flashDataList!) {
            const mr = data.meshRender;
            if (!mr || !mr.isValid) continue;

            const originalMats = [...mr.sharedMaterials];
            entry.savedMats.push({ renderer: mr, originalMats });

            // 计算哪些材质索引需要实例化（-1 = 全部需要）
            const needAll = data.colorProps.some(p => (p.matIndex ?? -1) < 0)
                || (data.switchProps || []).some(p => (p.matIndex ?? -1) < 0);
            const neededSet = new Set<number>();
            if (!needAll) {
                for (const p of data.colorProps) neededSet.add(p.matIndex ?? 0);
                for (const p of data.switchProps || []) neededSet.add(p.matIndex ?? 0);
            }

            // ====== 快速通道：分组缓存命中 ======
            if (groupKey && FlashRedManager._groupCache.has(groupKey)) {
                // 用预配置的模板材质逐槽替换。
                // 不用 sharedMaterials setter 一次性赋值，逐个 setSharedMaterial 更明确。
                const templates = FlashRedManager._groupCache.get(groupKey)!;
                for (let i = 0; i < templates.length; i++) {
                    if (templates[i]) {
                        mr.setSharedMaterial(templates[i], i);
                    }
                }
                continue;
            }

            // ====== 慢速通道：首次创建实例并逐属性设置 ======
            const totalMats = mr.sharedMaterials.length;
            for (let i = 0; i < totalMats; i++) {
                if (!needAll && !neededSet.has(i)) continue;
                const mat = mr.getMaterialInstance(i);
                if (!mat) continue;

                for (const propData of data.colorProps) {
                    if (!propData.propName) continue;
                    const targetMatIdx = propData.matIndex ?? -1;
                    if (targetMatIdx >= 0 && targetMatIdx !== i) continue;
                    const passIdx = propData.passIndex;
                    const pass = mat.passes[passIdx];
                    if (!pass) continue;
                    const handle = FlashRedManager._getCachedHandle(pass, propData.propName);
                    if (handle !== undefined) {
                        pass.setUniform(handle, color);
                    }
                }

                for (const switchProp of data.switchProps || []) {
                    if (!switchProp.propName) continue;
                    const targetMatIdx = switchProp.matIndex ?? -1;
                    if (targetMatIdx >= 0 && targetMatIdx !== i) continue;
                    const flashValue = this._resolveSwitchFlashValue(
                        switchProp,
                        entry.flashRedIntensityOverride,
                        entry.grayScaleFactorOverride,
                    );
                    if (switchProp.useMaterialProp) {
                        mat.setProperty(switchProp.propName, flashValue);
                    } else {
                        const passIdx = switchProp.passIndex;
                        const pass = mat.passes[passIdx];
                        if (!pass) continue;
                        const handle = FlashRedManager._getCachedHandle(pass, switchProp.propName);
                        if (handle !== undefined) {
                            pass.setUniform(handle, flashValue);
                        }
                    }
                }
            }

            // ====== 填充分组缓存 ======
            // 关键：不从 MaterialInstance 复制（copy() 可能丢失实例覆盖的 uniform 值），
            // 而是从原始共享材质出发，把闪红属性直接设置到独立模板上。
            if (groupKey && !FlashRedManager._groupCache.has(groupKey)) {
                FlashRedManager._groupCache.set(groupKey,
                    this._buildGroupTemplates(
                        mr,
                        originalMats,
                        data,
                        color,
                        needAll,
                        neededSet,
                        entry.flashRedIntensityOverride,
                        entry.grayScaleFactorOverride,
                    ));
            }
        }
    }

    /**
     * 从原始共享材质构建分组模板。
     * 不走 MaterialInstance.copy()，避免丢失 uniform 覆盖值。
     * 模板 = 原始共享材质副本 + 闪红属性直接写入。
     */
    private _buildGroupTemplates(
        mr: MeshRenderer,
        originalMats: (Material | null)[],
        data: IFlashData,
        color: Color,
        needAll: boolean,
        neededSet: Set<number>,
        flashRedIntensityOverride: number,
        grayScaleFactorOverride: number,
    ): (Material | null)[] {
        const templates: (Material | null)[] = [];
        for (let i = 0; i < mr.sharedMaterials.length; i++) {
            if (!needAll && !neededSet.has(i)) {
                templates[i] = originalMats[i];
                continue;
            }

            const sharedMat = originalMats[i];
            if (!sharedMat) {
                templates[i] = null;
                continue;
            }

            const tpl = new Material();
            tpl.copy(sharedMat);

            // 直接往模板上设置闪红颜色属性
            for (const propData of data.colorProps) {
                if (!propData.propName) continue;
                const targetMatIdx = propData.matIndex ?? -1;
                if (targetMatIdx >= 0 && targetMatIdx !== i) continue;
                const pass = tpl.passes[propData.passIndex];
                if (!pass) continue;
                const handle = pass.getHandle(propData.propName);
                if (handle !== undefined && handle >= 0) {
                    pass.setUniform(handle, color);
                }
            }

            // 直接往模板上设置开关属性
            for (const switchProp of data.switchProps || []) {
                if (!switchProp.propName) continue;
                const targetMatIdx = switchProp.matIndex ?? -1;
                if (targetMatIdx >= 0 && targetMatIdx !== i) continue;
                const flashValue = this._resolveSwitchFlashValue(
                    switchProp,
                    flashRedIntensityOverride,
                    grayScaleFactorOverride,
                );
                if (switchProp.useMaterialProp) {
                    tpl.setProperty(switchProp.propName, flashValue);
                } else {
                    const pass = tpl.passes[switchProp.passIndex];
                    if (!pass) continue;
                    const handle = pass.getHandle(switchProp.propName);
                    if (handle !== undefined && handle >= 0) {
                        pass.setUniform(handle, flashValue);
                    }
                }
            }

            templates[i] = tpl;
        }
        return templates;
    }

    /** 恢复闪红条目的原始状态，恢复合批 */
    private _restoreEntry(entry: FlashEntry): void {
        for (const { renderer: savedMr, originalMats } of entry.savedMats) {
            if (!savedMr || !savedMr.isValid) continue;

            // 关键：必须先清空再恢复，不能直接赋值 originalMats！
            //
            // Cocos 3.8 引擎 sharedMaterials setter 内部逻辑：
            //   set sharedMaterials(val) {
            //       for (i) { if (val[i] !== this._materials[i]) setSharedMaterial(val[i], i); }
            //   }
            //
            // 闪红期间只修改了 _materialInstances，_materials（共享材质）从未变过，
            // 所以直接赋值 originalMats 时 val[i] === this._materials[i]（同一引用），
            // setSharedMaterial 不会被调用，材质实例不会被销毁，合批无法恢复！
            //
            // 解决：先设为空数组 → 触发 setSharedMaterial(null, i) → 销毁材质实例 → 再恢复原始共享材质
            // 同一帧内两次赋值，无视觉闪烁
            savedMr.sharedMaterials = [];
            savedMr.sharedMaterials = originalMats;
        }
    }

    /** 每帧更新，处理待处理队列和闪红超时、节点销毁 */
    private _update(): void {
        const dt = game.deltaTime;

        // 1. 从待处理队列取最多 maxNewPerFrame 个执行
        let processed = 0;
        while (this._pendingQueue.length > 0 && processed < this.maxNewPerFrame) {
            const entry = this._pendingQueue.shift()!;
            processed++;

            if (!entry.node) {
                this._release(entry);
                continue;
            }

            this._pendingUuids.delete(entry.node.uuid);

            if (!entry.node.isValid) {
                this._release(entry);
                continue;
            }

            this._applyFlash(entry);
            this._activeFlashes.set(entry.node.uuid, entry);
        }

        // 2. 处理活跃闪红超时
        if (this._activeFlashes.size === 0 && this._pendingQueue.length === 0) {
            this._unregisterUpdate();
            return;
        }

        const toRemoveKeys: string[] = [];

        this._activeFlashes.forEach((entry, uuid) => {
            if (!entry.node || !entry.node.isValid) {
                toRemoveKeys.push(uuid);
                this._release(entry);
                return;
            }

            entry.remainingTime -= dt;
            if (entry.remainingTime <= 0) {
                this._restoreEntry(entry);
                toRemoveKeys.push(uuid);
                this._release(entry);
            }
        });

        for (const key of toRemoveKeys) {
            this._activeFlashes.delete(key);
        }

        if (this._activeFlashes.size === 0 && this._pendingQueue.length === 0) {
            this._unregisterUpdate();
        }
    }
}
