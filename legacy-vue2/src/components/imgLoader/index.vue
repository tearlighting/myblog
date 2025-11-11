<script lang="ts">
import Vue from "vue"
// import props from "./props";

export default Vue.extend({
	data() {
		return {
			loaded: false,
			animationEnd: false
		}
	},
	props: {
		placeholder: {
			type: String,
			default: require(`@/assets/danmati_loading.gif`)
		},
		url: {
			type: String,
			default: 'https://img1.baidu.com/it/u=878394287,117902226&fm=253&fmt=auto&app=138&f=GIF?w=600&h=337'
		},
		duration: {
			type: Number,
			default: 1500
		}
	}, methods: {
		handleLoad() {
			this.loaded = true
			setTimeout(() => {
				this.$emit("loaded")
				this.animationEnd = true
			}, this.duration);
		}
	}

})
</script>

<template>

	<div class="image-loader-container">
		<img v-if="!animationEnd" class="placeholder" :src="placeholder" alt="">
		<img class="origin" :src="url" alt="" @load="handleLoad" :class="{ beforeLoaded: !loaded }"
			@mousemove="e => $emit('mousemove', e)" :style="`transition:${duration}ms`">
	</div>

</template>

<style lang="less" scoped>
@import '~@/style/mixins/index.less';

.image-loader-container {
	width: 100%;
	height: 100%;
	position: relative;

	img {
		.self-fill-float();
		object-fit: cover;

		&.placeholder {
			filter: blur(2px);
			object-position: bottom;
		}

		&.origin {
			opacity: 1;

			&.beforeLoaded {
				opacity: 0;
			}

		}
	}
}
</style>