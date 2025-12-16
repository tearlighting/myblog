export type StateName = string

export interface IStateTransitionEvent<State extends StateName, TPayload = any> {
    type: State
    payload?: TPayload
}

export interface IStateMachine<State extends StateName, TPayload = any> {
    /** 当前状态 */
    getState(): State

    /** 状态转移（触发事件） */
    send(event: IStateTransitionEvent<State, TPayload>): void

    /** 强制切换状态（跳转） */
    transition(to: State, payload?: TPayload): void
}