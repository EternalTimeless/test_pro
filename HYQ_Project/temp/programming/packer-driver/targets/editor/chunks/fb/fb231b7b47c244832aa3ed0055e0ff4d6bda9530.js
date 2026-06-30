System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, sys, super_html_playable, SuperPackage, _crd;

  function _reportPossibleCrUseOfsuper_html_playable(extras) {
    _reporterNs.report("super_html_playable", "./super_html_playable", _context.meta, extras);
  }

  _export("SuperPackage", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      sys = _cc.sys;
    }, function (_unresolved_2) {
      super_html_playable = _unresolved_2.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "aa6cdCmDpFAE5S84gYwSfZa", "SuperPackage", undefined);

      __checkObsolete__(['sys']);

      // 扩展Window接口
      _export("SuperPackage", SuperPackage = class SuperPackage {
        // 私有构造函数，防止外部实例化
        constructor() {
          /**
           * 谷歌链接（打包工具中设置会自动同步到这里）
           */
          this._google_play_url = "";

          /**
           * 苹果链接（打包工具中设置会自动同步到这里）
           */
          this._appstore_url = "";
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).set_google_play_url(this._google_play_url);
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).set_app_store_url(this._appstore_url);
        } // 获取单例实例


        static get Instance() {
          if (!SuperPackage._instance) {
            SuperPackage._instance = new SuperPackage();
          }

          return SuperPackage._instance;
        }

        get materialName() {
          return window.materialName || '无（会在使用SuperPackage打包后自动注入）';
        }
        /**
         * 是否为KR版本(只有在SSD有用)
         */


        get isKR() {
          return window.isKR || false;
        }
        /**
         * 下载
         */


        Download() {
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).download(); // 如果是浏览器直接跳转网页以防止甲方说为什么不跳😆

          this._openurl();
        }
        /**
         * 自动跳转下载
         */


        AutoDownload() {
          if (!window.isTCE) {
            console.log('不跳转，因为不是TCE版本或者未注入window.isTCE变量');
            return;
          }

          ;
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).download(); // 如果是浏览器直接跳转网页以防止甲方说为什么不跳😆

          this._openurl();
        }
        /**
         * 强制跳转下载（打包工具会自动判断是不是TCE版本选择跳不跳转）
         */


        DownloadTCE() {
          if (!window.isTCE) {
            console.log('不跳转，因为不是TCE版本或者未注入window.isTCE变量');
            return;
          }

          ;
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).download(); // 如果是浏览器直接跳转网页以防止甲方说为什么不跳😆

          this._openurl();
        }

        _openurl() {
          // return;
          if (sys.isBrowser) {
            if (sys.os === sys.OS.IOS) {
              sys.openURL(this._appstore_url);
            } else {
              sys.openURL(this._google_play_url);
            }
          }
        }

      });

      SuperPackage._instance = void 0;
      SuperPackage.Instance;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=fb231b7b47c244832aa3ed0055e0ff4d6bda9530.js.map