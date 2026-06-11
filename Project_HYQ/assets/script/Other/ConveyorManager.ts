// import { _decorator, CCFloat, Component, Node, v3, Vec3 } from 'cc';
// import { PrefabPathEnum } from '../Common/CommonEnum';
// import { GameInfo } from '../Common/GameInfo';
// import FlyManager from '../Manager/FlyManager';
// import { ItemContainer } from '../Common/ItemContainer';
// import { ConveyorCtrl } from './ConveyorCtrl';
// const { ccclass, property } = _decorator;

// /** 路径段信息（预计算，避免每帧重复计算） */
// interface PathSegment {
//     startPos: Vec3;      // 段起点
//     endPos: Vec3;        // 段终点
//     direction: Vec3;     // 归一化方向向量
//     length: number;      // 段长度
// }

// /** 物品传输数据 */
// interface TransportItem {
//     node: Node;
//     pathId: number;
//     waypointIndex: number;  // 当前所在路径段索引
//     speed: number;
//     segmentProgress: number; // 当前段的进度 [0, 1]，0表示在起点，1表示在终点
// }
// //传送带脚本
// @ccclass('ConveyorManager')
// export class ConveyorManager extends Component {
//     @property(Node)
//     root: Node = null!;
//     @property({ type: [Node], displayName: '传送带模型' })
//     public conveyorModel: Node[] = [];
//     @property({ type: ConveyorCtrl, displayName: '传送带节点' })
//     public conveyorCtrl: ConveyorCtrl[] = [];
//     // @property({ type: Node, displayName: '传送带节点' })
//     // conveyorNode: Node = null!;


//     @property({ type: [Node], displayName: '传送带路径点1' })
//     public ConveyorPath1: Node[] = [];



//     // 传送的物品列表
//     private activeItems: TransportItem[] = [];
//     private spawnAccumulatorMs: number = 0;
//     private spawnIntervalMs: number = 500; // 频率（毫秒）
//     /**
//      * 路径段长度缓存 - 性能优化
//      * key: pathId, value: 每段的长度数组 [段0长度, 段1长度, ...]
//      * 避免每帧重复计算 Math.sqrt，对于几十个物品的场景可节省大量性能
//      */
//     private pathSegmentLengthsCache: Map<number, number[]> = new Map();
//     /**
//      * 路径点世界坐标缓存 - 性能优化
//      * key: pathId, value: 路径点的世界坐标数组
//      * 避免每帧重复构建数组和clone Vec3
//      */
//     private pathWorldPointsCache: Map<number, Vec3[]> = new Map();
//     /**
//      * 路径点Angle角缓存（3D欧拉角，绕Y轴）- 性能优化
//      * key: pathId, value: 每个路径点对应的Angle角数组
//      * 直接复用场景中路径点位的欧拉角数据，避免每帧读取节点旋转
//      */
//     private pathLocalAnglePointsCache: Map<number, number[]> = new Map();
//     /** 基础速度 */
//     @property(CCFloat)
//     private baseSpeed: number = 12.0;
//     /** 解锁进度 */
//     private step = 0;
//     onLoad() {
//         GameInfo.instance.conveyorMgr = this;
//         // 预缓存所有路径的世界坐标
//         this.precacheAllPathPoints();
//         this.step = 0;
//     }
//     protected start(): void {
//     }
//     /** 按阶段解锁传送带
//      */
//     UnlockConveyorStep(step: number = 0) {
//         // this.step = 3;
//         this.step = step;
//         this.conveyorCtrl[this.step].unlockConveyor();
//         //NOTE: conveyorCtrl激活应该放到此处, 但是激活动画不方便, 暂时放到此处
//     }
//     /**
//      * 预缓存所有路径的世界坐标
//      */
//     private precacheAllPathPoints(): void {
//         for (let pathId = 0; pathId < 3; pathId++) {
//             this.getPathWorldPointsCached(pathId);
//         }
//     }
//     update(dt: number) {
//         if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin) return;
//         // 基于解锁的生成：只要传送带2解锁，从路径2起点按频率生成
//         this.spawnAccumulatorMs += dt * 1000;
//         if (this.spawnAccumulatorMs >= this.spawnIntervalMs) {
//             this.spawnAccumulatorMs = 0;
//             if (this.conveyorCtrl[0].isWorking) {
//                 //传送带1解锁
//                 this.spawnItemAtPathStart(0, this.baseSpeed);
//             }
//             // if (this.conveyorCtrl[1].isWorking) {
//             //     //传送带2解锁
//             //     this.spawnItemAtPathStart(2, this.baseSpeed);
//             // }
//             // if (this.conveyorCtrl[2].isWorking) {
//             //     //传送带3解锁
//             //     this.spawnItemAtPathStart(3, this.baseSpeed);
//             // }
//         }
//         // 推进所有物品
//         this.updateItems(dt);
//     }


//     /**
//      * 推进所有item沿各自路径移动，处理在端点的复制与回收
//      */
//     private updateItems(deltaTime: number) {
//         if (!this.activeItems.length) return;

//         // 优化1: 使用倒序遍历，避免splice时的索引问题
//         // 优化2: 将需要回收的物品先收集，遍历结束后统一处理
//         const itemsToRecycle: TransportItem[] = [];

//         for (let index = this.activeItems.length - 1; index >= 0; index--) {
//             const item = this.activeItems[index];
//             // 优化3: 使用缓存的路径点数组，避免每帧重新构建
//             const points = this.getPathWorldPointsCached(item.pathId);
//             if (points.length < 2) {
//                 //移动点位不足时直接回收
//                 itemsToRecycle.push(item);
//                 continue;
//             }
//             const fromIdx = item.waypointIndex;
//             if (fromIdx >= points.length - 1) {
//                 this.onItemReachPathEnd(item);
//                 continue;
//             }
//             const toIdx = item.waypointIndex + 1;
//             const from = points[fromIdx];
//             const to = points[toIdx];
//             // 从缓存获取当前段的长度（性能优化：避免每帧计算sqrt）
//             const segmentLength = this.getSegmentLength(item.pathId, item.waypointIndex);

//             // 段长度过短，直接跳到下一段
//             if (segmentLength < 0.0001) {
//                 item.waypointIndex++;
//                 item.segmentProgress = 0;
//                 continue;
//             }
//             // 公式: progressDelta = 本帧移动距离 / 段总长度
//             const moveDistance = item.speed * deltaTime;
//             const progressDelta = moveDistance / segmentLength;
//             const nextProgress = item.segmentProgress + progressDelta;

//             const Angles = this.getPathLocalAnglePointsCached(item.pathId);
//             const AngleFrom = this.getAngleSafe(Angles, fromIdx);
//             const AngleTo = this.getAngleSafe(Angles, toIdx);
//             // 3D：使用路径点位的3D欧拉角(Angle)进行插值旋转
//             const Angle = this.lerpAngleShortest(AngleFrom, AngleTo, nextProgress);
//             if (GameInfo.isD3Scene) {
//                 item.node.setRotationFromEuler(0, Angle, 0);
//             } else {
//                 item.node.angle = Angle;
//             }

//             item.segmentProgress = nextProgress;
//             if (item.segmentProgress >= 1.0) {
//                 // 切换到下一段
//                 item.waypointIndex++;
//                 item.segmentProgress = 0;
//                 // 直接设置到路径点位置，避免累积误差
//                 item.node.setWorldPosition(to.x, to.y, to.z);
//             } else {
//                 const newPos = v3();
//                 Vec3.lerp(newPos, from, to, item.segmentProgress);
//                 item.node.setWorldPosition(newPos);
//             }
//         }

//         // 统一处理需要回收的物品
//         for (const item of itemsToRecycle) {
//             this.recycleItem(item);
//         }
//     }
//     /**
//      * 获取路径指定段的长度（带缓存）- 优化版本
//      * @param pathId 路径ID
//      * @param segmentIndex 段索引（起点索引）
//      * @returns 段长度，如果无效则返回0
//      */
//     private getSegmentLength(pathId: number, segmentIndex: number): number {
//         // 检查缓存是否存在
//         if (!this.pathSegmentLengthsCache.has(pathId)) {
//             // 首次访问，预计算该路径所有段的长度
//             // 优化: 使用缓存的路径点，避免重新构建数组
//             const points = this.getPathWorldPointsCached(pathId);
//             const lengths: number[] = [];

//             for (let i = 0; i < points.length - 1; i++) {
//                 const from = points[i];
//                 const to = points[i + 1];
//                 const dx = to.x - from.x;
//                 const dy = to.y - from.y;
//                 const dz = to.z - from.z;
//                 const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
//                 lengths.push(length);
//             }

//             this.pathSegmentLengthsCache.set(pathId, lengths);
//         }

//         // 从缓存中获取
//         const lengths = this.pathSegmentLengthsCache.get(pathId)!;
//         if (segmentIndex >= 0 && segmentIndex < lengths.length) {
//             return lengths[segmentIndex];
//         }

//         return 0;
//     }
//     /**
//      * 清除路径长度缓存
//      * 如果路径点位发生变化，需要调用此方法清除缓存
//      * @param pathId 可选，指定路径ID则只清除该路径，否则清除所有
//      */
//     private clearPathLengthCache(pathId?: number): void {
//         if (pathId !== undefined) {
//             this.pathSegmentLengthsCache.delete(pathId);
//         } else {
//             this.pathSegmentLengthsCache.clear();
//         }
//     }
//     /** 路径终点处理：复制/回收/转移next_path起点 */
//     private onItemReachPathEnd(b: TransportItem) {
//         const endPos = b.node.worldPosition.clone();
//         if (b.pathId === 0) {
//             let build = GameInfo.instance.buildingMgr.shopBuilds[0];
//             let endLocalPos = build.commodityContainer.preprocessData();
//             build.reserveWater(1)
//             this.recycleItem(b, false);
//             FlyManager.instance.createFly(b.node, build.waterContainer.root, endLocalPos, 1, () => {
//                 build.waterContainer.addItem(b.node);
//                 build.updateWater(1);
//             }, 2, 0, v3(0, 0, 0));
//             return;
//         }
//     }
//     /**
//      * 生成物品
//      * @param startWpos 
//      * @returns 
//      */
//     createItem(pathId: number, startWpos: Vec3): Node {
//         return GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.COIN_MEAT);
//     }
//     /**
//      * 在指定路径的起点  获取源容器一个物品
//      */
//     private spawnItemAtPathStart(pathId: number, speed: number) {
//         const points = this.getPathWorldPointsCached(pathId);
//         if (points.length < 2) return;
//         const start = points[0];
//         const startWpos = v3(start.x, start.y, start.z);
//         const resourceContainer = this.getPathSourceContainer(pathId);
//         const empty = resourceContainer.isEmpty();
//         if (empty) {
//             return;
//         }
//         const targetLocalPos = v3()
//         GameInfo.instance.gameMgr.effLayer.inverseTransformPoint(targetLocalPos, startWpos);
//         FlyManager.instance.flyItem({
//             sourceContainer: resourceContainer,
//             targetNode: GameInfo.instance.gameMgr.effLayer,
//             targetLocalPos: targetLocalPos,
//             prefabPath: PrefabPathEnum.COIN_WATER,
//             onComplete: (item) => {
//                 if (item) {
//                     this.activeItems.push({ node: item, pathId, waypointIndex: 0, speed, segmentProgress: 0 });
//                     item.setParent(this.node);
//                 }
//             },
//             flyParams: { radius: 1, power: 2, flyType: 0 }
//         });
//     }
//     private recycleItem(item: TransportItem, isRecover: boolean = true) {
//         if (item.node && item.node.isValid) {
//             this.activeItems.splice(this.activeItems.indexOf(item), 1);
//             if (isRecover) GameInfo.instance.prefabMgr.recoverPrefab(item.node);
//         }
//     }

//     /**
//      * 获取路径的世界坐标点（带缓存）- 性能优化版本
//      * @param pathId 路径ID
//      * @returns 缓存的路径点数组
//      */
//     private getPathWorldPointsCached(pathId: number): Vec3[] {
//         // 检查缓存是否存在
//         if (this.pathWorldPointsCache.has(pathId)) {
//             return this.pathWorldPointsCache.get(pathId)!;
//         }
//         // 首次访问，构建并缓存
//         const nodes = this.getPathNodes(pathId);
//         const pts: Vec3[] = [];
//         for (let i = 0; i < nodes.length; i++) {
//             if (!nodes[i]) continue;
//             // console.error("pathId", nodes[i].position);
//             pts.push(nodes[i].worldPosition.clone());
//         }
//         this.pathWorldPointsCache.set(pathId, pts);
//         // console.error("pathId:", pathId, "=======", pts);
//         return pts;
//     }

//     /** NOTE: 3D版本需要保证移动Item的父节点不存在任何旋转, 否则会影响计算结果
//      * 
//      * 获取路径点Angle数组（带缓存）
//      * 
//      * Angle来自路径点位的3D欧拉角（绕Y轴）缓存
//      */
//     private getPathLocalAnglePointsCached(pathId: number): number[] {
//         if (this.pathLocalAnglePointsCache.has(pathId)) {
//             return this.pathLocalAnglePointsCache.get(pathId)!;
//         }
//         const nodes = this.getPathNodes(pathId);
//         const Angles: number[] = [];
//         for (let i = 0; i < nodes.length; i++) {
//             const n = nodes[i];
//             if (!n) continue;
//             // 该项目运行时类型定义未提供 worldEulerAngles，这里使用路径点自身欧拉角数据
//             Angles.push(this.normalizeAngleDeg(n.eulerAngles.y));
//         }
//         this.pathLocalAnglePointsCache.set(pathId, Angles);
//         return Angles;
//     }


//     /** 安全读取Angle，越界时回退到0 */
//     private getAngleSafe(Angles: number[], idx: number): number {
//         if (!Angles || !Angles.length) return 0;
//         if (idx < 0) return Angles[0];
//         if (idx >= Angles.length) return Angles[Angles.length - 1];
//         return Angles[idx];
//     }

//     /**
//      * Angle最短角插值（单位：度）
//      * 解决例如 350° -> 10° 跨0度时的反向大旋转问题
//      */
//     private lerpAngleShortest(fromDeg: number, toDeg: number, t: number): number {
//         const from = this.normalizeAngleDeg(fromDeg);
//         const to = this.normalizeAngleDeg(toDeg);
//         const delta = this.normalizeAngleSignedDeg(to - from); // (-180, 180]
//         return this.normalizeAngleDeg(from + delta * t);
//     }

//     /** 归一化到 [0, 360) */
//     private normalizeAngleDeg(deg: number): number {
//         let a = deg % 360;
//         if (a < 0) a += 360;
//         return a;
//     }

//     /** 归一化到 (-180, 180] */
//     private normalizeAngleSignedDeg(deg: number): number {
//         let a = deg % 360;
//         if (a <= -180) a += 360;
//         if (a > 180) a -= 360;
//         return a;
//     }
//     /** 获取指定pathId的路径点Node数组（便于后续扩展多条路径） */
//     private getPathNodes(pathId: number): Node[] {
//         // 目前项目里只暴露了ConveyorPath1，这里先保持与现有逻辑一致
//         // 后续若新增 ConveyorPath2/3，只需要在此处扩展映射即可
//         return this.ConveyorPath1;
//     }
//     /**获取路径源容器 */
//     private getPathSourceContainer(pathId: number): ItemContainer {
//         const nodes = GameInfo.instance.buildingMgr.waterStackNode;
//         return nodes;
//     }
//     /**
//      * 更新路径点缓存 - 当路径点位置发生变化时调用
//      * @param pathId 路径ID，不传则更新所有路径
//      */
//     public updatePathPointsCache(pathId?: number): void {
//         if (pathId !== undefined) {
//             this.pathWorldPointsCache.delete(pathId);
//             this.getPathWorldPointsCached(pathId);
//             this.pathLocalAnglePointsCache.delete(pathId);
//             this.getPathLocalAnglePointsCached(pathId);
//             // 同时清除段长度缓存
//             this.clearPathLengthCache(pathId);
//         } else {
//             this.pathWorldPointsCache.clear();
//             this.pathLocalAnglePointsCache.clear();
//             this.clearPathLengthCache();
//             this.precacheAllPathPoints();
//         }
//     }
// }


