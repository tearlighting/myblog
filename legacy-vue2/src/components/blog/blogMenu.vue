<script lang="ts">
import Vue from "vue"
import type { IList, IMenuTree } from "blog";
import { listToTree } from "./index";




export default Vue.extend({
	name: 'BlogMenu',
	data() {
		return {
			hidenClass: 'hiddenMenu'
		}
	},
	props: {
		list: {
			default: () => [] as IList[]
		}
	},
	methods: {
		hidenMenu(payload: MouseEvent) {

			const target = payload.target as HTMLElement

			const children = target.nextElementSibling
			if (children) {
				if (children.classList.contains(this.hidenClass)) {
					children.classList.remove(this.hidenClass)
				} else {
					children.classList.add(this.hidenClass)
				}
			}

		}
	},

	computed: {
		listTree(): IMenuTree[] {
			return listToTree<IList, IMenuTree>(this.list)
		},
		routeInfo(): Record<'id', number> {
			const { id = -1 } = this.$route.params
			return { id: +id }
		}
	},
	// watch: {
	// 	list() {
	// 		console.log(this.list);

	// 	}
	// }

})
</script>

<template>

	<div class="blog-menu-container">
		<title class="tilie">
			<slot></slot>
		</title>
		<ul>
			<li v-for="item of listTree" :key="item.name" @click.stop="$emit('menuChange', item)"
				:class="{ current: item.isSelected }">
				<span class="name" @dblclick.self="hidenMenu">{{ item.name }}</span> <span v-if='item.aside'
					class="aside">{{
						item.aside
					}}</span>
				<BlogMenu v-if="item.children?.length" :list="item.children" @menuChange="e => $emit('menuChange', e)">
				</BlogMenu>
			</li>
		</ul>
	</div>

</template>

<style lang="less" scoped>
.blog-menu-container {
	height: 100%;
	width: 100%;
	box-sizing: border-box;
	padding-top: .5em;

	&.hiddenMenu {
		transform: scaleY(0);
		height: 0;
		transform-origin: top;
	}

	transition: transform .3s ease-in-out,
	height .2s ease .2s;

	&>ul {
		height: 100%;
		width: 100%;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.blog-menu-container {
		padding-top: 0;

	}

	.tilie {
		display: block;
		padding-left: 1em;
		margin: .5em 0;
	}

	ul {
		li {
			box-sizing: border-box;
			list-style: none;
			min-height: 2em;
			line-height: 2em;
			padding-left: 1em;

			margin-bottom: .4em;

			span.name {
				display: inline-block;
				height: 100%;
				width: 8em;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				vertical-align: middle;

				// &.hiden {}
			}

			// span.aside {
			// 	display: inline-block;
			// 	height: 100%;


			// }

			// text-align: center;
			&:hover {
				cursor: pointer;
				font-weight: bold;

				ul {
					font-weight: normal;

				}
			}

			ul {
				margin-left: 1.4em;
				background: #fff;


			}

		}

		ul,
		li {
			height: fit-content;
		}
	}
}
</style>
