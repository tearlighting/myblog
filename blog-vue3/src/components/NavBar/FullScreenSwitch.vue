<script setup lang="ts">
import SvgIcon from "@/components/SvgIcon/index.vue"
import { EIcons } from "@/constants/icons"
import { useFullScreen } from "@/hooks/useFullScreel"
import { useAppStore } from "@/store/app"
import ControllerContainer from "./ControllerContainer.vue"

interface IProps {
  svgClass?: string
}

defineProps<IProps>()
const { settings } = useAppStore()
const { fullScreen } = useFullScreen()
</script>

<template>
  <ControllerContainer v-if="settings.showFullScreenSwitch">
    <SvgIcon :name="EIcons.Fullscreen" :class="svgClass" @click="fullScreen"></SvgIcon>
  </ControllerContainer>
</template>

<style lang="less" scoped></style>
