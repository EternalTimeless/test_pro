import { _decorator, Component, Quat } from "cc";
import { BattleTargetBase } from "../Base/BattleTargetBase";
const { ccclass, property } = _decorator;

/**
 * 战斗目标 收集器  
 */
@ccclass('CollectGetTarget')
export abstract class CollectGetTarget extends Component {
    /**获取单个目标 */
    abstract get singleTarget(): BattleTargetBase;
    /**获取全部可攻击目标 */
    abstract get groupTarget(): BattleTargetBase[];
    /**获取全部可攻击目标 */
    abstract groupTarget_scope(angle: number, rot: Quat): BattleTargetBase[];
    /**当前是否可攻击 */
    abstract get isCanAttack(): boolean;
    abstract get attackR(): number;
}


