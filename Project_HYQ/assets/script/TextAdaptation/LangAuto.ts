import { _decorator, CCString, Component, Label } from 'cc';
import L18nManager, { LanguageType } from './L18Manager';
const { ccclass, property } = _decorator;

@ccclass('LangAuto')
export class LangAuto extends Component {


    private _lab: Label
    // @property({ type: CCString, displayName: "简体中文" })
    // public cnDesc: string;
    // @property({ type: CCString, displayName: "繁体中文" })
    // public cn_ftDesc: string;
    @property({ type: CCString, displayName: "英文" })
    public enDesc: string;
    @property({ type: CCString, displayName: "法语" })
    public frDesc: string;
    // @property({ type: CCString, displayName: "日语" })
    // public jaDesc: string;
    // @property({ type: CCString, displayName: "韩语" })
    // public koDesc: string;
    @property({ type: CCString, displayName: "德语" })
    public deDesc: string;
    @property({ type: CCString, displayName: "白俄罗斯语" })
    public beDesc: string;
    @property({ type: CCString, displayName: "葡萄牙语" })
    public ptDesc: string;
    @property({ type: CCString, displayName: "西班牙语" })
    public esDesc: string;
    @property({ type: CCString, displayName: "土耳其语" })
    public trDesc: string;
    @property({ type: CCString, displayName: "泰语" })
    public thDesc: string;
    @property({ type: CCString, displayName: "越南语" })
    public viDesc: string;
    protected start(): void {
        this._lab = this.getComponent(Label);
        switch (L18nManager.instance.lang) {
            // case LanguageType.zh_cn: {
            //     this._lab.string = this.cnDesc;
            //     break;
            // }
            // case LanguageType.zh_ft: {
            //     this._lab.string = this.cn_ftDesc;
            //     break;
            // }
            case LanguageType.en: {
                this._lab.string = this.enDesc;
                break;
            }
            case LanguageType.fr: {
                this._lab.string = this.frDesc;
                break;
            }
            // case LanguageType.ja: {
            //     this._lab.string = this.jaDesc;
            //     break;
            // }
            // case LanguageType.ko: {
            //     this._lab.string = this.koDesc;
            //     break;
            // }
            case LanguageType.de: {
                this._lab.string = this.deDesc;
                break;
            }
            case LanguageType.be: {
                this._lab.string = this.beDesc;
                break;
            }
            case LanguageType.pt: {
                this._lab.string = this.ptDesc;
                break;
            }
            case LanguageType.es: {
                this._lab.string = this.esDesc;
                break;
            }
            case LanguageType.tr: {
                this._lab.string = this.trDesc;
                break;
            }
            case LanguageType.th: {
                this._lab.string = this.thDesc;
                break;
            }
            case LanguageType.vi: {
                this._lab.string = this.viDesc;
                break;
            }
            default: {
                this._lab.string = this.enDesc;
                break;
            }
        }
    }


}



