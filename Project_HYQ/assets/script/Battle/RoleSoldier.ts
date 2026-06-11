import { _decorator, MeshRenderer, Node, v3, Vec3 } from 'cc';
import { CharacterBase, MeshFlashData } from './CharacterBase';
import { AttackInfo, GameInfo } from '../Common/GameInfo';
import { CharacterStatus } from '../Common/CommonEnum';
import { AttackCtrl } from '../CharacterCtrl/AttackCtrl';
const { ccclass, property } = _decorator;

/**
 * 人墙士兵：仅表现层（动画/武器/溶解），位移随 Hero 父节点，战斗与离队由 Hero 驱动
 */
@ccclass('RoleSoldier')
export class RoleSoldier extends CharacterBase {

    // ==================== 闪红效果 ====================
    @property({ type: [MeshFlashData], tooltip: '闪红MeshRenderer配置列表，可在属性检查器中编辑' })
    public meshGrayDataList: MeshFlashData[] = [];
    @property({ type: [MeshFlashData], tooltip: '闪红MeshRenderer配置列表，可在属性检查器中编辑' })
    public meshRedDataList: MeshFlashData[] = [];
    @property({ type: [MeshFlashData], tooltip: '闪红MeshRenderer配置列表，可在属性检查器中编辑' })
    public meshCreateDataList: MeshFlashData[] = [];

    @property({ type: [Node], displayName: '武器节点列表' })
    weaponNodes: Node[] = [];
    @property({ type: Node, displayName: '枪口节点' })
    shotNode: Node = null!;
    /** 已离队或处于死亡/溶解流程（Hero 同步动画时跳过） */
    public get isDismissed(): boolean {
        return this.statusComp?.currentState === CharacterStatus.Dead || this.isDissolving;
    }

    onLoad() {
        super.onLoad();
    }

    protected onEnable(): void {
        this.resetDissolveState();
        this.setWeaponVisual(0);
        this._faceTarget();
    }

    setWeaponVisual(lv: number) {
        for (let i = 0; i < this.weaponNodes.length; i++) {
            const node = this.weaponNodes[i];
            if (!node?.isValid) continue;
            node.active = i == lv;
        }
    }

    enterCombatLoop(isMoving: boolean = false) {
        if (!this.statusComp || !this.animComp || this.isDismissed) return;
        if (this.statusComp.currentState !== CharacterStatus.Attack) {
            this.statusComp.changeState(CharacterStatus.Attack);
        } else {
            this.syncCombatAnim(isMoving);
        }
    }

    syncCombatAnim(isMoving: boolean, normalizedProgress?: number) {
        this.applyCombatAnimByMoving(isMoving, normalizedProgress);
    }

    /** 从 Hero 同步攻击属性（攻速/伤害/弹速/子弹等级） */
    syncAttackFrom(source: AttackCtrl) {
        if (!this.attackComp || !source) return;
        this.attackComp.attackSpeed = source.attackSpeed;
        this.attackComp.damageValue = source.damageValue;
        this.attackComp.bulletSpeed = source.bulletSpeed;
        this.attackComp.bulletLevel = source.bulletLevel;
        this.attackComp.updateAttackDuration();
        this.initAnimationTimeScale();
    }

    update(dt: number) {
        if (GameInfo.instance.Over || GameInfo.instance.Pause || !GameInfo.instance.Begin) return;
        if (!this.isDissolving) return;
        this.tickDissolve(dt);
    }

    protected shouldUpdateTarget(): boolean {
        return false;
    }

    protected updateFaceDirection(): void { }

    protected getPotentialTargets(): CharacterBase[] {
        return [];
    }

    protected onDeadEnter(): void {
        super.onDeadEnter();
        this.visualFeedbackComp?.applyDamageEffectDeathGrayscale();
    }

    protected onAnimationComplete() {
        if (this.statusComp?.currentState === CharacterStatus.Dead) {
            this.onDeathAnimationFinished();
            return;
        }
        super.onAnimationComplete();
    }

    protected onLoopAnimationComplete() { }

    protected castSkillEffect(): void { }

    handleRangedAttack(wpos: Vec3, attackInfo: AttackInfo) {
        let shootWorldPos = this.shotNode.worldPosition;
        let direction = this.getModelForwardDirection();
        if (this.attackComp) {
            this.attackComp.createBullet(shootWorldPos, direction, attackInfo.damageSource);
        }
    }
    /** 将模型朝向目标方向 */
    private _faceTarget(target?: Node): void {
        if (!this.ModelNode) return;
        const dir = v3(0, 0, 0);
        if (!target || !target.isValid) {
            dir.set(0, 0, -1);
        } else {
            const aim = target.worldPosition;
            const hp = this.node.worldPosition;
            dir.set(aim.x - hp.x, 0, aim.z - hp.z);
            if (Vec3.equals(dir, Vec3.ZERO)) return;
            Vec3.normalize(dir, dir);
        }
        this.ModelNode.setWorldRotation(this.calculateRotationFromDirection(dir));
        Vec3.copy(this._lastValidDirection, dir);
        Vec3.copy(this._targetDirection, dir);
    }
}
