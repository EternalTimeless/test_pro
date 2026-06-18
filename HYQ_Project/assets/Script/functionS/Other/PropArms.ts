import { _decorator, CCBoolean, CCFloat, CCInteger, Color, Component, instantiate, Label, MeshRenderer, Node, Tween, tween, v3, Vec3 } from 'cc';
import { BattleTarget3D } from '../Battle/BattleTarger/BattleTarget3D';
import BulletMonsterCollisionManager from '../Battle/BulletMonsterCollisionManager';
import PoolManager from '../../Base/PoolManager';
import { ArmsTypeEnum, EventType, OtherPrefabsEnum, PoolEnum, PrefabsEnum, SoundEnum } from '../../Base/EnumList';
import { PrefabsManager } from '../../Base/PrefabsManager';
import TweenTool from '../../Tool/TweenTool';
import EventManager from '../../Base/EventManager';
import { AttackParkPlay } from '../Battle/Battle3D/AttackParkPlay';
import { FlashRedManager } from '../Battle/Base/FlashRedManager';
import AudioManager from '../../Base/AudioManager';
import { count } from 'console';
import { FbxManager } from '../SkAnim/FbxManager';
import { JumpManager } from '../Jump/JumpManager';
import { CameraMove } from '../../Base/CameraMove';
import { MonsterCreate } from '../Monster/MonsterCreate';
const { ccclass, property } = _decorator;

enum AnimArms {
    idle,
    up_ju,
    up_out
}


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

}


@ccclass('PropArms')
export class PropArms extends BattleTarget3D {

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

    // @property(Node)
    // public effect_ss: Node;

    public get hitNode() {
        if (this.hasLalian && this.lalianCube) {
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
        } else if (!this._isShake && this.tireList.length > 0) {
            // 没销毁轮胎：所有轮胎波浪缩放+闪红
            this._isShake = true;
            this._playBottomTireHit();
            TweenTool.scaleShake(this.hpLabel.node);
            this.flashRed();
        }
        this.hpLabel.string = Math.round(this.curHp).toString();
    }

    public flashRed(duration: number = 0.15, flashColor: Color | null = null, ground: string = null): void {
        FlashRedManager.instance.flashRed(this.node, this.meshFlashDataList, duration, flashColor, ground);
    }
    protected die(): void {

        this._isShake = false;
        BulletMonsterCollisionManager.instance.unregisterTarget(this);

        // 轮胎依次破碎消失
        for (let i = 0; i < this.tireList.length; i++) {
            const tire = this.tireList[i];
            Tween.stopAllByTarget(tire);
            tween(tire)
                .delay(i * 0.05)
                .to(0.07, { scale: v3(1.4, 1.5, 1.4) }, { easing: 'sineOut' })
                .to(0.08, { scale: Vec3.ZERO }, { easing: 'sineIn' })
                .call(() => {
                    tire.active = false;
                    tire.setScale(Vec3.ONE);
                    PoolManager.instance.setPool(PoolEnum.Other + OtherPrefabsEnum.tire, tire);
                })
                .start();
        }
        this.tireList = [];
        this.hpLabel.string = "";
        Tween.stopAllByTarget(this._curArms?.fbx?.node);
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
                this.node.active = false;
            }
            return;
        }

        // 石板三段式动画：抛起→人跳走→落下砸地
        tween(this.wallNode)
            // .delay(halfTime)
            .call(() => {
                this.isWallH = false;
                // 锁定到浮动基准中心，消除sin相位差异
                const baseY = (this._curArms?.fbx?.node?.y ?? 0) + this._curArms?.wallHeight;
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
            tire.setScale(Vec3.ONE);

            // const s1 = PoolManager.instance.V3.set(Vec3.ONE);

            const s2 = PoolManager.instance.V3.set(Vec3.ONE).multiplyScalar(1.3);

            const s3 = PoolManager.instance.V3.set(Vec3.ONE).multiplyScalar(0.8);
            // s3.x = 0.8; s3.y = 0.8; s3.z = 0.8;

            const isLast = i >= lastIdx;
            tween(tire)
                .delay(i * staggerDelay)
                .to(0.1, { scale: s2 }, { easing: 'cubicOut' })
                .to(0.1, { scale: s3 }, { easing: 'cubicOut' })
                .to(0.1, { scale: Vec3.ONE }, { easing: 'backOut' })
                .call(() => {
                    // PoolManager.instance.V3 = s1;
                    PoolManager.instance.V3 = s2;
                    PoolManager.instance.V3 = s3;
                    if (isLast) {
                        this._isShake = false;
                        this._shakeCooldown = 0;
                    }
                })
                .start();
        }
    }

    /** 销毁一个轮胎：被销毁轮胎做果冻缩放→消失，剩余轮胎弹跳→下落 */
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
        Tween.stopAllByTarget(tire);
        tire.setScale(Vec3.ONE);

        // 捕获被销毁轮胎的MeshRenderer（flashRed是延迟应用的，必须在更新mesh引用前捕获）
        const oldMR = this.meshFlashDataList[0].meshRender;

        // 更新底部轮胎mesh引用
        if (this.tireList.length)
            this.meshFlashDataList[0].meshRender = this.tireList[0].children[0].children[0].getComponent(MeshRenderer);

        // 用旧引用闪红被销毁的轮胎（传独立数组，避免延迟应用时被新引用覆盖）
        if (oldMR && oldMR.isValid) {
            FlashRedManager.instance.flashRed(this.node, [{
                meshRender: oldMR,
                colorProps: this.meshFlashDataList[0].colorProps,
                switchProps: this.meshFlashDataList[0].switchProps,
            }]);
        }
        TweenTool.scaleShake(this.hpLabel.node);

        // 被销毁轮胎：果冻缩放→缩小消失
        const s1 = PoolManager.instance.V3.set(Vec3.ONE);
        const s2 = PoolManager.instance.V3;
        s2.set(Vec3.ONE); s2.x = 1.3; s2.y = 1.3; s2.z = 1.3;
        const s3 = PoolManager.instance.V3;
        s3.set(Vec3.ONE); s3.x = 0.6; s3.y = 0.6; s3.z = 0.6;
        const s0 = PoolManager.instance.V3.set(Vec3.ZERO);
        tween(tire)
            .to(0.06 * this.animScale, { scale: s2 }, { easing: 'cubicOut' })
            .to(0.08 * this.animScale, { scale: s3 }, { easing: 'cubicOut' })
            .to(0.08 * this.animScale, { scale: s1 }, { easing: 'backOut' })
            .to(0.08 * this.animScale, { scale: s0 }, { easing: 'sineIn' })
            .call(() => {
                tire.active = false;
                tire.setScale(Vec3.ONE);
                PoolManager.instance.setPool(PoolEnum.Other + OtherPrefabsEnum.tire, tire);
                this._isShake = false;
                PoolManager.instance.V3 = s1;
                PoolManager.instance.V3 = s2;
                PoolManager.instance.V3 = s3;
                PoolManager.instance.V3 = s0;
            })
            .start();

        // 剩余轮胎弹跳下落（上面的轮胎先跳再落）
        this._setupTireBounce();

        // FBX弹跳一下
        Tween.stopAllByTarget(this._curArms?.fbx?.node);
        const fbxNode = this._curArms?.fbx?.node;
        if (!fbxNode) return;
        const delay = 0.05 + this.tireList.length * 0.05;
        const fbxY = fbxNode.y;
        const bounceH = this.jumpHeight + this.tireList.length * 0.1 * this.jumpHeight;
        let dropOffset = -this.tireSpacing;
        if (!this._curArms.isCanMove && this.tireList.length > this._curArms.canTireCount) {
            dropOffset = 0;
        }
        tween(fbxNode)
            .delay(delay)
            .to(0.04 * this.animScale, { y: fbxY + bounceH }, { easing: 'sineOut' })
            .to(0.06 * this.animScale, { y: fbxY + dropOffset }, { easing: 'quadIn' })
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
            this._tireBounceTargetY.push(i * this.tireSpacing);
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
                const localT = this._tireBounceTimer - perDelay * i;
                if (localT <= 0) continue;
                if (localT < bounceUp) {
                    const t = localT / bounceUp;
                    tire.setPosition(0, this._tireBounceStartY[i] + this._tireBounceH[i] * Math.sin(t * Math.PI * 0.5), 0);
                } else if (localT < bounceUp + fallDown) {
                    const t = (localT - bounceUp) / fallDown;
                    const peak = this._tireBounceStartY[i] + this._tireBounceH[i];
                    tire.setPosition(0, peak + (this._tireBounceTargetY[i] - peak) * (t * t), 0);
                } else {
                    tire.setPosition(0, this._tireBounceTargetY[i], 0);
                }
            }
            if (this._tireBounceTimer > perDelay * this.tireList.length + bounceUp + fallDown) {
                this._tireBounceTimer = -1;
            }
        } else {
            // 平滑插值模式
            for (let i = 0; i < this.tireList.length; i++) {
                const tire = this.tireList[i];
                const targetY = i * this.tireSpacing;
                const curY = tire.position.y;
                const diff = targetY - curY;
                if (Math.abs(diff) > 0.001) {
                    tire.setPosition(0, curY + diff * Math.min(1, dt * 8), 0);
                } else {
                    tire.setPosition(0, targetY, 0);
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
            for (let i = 0; i < this.armsInfoList.length; i++) {
                const fbx = this.armsInfoList[i].fbx;
                if (fbx?.node) {
                    fbx.node.active = i === this._level;
                }
            }
            this._curArms = this.armsInfoList[this._level];
            if (!this._curArms?.fbx?.node) {
                this._isStageAlive = false;
                return;
            }
            this._isStageAlive = true;
            this.initLalian();

            const tireSpacing = this.tireSpacing;
            const wallHeight = this._curArms.wallHeight;
            const tireCount = this.hasLalian ? 0 : this._curArms.tireCount;

            this.initHp(this._curArms.hp);
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
            const scale = PoolManager.instance.V3.set(this._curArms.fbx.node.scale);

            // 初始位置: FBX在地下
            this._curArms.fbx.node.y = -1;
            this._curArms.fbx.node.setScale(Vec3.ZERO);
            this._curArms.fbx.setAnimation(AnimArms.idle, true);
            this.isWallH = false;

            // 生成所有轮胎（起始在地底）
            if (!this.hasLalian) {
                for (let i = 0; i < tireCount; i++) {
                    const tire = this.tire;
                    this.tireList.push(tire);
                    this.node.addChild(tire);
                    tire.setPosition(0, -tireSpacing, 0);
                    if (!i)
                        this.meshFlashDataList[0].meshRender = tire.children[0].children[0].getComponent(MeshRenderer);
                }
            }

            this._initialTireCount = this.tireList.length;

            // Phase 1: FBX从地底快速升起
            const phase1Delay = 0.05;
            const phase1RiseTime = 0.05;

            let fbxPhase1TargetY: number;
            let wallPhase1TargetY: number;
            let needTireLift: boolean;

            if (this._curArms.isCanMove) {
                fbxPhase1TargetY = 0;
                wallPhase1TargetY = wallHeight;
                needTireLift = true;
            } else {
                fbxPhase1TargetY = this._curArms.canHeight;
                wallPhase1TargetY = this._curArms.canHeight + wallHeight;
                needTireLift = false;
            }

            // FBX快速升起
            tween(this._curArms.fbx.node)
                .delay(phase1Delay)
                .call(() => { this._curArms.fbx.setAnimation(AnimArms.up_ju, true); })
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
                const tireY = i * tireSpacing;
                const tireDelay = tireStartDelay + i * tireInterval;

                // 轮胎升起
                tween(tire)
                    .delay(tireDelay)
                    .to(tireRiseTime, { y: tireY }, { easing: "backOut" })
                    .start();

                if (needTireLift) {
                    // FBX被顶起：轮胎先升起一点再顶FBX
                    const liftDelay = tireDelay - 0.02;
                    const liftTime = 0.08;
                    const targetFbxY = (i + 1) * tireSpacing;
                    const targetWallY = targetFbxY + wallHeight;

                    tween(this._curArms.fbx.node)
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
        let tire = PoolManager.instance.getPool<Node>(PoolEnum.Other + OtherPrefabsEnum.tire);
        if (!tire) {
            tire = PrefabsManager.instance.GetPrefabsIns(PrefabsEnum.other, OtherPrefabsEnum.tire);
        }
        tire.active = true;
        tire.children[0].setScale(this.tireScale);
        tire.setScale(Vec3.ONE); // Set tire scale to one
        return tire;
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

    public getBlockCollisionHalfZ() {
        const tireDepth = this.tireScale?.z || this.tireScale?.x || 1;
        const tireHalfZ = tireDepth * 0.5;
        return Math.max(this.collisionHalfZ, tireHalfZ, 0.9);
    }

    protected onDestroy(): void {
        EventManager.instance.off(EventType.MONSTER_WAVE_STAGE, this.onMonsterWaveStage);
    }

    _update(deltaTime: number) {
        const dt = deltaTime;
        // 石板浮动
        if (this.isWallH && this.wallNode && this._curArms?.fbx?.node) {
            this._time += dt * this.speed;
            const curY = this._curArms.fbx.node.y + this._curArms.wallHeight + Math.sin(this._time) * this.h;
            this.wallNode.y = curY;
        }

        // 轮胎平滑插值到正确位置
        this._updateTireDrop(dt);

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


}
