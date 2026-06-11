import { _decorator } from 'cc';
import { EnemyCharacter } from './EnemyChar';
const { ccclass, property } = _decorator;

@ccclass('Monster')
export class Monster extends EnemyCharacter {
    /** 死亡计时器，用于没有动画时的回收 */
    private deadTimer: number = 0;
    /** 死亡后的最大存活时间（秒） */
    private readonly maxDeadTime: number = 2.0;
    protected onEnable(): void {
        this.deadTimer = 0;
        super.onEnable();
    }
    /**
     * 重写死亡状态进入方法
     * 允许死亡时的击退效果
     */
    protected onDeadEnter(): void {
        super.onDeadEnter();
        // 重置死亡计时器
        this.deadTimer = 0;

    }
    /**
     * 死亡状态更新
     * 用于处理没有动画时的回收逻辑
     */
    // protected onDeadUpdate(dt: number) {
    // super.onDeadUpdate(dt);

    // // 累加死亡时间
    // this.deadTimer += dt;

    // // 如果超过最大死亡时间，强制回收（防止没有动画时无法回收）
    // if (this.deadTimer >= this.maxDeadTime && !this.isRemove) {
    //     this.stopMove();
    //     this.isRemove = true;
    //     app.event.emit(CommonEvent.EnemyDead, { worldPos: this.node.worldPosition.clone(), hurtFrom: this.lastDamageSource })
    //     GameInfo.instance.monsterMgr.deleteMonster(this.node.uuid);
    // }
    // }

    // protected onAnimationComplete() {
    //     // 如果有动画，动画结束时回收
    //     super.onAnimationComplete();
    //     if (this.statusComp && this.statusComp.currentState == CharacterStatus.Dead && !this.isRemove) {
    //         // 动画结束时，完全停止移动（包括击退）
    //         this.stopMove();
    //         this.isRemove = true;
    //         app.event.emit(CommonEvent.EnemyDead, { worldPos: this.node.worldPosition.clone(), hurtFrom: this.lastDamageSource })
    //         GameInfo.instance.monsterMgr.deleteMonster(this.node.uuid);
    //     }
    // }
}


