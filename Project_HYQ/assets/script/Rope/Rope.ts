import { _decorator, Animation, Component, Line, v3, Vec3 } from "cc";
import { RopeNode } from "./RopeNode";
const { ccclass, property } = _decorator;
const v3_temp: Vec3 = new Vec3();
const CORD_MAX_LENGTH = 2;
const CORD_ELASTIC_RANGE = 0.25;
@ccclass('Rope')
export class Rope extends Component {
    /**
     * 节点数组
     */
    nodeArr: RopeNode[] = [];

    /**
     * 头节点
     */
    head: RopeNode = null;

    /**
    * 头节点
    */
    end: RopeNode = null;


    /**
     * 基础长度
     */
    baseLen = 0.5;

    /**
     * 节点数量, 越多弹性越高
     */
    count = 15;


    private line: Line;


    public isLengthChange: number = 0;

    private anim: Animation;

    private fixedStartPos: Vec3 = new Vec3();
    private fixedEndPos: Vec3 = new Vec3();

    /**
     * 是否需要更新物理模拟
     */
    private needPhysicsUpdate: boolean = true;

    /**
     * 速度阈值，低于此值认为节点静止
     */
    private readonly VELOCITY_THRESHOLD = 0.0001;


    init() {
        if (this.nodeArr.length == this.count) return;
        // 初始化节点
        for (let i = 0; i < this.count; i++) {
            this.nodeArr.push(new RopeNode(0, 0, 0));
        }
        this.head = this.nodeArr[0];
        this.head.fixedPoint = true;
        this.end = this.nodeArr[this.count - 1];
        this.end.fixedPoint = true;
        this.line = this.node.getComponent(Line);
        this.anim = this.getComponent(Animation);
    }


    /**
     * 更新节点
     * @param dt
     */
    updatePoints(dt: number) {
        const { nodeArr } = this;
        const len = nodeArr.length;
        for (let i = 1; i < len; i++) {
            const p = nodeArr[i];
            p.onUpdate(dt);
        }
    }

    /**
     * 简单的约束
     */
    constraint() {
        const { nodeArr } = this;

        // 多次迭代保证稳定性
        const time = 20;
        for (let step = 0; step < time; step++) {

            const len = this.nodeArr.length - 1;
            for (let i = 0; i < len; i++) {

                const p = nodeArr[i];
                const next = nodeArr[i + 1];

                // 相邻节点间距
                const dp = Vec3.subtract(v3_temp, p.pos, next.pos);
                const dis = dp.length();

                // 超出基础长度时调整位置
                if (dis > this.baseLen) {
                    const delta = dis - this.baseLen;
                    const dir = dp.normalize().multiplyScalar(delta);
                    if (!p.fixedPoint) {
                        dir.multiplyScalar(0.5);
                        p.pos.subtract(dir);
                        next.pos.add(dir);
                    } else {
                        next.pos.add(dir);
                    }
                }
            }
        }
    }

    public setLine(start: Vec3, end: Vec3) {
        this.fixedStartPos.set(start);
        this.fixedEndPos.set(end);
        this.head.pos.set(start);
        this.end.pos.set(end);
        // 位置变化时，激活物理更新
        this.needPhysicsUpdate = true;
        // 此处需要实际距离值，无法避免开方运算
        let dis = Vec3.distance(start, end);
        this.baseLen = dis / this.count;
        if (this.baseLen >= CORD_MAX_LENGTH) {
            if (!this.isLengthChange) {
                this.anim.play();
            }
            this.isLengthChange = (this.baseLen - CORD_MAX_LENGTH) / CORD_ELASTIC_RANGE;
        } else if (this.baseLen < CORD_MAX_LENGTH) {
            this.isLengthChange = 0;
        }
        this.baseLen = Math.min(CORD_MAX_LENGTH, this.baseLen);

    }

    public initPos(start: Vec3, end: Vec3) {
        this.setLine(start, end);
        let vector = v3();
        Vec3.subtract(vector, start, end);
        vector.normalize();
        for (let i = 0; i < this.count; i++) {
            let p = this.nodeArr[i];
            p.pos.set(vector);
            p.pos.multiplyScalar(i * this.baseLen);
            p.pos.add(start);
            p.prePos.set(p.pos);
        }
    }


    /**
     * 检查所有节点是否已静止
     */
    private checkAllNodesStopped(): boolean {
        const { nodeArr } = this;
        for (let i = 1; i < nodeArr.length - 1; i++) {
            const p = nodeArr[i];
            if (p.fixedPoint) continue;
            
            // 计算节点速度
            const velocity = Vec3.subtract(v3_temp, p.pos, p.prePos);
            const speed = velocity.lengthSqr(); // 使用平方避免开方运算
            
            if (speed > this.VELOCITY_THRESHOLD) {
                return false; // 还有节点在运动
            }
        }
        return true; // 所有节点都静止
    }

    /**
     * 更新
     * @param dt
     */
    update(dt: number) {
        // 只有需要物理更新时才执行
        if (this.needPhysicsUpdate) {
            this.updatePoints(dt);
            this.constraint();
            
            // 强制重置固定点位置，确保无偏移
            this.head.pos.set(this.fixedStartPos);
            this.end.pos.set(this.fixedEndPos);

            // 检查是否可以停止物理更新
            if (this.checkAllNodesStopped()) {
                this.needPhysicsUpdate = false;
            }
        }

        // 更新渲染（即使物理停止，也需要保持最后的渲染状态）
        let posListS: Vec3[] = [];
        for (let i = 0; i < this.nodeArr.length; i++) {
            posListS[i] = this.nodeArr[i].pos;
        }
        this.line.positions = posListS;
    }
}