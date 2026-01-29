<script setup lang="ts"></script>

<template>
  <section class="relative overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0 hero-gradient"></div>

    <!-- Dots overlay -->
    <div class="absolute inset-0 hero-dots opacity-40"></div>

    <!-- Content slot -->
    <div class="relative z-10 py-20 lg:py-32">
      <slot />
    </div>

    <!-- Bottom wave -->
    <div class="absolute bottom-0 inset-x-0">
      <svg viewBox="50 0 800 70" preserveAspectRatio="none">
        <path
          d="M0,40 C240,100 480,0 720,20 960,40 1200,80 1440,60 L1440,120 L0,120 Z"
          fill="var(--background)"
        />
      </svg>

      <!-- <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full"
      >
        <path
          d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
          fill="var(--background)"
        />
      </svg> -->
    </div>
  </section>
</template>

<style scoped>
.hero-gradient {
  background:
    radial-gradient(
      circle at top right,
      rgba(255, 255, 255, 0.08),
      transparent 40%
    ),
    linear-gradient(
      180deg,
      var(--primary-dark) 0%,
      var(--primary-dark) 50%,
      var(--primary-dark) 100%
    );
}

.hero-dots {
  background-image: radial-gradient(
    rgba(255, 255, 255, 0.15) 2px,
    transparent 2px
  );
  background-size: 50px 50px;

  /* 🔒 Makes dots fixed relative to viewport */
  background-attachment: fixed;
}
</style>
