<script setup lang="ts">
import SvgIcon from "@/components/SvgIcon/index.vue"
import { EIcons } from "@/constants/icons"
import { useAppStore } from "@/store/app"
import ControllerContainer from "./ControllerContainer.vue"

const appStore = useAppStore()
const {
  settings: { showThemeSwitch },
} = appStore

interface IProps {
  svgClass?: string
}

defineProps<IProps>()
</script>

<template>
  <ControllerContainer>
    <SvgIcon v-if="showThemeSwitch" :name="EIcons.User" :class="svgClass"></SvgIcon>
  </ControllerContainer>
</template>

<style lang="less" scoped></style>
