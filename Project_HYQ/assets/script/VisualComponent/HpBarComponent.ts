import { _decorator, Component, Label, Node, ProgressBar, SpriteFrame, tween } from 'cc';
import { CampType } from '../Common/CommonEnum';
const { ccclass, property } = _decorator;

/**
 * 血条UI组件
 * 整合了血条的显示、更新和控制功能
 */
@ccclass('HpBarComponent')
export class HpBarComponent extends Component {
    @property({ type: [SpriteFrame], displayName: '血条颜色' })
    protected sps: SpriteFrame[] = [];

    @property({ type: Node, displayName: '血条底板' })
    protected bar_bg: Node = null!;

    @property({ type: Node, displayName: '条状血条' })
    protected bar: Node = null!;
    @property({ type: Node, displayName: '圆形血条底板' })
    protected circle_bg: Node = null!;
    @property({ type: Node, displayName: '圆形血条' })
    protected circle_bar: Node = null!;


    @property({ type: Label, displayName: '调试' })
    protected debugNum: Label = null!;
    @property({ displayName: '满血时始终显示血条' })
    protected alwaysShow: boolean = false;
    private barBg: ProgressBar = null!;
    private barHp: ProgressBar = null!;
    private circleHp: ProgressBar = null!;
    private campType: CampType = CampType.Normal;
    //灰血下降速度, 需要跟随尺寸变动
    private speed: number = 3;
    private _isInitialized: boolean = false;

    /**是否可见，必须在初始化之后可用，默认隐藏 */
    private _isActive: boolean = false;

    public get isActive(): boolean {
        return this._isActive;
    }

    public set isActive(v: boolean) {
        if (this._isActive === v) {
            return;
        }
        this._isActive = v;
        if (this.node) {
            this.node.active = v;
        }
    }

    onLoad(): void {

    }

    /**
     * 血条初始化
     * @param barType 血条类型
     * @param value 血条进度
     */
    public initHealthBar(campType: CampType, value: number = 1): void {
        if (this.bar_bg) this.barBg = this.bar_bg.getComponent(ProgressBar)!;
        if (this.bar) this.barHp = this.bar.getComponent(ProgressBar)!;
        if (this.circle_bar) this.circleHp = this.circle_bar.getComponent(ProgressBar)!;

        if (campType !== undefined) {
            this.campType = campType;
        }
        //TODO: 圆形血条的底框没隐藏
        switch (this.campType) {
            case CampType.Normal:
            case CampType.Enemy:
            case CampType.Player:
                if (this.circle_bg) this.circle_bg.active = false;
                if (this.barHp && this.sps[this.campType]) {
                    this.barHp.barSprite.spriteFrame = this.sps[this.campType];
                }
                break;
            //NOTE: 此项目主角不使用圆形血条
            // case CampType.Player:
            //     if (this.bar_bg) this.bar_bg.active = false;
            //     break;
            default:
                console.error('血条类型错误');
                break;
        }

        if (this.barHp) this.barHp.progress = value;
        if (this.barBg) this.barBg.progress = 1;
        if (this.circleHp) this.circleHp.progress = 1;
        this.isActive = false;
        this._isInitialized = true;
    }


    /**
     * 刷新血条
     */
    update(dt: number): void {
        // if (this.campType !== CampType.Player && this.isActive) 
        if (this.isActive) {
            const diff = this.barBg.progress - this.barHp.progress;
            if (diff > 0) {
                if (diff < 0.01) {
                    this.barBg.progress = this.barHp.progress;
                } else {
                    // 扣假血
                    this.barBg.progress -= this.speed * dt;
                }
            } else {
                // 加血
                this.barBg.progress = this.barHp.progress;
            }
            if (this.barBg.progress === 0 && this.barHp.progress === 0) {
                this.isActive = false;
            }
        }
    }

    /**
     * 更新血条显示
     * @param healthPercent 血量百分比 (0-1)
     */
    public updateHealth(healthPercent: number): void {
        if (!this._isInitialized) {
            return;
        }
        
        //NOTE: 圆形血条打开以下注释
        // if (this.campType === CampType.Player) {
        //     this.circleHpChange = healthPercent;
        // } else {
        //     this.hpValChange = healthPercent;
        // }
        this.hpValChange = healthPercent;
    }

    /**
     * 血条UI变化 0-1
     */
    public set hpValChange(value: number) {
        if (!this.barHp) return;

        if (this.barHp.progress > 0 && !this.isActive) {
            this.isActive = true;
        }
        if (value === 1 && this.barHp.progress === 1 && this.isActive && !this.alwaysShow) {
            this.isActive = false;
            return;
        }
        const diff = this.barHp.progress - value;
        if (diff === 0) return;

        // 不是瞬间扣血
        if (Math.abs(diff) > 0.1) {
            tween(this.barHp).to(0.1, { progress: value }, { easing: 'quadOut' }).start();
        } else {
            this.barHp.progress = value;
        }
    }

    /**
     * 圆形血条UI变化 0-1
     */
    public set circleHpChange(value: number) {
        if (!this.circleHp) return;
        if (this.circleHp.progress > 0 && !this.isActive) {
            this.isActive = true;
        }
        // 满血时才显示血条
        if (value === 1 && this.circleHp.progress === 1 && this.isActive && !this.alwaysShow) {
            this.isActive = false;
            return;
        }
        const diff = this.circleHp.progress - value;
        if (diff === 0) return;

        // 不是瞬间扣血
        if (Math.abs(diff) > 0.1) {
            tween(this.circleHp).to(0.1, { progress: value }, { easing: 'quadOut' }).start();
        } else {
            this.circleHp.progress = value;
        }
    }

    /**
     * 设置血条可见性
     * @param visible 是否可见
     */
    public setVisible(visible: boolean): void {
        this.isActive = visible;
    }
}

