import { createHookStore, withMergeDispose } from "@/utils"
import { useProjectDetail } from "../hooks"
export const useProjectDetailStore = createHookStore(() => {
  const res = withMergeDispose({
    projectDetailStore: useProjectDetail(),
  })
  return res
})
