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
    <div role="page-host" class="size-full overflow-auto relative p-6 min-h-0" ref="hostRef">
      <RouterView #="{ Component }">
        <KeepAlive :include="allCachedTags">
          <transition name="page" mode="out-in">
            <component :is="Component" :key="currentRoute.name" />
          </transition>
        </KeepAlive>
      </RouterView>
    </div>
  </PanelContainer>
</template>

<style lang="less" scoped>
[role="page-host"] {
  background-color: color-mix(in srgb, var(--surface-0) 95%, var(--surface-1));
}
</style>
