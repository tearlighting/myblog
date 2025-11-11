

<script lang="ts">
import Vue from 'vue'
import Empty from './index.vue'
import Preview from '../preview/index.vue'
export default Vue.extend({
	components:{
		Empty,
		Preview
	}
})
</script>

<template>
  <Preview>
	<template #title>
		Empty
	</template>
	<template #content>
		
          <Empty />
		
		
	</template>
  </Preview>
</template>
<style lang='less' scoped>

.preview-container{
     
	:deep(.content){
        width: 300px;
	    height: 300px;
	    background: aliceblue;

	}
}
</style>