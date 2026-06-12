System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, L18nManager, LanguageType, _dec, _class, _crd, ccclass, property, DownLoadL8;

  function _reportPossibleCrUseOfL18nManager(extras) {
    _reporterNs.report("L18nManager", "../TextAdaptation/L18Manager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLanguageType(extras) {
    _reporterNs.report("LanguageType", "../TextAdaptation/L18Manager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Label = _cc.Label;
    }, function (_unresolved_2) {
      L18nManager = _unresolved_2.default;
      LanguageType = _unresolved_2.LanguageType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "0bf86ffgfJHjYbI2WPD+dCw", "DownLoadL8", undefined);

      __checkObsolete__(['_decorator', 'CCString', 'Component', 'Label', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("DownLoadL8", DownLoadL8 = (_dec = ccclass('DownLoadL8'), _dec(_class = class DownLoadL8 extends Component {
        constructor() {
          super(...arguments);
          this._lab = void 0;
        }

        start() {
          this._lab = this.getComponent(Label);

          switch ((_crd && L18nManager === void 0 ? (_reportPossibleCrUseOfL18nManager({
            error: Error()
          }), L18nManager) : L18nManager).instance.lang) {
            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).zh_cn:
              {
                this._lab.string = "下载";
                break;
              }

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).en:
              {
                this._lab.string = "Download";
                break;
              }

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).zh_ft:
              {
                this._lab.string = "下載";
                break;
              }

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).fr:
              {
                this._lab.string = "Télécharger";
                break;
              }

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).ja:
              {
                this._lab.string = "ダウンロード";
                break;
              }

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).de:
              {
                this._lab.string = "Herunterladen";
                break;
              }

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).ko:
              {
                this._lab.string = "다운로드";
                break;
              }

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).ru:
              {
                this._lab.string = "Скачать";
                break;
              }
            //西班牙语

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).es:
              {
                this._lab.string = "Descargar";
                break;
              }
            //葡萄牙语

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).pt:
              {
                this._lab.string = "Baixar";
                break;
              }
            //阿拉伯语

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).ar:
              {
                this._lab.string = "تحميل";
                break;
              }
            //印地语

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).id:
              {
                this._lab.string = "Unduh";
                break;
              }

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).th:
              {
                this._lab.string = "ดาวน์โหลด";
                break;
              }

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).tr:
              {
                this._lab.string = "İndir";
                break;
              }

            default:
              {
                this._lab.string = "Download";
                break;
              }
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=a7b3d147a8bd231ef13c0a29a9ad3e329e802d53.js.map