<script setup lang="ts">
import { ref, computed } from "vue"

const props = defineProps<{
	src: string
	title: string
	description: string
}>()

const wrapperRef = ref<HTMLElement | null>(null)
const tiltX = ref(0) // 左右
const tiltY = ref(0) // 上下
const isHovering = ref(false)

// 最大倾斜角度
const MAX_TILT = 10

function handleMouseMove(e: MouseEvent) {
	if (!wrapperRef.value) return
	const rect = wrapperRef.value.getBoundingClientRect()
	const x = e.clientX - rect.left
	const y = e.clientY - rect.top

	// 归一化到 [-1, 1]
	const nx = (x / rect.width) * 2 - 1  // 左 -1 右 1
	const ny = (y / rect.height) * 2 - 1 // 上 -1 下 1

	// 注意：rotateX 是上下反的
	tiltX.value = nx * MAX_TILT
	tiltY.value = -ny * MAX_TILT
	isHovering.value = true
}

function handleMouseLeave() {
	tiltX.value = 0
	tiltY.value = 0
	isHovering.value = false
}

const cardStyle = computed(() => {
	const scale = isHovering.value ? 1.04 : 1.0
	return {
		transform: `
      rotateX(${tiltY.value}deg)
      rotateY(${tiltX.value}deg)
      scale(${scale})
    `,
	}
})
</script>

<template>
	<!-- perspective 容器 -->
	<div ref="wrapperRef" class="h-[60vh] w-full flex items-center justify-center cursor-pointer
           [perspective:1200px]" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
		<!-- 3D 卡片 -->
		<div class="relative w-full max-w-5xl h-full rounded-2xl overflow-hidden
             shadow-xl bg-slate-900/80
             transition-transform duration-150 ease-out" :style="cardStyle">
			<!-- 背景图 -->
			<img :src="props.src" class="absolute inset-0 w-full h-full object-cover
               opacity-80" />

			<!-- 渐变遮罩，增加可读性 -->
			<div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

			<!-- 文案层 -->
			<div class="relative z-10 h-full flex flex-col justify-center px-10 text-slate-50">
				<h2 class="text-4xl md:text-5xl font-semibold tracking-tight
                 drop-shadow-lg
                 transition-all duration-500
                 translate-y-4 opacity-0
                 data-[show=true]:translate-y-0
                 data-[show=true]:opacity-100" :data-show="true">
					{{ props.title }}
				</h2>

				<p class="mt-4 max-w-xl text-base md:text-lg text-slate-200/90
                 drop-shadow
                 transition-all duration-700 delay-150
                 translate-y-4 opacity-0
                 data-[show=true]:translate-y-0
                 data-[show=true]:opacity-100" :data-show="true">
					{{ props.description }}
				</p>
			</div>
		</div>
	</div>
</template>
