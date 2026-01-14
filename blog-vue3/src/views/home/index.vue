<script setup lang="ts">
import PageLoader from "@/components/PageLoader/index.vue"
import Viewer from "./Viewer.vue"
import { initializer } from "./initializer"
import { useHomeStore } from "./store"

defineOptions({
  name: "test",
})
</script>

<template>
  <PageLoader :use-store="useHomeStore" :initializer="initializer">
    <Viewer />
  </PageLoader>
</template>

<style lang="less" scoped></style>
