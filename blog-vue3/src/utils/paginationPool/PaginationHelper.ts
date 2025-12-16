import type { IUsePaginationParam } from "./types"

export class PaginationHelper {
    protected _pageSize: number
    protected _currentPage: number
    protected _counts: number

    constructor({ pageSize = 5, currentPage = 1, counts = 0 }: IUsePaginationParam) {
        this._pageSize = pageSize
        this._currentPage = currentPage
        this._counts = counts
    }
    get haveNextPage() {
        return this._currentPage < this.pages
    }
    toNextPage() {
        if (!this.haveNextPage) return
        this._currentPage++
    }
    get havePrevPage() {
        return this._currentPage > 1
    }
    toPrevPage() {
        if (!this.havePrevPage) return
        this._currentPage--
    }
    jumpToPage(page: number) {
        if (page <= 0) return
        this._currentPage = Math.min(page, this.pages)
    }
    get paginationInfo() {
        return {
            pageSize: this._pageSize,
            currentPage: this._currentPage,
            counts: this._counts,
            pages: this.pages,
        }
    }
    resetPageSize(pageSize: number) {
        if (pageSize < 0) return
        this._pageSize = pageSize
    }
    resetCurrentPage(currentPage: number) {
        if (currentPage <= 0) return
        this._currentPage = Math.min(currentPage, this.pages)
    }
    resetCounts(counts: number) {
        this._counts = counts
        this._currentPage = Math.min(this._currentPage, this.pages)
    }
    /**
     * how many page this counts has
     * ページ数
     * 页数
     */
    get pages() {
        return Math.max(Math.ceil(this._counts / this._pageSize), 1)
    }
}