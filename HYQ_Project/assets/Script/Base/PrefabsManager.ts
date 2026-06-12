import { _decorator, ccenum, CCString, Component, error, instantiate, MIDDLE_RATIO, Node, Prefab, primitives, SkeletalAnimation } from 'cc';
import { PrefabsEnum } from './EnumList';
const { ccclass, property } = _decorator;

@ccclass("PrefabsRes")
class PrefabsRes {
    @property({ type: PrefabsEnum })
    public prefabEnum: PrefabsEnum = PrefabsEnum.bullet;
    @property(Prefab)
    public prefabList: Prefab[] = [];
}


@ccclass('PrefabsManager')
export class PrefabsManager extends Component {
    protected static _instance: PrefabsManager = null;
    constructor() {
        super();
        PrefabsManager._instance = this;
    }
    public static get instance() {
        return this._instance;
    }

    @property({ type: PrefabsRes })
    public preList: PrefabsRes[] = [];


    protected onLoad(): void {
        const initList: PrefabsRes[] = [];
        for (let i = 0; i < this.preList.length; i++) {
            const res = this.preList[i];
            initList[res.prefabEnum] = res;
        }
        this.preList = initList;
    }


    /**
     * 
     * @param prefabsEnum 预制体枚举类型
     * @param index 预制体下标 改下表需要与该类型的枚举顺序一致  
     * 举例道具：enum PropEnum{
     *              gold，
     *              meat，
     *          } 
     * 表示 该预制体在预制体数组中的位置
     * @returns 返回一个预制体实例
     */
    public GetPrefabsIns(prefabsEnum: PrefabsEnum, index: number) {

        const res = this.preList[prefabsEnum];
        if (!res) {
            error(`预制体类型：${prefabsEnum} 不存在`);
            debugger;
        }
        const pre = res.prefabList[index];
        if (!pre) {
            error(`预制体类型：${prefabsEnum}   下标:${index}  缺失`);
            debugger;
        }
        return instantiate(pre);
    }


}





