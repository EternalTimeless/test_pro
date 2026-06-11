import { ccenum } from "cc";

export enum CommonEvent {
    ActiveUnlockItem = 'active-unlock-item',
    UnlockItem = 'unlock-item',
    Update = 'update',
    EnemyDead = 'enemy-dead',
    EliteDead = 'elite-dead',
    UnlockHero = 'unloc-hero',
    CreateHero = 'create-hero',
    GameFail = 'game-fail',
    GameSuccess = 'game-success',
    FlashRedWarning = 'flash-red-warning',
    ClearMouseEvent = 'clear-mouse-event',
    BlockUnlock = 'block-unlock',
    HideJoystick = 'hide-joystick',
    ShowJoystick = 'show-joystick',
    /** 方向舵交互区域按下（供钓鱼瞄准等不依赖 VirtualInput 边沿的逻辑） */
    JoystickTouchStart = 'joystick-touch-start',
    /** 方向舵手指抬起 / 取消 */
    JoystickTouchEnd = 'joystick-touch-end',
    PeopleLeave = 'people-leave',
    UnlockSkill = 'unlock-skill',
    UpgradeSkill = 'upgrade-skill',
}
export enum ComponentEvent {
    // 伤害相关
    OnDamage = 'OnDamage',
    OnHealthUpdate = 'OnHealthUpdate',
    OnSkillCDUpdate = 'OnSkillCDUpdate',
    OnHeal = 'OnHeal',
    OnImmune = 'OnImmune',
    OnImmuneEnd = 'on-immune-end',
    OnSkillCoolDown = 'on-skill-cool-down',
    // 状态相关
    OnStateChange = 'on-state-change',
    OnAnimationComplete = 'on-animation-complete',
    OnLoopAnimationComplete = 'on-loop-animation-complete',
    OnAttackFrame = 'on-attack-frame',
    OnMoveChange = `on-move-change`,
    TargetReached = 'target-reached',
    KnockbackStart = 'knockback-start',
    KnockbackEnd = 'knockback-end',
    OnFrameEvent = 'on-frame-event',
}
export enum CharacterStatus {
    Idle = 'Idle',
    Move = 'Move',
    Attack = 'Attack',
    Skill = 'Skill',
    Dead = 'Dead',
    Work = 'Work',
}
/**阵营类型 */
export enum CampType {
    /**建筑/士兵 非敌方普通单位 */
    Normal = 0,
    /**敌人 */
    Enemy = 1,
    /**英雄 */
    Player = 2,
    /**中立 */
    Neutral = 3,
}
export enum BuildUnlockState {
    /**
     * 未激活
     */
    NoActive = 0,
    /**
     * 激活建造
     */
    Active = 1,
    /**
     * 建造完毕
     */
    Builded = 2,
    /**
     * 摧毁
     */
    Destroy = 3,
}

export enum BuildType {
    None = 0,
    /**墙 */
    Wall = 1,
    /**伐木场 */
    BuildWood = 2,
    /**招募伐木工 */
    RecruitmentWood = 4,
    /**商店 */
    Shop = 97,
    /**传送带 */
    Conveyor = 98,
    End = 99,
}
ccenum(BuildType);

/**
 * 碰撞分组标签（全项目统一）
 * BackUp functionS COLLIDE_TYPE 对照：HERO→Player(51) WALL→Wall(1) SHOP→Shop(65)
 * MONSTER→Monster(61) BAG→Bag(66) MOONWALK→MoonWalk(67) TOWER→Tower(68)
 * SPACECRAFT→Spacecraft(69) PLAYERATTACK→PlayerSlash(106)
 */
export enum ColliderGroupTag {
    /**未初始化 */
    Default = 0,
    //基础碰撞相关
    /**墙 */
    Wall = 1,
    /**空气墙, 仅对人生效, 怪物可以穿过 */
    AirWall = 2,
    /**门, 仅对怪物生效, 人可以穿过 */
    Door = 3,
    /**建筑 */
    Build = 4,
    Sell = 5,
    Work = 6,
    //交互相关
    /**建筑解锁 */
    BuildUnlock = 10,
    WoodContainer = 11,
    /**金币获取 */
    GoldContainer = 12,
    // OreContainer = 13,
    // FishingRodContainer = 14,
    // FishingNetContainer = 15,
    // TrainSoldier = 16,
    // DeliveryOre = 17,
    // DeliveryWood = 18,
    // FishingSpot = 19,
    // FishingMachine = 20,
    // ProduceSpot = 21,
    // RecruitSoldier = 22,
    // /** 鱼钩提示节点 */
    // TipHook = 23,
    // FishingEggContainer = 24,
    WeaponContainer = 25,
    //角色相关
    Player = 51,
    Ally = 52,
    People = 53,
    Worker = 54,
    Soldier = 55,
    /**怪物 */
    Monster = 61,
    /**精英怪 */
    Elite = 62,
    /**boss */
    Boss = 63,
    Zombie = 64,
    /** 商店（BackUp COLLIDE_TYPE.SHOP） */
    Shop = 65,
    /** 背包/道具（BackUp COLLIDE_TYPE.BAG） */
    Bag = 66,
    /** 月球漫步区（BackUp COLLIDE_TYPE.MOONWALK） */
    MoonWalk = 67,
    /** 炮塔（BackUp COLLIDE_TYPE.TOWER） */
    Tower = 68,
    /** 飞船（BackUp COLLIDE_TYPE.SPACECRAFT） */
    Spacecraft = 69,
    //战斗相关  
    /**子弹 */
    Bullet = 100,
    /**怪物攻击 */
    EnemyAttack = 105,
    /**挥砍 / 玩家攻击范围（BackUp COLLIDE_TYPE.PLAYERATTACK） */
    PlayerSlash = 106,
    /**子弹翻倍牌 */
    BulletBrand = 107,

    //引导相关
    GuideTips = 200,
    GuideNode1 = 201,

    /**城内 */
    Inside = 999,
}
ccenum(ColliderGroupTag)

/** 玩家子弹 AABB 碰撞默认可命中标签 */
export const BULLET_HIT_ENEMY_TAGS: readonly ColliderGroupTag[] = [
    ColliderGroupTag.Monster,
    ColliderGroupTag.Elite,
    ColliderGroupTag.Boss,
];

export enum HeroType {
    IceMage = 1,
    Astrologer = 2,
    FireMage = 3,
    Warrior = 4,
}
ccenum(HeroType);
export enum WorkerType {
    Sell = 0,
    Collect = 1,
    Carry = 2,
    Wood = 3,
    Iron = 4,
    /**锻造 */
    Forge = 5,
    /**制造 */
    Production = 6,
    MachineFishing = 7,
    None = 99,
}
ccenum(WorkerType);
/**
 * 预制体路径枚举
 */
export enum PrefabPathEnum {
    None = 0,
    // 角色相关
    WORKER = 1,
    PEOPLE = 2,
    CUSTOMER = 3,
    ROLE_Archer = 4,
    ROLE_ICE = 5,
    ROLE_FIRE = 6,
    ROLE_ASTROLOGER = 7,
    PET = 8,
    SOLDIER = 9,
    COIN_GOLD = 20,
    COIN_FOOD = 21,
    COIN_MEAT = 22,
    /**武器 */
    COIN_WEAPON = 23,
    /**木材 */
    COIN_WOOD = 24,
    /**轮胎 */
    PROP_TIRE = 28,
    /**道具牌（传送带） */
    PROP_BRAND = 29,
    /**杂兵 */
    ENEMY_MINION = 61,
    /**精英怪 */
    ENEMY_ELITE = 62,
    /**boss */
    // ENEMY_BOSS = 63,
    //特效相关
    BULLET_GUN_EFFECT = 98,
    BULLET_GUN = 99,
    BULLET_ARROW = 100,
    BULLET_ICE = 101,
    BULLET_FIRE = 102,
    BULLET_ASTROLOGER = 103,
    EFFECT_SLASH = 104,
    EFFECT_HAMMER = 105,
    EFFECT_SKILL_CHARGED = 200,
    EFFECT_ADD = 201,
    EFFECT_BOOM = 202,
    EFFECT_HURT = 203,
    SKILL_ARCHER = 204,
    SKILL_ASTROLOGER = 205,
    SKILL_FIRE = 206,
    SKILL_ICE = 207,
    SKILL_WARRIOR = 208,
    EFFECT_BOOM_POINT = 209,
    EFFECT_WEAPON_UPGRADE = 210,
    /**道具牌拾取-门特效 */
    EFFECT_PROP_DOOR = 211,
    /**道具牌拾取-升级特效 */
    EFFECT_PROP_UP = 212,
    ROPE = 300,
    VIEW_CARD_EFFECT = 301,
    GREEN_ARROW = 996,
    GUIDE_ARROW = 997,
    SHADOW = 998,
    MapTestItem1 = 998,
    MapTestItem2 = 999,
}
ccenum(PrefabPathEnum);

export enum CharacterTag {
    /**未初始化 */
    NoInitialize = -1,
    /**主角 */
    Player = 0,
    /**队友 */
    Ally = 1,
    /**小兵 */
    Soldier = 2,
    /**工人 */
    Worker = 3,
    People = 4,
    /**怪物 */
    Monster = 10,
    /**精英怪 */
    Elite = 11,
    /**boss */
    Boss = 12,
    /**僵尸 */
    ZombieA = 13,
    ZombieB = 15,
    /**门 */
    Gate = 20,
    /**可被攻击的建筑 */
    Build = 24,
    Wall = 25,
    /**轮胎 */
    Tire = 26,
    /**子弹翻倍牌 */
    BulletBrand = 27,
}
ccenum(CharacterTag);
/**
 * 颜色效果类型及优先级(数字越大优先级越高)
 */
export enum ColorEffectType {
    NORMAL = 0,     // 正常颜色
    SLOW = 1,       // 减速效果(蓝色)
    HURT = 2,       // 受伤效果(红色)
    HEAL = 3,       // 治疗效果(绿色)
}
ccenum(ColorEffectType);