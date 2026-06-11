import { _decorator, Camera, Color, Component, EventKeyboard, EventTouch, geometry, GeometryRenderer, input, Input, KeyCode, Label, Node, PhysicsSystem, Size, Toggle, ToggleContainer, UITransform, v2, v3, Vec2, Vec3, view } from 'cc';
import { MapCell, MapCellManager } from './MapCellManager';
import { MapCellManager2D } from './MapCellManager2D';
import { MapCellPreview } from './MapCellPreview';
import { GameInfo, SceneType } from '../Common/GameInfo';
import { CameraCtrl } from '../CharacterCtrl/CameraCtrl';
const { ccclass, property } = _decorator;

@ccclass('MapCellEditor')
export class MapCellEditor extends Component {
    // @property({ type: Node, displayName: '输入阻断层', tooltip: "用于在游戏内阻断输入，编辑地图", group: { id: '编辑', name: '编辑设置' } })
    // @property({ type: Label, displayName: '选择显示Label', group: { id: '编辑', name: '编辑设置' }, visible() { return this.inputBlock ? true : false } })
    @property({ type: Camera, displayName: '主相机', group: { id: '编辑', name: '编辑设置' } })
    mainCamera: Camera = null;
    @property({ displayName: '相机移动速度', group: { id: '编辑', name: '编辑设置' } })
    cameraMoveSpeed: number = 20;

    get map() {
        if (this.d3) {
            return MapCellManager.instance;
        }
        else {
            return MapCellManager2D.instance;
        }
    }

    _preview: MapCellPreview = null;
    get preview() {
        if (!this._preview) {
            this._preview = this.map?.node.getComponent(MapCellPreview);
        }
        return this._preview;
    }

    log(content: string) {
        console.log(`[CellEditor] ${content}`);
    }

    inputBlock: Node = null;
    selectInfoLabel: Label = null;

    editNode: Node = null;
    restoreNode: Node = null;
    // methodNode: Node = null;
    // rectNode: Node = null;
    // TipNode: Node = null;
    public geometryRenderer: GeometryRenderer = null;
    protected onLoad(): void {
        this.inputBlock = this.node.getChildByName('InputBlock');
        this.selectInfoLabel = this.node.getChildByName('ViewInfo').getComponent(Label);
        this.editNode = this.node.getChildByName('Edit');
        if (this.editNode) this.editNode.active = false;

        const mapNode = this.node.getChildByName("Map")
        this.restoreNode = mapNode?.getChildByName('Restore');
        if (this.restoreNode) this.restoreNode.active = false;

        this.mainCamera.camera.initGeometryRenderer();
        this.geometryRenderer = this.mainCamera.camera.geometryRenderer;
    }

    get d3() { return GameInfo.SceneType == SceneType.D3 }

    protected setEditorEnable(data: Toggle) {
        const node = this.inputBlock;
        const view = data.isChecked;
        if (node) {
            // node.active = view;
            // if (this.methodNode) this.methodNode.active = view;
            if (this.editNode) this.editNode.active = view;
            const method = view ? this._method : null;
            this.changeEditMethod(method);
        }

        if (this.cameraMove) {
            this.cameraMove.enabled = !view;
            if (view) {
                input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
                input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
            }
            else {
                input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
                input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
            }
        }

        // if (this.TipNode) this.TipNode.active = view;
    }

    _isRect = false;
    protected setBrushRect(event: Toggle) {
        this._isRect = event.isChecked;
        this._brushStart = null;
    }

    _method = 'Select';
    protected changeEditMethod(data: Toggle | string) {
        const method = data instanceof Toggle ? data.node.name : data;
        if (method) this._method = method;
        const node = this.inputBlock;
        this.log(`切换编辑模式 > ${method}`)
        this.closeTouchEvent();
        switch (method) {
            case 'Select':
                node.on(Input.EventType.TOUCH_START, this.selectCell, this);
                this.log('选择模式')
                break;
            case 'CanMove':
            case 'CanNotMove':
                node.on(Input.EventType.TOUCH_START, this.selectCell, this);
                node.on(Input.EventType.TOUCH_END, this.brushEnd, this);
                node.on(Input.EventType.TOUCH_MOVE, this.brushMove, this);
                this.selectedCell = null;
                this.log('刷子模式')
                break;
        }
    }

    get cameraMove() { return this.mainCamera?.getComponent(CameraCtrl) }

    protected closeTouchEvent() {
        const node = this.inputBlock;
        if (node) {
            node.off(Input.EventType.TOUCH_START, this.selectCell, this);
            node.off(Input.EventType.TOUCH_END, this.brushEnd, this);
            node.off(Input.EventType.TOUCH_MOVE, this.brushMove, this);
        }
    }

    protected selectCell(event: EventTouch) {
        let pos = event.touch.getLocation();
        this.outRay = new geometry.Ray();
        let _x = pos.x
        let _y = pos.y
        this.mainCamera.camera.screenPointToRay(this.outRay, _x, _y)

        const start = this.outRay.o;
        const rayLength = 10000;
        const hitPoint1 = new Vec3(
            this.outRay.o.x + this.outRay.d.x * rayLength,
            this.outRay.o.y + this.outRay.d.y * rayLength,
            this.outRay.o.z + this.outRay.d.z * rayLength
        );

        let t = 0;
        const hitPoint = v3(0, 0, 0);
        if (this.d3) {
            t = (0 - hitPoint1.y) / (start.y - hitPoint1.y);
            Vec3.lerp(hitPoint, hitPoint1, start, t);
        }
        else {
            t = (0 - hitPoint1.z) / (start.z - hitPoint1.z);
            Vec3.lerp(hitPoint, hitPoint1, start, t)
        }

        this.preview.initCellView();
        if (this._method == 'Select') this.selectCellView(hitPoint);
        else if (!this._brushStart) {
            this._brushStart = hitPoint;
        }

        /** Astart路径 */
        this.astartPath = this.map.getAstarPath(hitPoint, this.preview.moveTarget.worldPosition)

        return hitPoint;
    }

    outRay: geometry.Ray = null;
    update(dt: number) {
        this.moevCamera(dt);
        if (!this.geometryRenderer) return;
        this.drawArea();
        this.drawAstarPath();
        // this.drawCells();
    }

    /**绘制矩形区域 */
    drawArea() {
        /** 绘制选择点 */
        if (this.selectedCell) {
            this.geometryRenderer.addCross(this.selectedCell.wPos, this.map.cellSize, Color.YELLOW)
        }
        /** 绘制矩形区域 */
        if (this._isRect && this._brushStart && this._brushMove) {
            const movePoint = this._brushMove;
            if (this.d3) {
                this.geometryRenderer.addQuad(
                    v3(this._brushStart.x, 0, this._brushStart.z),
                    v3(movePoint.x, 0, this._brushStart.z),
                    v3(movePoint.x, 0, movePoint.z),
                    v3(this._brushStart.x, 0, movePoint.z),
                    Color.YELLOW
                )
            }
            else {
                this.geometryRenderer.addQuad(
                    v3(this._brushStart.x, this._brushStart.y, 0),
                    v3(movePoint.x, this._brushStart.y, 0),
                    v3(movePoint.x, movePoint.y, 0),
                    v3(this._brushStart.x, movePoint.y, 0),
                    Color.YELLOW
                )
            }
        }
    }

    astartPath: Vec3[] = [];
    drawAstarPath() {
        if (!this.selectedCell) return;
        // this.astartPath = this.map.getAstarPath(this.selectedCell.wPos, this.preview.moveTarget.worldPosition)
        if (this.astartPath.length > 0) {
            this.geometryRenderer.addLine(this.selectedCell.wPos, this.astartPath[0], Color.WHITE);
            for (let i = 0; i < this.astartPath.length - 1; i++) {
                this.geometryRenderer.addLine(this.astartPath[i], this.astartPath[i + 1], Color.WHITE);
            }
        }
    }

    moveDir: Vec2 = v2(0, 0);
    isMoving = false;
    /** 移动镜头 */
    moevCamera(dt: number) {
        if (this.mainCamera && this.isMoving) {
            const moveSpeed = this.d3 ? this.cameraMoveSpeed : this.cameraMoveSpeed * 20;
            // 计算移动距离
            const moveDistance = moveSpeed * dt;
            // 计算移动向量
            const moveVector = this.d3 ? v3(
                this.moveDir.x * moveDistance,
                0,
                this.moveDir.y * moveDistance
            ) : v3(
                this.moveDir.x * moveDistance,
                -this.moveDir.y * moveDistance, // Y轴保持不变
                0
            )
            // 更新位置
            this.mainCamera.node.worldPosition = this.mainCamera.node.worldPosition.add(moveVector);
        }
    }

    protected selectedCell: MapCell = null;
    /** 选中格子预览 */
    protected selectCellView(hitPoint: Vec3) {
        const [x, y] = this.map.wpos2XY(hitPoint);
        const cell = this.map.getCellByXY(x, y);

        // 更新标签显示信息
        const label = this.selectInfoLabel;
        if (label) {
            const wpos = cell ? cell.wPos : hitPoint;
            let posString = `地图坐标: ${x}, ${y}\n世界坐标: ${wpos.x.toFixed(2)}, ${wpos.y.toFixed(2)}, ${wpos.z.toFixed(2)}`;
            if (cell && cell.real) {
                if (cell == this.selectedCell) {
                    this.map.updateCell(cell.wPos, !cell.canMove);
                    // this.preview.initCellView();
                    this.preview.viewCell(cell.wPos);
                    // console.log('更新格子可移动状态')
                }
                this.selectedCell = cell;
                label.string = '----------已选格子\n';
                label.string += posString;
                label.string += `\n可移动: ${cell.canMove ? '是' : '否'}  (再次点击切换)`;
                /** 流场 */
                const flowVec = this.map.getFlowCell(cell.wPos, this.preview.moveTarget.worldPosition, false);
                if (flowVec) {
                    // console.log(this.moveTarget.worldPosition);
                    label.string += `\n流场方向: ${flowVec.x.toFixed(2)}, ${flowVec.y.toFixed(2)}, ${flowVec.z.toFixed(2)}`;
                }
            } else {
                // label.string += `\n无效格子`;
                console.log(`${posString}\n无效格子`)
            }
        }
    }

    _brushMove: Vec3 = null;
    brushMove(event: EventTouch) {
        if (!this._brushStart) return;
        /** 笔刷绘制 */
        const movePoint = this.selectCell(event);
        this._brushMove = movePoint;
        if (!this._isRect) {
            const [x, y] = this.map.wpos2XY(movePoint);
            const cell = this.map.getCellByXY(x, y);
            if (cell?.real) {
                const canMoveSet = this._method == 'CanMove' ? true : false;
                if (cell.canMove != canMoveSet) {
                    cell.canMove = canMoveSet;
                    this.preview.viewCell(cell.wPos);
                }
            }
        }
    }

    _brushStart: Vec3 = null;
    brushEnd(event: EventTouch) {
        if (!this._brushStart || !this._isRect) return;
        /** 矩形绘制 */
        const canMoveSet = this._method == 'CanMove' ? true : false;
        const endPoint = this.selectCell(event);
        const [x1, y1] = this.map.wpos2XY(this._brushStart);
        const [x2, y2] = this.map.wpos2XY(endPoint);
        const xs = Math.min(x1, x2);
        const ys = Math.min(y1, y2);
        const xe = Math.max(x1, x2);
        const ye = Math.max(y1, y2);
        for (let x = xs; x <= xe; x++) {
            for (let y = ys; y <= ye; y++) {
                const cell = this.map.getCellByXY(x, y);
                if (cell?.real) {
                    if (cell.canMove != canMoveSet) {
                        cell.canMove = canMoveSet;
                        this.preview.viewCell(cell.wPos);
                    }
                }
            }
        }

        this._brushStart = null;
        this._brushMove = null;
    }

    protected onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.ARROW_UP:
            case KeyCode.KEY_W:
                this.moveDir.y = -1;
                this.isMoving = true;
                break;
            case KeyCode.ARROW_DOWN:
            case KeyCode.KEY_S:
                this.moveDir.y = 1;
                this.isMoving = true;
                break;
            case KeyCode.ARROW_LEFT:
            case KeyCode.KEY_A:
                this.moveDir.x = -1;
                this.isMoving = true;
                break;
            case KeyCode.ARROW_RIGHT:
            case KeyCode.KEY_D:
                this.moveDir.x = 1;
                this.isMoving = true;
                break;
        }
    }

    protected onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.ARROW_UP:
            case KeyCode.KEY_W:
                this.moveDir.y = 0;
                break;
            case KeyCode.ARROW_DOWN:
            case KeyCode.KEY_S:
                this.moveDir.y = 0;
                break;
            case KeyCode.ARROW_LEFT:
            case KeyCode.KEY_A:
                this.moveDir.x = 0;
                break;
            case KeyCode.ARROW_RIGHT:
            case KeyCode.KEY_D:
                this.moveDir.x = 0;
                break;
        }

        // 如果所有方向都为0，则停止移动
        if (this.moveDir.x === 0 && this.moveDir.y === 0) {
            this.isMoving = false;
        }
    }

    _mapTemp = [];
    createMap() {
        this._mapTemp = this.map.getMapData();
        this.map.loadMapCells();
        if (this.restoreNode) this.restoreNode.active = true;
    }

    restoreMap() {
        if (this._mapTemp) {
            this.map.clear()
            this.map.loadMapCells(this._mapTemp);
            if (this.restoreNode) this.restoreNode.active = false;
        }
    }

    /**
     * 刷新预览方法
     * 该方法用于重新生成地图预览，通过调用mapPreviewCreate方法实现预览的更新
     */
    refreshPreview() {    // 定义刷新预览的方法
        this.preview.mapPreviewCreate();    // 调用预览对象的mapPreviewCreate方法来创建预览
    }

    removePreview() {
        this.preview.mapPreviewDelete();
    }

    public setFlowPreview(data: Toggle) { this.preview.tagViewFlow = data.isChecked; }

    saveJsonToEditor(fileName: string, data: any) {
        const jsonContent = JSON.stringify(data);
        if (typeof window !== 'undefined' && window.document) {
            const blob = new Blob([jsonContent], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
            this.log(`请将下载的json文件保存到 resources 文件夹下`);
        }
    }

    saveMapJson() {
        const json = this.map.getMapData();
        this.saveJsonToEditor('cellmap_default.json', json);
    }
}