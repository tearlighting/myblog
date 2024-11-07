
<script lang="ts">
import Vue from "vue";
import Icon from './index.vue'
import {EIcons,TIcon} from '.'
import {codeStyleMixins} from '@/mixins' 

import Prewiew from '../preview/index.vue'

export default Vue.extend({
	data(){
		return {
			desc:`
type IconType = "home" | "success" | "close" | "error" | "warn" | "info" | "blog" | "code" | "about" 
| "wechat" | "email" | "github" | "qq" | "arrowUp" | "arrowDown" | "empty" | "chat"
interface props {
  type: IconType
}
			`
		}
	},
	components:{
		Icon,
		Prewiew
	},
	computed:{
		icons(){
			const types = Object.keys(EIcons)
			return types.map(t=>{
				return {type:t,label:EIcons[t as TIcon]}
			})
		}
	},
	mixins:[codeStyleMixins]
})
</script>
<template>
<!-- <div class="preview-container"> -->
	<!-- <div class="title">
		Icon
	</div>
	<div class="content">
		  <div class="container">
			<div class="item" v-for="(item,i) of icons" :key="i">
			<Icon  :type="item.type" ></Icon>
			<label >{{item.type}}</label>
			</div>
       </div>
	</div>

  </div> -->
  <Prewiew>
	<template #title>
		Icon
	</template>
	<template #content>
		<div class="container">
			<div class="item" v-for="(item,i) of icons" :key="i">
			<Icon  :type="item.type" ></Icon>
			<label >{{item.type}}</label>
			</div>
       </div>
	</template>
	<template #desc>
     {{desc}}		
	</template>
  </Prewiew>
</template>


<style lang="less" scoped>
.container{
	margin: 0 auto;
	display: flex;
	justify-content: center;
	width:800px;
	flex-wrap: wrap;
	.item{
		display: flex;
		flex-direction: column;
		// text-align: center;
		width: 6em;
		height: 4em;
		// background: aquamarine;
		justify-content: center;
		align-items: center;
		background: aliceblue;
		border-right: 1px solid #999;
		border-bottom: 1px solid #999;
		&:hover{
			cursor: pointer;
		}
	}
	
}
</style>