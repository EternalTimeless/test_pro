import { _decorator, Color, Component, Node, ParticleSystem, Prefab, v3, Vec3 } from 'cc';
import { PrefabPathEnum } from '../Common/CommonEnum';
import { DamageSource, GameInfo, SceneType } from '../Common/GameInfo';
import { AnimationCtrl } from '../Other/AnimationCtrl';
const { ccclass, property } = _decorator;

@ccclass('PrefabManager')
export class PrefabManager extends Component {

    //角色类
    @property({ type: Prefab, displayName: '小怪预制体', group: '角色' })
    public enemyPrefab: Prefab = null!;
    @property({ type: Prefab, displayName: '精英预制体', group: '角色' })
    public elitePrefab: Prefab = null;
    @property({ type: Prefab, displayName: '村民预制体', group: '角色', visible: false })
    public peoplePrefab: Prefab = null;
    @property({ type: Prefab, displayName: '工人预制体', group: '角色', visible: false })
    public workerPrefab: Prefab = null;
    @property({ type: Prefab, displayName: '顾客预制体', group: '角色', visible: false })
    public customerPrefab: Prefab = null;
    @property({ type: Prefab, displayName: '士兵1预制体', group: '角色' })
    public soldierPrefab: Prefab = null;
    @property({ type: Prefab, displayName: '士兵2预制体', group: '角色' })
    public soldierPrefab2: Prefab = null;
    @property({ type: Prefab, displayName: '士兵3预制体', group: '角色' })
    public soldierPrefab3: Prefab = null;
    // @property({ type: Prefab, displayName: '弓手预制体', group: '角色' })
    // public role1Prefab: Prefab = null;
    // @property({ type: Prefab, displayName: '冰法师预制体', group: '角色' })
    // public role2Prefab: Prefab = null;
    // @property({ type: Prefab, displayName: '火法师预制体', group: '角色' })
    // public role3Prefab: Prefab = null;
    // @property({ type: Prefab, displayName: '占星师预制体', group: '角色' })
    // public role4Prefab: Prefab = null;
    //资源类
    @property({ type: Prefab, displayName: '金币预制体', group: 'Item' })
    private goldPrefab: Prefab = null;
    @property({ type: Prefab, displayName: '木材预制体', group: 'Item' })
    woodPrefab: Prefab = null;
    @property({ type: Prefab, displayName: '武器升级预制体', group: 'Item', visible: false })
    private weaponUpgradePrefab: Prefab = null;
    @property({ type: Prefab, displayName: '武器预制体', group: 'Item' })
    private weaponPrefab: Prefab = null;
    @property({ type: Prefab, displayName: '轮胎预制体', group: 'Item' })
    private tirePrefab: Prefab = null;
    @property({ type: Prefab, displayName: '道具牌预制体', group: 'Item' })
    private propBrandPrefab: Prefab = null;
    //特效类
    @property({ type: Prefab, displayName: '枪械子弹预制体', group: '环境特效' })
    bulletPrefab: Prefab = null;
    @property({ type: Prefab, displayName: '射击特效预制体', group: '环境特效' })
    private shootEffectPrefab: Prefab = null;
    // @property({ type: Prefab, displayName: '冰法师子弹预制体', group: '环境特效' })
    // bullet2Prefab: Prefab = null;
    // @property({ type: Prefab, displayName: '火法师子弹预制体', group: '环境特效' })
    // bullet3Prefab: Prefab = null;
    // @property({ type: Prefab, displayName: '占星师子弹预制体', group: '环境特效' })
    // bullet4Prefab: Prefab = null;
    // @property({ type: Prefab, displayName: '防御塔弓箭预制体', group: '环境特效' })
    // bullet5Prefab: Prefab = null;
    @property({ type: Prefab, displayName: '怪物受伤特效', group: '环境特效' })
    public monsterHurtEffect: Prefab = null;
    @property({ type: Prefab, displayName: '爆点特效', group: '环境特效' })
    private boomPointEffect: Prefab = null;
    @property({ type: Prefab, displayName: '爆炸特效', group: '环境特效' })
    private boomEffect: Prefab = null;
    @property({ type: Prefab, displayName: '解锁/升级特效', group: '环境特效' })
    private addEffect: Prefab = null;
    // @property({ type: Prefab, displayName: '蓄力特效', group: '环境特效' })
    // private chargedEffect: Prefab = null;
    @property({ type: Prefab, displayName: '挥砍特效预制体', group: '环境特效' })
    private slashEffectPrefab: Prefab = null;
    @property({ type: Prefab, displayName: '锤子特效预制体', group: '环境特效' })
    private hammerEffectPrefab: Prefab = null;
    @property({ type: Prefab, displayName: '飘字', group: '环境特效' })
    private floatText: Prefab = null;
    @property({ type: Prefab, displayName: '绿色箭头特效预制体', group: '环境特效', visible: false })
    private greenArrowPrefab: Prefab = null;
    @property({ type: Prefab, displayName: '3D场景箭头特效预制体', group: '环境特效' })
    private guideArrowPrefab: Prefab = null;
    @property({ type: Prefab, displayName: '道具牌拾取门特效', group: '环境特效' })
    private propDoorEffectPrefab: Prefab = null;
    @property({ type: Prefab, displayName: '道具牌拾取升级特效', group: '环境特效' })
    private propUpEffectPrefab: Prefab = null;
    // @property({ type: Prefab, displayName: '弓手技能特效', group: '技能' })
    // private skill_ArcherEffect: Prefab = null;
    // @property({ type: Prefab, displayName: '冰法师技能特效', group: '技能' })
    // private skill_IceEffect: Prefab = null;
    // @property({ type: Prefab, displayName: '火法师技能特效', group: '技能' })
    // private skill_FireEffect: Prefab = null;
    // @property({ type: Prefab, displayName: '占星师技能特效', group: '技能' })
    // private skill_AstrologerEffect: Prefab = null;
    // @property({ type: Prefab, displayName: '战士技能特效', group: '技能' })
    // private skill_WarriorEffect: Prefab = null;

    @property({ type: Prefab, displayName: '影子预制体', visible: false })
    shadowPrefab: Prefab = null;
    @property({ type: Prefab, displayName: '界面卡片特效' })
    viewCardEffectPrefab: Prefab = null;
    protected onLoad(): void {
        GameInfo.instance.prefabMgr = this;
    }
    getPrefab(prefabPath: PrefabPathEnum): Node | null {
        let prefab = null;
        switch (prefabPath) {
            // case PrefabPathEnum.Skill_Archer:
            //     prefab = this.skill_ArcherEffect;
            //     break;
            // case PrefabPathEnum.Skill_Ice:
            //     prefab = this.skill_IceEffect;
            //     break;
            // case PrefabPathEnum.Skill_Fire:
            //     prefab = this.skill_FireEffect;
            //     break;
            // case PrefabPathEnum.Skill_Astrologer:
            //     prefab = this.skill_AstrologerEffect;
            //     break;
            case PrefabPathEnum.BULLET_GUN:
                prefab = this.bulletPrefab;
                break;
            case PrefabPathEnum.BULLET_GUN_EFFECT:
                prefab = this.shootEffectPrefab;
                break;
            // case PrefabPathEnum.Bullet_Ice:
            //     prefab = this.bullet2Prefab;
            //     break;
            // case PrefabPathEnum.Bullet_Fire:
            //     prefab = this.bullet3Prefab;
            //     break;
            // case PrefabPathEnum.Bullet_Astrologer:
            //     prefab = this.bullet4Prefab;
            //     break;
            // case PrefabPathEnum.Bullet_Tower:
            //     prefab = this.bullet5Prefab;
            //     break;
            case PrefabPathEnum.PEOPLE:
                prefab = this.peoplePrefab;
                break;
            case PrefabPathEnum.WORKER:
                prefab = this.workerPrefab;
                break;
            case PrefabPathEnum.CUSTOMER:
                prefab = this.customerPrefab;
                break;
            case PrefabPathEnum.SOLDIER:
                prefab = this.soldierPrefab;
                break;
            case PrefabPathEnum.ENEMY_MINION:
                prefab = this.enemyPrefab;
                break;
            case PrefabPathEnum.ENEMY_ELITE:
                prefab = this.elitePrefab;
                break;
            case PrefabPathEnum.EFFECT_WEAPON_UPGRADE:
                prefab = this.weaponUpgradePrefab;
                break;
            case PrefabPathEnum.EFFECT_PROP_DOOR:
                prefab = this.propDoorEffectPrefab;
                break;
            case PrefabPathEnum.EFFECT_PROP_UP:
                prefab = this.propUpEffectPrefab;
                break;
            case PrefabPathEnum.EFFECT_BOOM:
                prefab = this.boomEffect;
                break;
            case PrefabPathEnum.EFFECT_ADD:
                prefab = this.addEffect;
                break;
            case PrefabPathEnum.EFFECT_BOOM_POINT:
                prefab = this.boomPointEffect;
                break;
            // case PrefabPathEnum.EFFECT_SKILL_CHARGED:
            //     prefab = this.chargedEffect;
            //     break;
            case PrefabPathEnum.EFFECT_HURT:
                prefab = this.monsterHurtEffect;
                break;
            case PrefabPathEnum.COIN_GOLD:
                prefab = this.goldPrefab;
                break;
            case PrefabPathEnum.COIN_WOOD:
                prefab = this.woodPrefab;
                break;
            case PrefabPathEnum.COIN_WEAPON:
                prefab = this.weaponPrefab;
                break;
            case PrefabPathEnum.PROP_TIRE:
                prefab = this.tirePrefab;
                break;
            case PrefabPathEnum.PROP_BRAND:
                prefab = this.propBrandPrefab;
                break;
            // case PrefabPathEnum.COIN_MEAT:
            //     prefab = this.meatPrefab;
            //     break;
            // case PrefabPathEnum.COIN_FISH:
            //     prefab = this.fishPrefab;
            //     break;
            case PrefabPathEnum.EFFECT_SLASH:
                prefab = this.slashEffectPrefab;
                break;
            case PrefabPathEnum.EFFECT_HAMMER:
                prefab = this.hammerEffectPrefab;
                break;
            case PrefabPathEnum.SHADOW:
                prefab = this.shadowPrefab;
                break;
            case PrefabPathEnum.GREEN_ARROW:
                prefab = this.greenArrowPrefab;
                break;
            case PrefabPathEnum.GUIDE_ARROW:
                prefab = this.guideArrowPrefab;
                break;
            // case PrefabPathEnum.ROLE_Archer:
            //     prefab = this.role1Prefab;
            //     break;
            // case PrefabPathEnum.ROLE_Ice:
            //     prefab = this.role2Prefab;
            //     break;
            // case PrefabPathEnum.ROLE_Fire:
            //     prefab = this.role3Prefab;
            //     break;
            // case PrefabPathEnum.ROLE_Astrologer:
            //     prefab = this.role4Prefab;
            //     break;
            case PrefabPathEnum.VIEW_CARD_EFFECT:
                prefab = this.viewCardEffectPrefab;
                break;
            default:
                console.error(`预制体路径不存在: ${prefabPath}`);
                return null;
        }
        return app.res.createByPrefab(prefab)
    }
    recoverPrefab(prefab: Node) {
        app.res.recoverByPool(prefab);
    }
    getSkillEffect(skillName: string): Node | null {
        return;
    }
    /**解锁特效 */
    public createAddEffect(worldPos: Vec3, scale: Vec3 = v3(0.5, 0.5, 0.8)) {
        //帧动画特效
        const effect = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.EFFECT_ADD);
        if (!effect) {
            return;
        }
        if (GameInfo.SceneType === SceneType.D3) {
            //粒子特效
            worldPos.y += 0.2;
            effect.setParent(GameInfo.instance.gameMgr.effLayer);
            effect.setWorldPosition(worldPos);
            effect.setScale(scale);
            this.PlayEffect(effect, true);
            this.scheduleOnce(() => {
                this.PlayEffect(effect, false);
                app.res.recoverByPool(effect);
            }, 1);
        } else {
            const aniCtrl = effect.getComponent(AnimationCtrl);
            if (!aniCtrl) {
                app.res.recoverByPool(effect);
                return;
            }
            worldPos.y += 120;
            effect.setParent(GameInfo.instance.gameMgr.effLayer);
            effect.setWorldPosition(worldPos);
            effect.setScale(scale);

            this.scheduleOnce(() => {
                aniCtrl.play({
                    loop: false,
                    enableFrameHold: true,
                    onComplete: () => {
                        app.res.recoverByPool(effect);
                    }
                });
            }, 0.0);
        }
    }
    public createChargedEffect(parent: Node) {
        let effect = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.EFFECT_SKILL_CHARGED)
        parent.addChild(effect);
        let aniCtrl = effect.getComponent(AnimationCtrl);
        if (!aniCtrl) {
            console.error(
                `[PrefabManager] createChargedEffect 失败：\n` +
                `Prefab "${PrefabPathEnum.EFFECT_SKILL_CHARGED}" 缺少 AnimationCtrl 组件`);
            // 回收节点并返回，阻断后续调用
            app.res.recoverByPool(effect);
            return;
        }
        // console.log("播放蓄力特效", new Date().toISOString());
        aniCtrl.play({
            loop: true,
            enableFrameHold: true,
            onComplete: () => { }
        });
        this.scheduleOnce(() => {
            // console.log("回收蓄力特效", new Date().toISOString());
            app.res.recoverByPool(effect);
        }, 1.6);
    }
    /**2D界面卡片特效 */
    public createViewCardEffect(parent: Node, pos: Vec3) {
        let effect = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.VIEW_CARD_EFFECT);
        if (!effect) return;
        parent.addChild(effect);
        effect.setPosition(pos);
        let aniCtrl = effect.getComponent(AnimationCtrl);
        if (!aniCtrl) {
            app.res.recoverByPool(effect);
            return;
        }
        aniCtrl.play({
            loop: false,
            enableFrameHold: true,
            onComplete: () => {
                app.res.recoverByPool(effect);
            }
        });
    }
    /**爆炸特效 */
    public createBoomEffect(worldPos: Vec3, scale: Vec3 = v3(1, 1, 1)) {
        // const effect = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.BoomEffect)
        // effect.setParent(this.effLayer);
        // worldPos.y += 2.5;
        // effect.setWorldPosition(worldPos);
        // effect.setScale(scale);
        // // CameraCtrl.instance.screenShake3D(0.1, 0.2);
        // AudioMgr.instance.playSound(SoundEnum.sound_boom, 0.25);
        // this.scheduleOnce(() => {
        //     GameInfo.instance.prefabMgr.recoverPrefab(effect);
        // }, 1)
    }
    public createSlashEffect(parent: Node, pos: Vec3, level: number) {
        let prefabPath = PrefabPathEnum.EFFECT_HAMMER;
        let slashEffect = GameInfo.instance.prefabMgr.getPrefab(prefabPath);
        if (!slashEffect) return
        parent.addChild(slashEffect);
        slashEffect.setPosition(pos);
        if (GameInfo.SceneType === SceneType.D3) {
            this.PlayEffect(slashEffect, true);
            this.scheduleOnce(() => {
                this.PlayEffect(slashEffect, false);
                app.res.recoverByPool(slashEffect);
            }, 1);
        } else {
            let aniCtrl = slashEffect.getComponent(AnimationCtrl);
            if (!aniCtrl) {
                app.res.recoverByPool(slashEffect);
                return null;
            }
            aniCtrl.play({
                loop: false,
                enableFrameHold: true,
                onComplete: () => {
                    app.res.recoverByPool(slashEffect);
                }
            });
        }

        return slashEffect;
    }
    createBoomPointEffect(wpos: Vec3) {
        let effect = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.EFFECT_BOOM_POINT);
        if (!effect) return
        effect.setParent(GameInfo.instance.gameMgr.effLayer);
        effect.setWorldPosition(wpos);
        this.PlayEffect(effect, true);
        this.scheduleOnce(() => {
            this.PlayEffect(effect, false);
            app.res.recoverByPool(effect);
        }, 1);
    }
    createMonsterHurtEffect(parent: Node, pos: Vec3) {
        let effect = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.EFFECT_HURT);
        if (!effect) return
        parent.addChild(effect);
        effect.setPosition(pos);
        this.PlayEffect(effect, true);
        this.scheduleOnce(() => {
            this.PlayEffect(effect, false);
            app.res.recoverByPool(effect);
        }, 1);
    }
    /** 创建子弹 */
    createBullet(wpos: Vec3, direction: Vec3, damageSource?: DamageSource) {
        if (!this.bulletPrefab) return;
        const src = damageSource ? { ...damageSource } : undefined;
        const bullet = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.BULLET_GUN);
        bullet.setParent(GameInfo.instance.gameMgr.effLayer);
        bullet.setWorldPosition(v3(wpos.x, wpos.y, wpos.z));
        const bulletComp = bullet.getComponent('Bullet');
        if (bulletComp && typeof bulletComp['initData'] === 'function') {
            bulletComp['initData'](damageSource.damageValue, direction, 15, 3, 30, src, damageSource.level);
        }
    }
    /** 普通伤害飘字黄色、暴击红色 */
    private static readonly _floatTextNormalColor = new Color(255, 245, 0, 255);
    private static readonly _floatTextCritColor = new Color(255, 60, 60, 255);

    createFloatText(wpos: Vec3, content: string, isRed?: boolean) {
        let txt = app.res.createByPrefab(this.floatText);
        txt.setParent(GameInfo.instance.gameMgr.effLayer)
        txt.setWorldPosition(wpos);
        const v = txt.getComponent("FloatText");
        if (v && typeof v['showBubble'] === 'function') {
            const c = isRed ? PrefabManager._floatTextCritColor : PrefabManager._floatTextNormalColor;
            v['showBubble'](content, c);
        }
    }
    public createPropUpEffect(parent: Node, pos: Vec3, scale: Vec3 = v3(1.5, 1.5, 1.5)) {
        //帧动画特效
        const effect = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.EFFECT_PROP_UP);
        if (!effect) {
            return;
        }
        effect.setParent(parent);
        effect.setPosition(pos);
        effect.setScale(scale);
        this.PlayEffect(effect, true);
        this.scheduleOnce(() => {
            this.PlayEffect(effect, false);
            app.res.recoverByPool(effect);
        }, 1);
    }
    /**播放粒子特效 */
    PlayEffect(effect: Node, isPlay: boolean = true) {
        if (isPlay) {
            let selfPart = effect.getComponent(ParticleSystem);
            if (selfPart)
                selfPart.play();
            let len = effect.children.length;
            for (let i = 0; i < len; i++) {
                let _part = effect.children[i].getComponent(ParticleSystem);
                if (_part)
                    _part.play();
            }
        } else {
            let selfPart = effect.getComponent(ParticleSystem);
            if (selfPart)
                selfPart.stop();
            let len = effect.children.length;
            for (let i = 0; i < len; i++) {
                let _part = effect.children[i].getComponent(ParticleSystem);
                if (_part)
                    _part.stop();
            }
        }
    }
}


