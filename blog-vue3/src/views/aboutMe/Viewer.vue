<script setup lang="ts">
import { useMounted } from "@/hooks/useMounted"
import { useTemplateRef } from "vue"
import Section from "./components/Section.vue"
import { useInitLumiEffect } from "./logicHooks"

const scrollerWrapperRef = useTemplateRef("scrollerWrapper")
const scrollerContentRef = useTemplateRef("aboutMeContent")

useMounted(() => {
  if (!scrollerContentRef.value || !scrollerWrapperRef.value) return
  useInitLumiEffect({
    scrollerContent: scrollerContentRef.value,
    scrollerWrapper: scrollerWrapperRef.value,
  })
})
</script>

<template>
  <div class="text-white size-full overflow-hidden" role="about-me-container" ref="scrollerWrapper">
    <div role="about-me-content" class="size-full flex flex-nowrap" ref="aboutMeContent">
      <Section class="size-full w-[200%]! shrink-0">about1</Section>
      <Section role="about-gap" class="size-full shrink-0"></Section>
      <Section class="size-full shrink-0">about2</Section>
      <Section role="about-gap" class="size-full shrink-0"></Section>
    </div>
  </div>
</template>

<style lang="less" scoped>
[role="about-me-container"] {
  /* ======= runtime vars (from apply) ======= */
  --x: 0; /* 0 ~ 1 */
  --pressure: 0; /* 0 ~ 1 */
  --xdir: 1; /* 1 | -1 */

  /* ======= tuning knobs ======= */
  --x-range: 220px; /* 横向扫视幅度：先给一个体感值，之后你再调 */
  --tilt: 6deg; /* 轻微透视倾斜 */
  --press-zoom: 0.018; /* 压迫时轻微放大 */
  --press-blur: 10px; /* 压迫时 blur 上限 */
  --press-dim: 0.08; /* 压迫时整体变暗 */
  --press-vignette: 0.18; /* 四角暗角增强 */

  position: relative;
  isolation: isolate;
  background: var(--surface-0);

  /* 让 x/pressure 变化更像“惯性”，避免抖动颗粒感 */
  transition:
    filter 0.12s ease,
    transform 0.12s ease;
  /* 背景氛围层：用 x 和 pressure 做漂移/压迫 */
  &::before,
  &::after {
    content: "";
    position: absolute;
    inset: 0%;
    pointer-events: none;
    z-index: 0;
    filter: blur(90px);
    opacity: 0.9;
    transform: translate(calc((var(--x) - 0.5) * -160px), calc(var(--pressure) * -12px)) scale(calc(1 + var(--pressure) * 0.06));
    transition: transform 0.12s ease;
  }
  &::before {
    background: radial-gradient(40% 40% at 30% 20%, rgba(125, 211, 252, 0.14), transparent 68%), radial-gradient(44% 44% at 74% 72%, rgba(167, 139, 250, 0.12), transparent 70%);
  }
  &::after {
    opacity: 0.75;
    background: radial-gradient(36% 36% at 55% 35%, rgba(240, 171, 252, 0.09), transparent 72%), radial-gradient(42% 42% at 20% 85%, rgba(34, 211, 238, 0.07), transparent 76%);
  }
  /* 内容层：真正被 x/pressure 驱动 */
  [role="about-me-content"] {
    position: relative;
    z-index: 1;

    /* 玻璃卡片底 + 边框（跟你全站一致） */
    background: color-mix(in srgb, var(--surface-1) 78%, transparent);
    border: 1px solid color-mix(in srgb, var(--divider) 65%, transparent);
    border-radius: 18px;
    box-shadow: var(--elevation-2);
    backdrop-filter: blur(14px);

    /* cinematic：一点透视 + 横向扫视 */
    transform-style: preserve-3d;
    // transform: // perspective(1200px)
    //   // translateX(calc((var(--x) - 0.5) * -1 * var(--x-range)))
    //   // rotateY(calc((var(--x) - 0.5) * var(--tilt)))
    //   scale(calc(1 + var(--pressure) * var(--press-zoom)));
    transform: translate3d(calc(var(--x, 0) * -100%), 0, 0);
    /* 压迫时：轻微 blur + 降亮度（克制） */
    filter: blur(calc(var(--pressure) * var(--press-blur))) brightness(calc(1 - var(--pressure) * var(--press-dim)));

    transition:
      transform 0.08s ease-out,
      filter 0.12s ease-out;
    will-change: transform, filter;

    /* 这里先让你能看到“内容区域”的排版空间 */
    padding: clamp(18px, 2.2vw, 32px);
    /* 压迫感：暗角 + 边缘收紧（看起来像“推到边界顶住”） */
    &::after {
      content: "";
      position: absolute;
      inset: -2px;
      border-radius: inherit;
      pointer-events: none;

      background: radial-gradient(120% 120% at 50% 50%, transparent 62%, rgba(0, 0, 0, calc(var(--pressure) * var(--press-vignette))) 100%);

      opacity: 1;
    }
  }
}

/* 可选：给文本一个更“阅读/叙事”的基调 */
[role="about-me-content"] {
  color: color-mix(in srgb, var(--color-text) 94%, transparent);
  line-height: 1.7;
}

[role="about-gap"] {
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  pointer-events: none;

  background: radial-gradient(60% 60% at 50% 50%, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 70%);

  backdrop-filter: blur(calc(var(--pressure, 0) * 18px));
  opacity: calc(0.2 + var(--pressure, 0) * 0.6);

  transform: translateX(calc(var(--xdir, 1) * var(--pressure, 0) * 24px)) scale(calc(1 - var(--pressure, 0) * 0.04));

  transition: opacity 0.2s ease;
}
</style>
