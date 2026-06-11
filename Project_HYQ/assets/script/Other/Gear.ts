import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Gear')
export class Gear extends Component {
    @property({ type: Node, tooltip: '模型节点' })
    private model: Node = null;
    @property({ tooltip: '旋转速度' })
    rotateSpeed: number = 80;
    // @property({ tooltip: '旋转方向(1:顺时针, -1:逆时针)' })
    // private moveDirection: number = 1;
    private currentRotation: Vec3 = new Vec3();

    start() {

        // 初始化旋转
        if (this.model) {
            this.currentRotation.set(this.model.eulerAngles);
        }
    }

    update(dt: number) {
        // 模型节点旋转
        if (this.model) {
            const deltaX = -this.rotateSpeed * dt;

            const eulerAngles = this.model.eulerAngles.clone();

            eulerAngles.add3f(deltaX, 0, 0);

            eulerAngles.x = this.normalizeEulerX(eulerAngles.x);

            this.model.setRotationFromEuler(eulerAngles);
        }
    }

    private normalizeEulerX(x: number): number {

        const m = ((x % 360) + 360) % 360;

        return m === 0 ? 0 : m - 360;

    }
}