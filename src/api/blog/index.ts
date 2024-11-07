import { request } from "@/utils"
import type { IArticleItem, IBlogCategory, IGetArticleProps, IArticles, IDetailArticle, ICommentProps, ICommentItem } from "blog"
import { htmlContent, htmlContent2 } from "./res"
import { blogtype, blogComments, blogDetail, blogDetail4JP, blogs, blogs4JP } from "./mock"
const getBlogCategory = () => {
  return request<IBlogCategory[]>({
    url: "/blog/blogtype",
  }).catch((e) => blogtype)
}

const getArticles = <T extends IGetArticleProps>(data: T) => {
  return request<IArticles>({
    url: "/blog",
    params: data,
  }).catch((e) => {
    console.log(data)
    let res: IResponse<IArticles>
    if ((data as any).type === "jp") {
      res = JSON.parse(JSON.stringify(blogs4JP))
    } else {
      res = JSON.parse(JSON.stringify(blogs))
    }

    if (data.id && +data.id !== -1) {
      //   console.log(data.id)
      res.data.rows = res.data.rows.filter((x) => x.category.id === data.id)
    }
    // console.log(res, "res")

    return res
  })
}

const getArticle = (id: string, type?: string) => {
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

const postComment = ({ name = "@cname", content }: ICommentProps) => {
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
  }).catch((e) => {})
}

const getComment = ({ blogId }: { blogId: string }) => {
  return request<{ total: number; rows: ICommentItem[] }>({
    url: "/comment",
    params: {
      blogId,
    },
  }).catch((e) => {
    return blogComments[blogId]
  })
}

export { getArticles, getBlogCategory, getArticle, postComment, getComment }
