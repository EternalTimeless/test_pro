import { _decorator, ccenum, CCFloat, CCString, Component, Node } from 'cc';
import { ICharacterListener, VisualCompListener } from '../Manager/InterfaceMgr';
import { CampType, ComponentEvent, PrefabPathEnum } from '../Common/CommonEnum';
import { GameInfo, SkillConfig } from '../Common/GameInfo';
const { ccclass, property } = _decorator;

/**
 * 战斗数据处理
 * 实现 IBattleVal 接口，管理角色战斗数值和技能数据
 */
@ccclass('BattleValCtrl')
export class BattleValCtrl extends Component {
    @property({
        visible: false,
        displayName: '技能ID',
        tooltip: '技能ID, 用于从SkillCfg中索引配置'
    })
    public skillId: string = "";

    @property({
        type: CCFloat,
        displayName: '最大生命值',
        range: [1, 20000],
        tooltip: '角色的最大生命值'
    })
    public maxHealth: number = 500;
    @property({
        type: CCFloat,
        displayName: '初始生命值',
        range: [1, 20000],
        tooltip: '角色的初始生命值'
    })
    public startHealth: number = 500;


    @property({ type: CCFloat, displayName: "伤害免疫时间" })
    damageImmunityTime: number = 0.5;

    invincibleDuration: number = 10;

    public onCharacterListener: ICharacterListener = null!;
    // 回调接口 - 用于向视觉组件推送数值更新
    public visualCompListener: VisualCompListener | null = null;

    /**等级  用于计算伤害 */
    public level: number = 0;
    /**技能配置缓存 */
    public skillConfig: SkillConfig | null = null;
    private _currentHealth: number = 100;
    private _isImmune: boolean = false;
    private _immunityTimeLeft: number = 0;
    private _isInvincible: boolean = false;
    private _invincibleTimer: number = 0;
    /**当前血量 */
    public get currentHealth(): number { return this._currentHealth; }
    public set currentHealth(value: number) {
        const previousHealth = this._currentHealth;
        this._currentHealth = Math.max(0, Math.min(value, this.maxHealth));

        if (this._currentHealth !== previousHealth) {
            // 直接更新UI
            this.updateHpUI();
        }
    }
    /**血量百分比 */
    public get healthPercentage(): number {
        return this.maxHealth > 0 ? this._currentHealth / this.maxHealth : 0;
    }
    /**是否死亡 */
    public get isDead(): boolean { return this._currentHealth <= 0; }
    /**是否处于免疫状态 */
    public get isImmune(): boolean { return this._isImmune; }
    /**是否处于无敌状态 */
    public get isInvincible(): boolean { return this._isInvincible; }

    /**技能冷却cd */
    public skillCooldown: number = 0;
    /**技能是否解锁 */
    public unlockSkill: boolean = false;
    private _curSkillTimer: number = 0;
    /**技能倒计时 */
    public get currentSkillTime(): number { return this._curSkillTimer; }
    //可用于技能恢复或者减少CD
    public set currentSkillTime(value: number) { this._curSkillTimer = value; }
    protected curCampType: CampType = CampType.Normal;
    onLoad(): void {

    }
    protected onDestroy() {
    }
    protected update(dt: number): void {
        if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin) return;
        // 更新免疫状态时间
        if (this._isImmune) {
            this._immunityTimeLeft -= dt;
            if (this._immunityTimeLeft <= 0) {
                this._isImmune = false;
            }
        }

        // 更新无敌状态时间
        if (this._isInvincible && this.invincibleDuration > 0) {
            this._invincibleTimer += dt;
            if (this._invincibleTimer >= this.invincibleDuration) {
                this.cancelInvincible();
            }
        }
        //更新技能CD
        if (this.unlockSkill) {
            this.handleSkillCooldown(dt);
        }
    }
    /**技能CD刷新 */
    protected handleSkillCooldown(dt: number) {
        if (this._curSkillTimer > 0) {
            this._curSkillTimer -= dt;
            if (this._curSkillTimer <= 0) {
                this.setSkillCoolDown();
            }
            // 技能CD进度
            const cdProgress = 1 - this._curSkillTimer / this.skillCooldown;
            // 使用回调替代事件（技能CD更新）
            this.visualCompListener?.onSkillCDUpdate?.(cdProgress);
        }
    }
    /**立即恢复技能CD */
    public setSkillCoolDown() {
        this._curSkillTimer = 0;
        this.node.emit(ComponentEvent.OnSkillCoolDown);
    }
    public setCampType(campType: CampType) {
        this.curCampType = campType;
    }
    /**
     * 血条数据 初始化
     * @param maxHealth 最大血量
     * @param startHealth 初始血量
     */
    public initializeHealth(startHealth?: number, maxHealth?: number): void {
        this.maxHealth = maxHealth !== undefined ? maxHealth : this.maxHealth;
        this._currentHealth = startHealth !== undefined ? startHealth : this.startHealth;
        //初始化UI
        this.updateHpUI();
    }
    /**技能初始化 */
    public initSkillData(): SkillConfig | null {
        // 如果 skillId 为空，不加载配置
        if (!this.skillId) {
            this.skillConfig = null;
            return null;
        }

        // 从 SkillCfg 加载配置并缓存
        this.skillConfig = SkillCfg.getSkillConfig(this.skillId);

        if (!this.skillConfig) {
            // console.warn(`[BattleValCtrl] 未找到技能配置, 技能ID: ${this.skillId}`);
            return null;
        }
        // 使用配置中的 CD 初始化技能数据
        this.skillCooldown = this.skillConfig.cd;
        this.currentSkillTime = this.skillCooldown;
        this.visualCompListener?.onSkillCDUpdate?.(1);
        return this.skillConfig;
    }
    /**技能解锁状态 */
    public setUnlockSkill(isUnlock: boolean) {
        this.unlockSkill = isUnlock;
    }
    /**技能冷却重置 */
    public resetSkill() {
        this.currentSkillTime = this.skillCooldown;
    }
    /** 立即死亡 */
    public promptlyDead() {
        this._currentHealth = 0;
        this.updateHpUI();
        if (this.onCharacterListener) {
            this.onCharacterListener.onDead();
        }
    }
    /** 实体受到伤害时调用 */
    public takeDamage(amount: number): boolean {
        if (this.isDead || amount <= 0 || this._isImmune || this._isInvincible) return false;

        const previousHealth = this._currentHealth;
        this._currentHealth = Math.max(0, this._currentHealth - amount);

        const actualDamage = previousHealth - this._currentHealth;

        if (actualDamage > 0) {
            this.updateHpUI();
            // 启动免疫状态
            this.startImmunity();
            // 检查死亡状态
            if (this.isDead && this.onCharacterListener) {
                this.onCharacterListener.onDead();
            }

            return true;
        }
        return false;
    }

    /** 实体恢复生命值时调用 */
    public heal(value: number, isPercent: boolean = false): boolean {
        if (this.isDead || value <= 0) return false;

        const previousHealth = this._currentHealth;
        if (isPercent) {
            value = this.maxHealth * value
        }
        this._currentHealth = Math.min(this.maxHealth, this._currentHealth + value);

        const actualHeal = this._currentHealth - previousHealth;

        if (actualHeal > 0) {
            this.updateHpUI();
            return true;
        }
        return false;
    }

    /** 实体复活时调用 */
    public revive(value?: number): boolean {
        if (!this.isDead) return false;
        this.initializeHealth(value, this.maxHealth);
        this.resetSkill();
        this.cancelInvincible();
        this.cancelImmunity();
        this.updateHpUI();
        return true;
    }
    /**复活 百分比血量 */
    public reviveByPercent(value?: number): boolean {
        if (!this.isDead) return false;
        value = value || 1;
        value = Math.max(0, value);
        value = Math.min(1, value);
        const healthAmount = value * this.maxHealth;
        this.initializeHealth(healthAmount, this.maxHealth);
        this.resetSkill();
        this.cancelInvincible();
        this.cancelImmunity();
        this.updateHpUI();
        return true;
    }

    // 更新数值监听
    private updateHpUI(): void {
        // 使用回调替代事件（健康值更新）
        this.visualCompListener?.onHealthUpdate?.(this.healthPercentage);
    }
    /**启动伤害免疫 */
    private startImmunity() {
        if (this.damageImmunityTime <= 0) return;
        this._isImmune = true;
        this._immunityTimeLeft = this.damageImmunityTime;
    }
    private cancelImmunity() {
        this._isImmune = false;
        this._immunityTimeLeft = 0;
    }
    /** 自定义扣血后触发受伤免疫窗口 */
    public triggerDamageImmunity(): void {
        this.startImmunity();
    }
    /**设置无敌状态 */
    public setInvincible(duration: number = 0) {
        this._isInvincible = true;
        this.invincibleDuration = duration;
        this._invincibleTimer = 0;
    }

    /**取消无敌状态 */
    public cancelInvincible() {
        this._isInvincible = false;
        this.invincibleDuration = 0;
        this._invincibleTimer = 0;
    }
}

export class SkillCfg {
    public static Skills: SkillConfig[] = [{
        id: "Fire",
        moveSpeed: 80,
        // directionType: "FixedPos",
        range: 500,
        duration: 0,
        damageInterval: 0.5,
        maxTargets: 100,
        hitRadius: 250,
        baseDamage: 20,
        name: "Fire",
        cd: 20,
        animPath: "",
        prefabPath: PrefabPathEnum.SKILL_FIRE,
        exist: true,
        //1s
        // timeScale: 0.45,
    },
    {
        id: "Ice",//男冰法
        moveSpeed: 20,
        // directionType: "FixedPos",
        range: 500,
        duration: 0,
        damageInterval: 0.5,
        maxTargets: 100,
        hitRadius: 250,
        baseDamage: 20,
        name: "Ice",
        cd: 20,
        animPath: "",
        prefabPath: PrefabPathEnum.SKILL_ICE,
        exist: true,
        // timeScale: 1,
    },
    {
        id: "Archer",
        moveSpeed: 20,
        // directionType: "FixedTimer",
        range: 500,
        duration: 0,
        damageInterval: 0.5,
        maxTargets: 100,
        hitRadius: 300,
        baseDamage: 20,
        name: "Arrows",
        cd: 20,
        animPath: "",
        prefabPath: PrefabPathEnum.SKILL_ARCHER,
        exist: true,
        // timeScale: 0.8,
    },
    {
        id: "Astrologer",//占星师
        moveSpeed: 20,
        // directionType: "FixedPos",
        range: 500,
        duration: 0,
        damageInterval: 0.5,
        maxTargets: 100,
        hitRadius: 250,
        baseDamage: 20,
        name: "Lightning",
        cd: 20,
        animPath: "",
        prefabPath: PrefabPathEnum.SKILL_ASTROLOGER,
        exist: true,
        // timeScale: 1,
    },
    {
        id: "Warrior",
        moveSpeed: 1.5,//2D-->10
        // directionType: "RadialTimer",
        range: 500,
        duration: 2,
        damageInterval: 0.5,
        maxTargets: 100,
        hitRadius: 200,
        baseDamage: 20,
        name: "Hurricane",
        cd: 20,
        animPath: "",
        prefabPath: PrefabPathEnum.SKILL_WARRIOR,
        exist: true,
        //0.73
        // timeScale: 0.4,
    }
    ]
    public static getSkillConfig(skillId: string): SkillConfig {
        return this.Skills.find(skill => skill.id === skillId);
    }
}
