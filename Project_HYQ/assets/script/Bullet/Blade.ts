import { _decorator, ITriggerEvent, Node } from 'cc';
import { BulletBase } from './BulletBase';
import { ColliderTag } from '../Other/ColliderTag';
import { ColliderGroupTag } from '../Common/CommonEnum';
import { CharacterBase } from '../Battle/CharacterBase';
import { AudioMgr, SoundEnum } from '../Core/Managers/AudioMgr';
import { DamageSource, GameInfo } from '../Common/GameInfo';
import { CameraCtrl } from '../CharacterCtrl/CameraCtrl';

const { ccclass, property } = _decorator;

@ccclass('Blade')
export class Blade extends BulletBase {
    private damage: number = 75;
    private hasHit: boolean = false;
    private _isActive: boolean = false;
    private damageSource?: DamageSource;
    private timer: number = 0;

    /**暴击率 */
    critRate: number = 0.0;
    /**暴击伤害倍率 */
    public readonly critDamage: number = 1.5;

    /**
     * 暴击保底(Pity)：连续未暴击时累加的基础暴击率，暴击命中后清零。
     * 例如 critRate=0.01 时，第 n 次判定概率为 min(1, n * critRate)，最多 100 次内必暴。
     */
    private _critPityBonus: number = 0;
    @property({ type: [Node], tooltip: '按等级索引的子模型(Level 0..n)，留空则不做等级切换' })
    private bladeEffects: Node[] = []

    /** 按等级显示子节点； 未配置时跳过(Level-related logic skipped when empty) */
    private applyBladeEffectLevel(level: number) {
        if (!this.bladeEffects?.length) return;
        const maxIdx = this.bladeEffects.length - 1;
        const idx = Math.max(0, Math.min(level, maxIdx));
        this.bladeEffects.forEach((n, i) => {
            if (n) n.active = (i === idx);
        });
    }
    onLoad() {
        super.onLoad();
    }

    /**
     * 初始化数据
     * @param damage 刀的基础伤害值
     * @param critRate 暴击率
     * @param critDamage 暴击伤害倍率
     * @param bladeLevel 刀刃外观等级(默认 0)，仅当 bladeEffects 数组非空时生效
     * @returns 
     */
    initData(damage: number, critRate: number, damageSource?: DamageSource, bladeLevel: number = 0) {
        this.applyBladeEffectLevel(bladeLevel);
        if (!this._rigidBody) return this;
        this._isActive = true;
        this.damage = damage;
        this.damageSource = damageSource;
        this.critRate = critRate;
        return this;
    }
    update(dt: number) {
        if (!this._isActive) return;
        this.timer += dt;
    }

    /**
     * 按暴击率与保底计算最终伤害（刀光在命中时掷骰）。
     */
    rollDamage(damageValue: number): { value: number; isCritical: boolean } {
        const base = this.critRate;
        const effective = Math.min(1, base + this._critPityBonus);
        if (Math.random() < effective) {
            this._critPityBonus = 0;
            return { value: damageValue * this.critDamage, isCritical: true };
        }
        //NOTE: 暂时关闭暴击保底, 后续再优化
        // this._critPityBonus += base * 0.5;
        return { value: damageValue, isCritical: false };
    }
    // 碰撞回调
    protected onTriggerEnter(event: ITriggerEvent) {
        if (!this._isActive) return;
        const _t = event.otherCollider.node.getComponent(ColliderTag);
        if (_t && (_t.tag === ColliderGroupTag.Elite || _t.tag === ColliderGroupTag.Monster)) {
            const co = event.otherCollider.node.getComponent(CharacterBase);
            if (co) {
                const roll = this.rollDamage(this.damage);
                const src = this.damageSource ? { ...this.damageSource, isCritical: roll.isCritical } : undefined;
                if (co.onHurt(roll.value, src)) {
                    //用主角的位置作为击退方向
                    co.knockback(GameInfo.instance.player.node.worldPosition, 5);
                    GameInfo.instance.player?.triggerBladeHitDamping();
                    if (this.timer >= 0.5) {
                        this.timer = 0;
                        CameraCtrl.instance.screenShake3D(0.02, 0.1);
                    }
                }
            }
        }
    }
    /**回收 */
    recover() {
        if (!this._isActive) return;
        this._isActive = false;
        this.scheduleOnce(() => {
            app.res.recoverByPool(this.node);
        });
    }
    onDestroy() {
        this._isActive = false;
        super.onDestroy();
    }
} 