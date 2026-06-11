import { _decorator, Camera, Component, EventTouch, Input, instantiate, Label, Node, Prefab, Quat, Toggle, v3, Vec3 } from 'cc';
import { MapCell, MapCellFlow, MapCellManager } from './MapCellManager';
import { MapCellView } from './MapCellView';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('MapCellPreview')
@executeInEditMode(true)
export class MapCellPreview extends Component {
    // @property({ displayName: '最大预览格数', tooltip: "超出最大预览格数时不创建预览" })
    // countMax: number = 5000;


    // // @property({ displayName: '存储路径', group: { id: '编辑', name: '编辑设置' }, visible() { return this.inputBlock ? true : false } })
    // // projectPath: string = '';

    // // TODO 从编辑器上关闭开关，在游戏内编辑
    // private _tagCreateMapCell: boolean = false;
    // @property({ displayName: '重建地图' })
    // public set tagCreateMapCell(v: boolean) {
    //     this._tagCreateMapCell = v;
    //     if (this._tagCreateMapCell) {
    //         this.map.loadMapCells();
    //         this._tagCreateMapCell = false;
    //         this.tagViewFlow = false;
    //     }
    // }
    // public get tagCreateMapCell() {
    //     return this._tagCreateMapCell;
    // }

    // private _tagClearPoints: boolean = false;
    // @property({ displayName: '清空预览' })
    // public get tagClearPoints() {
    //     return this._tagClearPoints;
    // }

    // public set tagClearPoints(v: boolean) {
    //     this._tagClearPoints = v;
    //     if (this._tagClearPoints) {
    //         this.mapPreviewCreate();
    //         this._tagClearPoints = false;
    //     }
    // }

    // private _tagPreviewMap: boolean = false;
    // @property({ displayName: '创建预览' })
    // public get tagPreviewMap() {
    //     return this._tagPreviewMap;
    // }
    // public set tagPreviewMap(v: boolean) {
    //     this._tagPreviewMap = v;
    //     if (this._tagPreviewMap) {
    //         this.mapPreviewDelete();
    //         this._tagPreviewMap = false;
    //     }
    // }

    @property({ type: Node, displayName: '流场目标', group: { id: '寻路', name: '寻路测试' } })
    moveTarget: Node = null;
    // @property({ displayName: '流场实时预览', tooltip: "需要先创建预览" })
    tagViewFlow: boolean = false;

    _map: MapCellManager = null;
    public get map() {
        if (!this._map) this._map = this.node.getComponent(MapCellManager);
        return this._map;
    }

    protected onLoad(): void {
        this.tagViewFlow = false;
        // this.saveJsonToEditor('cells.json', { 'test': 'test1' })
        // this.projectPath = this.projectPath.replace(/\\/g, '/');
    }

    get plane() {
        const planeNormal = new Vec3(0, 1, 0);
        const planePoint = new Vec3(0, 0, 0);
        return [planeNormal, planePoint];
    }

    log(content: string) {
        console.log(`[CellPreview] ${content}`);
    }

    get isTimeOut() { return this.taskSplitMS != 0 && this.scriptFrameTime > this.taskSplitMS; }
    get taskSplitMS() { return this.map.taskSplitMS; }
    protected scriptFrameTime = 0;      // 脚本帧耗时
    _flowViewTimer: number = 0;         // 实时流畅预览计时器
    protected update(dt: number) {
        this.scriptFrameTime = 0;
        this._flowViewTimer += dt;
        if (this.tagViewFlow && this._flowViewTimer >= 0.2) {
            const t1 = performance.now();
            this.previewFlow();
            this._flowViewTimer = 0;
            const cost = performance.now() - t1;
            this.scriptFrameTime += cost;
        }
        /** 预览任务 */
        if (this.task_preview.length > 0) this.previewTask();
    }

    task_preview: MapCell[] = [];
    previewTask() {
        while (this.task_preview.length > 0) {
            if (this.isTimeOut) return;
            let cell = this.task_preview.shift();
            const t1 = performance.now();
            this.viewCell(cell.wPos);
            const cost = performance.now() - t1;
            this.scriptFrameTime += cost;
        }
    }

    editorPreviewMap() { this.mapPreviewCreate(); }
    mapPreviewCreate() {
        this.initCellView();
        // const countMax = this.countMax;
        let count = 0;
        this.task_preview = [];

        for (let x = 0; x < this.map.cellArray.length; x++) {
            for (let y = 0; y < this.map.cellArray[x].length; y++) {
                // /** 旧版直接预览 */
                // let cell = this.map.getCellByXY(x, y);
                // if (cell.real) {
                //     count++;
                //     this.viewCell(cell.wPos);
                // }
                // if (count > countMax) {
                //     console.error(`预览格子数 ${count} 大于限定值 ${countMax} 可能导致软件崩溃，中止预览。`)
                //     return;
                // }

                /** 新版创建分帧任务 */
                let cell = this.map.getCellByXY(x, y);
                if (cell.real) {
                    // this.viewCell(cell.wPos);
                    count++;
                    this.task_preview.push(cell);
                }
                else console.log(x, y, cell)
            }
        }

        // console.log(`预览格子数${count}`)
        this.log(`${this.map.cellArray.length} * ${this.map.cellArray[0].length}`)
        this.log(`创建分帧预览任务,${count}格`)
    }

    /**清除预览点 */
    editorClearView() { this.mapPreviewDelete(); }
    mapPreviewDelete() {
        this.node.removeAllChildren();
    }

    protected getCellViews() {
        let views: Map<string, Node> = new Map();
        this.node.children.forEach((child) => {
            views.set(child.name, child);
        })
        return views;
    }

    @property({ type: Prefab, displayName: '格子预览预制体' })
    cellViewPrefab: Prefab = null;
    // cellViewMap: Map<string, Node> = new Map();
    cellViewMap: Map<number, Node> = new Map();
    /**预览格子 */
    // protected viewCell(pos: Vec3) {
    //     if (!this.cellViewPrefab) return;
    //     let cellkey = this.map.wpos2CellKey(pos);
    //     let ck: string = `CellView(${cellkey})`

    //     let point = this.cellViewMap.get(this.map.wpos2CellKey(pos));
    //     if (!point) {
    //         point = instantiate(this.cellViewPrefab)
    //         this.node.addChild(point);
    //         point.setWorldScale(new Vec3(this.map.cellSize, this.map.cellSize, this.map.cellSize));
    //         point.setWorldPosition(pos);
    //         point.setWorldRotationFromEuler(0, 0, 0);
    //         point.name = ck;
    //     }
    //     /** 设置脚本 */
    //     let view = point.getComponent(MapCellView);
    //     if (view) {
    //         view.init(cellkey);
    //         view.setVec(v3(0, 0, 0));
    //         if (view.arrowNode) view.arrowNode.active = false;
    //     }
    //     // // 隐藏箭头
    //     // let arrow = point.getChildByName('Arrow');
    //     // if (arrow) arrow.active = false;
    // }

    viewCell(pos: Vec3) {
        if (!this.cellViewPrefab) return;
        const [x, y] = this.map.wpos2XY(pos);
        const cell = this.map.getCellByXY(x, y);
        if (!cell) return;
        let ck: string = `CellView(${x},${y})`

        let point = this.cellViewMap.get(this.map.wpos2number(pos));
        if (!point) {
            point = instantiate(this.cellViewPrefab)
            this.node.addChild(point);
            point.name = ck;
        }
        /** 设置脚本 */
        let view = point.getComponent(MapCellView);
        if (view) {
            view.init(cell);
            view.setVec(v3(0, 0, 0));
            // if (view.arrowNode) view.arrowNode.active = false;
        }
    }

    initCellView() {
        this.cellViewMap.clear();
        this.node.children.forEach(element => {
            let key = this.map.wpos2number(element.worldPosition);
            this.cellViewMap.set(key, element);
        });
    }

    protected viewFlow(flow: MapCellFlow) {
        if (flow) {
            this.initCellView();
            let views = this.cellViewMap;
            views.forEach((view, key) => {
                let direction = this.map.getFlowCell(view.worldPosition, this.moveTarget.worldPosition, true);
                let preview = view.getComponent(MapCellView);
                const arrow = preview.arrowNode;
                if (preview) {
                    if (!direction || direction.length() == 0) {
                        if (arrow) arrow.active = false;
                    }
                    else {
                        preview.setVec(direction);
                        if (arrow) {
                            arrow.active = true;
                            this.rotateArrow(preview.arrowNode, direction);
                        }

                    }
                }
                // if (!direction || direction.length() == 0) {
                //     // view.active = false;
                // }
                // else {
                //     view.active = true;
                //     /** 设置脚本 */
                //     if (preview) {
                //         preview.setVec(direction);
                //         if (preview.arrowNode) {
                //             // preview.arrowNode.active = true;
                //             this.rotateArrow(preview.arrowNode, direction);
                //         }
                //     }
                // }
            })
        }
    }

    protected rotateArrow(arrow: Node, direction: Vec3) {
        if (!direction || direction.length() == 0) return;
        const dir = v3(direction.x, 0, direction.z);
        const reference = new Vec3(0, 0, -1);

        const target = new Vec3();
        Vec3.normalize(target, dir);

        const rotation = new Quat();
        Quat.rotationTo(rotation, reference, target);

        arrow.setRotation(rotation);
    }

    editorFlowTest() { this.previewFlow() }
    previewFlow() {
        let target = this.moveTarget.worldPosition;
        let flow = this.map.getFlow(target);
        this.viewFlow(flow)
    }
}