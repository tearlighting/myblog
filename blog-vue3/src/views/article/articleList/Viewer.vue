<script setup lang="ts">
import { useLanguageStore } from "@/store"
import { storeToRefs } from "pinia"
import { computed, nextTick, ref, watch } from "vue"
import ArticleItem from "./components/ArticleItem.vue"
import ArticleTagRail from "./components/ArticleTagRail.vue"
import ArticleTail from "./components/ArticleTail.vue"
import { useInitScroller, useToNextPage } from "./logicHooks"
import { useArticleStore } from "./store/useArticleStore"
const {
  articleStore: { articles, categories },
  sentinelObserver: { build },
} = useArticleStore()

const { currentLocale } = storeToRefs(useLanguageStore())

const translatedArticle = computed(() => {
  const lang = currentLocale.value
  return articles.map((item) => {
    const translateContent = item.translations.find((x) => x.lang === lang) || item.translations.find((x) => x.lang === "zh")
    return {
      ...item,
      ...translateContent!,
    }
  })
})

const sentinelRef = ref<HTMLElement>()
const { scrollerRef, scrollerContentRef } = useInitScroller()
const { toNextPage, loadingTransition, exhausted } = useToNextPage()
watch(
  translatedArticle,
  async () => {
    await nextTick()
    const sentinel = sentinelRef.value!
    const scroller = scrollerRef.value!
    build({
      root: scroller,
      sentinel,
      onReachBottom() {
        console.log("next")

        toNextPage()
      },
    })
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <div role="article-wrapper" class="size-full grid grid-cols-[1fr] relative py-2">
    <div role="article-list-wrapper" class="size-full overflow-y-auto" ref="scrollerRef">
      <ul role="article-list" class="flex flex-col size-full text-text" ref="scrollerContentRef">
        <li v-for="item in translatedArticle" :key="item.id" role="article-row" class="relative px-[18px] w-full">
          <ArticleItem :item="item"></ArticleItem>
        </li>
        <!-- 最后加一个哨兵 -->
        <li ref="sentinelRef" aria-hidden class="h-[1px]" />
        <li role="article-tail">
          <ArticleTail :loading="loadingTransition" :exhausted="exhausted" />
        </li>
      </ul>
    </div>
    <div role="article-tags" class="absolute right-5 top-1/2 -translate-y-1/2">
      <ArticleTagRail :items="categories"></ArticleTagRail>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import "@/core/index.less";

// 分割线
.article-divider() {
  height: 1px;
  padding-inline: 20px;
  margin-top: 6px;
  width: calc(100% - 36px);
  background: linear-gradient(to right, transparent, color-mix(in srgb, var(--divider) 35%, transparent), transparent);
}
[role="article-list-wrapper"] {
  .theme-scroller();
  background: color-mix(in srgb, var(--surface-1) 65%, transparent);
  border: 1px solid color-mix(in srgb, var(--divider) 60%, transparent);
  border-radius: 16px;
  box-shadow: var(--elevation-1);
  backdrop-filter: blur(14px);
  padding: 12px 0;
}
[role="article-list"] {
  [role="article-row"]:nth-child(4n) {
    margin-bottom: 16px;
    &::after {
      content: "";
      position: absolute;
      bottom: -9px;
      .article-divider();
    }
  }
  [role="article-tags"] {
    opacity: 0.65;
    filter: saturate(0.9);
  }
}
</style>
