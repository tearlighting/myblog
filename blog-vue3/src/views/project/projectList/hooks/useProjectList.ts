import type { IProjectItem } from "project"

import { reactive } from "vue"

interface IUseProjectInitialProps {
  projects: IProjectItem[]
}

interface IUseProject extends IDisposableStore<IUseProjectInitialProps> {
  projects: IProjectItem[]
}
export const useProjectList = (): IUseProject => {
  const projects: IUseProject["projects"] = reactive<IProjectItem[]>([])

  const init: IUseProject["init"] = ({ projects: projectList }) => {
    projects.splice(0, projects.length, ...projectList)
  }
  const dispose = () => {
    projects.length = 0
  }
  return {
    projects,
    init,
    dispose,
  }
}
