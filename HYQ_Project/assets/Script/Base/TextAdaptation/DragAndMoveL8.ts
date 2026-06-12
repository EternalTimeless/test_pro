import { _decorator, CCString, Component, Label, Node } from 'cc';
import L18nManager, { LanguageType } from '../TextAdaptation/L18Manager';
const { ccclass, property } = _decorator;

@ccclass('DownLoadL8')
export class DownLoadL8 extends Component {
    private _lab: Label
    protected start(): void {
        this._lab = this.getComponent(Label);
        switch (L18nManager.instance.lang) {
            case LanguageType.zh_cn: {
                this._lab.string = "拖拽移动";
                break;
            }
            case LanguageType.en: {
                this._lab.string = "Drag and move";
                break;
            }
            case LanguageType.zh_ft: {
                this._lab.string = "拖曳移動";
                break;
            }
            case LanguageType.fr: {
                this._lab.string = "Glisser pour déplacer";
                break;
            }
            case LanguageType.ja: {
                this._lab.string = "ドラッグして移動";
                break;
            }
            case LanguageType.de: {
                this._lab.string = "Ziehen zum Bewegen";
                break;
            }
            case LanguageType.ko: {
                this._lab.string = "끌어서 이동";
                break;
            }
            case LanguageType.ru: {
                this._lab.string = "Перетащите для перемещения";
                break;
            }
            //西班牙语
            case LanguageType.es: {
                this._lab.string = "Arrastrar para mover";
                break;
            }
            //葡萄牙语
            case LanguageType.pt: {
                this._lab.string = "Arrastar para mover";
                break;
            }
            //阿拉伯语
            case LanguageType.ar: {
                this._lab.string = "اسحب لتحريك";
                break;
            }
            //印地语
            case LanguageType.id: {
                this._lab.string = "level berikutnya";

                break;
            }
            case LanguageType.th: {
                this._lab.string = "ลากเพื่อเคลื่อนย้าย";
                break;
            }
            case LanguageType.tr: {
                this._lab.string = "Tarik dan pindahkan";
                break;
            }
            default: {
                this._lab.string = "Drag and move";
                break;
            }
        }
    }
}



