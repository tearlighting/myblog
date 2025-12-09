import { getBanners } from "@/api"
import type { useHomeStore } from "./store"
type Initializer = Parameters<ReturnType<typeof useHomeStore>["init"]>[0]
export const initializer = async (): Promise<Initializer> => {
  const { data, msg } = await getBanners()
  if (msg) throw new Error(msg)
  return {
    banners: data,
  }
}
