<script lang="ts">
import Vue, { PropType } from "vue";
import { TIcon, EIcons } from '.'


export default Vue.extend({
	props: {
		type: {
			default: 'home',
			type: String as PropType<TIcon>
		}
	},
	computed: {
		//  iconClass():string{
		// 	return EIcons[this.type]
		//  }
		iconClass: {
			get(): string {
				return EIcons[this.type as TIcon]
			},
			// set(v){

			// }
		}
	}
})
</script>

<template>
	<i class="iconfont icon-container" :class="iconClass" @click="e => $emit('click', e)"></i>
</template>

<style lang="less" scoped>
i {
	color: inherit;
	font-size: inherit;
}
</style>
