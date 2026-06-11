// import { _decorator, Component, Node, UITransform } from 'cc';
// import { GameInfo, SceneType } from '../Common/GameInfo';
// const { ccclass, property } = _decorator;

// @ccclass('MapLayerManager')
// export class MapLayerManager extends Component {
//     @property({ type: Node, displayName: '排序节点' })
//     protected sortNode: Node | null = null;
//     private _lastSortTime: number = 0;
//     private _sortInterval: number = 0.2; // 排序间隔时间，单位：秒

//     @property
//     private _needSort: boolean = true; // 是否需要排序

//     @property({
//         tooltip: "是否需要排序"
//     })
//     set needSort(value: boolean) {
//         this._needSort = value;
//     }

//     get needSort(): boolean {
//         return this._needSort;
//     }

//     // 添加移动节点集合
//     private _movingNodes: Set<Node> = new Set();

//     // 注册移动节点
//     public registerMovingNode(node: Node) {
//         this._movingNodes.add(node);
//     }

//     // 注销移动节点
//     public unregisterMovingNode(node: Node) {
//         this._movingNodes.delete(node);
//     }

//     protected onLoad(): void {
//         GameInfo.instance.mapLayerMgr = this;
//         // 初始化时进行一次排序
//     }
//     protected start(): void {
//         if (this._needSort) {
//             this.sortChildren();
//         }
//     }
//     update(deltaTime: number) {
//         if (!this._needSort) return;

//         this._lastSortTime += deltaTime;
//         if (this._lastSortTime >= this._sortInterval) {
//             this._lastSortTime = 0;
//             if (GameInfo.SceneType == SceneType.D3) {
//                 this.sortChildrenSprite3D();
//             } else {
//                 this.sortChildren();
//             }
//             // 如果移动节点数量超过一定阈值，使用整体排序
//             // if (this._movingNodes.size > 10) {
//             //     //cocos的节点渲染, 每个包含子节点的节点, 都会触发一次默认排序, 导致初始的排序被覆盖成编辑器中的默认排序, 需要延迟排序猜生效, 时间根据节点数量而定
//             //     this.sortChildren();
//             // } else {
//             //     // 否则只对移动节点进行排序
//             //     this._movingNodes.forEach(node => {
//             //         this.updateNodeIndex(node);
//             //     });
//             // }
//         }
//     }

//     // 对子节点进行排序
//     sortChildren() {
//         const children = this.sortNode.children;
//         if (children.length <= 1) return; // 没有必要排序
//         // 使用原生的Array.sort方法，性能更好
//         children.sort((a, b) => {
//             // 主要按Y坐标排序（大的在前）
//             const yDiff = b.position.y - a.position.y;

//             // 当Y坐标相同时，使用X坐标作为次要排序条件
//             if (Math.abs(yDiff) < 0.001) {
//                 return a.position.x - b.position.x; // X坐标小的在前
//             }
//             return yDiff;
//         });

//         // 更新节点顺序
//         for (let i = 0; i < children.length; i++) {
//             children[i].setSiblingIndex(i);
//         }
//     }
//     sortChildrenSprite3D() {
//         const children = this.sortNode.children;
//         if (children.length <= 1) return;
//         children.sort((a, b) => {
//             const zDiff = a.position.z - b.position.z;
//             // 当Z坐标相同时，使用X坐标作为次要排序条件
//             if (Math.abs(zDiff) < 0.001) {
//                 return a.position.x - b.position.x; // X坐标小的在前
//             }
//             return zDiff;
//         });
//         for (let i = 0; i < children.length; i++) {
//             children[i].setSiblingIndex(i);
//         }

//     }

//     /**更新单个节点的层级 */
//     public updateNodeIndex(node: Node) {
//         const children = this.sortNode.children;
//         if (children.length <= 1) return;

//         let insertIndex = children.length; // 默认插到最后
//         for (let i = 0; i < children.length; i++) {
//             const child = children[i];
//             if (child === node) continue;

//             // 先比较Y，Y大的在前
//             if (node.position.y > child.position.y + 0.001) {
//                 insertIndex = i;
//                 // Y相等时，X小的在前
//                 if (Math.abs(node.position.y - child.position.y) < 0.001) {
//                     if (node.position.x < child.position.x) {
//                         insertIndex = i;
//                     }
//                 }
//             }
//         }
//         node.setSiblingIndex(insertIndex);
//     }
// }



