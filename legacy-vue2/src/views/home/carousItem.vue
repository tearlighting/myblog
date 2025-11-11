<script lang="ts">
import Vue from "vue"
import ImgageLoader from '@/components/imgLoader/index.vue'
import { IImgLoaderProps } from '@/components/imgLoader/props'
import useDomWidthTransition from "@/hooks/useDomWidthTransition";
//这东西居然会每次都不是新的，去你丫的optionAPI
// const [mountTitle, startTitle] = useDomWidthTransition()
// const [mountDescription, startDescription] = useDomWidthTransition()
export default Vue.extend({
	data() {
		return {
			imgPosition: {
				left: 0,
				top: 0
			}
			,
			titleSetter: useDomWidthTransition(),
			descriptionSetter: useDomWidthTransition()
		}
	},
	props: {
		imgLoaderProps: {
			default: () => ({ duration: 5000 } as IImgLoaderProps)
		},
		title: {
			type: String,
			default: 'title'
		},
		description: {
			type: String,
			default: 'description'
		},
		imgScale: {
			default: () => ({ x: 1.1, y: 1.1 })
		}
	},
	components: {
		ImgageLoader
	},
	mounted() {
		this.getContentDoms()
	},
	methods: {
		handleLoaded() {
			const renderTitleTime = 3000
			this.titleSetter.start({
				duration: renderTitleTime
			})
			// startDescription({
			// 	wait: renderTitleTime,
			// 	duration: renderTitleTime * 2
			// })
			this.descriptionSetter.start(
				{
					wait: renderTitleTime,
					duration: renderTitleTime * 2
				}
			)
		},
		getContentDoms() {
			const title = this.$refs.title as HTMLElement
			const description = this.$refs.description as HTMLElement
			this.titleSetter.mount(title)
			this.descriptionSetter.mount(description)
		},
		// getImgContainerDom(){
		//    const imgContainer = this.$refs.imgContainer as HTMLElement

		// },
		hanldeMouseMove(e: MouseEvent) {

			const react = (this.$refs.imgContainer as HTMLElement).getBoundingClientRect()
			const mouseY = e.clientY - react.top
			const mouseX = e.clientX - react.left


			const deltX = (this.imgScale.x - 1) * react.width
			const deltY = (this.imgScale.y - 1) * react.height
			//-△x*x/width
			const left = -deltX * mouseX / react.width + deltX / 2
			const top = -deltY * mouseY / react.height + deltY / 2

			this.imgPosition = {
				left: Math.min(left, deltX)
				, top: Math.min(top, deltY)
			}
			// console.log(this.imgPosition);



		}
	},
	computed: {
		imgStyle(): string {
			return `transform: translate(${this.imgPosition.left}px,${this.imgPosition.top}px)  scale(${this.imgScale.x, this.imgScale.y});`
		}
	}
})
</script>

<template>
	<!-- @mousemove="hanldeMouseMove"  -->
	<div class="carousItem-container" ref="imgContainer" @mousemove="hanldeMouseMove">
		<ImgageLoader v-bind="imgLoaderProps" @loaded="handleLoaded" :style="imgStyle" />
		<div class="content">
			<title class="title" ref="title">
				{{ title }}
			</title>
			<title class="description" ref="description">
				{{ description }}
			</title>
		</div>
	</div>

</template>

<style lang="less" scoped>
.carousItem-container {
	height: 100%;
	position: relative;
	overflow: hidden;

	.image-loader-container {
		transition: 0.2s;
		width: 100%;
		height: 100%;
	}

	.content {

		position: absolute;
		z-index: 1000;
		color: lighten(#999, 50%);
		left: 2rem;
		top: 50%;
		transform: translateY(-50%);
		@distance: 2px;
		text-shadow: @distance 0 0 rgba(0, 0, 0, .5), -@distance 0 0 rgba(0, 0, 0, .5), 0 @distance 0 rgba(0, 0, 0, .5), 0 -@distance 0 rgba(0, 0, 0, .5);

		transition: 1ms 1s;

		.title {
			display: block;
			font-size: 2rem;
		}

		.description {
			font-size: 1.2rem;
			margin-top: 1rem;
			// transform: translateX(2em);
			margin-left: 2em;
			display: block;
		}

		.title,
		.description {
			width: fit-content;
			opacity: 0;
			text-wrap: nowrap;


			&:hover {
				cursor: pointer;
				transform: scale(1.1);

			}
		}


	}

}
</style>