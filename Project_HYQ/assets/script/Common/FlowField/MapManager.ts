import { _decorator, BoxCollider, Component, instantiate, isValid, Node, Prefab, Quat, Rect, Size, tween, UITransform, v2, v3, Vec3 } from "cc";
import { ColliderGroupTag, PrefabPathEnum } from "../CommonEnum";
import { GameInfo } from "../GameInfo";
import GlobalFlowFieldSystem from "./GlobalFlowFieldSystem";
// import AStarWrapper from "../common/comp/Astar/AStarWrapper";

const { ccclass, property } = _decorator;
const isOpenMapAstarVisualized: boolean = true;
@ccclass('MapManager')
/**地图流场管理 */
export class MapManager extends Component {


    @property({ type: Node, displayName: 'wall节点' })
    mapColliderNode: Node = null;

    // @property({type: Node, displayName: '参与寻路碰撞的建筑节点'})
    buildings: Node[] = [];

    /**----------     测试    ----------------- */

    @property({ type: Node, displayName: '地图数据测试添加节点' })
    mapTest: Node = null;


    /**----------      end    --------------------- */

    //创建A星寻路系统
    // private astarSystem: AStarWrapper = new AStarWrapper();
    // 创建流场寻路系统
    private globalFFSystem: GlobalFlowFieldSystem = new GlobalFlowFieldSystem();
    /** 地图宽度 */
    public mapWidth = 60//80;
    /** 地图高度 */
    public mapHeight = 70//60;
    //格子大小
    private cellSize = 1;

    //地图放大倍数
    private mapScale: number = 1;

    public buildingRects: Rect[] = [];

    private goMap: boolean[][] = [];

    private _checkFlowFieldInterval: number = 0;
    private _indexMap: Map<ColliderGroupTag, number> = new Map();
    private static readonly TEMP_VEC3: Vec3 = new Vec3();
    protected onLoad(): void {
        // GameInfo.instance.mapMgr = this;
    }
    protected start(): void {
        this.init();
    }
    init() {
        this._initBuildingRects();
        this._initStaticMap();
        //怪物用流场寻路
        this._initGlobalFFSystem();
        //跟随角色用A星寻路
        // this._initAstarSytem();
    }

    // 地图实际边界（公开以供边界检查）
    public mapMinX: number = 0;
    public mapMaxX: number = 0;
    public mapMinZ: number = 0;
    public mapMaxZ: number = 0;

    private _initBuildingRects() {
        this.buildingRects = [];
        const children = this.mapColliderNode.children;

        let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;

        for (let i = 0, len = children.length; i < len; i++) {
            const building = children[i];
            if (!building.active) {
                continue;
            }
            let rect = null;
            //TODO: 联动建筑管理, 获取带碰撞的建筑
            // if (building.getComponent(BuildingBase)) {
            //     rect = this.getRectWithNode(building, false, false);
            // } else {

            // }
            let isRotate = building.eulerAngles.y !== 0;
            rect = this.getRectWithNode(building, isRotate);
            if (rect) {
                this.buildingRects.push(rect);

                // 计算地图边界
                const left = rect.x - rect.width / 2;
                const right = rect.x + rect.width / 2;
                const top = rect.y - rect.height / 2;
                const bottom = rect.y + rect.height / 2;

                minX = Math.min(minX, left);
                maxX = Math.max(maxX, right);
                minZ = Math.min(minZ, top);
                maxZ = Math.max(maxZ, bottom);
            }
        }

        // 保存地图边界
        this.mapMinX = minX;
        this.mapMaxX = maxX;
        this.mapMinZ = minZ;
        this.mapMaxZ = maxZ;

        console.log(`[MapManager] 地图实际范围 - X: [${minX.toFixed(2)}, ${maxX.toFixed(2)}], Z: [${minZ.toFixed(2)}, ${maxZ.toFixed(2)}]`);
        console.log(`[MapManager] 地图尺寸 - 宽度: ${(maxX - minX).toFixed(2)}, 高度: ${(maxZ - minZ).toFixed(2)}`);

        // 建议合适的地图网格尺寸
        const suggestedWidth = Math.ceil((maxX - minX) / this.cellSize);
        const suggestedHeight = Math.ceil((maxZ - minZ) / this.cellSize);
        console.log(`[MapManager] 建议地图网格尺寸: ${suggestedWidth}x${suggestedHeight} (当前: ${this.mapWidth}x${this.mapHeight})`);
    }

    getRectWithNode(node: Node, isRotate: boolean, isFitMapScale: boolean = true) {
        let boxCollider = node.getComponent(BoxCollider);
        if (boxCollider) {
            let boxSize = boxCollider.size;
            let boxCenter = boxCollider.center;
            let pos = boxCenter.clone().add(node.worldPosition)
            let x = pos.x//-(boxSize.x*node.scale.x) / 2;
            let y = pos.z//-(boxSize.z *node.scale.z) / 2;
            let w = 0;
            let h = 0;
            if (isRotate) {
                w = boxSize.z * node.scale.z;
                h = boxSize.x * node.scale.x

            } else {
                w = boxSize.x * node.scale.x;
                h = boxSize.z * node.scale.z
            }
            if (isFitMapScale && this.mapScale > 0) {
                w = w * this.mapScale;
                h = h * this.mapScale;
            }

            return new Rect(x, y, w, h);
        }
        return null;
    }
    // private _initStaticMap() {
    //     let mapSize = new Size(this.mapWidth, this.mapHeight);
    //     let goMap: boolean[][] = new Array(mapSize.height);
    //     let gridSize = this.cellSize;

    //     /** 生成地图数据 */
    //     for (let i = 0; i < mapSize.height; i++) { // i 对应 Z 轴（行）
    //         goMap[i] = new Array(mapSize.width);
    //         for (let j = 0; j < mapSize.width; j++) { // j 对应 X 轴（列）
    //             let isIntersects: boolean = false;

    //             // 计算当前网格的世界坐标包围盒
    //             let gridLeft = j * gridSize;
    //             let gridRight = (j + 1) * gridSize;
    //             let gridTop = -i * gridSize; // 注意Z轴符号
    //             let gridBottom = -(i + 1) * gridSize;

    //             /** 判断格子上是否有障碍物或建筑 */
    //             for (let k = 0; k < this.buildingRects.length; k++) {
    //                 let buildRect = this.buildingRects[k];

    //                 // 检查矩形是否相交
    //                 if (!(gridLeft >= buildRect.x + buildRect.width || 
    //                     gridRight <= buildRect.x || 
    //                     gridBottom >= buildRect.y + buildRect.height || 
    //                     gridTop <= buildRect.y)) {
    //                     isIntersects = true;
    //                     break;
    //                 }
    //             }

    //             goMap[i][j] = !isIntersects;
    //             this.mapAstarVisualized(!isIntersects, gridSize, j, i);
    //         }
    //     }

    //     this.goMap = goMap;
    // }
    private _initStaticMap() {
        let mapSize = new Size(this.mapWidth, this.mapHeight);
        let goMap: boolean[][] = [];
        let girdSize = this.cellSize;

        // 使用地图原点偏移
        const originX = this.mapMinX;
        const originZ = this.mapMaxZ;

        console.log(`[_initStaticMap] 开始生成地图 - 原点: (${originX.toFixed(2)}, ${originZ.toFixed(2)}), 网格尺寸: ${mapSize.width}x${mapSize.height}`);

        // 调试：输出第一个网格和第一个建筑物的信息
        if (this.buildingRects.length > 0) {
            const firstBuilding = this.buildingRects[0];
            console.log(`[_initStaticMap] 第一个建筑物 - 位置: (${firstBuilding.x.toFixed(2)}, ${firstBuilding.y.toFixed(2)}), 尺寸: ${firstBuilding.width.toFixed(2)}x${firstBuilding.height.toFixed(2)}`);
        }

        /** 生成地图数据 */
        for (let i = 0; i < mapSize.height; i++) {
            let line: boolean[] = [];
            for (let j = 0; j < mapSize.width; j++) {
                let isIntersects: boolean = false;
                /** 判断格子上是否有障碍物或建筑 包围盒判定 */
                for (let k = 0; k < this.buildingRects.length; k++) {
                    // 网格矩形需要考虑地图原点偏移
                    let girdRect: Rect = new Rect(
                        originX + j * girdSize + girdSize / 2,
                        originZ - (i * girdSize + girdSize / 2),
                        girdSize,
                        girdSize
                    );

                    // 调试：输出前几个网格的信息
                    if (i === 0 && j < 3) {
                        console.log(`[_initStaticMap] 网格(${j}, ${i}) -> 世界坐标: (${girdRect.x.toFixed(2)}, ${girdRect.y.toFixed(2)})`);
                    }

                    let buildRect = this.buildingRects[k];
                    if (((girdRect.x - girdRect.width / 4 > buildRect.x - buildRect.width / 2 && girdRect.x - girdRect.width / 4 < buildRect.x + buildRect.width / 2) ||
                        (girdRect.x - girdRect.width / 4 < buildRect.x - buildRect.width / 2 && girdRect.x + girdRect.width / 4 > buildRect.x - buildRect.width / 2)) &&
                        ((girdRect.y - girdRect.height / 4 > buildRect.y - buildRect.height / 2 && girdRect.y - girdRect.height / 4 < buildRect.y + buildRect.height / 2) ||
                            (girdRect.y - girdRect.height / 4 < buildRect.y - buildRect.height / 2 && girdRect.y + girdRect.height / 4 > buildRect.y - buildRect.height / 2))) {
                        isIntersects = true;
                        break;
                    }
                }
                if (isIntersects) {
                    line.push(false);
                    this.mapAstarVisualized(false, girdSize, j, i);
                } else {
                    line.push(true);
                    this.mapAstarVisualized(true, girdSize, j, i);
                }
            }
            goMap.push(line);
        }
        this.goMap = goMap;
        console.log(this.goMap)
    }
    /** 地图寻路可视化展示 */
    public mapAstarVisualized(isGoMap: boolean, girdSize: number, x: number, y: number) {
        if (!isOpenMapAstarVisualized) return;
        let item: Node = null;
        let scale = v3(girdSize, 0, girdSize);
        if (isGoMap) {
            item = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.MapTestItem1);
            return
        } else {
            item = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.MapTestItem2);
            scale = v3(girdSize, 5, girdSize);
        }
        this.mapTest.addChild(item);
        item.active = true;
        item.setScale(scale);

        // 坐标转换：x是j（列），y是i（行）
        const originX = this.mapMinX;
        const originZ = this.mapMaxZ;
        let wpos = new Vec3(
            originX + x * girdSize + girdSize / 2,
            1.5,
            originZ - y * girdSize + girdSize / 2
        );
        item.setWorldPosition(wpos);

        // 调试：验证坐标转换
        if (x < 3 && y < 3) {
            console.log(`[地图可视化] 网格(${x}, ${y}) -> 世界坐标${wpos.toString()}`);
        }
    }

    update(dt: number) {
        if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin) return;
        this._checkFlowFieldInterval += dt;
        if (this._checkFlowFieldInterval >= 0.3) {
            this._checkFlowFieldInterval = 0;
            this._updateAllHeroFlowFieldData();
        }

        this.globalFFSystem.onUpdate(dt);
    }

    //检查世界坐标位置是否在可通行区域内
    // isValidPoint(p: Vec3) {
    //     if (this.astarSystem.isValid) {
    //         return this.astarSystem.isValidPoint(p);
    //     } else if (this.globalFFSystem.isValid) {
    //         return this.globalFFSystem.isWorldPositionTraversable(p.x, p.z);
    //     }
    // }

    //-------------------------------------- 流场寻路相关 -----------------------------------------
    private _initGlobalFFSystem() {
        // 初始化全局流场系统
        // originX: 地图左边界
        // originZ: 地图上边界（Z最大值，因为Z向下为负）
        const originX = this.mapMinX;
        const originZ = this.mapMaxZ;

        console.log(`[MapManager] 流场系统原点: (${originX.toFixed(2)}, ${originZ.toFixed(2)})`);

        this.globalFFSystem.init(
            this.goMap,        // 地图数据
            this.mapWidth,     // 地图宽度
            this.mapHeight,    // 地图高度
            this.cellSize,     // 格子大小
            originX,           // 地图原点X
            originZ            // 地图原点Z
        );
    }
    //添加目标点位置索引
    addTargetToFlowFieldSystem(pos: Vec3, colliderGroup: ColliderGroupTag) {
        let index = this.globalFFSystem.addTarget(pos.x, pos.z);
        this._indexMap.set(colliderGroup, index);
    }

    removeTargetFromFlowFieldSystem(colliderGroup: ColliderGroupTag) {
        let index = this._indexMap.get(colliderGroup);
        if (index !== undefined) {
            this.globalFFSystem.removeTarget(index);
            this._indexMap.delete(colliderGroup);
        }
    }

    getFlowDirection(selfRole: Node, targetPos: Vec3, colliderGroup: ColliderGroupTag): Vec3 {
        let pos = selfRole.worldPosition;
        let index = this._indexMap.get(colliderGroup);

        // 添加调试信息
        if (index === undefined || index < 0) {
            console.warn("未找到目标索引:", colliderGroup);
            return Vec3.ZERO;
        }

        // // 使用优化后的流场方向
        // let direction = this.globalFFSystem.getOptimizedFlowDirection(pos.x, pos.z, index, targetPos);
        // let direction = this.globalFFSystem.getFlowDirection(pos.x, pos.z, index);

        // 获取流场方向
        return this.globalFFSystem.getFlowDirection(pos.x, pos.z, index);
        // 平滑处理方向
        // const smoothedDirection = this.globalFFSystem.smoothPathMovement(pos.x, pos.z, flowDirection, targetPos);
        // return smoothedDirection;
    }


    //更新英雄和跟随点的流场数据
    private _updateAllHeroFlowFieldData() {

        let hero = GameInfo.instance.player;
        let index = this._indexMap.get(ColliderGroupTag.Player);
        //后续需要改为跟随节点, 而不是主角的世界坐标
        this.globalFFSystem.updateTargetPos(index, hero.node.worldPosition.x, hero.node.worldPosition.z);


        let arr: Node[] = [GameInfo.instance.player.node];
        arr.forEach(p => {
            let index = this._indexMap.get(ColliderGroupTag.Player);
            if (index !== undefined && index >= 0) {
                this.globalFFSystem.updateTargetPos(index, p.worldPosition.x, p.worldPosition.z);
            }
        });
    }
    // /**
    //  * 检查世界坐标位置是否在流场的可通行区域内
    //  * @param worldX 世界X坐标
    //  * @param worldZ 世界Z坐标
    //  * @returns 是否可通行
    //  */
    // public isWorldPositionTraversable(worldX: number, worldZ: number): boolean {
    //     return this.globalFFSystem.isWorldPositionTraversable(worldX, worldZ);
    // }
    //----------------------------------------------A星寻路相关 ----------------------------------
    // private _initAstarSytem() {
    //     //初始化A*系统
    //     this.astarSystem.InitWithMapData(
    //         this.goMap,
    //         this.mapWidth,
    //         this.mapHeight,
    //         this.cellSize);
    // }
    // /** A星获取寻路 */
    // public astarSearch(startPoint: Vec3, endPoint: Vec3) {
    //     if (this.astarSystem.AstarSearch(startPoint, endPoint)) {
    //         let roadData: Array<any> = this.astarSystem.GetFilterRoadData();
    //         for (let index = 0; index < roadData.length; index++) {
    //             roadData[index].z = -roadData[index].z;
    //             roadData[index].y = startPoint.y;
    //         }
    //         roadData[0] = startPoint.clone();
    //         roadData[roadData.length - 1] = endPoint.clone();
    //         return roadData;
    //     } else {
    //         console.log("AStarMapPathFind: 获取路径失败");
    //         return [startPoint.clone(), endPoint.clone()];
    //     }
    // }




    //   /** 获取寻路 */
    //     public astarSearch(startPoint: Vec3, endPoint: Vec3) {
    //         if (this.astar.AstarSearch(startPoint, endPoint)) {
    //             let roadData: Array<any> = this.astar.GetFilterRoadData();
    //             for (let index = 0; index < roadData.length; index++) {
    //                 roadData[index].z = -roadData[index].z;
    //                 roadData[index].y = startPoint.y;
    //             }
    //             roadData[0] = startPoint.clone();
    //             roadData[roadData.length - 1] = endPoint.clone();
    //             return roadData;
    //         } else {
    //             console.log("AStarMapPathFind: 获取路径失败");
    //             return [];//[startPoint.clone(), endPoint.clone()];
    //         }
    //     }

    // isValidMovePos(pos: Vec3) {
    //     return this.astarSystem.isValidPoint(pos);
    // }

    //     private _lastRectArr: Rect[] = [];
    //     updateMapByNodeArr(nodeArr: Node[], rotateArr: boolean[]) {
    //         let rectArr = []
    //         nodeArr.forEach((node, index) => {
    //             let girdSize = AStarWrapper.Size;
    //             let rect = this.getRectWithNode(node, rotateArr[index]);
    //             rect.x = rect.x + girdSize;
    //             rect.y = rect.y - girdSize;
    //             rect.width = rect.width - girdSize;
    //             rect.height = rect.height - girdSize;
    //             if(rect.width <= 0) {
    //                 rect.width = girdSize;
    //             }
    //             if(rect.height <= 0) {
    //                 rect.height = girdSize;
    //             }
    //             rectArr.push(rect);
    //         });

    //         this.astar.updateMapData(rectArr, this._lastRectArr);
    //         this._lastRectArr = rectArr;
    //     }

    //------------------------------------------------------------------------------------------


    // getEnemyBornPoint() {
    //     const nodeArr = this.enemySpawnsArr.children;
    //     const index = Math.floor(Math.random() * nodeArr.length);
    //     const node = nodeArr[index >= nodeArr.length ? nodeArr.length - 1 : index];

    //     const center = node.worldPosition;
    //     const size = node.getComponent(UITransform).contentSize;
    //     const randomX = center.x - size.width / 2 + Math.random() * size.width;
    //     const randomZ = center.z - size.height / 2 + Math.random() * size.height;

    //     // 复用 Vec3 对象
    //     const result = MapManager.TEMP_VEC3;
    //     result.set(randomX, 0, randomZ);
    //     return result.clone(); // 如果需要返回新对象
    // }
}