System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, L18nManager, LanguageType, _dec, _class, _crd, ccclass, property, ResurrectionL8;

  function _reportPossibleCrUseOfL18nManager(extras) {
    _reporterNs.report("L18nManager", "db://assets/Script/Base/TextAdaptation/L18Manager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLanguageType(extras) {
    _reporterNs.report("LanguageType", "db://assets/Script/Base/TextAdaptation/L18Manager", _context.meta, extras);
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

      _cclegacy._RF.push({}, "3a446Dwse5MJYep3ECLP9b0", "ResurrectionL8", undefined);

      __checkObsolete__(['_decorator', 'CCString', 'Component', 'Label', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ResurrectionL8", ResurrectionL8 = (_dec = ccclass('ResurrectionL8'), _dec(_class = class ResurrectionL8 extends Component {
        constructor() {
          super(...arguments);
          this._lab = void 0;
        }

        start() {
          this._lab = this.getComponent(Label);

          switch ((_crd && L18nManager === void 0 ? (_reportPossibleCrUseOfL18nManager({
            error: Error()
          }), L18nManager) : L18nManager).instance.lang) {
            //简体中文
            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).zh_cn:
              {
                this._lab.string = "复活";
                break;
              }
            //英语

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).en:
              {
                this._lab.string = "Revive";
                break;
              }
            //繁体中文

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).zh_ft:
              {
                this._lab.string = "復活";
                break;
              }
            //法语

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).fr:
              {
                this._lab.string = "Revivre";
                break;
              }
            //日语

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).ja:
              {
                this._lab.string = "復活";
                break;
              }
            //德语

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).de:
              {
                this._lab.string = "Wiederbeleben";
                break;
              }
            //韩语

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).ko:
              {
                this._lab.string = "부활";
                break;
              }
            //俄语

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).ru:
              {
                this._lab.string = "Воскресить";
                break;
              }
            //西班牙语

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).es:
              {
                this._lab.string = "Revivir";
                break;
              }
            //葡萄牙语

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).pt:
              {
                this._lab.string = "Reviver";
                break;
              }
            //阿拉伯语

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).ar:
              {
                this._lab.string = "إحياء";
                break;
              }
            //印尼语

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).id:
              {
                this._lab.string = "Bangkit";
                break;
              }
            //泰语

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).th:
              {
                this._lab.string = "คืนชีพ";
                break;
              }
            //土耳其语

            case (_crd && LanguageType === void 0 ? (_reportPossibleCrUseOfLanguageType({
              error: Error()
            }), LanguageType) : LanguageType).tr:
              {
                this._lab.string = "Canlan";
                break;
              }

            default:
              {
                this._lab.string = "Revive";
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
//# sourceMappingURL=407fe08f85a1575a06beb3692d40cf36d9684f58.js.map