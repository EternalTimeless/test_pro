import { _decorator, CCBoolean, CCFloat, CCInteger, Color, Component, instantiate, Label, Material, MeshRenderer, Node, resources, Tween, tween, utils, v3, Vec3 } from 'cc';
import { BattleTarget3D } from '../Battle/BattleTarger/BattleTarget3D';
import BulletMonsterCollisionManager from '../Battle/BulletMonsterCollisionManager';
import PoolManager from '../../Base/PoolManager';
import { ArmsTypeEnum, EventType, OtherPrefabsEnum, PoolEnum, PrefabsEnum, SoundEnum } from '../../Base/EnumList';
import { PrefabsManager } from '../../Base/PrefabsManager';
import TweenTool from '../../Tool/TweenTool';
import EventManager from '../../Base/EventManager';
import { AttackParkPlay } from '../Battle/Battle3D/AttackParkPlay';
import { FlashRedManager } from '../Battle/Base/FlashRedManager';
import { MeshFlashData, MeshFlashSwitchData } from '../Battle/Base/BattleTargetBase';
import AudioManager from '../../Base/AudioManager';
import { count } from 'console';
import { FbxManager } from '../SkAnim/FbxManager';
import { JumpManager } from '../Jump/JumpManager';
import { CameraMove } from '../../Base/CameraMove';
import { MoveDrive } from '../../Base/MoveRot/MoveDrive';
import { MonsterCreate } from '../Monster/MonsterCreate';
const { ccclass, property } = _decorator;

enum AnimArms {
    idle,
    up_ju,
    up_out
}

type OilBurstMaterialRecord = {
    renderer: MeshRenderer;
    originalMaterials: (Material | null)[];
    burstMaterials: (Material | null)[];
};

type OilHitFlashMaterialRecord = {
    renderer: MeshRenderer;
    originalMaterials: (Material | null)[];
    flashMaterials: (Material | null)[];
};

type OilBurstShardFadeMaterialRecord = {
    renderer: MeshRenderer;
    originalMaterials: (Material | null)[];
    runtimeMaterials: (Material | null)[];
};

type WeaponVisualHitPulseState = {
    elapsed: number;
    duration: number;
};


@ccclass('ArmsInfo')
export class ArmsInfo {
    @property({ type: ArmsTypeEnum, displayName: '武器类型', tooltip: '主角吃到该武器后切换到的武器类型，对应 Player.upArms 的 ArmsTypeEnum。' })
    public armsType: ArmsTypeEnum = ArmsTypeEnum.bq;

    @property({ type: FbxManager, displayName: '武器模型动画', tooltip: '拖入武器节点上的 FbxManager。目标死亡后，这个武器节点会飞向主角。' })
    public fbx: FbxManager = null;

    @property({ type: CCInteger, displayName: '底座/滚筒数量', tooltip: '武器下方生成的底座数量。当前临时用轮胎表现，后续可替换为滚筒资源。' })
    public tireCount: number = 3;

    @property({ type: CCInteger, displayName: '血量', tooltip: '该阶段需要承受的攻击次数/伤害量。血量降低时会逐步销毁底座/滚筒。' })
    public hp: number = 3;

    @property({ type: CCInteger, displayName: '完成后放出数量', tooltip: '该武器被打爆后，关联通道放出的 +1/+99 数量。' })
    public moveCount: number = 5;

    @property({ type: CCBoolean, displayName: '是否随底座抬升', tooltip: '勾选时武器会随着底座/滚筒生成逐步抬高；不勾选时使用固定高度。' })
    public isCanMove: boolean = true;

    @property({ type: CCFloat, displayName: '固定武器高度', tooltip: '当“是否随底座抬升”关闭时，武器模型固定在该高度。', visible(this: ArmsInfo) { return !this.isCanMove; } })
    public canHeight: number = 0;

    @property({ type: CCFloat, displayName: '固定保留底座数', tooltip: '当“是否随底座抬升”关闭时，底座/滚筒数量高于该值才会下落调整。', visible(this: ArmsInfo) { return !this.isCanMove; } })
    public canTireCount: number = 0;

    @property({ type: CCFloat, displayName: '石板/承载物高度偏移', tooltip: 'wallNode 相对武器模型的高度偏移，用于让承载物跟随武器上下浮动。' })
    public wallHeight: number = 0.5;

    public runtimeVisualRoot: Node = null;
    public weaponBulletConfigIndex: number = -1;

}


@ccclass('PropArms')
export class PropArms extends BattleTarget3D {

    private static readonly oilBurstMaterialPath: string = "Materials/OilBarrelBurst";
    private static readonly oilHitFlashMaterialPath: string = "Materials/OilBarrelHitFlash";
    private static oilBurstMaterial: Material | null = null;
    private static oilBurstMaterialLoading: boolean = false;
    private static oilHitFlashMaterial: Material | null = null;
    private static oilHitFlashMaterialLoading: boolean = false;
    private static readonly oilBurstDestroyDuration: number = 0.12;
    private static readonly oilBurstDestroyDelayStep: number = 0.05;
    private static readonly oilBurstDestroyScale: number = 1.01;
    private static readonly oilBurstShardCount: number = 8;
    private static readonly oilBurstShardDuration: number = 0.46;
    private static readonly oilHitFlashDuration: number = 0.16;
    private static readonly oilHitFlashColor: Color = new Color(255, 188, 36, 255);
    private static readonly oilHitFlashIntensity: number = 0.5;
    private static readonly weaponPickupVisualName: string = "weapon";
    private static readonly spriteWeaponVisualName: string = "jiatelin";
    private static readonly modelWeaponVisualName: string = "jiateling01";

    public static prepareSpriteWeaponVisual(root: Node): boolean {
        if (!root) {
            return false;
        }

        const spriteNodes: Node[] = [];
        PropArms.collectNodesByName(root, PropArms.spriteWeaponVisualName, spriteNodes);
        if (spriteNodes.length <= 0) {
            return false;
        }

        for (let i = 0; i < spriteNodes.length; i++) {
            const spriteNode = spriteNodes[i];
            spriteNode.active = true;
            spriteNode.layer = root.layer;
        }

        const modelNodes: Node[] = [];
        PropArms.collectNodesByName(root, PropArms.modelWeaponVisualName, modelNodes);
        for (let i = 0; i < modelNodes.length; i++) {
            const modelNode = modelNodes[i];
            if (!PropArms.isAncestorOfAny(modelNode, spriteNodes)) {
                modelNode.active = false;
            }
        }

        return true;
    }

    private static collectNodesByName(root: Node, name: string, out: Node[]): void {
        if (!root) {
            return;
        }
        if (root.name === name) {
            out.push(root);
        }
        for (let i = 0; i < root.children.length; i++) {
            PropArms.collectNodesByName(root.children[i], name, out);
        }
    }

    public static getWeaponPickupVisualRoot(root: Node | null): Node | null {
        if (!root) {
            return null;
        }
        const nodes: Node[] = [];
        PropArms.collectNodesByName(root, PropArms.weaponPickupVisualName, nodes);
        return nodes.length > 0 ? nodes[0] : null;
    }

    private static isAncestorOfAny(node: Node, targets: Node[]): boolean {
        for (let i = 0; i < targets.length; i++) {
            let target: Node | null = targets[i];
            while (target) {
                if (target === node) {
                    return true;
                }
                target = target.parent;
            }
        }
        return false;
    }

    private hasNodeByName(root: Node, name: string): boolean {
        if (!root) {
            return false;
        }
        if (root.name === name) {
            return true;
        }
        for (let i = 0; i < root.children.length; i++) {
            if (this.hasNodeByName(root.children[i], name)) {
                return true;
            }
        }
        return false;
    }

    @property({ type: ArmsInfo, displayName: '武器阶段列表', tooltip: '每一项代表一个武器阶段。受击死亡后会切到下一阶段或触发武器飞向主角。' })
    public armsInfoList: ArmsInfo[] = [];

    @property({ type: Label, displayName: '血量文本', tooltip: '显示当前阶段剩余血量的 Label。' })
    public hpLabel: Label = null;

    private _curArms: ArmsInfo;

    private tireList: Node[] = [];

    private lalianNode: Node = null;
    private lalianCube: Node = null;
    private lalianSegments: Node[] = [];
    private lalianSegmentChildStartPos: Vec3[][] = [];
    private lalianHitIndex: number = 0;
    private lalianSegmentHitStep: number = 0;
    private lalianCubeStartScale: Vec3 = new Vec3(1, 1, 1);
    private lalianAnimating: boolean = false;
    private lalianFinished: boolean = false;
    private hasLalian: boolean = false;

    private _level: number = 0;
    private _curArmsUsesSpriteVisual: boolean = false;
    private _curArmsSpriteTargetY: number = 0;

    private _isShake: boolean = false;

    private _initialTireCount: number = 0;

    /** 非销毁受击的_isShake冷却 */
    private _shakeCooldown: number = 0;

    /** 轮胎弹跳动画数据（销毁时触发，每帧手动计算） */
    private _tireBounceStartY: number[] = [];
    private _tireBounceTargetY: number[] = [];
    private _tireBounceH: number[] = [];
    private _tireBounceTimer: number = -1;

    @property({ type: Vec3, displayName: '底座/滚筒缩放', tooltip: '运行时生成的底座/滚筒资源缩放。当前临时资源是 tire.prefab。' })
    private tireScale: Vec3 = new Vec3();
    // private

    @property({ type: CCFloat, displayName: '底座/滚筒间距', tooltip: '多个底座/滚筒上下叠放时的 Y 轴间距。' })
    private tireSpacing: number = 0.2;

    @property({ type: CCFloat, displayName: '油桶视觉X微调', tooltip: '只微调油桶模型子节点的 X，不移动血量、受击中心和根节点。正值向右，负值向左。' })
    public bottomBaseOffsetX: number = 0;

    @property({ type: CCFloat, displayName: '油桶滚动速度', tooltip: '油桶随前进位移产生的旋转角度倍率，只影响滚动动效，不影响油桶本体移动速度。' })
    public bottomBaseRollDegreesPerUnit: number = 85;

    @property({ type: CCFloat, displayName: '受击弹跳高度', tooltip: '底座/滚筒被打掉后，剩余底座和武器模型的弹跳高度。' })
    public jumpHeight: number = 0.5;

    @property({ type: CCFloat, displayName: '波次前方间距', tooltip: '多阶段武器跟随怪物波次刷新时，出现在最前方怪物前面的距离。' })
    public waveFrontGap: number = 2;

    @property({ type: CCFloat, displayName: '下一阶段延迟', tooltip: '当前阶段死亡后，生成下一阶段武器前等待的时间。' })
    public nextStageDelay: number = 0.2;

    // @property(AttackParkPlay)
    // public effect: AttackParkPlay;
    @property({ type: CCFloat, displayName: '动画速度倍率', tooltip: '受击、底座消失、拉链收拢等动画的速度倍率。数值越大动画越慢。' })
    public animScale: number = 1;

    @property({ type: CCFloat, displayName: '武器图片受击放大倍率', tooltip: '油桶受击时 weapon 图片先放大的倍率。' })
    public weaponHitScaleUp: number = 1.16;

    @property({ type: CCFloat, displayName: '武器图片受击压缩倍率', tooltip: '油桶受击时 weapon 图片回弹压缩的倍率。' })
    public weaponHitScaleDown: number = 0.9;

    @property({ type: Node, displayName: '石板/承载节点', tooltip: '武器下方跟随抬升、死亡后下砸的承载节点。没有该节点时只触发武器完成事件。' })
    public wallNode: Node;

    @property({ type: CCInteger, displayName: 'Lalian节点数量(0=全部)', tooltip: '拉链模式下使用的 Node 数量。填 0 表示使用 Lalian 下已有的全部节点。' })
    public lalianNodeCount: number = 0;

    @property({ type: CCFloat, displayName: 'Lalian节点Z间距', tooltip: '需要自动补足 Lalian 节点时，新节点之间的 Z 轴间距。' })
    public lalianNodeSpacingZ: number = 0.8;

    @property({ type: CCFloat, displayName: 'Lalian收拢X', tooltip: '拉链子节点最终靠拢到中心时保留的 X 轴距离，例如左右最终为 +/-0.1。' })
    public lalianCloseX: number = 0.1;

    @property({ type: CCInteger, displayName: 'Lalian完成移动数量(0=节点数)', tooltip: '拉链全部打完后放出的 +1/+99 数量。填 0 表示使用拉链节点数量。' })
    public lalianMoveCount: number = 0;

    @property({ type: Vec3, displayName: '石板跳跃位置', tooltip: '预留字段：石板/承载节点跳跃时使用的位置参数。当前主要逻辑不依赖它。' })
    public jumpWallPos: Vec3 = new Vec3();

    @property({ type: Node, displayName: '石板落地特效', tooltip: '石板/承载节点死亡下砸落地时播放的特效节点。' })
    public wallEffect: Node;

    private readonly bottomBasePrefab: OtherPrefabsEnum = OtherPrefabsEnum.youtong;
    private readonly bottomBaseScaleMultiplier: number = 3.6;
    private readonly bottomBaseChildScaleMap: Map<Node, Vec3> = new Map();
    private readonly bottomBaseChildPosMap: Map<Node, Vec3> = new Map();
    private readonly bottomBaseChildEulerMap: Map<Node, Vec3> = new Map();
    private readonly bottomBaseTargetPosMap: Map<Node, Vec3> = new Map();
    private readonly weaponVisualScaleMap: Map<Node, Vec3> = new Map();
    private readonly weaponVisualHitPulseStateMap: Map<Node, WeaponVisualHitPulseState> = new Map();
    private readonly manualBottomBaseNodeSet: Set<Node> = new Set();
    private readonly bottomBaseRollAxis: Vec3 = new Vec3(0, 1, 0);
    private readonly roleTemplateBottomBasePos: Vec3 = new Vec3();
    private readonly roleTemplateArmsPos: Vec3 = new Vec3();
    private readonly tempBottomBaseTargetPos: Vec3 = new Vec3();
    private roleTemplateLayoutLoaded: boolean = false;
    private hasRoleTemplateLayout: boolean = false;
    private bottomBaseRollAngle: number = 0;
    private lastBottomBaseWorldZ: number = 0;
    private hasLastBottomBaseWorldZ: boolean = false;
    private oilHitFlashRecords: OilHitFlashMaterialRecord[] = [];
    private oilHitFlashState: { progress: number } | null = null;

    // @property(Node)
    // public effect_ss: Node;

    public get hitNode() {
        if (this.hasLalian && this.lalianCube && this.lalianCube.isValid) {
            return this.lalianCube;
        }
        return super.hitNode;
    }

    protected damage(power: number): void {
        if (this.hasLalian) {
            this.playLalianHit();
            return;
        }
        // 轮胎销毁不受_isShake阻塞
        const hpRatio = this.curHp / this.MaxHp;
        const shouldRemain = Math.max(0, Math.ceil(hpRatio * this._initialTireCount));
        if (this.tireList.length > shouldRemain) {
            this.destroyOneTire();
            this.playOilBarrelHitFlash();
        } else if (!this._isShake && this.tireList.length > 0) {
            // 没销毁轮胎：所有轮胎波浪缩放+闪红
            this._isShake = true;
            this.playOilBarrelHitFlash();
            this._playBottomTireHit();
            TweenTool.scaleShake(this.hpLabel.node);
        } else {
            this.playOilBarrelHitFlash();
        }
        this.hpLabel.string = Math.round(this.curHp).toString();
    }

    public flashRed(duration: number = 0.15, flashColor: Color | null = null, ground: string = null): void {
        FlashRedManager.instance.flashRed(this.node, this.meshFlashDataList, duration, flashColor, ground);
    }
    protected die(): void {

        this._isShake = false;
        this.clearWeaponVisualHitPulseState();
        this.restoreOilHitFlashMaterials();
        FlashRedManager.instance.stopFlashRed(this.node);
        BulletMonsterCollisionManager.instance.unregisterTarget(this);
        CameraMove.instance?.Shake2(0.8);

        // 轮胎依次破碎消失
        const destroyTireCount = this.tireList.length;
        for (let i = 0; i < this.tireList.length; i++) {
            const tire = this.tireList[i];
            Tween.stopAllByTarget(tire);
            const prefabBurstDuration = this.playBottomBasePrefabBurst(tire, i);
            const oilBurstRecords = prefabBurstDuration > 0 ? [] : this.createOilBurstMaterialRecords(tire);
            if (prefabBurstDuration <= 0) {
                this.spawnOilBurstShards(tire, oilBurstRecords, i);
            }
            if (oilBurstRecords.length > 0) {
                const burstState = { progress: 0 };
                const delay = i * PropArms.oilBurstDestroyDelayStep;
                this.applyOilBurstProgress(oilBurstRecords, 0.95);
                tween(burstState)
                    .delay(delay)
                    .to(PropArms.oilBurstDestroyDuration, { progress: 1 }, {
                        onUpdate: (target: { progress: number }) => {
                            this.applyOilBurstProgress(oilBurstRecords, 0.95 + target.progress * 0.05);
                        }
                    })
                    .start();
            }
            if (prefabBurstDuration > 0) {
                tween(tire)
                    .delay(prefabBurstDuration)
                    .call(() => {
                        this.releaseBottomBase(tire);
                    })
                    .start();
            } else {
                tween(tire)
                    .delay(i * PropArms.oilBurstDestroyDelayStep)
                    .to(PropArms.oilBurstDestroyDuration, { scale: this.getBottomBaseRootScale(tire, PropArms.oilBurstDestroyScale) }, { easing: 'sineOut' })
                    .call(() => {
                        this.restoreOilBurstMaterials(oilBurstRecords);
                        this.releaseBottomBase(tire);
                    })
                    .start();
            }
        }
        this.tireList = [];
        this.hpLabel.string = "";
        Tween.stopAllByTarget(this.getCurrentArmsVisualRoot(this._curArms));
        // const time = this._curArms.fbx.setAnimation(AnimArms.up_out, false).duration;
        // const halfTime = time * 0.5;

        // FBX动画结束后切回idle，发送全局事件让人跳走
        // this.scheduleOnce(() => {
        EventManager.instance.emit(EventType.PROP_ARMS_DIE, this._curArms);
        // this._curArms.fbx.setAnimation(AnimArms.up_ju, true);
        this._isStageAlive = false;
        // }, time * 0.8);

        if (!this.wallNode) {
            this.node.emit(EventType.PROP_ARMS_DIE, this._curArms);
            this.queueTrySpawnNextStage();
            if (this._disableWaveStageChain) {
                const activeDestroyDelay = 0.3 * this.animScale;
                const batchDestroyDelay = (destroyTireCount - 1) * PropArms.oilBurstDestroyDelayStep + Math.max(PropArms.oilBurstDestroyDuration, PropArms.oilBurstShardDuration + 0.08);
                const hideDelay = Math.max(0.01, activeDestroyDelay, batchDestroyDelay);
                this.scheduleOnce(() => {
                    this.node.active = false;
                }, hideDelay);
            }
            return;
        }

        // 石板三段式动画：抛起→人跳走→落下砸地
        tween(this.wallNode)
            // .delay(halfTime)
            .call(() => {
                this.isWallH = false;
                // 锁定到浮动基准中心，消除sin相位差异
                const baseY = (this.getCurrentArmsVisualRoot(this._curArms)?.y ?? 0) + this._curArms?.wallHeight;
                this.wallNode.y = baseY;

                // 运行时捕获位置
                const throwY = this.wallNode.y + 3;
                const groundY = 0.862;

                tween(this.wallNode)
                    .to(0.3, { y: throwY }, { easing: 'sineOut' })
                    .to(0.4, { y: groundY }, { easing: 'sineIn' })
                    .call(() => {
                        this.node.emit(EventType.PROP_ARMS_DIE, this._curArms);
                        this.queueTrySpawnNextStage();
                        EventManager.instance.emit(EventType.MONSTER_SKILL_XRD, this.wallNode.worldPositionX, 6, this._curArms.moveCount / 8 * 3.5);
                        CameraMove.instance.Shake2(2);
                        AudioManager.inst.playOneShot(SoundEnum.Sound_downST);
                        if (this.wallEffect) {
                            this.wallEffect.active = true;
                            for (let i = 0; i < this.wallEffect.children.length; i++)
                                this.wallEffect.children[i].getComponent(AttackParkPlay)?.play();
                        }
                        this.isWallH = false;
                        if (this._disableWaveStageChain) {
                            this.node.active = false;
                        }
                        // this.effect_ss.active = true;
                        // for (let i = 0; i < this.effect_ss.children.length; i++) {
                        //     const e = this.effect_ss.children[i].getComponent(AttackParkPlay);
                        //     e.play();
                        // }
                    })
                    .start();
            })
            .start();
    }



    /** 正常受击：所有轮胎依次延迟播放松缩放（放大→回弹→恢复） */
    private _playBottomTireHit(): void {
        if (this.tireList.length <= 0) return;
        AudioManager.inst.playOneShot(SoundEnum.Sound_tire_hit, 0.4, 0.08);
        const staggerDelay = 0.05;
        const lastIdx = this.tireList.length - 1;
        for (let i = 0; i < this.tireList.length; i++) {
            const tire = this.tireList[i];
            Tween.stopAllByTarget(tire);
            this.resetBottomBaseRootScale(tire);

            // const s1 = PoolManager.instance.V3.set(Vec3.ONE);

            const s1 = this.getBottomBaseRootScale(tire);
            const s2 = this.getBottomBaseRootScale(tire, 1.08);

            const s3 = this.getBottomBaseRootScale(tire, 0.96);
            // s3.x = 0.8; s3.y = 0.8; s3.z = 0.8;

            const isLast = i >= lastIdx;
            tween(tire)
                .delay(i * staggerDelay)
                .to(0.08, { scale: s2 }, { easing: 'cubicOut' })
                .to(0.08, { scale: s3 }, { easing: 'cubicOut' })
                .to(0.08, { scale: s1 }, { easing: 'backOut' })
                .call(() => {
                    if (isLast) {
                        this._isShake = false;
                        this._shakeCooldown = 0;
                    }
                })
                .start();
        }
    }

    private playLalianHit(): void {
        if (this.lalianAnimating || this.lalianFinished) {
            this.curHp = Math.max(1, this.curHp);
            return;
        }

        if (!this.lalianSegments.length) {
            this.finishLalian();
            return;
        }

        const segment = this.lalianSegments[this.lalianHitIndex];
        const startPosList = this.lalianSegmentChildStartPos[this.lalianHitIndex];
        if (!segment || !startPosList) {
            this.finishLalian();
            return;
        }

        this.lalianAnimating = true;
        AudioManager.inst.playOneShot(SoundEnum.Sound_tire_hit, 0.4, 0.08);
        if (this.hpLabel?.node) {
            TweenTool.scaleShake(this.hpLabel.node);
        }
        this.flashRed();

        const duration = 0.12 * this.animScale;
        const progress = this.lalianSegmentHitStep === 0 ? 0.5 : 1;
        for (let i = 0; i < segment.children.length; i++) {
            const part = segment.children[i];
            const startPos = startPosList[i];
            if (!part || !startPos) {
                continue;
            }
            let targetX = startPos.x;
            if (Math.abs(startPos.x) > this.lalianCloseX) {
                const closeX = startPos.x > 0 ? this.lalianCloseX : -this.lalianCloseX;
                targetX = startPos.x + (closeX - startPos.x) * progress;
            }
            Tween.stopAllByTarget(part);
            tween(part)
                .to(duration, { position: v3(targetX, startPos.y, startPos.z) }, { easing: 'cubicOut' })
                .start();
        }

        const segmentClosed = progress >= 1;
        if (segmentClosed) {
            this.lalianHitIndex++;
            this.lalianSegmentHitStep = 0;
        } else {
            this.lalianSegmentHitStep++;
        }

        const remain = Math.max(0, this.lalianSegments.length - this.lalianHitIndex);
        this.curHp = Math.max(1, remain);
        if (this.hpLabel) {
            this.hpLabel.string = Math.ceil(remain + (this.lalianSegmentHitStep > 0 ? 0.5 : 0)).toString();
        }

        const nextSegment = this.lalianSegments[this.lalianHitIndex];
        if (segmentClosed && this.lalianCube && nextSegment) {
            const cubePos = this.lalianCube.position;
            Tween.stopAllByTarget(this.lalianCube);
            tween(this.lalianCube)
                .to(duration, { position: v3(cubePos.x, cubePos.y, nextSegment.position.z) }, { easing: 'cubicOut' })
                .start();
        }

        this.scheduleOnce(() => {
            this.lalianAnimating = false;
            if (segmentClosed && remain <= 0) {
                this.finishLalian();
            }
        }, duration);
    }

    private finishLalian(): void {
        if (this.lalianFinished) {
            return;
        }
        this.lalianFinished = true;
        this.lalianAnimating = false;
        this.curHp = 1;
        this._isShake = false;
        this._isStageAlive = false;
        if (this.hpLabel) {
            this.hpLabel.string = "";
        }
        BulletMonsterCollisionManager.instance.unregisterTarget(this);

        const emitFinish = () => {
            const armsInfo = this._curArms ?? this.createLalianArmsInfo();
            EventManager.instance.emit(EventType.PROP_ARMS_DIE, armsInfo);
            this.node.emit(EventType.PROP_ARMS_DIE, armsInfo);
            this.queueTrySpawnNextStage();
            if (this._disableWaveStageChain) {
                this.node.active = false;
            }
        };

        if (!this.lalianCube) {
            emitFinish();
            return;
        }

        Tween.stopAllByTarget(this.lalianCube);
        tween(this.lalianCube)
            .to(0.08 * this.animScale, { scale: Vec3.ZERO }, { easing: 'sineIn' })
            .call(() => {
                this.lalianCube.active = false;
                this.lalianCube.setScale(this.lalianCubeStartScale);
                emitFinish();
            })
            .start();
    }

    private createLalianArmsInfo(): ArmsInfo {
        const armsInfo = new ArmsInfo();
        armsInfo.moveCount = this.lalianMoveCount > 0 ? this.lalianMoveCount : this.lalianSegments.length;
        return armsInfo;
    }

    private destroyOneTire(): void {
        const tire = this.tireList.shift();
        if (!tire) return;

        // 停止残留缩放动画并重置到原始大小
        this.restoreOilHitFlashMaterials();
        Tween.stopAllByTarget(tire);
        this.resetBottomBaseRootScale(tire);

        // 捕获被销毁轮胎的MeshRenderer（flashRed是延迟应用的，必须在更新mesh引用前捕获）
        const oldMR = this.meshFlashDataList[0].meshRender;

        // 更新底部轮胎mesh引用
        if (this.tireList.length) {
            const tireMeshRenderer = this.findFirstMeshRenderer(this.tireList[0]);
            if (tireMeshRenderer) {
                this.meshFlashDataList[0].meshRender = tireMeshRenderer;
            }
        }

        FlashRedManager.instance.stopFlashRed(this.node);
        CameraMove.instance?.Shake2(0.8);

        // 用旧引用闪红被销毁的轮胎（传独立数组，避免延迟应用时被新引用覆盖）
        const prefabBurstDuration = this.playBottomBasePrefabBurst(tire, 0);
        const oilBurstRecords = prefabBurstDuration > 0 ? [] : this.createOilBurstMaterialRecords(tire);
        if (prefabBurstDuration <= 0) {
            this.spawnOilBurstShards(tire, oilBurstRecords, 0);
        }

        if (prefabBurstDuration <= 0 && oilBurstRecords.length <= 0 && oldMR && oldMR.isValid) {
            FlashRedManager.instance.flashRed(this.node, [{
                meshRender: oldMR,
                colorProps: this.meshFlashDataList[0].colorProps,
                switchProps: this.meshFlashDataList[0].switchProps,
            }]);
        }
        TweenTool.scaleShake(this.hpLabel.node);

        // 被销毁轮胎：果冻缩放→缩小消失
        const s2 = this.getBottomBaseRootScale(tire, PropArms.oilBurstDestroyScale);
        if (oilBurstRecords.length > 0) {
            const burstState = { progress: 0 };
            this.applyOilBurstProgress(oilBurstRecords, 0.95);
            tween(burstState)
                .to(0.18 * this.animScale, { progress: 1 }, {
                    onUpdate: (target: { progress: number }) => {
                        this.applyOilBurstProgress(oilBurstRecords, 0.95 + target.progress * 0.05);
                    }
                })
                .start();
        }
        if (prefabBurstDuration > 0) {
            tween(tire)
                .delay(prefabBurstDuration)
                .call(() => {
                    this.releaseBottomBase(tire);
                    this._isShake = false;
                })
                .start();
        } else {
            tween(tire)
                .to(0.18 * this.animScale, { scale: s2 }, { easing: 'sineOut' })
                .call(() => {
                    this.restoreOilBurstMaterials(oilBurstRecords);
                    this.releaseBottomBase(tire);
                    this._isShake = false;
                })
                .start();
        }

        // 剩余轮胎弹跳下落（上面的轮胎先跳再落）
        this._setupTireBounce();

        // FBX弹跳一下
        Tween.stopAllByTarget(this.getCurrentArmsVisualRoot(this._curArms));
        const fbxNode = this.getCurrentArmsVisualRoot(this._curArms);
        if (!fbxNode) return;
        const delay = 0.05 + this.tireList.length * 0.05;
        const fbxY = fbxNode.y;
        const bounceH = this.jumpHeight + this.tireList.length * 0.1 * this.jumpHeight;
        let dropTargetY = this.getArmsTargetY(this.tireList.length);
        if (!this._curArms.isCanMove && this.tireList.length > this._curArms.canTireCount) {
            dropTargetY = fbxY;
        }
        tween(fbxNode)
            .delay(delay)
            .to(0.04 * this.animScale, { y: fbxY + bounceH }, { easing: 'sineOut' })
            .to(0.06 * this.animScale, { y: dropTargetY }, { easing: 'quadIn' })
            .start();

        AudioManager.inst.playOneShot(SoundEnum.sound_met_die);
        // this.effect.node.active = true;
        // this.effect?.play();
    }

    /** 记录当前所有轮胎位置，启动弹跳动画 */
    private _setupTireBounce(): void {
        const len = this.tireList.length;
        this._tireBounceStartY.length = 0;
        this._tireBounceTargetY.length = 0;
        this._tireBounceH.length = 0;
        for (let i = 0; i < len; i++) {
            this._tireBounceStartY.push(this.tireList[i].position.y);
            this._tireBounceTargetY.push(this.getBottomBaseTargetPosition(i, this.tireList[i]).y);
            this._tireBounceH.push(this.jumpHeight + i * 0.1 * this.jumpHeight);
        }
        this._tireBounceTimer = 0;
    }

    /** 每帧：轮胎平滑插值到目标位置，销毁时先弹跳再落下 */
    private _updateTireDrop(dt: number): void {
        if (this._tireBounceTimer >= 0) {
            // 弹跳模式：先弹跳再落到新位置
            this._tireBounceTimer += dt;
            const bounceUp = 0.04 * this.animScale;
            const fallDown = 0.1 * this.animScale;
            const perDelay = 0.05;
            for (let i = 0; i < this.tireList.length && i < this._tireBounceStartY.length; i++) {
                const tire = this.tireList[i];
                const targetPos = this.getBottomBaseTargetPosition(i, tire);
                const targetX = targetPos.x;
                const targetZ = targetPos.z;
                const localT = this._tireBounceTimer - perDelay * i;
                if (localT <= 0) continue;
                if (localT < bounceUp) {
                    const t = localT / bounceUp;
                    tire.setPosition(targetX, this._tireBounceStartY[i] + this._tireBounceH[i] * Math.sin(t * Math.PI * 0.5), targetZ);
                } else if (localT < bounceUp + fallDown) {
                    const t = (localT - bounceUp) / fallDown;
                    const peak = this._tireBounceStartY[i] + this._tireBounceH[i];
                    tire.setPosition(targetX, peak + (this._tireBounceTargetY[i] - peak) * (t * t), targetZ);
                } else {
                    tire.setPosition(targetX, this._tireBounceTargetY[i], targetZ);
                }
            }
            if (this._tireBounceTimer > perDelay * this.tireList.length + bounceUp + fallDown) {
                this._tireBounceTimer = -1;
            }
        } else {
            // 平滑插值模式
            for (let i = 0; i < this.tireList.length; i++) {
                const tire = this.tireList[i];
                const targetPos = this.getBottomBaseTargetPosition(i, tire);
                const targetY = targetPos.y;
                const targetX = targetPos.x;
                const targetZ = targetPos.z;
                const curY = tire.position.y;
                const diff = targetY - curY;
                if (Math.abs(diff) > 0.001) {
                    tire.setPosition(targetX, curY + diff * Math.min(1, dt * 8), targetZ);
                } else {
                    tire.setPosition(targetX, targetY, targetZ);
                }
            }
        }
    }

    public init(count: number = 0) {

        this._level += count;
        if (this.armsInfoList.length <= 0) {
            this.initLalianOnly();
            return;
        }
        if (this._level >= this.armsInfoList.length) {
            this._isStageAlive = false;
            this.node.active = false;
        } else {
            this.loadRoleTemplateLayout();
            for (let i = 0; i < this.armsInfoList.length; i++) {
                const arms = this.armsInfoList[i];
                const visualRoot = this.getCurrentArmsVisualRoot(arms);
                if (visualRoot) {
                    visualRoot.active = i === this._level;
                }
            }
            this._curArms = this.armsInfoList[this._level];
            this._curArms.weaponBulletConfigIndex = this._level;
            const currentArms = this._curArms;
            const visualRoot = this.getCurrentArmsVisualRoot(currentArms);
            if (!currentArms || !visualRoot) {
                this._isStageAlive = false;
                return;
            }
            this._curArmsUsesSpriteVisual = this.hasNodeByName(visualRoot, PropArms.weaponPickupVisualName)
                || this.hasNodeByName(visualRoot, PropArms.spriteWeaponVisualName);
            this._curArmsSpriteTargetY = visualRoot.y;
            this._isStageAlive = true;
            this.clearWeaponVisualHitPulseState();
            this.cacheWeaponVisualOriginalScales(visualRoot);
            this.initLalian();

            const tireSpacing = this.tireSpacing;
            const wallHeight = currentArms.wallHeight;
            const tireCount = this.hasLalian ? 0 : currentArms.tireCount;
            const manualBottomBases = !this.hasLalian ? this.collectManualBottomBases(tireCount) : [];

            this.initHp(currentArms.hp);
            if (this.hasLalian) {
                this.MaxHp = Math.max(1, this.lalianSegments.length * 2);
                this.curHp = this.MaxHp;
            }
            this.hpLabel.string = Math.round(this.MaxHp).toString();

            // 保存hpLabel原始缩放（用number避免GC），动画期间隐藏
            const hpS = this.hpLabel.node.scale;
            const hplSx = hpS.x, hplSy = hpS.y, hplSz = hpS.z;
            this.hpLabel.node.setScale(0, 0, 0);

            // 保存FBX原始scale（复用PoolManager的V3避免GC）
            const scale = PoolManager.instance.V3.set(visualRoot.scale);

            // 初始位置: FBX在地下
            if (this.hasRoleTemplateLayout) {
                visualRoot.setPosition(this.roleTemplateArmsPos.x, -1, this.roleTemplateArmsPos.z);
            } else {
                visualRoot.y = -1;
            }
            visualRoot.setScale(Vec3.ZERO);
            this.playArmsFbxAnimation(currentArms, AnimArms.idle, true);
            this.isWallH = false;
            this.resetBottomBaseRollState();

            // 生成所有轮胎（起始在地底）
            if (!this.hasLalian) {
                for (let i = 0; i < tireCount; i++) {
                    const tire = manualBottomBases[i] ?? this.tire;
                    this.tireList.push(tire);
                    if (tire.parent !== this.node) {
                        this.node.addChild(tire);
                    }
                    const tireTargetPos = this.getBottomBaseTargetPosition(i, tire);
                    tire.setPosition(tireTargetPos.x, tireTargetPos.y - tireSpacing, tireTargetPos.z);
                    if (!i) {
                        const tireMeshRenderer = this.findFirstMeshRenderer(tire);
                        if (tireMeshRenderer) {
                            this.meshFlashDataList[0].meshRender = tireMeshRenderer;
                        }
                    }
                }
            }

            this._initialTireCount = this.tireList.length;

            // Phase 1: FBX从地底快速升起
            const phase1Delay = 0.05;
            const phase1RiseTime = 0.05;

            let fbxPhase1TargetY: number;
            let wallPhase1TargetY: number;
            let needTireLift: boolean;

            if (currentArms.isCanMove) {
                fbxPhase1TargetY = this.getArmsTargetY(0);
                wallPhase1TargetY = fbxPhase1TargetY + wallHeight;
                needTireLift = true;
            } else {
                fbxPhase1TargetY = this.hasRoleTemplateLayout ? this.getArmsTargetY(0) : currentArms.canHeight;
                wallPhase1TargetY = fbxPhase1TargetY + wallHeight;
                needTireLift = false;
            }

            // FBX快速升起
            tween(visualRoot)
                .delay(phase1Delay)
                .call(() => { this.playArmsFbxAnimation(currentArms, AnimArms.up_ju, true); })
                .to(phase1RiseTime, { y: fbxPhase1TargetY, scale: scale }, { easing: "backOut" })
                .start();

            // wallNode跟随FBX升起
            if (this.wallNode) {
                tween(this.wallNode)
                    .delay(phase1Delay)
                    .to(phase1RiseTime, { y: wallPhase1TargetY }, { easing: "backOut" })
                    .start();
            }

            // Phase 2: 轮胎从地底依次升起，把FBX顶上去
            const tireStartDelay = phase1Delay + phase1RiseTime + 0.02;
            const tireRiseTime = 0.1;
            const tireInterval = 0.08;

            for (let i = 0; i < tireCount; i++) {
                const tire = this.tireList[i];
                const tireTargetPos = this.getBottomBaseTargetPosition(i, tire);
                const tireDelay = tireStartDelay + i * tireInterval;

                // 轮胎升起
                tween(tire)
                    .delay(tireDelay)
                    .to(tireRiseTime, { position: tireTargetPos.clone() }, { easing: "backOut" })
                    .start();

                if (needTireLift) {
                    // FBX被顶起：轮胎先升起一点再顶FBX
                    const liftDelay = tireDelay - 0.02;
                    const liftTime = 0.08;
                    const targetFbxY = this.getArmsTargetY(i + 1);
                    const targetWallY = targetFbxY + wallHeight;

                    tween(visualRoot)
                        .delay(liftDelay)
                        .to(liftTime, { y: targetFbxY }, { easing: "backOut" })
                        .start();
                    if (this.wallNode) {
                        tween(this.wallNode)
                            .delay(liftDelay)
                            .to(liftTime, { y: targetWallY }, { easing: "backOut" })
                            .start();
                    }
                }
            }

            // 计算总动画时长，结束后统一处理
            const totalTime = this.hasLalian ? phase1Delay + phase1RiseTime + 0.05 : tireStartDelay + (tireCount - 1) * tireInterval + tireRiseTime + 0.05;
            this.scheduleOnce(() => {
                if (this._curArms === currentArms) {
                    this.playArmsFbxAnimation(currentArms, AnimArms.idle, true);
                }
                this.hpLabel.node.setScale(hplSx, hplSy, hplSz);
                PoolManager.instance.V3 = scale;
                BulletMonsterCollisionManager.instance.registerTarget(this);
                this.isWallH = true;
            }, totalTime);
        }
    }

    private initLalianOnly(): void {
        // 预留给已废弃/外部兼容的空配置分支，当前版本不再在这里生成拉链逻辑。
    }

    private get tire() {
        let tire = PoolManager.instance.getPool<Node>(this.bottomBasePoolKey);
        if (!tire) {
            tire = PrefabsManager.instance.GetPrefabsIns(PrefabsEnum.other, this.bottomBasePrefab);
        }
        tire.active = true;
        this.resetBottomBaseBurstVisual(tire);
        this.getBottomBaseOriginalEuler(tire);
        tire.setScale(Vec3.ONE); // Set tire scale to one
        tire.eulerAngles = this.getBottomBaseOriginalEuler(tire);
        this.applyBottomBaseVisualTransform(tire);
        this.fitBottomBaseVisualXToRoot(tire);
        this.applyBottomBaseRoll(tire);
        return tire;
    }

    private get bottomBasePoolKey(): string {
        return PoolEnum.Other + this.bottomBasePrefab;
    }

    private collectManualBottomBases(maxCount: number): Node[] {
        const result: Node[] = [];
        const roleNode = this.getCurrentArmsVisualRoot(this._curArms);
        if (roleNode) {
            this.collectBottomBaseNodes(roleNode, result, true);
        }
        if (result.length <= 0) {
            this.collectBottomBaseNodes(this.node, result, false);
        }
        result.sort((a, b) => a.worldPosition.y - b.worldPosition.y);

        const count = maxCount > 0 ? Math.min(maxCount, result.length) : result.length;
        const selected = result.slice(0, count);
        for (let i = 0; i < selected.length; i++) {
            const node = selected[i];
            Tween.stopAllByTarget(node);
            node.active = true;
            this.resetBottomBaseBurstVisual(node);
            if (node.parent !== this.node) {
                node.setParent(this.node, true);
            }
            this.manualBottomBaseNodeSet.add(node);
            this.getBottomBaseOriginalScale(node);
            this.getBottomBaseOriginalPos(node);
            this.getBottomBaseOriginalEuler(node);
            this.bottomBaseTargetPosMap.set(node, node.position.clone());
        }
        return selected;
    }

    private collectBottomBaseNodes(root: Node, out: Node[], recursive: boolean): void {
        if (!root) {
            return;
        }
        for (let i = 0; i < root.children.length; i++) {
            const child = root.children[i];
            if (!child.active) {
                continue;
            }
            if (this.isBottomBaseNode(child)) {
                if (out.indexOf(child) === -1) {
                    out.push(child);
                }
                continue;
            }
            if (recursive) {
                this.collectBottomBaseNodes(child, out, recursive);
            }
        }
    }

    private isBottomBaseNode(node: Node): boolean {
        if (!node) {
            return false;
        }
        const name = node.name.toLowerCase();
        return name.indexOf("youtong") >= 0 || name.indexOf("oil") >= 0;
    }

    private getBottomBaseRootScale(node: Node, x: number = 1, y: number = x, z: number = x): Vec3 {
        const original = this.getBottomBaseOriginalScale(node);
        return v3(original.x * x, original.y * y, original.z * z);
    }

    private resetBottomBaseRootScale(node: Node): void {
        const original = this.getBottomBaseOriginalScale(node);
        node.setScale(original);
    }

    private releaseBottomBase(node: Node): void {
        node.active = false;
        this.resetBottomBaseRootScale(node);
        this.resetBottomBaseBurstVisual(node);
        this.bottomBaseTargetPosMap.delete(node);
        if (this.manualBottomBaseNodeSet.has(node)) {
            this.manualBottomBaseNodeSet.delete(node);
            return;
        }
        PoolManager.instance.setPool(this.bottomBasePoolKey, node);
    }

    private loadRoleTemplateLayout(): void {
        if (this.roleTemplateLayoutLoaded) {
            return;
        }
        this.roleTemplateLayoutLoaded = true;

        let root = this.node;
        while (root.parent) {
            root = root.parent;
        }

        const template = this.findNodeByName(root, "Role_t");
        if (!template || template === this.node || template.children.length < 2) {
            return;
        }

        const bottomBase = template.children[0];
        const arms = template.children[1];
        if (!bottomBase || !arms) {
            return;
        }

        this.roleTemplateBottomBasePos.set(bottomBase.position);
        this.roleTemplateArmsPos.set(arms.position);
        this.hasRoleTemplateLayout = true;
    }

    private getBottomBaseTargetX(): number {
        this.loadRoleTemplateLayout();
        return this.hasRoleTemplateLayout ? this.roleTemplateBottomBasePos.x : 0;
    }

    private getBottomBaseTargetY(index: number): number {
        this.loadRoleTemplateLayout();
        if (this.hasRoleTemplateLayout) {
            return this.roleTemplateBottomBasePos.y + index * this.tireSpacing;
        }
        return index * this.tireSpacing;
    }

    private getBottomBaseTargetZ(): number {
        this.loadRoleTemplateLayout();
        return this.hasRoleTemplateLayout ? this.roleTemplateBottomBasePos.z : 0;
    }

    private getBottomBaseTargetPosition(index: number, node?: Node): Vec3 {
        const nodeTarget = node ? this.bottomBaseTargetPosMap.get(node) : null;
        if (nodeTarget) {
            return this.tempBottomBaseTargetPos.set(nodeTarget);
        }
        return this.tempBottomBaseTargetPos.set(
            this.getBottomBaseTargetX(),
            this.getBottomBaseTargetY(index),
            this.getBottomBaseTargetZ(),
        );
    }

    private getArmsTargetY(liftCount: number): number {
        if (this._curArmsUsesSpriteVisual) {
            return this._curArmsSpriteTargetY;
        }
        this.loadRoleTemplateLayout();
        if (this.hasRoleTemplateLayout) {
            return this.roleTemplateArmsPos.y + Math.max(0, liftCount - 1) * this.tireSpacing;
        }
        return liftCount * this.tireSpacing;
    }

    private playArmsFbxAnimation(arms: ArmsInfo | null, anim: AnimArms, loop: boolean = true): void {
        if (!arms || PropArms.getWeaponPickupVisualRoot(arms.runtimeVisualRoot)?.isValid || !arms.fbx?.node?.isValid) {
            return;
        }
        try {
            const state = arms.fbx.getAnimState(anim);
            if (!state) {
                return;
            }
            arms.fbx.setAnimation(anim, loop);
        } catch {
            return;
        }
    }

    private applyBottomBaseVisualTransform(node: Node): void {
        if (!node) {
            return;
        }
        if (node.children.length <= 0) {
            this.applyBottomBaseChildVisualTransform(node);
            return;
        }
        for (let i = 0; i < node.children.length; i++) {
            this.applyBottomBaseChildVisualTransform(node.children[i]);
        }
    }

    private applyBottomBaseChildVisualTransform(node: Node): void {
        const originalScale = this.getBottomBaseOriginalScale(node);
        const originalPos = this.getBottomBaseOriginalPos(node);
        const originalEuler = this.getBottomBaseOriginalEuler(node);
        node.setScale(
            originalScale.x * this.tireScale.x * this.bottomBaseScaleMultiplier,
            originalScale.y * this.tireScale.y * this.bottomBaseScaleMultiplier,
            originalScale.z * this.tireScale.z * this.bottomBaseScaleMultiplier,
        );
        node.setPosition(originalPos);
        node.eulerAngles = originalEuler;
    }

    private getBottomBaseOriginalScale(node: Node): Vec3 {
        let originalScale = this.bottomBaseChildScaleMap.get(node);
        if (!originalScale) {
            originalScale = node.scale.clone();
            this.bottomBaseChildScaleMap.set(node, originalScale);
        }
        return originalScale;
    }

    private getWeaponVisualOriginalScale(node: Node): Vec3 {
        let originalScale = this.weaponVisualScaleMap.get(node);
        if (!originalScale) {
            originalScale = node.scale.clone();
            this.weaponVisualScaleMap.set(node, originalScale);
        }
        return originalScale;
    }

    private cacheWeaponVisualOriginalScales(root: Node | null): void {
        if (!root) {
            return;
        }
        const spriteNodes: Node[] = [];
        PropArms.collectNodesByName(root, PropArms.weaponPickupVisualName, spriteNodes);
        PropArms.collectNodesByName(root, PropArms.spriteWeaponVisualName, spriteNodes);
        for (let i = 0; i < spriteNodes.length; i++) {
            const spriteNode = spriteNodes[i];
            if (!spriteNode?.isValid) {
                continue;
            }
            this.weaponVisualScaleMap.set(spriteNode, spriteNode.scale.clone());
        }
    }

    private clearWeaponVisualHitPulseState(resetScale: boolean = true): void {
        this.weaponVisualHitPulseStateMap.forEach((_, node) => {
            if (!node?.isValid) {
                return;
            }
            Tween.stopAllByTarget(node);
            if (resetScale) {
                node.setScale(this.getWeaponVisualOriginalScale(node));
            }
        });
        this.weaponVisualHitPulseStateMap.clear();
    }

    private updateWeaponVisualHitPulse(dt: number): void {
        if (this.weaponVisualHitPulseStateMap.size <= 0) {
            return;
        }
        const finishedNodes: Node[] = [];
        this.weaponVisualHitPulseStateMap.forEach((state, node) => {
            if (!node?.isValid || !node.activeInHierarchy) {
                finishedNodes.push(node);
                return;
            }

            state.elapsed += dt;
            const originalScale = this.getWeaponVisualOriginalScale(node);
            const scaleUpRate = Math.max(1, this.weaponHitScaleUp);
            const scaleDownRate = Math.max(0.01, Math.min(scaleUpRate, this.weaponHitScaleDown));
            const rawT = Math.min(1, state.elapsed / Math.max(0.01, state.duration));
            let currentRate = 1;

            if (rawT < 0.35) {
                const segmentT = rawT / 0.35;
                const easedT = segmentT * segmentT * (3 - 2 * segmentT);
                currentRate = scaleDownRate + (scaleUpRate - scaleDownRate) * easedT;
            } else {
                const segmentT = (rawT - 0.35) / 0.65;
                const easedT = 1 - Math.pow(1 - segmentT, 2);
                currentRate = scaleUpRate + (1 - scaleUpRate) * easedT;
            }

            node.setScale(
                originalScale.x * currentRate,
                originalScale.y * currentRate,
                originalScale.z * currentRate,
            );

            if (rawT >= 1) {
                node.setScale(originalScale);
                finishedNodes.push(node);
            }
        });

        for (let i = 0; i < finishedNodes.length; i++) {
            this.weaponVisualHitPulseStateMap.delete(finishedNodes[i]);
        }
    }

    private getBottomBaseOriginalPos(node: Node): Vec3 {
        let originalPos = this.bottomBaseChildPosMap.get(node);
        if (!originalPos) {
            originalPos = node.position.clone();
            this.bottomBaseChildPosMap.set(node, originalPos);
        }
        return originalPos;
    }

    private getBottomBaseOriginalEuler(node: Node): Vec3 {
        let originalEuler = this.bottomBaseChildEulerMap.get(node);
        if (!originalEuler) {
            originalEuler = node.eulerAngles.clone();
            this.bottomBaseChildEulerMap.set(node, originalEuler);
        }
        return originalEuler;
    }

    private resetBottomBaseRollState(): void {
        this.bottomBaseRollAngle = 0;
        this.lastBottomBaseWorldZ = this.node.worldPositionZ;
        this.hasLastBottomBaseWorldZ = true;
    }

    private updateBottomBaseRoll(dt: number): void {
        if (this.tireList.length <= 0) {
            this.hasLastBottomBaseWorldZ = false;
            return;
        }

        const curWorldZ = this.node.worldPositionZ;
        const isGuideRollingOnly = !MonsterCreate.isStartMove && MoveDrive.isGuideMoveOnly;
        if (!MonsterCreate.isStartMove && !isGuideRollingOnly) {
            this.lastBottomBaseWorldZ = curWorldZ;
            this.hasLastBottomBaseWorldZ = true;
            return;
        }

        if (!this.hasLastBottomBaseWorldZ) {
            this.lastBottomBaseWorldZ = curWorldZ;
            this.hasLastBottomBaseWorldZ = true;
            return;
        }

        let deltaZ = curWorldZ - this.lastBottomBaseWorldZ;
        this.lastBottomBaseWorldZ = curWorldZ;
        if (isGuideRollingOnly) {
            deltaZ = -Math.max(0, MonsterCreate.instance?.monsterSpeed ?? 0) * dt;
        }
        if (Math.abs(deltaZ) <= 0.0001) {
            return;
        }

        this.bottomBaseRollAngle += deltaZ * this.bottomBaseRollDegreesPerUnit;
        for (let i = 0; i < this.tireList.length; i++) {
            this.applyBottomBaseRoll(this.tireList[i]);
        }
    }

    private applyBottomBaseRoll(node: Node): void {
        if (!node) {
            return;
        }
        if (node.children.length <= 0) {
            this.applyBottomBaseResourceRoll(node);
            return;
        }
        for (let i = 0; i < node.children.length; i++) {
            this.applyBottomBaseResourceRoll(node.children[i]);
        }
    }

    private applyBottomBaseResourceRoll(node: Node): void {
        const originalEuler = this.getBottomBaseOriginalEuler(node);
        node.eulerAngles = v3(
            originalEuler.x + this.bottomBaseRollAxis.x * this.bottomBaseRollAngle,
            originalEuler.y + this.bottomBaseRollAxis.y * this.bottomBaseRollAngle,
            originalEuler.z + this.bottomBaseRollAxis.z * this.bottomBaseRollAngle,
        );
    }

    private fitBottomBaseVisualXToRoot(root: Node): void {
        if (!root || !root.activeInHierarchy) {
            return;
        }
        const centerX = this.getBottomBaseWorldCenterX(root);
        if (centerX === null) {
            return;
        }

        const deltaX = root.worldPositionX + this.bottomBaseOffsetX - centerX;
        if (Math.abs(deltaX) <= 0.001) {
            return;
        }

        const rootScale = root.worldScale;
        const localDeltaX = deltaX / (rootScale.x || 1);
        if (root.children.length <= 0) {
            root.setPosition(root.position.x + localDeltaX, root.position.y, root.position.z);
            return;
        }

        for (let i = 0; i < root.children.length; i++) {
            const child = root.children[i];
            child.setPosition(child.position.x + localDeltaX, child.position.y, child.position.z);
        }
    }

    private getBottomBaseWorldCenterX(root: Node): number | null {
        let minX = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let found = false;
        const stack: Node[] = [root];
        while (stack.length > 0) {
            const node = stack.pop();
            if (!node) {
                continue;
            }
            const meshRenderer = node.getComponent(MeshRenderer);
            const worldBounds = (meshRenderer as any)?.model?.worldBounds;
            const center = worldBounds?.center;
            const halfExtents = worldBounds?.halfExtents;
            if (center && halfExtents) {
                minX = Math.min(minX, center.x - halfExtents.x);
                maxX = Math.max(maxX, center.x + halfExtents.x);
                found = true;
            }
            for (let i = 0; i < node.children.length; i++) {
                stack.push(node.children[i]);
            }
        }
        return found ? (minX + maxX) * 0.5 : null;
    }

    private static preloadOilBurstMaterial(): void {
        if (PropArms.oilBurstMaterial || PropArms.oilBurstMaterialLoading) {
            return;
        }
        PropArms.oilBurstMaterialLoading = true;
        resources.load(PropArms.oilBurstMaterialPath, Material, (err, material) => {
            PropArms.oilBurstMaterialLoading = false;
            if (err || !material) {
                console.warn(`[PropArms] load oil burst material failed: ${PropArms.oilBurstMaterialPath}`, err);
                return;
            }
            PropArms.oilBurstMaterial = material;
        });
    }

    private static preloadOilHitFlashMaterial(): void {
        if (PropArms.oilHitFlashMaterial || PropArms.oilHitFlashMaterialLoading) {
            return;
        }
        PropArms.oilHitFlashMaterialLoading = true;
        resources.load(PropArms.oilHitFlashMaterialPath, Material, (err, material) => {
            PropArms.oilHitFlashMaterialLoading = false;
            if (err || !material) {
                console.warn(`[PropArms] load oil hit flash material failed: ${PropArms.oilHitFlashMaterialPath}`, err);
                return;
            }
            PropArms.oilHitFlashMaterial = material;
        });
    }

    private playOilBarrelHitFlash(): void {
        if (this.isDie) {
            return;
        }
        this.playSpriteWeaponHitScale(PropArms.oilHitFlashDuration);
        if (this.tireList.length <= 0 || !this.meshFlashDataList?.length) {
            return;
        }
        FlashRedManager.instance.flashRed(
            this.node,
            this.getOilBarrelFlashDataList(),
            PropArms.oilHitFlashDuration,
            PropArms.oilHitFlashColor,
            "oilBarrel_Hit"
        );
    }

    private getOilBarrelFlashDataList(): MeshFlashData[] {
        const result: MeshFlashData[] = [];
        for (let i = 0; i < this.meshFlashDataList.length; i++) {
            const data = this.meshFlashDataList[i];
            if (!data?.meshRender) {
                continue;
            }
            if (data.switchProps && data.switchProps.length > 0) {
                result.push(data);
                continue;
            }
            const flashData = new MeshFlashData();
            flashData.meshRender = data.meshRender;
            flashData.colorProps = data.colorProps ? [...data.colorProps] : [];
            const intensitySwitch = new MeshFlashSwitchData();
            intensitySwitch.propName = "flashRedIntensity";
            intensitySwitch.passIndex = 0;
            intensitySwitch.matIndex = -1;
            intensitySwitch.flashValue = PropArms.oilHitFlashIntensity;
            intensitySwitch.restoreValue = 0;
            intensitySwitch.useMaterialProp = false;
            flashData.switchProps = [intensitySwitch];
            result.push(flashData);
        }
        return result;
    }

    private applyOilHitFlashWorldY(renderer: MeshRenderer, material: Material): void {
        const worldBounds = (renderer as any)?.model?.worldBounds;
        const center = worldBounds?.center;
        const halfExtents = worldBounds?.halfExtents;
        if (center && halfExtents) {
            material.setProperty("worldCenterY", center.y);
            material.setProperty("worldHalfY", Math.max(0.001, halfExtents.y));
            return;
        }
        material.setProperty("worldCenterY", renderer.node.worldPositionY);
        material.setProperty("worldHalfY", 0.5);
    }

    private spawnOilBurstShards(node: Node, records: OilBurstMaterialRecord[], groupIndex: number): void {
        if (!node) {
            return;
        }

        const sourceMaterial = this.getOilBurstSourceMaterial(records) ?? this.getOilBurstSourceMaterialFromNode(node);
        if (!sourceMaterial) {
            return;
        }

        const parent = node.parent;
        if (!parent) {
            return;
        }

        const burstCenter = this.getOilBurstShardWorldCenter(node);
        const baseSize = this.getOilBurstShardBaseSize(node);
        for (let i = 0; i < PropArms.oilBurstShardCount; i++) {
            const dir = this.getOilBurstShardDirection(i, burstCenter);
            const startRadius = baseSize * (0.04 + (i % 3) * 0.02);
            const shardNode = new Node(`OilBurstShard_${groupIndex}_${i}`);
            parent.addChild(shardNode);
            shardNode.layer = node.layer;
            shardNode.setWorldPosition(
                burstCenter.x + dir.x * startRadius,
                burstCenter.y + dir.y * startRadius,
                burstCenter.z + dir.z * startRadius
            );
            const startScale = 0.88 + (i % 3) * 0.04;
            shardNode.setScale(startScale, startScale, startScale);

            const renderer = shardNode.addComponent(MeshRenderer);
            renderer.mesh = this.createOilBurstShardMesh(baseSize, i);
            const material = this.createOilBurstShardMaterial(sourceMaterial);
            renderer.setSharedMaterial(material, 0);

            const spread = baseSize * (3.15 + (i % 4) * 0.5) * 1.3;
            const startPos = shardNode.position.clone();
            const endScale = startScale * 0.5;
            const flightState = { progress: 0 };
            tween(flightState)
                .delay(groupIndex * PropArms.oilBurstDestroyDelayStep + i * 0.012)
                .to(PropArms.oilBurstShardDuration, { progress: 1 }, {
                    easing: 'quartOut',
                    onUpdate: (state: { progress: number }) => {
                        const t = state.progress;
                        const outward = 1 - Math.pow(1 - t, 2.2);
                        const distance = spread * outward;
                        shardNode.setPosition(
                            startPos.x + dir.x * distance,
                            startPos.y + dir.y * distance,
                            startPos.z + dir.z * distance
                        );
                        const scale = startScale + (endScale - startScale) * t;
                        shardNode.setScale(scale, scale, scale);
                        this.setOilBurstShardMaterialProgress(material, t);
                    }
                })
                .call(() => {
                    renderer.mesh?.destroy();
                    material.destroy();
                    shardNode.destroy();
                })
                .start();
        }
    }

    private playBottomBasePrefabBurst(node: Node, groupIndex: number): number {
        const burstRoot = this.getBottomBaseBurstRoot(node);
        if (!node || !burstRoot || burstRoot.children.length <= 0) {
            return 0;
        }

        for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            child.active = child === burstRoot;
        }
        burstRoot.active = true;

        const burstCenter = burstRoot.worldPosition;
        const baseSize = Math.max(0.22, this.getOilBurstShardBaseSize(node) * 0.72);
        let maxDelay = groupIndex * PropArms.oilBurstDestroyDelayStep;
        for (let i = 0; i < burstRoot.children.length; i++) {
            const shard = burstRoot.children[i];
            if (!shard) {
                continue;
            }

            Tween.stopAllByTarget(shard);
            const originalPos = this.getBottomBaseOriginalPos(shard);
            const originalScale = this.getBottomBaseOriginalScale(shard);
            const originalEuler = this.getBottomBaseOriginalEuler(shard);
            shard.active = true;
            shard.setPosition(originalPos);
            shard.setScale(originalScale);
            shard.eulerAngles = originalEuler;

            const startWorldPos = shard.worldPosition.clone();
            const dir = this.getOilBurstShardDirection(i, burstCenter, startWorldPos);
            const delay = groupIndex * PropArms.oilBurstDestroyDelayStep + i * 0.012;
            const spread = baseSize * (2.1 + (i % 3) * 0.34) * 1.3;
            const fadeMaterialRecords = this.createOilBurstShardFadeMaterialRecords(shard);
            maxDelay = Math.max(maxDelay, delay);

            const flightState = { progress: 0 };
            tween(flightState)
                .delay(delay)
                .to(PropArms.oilBurstShardDuration, { progress: 1 }, {
                    easing: 'quartOut',
                    onUpdate: (state: { progress: number }) => {
                        const t = state.progress;
                        const outward = 1 - Math.pow(1 - t, 2.15);
                        const distance = spread * outward;
                        shard.setWorldPosition(
                            startWorldPos.x + dir.x * distance,
                            startWorldPos.y + dir.y * distance,
                            startWorldPos.z + dir.z * distance,
                        );
                        const scale = 1 - 0.5 * t;
                        shard.setScale(
                            originalScale.x * scale,
                            originalScale.y * scale,
                            originalScale.z * scale,
                        );
                        this.applyOilBurstShardFadeProgress(fadeMaterialRecords, t);
                    }
                })
                .call(() => {
                    if (!shard || !shard.isValid) {
                        this.restoreOilBurstShardFadeMaterials(fadeMaterialRecords);
                        return;
                    }
                    shard.setPosition(originalPos);
                    shard.setScale(originalScale);
                    shard.eulerAngles = originalEuler;
                    this.restoreOilBurstShardFadeMaterials(fadeMaterialRecords);
                    shard.active = false;
                })
                .start();
        }

        return maxDelay + PropArms.oilBurstShardDuration;
    }

    private getBottomBaseBurstRoot(node: Node): Node | null {
        if (!node) {
            return null;
        }
        for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            if (child?.name === "sp") {
                return child;
            }
        }
        return this.findNodeByName(node, "sp");
    }

    private resetBottomBaseBurstVisual(node: Node): void {
        const burstRoot = this.getBottomBaseBurstRoot(node);
        if (!node || !burstRoot) {
            return;
        }

        burstRoot.active = false;
        for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            child.active = child !== burstRoot;
        }
        for (let i = 0; i < burstRoot.children.length; i++) {
            const shard = burstRoot.children[i];
            if (!shard) {
                continue;
            }
            Tween.stopAllByTarget(shard);
            shard.setPosition(this.getBottomBaseOriginalPos(shard));
            shard.setScale(this.getBottomBaseOriginalScale(shard));
            shard.eulerAngles = this.getBottomBaseOriginalEuler(shard);
            shard.active = true;
        }
    }

    private playSpriteWeaponHitScale(totalDuration: number): void {
        const weaponRoot = this.getCurrentArmsVisualRoot(this._curArms);
        if (!weaponRoot) {
            return;
        }

        const spriteNodes: Node[] = [];
        PropArms.collectNodesByName(weaponRoot, PropArms.weaponPickupVisualName, spriteNodes);
        if (spriteNodes.length <= 0) {
            PropArms.collectNodesByName(weaponRoot, PropArms.spriteWeaponVisualName, spriteNodes);
        }
        if (spriteNodes.length <= 0) {
            return;
        }

        for (let i = 0; i < spriteNodes.length; i++) {
            const spriteNode = spriteNodes[i];
            if (!spriteNode || !spriteNode.isValid || !spriteNode.activeInHierarchy) {
                continue;
            }

            const pulseState = this.weaponVisualHitPulseStateMap.get(spriteNode);
            if (pulseState && pulseState.elapsed < pulseState.duration) {
                continue;
            }

            Tween.stopAllByTarget(spriteNode);
            const originalScale = this.getWeaponVisualOriginalScale(spriteNode);
            const scaleDownRate = Math.max(0.01, Math.min(Math.max(1, this.weaponHitScaleUp), this.weaponHitScaleDown));
            spriteNode.setScale(
                originalScale.x * scaleDownRate,
                originalScale.y * scaleDownRate,
                originalScale.z * scaleDownRate,
            );
            this.weaponVisualHitPulseStateMap.set(spriteNode, {
                elapsed: 0,
                duration: Math.max(0.01, totalDuration),
            });
        }
    }

    private getOilBurstSourceMaterial(records: OilBurstMaterialRecord[]): Material | null {
        let fallback: Material | null = null;
        for (let r = 0; r < records.length; r++) {
            const record = records[r];
            for (let i = 0; i < record.originalMaterials.length; i++) {
                const material = record.originalMaterials[i];
                if (material) {
                    const color = this.getMaterialProperty(material, "mainColor") as Color | null;
                    if (!color || (color.r >= 210 && color.g >= 210 && color.b >= 210)) {
                        return material;
                    }
                    if (!fallback) {
                        fallback = material;
                    }
                }
            }
        }
        return fallback;
    }

    private getOilBurstSourceMaterialFromNode(node: Node): Material | null {
        const renderers: MeshRenderer[] = [];
        this.collectMeshRenderers(node, renderers);
        let fallback: Material | null = null;
        for (let r = 0; r < renderers.length; r++) {
            const materials = renderers[r].sharedMaterials;
            for (let i = 0; i < materials.length; i++) {
                const material = materials[i];
                if (material) {
                    const color = this.getMaterialProperty(material, "mainColor") as Color | null;
                    if (!color || (color.r >= 210 && color.g >= 210 && color.b >= 210)) {
                        return material;
                    }
                    if (!fallback) {
                        fallback = material;
                    }
                }
            }
        }
        return fallback;
    }

    private createOilBurstShardMaterial(sourceMaterial: Material): Material {
        const material = new Material();
        const burstTemplate = PropArms.oilBurstMaterial;
        if (burstTemplate) {
            material.copy(burstTemplate);
            this.copyOilBurstBaseProperties(sourceMaterial, material);
            material.setProperty("burstProgress", 0);
            material.setProperty("burstWidth", 0.003);
            material.setProperty("burstOffset", 0.0015);
        } else {
            material.copy(sourceMaterial);
            const texture = this.getMaterialProperty(sourceMaterial, "mainTexture");
            if (texture) {
                material.setProperty("mainTexture", texture);
            }
            const color = this.getMaterialProperty(sourceMaterial, "mainColor");
            if (color) {
                material.setProperty("mainColor", color);
            }
        }
        return material;
    }

    private setOilBurstShardMaterialProgress(material: Material | null, progress: number): void {
        if (!material) {
            return;
        }
        material.setProperty("burstProgress", Math.max(0, Math.min(1, progress)));
    }

    private createOilBurstShardFadeMaterialRecords(node: Node): OilBurstShardFadeMaterialRecord[] {
        const burstTemplate = PropArms.oilBurstMaterial;
        if (!burstTemplate) {
            PropArms.preloadOilBurstMaterial();
            return [];
        }
        const renderers: MeshRenderer[] = [];
        this.collectMeshRenderers(node, renderers);
        const records: OilBurstShardFadeMaterialRecord[] = [];
        for (let r = 0; r < renderers.length; r++) {
            const renderer = renderers[r];
            if (!renderer?.isValid) {
                continue;
            }
            const originalMaterials = [...renderer.sharedMaterials];
            const runtimeMaterials: (Material | null)[] = [];
            let hasRuntimeMaterial = false;
            for (let i = 0; i < originalMaterials.length; i++) {
                const original = originalMaterials[i];
                if (!original) {
                    runtimeMaterials[i] = null;
                    continue;
                }
                const runtimeMaterial = new Material();
                runtimeMaterial.copy(burstTemplate);
                this.copyOilBurstBaseProperties(original, runtimeMaterial);
                runtimeMaterial.setProperty("burstProgress", 0);
                runtimeMaterial.setProperty("burstWidth", 0.003);
                runtimeMaterial.setProperty("burstOffset", 0.0015);
                runtimeMaterials[i] = runtimeMaterial;
                renderer.setSharedMaterial(runtimeMaterial, i);
                hasRuntimeMaterial = true;
            }
            if (hasRuntimeMaterial) {
                records.push({ renderer, originalMaterials, runtimeMaterials });
            }
        }
        return records;
    }

    private applyOilBurstShardFadeProgress(records: OilBurstShardFadeMaterialRecord[], progress: number): void {
        const clampedProgress = Math.max(0, Math.min(1, progress));
        for (let r = 0; r < records.length; r++) {
            const record = records[r];
            if (!record.renderer?.isValid) {
                continue;
            }
            for (let i = 0; i < record.runtimeMaterials.length; i++) {
                const material = record.runtimeMaterials[i];
                if (!material) {
                    continue;
                }
                material.setProperty("burstProgress", clampedProgress);
            }
        }
    }

    private restoreOilBurstShardFadeMaterials(records: OilBurstShardFadeMaterialRecord[]): void {
        for (let r = 0; r < records.length; r++) {
            const record = records[r];
            if (record.renderer?.isValid) {
                for (let i = 0; i < record.originalMaterials.length; i++) {
                    record.renderer.setSharedMaterial(record.originalMaterials[i], i);
                }
            }
            for (let i = 0; i < record.runtimeMaterials.length; i++) {
                record.runtimeMaterials[i]?.destroy();
            }
        }
    }

    private getOilBurstShardBaseSize(node: Node): number {
        const renderers: MeshRenderer[] = [];
        this.collectMeshRenderers(node, renderers);
        for (let i = 0; i < renderers.length; i++) {
            const worldBounds = (renderers[i] as any)?.model?.worldBounds;
            const halfExtents = worldBounds?.halfExtents;
            if (halfExtents) {
                return Math.max(0.34, Math.min(1.45, Math.max(halfExtents.x, halfExtents.y, halfExtents.z) * 0.95));
            }
        }
        return 0.55;
    }

    private getOilBurstShardWorldCenter(node: Node): Vec3 {
        const renderers: MeshRenderer[] = [];
        this.collectMeshRenderers(node, renderers);
        for (let i = 0; i < renderers.length; i++) {
            const worldBounds = (renderers[i] as any)?.model?.worldBounds;
            const center = worldBounds?.center;
            if (center) {
                return v3(center.x, center.y, center.z);
            }
        }
        return node.worldPosition.clone();
    }

    private getOilBurstShardDirection(index: number, burstCenter?: Vec3, shardWorldPos?: Vec3): Vec3 {
        let x = 0;
        let y = 0;
        let z = 0;

        if (burstCenter && shardWorldPos) {
            x = shardWorldPos.x - burstCenter.x;
            y = shardWorldPos.y - burstCenter.y;
            z = shardWorldPos.z - burstCenter.z;
        }

        let len = Math.sqrt(x * x + y * y + z * z);
        if (len < 0.0001) {
            const count = Math.max(1, PropArms.oilBurstShardCount);
            const t = (index + 0.5) / count;
            const goldenAngle = Math.PI * (3 - Math.sqrt(5));
            y = 1 - 2 * t;
            const radius = Math.sqrt(Math.max(0, 1 - y * y));
            const angle = index * goldenAngle;
            x = Math.cos(angle) * radius;
            z = Math.sin(angle) * radius;
            y = y * 0.62 + 0.24;
        } else {
            x /= len;
            y /= len;
            z /= len;
            y = y * 0.74 + 0.2;
        }

        len = Math.max(0.0001, Math.sqrt(x * x + y * y + z * z));
        return v3(x / len, y / len, z / len);
    }

    private createOilBurstShardMesh(size: number, index: number) {
        const shapePresets = [
            { outerRadius: 1.38, shellThickness: 0.1, halfHeight: 0.62, angleSpan: 24, segmentCount: 2, tilt: -0.08, uvBand: 0.08, uvWidth: 0.12 },
            { outerRadius: 1.52, shellThickness: 0.14, halfHeight: 0.34, angleSpan: 34, segmentCount: 3, tilt: 0.05, uvBand: 0.22, uvWidth: 0.12 },
            { outerRadius: 1.44, shellThickness: 0.09, halfHeight: 0.48, angleSpan: 28, segmentCount: 2, tilt: 0.16, uvBand: 0.42, uvWidth: 0.12 },
            { outerRadius: 1.3, shellThickness: 0.16, halfHeight: 0.42, angleSpan: 32, segmentCount: 2, tilt: -0.18, uvBand: 0.58, uvWidth: 0.12 },
        ];
        const preset = shapePresets[index % shapePresets.length];
        const outerRadius = size * preset.outerRadius;
        const shellThickness = size * preset.shellThickness;
        const innerRadius = Math.max(outerRadius - shellThickness, outerRadius * 0.58);
        const halfHeight = size * preset.halfHeight;
        const segmentCount = preset.segmentCount;
        const angleSpan = preset.angleSpan * Math.PI / 180;
        const startAngle = -angleSpan * 0.5;

        const outerBottom: number[][] = [];
        const outerTop: number[][] = [];
        const innerBottom: number[][] = [];
        const innerTop: number[][] = [];

        for (let i = 0; i <= segmentCount; i++) {
            const ratio = i / segmentCount;
            const angle = startAngle + angleSpan * ratio;
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);
            const tiltOffset = preset.tilt * size * (ratio - 0.5);
            const topOffset = tiltOffset * 0.6;
            outerBottom.push([cosA * outerRadius, -halfHeight + tiltOffset, sinA * outerRadius]);
            outerTop.push([cosA * outerRadius, halfHeight + topOffset, sinA * outerRadius]);
            innerBottom.push([cosA * innerRadius, -halfHeight + tiltOffset * 0.8, sinA * innerRadius]);
            innerTop.push([cosA * innerRadius, halfHeight + topOffset * 0.8, sinA * innerRadius]);
        }

        const positions: number[] = [];
        const uvs: number[] = [];
        const normals: number[] = [];
        const tangents: number[] = [];
        const indices: number[] = [];
        const u0 = preset.uvBand;
        const v0 = index % 2 === 0 ? 0.16 : 0.5;
        const u1 = Math.min(0.96, u0 + preset.uvWidth);
        const v1 = Math.min(0.9, v0 + 0.26);
        const sideUvs = [
            u0 + 0.04, v1,
            u1 - 0.04, v1,
            u0 + 0.04, v0,
            u1 - 0.04, v0,
        ];
        const pushFace = (a: number[], b: number[], c: number[], d: number[], faceUvs: number[]) => {
            const start = positions.length / 3;
            positions.push(...a, ...b, ...c, ...d);
            uvs.push(...faceUvs);

            const abx = b[0] - a[0];
            const aby = b[1] - a[1];
            const abz = b[2] - a[2];
            const acx = c[0] - a[0];
            const acy = c[1] - a[1];
            const acz = c[2] - a[2];
            let nx = aby * acz - abz * acy;
            let ny = abz * acx - abx * acz;
            let nz = abx * acy - aby * acx;
            const len = Math.max(0.0001, Math.sqrt(nx * nx + ny * ny + nz * nz));
            nx /= len;
            ny /= len;
            nz /= len;
            normals.push(nx, ny, nz, nx, ny, nz, nx, ny, nz, nx, ny, nz);
            tangents.push(1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1);
            indices.push(start, start + 1, start + 2, start + 2, start + 1, start + 3);
            indices.push(start + 2, start + 1, start, start + 3, start + 1, start + 2);
        };

        for (let i = 0; i < segmentCount; i++) {
            const uStart = u0 + (u1 - u0) * (i / segmentCount);
            const uEnd = u0 + (u1 - u0) * ((i + 1) / segmentCount);
            const mainUvs = [
                uStart, v1,
                uEnd, v1,
                uStart, v0,
                uEnd, v0,
            ];

            pushFace(outerBottom[i], outerBottom[i + 1], outerTop[i], outerTop[i + 1], mainUvs);
            pushFace(innerBottom[i + 1], innerBottom[i], innerTop[i + 1], innerTop[i], mainUvs);
            pushFace(outerTop[i], outerTop[i + 1], innerTop[i], innerTop[i + 1], sideUvs);
            pushFace(innerBottom[i], innerBottom[i + 1], outerBottom[i], outerBottom[i + 1], sideUvs);
        }

        pushFace(outerBottom[0], innerBottom[0], outerTop[0], innerTop[0], sideUvs);
        pushFace(innerBottom[segmentCount], outerBottom[segmentCount], innerTop[segmentCount], outerTop[segmentCount], sideUvs);

        const bound = outerRadius + shellThickness;
        return utils.createMesh({
            positions,
            normals,
            tangents,
            uvs,
            indices,
            minPos: { x: -bound, y: -bound, z: -bound },
            maxPos: { x: bound, y: bound, z: bound },
        });
    }

    private createOilBurstMaterialRecords(node: Node): OilBurstMaterialRecord[] {
        const burstTemplate = PropArms.oilBurstMaterial;
        if (!burstTemplate) {
            PropArms.preloadOilBurstMaterial();
            return [];
        }

        const renderers: MeshRenderer[] = [];
        this.collectMeshRenderers(node, renderers);

        const records: OilBurstMaterialRecord[] = [];
        for (let r = 0; r < renderers.length; r++) {
            const renderer = renderers[r];
            if (!renderer || !renderer.isValid) {
                continue;
            }

            const originalMaterials = [...renderer.sharedMaterials];
            const burstMaterials: (Material | null)[] = [];
            let hasBurstMaterial = false;

            for (let i = 0; i < originalMaterials.length; i++) {
                const original = originalMaterials[i];
                if (!original) {
                    burstMaterials[i] = null;
                    continue;
                }

                const burst = new Material();
                burst.copy(burstTemplate);
                this.copyOilBurstBaseProperties(original, burst);
                burst.setProperty("burstProgress", 0);
                burst.setProperty("burstWidth", 0.003);
                burst.setProperty("burstOffset", 0.0015);
                burstMaterials[i] = burst;
                renderer.setSharedMaterial(burst, i);
                hasBurstMaterial = true;
            }

            if (hasBurstMaterial) {
                records.push({ renderer, originalMaterials, burstMaterials });
            }
        }
        return records;
    }

    private collectMeshRenderers(node: Node, out: MeshRenderer[]): void {
        if (!node) {
            return;
        }

        const meshRenderer = node.getComponent(MeshRenderer);
        if (meshRenderer) {
            out.push(meshRenderer);
        }

        for (let i = 0; i < node.children.length; i++) {
            this.collectMeshRenderers(node.children[i], out);
        }
    }

    private copyOilBurstBaseProperties(source: Material, target: Material): void {
        this.copyOilBarrelBaseProperties(source, target);
    }

    private copyOilBarrelBaseProperties(source: Material, target: Material): void {
        const texture = this.getMaterialProperty(source, "mainTexture");
        if (texture) {
            target.setProperty("mainTexture", texture);
        }

        const color = this.getMaterialProperty(source, "mainColor");
        if (color) {
            target.setProperty("mainColor", color);
        }
    }

    private applyOilHitFlashProgress(progress: number): void {
        const value = Math.max(0, Math.min(1, progress));
        for (let r = 0; r < this.oilHitFlashRecords.length; r++) {
            const record = this.oilHitFlashRecords[r];
            if (!record.renderer || !record.renderer.isValid) {
                continue;
            }
            for (let i = 0; i < record.flashMaterials.length; i++) {
                const material = record.flashMaterials[i];
                if (material && material !== record.originalMaterials[i]) {
                    material.setProperty("flashProgress", value);
                }
            }
        }
    }

    private restoreOilHitFlashMaterials(): void {
        FlashRedManager.instance.stopFlashRed(this.node);
    }

    private getMaterialProperty(material: Material, propName: string): any {
        try {
            const getter = (material as any).getProperty;
            if (typeof getter === "function") {
                return getter.call(material, propName);
            }
        } catch (err) {
            return null;
        }
        return null;
    }

    private applyOilBurstProgress(records: OilBurstMaterialRecord[], progress: number): void {
        const value = Math.max(0, Math.min(1, progress));
        for (let r = 0; r < records.length; r++) {
            const record = records[r];
            if (!record.renderer || !record.renderer.isValid) {
                continue;
            }
            for (let i = 0; i < record.burstMaterials.length; i++) {
                const material = record.burstMaterials[i];
                if (material) {
                    material.setProperty("burstProgress", value);
                }
            }
        }
    }

    private restoreOilBurstMaterials(records: OilBurstMaterialRecord[]): void {
        for (let r = 0; r < records.length; r++) {
            const record = records[r];
            if (record.renderer && record.renderer.isValid) {
                record.renderer.sharedMaterials = [];
                record.renderer.sharedMaterials = record.originalMaterials;
            }

            for (let i = 0; i < record.burstMaterials.length; i++) {
                const material = record.burstMaterials[i];
                if (material && material.isValid) {
                    material.destroy();
                }
            }
        }
    }

    private findFirstMeshRenderer(node: Node): MeshRenderer | null {
        if (!node) {
            return null;
        }
        const meshRenderer = node.getComponent(MeshRenderer);
        if (meshRenderer) {
            return meshRenderer;
        }
        for (let i = 0; i < node.children.length; i++) {
            const childMeshRenderer = this.findFirstMeshRenderer(node.children[i]);
            if (childMeshRenderer) {
                return childMeshRenderer;
            }
        }
        return null;
    }

    private initLalian() {
        this.lalianNode = this.findNodeByName(this.node, "Lalian");
        this.lalianCube = null;
        this.lalianSegments.length = 0;
        this.lalianSegmentChildStartPos.length = 0;
        this.lalianHitIndex = 0;
        this.lalianSegmentHitStep = 0;
        this.lalianAnimating = false;
        this.lalianFinished = false;
        this.hasLalian = false;
        if (!this.lalianNode) {
            return;
        }

        this.lalianCube = this.findNodeByName(this.lalianNode, "Cube");
        if (this.lalianCube) {
            this.lalianCube.active = true;
            this.lalianCubeStartScale.set(this.lalianCube.scale);
            this.lalianCube.setScale(this.lalianCubeStartScale);
        }

        const segmentNodes: Node[] = [];
        for (let i = 0; i < this.lalianNode.children.length; i++) {
            const child = this.lalianNode.children[i];
            if (!child || child === this.lalianCube || child.name === "Cube" || child.children.length <= 0) {
                continue;
            }
            segmentNodes.push(child);
        }

        const desiredCount = this.lalianNodeCount > 0 ? this.lalianNodeCount : segmentNodes.length;
        if (desiredCount > segmentNodes.length && segmentNodes.length > 0) {
            const template = segmentNodes[0];
            const basePos = template.position;
            for (let i = segmentNodes.length; i < desiredCount; i++) {
                const node = instantiate(template);
                node.name = `${template.name}_${i}`;
                this.lalianNode.addChild(node);
                node.setPosition(basePos.x, basePos.y, basePos.z + this.lalianNodeSpacingZ * i);
                segmentNodes.push(node);
            }
        }

        for (let i = 0; i < segmentNodes.length; i++) {
            segmentNodes[i].active = i < desiredCount;
        }

        for (let i = 0; i < desiredCount && i < segmentNodes.length; i++) {
            const child = segmentNodes[i];
            this.lalianSegments.push(child);
            const startPosList: Vec3[] = [];
            for (let j = 0; j < child.children.length; j++) {
                const part = child.children[j];
                const startPos = part.position.clone();
                startPosList.push(startPos);
                Tween.stopAllByTarget(part);
                part.setPosition(startPos);
            }
            this.lalianSegmentChildStartPos.push(startPosList);
        }

        this.hasLalian = !!this.lalianCube && this.lalianSegments.length > 0;
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

    private selectArms() {

    }



    start() {
        PropArms.preloadOilBurstMaterial();
        PropArms.preloadOilHitFlashMaterial();
        if (!this._disableWaveStageChain) {
            EventManager.instance.on(EventType.MONSTER_WAVE_STAGE, this.onMonsterWaveStage, this);
        }
        this.init(0);
        // this.effect.node.active = false;
    }

    @property({ type: CCFloat, displayName: '承载物浮动速度', tooltip: '武器存活时，石板/承载节点上下浮动的速度。' })
    public speed: number = 1;

    @property({ type: CCFloat, displayName: '承载物浮动幅度', tooltip: '武器存活时，石板/承载节点上下浮动的高度幅度。' })
    public h: number = 0.2;
    private _time: number = 0;
    private isWallH: boolean = false;
    private _pendingWaveStageCount: number = 0;
    private _isStageAlive: boolean = false;
    private _stageSpawnPos: Vec3 = new Vec3();
    private _fixedStageIndex: number = -1;
    private _disableWaveStageChain: boolean = false;

    public setFixedStage(stageIndex: number) {
        this._fixedStageIndex = Math.max(0, stageIndex);
        this._disableWaveStageChain = true;
        this._pendingWaveStageCount = 0;
        this._level = this._fixedStageIndex;
    }

    public bindFixedStageRuntime(stageIndex: number, visualRoot: Node | null, fbx: FbxManager | null): void {
        if (stageIndex < 0 || stageIndex >= this.armsInfoList.length) {
            return;
        }
        const arms = this.armsInfoList[stageIndex];
        if (!arms) {
            return;
        }
        arms.runtimeVisualRoot = visualRoot;
        if (fbx) {
            arms.fbx = fbx;
        }
    }

    public applyRoleLayoutReference(bottomBaseRef: Node | null, armsRef: Node | null): void {
        this.roleTemplateLayoutLoaded = true;
        this.hasRoleTemplateLayout = false;

        if (bottomBaseRef?.isValid) {
            this.node.inverseTransformPoint(this.roleTemplateBottomBasePos, bottomBaseRef.worldPosition);
            this.hasRoleTemplateLayout = true;
        }
        if (armsRef?.isValid) {
            this.node.inverseTransformPoint(this.roleTemplateArmsPos, armsRef.worldPosition);
            this.hasRoleTemplateLayout = true;
        }
    }

    public getBlockCollisionHalfZ() {
        const tireDepth = this.tireScale?.z || this.tireScale?.x || 1;
        const tireHalfZ = tireDepth * 0.5;
        return Math.max(this.collisionHalfZ, tireHalfZ, 0.9);
    }

    protected onDestroy(): void {
        this.clearWeaponVisualHitPulseState(false);
        this.restoreOilHitFlashMaterials();
        EventManager.instance.off(EventType.MONSTER_WAVE_STAGE, this.onMonsterWaveStage);
    }

    _update(deltaTime: number) {
        const dt = deltaTime;
        // 石板浮动
        const visualRoot = this.getCurrentArmsVisualRoot(this._curArms);
        if (this.isWallH && this.wallNode && visualRoot) {
            this._time += dt * this.speed;
            const curY = visualRoot.y + this._curArms.wallHeight + Math.sin(this._time) * this.h;
            this.wallNode.y = curY;
        }

        // 轮胎平滑插值到正确位置
        this._updateTireDrop(dt);
        this.updateBottomBaseRoll(dt);
        this.updateWeaponVisualHitPulse(dt);

        // _isShake冷却（非销毁受击用）
        if (this._shakeCooldown > 0) {
            this._shakeCooldown -= dt;
            if (this._shakeCooldown <= 0) {
                this._isShake = false;
            }
        }
    }

    private onMonsterWaveStage() {
        if (this._disableWaveStageChain) {
            return;
        }
        this._pendingWaveStageCount++;
        this.trySpawnNextStage();
    }

    private queueTrySpawnNextStage() {
        if (this._disableWaveStageChain) {
            return;
        }
        if (this._pendingWaveStageCount <= 0 || this._isStageAlive) {
            return;
        }
        this.scheduleOnce(() => {
            this.trySpawnNextStage();
        }, this.nextStageDelay);
    }

    private trySpawnNextStage() {
        if (this._disableWaveStageChain) {
            return;
        }
        if (this._isStageAlive || this._pendingWaveStageCount <= 0) {
            return;
        }
        if (this._level >= this.armsInfoList.length - 1) {
            this._pendingWaveStageCount = 0;
            this.node.active = false;
            return;
        }
        this._pendingWaveStageCount--;
        this.resetStagePosition();
        this.node.active = true;
        this.init(1);
    }

    private resetStagePosition() {
        const worldPos = this.node.worldPosition;
        const frontZ = MonsterCreate.instance?.getFrontMonsterWorldZ(worldPos.z) ?? worldPos.z;
        this._stageSpawnPos.set(worldPos.x, worldPos.y, frontZ - this.waveFrontGap);
        this.node.setWorldPosition(this._stageSpawnPos);
    }

    private getCurrentArmsVisualRoot(arms: ArmsInfo | null): Node | null {
        if (!arms) {
            return null;
        }
        return arms.runtimeVisualRoot?.isValid ? arms.runtimeVisualRoot : null;
    }


}
