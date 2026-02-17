<script setup lang="ts"></script>

<template>
  <section role="about-gap" class="size-full relative pointer-events-none">
    <div role="glass-door" class="absolute inset-[10%]">
      <div role="glass-noise" class="absolute inset-0"></div>
      <div role="glass-rim" class="absolute inert-[-10px]"></div>
    </div>
  </section>
</template>

<style lang="less" scoped>
/* 呼吸感：很轻，别抢戏 */
@keyframes door-breathe {
  0%,
  100% {
    opacity: 0.95;
  }
  50% {
    opacity: 1;
  }
}
[role="about-gap"] {
  transition: opacity 0.18s ease;
  /* Gap 自己不做“空白页”，而是非常淡的环境层 */
  background:
    radial-gradient(50% 40% at 35% 35%, color-mix(in srgb, var(--color-primary) 10%, transparent), transparent 70%),
    radial-gradient(55% 45% at 70% 70%, color-mix(in srgb, var(--color-secondary) 8%, transparent), transparent 75%);

  /* 让它平时几乎没存在感，pressure 才显形 */
  opacity: calc(0.08 + var(--pressure, 0) * 0.55);
  /* 给一点“被推开”的方向感 */
  transform: translate3d(calc(var(--xdir, 1) * var(--pressure, 0) * 18px), 0, 0);
}

[role="glass-door"] {
  border-radius: 22px;

  /* 门的“厚度/霜化”全部由 pressure 控制 */
  background: color-mix(in srgb, var(--surface-1) 45%, transparent);
  border: 1px solid color-mix(in srgb, var(--divider) 35%, transparent);
  box-shadow:
    0 12px 30px color-mix(in srgb, #000 20%, transparent),
    0 0 0 1px color-mix(in srgb, var(--divider) 22%, transparent),
    inset 0 0 0 1px color-mix(in srgb, var(--color-primary) 10%, transparent);

  /* 玻璃核心：压力越大，越模糊、越“厚” */
  backdrop-filter: blur(calc(6px + var(--pressure, 0) * 22px)) saturate(1.2);

  /* 门被推时的“透视感” */
  transform: perspective(1000px) rotateY(calc(var(--xdir, 1) * var(--pressure, 0) * 10deg)) scale(calc(0.98 + var(--pressure, 0) * 0.03));

  transform-origin: center;

  animation: door-breathe 6.5s ease-in-out infinite;
}

[role="glass-noise"] {
  border-radius: inherit;
  /* 细噪点：让玻璃更真实 */
  background:
    radial-gradient(circle at 20% 30%, color-mix(in srgb, #fff 10%, transparent), transparent 35%), radial-gradient(circle at 70% 60%, color-mix(in srgb, #fff 8%, transparent), transparent 40%),
    repeating-linear-gradient(135deg, transparent 0 6px, color-mix(in srgb, #fff 4%, transparent) 6px 7px);

  opacity: calc(0.08 + var(--pressure, 0) * 0.22);
  mix-blend-mode: overlay;
  pointer-events: none;
}

[role="glass-rim"] {
  position: absolute;
  border-radius: inherit;
  pointer-events: none;

  /* 门边缘光：这是“玻璃门”的灵魂 */
  background: radial-gradient(60% 60% at 50% 50%, transparent 58%, color-mix(in srgb, var(--color-primary) 14%, transparent) 68%, transparent 78%);

  filter: blur(calc(8px + var(--pressure, 0) * 18px));
  opacity: calc(0.08 + var(--pressure, 0) * 0.45);
}
</style>
