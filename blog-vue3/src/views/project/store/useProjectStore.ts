import { createHookStore, withMergeDispose } from "@/utils"
import { useProjectList } from "../hooks"

export const useProjectStore = createHookStore(() => {
  const res = withMergeDispose({
    projectListStore: useProjectList(),
  })
  return res
})
