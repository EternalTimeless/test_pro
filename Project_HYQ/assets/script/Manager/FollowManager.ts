import { _decorator, Component, Node, Vec3, v3 } from 'cc';
import { GameInfo } from '../Common/GameInfo';
import { Hero } from '../Battle/Hero';
import { MoveCtrl } from '../CharacterCtrl/MoveCtrl';

const { ccclass, property } = _decorator;

/** 单个跟随者：队列下标与槽位一一对应 */
interface FollowerEntry {
    follower: Node;
    slotIndex: number;
    /** 扩展区动态空节点；预设区为 null */
    dynamicSlot: Node | null;
}

/**
 * 区域阵列跟随：链头固定为 GameInfo.instance.player。
 * 预设槽位读 Hero.followNodes（不受 col/rowSpacing 影响）；超出部分在 followRoot 下生成空节点。
 */
@ccclass('FollowManager')
export class FollowManager extends Component {
    @property({ displayName: '队列人数上限' })
    maxCount = 99;

    @property({ displayName: '代码生成起始行(0起, 预设2行则填2)' })
    codegenStartRow = 2;

    @property({ displayName: '扩展区每行人数' })
    extendRowCount = 7;

    @property({ displayName: '列间距(仅扩展区)' })
    colSpacing = 0.8;

    @property({ displayName: '行间距(仅扩展区)' })
    rowSpacing = 0.8;

    // @property({ displayName: '与主角距离过大阈值' })
    // distThresholdHero = 2.5;

    @property({ displayName: '与跟随槽位距离过大阈值' })
    distThresholdSlot = 1.8;

    @property({ displayName: '跟随目标刷新间隔(秒)' })
    followUpdateInterval = 0.5;

    private readonly _entries: FollowerEntry[] = [];
    /** followRoot 下代码创建的空节点，remove/onDestroy 时销毁 */
    private readonly _generatedSlots: Node[] = [];

    private _paused = false;
    private _followUpdateTimer = 0;
    private readonly _scratchWp = v3();

    protected onLoad(): void {
        GameInfo.instance.followMgr = this;
    }

    protected onDestroy(): void {
        for (let i = 0; i < this._entries.length; i++) {
            this.stopFollowMove(this._entries[i].follower);
        }
        this._entries.length = 0;
        this.destroyAllGeneratedSlots();
    }

    public get followerNodes(): readonly Node[] {
        return this._entries.map((e) => e.follower);
    }

    public get followerCount(): number {
        return this._entries.length;
    }

    public appendFollowers(nodes: Node[]): boolean {
        const hero = this.getHero();
        if (!hero?.followRoot?.isValid || nodes.length === 0) {
            return false;
        }
        const extras = nodes.filter((n) => n?.isValid && !!n.getComponent(MoveCtrl));
        if (extras.length === 0) {
            return false;
        }
        let added = false;
        for (let i = 0; i < extras.length; i++) {
            if (this._entries.length >= this.maxCount) {
                break;
            }
            const slotIndex = this._entries.length;
            const dynamicSlot = this.tryCreateDynamicSlot(hero, slotIndex);
            if (slotIndex >= this.getPresetCount(hero) && !dynamicSlot) {
                break;
            }
            this._entries.push({
                follower: extras[i],
                slotIndex,
                dynamicSlot,
            });
            added = true;
        }
        return added;
    }

    public removeFollowerAt(followerQueueIndex: number): boolean {
        if (followerQueueIndex < 0 || followerQueueIndex >= this._entries.length) {
            return false;
        }
        const entry = this._entries[followerQueueIndex];
        this.stopFollowMove(entry.follower);
        this.releaseDynamicSlot(entry.dynamicSlot);
        this._entries.splice(followerQueueIndex, 1);
        const hero = this.getHero();
        if (hero) {
            for (let j = followerQueueIndex; j < this._entries.length; j++) {
                this.rebindEntrySlot(hero, this._entries[j], j);
            }
        }
        return true;
    }

    public setPaused(p: boolean): void {
        this._paused = p;
        if (p) {
            this._followUpdateTimer = 0;
            for (let i = 0; i < this._entries.length; i++) {
                this.stopFollowMove(this._entries[i].follower);
            }
        }
    }

    protected update(dt: number): void {
        if (this._paused) {
            return;
        }
        if (GameInfo.instance.Pause || GameInfo.instance.Over || !GameInfo.instance.Begin) {
            return;
        }
        this._followUpdateTimer += dt;
        if (this._followUpdateTimer >= this.followUpdateInterval) {
            this.tickFollowers();
        }
    }

    /** 间隔刷新跟随目标（对齐怪物 trackToTarget 的计时检测） */
    private tickFollowers(): void {
        this._followUpdateTimer = 0;
        // const hero = this.getHero();
        // if (!hero?.isValid || !hero.followRoot?.isValid) {
        //     return;
        // }
        for (let i = 0; i < this._entries.length; i++) {
            const entry = this._entries[i];
            const node = entry.follower;
            if (!node?.isValid) {
                continue;
            }
            const mc = node.getComponent(MoveCtrl);
            if (!mc) {
                continue;
            }
            if (!this.captureSlotWorld(entry, this._scratchWp)) {
                this.stopFollowMove(node);
                continue;
            }
            // 仅依据跟随槽位距离判断，不再使用与主角的距离阈值
            // const distHero = this.xzDist(node.worldPosition, leaderWp);
            // if (distHero <= this.distThresholdHero) {
            //     this.stopFollowMove(node);
            //     continue;
            // }
            const distSlot = this.xzDist(node.worldPosition, this._scratchWp);
            if (distSlot > this.distThresholdSlot) {
                mc.moveToWorldPosition(this._scratchWp);
            } else {
                this.stopFollowMove(node);
            }
        }
    }

    private getHero(): Hero | null {
        const p = GameInfo.instance.player;
        return p?.isValid ? p : null;
    }

    private getPresetCount(hero: Hero): number {
        return hero.followNodes?.length ?? 0;
    }

    /** 行内列下标 → 局部 X（中心左右展开） */
    private colToLocalX(col: number): number {
        if (col <= 0) {
            return 0;
        }
        const sign = col % 2 === 1 ? -1 : 1;
        const mag = Math.ceil(col / 2) * this.colSpacing;
        return sign * mag;
    }

    /** 扩展区槽位局部坐标（不影响预设 followNodes） */
    private calcGeneratedLocalPos(slotIndex: number, presetCount: number): Vec3 {
        const virtual = slotIndex - presetCount;
        const row = this.codegenStartRow + Math.floor(virtual / this.extendRowCount);
        const col = virtual % this.extendRowCount;
        return v3(this.colToLocalX(col), 0, row * this.rowSpacing);
    }

    /** 队列下标变化后重绑槽位（预设/扩展） */
    private rebindEntrySlot(hero: Hero, entry: FollowerEntry, newIndex: number): void {
        this.releaseDynamicSlot(entry.dynamicSlot);
        entry.slotIndex = newIndex;
        entry.dynamicSlot = this.tryCreateDynamicSlot(hero, newIndex);
    }

    private tryCreateDynamicSlot(hero: Hero, slotIndex: number): Node | null {
        const presetCount = this.getPresetCount(hero);
        if (slotIndex < presetCount) {
            return null;
        }
        const root = hero.followRoot;
        if (!root?.isValid) {
            return null;
        }
        const slot = new Node(`FollowSlot_${slotIndex}`);
        slot.setParent(root);
        const pos = this.calcGeneratedLocalPos(slotIndex, presetCount);
        pos.x += Math.random() * 0.4 - 0.2;
        pos.z += Math.random() * 0.4 - 0.2;
        slot.setPosition(pos);
        this._generatedSlots.push(slot);
        return slot;
    }

    private releaseDynamicSlot(slot: Node | null): void {
        if (!slot?.isValid) {
            return;
        }
        const idx = this._generatedSlots.indexOf(slot);
        if (idx >= 0) {
            this._generatedSlots.splice(idx, 1);
        }
        slot.destroy();
    }

    private destroyAllGeneratedSlots(): void {
        for (let i = 0; i < this._generatedSlots.length; i++) {
            const n = this._generatedSlots[i];
            if (n?.isValid) {
                n.destroy();
            }
        }
        this._generatedSlots.length = 0;
    }

    /** 读取槽位世界坐标；预设只读，不修改 localPosition */
    private captureSlotWorld(entry: FollowerEntry, out: Vec3): boolean {
        const hero = this.getHero();
        if (!hero?.followRoot?.isValid) {
            return false;
        }
        const presetCount = this.getPresetCount(hero);
        if (entry.slotIndex < presetCount) {
            const preset = hero.followNodes[entry.slotIndex];
            if (!preset?.isValid) {
                return false;
            }
            out.set(preset.worldPosition);
            return true;
        }
        if (entry.dynamicSlot?.isValid) {
            out.set(entry.dynamicSlot.worldPosition);
            return true;
        }
        return false;
    }

    private xzDist(a: Readonly<Vec3>, b: Readonly<Vec3>): number {
        const dx = a.x - b.x;
        const dz = a.z - b.z;
        return Math.sqrt(dx * dx + dz * dz);
    }

    private stopFollowMove(node: Node | null): void {
        if (!node?.isValid) {
            return;
        }
        node.getComponent(MoveCtrl)?.stopFollow();
    }
}
