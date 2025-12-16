import { AbstractStateMachine, type IStateTransitionEvent } from "@/utils";

export const enum EProjectCardState {
    idle = 'idle',
    pre = 'pre',
    active = 'active',
    next = 'next'
}

export class ProjectCardStateMachine extends AbstractStateMachine<EProjectCardState> {
    constructor(current: EProjectCardState, private _executeRemoveAnimation: () => void) {
        super(current);
    }
    protected handleEvent(current: EProjectCardState, event: IStateTransitionEvent<EProjectCardState, any>): EProjectCardState | null {
        switch (current) {
            case EProjectCardState.idle:
                if ([EProjectCardState.pre, EProjectCardState.active, EProjectCardState.next].includes(event.type)) return event.type;
                return null;
            case EProjectCardState.pre:
                if ([EProjectCardState.idle, EProjectCardState.active].includes(event.type)) return event.type;
                return null;
            case EProjectCardState.active:
                if ([EProjectCardState.pre, EProjectCardState.next].includes(event.type)) return event.type;
                return null;
            case EProjectCardState.next:
                if ([EProjectCardState.idle, EProjectCardState.active].includes(event.type)) return event.type;
                return null
        }
    }
    protected onEnter(state: EProjectCardState): void {
        if (state === 'idle') {
            //好像我们只要处理卸载前的动画，其他transition好像是够了.我现在的设想是直接pub,我不想引入asyn污染我的代码
            this._executeRemoveAnimation()
        }
    }
    protected onExit(_state: EProjectCardState): void {

    }

}