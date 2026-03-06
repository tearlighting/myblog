<script setup lang="ts">
defineProps<{
  title: string
  local: number // 0..1
  active: boolean
}>()
</script>

<template>
  <div role="sec cinematic">
    <div
      role="bg"
      :style="{
        transform: `translateX(${(local - 0.5) * 60}px) scale(${1.06 - local * 0.04})`,
      }"
    />
    <div role="inner">
      <h2 :style="{ opacity: (0.35 + local * 0.65).toFixed(3), transform: `translateY(${(1 - local) * 12}px)` }">
        {{ title }}
      </h2>
      <p :style="{ opacity: (0.2 + local * 0.75).toFixed(3), transform: `translateY(${(1 - local) * 18}px)` }">连续探索：localProgress 驱动 parallax / 文案渐入（你换任何花活都行）。</p>
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

[role="inner"] {
  width: min(860px, 92%);
  padding: 18px;
}

[role~="cinematic"] [role="bg"] {
  position: absolute;
  inset: -30%;
  background: radial-gradient(40% 40% at 30% 20%, rgba(125, 211, 252, 0.18), transparent 70%), radial-gradient(45% 45% at 70% 80%, rgba(167, 139, 250, 0.14), transparent 75%);
  filter: blur(80px);
  opacity: 0.25;
  pointer-events: none;
}
</style>
