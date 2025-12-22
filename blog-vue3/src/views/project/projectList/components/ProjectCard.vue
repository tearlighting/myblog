<script setup lang="ts">
import SvgIcon from "@/components/SvgIcon/index.vue"
import { EIcons } from "@/constants"
import dayjs from "dayjs"
import type { IProjectCard } from "project"

const props = defineProps<{
	project: IProjectCard
	clickDetail?: () => void
}>()
</script>

<template>
	<article role="project-card" class="size-full rounded-[16px]">
		<div role="project-card__inner" class="size-full grid grid-cols-1 gap-[1.2rem] p-[1.6rem]">
			<!-- 封面（可选） -->
			<div v-if="project.thumb" role="project-cover" class="w-full h-full rounded-[12px] overflow-hidden">
				<img :src="project.thumb" alt="" class="size-full object-cover" />
			</div>

			<!-- 内容 -->
			<div role="project-body" class="flex flex-col gap-[0.6rem]">
				<header role="project-header" class="grid md:grid-cols-[1fr_auto] grid-cols-1">
					<h3 role="project-title"
						class="text-[1.2rem] font-semibold text-text tracking-wide overflow-hidden overflow-ellipsis whitespace-nowrap ">
						{{ project.title }}</h3>
					<div role="project-detail"
						class="text-[0.88rem] text-muted leading-[1.7] max-w-[90%] flex items-center gap-[0.6rem]">
						<span class="flex items-center gap-[0.3rem]">
							<SvgIcon :name="EIcons.Calendar" class="text-xl"></SvgIcon>{{
								dayjs(project.createdAt).format("YYYY") }}
						</span>
						<span class="flex items-center gap-[0.3rem]">
							<SvgIcon :name="EIcons.View" class="text-xl"></SvgIcon> {{ project.scanNumber }}
						</span>
						<span class="flex items-center gap-[0.3rem]">
							<SvgIcon :name="EIcons.Comment" class="text-xl"></SvgIcon>{{ project.commentNumber }}
						</span>
					</div>
				</header>

				<p role="project-desc" class="text-[0.9rem] text-muted leading-[1.6]">
					{{ project.description }}
				</p>
				<ul role="project-tags" class="flex flex-wrap gap-[0.4rem] mt-[0.4rem]">
					<li class="text-[0.75rem] px-[0.6rem] py-[0.2rem] text-muted rounded-full text-center">React</li>
					<li class="text-[0.75rem] px-[0.6rem] py-[0.2rem] text-muted rounded-full">vue</li>
				</ul>
				<!-- CTA -->
				<a role="project-link" @click="clickDetail"
					class="mt-[0.8rem] text-[0.85rem] text-primary decoration-0 self-start hover:underline cursor-pointer">
					View Project → </a>
			</div>
		</div>
	</article>
</template>
<style lang="less" scoped>
@keyframes rise-in {
	from {
		opacity: 0;
		transform: translateY(20px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

[role="project-card"] {
	background: var(--surface-1);
	border: 1px solid var(--divider);
	box-shadow: var(--elevation-1);
	transform-origin: center center;
	transition: transform 0.5s ease, filter 0.5s ease, opacity 0.5s ease;

	&:hover {
		transform: translateY(-6px);
		box-shadow: var(--elevation-2);
		border-color: color-mix(in srgb, var(--color-primary) 40%, var(--divider));
	}

	[role="project-card__inner"] {
		animation: rise-in 0.45s ease both; // both = 保持最终状态
		will-change: transform, opacity;
	}

	/* cover */
	[role="project-cover"] {
		aspect-ratio: 16 / 9;
		background: var(--surface-2);
		filter: saturate(0.9) brightness(0.95);

		&:hover {
			filter: none;
		}
	}

	[role="project-tags"] li {
		background: var(--surface-2);
		border: 1px solid transparent;
		transition: background-color 0.3s ease, border-color 0.3s ease;

		&:hover {
			background: color-mix(in srgb, var(--surface-2) 85%, var(--color-primary));
			border-color: color-mix(in srgb, var(--color-primary) 18%, transparent);
		}
	}
}
</style>
