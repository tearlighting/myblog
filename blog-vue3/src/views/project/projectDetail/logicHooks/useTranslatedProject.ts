import { useLanguageStore } from "@/store"
import { storeToRefs } from "pinia"
import { computed } from "vue"
import { useProjectDetailStore } from "../store"

export const useTranslatedProject = () => {
    const {
        projectDetailStore: { projectItem },
    } = useProjectDetailStore()

    const { currentLocale } = storeToRefs(useLanguageStore())

    const translatedProjectItem = computed(() => {
        if (!projectItem.value) return null
        const lang = currentLocale.value
        const { translations, id, ...rest } = projectItem.value
        const translatedItem = translations.find((item) => item.lang === lang) || translations.find((item) => item.lang === "zh")
        return {
            ...rest,
            ...translatedItem,
        }
    })
    return {
        translatedProjectItem,
    }
}