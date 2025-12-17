import { createHookStore, createUseSubBub, withMergeDispose } from "@/utils"
import { ECarouselPhase } from "../constant"
import { useProjectList, } from "../hooks"
import { ProjectCardECarouselPhaseStateMachine } from "../utils"

export const useProjectStore = createHookStore(() => {
  const { init, initialized, projectSubPub, ...rest } = withMergeDispose({
    projectListStore: useProjectList(),
    projectSubPub: createUseSubBub<ECarouselPhase>()(),
  })
  const projectCardECarouselPhaseStateMachineRef = {
    current: null as ProjectCardECarouselPhaseStateMachine | null,
  }
  const initWrapper: typeof init = (payload) => {
    init(payload)
    if (!initialized) {
      projectCardECarouselPhaseStateMachineRef.current = new ProjectCardECarouselPhaseStateMachine(ECarouselPhase.initing, projectSubPub.subPubIns)
    }
  }
  return {
    ...rest,
    init: initWrapper,
    projectCardECarouselPhaseStateMachineRef,
    projectSubPub,
    initialized,
  }
})
