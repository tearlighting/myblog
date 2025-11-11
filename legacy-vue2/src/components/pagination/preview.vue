<script lang="ts">
import Vue from "vue";
import Avatar from '@/components/avatar/index.vue'
import Icon from '@/components/icon/index.vue'
import Pagination from '@/components/pagination/index.vue'
import {codeStyleMixins} from '@/mixins' 

import Prewiew from '../preview/index.vue'

export default Vue.extend({
	data(){
		return {
			paginationData:{
				total:100,
				current:1
			},
			desc:
`
interface props {
  current: number
  pageSize?: number
  total: number
  //可以显示的页面数量
  visibleNumber?: number
}

interface emit {
  pageChange: (page: number) => void
}
`
		}
	},
	components: {
		Pagination,
		Prewiew
	}, methods: {
		
		pageChange(page:number){
           this.paginationData.current = page
		}
	},
	mixins:[codeStyleMixins]
})
</script>

<template>
	<!-- <div class="preview-container">
		
		<title class="title">
			pagination
		</title>
		<Pagination :total="paginationData.total" :current="paginationData.current"
		@pageChange='pageChange'></Pagination>
	</div> -->
	<Prewiew>
		<template #title>
			pagination
		</template>
		<template #content>
			<Pagination :total="paginationData.total" :current="paginationData.current"
		@pageChange='pageChange'></Pagination>
		</template>
		<template #desc>
{{desc}}
		</template>
	</Prewiew>
</template>

<style lang="less" scoped>

</style>
