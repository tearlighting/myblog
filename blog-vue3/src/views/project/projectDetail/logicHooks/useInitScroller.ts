import { useNextTrickEffect } from "@/hooks/useNextTrickEffect"
import { createLenis, getTopElement } from "@/utils"
import type Lenis from "lenis"
import { ref } from "vue"
import type { useTranslatedProject } from "./useTranslatedProject"

interface IUseInitScrollerProps {
    translatedProjectItem: ReturnType<typeof useTranslatedProject>['translatedProjectItem']
    tocElMap: Map<string, HTMLElement>
    tocOffsetTop?: number
    toAnchorProcessing: {
        current: boolean;
    }
}
export const useInitScroller = ({ translatedProjectItem, tocElMap, tocOffsetTop = 0, toAnchorProcessing }: IUseInitScrollerProps) => {
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

    useNextTrickEffect(() => {
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
        return () => {
            lensInsRef.current?.destroy()
        }
    }, () => translatedProjectItem.value)

    useNextTrickEffect(() => {
        if (!translatedProjectItem.value?.toc) return
        updateActive()
    }, () => translatedProjectItem.value?.toc)

    return {
        scrollerRef,
        scrollerContentRef,
        lensInsRef,
        activeAnchor,
        updateActive
    }
}

