import { PaginationPool } from "./PaginationPool";
import type { IReadDB, IUsePaginationParam } from "./types";

export class PaginationPoolBuilder<T extends Record<string, any>> {
    private _dbReader!: IReadDB<T>;
    private _getKey!: (row: T) => any;
    private _sort?: (a: T, b: T) => number;

    private _pageConfig: IUsePaginationParam = {
        pageSize: 10,
        currentPage: 1,
        counts: 0,
    }
    defineDBReader(dbReader: IReadDB<T>) {
        this._dbReader = dbReader;
        return this;
    }
    defineKeyofRow(getter: (row: T) => any) {
        this._getKey = getter;
        return this;

    }
    defineSort(sort: (a: T, b: T) => number) {
        this._sort = sort;
        return this;

    }

    definePageConfig(payload: IUsePaginationParam) {
        this._pageConfig = payload;
        return this;
    }

    build() {
        if (this._dbReader === undefined) {
            throw new Error("dbReader is not defined");
        }
        if (this._getKey === undefined) {
            throw new Error("getKey is not defined");
        }
        return new PaginationPool(this._dbReader, this._pageConfig.pageSize!, this._getKey, this._sort)
    }
}


