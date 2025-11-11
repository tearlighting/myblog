<script lang="ts">
import Vue from "vue"
export default Vue.extend({

})
</script>

<template>

	<div class="tag-container" @click="$emit(`click`,$event)">
		<div class="tag-header">
			<slot name="header"></slot>
		</div>
		<div class="tag-content">
			<slot>tag content</slot>
		</div>
		
		<div class="tag-footer">
			<slot name="footer"></slot>
		</div>
		
	</div>

</template>

<style lang="less" scoped>
.tag-container{
	font-size: inherit;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
	border: 1px solid lightgray;
	padding: 0 .5rem;
	background-color: inherit;
	.tag-content{
		flex: 1;
		margin: 0 0.3rem;
		text-align: center;
	}
	
	&:hover{
		cursor: pointer;
		scale: 1.01;
	}
}
</style>