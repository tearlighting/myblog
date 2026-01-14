<script setup lang="ts">
import LumiSection from "./components/LumiSection.vue"
import { useHomeStore } from "./store"

const {
  bannerStore: { banners },
} = useHomeStore()
console.log(banners)
</script>

<template>
  <div role="home-container" class="h-full">
    <LumiSection :slides="banners" />
  </div>
</template>

<style lang="less" scoped></style>
