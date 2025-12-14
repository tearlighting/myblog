<script setup lang="ts">
import PageLoader from "@/components/PageLoader/index.vue"
import LumiSection from "./components/LumiSection.vue"
import { initializer } from "./initializer"
import { useHomeStore } from "./store"
import { onMounted, ref, } from 'vue'


defineOptions({
	name: "test",
})


const {
	bannerStore: { banners },
} = useHomeStore()


</script>

<template>
	<PageLoader :use-store="useHomeStore" :initializer="initializer">
		<!-- <div class="flex justify-center items-center fixed top-100 right-10">
			<Button @click="scrollTop">top</Button>
			<Button @click="scrollBottom">bottom</Button>
		</div> -->
		<div role="home-container" class="h-full">
			<LumiSection :slides="banners" />
		</div>
	</PageLoader>
</template>

<style lang="less" scoped></style>
