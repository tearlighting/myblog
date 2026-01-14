<script lang="ts" setup>
import { onUnmounted, ref, watch } from "vue"

interface IPageLoaderProps<T = any, P = any> {
  payload?: P
  initializer: (payload: P) => Promise<T> | P
  useStore: () => IDisposableStore<T> & {
    initialized: { current: boolean }
  }
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
// 页面销毁 → 停止本轮生命周期
onUnmounted(() => {
  currentRunId++
  dispose()
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
