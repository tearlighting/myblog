<script setup lang="ts">
import { sleep } from "@/utils"
import clsx from "clsx"
import { nextTick, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { ECarouselPhase } from "../constant"
import { useActiveIndex, useInitCarousel, useInitStateTransition, useSwithOnClick } from "../logicHooks"
import { useProjectStore } from "../store"
import ProjectCard from "./ProjectCard.vue"

const {
  projectListStore: { projects },
  projectCardECarouselPhaseStateMachineRef,
} = useProjectStore()

const { activeIndex, changeActiveIndex, renderItems } = useActiveIndex()
const { jumpTo } = useSwithOnClick()
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

const { push } = useRouter()
const toDetailPage = (id: string) => {
  push({
    name: "projectDetail",
    params: {
      id,
    },
  })
}
</script>

<template>
  <div
    role="project-track"
    class="touch-none grid xl:grid-cols-[.4fr_1fr_.4fr] grid-cols-[0_1fr_0] h-full gap-[2rem] items-center overflow-hidden perspective-distant xl:py-[2%] sm:px-[8%] sm:py-[3%]"
    ref="targetRef"
  >
    <div
      role="card-wrapper"
      class="2xl:h-130 xl:h-110 lg:h-140"
      v-for="(item, idx) in renderItems"
      :key="item.id"
      :class="clsx(idx === 0 && 'pre-card', idx === 1 && 'active-card', idx === 2 && 'next-card')"
      :data-draggable="idx === 1 ? '' : null"
    >
      <ProjectCard :project="item" @click="jumpTo(idx)" :click-detail="() => toDetailPage(item.projectId)" />
    </div>
  </div>
</template>

<style lang="less" scoped>
@keyframes card-breathe {
  0% {
    box-shadow: 0 12px 28px color-mix(in srgb, #000 35%, transparent), 0 0 0 color-mix(in srgb, var(--color-primary) 0%, transparent);
  }

  50% {
    box-shadow: 0 16px 36px color-mix(in srgb, #000 45%, transparent), 0 0 28px color-mix(in srgb, var(--color-primary) 28%, transparent);
  }

  100% {
    box-shadow: 0 12px 28px color-mix(in srgb, #000 35%, transparent), 0 0 0 color-mix(in srgb, var(--color-primary) 0%, transparent);
  }
}

@keyframes halo-breathe {
  0% {
    opacity: 0.18;
  }

  50% {
    opacity: 0.55;
  }

  100% {
    opacity: 0.18;
  }
}

[role="project-track"] {
  :root {
    --p: 0;
    --dir: 1;
  }

  [role="card-wrapper"] {
    transition: transform 0.5s ease, filter 0.5s ease, opacity 0.5s ease;

    &.pre-card {
      overflow: hidden;
      transform: translateX(-42%) rotateY(calc(-10deg - var(--p) * 6deg)) scale(calc(0.92 - var(--p) * 0.04));
      filter: blur(1.5px);
      opacity: 0.55;
    }

    &.active-card {
      transform: translateX(calc(var(--p) * 40%)) scale(calc(1 + var(--p) * 0.04));
      filter: none;
      opacity: 1;

      [role="project-card"] {
        animation: card-breathe 4.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;

        &::after {
          content: "";
          position: absolute;
          inset: -14px;
          border-radius: inherit;
          pointer-events: none;
          background: radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--color-primary) 22%, transparent), transparent 65%);
          filter: blur(18px);
          opacity: 0.22;
          animation: halo-breathe 5s ease infinite;
        }
      }
    }

    &.next-card {
      transform: translateX(42%) rotateY(calc(10deg + var(--p) * 6deg)) scale(calc(0.92 - var(--p) * 0.04));
      filter: blur(1.5px);
      opacity: 0.55;
      overflow: hidden;
    }
  }
}
</style>
