import { _decorator, Node, Tween, tween, v3, Vec3 } from 'cc';
import { BattleTarget3D } from '../Battle/BattleTarger/BattleTarget3D';
import BulletMonsterCollisionManager from '../Battle/BulletMonsterCollisionManager';
import PoolManager from '../../Base/PoolManager';
import { OtherPrefabsEnum, PoolEnum } from '../../Base/EnumList';

const { ccclass } = _decorator;

@ccclass('PropTireGate')
export class PropTireGate extends BattleTarget3D {

    public poolOnDie: boolean = true;

    private _onDie: () => void = null;

    private _initialScale: Vec3 = new Vec3(1, 1, 1);

    public initGate(onDie: () => void, hp: number) {
        this._onDie = onDie;
        this.MaxHp = hp;
        this.curHp = hp;
        this.isDestroy = false;
        this.node.active = true;
        this._initialScale.set(this.node.scale);
        this.node.setScale(this._initialScale);
        BulletMonsterCollisionManager.instance.registerTarget(this);
    }

    public repelBattleTarget(target: Node, reoel: number): void {
    }

    protected _update(dt: number): void {
    }

    protected damage(power: number): void {
        this.flashRed(0.12);
        Tween.stopAllByTarget(this.node);
        const s1 = PoolManager.instance.V3.set(Vec3.ONE);
        const s2 = PoolManager.instance.V3.set(Vec3.ONE).multiplyScalar(1.18);
        tween(this.node)
            .to(0.06, { scale: s2 }, { easing: 'sineOut' })
            .to(0.08, { scale: s1 }, { easing: 'backOut' })
            .call(() => {
                PoolManager.instance.V3 = s1;
                PoolManager.instance.V3 = s2;
            })
            .start();
    }

    protected die(): void {
        BulletMonsterCollisionManager.instance.unregisterTarget(this);
        const onDie = this._onDie;
        this._onDie = null;
        onDie?.();

        Tween.stopAllByTarget(this.node);
        tween(this.node)
            .to(0.08, { scale: v3(1.25, 1.25, 1.25) }, { easing: 'sineOut' })
            .to(0.1, { scale: Vec3.ZERO }, { easing: 'sineIn' })
            .call(() => {
                this.node.active = false;
                this.node.setScale(this._initialScale);
                if (this.poolOnDie) {
                    PoolManager.instance.setPool(PoolEnum.Other + OtherPrefabsEnum.tire, this.node);
                }
            })
            .start();
    }
}