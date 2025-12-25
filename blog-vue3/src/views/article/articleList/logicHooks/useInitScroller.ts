import { createLenis } from "@/utils"
import type Lenis from "lenis"
import { nextTick, ref, watch } from "vue"
import { useArticleStore } from "../store/useArticleStore"

export const useInitScroller = () => {
    const scrollerRef = ref<HTMLElement>()
    const scrollerContentRef = ref<HTMLElement>()

    const { articleStore: { articles } } = useArticleStore()

    const lenisRef = {
        current: null as Lenis | null
    }
    watch(() => [], async () => {
        await nextTick()

        if (!scrollerRef.value || !scrollerContentRef.value) return
        lenisRef.current = createLenis({
            wrapper: scrollerRef.value,
            content: scrollerContentRef.value,
        })
    }, {
        immediate: true
    })

    watch(() => articles.length, async () => {
        await nextTick()
        lenisRef.current?.resize()
    })

    return {
        scrollerRef,
        scrollerContentRef, lenisRef
    }
}