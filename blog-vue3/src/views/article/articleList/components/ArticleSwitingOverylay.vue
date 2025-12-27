<script lang="ts" setup>
import { useThemeStore } from '@/store';
import clsx from 'clsx';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';


interface IProps {
	switching: boolean
}
defineProps<IProps>()
const { currentTheme } = storeToRefs(useThemeStore())
const isLightTheme = computed(() => {
	const themes: Array<typeof currentTheme.value> = ["sakura", "sunset", "mono"]
	return themes.includes(currentTheme.value)
})
</script>

<template>
	<div role="article-switch-overlay-wrapper" class="article-switch-overlay"
		:class="clsx(switching && 'is-active', isLightTheme && 'light')">
		<div class="overlay-inner">
			<span class="spinner self-end" />
			<span class="label self-start">Updating</span>
		</div>
	</div>
</template>
<style lang="less" s>
.article-switch-overlay {
	position: absolute;
	inset: 0;
	z-index: -1;
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.25s ease;

	&.is-active {
		z-index: 2;

		pointer-events: auto;
		opacity: 1;

		&.light {
			opacity: 0.99;
		}
	}

	/* 背景层：玻璃但不糊 */
	&::before {
		content: "";
		position: absolute;
		inset: 0;
		background:
			linear-gradient(to bottom,
				color-mix(in srgb, var(--surface-1) 55%, transparent),
				color-mix(in srgb, var(--surface-1) 25%, transparent));
		backdrop-filter: blur(10px) saturate(1.05);
	}
}

.overlay-inner {
	position: relative;
	height: 100%;
	display: grid;
	place-items: center;
	gap: 10px;
	color: var(--color-text);
	font-size: 0.75rem;
	letter-spacing: 0.08em;
	opacity: 0.85;
}

/* 一个非常克制的 spinner */
.spinner {
	width: 18px;
	height: 18px;
	border-radius: 50%;
	border: 1.5px solid color-mix(in srgb, var(--color-primary) 25%, transparent);
	border-top-color: var(--color-primary);
	animation: spin 0.9s linear infinite;
}

.label {
	font-size: 0.7rem;
	opacity: 0.6;
	user-select: none;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>