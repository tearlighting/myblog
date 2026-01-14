import { useLanguageStore } from "@/store"
import { storeToRefs } from "pinia"
import { computed } from "vue"
import { useArticleDetailStore } from "../store"

export const useTranslatedArticle = () => {
    const {
        articleDetailStore: { articleItem },
    } = useArticleDetailStore()

    const { currentLocale } = storeToRefs(useLanguageStore())

    const translatedArticleItem = computed(() => {
        if (!articleItem.value) return null
        const lang = currentLocale.value
        const { translations, id, ...rest } = articleItem.value
        const translatedItem = translations.find((item) => item.lang === lang) || translations.find((item) => item.lang === "zh")
        return {
            ...rest,
            ...translatedItem,
        }
    })
    return {
        translatedArticleItem,
    }
}