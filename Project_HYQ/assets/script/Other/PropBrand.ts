import { _decorator, CCFloat, Collider, Component, ITriggerEvent, Label, Node, tween, Tween, v3, Vec3 } from 'cc';
import { ColliderGroupTag, PrefabPathEnum } from '../Common/CommonEnum';
import { GameInfo } from '../Common/GameInfo';
import { RoleSoldier } from '../Battle/RoleSoldier';
import { ColliderTag } from './ColliderTag';
import { FlashMeshManager } from '../Manager/FlashMeshManager';

const { ccclass, property } = _decorator;

/** 道具牌组件，显示数量并承载拾取碰撞体 */
@ccclass('PropBrand')
export class PropBrand extends Component {

    @property(Label)
    public lab: Label = null!;

    @property({ type: CCFloat, displayName: '相对Hero回收Z距离' })
    public diffZ: number = 30;

    public _collider: Collider = null!;

    public count: number = 0;

    private _pickable: boolean = false;
    private _moveSpeed: number = 0;
    private _picked: boolean = false;
    private readonly _tempWorldPos: Vec3 = new Vec3();

    protected onLoad(): void {
        this._collider = this.node.getComponent(Collider);
        if (this._collider) {
            this._collider.on(`onTriggerEnter`, this.onTriggerEnter, this);
        }
    }

    init(num: number = 1) {
        this.count = num;
        this._pickable = false;
        this._moveSpeed = 0;
        this._picked = false;
        if (this.lab) {
            this.lab.string = `+${num}`;
        }
    }

    /** 脱离滑轨后由 CollectionManager 调用，开始可拾取移动 */
    enterPickablePhase(speed: number) {
        this._pickable = true;
        this._moveSpeed = speed;
    }

    update(dt: number) {
        if (!this._pickable || this._picked) {
            return;
        }
        if (!GameInfo.instance.Begin || GameInfo.instance.Pause || GameInfo.instance.Over) {
            return;
        }

        this.node.getWorldPosition(this._tempWorldPos);
        this._tempWorldPos.z += GameInfo.WorldForwardZSign * this._moveSpeed * dt;
        this.node.setWorldPosition(this._tempWorldPos);

        this.tryRecycleByHeroDistance();
    }

    private tryRecycleByHeroDistance() {
        const hero = GameInfo.instance.player;
        if (!hero?.node?.isValid) {
            return;
        }
        const heroZ = hero.node.worldPosition.z;
        const brandZ = this.node.worldPosition.z;
        if ((brandZ - heroZ) * GameInfo.WorldForwardZSign > this.diffZ) {
            this.recycleSelf();
        }
    }

    protected onTriggerEnter(event: ITriggerEvent) {
        if (!this._pickable || this._picked) {
            return;
        }
        const tagComp = event.otherCollider.node.getComponent(ColliderTag);
        if (!tagComp || tagComp.tag !== ColliderGroupTag.Player) {
            return;
        }

        this._picked = true;
        const selfPos = event.selfCollider.node.worldPosition;
        const soldierNode = this.spawnSoldierAt(selfPos);
        if (soldierNode) {
            this.playPickUpFeedback(selfPos, soldierNode);
        }

        this.scheduleOnce(() => {
            Tween.stopAllByTarget(this.node);
            this.recycleSelf();
        }, 0);
    }

    private spawnSoldierAt(worldPos: Vec3): Node | null {
        const soldierNode = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.SOLDIER);
        if (!soldierNode) {
            return null;
        }

        soldierNode.active = true;
        const hero = GameInfo.instance.player;
        const soldierComp = soldierNode.getComponent(RoleSoldier);
        if (soldierComp && hero) {
            hero.registerSoldier(soldierComp, worldPos);
        } else {
            soldierNode.setParent(GameInfo.instance.gameMgr.gameLayer);
            soldierNode.setWorldPosition(worldPos);
        }
        return soldierNode;
    }

    private playPickUpFeedback(worldPos: Vec3, soldierNode: Node) {
        const effectPos = worldPos.clone();
        effectPos.y += 1;
        const doorEffect = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.EFFECT_PROP_DOOR);
        if (doorEffect) {
            doorEffect.setParent(GameInfo.instance.gameMgr.effLayer);
            doorEffect.setWorldPosition(effectPos);
        }
        GameInfo.instance.prefabMgr.createPropUpEffect(soldierNode, v3(0, 0.2, 0));

        const soldier = soldierNode.getComponent(RoleSoldier);
        if (!soldier.ModelNode) {
            return;
        }

        const scaleOriginal = soldier.node.scale.clone();
        const scale2 = scaleOriginal.clone().multiplyScalar(1.5);
        FlashMeshManager.Ins.flashMesh(soldier.node, soldier.meshCreateDataList, 0.5);
        tween(soldier.node)
            .to(0.4, { scale: scale2 })
            .to(0.2, { scale: scaleOriginal }, { easing: 'backOut' })
            .start();
    }

    private recycleSelf() {
        this._pickable = false;
        this._picked = true;
        GameInfo.instance.prefabMgr.recoverPrefab(this.node);
    }
}
