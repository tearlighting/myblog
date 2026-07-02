<script setup lang="ts">
import { computed } from "vue"

interface IIntroduceProps {
  /**
   * 章节内部进度
   * 0 = 刚进入
   * 1 = 即将离开
   */
  progress?: number
  /**
   * 主标题
   */
  title?: string
  /**
   * 副标题
   */
  subtitle?: string
  /**
   * 简介文本
   */
  description?: string
}

const props = withDefaults(defineProps<IIntroduceProps>(), {
  progress: 0,
  title: "Intro / Who I Am",
  subtitle: "静かに、でも確かに積み上げてきたこと。",
  description: "Frontend を軸に、UI・状態管理・型設計・表現のあいだを行き来しながら、自分なりの作り方を少しずつ形にしてきました。",
})

const clamp = (value: number, min = 0, max = 1) => {
  return Math.min(max, Math.max(min, value))
}

const safeProgress = computed(() => clamp(props.progress))

/**
 * 轻微横向扫视
 * 不要太大，避免像 carousel
 */
const panX = computed(() => {
  return `${-8 + safeProgress.value * 16}%`
})

/**
 * 前景文字轻微上浮
 */
const contentY = computed(() => {
  return `${24 - safeProgress.value * 24}px`
})

/**
 * 透明度渐入
 */
const contentOpacity = computed(() => {
  return 0.35 + safeProgress.value * 0.65
})

/**
 * 背景 blur / scale 的细微变化
 */
const orbScale = computed(() => 0.96 + safeProgress.value * 0.06)
const orbOpacity = computed(() => 0.35 + safeProgress.value * 0.25)

/**
 * 给内部 style 用
 */
const sectionStyle = computed(() => {
  return {
    "--intro-pan-x": panX.value,
    "--intro-content-y": contentY.value,
    "--intro-content-opacity": String(contentOpacity.value),
    "--intro-orb-scale": String(orbScale.value),
    "--intro-orb-opacity": String(orbOpacity.value),
  }
})
</script>

<template>
  <section class="introduce-section relative min-h-screen overflow-hidden" :style="sectionStyle">
    <!-- 背景氛围层 -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="intro-grid absolute inset-0" />
      <div class="intro-noise absolute inset-0" />

      <div class="intro-orb intro-orb-1" />
      <div class="intro-orb intro-orb-2" />
      <div class="intro-orb intro-orb-3" />

      <div class="intro-pan-layer absolute inset-0">
        <div class="intro-pan-shape intro-pan-shape-left" />
        <div class="intro-pan-shape intro-pan-shape-right" />
      </div>
    </div>

    <!-- 主内容 -->
    <div class="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-16 md:px-10">
      <div class="grid w-full grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <!-- 左侧文案 -->
        <div class="flex items-center">
          <div
            class="intro-copy max-w-3xl"
            :style="{
              transform: `translate3d(0, var(--intro-content-y), 0)`,
              opacity: 'var(--intro-content-opacity)',
            }"
          >
            <div
              class="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs tracking-[0.18em] uppercase"
              style="
                border-color: color-mix(in srgb, var(--divider) 70%, transparent);
                background: color-mix(in srgb, var(--surface-2) 48%, transparent);
                color: var(--text-secondary);
                backdrop-filter: blur(12px);
              "
            >
              <span class="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              About Me
            </div>

            <h1 class="text-4xl font-semibold leading-tight md:text-6xl md:leading-[1.05]" style="color: var(--text-primary)">
              {{ title }}
            </h1>

            <p class="mt-5 max-w-2xl text-base leading-7 md:text-lg md:leading-8" style="color: var(--text-secondary)">
              {{ subtitle }}
            </p>

            <p class="mt-6 max-w-2xl text-sm leading-7 md:text-base" style="color: color-mix(in srgb, var(--text-secondary) 88%, white 12%)">
              {{ description }}
            </p>

            <div class="mt-8 flex flex-wrap gap-3">
              <span class="intro-chip">Frontend</span>
              <span class="intro-chip">TypeScript</span>
              <span class="intro-chip">UI / Motion</span>
              <span class="intro-chip">State Design</span>
            </div>
          </div>
        </div>

        <!-- 右侧视觉卡片 -->
        <div class="flex items-center justify-center lg:justify-end">
          <div class="intro-card-shell w-full max-w-[520px]">
            <div class="intro-card">
              <div class="intro-card-top">
                <div class="intro-avatar-ring">
                  <div class="intro-avatar-core">夏</div>
                </div>

                <div class="min-w-0">
                  <p class="text-xs uppercase tracking-[0.2em]" style="color: var(--text-tertiary)">Frontend Explorer</p>
                  <h2 class="mt-2 text-2xl font-medium" style="color: var(--text-primary)">Building with structure, motion and feeling.</h2>
                </div>
              </div>

              <div class="mt-8 grid grid-cols-2 gap-4">
                <div class="intro-mini-card">
                  <p class="intro-mini-label">Focus</p>
                  <p class="intro-mini-value">UI × Logic</p>
                </div>
                <div class="intro-mini-card">
                  <p class="intro-mini-label">Style</p>
                  <p class="intro-mini-value">Glass / Calm</p>
                </div>
                <div class="intro-mini-card">
                  <p class="intro-mini-label">Stack</p>
                  <p class="intro-mini-value">Vue / TS</p>
                </div>
                <div class="intro-mini-card">
                  <p class="intro-mini-label">Mood</p>
                  <p class="intro-mini-value">Slow Scan</p>
                </div>
              </div>

              <div class="intro-divider" />

              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="intro-mini-label">Current Theme</p>
                  <p class="text-sm" style="color: var(--text-secondary)">CSS variables driven surface & atmosphere</p>
                </div>

                <div class="intro-progress">
                  <div class="intro-progress-bar" :style="{ transform: `scaleX(${0.2 + safeProgress * 0.8})` }" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部提示 -->
    <div class="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center">
      <div class="intro-scroll-hint">
        <span>Scroll to explore</span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
.introduce-section {
  background:
    radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 30%),
    radial-gradient(circle at 80% 30%, color-mix(in srgb, var(--accent) 8%, transparent), transparent 26%),
    linear-gradient(180deg, color-mix(in srgb, var(--surface-0) 92%, black 8%) 0%, color-mix(in srgb, var(--surface-1) 94%, black 6%) 100%);
}

.intro-grid {
  background-image:
    linear-gradient(to right, color-mix(in srgb, var(--divider) 14%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--divider) 12%, transparent) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: radial-gradient(circle at center, rgba(0, 0, 0, 0.95), transparent 88%);
  opacity: 0.45;
}

.intro-noise {
  opacity: 0.06;
  background-image:
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.18) 0 1px, transparent 1px), radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.16) 0 1px, transparent 1px),
    radial-gradient(circle at 60% 80%, rgba(255, 255, 255, 0.12) 0 1px, transparent 1px);
  background-size:
    120px 120px,
    160px 160px,
    180px 180px;
}

.intro-pan-layer {
  transform: translate3d(var(--intro-pan-x), 0, 0);
  transition: transform 220ms linear;
  will-change: transform;
}

.intro-pan-shape {
  position: absolute;
  border-radius: 999px;
  filter: blur(28px);
  opacity: 0.22;
}

.intro-pan-shape-left {
  left: -8%;
  top: 18%;
  width: 30vw;
  height: 30vw;
  min-width: 260px;
  min-height: 260px;
  background: color-mix(in srgb, var(--accent) 18%, transparent);
}

.intro-pan-shape-right {
  right: -10%;
  bottom: 12%;
  width: 24vw;
  height: 24vw;
  min-width: 220px;
  min-height: 220px;
  background: color-mix(in srgb, white 10%, var(--accent) 12%);
}

.intro-orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(22px);
  transform: scale(var(--intro-orb-scale));
  opacity: var(--intro-orb-opacity);
  transition:
    transform 240ms ease,
    opacity 240ms ease;
}

.intro-orb-1 {
  left: 8%;
  top: 14%;
  width: 120px;
  height: 120px;
  background: color-mix(in srgb, var(--accent) 26%, transparent);
}

.intro-orb-2 {
  right: 14%;
  top: 16%;
  width: 86px;
  height: 86px;
  background: color-mix(in srgb, white 16%, transparent);
}

.intro-orb-3 {
  right: 20%;
  bottom: 16%;
  width: 140px;
  height: 140px;
  background: color-mix(in srgb, var(--accent) 18%, transparent);
}

.intro-card-shell {
  position: relative;
}

.intro-card-shell::before {
  content: "";
  position: absolute;
  inset: -16px;
  border-radius: 32px;
  background: radial-gradient(circle at center, color-mix(in srgb, var(--accent) 10%, transparent), transparent 70%);
  filter: blur(30px);
  opacity: 0.9;
  pointer-events: none;
}

.intro-card {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  padding: 24px;
  border: 1px solid color-mix(in srgb, var(--divider) 64%, transparent);
  background: linear-gradient(180deg, color-mix(in srgb, var(--surface-2) 76%, transparent) 0%, color-mix(in srgb, var(--surface-1) 70%, transparent) 100%);
  box-shadow: var(--elevation-1);
  backdrop-filter: blur(18px);
}

.intro-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, color-mix(in srgb, white 12%, transparent) 0%, transparent 36%, color-mix(in srgb, white 4%, transparent) 100%);
  pointer-events: none;
}

.intro-card-top {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 20px;
  align-items: center;
}

.intro-avatar-ring {
  display: grid;
  place-items: center;
  width: 96px;
  height: 96px;
  border-radius: 999px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--surface-3) 84%, transparent), color-mix(in srgb, var(--surface-2) 76%, transparent));
  border: 1px solid color-mix(in srgb, var(--divider) 64%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, white 18%, transparent),
    0 12px 32px rgba(0, 0, 0, 0.16);
}

.intro-avatar-core {
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border-radius: 999px;
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  background:
    radial-gradient(circle at 30% 30%, color-mix(in srgb, white 18%, transparent), transparent 35%),
    linear-gradient(180deg, color-mix(in srgb, var(--accent) 18%, var(--surface-2)), color-mix(in srgb, var(--accent) 6%, var(--surface-1)));
  border: 1px solid color-mix(in srgb, white 10%, transparent);
}

.intro-mini-card {
  border-radius: 18px;
  padding: 14px 14px 12px;
  border: 1px solid color-mix(in srgb, var(--divider) 58%, transparent);
  background: color-mix(in srgb, var(--surface-3) 52%, transparent);
}

.intro-mini-label {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-tertiary);
}

.intro-mini-value {
  margin-top: 6px;
  font-size: 14px;
  color: var(--text-primary);
}

.intro-divider {
  margin: 20px 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--divider) 72%, transparent), transparent);
}

.intro-progress {
  width: 120px;
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface-3) 72%, transparent);
  border: 1px solid color-mix(in srgb, var(--divider) 54%, transparent);
}

.intro-progress-bar {
  width: 100%;
  height: 100%;
  transform-origin: left center;
  background: linear-gradient(90deg, color-mix(in srgb, var(--accent) 82%, white 18%), color-mix(in srgb, white 20%, var(--accent) 80%));
}

.intro-chip {
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--text-secondary);
  border: 1px solid color-mix(in srgb, var(--divider) 62%, transparent);
  background: color-mix(in srgb, var(--surface-2) 52%, transparent);
  backdrop-filter: blur(10px);
}

.intro-scroll-hint {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--divider) 60%, transparent);
  background: color-mix(in srgb, var(--surface-2) 46%, transparent);
  color: var(--text-tertiary);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  backdrop-filter: blur(12px);
}

@media (max-width: 1024px) {
  .intro-card-top {
    grid-template-columns: 80px 1fr;
    gap: 16px;
  }

  .intro-avatar-ring {
    width: 80px;
    height: 80px;
  }

  .intro-avatar-core {
    width: 60px;
    height: 60px;
    font-size: 22px;
  }
}

@media (max-width: 640px) {
  .intro-card {
    padding: 18px;
    border-radius: 22px;
  }

  .intro-card-top {
    grid-template-columns: 1fr;
  }
}
</style>
