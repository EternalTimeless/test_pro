import { _decorator, CCBoolean, CCFloat, CCInteger, Color, Component, Label, MeshRenderer, Node, Tween, tween, v3, Vec3 } from 'cc';
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
const { ccclass, property } = _decorator;

enum AnimArms {
    idle,
    up_ju,
    up_out
}


@ccclass('ArmsInfo')
export class ArmsInfo {
    @property({ type: ArmsTypeEnum })
    public armsType: ArmsTypeEnum = ArmsTypeEnum.bq;
    @property(FbxManager)
    public fbx: FbxManager = null;
    @property(CCInteger)
    public tireCount: number = 3;
    @property(CCInteger)
    public hp: number = 3;
    @property(CCInteger)
    public moveCount: number = 5;
    @property(CCBoolean)
    public isCanMove: boolean = true;
    @property({ type: CCFloat, visible(this: ArmsInfo) { return !this.isCanMove; } })
    public canHeight: number = 0;
    @property({ type: CCFloat, visible(this: ArmsInfo) { return !this.isCanMove; } })
    public canTireCount: number = 0;
    @property(CCFloat)
    public wallHeight: number = 0.5;

}


@ccclass('PropArms')
export class PropArms extends BattleTarget3D {

    @property(ArmsInfo)
    public armsInfoList: ArmsInfo[] = [];

    @property(Label)
    public hpLabel: Label = null;

    private _curArms: ArmsInfo;

    private tireList: Node[] = [];

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

    @property(Vec3)
    private tireScale: Vec3 = new Vec3();
    // private

    @property(CCFloat)
    private tireSpacing: number = 0.2;

    @property(CCFloat)
    public jumpHeight: number = 0.5;

    // @property(AttackParkPlay)
    // public effect: AttackParkPlay;
    @property(CCFloat)
    public animScale: number = 1;
    @property(Node)
    public wallNode: Node;

    @property(Vec3)
    public jumpWallPos: Vec3 = new Vec3();
    @property(Node)
    public wallEffect: Node;

    // @property(Node)
    // public effect_ss: Node;

    protected damage(power: number): void {
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
        Tween.stopAllByTarget(this._curArms.fbx.node);
        // const time = this._curArms.fbx.setAnimation(AnimArms.up_out, false).duration;
        // const halfTime = time * 0.5;

        // FBX动画结束后切回idle，发送全局事件让人跳走
        // this.scheduleOnce(() => {
        EventManager.instance.emit(EventType.PROP_ARMS_DIE, this._curArms);
        // this._curArms.fbx.setAnimation(AnimArms.up_ju, true);
        // }, time * 0.8);

        // 石板三段式动画：抛起→人跳走→落下砸地
        tween(this.wallNode)
            // .delay(halfTime)
            .call(() => {
                this.isWallH = false;
                // 锁定到浮动基准中心，消除sin相位差异
                const baseY = this._curArms.fbx.node.y + this._curArms.wallHeight;
                this.wallNode.y = baseY;

                // 运行时捕获位置
                const throwY = this.wallNode.y + 3;
                const groundY = 0.862;

                tween(this.wallNode)
                    .to(0.3, { y: throwY }, { easing: 'sineOut' })
                    .to(0.4, { y: groundY }, { easing: 'sineIn' })
                    .call(() => {
                        this.node.emit(EventType.PROP_ARMS_DIE, this._curArms);
                        this.scheduleOnce(() => {

                            EventManager.instance.emit(EventType.MONSTER_SKILL_XRD, this.wallNode.worldPositionX, 6, this._curArms.moveCount / 8 * 3.5);
                        }, 0.1);
                        CameraMove.instance.Shake2(2);
                        AudioManager.inst.playOneShot(SoundEnum.Sound_downST);
                        this.wallEffect.active = true;
                        for (let i = 0; i < this.wallEffect.children.length; i++)
                            this.wallEffect.children[i].getComponent(AttackParkPlay)?.play();
                        this.isWallH = false;
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
        Tween.stopAllByTarget(this._curArms.fbx.node);
        const delay = 0.05 + this.tireList.length * 0.05;
        const fbxY = this._curArms.fbx.node.y;
        const bounceH = this.jumpHeight + this.tireList.length * 0.1 * this.jumpHeight;
        let dropOffset = -this.tireSpacing;
        if (!this._curArms.isCanMove && this.tireList.length > this._curArms.canTireCount) {
            dropOffset = 0;
        }
        tween(this._curArms.fbx.node)
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
        if (this._level >= this.armsInfoList.length) {
            this.node.active = false;
        } else {
            for (let i = 0; i < this.armsInfoList.length; i++) {
                this.armsInfoList[i].fbx.node.active = i === this._level;
            }
            this._curArms = this.armsInfoList[this._level];

            const tireSpacing = this.tireSpacing;
            const wallHeight = this._curArms.wallHeight;
            const tireCount = this._curArms.tireCount;

            this.initHp(this._curArms.hp);
            this.hpLabel.string = Math.round(this.MaxHp).toString();

            // 保存hpLabel原始缩放（用number避免GC），动画期间隐藏
            const hpS = this.hpLabel.node.scale;
            const hplSx = hpS.x, hplSy = hpS.y, hplSz = hpS.z;
            this.hpLabel.node.setScale(0, 0, 0);

            // 保存FBX原始scale（复用PoolManager的V3避免GC）
            const scale = PoolManager.instance.V3.set(this._curArms.fbx.node.scale);

            // 初始位置: 石板在地面, FBX在地下
            this.wallNode.x = 0;
            this._curArms.fbx.node.y = -1;
            this._curArms.fbx.node.setScale(Vec3.ZERO);
            this._curArms.fbx.setAnimation(AnimArms.idle, true);
            this.isWallH = false;

            // 生成所有轮胎（起始在地底）
            for (let i = 0; i < tireCount; i++) {
                const tire = this.tire;
                this.tireList.push(tire);
                this.node.addChild(tire);
                tire.setPosition(0, -tireSpacing, 0);
                if (!i)
                    this.meshFlashDataList[0].meshRender = tire.children[0].children[0].getComponent(MeshRenderer);
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
            tween(this.wallNode)
                .delay(phase1Delay)
                .to(phase1RiseTime, { y: wallPhase1TargetY }, { easing: "backOut" })
                .start();

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
                    tween(this.wallNode)
                        .delay(liftDelay)
                        .to(liftTime, { y: targetWallY }, { easing: "backOut" })
                        .start();
                }
            }

            // 计算总动画时长，结束后统一处理
            const totalTime = tireStartDelay + (tireCount - 1) * tireInterval + tireRiseTime + 0.05;
            this.scheduleOnce(() => {
                this.hpLabel.node.setScale(hplSx, hplSy, hplSz);
                PoolManager.instance.V3 = scale;
                BulletMonsterCollisionManager.instance.registerTarget(this);
                this.isWallH = true;
            }, totalTime);
        }
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

    private selectArms() {

    }



    start() {
        this.init(0);
        // this.effect.node.active = false;
    }

    @property(CCFloat)
    public speed: number = 1;
    @property(CCFloat)
    public h: number = 0.2;
    private _time: number = 0;
    private isWallH: boolean = false;

    _update(deltaTime: number) {
        const dt = deltaTime;
        // 石板浮动
        if (this.isWallH) {
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


}