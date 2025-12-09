<script setup lang="ts">
// import Lenis from "lenis"
import { computed, ref } from "vue"

const a = ref(0)
const b = computed(() => a.value * 2)
a.value = 1

// onMounted(() => {
//   const lenis = new Lenis({
//     wrapper: document.querySelector(".wrapper")!,
//     content: document.querySelector(".content")!,

//     eventsTarget: document.querySelector(".wrapper")!,
//     smoothWheel: true,

//     lerp: 0.1,
//   })

//   function raf(t: any) {
//     lenis.raf(t)
//     requestAnimationFrame(raf)
//   }
//   requestAnimationFrame(raf)
//   lenis.on("scroll", ({ scroll, limit }) => {
//     document.querySelectorAll(".block").forEach((el, i) => {
//       const pos = el.offsetTop
//       const dist = scroll - pos

//       // 简化版：进入视口时做动画
//       el.style.transform = `translateY(${dist * 0.1}px)` // parallax 效果
//     })
//   })
// })
</script>

<template>
  <div class="layout h-200"></div>
  <div class="layout">
    <article class="content">
      <h2 id="s1">Section 1</h2>
      <p>内容......</p>
      <h2 id="s2">Section 2</h2>
      <p>内容......</p>
      <h2 id="s3">Section 3</h2>
      <p>内容......</p>
    </article>

    <aside class="toc">
      <ul>
        <li><a href="#s1">Section 1</a></li>
        <li><a href="#s2">Section 2</a></li>
        <li><a href="#s3">Section 3</a></li>
      </ul>
    </aside>
  </div>
  <div class="layout h-200"></div>

  <!-- <div class="wrapper">
    <div class="content">
      <section class="block red"></section>
      <section class="block blue"></section>
      <section class="block yellow"></section>
      <section class="block green"></section>
    </div>
  </div> -->
</template>

<style lang="less" scoped>
.wrapper {
  height: 100%;
  overflow: hidden; /* ✔ Lenis 控制 scrollTop，不允许原生滚动 */
}

.content {
  position: relative;
}

.block {
  height: 100vh;
}

.red {
  background: red;
}
.blue {
  background: blue;
}
.yellow {
  background: yellow;
}
.green {
  background: green;
}
.layout {
  display: flex;
  max-width: 1200px;
  margin: auto;
}

.content {
  flex: 1;
  padding-right: 40px;
  p {
    height: 500px;
  }
}

.toc {
  width: 220px;
  position: sticky;
  top: 20px; /* 吸顶的位置 */
  height: max-content; /* 防止被压缩 */
}
// .layout,
// .content {
//   overflow: visible; /* 不能用 hidden/auto/scroll 否则 sticky 会失效 */
// }
</style>
