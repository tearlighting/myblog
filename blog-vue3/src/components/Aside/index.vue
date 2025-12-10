<script setup lang="ts">
import { EDeviceType } from "@/constants"
import { useMenu } from "@/hooks/useMenu"
import { useAppStore, useMenuStore, useRouteStore } from "@/store"
import { ElDrawer, ElMenu, type MenuInstance } from "element-plus"
import { storeToRefs } from "pinia"
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import MenuItem from "./MenuItem.vue"

const { displayRoutes, currentRoute } = storeToRefs(useRouteStore())
const { push } = useRouter()
const { isCollapse, isHidden } = storeToRefs(useMenuStore())

const { deviceType } = storeToRefs(useAppStore())
const { toggleMenu } = useMenu()

const menuRef = ref<MenuInstance>()
onMounted(() => {
  currentRoute.value.name && menuRef.value?.updateActiveIndex(currentRoute.value.name)
})
</script>

<template>
  <div class="h-full transition-all duration-300" role="side-menu">
    <el-menu
      v-if="deviceType === EDeviceType.DESKTOP"
      ref="menuRef"
      class="h-full bg-bg! md:w-60 border-r-border!"
      :collapse="isCollapse"
      :hidden="isHidden"
      @select="(name) => push({ name })"
      :default-active="currentRoute.name!"
    >
      <template v-for="item in displayRoutes">
        <menu-item :routeItem="<any>item" />
      </template>
    </el-menu>
    <el-drawer v-else :close-delay="150" :with-header="false" :model-value="!isHidden" :before-close="toggleMenu" direction="ltr" class="mobile-menu" size="240">
      <el-menu ref="menuRef" class="h-full bg-bg! w-60 border-r-border!" :collapse="isCollapse" :hidden="isHidden" @select="(name) => push({ name })" :default-active="currentRoute.name!">
        <template v-for="item in displayRoutes">
          <menu-item :routeItem="<any>item" />
        </template>
      </el-menu>
    </el-drawer>
  </div>
</template>

<style lang="less" scoped>
[role="side-menu"] .menu-item--active {
  background: color-mix(in srgb, var(--color-primary) 14%, var(--surface-1));
  color: var(--text);
  backdrop-filter: blur(6px);
  border-left: 3px solid var(--color-primary);
}
</style>
