<script setup lang="ts">
import { useMounted } from "@/hooks/useMounted"
import { useTemplateRef } from "vue"
import { useInitLumiEffect } from "./logicHooks"

const scrollerWrapperRef = useTemplateRef("scrollerWrapper")
const scrollerContentRef = useTemplateRef("aboutMeContent")

useMounted(() => {
  if (!scrollerContentRef.value || !scrollerWrapperRef.value) return
  useInitLumiEffect({
    scrollerContent: scrollerContentRef.value,
    scrollerWrapper: scrollerWrapperRef.value,
  })
})
</script>

<template>
  <div class="text-white size-full overflow-hidden" role="about-me-container" ref="scrollerWrapper">
    <div role="about-me-content" class="size-full bg-card-bg" ref="aboutMeContent">about</div>
  </div>
</template>

<style lang="less" scoped></style>
