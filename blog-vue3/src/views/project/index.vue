<script lang="ts" setup>
import PageLoader from "@/components/PageLoader/index.vue"
import { useLanguageStore } from "@/store"
import { loopIndex } from "@/utils"
import clsx from "clsx"
import { storeToRefs } from "pinia"
import { computed, ref, watch } from "vue"
import { useRoute } from "vue-router"
import ProjectCard from "./components/ProjectCard.vue"
import { initializer } from "./initializer"
import { useProjectStore } from "./store"
const enum EProject {
  limit = 10,
}
const { query } = useRoute()
const routeInfo = computed(() => {
  const { page = 1, limit = EProject.limit } = query
  return {
    page: Number(page),
    limit: Number(limit),
  }
})

const {
  projectListStore: { projects },
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

const renderItems = computed(() => {
  const list = projectWithTranslateContent.value
  const len = list.length
  if (len === 0) return []
  const cur = activeIndex.value
  return [list[loopIndex(cur - 1, len)], list[loopIndex(cur, len)], list[loopIndex(cur + 1, len)]]
})

watch(
  renderItems.value,
  () => {
    console.log(renderItems.value)
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <PageLoader :use-store="useProjectStore" :initializer="initializer" :payload="routeInfo">
    <div role="project-track" class="grid grid-cols-[1fr_1fr_1fr] h-full gap-[4rem] items-center overflow-x-hidden perspective-distant px-[8%] py-[5%]">
      <ProjectCard :project="item" v-for="(item, idx) in renderItems" :key="item.id" :class="clsx(idx === 0 && 'pre-card', idx === 1 && 'active-card', idx === 2 && 'next-card')" />
    </div>
  </PageLoader>
</template>

<style lang="less" scoped></style>
