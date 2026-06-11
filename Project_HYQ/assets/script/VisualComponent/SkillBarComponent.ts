import { _decorator, Component, Node, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;


/**
 * 技能CD控制组件
 * 负责技能CD的显示和更新，与数值计算解耦
 */
@ccclass('SkillBarComponent')
export class SkillBarComponent extends Component {
    @property({ type: Node, displayName: '技能CD进度' })
    protected skillNode: Node = null!;
    private circleCd: ProgressBar = null!;

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
        if (this.skillNode) {
            this.skillNode.active = v;
        }
    }
    onLoad() {
    }

    public initData(): void {
        if (this.skillNode) this.circleCd = this.skillNode.getComponent(ProgressBar)!;
        if (this.circleCd) this.circleCd.progress = 1;
        this._isInitialized = true;
        this.isActive = true;
    }

    /**
     * 初始化技能CD
     */
    public initSkillCd(): void {
        if (this.circleCd) this.circleCd.progress = 1;
    }

    /**
     * 更新技能CD显示（仅圆形血条支持）
     * @param cdPercent CD进度百分比 (0-1)，0表示CD中，1表示CD完成
     */
    public updateSkillCD(cdPercent: number): void {
        if (!this.circleCd || !this._isInitialized) {
            return;
        }
        this.circleCd.progress = cdPercent;
    }

    /**
     * 设置可见性
     * @param visible 是否可见
     */
    public setVisible(visible: boolean): void {
        this.isActive = visible;
    }

}

