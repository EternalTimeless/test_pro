import { _decorator, Component, Node, Vec3, math, v3, ccenum } from 'cc';
const { ccclass, property } = _decorator;

enum FloatType {
    Y_AXIS = 0,
    XZ_HEMISPHERE = 1,
    SPHERE = 2,
}
ccenum(FloatType);
@ccclass('FloatAround')
export class FloatAround extends Component {
    @property({ tooltip: '漂浮半径' })
    floatRadius: number = 0.25;
    @property({ tooltip: '最小漂浮时间（秒）' })
    minFloatTime: number = 1.5;
    @property({ tooltip: '最大漂浮时间（秒）' })
    maxFloatTime: number = 3.5;
    @property({ tooltip: '漂浮类型', type: FloatType })
    floatType: number = FloatType.Y_AXIS;

    private originPosition: Vec3 = new Vec3();
    private startPosition: Vec3 = new Vec3();
    private targetPosition: Vec3 = new Vec3();
    private floatTime: number = 2.0;
    private elapsedTime: number = 0;
    private moving: boolean = false;
    private returningToOrigin: boolean = false;

    start() {
        this.originPosition.set(this.node.position);
        this.startPosition.set(this.node.position);
        this.moveToNextTarget();
    }

    update(deltaTime: number) {
        if (!this.moving) return;
        this.elapsedTime += deltaTime;
        let t = this.elapsedTime / this.floatTime;
        if (t >= 1) {
            this.node.position = this.targetPosition;
            if (this.returningToOrigin) {
                // 回到初始点后，开始新一轮漂浮
                this.moveToNextTarget();
            } else {
                // 漂浮结束，回到初始点
                this.moveToOrigin();
            }
            return;
        }
        // 用正弦插值模拟非匀速（慢-快-慢）
        let easeT = 0.5 - 0.5 * Math.cos(Math.PI * t);
        let newPos = v3();
        Vec3.lerp(newPos, this.startPosition, this.targetPosition, easeT);
        this.node.position = newPos;
    }

    /** 生成下一个目标点并开始漂浮 */
    private moveToNextTarget() {
        this.startPosition.set(this.node.position);
        this.targetPosition.set(this.getRandomTargetByType());
        this.floatTime = math.lerp(this.minFloatTime, this.maxFloatTime, Math.random());
        this.elapsedTime = 0;
        this.moving = true;
        this.returningToOrigin = false;
    }

    /** 回到初始点 */
    private moveToOrigin() {
        this.startPosition.set(this.node.position);
        this.targetPosition.set(this.originPosition);
        this.floatTime = this.minFloatTime;
        this.elapsedTime = 0;
        this.moving = true;
        this.returningToOrigin = true;
    }

    /** 根据类型生成目标点 */
    private getRandomTargetByType(): Vec3 {
        switch (this.floatType) {
            case FloatType.Y_AXIS:
                return v3(this.originPosition.x, this.originPosition.y + this.floatRadius, this.originPosition.z);
            case FloatType.XZ_HEMISPHERE: {
                // XZ平面之上的半球
                let r = this.floatRadius * Math.cbrt(Math.random());
                let theta = Math.random() * 2 * Math.PI;
                let phi = Math.random() * (Math.PI / 2); // 上半球
                let x = r * Math.sin(phi) * Math.cos(theta);
                let y = r * Math.cos(phi);
                let z = r * Math.sin(phi) * Math.sin(theta);
                return v3(
                    this.originPosition.x + x,
                    this.originPosition.y + y,
                    this.originPosition.z + z
                );
            }
            case FloatType.SPHERE:
            default: {
                // 球面内随机
                let r = this.floatRadius * Math.cbrt(Math.random());
                let theta = Math.random() * 2 * Math.PI;
                let phi = Math.acos(2 * Math.random() - 1);
                let x = r * Math.sin(phi) * Math.cos(theta);
                let y = r * Math.sin(phi) * Math.sin(theta);
                let z = r * Math.cos(phi);
                return v3(
                    this.originPosition.x + x,
                    this.originPosition.y + y,
                    this.originPosition.z + z
                );
            }
        }
    }
} 