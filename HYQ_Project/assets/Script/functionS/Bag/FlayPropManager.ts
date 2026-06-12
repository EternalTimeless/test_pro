import { _decorator, Component, Node } from 'cc';
import { UnityUpComponent } from '../../Base/UnityUpComponent';
import IPropFly from '../Bag/IPropFly';
import PropManager from '../Bag/PropManager';
import { EffectManager } from '../Effect/EffectManager';
const { ccclass, property } = _decorator;

@ccclass('FlayPropManager')
export class FlayPropManager extends UnityUpComponent {
    public static instacne: FlayPropManager;

    protected onLoad(): void {
        FlayPropManager.instacne = this;
    }
    _update(deltaTime: number) {
        // EffectManager.instance.frameReleaseSpecialEffects();
        const propList = PropManager.instance.propList;
        for (let i = propList.length - 1; i >= 0; i--) {
            const prop = propList[i];
            for (let j = 0; j < this._IfPList.length; j++) {
                const element = this._IfPList[j];
                const rameove = element.flyProp(prop);
                if (rameove) {
                    propList.splice(i, 1);
                    break;
                }
            }

        }
        this._IfPList = this.shuffleArray<IPropFly>(this._IfPList);
    }

    // 定义工具函数
    private shuffleArray<T>(array: T[]): T[] {
        const shuffled = array; // 创建数组副本（避免修改原数组）
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // 生成随机索引 [0, i]
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // 交换元素
        }
        return shuffled;
    }

    private _IfPList: IPropFly[] = [];

    public addIFlay(IfP: IPropFly) {
        let index = this._IfPList.indexOf(IfP);
        if (index == -1) {
            this._IfPList.unshift(IfP);
        }
    }
    public removeIFlay(IfP: IPropFly) {
        let index = this._IfPList.indexOf(IfP);
        if (index != -1) {
            this._IfPList.splice(index, 1);
        }
    }


}


