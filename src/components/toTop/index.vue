<script lang="ts">
import Vue from "vue"
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import SVGIcon from "@/components/svgIcon/index.vue"
import { E2TopEvent, EMyBlogMainScrollEvent } from "@/eventBus";
export default Vue.extend({
	computed: {
		icon: () => faAngleUp
	},
	components: {
		SVGIcon
	},

	mounted() {
		this.$eventBus.on(E2TopEvent.show2Top, () => {
			this.show = true
		})
		this.$eventBus.on(E2TopEvent.hide2Top, () => {
			this.show = false
		})
	},
	methods: {
		toTop() {
			this.$eventBus.emit(EMyBlogMainScrollEvent.mainScroll2Top)
		}
	},
	data() {
		return {
			show: false
		}
	}

})
</script>

<template>

	<div class="to-top-container" v-show="show" @click="toTop">
		<SVGIcon :icon="icon" />
	</div>

</template>

<style lang="less" scoped>
.to-top-container {
	z-index: 1000;
	position: fixed;
	right: 2em;
	bottom: 2em;
	font-size: 2em;
	padding: .3em;
	border-radius: .2em;

}
</style>