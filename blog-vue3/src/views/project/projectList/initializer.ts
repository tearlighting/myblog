import { getProjects, type IPagination } from "@/api"
import type { useProjectStore } from "./store"

interface IProjectInitailProps extends IPagination { }

export const initializer: TStoreInitializer<ReturnType<typeof useProjectStore>, IProjectInitailProps> = async (payload) => {
  const { msg, data } = await getProjects(payload)
  if (msg) throw msg
  return {
    projects: data.rows,
  }
}
