<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, reactive, readonly } from "vue"

type FocusZone = {
  index: number
  // focus 窗口：localX 进入这个范围会开始吃滚动（更早更自然）
  start: number
  end: number
  // 吸附强度（0..1），越大越“必须讲完才放行”
  strength: number
}

type Ctx = {
  x: number
  pageCount: number
  localX: (i: number) => number
  inner: (i: number) => number
  consuming: (i: number) => boolean
}

const props = withDefaults(
  defineProps<{
    pageCount: number
    zones: FocusZone[]
    sensX?: number
    sensInner?: number
  }>(),
  {
    sensX: 0.00115,
    sensInner: 0.0022,
  },
)

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n))
const clamp01 = (n: number) => clamp(n, 0, 1)
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

// state（收敛：全局只维护 x + 每个 zone 的 inner）
const state = reactive({
  x: 0,
  inner: new Map<number, number>(), // index -> 0..1
  consuming: new Map<number, boolean>(),
})

// wheel accumulator（输入层）
let wheelAcc = 0

function localXOf(x: number, idx: number) {
  return clamp01(x - idx)
}

function getInner(idx: number) {
  return state.inner.get(idx) ?? 0
}
function setInner(idx: number, v: number) {
  state.inner.set(idx, clamp01(v))
}

// 计算某个 zone 的吃滚动权重 w（0..1）
function zoneWeight(z: FocusZone, x: number, delta: number) {
  const lx = localXOf(x, z.index)
  const inWin = smoothstep(z.start - 0.18, z.start, lx) * (1 - smoothstep(z.end, z.end + 0.18, lx))
  // inWin 在窗口附近会渐入渐出（比硬判断自然）
  const base = clamp01(inWin) * clamp01(z.strength)

  const inner = getInner(z.index)
  const forward = delta > 0
  const backward = delta < 0

  // 关键：前进必须 inner<1 才吃；后退必须 inner>0 才吃（对称）
  const allow = (forward && inner < 1) || (backward && inner > 0)
  if (!allow) return 0

  return base
}

// 多 zone 时取最大权重（demo 只有一个 focus zone）
function totalWeight(x: number, delta: number) {
  let w = 0
  let active: FocusZone | null = null
  for (const z of props.zones) {
    const wz = zoneWeight(z, x, delta)
    if (wz > w) {
      w = wz
      active = z
    }
  }
  // 标记 consuming
  state.consuming.clear()
  if (active && w > 0.02) state.consuming.set(active.index, true)
  return w
}

function onWheel(e: WheelEvent) {
  // 你这种 Admin Layout，必须 capture + passive:false，才能在吃滚动时 preventDefault
  const dy = clamp(e.deltaY, -140, 140)
  wheelAcc += dy

  // 如果本帧会吃滚动，就阻止外层滚动（不然输入被 layout 抢走）
  // 这里用“预测权重”判一下
  const w = totalWeight(state.x, dy)
  if (w > 0.08) e.preventDefault()
}

let rafId = 0
function raf() {
  const delta = wheelAcc
  wheelAcc = 0

  if (delta !== 0) {
    const w = totalWeight(state.x, delta)

    // 分配能量（核心）
    const dx = delta * props.sensX * (1 - w)
    state.x = clamp(state.x + dx, 0, props.pageCount - 1)

    // 把能量给 active zone 的 inner（同样对称）
    // demo：只给权重最大的那个 zone（state.consuming 里）
    for (const z of props.zones) {
      const wz = zoneWeight(z, state.x, delta)
      if (wz > 0.02) {
        const dInner = delta * props.sensInner * wz
        setInner(z.index, getInner(z.index) + dInner)
      }
    }
  } else {
    // 没输入时清 consuming（避免一直亮）
    state.consuming.clear()
  }

  rafId = requestAnimationFrame(raf)
}

onMounted(() => {
  window.addEventListener("wheel", onWheel, { capture: true, passive: false })
  rafId = requestAnimationFrame(raf)
})

onBeforeUnmount(() => {
  window.removeEventListener("wheel", onWheel, { capture: true } as any)
  cancelAnimationFrame(rafId)
})

// provide：section 只吃 localX / inner / consuming
const ctx: Ctx = {
  get x() {
    return state.x
  },
  pageCount: props.pageCount,
  localX(i) {
    return localXOf(state.x, i)
  },
  inner(i) {
    return getInner(i)
  },
  consuming(i) {
    return state.consuming.get(i) === true
  },
}

provide("AboutX", readonly(ctx) as Ctx)
</script>

<template>
  <slot />
</template>
