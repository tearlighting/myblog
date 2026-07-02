<script setup lang="ts">
import PageLoader from "@/components/PageLoader/index.vue"
// import AboutExperience from "./AboutExperience.vue"
import DemoNew from "./DemoNew.vue"
import { useAboutMeStore } from "./store"
defineOptions({
  name: "AboutMe",
})
</script>

<template>
  <PageLoader :use-store="useAboutMeStore" :initializer="() => ({})">
    <DemoNew />
  </PageLoader>
</template>

<style lang="less" scoped></style>
