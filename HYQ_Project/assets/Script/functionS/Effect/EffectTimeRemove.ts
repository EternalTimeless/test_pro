import { _decorator, CCFloat, } from 'cc';
import PoolManager from '../../Base/PoolManager';
import { PoolEnum, EffectEnum } from '../../Base/EnumList';
import { EffectRemoveBase } from './EffectRemoveBase';
const { ccclass, property } = _decorator;

/**特效播放完毕之后 回收 */
@ccclass('EffectTimeRemove')
export class EffectTimeRemove extends EffectRemoveBase {



    protected onEnable(): void {
        this._time = this.removeTime;
        // this.anim.play();
    }


    update(deltaTime: number) {
        this._time -= deltaTime;
        if (this._time <= 0) {
            this.node.active = false;
            PoolManager.instance.setPool(this.type + this.index, this.node);
        }
    }
}


