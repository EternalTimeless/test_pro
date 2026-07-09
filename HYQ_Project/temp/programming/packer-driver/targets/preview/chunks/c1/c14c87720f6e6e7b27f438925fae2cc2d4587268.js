System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCBoolean, CCFloat, CCInteger, Label, MeshRenderer, Node, Tween, tween, v3, Vec3, BattleTarget3D, BulletMonsterCollisionManager, ColliderTag, COLLIDE_TYPE, EventType, SoundEnum, EventManager, AudioManager, TweenTool, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _dec38, _dec39, _dec40, _dec41, _dec42, _dec43, _dec44, _dec45, _dec46, _dec47, _dec48, _dec49, _dec50, _dec51, _dec52, _dec53, _dec54, _dec55, _dec56, _dec57, _dec58, _dec59, _dec60, _dec61, _dec62, _dec63, _dec64, _dec65, _dec66, _dec67, _dec68, _dec69, _dec70, _dec71, _dec72, _class4, _class5, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _descriptor34, _descriptor35, _descriptor36, _descriptor37, _descriptor38, _descriptor39, _descriptor40, _descriptor41, _descriptor42, _descriptor43, _descriptor44, _descriptor45, _descriptor46, _descriptor47, _descriptor48, _descriptor49, _descriptor50, _descriptor51, _descriptor52, _descriptor53, _descriptor54, _descriptor55, _descriptor56, _descriptor57, _descriptor58, _descriptor59, _descriptor60, _descriptor61, _descriptor62, _descriptor63, _descriptor64, _descriptor65, _descriptor66, _descriptor67, _descriptor68, _descriptor69, _descriptor70, _crd, ccclass, property, LalianHitStageConfig, PropLalianGate;

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
      LalianHitStageConfig = (_dec = ccclass('LalianHitStageConfig'), _dec2 = property({
        type: CCFloat,
        displayName: '阶段结束进度',
        tooltip: '0~1。表示这一段覆盖到拉链剩余推进进度的哪个位置，例如 0.33 / 0.66 / 1。'
      }), _dec3 = property({
        type: CCInteger,
        displayName: '每格受击次数',
        tooltip: '落在该阶段内的每一格推进，默认需要多少次受击。'
      }), _dec(_class = (_class2 = class LalianHitStageConfig {
        constructor() {
          _initializerDefineProperty(this, "endProgress", _descriptor, this);

          _initializerDefineProperty(this, "hitCountPerStep", _descriptor2, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "endProgress", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "hitCountPerStep", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      })), _class2)) || _class);

      _export("PropLalianGate", PropLalianGate = (_dec4 = ccclass('PropLalianGate'), _dec5 = property({
        type: Node,
        displayName: '拉链根节点',
        tooltip: '拖入 lalian_01/lalian_02 的根节点。为空时只使用下面手动拖入的齿条列表。'
      }), _dec6 = property({
        type: Node,
        displayName: '滑块受击节点',
        tooltip: '拖入 SM_laliantou_02 / SM_laliantou_03。子弹锁定和命中都以它为中心，推进时它会沿 Z 轴移动。'
      }), _dec7 = property({
        type: Node,
        displayName: '拉环根节点',
        tooltip: '挂在滑块上的拉环节点。滑块受击时，这个节点会做小幅摆动。'
      }), _dec8 = property({
        type: Node,
        displayName: '拉环尾巴节点',
        tooltip: '拉环尾巴节点。滑块受击时，这个节点会做更明显的摆动。'
      }), _dec9 = property({
        type: CCInteger,
        displayName: '拉环循环段数',
        tooltip: '拉环摆动一圈拆成多少段，默认 8 段。'
      }), _dec10 = property({
        type: CCInteger,
        displayName: '每次受击拉环步数',
        tooltip: '每次命中推进多少段拉环动作，默认 2 段。'
      }), _dec11 = property({
        type: CCFloat,
        displayName: '拉环单步时长(秒)',
        tooltip: '每一段拉环动作的持续时间，数值越大动作越慢。'
      }), _dec12 = property({
        type: CCFloat,
        displayName: '拉环根左右摆幅',
        tooltip: '拉环根节点沿 Y 轴左右摆动角度。'
      }), _dec13 = property({
        type: CCFloat,
        displayName: '拉环根椭圆仰角',
        tooltip: '拉环根节点沿 X 轴形成压扁椭圆弧的仰角。'
      }), _dec14 = property({
        type: CCFloat,
        displayName: '拉环根世界上抬高度',
        tooltip: '拉环根节点整体沿世界 Y 轴上抬，避免父级轴向导致变成 Z 纵深偏移。'
      }), _dec15 = property({
        type: CCFloat,
        displayName: '拉环尾左右摆幅',
        tooltip: '拉环尾节点沿 Y 轴左右摆动角度，尾部更大时会像喇叭口。'
      }), _dec16 = property({
        type: CCFloat,
        displayName: '拉环尾椭圆仰角',
        tooltip: '拉环尾节点沿 X 轴形成压扁椭圆弧的仰角。'
      }), _dec17 = property({
        type: CCFloat,
        displayName: '拉环尾下压角度比例',
        tooltip: '只缩放尾部 X 轴下压角度，不影响左右摆幅；数值越小越不容易穿模。'
      }), _dec18 = property({
        type: CCBoolean,
        displayName: '使用弹簧拉环反馈',
        tooltip: '开启后，滑块受击时拉环使用伪物理弹簧冲量反馈；关闭则回到原来的固定 tween 摆动。'
      }), _dec19 = property({
        type: CCFloat,
        displayName: '拉环根左右冲量',
        tooltip: '受击瞬间给拉环根节点 Y 轴的速度冲量，数值越大左右甩动越明显。'
      }), _dec20 = property({
        type: CCFloat,
        displayName: '拉环根抬起冲量',
        tooltip: '受击瞬间给拉环根节点 X 轴的速度冲量，数值越大跳起感越明显。'
      }), _dec21 = property({
        type: CCFloat,
        displayName: '拉环尾巴左右冲量',
        tooltip: '受击瞬间给拉环尾巴节点 Y 轴的速度冲量，主要控制尾巴甩动幅度。'
      }), _dec22 = property({
        type: CCFloat,
        displayName: '拉环尾巴抬起冲量',
        tooltip: '受击瞬间给拉环尾巴节点 X 轴的速度冲量，主要控制尾巴上下跳动。'
      }), _dec23 = property({
        type: CCFloat,
        displayName: '拉环弹簧强度',
        tooltip: '拉环回到初始角度的力度，数值越大回正越快。'
      }), _dec24 = property({
        type: CCFloat,
        displayName: '拉环弹簧阻尼',
        tooltip: '拉环摆动衰减速度，数值越大越快停住。'
      }), _dec25 = property({
        type: CCFloat,
        displayName: '拉环根最大摆角',
        tooltip: '拉环根节点最终会同时受这个值和旧的根左右/抬起参数限制，防止加强反馈后穿模。'
      }), _dec26 = property({
        type: CCFloat,
        displayName: '拉环尾巴最大摆角',
        tooltip: '拉环尾巴最终会同时受这个值和旧的尾巴左右/抬起参数限制，防止加强反馈后穿模。'
      }), _dec27 = property({
        type: CCFloat,
        displayName: '拉环尾巴回弹倍率',
        tooltip: '尾巴相对根节点的回弹速度倍率。低于 1 会更拖尾，高于 1 会更紧。'
      }), _dec28 = property({
        type: CCFloat,
        displayName: '左右摆动增强倍率',
        tooltip: '只增强拉环根和尾巴的 Y 轴左右甩动，不影响上下抬起角度；建议 1~1.6。'
      }), _dec29 = property({
        type: CCFloat,
        displayName: '左右摆动上扬补偿',
        tooltip: '左右摆动越大，X 轴越往上补一点，减少侧摆时下压的观感；当前模型建议 2~5。'
      }), _dec30 = property({
        type: CCFloat,
        displayName: '根部上扬最大角',
        tooltip: '限制左右摆动补偿给根部带来的最大上扬角，避免根部翻得太过。'
      }), _dec31 = property({
        type: CCFloat,
        displayName: '尾巴上扬最大角',
        tooltip: '限制左右摆动补偿给尾巴带来的最大上扬角。尾巴贴地时优先调大这个值。'
      }), _dec32 = property({
        type: CCBoolean,
        displayName: '反向上扬补偿',
        tooltip: '开启后使用负 X 作为上扬方向。若现场发现越调越下压，就关闭这个开关。'
      }), _dec33 = property({
        type: [Node],
        displayName: '拉链齿条列表',
        tooltip: '拖入需要参与推进的 SM_lalian-xxx 节点。列表为空且开启自动收集时，会从拉链根节点下自动收集 SM_lalian-xxx。'
      }), _dec34 = property({
        type: CCBoolean,
        displayName: '自动收集齿条',
        tooltip: '齿条列表为空时，从拉链根节点的直接子节点中自动收集名字以 SM_lalian 开头的节点；不会生成新节点。'
      }), _dec35 = property({
        type: CCBoolean,
        displayName: '按Z轴排序齿条',
        tooltip: '开启后按齿条本地 Z 轴排序，适合 lalian_01/lalian_02 这种已有齿条资源。关闭则完全使用上方列表顺序。'
      }), _dec36 = property({
        type: CCBoolean,
        displayName: '从Z最大端开始',
        tooltip: '开启后整条拉链以齿条 Z 最大端作为初始点，滑块和齿条都从这一端开始推进。'
      }), _dec37 = property({
        type: CCBoolean,
        displayName: '从最远端开始(旧)',
        tooltip: '旧排序方式。只有关闭“从Z最大端开始”时才会生效。'
      }), _dec38 = property({
        type: CCBoolean,
        displayName: '从滑块端开始(旧)',
        tooltip: '旧排序方式。只有关闭“从最远端开始”时才会生效。'
      }), _dec39 = property({
        type: CCBoolean,
        displayName: 'Z轴倒序推进',
        tooltip: '在当前排序结果上再反向一次。若“从Z最大端开始”后现场仍然相反，就勾选这个。'
      }), _dec40 = property({
        type: Label,
        displayName: '血量文本',
        tooltip: '可选。显示剩余需要受击推进的齿条数量。'
      }), _dec41 = property({
        type: CCInteger,
        displayName: '使用齿条数量(0=全部)',
        tooltip: '运行时实际使用多少个齿条。填 0 表示使用齿条列表/自动收集到的全部齿条；不会自动生成缺少的齿条。'
      }), _dec42 = property({
        type: CCInteger,
        visible: false
      }), _dec43 = property({
        type: CCInteger,
        visible: false
      }), _dec44 = property({
        type: CCInteger,
        visible: false
      }), _dec45 = property({
        type: [LalianHitStageConfig],
        visible: false
      }), _dec46 = property({
        type: CCInteger,
        displayName: '整体顺滑总受击次数',
        tooltip: '整条拉链从初始状态推进到完成需要的总受击次数。1000 表示每次受击只推进很小一段。'
      }), _dec47 = property({
        type: CCFloat,
        displayName: '整体推进前快后慢强度',
        tooltip: '1 表示匀速；大于 1 时前期每次推进更长，后期每次推进更短。建议 1.5~3。'
      }), _dec48 = property({
        type: CCInteger,
        displayName: '每对齿条数量',
        tooltip: '默认 2，表示每 2 个 SM_lalian 齿条算作一对，一次受击推进一对。'
      }), _dec49 = property({
        type: CCInteger,
        displayName: '初始闭合对数',
        tooltip: '默认前 2 对齿条完全闭合。'
      }), _dec50 = property({
        type: CCFloat,
        displayName: '下一对初始闭合度',
        tooltip: '初始闭合对数之后的下一对闭合度。默认 0.5 表示半闭合。'
      }), _dec51 = property({
        type: CCFloat,
        displayName: '再下一对初始闭合度',
        tooltip: '下一对之后的再下一对闭合度。默认 0.25 表示 1/4 闭合。'
      }), _dec52 = property({
        type: CCFloat,
        displayName: '齿条Z间距(兜底)',
        tooltip: '无法从齿条节点计算长度时，用这个值估算 +1/+99 的起始距离。'
      }), _dec53 = property({
        type: CCBoolean,
        displayName: '自动计算收拢中心X',
        tooltip: '开启后用本次使用齿条的最小/最大 X 计算中线；适合 lalian_01/lalian_02。关闭后使用“手动收拢中心X”。'
      }), _dec54 = property({
        type: CCFloat,
        displayName: '手动收拢中心X',
        tooltip: '关闭自动计算时生效。齿条会向这个本地 X 位置靠拢。'
      }), _dec55 = property({
        type: CCFloat,
        displayName: '最终保留半宽X(旧参数)',
        tooltip: '旧临时拉链参数。当前 lalian_01/lalian_02 默认闭合资源会直接收回到资源默认位置，不再读取这个值。'
      }), _dec56 = property({
        type: CCFloat,
        displayName: '开链外扩X',
        tooltip: '资源默认是闭合状态时，初始化会让齿条沿 X 轴向两侧外扩这个距离，形成打开状态。'
      }), _dec57 = property({
        type: CCBoolean,
        displayName: '反向开链方向',
        tooltip: '开链初始化方向反了就切这个。开启后，齿条沿 X 轴外扩的方向会整体反过来。'
      }), _dec58 = property({
        type: CCFloat,
        displayName: '道具队列间隔Z',
        tooltip: '+1/+99 队列与拉链末端之间额外保留的 Z 轴距离。'
      }), _dec59 = property({
        type: CCInteger,
        displayName: '完成后放出数量',
        tooltip: '拉链全部完成后，向玩家移动的 +1/+99 道具数量。填 0 表示持续放出，不主动停。'
      }), _dec60 = property({
        type: CCFloat,
        displayName: '受击动画时长',
        tooltip: '每次受击后，齿条收拢和滑块移动的动画时间。'
      }), _dec61 = property({
        type: CCFloat,
        displayName: '滑块消失时长',
        tooltip: '所有齿条完成后，滑块缩小消失动画的持续时间。'
      }), _dec62 = property({
        type: CCBoolean,
        displayName: '保留滑块Z偏移',
        tooltip: '开启后，初始化时会保留资源里滑块相对起始齿条的 Z 轴偏移。当前默认关闭，滑块直接放到齿条前沿。'
      }), _dec63 = property({
        type: CCFloat,
        displayName: '手动滑块Z偏移',
        tooltip: '关闭“保留滑块Z偏移”时生效。滑块移动目标会在齿条 Z 位置基础上额外加这个偏移。'
      }), _dec64 = property({
        type: CCBoolean,
        displayName: '反向滑块移动Z',
        tooltip: '只反转滑块沿 Z 轴的移动方向，不影响齿条从哪一端闭合。当前默认关闭，滑块跟随 Z 最大端顺序。'
      }), _dec65 = property({
        type: CCFloat,
        displayName: '子弹锁定范围X',
        tooltip: '玩家进入该拉链左右 X 范围后，子弹才会锁定滑块；玩家在中路时不锁定。'
      }), _dec66 = property({
        type: CCFloat,
        displayName: '锁定瞄准缩放',
        tooltip: '子弹锁定后，实际瞄准点落在滑块可受击范围内的比例。1=完整范围，0.92=略窄一点。'
      }), _dec67 = property({
        type: CCFloat,
        displayName: '锁定前沿深度比例',
        tooltip: '锁定滑块后，只在朝玩家这一侧前沿带内分布瞄准点。0.25=只用前25%深度，0.5=前半段。'
      }), _dec68 = property({
        type: CCFloat,
        displayName: '受击区域Z偏移',
        tooltip: '只调整子弹锁定/碰撞中心，不移动滑块模型。负值通常是往玩家方向提前，正值是往远离玩家方向延后。'
      }), _dec69 = property({
        type: CCBoolean,
        displayName: '使用滑块模型中心',
        tooltip: '开启后用滑块模型的渲染包围盒中心作为受击中心，避免滑块节点锚点偏后导致子弹穿过模型后才命中。'
      }), _dec70 = property({
        type: CCFloat,
        displayName: '滑块命中补偿X',
        tooltip: '在滑块模型包围盒半宽基础上额外补一点 X，减少子弹贴边穿过。'
      }), _dec71 = property({
        type: CCFloat,
        displayName: '滑块命中补偿Z',
        tooltip: '在滑块模型包围盒半深基础上额外补一点 Z，减少子弹沿前后方向漏判。'
      }), _dec72 = property({
        type: CCFloat,
        displayName: '滑块厚度对齐偏移',
        tooltip: '滑块定位时，用模型包围盒中心再向厚的一侧偏移一点来对齐齿条位置。0=模型中心，0.2=向厚侧偏移 20% 半厚度。'
      }), _dec4(_class4 = (_class5 = class PropLalianGate extends (_crd && BattleTarget3D === void 0 ? (_reportPossibleCrUseOfBattleTarget3D({
        error: Error()
      }), BattleTarget3D) : BattleTarget3D) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "lalianRoot", _descriptor3, this);

          _initializerDefineProperty(this, "cube", _descriptor4, this);

          _initializerDefineProperty(this, "pullRingRoot", _descriptor5, this);

          _initializerDefineProperty(this, "pullRingTail", _descriptor6, this);

          _initializerDefineProperty(this, "pullRingLoopStepCount", _descriptor7, this);

          _initializerDefineProperty(this, "pullRingStepPerHit", _descriptor8, this);

          _initializerDefineProperty(this, "pullRingStepTime", _descriptor9, this);

          _initializerDefineProperty(this, "pullRingRootSwingY", _descriptor10, this);

          _initializerDefineProperty(this, "pullRingRootLiftX", _descriptor11, this);

          _initializerDefineProperty(this, "pullRingRootLiftY", _descriptor12, this);

          _initializerDefineProperty(this, "pullRingTailSwingY", _descriptor13, this);

          _initializerDefineProperty(this, "pullRingTailLiftX", _descriptor14, this);

          _initializerDefineProperty(this, "pullRingTailDownAngleScale", _descriptor15, this);

          _initializerDefineProperty(this, "usePullRingSpringFeedback", _descriptor16, this);

          _initializerDefineProperty(this, "pullRingSpringRootImpulseY", _descriptor17, this);

          _initializerDefineProperty(this, "pullRingSpringRootImpulseX", _descriptor18, this);

          _initializerDefineProperty(this, "pullRingSpringTailImpulseY", _descriptor19, this);

          _initializerDefineProperty(this, "pullRingSpringTailImpulseX", _descriptor20, this);

          _initializerDefineProperty(this, "pullRingSpringStiffness", _descriptor21, this);

          _initializerDefineProperty(this, "pullRingSpringDamping", _descriptor22, this);

          _initializerDefineProperty(this, "pullRingSpringRootMaxAngle", _descriptor23, this);

          _initializerDefineProperty(this, "pullRingSpringTailMaxAngle", _descriptor24, this);

          _initializerDefineProperty(this, "pullRingSpringTailReturnScale", _descriptor25, this);

          _initializerDefineProperty(this, "pullRingSpringSideSwingScale", _descriptor26, this);

          _initializerDefineProperty(this, "pullRingSpringSideLiftScale", _descriptor27, this);

          _initializerDefineProperty(this, "pullRingSpringRootUpMaxAngle", _descriptor28, this);

          _initializerDefineProperty(this, "pullRingSpringTailUpMaxAngle", _descriptor29, this);

          _initializerDefineProperty(this, "reversePullRingSideLift", _descriptor30, this);

          _initializerDefineProperty(this, "teethNodes", _descriptor31, this);

          _initializerDefineProperty(this, "autoCollectTeeth", _descriptor32, this);

          _initializerDefineProperty(this, "sortTeethByZ", _descriptor33, this);

          _initializerDefineProperty(this, "startFromMaxZ", _descriptor34, this);

          _initializerDefineProperty(this, "startFromFarthestSide", _descriptor35, this);

          _initializerDefineProperty(this, "startFromSliderSide", _descriptor36, this);

          _initializerDefineProperty(this, "reverseZOrder", _descriptor37, this);

          _initializerDefineProperty(this, "hpLabel", _descriptor38, this);

          _initializerDefineProperty(this, "nodeCount", _descriptor39, this);

          _initializerDefineProperty(this, "hitPerNode", _descriptor40, this);

          _initializerDefineProperty(this, "pairAdvancePerHit", _descriptor41, this);

          _initializerDefineProperty(this, "hitCountPerStep", _descriptor42, this);

          _initializerDefineProperty(this, "hitStageConfigList", _descriptor43, this);

          _initializerDefineProperty(this, "smoothTotalHitCount", _descriptor44, this);

          _initializerDefineProperty(this, "smoothProgressEasePower", _descriptor45, this);

          _initializerDefineProperty(this, "teethPerPair", _descriptor46, this);

          _initializerDefineProperty(this, "initialClosedPairCount", _descriptor47, this);

          _initializerDefineProperty(this, "nextPairInitialProgress", _descriptor48, this);

          _initializerDefineProperty(this, "nextNextPairInitialProgress", _descriptor49, this);

          _initializerDefineProperty(this, "nodeSpacingZ", _descriptor50, this);

          _initializerDefineProperty(this, "autoCloseCenterX", _descriptor51, this);

          _initializerDefineProperty(this, "closeCenterX", _descriptor52, this);

          _initializerDefineProperty(this, "closeX", _descriptor53, this);

          _initializerDefineProperty(this, "openOffsetX", _descriptor54, this);

          _initializerDefineProperty(this, "reverseOpenDirection", _descriptor55, this);

          _initializerDefineProperty(this, "propGapZ", _descriptor56, this);

          _initializerDefineProperty(this, "moveCount", _descriptor57, this);

          _initializerDefineProperty(this, "hitAnimTime", _descriptor58, this);

          _initializerDefineProperty(this, "cubeHideTime", _descriptor59, this);

          _initializerDefineProperty(this, "keepSliderZOffset", _descriptor60, this);

          _initializerDefineProperty(this, "sliderOffsetZ", _descriptor61, this);

          _initializerDefineProperty(this, "reverseSliderMoveZ", _descriptor62, this);

          _initializerDefineProperty(this, "bulletLockRangeX", _descriptor63, this);

          _initializerDefineProperty(this, "bulletAimShrink", _descriptor64, this);

          _initializerDefineProperty(this, "bulletAimFrontDepthRatio", _descriptor65, this);

          _initializerDefineProperty(this, "hitAreaOffsetZ", _descriptor66, this);

          _initializerDefineProperty(this, "useCubeBoundsHitCenter", _descriptor67, this);

          _initializerDefineProperty(this, "sliderHitPaddingX", _descriptor68, this);

          _initializerDefineProperty(this, "sliderHitPaddingZ", _descriptor69, this);

          _initializerDefineProperty(this, "sliderThickCenterBias", _descriptor70, this);

          this.teeth = [];
          this.toothStartPos = [];
          this.toothClosedPos = [];
          this.pairProgressList = [];
          this.toothIndex = 0;
          this.pairIndex = 0;
          this.pairCount = 0;
          this.stepHitCount = 0;
          this.smoothHitCount = 0;
          this.cubeStartScale = new Vec3(1, 1, 1);
          this.cubeStartPos = new Vec3();
          this.hasCubeStartData = false;
          this.pullRingRootStartWorldPos = new Vec3();
          this.pullRingRootStartEuler = new Vec3();
          this.pullRingTailStartEuler = new Vec3();
          this.hasPullRingStartData = false;
          this.pullRingLoopStepIndex = 0;
          this.pullRingSpringActive = false;
          this.pullRingSpringHitDirection = 1;
          this.pullRingSpringRootAngleX = 0;
          this.pullRingSpringRootAngleY = 0;
          this.pullRingSpringRootVelX = 0;
          this.pullRingSpringRootVelY = 0;
          this.pullRingSpringTailAngleX = 0;
          this.pullRingSpringTailAngleY = 0;
          this.pullRingSpringTailVelX = 0;
          this.pullRingSpringTailVelY = 0;
          this.tempPullRingRootEuler = new Vec3();
          this.tempPullRingTailEuler = new Vec3();
          this.runtimeSliderOffsetZ = 0;
          this.tempLockAimPos = new Vec3();
          this.tempCollisionWorldPos = new Vec3();
          this.tempSliderTargetPos = new Vec3();
          this.tempSmoothSliderFromPos = new Vec3();
          this.tempSmoothSliderToPos = new Vec3();
          this.tempSmoothSliderTargetPos = new Vec3();
          this.tempWorldPos = new Vec3();
          this.tempSliderVisualCenterWorldPos = new Vec3();
          this.tempSliderVisualCenterParentPos = new Vec3();
          this.tempCubeBoundsHalfExtents = new Vec3();
          this.cubeMeshRenderers = [];
          this.originalToothPositions = new Map();
          this.closeCenter = 0;
          this.animating = false;
          this.finished = false;
          this.registered = false;
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

          this.refreshCollisionSizeFromBounds();
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

        getWorldZRange(out) {
          if (!this.cube) {
            return false;
          }

          var authoredTeeth = this.teeth.length > 0 ? this.teeth : this.collectTeeth();
          var minZ = Number.POSITIVE_INFINITY;
          var maxZ = Number.NEGATIVE_INFINITY;
          var count = this.nodeCount > 0 ? Math.min(this.nodeCount, authoredTeeth.length) : authoredTeeth.length;

          for (var i = 0; i < count; i++) {
            var tooth = authoredTeeth[i];

            if (!tooth) {
              continue;
            }

            var z = tooth.worldPosition.z;
            minZ = Math.min(minZ, z);
            maxZ = Math.max(maxZ, z);
          }

          if (minZ === Number.POSITIVE_INFINITY || maxZ === Number.NEGATIVE_INFINITY) {
            var _this$lalianRoot;

            var centerNode = (_this$lalianRoot = this.lalianRoot) != null ? _this$lalianRoot : this.cube;

            if (!centerNode) {
              return false;
            }

            var halfZ = Math.max(0, this.getPropStartZ()) * 0.5;
            var centerZ = centerNode.worldPosition.z;
            out.set(centerZ - halfZ, centerZ + halfZ, 0);
            return halfZ > 0;
          }

          out.set(minZ, maxZ, 0);
          return true;
        }

        Hit(damage) {
          if (this.animating && !this.finished) {
            return this.MaxHp > 0 ? this.curHp / this.MaxHp : 0;
          }

          if (this.finished) {
            return 0;
          }

          return super.Hit(1);
        }

        canLockBulletFromWorldX(worldX) {
          var _ref, _this$lalianRoot2;

          if (this.finished || !this.cube || !this.cube.active || !this.cube.activeInHierarchy) {
            return false;
          }

          var centerNode = (_ref = (_this$lalianRoot2 = this.lalianRoot) != null ? _this$lalianRoot2 : this.cube) != null ? _ref : this.node;
          return Math.abs(worldX - centerNode.worldPosition.x) <= this.bulletLockRangeX;
        }

        getLockAimWorldPosition(fromPos, out) {
          if (out === void 0) {
            out = this.tempLockAimPos;
          }

          this.refreshCollisionSizeFromBounds();
          var center = this.getCollisionWorldPosition(out);
          var shrink = Math.max(0.1, Math.min(1, this.bulletAimShrink));
          var halfX = Math.max(0.02, this.collisionHalfX * shrink);
          var halfZ = Math.max(0.02, this.collisionHalfZ * shrink);
          var baseX = Math.min(center.x + halfX, Math.max(center.x - halfX, fromPos.x));
          var spreadSeed = fromPos.x * 12.9898 + fromPos.z * 78.233;
          var spreadX = (this.sampleAimSpread01(spreadSeed) - 0.5) * halfX * 0.9;
          var x = Math.min(center.x + halfX, Math.max(center.x - halfX, baseX + spreadX));
          var frontRatio = Math.max(0.05, Math.min(1, this.bulletAimFrontDepthRatio));
          var fromFront = fromPos.z <= center.z;
          var frontZ = fromFront ? center.z - halfZ : center.z + halfZ;
          var depthBand = Math.max(0.02, halfZ * frontRatio);
          var depthT = this.sampleAimSpread01(spreadSeed + 17.371);
          var z = fromFront ? frontZ + depthBand * depthT : frontZ - depthBand * depthT;
          return out.set(x, center.y, z);
        }

        start() {
          this.initGate();
        }

        onDestroy() {
          this.unregisterTarget();
        }

        _update(dt) {
          this.updatePullRingSpring(dt);
        }

        initGate() {
          this.setupColliderTag();
          this.prepareLalian();

          if (this.teeth.length <= 0 || !this.cube) {
            return;
          }

          this.prepareCollisionSize();
          var totalHp = this.getSmoothTotalHitCount();
          this.MaxHp = totalHp;
          this.curHp = totalHp;
          this.isDestroy = false;
          this.finished = false;
          this.animating = false;
          this.updateHpLabel(totalHp);
          this.registerTarget();
        }

        prepareCollisionSize() {
          this.refreshCollisionSizeFromBounds();
        }

        refreshCollisionSizeFromBounds() {
          var minHalfX = 0.45;
          var minHalfZ = 0.32;
          var targetHalfX = Math.max(this.collisionHalfX, minHalfX);
          var targetHalfZ = Math.max(this.collisionHalfZ, minHalfZ);

          if (this.tryGetCubeBoundsHalfExtents(this.tempCubeBoundsHalfExtents)) {
            targetHalfX = Math.max(targetHalfX, this.tempCubeBoundsHalfExtents.x + Math.max(0, this.sliderHitPaddingX));
            targetHalfZ = Math.max(targetHalfZ, this.tempCubeBoundsHalfExtents.z + Math.max(0, this.sliderHitPaddingZ));
          }

          this.collisionHalfX = targetHalfX;
          this.collisionHalfZ = targetHalfZ;
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
          var totalHits = this.getSmoothTotalHitCount();
          this.smoothHitCount = Math.min(totalHits, this.smoothHitCount + 1);
          var linearProgress = totalHits > 0 ? this.smoothHitCount / totalHits : 1;
          var smoothProgress = this.getSmoothWholeProgress(linearProgress);
          var targetPos = this.getSmoothSliderTargetPos(smoothProgress);

          if (!targetPos) {
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
          this.applyWholeSmoothProgress(smoothProgress, true, animDuration);
          var remainHits = Math.max(0, totalHits - this.smoothHitCount);
          this.curHp = remainHits;
          this.updateHpLabel(remainHits);

          if (this.cube) {
            Tween.stopAllByTarget(this.cube);
            tween(this.cube).to(animDuration, {
              position: targetPos
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

          if (this.smoothHitCount >= this.getSmoothTotalHitCount()) {
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
          this.pairProgressList.length = 0;
          this.toothIndex = 0;
          this.pairIndex = 0;
          this.pairCount = 0;
          this.stepHitCount = 0;
          this.smoothHitCount = 0;
          this.pullRingLoopStepIndex = 0;

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
          this.smoothHitCount = 0;
          this.applyWholeSmoothProgress(0, false);
          this.stepHitCount = 0;
          var targetPos = this.getSmoothSliderTargetPos(0);

          if (this.cube && targetPos) {
            this.cube.setPosition(targetPos);
          }
        }

        applyWholeSmoothProgress(progress, useTween, duration) {
          if (duration === void 0) {
            duration = this.getHitAnimDuration();
          }

          if (this.pairCount <= 0) {
            return;
          }

          var clampedProgress = this.getClampedProgress(progress);
          var closedPairCount = Math.max(0, Math.min(this.getInitialClosedPairCount(), this.pairCount));
          var movingPairCount = Math.max(1, this.pairCount - closedPairCount);
          var wholePairProgress = closedPairCount + movingPairCount * clampedProgress;
          var currentPairIndex = Math.max(closedPairCount, Math.min(this.pairCount - 1, Math.floor(wholePairProgress)));
          var pairT = clampedProgress >= 1 ? 1 : this.getClampedProgress(wholePairProgress - currentPairIndex);
          var nextProgress = this.getClampedProgress(this.nextPairInitialProgress);
          var nextNextProgress = this.getClampedProgress(this.nextNextPairInitialProgress);

          for (var i = 0; i < this.pairCount; i++) {
            var pairProgress = 0;

            if (clampedProgress >= 1 || i < currentPairIndex) {
              pairProgress = 1;
            } else if (i === currentPairIndex) {
              pairProgress = nextProgress + (1 - nextProgress) * pairT;
            } else if (i === currentPairIndex + 1) {
              pairProgress = nextNextProgress + (nextProgress - nextNextProgress) * pairT;
            } else if (i === currentPairIndex + 2) {
              pairProgress = nextNextProgress * pairT;
            }

            this.applyPairProgress(i, this.getClampedProgress(pairProgress), useTween && i >= currentPairIndex && i <= currentPairIndex + 2, duration);
          }

          this.pairIndex = Math.max(0, Math.min(this.pairCount - 1, Math.floor(wholePairProgress)));
          this.toothIndex = this.getPairStartToothIndex(this.pairIndex);
        }

        getSmoothSliderTargetPos(progress) {
          var _this$getSliderPairLe, _this$getSliderPairLe2;

          if (!this.cube || this.pairCount <= 0) {
            return null;
          }

          var closedPairCount = Math.max(0, Math.min(this.getInitialClosedPairCount(), this.pairCount));
          var movingPairCount = Math.max(1, this.pairCount - closedPairCount);
          var sliderCursor = Math.max(0, Math.min(this.pairCount - 1, closedPairCount - 1 + movingPairCount * this.getClampedProgress(progress)));
          var fromPairIndex = Math.max(0, Math.min(this.pairCount - 1, Math.floor(sliderCursor)));
          var toPairIndex = Math.max(fromPairIndex, Math.min(this.pairCount - 1, fromPairIndex + 1));
          var pairT = this.getClampedProgress(sliderCursor - fromPairIndex);
          var fromTooth = (_this$getSliderPairLe = this.getSliderPairLeadTooth(fromPairIndex)) != null ? _this$getSliderPairLe : this.teeth[0];
          var toTooth = (_this$getSliderPairLe2 = this.getSliderPairLeadTooth(toPairIndex)) != null ? _this$getSliderPairLe2 : fromTooth;

          if (!fromTooth || !toTooth) {
            return null;
          }

          this.tempSmoothSliderFromPos.set(this.getSliderTargetPos(fromTooth));
          this.tempSmoothSliderToPos.set(this.getSliderTargetPos(toTooth));
          return this.tempSmoothSliderTargetPos.set(this.tempSmoothSliderFromPos.x + (this.tempSmoothSliderToPos.x - this.tempSmoothSliderFromPos.x) * pairT, this.tempSmoothSliderFromPos.y + (this.tempSmoothSliderToPos.y - this.tempSmoothSliderFromPos.y) * pairT, this.tempSmoothSliderFromPos.z + (this.tempSmoothSliderToPos.z - this.tempSmoothSliderFromPos.z) * pairT);
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

        sampleAimSpread01(seed) {
          var sinValue = Math.sin(seed) * 43758.5453123;
          return sinValue - Math.floor(sinValue);
        }

        tryGetCubeBoundsHalfExtents(out) {
          var maxHalfX = 0;
          var maxHalfY = 0;
          var maxHalfZ = 0;
          var found = false;

          for (var i = 0; i < this.cubeMeshRenderers.length; i++) {
            var _this$cubeMeshRendere;

            var worldBounds = (_this$cubeMeshRendere = this.cubeMeshRenderers[i]) == null || (_this$cubeMeshRendere = _this$cubeMeshRendere.model) == null ? void 0 : _this$cubeMeshRendere.worldBounds;
            var halfExtents = worldBounds == null ? void 0 : worldBounds.halfExtents;

            if (!halfExtents) {
              continue;
            }

            maxHalfX = Math.max(maxHalfX, halfExtents.x);
            maxHalfY = Math.max(maxHalfY, halfExtents.y);
            maxHalfZ = Math.max(maxHalfZ, halfExtents.z);
            found = true;
          }

          if (!found) {
            return false;
          }

          out.set(maxHalfX, maxHalfY, maxHalfZ);
          return true;
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
            var _this$cubeMeshRendere2;

            var worldBounds = (_this$cubeMeshRendere2 = this.cubeMeshRenderers[i]) == null || (_this$cubeMeshRendere2 = _this$cubeMeshRendere2.model) == null ? void 0 : _this$cubeMeshRendere2.worldBounds;
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
            this.pullRingRootStartWorldPos.set(this.pullRingRoot.worldPosition);
            this.pullRingRootStartEuler.set(this.pullRingRoot.eulerAngles);
          }

          if (this.pullRingTail) {
            this.pullRingTailStartEuler.set(this.pullRingTail.eulerAngles);
          }

          this.hasPullRingStartData = true;
        }

        resetPullRing() {
          this.resetPullRingSpring();

          if (this.pullRingRoot) {
            Tween.stopAllByTarget(this.pullRingRoot);
            this.pullRingRoot.setWorldPosition(this.getPullRingRootLiftedWorldPosition());
            this.pullRingRoot.eulerAngles = this.getPullRingRootStepEuler(0);
          }

          if (this.pullRingTail) {
            Tween.stopAllByTarget(this.pullRingTail);
            this.pullRingTail.eulerAngles = this.getPullRingTailStepEuler(0);
          }
        }

        playPullRingSwing() {
          this.cachePullRingStartData();

          if (!this.pullRingRoot) {
            return;
          }

          if (this.usePullRingSpringFeedback) {
            this.kickPullRingSpring();
            return;
          }

          this.resetPullRingSpring();
          var loopStepCount = this.getPullRingLoopStepCount();
          var stepPerHit = this.getPullRingStepPerHit();
          var stepTime = this.getPullRingStepTime();
          var targetSteps = [];

          for (var i = 1; i <= stepPerHit; i++) {
            targetSteps.push((this.pullRingLoopStepIndex + i) % loopStepCount);
          }

          this.pullRingLoopStepIndex = targetSteps[targetSteps.length - 1];
          Tween.stopAllByTarget(this.pullRingRoot);
          var rootTween = tween(this.pullRingRoot);

          for (var _i2 = 0; _i2 < targetSteps.length; _i2++) {
            rootTween = rootTween.to(stepTime, {
              eulerAngles: this.getPullRingRootStepEuler(targetSteps[_i2])
            }, {
              easing: 'sineInOut'
            });
          }

          rootTween.start();
          this.playPullRingTailJoint(targetSteps, stepTime);
        }

        playPullRingTailJoint(targetSteps, stepTime) {
          if (!this.pullRingRoot || !this.pullRingTail || !this.isNodeUnderParent(this.pullRingTail, this.pullRingRoot)) {
            return;
          }

          Tween.stopAllByTarget(this.pullRingTail);
          var tailTween = tween(this.pullRingTail);

          for (var i = 0; i < targetSteps.length; i++) {
            tailTween = tailTween.to(stepTime, {
              eulerAngles: this.getPullRingTailStepEuler(targetSteps[i])
            }, {
              easing: 'sineInOut'
            });
          }

          tailTween.start();
        }

        kickPullRingSpring() {
          if (!this.pullRingRoot) {
            return;
          }

          Tween.stopAllByTarget(this.pullRingRoot);

          if (this.pullRingTail) {
            Tween.stopAllByTarget(this.pullRingTail);
          }

          this.pullRingSpringHitDirection *= -1;
          var direction = this.pullRingSpringHitDirection;
          this.pullRingSpringRootVelY += direction * this.getPullRingSpringRootImpulseY();
          this.pullRingSpringRootVelX += this.getPullRingSpringRootImpulseX();
          this.pullRingSpringTailVelY += -direction * this.getPullRingSpringTailImpulseY();
          this.pullRingSpringTailVelX += this.getPullRingSpringTailImpulseX();
          this.pullRingSpringActive = true;
          this.applyPullRingSpringEuler();
        }

        updatePullRingSpring(dt) {
          if (!this.usePullRingSpringFeedback) {
            if (this.pullRingSpringActive) {
              this.resetPullRingSpring();
              this.applyPullRingSpringEuler();
            }

            return;
          }

          if (!this.pullRingSpringActive) {
            return;
          }

          var stepDt = Math.max(0, Math.min(0.033, dt));

          if (stepDt <= 0) {
            return;
          }

          var rootStiffness = this.getPullRingSpringStiffness();
          var rootDamping = this.getPullRingSpringDamping();
          var tailReturnScale = this.getPullRingSpringTailReturnScale();
          var tailStiffness = rootStiffness * tailReturnScale;
          var tailDamping = rootDamping * Math.sqrt(tailReturnScale);
          this.pullRingSpringRootVelX += (-this.pullRingSpringRootAngleX * rootStiffness - this.pullRingSpringRootVelX * rootDamping) * stepDt;
          this.pullRingSpringRootVelY += (-this.pullRingSpringRootAngleY * rootStiffness - this.pullRingSpringRootVelY * rootDamping) * stepDt;
          this.pullRingSpringTailVelX += (-this.pullRingSpringTailAngleX * tailStiffness - this.pullRingSpringTailVelX * tailDamping) * stepDt;
          this.pullRingSpringTailVelY += (-this.pullRingSpringTailAngleY * tailStiffness - this.pullRingSpringTailVelY * tailDamping) * stepDt;
          this.pullRingSpringRootAngleX += this.pullRingSpringRootVelX * stepDt;
          this.pullRingSpringRootAngleY += this.pullRingSpringRootVelY * stepDt;
          this.pullRingSpringTailAngleX += this.pullRingSpringTailVelX * stepDt;
          this.pullRingSpringTailAngleY += this.pullRingSpringTailVelY * stepDt;
          this.limitPullRingSpringAngles();

          if (this.isPullRingSpringSettled()) {
            this.resetPullRingSpring();
          }

          this.applyPullRingSpringEuler();
        }

        applyPullRingSpringEuler() {
          this.cachePullRingStartData();

          if (this.pullRingRoot) {
            var rootMaxX = this.getPullRingSpringRootMaxX();
            var rootSideLift = this.getPullRingSpringSideLift(this.pullRingSpringRootAngleY, this.getPullRingSpringRootMaxY(), rootMaxX);
            var rootAngleX = this.clampRange(this.pullRingSpringRootAngleX + rootSideLift, -this.getPullRingSpringRootUpMaxAngle(), rootMaxX);
            this.tempPullRingRootEuler.set(this.pullRingRootStartEuler.x + rootAngleX, this.pullRingRootStartEuler.y + this.pullRingSpringRootAngleY, this.pullRingRootStartEuler.z);
            this.pullRingRoot.eulerAngles = this.tempPullRingRootEuler;
          }

          if (this.pullRingTail) {
            var tailMaxX = this.getPullRingSpringTailMaxX();
            var tailSideLift = this.getPullRingSpringSideLift(this.pullRingSpringTailAngleY, this.getPullRingSpringTailMaxY(), tailMaxX);
            var tailAngleX = this.clampRange(this.pullRingSpringTailAngleX + tailSideLift, -this.getPullRingSpringTailUpMaxAngle(), tailMaxX);
            this.tempPullRingTailEuler.set(this.pullRingTailStartEuler.x + tailAngleX, this.pullRingTailStartEuler.y + this.pullRingSpringTailAngleY, this.pullRingTailStartEuler.z);
            this.pullRingTail.eulerAngles = this.tempPullRingTailEuler;
          }
        }

        resetPullRingSpring() {
          this.pullRingSpringActive = false;
          this.pullRingSpringRootAngleX = 0;
          this.pullRingSpringRootAngleY = 0;
          this.pullRingSpringRootVelX = 0;
          this.pullRingSpringRootVelY = 0;
          this.pullRingSpringTailAngleX = 0;
          this.pullRingSpringTailAngleY = 0;
          this.pullRingSpringTailVelX = 0;
          this.pullRingSpringTailVelY = 0;
        }

        isPullRingSpringSettled() {
          var angleEpsilon = 0.08;
          var velocityEpsilon = 1.5;
          return Math.abs(this.pullRingSpringRootAngleX) < angleEpsilon && Math.abs(this.pullRingSpringRootAngleY) < angleEpsilon && Math.abs(this.pullRingSpringTailAngleX) < angleEpsilon && Math.abs(this.pullRingSpringTailAngleY) < angleEpsilon && Math.abs(this.pullRingSpringRootVelX) < velocityEpsilon && Math.abs(this.pullRingSpringRootVelY) < velocityEpsilon && Math.abs(this.pullRingSpringTailVelX) < velocityEpsilon && Math.abs(this.pullRingSpringTailVelY) < velocityEpsilon;
        }

        limitPullRingSpringAngles() {
          var rootMaxX = this.getPullRingSpringRootMaxX();
          var rootMaxY = this.getPullRingSpringRootMaxY();
          var tailMaxX = this.getPullRingSpringTailMaxX();
          var tailMaxY = this.getPullRingSpringTailMaxY();
          var nextRootAngleX = this.clampRange(this.pullRingSpringRootAngleX, -rootMaxX * 0.35, rootMaxX);

          if (nextRootAngleX !== this.pullRingSpringRootAngleX) {
            this.pullRingSpringRootVelX = 0;
            this.pullRingSpringRootAngleX = nextRootAngleX;
          }

          var nextRootAngleY = this.clampSigned(this.pullRingSpringRootAngleY, rootMaxY);

          if (nextRootAngleY !== this.pullRingSpringRootAngleY) {
            this.pullRingSpringRootVelY = 0;
            this.pullRingSpringRootAngleY = nextRootAngleY;
          }

          var nextTailAngleX = this.clampRange(this.pullRingSpringTailAngleX, -tailMaxX * 0.25, tailMaxX);

          if (nextTailAngleX !== this.pullRingSpringTailAngleX) {
            this.pullRingSpringTailVelX = 0;
            this.pullRingSpringTailAngleX = nextTailAngleX;
          }

          var nextTailAngleY = this.clampSigned(this.pullRingSpringTailAngleY, tailMaxY);

          if (nextTailAngleY !== this.pullRingSpringTailAngleY) {
            this.pullRingSpringTailVelY = 0;
            this.pullRingSpringTailAngleY = nextTailAngleY;
          }
        }

        getPullRingRootStepEuler(stepIndex) {
          var phase = this.getPullRingPhase(stepIndex);
          var swingY = Math.sin(phase) * this.pullRingRootSwingY;
          var liftX = (1 - Math.cos(phase)) * 0.5 * this.pullRingRootLiftX;
          return v3(this.pullRingRootStartEuler.x + liftX, this.pullRingRootStartEuler.y + swingY, this.pullRingRootStartEuler.z);
        }

        getPullRingRootLiftedWorldPosition() {
          return v3(this.pullRingRootStartWorldPos.x, this.pullRingRootStartWorldPos.y + this.pullRingRootLiftY, this.pullRingRootStartWorldPos.z);
        }

        getPullRingTailStepEuler(stepIndex) {
          var phase = this.getPullRingPhase(stepIndex);
          var wave = Math.sin(phase);
          var liftCurve = (1 - Math.cos(phase)) * 0.5;
          var downAngleScale = 1 - (1 - this.getPullRingTailDownAngleScale()) * liftCurve;
          var swingY = wave * this.pullRingTailSwingY;
          var liftX = liftCurve * this.pullRingTailLiftX * downAngleScale;
          return v3(this.pullRingTailStartEuler.x + liftX, this.pullRingTailStartEuler.y + swingY, this.pullRingTailStartEuler.z);
        }

        getPullRingPhase(stepIndex) {
          return Math.PI * 2 * (stepIndex / this.getPullRingLoopStepCount());
        }

        getPullRingLoopStepCount() {
          return Math.max(2, Math.floor(this.pullRingLoopStepCount));
        }

        getPullRingStepPerHit() {
          return Math.max(1, Math.floor(this.pullRingStepPerHit));
        }

        getPullRingStepTime() {
          return Math.max(0.02, this.pullRingStepTime);
        }

        getPullRingTailDownAngleScale() {
          return Math.max(0.1, Math.min(1, this.pullRingTailDownAngleScale));
        }

        getPullRingSpringRootImpulseY() {
          return Math.max(0, this.pullRingSpringRootImpulseY) * this.getPullRingSpringSideSwingScale();
        }

        getPullRingSpringRootImpulseX() {
          return Math.max(0, this.pullRingSpringRootImpulseX);
        }

        getPullRingSpringTailImpulseY() {
          return Math.max(0, this.pullRingSpringTailImpulseY) * this.getPullRingSpringSideSwingScale();
        }

        getPullRingSpringTailImpulseX() {
          return Math.max(0, this.pullRingSpringTailImpulseX);
        }

        getPullRingSpringStiffness() {
          return Math.max(110, this.pullRingSpringStiffness);
        }

        getPullRingSpringDamping() {
          return Math.max(8, this.pullRingSpringDamping);
        }

        getPullRingSpringRootMaxAngle() {
          return Math.max(1, this.pullRingSpringRootMaxAngle);
        }

        getPullRingSpringTailMaxAngle() {
          return Math.max(1, this.pullRingSpringTailMaxAngle);
        }

        getPullRingSpringTailReturnScale() {
          return Math.max(0.65, Math.min(2, this.pullRingSpringTailReturnScale));
        }

        getPullRingSpringSideSwingScale() {
          return Math.max(0.1, Math.min(3, this.pullRingSpringSideSwingScale));
        }

        getPullRingSpringRootMaxX() {
          return Math.min(this.getPullRingSpringRootMaxAngle(), Math.max(0.5, this.pullRingRootLiftX));
        }

        getPullRingSpringRootMaxY() {
          return Math.min(this.getPullRingSpringRootMaxAngle(), Math.max(1, this.pullRingRootSwingY * this.getPullRingSpringSideLimitScale()));
        }

        getPullRingSpringTailMaxX() {
          var authoredMaxX = this.pullRingTailLiftX * this.getPullRingTailDownAngleScale();
          return Math.min(this.getPullRingSpringTailMaxAngle(), Math.max(0.5, authoredMaxX));
        }

        getPullRingSpringTailMaxY() {
          return Math.min(this.getPullRingSpringTailMaxAngle(), Math.max(1, this.pullRingTailSwingY * this.getPullRingSpringSideLimitScale()));
        }

        getPullRingSpringSideLimitScale() {
          return Math.max(1, Math.min(1.12, this.getPullRingSpringSideSwingScale()));
        }

        getPullRingSpringSideLift(angleY, maxY, maxX) {
          if (maxY <= 0 || maxX <= 0) {
            return 0;
          }

          var sideRate = Math.min(1, Math.abs(angleY) / maxY);
          var lift = maxX * this.getPullRingSpringSideLiftScale() * sideRate;
          return this.reversePullRingSideLift ? -lift : lift;
        }

        getPullRingSpringSideLiftScale() {
          return Math.max(0, Math.min(8, this.pullRingSpringSideLiftScale));
        }

        getPullRingSpringRootUpMaxAngle() {
          return Math.max(0, this.pullRingSpringRootUpMaxAngle);
        }

        getPullRingSpringTailUpMaxAngle() {
          return Math.max(0, this.pullRingSpringTailUpMaxAngle);
        }

        clampSigned(value, maxAbs) {
          return Math.max(-maxAbs, Math.min(maxAbs, value));
        }

        clampRange(value, min, max) {
          return Math.max(min, Math.min(max, value));
        }

        prepareSliderOffset() {
          var _this$getSliderPairLe3;

          this.runtimeSliderOffsetZ = this.sliderOffsetZ;

          if (this.startFromMaxZ) {
            return;
          }

          var offsetBaseTooth = (_this$getSliderPairLe3 = this.getSliderPairLeadTooth(Math.max(0, Math.min(this.getInitialClosedPairCount(), this.pairCount) - 1))) != null ? _this$getSliderPairLe3 : this.teeth[0];

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

          var clampedProgress = this.getClampedProgress(progress);
          this.pairProgressList[pairIndex] = clampedProgress;
          var startIndex = this.getPairStartToothIndex(pairIndex);
          var perPair = this.getTeethPerPair();

          for (var i = 0; i < perPair; i++) {
            var toothIndex = startIndex + i;

            if (!this.teeth[toothIndex]) {
              continue;
            }

            this.applyToothProgress(toothIndex, clampedProgress, useTween, duration);
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

        getSliderStepTargetPos(startTooth, endTooth, progress) {
          var fromPos = this.getSliderTargetPos(startTooth).clone();
          var toPos = this.getSliderTargetPos(endTooth).clone();
          return v3(fromPos.x + (toPos.x - fromPos.x) * progress, fromPos.y + (toPos.y - fromPos.y) * progress, fromPos.z + (toPos.z - fromPos.z) * progress);
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

        getSmoothTotalHitCount() {
          return Math.max(1, Math.floor(this.smoothTotalHitCount));
        }

        getSmoothWholeProgress(linearProgress) {
          var clampedProgress = this.getClampedProgress(linearProgress);
          var easePower = Math.max(0.1, this.smoothProgressEasePower);
          return this.getClampedProgress(1 - Math.pow(1 - clampedProgress, easePower));
        }

        getHitCountPerStep() {
          return Math.max(1, Math.floor(this.hitCountPerStep));
        }

        getPairAdvancePerHit() {
          return Math.max(1, Math.floor(this.pairAdvancePerHit));
        }

        getHitCountPerStepForPair(pairIndex) {
          var _this$hitStageConfigL;

          var fallback = this.getHitCountPerStep();
          var stageStartPairIndex = this.getStageStartPairIndex();
          var remainingPairCount = this.pairCount - stageStartPairIndex;

          if (remainingPairCount <= 0 || !((_this$hitStageConfigL = this.hitStageConfigList) != null && _this$hitStageConfigL.length)) {
            return fallback;
          }

          var clampedPairIndex = Math.max(stageStartPairIndex, Math.min(pairIndex, this.pairCount - 1));
          var pairAdvancePerHit = this.getPairAdvancePerHit();
          var logicalStepCount = Math.max(1, Math.ceil(remainingPairCount / pairAdvancePerHit));
          var logicalStepOrdinal = Math.floor((clampedPairIndex - stageStartPairIndex) / pairAdvancePerHit) + 1;
          var progress = Math.max(0, Math.min(1, logicalStepOrdinal / logicalStepCount));
          var matchedCount = 0;
          var matchedEndProgress = Number.POSITIVE_INFINITY;
          var fallbackCount = 0;
          var fallbackEndProgress = -1;

          for (var i = 0; i < this.hitStageConfigList.length; i++) {
            var config = this.hitStageConfigList[i];

            if (!config) {
              continue;
            }

            var endProgress = Math.max(0, Math.min(1, config.endProgress));
            var hitCount = Math.max(1, Math.floor(config.hitCountPerStep));

            if (endProgress > fallbackEndProgress) {
              fallbackEndProgress = endProgress;
              fallbackCount = hitCount;
            }

            if (endProgress >= progress && endProgress < matchedEndProgress) {
              matchedEndProgress = endProgress;
              matchedCount = hitCount;
            }
          }

          if (matchedCount > 0) {
            return matchedCount;
          }

          if (fallbackCount > 0) {
            return fallbackCount;
          }

          return fallback;
        }

        getPairProgress(pairIndex) {
          var _this$pairProgressLis;

          return this.getClampedProgress((_this$pairProgressLis = this.pairProgressList[pairIndex]) != null ? _this$pairProgressLis : 0);
        }

        getRemainHitCount(pairIndex, stepHitCount) {
          if (pairIndex === void 0) {
            pairIndex = this.pairIndex;
          }

          if (stepHitCount === void 0) {
            stepHitCount = this.stepHitCount;
          }

          var firstPendingPairIndex = Math.max(0, pairIndex + 1);

          if (firstPendingPairIndex >= this.pairCount) {
            return 0;
          }

          var pairAdvancePerHit = this.getPairAdvancePerHit();
          var remainAdvance = 0;

          for (var i = firstPendingPairIndex; i < this.pairCount; i += pairAdvancePerHit) {
            var requiredHits = this.getHitCountPerStepForPair(i);

            if (i === firstPendingPairIndex) {
              remainAdvance += Math.max(0, requiredHits - Math.max(0, stepHitCount));
            } else {
              remainAdvance += requiredHits;
            }
          }

          return Math.max(0, remainAdvance);
        }

        getStageStartPairIndex() {
          return Math.max(0, Math.min(this.getInitialClosedPairCount(), this.pairCount));
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

      }, (_descriptor3 = _applyDecoratedDescriptor(_class5.prototype, "lalianRoot", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "cube", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "pullRingRoot", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class5.prototype, "pullRingTail", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class5.prototype, "pullRingLoopStepCount", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class5.prototype, "pullRingStepPerHit", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class5.prototype, "pullRingStepTime", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.08;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class5.prototype, "pullRingRootSwingY", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 16;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class5.prototype, "pullRingRootLiftX", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 6;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class5.prototype, "pullRingRootLiftY", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.08;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class5.prototype, "pullRingTailSwingY", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 42;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class5.prototype, "pullRingTailLiftX", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 14;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class5.prototype, "pullRingTailDownAngleScale", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.65;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class5.prototype, "usePullRingSpringFeedback", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class5.prototype, "pullRingSpringRootImpulseY", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 700;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class5.prototype, "pullRingSpringRootImpulseX", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 260;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class5.prototype, "pullRingSpringTailImpulseY", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1250;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class5.prototype, "pullRingSpringTailImpulseX", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 360;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class5.prototype, "pullRingSpringStiffness", [_dec23], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 130;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class5.prototype, "pullRingSpringDamping", [_dec24], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 13;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class5.prototype, "pullRingSpringRootMaxAngle", [_dec25], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 18;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class5.prototype, "pullRingSpringTailMaxAngle", [_dec26], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 46;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class5.prototype, "pullRingSpringTailReturnScale", [_dec27], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.9;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class5.prototype, "pullRingSpringSideSwingScale", [_dec28], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.45;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class5.prototype, "pullRingSpringSideLiftScale", [_dec29], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class5.prototype, "pullRingSpringRootUpMaxAngle", [_dec30], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class5.prototype, "pullRingSpringTailUpMaxAngle", [_dec31], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 22;
        }
      }), _descriptor30 = _applyDecoratedDescriptor(_class5.prototype, "reversePullRingSideLift", [_dec32], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor31 = _applyDecoratedDescriptor(_class5.prototype, "teethNodes", [_dec33], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor32 = _applyDecoratedDescriptor(_class5.prototype, "autoCollectTeeth", [_dec34], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor33 = _applyDecoratedDescriptor(_class5.prototype, "sortTeethByZ", [_dec35], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor34 = _applyDecoratedDescriptor(_class5.prototype, "startFromMaxZ", [_dec36], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor35 = _applyDecoratedDescriptor(_class5.prototype, "startFromFarthestSide", [_dec37], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor36 = _applyDecoratedDescriptor(_class5.prototype, "startFromSliderSide", [_dec38], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor37 = _applyDecoratedDescriptor(_class5.prototype, "reverseZOrder", [_dec39], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor38 = _applyDecoratedDescriptor(_class5.prototype, "hpLabel", [_dec40], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor39 = _applyDecoratedDescriptor(_class5.prototype, "nodeCount", [_dec41], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor40 = _applyDecoratedDescriptor(_class5.prototype, "hitPerNode", [_dec42], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor41 = _applyDecoratedDescriptor(_class5.prototype, "pairAdvancePerHit", [_dec43], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor42 = _applyDecoratedDescriptor(_class5.prototype, "hitCountPerStep", [_dec44], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor43 = _applyDecoratedDescriptor(_class5.prototype, "hitStageConfigList", [_dec45], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor44 = _applyDecoratedDescriptor(_class5.prototype, "smoothTotalHitCount", [_dec46], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1000;
        }
      }), _descriptor45 = _applyDecoratedDescriptor(_class5.prototype, "smoothProgressEasePower", [_dec47], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor46 = _applyDecoratedDescriptor(_class5.prototype, "teethPerPair", [_dec48], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor47 = _applyDecoratedDescriptor(_class5.prototype, "initialClosedPairCount", [_dec49], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor48 = _applyDecoratedDescriptor(_class5.prototype, "nextPairInitialProgress", [_dec50], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.5;
        }
      }), _descriptor49 = _applyDecoratedDescriptor(_class5.prototype, "nextNextPairInitialProgress", [_dec51], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.25;
        }
      }), _descriptor50 = _applyDecoratedDescriptor(_class5.prototype, "nodeSpacingZ", [_dec52], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.8;
        }
      }), _descriptor51 = _applyDecoratedDescriptor(_class5.prototype, "autoCloseCenterX", [_dec53], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor52 = _applyDecoratedDescriptor(_class5.prototype, "closeCenterX", [_dec54], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor53 = _applyDecoratedDescriptor(_class5.prototype, "closeX", [_dec55], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.1;
        }
      }), _descriptor54 = _applyDecoratedDescriptor(_class5.prototype, "openOffsetX", [_dec56], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.45;
        }
      }), _descriptor55 = _applyDecoratedDescriptor(_class5.prototype, "reverseOpenDirection", [_dec57], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor56 = _applyDecoratedDescriptor(_class5.prototype, "propGapZ", [_dec58], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.2;
        }
      }), _descriptor57 = _applyDecoratedDescriptor(_class5.prototype, "moveCount", [_dec59], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor58 = _applyDecoratedDescriptor(_class5.prototype, "hitAnimTime", [_dec60], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.12;
        }
      }), _descriptor59 = _applyDecoratedDescriptor(_class5.prototype, "cubeHideTime", [_dec61], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.08;
        }
      }), _descriptor60 = _applyDecoratedDescriptor(_class5.prototype, "keepSliderZOffset", [_dec62], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor61 = _applyDecoratedDescriptor(_class5.prototype, "sliderOffsetZ", [_dec63], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor62 = _applyDecoratedDescriptor(_class5.prototype, "reverseSliderMoveZ", [_dec64], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor63 = _applyDecoratedDescriptor(_class5.prototype, "bulletLockRangeX", [_dec65], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2.5;
        }
      }), _descriptor64 = _applyDecoratedDescriptor(_class5.prototype, "bulletAimShrink", [_dec66], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.92;
        }
      }), _descriptor65 = _applyDecoratedDescriptor(_class5.prototype, "bulletAimFrontDepthRatio", [_dec67], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.35;
        }
      }), _descriptor66 = _applyDecoratedDescriptor(_class5.prototype, "hitAreaOffsetZ", [_dec68], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -0.18;
        }
      }), _descriptor67 = _applyDecoratedDescriptor(_class5.prototype, "useCubeBoundsHitCenter", [_dec69], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor68 = _applyDecoratedDescriptor(_class5.prototype, "sliderHitPaddingX", [_dec70], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.08;
        }
      }), _descriptor69 = _applyDecoratedDescriptor(_class5.prototype, "sliderHitPaddingZ", [_dec71], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.18;
        }
      }), _descriptor70 = _applyDecoratedDescriptor(_class5.prototype, "sliderThickCenterBias", [_dec72], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.2;
        }
      })), _class5)) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=c14c87720f6e6e7b27f438925fae2cc2d4587268.js.map