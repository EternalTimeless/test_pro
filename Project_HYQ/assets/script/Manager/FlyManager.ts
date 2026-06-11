import { _decorator, Component, Node, tween, UIOpacity, v3, Vec3 } from "cc";
import { GameInfo } from "../Common/GameInfo";
import { ItemContainer } from "../Common/ItemContainer";
import { PrefabPathEnum } from "../Common/CommonEnum";
const { ccclass, property } = _decorator;

@ccclass('FlyManager')
export default class FlyManager extends Component {
    private static _instance: FlyManager;
    public static get Ins() {
        return FlyManager._instance;
    }

    /** 默认飞行参数配置 */
    private static readonly DEFAULT_FLY_PARAMS = {
        containerToContainer: { radius: 5, power: 2, flyType: 0, needUpdateEnd: false },
        pointToContainer: { radius: 5, power: 2, flyType: 0, needUpdateEnd: false },
        dropItem: { radius: 2, power: 5, flyType: 0 }
    };

    public propFlyList: FlyData[] = [];
    public effLayer: Node;

    protected onLoad(): void {
        if (!FlyManager._instance) {
            FlyManager._instance = this;
        }
        this.effLayer = GameInfo.instance.gameMgr.effLayer;
    }
    protected update(dt: number): void {
        this.flying(dt);
    }
    protected flying(dt: number) {
        let propFlyList = this.propFlyList;
        for (let i = propFlyList.length - 1; i >= 0; i--) {
            let flydata = propFlyList[i];
            if (flydata.complete == 0) {
                // 3D飞行物动态更新终点（仅当needUpdateEnd=true时，处理target父节点旋转变化）
                if (flydata.needUpdateEnd && flydata.target && flydata.endLocalPos) {
                    // 计算target当前世界矩阵下的终点世界坐标
                    const currentEndWorld = new Vec3();
                    Vec3.transformMat4(currentEndWorld, flydata.endLocalPos, flydata.target.worldMatrix);

                    // 计算终点偏移量（世界坐标系）
                    const deltaEnd = new Vec3();
                    Vec3.subtract(deltaEnd, currentEndWorld, flydata.points[3]);

                    // 更新终点和控制点（保持曲线形状）
                    flydata.points[3].set(currentEndWorld);
                    Vec3.scaleAndAdd(flydata.points[1], flydata.points[1], deltaEnd, 0.33);
                    Vec3.scaleAndAdd(flydata.points[2], flydata.points[2], deltaEnd, 0.67);
                }

                let t = dt * flydata.speed;
                flydata.time += t;
                flydata.time = Math.min(1, flydata.time)
                const point = this.calculateBezierPosition(flydata.points[0], flydata.points[1], flydata.points[2], flydata.points[3], flydata.time);
                flydata.fly.setWorldPosition(point.x, point.y, point.z);
                if (flydata.endEuler) {
                    Vec3.lerp(flydata.curEuler, flydata.startEuler, flydata.endEuler, flydata.time);
                    flydata.fly.setRotationFromEuler(flydata.curEuler);
                }
                // 缩放插值（性能优化：仅在定义了缩放值时才计算）
                if (flydata.startScale !== undefined && flydata.endScale !== undefined) {
                    const scaleX = flydata.startScale.x + (flydata.endScale.x - flydata.startScale.x) * flydata.time;
                    const scaleY = flydata.startScale.y + (flydata.endScale.y - flydata.startScale.y) * flydata.time;
                    const scaleZ = flydata.startScale.z + (flydata.endScale.z - flydata.startScale.z) * flydata.time;
                    flydata.fly.setScale(scaleX, scaleY, scaleZ);
                }
                if (flydata.time >= 1) {
                    flydata.complete = 1;
                }
            } else {
                propFlyList.splice(i, 1);
                flydata.callback && flydata.callback();
            }
        }
    }
    /**
     * 创建贝塞尔曲线飞行物
     * @param fly 飞行物(在调用此方法前设置setParent(GameInfo.instance.gameMgr.effLayer))
     * @param target 目标节点
     * @param endLocalPos 目标节点的局部坐标
     * @param radius 曲线最大半径
     * @param cb 回调函数   
     * @param power 速度
     * @param flyType 0=对称弧线 1=迂回型 2=返回型；其它数值=直接型（默认 0）
     * @param eulerAngles 目标旋转角度
     * @param needUpdateEnd 是否需要动态更新终点坐标（当target父节点会旋转时设为true，默认false以节约性能）
     * @param endScale 终点缩放值
     */
    createFly(fly: Node, target: Node, endLocalPos: Vec3, radius: number = 1, cb?: () => void, power: number = 1, flyType: number = 0, eulerAngles?: Vec3, needUpdateEnd: boolean = false, endScale?: Vec3) {
        const flydata = new FlyData();

        // 获取起点世界坐标
        const startWorldPos = fly.worldPosition.clone();
        // 将target的局部坐标转为世界坐标
        const endWorldPos = new Vec3();
        Vec3.transformMat4(endWorldPos, endLocalPos, target.worldMatrix);
        flydata.fly = fly;
        flydata.target = target;
        flydata.complete = 0;
        flydata.time = 0.0;
        flydata.callback = cb;
        flydata.speed = power;
        flydata.endLocalPos = needUpdateEnd ? endLocalPos.clone() : undefined;
        flydata.needUpdateEnd = needUpdateEnd;

        if (eulerAngles) {
            flydata.curEuler = fly.eulerAngles.clone();
            flydata.startEuler = fly.eulerAngles.clone();
            flydata.endEuler = eulerAngles;
        }

        // 存储缩放值（从fly节点获取初始缩放）
        flydata.startScale = fly.scale.clone();
        if (endScale !== undefined) {
            flydata.endScale = endScale.clone();
        }

        // 使用3D逻辑计算控制点（世界坐标系）
        flydata.points = this.getControlPoint(startWorldPos, endWorldPos, flyType, radius, true);
        this.propFlyList.push(flydata);
        //如果有影子，则添加渐隐动画
        const flyShadow = fly.getChildByName("Shadow")
        if (flyShadow) {
            const shadowOpacity = flyShadow.getComponent(UIOpacity);
            if (shadowOpacity) {
                if (shadowOpacity.opacity > 0) {
                    tween(shadowOpacity).to(0.2, { opacity: 0 }).start();
                }
            }
        }
    }

    /**
     * 从容器获取或创建物品（辅助方法）
     * @param sourceContainer 源容器
     * @param prefabPath 预制体路径
     * @param currentViewCount 当前视图计数
     * @returns 物品节点，失败返回 null
     */
    private getOrCreateItemFromContainer(
        sourceContainer: ItemContainer,
        prefabPath: PrefabPathEnum,
        currentViewCount: number
    ): Node | null {
        const maxDisplayCount = sourceContainer.maxLayers * sourceContainer.columns * sourceContainer.rows;

        if (currentViewCount > maxDisplayCount) {
            // 超出最大数量，新生成一个
            const item = GameInfo.instance.prefabMgr.getPrefab(prefabPath);
            if (!item) {
                console.error(`[FlyManager] 无法获取预制体: ${prefabPath}`);
                return null;
            }
            const pos = sourceContainer.getLastItemWorldPos();
            item.setParent(GameInfo.instance.gameMgr.effLayer);
            item.setWorldPosition(pos);
            return item;
        } else {
            // 未超出，从源容器取最后一个物品
            const item = sourceContainer.getLastItem();
            if (!item) {
                // 降级处理：当取不到物品时返回 null
                return null;
            }
            const itemWorldPos = item.worldPosition;
            item.setParent(GameInfo.instance.gameMgr.effLayer);
            item.setWorldPosition(itemWorldPos);
            if (sourceContainer.isEmpty()) {
                sourceContainer.hideShadow();
            }
            return item;
        }
    }


    /**
     * 统一的飞行方法
     * 
     * NOTE: 缺失单个场景中已存在Item的飞行方法, 请暂时使用createFly3D方法
     * 
     * 使用示例：
     * 
     * 1. 容器→目标（外部处理计数和目标容器的addItem）：
     * ```
     * // 前置检查并扣除计数
     * if (this.remainFood < 1) return;
     * this.remainFood -= 1;
     * // 飞行物超出容器数量需要传入 viewCountGetter: () => GameInfo.instance.viewMgr.MeatCoin;
     * flyItem({
     *     sourceContainer: foodContainer,
     *     targetNode: player.node,
     *     targetLocalPos: v3(0, 0, 0),
     *     prefabPath: PrefabPathEnum.COIN_MEAT,
     *     viewCountGetter: () => GameInfo.instance.viewMgr.MeatCoin,
     *     onComplete: (item) => {
     *         if (item) {
     *             playerContainer.addItem(item);
     *         } else {
     *             this.remainFood += 1; // 失败时恢复
     *         }
     *     }
     * });
     * ```
     * 
     * 2. 世界坐标→目标：
     * ```
     * flyItem({
     *     sourceWorldPos: monster.worldPosition,
     *     targetNode: player.node,
     *     targetLocalPos: v3(0, 0, 0),
     *     prefabPath: PrefabPathEnum.COIN_GOLD,
     *     onComplete: (item) => {
     *         if (item) {
     *             playerContainer.addItem(item);
     *             GameInfo.instance.viewMgr.GoldCoin += 1;
     *         }
     *     }
     * });
     * ```
     * 
     * @param options 飞行配置选项
     */
    flyItem(options: FlyItemOptions): void {
        const {
            sourceContainer,
            sourceWorldPos,
            targetNode,
            targetLocalPos,
            targetLocalEulerAngles,
            prefabPath,
            viewCountGetter,
            onBeforeFly,
            onComplete,
            flyParams
        } = options;

        // 参数验证：源必须提供其一
        if (!sourceContainer && !sourceWorldPos) {
            console.error('[FlyManager] flyItem: 必须提供 sourceContainer 或 sourceWorldPos');
            return;
        }

        // 参数验证：源不能同时提供
        if (sourceContainer && sourceWorldPos) {
            console.error('[FlyManager] flyItem: sourceContainer 和 sourceWorldPos 不能同时提供');
            return;
        }
        if (!targetLocalEulerAngles) {
            targetLocalEulerAngles
        }
        let item: Node | null = null;

        // 场景1：源为容器
        if (sourceContainer) {
            if (onBeforeFly) {
                onBeforeFly();
            }
            // 调用方应该在外部检查 children.length，这里做最后一次保护
            if (sourceContainer.root.children.length < 1) {
                if (onComplete) onComplete(null);
                return;
            }
            // 从容器获取物品
            const currentCount = viewCountGetter ? viewCountGetter() : sourceContainer.root.children.length;
            item = this.getOrCreateItemFromContainer(sourceContainer, prefabPath, currentCount);
            if (!item) {
                if (onComplete) onComplete(null);
                return;
            }
        }
        // 场景2：源为世界坐标
        else if (sourceWorldPos) {
            if (onBeforeFly) {
                onBeforeFly();
            }

            item = GameInfo.instance.prefabMgr.getPrefab(prefabPath);
            if (!item) {
                console.error(`[FlyManager] flyItem: 无法获取预制体: ${prefabPath}`);
                if (onComplete) onComplete(null);
                return;
            }
            item.setParent(this.effLayer);
            item.setWorldPosition(sourceWorldPos);
        }

        const { radius, power, flyType, needUpdateEnd, startScale, endScale, endEulerAngles, startEulerAngles } = {
            ...FlyManager.DEFAULT_FLY_PARAMS.containerToContainer,
            ...flyParams
        };

        // 设置初始缩放
        if (startScale !== undefined) {
            item.setScale(startScale.x, startScale.y, startScale.z);
        }
        if (startEulerAngles !== undefined) {
            item.setRotationFromEuler(startEulerAngles);
        }
        // 创建飞行动画
        this.createFly(item, targetNode, targetLocalPos, radius, () => {
            // 完全交由调用者处理
            if (onComplete) {
                onComplete(item);
            }
        }, power, flyType, endEulerAngles, needUpdateEnd, endScale);
    }


    /**
     * 获取贝塞尔曲线控制点（所有坐标均为世界坐标系）
     *
     * type（与 createFly / flyParams.flyType 共用同一套枚举）：
     * - 0：对称弧线型 — 2D 为起点反拉 + 终点侧向偏移；3D 为抬高中点弧线；距离很近时 3D 见 getControlPoint3DClose 的抛起落下
     * - 1：迂回型 — 侧向迂回
     * - 2：返回型 — 先向反方向拉开再靠向终点；距离很近时 3D 与 type=1 同为迂回式靠近（见 getControlPoint3DClose）
     * - 其它：直接型 — 略随机但贴近起终点连线的控制点
     *
     * @param startPoint 起点世界坐标
     * @param endPoint 终点世界坐标
     * @param type 曲线类型，见上文
     * @param radius 曲线强度半径（迂回/返回/随机偏移等会用到）
     * @param isD3 true=场景 3D 世界坐标；false=UI 等平面用法（控制点 z 多为 0，仍传世界坐标）
     * @returns 控制点数组 [起点, 控制点1, 控制点2, 终点]
     */
    getControlPoint(startPoint: Vec3, endPoint: Vec3, type: number = 0, radius: number = 1, isD3: boolean = false): Vec3[] {
        return isD3
            ? this.getControlPoint3D(startPoint, endPoint, type, radius)
            : this.getControlPoint2D(startPoint, endPoint, type, radius);
    }

    /** 2D 控制点（UI 等平面）；type 含义与 getControlPoint3D 一致 */
    public getControlPoint2D(startPoint: Vec3, endPoint: Vec3, type: number, radius: number): Vec3[] {
        const dx = endPoint.x - startPoint.x;
        const dy = endPoint.y - startPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const controlRange = distance * (0.6 + Math.random() * 0.8);
        let x1 = 0, y1 = 0, x2 = 0, y2 = 0;

        // 起终点重合时避免除零，退化为直线
        if (distance < 1e-5) {
            return [startPoint, startPoint.clone(), endPoint.clone(), endPoint];
        }

        switch (type) {
            case 0: // 对称弧线型：起点反拉 + 终点侧向，与 3D case0 同属「弧」而非返回
                x1 = startPoint.x - dx * (0.3 + Math.random() * 0.5);
                y1 = startPoint.y - dy * (0.3 + Math.random() * 0.5);
                const dir = (Math.random() > 0.5 ? 1 : -1);
                x2 = endPoint.x + (-dy * dir * (0.4 + Math.random() * 0.6) * controlRange / distance);
                y2 = endPoint.y + (dx * dir * (0.4 + Math.random() * 0.6) * controlRange / distance);
                break;
            case 1: // 迂回型
                const detourDir = (Math.random() > 0.5 ? 1 : -1);
                x1 = startPoint.x + (-dy * detourDir * (0.3 + Math.random() * 0.4) * controlRange / distance);
                y1 = startPoint.y + (dx * detourDir * (0.3 + Math.random() * 0.4) * controlRange / distance);
                x2 = startPoint.x + dx * 0.6 + (-dy * detourDir * (0.5 + Math.random() * 0.5) * controlRange / distance);
                y2 = startPoint.y + dy * 0.6 + (dx * detourDir * (0.5 + Math.random() * 0.5) * controlRange / distance);
                break;
            case 2: { // 返回型（与 getControlPoint3DReturn 的 XY 逻辑对齐）
                const backOffset = radius * (0.3 + Math.random() * 0.5);
                const rand = () => (Math.random() - 0.5);
                x1 = startPoint.x - dx * (0.3 + Math.random() * 0.3) + rand() * backOffset;
                y1 = startPoint.y - dy * (0.3 + Math.random() * 0.3) + rand() * backOffset;
                x2 = endPoint.x + rand() * radius * 0.8;
                y2 = endPoint.y + rand() * radius * 0.8;
                break;
            }
            default: // 直接型
                x1 = startPoint.x + (Math.random() - 0.5) * controlRange * 0.3;
                y1 = startPoint.y + (Math.random() - 0.5) * controlRange * 0.3;
                x2 = startPoint.x + dx * 0.7 + (Math.random() - 0.5) * controlRange * 0.3;
                y2 = startPoint.y + dy * 0.7 + (Math.random() - 0.5) * controlRange * 0.3;
        }

        // UI边界限制
        const clamp = (v: number, max: number) => v > 0 ? Math.min(v, max) : Math.max(v, -max);
        const uiHalfW = GameInfo.instance.uiSize.width * 0.5;
        const uiHalfH = GameInfo.instance.uiSize.height * 0.5;
        return [startPoint, v3(clamp(x1, uiHalfW), clamp(y1, uiHalfH), 0), v3(clamp(x2, uiHalfW), clamp(y2, uiHalfH), 0), endPoint];
    }

    /** 3D 控制点；type 与 getControlPoint2D / flyType 一致 */
    public getControlPoint3D(startPoint: Vec3, endPoint: Vec3, type: number, radius: number): Vec3[] {
        const dx = endPoint.x - startPoint.x;
        const dy = endPoint.y - startPoint.y;
        const dz = endPoint.z - startPoint.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // 近距离特殊处理（type 0/1/2 分支含义见 getControlPoint3DClose）
        if (distance < 0.5) {
            return this.getControlPoint3DClose(startPoint, endPoint, type, radius, dx, dy, dz);
        }

        // 正常距离处理
        const maxY = Math.max(startPoint.y, endPoint.y);
        switch (type) {
            case 0: // 对称弧线
                const mid = v3((startPoint.x + endPoint.x) / 2, maxY + radius, (startPoint.z + endPoint.z) / 2);
                return [startPoint, mid.clone(), mid.clone(), endPoint];
            case 1: // 迂回型
                return this.getControlPoint3DDetour(startPoint, endPoint, dx, dy, dz, radius);
            case 2: // 返回型
                return this.getControlPoint3DReturn(startPoint, endPoint, dx, dy, dz, radius);
            default: // 直接型
                const offset = radius * 0.3;
                const rand = () => (Math.random() - 0.5) * offset;
                return [
                    startPoint,
                    v3(startPoint.x + dx * 0.33 + rand(), startPoint.y + dy * 0.33 + rand(), startPoint.z + dz * 0.33 + rand()),
                    v3(startPoint.x + dx * 0.67 + rand(), startPoint.y + dy * 0.67 + rand(), startPoint.z + dz * 0.67 + rand()),
                    endPoint
                ];
        }
    }

    /** 近距离 3D 控制点（与主路径 type 对应：0 抛起；1/2 均为侧绕式靠近，因距离过近不再区分迂回与返回） */
    public getControlPoint3DClose(start: Vec3, end: Vec3, type: number, r: number, dx: number, dy: number, dz: number): Vec3[] {
        const maxY = Math.max(start.y, end.y);
        const randAngle = () => Math.random() * Math.PI * 2;
        const rand = () => (Math.random() - 0.5);

        switch (type) {
            case 0: // 抛起落下（对应主路径「对称弧线」的近距离变体）
                const angle = randAngle();
                const dist = r * 0.3;
                return [start, v3(start.x + Math.cos(angle) * dist, maxY + r, start.z + Math.sin(angle) * dist), v3(end.x, maxY + r, end.z), end];
            case 1:
            case 2: // 迂回/返回：近距离共用同一套侧绕控制点
                const backAngle = randAngle();
                const backDist = r * (0.3 + Math.random() * 0.5);
                return [
                    start,
                    v3(start.x + Math.cos(backAngle) * backDist, start.y + rand() * backDist, start.z + Math.sin(backAngle) * backDist),
                    v3(end.x + rand() * r * 0.5, end.y + rand() * r * 0.5, end.z + rand() * r * 0.5),
                    end
                ];
            default: // 直线
                return [start, v3(start.x + dx * 0.33, start.y + dy * 0.33, start.z + dz * 0.33), v3(start.x + dx * 0.67, start.y + dy * 0.67, start.z + dz * 0.67), end];
        }
    }

    /** 3D迂回型控制点 */
    public getControlPoint3DDetour(start: Vec3, end: Vec3, dx: number, dy: number, dz: number, r: number): Vec3[] {
        const dir = v3(dx, dy, dz).normalize();
        const perp1 = new Vec3();
        Vec3.cross(perp1, dir, Math.abs(dir.y) < 0.9 ? v3(0, 1, 0) : v3(1, 0, 0));
        perp1.normalize();
        const perp2 = new Vec3();
        Vec3.cross(perp2, dir, perp1);
        perp2.normalize();

        const calcOffset = (t: number, offsetScale: number) => {
            const angle = Math.random() * Math.PI * 2;
            const dist = r * offsetScale;
            const cos = Math.cos(angle), sin = Math.sin(angle);
            return v3(
                start.x + dx * t + (perp1.x * cos + perp2.x * sin) * dist,
                start.y + dy * t + (perp1.y * cos + perp2.y * sin) * dist,
                start.z + dz * t + (perp1.z * cos + perp2.z * sin) * dist
            );
        };

        return [start, calcOffset(0.3, 0.3 + Math.random() * 0.4), calcOffset(0.7, 0.5 + Math.random() * 0.5), end];
    }

    /** 3D返回型控制点 */
    public getControlPoint3DReturn(start: Vec3, end: Vec3, dx: number, dy: number, dz: number, r: number): Vec3[] {
        const backOffset = r * (0.3 + Math.random() * 0.5);
        const rand = () => (Math.random() - 0.5);
        return [
            start,
            v3(start.x - dx * (0.3 + Math.random() * 0.3) + rand() * backOffset, start.y - dy * (0.3 + Math.random() * 0.3) + rand() * backOffset, start.z - dz * (0.3 + Math.random() * 0.3) + rand() * backOffset),
            v3(end.x + rand() * r * 0.8, end.y + rand() * r * 0.8, end.z + rand() * r * 0.8),
            end
        ];
    }
    public calculateBezierPosition(start: Vec3, control1: Vec3, control2: Vec3, end: Vec3, t: number) {
        const x = this.bezierPoint(t, start.x, control1.x, control2.x, end.x);
        const y = this.bezierPoint(t, start.y, control1.y, control2.y, end.y);
        const z = this.bezierPoint(t, start.z, control1.z, control2.z, end.z);
        return new Vec3(x, y, z);
    }
    /**
     * 三次贝塞尔曲线计算
     * @param t 
     * @param p0 起点
     * @param p1 控制1
     * @param p2 控制2
     * @param p3 终点
     * @returns 贝塞尔曲线上的值
     */
    public bezierPoint(t: number, p0: number, p1: number, p2: number, p3: number): number {
        const cX = 3 * (p1 - p0);
        const bX = 3 * (p2 - p1) - cX;
        const aX = p3 - p0 - cX - bX;
        return aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + p0;
    }
}

/**
 * 飞行参数配置
 * 
 * @example
 * ```typescript
 * // 基础飞行
 * flyParams: { radius: 2, power: 5, flyType: 0 }
 * 
 * // 带缩放动画
 * flyParams: { 
 *     radius: 3, 
 *     power: 4, 
 *     startScale: v3(0.5, 0.5, 0.5),  // 从0.5倍开始
 *     endScale: v3(1.5, 1.5, 1.5)     // 到1.5倍结束
 * }
 * 
 * // 带旋转和缩放
 * flyParams: { 
 *     radius: 2, 
 *     power: 5,
 *     startScale: v3(1, 1, 1),
 *     endScale: v3(2, 0.5, 2),        // xyz独立缩放
 *     eulerAngles: v3(0, 360, 0)      // Y轴旋转360度
 * }
 * ```
 */
export interface FlyParams {
    /** 
     * 曲线半径
     * @default 5
     */
    radius?: number;

    /** 
     * 飞行速度
     * @default 2
     */
    power?: number;

    /** 
     * 飞行类型（与 FlyManager.getControlPoint 的 type 一致）
     * - 0: 对称弧线
     * - 1: 迂回型
     * - 2: 返回型
     * - 其它数值: 直接型
     * @default 0
     */
    flyType?: number;

    /** 
     * 是否动态更新终点坐标（当target父节点会旋转时设为true）
     * 
     * 一般只有主角移动时需要更新终点坐标
     * @default false
     */
    needUpdateEnd?: boolean;

    /** 
     * 飞行物初始缩放值（xyz独立缩放）
     * @default 使用fly节点当前的scale值
     * @example v3(0.5, 0.5, 0.5) // 从0.5倍开始
     */
    startScale?: Vec3;

    /** 
     * 飞行物终点缩放值（xyz独立缩放）
     * @default 使用startScale值（不缩放）
     * @example v3(1.5, 1.0, 1.5) // xyz独立缩放
     */
    endScale?: Vec3;

    /** 
     * 目标旋转角度（欧拉角）
     * @default 不旋转
     * @example v3(0, 360, 0) // Y轴旋转360度
     */
    endEulerAngles?: Vec3;
    /** 
     * 飞行物初始旋转角度
     * @default 不旋转
     * @example v3(0, 360, 0) // Y轴旋转360度
     */
    startEulerAngles?: Vec3;
}

/**
 * 统一飞行方法的参数配置
 * 
 * @example
 * ```typescript
 * // 从世界坐标飞行（如怪物掉落）
 * FlyManager.instance.flyItem({
 *     sourceWorldPos: monster.worldPosition,
 *     targetNode: player.node,
 *     targetLocalPos: v3(0, 0, 0),
 *     prefabPath: PrefabPathEnum.COIN_GOLD,
 *     onComplete: (item) => {
 *         if (item) playerContainer.addItem(item);
 *     },
 *     flyParams: { 
 *         radius: 2, 
 *         power: 5, 
 *         flyType: 0,
 *         startScale: v3(0.5, 0.5, 0.5),
 *         endScale: v3(1.5, 1.5, 1.5),
 *         eulerAngles: v3(0, 360, 0)
 *     }
 * });
 * 
 * // 从容器飞行
 * FlyManager.instance.flyItem({
 *     sourceContainer: foodContainer,
 *     targetNode: player.node,
 *     targetLocalPos: v3(0, 0, 0),
 *     prefabPath: PrefabPathEnum.COIN_MEAT,
 *     viewCountGetter: () => GameInfo.instance.viewMgr.MeatCoin,
 *     onComplete: (item) => {
 *         if (item) playerContainer.addItem(item);
 *     },
 *     flyParams: { radius: 3, power: 4 }
 * });
 * ```
 */
export interface FlyItemOptions {
    /** 
     * 源容器（与sourceWorldPos二选一）
     * @description 从容器中获取物品进行飞行
     */
    sourceContainer?: ItemContainer;

    /** 
     * 源世界坐标（与sourceContainer二选一）
     * @description 从指定世界坐标创建物品进行飞行
     */
    sourceWorldPos?: Vec3;

    /** 
     * 目标节点（必需）
     * @description 飞行物的目标节点
     */
    targetNode: Node;

    /** 
     * 目标局部坐标（必需）
     * @description 相对于targetNode的局部坐标
     */
    targetLocalPos: Vec3;

    /** 
     * 目标局部旋转角
     * @description 目标节点的局部欧拉角（暂未使用）
     */
    targetLocalEulerAngles?: Vec3;

    /** 
     * 预制体路径（必需）
     * @description 飞行物的预制体路径枚举
     */
    prefabPath: PrefabPathEnum;

    /** 
     * 获取当前视图数量的函数
     * @description 源为容器且有溢出数量时使用，用于判断是否需要新建物品
     */
    viewCountGetter?: () => number;

    /** 
     * 飞行前回调
     * @description 在物品开始飞行前执行
     */
    onBeforeFly?: () => void;

    /** 
     * 飞行完成回调
     * @description 在此处理 addItem/recoverPrefab/计数更新等逻辑
     * @param item 飞行的物品节点，失败时为null
     */
    onComplete?: (item: Node | null) => void;

    /** 
     * 飞行参数（可选）
     * @description 控制飞行曲线、速度、缩放、旋转等效果
     * @see FlyParams
     */
    flyParams?: FlyParams;
}


export class FlyData {
    fly: Node;
    target: Node;
    speed: number = 1;
    /**贝塞尔点位 起点, 控制点1, 控制点2, 终点（世界坐标） */
    points?: Vec3[];
    /**是否完成 0=进行中 1=已完成 */
    complete: number = 0;
    /**飞行进度0-1 */
    time?: number = 0;
    callback?: <T> (param?: T) => void;
    /**3D飞行物起始旋转角度 */
    startEuler?: Vec3;
    /**3D飞行物目标旋转角度 */
    endEuler?: Vec3;
    /**3D飞行物当前旋转角度 */
    curEuler?: Vec3;
    /**目标节点的局部坐标（3D飞行物动态计算终点用） */
    endLocalPos?: Vec3;
    /**是否需要动态更新终点坐标（用于target父节点旋转变化的情况，性能优化） */
    needUpdateEnd?: boolean;
    /**飞行物初始缩放值 */
    startScale?: Vec3;
    /**飞行物终点缩放值 */
    endScale?: Vec3;
}