<script setup lang="ts">
import dayjs from 'dayjs';
import type { IProjectCard } from "project"
import SvgIcon from '@/components/SvgIcon/index.vue'
import { EIcons } from '@/constants';

const props = defineProps<{
	project: IProjectCard
}>()



</script>

<template>
	<article role="project-card" class=" w-[60%] h-[80%]  grid  grid-cols-1 gap-[1.2rem] p-[1.6rem] rounded-[16px]">
		<!-- 封面（可选） -->
		<div v-if="project.thumb" role="project-cover" class=" w-full h-full rounded-[12px] overflow-hidden">
			<img :src="project.thumb" alt="" class="size-full object-cover" />
		</div>

		<!-- 内容 -->
		<div role="project-body" class="flex flex-col gap-[0.6rem]">
			<header role="project-header" class="flex items-baseline justify-between">
				<h3 role="project-title" class="text-[1.15rem] font-semibold text-text">{{ project.title }}</h3>
				<div role="project-detail" class="text-[0.85rem] text-muted flex items-center gap-[0.6rem]">
					<span class="flex items-center gap-[0.3rem]">
						<SvgIcon :name="EIcons.Calendar" class="text-xl"></SvgIcon>{{
							dayjs(project.createdAt).format('YYYY') }}
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
				<li class="text-[0.75rem] px-[0.55rem] py-[0.2rem] text-muted rounded-full	">
					React
				</li>
				<li class="text-[0.75rem] px-[0.55rem] py-[0.2rem] text-muted rounded-full">
					vue
				</li>
			</ul>
			<!-- CTA -->
			<a role="project-link"
				class=" mt-[0.8rem] text-[0.85rem] text-primary decoration-0 self-start hover:underline cursor-pointer">
				View Project →
			</a>
		</div>
	</article>
</template>
<style lang="less" scoped>
[role="project-card"] {
	background: var(--surface-1);
	border: 1px solid var(--divider);
	box-shadow: var(--elevation-1);
	transition:
		transform 0.3s ease,
		box-shadow 0.3s ease,
		border-color 0.3s ease;

	&:hover {
		transform: translateY(-6px);
		box-shadow: var(--elevation-2);
		border-color: color-mix(in srgb,
				var(--color-primary) 40%,
				var(--divider));
	}

	/* cover */
	[role="project-cover"] {
		aspect-ratio: 16 / 9;
		background: var(--surface-2);
	}

	[role="project-tags"] li {

		background: var(--surface-2);

	}

}
</style>
