<script setup lang="ts">
import PageLoader from "@/components/PageLoader/index.vue"
import { Button } from "@/components/UI"
import { usePageHostStore } from "@/store"
import { initializer } from "./initializer"
import { useHomeStore } from "./store"

defineOptions({
  name: "test",
})
const { scrollBottom, scrollTop } = usePageHostStore()
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

    <!-- <div role="home-container" class="h-[200vh] bg-amber-200">
      <template v-for="banner in banners" :key="banner.id">
        <BannerItem :banner="banner" :src="banner.bigImg" :title="banner.title" :description="banner.description" />
      </template>
    </div> -->
  </PageLoader>
</template>

<style lang="less" scoped></style>
