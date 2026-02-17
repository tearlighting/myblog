// src/pages/about/useCorridor.ts
import { computed, ref } from "vue"

export type Dir = 1 | -1
export type Presence = "prev" | "active" | "next"

export type SectionInput = {
    presence: Presence
    x: number          // 0..1 (local)
    xAbs: number       // 0..1 (between A->B)
    dir: Dir
    pressure: number   // 0..1.2 (edge pressure)
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

/**
 * 连续走廊模型：
 * - index: 当前 active section 的索引（A）
 * - xAbs: A -> B 的局部连续进度 [0,1]
 * - 同时渲染 prev / A / B（B=next）
 */
export function useCorridor(sectionCount: () => number) {
    const index = ref(0)          // A index
    const xAbs = ref(0)           // 0..1 between A and next(B)
    const dir = ref<Dir>(1)
    const pressure = ref(0)       // 0..1.2 (only when at ends)

    // tuning
    const speed = 0.0016          // wheel delta -> xAbs delta (demo)
    const pressureSpeed = 0.0022
    const pressureDamping = 0.86
    const pressureThreshold = 0.92 // 到了就触发“Y 切换意图”（demo 里 log）

    const hasPrev = computed(() => index.value > 0)
    const hasNext = computed(() => index.value < sectionCount() - 1)

    const prevIndex = computed(() => (hasPrev.value ? index.value - 1 : -1))
    const nextIndex = computed(() => (hasNext.value ? index.value + 1 : -1))

    function commitForward() {
        if (!hasNext.value) return
        index.value += 1
        xAbs.value = 0
    }
    function commitBackward() {
        if (!hasPrev.value) return
        index.value -= 1
        xAbs.value = 1
    }

    function onDelta(deltaY: number) {
        // deltaY>0 表示向“右/下”推进（你自己可换方向）
        const dx = deltaY * speed
        if (dx === 0) return

        dir.value = dx >= 0 ? 1 : -1

        // 走廊连续：优先推进 xAbs
        let next = xAbs.value + dx

        // 右边越界：尝试进入下一个 section；如果已经是最后一个，就进入 pressure
        if (next > 1) {
            if (hasNext.value) {
                commitForward()
                // 余量丢掉（也可以 next-1 继承，demo 简化）
            } else {
                // edge pressure
                pressure.value = clamp(pressure.value + Math.abs(dx) / speed * pressureSpeed, 0, 1.2)
                xAbs.value = 1
            }
            return
        }

        // 左边越界：尝试回到上一个 section；如果已经是第一个，就进入 pressure
        if (next < 0) {
            if (hasPrev.value) {
                commitBackward()
            } else {
                pressure.value = clamp(pressure.value + Math.abs(dx) / speed * pressureSpeed, 0, 1.2)
                xAbs.value = 0
            }
            return
        }

        // 正常区间
        xAbs.value = clamp01(next)
    }

    // 用 RAF 做轻微回弹（pressure 的“松手回去”）
    let raf: number | null = null
    function start() {
        if (raf) return
        const loop = () => {
            // pressure 自然衰减
            pressure.value *= pressureDamping
            if (pressure.value < 0.001) pressure.value = 0

            // demo：edge pressure 达到阈值，输出“Y 切换意图”
            if (pressure.value >= pressureThreshold) {
                console.log("[edge intent] suggest chapter switch, dir=", dir.value)
                pressure.value = 0 // demo：触发一次就清
            }

            raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)
    }
    function stop() {
        if (raf) cancelAnimationFrame(raf)
        raf = null
    }

    // 给 section 分发 input（A/B 都拿自己的 xLocal）
    function getInput(presence: Presence): SectionInput {
        const xa = 1 - xAbs.value
        const xb = xAbs.value
        const x =
            presence === "active" ? xa :
                presence === "next" ? xb :
                    presence === "prev" ? 1 : 0

        return {
            presence,
            x: clamp01(x),
            xAbs: xAbs.value,
            dir: dir.value,
            pressure: pressure.value,
        }
    }

    return {
        index,
        prevIndex,
        nextIndex,
        xAbs,
        dir,
        pressure,
        onDelta,
        start,
        stop,
        getInput,
    }
}
