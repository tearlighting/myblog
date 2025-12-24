import { getArticles } from "@/api"
import { MySqlDataReader, PaginationPool, PaginationPoolBuilder } from "@/utils"

import type { IArticleCategoryItem, IArticleItem } from "article"
import dayjs from "dayjs"
import { reactive, ref, type Ref } from "vue"

interface IUseArticleListInitialProps {
    articles: IArticleItem[]
    categories: IArticleCategoryItem[]
}

interface IUseArticleList extends IDisposableStore<IUseArticleListInitialProps> {
    articles: IArticleItem[]
    categories: IArticleCategoryItem[]
    paginationPoolIns: PaginationPool<IArticleItem>
    toNextPage: () => void
    currentPageNum: Ref<number, number>
}

const enum EPageConfig {
    pageSize = 10
}


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

export const useArticleList = (): IUseArticleList => {


    const articles: IUseArticleList["articles"] = reactive<IArticleItem[]>([])

    const categories: IArticleCategoryItem[] = reactive<IArticleCategoryItem[]>([])

    const currentPageNum = ref(1)
    let loading = false

    const toNextPage = async () => {
        if (loading) return
        loading = true
        const nextPage = currentPageNum.value + 1
        const res = await paginationPoolIns.getPageData(nextPage)
        mergeByKey(
            articles,
            res,
            (item) => item.id
        )
        if (res.length === EPageConfig.pageSize) {
            currentPageNum.value = nextPage
        }
        loading = false
    }

    const init: IUseArticleList["init"] = ({ articles: articleList, categories: articleCategories }) => {
        articles.splice(0, articles.length, ...articleList.slice(0, EPageConfig.pageSize))
        categories.splice(0, categories.length, ...articleCategories)
        paginationPoolIns.updatePoolManual(articleList)
    }
    const dispose = () => {
        articles.length = 0
        categories.length = 0
        paginationPoolIns.clearCache()
    }
    return {
        articles,
        categories,
        init,
        dispose,
        paginationPoolIns,
        toNextPage,
        currentPageNum
    }
}

function mergeByKey<T>(
    target: T[],
    incoming: T[],
    getKey: (item: T) => string
) {
    const indexMap = new Map<string, number>()

    // 建立 target 的索引表
    target.forEach((item, index) => {
        indexMap.set(getKey(item), index)
    })

    for (const item of incoming) {
        const key = getKey(item)
        const idx = indexMap.get(key)

        if (idx === undefined) {
            // 新数据 → append
            target.push(item)
        } else {
            // 已存在 → 覆盖（保持数组位置不变）
            target[idx] = item
        }
    }
}