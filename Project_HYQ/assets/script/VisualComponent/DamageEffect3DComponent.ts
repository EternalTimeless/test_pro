import { _decorator, CCFloat, CCInteger, Color, Component, MeshRenderer, tween, Tween } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 伤害特效UI组件
 * 用于显示角色受伤时的红色闪烁效果
 */
@ccclass('DamageEffect3DComp')
export class DamageEffect3DComp extends Component {
    @property({ type: CCFloat, displayName: '闪烁持续时间' })
    flashDuration: number = 0.5;

    @property({ type: MeshRenderer, displayName: '闪烁的模型' })
    protected mod: MeshRenderer | null = null;
    @property({ type: CCInteger })
    passesIndex: number = 1;
    originalColor: Color[] = [];
    flashColor: Color = new Color(255, 0, 0, 255);

    // deathGrayColor: Color = new Color(148, 148, 148, 255);
    deathGrayColor: Color = new Color(255, 255, 255, 255);

    private flashTimeLeft: number = 0;
    private isFlashing: boolean = false;

    /** 首次 initialize 时从材质读入的 emissive 基准色，供回收复用后还原(true base color) */
    private _baseEmissive: Color[] = [];
    private _baseEmissiveSaved: boolean = false;
    /** 与受击 tween 共用的颜色缓冲，便于 Tween.stopAllByTarget 终止闪红 */
    private _tweenColorBuffers: Color[] = [];

    onLoad() {

    }

    onDestroy() {
    }

    /**
     * 初始化伤害特效组件
     */
    public initialize() {
        if (!this.mod) {
            this.isFlashing = false;
            return;
        }
        if (!this._baseEmissiveSaved) {
            this._baseEmissive = [];
            for (let i = 0; i < this.mod.materials.length; i++) {
                const _material = this.mod.materials[i];
                const _index = _material.passes[this.passesIndex].getHandle('emissive');
                const c = new Color();
                _material.passes[this.passesIndex].getUniform(_index, c);
                this._baseEmissive.push(c.clone());
            }
            this._tweenColorBuffers = this._baseEmissive.map(() => new Color());
            this._baseEmissiveSaved = true;
        } else {
            for (let i = 0; i < this._tweenColorBuffers.length; i++) {
                Tween.stopAllByTarget(this._tweenColorBuffers[i]);
            }
            const n = Math.min(this.mod.materials.length, this._baseEmissive.length);
            for (let i = 0; i < n; i++) {
                const _material = this.mod.materials[i];
                const _index = _material.passes[this.passesIndex].getHandle('emissive');
                _material.passes[this.passesIndex].setUniform(_index, this._baseEmissive[i].clone());
            }
        }
        this.originalColor = this._baseEmissive.map(c => c.clone());
        this.isFlashing = false;
        this.flashTimeLeft = 0;
    }

    update(deltaTime: number) {
        // 更新闪烁状态
        if (this.isFlashing) {
            this.flashTimeLeft -= deltaTime;
            if (this.flashTimeLeft <= 0) {
                this.isFlashing = false;
            }
        }
    }

    /**
     * 当受到伤害时调用
     */
    public onDamaged() {
        if (!this.isFlashing) {
            this.showDamageEffect();
            this.startFlash();
        }
    }

    /**
     * 死亡置灰：停止闪红与相关 tween，将 emissive 直接设为 deathGrayColor（无闪烁、与受击同一 emissive 通道）
     */
    public onDeathGrayscale() {
        if (!this.mod || this._baseEmissive.length === 0) {
            this.isFlashing = false;
            this.flashTimeLeft = 0;
            return;
        }
        for (let i = 0; i < this._tweenColorBuffers.length; i++) {
            Tween.stopAllByTarget(this._tweenColorBuffers[i]);
        }
        this.isFlashing = false;
        this.flashTimeLeft = 0;
        const gray = this.deathGrayColor.clone();
        for (let i = 0; i < this._baseEmissive.length; i++) {
            const _material = this.mod.materials[i];
            if (!_material) continue;
            const _index = _material.passes[this.passesIndex].getHandle('emissive');
            _material.passes[this.passesIndex].setUniform(_index, gray);
        }
    }

    /**
     * 显示伤害效果
     */
    public showDamageEffect() {
        if (this.originalColor && this.mod && this._tweenColorBuffers.length) {
            for (let i = 0; i < this.originalColor.length; i++) {
                const _material = this.mod.materials[i];
                const _index = _material.passes[this.passesIndex].getHandle('emissive');
                const _color = this._tweenColorBuffers[i];
                _material.passes[this.passesIndex].getUniform(_index, _color);
                Tween.stopAllByTarget(_color);

                tween(_color)
                    .to(this.flashDuration / 2, {
                        r: this.flashColor.r,
                        g: this.flashColor.g,
                        b: this.flashColor.b,
                        a: this.flashColor.a
                    }, {
                        onUpdate: (target, ratio) => {
                            _material.passes[this.passesIndex].setUniform(_index, target);
                        }
                    })
                    .to(this.flashDuration / 2, {
                        r: this.originalColor[i].r,
                        g: this.originalColor[i].g,
                        b: this.originalColor[i].b,
                        a: this.originalColor[i].a
                    }, {
                        onUpdate: (target, ratio) => {
                            _material.passes[this.passesIndex].setUniform(_index, target);
                        }
                    })
                    .start();
            }
        }
    }

    /**
     * 启动闪红效果
     */
    public startFlash() {
        this.isFlashing = true;
        this.flashTimeLeft = this.flashDuration;
    }
}

