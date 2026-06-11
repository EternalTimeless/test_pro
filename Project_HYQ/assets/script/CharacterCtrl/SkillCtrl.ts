import { _decorator, Component, Vec3, v3 } from 'cc';
import { DamageSource, GameInfo, SkillConfig } from '../Common/GameInfo';
import { AudioMgr, SoundEnum } from '../Core/Managers/AudioMgr';
import { MathUtil } from '../Extra/MathUtil';
import { SkillCfg } from './BattleValCtrl';
import { CameraCtrl } from './CameraCtrl';
const { ccclass, property } = _decorator;

/**
 * 技能控制组件
 * 负责技能配置缓存和技能表现
 * 纯表现组件，不查询数据，通过外部推送状态
 */
@ccclass('SkillCtrl')
export class SkillCtrl extends Component {
    /**技能配置缓存 */
    private _config: SkillConfig | null = null;
    /**技能是否冷却完成（由外部推送） */
    public isCoolDown: boolean = false;

    onLoad() {
        // 注意：不在 onLoad 中加载配置，而是等待外部初始化
        // 这样可以确保组件初始化顺序正确
    }

    /**
     * 初始化技能（由CharacterBase在初始化时调用）
     * @param config 技能配置对象（由BattleValCtrl提供）
     */
    public initialize(config: SkillConfig): void {
        if (!config) {
            console.warn(`[SkillCtrl] 技能配置为空，无法初始化`);
            return;
        }

        this._config = config;
    }

    /**
     * 获取当前技能配置
     */
    public get config(): SkillConfig | null {
        return this._config;
    }

    /**
     * 检查是否可以释放技能
     * @returns 如果可以释放返回true，否则返回false
     */
    public canCastSkill(): boolean {
        // 检查是否有配置
        if (!this._config) {
            return false;
        }

        // 检查冷却状态（由外部推送维护）
        if (!this.isCoolDown) {
            return false;
        }

        return true;
    }

    /**
     * 释放技能（主入口）
     * @param pos 技能释放位置
     * @param from 伤害来源
     * @param dir 技能方向（可选）
     */
    public castSkill(pos: Vec3, from: DamageSource, dir?: Vec3): void {
        if (!this._config) {
            console.warn(`[SkillCtrl] 技能配置未加载，无法释放技能`);
            return;
        }

        // 调用技能表现逻辑
        this.playSkillEffect(this._config.id, pos, from, dir);
    }

    /**
     * 技能表现逻辑总入口（整合自 SkillSetCtrl）
     * 根据不同技能ID执行不同的表现效果
     * @param skillId 技能ID
     * @param pos 技能释放位置
     * @param from 伤害来源
     * @param dir 技能方向（可选）
     */
    protected playSkillEffect(skillId: string, pos: Vec3, from: DamageSource, dir?: Vec3): void {
        // 调整位置（抬高一点，避免贴地）
        pos = v3(pos.x, pos.y + 0.6, pos.z);

        // 根据技能ID执行不同的表现
        // 预留：可在此处实现各技能的特殊表现逻辑
        switch (skillId) {
            case "Archer":
                return;
                // this.playArcherSkill(pos, from, dir);
                break;
            case "Ice":
                this.playIceSkill(pos, from, dir);
                break;
            case "Astrologer":
                this.playAstrologerSkill(pos, from, dir);
                break;
            case "Fire":
                this.playFireSkill(pos, from, dir);
                break;
            case "Warrior":
                this.playWarriorSkill(pos, from, dir);
                break;
            default:
                // 默认简单表现
                this.createSkillEffect(pos, from, dir);
                break;
        }
    }

    /**
     * 箭雨技能表现（预留实现）
     */
    protected playArcherSkill(pos: Vec3, from: DamageSource, dir?: Vec3): void {
        let count = 60;
        let points = MathUtil.generatePointsInCircle(pos, count, 500, 0.15);
        for (let i = 0; i < count; i++) {
            const p = points[i];
            const delay = 0.12 * (i > 12 ? 12 : i) * Math.random();
            this.scheduleOnce(() => {
                this.createSkillEffect(p, from);
                this.scheduleOnce(() => {
                    AudioMgr.instance.playSound(SoundEnum.Sound_Skill_Arrow, 0.3);
                    CameraCtrl.instance.screenShake(0.2, 10);
                }, 0.36);
            }, delay);
        }
    }

    /**
     * 冰锥技能表现（预留实现）
     */
    protected playIceSkill(pos: Vec3, from: DamageSource, dir?: Vec3): void {
        if (!dir) dir = v3(1, 0, 0);
        let countIce = 30;
        const icePoints = MathUtil.getUniformRandomPointsInSemicircle(pos, dir, countIce, 500);
        for (let i = 0; i < countIce; i++) {
            const p = icePoints[i];
            const delay = (i > 10 ? 10 : i) * Math.random() * 0.1;
            this.scheduleOnce(() => {
                AudioMgr.instance.playSound(SoundEnum.Sound_Skill_Ice, 0.3);
                this.createSkillEffect(p, from, null, 1.5);
                this.scheduleOnce(() => {
                    CameraCtrl.instance.screenShake(0.05, 10);
                })
            }, delay);
        }
    }

    /**
     * 占星师技能表现（预留实现）
     */
    protected playAstrologerSkill(pos: Vec3, from: DamageSource, dir?: Vec3): void {
        let countLight = 40;
        const lightPoints = MathUtil.generatePointsInCircle(pos, countLight, 400, 5);
        for (let i = 0; i < countLight; i++) {
            const p = lightPoints[i];
            const delay = (i > 10 ? 10 : i) * Math.random() * 0.15;
            this.scheduleOnce(() => {
                AudioMgr.instance.playSound(SoundEnum.Sound_Skill_Lightning, 0.3);
                this.createSkillEffect(p, from);
                CameraCtrl.instance.screenShake(0.05, 10);
            }, delay);
        }
    }

    /**
     * 火焰技能表现（预留实现）
     */
    protected playFireSkill(pos: Vec3, from: DamageSource, dir?: Vec3): void {
        let countFire = 40;
        const firePoints = MathUtil.generatePointsInCircle(pos, countFire, 400, 5);
        for (let i = 0; i < countFire; i++) {
            const p = firePoints[i];
            const delay = (i > 6 ? 6 : i) * Math.random() * 0.15;
            this.scheduleOnce(() => {
                AudioMgr.instance.playSound(SoundEnum.Sound_Skill_Fire, 0.3);
                this.createSkillEffect(p, from);
                CameraCtrl.instance.screenShake(0.1, 10);
            }, delay);
        }
    }

    /**
     * 战士技能表现（预留实现）
     */
    protected playWarriorSkill(pos: Vec3, from: DamageSource, dir?: Vec3): void {
        // 预留：战士技能的复杂表现逻辑（三向扩散）
        /*
        if (!dir) dir = v3(1, 0, 0);
        this.createSkillEffect(pos, from, dir);
        let angle = Math.PI * 3 / 18;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        let dir1 = v3(
            dir.x * cosA + dir.z * sinA,
            0,
            dir.z * cosA - dir.x * sinA,
        );
        let dir2 = v3(
            dir.x * cosA - dir.z * sinA,
            0,
            dir.z * cosA + dir.x * sinA,
        );
        this.scheduleOnce(() => {
            this.createSkillEffect(pos, from, dir1);
            this.createSkillEffect(pos, from, dir2);
        }, 0.1);
        */
        this.createSkillEffect(pos, from, dir);
    }

    /**
     * 创建技能特效（基础方法）
     * @param pos 技能位置
     * @param from 伤害来源
     * @param dir 技能方向（可选）
     * @param destroyTime 销毁时间（可选）
     */
    protected createSkillEffect(pos: Vec3, from: DamageSource, dir?: Vec3, destroyTime?: number): void {
        // 如果配置了预制体路径，创建技能特效
        if (this._config.prefabPath) {
            const prefab = GameInfo.instance.prefabMgr.getPrefab(this._config.prefabPath);
            if (prefab) {
                // 1. 外部统一设置节点属性
                prefab.setParent(GameInfo.instance.gameMgr.effLayer);
                prefab.setWorldPosition(pos);
                prefab.setScale(v3(1, 1, 1));

                // 2. 类型安全的组件获取（支持 2D/3D）
                const skillBase2D = prefab.getComponent('SkillBase2D');
                const skillBase3D = prefab.getComponent('SkillBase3D');
                const skillBase = skillBase2D || skillBase3D;

                if (skillBase) {
                    // 3. 注入配置
                    skillBase['config'] = this._config;
                    // 4. 调用统一的 initialize 接口
                    if (typeof skillBase['initialize'] === 'function') {
                        skillBase['initialize']({
                            direction: dir,
                            from: from,
                            destroyTime: destroyTime
                        });
                    }
                } else {
                    console.error(`[SkillCtrl] 预制体 ${this._config.prefabPath} 缺少 SkillBase 组件`);
                    GameInfo.instance.prefabMgr.recoverPrefab(prefab);
                }
            }
        }
    }
    testCreateSKill(id: number, pos: Vec3, from: DamageSource, dir?: Vec3) {
        let name = "";
        switch (id) {
            case 0:
                name = "Archer";
                break;
            case 1:
                name = "Ice";
                break;
            case 2:
                name = "Astrologer";
                break;
            case 3:
                name = "Fire";
                break;
            default:
                name = "Ice";
                break;
        }
        /**TODO: 
         * 技能配置表很多数据过度设计了, 大多数都无用;
         * 有用参数只有伤害,冷却,预制路径, 持续时间, 考虑将这4个参数提取到skillCtrl的配置参数中
         * 考虑此作弊方法以方便测试技能效果, 暂时不重构技能配置表;
         * 后续考虑 将BattleValCtrl中skillId的参数迁移到此脚本中, 方便后续重构, 唯一的麻烦点: 
         * 因为托管给了BattleValCtrl技能配置以便获取cd时间更新联动技能冷却的UI, 重构skill初始化时要传递时间参数, 技能是否解锁的参数仍然保留在BattleValCtrl中, 当初这样设计是为了BattleValCtrl托管所有数据, 然后将数据分发给相关的视觉层的脚本
         * 现在感觉过于复杂了, skillId和BattleValCtrl解绑, skillCtrl初始化只需要传递CD时间参数即可;
         * 这样外部调用skill只需要对应的技能名字即可释放任意技能, 方便作弊测试;
         */
        this._config = SkillCfg.getSkillConfig(name);
        this.playSkillEffect(name, pos, from, dir);
    }
}

