<script setup lang="ts">
import { useLanguageStore } from "@/store"
import { storeToRefs } from "pinia"
import { computed } from "vue"
import ArticleItem from "./components/ArticleItem.vue"
import { useArticleStore } from "./store/useArticleStore"
const {
  articleStore: { articles },
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
</script>

<template>
  <div role="article-list-wrapper" class="size-full">
    <ul role="article-list" class="flex flex-col gap-2 size-full text-text">
      <li v-for="item in translatedArticle" :key="item.id" role="article-row" class="group">
        <ArticleItem :item="item"></ArticleItem>
      </li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
[role="article-list"] {
}
</style>
