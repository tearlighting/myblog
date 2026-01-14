import { getArticleDetail } from "@/api"
import type { useArticleDetailStore } from "./store"

interface IArticleDetailInitailProps {
    id: string
}

export const initializer: TStoreInitializer<ReturnType<typeof useArticleDetailStore>, IArticleDetailInitailProps> = async (payload) => {
    const { id } = payload
    if (!id) throw new Error("project id is required")
    const { msg, data } = await getArticleDetail(id)
    if (msg) throw msg
    return {
        articleItem: data,
    }
}