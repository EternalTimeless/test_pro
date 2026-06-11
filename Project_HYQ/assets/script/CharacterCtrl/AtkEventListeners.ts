import { _decorator, Component, Node } from 'cc';
import { ComponentEvent } from '../Common/CommonEnum';
const { ccclass, property } = _decorator;

@ccclass('AtkEventListeners')
export class AtkEventListeners extends Component {
    private _characterNode: Node | null = null;

    onLoad() {
        // 查找 CharacterBase 所在的节点（通常是 AnimationModel 组件所在节点的父节点）
        // 因为 FrameEventListeners 添加在 modelAni.node 上，需要向上查找
        this._characterNode = this.findCharacterNode();
    }

    /**
     * 查找 CharacterBase 所在的节点
     * 从当前节点向上查找，找到有 AnimationModel 组件的节点
     */
    private findCharacterNode(): Node | null {
        let currentNode: Node | null = this.node;
        // 最多向上查找3层
        for (let i = 0; i < 3; i++) {
            if (!currentNode.parent) break;
            currentNode = currentNode.parent;
            // 检查是否有 AnimationModel 组件
            if (currentNode.getComponent('CharAnimationModel')) {
                return currentNode;
            }
        }
        console.warn('[FrameEventListeners] 无法找到 CharacterBase 所在的节点');
        return null;
    }

    /**
     * 动画帧事件：攻击
     * 此方法会被动画系统自动调用
     */
    onAttackFrameEvent(eventData?: string) {
        if (this._characterNode) {
            // 转发事件到 CharacterBase 所在的节点
            this._characterNode.emit(ComponentEvent.OnAttackFrame);
        }
    }
}


