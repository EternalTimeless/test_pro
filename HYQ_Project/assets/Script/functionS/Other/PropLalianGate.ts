import { _decorator, AudioClip, CCBoolean, CCFloat, CCInteger, Color, EffectAsset, Label, Material, Mesh, MeshRenderer, Node, resources, Tween, tween, utils, v3, Vec3 } from 'cc';
import { BattleTarget3D } from '../Battle/BattleTarger/BattleTarget3D';
import BulletMonsterCollisionManager from '../Battle/BulletMonsterCollisionManager';
import ColliderTag, { COLLIDE_TYPE } from '../Battle/CollectBattleTarger/ColliderTag';
import { EventType, SoundEnum } from '../../Base/EnumList';
import EventManager from '../../Base/EventManager';
import AudioManager from '../../Base/AudioManager';
import TweenTool from '../../Tool/TweenTool';

const { ccclass, property } = _decorator;

@ccclass('LalianHitStageConfig')
class LalianHitStageConfig {

    @property({ type: CCFloat, displayName: '阶段结束进度', tooltip: '0~1。表示这一段覆盖到拉链剩余推进进度的哪个位置，例如 0.33 / 0.66 / 1。' })
    public endProgress: number = 1;

    @property({ type: CCInteger, displayName: '每格受击次数', tooltip: '落在该阶段内的每一格推进，默认需要多少次受击。' })
    public hitCountPerStep: number = 1;
}

@ccclass('PropLalianGate')
export class PropLalianGate extends BattleTarget3D {

    @property({ type: Node, displayName: '拉链根节点', tooltip: '拖入 lalian_01/lalian_02 的根节点。为空时只使用下面手动拖入的齿条列表。' })
    public lalianRoot: Node = null;

    @property({ type: Node, displayName: '滑块受击节点', tooltip: '拖入 SM_laliantou_02 / SM_laliantou_03。子弹锁定和命中都以它为中心，推进时它会沿 Z 轴移动。' })
    public cube: Node = null;

    @property({ type: Node, displayName: '拉环根节点', tooltip: '挂在滑块上的拉环节点。滑块受击时，这个节点会做小幅摆动。' })
    public pullRingRoot: Node = null;

    @property({ type: Node, displayName: '拉环尾巴节点', tooltip: '拉环尾巴节点。滑块受击时，这个节点会做更明显的摆动。' })
    public pullRingTail: Node = null;

    @property({ type: CCInteger, displayName: '拉环循环段数', tooltip: '拉环摆动一圈拆成多少段，默认 8 段。' })
    public pullRingLoopStepCount: number = 8;

    @property({ type: CCInteger, displayName: '每次受击拉环步数', tooltip: '每次命中推进多少段拉环动作，默认 2 段。' })
    public pullRingStepPerHit: number = 2;

    @property({ type: CCFloat, displayName: '拉环单步时长(秒)', tooltip: '每一段拉环动作的持续时间，数值越大动作越慢。' })
    public pullRingStepTime: number = 0.08;

    @property({ type: CCFloat, displayName: '拉环根左右摆幅', tooltip: '拉环根节点沿 Y 轴左右摆动角度。' })
    public pullRingRootSwingY: number = 16;

    @property({ type: CCFloat, displayName: '拉环根椭圆仰角', tooltip: '拉环根节点沿 X 轴形成压扁椭圆弧的仰角。' })
    public pullRingRootLiftX: number = 6;

    @property({ type: CCFloat, displayName: '拉环根世界上抬高度', tooltip: '拉环根节点整体沿世界 Y 轴上抬，避免父级轴向导致变成 Z 纵深偏移。' })
    public pullRingRootLiftY: number = 0.08;

    @property({ type: CCFloat, displayName: '拉环尾左右摆幅', tooltip: '拉环尾节点沿 Y 轴左右摆动角度，尾部更大时会像喇叭口。' })
    public pullRingTailSwingY: number = 42;

    @property({ type: CCFloat, displayName: '拉环尾椭圆仰角', tooltip: '拉环尾节点沿 X 轴形成压扁椭圆弧的仰角。' })
    public pullRingTailLiftX: number = 14;

    @property({ type: CCFloat, displayName: '拉环尾下压角度比例', tooltip: '只缩放尾部 X 轴下压角度，不影响左右摆幅；数值越小越不容易穿模。' })
    public pullRingTailDownAngleScale: number = 0.65;

    @property({ type: CCBoolean, displayName: '使用弹簧拉环反馈', tooltip: '开启后，滑块受击时拉环使用伪物理弹簧冲量反馈；关闭则回到原来的固定 tween 摆动。' })
    public usePullRingSpringFeedback: boolean = true;

    @property({ type: CCFloat, displayName: '拉环根左右冲量', tooltip: '受击瞬间给拉环根节点 Y 轴的速度冲量，数值越大左右甩动越明显。' })
    public pullRingSpringRootImpulseY: number = 700;

    @property({ type: CCFloat, displayName: '拉环根抬起冲量', tooltip: '受击瞬间给拉环根节点 X 轴的速度冲量，数值越大跳起感越明显。' })
    public pullRingSpringRootImpulseX: number = 260;

    @property({ type: CCFloat, displayName: '拉环尾巴左右冲量', tooltip: '受击瞬间给拉环尾巴节点 Y 轴的速度冲量，主要控制尾巴甩动幅度。' })
    public pullRingSpringTailImpulseY: number = 1250;

    @property({ type: CCFloat, displayName: '拉环尾巴抬起冲量', tooltip: '受击瞬间给拉环尾巴节点 X 轴的速度冲量，主要控制尾巴上下跳动。' })
    public pullRingSpringTailImpulseX: number = 360;

    @property({ type: CCFloat, displayName: '拉环尾巴随机摆动强度', tooltip: '只影响拉环尾巴每次受击的随机摆动。0 为固定动作，1 为使用完整随机摆动，角度仍受最大摆角限制避免穿模。' })
    public pullRingTailRandomSwingRate: number = 1;

    @property({ type: CCFloat, displayName: '拉环摆动速度倍率', tooltip: '控制拉环弹簧动作整体快慢。数值越小摆动越慢，用来让尾巴摆动节奏匹配滑块推进。' })
    public pullRingSwingSpeedScale: number = 0.55;

    @property({ type: CCFloat, displayName: '拉环根部跟随强度', tooltip: '控制拉环根节点跟随尾巴摆动的幅度。0 表示根部不动，建议使用 0.2~0.5；只旋转拉环，不改变滑块位置。' })
    public pullRingRootSpringRate: number = 0.3;

    @property({ type: CCFloat, displayName: '连续受击速度保留(0-1)', tooltip: '上一段摆动未结束时保留多少当前速度。0 表示只从当前姿态接新冲量，1 表示完整叠加旧速度；建议 0.25~0.5。' })
    public pullRingSpringHitVelocityRetain: number = 0.35;

    @property({ type: CCFloat, displayName: '拉环弹簧强度', tooltip: '拉环回到初始角度的力度，数值越大回正越快。' })
    public pullRingSpringStiffness: number = 130;

    @property({ type: CCFloat, displayName: '拉环弹簧阻尼', tooltip: '拉环摆动衰减速度，数值越大越快停住。' })
    public pullRingSpringDamping: number = 13;

    @property({ type: CCFloat, displayName: '拉环根最大摆角', tooltip: '拉环根节点最终会同时受这个值和旧的根左右/抬起参数限制，防止加强反馈后穿模。' })
    public pullRingSpringRootMaxAngle: number = 18;

    @property({ type: CCFloat, displayName: '拉环尾巴最大摆角', tooltip: '拉环尾巴最终会同时受这个值和旧的尾巴左右/抬起参数限制，防止加强反馈后穿模。' })
    public pullRingSpringTailMaxAngle: number = 46;

    @property({ type: CCFloat, displayName: '拉环尾巴回弹倍率', tooltip: '尾巴相对根节点的回弹速度倍率。低于 1 会更拖尾，高于 1 会更紧。' })
    public pullRingSpringTailReturnScale: number = 0.9;

    @property({ type: CCFloat, displayName: '左右摆动增强倍率', tooltip: '只增强拉环根和尾巴的 Y 轴左右甩动，不影响上下抬起角度；建议 1~1.6。' })
    public pullRingSpringSideSwingScale: number = 1.45;

    @property({ type: CCFloat, displayName: '左右摆动上扬补偿', tooltip: '左右摆动越大，X 轴越往上补一点，减少侧摆时下压的观感；当前模型建议 2~5。' })
    public pullRingSpringSideLiftScale: number = 3;

    @property({ type: CCFloat, displayName: '根部上扬最大角', tooltip: '限制左右摆动补偿给根部带来的最大上扬角，避免根部翻得太过。' })
    public pullRingSpringRootUpMaxAngle: number = 10;

    @property({ type: CCFloat, displayName: '尾巴上扬最大角', tooltip: '限制左右摆动补偿给尾巴带来的最大上扬角。尾巴贴地时优先调大这个值。' })
    public pullRingSpringTailUpMaxAngle: number = 22;

    @property({ type: CCBoolean, displayName: '反向上扬补偿', tooltip: '开启后使用负 X 作为上扬方向。若现场发现越调越下压，就关闭这个开关。' })
    public reversePullRingSideLift: boolean = true;

    @property({ type: [Node], displayName: '拉链齿条列表', tooltip: '拖入需要参与推进的 SM_lalian-xxx 节点。列表为空且开启自动收集时，会从拉链根节点下自动收集 SM_lalian-xxx。' })
    public teethNodes: Node[] = [];

    @property({ type: CCBoolean, displayName: '自动收集齿条', tooltip: '齿条列表为空时，从拉链根节点的直接子节点中自动收集名字以 SM_lalian 开头的节点；不会生成新节点。' })
    public autoCollectTeeth: boolean = true;

    @property({ type: CCBoolean, displayName: '按Z轴排序齿条', tooltip: '开启后按齿条本地 Z 轴排序，适合 lalian_01/lalian_02 这种已有齿条资源。关闭则完全使用上方列表顺序。' })
    public sortTeethByZ: boolean = true;

    @property({ type: CCBoolean, displayName: '从Z最大端开始', tooltip: '开启后整条拉链以齿条 Z 最大端作为初始点，滑块和齿条都从这一端开始推进。' })
    public startFromMaxZ: boolean = true;

    @property({ type: CCBoolean, displayName: '从最远端开始(旧)', tooltip: '旧排序方式。只有关闭“从Z最大端开始”时才会生效。' })
    public startFromFarthestSide: boolean = false;

    @property({ type: CCBoolean, displayName: '从滑块端开始(旧)', tooltip: '旧排序方式。只有关闭“从最远端开始”时才会生效。' })
    public startFromSliderSide: boolean = false;

    @property({ type: CCBoolean, displayName: 'Z轴倒序推进', tooltip: '在当前排序结果上再反向一次。若“从Z最大端开始”后现场仍然相反，就勾选这个。' })
    public reverseZOrder: boolean = false;

    @property({ type: Label, displayName: '血量文本', tooltip: '可选。显示剩余需要受击推进的齿条数量。' })
    public hpLabel: Label = null;

    @property({ type: CCInteger, displayName: '使用齿条数量(0=全部)', tooltip: '运行时实际使用多少个齿条。填 0 表示使用齿条列表/自动收集到的全部齿条；不会自动生成缺少的齿条。' })
    public nodeCount: number = 0;

    @property({ type: CCInteger, visible: false })
    public hitPerNode: number = 2;

    @property({ type: CCInteger, visible: false })
    public pairAdvancePerHit: number = 1;

    @property({ type: CCInteger, visible: false })
    public hitCountPerStep: number = 1;

    @property({ type: [LalianHitStageConfig], visible: false })
    public hitStageConfigList: LalianHitStageConfig[] = [];

    @property({ type: CCInteger, displayName: '整体顺滑总受击次数', tooltip: '整条拉链从初始状态推进到完成需要的总受击次数。1000 表示每次受击只推进很小一段。' })
    public smoothTotalHitCount: number = 1000;

    @property({ type: CCFloat, displayName: '整体推进前快后慢强度', tooltip: '控制前段速度回落的快慢。1 较平缓，2 会让前半段推进更快、前段回落更明显，之后持续平缓降速。建议 1~3。' })
    public smoothProgressEasePower: number = 2;

    @property({ type: CCFloat, displayName: '末段推进保留比例(0-1)', tooltip: '为后半段和结尾保留的基础推进速度。值越大越不容易拖尾；0.7 表示始终保留 70% 的基础推进。为避免最后一点长时间打不掉，建议保持 0.65~0.8。' })
    public smoothEndSpeedFloor: number = 0.7;

    @property({ type: CCInteger, displayName: '每对齿条数量', tooltip: '默认 2，表示每 2 个 SM_lalian 齿条算作一对，一次受击推进一对。' })
    public teethPerPair: number = 2;

    @property({ type: CCInteger, displayName: '初始闭合对数', tooltip: '默认前 2 对齿条完全闭合。' })
    public initialClosedPairCount: number = 2;

    @property({ type: CCFloat, displayName: '下一对初始闭合度', tooltip: '初始闭合对数之后的下一对闭合度。默认 0.5 表示半闭合。' })
    public nextPairInitialProgress: number = 0.5;

    @property({ type: CCFloat, displayName: '再下一对初始闭合度', tooltip: '下一对之后的再下一对闭合度。默认 0.25 表示 1/4 闭合。' })
    public nextNextPairInitialProgress: number = 0.25;

    @property({ type: CCFloat, displayName: '齿条Z间距(兜底)', tooltip: '无法从齿条节点计算长度时，用这个值估算 +1/+99 的起始距离。' })
    public nodeSpacingZ: number = 0.8;

    @property({ type: CCBoolean, displayName: '自动计算收拢中心X', tooltip: '开启后用本次使用齿条的最小/最大 X 计算中线；适合 lalian_01/lalian_02。关闭后使用“手动收拢中心X”。' })
    public autoCloseCenterX: boolean = true;

    @property({ type: CCFloat, displayName: '手动收拢中心X', tooltip: '关闭自动计算时生效。齿条会向这个本地 X 位置靠拢。' })
    public closeCenterX: number = 0;

    @property({ type: CCFloat, displayName: '最终保留半宽X(旧参数)', tooltip: '旧临时拉链参数。当前 lalian_01/lalian_02 默认闭合资源会直接收回到资源默认位置，不再读取这个值。' })
    public closeX: number = 0.1;

    @property({ type: CCFloat, displayName: '开链外扩X', tooltip: '资源默认是闭合状态时，初始化会让齿条沿 X 轴向两侧外扩这个距离，形成打开状态。' })
    public openOffsetX: number = 0.45;

    @property({ type: CCBoolean, displayName: '反向开链方向', tooltip: '开链初始化方向反了就切这个。开启后，齿条沿 X 轴外扩的方向会整体反过来。' })
    public reverseOpenDirection: boolean = false;

    @property({ type: CCFloat, displayName: '道具队列间隔Z', tooltip: '+1/+99 队列与拉链末端之间额外保留的 Z 轴距离。' })
    public propGapZ: number = 1.2;

    @property({ type: CCInteger, displayName: '完成后放出数量', tooltip: '拉链全部完成后，向玩家移动的 +1/+99 道具数量。填 0 表示持续放出，不主动停。' })
    public moveCount: number = 0;

    @property({ type: CCFloat, displayName: '受击动画时长', tooltip: '每次受击后，齿条收拢和滑块移动的动画时间。' })
    public hitAnimTime: number = 0.12;

    @property({ type: CCFloat, displayName: '滑块消失时长', tooltip: '所有齿条完成后，滑块缩小消失动画的持续时间。' })
    public cubeHideTime: number = 0.08;

    @property({ type: CCBoolean, displayName: '启用拉链完成光幕' })
    public enableFinishLightCurtain: boolean = true;

    @property({ type: CCFloat, displayName: '光幕持续时间（秒）', min: 0.1 })
    public finishLightCurtainDuration: number = 1.2;

    @property({ type: Color, displayName: '光幕颜色' })
    public finishLightCurtainColor: Color = new Color(20, 175, 255, 225);

    @property({ type: Color, displayName: '光幕外层深色' })
    public finishLightCurtainOuterColor: Color = new Color(10, 55, 235, 190);

    @property({ type: Color, displayName: '光幕内层高光色' })
    public finishLightCurtainHighlightColor: Color = new Color(190, 250, 255, 245);

    @property({ type: CCFloat, displayName: '光幕厚度', min: 0.01, max: 0.5 })
    public finishLightCurtainThickness: number = 0.22;

    @property({ type: CCFloat, displayName: '水幕浓度（0-1）', min: 0.1, max: 1 })
    public finishLightCurtainDensity: number = 0.9;

    @property({ type: CCFloat, displayName: '光幕左右扩展宽度', min: 0 })
    public finishLightCurtainWidthPadding: number = 0.65;

    @property({ type: CCFloat, displayName: '光幕高度', min: 0.1 })
    public finishLightCurtainHeight: number = 3.2;

    @property({ type: CCFloat, displayName: '光幕离地高度', min: 0 })
    public finishLightCurtainGroundOffset: number = 0.05;

    @property({ type: CCInteger, displayName: '光幕流光数量', min: 1, max: 12 })
    public finishLightBandCount: number = 6;

    @property({ type: CCFloat, displayName: '光幕流光速度', min: 0.1 })
    public finishLightBandSpeed: number = 2.8;

    @property({ type: CCInteger, displayName: '光幕漂浮光点数量', min: 0, max: 24 })
    public finishLightParticleCount: number = 12;

    @property({ type: CCInteger, displayName: '每面纵向亮纹数量', min: 0, max: 12 })
    public finishLightStreakCount: number = 5;

    @property({ type: AudioClip, displayName: '完成音效（为空时播放升级音效）' })
    public finishAudioClip: AudioClip = null;

    @property({ type: CCFloat, displayName: '完成音效音量（0-1）', min: 0, max: 1 })
    public finishAudioVolume: number = 0.8;

    @property({ type: CCBoolean, displayName: '保留滑块Z偏移', tooltip: '开启后，初始化时会保留资源里滑块相对起始齿条的 Z 轴偏移。当前默认关闭，滑块直接放到齿条前沿。' })
    public keepSliderZOffset: boolean = false;

    @property({ type: CCFloat, displayName: '手动滑块Z偏移', tooltip: '关闭“保留滑块Z偏移”时生效。滑块移动目标会在齿条 Z 位置基础上额外加这个偏移。' })
    public sliderOffsetZ: number = 0;

    @property({ type: CCBoolean, displayName: '反向滑块移动Z', tooltip: '只反转滑块沿 Z 轴的移动方向，不影响齿条从哪一端闭合。当前默认关闭，滑块跟随 Z 最大端顺序。' })
    public reverseSliderMoveZ: boolean = false;

    @property({ type: CCFloat, displayName: '子弹锁定范围X', tooltip: '玩家进入该拉链左右 X 范围后，子弹才会锁定滑块；玩家在中路时不锁定。' })
    public bulletLockRangeX: number = 2.5;

    @property({ type: CCFloat, displayName: '锁定瞄准缩放', tooltip: '子弹锁定后，实际瞄准点落在滑块可受击范围内的比例。1=完整范围，0.92=略窄一点。' })
    public bulletAimShrink: number = 0.92;

    @property({ type: CCFloat, displayName: '锁定前沿深度比例', tooltip: '锁定滑块后，只在朝玩家这一侧前沿带内分布瞄准点。0.25=只用前25%深度，0.5=前半段。' })
    public bulletAimFrontDepthRatio: number = 0.35;

    @property({ type: CCFloat, displayName: '受击区域Z偏移', tooltip: '只调整子弹锁定/碰撞中心，不移动滑块模型。负值通常是往玩家方向提前，正值是往远离玩家方向延后。' })
    public hitAreaOffsetZ: number = -0.18;

    @property({ type: CCBoolean, displayName: '使用滑块模型中心', tooltip: '开启后用滑块模型的渲染包围盒中心作为受击中心，避免滑块节点锚点偏后导致子弹穿过模型后才命中。' })
    public useCubeBoundsHitCenter: boolean = true;

    @property({ type: CCFloat, displayName: '滑块命中补偿X', tooltip: '在滑块模型包围盒半宽基础上额外补一点 X，减少子弹贴边穿过。' })
    public sliderHitPaddingX: number = 0.08;

    @property({ type: CCFloat, displayName: '滑块命中补偿Z', tooltip: '在滑块模型包围盒半深基础上额外补一点 Z，减少子弹沿前后方向漏判。' })
    public sliderHitPaddingZ: number = 0.18;

    @property({ type: CCFloat, displayName: '滑块厚度对齐偏移', tooltip: '滑块定位时，用模型包围盒中心再向厚的一侧偏移一点来对齐齿条位置。0=模型中心，0.2=向厚侧偏移 20% 半厚度。' })
    public sliderThickCenterBias: number = 0.2;

    private teeth: Node[] = [];
    private toothStartPos: Vec3[] = [];
    private toothClosedPos: Vec3[] = [];
    private pairProgressList: number[] = [];
    private toothIndex: number = 0;
    private pairIndex: number = 0;
    private pairCount: number = 0;
    private stepHitCount: number = 0;
    private smoothHitCount: number = 0;
    private cubeStartScale: Vec3 = new Vec3(1, 1, 1);
    private cubeStartPos: Vec3 = new Vec3();
    private hasCubeStartData: boolean = false;
    private pullRingRootStartWorldPos: Vec3 = new Vec3();
    private pullRingRootStartEuler: Vec3 = new Vec3();
    private pullRingTailStartEuler: Vec3 = new Vec3();
    private hasPullRingStartData: boolean = false;
    private pullRingLoopStepIndex: number = 0;
    private pullRingSpringActive: boolean = false;
    private pullRingSpringRootAngleX: number = 0;
    private pullRingSpringRootAngleY: number = 0;
    private pullRingSpringRootVelX: number = 0;
    private pullRingSpringRootVelY: number = 0;
    private pullRingSpringTailAngleX: number = 0;
    private pullRingSpringTailAngleY: number = 0;
    private pullRingSpringTailVelX: number = 0;
    private pullRingSpringTailVelY: number = 0;
    private tempPullRingRootEuler: Vec3 = new Vec3();
    private tempPullRingTailEuler: Vec3 = new Vec3();
    private sliderLastTargetPos: Vec3 = new Vec3();
    private tempForwardSliderTargetPos: Vec3 = new Vec3();
    private sliderForwardZSign: number = 0;
    private pullRingTailTweenRandomPhase: number = 0;
    private pullRingTailTweenRandomSwingScale: number = 1;
    private pullRingTailTweenRandomLiftScale: number = 1;
    private runtimeSliderOffsetZ: number = 0;
    private tempLockAimPos: Vec3 = new Vec3();
    private tempCollisionWorldPos: Vec3 = new Vec3();
    private tempSliderTargetPos: Vec3 = new Vec3();
    private tempSmoothSliderFromPos: Vec3 = new Vec3();
    private tempSmoothSliderToPos: Vec3 = new Vec3();
    private tempSmoothSliderTargetPos: Vec3 = new Vec3();
    private tempWorldPos: Vec3 = new Vec3();
    private tempSliderVisualCenterWorldPos: Vec3 = new Vec3();
    private tempSliderVisualCenterParentPos: Vec3 = new Vec3();
    private tempCubeBoundsHalfExtents: Vec3 = new Vec3();
    private cubeMeshRenderers: MeshRenderer[] = [];
    private finishLightCurtainRoot: Node = null;
    private finishLightCurtainMesh: Mesh = null;
    private finishLightCurtainMaterials: { material: Material, alpha: number, tint: Color, water: boolean }[] = [];
    private finishLightCurtainEffect: EffectAsset = null;
    private finishLightCurtainEffectLoading: boolean = false;
    private finishLightBandNodes: Node[] = [];
    private finishLightParticleNodes: { node: Node, phase: number, speed: number, size: number, x: number, z: number }[] = [];
    private finishLightCurtainTime: number = 0;
    private finishLightCurtainLength: number = 0;
    private finishLightCurtainWidth: number = 0;
    private finishLightCurtainHeightRuntime: number = 0;
    private originalToothPositions: Map<Node, Vec3> = new Map();
    private closeCenter: number = 0;
    private animating: boolean = false;
    private finished: boolean = false;
    private registered: boolean = false;
    public get hitNode() {
        return this.cube ?? super.hitNode;
    }

    public getCollisionWorldPosition(out: Vec3 = this.tempCollisionWorldPos): Vec3 {
        this.refreshCollisionSizeFromBounds();
        const hitNode = this.hitNode;
        const center = hitNode?.worldPosition ?? this.node.worldPosition;
        if (this.useCubeBoundsHitCenter && this.setCubeBoundsCenter(out)) {
            out.z += this.hitAreaOffsetZ;
            return out;
        }
        return out.set(center.x, center.y, center.z + this.hitAreaOffsetZ);
    }

    public getPropStartZ(): number {
        const count = this.nodeCount > 0 ? this.nodeCount : this.getAuthoredSegmentCount();
        if (this.teeth.length > 0 || this.teethNodes.length > 0 || this.lalianRoot) {
            const authoredTeeth = this.teeth.length > 0 ? this.teeth : this.collectTeeth();
            let minZ = Number.POSITIVE_INFINITY;
            let maxZ = Number.NEGATIVE_INFINITY;
            for (let i = 0; i < authoredTeeth.length && (this.nodeCount <= 0 || i < this.nodeCount); i++) {
                const tooth = authoredTeeth[i];
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

    public getWorldZRange(out: Vec3): boolean {
        if (!this.cube) {
            return false;
        }
        const authoredTeeth = this.teeth.length > 0 ? this.teeth : this.collectTeeth();
        let minZ = Number.POSITIVE_INFINITY;
        let maxZ = Number.NEGATIVE_INFINITY;
        const count = this.nodeCount > 0 ? Math.min(this.nodeCount, authoredTeeth.length) : authoredTeeth.length;
        for (let i = 0; i < count; i++) {
            const tooth = authoredTeeth[i];
            if (!tooth) {
                continue;
            }
            const z = tooth.worldPosition.z;
            minZ = Math.min(minZ, z);
            maxZ = Math.max(maxZ, z);
        }
        if (minZ === Number.POSITIVE_INFINITY || maxZ === Number.NEGATIVE_INFINITY) {
            const centerNode = this.lalianRoot ?? this.cube;
            if (!centerNode) {
                return false;
            }
            const halfZ = Math.max(0, this.getPropStartZ()) * 0.5;
            const centerZ = centerNode.worldPosition.z;
            out.set(centerZ - halfZ, centerZ + halfZ, 0);
            return halfZ > 0;
        }
        out.set(minZ, maxZ, 0);
        return true;
    }

    public Hit(damage: number): number {
        if (this.animating && !this.finished) {
            return this.MaxHp > 0 ? this.curHp / this.MaxHp : 0;
        }
        if (this.finished) {
            return 0;
        }
        return super.Hit(1);
    }

    public canLockBulletFromWorldX(worldX: number): boolean {
        if (this.finished || !this.cube || !this.cube.active || !this.cube.activeInHierarchy) {
            return false;
        }
        const centerNode = this.lalianRoot ?? this.cube ?? this.node;
        return Math.abs(worldX - centerNode.worldPosition.x) <= this.bulletLockRangeX;
    }

    public getLockAimWorldPosition(fromPos: Vec3, out: Vec3 = this.tempLockAimPos): Vec3 {
        this.refreshCollisionSizeFromBounds();
        const center = this.getCollisionWorldPosition(out);
        const shrink = Math.max(0.1, Math.min(1, this.bulletAimShrink));
        const halfX = Math.max(0.02, this.collisionHalfX * shrink);
        const halfZ = Math.max(0.02, this.collisionHalfZ * shrink);
        const baseX = Math.min(center.x + halfX, Math.max(center.x - halfX, fromPos.x));
        const spreadSeed = fromPos.x * 12.9898 + fromPos.z * 78.233;
        const spreadX = (this.sampleAimSpread01(spreadSeed) - 0.5) * halfX * 0.9;
        const x = Math.min(center.x + halfX, Math.max(center.x - halfX, baseX + spreadX));
        const frontRatio = Math.max(0.05, Math.min(1, this.bulletAimFrontDepthRatio));
        const fromFront = fromPos.z <= center.z;
        const frontZ = fromFront ? center.z - halfZ : center.z + halfZ;
        const depthBand = Math.max(0.02, halfZ * frontRatio);
        const depthT = this.sampleAimSpread01(spreadSeed + 17.371);
        const z = fromFront
            ? frontZ + depthBand * depthT
            : frontZ - depthBand * depthT;
        return out.set(x, center.y, z);
    }

    protected start(): void {
        this.initGate();
    }

    protected onDestroy(): void {
        this.unregisterTarget();
        for (let i = 0; i < this.finishLightCurtainMaterials.length; i++) {
            this.finishLightCurtainMaterials[i].material.destroy();
        }
        this.finishLightCurtainMaterials.length = 0;
        this.finishLightCurtainMesh?.destroy();
        this.finishLightCurtainMesh = null;
    }

    protected _update(dt: number): void {
        this.updatePullRingSpring(dt);
        this.updateFinishLightCurtain(dt);
    }

    public initGate(): void {
        this.preloadFinishLightCurtainEffect();
        this.resetFinishFeedback();
        this.setupColliderTag();
        this.prepareLalian();
        if (this.teeth.length <= 0 || !this.cube) {
            return;
        }
        this.prepareCollisionSize();

        const totalHp = this.getSmoothTotalHitCount();
        this.MaxHp = totalHp;
        this.curHp = totalHp;
        this.isDestroy = false;
        this.finished = false;
        this.animating = false;
        this.updateHpLabel(totalHp);
        this.registerTarget();
    }

    private prepareCollisionSize(): void {
        this.refreshCollisionSizeFromBounds();
    }

    private refreshCollisionSizeFromBounds(): void {
        const minHalfX = 0.45;
        const minHalfZ = 0.32;
        let targetHalfX = Math.max(this.collisionHalfX, minHalfX);
        let targetHalfZ = Math.max(this.collisionHalfZ, minHalfZ);
        if (this.tryGetCubeBoundsHalfExtents(this.tempCubeBoundsHalfExtents)) {
            targetHalfX = Math.max(targetHalfX, this.tempCubeBoundsHalfExtents.x + Math.max(0, this.sliderHitPaddingX));
            targetHalfZ = Math.max(targetHalfZ, this.tempCubeBoundsHalfExtents.z + Math.max(0, this.sliderHitPaddingZ));
        }
        this.collisionHalfX = targetHalfX;
        this.collisionHalfZ = targetHalfZ;
    }

    protected damage(power: number): void {
        if (this.animating || this.finished) {
            this.curHp = Math.max(1, this.curHp);
            return;
        }
        this.playHitStep();
    }

    protected die(): void {
    }

    public repelBattleTarget(target: Node, reoel: number): void {
    }

    private playHitStep(): void {
        const animDuration = this.getHitAnimDuration();
        const totalHits = this.getSmoothTotalHitCount();
        this.smoothHitCount = Math.min(totalHits, this.smoothHitCount + 1);
        const linearProgress = totalHits > 0 ? this.smoothHitCount / totalHits : 1;
        const smoothProgress = this.getSmoothWholeProgress(linearProgress);
        const sliderTarget = this.getSmoothSliderTargetPos(smoothProgress);
        const targetPos = sliderTarget ? this.getForwardOnlySliderTargetPos(sliderTarget) : null;

        if (!targetPos) {
            this.completeGate();
            return;
        }

        this.animating = true;
        AudioManager.inst.playOneShot(SoundEnum.Sound_tire_hit, 0.4, 0.08);
        if (this.hpLabel?.node) {
            TweenTool.scaleShake(this.hpLabel.node);
        }
        this.flashRed();
        this.playPullRingSwing();

        this.applyWholeSmoothProgress(smoothProgress, true, animDuration);

        const remainHits = Math.max(0, totalHits - this.smoothHitCount);
        this.curHp = remainHits;
        this.updateHpLabel(remainHits);

        if (this.cube) {
            Tween.stopAllByTarget(this.cube);
            tween(this.cube)
                .to(animDuration, { position: targetPos }, { easing: 'linear' })
                .call(() => {
                    this.finishHitStep();
                })
                .start();
        } else {
            this.scheduleOnce(() => {
                this.finishHitStep();
            }, animDuration);
        }
    }

    private finishHitStep(): void {
        this.animating = false;
        if (this.smoothHitCount >= this.getSmoothTotalHitCount()) {
            this.completeGate();
        }
    }

    private completeGate(): void {
        if (this.finished) {
            return;
        }
        this.finished = true;
        this.animating = false;
        this.curHp = 1;
        this.isDestroy = true;
        this.unregisterTarget();
        this.updateHpLabel(0);
        this.resetPullRingTailToStart();
        this.playFinishFeedback();

        const emitFinish = () => {
            const info = { moveCount: this.moveCount };
            EventManager.instance.emit(EventType.PROP_ARMS_DIE, info);
            this.node.emit(EventType.PROP_ARMS_DIE, info);
        };

        if (!this.cube) {
            emitFinish();
            return;
        }

        Tween.stopAllByTarget(this.cube);
        tween(this.cube)
            .to(this.cubeHideTime, { scale: Vec3.ZERO }, { easing: 'sineIn' })
            .call(() => {
                this.cube.active = false;
                this.cube.setScale(this.cubeStartScale);
                emitFinish();
            })
            .start();
    }

    private resetFinishFeedback(): void {
        this.finishLightCurtainTime = 0;
        if (this.finishLightCurtainRoot) {
            Tween.stopAllByTarget(this.finishLightCurtainRoot);
            this.finishLightCurtainRoot.active = false;
        }
    }

    private playFinishFeedback(): void {
        const volume = Math.max(0, Math.min(1, this.finishAudioVolume));
        AudioManager.inst.playOneShot(this.finishAudioClip ?? SoundEnum.Sound_Ship_UpLevel, volume);

        if (!this.enableFinishLightCurtain) {
            return;
        }

        this.playFinishLightCurtainVisual();
    }

    private playFinishLightCurtainVisual(): void {
        if (this.finishLightCurtainEffectLoading) {
            return;
        }

        this.ensureFinishLightCurtain();
        if (!this.finishLightCurtainRoot) {
            return;
        }
        this.finishLightCurtainTime = 0;
        this.finishLightCurtainRoot.active = true;
        this.finishLightCurtainRoot.setScale(1, 0.05, 1);
        Tween.stopAllByTarget(this.finishLightCurtainRoot);
        tween(this.finishLightCurtainRoot)
            .to(0.16, { scale: Vec3.ONE }, { easing: 'quadOut' })
            .start();
    }

    private ensureFinishLightCurtain(): void {
        if (this.finishLightCurtainRoot || !this.lalianRoot) {
            return;
        }

        let minX = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let minZ = Number.POSITIVE_INFINITY;
        let maxZ = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < this.teeth.length; i++) {
            const pos = this.teeth[i].position;
            minX = Math.min(minX, pos.x);
            maxX = Math.max(maxX, pos.x);
            minZ = Math.min(minZ, pos.z);
            maxZ = Math.max(maxZ, pos.z);
        }
        if (!Number.isFinite(minX) || !Number.isFinite(minZ)) {
            return;
        }

        const width = Math.max(1, maxX - minX + Math.max(0, this.finishLightCurtainWidthPadding) * 2);
        const length = Math.max(1, maxZ - minZ + this.nodeSpacingZ);
        const height = Math.max(0.1, this.finishLightCurtainHeight);
        const centerX = (minX + maxX) * 0.5;
        const centerZ = (minZ + maxZ) * 0.5;
        const groundY = (this.cube?.position.y ?? 0) + Math.max(0, this.finishLightCurtainGroundOffset);

        this.finishLightCurtainLength = length;
        this.finishLightCurtainWidth = width;
        this.finishLightCurtainHeightRuntime = height;
        this.finishLightCurtainMesh = utils.createMesh({
            positions: [-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0],
            normals: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
            uvs: [0, 0, 1, 0, 1, 1, 0, 1],
            indices: [0, 1, 2, 0, 2, 3],
        });

        const root = new Node('LalianFinishLightCurtain_Runtime');
        root.layer = this.lalianRoot.layer;
        this.lalianRoot.addChild(root);
        root.setPosition(centerX, groundY, centerZ);
        this.finishLightCurtainRoot = root;

        const thickness = Math.max(0.01, Math.min(0.5, this.finishLightCurtainThickness));
        const mainColor = this.finishLightCurtainColor;
        const outerColor = this.finishLightCurtainOuterColor;
        const highlightColor = this.finishLightCurtainHighlightColor;

        this.createFinishLightPlane(root, '光幕左墙中层', new Vec3(-width * 0.5, height * 0.5, 0), new Vec3(0, 90, 0), new Vec3(length, height, 1), 82, mainColor, true);
        this.createFinishLightPlane(root, '光幕左墙外层', new Vec3(-width * 0.5 - thickness, height * 0.5, 0), new Vec3(0, 90, 0), new Vec3(length, height * 0.96, 1), 62, outerColor);
        this.createFinishLightPlane(root, '光幕左墙内层', new Vec3(-width * 0.5 + thickness * 0.48, height * 0.5, 0), new Vec3(0, 90, 0), new Vec3(length * 0.98, height * 0.9, 1), 42, highlightColor);
        this.createFinishLightPlane(root, '光幕右墙中层', new Vec3(width * 0.5, height * 0.5, 0), new Vec3(0, 90, 0), new Vec3(length, height, 1), 82, mainColor, true);
        this.createFinishLightPlane(root, '光幕右墙外层', new Vec3(width * 0.5 + thickness, height * 0.5, 0), new Vec3(0, 90, 0), new Vec3(length, height * 0.96, 1), 62, outerColor);
        this.createFinishLightPlane(root, '光幕右墙内层', new Vec3(width * 0.5 - thickness * 0.48, height * 0.5, 0), new Vec3(0, 90, 0), new Vec3(length * 0.98, height * 0.9, 1), 42, highlightColor);
        this.createFinishLightPlane(root, '光幕末端中层', new Vec3(0, height * 0.5, length * 0.5), Vec3.ZERO, new Vec3(width, height, 1), 58, mainColor, true);
        this.createFinishLightPlane(root, '光幕末端外层', new Vec3(0, height * 0.5, length * 0.5 + thickness), Vec3.ZERO, new Vec3(width * 1.04, height * 0.96, 1), 46, outerColor);
        this.createFinishLightPlane(root, '光幕末端内层', new Vec3(0, height * 0.5, length * 0.5 - thickness * 0.48), Vec3.ZERO, new Vec3(width * 0.96, height * 0.9, 1), 34, highlightColor);
        this.createFinishLightPlane(root, '光幕前端中层', new Vec3(0, height * 0.5, -length * 0.5), Vec3.ZERO, new Vec3(width, height, 1), 58, mainColor, true);
        this.createFinishLightPlane(root, '光幕前端外层', new Vec3(0, height * 0.5, -length * 0.5 - thickness), Vec3.ZERO, new Vec3(width * 1.04, height * 0.96, 1), 46, outerColor);
        this.createFinishLightPlane(root, '光幕前端内层', new Vec3(0, height * 0.5, -length * 0.5 + thickness * 0.48), Vec3.ZERO, new Vec3(width * 0.96, height * 0.9, 1), 34, highlightColor);

        const baseGlowHeight = Math.max(0.22, height * 0.13);
        this.createFinishLightPlane(root, '左墙底部浓光', new Vec3(-width * 0.5 + 0.008, baseGlowHeight * 0.5, 0), new Vec3(0, 90, 0), new Vec3(length, baseGlowHeight, 1), 215, highlightColor);
        this.createFinishLightPlane(root, '右墙底部浓光', new Vec3(width * 0.5 - 0.008, baseGlowHeight * 0.5, 0), new Vec3(0, 90, 0), new Vec3(length, baseGlowHeight, 1), 215, highlightColor);
        this.createFinishLightPlane(root, '末端底部浓光', new Vec3(0, baseGlowHeight * 0.5, length * 0.5 - 0.008), Vec3.ZERO, new Vec3(width, baseGlowHeight, 1), 205, highlightColor);
        this.createFinishLightPlane(root, '前端底部浓光', new Vec3(0, baseGlowHeight * 0.5, -length * 0.5 + 0.008), Vec3.ZERO, new Vec3(width, baseGlowHeight, 1), 205, highlightColor);

        const borderWidth = Math.max(0.035, Math.min(0.1, width * 0.035));
        this.createFinishLightPlane(root, '地面左边框', new Vec3(-width * 0.5, 0.018, 0), new Vec3(90, 0, 0), new Vec3(borderWidth, length, 1), 230);
        this.createFinishLightPlane(root, '地面右边框', new Vec3(width * 0.5, 0.018, 0), new Vec3(90, 0, 0), new Vec3(borderWidth, length, 1), 230);
        this.createFinishLightPlane(root, '地面前边框', new Vec3(0, 0.018, -length * 0.5), new Vec3(90, 0, 0), new Vec3(width, borderWidth, 1), 230);
        this.createFinishLightPlane(root, '地面后边框', new Vec3(0, 0.018, length * 0.5), new Vec3(90, 0, 0), new Vec3(width, borderWidth, 1), 230);

        const cornerWidth = Math.max(0.025, borderWidth * 0.55);
        for (let xIndex = -1; xIndex <= 1; xIndex += 2) {
            for (let zIndex = -1; zIndex <= 1; zIndex += 2) {
                this.createFinishLightPlane(
                    root,
                    `转角光柱_${xIndex}_${zIndex}`,
                    new Vec3(width * 0.5 * xIndex, height * 0.5, length * 0.5 * zIndex),
                    Vec3.ZERO,
                    new Vec3(cornerWidth, height, 1),
                    235
                );
            }
        }

        const streakCount = Math.max(0, Math.min(12, Math.floor(this.finishLightStreakCount)));
        for (let i = 0; i < streakCount; i++) {
            const z = length * ((i + 1) / (streakCount + 1) - 0.5);
            const streakHeight = height * (0.42 + this.finishLightRandom01(i * 3.17 + 1) * 0.48);
            const streakWidth = 0.018 + this.finishLightRandom01(i * 5.31 + 2) * 0.045;
            const y = streakHeight * 0.5 + this.finishLightRandom01(i * 7.73 + 3) * height * 0.08;
            this.createFinishLightPlane(root, `左墙亮纹_${i + 1}`, new Vec3(-width * 0.5 - 0.006, y, z), new Vec3(0, 90, 0), new Vec3(streakWidth, streakHeight, 1), 150);
            this.createFinishLightPlane(root, `右墙亮纹_${i + 1}`, new Vec3(width * 0.5 + 0.006, y, z), new Vec3(0, 90, 0), new Vec3(streakWidth, streakHeight, 1), 150);

            const x = width * ((i + 1) / (streakCount + 1) - 0.5);
            this.createFinishLightPlane(root, `末端亮纹_${i + 1}`, new Vec3(x, y, length * 0.5 + 0.006), Vec3.ZERO, new Vec3(streakWidth, streakHeight, 1), 135);
        }

        const bandCount = Math.max(1, Math.min(12, Math.floor(this.finishLightBandCount)));
        for (let i = 0; i < bandCount; i++) {
            const band = this.createFinishLightPlane(root, `流光_${i + 1}`, Vec3.ZERO, new Vec3(90, 0, 0), new Vec3(width * 0.92, 0.07 + (i % 2) * 0.035, 1), 210);
            this.finishLightBandNodes.push(band);
        }

        const particleCount = Math.max(0, Math.min(24, Math.floor(this.finishLightParticleCount)));
        for (let i = 0; i < particleCount; i++) {
            const x = (this.finishLightRandom01(i * 11.41 + 4) - 0.5) * width * 0.86;
            const z = (this.finishLightRandom01(i * 13.37 + 5) - 0.5) * length * 0.92;
            const size = 0.045 + this.finishLightRandom01(i * 17.13 + 6) * 0.085;
            const particle = this.createFinishLightPlane(root, `漂浮光点_${i + 1}`, new Vec3(x, 0, z), Vec3.ZERO, new Vec3(size, size, 1), 235);
            this.finishLightParticleNodes.push({
                node: particle,
                phase: this.finishLightRandom01(i * 19.91 + 7),
                speed: 0.55 + this.finishLightRandom01(i * 23.17 + 8) * 0.9,
                size,
                x,
                z,
            });
        }
        root.active = false;
    }

    private finishLightRandom01(seed: number): number {
        const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
        return value - Math.floor(value);
    }

    private preloadFinishLightCurtainEffect(): void {
        if (this.finishLightCurtainEffect || this.finishLightCurtainEffectLoading) {
            return;
        }
        this.finishLightCurtainEffectLoading = true;
        resources.load('Effect/LalianWaterCurtain', EffectAsset, (error, asset) => {
            this.finishLightCurtainEffectLoading = false;
            if (!error && asset?.isValid) {
                this.finishLightCurtainEffect = asset;
            }
            if (this.finished && this.enableFinishLightCurtain && !this.finishLightCurtainRoot) {
                this.playFinishLightCurtainVisual();
            }
        });
    }

    private createFinishLightPlane(parent: Node, name: string, position: Vec3, euler: Vec3, scale: Vec3, alpha: number, tint: Color = null, useWater: boolean = false): Node {
        const plane = new Node(name);
        plane.layer = parent.layer;
        parent.addChild(plane);
        plane.setPosition(position);
        plane.setRotationFromEuler(euler);
        plane.setScale(scale);

        const renderer = plane.addComponent(MeshRenderer);
        renderer.mesh = this.finishLightCurtainMesh;
        renderer.shadowCastingMode = MeshRenderer.ShadowCastingMode.OFF;
        const material = new Material();
        const color = tint ?? this.finishLightCurtainColor;
        const water = useWater && !!this.finishLightCurtainEffect;
        if (water) {
            material.initialize({ effectAsset: this.finishLightCurtainEffect });
            material.setProperty('mainColor', this.finishLightCurtainColor);
            material.setProperty('deepColor', this.finishLightCurtainOuterColor);
            material.setProperty('highlightColor', this.finishLightCurtainHighlightColor);
            material.setProperty('flowSpeed', Math.max(0.1, this.finishLightBandSpeed) * 0.62);
            material.setProperty('flowDensity', 7);
            material.setProperty('opacity', Math.max(0.1, Math.min(1, this.finishLightCurtainDensity)));
        } else {
            material.initialize({ effectName: 'builtin-unlit', technique: 3 });
            material.setProperty('mainColor', new Color(color.r, color.g, color.b, Math.round(alpha * color.a / 255)));
        }
        renderer.setSharedMaterial(material, 0);
        this.finishLightCurtainMaterials.push({ material, alpha, tint: color.clone(), water });
        return plane;
    }

    private updateFinishLightCurtain(dt: number): void {
        const root = this.finishLightCurtainRoot;
        if (!root?.active) {
            return;
        }
        this.finishLightCurtainTime += Math.max(0, dt);
        const duration = Math.max(0.1, this.finishLightCurtainDuration);
        const progress = this.finishLightCurtainTime / duration;
        if (progress >= 1) {
            root.active = false;
            return;
        }

        const fade = progress < 0.72 ? 1 : Math.max(0, (1 - progress) / 0.28);
        const pulse = 0.88 + Math.sin(this.finishLightCurtainTime * 13) * 0.12;
        const density = Math.max(0.1, Math.min(1, this.finishLightCurtainDensity));
        for (let i = 0; i < this.finishLightCurtainMaterials.length; i++) {
            const entry = this.finishLightCurtainMaterials[i];
            const tint = entry.tint;
            if (entry.water) {
                entry.material.setProperty('opacity', density * fade * pulse);
            } else {
                const thicknessBoost = 0.8 + density * 0.55;
                const alpha = Math.round(Math.min(255, entry.alpha * (tint.a / 255) * fade * pulse * thicknessBoost));
                entry.material.setProperty('mainColor', new Color(tint.r, tint.g, tint.b, alpha));
            }
        }

        const speed = Math.max(0.1, this.finishLightBandSpeed);
        const length = Math.max(0.1, this.finishLightCurtainLength);
        for (let i = 0; i < this.finishLightBandNodes.length; i++) {
            const phase = (this.finishLightCurtainTime * speed / length + i / this.finishLightBandNodes.length) % 1;
            this.finishLightBandNodes[i].setPosition(0, 0.025 + (i % 2) * 0.018, length * (0.5 - phase));
        }

        const height = Math.max(0.1, this.finishLightCurtainHeightRuntime);
        const width = Math.max(0.1, this.finishLightCurtainWidth);
        for (let i = 0; i < this.finishLightParticleNodes.length; i++) {
            const particle = this.finishLightParticleNodes[i];
            const rise = (particle.phase + this.finishLightCurtainTime * particle.speed / height) % 1;
            const sway = Math.sin(this.finishLightCurtainTime * (2.5 + particle.speed) + i * 1.71) * width * 0.025;
            particle.node.setPosition(particle.x + sway, height * (0.08 + rise * 0.84), particle.z);
            const sparkle = 0.65 + Math.sin(this.finishLightCurtainTime * 9 + i * 2.13) * 0.35;
            const scale = particle.size * (0.65 + sparkle * 0.55);
            particle.node.setScale(scale, scale, 1);
        }
    }

    private prepareLalian(): void {
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

        const collectedTeeth = this.collectTeeth();
        const desiredCount = this.nodeCount > 0 ? Math.min(this.nodeCount, collectedTeeth.length) : collectedTeeth.length;
        for (let i = 0; i < collectedTeeth.length; i++) {
            const tooth = collectedTeeth[i];
            if (!tooth) {
                continue;
            }
            tooth.active = i < desiredCount;
            if (i >= desiredCount) {
                continue;
            }
            const originalPos = this.getOriginalToothPosition(tooth);
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

    private collectTeeth(): Node[] {
        const result: Node[] = [];
        if (this.teethNodes.length > 0) {
            for (let i = 0; i < this.teethNodes.length; i++) {
                const tooth = this.teethNodes[i];
                if (tooth && tooth !== this.cube) {
                    result.push(tooth);
                }
            }
        } else if (this.autoCollectTeeth && this.lalianRoot) {
            for (let i = 0; i < this.lalianRoot.children.length; i++) {
                const child = this.lalianRoot.children[i];
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

    private orderTeethFromFarthestSide(teeth: Node[]): void {
        if (!this.cube || teeth.length <= 1) {
            return;
        }
        const firstZ = this.getToothZInSliderParent(teeth[0]);
        const lastZ = this.getToothZInSliderParent(teeth[teeth.length - 1]);
        const sliderZ = this.cube.position.z;
        if (Math.abs(sliderZ - lastZ) > Math.abs(sliderZ - firstZ)) {
            teeth.reverse();
        }
    }

    private orderTeethFromSliderSide(teeth: Node[]): void {
        if (!this.cube || teeth.length <= 1) {
            return;
        }
        const firstZ = this.getToothZInSliderParent(teeth[0]);
        const lastZ = this.getToothZInSliderParent(teeth[teeth.length - 1]);
        const sliderZ = this.cube.position.z;
        if (Math.abs(sliderZ - lastZ) < Math.abs(sliderZ - firstZ)) {
            teeth.reverse();
        }
    }

    private getToothZInSliderParent(tooth: Node): number {
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

    private getAuthoredSegmentCount(): number {
        return this.collectTeeth().length;
    }

    private applyInitialProgress(): void {
        this.smoothHitCount = 0;
        this.applyWholeSmoothProgress(0, false);
        this.stepHitCount = 0;
        const targetPos = this.getSmoothSliderTargetPos(0);
        if (this.cube && targetPos) {
            const startX = targetPos.x;
            const startY = targetPos.y;
            const startZ = targetPos.z;
            const endTargetPos = this.getSmoothSliderTargetPos(1);
            this.sliderForwardZSign = endTargetPos ? Math.sign(endTargetPos.z - startZ) : 0;
            this.sliderLastTargetPos.set(startX, startY, startZ);
            this.cube.setPosition(this.sliderLastTargetPos);
        }
    }

    private getForwardOnlySliderTargetPos(targetPos: Vec3): Vec3 {
        this.tempForwardSliderTargetPos.set(targetPos);
        if (this.sliderForwardZSign !== 0) {
            const zDelta = this.tempForwardSliderTargetPos.z - this.sliderLastTargetPos.z;
            if (zDelta * this.sliderForwardZSign < 0) {
                this.tempForwardSliderTargetPos.z = this.sliderLastTargetPos.z;
            }
        }
        this.sliderLastTargetPos.set(this.tempForwardSliderTargetPos);
        return this.tempForwardSliderTargetPos;
    }

    private applyWholeSmoothProgress(progress: number, useTween: boolean, duration: number = this.getHitAnimDuration()): void {
        if (this.pairCount <= 0) {
            return;
        }
        const clampedProgress = this.getClampedProgress(progress);
        const closedPairCount = Math.max(0, Math.min(this.getInitialClosedPairCount(), this.pairCount));
        const movingPairCount = Math.max(1, this.pairCount - closedPairCount);
        const wholePairProgress = closedPairCount + movingPairCount * clampedProgress;
        const currentPairIndex = Math.max(closedPairCount, Math.min(this.pairCount - 1, Math.floor(wholePairProgress)));
        const pairT = clampedProgress >= 1 ? 1 : this.getClampedProgress(wholePairProgress - currentPairIndex);
        const nextProgress = this.getClampedProgress(this.nextPairInitialProgress);
        const nextNextProgress = this.getClampedProgress(this.nextNextPairInitialProgress);
        for (let i = 0; i < this.pairCount; i++) {
            let pairProgress = 0;
            if (clampedProgress >= 1 || i < currentPairIndex) {
                pairProgress = 1;
            } else if (i === currentPairIndex) {
                pairProgress = nextProgress + (1 - nextProgress) * pairT;
            } else if (i === currentPairIndex + 1) {
                pairProgress = nextNextProgress + (nextProgress - nextNextProgress) * pairT;
            } else if (i === currentPairIndex + 2) {
                pairProgress = nextNextProgress * pairT;
            }
            const clampedPairProgress = this.getClampedProgress(pairProgress);
            const previousPairProgress = this.pairProgressList[i] ?? 0;
            const shouldTweenPair = useTween && clampedPairProgress > previousPairProgress + 0.0001;
            this.applyPairProgress(i, clampedPairProgress, shouldTweenPair, duration);
        }
        this.pairIndex = Math.max(0, Math.min(this.pairCount - 1, Math.floor(wholePairProgress)));
        this.toothIndex = this.getPairStartToothIndex(this.pairIndex);
    }

    private getSmoothSliderTargetPos(progress: number): Vec3 | null {
        if (!this.cube || this.pairCount <= 0) {
            return null;
        }
        const closedPairCount = Math.max(0, Math.min(this.getInitialClosedPairCount(), this.pairCount));
        const movingPairCount = Math.max(1, this.pairCount - closedPairCount);
        const sliderCursor = Math.max(0, Math.min(this.pairCount - 1, closedPairCount - 1 + movingPairCount * this.getClampedProgress(progress)));
        const fromPairIndex = Math.max(0, Math.min(this.pairCount - 1, Math.floor(sliderCursor)));
        const toPairIndex = Math.max(fromPairIndex, Math.min(this.pairCount - 1, fromPairIndex + 1));
        const pairT = this.getClampedProgress(sliderCursor - fromPairIndex);
        const fromTooth = this.getSliderPairLeadTooth(fromPairIndex) ?? this.teeth[0];
        const toTooth = this.getSliderPairLeadTooth(toPairIndex) ?? fromTooth;
        if (!fromTooth || !toTooth) {
            return null;
        }
        this.tempSmoothSliderFromPos.set(this.getSliderTargetPos(fromTooth));
        this.tempSmoothSliderToPos.set(this.getSliderTargetPos(toTooth));
        return this.tempSmoothSliderTargetPos.set(
            this.tempSmoothSliderFromPos.x + (this.tempSmoothSliderToPos.x - this.tempSmoothSliderFromPos.x) * pairT,
            this.tempSmoothSliderFromPos.y + (this.tempSmoothSliderToPos.y - this.tempSmoothSliderFromPos.y) * pairT,
            this.tempSmoothSliderFromPos.z + (this.tempSmoothSliderToPos.z - this.tempSmoothSliderFromPos.z) * pairT,
        );
    }

    private cacheCubeStartData(): void {
        if (this.hasCubeStartData) {
            return;
        }
        this.cubeStartPos.set(this.cube.position);
        this.cubeStartScale.set(this.cube.scale);
        this.hasCubeStartData = true;
    }

    private cacheCubeMeshRenderers(): void {
        this.cubeMeshRenderers.length = 0;
        if (!this.cube) {
            return;
        }
        this.collectMeshRenderers(this.cube, this.cubeMeshRenderers);
    }

    private collectMeshRenderers(node: Node, out: MeshRenderer[]): void {
        const meshRenderer = node.getComponent(MeshRenderer);
        if (meshRenderer) {
            out.push(meshRenderer);
        }
        for (let i = 0; i < node.children.length; i++) {
            this.collectMeshRenderers(node.children[i], out);
        }
    }

    private setCubeBoundsCenter(out: Vec3): boolean {
        return this.setCubeVisualCenter(out, false);
    }

    private sampleAimSpread01(seed: number): number {
        const sinValue = Math.sin(seed) * 43758.5453123;
        return sinValue - Math.floor(sinValue);
    }

    private tryGetCubeBoundsHalfExtents(out: Vec3): boolean {
        let maxHalfX = 0;
        let maxHalfY = 0;
        let maxHalfZ = 0;
        let found = false;
        for (let i = 0; i < this.cubeMeshRenderers.length; i++) {
            const worldBounds = (this.cubeMeshRenderers[i] as any)?.model?.worldBounds;
            const halfExtents = worldBounds?.halfExtents;
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

    private setCubeVisualCenter(out: Vec3, useThickBias: boolean = true): boolean {
        let minX = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;
        let minZ = Number.POSITIVE_INFINITY;
        let maxZ = Number.NEGATIVE_INFINITY;
        let found = false;

        for (let i = 0; i < this.cubeMeshRenderers.length; i++) {
            const worldBounds = (this.cubeMeshRenderers[i] as any)?.model?.worldBounds;
            const center = worldBounds?.center;
            const halfExtents = worldBounds?.halfExtents;
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
        const halfZ = (maxZ - minZ) * 0.5;
        let centerZ = (minZ + maxZ) * 0.5;
        if (useThickBias && this.cube) {
            const anchorZ = this.cube.worldPosition.z;
            const biasDirection = centerZ >= anchorZ ? 1 : -1;
            const bias = Math.max(-1, Math.min(1, this.sliderThickCenterBias));
            centerZ += halfZ * bias * biasDirection;
        }
        out.set(
            (minX + maxX) * 0.5,
            (minY + maxY) * 0.5,
            centerZ,
        );
        return true;
    }

    private preparePullRingHierarchy(): void {
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

    private isNodeUnderParent(node: Node, parent: Node): boolean {
        let cur = node.parent;
        while (cur) {
            if (cur === parent) {
                return true;
            }
            cur = cur.parent;
        }
        return false;
    }

    private cachePullRingStartData(): void {
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

    private resetPullRing(): void {
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

    private resetPullRingTailToStart(): void {
        this.cachePullRingStartData();
        this.resetPullRingSpring();
        if (!this.pullRingTail) {
            return;
        }
        Tween.stopAllByTarget(this.pullRingTail);
        this.pullRingTail.eulerAngles = this.pullRingTailStartEuler;
    }

    private playPullRingSwing(): void {
        this.cachePullRingStartData();
        if (!this.pullRingRoot) {
            return;
        }

        if (this.usePullRingSpringFeedback) {
            this.freezePullRingRootIfNeeded();
            this.kickPullRingSpring();
            return;
        }
        this.resetPullRingSpring();

        const loopStepCount = this.getPullRingLoopStepCount();
        const stepPerHit = this.getPullRingStepPerHit();
        const stepTime = this.getPullRingStepTime();
        const targetSteps: number[] = [];
        for (let i = 1; i <= stepPerHit; i++) {
            targetSteps.push((this.pullRingLoopStepIndex + i) % loopStepCount);
        }
        this.pullRingLoopStepIndex = targetSteps[targetSteps.length - 1];

        if (this.isPullRingRootSpringEnabled()) {
            Tween.stopAllByTarget(this.pullRingRoot);
            let rootTween = tween(this.pullRingRoot);
            for (let i = 0; i < targetSteps.length; i++) {
                rootTween = rootTween.to(stepTime, { eulerAngles: this.getPullRingRootStepEuler(targetSteps[i]) }, { easing: 'sineInOut' });
            }
            rootTween.start();
        } else {
            this.freezePullRingRootIfNeeded();
        }

        this.playPullRingTailJoint(targetSteps, stepTime);
    }

    private playPullRingTailJoint(targetSteps: number[], stepTime: number): void {
        if (!this.pullRingRoot || !this.pullRingTail || !this.isNodeUnderParent(this.pullRingTail, this.pullRingRoot)) {
            return;
        }
        Tween.stopAllByTarget(this.pullRingTail);
        this.randomizePullRingTailTweenSwing();
        let tailTween = tween(this.pullRingTail);
        for (let i = 0; i < targetSteps.length; i++) {
            tailTween = tailTween.to(stepTime, { eulerAngles: this.getPullRingTailStepEuler(targetSteps[i], true) }, { easing: 'sineInOut' });
        }
        tailTween.start();
    }

    private randomizePullRingTailTweenSwing(): void {
        const randomRate = this.getPullRingTailRandomSwingRate();
        if (randomRate <= 0) {
            this.pullRingTailTweenRandomPhase = 0;
            this.pullRingTailTweenRandomSwingScale = 1;
            this.pullRingTailTweenRandomLiftScale = 1;
            return;
        }

        this.pullRingTailTweenRandomPhase = this.randomRange(-Math.PI, Math.PI) * randomRate;
        this.pullRingTailTweenRandomSwingScale = this.randomRange(0, 1 + randomRate);
        this.pullRingTailTweenRandomLiftScale = this.randomRange(0.25, 1 + randomRate);
    }

    private kickPullRingSpring(): void {
        if (!this.pullRingRoot) {
            return;
        }

        Tween.stopAllByTarget(this.pullRingRoot);
        if (this.pullRingTail) {
            Tween.stopAllByTarget(this.pullRingTail);
        }

        const direction = this.getNextPullRingSpringSwingDirection();
        if (this.isPullRingRootSpringEnabled()) {
            const rootRate = this.getPullRingRootSpringRate();
            const rootImpulseY = direction * this.getPullRingSpringRootImpulseY() * rootRate;
            const rootImpulseX = this.getPullRingSpringRootImpulseX() * rootRate;
            this.pullRingSpringRootVelY = this.blendPullRingSpringVelocity(
                this.pullRingSpringRootVelY,
                rootImpulseY,
                this.pullRingSpringRootAngleY,
                -this.getPullRingSpringRootMaxY(),
                this.getPullRingSpringRootMaxY(),
                this.getPullRingSpringRootImpulseY() * rootRate * 1.35,
            );
            this.pullRingSpringRootVelX = this.blendPullRingSpringVelocity(
                this.pullRingSpringRootVelX,
                rootImpulseX,
                this.pullRingSpringRootAngleX,
                -this.getPullRingSpringRootMaxX() * 0.35,
                this.getPullRingSpringRootMaxX(),
                this.getPullRingSpringRootImpulseX() * rootRate * 1.35,
            );
        }
        const tailRandomMaxScale = 1 + this.getPullRingTailRandomSwingRate();
        const tailImpulseY = this.getRandomPullRingTailSpringSwingImpulse(direction);
        const tailImpulseX = this.getRandomPullRingTailSpringLiftImpulse();
        this.pullRingSpringTailVelY = this.blendPullRingSpringVelocity(
            this.pullRingSpringTailVelY,
            tailImpulseY,
            this.pullRingSpringTailAngleY,
            -this.getPullRingSpringTailMaxY(),
            this.getPullRingSpringTailMaxY(),
            this.getPullRingSpringTailImpulseY() * tailRandomMaxScale * 1.35,
        );
        this.pullRingSpringTailVelX = this.blendPullRingSpringVelocity(
            this.pullRingSpringTailVelX,
            tailImpulseX,
            this.pullRingSpringTailAngleX,
            -this.getPullRingSpringTailMaxX() * 0.25,
            this.getPullRingSpringTailMaxX(),
            this.getPullRingSpringTailImpulseX() * tailRandomMaxScale * 1.35,
        );
        this.pullRingSpringActive = true;
        this.applyPullRingSpringEuler();
    }

    private updatePullRingSpring(dt: number): void {
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

        const stepDt = Math.max(0, Math.min(0.033, dt)) * this.getPullRingSwingSpeedScale();
        if (stepDt <= 0) {
            return;
        }

        const rootStiffness = this.getPullRingSpringStiffness();
        const rootDamping = this.getPullRingSpringDamping();
        const tailReturnScale = this.getPullRingSpringTailReturnScale();
        const tailStiffness = rootStiffness * tailReturnScale;
        const tailDamping = rootDamping * Math.sqrt(tailReturnScale);

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

    private applyPullRingSpringEuler(): void {
        this.cachePullRingStartData();
        if (this.pullRingRoot) {
            if (this.isPullRingRootSpringEnabled()) {
                const rootMaxX = this.getPullRingSpringRootMaxX();
                const rootSideLift = this.getPullRingSpringSideLift(this.pullRingSpringRootAngleY, this.getPullRingSpringRootMaxY(), rootMaxX);
                const rootAngleX = this.clampRange(this.pullRingSpringRootAngleX + rootSideLift, -this.getPullRingSpringRootUpMaxAngle(), rootMaxX);
                this.tempPullRingRootEuler.set(
                    this.pullRingRootStartEuler.x + rootAngleX,
                    this.pullRingRootStartEuler.y + this.pullRingSpringRootAngleY,
                    this.pullRingRootStartEuler.z,
                );
                this.pullRingRoot.eulerAngles = this.tempPullRingRootEuler;
            } else {
                this.freezePullRingRootIfNeeded();
            }
        }
        if (this.pullRingTail) {
            const tailMaxX = this.getPullRingSpringTailMaxX();
            const tailSideLift = this.getPullRingSpringSideLift(this.pullRingSpringTailAngleY, this.getPullRingSpringTailMaxY(), tailMaxX);
            const tailAngleX = this.clampRange(this.pullRingSpringTailAngleX + tailSideLift, -this.getPullRingSpringTailUpMaxAngle(), tailMaxX);
            this.tempPullRingTailEuler.set(
                this.pullRingTailStartEuler.x + tailAngleX,
                this.pullRingTailStartEuler.y + this.pullRingSpringTailAngleY,
                this.pullRingTailStartEuler.z,
            );
            this.pullRingTail.eulerAngles = this.tempPullRingTailEuler;
        }
    }

    private resetPullRingSpring(): void {
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

    private isPullRingSpringSettled(): boolean {
        const angleEpsilon = 0.08;
        const velocityEpsilon = 1.5;
        return Math.abs(this.pullRingSpringRootAngleX) < angleEpsilon
            && Math.abs(this.pullRingSpringRootAngleY) < angleEpsilon
            && Math.abs(this.pullRingSpringTailAngleX) < angleEpsilon
            && Math.abs(this.pullRingSpringTailAngleY) < angleEpsilon
            && Math.abs(this.pullRingSpringRootVelX) < velocityEpsilon
            && Math.abs(this.pullRingSpringRootVelY) < velocityEpsilon
            && Math.abs(this.pullRingSpringTailVelX) < velocityEpsilon
            && Math.abs(this.pullRingSpringTailVelY) < velocityEpsilon;
    }

    private limitPullRingSpringAngles(): void {
        const rootMaxX = this.getPullRingSpringRootMaxX();
        const rootMaxY = this.getPullRingSpringRootMaxY();
        const tailMaxX = this.getPullRingSpringTailMaxX();
        const tailMaxY = this.getPullRingSpringTailMaxY();

        const nextRootAngleX = this.clampRange(this.pullRingSpringRootAngleX, -rootMaxX * 0.35, rootMaxX);
        if (nextRootAngleX !== this.pullRingSpringRootAngleX) {
            this.pullRingSpringRootVelX = 0;
            this.pullRingSpringRootAngleX = nextRootAngleX;
        }

        const nextRootAngleY = this.clampSigned(this.pullRingSpringRootAngleY, rootMaxY);
        if (nextRootAngleY !== this.pullRingSpringRootAngleY) {
            this.pullRingSpringRootVelY = 0;
            this.pullRingSpringRootAngleY = nextRootAngleY;
        }

        const nextTailAngleX = this.clampRange(this.pullRingSpringTailAngleX, -tailMaxX * 0.25, tailMaxX);
        if (nextTailAngleX !== this.pullRingSpringTailAngleX) {
            this.pullRingSpringTailVelX = 0;
            this.pullRingSpringTailAngleX = nextTailAngleX;
        }

        const nextTailAngleY = this.clampSigned(this.pullRingSpringTailAngleY, tailMaxY);
        if (nextTailAngleY !== this.pullRingSpringTailAngleY) {
            this.pullRingSpringTailVelY = 0;
            this.pullRingSpringTailAngleY = nextTailAngleY;
        }
    }

    private getPullRingRootStepEuler(stepIndex: number): Vec3 {
        const phase = this.getPullRingPhase(stepIndex);
        const swingY = Math.sin(phase) * this.pullRingRootSwingY;
        const liftX = (1 - Math.cos(phase)) * 0.5 * this.pullRingRootLiftX;
        return v3(this.pullRingRootStartEuler.x + liftX, this.pullRingRootStartEuler.y + swingY, this.pullRingRootStartEuler.z);
    }

    private getPullRingRootLiftedWorldPosition(): Vec3 {
        return v3(this.pullRingRootStartWorldPos.x, this.pullRingRootStartWorldPos.y + this.pullRingRootLiftY, this.pullRingRootStartWorldPos.z);
    }

    private getPullRingTailStepEuler(stepIndex: number, useRandom: boolean = false): Vec3 {
        const phase = this.getPullRingPhase(stepIndex) + (useRandom ? this.pullRingTailTweenRandomPhase : 0);
        const wave = Math.sin(phase);
        const liftCurve = (1 - Math.cos(phase)) * 0.5;
        const downAngleScale = 1 - (1 - this.getPullRingTailDownAngleScale()) * liftCurve;
        const swingScale = useRandom ? this.pullRingTailTweenRandomSwingScale : 1;
        const liftScale = useRandom ? this.pullRingTailTweenRandomLiftScale : 1;
        const swingY = this.clampSigned(wave * this.pullRingTailSwingY * swingScale, this.getPullRingSpringTailMaxY());
        const liftX = this.clampRange(liftCurve * this.pullRingTailLiftX * downAngleScale * liftScale, -this.getPullRingSpringTailUpMaxAngle(), this.getPullRingSpringTailMaxX());
        return v3(this.pullRingTailStartEuler.x + liftX, this.pullRingTailStartEuler.y + swingY, this.pullRingTailStartEuler.z);
    }

    private getPullRingPhase(stepIndex: number): number {
        return Math.PI * 2 * (stepIndex / this.getPullRingLoopStepCount());
    }

    private getPullRingLoopStepCount(): number {
        return Math.max(2, Math.floor(this.pullRingLoopStepCount));
    }

    private getPullRingStepPerHit(): number {
        return Math.max(1, Math.floor(this.pullRingStepPerHit));
    }

    private getPullRingStepTime(): number {
        return Math.max(0.02, this.pullRingStepTime);
    }

    private getPullRingTailDownAngleScale(): number {
        return Math.max(0.1, Math.min(1, this.pullRingTailDownAngleScale));
    }

    private getPullRingTailRandomSwingRate(): number {
        return Math.max(0, Math.min(3, this.pullRingTailRandomSwingRate));
    }

    private getPullRingSwingSpeedScale(): number {
        return Math.max(0.15, Math.min(2, this.pullRingSwingSpeedScale));
    }

    private getPullRingRootSpringRate(): number {
        return Math.max(0, Math.min(1, this.pullRingRootSpringRate));
    }

    private getPullRingSpringHitVelocityRetain(): number {
        return Math.max(0, Math.min(1, this.pullRingSpringHitVelocityRetain));
    }

    private isPullRingRootSpringEnabled(): boolean {
        return this.getPullRingRootSpringRate() > 0.001;
    }

    private freezePullRingRootIfNeeded(): void {
        if (!this.pullRingRoot || this.isPullRingRootSpringEnabled()) {
            return;
        }
        Tween.stopAllByTarget(this.pullRingRoot);
        this.pullRingSpringRootAngleX = 0;
        this.pullRingSpringRootAngleY = 0;
        this.pullRingSpringRootVelX = 0;
        this.pullRingSpringRootVelY = 0;
        this.pullRingRoot.eulerAngles = this.pullRingRootStartEuler;
    }

    private getNextPullRingSpringSwingDirection(): number {
        const maxY = this.getPullRingSpringTailMaxY();
        const edgeThreshold = maxY * 0.65;
        if (this.pullRingSpringTailAngleY >= edgeThreshold) {
            return -1;
        }
        if (this.pullRingSpringTailAngleY <= -edgeThreshold) {
            return 1;
        }
        return Math.random() < 0.5 ? -1 : 1;
    }

    private getRandomPullRingTailSpringSwingImpulse(direction: number): number {
        const baseImpulse = this.getPullRingSpringTailImpulseY();
        const randomRate = this.getPullRingTailRandomSwingRate();
        if (randomRate <= 0) {
            return direction * baseImpulse;
        }

        return direction * baseImpulse * this.randomRange(0, 1 + randomRate);
    }

    private getRandomPullRingTailSpringLiftImpulse(): number {
        const baseImpulse = this.getPullRingSpringTailImpulseX();
        const randomRate = this.getPullRingTailRandomSwingRate();
        if (randomRate <= 0) {
            return baseImpulse;
        }

        return baseImpulse * this.randomRange(0.25, 1 + randomRate);
    }

    private blendPullRingSpringVelocity(currentVelocity: number, impulse: number, angle: number, minAngle: number, maxAngle: number, velocityLimit: number): number {
        const retain = this.getPullRingSpringHitVelocityRetain();
        const retainedHeadroom = this.getPullRingSpringImpulseHeadroom(angle, currentVelocity, minAngle, maxAngle);
        const impulseHeadroom = this.getPullRingSpringImpulseHeadroom(angle, impulse, minAngle, maxAngle);
        const nextVelocity = currentVelocity * retain * retainedHeadroom + impulse * impulseHeadroom;
        return this.clampSigned(nextVelocity, Math.max(1, velocityLimit));
    }

    private getPullRingSpringImpulseHeadroom(angle: number, velocity: number, minAngle: number, maxAngle: number): number {
        if (velocity === 0 || maxAngle <= minAngle) {
            return 1;
        }
        const distanceToLimit = velocity > 0 ? maxAngle - angle : angle - minAngle;
        const halfRange = (maxAngle - minAngle) * 0.5;
        return this.clampRange(distanceToLimit / Math.max(0.001, halfRange), 0, 1);
    }

    private getPullRingSpringRootImpulseY(): number {
        return Math.max(0, this.pullRingSpringRootImpulseY) * this.getPullRingSpringSideSwingScale();
    }

    private getPullRingSpringRootImpulseX(): number {
        return Math.max(0, this.pullRingSpringRootImpulseX);
    }

    private getPullRingSpringTailImpulseY(): number {
        return Math.max(0, this.pullRingSpringTailImpulseY) * this.getPullRingSpringSideSwingScale();
    }

    private getPullRingSpringTailImpulseX(): number {
        return Math.max(0, this.pullRingSpringTailImpulseX);
    }

    private getPullRingSpringStiffness(): number {
        return Math.max(110, this.pullRingSpringStiffness);
    }

    private getPullRingSpringDamping(): number {
        return Math.max(8, this.pullRingSpringDamping);
    }

    private getPullRingSpringRootMaxAngle(): number {
        return Math.max(1, this.pullRingSpringRootMaxAngle);
    }

    private getPullRingSpringTailMaxAngle(): number {
        return Math.max(1, this.pullRingSpringTailMaxAngle);
    }

    private getPullRingSpringTailReturnScale(): number {
        return Math.max(0.65, Math.min(2, this.pullRingSpringTailReturnScale));
    }

    private getPullRingSpringSideSwingScale(): number {
        return Math.max(0.1, Math.min(3, this.pullRingSpringSideSwingScale));
    }

    private getPullRingSpringRootMaxX(): number {
        return Math.min(this.getPullRingSpringRootMaxAngle(), Math.max(0.5, this.pullRingRootLiftX));
    }

    private getPullRingSpringRootMaxY(): number {
        return Math.min(this.getPullRingSpringRootMaxAngle(), Math.max(1, this.pullRingRootSwingY * this.getPullRingSpringSideLimitScale()));
    }

    private getPullRingSpringTailMaxX(): number {
        const authoredMaxX = this.pullRingTailLiftX * this.getPullRingTailDownAngleScale();
        return Math.min(this.getPullRingSpringTailMaxAngle(), Math.max(0.5, authoredMaxX));
    }

    private getPullRingSpringTailMaxY(): number {
        return Math.min(this.getPullRingSpringTailMaxAngle(), Math.max(1, this.pullRingTailSwingY * this.getPullRingSpringSideLimitScale()));
    }

    private getPullRingSpringSideLimitScale(): number {
        return Math.max(1, Math.min(1.12, this.getPullRingSpringSideSwingScale()));
    }

    private getPullRingSpringSideLift(angleY: number, maxY: number, maxX: number): number {
        if (maxY <= 0 || maxX <= 0) {
            return 0;
        }
        const sideRate = Math.min(1, Math.abs(angleY) / maxY);
        const lift = maxX * this.getPullRingSpringSideLiftScale() * sideRate;
        return this.reversePullRingSideLift ? -lift : lift;
    }

    private getPullRingSpringSideLiftScale(): number {
        return Math.max(0, Math.min(8, this.pullRingSpringSideLiftScale));
    }

    private getPullRingSpringRootUpMaxAngle(): number {
        return Math.max(0, this.pullRingSpringRootUpMaxAngle);
    }

    private getPullRingSpringTailUpMaxAngle(): number {
        return Math.max(0, this.pullRingSpringTailUpMaxAngle);
    }

    private clampSigned(value: number, maxAbs: number): number {
        return Math.max(-maxAbs, Math.min(maxAbs, value));
    }

    private clampRange(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }

    private randomRange(min: number, max: number): number {
        return min + (max - min) * Math.random();
    }

    private prepareSliderOffset(): void {
        this.runtimeSliderOffsetZ = this.sliderOffsetZ;
        if (this.startFromMaxZ) {
            return;
        }
        const offsetBaseTooth = this.getSliderPairLeadTooth(Math.max(0, Math.min(this.getInitialClosedPairCount(), this.pairCount) - 1)) ?? this.teeth[0];
        if (!this.keepSliderZOffset || !this.cube || !offsetBaseTooth) {
            return;
        }
        const firstTarget = this.getSliderTargetPos(offsetBaseTooth, false);
        this.runtimeSliderOffsetZ = this.cubeStartPos.z - firstTarget.z;
    }

    private applyOpenProgress(): void {
        this.toothStartPos.length = 0;
        for (let i = 0; i < this.teeth.length; i++) {
            const tooth = this.teeth[i];
            const closedPos = this.toothClosedPos[i];
            if (!tooth || !closedPos) {
                continue;
            }
            const openedPos = this.getOpenedToothPosition(closedPos);
            tooth.setPosition(openedPos);
            this.toothStartPos.push(openedPos);
        }
    }

    private getOriginalToothPosition(tooth: Node): Vec3 {
        let originalPos = this.originalToothPositions.get(tooth);
        if (!originalPos) {
            originalPos = tooth.position.clone();
            this.originalToothPositions.set(tooth, originalPos);
        }
        return originalPos;
    }

    private applyToothProgress(toothIndex: number, progress: number, useTween: boolean, duration: number = this.getHitAnimDuration()): void {
        const tooth = this.teeth[toothIndex];
        const startPos = this.toothStartPos[toothIndex];
        const closedPos = this.toothClosedPos[toothIndex];
        if (!tooth || !startPos || !closedPos) {
            return;
        }

        const targetPos = v3(
            startPos.x + (closedPos.x - startPos.x) * progress,
            startPos.y + (closedPos.y - startPos.y) * progress,
            startPos.z + (closedPos.z - startPos.z) * progress,
        );
        Tween.stopAllByTarget(tooth);
        if (useTween) {
            tween(tooth)
                .to(duration, { position: targetPos }, { easing: 'linear' })
                .start();
        } else {
            tooth.setPosition(targetPos);
        }
    }

    private applyPairProgress(pairIndex: number, progress: number, useTween: boolean, duration: number = this.getHitAnimDuration()): void {
        const clampedProgress = this.getClampedProgress(progress);
        this.pairProgressList[pairIndex] = clampedProgress;
        const startIndex = this.getPairStartToothIndex(pairIndex);
        const perPair = this.getTeethPerPair();
        for (let i = 0; i < perPair; i++) {
            const toothIndex = startIndex + i;
            if (!this.teeth[toothIndex]) {
                continue;
            }
            this.applyToothProgress(toothIndex, clampedProgress, useTween, duration);
        }
    }

    private getPairLeadTooth(pairIndex: number): Node | null {
        return this.teeth[this.getPairStartToothIndex(pairIndex)] ?? null;
    }

    private getSliderPairLeadTooth(pairIndex: number): Node | null {
        const targetPairIndex = !this.startFromMaxZ && this.reverseSliderMoveZ ? this.pairCount - 1 - pairIndex : pairIndex;
        return this.getPairLeadTooth(Math.max(0, targetPairIndex));
    }

    private getPairStartToothIndex(pairIndex: number): number {
        return Math.max(0, pairIndex) * this.getTeethPerPair();
    }

    private getPairCount(): number {
        return Math.ceil(this.teeth.length / this.getTeethPerPair());
    }

    private getTeethPerPair(): number {
        return Math.max(1, Math.floor(this.teethPerPair));
    }

    private getInitialClosedPairCount(): number {
        return Math.max(0, Math.floor(this.initialClosedPairCount));
    }

    private getClampedProgress(progress: number): number {
        return Math.max(0, Math.min(1, progress));
    }

    private getOpenedToothPosition(closedPos: Vec3): Vec3 {
        const delta = closedPos.x - this.closeCenter;
        let sign = delta >= 0 ? 1 : -1;
        if (!this.startFromMaxZ && this.reverseOpenDirection) {
            sign *= -1;
        }
        return v3(closedPos.x + sign * Math.max(0, this.openOffsetX), closedPos.y, closedPos.z);
    }

    private getCloseCenterX(): number {
        if (!this.autoCloseCenterX || this.teeth.length <= 0) {
            return this.closeCenterX;
        }
        let minX = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < this.toothClosedPos.length; i++) {
            const pos = this.toothClosedPos[i];
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

    private getSliderTargetPos(tooth: Node, useRuntimeOffset: boolean = true): Vec3 {
        const cubePos = this.hasCubeStartData ? this.cubeStartPos : this.cube.position;
        const offsetZ = useRuntimeOffset ? this.runtimeSliderOffsetZ : 0;
        const anchorOffsetZ = this.getSliderVisualAnchorOffsetZ();
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

    private getSliderStepTargetPos(startTooth: Node, endTooth: Node, progress: number): Vec3 {
        const fromPos = this.getSliderTargetPos(startTooth).clone();
        const toPos = this.getSliderTargetPos(endTooth).clone();
        return v3(
            fromPos.x + (toPos.x - fromPos.x) * progress,
            fromPos.y + (toPos.y - fromPos.y) * progress,
            fromPos.z + (toPos.z - fromPos.z) * progress,
        );
    }

    private getSliderVisualAnchorOffsetZ(): number {
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

    private getHitAnimDuration(): number {
        return Math.max(0.08, this.hitAnimTime);
    }

    private getSmoothTotalHitCount(): number {
        return Math.max(1, Math.floor(this.smoothTotalHitCount));
    }

    private getSmoothWholeProgress(linearProgress: number): number {
        const clampedProgress = this.getClampedProgress(linearProgress);
        const decayStrength = Math.max(0.01, this.smoothProgressEasePower * 4);
        const speedFloor = this.getClampedProgress(this.smoothEndSpeedFloor);
        const earlyBoost = (1 - speedFloor)
            * (1 - Math.exp(-decayStrength * clampedProgress))
            * (1 - clampedProgress);
        const progress = clampedProgress + earlyBoost;
        return this.getClampedProgress(progress);
    }

    private getHitCountPerStep(): number {
        return Math.max(1, Math.floor(this.hitCountPerStep));
    }

    private getPairAdvancePerHit(): number {
        return Math.max(1, Math.floor(this.pairAdvancePerHit));
    }

    private getHitCountPerStepForPair(pairIndex: number): number {
        const fallback = this.getHitCountPerStep();
        const stageStartPairIndex = this.getStageStartPairIndex();
        const remainingPairCount = this.pairCount - stageStartPairIndex;
        if (remainingPairCount <= 0 || !this.hitStageConfigList?.length) {
            return fallback;
        }

        const clampedPairIndex = Math.max(stageStartPairIndex, Math.min(pairIndex, this.pairCount - 1));
        const pairAdvancePerHit = this.getPairAdvancePerHit();
        const logicalStepCount = Math.max(1, Math.ceil(remainingPairCount / pairAdvancePerHit));
        const logicalStepOrdinal = Math.floor((clampedPairIndex - stageStartPairIndex) / pairAdvancePerHit) + 1;
        const progress = Math.max(0, Math.min(1, logicalStepOrdinal / logicalStepCount));

        let matchedCount = 0;
        let matchedEndProgress = Number.POSITIVE_INFINITY;
        let fallbackCount = 0;
        let fallbackEndProgress = -1;
        for (let i = 0; i < this.hitStageConfigList.length; i++) {
            const config = this.hitStageConfigList[i];
            if (!config) {
                continue;
            }
            const endProgress = Math.max(0, Math.min(1, config.endProgress));
            const hitCount = Math.max(1, Math.floor(config.hitCountPerStep));
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

    private getPairProgress(pairIndex: number): number {
        return this.getClampedProgress(this.pairProgressList[pairIndex] ?? 0);
    }

    private getRemainHitCount(pairIndex: number = this.pairIndex, stepHitCount: number = this.stepHitCount): number {
        const firstPendingPairIndex = Math.max(0, pairIndex + 1);
        if (firstPendingPairIndex >= this.pairCount) {
            return 0;
        }

        const pairAdvancePerHit = this.getPairAdvancePerHit();
        let remainAdvance = 0;
        for (let i = firstPendingPairIndex; i < this.pairCount; i += pairAdvancePerHit) {
            const requiredHits = this.getHitCountPerStepForPair(i);
            if (i === firstPendingPairIndex) {
                remainAdvance += Math.max(0, requiredHits - Math.max(0, stepHitCount));
            } else {
                remainAdvance += requiredHits;
            }
        }
        return Math.max(0, remainAdvance);
    }

    private getStageStartPairIndex(): number {
        return Math.max(0, Math.min(this.getInitialClosedPairCount(), this.pairCount));
    }

    private updateHpLabel(value: number): void {
        if (this.hpLabel) {
            this.hpLabel.string = value > 0 ? value.toString() : '';
        }
    }

    private setupColliderTag(): void {
        let tag = this.getComponent(ColliderTag);
        if (!tag) {
            tag = this.addComponent(ColliderTag);
        }
        tag.tag = COLLIDE_TYPE.MONSTER;
    }

    private registerTarget(): void {
        if (this.registered) {
            return;
        }
        BulletMonsterCollisionManager.instance.registerTarget(this);
        this.registered = true;
    }

    private unregisterTarget(): void {
        if (!this.registered) {
            return;
        }
        BulletMonsterCollisionManager.instance.unregisterTarget(this);
        this.registered = false;
    }
}
