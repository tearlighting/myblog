import { nextTick, watch } from "vue"

/**
 * 替代 onMounted
 * 因为 onMounted这东西在路由重定向中会多执行，我也不想加逻辑判断，那就直接自己手动造一个得了
 */
export const useMounted = (callback: () => void, depends: any[] = []) => {
    watch(
        () => depends,
        async () => {
            await nextTick()
            callback()
        },
        {
            immediate: true,
        },
    )
}
