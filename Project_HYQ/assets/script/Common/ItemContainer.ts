import { _decorator, Component, Node, Vec3, UITransform, v3, tween, UIOpacity, CCInteger } from 'cc';
import { GameInfo, SceneType } from './GameInfo';
const { ccclass, property } = _decorator;

@ccclass('ItemContainer')
export class ItemContainer extends Component {
    /**容器节点 */
    @property({
        type: Node,
        tooltip: '排序方向为X排满后Y/Z排满后 然后到下一层',
        displayName: '容器节点'
    })
    root: Node = null!
    /** 行数: 3D 为层内 Z 向排数; 2D 为等距柱阵 row 维度长度 */
    @property({
        type: CCInteger,
        tooltip: '3D: 每层沿 Z 轴(深度)方向的格数, 与「每列间距Y/Z」同向. 2D: 等距网格中外层 row 维度的柱位数量. ',
        displayName: '行数(Y/Z轴向)'
    })
    rows: number = 5;
    /** 列数: 3D 为层内 X 向个数; 2D 为等距柱阵 col 维度长度 */
    @property({
        type: CCInteger,
        tooltip: '3D: 每层沿 X 轴方向的格数, 与「每行间距X」同向. 2D: 等距网格中内层 col 维度的柱位数量.',
        displayName: '列数(X轴向)'
    })
    columns: number = 5;
    /**同层物品间距 */
    @property({
        tooltip: '同一层物品之间的间距',
        displayName: '每行间距(X)'
    })
    spacingX: number = 10;
    @property({
        tooltip: '同一层物品之间的间距',
        displayName: '每列间距(Y/Z)'
    })
    spacingY: number = 5;
    @property({
        tooltip: '不同层级之间的高度差',
        displayName: '层级高度'
    })
    layerHeight: number = 10;

    @property({
        tooltip: '最大层数，超过后新层将与最高层保持相同高度',
        displayName: '最大层数'
    })
    maxLayers: number = 50;
    private tempV3: Vec3 = new Vec3();
    @property({
        type: Node,
        tooltip: '容器影子节点',
        displayName: '容器影子节点'
    })
    rootShadow: Node = null!;
    @property({
        tooltip: '是否开启影子',
        displayName: '是否开启影子',
        visible: GameInfo.SceneType === SceneType.D2
    })
    openShadow: boolean = true;
    /**柱子容器节点数组（仅2D模式使用） */
    private columnarNodes: Node[] = [];
    // /**影子节点数组（仅2D模式使用，与columnarNodes索引一一对应） */
    // private shadowNodes: Node[] = [];
    /**当前填充的层级索引（从0开始） */
    private layerIndex: number = 0;
    /**是否使用柱子容器模式（2D视角为true，3D视角为false） */
    private isColumnarMode: boolean = false;

    /**预处理数据, 获取投放物品的位置, 调用此方法后addItem才能获取正确的位置, 用于连续快速投放物品 */
    public preprocessData() {
        this.reservedItemCount++;

        if (this.isColumnarMode) {
            // 2D柱子模式：计算下一个item应该在哪个柱子的哪个高度
            const currentCount = this.columnarNodes.reduce((sum, col) => sum + col.children.length, 0);
            const nextCount = currentCount + this.reservedItemCount;
            const maxCount = this.maxLayers * this.columns * this.rows;

            if (nextCount > maxCount) {
                // 超出容量，返回最后一个位置
                return this.getNextColumnItemPosition(maxCount - 1);
            }

            return this.getNextColumnItemPosition(nextCount - 1);
        } else {
            // 3D原有逻辑
            let count = this.reservedItemCount + this.root.children.length;
            const maxCount = this.maxLayers * this.columns * this.rows;
            count = Math.min(count, maxCount);
            return this.calculateNodePos(count);
        }
    }

    /**
     * 计算2D柱子模式下指定索引的物品位置
     * @param index 物品索引（从0开始）
     */
    private getNextColumnItemPosition(index: number): Vec3 {
        // 计算该物品应该在第几层，第几个柱子
        const layer = Math.floor(index / this.columnarNodes.length);
        const columnIndex = index % this.columnarNodes.length;

        // 获取对应柱子的位置
        const column = this.columnarNodes[columnIndex];
        const columnPos = column.position.clone();

        // 计算Y偏移（高度）
        const yOffset = layer * this.layerHeight;
        columnPos.y += yOffset;

        return columnPos;
    }
    private calculateNodePos(count: number) {
        //矩阵位置索引
        const index = count - 1
        //当前层
        const curLayer = Math.floor(index / (this.columns * this.rows))
        //当前层 总数量
        const curLayerCount = index % (this.columns * this.rows);
        let baseX: number = 0
        let baseY: number = 0
        let layerOffset: number = 0
        //行数
        let row = 0;
        //列数
        let col = 0;
        // 如果当前层超过最大层数，则使用最大层数的高度
        layerOffset = Math.min(curLayer, this.maxLayers) * this.layerHeight;
        const emptyPosition = v3(0, 0, 0);
        if (GameInfo.SceneType == SceneType.D3) {//3d视角xz平面
            // 普通矩阵排列
            row = Math.floor(curLayerCount / this.columns);
            col = curLayerCount % this.columns;
            baseX = col * this.spacingX;
            baseY = row * this.spacingY;
            emptyPosition.set(
                baseX,
                layerOffset,
                baseY,
            )
        } else {
            if (this.rows == 1 && this.columns > 1) {
                // 只有一行，横向排列
                row = 0;
                col = curLayerCount;
                baseX = (col - row) * this.spacingX;
                baseY = (col + row) * this.spacingY;
            } else if (this.columns == 1 && this.rows > 1) {
                // 只有一列，纵向排列
                row = curLayerCount;
                col = 0;
                baseX = (col - row) * this.spacingX;
                baseY = (col + row) * this.spacingY;
            } else {
                // 普通矩阵排列
                row = Math.floor(curLayerCount / this.columns);
                col = curLayerCount % this.columns;
                baseX = (col - row) * this.spacingX;
                baseY = (col + row) * this.spacingY;
                emptyPosition.set(
                    baseX,
                    baseY + layerOffset,
                    0
                )
            }
        }
        return emptyPosition;
    }
    //node.children.length：
    // 适合子节点动态变化的场景，性能开销低，但需注意缓存引用以减少重复调用. 

    // nodeArray.length：
    // 适合子节点固定或变化较少的场景，性能更稳定，但需手动维护数组同步. 

    /**
     * 计算柱子容器的基准位置（2D等距视角）
     * @param row 行索引
     * @param col 列索引
     * @returns 柱子容器的位置
     */
    private calculateColumnPosition(row: number, col: number): Vec3 {
        const baseX = (col - row) * this.spacingX;
        const baseY = (col + row) * this.spacingY;
        return v3(baseX, baseY, 0);
    }

    /**
     * 对柱子容器进行排序，按照2D等距渲染层级规则
     * 主排序：Y大的在前（Y↑ → 渲染在下层）
     * 次排序：X小的在前（X↓ → 渲染在上层）
     */
    private sortColumnarNodes() {
        this.columnarNodes.sort((a, b) => {
            const yDiff = b.position.y - a.position.y;
            if (Math.abs(yDiff) < 0.001) {
                return a.position.x - b.position.x;
            }
            return yDiff;
        });
    }

    onLoad() {
        // 3D 模式保持原逻辑，不使用柱子容器
        if (GameInfo.SceneType === SceneType.D3) {
            this.isColumnarMode = false;
            this.hideShadow();
            return;
        }
        // 2D 模式：初始化柱子容器架构
        this.isColumnarMode = true;
        this.layerIndex = 0;
        this.columnarNodes = [];
        // this.shadowNodes = [];

        // 创建 rows × columns 个柱子容器
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const columnNode = new Node(`Column_${row}_${col}`);
                // 计算柱子基准位置
                const pos = this.calculateColumnPosition(row, col);
                columnNode.setPosition(pos);
                this.columnarNodes.push(columnNode);
            }
        }


        // 按照 MapLayerManager 规则排序
        this.sortColumnarNodes();

        // 添加到 root，并为每个柱子创建对应的影子
        this.columnarNodes.forEach((columnNode, index) => {
            columnNode.setParent(this.root);
        });
    }
    private reservedItemCount: number = 0;

    /**
     * 添加一个物品到容器中
     * @param item 物品节点
     * @param scale 物品放缩值
     * @returns 是否添加成功
     */
    public addItem(item: Node, scale?: Vec3): boolean {
        if (this.reservedItemCount < 1) return false;

        if (this.isColumnarMode) {
            // 2D 柱子模式
            return this.addItemToColumn(item, scale);
        } else {
            // 3D 原有逻辑
            return this.addItemLegacy(item, scale);
        }
    }

    /**
     * 2D柱子模式：添加物品到柱子容器
     */
    private addItemToColumn(item: Node, scale?: Vec3): boolean {
        // 检查容量
        const totalCapacity = this.columns * this.rows * this.maxLayers;
        const currentCount = this.columnarNodes.reduce((sum, col) => sum + col.children.length, 0);
        if (currentCount >= totalCapacity) {
            app.res.recoverByPool(item);
            this.reservedItemCount--;
            return false;
        }

        this.layerIndex = Math.min(...this.columnarNodes.map(col => col.children.length));

        // 找第一个未填满当前层的柱子
        for (let i = 0; i < this.columnarNodes.length; i++) {
            if (this.columnarNodes[i].children.length <= this.layerIndex) {
                // 记录当前柱子的物品数量（添加前）
                const currentItemCount = this.columnarNodes[i].children.length;

                // Y 坐标 = 当前柱子高度 * layerHeight（在setParent之前计算）
                const yOffset = currentItemCount * this.layerHeight;

                item.setParent(this.columnarNodes[i]);
                item.setScale(scale || item.getScale());
                item.setPosition(0, yOffset, 0);

                this.reservedItemCount--;

                // 处理物品自带的影子节点（仅2D模式）
                // 只有位于柱子最底层（索引0位置）的物品才显示影子
                if (this.openShadow) {
                    const itemShadow = item.getChildByName("Shadow");
                    if (itemShadow) {
                        const shadowOpacity = itemShadow.getComponent(UIOpacity);
                        if (shadowOpacity) {
                            // 如果是添加到柱子的第0个位置（最底层），显示影子
                            shadowOpacity.opacity = (currentItemCount === 0) ? 255 : 0;
                        }
                    }
                }
                tween(item)
                    .to(0.1, { scale: v3(1.2, 1.2, 1) })
                    .to(0.1, { scale: v3(1, 1, 1) })
                    .start();
                return true;
            }
        }

        return false;
    }
    /**
     * 3D模式：原有添加逻辑
     */
    private addItemLegacy(item: Node, scale?: Vec3): boolean {
        if (this.root.children.length > (this.columns * this.rows * this.maxLayers - 1)) {
            //超出最大堆积回收
            app.res.recoverByPool(item);
            this.reservedItemCount--;
            return false;
        }
        this.showShadow();

        item.setParent(this.root);
        item.setScale(scale ? scale : item.getScale());
        let pos = this.calculateNodePos(this.root.children.length)

        item.setPosition(pos)

        this.reservedItemCount--;
        let originScale = item.getScale();
        tween(item)
            .to(0.1, { scale: v3(originScale.x * 1.2, originScale.y * 1.2, originScale.z * 1.2) })
            .to(0.1, { scale: originScale })
            .start();
        return true;
    }
    /** 获取容器排序末尾的物品 */
    getLastItem(): Node {
        if (this.isColumnarMode) {
            // 【方案1】2D柱子模式：从最高层开始取物品，每层取完再往下一层
            // 1. 找到当前最高层的高度（所有柱子中最大的children.length）
            const maxHeight = Math.max(...this.columnarNodes.map(col => col.children.length));
            if (maxHeight === 0) {
                return null;
            }

            // 2. 从后往前遍历柱子，找第一个达到最高层的柱子
            for (let i = this.columnarNodes.length - 1; i >= 0; i--) {
                const column = this.columnarNodes[i];
                if (column.children.length === maxHeight) {
                    const item = column.children[column.children.length - 1];

                    // 记录取出物品的柱子索引，并启动1秒延迟更新影子
                    // this.scheduleUpdateShadowAfterDelay(i);

                    return item;
                }
            }

            return null;
        } else {
            // 3D原有逻辑
            if (this.root.children.length > 0) {
                return this.root.children[this.root.children.length - 1];
            }
            return null;
        }
    }
    /**
     * 获取下一个物品位置的世界坐标
     * @returns 世界坐标位置
     */
    public getItemWorldPos(): Vec3 {
        const pos = this.preprocessData();
        Vec3.transformMat4(pos, pos, this.root.worldMatrix);
        return pos;
    }
    /**获取最后一个物品的世界坐标 */
    getLastItemWorldPos() {
        let item = this.getLastItem();
        return item ? item.worldPosition.clone() : v3();
    }
    /**
     * 获取指定物品位置的世界坐标
     * @param itemIndex 物品索引（从0开始）
     * @returns 世界坐标位置
     */
    public getItemWorldPosByIndex(itemIndex: number): Vec3 {
        const localPos = this.calculateNodePos(itemIndex + 1);
        const tran = this.root.getComponent(UITransform);
        if (tran) {
            return tran.convertToWorldSpaceAR(localPos);
        }
        return localPos;
    }

    /**
     * 获取容器中的物品总数（兼容2D/3D模式）
     * @returns 物品数量
     */
    public getItemCount(): number {
        if (this.isColumnarMode) {
            // 2D柱子模式：累加所有柱子的子节点数量
            return this.columnarNodes.reduce((sum, col) => sum + col.children.length, 0);
        } else {
            // 3D模式：直接返回root的子节点数量
            return this.root.children.length;
        }
    }

    /**
     * 判断容器是否为空（兼容2D/3D模式）
     * @returns 是否为空
     */
    public isEmpty(): boolean {
        return this.getItemCount() === 0;
    }
    /**判断容器是否已满 */
    public isFull(): boolean {
        return this.getItemCount() >= this.columns * this.rows * this.maxLayers;
    }
    /**获取背包最大显示数量 */
    public getMaxShowNum(): number {
        return this.columns * this.rows * this.maxLayers;
    }
    /**3D模式 隐藏影子, 外部调用, 取出容器最后一个物品时隐藏影子 */
    hideShadow() {
        if (this.rootShadow) {
            this.rootShadow.active = false;
        }
    }
    /**3D模式 显示影子 */
    showShadow() {
        if (this.rootShadow && !this.rootShadow.active) {
            this.rootShadow.active = true;
        }
    }
} 