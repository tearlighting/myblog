import type { Toc } from "project"
import { nextTick, watch } from "vue"
import type { useTranslatedArticle } from "./useTranslatedArticle"

interface IUseInitTocProps {
    translatedArticleItem: ReturnType<typeof useTranslatedArticle>["translatedArticleItem"]

}
export const useInitToc = ({ translatedArticleItem }: IUseInitTocProps) => {
    const tocElMap = new Map<string, HTMLElement>()
    const TOC_OFFSET_TOP = 16
    watch(
        () => translatedArticleItem.value?.toc,
        async (val) => {
            if (!val) return
            await nextTick()
            const loop = (toc: Toc[]) => {
                for (let i of toc) {
                    //这个顺序我就是保证有序性
                    const el = document.querySelector<HTMLElement>(`#${CSS.escape(i.anchor)}`)
                    if (el) {
                        tocElMap.set(i.anchor, el)
                    }
                    if (i.children) {
                        loop(i.children)
                    }
                }
            }
            tocElMap.clear()
            loop(val)
        }, {
        immediate: true
    }
    )
    return {
        tocElMap,
        TOC_OFFSET_TOP
    }
}