import type { IArticleItem } from "article"
import { reactive } from "vue"

interface IUseArticleListInitialProps {
    articles: IArticleItem[]
}

interface IUseArticleList extends IDisposableStore<IUseArticleListInitialProps> {
    articles: IArticleItem[]
}
export const useArticleList = (): IUseArticleList => {
    const articles: IUseArticleList["articles"] = reactive<IArticleItem[]>([])

    const init: IUseArticleList["init"] = ({ articles: projectList }) => {
        articles.splice(0, articles.length, ...projectList)
    }
    const dispose = () => {
        articles.length = 0
    }
    return {
        articles,
        init,
        dispose,
    }
}