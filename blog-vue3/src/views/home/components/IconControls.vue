<script setup lang="ts">
import SvgIcon from "@/components/SvgIcon/index.vue"
import { EIcons } from "@/constants/icons"
import clsx from "clsx"
import { useHomeStore } from "../store"
const {
  bannerStore: { banners, currentIndex },
} = useHomeStore()
</script>

<template>
  <div role="icon-controls">
    <template>
      <div
        :class="
          clsx(
            'absolute left-1/2 top-2 -translate-x-1/2 -translate-y-1/2',
            'text-2xl cursor-pointer ',
            'hover: scale-[1.1] ',
            ' transition-all duration-75 origin-bottom animate-[jump-up_2s_ease-in-out_infinite]'
          )
        "
        v-show="currentIndex.current > 0"
      >
        <SvgIcon :name="EIcons.Fullscreen" @click="currentIndex.current--"></SvgIcon>
      </div>
      <div
        :class="
          clsx(
            'absolute left-1/2  bottom-2 -translate-x-1/2 -translate-y-1/2',
            'text-2xl cursor-pointer ',
            'hover: scale-[1.1] ',
            ' transition-all duration-75 origin-top animate-[jump-up_2s_ease-in-out_infinite]'
          )
        "
        v-show="currentIndex.current < banners.length - 1"
      >
        <SvgIcon :name="EIcons.Close" @click="currentIndex.current++"></SvgIcon>
      </div>
    </template>

    <template>
      <ul class="absolute left-[auto] right-2">
        <li
          v-for="(item, index) of banners"
          :key="item.id"
          :class="clsx('w-2 h-2  mt-2', 'rounded-full  ', 'hover: cursor-pointer scale-[1.1]', currentIndex.current === index && 'bg-primary')"
          @click="currentIndex.current = index"
        ></li>
      </ul>
    </template>
  </div>
</template>

<style lang="less" scoped>
@keyframes jump-up {
  0% {
    transform: translate(-50%, 0.2em);
  }

  50% {
    transform: translate(-50%, -0.2em);
  }

  100% {
    transform: translate(-50%, 0.2em);
  }
}

@keyframes jump-down {
  0% {
    ransform: translate(-50%, -0.2em);
  }

  50% {
    transform: translate(-50%, 0.2em);
  }

  100% {
    ransform: translate(-50%, -0.2em);
  }
}
</style>
