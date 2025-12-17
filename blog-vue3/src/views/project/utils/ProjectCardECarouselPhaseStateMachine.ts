import { AbstractStateMachine, SubPub, type IStateTransitionEvent } from "@/utils";
import { ECarouselPhase } from "../constant";




export class ProjectCardECarouselPhaseStateMachine extends AbstractStateMachine<ECarouselPhase> {
    constructor(current: ECarouselPhase, private _subPub: SubPub<ECarouselPhase>) {
        super(current);
    }
    protected handleEvent(current: ECarouselPhase, event: IStateTransitionEvent<ECarouselPhase, any>): ECarouselPhase | null {
        switch (current) {
            case ECarouselPhase.initing:
                if ([ECarouselPhase.rendered].includes(event.type)) return event.type;
                return null;
            case ECarouselPhase.rendered:
                if ([ECarouselPhase.dragging].includes(event.type)) return event.type;
                return null;
            case ECarouselPhase.dragging:
                if ([ECarouselPhase.committing, ECarouselPhase.rendered].includes(event.type)) return event.type;
                return null;
            case ECarouselPhase.committing:
                if ([ECarouselPhase.switching].includes(event.type)) return event.type;
                return null;
            case ECarouselPhase.switching:
                if ([ECarouselPhase.initing].includes(event.type)) return event.type;
                return null
        }
    }
    protected onEnter(state: ECarouselPhase): void {
        this._subPub.publish(state);
    }
    protected onExit(_state: ECarouselPhase): void {

    }

}