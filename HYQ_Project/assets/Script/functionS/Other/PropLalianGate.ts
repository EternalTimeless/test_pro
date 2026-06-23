import { _decorator, CCBoolean, CCFloat, CCInteger, Label, MeshRenderer, Node, Tween, tween, v3, Vec3 } from 'cc';
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

    @property({ type: Node, displayName: '拉链根节点', tooltip: '拖入 lalian_01/lalian_02 的根节点。为空时只使用下面手动拖入的齿条列表。' })
    public lalianRoot: Node = null;

    @property({ type: Node, displayName: '滑块受击节点', tooltip: '拖入 SM_laliantou_02 / SM_laliantou_03。子弹锁定和命中都以它为中心，推进时它会沿 Z 轴移动。' })
    public cube: Node = null;

    @property({ type: Node, displayName: '拉环根节点', tooltip: '挂在滑块上的拉环节点。滑块受击时，这个节点会做小幅摆动。' })
    public pullRingRoot: Node = null;

    @property({ type: Node, displayName: '拉环尾巴节点', tooltip: '拉环尾巴节点。滑块受击时，这个节点会做更明显的摆动。' })
    public pullRingTail: Node = null;

    @property({ type: [Node], displayName: '拉链齿条列表', tooltip: '拖入需要参与推进的 SM_lalian-xxx 节点。列表为空且开启自动收集时，会从拉链根节点下自动收集 SM_lalian-xxx。' })
    public teethNodes: Node[] = [];

    @property({ type: CCBoolean, displayName: '自动收集齿条', tooltip: '齿条列表为空时，从拉链根节点的直接子节点中自动收集名字以 SM_lalian 开头的节点；不会生成新节点。' })
    public autoCollectTeeth: boolean = true;

    @property({ type: CCBoolean, displayName: '按Z轴排序齿条', tooltip: '开启后按齿条本地 Z 轴排序，适合 lalian_01/lalian_02 这种已有齿条资源。关闭则完全使用上方列表顺序。' })
    public sortTeethByZ: boolean = true;

    @property({ type: CCBoolean, displayName: '从Z最大端开始', tooltip: '开启后整条拉链以齿条 Z 最大端作为初始点，滑块和齿条都从这一端开始推进。' })
    public startFromMaxZ: boolean = true;

    @property({ type: CCBoolean, displayName: '从最远端开始(旧)', tooltip: '旧排序方式。只有关闭“从Z最大端开始”时才会生效。' })
    public startFromFarthestSide: boolean = false;

    @property({ type: CCBoolean, displayName: '从滑块端开始(旧)', tooltip: '旧排序方式。只有关闭“从最远端开始”时才会生效。' })
    public startFromSliderSide: boolean = false;

    @property({ type: CCBoolean, displayName: 'Z轴倒序推进', tooltip: '在当前排序结果上再反向一次。若“从Z最大端开始”后现场仍然相反，就勾选这个。' })
    public reverseZOrder: boolean = false;

    @property({ type: Label, displayName: '血量文本', tooltip: '可选。显示剩余需要受击推进的齿条数量。' })
    public hpLabel: Label = null;

    @property({ type: CCInteger, displayName: '使用齿条数量(0=全部)', tooltip: '运行时实际使用多少个齿条。填 0 表示使用齿条列表/自动收集到的全部齿条；不会自动生成缺少的齿条。' })
    public nodeCount: number = 0;

    @property({ type: CCInteger, displayName: '每段受击次数(旧参数)', tooltip: '旧拉链逻辑遗留参数，当前独立拉链不再读取。保留是为了避免旧场景序列化丢字段。' })
    public hitPerNode: number = 2;

    @property({ type: CCInteger, displayName: '每对齿条数量', tooltip: '默认 2，表示每 2 个 SM_lalian 齿条算作一对，一次受击推进一对。' })
    public teethPerPair: number = 2;

    @property({ type: CCInteger, displayName: '初始闭合对数', tooltip: '默认前 2 对齿条完全闭合。' })
    public initialClosedPairCount: number = 2;

    @property({ type: CCFloat, displayName: '下一对初始闭合度', tooltip: '初始闭合对数之后的下一对闭合度。默认 0.5 表示半闭合。' })
    public nextPairInitialProgress: number = 0.5;

    @property({ type: CCFloat, displayName: '再下一对初始闭合度', tooltip: '下一对之后的再下一对闭合度。默认 0.25 表示 1/4 闭合。' })
    public nextNextPairInitialProgress: number = 0.25;

    @property({ type: CCFloat, displayName: '齿条Z间距(兜底)', tooltip: '无法从齿条节点计算长度时，用这个值估算 +1/+99 的起始距离。' })
    public nodeSpacingZ: number = 0.8;

    @property({ type: CCBoolean, displayName: '自动计算收拢中心X', tooltip: '开启后用本次使用齿条的最小/最大 X 计算中线；适合 lalian_01/lalian_02。关闭后使用“手动收拢中心X”。' })
    public autoCloseCenterX: boolean = true;

    @property({ type: CCFloat, displayName: '手动收拢中心X', tooltip: '关闭自动计算时生效。齿条会向这个本地 X 位置靠拢。' })
    public closeCenterX: number = 0;

    @property({ type: CCFloat, displayName: '最终保留半宽X(旧参数)', tooltip: '旧临时拉链参数。当前 lalian_01/lalian_02 默认闭合资源会直接收回到资源默认位置，不再读取这个值。' })
    public closeX: number = 0.1;

    @property({ type: CCFloat, displayName: '开链外扩X', tooltip: '资源默认是闭合状态时，初始化会让齿条沿 X 轴向两侧外扩这个距离，形成打开状态。' })
    public openOffsetX: number = 0.45;

    @property({ type: CCBoolean, displayName: '反向开链方向', tooltip: '开链初始化方向反了就切这个。开启后，齿条沿 X 轴外扩的方向会整体反过来。' })
    public reverseOpenDirection: boolean = false;

    @property({ type: CCFloat, displayName: '道具队列间隔Z', tooltip: '+1/+99 队列与拉链末端之间额外保留的 Z 轴距离。' })
    public propGapZ: number = 1.2;

    @property({ type: CCInteger, displayName: '完成后放出数量', tooltip: '拉链全部完成后，向玩家移动的 +1/+99 道具数量。填 0 表示持续放出，不主动停。' })
    public moveCount: number = 0;

    @property({ type: CCFloat, displayName: '受击动画时长', tooltip: '每次受击后，齿条收拢和滑块移动的动画时间。' })
    public hitAnimTime: number = 0.12;

    @property({ type: CCFloat, displayName: '滑块消失时长', tooltip: '所有齿条完成后，滑块缩小消失动画的持续时间。' })
    public cubeHideTime: number = 0.08;

    @property({ type: CCBoolean, displayName: '保留滑块Z偏移', tooltip: '开启后，初始化时会保留资源里滑块相对起始齿条的 Z 轴偏移。当前默认关闭，滑块直接放到齿条前沿。' })
    public keepSliderZOffset: boolean = false;

    @property({ type: CCFloat, displayName: '手动滑块Z偏移', tooltip: '关闭“保留滑块Z偏移”时生效。滑块移动目标会在齿条 Z 位置基础上额外加这个偏移。' })
    public sliderOffsetZ: number = 0;

    @property({ type: CCBoolean, displayName: '反向滑块移动Z', tooltip: '只反转滑块沿 Z 轴的移动方向，不影响齿条从哪一端闭合。当前默认关闭，滑块跟随 Z 最大端顺序。' })
    public reverseSliderMoveZ: boolean = false;

    @property({ type: CCFloat, displayName: '子弹锁定范围X', tooltip: '玩家进入该拉链左右 X 范围后，子弹才会锁定滑块；玩家在中路时不锁定。' })
    public bulletLockRangeX: number = 2.5;

    @property({ type: CCFloat, displayName: '锁定瞄准缩放', tooltip: '子弹锁定后，实际瞄准点落在滑块可受击范围内的比例。1=完整范围，0.92=略窄一点。' })
    public bulletAimShrink: number = 0.92;

    @property({ type: CCFloat, displayName: '受击区域Z偏移', tooltip: '只调整子弹锁定/碰撞中心，不移动滑块模型。负值通常是往玩家方向提前，正值是往远离玩家方向延后。' })
    public hitAreaOffsetZ: number = -0.18;

    @property({ type: CCBoolean, displayName: '使用滑块模型中心', tooltip: '开启后用滑块模型的渲染包围盒中心作为受击中心，避免滑块节点锚点偏后导致子弹穿过模型后才命中。' })
    public useCubeBoundsHitCenter: boolean = true;

    @property({ type: CCFloat, displayName: '滑块厚度对齐偏移', tooltip: '滑块定位时，用模型包围盒中心再向厚的一侧偏移一点来对齐齿条位置。0=模型中心，0.2=向厚侧偏移 20% 半厚度。' })
    public sliderThickCenterBias: number = 0.2;

    private teeth: Node[] = [];
    private toothStartPos: Vec3[] = [];
    private toothClosedPos: Vec3[] = [];
    private toothIndex: number = 0;
    private pairIndex: number = 0;
    private pairCount: number = 0;
    private cubeStartScale: Vec3 = new Vec3(1, 1, 1);
    private cubeStartPos: Vec3 = new Vec3();
    private hasCubeStartData: boolean = false;
    private pullRingRootStartEuler: Vec3 = new Vec3();
    private pullRingTailStartEuler: Vec3 = new Vec3();
    private hasPullRingStartData: boolean = false;
    private pullRingStageIndex: number = 0;
    private runtimeSliderOffsetZ: number = 0;
    private tempLockAimPos: Vec3 = new Vec3();
    private tempCollisionWorldPos: Vec3 = new Vec3();
    private tempSliderTargetPos: Vec3 = new Vec3();
    private tempWorldPos: Vec3 = new Vec3();
    private tempSliderVisualCenterWorldPos: Vec3 = new Vec3();
    private tempSliderVisualCenterParentPos: Vec3 = new Vec3();
    private cubeMeshRenderers: MeshRenderer[] = [];
    private originalToothPositions: Map<Node, Vec3> = new Map();
    private closeCenter: number = 0;
    private animating: boolean = false;
    private finished: boolean = false;
    private registered: boolean = false;
    private readonly pullRingRootYStages: number[] = [0, 8, -6, 4];
    private readonly pullRingTailYStages: number[] = [4, 28, 42, 18];
    private readonly pullRingStageTime: number = 0.055;

    public get hitNode() {
        return this.cube ?? super.hitNode;
    }

    public getCollisionWorldPosition(out: Vec3 = this.tempCollisionWorldPos): Vec3 {
        const hitNode = this.hitNode;
        const center = hitNode?.worldPosition ?? this.node.worldPosition;
        if (this.useCubeBoundsHitCenter && this.setCubeBoundsCenter(out)) {
            out.z += this.hitAreaOffsetZ;
            return out;
        }
        return out.set(center.x, center.y, center.z + this.hitAreaOffsetZ);
    }

    public getPropStartZ(): number {
        const count = this.nodeCount > 0 ? this.nodeCount : this.getAuthoredSegmentCount();
        if (this.teeth.length > 0 || this.teethNodes.length > 0 || this.lalianRoot) {
            const authoredTeeth = this.teeth.length > 0 ? this.teeth : this.collectTeeth();
            let minZ = Number.POSITIVE_INFINITY;
            let maxZ = Number.NEGATIVE_INFINITY;
            for (let i = 0; i < authoredTeeth.length && (this.nodeCount <= 0 || i < this.nodeCount); i++) {
                const tooth = authoredTeeth[i];
                if (!tooth) {
                    continue;
                }
                minZ = Math.min(minZ, tooth.position.z);
                maxZ = Math.max(maxZ, tooth.position.z);
            }
            if (minZ < Number.POSITIVE_INFINITY && maxZ > Number.NEGATIVE_INFINITY) {
                return Math.abs(maxZ - minZ) + this.propGapZ;
            }
        }
        return this.propGapZ + Math.max(0, count) * this.nodeSpacingZ;
    }

    public Hit(damage: number): number {
        if (this.animating && !this.finished) {
            return this.MaxHp > 0 ? this.curHp / this.MaxHp : 0;
        }
        return super.Hit(damage);
    }

    public canLockBulletFromWorldX(worldX: number): boolean {
        if (this.finished || !this.cube || !this.cube.active || !this.cube.activeInHierarchy) {
            return false;
        }
        const centerNode = this.lalianRoot ?? this.cube ?? this.node;
        return Math.abs(worldX - centerNode.worldPosition.x) <= this.bulletLockRangeX;
    }

    public getLockAimWorldPosition(fromPos: Vec3, out: Vec3 = this.tempLockAimPos): Vec3 {
        const center = this.getCollisionWorldPosition(out);
        const shrink = Math.max(0.1, Math.min(1, this.bulletAimShrink));
        const halfX = Math.max(0.02, this.collisionHalfX * shrink);
        const halfZ = Math.max(0.02, this.collisionHalfZ * shrink);
        const x = Math.min(center.x + halfX, Math.max(center.x - halfX, fromPos.x));
        const z = Math.min(center.z + halfZ, Math.max(center.z - halfZ, fromPos.z));
        return out.set(x, center.y, z);
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
        if (this.teeth.length <= 0 || !this.cube) {
            return;
        }
        this.prepareCollisionSize();

        const initialPairIndex = Math.max(0, Math.min(this.getInitialClosedPairCount(), this.pairCount) - 1);
        const totalHp = Math.max(1, this.pairCount - initialPairIndex - 1);
        this.MaxHp = totalHp;
        this.curHp = totalHp;
        this.isDestroy = false;
        this.finished = false;
        this.animating = false;
        this.updateHpLabel(totalHp);
        this.registerTarget();
    }

    private prepareCollisionSize(): void {
        if (this.collisionHalfX <= 0.24) {
            this.collisionHalfX = 0.45;
        }
        if (this.collisionHalfZ <= 0) {
            this.collisionHalfZ = 0.32;
        }
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
        const animDuration = this.getHitAnimDuration();
        const closePairIndex = this.pairIndex + 1;
        const closeTooth = this.getSliderPairLeadTooth(closePairIndex);
        if (!closeTooth) {
            this.completeGate();
            return;
        }

        this.animating = true;
        AudioManager.inst.playOneShot(SoundEnum.Sound_tire_hit, 0.4, 0.08);
        if (this.hpLabel?.node) {
            TweenTool.scaleShake(this.hpLabel.node);
        }
        this.flashRed();
        this.playPullRingSwing();

        this.applyPairProgress(closePairIndex, 1, true, animDuration);
        this.pairIndex = closePairIndex;
        this.toothIndex = this.getPairStartToothIndex(this.pairIndex);

        const previewPairIndex = this.pairIndex + 1;
        if (this.getPairLeadTooth(previewPairIndex)) {
            this.applyPairProgress(previewPairIndex, this.getClampedProgress(this.nextPairInitialProgress), true, animDuration);
        }
        const nextPreviewPairIndex = this.pairIndex + 2;
        if (this.getPairLeadTooth(nextPreviewPairIndex)) {
            this.applyPairProgress(nextPreviewPairIndex, this.getClampedProgress(this.nextNextPairInitialProgress), true, animDuration);
        }

        const remainHits = this.getRemainToothCount();
        this.curHp = Math.max(1, remainHits);
        this.updateHpLabel(remainHits);

        if (this.cube) {
            Tween.stopAllByTarget(this.cube);
            tween(this.cube)
                .to(animDuration, { position: this.getSliderTargetPos(closeTooth) }, { easing: 'sineOut' })
                .call(() => {
                    this.finishHitStep();
                })
                .start();
        } else {
            this.scheduleOnce(() => {
                this.finishHitStep();
            }, animDuration);
        }
    }

    private finishHitStep(): void {
        this.animating = false;
        if (this.pairIndex >= this.pairCount - 1) {
            this.completeGate();
        }
    }

    private completeGate(): void {
        if (this.finished) {
            return;
        }
        this.finished = true;
        this.animating = false;
        this.curHp = 1;
        this.isDestroy = true;
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
        this.teeth.length = 0;
        this.toothStartPos.length = 0;
        this.toothClosedPos.length = 0;
        this.toothIndex = 0;
        this.pairIndex = 0;
        this.pairCount = 0;
        this.pullRingStageIndex = 0;

        if (!this.cube) {
            return;
        }

        Tween.stopAllByTarget(this.cube);
        this.cacheCubeStartData();
        this.cacheCubeMeshRenderers();
        this.preparePullRingHierarchy();
        this.cachePullRingStartData();
        this.resetPullRing();
        this.cube.active = true;
        this.cube.setPosition(this.cubeStartPos);
        this.cube.setScale(this.cubeStartScale);

        const collectedTeeth = this.collectTeeth();
        const desiredCount = this.nodeCount > 0 ? Math.min(this.nodeCount, collectedTeeth.length) : collectedTeeth.length;
        for (let i = 0; i < collectedTeeth.length; i++) {
            const tooth = collectedTeeth[i];
            if (!tooth) {
                continue;
            }
            tooth.active = i < desiredCount;
            if (i >= desiredCount) {
                continue;
            }
            const originalPos = this.getOriginalToothPosition(tooth);
            Tween.stopAllByTarget(tooth);
            tooth.setPosition(originalPos);
            this.teeth.push(tooth);
            this.toothClosedPos.push(originalPos.clone());
        }

        this.pairCount = this.getPairCount();
        this.closeCenter = this.getCloseCenterX();
        this.applyOpenProgress();
        this.prepareSliderOffset();
        this.applyInitialProgress();
    }

    private collectTeeth(): Node[] {
        const result: Node[] = [];
        if (this.teethNodes.length > 0) {
            for (let i = 0; i < this.teethNodes.length; i++) {
                const tooth = this.teethNodes[i];
                if (tooth && tooth !== this.cube) {
                    result.push(tooth);
                }
            }
        } else if (this.autoCollectTeeth && this.lalianRoot) {
            for (let i = 0; i < this.lalianRoot.children.length; i++) {
                const child = this.lalianRoot.children[i];
                if (!child || child === this.cube) {
                    continue;
                }
                if (child.name.indexOf('SM_lalian') === 0 && child.name.indexOf('SM_laliantou') !== 0) {
                    result.push(child);
                }
            }
        }

        if (this.sortTeethByZ) {
            result.sort((a, b) => a.position.z - b.position.z);
        }
        if (this.startFromMaxZ) {
            result.reverse();
        } else if (this.startFromFarthestSide) {
            this.orderTeethFromFarthestSide(result);
        } else if (this.startFromSliderSide) {
            this.orderTeethFromSliderSide(result);
            if (this.reverseZOrder) {
                result.reverse();
            }
        } else if (this.reverseZOrder) {
            result.reverse();
        }
        return result;
    }

    private orderTeethFromFarthestSide(teeth: Node[]): void {
        if (!this.cube || teeth.length <= 1) {
            return;
        }
        const firstZ = this.getToothZInSliderParent(teeth[0]);
        const lastZ = this.getToothZInSliderParent(teeth[teeth.length - 1]);
        const sliderZ = this.cube.position.z;
        if (Math.abs(sliderZ - lastZ) > Math.abs(sliderZ - firstZ)) {
            teeth.reverse();
        }
    }

    private orderTeethFromSliderSide(teeth: Node[]): void {
        if (!this.cube || teeth.length <= 1) {
            return;
        }
        const firstZ = this.getToothZInSliderParent(teeth[0]);
        const lastZ = this.getToothZInSliderParent(teeth[teeth.length - 1]);
        const sliderZ = this.cube.position.z;
        if (Math.abs(sliderZ - lastZ) < Math.abs(sliderZ - firstZ)) {
            teeth.reverse();
        }
    }

    private getToothZInSliderParent(tooth: Node): number {
        if (!this.cube || tooth.parent === this.cube.parent) {
            return tooth.position.z;
        }
        this.tempWorldPos.set(tooth.worldPosition);
        if (this.cube.parent) {
            this.cube.parent.inverseTransformPoint(this.tempSliderTargetPos, this.tempWorldPos);
            return this.tempSliderTargetPos.z;
        }
        return tooth.position.z;
    }

    private getAuthoredSegmentCount(): number {
        return this.collectTeeth().length;
    }

    private applyInitialProgress(): void {
        const closedPairCount = Math.min(this.getInitialClosedPairCount(), this.pairCount);
        for (let i = 0; i < closedPairCount; i++) {
            this.applyPairProgress(i, 1, false);
        }

        const halfPairIndex = closedPairCount;
        if (this.getPairLeadTooth(halfPairIndex)) {
            this.applyPairProgress(halfPairIndex, this.getClampedProgress(this.nextPairInitialProgress), false);
        }

        const quarterPairIndex = closedPairCount + 1;
        if (this.getPairLeadTooth(quarterPairIndex)) {
            this.applyPairProgress(quarterPairIndex, this.getClampedProgress(this.nextNextPairInitialProgress), false);
        }

        this.pairIndex = Math.max(0, closedPairCount - 1);
        this.toothIndex = this.getPairStartToothIndex(this.pairIndex);
        const sliderTooth = this.getSliderPairLeadTooth(this.pairIndex) ?? this.teeth[0];
        if (this.cube && sliderTooth) {
            this.cube.setPosition(this.getSliderTargetPos(sliderTooth));
        }
    }

    private cacheCubeStartData(): void {
        if (this.hasCubeStartData) {
            return;
        }
        this.cubeStartPos.set(this.cube.position);
        this.cubeStartScale.set(this.cube.scale);
        this.hasCubeStartData = true;
    }

    private cacheCubeMeshRenderers(): void {
        this.cubeMeshRenderers.length = 0;
        if (!this.cube) {
            return;
        }
        this.collectMeshRenderers(this.cube, this.cubeMeshRenderers);
    }

    private collectMeshRenderers(node: Node, out: MeshRenderer[]): void {
        const meshRenderer = node.getComponent(MeshRenderer);
        if (meshRenderer) {
            out.push(meshRenderer);
        }
        for (let i = 0; i < node.children.length; i++) {
            this.collectMeshRenderers(node.children[i], out);
        }
    }

    private setCubeBoundsCenter(out: Vec3): boolean {
        return this.setCubeVisualCenter(out, false);
    }

    private setCubeVisualCenter(out: Vec3, useThickBias: boolean = true): boolean {
        let minX = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;
        let minZ = Number.POSITIVE_INFINITY;
        let maxZ = Number.NEGATIVE_INFINITY;
        let found = false;

        for (let i = 0; i < this.cubeMeshRenderers.length; i++) {
            const worldBounds = (this.cubeMeshRenderers[i] as any)?.model?.worldBounds;
            const center = worldBounds?.center;
            const halfExtents = worldBounds?.halfExtents;
            if (!center || !halfExtents) {
                continue;
            }
            minX = Math.min(minX, center.x - halfExtents.x);
            maxX = Math.max(maxX, center.x + halfExtents.x);
            minY = Math.min(minY, center.y - halfExtents.y);
            maxY = Math.max(maxY, center.y + halfExtents.y);
            minZ = Math.min(minZ, center.z - halfExtents.z);
            maxZ = Math.max(maxZ, center.z + halfExtents.z);
            found = true;
        }

        if (!found) {
            return false;
        }
        const halfZ = (maxZ - minZ) * 0.5;
        let centerZ = (minZ + maxZ) * 0.5;
        if (useThickBias && this.cube) {
            const anchorZ = this.cube.worldPosition.z;
            const biasDirection = centerZ >= anchorZ ? 1 : -1;
            const bias = Math.max(-1, Math.min(1, this.sliderThickCenterBias));
            centerZ += halfZ * bias * biasDirection;
        }
        out.set(
            (minX + maxX) * 0.5,
            (minY + maxY) * 0.5,
            centerZ,
        );
        return true;
    }

    private preparePullRingHierarchy(): void {
        if (!this.pullRingRoot) {
            return;
        }
        if (this.cube && !this.isNodeUnderParent(this.pullRingRoot, this.cube) && !this.isNodeUnderParent(this.cube, this.pullRingRoot)) {
            this.pullRingRoot.setParent(this.cube, true);
        }
        if (this.pullRingTail && !this.isNodeUnderParent(this.pullRingTail, this.pullRingRoot)) {
            this.pullRingTail.setParent(this.pullRingRoot, true);
        }
    }

    private isNodeUnderParent(node: Node, parent: Node): boolean {
        let cur = node.parent;
        while (cur) {
            if (cur === parent) {
                return true;
            }
            cur = cur.parent;
        }
        return false;
    }

    private cachePullRingStartData(): void {
        if (this.hasPullRingStartData) {
            return;
        }
        if (this.pullRingRoot) {
            this.pullRingRootStartEuler.set(this.pullRingRoot.eulerAngles);
        }
        if (this.pullRingTail) {
            this.pullRingTailStartEuler.set(this.pullRingTail.eulerAngles);
        }
        this.hasPullRingStartData = true;
    }

    private resetPullRing(): void {
        if (this.pullRingRoot) {
            Tween.stopAllByTarget(this.pullRingRoot);
            this.pullRingRoot.eulerAngles = this.getPullRingRootStageEuler(0);
        }
        if (this.pullRingTail) {
            Tween.stopAllByTarget(this.pullRingTail);
            this.pullRingTail.eulerAngles = this.getPullRingTailStageEuler(0);
        }
    }

    private playPullRingSwing(): void {
        this.cachePullRingStartData();
        if (!this.pullRingRoot) {
            return;
        }

        const firstStage = this.getNextPullRingStageIndex(1);
        const secondStage = this.getNextPullRingStageIndex(2);
        Tween.stopAllByTarget(this.pullRingRoot);
        tween(this.pullRingRoot)
            .to(this.pullRingStageTime, { eulerAngles: this.getPullRingRootStageEuler(firstStage) }, { easing: 'sineOut' })
            .to(this.pullRingStageTime, { eulerAngles: this.getPullRingRootStageEuler(secondStage) }, { easing: 'sineOut' })
            .start();

        this.playPullRingTailJoint(firstStage, secondStage);
        this.pullRingStageIndex = secondStage;
    }

    private playPullRingTailJoint(firstStage: number, secondStage: number): void {
        if (!this.pullRingRoot || !this.pullRingTail || !this.isNodeUnderParent(this.pullRingTail, this.pullRingRoot)) {
            return;
        }
        Tween.stopAllByTarget(this.pullRingTail);
        tween(this.pullRingTail)
            .to(this.pullRingStageTime, { eulerAngles: this.getPullRingTailStageEuler(firstStage) }, { easing: 'sineOut' })
            .to(this.pullRingStageTime, { eulerAngles: this.getPullRingTailStageEuler(secondStage) }, { easing: 'sineOut' })
            .start();
    }

    private getNextPullRingStageIndex(offset: number): number {
        return (this.pullRingStageIndex + offset) % this.pullRingRootYStages.length;
    }

    private getPullRingRootStageEuler(stageIndex: number): Vec3 {
        const y = this.pullRingRootYStages[stageIndex] ?? 0;
        return v3(this.pullRingRootStartEuler.x, this.pullRingRootStartEuler.y + y, this.pullRingRootStartEuler.z);
    }

    private getPullRingTailStageEuler(stageIndex: number): Vec3 {
        const y = this.pullRingTailYStages[stageIndex] ?? 4;
        return v3(this.pullRingTailStartEuler.x, this.pullRingTailStartEuler.y + y, this.pullRingTailStartEuler.z);
    }

    private prepareSliderOffset(): void {
        this.runtimeSliderOffsetZ = this.sliderOffsetZ;
        if (this.startFromMaxZ) {
            return;
        }
        const offsetBaseTooth = this.getSliderPairLeadTooth(Math.max(0, Math.min(this.getInitialClosedPairCount(), this.pairCount) - 1)) ?? this.teeth[0];
        if (!this.keepSliderZOffset || !this.cube || !offsetBaseTooth) {
            return;
        }
        const firstTarget = this.getSliderTargetPos(offsetBaseTooth, false);
        this.runtimeSliderOffsetZ = this.cubeStartPos.z - firstTarget.z;
    }

    private applyOpenProgress(): void {
        this.toothStartPos.length = 0;
        for (let i = 0; i < this.teeth.length; i++) {
            const tooth = this.teeth[i];
            const closedPos = this.toothClosedPos[i];
            if (!tooth || !closedPos) {
                continue;
            }
            const openedPos = this.getOpenedToothPosition(closedPos);
            tooth.setPosition(openedPos);
            this.toothStartPos.push(openedPos);
        }
    }

    private getOriginalToothPosition(tooth: Node): Vec3 {
        let originalPos = this.originalToothPositions.get(tooth);
        if (!originalPos) {
            originalPos = tooth.position.clone();
            this.originalToothPositions.set(tooth, originalPos);
        }
        return originalPos;
    }

    private applyToothProgress(toothIndex: number, progress: number, useTween: boolean, duration: number = this.getHitAnimDuration()): void {
        const tooth = this.teeth[toothIndex];
        const startPos = this.toothStartPos[toothIndex];
        const closedPos = this.toothClosedPos[toothIndex];
        if (!tooth || !startPos || !closedPos) {
            return;
        }

        const targetPos = v3(
            startPos.x + (closedPos.x - startPos.x) * progress,
            startPos.y + (closedPos.y - startPos.y) * progress,
            startPos.z + (closedPos.z - startPos.z) * progress,
        );
        Tween.stopAllByTarget(tooth);
        if (useTween) {
            tween(tooth)
                .to(duration, { position: targetPos }, { easing: 'sineOut' })
                .start();
        } else {
            tooth.setPosition(targetPos);
        }
    }

    private applyPairProgress(pairIndex: number, progress: number, useTween: boolean, duration: number = this.getHitAnimDuration()): void {
        const startIndex = this.getPairStartToothIndex(pairIndex);
        const perPair = this.getTeethPerPair();
        for (let i = 0; i < perPair; i++) {
            const toothIndex = startIndex + i;
            if (!this.teeth[toothIndex]) {
                continue;
            }
            this.applyToothProgress(toothIndex, progress, useTween, duration);
        }
    }

    private getPairLeadTooth(pairIndex: number): Node | null {
        return this.teeth[this.getPairStartToothIndex(pairIndex)] ?? null;
    }

    private getSliderPairLeadTooth(pairIndex: number): Node | null {
        const targetPairIndex = !this.startFromMaxZ && this.reverseSliderMoveZ ? this.pairCount - 1 - pairIndex : pairIndex;
        return this.getPairLeadTooth(Math.max(0, targetPairIndex));
    }

    private getPairStartToothIndex(pairIndex: number): number {
        return Math.max(0, pairIndex) * this.getTeethPerPair();
    }

    private getPairCount(): number {
        return Math.ceil(this.teeth.length / this.getTeethPerPair());
    }

    private getTeethPerPair(): number {
        return Math.max(1, Math.floor(this.teethPerPair));
    }

    private getInitialClosedPairCount(): number {
        return Math.max(0, Math.floor(this.initialClosedPairCount));
    }

    private getClampedProgress(progress: number): number {
        return Math.max(0, Math.min(1, progress));
    }

    private getOpenedToothPosition(closedPos: Vec3): Vec3 {
        const delta = closedPos.x - this.closeCenter;
        let sign = delta >= 0 ? 1 : -1;
        if (!this.startFromMaxZ && this.reverseOpenDirection) {
            sign *= -1;
        }
        return v3(closedPos.x + sign * Math.max(0, this.openOffsetX), closedPos.y, closedPos.z);
    }

    private getCloseCenterX(): number {
        if (!this.autoCloseCenterX || this.teeth.length <= 0) {
            return this.closeCenterX;
        }
        let minX = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < this.toothClosedPos.length; i++) {
            const pos = this.toothClosedPos[i];
            if (!pos) {
                continue;
            }
            minX = Math.min(minX, pos.x);
            maxX = Math.max(maxX, pos.x);
        }
        if (minX === Number.POSITIVE_INFINITY || maxX === Number.NEGATIVE_INFINITY) {
            return this.closeCenterX;
        }
        return (minX + maxX) * 0.5;
    }

    private getSliderTargetPos(tooth: Node, useRuntimeOffset: boolean = true): Vec3 {
        const cubePos = this.hasCubeStartData ? this.cubeStartPos : this.cube.position;
        const offsetZ = useRuntimeOffset ? this.runtimeSliderOffsetZ : 0;
        const anchorOffsetZ = this.getSliderVisualAnchorOffsetZ();
        if (tooth.parent === this.cube.parent) {
            return this.tempSliderTargetPos.set(cubePos.x, cubePos.y, tooth.position.z + offsetZ - anchorOffsetZ);
        }

        this.tempWorldPos.set(tooth.worldPosition);
        if (this.cube.parent) {
            this.cube.parent.inverseTransformPoint(this.tempSliderTargetPos, this.tempWorldPos);
            this.tempSliderTargetPos.x = cubePos.x;
            this.tempSliderTargetPos.y = cubePos.y;
            this.tempSliderTargetPos.z += offsetZ - anchorOffsetZ;
            return this.tempSliderTargetPos;
        }
        return this.tempSliderTargetPos.set(cubePos.x, cubePos.y, tooth.position.z + offsetZ - anchorOffsetZ);
    }

    private getSliderVisualAnchorOffsetZ(): number {
        if (!this.cube || this.cubeMeshRenderers.length <= 0) {
            return 0;
        }
        if (!this.setCubeVisualCenter(this.tempSliderVisualCenterWorldPos)) {
            return 0;
        }
        if (this.cube.parent) {
            this.cube.parent.inverseTransformPoint(this.tempSliderVisualCenterParentPos, this.tempSliderVisualCenterWorldPos);
            return this.tempSliderVisualCenterParentPos.z - this.cube.position.z;
        }
        return this.tempSliderVisualCenterWorldPos.z - this.cube.worldPosition.z;
    }

    private getHitAnimDuration(): number {
        return Math.max(0.08, this.hitAnimTime);
    }

    private getRemainToothCount(): number {
        return Math.max(0, this.pairCount - this.pairIndex - 1);
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
}
