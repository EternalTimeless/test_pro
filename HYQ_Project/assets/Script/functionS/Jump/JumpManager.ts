import { _decorator, Component, CurveRange, director, instantiate, Node, Prefab, resources, Root, Scene, Vec3 } from 'cc';
import PoolManager from '../../Base/PoolManager';
import Singleton from '../../Base/Singleton';
import { JumpCurve } from './JumpCurve';
import { JumpCurve3D } from './JumpCurve3D';
import { JumpDriveEngine } from './JumpDriveEngine';
import JumpSequenceBase from './JumpSequenceBase';
import BezierCurve, { Vector } from './BezierCurve';
import { JumpParabola } from './JumpParabola';

import LayerManager from '../../Base/LayerManager';
import { JumpScatter } from './JumpScatter';
import { PoolEnum, SceneType } from '../../Base/EnumList';

export class JumpManager extends Singleton {

    public static get instance() {
        return this.getInstance<JumpManager>();
    }


    public propFlyList: JumpSequenceBase[];



    private constructor() {
        super();
        let node = new Node();
        director.getScene().addChild(node);
        node.addComponent(JumpDriveEngine);
        this.propFlyList = [];
    }

    public jumpCurve(flyNode: Node, endPosTemp: Vec3, jumpSpeed: number = 1, jumpPower: number = 1) {
        if (LayerManager.instance.SceneType == SceneType.D2) {
            return this.jumpCurve2D(flyNode, endPosTemp, jumpSpeed, jumpPower);
        } else {
            return this.jumpCurve3D(flyNode, endPosTemp, jumpSpeed, jumpPower);
        }
    }


    /**
     * 
     * @param flyNode 要飞行的节点
     * @param endPosTemp 目标地点 
     * @param jumpPower 力度
     * @param jumpSpeed 飞行速度
     * 
     */
    public jumpCurve2D(flyNode: Node, endPosTemp: Vec3, jumpSpeed: number = 1, jumpPower: number = 1) {
        let propdata = PoolManager.instance.getPool<JumpCurve>(PoolEnum.JumpSequence + JumpCurve);
        if (!propdata) {
            propdata = new JumpCurve();
        }
        propdata.init(flyNode, endPosTemp, jumpPower, jumpSpeed);
        this.propFlyList.push(propdata);
        return propdata;
    }

    /**
   * 
   * @param flyNode 要飞行的节点
   * @param endPosTemp 目标地点 
   * @param jumpPower 力度
   * @param jumpSpeed 飞行速度
   * 
   */
    public jumpCurve3D(flyNode: Node, endPosTemp: Vec3, jumpSpeed: number = 1, jumpPower: number = 1) {
        let propdata = PoolManager.instance.getPool<JumpCurve3D>(PoolEnum.JumpSequence + JumpCurve3D);
        if (!propdata) {
            propdata = new JumpCurve3D();
        }
        propdata.init(flyNode, endPosTemp, jumpPower, jumpSpeed);
        this.propFlyList.push(propdata);
        return propdata;
    }

    /**
     * 自定义贝塞尔 曲线
     * @param flyNode 
     * @param endPosTemp 
     * @param jumpSpeed 
     * @returns 
     */
    public bezierCurve(flyNode: Node, points: Vector[], jumpSpeed: number = 1) {
        const dim = points[0].length;
        if (points.length === 0) {
            console.error("自定义贝塞尔：至少需要一个点");
            return null;
        }
        if (!points.every(p => p.length === dim)) {
            console.error("自定义贝塞尔：所有的点维度必须相同");
            return null;
        }
        let propdata = PoolManager.instance.getPool<BezierCurve>(PoolEnum.JumpSequence + BezierCurve);
        if (!propdata) {
            propdata = new BezierCurve();
        }
        propdata.init(flyNode, points, jumpSpeed);
        this.propFlyList.push(propdata);
        return propdata;
    }



    /**
     * 
     * @param flyNode 
     * @param endPosTemp 
     * @param jumpSpeed 
     * @param jumpPower 
     * @returns 
     */
    public jumpBezierCurve(flyNode: Node, endPosTemp: Vec3, jumpSpeed: number = 1, jumpPower: number = 1) {
        let propdata = PoolManager.instance.getPool<BezierCurve>(PoolEnum.JumpSequence + BezierCurve);
        if (!propdata) {
            propdata = new BezierCurve();
        }
        const startPos = flyNode.worldPosition;
        const endPos = endPosTemp;
        const centerPos = new Vec3();
        Vec3.add(centerPos, startPos, endPos);
        centerPos.multiplyScalar(0.5);
        if (LayerManager.instance.SceneType == SceneType.D2) {
            centerPos.y += 64 * jumpPower;
            const points: Vector[] = [
                new Float32Array([startPos.x, startPos.y]),
                new Float32Array([centerPos.x, centerPos.y]),
                new Float32Array([endPos.x, endPos.y])
            ]
            propdata.init(flyNode, points, jumpSpeed);
        } else {
            centerPos.y += 8 * jumpPower;
            const points: Vector[] = [
                new Float32Array([startPos.x, startPos.y, startPos.z]),
                new Float32Array([centerPos.x, centerPos.y, centerPos.z]),
                new Float32Array([endPos.x, endPos.y, endPos.z])
            ]
            propdata.init(flyNode, points, jumpSpeed);
        }

        this.propFlyList.push(propdata);
        return propdata;
    }

    /**
 * 以节点当前位置为起点，按传入点数组的顺序进行贝塞尔曲线移动
 * @param flyNode 移动的节点（起点取其世界坐标）
 * @param waypoints 途经点数组（按顺序，末尾为终点）
 * @param jumpSpeed 移动速度
 * @returns BezierCurve 实例（支持链式调用）
 */
    public jumpBezierByPoints(flyNode: Node, jumpSpeed: number = 1, ...waypoints: Vec3[]) {
        const startPos = flyNode.worldPosition;
        const is2D = LayerManager.instance.SceneType == SceneType.D2;
        const startVec: Vector = is2D
            ? new Float32Array([startPos.x, startPos.y])
            : new Float32Array([startPos.x, startPos.y, startPos.z]);
        const pointVecs: Vector[] = waypoints.map(p =>
            is2D
                ? new Float32Array([p.x, p.y])
                : new Float32Array([p.x, p.y, p.z])
        );
        const allPoints: Vector[] = [startVec, ...pointVecs];
        console.log("allPoints", allPoints);
        return this.bezierCurve(flyNode, allPoints, jumpSpeed);
    }



    /**
     * 参数方程抛物线跳跃 - 2D/3D 通用（推荐）
     * 
     * @param flyNode 跳跃的节点
     * @param endPos 目标位置
     * @param jumpHeight 跳跃高度（绝对值）
     * @param jumpSpeed 跳跃速度
     * @returns JumpParabola 实例（支持链式调用）
     * 
     * @example
     * // 跳到目标点，最高点比起点高 100 单位
     * JumppManager.instance.jumpParabola(node, targetPos, 100, 1.5)
     *     .setCurveRange(myCurve)
     *     .setDelay(0.5)
     *     .onComplete(() => console.log("到达"));
     */
    public jumpParabola(flyNode: Node, endPos: Vec3, jumpHeight: number = 1, jumpSpeed: number = 1) {
        let propdata = PoolManager.instance.getPool<JumpParabola>(PoolEnum.JumpSequence + JumpParabola);
        if (!propdata) {
            propdata = new JumpParabola();
        }
        propdata.init(flyNode, endPos, this.getHeightByPower(jumpHeight), jumpSpeed);
        this.propFlyList.push(propdata);
        return propdata;
    }

    /**
     * 根据场景类型和 power 参数计算实际跳跃高度
     * @param power 力度参数（相对值）
     * @returns 实际高度（绝对值）
     */
    private getHeightByPower(power: number): number {
        if (LayerManager.instance.SceneType === SceneType.D2) {
            return 64 * power;  // 2D 场景高度系数
        } else {
            return 4 * power;   // 3D 场景高度系数
        }
    }

    /**
     * 扩散式抛物线跳跃 - 适用于多物体从相近位置起跳的场景
     * 
     * @param flyNode 跳跃的节点
     * @param endPos 目标位置
     * @param jumpHeight 跳跃高度参数
     * @param jumpSpeed 跳跃速度
     * @param scatterAngle 扩散角度（度），用于多个物体的径向分布
     * @returns JumpScatter 实例（支持链式调用）
     * 
     * @example
     * // 金币爆炸效果：10个金币从宝箱飞向背包
     * for (let i = 0; i < 10; i++) {
     *     JumpManager.instance.jumpScatter(coins[i], bagPos, 1, 1.5, i * 36)
     *         .setScatterRadius(80)  // 扩散半径
     *         .setRandomness(0.6);   // 随机程度
     * }
     */
    public jumpScatter(
        flyNode: Node,
        endPos: Vec3,
        jumpHeight: number = 1,
        jumpSpeed: number = 1,
        scatterAngle: number = 0
    ) {
        let propdata = PoolManager.instance.getPool<JumpScatter>(PoolEnum.JumpSequence + JumpScatter);
        if (!propdata) {
            propdata = new JumpScatter();
        }
        propdata.init(flyNode, endPos, this.getHeightByPower(jumpHeight), jumpSpeed, scatterAngle);
        this.propFlyList.push(propdata);
        return propdata;
    }

    /**
     * 批量扩散跳跃（便捷方法）
     * 适用于多个物体从同一或相近位置飞向同一目标的场景
     * 
     * @param nodes 节点数组
     * @param endPos 共同的目标位置
     * @param jumpHeight 跳跃高度参数
     * @param jumpSpeed 跳跃速度
     * @param scatterRadius 扩散半径
     * @param randomness 随机程度 [0,1]
     * @param delayStep 每个物体的延迟间隔（秒）
     * 
     * @example
     * // 10个金币同时飞向背包，带扩散效果
     * JumpManager.instance.jumpScatterBatch(coins, bagPos, 1, 1.5, 80, 0.6, 0.03);
     */
    public jumpScatterBatch(
        nodes: Node[],
        endPos: Vec3,
        jumpHeight: number = 1,
        jumpSpeed: number = 1,
        scatterRadius: number = 80,
        randomness: number = 0.5,
        delayStep: number = 0.03
    ) {
        const angleStep = 360 / nodes.length;
        nodes.forEach((node, i) => {
            this.jumpScatter(node, endPos, jumpHeight, jumpSpeed, i * angleStep)
                .setScatterRadius(scatterRadius)
                .setRandomness(randomness)
                .setDelay(i * delayStep);
        });
    }

    public JumpCurveTime(propList: Node[], endPosTemp: Vec3, count: number, time: number, curve: CurveRange = null, curveSpeed: CurveRange = null) {
        let t = 0;
        let offT = count / time;
        for (let i = 0; i < count; i++) {
            this.jumpCurve(propList[i], endPosTemp).setDelay(t).setCurveRange(curve).setCurveRangeSpeed(curveSpeed);
            t += offT;
        }
    }




}


