

import { AbstractStateMachine, SubPub, type IStateTransitionEvent } from "@/utils";

/**
 * X轴状态机
 */
export const enum EYAxisPhase {
    yAxisIdle = 'yAxisIdle',
    yAxisReady = 'yAxisReady',
    yAxisSwitching = 'yAxisSwitching',
}


export class YAxisPhaseStateMachine extends AbstractStateMachine<EYAxisPhase> {
    constructor(current: EYAxisPhase, private _subPub: SubPub<EYAxisPhase>) {
        super(current);
    }
    protected handleEvent(current: EYAxisPhase, event: IStateTransitionEvent<EYAxisPhase, any>): EYAxisPhase | null {
        if (PATH[current].includes(event.type)) {
            return event.type;
        }
        return null
    }
    protected onEnter(state: EYAxisPhase, payload?: any): void {
        this._subPub.publish(state, payload);
    }
    protected onExit(): void {

    }

}

const PATH: Record<EYAxisPhase, EYAxisPhase[]> = {
    [EYAxisPhase.yAxisIdle]: [EYAxisPhase.yAxisReady],
    [EYAxisPhase.yAxisReady]: [EYAxisPhase.yAxisSwitching],
    [EYAxisPhase.yAxisSwitching]: [EYAxisPhase.yAxisIdle]
}