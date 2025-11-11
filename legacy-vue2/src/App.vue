<template>
	<div id="app">
		<router-view></router-view>
		<ToTop />
	</div>
</template>
<script lang="ts">
import Vue from 'vue'
import ToTop from '@/components/toTop/index.vue'
export default Vue.extend({
	components: {
		ToTop
	}
})
</script>

<style lang="less" scoped></style>
