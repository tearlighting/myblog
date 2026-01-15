<script setup lang="ts">
import PageLoader from "@/components/PageLoader/index.vue"
import { useAboutMeStore } from "./store"
import Viewer from "./Viewer.vue"

defineOptions({
  name: "AboutMe",
})
</script>

<template>
  <PageLoader :use-store="useAboutMeStore" :initializer="() => ({})">
    <Viewer />
  </PageLoader>
</template>

<style lang="less" scoped></style>
