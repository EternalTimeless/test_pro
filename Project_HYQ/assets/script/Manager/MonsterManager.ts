import { _decorator, CCFloat, CCInteger, Component, Node, v3, Vec3 } from 'cc';
import { CharacterTag, CommonEvent, PrefabPathEnum } from '../Common/CommonEnum';
import { EnemyDeadEventData, GameInfo } from '../Common/GameInfo';
import { MathUtil } from '../Extra/MathUtil';
import FlyManager from './FlyManager';
import { EnemyCharacter } from '../Battle/EnemyChar';
import { Monster } from '../Battle/Monster';
import { Elite } from '../Battle/Elite';

const { ccclass, property } = _decorator;

@ccclass('MonsterSpawnInfo')
class MonsterSpawnInfo {
    /** 循环次数，-1 为无限循环 */
    @property({ type: CCInteger, displayName: '循环次数(-1=无限)' })
    public loopTimes: number = 1;

    @property({ type: CCInteger, displayName: '怪物类型 0=Baby 1=Boss' })
    public monsterKind: number = 0;

    @property(CCInteger)
    public monsterCountMax: number = 50;

    @property(CCInteger)
    public brotherExcludeZ = 0;

    /** 当前循环轮内已生成数量 */
    public curMonsterCount: number = 0;
    /** 当前队列项已完成的循环轮数 */
    public curLoopCount: number = 0;

    /** 关卡重置时调用，清零运行时状态 */
    public init() {
        this.curLoopCount = 0;
        this.curMonsterCount = 0;
    }

    /** 同一队列项进入下一轮循环时调用，仅重置本批计数 */
    public resetBatch() {
        this.curMonsterCount = 0;
    }
}

@ccclass('MonsterSpawnQueue')
class MonsterSpawnQueue {
    public curIndex: number = 0;
    @property(MonsterSpawnInfo)
    public monsterCreateInfoList: MonsterSpawnInfo[] = [];
}

@ccclass('MonsterManager')
export class MonsterManager extends Component {
    public monsterList: Node[] = [];
    public eliteMonsterList: Node[] = [];

    @property({ type: CCInteger, displayName: '场景最大怪物数量' })
    public sceneMaxMonsterCount: number = 500;

    @property({ type: CCInteger, displayName: '补充阶段每帧最大生成数' })
    public maxSpawnPerFrame: number = 5;

    @property(MonsterSpawnQueue)
    public monsterCreateQueue: MonsterSpawnQueue = new MonsterSpawnQueue();

    @property({ tooltip: 'Boss 前后 Z 排斥范围' })
    public brotherExcludeZ: number = 2;

    @property({ tooltip: '怪物X轴分布半宽' })
    public disX: number = 2.5;

    @property({ tooltip: '汇聚后X轴分布半宽' })
    public disX2: number = 3;

    @property(CCFloat)
    public monsterSpeed: number = 4;

    @property({ tooltip: '每行怪物数量' })
    public rowCount: number = 10;

    @property({ tooltip: '怪物Z轴每层间距' })
    public layerGapZ: number = 0.8;

    /** 第三阶段目标 Z（到达后切换为追踪主角） */
    @property
    public stage0: number = 0;

    /** 第二阶段目标 Z（到达后 X 汇聚并开启翻倍牌索敌，需小于 stage0） */
    @property
    public stage1: number = -23;

    /** 第一阶段 / 生成基准 Z（沿 +Z 推进至 stage1，需小于 stage1） */
    @property
    public stage2: number = -40;

    public static isStartMove: boolean = false;

    private offX: number = 0;
    private _rowCount: number = 0;
    private posIndex: number = 0;
    private _nextSpawnZ: number = 0;
    private _monsterBossCount: number = 0;
    private bossDieCount: number = 0;
    private _hasInitialFilled: boolean = false;
    private _enemies: EnemyCharacter[] = [];
    private dropArr: Node[] = [];
    private dropCheckTimer: number = 0;
    private isFirstMonsterDead: boolean = false;

    onLoad() {
        GameInfo.instance.monsterMgr = this;
        this.monsterList = [];
        this.eliteMonsterList = [];
        this._enemies = [];
        app.event.on(CommonEvent.EnemyDead, this.onEnemyDead, this);
    }

    start() {
        this.offX = this.disX * 2 / this.rowCount;
        this.reset();
    }

    reset() {
        this.dropArr = [];
        this._nextSpawnZ = this.stage2 - this.layerGapZ;
        this._rowCount = 0;
        this.posIndex = 0;
        this._monsterBossCount = 0;
        this.bossDieCount = 0;
        this._hasInitialFilled = false;
        this.monsterCreateQueue.curIndex = 0;
        if (this.monsterCreateQueue.monsterCreateInfoList.length === 0) {
            const info = new MonsterSpawnInfo();
            info.monsterKind = 0;
            info.monsterCountMax = 999999;
            info.loopTimes = -1;
            this.monsterCreateQueue.monsterCreateInfoList = [info];
        }
        for (const info of this.monsterCreateQueue.monsterCreateInfoList) {
            info.init();
        }
        GameInfo.instance.guideMgr?.onGuideStep();
    }

    /** 引导 step0：一次性刷满 curIndex 队列怪物并进入待机 */
    public spawnAllGuideMonsters() {
        GameInfo.instance.guideMgr.isGuideMonster = true;
        MonsterManager.isStartMove = false;

        const questList = this.monsterCreateQueue.monsterCreateInfoList;
        const curIndex = this.monsterCreateQueue.curIndex;
        if (curIndex > questList.length - 1) {
            return;
        }

        const quest = questList[curIndex];
        if (!quest) {
            return;
        }

        const remain = quest.monsterCountMax - quest.curMonsterCount;
        for (let i = 0; i < remain; i++) {
            if (this._enemies.length >= this.sceneMaxMonsterCount) {
                break;
            }
            if (quest.monsterKind === 1) {
                this.spawnBrother();
            } else {
                this.spawnBaby();
            }
        }
        quest.curMonsterCount = quest.monsterCountMax;
        this._hasInitialFilled = true;

        for (const enemy of this._enemies) {
            enemy.enterGuideIdle();
        }
    }

    createGuideMonster() {
        GameInfo.instance.guideMgr.isGuideMonster = false;
        MonsterManager.isStartMove = true;

        const questList = this.monsterCreateQueue.monsterCreateInfoList;
        const curIndex = this.monsterCreateQueue.curIndex;
        if (curIndex <= questList.length - 1) {
            const quest = questList[curIndex];
            if (quest && quest.curMonsterCount >= quest.monsterCountMax) {
                this._onBatchComplete(quest);
            }
        }
    }

    unlockBirthPoints(_count?: number) { }

    update(dt: number) {
        if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin || GameInfo.instance.guideMgr.isGuideMonster) return;
        this.dropCheckTimer += dt;
        if (this.dropCheckTimer >= 0.1) {
            this.dropCheckTimer = 0;
            this.checkItem();
        }

        if (!this._hasInitialFilled && this._enemies.length >= this.sceneMaxMonsterCount) {
            this._hasInitialFilled = true;
        }

        this._trySpawnMonsters();

        for (let i = this._enemies.length - 1; i >= 0; i--) {
            const m = this._enemies[i];
            if (!m || !m.node?.isValid) {
                this._swapRemoveEnemy(i);
                continue;
            }
            if (m.isDead) {
                if (m.CharacterTag === CharacterTag.Boss) {
                    this.bossDieCount++;
                    if (this.bossDieCount >= 2) {
                        this.scheduleOnce(() => {
                            app.event.emit(CommonEvent.GameSuccess);
                        }, 1);
                    }
                }
                this._swapRemoveEnemy(i);
            }
        }

        if (MonsterManager.isStartMove) {
            this._nextSpawnZ -= dt * this.monsterSpeed;
        }
    }

    /** 尝试按当前队列配置生成怪物 */
    private _trySpawnMonsters() {
        const questList = this.monsterCreateQueue.monsterCreateInfoList;
        const curIndex = this.monsterCreateQueue.curIndex;
        if (curIndex > questList.length - 1 || this._enemies.length >= this.sceneMaxMonsterCount) {
            return;
        }

        const quest = questList[curIndex];
        if (!quest) return;

        const remainQuest = quest.monsterCountMax - quest.curMonsterCount;
        if (remainQuest <= 0) return;

        let count = this.sceneMaxMonsterCount - this._enemies.length;
        if (remainQuest < count) {
            count = remainQuest;
        }
        const maxPerFrame = this._hasInitialFilled ? this.maxSpawnPerFrame : 10;
        if (count > maxPerFrame) count = maxPerFrame;

        for (let i = 0; i < count; i++) {
            if (quest.monsterKind === 1) {
                this.spawnBrother();
            } else {
                this.spawnBaby();
            }
        }
        quest.curMonsterCount += count;

        if (quest.curMonsterCount >= quest.monsterCountMax) {
            this._onBatchComplete(quest);
        }
    }

    /** 当前循环批次刷满后的队列推进逻辑 */
    private _onBatchComplete(quest: MonsterSpawnInfo) {
        quest.curLoopCount++;
        this._nextSpawnZ -= quest.brotherExcludeZ;

        if (quest.loopTimes === -1) {
            // 无限循环：停留当前队列，只重置本批计数
            quest.resetBatch();
            return;
        }

        if (quest.curLoopCount >= quest.loopTimes) {
            // 当前队列项轮次耗尽，切到下一项（不回绕，已完成队列不再生效）
            this.monsterCreateQueue.curIndex++;
            return;
        }

        // 同队列项进入下一轮循环
        quest.resetBatch();
    }

    private _swapRemoveEnemy(i: number) {
        const last = this._enemies.length - 1;
        const removed = this._enemies[i];
        this._enemies[i] = this._enemies[last];
        this._enemies.pop();
        const nodeIdx = this.monsterList.indexOf(removed.node);
        if (nodeIdx !== -1) {
            this.monsterList[nodeIdx] = this.monsterList[this.monsterList.length - 1];
            this.monsterList.pop();
        }
    }

    private spawnBrother() {
        const node = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.ENEMY_ELITE);
        if (!node) return;
        const parent = GameInfo.instance.gameMgr?.gameLayer;
        if (!parent) return;
        node.setParent(parent);

        this._nextSpawnZ -= this.brotherExcludeZ;
        const z = this._nextSpawnZ;
        this._nextSpawnZ -= this.brotherExcludeZ;

        const enemy = node.getComponent(Elite);
        if (!enemy) return;
        enemy.beginMarchFromSpawn(0, z);
        this._registerEnemy(enemy);
        this._monsterBossCount++;
    }

    private spawnBaby() {
        const node = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.ENEMY_MINION);
        if (!node) return;
        const parent = GameInfo.instance.gameMgr?.gameLayer;
        if (!parent) return;
        node.setParent(parent);

        const z = this._nextSpawnZ;
        const x = (Math.random() - 0.5) * this.offX + (this.posIndex - (this.rowCount - 1) / 2) * this.offX;
        this.posIndex = (this.posIndex + 1) % this.rowCount;

        const enemy = node.getComponent(Monster);
        if (!enemy) return;
        enemy.beginMarchFromSpawn(x, z);
        this._registerEnemy(enemy);

        this._rowCount++;
        if (this._rowCount >= this.rowCount) {
            this._nextSpawnZ -= this.layerGapZ;
            this._rowCount = 0;
        }
    }

    private _registerEnemy(enemy: EnemyCharacter) {
        this._enemies.push(enemy);
        this.monsterList.push(enemy.node);
    }

    public onBossKilled() { }

    public deleteMonster(uuid: string) {
        for (let i = this.monsterList.length - 1; i >= 0; i--) {
            if (this.monsterList[i].uuid === uuid) {
                this.monsterList.splice(i, 1);
                break;
            }
        }
        for (let i = this._enemies.length - 1; i >= 0; i--) {
            if (this._enemies[i].node.uuid === uuid) {
                this._enemies[i] = this._enemies[this._enemies.length - 1];
                this._enemies.pop();
                return;
            }
        }
    }

    public deleteElite(uuid: string) {
        for (let i = this.eliteMonsterList.length - 1; i >= 0; i--) {
            if (this.eliteMonsterList[i].uuid === uuid) {
                this.eliteMonsterList.splice(i, 1);
                return;
            }
        }
        this.deleteMonster(uuid);
    }

    StopAllMonster(isDead: boolean = false) {
        const nodes = [...this.eliteMonsterList, ...this.monsterList];
        nodes.forEach((node) => {
            const enemy = node.getComponent(EnemyCharacter);
            if (enemy) {
                enemy.clearTarget();
                enemy.stopAttack();
                enemy.stopMove();
                if (isDead) enemy.promptlyDead();
            }
        });
    }

    private onEnemyDead(data: EnemyDeadEventData) {
        if (GameInfo.instance.player?.isDead) return;
        // NOTE: 此项目不需要掉落物
        // const tag = data.characterTag;
        // if (tag !== CharacterTag.Monster && tag !== CharacterTag.Elite && tag !== CharacterTag.Boss) return;
        // let count = Math.round(Math.random() * 2) + 3;
        // if (!this.isFirstMonsterDead) {
        //     count = 10;
        //     this.isFirstMonsterDead = true;
        // }
        // if (count > 0) this._spawnDrops(data.worldPos, count);
    }

    private _spawnDrops(worldPos: Vec3, count: number): void {
        for (let i = 0; i < count; i++) {
            const pos = MathUtil.getRandomPositionAroundTarget(worldPos, 1, 0.5);
            pos.y += 0.2;
            GameInfo.instance.gameMgr.effLayer.inverseTransformPoint(pos, pos);
            FlyManager.Ins.flyItem({
                sourceWorldPos: pos,
                targetNode: GameInfo.instance.gameMgr.effLayer,
                targetLocalPos: pos,
                prefabPath: PrefabPathEnum.COIN_GOLD,
                onComplete: (item) => {
                    this.dropArr.push(item);
                },
                flyParams: { radius: 2, power: 3, flyType: 0 },
            });
        }
    }

    private reservedCoin: number = 0;
    checkItem() {
        const len = this.dropArr.length;
        const MAX_ITEMS = 500;
        const PICKUP_RANGE = 600 * 600;
        let needFlyNum = 50;
        if (len <= 0) return;

        //     const bMgr = GameInfo.instance.buildingMgr;
        //     if (!bMgr?.buildTrainingCamp) return;

        //     if (needFlyNum > 0) {
        //         needFlyNum = Math.min(needFlyNum, len);
        //         for (let i = len - 1; i >= len - needFlyNum; i--) {
        //             const item = this.dropArr[i];
        //             const dx = GameInfo.instance.player.node.worldPosition.x - item.worldPosition.x;
        //             const dz = GameInfo.instance.player.node.worldPosition.z - item.worldPosition.z;
        //             if (dx * dx + dz * dz <= PICKUP_RANGE) {
        //                 this.dropArr.splice(i, 1);
        //                 this.reservedCoin++;
        //                 const delay = (i > 10 ? 10 : i) * Math.random() * 0.1;
        //                 this.scheduleOnce(() => {
        //                     const localPos = bMgr.buildTrainingCamp.GoldStack.preprocessData();
        //                     FlyManager.instance.createFly(
        //                         item,
        //                         bMgr.buildTrainingCamp.GoldStack.root,
        //                         localPos,
        //                         2,
        //                         () => {
        //                             if (item) bMgr.buildTrainingCamp.GoldStack.addItem(item);
        //                             this.reservedCoin--;
        //                         },
        //                         3,
        //                         0,
        //                         v3(0, 0, 0),
        //                         true,
        //                         v3(1, 1, 1)
        //                     );
        //                 }, delay);
        //             }
        //         }
        //     }
    }
}
