import { _decorator, Component, Node, Vec3 } from 'cc';
import { ItemContainer } from '../Common/ItemContainer';
import { GameInfo, SceneType } from '../Common/GameInfo';

const { ccclass, property } = _decorator;

interface ContainerState {
    container: ItemContainer;
    node: Node;
    defaultIndex: number;

    // 逻辑空/非空状态（带延迟判空）
    isLogicallyEmpty: boolean;
    // 上一次检测到的真实子节点数量
    lastChildCount: number;

    // 最近一次从空变为非空时的顺序（用于前排排序）
    lastAcquireOrder: number;
    // 清空后开始累计的空置时长（秒）
    emptyDuration: number;
    // 空容器在空队列中的顺序（用于“清空后放末尾”）
    emptyOrder: number;
}

@ccclass('BackpackSorter')
export class BackpackSorter extends Component {
    @property({
        tooltip: '检测背包容器状态的时间间隔（秒）',
        displayName: '检查间隔'
    })
    public checkInterval: number = 0.5;

    @property({
        tooltip: '容器被清空后，判定为真正空容器前需要持续为空的时间（秒），用于防止抖动',
        displayName: '清空延迟'
    })
    public emptyDelay: number = 0.5;

    @property({
        tooltip: '第一个容器的基础 Z 值(越大越靠前,2D为X值,3D为Z值)',
        displayName: '位置基准值'
    })
    public base: number = 0;

    @property({
        tooltip: '相邻两个容器之间的间隔(正数)。实际值 = base - index * Spacing, 2D为X值,3D为Z值',
        displayName: '位置间隔'
    })
    public spacing: number = 0.6;
    @property({ type: [Node], displayName: '影子', visible: false })
    public shadows: Node[] = [];
    private _containers: ContainerState[] = [];
    private _timer: number = 0;
    private _acquireCounter: number = 0;
    private _emptyCounter: number = 0;

    onLoad() {
        this.initContainers();
    }

    /**
     * 初始化：收集本节点下所有带 ItemContainer 组件的子节点
     */
    private initContainers() {
        this._containers.length = 0;
        this._acquireCounter = 0;
        this._emptyCounter = 0;

        if (!this.node) {
            return;
        }
        this.shadows.forEach((shadow, index) => {
            shadow.active = false;
        });
        const children = this.node.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const container = child.getComponent(ItemContainer);
            if (!container || !container.root) {
                continue;
            }

            const childCount = container.root.children.length;
            const isEmpty = childCount === 0;

            const state: ContainerState = {
                container,
                node: child,
                defaultIndex: i,
                isLogicallyEmpty: isEmpty,
                lastChildCount: childCount,
                lastAcquireOrder: -1,
                emptyDuration: 0,
                emptyOrder: i, // 初始空队列顺序按默认顺序
            };

            this._containers.push(state);
        }

        // 初始时根据默认顺序刷新一次 Z
        this.refreshSort(true);
    }

    update(dt: number) {
        if (this._containers.length === 0) {
            return;
        }

        this._timer += dt;
        if (this._timer < this.checkInterval) {
            return;
        }
        // 归零，避免累积误差
        this._timer = 0;

        let anyStateChanged = false;

        // 1. 先更新每个容器当前的真实空/非空状态与延迟判空
        for (let i = 0; i < this._containers.length; i++) {
            const state = this._containers[i];
            const root = state.container.root;
            if (!root) continue;

            const rawIsEmpty = state.container.isEmpty();

            // 记录子节点数量，方便将来需要做更细粒度的逻辑
            state.lastChildCount = state.container.getItemCount()

            if (!rawIsEmpty) {
                // 真实非空：立即视为非空，重置空置时间
                state.emptyDuration = 0;
                if (state.isLogicallyEmpty) {
                    // 逻辑空 -> 非空：记录这一轮的获取顺序
                    state.isLogicallyEmpty = false;
                    state.lastAcquireOrder = ++this._acquireCounter;
                    anyStateChanged = true;
                }
            } else {
                // 真实为空：仅对“当前仍视为非空”的容器累积空置时长
                if (!state.isLogicallyEmpty) {
                    state.emptyDuration += this.checkInterval;
                    // 延迟时间到，再真正视为逻辑空容器
                    if (state.emptyDuration >= this.emptyDelay) {
                        state.isLogicallyEmpty = true;
                        state.emptyOrder = ++this._emptyCounter;
                        anyStateChanged = true;
                    }
                }
            }
        }

        // 如果没有任何逻辑状态变化，就不需要重新排序
        if (!anyStateChanged) {
            return;
        }

        // 2. 检查是否所有容器都处于逻辑空状态
        let allEmpty = true;
        for (let i = 0; i < this._containers.length; i++) {
            if (!this._containers[i].isLogicallyEmpty) {
                allEmpty = false;
                break;
            }
        }

        if (allEmpty) {
            // 所有容器都逻辑空时，重置顺序计数器，
            // 让下一轮获取/清空中重新从 0 开始计数。
            this._acquireCounter = 0;
            this._emptyCounter = 0;
        }

        this.refreshSort(false);
    }

    /**
     * 根据当前状态对容器排序并刷新 Z 值, 2D项目刷新X值
     * @param useDefaultOrder 是否只按默认顺序刷新（用于初始化）
     */
    private refreshSort(useDefaultOrder: boolean) {
        // 复制一份数组进行排序，避免直接改动原数组引用
        const list = this._containers.slice();

        if (useDefaultOrder) {
            list.sort((a, b) => a.defaultIndex - b.defaultIndex);
        } else {
            list.sort((a, b) => {
                // 先比较逻辑空/非空：非空在前，空在后
                if (a.isLogicallyEmpty !== b.isLogicallyEmpty) {
                    return a.isLogicallyEmpty ? 1 : -1;
                }

                if (!a.isLogicallyEmpty && !b.isLogicallyEmpty) {
                    // 都是非空：按最近一次从空变为非空的顺序排序（更早的在前）
                    return a.lastAcquireOrder - b.lastAcquireOrder;
                }

                // 都是空：按空队列顺序排序（新清空的在末尾）
                return a.emptyOrder - b.emptyOrder;
            });
        }

        // 按排序结果设置 Z 值：越靠前的容器 Z 越大（或越接近 baseZ）
        for (let i = 0; i < list.length; i++) {
            const state = list[i];
            const node = state.node;
            const pos: Vec3 = node.position.clone();
            if (GameInfo.SceneType == SceneType.D3) {
                pos.z = this.base - i * this.spacing;
            } else {
                pos.x = this.base - i * this.spacing;
            }
            node.setPosition(pos);
            // X坐标小的在前
            node.setSiblingIndex(list.length - i - 1);
            if (this.shadows[i]) {
                if (state.container.getItemCount() > 0) {
                    this.shadows[i].active = true;
                } else {
                    this.shadows[i].active = false;
                }
            }
        }
    }
}


