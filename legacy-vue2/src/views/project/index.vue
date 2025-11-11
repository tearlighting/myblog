<script lang="ts">
import Vue from "vue"
import ProjectItem from "@/components/project/projectItem.vue";
import { ProjectApi } from "@/api";
import LayOut from '@/components/layout/index.vue'
import Pagination from '@/components/pagination/index.vue'
import { createMainScrollerControl, createRequestMixins, createToTopControl } from "@/mixins";
import { IDetailArticle } from "blog";
import { i18n } from "@/plugins/i18n";

const PAGESIZE = 10

export default Vue.extend({
	data() {
		return {
			paginationData: {
				total: 0,
				current: 1,
				pageSize: 10
			},
		}
	},
	components: {
		ProjectItem,
		LayOut,
		Pagination
	},
	mixins: [createRequestMixins({
		key: 'projectList' as 'projectList',
		defaultValue: [] as IDetailArticle[]
	}),
	createToTopControl({
		refName: "projectContent",
	}),
	createMainScrollerControl({
		refName: "projectContent"
	})
	],

	created() {

	},
	methods: {
		getProjectList() {
			this.projectListLoading = true
			ProjectApi.getProjects({ ...this.routeInfo, type: i18n.locale }).then(v => {
				if (v && v.data) {
					this.projectList = v.data.rows || []
					this.paginationData.total = v.data.total

				}
				console.log(this.projectList, this.paginationData);

			}).finally(() => {
				this.projectListLoading = false
			})
		},
		toDetailPage(id: string) {
			this.$router.push({
				name: "projectDetail",
				params: {
					id
				}
			})
		},
		content2Top() {
			(this.$refs.projectContent as HTMLElement).scrollTop = 0
		},
	},
	computed: {
		routeInfo() {
			// console.log(this.$route.params, this.$route);
			const { page = 1, limit = PAGESIZE } = this.$route.query
			return {
				page: +page,
				limit: +limit
			}
		},
	},
	watch: {
		'paginationData.current': {
			handler(n) {
				this.content2Top()
				// console.log(this.$router.currentRoute);
				if (!/project*/.test(this.$router.currentRoute.name)) {
					return
				}
				if (this.$router.currentRoute.name === 'projectDetail') {
					return
				}
				const { page, limit } = this.routeInfo

				this.$router.push({
					name: 'projectIndex',
					query: {
						limit,
						page: n
					} as any
				})

			},
			deep: false,
			immediate: false
		},
		routeInfo(n, o) {
			if (!isRouteChange(n, o)) {
				return
			}
			const { page, limit } = this.routeInfo
			this.paginationData.current = page
			this.paginationData.pageSize = limit
			// console.log(this.routeInfo);
			// console.log(this.paginationData);

			this.getProjectList()

		},
		'$i18n.locale': {
			handler(n) {
				this.getProjectList()
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

	<div class="project-container">

		<LayOut>
			<div class="project-content">
				<div class="content" ref="projectContent" v-loading="projectListLoading">

					<ProjectItem v-for="item of projectList" :content="item" :key="item.id"
						:handleClickTitle="toDetailPage"></ProjectItem>
				</div>

				<div class="footer">
					<Pagination :total="paginationData.total" :pageSize="paginationData.pageSize"
						v-model="paginationData.current" />

				</div>
			</div>

		</LayOut>

	</div>

</template>

<style lang="less" scoped>
.project-container {
	width: 100%;
	height: 100%;

	.project-content {
		// width: 100%;
		height: 100%;
		// background: red;
		display: grid;
		grid-template-rows: 95% 5%;
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


			:deep(.loading-container) {
				z-index: 1;
			}



		}


	}

	.footer {


		.pagination-container {
			:deep(a) {
				margin: 0 .5em;
			}

		}

	}
}
</style>