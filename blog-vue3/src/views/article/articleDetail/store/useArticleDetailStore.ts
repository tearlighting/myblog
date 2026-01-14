import { createHookStore, withMergeDispose } from "@/utils"
import { useArticleDetail } from "../hooks"

export const useArticleDetailStore = createHookStore(() => {
    const res = withMergeDispose({
        articleDetailStore: useArticleDetail(),
    })
    return res
})