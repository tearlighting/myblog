import { useLanguageStore } from "@/store"
import { loopIndex } from "@/utils"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"
import { useProjectStore } from "../store"

export const useActiveIndex = () => {
    const {
        projectListStore: { projects },
    } = useProjectStore()

    const { currentLocale } = storeToRefs(useLanguageStore())

    const projectWithTranslateContent = computed(() => {
        const lang = currentLocale.value
        return projects.map((item) => {
            const translateContent = item.translations.find((x) => x.lang === lang) || item.translations.find((x) => x.lang === "zh")
            return {
                ...item,
                ...translateContent!,
            }
        })
    })

    const activeIndex = ref(0)
    const changeActiveIndex = (dir: -1 | 1) => {
        if (dir > 0) {
            activeIndex.value = loopIndex(activeIndex.value - 1, projectWithTranslateContent.value.length)
        } else {
            activeIndex.value = loopIndex(activeIndex.value + 1, projectWithTranslateContent.value.length)
        }
    }
    const renderItems = computed(() => {
        const list = projectWithTranslateContent.value
        const len = list.length
        if (len === 0) return []
        const cur = activeIndex.value
        return [list[loopIndex(cur - 1, len)], list[loopIndex(cur, len)], list[loopIndex(cur + 1, len)]]
    })

    return {
        activeIndex,
        changeActiveIndex,
        renderItems,
    }
}