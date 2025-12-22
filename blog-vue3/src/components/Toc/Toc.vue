<script setup lang="ts">
import { EIcons } from "@/constants"
import clsx from "clsx"
import type { Toc } from "project"
import { computed, ref, watch } from "vue"
import SvgIcon from "../SvgIcon/index.vue"

const props = withDefaults(
  defineProps<{
    items?: Toc[]
    indentation?: number
    layer?: number
    activeAnchor?: string
    toAnchor?: (anchor: string) => void
  }>(),
  {
    indentation: 15,
    layer: 1,
  }
)

function scrollTo(item: Toc) {
  props.toAnchor?.(item.anchor)
}

const openSet = ref(new Set<string>())

watch(
  () => props.items,
  (items) => {
    if (!items) return

    if (props.layer === 1 || props.layer > 2) {
      openSet.value = new Set(items.map((x) => x.anchor))
    } else {
      openSet.value = new Set()
    }
  },
  { immediate: true }
)

function toggle(id: string) {
  if (openSet.value.has(id)) {
    openSet.value.delete(id)
  } else {
    openSet.value.add(id)
  }
}
function isOpen(id: string) {
  return openSet.value.has(id)
}

const parentMap = computed(() => {
  const map = new Map<string, string | null>()
  function walk(items: Toc[], parent: string | null) {
    for (const item of items) {
      map.set(item.anchor, parent)
      if (item.children?.length) {
        walk(item.children, item.anchor)
      }
    }
  }
  if (props.items) {
    walk(props.items, null)
  }

  return map
})
function isActiveParent(anchor: string) {
  if (!props.activeAnchor) return false

  if (anchor === props.activeAnchor) return true
  let cur = parentMap.value.get(props.activeAnchor)
  while (cur) {
    if (cur === anchor) return true
    cur = parentMap.value.get(cur) ?? null
  }
  return false
}
</script>

<template>
  <ul role="toc-wrapper" class="text-inherit bg-transparent" :style="{ '--indentation': indentation, '--layer': layer }">
    <li
      v-for="item in items"
      :key="item.anchor"
      role="toc-item"
      class="rounded-[6px] cursor-pointer list-none select-none"
      :class="
        clsx(`level-${item.tag} `, {
          active: item.anchor === activeAnchor || (isActiveParent(item.anchor) && ((item.children.length && !isOpen(item.anchor)) || !item.children.length)),
        })
      "
    >
      <div role="toc-item-inner" class="py-1 px-[10px]">
        <div role="toc-title" class="flex items-center gap-[6px] cursor-pointer" @click.stop="scrollTo(item)">
          <span class="text-text flex-1">{{ item.name }}</span>
          <template v-if="item.children.length && layer <= 2">
            <SvgIcon :name="EIcons.ArrowDown" :class="clsx(isOpen(item.anchor) && 'rotate-180')" @click.stop="toggle(item.anchor)"></SvgIcon>
          </template>
        </div>
      </div>
      <transition name="toc-collapse">
        <Toc v-if="item.children.length && isOpen(item.anchor)" :items="item.children" :indentation="indentation" :layer="layer + 1" :activeAnchor="activeAnchor" :toAnchor="toAnchor" />
      </transition>
    </li>
  </ul>
</template>

<style lang="less" scoped>
//top 左侧基准线
.baseline() {
  content: "";
  position: absolute;
  left: 2px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--divider) 55%, transparent);
  opacity: 0.55;
}
//左侧亮线
.active-line () {
  content: "";
  position: absolute;
  left: -6px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--color-primary) 80%, transparent);
  opacity: 1;
  box-shadow: 0 0 18px color-mix(in srgb, var(--color-primary) 25%, transparent);
}
//hover样式
.item-hover() {
  content: "";
  position: absolute;
  inset: 2px;
  border-radius: 6px;
  background-color: transparent;
  transition: all 0.3s ease;
  pointer-events: none;
}

[role="toc-wrapper"] {
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--color-muted);
  //左侧竖线
  &[style*="--layer: 1"]::before {
    .baseline();
  }

  [role="toc-item"] {
    transition: color 0.2s ease, background 0.2s ease;
    [role="toc-item-inner"] {
      &::before {
        .item-hover();
      }
      position: relative;
      [role="toc-title"] {
        padding-left: calc(var(--indentation) * (var(--layer) - 1) * 1px);
      }
      svg {
        opacity: 0.4;
        transform-origin: center;
        transition: transform 0.25s ease, opacity 0.2s ease;
      }
      &:hover {
        color: var(--color-text);
        &::before {
          background: color-mix(in srgb, var(--color-primary) 8%, transparent);
        }
        svg {
          opacity: 0.7;
        }
      }
    }

    &.active {
      & > [role="toc-item-inner"] {
        &::before {
          background: color-mix(in srgb, var(--color-primary) 8%, transparent);
        }
        &:hover {
          &::before {
            inset: 3px 2px;
            background: color-mix(in srgb, var(--color-primary) 10%, transparent);
          }
          span {
            color: color-mix(in srgb, var(--color-primary) 80%, transparent);
          }
        }
        // active 亮线
        &::after {
          .active-line();
        }
      }
    }
    &.level-h2 {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--color-text);
    }

    &.level-h3 {
      font-size: 0.82rem;
      opacity: 0.85;
    }

    &.level-h4 {
      font-size: 0.8rem;
      opacity: 0.7;
    }
  }

  .toc-collapse-enter-from {
    max-height: 0;
    opacity: 0;
    transform: translateY(-4px);
  }
  .toc-collapse-enter-to {
    max-height: 600px;
    opacity: 1;
    transform: translateY(0);
  }
  .toc-collapse-enter-active {
    transition: max-height 0.25s ease, opacity 0.2s ease, transform 0.2s ease;
  }
}
</style>
