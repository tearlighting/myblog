import { createHookStore, withMergeDispose } from "@/utils"
import { ELumiState } from "../constant"
import { useBanners } from "../hooks"
import { useLumi } from "../hooks/useLumi"
import { LumiStateMachine } from "../utils/LumiStateMachine"



export const useHomeStore = createHookStore(() => {
  const { dispose, ...rest } =
    withMergeDispose({
      bannerStore: useBanners(),
      lumiStore: useLumi(),
    })

  const lumiStateMachine = new LumiStateMachine(ELumiState.idle)
  const disposeWrapper = () => {
    dispose()
    lumiStateMachine.send({
      type: ELumiState.idle
    })
  }
  return {
    ...rest,
    lumiStateMachine,
    dispose: disposeWrapper
  }
})


