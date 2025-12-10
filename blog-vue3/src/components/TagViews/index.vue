<script setup lang="ts">
import SvgIcon from "@/components/SvgIcon/index.vue"
import { EIcons } from "@/constants"
import { useLanguage } from "@/hooks/useLanguage"
import { routes } from "@/router"
import { useTagViewStore } from "@/store"
import { getMeta } from "@/utils"
import { clsx } from "clsx"
import { storeToRefs } from "pinia"
import { useRouter } from "vue-router"
import Tag from "./Tag.vue"
const tagViewStore = useTagViewStore()
const { allTags } = storeToRefs(tagViewStore)
const { push } = useRouter()
const { getMenuTitle } = useLanguage()
</script>

<template>
  <div role="tag-views" class="w-full flex items-center justify-start gap-2 border-b-1">
    <Tag v-for="name of allTags" :key="name" class="my-1.5 group/tag tag-pill" :class="clsx(tagViewStore.isCurrent(name) && 'bg-primary!')" @click="() => push({ name })">
      {{ getMenuTitle({ meta: getMeta(routes, name) }) }}

      <template #footer>
        <SvgIcon :name="EIcons.Close" @click="() => tagViewStore.deleteTag(name)" />
      </template>
    </Tag>
  </div>
</template>

<style lang="less" scoped>
/* 整条 TagViews：变浅、变柔、变干净 */
[role="tag-views"] {
  position: relative;
  padding-inline: 0.75rem;

  /* 比 NavBar 浅一点 */
  background: color-mix(in srgb, var(--surface-1) 45%, transparent);
  backdrop-filter: blur(20px) saturate(140%);

  /* 上浅下深，保持层次 */
  border-top: 1px solid color-mix(in srgb, var(--surface-1) 30%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--divider) 55%, transparent);

  /* 柔和阴影，整条轻浮起来 */
  box-shadow: 0 6px 18px -12px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12);

  transition: background 220ms ease;
}

/* 左右渐隐遮罩，看起来像 Apple / VSCode 的 TabBar */
[role="tag-views"]::before,
[role="tag-views"]::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 32px;
  pointer-events: none;
  z-index: 6;
}

[role="tag-views"]::before {
  left: 0;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.05), transparent);
}

[role="tag-views"]::after {
  right: 0;
  background: linear-gradient(to left, rgba(0, 0, 0, 0.05), transparent);
}

[role="tag-views"] :deep([role="tag-container"]) {
  /* 背景：柔和磨砂玻璃 */
  background: color-mix(in srgb, var(--surface-1) 45%, transparent);
  backdrop-filter: blur(14px) saturate(160%);
  -webkit-backdrop-filter: blur(14px) saturate(160%);

  /* 边框：更细、更亮 —— 玻璃感来源之一 */
  border: 1px solid color-mix(in srgb, var(--divider) 55%, transparent);

  /* 字体：略柔，不要太硬 */
  color: var(--color-muted);

  /* 阴影：立体 + 柔光 */
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.25), 0 4px 12px -4px rgba(0, 0, 0, 0.45);

  transition: background 180ms ease, border-color 180ms ease, box-shadow 180ms ease, transform 120ms ease, color 140ms ease;
}

/* hover：稍微亮一点，增强玻璃反射 */
[role="tag-views"] :deep([role="tag-container"]:hover) {
  background: color-mix(in srgb, var(--surface-1) 70%, transparent);
  border-color: color-mix(in srgb, var(--color-primary) 35%, var(--divider));
  box-shadow: inset 0 1px 3px rgba(255, 255, 255, 0.35), 0 8px 20px -8px rgba(0, 0, 0, 0.55);
  transform: translateY(-1px);
  color: var(--color-text);
}

/* 激活状态（你的 v-bind class 已经会加 bg-primary，但我们进一步美化） */
[role="tag-views"] :deep([role="tag-container"].bg-primary\!) {
  background: linear-gradient(145deg, color-mix(in srgb, var(--color-primary) 55%, transparent), color-mix(in srgb, var(--surface-1) 65%, transparent));

  border-color: color-mix(in srgb, var(--color-primary) 75%, var(--divider));

  /* 关键：玻璃的体积感来自内阴影 + 外柔光 */
  box-shadow: inset 0 1px 5px rgba(255, 255, 255, 0.45), inset 0 -1px 4px rgba(255, 255, 255, 0.15), 0 12px 28px -10px rgba(0, 0, 0, 0.55);

  color: var(--color-text);
}

// /* 激活状态 hover（比普通 tag 更亮一些） */
// [role="tag-views"] :deep([role="tag-container"].bg-primary\!:hover) {
//   background: color-mix(in srgb, var(--color-primary) 35%, var(--surface-2));
//   transform: translateY(-1px);
// }
</style>
