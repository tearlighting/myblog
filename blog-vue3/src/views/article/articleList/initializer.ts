import { getArticleCategories, getArticles, type IPagination } from "@/api"
import { useArticleStore } from "./store/useArticleStore"
interface ArticleInitailProps extends IPagination {}
type TRes = Parameters<ReturnType<typeof useArticleStore>["init"]>[0]
export const initializer = async (payload: ArticleInitailProps): Promise<TRes> => {
  try {
    const [categories, articles] = await Promise.all([getArticleCategories(), getArticles(payload)])
    if (articles.msg) throw new Error(articles.msg)
    if (categories.msg) throw new Error(categories.msg)
    const copy = articles.data.rows.map((item) => {
      const translations = item.translations.map((item) => {
        return {
          ...item,
          id: item.id + "1",
        }
      })
      return {
        ...item,
        id: item.id + "1",
        translations,
      }
    })
    const copy2 = articles.data.rows.map((item) => {
      const translations = item.translations.map((item) => {
        return {
          ...item,
          id: item.id + "2",
        }
      })
      item.translations.forEach((item) => {
        item.id = item.id + "2"
      })
      return {
        ...item,
        id: item.id + "2",
        translations,
      }
    })
    return {
      articles: articles.data.rows.concat(copy).concat(copy2),
      categories: categories.data,
    }
  } catch (err) {
    throw err
  }
}
