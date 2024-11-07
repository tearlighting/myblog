<script lang="ts">
import Vue from "vue"
import Preview from '@/components/preview/index.vue'
import Aside from './index.vue'
export default Vue.extend({
  components:{
	Preview,
	Aside
  }
})
</script>

<template>

	<Preview>
       <template #title>Aside</template>
	   <template #content>
		 <div class="aside">
		  <Aside />
		  </div>
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
   .content{
		background: black !important;
		width: 500px;
		display: none !important;

   }
}
</style>