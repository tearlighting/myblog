<script lang="ts">
import Vue from 'vue'
import SVGIcon from '@/components/svgIcon/index.vue'
import { faEye, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { mapGetters } from 'vuex';
import { ELoginStatus } from '@/store/user';
import { LoginApi } from '@/api';

export default Vue.extend({
	data() {
		return {
			formData: {
				username: "admin",
				password: '123456',
				captcha: ""
			},
			showpassword: false,
			// loading: false
			captchaSrc: '',
			captchaControl: {
				src: '',
				loading: false
			}

		}
	},
	created() {
		this.initCaptch()
	},
	methods: {
		handleLogin() {
			// console.log(this.formData);
			this.$store.dispatch('userStore/login', this.formData).then(v => {
				// console.log(this.loginStatus);

				if (this.loginStatus === ELoginStatus.logined) {
					this.$router.push({
						name: this.$route.params?.name || 'home'
					})
				}

			}).catch(v => {
				console.log(v, this.loginStatus);

			})
		},
		changePasswordShow() {
			this.showpassword = !this.showpassword
		},
		initCaptch() {
			if (this.captchaControl.loading) {
				return
			}
			this.captchaControl.loading = true
			LoginApi.getCaptcha().then(v => {
				this.captchaControl.src = URL.createObjectURL(new Blob([Buffer.from(v.data)], { type: 'image/svg+xml' }))
			}).finally(() => {
				this.captchaControl.loading = false
			})
		}
	},
	components: {
		SVGIcon
	},
	computed: {
		user: () => faUser,
		password: () => faLock,
		showpassIcon: () => faEye,
		hidepassIcon: () => faEyeSlash,
		passwordIcon(): any {
			return this.showpassword ? this.showpassIcon : this.hidepassIcon
		},
		...mapGetters({
			loading: 'userStore/isLogin',
			loginStatus: 'userStore/loginStatus'
		}) as {
			loading: () => boolean,
			loginStatus: () => ELoginStatus
		}
	}

})
</script>

<template>
	<div class="login-container">
		<div class="login-card">
			<div class="title">
				Login
			</div>
			<div class="content">
				<form>
					<div class="form-item">
						<label for="" class="prefix">
							<SVGIcon :icon="user" />
						</label>
						<input v-model.trim="formData.username" />
						<label for="" class="footer" style="visibility: hidden;">
						</label>
					</div>
					<div class="form-item">
						<label for="" class="prefix">
							<SVGIcon :icon="password" />
						</label>

						<input v-model.trim="formData.password" :type="showpassword ? `text` : `password`" />
						<label for="" class="footer password" @click="changePasswordShow">
							<SVGIcon :icon="passwordIcon"></SVGIcon>
						</label>
					</div>
					<div class="form-item captcha">
						<label for="" class="prefix"></label>

						<div class="captcha-container">
							<input v-model.trim="formData.captcha" />
							<div class="img-container" @click="initCaptch" v-loading="captchaControl.loading">
								<img :src="captchaControl.src" />
							</div>

						</div>
						<label for="" class="footer">
						</label>
					</div>

					<div class="form-item">
						<button :class="{ isLoading: loading }" size="large" @click.prevent="handleLogin"> login
						</button>
					</div>
					<!-- <div class="form-item">
						<button  size="large" @click.prevent="$store.dispatch('userStore/whoAmI')"> who
						</button>
					</div> -->



				</form>
			</div>
		</div>
	</div>
</template>

<style lang="less" scoped>
.login-container {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	min-height: 100%;



	.login-card {
		width: 480px;
		border-radius: 20px;

		overflow: hidden;



		.content {
			padding: 20px 50px 50px 50px;

			.form-item {

				// background: red;
				button {
					padding: .5em 4em;
					border-radius: .3em;
				}

				&.captcha {
					height: 4em;
					line-height: 4em;
					text-align: center;

					.captcha-container {
						padding-left: 1.6em;
						display: flex;
						align-items: center;

						// height: 1.5em;
						:deep(.tip) {
							display: none;
						}

						&>input {
							width: 9em;
						}

						.img-container {
							width: 9em;
							min-height: 1em;
							height: 4em;
							// margin-left: .3em;
							transform: translateX(.4em);

							img {
								width: 100%;
								height: 100%;
								object-fit: fill;
							}
						}
					}
				}
			}

			.prefix {
				width: 1em;
				padding-right: .8em;

			}

			input {
				width: 18em;
				padding-left: .8em;
			}

			.footer {
				width: 2em;
				display: block;
				transform: translateX(-100%);
			}


		}



	}
}
</style>