export interface IList {
  name: string
  children: IList[]
}

export interface IMenuTree {
  name: string
  children: IMenuTree[]
  parent: IMenuTree
  isSelected?: boolean
  aside?: string
}

type Toc = {
  anchor: string
  name: string
  tag: string
  children: Toc[]
}

export interface IBlogTranslation {
  blogId: string
  id: string
  lang: string
  title: string
  description: string
  toc: Toc[]
  htmlContent: string
}
export interface IBlogItem {
  id: string
  thumb: string
  category: {
    id: string
    name: string
  }
  createDate: string
  scanNumber: number
  commentNumber: number
  translations: IBlogTranslation[]
}




export interface IBlogTypeItem {
  id: string
  name: string
  articleCount: string | number
  order: string | number
}

export interface IGetArticleProps {
  id: string | number
  page: number
  limit: number
}

export interface IArticles<T = IBlogItem> {
  total: number
  rows: T[]
}

export interface IDetailArticle {
  id: string

  category: {
    id: number
    name: string
  }
  scanNumber: number
  commentNumber: number
  createDate: string
  translations: IBlogTranslation[]
}

export interface ICommentProps {
  name?: string
  content: string
}

export interface ICommentItem {
  id: string
  avatar: string
  nickname: string
  content: string
  createDate: string
}
