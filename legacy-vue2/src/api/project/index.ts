import { request } from "@/utils"
import { addSiteBaseToUrl } from "@/utils/resource"
import { IArticles, IDetailArticle } from "blog"
import { IProjectItem } from "project"

interface IPagination {
  page: number
  limit: number
}
export const getProjects = <T extends IPagination>(data: T) => {
  return request<IArticles<IProjectItem>>({
    url: "/project",
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
    url: `/project/detail/${id}`,
    params: {
      ...(type ? { type } : {}),
    },
  })
}
