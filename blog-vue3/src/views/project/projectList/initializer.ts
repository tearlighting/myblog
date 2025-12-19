import { getProjects, type IPagination } from "@/api/project"

interface ProjectInitailProps extends IPagination {}
export const initializer = async (payload: ProjectInitailProps) => {
  const { msg, data } = await getProjects(payload)
  if (msg) throw msg
  return {
    projects: data.rows,
  }
}
