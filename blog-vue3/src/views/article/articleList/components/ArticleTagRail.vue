<script setup lang="ts">
import type { IArticleCategoryItem } from "article"
import clsx from "clsx"

const props = defineProps<{
  items: IArticleCategoryItem[]
  activeId?: string
}>()

const emit = defineEmits<{
  (e: "select", id: string): void
}>()

const maxCount = Math.max(...props.items.map((i) => i.articleCount))
const intensity = (count: number) => Math.min(1, 0.35 + (count / maxCount) * 0.65)
</script>

<template>
  <nav role="tag-rail">
    <button
      v-for="item in items"
      :key="item.id"
      role="tag-node"
      :class="clsx(item.id === activeId && 'active')"
      :style="{ '--intensity': intensity(item.articleCount) }"
      @click="emit('select', item.id)"
    >
      <span class="dot" />
      <span class="hint">
        {{ item.name }}
        <em>{{ item.articleCount }}</em>
      </span>
    </button>
  </nav>
</template>

<style lang="less" scoped>
[role="tag-rail"] {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 14px;
  pointer-events: auto;
}

/* 单个节点 */
[role="tag-node"] {
  all: unset;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
[role="tag-node"].active {
  margin: 4px 0;
}
/* 点本体 */
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--color-primary) 90%, white), color-mix(in srgb, var(--color-primary) 60%, transparent));
  opacity: 0.45;
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
}

/* hover / active 只强化“点” */
[role="tag-node"]:hover .dot {
  opacity: 0.85;
  transform: scale(1.6);
  box-shadow: 0 0 12px color-mix(in srgb, var(--color-primary) 40%, transparent);
}

[role="tag-node"].active .dot {
  opacity: 1;
  transform: scale(1.9);
  box-shadow: 0 0 18px color-mix(in srgb, var(--color-primary) 60%, transparent);
}

/* 提示文字：浮层，不参与节奏 */
.hint {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%) translateX(6px);
  background: color-mix(in srgb, var(--surface-1) 70%, transparent);
  backdrop-filter: blur(8px);
  border-radius: 6px;
  padding: 4px 8px;

  font-size: 0.7rem;
  white-space: nowrap;
  color: var(--color-text);

  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease;

  em {
    margin-left: 6px;
    font-style: normal;
    opacity: 0.45;
    font-size: 0.85em;
  }
}

[role="tag-node"]:hover .hint,
[role="tag-node"].active .hint {
  opacity: 0.95;
  transform: translateY(-50%) translateX(0);
}
.hint {
  transform: translateY(-50%) translateX(4px) scale(0.98);
}

[role="tag-node"]:hover .hint,
[role="tag-node"].active .hint {
  transform: translateY(-50%) translateX(0) scale(1);
}
</style>
