import type { IArticleDetail } from "article"
import { ref } from "vue"

export const useArticleDetail = () => {
    const articleItem = ref<IArticleDetail | null>(null)
    const init = (payload: { articleItem: IArticleDetail }) => {
        articleItem.value = payload.articleItem
    }
    const dispose = () => {
        articleItem.value = null
    }
    return {
        articleItem,
        init,
        dispose,
    }
}
