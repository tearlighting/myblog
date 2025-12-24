import { createHookStore, withMergeDispose } from "@/utils";
import { useArticleList, useSentinelObserver } from "../hooks";


export const useArticleStore = createHookStore(() => {
    const res = withMergeDispose({
        articleStore: useArticleList(),
        sentinelObserver: useSentinelObserver()
    })
    return res
})