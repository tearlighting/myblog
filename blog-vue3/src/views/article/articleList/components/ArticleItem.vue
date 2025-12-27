<script setup lang="ts">
import SvgIcon from "@/components/SvgIcon/index.vue"
import { EIcons } from "@/constants"
import type { IArticleItem, IArticleTranslation } from "article"
const props = defineProps<{
	item: IArticleItem & IArticleTranslation
	clickTag?: (id: string) => void
}>()

const emit = defineEmits<{
	clickTag: [id: string]
}>()

const heatOpacity = (scan: number) => {
	if (scan > 200) return 1
	if (scan > 100) return 0.6
	if (scan > 50) return 0.4
	return 0.25
}

</script>

<template>
	<div role="article-item-wrapper" class="size-full relative">
		<a role="row-inner" class="flex flex-col gap-[6px] rounded-[10px] no-underline">
			<div role="row-main">
				<h3 role="title" class="text-[0.95rem] font-medium text-text leading-[1.4] tracking-wide">
					{{ item?.title }}
				</h3>
				<p role="desc" class="text-[0.8rem] opacity-0.7 text-muted  mt-1 leading-[1.4]
    lg:leading-1.5
    line-clamp-2
    lg:line-clamp-none
    overflow-hidden
    lg:overflow-visible">
					{{ item?.description }}
				</p>
			</div>

			<div role="row-meta" class="flex gap-[10px] text-[0.72rem] text-muted mt-[6px]">
				<span role="category" @click.stop="emit('clickTag', item.category.id)">
					{{ item.category.name }}
				</span>
				<span class="flex items-center" :style="{ opacity: heatOpacity(item.scanNumber) }">
					<SvgIcon :name="EIcons.View" class="w-[12px] h-[12px] opacity-40 pr-1" />{{ item.scanNumber }}
				</span>
			</div>
		</a>
	</div>
</template>

<style lang="less" scoped>
/* 左侧阅读轨迹线（存在感更强，但不抢） */
.read-line() {
	content: "";
	position: absolute;
	left: 12px;
	top: 14px;
	bottom: 14px;
	width: 2px;
	border-radius: 2px;
	background: color-mix(in srgb, var(--divider) 35%, transparent);
	opacity: 0.4;
	transition: background 0.25s ease, opacity 0.25s ease, box-shadow 0.25s ease;
}

[role="article-item-wrapper"] {
	position: relative;

	[role="row-inner"] {
		position: relative;
		padding: 14px 22px 14px 28px;
		border-radius: 12px;

		/* 用 inset shadow 制造“玻璃厚度” */
		background: transparent;
		transition: background 0.22s ease, transform 0.14s ease-out;

		&::before {
			.read-line();
		}

		&:hover {
			cursor: pointer;
			transform: translateX(2px);
			background: color-mix(in srgb, var(--surface-1) 8%, transparent);
			box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--divider) 45%, transparent), 0 6px 20px color-mix(in srgb, var(--color-primary) 8%, transparent);

			&::before {
				background: color-mix(in srgb, var(--color-primary) 70%, transparent);
				opacity: 0.9;
				box-shadow: 0 0 12px color-mix(in srgb, var(--color-primary) 35%, transparent);
			}
		}

		/* title 稍微前景化 */
		[role="title"] {
			transition: color 0.2s ease;
		}

		&:hover [role="title"] {
			color: color-mix(in srgb, var(--color-text) 90%, var(--color-primary));
		}

		/* meta 信息：压进玻璃 */
		[role="row-meta"] {
			opacity: 0.75;
			filter: saturate(0.85);
			transition: opacity 0.2s ease;

			[role="category"] {
				color: color-mix(in srgb, var(--color-primary) 65%, var(--color-text));
				transition: color 0.15s ease, opacity 0.15s ease;
				opacity: 0.85;

				&:hover {
					color: color-mix(in srgb, var(--color-primary) 85%, var(--color-text));
					opacity: 1;
					text-decoration: underline;
				}
			}
		}

		&:hover [role="row-meta"] {
			opacity: 0.9;
		}
	}
}
</style>
