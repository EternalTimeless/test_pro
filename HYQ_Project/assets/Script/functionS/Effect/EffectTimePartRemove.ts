import { _decorator, CCFloat, ParticleSystem } from 'cc';
import PoolManager from '../../Base/PoolManager';
import EventManager from '../../Base/EventManager';
import { EffectEnum, EventType } from '../../Base/EnumList';
import { EffectRemoveBase } from './EffectRemoveBase';
const { ccclass, property } = _decorator;
/**回收粒子特效 */
@ccclass('EffectTimePartRemove')
export class EffectTimePartRemove extends EffectRemoveBase {


    private _part: ParticleSystem[] = [];
    private get part() {
        if (this._part.length == 0) {
            this._part.push(this.node.getComponent(ParticleSystem));
            for (let i = 0; i < this.node.children.length; i++) {
                let part = this.node.children[i].getComponent(ParticleSystem);
                if (part) {
                    this._part.push(part);
                }
            }
        }
        return this._part;
    }

    protected onEnable(): void {
        this._time = this.removeTime;
        for (let i = 0; i < this.part.length; i++) {
            let p = this.part[i];
            p.stop()
            p.play();
        }
    }

    update(deltaTime: number) {
        this._time -= deltaTime;
        if (this._time <= 0) {
            this.node.active = false;
            EventManager.instance.emit(EventType.EFFECT_PLAY_OVER, this, this.index);
            PoolManager.instance.setPool(this.type + this.index, this.node);
        }
    }
}


