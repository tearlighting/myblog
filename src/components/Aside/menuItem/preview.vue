<script lang="ts">
import Vue from "vue"
import MenuItem from './index.vue'
import Preview from '@/components/preview/index.vue'
export default Vue.extend({
   components:{
	 MenuItem,
	 Preview
   }
})
</script>

<template>
    <Preview>

		<template #title>
			MenuItem
		</template>
		<template #content>
			 <MenuItem />
		</template>
		<template #desc>

		</template>

	</Preview>
</template>

<style lang="less" scoped>
.preview-container{
	:deep(.content){
		background: black;
		width: 300px;
	}
}
</style>