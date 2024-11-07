<script lang="ts">
import Vue from "vue"
import Preview from '@/components/preview/index.vue'
import Menu from '@/components/Aside/menu/index.vue'
export default Vue.extend({
 components:{
	Preview,
	Menu
 }
})
</script>

<template>

	
		<Preview>
		<template #title>
			 Menu
		</template>
		<template #content>
			<Menu></Menu>
		</template>
		<template #desc></template>
		</Preview>


</template>

<style lang="less" scoped>
.preview-container{
	:deep(.content){
		width: 300px;
		background: black;
	}
}
</style>