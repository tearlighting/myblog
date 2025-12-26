import type { IArticleCategoryItem } from "article"
import { computed, reactive, type ComputedRef } from "vue"


interface IUseArticleCategoriesProps {
    categories: IArticleCategoryItem[]
}

interface IUseArticleCategories extends IDisposableStore<IUseArticleCategoriesProps> {
    activedCategories: Set<string>
    categories: IArticleCategoryItem[]
    filter: ComputedRef<string[]>
}

export const useArticleCategories = (): IUseArticleCategories => {
    const categories: IUseArticleCategories['categories'] = reactive([])

    const activedCategories = reactive(new Set<string>())

    const filter = computed(() => {
        if (!activedCategories.size) return categories.map(x => x.id)
        return Array.from(activedCategories)
    })
    const init: IUseArticleCategories['init'] = ({ categories: list }) => {
        categories.splice(0, categories.length, ...list)
    }
    const dispose: IUseArticleCategories['dispose'] = () => {
        categories.splice(0, categories.length)
    }
    return {
        categories,
        init, dispose,
        activedCategories,
        filter
    }
}