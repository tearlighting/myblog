import { request } from "@/utils"
import { IBannerItem } from "home"

export async function getBanners() {
  return await request<IBannerItem[]>({
    url: "home/banner",
  }).catch((e) => {
    return {
      code: 0,
      msg: "",
      data: [
        {
          id: "1",
          bigImg: require("@/assets/danmachi1.jpg"),
          title: "僕がなりたい",
          description: "英雄になりたい",
        },
        {
          id: "2",
          bigImg: require("@/assets/danmachi2.jpg"),
          title: "本当の願いを教えてください",
          description: "一番恥ずかしいのは何にも決められず、動けないでいることだ",
        },
        {
          id: "3",
          bigImg: require("@/assets/danmachi3.jpg"),
          title: "偽善者になる",
          description: "偽善者こそが英雄になる資格ある",
        },
        {
          id: "4",
          bigImg: require("@/assets/danmachi4.jpg"),
          title: "あなたは自罰的すぎる、冒険者らしくない",
          description: "逆に、少しでも自信を持たれれば、あなたはもっと強い冒険者になれる",
        },
        {
          id: "5",
          bigImg: require("@/assets/danmachi5.jpg"),
          title: "叶えたい願い",
          description: "があります",
        },
      ] as IBannerItem[],
    }
  })
}
