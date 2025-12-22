import { createLenis } from "@/utils"
import type Lenis from "lenis"
import { nextTick, ref, watch } from "vue"
import type { useTranslatedProject } from "./useTranslatedProject"

interface IUseInitScrollerProps {
    translatedProjectItem: ReturnType<typeof useTranslatedProject>['translatedProjectItem']
    tocElMap: Map<string, HTMLElement>
}
export const useInitScroller = ({ translatedProjectItem, tocElMap }: IUseInitScrollerProps) => {
    const scrollerRef = ref<HTMLElement | null>(null)
    const scrollerContentRef = ref<HTMLElement | null>(null)
    const lensInsRef = {
        current: null as Lenis | null,
    }

    const activeAnchor = ref("")

    const updateActive = () => {
        const scroller = scrollerRef.value
        if (!scroller) return
        const topBase = scroller.getBoundingClientRect().top
        // 你 sticky header / padding 如果有遮挡，这里加个 offset
        const offset = 16
        let bestId = ""
        let bestDist = Infinity
        tocElMap.forEach((el, anchor) => {
            const d = el.getBoundingClientRect().top - topBase - offset
            if (d <= 0 && Math.abs(d) < bestDist) {
                bestDist = Math.abs(d)
                bestId = anchor
            }
        })
        // 如果还没滚到任何标题，默认第一个
        if (!bestId && tocElMap.size) bestId = translatedProjectItem?.value?.toc?.[0].anchor || ""
        activeAnchor.value = bestId


    }
    watch(
        () => translatedProjectItem.value,
        async () => {
            await nextTick()
            if (lensInsRef.current) return
            if (!scrollerRef.value || !scrollerContentRef.value) return
            lensInsRef.current = createLenis({
                wrapper: scrollerRef.value,
                content: scrollerContentRef.value,
            })
            lensInsRef.current.on("scroll", () => {
                updateActive()
            })
        }
    )

    watch(() => translatedProjectItem.value?.toc, async () => {
        await nextTick()
        updateActive()
    })
    return {
        scrollerRef,
        scrollerContentRef,
        lensInsRef,
        activeAnchor
    }
}