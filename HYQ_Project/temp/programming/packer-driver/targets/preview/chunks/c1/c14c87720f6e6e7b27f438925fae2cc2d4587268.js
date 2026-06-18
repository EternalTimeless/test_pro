System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, CCInteger, instantiate, Label, Node, Tween, tween, v3, Vec3, BattleTarget3D, BulletMonsterCollisionManager, ColliderTag, COLLIDE_TYPE, EventType, SoundEnum, EventManager, AudioManager, TweenTool, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _crd, ccclass, property, PropLalianGate;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfBattleTarget3D(extras) {
    _reporterNs.report("BattleTarget3D", "../Battle/BattleTarger/BattleTarget3D", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletMonsterCollisionManager(extras) {
    _reporterNs.report("BulletMonsterCollisionManager", "../Battle/BulletMonsterCollisionManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfColliderTag(extras) {
    _reporterNs.report("ColliderTag", "../Battle/CollectBattleTarger/ColliderTag", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCOLLIDE_TYPE(extras) {
    _reporterNs.report("COLLIDE_TYPE", "../Battle/CollectBattleTarger/ColliderTag", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundEnum(extras) {
    _reporterNs.report("SoundEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../../Base/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "../../Base/AudioManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTweenTool(extras) {
    _reporterNs.report("TweenTool", "../../Tool/TweenTool", _context.meta, extras);
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
      CCInteger = _cc.CCInteger;
      instantiate = _cc.instantiate;
      Label = _cc.Label;
      Node = _cc.Node;
      Tween = _cc.Tween;
      tween = _cc.tween;
      v3 = _cc.v3;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      BattleTarget3D = _unresolved_2.BattleTarget3D;
    }, function (_unresolved_3) {
      BulletMonsterCollisionManager = _unresolved_3.default;
    }, function (_unresolved_4) {
      ColliderTag = _unresolved_4.default;
      COLLIDE_TYPE = _unresolved_4.COLLIDE_TYPE;
    }, function (_unresolved_5) {
      EventType = _unresolved_5.EventType;
      SoundEnum = _unresolved_5.SoundEnum;
    }, function (_unresolved_6) {
      EventManager = _unresolved_6.default;
    }, function (_unresolved_7) {
      AudioManager = _unresolved_7.default;
    }, function (_unresolved_8) {
      TweenTool = _unresolved_8.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1bf34OLHadENJMLgUQy1SH8", "PropLalianGate", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'CCInteger', 'instantiate', 'Label', 'Node', 'Tween', 'tween', 'v3', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PropLalianGate", PropLalianGate = (_dec = ccclass('PropLalianGate'), _dec2 = property({
        type: Node,
        displayName: '拉链根节点',
        tooltip: '拖入 Lalian 根节点；不填时会在当前节点子级里查找名为 Lalian 的节点。'
      }), _dec3 = property({
        type: Node,
        displayName: '受击Cube节点',
        tooltip: '拖入 Lalian 下的 Cube。子弹会以这个节点作为命中中心，Cube 会随拉链进度向前移动。'
      }), _dec4 = property({
        type: Label,
        displayName: '血量显示文本',
        tooltip: '可选。显示剩余受击次数，不填则不显示。'
      }), _dec5 = property({
        type: CCInteger,
        displayName: '拉链段数量',
        tooltip: '需要生成/使用的拉链段数。填 0 时使用编辑器里已有的 Node 段数。'
      }), _dec6 = property({
        type: CCInteger,
        displayName: '每段受击次数(旧参数)',
        tooltip: '旧拉链逻辑使用。当前前沿推进效果不再读取这个字段。'
      }), _dec7 = property({
        type: CCFloat,
        displayName: '拉链段Z间距',
        tooltip: '运行时复制 Node 段时，每段之间的 Z 轴间距。也用于计算 +1/+99 的起始位置。'
      }), _dec8 = property({
        type: CCFloat,
        displayName: '最终收拢X',
        tooltip: '每段左右子节点最终靠拢到的 X 绝对值。比如 0.1 表示最终为 -0.1 和 0.1。'
      }), _dec9 = property({
        type: CCFloat,
        displayName: '道具队列间隔Z',
        tooltip: '+1/+99 队列与拉链末端之间的额外 Z 轴距离。觉得牌子离拉链太近/太远就调这个。'
      }), _dec10 = property({
        type: CCInteger,
        displayName: '完成后放出数量',
        tooltip: '拉链全部完成后，向玩家移动的 +1/+99 道具数量。填 0 表示持续放出，不主动停。'
      }), _dec11 = property({
        type: CCFloat,
        displayName: '受击动画时长',
        tooltip: '每次受击后，当前段靠拢动画的持续时间。'
      }), _dec12 = property({
        type: CCFloat,
        displayName: 'Cube消失时长',
        tooltip: '所有拉链段完成后，Cube 缩小消失动画的持续时间。'
      }), _dec(_class = (_class2 = class PropLalianGate extends (_crd && BattleTarget3D === void 0 ? (_reportPossibleCrUseOfBattleTarget3D({
        error: Error()
      }), BattleTarget3D) : BattleTarget3D) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "lalianRoot", _descriptor, this);

          _initializerDefineProperty(this, "cube", _descriptor2, this);

          _initializerDefineProperty(this, "hpLabel", _descriptor3, this);

          _initializerDefineProperty(this, "nodeCount", _descriptor4, this);

          _initializerDefineProperty(this, "hitPerNode", _descriptor5, this);

          _initializerDefineProperty(this, "nodeSpacingZ", _descriptor6, this);

          _initializerDefineProperty(this, "closeX", _descriptor7, this);

          _initializerDefineProperty(this, "propGapZ", _descriptor8, this);

          _initializerDefineProperty(this, "moveCount", _descriptor9, this);

          _initializerDefineProperty(this, "hitAnimTime", _descriptor10, this);

          _initializerDefineProperty(this, "cubeHideTime", _descriptor11, this);

          this.segments = [];
          this.segmentChildStartPos = [];
          this.segmentIndex = 0;
          this.cubeStartScale = new Vec3(1, 1, 1);
          this.animating = false;
          this.finished = false;
          this.registered = false;
        }

        get hitNode() {
          var _this$cube;

          return (_this$cube = this.cube) != null ? _this$cube : super.hitNode;
        }

        getPropStartZ() {
          var count = this.nodeCount > 0 ? this.nodeCount : this.getAuthoredSegmentCount();
          return this.propGapZ + Math.max(0, count) * this.nodeSpacingZ;
        }

        start() {
          this.initGate();
        }

        onDestroy() {
          this.unregisterTarget();
        }

        _update(dt) {}

        initGate() {
          this.setupColliderTag();
          this.prepareLalian();

          if (this.segments.length <= 0 || !this.cube) {
            return;
          }

          var totalHp = Math.max(1, this.segments.length - 1);
          this.MaxHp = totalHp;
          this.curHp = totalHp;
          this.isDestroy = false;
          this.finished = false;
          this.animating = false;
          this.updateHpLabel(totalHp);
          this.registerTarget();
        }

        damage(power) {
          if (this.animating || this.finished) {
            this.curHp = Math.max(1, this.curHp);
            return;
          }

          this.playHitStep();
        }

        die() {}

        repelBattleTarget(target, reoel) {}

        playHitStep() {
          var _this$hpLabel;

          var closeSegmentIndex = this.segmentIndex + 1;
          var closeSegment = this.segments[closeSegmentIndex];

          if (!closeSegment) {
            this.completeGate();
            return;
          }

          this.animating = true;
          (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).inst.playOneShot((_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
            error: Error()
          }), SoundEnum) : SoundEnum).Sound_tire_hit, 0.4, 0.08);

          if ((_this$hpLabel = this.hpLabel) != null && _this$hpLabel.node) {
            (_crd && TweenTool === void 0 ? (_reportPossibleCrUseOfTweenTool({
              error: Error()
            }), TweenTool) : TweenTool).scaleShake(this.hpLabel.node);
          }

          this.flashRed();
          this.applySegmentProgress(closeSegment, closeSegmentIndex, 1, true);
          this.segmentIndex = closeSegmentIndex;
          var previewSegmentIndex = this.segmentIndex + 1;
          var previewSegment = this.segments[previewSegmentIndex];

          if (previewSegment) {
            this.applySegmentProgress(previewSegment, previewSegmentIndex, 0.5, true);
          }

          var remainHits = this.getRemainSegmentCount();
          this.curHp = Math.max(1, remainHits);
          this.updateHpLabel(remainHits);

          if (this.cube) {
            var cubePos = this.cube.position;
            Tween.stopAllByTarget(this.cube);
            tween(this.cube).to(this.hitAnimTime, {
              position: v3(cubePos.x, cubePos.y, closeSegment.position.z)
            }, {
              easing: 'cubicOut'
            }).start();
          }

          this.scheduleOnce(() => {
            this.animating = false;

            if (this.segmentIndex >= this.segments.length - 1) {
              this.completeGate();
            }
          }, this.hitAnimTime);
        }

        completeGate() {
          if (this.finished) {
            return;
          }

          this.finished = true;
          this.animating = false;
          this.curHp = 1;
          this.unregisterTarget();
          this.updateHpLabel(0);

          var emitFinish = () => {
            var info = {
              moveCount: this.moveCount
            };
            (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
              error: Error()
            }), EventManager) : EventManager).instance.emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
              error: Error()
            }), EventType) : EventType).PROP_ARMS_DIE, info);
            this.node.emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
              error: Error()
            }), EventType) : EventType).PROP_ARMS_DIE, info);
          };

          if (!this.cube) {
            emitFinish();
            return;
          }

          Tween.stopAllByTarget(this.cube);
          tween(this.cube).to(this.cubeHideTime, {
            scale: Vec3.ZERO
          }, {
            easing: 'sineIn'
          }).call(() => {
            this.cube.active = false;
            this.cube.setScale(this.cubeStartScale);
            emitFinish();
          }).start();
        }

        prepareLalian() {
          var _this$lalianRoot, _this$cube2;

          this.lalianRoot = (_this$lalianRoot = this.lalianRoot) != null ? _this$lalianRoot : this.findNodeByName(this.node, 'Lalian');
          this.cube = (_this$cube2 = this.cube) != null ? _this$cube2 : this.findNodeByName(this.lalianRoot, 'Cube');
          this.segments.length = 0;
          this.segmentChildStartPos.length = 0;
          this.segmentIndex = 0;

          if (!this.lalianRoot || !this.cube) {
            return;
          }

          this.cube.active = true;
          this.cubeStartScale.set(this.cube.scale);
          this.cube.setScale(this.cubeStartScale);
          var segmentNodes = [];

          for (var i = 0; i < this.lalianRoot.children.length; i++) {
            var child = this.lalianRoot.children[i];

            if (!child || child === this.cube || child.name === 'Cube' || child.children.length <= 0) {
              continue;
            }

            segmentNodes.push(child);
          }

          var desiredCount = this.nodeCount > 0 ? this.nodeCount : segmentNodes.length;

          if (desiredCount > segmentNodes.length && segmentNodes.length > 0) {
            var template = segmentNodes[0];
            var basePos = template.position;

            for (var _i = segmentNodes.length; _i < desiredCount; _i++) {
              var node = instantiate(template);
              node.name = template.name + "_" + _i;
              this.lalianRoot.addChild(node);
              node.setPosition(basePos.x, basePos.y, basePos.z + this.nodeSpacingZ * _i);
              segmentNodes.push(node);
            }
          }

          for (var _i2 = 0; _i2 < segmentNodes.length; _i2++) {
            segmentNodes[_i2].active = _i2 < desiredCount;
          }

          for (var _i3 = 0; _i3 < desiredCount && _i3 < segmentNodes.length; _i3++) {
            var segment = segmentNodes[_i3];
            this.segments.push(segment);
            var startPosList = [];

            for (var j = 0; j < segment.children.length; j++) {
              var part = segment.children[j];
              var startPos = part.position.clone();
              startPosList.push(startPos);
              Tween.stopAllByTarget(part);
              part.setPosition(startPos);
            }

            this.segmentChildStartPos.push(startPosList);
          }

          this.applyInitialProgress();
        }

        getAuthoredSegmentCount() {
          var _this$lalianRoot2, _this$cube3;

          var root = (_this$lalianRoot2 = this.lalianRoot) != null ? _this$lalianRoot2 : this.findNodeByName(this.node, 'Lalian');
          var cube = (_this$cube3 = this.cube) != null ? _this$cube3 : this.findNodeByName(root, 'Cube');

          if (!root) {
            return 0;
          }

          var count = 0;

          for (var i = 0; i < root.children.length; i++) {
            var child = root.children[i];

            if (child && child !== cube && child.name !== 'Cube' && child.children.length > 0) {
              count++;
            }
          }

          return count;
        }

        applyInitialProgress() {
          if (this.segments[0]) {
            this.applySegmentProgress(this.segments[0], 0, 1, false);
          }

          if (this.segments[1]) {
            this.applySegmentProgress(this.segments[1], 1, 0.5, false);
          }

          if (this.cube && this.segments[0]) {
            var cubePos = this.cube.position;
            this.cube.setPosition(cubePos.x, cubePos.y, this.segments[0].position.z);
          }
        }

        applySegmentProgress(segment, segmentIndex, progress, useTween) {
          var startPosList = this.segmentChildStartPos[segmentIndex];

          if (!segment || !startPosList) {
            return;
          }

          for (var i = 0; i < segment.children.length; i++) {
            var part = segment.children[i];
            var startPos = startPosList[i];

            if (!part || !startPos) {
              continue;
            }

            var targetX = startPos.x;

            if (Math.abs(startPos.x) > this.closeX) {
              var closeX = startPos.x > 0 ? this.closeX : -this.closeX;
              targetX = startPos.x + (closeX - startPos.x) * progress;
            }

            Tween.stopAllByTarget(part);
            var targetPos = v3(targetX, startPos.y, startPos.z);

            if (useTween) {
              tween(part).to(this.hitAnimTime, {
                position: targetPos
              }, {
                easing: 'cubicOut'
              }).start();
            } else {
              part.setPosition(targetPos);
            }
          }
        }

        getRemainSegmentCount() {
          return Math.max(0, this.segments.length - this.segmentIndex - 1);
        }

        updateHpLabel(value) {
          if (this.hpLabel) {
            this.hpLabel.string = value > 0 ? value.toString() : '';
          }
        }

        setupColliderTag() {
          var tag = this.getComponent(_crd && ColliderTag === void 0 ? (_reportPossibleCrUseOfColliderTag({
            error: Error()
          }), ColliderTag) : ColliderTag);

          if (!tag) {
            tag = this.addComponent(_crd && ColliderTag === void 0 ? (_reportPossibleCrUseOfColliderTag({
              error: Error()
            }), ColliderTag) : ColliderTag);
          }

          tag.tag = (_crd && COLLIDE_TYPE === void 0 ? (_reportPossibleCrUseOfCOLLIDE_TYPE({
            error: Error()
          }), COLLIDE_TYPE) : COLLIDE_TYPE).MONSTER;
        }

        registerTarget() {
          if (this.registered) {
            return;
          }

          (_crd && BulletMonsterCollisionManager === void 0 ? (_reportPossibleCrUseOfBulletMonsterCollisionManager({
            error: Error()
          }), BulletMonsterCollisionManager) : BulletMonsterCollisionManager).instance.registerTarget(this);
          this.registered = true;
        }

        unregisterTarget() {
          if (!this.registered) {
            return;
          }

          (_crd && BulletMonsterCollisionManager === void 0 ? (_reportPossibleCrUseOfBulletMonsterCollisionManager({
            error: Error()
          }), BulletMonsterCollisionManager) : BulletMonsterCollisionManager).instance.unregisterTarget(this);
          this.registered = false;
        }

        findNodeByName(root, name) {
          if (!root) {
            return null;
          }

          if (root.name === name) {
            return root;
          }

          for (var i = 0; i < root.children.length; i++) {
            var result = this.findNodeByName(root.children[i], name);

            if (result) {
              return result;
            }
          }

          return null;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "lalianRoot", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "cube", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "hpLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "nodeCount", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "hitPerNode", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "nodeSpacingZ", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.8;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "closeX", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.1;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "propGapZ", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.2;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "moveCount", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "hitAnimTime", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.12;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "cubeHideTime", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.08;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=c14c87720f6e6e7b27f438925fae2cc2d4587268.js.map