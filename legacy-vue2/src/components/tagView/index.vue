<script lang="ts">
import Vue from "vue"
import Tag from '@/components/tag/index.vue'
import SVGIcon from "@/components/svgIcon/index.vue"
import { faCircle, faX } from "@fortawesome/free-solid-svg-icons"
import { mapGetters } from 'vuex'
import { Route } from 'vue-router'
import store from '@/store'
import router from '@/router'
export default Vue.extend({
	components: {
		Tag, SVGIcon
	},
	//    created(){
	// 	console.log(this.allTags,this.currentTag);

	//    },
	methods: {
		toCachedTag(item: Route) {
			// console.log(item);
			router.push(item)

		},
		closeTag(item: Route, e: Event) {
			// e.preventDefault()
			e.stopPropagation()
			store.dispatch("tagView/delete", item)
		}
	},
	computed: {
		header: () => faCircle,
		footer: () => faX,
		...mapGetters({
			allTags: "tagView/allTags",
			currentTag: "tagView/currentTag"
		})

	}
})

</script>

<template>

	<div class="tag-view-container">
		<Tag v-for="item of allTags" :key="item.name" :class="{ currentTag: currentTag.meta.title === item.meta.title }"
			@click="toCachedTag(item)">
			<template #header v-if="currentTag.meta.title === item.meta.title">
				<SVGIcon :icon="header" />
			</template>
			{{ item.meta.title }}
			<template #footer v-if="item.meta.title !== $i18n.t('menu.home')">
				<SVGIcon :icon="footer" @click="(i, e) => closeTag(item, e)" />
			</template>
		</Tag>
	</div>

</template>

<style lang="less" scoped>
.tag-view-container {
	height: 100%;
	box-shadow: 0 1px 2px #d9d9d9;
	font-size: .8em;
	display: flex;
	align-items: center;

	.tag-container {
		height: 80%;
		max-width: 12rem;
		min-width: 5rem;
		margin-right: 1em;

		&:first-child {
			// background: red;
			margin-left: 0.5rem;
		}

		.svg-icon-container {
			font-size: .8em;
		}
	}
}
</style>