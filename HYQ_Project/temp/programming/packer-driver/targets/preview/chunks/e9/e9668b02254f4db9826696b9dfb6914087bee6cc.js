System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, StutterCheck, PrintComponent, _crd, PlayerAction, EventName;

  function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  function _reportPossibleCrUseOfStutterCheck(extras) {
    _reporterNs.report("StutterCheck", "./StutterCheck", _context.meta, extras);
  }

  _export("PrintComponent", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      StutterCheck = _unresolved_2.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c689dJWG2ZGsrRpmcgacOWH", "PrintComponent", undefined);

      _export("PlayerAction", PlayerAction = /*#__PURE__*/function (PlayerAction) {
        PlayerAction["next"] = "next";
        PlayerAction["again"] = "again";
        PlayerAction["download"] = "download";
        PlayerAction["automatic_jump"] = "automatic_jump";
        return PlayerAction;
      }({}));

      _export("EventName", EventName = /*#__PURE__*/function (EventName) {
        EventName["loading"] = "loading";
        EventName["game_start"] = "game_start";
        EventName["game_end"] = "game_end";
        EventName["actionbar"] = "actionbar";
        EventName["interrupt"] = "interrupt";
        EventName["game_touch"] = "game_touch";
        EventName["stutter"] = "stutter";
        EventName["heartbeat"] = "heartbeat";
        return EventName;
      }({}));

      _export("PrintComponent", PrintComponent = class PrintComponent {
        static get stage() {
          return this.m_stage;
        }

        static set stage(_) {
          this.m_stage = _;
        }

        static init(material, maxStage) {
          if (maxStage === void 0) {
            maxStage = 1;
          }

          //初始化
          this.material = material;
          this.lastGameStartTime = 0;
          this.totalGamesPlayed = 1;
          this.isPlaying = false;
          this.userId = this.getUserId();
          this.uuid = 'uuid_' + Math.random().toString(36).substr(2, 9);
          this.maxStage = maxStage;
        }

        static getUserId() {
          var canvas = window.document.getElementById('GameCanvas');
          return this.hashString(canvas.toDataURL('image/png')).toString();
        }

        static hashString(str) {
          var hash = 0;

          for (var char of str) {
            hash = (hash << 5) - hash + char.charCodeAt(0);
          }

          return hash;
        }

        static getCurrentDuration() {
          return parseInt(((_crd && StutterCheck === void 0 ? (_reportPossibleCrUseOfStutterCheck({
            error: Error()
          }), StutterCheck) : StutterCheck).instance.totalDuration * 1000).toFixed(0));
        }
        /**
         * 上报事件
         */


        static reportEvent(eventType, additionalParams) {
          if (additionalParams === void 0) {
            additionalParams = {};
          }

          var params = _extends({
            'material': this.material,
            'media': this.media,
            'appid': this.appid,
            'user_id': this.userId,
            'uuid': this.uuid
          }, additionalParams);

          if (!params.duration) {
            params.duration = this.getCurrentDuration();

            if (params.duration == 0) {
              params.duration = 1;
            }
          } // ga打点只打流畅度


          if (eventType == EventName.stutter) {
            window["gtag"] && window["gtag"]('event', eventType, params);
          }

          window["pba_send_msg"] && window["pba_send_msg"](eventType, params);
          console.log("report_log", eventType, params);
        }
        /**
         * loading结束调用
         */


        static loading() {
          this.reportCUid();
          this.reportEvent(EventName.loading);
          (_crd && StutterCheck === void 0 ? (_reportPossibleCrUseOfStutterCheck({
            error: Error()
          }), StutterCheck) : StutterCheck).instance;
        }

        static reportCUid() {
          var cuid = Array.from({
            length: 10
          }, () => Math.floor(Math.random() * 10)).join('');
          window["pba_init_cuid"] && window["pba_init_cuid"](cuid);
          console.log("report_log cuid:", cuid);
        }
        /**
         * 游戏开始时调用
         */


        static startGame() {
          if (!this.isPlaying) {
            // 随机生成一个玩家的cuid并发送 随机生成一个10位数
            this.isPlaying = true;
            this.lastGameStartTime = Date.now();
            var m_stage = ++this.m_stage;

            if (m_stage == this.maxStage || this.maxStage == 1) {
              // game_start和game_end：只有一关就上报final，而不是1
              m_stage = 'final';
            }

            this.reportEvent(EventName.game_start, {
              "stage": m_stage,
              'total_games_played': this.totalGamesPlayed
            });
            this.m_gameStartTime = this.getCurrentDuration();
          }
        }
        /**
         * 点击重新开始时调用
         */


        static replay() {
          this.m_stage = 0;
          ++this.totalGamesPlayed;
        }
        /**
         * 操作主角时调用
         * @param type type = "touch-start" | "touch-end"
         * @param pos 主角位置
         */


        static game_interaction(type) {
          this.reportEvent(EventName.game_touch, {
            type: type
          });
        }
        /**
         * 游戏结束时调用
         */


        static endGame(isWin) {
          if (this.isPlaying) {
            this.isPlaying = false;
            var m_stage = this.m_stage;

            if (m_stage == this.maxStage || this.maxStage == 1) {
              // game_start和game_end：只有一关就上报final，而不是1
              m_stage = 'final';
            }

            this.reportEvent(EventName.game_end, {
              stage: m_stage,
              total_games_played: this.totalGamesPlayed,
              value: isWin ? 'win' : 'lose',
              game_duration: this.getCurrentDuration() - this.m_gameStartTime
            });
          }
        }
        /**
         * 跳转到商店调用
         */


        static actionbar(action) {
          this.reportEvent(EventName.actionbar, {
            value: action
          });
        }

        static reportStutter(data) {
          this.reportEvent(EventName.stutter, data);
        }
        /** 心跳上报 */


        static reportKeepAlive(isact) {
          this.reportEvent(EventName.heartbeat, {
            isact: isact
          });
        }

      });

      //媒体渠道
      PrintComponent.media = "moloco";
      //素材名称和版本
      PrintComponent.material = "";
      PrintComponent.appid = "TH";
      PrintComponent.userId = void 0;
      PrintComponent.uuid = void 0;
      //游戏开始时间戳
      PrintComponent.lastGameStartTime = void 0;
      //累计游戏次数
      PrintComponent.totalGamesPlayed = void 0;
      PrintComponent.isPlaying = void 0;
      PrintComponent.hasVoice_on = false;
      PrintComponent.m_stage = 0;
      PrintComponent.maxStage = void 0;
      PrintComponent.m_duration = 0;
      PrintComponent.m_gameStartTime = 0;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e9668b02254f4db9826696b9dfb6914087bee6cc.js.map