<script setup lang="ts">
import SvgIcon from "@/components/SvgIcon/index.vue"
import { EIcons } from "@/constants"
import { useMenuStore } from "@/store"
import { clsx } from "clsx"
import { storeToRefs } from "pinia"
const menuStore = useMenuStore()
const { isCollapse, isHidden } = storeToRefs(menuStore)

const title = "My Admin"
const subtitle = "dashboard"
</script>

<template>
  <div role="app-logo" class="relative cursor-pointer overflow-hidden h-14" :class="clsx(isCollapse ? 'px-[12px]' : 'px-4', isHidden && 'w-0 px-0!')">
    <div role="app-logo-inner" class="flex items-center h-full gap-x-3" :class="clsx(isCollapse && 'justify-center')">
      <!-- 左边图标 -->
      <div role="app-logo-icon" class="inline-flex items-center justify-center w-[28px] h-[28px] rounded-[9px]">
        <!-- 这里随便用你喜欢的 logo 图标 -->
        <SvgIcon :name="EIcons.Home" class="text-primary text-[18px]" />
      </div>

      <!-- 标题，跟着折叠状态做动画 -->
      <transition name="app-logo-title">
        <div role="app-logo-text" v-if="!isCollapse" class="flex flex-col justify-center leading-[1.1] app-logo__text">
          <div class="text-[16px] font-[600] text-text tracking-[0.04em]">{{ title }}</div>
          <div class="app-logo__subtitle mt-[2px] text-[11px] opacity-[0.72]">{{ subtitle }}</div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped lang="less">
[role="app-logo"] {
  /* 跟侧边栏统一的深色 + 玻璃感 */
  background: linear-gradient(135deg, color-mix(in srgb, var(--surface-0) 88%, transparent), color-mix(in srgb, var(--surface-1) 82%, transparent));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid color-mix(in srgb, var(--surface-2) 35%, transparent);
  box-shadow: 0 12px 30px -18px rgba(0, 0, 0, 0.7), inset 0 1px 0 color-mix(in srgb, var(--surface-3) 28%, transparent);
  transition: padding 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease;

  /* icon */
  [role="app-logo-icon"] {
    background: radial-gradient(circle at 0% 0%, color-mix(in srgb, var(--color-primary) 38%, transparent), transparent 65%);
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-primary) 22%, transparent), 0 8px 18px -8px color-mix(in srgb, var(--color-primary) 70%, transparent);
  }
  [role="app-logo-text"] {
    .app-logo__subtitle {
      color: color-mix(in srgb, var(--color-text) 70%, transparent);
    }
  }

  /* 标题进出动画，配合侧边栏宽度的 transition，看起来比较顺 */
  .app-logo-title-enter-active,
  .app-logo-title-leave-active {
    transition: opacity 0.22s ease, transform 0.22s ease;
  }

  .app-logo-title-enter-from,
  .app-logo-title-leave-to {
    opacity: 0;
    transform: translateX(-8px);
  }
}
</style>
