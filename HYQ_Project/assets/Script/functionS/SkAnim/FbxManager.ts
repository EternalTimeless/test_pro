import { _decorator, AnimationClip, Component, SkeletalAnimation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FbxManager')
export class FbxManager extends Component {

    private _animName: string[] = [];

    private _cur: number = -1;

    private _skeleta: SkeletalAnimation;

    private func: Function;
    private ctx: unknown;
    protected start(): void {

    }

    init() {
        this._cur = -1;
    }

    private get skeleta() {
        if (!this._skeleta) {
            this._skeleta = this.node.getComponent(SkeletalAnimation);
            let clips = this._skeleta.clips;
            for (let i = 0; i < clips.length; i++) {
                let name = clips[i].name;
                this._animName[i] = name;
            }
        }
        return this._skeleta;
    }

    public replaceAnimationClip(skT: number, clip: AnimationClip): boolean {
        if (!clip) {
            return false;
        }

        const sk = this.skeleta;
        const clips = sk.clips.slice();
        if (skT < 0 || skT >= clips.length) {
            return false;
        }

        if (clips[skT] === clip) {
            this._animName[skT] = clip.name;
            return true;
        }

        const oldClip = clips[skT];
        clips[skT] = clip;
        sk.clips = clips;
        if (sk.defaultClip === oldClip) {
            sk.defaultClip = clip;
        }

        this._animName.length = 0;
        for (let i = 0; i < sk.clips.length; i++) {
            const item = sk.clips[i];
            this._animName[i] = item ? item.name : '';
        }
        if (this._cur === skT) {
            this._cur = -1;
        }
        return true;
    }

    public setAnimation(skT: number, loop: boolean = true, frame: number = 0) {
        const sk = this.skeleta;
        let aniName = this._animName[skT];
        let animState = sk.getState(aniName);

        if (this._cur == skT) {
            if (!loop || !animState.isPlaying) {
                let time = frame * animState.duration;
                sk.crossFade(aniName, 0.2);
                animState.setTime(time);
            }
        } else {
            if (this._cur != -1) {
                let caniName = this._animName[this._cur];
                let canimState = sk.getState(caniName);
                canimState.stop();
            }
            sk.crossFade(aniName, 0.2);
            if (animState) {
                let time = frame * animState.duration;
                // animState.play();
                animState.setTime(time);
            }
            this._cur = skT;
        }
        return animState;
    }

    public setAnimationImmediate(skT: number, loop: boolean = true, frame: number = 0) {
        const sk = this.skeleta;
        const aniName = this._animName[skT];
        const animState = sk.getState(aniName);
        if (!animState) {
            return animState;
        }
        if (this._cur != -1 && this._cur != skT) {
            const curName = this._animName[this._cur];
            const curState = sk.getState(curName);
            curState?.stop();
        }
        sk.crossFade(aniName, 0);
        animState.setTime(frame * animState.duration);
        animState.speed = 1;
        this._cur = skT;
        return animState;
    }

    public getAnimState(skT: number) {
        const sk = this.skeleta;
        let aniName = this._animName[skT];
        let animState = sk.getState(aniName);
        return animState;
    }

    public prewarmAnimations(): void {
        const sk = this.skeleta;
        for (let i = 0; i < this._animName.length; i++) {
            const aniName = this._animName[i];
            if (!aniName) {
                continue;
            }
            const animState = sk.getState(aniName);
            if (!animState) {
                continue;
            }
            sk.crossFade(aniName, 0);
            animState.setTime(0);
            animState.stop();
        }
        this._cur = -1;
    }

    public isCurAnimation(skT: number) {
        return this._cur == skT;
    }

    public setAttackAnimCall(func: Function, ctx: unknown) {
        this.func = func;
        this.ctx = ctx;
    }

    private attack(num: number) {
        // EventManager.instance.emit(EventEnum.Tower_Hero_Attack + this.towerId, num);

        this.ctx ? this.func?.apply(this.ctx, [num]) : this.func?.([num]);
    }

    public get curState() {
        return this._cur;
    }

    public set Rotation_x(value: number) {
        this.node.setRotationFromEuler(value * 30, 0, 0);
    }


}


