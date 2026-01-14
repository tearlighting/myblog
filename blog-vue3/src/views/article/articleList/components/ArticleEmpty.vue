<!-- EmptyState.vue -->
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    desc?: string
    /** 主按钮文案（比如：清空筛选 / 返回全部） */
    primaryText?: string
    /** 次按钮文案（比如：新建 / 刷新） */
    secondaryText?: string
    /** 是否显示按钮区 */
    showActions?: boolean
    /** 让占位更“像一页”，避免空态只在底部出现 */
    minHeight?: number
  }>(),
  {
    title: "没有找到内容",
    desc: "试试切换分类，或清空筛选条件。",
    primaryText: "清空筛选",
    secondaryText: "返回全部",
    showActions: true,
    minHeight: 520,
  }
)

const emits = defineEmits<{
  primary: []
  secondary: []
}>()
</script>

<template>
  <div role="empty-state" :style="{ minHeight: props.minHeight + 'px' }" class="w-full flex items-center justify-center py-10">
    <div role="empty-card" class="relative w-full max-w-[720px]">
      <!-- 背景装饰层（不影响交互） -->
      <div role="empty-decor" aria-hidden="true" />

      <!-- 玻璃主体 -->
      <div role="empty-body" class="relative px-6 py-6 sm:px-8 sm:py-7">
        <div class="flex items-start gap-4">
          <div role="empty-badge" class="shrink-0">
            <span class="dot" />
          </div>

          <div class="min-w-0 flex-1">
            <div class="text-[1.05rem] font-[650] tracking-[0.2px] text-text">
              {{ props.title }}
            </div>
            <div class="mt-2 text-[0.9rem] leading-[1.6] text-muted">
              {{ props.desc }}
            </div>

            <div v-if="props.showActions" class="mt-5 flex flex-wrap gap-2">
              <button type="button" role="empty-primary" class="btn btn-primary" @click="emits('primary')">
                {{ props.primaryText }}
              </button>

              <button type="button" role="empty-secondary" class="btn btn-ghost" @click="emits('secondary')">
                {{ props.secondaryText }}
              </button>
            </div>
          </div>

          <!-- 右上角一个很淡的 “状态标记” -->
          <div role="empty-mark" class="shrink-0 select-none">∅</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
[role="empty-card"] {
  border-radius: 18px;
}

/* 装饰层：微弱的渐变 + 网格感 + 轻微暗角 */
[role="empty-decor"] {
  position: absolute;
  inset: 0;
  border-radius: 18px;
  pointer-events: none;

  background: radial-gradient(80% 100% at 30% 0%, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 60%),
    radial-gradient(70% 100% at 90% 30%, color-mix(in srgb, var(--color-primary) 8%, transparent), transparent 60%),
    linear-gradient(to bottom, color-mix(in srgb, var(--surface-1) 30%, transparent), color-mix(in srgb, var(--surface-1) 12%, transparent));

  /* 细网格：很淡 */
  -webkit-mask: linear-gradient(#000, transparent 115%);
  mask: linear-gradient(#000, transparent 115%);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 18px;
    opacity: 0.22;
    background-image: linear-gradient(to right, color-mix(in srgb, var(--divider) 40%, transparent) 1px, transparent 1px),
      linear-gradient(to bottom, color-mix(in srgb, var(--divider) 40%, transparent) 1px, transparent 1px);
    background-size: 28px 28px;
    filter: blur(0px);
  }
}

/* 玻璃主体 */
[role="empty-body"] {
  border-radius: 18px;
  background: color-mix(in srgb, var(--surface-1) 62%, transparent);
  border: 1px solid color-mix(in srgb, var(--divider) 65%, transparent);
  box-shadow: var(--elevation-1);
  backdrop-filter: blur(10px);

  /* 入场轻动效（不依赖 js） */
  animation: emptyFadeIn 180ms ease-out both;
}

@keyframes emptyFadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 左侧小徽标 */
[role="empty-badge"] {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--surface-2, var(--surface-1)) 70%, transparent);
  border: 1px solid color-mix(in srgb, var(--divider) 55%, transparent);
  display: grid;
  place-items: center;

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--color-primary) 75%, transparent);
    box-shadow: 0 0 18px color-mix(in srgb, var(--color-primary) 35%, transparent);
    opacity: 0.9;
  }
}

/* 右上角符号：很淡，类似“眼镜 mark”那种存在感 */
[role="empty-mark"] {
  font-size: 18px;
  line-height: 1;
  opacity: 0.22;
  color: var(--color-text);
  padding: 6px 8px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--surface-1) 35%, transparent);
  border: 1px solid color-mix(in srgb, var(--divider) 40%, transparent);
}

/* buttons（不依赖你现有组件库） */
.btn {
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 0.9rem;
  line-height: 1;
  transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
  user-select: none;
}

.btn:active {
  transform: translateY(1px);
}

.btn-primary {
  color: var(--color-text);
  background: color-mix(in srgb, var(--color-primary) 16%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-primary) 35%, transparent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-primary) 10%, transparent) inset;
}
.btn-primary:hover {
  background: color-mix(in srgb, var(--color-primary) 22%, transparent);
  border-color: color-mix(in srgb, var(--color-primary) 48%, transparent);
}

.btn-ghost {
  color: var(--color-text);
  background: transparent;
  border: 1px solid color-mix(in srgb, var(--divider) 60%, transparent);
  opacity: 0.9;
}
.btn-ghost:hover {
  background: color-mix(in srgb, var(--surface-1) 40%, transparent);
  opacity: 1;
}
</style>
