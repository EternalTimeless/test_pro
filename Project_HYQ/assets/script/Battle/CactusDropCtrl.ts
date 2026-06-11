// import { _decorator, Component, Node } from 'cc';

// const { ccclass, property } = _decorator;

// @ccclass('CactusDropCtrl')
// export class CactusDropCtrl extends Component {
//     @property({ type: Node, displayName: '正常节点' })
//     normalNode: Node = null!;
//     @property({ type: Node, displayName: '高亮节点' })
//     highLightNode: Node = null!;
//     /** 当前占用该仙人掌掉落物的搬运者节点 */
//     @property({ displayName: '当前搬运者节点(调试用)' })
//     private _carrier: Node | null = null;
//     protected onEnable(): void {
//         this._carrier = null;
//         //默认显示高亮节点
//         this.normalNode.active = false;
//         this.highLightNode.active = true;
//     }
//     /**
//      * 尝试占用搬运权
//      * @param carrier 请求占用的搬运者节点
//      * @returns 是否占用成功
//      */
//     public tryOccupy(carrier: Node): boolean {
//         if (!carrier) {
//             return false;
//         }
//         // 首次占用
//         if (!this._carrier) {
//             this._carrier = carrier;
//             //被搬运时显示正常节点
//             this.normalNode.active = true;
//             this.highLightNode.active = false;
//             return true;
//         }
//         // 已经被同一节点占用, 视为占用成功(幂等)
//         return this._carrier === carrier;
//     }

//     /** 当前掉落物是否由指定节点搬运 */
//     public isCarriedBy(carrier: Node): boolean {
//         return !!carrier && this._carrier === carrier;
//     }

//     /**
//      * 清理占用者
//      * @param carrier 仅当传入与当前占用者一致时才清空, 不传则无条件清空
//      */
//     public clearCarrier(carrier?: Node): void {
//         if (!carrier || this._carrier === carrier) {
//             this._carrier = null;
//         }
//     }
// }

