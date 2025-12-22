<script lang="ts" setup>
import { useRoute } from 'vue-router';
import PageLoader from '@/components/PageLoader/index.vue';
import { initializer } from './initializer';
import { useProjectDetailStore } from './store';
import Detail from './components/Detail.vue';
const { params } = useRoute();
const id = params.id;

</script>

<template>
	<PageLoader :payload="{ id }" :initializer="initializer" :use-store="useProjectDetailStore">
		<div role="project-detail" class="size-full grid grid-cols-[1fr_200px]">
			<Detail></Detail>
		</div>
	</PageLoader>
</template>