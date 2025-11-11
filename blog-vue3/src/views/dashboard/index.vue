<script setup lang="ts">
import { ref, } from 'vue'
import { ElInput } from "element-plus"
defineOptions({
	name: "Dashboard"
})

const value = ref('')

</script>

<template>
	<div>
		<div class="flex">
			<span>keepAlived</span>
			<el-input v-model="value" />
		</div>
	</div>
</template>

<style lang="less" scoped></style>
