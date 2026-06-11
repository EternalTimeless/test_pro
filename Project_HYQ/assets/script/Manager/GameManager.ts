import { _decorator, Component, Node, find, sys, game, PhysicsSystem, EPhysicsDrawFlags, RigidBody } from 'cc';
import { GameInfo } from '../Common/GameInfo';
import { AudioMgr, SoundEnum } from '../Core/Managers/AudioMgr';
import { BulletBrand } from '../Other/BulletBrand';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property({ type: Node, displayName: '地图层' })
    public mapLayer: Node = null!;
    @property({ type: Node, displayName: '战斗层' })
    public gameLayer: Node = null!;
    @property({ type: Node, displayName: '特效层' })
    public effLayer: Node = null!;
    @property({ type: Node, displayName: '子弹层' })
    public bulletLayer: Node = null!;
    @property({ type: RigidBody, displayName: '击退Group' })
    KnockbackEndRigidBody: RigidBody = null;
    @property({ type: Node, displayName: '结算相机节点' })
    public endCameraNode: Node = null!;
    @property({ displayName: '碰撞盒绘制' })
    OpenDebugDrawFlags: boolean = false;
    /**击退组 */
    public KnockbackEndGroup: number = 0;
    /**跳转倒计时 */
    private _jumpTime: number = 150;
    public get jumpTime(): number {
        return this._jumpTime;
    }
    public set jumpTime(value: number) {
        this._jumpTime = value;
        // 可以在这里触发相关事件
    }
    /**是否已跳转 */
    public isJumpToDownload: boolean = false;
    private lowUpdateTimer: number = 0;
    public isIOS: boolean = false;

    protected onLoad(): void {
        GameInfo.instance.gameMgr = this;

        if (sys.platform === sys.Platform.IOS || sys.os == sys.OS.IOS) {
            game.frameRate = 30;
            this.isIOS = true;
        }
        // this.KnockbackEndGroup = this.KnockbackEndRigidBody.getGroup();

        //开启3D碰撞绘制
        if (this.OpenDebugDrawFlags) {
            PhysicsSystem.instance.debugDrawFlags = EPhysicsDrawFlags.WIRE_FRAME
                | EPhysicsDrawFlags.AABB
                | EPhysicsDrawFlags.CONSTRAINT;
        }

        //开启2D碰撞绘制
        // if (!this.OpenDebugDrawFlags) {
        //     PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
        //         EPhysics2DDrawFlags.Pair |
        //         EPhysics2DDrawFlags.CenterOfMass |
        //         EPhysics2DDrawFlags.Joint |
        //         EPhysics2DDrawFlags.Shape;
        // }
    }


    protected onDestroy(): void {
        if (GameInfo.instance.gameMgr === this) {
            GameInfo.instance.gameMgr = null;
        }
    }

    protected start() {
        const ui = find("UIRoot")
        if (!ui.active) ui.active = true;
    }
    GameStart() {
        GameInfo.instance.Begin = true;
        GameInfo.instance.Pause = false;
        GameInfo.instance.Over = false;
        BulletBrand.reviveAll();
        AudioMgr.instance.playMusic(SoundEnum.Sound_BGM, true, 0.8);
        // GameInfo.instance.guideMgr.onGuideStep();
    }


    protected update(dt: number): void {
        if (!GameInfo.instance.Begin || GameInfo.instance.Pause || GameInfo.instance.Over) return;
        this._jumpTime -= dt;
        this.lowUpdateTimer += dt;
        if (this.lowUpdateTimer > 5) {
            this.lowUpdateTimer = 0;
            this.lowUpdate()
        }
        //Tips: 尽量不要使用Vec3.len等方法, 只做加减, 否则性能开销大
    }
    protected lowUpdate(): void {
        if (this._jumpTime <= 0) {
            if (!this.isJumpToDownload) {
                GameInfo.instance.viewMgr.ForceToDownload();
                this.isJumpToDownload = true;
            }
        }
    }

    /**游戏结束, 清理逻辑 */
    GameOver(isWin: boolean) {
        this.scheduleOnce(() => {
            if (isWin) {
                this.ClaerGame();
                this.scheduleOnce(() => {
                    AudioMgr.instance.playSound(SoundEnum.Sound_Success, 0.75);
                    GameInfo.instance.viewMgr.showGameOver(true);
                }, 1)
            } else {
                AudioMgr.instance.playSound(SoundEnum.Sound_Fail, 0.75);
                this.ClaerGame();
                GameInfo.instance.viewMgr.showGameOver(false);
            }
        }, 0.5);
    }
    /**游戏状态清理 */
    ClaerGame() {
        GameInfo.instance.monsterMgr.StopAllMonster(true);
        // GameInfo.instance.allyHero.forEach(ally => {
        //     ally.clearTarget();
        //     ally.stopAttack();
        // });
        // GameInfo.instance.soldier.forEach(soldier => {
        //     soldier.clearTarget();
        //     soldier.stopAttack()
        // });
        // GameInfo.instance.worker.forEach(worker => {
        //     worker.stopMove();
        // });
        GameInfo.instance.player.stopMove();
        // GameInfo.instance.player.stopAttack();
        GameInfo.instance.Over = true;
        app.event.offAllByTarget(this);
    }

    /**游戏重玩 */
    Replay() {
        BulletBrand.reviveAll();
        // GameInfo.step = 0;
        // GameInfo.instance.viewMgr.resetGameUI();
        // GameInfo.instance.monsterMgr.reset();
        // GameInfo.instance.guideMgr.guideTrigger.active = true;
    }

}
// window.addEventListener('beforeunload', () => {
//关闭web前执行的回调
// window.playableAnalytics?.onCompleted();
// console.log('onCompleted');
// });

