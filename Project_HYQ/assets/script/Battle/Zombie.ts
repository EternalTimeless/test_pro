import { _decorator, Node, Component, v3, Vec3 } from 'cc';
import { GameInfo } from '../Common/GameInfo';
import { CharacterBase } from './CharacterBase';
import { CharacterStatus, CharacterTag } from '../Common/CommonEnum';

const { ccclass, property } = _decorator;
/**当做装饰物 闲逛的僵尸, 不参与战斗 */
@ccclass('Zombie')
export class Zombie extends CharacterBase {
    @property
    private wander: boolean = false;
    zombieTrackingTimer: number = 0;
    /**配置的路径节点（完整路径） */
    private pathNodes: Node[] = [];
    /**当前移动的临时路径队列 */
    private currentPathQueue: Node[] = [];
    private currentPathIndex: number = 0;
    private curDirection: number = 0;
    onLoad(): void {
        super.onLoad();
        //匹配视觉上的移动速度
        this._moveTimeScale = 0.75;
    }
    /**
     * 
     * @param pathContainer 路径节点容器（子节点按顺序为路径点）
     */
    configureSpawn(pathContainer: Node) {
        for (let i = 0; i < pathContainer.children.length; i++) {
            this.pathNodes.push(pathContainer.children[i]);
            this.counts.push(0);
            this.lastRandomResult = -1;
        }
    }
    protected onEnable(): void {
        super.initData();
        this.zombieTrackingTimer = 2;
    }
    protected onDisable(): void {
    }
    update(dt: number): void {
        super.update(dt); // 基类已处理 atkTarget 更新
        if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin || this.isDead) return;


        this.zombieTrackingTimer += dt;
        if (this.zombieTrackingTimer >= this.attackComp.trackingUpdateInterval) {
            // 怪物特有逻辑：追踪目标
            this.trackToTarget();
        }

    }
    /**获取所有敌人 */
    protected getPotentialTargets(): CharacterBase[] {
        // 否则返回所有敌人
        const targets: CharacterBase[] = [];
        const mgr = GameInfo.instance.buildingMgr;
        if (!mgr || !mgr.wallList) return targets;
        for (const wall of mgr.wallList) {
            const character = wall.getComponent(CharacterBase);
            if (!character) continue;
            if (character.isDead) continue;
            targets.push(character);
        }
        return targets;
    }
    /**
     * 是否应该更新目标（怪物在攻击状态时不更新目标）
     */
    protected shouldUpdateTarget(): boolean {
        // 怪物在攻击状态时不更新目标，专注当前目标
        if (this.statusComp.currentState === CharacterStatus.Attack) {
            return false;
        }
        return true;
    }
    /**
    * 追踪到目标位置（整合了距离判断）
*/
    trackToTarget() {
        this.zombieTrackingTimer = 0;
        // 攻击中不在此处追目标/点位移动;
        if (this.statusComp?.currentState === CharacterStatus.Attack || this.statusComp?.currentState === CharacterStatus.Move) {
            return;
        }
        if (this.CharacterTag == CharacterTag.ZombieA) {
            if (!this.atkTarget || this.atkTarget.isDead) {
                this.clearTarget();
                return;
            }

            const distanceSq = this.getSquaredDistanceTo(this.atkTarget.node);
            const visionRangeSq = this.getTargetSearchRange();

            // 如果目标超出视野范围，清除目标
            if (distanceSq > visionRangeSq) {
                this.clearTarget();
                return;
            }

            const isInAttackRange = distanceSq <= this.getTargetAttackRange();

            if (isInAttackRange) {
                // 在攻击范围内，停止移动并攻击
                this.stopActiveMovement();
                this.attack();
            }
            else {
                // 超出攻击范围但在视野内，移动到目标位置
                this.moveToWorldPosition(this.atkTarget.node.worldPosition.clone());
            }
        }
        else {
            //闲逛
            if (this.wander) {
                this.startIdle();
            } else {
                //巡逻
                if (this.currentPathQueue.length === 0) {
                    if (this.curDirection == 0) {
                        this.curDirection = 1;
                    } else {
                        this.curDirection = 0;
                    }
                    this.startPathMovement(this.curDirection == 1);
                }
            }
        }
    }
    /**闲逛：移动到随机路径点, 到达后原地待机 */
    startIdle() {
        if (!this.pathNodes || this.pathNodes.length === 0) {
            return;
        }
        const randomIndex = this.getRandomInt();
        this.currentPathQueue = [this.pathNodes[randomIndex]];
        this.currentPathIndex = randomIndex;
        const targetNode = this.currentPathQueue[0];
        if (targetNode) {
            this.moveToWorldPosition(targetNode.worldPosition.clone());
        }
    }
    /**路径移动 */
    startPathMovement(reverse: boolean) {
        // 复制路径数组
        this.currentPathQueue = [...this.pathNodes];

        // 如果是反向移动，反转数组
        if (reverse) {
            this.currentPathQueue.reverse();
        }

        // 开始移动到第一个路径点
        this.moveToNextPathNode();
    }
    /**
     * 移动到队列中的下一个路径点
     */
    private moveToNextPathNode(): void {
        if (this.currentPathQueue.length === 0) {
            // 队列为空，说明已到达目标，不再移动
            return;
        }

        // 取队列第一个节点
        const targetNode = this.currentPathQueue[0];

        // 记录当前路径索引（用于到达后判断是起点还是终点）
        this.currentPathIndex = this.pathNodes.indexOf(targetNode);

        if (targetNode) {
            this.moveToWorldPosition(targetNode.worldPosition.clone());
        }
    }
    /**到达目标后的回调 */
    onTargetReached() {
        super.onTargetReached();
        // 处理路径队列移动
        if (this.currentPathQueue.length > 0) {
            // 移除队列第一个元素（已到达的点）
            this.currentPathQueue.shift();
            // 检查队列是否为空
            if (this.currentPathQueue.length > 0) {
                // 队列还有点，继续移动到下一个点
                this.moveToNextPathNode();
                return; // 继续移动，不执行后续逻辑
            } else {
                // 无论是任务移动结束还是闲逛移动结束, 都重置空闲计时器
                this.zombieTrackingTimer = 0;
            }
        }
    }
    protected castSkillEffect(): void {
    }
    private counts: number[] = [];
    private lastRandomResult: number = -1; // 记录上次返回的随机数
    /**
     * 获取[0-this.counts.length]之间的随机整数，确保长期执行时各数字出现次数差距不超过2
     * 连续调用2次时返回的随机数不能相同
     * @returns 0-this.counts.length之间的随机整数
     */
    getRandomInt(): number {
        // 计算当前最大和最小的出现次数
        // const maxCount = Math.max(...this.counts);
        const minCount = Math.min(...this.counts);

        // 确定候选数字范围
        const candidates: number[] = [];

        // 如果最大差距达到1，只允许选择出现次数较少的数字
        this.counts.forEach((count, num) => {
            //最大差距达到2
            // if (count <= minCount + 1) 
            if (count <= minCount) {
                candidates.push(num);
            }
        });

        // 从候选列表中移除上次的结果（如果存在）
        if (this.lastRandomResult !== -1) {
            const lastIndex = candidates.indexOf(this.lastRandomResult);
            if (lastIndex !== -1 && candidates.length > 1) {
                candidates.splice(lastIndex, 1);
            }
        }

        // 如果移除后候选列表为空，重新添加所有符合条件的候选项
        if (candidates.length === 0) {
            this.counts.forEach((count, num) => {
                //  if (count <= minCount + 1) 
                if (count <= minCount) {
                    candidates.push(num);
                }
            });
        }

        // 从候选数字中随机选择一个
        const randomIndex = Math.floor(Math.random() * candidates.length);
        const selected = candidates[randomIndex];

        // 更新选中数字的计数和记录
        this.counts[selected]++;
        this.lastRandomResult = selected;
        return selected;
    }
}


