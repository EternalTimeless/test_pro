import { ccenum, director, EventKeyboard, Input, input, KeyCode, math, Node, v3, Vec3 } from 'cc';
// import { Hero } from '../Battle/Hero';
// import { BuildingManager } from '../Manager/BuildingManager';
import { GameManager } from '../Manager/GameManager';
import { MonsterManager } from '../Manager/MonsterManager';
// import { CollectionManager } from '../Manager/CollectionManager';
// import { VirtualInput } from './VirtualInput';
import { GuideManager } from '../Manager/GuideManager';
import { ViewManager } from '../Manager/ViewManager';
// import { MapLayerManager } from '../Manager/MapLayerManager';
import { CharacterTag, CommonEvent, PrefabPathEnum } from './CommonEnum';
import { Hero } from '../Battle/Hero';
import { VirtualInput } from './VirtualInput';
import { PrefabManager } from '../Manager/PrefabManager';
import { RoleSoldier } from '../Battle/RoleSoldier';
import { CollectionManager } from '../Manager/CollectionManager';
// import { TrackManager } from '../Manager/TrackManager';
import { RoleWorker } from '../Battle/RoleWorker';
import SimulationCollisionManager from '../Manager/SimulationCollisionManager';
// import { RoleHeroAlly } from '../Battle/RoleHeroAlly';
// import { RVOManager } from './RVO/RVOManager';
// import { MapManager } from './FlowField/MapManager';
// import { RolePeople } from '../Battle/RolePeople';
// import { FollowManager } from '../Manager/FollowManager';
// import { MapLayerManager } from '../Manager/MapLayerManager';
// import { RoleWorker } from '../Battle/RoleWorker';
// import { ConveyorManager } from '../Other/ConveyorManager';
// import { RoleSoldier } from '../Battle/RoleSoldier';
// import { CollectionManager } from '../Manager/CollectionManager';
// import { ConveyorManager } from '../Other/ConveyorManager';
// import { RoleHeroAlly } from '../Battle/RoleHeroAlly';
// import { RoleWorker } from '../Battle/RoleWorker';
export enum SceneType {
    D2,
    D3
}
ccenum(SceneType)
/**常用核心对象单例, 消除循环引用 */
export class GameInfo {
    public static step: number = 0;
    private static _instance: GameInfo;
    public static SceneType: SceneType = SceneType.D3;
    public static get isD3Scene(): boolean {
        return this.SceneType === SceneType.D3;
    }
    /**
     * 场景根节点 Y 轴旋转 180° 后，沿世界 Z 的前进行进符号。
     * 原逻辑为 -1（Z 减小方向）；旋转后改为 1（Z 增大方向）。
     */
    public static readonly WorldForwardZSign: number = 1;
    /**屏幕实际分辨率 */
    public uiSize: math.Size = null;
    public Begin: boolean = false;
    public Pause: boolean = false;
    public Over: boolean = false;
    // 存储核心游戏对象的引用
    private _hero: Hero | null = null;
    // private _allyHeros: RoleHeroAlly[] = [];
    private _worker: RoleWorker[] = [];
    private _soldier: RoleSoldier[] = [];
    private _gameManager: GameManager | null = null;
    // private _buildingManager: BuildingManager | null = null;
    private _monsterManager: MonsterManager | null = null;
    private _collectionManager: CollectionManager | null = null;
    // private _conveyorMgr: ConveyorManager | null = null;
    private _guideManager: GuideManager | null = null;
    private _viewManager: ViewManager | null = null;
    /**2D项目管理动态节点排序器 */
    // private _mapLayerManager: MapLayerManager | null = null;
    private _prefabManager: PrefabManager | null = null;
    // private _rvoManager: RVOManager | null = null;
    // private _mapManager: MapManager | null = null;
    // private _ropeManager: RopeManager | null = null;
    // private _trackManager: TrackManager | null = null;
    // private _followManager: FollowManager | null = null;
    private _bulletMonsterCollisionManager: SimulationCollisionManager | null = null;
    public static get instance(): GameInfo {
        if (!this._instance) {
            this._instance = new GameInfo();
        }
        return this._instance;
    }

    /**测试按钮 */
    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
                VirtualInput.vertical = 1;
                break;
            case KeyCode.KEY_A:
                VirtualInput.horizontal = -1;
                break;
            case KeyCode.KEY_D:
                VirtualInput.horizontal = 1;
                break;
            case KeyCode.KEY_S:
                VirtualInput.vertical = -1;
                break;
            case KeyCode.KEY_Q:
                break;
            case KeyCode.KEY_E:
                break;
            case KeyCode.KEY_R:
                break;
            case KeyCode.KEY_Z:
                // GameInfo.instance._hero.testCreateSKill(0);
                // GameInfo.instance._hero.node.emit(ComponentEvent.OnAttackFrame);
                break;
            case KeyCode.KEY_X:
                break;
            case KeyCode.KEY_C:
                break;
            case KeyCode.KEY_V:
                break;
            case KeyCode.KEY_Y:
                break;
            case KeyCode.KEY_N:
                // GameInfo.instance.gameMgr.GameOver(true);
                break;
            case KeyCode.KEY_M:
                // app.event.emit(CommonEvent.UnlockHero);
                break;
            case KeyCode.KEY_P:
                //测试, 手动生成1只怪物
                // GameInfo.instance.monsterMgr.monstersToCreateTotal = 1;
                // GameInfo.instance.monsterMgr.processMonsterCreationQueue();
                break;
        }
    }
    onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
                VirtualInput.vertical = 0;
                break;
            case KeyCode.KEY_A:
                VirtualInput.horizontal = 0;
                break;
            case KeyCode.KEY_D:
                VirtualInput.horizontal = 0;
                break;
            case KeyCode.KEY_S:
                VirtualInput.vertical = -0;
                break;
        }
    }
    /**游戏暂停 */
    GamePause() {
        GameInfo.instance.Pause = true;
        // AudioMgr.instance.pauseMusic();
        // GameInfo.instance.monsterMgr.StopAllMonster(false);
        // GameInfo.instance.player.stopMove();
        // director.pause();
    }
    GameResume() {
        GameInfo.instance.Pause = false;
        // AudioMgr.instance.resumeMusic();
        // director.resume();
    }
    /**主角脚本 */
    public set player(value: Hero) {
        this._hero = value;
    }
    public get player(): Hero {
        if (!this._hero) {
            console.warn('Hero not initialized!');
        }
        return this._hero!;
    }
    public set worker(value: RoleWorker) {
        if (!this._worker.includes(value)) {
            this._worker.push(value);
        }
    }
    public get worker(): RoleWorker[] {
        return this._worker;
    }
    // public set allyHero(value: RoleHeroAlly) {
    //     if (!this._allyHeros.includes(value)) {
    //         this._allyHeros.push(value);
    //     }
    // }
    // public get allyHero(): RoleHeroAlly[] {
    //     return this._allyHeros;
    // }
    public set soldier(value: RoleSoldier) {
        if (!this._soldier.includes(value)) {
            this._soldier.push(value);
        }
    }
    public get soldier(): RoleSoldier[] {
        return this._soldier;
    }
    // GameManager 相关
    public set gameMgr(value: GameManager) {
        this._gameManager = value;
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    public get gameMgr(): GameManager {
        if (!this._gameManager) {
            console.warn('GameManager not initialized!');
        }
        return this._gameManager!;
    }

    // BuildingManager 相关
    // public set buildingMgr(value: BuildingManager) {
    //     this._buildingManager = value;
    // }
    // public get buildingMgr(): BuildingManager {
    //     if (!this._buildingManager) {
    //         console.warn('BuildingManager not initialized!');
    //     }
    //     return this._buildingManager!;
    // }

    // MonsterManager 相关
    public set monsterMgr(value: MonsterManager) {
        this._monsterManager = value;
    }
    public get monsterMgr(): MonsterManager {
        if (!this._monsterManager) {
            console.warn('MonsterManager not initialized!');
        }
        return this._monsterManager!;
    }
    public set collectionMgr(value: CollectionManager) {
        this._collectionManager = value;
    }
    public get collectionMgr(): CollectionManager {
        if (!this._collectionManager) {
            console.warn('CollectionManager not initialized!');
        }
        return this._collectionManager!;
    }
    public set guideMgr(value: GuideManager) {
        this._guideManager = value
    }
    public get guideMgr(): GuideManager {
        if (!this._guideManager) {
            console.warn('GuideManager not initialized!');
        }
        return this._guideManager!;
    }
    public set viewMgr(value: ViewManager) {
        this._viewManager = value;
    }
    public get viewMgr(): ViewManager {
        if (!this._viewManager) {
            console.warn('ViewManager not initialized!');
        }
        return this._viewManager!;
    }
    // public set mapLayerMgr(value: MapLayerManager) {
    //     this._mapLayerManager = value;
    // }
    // public get mapLayerMgr(): MapLayerManager {
    //     if (!this._mapLayerManager) {
    //         console.warn('MapLayerManager not initialized!');
    //     }
    //     return this._mapLayerManager!;
    // }
    public set prefabMgr(value: PrefabManager) {
        this._prefabManager = value;
    }
    public get prefabMgr(): PrefabManager {
        if (!this._prefabManager) {
            console.warn('PrefabManager not initialized!');
        }
        return this._prefabManager!;
    }
    // public set conveyorMgr(value: ConveyorManager) {
    //     this._conveyorMgr = value;
    // }
    // public get conveyorMgr(): ConveyorManager {
    //     if (!this._conveyorMgr) {
    //         console.warn('ConveyorManager not initialized!');
    //     }
    //     return this._conveyorMgr!;
    // }
    // public set rvoMgr(value: RVOManager) {
    //     this._rvoManager = value;
    // }
    // public get rvoMgr(): RVOManager {
    //     if (!this._rvoManager) {
    //         console.warn('RVOManager not initialized!');
    //     }
    //     return this._rvoManager!;
    // }
    // public set mapMgr(value: MapManager) {
    //     this._mapManager = value;
    // }
    // public get mapMgr(): MapManager {
    //     if (!this._mapManager) {
    //         console.warn('MapManager not initialized!');
    //     }
    //     return this._mapManager!;
    // }
    // public set trackMgr(value: TrackManager) {
    //     this._trackManager = value;
    // }
    // public get trackMgr(): TrackManager {
    //     if (!this._trackManager) {
    //         console.warn('TrackManager not initialized!');
    //     }
    //     return this._trackManager!;
    // }
    // public set followMgr(value: FollowManager) {
    //     this._followManager = value;
    // }
    // public get followMgr(): FollowManager {
    //     if (!this._followManager) {
    //         console.warn('FollowManager not initialized!');
    //     }
    //     return this._followManager!;
    // }
    public set simulationCollisionMgr(value: SimulationCollisionManager) {
        this._bulletMonsterCollisionManager = value;
    }
    public get simulationCollisionMgr(): SimulationCollisionManager {
        if (!this._bulletMonsterCollisionManager) {
            console.warn('BulletMonsterCollisionManager not initialized!');
        }
        return this._bulletMonsterCollisionManager!;
    }
}

export namespace Config {
    export const UNLOCK_CHECK_INTERVAL: number = 0.02; // 每0.02秒检查一次
}
export enum AttackType {
    /**近战攻击  直接造成伤害 */
    Melee = 'Melee',
    /**远程攻击 发射子弹 */
    Bullet = 'Bullet',
    /**挥砍  发射特效 */
    Slash = 'Slash',
    Aura = 'Aura',
    Skill = 'Skill',
    Other = 'Other',
}
ccenum(AttackType)
export interface AttackInfo {
    damage: number;
    direction?: Vec3;
    worldPos: Vec3;
    range: number;
    type: AttackType;
    source: Node;
    damageSource?: DamageSource;
}
export interface DamageSource {
    fromCharacterTag: CharacterTag; // 角色类型，使用 CharacterTag 枚举
    attackType: AttackType; // 攻击方式
    level: number;     // 等级
    node?: Node;         // 直接引用攻击者节点
    uuid?: string;         // 唯一标识（如node.uuid）
    skillName?: string;  // 技能名或攻击方式
    sonNodeIndex?: number;     // 子节点索引
    /** 本次结算是否为暴击(Critical)，由掷骰处写入，供受击表现（如飘字颜色）使用 */
    isCritical?: boolean;
    damageValue?: number;
    extra?: any;         // 其他扩展信息
}
/** CommonEvent.EnemyDead 事件载荷，用于区分普通怪/精英等 */
export interface EnemyDeadEventData {
    worldPos: Vec3;
    hurtFrom?: DamageSource;
    characterTag: CharacterTag;
}
export interface SkillConfig {
    /**唯一标识 */
    id: string;
    name: string;
    /**移动速度 */
    moveSpeed: number;
    /**攻击距离 */
    range: number;
    /**持续时间/秒 */
    duration: number;
    /**伤害间隔 */
    damageInterval: number;
    /**同时攻击人数 */
    maxTargets: number;
    /**技能范围*/
    hitRadius: number;
    /**基础伤害值 */
    baseDamage: number;
    cd: number;
    animPath: string;
    prefabPath: PrefabPathEnum | null;
    /**是否已存在序列帧动画 */
    exist?: boolean;
    /**技能动画倍速, 不是特效动画, 默认1 */
    timeScale?: number;
}

/**技能初始化参数接口 */
export interface SkillInitParams {
    /**技能方向（用于发射类技能） */
    direction?: Vec3;
    /**伤害来源 */
    from: DamageSource;
    /**自定义销毁时间 */
    destroyTime?: number;
}

/**技能基类接口（用于类型约束） */
export interface ISkillBase {
    config: SkillConfig;
    damageSource: DamageSource;
    initialize(params: SkillInitParams): void;
    destroySkill(): void;
}