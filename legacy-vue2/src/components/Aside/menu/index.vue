<script lang="ts">
import Vue from "vue"
import MenuItem from '@/components/Aside/menuItem/index.vue'
import { TIcon } from '@/components/icon'
import Icon from '@/components/icon/index.vue'
import { IRouteItem } from './types'
import { mapGetters } from 'vuex'
import { RouteItem } from '@/store/route/getDisplayRouteTree'

export default Vue.extend({
	components: {
		MenuItem,
		Icon
	},

	//    mounted(){
	// 	console.log(this.routes);

	//    },
	// methods: {
	// 	toPage(item: IRouteItem) {
	// 		console.log(item);

	// 		this.$store.dispatch("routeStore/changeRoute", item)
	// 	}
	// },
	computed: {
		...mapGetters({
			routes: 'routeStore/currentRoutes'
		}) as {
			routes: () => RouteItem[]
		}
	}
})
</script>

<template>

	<div class="menu-container">
		<template v-for="item of routes">
			<!-- :exact="item.exact" -->
			<router-link :to="{ name: item.name }" :key="item.name">
				<!-- @click="toPage(item)" -->
				<menu-item :class="{ currentRouter: item.isCurrent }">
					<template #header>
						<Icon :type="item.meta.icon" />
					</template>
					{{ item.meta.title }}
				</menu-item>
			</router-link>
		</template>
	</div>

</template>

<style lang="less" scoped>
.menu-container {
	.menu-item-container {
		:deep(.item) {
			transform: translateX(1em);
		}
	}

}
</style>