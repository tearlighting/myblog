<template>
	<div class="blog-list-container">
		<ul>
			<li>
				<div class="thumb">
					<a href="" @click="e => e.preventDefault()">
						<img v-lazyImg='content.thumb || require("@/assets/ais.jpg")' :alt="content.title"
							:title="content.title" />
					</a>
					<slot name="thumbCover">
						<div class="thumb-cover"></div>
					</slot>
				</div>
				<div class="main">
					<a>
						<h2 @click="handleClickTitle(content.id)">{{ content.title }}</h2>
					</a>
					<div class="aside">
						<span>
							<SvgIcon :icon="date" />: {{ content.createDate }}
						</span>
						<span>
							<SvgIcon :icon="view" />: {{ content.scanNumber }}
						</span>
						<span>
							<SvgIcon :icon="comment" />: {{ content.commentNumber }}
						</span>
						<a class="category" v-if="content?.category"
							@click="e => $emit('categoryChange', content.category)"> {{
								content.category.name
							}}</a>
					</div>
					<div class="desc">
						{{ content.description }}
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>
<script lang="ts">
import Vue from 'vue'
import type { IArticleItem } from 'blog'
import SvgIcon from '@/components/svgIcon/index.vue'

import { faEye, faCalendar, faComment } from '@fortawesome/free-regular-svg-icons';
import { icon } from '@fortawesome/fontawesome-svg-core';
const res = Vue.extend({
	props: {
		content: {
			default: () => ({
				id: '123',
				thumb: '',
				title: '回书义常且音',
				createDate: '2009-8-29',
				scanNumber: 2278,
				commentNumber: 78,
				category: {
					id: '1',
					name: '分类1'
				},
				description: '同空能京南进安西完再支风飞严领光。得生这局月确位军们离存电。热建子光验复更度合确验前切声。'

			} as Partial<IArticleItem>)
		},
		handleClickTitle: {
			default: () => ((id: string) => {

			})
		}
	},
	components: {
		SvgIcon
	},
	computed: {
		date: () => faCalendar,
		view: () => faEye,
		comment: () => faComment
	}

})

export default res
</script>

<style scoped lang="less">
.svg-icon-container {
	display: inline;
	font-size: 12px;
	text-align: center;

	:deep(.fa-calendar) {
		transform: translateY(-1px);
		// background-color: red;

	}

}

.blog-list-container {
	// line-height: 1.7;
	// position: relative;
	padding: 20px;
	overflow-y: auto;
	width: 100%;
	// height: 100%;
	box-sizing: border-box;


	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
}

li {
	display: flex;
	padding: 15px 0;
	// border-bottom: 1px solid @gray;
	height: 7em;


	.thumb {
		flex: 0 0 auto;
		margin-right: 15px;
		height: 100%;
		position: relative;

		.thumb-cover {
			display: none;
		}

		a {
			display: block;
			height: 100%;
		}

		img {
			display: block;
			width: 200px;
			height: 100%;
			object-fit: contain;
			border-radius: 5px;

		}
	}

	.main {
		flex: 1 1 auto;

		h2 {
			margin: 0;
			cursor: pointer;
		}
	}

	.aside {
		font-size: 12px;


		span {
			margin-right: 15px;
		}

		.category {
			cursor: pointer;
		}
	}

	.desc {
		margin: 15px 0;
		font-size: 14px;
	}
}
</style>