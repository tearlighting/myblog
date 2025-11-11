import { createHookStore } from "@/utils"
import { useBanners } from "../hooks"

interface IHomeStore extends IDisposableStore {
  bannerStore: ReturnType<typeof useBanners>
}

export const homeStore = createHookStore<IHomeStore>(() => {
  const bannerStore = useBanners()

  return {
    bannerStore,
  }
})
