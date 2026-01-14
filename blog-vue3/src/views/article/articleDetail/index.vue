<script setup lang="ts">
import PageLoader from "@/components/PageLoader/index.vue"
import { computed } from "vue"
import { useRoute } from "vue-router"
import { initializer } from "./initializer"
import { useArticleDetailStore } from "./store"
import Viewer from "./Viewer.vue"
defineOptions({
  name: "articleDetail",
})

const routeInfo = computed(() => {
  const { params } = useRoute()
  return {
    id: params.id,
  }
})
</script>

<template>
  <PageLoader :use-store="useArticleDetailStore" :initializer="initializer" :payload="routeInfo">
    <Viewer></Viewer>
  </PageLoader>
</template>

<style lang="less" scoped></style>
