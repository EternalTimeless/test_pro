// import { _decorator, CCFloat, Collider, Component, easing, ITriggerEvent, Node, Quat, quat, Tween, tween, v3, Vec3 } from 'cc';
// import { ColliderGroupTag, PrefabPathEnum } from '../Common/CommonEnum';
// import { GameInfo } from '../Common/GameInfo';
// import { ColliderTag } from './ColliderTag';
// import { RolePeople } from '../Battle/RolePeople';
// import FlyManager from '../Manager/FlyManager';

// const { ccclass, property } = _decorator;

// /** LineEnd 局部约 (0, 0, 1.05) 时，scale.x=1 对应的世界长度单位 */
// const LINE_END_UNIT_WORLD = 1.05;

// /**
//  * 鱼钩检测 + 鱼线/鱼钩表现：出线结束在组件内开检测；准星中鱼反馈在本组件；结果只通过 player.handleFishingHookOutcome 回传。
//  */
// @ccclass('FishingHook')
// export class FishingHook extends Component {
//     @property({ type: Node, displayName: '根节点' })
//     Root: Node = null;
//     @property({ type: Node, displayName: '鱼线(动画节点)' })
//     fishingLine: Node = null;
//     @property({ type: Node, displayName: '鱼线末端' })
//     fishingLineEnd: Node = null;
//     @property({ type: Node, displayName: '鱼钩节点' })
//     fishingHook: Node = null;

//     hookCollider: Collider = null!;

//     @property({ type: ColliderGroupTag, displayName: '视为可中鱼的标签' })
//     detectTag: ColliderGroupTag = ColliderGroupTag.People;

//     @property({ type: CCFloat, displayName: '检测窗口时长(秒)', tooltip: '激活后经过此时长结束并通知' })
//     defaultDetectDuration: number = 0.1;

//     lineExtendDuration: number = 0.2;
//     lineReelDuration: number = 0.2;

//     private _perCatchCount: number = 1;

//     private _sessionActive: boolean = false;
//     private readonly _seenOtherUuids: Set<string> = new Set();
//     private readonly _seenOtherNodes: Node[] = [];
//     /** people 回收后在同位置生成的 COIN_EGG，收线阶段 ItemFlyToStack */
//     private readonly _spawnedEggNodes: Node[] = [];
//     /** 收线阶段是否已触发 egg 飞行 */
//     private _reelFlyTriggered: boolean = false;
//     private readonly _enableColliderBound = this._enableColliderAfterDelay.bind(this);
//     private readonly _endWindowBound = this._endDetectionWindow.bind(this);
//     private readonly _gatherTargetPos = v3();

//     protected onLoad(): void {
//         if (!this.fishingHook?.isValid) {
//             return;
//         }
//         this.hookCollider = this.fishingHook.getComponent(Collider);
//         if (this.hookCollider) {
//             this.hookCollider.enabled = false;
//             this.hookCollider.on('onTriggerEnter', this._onTriggerEnter, this);
//         }
//         this.Root.active = false;
//     }

//     /**
//      * 根据挂点当前世界朝向 + Root 本地鱼线伸长轴，将 Root 设为世界欧拉角(World Euler)，使出线路径对准 castDirWorld。
//      * 比直接拼 yaw/pitch 更可靠：保留骨骼赋予的基准旋转(YZ)，只叠加最短弧线对准。
//      */
//     private _orientRootTowardCastDir(root: Node, castDirWorld: Readonly<Vec3>): void {
//         //Root 本地空间中鱼线伸长方向(需单位化含义; Prefab 中为 +X 时保持默认)
//         const axis = v3(1, 0, 0);
//         const ax = new Vec3(axis.x, axis.y, axis.z);
//         if (ax.lengthSqr() < 1e-10) {
//             ax.set(1, 0, 0);
//         } else {
//             Vec3.normalize(ax, ax);
//         }
//         const qRest = quat();
//         root.getWorldRotation(qRest);
//         const rWorld = v3();
//         Vec3.transformQuat(rWorld, ax, qRest);
//         Vec3.normalize(rWorld, rWorld);

//         const qDelta = quat();
//         Quat.rotationTo(qDelta, rWorld, castDirWorld);
//         const qFinal = quat();
//         Quat.multiply(qFinal, qDelta, qRest);

//         const euler = v3();
//         Quat.toEuler(euler, qFinal);
//         root.setWorldRotationFromEuler(euler.x, euler.y, euler.z);
//     }

//     /** 鱼钩更新  LineEnd世界坐标 */
//     private _updateHookPos(): void {
//         if (!this.fishingHook?.isValid || !this.fishingLineEnd?.isValid) {
//             return;
//         }
//         const w = this.fishingLineEnd.worldPosition;
//         this.fishingHook.setWorldPosition(w.x, w.y, w.z);
//     }

//     /** 配置鱼线伸长和收回时长 */
//     public initData(extendSec: number, reelSec: number): void {
//         this.lineExtendDuration = Math.max(0.01, extendSec);
//         this.lineReelDuration = Math.max(0.01, reelSec);
//     }
//     /**
//      * 出线：起点/俯仰/scale.y 与抛竿一致；动画结束的 call 内开启鱼钩检测，结果通过 player.handleFishingHookOutcome 回传（成功时先播准星缩放再通知）。
//      */
//     public playLineCast(worldStart: Readonly<Vec3>, worldAim: Readonly<Vec3>): void {
//         this._reelFlyTriggered = false;
//         this._clearSpawnedEggs();
//         this.Root.active = true;
//         this.stopLineVisualTweens();
//         const root = this.Root;
//         const line = this.fishingLine;
//         if (!line?.isValid || !this.fishingLineEnd?.isValid) {
//             this.scheduleOnce(() => GameInfo.instance.player?.handleFishingHookOutcome(false, 0), 0);
//             return;
//         }

//         const sx0 = worldStart.x;
//         const dx = worldAim.x - sx0;
//         const dy = worldAim.y - worldStart.y;
//         const dz = worldAim.z - worldStart.z;
//         const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
//         if (distance < 1e-3) {
//             this.scheduleOnce(() => GameInfo.instance.player?.handleFishingHookOutcome(false, 0), 0);
//             return;
//         }
//         root.setWorldPosition(worldStart);

//         const castDir = v3(dx / distance, dy / distance, dz / distance);
//         this._orientRootTowardCastDir(root, castDir);

//         const targetX = Math.floor((distance / LINE_END_UNIT_WORLD) * 100) / 100;

//         const sy = line.scale.y;
//         const sz = line.scale.z;
//         line.setScale(v3(0, sy, sz));
//         this._updateHookPos();
//         this.fishingHook.active = true;
//         tween(line)
//             .to(this.lineExtendDuration, { scale: v3(targetX, sy, sz) }, {
//                 easing: easing.sineOut,
//                 onUpdate: () => this._updateHookPos(),
//             })
//             .call(() => {
//                 this._updateHookPos();
//                 this._startDetection();
//             })
//             .start();
//     }

//     /** 开启碰撞检测窗口 */
//     private _startDetection(durationSec?: number): void {
//         if (!this.hookCollider) {
//             GameInfo.instance.player?.handleFishingHookOutcome(false, 0);
//             return;
//         }
//         this.cancelDetection();
//         const duration = durationSec ?? this.defaultDetectDuration;
//         if (duration <= 0) {
//             //NOTE: 可改为回调，去掉对 GameInfo.instance.player 的依赖
//             GameInfo.instance.player?.handleFishingHookOutcome(false, 0);
//             return;
//         }
//         this._sessionActive = true;
//         this._seenOtherUuids.clear();
//         this._seenOtherNodes.length = 0;
//         this.hookCollider.enabled = false;
//         this.scheduleOnce(this._enableColliderBound, 0);
//         this.scheduleOnce(this._endWindowBound, duration);
//     }

//     /** 鱼线收回 */
//     public playLineReel(onReelComplete?: () => void): void {
//         this.stopLineVisualTweens();
//         GameInfo.instance.trackMgr?.playWaterEffect();
//         const line = this.fishingLine;
//         if (!line?.isValid) {
//             onReelComplete?.();
//             return;
//         }
//         const sy = line.scale.y;
//         const sz = line.scale.z;
//         this.scheduleOnce(() => {
//             this._reelFlyTriggered = true;
//             this._flyAllEggsToStack();
//         }, this.lineReelDuration * 0.5);
//         tween(line)
//             .to(this.lineReelDuration, { scale: v3(0, sy, sz) }, {
//                 easing: easing.sineIn,
//                 onUpdate: () => this._updateHookPos(),
//             })
//             .call(() => {
//                 this._updateHookPos();
//                 this.Root.active = false;
//                 onReelComplete?.();
//             })
//             .start();
//     }

//     public stopLineVisualTweens(): void {
//         if (this.fishingLine?.isValid) {
//             Tween.stopAllByTarget(this.fishingLine);
//         }
//     }

//     public setPerCatchCount(count: number): void {
//         this._perCatchCount = Math.max(1, Math.floor(count));
//     }

//     public getCatchOnceCount(): number {
//         return this._perCatchCount;
//     }

//     /** 取消检测 */
//     public cancelDetection(): void {
//         this.unschedule(this._enableColliderBound);
//         this.unschedule(this._endWindowBound);
//         if (this.hookCollider?.isValid) {
//             this.hookCollider.enabled = false;
//         }
//         this._sessionActive = false;
//         this._seenOtherUuids.clear();
//     }

//     private _clearSpawnedEggs(): void {
//         for (const egg of this._spawnedEggNodes) {
//             if (egg?.isValid) {
//                 GameInfo.instance.prefabMgr.recoverPrefab(egg);
//             }
//         }
//         this._spawnedEggNodes.length = 0;
//     }

//     /** 延迟开启碰撞检测 */
//     private _enableColliderAfterDelay(): void {
//         if (!this._sessionActive || !this.hookCollider?.isValid) return;
//         this.hookCollider.enabled = true;
//     }
//     /** 检测窗口结束 */
//     private _endDetectionWindow(): void {
//         if (!this._sessionActive) return;
//         this._complete(this._seenOtherUuids.size >= this._perCatchCount);
//     }

//     private _complete(success: boolean): void {
//         if (!this._sessionActive) return;
//         this.unschedule(this._enableColliderBound);
//         this.unschedule(this._endWindowBound);
//         this._sessionActive = false;
//         if (this.hookCollider?.isValid) {
//             this.hookCollider.enabled = false;
//         }
//         const count = this._seenOtherUuids.size;
//         if (success) {
//             this._playCatchSuccessFeedback(count);
//         } else {
//             GameInfo.instance.player?.handleFishingHookOutcome(false, count);
//         }
//     }

//     /** 抓取表现：鱼移向准心，与准心缩放反馈并行 */
//     private _playCatchSuccessFeedback(count: number): void {
//         this._gatherCatchNodesToIndicator(this._seenOtherNodes);
//         GameInfo.instance.trackMgr?.playIndicatorAnim(() => {
//             //NOTE: 可改为回调，去掉对 GameInfo.instance.player 的依赖
//             GameInfo.instance.player?.handleFishingHookOutcome(true, count);
//         });
//     }

//     /** 将命中目标 tween 到准心世界坐标（保留各自 Y） */
//     private _gatherCatchNodesToIndicator(nodes: readonly Node[]): void {
//         const indicator = GameInfo.instance.trackMgr?.indicator;
//         if (!indicator?.isValid) {
//             return;
//         }
//         indicator.getWorldPosition(this._gatherTargetPos);
//         for (const catchNode of nodes) {
//             if (!catchNode?.isValid) {
//                 continue;
//             }
//             const target = this._gatherTargetPos.clone();
//             target.y = catchNode.worldPosition.y;
//             Tween.stopAllByTarget(catchNode);
//             tween(catchNode)
//                 .to(0.3, { worldPosition: target }, { easing: easing.smooth })
//                 .call(() => {
//                     this._recyclePeopleAndSpawnEgg(catchNode);
//                 })
//                 .start();
//         }
//     }

//     /** people tween 结束后回收，并在同位置生成 COIN_EGG */
//     private _recyclePeopleAndSpawnEgg(peopleNode: Node): void {
//         if (!peopleNode?.isValid) return;

//         const parent = peopleNode.parent;
//         const localPos = peopleNode.position.clone();
//         Tween.stopAllByTarget(peopleNode);

//         const people = peopleNode.getComponent(RolePeople);
//         if (people) {
//             GameInfo.instance.buildingMgr.removePeople(people);
//         }

//         GameInfo.instance.prefabMgr.recoverPrefab(peopleNode);

//         const egg = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.COIN_EGG);
//         if (!egg?.isValid || !parent?.isValid) return;

//         egg.setParent(parent);
//         egg.setPosition(localPos);
//         this._spawnedEggNodes.push(egg);

//         // 收线飞行已触发时，晚生成的 egg 立即补飞
//         if (this._reelFlyTriggered) {
//             const idx = this._spawnedEggNodes.indexOf(egg);
//             if (idx >= 0) {
//                 this._spawnedEggNodes.splice(idx, 1);
//             }
//             this._flyEggToStack(egg);
//         }
//     }

//     private _flyAllEggsToStack(): void {
//         const eggs = [...this._spawnedEggNodes];
//         this._spawnedEggNodes.length = 0;
//         eggs.forEach(egg => this._flyEggToStack(egg));
//     }

//     private _flyEggToStack(egg: Node): void {
//         if (!egg?.isValid) return;

//         Tween.stopAllByTarget(egg);
//         egg.setParent(GameInfo.instance.gameMgr.gameLayer);
//         this.ItemFlyToStack(egg, 1, 2);
//     }

//     private _onTriggerEnter(event: ITriggerEvent): void {
//         if (!this._sessionActive) return;
//         const other = event.otherCollider;
//         if (!other?.node?.isValid) return;
//         const tagComp = other.node.getComponent(ColliderTag);
//         if (!tagComp || tagComp.tag !== this.detectTag) return;
//         const id = other.node.uuid;
//         if (this._seenOtherUuids.has(id)) return;
//         this._seenOtherNodes.push(other.node);
//         const people = other.node.getComponent(RolePeople);
//         if (people) {
//             people.setFreeze(true);
//         }
//         this._seenOtherUuids.add(id);
//         if (this._seenOtherUuids.size >= this._perCatchCount) {
//             this._complete(true);
//         }
//     }



//     ItemFlyToStack(egg: Node, jumpHeight: number, jumpSpeed: number) {
//         const localPos = GameInfo.instance.buildingMgr?.fishingStack.preprocessData();
//         FlyManager.Ins.createFly(egg, GameInfo.instance.buildingMgr?.fishingStack.root, localPos, jumpHeight, () => {
//             if (egg) {
//                 GameInfo.instance.buildingMgr?.fishingStack.addItem(egg);
//                 if (GameInfo.step == 5 && GameInfo.instance.buildingMgr?.fishingStack.getItemCount() > 1) {
//                     GameInfo.instance.guideMgr.onGuideStep();
//                 }
//             }
//         }, jumpSpeed, 0, v3(0, 0, 0), false, v3(1, 1, 1));
//     }

// }
