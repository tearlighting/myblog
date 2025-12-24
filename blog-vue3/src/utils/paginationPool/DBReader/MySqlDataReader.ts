import { sleep } from "../../common";
import type { IReadDB } from "../types";
export interface IMySqlDataGetter<T extends Record<string, any>> {
    (payload: { limit: number; page: number; }): Promise<{ data: T[]; }>
}
export class MySqlDataReader<T extends Record<string, any>> implements IReadDB<T> {
    hasMore: boolean = true
    private _currentPage: number = 1
    constructor(
        private _callback: IMySqlDataGetter<T>,
        private _limit: number = 50
    ) { }
    async readDB(): Promise<T[]> {
        let res: T[] = []
        try {
            const { data } = await this._callback({ limit: this._limit, page: this._currentPage++ })
            console.log(this._currentPage);
            res = data
        } catch (e) {
            console.error(e)
        } finally {
            if (res.length < this._limit) {
                this.hasMore = false
            } else {
                this.hasMore = true
            }
            return res
        }
    }

    async reReadDBWithPage(page: number): Promise<T[]> {
        if (page <= 0) return []
        try {
            const res = await this.reReadDBWithPage(page - 1)
            //don't have more data,return directly
            if (page > 1 && res.length < this._limit * page) {
                return res
            }
            await sleep(10)
            const { data, } = await this._callback({ limit: this._limit, page })
            return res.concat(data)
        } catch (e) {
            console.error(e)
            return []
        }
    }
    return2PrePage() {
        this._currentPage = this._currentPage - 1
        this.hasMore = true
    }

    async clearCache() {
        this._currentPage = 1
    }
    resetCallback(callback: IMySqlDataGetter<T>) {
        this._callback = callback
    }
}