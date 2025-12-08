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
export interface IBlogTranslation {
  blogId: string
  id: string
  lang: string
  title: string
  description: string
  toc: string
  htmlContent: string
}
export interface IArticleItem {
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




export interface IBlogCategory {
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

export interface IArticles {
  total: number
  rows: IArticleItem[]
}

export interface IDetailArticle {
  id: string
  title: string
  category: {
    id: number
    name: string
  }
  description: string
  scanNumber: number
  commentNumber: number
  createDate: string
  toc: {
    name: string
    anchor: string
    children?: IDetailArticle["toc"][]
  }[]
  htmlContent: string
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
