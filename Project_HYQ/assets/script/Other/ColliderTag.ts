import { _decorator, Component } from 'cc';
import { ColliderGroupTag } from '../Common/CommonEnum';

const { ccclass, property } = _decorator;

/**
 * 碰撞分组标签（统一由 CommonEnum.ColliderGroupTag 管理）
 * 用于物理 Trigger、自定义 AABB 子弹碰撞等
 */
@ccclass('ColliderTag')
export class ColliderTag extends Component {
    @property({ type: ColliderGroupTag, tooltip: '碰撞分组，见 CommonEnum.ColliderGroupTag' })
    public tag: ColliderGroupTag = ColliderGroupTag.Default;
}


