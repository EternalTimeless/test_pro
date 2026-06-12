import { _decorator, Vec3, v3, Node, director, Director } from "cc";
import AudioManager from "../../Base/AudioManager";
import { CameraMove } from "../../Base/CameraMove";
import { PoolEnum, PrefabsEnum, LayerEnum, SoundEnum, EffectEnum, EventType } from "../../Base/EnumList";
import EventManager from "../../Base/EventManager";
import LayerManager from "../../Base/LayerManager";
import PoolManager from "../../Base/PoolManager";
import { PrefabsManager } from "../../Base/PrefabsManager";
import Singleton from "../../Base/Singleton";
import { isPointInCameraView, distanceSquared } from "../../Tool/Index";
import { EffectTimePartRemove } from "./EffectTimePartRemove";

const { ccclass, property } = _decorator;
const lDis: number = 1;


@ccclass('EffectManager')
export class EffectManager extends Singleton {
    /** 帧回调引用 */
    private _directorCallback: (dt: number) => void;

    private _effectListL: EffectSequence[][] = [];

    private _effectShowListL: EffectTimePartRemove[][] = []

    private effectPlayOver(remove: EffectTimePartRemove, effect: EffectEnum) {
        let ef = this._effectShowListL[effect];
        if (ef) {
            let index = ef.indexOf(remove);
            if (index != -1) {
                ef.splice(index, 1);
            }
        }
    }
    constructor() {
        super();
        EventManager.instance.on(EventType.EFFECT_PLAY_OVER, this.effectPlayOver, this);

        this._directorCallback = this.frameReleaseSpecialEffects.bind(this);
        director.on(Director.EVENT_AFTER_UPDATE, this._directorCallback);
    }




    public static get instance() {
        return this.getInstance<EffectManager>();
    }
    /**
     * 
     * @param pos 特效显示的位置
     * @param poolType 回收类型
     * @param type 类型
     * @param angle 角度
     */
    public addShowEffect(pos: Vec3, type: EffectEnum, scale: number = 1) {

        if (!isPointInCameraView(pos, CameraMove.instance.camera)) {
            return;
        }
        let ef = this._effectListL[type];
        if (!ef) {
            this._effectListL[type] = ef = [];
        }
        for (let i = 0; i < ef.length; i++) {
            let dis = distanceSquared(pos, ef[i].pos)
            if (dis <= lDis) {
                return;
            }
        }
        let sq = this.EffectSq;
        sq.scale = scale;
        sq.type = type;
        sq.pos.set(pos);
        this._effectListL[type].push(sq);
    }


    public addShowEffect_2(pos: Vec3, type: EffectEnum, scale: number = 1) {
        if (!isPointInCameraView(pos, CameraMove.instance.camera)) {
            return;
        }
        let effect = PoolManager.instance.getPool<Node>(PoolEnum.effect + type);
        if (!effect) {
            effect = PrefabsManager.instance.GetPrefabsIns(PrefabsEnum.effect, type);
        }
        let layer = LayerManager.instance.getLayer(LayerEnum.Layer_2_sky);
        // effect.setScale(scale, scale, scale);
        layer.addChild(effect);
        effect.setWorldPosition(pos);
        effect.active = true;
        effect.setScale(scale, scale, scale);
    }

    public addShowEffect_3(node: Node, type: EffectEnum, scale: number = 1) {
        if (!isPointInCameraView(node.worldPosition, CameraMove.instance.camera)) {
            return;
        }
        let effect = PoolManager.instance.getPool<Node>(PoolEnum.effect + type);
        if (!effect) {
            effect = PrefabsManager.instance.GetPrefabsIns(PrefabsEnum.effect, type);
        }
        // effect.setScale(scale, scale, scale);
        node.addChild(effect);
        effect.setPosition(Vec3.ZERO);
        effect.active = true;
        effect.setScale(scale, scale, scale);
    }




    private showEffect(sq: EffectSequence) {
        let effect = PoolManager.instance.getPool<Node>(PoolEnum.effect + sq.type);
        if (!effect) {
            effect = PrefabsManager.instance.GetPrefabsIns(PrefabsEnum.effect, sq.type);
        }
        let layer = LayerManager.instance.getLayer(LayerEnum.Layer_2_sky);
        // effect.setScale(scale, scale, scale);
        layer.addChild(effect);
        effect.setWorldPosition(sq.pos);
        effect.active = true;
        effect.setScale(sq.scale, sq.scale, sq.scale);
        // if (sq.type == EffectEnum.shopOver) {
        //     AudioManager.inst.playOneShot(SoundEnum.Sound_up);
        // }


        return effect;
    }

    private coor: number = 0;

    private frameCount: number = 5;
    /**需要在任意地方 循环调用 */
    private frameReleaseSpecialEffects() {
        if (this._effectListL.length > 0) {
            for (let i = this.coor; i < this.frameCount; i++) {

                this._effectListL.forEach((sqList, type) => {
                    if (sqList && sqList.length) {
                        let sq = sqList.shift();
                        let isShow = true;
                        let showArr = this._effectShowListL[type];
                        if (!showArr) {
                            this._effectShowListL[type] = showArr = [];
                        }
                        for (let i = 0; i < showArr.length; i++) {
                            let dis = distanceSquared(sq.pos, showArr[i].node.worldPosition)
                            if (dis <= lDis) {
                                isShow = false;
                                break;
                            }
                        }
                        if (isShow) {
                            let effNode = this.showEffect(sq);
                            let er = effNode.getComponent(EffectTimePartRemove);
                            showArr.push(er);
                        }
                        PoolManager.instance.setPool(PoolEnum.EffectSq, sq);
                    }
                })

            }
        }
    }



    private get EffectSq() {
        let sq = PoolManager.instance.getPool<EffectSequence>(PoolEnum.EffectSq);
        if (!sq) {
            sq = new EffectSequence();
        }
        return sq;
    }


}

class EffectSequence {
    public type: EffectEnum;
    public pos: Vec3 = v3();
    public scale: number = 1;
}


