import { AbstractStateMachine, SubPub, type IStateTransitionEvent } from "@/utils";
import { ELumiState } from "../constant";

export class LumiStateMachine extends AbstractStateMachine<ELumiState> {
    private _subPubIns!: SubPub<ELumiState>
    protected handleEvent(current: ELumiState, event: IStateTransitionEvent<ELumiState, any>): ELumiState | null {
        const path = PATH[current]
        if (path && path.includes(event.type)) {
            return event.type
        }
        return null
    }


    protected onEnter(_state: ELumiState, payload?: any): void {
        if (!this._subPubIns) {
            throw new Error('subPub is not set')
        }
        this._subPubIns.publish(_state, payload)
    }

    protected onExit(_state: ELumiState): void {

    }

    setSubPub(subPub: SubPub<ELumiState>) {
        this._subPubIns = subPub
    }
}

const PATH: Record<ELumiState, ELumiState[]> = {
    [ELumiState.idle]: [ELumiState.ready],
    [ELumiState.ready]: [ELumiState.switching],
    [ELumiState.switching]: [ELumiState.idle]
}