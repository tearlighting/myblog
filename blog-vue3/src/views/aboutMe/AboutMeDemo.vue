<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue"

/**
 * ========= 核心：唯一真实状态 =========
 * globalX ∈ [0, sectionCount - 1]
 * 连续！不是 index！
 */
const globalX = ref(0)

const sections = [
  { title: "Intro", color: "#3b82f6" },
  { title: "Journey", color: "#22c55e" },
  { title: "Hobby", color: "#f97316" },
  { title: "Projects", color: "#a855f7" },
]

const MAX_X = sections.length - 1

const SPEED = 0.0012

function onWheel(e: WheelEvent) {
  e.preventDefault()
  globalX.value += e.deltaY * SPEED
  globalX.value = Math.max(0, Math.min(MAX_X, globalX.value))
}

onMounted(() => {
  window.addEventListener("wheel", onWheel, { passive: false })
})

onBeforeUnmount(() => {
  window.removeEventListener("wheel", onWheel)
})

/**
 * Section 内部用到的局部 x
 * localX = clamp(globalX - index, 0, 1)
 */
function localX(index: number) {
  return Math.max(0, Math.min(1, globalX.value - index))
}
</script>

<template>
  <div class="about-root">
    <div class="stage">
      <div
        v-for="(s, i) in sections"
        :key="i"
        class="section"
        :style="{
          '--lx': localX(i),
          background: s.color,
          transform: `
            translateX(${(i - globalX) * 100}%)
            scale(${1 - Math.abs(localX(i) - 0.5) * 0.08})
          `,
          opacity: 1 - Math.abs(localX(i) - 0.5) * 0.8,
        }"
      >
        <h1>{{ s.title }}</h1>
        <p>localX: {{ localX(i).toFixed(2) }}</p>
      </div>
    </div>

    <!-- debug -->
    <div class="debug">globalX: {{ globalX.toFixed(3) }}</div>
  </div>
</template>

<style scoped>
.about-root {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #0f172a;
}

.stage {
  position: absolute;
  inset: 0;
}

.section {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  transition: none; /* 👈 故意没有动画 */
}

.section h1 {
  font-size: 48px;
  margin-bottom: 8px;
}

.section p {
  opacity: 0.7;
}

.debug {
  position: absolute;
  left: 16px;
  bottom: 16px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 12px;
  border-radius: 8px;
}
</style>
