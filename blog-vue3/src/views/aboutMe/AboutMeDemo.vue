<template>
  <div class="relative h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
    <!-- HUD（你不想要可以删） -->
    <div class="hud">
      <div><b>mode</b>: {{ mode }}</div>
      <div><b>x</b>: {{ x.toFixed(3) }}</div>
      <div><b>step</b>: {{ stepState.index }} / {{ stepState.max }}</div>
      <div><b>transition</b>: {{ transitionProgress.toFixed(3) }}</div>
      <div><b>inner</b>: {{ innerProgress.toFixed(3) }}</div>
      <div class="mt-2 opacity-80">
        Wheel：step / move / inner<br />
        Shift+Wheel：强制 MOVE（跳过 lock/step 限制）<br />
        Esc：退出 inner lock
      </div>
    </div>

    <!-- 外层 track：只负责 X 位移（MOVE 模式） -->
    <div class="track" :style="{ transform: `translate3d(${trackPx}px,0,0)` }">
      <div class="panel">
        <div class="frame">
          <div class="label">Section 0 placeholder</div>
        </div>
      </div>
      <div class="panel">
        <div class="frame">
          <div class="label">Section 1 placeholder</div>
        </div>
      </div>
    </div>

    <!-- 真正可视层：同时渲染两个 section，通过权重做 enter/leave（不靠 IntersectionObserver） -->
    <div class="absolute inset-0 pointer-events-none">
      <!-- Section 0 -->
      <SectionTimePPT :w="w0" :phase="s0Phase" :stepIndex="stepState.index" :stepMax="stepState.max" />

      <!-- Section 1 -->
      <SectionGlassExplore :w="w1" :phase="s1Phase" :inner="innerProgress" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from "vue"

/**
 * ✅ 你要的“能跑 demo”：一个 chapter，两段 section
 * - Section0：PPT stepper（滚轮一格格 reveal/hide）
 * - step 完成后允许 MOVE：外层 x 推进
 * - 在指定 x 区间触发 transition：s0 leave / s1 enter（两者可同时存在）
 * - Section1 在指定 x 达到 lock 点后接管：停止外层 x，把 delta 喂给 innerProgress（这里用玻璃 blur 演示）
 *
 * ✅ 你要的“触发时机可设置 / 可传函数”
 * - trigger 既可以用数值配置，也可以换成函数（见 config）
 */

// -------------------- 可配置区（你只需要改这里） --------------------
const config = {
  // 外层 x 范围：0 表示 section0，1 表示 section1
  xMin: 0,
  xMax: 1,

  // stepper：滚轮阈值（离散一格一格）
  stepWheelThreshold: 80,

  // Section0：总步数（PPT）
  stepMax: 6,

  // 什么时候允许从 stepper 进入 MOVE（默认：步数到顶）
  canMoveFromStep: (stepIndex: number, stepMax: number) => stepIndex >= stepMax,

  // transition 区间（s0 leave / s1 enter 的 overlap）
  // 你要“时机位置可以设置”：改这里就行
  transitionStartX: 0.62,
  transitionEndX: 0.82,

  // Section1 进入后：什么时候 lock 接管（停止外层 x，delta 喂 inner）
  lockAtX: 0.9,

  // inner 动画的推进速度（delta -> innerProgress）
  innerSpeed: 0.0022,

  // inner 完成后是否自动释放（这里只有两段，释放也没地方去；先留着可扩展）
  autoUnlockWhenInnerDone: true,
}
// -------------------------------------------------------------------

// -------------------- 状态机 --------------------
type Mode = "STEP" | "MOVE" | "INNER_LOCK"
const mode = ref<Mode>("STEP")

// 外层 x：0..1
const x = ref(0)

// Section0 stepper 状态
const stepState = reactive({
  index: 0,
  max: config.stepMax,
})

// 用于离散 step 的 wheel 累积
let wheelAccum = 0

// Section1 inner 进度（0..1）
const innerProgress = ref(0)

// transition 进度（0..1）
const transitionProgress = computed(() => {
  const a = config.transitionStartX
  const b = config.transitionEndX
  if (x.value <= a) return 0
  if (x.value >= b) return 1
  return (x.value - a) / (b - a)
})

// 两个 section 的权重（同时渲染）
const w1 = computed(() => transitionProgress.value) // section1 enter
const w0 = computed(() => 1 - transitionProgress.value) // section0 leave

// 视觉 phase：给组件更明确的状态（便于你写离场/入场动画）
const s0Phase = computed(() => {
  if (transitionProgress.value <= 0) return "ACTIVE" // 正常
  if (transitionProgress.value >= 1) return "HIDDEN" // 已离场
  return "LEAVING" // 离场中
})
const s1Phase = computed(() => {
  if (transitionProgress.value <= 0) return "HIDDEN"
  if (transitionProgress.value >= 1) return mode.value === "INNER_LOCK" ? "LOCKED" : "ACTIVE"
  return "ENTERING"
})

// 外层 track 像素位移：简单把 x 映射为 0..-1 * viewport
const trackPx = computed(() => -(x.value * window.innerWidth))

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v))
}

// -------------------- 输入处理 --------------------
function stepperConsume(deltaY: number) {
  wheelAccum += deltaY

  const TH = config.stepWheelThreshold
  // 一次可能跨多个阈值（快速滚动）
  while (wheelAccum >= TH) {
    wheelAccum -= TH
    stepState.index = Math.min(stepState.max, stepState.index + 1)
  }
  while (wheelAccum <= -TH) {
    wheelAccum += TH
    stepState.index = Math.max(0, stepState.index - 1)
  }

  // step 完成后，进入 MOVE
  if (config.canMoveFromStep(stepState.index, stepState.max)) {
    mode.value = "MOVE"
  }
}

function moveConsume(deltaY: number) {
  // MOVE：推进外层 x
  x.value = clamp(x.value + deltaY * 0.0018, config.xMin, config.xMax)

  // 到达 lock 点：进入 INNER_LOCK（section1 接管输入）
  if (x.value >= config.lockAtX && transitionProgress.value >= 1) {
    mode.value = "INNER_LOCK"
    // 把 x 锁在 lock 点（你要求“接管 x 轴变化”：外层停掉）
    x.value = config.lockAtX
  }
}

function innerConsume(deltaY: number) {
  // INNER_LOCK：外层 x 不动，delta 喂 innerProgress
  innerProgress.value = clamp(innerProgress.value + deltaY * config.innerSpeed, 0, 1)

  // demo：inner 到头后自动释放（可选）
  if (config.autoUnlockWhenInnerDone && innerProgress.value >= 1 && deltaY > 0) {
    // 这章只有两段，所以释放后你可以继续扩展到 xMax>1 才有意义
    mode.value = "MOVE"
  }

  // 允许反向退出 lock（往回滚）
  if (innerProgress.value <= 0 && deltaY < 0) {
    mode.value = "MOVE"
  }
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  const deltaY = e.deltaY
  const forceMove = e.shiftKey

  if (forceMove) {
    // 强制 MOVE：便于调试位置/过渡
    mode.value = "MOVE"
    moveConsume(deltaY)
    return
  }

  if (mode.value === "STEP") {
    stepperConsume(deltaY)
    return
  }

  if (mode.value === "MOVE") {
    moveConsume(deltaY)
    return
  }

  if (mode.value === "INNER_LOCK") {
    innerConsume(deltaY)
    return
  }
}

function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") {
    // Esc：退出 inner lock
    if (mode.value === "INNER_LOCK") mode.value = "MOVE"
  }
}

onMounted(() => {
  window.addEventListener("wheel", onWheel, { passive: false })
  window.addEventListener("keydown", onKey)
})

onUnmounted(() => {
  window.removeEventListener("wheel", onWheel as any)
  window.removeEventListener("keydown", onKey as any)
})

// -------------------- Section components（写在同文件里，便于你直接跑） --------------------
/**
 * 你可以把这两个 section 拆出去成独立文件，
 * 它们只依赖：w（enter/leave 权重）、phase（状态）、以及各自的局部数据（step/inner）
 */

const SectionTimePPT = {
  props: {
    w: { type: Number, required: true }, // 1->0：离场权重
    phase: { type: String, required: true }, // ACTIVE / LEAVING / HIDDEN
    stepIndex: { type: Number, required: true },
    stepMax: { type: Number, required: true },
  },
  template: `
    <div class="sec sec0" :data-phase="phase" :style="{ opacity: 0.08 + 0.92*w }">
      <div class="secFrame">
        <div class="title">
          <div class="kicker">Time</div>
          <div class="h">Timeline / PPT</div>
          <div class="sub">Wheel reveals steps, finish to unlock MOVE.</div>
        </div>

        <div class="steps">
          <div v-for="i in stepMax" :key="i" class="step" :class="{ on: stepIndex >= i }">
            <div class="dot"></div>
            <div class="content">
              <div class="t">Year {{ 2018 + i }}</div>
              <div class="d">Some story / milestone...</div>
            </div>
          </div>
        </div>

        <div class="footer">
          step: <b>{{ stepIndex }}</b> / {{ stepMax }}
        </div>
      </div>
    </div>
  `,
}

const SectionGlassExplore = {
  props: {
    w: { type: Number, required: true }, // 0->1：入场权重
    phase: { type: String, required: true }, // ENTERING / ACTIVE / LOCKED / HIDDEN
    inner: { type: Number, required: true }, // innerProgress 0..1
  },
  template: `
    <div class="sec sec1" :data-phase="phase" :style="{ opacity: 0.06 + 0.94*w }">
      <div class="secFrame glass"
           :style="{
             backdropFilter: 'blur(' + (8 + inner*16) + 'px)',
             WebkitBackdropFilter: 'blur(' + (8 + inner*16) + 'px)',
             transform: 'translate3d(' + ((1-w)*40) + 'px,' + ((1-w)*10) + 'px,0) scale(' + (0.96 + 0.04*w) + ')',
           }"
      >
        <div class="title">
          <div class="kicker">Explore</div>
          <div class="h">Glass / Continuous Inner</div>
          <div class="sub">
            When locked, wheel feeds <b>inner</b> (blur/opacity demo).
          </div>
        </div>

        <div class="meter">
          <div class="bar" :style="{ width: (inner*100).toFixed(1) + '%' }"></div>
        </div>

        <div class="hint">
          inner = {{ inner.toFixed(3) }}
        </div>
      </div>
    </div>
  `,
}
</script>

<style lang="less" scoped>
.hud {
  position: fixed;
  left: 12px;
  top: 12px;
  z-index: 30;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(10, 12, 18, 0.55);
  backdrop-filter: blur(10px);
  font-size: 12px;
  line-height: 1.35;
}

.track {
  position: absolute;
  inset: 0;
  display: flex;
  will-change: transform;
  transition: transform 120ms linear;

  .panel {
    width: 100vw;
    height: 100vh;
    flex: 0 0 100vw;
    display: grid;
    place-items: center;

    .frame {
      width: min(920px, 92vw);
      height: min(560px, 74vh);
      border-radius: 26px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.03);
      box-shadow: 0 22px 60px rgba(0, 0, 0, 0.45);
      position: relative;
      overflow: hidden;

      .label {
        position: absolute;
        left: 18px;
        top: 14px;
        opacity: 0.6;
        font-size: 12px;
      }
    }
  }
}

/* Overlay sections: real visuals */
.sec {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: grid;
  place-items: center;

  .secFrame {
    width: min(920px, 92vw);
    height: min(560px, 74vh);
    border-radius: 26px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
    position: relative;
    overflow: hidden;
    transition:
      transform 220ms ease,
      opacity 220ms ease;
  }

  .title {
    position: absolute;
    left: 22px;
    top: 18px;

    .kicker {
      opacity: 0.65;
      font-size: 12px;
      letter-spacing: 0.08em;
    }
    .h {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.02em;
      margin-top: 2px;
    }
    .sub {
      opacity: 0.75;
      font-size: 12px;
      margin-top: 6px;
    }
  }
}

/* Section0: Time PPT */
.sec0 {
  .secFrame {
    background:
      radial-gradient(circle at 25% 25%, rgba(167, 139, 250, 0.22), transparent 55%), radial-gradient(circle at 70% 60%, rgba(56, 189, 248, 0.18), transparent 55%), rgba(255, 255, 255, 0.04);
  }

  .steps {
    position: absolute;
    left: 22px;
    right: 22px;
    top: 120px;
    bottom: 64px;
    display: grid;
    gap: 12px;
  }

  .step {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 12px 14px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(12, 14, 20, 0.28);
    opacity: 0.35;
    transform: translate3d(0, 10px, 0);
    transition:
      opacity 180ms ease,
      transform 180ms ease;

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: rgba(148, 163, 184, 0.55);
      box-shadow: 0 0 0 6px rgba(148, 163, 184, 0.1);
    }

    .t {
      font-weight: 650;
    }
    .d {
      opacity: 0.8;
      font-size: 12px;
      margin-top: 2px;
    }
  }

  .step.on {
    opacity: 1;
    transform: translate3d(0, 0, 0);

    .dot {
      background: rgba(56, 189, 248, 0.95);
      box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.14);
    }
  }

  .footer {
    position: absolute;
    left: 22px;
    bottom: 18px;
    opacity: 0.75;
    font-size: 12px;
  }

  /* 离场动画：只靠 phase + opacity/transform，简单但可扩展 */
  &[data-phase="LEAVING"] .secFrame {
    transform: translate3d(-30px, 0, 0) scale(0.985);
  }
  &[data-phase="HIDDEN"] {
    opacity: 0 !important;
  }
}

/* Section1: Glass Explore */
.sec1 {
  .secFrame {
    background: radial-gradient(circle at 35% 35%, rgba(250, 204, 21, 0.18), transparent 55%), radial-gradient(circle at 70% 70%, rgba(99, 102, 241, 0.2), transparent 55%), rgba(255, 255, 255, 0.03);
  }

  .glass {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.14);
  }

  .meter {
    position: absolute;
    left: 22px;
    right: 22px;
    bottom: 26px;
    height: 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    overflow: hidden;

    .bar {
      height: 100%;
      border-radius: 999px;
      background: rgba(56, 189, 248, 0.85);
      box-shadow: 0 0 20px rgba(56, 189, 248, 0.35);
      transition: width 80ms linear;
    }
  }

  .hint {
    position: absolute;
    right: 22px;
    bottom: 44px;
    font-size: 12px;
    opacity: 0.75;
  }

  &[data-phase="ENTERING"] .secFrame {
    transform: translate3d(20px, 12px, 0) scale(0.985);
  }
  &[data-phase="HIDDEN"] {
    opacity: 0 !important;
  }
}
</style>
