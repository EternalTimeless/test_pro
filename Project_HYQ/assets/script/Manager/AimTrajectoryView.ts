import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import FlyManager from './FlyManager';

const { ccclass, property } = _decorator;

/** 瞄准线曲线模式：与 FlyManager.getControlPoint 对齐的自动弧线 / 自定义双控制点 */
export type AimCurveMode = 'auto_fly' | 'cubic_explicit';

/** configure 可选参数（external 流程注入） */
export interface AimTrajectoryConfigureOptions {
    pathRoot?: Node;
    markPrefab?: Prefab | null;
    /** 采样段数 N（固定，不在运行中修改）；首次初始化时生成 N+1 个标识节点 */
    segmentCount?: number;
    curveIsD3?: boolean;
    flyType?: number;
    radius?: number;
}

/**
 * 仅负责「锚点 Anchor → 目标 Target」在世界空间三次贝塞尔上的采样与 pathLine 节点布置。
 * 不处理虚拟摇杆(Joystick)、角色移动或钓鱼业务状态机。
 */
@ccclass('AimTrajectoryView')
export class AimTrajectoryView extends Component {
    @property({ type: Node, displayName: '轨迹点父节点' })
    pathRoot: Node = null!;

    @property({ type: Prefab, displayName: '轨迹点预制体' })
    markPrefab: Prefab | null = null;

    @property({ displayName: '采样段数' })
    segmentCount: number = 15;

    /** 调用 FlyManager.getControlPoint 时使用 3D 还是 2D/UI 分支 */
    curveIsD3: boolean = true;

    /** auto_fly 模式下的 FlyManager 曲线类型 flyType */
    flyTypeForAuto: number = 0;

    /** auto_fly 模式下的弧线强度半径 */
    radiusForAuto: number = 1;

    private _mode: AimCurveMode = 'auto_fly';
    private readonly _anchorWorld = new Vec3();
    private readonly _targetWorld = new Vec3();
    private readonly _explicitC1 = new Vec3();
    private readonly _explicitC2 = new Vec3();
    /** 供 getControlPoint 使用的起终点副本，避免组件内部修改外部 Node 世界坐标 */
    private readonly _startArg = new Vec3();
    private readonly _endArg = new Vec3();
    private readonly _samplePos = new Vec3();
    private _pathNodes: Node[] = [];
    /** 是否已按当前 segmentCount 生成完全部标识节点（只生成一次，后续 refresh 只改坐标） */
    private _markersCreated: boolean = false;

    protected onLoad(): void {
        this._tryCreateMarkersOnce();
    }

    /**
     * 合并配置（可在流程进入瞄准时反复调用；轨迹点仅在首次 pathRoot+markPrefab 就绪时创建一次）
     */
    public configure(options: AimTrajectoryConfigureOptions = {}): void {
        if (options.pathRoot !== undefined) this.pathRoot = options.pathRoot;
        if (options.markPrefab !== undefined) this.markPrefab = options.markPrefab;
        if (options.segmentCount !== undefined) this.segmentCount = Math.max(1, Math.floor(options.segmentCount));
        if (options.curveIsD3 !== undefined) this.curveIsD3 = options.curveIsD3;
        if (options.flyType !== undefined) this.flyTypeForAuto = options.flyType;
        if (options.radius !== undefined) this.radiusForAuto = options.radius;
        this._tryCreateMarkersOnce();
    }

    /** 设置锚点世界坐标（钓竿梢 / 炮口） */
    public setAnchorWorld(world: Vec3): void {
        this._anchorWorld.set(world);
    }

    /** 从节点读取锚点世界坐标 */
    public setAnchorFromNode(node: Node | null): void {
        if (node) node.getWorldPosition(this._anchorWorld);
    }

    /** 设置目标点世界坐标（准心 / 落点） */
    public setTargetWorld(world: Vec3): void {
        this._targetWorld.set(world);
    }

    /** 使用 FlyManager 与飞行物一致的自动控制点 */
    public setCurveAuto(flyType: number, radius: number): void {
        this._mode = 'auto_fly';
        this.flyTypeForAuto = flyType;
        this.radiusForAuto = radius;
    }

    /** 显式双控制点（世界坐标） */
    public setCurveExplicit(control1: Vec3, control2: Vec3): void {
        this._mode = 'cubic_explicit';
        this._explicitC1.set(control1);
        this._explicitC2.set(control2);
    }

    /**
     * 按当前模式计算控制点并更新 pathLine 上各节点世界坐标。
     * 由外部在 update/lateUpdate 中显式调用（便于与角色移动顺序对齐）。
     */
    public refresh(): void {
        const fly = FlyManager.Ins;
        if (!fly || !this.pathRoot) return;

        if (!this._markersCreated) {
            this._tryCreateMarkersOnce();
        }
        if (!this._markersCreated) return;

        const steps = Math.max(1, this.segmentCount);

        this._startArg.set(this._anchorWorld);
        this._endArg.set(this._targetWorld);

        let p0: Vec3;
        let p1: Vec3;
        let p2: Vec3;
        let p3: Vec3;

        if (this._mode === 'cubic_explicit') {
            p0 = this._startArg;
            p1 = this._explicitC1;
            p2 = this._explicitC2;
            p3 = this._endArg;
        } else {
            const pts = fly.getControlPoint(this._startArg, this._endArg, this.flyTypeForAuto, this.radiusForAuto, this.curveIsD3);
            p0 = pts[0];
            p1 = pts[1];
            p2 = pts[2];
            p3 = pts[3];
        }

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const p = fly.calculateBezierPosition(p0, p1, p2, p3, t);
            this._samplePos.set(p);
            const node = this._pathNodes[i];
            if (node) {
                node.setWorldPosition(this._samplePos);
                node.active = true;
            }
        }
    }

    /** 将 indicator 与当前目标世界坐标对齐（可选，减少外部重复代码） */
    public syncIndicator(indicator: Node | null): void {
        if (indicator) indicator.setWorldPosition(this._targetWorld);
    }

    /** 关闭所有轨迹采样点显示 */
    public hidePath(): void {
        for (let j = 0; j < this._pathNodes.length; j++) {
            const n = this._pathNodes[j];
            if (n) n.active = false;
        }
    }

    /**
     * 首次满足 pathRoot + markPrefab 时，按 segmentCount 生成固定数量的标识节点（N+1 个）；之后不再增删。
     */
    private _tryCreateMarkersOnce(): void {
        if (this._markersCreated) return;
        if (!this.pathRoot || !this.markPrefab) return;

        const need = Math.max(1, this.segmentCount) + 1;
        for (let i = 0; i < need; i++) {
            const n = instantiate(this.markPrefab);
            n.setParent(this.pathRoot);
            n.active = false;
            this._pathNodes.push(n);
        }
        this._markersCreated = true;
    }
}
