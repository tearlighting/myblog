<script setup lang="ts">
import { computed, ref } from "vue"

const props = defineProps<{
  src: string
  title: string
  description: string
}>()

// ======== 图片加载逻辑 ========
const loaded = ref(false)
function handleImgLoaded() {
  loaded.value = true
}

// ======== 3D tilt 逻辑 ========
const wrapperRef = ref<HTMLElement | null>(null)
const tiltX = ref(0)
const tiltY = ref(0)
const isHovering = ref(false)
const MAX_TILT = 10

function handleMove(e: MouseEvent) {
  if (!wrapperRef.value) return
  const r = wrapperRef.value.getBoundingClientRect()
  const nx = ((e.clientX - r.left) / r.width) * 2 - 1
  const ny = ((e.clientY - r.top) / r.height) * 2 - 1
  tiltX.value = nx * MAX_TILT
  tiltY.value = -ny * MAX_TILT
  isHovering.value = true
}

function leave() {
  tiltX.value = 0
  tiltY.value = 0
  isHovering.value = false
}

const cardStyle = computed(() => ({
  transform: `
    rotateX(${tiltY.value}deg)
    rotateY(${tiltX.value}deg)
    scale(${isHovering.value ? 1.04 : 1})
  `,
}))
</script>

<template>
  <div ref="wrapperRef" class="relative w-full h-[60vh] flex items-center justify-center [perspective:1200px]" @mousemove="handleMove" @mouseleave="leave">
    <!-- 3D 容器 -->
    <div class="relative w-full max-w-5xl h-full rounded-2xl overflow-hidden shadow-xl transition-transform duration-150" :style="cardStyle">
      <!-- Skeleton (blur-up) -->
      <div class="absolute inset-0 bg-gray-700 animate-pulse" v-show="!loaded"></div>

      <!-- 图片：blur-up + crossfade -->
      <img :src="src" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700" :class="loaded ? 'opacity-100' : 'opacity-0 blur-md'" @load="handleImgLoaded" />

      <!-- 渐变遮罩 -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>

      <!-- 文案：必须等 loaded 才进场 -->
      <div class="relative z-10 h-full flex flex-col justify-center px-10 text-white">
        <h2 class="text-4xl md:text-5xl font-semibold tracking-tight transition-all duration-700 opacity-0 translate-y-3" :class="loaded ? 'opacity-100 translate-y-0' : ''">
          {{ title }}
        </h2>

        <p class="mt-4 max-w-xl text-lg transition-all duration-700 delay-150 opacity-0 translate-y-3" :class="loaded ? 'opacity-100 translate-y-0' : ''">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>
