import { request } from "@/utils"
import { addSiteBaseToUrl } from "@/utils/resource"
import type { IProjectDetail, IProjectItem } from "project"

export interface IPagination {
  page: number
  limit: number
}
export const getProjects = <T extends IPagination>(data: T) => {
  return request<IGrid<IProjectItem>>({
    url: "/project",
    params: data,
  }).then((res) => {
    res.data.rows.forEach((x) => (x.thumb = addSiteBaseToUrl(x.thumb)))
    return res
  })
}

export const getArticle = (id: string) => {
  return request<IProjectDetail>({
    url: `/project/detail/${id}`,
  })
}
