<template>
	<ul class="data-list-container">
		<li v-for="item in list" :key="item.id">
			<Avatar :url="item.avatar" :size="44" />
			<div class="data">
				<div class="nickname">{{ item.nickname }}</div>
				<div class="content">{{ item.content }}</div>
				<div class="time">{{ formatDate(item.createDate) }}</div>
			</div>
		</li>
	</ul>
</template>

<script lang="ts">
import Avatar from "@/components/avatar/index.vue";
import { formatDate } from "@/utils";
import { ICommentItem } from 'blog'
import Vue from 'vue';
import { PropType } from 'vue/types/v3-component-props';

export default Vue.extend({
	components: {
		Avatar,
	},
	props: {
		list: {
			type: Array as PropType<ICommentItem[]>,
			default: () => [] as ICommentItem[],
		},
	},

	methods: {
		formatDate,

	},
	// watch: {
	// 	list: {
	// 		handler(n) {
	// 			console.log(n);

	// 		},
	// 		immediate: true
	// 	}
	// }
})
</script>

<style scoped lang="less">
.data-list-container {
	list-style: none;
	margin: 0;
	padding: 0;
}

li {
	display: flex;
	padding: 15px 0;

	.avatar-container {
		margin-right: 1em;
	}

	.data {
		flex: 1 1 auto;
		position: relative;

		.content {
			font-size: 14px;
		}

		.nickname {
			margin-bottom: 10px;

		}

		.time {
			position: absolute;
			right: 0;
			top: 5px;
			font-size: 12px;

		}
	}
}
</style>