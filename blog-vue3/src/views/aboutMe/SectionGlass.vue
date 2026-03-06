<script setup lang="ts">
const props = defineProps<{
  title: string
  local: number
  active: boolean
}>()

function center() {
  return 1 - Math.min(1, Math.abs(props.local - 0.5) * 2)
}
</script>

<template>
  <div role="sec glass">
    <div role="glow" :style="{ opacity: (0.08 + center() * 0.3).toFixed(3) }" />
    <div
      role="card"
      :style="{
        transform: `scale(${0.96 + center() * 0.06}) rotateX(${(1 - center()) * 8}deg) rotateY(${(1 - center()) * -8}deg)`,
        filter: `blur(${(1 - center()) * 2.2}px)`,
      }"
    >
      <h2>{{ title }}</h2>
      <p>center={{ center().toFixed(2) }}</p>
    </div>
  </div>
</template>

<style scoped>
[role~="sec"] {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  position: relative;
}

[role~="glass"] [role="glow"] {
  position: absolute;
  inset: -25%;
  background: radial-gradient(45% 45% at 50% 50%, rgba(125, 211, 252, 0.18), transparent 70%);
  filter: blur(90px);
  opacity: 0.12;
  pointer-events: none;
}

[role~="glass"] [role="card"] {
  width: min(720px, 92%);
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(12px);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.35);
  padding: 18px 18px 16px;
  transform-style: preserve-3d;
  will-change: transform, filter;
  transition:
    transform 0.12s ease,
    filter 0.12s ease;
}
</style>
