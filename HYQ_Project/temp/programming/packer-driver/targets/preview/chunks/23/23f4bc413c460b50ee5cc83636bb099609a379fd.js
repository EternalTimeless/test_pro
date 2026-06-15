System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, PLASDK, _crd, PLASDK_EVENT;

  _export("default", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4b409DhfJVLjorDpxnMYRUL", "PLASDK", undefined);

      _export("PLASDK_EVENT", PLASDK_EVENT = /*#__PURE__*/function (PLASDK_EVENT) {
        PLASDK_EVENT["LOADING"] = "LOADING";
        PLASDK_EVENT["LOADED"] = "LOADED";
        PLASDK_EVENT["DISPLAYED"] = "DISPLAYED";
        PLASDK_EVENT["CHALLENGE_STARTED"] = "CHALLENGE_STARTED";
        PLASDK_EVENT["CHALLENGE_FAILED"] = "CHALLENGE_FAILED";
        PLASDK_EVENT["CHALLENGE_RETRY"] = "CHALLENGE_RETRY";
        PLASDK_EVENT["CHALLENGE_PASS_25"] = "CHALLENGE_PASS_25";
        PLASDK_EVENT["CHALLENGE_PASS_50"] = "CHALLENGE_PASS_50";
        PLASDK_EVENT["CHALLENGE_PASS_75"] = "CHALLENGE_PASS_75";
        PLASDK_EVENT["CHALLENGE_SOLVED"] = "CHALLENGE_SOLVED";
        PLASDK_EVENT["CTA_CLICKED"] = "CTA_CLICKED";
        PLASDK_EVENT["ENDCARD_SHOWN"] = "ENDCARD_SHOWN";
        return PLASDK_EVENT;
      }({}));

      _export("default", PLASDK = class PLASDK {
        static SendData(event) {
          console.log("PLASDK.SendData: " + event); //@ts-ignore

          if (typeof window.ALPlayableAnalytics != 'undefined') {
            //@ts-ignore
            window.ALPlayableAnalytics.trackEvent(event);
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=23f4bc413c460b50ee5cc83636bb099609a379fd.js.map