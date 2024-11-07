<script lang="ts">
import Vue from "vue"
import Preview from '@/components/preview/index.vue'
import Layout from './index.vue'
export default Vue.extend({
   components:{
	Preview,
	Layout
   }
})
</script>

<template>

	<Preview>
		<template #title>
			layout
		</template>
		<template #content>
			<div class="layout">
				<Layout/>
			</div>
		</template>
	</Preview>

</template>

<style lang="less" scoped>
.layout{
	width: 1000px;
	height: 600px;
}
</style>