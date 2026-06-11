import { _decorator, Color, Component, Node, Sprite, v2, v3, Vec2, Vec3 } from 'cc';
import { MapCell, MapCellManager } from './MapCellManager';
import { MapCellManager2D } from './MapCellManager2D';
import { GameInfo, SceneType } from '../Common/GameInfo';
const { ccclass, property } = _decorator;

@ccclass('MapCellView')
export class MapCellView extends Component {
    cellData: MapCell = null;
    @property({ readonly: true })
    private cellKey: Vec2 = v2(-1, -1);
    @property({ readonly: true })
    private flowVec: Vec3 = new Vec3(0, 0, 0);
    @property(Sprite)
    cellSprite: Sprite = null;
    @property(Node)
    arrowNode: Node = null;

    get d3() { return GameInfo.SceneType == SceneType.D3 }

    get map() {
        if (this.d3) return MapCellManager.instance;
        else return MapCellManager2D.instance;
    }

    init(cellData: MapCell) {
        this.cellData = cellData;
        this.cellKey = cellData.xy;
        this.flowVec = v3(0, 0, 0);

        const size = this.map.mode45 ? this.map.cellSize * this.map.sqrt45 : this.map.cellSize;
        // const size = this.map.mode45 ? this.map.cellSize * Math.SQRT2 : this.map.cellSize;
        this.node.setWorldScale(v3(size, size, size));
        this.node.setWorldPosition(cellData.wPos);
        const rotateX = this.d3 ? 90 : 0;
        const rotateY = this.map.mode45 ? 45 : 0;
        // if (this.map.mode45) {
        // }
        if (this.d3) this.cellSprite.node.setWorldRotationFromEuler(rotateX, rotateY, 0);
        else this.cellSprite.node.setWorldRotationFromEuler(rotateX, 0, rotateY);


        if (this.cellSprite) {
            if (cellData.canMove) this.cellSprite.color = new Color(0, 255, 0, 255);
            else this.cellSprite.color = new Color(255, 0, 0, 60);
        }
        if (this.arrowNode) {
            this.arrowNode.active = false;
        }
    }

    setVec(vec: Vec3) {
        this.flowVec.set(vec);
        const view = vec && vec.length() != 0;
        this.arrowNode.active = view;
    }
}