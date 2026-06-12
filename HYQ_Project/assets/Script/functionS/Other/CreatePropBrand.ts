import { _decorator, CCFloat, CCInteger, Component, ITriggerEvent, Node, PlaceMethod, tween, Tween, Vec3 } from 'cc';
import PoolManager from '../../Base/PoolManager';
import { PropBrand } from './PropBrand';
import { EffectEnum, EventType, LayerEnum, PoolEnum, PrefabsEnum, SoundEnum } from '../../Base/EnumList';
import { PrefabsManager } from '../../Base/PrefabsManager';
import { Player } from '../Player/Player';
import { Role } from '../Player/Role';
import LayerManager from '../../Base/LayerManager';
import { JumpManager } from '../Jump/JumpManager';
import { ArmsInfo, PropArms } from './PropArms';
import EventManager from '../../Base/EventManager';
import { UnityUpComponent } from '../../Base/UnityUpComponent';
import { EffectManager } from '../Effect/EffectManager';
import AudioManager from '../../Base/AudioManager';
import { FlashRedManager } from '../Battle/Base/FlashRedManager';
const { ccclass, property } = _decorator;

@ccclass('CreatePropBrand')
export class CreatePropBrand extends UnityUpComponent {

    @property(CCInteger)
    public showCount: number = 15;

    @property(CCFloat)
    public distance: number = 1.5;
    @property(CCFloat)
    public height: number = 1.665;

    @property(CCInteger)
    public count: number = 1;

    @property(CCFloat)
    public moveSpeed: number = 2;

    @property(PropArms)
    public pa: PropArms;

    @property(Node)
    public wallNode: Node;

    private propBrandList: PropBrand[] = [];

    private tempPropBrandList: PropBrand[] = [];

    private isMove: boolean = false;

    @property(CCInteger)
    public type: number = 0;
    start() {

        for (let i = 0; i < this.showCount; i++) {

            const p = this.propBrand;

            this.propBrandList.push(p);

            this.wallNode.addChild(p.node);

            p.node.x = 0;

            p.node.y = this.height;

            p.node.z = i * this.distance;

        }

        // this.scheduleOnce(() => {

        //     this.move(15);

        // }, 1);

        this.pa?.node.on(EventType.PROP_ARMS_DIE, this.armsUPEvent, this);

    }


    private armsUPEvent(armsInfo: ArmsInfo) {
        this.move(armsInfo.moveCount);
    }

    _update(deltaTime: number) {
        if (this.isMove) {

            for (let i = 0; i < this.propBrandList.length; i++) {
                const p = this.propBrandList[i];

                if (!i) {
                    if (p.node.z <= 0) {

                        this.scheduleOnce(() => {
                            this.pa.init(1);

                        }, 0.5);
                        this.isMove = false;
                        break;
                    }
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

                PoolManager.instance.setPool(PoolEnum.Prop + 0, p);

            }
        }

    }

    public move(count: number) {

        this.isMove = true;

        const c = this.propBrandList.length;

        for (let i = 0; i < count; i++) {

            const p = this.propBrand;

            this.wallNode.addChild(p.node);

            p.node.x = 0;

            p.node.y = this.height;

            p.node.z = (i + c - 1) * this.distance;

            this.propBrandList.push(p);

        }

        for (let i = 0; i < count; i++) {

            const p = this.propBrandList[0];

            this.tempPropBrandList.push(p);

            p.collide.on("onTriggerEnter", this.onTriggerEnter, this);

            this.propBrandList.splice(0, 1);

        }
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

    private tempV3: Vec3 = new Vec3();

    private onTriggerEnter(event: ITriggerEvent) {
        const player = event.otherCollider.getComponent(Player);
        if (player) {
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
            player.addRole(role);
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
            // cPos.set()
            EffectManager.instance.addShowEffect_3(role.node, EffectEnum.up, 1);
            const roleFBXNode = role.fbxManager.node;
            const scaleR = PoolManager.instance.V3.set(roleFBXNode.scale);
            // roleFBXNode.setPosition(Vec3.ZERO);
            FlashRedManager.instance.flashRed(role.node, role.meshCreateDataList, 0.5);
            const scale2 = PoolManager.instance.V3.set(scaleR).multiplyScalar(1.5);
            tween(roleFBXNode).to(0.4, { scale: scale2 }).to(0.2, { scale: scaleR }, { easing: "backOut" }).call(() => {
                console.log("curScale:" + roleFBXNode.scale, "scaleR:" + scaleR, "scale2:" + scale2);

                PoolManager.instance.V3 = scaleR;
                PoolManager.instance.V3 = scale2;


            }).start();
            role.attackIN = true;

            JumpManager.instance.jumpBezierByPoints(role.node, 3, cPos, pos).onComplete(() => {
                AudioManager.inst.playOneShot(SoundEnum.Sound_Ship_UpLevel);
                role.attackIN = false;
                PoolManager.instance.V3 = pos;
                PoolManager.instance.V3 = cPos;
                // const selfPos = role.node.position;
                const selfPos2 = player.getNextPos(index);
                player.node.addChild(role.node);
                role.node.setWorldPosition(selfPos2);
                player.upMoveBoundary();
                if (role.arms) {
                    role.arms.active = true;
                }
                // EffectManager.instance.addShowEffect(selfPos, EffectEnum.up, 2)
                PoolManager.instance.V3 = selfPos2;
                // role.node.setPosition(selfPos);
            }).setEndPosPre((prop: Node) => {
                const curPos = player.getNextPos(index);
                curPos.subtract(pos);
                curPos.add(prop.worldPosition);
                prop.setWorldPosition(curPos);
                PoolManager.instance.V3 = curPos;
            }, null);

            const propBrand = event.selfCollider.getComponent(PropBrand);
            this.tempPropBrandList.splice(this.tempPropBrandList.indexOf(propBrand), 1);
            this.scheduleOnce(() => {
                Tween.stopAllByTarget(this.node);
                propBrand.node.active = false;
                PoolManager.instance.setPool(PoolEnum.Prop + this.type, propBrand);
                propBrand.collide.off("onTriggerEnter", this.onTriggerEnter, this);
            }, 0)
        }
    }


}


