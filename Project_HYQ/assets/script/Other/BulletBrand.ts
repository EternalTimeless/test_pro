import { _decorator, CCFloat, CCInteger, easing, Label, MeshRenderer, Node, tween, Tween, v3, Vec3 } from 'cc';
import { CharacterBase } from '../Battle/CharacterBase';
import { CharacterStatus } from '../Common/CommonEnum';
import { DamageSource, GameInfo } from '../Common/GameInfo';

const { ccclass, property } = _decorator;

/** 死亡后埋入地下的世界 Y */
const BURIED_WORLD_Y = -3;

/** 子弹翻倍牌：玩家子弹穿过时批次翻倍生成，可被怪物攻击，支持复活 */
@ccclass('BulletBrand')
export class BulletBrand extends CharacterBase {

    @property({ type: Label, tooltip: '倍率标签' })
    lab_multiple: Label = null!;

    @property({ type: CCInteger, displayName: '子弹翻倍倍率' })
    multipleNum: number = 2;

    @property({ type: CCFloat, displayName: '额外子弹横向间距' })
    spawnSpacing: number = 0.25;

    @property({ type: CCFloat, displayName: '额外子弹生成Z偏移' })
    passSpawnOffsetZ: number = 0.1;

    @property({ type: CCFloat, displayName: '倾倒动画时长(秒)' })
    knockdownDuration: number = 0.35;

    @property({ type: Vec3, displayName: '倾倒目标局部欧拉角(占位)' })
    deadLocalEuler: Vec3 = v3(0, 0, 0);

    @property({ type: CCFloat, displayName: '复活升起时长(秒)' })
    reviveRiseDuration: number = 0.5;

    private readonly _originalEuler: Vec3 = new Vec3();
    private readonly _originalScale: Vec3 = new Vec3();
    private readonly _spawnWorldPos: Vec3 = new Vec3();
    private _deathHandled: boolean = false;
    private _isBuried: boolean = false;

    private static _instances: BulletBrand[] = [];

    onLoad() {
        super.onLoad();
        if (this.ModelNode) {
            this._originalEuler.set(this.ModelNode.eulerAngles);
            this._originalScale.set(this.ModelNode.scale);
        }
        this.node.getWorldPosition(this._spawnWorldPos);
        BulletBrand._instances.push(this);
    }

    protected onDestroy(): void {
        const idx = BulletBrand._instances.indexOf(this);
        if (idx >= 0) {
            BulletBrand._instances.splice(idx, 1);
        }
    }

    protected onEnable(): void {
        if (this._isBuried) {
            return;
        }
        super.initData();
        this._deathHandled = false;
        this.refreshMultipleLabel();
        this.resetModelPose();
    }

    update(dt: number) {
        if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin || this.isDead) {
            return;
        }
    }

    /** 游戏重开时复活场景中所有翻倍牌 */
    public static reviveAll(): void {
        for (let i = 0; i < BulletBrand._instances.length; i++) {
            const brand = BulletBrand._instances[i];
            if (brand.isDead || brand._isBuried) {
                brand.onRevive();
            }
        }
    }

    public refreshMultipleLabel() {
        if (!this.lab_multiple) {
            return;
        }
        const num = Math.max(1, this.multipleNum);
        this.lab_multiple.string = `x${num}`;
    }

    /** 玩家子弹命中：穿透翻倍由 SimulationCollisionManager 批次处理 */
    public onBulletHit(_damage: number, _from: Node): void {
    }

    public onHurt(damage: number, damageSource?: DamageSource): boolean {
        if (this.isDead || this._isBuried) {
            return false;
        }
        return super.onHurt(damage, damageSource);
    }

    public onRevive(percent?: number) {
        super.onRevive(percent);
        this._deathHandled = false;
        this._isBuried = false;

        Tween.stopAllByTarget(this.node);
        if (this.ModelNode) {
            Tween.stopAllByTarget(this.ModelNode);
        }

        this.node.active = true;
        this.node.setWorldPosition(this._spawnWorldPos.x, BURIED_WORLD_Y, this._spawnWorldPos.z);
        this.resetModelPose();

        const riseTarget = this._spawnWorldPos.clone();
        tween(this.node)
            .to(this.reviveRiseDuration, { worldPosition: riseTarget }, { easing: easing.quadOut })
            .call(() => {
                if (this.statusComp) {
                    this.statusComp.changeState(CharacterStatus.Idle);
                }
            })
            .start();

        if (this.ModelNode) {
            const scaleUp = this._originalScale.clone().multiplyScalar(1.35);
            tween(this.ModelNode)
                .to(this.reviveRiseDuration * 0.6, { scale: scaleUp }, { easing: easing.quadOut })
                .to(this.reviveRiseDuration * 0.4, { scale: this._originalScale }, { easing: easing.backOut })
                .start();
        }
    }

    protected getDissolveMeshRenderer(): MeshRenderer | null {
        return null;
    }

    protected onDeadEnter() {
        this.stopActiveMovement();
        this.playKnockdownTween(() => this.buryAfterDeath());
    }

    private resetModelPose() {
        if (!this.ModelNode) {
            return;
        }
        this.ModelNode.setRotationFromEuler(this._originalEuler);
        this.ModelNode.setScale(this._originalScale);
    }

    private playKnockdownTween(onComplete: () => void) {
        if (!this.ModelNode) {
            onComplete();
            return;
        }
        Tween.stopAllByTarget(this.ModelNode);
        tween(this.ModelNode)
            .to(this.knockdownDuration, {
                eulerAngles: this.deadLocalEuler.clone(),
            }, { easing: easing.quadOut })
            .call(onComplete)
            .start();
    }

    private buryAfterDeath() {
        if (this._deathHandled) {
            return;
        }
        this._deathHandled = true;
        this._isBuried = true;

        const wp = this.node.worldPosition;
        this.node.setWorldPosition(wp.x, BURIED_WORLD_Y, wp.z);
        this.node.active = false;
    }

    getPotentialTargets(): CharacterBase[] {
        return [];
    }

    castSkillEffect() {
    }
    @property({ displayName: '碰撞半宽' })
    private HalfX: number = 1.8;
    get collisionHalfX(): number {
        return this.HalfX;
    }

    get collisionHalfZ(): number {
        return 0.2;
    }
}
