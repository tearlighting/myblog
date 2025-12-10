<script setup lang="ts">
import { computed, ref } from "vue"
import type { IButtonProps } from "./types"

const props = withDefaults(defineProps<IButtonProps>(), {
  variant: "primary",
  size: "md",
  disabled: false,
})

const classes = computed(() => ["app-btn", `app-btn--${props.variant}`, `app-btn--${props.size}`, props.disabled && "is-disabled"])
const x = ref(50)
const y = ref(50)

function move(e: MouseEvent) {
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  x.value = ((e.clientX - r.left) / r.width) * 100
  y.value = ((e.clientY - r.top) / r.height) * 100
}
</script>

<template>
  <button :class="classes" :disabled="disabled" type="button" @mousemove="move">
    <span class="app-btn__inner">
      <slot />
    </span>
  </button>
</template>

<style lang="less" scoped>
.app-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 9999px;
  padding: 0.5rem 1.2rem;

  cursor: pointer;
  user-select: none;

  /* 基础玻璃背景 */
  background: color-mix(in srgb, var(--btn-bg) 18%, transparent);
  border: 1px solid color-mix(in srgb, var(--btn-bg) 50%, transparent);
  color: var(--btn-text);

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  box-shadow: 0 4px 12px -4px color-mix(in srgb, var(--btn-bg) 60%, transparent);

  transition: background 160ms ease, border-color 160ms ease, box-shadow 160ms ease, transform 120ms ease, opacity 120ms ease;

  overflow: hidden;

  /* 内容层 */
  &__inner {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }

  /* 发光层 */
  &::before {
    content: "";
    position: absolute;
    inset: -35%;
    pointer-events: none;

    background: radial-gradient(circle at 0% 0%, color-mix(in srgb, var(--btn-bg) 65%, transparent) 0, transparent 55%),
      radial-gradient(circle at 100% 100%, color-mix(in srgb, var(--btn-bg) 40%, transparent) 0, transparent 55%);

    opacity: 0;
    transform: scale(0.9);
    transition: opacity 220ms ease, transform 220ms ease;
  }

  &:hover:not(.is-disabled) {
    background: color-mix(in srgb, var(--btn-bg) 26%, transparent);
    border-color: color-mix(in srgb, var(--btn-bg) 70%, transparent);
    transform: translateY(-1px);

    box-shadow: 0 0 0 1px color-mix(in srgb, var(--btn-bg) 26%, transparent), 0 22px 55px -26px color-mix(in srgb, var(--btn-bg) 90%, rgba(0, 0, 0, 0.5));

    &::before {
      opacity: 0.9;
      transform: scale(1);
    }
  }

  &:active:not(.is-disabled) {
    transform: scale(0.96);
    box-shadow: 0 2px 8px -4px color-mix(in srgb, var(--btn-bg) 40%, transparent);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--btn-bg) 60%, rgba(255, 255, 255, 0.15)), 0 0 0 1px color-mix(in srgb, var(--btn-bg) 40%, transparent);
  }

  &.is-disabled,
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  /* Size */
  &--sm {
    padding: 0.3rem 0.9rem;
    font-size: 0.8rem;
  }

  &--md {
    padding: 0.5rem 1.2rem;
    font-size: 0.9rem;
  }

  &--lg {
    padding: 0.7rem 1.6rem;
    font-size: 1rem;
  }

  /* Outline */
  &--outline {
    background: color-mix(in srgb, var(--color-surface) 60%, transparent);
    border-color: color-mix(in srgb, var(--btn-bg) 60%, transparent);
    color: var(--btn-bg);

    &:hover:not(.is-disabled) {
      background: color-mix(in srgb, var(--color-surface) 80%, transparent);
    }
  }

  /* Ghost */
  &--ghost {
    background: transparent;
    border-color: color-mix(in srgb, var(--color-border) 70%, transparent);
    box-shadow: none;
    color: var(--color-text);

    &:hover:not(.is-disabled) {
      background: color-mix(in srgb, var(--color-surface) 70%, transparent);
      box-shadow: 0 18px 40px -24px color-mix(in srgb, var(--btn-bg) 55%, rgba(0, 0, 0, 1));
    }
  }
}
</style>
