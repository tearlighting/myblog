import { createHookStore, withInitialized, withMergeDispose } from "@/utils"
import { useBanners } from "../hooks"
import { reactive } from "vue"

export const useHomeStore = createHookStore(() => {
  const { init, dispose, initialized, bannerStore } = withInitialized(
    withMergeDispose({
      bannerStore: useBanners(),
    })
  )

  return {
    bannerStore,
    init,
    dispose,
    initialized,
  }
})
