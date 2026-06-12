import { _decorator, Component, CCFloat } from "cc";
import { PoolEnum, EffectEnum } from "../../Base/EnumList";

const { ccclass, property } = _decorator;
@ccclass('EffectRemoveBase')
export class EffectRemoveBase extends Component {

    /**回收类型 */
    // @property({ type: PoolEnum })
    public type: PoolEnum = PoolEnum.effect;

    @property(CCFloat)
    public removeTime: number = 0.1;
    /**类型  当前物体所对应的枚举值 */
    @property({ type: EffectEnum })
    public index: number = EffectEnum.hit;
    protected _time: number;
}