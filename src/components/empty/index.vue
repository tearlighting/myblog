<template>
   <div class="empty-container">
       
		  <Icon type="empty" />
          <p>{{text}}</p>
	 
   </div>
  
</template>

<script lang="ts">

import Vue from 'vue'
import Icon from '../icon/index.vue'
export default Vue.extend({
	props:{
		text:{
			type: String,
			default:'无数据'
		}
	},
	components:{
		Icon
	}
})
</script>

<style lang='less' scoped>
@import '~@/style/mixins/index.less';
.empty-container{

//    .self-center-position();
//    .self-center-flex(column);
.self-center-grid();
	text-align: center;
	.icon-container{
		font-size: 40px;
	}
}

</style>