<script setup lang="ts">
import FullScreenSwitch from "./FullScreenSwitch.vue"
import LocaleSwitch from "./LocaleSwitch.vue"
import MenuSwitch from "./MenuSwitch.vue"
import MenuTitle from "./MenuTitle.vue"
import ThemeSwitch from "./ThemeSwitch.vue"
import UserAvatar from "./UserAvatar.vue"
</script>

<template>
  <div class="flex items-center justify-between w-full relative border-b-1 h-12 px-4 opacity-85 text-text" role="nav-bar">
    <MenuSwitch />
    <MenuTitle class="absolute left-1/2 -translate-x-1/2" />
    <div class="flex items-center md:gap-2">
      <LocaleSwitch />
      <ThemeSwitch />
      <FullScreenSwitch />
      <user-avatar />
    </div>
  </div>
</template>

<style lang="less" scoped>
@import "@/core/index.less";

[role="nav-bar"] {
  /* 背景：用 surface-2 做基底，稍微透明一点 */
  .glass-base(var(--surface-2),70%,14);
  /* 下边线：用 divider 柔一下，而不是直接 border-b-border 那种生硬的粉/灰线 */
  border-bottom-color: color-mix(in srgb, var(--divider, var(--color-border)) 75%, transparent);

  /* 轻一点的阴影，带一点主色，让深浅主题都不死板 */
  box-shadow: 0 1px 0 color-mix(in srgb, var(--divider, #000) 40%, transparent), 0 6px 16px -10px color-mix(in srgb, var(--color-primary, var(--color-border)) 35%, transparent);

  z-index: 10;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: 32px;
    pointer-events: none;
    z-index: 6;
  }

  &::before {
    left: 0;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.06), transparent);
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, rgba(0, 0, 0, 0.06), transparent);
  }
}
</style>
