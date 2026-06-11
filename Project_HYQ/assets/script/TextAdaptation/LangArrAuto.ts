import { _decorator, CCString, Component, Label, Node } from 'cc';
import L18nManager, { LanguageType } from './L18Manager';
const { ccclass, property } = _decorator;

@ccclass("LangArrAuto")
export class LangArrAuto extends Component {

    // @property({ type: [CCString], displayName: "简体中文" })
    // private cnDesc: string[] = [];

    @property({ type: [CCString], displayName: "英文" })
    private enDesc: string[] = [];
    // @property({ type: [CCString], displayName: "繁体中文" })
    // private cn_ftDesc: string[] = [];
    @property({ type: [CCString], displayName: "法语" })
    private frDesc: string[] = [];
    // @property({ type: [CCString], displayName: "日语" })
    // private jaDesc: string[] = [];
    // @property({ type: [CCString], displayName: "韩语" })
    // private koDesc: string[] = [];
    @property({ type: CCString, displayName: "德语" })
    public deDesc: string[] = [];
    @property({ type: CCString, displayName: "白俄罗斯语" })
    public beDesc: string[] = [];
    @property({ type: CCString, displayName: "葡萄牙语" })
    public ptDesc: string[] = [];
    @property({ type: CCString, displayName: "西班牙语" })
    public esDesc: string[] = [];
    @property({ type: CCString, displayName: "土耳其语" })
    public trDesc: string[] = [];
    @property({ type: CCString, displayName: "泰语" })
    public thDesc: string[] = [];
    @property({ type: CCString, displayName: "越南语" })
    public viDesc: string[] = [];
    private curDesc: string = "";

    protected getTipsIndex(index: number): void {
        switch (L18nManager.instance.lang) {
            // case LanguageType.zh_cn: {
            //     this.curDesc = this.cnDesc[index];
            //     break;
            // }
            // case LanguageType.zh_ft: {
            //     this.curDesc = this.cn_ftDesc[index];
            //     break;
            // }
            case LanguageType.en: {
                this.curDesc = this.enDesc[index];
                break;
            }
            case LanguageType.fr: {
                this.curDesc = this.frDesc[index];
                break;
            }
            // case LanguageType.ja: {
            //     this.curDesc = this.jaDesc[index];
            //     break;
            // }
            // case LanguageType.ko: {
            //     this.curDesc = this.koDesc[index];
            //     break;
            // }
            case LanguageType.de: {
                this.curDesc = this.deDesc[index];
                break;
            }
            case LanguageType.be: {
                this.curDesc = this.beDesc[index];
                break;
            }
            case LanguageType.pt: {
                this.curDesc = this.ptDesc[index];
                break;
            }
            case LanguageType.es: {
                this.curDesc = this.esDesc[index];
                break;
            }
            case LanguageType.tr: {
                this.curDesc = this.trDesc[index];
                break;
            }
            case LanguageType.th: {
                this.curDesc = this.thDesc[index];
                break;
            }
            case LanguageType.vi: {
                this.curDesc = this.viDesc[index];
                break;
            }
            default: {
                this.curDesc = this.enDesc[index];
                break;
            }
        }
    }
    getTips(index: number) {
        this.getTipsIndex(index);
        return this.curDesc;
    }

}



