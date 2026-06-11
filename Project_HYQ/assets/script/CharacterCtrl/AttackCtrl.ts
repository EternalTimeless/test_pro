import { _decorator, Component, Node, Vec3, Prefab, CCFloat, CCInteger, v3, Quat, quat } from 'cc';
import { AttackInfo, AttackType, GameInfo, SceneType, DamageSource } from '../Common/GameInfo';
import { CharacterTag, PrefabPathEnum } from '../Common/CommonEnum';
import BulletBattle3D from '../Bullet/BulletBattle3D';
const { ccclass, property } = _decorator;

@ccclass('AttackCtrl')
export class AttackCtrl extends Component {
    @property({ type: AttackType })
    attackType: AttackType = AttackType.Melee;

    @property({ type: CCFloat, displayName: '攻击范围', range: [0, 1000], tooltip: '攻击范围' })
    attackRange: number = 5;
    /**视野 */
    @property({ type: CCFloat, displayName: '视野范围', range: [1, 2000], tooltip: '视野范围' })
    visionRange: number = 200;
    /**攻击速度 */
    @property({ type: CCFloat, displayName: '攻击速度', range: [0, 10], tooltip: '攻击速度(每秒攻击 N 次)' })
    attackSpeed: number = 1;
    /**攻击动画实际时长 */
    protected _attackAnimDuration: number = 1.0;
    @property({ type: CCFloat, displayName: '攻击冷却(暂时弃用此属性, 使用攻击速度代替)', range: [0, 5], tooltip: '攻击冷却时间(秒)', visible: false })
    attackCooldown: number = 0.5;
    @property({ type: CCFloat, displayName: '跟踪更新间隔', range: [0, 5], tooltip: '跟踪更新间隔' })
    trackingUpdateInterval: number = 0.5;
    @property({ type: CCFloat, displayName: '伤害', range: [0, 1000], tooltip: '伤害' })
    damageValue: number = 10;
    @property({ type: CCFloat, displayName: '子弹速度', range: [0, 100], tooltip: '子弹速度' })
    bulletSpeed: number = 60;
    @property({ type: PrefabPathEnum, displayName: '子弹预制体' })
    bulletPrefab: PrefabPathEnum = PrefabPathEnum.None;
    /** 当前子弹外观等级，创建子弹时传给 Bullet.initData（与预制体下 bullets 子节点索引对应） */
    public bulletLevel: number = 0;
    @property({ type: PrefabPathEnum, displayName: '近战特效预制体' })
    slashEffectPrefab: PrefabPathEnum = PrefabPathEnum.None;
    /**暴击率 */
    critRate: number = 0.0;
    /**暴击伤害倍率 */
    public readonly critDamage: number = 1.5;
    /**
     * 暴击保底(Pity)：连续未暴击时累加的基础暴击率，暴击命中后清零。
     * 例如 critRate=0.01 时，第 n 次判定概率为 min(1, n * critRate)，最多 100 次内必暴。
     */
    private _critPityBonus: number = 0;
    /**自动攻击模式, 无锁定目标, 默认向移动方向攻击 */
    public isAutoAttack: boolean = true;
    private _lastAttackTime: number = -999;

    /** 攻击事件回调（由角色类实现具体的攻击逻辑） */
    public onAttackExecute?: (attackInfo: AttackInfo) => void;

    /** 攻击请求（由状态机调用，负责动画切换） */
    requestAttack() {
        if (!this.canAttack) return false;
        this._lastAttackTime = performance.now() * 0.001;
        return true;
    }
    protected onLoad(): void {
        this.updateAttackDuration();
    }
    /** 执行攻击（由动画事件回调调用） */
    executeAttack(type: CharacterTag) {
        const damageSource: DamageSource = {
            fromCharacterTag: type,
            attackType: this.attackType,
            node: this.node,
            uuid: this.node.uuid,
            level: 0,
            // skillName、extra 可在技能系统补充
        };
        const attackInfo: AttackInfo = {
            damage: this.damageValue,
            worldPos: this.node.worldPosition.clone(),
            range: this.attackRange,
            type: this.attackType,
            source: this.node,
            damageSource,
        };
        if (this.onAttackExecute) {
            this.onAttackExecute(attackInfo);
        }
    }
    /**
     * 按暴击率与保底计算最终伤害（子弹/挥砍等在创建时调用一次即可固定本次伤害）。
     * @returns value 最终伤害数值；isCritical 是否为暴击，需写入 DamageSource.isCritical
     */
    rollDamage(damageValue: number): { value: number; isCritical: boolean } {
        const base = this.critRate;
        const effective = Math.min(1, base + this._critPityBonus);
        if (Math.random() < effective) {
            this._critPityBonus = 0;
            return { value: damageValue * this.critDamage, isCritical: true };
        }
        //NOTE: 暂时关闭暴击保底
        // this._critPityBonus += base * 0.5;
        return { value: damageValue, isCritical: false };
    }
    /** 创建子弹（自定义 AABB 碰撞，无物理） */
    createBullet(wpos: Vec3, direction: Vec3, damageSource?: DamageSource) {
        if (!this.bulletPrefab) return;
        const roll = this.rollDamage(this.damageValue);
        const src = damageSource ? { ...damageSource, isCritical: roll.isCritical } : undefined;

        const bullet = GameInfo.instance.prefabMgr.getPrefab(this.bulletPrefab);
        if (!bullet) return;
        bullet.setParent(GameInfo.instance.gameMgr.bulletLayer);

        if (GameInfo.SceneType == SceneType.D2) {
            bullet.setWorldPosition(v3(wpos.x, wpos.y, 0));
            const bulletComp = bullet.getComponent('Bullet2D');
            if (bulletComp && typeof bulletComp['initData'] === 'function') {
                bulletComp['initData'](roll.value, direction, this.bulletSpeed, 3, 1000, src, this.bulletLevel);
            }
            return;
        }

        bullet.setWorldPosition(v3(wpos.x, wpos.y, wpos.z));
        let bulletComp = bullet.getComponent(BulletBattle3D);
        if (!bulletComp) {
            bulletComp = bullet.addComponent(BulletBattle3D);
        }
        const dir = v3(direction);
        if (dir.lengthSqr() < 1e-8) {
            dir.set(0, 0, -1);
        }
        Vec3.normalize(dir, dir);
        bulletComp.setBulletInfo(roll.value, dir, this.bulletSpeed, this.bulletLevel, this.bulletPrefab);
    }
    /** 创建挥砍特效 */
    createSlashEffect(parent: Node, wpos: Vec3, direction: Vec3, level: number, damageSource?: DamageSource) {
        if (!this.slashEffectPrefab) return;
        const roll = this.rollDamage(this.damageValue);
        const src = damageSource ? { ...damageSource, isCritical: roll.isCritical } : undefined;
        const slashEffect = GameInfo.instance.prefabMgr.createSlashEffect(parent, v3(0, 0, 0), level);
        if (GameInfo.SceneType == SceneType.D2) {
            const slashEffectComp = slashEffect.getComponent('SlashEffect2D');
            slashEffect.setParent(parent);
            slashEffect.setWorldPosition(v3(wpos.x, wpos.y, wpos.z));
            if (slashEffectComp && typeof slashEffectComp['initData'] === 'function') {
                slashEffectComp['initData'](roll.value, direction, src, false);
            }
        } else {
            const slashEffectComp = slashEffect.getComponent('SlashEffect');
            slashEffect.setParent(parent);
            slashEffect.setWorldPosition(v3(wpos.x, wpos.y, wpos.z));
            if (slashEffectComp && typeof slashEffectComp['initData'] === 'function') {
                slashEffectComp['initData'](roll.value, direction, src, false);
            }
        }
    }
    /**更新攻击动画时长 */
    public updateAttackDuration() {
        // attackSpeed 表示“每秒攻击 N 次”，动画实际时长由 1/N 推导
        const safeSpeed = Math.max(0.0001, this.attackSpeed);
        //保留三位小数
        this._attackAnimDuration = Math.floor((1 / safeSpeed) * 1000) / 1000;
    }
    public get attackAnimDuration(): number {
        return this._attackAnimDuration;
    }
    // /** 检查目标是否在攻击范围内 */
    // isTargetInRange(target: Node): boolean {
    //     const dist = Vec3.distance(this.node.worldPosition, target.worldPosition);
    //     return dist <= this.attackRange;
    // }

    get canAttack(): boolean {
        // 攻击间隔以 attackSpeed/attackAnimDuration 为主；attackCooldown 预留为额外间隔(可选)
        const baseInterval = this.attackAnimDuration;
        const extraInterval = Math.max(0, this.attackCooldown);
        return (performance.now() * 0.001 - this._lastAttackTime) >= (baseInterval + extraInterval);
    }
}


