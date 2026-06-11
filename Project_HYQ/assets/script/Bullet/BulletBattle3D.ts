import { _decorator, CCFloat, CCInteger, Component, v3, Vec3, Node } from 'cc';
import { BULLET_HIT_ENEMY_TAGS, ColliderGroupTag, PrefabPathEnum } from '../Common/CommonEnum';
import { CharacterBase } from '../Battle/CharacterBase';
import { GameInfo } from '../Common/GameInfo';

const { ccclass, property } = _decorator;

/** 子弹克隆参数（翻倍牌批次生成用） */
export interface BulletCloneParams {
    damage: number;
    flyDir: Vec3;
    flySpeed: number;
    bulletLevel: number;
    prefabPath: PrefabPathEnum;
}

/** 3D 子弹：直线飞行 + 自定义 AABB 碰撞(无物理) */
@ccclass('BulletBattle3D')
export default class BulletBattle3D extends Component {
    @property({ type: CCFloat, tooltip: 'x方向碰撞半宽' })
    public collisionHalfX: number = 0.1;

    @property({ type: CCFloat, tooltip: 'z方向碰撞半深' })
    public collisionHalfZ: number = 0.29;

    @property({ type: [ColliderGroupTag], tooltip: '攻击目标标签(ColliderGroupTag)' })
    public attackTargetTag: ColliderGroupTag[] = [
        ColliderGroupTag.Monster,
        ColliderGroupTag.Elite,
        ColliderGroupTag.Boss,
    ];

    @property({ type: CCFloat, tooltip: '命中后销毁延时(-1关闭)' })
    public triggerDieTime: number = -1;

    @property({ type: CCFloat, tooltip: '子弹超时(-1关闭)' })
    public overTime: number = 5;

    @property({ type: CCInteger, tooltip: '穿透次数' })
    public attackCount: number = 1;

    private _triggerDieTime: number = -1;
    private _overTime: number = 5;
    private _attackCount: number = 1;
    private _damage: number = 0;
    private _bulletLevel: number = 0;
    private _prefabPath: PrefabPathEnum = PrefabPathEnum.None;
    private _isTrigger: boolean = false;
    private _registered: boolean = false;
    /** 已穿过的翻倍牌 uuid，防止同牌重复翻倍 */
    private readonly _passedBrandUuids: Set<string> = new Set();
    private readonly _dirXZ = v3();
    private _flyDir: Vec3 = new Vec3(0, 0, 1);
    private _flySpeed: number = 30;
    private readonly _tempPos: Vec3 = new Vec3();

    @property({ type: [Node], tooltip: '按等级索引的子模型(Level 0..n)，留空则不做等级切换' })
    private bullets: Node[] = [];

    protected onLoad(): void {
        if (!this.attackTargetTag || this.attackTargetTag.length === 0) {
            this.attackTargetTag = [...BULLET_HIT_ENEMY_TAGS];
        }
    }

    private applyBulletModelLevel(level: number) {
        if (!this.bullets?.length) return;
        const maxIdx = this.bullets.length - 1;
        const idx = Math.max(0, Math.min(level, maxIdx));
        this.bullets.forEach((n, i) => {
            if (n) n.active = (i === idx);
        });
    }

    protected update(dt: number): void {
        if (this._flySpeed > 0) {
            const p = this.node.worldPosition;
            this._tempPos.set(
                p.x + this._flyDir.x * this._flySpeed * dt,
                p.y,
                p.z + this._flyDir.z * this._flySpeed * dt
            );
            this.node.setWorldPosition(this._tempPos);
        }

        if (this.triggerDieTime !== -1 && this._isTrigger) {
            if (this._triggerDieTime <= 0) {
                this.over();
            } else {
                this._triggerDieTime -= dt;
            }
        } else if (this.overTime !== -1) {
            if (this._overTime <= 0) {
                this.over();
            } else {
                this._overTime -= dt;
            }
        }
    }

    public setBulletInfo(
        damage: number,
        flyDir?: Vec3,
        flySpeed?: number,
        bulletLevel: number = 0,
        prefabPath: PrefabPathEnum = PrefabPathEnum.None,
    ) {
        this.applyBulletModelLevel(bulletLevel);
        this._flySpeed = flySpeed ?? 30;
        this._damage = damage;
        this._bulletLevel = bulletLevel;
        if (prefabPath !== PrefabPathEnum.None) {
            this._prefabPath = prefabPath;
        }
        this._attackCount = this.attackCount;
        this._overTime = this.overTime;
        this._triggerDieTime = this.triggerDieTime;
        this._isTrigger = false;
        this._passedBrandUuids.clear();
        this.node.active = true;

        if (flyDir && flyDir.lengthSqr() > 1e-10) {
            this._flyDir.set(flyDir);
            Vec3.normalize(this._flyDir, this._flyDir);
        } else {
            this._flyDir.set(0, 0, 1);
        }

        if (!this._registered) {
            GameInfo.instance.simulationCollisionMgr.registerBullet(this);
            this._registered = true;
        }
        this.applyYawPitchLockRoll(this._flyDir);
    }

    private applyYawPitchLockRoll(direction: Vec3) {
        const dirLenSqr = direction.lengthSqr();
        if (dirLenSqr < 1e-10) return;

        this._dirXZ.set(direction.x, 0, direction.z);
        const xzLen = Math.sqrt(this._dirXZ.lengthSqr());
        if (xzLen < 1e-8) return;

        const yawRad = Math.atan2(this._dirXZ.x, this._dirXZ.z);
        const yawDeg = yawRad * 180 / Math.PI;
        this.node.setRotationFromEuler(0, yawDeg, 0);
    }

    public onHitTarget(target: CharacterBase) {
        this._isTrigger = true;
        if (target.isDead) return;
        if (this._attackCount <= 0) {
            this.over();
            return;
        }
        target.onBulletHit(this._damage, this.node);
        this._attackCount--;
        if (this._attackCount <= 0) {
            this.over();
        }
    }

    public hasPassedBrand(brandUuid: string): boolean {
        return this._passedBrandUuids.has(brandUuid);
    }

    public markPassedBrand(brandUuid: string): void {
        this._passedBrandUuids.add(brandUuid);
    }

    /** 翻倍克隆弹继承模板已穿过的牌，避免再次触发翻倍 */
    public inheritPassedBrandsFrom(source: BulletBattle3D): void {
        source._passedBrandUuids.forEach((uuid) => {
            this._passedBrandUuids.add(uuid);
        });
    }

    public getCloneParams(): BulletCloneParams {
        return {
            damage: this._damage,
            flyDir: this._flyDir.clone(),
            flySpeed: this._flySpeed,
            bulletLevel: this._bulletLevel,
            prefabPath: this._prefabPath,
        };
    }

    private over() {
        this.node.active = false;
        if (this._registered) {
            GameInfo.instance.simulationCollisionMgr.unregisterBullet(this);
            this._registered = false;
        }
        if (GameInfo.instance?.prefabMgr) {
            GameInfo.instance.prefabMgr.recoverPrefab(this.node);
        } else {
            app.res.recoverByPool(this.node);
        }
    }
}
