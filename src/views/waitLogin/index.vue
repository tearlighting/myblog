<script lang="ts">
import Vue, { nextTick } from "vue"
import useLoading from "@/hooks/useLoading";
import { ELoginStatus } from "@/store/user";
// const {showLoading,mount,hiddenLoading} = useLoading()
export default Vue.extend({
	data() {
		return {
			loadingHelper: useLoading()
		}
	},
	mounted() {

		this.loadingHelper.mount(document.getElementById("app") as any)
		this.loadingHelper.showLoading({ placeholder: `waiting login` })

		this.$watch(() => this.$store.getters["userStore/loginStatus"], (n, o) => {
			if (n === ELoginStatus.logining) {
				return
			}
			nextTick().then(() => {
				const { name = 'home', path = '/', params } = this.$route.params
				console.log(params);

				this.$router.push({
					name,
					// path,
					params: JSON.parse(params)
				}).catch(e => {
					// console.log(e);

				})
			})

		}, {
			immediate: true
		})


	},
	beforeDestroy() {
		this.loadingHelper.hiddenLoading()
		this.loadingHelper.destory()
	}
})
</script>

<template>

	<div class="waiting-login-container" ref="main"></div>

</template>

<style lang="less" scoped>
.waiting-login-container {
	width: 100%;
	height: 100%;
}
</style>