import { getProjectDetail } from "@/api"
import type { useProjectDetailStore } from "./store"

interface ProjectDetailInitailProps {
  id: string
}
export const initializer: TStoreInitializer<ReturnType<typeof useProjectDetailStore>, ProjectDetailInitailProps> = async (payload) => {
  const { id } = payload
  if (!id) throw new Error("project id is required")
  const { msg, data } = await getProjectDetail(id)
  if (msg) throw msg
  return {
    projectItem: data,
  }
}
