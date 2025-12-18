<script setup lang="ts">
import { useLanguageStore } from "@/store"
import { loopIndex, sleep } from "@/utils"
import clsx from "clsx"
import { storeToRefs } from "pinia"
import { computed, nextTick, ref, watch } from "vue"
import { ECarouselPhase } from "../constant"
import { useInitCarousel, useInitStateTransition } from "../logicHooks"
import { useProjectStore } from "../store"
import ProjectCard from "./ProjectCard.vue"

const {
  projectListStore: { projects },
  projectCardECarouselPhaseStateMachineRef,
} = useProjectStore()

const { currentLocale } = storeToRefs(useLanguageStore())

const projectWithTranslateContent = computed(() => {
  const lang = currentLocale.value
  return projects.map((item) => {
    const translateContent = item.translations.find((x) => x.lang === lang) || item.translations.find((x) => x.lang === "zh")
    return {
      ...item,
      ...translateContent!,
    }
  })
})

const activeIndex = ref(0)

const changeActiveIndex = (dir: -1 | 1) => {
  if (dir > 0) {
    activeIndex.value = loopIndex(activeIndex.value - 1, projectWithTranslateContent.value.length)
  } else {
    activeIndex.value = loopIndex(activeIndex.value + 1, projectWithTranslateContent.value.length)
  }
}

const renderItems = computed(() => {
  const list = projectWithTranslateContent.value
  const len = list.length
  if (len === 0) return []
  const cur = activeIndex.value
  return [list[loopIndex(cur - 1, len)], list[loopIndex(cur, len)], list[loopIndex(cur + 1, len)]]
})

const targetRef = ref<HTMLDivElement>()

let initialized = false
watch(
  projects,
  async () => {
    if (!projects) return
    if (initialized) return
    initialized = true
    await nextTick()
    useInitCarousel({
      target: targetRef.value!,
      track: targetRef.value!,
    })
    useInitStateTransition({
      changeActiveIndex,
      track: targetRef.value!,
    })
  },
  {
    immediate: true,
  }
)

watch(
  activeIndex,
  async () => {
    projectCardECarouselPhaseStateMachineRef.current?.send({
      type: ECarouselPhase.idle,
    })
    await nextTick()
    //动画结束，进入下一个阶段
    await sleep(600)
    projectCardECarouselPhaseStateMachineRef.current?.send({
      type: ECarouselPhase.ready,
    })
  },
  {
    immediate: true,
  }
)

const jumpTo = (idx: number) => {
  if (idx === 1) return
  if (idx === 0) {
    projectCardECarouselPhaseStateMachineRef.current?.send({
      type: ECarouselPhase.switching,
      payload: {
        dir: 1,
        source: "click",
      },
    })
  } else if (idx == 2) {
    projectCardECarouselPhaseStateMachineRef.current?.send({
      type: ECarouselPhase.switching,
      payload: {
        dir: -1,
        source: "click",
      },
    })
  }
}
</script>

<template>
  <div role="project-track" class="grid grid-cols-[.4fr_1fr_.4fr] h-full gap-[2rem] items-center overflow-x-hidden perspective-distant px-[8%] py-[5%]" ref="targetRef">
    <div role="card-wrapper" class="h-130" v-for="(item, idx) in renderItems" :key="item.id" :class="clsx(idx === 0 && 'pre-card', idx === 1 && 'active-card', idx === 2 && 'next-card')">
      <ProjectCard :project="item" @click="jumpTo(idx)" />
    </div>
  </div>
</template>

<style lang="less" scoped>
[role="project-track"] {
  :root {
    --p: 0;
    --dir: 1;
  }

  [role="card-wrapper"] {
    transition: transform 0.5s ease, filter 0.5s ease, opacity 0.5s ease;
    &.pre-card {
      transform: translateX(-42%) rotateY(calc(-10deg - var(--p) * 6deg)) scale(calc(0.92 - var(--p) * 0.04));
      filter: blur(1.5px);
      opacity: 0.55;
    }
    &.active-card {
      transform: translateX(calc(var(--p) * 40%)) scale(calc(1 + var(--p) * 0.04));
      filter: none;
      opacity: 1;
    }
    &.next-card {
      transform: translateX(42%) rotateY(calc(10deg + var(--p) * 6deg)) scale(calc(0.92 - var(--p) * 0.04));
      filter: blur(1.5px);
      opacity: 0.55;
    }
  }
}
</style>
