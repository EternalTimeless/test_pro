import { ccenum } from "cc";

export class EventType {
    public static readonly firstClick = "First click";
    public static readonly GoldUP = "GoldUP";
    public static readonly EFFECT_PLAY_OVER = "Effect_Play_over";
    public static readonly PROP_ARMS_DIE = "Prop_Arms_Die";
    public static readonly MONSTER_WAVE_STAGE = "Monster_Wave_Stage";
    public static readonly Monster_Attack_Player_ADD = "Monster_Attack_Player_ADD";
    public static readonly PLAYER_HIT = "Player_Hit";
    public static readonly PLAYER_RESURRECTION = "Player_Resurrection";
    public static readonly PLAYER_ROLE_UPGRADE_COMMITTED = "Player_Role_Upgrade_Committed";
    public static readonly PLAYER_DIE = "Player_Die";
    public static readonly MONSTER_SKILL_XRD = "Monster_Skill_XRD";
    public static readonly PLAYER_HIT_2 = "Player_Hit_2";

}
export enum PoolEnum {
    Prop = "Prop_",
    EffectSq = "EffectSq_",
    JumpSequence = "JumpSequence_",
    bullet = "bullet_",
    monster = "MonsterManager_",
    bullet_hit = "Bullet_hit_",
    skill = "skill_",
    skill_hit = "skill_hit_",
    effect = "effect_",
    role = "role_",
    Other = "Other_"
}
ccenum(PoolEnum)

export enum PrefabsEnum {
    prop,
    monster,
    effect,
    bullet,
    hero,
    other,
}

ccenum(PrefabsEnum)

export enum LayerEnum {
    /**地面背景  显示在最后面  最先渲染 */
    Layer_0_bg,
    /**
     * 地面 
     */
    Layer_1_Ground,
    /**
     * 天空 显示在最上层 最后渲染
     */
    Layer_2_sky,
    /**
     * 子弹层
     */
    BulletLayer,
    /**
     * 道具层
     */
    PropBrandLayer,
}
export enum SceneType {
    D2,
    D3
}
ccenum(SceneType)

export enum SoundEnum {
    bgm = "Sound/bgm",
    gameWin = "Sound/win_music",
    gameLoser = "Sound/lose_music",
    Sound_FireGun = "Sound/Sound_FireGun",
    Sound_Gun = "Sound/Sound_Gun",
    Sound_Monster_Die = "Sound/Sound_Monster_Die",
    Sound_Monster_Hit = "Sound/Sound_Monster_Hit",
    Sound_Ship_UpLevel = "Sound/Sound_Ship_UpLevel",
    Sound_PlaceGold = "Sound/Sound_PlaceGold",
    sound_met_die = "Sound/sound_met_die",
    Sound_tire_hit = "Sound/Sound_tire_hit",
    Sound_boss_attack = "Sound/Sound_boss_attack",
    Sound_boss_die = "Sound/Sound_boss_die",
    Sound_downST = "Sound/Sound_downST",

}
ccenum(SoundEnum);

export enum PropEnum {
    null = -1,
    gold,
    meat,
    // 其他道具
}
ccenum(PropEnum);

export enum EffectEnum {
    up,
    Monsterhit,
    tireHIt,
    door,
}
ccenum(EffectEnum);

export enum BulletEnum {
    arrow,
    arrow_1,
    arrow_2,
    arrow_3,
    arrow_4,
}
ccenum(BulletEnum);


export enum FrameAnimEnum {
    LittleBlueMan,

}
ccenum(FrameAnimEnum);
export enum AnimName {
    idle = "idle",
    attack = "attack",
    die = "die",
    run = "run"
}

export enum RoleEnum {
    underling,
    dazhuang,
    dazhuangPlus,
}
ccenum(RoleEnum)


export enum OtherPrefabsEnum {
    tire,
    youtong,
}

export enum ArmsTypeEnum {
    none = -1,
    bq,
    jq,
    jtl,
    jtl2,
    tk,
    jj,
}
ccenum(ArmsTypeEnum);

export enum MonsterType {
    ZombieBaby_0,
    ZombieBaby_1,
    ZombieBrother,
}
ccenum(MonsterType)
