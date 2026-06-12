System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, ccenum, EventType, _crd, PoolEnum, PrefabsEnum, LayerEnum, SceneType, SoundEnum, PropEnum, EffectEnum, BulletEnum, FrameAnimEnum, AnimName, RoleEnum, OtherPrefabsEnum, ArmsTypeEnum, MonsterType;

  _export("EventType", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      ccenum = _cc.ccenum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "49e18DZFQlJk7gASUCxeLY9", "EnumList", undefined);

      __checkObsolete__(['ccenum']);

      _export("EventType", EventType = class EventType {});

      EventType.firstClick = "First click";
      EventType.GoldUP = "GoldUP";
      EventType.EFFECT_PLAY_OVER = "Effect_Play_over";
      EventType.PROP_ARMS_DIE = "Prop_Arms_Die";
      EventType.Monster_Attack_Player_ADD = "Monster_Attack_Player_ADD";
      EventType.PLAYER_HIT = "Player_Hit";
      EventType.PLAYER_RESURRECTION = "Player_Resurrection";
      EventType.PLAYER_DIE = "Player_Die";
      EventType.MONSTER_SKILL_XRD = "Monster_Skill_XRD";
      EventType.PLAYER_HIT_2 = "Player_Hit_2";

      _export("PoolEnum", PoolEnum = /*#__PURE__*/function (PoolEnum) {
        PoolEnum["Prop"] = "Prop_";
        PoolEnum["EffectSq"] = "EffectSq_";
        PoolEnum["JumpSequence"] = "JumpSequence_";
        PoolEnum["bullet"] = "bullet_";
        PoolEnum["monster"] = "MonsterManager_";
        PoolEnum["bullet_hit"] = "Bullet_hit_";
        PoolEnum["skill"] = "skill_";
        PoolEnum["skill_hit"] = "skill_hit_";
        PoolEnum["effect"] = "effect_";
        PoolEnum["role"] = "role_";
        PoolEnum["Other"] = "Other_";
        return PoolEnum;
      }({}));

      ccenum(PoolEnum);

      _export("PrefabsEnum", PrefabsEnum = /*#__PURE__*/function (PrefabsEnum) {
        PrefabsEnum[PrefabsEnum["prop"] = 0] = "prop";
        PrefabsEnum[PrefabsEnum["monster"] = 1] = "monster";
        PrefabsEnum[PrefabsEnum["effect"] = 2] = "effect";
        PrefabsEnum[PrefabsEnum["bullet"] = 3] = "bullet";
        PrefabsEnum[PrefabsEnum["hero"] = 4] = "hero";
        PrefabsEnum[PrefabsEnum["other"] = 5] = "other";
        return PrefabsEnum;
      }({}));

      ccenum(PrefabsEnum);

      _export("LayerEnum", LayerEnum = /*#__PURE__*/function (LayerEnum) {
        LayerEnum[LayerEnum["Layer_0_bg"] = 0] = "Layer_0_bg";
        LayerEnum[LayerEnum["Layer_1_Ground"] = 1] = "Layer_1_Ground";
        LayerEnum[LayerEnum["Layer_2_sky"] = 2] = "Layer_2_sky";
        LayerEnum[LayerEnum["BulletLayer"] = 3] = "BulletLayer";
        LayerEnum[LayerEnum["PropBrandLayer"] = 4] = "PropBrandLayer";
        return LayerEnum;
      }({}));

      _export("SceneType", SceneType = /*#__PURE__*/function (SceneType) {
        SceneType[SceneType["D2"] = 0] = "D2";
        SceneType[SceneType["D3"] = 1] = "D3";
        return SceneType;
      }({}));

      ccenum(SceneType);

      _export("SoundEnum", SoundEnum = /*#__PURE__*/function (SoundEnum) {
        SoundEnum["bgm"] = "Sound/bgm";
        SoundEnum["gameWin"] = "Sound/win_music";
        SoundEnum["gameLoser"] = "Sound/lose_music";
        SoundEnum["Sound_FireGun"] = "Sound/Sound_FireGun";
        SoundEnum["Sound_Gun"] = "Sound/Sound_Gun";
        SoundEnum["Sound_Monster_Die"] = "Sound/Sound_Monster_Die";
        SoundEnum["Sound_Monster_Hit"] = "Sound/Sound_Monster_Hit";
        SoundEnum["Sound_Ship_UpLevel"] = "Sound/Sound_Ship_UpLevel";
        SoundEnum["Sound_PlaceGold"] = "Sound/Sound_PlaceGold";
        SoundEnum["sound_met_die"] = "Sound/sound_met_die";
        SoundEnum["Sound_tire_hit"] = "Sound/Sound_tire_hit";
        SoundEnum["Sound_boss_attack"] = "Sound/Sound_boss_attack";
        SoundEnum["Sound_boss_die"] = "Sound/Sound_boss_die";
        SoundEnum["Sound_downST"] = "Sound/Sound_downST";
        return SoundEnum;
      }({}));

      ccenum(SoundEnum);

      _export("PropEnum", PropEnum = /*#__PURE__*/function (PropEnum) {
        PropEnum[PropEnum["null"] = -1] = "null";
        PropEnum[PropEnum["gold"] = 0] = "gold";
        PropEnum[PropEnum["meat"] = 1] = "meat";
        return PropEnum;
      }({}));

      ccenum(PropEnum);

      _export("EffectEnum", EffectEnum = /*#__PURE__*/function (EffectEnum) {
        EffectEnum[EffectEnum["up"] = 0] = "up";
        EffectEnum[EffectEnum["Monsterhit"] = 1] = "Monsterhit";
        EffectEnum[EffectEnum["tireHIt"] = 2] = "tireHIt";
        EffectEnum[EffectEnum["door"] = 3] = "door";
        return EffectEnum;
      }({}));

      ccenum(EffectEnum);

      _export("BulletEnum", BulletEnum = /*#__PURE__*/function (BulletEnum) {
        BulletEnum[BulletEnum["arrow"] = 0] = "arrow";
        BulletEnum[BulletEnum["arrow_1"] = 1] = "arrow_1";
        BulletEnum[BulletEnum["arrow_2"] = 2] = "arrow_2";
        BulletEnum[BulletEnum["arrow_3"] = 3] = "arrow_3";
        BulletEnum[BulletEnum["arrow_4"] = 4] = "arrow_4";
        return BulletEnum;
      }({}));

      ccenum(BulletEnum);

      _export("FrameAnimEnum", FrameAnimEnum = /*#__PURE__*/function (FrameAnimEnum) {
        FrameAnimEnum[FrameAnimEnum["LittleBlueMan"] = 0] = "LittleBlueMan";
        return FrameAnimEnum;
      }({}));

      ccenum(FrameAnimEnum);

      _export("AnimName", AnimName = /*#__PURE__*/function (AnimName) {
        AnimName["idle"] = "idle";
        AnimName["attack"] = "attack";
        AnimName["die"] = "die";
        AnimName["run"] = "run";
        return AnimName;
      }({}));

      _export("RoleEnum", RoleEnum = /*#__PURE__*/function (RoleEnum) {
        RoleEnum[RoleEnum["underling"] = 0] = "underling";
        RoleEnum[RoleEnum["dazhuang"] = 1] = "dazhuang";
        RoleEnum[RoleEnum["dazhuangPlus"] = 2] = "dazhuangPlus";
        return RoleEnum;
      }({}));

      ccenum(RoleEnum);

      _export("OtherPrefabsEnum", OtherPrefabsEnum = /*#__PURE__*/function (OtherPrefabsEnum) {
        OtherPrefabsEnum[OtherPrefabsEnum["tire"] = 0] = "tire";
        return OtherPrefabsEnum;
      }({}));

      _export("ArmsTypeEnum", ArmsTypeEnum = /*#__PURE__*/function (ArmsTypeEnum) {
        ArmsTypeEnum[ArmsTypeEnum["bq"] = 0] = "bq";
        ArmsTypeEnum[ArmsTypeEnum["jq"] = 1] = "jq";
        ArmsTypeEnum[ArmsTypeEnum["jtl"] = 2] = "jtl";
        ArmsTypeEnum[ArmsTypeEnum["jtl2"] = 3] = "jtl2";
        ArmsTypeEnum[ArmsTypeEnum["tk"] = 4] = "tk";
        ArmsTypeEnum[ArmsTypeEnum["jj"] = 5] = "jj";
        return ArmsTypeEnum;
      }({}));

      ccenum(ArmsTypeEnum);

      _export("MonsterType", MonsterType = /*#__PURE__*/function (MonsterType) {
        MonsterType[MonsterType["ZombieBaby_0"] = 0] = "ZombieBaby_0";
        MonsterType[MonsterType["ZombieBaby_1"] = 1] = "ZombieBaby_1";
        MonsterType[MonsterType["ZombieBrother"] = 2] = "ZombieBrother";
        return MonsterType;
      }({}));

      ccenum(MonsterType);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=36b3e2abcf34afcabbbe21f470fbe5270473c51e.js.map