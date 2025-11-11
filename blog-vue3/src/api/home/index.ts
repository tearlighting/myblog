import { request } from "@/utils"
import type { IBannerItem } from "home"

export async function getBanners() {
  return await request<IBannerItem[]>({
    url: "home/banner",
  })
}
