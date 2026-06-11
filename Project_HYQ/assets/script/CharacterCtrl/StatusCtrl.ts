import { _decorator, Component } from 'cc';
import { CharacterStatus } from '../Common/CommonEnum';
import { StatusBase } from './StatusBase';
import { GameInfo } from '../Common/GameInfo';
const { ccclass } = _decorator;

@ccclass('StatusCtrl')
export class StatusCtrl extends Component {
    private statusBase: StatusBase<CharacterStatus>;

    // 状态回调映射
    private stateEnterCallbacks: Map<CharacterStatus, Function> = new Map();
    private stateUpdateCallbacks: Map<CharacterStatus, Function> = new Map();
    private stateExitCallbacks: Map<CharacterStatus, Function> = new Map();

    onLoad() {
        // this.initStatusBase();
    }

    update(dt: number) {
        if (GameInfo.instance.Pause) return;
        this.statusBase?.update(dt);
    }

    public initStatusBase() {
        this.statusBase = new StatusBase<CharacterStatus>({
            initialState: CharacterStatus.Idle,
            states: {
                [CharacterStatus.Idle]: {
                    onEnter: this.onStateEnter.bind(this, CharacterStatus.Idle),
                    onUpdate: this.onStateUpdate.bind(this, CharacterStatus.Idle)
                },
                [CharacterStatus.Move]: {
                    onEnter: this.onStateEnter.bind(this, CharacterStatus.Move),
                    onUpdate: this.onStateUpdate.bind(this, CharacterStatus.Move),
                    onExit: this.onStateExit.bind(this, CharacterStatus.Move)
                },
                [CharacterStatus.Attack]: {
                    onEnter: this.onStateEnter.bind(this, CharacterStatus.Attack),
                    onUpdate: this.onStateUpdate.bind(this, CharacterStatus.Attack),
                    onExit: this.onStateExit.bind(this, CharacterStatus.Attack)
                },
                [CharacterStatus.Skill]: {
                    onEnter: this.onStateEnter.bind(this, CharacterStatus.Skill),
                    onUpdate: this.onStateUpdate.bind(this, CharacterStatus.Skill),
                    onExit: this.onStateExit.bind(this, CharacterStatus.Skill)
                },
                [CharacterStatus.Dead]: {
                    onEnter: this.onStateEnter.bind(this, CharacterStatus.Dead),
                    onUpdate: this.onStateUpdate.bind(this, CharacterStatus.Dead)
                },
                [CharacterStatus.Work]: {
                    onEnter: this.onStateEnter.bind(this, CharacterStatus.Work),
                    onUpdate: this.onStateUpdate.bind(this, CharacterStatus.Work),
                    onExit: this.onStateExit.bind(this, CharacterStatus.Work)
                }
            }
        });
    }

    // 状态回调方法
    private onStateEnter(state: CharacterStatus) {
        const callback = this.stateEnterCallbacks.get(state);
        if (callback) {
            callback();
        }
    }

    private onStateUpdate(state: CharacterStatus, dt: number) {
        const callback = this.stateUpdateCallbacks.get(state);
        if (callback) {
            callback(dt);
        }
    }

    private onStateExit(state: CharacterStatus) {
        const callback = this.stateExitCallbacks.get(state);
        if (callback) {
            callback();
        }
    }

    // 状态切换方法
    public changeState(newState: CharacterStatus) {
        return this.statusBase.changeState(newState);
    }

    // 获取当前状态
    public get currentState(): CharacterStatus | null {
        return this.statusBase.currentState;
    }

    // 状态回调设置方法
    public setStateEnterCallback(state: CharacterStatus, callback: Function) {
        this.stateEnterCallbacks.set(state, callback);
    }

    public setStateUpdateCallback(state: CharacterStatus, callback: Function) {
        this.stateUpdateCallbacks.set(state, callback);
    }

    public setStateExitCallback(state: CharacterStatus, callback: Function) {
        this.stateExitCallbacks.set(state, callback);
    }

    // 重置状态机
    public reset() {
        this.changeState(CharacterStatus.Idle);
    }
}


