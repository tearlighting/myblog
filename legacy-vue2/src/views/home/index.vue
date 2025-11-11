<script lang="ts">
import Vue, { nextTick, ref } from "vue"
import Icon from "@/components/icon/index.vue"
import { TIcon } from "@/components/icon"
import CarouselItem from './carousItem.vue'
import { log } from 'console'
import useWheelHandler, { EWheel } from "@/hooks/useWheelHandler"
import { HomeApi } from "@/api"
import { IBannerItem } from 'home'
import { debonce } from "@/utils"

const { wheelHandler, wheelOver, onWheelDown, onWheelUp } = useWheelHandler()

const debonceWheelHandler = debonce(wheelHandler, 1)
export default Vue.extend({
	data() {
		return {
			banners: [] as IBannerItem[],
			currentIndex: null,
			dynammicRenderControl: {} as Record<number, boolean>

		}
	},
	components: {
		Icon,
		CarouselItem
	},
	created() {
		HomeApi.getBanners().then(data => {
			// console.log(data);
			if (data?.data.length) {
				this.banners = data.data
				this.dynammicRenderControl = Object.fromEntries(this.banners.map((v, i) => [i, false]))
				this.currentIndex = 0
			}
		})

		onWheelDown(() => {
			if (this.currentIndex < this.banners.length - 1) {
				this.currentIndex++
			} else {
				wheelOver()
			}
		})
		onWheelUp(() => {
			if (this.currentIndex > 0) {
				this.currentIndex--
			} else {
				wheelOver()
			}
		})
	},


	// mounted() {
	// 	const banners = this.$refs.banners as HTMLElement
	// 	if (banners) {
	// 		this.carouselHeight = banners.clientHeight
	// 		banners.style
	// 	}

	// },
	methods: {
		handleWheel(event: WheelEvent) {

			debonceWheelHandler({ event })
		},
		//一次滚动结束，可以开始新的了
		handleWheelOver(e: TransitionEvent) {
			if (e.propertyName === 'transform')
				wheelOver()

		}
	},
	computed: {
		arrowUp: () => "arrowUp",
		arrowDown: () => "arrowDown",
		bannerStyle(): string {
			return `transform:` + `translateY(-${this.currentIndex * 100}%);`
		},
		loading(): boolean {
			return !this.banners.length
		}
	},
	watch: {
		currentIndex: {
			handler(n) {
				if (n in this.dynammicRenderControl) {
					!this.dynammicRenderControl[n] && Reflect.set(this.dynammicRenderControl, n, true)
				}
			}
		}
	}
})
</script>

<template>

	<div class="home-container" @wheel="handleWheel" v-loading="loading">
		<ul class="banner-container" ref="banners" :style="bannerStyle" @transitionend.self="handleWheelOver">
			<template v-for="item, index of banners">
				<li v-if="dynammicRenderControl[index]" :key="item.id">
					<CarouselItem :imgLoaderProps="{ duration: 3000, url: item.bigImg }" :title="item.title"
						:description="item.description"></CarouselItem>

				</li>
			</template>
		</ul>

		<template>
			<div class="arrow-up arrow" v-show="currentIndex > 0">
				<Icon :type="arrowUp" @click="currentIndex--" />
			</div>
			<div class="arrow-down arrow" v-show="currentIndex < banners.length - 1">
				<Icon :type="arrowDown" @click="currentIndex++" />
			</div>
		</template>

		<template>
			<ul class="indicator">
				<li v-for="item, index of banners" :key="item.id" :class="{ active: index === currentIndex }"
					@click="currentIndex = index"></li>
			</ul>
		</template>
	</div>

</template>

<style lang="less" scoped>
@import "~@/style/mixins/index.less";

.home-container {
	background: transparent;
	width: 100%;
	height: 100%;
	position: relative;
	overflow: hidden;

	// width: 500px;
	// height: 400px;
	// overflow: visible;
	// border: 1px solid antiquewhite;
	// margin: 100px;

	.banner-container {

		height: 100%;
		transition: 1s;

		li {
			height: 100%;
		}
	}

	.arrow {
		font-size: 2em;
		.self-center-position();

		&:hover {
			scale: 1.1;
			cursor: pointer;
		}

		&-up {
			transform: translateX(-50%);
			top: .5em;
			animation: jump-up 2s infinite;
		}

		&-down {
			transform: translateX(-50%);
			top: initial;
			bottom: .5em;
			animation: jump-down 2s infinite;
		}

		@keyframes jump-up {
			0% {
				transform: translate(-50%, .2em);
			}

			50% {
				transform: translate(-50%, -.2em);
			}

			100% {
				transform: translate(-50%, .2em);
				;
			}
		}

		@keyframes jump-down {
			0% {
				ransform: translate(-50%, -.2em);
			}

			50% {
				transform: translate(-50%, .2em);
			}

			100% {
				ransform: translate(-50%, -.2em);
			}
		}
	}

	.indicator {
		.self-center-position();
		left: auto;
		right: .5em;

		li {
			width: .4em;
			height: .4em;
			border-radius: 50%;
			// background: red;
			margin-top: .5em;

			&:hover {
				cursor: pointer;
				scale: 1.1;
			}
		}
	}
}
</style>