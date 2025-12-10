<script setup lang="ts">
// import Aside from "@/components/Aside/index.vue"
import NavieMenu from "@/components/Aside/NavieMenu.vue"
import NavBar from "@/components/NavBar/index.vue"
import PanelContainer from "@/components/PanelContainer/index.vue"
import TagViews from "@/components/TagViews/index.vue"
import { useRouteStore, useTagViewStore } from "@/store"
import { usePageHostStore } from "@/store/pageHost"
import { storeToRefs } from "pinia"
import { watchEffect } from "vue"

const { currentRoute } = useRouteStore()
const { hostRef } = storeToRefs(usePageHostStore())
const { allCachedTags } = storeToRefs(useTagViewStore())
watchEffect(() => {
  console.log(currentRoute.name, currentRoute.meta!.keepAlive, allCachedTags.value)
})
</script>

<template>
  <PanelContainer class="layout">
    <template v-slot:left>
      <!-- <Aside></Aside> -->
      <NavieMenu />
    </template>
    <template v-slot:centerLine1>
      <NavBar></NavBar>
    </template>
    <template v-slot:centerLine2>
      <TagViews></TagViews>
    </template>
    <div role="page-host " class="size-full overflow-auto relative" ref="hostRef">
      <RouterView #="{ Component }">
        <KeepAlive :include="allCachedTags">
          <component :is="Component" :key="currentRoute.name" />
        </KeepAlive>
      </RouterView>
    </div>
  </PanelContainer>
</template>

<style lang="less" scoped>
.layout {
  [data-section="layout-root"] {
    display: flex;
    height: 100vh;
    background: linear-gradient(180deg, var(--surface-0) 0%, color-mix(in srgb, var(--surface-0) 90%, var(--surface-1)) 100%);
    color: var(--color-text);
  }

  /* 左侧栏 */
  [data-section="left"] {
    border-right: 1px solid var(--divider);
    box-shadow: var(--elevation-2);
    background: color-mix(in srgb, var(--surface-0) 90%, var(--surface-2));
    backdrop-filter: blur(4px);
  }

  /* 右侧栏 */
  [data-section="right"] {
    background: var(--surface-2);
    border-left: 1px solid var(--divider);
    box-shadow: var(--elevation-2);
  }

  /* 顶部导航行（Center Line 1） */
  [data-section="center-line1"] {
    background: color-mix(in srgb, var(--surface-1) 55%, transparent);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--divider);
    box-shadow: var(--elevation-1);
    z-index: 10;
  }

  /* TagView 区域（Center Line 2） */
  [data-section="center-line2"] {
    background: var(--surface-1);
    border-bottom: 1px solid var(--divider);
    box-shadow: var(--elevation-1);
    z-index: 5;
  }

  /* 第三行：按需使用，默认透明 */
  [data-section="center-line3"] {
    background: transparent;
  }

  /* 主内容区 */
  [data-section="center-main"] {
    flex: 1;
    overflow: auto;
    padding: 1rem;
    background: color-mix(in srgb, var(--surface-0) 95%, var(--surface-1));
  }
}
</style>
