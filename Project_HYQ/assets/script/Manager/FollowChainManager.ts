import { _decorator, Component, Node, Vec3, v3 } from 'cc';
import { GameInfo } from '../Common/GameInfo';
import { MoveCtrl } from '../CharacterCtrl/MoveCtrl';

const { ccclass, property } = _decorator;

/**
 * 链头路程打点 + 跟随列表：follower[i] 对齐 _samples[i+1]；尚无足够采样时停止主动移动直至路径信息足够。
 */
@ccclass('FollowChainManager')
export class FollowChainManager extends Component {
    /** 打点间隔路程(世界单位, XZ) */
    private readonly SAMPLE_DISTANCE_XZ = 1;
    /** 最大跟随节数(可与路径槽配置对齐)；实际 _samples 长度为该值 +1，以支持 follower[i]→_samples[i+1] */
    private readonly MAX_PATH_SAMPLES = 99;
    /** 疑似传送检测窗口(秒) */
    private readonly TELEPORT_WINDOW_SEC = 1;
    /** 窗口内链头路程累计超过此值触发全员叠站到链头并清空移动意图 */
    private readonly TELEPORT_DIST_THRESHOLD = 99;

    @property({ type: Node, displayName: '链头节点(可选)' })
    private editorHead: Node | null = null;

    /** true 时不增长路径打点(仍可驱动已有槽位跟随) */
    public disablePathSampling = false;

    private _head: Node | null = null;
    private readonly _followers: Node[] = [];
    private readonly _samples: Vec3[] = [];
    /** 前缀有效采样数量，保证 slot[0 .. filled-1] 有效 */
    private _filledSampleLen = 0;
    private _bound = false;
    private _paused = false;

    private readonly _trailPrevWp = v3();
    private _trailAccumRem = 0;

    private _teleportBucketT = 0;
    private _teleportBucketDist = 0;

    private readonly _scratchWp = v3();
    private readonly _scratchDelta = v3();

    /** _samples 环形槽数量 = MAX_PATH_SAMPLES + 1（末节跟随者读取下标 MAX_PATH_SAMPLES） */
    private get maxSampleBufferLen(): number {
        return this.MAX_PATH_SAMPLES + 1;
    }

    protected onLoad(): void {
        // GameInfo.instance.followMgr = this;
    }

    /** 编辑器链头赋值后在此处登记；若运行时另有 setHead/bindChain，以首次 Node 引用是否变化决定是否清空路径 */
    start(): void {
        if (this.editorHead?.isValid) {
            this.tryBindHeadPreservePathLogic(this.editorHead);
        }
    }

    /** 当前链头 */
    public get chainHead(): Node | null {
        return this._head;
    }

    public get followerNodes(): readonly Node[] {
        return this._followers;
    }

    public get followerCount(): number {
        return this._followers.length;
    }

    /**
     * 登记链头与整表跟随列表(兼容旧 Hero 入口)。链头引用变化时会清空路径并重启路程累计。
     */
    bindChain(head: Node | null, followers: Node[]): void {
        if (!head?.isValid) {
            this.unbind();
            return;
        }
        this.tryBindHeadPreservePathLogic(head);
        this._followers.length = 0;
        const extras = followers.filter((n) => n?.isValid && !!n.getComponent(MoveCtrl));
        this._followers.push(...extras);
    }

    /**
     * null：清空路径、停止跟随移动；链头与队列的外部增删交由其它逻辑。
     * 有效节点：写入链头，若引用变更则重置路径采样数据。
     */
    setHead(newHead: Node | null): void {
        if (!newHead?.isValid) {
            this.clearHeadStoppingFollowersOnly();
            return;
        }
        this.tryBindHeadPreservePathLogic(newHead);
    }

    appendFollowers(nodes: Node[]): boolean {
        if (!this._head?.isValid || nodes.length === 0) {
            return false;
        }
        const extra = nodes.filter((n) => !!n?.isValid && !!n.getComponent(MoveCtrl));
        if (extra.length === 0) {
            return false;
        }
        const startIdx = this._followers.length;
        this._followers.push(...extra);
        for (let i = startIdx; i < this._followers.length; i++) {
            this.bootstrapFollowerMoveOnce(i);
        }
        return true;
    }

    removeFollowerAt(followerQueueIndex: number): boolean {
        if (!this._bound || !this._head?.isValid || followerQueueIndex < 0 || followerQueueIndex >= this._followers.length) {
            return false;
        }
        this._followers.splice(followerQueueIndex, 1);
        return true;
    }

    removeChainHead(): void {}

    setPaused(p: boolean): void {
        this._paused = p;
        if (p) {
            for (let i = 0; i < this._followers.length; i++) {
                this.stopFollowMove(this._followers[i]);
            }
        }
    }

    unbind(): void {
        this.clearPathData();
        for (let i = 0; i < this._followers.length; i++) {
            this.stopFollowMove(this._followers[i]);
        }
        this._followers.length = 0;
        this._head = null;
        this._bound = false;
    }

    protected onDestroy(): void {
        this.unbind();
    }

    protected lateUpdate(dt: number): void {
        if (!this._bound || this._paused || !this._head?.isValid) {
            return;
        }
        if (GameInfo.instance.Pause || GameInfo.instance.Over || !GameInfo.instance.Begin) {
            return;
        }
        const headWp = this._head.worldPosition;
        if (this.updateTeleportSuspect(dt, headWp)) {
            return;
        }

        this.accumulatePathSamples(headWp);

        for (let fi = 0; fi < this._followers.length; fi++) {
            const node = this._followers[fi];
            if (!node?.isValid) {
                continue;
            }
            const mc = node.getComponent(MoveCtrl);
            if (!mc) {
                continue;
            }
            if (!this.tryGetMisalignedFollowTarget(fi, this._scratchWp)) {
                mc.stopActiveMovement();
                continue;
            }
            mc.moveToWorldPosition(this._scratchWp, mc.baseSpeed);
        }
    }

    /** 清空路径并让已有跟随节点停止主动移动 */
    private clearHeadStoppingFollowersOnly(): void {
        this.clearPathData();
        this._teleportBucketT = 0;
        this._teleportBucketDist = 0;
        this._trailAccumRem = 0;
        for (let i = 0; i < this._followers.length; i++) {
            this.stopFollowMove(this._followers[i]);
        }
        this._head = null;
        this._bound = false;
    }

    /** 链头变更时挂载；保持路径的逻辑 */
    private tryBindHeadPreservePathLogic(nextHead: Node): void {
        const refChanged = this._head !== nextHead;
        this._head = nextHead;
        this._bound = true;
        if (refChanged) {
            this.clearPathData();
            this._trailPrevWp.set(nextHead.worldPosition);
            this._trailAccumRem = 0;
            this._teleportBucketT = 0;
            this._teleportBucketDist = 0;
        }
    }

    private clearPathData(): void {
        this._filledSampleLen = 0;
    }

    private ensureSamplesCapacity(): void {
        while (this._samples.length < this.maxSampleBufferLen) {
            this._samples.push(v3());
        }
    }

    private pushFrontSample(wx: Vec3): void {
        this.ensureSamplesCapacity();
        const cap = this.maxSampleBufferLen;
        const prevLen = this._filledSampleLen;
        const hi = Math.min(prevLen, cap - 1);
        for (let i = hi; i >= 1; i--) {
            this._samples[i].set(this._samples[i - 1]);
        }
        this._samples[0].set(wx.x, wx.y, wx.z);
        this._filledSampleLen = Math.min(prevLen + 1, cap);
    }

    /** @returns true 表示本帧已处理极端位移并应立即 return */
    private updateTeleportSuspect(dt: number, headWp: Readonly<Vec3>): boolean {
        const prev = this._trailPrevWp;
        this.xzDeltaMasked(headWp, prev, this._scratchDelta);
        const step = this._scratchDelta.length();
        this._teleportBucketDist += step;
        this._teleportBucketT += dt;
        if (this._teleportBucketT >= this.TELEPORT_WINDOW_SEC) {
            if (this._teleportBucketDist > this.TELEPORT_DIST_THRESHOLD) {
                this.stackAllToHeadWorld(headWp);
                this._trailPrevWp.set(headWp);
                this._trailAccumRem = 0;
                this._teleportBucketT = 0;
                this._teleportBucketDist = 0;
                return true;
            }
            this._teleportBucketT = 0;
            this._teleportBucketDist = 0;
        }
        return false;
    }

    /** 全员叠到链头世界坐标：槽位同源、不写 MoveCtrl（仅站桩） */
    private stackAllToHeadWorld(wp: Vec3): void {
        this.ensureSamplesCapacity();
        const cap = this.maxSampleBufferLen;
        for (let i = 0; i < cap; i++) {
            this._samples[i].set(wp);
        }
        this._filledSampleLen = cap;
        for (let i = 0; i < this._followers.length; i++) {
            const node = this._followers[i];
            if (!node?.isValid) {
                continue;
            }
            node.getComponent(MoveCtrl)?.stopActiveMovement();
            node.setWorldPosition(wp);
        }
    }

    private accumulatePathSamples(headWp: Readonly<Vec3>): void {
        if (this.disablePathSampling) {
            this._trailPrevWp.set(headWp);
            return;
        }
        this.xzDeltaMasked(headWp, this._trailPrevWp, this._scratchDelta);
        const d = this._scratchDelta.length();
        this._trailAccumRem += d;
        this._trailPrevWp.set(headWp);
        while (this._trailAccumRem >= this.SAMPLE_DISTANCE_XZ) {
            this._trailAccumRem -= this.SAMPLE_DISTANCE_XZ;
            this.pushFrontSample(headWp as Vec3);
        }
    }

    private xzDeltaMasked(a: Readonly<Vec3>, b: Readonly<Vec3>, out: Vec3): void {
        out.x = a.x - b.x;
        out.y = 0;
        out.z = a.z - b.z;
    }

    /**
     * follower[followIdx] → _samples[followIdx + 1]（错位一格，避免首节贴链头最新打点）。
     * @returns false 表示尚无该槽有效数据，应保持静止不写 move 目标。
     */
    private tryGetMisalignedFollowTarget(followIdx: number, outWorld: Vec3): boolean {
        const si = followIdx + 1;
        if (si >= 0 && si < this._filledSampleLen) {
            outWorld.set(this._samples[si]);
            return true;
        }
        return false;
    }

    private bootstrapFollowerMoveOnce(followIdx: number): void {
        const node = this._followers[followIdx];
        if (!node?.isValid) {
            return;
        }
        const mc = node.getComponent(MoveCtrl);
        if (!mc || !this._head?.isValid) {
            return;
        }
        if (!this.tryGetMisalignedFollowTarget(followIdx, this._scratchWp)) {
            mc.stopActiveMovement();
            return;
        }
        mc.moveToWorldPosition(this._scratchWp, mc.baseSpeed);
    }

    private stopFollowMove(node: Node | null): void {
        if (!node?.isValid) {
            return;
        }
        node.getComponent(MoveCtrl)?.stopActiveMovement();
    }
}
