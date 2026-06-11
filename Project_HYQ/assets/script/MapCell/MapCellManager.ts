import {
    _decorator, Component, PhysicsSystem, Vec3, geometry, RigidBody, CCInteger,
    BoxCollider,
    Quat,
    Vec2,
    v2,
    v3,
    JsonAsset,
    resources,
} from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

/**格子标记 世界坐标,是否是可移动格子 */
export class MapCell {
    xy: Vec2 = v2(-1, -1);
    key: number = -1;
    wPos: Vec3 = new Vec3();
    private _canMove: boolean = false;
    public get canMove() { return this.real && this._canMove }
    public set canMove(v: boolean) { this._canMove = v }
    public get real() { return this.xy.x >= 0 && this.xy.y >= 0 }
    public getData() {
        return [
            this.xy.x,
            this.xy.y,
            this.canMove ? 1 : 0,
            this.wPos.x,
            this.wPos.y,
            this.wPos.z
        ]
    }

    getDataMin() {
        return [
            this.xy.x,
            this.xy.y,
            this.canMove ? 1 : 0
        ]
    }

    setData(data: { key: number, xy: number[], canMove: boolean, wPos: number[] }) {
        this.key = data.key;
        this.xy.set(...data.xy);
        this.canMove = data.canMove;
        this.wPos.set(...data.wPos);
    }
}

/** 单个流场 */
export class MapCellFlow {
    cellKey: number;
    flows: Map<number, number> = new Map<number, number>(); // 格子坐标,流场方向
}

@ccclass('MapCellManager')
// @executeInEditMode(true)
export class MapCellManager extends Component {
    public static instance: MapCellManager = null;

    @property({ displayName: '重要说明', multiline: true, readonly: true })
    compNode: string = '请勿在此节点下挂载任何其他节点！\n否则会在清空预览时一并清空！'

    @property({ displayName: '45度格子', tooltip: '通过本节点下的BoxCollider进行范围设置，本节点不可旋转', group: { id: '地图', name: '地图设置' } })
    mode45: boolean = false; // 45度模式
    @property({ displayName: '格子大小', min: 0.5, step: 0.5, tooltip: '通过本节点下的BoxCollider进行范围设置，本节点不可旋转', group: { id: '地图', name: '地图设置' } })
    cellSize: number = 2;
    // public get cellSize() { return this._cellSize }
    // public set cellSize(v: number) { this._cellSize = Math.round(v / 0.5) * 0.5; }
    @property({ displayName: '障碍格判定系数', tooltip: '越大越容易识别为障碍格', min: 0.1, max: 1, step: 0.1, slide: true, group: { id: '地图', name: '地图设置' } })
    obsValue: number = 1;
    @property({ type: [CCInteger], displayName: '障碍物物理组', tooltip: '填入需要作为障碍物的碰撞组Index，可在 项目设置-物理 中查看', group: { id: '地图', name: '地图设置' } })
    rigidGroups: number[] = [];
    @property({ displayName: '反向识别', tooltip: '识别特定障碍物为可移动区域，其他区域为障碍物。', group: { id: '地图', name: '地图设置' } })
    obsToMove: boolean = false;
    _rigidGroups: number[] = [];

    @property({ displayName: '分帧阈值ms', tooltip: "地图创建、流场创建，单帧耗时超过此值会分帧处理", min: 0, group: { id: '性能', name: '性能设置' } })
    taskSplitMS: number = 10;

    // cellMap: Map<string, MapCell> = new Map<string, MapCell>();
    // @property({ type: [CCString], visible: false })
    // cellMapSave: string[] = [];

    // _removing: boolean = true;
    // _toCreate: Vec3[] = [];

    protected start() {
        this.cellSize = Math.round(this.cellSize / 0.5) * 0.5;
        MapCellManager.instance = this;
        this.scheduleOnce(() => {
            this.init();
        }, 0.1)
    }

    init() {
        this.loadMapData();
    }

    protected getData() {
        /** 基于碰撞盒进行设置 */
        const collider = this.node.getComponent(BoxCollider);
        const worldPos = this.node.getWorldPosition();
        const scale = this.node.getWorldScale();
        const w = collider.size.x * scale.x;
        const h = collider.size.z * scale.z;

        if (this.mode45) return this.getData45(v2(worldPos.x, worldPos.z), w, h);
        return this.getData0(v2(worldPos.x, worldPos.z), w, h)

        const angel = this.node.eulerAngles.y;
        const data = this.getGridPointsInRectangle(
            v2(worldPos.x, worldPos.z),
            w, h, -angel,
            this.cellSize
        )
        this.cellOffset.x = -data.range.x.x + 2;
        this.cellOffset.y = -data.range.y.x + 2;
        return {
            points: data.points,
            range: data.range
        };
    }

    protected getData0(worldPos: Vec2, w: number, h: number) {
        const points = [];
        const size = this.cellSize * this.obsValue;

        const range = {
            x: v2(
                Math.round((worldPos.x - w / 2) / this.cellSize),
                Math.round((worldPos.x + w / 2) / this.cellSize)
            ),
            y: v2(
                Math.round((worldPos.y - h / 2) / this.cellSize),
                Math.round((worldPos.y + h / 2) / this.cellSize)
            ),
        }

        this.cellOffset = v2(
            -range.x.x,
            -range.y.x,
        )

        for (let x = range.x.x; x <= range.x.y; x++) {
            for (let y = range.y.x; y <= range.y.y; y++) {
                const p = v2(x * this.cellSize, y * this.cellSize)
                points.push(p)
            }
        }

        console.log('pointsCount', points.length)

        return {
            points: points,
            size: size,
            range: range
        }
    }

    sinCos45 = Math.cos(45);
    protected getData45(worldPos: Vec2, w: number, h: number) {
        const points = [];
        const size = this.cellSize * this.obsValue * this.sinCos45;
        const sizeHalf = this.cellSize / 2;

        const range = {
            x: v2(
                Math.round((worldPos.x - w / 2) / sizeHalf),
                Math.round((worldPos.x + w / 2) / sizeHalf)
            ),
            y: v2(
                Math.round((worldPos.y - h / 2) / sizeHalf),
                Math.round((worldPos.y + h / 2) / sizeHalf)
            ),
        }

        this.cellOffset = v2(
            -range.x.x,
            -range.y.x,
        )
        if (this.cellOffset.x % 2 != 0) this.cellOffset.x++;
        if (this.cellOffset.y % 2 != 0) this.cellOffset.y++;
        console.log('cellOffset', this.cellOffset)

        for (let x = range.x.x; x <= range.x.y; x++) {
            for (let y = range.y.x; y <= range.y.y; y++) {
                if ((x - y) % 2 == 0) {
                    const p = v2(x * sizeHalf, y * sizeHalf)
                    points.push(p);
                }
            }
        }

        console.log('pointsCount', points.length)

        return {
            points: points,
            size: size,
            range: range
        }
    }

    _cos = 0;
    _sin = 0;
    _halfWidth = 0;
    _halfHeight = 0;
    _rotationRad = 0;
    /**
     * 获取矩形内所有指定尺寸的整倍数坐标点
     * @param center 矩形中心点
     * @param width 矩形宽度
     * @param height 矩形高度
     * @param rotation 矩形旋转角度（度数）
     * @param gridSize 坐标尺寸（如2.5）
     * @returns 矩形内所有gridSize整倍数的坐标点数组
     */
    protected getGridPointsInRectangle(
        center: Vec2,
        width: number,
        height: number,
        rotation: number,
        gridSize: number
    ) {
        const points: Vec2[] = [];

        // 将角度转换为弧度
        const rotationRad = rotation * Math.PI / 180;
        this._rotationRad = rotationRad;

        // 计算矩形的边界范围
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        this._halfWidth = halfWidth;
        this._halfHeight = halfHeight;

        // 计算矩形的最小和最大坐标范围（考虑旋转后的外接矩形）
        let minX: number, maxX: number, minY: number, maxY: number;

        if (rotationRad === 0) {
            // 无旋转时的简单计算
            minX = center.x - halfWidth;
            maxX = center.x + halfWidth;
            minY = center.y - halfHeight;
            maxY = center.y + halfHeight;
        } else {
            // 有旋转时，计算旋转后矩形的边界
            const cos = Math.cos(rotationRad);
            const sin = Math.sin(rotationRad);
            this._cos = Math.cos(-rotationRad);
            this._sin = Math.sin(-rotationRad);

            // 矩形四个角点（相对于中心点）
            const corners = [
                new Vec2(-halfWidth, -halfHeight),
                new Vec2(halfWidth, -halfHeight),
                new Vec2(halfWidth, halfHeight),
                new Vec2(-halfWidth, halfHeight)
            ];

            // 旋转并平移角点
            const rotatedCorners = corners.map(corner => {
                const rotatedX = corner.x * cos - corner.y * sin + center.x;
                const rotatedY = corner.x * sin + corner.y * cos + center.y;
                return new Vec2(rotatedX, rotatedY);
            });

            // 计算边界
            minX = Math.min(...rotatedCorners.map(c => c.x));
            maxX = Math.max(...rotatedCorners.map(c => c.x));
            minY = Math.min(...rotatedCorners.map(c => c.y));
            maxY = Math.max(...rotatedCorners.map(c => c.y));
        }

        // 计算网格的起始和结束索引
        const startGridX = Math.floor(minX / gridSize);
        const endGridX = Math.ceil(maxX / gridSize);
        const startGridY = Math.floor(minY / gridSize);
        const endGridY = Math.ceil(maxY / gridSize);

        // 遍历所有可能的网格点
        for (let gridX = startGridX; gridX <= endGridX; gridX++) {
            for (let gridY = startGridY; gridY <= endGridY; gridY++) {
                const point = new Vec2(gridX * gridSize, gridY * gridSize);

                // 检查该点是否在矩形内
                if (this.isPointInRectangle(center, point)) {
                    points.push(point);
                }
            } 1
        }
        return {
            points: points,
            range: {
                x: v2(
                    Math.round(minX / this.cellSize),
                    Math.round(maxX / this.cellSize)
                ),
                y: v2(
                    Math.round(minY / this.cellSize),
                    Math.round(maxY / this.cellSize)
                )
            }
        };
    }

    /**
     * 判断点是否在矩形内
     * @param center 矩形中心点
     * @param point 要判断的点
     * @returns 如果点在矩形内（包含边界）返回true，否则返回false
     */
    protected isPointInRectangle(center: Vec2, point: Vec2): boolean {
        // 将角度转换为弧度
        const rotationRad = this._rotationRad;
        const halfWidth = this._halfWidth;
        const halfHeight = this._halfHeight;

        // 如果没有旋转，使用简单的矩形判断
        if (rotationRad === 0) {

            return point.x >= center.x - halfWidth && point.x <= center.x + halfWidth &&
                point.y >= center.y - halfHeight && point.y <= center.y + halfHeight;
        }

        // // 处理旋转矩形的情况
        // // 将点转换到矩形的本地坐标系（反向旋转）
        const cos = this._cos;
        const sin = this._sin;

        // 平移点到旋转中心
        const translatedPoint = new Vec2(
            point.x - center.x,
            point.y - center.y
        );

        // 旋转点
        const rotatedPoint = new Vec2(
            translatedPoint.x * cos - translatedPoint.y * sin,
            translatedPoint.x * sin + translatedPoint.y * cos
        );

        // // 判断旋转后的点是否在矩形范围内（包含边界）
        // const halfWidth = width / 2;
        // const halfHeight = height / 2;

        return rotatedPoint.x >= -halfWidth && rotatedPoint.x <= halfWidth &&
            rotatedPoint.y >= -halfHeight && rotatedPoint.y <= halfHeight;
    }

    clear() {
        this.flows.clear();
        this.nearMap.clear();
        this.task_map = [];
        this.task_flow = [];
    }

    log(content: string) {
        console.log(`[CellMap] ${content}`);
    }

    public get mapCreated() {
        return this.task_map.length == 0;
    }

    cellMap: Map<number, MapCell> = new Map();
    cellArray: MapCell[][] = [];
    cellOffset: Vec2 = v2(0, 0);
    cellRange: Vec2 = v2(0, 0);
    /**从场景加载地图格子 */
    loadMapCells(mapData: object = null) {
        // const t1 = performance.now();
        this.clear();
        this.initRigidGroups();

        if (mapData && mapData[2]) {
            this.cellSize = mapData[0][0];
            this.mode45 = mapData[0][1] ? true : false;
            const offset = mapData[1];
            const cells = mapData[2];
            this.cellOffset = v2(...offset)
            this.cellRange = v2(
                cells.length,
                cells[0].length
            )
            this.log(`加载地图数据\n格子尺寸:${this.cellSize}\n地图尺寸:${this.cellRange}`);
        }
        else {
            this.log('无地图数据，开始创建！');
            const data = this.getData();
            const points = data.points;
            const range = data.range;

            const xRange = range.x.y - range.x.x + 2;
            const yRange = range.y.y - range.y.x + 2;
            this.cellRange = v2(xRange, yRange);
            this.task_map = points; // 创建任务
            console.log('格子规模', this.cellRange);
            console.log('格子偏移', this.cellOffset);
        }

        this.cellArray = Array.from({ length: this.cellRange.x }, () =>
            Array.from({ length: this.cellRange.y }, () => new MapCell())
        );
        console.log('mapSize', this.cellArray.length, this.cellArray[0].length);

        /** 加载地图数据 */
        if (mapData && mapData[2]) {
            /** 格子 */
            const map = mapData[2];
            for (let x = 0; x < this.cellRange.x; x++) {
                const col = map[x];
                for (let y = 0; y < this.cellRange.y; y++) {
                    const v = col[y];
                    if (v == -1) continue;
                    const cell = this.getCellByXY(x, y);
                    const xy = v2(x, y);
                    cell.xy = xy;
                    cell.wPos = this.xy2Wpos(xy.x, xy.y);
                    cell.canMove = v ? true : false;
                    const key = this.xy2number(x, y);
                    cell.key = key;
                    this.cellMap.set(key, cell);
                    // console.log(x, y, cell)
                }
            }
            // /** 向量列表 */
            // const vecs = mapData[3];
            // if (vecs){
            //     this.vecList = []
            //     for (let v of vecs) this.vecList.push(v3(...v));
            // }
            // /** 特征字典 */
            // const vecMap = mapData[4];
            // if (vecMap) {
            //     this.vecMap.clear()
            //     for (let k in vecMap) this.vecMap.set(Number(k), vecMap[k]);
            //     console.log(this.vecList);
            //     console.log(this.vecMap)
            // }
        }

        /** 新版-创建分帧任务 */
        const [row, col, msize] = this.getMapSize();
        this.log(`格子地图尺寸 ${row} * ${col} = ${msize}`);
        // console.log(this.cellArray)
        // console.log(this.cellMap)
    }

    getMapSize() {
        const row = this.cellArray.length;
        const col = this.cellArray[0].length;
        const size = row * col;
        return [row, col, size];
    }

    quat45 = Quat.fromEuler(new Quat(), 0, 45, 0);
    get quat() {
        if (this.mode45) return this.quat45;
        return new Quat();
    }
    protected checkCell(pos: Vec3) {
        let outRay = geometry.Ray.create(pos.x, pos.y + 100, pos.z, 0, -1, 0);
        let br = PhysicsSystem.instance.sweepBox(outRay, new Vec3(this._halfSize, this._halfSize, this._halfSize), this.quat);

        let canMove = this.obsToMove ? false : true;
        if (br) {
            let results = PhysicsSystem.instance.sweepCastResults;
            for (let r of results) {
                let collider = r.collider;
                let rigidBody = collider.getComponent(RigidBody);
                if (collider.node.active && !rigidBody) continue;
                if (this._rigidGroups.indexOf(rigidBody.group) >= 0) {
                    canMove = this.obsToMove ? true : false;
                    break;
                }
            }
        }
        return canMove;
    }

    /** 坐标V2>V3 */
    protected pointPos(point: Vec2) {
        return v3(point.x, 0, point.y);
    }

    /** 更新格子 */
    public updateCell(wpos: Vec3, canMove: boolean, areaX: number = 0, areaY: number = 0) {
        const [x, y] = this.wpos2XY(wpos);
        const xStart = x - Math.round(areaX);
        const yStart = y - Math.round(areaY);
        const xEnd = x + Math.round(areaX);
        const yEnd = y + Math.round(areaY);
        const size = this.cellSize * this.obsValue;
        for (let xc = xStart; xc <= xEnd; xc++) {
            for (let yc = yStart; yc <= yEnd; yc++) {
                const cell = this.getCellByXY(xc, yc);
                if (cell && cell.real) {
                    cell.canMove = canMove;
                }
            }
        }
        this.flows.clear();
        this.nearMap.clear();
    }

    /** 重新区域 */
    public reCheckArea(wpos: Vec3, areaX: number = 5, areaY: number = 5) {
        const [x, y] = this.wpos2XY(wpos);
        // this.log(`重新检测中心点 ${x},${y}`)
        const xStart = x - Math.round(areaX);
        const yStart = y - Math.round(areaY);
        const xEnd = x + Math.round(areaX);
        const yEnd = y + Math.round(areaY);
        const cellSize = this.mode45 ? this.cellSize / 2 : this.cellSize;
        let count = 0;
        for (let xc = xStart; xc <= xEnd; xc++) {
            for (let yc = yStart; yc <= yEnd; yc++) {
                const cell = this.getCellByXY(xc, yc);
                if (cell?.real) {
                    const point = v2(
                        (xc - this.cellOffset.x) * cellSize,
                        (yc - this.cellOffset.y) * cellSize
                    )
                    this.task_map.push(point)
                    count++;
                }
            }
        }
        this.flows.clear();
        this.nearMap.clear();
        // this.log(`重新检测 ${count} 格`)
    }

    protected initRigidGroups() {
        // 设置碰撞组
        this._rigidGroups = [];
        for (let g of this.rigidGroups) {
            let group = 2 ** g;
            this._rigidGroups.push(group);
        }
    }

    // /**世界坐标到格子坐标 */
    // wpos2CellKey(pos: Vec3) {
    //     return `${Math.round(pos.x / this.cellSize)},${Math.round(pos.z / this.cellSize)}`;
    // }

    /** 世界坐标转地图坐标 */
    wpos2XY(pos: Vec3) {
        if (this.mode45) {
            const size = this.cellSize / 2;
            let x = Math.round(pos.x / size);
            let y = Math.round(pos.z / size);
            if ((x - y) % 2 != 0) {
                const dx = x * size - pos.x;
                const dz = y * size - pos.z;
                if (dx > dz) x = x * size > pos.x ? x - 1 : x + 1;
                else y = y * size > pos.z ? y - 1 : y + 1;
            }
            return [x + this.cellOffset.x, y + this.cellOffset.y];
        }
        return [
            Math.round(pos.x / this.cellSize) + this.cellOffset.x,
            Math.round(pos.z / this.cellSize) + this.cellOffset.y
        ];
    }

    // wpos2XY45(pos: Vec3) {
    //     // const size = this.cellSize / 2;
    //     // const y = Math.round(pos.z / size) ;
    //     // const xAdd = y % 2 == 0 ? 0 : 1;
    //     // const x = Math.round((pos.x) / size) + xAdd;
    //     // return [x + this.cellOffset.x, y + this.cellOffset.y];

    //     // const size = this.cellSize / 2;
    //     // const y = Math.round(pos.z / size);
    //     // const x = Math.round((pos.x) / size);
    //     // const xAdd = y % 2 == 0 ? 0 : 1;
    //     // const yAdd = x % 2 == 0 ? 0 : 1;
    //     // const x1 = Math.round((pos.x) / size) + this.cellOffset.x + xAdd;
    //     // const y1 = Math.round(pos.z / size) + this.cellOffset.y + yAdd;
    //     // return [x1, y1];

    //     // const x = Math.round((pos.x - pos.y) / this.cellSize);
    //     // const y = Math.round((pos.z + pos.x) / this.cellSize);
    //     // const x1 = (x + y) / 2;
    //     // const y1 = (y - x) / 2;
    //     // return [x1 + this.cellOffset.x, y1 + this.cellOffset.y];

    //     const size = this.cellSize / 2;
    //     const x = Math.round(pos.x / size);
    //     const y = Math.round(pos.y / size);
    //     return [x + this.cellOffset.x, y + this.cellOffset.y];
    // }

    xy2Wpos(x: number, y: number) {
        if (this.mode45) {
            const size = this.cellSize / 2;
            const ox = (x - this.cellOffset.x) * size;
            const oy = (y - this.cellOffset.y) * size;
            return v3(ox, 0, oy);

        }
        return v3((x - this.cellOffset.x) * this.cellSize, 0, (y - this.cellOffset.y) * this.cellSize);
    }

    /** 坐标编码32位 */
    public xy2number(x: number, y: number) {
        if (x < 0 || y < 0 || x >= 65535 || y >= 65535) {
            // console.error(`坐标必须为0~65535的数 ${x},${y}`);
            return -1;
        }
        return x << 16 | y;
    }

    /** 坐标编码32位 */
    public wpos2number(pos: Vec3) {
        const [x, y] = this.wpos2XY(pos);
        if (x < 0 || y < 0) return 0;
        return this.xy2number(x, y);
    }

    public cell2Wpos(x: number, y: number) {
        const cell = this.getCellByXY(x, y);
        if (cell) return cell.wPos;
    }

    public getCell(pos: Vec3): MapCell | null {
        const [x, y] = this.wpos2XY(pos);
        const cell = this.getCellByXY(x, y);
        if (cell) return cell;
    }

    public getCellByXY(x: number, y: number) {
        if (x < 0 || y < 0) return null;
        // if (this.mode45 && Math.abs(x - y) % 2 == 1) y++;
        const xa = this.cellArray[x];
        if (xa) return xa[y];
    }

    public getCellByKey(key: number) {
        const cell = this.cellMap.get(key);
        if (cell && cell.real) return cell;
    }

    /** 最近有效格子字典 */
    nearMap: Map<number, number[]> = new Map();
    protected getCellNearest(wpos: Vec3) {
        let [x, y] = this.wpos2XY(wpos);
        if (Math.abs(x - y) % 2 == 1) y++;
        // const cellkey = `${x},${y}`;
        // 判断本身是否有效
        const cell = this.getCellByXY(x, y);
        if (cell && cell.canMove) {
            return cell;
        }

        // 判断是否有缓存
        // const cellkey = cell?.key;
        const cellkey = this.wpos2number(wpos);
        if (cell && this.nearMap.has(cellkey)) {
            const [nx, ny] = this.nearMap.get(cellkey);
            return this.getCellByXY(nx, ny);
        }

        const queue = [cellkey];
        const visited = new Set();

        while (queue.length > 0) {
            const current = queue.shift();
            // const [x, y] = current.split(',').map(Number);
            const cCell = this.getCellByKey(current);
            if (!cCell || !cCell.real) continue;
            const [x, y] = [cCell.xy.x, cCell.xy.y]
            if (visited.has(current)) continue;
            visited.add(current);
            const neighbors = this.getNeighbors(x, y);
            // 判定哪个格子最近
            let distanceMin = Number.MAX_SAFE_INTEGER;
            let cellMin: MapCell = null;
            // let nearKey: string = '';
            let nearKey: number = 0;
            let near = [];
            for (const [nx, ny] of neighbors) {
                // const key = `${nx},${ny}`
                const key = this.xy2number(nx, ny);
                const nCell = this.getCellByXY(nx, ny)
                if (nCell?.canMove) {
                    // return cell; // 直接返回第一个找到的格子，有隐患
                    let distance = Vec3.distance(wpos, nCell.wPos);
                    if (distance < distanceMin) {
                        distanceMin = distance;
                        cellMin = nCell;
                        nearKey = key;
                        near = [nx, ny];
                    }
                }
                if (nx >= 0 && ny >= 0) queue.push(key);
            }
            // 返回最近的格子
            if (cellMin) {
                // console.log('缓存最近有效格子', cellkey, nearKey);
                // console.log('缓存最近有效格子', x, y, '>', near[0], near[1], cellMin);
                this.nearMap.set(cellkey, near); // 缓存
                return cellMin;
            }
        }
    }


    // 获取格子的所有邻居格子的坐标[x,y]
    protected getNeighbors(x: number, y: number) {
        const neighbors = [];
        /**优先四方 */
        for (let dir of this.directions) {
            neighbors.push([x + dir.x, y + dir.y]);
        }
        return neighbors;
    }

    // /** 返回目标附近指定格子距离以外(含)、指定数量的格子(由近到远)。 */
    // public getNeighborsWpos(target: Vec3, cellDistance: number = 1, count: number = 8) {
    //     const cell = this.getCellNearest(target);
    //     const cellkey = this.wpos2CellKey(cell.wPos);

    //     const quene = [cellkey];
    //     const visit = new Set<string>();
    //     const cells = new Set<string>();

    //     while (quene.length > 0) {
    //         if (count <= 0) break;
    //         const current = quene.shift();
    //         if (!current) break;
    //         if (visit.has(current)) continue;
    //         visit.add(current);

    //         const nears = this.getNeighbors(current);
    //         for (let near of nears) {
    //             if (cellkey == near) continue;
    //             let cell = this.cellMap.get(near);
    //             // 有效格子
    //             if (cell && cell.canMove) {
    //                 quene.push(near);
    //                 // 距离不足的格子跳过
    //                 const distance = this.getCellDistance(cellkey, near);
    //                 if (distance >= cellDistance) {
    //                     if (!cells.has(near)) {
    //                         cells.add(near);
    //                         console.log('push pos', near);
    //                         count--;
    //                         if (count <= 0) break;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     let result: Vec3[] = [];
    //     for (let key of cells) {
    //         result.push(this.cellMap.get(key).wPos);
    //     }
    //     return result;
    // }

    /** 返回目标附近指定格子距离以外(含)、指定数量的格子(由近到远)。 */
    public getNeighborsWpos(target: Vec3, cellDistance: number = 1, count: number = 8) {
        const cell = this.getCellNearest(target);
        const [x, y] = this.wpos2XY(target);
        // const cellkey = `${x},${y}`;

        const quene = [cell];
        const visit = new Set<MapCell>();
        const cells = new Set<MapCell>();

        while (quene.length > 0) {
            if (count <= 0) break;
            const current = quene.shift();
            // const [cx, cy] = current.split(',').map(Number);
            const [cx, cy] = [current.xy.x, current.xy.y];
            // if (!current) break;
            if (visit.has(current)) continue;
            visit.add(current);

            const nears = this.getNeighbors(cx, cy);
            for (let near of nears) {
                const [nx, ny] = near
                // const nearkey = `${nx},${ny}`
                const nearCell = this.getCellByXY(nx, ny);
                if (current == nearCell) continue;
                // let cell = this.cellMap.get(near);
                const cell = this.getCellByXY(nx, ny);
                // 有效格子
                if (cell && cell.canMove) {
                    quene.push(near);
                    // 距离不足的格子跳过
                    // const distance = this.getCellDistance(cellkey, near);
                    const distance = this.getCellDistance(v2(x, y), v2(near[0], near[1]));
                    if (distance >= cellDistance) {
                        if (!cells.has(nearCell)) {
                            cells.add(nearCell);
                            // console.log('push pos', near);
                            count--;
                            if (count <= 0) break;
                        }
                    }
                }
            }
        }
        let result: Vec3[] = [];
        for (let cell of cells) {
            result.push(cell.wPos);
        }
        return result;
    }

    /** TODO 返回目标个各方向指定格子距离以外(含)、指定数量的格子(由近到远)。 */
    public getNeighborsWposByDirection(target: Vec3, cellDistance: number = 1, count: number = 8) {
        // const cellkey = this.wpos2CellKey(target);

        // const quene = [cellkey];
        // const visit = new Set<string>();
        // const cells = new Set<string>();

        // while (quene.length > 0) {
        //     if (count <= 0) break;
        //     const current = quene.shift();
        //     if (!current) break;
        //     if (visit.has(current)) continue;
        //     visit.add(current);

        //     const nears = this.getNeighbors(current);
        //     for (let near of nears) {
        //         if (cellkey == near) continue;
        //         let cell = this.cellMap.get(near);
        //         // 有效格子
        //         if (cell && cell.canMove) {
        //             quene.push(near);
        //             // 距离不足的格子跳过
        //             const distance = this.getCellDistance(cellkey, near);
        //             if (distance >= cellDistance) {
        //                 if (!cells.has(near)) {
        //                     cells.add(near);
        //                     console.log('push pos', near);
        //                     count--;
        //                     if (count <= 0) break;
        //                 }
        //             }
        //         }
        //     }
        // }
        // let result: Vec3[] = [];
        // for (let key of cells) {
        //     result.push(this.cellMap.get(key).wPos);
        // }
        // return result;
    }

    // 计算两个格子之间的曼哈顿距离
    protected getDistance(a: MapCell, b: MapCell): number {
        return Math.abs(a.wPos.x - b.wPos.x) + Math.abs(a.wPos.z - b.wPos.z);
    }

    /** 获取两个格子数据坐标的距离 */
    protected getCellDistance(a: Vec2, b: Vec2): number {
        let disX = Math.abs(a.x - b.x);
        let disY = Math.abs(a.y - b.y);
        const distance = Math.sqrt(disX ** 2 + disY ** 2);
        return distance;
    }

    // // A*寻路算法
    // getAstarPath(start: Vec3, target: Vec3): Vec3[] {
    //     if (!this.cellMap) this.loadMapCells()

    //     const startCell = this.getCellNearest(start);
    //     const endCell = this.getCellNearest(target);

    //     if (!startCell || !endCell || !endCell.canMove) {
    //         return [];
    //     }

    //     const openSet: MapCell[] = [startCell];
    //     const closedSet: Set<MapCell> = new Set();
    //     const cameFrom: Map<MapCell, MapCell> = new Map();
    //     const gScore: Map<MapCell, number> = new Map();
    //     const fScore: Map<MapCell, number> = new Map();

    //     gScore.set(startCell, 0);
    //     fScore.set(startCell, this.getDistance(startCell, endCell));

    //     while (openSet.length > 0) {
    //         // 找到 fScore 最小的节点
    //         let current = openSet[0];
    //         let currentIndex = 0;
    //         for (let i = 1; i < openSet.length; i++) {
    //             if ((fScore.get(openSet[i]) || Infinity) < (fScore.get(current) || Infinity)) {
    //                 current = openSet[i];
    //                 currentIndex = i;
    //             }
    //         }

    //         // 到达目标
    //         if (current === endCell) {
    //             const path: Vec3[] = [];
    //             while (cameFrom.has(current)) {
    //                 path.unshift(current.wPos);
    //                 current = cameFrom.get(current)!;
    //             }
    //             return path;
    //         }

    //         // 从 openSet 中移除 current
    //         openSet.splice(currentIndex, 1);
    //         closedSet.add(current);

    //         // 检查所有邻居
    //         const [cx, cy] = this.wpos2XY(current.wPos);
    //         // const neighbors = this.getNeighbors(this.wpos2CellKey(current.wPos));
    //         const neighbors = this.getNeighbors(cx, cy);
    //         for (let neighbor of neighbors) {
    //             let ncell = this.cellMap.get(neighbor);
    //             if (closedSet.has(ncell)) {
    //                 continue;
    //             }

    //             const tentativeGScore = (gScore.get(current) || Infinity) + this.getDistance(current, ncell);

    //             if (openSet.indexOf(ncell) < 0) {
    //                 openSet.push(ncell);
    //             } else if (tentativeGScore >= (gScore.get(ncell) || Infinity)) {
    //                 continue;
    //             }

    //             cameFrom.set(ncell, current);
    //             gScore.set(ncell, tentativeGScore);
    //             fScore.set(ncell, tentativeGScore + this.getDistance(ncell, endCell));
    //         }
    //     }

    //     return []; // 没有找到路径
    // }

    // A*寻路算法
    getAstarPath(start: Vec3, target: Vec3): Vec3[] {
        const startCell = this.getCellNearest(start);
        const endCell = this.getCellNearest(target);

        if (!startCell || !endCell || !endCell.canMove) {
            return [];
        }
        if (startCell === endCell) return [target]

        const t1 = performance.now()

        const openSet: MapCell[] = [startCell];
        const closedSet: Set<MapCell> = new Set();
        const cameFrom: Map<MapCell, MapCell> = new Map();
        const gScore: Map<MapCell, number> = new Map();
        const fScore: Map<MapCell, number> = new Map();

        gScore.set(startCell, 0);
        fScore.set(startCell, this.getDistance(startCell, endCell));

        while (openSet.length > 0) {
            // 找到 fScore 最小的节点
            let current = openSet[0];
            let currentIndex = 0;
            for (let i = 1; i < openSet.length; i++) {
                if ((fScore.get(openSet[i]) || Infinity) < (fScore.get(current) || Infinity)) {
                    current = openSet[i];
                    currentIndex = i;
                }
            }

            // 到达目标
            if (current === endCell) {
                const path: Vec3[] = [];
                while (cameFrom.has(current)) {
                    path.unshift(current.wPos);
                    current = cameFrom.get(current)!;
                }
                const cost = performance.now() - t1;
                console.log('寻路', start, '>', target, '耗时:', cost);
                return path;
            }

            // 从 openSet 中移除 current
            openSet.splice(currentIndex, 1);
            closedSet.add(current);

            // 检查所有邻居
            const [cx, cy] = this.wpos2XY(current.wPos);
            // const neighbors = this.getNeighbors(this.wpos2CellKey(current.wPos));
            // for (const dir of this.di)
            // const neighbors = this.getNeighbors(cx, cy);
            let hasObs = false;
            for (const dir of this.directions) {
                const nx = dir.x;
                const ny = dir.y;
                const key = dir.key;
                const ncell = this.getCellByXY(cx + nx, cy + ny);
                if (key > 3 && hasObs) break;
                // for (let [nx, ny] of neighbors) {
                //     let ncell = this.getCellByXY(nx, ny);
                if (!ncell?.canMove) {
                    hasObs = true;
                    continue;
                }
                if (closedSet.has(ncell)) continue;

                const tentativeGScore = (gScore.get(current) || Infinity) + this.getDistance(current, ncell);

                if (openSet.indexOf(ncell) < 0) {
                    openSet.push(ncell);
                } else if (tentativeGScore >= (gScore.get(ncell) || Infinity)) {
                    continue;
                }

                cameFrom.set(ncell, current);
                gScore.set(ncell, tentativeGScore);
                fScore.set(ncell, tentativeGScore + this.getDistance(ncell, endCell));
            }
        }

        return []; // 没有找到路径
    }

    // @property({
    //     displayName: '流场避障系数',
    //     tooltip: '在创建流场时，避障向量的系数，用于调整避障的强度。',
    //     min: 0, max: 2, step: 0.1, slide: true,
    //     group: { id: '流场设置', name: '流场设置' }
    // })
    // flowAwayFromObsValue: number = 0.5;
    @property({ displayName: '流场最大格子数', group: { id: '流场设置', name: '流场设置' } })
    protected maxFlowCellCount = 1000;
    @property({ displayName: '流场平均:权重', tooltip: "获取流场时将周围向量的平均向量按权重相加", group: { id: '流场设置', name: '流场设置' } })
    protected flowAverageWeight = 0.25;
    // protected vecMap: Map<string, number> = new Map<string, number>(); // 向量 特征:索引
    /**向量 特征:索引 */
    protected vecMap: Map<number, number> = new Map();
    /**向量列表 */
    private vecList: Vec3[] = [];

    /** 流场字典 */
    protected flows: Map<number, MapCellFlow> = new Map();

    /** 设置并返回避障向量特征值
     * @param feature 特征值
     * @param vec 位数
     */
    protected setDirectionFeature(feature: number, dirKey: number) {
        feature = feature | 1 << dirKey;
        return feature;
    }

    /**定义8个方向， 先四方后四角 */
    // protected directions = [
    //     { x: 1, y: 0, key: 0 }, { x: -1, y: 0, key: 1 },
    //     { x: 0, y: 1, key: 2 }, { x: 0, y: -1, key: 3 },
    //     { x: 1, y: 1, key: 4 }, { x: -1, y: 1, key: 5 },
    //     { x: 1, y: -1, key: 6 }, { x: -1, y: -1, key: 7 }
    // ]
    // /**8方向移动代价 */
    // // protected costMap = [
    // //     // [0, 1], [1, 1],
    // //     // [2, 1], [3, 1],
    // //     // [4, Math.SQRT2], [5, Math.SQRT2],
    // //     // [6, Math.SQRT2], [7, Math.SQRT2],
    // //     1, 1, 1, 1, Math.SQRT2, Math.SQRT2, Math.SQRT2, Math.SQRT2
    // // ];

    sqrt45 = Math.SQRT2 / 2;
    _direction45 = [
        { x: 1, y: 1, dir: v2(-this.sqrt45, -this.sqrt45), key: 0 },
        { x: -1, y: 1, dir: v2(this.sqrt45, -this.sqrt45), key: 1 },
        { x: 1, y: -1, dir: v2(-this.sqrt45, this.sqrt45), key: 2 },
        { x: -1, y: -1, dir: v2(this.sqrt45, this.sqrt45), key: 3 },
        { x: 2, y: 0, dir: v2(-1, 0), key: 4 },
        { x: -2, y: 0, dir: v2(1, 0), key: 5 },
        { x: 0, y: 2, dir: v2(0, -1), key: 6 },
        { x: 0, y: -2, dir: v2(0, 1), key: 7 },
    ]
    _direction0 = [
        { x: 1, y: 0, dir: v2(-1, 0), key: 0 },
        { x: -1, y: 0, dir: v2(1, 0), key: 1 },
        { x: 0, y: 1, dir: v2(0, -1), key: 2 },
        { x: 0, y: -1, dir: v2(0, 1), key: 3 },
        { x: 1, y: 1, dir: v2(-this.sqrt45, -this.sqrt45), key: 4 },
        { x: -1, y: 1, dir: v2(this.sqrt45, -this.sqrt45), key: 5 },
        { x: 1, y: -1, dir: v2(-this.sqrt45, this.sqrt45), key: 6 },
        { x: -1, y: -1, dir: v2(this.sqrt45, this.sqrt45), key: 7 }
    ]

    protected get directions() {
        if (this.mode45) return this._direction45;
        else return this._direction0;
    }
    protected get costMap() {
        if (this.mode45) return [this.sqrt45, this.sqrt45, this.sqrt45, this.sqrt45, 1, 1, 1, 1];
        else return [1, 1, 1, 1, Math.SQRT2, Math.SQRT2, Math.SQRT2, Math.SQRT2];
    }
    createFlow(target: Vec3, max: boolean = false) {
        if (this.cellArray.length == 0) {
            console.error('cellArray.length', this.cellArray.length);
            return;
        }

        let time1 = performance.now()
        const [x, y] = this.wpos2XY(target);
        const cellKey = this.xy2number(x, y);
        if (!cellKey) return null;
        if (this.isTimeOut) {
            this.task_flow.push(cellKey);
            return; // 防止频繁调用
        }

        // 初始化流场网格，使用Map存储每个格子的流场信息
        const flowField = new Map();
        // 记录已访问的格子，使用Set避免重复访问
        const visited = new Set<MapCell>();
        // 使用队列进行广度优先搜索
        const queue = [];
        let cellCount = 0;

        // 设置目标点，初始代价为0，方向为零向量
        let idx = this.setFeatureVec(0, Vec3.ZERO);
        flowField.set(cellKey, { cost: 0, feature: 0, index: idx, direction: new Vec3(0, 0, 0) });
        queue.push(cellKey);

        let awayFromObstacle = new Vec3(0, 0, 0);

        // 开始广度优先搜索，构建流场
        let queneIndex = 0;
        // const direction = new Vec3(0, 0, 0);
        while (queue.length > queneIndex) {
            cellCount++;
            if (!max && cellCount > this.maxFlowCellCount) break;
            const currentKey = queue[queneIndex++];
            if (visited.has(currentKey)) continue;
            visited.add(currentKey);
            const current = flowField.get(currentKey);
            const cCell = this.getCellByKey(currentKey);
            if (!cCell || !cCell.canMove) continue;
            const [cx, cy] = [cCell.xy.x, cCell.xy.y];

            // 避障向量
            awayFromObstacle.set(0, 0, 0);
            // 避障特征
            let awayFromObsFeature = 0;
            let feature = 0;
            let hasObs = false;
            // 向量特征

            // 检查所有相邻格子
            for (const dir of this.directions) {
                const nx = cx + dir.x;
                const ny = cy + dir.y;
                const dKey = dir.key;

                // 检查是否是有效格子（不是障碍物）
                if (!this.isValidCell(nx, ny)) {
                    hasObs = true;
                    // if (this.flowAwayFromObsValue > 0 && dKey < 4) {
                    //     awayFromObsFeature = this.setDirectionFeature(awayFromObsFeature, dKey + 8); // 8-16位存储避障编码
                    //     const fv = this.getFeatureVec(awayFromObsFeature)
                    //     if (fv) awayFromObstacle.set(fv);
                    //     else {
                    //         this.addObsDirection(awayFromObstacle, dir);
                    //         this.setFeatureVec(awayFromObsFeature, awayFromObstacle.clone());
                    //         // console.log('添加避障向量', awayFromObsFeature, awayFromObstacle);
                    //     }
                    // }
                    continue;
                }
                if (hasObs && dKey > 3) continue;

                if (nx < 0 || ny < 0) continue
                const neighborKey = this.xy2number(nx, ny);
                // 计算移动代价（考虑对角线移动）
                const moveCost = this.costMap[dKey];
                // 计算总代价
                const totalCost = current.cost + moveCost;

                // 如果找到更好的路径，更新流场
                if (!flowField.has(neighborKey) || totalCost < flowField.get(neighborKey).cost) {
                    // 计算从邻居格子回到当前格子的方向
                    let feature = this.setDirectionFeature(0, dKey);
                    let idx = -1;
                    let direction: Vec3;
                    if (this.vecMap.has(feature)) {
                        idx = this.vecMap.get(feature);
                        direction = this.getVec(idx);
                    }
                    else {
                        // direction = this.createFlowVec(cx, cy, nx, ny);
                        direction = this.createFlowVec(dir.dir);
                        idx = this.setFeatureVec(feature, direction);
                    }

                    // 更新流场信息
                    flowField.set(neighborKey, {
                        cost: totalCost,
                        feature: feature,
                        index: idx,
                        direction: direction
                    });
                    queue.push(neighborKey);
                }
            }
            // // 流场避障
            // if (this.flowAwayFromObsValue > 0) {
            //     if (current.direction.length() == 0) continue;
            //     if (awayFromObstacle.length() == 0) continue;
            //     awayFromObstacle = this.formatObsDirection(awayFromObstacle);
            //     feature = current.feature | awayFromObsFeature;
            //     let direction = current.direction.clone().add(awayFromObstacle).normalize();
            //     // console.log(current.direction, '避障', feature, direction);
            //     let idx = this.setFeatureVec(feature, direction);
            //     flowField.set(currentKey, {
            //         cost: current.cost,
            //         feature: feature,
            //         index: idx,
            //         direction: direction
            //     })
            // }
        }

        let flow = new MapCellFlow();
        flowField.forEach((value, key) => flow.flows.set(key, value.index));
        flow.cellKey = cellKey;
        let time2 = performance.now()
        const [r, c, s] = this.getMapSize()
        const cost = time2 - time1;
        // console.log(`创建流场 ${x},${y}`, flow.flows.size, '/', s, '耗时', cost, 'ms')
        this.flows.set(cellKey, flow);
        this.scriptFrameTime += cost;
        // console.log(this.vecMap);
        // console.log(this.vecList);
        // console.log(flow);
        if (flow.flows.size > 0) {
            return flow;
        }
    }

    /** 从向量列表获取向量 */
    protected getVec(index: number) {
        if (this.vecList.length > index && index >= 0) {
            return this.vecList[index].clone();
        }
    }

    /** 清空向量 */
    protected clearVec() {
        this.vecList = [];
    }


    /** 创建流场向量 */
    // protected createFlowVec(cx: number, cy: number, nx: number, ny: number) {
    //     if (this.mode45) return new Vec3(
    //         cx - nx,
    //         0,
    //         cy - ny
    //     ).normalize();
    //     else return new Vec3(
    //         cx - nx,
    //         0,
    //         cy - ny
    //     ).normalize();
    // }
    protected createFlowVec(direction: Vec2) {
        return v3(
            direction.x,
            0,
            direction.y
        )
    }

    /** 设置特征对应的向量 */
    protected setFeatureVec(feature: number, direction: Vec3) {
        if (this.vecMap.has(feature)) return this.vecMap.get(feature);
        if (!direction) return;
        let d = direction.clone();
        this.vecList.push(d);
        let index = this.vecList.length - 1;
        this.vecMap.set(feature, index);
        return index;
    }

    /** 获取特征对应的向量 */
    protected getFeatureVec(feature: number) {
        if (this.vecMap.has(feature)) {
            const index = this.vecMap.get(feature);
            return this.getVec(index);
        }
    }

    protected getFeatureIndex(feature: number) {
        if (this.vecMap.has(feature)) return this.vecMap.get(feature);
    }

    protected addObsDirection(awayFromObstacle: Vec3, dir: { x: number, y: number, dir: Vec2 }) {
        // awayFromObstacle.add(new Vec3(-dir.x, 0, -dir.y));
        awayFromObstacle.add(new Vec3(dir.dir.x, 0, dir.dir.y));
    }

    /** 格式化避障向量 */
    protected formatObsDirection(awayFromObstacle: Vec3) {
        awayFromObstacle.y = 0;
        awayFromObstacle.normalize()//.multiplyScalar(this.flowAwayFromObsValue);
        return awayFromObstacle;
    }

    /**获取到目标点的流场,没有则创建 */
    public getFlow(target: Vec3) {
        const cellNear = this.getCellNearest(target);
        if (!cellNear || !cellNear.canMove) return null;
        // const cellKey = `${cellNear.x},${cellNear.y}`
        const cellkey = cellNear.key;
        if (!cellkey) return null;
        if (this.flows.has(cellkey)) return this.flows.get(cellkey);
        else return this.createFlow(cellNear.wPos);
    }

    /**获取目标流场的当前格子信息 */
    public getFlowCell(self: Vec3, target: Vec3, average: boolean = true) {
        const flow = this.getFlow(target);
        if (!flow) return;

        const vec = v3(0, 0, 0);

        // const cell = this.getCellNearest(self);

        let cell = this.getCell(self);
        if (!cell?.canMove) {
            // 指向临近可用格子
            // console.log(target, this.wpos2XY(target), cell)
            cell = this.getCellNearest(self);
            if (!cell) {
                // console.log(self, this.wpos2XY(self), cell)
                return v3(0, 0, 0);
            }
            vec.set(cell.wPos.clone().subtract(self).normalize());
            // return vec
        }
        else {
            const cellKey = cell.key;
            const flowcell = flow.flows.get(cellKey);
            vec.set(this.getVec(flowcell));
        }

        const cellKey = cell.key;
        const flowcell = flow.flows.get(cellKey);
        vec.set(this.getVec(flowcell));

        const [x, y] = [cell.xy.x, cell.xy.y];
        if (vec && vec.length() && average && this.flowAverageWeight) { // 与格子周围的流场向量进行平均
            const vecAdd = v3(0, 0, 0);
            const neighbors = this.getNeighbors(x, y);
            for (const n of neighbors) {
                const [nx, ny] = n;
                if (nx < 0 || ny < 0) continue;
                const nearkey = this.xy2number(nx, ny);
                const vec2 = this.getVec(flow.flows.get(nearkey));
                if (vec2) vecAdd.add(vec2);
            }
            vec.add(vecAdd.multiplyScalar(this.flowAverageWeight)).normalize();
        }
        return vec;
    }

    /** 判断坐标是否障碍 */
    wposInObs(wpos: Vec3) {
        const cell = this.getCell(wpos);
        if (cell?.real) return !cell?.canMove;
        return true;
    }

    /** 获取目标位置周围的所有障碍格子 */
    public getObss(wpos: Vec3) {
        const cell = this.getCell(wpos);
        if (!cell?.real) return [];

        const obss: MapCell[] = [];
        for (const dir of this.directions) {
            const nx = dir.x;
            const ny = dir.y;
            const cellNear = this.getCellByXY(cell.xy.x + nx, cell.xy.y + ny);
            if (cellNear?.real && !cellNear.canMove) obss.push(cellNear);
        }
        return obss;
    }

    /** 获取障碍斥力的单位向量 */
    public getObsVec(wpos: Vec3) {
        const cellKey = this.wpos2number(wpos);

        const cell = this.getCell(wpos);
        let awayFromObstacle = v3(0, 0, 0);
        if (cell?.real) {
            for (const dir of this.directions) {
                const nx = dir.x;
                const ny = dir.y;
                // const dKey = dir.key;
                const cellNear = this.getCellByXY(cell.xy.x + nx, cell.xy.y + ny);
                const direction = Vec3.subtract(v3(0, 0, 0), wpos, cellNear.wPos);
                const distance = direction.length();
                if (distance)
                    awayFromObstacle.add(direction.multiplyScalar(this.cellSize / distance));
            }
        }
        return awayFromObstacle;
    }

    /**
     * 获取指定半径圆周上的格子
     * @param centerX - 中心格子X坐标
     * @param centerY - 中心格子Y坐标
     * @param radius - 半径（格子数）
     * @returns 该半径圆周上的所有格子key数组
     */
    protected getCellsAtRadius(centerX: number, centerY: number, radius: number) {
        // const cellKeys: string[] = [];
        const xys = [];

        // 遍历正方形范围
        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                // 使用切比雪夫距离判断是否在圆周上
                const chebyshevDist = Math.max(Math.abs(dx), Math.abs(dy));
                if (chebyshevDist === radius) {
                    const x = centerX + dx;
                    const y = centerY + dy;
                    // cellKeys.push(`${x},${y}`);
                    xys.push([x, y]);
                }
            }
        }

        return xys;
    }

    /**
     * 检查从起点到终点的直线上所有格子是否都有效
     * @param from - 起点世界坐标
     * @param to - 终点世界坐标
     * @returns 如果直线上所有格子都有效返回true，否则返回false
     */
    protected checkLineOfSight(from: Vec3, to: Vec3): boolean {
        // 转换为格子坐标
        // const fromKey = this.wpos2CellKey(from);
        // const toKey = this.wpos2CellKey(to);
        // const [x0, y0] = fromKey.split(',').map(Number);
        // const [x1, y1] = toKey.split(',').map(Number);
        const cellFrom = this.getCell(from)
        const cellTo = this.getCell(to)
        const [x0, y0] = [cellFrom.xy.x, cellFrom.xy.y]
        const [x1, y1] = [cellTo.xy.x, cellTo.xy.y]

        // 使用Bresenham直线算法遍历所有经过的格子
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;

        let x = x0;
        let y = y0;

        while (true) {
            // 检查当前格子是否有效
            if (!this.isValidCell(x, y)) {
                return false;
            }

            // 到达终点
            if (x === x1 && y === y1) {
                break;
            }

            // 计算下一步
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }
        }

        return true;
    }

    /**
     * 获取以指定坐标为圆心、指定半径的圆周上的有效格子（均匀分布）
     * @param centerPos - 中心世界坐标A
     * @param radius - 初始半径B（格子数）
     * @param count - 需要的数量C
     * @returns 有效格子的世界坐标数组（均匀分布）
     */
    getCellsInRadius(centerPos: Vec3, radius: number, count: number): Vec3[] {
        let currentRadius = radius;

        // 将世界坐标转换为格子坐标
        const tile = this.getCellNearest(centerPos);

        // const centerKey = this.wpos2CellKey(tile.wPos);
        const [x, y] = this.wpos2XY(centerPos);
        const centerKey = `${x},${y}`
        const [centerX, centerY] = centerKey.split(',').map(Number);

        // 循环扩大半径直到找到足够数量的格子
        while (true) {
            // 获取当前半径圆周上的格子
            // const cellKeys = this.getCellsAtRadius(centerX, centerY, currentRadius);
            const xys = this.getCellsAtRadius(centerX, centerY, currentRadius);

            // 收集当前半径所有有效的格子及其角度
            const validCellsWithAngle: { pos: Vec3, angle: number }[] = [];

            // 筛选并验证每个格子
            for (const [cx, cy] of xys) {
                // const cell = this.cellMap.get(cellKey);
                const cell = this.getCellByXY(cx, cy);

                // 检查格子是否存在且可移动
                if (!cell || !cell.canMove) continue;

                // 直线检测：检查中心到目标格子之间是否有障碍物
                if (!this.checkLineOfSight(tile.wPos, cell.wPos)) continue;

                // 计算角度（用于后续均匀分布）
                const dx = cell.wPos.x - tile.wPos.x;
                const dz = cell.wPos.z - tile.wPos.z;
                const angle = Math.atan2(dz, dx);

                // 通过所有验证，添加到候选数组
                validCellsWithAngle.push({ pos: cell.wPos, angle: angle });
            }

            // 如果找到足够的格子，进行均匀选择
            if (validCellsWithAngle.length >= count) {
                // 按角度排序
                validCellsWithAngle.sort((a, b) => a.angle - b.angle);

                // 均匀选择count个格子
                const result: Vec3[] = [];
                const step = validCellsWithAngle.length / count;
                for (let i = 0; i < count; i++) {
                    const index = Math.floor(i * step);
                    result.push(validCellsWithAngle[index].pos);
                }

                console.log(`getCellsInRadius: 以半径 ${radius} 开始，最终半径 ${currentRadius}，找到 ${validCellsWithAngle.length} 个有效格子，均匀选择了 ${result.length} 个`);
                return result;
            }

            // 如果当前半径找不到足够的格子，扩大半径
            currentRadius++;

            // 安全检查：防止无限循环
            if (currentRadius > 100) {
                console.warn(`getCellsInRadius: 达到最大半径限制，只找到 ${validCellsWithAngle.length} 个格子`);
                // 返回所有找到的格子
                return validCellsWithAngle.map(item => item.pos);
            }
        }
    }

    /** 辅助方法：检查格子是否有效 */
    protected isValidCell(x: number, y: number): boolean {
        const cell = this.getCellByXY(x, y)
        // this.log(`${x},${y} ${cell?.canMove}`)
        return cell?.canMove;
    }

    /** 获取地图数据 */
    public getMapData() {
        const mapData = [];
        const is45 = this.mode45 ? 1 : 0;
        mapData.push([this.cellSize, is45])                                                 // 格子尺寸
        mapData.push([this.cellOffset.x, this.cellOffset.y])                        // 偏移
        const cellData = [];                                                        // 格子数据
        for (let x = 0; x < this.cellArray.length; x++) {
            const col = [];
            for (let y = 0; y < this.cellArray[x].length; y++) {
                const cell = this.cellArray[x][y];
                let canMove = -1;
                if (cell?.real) canMove = cell.canMove ? 1 : 0;
                col.push(canMove);
            }
            cellData.push(col);
        }
        mapData.push(cellData);
        // /** 向量列表 */
        // const vecs = [];
        // for (const vec of this.vecList) vecs.push([vec.x, vec.y, vec.z])
        // mapData.push(vecs);
        // /** 特征字典 */
        // const features = {};
        // this.vecMap.forEach((value, key) => {
        //     features[key] = value;
        // })
        // mapData.push(features);
        return mapData;
    }

    public loadMapData(filename: string = 'cellmap_default') {
        resources.load(filename, (err: any, res: JsonAsset) => {
            if (err) {
                console.log(err.message || err);
                this.loadMapCells();
                return;
            }
            // 获取到 Json 数据
            const jsonData: object = res.json!;
            this.loadMapCells(jsonData);
        })
    }

    /** 分帧执行任务 */

    /** 地图创建 */
    task_map: Vec2[] = [];
    _halfSize: number = 0;
    _halfSizeSQRT: number = 0;
    _count = 0;
    _count1 = 0;
    protected loadMapTask() {
        const size = this.cellSize * this.obsValue;
        this._halfSize = size / 2;
        this._halfSizeSQRT = this._halfSize * this.sqrt45;
        while (this.task_map.length > 0) {
            if (this.isTimeOut) return;
            // 执行任务
            const t1 = performance.now();
            const p = this.task_map.shift();
            const pos = this.pointPos(p);
            const [x, y] = this.wpos2XY(pos);
            const cell = this.getCellByXY(x, y);
            // console.log(pos, x, y)
            if (!cell) continue;
            this._count++
            cell.xy = v2(x, y);
            if (cell) {
                const canMove = this.checkCell(pos);
                cell.wPos.set(pos);
                cell.canMove = canMove;
                const key = this.xy2number(x, y);
                cell.key = key;
                this.cellMap.set(key, cell);
                this._count1++
                if (key < 0) this.log(`格子检测 ${x},${y} ${key} ${canMove}`)
            }
            /** 耗时计算 */
            const cost = performance.now() - t1;
            this.scriptFrameTime += cost;
        }
        /** 创建完成 */
        this.clear();
        this.log('格子检测完成!')
        // console.log(this._count1, this._count)
        // console.log(this.cellArray)
        // console.log(this.cellMap)
    }

    /** 流场创建 */
    task_flow: number[] = [];
    protected createFlowTask() {
        while (this.task_flow.length > 0) {
            if (this.isTimeOut) return;
            const key = this.task_flow.shift();
            const cell = this.cellMap.get(key);
            if (cell && cell.canMove) {
                this.createFlow(cell.wPos);
            }
        }
    }


    get isTimeOut() { return this.taskSplitMS != 0 && this.scriptFrameTime > this.taskSplitMS; }

    protected scriptFrameTime = 0;
    update(dt: number) {
        this.scriptFrameTime = 0;
        if (this.task_map.length > 0) this.loadMapTask();
        if (this.task_flow.length > 0) this.createFlowTask();
    }
}