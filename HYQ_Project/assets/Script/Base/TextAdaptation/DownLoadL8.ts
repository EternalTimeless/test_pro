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
                this._lab.string = "下载";
                break;
            }
            case LanguageType.en: {
                this._lab.string = "Download";
                break;
            }
            case LanguageType.zh_ft: {
                this._lab.string = "下載";
                break;
            }
            case LanguageType.fr: {
                this._lab.string = "Télécharger";
                break;
            }
            case LanguageType.ja: {
                this._lab.string = "ダウンロード";
                break;
            }
            case LanguageType.de: {
                this._lab.string = "Herunterladen";
                break;
            }
            case LanguageType.ko: {
                this._lab.string = "다운로드";
                break;
            }
            case LanguageType.ru: {
                this._lab.string = "Скачать";
                break;
            }
            //西班牙语
            case LanguageType.es: {
                this._lab.string = "Descargar";
                break;
            }
            //葡萄牙语
            case LanguageType.pt: {
                this._lab.string = "Baixar";
                break;
            }
            //阿拉伯语
            case LanguageType.ar: {
                this._lab.string = "تحميل";
                break;
            }
            //印地语
            case LanguageType.id: {
                this._lab.string = "Unduh";
                break;
            }
            case LanguageType.th: {
                this._lab.string = "ดาวน์โหลด";
                break;
            }
            case LanguageType.tr: {
                this._lab.string = "İndir";
                break;
            }
            default: {
                this._lab.string = "Download";
                break;
            }
        }
    }
}



