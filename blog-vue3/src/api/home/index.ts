import { request } from "@/utils"
import { addSiteBaseToUrl } from "@/utils/resource"
import type { IBannerItem } from "home"

export async function getBanners() {
  return await request<IBannerItem[]>({
    url: "home/banner",
  }).then(res => {
    res.data.forEach((item) => {
      item.bigImg = addSiteBaseToUrl(item.bigImg)
    })
    return res
  })
}
