import { request } from "@/utils";
import { addSiteBaseToUrl } from "@/utils/resource";
import { IBannerItem } from "home";

export async function getBanners() {
  return await request<IBannerItem[]>({
    url: "home/banner",
  })
    .then(res => {
      res.data.forEach((item) => {
        item.bigImg = addSiteBaseToUrl(item.bigImg)
      })
      console.log(res.data);

      return res
    })
}
