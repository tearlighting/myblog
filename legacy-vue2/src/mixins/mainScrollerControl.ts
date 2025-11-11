import { useDomScrollEnd } from "@/hooks/useDomScrollEnd"
import { createMixin } from "@/utils"
import Vue, { VueConstructor } from "vue"
import eventBus, { EMyBlogMainScrollEvent } from "@/eventBus"

interface IScrollerControlProps {
  refName: string
  handlePrefix?: string
}

export function createMainScrollerControl({ refName, handlePrefix = "handle" }: IScrollerControlProps) {
  const res = createMixin({
    data(this: unknown) {
      return {
        mainScrollerDom: null as HTMLElement,
        mainScrollerScrollEndHelper: useDomScrollEnd(),
      }
    },
    mounted(): void {
      const that = this as any
      that.mainScrollerDom = that.$refs[refName]

      that.mainScrollerScrollEndHelper.mount({ dom: that.mainScrollerDom as HTMLElement })
      that.mainScrollerScrollEndHelper.onToEnd(() => {
        eventBus.emit(EMyBlogMainScrollEvent.mainScrollWheelEnd)
      })

      that.mainScrollerScrollEndHelper.onScroll(() => {
        eventBus.emit(EMyBlogMainScrollEvent.mainScrollWheel)
      })

      eventBus.on(EMyBlogMainScrollEvent.mainScroll2Top, () => {
        that.mainScrollerDom.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      })
      eventBus.on(EMyBlogMainScrollEvent.mainScrollWheel, () => {
        that[handlePrefix + EMyBlogMainScrollEvent.mainScrollWheel] && that[handlePrefix + EMyBlogMainScrollEvent.mainScrollWheel]()
      })
      eventBus.on(EMyBlogMainScrollEvent.mainScrollWheelEnd, () => {
        that[handlePrefix + EMyBlogMainScrollEvent.mainScrollWheelEnd] && that[handlePrefix + EMyBlogMainScrollEvent.mainScrollWheelEnd]()
      })
    },
    beforeDestroy(): void {
      const that = this as any
      eventBus.off(EMyBlogMainScrollEvent.mainScrollWheel)
      that.scrollEndHelper.destory()
    },
  })
  return res
}
