import type { Toc } from "../project"
export interface IArticleItem {
    id: string
    thumb: string
    category: {
        id: string
        name: string
    }
    scanNumber: number
    commentNumber: number
    translations: IBlogTranslation[]
    createdAt: string
}

export interface IArticleTranslation {
    blogId: string
    id: string
    lang: string
    title: string
    description: string
    toc: Toc
    htmlContent: string
}

export interface IArticleCategoryItem {
    id: string
    name: string
    articleCount: number
    order: number
}