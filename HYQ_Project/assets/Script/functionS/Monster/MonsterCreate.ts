import { _decorator, Camera, CCBoolean, CCFloat, CCInteger, Component, director, instantiate, Node, Pool, screen, tween, Vec3 } from 'cc';
import PoolManager from '../../Base/PoolManager';
import { EffectEnum, EventType, MonsterType, PoolEnum, PrefabsEnum } from '../../Base/EnumList';
import { MonsterBattleTaerget } from './MonsterBattleTaerget';
import { PrefabsManager } from '../../Base/PrefabsManager';
import { MoveModEnum } from '../../Base/MoveRot/MoveDrive';
import { Player } from '../Player/Player';
import { Role } from '../Player/Role';
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
import { PropLalianGate } from '../Other/PropLalianGate';
import { FbxManager } from '../SkAnim/FbxManager';
const { ccclass, property } = _decorator;
const tempV3 = new Vec3();

@ccclass("MonsterCreateInfo")
class MonsterCreateInfo {

    @property(CCInteger)
    public loopMax: number = 1;

    @property({ type: MonsterType })
    public monsterType: MonsterType = MonsterType.ZombieBaby_0;

    @property({ type: CCBoolean, displayName: '混合0/1怪物', tooltip: '开启后，这一波普通怪会在 ZombieBaby_0 和 ZombieBaby_1 之间混合生成。Boss 波不受影响。' })
    public mixBaby01: boolean = false;

    @property({ type: CCFloat, displayName: '1号怪物占比(0-1)', tooltip: '混合0/1怪物开启时，生成 ZombieBaby_1 的概率。0=全0号，1=全1号，0.5=大致各半。', visible(this: MonsterCreateInfo) { return this.mixBaby01; } })
    public baby1Ratio: number = 0.5;

    @property(CCInteger)
    public monsterCountMax: number = 50;

    @property({ type: CCInteger, displayName: '实际生成数量(0=默认)', tooltip: '这一波实际生成的怪物数量。填 0 时沿用“每行生成的怪物数量”。' })
    public actualSpawnCount: number = 0;

    @property({ type: CCInteger, displayName: 'Z范围基准数量(0=默认)', tooltip: '这一波用于计算 Z 轴铺开范围的基准数量。大于实际生成数量时，怪物会在同样 Z 范围内变得更稀疏。' })
    public zRangeCountBase: number = 0;

    @property({ type: CCFloat, displayName: '怪物生命(0=默认)', tooltip: '该配置生成的怪物生命值。填 0 时使用怪物预制体默认生命和原有难度倍率。' })
    public monsterHp: number = 0;

    @property({ type: CCFloat, displayName: '难度倍率(0=默认)', tooltip: '该配置生成的怪物难度倍率。填 0 时使用原有默认倍率。怪物生命大于 0 时，优先使用固定生命。' })
    public difficulty: number = 0;

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
    @property({ type: CCInteger, displayName: '每帧最大生成数', tooltip: '初始生成和后续按视口补充时，每帧最多创建的怪物数量。' })
    public maxSpawnPerFrame: number = 5;
    @property({ type: CCFloat, displayName: '视口外触发距离', tooltip: '当前最后排怪物进入“实际视口最远位置 + 此距离”后，开始补充下一段怪物。' })
    public viewportSpawnTriggerDistance: number = 10;
    @property({ type: CCFloat, displayName: '视口外补充距离', tooltip: '每次分帧补充到“实际视口最远位置 + 此距离”后停止，建议设置为 50-60。' })
    public viewportSpawnBufferDistance: number = 55;
    @property(MonsterCreateQueue)
    public monsterCreateQueue: MonsterCreateQueue = new MonsterCreateQueue();



    @property({ tooltip: 'ZombieBrother前后Z轴排斥范围，该范围内不能生成ZombieBaby' })
    public brotherExcludeZ: number = 2;

    @property({ displayName: '生成横向散布半宽(非限位)', tooltip: '只控制怪物生成队列的左右散布宽度，不决定是否允许进入左右奖励区。' })
    public disX: number = 2.5;

    @property(CCFloat)
    public monsterSpeed: number = 2;

    @property({ type: CCFloat, displayName: '红框中路限位半宽', tooltip: '怪物在红框/非蓝框区域会被限制在 -该值 到 +该值 之间，左右两边同步生效。' })
    public middleLaneHalfX: number = 2;

    /** 每列间距，由 disX*2/rowCount 计算得出 */
    private offX: number = 0;

    @property({ tooltip: '每行生成的怪物数量' })
    public rowCount: number = 8;
    private _rowCount: number = 0;

    @property({ tooltip: '怪物Z轴每层间距' })
    public layerGapZ: number = 0.8;

    @property({ type: CCFloat, displayName: '出生X随机扰动', tooltip: '怪物出生时在当前列位置基础上额外随机偏移，减少队列感。' })
    public spawnRandomX: number = 0.28;

    @property({ type: CCFloat, displayName: '出生Z随机扰动', tooltip: '怪物出生时在当前层位置基础上额外随机前后偏移，减少横排整齐感。' })
    public spawnRandomZ: number = 0.25;

    @property({ type: CCFloat, displayName: '出生缩放随机', tooltip: '怪物出生时随机缩放幅度，0.08 表示 0.92-1.08。' })
    public spawnScaleRandom: number = 0.06;

    @property({ type: CCFloat, displayName: '出生朝向随机', tooltip: '怪物出生时 Y 轴随机旋转角度，轻微打散朝向。' })
    public spawnYawRandom: number = 8;

    @property({ type: Vec3, displayName: '怪物出生整体偏移', tooltip: '整体调整怪物初始生成位置，主要调 Z 可前后移动到指定红线位置。' })
    public spawnPositionOffset: Vec3 = new Vec3();

    @property({ type: CCFloat, displayName: '怪物死亡抛起基础高度', tooltip: '怪物被击飞死亡时的基础抛起高度，数值越大飞得越高。' })
    public monsterDeathThrowBaseHeight: number = 0.5;

    @property({ type: CCFloat, displayName: '怪物死亡抛起随机高度', tooltip: '怪物被击飞死亡时额外随机增加的抛起高度，0 表示不随机。' })
    public monsterDeathThrowRandomHeight: number = 0.35;

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
    private _spawnStageIndex: number = 0;
    private _spawnLoopIndex: number = 0;
    private _spawnWaveIndex: number = 0;
    private _spawnSlotIndex: number = 0;
    private _spawnSparseSlotSet: Set<number> = null;
    private _isViewportSpawnFilling: boolean = false;
    private _isConfiguredSpawnFinished: boolean = false;
    private _cachedViewportFarWorldZ: number = Number.NaN;
    private _viewportFarRefreshTime: number = 0;
    private _formationTravelDistance: number = 0;
    private _viewportProbeWorldPos: Vec3 = new Vec3();
    @property({ type: CCInteger, displayName: '油桶大波次数量', tooltip: '兼容旧配置：当“油桶对应波次索引”为空时，使用这里的数量从第 0 波开始顺序生成油桶。' })
    public waveRoleCount: number = 3;
    @property({ type: [CCInteger], displayName: '油桶所在怪物波次索引(0=第0波)', tooltip: '数组内每一项生成一个油桶。填 0 表示放在第 0 波怪物前面，填 1 表示放在第 1 波怪物前面。' })
    public waveRoleStageIndexList: number[] = [0, 2, 5];
    private _waveRoleNodes: PropArms[] = [];
    private _waveRoleAlignedToFront: boolean[] = [];
    private _stageStartZList: number[] = [];
    private _waveStageStartZList: number[] = [];
    private _waveStageIndexList: number[] = [];
    private _monsterWaveIndexMap: WeakMap<MonsterBattleTaerget, number> = new WeakMap();
    private _monsterRebirthOrderMap: WeakMap<MonsterBattleTaerget, number> = new WeakMap();
    private _monsterSpawnLocalXMap: WeakMap<MonsterBattleTaerget, number> = new WeakMap();
    private _monsterSpawnLocalZMap: WeakMap<MonsterBattleTaerget, number> = new WeakMap();
    private _monsterRebirthOffsetMap: WeakMap<MonsterBattleTaerget, Vec3> = new WeakMap();
    private _rebirthWaveInitialMinZList: number[] = [];
    private _rebirthWaveInitialMaxZList: number[] = [];
    private _monsterRebirthOrderIndex: number = 0;
    @property({ type: CCFloat, displayName: '油桶怪物预留间距', tooltip: '创建怪物和初始化油桶时，油桶碰撞盒与怪物碰撞盒之间额外保留的 Z 轴距离。数值越大越不容易视觉穿模。' })
    public waveRoleMonsterGap: number = 0.02;
    @property({ type: CCFloat, displayName: '油桶怪物半深下限' })
    public waveRoleMonsterHalfZMin: number = 0.8;
    @property({ type: CCFloat, displayName: '油桶Boss半深下限' })
    public waveRoleBossHalfZMin: number = 2;
    @property({ type: CCFloat, displayName: '再来一次前排后退补偿' })
    public rebirthMonsterFrontRetreatZ: number = 2.5;
    @property({ type: CCFloat, displayName: '再来一次波次追加间距' })
    public rebirthMonsterWaveExtraGapZ: number = 0;
    @property({ type: CCFloat, displayName: '再来一次站位随机X' })
    public rebirthMonsterRandomX: number = 0.15;
    @property({ type: CCFloat, displayName: '再来一次站位随机Z' })
    public rebirthMonsterRandomZ: number = 0.25;
    @property({ type: CCBoolean, displayName: '再来一次距离日志' })
    public rebirthMonsterDistanceLog: boolean = false;
    private readonly waveRolePlayerHalfX: number = 0.35;
    private readonly waveRolePlayerHalfZ: number = 0.35;
    private _isRestoringWaveRolesAfterRebirth: boolean = false;
    private lalianLimitRanges: { minZ: number, maxZ: number }[] = [];
    private tempLalianRange: Vec3 = new Vec3();

    protected onLoad(): void {
        MonsterCreate.instance = this;
        this.prepareWaveRoles();
    }

    start() {
        this.offX = this.disX * 2 / this.rowCount;
        EventManager.instance.on(EventType.PLAYER_RESURRECTION, this.TimeFlowsBackWard, this);
        EventManager.instance.on(EventType.MONSTER_SKILL_XRD, this.skillXRMonster, this);
        this.refreshLalianLimitRange();
        this.initializeViewportDrivenSpawn();
        // this.scheduleOnce(() => {
        //     this.skillXRMonster(2, 2, 2);
        // }, 2);
    }
    private monsterMatIns: number[] = [0, 0, 0];

    private get waveRolePushGap() {
        return Math.max(0, this.waveRoleMonsterGap);
    }

    private prepareWaveRoles() {
        if (this._waveRoleNodes.length > 0) {
            return;
        }

        const template = this.findWaveRoleTemplate();
        if (!template || !template.node) {
            return;
        }

        const totalStageCount = this.getConfiguredWaveCount();
        if (totalStageCount <= 0) {
            return;
        }

        const allStageStartZList = this.getWaveStageStartZList(totalStageCount);
        const stageIndexList = this.getWaveRoleStageIndexList(totalStageCount);
        if (stageIndexList.length <= 0) {
            return;
        }
        this._stageStartZList = allStageStartZList.slice();
        const stageZList = stageIndexList.map((stageIndex) => allStageStartZList[stageIndex]);
        this._waveStageIndexList = stageIndexList.slice();
        this._waveStageStartZList = stageZList.slice();
        const parent = template.node.parent;
        if (!parent) {
            return;
        }

        const roleList: PropArms[] = [template];
        for (let i = 1; i < stageZList.length; i++) {
            const clone = this.createWaveRoleClone(template, parent);
            if (clone) {
                roleList.push(clone);
            }
        }

        this._waveRoleNodes.length = 0;
        this._waveRoleAlignedToFront.length = 0;
        for (let i = 0; i < roleList.length; i++) {
            const role = roleList[i];
            this.configureWaveRoleByStage(role, i);
            role.setFixedStage(Math.min(i, role.armsInfoList.length - 1));
            role.node.active = true;
            if (typeof stageZList[i] === 'number') {
                this.resetWaveRoleToStageStart(role, stageZList[i]);
            }
            this._waveRoleNodes.push(role);
            this._waveRoleAlignedToFront.push(false);
        }

        this.bindWaveRolesToCreatePropBrand();
    }

    private createWaveRoleClone(template: PropArms, parent: Node) {
        const cloneNode = instantiate(template.node);
        parent.addChild(cloneNode);
        return cloneNode.getComponent(PropArms);
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
            if (arms && arms.armsInfoList.length > 1 && this.findNodeByName(node, 'Role_0')) {
                return arms;
            }
            for (let i = node.children.length - 1; i >= 0; i--) {
                stack.push(node.children[i]);
            }
        }
        return null;
    }

    private configureWaveRoleByStage(role: PropArms, stageIndex: number) {
        const roleRoot = this.findWaveRoleRoot(role);
        if (!roleRoot) {
            return;
        }

        const stageAnchor = this.findWaveRoleStageAnchor(roleRoot, stageIndex);
        if (!stageAnchor) {
            return;
        }

        this.applyWaveRoleStageSelection(roleRoot, stageAnchor);
        const bottomBaseRef = this.findWaveRoleBottomBaseReference(stageAnchor);
        const fbx = this.resolveWaveRoleFbx(stageAnchor);

        role.bindFixedStageRuntime(stageIndex, stageAnchor, fbx);
        role.applyRoleLayoutReference(bottomBaseRef, stageAnchor);
    }

    private findWaveRoleRoot(role: PropArms) {
        if (!role?.node) {
            return null;
        }
        return role.node;
    }

    private applyWaveRoleStageSelection(roleRoot: Node, activeStage: Node) {
        roleRoot.active = true;
        for (let i = 0; i < roleRoot.children.length; i++) {
            const child = roleRoot.children[i];
            if (!child) {
                continue;
            }
            if (/^Role_\d+$/i.test(child.name)) {
                child.active = child === activeStage;
            }
        }
    }

    private resolveWaveRoleFbx(visualRoot: Node | null) {
        if (!visualRoot) {
            return null;
        }
        const role = visualRoot.getComponent(Role);
        if (role?.fbxManager) {
            return role.fbxManager;
        }
        return visualRoot.getComponentInChildren(FbxManager);
    }

    private findWaveRoleStageAnchor(roleRoot: Node, stageIndex: number) {
        const exact = this.findNodeByName(roleRoot, `Role_${stageIndex}`);
        if (exact) {
            return exact;
        }
        return this.findNodeByName(roleRoot, 'Role_0');
    }

    private findWaveRoleBottomBaseReference(roleRoot: Node) {
        if (!roleRoot) {
            return null;
        }
        const stack: Node[] = [roleRoot];
        while (stack.length > 0) {
            const node = stack.pop();
            if (!node) {
                continue;
            }
            const name = node.name.toLowerCase();
            if (name.indexOf('youtong') >= 0 || name.indexOf('oil') >= 0) {
                return node;
            }
            for (let i = node.children.length - 1; i >= 0; i--) {
                stack.push(node.children[i]);
            }
        }
        return null;
    }

    private findNodeByName(root: Node, name: string): Node | null {
        if (!root) {
            return null;
        }
        if (root.name === name) {
            return root;
        }
        for (let i = 0; i < root.children.length; i++) {
            const result = this.findNodeByName(root.children[i], name);
            if (result) {
                return result;
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

    private getWaveRoleStageIndexList(stageCount: number) {
        const result: number[] = [];
        if (stageCount <= 0) {
            return result;
        }

        const source = this.waveRoleStageIndexList ?? [];
        if (source.length > 0) {
            for (let i = 0; i < source.length; i++) {
                const rawIndex = source[i];
                if (typeof rawIndex !== 'number' || isNaN(rawIndex)) {
                    continue;
                }
                const stageIndex = Math.min(stageCount - 1, Math.max(0, Math.floor(rawIndex)));
                if (result.indexOf(stageIndex) >= 0) {
                    continue;
                }
                result.push(stageIndex);
            }
            result.sort((a, b) => a - b);
            return result;
        }

        const targetCount = Math.min(stageCount, Math.max(0, Math.floor(this.waveRoleCount)));
        for (let i = 0; i < targetCount; i++) {
            result.push(i);
        }

        return result;
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
        const targetCenterZ = this.node.worldPositionZ + stageStartZ - this.getWaveRoleCollisionHalfZ(role) - this.waveRolePushGap;
        this.setCollisionCenterWorldZ(role, targetCenterZ);
    }

    private snapWaveRolesToCurrentWaveFront() {
        if (this._waveRoleNodes.length <= 0) {
            return;
        }

        for (let i = 0; i < this._waveRoleNodes.length; i++) {
            if (this._waveRoleAlignedToFront[i]) {
                continue;
            }
            const role = this._waveRoleNodes[i];
            const targetWaveIndex = this._waveStageIndexList[i] ?? i;
            const frontMonster = this.getFrontMonsterByWave(targetWaveIndex);
            if (!role?.node || !frontMonster?.node) {
                continue;
            }

            const roleHalfZ = this.getWaveRoleCollisionHalfZ(role);
            const monsterHalfZ = this.getMonsterCollisionHalfZ(frontMonster);
            const monsterCenterZ = frontMonster.getCollisionWorldPosition(tempV3).z;
            const targetCenterZ = monsterCenterZ - monsterHalfZ - this.waveRolePushGap - roleHalfZ;
            this.setCollisionCenterWorldZ(role, targetCenterZ);
            this.clampMonstersBehindWaveRole(i);
            this._waveRoleAlignedToFront[i] = true;
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

    private initializeViewportDrivenSpawn() {
        const stageList = this.monsterCreateQueue?.monsterCreateInfoList ?? [];
        if (stageList.length <= 0) {
            return;
        }

        this._monsterList.length = 0;
        this._nextSpawnZ = 0;
        this._rowCount = 0;
        this.posIndex = 0;
        this._monsterBossCount = 0;
        this.bossDieCount = 0;
        this.monsterMatIns = [0, 0, 0];
        this._monsterWaveIndexMap = new WeakMap();
        this._monsterRebirthOrderMap = new WeakMap();
        this._monsterSpawnLocalXMap = new WeakMap();
        this._monsterSpawnLocalZMap = new WeakMap();
        this._monsterRebirthOffsetMap = new WeakMap();
        this._rebirthWaveInitialMinZList.length = 0;
        this._rebirthWaveInitialMaxZList.length = 0;
        this._monsterRebirthOrderIndex = 0;
        this._spawnStageIndex = 0;
        this._spawnLoopIndex = 0;
        this._spawnWaveIndex = 0;
        this._spawnSlotIndex = 0;
        this._spawnSparseSlotSet = null;
        this._isViewportSpawnFilling = true;
        this._isConfiguredSpawnFinished = false;
        this._cachedViewportFarWorldZ = Number.NaN;
        this._viewportFarRefreshTime = 0;
        this._formationTravelDistance = 0;
        this.monsterCreateQueue.curIndex = 0;

        let configuredMonsterCount = 0;
        for (let i = 0; i < stageList.length; i++) {
            const quest = stageList[i];
            const loopCount = quest.loopMax == -1 ? 1 : Math.max(1, quest.loopMax);
            configuredMonsterCount += this.getQuestSpawnCount(quest) * loopCount;
            quest.init();
        }
        this.monsterCount = configuredMonsterCount;
    }

    private updateViewportDrivenSpawn(deltaTime: number) {
        if (this._isConfiguredSpawnFinished || this._isRestoringWaveRolesAfterRebirth) {
            return;
        }

        const viewportFarWorldZ = this.getViewportFarWorldZ(deltaTime);
        if (!Number.isFinite(viewportFarWorldZ)) {
            return;
        }

        const triggerDistance = Math.max(0, this.viewportSpawnTriggerDistance);
        if (!this._isViewportSpawnFilling) {
            const rearMonsterWorldZ = this.getRearMonsterWorldZ();
            if (rearMonsterWorldZ > viewportFarWorldZ + triggerDistance) {
                return;
            }
            this._isViewportSpawnFilling = true;
        }

        const bufferDistance = Math.max(triggerDistance, this.viewportSpawnBufferDistance);
        const stopWorldZ = viewportFarWorldZ + bufferDistance;
        const maxPerFrame = Math.max(1, Math.floor(this.maxSpawnPerFrame));
        let spawnedCount = 0;
        let processedSlotCount = 0;

        while (spawnedCount < maxPerFrame && processedSlotCount < 1024) {
            const quest = this.prepareNextConfiguredSpawnSlot();
            if (!quest) {
                this.finishViewportSpawnBatch(true);
                return;
            }
            if (this.getNextConfiguredSpawnWorldZ(quest) > stopWorldZ) {
                this.finishViewportSpawnBatch(false);
                return;
            }

            if (this.spawnNextConfiguredSlot(quest)) {
                spawnedCount++;
            }
            processedSlotCount++;
        }
    }

    private prepareNextConfiguredSpawnSlot(): MonsterCreateInfo | null {
        const stageList = this.monsterCreateQueue?.monsterCreateInfoList ?? [];
        while (this._spawnStageIndex < stageList.length) {
            const quest = stageList[this._spawnStageIndex];
            const loopCount = quest.loopMax == -1 ? 1 : Math.max(1, quest.loopMax);
            if (this._spawnLoopIndex >= loopCount) {
                quest.init();
                this._spawnStageIndex++;
                this._spawnLoopIndex = 0;
                continue;
            }

            const spawnCount = this.getQuestSpawnCount(quest);
            const rangeCount = this.getQuestRangeCount(quest);
            const isSparseWave = quest.monsterType != MonsterType.ZombieBrother && spawnCount < rangeCount;
            const slotCount = isSparseWave ? rangeCount : spawnCount;
            if (this._spawnSlotIndex < slotCount) {
                if (isSparseWave && !this._spawnSparseSlotSet) {
                    this._spawnSparseSlotSet = this.buildSparseWaveSpawnSlotSet(spawnCount, rangeCount);
                }
                return quest;
            }

            this.completeCurrentConfiguredWave(quest);
        }

        this._isConfiguredSpawnFinished = true;
        return null;
    }

    private getNextConfiguredSpawnWorldZ(quest: MonsterCreateInfo): number {
        const nextSpawnZ = quest.monsterType == MonsterType.ZombieBrother
            ? this._nextSpawnZ + this.brotherExcludeZ
            : this._nextSpawnZ;
        return this.getSpawnWorldZ(nextSpawnZ);
    }

    private spawnNextConfiguredSlot(quest: MonsterCreateInfo): boolean {
        const spawnCount = this.getQuestSpawnCount(quest);
        const rangeCount = this.getQuestRangeCount(quest);
        const isSparseWave = quest.monsterType != MonsterType.ZombieBrother && spawnCount < rangeCount;
        let didSpawn = false;

        if (quest.monsterType == MonsterType.ZombieBrother) {
            this.spawnBrother(quest, this._spawnWaveIndex);
            didSpawn = true;
        } else if (isSparseWave) {
            if (this._spawnSparseSlotSet?.has(this._spawnSlotIndex)) {
                this._nextSpawnZ = this.spawnBabyAtCursor(
                    quest,
                    this._spawnWaveIndex,
                    this._nextSpawnZ,
                    this.posIndex,
                );
                didSpawn = true;
            }
            this.posIndex = (this.posIndex + 1) % this.rowCount;
            this._rowCount++;
            if (this._rowCount == this.rowCount) {
                this._nextSpawnZ += this.layerGapZ;
                this._rowCount = 0;
            }
        } else {
            this.spawnBaby(quest, this._spawnWaveIndex);
            didSpawn = true;
        }

        this._spawnSlotIndex++;
        const slotCount = isSparseWave ? rangeCount : spawnCount;
        if (this._spawnSlotIndex >= slotCount) {
            this.completeCurrentConfiguredWave(quest);
        }
        return didSpawn;
    }

    private completeCurrentConfiguredWave(quest: MonsterCreateInfo) {
        this._nextSpawnZ += quest.brotherExcludeZ;
        this._spawnWaveIndex++;
        this._spawnLoopIndex++;
        this._spawnSlotIndex = 0;
        this._spawnSparseSlotSet = null;

        const loopCount = quest.loopMax == -1 ? 1 : Math.max(1, quest.loopMax);
        if (this._spawnLoopIndex >= loopCount) {
            quest.init();
            this._spawnStageIndex++;
            this._spawnLoopIndex = 0;
        }
    }

    private finishViewportSpawnBatch(isFinished: boolean) {
        this._isViewportSpawnFilling = false;
        if (isFinished) {
            this._isConfiguredSpawnFinished = true;
        }
        this.snapWaveRolesToCurrentWaveFront();
    }

    private getRearMonsterWorldZ(): number {
        let rearZ = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < this._monsterList.length; i++) {
            const monster = this._monsterList[i];
            if (!monster || !monster.node || !monster.node.active || monster.isDie) {
                continue;
            }
            rearZ = Math.max(rearZ, monster.node.worldPositionZ);
        }
        return rearZ;
    }

    private getViewportFarWorldZ(deltaTime: number): number {
        this._viewportFarRefreshTime -= Math.max(0, deltaTime);
        if (this._viewportFarRefreshTime > 0 && Number.isFinite(this._cachedViewportFarWorldZ)) {
            return this._cachedViewportFarWorldZ;
        }

        const camera = CameraMove.instance?.camera;
        if (!camera?.node) {
            return Number.NaN;
        }

        const windowSize = screen.windowSize;
        const viewportTopY = (camera.rect.y + camera.rect.height) * windowSize.height;
        const cameraZ = camera.node.worldPositionZ;
        const maxProbeZ = cameraZ + Math.max(10, camera.far * 0.95);
        const worldX = camera.node.worldPositionX;
        const worldY = this.node.worldPositionY + this.getSpawnY();
        let lowZ = cameraZ + Math.max(1, camera.near);
        let highZ = Math.min(maxProbeZ, Math.max(lowZ + 32, Number.isFinite(this._cachedViewportFarWorldZ)
            ? this._cachedViewportFarWorldZ + 16
            : lowZ + 32));

        while (highZ < maxProbeZ && this.getViewportProbeScreenY(camera, worldX, worldY, highZ) <= viewportTopY) {
            lowZ = highZ;
            highZ = Math.min(maxProbeZ, cameraZ + (highZ - cameraZ) * 2);
        }

        if (this.getViewportProbeScreenY(camera, worldX, worldY, highZ) <= viewportTopY) {
            this._cachedViewportFarWorldZ = highZ;
        } else {
            for (let i = 0; i < 14; i++) {
                const middleZ = (lowZ + highZ) * 0.5;
                if (this.getViewportProbeScreenY(camera, worldX, worldY, middleZ) <= viewportTopY) {
                    lowZ = middleZ;
                } else {
                    highZ = middleZ;
                }
            }
            this._cachedViewportFarWorldZ = lowZ;
        }
        this._viewportFarRefreshTime = 0.25;
        return this._cachedViewportFarWorldZ;
    }

    private getViewportProbeScreenY(camera: Camera, worldX: number, worldY: number, worldZ: number): number {
        this._viewportProbeWorldPos.set(worldX, worldY, worldZ);
        return camera.worldToScreen(this._viewportProbeWorldPos).y;
    }

    _update(deltaTime: number) {
        this.updateViewportDrivenSpawn(deltaTime);
        if (!this._isRestoringWaveRolesAfterRebirth) {
            this.updateWaveRoleForwardMove(deltaTime);
            this.checkWaveRolePlayerCollision();
        }
        for (let i = this._monsterList.length - 1; i >= 0; i--) {

            const monster = this._monsterList[i];
            if (monster?.move) {
                monster.move.speed = Math.max(0, this.monsterSpeed);
            }

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
                    tempV3.x = this.getMonsterMoveTargetX(monster, mz);
                    tempV3.y = 0;
                    tempV3.z = this.stage_1;
                    monster.move.pos = tempV3;

                } else if (mz >= this.stage_1) {
                    if (!monster.attackTarget || !monster.attackTarget.active) {
                        if (!Player.instance || Player.instance.isDie || Player.instance.roleList.length <= 0) {
                            continue;
                        }
                        if (!this.tryAssignMonsterAttackTarget(monster)) {
                            continue;
                        }
                        // if (monster.monsterType == MonsterType.ZombieBaby_0) {
                        //     EventManager.instance.emit(EventType.Monster_Attack_Player_ADD, monster);
                        // }
                    }
                }
            }
            this.syncMonsterMoveTargetX(monster);
            if (!this._isRestoringWaveRolesAfterRebirth) {
                this.clampMonsterBehindWaveRole(monster);
            }
            this.limitMonsterToMiddleLane(monster);
        }

        if (MonsterCreate.isStartMove) {
            const moveDistance = Math.max(0, deltaTime * this.monsterSpeed);
            this._nextSpawnZ -= moveDistance;
            this._formationTravelDistance += moveDistance;
        }

    }

    protected lateUpdate(deltaTime: number): void {
        if (UnityUpComponent.isStop) {
            return;
        }
        if (this.lalianLimitRanges.length <= 0 || this._monsterList.length <= 0) {
            return;
        }
        for (let i = 0; i < this._monsterList.length; i++) {
            const monster = this._monsterList[i];
            if (!monster || monster.isDie || !monster.node || !monster.node.active) {
                continue;
            }
            this.limitMonsterToMiddleLane(monster);
        }
    }

    private refreshLalianLimitRange(): void {
        this.lalianLimitRanges.length = 0;

        const scene = director.getScene();
        if (!scene) {
            return;
        }

        const stack: Node[] = [scene];
        while (stack.length > 0) {
            const node = stack.pop();
            if (!node) {
                continue;
            }
            const gate = node.getComponent(PropLalianGate);
            if (gate && gate.getWorldZRange(this.tempLalianRange)) {
                this.lalianLimitRanges.push({
                    minZ: Math.min(this.tempLalianRange.x, this.tempLalianRange.y),
                    maxZ: Math.max(this.tempLalianRange.x, this.tempLalianRange.y),
                });
            }
            for (let i = node.children.length - 1; i >= 0; i--) {
                stack.push(node.children[i]);
            }
        }
    }

    private updateWaveRoleForwardMove(deltaTime: number) {
        if (!MonsterCreate.isStartMove) {
            return;
        }
        if (this._waveRoleNodes.length <= 0 || this._waveStageStartZList.length <= 0) {
            return;
        }

        const moveDistance = Math.max(0, this.monsterSpeed) * deltaTime;
        if (moveDistance <= 0) {
            return;
        }

        for (let i = 0; i < this._waveRoleNodes.length; i++) {
            const role = this._waveRoleNodes[i];
            if (!role || !role.node || !role.node.active || role.isDie) {
                continue;
            }
            const pos = role.node.worldPosition;
            role.node.setWorldPosition(pos.x, pos.y, pos.z - moveDistance);
        }
    }

    private clampMonsterBehindWaveRole(monster: MonsterBattleTaerget) {
        if (!monster || !monster.node || !monster.node.active || monster.isDie || this._waveRoleNodes.length <= 0) {
            return;
        }

        for (let i = 0; i < this._waveRoleNodes.length; i++) {
            this.clampMonsterBehindSingleWaveRole(monster, this._waveRoleNodes[i]);
        }
    }

    private clampMonsterBehindSingleWaveRole(monster: MonsterBattleTaerget, role: PropArms) {
        if (!role || !role.node || !role.node.active || role.isDie) {
            return;
        }

        const roleHalfZ = this.getWaveRoleCollisionHalfZ(role);
        const roleHalfX = Math.max(0, role.collisionHalfX ?? 0);
        const monsterHalfZ = this.getMonsterCollisionHalfZ(monster);
        const monsterHalfX = Math.max(0, monster.collisionHalfX ?? 0);
        const roleCenter = role.getCollisionWorldPosition(tempV3);
        const roleCenterX = roleCenter.x;
        const roleCenterZ = roleCenter.z;
        const monsterCenter = monster.getCollisionWorldPosition(tempV3);
        const monsterCenterX = monsterCenter.x;
        const monsterCenterZ = monsterCenter.z;
        if (Math.abs(monsterCenterX - roleCenterX) > roleHalfX + monsterHalfX + this.waveRolePushGap) {
            return;
        }
        const roleMinZ = roleCenterZ - roleHalfZ - this.waveRolePushGap;
        const roleMaxZ = roleCenterZ + roleHalfZ + this.waveRolePushGap;
        const monsterMinZ = monsterCenterZ - monsterHalfZ;
        const monsterMaxZ = monsterCenterZ + monsterHalfZ;
        if (monsterMaxZ < roleMinZ || monsterMinZ > roleMaxZ) {
            return;
        }
        const limitCenterZ = roleCenterZ + roleHalfZ + monsterHalfZ + this.waveRolePushGap;
        this.setCollisionCenterWorldZ(monster, limitCenterZ);
    }

    private clampMonstersBehindWaveRole(waveIndex: number) {
        if (waveIndex < 0 || waveIndex >= this._waveRoleNodes.length) {
            return;
        }
        const role = this._waveRoleNodes[waveIndex];
        if (!role || !role.node || !role.node.active || role.isDie) {
            return;
        }

        for (let i = 0; i < this._monsterList.length; i++) {
            const monster = this._monsterList[i];
            if (!monster || !monster.node || !monster.node.active || monster.isDie) {
                continue;
            }
            this.clampMonsterBehindSingleWaveRole(monster, role);
        }
    }

    private setCollisionCenterWorldZ(target: PropArms | MonsterBattleTaerget, centerZ: number) {
        if (!target?.node) {
            return;
        }
        const hitZ = target.getCollisionWorldPosition(tempV3).z;
        const nodePos = target.node.worldPosition;
        target.node.setWorldPosition(nodePos.x, nodePos.y, nodePos.z + centerZ - hitZ);
    }

    private getCollisionCenterOffsetZ(target: PropArms | MonsterBattleTaerget) {
        if (!target?.node) {
            return 0;
        }
        return target.getCollisionWorldPosition(tempV3).z - target.node.worldPosition.z;
    }

    private registerMonsterRebirthLayoutData(monster: MonsterBattleTaerget, waveIndex: number, baseX: number = monster?.initX ?? 0, baseZ: number = monster?.node?.z ?? 0) {
        if (!monster || !monster.node) {
            return;
        }
        this._monsterRebirthOrderMap.set(monster, this._monsterRebirthOrderIndex++);
        this._monsterSpawnLocalXMap.set(monster, monster.initX);
        const referenceLocalZ = monster.node.z + this._formationTravelDistance;
        this._monsterSpawnLocalZMap.set(monster, referenceLocalZ);
        this._monsterRebirthOffsetMap.set(monster, new Vec3(monster.initX - baseX, 0, monster.node.z - baseZ));
        if (waveIndex < 0) {
            return;
        }
        this._monsterWaveIndexMap.set(monster, waveIndex);
        this.recordRebirthWaveInitialZ(waveIndex, referenceLocalZ);
    }

    private recordRebirthWaveInitialZ(waveIndex: number, localZ: number) {
        if (waveIndex < 0 || !Number.isFinite(localZ)) {
            return;
        }
        const currentMin = this._rebirthWaveInitialMinZList[waveIndex];
        const currentMax = this._rebirthWaveInitialMaxZList[waveIndex];
        this._rebirthWaveInitialMinZList[waveIndex] = Number.isFinite(currentMin) ? Math.min(currentMin, localZ) : localZ;
        this._rebirthWaveInitialMaxZList[waveIndex] = Number.isFinite(currentMax) ? Math.max(currentMax, localZ) : localZ;
    }

    private getMonsterRebirthSortValue(monster: MonsterBattleTaerget) {
        const order = this._monsterRebirthOrderMap.get(monster);
        if (typeof order === 'number') {
            return order;
        }
        const spawnZ = this._monsterSpawnLocalZMap.get(monster);
        if (typeof spawnZ === 'number') {
            return spawnZ;
        }
        return monster?.node?.z ?? 0;
    }

    private getInitialWaveBoundaryGap(prevWaveIndex: number, currentWaveIndex: number) {
        let gap = 0;
        for (let i = prevWaveIndex + 1; i <= currentWaveIndex; i++) {
            const prevMax = this._rebirthWaveInitialMaxZList[i - 1];
            const currentMin = this._rebirthWaveInitialMinZList[i];
            if (!Number.isFinite(prevMax) || !Number.isFinite(currentMin)) {
                continue;
            }
            gap += Math.max(0, currentMin - prevMax);
        }
        return gap;
    }

    private buildRebirthMonsterLayout(): WeakMap<MonsterBattleTaerget, Vec3> {
        const layout = new WeakMap<MonsterBattleTaerget, Vec3>();
        const waveMap = new Map<number, MonsterBattleTaerget[]>();

        for (let i = 0; i < this._monsterList.length; i++) {
            const monster = this._monsterList[i];
            if (!monster || !monster.node || !monster.node.active || monster.isDie) {
                continue;
            }
            const waveIndex = Math.max(0, this.getWaveIndexByMonster(monster));
            let list = waveMap.get(waveIndex);
            if (!list) {
                list = [];
                waveMap.set(waveIndex, list);
            }
            list.push(monster);
        }

        if (waveMap.size <= 0) {
            return layout;
        }

        const waveIndexList = Array.from(waveMap.keys()).sort((a, b) => a - b);
        let cursorZ = this.stage_1 + this.rebirthMonsterFrontRetreatZ;
        const rowGapZ = Math.max(0.01, this.layerGapZ);
        const bossExcludeZ = Math.max(0, this.brotherExcludeZ);
        const waveExtraGapZ = Math.max(0, this.rebirthMonsterWaveExtraGapZ);
        const randomZRange = Math.max(0, this.rebirthMonsterRandomZ);
        let prevWaveIndex = waveIndexList[0];

        for (let i = 0; i < waveIndexList.length; i++) {
            const waveIndex = waveIndexList[i];
            const list = waveMap.get(waveIndex);
            if (!list || list.length <= 0) {
                continue;
            }
            if (i > 0) {
                cursorZ += this.getInitialWaveBoundaryGap(prevWaveIndex, waveIndex) + waveExtraGapZ;
            }
            list.sort((a, b) => this.getMonsterRebirthSortValue(a) - this.getMonsterRebirthSortValue(b));
            const rowCount = Math.max(1, Math.floor(this.rowCount));
            let waveCursorZ = cursorZ;

            for (let j = 0; j < list.length;) {
                const monster = list[j];
                if (monster.monsterType === MonsterType.ZombieBrother) {
                    const spawnX = this._monsterSpawnLocalXMap.get(monster) ?? this.getSpawnX(0);
                    monster.initX = spawnX;
                    const targetZ = waveCursorZ + bossExcludeZ;
                    const targetX = this.getMonsterMoveTargetX(monster, this.node.worldPositionZ + targetZ);
                    layout.set(monster, new Vec3(targetX, monster.node.y, targetZ));
                    waveCursorZ += bossExcludeZ * 2;
                    j++;
                    continue;
                }

                const babyList: MonsterBattleTaerget[] = [];
                while (j < list.length && list[j].monsterType !== MonsterType.ZombieBrother) {
                    babyList.push(list[j]);
                    j++;
                }

                const rowTotal = Math.max(1, Math.ceil(babyList.length / rowCount));
                for (let k = 0; k < babyList.length; k++) {
                    const baby = babyList[k];
                    const row = Math.floor(k / rowCount);
                    const offset = this._monsterRebirthOffsetMap.get(baby);
                    const offsetZ = offset ? Math.max(-randomZRange, Math.min(randomZRange, offset.z)) : 0;
                    const spawnX = this._monsterSpawnLocalXMap.get(baby) ?? baby.initX;
                    baby.initX = spawnX;
                    const targetZ = waveCursorZ + row * rowGapZ + offsetZ;
                    const targetX = this.getMonsterMoveTargetX(baby, this.node.worldPositionZ + targetZ);
                    layout.set(baby, new Vec3(targetX, baby.node.y, targetZ));
                }
                waveCursorZ += rowTotal * rowGapZ;
            }

            cursorZ = waveCursorZ;
            prevWaveIndex = waveIndex;
        }

        return layout;
    }

    private logRebirthFrontDistance(layout: WeakMap<MonsterBattleTaerget, Vec3>) {
        if (!this.rebirthMonsterDistanceLog) {
            return;
        }

        let frontMonsterWorldZ = Number.POSITIVE_INFINITY;
        let frontMonsterName = '';
        for (let i = 0; i < this._monsterList.length; i++) {
            const monster = this._monsterList[i];
            const targetPos = layout.get(monster);
            if (!targetPos) {
                continue;
            }
            const targetWorldZ = this.node.worldPositionZ + targetPos.z;
            if (targetWorldZ < frontMonsterWorldZ) {
                frontMonsterWorldZ = targetWorldZ;
                frontMonsterName = monster.node?.name ?? '';
            }
        }

        if (!Number.isFinite(frontMonsterWorldZ)) {
            return;
        }

        let playerFrontWorldZ = Number.NEGATIVE_INFINITY;
        let playerFrontName = '';
        const roleList = Player.instance?.roleList ?? [];
        for (let i = 0; i < roleList.length; i++) {
            const role = roleList[i];
            if (!role?.node?.activeInHierarchy) {
                continue;
            }
            const roleWorldZ = role.node.worldPositionZ;
            if (roleWorldZ > playerFrontWorldZ) {
                playerFrontWorldZ = roleWorldZ;
                playerFrontName = role.node.name;
            }
        }

        const stageLineWorldZ = this.node.worldPositionZ + this.stage_1;
        const distanceToStageLine = frontMonsterWorldZ - stageLineWorldZ;
        const distanceToPlayerFront = Number.isFinite(playerFrontWorldZ) ? frontMonsterWorldZ - playerFrontWorldZ : Number.NaN;
        console.log(
            `[MonsterCreate] 再来一次距离: frontMonster=${frontMonsterName}, frontMonsterWorldZ=${frontMonsterWorldZ.toFixed(3)}, stageLineWorldZ=${stageLineWorldZ.toFixed(3)}, distanceToStageLine=${distanceToStageLine.toFixed(3)}, playerFront=${playerFrontName}, playerFrontWorldZ=${Number.isFinite(playerFrontWorldZ) ? playerFrontWorldZ.toFixed(3) : 'NaN'}, distanceToPlayerFront=${Number.isFinite(distanceToPlayerFront) ? distanceToPlayerFront.toFixed(3) : 'NaN'}`,
        );
    }

    private tryAssignMonsterAttackTarget(monster: MonsterBattleTaerget): boolean {
        if (!monster?.move || !Player.instance || Player.instance.isDie || Player.instance.roleList.length <= 0) {
            return false;
        }

        const targetRole = monster.monsterType === MonsterType.ZombieBrother
            ? Player.instance.getMonsterAttackTarget(monster.node.worldPosition)
            : Player.instance.getSmallMonsterAttackTarget(monster.node.worldPosition);
        if (!targetRole?.node?.activeInHierarchy) {
            return false;
        }

        monster.attackTarget = targetRole.node;
        monster.move.isRot = true;
        monster.move.moveMod = MoveModEnum.targetMove;
        monster.move.target = monster.attackTarget;
        return true;
    }

    private checkWaveRolePlayerCollision() {
        const player = Player.instance;
        if (!player || player.isDie || !player.roleList || player.roleList.length <= 0 || this._waveRoleNodes.length <= 0) {
            return;
        }

        let hasRoleDie = false;
        for (let i = 0; i < this._waveRoleNodes.length; i++) {
            const waveRole = this._waveRoleNodes[i];
            if (!waveRole || !waveRole.node || !waveRole.node.active || waveRole.isDie) {
                continue;
            }

            const roleCenter = waveRole.getCollisionWorldPosition(tempV3);
            const centerX = roleCenter.x;
            const centerZ = roleCenter.z;
            const halfX = Math.max(0, waveRole.collisionHalfX ?? 0);
            const halfZ = this.getWaveRoleCollisionHalfZ(waveRole);

            for (let j = player.roleList.length - 1; j >= 0; j--) {
                const role = player.roleList[j];
                if (!this.isRoleInWaveRoleBox(role, centerX, centerZ, halfX, halfZ)) {
                    continue;
                }
                player.roleList.splice(j, 1);
                player.roleDie(role);
                hasRoleDie = true;
            }
        }

        if (hasRoleDie) {
            player.requestShrinkAfterRoleLoss();
        }
    }

    private isRoleInWaveRoleBox(role: Role, centerX: number, centerZ: number, halfX: number, halfZ: number) {
        if (!role || !role.node || !role.node.active) {
            return false;
        }
        const pos = role.node.worldPosition;
        return Math.abs(pos.x - centerX) <= halfX + this.waveRolePlayerHalfX
            && Math.abs(pos.z - centerZ) <= halfZ + this.waveRolePlayerHalfZ;
    }

    private getWaveRoleLimitedSpawnZ(localZ: number, monster: MonsterBattleTaerget) {
        if (this._waveRoleNodes.length <= 0) {
            return localZ;
        }

        let resultZ = localZ;
        for (let pass = 0; pass < this._waveRoleNodes.length; pass++) {
            let changed = false;
            for (let i = 0; i < this._waveRoleNodes.length; i++) {
                const limitedZ = this.getSingleWaveRoleLimitedSpawnZ(resultZ, this._waveRoleNodes[i], monster);
                if (limitedZ > resultZ) {
                    resultZ = limitedZ;
                    changed = true;
                }
            }
            if (!changed) {
                break;
            }
        }
        return resultZ;
    }

    private getQuestSpawnCount(quest: MonsterCreateInfo | null): number {
        const defaultCount = Math.max(0, Math.floor(quest?.monsterCountMax ?? 0));
        const actualCount = Math.max(0, Math.floor(quest?.actualSpawnCount ?? 0));
        return actualCount > 0 ? actualCount : defaultCount;
    }

    private getQuestRangeCount(quest: MonsterCreateInfo | null): number {
        const spawnCount = this.getQuestSpawnCount(quest);
        const rangeCount = Math.max(0, Math.floor(quest?.zRangeCountBase ?? 0));
        return Math.max(spawnCount, rangeCount > 0 ? rangeCount : spawnCount);
    }

    private buildSparseWaveSpawnSlotSet(spawnCount: number, rangeCount: number): Set<number> {
        const slotSet: Set<number> = new Set();
        if (spawnCount <= 0 || rangeCount <= 0) {
            return slotSet;
        }
        if (spawnCount >= rangeCount) {
            for (let i = 0; i < rangeCount; i++) {
                slotSet.add(i);
            }
            return slotSet;
        }
        if (spawnCount === 1) {
            slotSet.add(0);
            return slotSet;
        }
        for (let i = 0; i < spawnCount; i++) {
            const slotIndex = Math.round(i * (rangeCount - 1) / (spawnCount - 1));
            slotSet.add(Math.min(rangeCount - 1, Math.max(0, slotIndex)));
        }
        return slotSet;
    }

    private spawnBabyAtCursor(
        quest: MonsterCreateInfo | null,
        waveIndex: number,
        baseNextSpawnZ: number,
        basePosIndex: number,
    ) {
        const type = this.getQuestBabyType(quest);
        const monsterIns = this.monsterMatIns[type];

        const monster = this.getMonster(type);
        this._monsterList.push(monster);
        this.node.addChild(monster.node);
        if (!monsterIns) {
            this.monsterMatIns[type] = 1;
            monster.flashDie(0.01);
        }

        const baseLocalZ = this.getSpawnZ(baseNextSpawnZ);
        const baseRawX = (basePosIndex - (this.rowCount - 1) / 2) * this.offX;
        const rawZ = baseNextSpawnZ + (Math.random() - 0.5) * (this.layerGapZ + this.spawnRandomZ * 2);
        const z = this.getWaveRoleLimitedSpawnZ(rawZ, monster);
        const rawX = (Math.random() - 0.5) * (this.offX + this.spawnRandomX * 2) + baseRawX;
        const worldZ = this.getSpawnWorldZ(z);
        const spawnX = this.getSpawnX(rawX);
        const x = this.shouldLimitMonsterXAtZ(worldZ) ? this.clampMonsterX(spawnX) : spawnX;
        monster.initX = spawnX;
        monster.init(this.getQuestDifficulty(quest, 1), this.getQuestFixedHp(quest));
        monster.move.moveMod = MoveModEnum.PosMove;
        monster.move.isRot = false;
        monster.node.setPosition(x, this.getSpawnY(), this.getSpawnZ(z));
        this.applySpawnVariation(monster);

        tempV3.set(monster.node.worldPosition);
        tempV3.x = this.getMonsterMoveTargetX(monster, worldZ);
        tempV3.z = this.stage_0;
        monster.move.pos = tempV3;
        this.registerMonsterRebirthLayoutData(monster, waveIndex, this.getSpawnX(baseRawX), baseLocalZ);
        return z > rawZ ? z : baseNextSpawnZ;
    }

    private getSingleWaveRoleLimitedSpawnZ(localZ: number, waveRole: PropArms, monster: MonsterBattleTaerget) {
        if (!waveRole || !waveRole.node || !waveRole.node.active || waveRole.isDie) {
            return localZ;
        }

        const roleCenterZ = waveRole.getCollisionWorldPosition(tempV3).z;
        const roleHalfZ = this.getWaveRoleCollisionHalfZ(waveRole);
        const monsterHalfZ = this.getMonsterCollisionHalfZ(monster);
        const monsterCenterOffsetZ = this.getCollisionCenterOffsetZ(monster);
        const monsterCenterZ = this.getSpawnWorldZ(localZ) + monsterCenterOffsetZ;
        const monsterMinZ = monsterCenterZ - monsterHalfZ;
        const monsterMaxZ = monsterCenterZ + monsterHalfZ;
        const roleMinZ = roleCenterZ - roleHalfZ - this.waveRolePushGap;
        const roleMaxZ = roleCenterZ + roleHalfZ + this.waveRolePushGap;

        if (monsterMaxZ < roleMinZ || monsterMinZ > roleMaxZ) {
            return localZ;
        }
        return roleMaxZ + monsterHalfZ + this.waveRolePushGap - monsterCenterOffsetZ - this.node.worldPositionZ - this.getSpawnOffsetZ();
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

    private getFrontMonsterByWaveLayout(waveIndex: number, layout: WeakMap<MonsterBattleTaerget, Vec3>) {
        let frontMonster: MonsterBattleTaerget = null;
        let frontZ = Number.POSITIVE_INFINITY;

        for (let i = 0; i < this._monsterList.length; i++) {
            const monster = this._monsterList[i];
            if (!monster || !monster.node || !monster.node.active || monster.isDie) {
                continue;
            }
            if (this.getWaveIndexByMonster(monster) !== waveIndex) {
                continue;
            }
            const targetPos = layout?.get(monster);
            const targetWorldZ = targetPos ? this.node.worldPositionZ + targetPos.z : monster.node.worldPositionZ;
            if (targetWorldZ < frontZ) {
                frontZ = targetWorldZ;
                frontMonster = monster;
            }
        }

        return frontMonster;
    }

    private getCollisionCenterWorldZByLayout(monster: MonsterBattleTaerget, layout: WeakMap<MonsterBattleTaerget, Vec3>) {
        const targetPos = layout?.get(monster);
        if (!targetPos) {
            return monster.getCollisionWorldPosition(tempV3).z;
        }
        return this.node.worldPositionZ + targetPos.z + this.getCollisionCenterOffsetZ(monster);
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
        const minHalfZ = monster?.monsterType === MonsterType.ZombieBrother
            ? this.waveRoleBossHalfZMin
            : this.waveRoleMonsterHalfZMin;
        return Math.max(0, minHalfZ, monster?.collisionHalfZ ?? 0);
    }

    private getWaveIndexByMonsterZ(z: number) {
        if (this._stageStartZList.length <= 0) {
            return -1;
        }

        const localZ = z - this.node.worldPositionZ;
        for (let i = 0; i < this._stageStartZList.length; i++) {
            const currentStart = this._stageStartZList[i];
            const nextStart = i + 1 < this._stageStartZList.length ? this._stageStartZList[i + 1] : Number.POSITIVE_INFINITY;
            if (localZ >= currentStart && localZ < nextStart) {
                return i;
            }
        }
        return localZ < this._stageStartZList[0] ? 0 : this._stageStartZList.length - 1;
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
                result.push(this.getSpawnZ(nextSpawnZ));

                if (quest.monsterType == MonsterType.ZombieBrother) {
                    nextSpawnZ += this.brotherExcludeZ;
                    nextSpawnZ += this.brotherExcludeZ;
                } else {
                    const rangeCount = this.getQuestRangeCount(quest);
                    for (let count = 0; count < rangeCount; count++) {
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
    private spawnBrother(quest: MonsterCreateInfo | null = null, waveIndex: number = -1) {
        const monster = this.getMonster(MonsterType.ZombieBrother);
        this._monsterList.push(monster);
        this.node.addChild(monster.node);
        // const layer = Math.floor(this._babyCountSinceLastBrother / this.rowCount);
        // const l = this.brotherInterval / this.rowCount;
        // let z = this._finallyBoss ? this._finallyBoss.z + this.brotherExcludeZ * 2 + this.layerGapZ * layer : this.layerCount * (this.layerGapZ * l + this.brotherExcludeZ) + this.brotherExcludeZ + this.layerGapZ * layer;
        this._nextSpawnZ += this.brotherExcludeZ;
        const baseLocalZ = this.getSpawnZ(this._nextSpawnZ);
        const z = this.getWaveRoleLimitedSpawnZ(this._nextSpawnZ, monster);
        const worldZ = this.getSpawnWorldZ(z);
        this._nextSpawnZ = z;
        this._nextSpawnZ += this.brotherExcludeZ;
        monster.init(this.getQuestDifficulty(quest, (this._monsterBossCount * 2) + 1), this.getQuestFixedHp(quest));
        monster.move.moveMod = MoveModEnum.PosMove;
        monster.move.isRot = false;
        monster.initX = this.getSpawnX(0);
        monster.node.setPosition(this.clampMonsterX(monster.initX), this.getSpawnY(), this.getSpawnZ(z));
        this.applySpawnVariation(monster);
        tempV3.set(monster.node.worldPosition);
        tempV3.x = this.getMonsterMoveTargetX(monster, worldZ);
        tempV3.z = this.stage_0;
        monster.move.pos = tempV3;
        this.registerMonsterRebirthLayoutData(monster, waveIndex, this.getSpawnX(0), baseLocalZ);
        // this._brotherZPositions.push(z);
        this._monsterBossCount++;
    }

    /** 生成ZombieBaby，自动避开ZombieBrother的排斥区域 */
    private spawnBaby(quest: MonsterCreateInfo | null = null, waveIndex: number = -1) {
        const type = this.getQuestBabyType(quest);
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
        const baseLocalZ = this.getSpawnZ(this._nextSpawnZ);
        const baseRawX = (this.posIndex - (this.rowCount - 1) / 2) * this.offX;
        const rawZ = this._nextSpawnZ + (Math.random() - 0.5) * (this.layerGapZ + this.spawnRandomZ * 2);
        const z = this.getWaveRoleLimitedSpawnZ(rawZ, monster);
        const rawX = (Math.random() - 0.5) * (this.offX + this.spawnRandomX * 2) + baseRawX;
        const worldZ = this.getSpawnWorldZ(z);
        const spawnX = this.getSpawnX(rawX);
        const x = this.shouldLimitMonsterXAtZ(worldZ) ? this.clampMonsterX(spawnX) : spawnX;
        monster.initX = spawnX;
        monster.init(this.getQuestDifficulty(quest, 1), this.getQuestFixedHp(quest));

        this.posIndex = (this.posIndex + 1) % this.rowCount;

        monster.move.moveMod = MoveModEnum.PosMove;
        monster.move.isRot = false;

        monster.node.setPosition(x, this.getSpawnY(), this.getSpawnZ(z));
        this.applySpawnVariation(monster);

        tempV3.set(monster.node.worldPosition);

        tempV3.x = this.getMonsterMoveTargetX(monster, worldZ);
        tempV3.z = this.stage_0;

        monster.move.pos = tempV3;
        this.registerMonsterRebirthLayoutData(monster, waveIndex, this.getSpawnX(baseRawX), baseLocalZ);
        if (z > rawZ && z > this._nextSpawnZ) {
            this._nextSpawnZ = z;
        }
        this._rowCount++;

        if (this._rowCount == this.rowCount) {
            this._nextSpawnZ += this.layerGapZ;
            this._rowCount = 0;
        }

    }

    private getSpawnX(baseX: number) {
        return baseX + this.spawnPositionOffset.x;
    }

    private getSpawnY() {
        return this.spawnPositionOffset.y;
    }

    private getSpawnZ(baseZ: number) {
        return baseZ + this.getSpawnOffsetZ();
    }

    private getSpawnWorldZ(baseZ: number) {
        return this.node.worldPositionZ + this.getSpawnZ(baseZ);
    }

    private getSpawnOffsetZ() {
        return this.spawnPositionOffset.z;
    }

    private getQuestFixedHp(quest: MonsterCreateInfo | null): number {
        return quest && quest.monsterHp > 0 ? quest.monsterHp : 0;
    }

    private getQuestDifficulty(quest: MonsterCreateInfo | null, defaultDifficulty: number): number {
        if (quest && quest.difficulty > 0) {
            return quest.difficulty;
        }
        return defaultDifficulty;
    }

    private getQuestBabyType(quest: MonsterCreateInfo | null): MonsterType {
        if (quest && quest.monsterType !== MonsterType.ZombieBrother && quest.mixBaby01) {
            const baby1Ratio = Math.max(0, Math.min(1, quest.baby1Ratio));
            return Math.random() < baby1Ratio ? MonsterType.ZombieBaby_1 : MonsterType.ZombieBaby_0;
        }
        if (quest && quest.monsterType !== MonsterType.ZombieBrother) {
            return quest.monsterType;
        }
        return Math.random() < 0.5 ? MonsterType.ZombieBaby_0 : MonsterType.ZombieBaby_1;
    }

    private applySpawnVariation(monster: MonsterBattleTaerget) {
        const scale = 1 + (Math.random() - 0.5) * this.spawnScaleRandom * 2;
        monster.node.setScale(scale, scale, scale);
        monster.node.setRotationFromEuler(0, 180, 0);
        monster.fbx?.node?.setRotationFromEuler(0, 0, 0);
        monster.randomizeRunAnimation();
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
        const halfX = this.getMiddleLimitHalfX();
        if (x > halfX) {
            return halfX;
        }
        if (x < -halfX) {
            return -halfX;
        }
        return x;
    }

    private shouldLimitMonsterXAtZ(z: number): boolean {
        for (let i = 0; i < this.lalianLimitRanges.length; i++) {
            const range = this.lalianLimitRanges[i];
            if (z >= range.minZ && z <= range.maxZ) {
                return true;
            }
        }
        return false;
    }

    private getMiddleLimitHalfX(): number {
        return Math.max(0, this.middleLaneHalfX);
    }

    private getMonsterMoveTargetX(monster: MonsterBattleTaerget, worldZ: number): number {
        const freeX = monster?.initX ?? 0;
        return this.shouldLimitMonsterXAtZ(worldZ) ? this.clampMonsterX(freeX) : freeX;
    }

    private syncMonsterMoveTargetX(monster: MonsterBattleTaerget): void {
        if (!monster.move || monster.move.moveMod != MoveModEnum.PosMove) {
            return;
        }
        if (this.isTrackingPlayerTarget(monster)) {
            return;
        }
        monster.move.pos.x = this.getMonsterMoveTargetX(monster, monster.node.worldPositionZ);
    }

    private limitMonsterToMiddleLane(monster: MonsterBattleTaerget) {
        if (this.isTrackingPlayerTarget(monster)) {
            return;
        }
        if (!this.shouldLimitMonsterXAtZ(monster.node.worldPositionZ)) {
            return;
        }
        const x = this.clampMonsterX(monster.node.x);
        if (monster.node.x != x) {
            monster.node.x = x;
        }
    }

    private isTrackingPlayerTarget(monster: MonsterBattleTaerget): boolean {
        return !!monster?.attackTarget;
    }

    private getMonster(type: MonsterType = MonsterType.ZombieBaby_0) {
        let monster = PoolManager.instance.getPool<MonsterBattleTaerget>(PoolEnum.monster + type);
        if (!monster) {
            const node = PrefabsManager.instance.GetPrefabsIns(PrefabsEnum.monster, type);
            monster = node.getComponent(MonsterBattleTaerget);
        }
        monster.node.active = true;
        monster.init(1);
        if (monster.move) {
            monster.move.speed = Math.max(0, this.monsterSpeed);
        }
        monster.attackTarget = null;
        return monster;
    }

    // private isFlowIN = false;
    private TimeFlowsBackWard() {
        // this.isFlowIN = true;
        this._isRestoringWaveRolesAfterRebirth = true;
        const rebirthLayout = this.buildRebirthMonsterLayout();
        this.logRebirthFrontDistance(rebirthLayout);
        this.hideWaveRolesDuringRebirth();
        for (let i = 0; i < this._monsterList.length; i++) {
            const monster = this._monsterList[i];
            if (!monster || monster.isDie || !monster.node?.active || !monster.move) {
                continue;
            }
            monster.prepareForRebirthRetreat();
            const targetPos = rebirthLayout.get(monster);
            if (!targetPos) {
                monster.move.autoMove = true;
                continue;
            }
            tween(monster.node).to(0.4, { x: targetPos.x, z: targetPos.z }).start();
        }
        this.scheduleOnce(() => {
            this.restoreWaveRolesAfterRebirth(rebirthLayout);
            this.resumeMonstersAfterRebirth();
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

    private restoreWaveRolesAfterRebirth(rebirthLayout?: WeakMap<MonsterBattleTaerget, Vec3>) {
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
            const targetWaveIndex = this._waveStageIndexList[i] ?? i;
            const frontMonster = rebirthLayout
                ? this.getFrontMonsterByWaveLayout(targetWaveIndex, rebirthLayout)
                : this.getFrontMonsterByWave(targetWaveIndex);
            if (!frontMonster || !frontMonster.node) {
                continue;
            }
            const roleHalfZ = this.getWaveRoleCollisionHalfZ(role);
            const monsterHalfZ = this.getMonsterCollisionHalfZ(frontMonster);
            const monsterCenterZ = rebirthLayout
                ? this.getCollisionCenterWorldZByLayout(frontMonster, rebirthLayout)
                : frontMonster.getCollisionWorldPosition(tempV3).z;
            const targetCenterZ = monsterCenterZ - monsterHalfZ - this.waveRolePushGap - roleHalfZ;
            this.setCollisionCenterWorldZ(role, targetCenterZ);
            this.clampMonstersBehindWaveRole(i);
        }
        this._isRestoringWaveRolesAfterRebirth = false;
    }

    private resumeMonstersAfterRebirth() {
        for (let i = 0; i < this._monsterList.length; i++) {
            const monster = this._monsterList[i];
            if (!monster || monster.isDie || !monster.node?.active || !monster.move) {
                continue;
            }

            monster.move.autoMove = true;
            monster.move.speed = Math.max(0, this.monsterSpeed);
            monster.attackTarget = null;
            if (monster.monsterType === MonsterType.ZombieBrother && this.tryAssignMonsterAttackTarget(monster)) {
                BulletMonsterCollisionManager.instance.unregisterTarget(monster);
                BulletMonsterCollisionManager.instance.registerTarget(monster);
                continue;
            }
            monster.move.moveMod = MoveModEnum.PosMove;
            monster.move.isRot = false;
            tempV3.set(monster.node.worldPosition);
            tempV3.x = this.getMonsterMoveTargetX(monster, tempV3.z);
            tempV3.z = this.stage_1;
            monster.move.pos = tempV3;
            BulletMonsterCollisionManager.instance.unregisterTarget(monster);
            BulletMonsterCollisionManager.instance.registerTarget(monster);
        }
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

                const throwHeight = Math.max(0, this.monsterDeathThrowBaseHeight)
                    + Math.random() * Math.max(0, this.monsterDeathThrowRandomHeight);
                JumpManager.instance.jumpBezierByPoints(monster.node, throwHeight, cPos, endPos).onComplete(() => {
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


