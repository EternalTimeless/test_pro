import { _decorator, CCFloat, Component, Material, Node, sp, Sprite, SpriteFrame } from 'cc';
import { UnityUpComponent } from '../../../Base/UnityUpComponent';
import { FrameAnimEnum, AnimName } from '../../../Base/EnumList';
import { FrameAnimManager } from './FrameAnimManager';
const { ccclass, property } = _decorator;

@ccclass('FrameManager')
export class FrameManager extends UnityUpComponent {


    @property({ type: FrameAnimEnum })
    public animType: FrameAnimEnum = FrameAnimEnum.LittleBlueMan;

    @property(Sprite)
    public animSprite: Sprite;

    @property(Sprite)
    public yingziSprite: Sprite;

    @property(CCFloat)
    public speed: number = 1;

    private _animName: AnimName;

    private _angle: number;

    private _framSprite: SpriteFrame[];

    private _index: number = 0;

    private _frameTime: number = 0;

    private _frameInterval = 0.05;

    // private _loop: boolean = true;
    private _loopCount: number = -1;
    // private _curAnagle: number = 0;

    private curType: FrameAnimEnum = null;

    public setAnim(animName: AnimName, angle: number, loopCount: number = -1) {
        if (this.curType == this.animType && loopCount == -1 && this._animName == animName && this._angle == angle) return;
        this.curType = this.animType;
        this._animName = animName;
        this._angle = angle;
        this._loopCount = loopCount;
        this._setAnim(animName, angle);
    }
    private _setAnim(animName: AnimName, angle: number) {
        let realA = angle;
        if (angle != 361) {

            if (angle > 180) {
                this.node.setScale(-1, 1, 1);
                let a = angle - 180;
                angle = 180 - a;
            } else {
                this.node.setScale(1, 1, 1);
            }
        } else {
            this.node.setScale(-1, 1, 1);
        }
        let sf = FrameAnimManager.instance.getFrameAnimSpriteAtlas(this.animType, animName, angle);
        if (sf) {
            this._index = 0;
            this._framSprite = sf;
        } else {
            this.scheduleOnce(() => {
                let anim = animName;
                let a = realA;
                if (anim != this._animName || a != this._angle) {
                    return;
                }
                this._setAnim(anim, this._angle);
            }, 0.5)
        }
    }


    _update(deltaTime: number) {
        this.frameAnimLoop(deltaTime);
    }

    private frameAnimLoop(dt: number) {
        if (this._framSprite && this._loopCount) {
            if (this._frameTime <= 0) {
                this._frameTime = this._frameInterval / this.speed;
                this.animSprite.spriteFrame = this._framSprite[this._index];
                this._index++;
                if (this._index >= this._framSprite.length) {
                    this._index = 0;
                    if (this._loopCount > 0) {
                        this._loopCount--;
                    }
                }
            } else {
                this._frameTime -= dt;
            }
        }

    }


    // 获取动画结束时间
    public get animEndTime() {
        return this._framSprite ? this._framSprite.length * this._frameInterval / this.speed : 0;
    }

    public set material(material: Material) {

        this.animSprite.material = material;
        this.yingziSprite.material = material;
    }


}


