<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from "vue"

type Ctx = {
  x: number
  localX: (i: number) => number
  inner: (i: number) => number
  consuming: (i: number) => boolean
}

const ctx = inject<Ctx>("AboutX")
if (!ctx) throw new Error("AboutX context not found")

const trackRef = ref<HTMLElement | null>(null)

const hud = computed(() => ({
  x: ctx.x,
  s1: ctx.localX(1),
  s2: ctx.localX(2),
  inner2: ctx.inner(2),
  cons2: ctx.consuming(2),
}))

let rafId = 0
function raf() {
  const w = document.documentElement.clientWidth
  if (trackRef.value) {
    trackRef.value.style.transform = `translate3d(${-ctx!.x * w}px,0,0)`
  }
  rafId = requestAnimationFrame(raf)
}

onMounted(() => {
  rafId = requestAnimationFrame(raf)
})
onBeforeUnmount(() => cancelAnimationFrame(rafId))
</script>

<template>
  <div class="root">
    <div class="hud">
      <div>globalX: {{ hud.x.toFixed(2) }}</div>
      <div>s1 localX: {{ hud.s1.toFixed(2) }}</div>
      <div>s2 localX: {{ hud.s2.toFixed(2) }}</div>
      <div>s2 inner: {{ hud.inner2.toFixed(2) }}</div>
      <div :class="['tag', hud.cons2 ? 'on' : '']">
        {{ hud.cons2 ? "CONSUMING" : "PASS" }}
      </div>
    </div>

    <div ref="trackRef" class="track">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #0b1020;
  color: rgba(245, 247, 250, 0.92);
}
.track {
  height: 100%;
  display: flex;
  will-change: transform;
}
.hud {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 9999;
  display: flex;
  gap: 10px;
  font-size: 12px;
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(2, 6, 23, 0.55);
  backdrop-filter: blur(10px);
}
.tag.on {
  border-color: rgba(56, 189, 248, 0.55);
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.12);
}
</style>
