System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, sys, PBASDK, SuperPackageJY, _crd;

  function _reportPossibleCrUseOfPBASDK(extras) {
    _reporterNs.report("PBASDK", "./PBASDK-v3/PBASDK", _context.meta, extras);
  }

  _export("SuperPackageJY", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      sys = _cc.sys;
    }, function (_unresolved_2) {
      PBASDK = _unresolved_2.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e18559zBxpDwqnygVkIS5/v", "SuperPackageJY", undefined);

      __checkObsolete__(['sys']);

      // 扩展Window接口
      _export("SuperPackageJY", SuperPackageJY = class SuperPackageJY {
        // 私有构造函数，防止外部实例化
        constructor() {} // 获取单例实例


        static get Instance() {
          if (!SuperPackageJY.instance) {
            SuperPackageJY.instance = new SuperPackageJY();
          }

          return SuperPackageJY.instance;
        }

        get materialName() {
          return window.materialName || '无（会在使用SuperPackage打包后自动注入）';
        }
        /**
         * 下载
         */


        Download() {
          (_crd && PBASDK === void 0 ? (_reportPossibleCrUseOfPBASDK({
            error: Error()
          }), PBASDK) : PBASDK).ClickDownloadBar(); // 获取当前平台直接跳转网页以防止甲方说为什么不跳😆

          if (sys.isBrowser) {
            if (sys.os === sys.OS.IOS) {
              //@ts-ignore
              window.super_html && sys.openURL(super_html.appstore_url);
            } else {
              //@ts-ignore
              window.super_html && sys.openURL(super_html.google_play_url);
            }
          }
        }
        /**
         * 自动跳转下载
         */


        AutoDownload() {
          if (!window.isTCE) {
            console.log('不跳转，因为不是自动跳转版本');
            return;
          }

          ;
          (_crd && PBASDK === void 0 ? (_reportPossibleCrUseOfPBASDK({
            error: Error()
          }), PBASDK) : PBASDK).AuToJumpDownload(); // 获取当前平台直接跳转网页以防止甲方说为什么不跳😆

          if (sys.isBrowser) {
            if (sys.os === sys.OS.IOS) {
              //@ts-ignore
              window.super_html && sys.openURL(super_html.appstore_url);
            } else {
              //@ts-ignore
              window.super_html && sys.openURL(super_html.google_play_url);
            }
          }
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
          (_crd && PBASDK === void 0 ? (_reportPossibleCrUseOfPBASDK({
            error: Error()
          }), PBASDK) : PBASDK).AuToJumpDownload(); // 获取当前平台直接跳转网页以防止甲方说为什么不跳😆

          if (sys.isBrowser) {
            if (sys.os === sys.OS.IOS) {
              //@ts-ignore
              window.super_html && sys.openURL(super_html.appstore_url);
            } else {
              //@ts-ignore
              window.super_html && sys.openURL(super_html.google_play_url);
            }
          }
        }

      });

      SuperPackageJY.instance = void 0;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4d68417d37cd80fe73d65d56dfe11dd26e9ef91a.js.map