<script lang="ts">
import Vue, { nextTick } from "vue"
import HobbyItem from "@/components/hobby/hobbyItem.vue";
import LayOut from '@/components/layout/index.vue'
import Pagination from '@/components/pagination/index.vue'
import BlogMenu from "@/components/blog/blogMenu.vue";
import { createMainScrollerControl, createRequestMixins, createToTopControl } from "@/mixins";
import { IArticleItem, IBlogCategory } from "blog";
import { HobbyApi } from "@/api";
import Aplayer from 'vue-aplayer'




export default Vue.extend({
	data() {
		return {
			currentItem: null as Partial<IArticleItem> & { audio: string },
			playButton: null as HTMLButtonElement
		}
	},
	components: {
		HobbyItem,
		LayOut,
		BlogMenu,
		Pagination, Aplayer
	},
	mixins: [
		createRequestMixins({
			key: 'hobbyList' as 'hobbyList',
			defaultValue: [] as IArticleItem[]
		}),
		createRequestMixins({
			key: "hobbyMenu" as "hobbyMenu",
			defaultValue: [] as IBlogCategory[]
		}),
		createToTopControl({
			refName: "hobbyContent",
		}),
		createMainScrollerControl({
			refName: "hobbyContent"
		})
	],
	mounted() {
		this.playButton = document.querySelector('.aplayer-icon-play')
	},
	methods: {
		getHobbyList() {
			this.hobbyListLoading = true
			HobbyApi.getHobbyList({ ...this.routeInfo }).then(v => {
				if (v && v.data.total) {
					this.hobbyList = v.data.rows
				}
				console.log(this.hobbyList);

			}).finally(() => {
				this.hobbyListLoading = false
			})
		},
		getHobbyMenu() {
			this.hobbyMenuLoading = true
			HobbyApi.getHobbyMenu().then(v => {
				if (v && v.data.total) {
					this.hobbyMenu = v.data.rows
					console.log(this.hobbyMenu);

				}
			}).finally(() => {
				this.hobbyMenuLoading = false
			})
		},
		blogCategoryChange(item: IBlogCategory) {
			if (+item.id === this.routeInfo.id) {
				return
			}
			if (+item.id === -1) {
				this.$router.push({
					name: 'hobbyIndex'
				})
			} else {
				this.$router.push({
					name: 'hobbyCategory',
					params: {
						id: item.id
					}
				})
			}
		},
		playMusic(item: Partial<IArticleItem> & { audio: string }) {

			if (this.currentItem?.id === item.id) {
				return
			}
			this.currentItem = item

		}
	},
	computed: {
		currentMusic(): IVueAplayerMusic {
			if (!this.currentItem) {
				return {
					src: '',
				}
			}
			const res: IVueAplayerMusic = {
				src: (this.currentItem.audio as any)?.default || this.currentItem.audio,
				title: this.currentItem.title,
				pic: this.currentItem.thumb

			}
			console.log(res, this.currentItem.audio);
			nextTick().then(() => {
				this.playButton.click()
			})
			return res
		},
		categoryWithALL() {
			const all = { id: '-1', name: 'ALL', articleCount: 0, order: '0', isSelected: this.routeInfo.id === -1 } as (IBlogCategory & { isSelected: boolean, aside?: string, articleCount: number })
			const res: (IBlogCategory & { isSelected: boolean, aside?: string })[] = [all]
			for (let i of this.hobbyMenu) {
				res.push({ ...i, isSelected: this.routeInfo.id === +i.id, aside: `${i.articleCount}篇` })
				all.articleCount += +i.articleCount
			}
			all.aside = `${all.articleCount}篇`
			console.log(res);

			return res
		},
		routeInfo() {
			// console.log(this.$route.params, this.$route);
			const { id = -1 } = this.$route.params
			return {
				id: +id,
			}
		},
		displayArticles() {
			const { current, pageSize } = this.paginationData
			return this.hobbyList.filter((x, i) => i >= (current - 1) * pageSize && i < current * pageSize)
		},
	},
	watch: {
		routeInfo(n, o) {
			if (!isRouteChange(n, o)) {
				return
			}
			const { id } = this.routeInfo
			this.getHobbyList()

		},
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

	<div class="hobby-container">
		<LayOut>
			<div class="hobby-content">
				<div class="content" ref="hobbyContent" v-loading="hobbyListLoading">

					<HobbyItem v-for="item of hobbyList" :content="item" :key="item.id"
						:class="{ current: currentItem?.id === item.id }" @categoryChange="blogCategoryChange"
						@playMusic="playMusic"></HobbyItem>
				</div>

				<div class="footer">
					<!-- <Aplayer :music="currentMusic" class="myHobby" /> -->
					<div class="myHobby">
						<Aplayer :music="currentMusic" repeat="repeat-one" :autoplay="true" />
					</div>
				</div>
			</div>
			<template #right>
				<BlogMenu :list="categoryWithALL" @menuChange="blogCategoryChange" v-loading="hobbyMenuLoading">
				</BlogMenu>
			</template>
		</LayOut>
	</div>

</template>

<style lang="less" scoped>
.hobby-container {
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

	.hobby-content {
		// width: 100%;
		height: 100%;
		// background: red;
		display: grid;
		grid-template-rows: 90% 10%;
		grid-template-columns: 1fr;
		// overflow: auto;

		.content {

			overflow-y: auto;

			scroll-behavior: smooth;

			.blog-list-container {
				height: fit-content;
				padding-top: 0;
				padding-bottom: 0;

			}

			.hobby-item-container {
				&.current {
					// text-align: center;

					:deep(div.aside) {
						color: inherit;
					}
				}

			}

			:deep(.loading-container) {
				z-index: 1;
			}



		}


	}

	.footer {
		.myHobby {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;

			// background-color: red;
			.aplayer {
				bottom: 0;
			}
		}
	}
}
</style>