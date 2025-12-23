import { getArticles, type IPagination } from "@/api"
import { useArticleStore } from "./store/useArticleStore"
interface ArticleInitailProps extends IPagination { }
type TRes = Parameters<ReturnType<typeof useArticleStore>['init']>[0]
export const initializer = async (payload: ArticleInitailProps): Promise<TRes> => {
    const { msg, data } = await getArticles(
        payload
    )
    if (msg) throw msg
    return {
        articles: data.rows,
    }
}