System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Color, tween, v3, Vec3, TweenTool, _crd;

  _export("default", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Color = _cc.Color;
      tween = _cc.tween;
      v3 = _cc.v3;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7d9d1xUc49IP4+Cj6tgt18o", "TweenTool", undefined);

      __checkObsolete__(['Color', 'Node', 'sp', 'Sprite', 'Tween', 'tween', 'UIOpacity', 'v3', 'Vec3']);

      _export("default", TweenTool = class TweenTool {
        static scaleShake(node, delay, time, off) {
          if (delay === void 0) {
            delay = 0;
          }

          if (time === void 0) {
            time = 0.1;
          }

          if (off === void 0) {
            off = Vec3.ONE;
          }

          this.temp.set(node.scale);
          var scale = this.temp.clone();
          var scaleOffX;
          var scaleOffY;
          var scaleOffZ;

          if (off instanceof Vec3) {
            scaleOffX = scale.x + scale.x * off.x * 0.2;
            scaleOffY = scale.y + scale.y * off.y * 0.2;
            scaleOffZ = scale.z + scale.z * off.z * 0.2;
          } else {
            scaleOffX = scale.x + scale.x * off;
            scaleOffY = scale.y + scale.y * off;
            scaleOffZ = scale.z + scale.z * off;
          }

          return tween(node).delay(delay).to(time * 0.6, {
            scale: v3(scaleOffX, scaleOffY, scaleOffZ)
          }).to(time * 0.4, {
            scale: scale
          }).start();
        }

        static scaleShake2(node, delay, time, off) {
          if (delay === void 0) {
            delay = 0;
          }

          if (time === void 0) {
            time = 0.1;
          }

          if (off === void 0) {
            off = Vec3.ONE;
          }

          this.temp.set(node.scale);
          var scale = this.temp.clone();
          var scaleOffX;
          var scaleOffY;
          var scaleOffZ;

          if (off instanceof Vec3) {
            scaleOffX = scale.x + off.x;
            scaleOffY = scale.y + off.y;
            scaleOffZ = scale.z + off.z;
          } else {
            scaleOffX = scale.x + off;
            scaleOffY = scale.y + off;
            scaleOffZ = scale.z + off;
          }

          return tween(node).delay(delay).to(time * 0.9, {
            scale: v3(scaleOffX, scaleOffY, scaleOffZ)
          }).to(time * 0.1, {
            scale: scale
          }).start();
        }

        static aplAni(node, num) {
          return tween(node).to(0.2, {
            opacity: num
          }).start();
        }

        static beatAni(node, s, off, callback) {
          if (off === void 0) {
            off = 0.15;
          }

          if (callback === void 0) {
            callback = null;
          }

          var v2 = new Vec3(s, s);
          var v3 = new Vec3(s + off, s + off, 0);
          tween(node).to(0.1, {
            scale: v3
          }).to(0.1, {
            scale: v2
          }).call(() => {
            if (callback) {
              callback();
            }
          }).start();
        }

        static beatAni2(node, ss, es, intervalTime) {
          if (intervalTime === void 0) {
            intervalTime = 0.1;
          }

          var ess = es;

          if (es < 0) {
            ess = -es;
          }

          var sv3 = new Vec3(ss, ss, 0);
          node.setScale(sv3);
          var ev3 = new Vec3(ess, es, 0);
          tween(node).to(intervalTime, {
            scale: ev3
          }, {
            easing: "backInOut"
          }).start(); // console.log("beatAni2");
        }

        static move(node, endPos, time, callback) {
          if (callback === void 0) {
            callback = null;
          }

          tween(node).to(time, {
            position: endPos
          }).call(() => {
            if (callback) callback();
          }).start();
        }

        static scale(node, startScale, endScale, intervalTime, repeatTime, callback) {
          if (repeatTime === void 0) {
            repeatTime = 1;
          }

          if (callback === void 0) {
            callback = null;
          }

          node.setScale(startScale);

          if (repeatTime == -1) {
            tween(node).to(intervalTime, {
              scale: endScale
            }).to(intervalTime, {
              scale: startScale
            }).union().repeatForever().start();
          } else if (repeatTime > 0) {
            tween(node).to(intervalTime, {
              scale: endScale
            }).to(intervalTime, {
              scale: startScale
            }).union().repeat(repeatTime).call(() => {
              if (callback) callback();
            }).start();
          }
        }

        static jumpMove(node, endPos, time, callback, jumpHeight) {
          if (jumpHeight === void 0) {
            jumpHeight = 100;
          }

          var startPos = node.position.clone(); // 起点

          var destPos = endPos; // 终点

          var middlePos = new Vec3((startPos.x + endPos.x) / 2, TweenTool.max(startPos.y, endPos.y) + jumpHeight, 0); // 中间点（抛物线顶点）
          // 二次贝塞尔曲线公式

          var twoBezier = (t, p1, cp, p2) => {
            var x = (1 - t) ** 2 * p1.x + 2 * t * (1 - t) * cp.x + t ** 2 * p2.x;
            var y = (1 - t) ** 2 * p1.y + 2 * t * (1 - t) * cp.y + t ** 2 * p2.y;
            return new Vec3(x, y, 0);
          };

          tween(node.position).to(time, destPos, {
            onUpdate: (target, ratio) => {
              node.setPosition(twoBezier(ratio, startPos, middlePos, destPos));
            }
          }).call(() => {
            if (callback) callback();
          }).start();
        }

        static spFlashColor(sp, intervalTime, repeatTime, flashColor) {
          if (repeatTime === void 0) {
            repeatTime = 1;
          }

          if (flashColor === void 0) {
            flashColor = new Color(255, 0, 0, 255);
          }

          if (!sp || !sp.node || intervalTime <= 0 || repeatTime <= 0) {
            return;
          }

          sp.color.set(255, 255, 255, 255); // Tween.stopAllByTarget(sp);

          tween(sp).set({
            color: flashColor
          }).delay(intervalTime).set({
            color: Color.WHITE
          }).delay(intervalTime).union().repeat(repeatTime).start();
        }

        static shakeNode(node, tweenDuration, repeatTime, shakeScale) {
          if (tweenDuration === void 0) {
            tweenDuration = 0.02;
          }

          if (repeatTime === void 0) {
            repeatTime = 1;
          }

          if (shakeScale === void 0) {
            shakeScale = 1;
          }

          var startPos = node.position.clone();
          var posArray = [new Vec3(5, 7, 0), new Vec3(-6, 7, 0), new Vec3(-13, 3, 0), new Vec3(3, -6, 0), new Vec3(-5, 5, 0), new Vec3(2, -8, 0), new Vec3(-8, -10, 0), new Vec3(3, 10, 0)];
          posArray.forEach((v, i) => {
            v.x *= shakeScale;
            v.x += startPos.x;
            v.y *= shakeScale;
            v.y += startPos.y;
            v.z += startPos.z;
          });
          posArray.sort(() => {
            return Math.random() - 0.5;
          });
          var t = tween(node).to(tweenDuration, {
            position: posArray[0]
          }).to(tweenDuration, {
            position: posArray[1]
          }).to(tweenDuration, {
            position: posArray[2]
          }).to(tweenDuration, {
            position: posArray[3]
          }).to(tweenDuration, {
            position: posArray[4]
          }).to(tweenDuration, {
            position: posArray[5]
          }).to(tweenDuration, {
            position: posArray[6]
          }).to(tweenDuration, {
            position: posArray[7]
          }).to(tweenDuration, {
            position: startPos
          }).repeat(repeatTime).union().start();
        }

        static min(a, b) {
          return a < b ? a : b;
        }

        static max(a, b) {
          return a > b ? a : b;
        }

        static jumpScale(node, delay, height) {
          if (delay === void 0) {
            delay = 0;
          }

          if (height === void 0) {
            height = 1.2;
          }

          var y = node.position.y;
          node.setScale(Vec3.ZERO);
          return tween(node).delay(delay) // 第一阶段：跳起并放大到1.15
          .to(0.2, {
            y: y + height,
            scale: TweenTool.scale_1
          }, {
            easing: 'sineOut'
          }) // 第二阶段：空中短暂滞留（微微上浮再停顿）
          .to(0.1, {
            y: y + height * 1.2
          }).delay(0.1) // 第三阶段：下落回原位置，scale变为1
          .to(0.15, {
            y: y,
            scale: Vec3.ONE
          }, {
            easing: 'sineIn'
          }) // 第四阶段：落地果冻弹跳效果（先压扁再弹起）
          .to(0.08, {
            scale: TweenTool.scale_jelly_1
          }, {
            easing: 'sineOut'
          }).to(0.1, {
            scale: TweenTool.scale_jelly_2
          }, {
            easing: 'sineOut'
          }).to(0.08, {
            scale: TweenTool.scale_jelly_3
          }, {
            easing: 'sineOut'
          }).to(0.06, {
            scale: Vec3.ONE
          }, {
            easing: 'sineOut'
          }).start();
        }
        /**
         * 物体被攻击效果 - 缩放抖动 + 位置震动
         * @param node 目标节点
         * @param shakeIntensity 位置震动强度 (默认1，单位约0.1米)
         * @param scaleIntensity 缩放抖动强度 (默认0.15，范围0-0.5)
         */


        static underAttack(node, shakeIntensity, scaleIntensity) {
          if (shakeIntensity === void 0) {
            shakeIntensity = 1;
          }

          if (scaleIntensity === void 0) {
            scaleIntensity = 0.15;
          }

          var originalPos = node.position.clone();
          var originalScale = node.scale.clone(); // 震动偏移 (基于x轴和y轴，单位约0.1米)

          var shakeOffsets = [new Vec3(originalPos.x + 0.08 * shakeIntensity, originalPos.y + 0.06 * shakeIntensity, originalPos.z), new Vec3(originalPos.x - 0.06 * shakeIntensity, originalPos.y + 0.08 * shakeIntensity, originalPos.z), new Vec3(originalPos.x - 0.08 * shakeIntensity, originalPos.y - 0.04 * shakeIntensity, originalPos.z), new Vec3(originalPos.x + 0.05 * shakeIntensity, originalPos.y - 0.07 * shakeIntensity, originalPos.z), new Vec3(originalPos.x, originalPos.y, originalPos.z)]; // 缩放抖动 (基于scaleIntensity)

          var scale1 = v3(originalScale.x * (1 - scaleIntensity), originalScale.y * (1 + scaleIntensity), originalScale.z);
          var scale2 = v3(originalScale.x * (1 + scaleIntensity * 0.5), originalScale.y * (1 - scaleIntensity), originalScale.z);
          return tween(node).parallel( // 位置震动
          tween(node).to(0.03, {
            position: shakeOffsets[0]
          }).to(0.03, {
            position: shakeOffsets[1]
          }).to(0.03, {
            position: shakeOffsets[2]
          }).to(0.03, {
            position: shakeOffsets[3]
          }).to(0.05, {
            position: originalPos
          }), // 缩放抖动
          tween(node).to(0.06, {
            scale: scale1
          }).to(0.06, {
            scale: scale2
          }).to(0.08, {
            scale: originalScale
          })).start();
        }

      });

      TweenTool.temp = new Vec3();
      TweenTool.scale_1 = v3(1.15, 1.15, 1.15);
      TweenTool.scale_jelly_1 = v3(1.1, 0.85, 1.1);
      TweenTool.scale_jelly_2 = v3(0.92, 1.12, 0.92);
      TweenTool.scale_jelly_3 = v3(1.05, 0.95, 1.05);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0fd75e1d9556ba520ee98c89195f9d0594110ad2.js.map