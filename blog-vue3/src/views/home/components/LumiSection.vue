<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"

interface LumiItem {
  id?: string | number
  bigImg: string
  title: string
  subtitle?: string
  description?: string
  tag?: string
  accent?: string // 不传就用当前 theme 的 --color-primary
}

const props = withDefaults(
  defineProps<{
    items: LumiItem[]
    autoPlay?: boolean
    interval?: number // ms
  }>(),
  {
    autoPlay: true,
    interval: 9000,
  }
)

const current = ref(0)
const loaded = ref(false)

// ===== 图片加载 =====
watch(
  () => current.value,
  () => {
    loaded.value = false
  }
)

function handleImgLoaded() {
  loaded.value = true
}

// ===== 3D tilt 逻辑 =====
const wrapperRef = ref<HTMLElement | null>(null)
const tiltX = ref(0)
const tiltY = ref(0)
const isHovering = ref(false)
const MAX_TILT = 10

let enableTilt = true

function handleMove(e: MouseEvent) {
  if (!enableTilt || !wrapperRef.value) return
  const r = wrapperRef.value.getBoundingClientRect()
  const nx = ((e.clientX - r.left) / r.width) * 2 - 1
  const ny = ((e.clientY - r.top) / r.height) * 2 - 1
  tiltX.value = nx * MAX_TILT
  tiltY.value = -ny * MAX_TILT
  isHovering.value = true
}

function handleLeave() {
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

// ===== 自动轮播 =====
let timer: number | null = null

function startTimer() {
  if (!props.autoPlay || props.items.length <= 1) return
  stopTimer()
  timer = window.setInterval(() => {
    current.value = (current.value + 1) % props.items.length
  }, props.interval)
}

function stopTimer() {
  if (timer != null) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => {
  // 粗暴一点：手机端关掉 tilt
  if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) {
    enableTilt = false
  }
  startTimer()
})

onBeforeUnmount(() => {
  stopTimer()
})

function go(i: number) {
  current.value = i
}

const activeItem = computed(() => props.items[current.value])
const accentColor = computed(() => activeItem.value.accent ?? "var(--color-primary)")
</script>

<template>
  <section class="lumi-section relative w-full mb-10" aria-label="featured scenes">
    <div class="pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden="true">
      <!-- 轻微的背景 gradient 光晕，吃 accent 色 -->
      <div class="lumi-backdrop" :style="{ '--lumi-accent': accentColor as any }" />
    </div>

    <div class="mx-auto max-w-6xl px-4 lg:px-0">
      <!-- 主卡片 -->
      <div
        ref="wrapperRef"
        class="relative w-full h-[60vh] min-h-[380px] flex items-center justify-center [perspective:1400px]"
        @mousemove="handleMove"
        @mouseleave="handleLeave"
        @mouseenter="stopTimer"
      >
        <div class="lumi-card relative w-full h-full rounded-3xl overflow-hidden transition-transform duration-150 will-change-transform" :style="[cardStyle, { '--lumi-accent': accentColor }]">
          <!-- skeleton -->
          <div v-show="!loaded" class="absolute inset-0 bg-[color-mix(in_srgb,var(--lumi-accent)_10%,#020617)] animate-pulse" />

          <!-- 图片 -->
          <Transition name="lumi-fade">
            <img
              :key="activeItem.bigImg"
              :src="activeItem.bigImg"
              class="absolute inset-0 w-full h-full object-cover select-none"
              :class="loaded ? 'opacity-100' : 'opacity-0 blur-md'"
              @load="handleImgLoaded"
            />
          </Transition>

          <!-- 左侧渐变遮罩 -->
          <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />

          <!-- 装饰的光圈 & 线条 -->
          <div
            class="pointer-events-none absolute -right-24 -top-24 w-80 h-80 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--lumi-accent)_60%,transparent),transparent_60%)] blur-3xl opacity-70"
          />
          <div class="pointer-events-none absolute -left-16 bottom-8 w-40 h-40 border border-[color-mix(in_srgb,var(--lumi-accent)_65%,transparent)] rounded-full opacity-60" />
          <div
            class="pointer-events-none absolute right-10 top-10 h-10 w-28 rounded-full border border-white/20 bg-black/30 backdrop-blur-md flex items-center justify-center text-[11px] tracking-[0.15em] uppercase text-white/70"
          >
            Lumi Scene
          </div>

          <!-- 文案区域 -->
          <div class="relative z-10 h-full flex flex-col justify-center px-8 md:px-12 lg:px-16 text-white">
            <Transition name="lumi-slide">
              <div :key="activeItem.id ?? activeItem.title">
                <p v-if="activeItem.tag" class="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[11px] tracking-[0.2em] uppercase mb-4">
                  <span class="inline-block w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: accentColor as any }" />
                  {{ activeItem.tag }}
                </p>

                <h2 class="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight drop-shadow-xl">
                  {{ activeItem.title }}
                </h2>

                <p v-if="activeItem.subtitle" class="mt-2 text-base md:text-lg text-white/80">
                  {{ activeItem.subtitle }}
                </p>

                <p v-if="activeItem.description" class="mt-5 max-w-xl text-sm md:text-base text-white/80 leading-relaxed">
                  {{ activeItem.description }}
                </p>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- 下方切换 pill / indicator -->
      <div class="mt-4 flex flex-wrap items-center justify-center gap-2 md:gap-3" @mouseenter="stopTimer" @mouseleave="startTimer">
        <button
          v-for="(item, index) in props.items"
          :key="item.id ?? item.title"
          class="group flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs md:text-sm transition-all duration-200"
          :class="index === current ? 'lumi-pill-active' : 'lumi-pill'"
          :style="{
            '--lumi-accent': (item.accent ?? 'var(--color-primary)') as any,
          }"
          type="button"
          @click="go(index)"
        >
          <span class="inline-block h-1.5 w-1.5 rounded-full group-[.lumi-pill-active]:scale-125 transition-transform" />
          <span class="truncate max-w-[120px] md:max-w-[180px]">
            {{ item.title }}
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lumi-card {
  background: radial-gradient(circle at 0% 0%, color-mix(in srgb, var(--lumi-accent) 24%, transparent) 0, transparent 55%),
    radial-gradient(circle at 100% 100%, color-mix(in srgb, var(--lumi-accent) 18%, transparent) 0, transparent 60%), var(--surface-1, #020617);
  border: 1px solid color-mix(in srgb, var(--lumi-accent) 40%, transparent);
  box-shadow: 0 26px 70px color-mix(in srgb, var(--lumi-accent) 30%, transparent), 0 0 0 1px rgba(255, 255, 255, 0.02);
}

/* 背景淡淡一层，与 page-host 区分一点 */
.lumi-backdrop {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 10% 0%, color-mix(in srgb, var(--lumi-accent) 14%, transparent), transparent 55%),
    radial-gradient(circle at 90% 100%, color-mix(in srgb, var(--lumi-accent) 10%, transparent), transparent 60%);
  opacity: 0.7;
}

/* dot / pill */
.lumi-pill {
  background: color-mix(in srgb, var(--surface-1) 86%, transparent);
  border-color: color-mix(in srgb, var(--lumi-accent) 26%, transparent);
  color: color-mix(in srgb, var(--color-text, #e5e7eb) 90%, transparent);
}
.lumi-pill span:first-child {
  background-color: color-mix(in srgb, var(--lumi-accent) 80%, transparent);
}
.lumi-pill:hover {
  background: color-mix(in srgb, var(--lumi-accent) 12%, transparent);
}

.lumi-pill-active {
  background: color-mix(in srgb, var(--lumi-accent) 26%, transparent);
  border-color: color-mix(in srgb, var(--lumi-accent) 80%, transparent);
  color: var(--color-invert, #fff);
}
.lumi-pill-active span:first-child {
  background-color: #fff;
}

/* 动画 */
.lumi-fade-enter-active,
.lumi-fade-leave-active {
  transition: opacity 0.6s ease, filter 0.6s ease;
}
.lumi-fade-enter-from,
.lumi-fade-leave-to {
  opacity: 0;
  filter: blur(6px);
}

.lumi-slide-enter-active,
.lumi-slide-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.lumi-slide-enter-from,
.lumi-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
