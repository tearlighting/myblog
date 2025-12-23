import { ECarouselPhase } from "../constant"
import { useProjectStore } from "../store"

export const useSwithOnClick = () => {
    const {
        projectCardECarouselPhaseStateMachineRef,
    } = useProjectStore()
    const jumpTo = (idx: number) => {
        if (idx === 1) return
        if (idx === 0) {
            projectCardECarouselPhaseStateMachineRef.current?.send({
                type: ECarouselPhase.switching,
                payload: {
                    dir: 1,
                    source: "click",
                },
            })
        } else if (idx == 2) {
            projectCardECarouselPhaseStateMachineRef.current?.send({
                type: ECarouselPhase.switching,
                payload: {
                    dir: -1,
                    source: "click",
                },
            })
        }
    }
    return {
        jumpTo
    }
}