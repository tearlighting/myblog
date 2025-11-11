<script lang="ts">
import Vue from "vue"
import Contact from './contact/index.vue'
import Menu from './menu/index.vue'
import Avatar from '@/components/avatar/index.vue'
import { mapGetters } from 'vuex'
export default Vue.extend({
	data() {
		return {
			icon: require("@/assets/bell.jpg")
		}
	},
	components: {
		Contact,
		Menu,
		Avatar
	}
	, computed: {
		...mapGetters({
			showMenu: 'menuStore/showMenu',
			user: 'userStore/user'
		})
	}


})
</script>

<template>

	<div class="aside-container" :class="{ 'menu-closed': !showMenu }">
		<Avatar :url="icon" />
		<div class="user">{{ user.name }}</div>
		<Menu />
		<Contact />
		<p class="footer">ICP备xxxx号</p>
	</div>

</template>

<style lang="less" scoped>
.aside-container {
	width: 100%;
	height: 100%;
	padding: 1em 0;
	box-sizing: border-box;

	.menu-container {
		margin: 1em 0;
	}

	overflow-x: hidden;
	overflow-y: auto;

	.footer {
		text-align: center;
	}

	transition: width 800ms ease-in-out,
	transform 300ms ease-in-out,
	visibility 100ms ease-in;

	div&.menu-closed {
		transform: scaleX(0);
		visibility: hidden;
		width: 0;
		transition: width 800ms ease-in-out, transform 300ms ease-in-out 800ms, visibility 100ms ease-in 700ms;

	}

}
</style>