<script setup lang="ts">
import { useNextTrickEffect } from "@/hooks/useNextTrickEffect"
import { useLanguageStore } from "@/store"
import { storeToRefs } from "pinia"
import { computed, nextTick, ref, watch } from "vue"
import { useRouter } from "vue-router"
import ArticleEmpty from "./components/ArticleEmpty.vue"
import ArticleItem from "./components/ArticleItem.vue"
import ArticleSwitingOverylay from "./components/ArticleSwitingOverylay.vue"
import ArticleTagRail from "./components/ArticleTagRail.vue"
import ArticleTail from "./components/ArticleTail.vue"
import { useInitScroller, useToNextPage } from "./logicHooks"
import { useArticleStore } from "./store/useArticleStore"
const {
  articleStore: { articles },
  articleCategoriesStore: { categories, activedCategories, filter },
  sentinelObserver: { build },
} = useArticleStore()

const { currentLocale } = storeToRefs(useLanguageStore())

const translatedArticle = computed(() => {
  const lang = currentLocale.value
  return articles.map((item) => {
    const translateContent = item.translations.find((x) => x.lang === lang) || item.translations.find((x) => x.lang === "zh")
    return {
      ...translateContent!,
      ...item,
    }
  })
})

const sentinelRef = ref<HTMLElement>()
const { scrollerRef, scrollerContentRef, lenisRef } = useInitScroller()
const { toNextPage, loadingTransition, exhausted, switching, filterPage } = useToNextPage()

let isFiltering = false
let initialized = false

//init infinite scroll to load next page data
useNextTrickEffect(
  () => {
    if (initialized) return
    const sentinel = sentinelRef.value!
    const scroller = scrollerRef.value!
    build({
      root: scroller,
      sentinel,
      onReachBottom() {
        if (isFiltering) return
        console.log("toNextPage")
        toNextPage()
      },
    })
    initialized = true
  },
  () => translatedArticle,
)

const selectCategory = (id: string) => {
  activedCategories.has(id) ? activedCategories.delete(id) : activedCategories.add(id)
}

//stop scroller when filtering
watch(
  filter,
  async () => {
    isFiltering = true
    await nextTick()
    lenisRef.current?.stop()
    await filterPage()
    isFiltering = false
    lenisRef.current?.start()
  },
  {
    immediate: true,
  },
)

const { push } = useRouter()
const toDetailPage = (id: string) => {
  push({
    name: "articleDetail",
    params: {
      id,
    },
  })
}
</script>

<template>
  <div role="article-wrapper" class="size-full grid grid-cols-[1fr] relative py-2">
    <div role="article-list-wrapper" class="size-full overflow-y-auto" :class="{ dimmed: switching }" ref="scrollerRef">
      <ul role="article-list" class="flex flex-col size-full text-text" ref="scrollerContentRef">
        <li v-for="item in translatedArticle" :key="item.id" role="article-row" class="relative px-[18px] w-full" :data-key="item.id">
          <ArticleItem :item="item" @clickTag="selectCategory" @click="toDetailPage(item.id)"></ArticleItem>
        </li>

        <ArticleEmpty v-if="!translatedArticle.length && !switching" :show-actions="false"></ArticleEmpty>

        <!-- 最后加一个哨兵 -->
        <li ref="sentinelRef" aria-hidden class="h-[1px]" />
        <li role="article-tail">
          <ArticleTail :loading="loadingTransition" :exhausted="exhausted" />
        </li>
      </ul>
    </div>
    <div role="article-tags" class="absolute right-5 top-1/2 -translate-y-1/2">
      <ArticleTagRail :items="categories" :active-ids="activedCategories" @select="selectCategory"> </ArticleTagRail>
    </div>
    <ArticleSwitingOverylay :switching="switching" />
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

  &.dimmed {
    filter: blur(4px) brightness(0.85);
    transition: filter 180ms ease;
    pointer-events: none;
  }
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
