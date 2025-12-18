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
    if (!initialized.current) {
      projectCardECarouselPhaseStateMachineRef.current = new ProjectCardECarouselPhaseStateMachine(ECarouselPhase.idle, projectSubPub.subPubIns)
    }
    init(payload)

  }
  return {
    ...rest,
    init: initWrapper,
    projectCardECarouselPhaseStateMachineRef,
    projectSubPub,
    initialized,
  }
})
