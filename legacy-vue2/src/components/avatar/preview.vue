<script lang="ts">
import Vue from "vue";
import Avatar from '@/components/avatar/index.vue'
import {codeStyleMixins} from '@/mixins' 
import Prewiew from '../preview/index.vue'
export default Vue.extend({
	data(){
		return {
			url:'https://pic.rmb.bdstatic.com/bjh/down/d73323fe1acac8a420c303062bcca9a2.png',
			size:160,
			desc:`
interface props {
  url?: string //img url
  size?: number //img size
}`
		}
	},
	components:{
		Avatar,
		Prewiew
	}
	,mixins:[codeStyleMixins]
})
</script>

<template>
  <Prewiew>
	<template #title>
		Avatar
	</template>
	<template #content>
		<Avatar :url='url' :size='size'></Avatar>
	</template>
	<template #desc>
     {{desc}}		
	</template>
  </Prewiew>
</template>

<style lang="less" scoped>

</style>
