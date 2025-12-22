<script setup lang="ts">
// import Aside from "@/components/Aside/index.vue"
import NavieMenu from "@/components/Aside/NavieMenu.vue"
import NavBar from "@/components/NavBar/index.vue"
import PanelContainer from "@/components/PanelContainer/index.vue"
import TagViews from "@/components/TagViews/index.vue"
import { useRouteStore, useTagViewStore } from "@/store"
import { usePageHostStore } from "@/store/pageHost"
import { storeToRefs } from "pinia"
import { onBeforeUnmount, onMounted, onUnmounted, watchEffect } from "vue"

const { currentRoute } = useRouteStore()
const { hostRef } = storeToRefs(usePageHostStore())
const { allCachedTags } = storeToRefs(useTagViewStore())
watchEffect(() => {
	console.log(currentRoute.name, currentRoute.meta!.keepAlive, allCachedTags.value)
})

const mouseMove = (e: MouseEvent) => {
	const x = e.clientX / window.innerWidth - 0.5
	const y = e.clientY / window.innerHeight - 0.5
	document.documentElement.style.setProperty("--px", x.toFixed(4))
	document.documentElement.style.setProperty("--py", y.toFixed(4))
}
onMounted(() => {
	window.addEventListener("pointermove", mouseMove)
})
onBeforeUnmount(() => {
	window.removeEventListener("pointermove", mouseMove)
})
</script>

<template>
	<PanelContainer class="layout">
		<template v-slot:left>
			<!-- <Aside></Aside> -->
			<NavieMenu />
		</template>
		<template v-slot:centerLine1>
			<NavBar></NavBar>
		</template>
		<template v-slot:centerLine2>
			<TagViews></TagViews>
		</template>
		<div role="page-host" class="size-full overflow-auto relative p-6  min-h-0" ref="hostRef">

			<RouterView #="{ Component }">
				<KeepAlive :include="allCachedTags">
					<component :is="Component" :key="currentRoute.name" />
				</KeepAlive>
			</RouterView>
			<div role="ambient-glow"></div>
		</div>
	</PanelContainer>
</template>

<style lang="less" scoped>
[role="page-host"] {
	background-color: color-mix(in srgb, var(--surface-0) 95%, var(--surface-1));


	@keyframes bg-breathe {

		0%,
		100% {
			opacity: 1
		}

		50% {
			opacity: 0.96;
		}
	}

	animation: bg-breathe 8s ease-in-out infinite;

}

[role="ambient-glow"] {



	@keyframes glow-drift {
		0% {
			transform: translate(0, 0);
		}

		50% {
			transform: translate(-6%, -4%);
		}

		100% {
			transform: translate(0, 0);
		}
	}


	position: absolute;
	inset: 0;
	pointer-events: none;
	z-index: 0;

	background: radial-gradient(40% 40% at 30% 20%,
		rgba(125, 211, 252, 0.12),
		transparent 70%),
	radial-gradient(45% 45% at 70% 80%,
		rgba(167, 139, 250, 0.10),
		transparent 75%);

	filter: blur(80px);
	animation: glow-drift 10s ease-in-out infinite;

	transform: translate(calc(var(--px, 0) * 20px),
		calc(var(--py, 0) * 20px));
	transition: transform 0.2s ease-out;
}
</style>
