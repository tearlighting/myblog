import { createHookStore, withMergeDispose } from "@/utils";
import { useArticleCategories, useArticleList, useSentinelObserver } from "../hooks";


export const useArticleStore = createHookStore(() => {
    const res = withMergeDispose({
        articleStore: useArticleList(),
        articleCategoriesStore: useArticleCategories(),
        sentinelObserver: useSentinelObserver()
    })
    return res
})