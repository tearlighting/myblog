import { nextTick, watch, type WatchSource } from "vue"

/**
 * 替代 onMounted
 * 因为 onMounted这东西在路由重定向中会多执行，我也不想加逻辑判断，那就直接自己手动造一个得了
 * 直接参考React的写法得了
 */
export const useNextTrickEffect = (callback: () => void | (() => void), depends: WatchSource | WatchSource[] = () => []) => {
    let cleanup: ReturnType<typeof callback> = void 0
    const stop = watch(
        depends,
        async () => {
            cleanup?.()
            await nextTick()
            cleanup = callback()
        },
        {
            immediate: true,
        },
    )
    return () => {
        cleanup?.()
        cleanup = undefined
        stop()
    }
}
