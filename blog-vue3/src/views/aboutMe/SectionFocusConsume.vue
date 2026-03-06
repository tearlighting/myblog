<script setup lang="ts">
import { computed, inject } from "vue"

const props = defineProps<{ index: number }>()
type Ctx = { localX: (i: number) => number; inner: (i: number) => number; consuming: (i: number) => boolean }
const ctx = inject<Ctx>("AboutX")!

const lx = computed(() => ctx.localX(props.index))
const inner = computed(() => ctx.inner(props.index))
const isConsuming = computed(() => ctx.consuming(props.index))

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))
const ease = (t: number) => t * t * (3 - 2 * t)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

// 进/退场（localX）
const enter = computed(() => ease(lx.value))
const exit = computed(() => ease(Math.max(0, lx.value - 0.9) / 0.1))

// 内部 3 阶段（inner）
const s1 = computed(() => clamp01(inner.value / 0.33))
const s2 = computed(() => clamp01((inner.value - 0.33) / 0.33))
const s3 = computed(() => clamp01((inner.value - 0.66) / 0.34))

const glow = computed(() => lerp(0.05, 0.9, s1.value))
const blurPx = computed(() => lerp(18, 0, s2.value))
const scale = computed(() => lerp(0.84, 1.08, s2.value))
const rx = computed(() => lerp(30, 0, s2.value))
const ry = computed(() => lerp(-30, 0, s2.value))

const lineGrow = computed(() => lerp(0, 1, s2.value))
const badgePop = computed(() => lerp(0, 1, s3.value))
</script>

<template>
  <section class="focus">
    <div class="wrap" :style="{ opacity: lerp(0.18, 1, enter) * (1 - 0.25 * exit), transform: `translateY(${18 * (1 - enter) + 10 * exit}px)` }">
      <div class="hud">
        Section2 · Focus Consume · localX {{ lx.toFixed(2) }} · inner {{ inner.toFixed(2) }}
        <span class="tag" :class="{ on: isConsuming }">{{ isConsuming ? "CONSUMING" : "PASS" }}</span>
      </div>

      <div class="stage">
        <div class="glow" :style="{ opacity: glow }"></div>

        <div
          class="card"
          :style="{
            transform: `scale(${scale}) rotateX(${rx}deg) rotateY(${ry}deg)`,
            filter: `blur(${blurPx}px) brightness(${lerp(0.72, 1.1, s2)}) contrast(${lerp(0.92, 1.18, s2)})`,
          }"
        >
          <div class="title">Dynamic Form Engine</div>
          <div class="sub">scroll consumed → inner animation (forward & backward)</div>

          <div class="schema">
            <div class="node" :style="{ opacity: lerp(0.05, 1, s1), transform: `translateY(${lerp(18, 0, s1)}px)` }">Schema</div>
            <div class="node" :style="{ opacity: lerp(0.05, 1, s2), transform: `translateY(${lerp(22, 0, s2)}px)` }">Validation</div>
            <div class="node" :style="{ opacity: lerp(0.05, 1, s3), transform: `translateY(${lerp(26, 0, s3)}px)` }">Renderer</div>

            <div class="line" :style="{ opacity: lerp(0, 1, s2), transform: `scaleX(${lineGrow})` }"></div>
          </div>

          <div class="badge" :style="{ opacity: badgePop, transform: `translateY(${lerp(12, 0, badgePop)}px) scale(${lerp(0.94, 1, badgePop)})` }">“Complexity → System”</div>
        </div>
      </div>

      <div class="note">现在回退一定会反向回去：inner 会下降，动画倒放。</div>
    </div>
  </section>
</template>

<style scoped>
.focus {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: radial-gradient(900px 520px at 55% 40%, rgba(56, 189, 248, 0.16), transparent 60%), radial-gradient(900px 520px at 30% 75%, rgba(168, 85, 247, 0.12), transparent 65%), #050816;
  perspective: 1200px;
}
.wrap {
  width: min(940px, 92%);
  will-change: transform, opacity;
}
.hud {
  font-size: 12px;
  opacity: 0.78;
  margin: 0 0 12px;
  display: flex;
  gap: 10px;
  align-items: center;
}
.tag {
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  opacity: 0.85;
}
.tag.on {
  border-color: rgba(56, 189, 248, 0.55);
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.12);
}

.stage {
  position: relative;
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(255, 255, 255, 0.035);
  backdrop-filter: blur(12px);
  overflow: hidden;
  padding: 26px;
}

.glow {
  position: absolute;
  inset: -45%;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.38), transparent 62%);
  filter: blur(180px);
  pointer-events: none;
}

.card {
  position: relative;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(15, 23, 42, 0.62);
  backdrop-filter: blur(14px);
  box-shadow: 0 26px 90px rgba(0, 0, 0, 0.55);
  transform-style: preserve-3d;
  will-change: transform, filter;
  padding: 18px 18px 16px;
}

.title {
  font-size: 22px;
  letter-spacing: 0.02em;
}
.sub {
  margin-top: 6px;
  opacity: 0.75;
  font-size: 13px;
}

.schema {
  margin-top: 16px;
  display: grid;
  gap: 10px;
}
.node {
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(2, 6, 23, 0.45);
  padding: 12px 12px;
  opacity: 0.05;
  will-change: transform, opacity;
}
.line {
  height: 2px;
  transform-origin: left center;
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.75), rgba(168, 85, 247, 0.65));
  border-radius: 999px;
  margin-top: 6px;
}

.badge {
  margin-top: 14px;
  display: inline-block;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(2, 6, 23, 0.42);
  opacity: 0;
  will-change: transform, opacity;
}

.note {
  margin-top: 12px;
  font-size: 12px;
  opacity: 0.7;
  line-height: 1.6;
}
</style>
