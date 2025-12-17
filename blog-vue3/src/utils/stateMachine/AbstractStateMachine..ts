import type { IStateMachine, IStateTransitionEvent, StateName } from "./types"

export abstract class AbstractStateMachine<State extends StateName, TPayload = any> implements IStateMachine<State, TPayload> {
    private _current: State
    private _listeners = new Set<(s: State) => void>()

    constructor(initial: State) {
        this._current = initial
    }

    public getState() {
        return this._current
    }

    /** 用于注册状态转移逻辑 */
    protected abstract handleEvent(current: State, event: IStateTransitionEvent<State, TPayload>): State | null

    public send(event: IStateTransitionEvent<State, TPayload>) {
        const next = this.handleEvent(this._current, event)
        if (next && next !== this._current) {
            this.transition(next, event.payload)
        }
    }

    public transition(next: State, payload?: TPayload) {
        const prev = this._current
        this.onExit(prev, payload)
        this._current = next
        this.onEnter(next, payload)
        this._listeners.forEach((l) => l(next))
    }

    /** 生命周期钩子 */
    protected abstract onEnter(state: State, payload?: TPayload): void
    protected abstract onExit(state: State, payload?: TPayload): void

    public subscribe(listener: (s: State) => void) {
        this._listeners.add(listener)
        return () => this._listeners.delete(listener)
    }
}