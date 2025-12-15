export interface IProjectItem {
  id: string
  thumb: string
  scanNumber: number
  commentNumber: number
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
