import { AbstractStateMachine, SubPub, type IStateTransitionEvent } from "@/utils";

/**
 * X轴状态机
 */
export const enum EXAxisPhase {
    xAxisIdle = 'xAxisIdle',
    xAxisReady = 'xAxisReady',
    xAxisSwitching = 'xAxisSwitching',
}


export class XAxisPhaseStateMachine extends AbstractStateMachine<EXAxisPhase> {
    constructor(current: EXAxisPhase, private _subPub: SubPub<EXAxisPhase>) {
        super(current);
    }
    protected handleEvent(current: EXAxisPhase, event: IStateTransitionEvent<EXAxisPhase, any>): EXAxisPhase | null {
        if (PATH[current].includes(event.type)) {
            return event.type;
        }
        return null
    }
    protected onEnter(state: EXAxisPhase, payload?: any): void {
        this._subPub.publish(state, payload);
    }
    protected onExit(): void {

    }

}

const PATH: Record<EXAxisPhase, EXAxisPhase[]> = {
    [EXAxisPhase.xAxisIdle]: [EXAxisPhase.xAxisReady],
    [EXAxisPhase.xAxisReady]: [EXAxisPhase.xAxisSwitching],
    [EXAxisPhase.xAxisSwitching]: [EXAxisPhase.xAxisIdle]
}