<script lang="ts">
import Vue from "vue"
import ArticleItem from "../blog/articleItem.vue";
export default Vue.extend({
	components: {
		ArticleItem
	},
	props: ["content", 'handleClickTitle']
})
</script>

<template>
	<ArticleItem class="project-item-container" v-bind="$props">
	</ArticleItem>
</template>

<style lang="less" scoped>
.project-item-container {
	:deep(ul) {
		li {
			height: 12em;

			.thumb {
				img {
					width: 18em;
					height: 12em;
				}
			}
		}


		.main {

			// h2 {
			// 	font-size: 1em;
			// }

			// .aside {
			// 	transform: translateY(.5em);
			// }

			// .desc {
			// 	font-size: .5em;
			// }
		}

		// background-color: red;
	}
}
</style>