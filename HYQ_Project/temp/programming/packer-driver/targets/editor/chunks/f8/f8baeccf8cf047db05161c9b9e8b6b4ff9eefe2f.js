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

      _cclegacy._RF.push({}, "cb675Kh+x5Ka67VODMYBZaX", "DragAndMoveL8", undefined);

      __checkObsolete__(['_decorator', 'CCString', 'Component', 'Label', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("DownLoadL8", DownLoadL8 = (_dec = ccclass('DownLoadL8'), _dec(_class = class DownLoadL8 extends Component {
        constructor(...args) {
          super(...args);
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
                this._lab.string = "拖拽移动";
                break;
              }

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).en:
              {
                this._lab.string = "Drag and move";
                break;
              }

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).zh_ft:
              {
                this._lab.string = "拖曳移動";
                break;
              }

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).fr:
              {
                this._lab.string = "Glisser pour déplacer";
                break;
              }

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).ja:
              {
                this._lab.string = "ドラッグして移動";
                break;
              }

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).de:
              {
                this._lab.string = "Ziehen zum Bewegen";
                break;
              }

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).ko:
              {
                this._lab.string = "끌어서 이동";
                break;
              }

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).ru:
              {
                this._lab.string = "Перетащите для перемещения";
                break;
              }
            //西班牙语

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).es:
              {
                this._lab.string = "Arrastrar para mover";
                break;
              }
            //葡萄牙语

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).pt:
              {
                this._lab.string = "Arrastar para mover";
                break;
              }
            //阿拉伯语

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).ar:
              {
                this._lab.string = "اسحب لتحريك";
                break;
              }
            //印地语

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).id:
              {
                this._lab.string = "level berikutnya";
                break;
              }

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).th:
              {
                this._lab.string = "ลากเพื่อเคลื่อนย้าย";
                break;
              }

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).tr:
              {
                this._lab.string = "Tarik dan pindahkan";
                break;
              }

            default:
              {
                this._lab.string = "Drag and move";
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
//# sourceMappingURL=f8baeccf8cf047db05161c9b9e8b6b4ff9eefe2f.js.map