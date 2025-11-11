import { request } from "@/utils"
import { IDetailArticle } from "blog"
import { htmlContent } from "../blog/res"
import { projects, projects4JP } from "./projects"
import { projectItem, projectItem4JP } from "./projectItem"

interface IPagination {
  page: number
  limit: number
}
export const getProjects = <T extends IPagination>(data: T) => {
  return request<{ total: number; rows: IDetailArticle[] }>({
    url: "/project",
    params: data,
  }).catch(() => {
    if ((data as any).type === "jp") {
      return projects4JP
    } else {
      return projects
    }
  })
}

export const getArticle = (id: string, type?: string) => {
  return request<IDetailArticle>({
    url: `/project/detail/${id}`,
    params: {
      ...(type ? { type } : {}),
    },
  }).catch((e) => {
    if (type == "jp") {
      return projectItem4JP[id]
    } else {
      return projectItem[id]
    }
  })
}
