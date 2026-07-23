import { _decorator, Canvas, CCFloat, CCInteger, Color, director, instantiate, ITriggerEvent, Label, LabelOutline, Node, tween, Tween, UIOpacity, UITransform, Vec3 } from 'cc';
import PoolManager from '../../Base/PoolManager';
import { PropBrand } from './PropBrand';
import { EffectEnum, EventType, LayerEnum, PoolEnum, PrefabsEnum, SoundEnum } from '../../Base/EnumList';
import { PrefabsManager } from '../../Base/PrefabsManager';
import { Player } from '../Player/Player';
import LayerManager from '../../Base/LayerManager';
import { JumpManager } from '../Jump/JumpManager';
import { UnityUpComponent } from '../../Base/UnityUpComponent';
import { EffectManager } from '../Effect/EffectManager';
import AudioManager from '../../Base/AudioManager';
import { FlashRedManager } from '../Battle/Base/FlashRedManager';
import { PropLalianGate } from './PropLalianGate';
import { GameOverPanel } from '../UI/GameOver/GameOverPanel';
const { ccclass, property } = _decorator;

type LalianDoneInfo = {
    moveCount: number;
};

@ccclass('CreatePropBrand')
export class CreatePropBrand extends UnityUpComponent {

    private static feedbackHost: CreatePropBrand = null;

    @property({ type: CCInteger, displayName: '展示数量', tooltip: '开局先摆出来的 +1/+99 道具数量，只影响初始队列长度。' })
    public showCount: number = 15;

    @property({ type: CCFloat, displayName: '道具间距', tooltip: '道具队列里相邻两个道具在 Z 轴上的距离。' })
    public distance: number = 1.5;

    @property({ type: CCFloat, displayName: '道具高度', tooltip: '道具生成时的 Y 轴高度。' })
    public height: number = 0;

    @property({ type: CCInteger, displayName: '每个道具数值', tooltip: '每个道具显示和生效的数值。左边 +1 填 1，右边 +99 填 99。' })
    public count: number = 1;

    @property({ type: CCInteger, displayName: '+1生效人数上限(0=使用玩家)', tooltip: '当前通道为 +1 时，玩家人数达到该值后继续吃 +1 不再增加角色。填 0 时使用 Player 上的 +1人数上限。' })
    public addRoleMaxCount: number = 0;

    @property({ type: CCInteger, displayName: '+99胜利阈值', tooltip: '道具数值达到该值时，吃到后直接胜利。默认 99。' })
    public winPropCountThreshold: number = 99;

    @property({ type: CCInteger, displayName: '+1/+99单次放出上限(0=不限制)', tooltip: '拉链完成后，本通道单次最多放出多少个 +1/+99。填 0 表示不额外限制，使用拉链组件传来的数量。' })
    public releaseCountLimit: number = 0;

    @property({ type: CCFloat, displayName: '移动速度', tooltip: '拉链完成后，道具队列向玩家移动的速度。' })
    public moveSpeed: number = 2;

    @property({ type: PropLalianGate, displayName: 'Lalian拉链组件', tooltip: '拖入同一侧 Prop_arms 上的 PropLalianGate。为空时会自动在当前节点子级查找。' })
    public lalianGate: PropLalianGate;

    @property({ type: CCFloat, displayName: '道具起始Z额外偏移', tooltip: '在拉链自动计算的起始 Z 基础上额外加的偏移。用于微调 +1/+99 队列离拉链的远近。' })
    public propStartZ: number = 0;

    @property({ type: CCFloat, displayName: '提示文本上飘高度', tooltip: '吃到 +1 或人数已满时，提示文本向上飘动的高度。' })
    public feedbackFloatHeight: number = 1.2;

    @property({ type: CCFloat, displayName: '提示文本持续时间', tooltip: '吃到 +1 或人数已满时，提示文本从出现到淡出的时间。' })
    public feedbackFloatDuration: number = 0.9;

    @property({ type: CCFloat, displayName: '飘字淡出延迟', tooltip: '飘字出现后保持清晰的时间，之后继续上飘并缓慢淡出。' })
    public feedbackFadeDelay: number = 0.2;

    @property({ type: CCFloat, displayName: '提示文本起始高度偏移', tooltip: '提示文本生成时，在起点基础上额外增加的 Y 高度。' })
    public feedbackStartYOffset: number = 0.8;

    @property({ type: Color, displayName: '+1文本颜色', tooltip: '吃到 +1 时显示的飘字颜色。' })
    public plusFeedbackColor: Color = new Color(168, 232, 255, 255);

    @property({ type: Color, displayName: 'MAX文本颜色', tooltip: '人数达到上限时显示的 MAX! 文本颜色。' })
    public maxFeedbackColor: Color = new Color(255, 64, 64, 255);

    @property({ type: CCFloat, displayName: 'MAX文本字号倍数', tooltip: 'MAX! 飘字相对 +1 模板字号的放大倍数。' })
    public maxFeedbackFontScale: number = 1.15;

    @property({ type: CCFloat, displayName: 'MAX触发间隔(秒)', tooltip: '上一次 MAX! 飘字出现后，至少间隔多少秒才允许再次出现。' })
    public maxFeedbackInterval: number = 1;

    @property({ type: Node, displayName: '道具挂载父节点', tooltip: '生成出来的 +1/+99 道具会挂到这个节点下面。通常填当前通道的 wall/root 节点。' })
    public wallNode: Node;

    @property({ type: CCInteger, displayName: '道具类型', tooltip: '对应 PrefabsEnum.prop 的预制体类型编号。保持和原来左/右道具类型一致。' })
    public type: number = 0;

    private propBrandList: PropBrand[] = [];

    private tempPropBrandList: PropBrand[] = [];

    private activeBulletTarget: PropBrand = null;

    private isMove: boolean = false;

    private pendingReleaseCount: number = 0;

    private tempV3: Vec3 = new Vec3();

    private groundWorldPos: Vec3 = new Vec3();

    private groundLocalPos: Vec3 = new Vec3();

    private modelVisualGroup: Node = null;

    private spriteVisualGroup: Node = null;

    private labelVisualGroup: Node = null;

    private groundHeight: number = 0;

    private maxFeedbackCooldown: number = 0;

    private get activeLalianGate() {
        if (!this.lalianGate) {
            this.lalianGate = this.findLalianGate(this.node);
        }
        return this.lalianGate;
    }

    private get activePropStartZ() {
        return this.propStartZ + (this.activeLalianGate?.getPropStartZ() ?? 0);
    }

    public setWaveRoleList(waveRoleList: Node[]): void {
    }

    start() {
        if (!CreatePropBrand.feedbackHost?.node?.isValid) {
            CreatePropBrand.feedbackHost = this;
        }
        const startZ = this.activePropStartZ;
        this.ensureVisualGroups();
        this.refreshGroundHeight();

        for (let i = 0; i < this.showCount; i++) {
            const p = this.propBrand;
            this.propBrandList.push(p);
            this.wallNode.addChild(p.node);
            p.node.x = 0;
            p.node.y = this.getSpawnHeight();
            p.node.z = startZ + i * this.distance;
            p.mergeModelRenderers(String(this.type));
            this.bindPropBrandVisuals(p);
        }
        this.refreshFrontBulletTarget();

        const gate = this.activeLalianGate;
        if (gate) {
            gate.node.off(EventType.PROP_ARMS_DIE, this.lalianDoneEvent, this);
            gate.node.on(EventType.PROP_ARMS_DIE, this.lalianDoneEvent, this);
        }
    }

    protected onDestroy(): void {
        this.activeLalianGate?.node.off(EventType.PROP_ARMS_DIE, this.lalianDoneEvent, this);
        this.clearPropBrandTargets(this.propBrandList);
        this.clearPropBrandTargets(this.tempPropBrandList);
    }

    private lalianDoneEvent(info: LalianDoneInfo) {
        let count = (info?.moveCount ?? 0) > 0 ? info.moveCount : -1;
        if (this.releaseCountLimit > 0) {
            count = count < 0 ? this.releaseCountLimit : Math.min(count, this.releaseCountLimit);
        }
        this.move(count);
    }

    _update(deltaTime: number) {
        if (this.maxFeedbackCooldown > 0) {
            this.maxFeedbackCooldown = Math.max(0, this.maxFeedbackCooldown - deltaTime);
        }

        if (this.isMove) {
            for (let i = 0; i < this.propBrandList.length; i++) {
                const p = this.propBrandList[i];

                if (!i && p.node.z <= 0) {
                    if (!this.releaseFrontProp()) {
                        this.isMove = false;
                    }
                    i--;
                    break;
                }

                p.node.z -= this.moveSpeed * deltaTime;

                if (p.node.z <= -0.614 && p.node.y > this.groundHeight) {
                    p.node.y -= this.moveSpeed * deltaTime * 0.5;
                    if (p.node.y <= this.groundHeight) {
                        p.node.y = this.groundHeight;
                    }
                }
                p.updateVisualTransform();
            }
        }

        for (let i = this.tempPropBrandList.length - 1; i >= 0; i--) {
            const p = this.tempPropBrandList[i];
            p.node.z -= this.moveSpeed * deltaTime;

            if (p.node.z <= -0.614) {
                p.node.y -= this.moveSpeed * deltaTime * 0.35;
                if (p.node.y <= this.groundHeight) {
                    p.node.y = this.groundHeight;
                }
            }
            p.updateVisualTransform();

            if (p.node.z <= -30) {
                this.recyclePropBrand(p);
            }
        }

        this.refreshFrontBulletTarget();
    }

    private refreshGroundHeight(): void {
        this.groundHeight = 0;
        if (!this.wallNode) {
            return;
        }
        this.groundWorldPos.set(this.wallNode.worldPosition);
        this.groundWorldPos.y = 0;
        this.wallNode.inverseTransformPoint(this.groundLocalPos, this.groundWorldPos);
        this.groundHeight = this.groundLocalPos.y;
    }

    private getSpawnHeight(): number {
        return Math.abs(this.height) <= 0.000001 ? this.groundHeight : this.height;
    }

    private appendPropBrands(count: number) {
        const last = this.propBrandList[this.propBrandList.length - 1];
        const appendStartZ = last ? last.node.z + this.distance : this.activePropStartZ;
        for (let i = 0; i < count; i++) {
            const p = this.propBrand;
            this.wallNode.addChild(p.node);
            p.node.x = 0;
            p.node.y = this.getSpawnHeight();
            p.node.z = appendStartZ + i * this.distance;
            p.mergeModelRenderers(String(this.type));
            this.bindPropBrandVisuals(p);
            this.propBrandList.push(p);
        }
    }

    private refreshFrontBulletTarget(): void {
        let nextTarget: PropBrand = null;
        // releaseFrontProp uses local Z=0 as the player boundary.
        for (let i = 0; i < this.propBrandList.length; i++) {
            const candidate = this.propBrandList[i];
            if (candidate?.node?.active && candidate.node.z > 0) {
                nextTarget = candidate;
                break;
            }
        }

        if (this.activeBulletTarget === nextTarget) {
            return;
        }

        this.activeBulletTarget?.deactivateBulletTarget();
        this.activeBulletTarget = nextTarget;
        this.activeBulletTarget?.activateBulletTarget();
    }

    private releaseFrontProp(): boolean {
        if (this.pendingReleaseCount === 0) {
            return false;
        }

        const p = this.propBrandList.shift();
        if (!p) {
            this.pendingReleaseCount = 0;
            return false;
        }

        if (this.pendingReleaseCount > 0) {
            this.pendingReleaseCount--;
        }
        this.tempPropBrandList.push(p);
        p.collide.off("onTriggerEnter", this.onTriggerEnter, this);
        p.collide.on("onTriggerEnter", this.onTriggerEnter, this);
        this.appendPropBrands(1);
        return this.pendingReleaseCount !== 0;
    }

    public move(count: number) {
        if (count === 0) {
            return;
        }

        if (count < 0 || this.pendingReleaseCount < 0) {
            this.pendingReleaseCount = -1;
        } else {
            this.pendingReleaseCount += count;
        }
        this.isMove = true;
    }

    public get propBrand() {
        let p = PoolManager.instance.getPool<PropBrand>(PoolEnum.Prop + this.type);

        if (!p) {
            const node = PrefabsManager.instance.GetPrefabsIns(PrefabsEnum.prop, this.type);
            p = node.getComponent(PropBrand);
        }

        p.node.active = true;
        p.setVisualActive(true);
        p.init(this.count);
        return p;
    }

    private onTriggerEnter(event: ITriggerEvent) {
        const player = event.otherCollider.getComponent(Player);
        if (!player) {
            return;
        }

        const propBrand = event.selfCollider.getComponent(PropBrand);
        if (!propBrand) {
            return;
        }
        const addRoleMaxCount = this.getAddRoleMaxCount(player);
        if (!this.isWinPropBrand(propBrand) && !player.canReserveRoleSlot(addRoleMaxCount)) {
            if (player.isRoleCountAtLimit(addRoleMaxCount) && this.maxFeedbackCooldown <= 0) {
                const maxTextPos = this.getMaxFeedbackWorldPos(player);
                this.showFloatingFeedback(propBrand, "MAX!", maxTextPos, this.maxFeedbackColor, this.maxFeedbackFontScale);
                this.maxFeedbackCooldown = Math.max(0, this.maxFeedbackInterval);
            }
            this.recycleTriggeredProp(propBrand);
            return;
        }

        if (this.isWinPropBrand(propBrand)) {
            this.recycleTriggeredProp(propBrand);
            GameOverPanel.instance.show(true);
            return;
        }

        const reservedIndex = player.reserveRoleSlot(addRoleMaxCount);
        if (reservedIndex < 0) {
            this.recycleTriggeredProp(propBrand);
            return;
        }

        let role = player.getRoleForSpawn();

        const layer = LayerManager.instance.getLayer(LayerEnum.Layer_1_Ground);
        layer.addChild(role.node);
        const selfPos = event.selfCollider.node.worldPosition;
        role.node.setWorldPosition(selfPos);
        role.hp = 2;
        role.node.active = true;
        if (reservedIndex >= player.getEffectiveMaxRoleCount()) {
            player.releaseRoleSlot();
            role.node.active = false;
            PoolManager.instance.setPool(PoolEnum.role + role.type, role);
            this.scheduleOnce(() => {
                if (!propBrand?.node?.isValid) {
                    return;
                }
                this.recyclePropBrand(propBrand);
            }, 0);
            return;
        }
        const initialTargetPos = player.getNextPos(reservedIndex);
        const pos = new Vec3(initialTargetPos.x, initialTargetPos.y, initialTargetPos.z);
        PoolManager.instance.V3 = initialTargetPos;
        this.showFloatingFeedback(propBrand, `+${propBrand.count}`, pos, this.plusFeedbackColor);
        this.tempV3.set(selfPos);
        this.tempV3.y += 1;
        AudioManager.inst.playOneShot(SoundEnum.Sound_PlaceGold);
        EffectManager.instance.addShowEffect(this.tempV3, EffectEnum.door, 2);

        const cPos = PoolManager.instance.V3.set(Vec3.ZERO);
        cPos.z = (selfPos.z + pos.z) * 0.5;
        let f = selfPos.x - pos.x;
        f = f / Math.abs(f);
        cPos.x = (selfPos.x + pos.x) * 0.5 - f * 3;
        EffectManager.instance.addShowEffect_3(role.node, EffectEnum.up, 1);
        const roleFBXNode = role.fbxManager.node;
        const scaleR = PoolManager.instance.V3.set(roleFBXNode.scale);
        FlashRedManager.instance.flashRed(role.node, role.meshCreateDataList, 0.5);
        const scale2 = PoolManager.instance.V3.set(scaleR).multiplyScalar(1.5);
        tween(roleFBXNode).to(0.4, { scale: scale2 }).to(0.2, { scale: scaleR }, { easing: "backOut" }).call(() => {
            PoolManager.instance.V3 = scaleR;
            PoolManager.instance.V3 = scale2;
        }).start();
        role.attackIN = true;
        role.setEntryWeaponVisible(false);

        JumpManager.instance.jumpBezierByPoints(role.node, 3, cPos, pos).onComplete(() => {
            AudioManager.inst.playOneShot(SoundEnum.Sound_Ship_UpLevel);
            if (!role.node.active || player.isDie) {
                player.releaseRoleSlot();
                role.node.active = false;
                PoolManager.instance.setPool(PoolEnum.role + role.type, role);
                PoolManager.instance.V3 = pos;
                PoolManager.instance.V3 = cPos;
                return;
            }
            const committedRole = player.commitReservedRole(role);
            if (!committedRole) {
                role.node.active = false;
                PoolManager.instance.setPool(PoolEnum.role + role.type, role);
                PoolManager.instance.V3 = pos;
                PoolManager.instance.V3 = cPos;
                return;
            }
            role = committedRole;
            PoolManager.instance.V3 = pos;
            PoolManager.instance.V3 = cPos;
            const currentIndex = player.roleList.indexOf(role);
            const selfPos2 = player.getNextPos(currentIndex);
            player.node.addChild(role.node);
            role.node.setWorldPosition(selfPos2);
            role.setEntryWeaponVisible(true);
            PoolManager.instance.V3 = selfPos2;
        }).setEndPosPre((prop: Node) => {
            if (!role.node.active || player.isDie) {
                return;
            }
            const curPos = player.getNextPos(Math.min(reservedIndex, player.getEffectiveMaxRoleCount() - 1));
            curPos.subtract(pos);
            curPos.add(prop.worldPosition);
            prop.setWorldPosition(curPos);
            PoolManager.instance.V3 = curPos;
        }, null);

        this.scheduleOnce(() => {
            Tween.stopAllByTarget(this.node);
            this.recyclePropBrand(propBrand);
        }, 0);
    }

    private recycleTriggeredProp(propBrand: PropBrand): void {
        this.recyclePropBrand(propBrand);
    }

    private ensureVisualGroups(): void {
        if (this.modelVisualGroup && this.spriteVisualGroup && this.labelVisualGroup) {
            return;
        }
        this.modelVisualGroup = this.createVisualGroup("PropBrand_Model_Group");
        this.spriteVisualGroup = this.createVisualGroup("PropBrand_Sprite_Group");
        this.labelVisualGroup = this.createVisualGroup("PropBrand_Label_Group");
    }

    private createVisualGroup(name: string): Node {
        const group = new Node(`${name}_${this.node.name}`);
        this.wallNode.addChild(group);
        group.setPosition(Vec3.ZERO);
        return group;
    }

    private bindPropBrandVisuals(propBrand: PropBrand): void {
        this.ensureVisualGroups();
        propBrand.bindVisualGroups(this.modelVisualGroup, this.spriteVisualGroup, this.labelVisualGroup);
    }

    public static showSharedFloatingFeedback(text: string, _worldPos: Vec3, color: Color, fontScale: number = 1, duration: number = 0): boolean {
        const canvas = director.getScene()?.getComponentInChildren(Canvas);
        if (!canvas?.node?.isValid) {
            return false;
        }
        const feedbackNode = new Node('Dazhuang_ATK_Top_Feedback');
        canvas.node.addChild(feedbackNode);
        feedbackNode.setSiblingIndex(canvas.node.children.length - 1);
        feedbackNode.setPosition(0, 70, 0);

        const transform = feedbackNode.addComponent(UITransform);
        transform.setContentSize(900, 180);
        const label = feedbackNode.addComponent(Label);
        label.string = text;
        label.fontSize = Math.round(72 * Math.max(0.1, fontScale));
        label.lineHeight = Math.round(82 * Math.max(0.1, fontScale));
        label.color = color.clone();
        label.horizontalAlign = 1;
        label.verticalAlign = 1;
        const outline = feedbackNode.addComponent(LabelOutline);
        outline.color = new Color(58, 36, 2, 255);
        outline.width = 7;
        const opacity = feedbackNode.addComponent(UIOpacity);
        opacity.opacity = 255;

        const totalDuration = Math.max(0.6, duration);
        feedbackNode.setScale(0.65, 0.65, 1);
        tween(feedbackNode)
            .to(0.18, { scale: new Vec3(1.08, 1.08, 1) }, { easing: 'backOut' })
            .to(0.1, { scale: Vec3.ONE })
            .delay(Math.max(0, totalDuration - 0.68))
            .by(0.4, { position: new Vec3(0, 45, 0) }, { easing: 'sineOut' })
            .call(() => feedbackNode.destroy())
            .start();
        tween(opacity)
            .delay(Math.max(0.2, totalDuration - 0.4))
            .to(0.4, { opacity: 0 }, { easing: 'sineOut' })
            .start();
        return true;
    }

    private showFloatingFeedback(propBrand: PropBrand, text: string, worldPos: Vec3, color: Color | null = null, fontScale: number = 1, duration: number = 0, parentOverride: Node | null = null, keepTemplateMaterial: boolean = false): void {
        const templateNode = propBrand?.lab?.node;
        if (!templateNode || !this.labelVisualGroup) {
            return;
        }
        const feedbackNode = instantiate(templateNode);
        const label = feedbackNode.getComponent(Label);
        if (!label) {
            feedbackNode.destroy();
            return;
        }
        if (!keepTemplateMaterial) {
            label.customMaterial = null;
        }

        (parentOverride ?? this.labelVisualGroup).addChild(feedbackNode);
        feedbackNode.active = true;
        feedbackNode.setWorldPosition(worldPos.x, worldPos.y + this.feedbackStartYOffset, worldPos.z);
        feedbackNode.setScale(templateNode.scale);
        label.string = text;
        const feedbackColor = color ? color.clone() : templateNode.getComponent(Label).color.clone();
        label.color = feedbackColor;
        if (fontScale > 0 && Math.abs(fontScale - 1) > 0.001) {
            label.fontSize = Math.round(label.fontSize * fontScale);
            label.lineHeight = Math.round(label.lineHeight * fontScale);
        }

        let opacity = feedbackNode.getComponent(UIOpacity);
        if (!opacity) {
            opacity = feedbackNode.addComponent(UIOpacity);
        }
        opacity.opacity = 255;

        const startY = worldPos.y + this.feedbackStartYOffset;
        const totalDuration = Math.max(0.001, duration > 0 ? duration : this.feedbackFloatDuration);
        const fadeDelay = Math.max(0, Math.min(this.feedbackFadeDelay, totalDuration));
        const fadeDuration = Math.max(0.001, totalDuration - fadeDelay);
        const fadeStartRatio = fadeDelay / totalDuration;
        const fadeStartPos = new Vec3(worldPos.x, startY + this.feedbackFloatHeight * fadeStartRatio, worldPos.z);
        const endPos = new Vec3(worldPos.x, startY + this.feedbackFloatHeight, worldPos.z);
        tween(feedbackNode)
            .to(fadeDelay, { worldPosition: fadeStartPos }, { easing: 'sineOut' })
            .to(fadeDuration, { worldPosition: endPos }, { easing: 'sineOut' })
            .call(() => {
                feedbackNode.destroy();
            })
            .start();
        const fadeState = { alpha: 255 };
        tween(fadeState)
            .delay(fadeDelay)
            .to(fadeDuration, { alpha: 0 }, {
                easing: 'sineOut',
                onUpdate: (state: { alpha: number }) => {
                    const alpha = Math.max(0, Math.min(255, Math.round(state.alpha)));
                    opacity.opacity = alpha;
                    feedbackColor.a = alpha;
                    label.color = feedbackColor;
                }
            })
            .start();
    }

    private getMaxFeedbackWorldPos(player: Player): Vec3 {
        const centerRole = player.roleList && player.roleList.length > 0 ? player.roleList[0] : null;
        const sourcePos = centerRole?.node?.worldPosition ?? player.node.worldPosition;
        return new Vec3(sourcePos.x, sourcePos.y, sourcePos.z);
    }

    private getAddRoleMaxCount(player: Player): number {
        const playerMaxCount = player.getEffectiveMaxRoleCount();
        return this.addRoleMaxCount > 0 ? Math.min(this.addRoleMaxCount, playerMaxCount) : playerMaxCount;
    }

    private isWinPropBrand(propBrand: PropBrand): boolean {
        return propBrand.count >= this.winPropCountThreshold;
    }

    private findLalianGate(root: Node): PropLalianGate | null {
        if (!root) {
            return null;
        }
        const gate = root.getComponent(PropLalianGate);
        if (gate) {
            return gate;
        }
        for (let i = 0; i < root.children.length; i++) {
            const result = this.findLalianGate(root.children[i]);
            if (result) {
                return result;
            }
        }
        return null;
    }

    private recyclePropBrand(propBrand: PropBrand): void {
        if (!propBrand?.node?.isValid || !propBrand.node.active) {
            return;
        }

        const tempPropBrandIndex = this.tempPropBrandList.indexOf(propBrand);
        if (tempPropBrandIndex !== -1) {
            this.tempPropBrandList.splice(tempPropBrandIndex, 1);
        }

        const propBrandIndex = this.propBrandList.indexOf(propBrand);
        if (propBrandIndex !== -1) {
            this.propBrandList.splice(propBrandIndex, 1);
        }

        if (this.activeBulletTarget === propBrand) {
            this.activeBulletTarget = null;
        }
        propBrand.deactivateBulletTarget();
        propBrand.setVisualActive(false);
        propBrand.node.active = false;
        propBrand.collide.off("onTriggerEnter", this.onTriggerEnter, this);
        PoolManager.instance.setPool(PoolEnum.Prop + this.type, propBrand);
    }

    private clearPropBrandTargets(list: PropBrand[]): void {
        for (let i = 0; i < list.length; i++) {
            const propBrand = list[i];
            propBrand?.deactivateBulletTarget();
            propBrand?.collide?.off("onTriggerEnter", this.onTriggerEnter, this);
        }
        this.activeBulletTarget = null;
    }
}
