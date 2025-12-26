import { getArticles } from "@/api"
import { MySqlDataReader, PaginationPool, PaginationPoolBuilder } from "@/utils"

import type { IArticleItem } from "article"
import dayjs from "dayjs"
import { reactive } from "vue"
import { EPageConfig } from "../constant"

interface IUseArticleListInitialProps {
    articles: IArticleItem[]
}

interface IUseArticleList extends IDisposableStore<IUseArticleListInitialProps> {
    articles: IArticleItem[]
    paginationPoolIns: PaginationPool<IArticleItem>
}

export const useArticleList = (): IUseArticleList => {
    const articleReader = new MySqlDataReader(async (payload) => {
        const { data, msg } = await getArticles(payload)
        if (msg) throw new Error(msg)
        return {
            data: data.rows,
        }
    }, EPageConfig.pageSize)

    const paginationPoolIns = new PaginationPoolBuilder<IArticleItem>().defineDBReader(articleReader).defineKeyofRow(x => x.id).defineSort((a, b) =>
        dayjs(a.createdAt).diff(dayjs(b.createdAt))
    ).definePageConfig({
        pageSize: EPageConfig.pageSize,
        currentPage: 1
    }).build()

    const articles: IUseArticleList["articles"] = reactive<IArticleItem[]>([])


    const init: IUseArticleList["init"] = ({ articles: articleList, }) => {
        articles.splice(0, articles.length, ...articleList.slice(0, EPageConfig.pageSize))
        paginationPoolIns.updatePoolManual(articleList)
    }
    const dispose = () => {
        articles.length = 0
        paginationPoolIns.clearCache()
    }
    return {
        articles,
        init,
        dispose,
        paginationPoolIns,
    }
}

