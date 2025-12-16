export interface IReadDB<T extends Record<string, any>> {
    readDB(): Promise<T[]>
    clearCache(): void
    reReadDBWithPage(pages: number): Promise<T[]>
    hasMore: boolean
    return2PrePage: () => void
}

export interface IPaginationPool<TTableData extends Record<string, any>> {
    getPageData(pageNumber: number, filter?: (payload: TTableData) => boolean): Promise<TTableData[]>
    deleteFromPool(filter: (payload: TTableData) => boolean): void
    refreshPages(pages: number): void | Promise<void>
    clearCache(): void | Promise<void>
    updatePoolManual(data: TTableData[]): void
    resetPageSize(pageSize: number): void
}
//add ability to set plugin to inject data
export interface IResetCacheData<TTableData extends Record<string, any>> {
    resetCacheData(data: Map<string, TTableData>): void
}
export interface IUsePaginationParam {
    pageSize?: number
    currentPage?: number
    counts?: number
}