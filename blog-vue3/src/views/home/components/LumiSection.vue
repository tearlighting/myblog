<script setup lang="ts">
import { nextTick, ref, watch } from "vue"

import type { VirtualScrollData } from "lenis"
import { ELumiTopic } from "../core/constant"
import { useHomeStore } from "../store"

const {
  lumiStore: { scene, initailLumiEffect, camera },
} = useHomeStore()
/** ========= props ========= */

interface LumiSlide {
  id: string
  bigImg: string
  title?: string
  description?: string
}

const props = defineProps<{
  slides: LumiSlide[]
}>()

/** ========= state ========= */

const activeIndex = ref(0)
const cardRef = ref<HTMLElement | null>(null)
const imgRef = ref<HTMLImageElement | null>(null)
const mediaRef = ref<HTMLElement | null>(null)
let initialized = false

watch(
  () => props.slides,
  async () => {
    if (!props.slides) return
    if (initialized) return
    initialized = true
    await nextTick()
    initailLumiEffect({
      card: cardRef.value!,
      media: mediaRef.value!,
      img: imgRef.value!,
    })
    scene.value!.subPubIns.subscribe<VirtualScrollData>(ELumiTopic.switch, switchSlide)
  },
  {
    immediate: true,
  }
)

/** ========= 切换逻辑 ========= */

function switchSlide(payload: VirtualScrollData) {
  if (payload.deltaY > 0) {
    activeIndex.value = (activeIndex.value + 1) % props.slides.length
  } else {
    activeIndex.value = (activeIndex.value - 1 + props.slides.length) % props.slides.length
  }
}

watch(activeIndex, () => {
  // slide 变化时，重置 camera 目标
  requestAnimationFrame(() => {
    if (cardRef.value && camera.value) {
      camera.value.changeTarget(cardRef.value, cardRef.value.querySelector("img")!)
    }
  })
})

function onImgLoad() {
  // ✅ 新图加载完成，重置 maxOffset + offset
  camera.value?.resetForCurrentSlide?.()
  // ✅ 解除 locked
  camera.value?.unlock?.()
}
</script>

<template>
  <section class="lumi-section">
    <div class="lumi-stage">
      <!-- 背景层（以后你可以接特效） -->
      <div class="lumi-bg"></div>

      <!-- Camera 作用层 -->
      <div class="lumi-card" ref="cardRef">
        <div class="lumi-media" ref="mediaRef">
          <img :src="props.slides[activeIndex].bigImg" class="lumi-img" draggable="false" ref="imgRef" @load="onImgLoad" />
        </div>

        <div class="lumi-text">
          <h2>{{ props.slides[activeIndex].title }}</h2>
          <p>{{ props.slides[activeIndex].description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lumi-section {
  position: relative;
  height: 100%;
  overflow: hidden;
}

/* scene 容器 */
.lumi-stage {
  width: 100%;
  height: 100%;
  perspective: 1200px;
  position: relative;
}

/* 背景层（先占位） */
.lumi-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 60%);
  z-index: 0;
}

/* 文案 */
.lumi-text {
  position: absolute;
  left: 8%;
  bottom: 18%;
  color: white;
  backdrop-filter: blur(8px);
}
/* 卡片层（Camera 操作对象） */

.lumi-card {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden; /* viewport */
  transform-style: preserve-3d;
  will-change: transform, filter;
}

/* 👇 媒体层，不裁剪 */
.lumi-media {
  position: relative;
  width: 100%;
  will-change: transform;
}

/* 👇 图片是真实高度 */
.lumi-img {
  width: 100%;
  height: auto; /* 关键 */
  display: block;
  user-select: none;
}
</style>
