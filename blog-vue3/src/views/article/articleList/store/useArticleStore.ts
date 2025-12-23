import { createHookStore, withMergeDispose } from "@/utils";
import { useArticleList } from "../hooks";

export const useArticleStore = createHookStore(() => {
    const res = withMergeDispose({
        articleStore: useArticleList()
    })
    return res
})