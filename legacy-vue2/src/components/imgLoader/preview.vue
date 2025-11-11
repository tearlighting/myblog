

<script lang="ts">
import Vue from 'vue'
import Preview from '../preview/index.vue'
import ImageLoader from './index.vue'
export default Vue.extend({
	 components:{
		Preview,
		ImageLoader
	 },methods:{
		loaded(){
			// alert('加载完成')
		}
	 },
	 data(){
		return {
			url:'https://img1.baidu.com/it/u=878394287,117902226&fm=253&fmt=auto&app=138&f=GIF?w=600&h=337',
			duration:5000,
			placeholder:require("@/assets/danmati_loading.gif")
		}
	 }
})
</script>

<template>
    <Preview>
		<template #title>
			ImageLoader
		</template>
		<template #content>
			<ImageLoader @loaded='loaded' :duration="duration" :url="url" :placeholder="placeholder"/>
		</template>
		<template #desc>

		</template>
	</Preview>
</template>

<style lang="less" scoped>
.preview-container{
	:deep(.content){
		width: 400px;
		height: 300px;
	}
}
</style>
