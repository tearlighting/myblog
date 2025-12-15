<script lang="ts" setup>
import PageLoader from "@/components/PageLoader/index.vue"
import { useProjectStore } from './store';
import { initializer } from './initializer'
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import ProjectCard from "./components/ProjectCard.vue"
const enum EProject {
	limit = 10
}
const { query } = useRoute()
const routeInfo = computed(() => {
	const { page = 1, limit = EProject.limit } = query
	return {
		page: Number(page),
		limit: Number(limit)
	}
})

const { projectListStore: { projects } } = useProjectStore()

const item = computed(() => {
	const item = projects[0]
	return {
		...item,
		...item.translations.find(x => x.lang === 'zh')
	}
})

</script>

<template>
	<PageLoader :use-store="useProjectStore" :initializer="initializer" :payload="routeInfo">
		<div role="projects-wrapper" class="grid grid-cols-1 items-center">
			<ProjectCard :project="item" />
		</div>
	</PageLoader>
</template>