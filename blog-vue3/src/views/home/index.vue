<script setup lang="ts">
import PageLoader from "@/components/PageLoader/index.vue"
import { Button } from "@/components/UI"
import { usePageHostStore } from "@/store"
import Lenis from "lenis"
import LumiSection from "./components/LumiSection.vue"
import { LumiSceneController } from "./core"
import { initializer } from "./initializer"
import { useHomeStore } from "./store"

defineOptions({
  name: "test",
})
const { scrollBottom, scrollTop } = usePageHostStore()

const lenis = new Lenis()

const scene = new LumiSceneController(lenis)

function raf(time: number) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

const {
  bannerStore: { banners },
} = useHomeStore()
</script>

<template>
  <PageLoader :use-store="useHomeStore" :initializer="initializer">
    <div class="flex justify-center items-center fixed top-100 right-10">
      <Button @click="scrollTop">top</Button>
      <Button @click="scrollBottom">bottom</Button>
    </div>

    <div role="home-container" class="h-full">
      <!-- <template v-for="banner in banners" :key="banner.id">
        <BannerItem :banner="banner" :src="banner.bigImg" :title="banner.title" :description="banner.description" />
      </template> -->
      <LumiSection :slides="banners" />
    </div>
  </PageLoader>
</template>

<style lang="less" scoped></style>
