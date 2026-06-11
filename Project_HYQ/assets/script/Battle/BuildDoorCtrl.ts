import { _decorator, easing, tween, Tween, v3, Vec3, Node } from 'cc';
import { CharacterBase } from './CharacterBase';
import { DamageSource, GameInfo } from '../Common/GameInfo';

const { ccclass, property } = _decorator;

@ccclass('BuildDoorCtrl')
export class BuildDoorCtrl extends CharacterBase {

    originalScale: Vec3 = new Vec3(1, 1, 1);
    originalEuler: Vec3 = new Vec3(0, 0, 0);
    onLoad(): void {
        super.onLoad();
        this.originalScale = this.ModelNode.getScale();
        this.originalEuler = this.ModelNode.eulerAngles.clone();
    }
    updateDoorStatus(waveIndex: number) {
    }

    protected onEnable(): void {
        //每次激活组件所在节点, 可以反复触发此方法, 用于复活初始化，不能在同一帧反复执行
        super.initData();
        // console.log(this.node.uuid, ": BuildDoorCtrl onEnable");
    }
    protected onDisable(): void {
        // console.log(this.node.uuid, ": BuildDoorCtrl onDisable");
    }
    update(dt: number): void {
        super.update(dt);
    }
    public onHurt(damage: number, damageSource?: DamageSource): boolean {
        if (this.visualFeedbackComp) {
            this.visualFeedbackComp.showDamageEffect();
        }
        this.playCollectionEffect();
        if (this.battleValComp) {
            if (this.battleValComp.healthPercentage < 0.8) {
                damage *= 0.5;
            }
            if (this.battleValComp.healthPercentage < 0.6) {
                damage = 1;
            }
            if (this.battleValComp.healthPercentage < 0.4) {
                damage = 0.5;
            }
            if (this.battleValComp.healthPercentage < 0.1) {
                // 血量小于10%时, 锁血
                damage = 0;
            }
            let v = this.battleValComp.takeDamage(damage);
            return v;
        }
        return false;
    }
    protected getPotentialTargets(): CharacterBase[] {
        return [];
    }
    protected getSkillAniName(): string {
        return '';
    }
    protected castSkillEffect() { }
    /** 
     * 晃动效果
     */
    private playCollectionEffect() {
        if (this.isDead) return;
        // 停止之前在角色节点上的缩放与晃动 tween，避免叠加
        Tween.stopAllByTarget(this.ModelNode);
        // console.log('开始晃动效果');
        // 缩放效果：轻微鼓起再回到原始缩放
        tween(this.ModelNode)
            .to(0.1, {
                scale: v3(
                    this.originalScale.x * 1.01,
                    this.originalScale.y * 1.04,
                    this.originalScale.z * 1.01
                ),
            }, { easing: easing.sineOut })
            .to(0.15, { scale: this.originalScale }, { easing: easing.sineIn })
            .start();

        // 晃动效果：模拟被攻击后的轻微摆动（围绕 Z 轴的小幅阻尼摆动）
        const baseEuler = this.originalEuler.clone();
        const swingAngle = 3; // 最大摆动角度（度）

        // 每次触发前将角度重置到初始角度
        this.ModelNode.eulerAngles = baseEuler.clone();

        tween(this.ModelNode)
            .to(0.08, {
                eulerAngles: v3(baseEuler.x, baseEuler.y, baseEuler.z + swingAngle),
            }, { easing: easing.sineOut })
            .to(0.12, {
                eulerAngles: v3(baseEuler.x, baseEuler.y, baseEuler.z - swingAngle * 0.6),
            }, { easing: easing.sineInOut })
            .to(0.14, {
                eulerAngles: v3(baseEuler.x, baseEuler.y, baseEuler.z + swingAngle * 0.3),
            }, { easing: easing.sineInOut })
            .to(0.16, {
                eulerAngles: baseEuler,
            }, { easing: easing.sineOut })
            .call(() => {
                // console.log('晃动效果结束');
            })
            .start();
    }
}


