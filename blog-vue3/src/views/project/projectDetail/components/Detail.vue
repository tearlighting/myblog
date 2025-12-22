<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue';
import { useProjectDetailStore } from '../store';

import { useLanguageStore, useThemeStore } from '@/store';
import { storeToRefs } from 'pinia';
import { highlightAll, highlightElement, highlight, languages } from 'prismjs';
import clsx from 'clsx';

const { projectDetailStore: {
	projectItem
} } = useProjectDetailStore()
const { currentLocale } = storeToRefs(useLanguageStore())
const translatedProjectItem = computed(() => {
	if (!projectItem.value) return null
	const lang = currentLocale.value
	const { translations, id, ...rest } = projectItem.value
	const translatedItem = translations.find((item) => item.lang === lang) || translations.find(item => item.lang === 'zh')
	return {
		...rest,
		...translatedItem
	}
})

watch(translatedProjectItem, async () => {
	await nextTick()
	highlightAll()
}, {
	immediate: true
})

const { currentTheme } = storeToRefs(useThemeStore())
const isLightTheme = computed(() => {
	const themes: Array<typeof currentTheme.value> = ['sakura', "sunset", 'mono']
	return themes.includes(currentTheme.value)
})

</script>

<template>
	<div v-if="translatedProjectItem" role="project-detail-article" :class="clsx(isLightTheme && 'light')"
		class="size-full overflow-y-auto">
		<div role="project-section" v-html="translatedProjectItem.htmlContent">
		</div>

	</div>
</template>

<style lang="less" scoped>
@keyframes article-breathe {

	0%,
	100% {
		opacity: 1;
	}

	50% {
		opacity: 0.985;
	}
}

//亮色主题直接瞎了,只能覆盖prism的一点样式
.lightThemePrism() {
	code {
		color: #1f2937;

		.keyword {
			color: #99209c;
		}

		.operator {
			color: #12a9a7;
		}

		.punctuation {
			color: #958888;
		}

		.string {
			color: #14a74b;
		}

		.function {
			color: #fb6804;
		}

		.constant {
			color: #f08d49;
		}

		.builtin {
			color: #dc4ddf;
		}
	}
}

[role="project-detail-article"] {
	&.light {
		:deep([role="project-section"]) {
			background: #ffffff;
			border-radius: 14px;
			border: 1px solid var(--divider);
			// box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
			box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04),
				inset 0 0 0 1px var(--divider),
				inset 0 0 40px color-mix(in srgb, var(--color-primary) 6%, transparent);
			;
			animation: article-breathe 12s ease-in-out infinite;
			.lightThemePrism();

		}

	}

	--text-strong: var(--color-text);
	--text: color-mix(in srgb, var(--color-text) 92%, transparent);
	--text-muted: var(--color-muted);
	--text-faint: color-mix(in srgb, var(--color-muted) 70%, transparent);

	:deep([role="project-section"]) {
		/* 基础排版：让整块内容更“印刷体” */
		max-width: 78ch;
		margin: 0 auto;
		padding: clamp(24px, 4vw, 56px) clamp(18px, 3vw, 40px);

		color: var(--text);
		line-height: 1.8;


		/* 标题层级 */
		h1 {
			font-size: clamp(1.6rem, 2.2vw, 2.2rem);
			line-height: 1.25;
			letter-spacing: 0.02em;
			margin: 0 0 2.2rem;
			color: var(--text-strong);
		}

		/* ✅ 章节标题：不要大横条，改成“标题 + 细分割 + 微光” */
		h2 {
			position: relative;
			margin-top: 4.2rem;
			margin-bottom: 1.1rem;
			padding-bottom: 0.9rem;

			font-size: 1.35rem;
			line-height: 1.25;
			font-weight: 650;
			letter-spacing: 0.02em;

			color: var(--text-strong);

			/* 让锚点跳转不被吸顶遮住（如果你有 sticky header） */
			scroll-margin-top: 84px;

			/* h2 下方的“高级细线” */
			&::after {
				content: "";
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;

				height: 1px;
				opacity: 0.9;
				background: linear-gradient(to right,
						transparent,
						color-mix(in srgb, var(--divider) 70%, transparent),
						transparent);
			}

			/* h2 的微光点缀（很克制，不会土） */
			&::before {
				content: "";
				position: absolute;
				left: -10px;
				top: 0.25em;

				width: 6px;
				height: 6px;
				border-radius: 999px;

				background: color-mix(in srgb, var(--color-primary) 70%, transparent);
				box-shadow: 0 0 18px color-mix(in srgb, var(--color-primary) 25%, transparent);
				opacity: 0.85;
			}
		}

		/* h3：小标题更紧凑 */
		h3 {
			margin-top: 1.6rem;
			margin-bottom: 0.6rem;
			font-size: 1.05rem;
			font-weight: 650;
			letter-spacing: 0.01em;
			color: var(--text-strong);
		}

		p {
			color: var(--text);
			line-height: 1.75;
		}

		/* 列表 */
		li {
			color: var(--text-muted);
		}

		/* 小标题后的第一段（Lead 效果） */
		h2+p {
			color: var(--text-strong);
		}

		/* 解释性文字 */
		h3+p {
			color: var(--text-muted);
		}

		strong {
			color: var(--text-strong);
		}

		em {
			color: var(--text-faint);
			font-style: normal;
		}

		/* ✅ 章节内容域：统一“块感” */
		/* 解释：无法包 section，就把 h2 后面的内容统一一个节奏 */
		p,
		ul,
		ol,
		blockquote,
		pre,
		table {
			margin: 0.9rem 0;
		}

		/* 列表别像散点，压一压 */
		ul,
		ol {
			padding-left: 1.2rem;
		}

		li {
			margin: 0.35rem 0;
		}

		/* ✅ 删掉你那根很土的 hr：把它当“章节间距”用 */
		hr {
			border: none;
			height: 2.2rem;
			margin: 0;
		}

		/* 引用块：玻璃卡片感 */
		blockquote {
			margin: 1.2rem 0;
			padding: 0.9rem 1rem;
			border: 1px solid color-mix(in srgb, var(--divider) 70%, transparent);
			background: color-mix(in srgb, var(--surface-1) 65%, transparent);
			border-radius: 14px;
			color: var(--color-muted);
		}

		blockquote p {
			margin: 0.4rem 0;
		}

		/* 行内 code */
		code {
			font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
			font-size: 0.92em;

			padding: 0.12em 0.4em;
			border-radius: 10px;
			border: 1px solid color-mix(in srgb, var(--divider) 60%, transparent);
			background: color-mix(in srgb, var(--surface-2) 70%, transparent);
		}

		/* 代码块 */
		pre {
			padding: 1rem 1.05rem;
			border-radius: 16px;
			border: 1px solid color-mix(in srgb, var(--divider) 70%, transparent);
			background: color-mix(in srgb, var(--color-border) 10%, transparent);
			box-shadow: var(--elevation-1);
			overflow: auto;
		}

		pre code {
			padding: 0;
			border: none;
			background: transparent;
		}

		/* 表格（如果有） */
		table {
			width: 100%;
			border-collapse: separate;
			border-spacing: 0;
			border: 1px solid color-mix(in srgb, var(--divider) 70%, transparent);
			border-radius: 16px;
			overflow: hidden;
			background: color-mix(in srgb, var(--surface-1) 70%, transparent);
		}

		th,
		td {
			padding: 0.75rem 0.85rem;
			border-bottom: 1px solid color-mix(in srgb, var(--divider) 60%, transparent);
			color: var(--color-muted);
		}

		th {
			color: var(--color-text);
			font-weight: 650;
			background: color-mix(in srgb, var(--surface-2) 55%, transparent);
		}

		tr:last-child td {
			border-bottom: none;
		}

		/* 链接：别太亮，hover 再亮 */
		a {
			color: color-mix(in srgb, var(--color-primary) 70%, var(--color-text));
			text-decoration: none;
			border-bottom: 1px solid color-mix(in srgb, var(--color-primary) 25%, transparent);
		}

		a:hover {
			border-bottom-color: color-mix(in srgb, var(--color-primary) 55%, transparent);
		}

	}

}
</style>