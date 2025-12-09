import { request } from "@/utils"
import { addSiteBaseToUrl } from "@/utils/resource"
import type { IArticles, IBlogTypeItem, ICommentItem, ICommentProps, IDetailArticle, IGetArticleProps } from "blog"
import { blogComments, blogDetail, blogDetail4JP, blogtype } from "./mock"
export const getBlogTypes = () => {
  return request<IBlogTypeItem[]>({
    url: "/blog/blogtype",
  }).catch((e) => blogtype)
}

export const getArticles = <T extends IGetArticleProps>(data: T) => {
  return request<IArticles>({
    url: "/blog",
    params: data,
  }).then(res => {
    res.data.rows.forEach(x =>
      x.thumb = addSiteBaseToUrl(x.thumb)
    )
    return res
  })
}

export const getArticle = (id: string, type?: string) => {
  return request<IDetailArticle>({
    url: `/blog/detail/${id}`,
    params: {
      ...(type ? { type } : {}),
    },
  }).catch((e) => {
    if (type == "jp") {
      return blogDetail4JP[id]
    } else {
      return blogDetail[id]
    }
  })
}

export const postComment = ({ name = "@cname", content }: ICommentProps) => {
  return request({
    method: "post",
    url: "/comment",
    data: JSON.stringify({
      id: "guid",
      nickname: name,
      content,
      createDate: Date.now(),
      "avatar|1": [
        "https://qiheizhiya.oss-cn-shenzhen.aliyuncs.com/image/avatar6.jpg",
        "https://qiheizhiya.oss-cn-shenzhen.aliyuncs.com/image/avatar4.jpg",
        "https://qiheizhiya.oss-cn-shenzhen.aliyuncs.com/image/avatar8.jpg",
        "https://qiheizhiya.oss-cn-shenzhen.aliyuncs.com/image/avatar2.jpg",
      ],
    }),
  }).catch((e) => { })
}

export const getComment = ({ blogId }: { blogId: string }) => {
  return request<{ total: number; rows: ICommentItem[] }>({
    url: "/comment",
    params: {
      blogId,
    },
  }).catch((e) => {
    return blogComments[blogId]
  })
}


