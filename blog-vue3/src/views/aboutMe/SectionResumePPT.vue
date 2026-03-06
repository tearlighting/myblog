<script setup lang="ts">
import { computed, inject } from "vue"

const props = defineProps<{ index: number }>()
type Ctx = { localX: (i: number) => number }
const ctx = inject<Ctx>("AboutX")!

const lx = computed(() => ctx.localX(props.index))
const clamp01 = (n: number) => Math.max(0, Math.min(1, n))
const ease = (t: number) => t * t * (3 - 2 * t)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

// 进/退场
const enter = computed(() => ease(lx.value))
const exit = computed(() => ease(Math.max(0, lx.value - 0.82) / 0.18))

// PPT：三段连续推进
const p1 = computed(() => clamp01(lx.value / 0.33))
const p2 = computed(() => clamp01((lx.value - 0.33) / 0.33))
const p3 = computed(() => clamp01((lx.value - 0.66) / 0.34))

function cardStyle(activeStage: number, fadeStage: number, prog: number) {
  // activeStage：自己进度（0..1）
  // fadeStage：下一张出现时自己的退场（0..1）
  const appear = ease(prog)
  const fade = ease(fadeStage)

  return {
    opacity: lerp(0.18, 1, appear) * (1 - 0.45 * fade) * (1 - 0.25 * exit.value),
    transform: `
      translateY(${lerp(22, 0, appear) + lerp(0, 10, fade) + 8 * exit.value}px)
      scale(${lerp(0.95, 1, appear) - 0.02 * fade})
    `,
    filter: `blur(${lerp(3, 0, appear) + lerp(0, 1.6, fade)}px)`,
  }
}
</script>

<template>
  <section class="resume">
    <div class="wrap" :style="{ opacity: lerp(0.2, 1, enter), transform: `translateY(${18 * (1 - enter)}px)` }">
      <div class="hud">Section1 · PPT Resume · localX: {{ lx.toFixed(2) }}</div>

      <div class="stack">
        <div class="card" :style="cardStyle(1, p2, p1)">
          <div class="meta">2019 · Student</div>
          <div class="title">Fundamentals</div>
          <div class="desc">Algorithms · CS basics · side projects</div>
        </div>

        <div class="card" :style="cardStyle(2, p3, p2)">
          <div class="meta">2021 · Frontend Engineer</div>
          <div class="title">UI Systems</div>
          <div class="desc">React/Vue · TypeScript · DX patterns</div>
        </div>

        <div class="card active" :style="cardStyle(3, 0, p3)">
          <div class="meta">2023 · Full-stack / Infra</div>
          <div class="title">Own the pipeline</div>
          <div class="desc">AWS · data flows · architecture thinking</div>
        </div>
      </div>

      <div class="note">回退会反向回到上一张（不是只会往前）。</div>
    </div>
  </section>
</template>

<style scoped>
.resume {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: radial-gradient(900px 520px at 25% 20%, rgba(99, 102, 241, 0.18), transparent 60%), radial-gradient(900px 520px at 70% 75%, rgba(56, 189, 248, 0.14), transparent 65%), #050816;
}
.wrap {
  width: min(900px, 92%);
  will-change: transform, opacity;
}
.hud {
  font-size: 12px;
  opacity: 0.75;
  margin: 0 0 12px;
}
.stack {
  display: grid;
  gap: 14px;
}
.card {
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.58);
  backdrop-filter: blur(12px);
  padding: 16px 16px 14px;
  will-change: transform, filter, opacity;
}
.card.active {
  border-color: rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.68);
}
.meta {
  font-size: 12px;
  opacity: 0.7;
}
.title {
  font-size: 18px;
  margin-top: 6px;
}
.desc {
  margin-top: 6px;
  opacity: 0.78;
  line-height: 1.6;
}
.note {
  margin-top: 12px;
  font-size: 12px;
  opacity: 0.7;
}
</style>
