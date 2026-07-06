import { useNextTrickEffect } from "@/hooks/useNextTrickEffect"
import { createLenis } from "@/utils"
import type Lenis from "lenis"
import { ref } from "vue"
import { useArticleStore } from "../store/useArticleStore"

export const useInitScroller = () => {
    const scrollerRef = ref<HTMLElement>()
    const scrollerContentRef = ref<HTMLElement>()

    const { articleStore: { articles } } = useArticleStore()

    const lenisRef = {
        current: null as Lenis | null
    }

    useNextTrickEffect(() => {
        if (!scrollerRef.value || !scrollerContentRef.value) return
        lenisRef.current = createLenis({
            wrapper: scrollerRef.value,
            content: scrollerContentRef.value,
        })
        return () => {
            lenisRef.current?.destroy()
        }
    })

    useNextTrickEffect(() => {
        lenisRef.current?.resize()
    }, () => articles.length)

    return {
        scrollerRef,
        scrollerContentRef, lenisRef
    }
}