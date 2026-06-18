import { _decorator, CCFloat, CCInteger, ITriggerEvent, Node, tween, Tween, Vec3 } from 'cc';
import PoolManager from '../../Base/PoolManager';
import { PropBrand } from './PropBrand';
import { EffectEnum, EventType, LayerEnum, PoolEnum, PrefabsEnum, SoundEnum } from '../../Base/EnumList';
import { PrefabsManager } from '../../Base/PrefabsManager';
import { Player } from '../Player/Player';
import { Role } from '../Player/Role';
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

    @property({ type: CCInteger, displayName: '展示数量', tooltip: '开局先摆出来的 +1/+99 道具数量，只影响初始队列长度。' })
    public showCount: number = 15;

    @property({ type: CCFloat, displayName: '道具间距', tooltip: '道具队列里相邻两个道具在 Z 轴上的距离。' })
    public distance: number = 1.5;

    @property({ type: CCFloat, displayName: '道具高度', tooltip: '道具生成时的 Y 轴高度。' })
    public height: number = 1.665;

    @property({ type: CCInteger, displayName: '每个道具数值', tooltip: '每个道具显示和生效的数值。左边 +1 填 1，右边 +99 填 99。' })
    public count: number = 1;

    @property({ type: CCFloat, displayName: '移动速度', tooltip: '拉链完成后，道具队列向玩家移动的速度。' })
    public moveSpeed: number = 2;

    @property({ type: PropLalianGate, displayName: 'Lalian拉链组件', tooltip: '拖入同一侧 Prop_arms 上的 PropLalianGate。为空时会自动在当前节点子级查找。' })
    public lalianGate: PropLalianGate;

    @property({ type: CCFloat, displayName: '道具起始Z额外偏移', tooltip: '在拉链自动计算的起始 Z 基础上额外加的偏移。用于微调 +1/+99 队列离拉链的远近。' })
    public propStartZ: number = 0;

    @property({ type: Node, displayName: '道具挂载父节点', tooltip: '生成出来的 +1/+99 道具会挂到这个节点下面。通常填当前通道的 wall/root 节点。' })
    public wallNode: Node;

    @property({ type: CCInteger, displayName: '道具类型', tooltip: '对应 PrefabsEnum.prop 的预制体类型编号。保持和原来左/右道具类型一致。' })
    public type: number = 0;

    private propBrandList: PropBrand[] = [];

    private tempPropBrandList: PropBrand[] = [];

    private isMove: boolean = false;

    private pendingReleaseCount: number = 0;

    private tempV3: Vec3 = new Vec3();

    private get activeLalianGate() {
        if (!this.lalianGate) {
            this.lalianGate = this.findLalianGate(this.node);
        }
        return this.lalianGate;
    }

    private get activePropStartZ() {
        return this.propStartZ + (this.activeLalianGate?.getPropStartZ() ?? 0);
    }

    start() {
        const startZ = this.activePropStartZ;

        for (let i = 0; i < this.showCount; i++) {
            const p = this.propBrand;
            this.propBrandList.push(p);
            this.wallNode.addChild(p.node);
            p.node.x = 0;
            p.node.y = this.height;
            p.node.z = startZ + i * this.distance;
        }

        const gate = this.activeLalianGate;
        if (gate) {
            gate.node.off(EventType.PROP_ARMS_DIE, this.lalianDoneEvent, this);
            gate.node.on(EventType.PROP_ARMS_DIE, this.lalianDoneEvent, this);
        }
    }

    protected onDestroy(): void {
        this.activeLalianGate?.node.off(EventType.PROP_ARMS_DIE, this.lalianDoneEvent, this);
    }

    private lalianDoneEvent(info: LalianDoneInfo) {
        const count = (info?.moveCount ?? 0) > 0 ? info.moveCount : -1;
        this.move(count);
    }

    _update(deltaTime: number) {
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

                if (p.node.z <= -0.614 && p.node.y > -0.753) {
                    p.node.y -= this.moveSpeed * deltaTime * 0.5;
                    if (p.node.y <= -0.753) {
                        p.node.y = -0.753;
                    }
                }
            }
        }

        for (let i = this.tempPropBrandList.length - 1; i >= 0; i--) {
            const p = this.tempPropBrandList[i];
            p.node.z -= this.moveSpeed * deltaTime;

            if (p.node.z <= -0.614) {
                p.node.y -= this.moveSpeed * deltaTime * 0.35;
                if (p.node.y <= -0.753) {
                    p.node.y = -0.753;
                }
            }

            if (p.node.z <= -30) {
                this.tempPropBrandList.splice(i, 1);
                p.node.active = false;
                PoolManager.instance.setPool(PoolEnum.Prop + this.type, p);
            }
        }
    }

    private appendPropBrands(count: number) {
        const last = this.propBrandList[this.propBrandList.length - 1];
        const appendStartZ = last ? last.node.z + this.distance : this.activePropStartZ;
        for (let i = 0; i < count; i++) {
            const p = this.propBrand;
            this.wallNode.addChild(p.node);
            p.node.x = 0;
            p.node.y = this.height;
            p.node.z = appendStartZ + i * this.distance;
            this.propBrandList.push(p);
        }
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
        p.init(this.count);
        return p;
    }

    private onTriggerEnter(event: ITriggerEvent) {
        const player = event.otherCollider.getComponent(Player);
        if (!player) {
            return;
        }

        let role = PoolManager.instance.getPool<Role>(PoolEnum.role + player.roleType);
        if (!role) {
            const node = PrefabsManager.instance.GetPrefabsIns(PrefabsEnum.hero, player.roleType);
            role = node.getComponent(Role);
        }

        const layer = LayerManager.instance.getLayer(LayerEnum.Layer_1_Ground);
        layer.addChild(role.node);
        const selfPos = event.selfCollider.node.worldPosition;
        role.node.setWorldPosition(selfPos);
        role.hp = 2;
        role.node.active = true;

        const propBrand = event.selfCollider.getComponent(PropBrand);
        if (propBrand?.count >= 99) {
            role.node.active = false;
            PoolManager.instance.setPool(PoolEnum.role + player.roleType, role);
            this.recycleTriggeredProp(propBrand);
            GameOverPanel.instance.show(true);
            return;
        }
        if (!player.addRole(role)) {
            role.node.active = false;
            PoolManager.instance.setPool(PoolEnum.role + player.roleType, role);
            const propBrandIndex = this.tempPropBrandList.indexOf(propBrand);
            if (propBrandIndex !== -1) {
                this.tempPropBrandList.splice(propBrandIndex, 1);
            }
            this.scheduleOnce(() => {
                if (!propBrand) {
                    return;
                }
                propBrand.node.active = false;
                PoolManager.instance.setPool(PoolEnum.Prop + this.type, propBrand);
                propBrand.collide.off("onTriggerEnter", this.onTriggerEnter, this);
            }, 0);
            return;
        }

        const pos = player.getNextPos();
        const index = player.length - 1;
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

        JumpManager.instance.jumpBezierByPoints(role.node, 3, cPos, pos).onComplete(() => {
            AudioManager.inst.playOneShot(SoundEnum.Sound_Ship_UpLevel);
            role.attackIN = false;
            PoolManager.instance.V3 = pos;
            PoolManager.instance.V3 = cPos;
            const selfPos2 = player.getNextPos(index);
            player.node.addChild(role.node);
            role.node.setWorldPosition(selfPos2);
            player.upMoveBoundary();
            if (role.arms) {
                role.arms.active = true;
            }
            PoolManager.instance.V3 = selfPos2;
        }).setEndPosPre((prop: Node) => {
            const curPos = player.getNextPos(index);
            curPos.subtract(pos);
            curPos.add(prop.worldPosition);
            prop.setWorldPosition(curPos);
            PoolManager.instance.V3 = curPos;
        }, null);

        const propBrandIndex = this.tempPropBrandList.indexOf(propBrand);
        if (propBrandIndex !== -1) {
            this.tempPropBrandList.splice(propBrandIndex, 1);
        }
        this.scheduleOnce(() => {
            Tween.stopAllByTarget(this.node);
            propBrand.node.active = false;
            PoolManager.instance.setPool(PoolEnum.Prop + this.type, propBrand);
            propBrand.collide.off("onTriggerEnter", this.onTriggerEnter, this);
        }, 0);
    }

    private recycleTriggeredProp(propBrand: PropBrand): void {
        const propBrandIndex = this.tempPropBrandList.indexOf(propBrand);
        if (propBrandIndex !== -1) {
            this.tempPropBrandList.splice(propBrandIndex, 1);
        }
        propBrand.node.active = false;
        PoolManager.instance.setPool(PoolEnum.Prop + this.type, propBrand);
        propBrand.collide.off("onTriggerEnter", this.onTriggerEnter, this);
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
}
