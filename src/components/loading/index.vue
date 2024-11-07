<script lang="ts">
import Vue from "vue"
import SVGIcon from '@/components/svgIcon/index.vue'

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
export default Vue.extend({
	props: {
		placeholder: {
			default: "loading"
		}
	},
	components: {
		SVGIcon
	},
	computed: {
		icon: () => faSpinner
	}
})
</script>

<template>

	<div class="loading-container">
		<SVGIcon :icon="icon" />
		<div class="tip">{{ placeholder }}</div>


	</div>

</template>

<style lang="less" scoped>
@import '~@/style/mixins/index.less';



.loading-container {
	&::after{
		content: "";
		clear:both;
		overflow: hidden;
		display: block;
	}
	.self-fill-float();
	.self-center-grid();

	.tip {
		padding-top: 1em;
		animation: lineScale 2s infinite;
		transform-origin: bottom;
	}

	.svg-icon-container {
		:deep(svg) {
			animation: circleRotate .7s infinite;
		}
	}

}
</style>