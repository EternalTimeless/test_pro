System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Line, v3, v4, Vec3, UnityUpComponent, _dec, _class, _class2, _crd, ccclass, property, GuideLine;

  function _reportPossibleCrUseOfUnityUpComponent(extras) {
    _reporterNs.report("UnityUpComponent", "../../Base/UnityUpComponent", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Line = _cc.Line;
      v3 = _cc.v3;
      v4 = _cc.v4;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      UnityUpComponent = _unresolved_2.UnityUpComponent;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3b47fe/kdBA4Y+GMIMsn2GR", "GuideLine", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Line', 'Node', 'v2', 'v3', 'v4', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GuideLine", GuideLine = (_dec = ccclass('GuideLine'), _dec(_class = (_class2 = class GuideLine extends (_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
        error: Error()
      }), UnityUpComponent) : UnityUpComponent) {
        constructor(...args) {
          super(...args);
          this.line = void 0;
          this.moHandle = void 0;
          this._startNode = void 0;
          this._endNode = void 0;
          this.temp1 = v3();
          this.temp2 = v3();
          this.speed = 1;
          this.time = 0;
        }

        onLoad() {
          GuideLine.instance = this;
          this.line = this.getComponent(Line);
          this.node.active = false;
          this.moHandle = this.line.material.passes[0].getHandle("mainTiling_Offset");
        }

        setLineNode(start, end) {
          if (end == this._endNode) {
            return;
          }

          this.node.active = false;
          this._startNode = start;
          this._endNode = end;

          if (!start) {
            this.node.active = false;
          } else {
            this.node.active = true;
          }
        }

        _update(dt) {
          if (this._startNode) {
            let startPos = this._startNode.worldPosition;
            let endPos = this._endNode.worldPosition;
            this.temp1.set(startPos);
            this.temp1.y += 0.2;
            this.temp2.set(endPos);
            this.temp2.y += 0.2;
            let dis = Vec3.distance(startPos, endPos); // let count = Math.ceil(dis);

            this.time += dt * this.speed;
            this.line.material.passes[0].setUniform(this.moHandle, v4(dis * 2, 1, -this.time, 0));
            this.line.positions = [this.temp1, this.temp2];
          }
        }

      }, _class2.instance = void 0, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=887d1cb94b93ad1286802e6a49fa7c38a8b59ffe.js.map