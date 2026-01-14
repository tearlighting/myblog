import { getBanners } from "@/api"
import type { useHomeStore } from "./store"

export const initializer: TStoreInitializer<ReturnType<typeof useHomeStore>> = async () => {
  const { data, msg } = await getBanners()
  if (msg) throw new Error(msg)
  return {
    banners: data,
  }
}
