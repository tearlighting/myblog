<script lang="ts">
import Vue from "vue"
import Layout from '@/components/layout/index.vue'
import Aside from '@/components/Aside/index.vue'
import NavBar from '@/components/navbar/index.vue'
import TagView from '@/components/tagView/index.vue'
import { mapGetters } from 'vuex'
import { Route } from "vue-router"

export default Vue.extend({
	name: 'SiteLayout',
	components: {
		Layout,
		Aside,
		NavBar, TagView
	},
	computed: {
		...mapGetters({
			tags: 'tagView/keepAliveTags',
			currentTag: 'tagView/currentTag'
		}),
		needkeepAlive(): boolean {
			// console.log(this.currentTag, this.$route);
			if (this.$route.name === 'blogDetail') {
				return false
			}
			return (this.tags as Route[]).findIndex(x => x.name === this.currentTag.name) !== -1
		}
	},

	mounted() {
		// console.log(this.needkeepAlive);
		const routerContainer: HTMLElement = this.$refs["site-layout-router-view-container"] as any
		this.$store.commit('layoutStore/setView2Top', routerContainer.getBoundingClientRect().top)
	},
	// watch: {
	// 	currentTag() {
	// 		console.log(this.needkeepAlive);

	// 	}
	// }

})
</script>

<template>

	<Layout class="layout">
		<template #left>

			<Aside />

		</template>
		<template #centerLine1>
			<div class="navbar">
				<NavBar />
			</div>
		</template>
		<template #centerLine2>
			<div class="tagview">
				<TagView />
			</div>
		</template>
		<template>
			<div ref="site-layout-router-view-container" style="height:100%;width: 100%;">
				<keep-alive v-if="needkeepAlive">
					<router-view>
					</router-view>
				</keep-alive>
				<router-view v-else>
				</router-view>
			</div>
		</template>

	</Layout>

</template>

<style lang="less" scoped>
.layout {
	.aside-container {
		width: 300px;
		height: 100%;
	}

	.navbar {
		height: 3em;
		// background: red;
	}

	.tagview {
		height: 2rem;
	}
}
</style>