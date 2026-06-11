import { _decorator, Animation, Button, Component, easing, Node, Sprite, SpriteFrame, tween, Tween, UITransform, UIOpacity, v3, Vec3 } from 'cc';
import { CommonEvent } from '../Common/CommonEnum';
import { GameInfo } from '../Common/GameInfo';
const { ccclass, property } = _decorator;

@ccclass('ViewUnlockSkill')
export class ViewUnlockSkill extends Component {
    @property({ type: [Sprite] })
    private cardBG: Sprite[] = [];
    @property({ type: [Sprite] })
    cardFillArrow: Sprite[] = [];
    @property({ type: [SpriteFrame] })
    cardChildrenRank: SpriteFrame[] = [];
    @property({ type: [Node], displayName: '选项池', tooltip: '与 cardBG 槽位数一致, 图标与卡片同父, 不挂在 cardBG 下' })
    private optionArr: Node[] = [];
    @property({ type: [SpriteFrame] })
    bgRank: SpriteFrame[] = [];
    @property({ type: [SpriteFrame], displayName: '选项图标边框等级图', tooltip: '与 bgRank 档位对应, 按选项技能等级切换' })
    optionFrameRank: SpriteFrame[] = [];
    @property({ type: [Node] })
    buttonArr: Node[] = [];
    public tran: UITransform;
    @property({ type: Node, displayName: '选项动画节点' })
    private handAniNode: Node = null!;
    @property({ type: Node, displayName: '特殊选项卡片边框特效' })
    private cardFrameEffect: Node = null!;
    /** 与 optionArr 下标一一对应：第 i 个选项在编辑器里的技能等级（与槽位是否打乱无关） */
    private curSelectSkillLevel: number[] = [];
    /** 当前展示顺序：curSelectArr[slot] 为放在第 slot 个固定槽位上的选项节点 */
    private curSelectArr: Node[] = [];
    private originBgScale: Vec3 = v3(1, 1, 1);
    /** 防止连点重复提交 */
    private _selectAnimating = false;
    /** 功能测试等场景：选技能后不调用 onWaveRewardComplete，避免污染波次/关卡状态 */
    private _skipWaveAdvanceOnPick = false;
    /** cardBG.fillRange：与渐显同步的揭示时长（秒） */
    private static readonly REVEAL_FILL_DURATION = 0.38;
    /** 子节点下落：相对原位的起始高度偏移（本地 Y，负方向即 y - 该值） */
    private static readonly REVEAL_CHILD_START_OFFSET_Y = 230;
    /** 子节点依次启动间隔（秒） */
    private static readonly REVEAL_CHILD_STAGGER = 0.2;
    /** 子节点快速渐显（秒） */
    private static readonly REVEAL_CHILD_FADE = 0.12;
    /** 子节点下落到位（秒），自由落体感 */
    private static readonly REVEAL_CHILD_FALL = 0.28;
    /** 槽位对应选项图标：在卡背子节点下落前的快速渐显（秒） */
    private static readonly OPTION_REVEAL_FADE = 0.12;
    /** 选中后未选槽位选项渐隐（秒） */
    private static readonly OPTION_UNSELECTED_FADE_OUT = 0.22;
    /** 手指节点：Y 在槽位本地 Y 基础上再向上偏移（与根节点同坐标系） */
    private static readonly HAND_ANI_OFFSET_Y = 30;
    /** 技能等级上限：达到后该槽位按钮隐藏、背景置灰，不可再升级 */
    private static readonly SKILL_LEVEL_CAP = 3;
    /** 编辑器里每个 cardBG 的初始 fillRange（揭示动画从此值过渡到 -1） */
    private _cardBgFillRangeInit: number[] = [];
    /** 编辑器里每个底部箭头的初始本地坐标（过渡到 (0,0,0)） */
    private _arrowLocalPosInit: Vec3[] = [];
    /**
     * 选项主图标(行优先展平 row-major)：总长度 = optionArr.length × 每选项档位数。
     * 档位数 = 本数组 length / optionArr.length（须整除；若档位数小于 SKILL_LEVEL_CAP+1，高等级会裁到最后一档，与「每行 3 张图」时一致）。
     */
    @property({ type: [SpriteFrame], displayName: '选项主图标(展平)', tooltip: '行优先: 先排选项0各等级, 再选项1…; 总长=选项数×每档张数' })
    optionRankIconRows: SpriteFrame[] = [];
    onLoad() {
        this.node.active = false;
        this.tran = this.node.getComponent(UITransform);
        for (let index = 0; index < this.optionArr.length; index++) {
            //初始化所有选项的等级为0
            this.curSelectSkillLevel[index] = 0;
        }
        this.originBgScale = this.cardBG[0].node.scale.clone();
        for (let i = 0; i < this.cardBG.length; i++) {
            this._cardBgFillRangeInit[i] = -0.37;
            const ar = this.cardFillArrow[i];
            this._arrowLocalPosInit[i] = ar ? ar.node.position.clone() : v3(0, 0, 0);
        }
        app.event.on(CommonEvent.UnlockSkill, this.activeUnlock, this);
        this.cardFrameEffect.active = false;
    }
    /** @param data.skipWaveAdvanceOnPick 为 true 时本次选技能不推进波次奖励逻辑 */
    activeUnlock(data?: { skipWaveAdvanceOnPick?: boolean }) {
        this._skipWaveAdvanceOnPick = !!data?.skipWaveAdvanceOnPick;
        this.unscheduleAllCallbacks();
        this._selectAnimating = false;
        this.handAniNode.active = false;
        this.cardFrameEffect.active = false;
        if (this.optionArr.length < 1) return;

        this.curSelectArr = this.shuffleAndSelect([...this.optionArr], this.optionArr.length);
        this.attachOptionsToFixedSlots();
        this.applySlotBackgroundsByOptionIndex();

        this.scheduleOnce(() => {
            this.node.setScale(0.2, 0.2);
            this.node.active = true;
            for (let index = 0; index < this.cardBG.length; index++) {
                const bg = this.cardBG[index];
                bg.node.setScale(this.originBgScale);
                bg.node.angle = 0;
                bg.fillRange = this._cardBgFillRangeInit[index] ?? bg.fillRange;
                this.hideUiNode(bg.node);
                const ar = this.cardFillArrow[index];
                if (ar) {
                    ar.node.setPosition(this._arrowLocalPosInit[index]);
                    this.hideUiNode(ar.node);
                }
            }
            for (const opt of this.optionArr) {
                this.hideUiNode(opt);
            }
            for (const btn of this.buttonArr) {
                btn.active = false;
            }
            GameInfo.instance.GamePause();

            tween(this.node)
                .to(0.2, { scale: this.originBgScale }, { easing: easing.quadOut })
                .call(() => {
                    this.playSelectSlotReveal(0);

                    this.scheduleOnce(() => {
                        this.playSelectSlotReveal(1)
                    }, 0.3);

                    this.scheduleOnce(() => {
                        this.playSelectSlotReveal(2, () => {
                            this.applyChoiceButtonsVisibilityForCap(true);
                            this.scheduleOnce(() => {
                                const slot = this.getHandGuideSlotIndex();
                                const sp = this.cardBG[slot].node.position;
                                this.handAniNode.setPosition(sp.x, sp.y + ViewUnlockSkill.HAND_ANI_OFFSET_Y, sp.z);
                                this.handAniNode.active = true;
                                this.handAniNode.getComponent(Animation).play();
                            }, 0.5);
                        });
                    }, 0.6);
                })
                .start();
        }, 0.0);
    }

    /**
     * 将洗牌后的选项摆到各卡槽横向对齐位置：不挂到 cardBG 下，挂到与 cardBG 相同父节点，本地坐标 (cardBG.x, OPTION_ICON_LOCAL_Y, 0)。
     */
    private attachOptionsToFixedSlots(): void {
        for (let slot = 0; slot < this.curSelectArr.length; slot++) {
            const element = this.curSelectArr[slot];
            const cardNode = this.cardBG[slot].node;
            const parent = cardNode.parent;
            if (parent) element.setParent(parent);
            const cx = cardNode.position.x;
            // 只有X坐标变化
            element.x = cx;
        }
    }
    /**
     * 按「选项在 optionArr 中的下标」取等级，赋给该槽位的背景框。
     * 解决：洗牌后若仍用 curSelectSkillLevel[slot]，会把「槽位等级」错当成「选项等级」。
     */
    private applySlotBackgroundsByOptionIndex(): void {
        for (let slot = 0; slot < this.cardBG.length; slot++) {
            const lv = this.getSkillLevelForSlot(slot);
            const displayLv = Math.min(lv, ViewUnlockSkill.SKILL_LEVEL_CAP);
            const isGray = lv >= ViewUnlockSkill.SKILL_LEVEL_CAP;
            const frameIdx = Math.min(Math.max(0, displayLv), this.bgRank.length - 1);
            const frame = this.bgRank[frameIdx];
            const sp = this.cardBG[slot];
            sp.spriteFrame = frame;
            sp.grayscale = lv >= ViewUnlockSkill.SKILL_LEVEL_CAP;
            const arrow = this.cardFillArrow[slot];
            if (arrow) {
                arrow.spriteFrame = frame;
                arrow.grayscale = isGray;
            }
            //卡片子节点等级图
            const cardChildFrame = this.cardChildrenRank[frameIdx];
            if (cardChildFrame) {
                sp.node.children.forEach((child) => {
                    child.getComponent(Sprite).spriteFrame = cardChildFrame;
                });
            }
            const optNode = this.curSelectArr[slot];
            if (optNode) this.applyOptionIconBorder(optNode, displayLv, isGray);

            const option = this.curSelectArr[slot];
            if (option) {
                const skillIndex = this.optionArr.indexOf(option);
                const icon = this.getOptionMainIconBySkillIndex(skillIndex, displayLv);
                const iconSp = option.children[1].getComponent(Sprite);
                if (icon && iconSp) iconSp.spriteFrame = icon;
            }
        }
    }

    /**
     * 行优先下标取选项中心主图：第 skillIndex 个选项、展示等级 displayLv。
     * 每选项占用的张数 = optionRankIconRows.length / optionArr.length（两数须匹配）。
     */
    private getOptionMainIconBySkillIndex(skillIndex: number, displayLv: number): SpriteFrame | null {
        if (skillIndex < 0) return null;
        const le = this.optionArr.length;
        if (le <= 0) return null;
        const iconArr = this.optionRankIconRows;
        if (!iconArr.length) return null;
        const nPer = Math.max(1, Math.floor(iconArr.length / le));
        const lv = Math.min(Math.max(0, displayLv), nPer - 1);
        const idx = skillIndex * nPer + lv;
        return iconArr[idx] ?? null;
    }

    /** 按等级设置选项上的图标边框 Sprite（optionFrameRank） */
    private applyOptionIconBorder(optionNode: Node, displayLv: number, gray: boolean): void {
        const ranks = this.optionFrameRank;
        if (!ranks.length) return;
        const sp = optionNode.getComponent(Sprite);
        if (!sp) return;
        const fi = Math.min(Math.max(0, displayLv), ranks.length - 1);
        sp.spriteFrame = ranks[fi];
        sp.grayscale = gray;
    }

    /** 槽位对应选项的当前技能等级 */
    private getSkillLevelForSlot(slot: number): number {
        if (slot < 0 || slot >= this.curSelectArr.length) return 0;
        const optionNode = this.curSelectArr[slot];
        const optionIdx = this.optionArr.indexOf(optionNode);
        if (optionIdx < 0 || optionIdx >= this.curSelectSkillLevel.length) return 0;
        return this.curSelectSkillLevel[optionIdx];
    }

    /**
     * 满级槽位隐藏按钮，未满级且 overallVisible 为 true 时显示（揭示动画结束后再传 true）。
     */
    private applyChoiceButtonsVisibilityForCap(overallVisible: boolean): void {
        const btns = this.buttonArr;
        for (let s = 0; s < btns.length; s++) {
            const lv = this.getSkillLevelForSlot(s);
            btns[s].active = overallVisible && lv < ViewUnlockSkill.SKILL_LEVEL_CAP;
        }
    }

    /**
     * 单个槽位揭示：根节点不位移；cardBG.fillRange 从编辑器初值过渡到 -1；
     * card 与底部箭头为兄弟节点：二者 UIOpacity 同步 0→255；箭头位移动到目标后 active=false；
     * 随后 playOptionRevealThenCardChildrenFall：选项渐显与 card 子节点错开下落同帧开始（未满级播选项位特效）。
     */
    private playSelectSlotReveal(slotIndex: number, onComplete?: () => void): void {
        const cardSpr = this.cardBG[slotIndex];
        const bgNode = cardSpr.node;
        const uiOp = this.ensureUiOpacity(bgNode);
        const arrowSpr = this.cardFillArrow[slotIndex];
        const arrowNode = arrowSpr?.node ?? null;

        this.stopUiOpacityTweens(bgNode);
        Tween.stopAllByTarget(cardSpr);

        let arrowNodeEndPos: Vec3 | null = null;
        if (arrowNode) {
            this.stopUiOpacityTweens(arrowNode);
            arrowNodeEndPos = this._arrowLocalPosInit[slotIndex].clone();
            arrowNodeEndPos.y = 0;
        }

        const fill0 = this._cardBgFillRangeInit[slotIndex] ?? cardSpr.fillRange;
        cardSpr.fillRange = fill0;
        bgNode.setScale(this.originBgScale);
        this.showUiNode(bgNode, 0);

        if (arrowNode && arrowNodeEndPos) {
            arrowNode.setPosition(this._arrowLocalPosInit[slotIndex]);
            this.showUiNode(arrowNode, 0);
        }

        const optForSlot = this.curSelectArr[slotIndex];
        if (optForSlot) {
            this.showUiNode(optForSlot, 0);
        }

        const children = bgNode.children.slice();
        const childOrigPos: Vec3[] = [];
        for (let c = 0; c < children.length; c++) {
            const ch = children[c];
            this.stopUiOpacityTweens(ch);
            const cop = this.ensureUiOpacity(ch);
            childOrigPos[c] = ch.position.clone();
            const o = childOrigPos[c];
            ch.setPosition(o.x, o.y + ViewUnlockSkill.REVEAL_CHILD_START_OFFSET_Y, o.z);
            cop.opacity = 0;
        }

        const dur = ViewUnlockSkill.REVEAL_FILL_DURATION;
        const twParts: Tween<Sprite | Node | UIOpacity>[] = [
            tween(cardSpr).to(dur, { fillRange: -1 }, { easing: easing.quadOut }),
            tween(uiOp).to(dur, { opacity: 255 }, { easing: easing.sineOut }),
        ];
        const arrowOp = arrowNode ? this.ensureUiOpacity(arrowNode) : null;
        if (arrowNode && arrowNodeEndPos && arrowOp) {
            twParts.push(tween(arrowNode).to(dur, { position: arrowNodeEndPos }, { easing: easing.quadOut }));
            twParts.push(tween(arrowOp).to(dur, { opacity: 255 }, { easing: easing.sineOut }));
        }

        tween(bgNode)
            .parallel(...twParts)
            .call(() => {
                if (arrowNode) this.hideUiNode(arrowNode);
                this.playOptionRevealThenCardChildrenFall(slotIndex, children, childOrigPos, onComplete)
            })
            .start();
    }

    /**
     * 未满级槽位中，取「当前等级」最高者对应槽位；平局时优先 optionArr[1] 所在槽位；若 optionArr[1] 已满级不在候选中，则取平局中的最小槽位索引。
     * 若全部满级，返回 null。
     */
    private getHighestNonMaxSlotIndexWithTieBreak(): number | null {
        const cap = ViewUnlockSkill.SKILL_LEVEL_CAP;
        const n = this.curSelectArr.length;
        const eligible: number[] = [];
        for (let s = 0; s < n; s++) {
            if (this.getSkillLevelForSlot(s) >= cap) continue;
            eligible.push(s);
        }
        if (eligible.length === 0) return null;

        let bestLv = -1;
        for (const s of eligible) {
            const lv = this.getSkillLevelForSlot(s);
            if (lv > bestLv) bestLv = lv;
        }
        const tied = eligible.filter((s) => this.getSkillLevelForSlot(s) === bestLv);
        const poolSecond = this.optionArr[1];
        if (poolSecond) {
            for (const s of tied) {
                if (this.curSelectArr[s] === poolSecond) return s;
            }
        }
        return Math.min(...tied);
    }

    /** 显示卡片边框特效：指向未满级中等级最高槽位，平局规则同手指指引 */
    private tryShowSpecialOptionCardFrameEffect(slotIndex: number): void {
        const target = this.getHighestNonMaxSlotIndexWithTieBreak();
        if (target === null) {
            this.cardFrameEffect.active = false;
            return;
        }
        if (slotIndex !== target) return;

        const cardNode = this.cardBG[slotIndex]?.node;
        if (!cardNode) return;
        this.cardFrameEffect.x = cardNode.position.x - 2;
        this.cardFrameEffect.active = true;
        const original = this.cardFrameEffect.getScale();
        this.cardFrameEffect.scale = v3(0.2, 0.2, 0.2)
        tween(this.cardFrameEffect)
            .delay(0.1)
            .to(0.2, { scale: original })
            .start();
    }
    /**
     * 当前槽位选项渐显 + 未满级播选项位特效；与子节点下落同帧启动。
     * 无选项节点时直接走卡片子节点下落；无子节点时等选项渐显时长后再 onComplete。
     */
    private playOptionRevealThenCardChildrenFall(
        slotIndex: number,
        children: Node[],
        childOrigPos: Vec3[],
        onComplete?: () => void,
    ): void {
        const optNode = this.curSelectArr[slotIndex];
        if (!optNode) {
            this.playCardChildrenStaggerFall(children, childOrigPos, onComplete);
            return;
        }

        this.stopUiOpacityTweens(optNode);
        this.ensureUiOpacity(optNode).opacity = 0;

        const lv = this.getSkillLevelForSlot(slotIndex);
        if (lv < ViewUnlockSkill.SKILL_LEVEL_CAP) {
            GameInfo.instance.prefabMgr.createViewCardEffect(this.node, optNode.position.clone());
            this.tryShowSpecialOptionCardFrameEffect(slotIndex);
        }

        const op = this.ensureUiOpacity(optNode);
        tween(op)
            .to(ViewUnlockSkill.OPTION_REVEAL_FADE, { opacity: 255 }, { easing: easing.sineOut })
            .start();

        if (children.length === 0) {
            this.scheduleOnce(() => onComplete?.(), ViewUnlockSkill.OPTION_REVEAL_FADE);
        } else if (lv >= ViewUnlockSkill.SKILL_LEVEL_CAP) {
            children.forEach(child => {
                child.setPosition(childOrigPos[child.getSiblingIndex()]);
            });
            onComplete?.();
        }
        else {
            this.playCardChildrenStaggerFall(children, childOrigPos, onComplete);
        }
    }

    /** 卡片子节点动画：错开渐显后下落；最后一个到位时 onComplete */
    private playCardChildrenStaggerFall(
        children: Node[],
        childOrigPos: Vec3[],
        onComplete?: () => void,
    ): void {
        const stagger = ViewUnlockSkill.REVEAL_CHILD_STAGGER;
        const fadeT = ViewUnlockSkill.REVEAL_CHILD_FADE;
        const fallT = ViewUnlockSkill.REVEAL_CHILD_FALL;
        const last = children.length - 1;

        if (children.length === 0) {
            onComplete?.();
            return;
        }

        for (let k = 0; k < children.length; k++) {
            const idx = k;
            const child = children[idx];
            const orig = childOrigPos[idx];
            this.scheduleOnce(() => {
                this.stopUiOpacityTweens(child);
                const cop = this.ensureUiOpacity(child);
                tween(cop)
                    .to(fadeT, { opacity: 255 }, { easing: easing.sineOut })
                    .call(() => {
                        tween(child)
                            .to(fallT, { position: orig }, { easing: easing.cubicIn })
                            .call(() => {
                                if (idx === last) onComplete?.();
                            })
                            .start();
                    })
                    .start();
            }, idx * stagger);
        }
    }

    selectOption(e: Event, select: string) {
        if (this._selectAnimating) return;
        if (this.curSelectArr.length < 1) return;
        const i = parseInt(select, 10);
        if (i < 0 || i >= this.curSelectArr.length || i >= this.cardBG.length) return;
        const option = this.curSelectArr[i];
        const skillIndex = this.optionArr.indexOf(option);
        if (skillIndex < 0) return;
        if (this.curSelectSkillLevel[skillIndex] >= ViewUnlockSkill.SKILL_LEVEL_CAP) return;
        this.cardFrameEffect.active = false;
        this._selectAnimating = true;
        this.setChoiceButtonsInteractable(false);

        const selectedBg = this.cardBG[i].node;
        const baseScale = selectedBg.scale.clone();
        const punchScale = v3(baseScale.x * 1.12, baseScale.y * 1.12, baseScale.z);
        const fadeDur = ViewUnlockSkill.OPTION_UNSELECTED_FADE_OUT;

        for (let j = 0; j < this.cardBG.length; j++) {
            if (j === i) continue;
            this.fadeOutUiOpacity(this.cardBG[j].node, fadeDur);
            this.fadeOutUiOpacity(this.curSelectArr[j], fadeDur);
        }

        this.stopUiOpacityTweens(selectedBg);
        tween(selectedBg)
            .to(0.12, { scale: punchScale }, { easing: easing.quadOut })
            .to(0.15, { scale: baseScale }, { easing: easing.quadIn })
            .call(() => this.finishSelectOption(skillIndex))
            .start();
    }

    /** 选中动画结束后：升级、关闭界面、恢复游戏 */
    private finishSelectOption(skillIndex: number): void {
        const selectedOpt = this.optionArr[skillIndex];
        if (selectedOpt) this.hideUiNode(selectedOpt);

        const next = this.curSelectSkillLevel[skillIndex] + 1;
        this.curSelectSkillLevel[skillIndex] = Math.min(next, ViewUnlockSkill.SKILL_LEVEL_CAP);
        this.curSelectArr = [];
        this.node.active = false;
        this._selectAnimating = false;
        this.setChoiceButtonsInteractable(true);
        GameInfo.instance.GameResume();
        app.event.emit(CommonEvent.UpgradeSkill, { skillIndex: skillIndex, advanceWave: !this._skipWaveAdvanceOnPick });
    }

    /**
     * 手指指引槽位：与 getHighestNonMaxSlotIndexWithTieBreak 同规则；若无未满级槽位（退化），回退为 0。
     */
    private getHandGuideSlotIndex(): number {
        return this.getHighestNonMaxSlotIndexWithTieBreak() ?? 0;
    }

    private ensureUiOpacity(node: Node): UIOpacity {
        return node.getComponent(UIOpacity) ?? node.addComponent(UIOpacity);
    }

    /** 停止节点及其 UIOpacity 上的 tween */
    private stopUiOpacityTweens(node: Node): void {
        Tween.stopAllByTarget(node);
        const u = node.getComponent(UIOpacity);
        if (u) Tween.stopAllByTarget(u);
    }

    /** 隐藏：透明度 0 + 关闭节点（下次 show 再显式打开） */
    private hideUiNode(node: Node): void {
        this.stopUiOpacityTweens(node);
        this.ensureUiOpacity(node).opacity = 0;
        node.active = false;
    }

    /** 显示并设置初始透明度（用于从 0 做渐显或直接不透明） */
    private showUiNode(node: Node, initialOpacity: number): void {
        this.stopUiOpacityTweens(node);
        this.ensureUiOpacity(node).opacity = initialOpacity;
        node.active = true;
    }

    /** UIOpacity 渐隐到 0 */
    private fadeOutUiOpacity(node: Node, duration: number): void {
        this.stopUiOpacityTweens(node);
        const op = this.ensureUiOpacity(node);
        tween(op).to(duration, { opacity: 0 }, { easing: easing.sineIn }).start();
    }

    private setChoiceButtonsInteractable(on: boolean): void {
        for (const n of this.buttonArr) {
            const btn = n.getComponent(Button);
            if (btn) btn.interactable = on;
        }
    }
    /** Fisher-Yates 洗牌：仅打乱选项节点顺序，等级仍由 optionArr 下标在 curSelectSkillLevel 中查找 */
    shuffleAndSelect(arr: any[], count: number) {
        if (arr.length < count) return arr;
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, count);
    }
}

