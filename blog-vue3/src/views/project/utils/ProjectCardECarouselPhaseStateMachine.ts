import { AbstractStateMachine, SubPub, type IStateTransitionEvent } from "@/utils";
import { ECarouselPhase } from "../constant";




export class ProjectCardECarouselPhaseStateMachine extends AbstractStateMachine<ECarouselPhase> {
    constructor(current: ECarouselPhase, private _subPub: SubPub<ECarouselPhase>) {
        super(current);
    }
    protected handleEvent(current: ECarouselPhase, event: IStateTransitionEvent<ECarouselPhase, any>): ECarouselPhase | null {
        if (PATH[current].includes(event.type)) {
            return event.type;
        }
        return null
    }
    protected onEnter(state: ECarouselPhase): void {
        this._subPub.publish(state);
    }
    protected onExit(_state: ECarouselPhase): void {

    }

}
const PATH: Record<ECarouselPhase, ECarouselPhase[]> = {
    [ECarouselPhase.idle]: [ECarouselPhase.ready],
    [ECarouselPhase.ready]: [ECarouselPhase.switch],
    [ECarouselPhase.switch]: [ECarouselPhase.idle]
}