// import { _decorator, Node, v3, Vec3 } from 'cc';
// import { CharacterBase } from './CharacterBase';
// import { AttackInfo, AttackType, DamageSource, GameInfo } from '../Common/GameInfo';
// import { CharacterStatus } from '../Common/CommonEnum';
// import { ItemContainer } from '../Common/ItemContainer';
// import { MathUtil } from '../Extra/MathUtil';
// const { ccclass, property } = _decorator;

// @ccclass('RoleHeroAlly')
// export class RoleHeroAlly extends CharacterBase {
//     @property({ type: Node, displayName: '背包节点' })
//     public backpack: Node = null;
//     private originBackpackPos: Vec3 = v3(0, 0, 0);
//     @property({ type: Node, displayName: '射击节点' })
//     private shootNode: Node = null!;
//     // @property({ type: Node, displayName: '射击粒子节点' })
//     // shootEffectNode: Node = null;
//     // shootEffectList: ParticleSystem[] = [];
//     private skillTarget: CharacterBase | null = null;
//     private skillAniName: string = "";
//     private runAttackAnimName: string = "";
//     public weaponLv: number = 0;
//     /**索引，用于访问所属活动中心点位置 */
//     private _bIndex: number = -1;
//     public meatContainer: ItemContainer = null!;
//     public meatCount: number = 0;
//     private ideTimer: number = 0;
//     /**更新目标检查间隔 */
//     private updateInterval: number = 2;
//     onLoad(): void {
//         super.onLoad();
//         this.meatContainer = this.backpack.getChildByName("meat").getComponent(ItemContainer);
//         this.originBackpackPos = this.backpack.position.clone();
//     }
//     /**
//      * 初始化角色基础数据
//      * @param lv 初始等级
//      */
//     initBaseData(lv: number = 0, bIndex: number = -1): void {
//         this.weaponLv = lv > 0 ? lv : 0;
//         this._bIndex = bIndex > -1 ? bIndex : -1;
//         super.initData();
//         this.weaponLv = 0;
//         // let prat = this.shootEffectNode.getComponent<ParticleSystem>(ParticleSystem);
//         // this.shootEffectList.push(prat)
//         // let count = this.shootEffectNode.children.length;
//         // for (let i = 0; i < count; i++) {
//         //     let prat = this.shootEffectNode.children[i].getComponent<ParticleSystem>(ParticleSystem);
//         //     this.shootEffectList.push(prat)
//         // }
//         this.scheduleOnce(() => {
//             //延迟执行, 以免技能组件未初始化完成
//             this.battleValComp.setUnlockSkill(true)
//             this.battleValComp.setSkillCoolDown();
//         }, 2);
//     }
//     getHeroBuildIndex(){
//         return this._bIndex;
//     }
//     update(dt: number) {
//         super.update(dt);
//         if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin || this.isDead) return;
//         this.ideTimer += dt;
//         if (this.ideTimer >= this.updateInterval) {
//             this.ideTimer = 0;
//             this.updateIdle();
//         }
//         // 更新技能目标（视野范围内的最近目标）
//         this.updateSkillTarget();

//         if (this.skillTarget) {
//             this.onCastSkill();
//         }
//         if (this.atkTarget) {
//             this.attack();
//         } else {
//             this.stopAttack();
//         }
//     }
//     updateIdle() {
//         //如果处于待机状态则进行闲逛, 其他所有行为都会优先于闲逛
//         if (this.statusComp.currentState === CharacterStatus.Idle ||
//             this.statusComp.currentState === CharacterStatus.Move) {
//             this.goToIdlePosition()
//         }
//     }
//     /**闲逛 */
//     private goToIdlePosition(): void {
//         let center = GameInfo.instance.buildingMgr.heroActivityCenterNode[this._bIndex]
//         const idlePos = MathUtil.getRandomPositionAroundTarget(center.worldPosition.clone(), GameInfo.instance.buildingMgr.heroActivityRadius, 10);
//         const posA = this.node.worldPosition;
//         const dx = posA.x - idlePos.x;
//         const dy = posA.y - idlePos.y;
//         const distanceSq = dx * dx + dy * dy;

//         // 如果不在原点附近，移动到原点
//         if (distanceSq > 10) {
//             this.moveToWorldPosition(idlePos);
//         }

//     }
//     /**获取所有敌人 */
//     protected getPotentialTargets(): CharacterBase[] {
//         const characters: CharacterBase[] = [];
//         const monsterList = GameInfo.instance.monsterMgr.monsterList;
//         const eliteMonsterList = GameInfo.instance.monsterMgr.eliteMonsterList;

//         for (const m of monsterList) {
//             const character = m.getComponent(CharacterBase);
//             if (character) characters.push(character);
//         }
//         for (const n of eliteMonsterList) {
//             const character = n.getComponent(CharacterBase);
//             if (character) characters.push(character);
//         }
//         return characters;
//     }
//     /**
//      * 是否应该更新目标（怪物在攻击状态时不更新目标）
//      */
//     protected shouldUpdateTarget(): boolean {
//         // // 怪物在攻击状态时不更新目标，专注当前目标
//         // if (this.statusComp.currentState === CharacterStatus.Attack) {
//         //     return false;
//         // }
//         return true;
//     }
//     /**
//      * 更新技能目标（视野范围内的最近目标）
//      */
//     private updateSkillTarget(): void {
//         const potentialTargets = this.getPotentialTargets();
//         let minDistanceSq = Infinity;
//         const visionRangeSq = this.getTargetSearchRange();

//         this.skillTarget = null;
//         for (const target of potentialTargets) {
//             if (target.isDead) continue;
//             if (!target.isValid) continue;
//             const distanceSq = this.getSquaredDistanceTo(target.node);
//             if (distanceSq < minDistanceSq && distanceSq < visionRangeSq) {
//                 minDistanceSq = distanceSq;
//                 this.skillTarget = target;
//             }
//         }
//     }
//     // /** 此项目不需要跟随主角移动 */
//     // private followHero() {
//     //     const followNode = GameInfo.instance.player.followPos[this.siteIndex];
//     //     if (!followNode) return;
//     //     const dist = this.getSquaredDistanceTo(this.node, followNode);
//     //     //以防被卡住, 优化检测, 距离过远直接瞬移到主角旁边
//     //     if (dist > 40) {
//     //         this.node.setWorldPosition(followNode.worldPosition);
//     //         this.stopMove();
//     //         return;
//     //     }
//     //     const rayLen = 0.25; // 检测距离，可根据怪物体型调整
//     //     const from = this.node.worldPosition.clone();
//     //     const to = followNode.worldPosition.clone();
//     //     const direction = v3();
//     //     Vec3.subtract(direction, to, from);
//     //     Vec3.normalize(direction, direction);
//     //     const ray = new geometry.Ray(from.x, from.y, from.z, direction.x, 0, direction.z);
//     //     const mask = 18;
//     //     const bResult = PhysicsSystem.instance.raycastClosest(ray, mask);
//     //     if (bResult) {
//     //         const results = PhysicsSystem.instance.raycastClosestResult;
//     //         if (results.collider && results.distance < rayLen) {
//     //             const _t = results.collider.node.getComponent(ColliderTag);
//     //             // 可以根据需要过滤掉自身
//     //             if (_t && _t.tag == ColliderGroupTag.Build) {
//     //                 this.stopMove();
//     //                 return;
//     //             }
//     //         }
//     //     }
//     //     if (dist > this.followDistance * this.followDistance) {
//     //         this.moveToWorldPosition(followNode.worldPosition);
//     //     } else {
//     //         this.stopMove();
//     //     }
//     // }
//     handleRangedAttack(wps: Vec3, attackInfo: AttackInfo) {
//         const shootWorldPos = this.shootNode.worldPosition.clone();
//         super.handleRangedAttack(shootWorldPos, attackInfo);
//     }
//     protected onLoopAnimationComplete() {
//         super.onLoopAnimationComplete();
//     }

//     protected castSkillEffect(): void {
//         let targetPos = v3();
//         let direction = v3();
//         if (!this.skillTarget || this.skillTarget.isDead) {
//             targetPos = this.node.worldPosition;
//             targetPos.y += 100;
//             direction = v3(1, 0, 0);
//             // console.error("无目标时技能位置", targetPos);

//         } else {
//             // if (!this.skillTarget.node.isValid) {
//             //     targetPos = this.node.worldPosition;
//             //     direction = v3(1, 0, 0);
//             //     console.error("有目标, 但已被回收");
//             // } 
//             targetPos = this.skillTarget.ModelNode.worldPosition;
//             Vec3.subtract(direction, targetPos, this.node.worldPosition);
//             Vec3.normalize(direction, direction);
//             // console.error("有目标时技能位置", targetPos);
//         }
//         const damageSource: DamageSource = {
//             fromCharacterTag: this.CharacterTag,
//             attackType: AttackType.Skill,
//             node: this.node,
//             uuid: this.node.uuid,
//             level: this.battleValComp.level,
//         };
//         this.skillComp.castSkill(targetPos, damageSource, direction);
//     }
// }


