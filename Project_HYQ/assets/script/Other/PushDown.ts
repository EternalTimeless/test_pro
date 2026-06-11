import { _decorator, Component, easing, Node, tween, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
/**怪物推倒围墙表现 */
@ccclass('PushDown')
export class PushDown extends Component {
    @property({ type: [Node], displayName: '推倒节点' })
    public pushDownNode: Node[] = [];
    private DownEulerAngles: Vec3 = v3(0, 0, 80);
    protected onLoad(): void {

    }
    downAnim() {
        const len = this.pushDownNode.length;
        for (let index = 0; index < len; index++) {
            let delay = 0.1 * index;
            const element = this.pushDownNode[index];
            // 砖块越靠下(index 越大)倾倒后越“杂乱”：仅随机 Y 轴偏移，Z 轴固定倾倒角不变
            // 权重反向：index 越靠前越乱
            const t = len <= 1 ? 1 : (1 - index / (len - 1));
            const maxRandomY = 25; // 最大随机角度(度)
            const randomY = (Math.random() * 2 - 1) * (maxRandomY * t);
            const targetEuler = v3(this.DownEulerAngles.x, this.DownEulerAngles.y + randomY, this.DownEulerAngles.z);
            const eu = tween(element).to(0.4, { eulerAngles: targetEuler }, { easing: easing.quadIn });
            const pos = tween(element).to(0.4, { position: v3(element.position.x - 0.5, element.position.y, element.position.z) }, { easing: easing.quadIn });
            tween(element)
                .delay(delay)
                .parallel(eu, pos)
                .call(() => {
                    //最后一个tween结束后隐藏所有节点
                    if (index == this.pushDownNode.length - 1) {
                        this.scheduleOnce(() => {
                            this.pushDownNode.forEach(node => {
                                node.active = false;
                            });
                        }, 0.1);
                    }
                })
                .start();
        }
    }
    update(dt: number): void {

    }
}
