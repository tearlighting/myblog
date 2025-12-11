<script setup lang="ts">
import SvgIcon from "@/components/SvgIcon/index.vue"
import { EDeviceType, EIcons } from "@/constants"
import { useLanguage } from "@/hooks/useLanguage"
import { useMenu } from "@/hooks/useMenu"
import { useAppStore, useMenuStore, useRouteStore } from "@/store"
import clsx from "clsx"
import { NDrawer, NIcon, NMenu, type MenuOption } from "naive-ui"
import { storeToRefs } from "pinia"
import type { AppRoute } from "router"
import { computed, h } from "vue"
import { useRouter } from "vue-router"
import AppLogo from "./AppLogo.vue"

const { displayRoutes, currentRoute } = storeToRefs(useRouteStore())
const { isCollapse, isHidden, expandedKeys } = storeToRefs(useMenuStore())
const { deviceType } = storeToRefs(useAppStore())
const { toggleMenu } = useMenu()
const { push } = useRouter()
const { getMenuTitle } = useLanguage()

function routeToOption(route: AppRoute): MenuOption {
  const children = route.children?.length ? route.children.map(routeToOption) : undefined
  return {
    key: String(route.name),
    label: getMenuTitle(route),
    icon: route.meta?.icon
      ? () =>
          h(NIcon, null, {
            default: () => h(SvgIcon, { name: route.meta.icon! }),
          })
      : undefined,
    children,
    extra: route.meta.externalLink
      ? () =>
          h(NIcon, null, {
            default: () => h(SvgIcon, { name: EIcons.ExternalLink, class: "external-link-item" }),
          })
      : undefined,
  }
}

const menuOptions = computed(() => displayRoutes.value.map(routeToOption))

// 当前选中
const activeKey = computed(() => String(currentRoute.value?.name))

function onSelect(key: string) {
  push({ name: key })
}

function onExpanded(keys: string[]) {
  expandedKeys.value = keys
}
</script>

<template>
  <div
    class="h-full transition-all duration-300"
    role="side-menu"
    :class="clsx(deviceType === EDeviceType.DESKTOP ? (isCollapse ? 'w-[56px]' : 'w-60') : '', isHidden && 'side-menu--hidden', isCollapse && 'side-menu--collapsed')"
  >
    <div v-if="deviceType === EDeviceType.DESKTOP" class="flex flex-col">
      <AppLogo />
      <!-- 桌面菜单 -->
      <n-menu
        :options="menuOptions"
        :value="activeKey"
        :expanded-keys="expandedKeys"
        :collapsed="isCollapse"
        @update:value="onSelect"
        @update:expanded-keys="onExpanded"
        class="h-full bg-bg w-full border-r-border"
      />
    </div>

    <!-- 移动端 Drawer 菜单 -->
    <n-drawer v-else :show="!isHidden" width="240" placement="left" :on-update:show="toggleMenu">
      <div class="flex flex-col">
        <AppLogo />
        <n-menu :options="menuOptions" :value="activeKey" :expanded-keys="expandedKeys" @update:value="onSelect" @update:expanded-keys="onExpanded" class="flex-1 bg-bg w-full" />
      </div>
    </n-drawer>
  </div>
</template>
<style scoped lang="less">
@import "@/core/index.less";
[role="side-menu"] {
  .glass-base(var(--surface-0),80%,16);
  border-right: 1px solid color-mix(in srgb, var(--color-border) 60%, transparent);
  box-shadow: 4px 0 24px -8px rgba(15, 23, 42, 0.25);
  &.side-menu--hidden {
    border-right: 0px;
  }
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
    background: linear-gradient(to right, rgba(0, 0, 0, 0.02), transparent);
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, rgba(0, 0, 0, 0.02), transparent);
  }
  &.side-menu--collapsed {
    :deep(.n-menu-item-content__icon) {
      transform: translateX(3.5px);
    }
  }
}
/**路由左侧的竖线 */
.active-bar() {
  &::after {
    content: "";
    position: absolute;
    left: 2px;
    top: 6px;
    bottom: 6px;
    width: 3px;
    border-radius: 2px;
    background-color: var(--color-primary);
    left: -1px; /* 放到 item 外一点点，超级好看 */
  }
}

/* Naive 菜单透明化，让背景透出来 */
:deep(.n-menu) {
  background-color: transparent !important;
  .n-menu-item {
    background-color: transparent !important;
    overflow: visible; /* 必需：允许 ::after 放到外侧 */
    .n-menu-item-content {
      color: var(--color-text) !important;
      &::before {
        border-radius: 8px; // 跟 hover / active 用同一个圆角，避免跳动
        background-color: transparent;
        box-shadow: none;
        transition: background-color 150ms ease, box-shadow 180ms ease, transform 120ms ease;
      }

      &:hover {
        color: color-mix(in srgb, var(--color-primary) 50%, var(--color-text)) !important;
        &::before {
          /* hover：淡淡蓝光玻璃 */
          inset: 2px 8px;
          border-radius: 6px;
          // background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
          .glass-base(var(--color-primary), 10%);
          transition: all 0.3s ease;
        }
      }
      /* active：主色玻璃块 */
      &.n-menu-item-content--selected {
        &::before {
          .glass-base(var(--color-primary), 16%);
          border-radius: 6px;
          box-shadow: inset 0 0 8px color-mix(in srgb, var(--color-primary) 40%, transparent);
        }
        .active-bar();
        &:hover {
          color: var(--color-primary) !important;
          &::before {
            inset: 2px 8px; /* 关键：缩小区域 */
            .glass-base(var(--color-primary), 25%);
            box-shadow: inset 0 0 8px color-mix(in srgb, var(--color-primary) 50%, transparent);
          }
        }
      }
      .n-menu-item-content-header,
      .n-menu-item-content__icon,
      .n-menu-item-content__arrow {
        color: inherit !important;
      }
      &.n-menu-item-content--child-active.n-menu-item-content--collapsed {
        &::before {
          .glass-base(var(--color-primary), 16%);
          border-radius: 6px;
          box-shadow: inset 0 0 8px color-mix(in srgb, var(--color-primary) 40%, transparent);
        }
        .active-bar();
      }

      .n-menu-item-content-header__extra:has(.external-link-item) {
        display: flex;
        align-items: center;
        position: absolute;
        right: 0;
        transform: translateX(-150%) translateY(-150%);
        color: inherit;
      }
    }
  }
}
</style>
