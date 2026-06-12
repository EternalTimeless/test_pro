import { _decorator, CCString, Component, Label, Node } from 'cc';
import L18nManager, { LanguageType } from 'db://assets/Script/Base/TextAdaptation/L18Manager';
const { ccclass, property } = _decorator;

@ccclass('ResurrectionL8')
export class ResurrectionL8 extends Component {
    private _lab: Label


    protected start(): void {
        this._lab = this.getComponent(Label);
        switch (L18nManager.instance.lang) {
            //简体中文
            case LanguageType.zh_cn: {
                this._lab.string = "复活";
                break;
            }
            //英语
            case LanguageType.en: {
                this._lab.string = "Revive";
                break;
            }
            //繁体中文
            case LanguageType.zh_ft: {
                this._lab.string = "復活";
                break;
            }
            //法语
            case LanguageType.fr: {
                this._lab.string = "Revivre";
                break;
            }
            //日语
            case LanguageType.ja: {
                this._lab.string = "復活";
                break;
            }
            //德语
            case LanguageType.de: {
                this._lab.string = "Wiederbeleben";
                break;
            }
            //韩语
            case LanguageType.ko: {
                this._lab.string = "부활";
                break;
            }
            //俄语
            case LanguageType.ru: {
                this._lab.string = "Воскресить";
                break;
            }
            //西班牙语
            case LanguageType.es: {
                this._lab.string = "Revivir";
                break;
            }
            //葡萄牙语
            case LanguageType.pt: {
                this._lab.string = "Reviver";
                break;
            }
            //阿拉伯语
            case LanguageType.ar: {
                this._lab.string = "إحياء";
                break;
            }
            //印尼语
            case LanguageType.id: {
                this._lab.string = "Bangkit";
                break;
            }
            //泰语
            case LanguageType.th: {
                this._lab.string = "คืนชีพ";
                break;
            }
            //土耳其语
            case LanguageType.tr: {
                this._lab.string = "Canlan";
                break;
            }
            default: {
                this._lab.string = "Revive";
                break;
            }
        }
    }
}



