/**
 * 基础状态接口
 */
interface IState {
    onEnter?(data?: any): void;
    onExit?(data?: any): void;
    onUpdate?(dt: number): void;
}

/**
 * 状态基实现
 */
export class StatusBase<T extends string | number> {
    private _currentState: T | null = null;
    private readonly _states: Map<T, IState> = new Map();
    public _isChangingState = false;

    constructor(config?: { initialState: T, states: Record<T, IState> }) {
        if (config) {
            this.registerStates(config.states);
            this.changeState(config.initialState);
        }
    }

    /**
     * 注册多个状态[^1]
     */
    registerStates(states: Record<T, IState>): void {
        for (const [key, state] of Object.entries(states)) {
            this._states.set(key as T, state as IState);
        }
    }

    /**
     * 切换状态[^2]
     */
    changeState(newState: T, data?: any): boolean {
        if (this._isChangingState || this._currentState === newState) return false;

        const oldState = this._currentState;
        this._isChangingState = true;

        // 执行旧状态退出逻辑
        if (oldState && this._states.has(oldState)) {
            this._states.get(oldState)?.onExit?.(data);
        }

        // 执行新状态进入逻辑
        if (this._states.has(newState)) {
            this._currentState = newState;
            this._states.get(newState)?.onEnter?.(data);
            this._isChangingState = false;
            return true;
        }

        console.error(`State ${String(newState)} not registered!`);
        this._isChangingState = false;
        return false;
    }

    /**
     * 更新当前状态[^3]
     */
    update(dt: number): void {
        if (!this._currentState || this._isChangingState) return;
        this._states.get(this._currentState)?.onUpdate?.(dt);
    }

    /** 获取当前状态 */
    get currentState(): T | null {
        return this._currentState;
    }
}