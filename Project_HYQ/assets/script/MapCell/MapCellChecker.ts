import { _decorator, Component, Node, v2, Vec2 } from 'cc';
import { MapCellManager } from './MapCellManager';
import { MapCellManager2D } from './MapCellManager2D';
import { GameInfo, SceneType } from '../Common/GameInfo';
const { ccclass, property } = _decorator;

@ccclass('MapCellChecker')
export class MapCellChecker extends Component {
    @property({ displayName: "扩散格数XY", tooltip: "x:横向 y:纵向 如横向为5，检测 x-5~x+5共11格" })
    extendRange: Vec2 = v2(5, 5)
    @property({ displayName: "自动检测", tooltip: "必须要在地图创建后！" })
    autoCheck: boolean = true;
    @property({ displayName: "检测延迟", min: 0 })
    delay: number = 0;

    get map() {
        if (GameInfo.SceneType == SceneType.D3) {
            return MapCellManager.instance;
        }
        else {
            return MapCellManager2D.instance;
        }
    }

    start() {
        if (this.autoCheck) this.check();
    }

    check() {
        this.scheduleOnce(() => {
            this.map?.reCheckArea(this.node.worldPosition, this.extendRange.x, this.extendRange.y);
        }, this.delay)
    }
}