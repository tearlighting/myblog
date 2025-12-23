<script setup lang="ts">
import type { IArticleItem, IArticleTranslation } from "article"

const props = defineProps<{
  item: IArticleItem & IArticleTranslation
}>()
</script>

<template>
  <div role="article-item-wrapper">
    <a role="row-inner" class="relative flex flex-col gap-[6px] px-[12px] py-[14px] rounded-[10px] no-underline">
      <div role="row-main">
        <h3 role="title" class="text-[1rem] font-medium text-text leading-[1.4]">
          {{ item?.title }}
        </h3>
        <p role="desc" class="text-[0.85rem] mt-[2px] text-muted leading-1.5">
          {{ item?.description }}
        </p>
      </div>

      <div role="row-meta" class="flex gap-[12px] text-[0.75rem] text-muted">
        <span class="category">
          {{ item.category.name }}
        </span>
        <span class="scan"> 👁 {{ item.scanNumber }} </span>
      </div>
    </a>
  </div>
</template>

<style lang="less" scoped>
/* 左侧阅读指示线 */
.read-line() {
  content: "";
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 12px;
  width: 2px;
  background: color-mix(in srgb, var(--divider) 60%, transparent);
  opacity: 0;
  transition: opacity 0.25s ease, background 0.25s ease;
  border-radius: 2px;
}

[role="article-item-wrapper"] {
  [role="row-inner"] {
    transition: background 0.25s ease;
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 12px;
      bottom: 12px;
      width: 2px;
      background: color-mix(in srgb, var(--divider) 60%, transparent);
      opacity: 0;
      transition: opacity 0.25s ease, background 0.25s ease;
      border-radius: 2px;
    }

    &:hover {
      background: color-mix(in srgb, var(--color-primary) 6%, transparent);

      &::before {
        opacity: 1;
        background: color-mix(in srgb, var(--color-primary) 80%, transparent);
      }
    }
  }
  /* 左侧阅读指示线 */
}
</style>
