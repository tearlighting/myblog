<script lang="ts">
import Vue from "vue"
import Message from '@/components/messageArea/index.vue'
import { createRequestMixins } from "@/mixins";
import { MessageApi } from "@/api";
import { ICommentItem } from "blog";
export default Vue.extend({
	components: {
		Message
	},
	mixins: [
		createRequestMixins({
			key: 'messages' as 'messages',
			defaultValue: {
				list: [] as ICommentItem[]
			}
		})
	],
	methods: {
		getMessages() {
			this.messagesLoading = true
			MessageApi.getMessages().then(v => {
				// console.log(v);
				this.messages.list = v?.data?.rows || []

			}).finally(() => {
				this.messagesLoading = false
			})
		}
	}
})
</script>

<template>

	<div class="message-container" v-loading="messagesLoading">
		<Message :list="messages.list" />
	</div>

</template>

<style lang="less" scoped>
.message-container {
	height: 100%;
	box-sizing: border-box;

	padding: 2em 1em;

	:deep(.message-area-container) {
		.data-form-container {

			// background-color: red;
			.button-area {
				text-align: center;
			}
		}
	}

}
</style>