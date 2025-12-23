import { loopIndex } from "@/utils"
import type { VirtualScrollData } from "lenis"
import { ref, watch } from "vue"
import { ELumiState } from "../constant"
import { useHomeStore } from "../store"

interface Props {
    slides: any[]
}
/**  切换逻辑 */
export const useActiveIndex = ({ slides }: Props) => {

    const { lumiStateMachine } = useHomeStore()

    const activeIndex = ref(0)

    async function switchSlide(payload: VirtualScrollData) {
        if (payload.deltaY > 0) {
            activeIndex.value = loopIndex(activeIndex.value + 1, slides.length)
        } else {
            activeIndex.value = loopIndex(activeIndex.value - 1, slides.length)
        }
    }

    function onImgLoad() {
        lumiStateMachine.send({
            type: ELumiState.ready,
        })
    }
    watch(activeIndex, () => {
        lumiStateMachine.send({
            type: ELumiState.idle,
        })
    })

    return {
        activeIndex,
        switchSlide,
        onImgLoad
    }
}