<script setup lang="ts">
import { nextTick, ref, watch } from "vue"

import type { VirtualScrollData } from "lenis"
import { ELumiState } from "../constant"
import { useInitLumiEffect, useSetStateTransition } from "../logicHooks"
import { useHomeStore } from "../store"

interface LumiSlide {
  id: string
  bigImg: string
  title?: string
  description?: string
}

const props = defineProps<{
  slides: LumiSlide[]
}>()

const { lumiStateMachine } = useHomeStore()

const cardRef = ref<HTMLElement | null>(null)
const glassRef = ref<HTMLElement | null>(null)
const blurRef = ref<HTMLElement | null>(null)
const imgRef = ref<HTMLImageElement | null>(null)
const mediaRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const descriptionRef = ref<HTMLElement | null>(null)

let initialized = false

watch(
  () => props.slides,
  async () => {
    if (!props.slides) return
    if (initialized) return
    initialized = true
    await nextTick()
    useInitLumiEffect({
      cardDoms: {
        card: cardRef.value!,
        media: mediaRef.value!,
        img: imgRef.value!,
        glass: glassRef.value!,
        blur: blurRef.value!,
      },
      textDoms: {
        text: textRef.value!,
        title: titleRef.value!,
        description: descriptionRef.value!,
      },
    })
    useSetStateTransition({
      mediaRef,
      imgRef,
      switchSlide,
    })
  },
  {
    immediate: true,
  }
)

/**  切换逻辑 */
const activeIndex = ref(0)
async function switchSlide(payload: VirtualScrollData) {
  if (payload.deltaY > 0) {
    activeIndex.value = (activeIndex.value + 1) % props.slides.length
  } else {
    activeIndex.value = (activeIndex.value - 1 + props.slides.length) % props.slides.length
  }
}

watch(activeIndex, async () => {
  lumiStateMachine.send({
    type: ELumiState.loading,
  })
})

function onImgLoad() {
  lumiStateMachine.send({
    type: ELumiState.loaded,
  })
}
</script>

<template>
  <section role="lumi-section" class="relative size-full overflow-hidden">
    <div role="lumi-stage" class="size-full relative perspective-distant">
      <!-- 背景层（以后你可以接特效） -->
      <div role="lumi-bg" class="absolute inset-[-30%] z-0 opacity-100 pointer-events-none"></div>

      <!-- Camera 作用层 -->
      <!-- 做rotate这些 -->
      <div role="lumi-card" class="relative size-full overflow-hidden z-1" ref="cardRef">
        <div role="lumi-glass" class="size-full" ref="glassRef">
          <div role="lumi-blur" class="size-full" ref="blurRef">
            <!-- 做translate -->
            <div role="lumi-media" class="xl:h-auto h-full relative w-full min-h-full opacity-0" ref="mediaRef">
              <img
                :key="props.slides[activeIndex].bigImg"
                :src="props.slides[activeIndex].bigImg"
                class="select-none block xl:h-auto xl:object-fill h-full object-scale-down w-full"
                draggable="false"
                ref="imgRef"
                @load="onImgLoad"
              />
            </div>

            <div role="lumi-text" class="xl:max-w-[420px] xl:left-[8%] xl:bottom-[18%] left-[6%] bottom-[14%] max-w-[90%] absolute z-5 opacity-100" ref="textRef">
              <h2 role="title" class="mb-[10px] font-medium w-fit" ref="titleRef">{{ props.slides[activeIndex].title }}</h2>
              <p role="description" ref="descriptionRef" class="font-normal">{{ props.slides[activeIndex].description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
/* 卡片层（Camera 操作对象） */

[role="lumi-card"] {
  [role="lumi-text"] {
    color: #f5f7fa;
    pointer-events: none;

    &::before {
      content: "";
      position: absolute;
      inset: -14px -18px;
      border-radius: 6px;
    }

    [role="title"] {
      font-size: clamp(22px, 2.2vw, 32px);
      line-height: 1.4;
      letter-spacing: 0.02em;
      color: #ffffff;
      text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4), 0 0 1px rgba(255, 255, 255, 0.1);
    }

    [role="description"] {
      font-size: clamp(14px, 1.2vw, 18px);
      line-height: 1.7;
      color: rgba(245, 247, 250, 0.9);
      text-shadow: 0 1px 6px rgba(0, 0, 0, 0.35);
    }
  }

  &:has([role="lumi-media"].is-loaded) {
    [role="lumi-text"] {
      &::before {
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0));
      }
    }
  }

  /* 👇 媒体层，不裁剪 */
  [role="lumi-media"] {
    will-change: transform;
    transition: filter 0.18s ease-out;
    transition: opacity 0.9s ease;

    &.is-loaded {
      opacity: 1;
    }
  }

  /* viewport */
  transform-style: preserve-3d;
  will-change: transform, filter;
  transform: scale(calc(1 + var(--lumi-pressure, 0) * var(--lumi-pressure-scale) * 0.035));
}
</style>
