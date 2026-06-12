// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Enum } from "cc";
// import I18nLabel from "./I18nLabel";
import { DEBUG } from "cc/env";

export enum LanguageType {
    /**默认语言 */
    default = 0,
    /**中文简体 */
    zh_cn = 1,
    /**中文繁体 */
    zh_ft = 2,
    /**英语 */
    en = 3,
    /**韩语 */
    ko = 4,
    /**日语 */
    ja = 5,
    /**德语 */
    de = 6,
    /**法语 */
    fr = 7,
    /**西班牙语 */
    es = 8,
    /**葡萄牙语 */
    pt = 9,
    /**意大利语 */
    it = 10,
    /**白俄罗斯语 */
    be = 11,
    /**乌克兰语 */
    uk = 12,
    /**印度尼西亚语 */
    id = 13,
    /**俄语 */
    ru = 14,
    /**阿拉伯语 */
    ar = 15,
    /**越南语 */
    vi = 16,
    /**泰语 */
    th = 17,
    /**土耳其语 */
    tr = 18,
}

const { ccclass, property } = _decorator;

// const dataJson = {
//     'test': {
//         default: 'test',
//         zh: '测试',
//         en: 'test'
//     },
//     'Walking': {
//         default: 'Walking',
//         zh: '行走',
//         en: 'Walking'
//     },
//     'Paused': {
//         default: 'Paused',
//         zh: '暫停',
//         en: 'Paused'
//     }

// }

@ccclass("L18nManager")
export default class L18nManager extends Component {
    private static _instance: L18nManager = null;

    @property({ type: Enum(LanguageType), displayName: '测试语言', tooltip: 'zh_cn : 简体中文\n zh_tw : 繁体中文\n en : 英语\n ko : 韩语\n ja : 日语\n de : 德语\n fr : 法语\n es : 西班牙语\n pt : 葡萄牙语\n it : 意大利语\n be : 白俄罗斯语\n uk : 乌克兰语\n id : 印度尼西亚语\n ar : 阿拉伯语\n vi : 越南语\n th : 泰语\n tr : 土耳其语' })
    language: LanguageType = LanguageType.en;

    @property({ type: Enum(LanguageType), displayName: '测试语言', tooltip: 'zh_cn : 简体中文\n zh_tw : 繁体中文\n en : 英语\n ko : 韩语\n ja : 日语\n de : 德语\n fr : 法语\n es : 西班牙语\n pt : 葡萄牙语\n it : 意大利语\n be : 白俄罗斯语\n uk : 乌克兰语\n id : 印度尼西亚语\n ar : 阿拉伯语\n vi : 越南语\n th : 泰语\n tr : 土耳其语' })
    public def: LanguageType = LanguageType.default;
    public static get instance() {
        return this._instance;
    }

    onLoad() {
        L18nManager._instance = this;

        if (!DEBUG) {
            let lang = navigator.language;
            lang = lang.split('-')[0];
            switch (lang) {
                case 'zh': {
                    if (this.def != LanguageType.default) {
                        this.language = this.def;
                    } else {
                        switch (navigator.language) {
                            case 'zh-CN': {
                                this.language = LanguageType.zh_cn;
                                break;
                            }
                            default: {//除大陆外其他地区统一都为繁体
                                this.language = LanguageType.zh_ft;
                                break;
                            }
                        }
                    }
                    break;
                }
                case 'en': {
                    this.language = LanguageType.en;
                    break;
                }
                case 'ko': {
                    this.language = LanguageType.ko;
                    break;
                }
                case 'ja': {
                    this.language = LanguageType.ja;
                    break;
                }
                case 'de': {
                    this.language = LanguageType.de;
                    break;
                }
                case 'fr': {
                    this.language = LanguageType.fr;
                    break;
                }
                case 'es': {
                    this.language = LanguageType.es;
                    break;
                }
                case 'pt': {
                    this.language = LanguageType.pt;
                    break;
                }
                case 'it': {
                    this.language = LanguageType.it;
                    break;
                }
                case 'be': {
                    this.language = LanguageType.be;
                    break;
                }
                case 'uk': {
                    this.language = LanguageType.uk;
                    break;
                }
                case 'id': {
                    this.language = LanguageType.id;
                    break;
                }
                case 'ru': {
                    this.language = LanguageType.ru;
                    break;
                }
                case 'ar': {
                    this.language = LanguageType.ar;
                    break;
                }
                case 'vi': {
                    this.language = LanguageType.vi;
                    break;
                }
                case 'th': {
                    this.language = LanguageType.th;
                    break;
                }
                case 'tr': {
                    this.language = LanguageType.tr;
                    break;
                }
                default: {
                    if (this.def != LanguageType.default) {
                        this.language = this.def;
                    } else {

                        this.language = LanguageType.en;
                    }
                    break;
                }
            }
        }
    }


    /**获取当前语言 */
    public get lang(): LanguageType {
        return this.language;
    }
}
