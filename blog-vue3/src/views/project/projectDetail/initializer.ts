import { getProjectDetail } from "@/api/project"

interface ProjectDetailInitailProps {
  id: string
}
export const initializer = async (payload: ProjectDetailInitailProps) => {
  const { id } = payload
  if (!id) throw new Error("project id is required")
  const { msg, data } = await getProjectDetail(id)
  if (msg) throw msg
  return {
    projectItem: data,
  }
}
