import { _decorator, CCInteger, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('IconSet')
export class IconSet extends Component {
    @property({ type: [Node], displayName: '图标列表', tooltip: '按等级索引的子模型(Level 0..n)，留空则不做等级切换' })
    iconList: Node[] = [];
    @property({ type: CCInteger, displayName: '当前等级', tooltip: '当前等级' })
    currentLevel: number = 0;
    protected onLoad(): void {
        this.applyBulletModelLevel(this.currentLevel);
    }
    /** 按等级显示子节点；bullets 未配置时跳过(Level-related logic skipped when empty) */
    private applyBulletModelLevel(level: number) {
        if (!this.iconList?.length) return;
        const maxIdx = this.iconList.length - 1;
        const idx = Math.max(0, Math.min(level, maxIdx));
        this.iconList.forEach((n, i) => {
            if (n) n.active = (i === idx);
        });
    }
}


