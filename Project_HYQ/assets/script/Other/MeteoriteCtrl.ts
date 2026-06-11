import { _decorator, Component, Node, Vec3, Quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MeteoriteCtrl')
export class MeteoriteCtrl extends Component {
    @property({ type: Node, tooltip: '模型节点' })
    private meteoriteNode: Node = null;
    @property({ tooltip: '基础移动速度' })
    baseSpeed: number = 0.05;
    @property({ tooltip: '旋转速度' })
    rotateSpeed: number = 0.05;
    @property({ tooltip: '最大移动距离' })
    maxDistance: number = 10;

    private startPosition: Vec3 = new Vec3();
    private currentDistance: number = 0;
    private rotationAxis: Vec3 = new Vec3();
    private moveDirection: number = 1; // 1 表示向右，-1 表示向左
    private currentRotation: Quat = new Quat(); // 用于存储当前旋转状态

    start() {
        // 保存初始位置
        this.startPosition.set(this.node.position);

        // 随机生成旋转轴
        this.rotationAxis.set(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        ).normalize();

        // 初始化旋转
        if (this.meteoriteNode) {
            this.currentRotation.set(this.meteoriteNode.rotation);
        }
    }

    update(deltaTime: number) {
        // 计算移动
        const moveDistance = this.baseSpeed * deltaTime * this.moveDirection;
        this.node.position = this.node.position.add3f(moveDistance, 0, 0);
        this.currentDistance += Math.abs(moveDistance);

        // 检查是否需要改变方向
        if (this.currentDistance >= this.maxDistance) {
            this.moveDirection *= -1; // 改变方向
            this.currentDistance = 0;
        }

        // 模型节点旋转
        if (this.meteoriteNode) {
            const deltaRotation = Quat.fromAxisAngle(
                new Quat(),
                this.rotationAxis,
                this.rotateSpeed * deltaTime
            );
            Quat.multiply(this.currentRotation, this.currentRotation, deltaRotation);
            this.meteoriteNode.rotation = this.currentRotation;
        }
    }
}


