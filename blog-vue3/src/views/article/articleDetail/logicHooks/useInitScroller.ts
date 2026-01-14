import { createLenis, getTopElement } from "@/utils"
import type Lenis from "lenis"
import { nextTick, ref, watch } from "vue"
import type { useTranslatedArticle } from "./useTranslatedArticle"

interface IUseInitScrollerProps {
    translatedArticleItem: ReturnType<typeof useTranslatedArticle>["translatedArticleItem"]
    tocElMap: Map<string, HTMLElement>
    tocOffsetTop?: number
    toAnchorProcessing: {
        current: boolean;
    }
}
export const useInitScroller = ({ translatedArticleItem, tocElMap, tocOffsetTop = 0, toAnchorProcessing }: IUseInitScrollerProps) => {
    const scrollerRef = ref<HTMLElement | null>(null)
    const scrollerContentRef = ref<HTMLElement | null>(null)
    const lensInsRef = {
        current: null as Lenis | null,
    }

    const activeAnchor = ref("")

    const updateActive = () => {
        const scroller = scrollerRef.value
        if (!scroller) return
        activeAnchor.value = getTopElement(tocElMap, scroller, tocOffsetTop, scroller.clientHeight * 0.2)
    }
    watch(
        () => translatedArticleItem.value,
        async () => {
            await nextTick()
            if (lensInsRef.current) return
            if (!scrollerRef.value || !scrollerContentRef.value) return
            lensInsRef.current = createLenis({
                wrapper: scrollerRef.value,
                content: scrollerContentRef.value,
            })

            lensInsRef.current.on("scroll", () => {
                if (toAnchorProcessing.current) return
                updateActive()
            })

        }, {
        immediate: true
    }
    )

    watch(() => translatedArticleItem.value?.toc, async () => {
        if (!translatedArticleItem.value?.toc) return
        await nextTick()
        updateActive()
    }, {
        immediate: true
    })
    return {
        scrollerRef,
        scrollerContentRef,
        lensInsRef,
        activeAnchor,
        updateActive
    }
}

