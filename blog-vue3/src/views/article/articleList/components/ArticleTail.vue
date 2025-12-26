<script setup lang="ts">
interface IArticleTailProps {
  loading: boolean
  exhausted: boolean
}
defineProps<IArticleTailProps>()
</script>

<template>
  <div role="article-tail">
    <div v-if="loading" role="tail-loading" class="w-full" aria-live="polite">
      <span class="dot" />
      <span class="dot" />
      <span class="dot" />
    </div>

    <div v-if="exhausted" role="tail-end">
      <span class="line" />
      <span class="label">已经到底了</span>
      <span class="line" />
    </div>
  </div>
</template>
<style lang="less" scoped>
[role="article-tail"] {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px 0;
  pointer-events: none;
  color: var(--color-muted);
}

/* loading：三点流动 */
[role="tail-loading"] {
  display: flex;
  gap: 8px;
  justify-content: center;
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--color-primary) 65%, transparent);
    animation: pulse 1.2s ease-in-out;
    opacity: 0.3;

    &:nth-child(2) {
      animation-delay: 0.15s;
    }
    &:nth-child(3) {
      animation-delay: 0.3s;
    }
  }
}

@keyframes pulse {
  0% {
    opacity: 0.2;
    transform: scale(0.9);
  }
  50% {
    opacity: 0.9;
    transform: scale(1);
  }
  100% {
    opacity: 0.2;
    transform: scale(0.9);
  }
}

/* exhausted：收尾 */
[role="tail-end"] {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  opacity: 0.65;

  .line {
    width: 36px;
    height: 1px;
    background: linear-gradient(to right, transparent, color-mix(in srgb, var(--divider) 60%, transparent), transparent);
  }

  .label {
    white-space: nowrap;
  }
}
</style>
