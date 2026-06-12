System.register(["cc", "cc/env"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Enum, DEBUG, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _class3, _crd, LanguageType, ccclass, property, L18nManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Enum = _cc.Enum;
    }, function (_ccEnv) {
      DEBUG = _ccEnv.DEBUG;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "71adekpHzRDObqSLC6hfm+g", "L18Manager", undefined); // Learn TypeScript:
      //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
      // Learn Attribute:
      //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
      // Learn life-cycle callbacks:
      //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


      // import I18nLabel from "./I18nLabel";
      __checkObsolete__(['_decorator', 'Component', 'Enum']);

      _export("LanguageType", LanguageType = /*#__PURE__*/function (LanguageType) {
        LanguageType[LanguageType["default"] = 0] = "default";
        LanguageType[LanguageType["zh_cn"] = 1] = "zh_cn";
        LanguageType[LanguageType["zh_ft"] = 2] = "zh_ft";
        LanguageType[LanguageType["en"] = 3] = "en";
        LanguageType[LanguageType["ko"] = 4] = "ko";
        LanguageType[LanguageType["ja"] = 5] = "ja";
        LanguageType[LanguageType["de"] = 6] = "de";
        LanguageType[LanguageType["fr"] = 7] = "fr";
        LanguageType[LanguageType["es"] = 8] = "es";
        LanguageType[LanguageType["pt"] = 9] = "pt";
        LanguageType[LanguageType["it"] = 10] = "it";
        LanguageType[LanguageType["be"] = 11] = "be";
        LanguageType[LanguageType["uk"] = 12] = "uk";
        LanguageType[LanguageType["id"] = 13] = "id";
        LanguageType[LanguageType["ru"] = 14] = "ru";
        LanguageType[LanguageType["ar"] = 15] = "ar";
        LanguageType[LanguageType["vi"] = 16] = "vi";
        LanguageType[LanguageType["th"] = 17] = "th";
        LanguageType[LanguageType["tr"] = 18] = "tr";
        return LanguageType;
      }({}));

      ({
        ccclass,
        property
      } = _decorator); // const dataJson = {
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

      _export("default", L18nManager = (_dec = ccclass("L18nManager"), _dec2 = property({
        type: Enum(LanguageType),
        displayName: '测试语言',
        tooltip: 'zh_cn : 简体中文\n zh_tw : 繁体中文\n en : 英语\n ko : 韩语\n ja : 日语\n de : 德语\n fr : 法语\n es : 西班牙语\n pt : 葡萄牙语\n it : 意大利语\n be : 白俄罗斯语\n uk : 乌克兰语\n id : 印度尼西亚语\n ar : 阿拉伯语\n vi : 越南语\n th : 泰语\n tr : 土耳其语'
      }), _dec3 = property({
        type: Enum(LanguageType),
        displayName: '测试语言',
        tooltip: 'zh_cn : 简体中文\n zh_tw : 繁体中文\n en : 英语\n ko : 韩语\n ja : 日语\n de : 德语\n fr : 法语\n es : 西班牙语\n pt : 葡萄牙语\n it : 意大利语\n be : 白俄罗斯语\n uk : 乌克兰语\n id : 印度尼西亚语\n ar : 阿拉伯语\n vi : 越南语\n th : 泰语\n tr : 土耳其语'
      }), _dec(_class = (_class2 = (_class3 = class L18nManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "language", _descriptor, this);

          _initializerDefineProperty(this, "def", _descriptor2, this);
        }

        static get instance() {
          return this._instance;
        }

        onLoad() {
          L18nManager._instance = this;

          if (!DEBUG) {
            let lang = navigator.language;
            lang = lang.split('-')[0];

            switch (lang) {
              case 'zh':
                {
                  if (this.def != LanguageType.default) {
                    this.language = this.def;
                  } else {
                    switch (navigator.language) {
                      case 'zh-CN':
                        {
                          this.language = LanguageType.zh_cn;
                          break;
                        }

                      default:
                        {
                          //除大陆外其他地区统一都为繁体
                          this.language = LanguageType.zh_ft;
                          break;
                        }
                    }
                  }

                  break;
                }

              case 'en':
                {
                  this.language = LanguageType.en;
                  break;
                }

              case 'ko':
                {
                  this.language = LanguageType.ko;
                  break;
                }

              case 'ja':
                {
                  this.language = LanguageType.ja;
                  break;
                }

              case 'de':
                {
                  this.language = LanguageType.de;
                  break;
                }

              case 'fr':
                {
                  this.language = LanguageType.fr;
                  break;
                }

              case 'es':
                {
                  this.language = LanguageType.es;
                  break;
                }

              case 'pt':
                {
                  this.language = LanguageType.pt;
                  break;
                }

              case 'it':
                {
                  this.language = LanguageType.it;
                  break;
                }

              case 'be':
                {
                  this.language = LanguageType.be;
                  break;
                }

              case 'uk':
                {
                  this.language = LanguageType.uk;
                  break;
                }

              case 'id':
                {
                  this.language = LanguageType.id;
                  break;
                }

              case 'ru':
                {
                  this.language = LanguageType.ru;
                  break;
                }

              case 'ar':
                {
                  this.language = LanguageType.ar;
                  break;
                }

              case 'vi':
                {
                  this.language = LanguageType.vi;
                  break;
                }

              case 'th':
                {
                  this.language = LanguageType.th;
                  break;
                }

              case 'tr':
                {
                  this.language = LanguageType.tr;
                  break;
                }

              default:
                {
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


        get lang() {
          return this.language;
        }

      }, _class3._instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "language", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return LanguageType.en;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "def", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return LanguageType.default;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1cf6893e7f84ed5d76c903cd6da8f10d126358cb.js.map