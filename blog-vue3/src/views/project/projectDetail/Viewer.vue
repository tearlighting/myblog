<script lang="ts" setup>
import Article from "@/components/Article/index.vue"
import SvgIcon from "@/components/SvgIcon/index.vue"
import Toc from "@/components/Toc/Toc.vue"
import { EDeviceType, EIcons } from "@/constants"
import { useAppStore } from "@/store"
import { NDrawer } from "naive-ui"
import { storeToRefs } from "pinia"
import { ref } from "vue"
import { useInitScroller, useInitToc, useTranslatedProject } from "./logicHooks"

const { translatedProjectItem } = useTranslatedProject()

const { tocElMap, TOC_OFFSET_TOP } = useInitToc({
  translatedProjectItem,
})
const toAnchorProcessing = {
  current: false,
}

const { scrollerRef, scrollerContentRef, lensInsRef, activeAnchor, updateActive } = useInitScroller({
  translatedProjectItem,
  tocElMap,
  tocOffsetTop: TOC_OFFSET_TOP,
  toAnchorProcessing,
})

const toAnchor = (anchor: string) => {
  const scroller = scrollerRef.value
  if (!scroller || !lensInsRef.current) return
  const el = tocElMap.get(anchor)
  if (!el) return

  // el 相对于 scroller 内容顶部的距离
  const targetTop = el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop
  toAnchorProcessing.current = true
  lensInsRef.current.scrollTo(targetTop, {
    duration: 0.8,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    onComplete: () => {
      requestAnimationFrame(() => {
        toAnchorProcessing.current = false
        updateActive()
      })
    },
  })
  tocDrawerShow.value = false
}

const { deviceType } = storeToRefs(useAppStore())
const tocDrawerShow = ref(false)
</script>

<template>
  <div role="project-detail" class="relative size-full grid lg:grid-cols-[1fr_200px] grid-cols-[1fr_0] overflow-y-auto" ref="scrollerRef">
    <main ref="scrollerContentRef" class="w-full min-w-0">
      <Article :article="translatedProjectItem?.htmlContent"></Article>
    </main>
    <nav
      role="project-toc"
      class="lg:w-full h-fit sticky lg:px-[8px] lg:py-[12px] text-sm text-muted w-fit p-[6px] lg:translate-x-0 -translate-x-[150%]"
      :style="{ top: TOC_OFFSET_TOP + 'px' }"
      ref="testRef"
    >
      <Toc v-if="deviceType === EDeviceType.DESKTOP" :items="translatedProjectItem?.toc" :to-anchor="toAnchor" :active-anchor="activeAnchor"></Toc>
      <template v-else>
        <SvgIcon :name="EIcons.MenuOpen" @click="tocDrawerShow = true"></SvgIcon>
        <n-drawer placement="right" :show="tocDrawerShow" :width="200" :on-update:show="(e) => (tocDrawerShow = e)">
          <Toc :items="translatedProjectItem?.toc" :to-anchor="toAnchor" :active-anchor="activeAnchor"></Toc>
        </n-drawer>
      </template>
    </nav>
  </div>
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
