<script lang="ts">
import Vue from "vue"
import Contact from './index.vue'
import Prewview from '@/components/preview/index.vue'
export default Vue.extend({
   components:{
	Contact,
	Prewview
   }
})
</script>

<template>

	<Prewview>
		<template #title>Contact</template>
		<template #content>
			<Contact />
		</template>
		<template #desc></template>	
	</Prewview>

</template>

<style lang="less" scoped>
.preview-container{
	:deep(.content){
        width: 400px;
    	height: 300px;
		background-color: black;
		
	}
	
}
</style>