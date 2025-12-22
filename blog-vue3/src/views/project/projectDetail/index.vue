<script lang="ts" setup>
import Article from "@/components/Article/index.vue"
import PageLoader from "@/components/PageLoader/index.vue"
import Toc from "@/components/Toc/Toc.vue"
import { useRoute } from "vue-router"
import { initializer } from "./initializer"
import { useInitScroller, useInitToc, useTranslatedProject } from "./logicHooks"
import { useProjectDetailStore } from "./store"

const { params } = useRoute()
const id = params.id
const { translatedProjectItem } = useTranslatedProject()
const { tocElMap } = useInitToc({
  translatedProjectItem,
})
const { scrollerRef, scrollerContentRef, lensInsRef, activeAnchor } = useInitScroller({
  translatedProjectItem,
  tocElMap,
})

const toAnchor = (anchor: string) => {
  const scroller = scrollerRef.value
  if (!scroller || !lensInsRef.current) return
  const el = tocElMap.get(anchor)
  if (!el) return
  // el 相对于 scroller 内容顶部的距离
  const targetTop = el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop
  lensInsRef.current.scrollTo(targetTop, {
    duration: 0.8,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  }) // Lenis duration 通常是秒
}
</script>

<template>
  <PageLoader :payload="{ id }" :initializer="initializer" :use-store="useProjectDetailStore">
    <div role="project-detail" class="size-full grid grid-cols-[1fr_200px] overflow-y-auto" ref="scrollerRef">
      <main ref="scrollerContentRef">
        <Article :article="translatedProjectItem?.htmlContent"></Article>
      </main>
      <nav role="project-toc" class="w-full h-fit sticky top-[16px] px-[8px] py-[12px] text-sm text-muted">
        <Toc :items="translatedProjectItem?.toc" :to-anchor="toAnchor" :active-anchor="activeAnchor"></Toc>
      </nav>
    </div>
  </PageLoader>
</template>

<style lang="less" scoped>
@import "@/core/index.less";
[role="project-detail"] {
  .theme-scroller();
  [role="project-toc"] {
    background: color-mix(in srgb, var(--surface-1) 72%, transparent);
    border: 1px solid color-mix(in srgb, var(--divider) 65%, transparent);
    border-radius: 14px;
    box-shadow: var(--elevation-1);
    backdrop-filter: blur(10px);
  }
}
</style>
