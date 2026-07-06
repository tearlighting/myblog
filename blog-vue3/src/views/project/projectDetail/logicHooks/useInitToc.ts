import { useNextTrickEffect } from "@/hooks/useNextTrickEffect"
import type { Toc } from "project"
import type { useTranslatedProject } from "./useTranslatedProject"

interface IUseInitTocProps {
    translatedProjectItem: ReturnType<typeof useTranslatedProject>['translatedProjectItem']

}
export const useInitToc = ({ translatedProjectItem }: IUseInitTocProps) => {
    const tocElMap = new Map<string, HTMLElement>()
    const TOC_OFFSET_TOP = 16
    useNextTrickEffect(() => {
        const val = translatedProjectItem.value?.toc
        if (!val) return
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

    }, () => translatedProjectItem.value?.toc)

    return {
        tocElMap,
        TOC_OFFSET_TOP
    }
}