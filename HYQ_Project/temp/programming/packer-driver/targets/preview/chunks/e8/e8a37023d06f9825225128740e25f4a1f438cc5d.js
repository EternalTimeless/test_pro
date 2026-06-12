System.register(["cc", "__unresolved_0", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, director, game, PrintComponent, PLASDK, PLASDK_EVENT, _dec, _class, _class2, ccclass, property, StutterCheck;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      director = _cc.director;
      game = _cc.game;
    }, function (_unresolved_) {
      PrintComponent = _unresolved_.PrintComponent;
    }, function (_unresolved_2) {
      PLASDK = _unresolved_2.default;
      PLASDK_EVENT = _unresolved_2.PLASDK_EVENT;
    }],
    execute: function () {
      _cclegacy._RF.push({}, "c698e1AjU9EN4gZcSw8SDs4", "StutterCheck", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'director', 'tween', 'game']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("default", StutterCheck = (_dec = ccclass('StutterCheck'), _dec(_class = (_class2 = class StutterCheck extends Component {
        constructor() {
          super(...arguments);
          this.m_fps = 0.016;
          this.m_totalDuration = 0;
          this.m_isGameStart = false;
          this.m_pd_duration = 0;
          this.avgDT = 1 / 60;
          this.pd_big_jank_count = 0;
          this.pd_big_jank_time = 0;
          this.pd_small_jank_count = 0;
          this.pd_small_jank_time = 0;
          this.frameCount = 0;
          // 新增帧计数
          this.fpsList = [];
          // 新增fps数组
          this.pd_fps_10_jank_count = 0;

          /** 心跳协议相关 */
          this.m_isTouchInSecond = false;
        }

        static get instance() {
          if (!this._instance) {
            var StutterCheckNode = new Node("StutterCheck");
            director.getScene().addChild(StutterCheckNode);
            this._instance = StutterCheckNode.addComponent(StutterCheck);
          }

          return this._instance;
        }

        start() {
          this.m_fps = parseFloat((1 / Number(game.frameRate)).toFixed(3));
        }

        get totalDuration() {
          return this.m_totalDuration;
        }

        // 玩家操作后上报数据
        startReport() {
          this.m_isGameStart = true; // 每10s上报一次流畅度

          this.schedule(() => {
            this.reportStutter();
          }, 10);
          this.scheduleOnce(() => {
            PLASDK.SendData(PLASDK_EVENT.CHALLENGE_PASS_25);
          }, 20);
          this.scheduleOnce(() => {
            PLASDK.SendData(PLASDK_EVENT.CHALLENGE_PASS_50);
          }, 50);
          this.scheduleOnce(() => {
            PLASDK.SendData(PLASDK_EVENT.CHALLENGE_PASS_75);
          }, 80);
        } // 游戏结束后停止上报


        stopReport() {
          this.m_isGameStart = false;
          this.unscheduleAllCallbacks();
        }

        update(dt) {
          this.m_totalDuration += dt;

          if (!this.m_isGameStart) {
            return;
          }

          this.frameCount++; // 每帧自增

          if (dt > this.avgDT * 2 && dt > 0.125) {
            this.pd_big_jank_count++;
            this.pd_big_jank_time += dt * 1000;
          }

          if (dt > this.avgDT * 2 && dt > 0.08333) {
            this.pd_small_jank_count++;
            this.pd_small_jank_time += dt * 1000;
          }

          if (dt > 0) {
            var curFps = 1 / dt;
            this.fpsList.push(curFps); // 记录每帧fps

            if (curFps < 10) {
              this.pd_fps_10_jank_count++;
            }
          }

          this.m_pd_duration += dt;
        }
        /**
         * 计算分位数
         */


        getPercentile(arr, percentile) {
          if (arr.length === 0) return 0;
          var sorted = arr.slice().sort((a, b) => a - b);
          var idx = Math.ceil(percentile * sorted.length) - 1;
          return sorted[Math.max(0, Math.min(idx, sorted.length - 1))];
        }
        /**
         * stutter事件 流畅度
         */


        reportStutter() {
          // 计算分位数
          var fpsList = this.fpsList; // 计算平均帧率

          var avgFps = fpsList.length > 0 ? fpsList.reduce((a, b) => a + b, 0) / fpsList.length : 0;
          var data = {
            pd_duration: Math.ceil(this.m_pd_duration * 1000),
            pd_big_jank_count: this.pd_big_jank_count,
            pd_big_jank_time: Number(this.pd_big_jank_time.toFixed(2)),
            pd_small_jank_count: this.pd_small_jank_count,
            pd_small_jank_time: Number(this.pd_small_jank_time.toFixed(2)),
            pd_fps_0_1: Math.ceil(this.getPercentile(fpsList, 0.001)),
            pd_fps_01: Math.ceil(this.getPercentile(fpsList, 0.01)),
            pd_fps_10: Math.ceil(this.getPercentile(fpsList, 0.10)),
            pd_fps_20: Math.ceil(this.getPercentile(fpsList, 0.20)),
            pd_fps_30: Math.ceil(this.getPercentile(fpsList, 0.30)),
            pd_fps_50: Math.ceil(this.getPercentile(fpsList, 0.50)),
            pd_fps: Math.round(avgFps),
            pd_logic_module_tag: "stage-" + PrintComponent.stage,
            pd_fps_10_jank_count: this.pd_fps_10_jank_count
          };
          this.m_pd_duration = 0;
          this.pd_big_jank_count = 0;
          this.pd_big_jank_time = 0;
          this.pd_small_jank_count = 0;
          this.pd_small_jank_time = 0;
          this.frameCount = 0; // 重置帧计数

          this.pd_fps_10_jank_count = 0;
          this.fpsList = []; // 重置fps数组

          PrintComponent.reportStutter(data);
        }

        get isTouchInSecond() {
          return this.m_isTouchInSecond;
        }

        set isTouchInSecond(value) {
          this.m_isTouchInSecond = value;
        }

        startKeepAlive() {
          this.schedule(() => {
            this.reportKeepAlive();
            this.isTouchInSecond = false;
          }, 1);
        }

        reportKeepAlive() {
          PrintComponent.reportKeepAlive(this.isTouchInSecond);
        }

      }, _class2._instance = null, _class2)) || _class));

      _cclegacy._RF.pop();
    }
  };
});
//# sourceMappingURL=e8a37023d06f9825225128740e25f4a1f438cc5d.js.map