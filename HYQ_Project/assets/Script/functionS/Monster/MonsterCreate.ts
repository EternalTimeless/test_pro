import { _decorator, CCFloat, CCInteger, Component, Node, Pool, tween, Vec3 } from 'cc';
import PoolManager from '../../Base/PoolManager';
import { EffectEnum, EventType, MonsterType, PoolEnum, PrefabsEnum } from '../../Base/EnumList';
import { MonsterBattleTaerget } from './MonsterBattleTaerget';
import { PrefabsManager } from '../../Base/PrefabsManager';
import { MoveModEnum } from '../../Base/MoveRot/MoveDrive';
import { Player } from '../Player/Player';
import EventManager from '../../Base/EventManager';
import { UnityUpComponent } from '../../Base/UnityUpComponent';
import { GameOverPanel } from '../UI/GameOver/GameOverPanel';
import { JumpManager } from '../Jump/JumpManager';
import { FlashRedManager } from '../Battle/Base/FlashRedManager';
import { EffectManager } from '../Effect/EffectManager';
import { CameraMove } from '../../Base/CameraMove';
const { ccclass, property } = _decorator;
const tempV3 = new Vec3();

@ccclass("MonsterCreateInfo")
class MonsterCreateInfo {

    @property(CCInteger)
    public loopMax: number = 1;

    @property({ type: MonsterType })
    public monsterType: MonsterType = MonsterType.ZombieBaby_0;

    @property(CCInteger)
    public monsterCountMax: number = 50;

    @property(CCInteger)
    public brotherExcludeZ = 0;

    public curMonsterCount: number = 0;

    public curLoopCount: number = 0;

    public init() {
        this.curLoopCount = 0;
        this.curMonsterCount = 0;
    }
}

@ccclass("MonsterCreateQueue")
class MonsterCreateQueue {

    public curIndex: number = 0;


    @property(MonsterCreateInfo)
    public monsterCreateInfoList: MonsterCreateInfo[] = [];

}



@ccclass('MonsterCreate')
export class MonsterCreate extends UnityUpComponent {

    @property({ type: CCInteger, tooltip: '场景中最大怪物数量' })
    public monsterCount: number = 500;
    @property({ type: CCInteger, tooltip: '补充阶段每帧最大生成数，防止大量死怪时瞬间补怪掉帧' })
    public maxSpawnPerFrame: number = 5;
    @property(MonsterCreateQueue)
    public monsterCreateQueue: MonsterCreateQueue = new MonsterCreateQueue();



    @property({ tooltip: 'ZombieBrother前后Z轴排斥范围，该范围内不能生成ZombieBaby' })
    public brotherExcludeZ: number = 2;

    @property({ tooltip: '怪物X轴分布半宽，实际列间距=disX*2/rowCount' })
    public disX: number = 2.5;

    @property({ tooltip: '怪物X轴分布半宽，实际列间距=disX*2/rowCount' })
    public disX2: number = 3;

    @property(CCFloat)
    public monsterSpeed: number = 2;

    @property({ tooltip: '怪物中路X轴限制半宽，防止进入左右石板区域' })
    public middleLaneHalfX: number = 2;



    /** 每列间距，由 disX*2/rowCount 计算得出 */
    private offX: number = 0;

    @property({ tooltip: '每行生成的怪物数量' })
    public rowCount: number = 8;
    private _rowCount: number = 0;

    @property({ tooltip: '怪物Z轴每层间距' })
    public layerGapZ: number = 0.8;

    private _monsterList: MonsterBattleTaerget[] = [];

    private posIndex: number = 0;

    /** 自上次生成ZombieBrother以来已生成的ZombieBaby数量 */
    // private _babyCountSinceLastBrother: number = 0;

    /** 下一个ZombieBaby的Z轴生成位置 */
    private _nextSpawnZ: number = 0;


    private _monsterBossCount: number = 0;


    private bossDieCount: number = 0;

    public static isStartMove: boolean = false;

    private stage_0: number = 26.5;
    private stage_1: number = 15;
    private _hasInitialFilled: boolean = false;

    start() {
        this.offX = this.middleLaneHalfX * 2 / this.rowCount;
        EventManager.instance.on(EventType.PLAYER_RESURRECTION, this.TimeFlowsBackWard, this);
        EventManager.instance.on(EventType.MONSTER_SKILL_XRD, this.skillXRMonster, this);
        // this.scheduleOnce(() => {
        //     this.skillXRMonster(2, 2, 2);
        // }, 2);
    }
    private monsterMatIns: number[] = [0, 0, 0];

    _update(deltaTime: number) {
        // if (this.isFlowIN) {
        //     return;
        // }
        if (!this._hasInitialFilled && this._monsterList.length >= this.monsterCount) {
            this._hasInitialFilled = true;
        }
        if (this._monsterList.length < this.monsterCount) {
            const quest = this.monsterCreateQueue.monsterCreateInfoList[this.monsterCreateQueue.curIndex];
            const monsterCount = quest.monsterCountMax - quest.curMonsterCount;
            let count = this.monsterCount - monsterCount + this._monsterList.length;
            if (count >= 0) {
                count = monsterCount;
            } else {
                count = this.monsterCount - this._monsterList.length;
            }
            const maxPerFrame = this._hasInitialFilled ? this.maxSpawnPerFrame : 51;
            if (count > maxPerFrame) {
                count = maxPerFrame;
            }

            for (let i = 0; i < count; i++) {
                if (quest.monsterType == MonsterType.ZombieBrother) {
                    this.spawnBrother();
                } else {
                    this.spawnBaby();
                }

            }
            quest.curMonsterCount += count;
            if (quest.curMonsterCount == quest.monsterCountMax) {
                quest.curLoopCount++;
                this._nextSpawnZ += quest.brotherExcludeZ;
                if (quest.loopMax != -1 && quest.curLoopCount == quest.loopMax) {
                    this.monsterCreateQueue.curIndex++;
                    this.monsterCreateQueue.curIndex = this.monsterCreateQueue.curIndex % this.monsterCreateQueue.monsterCreateInfoList.length;
                }
                quest.init();
            }

        }
        for (let i = this._monsterList.length - 1; i >= 0; i--) {

            const monster = this._monsterList[i];

            if (monster.isDie) {
                // swap-and-pop替代splice，iOS优化

                if (monster.monsterType == MonsterType.ZombieBrother) {
                    this.bossDieCount++;
                    if (this.bossDieCount == 2) {
                        this.scheduleOnce(() => {
                            GameOverPanel.instance.show(true);
                        }, 1);
                    }
                }
                this._monsterList[i] = this._monsterList[this._monsterList.length - 1];

                this._monsterList.pop();

            } else if (monster.move.isPos) {
                const mz = monster.node.worldPositionZ;
                if (mz <= this.stage_0 && mz > this.stage_1) {
                    const mx = monster.node.worldPositionX;
                    const x = this.clampMonsterX(mx);
                    tempV3.x = x;
                    tempV3.y = 0;
                    tempV3.z = this.stage_1;
                    monster.move.pos = tempV3;
                    monster.initX = x;

                } else if (mz >= this.stage_1) {
                    if (!monster.attackTarget || !monster.attackTarget.active) {
                        monster.move.moveMod = MoveModEnum.targetMove;

                        monster.attackTarget = Player.instance.attackTarget.node;

                        monster.move.target = monster.attackTarget;
                        // if (monster.monsterType == MonsterType.ZombieBaby_0) {
                        //     EventManager.instance.emit(EventType.Monster_Attack_Player_ADD, monster);
                        // }
                    }
                }
            }
            this.limitMonsterToMiddleLane(monster);
        }

        if (MonsterCreate.isStartMove) {
            this._nextSpawnZ -= deltaTime * this.monsterSpeed;
        }

    }

    /** 生成ZombieBrother，放在排斥区域的中间 */
    private spawnBrother() {
        const monster = this.getMonster(MonsterType.ZombieBrother);
        this._monsterList.push(monster);
        this.node.addChild(monster.node);
        // const layer = Math.floor(this._babyCountSinceLastBrother / this.rowCount);
        // const l = this.brotherInterval / this.rowCount;
        // let z = this._finallyBoss ? this._finallyBoss.z + this.brotherExcludeZ * 2 + this.layerGapZ * layer : this.layerCount * (this.layerGapZ * l + this.brotherExcludeZ) + this.brotherExcludeZ + this.layerGapZ * layer;
        this._nextSpawnZ += this.brotherExcludeZ;
        const z = this._nextSpawnZ;
        this._nextSpawnZ += this.brotherExcludeZ;
        monster.init((this._monsterBossCount * 2) + 1);
        monster.move.moveMod = MoveModEnum.PosMove;
        monster.node.setPosition(this.clampMonsterX(0), 0, z);
        tempV3.set(monster.node.worldPosition);
        tempV3.z = this.stage_0;
        monster.move.pos = tempV3;
        monster.initX = 0;
        // this._brotherZPositions.push(z);
        this._monsterBossCount++;
    }

    /** 生成ZombieBaby，自动避开ZombieBrother的排斥区域 */
    private spawnBaby() {
        const type = Math.random() < 0.5 ? MonsterType.ZombieBaby_0 : MonsterType.ZombieBaby_1;
        const monsterIns = this.monsterMatIns[type];

        const monster = this.getMonster(type);
        this._monsterList.push(monster);
        this.node.addChild(monster.node);
        if (!monsterIns) {
            this.monsterMatIns[type] = 1;
            monster.flashDie(0.01);
        }
        // const layer = Math.floor(this._babyCountSinceLastBrother / this.rowCount);
        // const l = this.brotherInterval / this.rowCount;
        // let z = this._finallyBoss ? this._finallyBoss.z + this.brotherExcludeZ + this.layerGapZ * layer : this.layerCount * (this.layerGapZ * l + this.brotherExcludeZ) + this.layerGapZ * layer;

        // 安全检查：确保不在排斥区域内
        // let needCheck = true;
        // while (needCheck) {
        //     needCheck = false;
        //     for (const brotherZ of this._brotherZPositions) {
        //         if (z >= brotherZ - this.brotherExcludeZ && z <= brotherZ + this.brotherExcludeZ) {
        //             z = brotherZ + this.brotherExcludeZ + 0.1;
        //             this._nextSpawnZ = z;
        //             this._babiesAtCurrentZ = 0;
        //             needCheck = true;
        //             break;
        //         }
        //     }
        // }
        const z = this._nextSpawnZ + (Math.random() - 0.5) * this.layerGapZ;
        const x = this.clampMonsterX((Math.random() - 0.5) * this.offX + (this.posIndex - (this.rowCount - 1) / 2) * this.offX);

        this.posIndex = (this.posIndex + 1) % this.rowCount;

        monster.move.moveMod = MoveModEnum.PosMove;

        monster.node.setPosition(x, 0, z);

        tempV3.set(monster.node.worldPosition);

        tempV3.z = this.stage_0;

        monster.move.pos = tempV3;
        monster.initX = x;
        this._rowCount++;

        if (this._rowCount == this.rowCount) {
            this._nextSpawnZ += this.layerGapZ;
            this._rowCount = 0;
        }

    }

    private clampMonsterX(x: number): number {
        if (x > this.middleLaneHalfX) {
            return this.middleLaneHalfX;
        }
        if (x < -this.middleLaneHalfX) {
            return -this.middleLaneHalfX;
        }
        return x;
    }

    private limitMonsterToMiddleLane(monster: MonsterBattleTaerget) {
        const x = this.clampMonsterX(monster.node.x);
        if (monster.node.x != x) {
            monster.node.x = x;
        }
        if (monster.move) {
            monster.move.pos.x = this.clampMonsterX(monster.move.pos.x);
        }
    }

    private getMonster(type: MonsterType = MonsterType.ZombieBaby_0) {
        let monster = PoolManager.instance.getPool<MonsterBattleTaerget>(PoolEnum.monster + type);
        if (!monster) {
            const node = PrefabsManager.instance.GetPrefabsIns(PrefabsEnum.monster, type);
            monster = node.getComponent(MonsterBattleTaerget);
        }
        monster.node.active = true;
        monster.init(1);
        monster.attackTarget = null;
        return monster;
    }

    // private isFlowIN = false;
    private TimeFlowsBackWard() {
        // this.isFlowIN = true;
        for (let i = 0; i < this._monsterList.length; i++) {
            const monster = this._monsterList[i];
            monster.move.autoMove = false;
            if (monster.attackTarget) {
                const z = -26.3 + Math.abs(-26.3 - monster.node.z) + 10 + Math.random() * 5;
                tween(monster.node).to(0.05, { x: this.clampMonsterX(monster.initX), z: -26.3 }).to(0.35, { z: z }).call(() => {
                    monster.move.autoMove = true;
                    monster.move.moveMod = MoveModEnum.PosMove;
                    tempV3.set(monster.node.worldPosition);
                    tempV3.z = this.stage_1;
                    monster.attackTarget = null;
                    monster.move.pos = tempV3;
                }).start();
            } else {

                tween(monster.node).to(0.4, { z: monster.node.z + 15 }).call(() => {

                    monster.move.autoMove = true;

                }).start();

            }
        }
        // this.scheduleOnce(() => {
        //     this.isFlowIN = false;
        // }, 0.4);
    }
    private skillXRMonster(x: number, r: number, delay: number = 0) {

        const monsterList = this._monsterList;

        for (let i = monsterList.length - 1; i >= 0; i--) {
            const monster = monsterList[i];
            if (monster.monsterType === MonsterType.ZombieBrother) continue;
            if (monster.node.worldPositionZ < this.stage_1) continue;
            const mx = monster.node.worldPositionX;
            const offx = mx - (x - r / 3);
            const absX = Math.abs(offx);
            const fx = offx / absX;

            if (absX <= r) {
                // === 命中：击飞 ===
                const pos = monster.node.worldPosition;
                const endPos = PoolManager.instance.V3;
                console.log("fx2", fx);
                let px = fx * Math.random() * 20 + fx * 4;

                endPos.x = this.clampMonsterX(px + fx * 8);
                endPos.z = pos.z;

                const cPos = PoolManager.instance.V3;
                cPos.x = (pos.x + endPos.x) * 0.5;
                cPos.z = pos.z;
                endPos.y = -35 - Math.random() * 30;
                cPos.y = pos.y + 10 + Math.random() * 3;

                // === 爽感：冲击缩放（PoolManager池化，零GC） ===
                // const sclX = monster.node.scale.x;
                // const sclY = monster.node.scale.y;
                // const sclZ = monster.node.scale.z;
                // const sclTarget = PoolManager.instance.V3;
                // sclTarget.set(sclX * 1.6, sclY * 1.6, sclZ * 1.6);
                // const sclOrig = PoolManager.instance.V3;
                // sclOrig.set(sclX, sclY, sclZ);
                // tween(monster.node)
                //     .to(0.03, { scale: sclTarget }, { easing: 'quadOut' })
                //     .to(0.07, { scale: sclOrig }, { easing: 'quadIn' })
                //     .call(() => {
                //         PoolManager.instance.V3 = sclTarget;
                //         PoolManager.instance.V3 = sclOrig;
                //     })
                //     .start();

                // === 爽感：地面冲击波特效 ===
                // const dustPos = PoolManager.instance.V3;
                // dustPos.set(pos);
                // dustPos.y = 0;
                // EffectManager.instance.addShowEffect(dustPos, EffectEnum.Monsterhit, 3);
                // PoolManager.instance.V3 = dustPos;

                // // === 爽感：原hit保持（模型上方） ===
                // const effectPos = PoolManager.instance.V3;
                // effectPos.set(pos);
                // effectPos.y += 3;
                // EffectManager.instance.addShowEffect(effectPos, EffectEnum.Monsterhit, 2.5);
                // PoolManager.instance.V3 = effectPos;

                // === 爽感：飞行中旋转 ===
                const spinDir = fx;
                const spinAmount = spinDir * (15 + Math.random() * 165);
                const rotV3 = PoolManager.instance.V3;
                rotV3.set(0, 0, spinAmount);
                tween(monster.fbx.node)
                    .to(0.7 + Math.random() * 0.5, { eulerAngles: rotV3 }, { easing: 'sineIn' })
                    .call(() => { PoolManager.instance.V3 = rotV3; })
                    .start();

                const time = Math.random() * 0.2;

                JumpManager.instance.jumpBezierByPoints(monster.node, 0.3 + Math.random() * 0.3, cPos, endPos).onComplete(() => {
                    PoolManager.instance.V3 = endPos;
                    PoolManager.instance.V3 = cPos;
                    this.scheduleOnce(() => {
                        monster.node.eulerAngles = Vec3.ZERO;
                        monster.node.active = false;
                        monster.isDieD = true;
                        FlashRedManager.instance.stopFlashRed(monster.node);
                        PoolManager.instance.setPool(PoolEnum.monster + monster.monsterType, monster);
                    }, 0.05 + Math.random() * 0.2);
                }).setDelay(time);

                monster.isDieD = false;

                monster.skipDieFlash = true;

                this.scheduleOnce(() => {

                    monster.Hit(200);

                }, time)

                monsterList.splice(i, 1);

            }
            // else if (absX <= r * 3.5 && monster.node.worldPositionZ > this.stage_0) {
            //     // === 范围边缘：横向推移（PoolManager池化，零GC） ===
            //     let px = fx * Math.random() * 4 + fx * 2;
            //     const bx = px + mx;
            //     if (bx > this.disX) {
            //         px = this.disX - mx;
            //     } else if (bx < -this.disX) {
            //         px = -this.disX - mx;
            //     }

            //     const targetX = monster.node.x + px;
            //     const dur = 0.35 + Math.random() * 0.15;

            //     const sclX = monster.node.scale.x;
            //     const sclY = monster.node.scale.y;
            //     const sclZ = monster.node.scale.z;
            //     const sclTarget = PoolManager.instance.V3;
            //     sclTarget.set(sclX * 1.3, sclY * 1.3, sclZ * 1.3);
            //     const sclOrig = PoolManager.instance.V3;
            //     sclOrig.set(sclX, sclY, sclZ);
            //     tween(monster.node)
            //         .to(0.03, { scale: sclTarget }, { easing: 'quadOut' })
            //         .to(0.07, { scale: sclOrig }, { easing: 'quadIn' })
            //         .call(() => {
            //             PoolManager.instance.V3 = sclTarget;
            //             PoolManager.instance.V3 = sclOrig;
            //         })
            //         .start();

            //     tween(monster.node)
            //         .to(dur, { x: targetX }, { easing: 'circOut' })
            //         .start();
            // }
        }

        // === 爽感：根据命中数触发摄像机震动 ===
        CameraMove.instance.Shake2(10);

    }


}


