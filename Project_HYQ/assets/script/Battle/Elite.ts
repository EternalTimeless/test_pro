import { _decorator } from 'cc';
import { CharacterTag } from '../Common/CommonEnum';

import { EnemyCharacter } from './EnemyChar';
const { ccclass, property } = _decorator;

@ccclass('Elite')
export class Elite extends EnemyCharacter {
    // @property({ type: Node, displayName: '锤子拖拽特效' })
    // hammerDragEffect: Node | null = null;
    // /**特效粒子 */
    // draggingEffect: ParticleSystem[] = [];
    // @property({ type: Node, displayName: '锤子攻击节点' })
    // hammerAtkNode: Node | null = null;
    // attackRangeBg: Node | null = null;
    // attackRangeBg2: Node | null = null;
    // attackRangeProgress: Node | null = null;
    // attackRangeProgress2: Node | null = null;
    // progressOriginalScale: Vec3 = v3(1, 1, 1);
    // progressOriginalScale2: Vec3 = v3(1, 1, 1);
    /** 死亡计时器，用于没有动画时的回收 */
    private deadTimer: number = 0;
    /** 死亡后的最大存活时间（秒） */
    private readonly maxDeadTime: number = 2.0;
    /** Boss 攻击蓄力段占动画归一化进度比例（前段慢放 wind-up，增强压迫感） */
    private readonly _bossAttackWindupPhase: number = 0.4;
    /** 蓄力段相对 _attackTimeScale 的倍率（越小越慢） */
    private readonly _bossAttackWindupTimeScaleMul: number = 0.65;
    onLoad(): void {
        super.onLoad();
        if (this.CharacterTag == CharacterTag.Boss) {
            // this.attackRangeBg = this.hammerAtkNode.getChildByName('attackRangeBg');
            // this.attackRangeBg2 = this.hammerAtkNode.getChildByName('attackRangeBg2');
            // if (!this.attackRangeBg) {
            //     return;
            // }
            // this.attackRangeProgress = this.hammerAtkNode.getChildByName('attackRangeProgress');
            // this.attackRangeProgress2 = this.hammerAtkNode.getChildByName('attackRangeProgress2');
            // this.progressOriginalScale = this.attackRangeBg.getScale().clone();
            // this.progressOriginalScale2 = this.attackRangeBg2.getScale().clone();
            // this.attackRangeProgress.scale = v3(0.001, 0.001, 1);
            // this.attackRangeProgress2.scale = v3(this.progressOriginalScale2.x, 0.001, 1);
            // this.attackRangeBg.active = false;
            // this.attackRangeBg2.active = false;
            // this.attackRangeProgress.active = false;
            // this.attackRangeProgress2.active = false;
            // if (this.hammerDragEffect) {
            //     let selfPart = this.hammerDragEffect.getComponent(ParticleSystem)
            //     if (selfPart) {
            //         this.draggingEffect.push(selfPart);
            //     }
            //     let len = this.hammerDragEffect.children.length;
            //     for (let i = 0; i < len; i++) {
            //         let child = this.hammerDragEffect.children[i];
            //         let part = child.getComponent(ParticleSystem);
            //         if (part) {
            //             this.draggingEffect.push(part);
            //         }
            //     }
            // }
        }
    }
    protected onEnable(): void {
        this.deadTimer = 0;
        super.onEnable();
        // if (this.CharacterTag == CharacterTag.Boss) {
        //     this.attackRangeProgress.scale = v3(0.001, 0.001, 1);
        //     this.attackRangeProgress2.scale = v3(this.progressOriginalScale2.x, 0.001, 1);
        //     this.attackRangeBg.active = false;
        //     this.attackRangeBg2.active = false;
        //     this.attackRangeProgress.active = false;
        //     this.attackRangeProgress2.active = false;
        // }
    }
    // playDraggingEffect(isPlay: boolean) {
    //     let len = this.draggingEffect.length;
    //     for (let i = 0; i < len; i++) {
    //         if (isPlay) {
    //             this.draggingEffect[i].play();
    //         } else {
    //             this.draggingEffect[i].stop();
    //         }
    //     }
    // }
    protected onMoveEnter(): void {
        super.onMoveEnter();
        // this.playDraggingEffect(true);
    }
    protected onMoveExit(): void {
        super.onMoveExit();
        // this.playDraggingEffect(false);
    }
    /**
     * 重写死亡状态进入方法
     * 禁用物理和碰撞组件
     */
    protected onDeadEnter(): void {
        super.onDeadEnter();
        // 重置死亡计时器
        // if (this.CharacterTag == CharacterTag.Boss) {
        //     this.attackRangeBg.active = false;
        //     this.attackRangeBg2.active = false;
        //     this.attackRangeProgress.active = false;
        //     this.attackRangeProgress2.active = false;
        // }
    }

    protected onAttackUpdate(dt: number): void {
        super.onAttackUpdate(dt);
        // Boss：攻击动画前段慢放（蓄力感），后段恢复为正常攻击速率，增强压迫感
        if (!this.animComp) return;
        const curName = this.animComp.getCurrentAnimationName();
        if (curName !== this.animComp.getAttackAnimName()) return;
        const progress = this.animComp.getCurAnimationProgress();
        const base = this._attackTimeScale;
        //NOTE: 此项目BOSS并无武器, 但是仍然保留蓄力动画效果
        // 攻击范围进度提示：归一化进度前半段显示并线性拉满至原始缩放，过半隐藏（与原先「<0.5 显示 / >=0.5 隐藏」等价）
        // const showRangeHint = progress < 0.5;
        // if (this.CharacterTag == CharacterTag.Boss) {
        //     this.attackRangeBg.active = showRangeHint;
        //     this.attackRangeBg2.active = showRangeHint;
        //     this.attackRangeProgress.active = showRangeHint;
        //     this.attackRangeProgress2.active = showRangeHint;
        //     const rangeHintScaleT = Math.min(progress * 2, 1);
        //     this.attackRangeProgress2.setScale(
        //         v3(
        //             this.progressOriginalScale2.x,
        //             rangeHintScaleT * this.progressOriginalScale2.y,
        //             1,
        //         ),
        //     );
        //     this.attackRangeProgress.setScale(
        //         v3(
        //             rangeHintScaleT * this.progressOriginalScale.x,
        //             rangeHintScaleT * this.progressOriginalScale.y,
        //             1,
        //         ),
        //     );
        // }
        if (progress < this._bossAttackWindupPhase) {
            this.animComp.setTimeScale(base * this._bossAttackWindupTimeScaleMul);
        } else {
            this.animComp.setTimeScale(base);
        }
    }

    // protected handleSlashAttack(wpos: Vec3, attackInfo: AttackInfo): void {
    //     const atkPos = this.hammerAtkNode.worldPosition.clone();
    //     attackInfo.damageSource.extra = this.isInsideWall ? 1 : 0;
    //     super.handleSlashAttack(atkPos, attackInfo);
    // }
    /**
     * 死亡状态更新
     * 用于处理没有动画时的回收逻辑
     */
    // protected onDeadUpdate(dt: number) {
    //     super.onDeadUpdate(dt);

    //     // 累加死亡时间
    //     this.deadTimer += dt;

    //     // 如果超过最大死亡时间，强制回收（防止没有动画时无法回收）
    //     if (this.deadTimer >= this.maxDeadTime && !this.isRemove) {
    //         this.stopMove();
    //         this.isRemove = true;
    //         GameInfo.instance.monsterMgr.deleteMonster(this.node.uuid);
    //         app.event.emit(CommonEvent.EnemyDead, { worldPos: this.node.worldPosition.clone(), hurtFrom: this.lastDamageSource })
    //     }
    // }
    // protected onAnimationComplete() {
    //     // 如果有动画，动画结束时回收
    //     super.onAnimationComplete();
    //     if (this.statusComp && this.statusComp.currentState == CharacterStatus.Dead && !this.isRemove) {
    //         // 动画结束时，完全停止移动（包括击退）
    //         this.stopMove();
    //         this.isRemove = true;
    //         GameInfo.instance.monsterMgr.deleteMonster(this.node.uuid);
    //         app.event.emit(CommonEvent.EnemyDead, { worldPos: this.node.worldPosition.clone(), hurtFrom: this.lastDamageSource })
    //     }
    // }
}


