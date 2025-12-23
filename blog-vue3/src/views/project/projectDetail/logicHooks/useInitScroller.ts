import { createLenis } from "@/utils"
import type Lenis from "lenis"
import { nextTick, ref, watch } from "vue"
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
                if (toAnchorProcessing.current) return
                updateActive()
            })

        }, {
        immediate: true
    }
    )

    watch(() => translatedProjectItem.value?.toc, async () => {
        if (!translatedProjectItem.value?.toc) return
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

/**
 * 二分查找第一个top小于0的元素
 * @param tocElMap 
 * @param scroller 
 * @param offset 你 sticky header / padding 如果有遮挡，这里加个 offset
 * @param threshold 切换阈值,留一个区间去稳定
 * @returns 
 */
const getTopElement = (tocElMap: Map<string, HTMLElement>, scroller: HTMLElement, offset: number = 0, threshold = 0) => {
    let left = 0
    let right = tocElMap.size - 1
    const keys = Array.from(tocElMap.keys())
    const topBase = scroller.getBoundingClientRect().top
    while (left < right) {
        //左边保留比较危险，而且mid也是左偏，必须加1
        const mid = Math.floor((left + right + 1) / 2)
        const anchor = keys[mid]
        const el = tocElMap.get(anchor)!
        const d = el.getBoundingClientRect().top - topBase - offset
        if (d <= threshold) {
            left = mid
        } else {
            right = mid - 1
        }
    }
    return keys[left]
}