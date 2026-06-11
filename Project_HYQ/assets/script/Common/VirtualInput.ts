import { _decorator } from 'cc';
import { GameInfo, SceneType } from './GameInfo';
const { ccclass, property } = _decorator;

@ccclass('VirtualInput')
export class VirtualInput {
    private static _horizontal: number = 0;
    /**水平方向 */
    static get horizontal(): number {
        return this._horizontal;
    }

    static set horizontal(val: number) {
        this._horizontal = val;
    }

    private static _vertical: number = 0;
    /**垂直方向 */
    static get vertical(): number {
        return this._vertical;
    }
    static set vertical(val: number) {
        //3D场景中垂直方向与方向舵相反 取 -val
        if (GameInfo.SceneType == SceneType.D3) {
            val = -val;
        }
        this._vertical = val;
    }
}


