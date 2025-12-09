<script setup lang="ts">
import { usePageHostStore } from '@/store';
import { ElButton } from 'element-plus'
import PageLoader from '@/components/PageLoader/index.vue';
import { useHomeStore } from './store';
import { initializer } from './initializer';

defineOptions({
	name: 'test'
})
const { scrollBottom, scrollTop } = usePageHostStore()
</script>

<template>
	<PageLoader :use-store="useHomeStore" :initializer="initializer">
		<div class="flex justify-center items-center fixed	 top-10 right-0">
			<el-button @click="scrollTop">top</el-button>
			<el-button @click="scrollBottom">bottom</el-button>
		</div>

		<div role="home-container" class="h-[200vh] bg-amber-200">123
		</div>
	</PageLoader>

</template>

<style lang="less" scoped></style>
