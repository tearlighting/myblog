<script lang="ts">
import Vue from "vue"
import Icon from '@/components/icon/index.vue'
import Tooltip from '@/components/tooltip/index.vue'
import ImagLoader from '@/components/imgLoader/index.vue'
import { TIcon } from '@/components/icon'
import MenuItem from '@/components/Aside/menuItem/index.vue'
interface IRouterConfig {
	icon: TIcon,
	name: string,
	tooltip?: string
}

export default Vue.extend({
	data() {
		return {
			routes: [
				// {
				// 	icon: 'github',
				// 	name: 'github',
				// 	tooltip: require('@/assets/wechat.jpg')
				// },
				{
					icon: 'email',
					name: '1394705270asdf@gmail.com',
					// tooltip: require('@/assets/wechat.jpg')
				},
				{
					icon: 'wechat',
					name: '15590547823', tooltip: require('@/assets/wechat.jpg')
				},
				{
					icon: 'qq',
					name: '1394705270', tooltip: require('@/assets/qq.jpg')
				}

			] as Array<IRouterConfig>
		}
	},
	components: {
		Icon,
		Tooltip,
		ImagLoader,
		MenuItem
	}
})
</script>

<template>

	<div class="contact-container">
		<ul>
			<template v-for="item of routes">
				<Tooltip :key="item.name" trigger='click' v-if="item.tooltip">
					<MenuItem>
					<template #header>
						<Icon :type="item.icon" />
					</template>
					{{ item.name }}
					</MenuItem>
					<template #tooltip>
						<div class="item-tooltip">
							<ImagLoader :url="item.tooltip" />
						</div>
					</template>
				</Tooltip>
				<MenuItem v-else>
				<template #header>
					<Icon :type="item.icon" />
				</template>
				{{ item.name }}
				</MenuItem>
			</template>
		</ul>
	</div>

</template>

<style lang="less" scoped>
.contact-container {
	width: 100%;

	:deep(.item-tooltip) {
		box-sizing: border-box;
		padding: .5em;

		width: 200px;
		height: 200px;
		border-radius: .5em;

	}

	:deep(.item) {

		// background: red;
		i.iconweixin {
			font-size: 1.3em;
			transform: rotate(30deg);
		}
	}
}
</style>