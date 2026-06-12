System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, EventType, EventManager, GameOverPanel, _dec, _class, _crd, ccclass, property, UIButtonEvent;

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../../../Base/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameOverPanel(extras) {
    _reporterNs.report("GameOverPanel", "./GameOverPanel", _context.meta, extras);
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
    }, function (_unresolved_2) {
      EventType = _unresolved_2.EventType;
    }, function (_unresolved_3) {
      EventManager = _unresolved_3.default;
    }, function (_unresolved_4) {
      GameOverPanel = _unresolved_4.GameOverPanel;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "79eb1G+rrdHn6YRTSI0Gh01", "UIButtonEvent", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UIButtonEvent", UIButtonEvent = (_dec = ccclass('UIButtonEvent'), _dec(_class = class UIButtonEvent extends Component {
        onPlayerRebirth() {
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).PLAYER_RESURRECTION);
          (_crd && GameOverPanel === void 0 ? (_reportPossibleCrUseOfGameOverPanel({
            error: Error()
          }), GameOverPanel) : GameOverPanel).instance.hide();
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=04afbddb79ab9de86b8d48609cacd383cec9094d.js.map