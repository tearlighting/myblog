<script setup lang="ts">
import clsx from "clsx"

type Toc = {
  anchor: string
  name: string
  tag: string
  children: Toc[]
}

const props = defineProps<{
  items?: Toc[]
}>()

function scrollTo(id: string) {
  const container = document.querySelector(".content-scroll") as HTMLElement | null
  const el = container?.querySelector(`#${CSS.escape(id)}`) as HTMLElement | null
  if (!container || !el) return

  container.scrollTo({
    top: el.offsetTop - 12,
    behavior: "smooth",
  })
}
</script>

<template>
  <nav role="project-toc " class="size-full sticky top-[16px] px-[8px] py-[12px] text-sm text-muted">
    <ul>
      <li v-for="item in items" :key="item.anchor" :class="clsx('toc-item', `level-${item.tag}`)" @click="scrollTo(item.anchor)">
        {{ item.name }}
        <Toc v-if="item.children.length" :items="item.children" />
      </li>
    </ul>
  </nav>
</template>

<style lang="less" scoped>
.project-toc {
  font-size: 0.85rem;
  color: var(--color-muted);
}
.project-toc {
  position: sticky;
  top: 16px;
  padding: 12px 8px;
  font-size: 0.85rem;
  color: var(--color-muted);
}

.toc-item.level-2 {
  font-weight: 500;
}

.toc-item.level-3 {
  padding-left: 18px;
  opacity: 0.85;
}
</style>
