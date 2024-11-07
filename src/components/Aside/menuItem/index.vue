<script lang="ts">
import Vue from "vue"
export default Vue.extend({
   components:{
	
   },
   methods:{
	  handleClick(){
		// console.log("click");
		this.$emit('click')
		
	  }
   }
})
</script>

<template>

	<div class="menu-item-container">
			<li class="item" @click="handleClick">
				<div class="icon">
					<slot name='header'>
                        <!-- <Icon type='wechat'/> -->
					</slot>
				</div>
			    <span class="item-content">
					<slot>name</slot>
				</span>
			</li>
	</div>

</template>

<style lang="less" scoped>
.menu-item-container{
	width: 100%;
.item{
	display: flex;
	padding: 1em;
	width: 100%;
	box-sizing: border-box;
	align-items: center;
	.icon{
		width: 3rem;
		font-size: 26px;
		text-align: center;
	}
	.item-content{
		text-align: center;
		height: 100%;
	}
	&:hover{
		cursor: pointer;
	}

}
	:deep(.item-tooltip){
		box-sizing: border-box;
		padding: .5em;

		width: 200px ;
		height: 200px;
        border-radius: .5em;

	}
}
</style>