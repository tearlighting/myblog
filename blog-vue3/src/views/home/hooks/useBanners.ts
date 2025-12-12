import type { IBannerItem } from "home"
import { reactive } from "vue"



export interface IUseBannerInitalProps {
  banners: IBannerItem[]
}

interface IUseBanners extends IDisposableStore<IUseBannerInitalProps> {
  banners: IBannerItem[]
  currentIndex: {
    current: number
  }
  dynammicRenderControl: Record<number, string>
}

export const useBanners = (): IUseBanners => {
  const banners = reactive<IBannerItem[]>([])
  const currentIndex = reactive({
    current: 0,
  })
  const dynammicRenderControl = reactive<Record<number, string>>({})

  const init: IUseBanners['init'] = (payload) => {
    banners.push(...payload.banners)
  }
  const dispose = () => {
    banners.length = 0
    currentIndex.current = 0
    Object.keys(dynammicRenderControl).forEach((key) => {
      Reflect.deleteProperty(dynammicRenderControl, key)
    })
  }
  return {
    banners,
    currentIndex,
    dynammicRenderControl,
    init,
    dispose,
  }
}
