import { _decorator, CCFloat, CCInteger, instantiate, Label, Node, Tween, tween, v3, Vec3 } from 'cc';
import { BattleTarget3D } from '../Battle/BattleTarger/BattleTarget3D';
import BulletMonsterCollisionManager from '../Battle/BulletMonsterCollisionManager';
import ColliderTag, { COLLIDE_TYPE } from '../Battle/CollectBattleTarger/ColliderTag';
import { EventType, SoundEnum } from '../../Base/EnumList';
import EventManager from '../../Base/EventManager';
import AudioManager from '../../Base/AudioManager';
import TweenTool from '../../Tool/TweenTool';

const { ccclass, property } = _decorator;

@ccclass('PropLalianGate')
export class PropLalianGate extends BattleTarget3D {

    @property({ type: Node, displayName: '拉链根节点', tooltip: '拖入 Lalian 根节点；不填时会在当前节点子级里查找名为 Lalian 的节点。' })
    public lalianRoot: Node = null;

    @property({ type: Node, displayName: '受击Cube节点', tooltip: '拖入 Lalian 下的 Cube。子弹会以这个节点作为命中中心，Cube 会随拉链进度向前移动。' })
    public cube: Node = null;

    @property({ type: Label, displayName: '血量显示文本', tooltip: '可选。显示剩余受击次数，不填则不显示。' })
    public hpLabel: Label = null;

    @property({ type: CCInteger, displayName: '拉链段数量', tooltip: '需要生成/使用的拉链段数。填 0 时使用编辑器里已有的 Node 段数。' })
    public nodeCount: number = 0;

    @property({ type: CCInteger, displayName: '每段受击次数(旧参数)', tooltip: '旧拉链逻辑使用。当前前沿推进效果不再读取这个字段。' })
    public hitPerNode: number = 2;

    @property({ type: CCFloat, displayName: '拉链段Z间距', tooltip: '运行时复制 Node 段时，每段之间的 Z 轴间距。也用于计算 +1/+99 的起始位置。' })
    public nodeSpacingZ: number = 0.8;

    @property({ type: CCFloat, displayName: '最终收拢X', tooltip: '每段左右子节点最终靠拢到的 X 绝对值。比如 0.1 表示最终为 -0.1 和 0.1。' })
    public closeX: number = 0.1;

    @property({ type: CCFloat, displayName: '道具队列间隔Z', tooltip: '+1/+99 队列与拉链末端之间的额外 Z 轴距离。觉得牌子离拉链太近/太远就调这个。' })
    public propGapZ: number = 1.2;

    @property({ type: CCInteger, displayName: '完成后放出数量', tooltip: '拉链全部完成后，向玩家移动的 +1/+99 道具数量。填 0 表示持续放出，不主动停。' })
    public moveCount: number = 0;

    @property({ type: CCFloat, displayName: '受击动画时长', tooltip: '每次受击后，当前段靠拢动画的持续时间。' })
    public hitAnimTime: number = 0.12;

    @property({ type: CCFloat, displayName: 'Cube消失时长', tooltip: '所有拉链段完成后，Cube 缩小消失动画的持续时间。' })
    public cubeHideTime: number = 0.08;

    @property({ type: CCFloat, displayName: '子弹锁定范围X', tooltip: '玩家进入该拉链左右 X 范围后，子弹才会锁定 Cube；玩家在中间区域时不锁定。' })
    public bulletLockRangeX: number = 2.5;

    private segments: Node[] = [];
    private segmentChildStartPos: Vec3[][] = [];
    private segmentIndex: number = 0;
    private cubeStartScale: Vec3 = new Vec3(1, 1, 1);
    private animating: boolean = false;
    private finished: boolean = false;
    private registered: boolean = false;

    public get hitNode() {
        return this.cube ?? super.hitNode;
    }

    public getPropStartZ(): number {
        const count = this.nodeCount > 0 ? this.nodeCount : this.getAuthoredSegmentCount();
        return this.propGapZ + Math.max(0, count) * this.nodeSpacingZ;
    }

    public canLockBulletFromWorldX(worldX: number): boolean {
        if (this.finished || !this.cube || !this.cube.active || !this.cube.activeInHierarchy) {
            return false;
        }
        const centerNode = this.lalianRoot ?? this.cube ?? this.node;
        return Math.abs(worldX - centerNode.worldPosition.x) <= this.bulletLockRangeX;
    }

    protected start(): void {
        this.initGate();
    }

    protected onDestroy(): void {
        this.unregisterTarget();
    }

    protected _update(dt: number): void {
    }

    public initGate(): void {
        this.setupColliderTag();
        this.prepareLalian();
        if (this.segments.length <= 0 || !this.cube) {
            return;
        }

        const totalHp = Math.max(1, this.segments.length - 1);
        this.MaxHp = totalHp;
        this.curHp = totalHp;
        this.isDestroy = false;
        this.finished = false;
        this.animating = false;
        this.updateHpLabel(totalHp);
        this.registerTarget();
    }

    protected damage(power: number): void {
        if (this.animating || this.finished) {
            this.curHp = Math.max(1, this.curHp);
            return;
        }
        this.playHitStep();
    }

    protected die(): void {
    }

    public repelBattleTarget(target: Node, reoel: number): void {
    }

    private playHitStep(): void {
        const closeSegmentIndex = this.segmentIndex + 1;
        const closeSegment = this.segments[closeSegmentIndex];
        if (!closeSegment) {
            this.completeGate();
            return;
        }

        this.animating = true;
        AudioManager.inst.playOneShot(SoundEnum.Sound_tire_hit, 0.4, 0.08);
        if (this.hpLabel?.node) {
            TweenTool.scaleShake(this.hpLabel.node);
        }
        this.flashRed();

        this.applySegmentProgress(closeSegment, closeSegmentIndex, 1, true);
        this.segmentIndex = closeSegmentIndex;

        const previewSegmentIndex = this.segmentIndex + 1;
        const previewSegment = this.segments[previewSegmentIndex];
        if (previewSegment) {
            this.applySegmentProgress(previewSegment, previewSegmentIndex, 0.5, true);
        }

        const remainHits = this.getRemainSegmentCount();
        this.curHp = Math.max(1, remainHits);
        this.updateHpLabel(remainHits);

        if (this.cube) {
            const cubePos = this.cube.position;
            Tween.stopAllByTarget(this.cube);
            tween(this.cube)
                .to(this.hitAnimTime, { position: v3(cubePos.x, cubePos.y, closeSegment.position.z) }, { easing: 'cubicOut' })
                .start();
        }

        this.scheduleOnce(() => {
            this.animating = false;
            if (this.segmentIndex >= this.segments.length - 1) {
                this.completeGate();
            }
        }, this.hitAnimTime);
    }

    private completeGate(): void {
        if (this.finished) {
            return;
        }
        this.finished = true;
        this.animating = false;
        this.curHp = 1;
        this.unregisterTarget();
        this.updateHpLabel(0);

        const emitFinish = () => {
            const info = { moveCount: this.moveCount };
            EventManager.instance.emit(EventType.PROP_ARMS_DIE, info);
            this.node.emit(EventType.PROP_ARMS_DIE, info);
        };

        if (!this.cube) {
            emitFinish();
            return;
        }

        Tween.stopAllByTarget(this.cube);
        tween(this.cube)
            .to(this.cubeHideTime, { scale: Vec3.ZERO }, { easing: 'sineIn' })
            .call(() => {
                this.cube.active = false;
                this.cube.setScale(this.cubeStartScale);
                emitFinish();
            })
            .start();
    }

    private prepareLalian(): void {
        this.lalianRoot = this.lalianRoot ?? this.findNodeByName(this.node, 'Lalian');
        this.cube = this.cube ?? this.findNodeByName(this.lalianRoot, 'Cube');
        this.segments.length = 0;
        this.segmentChildStartPos.length = 0;
        this.segmentIndex = 0;

        if (!this.lalianRoot || !this.cube) {
            return;
        }

        this.cube.active = true;
        this.cubeStartScale.set(this.cube.scale);
        this.cube.setScale(this.cubeStartScale);

        const segmentNodes: Node[] = [];
        for (let i = 0; i < this.lalianRoot.children.length; i++) {
            const child = this.lalianRoot.children[i];
            if (!child || child === this.cube || child.name === 'Cube' || child.children.length <= 0) {
                continue;
            }
            segmentNodes.push(child);
        }

        const desiredCount = this.nodeCount > 0 ? this.nodeCount : segmentNodes.length;
        if (desiredCount > segmentNodes.length && segmentNodes.length > 0) {
            const template = segmentNodes[0];
            const basePos = template.position;
            for (let i = segmentNodes.length; i < desiredCount; i++) {
                const node = instantiate(template);
                node.name = `${template.name}_${i}`;
                this.lalianRoot.addChild(node);
                node.setPosition(basePos.x, basePos.y, basePos.z + this.nodeSpacingZ * i);
                segmentNodes.push(node);
            }
        }

        for (let i = 0; i < segmentNodes.length; i++) {
            segmentNodes[i].active = i < desiredCount;
        }

        for (let i = 0; i < desiredCount && i < segmentNodes.length; i++) {
            const segment = segmentNodes[i];
            this.segments.push(segment);
            const startPosList: Vec3[] = [];
            for (let j = 0; j < segment.children.length; j++) {
                const part = segment.children[j];
                const startPos = part.position.clone();
                startPosList.push(startPos);
                Tween.stopAllByTarget(part);
                part.setPosition(startPos);
            }
            this.segmentChildStartPos.push(startPosList);
        }
        this.applyInitialProgress();
    }

    private getAuthoredSegmentCount(): number {
        const root = this.lalianRoot ?? this.findNodeByName(this.node, 'Lalian');
        const cube = this.cube ?? this.findNodeByName(root, 'Cube');
        if (!root) {
            return 0;
        }
        let count = 0;
        for (let i = 0; i < root.children.length; i++) {
            const child = root.children[i];
            if (child && child !== cube && child.name !== 'Cube' && child.children.length > 0) {
                count++;
            }
        }
        return count;
    }

    private applyInitialProgress(): void {
        if (this.segments[0]) {
            this.applySegmentProgress(this.segments[0], 0, 1, false);
        }
        if (this.segments[1]) {
            this.applySegmentProgress(this.segments[1], 1, 0.5, false);
        }
        if (this.cube && this.segments[0]) {
            const cubePos = this.cube.position;
            this.cube.setPosition(cubePos.x, cubePos.y, this.segments[0].position.z);
        }
    }

    private applySegmentProgress(segment: Node, segmentIndex: number, progress: number, useTween: boolean): void {
        const startPosList = this.segmentChildStartPos[segmentIndex];
        if (!segment || !startPosList) {
            return;
        }

        for (let i = 0; i < segment.children.length; i++) {
            const part = segment.children[i];
            const startPos = startPosList[i];
            if (!part || !startPos) {
                continue;
            }
            let targetX = startPos.x;
            if (Math.abs(startPos.x) > this.closeX) {
                const closeX = startPos.x > 0 ? this.closeX : -this.closeX;
                targetX = startPos.x + (closeX - startPos.x) * progress;
            }
            Tween.stopAllByTarget(part);
            const targetPos = v3(targetX, startPos.y, startPos.z);
            if (useTween) {
                tween(part)
                    .to(this.hitAnimTime, { position: targetPos }, { easing: 'cubicOut' })
                    .start();
            } else {
                part.setPosition(targetPos);
            }
        }
    }

    private getRemainSegmentCount(): number {
        return Math.max(0, this.segments.length - this.segmentIndex - 1);
    }

    private updateHpLabel(value: number): void {
        if (this.hpLabel) {
            this.hpLabel.string = value > 0 ? value.toString() : '';
        }
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

    private findNodeByName(root: Node, name: string): Node | null {
        if (!root) {
            return null;
        }
        if (root.name === name) {
            return root;
        }
        for (let i = 0; i < root.children.length; i++) {
            const result = this.findNodeByName(root.children[i], name);
            if (result) {
                return result;
            }
        }
        return null;
    }
}
