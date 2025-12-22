export interface IProjectItem {
  id: string
  thumb: string
  scanNumber: number
  commentNumber: number
  createdAt: string
  translations: IProjectTranslation[]
}

export interface Toc {
  anchor: string
  name: string
  tag: string
  children: Toc[]
}
export interface IProjectTranslation {
  projectId: string
  id: string
  lang: string
  title: string
  description: string
  toc: Toc[]
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

type SectionType =
  | "overview" // 是什么（一句话就够）
  | "background" // 背景 / 为什么 / 动机
  | "core" // 核心思想 / 设计要点
  | "implementation" // 实现细节 / 代码 / 推导
  | "result" // 成果 / 对比 / demo / 结论
  | "reflection" // 反思 / 得失 / 未来
