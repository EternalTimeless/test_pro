import { _decorator, CCFloat, Component, DirectionalLight, director, MeshRenderer, Node } from "cc";
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

    @property({ type: CCFloat, displayName: '002主光阴影距离', tooltip: '仅对 Game_3D-002 生效。值越小，远处物体越早不再渲染实时阴影；建议先将 25 调到 20 对比画面和帧率。' })
    public game002MainLightShadowDistance: number = 25;

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

    protected onLoad(): void {
        if (director.getScene()?.name !== 'Game_3D-002') {
            return;
        }
        this.applyGame002ShadowDistance();
        this.disableTengmanChildShadows();
    }

    private applyGame002ShadowDistance(): void {
        const scene = director.getScene();
        const mainLight = scene?.getComponentInChildren(DirectionalLight);
        if (mainLight) {
            mainLight.shadowDistance = Math.max(0.1, this.game002MainLightShadowDistance);
        }
    }

    private disableTengmanChildShadows(): void {
        const scene = director.getScene();
        if (!scene) {
            return;
        }
        const stack: Node[] = [scene];
        while (stack.length > 0) {
            const node = stack.pop();
            if (!node) {
                continue;
            }
            if (node.name.toLowerCase() === 'tengman') {
                const renderers = node.getComponentsInChildren(MeshRenderer);
                for (let i = 0; i < renderers.length; i++) {
                    renderers[i].shadowCastingMode = MeshRenderer.ShadowCastingMode.OFF;
                }
                continue;
            }
            for (let i = 0; i < node.children.length; i++) {
                stack.push(node.children[i]);
            }
        }
    }

}
