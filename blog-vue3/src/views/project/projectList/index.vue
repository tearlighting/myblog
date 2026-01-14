<script lang="ts" setup>
import PageLoader from "@/components/PageLoader/index.vue"
import { computed } from "vue"
import { useRoute } from "vue-router"
import { initializer } from "./initializer"
import { useProjectStore } from "./store"
import Viewer from "./Viewer.vue"

defineOptions({
  name: "project",
})

const enum EProject {
  limit = 100,
}
const { query } = useRoute()
const routeInfo = computed(() => {
  const { page = 1, limit = EProject.limit } = query
  return {
    page: Number(page),
    limit: Number(limit),
  }
})
</script>

<template>
  <PageLoader :use-store="useProjectStore" :initializer="initializer" :payload="routeInfo" ref="targetRef">
    <Viewer />
  </PageLoader>
</template>

<style lang="less" scoped></style>
