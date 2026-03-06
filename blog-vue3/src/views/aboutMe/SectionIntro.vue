<script setup lang="ts">
import { computed, inject } from "vue"

const props = defineProps<{ index: number }>()
type Ctx = { localX: (i: number) => number }
const ctx = inject<Ctx>("AboutX")!

const lx = computed(() => ctx.localX(props.index))
const ease = (t: number) => t * t * (3 - 2 * t)

// 进场：0->1；退场：在接近 1 时开始轻微退
const enter = computed(() => ease(lx.value))
const exit = computed(() => ease(Math.max(0, lx.value - 0.7) / 0.3))
</script>

<template>
  <section class="intro">
    <div
      class="panel"
      :style="{
        opacity: (0.25 + 0.75 * enter) * (1 - 0.35 * exit),
        transform: `translateY(${20 * (1 - enter) + 10 * exit}px) scale(${0.96 + 0.04 * enter})`,
      }"
    >
      <h1>About Me</h1>
      <p class="muted">X-axis exploration resume demo</p>
      <p class="muted">Section2 会吸附并吃滚动（前进/回退对称）。</p>
    </div>
  </section>
</template>

<style scoped>
.intro {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: radial-gradient(900px 520px at 30% 20%, rgba(56, 189, 248, 0.14), transparent 60%), radial-gradient(900px 520px at 70% 75%, rgba(168, 85, 247, 0.12), transparent 65%), #070b18;
}
.panel {
  width: min(860px, 92%);
  padding: 22px 20px;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  will-change: transform, opacity;
}
h1 {
  margin: 0 0 8px;
  font-size: 44px;
  letter-spacing: 0.02em;
}
.muted {
  margin: 0;
  opacity: 0.75;
  line-height: 1.7;
}
</style>
