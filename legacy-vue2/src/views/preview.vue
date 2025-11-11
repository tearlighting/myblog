<script lang="ts">
import Vue from "vue";
import AvatarPre from '@/components/avatar/preview.vue'
import IconPre from '@/components/icon/preview.vue'

import PaginationPre from '@/components/pagination/preview.vue'
import EmptyPreview from '@/components/empty/preview.vue'
import ImageLoaderPreview from '@/components/imgLoader/preview.vue'
import store from '@/store';
import { TTheme } from '@/store/theme';
import ContactPreview from '@/components/Aside/contact/preview.vue'
import MenuItemPreview from '@/components/Aside/menuItem/preview.vue'
import MenuPreview from '@/components/Aside/menu/preview.vue'
import AsidePreview from '@/components/Aside/preview.vue'
import LayoutPreview from '@/components/layout/preview.vue'
export default Vue.extend({
	components: {
		AvatarPre,
		IconPre,
		PaginationPre,
		EmptyPreview,
		ImageLoaderPreview,
		ContactPreview,
		MenuItemPreview, MenuPreview,
		AsidePreview,
		LayoutPreview

	}, methods: {
		test() {


			const theme: TTheme = store.getters['themeStore/theme']
			const target: TTheme = theme === 'light' ? 'dark' : 'light'
			store.dispatch('themeStore/changeTheme', target)
			console.log(store.getters['themeStore/theme']);

		},
	}
})
</script>

<template>
	<div class="app-container">
		<LayoutPreview />
		<AsidePreview />
		<MenuPreview />
		<MenuItemPreview />
		<ContactPreview />
		<ImageLoaderPreview />
		<EmptyPreview />
		<AvatarPre />
		<IconPre />
		<PaginationPre />
		<el-button @click="test">test</el-button>

	</div>
</template>

<style lang="less" scoped>
.app-container {
	overflow-y: auto;
}
</style>
