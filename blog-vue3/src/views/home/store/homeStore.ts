import { createHookStore, withMergeDispose } from "@/utils"
import { useBanners } from "../hooks"
import { useLumi } from "../hooks/useLumi"



export const useHomeStore = createHookStore(() => {
  const { ...rest } =
    withMergeDispose({
      bannerStore: useBanners(),
      lumiStore: useLumi(),
    })

  return {
    ...rest
  }
})


