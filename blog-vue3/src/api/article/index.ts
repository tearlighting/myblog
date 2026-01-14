import { request } from "@/utils"
import { addSiteBaseToUrl } from "@/utils/resource"
import type { IArticleCategoryItem, IArticleDetail, IArticleItem } from "article"
interface IGetBlogItemsProps {
    limit: number
    page: number
    id?: number
}
export const getArticles = <T extends IGetBlogItemsProps>(data: T) => {
    return request<IGrid<IArticleItem>>({
        url: "/blog",
        params: data,
    }).then(res => {
        res.data.rows.forEach(x =>
            x.thumb = addSiteBaseToUrl(x.thumb)
        )
        return res
    })
}

export const getArticleCategories = () => {
    return request<IArticleCategoryItem[]>({
        url: "/blog/blogType",
        method: "get",
    })
}

export const getArticleDetail = (id: string) => {
    return request<IArticleDetail>({
        url: `/blog/detail/${id}`,
    })
}