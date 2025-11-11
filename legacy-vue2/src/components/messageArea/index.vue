<template>
	<div class="message-area-container">
		<DataForm v-on="$listeners" />
		<h3>
			{{ title }}
			<span>{{ subTitle }}</span>
		</h3>
		<DataList :list="list" />
		<div class="loading" v-loading="isListLoading"></div>
	</div>
</template>

<script lang="ts">
import DataForm from "./dataForm.vue";
import DataList from "./dataList.vue";
import { ICommentItem } from 'blog';
import Vue, { PropType } from 'vue';
export default Vue.extend({
	props: {
		title: {
			type: String,
			default: "",
		},
		subTitle: {
			type: String,
			default: "",
		},
		list: {
			type: Array as PropType<ICommentItem[]>,
			default: () => [] as ICommentItem[],
		},
		isListLoading: {
			type: Boolean,
			default: false,
		},
	},
	components: {
		DataForm,
		DataList,
	},
})
</script>

<style scoped lang="less">
.loading {
	position: relative;
	height: 100px;

}
</style>