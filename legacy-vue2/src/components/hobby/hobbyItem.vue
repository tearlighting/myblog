<script lang="ts">
import Vue from "vue"
import ArticleItem from "../blog/articleItem.vue";
import SvgIcon from '@/components/svgIcon/index.vue'
import { faPlay } from "@fortawesome/free-solid-svg-icons";

export default Vue.extend({
	components: {
		ArticleItem,
		SvgIcon
	},
	props: ["content"],

	computed: {
		play: () => faPlay
	},
})
</script>

<template>

	<ArticleItem class="hobby-item-container" v-bind="$props">
		<template #thumbCover>
			<div class="thumb-cover">
				<SvgIcon :icon="play" @click="e => $emit('playMusic', content, e)" />
			</div>

		</template>
	</ArticleItem>

</template>

<style lang="less" scoped>
.hobby-item-container {
	:deep(ul) {
		li {
			height: 4em;

			&:hover {
				.thumb {
					.thumb-cover {
						visibility: visible;
					}

					.svg-icon-container {
						opacity: 1 !important;
						color: rgba(51, 220, 113, 0.8);

					}
				}

				background-color: rgba(159, 159, 162, 0.1);

			}

			.thumb {
				img {
					width: 6em;
				}

				.thumb-cover {
					position: absolute;
					left: 0;
					top: 0;
					// display: block;
					width: 100%;
					height: 100%;
					background-color: rgba(0, 0, 59, 0.4);
					display: flex;
					justify-content: center;
					align-items: center;
					visibility: hidden;

					.svg-icon-container {
						height: fit-content;
						font-size: 1.3em;
						opacity: 0;
					}

				}
			}

			.main {

				h2 {
					font-size: 1em;
				}

				.aside {
					transform: translateY(.5em);
				}

				.desc {
					font-size: .5em;
				}
			}

			// background-color: red;
		}
	}

}
</style>