<template>
  <div id="app">
    <router-view></router-view>
    <ToTop />
  </div>
</template>
<script lang="ts">
import ToTop from "@/components/toTop/index.vue"
import Vue from "vue"
export default Vue.extend({
  components: {
    ToTop,
  },
})
</script>

<style lang="less" scoped></style>
