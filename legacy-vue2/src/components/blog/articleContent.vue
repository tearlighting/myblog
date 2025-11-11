<template>
	<div class="blog-detail-container" v-if="article" v-on='$listeners'>
		<h1>{{ article.title }}</h1>
		<div class="aside">
			<span>
				<SvgIcon :icon="date" />: {{ formatDate(article.createDate) }}
			</span>
			<span>
				<SvgIcon :icon="view" />: {{ article.scanNumber }}
			</span>
			<a href="">
				<SvgIcon :icon="comment" />: {{ article.commentNumber }}
			</a>
			<a href="" v-if="article?.category">{{ article.category.name }}</a>
		</div>
		<div v-html="article.htmlContent" class="markdown-body"></div>
	</div>
</template>

<script lang="ts">
import { IDetailArticle } from 'blog'
import { formatDate } from '@/utils'
import { codeStyleMixins } from "@/mixins"
import Vue, { nextTick } from 'vue'
import { highlightAll } from 'prismjs';
import { faCalendar, faComment, faEye } from '@fortawesome/free-regular-svg-icons';

import SvgIcon from '@/components/svgIcon/index.vue'

export default Vue.extend({
	props: {
		article: {
			default: () => null as IDetailArticle
		},
	},

	mixins: [codeStyleMixins],
	methods: {
		formatDate,
		// handleWheel() {
		// 	// console.log("ww");
		// 	// console.log(this.$eventBus);
		// 	this.$eventBus.emit("contentScroll")
		// }
	},
	components: {
		SvgIcon
	},
	watch: {
		'article.htmlContent': {
			handler(n) {
				// console.log(n);

				n && nextTick().then(() => {
					// console.log(this.$el.querySelector('iframe'));
					highlightAll()
				})

			},
			immediate: true
		}
	},
	computed: {
		date: () => faCalendar,
		view: () => faEye,
		comment: () => faComment
	}


})
</script>

<style scoped lang="less">
.blog-detail-container {
	.aside {

		span,
		a {
			margin-right: 1em;
		}

		.svg-icon-container {
			display: inline;

			text-align: center;

			:deep(.fa-calendar) {
				transform: translateY(-1px);
				// background-color: red;

			}

		}
	}

	.markdown-body {
		margin: 2em 0;
	}
}
</style>