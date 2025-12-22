import type { IProjectDetail } from "project"
import { ref } from "vue"

export const useProjectDetail = () => {
  const projectItem = ref<IProjectDetail | null>(null)
  const init = (payload: { projectItem: IProjectDetail }) => {
    projectItem.value = payload.projectItem
  }
  const dispose = () => {
    projectItem.value = null
  }
  return {
    projectItem,
    init,
    dispose,
  }
}
