import { _decorator, CCFloat, CCInteger, Component, director, instantiate, Node, Pool, tween, Vec3 } from 'cc';
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
import { PropArms } from '../Other/PropArms';
import { CreatePropBrand } from '../Other/CreatePropBrand';
import BulletMonsterCollisionManager from '../Battle/BulletMonsterCollisionManager';
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

    public static instance: MonsterCreate = null;

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

    @property({ tooltip: '左右石板区域Z轴起点，怪物只在该区间内限制中路' })
    public sideSlabLimitMinZ: number = 22;

    @property({ tooltip: '左右石板区域Z轴终点，怪物只在该区间内限制中路' })
    public sideSlabLimitMaxZ: number = 200;



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
    private _spawnAllWavesOnStart: boolean = true;
    @property({ type: PropArms, tooltip: '中路Role_x模板。MonsterCreate会按怪物大波次一次性复制出Role_0/Role_1/Role_2并在开场全部摆好。留空时会自动寻找场景中带多阶段armsInfoList的PropArms。' })
    public waveRoleTemplate: PropArms = null;
    @property({ type: CCInteger, tooltip: '中路Role_x的大波次数量，默认3。' })
    public waveRoleCount: number = 3;
    private _waveRoleNodes: PropArms[] = [];
    private _waveStageStartZList: number[] = [];
    private _monsterWaveIndexMap: WeakMap<MonsterBattleTaerget, number> = new WeakMap();
    private readonly waveRolePushGapInternal: number = 0.02;
    private _isRestoringWaveRolesAfterRebirth: boolean = false;

    protected onLoad(): void {
        MonsterCreate.instance = this;
        this.prepareWaveRoles();
    }

    start() {
        this.offX = this.disX * 2 / this.rowCount;
        EventManager.instance.on(EventType.PLAYER_RESURRECTION, this.TimeFlowsBackWard, this);
        EventManager.instance.on(EventType.MONSTER_SKILL_XRD, this.skillXRMonster, this);
        this.spawnAllWavesAtStart();
        // this.scheduleOnce(() => {
        //     this.skillXRMonster(2, 2, 2);
        // }, 2);
    }
    private monsterMatIns: number[] = [0, 0, 0];

    private prepareWaveRoles() {
        if (this._waveRoleNodes.length > 0) {
            return;
        }

        const template = this.waveRoleTemplate ?? this.findWaveRoleTemplate();
        if (!template || !template.node) {
            return;
        }

        const totalStageCount = this.getConfiguredWaveCount();
        if (totalStageCount <= 0) {
            return;
        }

        const allStageStartZList = this.getWaveStageStartZList(totalStageCount);
        const stageZList = this.getBigWaveStartZList(allStageStartZList, this.waveRoleCount);
        this._waveStageStartZList = stageZList.slice();
        const parent = template.node.parent;
        if (!parent) {
            return;
        }

        this._waveRoleNodes.length = 0;
        this._waveRoleNodes.push(template);

        template.setFixedStage(0);
        template.node.active = true;
        if (typeof stageZList[0] === 'number') {
            this.resetWaveRoleToStageStart(template, stageZList[0]);
        }

        for (let i = 1; i < stageZList.length; i++) {
            const cloneNode = instantiate(template.node);
            parent.addChild(cloneNode);
            const clone = cloneNode.getComponent(PropArms);
            if (!clone) {
                continue;
            }
            clone.setFixedStage(Math.min(i, clone.armsInfoList.length - 1));
            clone.node.active = true;
            if (typeof stageZList[i] === 'number') {
                this.resetWaveRoleToStageStart(clone, stageZList[i]);
            }
            this._waveRoleNodes.push(clone);
        }

        this.bindWaveRolesToCreatePropBrand();
    }

    private findWaveRoleTemplate() {
        const scene = director.getScene();
        if (!scene) {
            return null;
        }

        const stack: Node[] = [scene];
        while (stack.length > 0) {
            const node = stack.pop();
            if (!node) {
                continue;
            }
            const arms = node.getComponent(PropArms);
            if (arms && arms.armsInfoList.length > 1) {
                return arms;
            }
            for (let i = node.children.length - 1; i >= 0; i--) {
                stack.push(node.children[i]);
            }
        }
        return null;
    }

    private getConfiguredWaveCount() {
        const list = this.monsterCreateQueue?.monsterCreateInfoList ?? [];
        let count = 0;
        for (let i = 0; i < list.length; i++) {
            const quest = list[i];
            if (!quest) {
                continue;
            }
            const loopCount = quest.loopMax == -1 ? 1 : Math.max(1, quest.loopMax);
            count += loopCount;
        }
        return count;
    }

    private getBigWaveStartZList(allStageStartZList: number[], bigWaveCount: number) {
        const result: number[] = [];
        if (!allStageStartZList.length || bigWaveCount <= 0) {
            return result;
        }

        const stageTypeList = this.getExpandedStageMonsterTypeList();
        const stageStartIndexList = this.getBigWaveStartStageIndexList(stageTypeList, bigWaveCount);
        if (stageStartIndexList.length > 0) {
            for (let i = 0; i < stageStartIndexList.length; i++) {
                const stageIndex = stageStartIndexList[i];
                const stageZ = allStageStartZList[stageIndex];
                if (typeof stageZ === 'number') {
                    result.push(stageZ);
                }
            }
            if (result.length > 0) {
                return result;
            }
        }

        const chunkSize = Math.max(1, Math.ceil(allStageStartZList.length / bigWaveCount));
        for (let i = 0; i < allStageStartZList.length && result.length < bigWaveCount; i += chunkSize) {
            result.push(allStageStartZList[i]);
        }
        while (result.length < bigWaveCount && result.length < allStageStartZList.length) {
            result.push(allStageStartZList[result.length]);
        }
        return result;
    }

    private getExpandedStageMonsterTypeList() {
        const result: MonsterType[] = [];
        const list = this.monsterCreateQueue?.monsterCreateInfoList ?? [];
        for (let i = 0; i < list.length; i++) {
            const quest = list[i];
            if (!quest) {
                continue;
            }
            const loopCount = quest.loopMax == -1 ? 1 : Math.max(1, quest.loopMax);
            for (let loop = 0; loop < loopCount; loop++) {
                result.push(quest.monsterType);
            }
        }
        return result;
    }

    private getBigWaveStartStageIndexList(stageTypeList: MonsterType[], bigWaveCount: number) {
        const result: number[] = [];
        if (stageTypeList.length <= 0 || bigWaveCount <= 0) {
            return result;
        }

        result.push(0);
        for (let i = 0; i < stageTypeList.length - 1; i++) {
            if (stageTypeList[i] === MonsterType.ZombieBrother) {
                result.push(i);
            }
        }

        if (result.length > bigWaveCount) {
            result.length = bigWaveCount;
            return result;
        }

        if (result.length < bigWaveCount) {
            const chunkSize = Math.max(1, Math.ceil(stageTypeList.length / bigWaveCount));
            for (let i = 0; i < stageTypeList.length && result.length < bigWaveCount; i += chunkSize) {
                if (result.indexOf(i) === -1) {
                    result.push(i);
                }
            }
        }

        result.sort((a, b) => a - b);
        return result;
    }

    private buildStageToBigWaveIndex(stageCount: number, bigWaveCount: number) {
        const result: number[] = [];
        if (stageCount <= 0 || bigWaveCount <= 0) {
            return result;
        }

        const stageTypeList = this.getExpandedStageMonsterTypeList().slice(0, stageCount);
        const stageStartIndexList = this.getBigWaveStartStageIndexList(stageTypeList, bigWaveCount);
        if (stageStartIndexList.length > 0) {
            let waveIndex = 0;
            for (let i = 0; i < stageCount; i++) {
                while (waveIndex + 1 < stageStartIndexList.length && i >= stageStartIndexList[waveIndex + 1]) {
                    waveIndex++;
                }
                result.push(waveIndex);
            }
            return result;
        }

        const chunkSize = Math.max(1, Math.ceil(stageCount / bigWaveCount));
        for (let i = 0; i < stageCount; i++) {
            result.push(Math.min(bigWaveCount - 1, Math.floor(i / chunkSize)));
        }
        return result;
    }

    private resetWaveRoleToStageStart(role: PropArms, stageStartZ: number) {
        if (!role?.node) {
            return;
        }
        const targetZ = this.node.worldPositionZ + stageStartZ - this.getWaveRoleCollisionHalfZ(role) - this.waveRolePushGapInternal;
        const pos = role.node.worldPosition;
        role.node.setWorldPosition(pos.x, pos.y, targetZ);
    }

    private snapWaveRolesToCurrentWaveFront() {
        if (this._waveRoleNodes.length <= 0) {
            return;
        }

        for (let i = 0; i < this._waveRoleNodes.length; i++) {
            const role = this._waveRoleNodes[i];
            const frontMonster = this.getFrontMonsterByWave(i);
            if (!role?.node || !frontMonster?.node) {
                continue;
            }

            const roleHalfZ = this.getWaveRoleCollisionHalfZ(role);
            const monsterHalfZ = this.getMonsterCollisionHalfZ(frontMonster);
            const monsterFrontZ = frontMonster.node.worldPositionZ - monsterHalfZ;
            const targetZ = monsterFrontZ - this.waveRolePushGapInternal - roleHalfZ;
            const pos = role.node.worldPosition;
            role.node.setWorldPosition(pos.x, pos.y, targetZ);
        }
    }

    private bindWaveRolesToCreatePropBrand() {
        const scene = director.getScene();
        if (!scene || this._waveRoleNodes.length <= 0) {
            return;
        }

        const waveRoleNodeList = this._waveRoleNodes
            .map(role => role?.node)
            .filter((node): node is Node => !!node);

        const stack: Node[] = [scene];
        while (stack.length > 0) {
            const node = stack.pop();
            if (!node) {
                continue;
            }
            const createPropBrand = node.getComponent(CreatePropBrand);
            if (createPropBrand && createPropBrand.type === 0) {
                createPropBrand.setWaveRoleList(waveRoleNodeList);
            }
            for (let i = node.children.length - 1; i >= 0; i--) {
                stack.push(node.children[i]);
            }
        }
    }

    private spawnAllWavesAtStart() {
        const stageList = this.monsterCreateQueue?.monsterCreateInfoList ?? [];
        if (stageList.length <= 0) {
            return;
        }

        this._spawnAllWavesOnStart = true;
        this._hasInitialFilled = true;
        this._monsterList.length = 0;
        this._nextSpawnZ = 0;
        this._rowCount = 0;
        this.posIndex = 0;
        this._monsterBossCount = 0;
        this.bossDieCount = 0;
        this.monsterMatIns = [0, 0, 0];
        this._monsterWaveIndexMap = new WeakMap();

        const stageToBigWaveList = this.buildStageToBigWaveIndex(this.getConfiguredWaveCount(), Math.max(1, this.waveRoleCount));
        let stageCursor = 0;

        for (let i = 0; i < stageList.length; i++) {
            const quest = stageList[i];
            const loopCount = quest.loopMax == -1 ? 1 : Math.max(1, quest.loopMax);
            for (let loop = 0; loop < loopCount; loop++) {
                const waveIndex = stageToBigWaveList[Math.min(stageCursor, stageToBigWaveList.length - 1)] ?? 0;
                for (let count = 0; count < quest.monsterCountMax; count++) {
                    if (quest.monsterType == MonsterType.ZombieBrother) {
                        this.spawnBrother(waveIndex);
                    } else {
                        this.spawnBaby(waveIndex);
                    }
                }
                this._nextSpawnZ += quest.brotherExcludeZ;
                stageCursor++;
            }
            quest.init();
        }

        this.monsterCount = this._monsterList.length;
        this.snapWaveRolesToCurrentWaveFront();
    }

    _update(deltaTime: number) {
        if (!this._spawnAllWavesOnStart) {
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
                    EventManager.instance.emit(EventType.MONSTER_WAVE_STAGE);
                    quest.curLoopCount++;
                    this._nextSpawnZ += quest.brotherExcludeZ;
                    if (quest.loopMax != -1 && quest.curLoopCount == quest.loopMax) {
                        this.monsterCreateQueue.curIndex++;
                        this.monsterCreateQueue.curIndex = this.monsterCreateQueue.curIndex % this.monsterCreateQueue.monsterCreateInfoList.length;
                    }
                    quest.init();
                }

            }
        }
        if (!this._isRestoringWaveRolesAfterRebirth) {
            this.updateWaveRolePush();
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
                    const x = this.shouldLimitMonsterXAtZ(mz) || this.shouldLimitMonsterXAtZ(this.stage_1) ? this.clampMonsterX(mx) : mx;
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
            if (!this._isRestoringWaveRolesAfterRebirth) {
                this.clampMonsterBehindWaveRole(monster);
            }
            this.limitMonsterToMiddleLane(monster);
        }

        if (MonsterCreate.isStartMove) {
            this._nextSpawnZ -= deltaTime * this.monsterSpeed;
        }

    }

    private updateWaveRolePush() {
        if (this._waveRoleNodes.length <= 0 || this._waveStageStartZList.length <= 0) {
            return;
        }

        for (let i = 0; i < this._waveRoleNodes.length; i++) {
            const role = this._waveRoleNodes[i];
            if (!role || !role.node || !role.node.active || role.isDie) {
                continue;
            }
            const frontMonster = this.getFrontMonsterByWave(i);
            if (!frontMonster) {
                continue;
            }

            const roleHalfZ = this.getWaveRoleCollisionHalfZ(role);
            const monsterHalfZ = this.getMonsterCollisionHalfZ(frontMonster);
            const monsterFrontZ = frontMonster.node.worldPositionZ - monsterHalfZ;
            const targetZ = monsterFrontZ - this.waveRolePushGapInternal - roleHalfZ;
            if (Math.abs(targetZ - role.node.worldPositionZ) > 0.05) {
                const pos = role.node.worldPosition;
                role.node.setWorldPosition(pos.x, pos.y, targetZ);
            }
        }
    }

    private clampMonsterBehindWaveRole(monster: MonsterBattleTaerget) {
        const waveIndex = this.getWaveIndexByMonster(monster);
        if (waveIndex < 0 || waveIndex >= this._waveRoleNodes.length) {
            return;
        }
        const role = this._waveRoleNodes[waveIndex];
        if (!role || !role.node || !role.node.active || role.isDie) {
            return;
        }

        const roleHalfZ = this.getWaveRoleCollisionHalfZ(role);
        const monsterHalfZ = this.getMonsterCollisionHalfZ(monster);
        const limitZ = role.node.worldPositionZ + roleHalfZ + monsterHalfZ + this.waveRolePushGapInternal;
        if (monster.node.worldPositionZ < limitZ) {
            monster.node.setWorldPosition(monster.node.worldPositionX, monster.node.worldPositionY, limitZ);
        }
        if (monster.move?.pos && monster.move.pos.z < limitZ) {
            monster.move.pos.z = limitZ;
        }
    }

    private getFrontMonsterByWave(waveIndex: number) {
        let frontMonster: MonsterBattleTaerget = null;

        for (let i = 0; i < this._monsterList.length; i++) {
            const monster = this._monsterList[i];
            if (!monster || !monster.node || !monster.node.active || monster.isDie) {
                continue;
            }
            if (this.getWaveIndexByMonster(monster) !== waveIndex) {
                continue;
            }
            if (!frontMonster || monster.node.worldPositionZ < frontMonster.node.worldPositionZ) {
                frontMonster = monster;
            }
        }

        return frontMonster;
    }

    private getWaveIndexByMonster(monster: MonsterBattleTaerget) {
        if (!monster) {
            return -1;
        }
        const bindWaveIndex = this._monsterWaveIndexMap.get(monster);
        if (typeof bindWaveIndex === 'number') {
            return bindWaveIndex;
        }
        return this.getWaveIndexByMonsterZ(monster.node.worldPositionZ);
    }

    private getWaveRoleCollisionHalfZ(role: PropArms) {
        return role?.getBlockCollisionHalfZ?.() ?? Math.max(0.65, role?.collisionHalfZ ?? 0.65);
    }

    private getMonsterCollisionHalfZ(monster: MonsterBattleTaerget) {
        return Math.max(0, monster?.collisionHalfZ ?? 0);
    }

    private getWaveIndexByMonsterZ(z: number) {
        if (this._waveStageStartZList.length <= 0) {
            return -1;
        }

        for (let i = 0; i < this._waveStageStartZList.length; i++) {
            const currentStart = this._waveStageStartZList[i];
            const nextStart = i + 1 < this._waveStageStartZList.length ? this._waveStageStartZList[i + 1] : Number.POSITIVE_INFINITY;
            if (z >= currentStart && z < nextStart) {
                return i;
            }
        }
        return z < this._waveStageStartZList[0] ? 0 : this._waveStageStartZList.length - 1;
    }

    public getWaveStageStartZList(stageCount: number): number[] {
        const result: number[] = [];
        const stages = this.monsterCreateQueue.monsterCreateInfoList;
        if (!stages || stages.length <= 0 || stageCount <= 0) {
            return result;
        }

        let nextSpawnZ = 0;
        let rowCount = 0;

        for (let i = 0; i < stages.length && result.length < stageCount; i++) {
            const quest = stages[i];
            const loopMax = quest.loopMax > 0 ? quest.loopMax : 1;
            const loopCount = quest.loopMax == -1 ? 1 : loopMax;

            for (let loop = 0; loop < loopCount && result.length < stageCount; loop++) {
                result.push(nextSpawnZ);

                if (quest.monsterType == MonsterType.ZombieBrother) {
                    nextSpawnZ += this.brotherExcludeZ;
                    nextSpawnZ += this.brotherExcludeZ;
                } else {
                    for (let count = 0; count < quest.monsterCountMax; count++) {
                        rowCount++;
                        if (rowCount == this.rowCount) {
                            nextSpawnZ += this.layerGapZ;
                            rowCount = 0;
                        }
                    }
                }

                nextSpawnZ += quest.brotherExcludeZ;
            }
        }

        return result;
    }

    /** 生成ZombieBrother，放在排斥区域的中间 */
    private spawnBrother(waveIndex: number = -1) {
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
        if (waveIndex >= 0) {
            this._monsterWaveIndexMap.set(monster, waveIndex);
        }
        // this._brotherZPositions.push(z);
        this._monsterBossCount++;
    }

    /** 生成ZombieBaby，自动避开ZombieBrother的排斥区域 */
    private spawnBaby(waveIndex: number = -1) {
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
        const rawX = (Math.random() - 0.5) * this.offX + (this.posIndex - (this.rowCount - 1) / 2) * this.offX;
        const x = this.shouldLimitMonsterXAtZ(z) ? this.clampMonsterX(rawX) : rawX;

        this.posIndex = (this.posIndex + 1) % this.rowCount;

        monster.move.moveMod = MoveModEnum.PosMove;

        monster.node.setPosition(x, 0, z);

        tempV3.set(monster.node.worldPosition);

        tempV3.z = this.stage_0;

        monster.move.pos = tempV3;
        monster.initX = x;
        if (waveIndex >= 0) {
            this._monsterWaveIndexMap.set(monster, waveIndex);
        }
        this._rowCount++;

        if (this._rowCount == this.rowCount) {
            this._nextSpawnZ += this.layerGapZ;
            this._rowCount = 0;
        }

    }

    private shouldLimitMonsterXAtZ(z: number): boolean {
        return z >= this.sideSlabLimitMinZ && z <= this.sideSlabLimitMaxZ;
    }

    public getFrontMonsterWorldZ(defaultZ: number = this.stage_0): number {
        let frontZ = Number.POSITIVE_INFINITY;
        for (let i = 0; i < this._monsterList.length; i++) {
            const monster = this._monsterList[i];
            if (!monster || !monster.node || !monster.node.active || monster.isDie) {
                continue;
            }
            if (monster.node.worldPositionZ < frontZ) {
                frontZ = monster.node.worldPositionZ;
            }
        }
        return Number.isFinite(frontZ) ? frontZ : defaultZ;
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
        if (!this.shouldLimitMonsterXAtZ(monster.node.worldPositionZ)) {
            return;
        }
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
        this._isRestoringWaveRolesAfterRebirth = true;
        this.hideWaveRolesDuringRebirth();
        for (let i = 0; i < this._monsterList.length; i++) {
            const monster = this._monsterList[i];
            monster.move.autoMove = false;
            if (monster.attackTarget) {
                const z = -26.3 + Math.abs(-26.3 - monster.node.z) + 10 + Math.random() * 5;
                const resetX = this.shouldLimitMonsterXAtZ(-26.3) ? this.clampMonsterX(monster.initX) : monster.initX;
                tween(monster.node).to(0.05, { x: resetX, z: -26.3 }).to(0.35, { z: z }).call(() => {
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
        this.scheduleOnce(() => {
            this.restoreWaveRolesAfterRebirth();
            for (let i = 0; i < this._monsterList.length; i++) {
                const m = this._monsterList[i];
                if (m && !m.isDie && m.node?.active) {
                    BulletMonsterCollisionManager.instance.unregisterTarget(m);
                    BulletMonsterCollisionManager.instance.registerTarget(m);
                }
            }
        }, 0.45);
        // this.scheduleOnce(() => {
        //     this.isFlowIN = false;
        // }, 0.4);
    }

    private hideWaveRolesDuringRebirth() {
        if (!this._waveRoleNodes.length) {
            return;
        }
        for (let i = 0; i < this._waveRoleNodes.length; i++) {
            const role = this._waveRoleNodes[i];
            if (!role?.node) {
                continue;
            }
            role.node.active = false;
        }
    }

    private restoreWaveRolesAfterRebirth() {
        if (!this._waveRoleNodes.length) {
            this._isRestoringWaveRolesAfterRebirth = false;
            return;
        }
        for (let i = 0; i < this._waveRoleNodes.length; i++) {
            const role = this._waveRoleNodes[i];
            if (!role || !role.node) {
                continue;
            }
            if (role.isDie) {
                role.node.active = false;
                continue;
            }
            // hideWaveRolesDuringRebirth 设 inactive 后，
            // BulletMonsterCollisionManager.update 会把 !node.active 的目标移除，
            // 所以活着的 Role 也需要重新注册碰撞
            BulletMonsterCollisionManager.instance.registerTarget(role);
            role.node.active = true;
            const frontMonster = this.getFrontMonsterByWave(i);
            if (!frontMonster || !frontMonster.node) {
                continue;
            }
            const roleHalfZ = this.getWaveRoleCollisionHalfZ(role);
            const monsterHalfZ = this.getMonsterCollisionHalfZ(frontMonster);
            const targetZ = frontMonster.node.worldPositionZ - monsterHalfZ - this.waveRolePushGapInternal - roleHalfZ;
            const pos = role.node.worldPosition;
            role.node.setWorldPosition(pos.x, pos.y, targetZ);
        }
        this._isRestoringWaveRolesAfterRebirth = false;
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

                const skillEndX = px + fx * 8;
                endPos.x = this.shouldLimitMonsterXAtZ(pos.z) ? this.clampMonsterX(skillEndX) : skillEndX;
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


