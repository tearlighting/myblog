<script lang="ts" setup>
import { onUnmounted, ref, watch } from "vue"

interface IPageLoaderProps<T = any, P = any> {
  payload?: P
  initializer: (payload: P) => Promise<T> | P
  useStore: () => IDisposableStore<T> & {
    initialized: { current: boolean }
  }
  /**
   *
   * 其实store的清理不与UI的生命周期强相关。有时一系列页面可能需要保存或同时清理。
   * 所以保留一个接受外部注册清理函数的API,你自己管理去。
   * 我是不管你想什么时候clean up,我也不管你在router中间件的afterEach,还是Layout里面加一个hook去watch,又或者加一个空的组件里面执行这个hook,
   * 你开心就好！！！
   *
   */
  registerDispose?: (dispose: () => void) => void
}

const props = defineProps<IPageLoaderProps>()

const slot = defineSlots<{
  default: () => any
  fallback: () => any
  error: () => any
}>()

const { init, initialized, dispose } = props.useStore()

let currentRunId = 0
const initFalled = ref(false)

async function runInitialization(payload: any) {
  const myRunId = ++currentRunId
  try {
    // ❗ 每次重新初始化前先 dispose 旧生命周期
    dispose()

    initFalled.value = false

    // 等待用户的初始化逻辑
    const data = await props.initializer(payload)

    // ❗ 若期间 payload 改变，这次初始化已过期
    if (myRunId !== currentRunId) return

    // ❗ 最终写入（store 只允许 init 一次 → 这是新的一轮生命周期）
    init(data)
  } catch (e) {
    // ❗ 若期间 payload 改变，这次初始化已过期
    if (myRunId !== currentRunId) return
    initFalled.value = true
  }
}

// 当 payload 变化 → 重新初始化
watch(
  () => props.payload,
  (p) => {
    runInitialization(p)
  },
  { immediate: true }
)

const disposeWrapper = () => {
  //更新时间线
  currentRunId++
  dispose()
}

props.registerDispose?.(disposeWrapper)

// 页面销毁 → 停止本轮生命周期
onUnmounted(() => {
  const cleanupByScope = !!props.registerDispose
  !cleanupByScope && disposeWrapper()
})
</script>

<template>
  <template v-if="initialized.current">
    <slot />
  </template>
  <template v-else-if="initFalled">
    <slot name="error" />
  </template>
  <template v-else>
    <slot name="fallback" />
  </template>
</template>
