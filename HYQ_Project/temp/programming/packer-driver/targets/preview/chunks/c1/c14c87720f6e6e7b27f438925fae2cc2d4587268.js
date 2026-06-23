System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCBoolean, CCFloat, CCInteger, Label, MeshRenderer, Node, Tween, tween, v3, Vec3, BattleTarget3D, BulletMonsterCollisionManager, ColliderTag, COLLIDE_TYPE, EventType, SoundEnum, EventManager, AudioManager, TweenTool, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _descriptor34, _descriptor35, _descriptor36, _crd, ccclass, property, PropLalianGate;

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
      CCBoolean = _cc.CCBoolean;
      CCFloat = _cc.CCFloat;
      CCInteger = _cc.CCInteger;
      Label = _cc.Label;
      MeshRenderer = _cc.MeshRenderer;
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

      __checkObsolete__(['_decorator', 'CCBoolean', 'CCFloat', 'CCInteger', 'Label', 'MeshRenderer', 'Node', 'Tween', 'tween', 'v3', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PropLalianGate", PropLalianGate = (_dec = ccclass('PropLalianGate'), _dec2 = property({
        type: Node,
        displayName: '拉链根节点',
        tooltip: '拖入 lalian_01/lalian_02 的根节点。为空时只使用下面手动拖入的齿条列表。'
      }), _dec3 = property({
        type: Node,
        displayName: '滑块受击节点',
        tooltip: '拖入 SM_laliantou_02 / SM_laliantou_03。子弹锁定和命中都以它为中心，推进时它会沿 Z 轴移动。'
      }), _dec4 = property({
        type: Node,
        displayName: '拉环根节点',
        tooltip: '挂在滑块上的拉环节点。滑块受击时，这个节点会做小幅摆动。'
      }), _dec5 = property({
        type: Node,
        displayName: '拉环尾巴节点',
        tooltip: '拉环尾巴节点。滑块受击时，这个节点会做更明显的摆动。'
      }), _dec6 = property({
        type: [Node],
        displayName: '拉链齿条列表',
        tooltip: '拖入需要参与推进的 SM_lalian-xxx 节点。列表为空且开启自动收集时，会从拉链根节点下自动收集 SM_lalian-xxx。'
      }), _dec7 = property({
        type: CCBoolean,
        displayName: '自动收集齿条',
        tooltip: '齿条列表为空时，从拉链根节点的直接子节点中自动收集名字以 SM_lalian 开头的节点；不会生成新节点。'
      }), _dec8 = property({
        type: CCBoolean,
        displayName: '按Z轴排序齿条',
        tooltip: '开启后按齿条本地 Z 轴排序，适合 lalian_01/lalian_02 这种已有齿条资源。关闭则完全使用上方列表顺序。'
      }), _dec9 = property({
        type: CCBoolean,
        displayName: '从Z最大端开始',
        tooltip: '开启后整条拉链以齿条 Z 最大端作为初始点，滑块和齿条都从这一端开始推进。'
      }), _dec10 = property({
        type: CCBoolean,
        displayName: '从最远端开始(旧)',
        tooltip: '旧排序方式。只有关闭“从Z最大端开始”时才会生效。'
      }), _dec11 = property({
        type: CCBoolean,
        displayName: '从滑块端开始(旧)',
        tooltip: '旧排序方式。只有关闭“从最远端开始”时才会生效。'
      }), _dec12 = property({
        type: CCBoolean,
        displayName: 'Z轴倒序推进',
        tooltip: '在当前排序结果上再反向一次。若“从Z最大端开始”后现场仍然相反，就勾选这个。'
      }), _dec13 = property({
        type: Label,
        displayName: '血量文本',
        tooltip: '可选。显示剩余需要受击推进的齿条数量。'
      }), _dec14 = property({
        type: CCInteger,
        displayName: '使用齿条数量(0=全部)',
        tooltip: '运行时实际使用多少个齿条。填 0 表示使用齿条列表/自动收集到的全部齿条；不会自动生成缺少的齿条。'
      }), _dec15 = property({
        type: CCInteger,
        displayName: '每段受击次数(旧参数)',
        tooltip: '旧拉链逻辑遗留参数，当前独立拉链不再读取。保留是为了避免旧场景序列化丢字段。'
      }), _dec16 = property({
        type: CCInteger,
        displayName: '每对齿条数量',
        tooltip: '默认 2，表示每 2 个 SM_lalian 齿条算作一对，一次受击推进一对。'
      }), _dec17 = property({
        type: CCInteger,
        displayName: '初始闭合对数',
        tooltip: '默认前 2 对齿条完全闭合。'
      }), _dec18 = property({
        type: CCFloat,
        displayName: '下一对初始闭合度',
        tooltip: '初始闭合对数之后的下一对闭合度。默认 0.5 表示半闭合。'
      }), _dec19 = property({
        type: CCFloat,
        displayName: '再下一对初始闭合度',
        tooltip: '下一对之后的再下一对闭合度。默认 0.25 表示 1/4 闭合。'
      }), _dec20 = property({
        type: CCFloat,
        displayName: '齿条Z间距(兜底)',
        tooltip: '无法从齿条节点计算长度时，用这个值估算 +1/+99 的起始距离。'
      }), _dec21 = property({
        type: CCBoolean,
        displayName: '自动计算收拢中心X',
        tooltip: '开启后用本次使用齿条的最小/最大 X 计算中线；适合 lalian_01/lalian_02。关闭后使用“手动收拢中心X”。'
      }), _dec22 = property({
        type: CCFloat,
        displayName: '手动收拢中心X',
        tooltip: '关闭自动计算时生效。齿条会向这个本地 X 位置靠拢。'
      }), _dec23 = property({
        type: CCFloat,
        displayName: '最终保留半宽X(旧参数)',
        tooltip: '旧临时拉链参数。当前 lalian_01/lalian_02 默认闭合资源会直接收回到资源默认位置，不再读取这个值。'
      }), _dec24 = property({
        type: CCFloat,
        displayName: '开链外扩X',
        tooltip: '资源默认是闭合状态时，初始化会让齿条沿 X 轴向两侧外扩这个距离，形成打开状态。'
      }), _dec25 = property({
        type: CCBoolean,
        displayName: '反向开链方向',
        tooltip: '开链初始化方向反了就切这个。开启后，齿条沿 X 轴外扩的方向会整体反过来。'
      }), _dec26 = property({
        type: CCFloat,
        displayName: '道具队列间隔Z',
        tooltip: '+1/+99 队列与拉链末端之间额外保留的 Z 轴距离。'
      }), _dec27 = property({
        type: CCInteger,
        displayName: '完成后放出数量',
        tooltip: '拉链全部完成后，向玩家移动的 +1/+99 道具数量。填 0 表示持续放出，不主动停。'
      }), _dec28 = property({
        type: CCFloat,
        displayName: '受击动画时长',
        tooltip: '每次受击后，齿条收拢和滑块移动的动画时间。'
      }), _dec29 = property({
        type: CCFloat,
        displayName: '滑块消失时长',
        tooltip: '所有齿条完成后，滑块缩小消失动画的持续时间。'
      }), _dec30 = property({
        type: CCBoolean,
        displayName: '保留滑块Z偏移',
        tooltip: '开启后，初始化时会保留资源里滑块相对起始齿条的 Z 轴偏移。当前默认关闭，滑块直接放到齿条前沿。'
      }), _dec31 = property({
        type: CCFloat,
        displayName: '手动滑块Z偏移',
        tooltip: '关闭“保留滑块Z偏移”时生效。滑块移动目标会在齿条 Z 位置基础上额外加这个偏移。'
      }), _dec32 = property({
        type: CCBoolean,
        displayName: '反向滑块移动Z',
        tooltip: '只反转滑块沿 Z 轴的移动方向，不影响齿条从哪一端闭合。当前默认关闭，滑块跟随 Z 最大端顺序。'
      }), _dec33 = property({
        type: CCFloat,
        displayName: '子弹锁定范围X',
        tooltip: '玩家进入该拉链左右 X 范围后，子弹才会锁定滑块；玩家在中路时不锁定。'
      }), _dec34 = property({
        type: CCFloat,
        displayName: '锁定瞄准缩放',
        tooltip: '子弹锁定后，实际瞄准点落在滑块可受击范围内的比例。1=完整范围，0.92=略窄一点。'
      }), _dec35 = property({
        type: CCFloat,
        displayName: '受击区域Z偏移',
        tooltip: '只调整子弹锁定/碰撞中心，不移动滑块模型。负值通常是往玩家方向提前，正值是往远离玩家方向延后。'
      }), _dec36 = property({
        type: CCBoolean,
        displayName: '使用滑块模型中心',
        tooltip: '开启后用滑块模型的渲染包围盒中心作为受击中心，避免滑块节点锚点偏后导致子弹穿过模型后才命中。'
      }), _dec37 = property({
        type: CCFloat,
        displayName: '滑块厚度对齐偏移',
        tooltip: '滑块定位时，用模型包围盒中心再向厚的一侧偏移一点来对齐齿条位置。0=模型中心，0.2=向厚侧偏移 20% 半厚度。'
      }), _dec(_class = (_class2 = class PropLalianGate extends (_crd && BattleTarget3D === void 0 ? (_reportPossibleCrUseOfBattleTarget3D({
        error: Error()
      }), BattleTarget3D) : BattleTarget3D) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "lalianRoot", _descriptor, this);

          _initializerDefineProperty(this, "cube", _descriptor2, this);

          _initializerDefineProperty(this, "pullRingRoot", _descriptor3, this);

          _initializerDefineProperty(this, "pullRingTail", _descriptor4, this);

          _initializerDefineProperty(this, "teethNodes", _descriptor5, this);

          _initializerDefineProperty(this, "autoCollectTeeth", _descriptor6, this);

          _initializerDefineProperty(this, "sortTeethByZ", _descriptor7, this);

          _initializerDefineProperty(this, "startFromMaxZ", _descriptor8, this);

          _initializerDefineProperty(this, "startFromFarthestSide", _descriptor9, this);

          _initializerDefineProperty(this, "startFromSliderSide", _descriptor10, this);

          _initializerDefineProperty(this, "reverseZOrder", _descriptor11, this);

          _initializerDefineProperty(this, "hpLabel", _descriptor12, this);

          _initializerDefineProperty(this, "nodeCount", _descriptor13, this);

          _initializerDefineProperty(this, "hitPerNode", _descriptor14, this);

          _initializerDefineProperty(this, "teethPerPair", _descriptor15, this);

          _initializerDefineProperty(this, "initialClosedPairCount", _descriptor16, this);

          _initializerDefineProperty(this, "nextPairInitialProgress", _descriptor17, this);

          _initializerDefineProperty(this, "nextNextPairInitialProgress", _descriptor18, this);

          _initializerDefineProperty(this, "nodeSpacingZ", _descriptor19, this);

          _initializerDefineProperty(this, "autoCloseCenterX", _descriptor20, this);

          _initializerDefineProperty(this, "closeCenterX", _descriptor21, this);

          _initializerDefineProperty(this, "closeX", _descriptor22, this);

          _initializerDefineProperty(this, "openOffsetX", _descriptor23, this);

          _initializerDefineProperty(this, "reverseOpenDirection", _descriptor24, this);

          _initializerDefineProperty(this, "propGapZ", _descriptor25, this);

          _initializerDefineProperty(this, "moveCount", _descriptor26, this);

          _initializerDefineProperty(this, "hitAnimTime", _descriptor27, this);

          _initializerDefineProperty(this, "cubeHideTime", _descriptor28, this);

          _initializerDefineProperty(this, "keepSliderZOffset", _descriptor29, this);

          _initializerDefineProperty(this, "sliderOffsetZ", _descriptor30, this);

          _initializerDefineProperty(this, "reverseSliderMoveZ", _descriptor31, this);

          _initializerDefineProperty(this, "bulletLockRangeX", _descriptor32, this);

          _initializerDefineProperty(this, "bulletAimShrink", _descriptor33, this);

          _initializerDefineProperty(this, "hitAreaOffsetZ", _descriptor34, this);

          _initializerDefineProperty(this, "useCubeBoundsHitCenter", _descriptor35, this);

          _initializerDefineProperty(this, "sliderThickCenterBias", _descriptor36, this);

          this.teeth = [];
          this.toothStartPos = [];
          this.toothClosedPos = [];
          this.toothIndex = 0;
          this.pairIndex = 0;
          this.pairCount = 0;
          this.cubeStartScale = new Vec3(1, 1, 1);
          this.cubeStartPos = new Vec3();
          this.hasCubeStartData = false;
          this.pullRingRootStartEuler = new Vec3();
          this.pullRingTailStartEuler = new Vec3();
          this.hasPullRingStartData = false;
          this.pullRingSwingSign = 1;
          this.runtimeSliderOffsetZ = 0;
          this.tempLockAimPos = new Vec3();
          this.tempCollisionWorldPos = new Vec3();
          this.tempSliderTargetPos = new Vec3();
          this.tempWorldPos = new Vec3();
          this.tempSliderVisualCenterWorldPos = new Vec3();
          this.tempSliderVisualCenterParentPos = new Vec3();
          this.cubeMeshRenderers = [];
          this.originalToothPositions = new Map();
          this.closeCenter = 0;
          this.animating = false;
          this.finished = false;
          this.registered = false;
          this.pullRingRootImpactY = 10;
          this.pullRingRootReboundY = -7;
          this.pullRingTailImpactY = 34;
          this.pullRingTailReboundY = -28;
          this.pullRingStageTime = 0.04;
        }

        get hitNode() {
          var _this$cube;

          return (_this$cube = this.cube) != null ? _this$cube : super.hitNode;
        }

        getCollisionWorldPosition(out) {
          var _hitNode$worldPositio;

          if (out === void 0) {
            out = this.tempCollisionWorldPos;
          }

          var hitNode = this.hitNode;
          var center = (_hitNode$worldPositio = hitNode == null ? void 0 : hitNode.worldPosition) != null ? _hitNode$worldPositio : this.node.worldPosition;

          if (this.useCubeBoundsHitCenter && this.setCubeBoundsCenter(out)) {
            out.z += this.hitAreaOffsetZ;
            return out;
          }

          return out.set(center.x, center.y, center.z + this.hitAreaOffsetZ);
        }

        getPropStartZ() {
          var count = this.nodeCount > 0 ? this.nodeCount : this.getAuthoredSegmentCount();

          if (this.teeth.length > 0 || this.teethNodes.length > 0 || this.lalianRoot) {
            var authoredTeeth = this.teeth.length > 0 ? this.teeth : this.collectTeeth();
            var minZ = Number.POSITIVE_INFINITY;
            var maxZ = Number.NEGATIVE_INFINITY;

            for (var i = 0; i < authoredTeeth.length && (this.nodeCount <= 0 || i < this.nodeCount); i++) {
              var tooth = authoredTeeth[i];

              if (!tooth) {
                continue;
              }

              minZ = Math.min(minZ, tooth.position.z);
              maxZ = Math.max(maxZ, tooth.position.z);
            }

            if (minZ < Number.POSITIVE_INFINITY && maxZ > Number.NEGATIVE_INFINITY) {
              return Math.abs(maxZ - minZ) + this.propGapZ;
            }
          }

          return this.propGapZ + Math.max(0, count) * this.nodeSpacingZ;
        }

        Hit(damage) {
          if (this.animating && !this.finished) {
            return this.MaxHp > 0 ? this.curHp / this.MaxHp : 0;
          }

          return super.Hit(damage);
        }

        canLockBulletFromWorldX(worldX) {
          var _ref, _this$lalianRoot;

          if (this.finished || !this.cube || !this.cube.active || !this.cube.activeInHierarchy) {
            return false;
          }

          var centerNode = (_ref = (_this$lalianRoot = this.lalianRoot) != null ? _this$lalianRoot : this.cube) != null ? _ref : this.node;
          return Math.abs(worldX - centerNode.worldPosition.x) <= this.bulletLockRangeX;
        }

        getLockAimWorldPosition(fromPos, out) {
          if (out === void 0) {
            out = this.tempLockAimPos;
          }

          var center = this.getCollisionWorldPosition(out);
          var shrink = Math.max(0.1, Math.min(1, this.bulletAimShrink));
          var halfX = Math.max(0.02, this.collisionHalfX * shrink);
          var halfZ = Math.max(0.02, this.collisionHalfZ * shrink);
          var x = Math.min(center.x + halfX, Math.max(center.x - halfX, fromPos.x));
          var z = Math.min(center.z + halfZ, Math.max(center.z - halfZ, fromPos.z));
          return out.set(x, center.y, z);
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

          if (this.teeth.length <= 0 || !this.cube) {
            return;
          }

          this.prepareCollisionSize();
          var initialPairIndex = Math.max(0, Math.min(this.getInitialClosedPairCount(), this.pairCount) - 1);
          var totalHp = Math.max(1, this.pairCount - initialPairIndex - 1);
          this.MaxHp = totalHp;
          this.curHp = totalHp;
          this.isDestroy = false;
          this.finished = false;
          this.animating = false;
          this.updateHpLabel(totalHp);
          this.registerTarget();
        }

        prepareCollisionSize() {
          if (this.collisionHalfX <= 0.24) {
            this.collisionHalfX = 0.45;
          }

          if (this.collisionHalfZ <= 0) {
            this.collisionHalfZ = 0.32;
          }
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

          var animDuration = this.getHitAnimDuration();
          var closePairIndex = this.pairIndex + 1;
          var closeTooth = this.getSliderPairLeadTooth(closePairIndex);

          if (!closeTooth) {
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
          this.playPullRingSwing();
          this.applyPairProgress(closePairIndex, 1, true, animDuration);
          this.pairIndex = closePairIndex;
          this.toothIndex = this.getPairStartToothIndex(this.pairIndex);
          var previewPairIndex = this.pairIndex + 1;

          if (this.getPairLeadTooth(previewPairIndex)) {
            this.applyPairProgress(previewPairIndex, this.getClampedProgress(this.nextPairInitialProgress), true, animDuration);
          }

          var nextPreviewPairIndex = this.pairIndex + 2;

          if (this.getPairLeadTooth(nextPreviewPairIndex)) {
            this.applyPairProgress(nextPreviewPairIndex, this.getClampedProgress(this.nextNextPairInitialProgress), true, animDuration);
          }

          var remainHits = this.getRemainToothCount();
          this.curHp = Math.max(1, remainHits);
          this.updateHpLabel(remainHits);

          if (this.cube) {
            Tween.stopAllByTarget(this.cube);
            tween(this.cube).to(animDuration, {
              position: this.getSliderTargetPos(closeTooth)
            }, {
              easing: 'sineOut'
            }).call(() => {
              this.finishHitStep();
            }).start();
          } else {
            this.scheduleOnce(() => {
              this.finishHitStep();
            }, animDuration);
          }
        }

        finishHitStep() {
          this.animating = false;

          if (this.pairIndex >= this.pairCount - 1) {
            this.completeGate();
          }
        }

        completeGate() {
          if (this.finished) {
            return;
          }

          this.finished = true;
          this.animating = false;
          this.curHp = 1;
          this.isDestroy = true;
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
          this.teeth.length = 0;
          this.toothStartPos.length = 0;
          this.toothClosedPos.length = 0;
          this.toothIndex = 0;
          this.pairIndex = 0;
          this.pairCount = 0;
          this.pullRingSwingSign = 1;

          if (!this.cube) {
            return;
          }

          Tween.stopAllByTarget(this.cube);
          this.cacheCubeStartData();
          this.cacheCubeMeshRenderers();
          this.preparePullRingHierarchy();
          this.cachePullRingStartData();
          this.resetPullRing();
          this.cube.active = true;
          this.cube.setPosition(this.cubeStartPos);
          this.cube.setScale(this.cubeStartScale);
          var collectedTeeth = this.collectTeeth();
          var desiredCount = this.nodeCount > 0 ? Math.min(this.nodeCount, collectedTeeth.length) : collectedTeeth.length;

          for (var i = 0; i < collectedTeeth.length; i++) {
            var tooth = collectedTeeth[i];

            if (!tooth) {
              continue;
            }

            tooth.active = i < desiredCount;

            if (i >= desiredCount) {
              continue;
            }

            var originalPos = this.getOriginalToothPosition(tooth);
            Tween.stopAllByTarget(tooth);
            tooth.setPosition(originalPos);
            this.teeth.push(tooth);
            this.toothClosedPos.push(originalPos.clone());
          }

          this.pairCount = this.getPairCount();
          this.closeCenter = this.getCloseCenterX();
          this.applyOpenProgress();
          this.prepareSliderOffset();
          this.applyInitialProgress();
        }

        collectTeeth() {
          var result = [];

          if (this.teethNodes.length > 0) {
            for (var i = 0; i < this.teethNodes.length; i++) {
              var tooth = this.teethNodes[i];

              if (tooth && tooth !== this.cube) {
                result.push(tooth);
              }
            }
          } else if (this.autoCollectTeeth && this.lalianRoot) {
            for (var _i = 0; _i < this.lalianRoot.children.length; _i++) {
              var child = this.lalianRoot.children[_i];

              if (!child || child === this.cube) {
                continue;
              }

              if (child.name.indexOf('SM_lalian') === 0 && child.name.indexOf('SM_laliantou') !== 0) {
                result.push(child);
              }
            }
          }

          if (this.sortTeethByZ) {
            result.sort((a, b) => a.position.z - b.position.z);
          }

          if (this.startFromMaxZ) {
            result.reverse();
          } else if (this.startFromFarthestSide) {
            this.orderTeethFromFarthestSide(result);
          } else if (this.startFromSliderSide) {
            this.orderTeethFromSliderSide(result);

            if (this.reverseZOrder) {
              result.reverse();
            }
          } else if (this.reverseZOrder) {
            result.reverse();
          }

          return result;
        }

        orderTeethFromFarthestSide(teeth) {
          if (!this.cube || teeth.length <= 1) {
            return;
          }

          var firstZ = this.getToothZInSliderParent(teeth[0]);
          var lastZ = this.getToothZInSliderParent(teeth[teeth.length - 1]);
          var sliderZ = this.cube.position.z;

          if (Math.abs(sliderZ - lastZ) > Math.abs(sliderZ - firstZ)) {
            teeth.reverse();
          }
        }

        orderTeethFromSliderSide(teeth) {
          if (!this.cube || teeth.length <= 1) {
            return;
          }

          var firstZ = this.getToothZInSliderParent(teeth[0]);
          var lastZ = this.getToothZInSliderParent(teeth[teeth.length - 1]);
          var sliderZ = this.cube.position.z;

          if (Math.abs(sliderZ - lastZ) < Math.abs(sliderZ - firstZ)) {
            teeth.reverse();
          }
        }

        getToothZInSliderParent(tooth) {
          if (!this.cube || tooth.parent === this.cube.parent) {
            return tooth.position.z;
          }

          this.tempWorldPos.set(tooth.worldPosition);

          if (this.cube.parent) {
            this.cube.parent.inverseTransformPoint(this.tempSliderTargetPos, this.tempWorldPos);
            return this.tempSliderTargetPos.z;
          }

          return tooth.position.z;
        }

        getAuthoredSegmentCount() {
          return this.collectTeeth().length;
        }

        applyInitialProgress() {
          var _this$getSliderPairLe;

          var closedPairCount = Math.min(this.getInitialClosedPairCount(), this.pairCount);

          for (var i = 0; i < closedPairCount; i++) {
            this.applyPairProgress(i, 1, false);
          }

          var halfPairIndex = closedPairCount;

          if (this.getPairLeadTooth(halfPairIndex)) {
            this.applyPairProgress(halfPairIndex, this.getClampedProgress(this.nextPairInitialProgress), false);
          }

          var quarterPairIndex = closedPairCount + 1;

          if (this.getPairLeadTooth(quarterPairIndex)) {
            this.applyPairProgress(quarterPairIndex, this.getClampedProgress(this.nextNextPairInitialProgress), false);
          }

          this.pairIndex = Math.max(0, closedPairCount - 1);
          this.toothIndex = this.getPairStartToothIndex(this.pairIndex);
          var sliderTooth = (_this$getSliderPairLe = this.getSliderPairLeadTooth(this.pairIndex)) != null ? _this$getSliderPairLe : this.teeth[0];

          if (this.cube && sliderTooth) {
            this.cube.setPosition(this.getSliderTargetPos(sliderTooth));
          }
        }

        cacheCubeStartData() {
          if (this.hasCubeStartData) {
            return;
          }

          this.cubeStartPos.set(this.cube.position);
          this.cubeStartScale.set(this.cube.scale);
          this.hasCubeStartData = true;
        }

        cacheCubeMeshRenderers() {
          this.cubeMeshRenderers.length = 0;

          if (!this.cube) {
            return;
          }

          this.collectMeshRenderers(this.cube, this.cubeMeshRenderers);
        }

        collectMeshRenderers(node, out) {
          var meshRenderer = node.getComponent(MeshRenderer);

          if (meshRenderer) {
            out.push(meshRenderer);
          }

          for (var i = 0; i < node.children.length; i++) {
            this.collectMeshRenderers(node.children[i], out);
          }
        }

        setCubeBoundsCenter(out) {
          return this.setCubeVisualCenter(out, false);
        }

        setCubeVisualCenter(out, useThickBias) {
          if (useThickBias === void 0) {
            useThickBias = true;
          }

          var minX = Number.POSITIVE_INFINITY;
          var maxX = Number.NEGATIVE_INFINITY;
          var minY = Number.POSITIVE_INFINITY;
          var maxY = Number.NEGATIVE_INFINITY;
          var minZ = Number.POSITIVE_INFINITY;
          var maxZ = Number.NEGATIVE_INFINITY;
          var found = false;

          for (var i = 0; i < this.cubeMeshRenderers.length; i++) {
            var _this$cubeMeshRendere;

            var worldBounds = (_this$cubeMeshRendere = this.cubeMeshRenderers[i]) == null || (_this$cubeMeshRendere = _this$cubeMeshRendere.model) == null ? void 0 : _this$cubeMeshRendere.worldBounds;
            var center = worldBounds == null ? void 0 : worldBounds.center;
            var halfExtents = worldBounds == null ? void 0 : worldBounds.halfExtents;

            if (!center || !halfExtents) {
              continue;
            }

            minX = Math.min(minX, center.x - halfExtents.x);
            maxX = Math.max(maxX, center.x + halfExtents.x);
            minY = Math.min(minY, center.y - halfExtents.y);
            maxY = Math.max(maxY, center.y + halfExtents.y);
            minZ = Math.min(minZ, center.z - halfExtents.z);
            maxZ = Math.max(maxZ, center.z + halfExtents.z);
            found = true;
          }

          if (!found) {
            return false;
          }

          var halfZ = (maxZ - minZ) * 0.5;
          var centerZ = (minZ + maxZ) * 0.5;

          if (useThickBias && this.cube) {
            var anchorZ = this.cube.worldPosition.z;
            var biasDirection = centerZ >= anchorZ ? 1 : -1;
            var bias = Math.max(-1, Math.min(1, this.sliderThickCenterBias));
            centerZ += halfZ * bias * biasDirection;
          }

          out.set((minX + maxX) * 0.5, (minY + maxY) * 0.5, centerZ);
          return true;
        }

        preparePullRingHierarchy() {
          if (!this.pullRingRoot) {
            return;
          }

          if (this.cube && !this.isNodeUnderParent(this.pullRingRoot, this.cube) && !this.isNodeUnderParent(this.cube, this.pullRingRoot)) {
            this.pullRingRoot.setParent(this.cube, true);
          }

          if (this.pullRingTail && !this.isNodeUnderParent(this.pullRingTail, this.pullRingRoot)) {
            this.pullRingTail.setParent(this.pullRingRoot, true);
          }
        }

        isNodeUnderParent(node, parent) {
          var cur = node.parent;

          while (cur) {
            if (cur === parent) {
              return true;
            }

            cur = cur.parent;
          }

          return false;
        }

        cachePullRingStartData() {
          if (this.hasPullRingStartData) {
            return;
          }

          if (this.pullRingRoot) {
            this.pullRingRootStartEuler.set(this.pullRingRoot.eulerAngles);
          }

          if (this.pullRingTail) {
            this.pullRingTailStartEuler.set(this.pullRingTail.eulerAngles);
          }

          this.hasPullRingStartData = true;
        }

        resetPullRing() {
          if (this.pullRingRoot) {
            Tween.stopAllByTarget(this.pullRingRoot);
            this.pullRingRoot.eulerAngles = this.getPullRingRootEuler(0);
          }

          if (this.pullRingTail) {
            Tween.stopAllByTarget(this.pullRingTail);
            this.pullRingTail.eulerAngles = this.getPullRingTailEuler(0);
          }
        }

        playPullRingSwing() {
          this.cachePullRingStartData();

          if (!this.pullRingRoot) {
            return;
          }

          var sign = this.pullRingSwingSign;
          this.pullRingSwingSign *= -1;
          Tween.stopAllByTarget(this.pullRingRoot);
          tween(this.pullRingRoot).to(this.pullRingStageTime, {
            eulerAngles: this.getPullRingRootEuler(this.pullRingRootImpactY * sign)
          }, {
            easing: 'sineOut'
          }).to(this.pullRingStageTime, {
            eulerAngles: this.getPullRingRootEuler(this.pullRingRootReboundY * sign)
          }, {
            easing: 'sineInOut'
          }).to(this.pullRingStageTime, {
            eulerAngles: this.getPullRingRootEuler(0)
          }, {
            easing: 'sineOut'
          }).start();
          this.playPullRingTailJoint(sign);
        }

        playPullRingTailJoint(sign) {
          if (!this.pullRingRoot || !this.pullRingTail || !this.isNodeUnderParent(this.pullRingTail, this.pullRingRoot)) {
            return;
          }

          Tween.stopAllByTarget(this.pullRingTail);
          tween(this.pullRingTail).to(this.pullRingStageTime, {
            eulerAngles: this.getPullRingTailEuler(this.pullRingTailImpactY * sign)
          }, {
            easing: 'sineOut'
          }).to(this.pullRingStageTime, {
            eulerAngles: this.getPullRingTailEuler(this.pullRingTailReboundY * sign)
          }, {
            easing: 'sineInOut'
          }).to(this.pullRingStageTime, {
            eulerAngles: this.getPullRingTailEuler(0)
          }, {
            easing: 'sineOut'
          }).start();
        }

        getPullRingRootEuler(offsetY) {
          return v3(this.pullRingRootStartEuler.x, this.pullRingRootStartEuler.y + offsetY, this.pullRingRootStartEuler.z);
        }

        getPullRingTailEuler(offsetY) {
          return v3(this.pullRingTailStartEuler.x, this.pullRingTailStartEuler.y + offsetY, this.pullRingTailStartEuler.z);
        }

        prepareSliderOffset() {
          var _this$getSliderPairLe2;

          this.runtimeSliderOffsetZ = this.sliderOffsetZ;

          if (this.startFromMaxZ) {
            return;
          }

          var offsetBaseTooth = (_this$getSliderPairLe2 = this.getSliderPairLeadTooth(Math.max(0, Math.min(this.getInitialClosedPairCount(), this.pairCount) - 1))) != null ? _this$getSliderPairLe2 : this.teeth[0];

          if (!this.keepSliderZOffset || !this.cube || !offsetBaseTooth) {
            return;
          }

          var firstTarget = this.getSliderTargetPos(offsetBaseTooth, false);
          this.runtimeSliderOffsetZ = this.cubeStartPos.z - firstTarget.z;
        }

        applyOpenProgress() {
          this.toothStartPos.length = 0;

          for (var i = 0; i < this.teeth.length; i++) {
            var tooth = this.teeth[i];
            var closedPos = this.toothClosedPos[i];

            if (!tooth || !closedPos) {
              continue;
            }

            var openedPos = this.getOpenedToothPosition(closedPos);
            tooth.setPosition(openedPos);
            this.toothStartPos.push(openedPos);
          }
        }

        getOriginalToothPosition(tooth) {
          var originalPos = this.originalToothPositions.get(tooth);

          if (!originalPos) {
            originalPos = tooth.position.clone();
            this.originalToothPositions.set(tooth, originalPos);
          }

          return originalPos;
        }

        applyToothProgress(toothIndex, progress, useTween, duration) {
          if (duration === void 0) {
            duration = this.getHitAnimDuration();
          }

          var tooth = this.teeth[toothIndex];
          var startPos = this.toothStartPos[toothIndex];
          var closedPos = this.toothClosedPos[toothIndex];

          if (!tooth || !startPos || !closedPos) {
            return;
          }

          var targetPos = v3(startPos.x + (closedPos.x - startPos.x) * progress, startPos.y + (closedPos.y - startPos.y) * progress, startPos.z + (closedPos.z - startPos.z) * progress);
          Tween.stopAllByTarget(tooth);

          if (useTween) {
            tween(tooth).to(duration, {
              position: targetPos
            }, {
              easing: 'sineOut'
            }).start();
          } else {
            tooth.setPosition(targetPos);
          }
        }

        applyPairProgress(pairIndex, progress, useTween, duration) {
          if (duration === void 0) {
            duration = this.getHitAnimDuration();
          }

          var startIndex = this.getPairStartToothIndex(pairIndex);
          var perPair = this.getTeethPerPair();

          for (var i = 0; i < perPair; i++) {
            var toothIndex = startIndex + i;

            if (!this.teeth[toothIndex]) {
              continue;
            }

            this.applyToothProgress(toothIndex, progress, useTween, duration);
          }
        }

        getPairLeadTooth(pairIndex) {
          var _this$teeth$this$getP;

          return (_this$teeth$this$getP = this.teeth[this.getPairStartToothIndex(pairIndex)]) != null ? _this$teeth$this$getP : null;
        }

        getSliderPairLeadTooth(pairIndex) {
          var targetPairIndex = !this.startFromMaxZ && this.reverseSliderMoveZ ? this.pairCount - 1 - pairIndex : pairIndex;
          return this.getPairLeadTooth(Math.max(0, targetPairIndex));
        }

        getPairStartToothIndex(pairIndex) {
          return Math.max(0, pairIndex) * this.getTeethPerPair();
        }

        getPairCount() {
          return Math.ceil(this.teeth.length / this.getTeethPerPair());
        }

        getTeethPerPair() {
          return Math.max(1, Math.floor(this.teethPerPair));
        }

        getInitialClosedPairCount() {
          return Math.max(0, Math.floor(this.initialClosedPairCount));
        }

        getClampedProgress(progress) {
          return Math.max(0, Math.min(1, progress));
        }

        getOpenedToothPosition(closedPos) {
          var delta = closedPos.x - this.closeCenter;
          var sign = delta >= 0 ? 1 : -1;

          if (!this.startFromMaxZ && this.reverseOpenDirection) {
            sign *= -1;
          }

          return v3(closedPos.x + sign * Math.max(0, this.openOffsetX), closedPos.y, closedPos.z);
        }

        getCloseCenterX() {
          if (!this.autoCloseCenterX || this.teeth.length <= 0) {
            return this.closeCenterX;
          }

          var minX = Number.POSITIVE_INFINITY;
          var maxX = Number.NEGATIVE_INFINITY;

          for (var i = 0; i < this.toothClosedPos.length; i++) {
            var pos = this.toothClosedPos[i];

            if (!pos) {
              continue;
            }

            minX = Math.min(minX, pos.x);
            maxX = Math.max(maxX, pos.x);
          }

          if (minX === Number.POSITIVE_INFINITY || maxX === Number.NEGATIVE_INFINITY) {
            return this.closeCenterX;
          }

          return (minX + maxX) * 0.5;
        }

        getSliderTargetPos(tooth, useRuntimeOffset) {
          if (useRuntimeOffset === void 0) {
            useRuntimeOffset = true;
          }

          var cubePos = this.hasCubeStartData ? this.cubeStartPos : this.cube.position;
          var offsetZ = useRuntimeOffset ? this.runtimeSliderOffsetZ : 0;
          var anchorOffsetZ = this.getSliderVisualAnchorOffsetZ();

          if (tooth.parent === this.cube.parent) {
            return this.tempSliderTargetPos.set(cubePos.x, cubePos.y, tooth.position.z + offsetZ - anchorOffsetZ);
          }

          this.tempWorldPos.set(tooth.worldPosition);

          if (this.cube.parent) {
            this.cube.parent.inverseTransformPoint(this.tempSliderTargetPos, this.tempWorldPos);
            this.tempSliderTargetPos.x = cubePos.x;
            this.tempSliderTargetPos.y = cubePos.y;
            this.tempSliderTargetPos.z += offsetZ - anchorOffsetZ;
            return this.tempSliderTargetPos;
          }

          return this.tempSliderTargetPos.set(cubePos.x, cubePos.y, tooth.position.z + offsetZ - anchorOffsetZ);
        }

        getSliderVisualAnchorOffsetZ() {
          if (!this.cube || this.cubeMeshRenderers.length <= 0) {
            return 0;
          }

          if (!this.setCubeVisualCenter(this.tempSliderVisualCenterWorldPos)) {
            return 0;
          }

          if (this.cube.parent) {
            this.cube.parent.inverseTransformPoint(this.tempSliderVisualCenterParentPos, this.tempSliderVisualCenterWorldPos);
            return this.tempSliderVisualCenterParentPos.z - this.cube.position.z;
          }

          return this.tempSliderVisualCenterWorldPos.z - this.cube.worldPosition.z;
        }

        getHitAnimDuration() {
          return Math.max(0.08, this.hitAnimTime);
        }

        getRemainToothCount() {
          return Math.max(0, this.pairCount - this.pairIndex - 1);
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
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "pullRingRoot", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "pullRingTail", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "teethNodes", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "autoCollectTeeth", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "sortTeethByZ", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "startFromMaxZ", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "startFromFarthestSide", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "startFromSliderSide", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "reverseZOrder", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "hpLabel", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "nodeCount", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "hitPerNode", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "teethPerPair", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "initialClosedPairCount", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "nextPairInitialProgress", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.5;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "nextNextPairInitialProgress", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.25;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "nodeSpacingZ", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.8;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "autoCloseCenterX", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "closeCenterX", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "closeX", [_dec23], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.1;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "openOffsetX", [_dec24], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.45;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "reverseOpenDirection", [_dec25], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, "propGapZ", [_dec26], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.2;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class2.prototype, "moveCount", [_dec27], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class2.prototype, "hitAnimTime", [_dec28], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.12;
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class2.prototype, "cubeHideTime", [_dec29], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.08;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class2.prototype, "keepSliderZOffset", [_dec30], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor30 = _applyDecoratedDescriptor(_class2.prototype, "sliderOffsetZ", [_dec31], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor31 = _applyDecoratedDescriptor(_class2.prototype, "reverseSliderMoveZ", [_dec32], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor32 = _applyDecoratedDescriptor(_class2.prototype, "bulletLockRangeX", [_dec33], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2.5;
        }
      }), _descriptor33 = _applyDecoratedDescriptor(_class2.prototype, "bulletAimShrink", [_dec34], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.92;
        }
      }), _descriptor34 = _applyDecoratedDescriptor(_class2.prototype, "hitAreaOffsetZ", [_dec35], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -0.18;
        }
      }), _descriptor35 = _applyDecoratedDescriptor(_class2.prototype, "useCubeBoundsHitCenter", [_dec36], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor36 = _applyDecoratedDescriptor(_class2.prototype, "sliderThickCenterBias", [_dec37], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.2;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=c14c87720f6e6e7b27f438925fae2cc2d4587268.js.map