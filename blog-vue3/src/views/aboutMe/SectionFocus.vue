<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
  localX: number // 0..1
  inner: number // 0..1（由父组件吃滚动驱动）
  consuming: boolean
}>()

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))
const lx = computed(() => clamp01(props.localX))
const inner = computed(() => clamp01(props.inner))

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

// 三阶段：结构 → 复杂度 → 收束
const s1 = computed(() => clamp01(inner.value / 0.33))
const s2 = computed(() => clamp01((inner.value - 0.33) / 0.33))
const s3 = computed(() => clamp01((inner.value - 0.66) / 0.34))

const focusGlow = computed(() => lerp(0.08, 0.45, s1.value))
const blurPx = computed(() => lerp(3.2, 0, s2.value))
const scale = computed(() => lerp(0.94, 1.04, s2.value))
const rx = computed(() => lerp(12, 0, s2.value))
const ry = computed(() => lerp(-12, 0, s2.value))

const lineGrow = computed(() => lerp(0.0, 1.0, s2.value))
const badgePop = computed(() => lerp(0.0, 1.0, s3.value))
</script>

<template>
  <section class="focus">
    <div class="wrap">
      <div class="hud">
        Section2 · Focus Consume · localX: {{ lx.toFixed(2) }} · inner: {{ inner.toFixed(2) }}
        <span class="tag" :class="{ on: consuming }">{{ consuming ? "CONSUMING" : "PASS" }}</span>
      </div>

      <div class="stage">
        <div class="glow" :style="{ opacity: focusGlow }"></div>

        <div
          class="card"
          :style="{
            transform: `translateZ(0) scale(${scale}) rotateX(${rx}deg) rotateY(${ry}deg)`,
            filter: `blur(${blurPx}px)`,
          }"
        >
          <div class="title">Dynamic Form Engine</div>
          <div class="sub">scroll is being consumed → internal animation</div>

          <!-- Stage visuals -->
          <div class="schema">
            <div class="node a" :style="{ opacity: lerp(0.2, 1, s1), transform: `translateY(${lerp(14, 0, s1)}px)` }">Schema</div>
            <div class="node b" :style="{ opacity: lerp(0.1, 1, s2), transform: `translateY(${lerp(18, 0, s2)}px)` }">Validation</div>
            <div class="node c" :style="{ opacity: lerp(0.1, 1, s3), transform: `translateY(${lerp(22, 0, s3)}px)` }">Renderer</div>

            <div class="line" :style="{ transform: `scaleX(${lineGrow})`, opacity: lerp(0, 1, s2) }"></div>
          </div>

          <div class="badge" :style="{ opacity: badgePop, transform: `translateY(${lerp(10, 0, badgePop)}px) scale(${lerp(0.96, 1, badgePop)})` }">“Complexity → System”</div>
        </div>
      </div>

      <div class="note">进入中段会“吸住”：X 变慢/停，滚轮主要推 inner。inner 到 1 后继续滚会放行继续横向走。</div>
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
  width: min(920px, 92%);
  position: relative;
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
  opacity: 0.8;
}
.tag.on {
  border-color: rgba(56, 189, 248, 0.5);
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.08);
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
  inset: -40%;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.35), transparent 62%);
  filter: blur(120px);
  pointer-events: none;
  transition: opacity 0.1s linear;
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
  position: relative;
  display: grid;
  gap: 10px;
}
.node {
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(2, 6, 23, 0.45);
  padding: 12px 12px;
  opacity: 0.2;
  will-change: transform, opacity;
}
.line {
  height: 2px;
  transform-origin: left center;
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.65), rgba(168, 85, 247, 0.55));
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
