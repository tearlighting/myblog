export interface IProjectItem {
  id: string
  thumb: string
  scanNumber: number
  commentNumber: number
  createdAt: string

  translations: IProjectTranslation[]
}

export interface IProjectTranslation {
  projectId: string
  id: string
  lang: string
  title: string
  description: string
  toc: string
  htmlContent: string
}

export interface IProjectDetail {
  id: string
  scanNumber: number
  commentNumber: number
  createdAt: string
  translations: IProjectTranslation[]
}

export interface IProjectCard extends IProjectTranslation {
  id: string
  thumb: string
  scanNumber: number
  commentNumber: number
  createdAt: string
}
