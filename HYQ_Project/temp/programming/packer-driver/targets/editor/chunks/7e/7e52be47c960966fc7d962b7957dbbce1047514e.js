System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, tween, Vec3, GroupBag3D, TweenTool, Prop, PropManager, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, GroupPropTransform;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGroupBag3D(extras) {
    _reporterNs.report("GroupBag3D", "./GroupBag3D", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTweenTool(extras) {
    _reporterNs.report("TweenTool", "../../Tool/TweenTool", _context.meta, extras);
  }

  function _reportPossibleCrUseOfProp(extras) {
    _reporterNs.report("Prop", "./Prop", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPropManager(extras) {
    _reporterNs.report("PropManager", "./PropManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CCFloat = _cc.CCFloat;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      GroupBag3D = _unresolved_2.GroupBag3D;
    }, function (_unresolved_3) {
      TweenTool = _unresolved_3.default;
    }, function (_unresolved_4) {
      Prop = _unresolved_4.Prop;
    }, function (_unresolved_5) {
      PropManager = _unresolved_5.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4678fPeotJFy5JPpEHOrV9I", "GroupPropTransform", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'log', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("default", GroupPropTransform = (_dec = ccclass("GroupPropTransform"), _dec2 = property(CCFloat), _dec(_class = (_class2 = class GroupPropTransform extends (_crd && GroupBag3D === void 0 ? (_reportPossibleCrUseOfGroupBag3D({
        error: Error()
      }), GroupBag3D) : GroupBag3D) {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "transformeTime", _descriptor, this);

          this._conversionTime = this.transformeTime;
          this.tranProp = [];
        }

        get placePropPos() {
          // this._showArrow = true;
          this.count++;
          let count = this.NullPosIndex + this.count - 1;
          this.getPropPlaceWordPos(count);
          this._placeTime = this.placeTimeInterval;
          return this.tempV3;
        }

        set addProp(prop) {
          let count = this.NullPosIndex; // prop.tran.priority = count;

          this.tempV3.set(Vec3.ZERO);
          this.getPropPlacePos(count);
          this.tranProp.push(prop);
          this.propList[count] = prop;
          this.node.addChild(prop.node);
          prop.node.setPosition(this.tempV3);
          this.count--;
        }

        get prop() {
          let index = this.getIsTakeIndex();

          if (index == -1) {
            return null;
          } else {
            this._takeTime = this.takeTimeInterval;
            let node = this.propList[index];
            this.propList[index] = null;
            let prop = node.getComponent(_crd && Prop === void 0 ? (_reportPossibleCrUseOfProp({
              error: Error()
            }), Prop) : Prop);
            this.PropDown(index);
            return prop;
          }
        }

        getIsTakeIndex() {
          let takeIndex = -1;

          for (let i = 0; i < this.propList.length; i++) {
            let prop = this.propList[i];

            if (prop && prop.propID == this.takeId) {
              takeIndex = i;
              break;
            }
          }

          return takeIndex;
        }

        get NullPosIndex() {
          let count = this.propList.length;

          for (let i = 0; i < this.propList.length; i++) {
            let prop = this.propList[i];

            if (!prop) {
              count = i;
              break;
            }
          }

          return count;
        }

        PropDown(index) {
          index = index % this.layerCount;
          let nullIndex = -1;

          for (let i = index; i < this.propList.length; i += this.layerCount) {
            let prop = this.propList[i];

            if (prop && nullIndex != -1) {
              this.propList[nullIndex] = prop; // prop.tran.priority = nullIndex;

              this.propList[i] = null;
              this.tempV3.set(Vec3.ZERO);
              this.getPropPlacePos(nullIndex);
              let pos = this.tempV3.clone();
              tween(prop.node).to(0.25, {
                position: pos
              }).start();
              nullIndex += this.layerCount;
            } else if (nullIndex == -1 && !prop) {
              nullIndex = i;
            }
          }

          console.log('下降完成');
        }

        _update(dt) {
          super._update(dt);

          if (!this.tranProp.length) {
            this._conversionTime = this.transformeTime;
            return;
          }

          this._conversionTime -= dt;

          if (this._conversionTime <= 0) {
            this._conversionTime = this.transformeTime;
            let prop = this.tranProp.shift(); // prop.propID = this.takeId;
            // prop

            const pos = prop.node.position;
            const index = this.propList.indexOf(prop);
            const newProp = (_crd && PropManager === void 0 ? (_reportPossibleCrUseOfPropManager({
              error: Error()
            }), PropManager) : PropManager).instance.getProp(this.takeId);
            this.propList[index] = newProp;
            this.node.addChild(newProp.node);
            newProp.node.setPosition(pos);
            prop.remove();
            (_crd && TweenTool === void 0 ? (_reportPossibleCrUseOfTweenTool({
              error: Error()
            }), TweenTool) : TweenTool).scaleShake(newProp.node, 0.3);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "transformeTime", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7e52be47c960966fc7d962b7957dbbce1047514e.js.map