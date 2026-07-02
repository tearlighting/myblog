<script setup lang="ts"></script>

<template>
  <section role="about-introduce" class="relative h-full min-h-screen w-full overflow-hidden px-12 py-10 text-text">
    <div role="about-grid" class="absolute inset-0"></div>
    <div role="about-scan" class="absolute inset-0"></div>
    <div role="about-light" class="absolute inset-0"></div>

    <div role="about-fragment" class="fragment-a"></div>
    <div role="about-fragment" class="fragment-b"></div>
    <div role="about-fragment" class="fragment-c"></div>

    <div class="relative z-10 flex h-full min-h-[calc(100vh-5rem)] flex-col justify-between">
      <div class="flex justify-between text-xs uppercase tracking-[0.22em] text-muted">
        <span>About / archive 00</span>
        <span>Tokyo / Japan</span>
      </div>

      <div class="max-w-5xl translate-y-4">
        <p class="w-fit border-b border-[color-mix(in_srgb,var(--divider)_70%,transparent)] pb-3 text-sm tracking-[0.28em] text-muted">BEGIN HERE</p>
        <h1 class="mt-8 max-w-4xl text-6xl font-semibold leading-[1.05] text-text">Notes from a frontend life, kept in a quiet corner.</h1>
        <p class="mt-7 max-w-2xl text-lg leading-8 text-muted">
          I live in Japan, write Vue and TypeScript, keep a blog, and leave small experiments in a playground when an idea will not sit still.
        </p>
      </div>

      <div class="grid grid-cols-[1fr_320px] items-end gap-12">
        <p class="max-w-xl text-sm leading-7 text-muted">
          This is not a resume first. It starts with the things I actually return to: frontend details, rough drafts, saved traces, and the work of making a page feel considered.
        </p>
        <div role="about-coordinate" class="text-right text-xs uppercase tracking-[0.18em] text-muted">
          <p>frontend / vue</p>
          <p class="mt-2">typescript / blog</p>
          <p class="mt-2">playground / archive</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped>
[role="about-introduce"] {
  isolation: isolate;
  background:
    radial-gradient(48% 42% at 28% 38%, color-mix(in srgb, var(--color-primary) 13%, transparent), transparent 72%),
    radial-gradient(34% 40% at 78% 18%, color-mix(in srgb, var(--color-accent) 9%, transparent), transparent 75%),
    radial-gradient(52% 48% at 72% 82%, color-mix(in srgb, var(--color-secondary) 10%, transparent), transparent 74%),
    linear-gradient(180deg, color-mix(in srgb, var(--surface-0) 96%, black), var(--surface-0));

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 4;
    pointer-events: none;
    background: radial-gradient(circle at 45% 48%, transparent 0 46%, color-mix(in srgb, black 18%, transparent) 100%);
  }
}

[role="about-grid"] {
  z-index: 0;
  background-image:
    linear-gradient(to right, color-mix(in srgb, var(--divider) 14%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--divider) 10%, transparent) 1px, transparent 1px);
  background-size: 76px 76px;
  mask-image: radial-gradient(ellipse at 42% 48%, black 0 42%, transparent 78%);
  transform: perspective(1200px) rotateX(58deg) translateY(-20%) scale(1.35);
  transform-origin: center;
}

[role="about-scan"] {
  z-index: 2;
  opacity: 0.42;
  background:
    linear-gradient(to bottom, transparent 0 94%, color-mix(in srgb, var(--color-text) 10%, transparent) 95%, transparent 100%),
    linear-gradient(100deg, transparent 0 34%, color-mix(in srgb, white 7%, transparent) 48%, transparent 62%);
  background-size:
    100% 7px,
    180% 100%;
  transform: translateX(-6%);
  animation: scan-pan 12s ease-in-out infinite alternate;
}

[role="about-light"] {
  z-index: 1;
  background:
    linear-gradient(110deg, transparent 0 18%, color-mix(in srgb, var(--color-primary) 10%, transparent) 36%, transparent 54%),
    radial-gradient(28% 36% at 18% 72%, color-mix(in srgb, white 8%, transparent), transparent 72%);
  filter: blur(18px);
  opacity: 0.9;
  animation: light-breathe 9s ease-in-out infinite;
}

[role="about-fragment"] {
  position: absolute;
  z-index: 3;
  pointer-events: none;
  border: 1px solid color-mix(in srgb, var(--divider) 60%, transparent);
  background: color-mix(in srgb, var(--surface-1) 34%, transparent);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--color-primary) 8%, transparent) inset,
    0 18px 60px color-mix(in srgb, black 22%, transparent);
  backdrop-filter: blur(8px);
  animation: fragment-drift 11s ease-in-out infinite alternate;
}

.fragment-a {
  left: 58%;
  top: 18%;
  width: 180px;
  height: 92px;
  transform: rotate(-8deg);
}

.fragment-b {
  right: 12%;
  bottom: 28%;
  width: 96px;
  height: 160px;
  transform: rotate(11deg);
  opacity: 0.72;
  animation-delay: -3s;
}

.fragment-c {
  left: 12%;
  bottom: 18%;
  width: 128px;
  height: 74px;
  transform: rotate(6deg);
  opacity: 0.52;
  animation-delay: -6s;
}

@keyframes scan-pan {
  from {
    background-position:
      0 0,
      0 0;
    transform: translateX(-7%);
  }

  to {
    background-position:
      0 18px,
      26% 0;
    transform: translateX(2%);
  }
}

@keyframes light-breathe {
  0%,
  100% {
    opacity: 0.72;
    transform: translate3d(-1.5%, 0, 0) scale(1);
  }

  50% {
    opacity: 0.95;
    transform: translate3d(1.5%, -1%, 0) scale(1.03);
  }
}

@keyframes fragment-drift {
  from {
    margin-top: 0;
  }

  to {
    margin-top: -10px;
  }
}
</style>
