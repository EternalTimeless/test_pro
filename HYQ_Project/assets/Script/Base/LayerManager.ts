import { _decorator, ccenum, Component, Node } from "cc";
import { SceneType, LayerEnum } from "./EnumList";

const { ccclass, property } = _decorator;



@ccclass("LayerManager")
export default class LayerManager extends Component {
    protected static _instance: LayerManager = null;
    /**层级节点 */
    @property(Node)
    public layerNode: Node[] = []

    /**
 * 当前场景类型  D3表示在3D场景中   D2表示在2D场景中
     */
    @property({ type: SceneType })
    public SceneType: SceneType = SceneType.D3;

    public static get instance() {
        return this._instance;
    }
    /**
     * 获取该层级
     * @param layerEnum 层级枚举
     * @returns 
     */
    public getLayer(layerEnum: LayerEnum) {

        return this.layerNode[layerEnum];
    }
    constructor() {
        super();
        LayerManager._instance = this;
    }

}