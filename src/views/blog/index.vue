<script lang="ts">
import Vue from "vue"
import LayOut from '@/components/layout/index.vue'
import BlogMenu from "@/components/blog/blogMenu.vue";
import { IArticleItem, IArticles, IBlogCategory, IMenuTree } from "blog";
import Pagination from '@/components/pagination/index.vue'

import ArticleItem from '@/components/blog/articleItem.vue';
import { BlogApi } from '@/api';
import { createMainScrollerControl, createRequestMixins, createToTopControl } from '@/mixins'
import { E2TopEvent, EMyBlogMainScrollEvent } from "@/eventBus";
import { i18n } from "@/plugins/i18n";

enum EMixinsData {
	articles = 'articles',
	blogMenu = "blogMenu"
}
const PAGESIZE = 10

export default Vue.extend({
	data() {
		return {
			paginationData: {
				total: 0,
				current: 1,
				pageSize: PAGESIZE
			},
		}
	},

	components: {
		LayOut,
		BlogMenu,
		Pagination,
		ArticleItem
	}, methods: {
		blogCategoryChange(item: IBlogCategory) {
			// console.log(item);
			// if(){}
			if (+item.id === this.routeInfo.id) {
				return
			}
			if (+item.id === -1) {
				this.$router.push({
					name: 'blogIndex'
				})
			} else {
				this.$router.push({
					name: 'blogCategory',
					params: {
						id: item.id
					}
				})
			}
		},
		getArticles() {
			this.articlesLoading = true
			BlogApi.getArticles({ ...this.routeInfo, type: i18n.locale }).then(v => {
				this.articles = v.data.rows
				this.paginationData.total = v.data.total
			}).finally(() => {
				this.articlesLoading = false
			})

		},
		getBlogMenu() {
			this.blogMenuLoading = true
			BlogApi.getBlogCategory().then(v => {
				this.blogMenu = v.data
			}).finally(() => {
				this.blogMenuLoading = false
			})
		},
		content2Top() {
			(this.$refs.blogContent as HTMLElement).scrollTop = 0
		},

		toDetailPage(id: string) {
			console.log(id);

			this.$router.push({
				name: "blogDetail",
				params: {
					id
				}
			})

		}

	},
	mixins: [
		createRequestMixins({
			key: EMixinsData.articles as 'articles',
			defaultValue: [] as IArticleItem[]
		}),
		createRequestMixins({
			key: EMixinsData.blogMenu as "blogMenu",
			defaultValue: [] as IBlogCategory[]
		}),
		createToTopControl({
			refName: "blogContent",
		}),
		createMainScrollerControl({
			refName: "blogContent"
		})

	],

	mounted() {
		this.$eventBus.on(EMyBlogMainScrollEvent.mainScroll2Top, () => {
			this.ToTopTargetDom.scrollTo({
				top: 0,
				behavior: 'smooth',

			})
		})
	},
	computed: {
		routeInfo() {
			// console.log(this.$route.params, this.$route);
			const { id = -1 } = this.$route.params
			const { page = 1, limit = PAGESIZE } = this.$route.query
			return {
				id: +id,
				page: +page,
				limit: +limit
			}
		},
		displayArticles() {
			const { current, pageSize } = this.paginationData
			return this.articles.filter((x, i) => i >= (current - 1) * pageSize && i < current * pageSize)
		},
		blogCategoryWithALL() {
			const all = { id: '-1', name: 'ALL', articleCount: 0, order: '0', isSelected: this.routeInfo.id === -1 } as (IBlogCategory & { isSelected: boolean, aside?: string, articleCount: number })
			const res: (IBlogCategory & { isSelected: boolean, aside?: string })[] = [all]
			for (let i of this.blogMenu) {
				res.push({ ...i, isSelected: this.routeInfo.id === +i.id, aside: `${i.articleCount}篇` })
				all.articleCount += +i.articleCount
			}
			all.aside = `${all.articleCount}篇`
			return res
		}
	},
	watch: {

		'paginationData.current': {
			handler(n) {
				this.content2Top()
				// console.log(this.$router.currentRoute);
				if (!/blog*/.test(this.$router.currentRoute.name)) {
					return
				}
				if (this.$router.currentRoute.name === 'blogDetail') {
					return
				}

				const { id, page, limit } = this.routeInfo
				//显示分类的页面blogIndex
				if (id >= 0) {
					this.$router.push({
						name: 'blogCategory',
						params: {
							id
						} as any,
						query: {
							limit,
							page: n
						} as any
					})
				} else {
					this.$router.push({
						name: 'blogIndex',
						query: {
							limit,
							page: n
						} as any
					})
				}


			},
			deep: false,
			immediate: false
		},
		routeInfo(n, o) {
			if (!isRouteChange(n, o)) {
				return
			}
			const { id, page, limit } = this.routeInfo
			this.paginationData.current = page
			this.paginationData.pageSize = limit
			// console.log(this.routeInfo);
			this.getArticles()

		},
		'$i18n.locale': {
			handler(n) {
				this.getArticles()
			}
		}
	}
})
function isRouteChange<T extends {
	id: number;
	page: number;
	limit: number;
}>(newInfo: T, oldInfo: T) {
	for (let i in newInfo) {
		if (newInfo[i] !== oldInfo[i]) {
			return true
		}
	}
	return false
}

</script>

<template>

	<div class="blog-container">

		<LayOut>
			<div class="blog-content">
				<div class="content" ref="blogContent" v-loading="articlesLoading">
					<ArticleItem v-for="item of displayArticles" :content="item" :key="item.id"
						:handleClickTitle="toDetailPage" @categoryChange="blogCategoryChange"></ArticleItem>
				</div>

				<div class="footer">
					<Pagination :total="paginationData.total" :pageSize="paginationData.pageSize"
						v-model="paginationData.current" />
				</div>
			</div>
			<template #right>
				<BlogMenu :list="blogCategoryWithALL" @menuChange="blogCategoryChange" v-loading="blogMenuLoading">
				</BlogMenu>
			</template>
		</LayOut>
	</div>

</template>

<style lang="less" scoped>
// .parent {
// 	display: grid;
// 	width: 100%;
// 	height: 100%;
// 	grid-template-rows: 1fr;
// 	grid-auto-columns: 1fr;

// 	.child {
// 		width: 100%;
// 		height: 100%;
// 		overflow-y: auto;
// 		display: flex;
// 		flex-direction: column;

// 		.item {
// 			height: 100%;
// 			flex-shrink: 0;
// 			flex-grow: 0;

// 			.blog-list-container {
// 				// line-height: 1.7;
// 				// position: relative;
// 				padding: 20px;
// 				overflow-y: auto;
// 				width: 100%;
// 				// height: 100%;
// 				box-sizing: border-box;

// 				ul {
// 					list-style: none;
// 					margin: 0;
// 					padding: 0;
// 				}
// 			}

// 			li {
// 				display: flex;
// 				padding: 15px 0;
// 				// border-bottom: 1px solid @gray;

// 				.thumb {
// 					flex: 0 0 auto;
// 					margin-right: 15px;

// 					img {
// 						display: block;
// 						max-width: 200px;
// 						border-radius: 5px;
// 					}
// 				}

// 				.main {
// 					flex: 1 1 auto;

// 					h2 {
// 						margin: 0;
// 					}
// 				}

// 				.aside {
// 					font-size: 12px;


// 					span {
// 						margin-right: 15px;
// 					}
// 				}

// 				.desc {
// 					margin: 15px 0;
// 					font-size: 14px;
// 				}
// 			}
// 		}
// 	}

// }

.blog-container {
	width: 100%;
	height: 100%;

	.layout-right {
		.blog-menu-container {
			width: 250px;
			height: 100%;
			box-sizing: border-box;
			padding-left: 1em;
		}
	}

	.blog-content {
		// width: 100%;
		height: 100%;
		// background: red;
		display: grid;
		grid-template-rows: 95% 10%;
		grid-template-columns: 1fr;
		// overflow: auto;

		.content {

			overflow-y: auto;

			scroll-behavior: smooth;

			.blog-list-container {
				height: 12rem;

			}

			:deep(.loading-container) {
				z-index: 10;

			}



		}

	}

	.pagination-container {
		:deep(a) {
			margin: 0 .5em;
		}
	}
}
</style>