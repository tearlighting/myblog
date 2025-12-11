<script setup lang="ts">
import { clsx } from "clsx"
import { computed } from "vue"

interface IProps {
  title?: string
  size?: "sm" | "md" | "lg"
  class?: string
}
const props = defineProps<IProps>()

const sizes = {
  sm: "w-7 h-7",
  md: " sm:w-9 sm:h-9 w-7 h-7",
  lg: "w-11 h-11",
}

const sizeClass = computed(() => sizes[props.size ?? "md"])
</script>

<template>
  <button type="button" class="controller-container flex items-center justify-center rounded-md cursor-pointer transition-all" :class="clsx(sizeClass, props.class)" :title="props.title">
    <slot></slot>
  </button>
</template>
<style lang="less" scoped>
@import "@/core/index.less";

.controller-container {
  padding: 0.35rem 0.55rem;

  /* 基础态：半透明 + 轻边框 */
  .glass-base(var(--surface-0),70%,unset);

  border: 1px solid color-mix(in srgb, var(--divider) 50%, transparent);
  color: var(--color-text);
  opacity: 0.9;

  /* Hover：稍微亮一点 + 光感 */
  &:hover {
    .glass-base(var(--surface-2),55%,unset);
    border-color: color-mix(in srgb, var(--color-primary) 40%, var(--divider) 60%);
    opacity: 1;
  }

  /* Active：缩小一点，不要变纯色 */
  &:active {
    transform: scale(0.96);
    background: color-mix(in srgb, var(--surface-2) 70%, transparent);
  }

  /* Focus：轻光圈 */
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 60%, transparent);
  }
}
</style>
