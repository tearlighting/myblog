<template>
	<form id="data-form-container" ref="form" @submit.prevent class="data-form-container">
		<div class="form-item">
			<div class="input-area">
				<input type="text" maxlength="10" v-model="formData.nickname" placeholder="username" disabled />
				<span class="tip">{{ formData.nickname?.length }}/10</span>
			</div>
			<div class="error">{{ error.nickname }}</div>
		</div>
		<div class="form-item">
			<div class="text-area">
				<textarea maxlength="300" placeholder="content" v-model="formData.content"></textarea>
				<span class="tip">{{ formData.content.length }}/300</span>
			</div>
			<div class="error">{{ error.content }}</div>
		</div>
		<div class="form-item">
			<div class="button-area">
				<button :disabled="isSubmiting" @click="handleSubmit">
					{{ isSubmiting ? "提交中..." : "提交" }}
				</button>
			</div>
		</div>
	</form>
</template>

<script lang="ts">
import useMessage, { EMessageType } from '@/hooks/useMessage'
import { ELoginStatus } from '@/store/user';
import { IUser } from 'login';
import vue from 'vue'
import { mapGetters } from 'vuex';
const { showMessage } = useMessage()
export default vue.extend({
	data() {
		return {
			formData: {
				nickname: "",
				content: "",
			},
			error: {
				nickname: "",
				content: "",
			},
			isSubmiting: false,
		}
	},
	methods: {
		handleSubmit() {
			if (this.loginStatus === ELoginStatus.unlogin) {
				showMessage({
					message: 'you need login',
					type: EMessageType.error,
					duration: 2000,
					dom: this.$refs.form as HTMLElement,
				})
				return
			}
			this.error.nickname = this.formData.nickname ? "" : "content is empty";
			this.error.content = this.formData.content ? "" : "content is empty";
			if (this.error.nickname || this.error.content) {
				// 有错误
				return;
			}
			this.isSubmiting = true; // 正在提交，防止重复点击
			this.$emit("submit", this.formData, (successMsg: string) => {
				showMessage({
					message: successMsg,
					type: EMessageType.success,
					duration: 1000,
					dom: this.$refs.form as HTMLElement,
					callback: () => {
						this.isSubmiting = false;
						this.formData.nickname = "";
						this.formData.content = "";
					},
				});
			}); // 让父组件来处理事件
		},
	},
	computed: {
		...mapGetters({
			loginStatus: 'userStore/loginStatus',
			user: 'userStore/user'
		}) as {
			loginStatus: () => ELoginStatus,
			user: () => IUser
		},
		nickNameComputed(): string {
			if (this.loginStatus === ELoginStatus.logined) {
				return this.user.name
			} else {
				return null
			}
		},
	},
	watch: {
		nickNameComputed: {
			handler(n) {
				// console.log(n);
				this.formData.nickname = n

			},
			immediate: true
		}
	}
});
</script>

<style scoped lang="less">
.data-form-container {
	margin-bottom: 20px;
	overflow: hidden;
}

.form-item {
	margin-bottom: 8px;
}

.input-area {
	width: 50%;
	position: relative;
}

.text-area {
	position: relative;
}

.tip {
	position: absolute;
	right: 5px;
	bottom: 5px;
	color: #b4b8bc;
	font-size: 12px;
}

input,
textarea {
	display: block;
	width: 100%;
	box-sizing: border-box;
	outline: none;
	font-size: 14px;
	border-radius: 4px;

	&:disabled {
		cursor: not-allowed;
	}

}

input {
	padding: 0 15px;
	height: 40px;
}

textarea {
	resize: none;
	padding: 8px 15px;
	height: 120px;
}

.error {
	margin-top: 6px;

	font-size: 14px;
	height: 20px;
	line-height: 20px;
}

button {
	position: relative;
	cursor: pointer;
	border: none;
	outline: none;
	width: 100px;
	height: 34px;
	color: #fff;
	border-radius: 4px;

}
</style>