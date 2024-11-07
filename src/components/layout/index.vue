<script lang="ts">
import Vue from "vue"
export default Vue.extend({

})
</script>

<template>

	<div class="layout-container">
		<div class="layout-left">
			<slot name="left">
				<!-- left -->
			</slot>
		</div>
		<div class="layout-center">
			<div class="layout-conter-line">
				<slot name="centerLine1">
					<!-- line1 -->
				</slot>
			</div>
			<div class="layout-conter-line">
				<slot name="centerLine2">
					<!-- line2 -->
				</slot>
			</div>
			<div class="layout-conter-line">
				<slot name="centerLine3">
					<!-- line3 -->
				</slot>
			</div>
			<div class="layout-conter-cneter">
				<slot>center</slot>
			</div>
		</div>
		<div class="layout-right">
			<slot name='right'>
				<!-- right -->
			</slot>
		</div>
	</div>

</template>

<style lang="less" scoped>
.layout-container {
	width: 100%;
	height: 100%;
	display: flex;

	.sized-by-chlid() {
		flex-shrink: 0;
		flex-grow: 0;
		// overflow-x: hidden;
		// overflow-y:visible;
	}

	.layout-left,
	.layout-right {
		.sized-by-chlid()
	}

	.layout-center {

		flex: 1;
		display: flex;
		overflow: hidden;
		flex-flow: column nowrap;

		.layout-conter-line {
			.sized-by-chlid()
		}

		.layout-conter-cneter {
			flex: 1;
			// max-height: 100%;
			overflow: hidden;
		}

	}


}
</style>