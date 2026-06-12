System.register(["cc", "__unresolved_0", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _cclegacy, super_html_playable, PrintComponent, PlayerAction, StutterCheck, PLASDK, PLASDK_EVENT, PBASDK;

  _export("default", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_) {
      super_html_playable = _unresolved_.default;
    }, function (_unresolved_2) {
      PrintComponent = _unresolved_2.PrintComponent;
      PlayerAction = _unresolved_2.PlayerAction;
    }, function (_unresolved_3) {
      StutterCheck = _unresolved_3.default;
    }, function (_unresolved_4) {
      PLASDK = _unresolved_4.default;
      PLASDK_EVENT = _unresolved_4.PLASDK_EVENT;
    }],
    execute: function () {
      _cclegacy._RF.push({}, "de608ukdqBK2ImeBtiNBIf8", "PBASDK", undefined); // 引用


      _export("default", PBASDK = class PBASDK {
        /** 游戏加载后调用 */
        static Init(material, maxStage) {
          const google_play = "https://play.google.com/store/apps/details?id=com.greenmushroom.boomblitz.gp&hl=en_US";
          const appstore = "https://apps.apple.com/us/app/top-heroes/id6450953550";
          super_html_playable.set_google_play_url(google_play);
          super_html_playable.set_app_store_url(appstore);
          PLASDK.SendData(PLASDK_EVENT.LOADING); // TODO 目前TH没有合适的loading界面

          PrintComponent.init(material, maxStage);
          PrintComponent.loading();
          PLASDK.SendData(PLASDK_EVENT.LOADED);
          PLASDK.SendData(PLASDK_EVENT.DISPLAYED);
        }
        /** 📌 SDK 的 `ClickDownloadBar` 方法 */


        static ClickDownloadBar() {
          PrintComponent.actionbar(PlayerAction.download);
          super_html_playable.download();
          PLASDK.SendData(PLASDK_EVENT.CTA_CLICKED);
        }
        /** 📌 SDK 的 自动跳转方法 */


        static AuToJumpDownload() {
          PrintComponent.actionbar(PlayerAction.automatic_jump);
          super_html_playable.download();
          PLASDK.SendData(PLASDK_EVENT.ENDCARD_SHOWN);
        }
        /** 📌 模拟游戏结束 */


        static GameEnd(isWin) {
          StutterCheck.instance.stopReport();
          PrintComponent.endGame(isWin);
          StutterCheck.instance.reportStutter();
          super_html_playable.game_end();

          if (isWin) {
            PLASDK.SendData(PLASDK_EVENT.CHALLENGE_SOLVED);
          } else {
            PLASDK.SendData(PLASDK_EVENT.CHALLENGE_FAILED);
          }
        }
        /** 📌 模拟进入游戏章节 */


        static EnterSection(section) {
          PrintComponent.stage = section;
          PrintComponent.endGame(true);
        }
        /** ---- touch begin ---- */


        static TouchStart() {
          PrintComponent.game_interaction("touch-start");
          StutterCheck.instance.isTouchInSecond = true;
        }

        static TouchEnd() {
          PrintComponent.game_interaction("touch-end");
        }
        /** ---- touch begin ---- */

        /** 首次点击屏幕调用 */


        static GameStart() {
          PrintComponent.startGame(); // 上报流畅度

          StutterCheck.instance.startReport();
          PLASDK.SendData(PLASDK_EVENT.CHALLENGE_STARTED);
          this.SendKeepAlive();
        }

        static Replay() {
          PrintComponent.replay();
          PLASDK.SendData(PLASDK_EVENT.CHALLENGE_RETRY);
        }
        /** 【可选】要在玩家首次点击后调用， 持续发送心跳 */


        static SendKeepAlive() {
          StutterCheck.instance.startKeepAlive();
        }

      });

      // SDK 版本号（只读）
      PBASDK._Version = "1.0.0";

      _cclegacy._RF.pop();
    }
  };
});
//# sourceMappingURL=e8457083c9aabfe083a692f4abc05eb8a3912ef3.js.map