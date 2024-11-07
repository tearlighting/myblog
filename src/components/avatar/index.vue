<script lang="ts">
import Vue,{PropType} from "vue";

export default Vue.extend({
   props:{
	 url:{
		// required: true,
		type: String,
		default:'https://pic.rmb.bdstatic.com/bjh/down/d73323fe1acac8a420c303062bcca9a2.png'
	 },
	 size:{
		type:Number,
		default:150
	 }
   },
  

})
</script>

<template>
	<div class="avater-container">
		<img class="avatar-img" :src="url" alt="" srcset="" :style="{
			width: size+'px',
			height: size+'px'
		}">
	</div>
</template>

<style lang="less" scoped>
.avater-container{
	// text-align: center;
    .avatar-img{
		border-radius: 50%;
		object-fit: cover;
		display: block;
		margin: 0 auto;
		
		transition: .3s ease-in;
		&:hover{
			transform: rotate(1turn);
		}
	}
	
}
</style>
