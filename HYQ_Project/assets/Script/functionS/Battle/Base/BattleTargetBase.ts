import { _decorator, CCFloat, Color, Component, MeshRenderer, Node } from 'cc';
import { HpComponent } from '../HpComponent';
import { FlashRedManager } from './FlashRedManager';
import { UnityUpComponent } from '../../../Base/UnityUpComponent';
const { ccclass, property } = _decorator;

export const BattleStateEvent = {
    damage: 'damage',
    die: 'die',
}

/**
 * 闪红单个属性配置
 */
@ccclass('MeshFlashPropData')
export class MeshFlashPropData {

    @property({ tooltip: '材质颜色属性名，如 emissive、mainColor、albedo、baseColor' })
    public propName: string = 'emissive';

    @property({ tooltip: '该属性所属的Pass索引（通道）' })
    public passIndex: number = 0;

    @property({ tooltip: '目标材质索引（-1=所有材质，0+=仅指定材质）' })
    public matIndex: number = -1;
}

/**
 * 闪红开关属性配置（float类型uniform，如 u_flashEnable 0→1→0）
 */
@ccclass('MeshFlashSwitchData')
export class MeshFlashSwitchData {

    @property({ tooltip: '属性名，如 u_flashEnable' })
    public propName: string = 'u_flashEnable';

    @property({ tooltip: '该属性所属的Pass索引（通道）' })
    public passIndex: number = 0;

    @property({ tooltip: '目标材质索引（-1=所有材质，0+=仅指定材质）' })
    public matIndex: number = -1;

    @property({ tooltip: '闪红时设置的值（如1=开启）' })
    public flashValue: number = 1;

    @property({ tooltip: '恢复时设置的值（如0=关闭），默认0' })
    public restoreValue: number = 0;

    @property({ tooltip: '使用Material.setProperty设置（用于带target映射的属性，如grayEnable→grayParam.x）' })
    public useMaterialProp: boolean = false;
}

/**
 * 闪红MeshRenderer配置
 */
@ccclass('MeshFlashData')
export class MeshFlashData {

    @property(MeshRenderer)
    public meshRender: MeshRenderer = null!;

    @property({ type: [MeshFlashPropData], tooltip: '闪红时修改的材质颜色属性列表，每个属性指定所属Pass通道' })
    public colorProps: MeshFlashPropData[] = [];

    @property({ type: [MeshFlashSwitchData], tooltip: '闪红时修改的开关属性列表（float类型，如 u_flashEnable 0→1→0）' })
    public switchProps: MeshFlashSwitchData[] = [];
}

/**
 * 表示该物体可以被攻击
 * 
 */
@ccclass('BattleTargetBase')
export abstract class BattleTargetBase extends UnityUpComponent {



    @property(Node)
    private hitNode_2: Node;

    public get hitNode() {
        if (!this.hitNode_2 || !this.hitNode_2.isValid) {
            return this.node;
        }
        return this.hitNode_2;
    }




    @property(CCFloat)
    public MaxHp: number = 500;
    private defMaxHp: number = 0;
    protected curHp: number = 0;

    public isDestroy: boolean = false;

    @property(HpComponent)
    public hpC: HpComponent;



    protected onLoad(): void {
        this.initHp();
    }

    public initHp(difficulty: number = 1): void {
        if (!this.defMaxHp) {
            this.defMaxHp = this.MaxHp;
        }
        this.MaxHp = this.defMaxHp * difficulty;
        // console.log(this.MaxHp);
        this.curHp = this.MaxHp;
        this.isDestroy = false;
    }

    public initFixedHp(maxHp: number): void {
        if (!this.defMaxHp) {
            this.defMaxHp = this.MaxHp;
        }
        this.MaxHp = Math.max(1, maxHp);
        this.curHp = this.MaxHp;
        this.isDestroy = false;
        if (this.hpC) {
            this.hpC.value = 1;
        }
    }

    public Hit(damage: number): number {
        if (this.isDie) {
            return 0;
        }
        this.curHp -= damage;
        this.curHp = Math.max(0, this.curHp);
        this.curHp = Math.min(this.MaxHp, this.curHp);
        let value = this.curHp / this.MaxHp;
        this.damage(damage);
        this.node.emit(BattleStateEvent.damage, damage);
        if (this.isDie) {
            this.die();
            this.node.emit(BattleStateEvent.die, damage);
        }
        if (this.hpC) {
            this.hpC.value = value;
        }
        return value;
    }

    public abstract repelBattleTarget(target: Node, reoel: number): void;



    public get isDie() {
        return this.curHp <= 0 || this.isDestroy;
    }




    protected abstract damage(power: number): void;
    protected abstract die(): void;

    public init(difficulty: number) {
        this.initHp(difficulty);
        if (this.hpC) {
            this.hpC.value = 1;
        }
    }

    // ==================== 闪红效果 ====================
    @property({ type: [MeshFlashData], tooltip: '闪红MeshRenderer配置列表，可在属性检查器中编辑' })
    public meshFlashDataList: MeshFlashData[] = [];

    /**
     * 闪红效果：将对应MeshRenderer的材质设为红色，持续一段时间后恢复
     * 委托给 FlashRedManager 统一管理，保证合批
     * - 闪红途中再次调用不会触发
     * - 闪红前记录原始颜色值，闪红后精确恢复
     * - 每个MeshRenderer可单独配置颜色属性名列表，兼容不同shader
     * @param duration 闪红持续时间（秒），默认0.15
     * @param flashColor 闪红颜色，默认红色 (255,50,50,255)
     */
    public flashRed(duration: number = 0.15, flashColor: Color | null = null, ground: string = null): void {
        if (this.isDie) return;
        FlashRedManager.instance.flashRed(this.node, this.meshFlashDataList, duration, flashColor, ground);
    }

    /**
     * 停止闪红效果，立即恢复原始共享材质
     */
    public stopFlashRed(): void {
        FlashRedManager.instance.stopFlashRed(this.node);
    }
}


