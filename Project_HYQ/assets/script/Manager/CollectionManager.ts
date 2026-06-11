import { _decorator, CCFloat, CCInteger, Component, Node, Vec3 } from 'cc';
import { PrefabPathEnum } from '../Common/CommonEnum';
import { GameInfo } from '../Common/GameInfo';
import { PropBrand } from '../Other/PropBrand';
import { Tire } from '../Other/Tire';

const { ccclass, property } = _decorator;

/** 传送带上的一个 Tire 单元 */
interface ConveyorTireUnit {
    tire: Tire;
    brands: PropBrand[];
    slotIndex: number;
    targetWorldZ: number;
    /** 自生成以来沿 Z 轴累计移动距离，用于渐进补牌 */
    accumulatedMove: number;
}

@ccclass('CollectionManager')
export class CollectionManager extends Component {
    @property({ type: Node, displayName: '队列根节点' })
    public queueRoot: Node = null!;


    @property({ type: CCInteger, displayName: '每个Tire牌数量' })
    public showCount: number = 15;

    @property({ type: CCFloat, displayName: '首张牌距Tire偏移Z' })
    public offsetZ: number = 2;

    @property({ type: CCFloat, displayName: '牌间距Z' })
    public brandSpaceZ: number = 1.5;

    @property({ type: CCFloat, displayName: 'Tire节间距' })
    public queueSpace: number = 2;

    @property({ type: CCInteger, displayName: '最大Tire数量' })
    public maxTireCount: number = 3;

    @property({ type: CCInteger, displayName: '每张牌代表数量' })
    public count: number = 1;

    @property({ type: CCFloat, displayName: '移动速度' })
    public moveSpeed: number = 2;



    @property({ type: Node, displayName: '围栏节点' })
    public fenceNode: Node = null!;

    private _tireQueue: ConveyorTireUnit[] = [];
    private _isConveyorMoving: boolean = false;
    private _stopWorldZ: number = 0;
    private _tailWorldZ: number = 0;
    private _queueWorldX: number = 0;
    private _queueWorldY: number = 0;
    private _slotWorldZ: number[] = [];
    private _tireSlotDelta: number = 0;
    /** 开局建仓：下一辆 Tire 应在 head 到达此 slot 索引时生成 */
    private _nextFormationSlotIndex: number = -1;
    private readonly _tempWorldPos: Vec3 = new Vec3();

    public get conveyorStopped(): boolean {
        return !this._isConveyorMoving;
    }

    protected onLoad(): void {
        GameInfo.instance.collectionMgr = this;
        this.calcConveyorLayout();
    }

    start() {
        if (!this.queueRoot) {
            console.warn('[CollectionManager] queueRoot 未配置');
            return;
        }
        if (!this.fenceNode) {
            console.warn('[CollectionManager] fenceNode 未配置');
            return;
        }
        this.startInitialFormation();
    }

    update(dt: number) {
        if (!GameInfo.instance.Begin || GameInfo.instance.Pause || GameInfo.instance.Over) {
            return;
        }
        if (!this._isConveyorMoving) {
            return;
        }
        this.updateConveyor(dt);
    }

    /** 链头 Tire 是否可受击：位于 slot[0]、传送带已停止且为队列第一个 */
    public canTireBeAttacked(tire: Tire): boolean {
        if (!this.conveyorStopped || this._tireQueue.length === 0) {
            return false;
        }
        const head = this._tireQueue[0];
        if (head.tire !== tire || head.slotIndex !== 0) {
            return false;
        }
        const zSign = GameInfo.WorldForwardZSign;
        const headZ = head.tire.node.worldPosition.z;
        const stopZ = this._slotWorldZ[0];
        return (headZ - stopZ) * zSign >= 0;
    }

    public isHeadTire(tire: Tire): boolean {
        return this._tireQueue.length > 0 && this._tireQueue[0].tire === tire;
    }

    /** 链头 Tire 是否已到达 slot[0] 停靠位 */
    public isHeadTireAtSlot0(): boolean {
        if (this._tireQueue.length === 0) {
            return false;
        }
        const head = this._tireQueue[0];
        if (head.slotIndex !== 0) {
            return false;
        }
        const zSign = GameInfo.WorldForwardZSign;
        const headZ = head.tire.node.worldPosition.z;
        const stopZ = this._slotWorldZ[0];
        return (headZ - stopZ) * zSign >= 0;
    }

    /** 链头 Tire 死亡后由 Tire 延迟调用 */
    public onTireDie(deadTire: Tire) {
        if (!this.isHeadTire(deadTire) || this._tireQueue.length === 0) {
            return;
        }

        const deadUnit = this._tireQueue.shift()!;
        this.detachAllBrandsToEffLayer(deadUnit);
        this.recycleTire(deadUnit.tire);

        for (const unit of this._tireQueue) {
            unit.slotIndex--;
            unit.targetWorldZ = this._slotWorldZ[unit.slotIndex];
        }

        this.fenceNode.active = false;
        this._isConveyorMoving = true;
        this.syncTireCollisionRegistration();
        this.spawnTireAt(this._tailWorldZ, this.maxTireCount - 1);
    }

    /** onLoad 预计算各档位世界 Z */
    private calcConveyorLayout() {
        if (!this.fenceNode) {
            return;
        }

        const fenceWp = this.fenceNode.getWorldPosition();
        const zSign = GameInfo.WorldForwardZSign;
        this._stopWorldZ = fenceWp.z - zSign;
        this._queueWorldX = fenceWp.x;
        this._queueWorldY = fenceWp.y;

        // if (this.queueRoot) {
        //     const rootWp = this.queueRoot.worldPosition;
        //     this._queueWorldX = rootWp.x;
        //     this._queueWorldY = rootWp.y;
        // }

        this._tireSlotDelta = this.offsetZ + (this.showCount - 1) * this.brandSpaceZ + this.queueSpace;
        // zSign=-1：沿 Z-- 前进，stop 为最小 Z，tail 为最大 Z；zSign=+1 时相反
        this._slotWorldZ.length = 0;
        for (let k = 0; k < this.maxTireCount; k++) {
            this._slotWorldZ.push(this._stopWorldZ - k * this._tireSlotDelta * zSign);
        }
        this._tailWorldZ = this._slotWorldZ[this.maxTireCount - 1] - this._tireSlotDelta * zSign;
    }

    /** 开局：空队列，从尾部生成链头 Tire（目标 slot[0]）并开始建仓 */
    private startInitialFormation() {
        this._tireQueue.length = 0;
        this._nextFormationSlotIndex = this.maxTireCount - 1;
        this.fenceNode.active = false;
        this._isConveyorMoving = true;
        this.syncTireCollisionRegistration();
        // 首辆为链头，必须朝 _slotWorldZ[0] 移动，而非末档 slot
        this.spawnTireAt(this._tailWorldZ, 0);
    }

    /** 仅将满足攻击条件的链头 Tire 注册为子弹可检测目标 */
    private syncTireCollisionRegistration(): void {
        for (const unit of this._tireQueue) {
            if (this.canTireBeAttacked(unit.tire)) {
                unit.tire.registerCollisionTarget();
            } else {
                unit.tire.unregisterCollisionTarget();
            }
        }
    }

    private updateConveyor(dt: number) {
        const step = this.moveSpeed * dt;

        // 链头始终以 slot[0] 为终点
        if (this._tireQueue.length > 0) {
            const head = this._tireQueue[0];
            head.slotIndex = 0;
            head.targetWorldZ = this._slotWorldZ[0];
        }

        for (const unit of this._tireQueue) {
            this.moveTireUnit(unit, step);
            this.trySpawnBrandOnTire(unit);
        }

        this.trySpawnFormationTire();
        this.checkConveyorStop();
    }

    private moveTireUnit(unit: ConveyorTireUnit, step: number) {
        const node = unit.tire.node;
        const zSign = GameInfo.WorldForwardZSign;
        const curZ = node.worldPosition.z;
        const nextZ = curZ + zSign * step;

        if ((nextZ - unit.targetWorldZ) * zSign >= 0) {
            const moved = Math.abs(curZ - unit.targetWorldZ);
            node.setWorldPosition(this._queueWorldX, this._queueWorldY, unit.targetWorldZ);
            unit.accumulatedMove += moved;
        } else {
            node.setWorldPosition(this._queueWorldX, this._queueWorldY, nextZ);
            unit.accumulatedMove += step;
        }
    }

    /** 开局建仓：head 到达档位时从尾部追加下一辆 Tire */
    private trySpawnFormationTire() {
        if (this._tireQueue.length >= this.maxTireCount || this._nextFormationSlotIndex < 0) {
            return;
        }

        const head = this._tireQueue[0];
        const zSign = GameInfo.WorldForwardZSign;
        if (!head || (head.tire.node.worldPosition.z - this._slotWorldZ[this._nextFormationSlotIndex]) * zSign < 0) {
            return;
        }

        const newSlotIndex = this._nextFormationSlotIndex - 1;
        if (newSlotIndex < 0) {
            return;
        }
        this.spawnTireAt(this._tailWorldZ, newSlotIndex);
        this._nextFormationSlotIndex = newSlotIndex > 0 ? newSlotIndex : -1;
    }

    private checkConveyorStop() {
        const head = this._tireQueue[0];
        if (!head) {
            return;
        }

        const headStopZ = this._slotWorldZ[0];
        const zSign = GameInfo.WorldForwardZSign;
        if ((head.tire.node.worldPosition.z - headStopZ) * zSign >= 0) {
            head.tire.node.setWorldPosition(this._queueWorldX, this._queueWorldY, headStopZ);
            this._isConveyorMoving = false;
            this.fenceNode.active = true;
            this.syncTireCollisionRegistration();
            GameInfo.instance.guideMgr?.tryAdvanceGuideStep1();
        }
    }

    private trySpawnBrandOnTire(unit: ConveyorTireUnit) {
        if (unit.brands.length >= this.showCount) {
            return;
        }

        const nextBrandIndex = unit.brands.length;
        const needDist = this.offsetZ + nextBrandIndex * this.brandSpaceZ;
        if (unit.accumulatedMove < needDist) {
            return;
        }

        const brand = this.createPropBrand();
        if (!brand) {
            return;
        }

        unit.tire.brandQueueRoot.addChild(brand.node);
        brand.node.setPosition(0, 0, -needDist * GameInfo.WorldForwardZSign);
        unit.brands.push(brand);
    }

    private spawnTireAt(worldZ: number, slotIndex: number): ConveyorTireUnit | null {
        const node = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.PROP_TIRE);
        if (!node) {
            console.warn('[CollectionManager] PROP_TIRE 预制体获取失败');
            return null;
        }

        const tire = node.getComponent(Tire);
        if (!tire) {
            console.warn('[CollectionManager] PROP_TIRE 预制体缺少 Tire 组件');
            GameInfo.instance.prefabMgr.recoverPrefab(node);
            return null;
        }

        node.setParent(this.queueRoot);
        node.setWorldPosition(this._queueWorldX, this._queueWorldY, worldZ);

        const unit: ConveyorTireUnit = {
            tire,
            brands: [],
            slotIndex,
            targetWorldZ: this._slotWorldZ[slotIndex],
            accumulatedMove: 0,
        };
        this._tireQueue.push(unit);
        return unit;
    }

    private detachAllBrandsToEffLayer(unit: ConveyorTireUnit) {
        const effLayer = GameInfo.instance.gameMgr?.effLayer;
        if (!effLayer) {
            console.warn('[CollectionManager] effLayer 未配置');
            return;
        }

        for (const brand of unit.brands) {
            brand.node.getWorldPosition(this._tempWorldPos);
            brand.node.setParent(effLayer);
            brand.node.setWorldPosition(this._tempWorldPos);
            brand.enterPickablePhase(this.moveSpeed);
        }
        unit.brands.length = 0;
    }

    private createPropBrand(): PropBrand | null {
        const node = GameInfo.instance.prefabMgr.getPrefab(PrefabPathEnum.PROP_BRAND);
        if (!node) {
            return null;
        }

        node.active = true;
        const propBrand = node.getComponent(PropBrand);
        if (!propBrand) {
            console.warn('[CollectionManager] PROP_BRAND 预制体缺少 PropBrand 组件');
            GameInfo.instance.prefabMgr.recoverPrefab(node);
            return null;
        }
        propBrand.init(this.count);
        return propBrand;
    }

    private recycleTire(tire: Tire) {
        GameInfo.instance.prefabMgr.recoverPrefab(tire.node);
    }
}
