<script setup lang="ts">
import { useNextTrickEffect } from "@/hooks/useNextTrickEffect"
import { createLenis } from "@/utils"
import { onMounted, onUnmounted, ref } from "vue"

const scrollRef = ref<HTMLElement | null>(null)
const scrollSpaceRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
let lenisIns: ReturnType<typeof createLenis> | null = null

const sceneCount = 4

const update = () => {
  const scroll = scrollRef.value
  const track = trackRef.value
  if (!scroll || !track) return

  const maxScroll = scroll.scrollHeight - scroll.clientHeight
  const progress = maxScroll <= 0 ? 0 : scroll.scrollTop / maxScroll

  const viewportWidth = scroll.clientWidth
  const maxX = viewportWidth * (sceneCount - 1)

  track.style.transform = `translate3d(${-maxX * progress}px, 0, 0)`
}

onMounted(() => {
  const scroll = scrollRef.value
  const scrollSpace = scrollSpaceRef.value
  if (!scroll || !scrollSpace) return

  lenisIns = createLenis({
    wrapper: scroll,
    content: scrollSpace,
    eventsTarget: scroll,
  })
  lenisIns.on("virtual-scroll", update)
  update()
  window.addEventListener("resize", update)
})

onUnmounted(() => {
  lenisIns?.off("virtual-scroll", update)
  lenisIns?.destroy()
  lenisIns = null
  window.removeEventListener("resize", update)
})

const a = ref(1)
useNextTrickEffect(
  () => {
    console.log(a.value)
  },
  () => [a.value],
)
</script>

<template>
  <section class="intro-root">
    <div class="stage">
      <div class="bg-grid" />

      <div ref="trackRef" class="track">
        <section class="scene opening">
          <p class="label">ABOUT / BEGINNING</p>
          <h1>This page exists because I don't want to forget how I got here.</h1>
        </section>

        <section class="scene">
          <div class="desk">
            <div class="item keyboard">Keyboard</div>
            <div class="item notebook">Notebook</div>
            <div class="item coffee">Coffee</div>
          </div>
          <p class="copy">Not a resume first. More like a room with traces left behind.</p>
        </section>

        <section class="scene">
          <div class="tag t1">Vue</div>
          <div class="tag t2">React</div>
          <div class="tag t3">TypeScript</div>
          <div class="tag t4">English</div>
          <div class="tag t5">AI</div>
          <div class="tag t6">Blog</div>
        </section>

        <section class="scene opening">
          <p class="label">ARCHIVE / 01</p>
          <h2>This website is a portfolio.<br />This chapter is the reason behind it.</h2>
        </section>
      </div>
    </div>

    <div ref="scrollRef" class="internal-scroll">
      <div ref="scrollSpaceRef" class="scroll-space" />
    </div>
  </section>
</template>

<style scoped lang="less">
.intro-root {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  color: var(--color-text);
  background:
    radial-gradient(40% 40% at 25% 30%, color-mix(in srgb, var(--color-primary) 16%, transparent), transparent 70%),
    radial-gradient(36% 42% at 75% 75%, color-mix(in srgb, var(--color-secondary) 12%, transparent), transparent 74%), var(--surface-0);
}

.stage {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.internal-scroll {
  position: absolute;
  inset: 0;
  z-index: 10;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
}

.scroll-space {
  height: 400%;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, color-mix(in srgb, var(--divider) 14%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--divider) 10%, transparent) 1px, transparent 1px);
  background-size: 72px 72px;
  opacity: 0.45;
}

.track {
  position: absolute;
  inset: 0 auto 0 0;
  display: flex;
  width: 400%;
  height: 100%;
  will-change: transform;
}

.scene {
  position: relative;
  width: 25%;
  height: 100%;
  flex: 0 0 25%;
  padding: 64px;
  overflow: hidden;
}

.opening {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.label {
  font-size: 12px;
  letter-spacing: 0.24em;
  color: var(--color-muted);
}

h1,
h2 {
  max-width: 880px;
  margin-top: 24px;
  font-size: clamp(42px, 5vw, 76px);
  line-height: 1.08;
  font-weight: 650;
}

.desk {
  position: absolute;
  left: 12%;
  right: 12%;
  bottom: 26%;
  height: 260px;
  border-bottom: 2px solid color-mix(in srgb, var(--divider) 70%, transparent);
}

.item,
.tag {
  position: absolute;
  display: grid;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--divider) 70%, transparent);
  background: color-mix(in srgb, var(--surface-1) 56%, transparent);
  backdrop-filter: blur(14px);
  box-shadow: var(--elevation-2);
  color: var(--color-muted);
}

.keyboard {
  left: 8%;
  bottom: 20px;
  width: 300px;
  height: 70px;
  border-radius: 18px;
}

.notebook {
  left: 48%;
  bottom: 48px;
  width: 170px;
  height: 220px;
  border-radius: 14px;
  transform: rotate(-8deg);
}

.coffee {
  right: 12%;
  bottom: 72px;
  width: 90px;
  height: 90px;
  border-radius: 999px;
}

.copy {
  position: absolute;
  left: 64px;
  bottom: 64px;
  max-width: 520px;
  color: var(--color-muted);
  font-size: 16px;
  line-height: 1.8;
}

.tag {
  padding: 14px 18px;
  border-radius: 999px;
}

.t1 {
  left: 14%;
  top: 26%;
}
.t2 {
  left: 30%;
  top: 50%;
}
.t3 {
  left: 48%;
  top: 28%;
}
.t4 {
  left: 62%;
  top: 58%;
}
.t5 {
  left: 76%;
  top: 34%;
}
.t6 {
  left: 24%;
  top: 72%;
}
</style>
