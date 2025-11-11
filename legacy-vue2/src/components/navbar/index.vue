<script lang="ts">

import Vue from "vue"
import Icon from '@/components/svgIcon/index.vue'
import { mapGetters } from 'vuex'
import { faBars, faExpand, faLanguage, faPalette, faUser } from '@fortawesome/free-solid-svg-icons'
import { faThemeisle } from '@fortawesome/free-brands-svg-icons'
import SVGIcon from '@/components/svgIcon/index.vue'
import Tooltip from '@/components/tooltip/index.vue'
import { ETrigger, EDirection } from '@/components/tooltip/prop'
import useFullScreen from '@/hooks/useFullScreen'
import useMessage from "@/hooks/useMessage"
import { ELoginStatus } from '@/store/user'
import { ELanguageType } from "@/plugins/i18n"
import { changeLanguage } from "@/hooks/useChangeLanguage"
const { showMessage } = useMessage()


const { setFullScreen, offFullScreen } = useFullScreen()

export default Vue.extend({


	beforeDestroy() {
		offFullScreen()
	},
	components: {
		Icon,
		SVGIcon,
		Tooltip
	},
	methods: {
		changeMenuShow() {
			if (this.showMenu) {
				this.$store.dispatch(`menuStore/closeMenu`)
			} else {
				this.$store.dispatch(`menuStore/openMenu`)
			}

		},
		changeTheme(item: string, e: Event) {
			if (this.currentTheme !== item) {
				this.$store.dispatch(`themeStore/changeTheme`, item)
			}
			e.stopPropagation()
		},
		showFullScreen() {

			const dom = document.querySelector(".layout-conter-cneter")
			setFullScreen(dom as any)

		},

		handlerLoginOut() {
			if (this.isLogined) {
				this.$store.dispatch("userStore/logout")
			} else {
				this.$router.push({
					name: 'login'
				})
			}
		},
		changeLanguage,
	},
	computed: {
		...mapGetters({
			showMenu: 'menuStore/showMenu',
			currentRoute: 'routeStore/currentRoute',
			currentTheme: "themeStore/theme",
			allTheme: "themeStore/allTheme",
			loginStatus: "userStore/loginStatus"
		}),
		menuIcon: () => faBars,
		fullScreen: () => faExpand,
		user: () => faUser,
		language() {
			return {
				icon: faLanguage,
				trigger: ETrigger.click,
				items: (Object.keys(ELanguageType) as TLanguages[]).map(type => ({ type, label: ELanguageType[type] })),

			}
		},
		theme(): any {
			return {
				icon: faPalette	,
				trigger: ETrigger.click,
				items: Reflect.ownKeys(this.allTheme)
			}
		},
		isLogined(): boolean {
			return this.loginStatus === ELoginStatus.logined
		},





	}
})
</script>

<template>

	<div class="navbar-container">
		<div class="menu">
			<Icon @click="changeMenuShow" :icon="menuIcon" :class="{ 'menu-opened': showMenu }" />
		</div>
		<div class="title" v-if="currentRoute">
			<title>{{ currentRoute.meta.title }}</title>
		</div>
		<div class="controls">
			<span>
				<Tooltip :trigger='language.trigger'>
					<SVGIcon :icon="language.icon" />
					<template #tooltip>
						<ul class="themeControl">
							<li v-for="item of language.items" :key="item.type"
								:class="{ current: $i18n.locale === item.type }"
								@click="e => { changeLanguage(item.type); e.stopPropagation() }">{{
									item.label }}</li>
						</ul>
					</template>
				</Tooltip>
			</span>
			<span>
				<SVGIcon :icon="fullScreen" @click="showFullScreen" />
			</span>
			<span>
				<Tooltip :trigger='theme.trigger'>
					<SVGIcon :icon="user" />
					<template #tooltip>
						<ul class="themeControl">
							<li class="currentTheme" @click="handlerLoginOut">{{ isLogined ? `logout` : 'login' }} </li>
						</ul>
					</template>
				</Tooltip>
			</span>
			<span>
				<Tooltip :trigger='theme.trigger'>
					<SVGIcon :icon="theme.icon" />
					<template #tooltip>
						<ul class="themeControl">
							<li v-for="item of theme.items" :key="item" :class="{ current: currentTheme === item }"
								@click="e => changeTheme(item, e)">{{ item }}</li>
						</ul>
					</template>
				</Tooltip>
			</span>

		</div>


	</div>

</template>

<style lang="less" scoped>
.navbar-container {
	height: 100%;
	width: 100%;
	box-shadow: 0 1px 2px #d9d9d9;
	box-sizing: border-box;
	display: flex;

	.menu {
		width: 3em;
		height: 100%;

		.svg-icon-container {
			font-size: 1.4em;
			position: relative;

			&.menu-opened {
				&::after {
					content: "";
					border: 4px solid;
					border-color: transparent black transparent transparent;
					position: absolute;
					left: .5em;
					z-index: 1;
				}
			}


			&::after {
				content: "";
				position: absolute;
				border: 4px solid;
				border-color: transparent transparent transparent black;
				transform: rotate(360deg);
				left: 1.1em;
				z-index: 1;
			}

		}


	}

	.title {
		display: flex;
		justify-content: center;
		align-items: center;

		title {
			display: block;
		}

		flex:1
	}

	.controls {
		display: flex;
		min-width: 10rem;
		height: 100%;
		// background: red;
		justify-content: center;
		align-items: center;

		.svg-icon-container,
		span {
			margin-right: 1em;
			width: 100%;

			&:hover {
				color: #000;
				cursor: pointer;
			}
		}

		.tooltip-container {
			:deep(.tooltip-pop) {
				transform: translateY(1em);
			}
		}

		.themeControl {

			// z-index: 100;
			// background: red;
			li {
				height: 2em;
				box-sizing: border-box;
				line-height: 2em;
				width: 4rem;
				text-align: center;
				box-shadow: 0 0 0 1px lightgray;

				// transform: translateY(.5em);
			}
		}
	}

}
</style>