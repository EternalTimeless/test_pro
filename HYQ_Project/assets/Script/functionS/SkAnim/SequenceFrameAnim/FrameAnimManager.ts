import { _decorator, animation, ccenum, Component, Node, resources, SpriteAtlas, SpriteFrame } from 'cc';
import Singleton from '../../../Base/Singleton';
import { FrameAnimEnum, AnimName } from '../../../Base/EnumList';
const { ccclass, property } = _decorator;




@ccclass('FrameAnimManager')
export class FrameAnimManager extends Singleton {

    public static get instance() {
        return this.getInstance<FrameAnimManager>();
    }

    private _frameAnimSpriteAtlas: { [key: number]: { [anim: string]: { [angle: number]: SpriteFrame[] } } } = {};

    private readonly _frameAnimEnumTbl: { [key: number]: string[] } = {
        [FrameAnimEnum.LittleBlueMan]: [AnimName.idle, AnimName.run, AnimName.attack],
    }

    public init() {
        for (let key in this._frameAnimEnumTbl) {
            let faEnum = parseInt(key) as FrameAnimEnum;
            let animArr = this._frameAnimEnumTbl[faEnum];
            this._frameAnimSpriteAtlas[faEnum] = {};
            for (let anim of animArr) {
                if (anim) {
                    this._frameAnimSpriteAtlas[faEnum][anim] = [];
                    let angle = 0;
                    for (let j = 0; j < 5; j++) {
                        let an = angle;
                        let str = `FrameAnim/man_${faEnum}/${anim}/${an}`;
                        resources.load(str, SpriteAtlas, (err, atlas) => {
                            if (atlas) {
                                let ag = an;
                                let k = faEnum;
                                let a = anim;
                                let sfOld = atlas.getSpriteFrames();
                                this._frameAnimSpriteAtlas[k][a][ag] = sfOld;
                            }
                        })
                        angle += 45;
                    }
                }
            }
        }
    }

    public getFrameAnimSpriteAtlas(faEnum: FrameAnimEnum, anim: AnimName, angle: number) {
        let ag = angle;
        let k = faEnum;
        let a = anim;
        let sfArr = this._frameAnimSpriteAtlas[k][a][ag];
        return sfArr;
    }
}


