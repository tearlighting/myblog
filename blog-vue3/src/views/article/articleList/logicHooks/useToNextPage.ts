import { createFlowMiddleware, mergeByKey, sleep, type FlowMiddleWareCallback } from "@/utils"
import type { IArticleItem } from "article"
import { computed, ref, type Ref } from "vue"
import { EPageConfig } from "../constant"
import { useArticleStore } from "../store/useArticleStore"


interface IToNextPageCxt {
    loadingTransition: Ref<boolean, boolean>
    pendingArticleList?: IArticleItem[]
    currentPage: { current: number }
    exhaustedCount: Ref<number>
}

const getPendingArticleList = async ({ currentPage }: IToNextPageCxt) => {
    const { articleStore: { paginationPoolIns } } = useArticleStore()
    //为了保证逻辑的一致性，当数量不够，也要翻页，但是这样只请求下一页很明显是不对的
    //极端情况是当前也可能有了数据更新，下一页还是空的
    //而且不要在意getPageData,他和请求API没有关系
    const currentPageArticles = await paginationPoolIns.getPageData(currentPage.current)
    const nextPageArticle = currentPageArticles.length >= EPageConfig.pageSize ? await paginationPoolIns.getPageData(currentPage.current + 1) : []
    if (nextPageArticle.length) {
        currentPage.current++
    }
    return currentPageArticles.concat(nextPageArticle)
}

const showLoading: FlowMiddleWareCallback<IToNextPageCxt> = async (ctx, next) => {
    const { loadingTransition } = ctx
    loadingTransition.value = true
    await Promise.all([getPendingArticleList(ctx), sleep(1500)]).then(([pendingArticleList]) => {
        ctx.pendingArticleList = pendingArticleList
    })
    loadingTransition.value = false
    await next()
}

const updateArticleList: FlowMiddleWareCallback<IToNextPageCxt> = async (ctx, next) => {
    const { pendingArticleList } = ctx
    const { articleStore: { articles } } = useArticleStore()
    const beforeLength = articles.length
    mergeByKey(articles, pendingArticleList || [], x => x.id)
    const afterLength = articles.length
    if (beforeLength === afterLength) {
        ctx.exhaustedCount.value++
    } else {
        ctx.exhaustedCount.value = 0
    }
    await next()
}

const toNextPageMiddleWare = createFlowMiddleware<IToNextPageCxt>().use(showLoading).use(updateArticleList)
export const useToNextPage = () => {

    const loading = ref(false)
    const loadingTransition = ref(false)
    const exhaustedCount = ref(0)
    const currentPage = {
        current: 1
    }
    const exhausted = computed(() => exhaustedCount.value > 0)
    const pendingExhausted = computed(() => exhaustedCount.value > 0)

    const toNextPage = async () => {
        if (loading.value || exhausted.value) return
        loading.value = true
        await toNextPageMiddleWare.run({
            currentPage,
            loadingTransition,
            exhaustedCount
        })
        loading.value = false
    }
    return {
        toNextPage,
        loadingTransition,
        exhausted,
        pendingExhausted
    }
}