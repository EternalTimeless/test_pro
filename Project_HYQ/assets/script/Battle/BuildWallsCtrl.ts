// import { _decorator, CCBoolean, CCFloat, Collider, Node, Vec3, v3 } from 'cc';
// import { CharacterBase } from './CharacterBase';
// import { DamageSource } from '../Common/GameInfo';
// import { BuildRepairComponent } from './BuildRepairComponent';

// const { ccclass, property } = _decorator;
// /**组合式墙体 */
// @ccclass('BuildWallsCtrl')
// export class BuildWallsCtrl extends CharacterBase {
//     @property({ type: [Node], displayName: '墙体列表' })
//     public walls: Node[] = [];//多段墙体模型拼接而成, 用于怪物攻击朝向, 闪红组件使用
//     @property({ type: CCFloat, displayName: '下降高度' })
//     private downHeight: number = 2;
//     private originalY: number = 0;
//     private _collider: Collider = null!;

//     /** 修复组件引用 */
//     private repairComp: BuildRepairComponent = null;

//     // 标记是否需要更新模型状态
//     private _needUpdateModel: boolean = false;

//     // ========== 组件化重构：以下方法已迁移到 BuildRepairComponent ==========
//     // 保留委托接口，保持向后兼容

//     /**
//      * 是否需要开始修复（委托给 BuildRepairComponent）
//      */
//     public get isNeedFix(): boolean {
//         return this.repairComp?.isNeedFix ?? false;
//     }

//     /**
//      * 是否正在被工人修复中（委托给 BuildRepairComponent）
//      */
//     public get isBeingRepaired(): boolean {
//         return this.repairComp?.isBeingRepaired ?? false;
//     }

//     /**
//      * 是否应该继续投放材料（委托给 BuildRepairComponent）
//      */
//     public shouldContinueRepair(): boolean {
//         return this.repairComp?.shouldContinueRepair() ?? false;
//     }
//     public get fixTriggerNode(): Node {
//         return this.repairComp?.fixTriggerNode ?? null;
//     }
//     onDeadEnter(): void {
//     }
//     onLoad(): void {
//         super.onLoad();
//         this._collider = this.node.getComponent(Collider);
//         this._collider.enabled = false;
//         // 获取修复组件（如果挂载了）
//         this.repairComp = this.getComponent(BuildRepairComponent);
//         this.originalY = this.ModelNode.y;
//     }
//     protected onEnable(): void {
//         //每次激活组件所在节点, 可以反复触发此方法, 用于复活初始化，不能在同一帧反复执行
//         super.initData();

//         // 如果挂载了修复组件且启用了修复功能，初始化血量为0（死亡状态）
//         // 使用 isRepairEnabled 而不是 isNeedFix，避免依赖运行时状态
//         // if (this.repairComp && this.repairComp.isRepairEnabled) {
//         //     this.battleValComp!.currentHealth = 0;
//         // }

//         // this._needUpdateModel = true; // 激活时不需要更新一次模型状态
//         // console.log(this.node.uuid, ": BuildWallCtrl onEnable");
//     }
//     protected onDisable(): void {
//         // console.log(this.node.uuid, ": BuildWallCtrl onDisable");
//     }
//     update(dt: number): void {
//         super.update(dt);
//     }

//     lateUpdate(dt: number): void {
//         // 在每帧的最后统一更新模型状态，避免同一帧内多次调用导致的问题
//         // if (this._needUpdateModel) {
//         //     this._needUpdateModel = false;
//         //     this.updateBuild();
//         // }
//     }
//     updateBuild() {
//         if (this.battleValComp) {
//             // let v = this.battleValComp.healthPercentage > 0;
//             //血量清空时隐藏模型和碰撞
//             // this.ModelNode.active = v;
//             // if (this._collider) {
//             //     this._collider.enabled = v;
//             // }

//             // 委托修复组件更新触发节点
//             // this.repairComp?.updateTriggerNode();

//             // 更新墙体部位显示状态（根据血量百分比）
//             // this.updateWallSegments();

//             // 可修复墙体特有表现：血量越低，模型Y的高度越低（最大高度=this.originalY，最小高度=this.originalY-this.downHeight）
//             // if (this.repairComp) {
//             //     let diff = this.originalY - this.downHeight;
//             //     let y = Math.min(this.originalY, Math.max(diff, (1 - this.battleValComp.healthPercentage) * diff));
//             //     this.ModelNode.setPosition(this.ModelNode.position.x, y, this.ModelNode.position.z);
//             // }
//         }
//     }

//     // /** 
//     //  * 根据血量百分比更新墙体部位显示状态 用于多个可破坏的组合墙体
//     //  * 按 walls 数组顺序，根据血量百分比显示/隐藏对应索引的模型
//     //  */
//     // private updateWallSegments(): void {
//     //     if (!this.battleValComp || this.walls.length === 0) return;

//     //     const healthPercentage = this.battleValComp.healthPercentage;
//     //     // 计算应该显示的节点数量（向上取整，至少显示1个）
//     //     const visibleCount = Math.max(1, Math.ceil(this.walls.length * healthPercentage));

//     //     // 按索引顺序更新显示状态
//     //     for (let i = 0; i < this.walls.length; i++) {
//     //         if (this.walls[i]) {
//     //             // 前 visibleCount 个节点显示，后面的隐藏
//     //             this.walls[i].active = i < visibleCount;
//     //         }
//     //     }
//     // }

//     public onHurt(damage: number, damageSource?: DamageSource): boolean {
//         if (this.battleValComp) {
//             this.lastDamageSource = damageSource;
//             let v = this.battleValComp.takeDamage(damage);
//             if (this.visualFeedbackComp) {
//                 // 如果有攻击者节点信息，计算最近的 wall 节点并触发对应特效
//                 if (damageSource?.sonNodeIndex && this.walls.length > 0) {
//                     const nearestIndex = damageSource.sonNodeIndex ?? -1;
//                     if (nearestIndex >= 0) {
//                         this.visualFeedbackComp.showDamageEffectByIndex(nearestIndex);
//                     } else {
//                         // 索引无效，回退到默认行为
//                         this.visualFeedbackComp.showDamageEffect();
//                     }
//                 } else {
//                     // 没有攻击者节点信息，使用默认行为
//                     this.visualFeedbackComp.showDamageEffect();
//                 }
//             }
//             // 标记需要更新模型，而不是立即调用showModel，避免同一帧多次更新
//             // this._needUpdateModel = true;
//             return v;
//         }
//         return false;
//     }


//     // ========== 未来扩展思路：追踪攻击时的 wall 节点选择机制（情况2）==========
//     // 
//     // 当怪物直接追踪墙体时，需要选择具体的 wall 节点，此时可能需要以下扩展：
//     //
//     // 1. 节点占用机制：
//     //    - reserveWallNode(node: Node, attackerId: string): boolean
//     //      预留节点，防止多怪物攻击同一节点。返回是否成功预留。
//     //    - releaseWallNode(node: Node, attackerId: string): void
//     //      释放节点占用，当怪物死亡或切换目标时调用。
//     //    - getAvailableWallNodes(): Node[]
//     //      获取所有可用（未被占用）的节点列表。
//     //
//     // 2. 节点选择逻辑：
//     //    - 当怪物追踪墙体时，先查询最近的 BuildWallCtrl
//     //    - 然后在该 BuildWallCtrl 的 walls 数组中查找最近的可用节点
//     //    - 如果最近的节点已被占用（达到上限，如3个怪物），则查找相邻索引的节点
//     //    - 默认相邻索引的模型节点在空间上也相邻
//     //
//     // 3. 追踪逻辑修改：
//     //    - 在 EnemyCharacter.getPotentialTargets() 或 updateNearestTarget() 中
//     //      当目标是 BuildWallCtrl 时，需要调用 BuildWallCtrl.getNearestWallNode()
//     //      获取具体的 wall 节点作为移动目标
//     //    - 攻击时也需要确保攻击的是预留的节点
//     //
//     // 4. 注意事项：
//     //    - 可能需要配合流畅寻路或 A* 算法来规避多怪物路径冲突问题
//     //    - 节点占用上限需要根据游戏平衡性调整
//     //    - 需要考虑怪物死亡、切换目标等情况下的节点释放
//     //
//     // 当前实现仅支持情况1（强制攻击），情况2的扩展待未来需要时再实现。
//     // ============================================================================
//     /**
//      * 建筑修复（委托给 BuildRepairComponent）
//      */
//     public buildFix(num: number): boolean {
//         const result = this.repairComp?.repair(num) ?? false;
//         // 标记需要更新模型
//         this._needUpdateModel = true;
//         return result;
//     }

//     // ========== 旧代码（已注释）==========
//     // public buildFix(num: number): boolean {
//     //     if (this.battleValComp) {
//     //         let v: boolean = false
//     //         let healNum = num * this.healPercentPerMaterial;
//     //         if (this.battleValComp.isDead) {
//     //             this.battleValComp.reviveByPercent(healNum);
//     //             v = true;
//     //         } else {
//     //             v = this.battleValComp.heal(healNum, true);
//     //         }
//     //         this._needUpdateModel = true;
//     //         return v;
//     //     }
//     //     return false;
//     // }
//     protected getPotentialTargets(): CharacterBase[] {
//         return [];
//     }
//     protected getSkillAniName(): string {
//         return '';
//     }
//     protected castSkillEffect() { }

//     // ========== 修复状态管理（委托给 BuildRepairComponent）==========

//     /** 开始修复（委托给 BuildRepairComponent）*/
//     public startRepair(): void {
//         this.repairComp?.startRepair();
//     }

//     /** 完成修复（委托给 BuildRepairComponent）*/
//     public finishRepair(): void {
//         this.repairComp?.finishRepair();
//     }

//     /** 预留材料（委托给 BuildRepairComponent）*/
//     public reserveMaterial(count: number = 1): void {
//         this.repairComp?.reserveMaterial(count);
//     }

//     /** 消耗预留（委托给 BuildRepairComponent）*/
//     public consumeReservedMaterial(count: number = 1): void {
//         this.repairComp?.consumeReservedMaterial(count);
//     }

//     /** 清空预留（委托给 BuildRepairComponent）*/
//     public clearReservedMaterials(): void {
//         this.repairComp?.clearReservedMaterials();
//     }

//     // ========== 旧代码（已注释）==========
//     // public startRepair(): void {
//     //     this.isBeingRepaired = true;
//     // }
//     // public finishRepair(): void {
//     //     this.isBeingRepaired = false;
//     //     this.clearReservedMaterials();
//     // }
//     // public reserveMaterial(count: number = 1): void {
//     //     this.reservedMaterialCount += count;
//     // }
//     // public consumeReservedMaterial(count: number = 1): void {
//     //     this.reservedMaterialCount = Math.max(0, this.reservedMaterialCount - count);
//     // }
//     // public clearReservedMaterials(): void {
//     //     this.reservedMaterialCount = 0;
//     // }
// }


