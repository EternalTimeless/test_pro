System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, super_html_playable, PrintComponent, PlayerAction, StutterCheck, PLASDK, PLASDK_EVENT, PBASDK, _crd;

  function _reportPossibleCrUseOfsuper_html_playable(extras) {
    _reporterNs.report("super_html_playable", "./super_html_playable", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPrintComponent(extras) {
    _reporterNs.report("PrintComponent", "./PrintComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayerAction(extras) {
    _reporterNs.report("PlayerAction", "./PrintComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfStutterCheck(extras) {
    _reporterNs.report("StutterCheck", "./StutterCheck", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPLASDK(extras) {
    _reporterNs.report("PLASDK", "./PLASDK", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPLASDK_EVENT(extras) {
    _reporterNs.report("PLASDK_EVENT", "./PLASDK", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      super_html_playable = _unresolved_2.default;
    }, function (_unresolved_3) {
      PrintComponent = _unresolved_3.PrintComponent;
      PlayerAction = _unresolved_3.PlayerAction;
    }, function (_unresolved_4) {
      StutterCheck = _unresolved_4.default;
    }, function (_unresolved_5) {
      PLASDK = _unresolved_5.default;
      PLASDK_EVENT = _unresolved_5.PLASDK_EVENT;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "de608ukdqBK2ImeBtiNBIf8", "PBASDK", undefined); // 引用


      _export("default", PBASDK = class PBASDK {
        /** 游戏加载后调用 */
        static Init(material, maxStage) {
          const google_play = "https://play.google.com/store/apps/details?id=com.greenmushroom.boomblitz.gp&hl=en_US";
          const appstore = "https://apps.apple.com/us/app/top-heroes/id6450953550";
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).set_google_play_url(google_play);
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).set_app_store_url(appstore);
          (_crd && PLASDK === void 0 ? (_reportPossibleCrUseOfPLASDK({
            error: Error()
          }), PLASDK) : PLASDK).SendData((_crd && PLASDK_EVENT === void 0 ? (_reportPossibleCrUseOfPLASDK_EVENT({
            error: Error()
          }), PLASDK_EVENT) : PLASDK_EVENT).LOADING); // TODO 目前TH没有合适的loading界面

          (_crd && PrintComponent === void 0 ? (_reportPossibleCrUseOfPrintComponent({
            error: Error()
          }), PrintComponent) : PrintComponent).init(material, maxStage);
          (_crd && PrintComponent === void 0 ? (_reportPossibleCrUseOfPrintComponent({
            error: Error()
          }), PrintComponent) : PrintComponent).loading();
          (_crd && PLASDK === void 0 ? (_reportPossibleCrUseOfPLASDK({
            error: Error()
          }), PLASDK) : PLASDK).SendData((_crd && PLASDK_EVENT === void 0 ? (_reportPossibleCrUseOfPLASDK_EVENT({
            error: Error()
          }), PLASDK_EVENT) : PLASDK_EVENT).LOADED);
          (_crd && PLASDK === void 0 ? (_reportPossibleCrUseOfPLASDK({
            error: Error()
          }), PLASDK) : PLASDK).SendData((_crd && PLASDK_EVENT === void 0 ? (_reportPossibleCrUseOfPLASDK_EVENT({
            error: Error()
          }), PLASDK_EVENT) : PLASDK_EVENT).DISPLAYED);
        }
        /** 📌 SDK 的 `ClickDownloadBar` 方法 */


        static ClickDownloadBar() {
          (_crd && PrintComponent === void 0 ? (_reportPossibleCrUseOfPrintComponent({
            error: Error()
          }), PrintComponent) : PrintComponent).actionbar((_crd && PlayerAction === void 0 ? (_reportPossibleCrUseOfPlayerAction({
            error: Error()
          }), PlayerAction) : PlayerAction).download);
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).download();
          (_crd && PLASDK === void 0 ? (_reportPossibleCrUseOfPLASDK({
            error: Error()
          }), PLASDK) : PLASDK).SendData((_crd && PLASDK_EVENT === void 0 ? (_reportPossibleCrUseOfPLASDK_EVENT({
            error: Error()
          }), PLASDK_EVENT) : PLASDK_EVENT).CTA_CLICKED);
        }
        /** 📌 SDK 的 自动跳转方法 */


        static AuToJumpDownload() {
          (_crd && PrintComponent === void 0 ? (_reportPossibleCrUseOfPrintComponent({
            error: Error()
          }), PrintComponent) : PrintComponent).actionbar((_crd && PlayerAction === void 0 ? (_reportPossibleCrUseOfPlayerAction({
            error: Error()
          }), PlayerAction) : PlayerAction).automatic_jump);
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).download();
          (_crd && PLASDK === void 0 ? (_reportPossibleCrUseOfPLASDK({
            error: Error()
          }), PLASDK) : PLASDK).SendData((_crd && PLASDK_EVENT === void 0 ? (_reportPossibleCrUseOfPLASDK_EVENT({
            error: Error()
          }), PLASDK_EVENT) : PLASDK_EVENT).ENDCARD_SHOWN);
        }
        /** 📌 模拟游戏结束 */


        static GameEnd(isWin) {
          (_crd && StutterCheck === void 0 ? (_reportPossibleCrUseOfStutterCheck({
            error: Error()
          }), StutterCheck) : StutterCheck).instance.stopReport();
          (_crd && PrintComponent === void 0 ? (_reportPossibleCrUseOfPrintComponent({
            error: Error()
          }), PrintComponent) : PrintComponent).endGame(isWin);
          (_crd && StutterCheck === void 0 ? (_reportPossibleCrUseOfStutterCheck({
            error: Error()
          }), StutterCheck) : StutterCheck).instance.reportStutter();
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).game_end();

          if (isWin) {
            (_crd && PLASDK === void 0 ? (_reportPossibleCrUseOfPLASDK({
              error: Error()
            }), PLASDK) : PLASDK).SendData((_crd && PLASDK_EVENT === void 0 ? (_reportPossibleCrUseOfPLASDK_EVENT({
              error: Error()
            }), PLASDK_EVENT) : PLASDK_EVENT).CHALLENGE_SOLVED);
          } else {
            (_crd && PLASDK === void 0 ? (_reportPossibleCrUseOfPLASDK({
              error: Error()
            }), PLASDK) : PLASDK).SendData((_crd && PLASDK_EVENT === void 0 ? (_reportPossibleCrUseOfPLASDK_EVENT({
              error: Error()
            }), PLASDK_EVENT) : PLASDK_EVENT).CHALLENGE_FAILED);
          }
        }
        /** 📌 模拟进入游戏章节 */


        static EnterSection(section) {
          (_crd && PrintComponent === void 0 ? (_reportPossibleCrUseOfPrintComponent({
            error: Error()
          }), PrintComponent) : PrintComponent).stage = section;
          (_crd && PrintComponent === void 0 ? (_reportPossibleCrUseOfPrintComponent({
            error: Error()
          }), PrintComponent) : PrintComponent).endGame(true);
        }
        /** ---- touch begin ---- */


        static TouchStart() {
          (_crd && PrintComponent === void 0 ? (_reportPossibleCrUseOfPrintComponent({
            error: Error()
          }), PrintComponent) : PrintComponent).game_interaction("touch-start");
          (_crd && StutterCheck === void 0 ? (_reportPossibleCrUseOfStutterCheck({
            error: Error()
          }), StutterCheck) : StutterCheck).instance.isTouchInSecond = true;
        }

        static TouchEnd() {
          (_crd && PrintComponent === void 0 ? (_reportPossibleCrUseOfPrintComponent({
            error: Error()
          }), PrintComponent) : PrintComponent).game_interaction("touch-end");
        }
        /** ---- touch begin ---- */

        /** 首次点击屏幕调用 */


        static GameStart() {
          (_crd && PrintComponent === void 0 ? (_reportPossibleCrUseOfPrintComponent({
            error: Error()
          }), PrintComponent) : PrintComponent).startGame(); // 上报流畅度

          (_crd && StutterCheck === void 0 ? (_reportPossibleCrUseOfStutterCheck({
            error: Error()
          }), StutterCheck) : StutterCheck).instance.startReport();
          (_crd && PLASDK === void 0 ? (_reportPossibleCrUseOfPLASDK({
            error: Error()
          }), PLASDK) : PLASDK).SendData((_crd && PLASDK_EVENT === void 0 ? (_reportPossibleCrUseOfPLASDK_EVENT({
            error: Error()
          }), PLASDK_EVENT) : PLASDK_EVENT).CHALLENGE_STARTED);
          this.SendKeepAlive();
        }

        static Replay() {
          (_crd && PrintComponent === void 0 ? (_reportPossibleCrUseOfPrintComponent({
            error: Error()
          }), PrintComponent) : PrintComponent).replay();
          (_crd && PLASDK === void 0 ? (_reportPossibleCrUseOfPLASDK({
            error: Error()
          }), PLASDK) : PLASDK).SendData((_crd && PLASDK_EVENT === void 0 ? (_reportPossibleCrUseOfPLASDK_EVENT({
            error: Error()
          }), PLASDK_EVENT) : PLASDK_EVENT).CHALLENGE_RETRY);
        }
        /** 【可选】要在玩家首次点击后调用， 持续发送心跳 */


        static SendKeepAlive() {
          (_crd && StutterCheck === void 0 ? (_reportPossibleCrUseOfStutterCheck({
            error: Error()
          }), StutterCheck) : StutterCheck).instance.startKeepAlive();
        }

      });

      // SDK 版本号（只读）
      PBASDK._Version = "1.0.0";

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7ece20e41250ede0e4707962498ddfd8c4453b24.js.map