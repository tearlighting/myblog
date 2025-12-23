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
	<div role="article-list-wrapper" class="size-full py-2">
		<ul role="article-list" class=" flex flex-col size-full text-text overflow-y-auto">
			<li v-for="item in translatedArticle" :key="item.id" role="article-row" class="relative px-[18px] w-full">
				<ArticleItem :item="item"></ArticleItem>
			</li>
		</ul>
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
	background:
		linear-gradient(to right,
			transparent,
			color-mix(in srgb, var(--divider) 35%, transparent),
			transparent);

}

[role="article-list"] {
	.theme-scroller();
	background: color-mix(in srgb, var(--surface-1) 65%, transparent);
	border: 1px solid color-mix(in srgb, var(--divider) 60%, transparent);
	border-radius: 16px;
	box-shadow: var(--elevation-1);
	backdrop-filter: blur(14px);
	padding: 12px 0;

	[role="article-row"]:nth-child(4n) {
		margin-bottom: 16px;

		&::after {
			content: "";
			position: absolute;
			bottom: -9px;
			.article-divider();
		}
	}


}
</style>
