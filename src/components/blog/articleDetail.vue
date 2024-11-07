<script lang="ts">
import Vue from "vue"
import Layout from '@/components/layout/index.vue'
import { BlogApi } from '@/api'
import ArticleContent from './articleContent.vue'
import ArticleMenu from './blogMenu.vue'
import { ICommentItem, IDetailArticle } from 'blog'
import MessageArea from '@/components/messageArea/index.vue'
import useLoading from '@/hooks/useLoading'
import { useDomScrollEnd } from "@/hooks/useDomScrollEnd"
import { E2TopEvent, EMyBlogMainScrollEvent } from "@/eventBus"
import { createRequestMixins, createToTopControl, createMainScrollerControl } from "@/mixins"
import { i18n } from "@/plugins/i18n"
export default Vue.extend({
	data() {
		return {
			/**
			 * 异步复制防止computed计算是dom还没有渲染
			 */
			anchors: null as IDetailArticle['toc'],
			currentAnchor: null as string,

		}
	},
	mixins: [
		createToTopControl({ refName: 'main' }),
		createRequestMixins({
			key: "article" as "article",
			defaultValue: null as IDetailArticle
		}),
		createRequestMixins({
			key: "commentsData" as "commentsData",
			defaultValue: {
				comments: [],
				title: '评论',
				subTitle: 0,
				loading: false
			},
			requestMethod: 'getComment'
		}),
		createMainScrollerControl({
			refName: "main"
		})
	],
	watch: {
		'$i18n.locale': {
			handler(n) {
				this.getArticle()
			}
		}
	},
	methods: {

		toAnchor(item: ArrayType<IDetailArticle['toc']>) {
			// console.log(item);
			// this.$router.push({hash:`#${item.anchor}`})
			// console.log(this.anchorDoms[0].id);
			if (this.anchorDoms?.length) {
				const dom = this.anchorDoms.find(x => x.id === item.anchor)
				if (dom) {
					dom.scrollIntoView({
						behavior: 'smooth'
					})
					this.currentAnchor = dom.id
				}

			}
			// console.log(this.$route);
			// location.hash = this.$route.fullPath
			// location.hash = location.hash + item.anchor

		},
		handleSubmit(e: Record<"nickname" | 'content', string>, callback: (message: string) => void) {
			console.log(e, callback);
			//todo
			BlogApi.postComment(e).then(v => {
				callback("提交成功")
			})

		},
		setCurrentAnchor() {
			let range = 50
			let res = ""
			for (let dom of this.anchorDoms) {
				if (!dom) {
					continue
				}
				const { top, bottom } = dom.getBoundingClientRect()

				if (top > this.$store.getters["layoutStore/view2Top"] && top < this.$store.getters["layoutStore/view2Top"] + range) {
					//正在这个dom
					res = dom.id
					return
				} else if (top > this.$store.getters["layoutStore/view2Top"] + range) {
					//在下方
					continue
				} else {
					//不知道在不在,假如他在,继续执行
					res = dom.id
				}
			}
			this.currentAnchor = res
		},

		//#region mixins need function
		async getComment() {
			this.commentsDataLoading = true
			await BlogApi.getComment({ blogId: this.$route.params.id }).then(v => {
				// console.log(v.data.rows);
				this.commentsData.comments = v.data.rows
				this.commentsData.subTitle = v.data.total

			}).finally(() => {
				this.commentsDataLoading = false
			})
		},
		['handle' + EMyBlogMainScrollEvent.mainScrollWheel]() {
			this.setCurrentAnchor()
		},
		['handle' + EMyBlogMainScrollEvent.mainScrollWheelEnd]() {
			if (this.commentsData.loading) {
				return
			}
			if (!this.haveRestComments) {
				return
			}
			this.commentsData.loading = true
			//todo
			this.getComment().then(() => {
				this.commentsData.loading = false
			})
		},

		getArticle() {
			this.articleLoading = true
			BlogApi.getArticle(this.$route.params.id, i18n.locale).then(v => {
				// console.log(v.data);
				this.article = v.data as IDetailArticle
				this.$nextTick(() => {
					this.anchors = [...this.article.toc]
				})
			}).finally(() => {
				this.articleLoading = false
			})
		},
		//#endregion


	},
	components: {
		Layout,
		ArticleContent,
		ArticleMenu,
		MessageArea
	},
	computed: {
		articleMenu(): IDetailArticle['toc'] {
			const menu = this.article?.toc || []
			const setSelectAnchor = <T extends { children: any[], anchor: string }, R extends T = T>(tree: T[]): R[] => {
				return tree.map(v => {
					const res = { ...v, isSelected: v.anchor === this.currentAnchor } as unknown as R
					if (v.children && v.children.length) {
						res.children = setSelectAnchor(v.children)
					}
					return res
				})
			}
			return setSelectAnchor(menu as any) as any
		},

		anchorDoms(): HTMLElement[] {
			const getRealDoms = <T extends { anchor: string, children: T[] }>(tree: T[]) => {
				const res = [] as HTMLElement[]
				// console.log(tree,'tree');

				for (let i of tree) {
					res.push(document.getElementById(i.anchor))
					if (i.children && i.children.length) {
						res.push(...getRealDoms(i.children))
					}
				}
				return res
			}

			return getRealDoms((this.anchors as any) || [])

		},
		haveRestComments(): boolean {
			return this.commentsData.subTitle > this.commentsData.comments.length
		}
	},

})
</script>

<template>

	<div class="article-detail-container">
		<Layout>
			<div ref="main" class="main" v-loading='articleLoading'>
				<ArticleContent :article="article" />
				<MessageArea @submit="handleSubmit" :list="commentsData.comments" :title="commentsData.title"
					:isListLoading="commentsData.loading" :subTitle="`(${commentsData.subTitle})`"></MessageArea>
			</div>
			<template #right>
				<div class="right" ref="anchorMenu" v-loading='commentsDataLoading'>
					<ArticleMenu :list="articleMenu" @menuChange="toAnchor">目录</ArticleMenu>
				</div>
			</template>
		</Layout>
	</div>

</template>

<style lang="less" scoped>
@import "~@/style/global.less";

.article-detail-container {
	width: 100%;
	height: 100%;

	.main {
		width: 100%;
		height: 100%;
		// background: red;
		// overflow: hidden;
		overflow-y: auto;
		padding-left: 2em;
		padding-right: 1em;
		box-sizing: border-box;
		// .scrollbar-style();


	}

	.right {
		width: 250px;
		height: 100%;
		// background: red;
	}
}
</style>