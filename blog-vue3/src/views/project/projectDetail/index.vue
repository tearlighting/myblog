<script lang="ts" setup>
import PageLoader from "@/components/PageLoader/index.vue"
import { useRoute } from "vue-router"
import { initializer } from "./initializer"
import { useProjectDetailStore } from "./store"
import Viewer from "./Viewer.vue"

defineOptions({
  name: "projectDetail",
})

const { params } = useRoute()
const id = params.id
</script>

<template>
  <PageLoader :payload="{ id }" :initializer="initializer" :use-store="useProjectDetailStore">
    <Viewer />
  </PageLoader>
</template>

<style lang="less" scoped></style>
