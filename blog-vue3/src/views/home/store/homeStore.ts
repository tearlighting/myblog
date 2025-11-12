import { createHookStore, withMergeDispose } from "@/utils"
import { useBanners } from "../hooks"





export const useHomeStore = createHookStore(() => {

  const { init, dispose, bannerStore } = withMergeDispose({
    bannerStore: useBanners(),
  })

  return {
    bannerStore,
    init,
    dispose
  }
})


