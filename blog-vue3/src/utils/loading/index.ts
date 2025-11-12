
import { ElLoading, type LoadingOptions } from 'element-plus'
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading.mjs'

const LoadingRecords = new WeakMap<HTMLElement, LoadingInstance>()


export const createLoadingIns = (element: HTMLElement, options?: Omit<LoadingOptions, "target">) => {
    const showLoading = () => {
        if (LoadingRecords.has(element)) return
        const loadingInstance = ElLoading.service({
            target: element,
            ...options
        })
        LoadingRecords.set(element, loadingInstance)
    }
    const hideLoading = () => {
        if (LoadingRecords.has(element)) {
            LoadingRecords.get(element)!.close()
            LoadingRecords.delete(element)
        }
    }
    return {
        showLoading,
        hideLoading
    }
}