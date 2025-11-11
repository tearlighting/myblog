import { E2TopEvent } from "@/eventBus"
import { createMixin } from '@/utils'
import Vue, { ComponentOptionsMixin } from "vue"

interface IToTopProp {
  refName: string
  scrollTop?: number
}

export function createToTopControl({ refName, scrollTop = 0 }: IToTopProp) {
  return createMixin({
    data() {
      return {
        ToTopTargetDom: null as HTMLElement,
      }
    },
    mounted() {
      ;(this as any).ToTopTargetDom = (this as any).$refs[refName]
      ;((this as any).$refs[refName] as HTMLElement).addEventListener("scroll", (this as any).handleToTopTargetDomWheel)
    },
    beforeDestroy() {
      ;((this as any).ToTopTargetDom as HTMLElement).removeEventListener("scroll", (this as any).handleToTopTargetDomWheel)
    },
    methods: {
      handleToTopTargetDomWheel() {
        ;((this as any).ToTopTargetDom as HTMLElement).scrollTop > scrollTop
          ? (this as unknown as Vue).$eventBus.emit(E2TopEvent.show2Top)
          : (this as unknown as Vue).$eventBus.emit(E2TopEvent.hide2Top)
      },
    },
  })
}


